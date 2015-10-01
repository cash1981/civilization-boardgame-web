'use strict';
(function (module) {
  var PublicChatController = function (currentUser) {
    var vm = this;
    vm.username = currentUser.profile.username;
    vm.messages = [
      {
        'username': 'Matt',
        'content': 'Hi!'
      },
      {
        'username': 'Elisa',
        'content': 'Whats up?'
      },
      {
        'username': 'Matt',
        'content': 'I found this nice AngularJS Directive'
      },
      {
        'username': 'Elisa',
        'content': 'Looks Great!'
      }
    ];

    vm.sendMessage = function(message, username) {
      if(!username && vm.username) {
        username = vm.username;
      }
      if(message && _.trim(message) !== '' && username) {
        vm.messages.push({
          'username': username,
          'content': message
        });
      }
    };

  };

  module.controller("PublicChatController", ["currentUser", PublicChatController]);

}(angular.module("civApp")));
