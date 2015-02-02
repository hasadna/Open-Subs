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
      // TODO: get list of candidates from http://127.0.0.1:8000/api/v2/person/?format=json&roles__org=%D7%94%D7%91%D7%97%D7%99%D7%A8%D7%95%D7%AA%20%D7%9C%D7%9B%D7%A0%D7%A1%D7%AA%20%D7%94-20
    };
    return OPEN_KNESSET;
  })
;
