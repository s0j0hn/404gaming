((() => {
  // Users directive used to force lowercase input
  angular
    .module('users')
    .directive('lowercase', lowercase);

  function lowercase() {
    const directive = {
      require: 'ngModel',
      link,
    };

    return directive;

    function link(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(input => (input ? input.toLowerCase() : ''));
      element.css('text-transform', 'lowercase');
    }
  }
})());
