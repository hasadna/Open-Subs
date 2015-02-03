'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $location) {
    if (!USER.get()) {
      $location.path('/login');
    }
    else {
      $scope.chairs = OPEN_KNESSET.committees;
    }
  })
;
