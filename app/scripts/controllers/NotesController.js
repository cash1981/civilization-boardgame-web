'use strict';
angular.module('civApp').controller('NotesController', ["gameid", "$scope", "$uibModalInstance", function (gameid, $scope, $uibModalInstance) {
  var model = this;

  model.ok = function() {
    item.ownerId = model.playerTradeChosen.playerId;
    $uibModalInstance.close(item);
  };

  model.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]);
