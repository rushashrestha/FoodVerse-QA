import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';

test('Task 2: Login', async ({ page }) => {
    const login = new LoginPage(page);

    await login.navigate();

    await login.login(process.env.FACILITY_CODE, process.env.EMAIL, process.env.PASSWORD);

    await expect(page).toHaveURL(process.env.BASE_URL);
    console.log("Logged in");
});
