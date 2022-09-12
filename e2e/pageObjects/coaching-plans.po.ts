import {Page,Locator,expect} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { CoachingGridPO } from './coaching-grid.po';

export class CoachingPlansPO {
    public defaultTimeoutInMillis: number;
    public elements;
    public gridPO: CoachingGridPO;
    public page:Page;
    public constructor(pageElement?: Locator, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page.locator = pageElement || this.page.locator('body');
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
    // Function to get the coaching plans page header title
    public async getHeaderText() {
        await this.page.waitForSelector(this.elements.coachingPlansHeader);
        return await this.elements.coachingPlansHeader.getText();
    }
    // Function to get the plan name column header
    public async getCoachingPlanNameColumnHeader() {
        await this.page.waitForSelector(this.elements.coachingPlanNameHeaderColumn);
        return await this.elements.coachingPlanNameHeaderColumn.getText();
    }
    // Function to get the remaining days column header
    public async getRemainingDaysColumnHeader() {
        await this.page.waitForSelector(this.elements.remainingDaysHeaderColumn);
        return await this.elements.remainingDaysHeaderColumn.getText();
    }
    // Function to get the employees column header
    public async getNoOfEmpColumnHeader() {
        await this.page.waitForSelector(this.elements.noOfEmployeesHeaderColumn);
        return await this.elements.noOfEmployeesHeaderColumn.getText();
    }
    // Function to get the plan status column header
    public async getPlanStatusColumnHeader() {
        await this.page.waitForSelector(this.elements.planStatusHeaderColumn);
        return await this.elements.planStatusHeaderColumn.getText();
    }
    // Function to get the responses column header
    public async getPerOfResponsesColumnHeader() {
        await this.page.waitForSelector(this.elements.responsesHeaderColumn);
        return await this.elements.responsesHeaderColumn.getText();
    }
    // Function to get the actions column header
    public async getActionsColumnHeader() {
        await this.page.waitForSelector(this.elements.actionsHeaderColumn);
        return await this.elements.actionsHeaderColumn.getText();
    }

    //Function to open saved plan
    public async openSavedPlan(planName) {
        await protractorConfig.testUtils.waitForItemToBeClickable(this.elements.planRow(planName));
        await this.elements.planRow(planName).click();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(this.elements.coachingPlanDetailsGrid, 30000);
    }

    //Function to check plan presence on grid
    public async isPlanPresentInGrid (planName) {
        return await this.elements.planRow(planName).isPresent();
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

    //Function to verify No rows overlay text
    public async verifyNoRowsOverlayText() {
        await this.page.waitForSelector(this.elements.noRowsOverlayText);
        return await this.elements.noRowsOverlayText.getText();
    }

    public verifyCoachingPlanIsDisplayed(planName) {
        return this.elements.planRow(planName).isDisplayed();
    }

    /************************* GRID PLAN DELETE ICON FUNCTIONS ***********************/

    //function to click on delete icon of plan grid
    public async clickSingleDelete(value) {
        let dlt = (await this.getRowElementsByPlanName(value)).delete;
        await protractorConfig.testUtils.waitForItemToBeClickable(dlt);
        await dlt.click();
    }

    public async clickNewCoachingPlanButton() {
        await protractorConfig.testUtils.waitForItemToBeClickable(this.elements.newCoachingPlanBtn);
        await this.elements.newCoachingPlanBtn.click();
    }

    public async searchPlanAndOpen(planName) {
        await this.page.waitForSelector(this.elements.searchPlan);
        await this.elements.searchPlan.clear().sendKeys(planName);
        await fdUtils.waitABit(1000);
        await this.openSavedPlan(planName);
    }
}