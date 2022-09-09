import {Page} from '@playwright/test';
import { EnvUtils } from '../common/EnvUtils';

export class GenericPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  open (path?: string) {
    const pathToOpen = (path || '').replace(/^\/+/, '');
    const baseUrl = EnvUtils.getBaseUrl();
    return this.page.goto(`${baseUrl}/${pathToOpen}`);
  }
}