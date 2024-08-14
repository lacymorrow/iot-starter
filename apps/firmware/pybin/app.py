"""
Todo:
- Consistant string deliminator '/"
"""
import ast
import fcntl
import json
import os
import random
import re
import socket
import storage
import struct
import subprocess
import sys
import time
import webview
from logging import info

import cron

DEBUG = True
TMP_DIR = "/home/pi/iot_tmp/"

# TODO: Try/catch all the things

"""
The pywebview front facing gui
"""

def parse_react_json(react_json):
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

    def getHardwareId(self):
        response = {"message": self.HW_ID}

        if DEBUG:
            self.log("getHardwareId: " + str(response))

        self.log("getHardwareId: " + str(response))
        return json.dumps(response)

    # Usage: get({key})
    def get(self, params):
        result = storage.get(params)
        self.log("get: " + str(params) + " - " + str(result))
        return result

    # Usage: set({key, data})
    def set(self, params):
        result = storage.set(params)
        self.log("set: " + str(params) + " - " + str(result))
        return result

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

            response = {"message": str(process.decode("utf-8").strip())}
        except:
            response = {
                "error": "Could not turn on device",
            }

        if DEBUG:
            self.log("deviceOn: " + str(response))

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

            response = {"message": str(process.decode("utf-8").strip())}
        except:
            response = {
                "error": "Could not turn off device",
            }

        if DEBUG:
            self.log("deviceOff: " + str(response))

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

            result = str(process.decode("utf-8"))
            response = {"message": "on" if "1" in result else "off"}
        except:
            response = {
                "error": "Could not read device status",
            }

        if DEBUG:
            self.log("getDeviceStatus: " + str(response))

        self.log("getDeviceStatus: " + str(response))
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

        self.log("getIpAddress: " + str(response))
        return json.dumps(response)

    def getRandomNumber(self, params):
        randNum = random.randint(0, 100000000)
        message = "Random IO: {0}".format(randNum)
        response = {"message": message}

        if DEBUG:
            self.log("getRandomNumber: " + str(response))

        self.log("getRandomNumber: " + str(response))
        return json.dumps(response)

    def getTemperatureHumidity(self):
        try:
            # Get temp/humidity from device
            result = (
                subprocess.check_output(
                    ["sudo", "python", "/home/pi/firmware/drivers/temperhum/temperhum.py", "--nosymbols"],
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
            self.log("getWifiNetworks: " + str(response))

        self.log("getWifiNetworks: " + str(response))
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

    # This deletes all settings!
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

        self.log("update: " + str(response))
        return json.dumps(response)

    def list_cron_jobs(self):
        result = cron.listAll()
        if DEBUG:
            self.log("list_cron_jobs: " + str(result))

        self.log("list_cron_jobs: " + str(result))
        return json.dumps(result)

    def add_cron_job(self, params):
        p = parse_react_json(params)
        if not p or "cron_job" not in p or "name" not in p:
            response = {"error": "Error: Invalid parameters"}
            return json.dumps(response)

        self.log(f"[App] Adding cron job: {p['name']} - {p['cron_job']}")
        result = cron.add(p['cron_job'], p['name'])
        self.log("add_cron_job: " + str(result))
        return json.dumps(result)

    def delete_cron_job(self, params):
        p = parse_react_json(params)
        if not p or "name" not in p:
            response = {"error": "Error: Invalid parameters"}
            return json.dumps(response)

        result = cron.delete(p['name'])
        if DEBUG:
            self.log("delete_cron_job: " + str(result))

        self.log("delete_cron_job: " + str(result))
        return json.dumps(result)

    def delete_all_cron_jobs(self):
        result = cron.delete_all()
        if DEBUG:
            self.log("delete_all_cron_jobs: " + str(result))

        self.log("delete_all_cron_jobs: " + str(result))
        return json.dumps(result)

    def update_cron_job(self, params):
        p = parse_react_json(params)
        if not p or "old_name" not in p or "new_cron_job" not in p or "new_name" not in p:
            response = {"error": "Error: Invalid parameters"}
            return json.dumps(response)

        result = cron.update(p['old_name'], p['new_cron_job'], p['new_name'])
        if DEBUG:
            self.log("update_cron_job: " + str(result))

        self.log("update_cron_job: " + str(result))
        return json.dumps(result)

    def shutdown(self):
        self.log("Shutting down the application...")

        # Close the webview window
        webview.windows[0].destroy()

        # Set the program running flag to False
        global programRunning
        programRunning = False

        # Terminate the process
        os._exit(0)

    def __init__(self):
        # Get hardware ID on init
        self.HW_ID = self._get_hw_id()
        self.log("Initialized Python-JS API with HardwareID: " + self.HW_ID)

    def init(self, params):
        response = {"message": "Python API {0}".format(sys.version)}
        return json.dumps(response)


if __name__ == "__main__":
    api = Api()
    # https: // pywebview.flowrl.com/guide/api.html  # webview-create-window
    webview.create_window(
        "Smartcloud",
        url="/home/pi/firmware/out/index.html",
        js_api=api,
        width=480,
        height=320,
        frameless=True,
        fullscreen=True,
        on_top=True,
        resizable=False,
        text_select=False,
        min_size=(320, 240),
        background_color="#F00"
        # url="https://39b8-107-141-224-67.ngrok-free.app",
    )
    webview.start(debug=DEBUG, http_server=True)