const { test, expect } = require('@playwright/test');
const { go, login } = require('./helpers');

test.describe('deposits, FD, nominee', () => {
  test.beforeEach(async ({ page }) => { await login(page); await go(page, '/deposits'); });

  test('deposits shows spinner then an FD row', async ({ page }) => {
    await expect(page.getByTestId('fd-row').first()).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId('deposits-total')).toBeVisible();
  });

  test('FD details show computed values and downloadable summary', async ({ page }) => {
    await page.getByTestId('fd-row').first().click();
    await expect(page.getByTestId('fd-screen')).toBeVisible();
    await expect(page.getByTestId('fd-current')).toContainText('₹');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('fd-download').click()]);
    expect(dl.suggestedFilename()).toMatch(/\.txt$/);
  });

  test('nominee view, edit validation and save', async ({ page }) => {
    await page.getByTestId('fd-row').first().click();
    await page.getByTestId('view-nominee').click();
    await expect(page.getByTestId('nominee-view')).toBeVisible();
    await page.getByTestId('edit-nominee').click();
    await expect(page.getByTestId('nominee-edit')).toBeVisible();
    // break the share total, expect a summary error
    const share = page.getByTestId('nominee-edit').locator('input[inputmode="numeric"], input[type="number"]').first();
    await share.fill('40');
    await page.getByTestId('nominee-save').click();
    await expect(page.getByTestId('nominee-summary-error')).toBeVisible();
    await share.fill('100');
    await page.getByTestId('nominee-save').click();
    await expect(page.getByTestId('nominee-view')).toBeVisible();
  });
});
