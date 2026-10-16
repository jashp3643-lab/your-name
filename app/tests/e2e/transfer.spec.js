const { test, expect } = require('@playwright/test');
const { go, pathOf, login } = require('./helpers');

async function savedBeneToAuthorize(page, amount) {
  await go(page, '/transfer');
  await page.getByTestId('saved-bene').first().click();
  await page.getByTestId('amount-input').fill(String(amount));
  await page.getByTestId('purpose').selectOption({ index: 1 });
  await page.getByTestId('proceed-amount').click();
  await expect(page.getByTestId('transfer-authorize')).toBeVisible();
}

test.describe('fund transfer', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('methods and saved beneficiaries render', async ({ page }) => {
    await go(page, '/transfer');
    await expect(page.getByTestId('transfer-methods')).toBeVisible();
    expect(await page.getByTestId('saved-bene').count()).toBeGreaterThan(0);
  });

  test('amount validation blocks empty and over-balance values', async ({ page }) => {
    await go(page, '/transfer');
    await page.getByTestId('saved-bene').first().click();
    await page.getByTestId('proceed-amount').click();
    expect(await pathOf(page)).toMatch(/transfer\/amount/);
    await page.getByTestId('amount-input').fill('99999999');
    await page.getByTestId('purpose').selectOption({ index: 1 });
    await page.getByTestId('proceed-amount').click();
    expect(await pathOf(page)).toMatch(/transfer\/amount/);
  });

  test('wrong transaction PIN is rejected', async ({ page }) => {
    await savedBeneToAuthorize(page, 100);
    await page.getByTestId('txn-pin').fill('123456');
    await expect(page.getByTestId('pin-error')).toBeVisible();
    expect(await pathOf(page)).toMatch(/transfer\/authorize/);
  });

  test('correct PIN completes, receipt shows, ledger and balance update', async ({ page }) => {
    await go(page, '/accounts');
    const balBefore = await page.getByTestId('account-card').first().innerText();
    await savedBeneToAuthorize(page, 100);
    await page.getByTestId('txn-pin').fill('250219');
    await expect(page.getByTestId('transfer-success')).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId('success-amount')).toContainText('100');
    await expect(page.getByTestId('success-ref')).not.toBeEmpty();
    await go(page, '/accounts');
    const balAfter = await page.getByTestId('account-card').first().innerText();
    expect(balAfter).not.toEqual(balBefore);
    await go(page, '/transactions');
    await expect(page.getByTestId('tx-row').first()).toBeVisible();
  });

  test('new within-bank beneficiary validates fields', async ({ page }) => {
    await go(page, '/transfer');
    await page.getByTestId('method-quick').click();
    await page.getByTestId('proceed-new').click();
    await expect(page.locator('.field__error').first()).toBeVisible();
    expect(await pathOf(page)).toMatch(/transfer\/new/);
  });
});

test('settings reset restores demo data', async ({ page }) => {
  await login(page);
  await go(page, '/settings');
  await page.getByTestId('reset-data').click();
  await page.getByRole('button', { name: /^reset$/i }).click();
  await expect(page.getByTestId('settings-screen')).toBeVisible();
});

test('every secondary screen loads without console errors', async ({ page }) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await login(page);
  for (const r of ['accounts', 'loans', 'favorites', 'insurance', 'investments', 'scan', 'services', 'notifications', 'search', 'settings', 'deposits/new', 'deposits/requests']) {
    await go(page, `/${r}`);
    await page.waitForTimeout(250);
    await expect(page.locator('main.screen')).toBeVisible();
  }
  expect(errs).toEqual([]);
});
