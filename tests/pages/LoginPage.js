export class LoginPage {
    constructor(page) {
        this.page = page;
        this.facilityCode = page.getByPlaceholder("Enter your facility code");
        this.email = page.getByPlaceholder("Enter email address");
        this.password = page.getByPlaceholder("Enter password");
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async navigate(){
        await this.page.goto(process.env.BASE_URL);
    }
    
    async login(code, email, password) {
        await this.facilityCode.fill(code);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}
