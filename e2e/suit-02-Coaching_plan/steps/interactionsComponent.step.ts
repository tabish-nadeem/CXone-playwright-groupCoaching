import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import * as _ from 'lodash';
import * as moment from 'moment';
import { uuid } from "uuid4";
import { CommonNoUIUtils } from "../../../e2e/common/CommonNoUIUtils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { DisableProtUtils } from "../../common/disableProtUtil"
import { LoginPage } from "../../../e2e/common/login";
import { LocalizationNoUI } from "../../../e2e/common/LocalizationNoUI";
import { FeatureToggleUtils } from "../../../e2e/common/FeatureToggleUtils";
import { fdUtils } from "../../../e2e/common/FdUtils";
import { AdminUtilsNoUI } from "../../../e2e/common/AdminUtilsNoUI";
import { CommonQMNoUIUtils } from "../../../e2e/common/CommonQMNoUIUtils";
import { GlobalTenantUtils } from "../../../e2e/common/globalTenantUtils";
import { Utils } from "../../common/utils";
import { Credentials } from "../../common/support";
//po'
import { CoachingPackagesPO } from "../../../e2e/pageObjects/CoachingPackagePO";
import { FormAreaComponentPo } from "../../../e2e/pageObjects/FormAreaComponentPO";
import { FormExecutorPO} from "../../../e2e/pageObjects/form-executor.po";
import { SearchPO} from "../../../e2e/pageObjects/searchPO";
import { InteractionsElementPO } from "../../pageObjects/interactions.component.po"


let browser: any;
let context: BrowserContext;
let page:Page;
let globalTenantUtils:GlobalTenantUtils;
let localeString = 'en-US'; 
let loginPage:LoginPage;
let coachingPackage = new CoachingPackagesPO();
let formAreaComponent = new FormAreaComponentPo(page);
const searchPo = new SearchPO(page);
let utils = new Utils(page);
let disableProtUtils = new DisableProtUtils()
let firstInteractionElement: any = new InteractionsElementPO(0);
let secondInteractionElement: any = new InteractionsElementPO(1);

let dateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';

let testDataUsed: any = {
    adminId: '',
    globalPassword: Credentials.validPassword,
    teamName: 'DefaultTeam',
    teamUUID: '',
    token: ''
};
let userDetails;

const elementTypes = {
    "sectionFormType": `section`,
    "dateTimeFormType": `datetime`,
    "dropdownFormType": `dropdown`,
    "labelFormType": `label`,
    "hyperlinkFormType": `hyperlink`,
    "longTextFormType": `textarea`,
    "shortTextFormType": `text`,
    "checkboxFormType": `checkbox`,
    "radioFormType": `radio`,
    "yesNoFormType": `yesno`,
    "interactionsFormType": `interactions`,
    "attachmentFormType": `attachment`
};
let userDetailsToPushInteractions;

const removeFeatureToggle = async (toggleName, tenantName, token) => {
    console.log('Removing ', tenantName, ' from feature ', toggleName);
    await FeatureToggleUtils.removeTenantFromFeature(toggleName, tenantName, token);
};

const enableFeatureToggle = async (toggleName, tenantName, token) => {
    console.log('Adding ', tenantName, ' to feature ', toggleName);
    await FeatureToggleUtils.turnOnFeatureToggleForTenant(toggleName, tenantName, token);
};

BeforeAll({timeout: 400 * 1000}, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    userDetails = globalTenantUtils.getDefaultTenantCredentials();
    let token = await loginPage.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
    testDataUsed.token = token;
    await enableFeatureToggle('mcr-search-contact-view-CXREC-7357', userDetails.orgName, testDataUsed.token);
    await enableFeatureToggle('utility-QM-angular8UpgradeSpring22-CXQM-16664', userDetails.orgName, testDataUsed.token);
    // await protractor.testUtils.maximizeBrowserWindow();
    userDetailsToPushInteractions = userDetails;
    await page.waitForURL('/admin/#/userManagement');
    await coachingPackage.navigateToCoachingDesigner();
    await browser.waitForAngular();
})

AfterAll({timeout: 400 * 1000}, async () => {
    removeFeatureToggle('mcr-search-contact-view-CXREC-7357', userDetails.orgName, testDataUsed.token);
    await loginPage.logout();
})

Given("1.1 should add multiple interactions from search to element",{ timeout: 60 * 1000 }, async () => {
    const onStart = async () => {
        userDetails = globalTenantUtils.getDefaultTenantCredentials();
        await getAdminUserId(userDetails.adminCreds.email, testDataUsed.token);
        await getDefaultTeamID(testDataUsed.token);
        let injectContact = false;
        if (disableProtUtils.getEnvName() == 'dev') {
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
    userDetails = globalTenantUtils.getDefaultTenantCredentials();;
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
    let allPromises:any = [];
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
    let userList = await CommonNoUIUtils.getUsers(token);
    userDetails.id = _.find((userList.users), {emailAddress: emailAddress}).id;
    return await Promise.resolve(userDetails.id);
};

const addInteractionsToElement = async (elementObj, agentName) => {
    const formExecutor = new FormExecutorPO();
    await elementObj.clickAddInteractionsBtn();
    await formExecutor.switchToPopupWithoutPlayer();
    await page.waitForURL('/search/');
    await searchPo.searchByAgentName(agentName);
    await elementObj.clickSelectFirstBtn();
    await elementObj.clickAddBtn();
    await formExecutor.returnBacktoParent();
};

const getDefaultTeamID = async (token) => {
    let response = await AdminUtilsNoUI.getAllTeams(token);
    testDataUsed.teamUUID = _.find(response.teams, {name: testDataUsed.teamName}).id;
    return await Promise.resolve(testDataUsed.teamUUID);
};

const pushInteractionData = async (agentList, minDateTime, maxDateTime, noOfSegmentsToPush, token, injectContact) => {
    let segmentDetails:any = {};
    let allPromises: any = [];
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
        allPromises.push(CommonQMNoUIUtils.pushComplexInteractions(segmentDetails, "4", token));
    }
    return await Promise.all(allPromises);
};