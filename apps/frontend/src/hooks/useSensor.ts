import useSWR from 'swr';

import { getTemperatureHumidity } from '../lib/py/pyapi';
import config from '../utils/config';

const useSensor = (params?: any) => {
    const { data, error } = useSWR(
        `/temperature-humidity`,
        getTemperatureHumidity,
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
        data,
        isLoading: !error && !data,
        isError: error,
    };
};

export default useSensor;
