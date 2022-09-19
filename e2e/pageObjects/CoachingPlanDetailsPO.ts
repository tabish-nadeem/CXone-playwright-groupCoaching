import {Page,Locator} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { UIConstants } from '../common/uiConstants';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './CoachingGridPO';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { MultiSelectDropdownPo } from './MultiselectDropdownPO';
import { SingleselectDropdownPO } from './SingleselectDropdownPO';

export class CoachingPlanDetailsPO {
    public defaultTimeoutInMillis: number;
    public coachingPackageDropdown: SingleselectDropdownPO;
    public filterDropdown: MultiSelectDropdownPo;
    public gridPO: CoachingGridPO;
    public page:Page;
    public utils:Utils;
    public uiConstants:UIConstants;
    public coachingPlanContainer: Locator;
    public breadCrumb: Locator;
    public pageTitle: Locator;
    public singleSelectDropDown: Locator;
    public searchField: Locator;
    public cancelBtn: Locator;
    public cancelModalBtn: Locator;
    public submitBtn: Locator;
    public planNameHeading: Locator;
    public planNameInputField: Locator;
    public selectCoachingPackageHeading: Locator;
    public startDateHeading: Locator;
    public startDateInputField: Locator;
    public endDateHeading: Locator;
    public endDateInputField: Locator;
    public addEmployeeBtn: Locator;
    public addUsers: Locator;
    public addUsers1: Locator;
    public removeUsers: Locator;
    public removeAllLinkSelectedTab: Locator;
    public removeAllLinkAddedTab: Locator;
    public noEmployeesErr: Locator;
    public addEmployeeModalWrapper: Locator;
    public addUsersModal: Locator;
    public employeeName: Locator;
    public addEmployeeSaveBtn: Locator;
    public planStartDate: Locator;
    public planEndDate: Locator;
    public selectAll: Locator;
    public userCountLbl: Locator;
    public allEmployeeCards: Locator;
    public planNameErrorMessage: Locator;
    public coachingPackageErrorMessage: Locator;
    public assignedEmployeesErrorMessage: Locator;
    public sendReminderBtn: Locator;
    public notificationPopover: Locator;
    public completionStatus: Locator;
    public filterButton: Locator;
    public clearAllFilters: Locator;
    public tag: Locator;
    public tags: Locator;
    public searchAssignedUsers: Locator;
    public removeSingleUser: Locator;
    public disabledSchedulingOption: Locator;
    public activeSchedulingOption: Locator;
    public enabledSchedulingOption: Locator;
    public spinner: Locator;
    public conflictScheduleStatus: Locator;
    public totalCount: Locator;
    public selectAllUsers: Locator;
    public modalTitle: Locator;
    public cancelBtn_: Locator;
    public clearBtn: Locator;
    public constructor(pageElement?: Page, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page = pageElement || this.page.locator('body');
        this.uiConstants = new UIConstants();
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-plan-details-grid-container'));
        this.filterDropdown = new MultiSelectDropdownPo('filter-dropdown');
        this.coachingPackageDropdown = new SingleselectDropdownPO('coaching-package-filter');
        this.utils = new Utils(this.page);
            this.coachingPlanContainer = this.page.locator('.ng2-coaching-plan-detail-page');
            this.breadCrumb = this.page.locator('.breadcrumb-item');
            this.pageTitle = this.page.locator('.plan-name');
            this.singleSelectDropDown = this.page.locator('.cxone-singleselect-dropdown');
            this.searchField = this.page.locator('.cxone-omnibar .search-wrapper input');
            this.cancelBtn = this.page.locator('#cancel-button');
            this.cancelModalBtn = this.page.locator('#cancel');
            this.submitBtn = this.page.locator('#submit-button');
            this.planNameHeading = this.page.locator('.plan-name-container .filter-label');
            this.planNameInputField = this.page.locator('.plan-name-wrapper input');
            this.selectCoachingPackageHeading = this.page.locator('.coaching-package-container .filter-label');
            this.startDateHeading = this.page.locator('#start-date .filter-label');
            this.startDateInputField = this.page.locator('#start-date');
            this.endDateHeading = this.page.locator('#end-date .filter-label');
            this.endDateInputField = this.page.locator('.coaching-package-component input');
            this.addEmployeeBtn = this.page.locator('#add-employees-button');
            this.addUsers = this.page.locator('#add-employees-button');
            this.addUsers1 = this.page.locator('.bulk-operations-buttons button >> text = Add Employees');
            this.removeUsers = this.page.locator('#remove-employees-button');
            this.removeAllLinkSelectedTab = this.page.locator('.clear-all');
            this.removeAllLinkAddedTab = this.page.locator('.clear-all');
            this.noEmployeesErr = this.page.locator('.no-assignee-msg');
            this.addEmployeeModalWrapper = this.page.locator('.allUsersContainer');
            this.addUsersModal = this.page.locator('.employee-entity-modal');
            this.employeeName = (empName:any) => {
                return this.page.locator('xpath=.//*[contains(text(),"' + empName + '")]/../..');
            },
            this.addEmployeeSaveBtn = this.page.locator('#save').first();
            this.planStartDate = this.page.locator('#start-date input');
            this.planEndDate = this.page.locator('#end-date input');
            this.selectAll = this.page.locator('.clear-selected-employees >> text = Select All');
            this.userCountLbl = this.page.locator('#itemsCountLbl').first();
            this.allEmployeeCards = this.page.locator('.user-element');
            // sendReminderBtn: () => {
            //     return this.page.locator('#notify-employees-button .bulk-operations-buttons-bar button.btn.btn-sm.pull-right'));
            // },
            this.planNameErrorMessage = this.page.locator('#filters .plan-name-component .error-msg');
            this.coachingPackageErrorMessage = this.page.locator('#filters .coaching-package-component .error-msg');
            this.assignedEmployeesErrorMessage = this.page.locator('.assigned-employees * .error-msg .error-msg-no-user');
            this.sendReminderBtn = this.page.locator('#notify-employees-button');
            this.notificationPopover = this.page.locator('.notify-btn-tooltip');
            this.completionStatus = this.page.locator('.selectize-input:not(.disabled)');
            this.filterButton = this.page.locator('.filter-wrapper .filter-btn');
            this.clearAllFilters = this.page.locator('.action-btns a >> text = Clear All');
            // closeFilter: element(by.cssContainingText('#assigned-users-grid .bulk-operations-buttons-bar .filter-options a', 'Close')),
            this.tag = (tagName:any) => {
                return this.page.locator(`.cxone-tag >> text = ${tagName}`);
            },
            this.tags = (value:any) => {
                return this.page.locator(`.cxone-tag >> text = ${value}`);
            },
            this.searchAssignedUsers = this.page.locator('.cxone-omnibar .search-wrapper input');
            this.removeSingleUser = this.page.locator('.media-type-icon .icon-Close');
            this.disabledSchedulingOption = this.page.locator('.schedule-manager-wrapper .disabled');
            this.activeSchedulingOption = this.page.locator('.schedule-manager-wrapper .active');
            this.enabledSchedulingOption = this.page.locator('.schedule-manager-wrapper .enabled');
            this.spinner = this.page.locator('div.spinner.spinner-bounce-middle');
            this.conflictScheduleStatus = this.page.locator('[col-id="scheduleStatus"] .icon-warning');
            this.totalCount = this.page.locator('.selected-count');
            this.selectAllUsers = this.page.locator('.left-section .custom-omnibar-wrapper .count-wrapper .select-all-link a');
            this.modalTitle = this.page.locator('.message-modal-header-wrapper .text');
            this.cancelBtn_ = this.page.locator('cxone-modal-footer .btn-secondary');
            this.clearBtn = this.page.locator('cxone-modal-footer .btn-primary');
        };
        
    



