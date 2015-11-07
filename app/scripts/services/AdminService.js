'use strict';
(function (civApp) {

  civApp.factory('AdminService', ["$http", "$q", "$log", "growl", "currentUser", "BASE_URL", function ($http, $q, $log, growl, currentUser, BASE_URL) {
    var baseUrl = BASE_URL + "/admin/";

    var deleteGame = function (gameId) {
      var url = baseUrl + "deletegame";

      return $http({
        url: url,
        method: "POST",
        params: {gameid: gameId}
      })
        .success(function (response) {
          growl.success("Game deleted!");
          return response;
        }).error(function (data) {
          growl.error("Could not delete game");
          return data;
        });
    };
    return {
      deleteGame: deleteGame
    };

  }]);

}(angular.module("civApp")));
