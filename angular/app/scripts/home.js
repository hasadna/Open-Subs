'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $location, $window) {
    if (!USER.get()) {
      $location.path('/login');
    }
    else {
      $scope.chairs = []
      for (var i=0; i < OPEN_KNESSET.committees.length; i++) {
        var c = OPEN_KNESSET.committees[i];
        $scope.chairs.push ({name: c.name, absolute_url: c.absolute_url,
                            chosen: $window.sessionStorage.getItem('chair'+c.id)});

      };
    }
  })
;
