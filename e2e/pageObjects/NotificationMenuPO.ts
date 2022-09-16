import {Page,Locator,expect} from '@playwright/test';

export class NotificationMenuPO {
  elements: any;
  public page:Page;

  DEFAULT_WAIT = 20000;

  constructor() {
    this.elements = {
      openCloseMenuButton: this.page.locator('.notification-popover-trigger'),
      badge: this.page.locator('.badge'),
      notificationsMenuPopover: this.page.locator('.notification-popover-wrapper'),
      notificationsMenuHeader: this.page.locator('.notification-popover-wrapper .notification-header'),
      notificationsList: this.page.locator('.notification-item-container')
    };
  }




  async isBadgeDisplayed() {
    return await this.elements.badge.isDisplayed();
  }

  async getBadgeElement() {
    return await this.elements.badge;
  }

  async getAmountOfUnreadNotifications() {
    let num = await this.elements.badge.textContent();
    return parseInt(num);
  }


}
