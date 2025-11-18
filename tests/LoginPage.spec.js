import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { CREDENTIALS } from "./fixtures/testData.js";


//A: ARRANGE
//1. a page is loaded.
//2. object of LoginPage is created.
//3. navigates to login page.
let login;

test.beforeEach(async ({ page }) => {
  login = new LoginPage(page);
  await login.navigate();
});

test("Login with valid credentials", async ({ page }) => {
  await login.login( // A: ACT, fills fields and clicks login.
    CREDENTIALS.valid.facilityCode,
    CREDENTIALS.valid.email,
    CREDENTIALS.valid.password
  );
  // A: ASSERT, confirms login 
  await expect(page).toHaveURL(process.env.BASE_URL);
  console.log("Logged in");
});

test("Login with invalid facility code", async ({ page }) => {
    // A: ACT, attempts login with fake facility code.
  await login.login(CREDENTIALS.invalid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.valid.password);
  //A: Assert
  const toast = page.getByText(/invalid facility code/i);
  await expect(toast).toBeVisible({ timeout: 1000 });
});

test("Login with invalid email", async ({ page }) => {
    //A: ACT
  await login.login(
    CREDENTIALS.valid.facilityCode,
    CREDENTIALS.invalid.email,
    CREDENTIALS.valid.password
  ); 
  //A: ASSERT
  const toast = page.getByText(/user not registered/i);
  await expect(toast).toBeVisible({ timeout: 8000 });
});

test("Login with invalid password", async ({ page }) => {
    //A: ACT
  await login.login(
    CREDENTIALS.valid.facilityCode,
    CREDENTIALS.valid.email,
    CREDENTIALS.invalid.password
  );
  //A: ASSERT
  const toast = page.getByText(/invalid credentials/i);
  await expect(toast).toBeVisible({ timeout: 15000 });
});

test("Login with empty credentials", async ({ page }) => {
    //ACT
  await login.login(CREDENTIALS.empty.facilityCode, CREDENTIALS.empty.email, CREDENTIALS.empty.password);
  //Assert
  await expect(page.getByText(/facility.*required/i)).toBeVisible({
    timeout: 8000,
  });
  await expect(page.getByText(/email.*required/i)).toBeVisible();
  await expect(page.getByText(/password.*required/i)).toBeVisible();
});

test("test login with SQL injection attempts", async ({ page }) => {
    //Act
  await login.login(
    CREDENTIALS.security.sqlInjection.facilityCode,
    CREDENTIALS.security.sqlInjection.email,
    CREDENTIALS.security.sqlInjection.password
  );
  //Assert
  const toast = page.getByText(
    /value is not a valid email address: An email address must have an @-sign./i
  );
  await expect(toast).toBeVisible({ timeout: 8000 });
});

test("test login with XSS atempt", async ({ page }) => {
    //Act
  await login.login(
    CREDENTIALS.security.xss.facilityCode,
    CREDENTIALS.security.xss.email,
    CREDENTIALS.security.xss.password
  );
  //Assert
  await expect(page).not.toHaveURL(/alert/);
});
