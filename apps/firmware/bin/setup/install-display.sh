#!/bin/sh

# http://www.lcdwiki.com/res/PublicFile/How_to_calibrate_the_resistance_touch_screen-V1.2.pdf
# http://www.lcdwiki.com/res/PublicFile/How_to_install_matchbox-keyboard(En).pdf

# Online Download
# sudo rm -rf LCD-show
# git clone https://github.com/goodtft/LCD-show.git /home/pi/firmware/drivers/LCD-show
# sudo chmod -R 755 LCD-show
# sudo /home/pi/firmware/drivers/LCD-show/MHS35-show

# Use local
sudo chmod -R 755 /home/pi/firmware/drivers/LCD-show
cd /home/pi/firmware/drivers/LCD-show
sudo su -c ./MHS35-show
