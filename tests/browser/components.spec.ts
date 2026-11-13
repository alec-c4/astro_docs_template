import { test, expect } from '@playwright/test';

test('table filters, announces empty state and exposes sort direction', async ({
	page,
}) => {
	await page.goto('/reference/api/');
	const filter = page.getByRole('searchbox', {
		name: 'Filter by parameter name',
	});
	await filter.fill(' ID ');
	await expect(page.locator('tbody tr:visible')).toHaveCount(1);
	await filter.fill('missing');
	await expect(page.getByRole('status')).toHaveText('No matching parameters');
	await filter.fill('');
	await page.getByRole('button', { name: 'Name', exact: true }).click();
	await expect(page.locator('tbody tr').first()).toContainText('cursor');
	await expect(page.locator('th').first()).toHaveAttribute(
		'aria-sort',
		'ascending',
	);
});

test('environment tabs resolve query and support keyboard focus', async ({
	page,
}) => {
	await page.goto('/reference/environments/?env=stage');
	const stage = page.getByRole('tab', { name: 'stage', exact: true });
	await expect(stage).toHaveAttribute('aria-selected', 'true');
	await stage.focus();
	await page.keyboard.press('ArrowRight');
	await expect(
		page.getByRole('tab', { name: 'prod', exact: true }),
	).toBeFocused();
	await expect(page.getByRole('tabpanel')).toContainText('Publish');
	await page.keyboard.press('Home');
	await expect(
		page.getByRole('tab', { name: 'dev', exact: true }),
	).toBeFocused();
});

test('content remains usable without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:4339/reference/api/');
	await expect(page.locator('tbody tr')).toHaveCount(3);
	await page.goto('http://127.0.0.1:4339/reference/environments/');
	await expect(
		page.getByRole('heading', { name: 'Development' }),
	).toBeVisible();
	await expect(
		page.getByRole('heading', { name: 'Production', exact: true }),
	).toBeVisible();
	await context.close();
});

test('theme persists and Mermaid renders locally', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/guides/diagrams/');
	await expect(page.locator('[data-diagram] svg')).toBeVisible();
	const picker = page.getByRole('combobox', { name: 'Theme', exact: true });
	await picker.selectOption('dark');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.reload();
	await expect(picker).toHaveValue('dark');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.locator('[data-diagram] svg')).toBeVisible();
	expect(errors).toEqual([]);
});

test('mobile layout has no horizontal document overflow', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/reference/api/');
	await page.locator('.docs-menu summary').click();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth,
		),
	).toBe(true);
	await expect(
		page.getByRole('navigation', { name: 'Navigation', exact: true }),
	).toBeVisible();
});

test('search failure is reported and can be retried', async ({ page }) => {
	await page.route('**/search.json', (route) => route.abort());
	await page.goto('/');
	const search = page.getByRole('searchbox', { name: 'Search documentation' });
	await search.fill('api');
	await expect(page.locator('[data-search-results]')).toHaveText(
		'Search unavailable. Please try again.',
	);
	await page.unroute('**/search.json');
	await search.fill('parameters');
	await expect(page.locator('[data-search-results] a')).toContainText([
		'API parameters',
	]);
});

test('mobile navigation can be collapsed to leave space for the document', async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/reference/api/');
	const menu = page.locator('.docs-menu');
	await expect(menu).not.toHaveAttribute('open', '');
	await menu.locator('summary').click();
	await expect(menu).toHaveAttribute('open', '');
});

test('search discards stale requests when a query is repeated before loading finishes', async ({
	page,
}) => {
	let release: () => void = () => {};
	const ready = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route('**/search.json', async (route) => {
		await ready;
		await route.fulfill({
			json: [{ title: 'API parameters', text: '', href: '/reference/api/' }],
		});
	});
	await page.goto('/');
	const input = page.getByRole('searchbox', { name: 'Search documentation' });
	await input.fill('parameters');
	await input.fill('api');
	await input.fill('parameters');
	release();
	await expect(page.locator('[data-search-results] a')).toHaveCount(1);
});
