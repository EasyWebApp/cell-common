const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false,slowMo: 250});
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    await page.screenshot({path: 'example.png'});
    await page.evaluate(() => console.log(myList));
    await browser.close();
})();
