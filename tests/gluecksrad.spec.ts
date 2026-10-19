import { expect as baseExpect, test } from '@playwright/test'

const origin = 'http://localhost:4173'
// The real CDN library and WebGL renderer can take a few seconds to initialize.
const expect = baseExpect.configure({ timeout: 15_000 })
test.use({ reducedMotion: 'reduce' })

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
