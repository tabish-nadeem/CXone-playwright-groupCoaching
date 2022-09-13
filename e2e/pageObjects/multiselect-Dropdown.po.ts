import {Page,Locator} from '@playwright/test';

export class MultiSelectDropdownPo {
    public elements;
    public page:Page;

    public constructor(pageElement?:Locator) {
        this.page.locator = pageElement || this.page.locator('.cxone-multiselect-dropdown');
        this.elements = {
            wrapper: this.page.locator,
            caret: this.page.locator('.icon-carat'),
            allChoiceRows: this.page.locator('.item-row:not([class~="active"])'),
            choicesLabels: this.page.locator('.option-content'),
            inputText: this.page.locator('.search-wrapper input'),
            placeholder: this.page.locator('[class~="button-text"]')
        };
    }

    public async isOpen() {
        return this.page.locator('.dropdown-popover-wrapper').isPresent();
    }

    public async toggleOpened() {
        return await this.elements.caret.click();
    }

    public async getSelectedCount() {
        //Assumes the dropdown is in the opened state
        return await this.page.locator('.dropdown-popover-wrapper input[type="checkbox"]:checked').count();
    }

    public async open() {
        let temp = await this.isOpen();
        if (!temp) {
            await this.elements.caret.click();
            await this.page.waitForSelector(this.page.locator('.options-wrapper'));
        }
    }

    public async selectItemByLabel(label) {
        await this.open();
        await this.elements.inputText.clear();
        await this.elements.inputText.sendKeys(label);
        return await this.elements.allChoiceRows.first().click();
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
        return await this.elements.placeholder.getText();
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
            await this.elements.caret.click();
        }
    }

    public async selectAllItemsContainTheLabel(arg:any){

    }
}
