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
    'app.settings',
    'ezfb'
  ])

  .config(function ($routeProvider, $resourceProvider, ezfbProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    ezfbProvider.setInitParams({
      appId      : window.OPEN_SUBS_FB_APP_ID,
      xfbml      : true,
      version    : 'v2.2'
    });
    $routeProvider
      .when('/splash', {
        templateUrl: 'views/splash.html',
        controller: function($scope, USER, $location) {
          $scope.go = function() {
            USER.login(function(status) {
              if (status) {
                $location.path('/home');
              } else {
                alert('please login');
              }
            });
          }
        }
      })
      .when('/home', {
        templateUrl: 'views/home.html'
      })
      .otherwise({
        redirectTo: '/splash'
      })
    ;
  })

  .factory('USER', function(ezfb, $q) {
    return {
      login: function(callback) {
        ezfb.getLoginStatus(function (res) {
          if (res.status == 'connected') {
            callback(true, res);
          } else {
            ezfb.login(function(res) {
              callback(res.status == 'connected', res);
            }, {scope: 'public_profile,email'});
          }
        });
      },
      fbapi: function(url) {
        var self = this;
        return $q(function(resolve, reject) {
          self.login(function(status, res) {
            if (status) {
              ezfb.api(url, {access_token: res.authResponse.accessToken}, function(response) {
                resolve(response);
              });
            } else {
              reject();
            }
          });
        });
      }
    };
  })

  .controller('AppController', function($scope, ezfb) {

  })

;
