'use strict';

angular
  .module('app')
  .controller('DiveController', function($scope, USER, OPEN_KNESSET,
                                         $interval, $location, $window, $q, $modal) {
    var db;

    function onDBReady(res) {
      var RATE = 200,
          LEN = (1000 * 10)/ RATE,
          db = res,
          cycle = 0;

      // setup the sequencer
      var seq = $interval(function () {
          if (LEN < cycle++) {
            // looks like it's the last time we're running
            $interval.cancel(seq);
            $window.sessionStorage.setItem("stage", "electing");
            $location.path(OPEN_KNESSET.teamUrl().rel);
          }

          $(".cycle").each(function () {
            var src = $(this).attr('src');
            var convert = {'A': 'B', 'B': 'A'};
            src = src.replace(/([AB])/, function (match) {
              return convert[match];
            });
            $(this).attr('src', src);
          })
      }, RATE)
      $scope.loading = false;
    }

    return $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(onDBReady);

  });

