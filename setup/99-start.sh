#!/usr/bin/env bash
sudo tee /etc/systemd/system/iepaas.api.service > /dev/null << EOF
[Unit]
Description=Starts iepaas

[Service]
ExecStart=/bin/bash -c "sudo PORT=4898 DATABASE_URL=${DATABASE_URL} node /iepaas/build/api/index.js > /iepaas/logs/api.log 2>&1"

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/iepaas.worker.service > /dev/null << EOF
[Unit]
Description=Starts iepaas

[Service]
ExecStart=/bin/bash -c "sudo DATABASE_URL=${DATABASE_URL} node /iepaas/build/worker/index.js > /iepaas/logs/worker.log 2>&1"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable iepaas.api
sudo systemctl enable iepaas.worker
sudo systemctl start iepaas.api
sudo systemctl start iepaas.worker
