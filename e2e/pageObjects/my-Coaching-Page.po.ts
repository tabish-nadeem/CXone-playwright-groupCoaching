import {Page,Locator,expect} from '@playwright/test';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { fdUtils } from '../common/FdUtils';
import { URLs } from '../common/pageIdentifierURLs';
import { UIConstants } from '../common/uiConstants';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './coaching-grid.po';


export class MyCoachingsPo {
    public defaultTimeoutInMillis: number;
    public elements;
    public page:Page;
    public utils:Utils;
    public uiConstants:UIConstants;
    public gridPO: CoachingGridPO;

    public constructor(pageElement?: Locator,defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page.locator = pageElement || this.page.locator('body');
        this.gridPO = new CoachingGridPO(this.page.locator('#my-coaching-grid-container'));
        this.uiConstants = new UIConstants();
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
        await this.page.wait(async () => {
            count = count + 1;
            // await browser.refresh();
            await this.utils.delay(20000);
            console.log('Wait for ' + statusToVerify + ' Status: Retry', count);
            return true;
        }, 120000, statusToVerify + ' status not updated!!!');
    }

    public async navigateToMyCoachingsPage() {
        await this.navigate();
    }

    public async navigate(){
        // let baseUrl = this.uiConstants.URLS.LOCALHOST
        // await this.page.goto(baseUrl + URLs);
        // await this.page.waitForURL('**\/#/manageForms');
        // await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        // await this.page.waitForSelector(`#ng2-manage-forms-page`);
    }

    public async clickSubmitButton() {
        const button = await this.elements.buttonsWrapper.locator('button >> text = Submit');
        await button.click();
        await this.utils.delay(5000);
        await this.utils.waitForSpinnerToDisappear();
    }


    public async openCoachingSession(coachingPlan) {
        await this.page.waitForSelector(this.elements.coachingSession(coachingPlan),30000);
        await this.elements.coachingSession(coachingPlan).click();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingExecutor'));
        await this.utils.waitForSpinnerToDisappear();
    }


}
