from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

CLIENT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "client", "web_client")

app = Flask(__name__, static_folder=CLIENT_DIR, static_url_path="/")
CORS(app)

inbox = []

@app.route("/send", methods=["POST"])
def send():
    packet = request.json
    inbox.append(packet)
    return {"status": "ok"}, 200

@app.route("/inbox", methods=["GET"])
def get_inbox():
    global inbox
    msgs = inbox.copy()
    inbox = []
    return jsonify({"messages": msgs})

@app.route("/")
def index():
    return send_from_directory(CLIENT_DIR, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
