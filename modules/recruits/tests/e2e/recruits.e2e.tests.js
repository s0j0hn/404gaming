'use strict';

describe('Recruits E2E Tests:', function () {
    describe('Test Recruits page', function () {
        it('Should report missing credentials', function () {
            browser.get('http://localhost:3001/recruits');
            expect(element.all(by.repeater('recruit in recruits')).count()).toEqual(0);
        });
    });
});
