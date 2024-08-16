#!/bin/sh

PYTHON="$(sudo bash /home/pi/firmware/apps/firmware/bin/setup/check-python.sh)"

echo "-*- Startup -*-"
sudo $PYTHON /home/pi/firmware/apps/firmware/pybin/app.py
