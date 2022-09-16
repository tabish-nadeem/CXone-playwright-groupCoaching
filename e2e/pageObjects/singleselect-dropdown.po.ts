/* eslint-disable */
import { Locator, Page} from "@playwright/test";

export class SingleselectDropdownPO {
    readonly page:Page;
    // anscestor: Locator;

    constructor(page?: Page) {
        this.page = page;
        // if (!this.dropdownElement) {
        //     this.anscestor = this.page.locator('cxone-singleselect-dropdown .cxone-singleselect-dropdown');
        // } else {
        //     this.anscestor = dropdownElement;
        // }
    }

    toggle() {
        return this.page.locator('.dropdown-button').click() as Promise<any>;
        //return $(this.selector + ' .dropdown-button').click() as Promise<any>;
    }



    async isOpen() {
        return this.page.locator('.icon-carat.dropdown-open').click() as Promise<any>;
        //return await $(this.selector + ' .icon-carat.dropdown-open').isPresent();
    }

    async open() {
        const isOpen = await this.isOpen();
        if (!isOpen) {
            return await this.toggle();
        } else {
            return;
        }
    }


    async hasScrollSideBarToClick(elem) {
        let webElem = await elem.getWebElement();
        await this.page.evaluate('arguments[0].scrollIntoView()', webElem); // if no scrollbar this just stays
        await ExpectedConditions.elementToBeClickable(elem);
        await elem.click();
    }

    async selectItemByLabelWithoutSearchBox(label: string) {
        await this.open();
        let elems = await this.page.locator(`.options-wrapper .item-row >> text = ${label}`);
        await this.hasScrollSideBarToClick(elems[0]);
    }

   

   


}
