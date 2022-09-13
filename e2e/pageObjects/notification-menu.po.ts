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

  async openNotificationMenu() {
    await this.elements.openCloseMenuButton.click();
    await expect(this.page.locator('.notification-popover-wrapper')).waitFor({state:'attached',timeout:this.DEFAULT_WAIT});

  }

  async isNotificationMenuOpened() {
    return await this.elements.notificationsMenuPopover.isDisplayed();
  }

  async isBadgeDisplayed() {
    return await this.elements.badge.isDisplayed();
  }

  async getBadgeElement() {
    return await this.elements.badge;
  }

  async getAmountOfUnreadNotifications() {
    let num = await this.elements.badge.getText();
    return parseInt(num);
  }

  getNotificationElementByIndex = async index => {
    let notifications = await this.elements.notificationsList;
    return notifications[index];
  }

  getNotificationInfoByIndex = async index => {
    let notificationInfo = {};
    let notification = await this.getNotificationElementByIndex(index);
    if (notification) {
      let results = await Promise.all([notification.locator('.notificationItemTitle').getText(),
        notification.locator('.notificationItemDescription').getText(),
        notification.locator('.notificationItemPublisher').getText(),
        notification.locator('.notificationItemDate').getText()]);
      notificationInfo = {
        title: results[0],
        description: results[1],
        publisher: results[2],
        date: results[3]
      };
    }
    return notificationInfo;
  }

  waitForBadgeToBeDisplayed = async timeToWait => {
    // const EC = protractor.ExpectedConditions;
    // return browser.wait(EC.visibilityOf(this.elements.badge), timeToWait || 5000);
    return await expect(this.elements.badge).toBeVisible(timeToWait || 5000);
  }

  clickOnLatestNotification = async () => {
    const isOpened = await this.isNotificationMenuOpened();

    if (!isOpened) {
      await this.openNotificationMenu();
    }

    let firstMsg = await this.getNotificationElementByIndex(0);
    return firstMsg.click();
  };

}
