'use strict';
(function (module) {
  var TournamentController = function ($scope, growl, $http, BASE_URL) {
    var baseUrl = BASE_URL + "/tournament/";

    $scope.signupTourney = function() {
      return $http.put(baseUrl + "signup/1")
        .success(function (data) {
          growl.success("Tournament joined!");
          return data;
        })
        .error(function (data) {
          growl.error("Could not join tournament");
          return data;
        });
    }

  };

  module.controller("TournamentController",
    ["$scope", "growl", "$http", "BASE_URL", TournamentController]);

}(angular.module("civApp")));
