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
    'angucomplete',
    'ngFacebook',
    'timer',
    'infinite-scroll',
    'angularSpinner'
  ])

  .config(function ($routeProvider, $resourceProvider, $facebookProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $facebookProvider.setAppId(window.OPEN_SUBS_FB_APP_ID);
    $facebookProvider.setPermissions("public_profile,email");
    $facebookProvider.setVersion("v2.2");
    $routeProvider
      .when('/splash', {
        templateUrl: 'views/splash.html',
        controller: function($scope, USER, $location) {
          $scope.go = function() {
            USER.login().then(function() {
              $location.path('/home');
            }, function() {
              alert('please login');
            });
          }
        }
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/committee/:id', {
        templateUrl: 'views/committee.html',
        controller: 'CommitteeController'
      })
      // TODO: refactor to /person/:id
      .when('/candidate/:id', {
        templateUrl: 'views/candidate-feed.html',
        controller: 'CandidateController'
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

  .factory('USER', function($facebook, $q, SETTINGS) {
    return {
      login: function() {
        return $q(function(resolve, reject) {
          if (SETTINGS.noFacebook) {
            resolve();
          } else {
            $facebook.getLoginStatus().then(function(res) {
              if (res.status == 'connected') {
                resolve(res);
              } else {
                $facebook.login().then(function(res) {
                  if (res.status == 'connected') {
                    resolve(res);
                  } else {
                    reject();
                  }
                });
              }
            });
          }
        });
      },
      fbapi: function(url) {
        var self = this;
        return $q(function(resolve, reject) {
          self.login().then(function(status, res) {
            if (status) {
              $facebook.api(url).then(function(response) {
                resolve(response);
              }, function() {
                reject();
              });
            } else {
              reject();
            }
          }, function() {
            reject();
          });
        });
      }
    };
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
