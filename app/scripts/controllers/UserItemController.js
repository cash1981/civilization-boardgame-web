'use strict';
(function (module) {
  var UserItemController = function ($log, $routeParams, GameService, DrawService, currentUser, Util, $filter, ngTableParams, $scope, PlayerService, $uibModal) {
    var model = this;

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

    model.revealItem = function (item) {
      PlayerService.revealItem($routeParams.id, item);
    };

    model.discardItem = function (item) {
      PlayerService.discardItem($routeParams.id, item);
    };

    $scope.$watch(function () {
      return GameService.getGameById($routeParams.id);
    }, function (newVal) {
      if (!newVal) {
        return;
      }
      var game = newVal;
      model.techsChosen = game.player.techsChosen;
      putTechsInScope(model.techsChosen);
      model.civs = [];
      model.cultureCards = [];
      model.greatPersons = [];
      model.huts = [];
      model.villages = [];
      model.tiles = [];
      model.units = [];
      model.items = [];
      readKeysFromItems(game.player.items);
      return game;
    });

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

    function putTechsInScope(techs) {
      model.chosenTechs1 = [];
      model.chosenTechs2 = [];
      model.chosenTechs3 = [];
      model.chosenTechs4 = [];
      model.chosenTechs5 = [];
      model.availableTech1 = [];
      model.availableTech2 = [];
      model.availableTech3 = [];
      model.availableTech4 = [];

      techs.forEach(function (tech) {
        var chosenTech = tech.tech || tech;
        if(!chosenTech) {
          return;
        }

        if(chosenTech.level === 1) {
          model.chosenTechs1.push(chosenTech);
        } else if(chosenTech.level === 2) {
          model.chosenTechs2.push(chosenTech);
        } else if(chosenTech.level === 3) {
          model.chosenTechs3.push(chosenTech);
        } else if(chosenTech.level === 4) {
          model.chosenTechs4.push(chosenTech);
        } else if(chosenTech.level === 5) {
          model.chosenTechs5.push(chosenTech);
        }
      });

      //Find out how many techs are available for each level
      for(var i = 0; i < (5-model.chosenTechs1.length); i++) {
        model.availableTech1.push(i);
      }
      for(var j = 0; j < (4-model.chosenTechs2.length); j++) {
        model.availableTech2.push(j);
      }
      for(var k = 0; k < (3-model.chosenTechs3.length); k++) {
        model.availableTech3.push(k);
      }
      for(var l = 0; l < (2-model.chosenTechs4.length); l++) {
        model.availableTech4.push(l);
      }
    }

    model.drawItem = function(itemToDraw) {
      if(itemToDraw) {
        DrawService.drawItem($routeParams.id, itemToDraw);
      }
    };

    model.selectTech = function() {
      if($scope.selectedTech.tech) {
        PlayerService.selectTech($routeParams.id, $scope.selectedTech.tech)
          .then(function() {
            GameService.getAvailableTechs($routeParams.id)
              .then(function(techs) {
                model.allAvailableTechs = techs;
              });
          });
      }
    };

    model.removeTech = function(techname) {
      PlayerService.removeTech($routeParams.id, techname)
        .then(function() {
          GameService.getAvailableTechs($routeParams.id)
            .then(function(techs) {
              model.allAvailableTechs = techs;
            });
        });
    };

    model.revealTechFromLog = function(logid) {
      PlayerService.revealTech($routeParams.id, logid);
    };

    /* jshint ignore:start */
    var getAvailableTechs = GameService.getAvailableTechs($routeParams.id)
      .then(function(techs) {
        model.allAvailableTechs = techs;
      });

    var getChosenTechs = PlayerService.getChosenTechs($routeParams.id)
      .then(function(techs) {
        model.chosenTechs = techs;
        putTechsInScope(model.chosenTechs);
      });
    /* jshint ignore:end */

    var getPlayers = GameService.players($routeParams.id);

    model.openModalTrade = function(size, itemToTrade) {
      if(!itemToTrade) {
        return;
      }

      var modalInstance = $uibModal.open({
        templateUrl: 'modalTrade.html',
        controller: 'TradeController as tradeCtrl',
        size: size,
        resolve: {
          players: function() {
            return getPlayers;
          },
          item: function () {
            return itemToTrade;
          }

        }
      });

      modalInstance.result.then(function(itemToTrade) {
        PlayerService.trade($routeParams.id, itemToTrade);
      }, function () {
      });
    };

    model.openModalLoot = function(size, sheetName) {
      if(!sheetName) {
        return;
      }

      var modalInstance = $uibModal.open({
        templateUrl: 'modalLoot.html',
        controller: 'LootController as lootCtrl',
        size: size,
        resolve: {
          players: function() {
            return getPlayers;
          },
          sheetName: function () {
            return sheetName;
          }
        }
      });

      modalInstance.result.then(function(loot) {
        DrawService.loot($routeParams.id, loot.sheetName, loot.playerId);
      }, function () {
      });
    };

    var initialize = function() {
      model.user = currentUser.profile;
      model.allAvailableTechs = [];
      $scope.privateLogCollapse = false;
      $scope.itemCollapse = false;
      $scope.gpCollapse = false;
      $scope.unitCollapse = false;
      $scope.cultureCardsCollapse = false;
      $scope.civCollapse = false;
      $scope.hutsCollapse = false;
      $scope.villagesCollapse = false;
      $scope.selectedTech = {};
      model.yourTurn = false;
      model.items = [];
      model.techsChosen = [];
      model.civs = [];
      model.cultureCards = [];
      model.greatPersons = [];
      model.huts = [];
      model.villages = [];
      model.tiles = [];
      model.units = [];

      /* jshint ignore:start */
      getAvailableTechs;
      getChosenTechs;
      /* jshint ignore:end */

    };

    initialize();
  };

  module.controller("UserItemController",
    ["$log", "$routeParams", "GameService", "DrawService", "currentUser", "Util", "$filter", "ngTableParams", "$scope", "PlayerService", "$uibModal", UserItemController]);

}(angular.module("civApp")));
