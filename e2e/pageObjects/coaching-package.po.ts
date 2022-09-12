import {Page,Locator,expect} from '@playwright/test';

import moment from 'moment';
import { fdUtils } from '../common/FdUtils';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './coaching-grid.po';

export class CoachingPackagesPO {
    public defaultTimeoutInMillis: number;
    public elements;
    public page:Page;
    public utils:Utils;
    public gridPO: CoachingGridPO;
    public constructor(pageElement?: Locator, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page.locator = pageElement || this.page.locator('body');
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

    public async clickBreadCrumbLink() {
        return await this.elements.breadCrumb.click();
    }

    public async navigateToCoachingDesigner(stat?) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('coaching.coachingPackageDesigner'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPackageDesigner'));
        await this.page.waitForSelector(this.elements.interactionElement, 30000);
        await this.utils.waitForSpinnerToDisappear();
    }
    public async refreshPage(stat?) {
        // await browser.refresh();
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPackageDesigner'));
        await this.page.waitForSelector(this.elements.interactionElement, 30000);
        await this.utils.waitForSpinnerToDisappear();
    }

    public async navigateToCoachingPackageManager(stat?) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('coaching.coachingPackage'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPackage'));
        await this.page.waitForSelector(this.elements.coachingPackagePage, 20000);
        await this.utils.waitForSpinnerToDisappear();
    }

    /**
     * Function to open perticular coaching package
     * @param formName
     * @returns {Promise<*>}
     */
    public async openSavedPackage(formName) {
        const row = await this.gridPO.getRowByColumnText('formName', formName);
        await this.page.waitForSelector(row, 30000);
        await row.click();
        await this.utils.waitForSpinnerToDisappear();
    }

    /**
     * Function to create form data for creating empty package if formData is undefined
     * @param formName
     * @param formStatus
     * @param formData
     * @returns {{formId: string, formStatus: *|string, formName: *, formData: *|string, formType: string}}
     */
    public generatePackageData(formName, formStatus?, formData?) {
        return {
            formId: '',
            formStatus: formStatus || 'Draft',
            formName: formName,
            formData: formData || '{"formTitle":"","elements":[],"theme":{"themeId":"","themeName":"","isDefault":true,"themeLogo":"iVBORw0KGgoAAAANSUhEUgAAAGQAAAAlCAYAAAC05kydAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTY3MTc4QTE5MTM2MTFFNjg1QThCMTMzMEVCRjhDQUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTY3MTc4QTI5MTM2MTFFNjg1QThCMTMzMEVCRjhDQUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjcxNzg5RjkxMzYxMUU2ODVBOEIxMzMwRUJGOENBRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjcxNzhBMDkxMzYxMUU2ODVBOEIxMzMwRUJGOENBRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psv348oAAAUDSURBVHja5Jp7bFRFFMZPl1LBYCsNioRiWrRErS9iBESQmgAxGkKJEP4wyEN81dcmPohREyQRE+Kj2oivgBhCJFilSnwRtIqwQWgkRrSSFWzrGik0gWoNFq34He5ss93evXNmH5172y/5pd2dO3PP3XNn5syZySOiMKVWDNSRty4Dsz3K/wDrk74rAfM17W4Dh0iu8WARmAkuB+eCLnAENIEI+Ah8a9DmRDCDsq8a9bcMLAXF4BNlH5324BQYq2l8iaaNZpc6lZo6TJXw4SpAvaC9ON+BucK2wwbtmsC6GDSCjeBpsBmsCGkMGgoeIv9qsXrj5xrUuVI58H1QZNH2avAMGKd6MjtneUhQ8W7LhqfSA2ADKEiz/jzQAAot2c/3PQpGgFvB26A7JKx4l8+cUZUwDmciniPesPQMPEfeBz4DK9VI1BQSVg5n8CZmWzynrQOhLLW3EMyy8BwfgN3gWjWx89B1p25ST2SpTyb1rTmYZBstTOquMnnLHgF5lnvH9QbRl4muATf6ofubOITXG7dYtvcJ4XUcrn8Ndqr/JbojaA5hPWbR1mLhWM/j8kXgBrWo4znnFUG9OSrMN1WZGjlMyJpDpoPJlhzCa418zTVH1A8bS/iuHdwvcEqhmmAD1UNs9hJJCoND4eMpylYKhq8pQXQIL6jKLdh6neCadzzKuKfsEMyTgXNInoq4+lNngwmaaw6AVs01X2nKS2w7JD/NereDp9TSv4+GFJxFV8x3kshDhhYUj69c0GtV3R7dP6xh9WLPG0wL19485qoZvF6hk8fbimONvV/u7+tqqPtUV+JX3wjs3uo1bBWNm9A5e1Vdj61Hm/ZO7IhFe8o721rp58/7dMJd4F/BveskL3K6DhkGHgRPuna7/AIqn3Vb/OM5lJSgLCop16bVR5ZWTCUnk0vDR45ObO+Mfqhfm+yQqMDuqFfKBc4oxZ8345/Pv3TSGeI6drDRzSFjhb/ZqFwNWXFxtnKEj/Jbv9IAkMQhP6Z6icEyHz3LX4PFIS94lD2cwbCXbXUMFodsVAsuN11ITrY0iFmHwDqEo5Jaj/KZPnmWwsHiENarARijB4RDpOM/pyPWqVBXq+6ukxSpDcdD4GNT7l3Ta8exJbKtTDM30aGGLZsqqqr5tAjF9m2/pHXPx88m38Nl+NSJ0/ePpiqsr556umptZF5PNPPh63NOtDT1BC5df7pmZd4i52SNTnulTpFuppSqBZDpZkyzyz0ryWyDarTg+s2CZ33c0FbJBlWprYmwmfRntHKlNnJyUZ6Le9JvoE3TlB8OWmTynEVbI5pyXjF7ZYTPEwQg0aA5hPeev7Bk607BNas8egnvNuoOauwLYuz+vCVb3xVcM10FC8k7f5zmkRz420E+kOkJCX4DD/TzpB7XLuE9Oa/FScIa1aulR0wpjUk9q6dO8tN0IPeS9RZenhoVuurE+xrLDdveEOR0wybwuwV7+TzuwRy026HWWYF1CKdTXrZg73/gnhy0u1q4uPOtQ1ivWUqnfAleymJ7+8GLQctluekEJeyu9bM47f9eFtr5jZyT5/8MBIfEJ9luC3bzPRdmGIL/RM5hul/IR8rUIS1giyXb2Sl8aGCy4frhb7CGnPO8h8ln4jXFkgzDwTJNyqKT+ubALgA3adrljECrwbPw8dEFgA9HXE3OoYLhqiym1hmfkpOEbBe2yee0JuXgd0/5m/4vwABDve77Fw+5/QAAAABJRU5ErkJggg==","themeData":{"imgWidth":150,"imgHeight":50,"isAspectRatioChecked":true,"logoAspectRatio":3,"bgColor":"#ffffff","numberingEnabled":true,"title":{"text":"Enter title","font":"OpenSans","fontSize":18,"fontStyling":{"fontColor":"#2e2e2e","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}},"subTitle":{"text":"Enter sub title","font":"OpenSans","fontSize":14,"fontStyling":{"fontColor":"#707070","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}}}},"ranking":{"isRankingEnabled":false,"totalCoverage":101,"ranges":[{"from":"0%","to":"50%","coverage":51,"displayText":"Failed"},{"from":"51%","to":"100%","coverage":50,"displayText":"Passed"}]},"themeId":"","elementCount":0,"rules":{},"rulesAssociation":{},"duration":{"objectives":[],"durationValue":"1:15","showDurationErrorMsg":false,"labels":["1"]},"formMaxScore":0,"currentScore":0,"percentage":null}',
            formType: 'COACHING'
        };
    }

    public async verifyPackageIsDisplayed(packageName) {
        await this.page.goto(fdUtils.getPageIdentifierUrls('admin.employees'));
        await this.navigateToCoachingPackageManager();
    }

    public async waitForBreadCrumbToLoad() {
        return await this.page.waitForSelector(this.elements.breadCrumb);
    }

    // Function to get the title of manage forms page
    public async getHeaderText() {
        return await this.elements.header.getText();
    }

    //Function to get particular Coaching plan row
    public async getFormRowElements(formName: string) {
        const row = await this.gridPO.getRowByColumnText('formName', formName);
        await this.page.waitForSelector(row, 30000);
        return {
            version: await row.locator('[col-id="formVersion"]').getText(),
            lastModified: await row.locator('[col-id="lastModified"]').getText(),
            modifiedBy: await row.locator('[col-id="modifiedBy"]').getText(),
            status: await row.locator('[col-id="formStatus"]').getText(),
            actions: await row.locator('button.action-btn.action-delete svg'),
            hamberger: await row.locator('button.action-btn.action-more')
        };
    }

    /* Function to click on more menu on form grid
     * Parameter - value - send the name of the form*/
    public async clickOnHamberger(ham) {
        await ham.click();
    }

    public async clickHamburgerMenu(formName) {
        const row = await this.getFormRowElements(formName);
        await row.hamberger.click();
    }

    /* Function to perform a click on option listed in hamburger menu
     * Parameter - labelToClick - name of the option in hamburger menu*/
    public async clickHamburgerMenuItem(labelToClick) {
        let elementIdentifier = this.page.locator(`popover-container .more-option-popover .clickable >> text = ${labelToClick}`);
        return elementIdentifier.click();
    }

    public async duplicatePackageFromMoreMenu(name, newPackageName) {
        await this.clickHamburgerMenu(name);
        await this.clickHamburgerMenuItem('Duplicate');
        await this.page.waitForSelector(this.page.locator('#package-designer-duplicate-package-name input'), 10000);
        await this.page.locator('#package-designer-duplicate-package-name input').sendKeys(newPackageName);
        await this.page.locator('.cxone-modal-wrapper .save-btn').click();
        await Utils.waitUntilInvisible(this.page.locator('#package-designer-duplicate-package-name input')), 10000);
        await this.utils.waitForSpinnerToDisappear();
    }

