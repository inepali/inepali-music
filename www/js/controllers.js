var app = angular.module('iNepali.controllers', [])

app.controller('AppController', function ($scope, $http, $rootScope, $timeout, $state, $stateParams, $cordovaMedia, $cordovaDevice, $cordovaToast, $ionicHistory,
  $ionicLoading, $localStorage, $interval, $location, $ionicNavBarDelegate, $ionicPlatform, $cordovaFile, AdMob, AppService) {

  // start display ad after 3 minutes  
  $timeout(function () {
    // show Banner Ad
    $rootScope.showBanner();

  }, 3000);

  $scope.enableDelete = function () {
    $scope.shouldShowDelete = true;
    $scope.showDeleteButton = false;
  };

  $scope.delete = function (idx) {
    $scope.favorites.splice(idx, 1);
    $localStorage.favorites = $scope.favorites;
    $scope.cancelDelete();
  };

  $scope.cancelDelete = function () {
    $scope.shouldShowDelete = false;
    $scope.showDeleteButton = true;
  };

  $rootScope.shuffle = function () {
    $rootScope.isShuffle = !$rootScope.isShuffle;
  };

  $scope.loadLocals = function () {
    //TODO
  };

  //hide anyionic loading takes more 20 seconds
  //$timeout(function () { $ionicLoading.hide();}, 20000);

  //Loading Albums list available iNepali Database
  $scope.loadRecents = function () {
    $ionicLoading.show({ template: 'Loading...' });
    AppService.getRecents().then(function (response) {

      $scope.recents = response.data;
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  //Loading FM Radio List
  $scope.loadRadio = function () {
    $ionicLoading.show({ template: 'Loading Live FM Radios...' });
    $scope.streams = $localStorage.streams;

    if ($scope.streams == null) {
      $scope.refreshRadio();
    }
    $ionicLoading.hide();
  };

  $scope.refreshRadio = function () {
    $ionicLoading.show({ template: 'Loading Live FM Radios...' });
    AppService.getFmRadio().then(function (response) {
      $localStorage.streams = response.data;
      $scope.streams = $localStorage.streams;
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })
  };
  5

  //Loading Albums list available iNepali Database
  $scope.loadAlbums = function () {
    $ionicLoading.show({ template: 'Loading Albums...' });
    $scope.albums = $localStorage.albums;

    if ($scope.albums == null) {
      $scope.refreshAlbums();
    }
    $ionicLoading.hide();
  };

  $scope.refreshAlbums = function () {
    $ionicLoading.show({ template: 'Loading Albums...' });
    AppService.getAlbums().then(function (response) {
      $localStorage.albums = response.data;
      $scope.albums = $localStorage.albums;
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadPlaylist = function () {
    $ionicLoading.show({ template: 'Loading Playlist...' });

    $scope.selectedAlbumId = Number($state.params.indx);

    //get the selected ablum for title
    $scope.albums.some(function (album, key, _ary) {
      if (album.id == $scope.selectedAlbumId) {
        return $scope.selectedAlbum = album;
      }
    });

    $localStorage.playlist = $localStorage.playlist || [];

    $scope.playlist = null;

    $localStorage.playlist.some(function (item, key, _ary) {
      if (item.albumId == $scope.selectedAlbumId) {
        return $scope.playlist = item.playlist;
      }
    });

    if ($scope.playlist == null) {
      $scope.refreshPlaylist();
    }

    $ionicLoading.hide();

  };

  //Querying playlist available for the given album
  $scope.refreshPlaylist = function () {
    $ionicLoading.show({ template: 'Loading Playlist...' });
    //var selectedIndex = Number($state.params.indx);
    //$scope.selectedAlbum = $scope.albums[selectedIndex];

    AppService.getPlaylist($scope.selectedAlbumId).then(function (response) {
      $scope.playlist = response.data;
      $localStorage.playlist = $localStorage.playlist || [];

      $localStorage.playlist.some(function (item, key, _ary) {
        if (item.albumId == $scope.selectedAlbumId) {
          $scope.$broadcast('scroll.refreshComplete');
          return;
        }
      });
      $ionicLoading.hide();

      $localStorage.playlist.push({ albumId: $scope.selectedAlbumId, 'playlist': $scope.playlist });
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.changeTab = function (idx) {
    $rootScope.Tab = idx;
    //$scope.loadFavorites();
  };


  // loading user favorites
  $scope.loadFavorites = function () {
    $rootScope.Tab = 0;
    $rootScope.favorites = $localStorage.favorites || [];
    $scope.$broadcast('scroll.refreshComplete');
  };

  // selected item into user's favorites list
  $rootScope.addAlbumToFavorites = function ($event, album) {
    $event.stopPropagation();
    $event.preventDefault();

    album.isAlbum = true;

    $rootScope.favorites = $localStorage.favorites || [];

    $rootScope.favorites.some(function (item, key, _ary) {
      if (album.title === item.title) {
        $cordovaToast.showLongCenter('Unable to add to favorites, Duplicated');
        return;
      };
    });

    $rootScope.favorites.push(album);
    $localStorage.favorites = $rootScope.favorites;
    $cordovaToast.showLongCenter(album.title + ' added to your favorites!');
    //$event.stopPropagation();

  }

  $rootScope.addToFavorites = function ($event, obj) {

    $event.stopPropagation();
    $event.preventDefault();

    obj.isAlbum = false;

    $rootScope.favorites = $localStorage.favorites || [];

    $rootScope.favorites.some(function (item, key, _ary) {
      if (obj.title === item.title) {
        $cordovaToast.showLongCenter('Unable to add to favorites list, Duplicated');
        return;
      };
    });

    $rootScope.favorites.push(obj);
    $localStorage.favorites = $rootScope.favorites;
    $cordovaToast.showLongCenter(obj.title + ' added to your favorites!');


  };



  $scope.isFavorite = function (track) {
    $rootScope.favorites = $localStorage.favorites;

    if ($rootScope.favorites == null) return false;

    return $rootScope.favorites.some(function (item, key, _ary) {
      if (track.title === item.title) {
        return true;
      }
    });
    return false;
  };

  // Cordova Media Play functionalist
  $rootScope.stop = function () {
    if ($rootScope.media != null) {
      $rootScope.media.stop();
      $rootScope.media.release();
    }
    $interval.cancel($scope.mediaTimer);
    $rootScope.currentStream = null;
    $rootScope.position = null;
    $rootScope.duration = null;
    $rootScope.isPlaying = false;
  };

  //Media Play Stutus Callback
  var mediaStatusCallback = function (status) {

    if (status == 1) {
      //$ionicLoading.show({ template: 'Loading...' });
      $scope.completed = false;
      $ionicLoading.hide();
      $cordovaToast.showShortBottom('Media loading...');
    } else if (status == 2) { // MEDIA_RUNNING
      $scope.completed = false;
      $cordovaToast.showShortBottom('Media playing ...');
      $rootScope.isPlaying = true;
      MusicControls.updateIsPlaying($rootScope.isPlaying);
    } else if (status == 4) {
      $scope.completed = true;
      $cordovaToast.showShortBottom('Media stopped...');
    } else {
      $scope.completed = false;
    }
  };

  $scope.playTrack = function (track) {
    $rootScope.playerQueue = [];
    $rootScope.playerQueue.push(track);
    $rootScope.play(track);
  };


  $rootScope.playAgain = function () {
    $rootScope.play($rootScope.playerQueue[$rootScope.playerQueueIndex]);
  }

  $rootScope.playNext = function () {
    //$cordovaToast.showLongCenter('Starting next track, length: ' + $rootScope.playerQueue.length + ' and playerQueueIndex: ' + $rootScope.playerQueueIndex);
    $rootScope.playerQueueIndex++;
    $rootScope.play($rootScope.playerQueue[$rootScope.playerQueueIndex]);
  };

  $rootScope.playPrevious = function () {
    $rootScope.playerQueueIndex--;
    $rootScope.play($rootScope.playerQueue[$rootScope.playerQueueIndex]);
  }
  $rootScope.resume = function () {
    if ($rootScope.media != null) {
      $rootScope.media.play();
      $rootScope.isPlaying = true;
      MusicControls.updateIsPlaying($rootScope.isPlaying);
    }
  }

  $rootScope.pause = function () {
    if ($rootScope.media != null) {
      $rootScope.media.pause();
      $rootScope.isPlaying = false;
      MusicControls.updateIsPlaying($rootScope.isPlaying);
    }
  }

  $rootScope.release = function () {
    MusicControls.destroy(function () {
      $rootScope.stop();
    }, function () {
      console.log("MusicControls destroy failed");
    });
  }

  $rootScope.playAll = function () {

    $timeout(function () { $rootScope.showInterstitial(); }, 5000);

    $rootScope.playerQueue = []

    angular.forEach($scope.playlist, function (item, key) {
      $rootScope.playerQueue.push(item)
    });

    if (!$rootScope.isPlaying) {
      $rootScope.playerQueueIndex = 0;
      $rootScope.play($rootScope.playerQueue[$rootScope.playerQueueIndex]);
    }
  }

  $scope.eventsMusicControls = function (action) {
    console.log('Events registered');
    switch (action) {
      case 'music-controls-next':
        $rootScope.playNext();
        break;
      case 'music-controls-previous':
        $rootScope.playPrevious()
        break;
      case 'music-controls-pause':
        $rootScope.pause();

        break;
      case 'music-controls-play':
        $rootScope.resume();
        break;
      case 'music-controls-destroy':
        $rootScope.release();
        break;

      // External controls (iOS only)
      case 'music-controls-toggle-play-pause':
        // Do something
        break;

      // Headset events (Android only)
      // All media button events are listed below
      case 'music-controls-media-button':
        // Do something
        break;
      case 'music-controls-headset-unplugged':
        $rootScope.stop();
        break;
      case 'music-controls-headset-plugged':
        // Do something
        break;
      default:
        break;
    }
  };



  $scope.createMusicControls = function (_track) {
    console.log('Creating Music Controls')
    MusicControls.create({
      track: _track.title,        // optional, default : ''
      artist: _track.description,      // optional, default : ''
      cover: _track.iconUrl,        // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true,           // optional, default : true
      dismissable: true,     // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: $scope.hasPrev,      // show previous button, optional, default: true
      hasNext: $scope.hasNext,      // show next button, optional, default: true
      hasClose: false,       // show close button, optional, default: false

      // iOS only, optional
      album: $scope.selectedAlbum == null ? '' : $scope.selectedAlbum.title,     // optional, default: ''
      duration: $rootScope.duration,          // optional, default: 0
      elapsed: $rootScope.position,            // optional, default: 0

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker: "iNepali Music is playing " + _track.title
    }, function () {
      // When success
      console.log("MusicControls Create successful")

    }, function () {
      console.log("MusicControls Create unsuccessful")
    });

  };



  // Media Play selected
  $rootScope.play = function (track) {

    if ($rootScope.currentStream != null) {
      $rootScope.stop();
    }

    $scope.completed = false;

    $rootScope.currentStream = track;;

    var iOSPlayingOptions = {
      numberOfLoops: 1,
      playAudioWhenScreenIsLocked: true
    };

    // the platform 
    var platform = $cordovaDevice.getPlatform();

    $cordovaToast.showLongBottom('Media Buffering');
    //$ionicLoading.show({ template: 'Buffering ...' });
    $rootScope.media = new Media($rootScope.currentStream.mediaUrl, null, null, mediaStatusCallback);

    if (platform == 'iOS') {
      $rootScope.media.play(iOSPlayingOptions);
    } else {
      $rootScope.media.play();
    }

    // Get duration of media if availalbe
    var counter = 0;
    $scope.timerDur = $interval(function () {
      counter = counter + 100;
      if (counter > 2000) {
        $interval.cancel($scope.timerDur);
      }
      var dur = $rootScope.media.getDuration();
      if (dur > 0) {
        $interval.cancel($scope.timerDur);
        $rootScope.duration = dur;
      }
    }, 1000);

    // Update media position every second
    $scope.mediaTimer = $interval(function () {
      // get media position
      $rootScope.media.getCurrentPosition(function (position) {
        //$cordovaToast.showLongCenter('current position::' + position);
        if ($scope.completed) {
          //$cordovaToast.showShortBottom('Media Completed! Playing next ...');
          if ($rootScope.playerQueue.length > 1 && $rootScope.playerQueueIndex < $rootScope.playerQueue.length - 1) {
            if ($rootScope.isShuffle) {
              $rootScope.playerQueueIndex = Math.floor((Math.random() * $rootScope.playerQueue.length) + 1);
              $cordovaToast.showShortBottom('Playing Next Media in shuffle ...' + $rootScope.playerQueueIndex);
            }
            $rootScope.playNext();
          } else if ($rootScope.playerQueueIndex == $rootScope.playerQueue.length - 1) {
            $rootScope.playerQueueIndex = 0;
            $rootScope.playNext();
          }
        }

        if (position > -1) {
          //console.log((position) + " sec");
          $rootScope.position = Math.floor(position);
          //$rootScope.isPlaying = true;
          //$ionicLoading.hide();
        } //else {
        //$rootScope.isPlaying = false;
        //}
      },
        // error callback
        function (e) {
          console.log("Error getting pos=" + e);
          //$ionicLoading.hide();
        }
      );
    }, 1000);

    if (!$scope.eventSubscribed) {

      // Register callback 
      MusicControls.subscribe($scope.eventsMusicControls);

      // Start listening for events 
      // The plugin will run the events function each time an event is fired 
      MusicControls.listen();

      $scope.eventSubscribed = true;
    }

    if (track.id == -1) {
      $scope.hasPrev = true;
      $scope.hasNext = true;

      if ($rootScope.playerQueueIndex == 0) {
        $scope.hasPrev = false;
      } else if ($rootScope.playerQueue.length > 1 && $rootScope.playerQueueIndex == $rootScope.playerQueue.length - 1) {
        $scope.hasNext = false;
      }
    } else {
      $scope.hasPrev = false;
      $scope.hasNext = false;
    }

    $scope.createMusicControls(track);

  };


  /**************************************
   * AdMob Banner Ad Code 
   *************************************/

  //Banner Ad Implementation
  $rootScope.showBanner = function () {

    // $cordovaToast.showLongCenter('Show banner called!');
    var done = AdMob.showBanner();
    if (!done) {
      $ionicPopup.show({
        title: "AdMob is not ready",
        buttons: [
          {
            text: 'Got it!',
            type: 'button-positive',
            onTap: function (e) {
            }
          }
        ]
      })
    }
  };

  $rootScope.removeBanner = function () {
    AdMob.removeAds();
  };

  $rootScope.showInterstitial = function () {

    var done = AdMob.showInterstitial();
    if (!done) {
      $ionicPopup.show({
        title: "AdMob is not ready",
        buttons: [
          {
            text: 'Got it!',
            type: 'button-positive',
            onTap: function (e) {
            }
          }
        ]
      })
    }
  };


  $scope.completed = false;
  $rootScope.isShuffle = false;
  $rootScope.duration = null;
  $rootScope.playerQueue = null;
  $rootScope.playerQueueIndex = 0;
  $scope.selectedIndex = null;
  $scope.locals = null;
  $scope.stream = {};
  $scope.shouldShowDelete = false;
  $scope.showDeleteButton = true;
  $rootScope.favorites = null;

  $rootScope.fontsize = 25;
  $rootScope.iconWidth = 40;
  $rootScope.iconHeight = 40;
  $scope.hasNext = false;
  $scope.hasPrev = false;
  $scope.isLiveFm = false;
  $scope.isAlbum = false;

  $scope.eventSubscribed = false;
});