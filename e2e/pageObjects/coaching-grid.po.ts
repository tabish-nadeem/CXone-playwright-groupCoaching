import {Page,Locator,expect} from '@playwright/test';

export class CoachingGridPO {
    public constructor(private locator: Locator) {
        this.locator = locator || locator('cxone-grid');
    }

    public getAllRows() {
        return this.locator('.ag-center-cols-viewport .ag-row');
    }

    public getRowByRowIndex(rowIndex: number) {
        return this.locator(`.ag-center-cols-viewport .ag-row[row-index=${rowIndex}]`);
    }

    public getRowByText(text: string) {
        return this.locator(`.ag-center-cols-viewport .ag-row >> ${text}`);
    }

    public async getTotalRowCount() {
        return await this.getAllRows().count();
    }

    public async getRowByColumnText(columnId: string, text: string): Promise<Locator> {
        const allRows = await this.getAllRows();
        for (let row of allRows) {
            if ((await (await row.locator('[col-id=' + columnId + ']')).getText()).includes(text))
                return row;
        }
    }
}
