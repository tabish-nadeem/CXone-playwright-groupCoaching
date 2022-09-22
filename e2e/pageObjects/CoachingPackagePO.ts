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

    public generatePackageData(formName, formStatus?, formData?) {
        return {
            formId: '',
            formStatus: formStatus || 'Draft',
            formName: formName,
            formData: formData || '{"formTitle":"","elements":[],"theme":{"themeId":"","themeName":"","isDefault":true,"themeLogo":"iVBORw0KGgoAAAANSUhEUgAAAGQAAAAlCAYAAAC05kydAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTY3MTc4QTE5MTM2MTFFNjg1QThCMTMzMEVCRjhDQUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTY3MTc4QTI5MTM2MTFFNjg1QThCMTMzMEVCRjhDQUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjcxNzg5RjkxMzYxMUU2ODVBOEIxMzMwRUJGOENBRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjcxNzhBMDkxMzYxMUU2ODVBOEIxMzMwRUJGOENBRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psv348oAAAUDSURBVHja5Jp7bFRFFMZPl1LBYCsNioRiWrRErS9iBESQmgAxGkKJEP4wyEN81dcmPohREyQRE+Kj2oivgBhCJFilSnwRtIqwQWgkRrSSFWzrGik0gWoNFq34He5ss93evXNmH5172y/5pd2dO3PP3XNn5syZySOiMKVWDNSRty4Dsz3K/wDrk74rAfM17W4Dh0iu8WARmAkuB+eCLnAENIEI+Ah8a9DmRDCDsq8a9bcMLAXF4BNlH5324BQYq2l8iaaNZpc6lZo6TJXw4SpAvaC9ON+BucK2wwbtmsC6GDSCjeBpsBmsCGkMGgoeIv9qsXrj5xrUuVI58H1QZNH2avAMGKd6MjtneUhQ8W7LhqfSA2ADKEiz/jzQAAot2c/3PQpGgFvB26A7JKx4l8+cUZUwDmciniPesPQMPEfeBz4DK9VI1BQSVg5n8CZmWzynrQOhLLW3EMyy8BwfgN3gWjWx89B1p25ST2SpTyb1rTmYZBstTOquMnnLHgF5lnvH9QbRl4muATf6ofubOITXG7dYtvcJ4XUcrn8Ndqr/JbojaA5hPWbR1mLhWM/j8kXgBrWo4znnFUG9OSrMN1WZGjlMyJpDpoPJlhzCa418zTVH1A8bS/iuHdwvcEqhmmAD1UNs9hJJCoND4eMpylYKhq8pQXQIL6jKLdh6neCadzzKuKfsEMyTgXNInoq4+lNngwmaaw6AVs01X2nKS2w7JD/NereDp9TSv4+GFJxFV8x3kshDhhYUj69c0GtV3R7dP6xh9WLPG0wL19485qoZvF6hk8fbimONvV/u7+tqqPtUV+JX3wjs3uo1bBWNm9A5e1Vdj61Hm/ZO7IhFe8o721rp58/7dMJd4F/BveskL3K6DhkGHgRPuna7/AIqn3Vb/OM5lJSgLCop16bVR5ZWTCUnk0vDR45ObO+Mfqhfm+yQqMDuqFfKBc4oxZ8345/Pv3TSGeI6drDRzSFjhb/ZqFwNWXFxtnKEj/Jbv9IAkMQhP6Z6icEyHz3LX4PFIS94lD2cwbCXbXUMFodsVAsuN11ITrY0iFmHwDqEo5Jaj/KZPnmWwsHiENarARijB4RDpOM/pyPWqVBXq+6ukxSpDcdD4GNT7l3Ta8exJbKtTDM30aGGLZsqqqr5tAjF9m2/pHXPx88m38Nl+NSJ0/ePpiqsr556umptZF5PNPPh63NOtDT1BC5df7pmZd4i52SNTnulTpFuppSqBZDpZkyzyz0ryWyDarTg+s2CZ33c0FbJBlWprYmwmfRntHKlNnJyUZ6Le9JvoE3TlB8OWmTynEVbI5pyXjF7ZYTPEwQg0aA5hPeev7Bk607BNas8egnvNuoOauwLYuz+vCVb3xVcM10FC8k7f5zmkRz420E+kOkJCX4DD/TzpB7XLuE9Oa/FScIa1aulR0wpjUk9q6dO8tN0IPeS9RZenhoVuurE+xrLDdveEOR0wybwuwV7+TzuwRy026HWWYF1CKdTXrZg73/gnhy0u1q4uPOtQ1ivWUqnfAleymJ7+8GLQctluekEJeyu9bM47f9eFtr5jZyT5/8MBIfEJ9luC3bzPRdmGIL/RM5hul/IR8rUIS1giyXb2Sl8aGCy4frhb7CGnPO8h8ln4jXFkgzDwTJNyqKT+ubALgA3adrljECrwbPw8dEFgA9HXE3OoYLhqiym1hmfkpOEbBe2yee0JuXgd0/5m/4vwABDve77Fw+5/QAAAABJRU5ErkJggg==","themeData":{"imgWidth":150,"imgHeight":50,"isAspectRatioChecked":true,"logoAspectRatio":3,"bgColor":"#ffffff","numberingEnabled":true,"title":{"text":"Enter title","font":"OpenSans","fontSize":18,"fontStyling":{"fontColor":"#2e2e2e","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}},"subTitle":{"text":"Enter sub title","font":"OpenSans","fontSize":14,"fontStyling":{"fontColor":"#707070","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}}}},"ranking":{"isRankingEnabled":false,"totalCoverage":101,"ranges":[{"from":"0%","to":"50%","coverage":51,"displayText":"Failed"},{"from":"51%","to":"100%","coverage":50,"displayText":"Passed"}]},"themeId":"","elementCount":0,"rules":{},"rulesAssociation":{},"duration":{"objectives":[],"durationValue":"1:15","showDurationErrorMsg":false,"labels":["1"]},"formMaxScore":0,"currentScore":0,"percentage":null}',
            formType: 'COACHING'
        };
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