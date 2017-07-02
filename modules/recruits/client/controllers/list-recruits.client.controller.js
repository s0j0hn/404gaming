(function () {
    'use strict';

    angular
        .module('app.recruits')
        .controller('RecruitsListController', RecruitsListController);

    RecruitsListController.$inject = ['RecruitsService', '$stateParams'];

    function RecruitsListController(RecruitsService, $stateParams) {
        var vm = this;

        vm.recruits = RecruitsService.query();

        activate();


        function activate() {
            vm.folders = [
                { name: 'In Votes', folder: 'INVotes', icon: 'fa-clock-o' },
                { name: 'Accepted', folder: 'Accepted', icon: 'fa-check' },
                { name: 'Refused', folder: 'Refused', icon: 'fa-thumbs-down' },
                { name: 'In Validation', folder: 'INValidation', icon: 'fa-legal' }
            ];

            vm.folder = {};
            vm.folder.folder = $stateParams.folder === 'INVotes' ? '' : $stateParams.folder;


        }
    }
}());
