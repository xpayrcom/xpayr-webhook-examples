import os
from http.server import BaseHTTPRequestHandler, HTTPServer

from webhook import construct_xpayr_event


class Handler(BaseHTTPRequestHandler):
    processed_event_ids = set()  # Replace with a durable UNIQUE database constraint.

    def do_POST(self):
        if self.path != "/webhooks/xpayr":
            self.send_error(404)
            return
        raw_body = self.rfile.read(int(self.headers.get("Content-Length", "0")))
        try:
            event = construct_xpayr_event(
                raw_body,
                self.headers.get("X-XPayr-Signature", ""),
                os.environ["XPAYR_WEBHOOK_SECRET"],
            )
            event_id = event.get("id")
            if not isinstance(event_id, str) or not event_id:
                raise ValueError("Event ID is required")
            self.processed_event_ids.add(event_id)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"received":true}')
        except (KeyError, ValueError) as error:
            self.send_error(400, str(error))


if __name__ == "__main__":
    HTTPServer(("127.0.0.1", int(os.getenv("PORT", "3000"))), Handler).serve_forever()
