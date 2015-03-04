'use strict';

angular
  .module('app')
  .controller('KeyController', function($scope, $timeout, OPEN_KNESSET,
                  $routeParams, $location, $window, $q, $log) {
    var db,
        myChairs = [],
        diff = [],
        key = {chairs: [], abs: "", rel: ""};

    $scope.adopt = function (chair) {
      var i = diff.indexOf(chair);
      $window.sessionStorage.setItem(toKey(i.id), chair.suggestedId);
      diff.splice(i, 1);
    }

    function drawKey () {
        var canvas = $window.document.getElementById('key-canvas');
        canvas.width = 560;
        canvas.height = 427;
        var ctx = canvas.getContext('2d');
        var back= new Image();
        back.src = "/images/key.png";
        back.onload = function() {
             ctx.drawImage(back,0,0);
             $scope.keyImage = ctx.canvas.toDataURL();
        }

        // Make sure the image is loaded first otherwise nothing will draw.
        var step = 1;
        for (var i=0; i < key.chairs.length; i++) {
            var c = db.committees[i],
                e = key.chairs[i],
                chosen = (e)?db.candidates[e]:{ name: 'כיסא ריק' };

            ctx.save();
            ctx.translate(canvas.width - step*30, 116);
            ctx.rotate((Math.PI/2)*3);
            ctx.font = "16pt Alef";
            ctx.textAlign = "right";
            var m = ctx.measureText(chosen.name)
            ctx.fillStyle = '#FCC221';
            ctx.fillRect(10, 5, 0-m.width-20, -28);
            // ctx.fillStyle = '#FCD421';

            ctx.fillStyle = '#80470E';
            ctx.fillText(chosen.name, 0, -2)
            ctx.restore();
            step++;
          }
    };
    function toKey(i) { return 'chair'+i };
    function fillData(res) {
      var RATE = 200,
          LEN = (1000 * 10)/ RATE,
          count = 0,
          cycle = 0;

      db = res;

      // add the `abs and `rel` url properties to `key`
      key.rel = $location.url();
      key.abs = ($location.port() == 443)?
        'https://'+ $location.host()+key.rel:
        'https://'+ $location.host()+':'+$location.port()+key.rel;

      var len = 0;
      for (var i=0; i < db.committees.length; i++) {
        myChairs[i] = db.candidates[$window.sessionStorage.getItem(toKey(i))];
        if (myChairs[i] & myChairs[i] != 0)
          len++;
      }
      $scope.myChairs = myChairs;
      $scope.myChairsLen = len;
      // get an array with diffrences between session's key
      // and `key.chairs`
      for (var i=0; i < myChairs.length; i++) {
        if (myChairs[i] != key.chairs[i]) {
          var c = db.committees[i];
          console.log(myChairs[i]);
          diff.push({name: c.name,
                   id: c.id,
                   chosen: myChairs[i],
                   suggested: db.candidates[key.chairs[i]].name,
                   suggestedId: key.chairs[i],
                  });
        }
      }
      $scope.diff = diff;
      $scope.key = key;
      $window.sessionStorage.setItem("stage", 'ready');
      $timeout(drawKey);
    };

    var cs = $routeParams.team;
    if (cs) {
      cs = cs.match(/([a-z0-9]{3})/g);
      if (cs.length == 12) {
        key.length = 0;
        key.chairs = [];
        for (var i=0; i<12; i++) {
          var id = parseInt(cs[i],36);
          key.chairs[i] = id;
          if (id > 0)
            key.length ++
        }
      }
      else {
        $log.error("got a bad key in the url - "+$routeParams.team);
        $location.path('/error/1/home');
      }
    }
    $scope.key = key;

    return $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(fillData);

  });
