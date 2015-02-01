'use strict';

angular.module('app')

  .controller('MyProfileController', function($scope, USER, $location, $window, OPEN_KNESSET) {
    if (!USER.get()) {
      $window.sessionStorage.afterlogin = '/my-profile';
      $location.path('/login');
    } else {
      $scope.person = false;
      OPEN_KNESSET.Person.get({id: USER.get().id} , function(person) {
        $scope.person = person;
      });
    }
  })

;
