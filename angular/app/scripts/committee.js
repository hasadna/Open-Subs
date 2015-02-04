'use strict';

angular
  .module('app')
  .controller('CommitteeController', function($location, $scope, $window, OPEN_KNESSET, $routeParams, $q) {
    var committee_id = $routeParams.id;
    $q.all({
      committee: OPEN_KNESSET.get_committee(committee_id),
      candidates: OPEN_KNESSET.get_candidates()
    }).then(function(res) {
      $scope.committee = res.committee;
      $scope.candidates = res.candidates;
    });
    $scope.$watch(function (scope) { return scope.selectedChair; },
                  function (new_value, old_value) {
      if (new_value) {
        //TODO: code a factory for chairs
        $window.sessionStorage.setItem('chair'+committee_id,
              new_value.originalObject.id);
        $location.path('/home');
      }
    });
    $scope.elect = function (id) {
        $window.sessionStorage.setItem('chair'+committee_id, id);
        $location.path('/home');
    };

  })
;

