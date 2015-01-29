'use strict';

angular.module('app')

  .controller('CandidateController', function($resource, $scope, SETTINGS, $location, $routeParams, $window, OPEN_KNESSET) {
    var Info = $resource(SETTINGS.kikar+'/api/v1/facebook_feed/:id/',
                        {id:'@id'});
    var info = Info.get({id:$routeParams.id}, function () {
      $scope.info = info;
      $scope.feed = [{content:'סטטוס ראשון'},
                     {content:'סטטוס שני'}];
      });
  })
;
