'use strict';
(function (module) {

  var NavController = function (PlayerService, GameService, AdminService, $routeParams, basicauth, currentUser, growl, loginRedirect, GameOption, $uibModal) {
    var model = this;
    model.GameOption = GameOption;
    model.user = currentUser.profile;

    model.username = "";
    model.password = "";
    model.user = currentUser.profile;

    model.registerUsername = null;
    model.registerEmail = null;
    model.registerPassword = null;
    model.registerVerification = null;
    model.winner = null;

    model.clearOptions = function () {
      GameOption.setShowValue(false);
      GameOption.setShowEndGameValue(false);
      GameOption.setShowAdminValue(false);
    };

    model.endGame = function (winner) {
      var game = GameService.getGameById(winner.pbfId);

      if ((game && game.player && game.player.gameCreator) || model.user.username === 'admin') {
        model.clearOptions();
        GameService.endGame(winner.pbfId, winner.username);
      } else {
        growl.error('Only the game creator can end a game!');
      }
    };

    model.withdrawGame = function () {
      var game = GameService.getGameById($routeParams.id);
      if (game && game.player) {
        if (game.player.gameCreator) {
          growl.error('As game creator you cannot withdraw from the game. You can only end it!');
          return;
        }

        if (game.player.username === model.user.username) {
          model.clearOptions();
          GameService.withdrawFromGame($routeParams.id);
        } else {
          growl.error('Only player playing the game can withdraw from it!');
        }
      }
    };

    model.deleteGame = function () {
      if ("admin" === model.user.username) {
        model.clearOptions();
        AdminService.deleteGame($routeParams.id);
      } else {
        growl.error('Only admin can delete game!');
      }
    };

    model.openNotes = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'gamenotes.html',
        controller: 'NoteController as noteCtrl',
        size: size
      });

      modalInstance.result.then(function (note) {
        if (note) {
          PlayerService.saveNote($routeParams.id, note);
        }
      }, function () {
        //Cancel callback here
      });
    };

    model.login = function (form) {
      if (form.$valid) {
        basicauth.login(model.username, model.password)
          .then(loginRedirect.redirectPreLogin);
        model.password = "";
      }
    };

    model.signOut = function () {
      basicauth.logout();
    };

    model.openSignup = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'signup.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function (register) {
        if (register) {
          basicauth.register(register);
        }
      }, function () {
        //Cancel callback here
      });
    };

    model.openForgotPassword = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'forgotpassword.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function (forgotpass) {
        if (forgotpass) {
          basicauth.forgotpass(forgotpass);
        }
      }, function () {
        //Cancel callback here
      });
    };

    model.openGeneralInfo = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'image1.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function () {
      }, function () {
        //Cancel callback here
      });
    };

    model.openTechOverview = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'image2.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function () {
      }, function () {
        //Cancel callback here
      });
    };

    model.openEndGame = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'endGame.html',
        controller: 'TradeController as tradeCtrl',
        size: size,
        resolve: {
          players: function () {
            return GameService.allPlayers($routeParams.id);
          },
          item: undefined
        }
      });

      modalInstance.result.then(function (winner) {
        model.endGame(winner);
      }, function () {
        //Cancel callback here
      });
    };

    model.takeButton = function () {
      var game = GameService.getGameById($routeParams.id);
      if (game && game.player) {
        PlayerService.takeTurnButton($routeParams.id);
      } else {
        growl.error('Could not take button');
      }
    };
  };

  module.controller("NavController", ['PlayerService', 'GameService', 'AdminService', '$routeParams', 'basicauth', 'currentUser', 'growl', 'loginRedirect', 'GameOption', '$uibModal', NavController]);

}(angular.module("civApp")));
