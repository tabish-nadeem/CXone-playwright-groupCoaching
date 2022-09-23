import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonNoUIUtils } from "../../../e2e/common/CommonNoUIUtils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { LoginPage } from "../../../e2e/common/login";
import { LocalizationNoUI } from "../../../e2e/common/LocalizationNoUI";
import { FeatureToggleUtils } from "../../../e2e/common/FeatureToggleUtils";
import { fdUtils } from "../../../e2e/common/FdUtils";
import { AdminUtilsNoUI } from "../../../e2e/common/AdminUtilsNoUI";
import { CommonQMNoUIUtils } from "../../../e2e/common/CommonQMNoUIUtils";
import { GlobalTenantUtils } from "../../../e2e/common/globalTenantUtils";
import { FEATURE_TOGGLES } from "../../../e2e/common/uiConstants";
import { webdriverUtils } from "../../../e2e/common/webdriverUtils";
import { AccountUtils } from "../../common/AccountUtils";
import { Utils } from "../../common/utils";
import { OnPrepare, envToDisable } from '../../../../playwright.config';
//po'
import { CoachingPlansPO } from "../../../e2e/pageObjects/CoachingPlansPO";
import { CoachingPackagesPO } from "../../../e2e/pageObjects/CoachingPackagePO";
import { CoachingPlanDetailsPO } from "../../../e2e/pageObjects/CoachingPlanDetailsPO";
import { AddEntityPO } from "../../../e2e/pageObjects/AddEntityPO";
import { ScheduleManagerPO } from "../../../e2e/pageObjects/schedule-manager.po";

let browser: any;
let userDetails : any;
let context: BrowserContext;
let page:Page;
let globalTenantUtils:GlobalTenantUtils;
let localeString = 'en-US';
let adminDetails, userCount, count, globalToken, userSkills;
let loginPage:LoginPage;
let planName = 'Plan_' + moment();
let planNameWithSchedulingOptions = 'Plan2_' + moment();
let coachingPackage = new CoachingPackagesPO();
let coachingPlan = new CoachingPlansPO();
let coachingPlanDetailsPage = new CoachingPlanDetailsPO();
let addEntity = new AddEntityPO();
let schedulingOptions = new ScheduleManagerPO();
let utils : Utils

let dates = {
    currentDate: moment(),
    defaultPlanEndDate: moment().add(6, 'days'),
    futureDate: moment().add(2, 'day')
};

let groupsData: any = {
    group1: {
        name: 'GROUP1' + moment(),
        id: ''
    },
    group2: {
        name: 'GROUP2' + moment(),
        id: ''
    }
};
let teamsData = {
    team1: {
        name: 'TEAM1' + moment(),
        id: ''
    },
    team2: {
        name: 'TEAM2' + moment(),
        id: ''
    }
};
let userData: any = {
    user1: {
        email: 'ptor' + AccountUtils.getRandomEmail(2),
        teamId: '',
        groupIds: [],
        firstName: 'fname1',
        lastName: 'lname1'
    },
    user2: {
        email: 'ptor' + AccountUtils.getRandomEmail(2),
        teamId: '',
        groupIds: [],
        firstName: 'fname2',
        lastName: 'lname2',
        skills: []
    }
};

let dateFormat;
let coachingPackageName = 'COACHING_PACKAGE' + CommonUIUtils.getRandomString();
let statusActive = 'Active';
let statusScheduled = 'Scheduled';

const setTenantDetails = () => {
    let defaultUserCredentials:any = globalTenantUtils.getDefaultTenantCredentials();
    adminDetails = {
        emailAddress: defaultUserCredentials.adminCreds.email,
        orgName: defaultUserCredentials.orgName,
        password: defaultUserCredentials.adminCreds.password,
        firstName: defaultUserCredentials.firstName,
        lastName: defaultUserCredentials.lastName
    };
};

