#!/usr/bin/env bash
sudo apt-get install -y ntp

(
cat << EOF
root soft nofile 65536
root hard nofile 65536
* soft nofile 65536
* hard nofile 65536
EOF
) | sudo tee -a /etc/security/limits.conf > /dev/null

curl -L https://toolbelt.treasuredata.com/sh/install-ubuntu-xenial-td-agent3.sh | sh

(
cat << EOF
<source>
	@type tail
	path /iepaas/logs/api.log
	pos_file /var/log/td-agent/iepaas.api.pos
	tag iepaas.api
	format none
</source>

<source>
	@type tail
	path /iepaas/logs/api.log
	pos_file /var/log/td-agent/iepaas.worker.pos
	tag iepaas.worker
	format none
</source>

<source>
        @type tcp
        tag app.build
        <parse>
                @type none
        </parse>
        port 5000
</source>

<source>
        @type tcp
        tag app.web
        <parse>
                @type none
        </parse>
        port 5001
</source>

<source>
        @type tcp
        tag app.job
        <parse>
                @type none
        </parse>
        port 5002
</source>

<match **>
	@type stdout
</match>
EOF
) | sudo tee /etc/td-agent/td-agent.conf > /dev/null

sudo systemctl restart td-agent