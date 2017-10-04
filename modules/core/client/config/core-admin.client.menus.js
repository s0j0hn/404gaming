(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('sidebar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      iconClass: 'fa fa-wrench',
      roles: ['admin']
    });
  }
}());
