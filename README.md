# Secure Messaging

A self-hosted, end-to-end encrypted messaging system with:
- Browser-side encryption (libsodium)
- Forwarding server (Flask)
- WireGuard mesh networking
- Docker + docker-compose
- Systemd automation
- CI via GitHub Actions

## Quick Start
```bash
git clone https://github.com/n4ku7/SecureMessage.git
cd secure-messaging
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd server
python app.py
```

Open `http://localhost:8080` in your browser.

