'use strict';

var applicationModuleName = 'mean';

// Add a new vertical module
var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
};

var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: [
        'ngAnimate',
        'ngResource',
        'ngMessages',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'angularFileUpload',
        'ngRoute',
        'ngStorage',
        'ngTouch',
        'ngCookies',
        'pascalprecht.translate',
        'oc.lazyLoad',
        'cfp.loadingBar',
        'ngSanitize',
        'tmh.dynamicLocale',
        'textAngular',
        'vcRecaptcha'
    ],
    registerModule: registerModule
};

window.ApplicationConfiguration = service;
