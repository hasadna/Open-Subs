'use strict';

angular
  .module('app')
  .controller('CommitteeController', function($location, $scope, $window,
                                              OPEN_KNESSET, $routeParams, $q,
                                              USER, $anchorScroll) {
    var INITIAL_ORG_LIMIT = 11,
        committee_id = $routeParams.id;
    $q.all({
      committee: OPEN_KNESSET.get_committee(committee_id),
      candidates: OPEN_KNESSET.get_candidates()
    }).then(function(res) {
      var candidatesArray = $.map(res.candidates, function(v){return v;});
      // build a candidates array ordered by group and then A-z
      var i, j, org, orgs = {}, orgCandidatesArray = [];
      for (i=0; i < candidatesArray.length; i++) {
        var c = candidatesArray[i];
        for (j=0; j < c.roles.length; j++) {
          var role = c.roles[j];
          if (role.org == "הבחירות לכנסת ה-20") {
            org = role.text.match(/מקום (\d+) ב(.+)/);
            if (org !== null && org.length == 3){
              c.ord = parseInt(org[1]);
              org = org[2];
              if (org in orgs) {
                orgs[org]['candidates'].push(c);
                c.org = orgs[org];
              }
              else {
                orgs[org] = c.org = {
                  'org': org,
                  'candidates': [c],
                  'limit': INITIAL_ORG_LIMIT
                };
                orgCandidatesArray.push(orgs[org]);
              }
              // finished with this candidates, break to stop looping on roles
              break;
            }
          }
        }
      }
      var len = 0;
      for (org in orgs) {
        // var org = orgs[i];
        orgs[org]['candidates'].sort(function (a, b) {
          return a.ord - b.ord;
        });
        // initially diIsplay 1- candidates and a more button
        len++;
      }
      //TODO: inifinte scroll is disabled is it screws up the hash navigation
      //      required by search
      $scope.candidateOrgsLimit = 99;
      $scope.candidatesArray = candidatesArray;
      $scope.candidates = orgCandidatesArray;
      $scope.committee = res.committee;
    });
    $scope.$watch(function (scope) { return scope.selectedChair; },
                  function (new_value, old_value) {
      if (new_value) {
        new_value.originalObject.expanded = true;
        /*TODO: this doesn't work
        if (new_value.originalObject.ord >= INITIAL_ORG_LIMIT)
          new_value.originalObject.org.limit = 999;
         */
        $location.hash('candidate-'+new_value.originalObject.id);
        $anchorScroll();
      }
    });
    $scope.elect = function () {
        $window.sessionStorage.setItem('chair'+committee_id, this.candidate.id);
        for (var i=0; i<$scope.candidatesArray.length; i++)
          $scope.candidatesArray[i].expanded = false;
        $location.path('/home');
    };
    $scope.addMoreOrgs = function() {
      $scope.candidateOrgsLimit += 3;
    };
    // TODO: this code was copied from home.js, need to rinse
    var firstTime = $window.sessionStorage.getItem('firstTimeCommittee') || true;
    $scope.firstTime = eval(firstTime);
    $scope.go = function () {
      $window.sessionStorage.setItem('firstTimeCommittee', "false");
      $scope.firstTime = false;
    }
    $scope.loaded = function (candidate) {
      // build the query string
      var ids = [];
      var re = new RegExp("\/api\/v2\/person\/([0-9]+)\/");
      var relations = candidate.donor.concat(candidate.related);
      for (var i=0; i<relations.length; i++) {
        var id = relations[i].match(re)[1]
        ids.push(id);
      };
      candidate.donor = [];
      candidate.related = [];
      OPEN_KNESSET.get_person(ids).then(function (data) {
        for (var i=0; i<data.objects.length; i++) {
          var p = data.objects[i];
          for (var j=0; j<candidate.relations.length; j++) {
            var r = candidate.relations[j];
            var id = r.with_person.match(re)[1];
            if (id == p.id)
              candidate[r.relationship].push(p)
          }
        }
      })
      if (candidate.fb_id !== "") {
        candidate.feedLength = -1;
        //TODO: call FB as much as need rather than once
        USER.fbapi('/'+candidate.fb_id+'/posts').then(function(response) {
          if (response.hasOwnProperty('data')) {
            candidate.feed = response.data;
            candidate.feedLength = Math.min(3, candidate.feed.length);
          }
        });
      }
      else
        candidate.feedLength = 0;
    }
  }
);
