import base64
from nacl import public
import json, sys

keypair = public.PrivateKey.generate()
priv = base64.b64encode(bytes(keypair)).decode()
pub = base64.b64encode(bytes(keypair.public_key)).decode()

out = {"private": priv, "public": pub}

fn = sys.argv[1] if len(sys.argv) > 1 else "keys.json"
with open(fn, "w") as f:
    json.dump(out, f)
print(f"Keys saved to {fn}")
