(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$scope', 'Authentication', 'UsersService', 'PasswordValidator'];

    function ChangePasswordController($scope, Authentication, UsersService, PasswordValidator) {
        var vm = this;

        vm.user = Authentication.user;
        vm.changeUserPassword = changeUserPassword;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

        // Change user password
        function changeUserPassword(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

                return false;
            }

            UsersService.changePassword(vm.passwordDetails)
                .then(onChangePasswordSuccess)
                .catch(onChangePasswordError);
        }

        function onChangePasswordSuccess(response) {
            // If successful show success message and clear form
            swal('Success', 'Password changed!', 'success');
            vm.passwordDetails = null;
        }

        function onChangePasswordError(response) {
            // Notification.error({ message: response.data.message, title: '<i class='glyphicon glyphicon-remove'></i> Password change failed!' });
            swal('Cancelled', 'Edit password failed!' + response.data.message, 'error');
        }
    }
}());
