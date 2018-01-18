#!/usr/bin/env bash
sudo hostname iepaas
sudo echo "127.0.0.1 iepaas" >> /etc/hosts

git config --global user.email iepaas@iepaas.io
git config --global user.name iepaas
