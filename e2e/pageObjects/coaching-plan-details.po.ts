import {Page,Locator,expect} from '@playwright/test';
import { fdUtils } from '../common/FdUtils';
import { UIConstants } from '../common/uiConstants';
import { Utils } from '../common/utils';
import { CoachingGridPO } from './coaching-grid.po';
import { MultiSelectDropdownPo } from './multiselect-Dropdown.po';
import { SingleselectDropdownPO } from './singleselect-dropdown.po';

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
    public constructor(pageElement?: Locator, defaultTimeoutInMillis?: number) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis ? defaultTimeoutInMillis : 20000;
        this.page.locator = pageElement || this.page.locator('body');
        this.uiConstants = new UIConstants();
        this.gridPO = new CoachingGridPO(this.page.locator('#coaching-plan-details-grid-container'));
        this.filterDropdown = new MultiSelectDropdownPo('filter-dropdown');
        this.coachingPackageDropdown = new SingleselectDropdownPO('coaching-package-filter');
        this.elements = {
            coachingPlanContainer: this.page.locator('.ng2-coaching-plan-detail-page'),
            breadCrumb: this.page.locator('.breadcrumb-item'),
            pageTitle: this.page.locator('.plan-name'),
            singleSelectDropDown: by.css('.cxone-singleselect-dropdown'),
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
            selectAllUsers: this.page.locator('.left-section .custom-omnibar-wrapper .count-wrapper .select-all-link a'))
        };
        this.warningModalElements = {
            modalTitle: this.page.locator('.message-modal-header-wrapper .text'),
            cancelBtn: this.page.locator('cxone-modal-footer .btn-secondary'),
            clearBtn: this.page.locator('cxone-modal-footer .btn-primary')
        };
        this.utils = new Utils(this.page);
    }

    public async clickBreadCrumbLink() {
        return await this.elements.breadCrumb.click();
    }

    public async getToolTip(elem) {
        await this.page.mouse.move(elem);
        await this.page.waitForSelector(this.elements.toolTip);
        return await this.elements.toolTip.textContent();
    }

    public async getTags(tagName) {
        return await this.elements.tags(tagName);
    }

    public async navigateToCreateCoachingPlan() {
        await this.page.goto(this.uiConstants.URLS.LOCALHOST + fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
        await this.page.waitForSelector(this.elements.coachingPlanContainer,10000);
    }

    public async getBreadCrumbText() {
        await this.page.waitForSelector(this.elements.breadCrumb);
        return await this.elements.breadCrumb.textContent();
    }

    public async getPageTitle() {
        await this.page.waitForSelector(this.elements.pageTitle);
        return await this.elements.pageTitle.textContent();
    }

    public async clickCancelButton() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.cancelBtn);
        return await this.elements.cancelBtn.click();
    }

    public async clickCancelModalButton() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.cancelModalBtn);
        return await this.elements.cancelModalBtn.click();
    }

    public async clickSubmitButton() {
        await this.page.waitForSelector(this.elements.submitBtn);
        return await this.elements.submitBtn.click();
    }

    public async getPlanNameHeading() {
        await this.page.waitForSelector(this.elements.planNameInputField);
        return await this.elements.planNameHeading.textContent();
    }

    public async setCoachingPlanName(text) {
        await this.page.waitForSelector(this.elements.planNameInputField);
        return await this.elements.planNameInputField.clear().sendKeys(text);
    }

    public async getSelectCoachingPackageHeading() {
        await this.page.waitForSelector(this.elements.selectCoachingPackageHeading);
        return await this.elements.selectCoachingPackageHeading.textContent();
    }

    public async selectCoachingPackage(packageName) {
        // await this.elements.
        return await this.coachingPackageDropdown.selectItemByLabelWithoutSearchBox(packageName);
    }

    public async getStartDateHeading() {
        await this.page.waitForSelector(this.elements.startDateHeading);
        return await this.elements.startDateHeading.textContent();
    }

    public async setStartDate(dateText) {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.startDateInputField);
        return await this.elements.startDateInputField.clear().sendKeys(dateText);
    }

    public async getEndDateHeading() {
        await this.page.waitForSelector(this.elements.endDateHeading);
        return await this.elements.endDateHeading.textContent();
    }

    // public async setStartDate(dateText) {
    //     await protractor.testUtils.waitForItemToBeClickable(this.elements.endDateInputField);
    //     return await this.elements.endDateInputField.clear().sendKeys(dateText);
    // }

    public async getNoEmployeeAssignMsg() {
        await this.page.waitForSelector(this.elements.noEmployeesErr);
        return await this.elements.noEmployeesErr.textContent();
    }

    public async clickAddEmployeesButton() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.addEmployeeBtn);
        await this.elements.addEmployeeBtn.click();
        return await this.page.waitForSelector(this.elements.addEmployeeModalWrapper);
    }

    public async clickAddUsersButton() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.addUsers,30000);
        await this.elements.addUsers.click();
        return await this.page.waitForSelector(this.elements.addUsersModal);
    }

    public async clickAddUsersButton1() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.addUsers1, 30000);
        await this.elements.addUsers1.click();
        return await this.page.waitForSelector(this.elements.addUsersModal);
    }

    public getAddUsersButton() {
        return this.elements.addUsers;
    }

    public async clickRemoveUsersButton() {
        await Utils.waitUntilClickable(this.elements.removeUsers);
        return await this.elements.removeUsers.click();
    }

    public async clickRemoveAllLinkSelectedTab() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.removeAllLinkSelectedTab);
        return await this.elements.removeAllLinkSelectedTab.click();
    }

    public async clickRemoveAllLinkAddedTab() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.removeAllLinkAddedTab);
        return await this.elements.removeAllLinkAddedTab.click();
    }

    public async selectEmployee(employeeName) {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.employeeName(employeeName));
        return await this.elements.employeeName(employeeName).click();
    }

    public async verifyEmployeePresence(employeeName) {
        return await this.elements.employeeName(employeeName).isPresent();
    }

    public async clickAddEmployeeSaveBtn() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.addEmployeeSaveBtn);
        return await this.elements.addEmployeeSaveBtn.click();
    }

    public async setPlanStartDate(dateVal) {
        await this.page.waitForSelector(this.elements.planStartDate);
        return await this.elements.planStartDate.clear().sendKeys(dateVal);
    }

    public async setPlanEndDate(dateVal) {
        await this.page.waitForSelector(this.elements.planEndDate);
        return await this.elements.planEndDate.clear().sendKeys(dateVal);
    }

    public getStartDate() {
        return this.elements.planStartDate;
    }

    public getEndDate() {
        return this.elements.planEndDate;
    }

    public async selectAllEmployees() {
        await Utils.waitUntilInvisible(this.elements.selectAll);
        return await this.elements.selectAll.click();
    }

    public async selectAllEmployeesInAddEmployeeModal() {
        // await Utils.waitUntilInvisible(this.elements.selectAllUsers);
        return await this.elements.selectAllUsers.click();
    }

    public async getPlanEndDate() {
        return await this.elements.planEndDate.getAttribute('value');
    }

    public async getTotalUserCount() {
        await this.page.waitForSelector(this.elements.userCountLbl);
        return await this.elements.userCountLbl.textContent();
    }

    public getAllUserCards() {
        return this.elements.allEmployeeCards;
    }

    public getPlanNameErrorMessage() {
        return this.elements.planNameErrorMessage;
    }

    public getCoachingPackageErrorMessage() {
        return this.elements.coachingPackageErrorMessage;
    }

    public getAssignedEmployeesErrorMessage() {
        return this.elements.assignedEmployeesErrorMessage;
    }

    public async getLockIconOnEmployeeRow(employeeName?) {
        let userRow = await this.getRowDataByAgentName(employeeName, false);
        return userRow.lockIcon.isPresent();
    }

    public async waitForLockIconToDisplay(employeeName, timeOut?) {
        let count = 1;
        let sleepTime = 10000;
        for (let i = 0; i < 10; i++) {
            // await browser.refresh();
            await this.page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
            await this.utils.delay(sleepTime);
            console.log('Trying to find lock icon at coaching plan details Page for user: [' + employeeName + ']for Retry: ' + count++);
            if (await this.getLockIconOnEmployeeRow(employeeName)) {
                return;
            }
        }
        console.log('Unable to find lock icon!');
    }

    public async clickOnEmployeeRow(employeeName) {
        const row = await this.gridPO.getRowByColumnText('employeeName', employeeName);
        await this.page.waitForSelector(row, 30000);
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

    public getCompletionStatusDropdown() {
        return this.elements.completionStatus;
    }

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

    public async closeFilterOption() {
        await protractor.testUtils.waitForItemToBeClickable(this.elements.closeFilter);
        return await this.elements.closeFilter.click();
    }

    public getStatusTag(tagName) {
        return this.elements.tag(tagName);
    }

    public getDisabledSchedulingOption() {
        return this.elements.disabledSchedulingOption;
    }

    public getEnabledSchedulingOption() {
        return this.elements.enabledSchedulingOption;
    }

    public getActiveSchedulingOption() {
        return this.elements.activeSchedulingOption;
    }

    public async clickSchedulingOptions() {
        return await this.getEnabledSchedulingOption().click();
    }

    public async searchAssignedUsers(userName) {
        await this.page.waitForSelector(this.elements.searchAssignedUsers);
        await this.elements.searchAssignedUsers.clear().sendKeys(userName);
        await fdUtils.waitABit(1000);
    }

    public async clearSearchAssigneeField() {
        await this.page.waitForSelector(this.elements.searchAssignedUsers);
        return await this.elements.searchAssignedUsers.clear();
    }

    public async clickRemoveSingleuser(index?) {
        if (!index) {
            index = 0;
        }
        await protractor.testUtils.waitForItemToBeClickable(this.elements.removeSingleUser.get(index));
        return await this.elements.removeSingleUser.get(index).click();
    }

    public async waitForSubmitButtonToBeClickable() {
        return await protractor.testUtils.waitForItemToBeClickable(this.elements.submitBtn);
    }

    public async waitForSpinnerToDisappear() {
        return await protractor.testUtils.waitUntilNotVisible(this.elements.spinner, 60000);
    }

    public async cancelWarning() {
        return await this.warningModalElements.cancelBtn.click();
    }

    public getItemCount() {
        return this.elements.totalCount.textContent();
    }

    public async clearSchedulingOptions() {
        return await this.warningModalElements.clearBtn.click();
    }

    public getWarningModalTitle() {
        return this.warningModalElements.modalTitle.isPresent();
    }

    public async getRowWithConflictScheduledStatus(index) {
        let elem = this.elements.conflictScheduleStatus.get(index);
        await this.page.waitForSelector(elem);
        return elem;
    }

    public async getRowElement(userName) {
        const rowByName = await this.gridPO.getRowByColumnText('employeeName', userName);
        await this.page.waitForSelector(rowByName, 30000);
        return rowByName;
    }

    public async selectParticularUser(userName) {
        const rowByName = await this.gridPO.getRowByColumnText('employeeName', userName);
        await this.page.waitForSelector(rowByName, 30000);
        let checkboxToSelect = await rowByName.this.page.locator('span.ag-selection-checkbox .ag-icon.ag-icon-checkbox-unchecked'));
        let check = await checkboxToSelect.isPresent();
        await Utils.waitUntilClickable(checkboxToSelect);
        await checkboxToSelect.click();
    }
}
