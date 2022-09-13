import {Page,Locator} from '@playwright/test';
import { Utils } from '../common/utils';
import { MultiSelectDropdownPo } from './multiselect-Dropdown.po';

export class AddEntityPO {
  public elements: any;
  public teamsDropdown: MultiSelectDropdownPo;
  public groupsDropdown: MultiSelectDropdownPo;
  public page:Page;
  public utils:Utils;
  clickElement = async (elem:any) => {
    await this.page.wait(protractor.ExpectedConditions.elementToBeClickable(elem));
    return elem.click();
  };
  constructor(pageElement?: Locator) {
    this.page.locator = pageElement || this.page.locator('body');
    this.utils = new Utils(this.page);
    this.elements = {
      rows: this.page.locator('.ag-center-cols-viewport .ag-row'),
      selectedEntityListItem: this.page.locator('.selected-row'),
      saveBtn: this.page.locator('.save-btn'),
      cancelBtn: this.page.locator('.cancel-btn'),
      selectedEntityTab: this.page.locator('#selected-entity-tab'),
      clearAll: this.page.locator('.action-btns a >> text = Clear all'),
      dropDowns: this.page.locator('.dropdown-wrapper cxone-multiselect-dropdown'),
      moveButton: this.page.locator('.movePush .cxone-btn')
    };
  }
  searchItem(searchQuery: string): Promise<any> {
    const searchField = this.page.locator('.left-section .search-wrapper .cxone-text-input input[type="text"]');
    searchField.clear();
    return searchField.sendKeys(searchQuery) as Promise<any>;
  }
  async selectFirstGridRow() {
    return await this.clickElement(this.page.locator('.left-section .cxone-grid .ag-center-cols-clipper .ag-row.ag-row-first'));
  }

  public async selectTeams(teamNames: string[]) {
    let teamsDropdown = new MultiSelectDropdownPo((await this.elements.dropDowns)[0]);
    await teamsDropdown.selectMulitpleItemsByLabels(teamNames,false);
  }

  public async selectGroups(groupNames: string[]) {
      let teamsDropdown = new MultiSelectDropdownPo((await this.elements.dropDowns)[1]);
      await teamsDropdown.selectMulitpleItemsByLabels(groupNames,false);
  }
  async selectItem(item: string): Promise<any> {
    await this.searchItem(item);
    await this.selectTab(0);
    return await this.clickElement(this.page.locator('.left-section .cxone-grid .ag-center-cols-clipper .ag-row.ag-row-first'));
  }
  async openFilters(): Promise<any> {
    return await this.clickElement(this.page.locator('.left-section .filter-btn-wrapper icon.filter-btn'));
  }

  async removeItemFromActiveTab(item: string): Promise<any> {
    const searchField = this.page.locator('.right-section .active-tab .cxone-text-input input[type="text"]');
    await searchField.clear();
    await searchField.sendKeys(item);
    const selectedRow = await this.page.locator('.right-section .active-tab .bottom-row .selected-row').get(0);
    return await this.clickElement(selectedRow.locator('.remove-icon'));
  }

  async removeAllFromActiveTab(): Promise<any> {
    return await this.clickElement(this.page.locator('.right-section .active-tab .top-row a'));
  }

  getTotalCount() {
    return this.page.locator('.custom-omnibar-wrapper .count-wrapper .count').getText();
  }

  async selectAll(): Promise<any> {
    return await this.clickElement(this.page.locator('.left-section .custom-omnibar-wrapper .count-wrapper .select-all-link a'));
  }

  async selectAllRowsCheckboxes(): Promise<any> {
    return await this.clickElement(this.page.locator('label[for=\'checkbox-grid-header\']'));
  }

  getTabLabel(tabIndex: number): Promise<any> {
    return this.page.locator('.right-section .upper-tabs .upper-tab').get(tabIndex)
      .locator('.tab-title').getText() as Promise<any>;
  }

  async selectTab(tabIndex: number): Promise<any> {
    return this.page.locator('.right-section .upper-tabs .upper-tab').get(tabIndex)
      .locator('.tab-title').click() as Promise<any>;
  }

  async rowCount() {
    return await this.elements.rows.count();
  }

  public selectedEntityListItem() {
    return this.elements.selectedEntityListItem;
  }

  public saveBtn() {
    return this.elements.saveBtn.click();
  }

  public selectedEntityTab() {
    return this.elements.selectedEntityTab;
  }

  async clearAll() {
    await this.elements.clearAll.click();
  }

  public async clickMoveButton() {
    await this.utils.click(this.elements.moveButton);
  }

  public async isMoveButtonPresent() {
    return await this.page.locator.isPresent(this.elements.moveButton);
  }

  public cancelBtn() {
    return this.elements.cancelBtn.click();
  }
}
