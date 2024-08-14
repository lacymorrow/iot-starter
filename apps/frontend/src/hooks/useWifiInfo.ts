import useSWR from 'swr';

import { getWifiInfo } from '../lib/py/pyapi';
import config from '../utils/config';

const useWifiInfo = (params?: any) => {
    const { data, error, mutate } = useSWR(`/wifi-info`, getWifiInfo, {
        refreshInterval: config.NETWORK_TIMEOUT,
        refreshWhenHidden: false,
        refreshWhenOffline: true,
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        ...params,
    });

    return {
        data,
        mutate,
        isLoading: !error && !data,
        isError: error,
    };
};

export default useWifiInfo;
