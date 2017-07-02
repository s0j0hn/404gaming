// Topics service used to communicate Topics REST endpoints
(function () {
    'use strict';

    angular
    .module('app.forum')
    .factory('TopicsService', TopicsService);

    TopicsService.$inject = ['$resource'];

    function TopicsService($resource) {
        return $resource('api/topics/:topicId', {
            topicId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
