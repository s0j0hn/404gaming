(function () {
    'use strict';

    angular.module('core.admin').run(['Menus',
        function (Menus) {

            Menus.addMenuItem('sidebar', {
                title: 'Admin',
                state: 'admin',
                type: 'dropdown',
                iconClass: 'fa fa-wrench',
                roles: ['admin']
            });

        }
    ]);
}());
