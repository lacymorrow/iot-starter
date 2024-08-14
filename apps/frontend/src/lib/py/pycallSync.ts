/**
 * PyCall - contains every possible interaction with the hardware system
 * Our explicit 3 walled garden
 *
 * Note: window.pywebview and API functions are not available immediately
 * during browser bootup. We will attempt to call the endpoint
 * 10 times with a 500ms pause before failing.
 */

/*
    Available API - defined in /pybin/api - not up to date
    -------------------------------------

    init // Hello from Python {0}'.format(sys.version)
    getIpAddress (gets wlan0 IP)
    checkWifiConnection (intemittent internet connection)
    getHardwareId (unique device id)
    showLights (runs rainbow_lights.sh)
    getRandomNumber

    Exposed at window.pywebview.api[endpoint]

*/

import pylog from './pylog';

declare global {
    interface Window {
        pywebview?: any;
    }
}

/* Python API -> Shell Connection */
const pycall = async (endpoint: string, params: any = {}) => {
    await pylog(`PyCall ${endpoint}`);
    const res = await window.pywebview.api[endpoint](params)
        .then(async (response: string | { message: string }) => {
            try {
                // Response is json {message: string}
                const result = JSON.parse(String(response));
                await pylog(`PyCall returned object ${result.message}`);
                return result.message;
            } catch (error) {
                await pylog(`PyCall returned ${response}`);
                return response;
            }
        })
        .catch(async (error: any) => {
            let errorMessage = `PyCall ${endpoint} failed: ${error}`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            await pylog(`Pycall Error: ${errorMessage}`);
            throw new Error(errorMessage);
        });
    return res;
};

export default pycall;
