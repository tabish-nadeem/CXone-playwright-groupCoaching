import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { GlobalTenantUtils } from "../../common/globalTenantUtils";
import { AccountUtils } from "../../common/AccountUtils";
import { CommonNoUIUtils } from "../../common/CommonNoUIUtils";
import { CommonQMNoUIUtils } from "../../common/CommonQMNoUIUtils";
import * as moment from 'moment';
import { LoginPage } from "../../common/login";
import {UserDefaultPermissions} from "../../common/userDefaultPermissions";
import { Utils } from "../../common/utils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { FeatureToggleUtils } from "../../common/FeatureToggleUtils";
import { FEATURE_TOGGLES } from "../../common/CONSTANTS";
import { LocalizationNoUI } from "../../common/LocalizationNoUI";
import { fdUtils } from "../../common/FdUtils";
import { MyCoachingsPo } from "../../pageObjects/myCoachingPage.po";
import { CoachingPlansPO } from "../../pageObjects/coaching-plans.po";
import { CoachingPackagesPO } from "../../pageObjects/coaching-package.po";
import { CoachingPlanDetailsPO } from "../../pageObjects/coaching-plan-details.po";
import { AddEntityPO } from "../../pageObjects/add-entity.po";


let myCoachingsPage : MyCoachingsPo;
let coachingPlan:CoachingPlansPO;
let coachingPackage:CoachingPackagesPO;
let coachingPlanDetailsPage:CoachingPlanDetailsPO;
let addUsersModal:AddEntityPO;
let notificationMenu;
let browser: any;
let context: BrowserContext;
let page:Page;
let globalTenantUtils:GlobalTenantUtils;
let globalDetails;
const localeString = 'en-US';
let agentIds:any = [];
let tenantName;
let userToken;
let dateFormat;
let loginPage:LoginPage;
let userDefaultPermissions:UserDefaultPermissions;
let utils:Utils;
let testDataUsed:any;


let userDetails = {
    orgName: globalDetails.orgName,
    adminCreds: globalDetails.adminCreds,
    employee1Creds: {
        firstName: 'Employee 10',
        lastName: 'User',
        email: 'ptor.' + AccountUtils.getRandomEmail(0),
        password: 'Password1',
        role: ''
    },
    employee2Creds: {
        firstName: 'Employee 20',
        lastName: 'User',
        email: 'ptor.' + AccountUtils.getRandomEmail(0),
        password: 'Password1',
        role: ''
    },
    evaluatorUser3: {
        firstName: 'Evaluator 10',
        lastName: 'User',
        email: 'ptor.' + AccountUtils.getRandomEmail(0),
        password: 'Password1',
        role: ''
    },
    managerCreds: {
        firstName: 'Manager 10',
        lastName: 'User',
        role: '',
        email: 'ptor.' + AccountUtils.getRandomEmail(0),
        password: 'Password1'
    }
};

 testDataUsed = {
    agentUser1: {},
    agentUser2: {},
    evaluatorUser3: {},
    managerUser: {},
    adminUser: {},
    formData: {},
    packageUUID: {},
    coachingPlan: {},
    coachingPackageName: 'E2EPackage1',
    coachingPlanName: 'E2EPlan1',
    scheduledPlanName: 'E2EScheduledPlan1',
    sendReminderBtn: 'Send Reminder',
    tenantId: ''
};

