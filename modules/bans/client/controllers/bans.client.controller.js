(function () {
    'use strict';

  // Bans controller
    angular
    .module('app.bans')
    .controller('BansController', BansController);

    BansController.$inject = ['$scope', '$state', '$window', 'Authentication', 'banResolve'];

    function BansController ($scope, $state, $window, Authentication, ban) {
        var vm = this;

        vm.authentication = Authentication;
        vm.ban = ban;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

    // Remove existing Ban
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.ban.$remove($state.go('app.bans.list'));
            }
        }

    // Save Ban
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.banForm');
                return false;
            }

            if (vm.ban._id) {
                vm.ban.$update(successCallback, errorCallback);
            } else {
                vm.ban.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('app.bans.list', {
                    banId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
