#!/bin/bash
# Auto WireGuard setup
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <node_name>"
  exit 1
fi

NODE=$1
mkdir -p wireguard/$NODE
cd wireguard/$NODE

wg genkey | tee privatekey | wg pubkey > publickey
echo "[Interface]" > wg0.conf
echo "PrivateKey = $(cat privatekey)" >> wg0.conf
echo "Address = 10.0.0.$((RANDOM%200+2))/24" >> wg0.conf
echo "ListenPort = 51820" >> wg0.conf
