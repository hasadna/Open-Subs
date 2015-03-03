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
    'angucomplete-alt',
    'ngFacebook',
    'timer',
    'infinite-scroll',
    'angularSpinner',
    'ui.bootstrap'
  ])

  .config(function ($routeProvider, $resourceProvider, $facebookProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $facebookProvider.setAppId(window.OPEN_SUBS_FB_APP_ID);
    $facebookProvider.setPermissions("public_profile,email");
    $facebookProvider.setVersion("v2.2");
    $routeProvider
      .when('/splash', {
        templateUrl: 'views/splash.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
      })
      .when('/dive', {
        templateUrl: 'views/dive.html',
        controller: 'DiveController'
      })
      .when('/key', {
        templateUrl: 'views/key.html',
        controller: 'ReadyController'
      })
      .when('/key/:team', {
        templateUrl: 'views/key.html',
        controller: 'ReadyController'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/home/:team', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/game/last', {
        templateUrl: 'views/game_last.html',
        controller: 'GameLastController',
        reloadOnSearch: false
      })
      .when('/game/:level', {
        templateUrl: 'views/committee.html',
        controller: 'CommitteeController',
        reloadOnSearch: false
      })
      .when('/committee/:id', {
        templateUrl: 'views/committee.html',
        controller: 'CommitteeController',
        reloadOnSearch: false
      })
      // TODO: refactor to /person/:id
      .when('/candidate/:id', {
        templateUrl: 'views/candidate-feed.html',
        controller: 'CandidateController'
      })
      .when('/login/:next*', {
        templateUrl: 'views/login.html',
        controller: function($scope, USER, $routeParams, $location) {
          USER.login().then(function() {
            $location.path('/'+$routeParams.next);
          });
          $scope.ok = function() {
            USER.register().then(function() {
              $location.path('/'+$routeParams.next);
            }, function() {
              $scope.failed = true;
            });
          }
        }
      })
      .when('/error/:type/:next', {
        templateUrl: 'views/error.html'
      })
      .otherwise({
        redirectTo: '/splash'
      })
    ;
  })

  .factory('DATA', function() {
    return {
      'topOrgsStartWith': [
        'ליכוד',
        'מחנה הציוני',
        'בית היהודי',
        'רשימה המשותפת',
        'כולנו בראשות משה כחלון',
        'ישראל ביתנו',
        'יש עתיד',
        'שס',
        'יהדות התורה',
        'שמאל של ישראל' // this is meretz
      ]
    }
  })

  .factory('USER', function($facebook, $q, SETTINGS, $location) {
    return {
      ERROR_LOGIN: 0,
      ERROR_FBAPI: 1,
      login: function() {
        return $q(function(resolve, reject) {
          if (SETTINGS.noFacebook) {
            resolve();
          } else {
            $facebook.getLoginStatus().then(function(res) {
              if (res.status == 'connected') {
                if (!res || !res.authResponse) {
                  reject();
                } else {
                  resolve(res);
                }
              } else {
                reject();
              }
            });
          }
        });
      },
      register: function() {
        return $q(function(resolve, reject) {
          $facebook.login().then(function(res) {
            if (res.status == 'connected') {
              if (!res || !res.authResponse) {
                reject();
              } else {
                resolve(res);
              }
            } else {
              reject();
            }
          });
        });
      },
      fbapi: function(url) {
        var self = this;
        return $q(function(resolve, reject) {
          self.login().then(function(res) {
            $facebook.api(url).then(function(response) {
              resolve(response);
            }, function(error) {
              console.log('FBapi error: ' + error.message + '\n  url:' + url);
              reject(error, self.ERROR_FBAPI);
            });
          }, function(error) {
            console.log('login error: ' + error.message);
            reject(error, self.ERROR_LOGIN);
          });
        });
      }
    };
  })

  .factory('modal', function($modal) {
    return {
      show: function(template) {
        $modal.open({ templateUrl: template });
      }
    }
  })

  .run( function( SETTINGS ) {
    // expose the configuration on window - this is used for testing
    window.SETTINGS = SETTINGS;
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  })


  .controller('AppController', function($scope) {

  })
  .directive('ngReallyClick', [function() {
    /**
     * A generic confirmation for risky actions.
     * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
     */
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
  }])


;
