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

test("Login with valid credentials", async () => {
  await login.validLogin(); //Action
  await login.clickLoginButton();
  // A: ASSERT, confirms login 
  await login.expectSuccess();
  console.log("Logged in");
});

test("Login with invalid facility code", async () => {
    // A: ACT, attempts login with fake facility code.
  await login.invalidFacilityCodeLogin();
  await login.clickLoginButton();
    //A: Assert
  await login.expectToast("invalid facility code");
});

test("Login with invalid email", async () => {
    //A: ACT
  await login.invalidEmailLogin();
  await login.clickLoginButton();
  //A: ASSERT
  await login.expectToast("user not registered");
});

test("Login with invalid password", async () => {
    //A: ACT
  await login.invalidPasswordLogin();
  await login.clickLoginButton();
  //A: ASSERT
  await login.expectToast("invalid credentials");
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

test("test login with SQL injection attempts", async () => {
    //Act
  await login.sqlInjectionLogin();
  await login.clickLoginButton();
  //Assert
  await login.expectToast("valid email", 8000);
});

test("test login with XSS atempt", async () => {
    //Act
  await login.xxsLogin();
  //Assert
  await login.expectToast("email", 8000);
});
