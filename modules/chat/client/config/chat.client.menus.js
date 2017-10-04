(function () {
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('sidebar', {
      title: 'Chat',
      state: 'app.chat',
      iconClass: 'fa fa-weixin',
      type: 'item',
      roles: ['user', 'admin', 'team']
    });
  }
}());
