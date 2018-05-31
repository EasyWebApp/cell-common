import TestUtility from '../build/test-utility';

var page;
var fs = require('fs');


describe('hint-input',  () => {

    before(async ()  =>  page = await TestUtility.getPage());

    it('Constructor', async () => {
        (await  page.$eval('hint-input', input => input.shadowRoot.nodeType )).should.be.equal( 11 );
        //
    });
    it('observedAttributes', async () => {
        (await   page.$eval('hint-input', ((input) => [input.label,input.placeholder,input.value]))).should.be.eql(
            ['Selector','selector','']);
    });
    it('Attribute',async () =>{
        (await (page.$eval('hint-input', input => input.type))).should.be.eql('text');

        (await (page.$eval('hint-input', input => input.src))).should.be.eql('./hint-input.json');

        (await (page.$eval('hint-input', input => input.jsonDes))).should.be.eql('json.districts.districts.name');

        (await (page.$eval('hint-input', input => {
            return Array.from(input.options).map( (x) => x.value );
        }))).should.be.eql(['xxx','mmm','kkk','zzz']);

        (await (page.$eval('hint-input', input => input.list))).should.be.eql(['xxx','mmm','kkk','zzz']);

        (await (page.$eval('hint-input', (input) => {
            input.label = 'email';
            return input.label;
        }))).should.be.eql('email');

        (await (page.$eval('hint-input', (input) => {
            input.label = 'labelTest';
            return input.label;
        }))).should.be.eql('labelTest');

        (await (page.$eval('hint-input', (input) => {
            input.placeholder = 'placeholderTest';
            return input.placeholder;
        }))).should.be.eql('placeholderTest');

        (await (page.$eval('hint-input', (input) => {
            return Array.from(input.children).map((x) => x.value);
        }))).should.be.eql(['xxx','mmm','kkk','zzz']);
    });

    //这里的测试是通过监听value的值是否正确来判断时间触发是否正确的。
    it('eventChange', async () => {
        await page.click('hint-input');

        await page.keyboard.type('x');

        await page.click('body');

        (await  page.$eval('hint-input', ((input) => {
            return input.value;
        }))).should.be.eql('x');
    });

    //测试load函数
    it('load', async () => {
        let jsonFile = JSON.parse( (await(fs.readFileSync('test/hint-input.json'))) );

        let arr = await jsonFile['districts']['districts'].map(x => x.name);

        await page.click('hint-input');

        await page.keyboard.type('x');

        await page.click('body');

        (await  page.$eval('hint-input', ((input) => {
            return input.list;
        }))).should.be.eql(['xxx','mmm','kkk','zzz'].concat(arr));
    });
});
