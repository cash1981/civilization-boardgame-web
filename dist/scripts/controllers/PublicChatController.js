'use strict';
(function (module) {
  var PublicChatController = function (currentUser, growl, GameService) {
    var vm = this;
    vm.username = currentUser.profile.username;
    vm.messages = [];

    GameService.getPublicChatList()
      .then(function (data) {
        angular.forEach(data, function (obj) {
          this.push({
            'username': obj.username,
            'content': obj.message
          });
        }, vm.messages);
      });

    vm.sendMessage = function (message, username) {
      if (!username && vm.username) {
        username = vm.username;
      }
      if (!username) {
        growl.error('You must login to chat');
      }
      if (message && $.trim(message) !== '' && username) {
        GameService.publicChat(message)
          .then(function () {
            vm.messages.push({
              'username': username,
              'content': message
            });
          });
      }
    };

  };

  module.controller("PublicChatController", ["currentUser", "growl", "GameService", "$interval", PublicChatController]);

}(angular.module("civApp")));
