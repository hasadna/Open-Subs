'use strict';

angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngResource',
    'angular-jwt',
    'app.settings'
  ])

  .controller('AppController', function($scope, USER, MESSAGES, $rootScope, $location) {
    $scope.user = USER.get();
    $scope.MESSAGES = MESSAGES;
    $scope.logout = function() {
      USER.logout();
      MESSAGES.add('global', 'info', 'Successfully logged out.');
    };
    $rootScope.$on('USER.change', function(){
      $scope.user = USER.get();
      if (!$scope.user) {
        $location.path('/login');
      }
    })
  })

  .config(function ($routeProvider) {
    $routeProvider
      .when('/splash', {
        templateUrl: 'views/splash.html'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/login/:token', {
        template: '',
        controller: 'LoginTokenController'
      })
      .when('/my-profile', {
        templateUrl: 'views/my-profile.html',
        controller: 'MyProfileController'
      })
      .when('/candidate/:id', {
        templateUrl: 'views/candidate-feed.html',
        controller: 'CandidateController'
      })
      .otherwise({
        redirectTo: '/splash'
      });
  })
  .config(function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
    })
  .factory('MESSAGES', function($rootScope, $sce, $location) {
    var clearOnRouteChange = true;
    var scopes = {};
    // clear all messages when route changes
    $rootScope.$on("$routeChangeSuccess", function() {
      if (clearOnRouteChange) {
        scopes = {};
      } else {
        clearOnRouteChange = true;
      }
    });
    return {
      add: function(scope, type, msg, isHtml) {
        if (!scopes[scope]) scopes[scope] = [];
        var obj = {'type': type, 'msg': msg};
        if (isHtml) obj.isHtml = true;
        var exists = false;
        angular.forEach(scopes[scope], function(aobj) {
          if (aobj.type == obj.type && aobj.msg == obj.msg) {
            exists = true;
          }
        });
        if (!exists) {
          if (obj.isHtml) {
            obj.msg = $sce.trustAsHtml(obj.msg);
          }
          scopes[scope].push(obj);
        }
      },
      get: function(scope) {
        if (!scopes[scope]) {
          scopes[scope] = [];
        }
        return scopes[scope];
      },
      addAfterLocation: function(path, scope, type, msg, isHtml) {
        this.setClearOnRouteChange(false);
        this.add(scope, type, msg, isHtml);
        $location.path(path);
      },
      setClearOnRouteChange: function(what) {
        clearOnRouteChange = ((typeof(what) == 'undefined') ? true : what);
      },
      clear: function(scope) {
        scopes[scope] = [];
      }
    };
  })

;
