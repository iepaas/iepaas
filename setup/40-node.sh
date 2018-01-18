#!/usr/bin/env bash
curl -s -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install ${NODE_VERSION}

node_path="/home/ubuntu/.nvm/versions/node/v${NODE_VERSION}/bin/node"
npm_path="/home/ubuntu/.nvm/versions/node/v${NODE_VERSION}/bin/npm"

if [ ! -d ${node_path} ]; then
	node_path="/.nvm/versions/node/v${NODE_VERSION}/bin/node"
	npm_path="/.nvm/versions/node/v${NODE_VERSION}/bin/npm"
fi

sudo ln -s ${node_path} /usr/bin/node
sudo ln -s ${npm_path} /usr/bin/npm

cd /iepaas
npm install
npm run build
npm run migrate up
