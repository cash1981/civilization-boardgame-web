'use strict';
(function (module) {
  var TournamentController = function (tournaments, $scope, growl, $http, BASE_URL, TournamentService) {
    var model = this;
    model.players = [];
    updatePlayersTable(tournaments);

    $scope.signupTourney = function (tournamentNumber) {
      if (!tournamentNumber) {
        tournamentNumber = 1;
      }
      TournamentService.signup(tournamentNumber)
        .then(function (data) {
          updatePlayersTable(data);
        })
    };


    function updatePlayersTable(tourneys) {
      if (tourneys && tourneys[0].players) {
        model.players = tourneys[0].players;
      }
    }
  };

  module.controller("TournamentController",
    ["tournaments", "$scope", "growl", "$http", "BASE_URL", "TournamentService", TournamentController]);

}(angular.module("civApp")));
