import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const baseUrl = process.env.DEMO_BASE_URL;
if (!baseUrl) throw new Error('Set DEMO_BASE_URL to the healthy local application URL.');

const repositoryRoot = path.resolve(__dirname, '../../..');
const screenshotDirectory = path.join(repositoryRoot, 'docs', 'assets', 'screenshots', 'walkthrough');
const taskTitle = '[Demo] Launch readiness review';
const employeeUpdate = 'Launch checklist reviewed; moving this synthetic task into manager review.';

mkdirSync(screenshotDirectory, { recursive: true });

test.use({
  viewport: { width: 1280, height: 720 },
  video: { mode: 'on', size: { width: 1280, height: 720 } },
});

async function hold(page: Page, milliseconds: number) {
  const points = [
    [1040, 140],
    [940, 260],
    [1060, 430],
    [880, 560],
  ] as const;
  const startedAt = Date.now();
  let index = 0;
  while (Date.now() - startedAt < milliseconds) {
    const [x, y] = points[index % points.length];
    await page.mouse.move(x, y, { steps: 18 });
    const remaining = milliseconds - (Date.now() - startedAt);
    await page.waitForTimeout(Math.min(5000, Math.max(0, remaining)));
    index += 1;
  }
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    path: path.join(screenshotDirectory, `${name}.png`),
    fullPage: true,
  });
}

async function signInWithDemo(page: Page, role: 'Admin' | 'Employee') {
  await page.getByRole('button', { name: `Use ${role} Demo` }).click();
  await page.getByRole('button', { name: 'Sign in to WorkHub' }).click();
}

test('complete consent-bound WorkHub simulation', async ({ page }) => {
  test.setTimeout(420_000);

  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Use Admin Demo' })).toBeVisible();
  await capture(page, '01-login-boundary');
  await hold(page, 20_000);

  await signInWithDemo(page, 'Admin');
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(page.getByRole('link', { name: 'Tasks', exact: true })).toBeVisible();
  await capture(page, '02-admin-dashboard');
  await hold(page, 25_000);

  await page.getByRole('link', { name: 'Tasks', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Assign new task' })).toBeVisible();
  await expect(page.getByRole('link', { name: taskTitle })).toBeVisible();
  await capture(page, '03-admin-task-register');
  await hold(page, 25_000);

  await page.getByRole('link', { name: taskTitle }).click();
  await expect(page.getByRole('heading', { name: taskTitle })).toBeVisible();
  await expect(page.getByText('Eli', { exact: true })).toBeVisible();
  await capture(page, '04-admin-task-detail');
  await hold(page, 20_000);

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await signInWithDemo(page, 'Employee');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Start from Work Mode; activity is not recorded before then.')).toBeVisible();
  await capture(page, '05-employee-dashboard-no-session');
  await hold(page, 20_000);

  await page.getByRole('link', { name: 'Work Mode', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start session' })).toBeVisible();
  await expect(page.getByText(/Starting is explicit/)).toBeVisible();
  await capture(page, '06-work-mode-before-consent');
  await hold(page, 20_000);

  await page.getByRole('button', { name: 'Start session' }).click();
  await expect(page.getByRole('button', { name: 'Stop session' })).toBeVisible();
  await capture(page, '07-work-mode-active-session');
  await hold(page, 30_000);

  await page.getByRole('link', { name: 'Tasks', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();
  const taskCard = page
    .getByText(taskTitle, { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"group")]');
  await expect(taskCard).toBeVisible();
  await capture(page, '08-employee-assignment');
  await hold(page, 25_000);

  await taskCard.getByRole('combobox').selectOption('review');
  const updatedCard = page
    .getByText(taskTitle, { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"group")]');
  await expect(updatedCard.getByRole('combobox')).toHaveValue('review');
  await capture(page, '09-employee-status-review');
  await hold(page, 20_000);

  await updatedCard.getByRole('link', { name: 'Open discussion' }).click();
  await expect(page.getByRole('heading', { name: taskTitle })).toBeVisible();
  await page.getByPlaceholder('Share a quick update or question').fill(employeeUpdate);
  await page.getByRole('button', { name: 'Add comment' }).click();
  await expect(page.getByText(employeeUpdate)).toBeVisible();
  await capture(page, '10-employee-comment');
  await hold(page, 25_000);

  await page.getByRole('link', { name: 'Work Mode', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Stop session' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop session' }).click();
  await expect(page.getByRole('button', { name: 'Start session' })).toBeVisible();
  await capture(page, '11-work-mode-stopped');
  await hold(page, 25_000);

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await signInWithDemo(page, 'Admin');
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await hold(page, 20_000);

  await page.getByRole('link', { name: 'Tasks', exact: true }).click();
  await expect(page.getByRole('link', { name: taskTitle })).toBeVisible();
  await capture(page, '12-manager-verification-register');
  await hold(page, 20_000);

  await page.getByRole('link', { name: taskTitle }).click();
  await expect(page.getByRole('heading', { name: taskTitle })).toBeVisible();
  await expect(page.locator('span').filter({ hasText: /^review$/ }).first()).toBeVisible();
  await expect(page.getByText(employeeUpdate)).toBeVisible();
  await capture(page, '13-manager-verification-detail');
  await hold(page, 25_000);

  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await capture(page, '14-complete-workflow');
  await hold(page, 10_000);
});
