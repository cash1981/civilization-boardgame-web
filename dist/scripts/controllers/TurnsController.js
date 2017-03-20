'use strict';
(function (module) {
  var TurnsController = function ($log, GameService, DrawService, currentUser, Util, growl, $routeParams, $scope) {
    var viewModel = this;

    var turns = [{
      turnnr: 1,
      disabled: true,
      sot: "Scout to city F2, Create city @ A5",
      trade: 14,
      cm: "Harvest silk",
      movement: "",
      research: ""
    },
      {
        turnnr: 2,
        disabled: false,
        sot: "Nothing",
        trade: 23,
        cm: "Devote capital",
        movement: "",
        research: ""
      }
    ];

    viewModel.turns = turns;

    viewModel.disableForm = function (turnIndex) {
      console.log('disabled set to true');
      var turn = viewModel.turns[turnIndex];
      console.log("turn is ", turn);
      turn.disabled = true;
    }
  };

  module.controller("TurnsController",
    ["$log", "GameService", "DrawService", "currentUser", "Util", "growl", "$routeParams", "$scope", TurnsController]);

}(angular.module("civApp")));
