(function () {
    'use strict';

    describe('Sections Route Tests', function () {
    // Initialize global variables
        var $scope,
            SectionsService;

    // We can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
        beforeEach(inject(function ($rootScope, _SectionsService_) {
      // Set a new global scope
            $scope = $rootScope.$new();
            SectionsService = _SectionsService_;
        }));

        describe('Route Config', function () {
            describe('Main Route', function () {
                var mainstate;
                beforeEach(inject(function ($state) {
                    mainstate = $state.get('app.sections');
                }));

                it('Should have the correct URL', function () {
                    expect(mainstate.url).toEqual('/sections');
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
                    SectionsController,
                    mockSection;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    viewstate = $state.get('sections.view');
                    $templateCache.put('modules/sections/client/views/view-section.client.view.html', '');

          // create mock Section
                    mockSection = new SectionsService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Section Name'
                    });

          // Initialize Controller
                    SectionsController = $controller('SectionsController as vm', {
                        $scope: $scope,
                        sectionResolve: mockSection
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(viewstate.url).toEqual('/:sectionId');
                });

                it('Should have a resolve function', function () {
                    expect(typeof viewstate.resolve).toEqual('object');
                    expect(typeof viewstate.resolve.sectionResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(viewstate, {
                        sectionId: 1
                    })).toEqual('/sections/1');
                }));

                it('should attach an Section to the controller scope', function () {
                    expect($scope.vm.section._id).toBe(mockSection._id);
                });

                it('Should not be abstract', function () {
                    expect(viewstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(viewstate.templateUrl).toBe('modules/sections/client/views/view-section.client.view.html');
                });
            });

            describe('Create Route', function () {
                var createstate,
                    SectionsController,
                    mockSection;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    createstate = $state.get('sections.create');
                    $templateCache.put('modules/sections/client/views/form-section.client.view.html', '');

          // create mock Section
                    mockSection = new SectionsService();

          // Initialize Controller
                    SectionsController = $controller('SectionsController as vm', {
                        $scope: $scope,
                        sectionResolve: mockSection
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(createstate.url).toEqual('/create');
                });

                it('Should have a resolve function', function () {
                    expect(typeof createstate.resolve).toEqual('object');
                    expect(typeof createstate.resolve.sectionResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(createstate)).toEqual('/sections/create');
                }));

                it('should attach an Section to the controller scope', function () {
                    expect($scope.vm.section._id).toBe(mockSection._id);
                    expect($scope.vm.section._id).toBe(undefined);
                });

                it('Should not be abstract', function () {
                    expect(createstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(createstate.templateUrl).toBe('modules/sections/client/views/form-section.client.view.html');
                });
            });

            describe('Edit Route', function () {
                var editstate,
                    SectionsController,
                    mockSection;

                beforeEach(inject(function ($controller, $state, $templateCache) {
                    editstate = $state.get('sections.edit');
                    $templateCache.put('modules/sections/client/views/form-section.client.view.html', '');

          // create mock Section
                    mockSection = new SectionsService({
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Section Name'
                    });

          // Initialize Controller
                    SectionsController = $controller('SectionsController as vm', {
                        $scope: $scope,
                        sectionResolve: mockSection
                    });
                }));

                it('Should have the correct URL', function () {
                    expect(editstate.url).toEqual('/:sectionId/edit');
                });

                it('Should have a resolve function', function () {
                    expect(typeof editstate.resolve).toEqual('object');
                    expect(typeof editstate.resolve.sectionResolve).toEqual('function');
                });

                it('should respond to URL', inject(function ($state) {
                    expect($state.href(editstate, {
                        sectionId: 1
                    })).toEqual('/sections/1/edit');
                }));

                it('should attach an Section to the controller scope', function () {
                    expect($scope.vm.section._id).toBe(mockSection._id);
                });

                it('Should not be abstract', function () {
                    expect(editstate.abstract).toBe(undefined);
                });

                it('Should have templateUrl', function () {
                    expect(editstate.templateUrl).toBe('modules/sections/client/views/form-section.client.view.html');
                });

                xit('Should go to unauthorized route', function () {

                });
            });

        });
    });
}());
