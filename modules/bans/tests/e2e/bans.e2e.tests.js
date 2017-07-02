'use strict';

describe('Bans E2E Tests:', function () {
    describe('Test Bans page', function () {
        it('Should report missing credentials', function () {
            browser.get('http://localhost:3001/bans');
            expect(element.all(by.repeater('ban in bans')).count()).toEqual(0);
        });
    });
});
