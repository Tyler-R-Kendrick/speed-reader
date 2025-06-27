import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = resolve(__dirname, '../dist/index.html');

test('rsvp-player fills viewport on mobile', async ({ page }) => {
  await page.goto('file://' + filePath);
  const box = await page.locator('rsvp-player').boundingBox();
  expect(box?.width).toBeCloseTo(375, 1);
  expect(box?.height).toBeCloseTo(667, 1);
});
