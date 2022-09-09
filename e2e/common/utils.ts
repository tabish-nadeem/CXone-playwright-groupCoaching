import { Page } from '@playwright/test'

const DEFAULT_WAIT_TIME = 25000;

export class Utils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    async waitForSpinnerToDisappear() {
        const spinner = this.page.waitForSelector('[class="spinner spinner-bounce-middle"]');
        (await spinner).waitForElementState("hidden");
    }

    async delay(time: number) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

    async click(element: any): Promise<any> {
        await this.page.click(element, { timeout: 10000 });
    }

    async randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async getToastMessage() {
        let utils = new Utils(this.page);
        const toast = this.page.locator('.toast-message');
        await toast.isVisible();
        // if (toast === '') {
        //   await Utils.waitForTime(500);
        // }
        return await toast.textContent();
    };
    async generateKinesisStream(url) {
        let urlstream =await url;
        if (urlstream.toString().indexOf('dev') !== -1) {
            return 'dev';
        } else if (urlstream.toString().indexOf('staging') !== -1) {
            return 'staging';
        } else if (urlstream.toString().indexOf('nvir') !== -1) {
            return 'test_nvir';
        } else {
            return 'test';
        }
    }

    public async waitABit(timeToWait: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, timeToWait);
        });
    }
    
}

