import {Page} from '@playwright/test';
import { Utils } from '../common/utils';
import { MultiSelectDropdownPo } from './MultiselectDropdownPO';

export class AddEntityPO {
  
  public teamsDropdown: MultiSelectDropdownPo;
  public groupsDropdown: MultiSelectDropdownPo;
  public page:Page;
  public utils:Utils;
  public rows;
  public selectedEntityListItem;
  public saveBtn;
  public cancelBtn;
  public selectedEntityTab;
  public clearAll;
  public dropDowns;
  public moveButton;

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


}
