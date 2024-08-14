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

import config from '../../utils/config';
import { retryOperation } from '../../utils/utils';
import pylog from './pylog';

declare global {
    interface Window {
        pywebview?: any;
    }
}

/* Python API -> Shell Connection */
const pycall = (endpoint: string, params: any = undefined) => {
    return retryOperation(
        async () => {
            try {
                if (process.env.NODE_ENV === 'development') {
                    throw new Error(
                        'Not running in production, skipping pycall',
                    );
                }

                if (!window.pywebview?.api?.[endpoint]) {
                    throw new Error('API endpoint not found');
                }

                await pylog(`PyCall ${endpoint}`, params);
                const response: string | { message: string } =
                    await window.pywebview.api[endpoint](params)
                        .then((res: any) => JSON.parse(res))
                        .then(async (res: any) => {
                            // Response contained an error
                            if (res?.error) {
                                throw res.error;
                            }

                            if (res.message === undefined) {
                                throw new Error(
                                    `Response message was empty ${res}`,
                                );
                            }

                            await pylog(
                                `Pycall ${endpoint} returned: ${res.message}`,
                                res,
                            );
                            return res.message;
                        });
                return response;
            } catch (error) {
                let errorMessage = `${error}`;
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                await pylog(`Pycall ${endpoint} (retrying): ${errorMessage}`);
                throw new Error(errorMessage);
            }
        },
        config.RETRY_DELAY,
        process.env.NODE_ENV === 'development' ? 1 : config.MAX_RETRIES, // 1 retry in dev
    ).catch(async (error) => {
        // Operation failed
        let errorMessage = `${endpoint} - ${error}`;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        await pylog(`Pycall ${endpoint} - FATAL ERROR: ${errorMessage}`);
        throw new Error(errorMessage);
    });
};

export default pycall;
