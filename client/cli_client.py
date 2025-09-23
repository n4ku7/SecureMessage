import requests, json, base64
from nacl import public, utils, encoding

# Simple CLI client for testing

def send_message(server_url, sender_sk, recipient_pk, msg):
    box = public.Box(sender_sk, recipient_pk)
    nonce = utils.random(public.Box.NONCE_SIZE)
    cipher = box.encrypt(msg.encode(), nonce).ciphertext
    packet = {
        "sender": base64.b64encode(bytes(sender_sk.public_key)).decode(),
        "nonce": base64.b64encode(nonce).decode(),
        "cipher": base64.b64encode(cipher).decode()
    }
    r = requests.post(f"{server_url}/send", json=packet)
    print(r.json())
