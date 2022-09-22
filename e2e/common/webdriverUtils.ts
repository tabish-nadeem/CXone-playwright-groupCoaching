import { Locator, Page, expect } from "@playwright/test";
export class webdriverUtils {
    static getElementAttribute (element, attribute) {
        var value = Locator.getAttribute(attribute);
        return value;
    }
    static getElementText(element) {
        var text = Locator.getText();
        return text;
    }
};
