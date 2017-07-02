(function () {
    'use strict';

    // Setting up route
    angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RouteHelpersProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, helper) {

            // Redirect to 404 when route not found
            $urlRouterProvider.otherwise(function ($injector) {
                $injector.get('$state').transitionTo('not-found', null, {
                    location: false
                });
            });

            // Set the following to true to enable the HTML5 Mode
            // You may have to set <base> tag in index and a routing configuration in your server
            $locationProvider.html5Mode(false);

            // default route
            $urlRouterProvider.otherwise('/articles');

            // Home state routing
            $stateProvider
                .state('app', {
                    // url: '/',
                    abstract: true,
                    templateUrl: 'modules/core/client/views/core.client.view.html',
                    resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'slimscroll', 'classyloader', 'whirl', 'SweetAlert2')
                })
                // .state('app.home', {
                //   url: '/home',
                //   templateUrl: 'modules/core/client/views/home.client.view.html'
                // })
                .state('page.not-found', {
                    url: '/not-found',
                    templateUrl: 'modules/core/client/views/404.client.view.html',
                    data: {
                        ignoreState: true
                    },
                    resolve: helper.resolveFor('icons')
                })
                .state('app.bad-request', {
                    url: '/bad-request',
                    templateUrl: 'modules/core/client/views/400.client.view.html',
                    data: {
                        ignoreState: true
                    }
                })
                .state('app.forbidden', {
                    url: '/forbidden',
                    templateUrl: 'modules/core/client/views/403.client.view.html',
                    data: {
                        ignoreState: true
                    },
                    resolve: helper.resolveFor('icons')
                });
        }
    ]);

}());

// (function () {
//
// }());
