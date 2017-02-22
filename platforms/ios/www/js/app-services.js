angular.module('iNepali.services', [])
    .factory('AppService', function ($http, $q) {

        var _apiUrl = 'http://api1.inepali.net/api';


        var callback = function (response) {
            return response;
        };

        var getFmRadio = function () {
            return $http.get(_apiUrl + "/LiveRadio").success(callback).error(callback);
        };

        var getAlbums = function () {
            return $http.get(_apiUrl + "/Album").success(callback).error(callback);
        };

        var getPlaylist = function (id) {
            return $http.get(_apiUrl + "/Playlist/Get/" + id).success(callback).error(callback);

        };

        var getRecents = function () {
            return $http.get(_apiUrl + "/Recent").success(callback).error(callback);

        };

        var search = function (keyword) {

        };




        return {
            getFmRadio: getFmRadio,
            getAlbums: getAlbums,
            getPlaylist: getPlaylist,
            search: search,
            getRecents : getRecents
        };
    });