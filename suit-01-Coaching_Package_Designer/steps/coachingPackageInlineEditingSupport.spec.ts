import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonNoUIUtils } from "../../e2e/common/CommonNoUIUtils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { LoginPage } from "../../e2e/common/login";
import { LocalizationNoUI } from "../../e2e/common/LocalizationNoUI";
import { FeatureToggleUtils } from "../../e2e/common/FeatureToggleUtils";
import { fdUtils } from "../../e2e/common/FdUtils";
import { AdminUtilsNoUI } from "../../e2e/common/AdminUtilsNoUI";
import { CommonQMNoUIUtils } from "../../e2e/common/CommonQMNoUIUtils";
import { GlobalTenantUtils } from "../../e2e/common/globalTenantUtils";


let browser: any;
let context: BrowserContext;
let page:Page;
let token, 
    userObject,
    dateFormat,
    localeString = 'en-US';
let userDetails:any;
let globalTenantUtils:GlobalTenantUtils;
let coachingPackage;
let formDesigner;
let duration;
let testFormModal;
let objectives;
let formAreaComponent;
let designerToolBarComponent;
let loginPage:LoginPage;


const FEATURE_TOGGLES = {
    angular8_migration_spring22: 'utility-QM-angular8UpgradeSpring22-CXQM-16664',
};

const dateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
const pkgNameAtTestPackageModal = 'Test mode Package 1' + CommonUIUtils.getRandomString();
let formData = '{"formTitle":"","elements":[{"id":4564878439680,"type":"attachment","elementData":{"attributes":{"isScorable":false,"question":"Attachment","fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"logic":false}},"$$hashKey":"object:464"},{"id":15216261482810,"type":"hyperlink","elementData":{"attributes":{"isScorable":false,"question":"Read this","url":"https://www.wikipedia.org","fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#007cbe","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0}},"$$hashKey":"object:583"},{"id":6086504543432,"type":"interactions","elementData":{"attributes":{"isScorable":false,"question":"Interactions1","showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"interactions":[{"segmentId":"6920b730-bd4d-4e5e-bb7b-075983047285","agentNames":"E2E Test 16","startTime":1521594296000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"07:00 min","$$hashKey":"object:352"},{"segmentId":"7f941b60-3af2-4c01-8950-9bf37fbd922c","agentNames":"E2E Test 10","startTime":1521594296000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"07:00 min","$$hashKey":"object:353"},{"segmentId":"d8705dd0-8295-411b-8b61-818b9141edf2","agentNames":"E2E Test 15","startTime":1521594296000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"07:00 min","$$hashKey":"object:354"},{"segmentId":"a8d75911-1ad8-4865-8a39-3ed9b2e3b18c","agentNames":"E2E Test 13","startTime":1521594259000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:355"},{"segmentId":"882e6cbc-64ca-4721-a539-8bfcea8dc930","agentNames":"E2E Test 12","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:356"},{"segmentId":"287bc571-a00a-419d-880d-8efaf4eca4a2","agentNames":"E2E Test 11","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:357"},{"segmentId":"2ec0094a-201b-483d-a10f-fe9f53ac2279","agentNames":"E2E Test 1","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:358"},{"segmentId":"76d2d858-b0e4-4eb9-81f8-9662f97e2298","agentNames":"E2E Test 14","startTime":1521594255000,"channelType":"PHONE_CALL","mediaTypes":["VOICE"],"mediaLocation":"https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_13_6358696741345231332_2_99.mp4","duration":"11:00 min","$$hashKey":"object:359"}]}},"$$hashKey":"object:305"}],"theme":{"themeId":"","themeName":"","isDefault":true,"themeLogo":"","themeData":{"imgWidth":243,"imgHeight":30,"isAspectRatioChecked":true,"logoAspectRatio":8.1,"bgColor":"#ffffff","numberingEnabled":true,"title":{"text":"","font":"OpenSans","fontSize":18,"fontStyling":{"fontColor":"#2e2e2e","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}},"subTitle":{"text":"","font":"OpenSans","fontSize":14,"fontStyling":{"fontColor":"#707070","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}}}},"ranking":{},"themeId":"","elementCount":3,"rules":{},"rulesAssociation":{},"headerFields":[],"objectives":["Compliance Awareness"],"tags":[],"duration":{"durationValue":"1:15","showDurationErrorMsg":false},"formMaxScore":0,"currentScore":0,"percentage":null}';
let testDataUsed = {teamName: 'DefaultTeam', teamUUID: '', adminUser: {}};

