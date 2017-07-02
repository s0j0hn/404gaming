'use strict';

// Articles service used for communicating with the comments REST endpoints
angular.module('app.articles').factory('Comments', ['$resource',
    function ($resource) {
        return $resource('api/comments/:commentId', {
            commentId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
