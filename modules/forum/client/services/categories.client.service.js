// Categories service used to communicate Categories REST endpoints
(function () {
    'use strict';

    angular
    .module('app.forum')
    .factory('CategoriesService', CategoriesService);

    CategoriesService.$inject = ['$resource'];

    function CategoriesService($resource) {
        return $resource('api/categories/:categorieId', {
            categorieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
