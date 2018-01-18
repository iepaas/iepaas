#!/usr/bin/env bash
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade \
    -yq -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
sudo apt-get install -y python gcc cmake libssl-dev