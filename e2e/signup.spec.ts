import { test, expect } from '@playwright/test';

test('회원가입 성공', async ({ page }) => {
  await page.goto('/auth');

  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.getByRole('button').click();

  await expect(page).toHaveURL('/');

  await expect(page.locator('h1')).toContainText('Welcome');
});
