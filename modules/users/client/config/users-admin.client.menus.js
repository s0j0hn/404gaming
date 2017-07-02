'use strict';

// Configuring the Articles module
angular.module('app.users.admin').run(['Menus',
    function (Menus) {
        Menus.addSubMenuItem('sidebar', 'admin', {
            title: 'Manage Users',
            state: 'app.admin.users'
        });
    }
]);
