import { expect } from "@playwright/test";
import { CREDENTIALS } from "../fixtures/testData";
import { ERROR_MESSAGES } from "../fixtures/testData.js";

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.facilityCode = page.getByRole('textbox', { name: 'Facility Code' });
        this.email = page.getByRole('textbox', { name: 'Email' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.toastMessage = (message) => this.page.getByText(new RegExp(message, "i"));
    }

    async navigateToLoginPage(){
        await this.page.goto(process.env.BASE_URL);
    }

    async clickLoginButton(){
        await this.loginButton.click();
    }
    
    async FacilityLogin(code, email, password) {
        await this.facilityCode.fill(code);
        await this.email.fill(email);
        await this.password.fill(password);
        // await this.clickLoginButton();
        console.log("SQL injection login:", CREDENTIALS.valid.facilityCode, CREDENTIALS.security.sqlInjection.email, CREDENTIALS.valid.password);
    }

    async validLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.valid.password);
        await this.clickLoginButton();
    }

    async invalidFacilityCodeLogin(){
        await this.FacilityLogin(CREDENTIALS.invalid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.valid.password);
        await this.clickLoginButton();
    }

    async invalidEmailLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.invalid.email, CREDENTIALS.valid.password);
        await this.clickLoginButton();
    }

    async invalidPasswordLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.invalid.password);
        await this.clickLoginButton();
    }



    async sqlInjectionLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.security.sqlInjection.email, CREDENTIALS.valid.password);
        await this.clickLoginButton();
    }

    async xxsLogin(){
        await this.FacilityLogin(CREDENTIALS.security.xss.facilityCode, CREDENTIALS.security.xss.email, CREDENTIALS.valid.password);
        await this.clickLoginButton();
    }

    async expectSuccess(){
        await expect(this.page).toHaveURL(process.env.SUCCESS_URL);
    }

    async expectFailure(){
        await expect(this.page).toHaveURL(process.env.BASE_URL);
    }

    async expectToast(message, timeout = 5000){
        await expect(this.toastMessage(message)).toBeVisible({ timeout });
    }

    async expectErrorMessage(page, errorKeys, options = {}){
        for (const key of errorKeys) {
           await expect(page.getByText(ERROR_MESSAGES[key])).toBeVisible(options);
        }
    }

}
