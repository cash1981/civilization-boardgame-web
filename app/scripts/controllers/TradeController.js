'use strict';
angular.module('civApp').controller('TradeController', ["players", "item", "currentUser", "$scope", "$modalInstance", function (players, item, currentUser, $scope, $modalInstance) {
  var model = this;
  model.players = players;
  model.item = item;

  model.ok = function() {
    item.ownerId = model.playerTradeChosen.playerId;
    $modalInstance.close(item);
  };

  model.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  model.endGameWinner = function() {
    $modalInstance.close(model.winner);
  };

  model.endGameNoWinner = function() {
    var winner = {
      pbfId: model.players[0].pbfId,
      username: null
    };
    $modalInstance.close(winner);
  };

  model.endGameCancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
