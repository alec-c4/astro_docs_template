import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests/browser',
	use: { baseURL: 'http://127.0.0.1:4339' },
	webServer: {
		command: 'npm run preview -- --ignore-lock --port 4339 --host 127.0.0.1',
		url: 'http://127.0.0.1:4339',
		reuseExistingServer: false,
	},
});
