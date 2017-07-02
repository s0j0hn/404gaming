'use strict';

// Articles service used for communicating with the articles REST endpoints
angular.module('app.articles').factory('ArticlesService', ['$resource',
    function ($resource) {
        return $resource('/api/articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
