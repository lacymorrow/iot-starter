#!/bin/bash

# usage:
# >sudo sh gpio.sh <action> <pin> <value>
# reading example:
# >sudo sh gpio.sh read 1
# >0
# writing example:
# >sudo sh gpio.sh write 3 1

#assign parameters
action=$1
pin=$2
value=$3

# If pin not exported yet
if [ ! -d "/sys/class/gpio/gpio$pin" ];then
    #create gpio instance
    echo $pin > /sys/class/gpio/export
fi

if [ $action = "read" ];then
  	# #assign direction
	# echo in > /sys/class/gpio/gpio$pin/direction
  	#read gpio value
	cat /sys/class/gpio/gpio$pin/value   	
	
elif [ $action = "write" ];then
  	#assign direction
	echo out > /sys/class/gpio/gpio$pin/direction
  	#assign value
	echo $value > /sys/class/gpio/gpio$pin/value
    echo "true"
else
   	echo "Unknown parameter"
fi
