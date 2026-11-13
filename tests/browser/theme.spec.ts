import { test, expect } from '@playwright/test';

test('System theme follows the device while explicit choices override it', async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	const picker = page.getByRole('combobox', { name: 'Theme', exact: true });
	await expect(picker).toHaveValue('system');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.emulateMedia({ colorScheme: 'light' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await picker.selectOption('dark');
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.emulateMedia({ colorScheme: 'light' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await picker.selectOption('system');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await page.reload();
	await expect(picker).toHaveValue('system');
	await page.emulateMedia({ colorScheme: 'dark' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('an invalid saved theme falls back to System', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('theme', 'obsolete'));
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await expect(
		page.getByRole('combobox', { name: 'Theme', exact: true }),
	).toHaveValue('system');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('theme selection works when local storage is unavailable', async ({
	page,
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.addInitScript(() => {
		Object.defineProperty(window, 'localStorage', {
			get() {
				throw new Error('Storage unavailable');
			},
		});
	});
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	const picker = page.getByRole('combobox', { name: 'Theme', exact: true });
	await picker.selectOption('light');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await picker.selectOption('system');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	expect(errors).toEqual([]);
});
