import ast
import json
import os

DEBUG = True
TMP_DIR = "/home/pi/iot_tmp/"
STORAGE_FILE = TMP_DIR + ".iot_storage_"

def log(text):
    print("[Storage] %s" % text)

def parse_react_json(react_json):
    try:
        p = ast.literal_eval(react_json)
    except:
        try:
            p = ast.literal_eval(json.dumps(react_json))
        except:
            return ""
    return p

def get(params):
    p = parse_react_json(params)

    if p != "" and "key" in p:
        key = p["key"]
        try:
            with open(STORAGE_FILE + str(key), "r") as f:
                value = f.read()
            try:
                response = {"message": ast.literal_eval(value)}
            except:
                response = {"message": str(value)}
        except:
            response = {"message": ""}
    else:
        response = {"error": "Error: No key provided"}

    if DEBUG:
        log("get: " + str(params) + " - " + str(response))

    return json.dumps(response)

def set(params):
    p = parse_react_json(params)
    if p == "":
        response = {"error": "Error: key and value must be provided"}
        return json.dumps(response)

    if "key" in p and "data" in p:
        key = str(p["key"])
        data = str(p["data"])
        try:
            if not os.path.exists(TMP_DIR):
                os.makedirs(TMP_DIR)
            with open(STORAGE_FILE + key, "w") as f:
                f.write(data)
            response = {"message": "ok"}
            log("Set " + key + ": " + data)
        except:
            response = {"error": "Error: Could not set file"}
    else:
        response = {"error": "Set Error"}

    if DEBUG:
        log("set: " + str(params) + " - " + str(response))

    return json.dumps(response)