'use strict';

angular.module('app')

  .controller('CandidateController', function($log, $scope, $routeParams, OPEN_KNESSET, ezfb) {
    OPEN_KNESSET.Person.get({id:$routeParams.id}, function (person) {
      $scope.person = person;
      var i, fb_page = "";
      for (i=0; i < person.links.length; i++) {
        if (person.links[i]["url"].search("facebook.com") > 0) {
          fb_page = person.links[i]["url"];
          break;
        }
      };
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
        ezfb.api("/"+fb_id+"/posts",
            {access_token: "CAAEjpAqEyXcBAEWjVamVN4S1LumbfJ7BLZBF2ZAj8L91jH1kqk3rw80eZAgDds5yXWxdmU9KqXI7F8QPKXSo5jbJZAsEtO7b76OvtvJfMTE5iZAUXDiq6s9ZA1SKFSGorJ8AiZCGr92oxJ2jlF6XYFqPR8BtJN9aNNMqMWZBmOBKZBBQawbAZAKviW4UtvuBFHT2lXLAngFzfTXAZDZD" },
            function (response) {
              $scope.feed = response;
            });
      }
    });
  });
