'use strict';

angular.module('app')

  .controller('CandidateController', function($log, $scope, $routeParams, OPEN_KNESSET, USER) {
    OPEN_KNESSET.get_person($routeParams.id).then(function(person) {
      $scope.person = person;
      USER.fbapi('/'+person.fb_id+'/posts').then(function(response) {
        $scope.feed = response;
      }, function(error, error_type) {
        if (error_type == USER.ERROR_LOGIN) {
          $location.path('/error/login/candidate/'+$routeParams.id);
        }
      })
    })
  })
;
