'use strict';
(function (module) {
  var TechController = function ($log, $routeParams, GameService, currentUser, Util, $scope, PlayerService) {
    var model = this;

    var playerTechs = PlayerService.getTechsForAllPlayers($routeParams.id);
    model.allTechs = [];

    playerTechs.then(function(response) {
      var techs = response.data;
      if(techs) {
        model.allTechs = techs;
      }
    });

    model.getChosenTech = function(techs, level) {
      var returnval = [];
      _.forIn(techs, function(value, key) {
        if(value.level === level) {
          returnval.push(value);
        }
      });
      return returnval;
    };

    model.getAvailableTech = function(techs, level) {
      var totalTechPerLevel = 0;
      if(level === 1) {
        totalTechPerLevel = 5;
      } else if(level === 2) {
        totalTechPerLevel = 4;
      } else if(level === 3) {
        totalTechPerLevel = 3;
      } else if(level === 4) {
        totalTechPerLevel = 2;
      } else if(level === 5) {
        totalTechPerLevel = 1;
      }

      var chosenTechsForLevel = [];
      _.forIn(techs, function(value, key) {
        if(value.level === level) {
          chosenTechsForLevel.push(value);
        }
      });

      var returnval = [];
      for(var i = 0; i < (totalTechPerLevel-chosenTechsForLevel.length); i++) {
        returnval.push(i);
      }
      return returnval;
    };

  };

  module.controller("TechController",
    ["$log", "$routeParams", "GameService", "currentUser", "Util", "$scope", "PlayerService", TechController]);

}(angular.module("civApp")));
