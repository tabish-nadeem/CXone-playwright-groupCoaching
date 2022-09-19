import {Page,Locator} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './CoachingGridPO';

export class CoachingPackagesPO {
    public defaultTimeoutInMillis: number;
    public page:Page;
    public utils:Utils;
    public gridPO: CoachingGridPO;
    public interactionElement: Locator;
    public coachingPackagePage: Locator;
    public breadCrumb: Locator;
    public checkedText: Locator;
    public publishBtn: Locator;
    public unpublishBtn: Locator;
    public bulkDeleteBtn: Locator;
    public confirmCancelBtn: Locator;
    public clickConfirmDelete: Locator;
    public clickNoConfirmDelete: Locator;
    public delPublishPackagePopover: Locator;
    public inlineBold: Locator;
    public spinner: Locator;
    public constructor(pageElement?: Page, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page = pageElement || this.page.locator('body');
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-package-grid-container'));
            this.interactionElement = this.page.locator('.element-box-title >> text = Interactions');
            this.coachingPackagePage = this.page.locator('#ng2-coaching-package-page');
            this.breadCrumb = this.page.locator('.breadcrumb-item a');
            this.checkedText = this.page.locator('#itemsCountLbl');
            this.publishBtn = this.page.locator('#bulk-btn-activate');
            this.unpublishBtn= this.page.locator('#bulk-btn-deactivate');
            this.bulkDeleteBtn =  this.page.locator('#bulk-btn-delete');
            this.confirmCancelBtn = this.page.locator('#popup-cancel');
            this.clickConfirmDelete = this.page.locator('button, input[type="button"], input[type="submit"] >> text="Yes"');
            this.clickNoConfirmDelete = this.page.locator('button, input[type="button"], input[type="submit"] >> text="No"');
            this.delPublishPackagePopover = this.page.locator('popover-container.tooltip-popover-style');
            this.inlineBold = this.page.locator('xpath=//button[starts-with(@id, \'bold\')]');
            this.spinner = this.page.locator('div.spinner.spinner-bounce-middle');
    }


    public async navigateToCoachingPackageManager(stat?) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('coaching.coachingPackage'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPackage'));
        await this.page.waitForSelector(this.coachingPackagePage, 20000);
        await this.utils.waitForSpinnerToDisappear();
    }





    public async verifyPackageIsDisplayed(packageName) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('admin.employees'));
        await this.navigateToCoachingPackageManager();
    }


    public async navigateToCoachingDesigner(stat?) {
        await this.page.get(fdUtils.getPageIdentifierUrls('coaching.coachingPackageDesigner'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPackageDesigner'));
        await this.page.waitForSelector(this.interactionElement, 30000);
        await this.utils.waitForSpinnerToDisappear();
    }

    public async openSavedPackage(formName) {
        const row = await this.gridPO.getRowByColumnText('formName', formName);
        await this.page.waitForSelector(row, 30000);
        await row.click();
        await this.utils.waitForSpinnerToDisappear();
    }

}