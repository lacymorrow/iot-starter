import { ReactNode } from 'react';

import { Inter as FontSans } from 'next/font/google';


import Meta from '@/components/Meta';
import { Button } from '@/components/ui/button';
import { shutdown } from '@/lib/py/pyapi';
import { cn } from '@/lib/utils';
import config from '@/utils/config';
import { PowerOffIcon } from 'lucide-react';

export const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});
type MainLayoutProps = {
	children: ReactNode;
};

const handleShutdown = () => {
	shutdown();
};

const MainLayout = (props: MainLayoutProps) => {
	return (
		<>
			<Meta
				title={`${config.title}: ${config.tagline}`}
				description={config.description}
			/>
			<div
				className={cn(
					'bg-background font-sans antialiased',
					'h-[320px] w-[480px] border-solid border-2 border-black p-2 relative', // bounds
					'grid grid-cols-1 grid-rows-1 items-center', // grid
					fontSans.variable,
				)}
			>
				<Button
					variant="outline"
					size="icon"
					className="absolute left-2 top-2"
					onClick={handleShutdown}
				>
					<PowerOffIcon />
				</Button>

				{props.children}
			</div>
		</>
	);
};

export default MainLayout;
