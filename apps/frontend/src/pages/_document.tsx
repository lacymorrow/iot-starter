import Document, { Head, Html, Main, NextScript } from 'next/document';

import config from '@/utils/config';

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
	render() {
		return (
			<Html lang={config.locale}>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
