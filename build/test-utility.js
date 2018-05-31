'use strict';

const WebServer = require('koapache'), Puppeteer = require('puppeteer');

var server, browser, page;


export default  class TestUtility {

    static async getServer() {

        return  server  ||  (server = await WebServer());
    }

    static async getBrowser() {

        return  browser || (
            browser = await Puppeteer.launch({
                // slowMo: 250,
                headless:
                    (! process.env.npm_lifecycle_script.includes('--inspect'))
            })
        );
    }

    static async getPage() {

        if ( page )  return page;

        page = await (await TestUtility.getBrowser()).newPage();

        const server = await TestUtility.getServer();

        await page.goto(`http://${server.address}:${server.port}/test/`);

        return page;
    }
}
