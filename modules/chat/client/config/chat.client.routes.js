'use strict';

// Configure the 'app.chat' module routes
angular.module('app.chat').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
      .state('app.chat', {
          url: '/chat',
          templateUrl: 'modules/chat/client/views/chat.client.view.html',
          data: {
              roles: ['user', 'team', 'admin']
          }
      });
    }
]);
