import { useEffect, useMemo } from 'react';

import {
    AcUnit,
    Cable,
    QrCode2,
    Thermostat,
    Wifi,
    WifiOff,
} from '@mui/icons-material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Loader2Icon, PowerIcon, PowerOffIcon, Waves } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { celciusToFahrenheit } from '@/utils/celciusToFahrenheit';

import useDevice from '@/hooks/useDevice';
import useDevicePowerStatus from '@/hooks/useDevicePowerStatus';
import useIp from '@/hooks/useIp';
import useSensor from '@/hooks/useSensor';
import { setDevicePower } from '@/lib/py/pyapi';
import mathRoundTruncate from '@/utils/mathRoundTruncate';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useSWRConfig } from 'swr';

const Dashboard = () => {
    const { mutate } = useSWRConfig();

    const { hwid } = useDevice();
    const { ip } = useIp();
    const { status, isLoading } = useDevicePowerStatus();
    const { data: tempHum } = useSensor();

    // Trigger revalidation for all hooks
    useEffect(() => {
        mutate(() => true);
    }, [mutate]);

    const handleClickPower = async () => {
        setDevicePower(!status);
    };

    const fahrenheit = useMemo(() => {
        if (!tempHum?.temperature) return '---';
        return mathRoundTruncate(celciusToFahrenheit(tempHum.temperature), 2);
    }, [tempHum?.temperature]);

    return (
        <>
            <div className=" flex h-full flex-col justify-between">
                <div className="flex justify-between gap-2">
                    <CardHeader>
                        <CardTitle>
                            <PowerSettingsNewIcon /> Device Power
                        </CardTitle>
                        <CardDescription>
                            Controlling device power status
                        </CardDescription>
                    </CardHeader>
                    <Link href="/heating">
                        <Card>
                            <CardHeader>
                                <CardTitle>Heating</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <Waves className="h-6 w-6" />
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/schedule">
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <CalendarIcon className="h-6 w-6" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
                            <CardTitle className="">Temperature</CardTitle>
                            <Thermostat />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tempHum?.temperature} °C
                            </div>
                            <p className="text-muted-foreground">
                                {fahrenheit} °F
                            </p>
                        </CardContent>
                    </Card>

                    <Card onClick={handleClickPower} className="cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-center space-x-2 space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold">
                                {status ? 'On' : 'Off'}
                            </CardTitle>
                            {status ? (
                                <PowerIcon size={12} />
                            ) : (
                                <PowerOffIcon size={12} />
                            )}
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center gap-2">
                            {isLoading ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                <Switch checked={status} />
                            )}
                            {/* {status ? <PowerIcon /> : <PowerOffIcon />} */}
                        </CardContent>
                    </Card>

                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
                                <CardTitle className="">Humidity</CardTitle>
                                <AcUnit />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {tempHum?.humidity}%
                                </div>
                                {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
                            </CardContent>
                        </Card>
                    </>
                </div>
                <div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-3 text-xs">
                        {/* QR Button, Power button, Wifi Disconnected button */}
                        <div className="flex items-center gap-2">
                            <Cable fontSize="small" />
                            {hwid || 'unknown'}
                        </div>

                        <Link
                            href="/settings/view-qr"
                            className={cn(
                                buttonVariants({ variant: 'ghost' }),
                                'w-full flex justify-center',
                            )}
                        >
                            <QrCode2 fontSize="large" />
                        </Link>
                        <Link
                            href="/wifi"
                            className={cn(
                                buttonVariants({ variant: 'ghost' }),
                                'flex gap-2 items-center justify-end text-xs',
                            )}
                        >
                            {ip ? (
                                <>
                                    {ip}
                                    <Wifi fontSize="small" />
                                </>
                            ) : (
                                <>
                                    Disconnected
                                    <WifiOff fontSize="small" />
                                </>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/*
		Settings
			- wifi
			- device
		- about
		- Pairing
    - qr
    - schedule */}
        </>
    );
};

export default Dashboard;
