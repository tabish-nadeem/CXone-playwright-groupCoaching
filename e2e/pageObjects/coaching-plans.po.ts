import {Page,Locator,expect} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { CoachingGridPO } from './coaching-grid.po';

export class CoachingPlansPO {
    public defaultTimeoutInMillis: number;
    public elements;
    public gridPO: CoachingGridPO;
    public page:Page;
    public constructor(pageElement?: Page, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page = pageElement || this.page.locator('body');
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-plan-grid-container'));
        this.elements = {
            coachingPlanContainer: this.page.locator('.coaching-plans-page'),
            coachingPlansHeader:  this.page.locator('#coaching-plans-page-title'),
            coachingPlanNameHeaderColumn: this.page.locator('[col-id="planName"]'),
            remainingDaysHeaderColumn: this.page.locator('[col-id="remainingDays"]'),
            noOfEmployeesHeaderColumn: this.page.locator('[col-id="assigneeCount"]'),
            planStatusHeaderColumn: this.page.locator('[col-id="planName"]'),
            responsesHeaderColumn: this.page.locator('[col-id="responses"]'),
            actionsHeaderColumn: this.page.locator('[col-id="actions"]'),
            coachingPlanDetailsGrid:  this.page.locator('#ng2-coaching-plan-detail-page'),
            planRow: (planName) => {
                return this.page.locator('xpath=.//*[text()="' + planName + '"]');
            },
            searchPlan: this.page.locator('.cxone-omnibar .search-wrapper input'),
            noRowsOverlayText: this.page.locator('.no-rows-overlay-text'),
            newCoachingPlanBtn: this.page.locator('#new-coaching-plan'),
            cancelButton: this.page.locator('#cancel-button')
        };
    }
    public async navigateToCoachingPlanPage() {
        await this.page.goto(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        await this.page.waitForSelector(this.elements.coachingPlanContainer, 20000);
    }

    //Function to open saved plan
    public async openSavedPlan(planName) {
        await protractorConfig.testUtils.waitForItemToBeClickable(this.elements.planRow(planName));
        await this.elements.planRow(planName).click();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(this.elements.coachingPlanDetailsGrid, 30000);
    }

    //Function to get particular Coaching plan row
    public async getRowElementsByPlanName(planName: string) {
        const row = await this.gridPO.getRowByColumnText('planName', planName);
        await this.page.waitForSelector(row, 30000);
        return {
            remainingDays: await row.locator('[col-id="remainingDays"]').getText(),
            employees: await row.locator('[col-id="assigneeCount"]').getText(),
            responses: await row.locator('[col-id="responses"]').getText(),
            status: await row.locator('[col-id="status"]').getText(),
            delete: await row.locator('#icon-delete')
        };
    }


    public async searchPlanAndOpen(planName) {
        await this.page.waitForSelector(this.elements.searchPlan);
        await this.elements.searchPlan.clear().sendKeys(planName);
        await fdUtils.waitABit(1000);
        await this.openSavedPlan(planName);
    }
}