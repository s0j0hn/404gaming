(function () {
  'use strict';

  angular
    .module('app.users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notify'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notify) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        // Notify.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Notify.alert('Edit profile successful!', { status: 'success' });
        Authentication.user = response;
      }, function (response) {
        // Notify.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
        Notify.alert(response.data.message, { status: 'success' });
      });
    }
  }
}());
