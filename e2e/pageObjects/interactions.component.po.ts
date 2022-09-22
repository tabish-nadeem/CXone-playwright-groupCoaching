import {Page,Locator} from '@playwright/test';

export class InteractionsElementPO {
    public page:Page;
    addInteractionsBtn: any;
    selectFirstRecords: any;
    addBtn: any;
    agentName: any;
    agentNameForTestPackageModal: any;
    removeInterationBtn: any;
    playInteractionBtn: any;


    constructor(elementIndex?: any) {
            this.addInteractionsBtn = this.page.locator('#interaction-btn');
            this.selectFirstRecords = this.page.locator('.btnAddInteractions'),
            this.addBtn=this.page.locator('Add');
            this.agentName=this.page.locator('.interactions-grid-body-agentName','E2E Test');
            this.agentNameForTestPackageModal=this.page.locator('.interactions-grid-body-agentName');
            this.removeInterationBtn=this.page.locator('.delete-interaction');
            this.playInteractionBtn= this.page.locator('.player');
     
    }

    async clickAddInteractionsBtn() {
        return await this.addInteractionsBtn.click();
    }

    async clickSelectFirstBtn() {
        return await this.selectFirstRecords.click();
    }

    async clickAddBtn() {
        return await this.addBtn.click();
    }

    public getAllRows() {
        let test = this.page.locator('cxone-grid'));
        return test.this.page.locator('.ag-center-cols-viewport .ag-row'));
    }

    async getInteractionsCount() {
        return await this.page.locator('.interactions-grid-body-agentName').count();
    }

    async removeInteractionFromElement(index) {
        return await this.page.locator.removeInterationBtn.get(index).click();
    }

}
