(function () {
    'use strict';

    describe('Recruits Route Tests', function () {
    // Initialize global variables
        var $scope,
            RecruitsService;

    // We can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
        beforeEach(inject(function ($rootScope, _RecruitsService_) {
      // Set a new global scope
            $scope = $rootScope.$new();
            RecruitsService = _RecruitsService_;
        }));

        describe('Route Config', function () {
            describe('Main Route', function () {
                var mainstate;
                beforeEach(inject(function ($state) {
                    mainstate = $state.get('recruits');
                }));

                it('Should have the correct URL', function () {
                    expect(mainstate.url).toEqual('/recruits');
                });

                it('Should be abstract', function () {
                    expect(mainstate.abstract).toBe(true);
                });

                it('Should have template', function () {
                    expect(mainstate.template).toBe('<ui-view/>');
                });
            });

            describe('View Route', function () {
                var viewstate,
                    RecruitsController,
                    mockRecruit;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    viewstate = $state.get('recruits.view');
                    $templateCache.put('modules/recruits/client/views/view-recruit.client.view.html', '');

          // create mock Recruit
                    mockRecruit = new RecruitsService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Recruit Name'
                    });

          // Initialize Controller
                    RecruitsController = $controller('RecruitsController as vm', {
                        $scope: $scope,
                        recruitResolve: mockRecruit
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(viewstate.url).toEqual('/:recruitId');
                });

                it('Should have a resolve function', function () {
                    expect(typeof viewstate.resolve).toEqual('object');
                    expect(typeof viewstate.resolve.recruitResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(viewstate, {
                        recruitId: 1
                    })).toEqual('/recruits/1');
                }));

                it('should attach an Recruit to the controller scope', function () {
                    expect($scope.vm.recruit._id).toBe(mockRecruit._id);
                });

                it('Should not be abstract', function () {
                    expect(viewstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(viewstate.templateUrl).toBe('modules/recruits/client/views/view-recruit.client.view.html');
                });
            });

            describe('Create Route', function () {
                var createstate,
                    RecruitsController,
                    mockRecruit;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    createstate = $state.get('recruits.create');
                    $templateCache.put('modules/recruits/client/views/form-recruit.client.view.html', '');

          // create mock Recruit
                    mockRecruit = new RecruitsService();

          // Initialize Controller
                    RecruitsController = $controller('RecruitsController as vm', {
                        $scope: $scope,
                        recruitResolve: mockRecruit
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(createstate.url).toEqual('/create');
                });

                it('Should have a resolve function', function () {
                    expect(typeof createstate.resolve).toEqual('object');
                    expect(typeof createstate.resolve.recruitResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(createstate)).toEqual('/recruits/create');
                }));

                it('should attach an Recruit to the controller scope', function () {
                    expect($scope.vm.recruit._id).toBe(mockRecruit._id);
                    expect($scope.vm.recruit._id).toBe(undefined);
                });

                it('Should not be abstract', function () {
                    expect(createstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(createstate.templateUrl).toBe('modules/recruits/client/views/form-recruit.client.view.html');
                });
            });

            describe('Edit Route', function () {
                var editstate,
                    RecruitsController,
                    mockRecruit;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    editstate = $state.get('recruits.edit');
                    $templateCache.put('modules/recruits/client/views/form-recruit.client.view.html', '');

          // create mock Recruit
                    mockRecruit = new RecruitsService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Recruit Name'
                    });

          // Initialize Controller
                    RecruitsController = $controller('RecruitsController as vm', {
                        $scope: $scope,
                        recruitResolve: mockRecruit
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(editstate.url).toEqual('/:recruitId/edit');
                });

                it('Should have a resolve function', function () {
                    expect(typeof editstate.resolve).toEqual('object');
                    expect(typeof editstate.resolve.recruitResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(editstate, {
                        recruitId: 1
                    })).toEqual('/recruits/1/edit');
                }));

                it('should attach an Recruit to the controller scope', function () {
                    expect($scope.vm.recruit._id).toBe(mockRecruit._id);
                });

                it('Should not be abstract', function () {
                    expect(editstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(editstate.templateUrl).toBe('modules/recruits/client/views/form-recruit.client.view.html');
                });

                xit('Should go to unauthorized route', function () {

                });
            });

        });
    });
}());
