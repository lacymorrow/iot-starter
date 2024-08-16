import createJiti from "jiti";
import { fileURLToPath } from "url";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
	output: "export",
	reactStrictMode: true,

	/** Enables hot reloading for local packages without a build step */
	transpilePackages: [
		"@/components", // We explicitly use `@/components/ui` for easy copy-pasting between shadcn projects
		"@/lib",
		"@lacy/api",
		"@lacy/auth",
		"@lacy/db",
		"@lacy/validators",
	],

	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },

	// Additional configurations from iot-cloud
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 's.gravatar.com',
			port: '',
			pathname: '/avatar/**',
		}],
	},
};

export default config;
