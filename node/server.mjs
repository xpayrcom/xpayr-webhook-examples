import { createServer } from "node:http";
import { constructXPayrEvent } from "./verify.mjs";

const secret = process.env.XPAYR_WEBHOOK_SECRET;
if (!secret) throw new Error("XPAYR_WEBHOOK_SECRET is required");

// Replace this in-memory set with a database unique constraint on event ID.
const processedEventIds = new Set();

createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/webhooks/xpayr") {
    response.writeHead(404).end("Not found");
    return;
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);

  try {
    const event = constructXPayrEvent(rawBody, request.headers["x-xpayr-signature"], secret);
    if (!event.id || typeof event.id !== "string") throw new Error("Event ID is required");

    if (!processedEventIds.has(event.id)) {
      // Persist the event and the payment state in one durable transaction here.
      processedEventIds.add(event.id);
      console.log(JSON.stringify({ processed: event.id, type: event.type }));
    }
    response.writeHead(200, { "content-type": "application/json" }).end('{"received":true}');
  } catch (error) {
    response.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ error: error.message }));
  }
}).listen(Number(process.env.PORT || 3000), () => {
  console.log(`XPayr webhook example listening on http://localhost:${process.env.PORT || 3000}`);
});
