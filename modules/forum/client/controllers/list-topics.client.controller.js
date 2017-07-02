(function () {
    'use strict';

    angular
        .module('app.forum')
        .controller('TopicsListController', TopicsListController);

    TopicsListController.$inject = ['SectionsService', 'TopicsService', '$stateParams', 'Authentication', '$window', '$state', 'ngDialog', 'tpl', '$filter'];

    function TopicsListController(SectionsService, TopicsService, $stateParams, Authentication, $window, $state, ngDialog, tpl, $filter) {
        var vm = this;

        vm.authentication = Authentication;
        vm.buildPager = buildPager;
        vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
        vm.pageChanged = pageChanged;
        vm.sectionId = $stateParams.sectionId;
        vm.template = tpl.path;
        vm.sections = SectionsService.query();

        TopicsService.query({ 'sectionId': vm.sectionId }, function (data) {
            vm.topics = data;
            vm.buildPager();
        });

        /* vm.unblockTopic = function (topic) {
            if (topic._id) {
                topic.blocked = false;
                topic.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.reload();
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };*/

        vm.blockTopic = function (topic) {
            if (topic._id && !topic.blocked) {
                topic.blocked = true;
                topic.$update(successCallback, errorCallback);
            } else {
                topic.blocked = false;
                topic.$update(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.reload();
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };

        vm.openMoveDialog = function (topic) {
            ngDialog.open({ template: vm.template,
                className: 'ngdialog-theme-default',
                controller: function() {
                    var vm = this;
                    vm.topic = topic;
                    vm.sectionId = topic.section._id;

                    vm.moveTopic = function (isValid) {
                        if (!isValid) {
                            $scope.$broadcast('show-errors-check-validity', 'vm.form.moveForm');
                            return false;
                        }

                        // TODO: move create/update logic to service
                        if (vm.topic._id) {
                            vm.topic.moved = true;
                            vm.topic.oldSectionId = vm.sectionId;
                            vm.topic.$update(successCallback, errorCallback);
                        }

                        function successCallback(res) {
                            $state.reload();
                        }

                        function errorCallback(res) {
                            vm.error = res.data.message;
                        }
                    };
                },
                controllerAs: 'vm',
                data: vm.sections,
                scope: 'vm'
            });
        };

        vm.removeTopic = function (topic) {
            if (topic) {
                if ($window.confirm('Are you sure you want to delete?')) {
                    topic.$remove($state.reload());
                }
            }
        };


        function buildPager() {
            vm.pagedItems = [];
            vm.itemsPerPage = 10;
            vm.currentPage = 1;
            vm.figureOutItemsToDisplay();
        }

        function figureOutItemsToDisplay() {
            vm.filteredItems = $filter('filter')(vm.topics, {
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
    }
}());
