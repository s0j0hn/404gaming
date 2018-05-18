((() => {
  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$interpolate', '$state'];

  function pageTitle($rootScope, $interpolate, $state) {
    const directive = {
      restrict: 'A',
      link,
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        const applicationCoreTitle = 'MEAN.js';
        const separator = ' - ';
        let stateTitle = applicationCoreTitle + separator;

        toState.name.split('.').forEach((value, index) => {
          stateTitle = stateTitle + value.charAt(0).toUpperCase() + value.slice(1) + separator;
        });
        if (toState.data && toState.data.pageTitle) {
          stateTitle = $interpolate(stateTitle + toState.data.pageTitle + separator)(($state.$current.locals.globals));
        }
        stateTitle = stateTitle.slice(0, 0 - separator.length);
        element.text(stateTitle);
      }
    }
  }
})());
