(function () {
    'use strict';

    angular
        .module('app.forum')
        .controller('ReplysListController', ReplysListController);

    ReplysListController.$inject = ['ReplysService', '$window', '$state', '$stateParams'];

    function ReplysListController(ReplysService, $window, $state, $stateParams) {
        var vm = this;

        vm.topicId = $stateParams.topicId;
        vm.replys = ReplysService.query({ topicId: vm.topicId });

    }
}());
