(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$scope', 'Authentication'];
    function UserBlockController($scope, Authentication) {
        $scope.authentication = Authentication;
        activate();

        // //////////////

        function activate() {

            $scope.userBlockVisible = true;

            var detach = $scope.$on('toggleUserBlock', function(/* event, args*/) {

                $scope.userBlockVisible = !$scope.userBlockVisible;

            });

            $scope.$on('$destroy', detach);
        }
    }
}());
