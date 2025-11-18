import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";


//A: ARRANGE
//1. a page is loaded.
//2. object of LoginPage is created.
//3. navigates to login page.
let login;

test.beforeEach(async ({ page }) => {
  login = new LoginPage(page);
  await login.navigateToLoginPage();
});

test("Login with valid credentials", async ({ page }) => {
  await login.validLogin(); //Action
  await login.clickLoginButton();
  // A: ASSERT, confirms login 
  await expect(page).toHaveURL(process.env.BASE_URL);
  console.log("Logged in");
});

test("Login with invalid facility code", async ({ page }) => {
    // A: ACT, attempts login with fake facility code.
  await login.invalidFacilityCodeLogin();
  await login.clickLoginButton();
    //A: Assert
  const toast = page.getByText(/invalid facility code/i);
  await expect(toast).toBeVisible({ timeout: 1000 });
});

test("Login with invalid email", async ({ page }) => {
    //A: ACT
  await login.invalidEmailLogin();
  await login.clickLoginButton();
  //A: ASSERT
  const toast = page.getByText(/user not registered/i);
  await expect(toast).toBeVisible({ timeout: 8000 });
});

test("Login with invalid password", async ({ page }) => {
    //A: ACT
  await login.invalidPasswordLogin();
  await login.clickLoginButton();
  //A: ASSERT
  const toast = page.getByText(/invalid credentials/i);
  await expect(toast).toBeVisible({ timeout: 15000 });
});

test("Login with empty credentials", async ({ page }) => {
    //ACT
  await login.clickLoginButton();
    //Assert
  await expect(page.getByText(/facility.*required/i)).toBeVisible({
    timeout: 8000,
  });
  await expect(page.getByText(/email.*required/i)).toBeVisible();
  await expect(page.getByText(/password.*required/i)).toBeVisible();
});

test("test login with SQL injection attempts", async ({ page }) => {
    //Act
  await login.sqlInjectionLogin();
  await login.clickLoginButton();
  //Assert
  const toast = page.getByText(
    /value is not a valid email address: An email address must have an @-sign./i
  );
  await expect(toast).toBeVisible({ timeout: 8000 });
});

test("test login with XSS atempt", async ({ page }) => {
    //Act
  await login.xxsLogin();
  //Assert
  await expect(page).not.toHaveURL(/alert/);
});
