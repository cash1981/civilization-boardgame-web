'use strict';
angular.module('civApp').controller('TradeController', ["players", "item", "currentUser", "$scope", "$uibModalInstance", function (players, item, currentUser, $scope, $uibModalInstance) {
  var model = this;
  model.players = players;
  model.item = item;

  model.ok = function() {
    item.ownerId = model.playerTradeChosen.playerId;
    $uibModalInstance.close(item);
  };

  model.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  model.endGameWinner = function() {
    $uibModalInstance.close(model.winner);
  };

  model.endGameNoWinner = function() {
    var winner = {
      pbfId: model.players[0].pbfId,
      username: null
    };
    $uibModalInstance.close(winner);
  };

  model.endGameCancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