const createCoachingPackageAndPlan = async () => {
    testDataUsed.formData = '{"formTitle":"","elements":[{"id":4564878439680,"type":"attachment","elementData":{"attributes":{"isScorable":false,"question":"Attachment","fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"logic":false}},"$$hashKey":"object:464"},{"id":15216261482810,"type":"hyperlink","elementData":{"attributes":{"isScorable":false,"question":"Read this","url":"https://www.wikipedia.org","fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#007cbe","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0}},"$$hashKey":"object:583"},{"id":6086504543432,"type":"interactions","elementData":{"attributes":{"isScorable":false,"question":"Interactions1","showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"interactions":[{"segmentId":"6920b730-bd4d-4e5e-bb7b-075983047285","agentNames":"E2E Test 16","startTime":1521594296000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"07:00 min","$$hashKey":"object:352"},{"segmentId":"7f941b60-3af2-4c01-8950-9bf37fbd922c","agentNames":"E2E Test 10","startTime":1521594296000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"07:00 min","$$hashKey":"object:353"},{"segmentId":"d8705dd0-8295-411b-8b61-818b9141edf2","agentNames":"E2E Test 15","startTime":1521594296000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"07:00 min","$$hashKey":"object:354"},{"segmentId":"a8d75911-1ad8-4865-8a39-3ed9b2e3b18c","agentNames":"E2E Test 13","startTime":1521594259000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:355"},{"segmentId":"882e6cbc-64ca-4721-a539-8bfcea8dc930","agentNames":"E2E Test 12","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:356"},{"segmentId":"287bc571-a00a-419d-880d-8efaf4eca4a2","agentNames":"E2E Test 11","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:357"},{"segmentId":"2ec0094a-201b-483d-a10f-fe9f53ac2279","agentNames":"E2E Test 1","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:358"},{"segmentId":"76d2d858-b0e4-4eb9-81f8-9662f97e2298","agentNames":"E2E Test 14","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:359"}]}},"$$hashKey":"object:305"}],"theme":{"themeId":"","themeName":"","isDefault":true,"themeLogo":"","themeData":{"imgWidth":243,"imgHeight":30,"isAspectRatioChecked":true,"logoAspectRatio":8.1,"bgColor":"#ffffff","numberingEnabled":true,"title":{"text":"","font":"OpenSans","fontSize":18,"fontStyling":{"fontColor":"#2e2e2e","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}},"subTitle":{"text":"","font":"OpenSans","fontSize":14,"fontStyling":{"fontColor":"#707070","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}}}},"ranking":{},"themeId":"","elementCount":3,"rules":{},"rulesAssociation":{},"headerFields":[],"objectives":["Compliance Awareness"],"tags":[],"duration":{"durationValue":"1:15","showDurationErrorMsg":false},"formMaxScore":0,"currentScore":0,"percentage":null}';
    await coachingPackage.navigateToCoachingPackageManager();
    let response = await CommonQMNoUIUtils.createCoachingPackage(testDataUsed.formData,userToken);
    testDataUsed.packageUUID = response;
    await coachingPackage.verifyPackageIsDisplayed(testDataUsed.coachingPackageName);
    testDataUsed.coachingPlan = {
        planName: testDataUsed.coachingPlanName,
        coachingPackageUUID: testDataUsed.packageUUID,
        status: 'SCHEDULED',
        startDate: moment(),
        endDate: moment().endOf('day').add(6, 'day'),
        assignees: [
            testDataUsed.agentUser1['id'],
            testDataUsed.evaluatorUser3['id'],
            testDataUsed.adminUser['id']
        ]
    };
    await coachingPlan.navigateToCoachingPlanPage();
    await CommonQMNoUIUtils.createCoachingPlan(testDataUsed.coachingPlan,userToken);
    await loginPage.logout();
};

const createUsers = async () => {
    let res = await CommonNoUIUtils.createNewRoleByPermissions('customEmployee', 'Custom Employee 1',await userDefaultPermissions.getUserDefaultApplications('employee'),userToken);
    userDetails.employee1Creds.role = res.roleName;
    await AccountUtils.createAndActivateUser(userDetails.employee1Creds.email, userDetails.employee1Creds['password'], userDetails.employee1Creds, userDetails.adminCreds.email,tenantName,userToken);
    console.log('Employee One is activated');

    userDetails.employee2Creds.role = res.roleName;
    await AccountUtils.createAndActivateUser(userDetails.employee2Creds.email, userDetails.employee2Creds['password'], userDetails.employee2Creds, userDetails.adminCreds.email,tenantName,userToken);
    console.log('Employee Two is activated');

    res = await CommonNoUIUtils.createNewRoleByPermissions('customEvaluator', 'Custom Evaluator 1', await userDefaultPermissions.getUserDefaultApplications('evaluator'),userToken);
    userDetails.evaluatorUser3.role = res.roleName;
    await AccountUtils.createAndActivateUser(userDetails.evaluatorUser3.email, userDetails.evaluatorUser3['password'], userDetails.evaluatorUser3, userDetails.adminCreds.email,tenantName,userToken);

    console.log('Evaluator User is activated');
    res = await CommonNoUIUtils.createNewRoleByPermissions('customManager', 'Custom Manager 1',await userDefaultPermissions.getUserDefaultApplications('manager'),userToken);
    userDetails.managerCreds.role = res.roleName;
    await AccountUtils.createAndActivateUser(userDetails.managerCreds.email, userDetails.managerCreds['password'], userDetails.managerCreds, userDetails.adminCreds.email,tenantName,userToken);

};

