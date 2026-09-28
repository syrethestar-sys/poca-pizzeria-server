import { SIGNATURE_HEADER } from "@buildry-wire/wire";
import { wire } from "../../lib/wire.js";
import { applyIntentToOrder } from "../../lib/payments.js";
import { Order } from "../../schemas/order.js";

export const wireWebhookController = async (request, response) => {
  // Anything thrown here — missing header, malformed header, bad signature,
  // timestamp older than 5 minutes — means the request isn't from Wire.
  let event;
  try {
    event = wire.webhooks.verify(
      request.rawBody,
      request.headers[SIGNATURE_HEADER.toLowerCase()],
      process.env.WIRE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return response.status(400).json({ message: "Invalid signature" });
  }

  // The dashboard's "Баталгаажуулах" ping — a signed 2xx activates the endpoint.
  if (!event.type?.startsWith("payment_intent.")) {
    return response.status(200).json({ received: true });
  }

  try {
    const intentId = event.data?.object?.id ?? event.data?.id;
    const order = intentId ? await Order.findOne({ "payment.intentId": intentId }) : null;
    if (!order) {
      // Not ours (or already removed) — acknowledge so Wire stops retrying.
      return response.status(200).json({ received: true });
    }

    // Wire may deliver the same event more than once, and the payload is only
    // a notification: re-read the intent from the API and apply that.
    const intent = await wire.paymentIntents.retrieve(intentId);
    await applyIntentToOrder(order, intent);

    response.status(200).json({ received: true });
  } catch (err) {
    console.error("[wire] webhook handling failed:", err.message ?? err);
    // Non-2xx so Wire delivers it again later.
    response.status(500).json({ message: "Could not process the event" });
  }
};
