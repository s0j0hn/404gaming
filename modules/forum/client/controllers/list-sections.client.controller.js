(function () {
    'use strict';

    angular
    .module('app.forum')
    .controller('SectionsListController', SectionsListController);

    SectionsListController.$inject = ['SectionsService', '$state', '$window'];

    function SectionsListController(SectionsService, $state, $window) {
        var vm = this;

        vm.sections = SectionsService.query();

        vm.removeSection = function (section) {
            if (section) {
                if ($window.confirm('Are you sure you want to delete?')) {
                    section.$remove($state.reload());
                }
            }
        };
    }
}());
