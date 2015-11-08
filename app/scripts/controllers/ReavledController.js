'use strict';
(function (module) {
  var RevealedController = function ($routeParams, GameService, currentUser, Util, $scope) {
    var model = this;

    function initialize() {
      $scope.privateLogCollapse = false;
      $scope.itemCollapse = false;
      $scope.gpCollapse = false;
      $scope.unitCollapse = false;
      $scope.cultureCardsCollapse = false;
      $scope.civCollapse = false;
      $scope.hutsCollapse = false;
      $scope.villagesCollapse = false;
      model.civs = [];
      model.cultureCards = [];
      model.greatPersons = [];
      model.huts = [];
      model.villages = [];
      model.tiles = [];
      model.units = [];
    }

    initialize();

    $scope.$watch(function () {
      return GameService.getGameById($routeParams.id);
    }, function (newVal) {
      if (!newVal) {
        return;
      }
      var game = newVal;
      model.civs = [];
      model.cultureCards = [];
      model.greatPersons = [];
      model.huts = [];
      model.villages = [];
      model.tiles = [];
      model.units = [];
      model.items = [];
      readKeysFromItems(game.revealedItems);
      return game;
    });

    model.nextElement = function(obj) {
      return Util.nextElement(obj);
    };

    model.itemName = function(item) {
      var key = Object.keys(item);
      if(key && key.length > -1) {
        /* jshint ignore:start */
        return _.capitalize(key[0]);
        /* jshint ignore:end */
      }
      return item;
    };

    function readKeysFromItems(items) {
      items.forEach(function (item) {
        var itemKey = Object.keys(item)[0];
        if ("cultureI" === itemKey || "cultureII" === itemKey || "cultureIII" === itemKey) {
          model.cultureCards.push(item);
        } else if ("greatperson" === itemKey) {
          model.greatPersons.push(item);
        } else if ("hut" === itemKey) {
          model.huts.push(item);
        } else if ("village" === itemKey) {
          model.villages.push(item);
        } else if ("tile" === itemKey) {
          model.tiles.push(item);
        } else if ("civ" === itemKey) {
          model.civs.push(item);
        } else if ("aircraft" === itemKey || "mounted" === itemKey || "infantry" === itemKey || "artillery" === itemKey) {
          model.units.push(item);
        } else {
          model.items.push(item);
        }
      });
    }

  };

  module.controller("RevealedController",
    ["$routeParams", "GameService", "currentUser", "Util", "$scope", "PlayerService", RevealedController]);

}(angular.module("civApp")));
