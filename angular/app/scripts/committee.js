'use strict';

angular
  .module('app')
  .controller('CommitteeController', function($location, $scope, $window,
                                              OPEN_KNESSET, $stateParams, $q,
                                              USER, $anchorScroll, DATA, modal) {
    var INITIAL_ORG_LIMIT = 11,
        committee_id = $stateParams.id,
        game_level = $stateParams.level,
        game_mode = false,
        electedId = $window.sessionStorage.getItem('chair'+committee_id),
        myOrgs = JSON.parse($window.sessionStorage.getItem('myOrgs')) || [];

    $scope.modal = modal;
    $scope.buttonSub = true;
    $scope.stage = $stateParams.stage || $window.sessionStorage['stage'];

    $scope.startElecting = function () {
      $scope.stage = 'electing';
      $window.sessionStorage.setItem('stage', 'electing');
    };
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

    if (electedId)
      OPEN_KNESSET.get_person(electedId).then(function (cand) {
        $scope.chair = cand
      });

    OPEN_KNESSET.get_committees().then(function(committees) {
      if (game_level) {
        $scope.game_mode = true;
        if (game_level == 'start') {
          modal.show('views/home-help.html');
          $scope.game_level = 1;
        } else {
          $scope.game_level=parseInt(game_level);
        }
      }
      if ($scope.game_mode) {
        committee_id = committees[$scope.game_level-1].id;
        console.log(committees.length, $scope.game_level);
        if ($scope.game_level == committees.length) {
          $scope.last_level = true;
        }
      }
      $q.all({
        committee: OPEN_KNESSET.get_committee(committee_id),
        candidates: OPEN_KNESSET.get_candidates()
      }).then(function(res) {

        var candidatesArray = $.map(res.candidates, function(v){return v;});
        // build a candidates array ordered by group and then A-z
        var i, j, org, orgs = {}, orgCandidatesArray_top = [], orgCandidatesArray_bottom = [];
        for (i=0; i < candidatesArray.length; i++) {
          var c = candidatesArray[i];
          c.expanded = false;
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
                    'name': org,
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
        // bump the organization the user likes to the top
        for (var i=0; i < myOrgs.length; i++) {
          var org = myOrgs[i];
          if (orgCandidatesArray[i].org != org)
            for (var j=i+1; j < orgCandidatesArray.length; j++) {
              if (orgCandidatesArray[j].name == org) {
                var temp = orgCandidatesArray[j];
                orgCandidatesArray[j] = orgCandidatesArray[i];
                orgCandidatesArray[i] = temp;
              }
          }
        }

        for (org in orgs) {
          // var org = orgs[i];
          orgs[org]['candidates'].sort(function (a, b) {
            return a.ord - b.ord;
          });
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
        $scope.committees = committees;
        $scope.loading = false;
      });
    });

    $scope.$watch(function (scope) { return scope.selectedChair; },
                  function (new_value, old_value) {
      var cand, org;
      // $scope.loading = true;
      if (new_value) {
        // Looking for the corresponding candidate object in the real candidateArray
        for (var orgId=0; orgId < $scope.candidates.length; orgId++){
          org = $scope.candidates[orgId];
          for (var candId=0; candId < org.candidates.length; candId++) {
            cand = org.candidates[candId];
            if (cand.id === new_value.originalObject.id) {
              $scope.expand(cand);
              // force reload to expand the candidate's party
              $scope.$emit('$locationChangeSuccess');
              $scope.loading = false;
            }
          }
        }
      }
    });

    $scope.firstButton = function () {
      $location.path('/home')
    };
    $scope.expand = function (cand) {
      cand.expanded = !cand.expanded;
      if (cand.expanded) {
        // Element loaded, can scroll there
        $location.hash('candidate-'+cand.id);
        $anchorScroll();
      }
    };
    function bumpOrg(org) {
      var found = false;
      for (var i=0; i < myOrgs.length; i++)
        if (org == myOrgs[i]) {
          // it's already in the array, remove it so we won't have doubles
          myOrgs.splice(i, 1);
          break;
        };
      myOrgs.push(org);
      $window.sessionStorage.setItem('myOrgs', JSON.stringify(myOrgs.reverse()));
    }

    $scope.elect = function (cand) {
        $window.sessionStorage.setItem('chair'+committee_id, cand.id);
        OPEN_KNESSET.storeChairSelection(committee_id, cand.id);
        bumpOrg(cand.org.name)
        for (var i=0; i<$scope.candidatesArray.length; i++)
          $scope.candidatesArray[i].expanded = false;
        $location.hash('');
        if ($scope.game_mode) {
          if ($scope.last_level) {
            $location.path('/game/last');
          } else {
            $location.path('/game/'+($scope.game_level+1));
          }
        } else {
          $location.path('/home');
        }
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
    $scope.help = function () {
     $scope.stage = 'novice';
    };
    $scope.loaded = function (candidate) {
      // Checking if already elected
      candidate.block = false;
      $scope.lastCandidate = candidate;
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
        for (var i=0; i<data.length; i++) {
          var p = data[i];
          for (var j=0; j<candidate.relations.length; j++) {
            var r = candidate.relations[j];
            var id = r.with_person.match(re)[1];
            if (id == p.id)
              candidate[r.relationship].push(p)
          }
        }
        $scope.loading = false;
      });
      if (candidate.fb_id !== "") {
        candidate.hasFeed = true;
        candidate.feedLoading = true;
        candidate.feedLength = -1;
        //TODO: call FB as much as need rather than once
        $scope.loading = true;
        USER.fbapi('/'+candidate.fb_id+'/posts').then(function(response) {
          candidate.feedLoading = false;
          if (response.hasOwnProperty('data')) {
            candidate.feed = response.data;
            candidate.feedLength = Math.min(3, candidate.feed.length);
            $scope.loading = false;
          }
        }, function(error, error_type) {
          // if we really want to enfore facebook - here we should direct to the error screen, where the user will be given option to login
          //if (error_type == USER.ERROR_LOGIN) {
            //$location.path('/error/login'+$location.path())
          //}
          candidate.feedLoading = false;
        });
      }
      else
        candidate.hasFeed = false;
    }

    // startup code for the view
    if ($scope.stage == 'novice') {
      USER.login().then(function() {
          $scope.loading = false;
      })
    }
  }
);
