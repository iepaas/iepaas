#!/usr/bin/env bash
sudo mkdir /app
sudo chown ubuntu:ubuntu /app

# Just in case we ran the setup script as root:
sudo chown -R ubuntu:ubuntu /iepaas