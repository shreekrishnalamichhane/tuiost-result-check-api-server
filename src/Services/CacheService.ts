import fs from 'fs';
import moment from 'moment';
import { Browser } from 'puppeteer';
import dotenv from "dotenv";
dotenv.config();

import ScraperService from "../Services/ScrapeService";
import Log from '../Helpers/Log';
import { T_CacheResultOptionData, T_ResultOption } from '../@types/types';
let OPTIONS_SCRAPER_RUNNING = false;
const RESULT_URL = process.env.RESULT_URL || 'http://202.51.82.150';
const CACHE_EXPIRY_IN_MINUTES_OPTIONS = 1;
const SCRAPER_TIMEOUT_DURATION = parseFloat(process.env.SCRAPER_TIMEOUT_DURATION || "30");

const CacheService = {
    // Get a options from the cache
    getOptions: async (browser: Browser, key: string) => {
        // Check if the cache file exists, if not return null
        const exists: boolean = fs.existsSync(`./cache/${key}.json`);
        if (!exists) { CacheService.cache(browser, key); return null };

        // Read the cache file and parse the JSON
        const json: string = fs.readFileSync(`./cache/${key}.json`, 'utf8');
        const cache: T_CacheResultOptionData = JSON.parse(json);

        // Check if the cache has expired or doesnot exists, return null
        if (!exists || moment().isAfter(moment(cache.expiredAt))) { CacheService.cache(browser, key) };

        // Else return the cache data
        return cache.data;
    },

    // Set a options value in the cache
    setOptions: (key: string, value: T_CacheResultOptionData) => {
        try {
            // Create the cache directory if it doesnot exists
            const exists: boolean = fs.existsSync(`./cache`);
            if (!exists) fs.mkdirSync(`./cache`);

            // Create the cache file and write the cache data
            fs.writeFileSync(`./cache/${key}.json`, JSON.stringify(value));

            // Return true
            return true;
        } catch (error) {
            // Log the error and return false
            Log.syslog(error);
            return false;
        }
    },

    cache: async (browser: Browser, key: string) => {
        // Check if the scraper is already running
        if (OPTIONS_SCRAPER_RUNNING) {
            Log.syslog('CACHE : Caching is already running...');
            return;
        }

        // Else, start scraping
        Log.syslog('CACHE : Caching process started...');

        // Set the scraper running
        OPTIONS_SCRAPER_RUNNING = true;

        // Set the scrapper running timeout to 15 seconds
        setTimeout(() => {
            if (OPTIONS_SCRAPER_RUNNING) {
                OPTIONS_SCRAPER_RUNNING = false;
                Log.syslog('CACHE : Caching process timed out...');
            }
        }, SCRAPER_TIMEOUT_DURATION * 1000);  // SCRAPER_TIMEOUT_DURATION in seconds

        // Scrape the page
        const page = await ScraperService.scrape(browser, RESULT_URL + '/results/');

        // Get the options from the page
        const options: T_ResultOption[] = await ScraperService.getOptions(page);

        // Close the primary page
        page.close();

        // Prepare the cache data
        const cache: T_CacheResultOptionData = {
            expiredAt: parseInt(moment().add(CACHE_EXPIRY_IN_MINUTES_OPTIONS, 'm').unix().toString() + "000"),
            data: options
        }

        // Set the cache
        CacheService.setOptions(key, cache);
        OPTIONS_SCRAPER_RUNNING = false;

        Log.syslog('CACHE : Caching process completed...');
    }
}

export default CacheService;