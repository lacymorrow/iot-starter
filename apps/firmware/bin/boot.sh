#!/bin/sh

PYTHON="$(sudo bash /home/pi/firmware/bin/setup/check-python.sh)"

echo "-*- Startup -*-"
sudo $PYTHON /home/pi/firmware/pybin/app.py
