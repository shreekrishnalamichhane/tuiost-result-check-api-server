import { Request, Response } from "express";
import ResponseService from "../Services/ResponseService";
import CacheService from "../Services/CacheService";

import dotenv from "dotenv";
import BrowserService from "../Services/BrowserService";
dotenv.config();

const ResultController = {
    options: async (req: Request, res: Response) => {
        try {
            // Get the cache
            const cache = await CacheService.getOptions(res.locals.browser, 'options');

            // Return the cache
            return ResponseService.response(res, true, 200, "Success", cache);
        }
        catch (error: any) {
            return ResponseService.response(res, false, 400, error.message, null);
        }
    },

    check: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const browser = res.locals.browser;

            const page = await BrowserService.goto(browser, process.env.RESULT_URL + "/results/");

            // Choose the exam
            // await page.select('form select#examinationSelect', data.examId);
            await page.evaluate((examId) => {
                const select = document.querySelector("form select#examinationSelect") as HTMLFormElement;
                if (!select) throw new Error('Select not found');
                select.value = examId;
            }, data.examId);

            // Fill symbol number
            await page.type('form input#symbolNo', data.symbol);

            // Submit the form
            await page.evaluate(() => {
                const form = document.querySelector('form[method="post"]') as HTMLFormElement;
                if (!form) throw new Error('Form not found');
                form.submit();
            });

            // Wait for the page to load
            await page.waitForNavigation({ waitUntil: 'load' });

            // Check if the page has error messages
            const error = await page.evaluate(() => {
                const error = document.querySelector("body > div > div.row.justify-content-md-center > div.col-md-6.col-sm-12 > div.alert.alert-dismissible.alert-danger");
                return error?.textContent?.trim() || null;
            });

            if (error) {
                // Close the page
                page.close();

                return ResponseService.response(res, false, 400, error, null);
            }

            // Get the page content
            const result = await page.evaluate(() => {
                const result = document.querySelector("body > div > div.row.justify-content-md-center > div.col-md-6.col-sm-12 > div.alert.alert-dismissible.alert-light.mt-1");
                return result?.textContent?.trim() || "Not found";
            });

            // Close the page
            page.close();

            return ResponseService.response(res, true, 200, "Success", result);


        } catch (error: any) {
            return ResponseService.response(res, false, 400, error.message, null);
        }
    }
}

export default ResultController;