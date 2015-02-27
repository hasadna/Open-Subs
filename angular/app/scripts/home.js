'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $routeParams,
                                         $timeout, $location, $window, $q, $modal) {
    var firstTime = true,
        db;
    if ($window.sessionStorage.hasOwnProperty('firstTimeHome'))
     firstTime =  eval($window.sessionStorage.getItem('firstTimeHome'));

    $scope.loading = true;
    $scope.chairs = [];
    $scope.buttonPublish = true;

    $scope.reset = function () {
      for (var i=0; i < this.rows.length; i++) {
        var row = $scope.rows[i];
        for (var j=0; j < row.length; j++) {
          $window.sessionStorage.setItem('chair'+row[j].id, null);
          row[j].chosen = null;
        }
      }
    };
    $scope.publish = function () {
      this.$close();
      $scope.teamUrl = generateTeamUrl(db.committees);
      // $scope.teamImage = drawKey(db.committees);
      $modal.open({ templateUrl: "/views/publish.html", scope: $scope }).result.then(function () {
        alert('כאילו פירסמתי');
      });
    };

    $scope.firstButton = function () {
      $scope.teamUrl = generateTeamUrl(db.committees);
      $scope.rows = makeRows();
      $modal.open({ templateUrl: "/views/key.html", scope: $scope }).opened.then(drawKey);
    };

    $scope.help = function () {
      $modal.open({ templateUrl: "/views/home-help.html",
                    size: "lg",
                    windowClass: "home-help",
                    scope: $scope });
    };

    function drawKey () {
      $timeout(function () {
        var canvas = document.getElementById('key-canvas');
        canvas.width = 560;
        canvas.height = 300;
        var ctx = canvas.getContext('2d');
        var back= new Image();
        back.src = "/images/key.png";
        back.onload = function() {
             ctx.drawImage(back,0,0);
             $scope.keyImage = ctx.canvas.toDataURL();
        }

        // Make sure the image is loaded first otherwise nothing will draw.
        var step = 1;
        for (var i=0; i < $scope.rows.length; i++)
          for (var j=0; j < $scope.rows[i].length; j++) {
            var com = $scope.rows[i][j];
            ctx.save();
            ctx.font = "16pt Alef";
            ctx.fillStyle = '#80470E';
            ctx.textAlign = "right";
            ctx.translate(canvas.width - step*24, 116);
            ctx.rotate((Math.PI/2)*3);
            ctx.fillText(com.chosen.name, 0, 0)
            ctx.restore();
            step++;
          }
      });
    }

    function generateTeamUrl(committees) {
      var electedTeam = "";
      for (var i=0;i<committees.length;i++){
        var comm_id = committees[i].id;
        var cand_id = $window.sessionStorage.getItem('chair'+comm_id);
        // if null
        cand_id = cand_id ? cand_id : "";
        //if "null"
        cand_id = cand_id!="null" ? cand_id : "";
        electedTeam += "-"+cand_id;
        }
      electedTeam = 'https://'+$location.host()+':'+$location.port()+"#/home/"+electedTeam.substr(1,electedTeam.length);
      return electedTeam;
    };

    function makeRows(electedTeam) {
      var r = [[], []];
      // returns the rows of windows/tooths
      var numChosen = 0;
      for (var i=0; i < db.committees.length; i++) {
        // for each committe do
        var c         = db.committees[i],
            electedId = eval($window.sessionStorage.getItem('chair'+c.id)),
            comm_url  ="#"+c.absolute_url,
            row       = Math.floor(i/6);

        if ($scope.viewOnly && !!electedTeam) {
          // View only. taking candidate id from url
          electedId = electedTeam[i] ? parseInt(electedTeam[i],10) : null;
          comm_url="javascipt: (void);";
        }
        var win = {name: c.name,
                   absolute_url:comm_url,
                   id: c.id,
                   right: i*30};
        if (electedId) {
          win.chosen = db.candidates[electedId];
          win.empty = false;
          numChosen++;
        }
        else {
          win.chosen = { name: 'כיסא ריק' };
          win.empty = true;
        }
        r[row].push (win);
      }
      $scope.subStaffed = numChosen >= SETTINGS.staffedSubChairs;
      $scope.chairsLeft = SETTINGS.staffedSubChairs - numChosen;
      return r;
    };

    function onDBReady(res) {
      // Applying elected from url
      var electedTeam = $routeParams.team;

      db = res;
      $scope.committees = db.committees
      $scope.viewOnly = false;
      if (!!electedTeam){
        electedTeam = electedTeam.split("-");
        var seen = {};
        var ignore_input=false;
        // First thing checking length to prevent dos
        if (db.committees.length == electedTeam.length){
          // Checking dups
          for (var i=0;i<electedTeam.length; i++) {
            if (!!electedTeam[i] && seen.hasOwnProperty(electedTeam[i])) {
              // Duplicate
              ignore_input = true;
            }
            seen[electedTeam[i]] = true;
          }
          if (!ignore_input) {
            // All test completed. move to view only
            $scope.viewOnly = true;
          }
        }
      }
      $scope.rows = makeRows(electedTeam);
      $scope.loading = false;
      /*
      if (!$scope.viewOnly && numChosen == 12) {
        $scope.teamUrl = generateTeamUrl(db.committees);
        window.startFireworks();
        $modal.open({ templateUrl: "/views/finished.html", scope: $scope });
      }
     */
    };

    $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(onDBReady);

    if (firstTime) {
      $window.sessionStorage.setItem('firstTimeHome', "false");
      $scope.help();
    }
  })
;
