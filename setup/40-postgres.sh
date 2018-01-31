#!/usr/bin/env bash
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres createuser ubuntu --superuser
(
cat << EOF
create database iepaas;
create database iepaas_test;
alter user ubuntu with password 'ubuntu';
EOF
) | sudo -u postgres psql
