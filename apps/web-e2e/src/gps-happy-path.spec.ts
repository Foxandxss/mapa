import { expect, test } from '@playwright/test';

const MADRID = { latitude: 40.4168, longitude: -3.7038 };

const STUB_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#e6e6e6' },
    },
  ],
};

test.describe('GPS happy path', () => {
  test.use({
    permissions: ['geolocation'],
    geolocation: MADRID,
  });

  test('shows GPS badge and a marker once the fix arrives', async ({ page }) => {
    await page.route('**/api.maptiler.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_STYLE),
      });
    });

    await page.goto('/');

    await expect(page.getByText('Ubicación GPS')).toBeVisible();
    await expect(page.locator('.maplibregl-marker').first()).toBeVisible();
  });
});
