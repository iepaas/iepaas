#!/usr/bin/env bash
cat > /tmp/iepaas.api.service << EOF
[Unit]
Description=Starts iepaas

[Service]
ExecStart=/bin/bash -c "sudo PORT=4898 DATABASE_URL=${DATABASE_URL} node /iepaas/build/api/index.js > /iepaas/logs/api.log 2>&1"

[Install]
WantedBy=multi-user.target
EOF

cat > /tmp/iepaas.worker.service << EOF
[Unit]
Description=Starts iepaas

[Service]
ExecStart=/bin/bash -c "sudo DATABASE_URL=${DATABASE_URL} node /iepaas/build/worker/index.js > /iepaas/logs/worker.log 2>&1"

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/iepaas.api.service /etc/systemd/system/iepaas.api.service
sudo mv /tmp/iepaas.worker.service /etc/systemd/system/iepaas.worker.service

sudo systemctl daemon-reload
sudo systemctl enable iepaas.api
sudo systemctl enable iepaas.worker
sudo systemctl start iepaas.api
sudo systemctl start iepaas.worker
