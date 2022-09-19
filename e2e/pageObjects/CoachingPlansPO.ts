import {Page,Locator,expect} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { CoachingGridPO } from './CoachingGridPO';

export class CoachingPlansPO {
    public defaultTimeoutInMillis: number;
    public gridPO: CoachingGridPO;
    public page:Page;
    public coachingPlanContainer;
    public coachingPlansHeader;
    public coachingPlanNameHeaderColumn;
    public remainingDaysHeaderColumn;
    public noOfEmployeesHeaderColumn;
    public planStatusHeaderColumn;
    public responsesHeaderColumn;
    public actionsHeaderColumn;
    public coachingPlanDetailsGrid;
    public planRow;
    public searchPlan;
    public noRowsOverlayText;
    public newCoachingPlanBtn;
    public cancelButton;
    public constructor(pageElement?: Page, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page = pageElement || this.page.locator('body');
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-plan-grid-container'));
            this.coachingPlanContainer = this.page.locator('.coaching-plans-page');
            this.coachingPlansHeader =  this.page.locator('#coaching-plans-page-title');
            this.coachingPlanNameHeaderColumn = this.page.locator('[col-id="planName"]');
            this.remainingDaysHeaderColumn = this.page.locator('[col-id="remainingDays"]');
            this.noOfEmployeesHeaderColumn = this.page.locator('[col-id="assigneeCount"]');
            this.planStatusHeaderColumn = this.page.locator('[col-id="planName"]');
            this.responsesHeaderColumn = this.page.locator('[col-id="responses"]');
            this.actionsHeaderColumn = this.page.locator('[col-id="actions"]');
            this.coachingPlanDetailsGrid = this.page.locator('#ng2-coaching-plan-detail-page');
            this.planRow = (planName:any) => {
                return this.page.locator('xpath=.//*[text()="' + planName + '"]');
            },
            this.searchPlan = this.page.locator('.cxone-omnibar .search-wrapper input');
            this.noRowsOverlayText = this.page.locator('.no-rows-overlay-text');
            this.newCoachingPlanBtn = this.page.locator('#new-coaching-plan');
            this.cancelButton = this.page.locator('#cancel-button');
        
    }
    public async navigateToCoachingPlanPage() {
        await this.page.goto(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        await this.page.waitForSelector(this.coachingPlanContainer, 20000);
    }

    //Function to open saved plan
    public async openSavedPlan(planName) {
        await protractorConfig.testUtils.waitForItemToBeClickable(this.planRow(planName));
        await this.planRow(planName).click();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(this.coachingPlanDetailsGrid, 30000);
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
        await this.page.waitForSelector(this.searchPlan);
        await this.searchPlan.clear().sendKeys(planName);
        await fdUtils.waitABit(1000);
        await this.openSavedPlan(planName);
    }
}