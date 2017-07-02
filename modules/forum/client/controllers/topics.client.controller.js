(function () {
    'use strict';

    // Topics controller
    angular
        .module('app.forum')
        .controller('TopicsController', TopicsController);

    TopicsController.$inject = ['$scope', '$stateParams', '$state', '$window', 'Authentication', 'topicResolve', 'ReplysService', 'replyResolve', '$filter'];

    function TopicsController ($scope, $stateParams, $state, $window, Authentication, topic, ReplysService, reply, $filter) {
        var vm = this;

        vm.reply = reply;
        vm.saveReply = saveReply;
        vm.authentication = Authentication;
        vm.topic = topic;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;

        if (vm.topic._id) {
            ReplysService.query({ topicId: $stateParams.topicId }, function (data) {
                vm.replys = data;
                vm.buildPager();
            });
        }


        function buildPager() {
            vm.pagedItems = [];
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.figureOutItemsToDisplay();
        }

        function figureOutItemsToDisplay() {
            vm.filteredItems = $filter('filter')(vm.replys, {
                $: vm.search
            });
            vm.filterLength = vm.filteredItems.length;
            var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
            var end = begin + vm.itemsPerPage;
            vm.pagedItems = vm.filteredItems.slice(begin, end);
        }

        function pageChanged() {
            vm.figureOutItemsToDisplay();
        }
        /* vm.banUser = function (user) {
            user.roles = ['banned'];
            user.$update(function () {
                $state.reload();
            }, function (errorResponse) {
                //Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
            });
        };*/

        function saveReply(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.sectionForm');
                return false;
            }

            if (vm.reply._id) {
                vm.reply.$update(successCallback, errorCallback);
            } else {
                vm.reply.topic = $stateParams.topicId;
                vm.reply.section = $stateParams.sectionId;
                vm.reply.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.reload();
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        vm.removeReply = function (reply) {
            if (reply) {
                if ($window.confirm('Are you sure you want to delete?')) {
                    reply.$remove($state.reload());
                }
            }
        };

        // Remove existing Reply
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.topic.$remove($state.go('app.forum.sections.topics.list', { sectionId: $stateParams.sectionId }));
            }
        }

        // Save Reply
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.topicForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.topic._id) {
                vm.topic.$update(successCallback, errorCallback);
            } else {
                vm.topic.section = $stateParams.sectionId;
                vm.topic.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('app.forum.sections.topics.list', {
                    topicId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        vm.unblockTopic = function () {
            if (vm.topic._id) {
                vm.topic.blocked = false;
                vm.topic.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.reload();
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };

        vm.blockTopic = function () {
            if (vm.topic._id) {
                vm.topic.blocked = true;
                vm.topic.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.reload();
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };
    }
}());
