'use strict';
angular.module('civApp').controller('LootController', ["players", "sheetName", "currentUser", "$scope", "$uibModalInstance", function (players, sheetName, currentUser, $scope, $uibModalInstance) {
  var model = this;
  model.players = players;
  model.sheetName = sheetName;

  model.ok = function() {
    $uibModalInstance.close({
      playerId: model.playerLootChosen.playerId,
      sheetName: sheetName
    });
  };

  model.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
