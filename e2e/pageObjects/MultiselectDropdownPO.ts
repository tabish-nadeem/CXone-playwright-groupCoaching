import {Page,Locator} from '@playwright/test';

export class MultiSelectDropdownPo {
    public page:Page;
    public wrapper: Locator;
    public caret: Locator;
    public allChoiceRows: Locator;
    public choicesLabels: Locator;
    public inputText: Locator;
    public placeholder: Locator;

    public constructor(pageElement?:Page) {
        this.page = pageElement || this.page.locator('.cxone-multiselect-dropdown');
            this.wrapper= this.page.locator;
            this.caret = this.page.locator('.icon-carat');
            this.allChoiceRows = this.page.locator('.item-row:not([class~="active"])');
            this.choicesLabels = this.page.locator('.option-content');
            this.inputText = this.page.locator('.search-wrapper input');
            this.placeholder = this.page.locator('[class~="button-text"]');
    }

    public async isOpen() {
        return this.page.locator('.dropdown-popover-wrapper').isPresent();
    }

    public async toggleOpened() {
        return await this.caret.click();
    }

    public async getSelectedCount() {
        //Assumes the dropdown is in the opened state
        return await this.page.locator('.dropdown-popover-wrapper input[type="checkbox"]:checked').count();
    }

    public async open() {
        let temp = await this.isOpen();
        if (!temp) {
            await this.caret.click();
            await this.page.waitForSelector(this.page.locator('.options-wrapper'));
        }
    }

    public async selectItemByLabel(label) {
        await this.open();
        await this.inputText.clear();
        await this.inputText.sendKeys(label);
        return await this.allChoiceRows.first().click();
    }

    public async selectItemByLabelNoSearch(label) {
        await this.open();
        await this.page.locator(`.item-row:not([class~="active"]) .item-text >>  text =${label}`).click();
        await this.close();
    }

    public async selectMulitpleItemsByLabels(labels,searchEnabled?) {
        let promiseArray:any = [];
        await this.open();
        for (let i = 0; i < labels.length; i += 1) {
            if (searchEnabled) {
                promiseArray.push(this.selectItemByLabel(labels[i]));
            } else {
                promiseArray.push(this.selectItemByLabelNoSearch(labels[i]));
            }
        }
        return Promise.all(promiseArray);
    }

    public async getPlaceholderText() {
        return await this.placeholder.textContent();
    }

    public async selectAllClick() {
        await this.open();
        await this.page.locator('.select-all-btn').click();
    }

    public async clearAllClick() {
        await this.open();
        await this.page.locator('.clear-all-btn').click();
    }

    public async close() {
        let isOpened = await this.isOpen();
        if (isOpened) {
            await this.caret.click();
        }
    }

    public async selectAllItemsContainTheLabel(arg:any){

    }
}