BeforeAll({timeout: 400 * 1000}, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    utils = new Utils(page)

    setTenantDetails();
    let response = await CommonNoUIUtils.login(adminDetails.emailAddress, adminDetails.password, false);
            globalToken = response;
            await Utils.enablingFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING22, adminDetails.orgName, globalToken);
            await Utils.enablingFeatureToggle(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, adminDetails.orgName, globalToken);
            let promiseArr = [
                AdminUtilsNoUI.createGroup(groupsData.group1.name, globalToken),
                AdminUtilsNoUI.createGroup(groupsData.group2.name, globalToken),
                AdminUtilsNoUI.createTeam(teamsData.team1.name, 'Team Description', teamsData.team1.id, globalToken),
                AdminUtilsNoUI.createTeam(teamsData.team2.name, 'Team Description', teamsData.team2.id, globalToken),
                // fdUtils.removeAllUsers(globalToken)
            ];
            response = await Promise.all(promiseArr);
            groupsData.group1.id = response[0].groupId;
            groupsData.group2.id = response[1].groupId;
            teamsData.team1.id = response[2].team.id;
            teamsData.team2.id = response[3].team.id;
            userData.user1.teamId = teamsData.team1.id;
            userData.user1.groupIds.push(groupsData.group1.id); //User 1 is part of group1 team 1
            userData.user2.teamId = teamsData.team2.id;
            userData.user2.groupIds.push(groupsData.group1.id, groupsData.group2.id); //User 2 is part of group1,group2 team 2

            promiseArr = [
                AccountUtils.createNewUser(userData.user1.email, userData.user1, globalToken,true),
                AccountUtils.createNewUser(userData.user2.email, userData.user2, globalToken,true),
                CommonQMNoUIUtils.createCoachingPackage(coachingPackage.generatePackageData(coachingPackageName, 'Published'), globalToken)
            ];
            await Promise.all(promiseArr);

            dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
            console.log('DateTime formats to use', dateFormat);
        
});
Given("50k UserSupport: should verify mandatory Fields and default date selection",{ timeout: 60 * 1000 }, async () => {
    // const onStart = async () => {
    //     await protractorConfig.testUtils.login(adminDetails.emailAddress, protractorConfig.testUtils.validPassword, protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
    //     await protractorConfig.testUtils.waitForPage(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
    //     await protractorConfig.testUtils.maximizeBrowserWindow();
    // };
    //

     let newONPrepre = new OnPrepare(userDetails);
       await newONPrepre.OnStart();
    let response   = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
 await FeatureToggleUtils.removeFeatureToggle(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, adminDetails.orgName, globalToken);
    await coachingPlan.clickNewCoachingPlanButton();
    await Utils.waitUntilVisible(coachingPlanDetailsPage.getAddUsersButton());
    expect(coachingPlanDetailsPage.getStartDate().getAttribute('value'))
    .toEqual(dates.currentDate.format(dateFormat.shortDateFormat));
    expect(coachingPlanDetailsPage.getEndDate().getAttribute('value')).toEqual(dates.defaultPlanEndDate.format(dateFormat.shortDateFormat));

    await coachingPlanDetailsPage.clickSubmitButton();
    expect(await page.locator(coachingPlanDetailsPage.getPlanNameErrorMessage()).textContent())
        .toEqual(fdUtils.getExpectedString('coachingPlanDetails.validationMsg.fieldRequired'));

    await coachingPlanDetailsPage.setCoachingPlanName(planName);
    expect(await page.locator(coachingPlanDetailsPage.getCoachingPackageErrorMessage()).textContent())
        .toEqual(fdUtils.getExpectedString('coachingPlanDetails.validationMsg.fieldRequired'));

    await coachingPlanDetailsPage.selectCoachingPackage(coachingPackageName);
})
When("50k UserSupport: should verify enhancedAddUsersModal is opened to add users",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickAddUsersButton();
    // expect(await addEntity.isMoveButtonPresent()).toEqual(true);
    expect(page.locator('.movePush .cxone-btn').isVisible()).toEqual(true);
})
Then("50k UserSupport: should verify SelectAll checkbox on addEmployeeModal adds users to selected section",{ timeout: 60 * 1000 }, async () => {
    await Utils.waitForSpinnerToDisappear();
    expect(await addEntity.getTotalCount()).toEqual('3 total');
    await addEntity.selectAllRowsCheckboxes();
    await addEntity.clickMoveButton();
    await Utils.waitForSpinnerToDisappear();
    expect(await addEntity.getTotalCount()).toEqual('0 total');
    let tab = await addEntity.getTabLabel(0);
    expect(tab).toEqual('SELECTED (3)');
})
Then("50k UserSupport: should verify all Users are displayed On CoachingPlanDetailsPage",{ timeout: 60 * 1000 }, async () => {
    await addEntity.saveBtn();
    await Utils.waitForLoadingToDisappear();
    userCount = await coachingPlanDetailsPage.getItemCount();
    expect(userCount).toEqual('3 Total');
})
Then("50k UserSupport: should verify that single user can be removed from the plan",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickRemoveSingleuser(2);
    userCount = await coachingPlanDetailsPage.getItemCount();
    expect(userCount).toEqual('2 Total ( Viewing 2 )');
    await coachingPlanDetailsPage.clickRemoveSingleuser(0);
    userCount = await coachingPlanDetailsPage.getItemCount();
    expect(userCount).toEqual('1 Total ( Viewing 1 )');
})
Then("50k UserSupport: should verify that remove users button on CoachingPlanDetailsPage is deleting the selected users",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickAddUsersButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.selectAllRowsCheckboxes();
    await addEntity.clickMoveButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.saveBtn();
    await Utils.waitForLoadingToDisappear();
    await coachingPlanDetailsPage.selectParticularUser(userData.user1.firstName + ' ' + userData.user1.lastName);
    await coachingPlanDetailsPage.selectParticularUser(userData.user2.firstName + ' ' + userData.user2.lastName);
    await coachingPlanDetailsPage.clickRemoveUsersButton();
    userCount = await coachingPlanDetailsPage.getItemCount();
    expect(userCount).toEqual('1 Total ( Viewing 1 )');
    await coachingPlanDetailsPage.clickAddUsersButton();
    await Utils.waitForSpinnerToDisappear();
    expect(await addEntity.getTotalCount()).toEqual('2 total');
    expect(await addEntity.getTabLabel(1)).toEqual('ASSIGNED (1)');
})
Then("50k UserSupport: should verify that Teams and Groups filters are working properly",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickFilterButton();
    await addEntity.selectTeams([teamsData.team1.name]);
    await Utils.waitForSpinnerToDisappear();
    await addEntity.selectGroups([groupsData.group1.name]);
    await Utils.waitForSpinnerToDisappear();
    await utils.delay(1000);
    let usersCount = await addEntity.rowCount();
    expect(usersCount).toEqual(1);
    expect(await addEntity.getTotalCount()).toEqual('1 total (viewing 1)');
    await addEntity.cancelBtn();
    await coachingPlanDetailsPage.clickRemoveSingleuser(0);
})
Then("50k UserSupport: should verify that user is able to schedule the plan with selected information",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickAddUsersButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.selectAllRowsCheckboxes();
    await addEntity.clickMoveButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.saveBtn();
    await coachingPlanDetailsPage.setPlanStartDate(dates.futureDate.format(dateFormat.shortDateFormat));
    await coachingPlanDetailsPage.clickSubmitButton();
    await Utils.waitForSpinnerToDisappear();
    let planRowElements = await coachingPlan.getRowElementsByPlanName(planName);
    expect(planRowElements.employees).toBe('3');
    expect(planRowElements.status).toBe(statusScheduled);
})
Then("50k UserSupport: should verify that a lock icon is shown for the user (when we change the \'can be coached'\ attribute to false after scheduling the plan)",{ timeout: 60 * 1000 }, async () => {
    let allUsers = await CommonNoUIUtils.getUsers("");
    let user2 = _.find(allUsers, {firstName: userData.user2.firstName});
    // await protractorConfig.adminUtilsNoUI.updateUserWithAttribute(user2, 'canBeCoachedOrEvaluated', 'false');
    await coachingPlan.openSavedPlan(planName);
    await Utils.waitForSpinnerToDisappear();
    await coachingPlanDetailsPage.waitForLockIconToDisplay(userData.user2.firstName + ' ' + userData.user2.lastName);
    expect(coachingPlanDetailsPage.getLockIconOnEmployeeRow(userData.user2.firstName + ' ' + userData.user2.lastName)).toBeTruthy();
})
Then("50k UserSupport: should verify that user is able to activate coaching plan successfully",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.setPlanStartDate(dates.currentDate.format(dateFormat.shortDateFormat));
    await coachingPlanDetailsPage.clickSubmitButton();
    await Utils.waitForSpinnerToDisappear();
    let planRowElements = await coachingPlan.getRowElementsByPlanName(planName);
    expect(planRowElements.employees).toBe('3');
    expect(planRowElements.status).toBe(statusActive);
    await coachingPlan.openSavedPlan(planName);
    await Utils.waitForSpinnerToDisappear();
    expect(coachingPlanDetailsPage.getRowElement(userData.user2.firstName + ' ' + userData.user2.lastName)).toBeTruthy();
    userCount = await coachingPlanDetailsPage.getItemCount();
    expect(userCount).toEqual('3 Total');
})
Then("50k UserSupport: should verify that an employee is not available to add to a new coaching plan (Can Be Coached Attribute = false)",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickCancelButton();
    await coachingPlan.clickNewCoachingPlanButton();
    // await protractorConfig.testUtils.waitUntilVisible(coachingPlanDetailsPage.getAddUsersButton());
    await coachingPlanDetailsPage.clickAddUsersButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.searchItem(userData.user2.firstName);
    await Utils.waitForSpinnerToDisappear();
    count = await addEntity.rowCount();
    expect(count).toEqual(0);
    expect(await addEntity.getTotalCount()).toEqual('0 total (viewing 0)');
})

