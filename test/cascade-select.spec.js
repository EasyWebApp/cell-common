import PuppeteerBrowser from 'puppeteer-browser';

import { delay } from 'dom-renderer';

var page;
/**
 * @test {CascadeSelect}
 */
describe('cascade-select', () => {
    before(async () => (page = await PuppeteerBrowser.getPage('.', 'test/')));
    /**
     * @test {CascadeSelect#renderNext}
     */
    it('renders first level', async () => {
        (await page.$eval('path-select', select =>
            select.$('option').map(({ value }) => value)
        )).should.be.eql(['1', '2', '3']);
    });

    /**
     * @test {CascadeSelect#renderNext}
     * @test {CascaseSelect#values}
     */
    it('types first value', async () => {
        await page.type('path-select', '1');

        await page.$eval('path-select', select => select.blur());

        await delay();

        (await page.$eval('path-select', select => ({
            values: select.values,
            next: Array.from(
                select.$('datalist')[1].options,
                ({ value }) => value
            )
        }))).should.be.eql({
            values: ['1'],
            next: ['11', '12', '13']
        });
    });

    /**
     * @test {CascadeSelect#renderNext}
     * @test {CascadeSelect#focus}
     */
    it('types second value', async () => {
        await page.type('path-select', '12');

        await page.$eval('path-select', select => select.blur());

        await delay();

        (await page.$eval('path-select', select => ({
            values: select.values,
            next: Array.from(
                select.$('datalist')[2].options,
                ({ value }) => value
            )
        }))).should.be.eql({
            values: ['1', '12'],
            next: ['121', '122', '123']
        });
    });

    /**
     * @test {CascadeSelect#renderNext}
     * @test {CascadeSelect#focus}
     */
    it('types last value', async () => {
        await page.type('path-select', '123');

        await page.$eval('path-select', select => select.blur());

        await delay();

        (await page.$eval('path-select', select => ({
            values: select.values,
            count: select.$('datalist').length
        }))).should.be.eql({
            values: ['1', '12', '123'],
            count: 3
        });
    });
});
