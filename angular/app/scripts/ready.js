'use strict';

angular
  .module('app')
  .controller('ReadyController', function($scope, $timeout, OPEN_KNESSET,
                                         $interval, $location, $window, $q, $modal) {
    var db;

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
            var com = db.committees[i];
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
    };
    function onDBReady(res) {
      var RATE = 200,
          LEN = (1000 * 10)/ RATE,
          db = res,
          cycle = 0;

      $timeout(drawKey);
    };

    return $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(onDBReady);

  });


