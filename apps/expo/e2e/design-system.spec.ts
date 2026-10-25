import { expect, test } from '@playwright/test';

// openspec: design-system › PhotoViewer › "Keyboard on web"
test('PhotoViewer: arrow keys move, Escape closes', async ({ page }) => {
  await page.goto('/design-system');
  await page.getByRole('button', { name: /^Photo 3 of 10/ }).first().click();
  const position = page.getByTestId('photo-viewer-position');
  await expect(position).toHaveText('3 / 10');
  await page.keyboard.press('ArrowRight');
  await expect(position).toHaveText('4 / 10');
  await page.keyboard.press('Escape');
  await expect(position).toHaveCount(0);
});
