'use strict';

angular.module('app')
  .factory('OPEN_KNESSET', function($q, $http, SETTINGS) {
    var OPEN_KNESSET = {
      get_person: function(user) {
        return $q(function(resolve, reject) {
          $http.get(SETTINGS.backend + '/api/v2/person/?user_id='+user.user_id).success(function(data) {
            resolve(data.objects[0]);
          });
        });
      }
    };
    return OPEN_KNESSET;
  })
;
