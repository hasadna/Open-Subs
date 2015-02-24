'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $routeParams, $location, $window, $q, $modal) {
    var firstTime = true,
        numChosen = 0;
    if (window.sessionStorage.hasOwnProperty('firstTimeHome'))
     firstTime =  eval(window.sessionStorage.getItem('firstTimeHome'));

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
    $scope.help = function () {
      $modal.open({ templateUrl: "/views/home-help.html", scope: $scope });
    };

    function generateTeamUrl(committees) {
      var elected_team = "";
      for (var i=0;i<committees.length;i++){
        var comm_id = committees[i].id;
        var cand_id = $window.sessionStorage.getItem('chair'+comm_id);
        // if null
        cand_id = cand_id ? cand_id : "";
        //if "null"
        cand_id = cand_id!="null" ? cand_id : "";
        elected_team += "-"+cand_id;
        }
      elected_team = 'https://'+$location.host()+':'+$location.port()+"#/home/"+elected_team.substr(1,elected_team.length);
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
            electedId = eval($window.sessionStorage.getItem('chair'+c.id)),
            comm_url="#"+c.absolute_url,
            row = Math.floor(i/6);
        if ($scope.viewOnly && !!elected_team) {
          // View only. taking candidate id from url
          electedId = elected_team[i] ? parseInt(elected_team[i],10) : null;
          comm_url="javascipt: (void);";
        }
        var win = {name: c.name, absolute_url:comm_url, id: c.id};
        if (electedId) {
          win.chosen = res.candidates[electedId];
          numChosen++;
        }
        else
          win.chosen = null;
        $scope.rows[row].push (win);
      }
      $scope.loading = false;
      if (!$scope.viewOnly && numChosen == 12) {
        $scope.teamUrl = generateTeamUrl(res.committees);
        window.startFireworks();
        $modal.open({ templateUrl: "/views/finished.html", scope: $scope });
      }
      // TODO: Use this to get the team url
    });
    if (firstTime) {
      $window.sessionStorage.setItem('firstTimeHome', "false");
      $scope.help();
    }
  })
;
