import { expect, test } from '@playwright/test';

test('app loads and shows map attribution', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.maplibregl-ctrl-attrib')).toBeVisible();
});
