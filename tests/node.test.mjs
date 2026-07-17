import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { constructXPayrEvent, verifyXPayrSignature } from "../node/verify.mjs";

const fixture = JSON.parse(await readFile(new URL("../fixtures/webhook.json", import.meta.url)));

test("verifies deterministic fixture", () => {
  assert.equal(verifyXPayrSignature(fixture.raw_body, fixture.signature, fixture.secret), true);
  assert.equal(verifyXPayrSignature(fixture.raw_body, `sha256=${fixture.signature}`, fixture.secret), true);
  assert.equal(constructXPayrEvent(fixture.raw_body, fixture.signature, fixture.secret).id, "evt_test_001");
});

test("rejects mutations and malformed signatures", () => {
  assert.equal(verifyXPayrSignature(`${fixture.raw_body} `, fixture.signature, fixture.secret), false);
  assert.equal(verifyXPayrSignature(fixture.raw_body, "not-a-signature", fixture.secret), false);
});
