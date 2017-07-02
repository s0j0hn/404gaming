(function () {
    'use strict';

  // Recruits controller
    angular
    .module('app.recruits')
    .controller('RecruitsController', RecruitsController);

    RecruitsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'recruitResolve'];

    function RecruitsController ($scope, $state, $window, Authentication, recruit) {
        var vm = this;

        vm.authentication = Authentication;
        vm.recruit = recruit;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

    // Remove existing Recruit
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.recruit.$remove($state.go('app.recruits.admin'));
            }
        }

    // Save Recruit
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.recruitForm');
                return false;
            }

            if (vm.recruit._id) {
                vm.recruit.$update(successCallback, errorCallback);
            } else {
                vm.recruit.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('app.recruits.view', {
                    recruitId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
