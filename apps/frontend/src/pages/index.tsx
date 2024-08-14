/*
	loading states
	SSR/SSG
	type: any
*/

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { NavigateNext } from '@mui/icons-material';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { buttonVariants } from '@/components/ui/button';

import Qr from '@/components/Qr';
import useDevice from '@/hooks/useDevice';

const Index = () => {
    const [message, setMessage] = useState('Initial-Lizz-ing...');
    const { hwid } = useDevice();
    const router = useRouter();

    /* message countdown from 5 then redirect to /dashboard */
    useEffect(() => {
        if (hwid) {
            let count = 2;
            const interval = setInterval(() => {
                setMessage(`Starting in ${count} seconds...`);
                count -= 1;
            }, 1000);
            setTimeout(() => {
                clearInterval(interval);
                setMessage('starting...');
                router.push('/dashboard');
            }, count * 1000);
        }
    }, [hwid, router]);

    return (
        <>
            <div className="flex h-full flex-col justify-between">
                <CardHeader>
                    <CardTitle>LizzControl</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>

                <div className="flex flex-col items-center justify-center">
                    <Qr data={hwid} />
                </div>

                <Link
                    className={buttonVariants()}
                    href="/dashboard"
                    passHref
                    {...(hwid ? {} : { disabled: true })}
                >
                    Dashboard{' '}
                    {hwid ? (
                        <NavigateNext />
                    ) : (
                        <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                    )}
                </Link>
            </div>
        </>
    );
};

export default Index;
