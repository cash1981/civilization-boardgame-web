'use strict';
angular.module('civApp').controller('NoteController', ["$scope", "$uibModalInstance", "PlayerService", "$routeParams", function ($scope, $uibModalInstance, PlayerService, $routeParams) {
  var model = this;

  function init() {
    PlayerService.getNote($routeParams.id)
      .then(function(response) {
        if(response && response.data && response.data.msg) {
          model.message = response.data.msg;
        }
      });
  }

  model.ok = function() {
    $uibModalInstance.close({msg: model.message});
  };

  model.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  init();

}]);
