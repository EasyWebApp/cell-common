import PuppeteerBrowser from 'puppeteer-browser';

import { delay } from 'dom-renderer';

var page;
/**
 * @test {LoadCover}
 */
describe('load-cover', () => {
    before(async () => (page = await PuppeteerBrowser.getPage('.', 'test/')));
    /**
     * @test {LoadCover#open}
     */
    it('opens the Cover by "open" attribute', async () => {
        (await page.evaluate(
            () => document.elementFromPoint(400, 300).tagName
        )).should.not.be.equal('LOAD-COVER');

        await page.$eval('load-cover', cover =>
            cover.setAttribute('open', true)
        );

        await delay();

        (await page.evaluate(
            () => document.elementFromPoint(400, 300).tagName
        )).should.be.equal('LOAD-COVER');
    });
});
