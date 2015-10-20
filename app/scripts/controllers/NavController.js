'use strict';
(function (module) {

  var NavController = function (GameService, $routeParams, basicauth, currentUser, growl, loginRedirect, GameOption, $modal) {
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

    model.clearOptions = function() {
      GameOption.setShowValue(false);
      GameOption.setShowEndGameValue(false);
    };

    model.endGame = function(winner) {
      var game = GameService.getGameById(winner.pbfId);

      if(game && game.player && game.player.gameCreator) {
        model.clearOptions();
        GameService.endGame(winner.pbfId, winner.username);
      } else {
        growl.error('Only the game creator can end a game!');
      }
    };

    model.withdrawGame = function() {
      var game = GameService.getGameById($routeParams.id);
      if(game && game.player) {
        if(game.player.gameCreator) {
          growl.error('As game creator you cannot withdraw from the game. You can only end it!');
          return;
        }

        if(game.player.username === model.user.username) {
          model.clearOptions();
          GameService.withdrawFromGame($routeParams.id);
        } else {
          growl.error('Only player playing the game can withdraw from it!');
        }
      }
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

    model.openSignup = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'signup.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function(register) {
        if(register) {
          basicauth.register(register);
          model.registerUsername = null;
          model.registerEmail = null;
          model.registerPassword = null;
          model.registerVerification = null;
        }
      }, function () {
        //Cancel callback here
      });
    };

    model.openForgotPassword = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'forgotpassword.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function(forgotpass) {
        if(forgotpass) {
          basicauth.forgotpass(forgotpass);
        }
      }, function () {
        //Cancel callback here
      });
    };

    model.openGeneralInfo = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'image1.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function() {
      }, function () {
        //Cancel callback here
      });
    };

    model.openTechOverview = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'image2.html',
        controller: 'RegisterController as registerCtrl',
        size: size
      });

      modalInstance.result.then(function() {
      }, function () {
        //Cancel callback here
      });
    };

    model.openEndGame = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'endGame.html',
        controller: 'TradeController as tradeCtrl',
        size: size,
        resolve: {
          players: function() {
            return GameService.allPlayers($routeParams.id);
          },
          item : undefined
        }
      });

      modalInstance.result.then(function(winner) {
        model.endGame(winner);
      }, function () {
        //Cancel callback here
      });
    };
  };

  module.controller("NavController", ['GameService', '$routeParams', 'basicauth', 'currentUser', 'growl', 'loginRedirect', 'GameOption', '$modal', NavController]);

}(angular.module("civApp")));
