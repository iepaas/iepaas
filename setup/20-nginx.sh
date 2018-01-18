#!/usr/bin/env bash
sudo apt-get install nginx -y

# Generate self-signed certs
cd /iepaas

openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr \
	-subj "/C=ES/ST=Andaucia/L=Sevilla/O=iepaas/CN=iepaas.io"
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
