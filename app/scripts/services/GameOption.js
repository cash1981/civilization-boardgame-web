'use strict';
(function(module) {

  var options = function() {
    this.value = {
      show: false,
      showEndGame: false,
      admin: false
    };

    this.getValue = function() {
      return this.value;
    };

    this.setShowValue = function(val) {
      this.value.show = val;
    };

    this.setShowEndGameValue = function(val) {
      this.value.showEndGame = val;
    };

    this.setShowAdminValue = function(val) {
      this.value.admin = val;
    };
  };

  module.service("GameOption", options);

}(angular.module("civApp")));
