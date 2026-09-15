import { SIGNATURE_HEADER } from "@buildry-wire/wire";
import { wire } from "../../lib/wire.js";
import { Order } from "../../schemas/order.js";

const PAID_EVENT = "payment_intent.succeeded";
const FAILED_EVENTS = ["payment_intent.payment_failed", "payment_intent.canceled"];

export const wireWebhookController = async (request, response) => {
  // Anything thrown here — missing header, malformed header, bad signature,
  // stale timestamp — means the request isn't a verified Wire event.
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

  try {
    const intent = event.data?.object ?? event.data;
    const orderId = intent?.metadata?.orderId;

    if (orderId && event.type === PAID_EVENT) {
      await Order.findByIdAndUpdate(orderId, { "payment.status": "paid" });
    } else if (orderId && FAILED_EVENTS.includes(event.type)) {
      await Order.findByIdAndUpdate(orderId, { "payment.status": "failed" });
    }

    response.status(200).json({ received: true });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err.message ?? err });
  }
};
