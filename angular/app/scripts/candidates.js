'use strict';

angular.module('app')

  .controller('CandidateController', function($log, $scope, $routeParams, OPEN_KNESSET, USER) {
    OPEN_KNESSET.get_person($routeParams.id).then(function(person) {
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
  })
  .directive('candidate', function() {
      return {
              restrict: 'E',
              replace: 'true',
              templateUrl: '/views/candidate.html',
              link: function (scope, element) {
                // packing nicely all the candidate's info
                var c = scope.candidate,
                    miss = {};

                /* TODO: add donors & relations....
                function miss (pack) {
                  if (pack)
                    return false;
                  else {
                    pack = [];
                    return true;
                }
                miss.relations = miss(c.relations);
                for (var i=0; miss.relations && i < c.relations.length; i++){
                  c.relations.push(c.relations);
                }
               */
              }
              };
  })
;
