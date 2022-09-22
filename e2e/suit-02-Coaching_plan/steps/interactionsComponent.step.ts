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
//po'
import { CoachingPlansPO } from "../../../e2e/pageObjects/CoachingPlansPO";
import { CoachingPackagesPO } from "../../../e2e/pageObjects/CoachingPackagePO";
import { CoachingPlanDetailsPO } from "../../../e2e/pageObjects/CoachingPlanDetailsPO";
import { AddEntityPO } from "../../../e2e/pageObjects/AddEntityPO";
import { ScheduleManagerPO } from "../../../e2e/pageObjects/schedule-manager.po";
import { FormAreaComponentPo } from "../../../e2e/pageObjects/FormAreaComponentPO";
import { FormExecutorPO} from "../../../e2e/pageObjects/form-executor.po";

let browser: any;
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
let formAreaComponent = new FormAreaComponentPo(page);
let utils = new Utils(page);

let dateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';

let testDataUsed = {
    adminId: '',
    globalPassword: protractor.testUtils.validPassword,
    teamName: 'DefaultTeam',
    teamUUID: '',
    token: ''
};
let userDetails;

const elementTypes = protractor.formsMockService.getQuestionElementTypes();
let userDetailsToPushInteractions;

const removeFeatureToggle = async (toggleName, tenantName, token) => {
    console.log('Removing ', tenantName, ' from feature ', toggleName);
    await protractor.featureToggleTestUtils.removeTenantFromFeature(toggleName, tenantName, token);
};

const enableFeatureToggle = async (toggleName, tenantName, token) => {
    console.log('Adding ', tenantName, ' to feature ', toggleName);
    await protractor.featureToggleTestUtils.turnOnFeatureToggleForTenant(toggleName, tenantName, token);
};

BeforeAll({timeout: 400 * 1000}, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    userDetails = protractor.globalTenantUtils.getDefaultTenantCredentials();
            let token = await protractor.testUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
            testDataUsed.token = token;
            await enableFeatureToggle('mcr-search-contact-view-CXREC-7357', userDetails.orgName, testDataUsed.token);
            await enableFeatureToggle('utility-QM-angular8UpgradeSpring22-CXQM-16664', userDetails.orgName, testDataUsed.token);
            await protractor.testUtils.maximizeBrowserWindow();
            userDetailsToPushInteractions = userDetails;
            await protractor.testUtils.waitForPage(protractor.fdUtils.getPageIdentifierUrls('admin.employees'));
            await coachingPackage.navigateToCoachingDesigner();
            await browser.waitForAngular();
})

AfterAll({timeout: 400 * 1000}, async () => {
    removeFeatureToggle('mcr-search-contact-view-CXREC-7357', userDetails.orgName, testDataUsed.token);
    await protractor.testUtils.logout(true, 40000, userDetails.orgName, testDataUsed.token);
})
let firstInteractionElement = new InteractionsElementPO(0);
let secondInteractionElement = new InteractionsElementPO(1);

