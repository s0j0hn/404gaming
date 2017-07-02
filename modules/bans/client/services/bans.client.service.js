// Bans service used to communicate Bans REST endpoints
(function () {
    'use strict';

    angular
    .module('app.bans')
    .factory('BansService', BansService);

    BansService.$inject = ['$resource'];

    function BansService($resource) {
        return $resource('api/bans/:banId', {
            banId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
