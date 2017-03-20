'use strict';
(function (module) {
var GameController = function ($log, $routeParams, GameService, PlayerService, currentUser, Util, GameOption, $filter, NgTableParams, $scope, growl, $uibModal, $sce) {
  var model = this;

  $scope.$watch(function () {
    return GameService.getGameById(model.gameId);
  }, function (newVal) {
    if (!newVal) {
      return;
    }
    var game = newVal;
    $scope.currentGame = game;

    if(!$scope.currentGame.mapLink) {
      $scope.currentGame.mapLink = $sce.trustAsResourceUrl("https://docs.google.com/presentation/d/1hgP0f6hj4-lU6ysdOb02gd7oC5gXo8zAAke4RhgIt54/embed?start=true&loop=true&delayms=3000");
      $scope.currentGame.mapEditLink = $sce.trustAsResourceUrl("https://docs.google.com/presentation/d/1hgP0f6hj4-lU6ysdOb02gd7oC5gXo8zAAke4RhgIt54/embed?start=true&loop=true&delayms=3000");
    } else {
      var maplink = $scope.currentGame.mapLink;
      $scope.currentGame.mapLink = $sce.trustAsResourceUrl(Util.mapLink(maplink));
      $scope.currentGame.mapEditLink = $sce.trustAsResourceUrl(Util.mapEditLink(maplink));
    }

    if(!$scope.currentGame.assetLink) {
      $scope.currentGame.assetLink = $sce.trustAsResourceUrl("https://docs.google.com/spreadsheets/d/10-syTLb2i2NdB8T_alH9KeyzT8FTlBK6Csmc_Hjjir8/pubhtml?widget=true&amp;headers=false");
      $scope.currentGame.assetEditLink = $sce.trustAsResourceUrl("https://docs.google.com/spreadsheets/d/10-syTLb2i2NdB8T_alH9KeyzT8FTlBK6Csmc_Hjjir8/pubhtml?widget=true&amp;headers=false");
    } else {
      var link = $scope.currentGame.assetLink;
      $scope.currentGame.assetLink = $sce.trustAsResourceUrl(Util.assetLink(link));
      $scope.currentGame.assetEditLink = $sce.trustAsResourceUrl(Util.assetEditLink(link));
    }

    var hasAccess = game.player && game.player.username === model.user.username && game.active;
    $scope.userHasAccess = hasAccess;
    GameOption.setShowValue(hasAccess || model.user.username === 'admin');
    GameOption.setShowEndGameValue((hasAccess && game.player.gameCreator) || model.user.username === 'admin');
    GameOption.setShowAdminValue(model.user.username === 'admin');

    if(game.active) {
      //Check votes
      /* jshint ignore:start */
      _.forEach(game.publicLogs, function(log) {
        if($scope.canVote(log)) {
          growl.warning("An undo was requested which needs your vote");
          return false;
        }
      });
      /* jshint ignore:end */

      model.yourTurn = game.player && game.player.yourTurn;

      if(model.yourTurn) {
        growl.info("<strong>It's your turn! Press end turn when you are done!</strong>");
      }
    }

    model.tableParams.reload();
    model.tablePrivateLog.reload();
    return game;
  });

  model.endTurn = function () {
    PlayerService.endTurn(model.gameId);
  };

  model.revealTechFromLog = function(logid) {
    PlayerService.revealTech($routeParams.id, logid);
  };

  //In scope so that we can use it from another view which is included
  $scope.canInitiateUndo = function(log) {
    return checkPermissionForVote(log) && !log.draw.undo;
  };

  function checkPermissionForVote(log) {
    return $scope.userHasAccess && log && log.draw && (log.log.indexOf("drew") > -1 || log.log.indexOf("discarded") > -1) && log.log.indexOf("withdrew") < 0;
  }

  //In scope so that we can use it from another view which is included
  $scope.initiateUndo = function(logid) {
    GameService.undoDraw($routeParams.id, logid);
  };

  //In scope so that we can use it from another view which is included
  $scope.canVote = function(log) {
    var hasVoted = false;
    if(checkPermissionForVote(log) && log.draw.undo) {
      //Take out the users
      var votes = log.draw.undo.votes;

      for(var vote in votes) {
        if(vote === model.user.id) {
          return false;
        }
      }
      return true;
    }
    return hasVoted;
  };

  $scope.openModalVote = function(size, log) {
    var modalInstance = $uibModal.open({
      templateUrl: 'modalVote.html',
      controller: 'VoteController',
      size: size,
      resolve: {
        logToUndo: function () {
          return log;
        }
      }
    });

    modalInstance.result.then(function(vote) {
      if(vote.vote) {
        GameService.voteYes(model.gameId, vote.id);
      } else {
        GameService.voteNo(model.gameId, vote.id);
      }
    }, function () {
    });
  };

  model.updateMapLink = function() {
    var link = $scope.currentGame.newMapLink;
    var startsWith = new RegExp('^' + "https://docs.google.com/presentation/d/", 'i');
    if(!startsWith.test(link)) {
      growl.error("Wrong URL. Must start with https://docs.google.com/presentation/d/");
      return;
    }
    var mapPromise = GameService.updateMapLink($routeParams.id, link)
      .then(function(data) {
        if(data) {
          var link = Util.mapLink(data.msg);
          $scope.currentGame.mapLink = $sce.trustAsResourceUrl(link);
        }
      });
    return mapPromise;
  };

  model.updateAssetLink = function() {
    var link = $scope.currentGame.newAssetLink;
    var startsWith = new RegExp('^' + "https://docs.google.com/spreadsheets/d/", 'i');
    if(!startsWith.test(link)) {
      growl.error("Wrong URL. Must start with https://docs.google.com/spreadsheets/d/");
      return;
    }
    var assetPromise = GameService.updateAssetLink($routeParams.id, link)
      .then(function(data) {
        if(data) {
          var link = Util.assetLink(data.msg);
          $scope.currentGame.assetLink = $sce.trustAsResourceUrl(link);
        }
      });
    return assetPromise;
  };

  model.canRevealTech = function(log) {
    return $scope.userHasAccess && log && log.draw && log.draw.hidden && log.log.indexOf("researched") > -1;
  };

  /* jshint ignore:start */
  model.tableParams = new NgTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    sorting: {
      created: 'desc'     // initial sorting
    }
  }, {
    total: 0, // length of data
    getData: function (params) {
      // use build-in angular filter
      // update table params
      if (!$scope.currentGame) {
        return;
      }
      var game = $scope.currentGame;
      var lastLog = _.last(game.publicLogs);
      if(lastLog && lastLog.log) {
        $scope.latestLog = lastLog.log;
      }

      var orderedData = params.sorting() ? $filter('orderBy')(game.publicLogs, params.orderBy()) : game.publicLogs;
      params.total(game.publicLogs.length);
      return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
    },
    $scope: { $data: {}, $emit: function () {}}
  });
  /* jshint ignore:end */

  /* jshint ignore:start */
  model.tablePrivateLog = new NgTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
    sorting: {
      created: 'desc'     // initial sorting
    }
  }, {
    total: 0, // length of data
    getData: function (params) {
      // use build-in angular filter
      // update table params
      if (!$scope.currentGame) {
        return;
      }
      var game = $scope.currentGame;
      if(!game.privateLogs || !game.privateLogs.length) {
        return;
      }

      var orderedData = params.sorting() ? $filter('orderBy')(game.privateLogs, params.orderBy()) : game.privateLogs;
      params.total(game.privateLogs.length);
      //$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
    },
    $scope: { $data: {}, $emit: function () {}}
  });
  /* jshint ignore:end */

  /**
   * Returns the next element in the object
   * @param obj
   * @returns obj.next
   */
  model.nextElement = function(obj) {
    return Util.nextElement(obj);
  };

  var initialize = function() {
    model.user = currentUser.profile;
    $scope.userHasAccess = false;
    model.yourTurn = false;
    model.gameId = $routeParams.id;
    model.GameOption = GameOption;
  };

  initialize();

};

  module.controller("GameController",
    ["$log", "$routeParams", "GameService", "PlayerService", "currentUser", "Util", 'GameOption', "$filter", "NgTableParams", "$scope", "growl", "$uibModal", "$sce", GameController]);

}(angular.module("civApp")));
