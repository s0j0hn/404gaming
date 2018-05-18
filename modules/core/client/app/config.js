(((window) => {
  const applicationModuleName = 'mean';

  window.ApplicationConfiguration = {
    applicationEnvironment: window.env,
    applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngMessages', 'ui.router', 'ui.bootstrap', 'angularFileUpload', 'ui-notification'],
    registerModule,
  };

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config((NotificationProvider) => {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom',
    });
  });
})(window));
