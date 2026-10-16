const { test, expect } = require('@playwright/test');
const { go, login, trackErrors } = require('./helpers');

test.describe('home', () => {
  test('tiles start masked and reveal per tile', async ({ page }) => {
    await login(page);
    const tile = page.getByTestId('tile-accounts');
    await expect(tile).toContainText('XXXX');
    await tile.getByRole('button', { name: /show|view|reveal|balance/i }).first().click();
    await expect(tile).not.toContainText('XXXX');
    await expect(tile).toContainText('₹');
    await expect(page.getByTestId('tile-deposits')).toContainText('XXXX');
  });

  test('stories open a sheet that closes with Escape', async ({ page }) => {
    await login(page);
    await page.locator('.story').first().click();
    await expect(page.getByTestId('story-sheet')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('story-sheet')).toHaveCount(0);
  });

  test('UPI activation stores an id', async ({ page }) => {
    await login(page);
    await page.getByTestId('upi-strip').getByRole('button').click();
    await page.getByRole('button', { name: /activate|create|continue|confirm/i }).last().click();
    await expect(page.getByTestId('upi-strip')).toContainText('@');
  });
});

test.describe('transactions', () => {
  test.beforeEach(async ({ page }) => { await login(page); await go(page, '/transactions'); });

  test('shows loading then month-grouped list', async ({ page }) => {
    const errs = trackErrors(page);
    await expect(page.getByTestId('tx-row').first()).toBeVisible();
    expect(await page.getByTestId('tx-band').count()).toBeGreaterThan(0);
    expect(errs).toEqual([]);
  });

  test('search filters rows and empty state appears for no match', async ({ page }) => {
    await expect(page.getByTestId('tx-row').first()).toBeVisible();
    const before = await page.getByTestId('tx-row').count();
    await page.getByTestId('tx-search').fill('IMPS');
    await expect.poll(() => page.getByTestId('tx-row').count()).toBeLessThan(before);
    await page.getByTestId('tx-search').fill('zzzz-nothing');
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('duration sheet lists options and closes on selection', async ({ page }) => {
    await page.getByTestId('duration-btn').click();
    const sheet = page.getByTestId('duration-sheet');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('radio').first()).toBeVisible();
    await sheet.getByRole('radio').nth(1).click();
    await expect(sheet).toHaveCount(0);
  });

  test('filter and sort sheets open and apply', async ({ page }) => {
    await page.getByTestId('filter-btn').click();
    await expect(page.getByTestId('filter-sheet')).toBeVisible();
    await page.getByTestId('filter-apply').click();
    await expect(page.getByTestId('filter-sheet')).toHaveCount(0);
    await page.getByTestId('sort-btn').click();
    await expect(page.getByTestId('sort-sheet')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sort-sheet')).toHaveCount(0);
  });

  test('statement request sheet submits', async ({ page }) => {
    await page.getByTestId('statement-btn').click();
    await expect(page.getByTestId('statement-sheet')).toBeVisible();
    await page.getByTestId('statement-period').selectOption({ index: 1 });
    await page.getByTestId('statement-submit').click();
    await expect(page.getByTestId('statement-sheet')).toHaveCount(0);
  });

  test('spend analysis tab renders totals', async ({ page }) => {
    await page.getByRole('tab', { name: /spend/i }).click();
    await expect(page.getByTestId('spend-view')).toBeVisible();
  });
});
