import { useEffect, useRef, useState } from 'react';

import { NavigateNext, WifiTethering } from '@mui/icons-material';
import WifiIcon from '@mui/icons-material/Wifi';
import { Autocomplete, Grid, TextField } from '@mui/material';
import {
    ArrowLeftIcon,
    EyeIcon,
    EyeOffIcon,
    Loader2Icon,
    RotateCwIcon,
} from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import useWifiInfo from '../hooks/useWifiInfo';
import {
    getIsNetworkConnected,
    getSavedNetworks,
    getWifiNetworks,
    setNewSavedNetwork,
    setWifiNetwork,
} from '../lib/py/pyapi';
import pylog from '../lib/py/pylog';
import config from '../utils/config';

const buttonClasses = 'w-full h-full flex gap-2';

const Wifi = () => {
    // const [state, setState] = useReducer<Reducer<StateType, Partial<StateType>>>(
    //   (currentState, newState) => ({ ...currentState, ...newState }),
    //   {
    //     name: '',
    //     email: '',
    //     phone: '',
    //     message: '',
    //   }
    // );

    // const handleChange = (event: any) => {
    //   const { name, value } = event.target;
    //   setState({ [name]: value });

    //   // setState((prevState) => ({
    //   //   ...prevState,
    //   //   [name]: value,
    //   // }));
    // };

    const { data: info, mutate, isError } = useWifiInfo();
    const { data: savedNetworks } = useSWR('/saved-networks', getSavedNetworks);

    const selectRef = useRef<HTMLSelectElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [network, setNetwork] = useState('');
    const [networks, setNetworks] = useState<string[]>([]);
    const [password, setPassword] = useState('');
    const [isPasswordType, setIsPasswordType] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

    const loadWifiNetworks = async () => {
        setIsLoading(true);

        const list = await getWifiNetworks();
        console.log(list);
        setNetworks(list);
        setIsLoading(false);
    };

    const autofillPassword = () => {
        if (!password && info?.ssid && savedNetworks?.[info.ssid]) {
            // Network was previously connected, save credentials
            setPassword(savedNetworks[info.ssid]);
        }
    };

    const toggleShowPassword = () => setIsPasswordType(!isPasswordType);

    const handleInput = (event: any) => {
        setPassword(event?.target?.value);
    };

    const handleInputChange = (_event: any, newInputValue: string) => {
        setNetwork(newInputValue);
    };

    const handleSelectChange = (_event: any, ssid?: string | null) => {
        if (ssid) {
            setNetwork(ssid);
            autofillPassword();
        }
    };

    const handleSubmit = async () => {
        if (network) {
            setIsConnecting(true);
            await pylog(`WiFi Connect ${network}:${password}`);
            await setWifiNetwork(network, password)
                .then((response) => pylog(`Connect WiFi: ${response}`))
                .catch(async (error) => {
                    await pylog(`WiFi Error: ${error}`);
                });
            setTimeout(() => {
                // TODO: ERROR
                getIsNetworkConnected()
                    .then(async () => {
                        // Save successful network connections for later
                        await setNewSavedNetwork(network, password);
                        console.log(
                            `Connected, saved network${network}:${password}`,
                        );
                    })
                    .finally(() => {
                        mutate();
                        setIsConnecting(false);
                        // TODO: CONFIRMATION
                    });
            }, config.NETWORK_TIMEOUT);
        } else {
            // TODO: validation error
        }
    };

    useEffect(() => {
        // TODO: display network quality
        loadWifiNetworks();
    }, []);

    useEffect(() => {
        // Auto-select network
        if (!network && info?.ssid) {
            // Set to current network
            setNetwork(info.ssid);
        } else if (!network && networks && networks[0]) {
            // Set to first in list
            setNetwork(networks[0]);
        }
    }, [info, networks]);

    return (
        <>
            <div className="block text-center">
                {(!info && !isError && <p>Getting WiFi information...</p>) ||
                isError ? (
                    <p>Enter your WiFi name (SSID) and password to connect.</p>
                ) : (
                    <h3>
                        {info?.ssid} {info?.quality} <WifiIcon />
                    </h3>
                )}

                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={9}>
                        {networks && (
                            <Autocomplete
                                autoComplete
                                autoHighlight
                                // autoSelect
                                clearOnEscape
                                freeSolo
                                openOnFocus
                                ref={selectRef}
                                disabled={isLoading || isConnecting}
                                options={networks}
                                sx={{ width: '100%' }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Network" />
                                )}
                                inputValue={network}
                                onChange={handleSelectChange}
                                onBlur={autofillPassword}
                                onInputChange={handleInputChange}
                            />
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            onClick={loadWifiNetworks}
                            className="text-md flex h-full w-full gap-2"
                        >
                            {isLoading ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                <RotateCwIcon />
                            )}{' '}
                            Refresh
                        </Button>
                    </Grid>

                    <Grid item xs={9}>
                        <TextField
                            ref={passwordRef}
                            label="Password"
                            variant="outlined"
                            value={password}
                            sx={{ width: '100%' }}
                            type={isPasswordType ? 'password' : 'text'}
                            onChange={handleInput}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            onClick={toggleShowPassword}
                            className="text-md flex h-full w-full gap-2"
                        >
                            {isPasswordType ? (
                                <>
                                    <EyeIcon /> Show
                                </>
                            ) : (
                                <>
                                    <EyeOffIcon /> Hide
                                </>
                            )}
                        </Button>
                    </Grid>

                    <div className="grid grid-cols-3">
                        <Button>
                            <Link href="/dashboard">
                                <ArrowLeftIcon /> Back
                            </Link>
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className={cn(buttonClasses, 'text-xl')}
                        >
                            {isLoading || isConnecting ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                <WifiTethering fontSize="inherit" />
                            )}
                            Connect
                        </Button>
                        <Button
                            disabled={!info?.ssid}
                            className={cn(buttonClasses, 'text-xl')}
                        >
                            {info?.ssid ? (
                                <Link href="/dashboard">
                                    Dashboard <NavigateNext />
                                </Link>
                            ) : (
                                <>
                                    Dashboard <NavigateNext />
                                </>
                            )}
                        </Button>
                    </div>
                </Grid>
            </div>
        </>
    );
};
export default Wifi;
