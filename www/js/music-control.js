angular.module('iNepali.music-controls', [])
    .factory('MusicControls', function ($window, $rootScope) {
        var _musicControl;
        
        var onSuccess = function(response)
        {
            console.log(resposne);
            console.log("Music Control created");
        };

        var onError = function(err){
            console.log(err)
            
            
        }

        return {
            events: function (action) {
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
                        $rootScope.play();
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
                    console.log("Music Control events registered");
            },
            create: function (_track, _hasPrev, _hasNext, _hasClose, _album) {
                this.init();

                if (_musicControl) {

                    console.log("Music Control events registered");

                    _musicControl.create({
                        track: _track.title,        // optional, default : ''
                        artist: _track.description,      // optional, default : ''
                        cover: _track.iconUrl,        // optional, default : nothing
                        // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
                        //           or a remote url ('http://...', 'https://...', 'ftp://...')
                        //isPlaying: _isPlaying,           // optional, default : true
                        //dismissable: _isDismissable,     // optional, default : false

                        // hide previous/next/close buttons:
                        hasPrev: _hasPrev,      // show previous button, optional, default: true
                        hasNext: _hasNext,      // show next button, optional, default: true
                        hasClose: _hasClose,       // show close button, optional, default: false

                        // iOS only, optional
                        album: _album==null?'':_album.title,     // optional, default: ''
                        //duration: _duration,          // optional, default: 0
                        //elapsed: _elapsed,            // optional, default: 0

                        // Android only, optional
                        // text displayed in the status bar when the notification (and the ticker) are updated
                        ticker: "Playing " + _track.title
                    }, this.onSuccess, this.onError);

                    console.log("No Music Control Availalbe");

                } else {
                    console.log("No Music Control Availalbe");
                }

            },
            init: function () {

                _musicControl = $window.MusicControls;

                if (_musicControl) {

                    // Register callback
                    _musicControl.subscribe(this.events);

                    // Start listening for events
                    // The plugin will run the events function each time an event is fired
                    _musicControl.listen();

                    console.log("Music Control Availalbe");

                } else {
                    console.log("No Music Control Availalbe");
                }

            },
            destroy: function () {
                if (!_musicControl) return false;

                _musicControl.destroy(onSuccess, onError);

                return true;
            },

            updateIsPlaying: function (bPlaying) {
                if (!_musicControl) {
                    _musicControl.updateIsPlaying(bPlaying);
                }

                return true;
            },
            updateDismissable: function (bDismiss) {
                if (!_musicControl) return false;

                _musicControl.updateDismissable(bDismiss);
                return true;
            }

        }
    })
