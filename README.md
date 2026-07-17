# XPayr Webhook Examples

[![CI](https://github.com/xpayrcom/xpayr-webhook-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/xpayrcom/xpayr-webhook-examples/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](LICENSE)

Secure webhook verification examples for XPayr, including raw-body HMAC validation, idempotency, retries, and durable processing patterns.

> **Status:** Public reference implementation

## Purpose

Help backend teams process XPayr events safely across common server runtimes.

## Included

- Node.js, PHP, and Python verification examples
- Shared deterministic signature fixtures
- Idempotent event-processing guidance

## Quick start

```bash
npm install
npm test
```

## Processing contract

1. Read the HTTP request body as untouched bytes. Do not parse or re-serialize it first.
2. Verify `X-XPayr-Signature` with HMAC-SHA256 and your webhook secret.
3. Require a stable event ID and enforce uniqueness in durable storage.
4. Persist the event and the payment-state transition in one transaction.
5. Return `2xx` only after durable processing; retries must produce the same result.

Runnable handlers are available under [`node/`](node), [`php/`](php), and [`python/`](python). The shared fixture ensures all runtimes implement the same signature contract.

Use an XPayr test key before live credentials. Never expose `sk_test_*`, `sk_live_*`, agent keys, webhook secrets, or wallet private keys in browser code or commits.

## Documentation

- [Developer Hub](https://xpayr.com/developers)
- [Merchant API documentation](https://xpayr.com/doc-api)
- [Testnet checkout guide](https://xpayr.com/developers/testnet-checkout-api)
- [Webhook signature guide](https://xpayr.com/developers/webhook-signature-guide)

## Security

Read [SECURITY.md](SECURITY.md) before reporting a vulnerability. Payment completion must be based on verified XPayr webhook/API state and canonical on-chain evidence, not browser callbacks alone.

## License

MIT. See [LICENSE](LICENSE).
