import {Page} from '@playwright/test';
import {CommonUIUtils} from 'cxone-playwright-test-utils';

export class CoachingPlanPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async searchPlan(planName) {
        await this.page.waitForSelector('.search-wrapper input');
        await this.page.fill('.search-wrapper input', planName);
    }

    async getCoachingPlanRowElement(planName) {
        await this.page.waitForSelector('//*[@id="coaching-plan-grid-container"]//*[@col-id="planName" and contains(text(),"'+planName+'")]/..//*[@role="gridcell"]');
        let rowCells = await this.page.locator('//*[@id="coaching-plan-grid-container"]//*[@col-id="planName" and contains(text(),"'+planName+'")]/..//*[@role="gridcell"]');
        let planDetails = await rowCells.allTextContents();
        return {
            planName: planDetails[0],
            remainingDays: planDetails[1],
            employee: planDetails[2],
            response: planDetails[3],
            status: planDetails[4]
        };
    }

    async navigateToCoachingPlans() {
        await this.page.goto(process.env.PLAYWRIGHT_BASE_URL + '/coaching/#/plans');
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }
}
