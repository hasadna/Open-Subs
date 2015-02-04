'use strict';

angular.module('app')

  .controller('CandidateController', function($log, $scope, $routeParams, OPEN_KNESSET, USER) {
    OPEN_KNESSET.Person.get({id:$routeParams.id}, function (person) {
      $scope.person = person;
      var i, fb_page = "";
      if (person.links) {
        for (i=0; i < person.links.length; i++) {
          if (person.links[i]["url"].search("facebook.com") > 0) {
            fb_page = person.links[i]["url"];
            break;
          }
        };
      }
      if (fb_page == "" && person.mk) {
        for (i=0; i < person.mk.links.length; i++) {
          if (person.mk.links[i]["url"].search("facebook.com") > 0) {
            fb_page = person.mk.links[i]["url"];
            break;
          }
        }
      };
      if (fb_page != "") {
        var parts = fb_page.split('/'),
            fb_id = parts[parts.length - 1];
        $log.debug(fb_id);
        USER.fbapi('/'+fb_id+'/posts').then(function(response) {
          $scope.feed = response;
        });
      }
    });
  });
