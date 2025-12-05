import { test } from "@playwright/test";
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
  // A: ASSERT, confirms login 
  await login.expectSuccess();
  console.log("Logged in");
});

const negativeTests = [
  { name: "Login with invalid facility code", action: "invalidFacilityCodeLogin", message: "invalid facility code"},
  { name: "Login with invalid email", action: "invalidEmailLogin", message: "user not registered"},
  { name: "Login with invalid password", action: "invalidPasswordLogin", message: "invalid credentials"}
];

for (const scenario of negativeTests) {
  test(scenario.name, async () => {
    await login[scenario.action]();
    await login.expectToast(scenario.message);
    await login.expectFailure();
  });
}


test("Login with empty credentials", async ({ page }) => {
    //ACT
  await login.clickLoginButton();

  // ASSERT 
  await login.expectErrorMessage( page, [ "facilityRequired", "emailRequired", "passwordRequired"], { timeout: 8000 });
  await login.expectFailure();
});

const sqlInjectionPayloads = [
  "' OR '1'='1",
  "' OR '1'='1' --",
  "admin' --",
  "' OR 1=1 --",
  "'; DROP TABLE users; --",
  "' UNION SELECT * FROM users --",
];

const xssPayloads = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS')>",
  "javascript:alert('XSS')",
  "<iframe src='javascript:alert(\"XSS\")'></iframe>",
  "<svg onload=alert('XSS')>",
  "'-alert(1)-'",
  "\"><script>alert('XSS')</script>",
];

// Test each unique SQL injection payload
sqlInjectionPayloads.forEach((payload, index) => {
  test(`SQL injection attempt ${index + 1}: ${payload}`, async () => {
    await login.sqlInjectionLogin(payload);
    await login.expectToast("valid email", 8000);
    await login.expectFailure();
  });
});

// Test each unique XSS payload
xssPayloads.forEach((payload, index) => {
  test(`XSS attempt ${index + 1}: ${payload}`, async () => {
    await login.xssLogin(payload);
    await login.expectToast("email", 8000);
    await login.expectFailure();
  });
});


