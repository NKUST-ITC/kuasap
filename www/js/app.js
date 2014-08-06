// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'pickadate'])

.config(['$httpProvider', function ($httpProvider) {
  //Reset headers to avoid OPTIONS request (aka preflight)
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
}])

.config(function($httpProvider) {
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  delete $httpProvider.defaults.headers.common['Content-type'];
})


.run(function($rootScope, $state, $stateParams, $ionicPlatform) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
      // to be used for back button //won't work when page is reloaded.
      $rootScope.previousState_name = fromState.name;
      $rootScope.previousState_params = fromParams;
      $rootScope.nowState_name = toState.name;
  });

  //back button function called from back button's ng-click="back()"
  $ionicPlatform.registerBackButtonAction(function () {
    if (!$rootScope.previousState_name || $rootScope.nowState_name == "app.login") {
      ionic.Platform.exitApp();
    } else {
      $state.go($rootScope.previousState_name,$rootScope.previousState_params);
    }
  }, 100);


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.course', {
      url: "/ap/course",
      views: {
        'menuContent': {
          templateUrl: "templates/course.html"
        }
      }
    })

    .state('app.score', {
      url: "/ap/score",
      views: {
        "menuContent": {
          templateUrl: "templates/score.html"
        }
      }
    })

    .state('app.leave', {
      url: "/leave",
      views: {
        "menuContent": {
          templateUrl: "templates/leave.html"
        }
      }
    })

    .state('app.bus', {
      url: "/bus",
      views: {
        'menuContent': {
          templateUrl: "templates/bus.html",
          controller: "BusCtrl"
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent': {
          templateUrl: "templates/login.html",
          controller: "AuthCtrl"
        }
      }

    })
    .state('app.events', {
      url: "/events",
      views: {
        'menuContent': {
          templateUrl: "templates/event.html",
          controller: "EventsCtrl"
        }
      }
    })

    .state('app.about', {
      url: "/about",
      views: {
        'menuContent': {
          templateUrl: "templates/about.html"
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});