const coachingPackages = [
    'coaching_package_1' + CommonUIUtils.getRandomString(),
    'package1' + CommonUIUtils.getRandomString(),
    'package2' + CommonUIUtils.getRandomString(),
    'package3' + CommonUIUtils.getRandomString(),
    'package4' + CommonUIUtils.getRandomString(),
    'Coaching_' + CommonUIUtils.getRandomString()
];

const getDefaultTeamID = async (token:any) => {
    let response = await AdminUtilsNoUI.getAllTeams(token);
    testDataUsed.teamUUID = _.find(response.teams, {name: testDataUsed.teamName}).id;
};

const getAdminUserInfo = async (token) => {
    let users = await CommonNoUIUtils.getUsers(token);
    users.forEach((item) => {
        switch (item.emailAddress) {
            case userDetails.adminCreds.email:
                testDataUsed.adminUser = item;
        }
    });
};

const pushInteractionData = async (agentList:Array<any>, minDateTime:any, maxDateTime:any, noOfSegmentsToPush:string, token:any) => {
    let segmentDetails:any = {};
    let allPromises : any = [];
    for (let ii = 1; ii <= 16; ii++) {
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
        allPromises.push(CommonQMNoUIUtils.pushComplexInteractions(segmentDetails, noOfSegmentsToPush, token));
    }

    await Promise.all(allPromises);
};

