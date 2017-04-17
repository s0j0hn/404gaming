(function () {
  'use strict';

  describe('Categories Route Tests', function () {
    // Initialize global variables
    var $scope,
      CategoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CategoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CategoriesService = _CategoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('categories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/categories');
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
          CategoriesController,
          mockCategorie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('app.categories.view');
          $templateCache.put('modules/categories/client/views/view-categorie.client.view.html', '');

          // create mock Categorie
          mockCategorie = new CategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Categorie Name'
          });

          // Initialize Controller
          CategoriesController = $controller('CategoriesController as vm', {
            $scope: $scope,
            categorieResolve: mockCategorie
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:categorieId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.categorieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            categorieId: 1
          })).toEqual('/categories/1');
        }));

        it('should attach an Categorie to the controller scope', function () {
          expect($scope.vm.categorie._id).toBe(mockCategorie._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/categories/client/views/view-categorie.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CategoriesController,
          mockCategorie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('app.categories.create');
          $templateCache.put('modules/categories/client/views/form-categorie.client.view.html', '');

          // create mock Categorie
          mockCategorie = new CategoriesService();

          // Initialize Controller
          CategoriesController = $controller('CategoriesController as vm', {
            $scope: $scope,
            categorieResolve: mockCategorie
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.categorieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/categories/create');
        }));

        it('should attach an Categorie to the controller scope', function () {
          expect($scope.vm.categorie._id).toBe(mockCategorie._id);
          expect($scope.vm.categorie._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/categories/client/views/form-categorie.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CategoriesController,
          mockCategorie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('app.categories.edit');
          $templateCache.put('modules/categories/client/views/form-categorie.client.view.html', '');

          // create mock Categorie
          mockCategorie = new CategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Categorie Name'
          });

          // Initialize Controller
          CategoriesController = $controller('CategoriesController as vm', {
            $scope: $scope,
            categorieResolve: mockCategorie
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:categorieId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.categorieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            categorieId: 1
          })).toEqual('/categories/1/edit');
        }));

        it('should attach an Categorie to the controller scope', function () {
          expect($scope.vm.categorie._id).toBe(mockCategorie._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/categories/client/views/form-categorie.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
