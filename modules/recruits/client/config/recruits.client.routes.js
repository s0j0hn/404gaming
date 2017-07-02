(function () {
    'use strict';

    angular
        .module('app.recruits')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('app.recruits', {
                abstract: true,
                url: '/recruits',
                template: '<ui-view/>'
            })
            .state('app.recruits.admin', {
                url: '/folder/:folder',
                templateUrl: 'modules/recruits/client/views/list-recruits.client.view.html',
                controller: 'RecruitsListController',
                controllerAs: 'vm',
                data: {
                    roles: ['admin'],
                    pageTitle: 'Recruits List'
                }
            })
            .state('app.recruits.view', {
                url: '/:recruitId',
                templateUrl: 'modules/recruits/client/views/view-recruit.client.view.html',
                controller: 'RecruitsController',
                controllerAs: 'vm',
                resolve: {
                    recruitResolve: getRecruit
                },
                data: {
                    pageTitle: 'Recruit {{ recruitResolve.name }}'
                }
            })
            .state('app.recruits.create', {
                url: '/create',
                templateUrl: 'modules/recruits/client/views/form-recruit.client.view.html',
                controller: 'RecruitsController',
                controllerAs: 'vm',
                resolve: {
                    recruitResolve: newRecruit
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Recruits Create'
                }
            })
            .state('app.recruits.edit', {
                url: '/:recruitId/edit',
                templateUrl: 'modules/recruits/client/views/form-recruit.client.view.html',
                controller: 'RecruitsController',
                controllerAs: 'vm',
                resolve: {
                    recruitResolve: getRecruit
                },
                data: {
                    roles: ['admin', 'user', 'team'],
                    pageTitle: 'Edit Recruit {{ recruitResolve.name }}'
                }
            });

    }

    getRecruit.$inject = ['$stateParams', 'RecruitsService'];

    function getRecruit($stateParams, RecruitsService) {
        return RecruitsService.get({
            recruitId: $stateParams.recruitId
        }).$promise;
    }

    newRecruit.$inject = ['RecruitsService'];

    function newRecruit(RecruitsService) {
        return new RecruitsService();
    }
}());
