'use strict';

angular
    .module('core')
    .config(coreConfig);

coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$animateProvider', 'vcRecaptchaServiceProvider'];
function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider, vcRecaptchaServiceProvider) {

    vcRecaptchaServiceProvider.setSiteKey('6LdogRsUAAAAAOZgwgIXB7QTPdjRNgkrOXP2WH0c');
    vcRecaptchaServiceProvider.setTheme('light');
    // vcRecaptchaServiceProvider.setStoken('');
    vcRecaptchaServiceProvider.setSize('compact');
    vcRecaptchaServiceProvider.setType('image');
    vcRecaptchaServiceProvider.setLang('fr');

    var core = angular.module('core');
    // registering components after bootstrap
    core.controller = $controllerProvider.register;
    core.directive = $compileProvider.directive;
    core.filter = $filterProvider.register;
    core.factory = $provide.factory;
    core.service = $provide.service;
    core.constant = $provide.constant;
    core.value = $provide.value;

    // Disables animation on items with class .ng-no-animation
    $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);

    // Improve performance disabling debugging features
    // $compileProvider.debugInfoEnabled(false);

}
