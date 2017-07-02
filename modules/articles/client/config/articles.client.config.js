'use strict';

// Configuring the Articles module
angular.module('app.articles').run(['Menus',
    function (Menus) {
    // Add the articles dropdown item
        Menus.addMenuItem('sidebar', {
            title: 'Articles',
            state: 'app.articles.list',
            iconClass: 'fa fa-newspaper-o ',
            type: 'item',
            roles: ['*']
        });

    // Add the dropdown create item
        Menus.addSubMenuItem('sidebar', 'admin', {
            title: 'Create Articles',
            state: 'app.articles.create',
            roles: ['admin']
        });
    }
]);
