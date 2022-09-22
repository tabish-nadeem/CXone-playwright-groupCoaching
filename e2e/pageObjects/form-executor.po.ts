import {browser, ElementFinder} from 'protractor';

export class FormExecutorPO {

    public constructor() {
    }

    public async getListOfOpenWindows() {
        return await browser.driver.getAllWindowHandles();
    }

    public async switchToPopupWithoutPlayer() {
        let handles = await this.getListOfOpenWindows();
        console.log('Window handles', handles);
        if (handles.length === 1) {
            console.error('Unable to find window to switch to');
            return false;
        } else {
            let popUpHandle = handles[1];
            console.log(await browser.driver.switchTo().window(popUpHandle));
            await browser.driver.manage().window().maximize();
            return true;
        }
    }

    public async returnBacktoParent() {
        const allWindows = await this.getListOfOpenWindows();
        await browser.driver.switchTo().window(allWindows[0]); //parent handle = 0th element
    }

    public async closePopupWindowAndBackToParent() {
        await browser.close();
        let handles = await this.getListOfOpenWindows();
        let parentHandle = handles[0];
        return await browser.driver.switchTo().window(parentHandle);
    }
}
