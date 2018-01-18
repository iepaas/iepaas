#!/usr/bin/env bash
export NVM_DIR="/nvm"
sudo mkdir ${NVM_DIR}
sudo chown ubuntu:ubuntu ${NVM_DIR}
curl -s -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | NVM_DIR=${NVM_DIR} bash
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install ${NODE_VERSION}

node_path="${NVM_DIR}/versions/node/v${NODE_VERSION}/bin/node"
npm_path="${NVM_DIR}/versions/node/v${NODE_VERSION}/bin/npm"

sudo ln -s ${node_path} /usr/bin/node
sudo ln -s ${npm_path} /usr/bin/npm

cd /iepaas
npm install
npm run build
npm run migrate up
