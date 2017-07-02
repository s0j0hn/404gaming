(function () {
    'use strict';

    angular
        .module('app.bans')
        .controller('BansListController', BansListController);

    BansListController.$inject = ['BansService', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function BansListController(BansService, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        vm.bans = BansService.query();
        vm.getSelected = getSelected;

        function getSelected() {
            var banList = [];
            return banList;
        }

        function deleteAll(banList) {
            if ($window.confirm('Are you sure you want to delete?')) {
                for (var i = 0; i > banList.length(); i++) {
                    banList[i].$remove();
                }
                $state.go('app.bans.list');
            }
        }


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
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable()

        ];
    }
}());
