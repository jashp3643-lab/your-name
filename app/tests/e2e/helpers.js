const { expect } = require('@playwright/test');
const hash = (process.env.E2E_TARGET || 'preview') !== 'next';
const PIN = '250219';

async function go(page, path) {
  await page.goto(hash ? `/#${path}` : path);
}
async function pathOf(page) {
  const u = new URL(page.url());
  return hash ? u.hash.replace(/^#/, '') : u.pathname;
}
async function login(page) {
  await go(page, '/login');
  const pin = page.getByTestId('mpin-input');
  await pin.waitFor();
  await pin.fill(PIN);
  await expect(page.getByTestId('home-screen')).toBeVisible();
}
function trackErrors(page) {
  const errs = [];
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(`console: ${m.text()}`); });
  return errs;
}
module.exports = { go, pathOf, login, trackErrors, PIN };
