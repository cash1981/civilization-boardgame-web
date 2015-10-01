'use strict';
(function (module) {
  var PublicChatController = function (currentUser, growl, GameService) {
    var vm = this;
    vm.username = currentUser.profile.username;
    vm.messages = [];

    var chatList = GameService.getPublicChatList();
    chatList.then(function (data) {
      angular.forEach(data, function(obj, index) {
        this.push({
          'username': obj.username,
          'content': obj.message
        });
      }, vm.messages);
    });

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

  };

  module.controller("PublicChatController", ["currentUser", "growl", "GameService", PublicChatController]);

}(angular.module("civApp")));
