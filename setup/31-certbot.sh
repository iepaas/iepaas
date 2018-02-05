#!/usr/bin/env bash
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y certbot

sudo mkdir /var/www/html/.well-known

# TODO add renew to crontab