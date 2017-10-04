(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('app.users')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());
