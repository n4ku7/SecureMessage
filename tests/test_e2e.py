import base64
from nacl import public, utils

def test_encrypt_decrypt():
    sk1 = public.PrivateKey.generate()
    sk2 = public.PrivateKey.generate()
    box = public.Box(sk1, sk2.public_key)
    nonce = utils.random(public.Box.NONCE_SIZE)
    msg = b"hello"
    enc = box.encrypt(msg, nonce)

    box2 = public.Box(sk2, sk1.public_key)
    dec = box2.decrypt(enc)
    assert dec == msg