let generatePackageData = function (formName:any) {
    return {
        formId: '',
        formStatus: 'Draft',
        formName: formName,
        formData: '{"formTitle":"","elements":[],"theme":{"themeId":"","themeName":"","isDefault":true,"themeLogo":"iVBORw0KGgoAAAANSUhEUgAAAGQAAAAlCAYAAAC05kydAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTY3MTc4QTE5MTM2MTFFNjg1QThCMTMzMEVCRjhDQUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTY3MTc4QTI5MTM2MTFFNjg1QThCMTMzMEVCRjhDQUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjcxNzg5RjkxMzYxMUU2ODVBOEIxMzMwRUJGOENBRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjcxNzhBMDkxMzYxMUU2ODVBOEIxMzMwRUJGOENBRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psv348oAAAUDSURBVHja5Jp7bFRFFMZPl1LBYCsNioRiWrRErS9iBESQmgAxGkKJEP4wyEN81dcmPohREyQRE+Kj2oivgBhCJFilSnwRtIqwQWgkRrSSFWzrGik0gWoNFq34He5ss93evXNmH5172y/5pd2dO3PP3XNn5syZySOiMKVWDNSRty4Dsz3K/wDrk74rAfM17W4Dh0iu8WARmAkuB+eCLnAENIEI+Ah8a9DmRDCDsq8a9bcMLAXF4BNlH5324BQYq2l8iaaNZpc6lZo6TJXw4SpAvaC9ON+BucK2wwbtmsC6GDSCjeBpsBmsCGkMGgoeIv9qsXrj5xrUuVI58H1QZNH2avAMGKd6MjtneUhQ8W7LhqfSA2ADKEiz/jzQAAot2c/3PQpGgFvB26A7JKx4l8+cUZUwDmciniPesPQMPEfeBz4DK9VI1BQSVg5n8CZmWzynrQOhLLW3EMyy8BwfgN3gWjWx89B1p25ST2SpTyb1rTmYZBstTOquMnnLHgF5lnvH9QbRl4muATf6ofubOITXG7dYtvcJ4XUcrn8Ndqr/JbojaA5hPWbR1mLhWM/j8kXgBrWo4znnFUG9OSrMN1WZGjlMyJpDpoPJlhzCa418zTVH1A8bS/iuHdwvcEqhmmAD1UNs9hJJCoND4eMpylYKhq8pQXQIL6jKLdh6neCadzzKuKfsEMyTgXNInoq4+lNngwmaaw6AVs01X2nKS2w7JD/NereDp9TSv4+GFJxFV8x3kshDhhYUj69c0GtV3R7dP6xh9WLPG0wL19485qoZvF6hk8fbimONvV/u7+tqqPtUV+JX3wjs3uo1bBWNm9A5e1Vdj61Hm/ZO7IhFe8o721rp58/7dMJd4F/BveskL3K6DhkGHgRPuna7/AIqn3Vb/OM5lJSgLCop16bVR5ZWTCUnk0vDR45ObO+Mfqhfm+yQqMDuqFfKBc4oxZ8345/Pv3TSGeI6drDRzSFjhb/ZqFwNWXFxtnKEj/Jbv9IAkMQhP6Z6icEyHz3LX4PFIS94lD2cwbCXbXUMFodsVAsuN11ITrY0iFmHwDqEo5Jaj/KZPnmWwsHiENarARijB4RDpOM/pyPWqVBXq+6ukxSpDcdD4GNT7l3Ta8exJbKtTDM30aGGLZsqqqr5tAjF9m2/pHXPx88m38Nl+NSJ0/ePpiqsr556umptZF5PNPPh63NOtDT1BC5df7pmZd4i52SNTnulTpFuppSqBZDpZkyzyz0ryWyDarTg+s2CZ33c0FbJBlWprYmwmfRntHKlNnJyUZ6Le9JvoE3TlB8OWmTynEVbI5pyXjF7ZYTPEwQg0aA5hPeev7Bk607BNas8egnvNuoOauwLYuz+vCVb3xVcM10FC8k7f5zmkRz420E+kOkJCX4DD/TzpB7XLuE9Oa/FScIa1aulR0wpjUk9q6dO8tN0IPeS9RZenhoVuurE+xrLDdveEOR0wybwuwV7+TzuwRy026HWWYF1CKdTXrZg73/gnhy0u1q4uPOtQ1ivWUqnfAleymJ7+8GLQctluekEJeyu9bM47f9eFtr5jZyT5/8MBIfEJ9luC3bzPRdmGIL/RM5hul/IR8rUIS1giyXb2Sl8aGCy4frhb7CGnPO8h8ln4jXFkgzDwTJNyqKT+ubALgA3adrljECrwbPw8dEFgA9HXE3OoYLhqiym1hmfkpOEbBe2yee0JuXgd0/5m/4vwABDve77Fw+5/QAAAABJRU5ErkJggg==","themeData":{"imgWidth":150,"imgHeight":50,"isAspectRatioChecked":true,"logoAspectRatio":3,"bgColor":"#ffffff","numberingEnabled":true,"title":{"text":"Enter title","font":"OpenSans","fontSize":18,"fontStyling":{"fontColor":"#2e2e2e","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}},"subTitle":{"text":"Enter sub title","font":"OpenSans","fontSize":14,"fontStyling":{"fontColor":"#707070","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}}}},"ranking":{"isRankingEnabled":false,"totalCoverage":101,"ranges":[{"from":"0%","to":"50%","coverage":51,"displayText":"Failed"},{"from":"51%","to":"100%","coverage":50,"displayText":"Passed"}]},"themeId":"","elementCount":0,"rules":{},"rulesAssociation":{},"objectivesHeader":{"objectives":[],"duration":"1:15","showDurationErrorMsg":false,"labels":["1"]},"formMaxScore":0,"currentScore":0,"percentage":null}',
        formType: 'COACHING'
    };
};
BeforeAll({timeout: 400 * 1000}, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    coachingPackage = new CoachingPackagesPO();
    formDesigner = new FormDesignerPagePO();
    duration = new DurationComponentPO();
    testFormModal = new TestFormModalComponentPO();
    objectives = new ObjectivesComponentPO();
    formAreaComponent = new FormAreaComponentPO();
    designerToolBarComponent = new DesignerToolbarComponentPO()
    
    userObject = (await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password, true)).user;
    token = await loginPage.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    await CommonUIUtils.waitUntilIconLoaderDone(fdUtils.getPageIdentifierUrls('admin.employees'));
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.angular8_migration_spring22, userDetails.orgName, token);

    userDetails = globalTenantUtils.getDefaultTenantCredentials();

    await getAdminUserInfo(token);
    await getDefaultTeamID(token);
    await pushInteractionData(testDataUsed.adminUser['id'], moment().format(dateTimeFormat), moment().add(1, 'day').format(dateTimeFormat), 1, token);
    await CommonQMNoUIUtils.createCoachingPackage(coachingPackage.generatePackageData(pkgNameAtTestPackageModal, 'Published', formData),token);
    await coachingPackage.navigateToCoachingPackageManager(false);

    let allPromises:any = [];
    allPromises.push(
        CommonQMNoUIUtils.createCoachingPackage(generatePackageData(coachingPackages[1]),token),
        CommonQMNoUIUtils.createCoachingPackage(generatePackageData(coachingPackages[2]),token)
    );
    await Promise.all(allPromises);
});

