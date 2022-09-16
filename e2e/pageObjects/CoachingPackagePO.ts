import {Page,Locator} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './CoachingGridPO';

export class CoachingPackagesPO {
    public defaultTimeoutInMillis: number;
    public elements;
    public page:Page;
    public utils:Utils;
    public gridPO: CoachingGridPO;
    public constructor(pageElement?: Page, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page = pageElement || this.page.locator('body');
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-package-grid-container'));
        this.elements = {
            interactionElement: this.page.locator('.element-box-title >> text = Interactions'),
            coachingPackagePage: this.page.locator('#ng2-coaching-package-page'),
            breadCrumb: this.page.locator('.breadcrumb-item a'),
            checkedText: this.page.locator('#itemsCountLbl'),
            publishBtn: this.page.locator('#bulk-btn-activate'),
            unpublishBtn: this.page.locator('#bulk-btn-deactivate'),
            bulkDeleteBtn: this.page.locator('#bulk-btn-delete'),
            confirmCancelBtn: this.page.locator('#popup-cancel'),
            clickConfirmDelete: this.page.locator('button, input[type="button"], input[type="submit"] >> text="Yes"'),
            clickNoConfirmDelete: this.page.locator('button, input[type="button"], input[type="submit"] >> text="No"'),
            delPublishPackagePopover: this.page.locator('popover-container.tooltip-popover-style'),
            inlineBold: this.page.locator('xpath=//button[starts-with(@id, \'bold\')]'),
            spinner: this.page.locator('div.spinner.spinner-bounce-middle')
        };
    }


    public async navigateToCoachingPackageManager(stat?) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('coaching.coachingPackage'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPackage'));
        await this.page.waitForSelector(this.elements.coachingPackagePage, 20000);
        await this.utils.waitForSpinnerToDisappear();
    }





    public async verifyPackageIsDisplayed(packageName) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('admin.employees'));
        await this.navigateToCoachingPackageManager();
    }


}