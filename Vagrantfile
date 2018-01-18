Vagrant.configure("2") do |config|
	config.vm.box = "ubuntu/xenial64"
	config.vm.network "forwarded_port", guest: 80, host: 3000
	config.vm.network "forwarded_port", guest: 4898, host: 4898
	config.vm.synced_folder ".", "/iepaas"
	config.vm.provision "shell", privileged:false, path: "setup.sh"
end
