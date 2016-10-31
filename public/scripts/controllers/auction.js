'use strict';

/**
 * @ngdoc function
 * @name 3aAuctionsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the 3aAuctionsApp
 */
angular.module('3aAuctionsApp')
  .controller('AuctionCtrl', ['$scope', 'appService', 'appActions', function ($scope, appService, appActions) {
      $scope.active='Auctions';
      $scope.sortItems=['Select one', 'sort by age'];
      $scope.allInventory=appActions.admin('inventory/').query();
  }])
  .controller('AuctionDetailsCtrl', ['$scope', function ($scope) {
      $scope.active='Auctions';
      $scope.sortItems=['Select one', 'sort by age'];
  }]);
