import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/auth`);

  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.getByRole('button').click();

  await page.waitForURL(`${baseURL}`);

  const storageState = await page
    .context()
    .storageState({ path: 'storageState.json' });

  await browser.close();
  return storageState;
}

export default globalSetup;
