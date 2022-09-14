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


  async selectAll(): Promise<any> {
    return await this.clickElement(this.page.locator('.left-section .custom-omnibar-wrapper .count-wrapper .select-all-link a'));
  }


  public saveBtn() {
    return this.elements.saveBtn.click();
  }


}
