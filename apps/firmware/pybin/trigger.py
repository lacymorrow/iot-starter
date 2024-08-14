# Trigger the device on/off based on the temperature``
import storage
import subprocess
import json

DEBUG = True
TMP_DIR = "/home/pi/iot_tmp/"
STORAGE_FILE = TMP_DIR + ".iot_storage_"

def log(text):
    print("[Sensors] %s" % text)

def getTemperature():
    # Get temp/humidity from device
    result = (
        subprocess.check_output(
            ["sudo", "python", "/home/pi/firmware/drivers/temperhum/temperhum.py", "--nosymbols"]
        )
        .decode()
        .strip()
    )
    temp = result.split(" ")
    temp = temp[0]

    return temp

def doesNeedChange():
    trigger_temp = storage.get({"key": "trigger"})
    temp = getTemperature()
    if temp < trigger_temp:
        return True
    return False



def __main__():
    stored = storage.get({"key": "trigger"})
    stored = json.loads(stored)
    trigger_temp = float(stored["message"])

    temp = float(getTemperature())
    print('Current temp: ')
    print(temp)
    print('Trigger temp: ')
    print(trigger_temp)

    if temp < trigger_temp+0.5:
        print("Turning on")
        subprocess.check_output(["sudo", "bash", "/home/pi/firmware/bin/util/gpio-on.sh"])
    else:
        print("Turning off")
        subprocess.check_output(["sudo", "bash", "/home/pi/firmware/bin/util/gpio-off.sh"])

if __name__ == "__main__":
    __main__()