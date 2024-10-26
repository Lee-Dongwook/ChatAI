// e2e/login.test.ts
import { test, expect } from '@playwright/test';

test.describe('로그인 인증 테스트', () => {
  test('유효한 자격증명이 있으면 로그인 성공', async ({ page }) => {
    await page.goto('/auth');

    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Log In")');

    await expect(page).toHaveURL('/');

    await expect(page.locator('h1')).toContainText('Welcome, Test User');
  });

  test('유효하지 않은 자격증명이 있으면 로그인 실패 후 에러 메시지 반환', async ({
    page,
  }) => {
    await page.goto('/auth');

    await page.fill('input[name="email"]', 'wronguser@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Log In")');

    await expect(page.locator('.error-message')).toContainText(
      'Invalid credentials'
    );
  });
});
