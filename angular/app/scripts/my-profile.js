'use strict';

angular.module('app')

  .controller('MyProfileController', function($scope, USER, $location, $window, OPEN_KNESSET) {
    if (!USER.get()) {
      $window.sessionStorage.afterlogin = '/my-profile';
      $location.path('/login');
    } else {
      $scope.person = false;
      OPEN_KNESSET.get_person(USER.get()).then(function(person) {
        $scope.person = person;
      });
    }
  })

;
