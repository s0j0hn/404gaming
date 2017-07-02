(function () {
    'use strict';

    angular
        .module('app.forum')
        .controller('ForumListController', ForumListController);

    ForumListController.$inject = ['CategoriesService', 'SectionsService', 'Authentication'];

    function ForumListController(CategoriesService, SectionService, Authentication) {
        var vm = this;
        vm.authentication = Authentication;
        vm.categories = CategoriesService.query();
        vm.sections = SectionService.query();
        vm.nameLimit = 12;
    }
}());