Given("1.1 should add multiple interactions from search to element",{ timeout: 60 * 1000 }, async () => {
    const onStart = async () => {
        userDetails = protractor.globalTenantUtils.getDefaultTenantCredentials();
        await getAdminUserId(userDetails.adminCreds.email, testDataUsed.token);
        await getDefaultTeamID(testDataUsed.token);
        let injectContact = false;
        if (protractor.AUTH_APP_URL.includes('dev')) {
            injectContact = true;
        }
        await pushInteractionData(
            userDetails.id,
            moment().startOf('day').format(dateTimeFormat),
            moment().add(1, 'day').startOf('day').format(dateTimeFormat),
            64, testDataUsed.token, injectContact);
        await browser.sleep(60000);
    };
    //
    userDetails = protractor.globalTenantUtils.getDefaultTenantCredentials();
    await formAreaComponent.dragElementToFormArea(elementTypes.interactionsFormType);
    await formAreaComponent.setLabel('Set Title','Interactions1',elementTypes.interactionsFormType);
    await formAreaComponent.froalaSetBold('Set Title',elementTypes.interactionsFormType);
    await addInteractionsToElement(firstInteractionElement, 'E2E Test 1');
    let res = await firstInteractionElement.getInteractionsCount();
    expect(res).toEqual(10);
})
When("1.2 should add more interactions to the same element",{ timeout: 60 * 1000 }, async () => {
    await addInteractionsToElement(firstInteractionElement, 'E2E Test 2');
    let res = await firstInteractionElement.getInteractionsCount();
    expect(res).toEqual(20);
})
Then("1.3 should not add duplicate interactions to the same element",{ timeout: 60 * 1000 }, async () => {
    await addInteractionsToElement(firstInteractionElement, 'E2E Test 2');
    let res = await firstInteractionElement.getInteractionsCount();
    expect(res).toEqual(20);
})
Then("1.4 should remove interactions from element",{ timeout: 60 * 1000 }, async () => {
    await firstInteractionElement.removeInteractionFromElement(0);
    let res = await firstInteractionElement.getInteractionsCount();
    expect(res).toEqual(19);
})
Then("1.5 should allow to add same interaction in different elements",{ timeout: 60 * 1000 }, async () => {
    let allPromises = [];
    await browser.refresh();
    await formAreaComponent.dragElementToFormArea(elementTypes.interactionsFormType);
    await formAreaComponent.setLabel('Set Title','Interactions1',elementTypes.interactionsFormType);
    await formAreaComponent.froalaSetBold('Interactions1',elementTypes.interactionsFormType);
    await formAreaComponent.dragElementToFormArea(elementTypes.interactionsFormType);
    await formAreaComponent.setLabel('Set Title','Interactions2',elementTypes.interactionsFormType);
    await formAreaComponent.froalaSetBold('Interactions1',elementTypes.interactionsFormType);
    await addInteractionsToElement(firstInteractionElement, 'E2E Test 2');
    await addInteractionsToElement(secondInteractionElement, 'E2E Test 2');
    allPromises.push(
        firstInteractionElement.getInteractionsCount(),
        secondInteractionElement.getInteractionsCount()
    );
    let res = await Promise.all(allPromises);
    expect(res[0]).toEqual(10);
    expect(res[1]).toEqual(10);
})
//
const getAdminUserId = async (emailAddress, token) => {
    let userList = await protractor.adminUtilsNoUI.getUsers(token);
    userDetails.id = _.find((userList.users), {emailAddress: emailAddress}).id;
    return await Promise.resolve(userDetails.id);
};

const addInteractionsToElement = async (elementObj, agentName) => {
    const formExecutor = new FormExecutorPO();
    const searchPo = new SearchPo();
    await elementObj.clickAddInteractionsBtn();
    await formExecutor.switchToPopupWithoutPlayer();
    await protractor.testUtils.waitForPage('/search/');
    await searchPo.searchByAgentName(agentName);
    await elementObj.clickSelectFirstBtn();
    await elementObj.clickAddBtn();
    await formExecutor.returnBacktoParent();
};

const getDefaultTeamID = async (token) => {
    let response = await protractor.adminUtilsNoUI.getAllTeams(token);
    testDataUsed.teamUUID = _.find(response.teams, {name: testDataUsed.teamName}).id;
    return await Promise.resolve(testDataUsed.teamUUID);
};

const pushInteractionData = async (agentList, minDateTime, maxDateTime, noOfSegmentsToPush, token, injectContact) => {
    let segmentDetails = {};
    let allPromises = [];
    for (let ii = 1; ii <= noOfSegmentsToPush; ii++) {
        segmentDetails = {
            minDateTime: minDateTime,
            maxDateTime: maxDateTime,
            agentIds: agentList,
            mediaTypes: 'VOICE',
            directionTypes: 'IN_BOUND',
            agentNames: 'E2E Test ' + ii,
            teamIds: testDataUsed.teamUUID,
            teamNames: testDataUsed.teamName
        };
        if (injectContact && ii % 2 === 0 ) {
            segmentDetails['acdContactId'] = uuid();
        }
        allPromises.push(protractor.qmUtils.pushComplexInteractions(segmentDetails, 4, token));
    }
    return await Promise.all(allPromises);
};