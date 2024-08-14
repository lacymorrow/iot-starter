#!/bin/sh
# 1|0 -> 1=false/off 0=true/on

sudo raspi-config nonint get_pi_type

# Overclock (Pi 0 cannot be overclocked)
# Possible overclock options: None|Modest|Medium|High|Turbo
# sudo raspi-config nonint do_overclock "Medium"

# Dont work
# sudo raspi-config nonint do_update # Switches to menu mode after completion
# sudo raspi-config nonint do_change_pass password # single menu mode dialog shows

sudo raspi-config nonint do_overscan 1
sudo raspi-config nonint do_change_locale "en_US.UTF-8"
sudo raspi-config nonint do_change_timezone "America/New_York"
sudo raspi-config nonint do_wifi_country "US"
sudo raspi-config nonint do_ssh 0
sudo raspi-config nonint do_vnc 0
sudo raspi-config nonint do_spi 0

# sudo raspi-config nonint do_resolution
# sudo raspi-config nonint do_vnc_resolution "1280x720"
# vcgencmd get_mem gpu | cut -d = -f 2 | cut -d M -f 1

sudo raspi-config nonint disable_raspi_config_at_boot 1
sudo raspi-config nonint do_hostname "smartcloud"

# do_wifi_ssid_passphrase
# get_boot_wait
# do_boot_wait
# get_boot_splash
# do_boot_splash
