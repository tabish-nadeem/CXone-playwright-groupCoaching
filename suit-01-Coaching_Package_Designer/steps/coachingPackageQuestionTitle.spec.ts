import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import * as _ from 'lodash';
import { GlobalTenantUtils } from "../../e2e/common/globalTenantUtils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { FeatureToggleUtils } from "../../e2e/common/FeatureToggleUtils";
import { LocalizationNoUI } from "../../e2e/common/LocalizationNoUI";
import { CHARACTER_LIMIT } from "../../e2e/common/CONSTANTS";
import { CoachingPackagesPO } from "../../e2e/pageObjects/CoachingPackagePO";

let browser: any;
let context: BrowserContext;
let page:Page;
let coachingPackage:CoachingPackagesPO;
let formDesigner;
let duration;
let objectives;
let formAreaComponent;
let adminDetails,
    globalToken;
let dateFormat,
    localeString = 'en-US';
let userDetails:any;
let elementTypes:any;
let globalTenantUtils:GlobalTenantUtils;

const FEATURE_TOGGLES = {
    angular8_migration_spring22: 'utility-QM-angular8UpgradeSpring22-CXQM-16664',
    restrict_question_lenght_ft: 'utility-QM-restrict-form-data-question-title-CXQM-18756'
};


const setTenantDetails = () => {
    let defaultUserCredentials: any = globalTenantUtils.getDefaultTenantCredentials();
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
    coachingPackage = new CoachingPackagesPO();
    formDesigner = new FormDesignerPagePO();
    duration = new DurationComponentPO();
    objectives = new ObjectivesComponentPO();
    formAreaComponent = new FormAreaComponentPO();

    setTenantDetails();
    let response = await CommonUIUtils.testUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
    globalToken = response;
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.angular8_migration_spring22, adminDetails.orgName, globalToken);
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    console.log('DateTime formats to use', dateFormat);
});

AfterAll({timeout: 400 * 1000},async () =>{
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.restrict_question_lenght_ft, userDetails.orgName, globalToken);
    await CommonUIUtils.logout(true, 120000, userDetails.orgName, globalToken);
});

Given("Should drag attachment element, set label and save form as draft",{ timeout: 60 * 1000 }, async () => {
    const shouldDragElementAndSaveAsDraft = async () => {
        await coachingPackage.navigateToCoachingDesigner();
        await objectives.editObjectives('First Objective');
        await browser.actions().sendKeys(page.Key.ENTER).perform();
        await objectives.editObjectives('Second Objective');
        await duration.setDurationDropdown('0:15');
        await formAreaComponent.dragElementToFormArea(elementTypes.attachmentFormType);
        await formAreaComponent.froalaSetLabel('Set Title', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagi', elementTypes.attachmentFormType);
        await formDesigner.saveFormAsDraft('QuestionTitleTest',true);
    };

});


When("Should open draft form and trim the questione",{ timeout: 60 * 1000 }, async () => {
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.restrict_question_lenght_ft, userDetails.orgName, globalToken);
    await coachingPackage.navigateToCoachingPackageManager(false);
    await CommonUIUtils.waitUntilIconLoaderDone();
    await browser.refresh();
    await CommonUIUtils.waitUntilIconLoaderDone();
    await coachingPackage.openSavedPackage('QuestionTitleTest');
    expect(await objectives.getObjectivesList()).toEqual(['First Objective', 'Second Objective']);
    let text = await formAreaComponent.getActualQuestionTextOfAnElement(0);
    let textLength = text.length;
    expect(textLength).toEqual(CHARACTER_LIMIT.questionLength);
    expect(text).toContain('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenea');
    expect(text).not.toContain('ut eros et nisl sagi');
});