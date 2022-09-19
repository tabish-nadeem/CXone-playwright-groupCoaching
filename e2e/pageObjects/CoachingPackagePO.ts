import {Page,Locator} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './CoachingGridPO';

export class CoachingPackagesPO {
    public defaultTimeoutInMillis: number;
    public page:Page;
    public utils:Utils;
    public gridPO: CoachingGridPO;
    public interactionElement;
    public coachingPackagePage;
    public breadCrumb;
    public checkedText;
    public publishBtn;
    public unpublishBtn;
    public bulkDeleteBtn;
    public confirmCancelBtn;
    public clickConfirmDelete;
    public clickNoConfirmDelete;
    public delPublishPackagePopover;
    public inlineBold;
    public spinner;
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


}