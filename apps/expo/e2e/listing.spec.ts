import { expect, test } from '@playwright/test';
import path from 'node:path';

// openspec: listing-view. Web-only scenarios plus a cross-platform smoke at 390 and 1280 px.

const API = 'http://localhost:4010';
const TITLE = 'Sunny Plateau flat with a cat who loves the balcony';
const SHOTS = path.resolve(__dirname, '../../../docs/screenshots');

test.beforeEach(async ({ request }) => {
  await request.post(`${API}/__reset`);
});

test('Browser tab', async ({ page }) => {
  await page.goto('/listing/2001');
  await expect(page.getByTestId('listing-title')).toHaveText(TITLE);
  await expect(page).toHaveTitle(`${TITLE} in Montréal | TrustedHousesitters`);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toMatch(/^Hi, I'm Camille!/);
});

test('Web without a share sheet', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
  });
  await page.goto('/listing/2001');
  await page.getByRole('button', { name: 'Share listing' }).click();
  await expect(page.getByText('Link copied')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/listing/2001`);
});

test('anonymous: page renders with the join call to action', async ({ page }, info) => {
  await page.goto('/listing/2001');
  await expect(page.getByTestId('listing-title')).toHaveText(TITLE);
  await expect(page.getByTestId('primary-cta')).toHaveText('Join now to apply');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SHOTS}/web-${info.project.name}-anonymous.png` });
});

test('full sitter: choose dates and apply', async ({ page }, info) => {
  await page.goto('/listing/2001?scenario=full-sitter');
  await expect(page.getByTestId('primary-cta')).toHaveText('Apply');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SHOTS}/web-${info.project.name}-full-sitter.png` });

  await page.getByRole('button', { name: '10 February to 24 February 2027' }).click();
  await page.getByTestId('primary-cta').click();
  await expect(page.getByText('Apply to this sit')).toBeVisible();
  await page.getByLabel('Message to Camille (optional)').fill('Hi Camille, Pickle sounds lovely!');
  await page.getByRole('button', { name: 'Send application' }).click();
  await expect(page.getByText('Application sent')).toBeVisible();
  await expect(page.getByTestId('primary-cta')).toHaveText('Applied');
});

test('resize across the breakpoint keeps selected dates', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'starts on desktop');
  await page.goto('/listing/2001?scenario=full-sitter');
  await page.getByRole('button', { name: '10 February to 24 February 2027' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId('apply-bar-dates')).toHaveText('10 – 24 Feb 27');
});
