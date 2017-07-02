'use strict';

// Articles controller
angular.module('app.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ArticlesService', 'Comments',
    function ($scope, $stateParams, $location, Authentication, Articles, Comments) {
        $scope.authentication = Authentication;
        $scope.articleId = $stateParams.articleId;
        $scope.article = null;
        $scope.articlePreview = null;

    // Create new Comment
        $scope.create_comment = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'commentForm');

                return false;
            }

      // Create new Comment object
            var comment = new Comments({
                content: this.content,
                article: $scope.articleId
            });

      // Redirect after save
            comment.$save(function (response) {
                $location.path('/articles/' + $scope.articleId);

        // Clear form fields
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    // Remove existing Comment
        $scope.remove_comment = function (comment) {
            if (comment) {
                comment.$remove();

                for (var i in $scope.comments) {
                    if ($scope.comments[i] === comment) {
                        $scope.comments.splice(i, 1);
                    }
                }
            } else {
                $scope.comment.$remove(function () {
                    $location.path('comments');
                });
            }
        };

    // Update existing Comment
        $scope.update_comment = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'commentForm');

                return false;
            }

            var comment = $scope.comment;

            comment.$update(function () {
                $location.path('/articles/' + $scope.articleId);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    // Find a list of Comments
        $scope.find_comments = function () {
            $scope.comments = Comments.query({ 'articleId': $scope.articleId });
        };

    // Find existing Comment
        $scope.findOne_comment = function () {
            $scope.comment = Comments.get({
                commentId: $stateParams.commentId
            });
        };


    // Create new Article
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'articleForm');

                return false;
            }

      // Create new Article object
            var article = new Articles({
                title: this.title,
                content: this.content
            });

      // Redirect after save
            article.$save(function (response) {
                $location.path('articles/' + response._id);

        // Clear form fields
                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    // Remove existing Article
        $scope.remove = function (article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function () {
                    $location.path('articles');
                });
            }
        };

    // Update existing Article
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'articleForm');

                return false;
            }

            var article = $scope.article;

            article.$update(function () {
                $location.path('articles/' + article._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    // Find a list of Articles
        $scope.find = function () {
            $scope.articles = Articles.query();

        };

    // Find existing Article
        $scope.findOne = function () {
            $scope.article = Articles.get({
                articleId: $stateParams.articleId
            });
        };
    }
]);
