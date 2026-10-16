const { test, expect } = require('@playwright/test');
const { go, pathOf, login, trackErrors, PIN } = require('./helpers');

test.describe('login and session', () => {
  test('correct MPIN 250219 opens Home, no console errors', async ({ page }) => {
    const errs = trackErrors(page);
    await login(page);
    expect(await pathOf(page)).toBe('/home');
    expect(errs).toEqual([]);
  });

  test('on-screen keypad (shuffled) can enter the MPIN', async ({ page }) => {
    await go(page, '/login');
    await expect(page.getByTestId('keypad')).toBeVisible();
    for (const d of PIN) await page.getByTestId('keypad').getByRole('button', { name: d, exact: true }).click();
    await expect(page.getByTestId('home-screen')).toBeVisible();
  });

  test('wrong MPIN shows error and stays on login', async ({ page }) => {
    await go(page, '/login');
    await page.getByTestId('mpin-input').fill('111111');
    await expect(page.getByTestId('login-error')).toBeVisible();
    expect(await pathOf(page)).toBe('/login');
  });

  test('five wrong attempts lock the form', async ({ page }) => {
    await go(page, '/login');
    for (let i = 0; i < 5; i++) {
      const input = page.getByTestId('mpin-input');
      await expect(input).toBeEnabled();
      await input.fill('000000');
      await page.waitForTimeout(700);
      if (i < 4) await input.fill('');
    }
    await expect(page.getByTestId('login-locked')).toBeVisible();
    await expect(page.getByTestId('mpin-input')).toBeDisabled();
  });

  test('protected route redirects to login when signed out', async ({ page }) => {
    await go(page, '/deposits');
    await expect(page.getByTestId('login-screen')).toBeVisible();
  });

  test('logout returns to login and re-locks the app', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: /log ?out/i }).first().click();
    await page.getByRole('button', { name: /^log ?out$/i }).last().click();
    await expect(page.getByTestId('login-screen')).toBeVisible();
    await go(page, '/transactions');
    await expect(page.getByTestId('login-screen')).toBeVisible();
  });
});