const submitCoaching = async (email, password, coachingPlanName, actionBtn, statusToVerify) => {
    // await protractorConfig.testUtils.login(email, password, fdUtils.getPageIdentifierUrls('coaching.myCoaching'));
    await loginPage.login(email, password);
    await myCoachingsPage.navigateToMyCoachingsPage();
    
    
    await CommonUIUtils.waitUntillIconLoaderDone(fdUtils.getPageIdentifierUrls('coaching.myCoaching'));
    
    await utils.delay(5000)
    
    //await protractorConfig.axeAccessibilityUtils.runAxeScanForPage_async(browser.driver); // Enable next sprint Accessibility tests
    await myCoachingsPage.openCoachingSession(coachingPlanName);
    // await coachingPackage.verifyEndToEndCoachingPackage(coachingPlanName); // TODO: QM-9706
    
    await CommonUIUtils.waitUntillIconLoaderDone();
    await myCoachingsPage.clickSubmitButton();

    await utils.delay(10000);
    let rowEle = await myCoachingsPage.getRowElements('coachingPlanName', coachingPlanName);
    expect(rowEle.status).toEqual(statusToVerify);
    await loginPage.logout();
};

const waitForPage = async (pageName) => {     
    await CommonUIUtils.waitUntillIconLoaderDone(fdUtils.getPageIdentifierUrls(pageName));
};


const getUserDetails = async () => {
    let users = await CommonNoUIUtils.getUsers(userToken);
    users.forEach((item:any) => {
        switch (item['emailAddress']) {
            case userDetails.employee1Creds.email:
                testDataUsed.agentUser1 = item;
                agentIds.push(testDataUsed.agentUser1['id']);
                testDataUsed.agentUser1['password'] = userDetails.employee1Creds['password'];
                break;
            case userDetails.employee2Creds.email:
                testDataUsed.agentUser2 = item;
                agentIds.push(testDataUsed.agentUser2['id']);
                testDataUsed.agentUser2['password'] = userDetails.employee2Creds['password'];
                break;
            case userDetails.evaluatorUser3.email:
                testDataUsed.evaluatorUser3 = item;
                testDataUsed.evaluatorUser3['password'] = userDetails.evaluatorUser3['password'];
                break;
            case userDetails.managerCreds.email:
                testDataUsed.managerUser = item;
                testDataUsed.managerUser['password'] = userDetails.managerCreds['password'];
                break;
            case userDetails.adminCreds.email:
                testDataUsed.adminUser = item;
                testDataUsed.adminUser['password'] = userDetails.adminCreds['password'];
                break;
        }
    });
};

BeforeAll({ timeout: 400 * 1000}, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    utils = new Utils(page);
    myCoachingsPage = new MyCoachingsPo(page);
    coachingPlan = new CoachingPlansPO(page);
    coachingPackage = new CoachingPackagesPO();
    coachingPlanDetailsPage = new CoachingPlanDetailsPO(page);
    addUsersModal = new AddEntityPO(element(page.locators('.cxone-modal-wrapper')));
    notificationMenu = new NotificationMenuPO();

    globalDetails = globalTenantUtils.getDefaultTenantCredentials();
    userToken = await loginPage.login(globalDetails.adminCreds.email, globalDetails.adminCreds['password']);

    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_FALL21, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING22, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, userDetails.orgName, userToken);
    tenantName = userDetails.orgName;
    await CommonUIUtils.waitUntillIconLoaderDone(fdUtils.getPageIdentifierUrls('admin.employees'));
    await createUsers();
    await getUserDetails();
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    console.log('DateTime formats to use', dateFormat);

    await createCoachingPackageAndPlan();
});

AfterAll({ timeout: 400 * 1000}, async () =>{
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_FALL21, userDetails.orgName, userToken);
    await loginPage.logout();
})


