angular.module('iNepali.routings', ['ionicUIRouter'])


  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppController'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })
      .state('app.whatisnew', {
        url: '/whatisnew',
        views: {
          'menuContent': {
            templateUrl: 'templates/whatisnew.html'
          }
        }
      })

      .state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'templates/about.html'
          }
        }
      })
      .state('app.favorites', {
        url: '/favorites',
        views: {
          'menuContent': {
            templateUrl: 'templates/favorites.html'
          }
        }
      })
      .state('app.error', {
        url: '/error',
        views: {
          'menuContent': {
            templateUrl: 'templates/error.html'
          }
        }
      })
      .state('app.playlist', {
        url: '/playlist/:indx',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',

          }
        }
      })
      .state('app.albums', {
        url: '/albums',
        views: {
          'menuContent': {
            templateUrl: 'templates/albums.html',

          }
        }
      })
      .state('app.radio', {
        url: '/radio',
        views: {
          'menuContent': {
            templateUrl: 'templates/radio.html',

          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/radio');
  });