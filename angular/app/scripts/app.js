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
        templateUrl: 'views/splash.html',
        controller: function($scope, $location, $window, SETTINGS) {
          $scope.go = function() {
            if ($window.sessionStorage.isFacebook) {
              $window.location.href = SETTINGS.backend+'/users/login-redirect-facebook-canvas-start/opensubs/';
            } else {
              $location.path('/home');
            }
          }
        }
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/my-profile', {
        templateUrl: 'views/my-profile.html',
        controller: 'MyProfileController'
      })
      .when('/login/:token', {
        template: '',
        // this is called from the backend - after the user is authenticated
        // in this case we login the user, then redirect to the homepage
        controller: function($scope, $routeParams, USER, $location) {
          USER.loginToken($routeParams.token);
          $location.path('/home');
        }
      })
      .when('/facebook/login/:token', {
        template: '',
        // this is called from the backend - inside the facebook canvas iframe
        // in this case we login the user, mark the user as facebook user, then redirect to the homepage
        controller: function($routeParams, USER, $location, $window) {
          console.log('123');
          $window.sessionStorage.isFacebook = true;
          USER.loginToken($routeParams.token);
          $location.path('/home');
        }
      })
      .when('/facebook/splash', {
        template: '',
        // this is called from the backend - inside the facebook canvas iframe
        // in this case we just save that the user is from facebook, then show the normal splash screen
        controller: function($window, $location) {
          $window.sessionStorage.isFacebook = true;
          $location.path('/splash');
        }
      })
      .otherwise({
        redirectTo: '/splash'
      })
    ;
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
