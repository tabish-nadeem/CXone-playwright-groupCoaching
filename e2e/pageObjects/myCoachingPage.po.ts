import {Page,Locator,expect} from '@playwright/test';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { fdUtils } from '../common/FdUtils';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './coaching-grid.po';


export class MyCoachingsPo {
    public defaultTimeoutInMillis: number;
    public elements;
    public page:Page;
    public utils:Utils;
    public gridPO: CoachingGridPO;

    public constructor(pageElement?: Locator,defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page.locator = pageElement || this.page.locator('body');
        this.gridPO = new CoachingGridPO(this.page.locator('#my-coaching-grid-container'));
        this.elements = {
            coachingPlanContainer: this.page.locator('.my-coaching-page'),
            pageTitle: this.page.locator('#my-coaching-page-title'),
            noItemsOverlayText: this.page.locator('.no-rows-overlay-text'),
            searchField: this.page.locator('.cxone-omnibar .search-wrapper input'),
            downloadFileName: this.page.locator('.file-text-link'),
            buttonsWrapper: this.page.locator('.buttons-wrapper'),
            coachingSession: (coachingPlan) => {
                return this.page.locator('xpath=//*[@col-id="coachingPlanName"]//div[text()="' + coachingPlan + '"]');
            },
            actionBtns: function (buttonText) {
                return this.page.locator(`button,input[type="button"], input[type="submit"] >> text= ${buttonText}`);
            },
            searchCoaching: this.page.locator('#my-coaching-grid input'),
            formExecutorScreen: this.page.locator('.form-executor-page'),
            spinner: this.page.locator('div.spinner.spinner-bounce-middle')
        };
    }

    public async getSearchPlaceholderText() {
        await this.page.waitForSelector(this.elements.searchField);
        return await this.elements.searchField.getAttribute('placeholder');
    }

    public async isSearchPresent() {
        return await this.elements.searchField.isPresent();
    }

    public async getRowElements(columnId: any,columnValue: any) {
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        const row = await this.gridPO.getRowByColumnText(columnId, columnValue);
        await this.page.waitForSelector(row);
        console.log('\n row', (await row.getText()));
        return {
            assignedBy: await row.locator('[col-id="assignedBy"]').getText(),
            remainingDays: await row.locator('[col-id="remainingDays"]').getText(),
            status: await row.locator('[col-id="status"]').getText()
        };
    }

    public async waitForStatusToUpdate(planName, statusToVerify) {
        let count = 0;
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        // await browser.wait(async function () {
        await browser.wait(async () => {
            count = count + 1;
            // await browser.refresh();
            await this.utils.delay(20000);
            console.log('Wait for ' + statusToVerify + ' Status: Retry', count);
            return true;
        }, 120000, statusToVerify + ' status not updated!!!');
    }

    public async navigateToMyCoachingsPage() {
        await this.navigateTo();
    }

    public async navigateTo(quickly?: boolean) {
        if (quickly) {
            return await navigateQuicklyTo(protractorConfig.fdUtils.getPageIdentifierUrls('coaching.myCoaching'), this.ancestor);
        } else {
            return await navigateTo(protractorConfig.fdUtils.getPageIdentifierUrls('coaching.myCoaching'), this.ancestor);
        }
    }

    public async waitForMyCoachingsPage () {
        await expect(this.elements.coachingPlanContainer).toBeVisible(60000);
        await this.utils.waitForSpinnerToDisappear();
    }

    public async isCoachingRowPresent(coachingPlan) {
        console.log('plan name',coachingPlan);
        return await this.elements.coachingSession(coachingPlan).isPresent();
    }

    public async verifyCoachingCompletedStatus(coachingPlanName, statusToVerify) {
        let rowEle = await this.getCoachingRowElements(coachingPlanName);
        return (rowEle.status === statusToVerify);
    }

    public async clickOnActionBtn(btnText) {
        await protractorConfig.testUtils.waitForItemToBeClickable(this.elements.actionBtns(btnText), 15000);
        return await this.elements.actionBtns(btnText).click();
    }

    public async clickSubmitButton() {
        const button = await this.elements.buttonsWrapper.locator('button >> text = Submit');
        await button.click();
        await this.utils.delay(5000);
        await this.utils.waitForSpinnerToDisappear();
    }

    public async getPageTitleText() {
        await this.page.waitForSelector(this.elements.pageTitle);
        return await this.elements.pageTitle.getText();
    }

    public async openCoachingSession(coachingPlan) {
        await this.page.waitForSelector(this.elements.coachingSession(coachingPlan),30000);
        await this.elements.coachingSession(coachingPlan).click();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingExecutor'));
        await this.utils.waitForSpinnerToDisappear();
    }

    public async getCoachingRowElements (value) {
        console.log('undefined --->', value);
        let temp = await this.page.locator('xpath=.//*[text()="' + value + '"]/../../../..');
        await this.page.waitForSelector(temp, 20000);
        return {
            assignedBy: await temp.locator('[col-id="assignedBy"]').getText(),
            remainingDays: await temp.locator('[col-id="remainingDays"]').getText(),
            status: await temp.locator('[col-id="status"]').getText()
        };
    }

    public async clickOnViewIcon (value) {
        let temp = await this.page.locator('xpath=.//*[text()="' + value + '"]/../../../..');
        await this.page.waitForSelector(temp, 20000);
        await temp.locator('.action-btn.action-goto').click();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingExecutor'));
        await this.utils.waitForSpinnerToDisappear();
    }

    public async refresh() {
        // await refresh(this.ancestor);
        await this.utils.waitABit(5000);
    }

    public async getRowCount() {
        const label = await this.elements.countLabel.getText();
        return +label.split(' ')[0];
    }

    public async searchCoaching(query: string) {
        await this.elements.search.clear();
        await this.elements.search.sendKeys(query);
        await this.utils.delay(1000);
    }

    public async clearSearch() {
        await this.elements.clearSearch.click();
        await this.utils.delay(1000);
    }

    public async getCoachingIdFromField(columnId: string, query: string): Promise<string> {
        const row: Locator = await this.getRowByColumnId(columnId, query);
        const statusCell = row.locator('.ag-cell[col-id="status"] span[id]');
        return await statusCell.getAttribute('id');
    }

    private async getAllRows() {
        return await this.page.locator('.cxone-grid .ag-center-cols-container .ag-row');
    }

    private async getRowByColumnId(columnId: string, query: string): Promise<Locator> {
        const allRows = await this.getAllRows();
        let index = -1;
        for (let i = 0; i < allRows.length; i++) {
            const cell = allRows[i].locator(`.ag-cell[col-id="${columnId}"]`);
            const textValue = await cell.getText();
            if (textValue === query) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            return allRows[index];
        } else {
            console.error(`Row not found : columnId - ${columnId} and query - ${query}`);
        }
        return index !== -1 ? allRows[index] : undefined;
    }

    public async openInteraction(columnId: string, query: string) {
        const row = await this.getRowByColumnId(columnId, query);
        await row.click();
    }

    public async getHeaderText() {
        return await this.page.locator('.header .page-title').gettext();
    }
}