    //function to click on publish button
    public async clickPublishButton() {
        await Utils.waitUntilClickable(this.elements.publishBtn, 10000);
        await this.elements.publishBtn.click();
        await this.utils.delay(1000);
    }

    //function to click on Unpublish button
    public async clickUnpublishButton() {
        await Utils.waitUntilClickable(this.elements.unpublishBtn);
        await this.elements.unpublishBtn.click();
        await this.utils.delay(1000);
    }
    //function to click on Unpublish button
    public async clickDeleteButton() {
        await Utils.waitUntilClickable(this.elements.bulkDeleteBtn);
        await this.elements.bulkDeleteBtn.click();
        await this.utils.delay(1000);
    }

    //function to click confirm button on publish/unpublish warning pop up
    public async clickConfirmBtn(btnName) {
        let temp = this.page.locator('#popup-' + btnName + '');
        await this.page.waitForSelector(temp);
        await temp.click();
        return await this.utils.waitForSpinnerToDisappear();
    }

    //function to click on confirm cancel button for publish modal window
    public async clickConfirmCancel() {
        await this.page.waitForSelector(this.elements.confirmCancelBtn);
        return await this.elements.confirmCancelBtn.click();
    }

    //function to click on yes button of delete window
    public async clickConfirmDeleteBtn(skipWaitForSpinner?) {
        await this.page.waitForSelector(this.elements.clickConfirmDelete);
        await this.elements.clickConfirmDelete.click();
        if (!skipWaitForSpinner) {
            await this.utils.waitForSpinnerToDisappear();
        }
    }

