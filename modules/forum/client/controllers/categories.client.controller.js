(function () {
    'use strict';

  // Categories controller
    angular
    .module('app.forum')
    .controller('CategoriesController', CategoriesController);

    CategoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'categorieResolve'];

    function CategoriesController ($scope, $state, $window, Authentication, categorie) {
        var vm = this;

        vm.authentication = Authentication;
        vm.categorie = categorie;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

    // Remove existing Categorie
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.categorie.$remove($state.go('app.forum.categories.list'));
            }
        }

    // Save Categorie
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.categorieForm');
                return false;
            }

      // TODO: move create/update logic to service
            if (vm.categorie._id) {
                vm.categorie.$update(successCallback, errorCallback);
            } else {
                vm.categorie.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('app.forum.categories.list');
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
