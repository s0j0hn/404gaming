(function () {
    'use strict';

    angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', 'NotificationsService',
        function ($scope, $state, Authentication, Menus, NotificationsService) {
            // Expose view variables
            $scope.$state = $state;
            $scope.authentication = Authentication;

            $scope.notifications = getNotifications();
            $scope.notifLimit = 4;
            $scope.seeNotification = function () {
                // for (var i = 1; i < $scope.notifications.length; i++) {
                //     if ($scope.notifications[i]._id && $scope.notifications[i].seen === false) {
                //         $scope.notifications[i].seen = true;
                //         $scope.notifications[i].$update();
                //     }
                // }
            };

            $scope.getNotifLink = function(notification) {
                if (notification.type === 'new_reply') {
                    return $state.href('app.forum.sections.topics.view', { sectionId: notification.section, topicId: notification.topic });
                }

            };

            function getNotifications() {
                if ($scope.authentication.user) {
                    return NotificationsService.query({ user: $scope.authentication.user._id });
                }
            }

            $scope.removeNotif = function (notification) {
                notification.$remove($state.reload());
            };

            // Get the topbar menu
            $scope.menu = Menus.getMenu('topbar');

            // Toggle the menu items
            $scope.isCollapsed = false;
            $scope.toggleCollapsibleMenu = function () {
                $scope.isCollapsed = !$scope.isCollapsed;
            };

            // Collapsing the menu after navigation
            $scope.$on('$stateChangeSuccess', function () {
                $scope.isCollapsed = false;
            });
        }
    ]);
}());
