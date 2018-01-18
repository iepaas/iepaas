#!/usr/bin/env bash
#if ! [ $(id -u) = 0 ]; then
#   echo "You need to run this as root!"
#   exit 1
#fi

if ! [ -n "$1" ]; then
	echo "Please specify up, down, ip, destroy, or ssh"
	exit 1
fi

if ! [ -f ~/.ssh/iepaas_local_container ]; then
	echo "iepaas ssh key not detected! Generating one..."
	echo ""
	ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/iepaas_local_container
	ssh-add ~/.ssh/iepaas_local_container
fi

if [ $1 = "up" ]; then
	name=$(sudo lxc list iepaas --format csv --columns n 2> /dev/null)
	if [ "$name" = "iepaas" ]; then
		# Container exists
		lxc start iepaas
	else
		# Container doesn't exist
		lxc init ubuntu:16.04 iepaas -c security.privileged=true
		key=$(< ~/.ssh/iepaas_local_container.pub)
		lxc config device add iepaas src disk source=$(pwd) path=/iepaas
		(
		cat <<- EOF
		#cloud-config
		ssh_authorized_keys:
		 - ${key}
		EOF
		) | lxc config set iepaas user.user-data -
		lxc start iepaas
		sleep 7
		ssh -i ~/.ssh/iepaas_local_container \
			-o StrictHostKeyChecking=no \
			"ubuntu@$(bash ./container.sh ip)" 'bash /iepaas/setup.sh'
	fi
elif [ $1 = "ssh" ]; then
		ssh -i ~/.ssh/iepaas_local_container \
			-o StrictHostKeyChecking=no \
			"ubuntu@$(bash ./container.sh ip)"
elif [ $1 = "destroy" ]; then
	lxc delete iepaas --force
elif [ $1 = "ip" ]; then
	lxc list iepaas -c 4 --format csv | sed 's/ (eth0)//g'
else
	echo "Please specify up, down, ip, destroy, or ssh"
	exit 1
fi
