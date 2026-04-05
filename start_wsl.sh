#!/bin/bash
export NVM_DIR="$HOME/.nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
npm install -g pnpm
cd /mnt/c/Users/arjun/OneDrive/Desktop/cie_ignite/prototype/petregistry
pnpm install
pnpm --filter @workspace/petretriever dev
