import {Page,Locator} from '@playwright/test';
import { Utils } from '../common/utils';
import { MultiSelectDropdownPo } from './MultiselectDropdownPO';

export class AddEntityPO {
  
  public teamsDropdown: MultiSelectDropdownPo;
  public groupsDropdown: MultiSelectDropdownPo;
  public page:Page;
  public utils:Utils;
  public rows: Locator;
  public selectedEntityListItem: Locator;
  public saveBtn: Locator;
  public cancelBtn: Locator;
  public selectedEntityTab: Locator;
  public clearAll: Locator;
  public dropDowns: Locator;
  public moveButton: Locator;

  clickElement = async (elem:any) => {
    await this.page.wait(protractor.ExpectedConditions.elementToBeClickable(elem));
    return elem.click();
  };
  constructor(pageElement?: Page) {
    this.page = pageElement || this.page.locator('body');
    this.utils = new Utils(this.page);
      this.rows = this.page.locator('.ag-center-cols-viewport .ag-row');
      this.selectedEntityListItem = this.page.locator('.selected-row');
      this.saveBtn = this.page.locator('.save-btn');
      this.cancelBtn = this.page.locator('.cancel-btn');
      this.selectedEntityTab = this.page.locator('#selected-entity-tab');
      this.clearAll = this.page.locator('.action-btns a >> text = Clear all');
      this.dropDowns = this.page.locator('.dropdown-wrapper cxone-multiselect-dropdown');
      this.moveButton = this.page.locator('.movePush .cxone-btn');
  }


  async selectAll(): Promise<any> {
    return await this.clickElement(this.page.locator('.left-section .custom-omnibar-wrapper .count-wrapper .select-all-link a'));
  }


  public saveBtnFunc() {
    return this.saveBtn.click();
  }
  getTotalCount() {
    return this.page.locator('.custom-omnibar-wrapper .count-wrapper .count').getText();
  }
  getTabLabel(tabIndex: number): Promise<any> {
    return this.page.all('.right-section .upper-tabs .upper-tab').get(tabIndex)
      .this.page.locator('.tab-title').getText() as Promise<any>;
  }
  public async selectTeams(teamNames: string[]) {
    let teamsDropdown = new MultiSelectDropdownPo((await this.dropDowns)[0]);
    await teamsDropdown.selectMulitpleItemsByLabels(teamNames,false);
  }
  public async selectGroups(groupNames: string[]) {
    let teamsDropdown = new MultiSelectDropdownPo((await this.dropDowns)[1]);
    await teamsDropdown.selectMulitpleItemsByLabels(groupNames,false);
  }
  async selectAllRowsCheckboxes(): Promise<any> {
    return await this.clickElement(this.page.locator('label[for=\'checkbox-grid-header\']'));
  }
  public async clickMoveButton() {
    await this.utils.click(this.moveButton);
  }
  async rowCount() {
    return await this.rows.count();
  }
  async removeAllFromActiveTab(): Promise<any> {
    return await this.clickElement(this.page.locator('.right-section .active-tab .top-row a'));
  }
  searchItem(searchQuery: string): Promise<any> {
    const searchField = this.page.locator('.left-section .search-wrapper .cxone-text-input input[type="text"]');
    searchField.clear();
    return searchField.sendKeys(searchQuery) as Promise<any>;
  }

}
