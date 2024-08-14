import useSWR from 'swr';

import { getDeviceStatus } from '../lib/py/pyapi';
import config from '../utils/config';

// TODO: Loading state after mutate
const useDevicePowerStatus = (params?: any) => {
    const { data, error, mutate } = useSWR(
        `/device-power-status`,
        getDeviceStatus,
        {
            refreshInterval: config.RETRY_DELAY,
            refreshWhenHidden: true,
            refreshWhenOffline: true,
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            ...params,
        },
    );

    return {
        mutate,
        status: data === 'on',
        isLoading: !error && typeof data === 'undefined',
        isError: error,
    };
};

export default useDevicePowerStatus;
