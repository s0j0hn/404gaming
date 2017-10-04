(function () {
  'use strict';

  angular
    .module('core')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

  function routeConfig($stateProvider, $urlRouterProvider, helper) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('app.articles.list', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('app', {
      // url: '/',
      abstract: true,
      templateUrl: 'modules/core/client/views/core.client.view.html',
      resolve: helper.resolveFor('modernizr', 'icons', 'animo')
    })
    .state('app.home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('app.not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
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
      }
    });
  }
}());