AfterAll({timeout: 400 * 1000},async () =>{
    await CommonUIUtils.logout(true, 120000, userDetails.orgName, token);

});

Given("Should verify popover message that active coaching packages can not be deleted",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.navigateToCoachingPackageManager(false);
    expect(await coachingPackage.verifyMessageMouseHoverDelOfPublishedPackage(pkgNameAtTestPackageModal))
    .toEqual('Active coaching packages cannot be deleted. Deactivate the package(s) and try again.');
});
When("Should verify deactivating a coaching package",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.clickHamburgerMenu(pkgNameAtTestPackageModal);
    await coachingPackage.clickHamburgerMenuItem('Deactivate');
    await CommonUIUtils.waitUntillIconLoaderDone();
    let packageRowData = await coachingPackage.getFormRowElements(pkgNameAtTestPackageModal);
    expect(packageRowData.status).toEqual('Inactive');
})
Then("Should verify coaching package in test package modal",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.navigateToCoachingPackageManager(false);
    await coachingPackage.openSavedPackage(pkgNameAtTestPackageModal);
    await CommonUIUtils.waitUntillIconLoaderDone();
    await designerToolBarComponent.clickOnTestFormButton();
    expect(await testFormModal.getObjectives()).toEqual(['Compliance Awareness']);
    expect(await testFormModal.getDuration()).toEqual('1h 15m');
    expect((await testFormModal.getInteractionRows()).length).toEqual(8);
    await testFormModal.clickOnValidateButton();
})

When("Should able to bulk activate coaching packages",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.navigateToCoachingPackageManager();
    await coachingPackage.selectParticularPackage(coachingPackages[1]);
    await coachingPackage.selectParticularPackage(coachingPackages[2]);
    await coachingPackage.clickPublishButton();
    await coachingPackage.clickConfirmBtn('publish');
    await CommonUIUtils.waitUntillIconLoaderDone();
    let row = await coachingPackage.getFormRowElements(coachingPackages[1]);
    expect(row.status).toEqual('Active');
    row = await coachingPackage.getFormRowElements(coachingPackages[2]);
    expect(row.status).toEqual('Active');
})
Then("Should able to bulk deactivate coaching packages",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.navigateToCoachingPackageManager();
    await coachingPackage.selectParticularPackage(coachingPackages[1]);
    await coachingPackage.selectParticularPackage(coachingPackages[2]);
    await coachingPackage.clickUnpublishButton();
    await coachingPackage.clickConfirmBtn('unpublish');
    CommonUIUtils.waitUntillIconLoaderDone();
    let row = await coachingPackage.getFormRowElements(coachingPackages[1]);
    expect(row.status).toEqual('Inactive');
    row = await coachingPackage.getFormRowElements(coachingPackages[2]);
    expect(row.status).toEqual('Inactive');
})
Then("Should able to bulk delete coaching packages",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.navigateToCoachingPackageManager();
    await coachingPackage.selectParticularPackage(coachingPackages[1]);
    await coachingPackage.selectParticularPackage(coachingPackages[2]);
    await coachingPackage.clickDeleteButton();
    await coachingPackage.clickConfirmBtn('delete');
    CommonUIUtils.waitUntillIconLoaderDone();
    expect(await coachingPackage.verifyPackagePresence(coachingPackages[1])).toEqual(false);
    expect(await coachingPackage.verifyPackagePresence(coachingPackages[2])).toEqual(false);
})

