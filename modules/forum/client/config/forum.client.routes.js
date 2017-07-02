(function () {
    'use strict';

    angular
        .module('app.forum')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'RouteHelpersProvider'];

    function routeConfig($stateProvider, helper) {
        $stateProvider
            .state('app.forum', {
                abstract: true,
                url: '/forum',
                template: '<ui-view/>',
                data: {
                    roles: ['user', 'team', 'admin']
                }
            })
            .state('app.forum.sections', {
                abstract: true,
                url: '/sections',
                template: '<ui-view/>'
            })
            .state('app.forum.sections.list', {
                url: '',
                templateUrl: 'modules/forum/client/views/list-sections.client.view.html',
                controller: 'SectionsListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Sections List',
                    roles: ['user', 'team', 'admin']
                }
            })
            .state('app.forum.sections.create', {
                url: '/create',
                templateUrl: 'modules/forum/client/views/form-section.client.view.html',
                controller: 'SectionsController',
                controllerAs: 'vm',
                resolve: angular.extend(helper.resolveFor('localytics.directives'), {
                    sectionResolve: newSection
                }),
                data: {
                    roles: ['admin'],
                    pageTitle: 'Sections Create'
                }
            })
            .state('app.forum.sections.edit', {
                url: '/:sectionId/edit',
                templateUrl: 'modules/forum/client/views/form-section.client.view.html',
                controller: 'SectionsController',
                controllerAs: 'vm',
                resolve: angular.extend(helper.resolveFor('localytics.directives'), {
                    sectionResolve: getSection
                }),
                data: {
                    roles: ['admin'],
                    pageTitle: 'Edit Section {{ sectionResolve.name }}'
                }
            })
            .state('app.forum.list', {
                url: '',
                templateUrl: 'modules/forum/client/views/list-forum.client.view.html',
                controller: 'ForumListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Categories List',
                    roles: ['user', 'team', 'admin']
                }
            })
            .state('app.forum.sections.topics', {
                abstract: true,
                url: '/:sectionId/topics',
                template: '<ui-view/>'
            })
            .state('app.forum.sections.topics.list', {
                url: '',
                templateUrl: 'modules/forum/client/views/list-topics.client.view.html',
                controller: 'TopicsListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Topics List',
                    roles: ['user', 'team', 'admin']
                },
                resolve: angular.extend(helper.resolveFor('ngDialog'), {
                    tpl: function() {
                        return {
                            path: 'modules/forum/client/views/dialogMove.client.view.html'
                        };
                    }
                })
            })
            .state('app.forum.sections.topics.create', {
                url: '/create',
                templateUrl: 'modules/forum/client/views/form-topic.client.view.html',
                controller: 'TopicsController',
                controllerAs: 'vm',
                resolve: {
                    topicResolve: newTopic,
                    replyResolve: newReply
                },
                data: {
                    roles: ['user', 'team', 'admin'],
                    pageTitle: 'Topics Create'
                }
            })
            .state('app.forum.sections.topics.edit', {
                url: '/:topicId/edit',
                templateUrl: 'modules/forum/client/views/form-topic.client.view.html',
                controller: 'TopicsController',
                controllerAs: 'vm',
                resolve: {
                    topicResolve: getTopic,
                    replyResolve: newReply
                },
                data: {
                    roles: ['user', 'team', 'admin'],
                    pageTitle: 'Edit Reply {{ topicResolve.name }}'
                }
            })
            .state('app.forum.sections.topics.view', {
                url: '/:topicId',
                templateUrl: 'modules/forum/client/views/view-topic.client.view.html',
                controller: 'TopicsController',
                controllerAs: 'vm',
                resolve: {
                    topicResolve: getTopic,
                    replyResolve: newReply
                },
                data: {
                    roles: ['user', 'team', 'admin'],
                    pageTitle: 'Reply {{ topicResolve.name }}'
                }
            })
            .state('app.forum.sections.topics.reply', {
                abstract: true,
                url: '/:sectionId/topics/:topicId/reply',
                template: '<ui-view/>'
            })
            .state('app.forum.sections.topics.reply.edit', {
                url: '/:replyId/edit',
                templateUrl: 'modules/forum/client/views/form-reply.client.view.html',
                controller: 'EditReplyController',
                controllerAs: 'vm',
                resolve: {
                    topicResolve: getTopic,
                    replyResolve: getReply
                },
                data: {
                    roles: ['user', 'team', 'admin'],
                    pageTitle: 'Edit Reply {{ replyResolve.name }}'
                }
            })
            .state('app.forum.categories', {
                abstract: true,
                url: '/categories',
                template: '<ui-view/>'
            })
            .state('app.forum.categories.list', {
                url: '',
                templateUrl: 'modules/forum/client/views/list-categories.client.view.html',
                controller: 'CategoriesListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Categories List',
                    roles: ['user', 'team', 'admin']
                }
            })
            .state('app.forum.categories.create', {
                url: '/create',
                templateUrl: 'modules/forum/client/views/form-categorie.client.view.html',
                controller: 'CategoriesController',
                controllerAs: 'vm',
                resolve: {
                    categorieResolve: newCategorie
                },
                data: {
                    roles: ['admin'],
                    pageTitle: 'Categories Create'
                }
            })
            .state('app.forum.categories.edit', {
                url: '/:categorieId/edit',
                templateUrl: 'modules/forum/client/views/form-categorie.client.view.html',
                controller: 'CategoriesController',
                controllerAs: 'vm',
                resolve: {
                    categorieResolve: getCategorie
                },
                data: {
                    roles: ['admin'],
                    pageTitle: 'Edit Categorie {{ categorieResolve.name }}'
                }
            });
    }

    newReply.$inject = ['ReplysService'];

    function newReply(TopicsService) {
        return new TopicsService();
    }

    getReply.$inject = ['$stateParams', 'ReplysService'];

    function getReply($stateParams, ReplysService) {
        return ReplysService.get({
            replyId: $stateParams.replyId
        }).$promise;
    }

    getTopic.$inject = ['$stateParams', 'TopicsService'];

    function getTopic($stateParams, TopicsService) {
        return TopicsService.get({
            topicId: $stateParams.topicId
        }).$promise;
    }

    newTopic.$inject = ['TopicsService'];

    function newTopic(TopicsService) {
        return new TopicsService();
    }

    getSection.$inject = ['$stateParams', 'SectionsService'];

    function getSection($stateParams, SectionsService) {
        return SectionsService.get({
            sectionId: $stateParams.sectionId
        }).$promise;
    }

    newSection.$inject = ['SectionsService'];

    function newSection(SectionsService) {

        return new SectionsService();
    }

    getCategorie.$inject = ['$stateParams', 'CategoriesService'];

    function getCategorie($stateParams, CategoriesService) {
        return CategoriesService.get({
            categorieId: $stateParams.categorieId
        }).$promise;
    }

    newCategorie.$inject = ['CategoriesService'];

    function newCategorie(CategoriesService) {
        return new CategoriesService();
    }
}());
