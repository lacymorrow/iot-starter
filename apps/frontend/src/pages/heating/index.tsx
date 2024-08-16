import { Button, buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { deleteCron, pyget, pyset, updateCron } from '@/lib/py/pyapi';
import pylog from '@/lib/py/pylog';
import { fahrenheitToCelcius } from '@/utils/fahrenheitToCelcius';
import { MinusIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CRON_NAME = 'trigger';
const DEFAULT_TEMPERATURE = 70;
const MIN_TEMPERATURE = 60;
const MAX_TEMPERATURE = 100;

export default function Heating() {
	const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
	const router = useRouter();

	useEffect(() => {
		pyget(CRON_NAME)
			.then((result: any) => {
				if (
					result &&
					result >= MIN_TEMPERATURE &&
					result <= MAX_TEMPERATURE
				) {
					pylog(result);
					setTemperature(result);
				}
			})
			.catch((error) => {
				pylog(error);
			});
	}, []);

	const handleTurnOff = async () => {
		await pyset(CRON_NAME, 0);
		await deleteCron(CRON_NAME)
			.then((result) => {
				pylog(result);
				router.push('/dashboard');
			})
			.catch((error) => {
				pylog(error);
			});
	};

	const handleTurnOn = async () => {
		const celcius = fahrenheitToCelcius(temperature);

		await pyset(CRON_NAME, celcius);
		await updateCron(
			CRON_NAME,
			'* * * * * python /home/pi/firmware/apps/firmware/pybin/trigger.py',
			CRON_NAME,
		)
			.then((result) => {
				pylog(result);
				router.push('/dashboard');
			})
			.catch((error) => {
				pylog(error);
			});
	};

	const handleDecreaseTemperature = () => {
		if (temperature > MIN_TEMPERATURE) {
			setTemperature(temperature - 1);
		}
	};

	const handleIncreaseTemperature = () => {
		if (temperature < MAX_TEMPERATURE) {
			setTemperature(temperature + 1);
		}
	};

	return (
		<Card className="flex h-full flex-col justify-between">
			<CardHeader>
				<CardTitle>Heating</CardTitle>
				<CardDescription className="flex justify-between gap-2">
					Keep above this temperature
				</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-around gap-2">
				<Button
					variant={'outline'}
					size={'lg'}
					onClick={handleDecreaseTemperature}
				>
					<MinusIcon />
				</Button>
				<p className="text-4xl font-bold">{temperature || '--'}°F</p>
				<Button
					variant={'outline'}
					size={'lg'}
					onClick={handleIncreaseTemperature}
				>
					<PlusIcon />
				</Button>
			</CardContent>
			<CardFooter className="flex justify-between gap-2">
				<Link
					href="/dashboard"
					className={buttonVariants({ variant: 'secondary' })}
				>
					Back
				</Link>
				<div className="flex gap-2">
					<Button
						onClick={handleTurnOff}
						className={buttonVariants({
							variant: 'destructive',
						})}
					>
						Turn off
					</Button>
					<Button
						onClick={handleTurnOn}
						className={buttonVariants({
							variant: 'default',
						})}
					>
						Turn on
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
