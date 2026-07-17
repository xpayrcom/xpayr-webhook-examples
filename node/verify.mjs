import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyXPayrSignature(rawBody, signatureHeader, secret) {
  if (!secret) throw new TypeError("Webhook secret is required");
  const signature = String(signatureHeader ?? "").trim().toLowerCase().replace(/^sha256=/, "");
  if (!/^[a-f0-9]{64}$/.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export function constructXPayrEvent(rawBody, signatureHeader, secret) {
  if (!verifyXPayrSignature(rawBody, signatureHeader, secret)) {
    throw new Error("Invalid XPayr webhook signature");
  }
  return JSON.parse(Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody);
}
