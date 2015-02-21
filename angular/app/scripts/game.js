angular.module('app')
  .controller('GameLastController', function($scope, $q, OPEN_KNESSET, $window) {
    $scope.committees = [];
    $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(function(res) {
      $scope.rows = [[],[]];
      for (var i=0; i < res.committees.length; i++) {
        var c = res.committees[i];
        var electedId = $window.sessionStorage.getItem('chair'+c.id);
        $scope.committees.push ({
          name: c.name, absolute_url: c.absolute_url, id: c.id,
          chosen: res.candidates[electedId]
        });
      }
      $scope.loading = false;
    });

  })
;
