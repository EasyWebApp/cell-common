import TestUtility from '../build/test-utility';

var page;


describe('hint-input',  () => {

    before(async ()  =>  page = await TestUtility.getPage());

    it(
        'Loading',
        ()  =>  page.$eval('hint-input',  input => input.shadowRoot.nodeType)
            .should.be.fulfilledWith( 11 )
    );
});
