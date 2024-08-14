#!/bin/bash

# Create a cron job
# @param $1 - The command to run
# @param $2 - The schedule

# Get the current cron jobs
crontab -l > mycron 2>/dev/null

# Add the command to the cron file
echo "$2 $1" >> mycron

# Add the cron jobs to the cron table
crontab mycron

# Remove the temporary file
rm mycron
