(function () {
    'use strict';

    angular
        .module('app.notifications')
        .controller('NotificationsListController', NotificationsListController);

    NotificationsListController.$inject = ['NotificationsService', 'Authentication'];

    function NotificationsListController(NotificationsService, Authentication) {
        var vm = this;
        vm.authentication = Authentication;

        vm.notifications = NotificationsService.query();
    }
}());
