'use strict';

/**
 * @ngdoc function
 * @name 3aAuctionsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the 3aAuctionsApp
 */
angular.module('3aAuctionsApp')
  .controller('ContactCtrl', ['$scope', 'appActions', 'cfpLoadingBar', function ($scope,  appActions, cfpLoadingBar) {
      $scope.sendContact=function(contact){
          $scope.info='Please wait...';
          cfpLoadingBar.start()
          appActions.admin('contact/').save(contact, function(data){
              cfpLoadingBar.complete()
              if(data.error){
                  $scope.info=data.error;
              }
              else{
                  $scope.info='Your message was received our representative will contact you shorlty.';
              }
          })

      }
  }])
  .controller('FaqsCtrl', ['$scope','$location', function ($scope, $location) {

   }])
    .controller('ProfileCtrl', ['$scope','$location', 'userData', 'cfpLoadingBar', 'appActions', '$routeParams', 'data', function ($scope, $location, userData, cfpLoadingBar, appActions, $routeParams,data) {
        $scope.user= data;
        $scope.inventory=[];
        $scope.getUniqueInventory=function(list){
            var uniqueList=[]
            var keylist="";
            for ( var key in list ) {
                if(keylist.indexOf(list[key]._id)<0){
                    uniqueList.push(list[key]);
                    keylist=keylist+list[key]._id;
                }
            }
            return uniqueList;
        }
        $scope.inventory=$scope.getUniqueInventory($scope.user.userBids);

        $scope.Profilestate="";
        $scope.changeState=function(state){$scope.regState=state;}
     }])
  .controller('MenuCtrl', ['$scope','$location','userData', function ($scope, $location, userData) {


    $scope.$on('authenticationOccured', function(event, args) {
        $scope.user=userData.data();
        console.log($scope.user);
    });


      $scope.getPath = function (path) {
      return $location.path() == path;
    };
  }]);
