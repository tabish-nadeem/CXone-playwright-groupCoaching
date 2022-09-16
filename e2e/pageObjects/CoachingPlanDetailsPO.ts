import {Page,Locator,expect} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { UIConstants } from '../common/uiConstants';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './CoachingGridPO';
import { MultiSelectDropdownPo } from './MultiselectDropdownPO';
import { SingleselectDropdownPO } from './SingleselectDropdownPO';

export class CoachingPlanDetailsPO {
    public defaultTimeoutInMillis: number;
    public coachingPackageDropdown: SingleselectDropdownPO;
    public filterDropdown: MultiSelectDropdownPo;
    public elements;
    public warningModalElements;
    public gridPO: CoachingGridPO;
    public page:Page;
    public utils:Utils;
    public uiConstants:UIConstants;
    public constructor(pageElement?: Page, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page = pageElement || this.page.locator('body');
        this.uiConstants = new UIConstants();
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-plan-details-grid-container'));
        this.filterDropdown = new MultiSelectDropdownPo('filter-dropdown');
        this.coachingPackageDropdown = new SingleselectDropdownPO('coaching-package-filter');
        this.elements = {
            coachingPlanContainer: this.page.locator('.ng2-coaching-plan-detail-page'),
            breadCrumb: this.page.locator('.breadcrumb-item'),
            pageTitle: this.page.locator('.plan-name'),
            singleSelectDropDown: this.page.locator('.cxone-singleselect-dropdown'),
            searchField: this.page.locator('.cxone-omnibar .search-wrapper input'),
            cancelBtn: this.page.locator('#cancel-button'),
            cancelModalBtn: this.page.locator('#cancel'),
            submitBtn: this.page.locator('#submit-button'),
            planNameHeading: this.page.locator('.plan-name-container .filter-label'),
            planNameInputField: this.page.locator('.plan-name-wrapper input'),
            selectCoachingPackageHeading: this.page.locator('.coaching-package-container .filter-label'),
            startDateHeading: this.page.locator('#start-date .filter-label'),
            startDateInputField: this.page.locator('#start-date'),
            endDateHeading: this.page.locator('#end-date .filter-label'),
            endDateInputField: this.page.locator('.coaching-package-component input'),
            addEmployeeBtn: this.page.locator('#add-employees-button'),
            addUsers: this.page.locator('#add-employees-button'),
            addUsers1: this.page.locator('.bulk-operations-buttons button >> text = Add Employees'),
            removeUsers: this.page.locator('#remove-employees-button'),
            removeAllLinkSelectedTab: this.page.locator('.clear-all'),
            removeAllLinkAddedTab: this.page.locator('.clear-all'),
            noEmployeesErr: this.page.locator('.no-assignee-msg'),
            addEmployeeModalWrapper: this.page.locator('.allUsersContainer'),
            addUsersModal: this.page.locator('.employee-entity-modal'),
            employeeName: (empName) => {
                return this.page.locator('xpath=.//*[contains(text(),"' + empName + '")]/../..');
            },
            addEmployeeSaveBtn: this.page.locator('#save').first(),
            planStartDate: this.page.locator('#start-date input'),
            planEndDate: this.page.locator('#end-date input'),
            selectAll: this.page.locator('.clear-selected-employees >> text = Select All'),
            userCountLbl: this.page.locator('#itemsCountLbl').first(),
            allEmployeeCards: this.page.locator('.user-element'),
            // sendReminderBtn: () => {
            //     return this.page.locator('#notify-employees-button .bulk-operations-buttons-bar button.btn.btn-sm.pull-right'));
            // },
            planNameErrorMessage: this.page.locator('#filters .plan-name-component .error-msg'),
            coachingPackageErrorMessage: this.page.locator('#filters .coaching-package-component .error-msg'),
            assignedEmployeesErrorMessage: this.page.locator('.assigned-employees * .error-msg .error-msg-no-user'),
            sendReminderBtn: this.page.locator('#notify-employees-button'),
            notificationPopover: this.page.locator('.notify-btn-tooltip'),
            completionStatus: this.page.locator('.selectize-input:not(.disabled)'),
            filterButton: this.page.locator('.filter-wrapper .filter-btn'),
            clearAllFilters: this.page.locator('.action-btns a >> text = Clear All'),
            // closeFilter: element(by.cssContainingText('#assigned-users-grid .bulk-operations-buttons-bar .filter-options a', 'Close')),
            tag: (tagName) => {
                return this.page.locator(`.cxone-tag >> text = ${tagName}`);
            },
            tags: (value) => {
                return this.page.locator(`.cxone-tag >> text = ${value}`);
            },
            searchAssignedUsers: this.page.locator('.cxone-omnibar .search-wrapper input'),
            removeSingleUser: this.page.locator('.media-type-icon .icon-Close'),
            disabledSchedulingOption: this.page.locator('.schedule-manager-wrapper .disabled'),
            activeSchedulingOption: this.page.locator('.schedule-manager-wrapper .active'),
            enabledSchedulingOption: this.page.locator('.schedule-manager-wrapper .enabled'),
            spinner: this.page.locator('div.spinner.spinner-bounce-middle'),
            conflictScheduleStatus : this.page.locator('[col-id="scheduleStatus"] .icon-warning'),
            totalCount: this.page.locator('.selected-count'),
            selectAllUsers: this.page.locator('.left-section .custom-omnibar-wrapper .count-wrapper .select-all-link a')
        };
        this.warningModalElements = {
            modalTitle: this.page.locator('.message-modal-header-wrapper .text'),
            cancelBtn: this.page.locator('cxone-modal-footer .btn-secondary'),
            clearBtn: this.page.locator('cxone-modal-footer .btn-primary')
        };
        this.utils = new Utils(this.page);
    }