Given("STEP-1: Should verify that the agent submit the coaching",{ timeout: 60 * 1000 }, async () => {
        await submitCoaching(testDataUsed.agentUser1['emailAddress'], testDataUsed.agentUser1['password'], testDataUsed.coachingPlanName, 'Submit', 'Completed');
});

When("STEP-2: Should verify that the evaluator submit the coaching", { timeout: 60 * 1000 }, async () => {
        await submitCoaching(testDataUsed.evaluatorUser3['emailAddress'], testDataUsed.evaluatorUser3['password'], testDataUsed.coachingPlanName, 'Submit', 'Completed');
});


When("STEP-3: Should not display Send Reminder button if new future dated coaching plan is created", { timeout: 60 * 1000 }, async () => {
        await loginPage.login(testDataUsed.adminUser['emailAddress'], testDataUsed.adminUser['password']);
        await coachingPlan.navigateToCoachingPlanPage();
        await CommonUIUtils.waitUntillIconLoaderDone(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        await coachingPlanDetailsPage.navigateToCoachingPlanDetails();
        await coachingPlanDetailsPage.setCoachingPlanName(testDataUsed.scheduledPlanName);
        await coachingPlanDetailsPage.setPlanEndDate(moment().add(2, 'day').format(dateFormat.shortDateFormat));
        await coachingPlanDetailsPage.setCoachingPlanName(testDataUsed.coachingPackageName);
        // await protractorConfig.fdUtils.waitForLoadingToDisappear();
        await CommonUIUtils.waitForLoadingToDisappear(page);
        await coachingPlanDetailsPage.clickAddUsersButton();
        await CommonUIUtils.waitForLoadingToDisappea();
        await addUsersModal.selectAll();
        await CommonUIUtils.waitForLoadingToDisappea();
        await addUsersModal.saveBtn();
        await CommonUIUtils.waitForLoadingToDisappea();
        await coachingPlanDetailsPage.waitForSubmitButtonToBeClickable();
        let text = await coachingPlanDetailsPage.getAddEmployeeButton().getText();
        expect(text).toContain('Add Employees');
        await coachingPlanDetailsPage.clickSubmitButton();
        await CommonUIUtils.waitForLoadingToDisappea();
        // await protractorConfig.testUtils.waitForPage(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
        let planRowElements = await coachingPlan.getRowElementsByPlanName(testDataUsed.scheduledPlanName);
        expect(planRowElements.status).toBe('Scheduled');
        await coachingPlan.searchPlanAndOpen(testDataUsed.scheduledPlanName);
        await page.waitForSelector(coachingPlanDetailsPage.getAddEmployeeButton())
        text = await coachingPlanDetailsPage.getAddEmployeeButton().getText();
        expect(text).toContain('Add Employees');
    

});

Then("STEP-4: Should display Send Reminder button for an Activated plan", { timeout: 60 * 1000 }, async () => {
    await coachingPlan.navigateToCoachingPlanPage();
    await CommonUIUtils.waitForLoadingToDisappear(page);
    let row = await coachingPlan.getRowElementsByPlanName(testDataUsed.coachingPlanName);
    expect(row.responses).toEqual('2');
    await coachingPlan.searchPlanAndOpen(testDataUsed.coachingPlanName);
    await CommonUIUtils.waitForLoadingToDisappear(page);
    await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
    await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.adminUser['firstName'], true);
    let res = await coachingPlanDetailsPage.getSendReminderButton().isPresent();
    expect(res).toBeTruthy();
    let text = await coachingPlanDetailsPage.getSendReminderButton().getText();
    expect(text).toContain(testDataUsed.sendReminderBtn);
    let count = await coachingPlanDetailsPage.getItemCount();
    expect(count).toEqual('3 Total');
});

Then("STEP-5: Should display Send Reminder button tool-tip", { timeout: 60 * 1000 }, async () => {
    await browser.actions().mouseMove(await coachingPlanDetailsPage.getSendReminderButton()).perform();
    await page.waitForSelector(await coachingPlanDetailsPage.getToolTipAtSendReminderBtn());
    let text = await coachingPlanDetailsPage.getToolTipAtSendReminderBtn().getText();
    expect(text).toEqual(fdUtils.getExpectedString('coachingPlanDetails.sendReminderToolTipText'));
});


