(function () {
  'use strict';

  angular
    .module('app.users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  // Configuring the Users module
  function menuConfig(Menus) {


    Menus.addSubMenuItem('sidebar', 'admin', {
      title: 'Manage Users',
      state: 'app.admin.users'
    });
  }
}());
