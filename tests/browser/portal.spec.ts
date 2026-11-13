import { test, expect } from '@playwright/test';
test('documentation is navigable, searchable and excludes drafts', async ({
	page,
	request,
}) => {
	await page.goto('/');
	await expect(
		page.getByRole('navigation', { name: 'Navigation' }),
	).toBeVisible();
	await page
		.getByRole('searchbox', { name: 'Search documentation' })
		.fill('parameters');
	await expect(
		page
			.locator('[data-search-results]')
			.getByRole('link', { name: 'API parameters' }),
	).toBeVisible();
	expect((await request.get('/guides/draft/')).status()).toBe(404);
	const index = await (await request.get('/search.json')).json();
	expect(
		index.some((entry: { title: string }) => entry.title === 'Draft sentinel'),
	).toBe(false);
});

test('portal pages and sample content are in English', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
	for (const route of [
		'/guides/getting-started/',
		'/guides/diagrams/',
		'/reference/api/',
		'/reference/environments/',
	]) {
		await page.goto(route);
		await expect(page.locator('body')).not.toContainText(/[А-Яа-яЁё]/);
	}
});

test('search is in the horizontal navbar and results overlay the page', async ({
	page,
}) => {
	await page.goto('/');
	const header = page.getByRole('banner');
	const search = header.getByRole('searchbox', {
		name: 'Search documentation',
	});
	await expect(search).toBeVisible();
	await expect(page.locator('.sidebar').getByRole('searchbox')).toHaveCount(0);
	const heading = await page
		.getByRole('heading', { name: 'Overview' })
		.boundingBox();
	await search.fill('parameters');
	await expect(
		header.getByRole('link', { name: 'API parameters' }),
	).toBeVisible();
	expect(
		await page.getByRole('heading', { name: 'Overview' }).boundingBox(),
	).toEqual(heading);
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(search).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
});

test('Cmd+K and Ctrl+K focus search and select the existing query', async ({
	page,
}) => {
	await page.goto('/');
	const search = page.getByRole('searchbox', { name: 'Search documentation' });
	for (const shortcut of ['Meta+k', 'Control+k']) {
		await search.fill('parameters');
		await page.getByRole('heading', { name: 'Overview' }).click();
		await page.keyboard.press(shortcut);
		await expect(search).toBeFocused();
		expect(
			await search.evaluate((input: HTMLInputElement) =>
				input.value.slice(input.selectionStart ?? 0, input.selectionEnd ?? 0),
			),
		).toBe('parameters');
	}
});

test('search shortcut stays inside the input and navbar controls remain aligned', async ({
	page,
}) => {
	await page.goto('/');
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 900 });
		const input = await page
			.getByRole('searchbox', { name: 'Search documentation' })
			.boundingBox();
		const shortcut = await page.locator('.search-shortcut').boundingBox();
		const theme = await page
			.getByRole('combobox', { name: 'Theme', exact: true })
			.boundingBox();
		expect(input).not.toBeNull();
		expect(shortcut).not.toBeNull();
		expect(theme).not.toBeNull();
		expect(shortcut!.x).toBeGreaterThanOrEqual(input!.x);
		expect(shortcut!.x + shortcut!.width).toBeLessThanOrEqual(
			input!.x + input!.width,
		);
		expect(
			Math.abs(
				shortcut!.y + shortcut!.height / 2 - input!.y - input!.height / 2,
			),
		).toBeLessThan(1);
		expect(
			Math.abs(theme!.y + theme!.height / 2 - input!.y - input!.height / 2),
		).toBeLessThan(1);
	}
});

test('Next stays on the right when Previous is absent', async ({ page }) => {
	for (const route of ['/', '/guides/getting-started/']) {
		await page.goto(route);
		const pagination = page.getByRole('navigation', {
			name: 'Documentation pages',
		});
		const next = pagination.getByRole('link', { name: /^Next/ });
		await expect(
			pagination.getByRole('link', { name: /^Previous/ }),
		).toHaveCount(0);
		const navBox = await pagination.boundingBox();
		const nextBox = await next.boundingBox();
		expect(
			Math.abs(navBox!.x + navBox!.width - nextBox!.x - nextBox!.width),
		).toBeLessThan(1);
	}
});
