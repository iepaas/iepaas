#!/usr/bin/env bash
command -v foo git >/dev/null 2>&1 || {
    sudo apt-get install -y git
}

sudo git clone https://github.com/iepaas/iepaas.git /iepaas
sudo chown -R ubuntu:ubuntu /iepaas

bash /iepaas/setup.sh
