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
//po'
import { CoachingPlansPO } from "../../../e2e/pageObjects/CoachingPlansPO";
import { CoachingPackagesPO } from "../../../e2e/pageObjects/CoachingPackagePO";
import { CoachingPlanDetailsPO } from "../../../e2e/pageObjects/CoachingPlanDetailsPO";
import { AddEntityPO } from "../../../e2e/pageObjects/AddEntityPO";
import { ScheduleManagerPO } from "../../../e2e/pageObjects/schedule-manager.po";
import { AccountUtils } from "../../common/AccountUtils";
import { Utils } from "../../common/utils";

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
        let skillsData = {
            skill1: {
                name: 'Skill' + moment(),
                id: ''
            }
        };
        let dateFormat;
        let teamFilterID = 'team';
        let groupsFilterID = 'groups';
        let skillsFilterID = 'skills';
        let coachingPackageName = 'COACHING_PACKAGE' + CommonUIUtils.getRandomString();
        let statusActive = 'Active';
        let statusScheduled = 'Scheduled';

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
            setTenantDetails();
            let response = await CommonNoUIUtils.login(adminDetails.emailAddress, adminDetails.password, false);
            globalToken = response;
            await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING22, adminDetails.orgName, globalToken);
            await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, adminDetails.orgName, globalToken);
            let promiseArr = [
                AdminUtilsNoUI.createGroup(groupsData.group1.name, globalToken),
                AdminUtilsNoUI.createGroup(groupsData.group2.name, globalToken),
                AdminUtilsNoUI.createTeam(teamsData.team1.name, 'Team Description', teamsData.team1.id, globalToken),
                AdminUtilsNoUI.createTeam(teamsData.team2.name, 'Team Description', teamsData.team2.id, globalToken),
                AdminUtilsNoUI.createSkill(skillsData.skill1.name, globalToken),
                fdUtils.removeAllUsers(globalToken, teamsData.team2.id)
            ];
            response = await Promise.all(promiseArr);
            userSkills = await AdminUtilsNoUI.getAllSkills(globalToken);
            skillsData.skill1.id = _.find(userSkills, {name: skillsData.skill1.name}).id;
            groupsData.group1.id = response[0].groupId;
            groupsData.group2.id = response[1].groupId;
            teamsData.team1.id = response[2].team.id;
            teamsData.team2.id = response[3].team.id;
            userData.user1.teamId = teamsData.team1.id;
            userData.user1.groupIds.push(groupsData.group1.id); //User 1 is part of group1 team 1
            userData.user2.teamId = teamsData.team2.id;
            userData.user2.groupIds.push(groupsData.group1.id, groupsData.group2.id); //User 2 is part of group1,group2 team 2
            userData.user2.skills.push(skillsData.skill1.id);

            promiseArr = [
                AccountUtils.createNewUser(userData.user1.email, userData.user1, globalToken,response.token),
                AccountUtils.createNewUser(userData.user2.email, userData.user2, globalToken,response.token),
                CommonQMNoUIUtils.createCoachingPackage(coachingPackage.generatePackageData(coachingPackageName, 'Published'), globalToken)
            ];
            await Promise.all(promiseArr);

            dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
            console.log('DateTime formats to use', dateFormat);
        });
        Given("Should verify mandatory Fields and default date selection",{ timeout: 60 * 1000 }, async () => {
            const onStart = async () => {
                await protractorConfig.testUtils.login(adminDetails.emailAddress, protractorConfig.testUtils.validPassword, protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
                await removeFeatureToggle(FEATURE_TOGGLES.ENHANCED_ADD_EMPLOYEE_MODAL_FT, adminDetails.orgName, globalToken);
                await protractorConfig.testUtils.waitForPage(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
                await protractorConfig.testUtils.maximizeBrowserWindow();
            };
            //
            await coachingPlan.clickNewCoachingPlanButton();
                await Utils.waitUntilVisible(coachingPlanDetailsPage.getAddUsersButton());
                expect(webdriverUtils.getElementAttribute(coachingPlanDetailsPage.getStartDate(), 'value')).toEqual(dates.currentDate.format(dateFormat.shortDateFormat));
                expect(webdriverUtils.getElementAttribute(coachingPlanDetailsPage.getEndDate(), 'value')).toEqual(dates.defaultPlanEndDate.format(dateFormat.shortDateFormat));

                await coachingPlanDetailsPage.clickSubmitButton();
                expect(webdriverUtils.getElementText(coachingPlanDetailsPage.getPlanNameErrorMessage()))
                    .toEqual(fdUtils.getExpectedString('coachingPlanDetails.validationMsg.fieldRequired'));

                await coachingPlanDetailsPage.setCoachingPlanName(planName);
                expect(webdriverUtils.getElementText(coachingPlanDetailsPage.getCoachingPackageErrorMessage()))
                    .toEqual(fdUtils.getExpectedString('coachingPlanDetails.validationMsg.fieldRequired'));

                await coachingPlanDetailsPage.selectCoachingPackage(coachingPackageName);
                expect(webdriverUtils.getElementText(coachingPlanDetailsPage.getAssignedEmployeesErrorMessage()))
                    .toEqual(fdUtils.getExpectedString('coachingPlanDetails.validationMsg.fieldRequired'));
           
        });
        When("Should verify Select All Link On Add Users Modal adds users to selected section",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickAddUsersButton();
                expect(await addEntity.getTotalCount()).toEqual('3 total');
                await addEntity.selectAll();
                expect(await addEntity.getTotalCount()).toEqual('0 total');
                let tab = await addEntity.getTabLabel(0);
                expect(tab).toEqual('SELECTED (3)');
        })
        Then("Should verify all Users are displayed On CoachingPlanDetailsPage",{ timeout: 60 * 1000 }, async () => {
            await addEntity.saveBtn();
            await fdUtils.waitForLoadingToDisappear(60000);
            userCount = await coachingPlanDetailsPage.getItemCount();
            expect(userCount).toEqual('3 Total');
        
        })
        Then("Should verify that single user can be removed from the plan",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickRemoveSingleuser(2);
            userCount = await coachingPlanDetailsPage.getItemCount();
            expect(userCount).toEqual('2 Total ( Viewing 2 )');
            await coachingPlanDetailsPage.clickRemoveSingleuser(0);
            userCount = await coachingPlanDetailsPage.getItemCount();
            expect(userCount).toEqual('1 Total ( Viewing 1 )');
      
        })
        Then("Should verify that remove users button on CoachingPlanDetailsPage is deleting the selected users",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickAddUsersButton();
            await addEntity.selectAll();
            await addEntity.saveBtn();
            await Utils.waitForLoadingToDisappear();
            await coachingPlanDetailsPage.selectParticularUser(userData.user1.firstName + ' ' + userData.user1.lastName);
            await coachingPlanDetailsPage.selectParticularUser(userData.user2.firstName + ' ' + userData.user2.lastName);
            await coachingPlanDetailsPage.clickRemoveUsersButton();
            userCount = await coachingPlanDetailsPage.getItemCount();
            expect(userCount).toEqual('1 Total ( Viewing 1 )');
            await coachingPlanDetailsPage.clickAddUsersButton();
            expect(await addEntity.getTotalCount()).toEqual('2 total');
            expect(await addEntity.getTabLabel(1)).toEqual('ASSIGNED (1)');
      
        })
        Then("Should verify that Teams and Groups filters are working properly",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickFilterButton();
            await addEntity.selectTeams([teamsData.team1.name]);
            await addEntity.selectGroups([groupsData.group1.name]);
            count = await addEntity.rowCount();
            expect(count).toEqual(1);
            expect(await addEntity.getTotalCount()).toEqual('1 total (viewing 1)');
    
        })
        Then("Should verify that Select all link select only filtered users under selected tab",{ timeout: 60 * 1000 }, async () => {
            await addEntity.selectAll();
            expect(webdriverUtils.getElementText(addEntity.getTotalCount())).toEqual('0 total (viewing 0)');
            expect(webdriverUtils.getElementText(addEntity.getTabLabel(0))).toEqual('SELECTED (1)');
       //return await page.locator('.first-last-name').textContent();
        })
        Then("Should verify that remove all link removes all the users from selected tab and adds them to users grid",{ timeout: 60 * 1000 }, async () => {
            await addEntity.removeAllFromActiveTab();
            expect(await addEntity.getTotalCount()).toEqual('1 total (viewing 1)');
            expect(await addEntity.getTabLabel(0)).toEqual('SELECTED (0)');
      
        })
        Then("Should verify that clear link removes all the filters and shows all the users in users grid",{ timeout: 60 * 1000 }, async () => {
            await addEntity.clearAll();
            count = await addEntity.rowCount();
            expect(count).toEqual(2);
            expect(webdriverUtils.getElementText(addEntity.getTotalCount())).toEqual('2 total');
        
        })
        Then("Should verify that user is able to schedule the plan with selected information",{ timeout: 60 * 1000 }, async () => {
            await addEntity.selectAll();
            await addEntity.saveBtn();
            await coachingPlanDetailsPage.setPlanStartDate(dates.futureDate.format(dateFormat.shortDateFormat));
            await coachingPlanDetailsPage.clickSubmitButton();
            await Utils.waitForSpinnerToDisappear();
            let planRowElements = await coachingPlan.getRowElementsByPlanName(planName);
            expect(planRowElements.employees).toBe('3');
            expect(planRowElements.status).toBe(statusScheduled);
       
        })
        Then("Should verify that a lock icon is shown for the user (when we change the \'can be coached'\ attribute to false after scheduling the plan)",{ timeout: 60 * 1000 }, async () => {
            let allUsers = await protractorConfig.testUtilsNoUI.getUsers();
            let user2 = _.find(allUsers, {firstName: userData.user2.firstName});
            await protractorConfig.adminUtilsNoUI.updateUserWithAttribute(user2, 'canBeCoachedOrEvaluated', 'false');
            await coachingPlan.openSavedPlan(planName);
            await Utils.waitForSpinnerToDisappear();
            await coachingPlanDetailsPage.waitForLockIconToDisplay(userData.user2.firstName + ' ' + userData.user2.lastName);
            expect(coachingPlanDetailsPage.getLockIconOnEmployeeRow(userData.user2.firstName + ' ' + userData.user2.lastName)).toBeTruthy();
       
        })
        Then("Should verify that user is able to activate coaching plan successfully",{ timeout: 60 * 1000 }, async () => {
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
        Then("Should verify that an employee is not available to add to a new coaching plan (Can Be Coached Attribute = false)",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickCancelButton();
            await coachingPlan.clickNewCoachingPlanButton();
            await Utils.waitUntilVisible(coachingPlanDetailsPage.getAddUsersButton());
            await coachingPlanDetailsPage.clickAddUsersButton();
            await addEntity.searchItem(userData.user2.firstName + ' ' + userData.user2.lastName);
            count = await addEntity.rowCount();
            expect(count).toEqual(0);
            expect(await addEntity.getTotalCount()).toEqual('0 total (viewing 0)');
     
        })
        //scenario-2 
        When("Should verify scheduling options is disabled for older plans",{ timeout: 60 * 1000 }, async () => {
            const onStart = async () => {
                await loginPage.login(adminDetails.emailAddress, protractorConfig.testUtils.validPassword, protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
                await protractorConfig.testUtils.maximizeBrowserWindow();
            };
            //
            await protractorConfig.testUtils.navigateTo(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
            await coachingPlan.openSavedPlan(planName);
            await fdUtils.waitForLoadingToDisappear(60000);
            expect(coachingPlanDetailsPage.getDisabledSchedulingOption()).toBeTruthy();
       
        })
        Then("Should enable scheduling options",{ timeout: 60 * 1000 }, async () => {
            await protractorConfig.testUtils.navigateTo(protractorConfig.protractorStringUtils.getPageIdentifierUrls('coaching.coachingPlans'));
            await coachingPlan.clickNewCoachingPlanButton();
            await Utils.waitUntilVisible(coachingPlanDetailsPage.getAddUsersButton());
            await fdUtils.waitForLoadingToDisappear(60000);
            expect(coachingPlanDetailsPage.getDisabledSchedulingOption().isDisplayed()).toBeTruthy();

            await coachingPlanDetailsPage.setCoachingPlanName(planNameWithSchedulingOptions);
            await coachingPlanDetailsPage.selectCoachingPackage(coachingPackageName);
            await coachingPlanDetailsPage.setPlanStartDate(dates.futureDate.format(dateFormat.shortDateFormat));
            await coachingPlanDetailsPage.clickAddUsersButton();
            await addEntity.selectAll();
            await addEntity.saveBtn();
            await fdUtils.waitForLoadingToDisappear(60000);
            expect(coachingPlanDetailsPage.getEnabledSchedulingOption().isDisplayed()).toBeTruthy();

        })
        Then("Should validate modal",{ timeout: 60 * 1000 }, async () => {
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
            await fdUtils.waitForLoadingToDisappear(60000);
        })
        Then("Should schedule coaching plan with scheduling options",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickSubmitButton();
            await fdUtils.waitForLoadingToDisappear(60000);
            let planRowElements = await coachingPlan.getRowElementsByPlanName(planNameWithSchedulingOptions);
            expect(planRowElements.status).toBe(statusScheduled);

            await coachingPlan.openSavedPlan(planNameWithSchedulingOptions);
            await fdUtils.waitForLoadingToDisappear(60000);
            let status = await coachingPlanDetailsPage.getRowWithConflictScheduledStatus(0);
            expect(status.isVisible()).toBeTruthy();
            expect(coachingPlanDetailsPage.getActiveSchedulingOption()).toBeTruthy();
            
        })
        Then("Should validate warning modal",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.clickRemoveSingleuser();
            expect(coachingPlanDetailsPage.getWarningModalTitle()).toBeTruthy();

            await schedulingOptions.clickCancelButton();
            expect(coachingPlanDetailsPage.getActiveSchedulingOption()).toBeTruthy();

            await coachingPlanDetailsPage.clickRemoveSingleuser();
            await coachingPlanDetailsPage.clearSchedulingOptions();
            expect(coachingPlanDetailsPage.getEnabledSchedulingOption()).toBeTruthy();

        })
        Then("Should active coaching plan",{ timeout: 60 * 1000 }, async () => {
            await coachingPlanDetailsPage.setPlanStartDate(dates.currentDate.format(dateFormat.shortDateFormat));
            await coachingPlanDetailsPage.clickSchedulingOptions();
            await schedulingOptions.selectActivity('Meeting');
            await schedulingOptions.enterSimultaneousBooking(6);
            await schedulingOptions.clickSaveButton();
            await fdUtils.waitForLoadingToDisappear(60000);
            expect(coachingPlanDetailsPage.getActiveSchedulingOption()).toBeTruthy();

            await coachingPlanDetailsPage.clickSubmitButton();
            await fdUtils.waitForLoadingToDisappear(60000);
            let planRowElements = await coachingPlan.getRowElementsByPlanName(planNameWithSchedulingOptions);
            expect(planRowElements.status).toBe(statusActive);

            await coachingPlan.openSavedPlan(planNameWithSchedulingOptions);
            await fdUtils.waitForLoadingToDisappear(60000);
            expect(coachingPlanDetailsPage.getDisabledSchedulingOption()).toBeTruthy();
            let status = await coachingPlanDetailsPage.getRowWithConflictScheduledStatus(0);
            expect(status.isVisible()).toBeTruthy();
            
        })