    //function to click on delete icon of form grid
    public async clickSingleDelete(value) {
        const row = await this.gridPO.getRowByColumnText('formName', value);
        await this.page.waitForSelector(row, 30000);
        const actionDelete = row.this.page.locator('button.action-btn.action-delete svg');
        await this.page.mouse.down(actionDelete);
    }

    //function to click on delete button in upper tool bar
    public async bulkDelete() {
        await this.page.waitForSelector(this.elements.bulkDeleteBtn);
        return await this.elements.bulkDeleteBtn.click();
    }

    public async verifyPackagePresence(formName) {
        const rowByName = await this.gridPO.getRowByColumnText('formName', formName);
        if (rowByName)
            return rowByName.isPresent();
        else
            return false;
    }

    // function to verify tooltip message when mouse over on delete icon of published form
    public async verifyMessageMouseHoverDelOfPublishedPackage(value) {
        try {
            const row = await this.gridPO.getRowByColumnText('formName', value);
            await this.page.waitForSelector(row, 30000);
            const actionDelete = row.this.page.locator('button.action-btn.action-delete svg');
            await this.page.mouse.move(actionDelete);
            await expect(this.elements.delPublishPackagePopover).toBeVisible(10000);
            return this.elements.delPublishPackagePopover.getText();
        } catch (ex) {
            console.error('Failed to get hover message', ex);
        }
    }

    public async selectParticularPackage(packageName) {
        const rowByName = await this.gridPO.getRowByColumnText('formName', packageName);
        await this.page.waitForSelector(rowByName, 30000);
        let checkboxToSelect = rowByName.this.page.locator('span.ag-selection-checkbox .ag-icon.ag-icon-checkbox-unchecked');
        let check = await checkboxToSelect.isPresent();
        await this.page.waitForSelector(checkboxToSelect);
        await checkboxToSelect.click();
    }

    public getTodaysDate(format) {
        return moment().utc().format(format);
    }
}