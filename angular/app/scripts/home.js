'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $location, $window, $q) {
    $scope.loading = true;
    $scope.chairs = [];
    $scope.reset = function () {
      for (var i=0; i < this.chairs.length; i++) {
        $window.sessionStorage.setItem('chair'+this.chairs[i].id, null);
        $scope.chairs[i].chosen = null;
      }
    };

    $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(function(res) {
      for (var i=0; i < res.committees.length; i++) {
        var c = res.committees[i];
        var electedId = $window.sessionStorage.getItem('chair'+c.id);
        $scope.chairs.push ({
          name: c.name, absolute_url: c.absolute_url, id: c.id,
          chosen: res.candidates[electedId]
        });
      }
      $scope.loading = false;
    });
    var firstTime = $window.sessionStorage.getItem('firstTimeHome') || 1;
    
    firstTime = eval(firstTime);
    $scope.firstTime = firstTime;
    $scope.go = function () {
      $window.sessionStorage.setItem('firstTimeHome', "0");
      $scope.firstTime = false;
    }
  })
;
