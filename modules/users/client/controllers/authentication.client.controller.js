(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('AuthenticationController', AuthenticationController);

    AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$window', 'Authentication', 'PasswordValidator'];

    function AuthenticationController($scope, $state, UsersService, $window, Authentication, PasswordValidator) {
        var vm = this;

        vm.authentication = Authentication;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
        vm.signup = signup;
        vm.signin = signin;
        vm.callOauthProvider = callOauthProvider;
        vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
        vm.setWidgetId = setWidgetId;
        vm.setResponse = setResponse;
        vm.cbExpiration = cbExpiration;
        vm.widgetId = null;
        vm.recaptchatResponse = null;

        // Get an eventual error defined in the URL query string:
        // if ($location.search().err) {
        // Notification.error({ message: $location.search().err });
        // }

        // If user is signed in then redirect back app.articles.list
        if (vm.authentication.user) {
            $state.go('app.articles.list');
        }

        function setWidgetId(widgetId) {
            vm.widgetId = widgetId;
        }


        function setResponse(response) {
            vm.recaptchatResponse = response;
        }

        function cbExpiration() {

        }

        function signup(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

                return false;
            }

            UsersService.userSignup(vm.credentials, vm.recaptchatResponse)
                .then(onUserSignupSuccess)
                .catch(onUserSignupError);
        }

        function signin(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

                return false;
            }

            UsersService.userSignin(vm.credentials)
                .then(onUserSigninSuccess)
                .catch(onUserSigninError);
        }

        // OAuth provider request
        function callOauthProvider(url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        }

        // Authentication Callbacks

        function onUserSignupSuccess(response) {
            // If successful we assign the response to the global user model
            vm.authentication.user = response;
            // Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
            // And redirect to the previous or app.articles.list page
            $state.go($state.previous.state.name || 'app.articles.list', $state.previous.params);
            swal('Success', 'Welcome  ' + response.username, 'success');
        }

        function onUserSignupError(response) {
            // Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
            swal('Error', response.data.message, 'error');
        }

        function onUserSigninSuccess(response) {
            // If successful we assign the response to the global user model
            vm.authentication.user = response;
            // Notification.info({ message: 'Welcome ' + response.firstName });
            // And redirect to the previous or app.articles.list page
            $state.go($state.previous.state.name || 'app.articles.list', $state.previous.params);
            swal('Success', 'Welcome  ' + response.username, 'success');
        }

        function onUserSigninError(response) {
            // Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
            swal('Error', response.data.message, 'error');
        }
    }
}());
