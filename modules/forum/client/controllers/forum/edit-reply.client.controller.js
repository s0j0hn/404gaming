(function () {
    'use strict';

    // Topics controller
    angular
        .module('app.forum')
        .controller('EditReplyController', EditReplyController);

    EditReplyController.$inject = ['$scope', '$stateParams', '$state', '$window', 'replyResolve'];

    function EditReplyController ($scope, $stateParams, $state, $window, reply) {
        var vm = this;

        vm.reply = reply;
        vm.saveReplyEdited = saveReplyEdited;

        function saveReplyEdited(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.replyForm');
                return false;
            }

            if (vm.reply._id) {
                vm.reply.$update(successCallback, errorCallback);
            } else {
                vm.reply.topic = $stateParams.topicId;
                vm.reply.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('app.forum.sections.topics.view', { sectionId: $stateParams, topicId: $stateParams.topicId });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
