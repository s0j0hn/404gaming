// Recruits service used to communicate Recruits REST endpoints
(function () {
    'use strict';

    angular
    .module('app.recruits')
    .factory('RecruitsService', RecruitsService);

    RecruitsService.$inject = ['$resource'];

    function RecruitsService($resource) {
        return $resource('api/recruits/:recruitId', {
            recruitId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
