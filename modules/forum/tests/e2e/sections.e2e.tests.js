'use strict';

describe('Sections E2E Tests:', function () {
    describe('Test Sections page', function () {
        it('Should report missing credentials', function () {
            browser.get('http://localhost:3001/sections');
            expect(element.all(by.repeater('section in sections')).count()).toEqual(0);
        });
    });
});
