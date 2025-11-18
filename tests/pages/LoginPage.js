import { expect } from "@playwright/test";
import { CREDENTIALS } from "../fixtures/testData";

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.facilityCode = page.getByRole('textbox', { name: 'Facility Code' });
        this.email = page.getByRole('textbox', { name: 'Email' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
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
    }

    async validLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.valid.password);
    }

    async invalidFacilityCodeLogin(){
        await this.FacilityLogin(CREDENTIALS.invalid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.valid.password);
    }

    async invalidEmailLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.invalid.email, CREDENTIALS.valid.password);
    }

    async invalidPasswordLogin(){
        await this.FacilityLogin(CREDENTIALS.valid.facilityCode, CREDENTIALS.valid.email, CREDENTIALS.invalid.password);
    }



    async sqlInjectionLogin(){
        await this.FacilityLogin(CREDENTIALS.security.sqlInjection.facilityCode, CREDENTIALS.security.sqlInjection.email, CREDENTIALS.security.sqlInjection.password);
    }

    async xxsLogin(){
        await this.FacilityLogin(CREDENTIALS.security.xss.facilityCode, CREDENTIALS.security.xss.email, CREDENTIALS.security.xss.password);
    }

    async expectSuccess(){
        await expect(this.page).toHaveURL(process.env.BASE_URL);
    }

    async expectToast(message, timeout = 5000){
        await expect(this.page.getByText(new RegExp(message, "i"))).toBeVisible({ timeout });
    }

    
}
