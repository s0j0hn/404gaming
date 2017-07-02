(function () {
    'use strict';

  // Sections controller
    angular
    .module('app.forum')
    .controller('SectionsController', SectionsController);

    SectionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sectionResolve', 'CategoriesService'];

    function SectionsController ($scope, $state, $window, Authentication, section, CategoriesService) {
        var vm = this;

        vm.categories = CategoriesService.query();

        vm.authentication = Authentication;
        vm.section = section;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

    // Remove existing Section
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.section.$remove($state.go('app.forum.sections.list'));
            }
        }

    // Save Section
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.sectionForm');
                return false;
            }

            if (vm.section._id) {
                vm.section.$update(successCallback, errorCallback);
            } else {
                vm.section.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('app.forum.sections.list', {
                    sectionId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
