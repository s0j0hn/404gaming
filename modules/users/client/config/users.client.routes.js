'use strict';

// Setting up route
angular.module('app.users').config(['$stateProvider', 'RouteHelpersProvider',
    function ($stateProvider, helper) {
        // Users state routing
        $stateProvider
            .state('app.settings', {
                abstract: true,
                url: '/settings',
                templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('app.settings.profile', {
                url: '/profile',
                templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
                controller: 'EditProfileController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Settings'
                }
                // resolve: helper.resolveFor('icons')
            })
            .state('app.settings.password', {
                url: '/password',
                templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
                controller: 'ChangePasswordController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Settings password'
                }
            })
            .state('app.settings.accounts', {
                url: '/accounts',
                templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
                controller: 'SocialAccountsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Settings accounts'
                }
            })
            .state('app.settings.picture', {
                url: '/picture',
                templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
                controller: 'ChangeProfilePictureController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Settings picture'
                },
                resolve: helper.resolveFor('ngImgCrop', 'ngFileUpload')
            })
            .state('page.authentication', {
                abstract: true,
                url: '/authentication',
                templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('SweetAlert2')
            })
            .state('page.authentication.signup', {
                url: '/signup',
                templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Signup'
                }
            })
            .state('page.authentication.signin', {
                url: '/signin?err',
                templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Signin'
                }
            })
            .state('page.password', {
                abstract: true,
                url: '/password',
                template: '<ui-view/>'
            })
            .state('page.password.forgot', {
                url: '/forgot',
                templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
                controller: 'PasswordController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Password forgot'
                }
            })
            .state('page.password.reset', {
                abstract: true,
                url: '/reset',
                template: '<ui-view/>'
            })
            .state('page.password.reset.invalid', {
                url: '/invalid',
                templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
                data: {
                    pageTitle: 'Password reset invalid'
                }
            })
            .state('page.password.reset.success', {
                url: '/success',
                templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
                data: {
                    pageTitle: 'Password reset success'
                }
            })
            .state('page.password.reset.form', {
                url: '/:token',
                templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
                controller: 'PasswordController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Password reset form'
                }
            })
            .state('app.profile', {
                abstract: true,
                url: '/profile',
                template: '<ui-view/>',
                data: {
                    roles: ['user', 'team', 'admin']
                }
            })
            .state('app.profile.user', {
                url: '/users/:userId',
                templateUrl: '/modules/users/client/views/profile.client.view.html',
                controller: 'UserController',
                controllerAs: 'vm',
                resolve: {
                    userResolve: getUser
                },
                data: {
                    roles: ['user', 'team', 'admin']
                }
            });

        getUser.$inject = ['$stateParams', 'AdminService'];

        function getUser($stateParams, AdminService) {
            return AdminService.get({
                userId: $stateParams.userId
            }).$promise;
        }
    }
]);
