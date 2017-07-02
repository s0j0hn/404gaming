'use strict';

// Configuring the bans module
angular.module('app.forum').run(['Menus',
    function (Menus) {

        Menus.addMenuItem('sidebar', {
            title: 'Forum',
            state: 'app.forum.list',
            iconClass: 'fa  fa-comments-o',
            type: 'item',
            roles: ['user', 'team', 'admin']
        });


        Menus.addSubMenuItem('sidebar', 'admin', {
            title: 'List Categories',
            state: 'app.forum.categories.list',
            roles: ['admin']
        });

        Menus.addSubMenuItem('sidebar', 'admin', {
            title: 'List Sections',
            state: 'app.forum.sections.list',
            roles: ['admin']
        });
    }
]);

