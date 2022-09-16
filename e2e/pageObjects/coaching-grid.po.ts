import {Page,Locator,expect} from '@playwright/test';

export class CoachingGridPO {
    public page:Page;

    public constructor(private locator: Page) {
        this.page = locator || this.page.locator('cxone-grid');
    }

    public getAllRows() {
        return this.page.locator('.ag-center-cols-viewport .ag-row');
    }


    public async getRowByColumnText(columnId: string, text: string): Promise<Locator> {
        const allRows = await this.getAllRows();
        for (let row of allRows) {
            if ((await (await row.locator('[col-id=' + columnId + ']')).getText()).includes(text))
                return row;
        }
    }
}
