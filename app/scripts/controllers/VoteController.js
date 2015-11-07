'use strict';
angular.module('civApp').controller('VoteController', ["$scope", "$uibModalInstance", "$log", "logToUndo", function ($scope, $uibModalInstance, $log, logToUndo) {
  $scope.voteOk = function () {
    var vote = {
      id: logToUndo.id,
      vote: true
    };
    $uibModalInstance.close(vote);
  };

  $scope.voteNok = function () {
    var vote = {
      id: logToUndo.id,
      vote: false
    };
    $uibModalInstance.close(vote);
  };

  $scope.voteCancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
