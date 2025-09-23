let myKeyPair = null;
let recipientPublicKey = null;

async function init() {
  await window.sodium.ready;
  if (!localStorage.getItem("my_private")) {
    const kp = window.sodium.crypto_box_keypair();
    myKeyPair = kp;
    localStorage.setItem("my_private", window.sodium.to_base64(kp.privateKey));
    localStorage.setItem("my_public", window.sodium.to_base64(kp.publicKey));
  } else {
    myKeyPair = {
      privateKey: window.sodium.from_base64(localStorage.getItem("my_private")),
      publicKey: window.sodium.from_base64(localStorage.getItem("my_public"))
    };
  }
  document.getElementById("myPublicKey").textContent = localStorage.getItem("my_public") || "";
}

function setRecipient() {
  const key = document.getElementById("recipientKeyInput").value.trim();
  if (!key) { alert("Enter a recipient public key"); return; }
  try {
    recipientPublicKey = window.sodium.from_base64(key);
    alert("Recipient set.");
  } catch (e) {
    alert("Invalid public key format. Expected base64.");
  }
}

async function sendMessage() {
  if (!recipientPublicKey) { alert("Set recipient public key first"); return; }
  const msg = document.getElementById("messageInput").value;
  if (!msg) { alert("Enter a message"); return; }
  const nonce = window.sodium.randombytes_buf(window.sodium.crypto_box_NONCEBYTES);
  const cipher = window.sodium.crypto_box_easy(msg, nonce, recipientPublicKey, myKeyPair.privateKey);
  const packet = {
    sender: localStorage.getItem("my_public"),
    nonce: window.sodium.to_base64(nonce),
    cipher: window.sodium.to_base64(cipher)
  };
  await fetch("/send", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(packet)});
}

function decryptMessage(senderKeyB64, nonceB64, cipherB64) {
  try {
    const senderPub = window.sodium.from_base64(senderKeyB64);
    const nonce = window.sodium.from_base64(nonceB64);
    const cipher = window.sodium.from_base64(cipherB64);
    const msg = window.sodium.crypto_box_open_easy(cipher, nonce, senderPub, myKeyPair.privateKey);
    return window.sodium.to_string(msg);
  } catch (e) {
    return "[Decryption failed]";
  }
}

async function fetchInbox() {
  const res = await fetch("/inbox");
  const data = await res.json();
  const inboxDiv = document.getElementById("inbox");
  inboxDiv.innerHTML = "";
  (data.messages || []).forEach(m => {
    const decrypted = decryptMessage(m.sender, m.nonce, m.cipher);
    const p = document.createElement("p");
    const senderShort = (m.sender || "").substring(0, 10);
    p.textContent = `[From ${senderShort}...] ${decrypted}`;
    inboxDiv.appendChild(p);
  });
}

setInterval(fetchInbox, 5000);
window.onload = init;
window.setRecipient = setRecipient;
window.sendMessage = sendMessage;
