import { Locator, Page, expect } from "@playwright/test";
import { GenericPage } from "./generic.page";

export class LoginPage extends GenericPage {
 
    open() {
        return super.open('login');
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        await this.page.fill('#emailFieldNext', username);
        await this.page.click('#nextBtn');
        await this.page.fill('#mfaPassField', password);
        const [loginResponse] = await Promise.all([
            this.getLoginResponse(),
            await this.page.click('#mfaLoginBtn')
        ]);
        await this.page.waitForNavigation();
        return loginResponse;
    }

    private async getLoginResponse(): Promise<LoginResponse> {
        const response = await this.page.waitForResponse('**/public/authentication/v1/login');
        return await response.json() as LoginResponse;
    }

    logout = async () => {
        await this.page.waitForSelector('.user-panel');
        await this.page.click('.user-panel');
        await this.page.waitForSelector('#logout');
        await this.page.click('#logout');
        await this.page.click('.user-warning >> text=Yes');
        await this.page.waitForLoadState();
        await this.page.waitForURL('**/login/#/?autoLogout=false');
    }
}

export interface LoginResponse {
    user: UserLoginResponse,
    token: string
    tokenExpirationTimeSec: number,
    refreshToken: string,
    tenantId: string,
    sessionId: string,
    authCode: string
}

export interface UserLoginResponse {
    id: string,
    userName: string,
    lastName: string,
    role: string,
    roleUUID: string,
    status: string,
    creationDate: string,
    secondaryRoleIds: Array<string>,
    externalIdentity: string,
    emailAddress: string,
    fullName: string
}