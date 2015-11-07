'use strict';
(function (module) {
  var GameListController = function (games, winners, $log, GameService, currentUser, $uibModal, $scope) {
    var model = this;

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

    var initialize = function () {
      model.user = currentUser.profile;
      model.games = [];
      model.winners = [];
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

      _.forEach(winners, function (w) {
          model.winners.push(w);
      });
      /* jshint ignore:end */
    };

    initialize();
  };

  module.controller("GameListController",
    ["games", "winners", "$log", "GameService", "currentUser", "$uibModal", "$scope", "$interval", GameListController]);

}(angular.module("civApp")));
