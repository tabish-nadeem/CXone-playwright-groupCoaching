import {Page} from '@playwright/test';
import {CommonUIUtils} from 'cxone-playwright-test-utils';

export class MyCoachingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToMyCoachingPage() {
        await this.page.goto(process.env.PLAYWRIGHT_BASE_URL + '/coaching/#/myCoachings');
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async searchCoachingPackage(planName) {
        await this.page.fill('.search-wrapper input', '');
        await this.page.fill('.search-wrapper input', planName);
    }

    async clickOnCoachingPackage(columnID, columnValue) {
       await (await this.getARow(columnID, columnValue)).click();
       await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async getARow(columnID, columnValue) {
        await this.page.waitForSelector('#my-coaching-grid [role="row"]:has([col-id="' + columnID + '"]:has-text("' + columnValue + '"))');
        let row = await this.page.locator('#my-coaching-grid [role="row"]:has([col-id="' + columnID + '"]:has-text("' + columnValue + '"))');
        return row;
    }

    async clickOnSubmitButton() {
        await this.page.waitForSelector('#form-executor-workflow-btn-submit');
        await this.page.locator('#form-executor-workflow-btn-submit').click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async getCoachingPackageDetails(planName) {
        await this.page.waitForSelector('#my-coaching-grid [role="row"]:has([col-id="coachingPlanName"]:has-text("' + planName + '"))');
        let rowCells = await this.page.locator('//*[@col-id="coachingPlanName"]//*[contains(text(),"'+planName+'")]/../../..//*[@role="gridcell"]');
        let planDetails = await rowCells.allTextContents();
        return {
            planName: planDetails[0],
            assignedBy: planDetails[1],
            remainingDays: planDetails[2],
            status: planDetails[3]
        }
    }

    TODO:
    //waitForStatusToUpdate
    //openCoachingSession
}