Then("STEP-6: Should verify notification if send reminder button is clicked", { timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickSendReminderButton();
    let msg = await utils.getToastMessage();
    expect(msg).toEqual(fdUtils.getExpectedString('coachingPlanDetails.succeedToNotifyPlan'));
    await page.waitForSelector(await notificationMenu.getBadgeElement());
    expect(await notificationMenu.isBadgeDisplayed()).toBeTruthy();
    await page.locator('.badge').click();
    await page.waitForSelector(page.locator('.notification-popover-wrapper'), 10000);
    expect(await page.locator('.notification-item-container').getAttribute('class')).toContain('unread');
});

Then("STEP-7: Should verify that send reminder button is disabled & will be enabled after refresh", { timeout: 60 * 1000 }, async () => {
    let isEnabled = await fdUtils.isElementEnabled(coachingPlanDetailsPage.getSendReminderButton(),'');
    expect(isEnabled).toBeFalsy();
    await browser.refresh();
    await browser.sleep(5000);
    await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlanDetails'));
    await CommonUIUtils.waitForLoadingToDisappear(page);
    isEnabled = await fdUtils.isElementEnabled(coachingPlanDetailsPage.getSendReminderButton(),'');
    expect(isEnabled).toBeTruthy();
});

Then("STEP-8: Should verify completion status", { timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickFilterButton();
    await coachingPlanDetailsPage.selectStatus(['Completed']);
    await coachingPlanDetailsPage.clickFilterButton();
    let data = await coachingPlanDetailsPage.getItemCount();
    expect(data).toEqual('3 Total');
    let text = await coachingPlanDetailsPage.getStatusTag('Completed').getText();
    expect(text).toEqual('Completed');
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.agentUser1['firstName']);
    let agentData = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.agentUser1['firstName'], true);
    expect(agentData.employeeName).toEqual(testDataUsed.agentUser1['fullName']);
    expect(agentData.team).toEqual('DefaultTeam');
    // expect(agentData.role).toEqual('customEmployee');
    expect(agentData.coachingCompleted).toEqual('Yes');
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.evaluatorUser3['firstName']);
    let evaluatorData = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.evaluatorUser3['firstName'], true);
    expect(evaluatorData.employeeName).toEqual(testDataUsed.evaluatorUser3['fullName']);
    expect(evaluatorData.team).toEqual('DefaultTeam');
    // expect(evaluatorData.role).toEqual('customEvaluator');
    expect(evaluatorData.coachingCompleted).toEqual('Yes');
});

Then("STEP-9: Should verify not completion status", { timeout: 60 * 1000 }, async () => {
    await coachingPlanDetailsPage.clickFilterButton();
    await coachingPlanDetailsPage.selectStatus(['Not Completed']);
    await coachingPlanDetailsPage.clickFilterButton();
    let data = await coachingPlanDetailsPage.getItemCount();
    expect(data).toEqual('3 Total');
    let text = await coachingPlanDetailsPage.getStatusTag('Not Completed').getText();
    expect(text).toEqual('Not Completed');
    await CommonUIUtils.waitForLoadingToDisappear(page);
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.adminUser['firstName']);
    await CommonUIUtils.waitForLoadingToDisappear(page);
    let adminUser = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.adminUser['firstName'], true);
    expect(adminUser.employeeName).toEqual(testDataUsed.adminUser['fullName']);
    expect(adminUser.coachingCompleted).toEqual('No');
    await coachingPlanDetailsPage.resetFilterOptions();
});

