// Mongolian numbers are 8 digits. Mobiles start 8/9/6 (e.g. 9104 5666),
// Ulaanbaatar landlines 7 (7777 1088), newer ranges 5. "+976" / "976" and
// spaces or dashes are accepted and stripped.
export const normalizeMnPhone = (value) => {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("976")) digits = digits.slice(3);
  return /^[5-9]\d{7}$/.test(digits) ? digits : null;
};
