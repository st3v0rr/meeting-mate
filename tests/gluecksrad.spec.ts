import { expect as baseExpect, test } from '@playwright/test'

const origin = 'http://localhost:4173'
// The real CDN library and WebGL renderer can take a few seconds to initialize.
const expect = baseExpect.configure({ timeout: 15_000 })
test.use({ contextOptions: { reducedMotion: 'reduce' } })

test('without parameters the wheel starts empty', async ({ page }) => {
	await page.goto(`${origin}/`)
	await page.getByTitle('Glücksrad', { exact: true }).click()
	await expect(page.locator('#list .empty-list')).toBeVisible()
	await expect(page.locator('#count')).toHaveText('0 im Rad')
	await expect(page.locator('#spinBtn')).toBeDisabled()
})

test('the dice link carries the shared TribeClub members into the wheel', async ({ page }) => {
	await page.goto(`${origin}/?tc`)
	await expect(page.locator('.memberList .member')).toHaveCount(12)
	const names = await page.locator('.memberList .member').allTextContents()
	await page.getByTitle('Glücksrad', { exact: true }).click()
	await expect(page.locator('#list .nm')).toHaveText(names.map((name) => name.trim()))
	await expect(page.locator('#count')).toHaveText('12 im Rad')
})

test('direct wheel URLs use the shared URL initialization', async ({ page }) => {
	await page.goto(`${origin}/gluecksrad?ad`)
	await expect(page.locator('#list .nm')).toHaveText(['Thilo', 'Mirko', 'Kati'])
	await page.goto(`${origin}/gluecksrad?tc&members=Alice,Bob`)
	await expect(page.locator('#list .nm')).toHaveText(['Alice', 'Bob'])
})

test('wheel edits and attendance are reflected on the main page and on reopening', async ({
	page
}) => {
	await page.goto(`${origin}/?members=Alice,Bob`)
	await page.getByTitle('Glücksrad', { exact: true }).click()
	await expect(page.locator('#list .nm')).toHaveText(['Alice', 'Bob'])
	await page.locator('#list .row').filter({ hasText: 'Alice' }).click()
	await page
		.locator('#list .row')
		.filter({ hasText: 'Bob' })
		.getByRole('button', { name: 'Löschen' })
		.click()
	await page.locator('#nameInput').fill('Charlie,Charlie')
	await page.getByRole('button', { name: 'Eintragen', exact: true }).click()
	await expect(page.locator('#list .nm')).toHaveText(['Alice', 'Charlie'])
	await expect(page.locator('#count')).toHaveText('1 im Rad')
	await page.goBack()
	await expect(page.locator('.memberList .member')).toHaveText(['Charlie'])
	await page.getByTitle('Glücksrad', { exact: true }).click()
	await expect(page.locator('#list .nm')).toHaveText(['Alice', 'Charlie'])
	await expect(page.locator('#count')).toHaveText('1 im Rad')
	await page.getByRole('button', { name: 'Liste leeren' }).click()
	await page.goBack()
	await expect(page.locator('.memberList .member')).toHaveCount(0)
})

test('a saved wheel list cannot override the shared members', async ({ page }) => {
	await page.addInitScript(() => {
		;(window as any).storage = {
			get: async () => ({
				value: JSON.stringify({ people: [{ id: 'p1', name: 'Old member', on: true }] })
			}),
			set: async () => {}
		}
	})
	await page.goto(`${origin}/gluecksrad?members=Alice`)
	await expect(page.locator('#list .nm')).toHaveText(['Alice'])
})

for (const theme of [
	{ name: 'default', label: 'Glücksrad', accent: 'rgb(54, 94, 76)' },
	{ name: 'adorsys', label: 'adorsys', accent: 'rgb(47, 44, 249)' },
	{ name: 'tribeclub', label: 'TribeCLUB', accent: 'rgb(125, 38, 63)' }
]) {
	test(`the wheel uses the ${theme.name} theme selected in settings`, async ({
		page
	}, testInfo) => {
		await page.goto(`${origin}/?members=Alice,Bob`)
		await page.locator('a[href="/settings"]').click()
		await page.locator('select').selectOption(theme.name)
		await page.goBack()
		await page.getByTitle('Glücksrad', { exact: true }).click()
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(theme.label)
		await expect(page.locator('.gluecksrad')).toHaveAttribute('data-wheel-theme', theme.name)
		await expect(page.locator('#list .nm')).toHaveText(['Alice', 'Bob'])
		await expect(page.locator('#list .swatch').first()).toHaveCSS('background-color', theme.accent)
		if (theme.name !== 'tribeclub') {
			await expect(page.locator('#foamBg')).toBeHidden()
		}
		await page.screenshot({ path: testInfo.outputPath(`${theme.name}.png`) })
		await page.setViewportSize({ width: 390, height: 844 })
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		await page.screenshot({ path: testInfo.outputPath(`${theme.name}-mobile.png`) })
	})
}

for (const theme of [
	{ saved: 'tribeclub', parameter: 'ad', label: 'adorsys' },
	{ saved: 'default', parameter: 'tc', label: 'TribeCLUB' }
]) {
	test(`URL ${theme.parameter} overrides saved ${theme.saved} with custom members`, async ({
		page
	}) => {
		await page.addInitScript((saved) => localStorage.setItem('theme', saved), theme.saved)
		await page.goto(`${origin}/gluecksrad?${theme.parameter}&members=Alice,Bob`)
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(theme.label)
		await expect(page.locator('#list .nm')).toHaveText(['Alice', 'Bob'])
	})
}
