import config from '../../utils/config';
import { timeout } from '../../utils/utils';

const pylog = async (text: string, ...params: any) => {
    if (window.pywebview?.api?.log) {
        console.log(`[Pylog] ${text}`, ...params);
        await timeout(
            (async () => {
                await window.pywebview.api.log(text);
                return true;
            })(),
            config.TIMEOUT,
        ).catch((error) => console.log(`[Pylog] ${text} error: ${error}`));
    } else {
        console.log(`[Pylog Error] ${text}`, ...params);
    }
};

export default pylog;
