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
   // .controller('RegCtrl', ['$scope','$location','appActions', 'cfpLoadingBar', 'userData',  function ($scope, $location, appActions, cfpLoadingBar, userData) {
   //     $scope.regState="";
   //     $scope.user=userData.data();
   //     $scope.infoRev=false;
   //     $scope.changeState=function(state){$scope.regState=state; $scope.info='';}
   //     $scope.register=function(){
   //         cfpLoadingBar.start()
   //         $scope.infoRev=true;
   //         $scope.info='Please Wait...';
   //         appActions.admin('user/').save($scope.user, function(data){
   //             cfpLoadingBar.complete()
   //             if(data.error){
   //                 if(data.data[0].email==$scope.user.email){
   //                     $scope.info="Error Occured : Emial Already Registered";
   //                 }
   //                 else{
   //                     $scope.info="Error Occured : Username already taken, Please select another Username";
   //                 }
   //             }
   //             else{
   //                 $scope.user=data;
   //                 $location.path()="#/profile";
   //             }
   //         });
   //     }
   //     $scope.login=function(){
   //         cfpLoadingBar.start()
   //         $scope.infoRev=true;
   //         appActions.admin('userLogin/').get($scope.user, function(data){
   //             cfpLoadingBar.complete();
   //             if(data.length==1){
   //                 $location.path("/profile/"+data[0]._id);
   //             }
   //             else{
   //                 $scope.info="Wrong Username or Password. Please review your credentials.";
   //             }
   //
   //         })
   //     }
   //  }])
    .controller('ProfileCtrl', ['$scope','$location', 'userData', 'cfpLoadingBar', 'appActions', '$routeParams', 'data', function ($scope, $location, userData, cfpLoadingBar, appActions, $routeParams,data) {
    //    $scope.user=userData.data();
        $scope.user= data;
        $scope.inventory=[];
        console.log($scope.user)
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



    //    $scope.inventory=$scope.getUniqueInventory($scope.user.userBids);

        $scope.Profilestate="";
        $scope.changeState=function(state){$scope.regState=state;}
     }])
  .controller('MenuCtrl', ['$scope','$location', function ($scope, $location) {
      $scope.getPath = function (path) {
      return $location.path() == path;
    };
  }]);
