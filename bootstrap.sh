#!/usr/bin/env bash

sudo apt-get update
sudo apt-get install -y curl git
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update
sudo apt-get install -y nodejs mongodb-org
sudo service mongod start
sudo npm install -g forever
cd /vagrant
npm install
forever start ./api/index.js
