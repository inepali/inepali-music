angular.module('iNepali.controls', [])
    .factory('MusicControl', function ($window) {
        var _musicControl;
        var _track;
        var _artist;
        var _cover;
        var _isPlaying;
        var _isDismissable;

        var _hasPrev;
        var _hasNext;
        var _hasClose;

        var _album;
        var _duration;
        var _elapsed;

        var _ticker;

        var onSuccess = function(response)
        {
            console.log(resposne);
        };

        var onError = function(err){
            console.log(err)
        }




        return {
            events: function (action) {
                switch (action) {
                    case 'music-controls-next':
                        // Do something
                        break;
                    case 'music-controls-previous':
                        // Do something
                        break;
                    case 'music-controls-pause':
                        // Do something
                        break;
                    case 'music-controls-play':
                        // Do something
                        break;
                    case 'music-controls-destroy':
                        // Do something
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
                        // Do something
                        break;
                    case 'music-controls-headset-plugged':
                        // Do something
                        break;
                    default:
                        break;
                }

            },

            create: function () {
                if (_musicControl) {

                    _musicControl.create({
                        track: _track,        // optional, default : ''
                        artist: _artist,      // optional, default : ''
                        cover: _cover,        // optional, default : nothing
                        // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
                        //           or a remote url ('http://...', 'https://...', 'ftp://...')
                        isPlaying: _isPlaying,           // optional, default : true
                        dismissable: _isDismissable,     // optional, default : false

                        // hide previous/next/close buttons:
                        hasPrev: _hasPrev,      // show previous button, optional, default: true
                        hasNext: _hasNext,      // show next button, optional, default: true
                        hasClose: _hasClose,       // show close button, optional, default: false

                        // iOS only, optional
                        album: _album,     // optional, default: ''
                        duration: _duration,          // optional, default: 0
                        elapsed: _elapsed,            // optional, default: 0

                        // Android only, optional
                        // text displayed in the status bar when the notification (and the ticker) are updated
                        ticker: _ticker
                    }, onSuccess, onError);

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
