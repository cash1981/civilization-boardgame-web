'use strict';
(function (module) {
  var GameListController = function (games, winners, civhighscores, NgTableParams, GameService, currentUser, $uibModal, $scope, $filter) {
    var model = this;

    var initialize = function () {
      model.user = currentUser.profile;
      model.games = [];
      model.finishedGames = [];
      $scope.onlyMyGames = {};
      /* jshint ignore:start */
      _.forEach(games, function (g) {
        if (g.active) {
          model.games.push(g);
        } else {
          model.finishedGames.push(g);
        }
      });

      /* jshint ignore:end */
    };

    initialize();

    model.isUserPlaying = function (players) {
      if (players) {
        for (var i = 0; i < players.length; i++) {
          var player = players[i];
          if (player && player.username === model.user.username) {
            return true;
          }
        }
      }
      return false;
    };

    model.joinGame = function (game) {
      var joinPromise = GameService.joinGame(game)
        .then(function (game) {
          model.game = game;
          $scope.userHasAccess = game.player && game.player.username === model.user.username;
          model.yourTurn = game.player && game.player.yourTurn;
          return game;
        });

      return joinPromise;
    };

    model.showMyGames = function () {
      //Binding with primitives can break two-way-binding in angular. Must add the a value
      if ($scope.onlyMyGames.value) {
        $scope.filterContent = model.user.username;
      } else {
        $scope.filterContent = "";
      }
    };

    model.openCreateNewGame = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'createNewGame.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function (game) {
        if (game) {
          GameService.createGame(game);
        }
      }, function () {
        //Cancel callback here
      });
    };

    model.publicChatSendMessage = function (message, username) {
      if (message && message !== '' && username) {
        model.messages.push({
          'username': username,
          'content': message
        });
      }
    };

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
        var orderedData = params.sorting() ? $filter('orderBy')(winners, params.orderBy()) : winners;
        params.total(winners.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: { $data: {}, $emit: function () {}}
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
        var orderedData = params.sorting() ? $filter('orderBy')(civhighscores, params.orderBy()) : civhighscores;
        params.total(civhighscores.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: { $data: {}, $emit: function () {}}
    });

    /* jshint ignore:start */
    model.finishedGamesList = new NgTableParams({
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
        var orderedData = params.sorting() ? $filter('orderBy')(model.finishedGames, params.orderBy()) : model.finishedGames;
        params.total(model.finishedGames.length);
        return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
      },
      $scope: { $data: {}, $emit: function () {}}
    });

    model.getFinishedGamesIndex = function(item){
      return model.finishedGames.indexOf(item);
    }


  };

  module.controller("GameListController",
    ["games", "winners", "civhighscores", "NgTableParams", "GameService", "currentUser", "$uibModal", "$scope", "$filter", GameListController]);

}(angular.module("civApp")));
