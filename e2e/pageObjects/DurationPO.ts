import { Locator, Page} from "@playwright/test";
 import { CommonUIUtils } from "cxone-playwright-test-utils";
import { SingleselectDropdownPO } from "./SingleselectDropdownPO";

export class DurationComponentPO {
    public page:Page;

    durationDropDown = new SingleselectDropdownPO('form-desinger-duration-drp-dwn');
    public durationInTestPackage: Locator;
    public durationDropdownElement: Locator;

    constructor(pageElement?: Page) {
        this.page = pageElement || this.page.locator('body');
            this.durationInTestPackage = this.page.locator('.duration-view-only'),
            this.durationDropdownElement = this.page.locator('.duration-dropdown')
    }

    // function to get value to a duration dropdown on test package modal
    async getDurationInTestPackageModal(): Promise<any> {
        await CommonUIUtils.waitUntilIconLoaderDone(this.durationInTestPackage);
        return await this.durationInTestPackage.getText() as Promise<any>;
    }

    async setDurationDropdown(val:any) {
        // await browser.wait(ExpectedConditions.visibilityOf(this.elements.durationDropdownElement), 10000);
        return await this.durationDropDown.selectItemByLabelWithoutSearchBox(val);
    }
}
