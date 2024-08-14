import subprocess
import json

DEBUG = True

def log(text):
    print("[Sensors] %s" % text)

def getTemperatureHumidity(self):
    try:
        # Get temp/humidity from device
        result = (
            subprocess.check_output(
                ["sudo", "python", "/home/pi/firmware/drivers/temperhum/temperhum.py", "--nosymbols"]
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

def __main__():
    print(getTemperatureHumidity())

if __name__ == "__main__":
    __main__()