"""
Todo:
- Consistant string deliminator '/"
"""
import ast
import json
import fcntl
from logging import info
import os
import random
import re
import socket
import struct
import subprocess
import sys
import time
import webview

# TODO: Try/catch all the things

"""
The pywebview front facing gui
"""

DEBUG = True
TMP_DIR = "/home/pi/iot_tmp/"
STORAGE_FILE = TMP_DIR + ".iot_storage_"


def parse_react_json(self, react_json):
    try:
        p = ast.literal_eval(react_json)
    except:
        try:
            p = ast.literal_eval(json.dumps(react_json))
        except:
            return ""

    return p


class Api:
    # Get raspi hardware ID
    def _get_hw_id(self):
        # Extract serial from cpuinfo file
        hw_id = "0000000000000000"
        try:
            f = open("/proc/cpuinfo", "r")
            for line in f:
                if line[0:6] == "Serial":
                    hw_id = line[10:26]
            f.close()
        except:
            hw_id = "ERROR000000000"

        if DEBUG:
            self.log("_get_hw_id: " + str(hw_id))

        return hw_id

    # Usage: get({key})
    def get(self, params):
        p = parse_react_json(params)

        if p != "" and "key" in p:
            key = p["key"]
            try:
                f = open(STORAGE_FILE + str(key), "r")
                value = f.read()
                f.close()
                try:
                    response = {"message": ast.literal_eval(value)}
                except:
                    response = {"message": str(value)}
            except:
                # Not set
                response = {"message": ""}
        else:
            response = {"error": "Error: No key provided"}

        if DEBUG:
            self.log("get: " + str(params) + " - " + str(response))

        return json.dumps(response)

    # Usage: set({key, data})
    def set(self, params):
        p = parse_react_json(params)
        if p == "":
            response = {"error": "Error: key and value must be provided"}
            return json.dumps(response)

        if "key" in p and "data" in p:
            key = str(p["key"])
            data = str(p["data"])
            try:
                # Create folder if needed
                if not os.path.exists(TMP_DIR):
                    os.makedirs(TMP_DIR)
                f = open(STORAGE_FILE + key, "w")
                f.write(data)
                f.close()
                response = {"message": "ok"}
                self.log("Set " + key + ": " + data)
            except:
                response = {"error": "Error: Could not set file"}
        else:
            response = {"error": "Set Error"}

        if DEBUG:
            self.log("set: " + str(params) + " - " + str(response))

        return json.dumps(response)

    def deviceOn(self):
        device = "26"
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

            response = {"message": str(process.decode("utf-8"))}
        except:
            response = {
                "error": "Could not turn on device",
            }

        if DEBUG:
            self.log("deviceOn: " + str(response))

        return json.dumps(response)

    def deviceOff(self):
        device = "26"
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

            response = {"message": str(process.decode("utf-8"))}
        except:
            response = {
                "error": "Could not turn off device",
            }

        if DEBUG:
            self.log("deviceOff: " + str(response))

        return json.dumps(response)

    def getDeviceStatus(self):
        device = "26"
        try:
            # Use subprocess.check_output if you expect a response
            process = subprocess.check_output(
                ["sudo", "bash", "/home/pi/firmware/bin/util/gpio.sh", "read", device],
                stderr=subprocess.STDOUT,
            )

            response = {"message": str(process.decode("utf-8"))}
        except:
            response = {
                "error": "Could not read device status",
            }

        if DEBUG:
            self.log("deviceOff: " + str(response))

        return json.dumps(response)

    def getHardwareId(self):
        response = {"message": self.HW_ID}

        if DEBUG:
            self.log("getHardwareId: " + str(response))

        return json.dumps(response)

    def getIpAddress(self):
        try:
            process = subprocess.check_output(["hostname", "-I"]).split()[0]
            ip = process.decode("utf-8")
            response = {
                "message": ip,
            }
        except:
            response = {
                "error": "Could not get IP",
            }

        if DEBUG:
            self.log("getIpAddress: " + str(response))

        return json.dumps(response)

    def getRandomNumber(self, params):
        randNum = random.randint(0, 100000000)
        message = "Random IO: {0}".format(randNum)
        response = {"message": message}
        return json.dumps(response)

    def getTemperatureHumidity(self):
        try:
            # Get temp/humidity from device
            result = (
                subprocess.check_output(
                    "/home/pi/firmware/drivers/temperhum/temperhum.py --nosymbols",
                    shell=True,
                )
                .decode()
                .strip()
            )
            [temp, hum] = result.split(" ")

            response = {
                "message": {
                    "temperature": temp,
                    "humidity": hum,
                }
            }

        except:
            response = {"error": "getTemperatureHumidity Error"}

        if DEBUG:
            self.log("getTemperatureHumidity: " + str(response))

        return json.dumps(response)

    def getWifiInfo(self):
        try:
            process = subprocess.check_output(["sudo", "iwconfig", "wlan0"])
            info = process.decode("utf-8")

            groups = re.search(r'ESSID:"(.+)"[\S\s.]+Link Quality=(\d+)', info)

            if DEBUG:
                self.log(
                    "Network: "
                    + str(groups.group(1))
                    + " Quality: "
                    + str(groups.group(2))
                )

            response = {
                "message": {"ssid": groups.group(1), "quality": groups.group(2)}
            }

        except:
            response = {"error": "getWifiInfo Error"}

        if DEBUG:
            self.log("getWifiInfo: " + str(response))

        return json.dumps(response)

    def getWifiNetworks(self):
        try:
            ps = subprocess.Popen(
                ("sudo", "iwlist", "wlan0", "scan"), stdout=subprocess.PIPE
            )
            process = subprocess.check_output(("grep", "ESSID:"), stdin=ps.stdout)
            ps.wait()
            networks = process.decode("utf-8")
            response = {
                "message": str(networks),
            }
        except:
            response = {
                "error": "Could not list networks",
            }

        if DEBUG:
            self.log("getWifiInfo: " + str(response))

        return json.dumps(response)

    # Connect to a wifi network
    def setWifiNetwork(self, params):
        p = parse_react_json(params)
        if p == "":
            response = {"error": "Error: No credentials provided"}
            return json.dumps(response)

        if "ssid" in p and "password" in p:
            ssid = str(p["ssid"])
            password = str(p["password"])
            # Use subprocess.check_output if you expect a response
            process = subprocess.check_output(
                [
                    "sudo",
                    "bash",
                    "/home/pi/firmware/bin/util/connect-wifi-network.sh",
                    ssid,
                    password,
                ],
                stderr=subprocess.STDOUT,
            )

            response = {"message": str(process.decode("utf-8"))}
        else:
            response = {"message": "Error: Invalid credentials"}

        if DEBUG:
            self.log("setWifiNetwork: " + str(params) + " - " + str(response))

        return json.dumps(response)

    def checkWifiConnection(self):
        try:
            process = subprocess.check_output(
                ["sudo", "bash", "/home/pi/firmware/bin/util/check-network-curl.sh"],
                stderr=subprocess.STDOUT,
            )
            result = str(process.decode("utf-8")).strip("\n")
            if result != "true":
                response = {
                    "error": result,
                }
            else:
                response = {
                    "message": result,
                }
        except:
            response = {
                "error": "Could not connect",
            }

        if DEBUG:
            self.log("checkWifiConnection: " + str(response))

        return json.dumps(response)

    def log(self, text):
        print("[Cloud] %s" % text)
        response = {
            "message": "ok",
        }
        return json.dumps(response)

    def longTime(self, params):
        time.sleep(15)
        response = {"message": "ok"}
        return json.dumps(response)

    def removeAllStorage(self):
        try:
            os.system("find " + TMP_DIR + " -mindepth 1 -delete")
        except:
            pass

        response = {"message": "ok"}

        return json.dumps(response)

    def toggleFullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def update(self):
        try:
            # Use subprocess.check_output if you expect a response
            process = subprocess.check_output(
                ["sudo", "bash", "/home/pi/firmware/bin/setup/update.sh"],
                stderr=subprocess.STDOUT,
            )

            response = {"message": str(process.decode("utf-8"))}
        except:
            response = {
                "error": "Could not update",
            }

        if DEBUG:
            self.log("update: " + str(response))

        return json.dumps(response)

    def __init__(self):
        self.HW_ID = self._get_hw_id()
        self.log("Initialized Python-JS API with HardwareID: " + self.HW_ID)

    def init(self, params):
        response = {"message": "Hello from Python {0}".format(sys.version)}
        return json.dumps(response)


if __name__ == "__main__":
    api = Api()

    print(api.getHardwareId())

    window = webview.create_window("Woah dude!", "https://pywebview.flowrl.com")
    webview.start()

# https: // pywebview.flowrl.com/guide/api.html  # webview-create-window
# webview.create_window(
#     'Smartcloud',
#     url="/home/pi/firmware/static/index.html",
#     js_api=api,
#     width=480,
#     height=320,
#     frameless=True,
#     resizable=False,
#     text_select=False,
#     min_size=(320, 240),
#     background_color='#F00'
#     # url="",
#     # url="https://lmorrow.ngrok.io/",
#     # on_top=False,
#     # fullscreen=False,
# )
# webview.start(debug=DEBUG, http_server=True)
