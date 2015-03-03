'use strict';

describe('Controller: HomeController', function () {

  // load the controller's module
  beforeEach(module('app'));

  var HomeController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomeController = $controller('HomeController', {
      $scope: scope
    });
  }));

  it('should add the rows of chairs', function () {
    expect(scope.rows.length).toBe(2);
    // for each row
    for (var i=0; i<2; i++) {
      var row = scope.rows[i];
      expect(row.length).toBe(6);
      for (var j=0; j<6; j++) {
        var chair = row[j];
        expect(chair.name).toBeTruthy(6);
        expect(chair.chosen.name).toBeTruthy("כסא ריק");
      }
    }
  });
});
