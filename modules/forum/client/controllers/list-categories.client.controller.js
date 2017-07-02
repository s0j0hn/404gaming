(function () {
    'use strict';

    angular
      .module('app.forum')
      .controller('CategoriesListController', CategoriesListController);

    CategoriesListController.$inject = ['CategoriesService', '$window', '$state'];

    function CategoriesListController(CategoriesService, $window, $state) {
        var vm = this;

        vm.categories = CategoriesService.query();

        vm.removeCategorie = function (categorie) {
            if (categorie) {
                if ($window.confirm('Are you sure you want to delete?')) {
                    categorie.$remove($state.go('app.forum.categories.list'));
                    for (var i in vm.categories) {
                        if (vm.categories[i] === categorie) {
                            vm.categories.splice(i, 1);
                        }
                    }
                }
            }
        };
    }
}());
