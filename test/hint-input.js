import PuppeteerBrowser from 'puppeteer-browser';

var page;


describe('hint-input',  () => {

    before(async ()  =>  page = await PuppeteerBrowser.getPage('.', 'test/'));


    it('Constructor',  async () => {

        (await page.$eval('hint-input',  input => input.shadowRoot.nodeType))
            .should.be.equal( 11 );

        (await page.$eval('hint-input',  input => Array.from(
            input.shadowRoot.children,  child => child.tagName.toLowerCase()
        ))).should.be.eql([
            'style', 'label', 'input', 'datalist', 'slot'
        ]);
    });

    it(
        'Observe attributes',
        () => page.$eval(
            'hint-input',  input => [input.label, input.placeholder, input.value]
        ).should.be.fulfilledWith([
            'Selector', 'selector', ''
        ])
    );

    it(
        'Attribute & Property',
        () => page.$eval(
            'hint-input',  input => [input.type, input.src, input.jsonDes]
        ).should.be.fulfilledWith([
            'text', './hint-input.json', 'json.districts.districts.name'
        ])
    );

    it('Slot options',  async () => {

        (await (page.$eval('hint-input',  input =>
            Array.from(
                input.options,  node => node.nodeType
            ).filter(
                type  =>  (type === 1)
            )
        ))).should.be.eql([1, 1, 1, 1]);

        (await (page.$eval('hint-input',  input => input.list))).should.be.eql([
            'xxx', 'mmm', 'kkk', 'zzz'
        ]);
    });


    it('Change properties',  () => {

        const property = {
            type:         'email',
            label:        'Email',
            placeholder:  'test@example.com'
        };

        return (page.$eval(
            'hint-input',
            (input, data)  =>  Object.assign(input, data)  &&  {
                type:         input.type,
                label:        input.label,
                placeholder:  input.placeholder
            },
            property
        )).should.be.fulfilledWith( property );
    });


    it('Change event',  async () => {

        const change = new Promise(resolve  =>  {

            page.on('console',  message => {

                if (message.type() === 'info')  resolve( message.text() );
            });
        });

        await page.$eval('hint-input',  input =>
            input.onchange = event => console.info( event.target.tagName )
        );

        await page.click('hint-input');

        await page.keyboard.type('x');

        (await page.$eval(
            'hint-input',  input => input.value
        )).should.be.equal('x');

        await page.click('body');

        (await change).should.be.eql('HINT-INPUT');
    });


    it('Load data',  async () => {

        const list = require('./hint-input.json').districts.districts.map(
            item => item.name
        );

        await page.click('hint-input');

        await page.keyboard.type('x');

        (await page.$eval(
            'hint-input',  input => input.list
        )).should.be.eql(
            ['xxx', 'mmm', 'kkk', 'zzz'].concat( list )
        );
    });


    it('Change slot',  async () => {

        await page.$eval('hint-input',  input => input.append(new Option('yyy')));

        (await page.$eval('hint-input',  input => input.list)).should.be.eql([
            'xxx', 'mmm', 'kkk', 'zzz', 'yyy'
        ]);
    });
});
