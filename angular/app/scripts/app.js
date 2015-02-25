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
        templateUrl: 'views/splash.html',
        'hideHomeIcon': true,
        controller: function($scope, USER, $location) {
          $scope.go = function() {
            USER.login().then(function() {
              $location.path('/home');
            }, function() {
              $location.path('/error/login');
            });
          }
        }
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        helpModalTemplateUrl: 'views/home-help.html'
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
        reloadOnSearch: false,
        helpModalTemplateUrl: 'views/committee-help.html'
      })
      .when('/committee/:id', {
        templateUrl: 'views/committee.html',
        controller: 'CommitteeController',
        reloadOnSearch: false,
        helpModalTemplateUrl: 'views/committee-help.html'
      })
      // TODO: refactor to /person/:id
      .when('/candidate/:id', {
        templateUrl: 'views/candidate-feed.html',
        controller: 'CandidateController'
      })
      .when('/error/:type', {
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
      login: function() {
        return $q(function(resolve, reject) {
          if (SETTINGS.noFacebook) {
            resolve();
          } else {
            $facebook.getLoginStatus().then(function(res) {
              var myresolve = function(res) {
                if (!res || !res.authResponse) {
                  $location.path('/error/login');
                } else {
                  resolve(res);
                }
              };
              if (res.status == 'connected') {
                myresolve(res);
              } else {
                $facebook.login().then(function(res) {
                  if (res.status == 'connected') {
                    myresolve(res);
                  } else {
                    $location.path('/error/login');
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
          self.login().then(function(res) {
            $facebook.api(url).then(function(response) {
              resolve(response);
            }, function(error) {
              console.log('FBapi error: ' + error.message + '\n  url:' + url);
              reject(error);
            });
          }, function(error) {
            console.log('login error: ' + error.message);
            reject(error);
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


  .controller('AppController', function($scope, $rootScope, modal) {
    var helpModalTemplateUrl;
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
      $scope.showHelpIcon = (helpModalTemplateUrl = current.$$route.helpModalTemplateUrl)?true:false;
      $scope.hideHomeIcon = current.$$route.hideHomeIcon;
    });
    $scope.help = function() {
      if (helpModalTemplateUrl) {
        modal.show(helpModalTemplateUrl);
      }
    };
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
