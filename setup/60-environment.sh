#!/usr/bin/env bash
cat >> /home/ubuntu/.bashrc << EOF
export DATABASE_URL="${DATABASE_URL}"
EOF

cat >> /iepaas/.env << EOF
DATABASE_URL=${DATABASE_URL}
EOF