    public async navigateToCreateCoachingPlan() {
        await this.page.goto(this.uiConstants.URLS.LOCALHOST + fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(this.coachingPlanContainer,10000);
    }


    public async clickSubmitButton() {
        await this.page.waitForSelector(this.submitBtn);
        return await this.submitBtn.click();
    }

    public async setCoachingPlanName(text) {
        await this.page.waitForSelector(this.planNameInputField);
        return await this.planNameInputField.clear().sendKeys(text);
    }


    public async selectCoachingPackage(packageName) {
        // await this.
        return await this.coachingPackageDropdown.selectItemByLabelWithoutSearchBox(packageName);
    }


    public async clickAddUsersButton() {
        await CommonUIUtils.waitForItemToBeClickable(this.addUsers,30000);
        await this.addUsers.click();
        return await this.page.waitForSelector(this.addUsersModal);
    }



    public async setPlanStartDate(dateVal) {
        await this.page.waitForSelector(this.planStartDate);
        return await this.planStartDate.clear().sendKeys(dateVal);
    }



    public getAddEmployeeButton() {
        return this.addEmployeeBtn;
    }

    public getSendReminderButton() {
        return this.sendReminderBtn;
    }

    public clickSendReminderButton() {
        return this.sendReminderBtn.click();
    }

    public getToolTipAtSendReminderBtn() {
        return this.notificationPopover;
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
        return this.filterButton;
    };

    

    public async clickFilterButton() {
        await CommonUIUtils.waitForItemToBeClickable(this.getFilterButton());
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
        return await this.clearAllFilters.click();
    }

    public getStatusTag(tagName) {
        return this.tag(tagName);
    }




    public async waitForSubmitButtonToBeClickable() {
        return await CommonUIUtils.waitForItemToBeClickable(this.submitBtn);
    }



    public getItemCount() {
        return this.totalCount.textContent();
    }

 
}
