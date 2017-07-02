'use strict';

// Setting up route
angular.module('app.articles').config(['$stateProvider', 'RouteHelpersProvider', '$provide',
    function ($stateProvider, helper, $provide) {
        // this demonstrates how to register a new tool and add it to the default toolbar
        $provide.decorator('taOptions', ['$delegate', function(taOptions) {
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
            // taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
            ];
            taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'btn-toolbar',
                toolbarGroup: 'btn-group',
                toolbarButton: 'btn btn-default',
                toolbarButtonActive: 'active',
                disabled: 'disabled',
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            };
            return taOptions; // whatever you return will be the taOptions
        }]);
        // Articles state routing
        $stateProvider
            .state('app.articles', {
                abstract: true,
                url: '/articles',
                template: '<ui-view/>'
                // resolve: helper.resolveFor('icons')
            })
            .state('app.articles.list', {
                url: '',
                controller: 'ArticlesController',
                templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
                // resolve: helper.resolveFor('icons')
            })
            .state('app.articles.create', {
                url: '/create',
                controller: 'ArticlesController',
                templateUrl: 'modules/articles/client/views/create-article.client.view.html',
                data: {
                    roles: ['admin']
                }
                // resolve: helper.resolveFor('icons')
            })
            .state('app.articles.view', {
                url: '/:articleId',
                templateUrl: 'modules/articles/client/views/view-article.client.view.html',
                resolve: helper.resolveFor('icons')
            })
            .state('app.articles.edit', {
                url: '/:articleId/edit',
                controller: 'ArticlesController',
                templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
                data: {
                    roles: ['admin']
                }
                // resolve: helper.resolveFor('icons')
            })
            .state('app.articles.addcomment', {
                url: '/:articleId/addcomment',
                templateUrl: 'modules/articles/client/views/create-comment.client.view.html',
                controller: 'ArticlesController',
                data: {
                    roles: ['user', 'admin', 'team']
                }
                // resolve: helper.resolveFor('icons','ngWig')
            })
            .state('app.articles.editcomment', {
                url: '/:articleId/editcomment/:commentId',
                controller: 'ArticlesController',
                templateUrl: 'modules/articles/client/views/edit-comment.client.view.html',
                data: {
                    roles: ['user', 'admin', 'team']
                }
                // resolve: helper.resolveFor('icons','ngWig')
            });

        getArticle.$inject = ['$stateParams', 'ArticlesService'];

        function getArticle($stateParams, ArticlesService) {
            return ArticlesService.get({
                articleId: $stateParams.articleId
            }).$promise;
        }

        newArticle.$inject = ['ArticlesService'];

        function newArticle(ArticlesService) {
            return new ArticlesService();
        }
    }
]);
