'use strict';

angular
  .module('app')
  .controller('CommitteeController', function($location, $scope, $window,
                                              OPEN_KNESSET, $routeParams, $q,
                                              $compile) {
    var committee_id = $routeParams.id;
    $q.all({
      committee: OPEN_KNESSET.get_committee(committee_id),
      candidates: OPEN_KNESSET.get_candidates()
    }).then(function(res) {
      var candidatesArray = $.map(res.candidates, function(v){return v;});
      // build a candidates array ordered by group and then A-z
      var i, j, orgs = {}, candidates = {};
      for (i=0; i < candidatesArray.length; i++) {
        var c = candidatesArray[i];
        for (j=0; j < c.roles.length; j++) {
          var role = c.roles[j];
          if (role.org == "הבחירות לכנסת ה-20") {
            var org = role.text.match(/מקום (\d+) ב(.+)/);
            if (org !== null && org.length == 3){
              c.ord = parseInt(org[1]);
              org = org[2];
              if (org in orgs)
                candidates[org].push(c)
              else {
                orgs[org] = true;;
                candidates[org] = [c];
              }
              // finished with this candidates, break to stop looping on roles
              break;
            }
          }
        }
      }
      var len = 0
      for (var org in orgs) {
        // var org = orgs[i];
        candidates[org].sort(function (a, b) {
          return a.ord - b.ord;
        })
        len++;
      }
      candidates.length = len;
      $scope.candidatesArray = candidatesArray;
      $scope.candidates = candidates;
      $scope.committee = res.committee;
    });
    $scope.$watch(function (scope) { return scope.selectedChair; },
                  function (new_value, old_value) {
      if (new_value) {
        //TODO: code a factory for chairs
        $window.sessionStorage.setItem('chair'+committee_id,
              new_value.originalObject.id);
        $location.path('/home');
      }
    });
    $scope.elect = function () {
        $window.sessionStorage.setItem('chair'+committee_id, this.candidate.id);
        $location.path('/home');
    };
    $scope.expand = function (ev) {
        var next = ev.target.nextElementSibling;
        if (next === null)
          $compile('<candidate></candidate>')(this, function(elm, scope) {
            $('#candidate-'+scope.candidate.id).append(elm);
          })
        else
          $(next).toggle();

    };
    // TODO: this code was copied from home.js, need to rinse
    var firstTime = $window.sessionStorage.getItem('firstTimeCommittee') || true;
    $scope.firstTime = eval(firstTime);
    $scope.go = function () {
      $window.sessionStorage.setItem('firstTimeCommittee', "false");
      $scope.firstTime = false;
    }

  })
;

