'use strict';

angular
  .module('app')
  .controller('CommitteeController', function($location, $scope, $window,
                                              OPEN_KNESSET, $routeParams, $q,
                                              USER, $anchorScroll, DATA) {

    var _isTopOrg = function(org) {
      var istop = false;
      angular.forEach(DATA.topOrgsStartWith, function(toporg) {
        if (org.indexOf(toporg) === 0) {
          istop = true;
        }
      });
      return istop;
    };

    var _shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    var INITIAL_ORG_LIMIT = 11,
        committee_id = $routeParams.id;
    $q.all({
      committee: OPEN_KNESSET.get_committee(committee_id),
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(function(res) {
      var candidatesArray = $.map(res.candidates, function(v){return v;});
      // build a candidates array ordered by group and then A-z
      var i, j, org, orgs = {}, orgCandidatesArray_top = [], orgCandidatesArray_bottom = [];
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
                (_isTopOrg(org) ? orgCandidatesArray_top : orgCandidatesArray_bottom).push(orgs[org]);
              }
              // finished with this candidates, break to stop looping on roles
              break;
            }
          }
        }
      }
      _shuffle(orgCandidatesArray_top);
      _shuffle(orgCandidatesArray_bottom);
      var orgCandidatesArray = orgCandidatesArray_top.concat(orgCandidatesArray_bottom);
      var len = 0;
      for (org in orgs) {
        // var org = orgs[i];
        orgs[org]['candidates'].sort(function (a, b) {
          return a.ord - b.ord;
        });
        // initially diIsplay 1- candidates and a more button
        len++;
      }
      // Expanding the selected candidate list
      for (var orgId=0; orgId < orgCandidatesArray.length; orgId++){
          var org = orgCandidatesArray[orgId];
          for (var candId=0; candId < org.candidates.length; candId++) {
            var cand = org.candidates[candId];
            //console.log(cand);
            if ($location.hash() === "candidate-"+cand.id)
                {
                  cand.org.limit = 888;
                  cand.expanded = true;
                }
            }
          }
      //TODO: inifinte scroll is disabled is it screws up the hash navigation
      //      required by search
      $scope.candidateOrgsLimit = 99;
      $scope.candidatesArray = candidatesArray;
      $scope.candidates = orgCandidatesArray;
      $scope.committee = res.committee;
      $scope.committees = res.committees;
      $scope.loading = false;
    });
    $scope.$watch(function (scope) { return scope.selectedChair; },
                  function (new_value, old_value) {
      var cand, org;
      if (new_value) {
        // Looking for the corresponding candidate object in the real candidateArray
        for (var orgId=0; orgId < $scope.candidates.length; orgId++){
          org = $scope.candidates[orgId];
          for (var candId=0; candId < org.candidates.length; candId++) {
            cand = org.candidates[candId];
            if (cand.id === new_value.originalObject.id) {
              cand.expanded=true;
              $location.hash('candidate-'+cand.id);
            }
          }
        }
      }
    });
    $scope.elect = function () {
        $window.sessionStorage.setItem('chair'+committee_id, this.candidate.id);
        for (var i=0; i<$scope.candidatesArray.length; i++)
          $scope.candidatesArray[i].expanded = false;
        $location.hash('');
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
    };
    $scope.loaded = function (candidate) {
      // Element loaded, can scroll there
      $anchorScroll();
      // Checking if already elected
      candidate.block = false;
      for (var i=0;i<$scope.committees.length; i++) {
        var c = $scope.committees[i],
        electedId = $window.sessionStorage.getItem('chair'+c.id);
        if (c.id != committee_id && electedId==candidate.id) {
          // Got dup
          candidate.block = true;
        } 
      }
      // build the query string
      var ids = [];
      var re = new RegExp("\/api\/v2\/person\/([0-9]+)\/");
      var relations = candidate.donor.concat(candidate.related);
      for (var i=0; i<relations.length; i++) {
        var id = relations[i].match(re)[1];
        ids.push(id);
      }
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
      });
      if (candidate.fb_id !== "") {
        candidate.hasFeed = true;
        candidate.feedLoading = true;
        candidate.feedLength = -1;
        //TODO: call FB as much as need rather than once
        USER.fbapi('/'+candidate.fb_id+'/posts').then(function(response) {
          candidate.feedLoading = false;
          if (response.hasOwnProperty('data')) {
            candidate.feed = response.data;
            candidate.feedLength = Math.min(3, candidate.feed.length);
          }
        }, function(response) {
          candidate.feedLoading = false;
        });
      }
      else
        candidate.hasFeed = false;
    }
  }
);
