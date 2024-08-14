import Link from 'next/link';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Qr from '@/components/Qr';
import useDevice from '@/hooks/useDevice';
import { buttonVariants } from '@/components/ui/button';

const ViewQr = () => {
    const { hwid } = useDevice();

    return (
        <>
            <div className="flex h-full flex-col justify-between">
                <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>
                        Scan the QR code with your phone or laptop to control
                        your device from anywhere.
                    </CardDescription>
                </CardHeader>

                <div className="flex flex-col items-center justify-center">
                    <Qr data={hwid} />
                </div>

                <Link className={buttonVariants()} href="/dashboard" passHref>
                    Back
                </Link>
            </div>
        </>
    );
};

export default ViewQr;
