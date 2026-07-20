import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const baseUrl = process.env.DEMO_BASE_URL;
if (!baseUrl) throw new Error('Set DEMO_BASE_URL to the healthy local application URL.');

const repositoryRoot = path.resolve(__dirname, '../../..');
const auditDirectory = path.join(repositoryRoot, 'docs', 'assets', 'screenshots', 'audit');
mkdirSync(auditDirectory, { recursive: true });

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

test('verify final mobile employee dashboard', async ({ page }) => {
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  const reducedMotionDuration = await page.locator('.card').evaluate(
    (element) => getComputedStyle(element).animationDuration
  );
  expect(Number.parseFloat(reducedMotionDuration)).toBeLessThan(0.001);
  await page.screenshot({ path: path.join(auditDirectory, 'final-mobile-login.png') });
  await page.getByRole('button', { name: 'Use Employee Demo' }).click();
  await expect(page.getByLabel('Email')).toHaveValue('eli@workos.dev');
  await page.getByRole('button', { name: 'Sign in to WorkHub' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Unified workspace' })).toBeVisible();
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  console.log(`mobile-layout ${JSON.stringify(viewport)}`);
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
  await page.screenshot({ path: path.join(auditDirectory, 'final-mobile-dashboard.png') });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('button', { name: 'Close navigation' })).toBeVisible();
  await page.screenshot({ path: path.join(auditDirectory, 'final-mobile-navigation.png') });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Close navigation' })).toBeHidden();
});
