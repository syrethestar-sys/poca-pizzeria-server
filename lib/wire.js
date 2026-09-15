import { Wire } from "@buildry-wire/wire";

export const wire = new Wire(process.env.WIRE_API_KEY);

// Wire expects minor units for every currency, including MNT, which has no
// subunit in everyday use — so 500 tögrög must be sent as 50000.
export const toMinorUnits = (amount) => Math.round(amount * 100);