When("Should verify inline formatting on attachment element",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.navigateToCoachingDesigner();
    await formAreaComponent.dragElementToFormArea('attachment');
    await formAreaComponent.froalaSetBold('Set Title', 'attachment'); // Removing bold
    await formAreaComponent.froalaSetItalic('Set Title', 'attachment');
    await formAreaComponent.froalaSetFontColor('Set Title', 'attachment', '#E25041');
    expect(await formAreaComponent.getElementCssProperties('Set Title', 'attachment')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '13px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
})
Then("Should verify inline formatting on section element",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.refreshPage();
    await formAreaComponent.dragElementToFormArea('section');
    await formAreaComponent.froalaSetBold('1. Set Title', 'section'); // Removing bold
    await formAreaComponent.froalaSetItalic('1. Set Title', 'section');
    await formAreaComponent.froalaSetFontColor('1. Set Title', 'section', '#E25041');
    expect(await formAreaComponent.getElementCssProperties('1. Set Title', 'section')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '18px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
})
Then("Should verify inline formatting on label element",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.refreshPage();
    await formAreaComponent.dragElementToFormArea('label');
    await formAreaComponent.froalaSetBold('Set Title', 'label'); // Removing bold
    await formAreaComponent.froalaSetItalic('Set Title', 'label');
    await formAreaComponent.froalaSetFontColor('Set Title', 'label', '#E25041');
    expect(await formAreaComponent.getElementCssProperties('Set Title', 'label')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '13px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
})
Then("Should verify inline formatting on interaction element",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.refreshPage();
    await formAreaComponent.dragElementToFormArea('interactions');
    await formAreaComponent.froalaSetBold('Set Title', 'interactions'); // Removing bold
    await formAreaComponent.froalaSetItalic('Set Title', 'interactions');
    await formAreaComponent.froalaSetFontColor('Set Title', 'interactions', '#E25041');
    expect(await formAreaComponent.getElementCssProperties('Set Title', 'interactions')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '13px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
})
Then("Should verify inline formatting on hyperlink element",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.refreshPage();
    await formAreaComponent.dragElementToFormArea('hyperlink');
    await formAreaComponent.froalaSetBold('Enter Text', 'hyperlink'); // Removing bold
    await formAreaComponent.froalaSetItalic('Enter Text', 'hyperlink');
    await formAreaComponent.froalaSetFontColor('Enter Text', 'hyperlink', '#E25041');
    expect(await formAreaComponent.getElementCssProperties('Enter Text', 'hyperlink')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '13px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
    await objectives.editObjectives('First Objective');
    await objectives.editObjectives('Second Objective');
    await duration.setDurationDropdown('0:15');
    await formDesigner.saveFormAsDraft('DraftCoachingPackage',true);
})
Then("Should verify inline formatting on a saved form",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.refreshPage();
    await coachingPackage.navigateToCoachingPackageManager();
    await coachingPackage.openSavedPackage('DraftCoachingPackage');
    expect(await formAreaComponent.getElementCssProperties('Enter Text', 'hyperlink')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '13px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
})
Then("Should verify inline formatting on a duplicated form",{ timeout: 60 * 1000 }, async () => {
    await coachingPackage.refreshPage();
    await coachingPackage.navigateToCoachingPackageManager();
    await coachingPackage.duplicatePackageFromMoreMenu('DraftCoachingPackage', 'DuplicatePackage');
    await coachingPackage.openSavedPackage('DuplicatePackage');
    expect(await formAreaComponent.getElementCssProperties('Enter Text', 'hyperlink')).toEqual({
        alignment: 'start',
        fontFamily: 'OpenSans',
        fontSize: '13px',
        color: 'rgba(226, 80, 65, 1)',
        isBold: false,
        isItalic: true,
        isUnderlined: false
    });
})