'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $routeParams,
                                         $timeout, $location, $window, $q, $modal) {
    var db,
        stage = $window.sessionStorage.getItem('stage') || "welcome";

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
      storeKey();
      $scope.teamUrl = generateTeamUrl().abs;
      $modal.open({ templateUrl: "/views/publish.html", scope: $scope }).result.then(function () {
        alert('כאילו פירסמתי');
      });
    };

    $scope.firstButton = function () {
      var url = OPEN_KNESSET.teamUrl();
      console.log(url.rel);
      $location.path(url.rel);
    };

    $scope.help = function () {
      $modal.open({ templateUrl: "/views/home-help.html",
                    size: "lg",
                    windowClass: "home-help",
                    scope: $scope });
    };

    $scope.adoptKey = function () {
      // copy the key from the display to seesion storage
      storeKey();
      this.$close()
      $location.path('/home');
    }

    $scope.about = function () {
      this.$close()
      $location.path('/about');
    }

    $scope.go = function (chair) {
      $scope.loading = true;
      var url = chair.absolute_url; // .substr(1);
      USER.login().then(function() {
        $location.path(url.substr(1));
      }, function() {
        $location.path('/login/'+url.substr(2));
      });
    }

    function storeKey() {
      for (var i=0; i < $scope.rows.length; i++)
        for (var j=0; j < $scope.rows[i].length; j++) {
          var com = $scope.rows[i][j];
          $window.sessionStorage.setItem('chair'+com.id, com.chosen.id);
        }
    }
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

        var win = {name: c.name,
                   absolute_url:comm_url,
                   id: c.id,
                   right: i*30};

        if (electedId)
          numChosen++;
        if ($scope.gotKey && !!electedTeam)
          // View only. taking candidate id from url
          electedId = electedTeam[i] ? electedTeam[i] : null;

        if (electedId) {
          win.chosen = db.candidates[electedId];
          win.empty = false;
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

    function getDiff(electedTeam) {
      var r = [];
      for (var i=0; i < db.committees.length; i++) {
        // for each committe do
        var c         = db.committees[i],
            electedId = eval($window.sessionStorage.getItem('chair'+c.id));
        if (electedId != electedTeam[i])
          r.push({ name: c.name,
                   id: c.id,
                   chosen: (electedId != null)?db.candidates[electedId].name:"",
                   suggested: db.candidates[electedTeam[i]].name,
                   suggestedId: electedTeam[i]
          });
       }
       return r;
    }
    function adoptChair(chair) {
      $window.sessionStorage.setItem('chair'+chair.id, chair.suggestedId);
      var i = this.chairs.indexOf(chair);
      this.chairs.splice(i, 1);
      if (this.chairs.length == 0)
        this.$close();
    }
    function onDBReady(res) {
      // Applying elected from url
      var electedTeam = $routeParams.team;
      db = res;
      $scope.committees = db.committees
      if (electedTeam) {
        electedTeam = electedTeam.match(/([a-z0-9]{3})/g);
        if (electedTeam.length == 12) {
          $scope.gotKey = true
          for (var i=0; i<12; i++)
            electedTeam[i] = parseInt(electedTeam[i],36);
        }
        else
          $scope.badKey = true;
      }
      else {
        $scope.teamUrl = OPEN_KNESSET.teamUrl();
        $scope.gotKey = false;
      }

      $scope.rows = makeRows(electedTeam);
      $scope.loading = false;

      if ($scope.gotKey)
        if ($scope.chairsLeft == 12)
          stage = 'adopt';
        else
          stage = 'merge';

      // default is to stay at state
      var nextStage = stage;
      switch (stage) {
        case 'welcome':
          nextStage = 'electing';
          $scope.help();
          break;

        case 'electing':
          if ($scope.chairsLeft <= 0)
            nextStage = "dive"
          else
            break;

        case 'dive':
          window.startFireworks();
          $timeout(function () {
            window.stopFireworks();
            $location.path("/dive")
          }, 7000);

          break;

        case 'adopt':
          $modal.open({ templateUrl: "/views/got_key.html", scope: $scope })
                     .opened.then(drawKey)
          break;

        case 'merge':
          var scope = $scope.$new();
          scope.chairs = getDiff(electedTeam);
          if (scope.chairs.length > 0) {
            scope.adoptChair = adoptChair;
            $modal.open({ templateUrl: "/views/merge.html", scope: scope})
                  .result.then(function() {
                    $location.path("/home");
                  });
          }
          break;

      };
      $window.sessionStorage.setItem("stage", nextStage);
    };

    return $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(onDBReady);

  })
;
