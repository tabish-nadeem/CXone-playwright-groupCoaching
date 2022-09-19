import { Locator, Page, expect} from "@playwright/test";

export class ObjectivesComponentPO {
    public page:Page;

    public objectiveHeaderWrapper: Locator;
    public objectiveHeadingText: Locator;
    public editableObjectiveField: Locator;
    public editableObjectiveEditable: Locator;
    public objectivesList: Locator;
    public objectivesListInTestpackage: Locator;

    constructor(pageElement?: Page) {
        this.page = pageElement || this.page.locator('body');
            this.objectiveHeaderWrapper= this.page.locator('.objective-header');
            this.objectiveHeadingText= this.page.locator('.objectives-component .heading');
            this.editableObjectiveField= this.page.locator('#form-designer-objective-example');
            this.editableObjectiveEditable= this.page.locator('#form-designer-objective-editor');
            this.objectivesList= this.page.locator('.objectives-class * li');
            this.objectivesListInTestpackage= this.page.locator('.objectives-view-only li');
    }

    //Function to get Objective header text
    async getObjectiveHeadingText(): Promise<any> {
        return this.objectiveHeadingText.getText() as Promise<any>;
    }

    //Function to click on editable objectives section
    async clickOnObjectives(): Promise<any> {
        expect(this.editableObjectiveField).toBeVisible(10000);
        return this.editableObjectiveField.click() as Promise<any>;
    }

    //Function to send text into editable objectives section
    async editObjectives(objText): Promise<any> {
        expect(this.editableObjectiveEditable).toBeVisible(10000);
        return this.editableObjectiveEditable.sendKeys(objText) as Promise<any>;
    }

    //Function to get all added objectives, return array of all objectives
    async getObjectivesList(): Promise<any> {
        return this.objectivesList.getText() as Promise<any>;
    }

    //Function to get all added objectives, return array of all objectives
    async getObjectivesListInTestPackageModal (): Promise<any> {
        return this.objectivesListInTestpackage.getText() as Promise<any>;
    }

}
