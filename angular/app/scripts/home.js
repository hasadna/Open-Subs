'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, $location) {
    if (!USER.get()) {
      $location.path('/login');
    }
  })
;
