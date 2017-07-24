'use strict';
(function (civApp) {

  civApp.factory('TournamentService', ["$http", "$q", "growl", "BASE_URL", function ($http, $q, growl, BASE_URL) {
    var baseUrl = BASE_URL + "/tournament/";

    var getTournaments = function () {
      return $http.get(baseUrl)
        .then(function (response) {
          return response.data;
        }, function () {
          growl.error("Could not get tournaments");
          return $q.reject();
        });
    };

    var signup = function (tournamentId) {
      if (!tournamentId) {
        return $q.reject("No tournamentId");
      }
      var url = baseUrl + "signup/" + tournamentId;

      return $http({
        url: url,
        method: "PUT"
      }).then(function(response) {
        return response.data;
      }, function () {
        growl.error("Could not join tournament. Have you already joined?");
        return $q.reject();
      });
    };

    return {
      getTournaments: getTournaments,
      signup: signup
    };

  }]);

}(angular.module("civApp")));