Then("STEP-10: Should verify status of all completed coachings", { timeout: 60 * 1000 }, async () => {
    await myCoachingsPage.navigateToMyCoachingsPage();
    await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.myCoaching'));
    await myCoachingsPage.openCoachingSession(testDataUsed.coachingPlanName);
    await myCoachingsPage.clickSubmitButton();
    await waitForPage('coaching.myCoaching');
    await myCoachingsPage.waitForStatusToUpdate(testDataUsed.coachingPlanName, 'Completed');
    await coachingPlan.navigateToCoachingPlanPage();
    await CommonUIUtils.waitForLoadingToDisappear(page);
    await coachingPlan.searchPlan(testDataUsed.coachingPlanName);
    await CommonUIUtils.waitForLoadingToDisappear(page);
    await coachingPlanDetailsPage.clickFilterButton();
    await coachingPlanDetailsPage.selectStatus(['Completed']);
    await coachingPlanDetailsPage.clickFilterButton();
    await CommonUIUtils.waitForLoadingToDisappear(page);
    await page.waitForSelector(await coachingPlanDetailsPage.getStatusTag('Completed'));
    let data = await coachingPlanDetailsPage.getItemCount();
    expect(data).toContain('3 Total');
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.agentUser1['firstName']);
    let agentData = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.agentUser1['firstName'], true);
    expect(agentData.employeeName).toEqual(testDataUsed.agentUser1['fullName']);
    expect(agentData.coachingCompleted).toEqual('Yes');
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.adminUser['firstName']);
    let adminData = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.adminUser['firstName'], true);
    expect(adminData.employeeName).toEqual(testDataUsed.adminUser['fullName']);
    expect(adminData.coachingCompleted).toEqual('Yes');
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.evaluatorUser3['firstName']);
    let evaluatorData = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.evaluatorUser3['firstName'], true);
    expect(evaluatorData.employeeName).toEqual(testDataUsed.evaluatorUser3['fullName']);
    expect(evaluatorData.coachingCompleted).toEqual('Yes');
    let result = await coachingPlanDetailsPage.getSendReminderButton().isPresent();
    expect(result).toBeTruthy();
    await coachingPlan.navigateToCoachingPlanPage();
    let row = await coachingPlan.getRowElementsByPlanName(testDataUsed.coachingPlanName);
    expect(row.responses).toEqual('3');
    await loginPage.logout();
});

Then("STEP-11: Should verify that agents who has completed coaching earlier Should not receive new notification", { timeout: 60 * 1000 }, async () => {
    await CommonNoUIUtils.login(testDataUsed.agentUser1['emailAddress'], testDataUsed.agentUser1['password'],true);
    await myCoachingsPage.navigateToMyCoachingsPage();
    await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.myCoaching'));
    await page.waitForSelector(await notificationMenu.getBadgeElement());
    let count = await notificationMenu.getAmountOfUnreadNotifications();
    expect(count).toEqual(1);
    await loginPage.logout();
    await CommonNoUIUtils.login(testDataUsed.evaluatorUser3['emailAddress'], testDataUsed.evaluatorUser3['password'],true);
    await myCoachingsPage.navigateToMyCoachingsPage();
    await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.myCoaching'));
    await page.waitForSelector(await notificationMenu.getBadgeElement());
    count = await notificationMenu.getAmountOfUnreadNotifications();
    expect(count).toEqual(1);
});


Then("STEP-12: Should check the title and the content of the last arrived notification and mark as read", { timeout: 60 * 1000 }, async () => {
    await page.locator('.badge').click();
    await page.waitForSelector(page.locator('.notification-popover-wrapper'), 10000);
    expect(await page.locator('.notification-item-container').getAttribute('class')).toContain('unread');
    expect(await page.locator('.notificationItemTitle').first().getText()).toEqual('New coaching package available');
    expect(await page.locator('.notificationItemDescription').first().getText()).toEqual('Your action is required');
    await page.locator('.notification-item-container').click();
    await utils.waitForSpinnerToDisappear();
    let url = await browser.driver.getCurrentUrl();
    expect(url).toContain('/myCoachings');
    await loginPage.logout();
});


Then("STEP-13: Should search 1 user who has completed coaching", { timeout: 60 * 1000 }, async () => {
    await CommonNoUIUtils.login(testDataUsed.adminUser['emailAddress'], testDataUsed.adminUser['password'],true);
    await coachingPlan.navigateToCoachingPlanPage();
    await page.waitForSelector(fdUtils.getPageIdentifierUrls('coaching.coachingPlans'));
    await coachingPlan.openSavedPlan(testDataUsed.coachingPlanName);
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.agentUser1['firstName']);
    let agentData = await coachingPlanDetailsPage.getRowDataByAgentName(testDataUsed.agentUser1['firstName'], true);
    expect(agentData.employeeName).toEqual(testDataUsed.agentUser1['fullName']);
    expect(agentData.team).toEqual('DefaultTeam');
    expect(agentData.coachingCompleted).toEqual('Yes');
    await coachingPlanDetailsPage.searchAssignedUsers(testDataUsed.agentUser1['firstName']);
    let data = await coachingPlanDetailsPage.getItemCount();
    expect(data).toEqual('3 Total');
});
