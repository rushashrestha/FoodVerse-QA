import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { LogoutPage } from "./pages/LogoutPage.js";

let logout;

test.beforeEach(async ({ page }) => {
    logout = new LogoutPage(page);
    const login = new LoginPage(page);
    await login.navigateToLoginPage();
    await login.validLogin();
});

test("Logout Test", async () => {
    await logout.clickProfileIcon();
    await logout.clickLogoutButton();
    await logout.expectLogoutSuccess();
});