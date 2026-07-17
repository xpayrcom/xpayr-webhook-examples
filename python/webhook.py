import hashlib
import hmac
import json


def verify_xpayr_signature(raw_body: bytes, signature_header: str, secret: str) -> bool:
    if not secret:
        raise ValueError("Webhook secret is required")
    signature = (signature_header or "").strip().lower()
    if signature.startswith("sha256="):
        signature = signature[7:]
    if len(signature) != 64 or any(character not in "0123456789abcdef" for character in signature):
        return False
    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def construct_xpayr_event(raw_body: bytes, signature_header: str, secret: str) -> dict:
    if not verify_xpayr_signature(raw_body, signature_header, secret):
        raise ValueError("Invalid XPayr webhook signature")
    event = json.loads(raw_body)
    if not isinstance(event, dict):
        raise ValueError("Webhook body must be a JSON object")
    return event
