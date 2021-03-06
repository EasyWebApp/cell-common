import PuppeteerBrowser from 'puppeteer-browser';

import { delay } from 'dom-renderer';

var page;
/**
 * @test {TextEditor}
 */
describe('text-editor', () => {
    before(async () => (page = await PuppeteerBrowser.getPage('.', 'test/')));
    /**
     * @test {TextEditor#connectedCallback}
     * @test {TextEditor#onInput}
     */
    it('gets Input\'s value', async () => {
        await page.type('text-editor [contenteditable]', '# Test\nexample');

        await delay();

        const HTML = await page.$eval(
            'text-editor textarea',
            input => input.value
        );

        HTML.replace(/[\r\n]+/g, '\n').should.be.equal('# Test\nexample');
    });

    /**
     * @test {TextEditor#insertMedia}
     */
    it('inserts Media files', async () => {
        const URI = await page.$eval('text-editor', editor => {
            editor.insertMedia({
                files: [
                    self['web-cell'].blobFrom('data:image/svg+xml,<svg></svg>')
                ]
            });

            return editor.media[0].src;
        });

        URI.should.match(/^blob:http:\/\/\S+$/);
    });
});
