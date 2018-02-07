#!/usr/bin/env bash
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y certbot

sudo mkdir /var/www/html/.well-known

sudo crontab << EOF
# Renew the certificates daiy, if needed
43 6 * * * certbot renew --post-hook "systemctl restart nginx"
EOF