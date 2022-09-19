import {Page,Locator,expect} from '@playwright/test';

export class NotificationMenuPO {
  public page:Page;

  DEFAULT_WAIT = 20000;

  public openCloseMenuButton: Locator;
  public badge: Locator;
  public notificationsMenuPopover: Locator;
  public notificationsMenuHeader: Locator;
  public notificationsList: Locator;

  constructor() {
      this.openCloseMenuButton =this.page.locator('.notification-popover-trigger');
      this.badge = this.page.locator('.badge');
      this.notificationsMenuPopover = this.page.locator('.notification-popover-wrapper');
      this.notificationsMenuHeader = this.page.locator('.notification-popover-wrapper .notification-header');
      this.notificationsList = this.page.locator('.notification-item-container');
  }




  async isBadgeDisplayed() {
    return await this.badge.isDisplayed();
  }

  async getBadgeElement() {
    return await this.badge;
  }

  async getAmountOfUnreadNotifications() {
    let num = await this.badge.textContent();
    return parseInt(num);
  }


}
