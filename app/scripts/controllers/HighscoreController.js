'use strict';
(function (module) {
  var HighscoreController = function (playerHighscore, civHighscores, NgTableParams, GameService, $scope, $filter) {
    var model = this;

    var initialize = function () {
      model.totalNumberOfPlayers = playerHighscore.totalNumberOfPlayers;
      model.totalFivePlayers = playerHighscore.fiveWinners.length;
      model.totalFourPlayers = playerHighscore.fourWinners.length;
      model.totalThreePlayers= playerHighscore.threeWinners.length;
      model.totalTwoPlayers = playerHighscore.twoWinners.length;
      model.totalNumberOfGames = playerHighscore.totalNumberOfGames;
      model.fivePlayerGamesTotal = playerHighscore.fivePlayerGamesTotal;
      model.fourPlayerGamesTotal = playerHighscore.fourPlayerGamesTotal;
      model.threePlayerGamesTotal = playerHighscore.threePlayerGamesTotal;
      model.twoPlayerGamesTotal = playerHighscore.twoPlayerGamesTotal;

      /* jshint ignore:end */
    };

    initialize();

    /* jshint ignore:start */
    model.winnersList = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        totalWins: 'desc'     // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function (params) {
        // use build-in angular filter
        // update table params
        var orderedData = params.sorting() ? $filter('orderBy')(playerHighscore.winners, params.orderBy()) : playerHighscore.winners;
        params.total(playerHighscore.winners.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: {
        $data: {}, $emit: function () {
        }
      }
    });

    /* jshint ignore:start */
    model.fiveWinnersList = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        totalWins: 'desc'     // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function (params) {
        // use build-in angular filter
        // update table params
        var orderedData = params.sorting() ? $filter('orderBy')(playerHighscore.fiveWinners, params.orderBy()) : playerHighscore.fiveWinners;
        params.total(playerHighscore.fiveWinners.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: {
        $data: {}, $emit: function () {
        }
      }
    });

    /* jshint ignore:start */
    model.fourWinnersList = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        totalWins: 'desc'     // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function (params) {
        var orderedData = params.sorting() ? $filter('orderBy')(playerHighscore.fourWinners, params.orderBy()) : playerHighscore.fourWinners;
        params.total(playerHighscore.fourWinners.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: {
        $data: {}, $emit: function () {
        }
      }
    });

    /* jshint ignore:start */
    model.threeWinnersList = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        totalWins: 'desc'     // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function (params) {
        // use build-in angular filter
        // update table params
        var orderedData = params.sorting() ? $filter('orderBy')(playerHighscore.threeWinners, params.orderBy()) : playerHighscore.threeWinners;
        params.total(playerHighscore.threeWinners.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: {
        $data: {}, $emit: function () {
        }
      }
    });

    /* jshint ignore:start */
    model.twoWinnersList = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        totalWins: 'desc'     // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function (params) {
        // use build-in angular filter
        // update table params
        var orderedData = params.sorting() ? $filter('orderBy')(playerHighscore.twoWinners, params.orderBy()) : playerHighscore.twoWinners;
        params.total(playerHighscore.twoWinners.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: {
        $data: {}, $emit: function () {
        }
      }
    });

    /* jshint ignore:start */
    model.civhighscores = new NgTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        totalWins: 'desc'     // initial sorting
      }
    }, {
      total: 0, // length of data
      getData: function (params) {
        // use build-in angular filter
        // update table params
        var orderedData = params.sorting() ? $filter('orderBy')(civHighscores, params.orderBy()) : civHighscores;
        params.total(civHighscores.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: {
        $data: {}, $emit: function () {
        }
      }
    });

  };

  module.controller("HighscoreController",
    ["playerHighscore", "civHighscores", "NgTableParams", "GameService", "$scope", "$filter", HighscoreController]);

}(angular.module("civApp")));