    public async navigateToCreateCoachingPlan() {
        await this.page.goto(this.uiConstants.URLS.LOCALHOST + fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(this.elements.coachingPlanContainer,10000);
    }


    public async clickSubmitButton() {
        await this.page.waitForSelector(this.elements.submitBtn);
        return await this.elements.submitBtn.click();
    }

    public async setCoachingPlanName(text) {
        await this.page.waitForSelector(this.elements.planNameInputField);
        return await this.elements.planNameInputField.clear().sendKeys(text);
    }


    public async selectCoachingPackage(packageName) {
        // await this.elements.
        return await this.coachingPackageDropdown.selectItemByLabelWithoutSearchBox(packageName);
    }


    public async clickAddUsersButton() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.addUsers,30000);
        await this.elements.addUsers.click();
        return await this.page.waitForSelector(this.elements.addUsersModal);
    }






    public async setPlanStartDate(dateVal) {
        await this.page.waitForSelector(this.elements.planStartDate);
        return await this.elements.planStartDate.clear().sendKeys(dateVal);
    }




    public getAddEmployeeButton() {
        return this.elements.addEmployeeBtn;
    }

    public getSendReminderButton() {
        return this.elements.sendReminderBtn;
    }

    public clickSendReminderButton() {
        return this.elements.sendReminderBtn.click();
    }

    public getToolTipAtSendReminderBtn() {
        return this.elements.notificationPopover;
    }

    public async getRowDataByAgentName(employeeName: string, isCoachingCompleted?: boolean) {
        const row = await this.gridPO.getRowByColumnText('employeeName', employeeName);
        await this.page.waitForSelector(row, 30000);
        return {
            employeeName: await row.this.page.locator('[col-id="employeeName"]').textContent(),
            team: await row.this.page.locator('[col-id="team"]').textContent(),
            groups: await row.this.page.locator('[col-id="groups"]').textContent(),
            role: await row.this.page.locator('[col-id="role"]').textContent(),
            status: await row.this.page.locator('[col-id="scheduleStatus"]').textContent(),
            coachingCompleted: isCoachingCompleted ? await row.this.page.locator('[col-id="coachingCompleted"]').textContent() : undefined,
            lockIcon: await row.this.page.locator('.icon-newlock')
        };
    }

    public getFilterButton = () => {
        return this.elements.filterButton;
    };

    

    public async clickFilterButton() {
        await protractor.testUtils.waitForItemToBeClickable(this.getFilterButton());
        return await this.getFilterButton().click();
    }

    /**
     * Purpose of this method is to select completion status
     * @param statusesToSelect -- array
     * @returns {Promise<*>}
     */
    public async selectStatus(statusesToSelect) {
        await this.filterDropdown.selectAllItemsContainTheLabel(statusesToSelect);
    }

    // Reset the drop-down
    public async resetFilterOptions() {
        await this.clickFilterButton();
        return await this.elements.clearAllFilters.click();
    }

    public getStatusTag(tagName) {
        return this.elements.tag(tagName);
    }

 



    public async searchAssignedUsers(userName) {
        await this.page.waitForSelector(this.elements.searchAssignedUsers);
        await this.elements.searchAssignedUsers.clear().sendKeys(userName);
        await fdUtils.waitABit(1000);
    }




    public async waitForSubmitButtonToBeClickable() {
        return await protractor.testUtils.waitForItemToBeClickable(this.elements.submitBtn);
    }



    public getItemCount() {
        return this.elements.totalCount.textContent();
    }

 
}
