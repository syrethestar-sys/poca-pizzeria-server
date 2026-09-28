import { Wire } from "@buildry-wire/wire";

export const wire = new Wire(process.env.WIRE_API_KEY);

// Wire's docs say "minor units" (50000 = 500.00₮), but its live checkout
// and QPay invoice read the number as whole tögrög: an 8,000₮ order sent as
// 800000 was shown and invoiced as 800,000₮ (tested 2026-09-28). So the
// amount goes over exactly as the menu prices it.
export const toMinorUnits = (amount) => Math.round(amount);

// Hosted checkout (pay.wire.mn) shows every payment option the account has
// switched on — QPay QR, bank apps — so the site never renders a QR itself.
// The SDK has no helper for checkout sessions yet, so this calls its client.
// Do NOT confirm the intent first: Wire rejects a session on a confirmed one.
export const createCheckoutSession = async (paymentIntentId, { successUrl, cancelUrl, idempotencyKey } = {}) => {
  const body = { payment_intent: paymentIntentId };
  // Wire only accepts https return addresses; on localhost the hosted page
  // shows its own "paid" screen instead.
  if (successUrl?.startsWith("https://")) body.success_url = successUrl;
  if (cancelUrl?.startsWith("https://")) body.cancel_url = cancelUrl;

  // Same client the SDK resources use: auth header, retries, WireError.
  const session = await wire.request("POST", "/v1/checkout/sessions", { body, idempotencyKey });
  if (!session?.url) throw new Error("Wire returned a checkout session without a url");
  return session;
};

// Optional: WIRE_OPERATORS=qpay,socialpay limits which operators are offered.
// Left empty, Wire picks from everything the account has activated.
export const operatorParams = () => {
  const operators = (process.env.WIRE_OPERATORS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return operators.length ? { allowed_operators: operators } : { automatic_operator: true };
};
