'use strict';

angular
  .module('app')
  .controller('ReadyController', function($scope, $timeout, OPEN_KNESSET, $routeParams,
                                         $interval, $location, $window, $q, $modal) {
    var db,
        electedTeam = $routeParams.team;

    function drawKey () {
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
        for (var i=0; i < db.committees.length; i++) {
            var c = db.committees[i];
            var e = electedTeam[i];
            // TODO: move next couple of line to open_knesset.js
            (e)?  c.chosen = db.candidates[e]:
                  c.chosen = { name: 'כיסא ריק' };

            ctx.save();
            ctx.font = "16pt Alef";
            ctx.fillStyle = '#80470E';
            ctx.textAlign = "right";
            ctx.translate(canvas.width - step*24, 116);
            ctx.rotate((Math.PI/2)*3);
            ctx.fillText(c.chosen.name, 0, 0)
            ctx.restore();
            step++;
          }
    };
    function onDBReady(res) {
      var RATE = 200,
          LEN = (1000 * 10)/ RATE,
          count = 0,
          cycle = 0;

      db = res;
      $scope.url = OPEN_KNESSET.teamUrl();
      electedTeam = electedTeam.match(/([a-z0-9]{3})/g);
      if (electedTeam.length == 12) {
        $scope.gotKey = true
        for (var i=0; i<12; i++) {
          var id = parseInt(electedTeam[i],36);
          electedTeam[i] = id;
          if (id > 0) count++;
        }
      }
      else
        $scope.badKey = true;
      $scope.subStaffed = count == 12;
      $window.sessionStorage.setItem("stage", 'ready');
      $timeout(drawKey);
    };

    return $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(onDBReady);

  });


