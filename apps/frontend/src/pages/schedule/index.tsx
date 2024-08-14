import { Button, buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { deleteAllCrons, deleteCron, getCrons } from '@/lib/py/pyapi';
import pylog from '@/lib/py/pylog';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Schedule() {
	const [crons, setCrons] = useState({});

	const fetchCrons = async () => {
		const result = await getCrons().catch((error) => {
			pylog(error);
		});
		setCrons(result);
	};

	useEffect(() => {
		fetchCrons();
	}, []);

	const handleDelete = async (cron: string) => {
		await deleteCron(cron)
			.then(async () => {
				pylog('Cron deleted');
				await fetchCrons();
			})
			.catch(async (error) => {
				await pylog(error);
			});
	};

	const handleDeleteAll = async () => {
		await deleteAllCrons();
		await fetchCrons();
	};

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Schedule</CardTitle>
					<CardDescription>
						Schedule a time to turn on or off.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul>
						{Object.entries(crons).map(([name, cron]) => {
							if (typeof cron !== 'string') {
								return null;
							}

							return (
								<li key={cron}>
									<div className="flex justify-between">
										<div>
											{name}: {cron}
										</div>
										<Button
											onClick={() => handleDelete(name)}
											variant={"destructive"}
										>
											Delete
										</Button>
									</div>
								</li>
							);
						})}
					</ul>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Link
						href="/dashboard"
						className={buttonVariants({ variant: 'secondary' })}
					>
						Back
					</Link>
					<Button variant={"destructive"} onClick={handleDeleteAll}>Delete all</Button>
					<Link href="/schedule/create" className={buttonVariants()}>
						Create new event
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
