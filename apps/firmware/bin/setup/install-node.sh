# Install Node


# sudo wget https://nodejs.org/download/release/v11.15.0/node-v11.15.0-linux-armv6l.tar.gz
sudo wget https://unofficial-builds.nodejs.org/download/release/v16.14.0/node-v16.14.0-linux-armv6l.tar.gz
sudo tar -xzf node-v16.14.0-linux-armv6l.tar.gz
cd /home/pi/node-v16.14.0-linux-armv6l/
sudo cp -R * /usr/local/

# # Use nodesource for a better node version
# curl -sL https://deb.nodesource.com/setup_17.x | bash -
# sudo apt-get install -y nodejs

# Install NVM
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/latest/install.sh | bash

# Install yarn
# # Download yarn GPG key and add to trusted keys
# curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
# # Add repo to list
# echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
# sudo apt update
# # Install yarn
# sudo apt install -y yarn

sudo node -v
sudo yarn -v
