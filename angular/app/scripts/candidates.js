'use strict';

angular.module('app')

  .controller('CandidateController', function($resource, $scope, SETTINGS, $location, $routeParams, $window, OPEN_KNESSET) {
    var person = OPEN_KNESSET.Person.get({id:$routeParams.id}, function () {
      $scope.person = person;
      $scope.feed = [{content:'סטטוס ראשון'},
                     {content:'סטטוס שני'}];
      });
  })
;
