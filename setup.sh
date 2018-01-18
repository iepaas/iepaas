#!/usr/bin/env bash

export NODE_VERSION="8.9.4"
export DATABASE_URL="postgres://ubuntu:ubuntu@localhost:5432/iepaas"

log="/iepaas/logs/provision.log"

mkdir -p /iepaas/logs/
[ -e ${log} ] && rm ${log}

for file in /iepaas/setup/*
do
    echo "" >> ${log}
    echo "=== BEGIN ${file} ===" >> ${log}
    echo "Executing ${file}"
    cd ~
    bash ${file} >> ${log} 2>&1
    echo "=== END ${file} ===" >> ${log}
    echo "" >> ${log}
done

echo ""
echo "=== iepaas setup finished!"
echo "=== The iepaas api is live in port 4898"