//
When("50k UserSupport: should verify scheduling options is disabled for older plans",{ timeout: 60 * 1000 }, async () => {
    // const onStart = async () => {
    //     await protractorConfig.testUtils.login(adminDetails.emailAddress, protractorConfig.testUtils.validPassword, protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
    //   await Utils.enablingFeatureToggle(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, adminDetails.orgName, globalToken);
    //   await protractorConfig.testUtils.maximizeBrowserWindow();
    // };
    //
    let newONPrepre = new OnPrepare(userDetails);
    await newONPrepre.OnStart();
      let response   = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
   await FeatureToggleUtils.removeFeatureToggle(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, adminDetails.orgName, globalToken);
    // await protractorConfig.testUtils.navigateTo(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
    await coachingPlan.openSavedPlan(planName);
    await Utils.waitForLoadingToDisappear();
    expect(coachingPlanDetailsPage.getDisabledSchedulingOption()).toBeTruthy();
})
Then("50k UserSupport: should enable scheduling options",{ timeout: 60 * 1000 }, async () => {
    // await protractorConfig.testUtils.navigateTo(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
    await coachingPlan.clickNewCoachingPlanButton();
    // await protractorConfig.testUtils.waitUntilVisible(coachingPlanDetailsPage.getAddUsersButton());
    await Utils.waitForSpinnerToDisappear();
    expect(coachingPlanDetailsPage.getDisabledSchedulingOption().isDisplayed()).toBeTruthy();

    await coachingPlanDetailsPage.setCoachingPlanName(planNameWithSchedulingOptions);
    await coachingPlanDetailsPage.selectCoachingPackage(coachingPackageName);
    await coachingPlanDetailsPage.setPlanStartDate(dates.futureDate.format(dateFormat.shortDateFormat));
    await coachingPlanDetailsPage.clickAddUsersButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.selectAllRowsCheckboxes();
    await addEntity.clickMoveButton();
    await Utils.waitForSpinnerToDisappear();
    await addEntity.saveBtn();
    await Utils.waitForSpinnerToDisappear();
    expect(coachingPlanDetailsPage.getEnabledSchedulingOption().isDisplayed()).toBeTruthy();
})
Then("50k UserSupport: should validate modal",{ timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickSchedulingOptions();
    expect(schedulingOptions.getRequiredErrorMsg()).toBeTruthy();

    await schedulingOptions.selectActivity('Meeting');
    await schedulingOptions.clearSimultaneousBookings();
    expect(schedulingOptions.getRequiredErrorMsg()).toBeTruthy();

    await schedulingOptions.enterSimultaneousBooking(899);
    expect(schedulingOptions.getSimultaneousBookingValidationErrorMsg()).toBeTruthy();

    await schedulingOptions.clearSimultaneousBookings();
    await schedulingOptions.enterSimultaneousBooking(6);
    await schedulingOptions.clickSaveButton();
    await Utils.waitForSpinnerToDisappear();
})