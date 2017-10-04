(function () {
  'use strict';

  angular
    .module('app.articles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('app.articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('app.articles.list', {
        url: '',
        templateUrl: '/modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm'
      })
      .state('app.articles.view', {
        url: '/:articleId',
        templateUrl: '/modules/articles/client/views/view-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          pageTitle: '{{ articleResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }
}());
