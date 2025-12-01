import { expect } from "@playwright/test";

export class LogoutPage {
    constructor(page){
        this.page = page;
        this.profileIcon = page.getByRole('button', { name: 'Profile'});
        this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    }

    async clickProfileIcon(){
        await this.profileIcon.click();
        await expect(this.page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
    }
    async clickLogoutButton(){
        await this.logoutButton.click();
    }

    async expectLogoutSuccess(){
        await expect(this.page).toHaveURL(process.env.BASE_URL);
        await expect(this.page.getByText('Facility Login')).toBeVisible();
    }
}