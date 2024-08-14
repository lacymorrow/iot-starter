import subprocess
import json

DEBUG = True
device = "26"

def log(text):
    print("[Device] %s" % text)

def on(self):
    try:
        # Use subprocess.check_output if you expect a response
        process = subprocess.check_output(
            [
                "sudo",
                "bash",
                "/home/pi/firmware/bin/util/gpio.sh",
                "write",
                device,
                "1",
            ],
            stderr=subprocess.STDOUT,
        )

        response = {"message": str(process.decode("utf-8").strip())}
    except:
        response = {
            "error": "Could not turn on device",
        }

    if DEBUG:
        self.log("deviceOn: " + str(response))

    return json.dumps(response)

def off(self):
    try:
        # Use subprocess.check_output if you expect a response
        process = subprocess.check_output(
            [
                "sudo",
                "bash",
                "/home/pi/firmware/bin/util/gpio.sh",
                "write",
                device,
                "0",
            ],
            stderr=subprocess.STDOUT,
        )

        response = {"message": str(process.decode("utf-8").strip())}
    except:
        response = {
            "error": "Could not turn off device",
        }

    if DEBUG:
        self.log("deviceOff: " + str(response))

    return json.dumps(response)

def getStatus(self):
    try:
        # Use subprocess.check_output if you expect a response
        process = subprocess.check_output(
            ["sudo", "bash", "/home/pi/firmware/bin/util/gpio.sh", "read", device],
            stderr=subprocess.STDOUT,
        )

        result = str(process.decode("utf-8"))
        response = {"message": "on" if "1" in result else "off"}
    except:
        response = {
            "error": "Could not read device status",
        }

    if DEBUG:
        self.log("deviceOff: " + str(response))

    return json.dumps(response)
