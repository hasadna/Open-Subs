'use strict';

angular.module('app')

  .controller('CandidateController', function($log, $scope, $routeParams, OPEN_KNESSET) {
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
        FB.api("/"+fb_id+"/posts",
            {access_token: "CAAEjpAqEyXcBAFJJvPisrbohjMMCQUJ414J9SkCrBhAEz9sfe5D1WVti10Sv2xhZCGH6TNEkZBzPRDbCL8sZAIfahEMyZB23db2s0jTcPMWZAVoL1Fcesi2Ch5bB4ZAgrA09SYwMZBtTrZBbEx2MkWulVktppUJNoVGsvYwmRv5coBoYbjAwk8kxCxWrkuvSoMZBn1dfZAQszxNgZDZD" },
            function (response) {
          if (response && !response.error) {
            $scope.feed = response.data;
          }
        });
      }
    });
  });
