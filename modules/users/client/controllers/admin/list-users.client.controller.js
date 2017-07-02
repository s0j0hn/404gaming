(function () {
    'use strict';

    angular
        .module('app.users.admin')
        .controller('UserListController', UserListController);

    UserListController.$inject = ['$scope', '$filter', 'AdminService', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function UserListController($scope, $filter, AdminService, $state, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;
        vm.banUser = banUser;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                { extend: 'copy', className: 'btn-sm' },
                { extend: 'csv', className: 'btn-sm' },
                { extend: 'excel', className: 'btn-sm', title: 'XLS-File' },
                { extend: 'pdf', className: 'btn-sm', title: $('title').text() },
                { extend: 'print', className: 'btn-sm' }
            ]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(7).notSortable(),
            DTColumnDefBuilder.newColumnDef(8).notSortable()

        ];


        AdminService.query(function (data) {
            vm.users = data;
            vm.buildPager();
        });


        function buildPager() {
            vm.pagedItems = [];
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.figureOutItemsToDisplay();
        }

        function figureOutItemsToDisplay() {
            vm.filteredItems = $filter('filter')(vm.users, {
                $: vm.search
            });
            vm.filterLength = vm.filteredItems.length;
            var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
            var end = begin + vm.itemsPerPage;
            vm.pagedItems = vm.filteredItems.slice(begin, end);
        }

        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }

        function banUser(user) {
            user.roles = ['banned'];
            user.rank = 'Banned';
            user.$update(function () {
                $state.reload();
            }, function (errorResponse) {
                // Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
            });
        }
    }
}());
