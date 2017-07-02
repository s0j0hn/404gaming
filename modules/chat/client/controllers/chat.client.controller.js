'use strict';

// Create the 'app.chat' controller
angular.module('app.chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
    function ($scope, $location, Authentication, Socket) {

        $scope.authentication = Authentication;
    // Create a messages array
        $scope.messages = [];

    // If user is not signed in then redirect back home
        if (!Authentication.user || $scope.authentication.user.roles.indexOf('banned') >= 0) {
            $location.path('/');
        }

    // Make sure the Socket is connected
        if (!Socket.socket) {
            Socket.connect();
        }

    // Add an event listener to the 'chatMessage' event
        Socket.on('chatMessage', function (message) {
            $scope.messages.unshift(message);
        });

    // Create a controller method for sending messages
        $scope.sendMessage = function () {
      // Create a new message object
            var message = {
                text: this.messageText
            };

      // Emit a 'chatMessage' message event
            Socket.emit('chatMessage', message);

      // Clear the message text
            this.messageText = '';
        };

    // Remove the event listener when the controller instance is destroyed
        $scope.$on('$destroy', function () {
            Socket.removeListener('chatMessage');
        });
    }
]);
