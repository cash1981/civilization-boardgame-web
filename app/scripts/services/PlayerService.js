'use strict';
(function (civApp) {

  civApp.factory('PlayerService', ["$http", "$q", "$log", "growl", "currentUser", "BASE_URL", "GameService", "Util", function ($http, $q, $log, growl, currentUser, BASE_URL, GameService, Util) {
    var baseUrl = BASE_URL + "/player/";

    var revealItem = function (gameId, item) {
      if (!gameId || !item) {
        return $q.reject("No gameId or logid");
      }
      var url = baseUrl + gameId + "/item/reveal";

      var itemDTO = {
        "name": Util.nextElement(item).name,
        "ownerId": Util.nextElement(item).ownerId,
        "sheetName": Util.nextElement(item).sheetName,
        "itemNumber": Util.nextElement(item).itemNumber,
        "pbfId": gameId
      };

      var configuration = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      return $http.put(url, itemDTO, configuration)
        .success(function (response) {
          growl.success("Item revealed");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        })
        .error(function () {
          growl.error("Item could not be revealed");
        });
    };

    var revealTech = function (gameId, logid) {
      if (!gameId || !logid) {
        return $q.reject("No gameId or logid");
      }
      var url = baseUrl + gameId + "/tech/reveal/" + logid;
      $http.put(url)
        .success(function (response) {
          growl.success("Research revealed!");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        })
        .error(function (data) {
          growl.error("Could not reveal tech");
          return data;
        });
    };

    var discardItem = function (gameId, item) {
      if (!gameId || !item) {
        return $q.reject("No gameId or item");
      }
      var url = baseUrl + gameId + "/item/discard";

      var itemDTO = {
        "name": Util.nextElement(item).name,
        "ownerId": Util.nextElement(item).ownerId,
        "sheetName": Util.nextElement(item).sheetName,
        "itemNumber": Util.nextElement(item).itemNumber,
        "pbfId": gameId
      };

      var configuration = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      $http.post(url, itemDTO, configuration)
        .success(function (response) {
          growl.success("Item discarded");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        }).error(function (data) {
          growl.error("Item could not be discarded");
          return data;
        });
    };

    var backInDeck = function (gameId, item) {
      if (!gameId || !item) {
        return $q.reject("No gameId or item");
      }
      var url = baseUrl + gameId + "/item/backtodeck";

      var itemDTO = {
        "name": Util.nextElement(item).name,
        "ownerId": Util.nextElement(item).ownerId,
        "sheetName": Util.nextElement(item).sheetName,
        "itemNumber": Util.nextElement(item).itemNumber,
        "pbfId": gameId
      };

      var configuration = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      $http.post(url, itemDTO, configuration)
        .success(function (response) {
          growl.success("Item put back in deck. Deck reshuffled");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        }).error(function (data) {
          growl.error("Item could not be put back in deck");
          return data;
        });
    };

    var endTurn = function (gameId) {
      if (!gameId) {
        return $q.reject("No gameId");
      }
      var url = baseUrl + gameId + "/endturn";
      return $http.post(url)
        .success(function (response) {
          growl.success("Turn ended");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        })
        .error(function (data) {
          growl.error("Could not end turn");
          return data;
        });
    };

    var getChosenTechs = function (gameId) {
      if (!gameId) {
        return $q.reject("No gameId");
      }
      var url = baseUrl + gameId + "/tech/" + currentUser.profile.id;
      return $http.get(url)
        .then(function (response) {
          return response.data;
        }, function (data) {
          $log.error(data);
          growl.error("Could not get chosen techs");
          return $q.reject();
        });
    };

    var selectTech = function (gameId, selectedTech) {
      if (!gameId || !selectedTech) {
        return $q.reject("No gameId or tech");
      }
      var url = baseUrl + gameId + "/tech/choose";

      return $http({
        url: url,
        method: "POST",
        params: {name: selectedTech.tech.name}
      })
        .success(function (response) {
          growl.success("Tech chosen successfully");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        }).error(function (data) {
          growl.error("Could not choose tech");
          return data;
        });
    };

    var removeTech = function (gameId, techName) {
      if (!gameId || !techName) {
        return $q.reject("No gameId or tech");
      }
      var url = baseUrl + gameId + "/tech/remove";

      return $http({
        url: url,
        method: "DELETE",
        params: {name: techName}
      })
        .success(function (response) {
          growl.success("Tech removed successfully");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        }).error(function (data) {
          $log.error(data);
          growl.error("Could not remove tech");
          return data;
        });
    };

    var trade = function (gameId, item) {
      if (!gameId || !item) {
        return $q.reject("Couldn't get gameId or item");
      }
      var url = baseUrl + gameId + "/trade/";

      var itemDTO = {
        "name": item.name,
        "sheetName": item.sheetName,
        "pbfId": gameId,
        "ownerId": item.ownerId,
        "itemNumber": item.itemNumber
      };

      var configuration = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      $http.post(url, itemDTO, configuration)
        .success(function (response) {
          growl.success("Item sent to another player");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        }).error(function (data) {
          growl.error("Item could not be sent to another player");
          return data;
        });
    };

    var getTechsForAllPlayers = function (gameId) {
      if (!gameId) {
        return $q.reject("No gameId");
      }
      var url = baseUrl + gameId + "/tech/all/";
      return $http.get(url)
        .success(function (response) {
          return response.data;
        })
        .error(function (response) {
          growl.error("Could not get techs for all players");
          return response;
        });
    };

    var getNote = function (gameId) {
      if (!gameId) {
        return $q.reject("No gameId");
      }
      var url = baseUrl + gameId + "/note/";
      return $http.get(url)
        .success(function (data) {
          return data;
        })
        .error(function (response) {
          growl.error("Could not get personal notes");
          return response;
        });
    };

    var saveNote = function (gameId, note) {
      if (!gameId || !note) {
        return $q.reject("Couldn't get gameId or note");
      }
      var url = baseUrl + gameId + "/note/save";

      var configuration = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      $http.put(url, note, configuration)
        .success(function (response) {
          growl.success("Note saved");
          return response;
        }).error(function (data) {
          growl.error("Note could not be saved");
          return data;
        });
    };

    var takeTurnButton = function (gameId) {
      if (!gameId ) {
        return $q.reject("Couldn't get gameId");
      }
      return $http.put(baseUrl + gameId + "/turn/take")
        .success(function (response) {
          growl.success("Turn taken");
          return response;
        }).success(function (response) {
          GameService.fetchGameByIdFromServer(gameId);
          return response;
        })
        .error(function (data) {
          growl.error("Could not take turn button");
          return data;
        });
    };

    return {
      revealItem: revealItem,
      revealTech: revealTech,
      discardItem: discardItem,
      endTurn: endTurn,
      selectTech: selectTech,
      getChosenTechs: getChosenTechs,
      removeTech: removeTech,
      trade: trade,
      getTechsForAllPlayers: getTechsForAllPlayers,
      backInDeck: backInDeck,
      getNote: getNote,
      saveNote: saveNote,
      takeTurnButton: takeTurnButton
    };

  }]);

}(angular.module("civApp")));
