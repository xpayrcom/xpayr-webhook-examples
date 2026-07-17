import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))
from webhook import verify_xpayr_signature  # noqa: E402

fixture = json.loads((ROOT / "fixtures" / "webhook.json").read_text())
assert verify_xpayr_signature(fixture["raw_body"].encode(), fixture["signature"], fixture["secret"])
assert not verify_xpayr_signature((fixture["raw_body"] + " ").encode(), fixture["signature"], fixture["secret"])
print("Python fixture OK")
