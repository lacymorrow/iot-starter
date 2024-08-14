import { useEffect, useRef } from 'react';

import QRCode from 'qrcode';

import pylog from '@/lib/py/pylog';

const QrCode = ({ data }: { data: string }) => {
    const qrEl = useRef(null);

    useEffect(() => {
        if (data && data !== 'undefined') {
            QRCode.toCanvas(qrEl.current, data, async (error) => {
                if (error) await window.pywebview?.api?.log(error);
                await pylog(`Created QR: ${data}`);
            });
        }
    }, [data]);

    return <canvas ref={qrEl}></canvas>;
};

export default QrCode;
