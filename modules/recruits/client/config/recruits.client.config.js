'use strict';

// Configuring the bans module
angular.module('app.recruits').run(['Menus',
    function (Menus) {

        Menus.addMenuItem('sidebar', {
            title: 'Recruitment',
            state: 'app.recruits.create',
            iconClass: 'fa  fa-pencil-square-o',
            type: 'item',
            roles: ['user', 'team', 'admin']
        });


        Menus.addSubMenuItem('sidebar', 'admin', {
            title: 'Recruitment',
            state: 'app.recruits.admin',
            roles: ['admin']
        });
    }
]);

