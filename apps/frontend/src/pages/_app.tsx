import { AppProps } from 'next/app';
import Head from 'next/head';

import MainLayout from '@/components/layouts/MainLayout';
import '@/styles/global.scss';
// import "~/app/globals.css";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

declare global {
	interface Window {
		pywebview?: any;
	}
}

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</Head>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<MainLayout>
					<Component {...pageProps} />
				</MainLayout>
			</LocalizationProvider>
		</>
	);
};

export default App;
