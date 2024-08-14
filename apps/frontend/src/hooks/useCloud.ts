import useSWR from 'swr';

import { getWifiInfo } from '../lib/py/pyapi';

const useCloud = (params?: any) => {
    const { data, error } = useSWR(
        `/api/device/id/status`,
        getWifiInfo,
        params,
    );

    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
};

export default useCloud;
