'use strict';

angular.module('app')
  .factory('OPEN_KNESSET', function($q, $resource, SETTINGS) {
    var OPEN_KNESSET = {
      /*
       * use Open_KNESSET.Person to get information on persons
       * for example:
       *   OPEN_KNESSET.Person.get({id: id}, function (person) {
       *        $scope.person = person;
       *      });
       */
      Person: $resource(SETTINGS.oknesset+'/api/v2/person/:id/',
                          {id:'@id'}),
    };
    return OPEN_KNESSET;
  })
;
