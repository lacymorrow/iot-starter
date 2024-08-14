#! /bin/bash

# Delete a cron job
# @param $1 - The command to run

crontab -l | grep -v "$1" | crontab -