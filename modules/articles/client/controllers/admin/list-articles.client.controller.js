(function () {
  'use strict';

  angular
    .module('app.articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['ArticlesService'];

  function ArticlesAdminListController(ArticlesService) {
    var vm = this;

    vm.articles = ArticlesService.query();
  }
}());
