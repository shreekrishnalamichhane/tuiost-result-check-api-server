import { Page } from 'puppeteer';
import BrowerService from './BrowserService';
import { T_ResultOption } from '../@types/types';

const ScraperService = {
    scrape: async (browser: any, url: string) => {
        const page: Page = await BrowerService.goto(browser, url);
        return page;
    },

    getOptions: async (page: any) => {
        const options: T_ResultOption[] = await page.evaluate(() => {
            const options: T_ResultOption[] = [];
            const optionElements = document.querySelectorAll('#examinationSelect option:not([disabled])');
            optionElements.forEach((option: any) => {
                options.push({ id: option.value, name: option.textContent });
            });
            return options;
        });
        return options;
    },
};

export default ScraperService;