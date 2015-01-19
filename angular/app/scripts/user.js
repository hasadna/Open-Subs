'use strict';

angular.module('app')

  .factory('USER', function($window, $q, $http, SETTINGS, $rootScope, jwtHelper) {
    var USER = {};
    USER.get = function() {
      if ($window.sessionStorage.userToken) {
        var payload = jwtHelper.decodeToken($window.sessionStorage.userToken);
        return {
          'username': payload.username,
          'user_id': payload.user_id,
          'email': payload.email
        };
      } else {
        return false;
      }
    };
    USER.login = function(credentials) {
      return $q(function(resolve, reject) {
        $http
          .post(SETTINGS.backend+'/api-token-auth/', credentials)
          .success(function(data) {
            $window.sessionStorage.userToken = data.token;
            resolve(USER.get());
          })
          .error(function() {
            delete $window.sessionStorage.userToken;
            reject();
          })
        ;
      }).finally(function() {
        $rootScope.$broadcast('USER.change');
      });
    };
    USER.loginToken = function(token) {
      $window.sessionStorage.userToken = token;
      var user = USER.get();
      $rootScope.$broadcast('USER.change');
      return user;
    };
    USER.logout = function() {
      delete $window.sessionStorage.userToken;
      $rootScope.$broadcast('USER.change');
    };
    return USER;
  })

  .factory('authInterceptor', function($rootScope, $q, $window, SETTINGS, MESSAGES) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.userToken) {
          config.headers.Authorization = 'JWT ' + $window.sessionStorage.userToken;
        }
        return config;
      },
      responseError: function (response) {
        if (response.status === 401) {
          MESSAGES.add('global', 'danger', 'פג תוקף הכניסה למערכת, <a onClick="window.location.reload()">ליחצו כאן להיכנס שוב</a>.');
        } else if (response.status == 0) {
          MESSAGES.add('global', 'danger', 'שגיאת חיבור לשרת <a href="'+SETTINGS.backend+'">'+SETTINGS.backend+'</a>');
        }
        return response || $q.when(response);
      }
    };
  })

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }])

  .controller('LoginController', function($scope, USER, MESSAGES, $window, $location, SETTINGS, $sce) {
    $scope.iframe_src = $sce.trustAsResourceUrl(SETTINGS.backend+'/users/login?is_iframe=1&next=/users/login-redirect-opensubs');
    $(window).on("message", function(e) {
      USER.loginToken(e.originalEvent.data);
      $window.location.href = '/#/home';
    });
    //$scope.error = '';
    //$scope.credentials = {
    //  'username': '',
    //  'password': ''
    //};
    //$scope.login = function(credentials) {
    //  USER.login(credentials).then(function() {
    //    MESSAGES.addAfterLocation($window.sessionStorage.afterlogin ? $window.sessionStorage.afterlogin : '/', 'global', 'info', 'כניסה למערכת בוצעה בהצלחה');
    //  }).catch(function() {
    //    MESSAGES.add('global', 'danger', 'שם משתמש או סיסמה שגויים');
    //  });
    //};
    //$scope.cancel = function() {
    //  $location.path($window.sessionStorage.afterlogin ? $window.sessionStorage.afterlogin : '/');
    //}
  })

;
