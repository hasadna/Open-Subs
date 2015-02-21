'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $routeParams, $location, $window, $q, modal) {
    $scope.modal = modal;
    $scope.loading = true;
    $scope.chairs = [];
    $scope.reset = function () {
      for (var i=0; i < this.rows.length; i++) {
        var row = $scope.rows[i];
        for (var j=0; j < row.length; j++) {
          $window.sessionStorage.setItem('chair'+row[j].id, null);
          row[j].chosen = null;
        }
      }
    };

    $scope.generateTeamUrl = function() {
    var elected_team = "";
    for (var i=0;i<$scope.committees.length;i++){
      var comm_id = $scope.committees[i].id;
      var cand_id = $window.sessionStorage.getItem('chair'+comm_id);
      // if null
      cand_id = cand_id ? cand_id : "";
      //if "null"
      cand_id = cand_id!="null" ? cand_id : "";
      elected_team += "-"+cand_id;
      }
    elected_team = "#/home/"+elected_team.substr(1,elected_team.length);
    return elected_team;
    };

    $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(function(res) {
      // Applying elected from url
      var elected_team = $routeParams.team;
      $scope.viewOnly = false;
      if (!!elected_team){
        elected_team = elected_team.split("-");
        var seen = {};
        var ignore_input=false;
        // First thing checking length to prevent dos
        if (res.committees.length == elected_team.length){
          // Checking dups
          for (var i=0;i<elected_team.length; i++) {
            if (!!elected_team[i] && seen.hasOwnProperty(elected_team[i])) {
              // Duplicate
              ignore_input = true;
            }
            seen[elected_team[i]] = true;
          }
          if (!ignore_input) {
            // All test completed. move to view only
            $scope.viewOnly = true;
          }
        }
      } 

      $scope.rows = [[],[]];
      for (var i=0; i < res.committees.length; i++) {
        var c = res.committees[i],
            electedId = $window.sessionStorage.getItem('chair'+c.id),
            comm_url="#"+c.absolute_url,
            row = Math.floor(i/6);
            if ($scope.viewOnly && !!elected_team) {
              // View only. taking candidate id from url
              electedId = elected_team[i] ? parseInt(elected_team[i],10) : null;
              comm_url="javascipt: (void);";
            }
        $scope.rows[row].push ({
          name: c.name, absolute_url: comm_url, id: c.id,
          chosen: res.candidates[electedId]
        });
      }
      
      $scope.loading = false;
      $scope.committees = res.committees;
      // TODO: Use this to get the team url
      $scope.teamUrl = $scope.generateTeamUrl();
    });
    var firstTime = $window.sessionStorage.getItem('firstTimeHome') || 1;

    firstTime = eval(firstTime);
    $scope.firstTime = firstTime;
    $scope.go = function () {
      $window.sessionStorage.setItem('firstTimeHome', "0");
      $scope.firstTime = false;
    }
  })
;
