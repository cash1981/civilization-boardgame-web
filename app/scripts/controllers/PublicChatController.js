'use strict';
(function (module) {
  var PublicChatController = function (currentUser, growl, GameService, $interval, $scope) {
    var vm = this;
    vm.username = currentUser.profile.username;
    vm.messages = [];

    var chatList = GameService.getPublicChatList();
    getPublicChatList();

    vm.sendMessage = function(message, username) {
      if(!username && vm.username) {
        username = vm.username;
      }
      if(!username) {
        growl.error('You must login to chat');
      }
      if(message && $.trim(message) !== '' && username) {
        GameService.publicChat(message)
          .then(function(data) {
            vm.messages.push({
              'username': username,
              'content': message
            });
          })
      }
    };

    var pollChat = $interval(function() {
      vm.messages.length = 0;
      getPublicChatList();
    }, 5000);

    $scope.$on('$destroy', function() {
      if (angular.isDefined(pollChat)) {
        $interval.cancel(pollChat);
        pollChat = undefined;
      }
    });

    function getPublicChatList() {
      chatList.then(function (data) {
        angular.forEach(data, function(obj, index) {
          this.push({
            'username': obj.username,
            'content': obj.message
          });
        }, vm.messages);
      });
    }

  };

  module.controller("PublicChatController", ["currentUser", "growl", "GameService", "$interval", "$scope", PublicChatController]);

}(angular.module("civApp")));
