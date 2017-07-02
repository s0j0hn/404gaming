// Sections service used to communicate Sections REST endpoints
(function () {
    'use strict';

    angular
    .module('app.forum')
    .factory('SectionsService', SectionsService);

    SectionsService.$inject = ['$resource'];

    function SectionsService($resource) {
        return $resource('api/sections/:sectionId', {
            sectionId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
