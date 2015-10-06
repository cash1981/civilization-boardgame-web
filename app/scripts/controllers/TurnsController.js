'use strict';
(function (module) {
  var TurnsController = function ($log, GameService, DrawService, currentUser, Util, growl, $routeParams, $scope) {
    var viewModel = this;


    var turns = [{
      turnnr: 1,
      sot: "Scout to city F2, Create city @ A5",
      trade: 14,
      cm: "Harvest silk",
      movement: "",
      research: ""
    },
      {
        turnnr: 2,
        sot: "Nothing",
        trade: 23,
        cm: "Devote capital",
        movement: "",
        research: ""
      }
    ];

    viewModel.turns = turns;
  };

  module.controller("TurnsController",
    ["$log", "GameService", "DrawService", "currentUser", "Util", "growl", "$routeParams", "$scope", TurnsController]);

}(angular.module("civApp")));
