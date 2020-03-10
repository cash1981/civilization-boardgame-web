'use strict';

(function () {
  var application = angular.module('civApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMessages',
    'ui.bootstrap',
    'ngTouch',
    'ab-base64',
    'angular-growl',
    'ngTable',
    'nya.bootstrap.select',
    'irontec.simpleChat',
    'angularUtils.directives.dirPagination'
  ]);

  application.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/list.html',
        controller: "GameListController as gameListCtrl",
        resolve: {
          games: ["GameService", function (m) {
            return m.getAllGames();
          }]
        }
      })
      .when('/game/:id/', {
        templateUrl: 'views/game.html',
        controller: "ChatController as chatCtrl",
        resolve: {
          chatList: ["GameService", "$route", function (m, r) {
            return m.getChatList(r.current.params.id);
          }]
        }
      })
      .when('/tournament/', {
        templateUrl: 'views/tournament.html',
        controller: "TournamentController as tournamentCtrl",
        resolve: {
          tournaments: ["TournamentService", function (t) {
            return t.getTournaments();
          }]
        }
      })
      .when('/highscore/', {
        templateUrl: 'views/highscore.html',
        controller: "HighscoreController as highscoreCtrl",
        resolve: {
          playerHighscore: ["GameService", function (m) {
            return m.playerHighscore();
          }],
          civHighscores: ["GameService", function (m) {
            return m.civHighscores();
          }]
        }
      })
      .when('/faq/', {
        templateUrl: 'views/faq.html'
      })
      .when('/about/', {
        templateUrl: 'views/about.html'
      })
      .when('/logout/', {
        redirectTo: '/'
      })
      .when('/endgame/', {
        redirectTo: '/'
      })
      .otherwise({
        templateUrl: '404.html'
      });
  });

  application.config(function (growlProvider) {
    growlProvider.globalTimeToLive(7000);
    growlProvider.globalDisableCountDown(false);
    growlProvider.globalPosition('top-center');
    growlProvider.onlyUniqueMessages(true);
  })
    .constant('BASE_URL', 'https://civilization-boardgame.herokuapp.com/api');
    //.constant('BASE_URL', 'http://localhost:8080/api');

}());
