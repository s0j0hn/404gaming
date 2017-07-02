(function () {
    'use strict';

    describe('Bans Route Tests', function () {
    // Initialize global variables
        var $scope,
            BansService;

    // We can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
        beforeEach(inject(function ($rootScope, _BansService_) {
      // Set a new global scope
            $scope = $rootScope.$new();
            BansService = _BansService_;
        }));

        describe('Route Config', function () {
            describe('Main Route', function () {
                var mainstate;
                beforeEach(inject(function ($state) {
                    mainstate = $state.get('app.bans');
                }));

                it('Should have the correct URL', function () {
                    expect(mainstate.url).toEqual('/bans');
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
                    BansController,
                    mockBan;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    viewstate = $state.get('bans.view');
                    $templateCache.put('modules/bans/client/views/view-ban.client.view.html', '');

          // create mock Ban
                    mockBan = new BansService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Ban Name'
                    });

          // Initialize Controller
                    BansController = $controller('BansController as vm', {
                        $scope: $scope,
                        banResolve: mockBan
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(viewstate.url).toEqual('/:banId');
                });

                it('Should have a resolve function', function () {
                    expect(typeof viewstate.resolve).toEqual('object');
                    expect(typeof viewstate.resolve.banResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(viewstate, {
                        banId: 1
                    })).toEqual('/bans/1');
                }));

                it('should attach an Ban to the controller scope', function () {
                    expect($scope.vm.ban._id).toBe(mockBan._id);
                });

                it('Should not be abstract', function () {
                    expect(viewstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(viewstate.templateUrl).toBe('modules/bans/client/views/view-ban.client.view.html');
                });
            });

            describe('Create Route', function () {
                var createstate,
                    BansController,
                    mockBan;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    createstate = $state.get('bans.create');
                    $templateCache.put('modules/bans/client/views/form-ban.client.view.html', '');

          // create mock Ban
                    mockBan = new BansService();

          // Initialize Controller
                    BansController = $controller('BansController as vm', {
                        $scope: $scope,
                        banResolve: mockBan
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(createstate.url).toEqual('/create');
                });

                it('Should have a resolve function', function () {
                    expect(typeof createstate.resolve).toEqual('object');
                    expect(typeof createstate.resolve.banResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(createstate)).toEqual('/bans/create');
                }));

                it('should attach an Ban to the controller scope', function () {
                    expect($scope.vm.ban._id).toBe(mockBan._id);
                    expect($scope.vm.ban._id).toBe(undefined);
                });

                it('Should not be abstract', function () {
                    expect(createstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(createstate.templateUrl).toBe('modules/bans/client/views/form-ban.client.view.html');
                });
            });

            describe('Edit Route', function () {
                var editstate,
                    BansController,
                    mockBan;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    editstate = $state.get('bans.edit');
                    $templateCache.put('modules/bans/client/views/form-ban.client.view.html', '');

          // create mock Ban
                    mockBan = new BansService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Ban Name'
                    });

          // Initialize Controller
                    BansController = $controller('BansController as vm', {
                        $scope: $scope,
                        banResolve: mockBan
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(editstate.url).toEqual('/:banId/edit');
                });

                it('Should have a resolve function', function () {
                    expect(typeof editstate.resolve).toEqual('object');
                    expect(typeof editstate.resolve.banResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(editstate, {
                        banId: 1
                    })).toEqual('/bans/1/edit');
                }));

                it('should attach an Ban to the controller scope', function () {
                    expect($scope.vm.ban._id).toBe(mockBan._id);
                });

                it('Should not be abstract', function () {
                    expect(editstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(editstate.templateUrl).toBe('modules/bans/client/views/form-ban.client.view.html');
                });

                xit('Should go to unauthorized route', function () {

                });
            });

        });
    });
}());
