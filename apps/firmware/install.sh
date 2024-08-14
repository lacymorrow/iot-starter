#!/bin/bash

USERNAME=pi
PASSWORD=pi
REPO="https://github.com/lacymorrow/iot-firmware.git"
WIFI_SSID="Castle"
WIFI_PASSWORD="homesweethome"

echo "> Smartcloud Setup ---"

# sudo systemctl enable getty@tty1.service
# sudo apt-get update -y

# Install Git
echo "> Install Git"
if ! command -v git &> /dev/null
then
	sudo apt-get install -y git
fi

# Clone repo
echo "> Delete old repo"
sudo rm -rf /home/pi/firmware

echo "> Clone firmware"
sudo git clone --single-branch $REPO /home/pi/firmware

# Set git config (rebase strategy)
echo "> Set pull behavior"
sudo git -C /home/pi/firmware/ config pull.rebase false

echo "> Make bin folder executable"
sudo chmod -R 755 /home/pi/firmware/bin

# Enable SSH
echo "> Enable SSH"
sudo touch /boot/ssh

# Backup Config files
echo "> Backup config files"
sudo cp /boot/config.txt /boot/config.old.txt

# Copy root directory
sudo cp -R /home/pi/firmware/root/boot /boot/
sudo cp -R /home/pi/firmware/root/etc/default /etc/default

# Autostart on device boot
echo "> Copy boot files"
sudo mkdir -p /home/pi/.config/lxsession /home/pi/.config/lxsession/LXDE-pi

# We no longer need to copy rc.local, we use autostart instead because it starts after the GUI is ready
# sudo rm /etc/rc.local
# sudo cp /home/pi/firmware/root/etc/rc.local /etc/rc.local

# TODO Splashscreen
sudo cp /home/pi/firmware/root/home/pi/.config/lxpanel/LXDE-pi/panels/panel /home/pi/.config/lxpanel/LXDE-pi/panels/panel
sudo cp /home/pi/firmware/root/home/pi/.config/lxsession/LXDE-pi/autostart /home/pi/.config/lxsession/LXDE-pi/autostart

# Set user password
echo "> Set username/password"
sudo echo "$USERNAME:$PASSWORD" > pass.txt
sudo chpasswd < pass.txt
sudo rm pass.txt

# raspi-config
echo "> Running Raspi Config"
sudo bash /home/pi/firmware/bin/setup/raspi-config-setup.sh

# Delete Raspi-config wizard
echo "> Delete Raspi setup wizard"
sudo cp /etc/xdg/autostart/piwiz.desktop /home/pi/firmware
sudo rm /etc/xdg/autostart/piwiz.desktop

# TODO REMOVE: Setup home wifi network; replace <ssid> and <password>
# echo "> Setup wifi network"
# sudo bash /home/pi/firmware/bin/util/connect-wifi-network.sh <ssid> <password>
if [ -z "$WIFI_SSID" ] || [ -z "$WIFI_PASSWORD" ]; then
	echo "> Wifi credentials not set, skipping"
else
	sudo bash /home/pi/firmware/bin/util/connect-wifi-network.sh $WIFI_SSID $WIFI_PASSWORD
fi

echo "-*- First Run -*-"
sudo bash /home/pi/firmware/bin/setup/first-run.sh

# Install Temp/Humidity Drivers
echo "> Install temp/humidity"
bash /home/pi/firmware/bin/setup/install-temperhum.sh

# Install display drivers
# This forces a reboot
echo "> Install display"
sudo bash /home/pi/firmware/bin/setup/install-display.sh

# Reboot (if display script didn't already)
sudo reboot
