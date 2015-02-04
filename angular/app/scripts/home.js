'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $location, $window) {
    $scope.loading = true;
    $scope.chairs = [];
    OPEN_KNESSET.get_candidates().then( function () {
      for (var i=0; i < OPEN_KNESSET.committees.length; i++) {
        var c = OPEN_KNESSET.committees[i];
        var electedId = $window.sessionStorage.getItem('chair'+c.id);
        $scope.chairs.push ({name: c.name, absolute_url: c.absolute_url,
                            chosen: OPEN_KNESSET.candidates[electedId]
                           });
      }
      return this;
    }).finally(function() {
      $scope.loading = false;
    })
  })
;
