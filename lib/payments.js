import { wire, toMinorUnits } from "./wire.js";

const FAILED_STATUSES = new Set(["canceled", "cancelled", "failed", "expired"]);

// Applies a Payment Intent fetched from Wire's API to our order. The intent
// has to belong to this order and carry exactly the order's total before the
// order is marked paid — a webhook or redirect alone is never trusted.
export const applyIntentToOrder = async (order, intent) => {
  if (!order?.payment || !intent || intent.id !== order.payment.intentId) return order;
  if (order.payment.status === "paid") return order; // final

  let next = order.payment.status;
  if (intent.status === "succeeded") {
    const amountMatches = intent.amount === toMinorUnits(order.total);
    const currencyMatches = String(intent.currency ?? "").toUpperCase() === "MNT";
    if (!amountMatches || !currencyMatches) {
      console.error(
        `[wire] intent ${intent.id} succeeded with ${intent.amount} ${intent.currency}, ` +
          `order ${order._id} expects ${toMinorUnits(order.total)} MNT — not marking paid`,
      );
      return order;
    }
    next = "paid";
  } else if (FAILED_STATUSES.has(intent.status)) {
    next = "failed";
  }

  if (next !== order.payment.status) {
    order.payment.status = next;
    await order.save();
  }
  return order;
};

// Asks Wire for the current state of a still-pending order. Used when the
// customer comes back from checkout and when orders are listed, so a webhook
// missed while the server was asleep does not leave an order pending forever.
export const refreshPayment = async (order) => {
  if (order?.payment?.status !== "pending" || !order.payment.intentId) return order;
  if (!process.env.WIRE_API_KEY) return order;
  try {
    const intent = await wire.paymentIntents.retrieve(order.payment.intentId);
    return await applyIntentToOrder(order, intent);
  } catch (err) {
    console.error(`[wire] could not look up ${order.payment.intentId}:`, err.message);
    return order;
  }
};
