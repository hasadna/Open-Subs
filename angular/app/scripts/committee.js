'use strict';

angular
  .module('app')
  .controller('CommitteeController', function($scope, OPEN_KNESSET, $routeParams) {
    $scope.committee = OPEN_KNESSET.get_committee($routeParams.id);
  })
;

