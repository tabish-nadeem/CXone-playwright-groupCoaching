import {Page,Locator} from '@playwright/test';
import { Utils } from '../common/utils';
import { SingleselectDropdownPO } from './SingleselectDropdownPO';

export class ScheduleManagerPO {
    public defaultTimeoutInMillis: number;
    public activitiesDropDown: SingleselectDropdownPO;
    public coachingPackageDropdown: SingleselectDropdownPO;
    public page:Page;
    public utils:Utils;
    public saveModalTitle: any;
    public simultaneousBookingsTextBox: any;
    public saveBtn: any;
    public cancelBtn: any;
    public closeModalBtn: any;
    public formSaveErrorMsg: any;
    public simultaneousBookingValidationErrorMsg: any;
    public textBox: any;
    public constructor( defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.activitiesDropDown = new SingleselectDropdownPO('schedulingOptionsActivityId');
        this.saveModalTitle=this.page.locator(('cxone-modal .headerTitle')),
        this.simultaneousBookingsTextBox=this.page.locator(('cxone-modal #schedulingOptionsSimultaneousBookings input')),
        this.saveBtn=this.page.locator(('.modal-footer-wrapper .btn-primary')),
        this.cancelBtn=this.page.locator(('.modal-footer-wrapper .btn-secondary')),
        this.closeModalBtn=this.page.locator(('cxone-modal i.close-button')),
        this.formSaveErrorMsg=this.page.locator(('span.error-msg')),
        this.simultaneousBookingValidationErrorMsg=this.page.locator(('max-simultaneous-bookings-error-msg')),
        this.textBox=this.page.locator(('schedulingOptionsSimultaneousBookings'))
        };
    

    // Function to verify header title of Save Modal window
    public async checkSaveModalHeaderText() {
        return await this.saveModalTitle.isPresent();
    }

    public async getSaveModalHeaderText() {
        return await this.saveModalTitle.getText();
    }

    public async getSaveButton() {
        return await this.saveBtn;
    }

    // Function to verify Save button in Save Modal window
    public async checkSaveButton() {
        return await this.saveBtn.isPresent();
    }

    // Function to click on Save button in Save Modal window
    public async clickSaveButton(skipWaitForSpinner?) {
        await this.utils.waitForItemToBeClickable(this.saveBtn,5000);
        await this.saveBtn.click();
        if (!skipWaitForSpinner) {
            await Utils.waitUntilNotVisible(this.page.locator('div.spinner.spinner-bounce-middle'), 60000);
        }
    }

    // Function to verify Cancel button in Save Modal window
    public async checkCancelButton() {
        return await this.cancelBtn.isPresent();
    }

    // Function to click on Cancel button in Save Modal window
    public async clickCancelButton() {
        return await this.cancelBtn.click();
    }

    // Function to verify close(x) button in Save Modal window
    public async checkModalCloseButton() {
        return await this.closeModalBtn.isPresent();
    }

    // Function to click on close(x) button in Save Modal window
    public async clickModalCloseButton() {
        return await this.closeModalBtn.click();
    }

    public getRequiredErrorMsg() {
        return this.formSaveErrorMsg;
    }

    public async clearSimultaneousBookings() {
        await Utils.waitUntilVisible(this.simultaneousBookingsTextBox);console.log('sm po line 88');
        return await this.simultaneousBookingsTextBox.clear();
    }

    public async enterSimultaneousBooking(simultaneousBooking) {
        await Utils.waitUntilVisible(this.simultaneousBookingsTextBox);
        return await this.simultaneousBookingsTextBox.clear().sendKeys(simultaneousBooking);
    }

    public getSimultaneousBookingValidationErrorMsg() {
        return this.formSaveErrorMsg;
    }

    // public async getActivitiesDropdown = () => {
    //     return await this.activitiesDropDown;
    // };

    public async clickActivitiesDropDownAndAway() {
        await this.activitiesDropDown.toggle();
        return await this.saveModalTitle.click();
    }

    public async selectActivity(activity) {
        return await this.activitiesDropDown.selectItemByLabelWithoutSearchBox(activity);
    }

    public async getModalTitle() {
        return await this.saveModalTitle;
    }
}