'use strict';

/**
 * @ngdoc function
 * @name 3aAuctionsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the 3aAuctionsApp
 */
angular.module('3aAuctionsApp')
  .controller('ContactCtrl', ['$scope', 'appService', function ($scope,  appService) {
      $scope.sortItems=['Select one', 'sort by age'];

      $scope.sendContact=function(contact){
          $scope.info='';
          appService.addRequest_data('sendContact', contact).then(function(response){
            $scope.info=response;
          },
          function(error){
            console.log('error this '.error)
          });

      }
  }])
  .controller('FaqsCtrl', ['$scope','$location', function ($scope, $location) {

   }])
   .controller('RegCtrl', ['$scope','$location','appActions', 'cfpLoadingBar', 'userData',  function ($scope, $location, appActions, cfpLoadingBar, userData) {
       $scope.regState="";
       $scope.user=userData.data();
       $scope.infoRev=false;
       $scope.changeState=function(state){$scope.regState=state; $scope.info='';}
       $scope.register=function(){
           cfpLoadingBar.start()
           $scope.infoRev=true;
           $scope.info='Please Wait...';
           appActions.admin('user/').save($scope.user, function(data){
               cfpLoadingBar.complete()
               if(data.error){
                   if(data.data[0].email==$scope.user.email){
                       $scope.info="Error Occured : Emial Already Registered";
                   }
                   else{
                       $scope.info="Error Occured : Username already taken, Please select another Username";
                   }
               }
               else{
                   $scope.user=data;
                   $location.path()="#/profile";
               }
           });
       }
       $scope.login=function(){
           cfpLoadingBar.start()
           $scope.infoRev=true;
           appActions.admin('userLogin/').query($scope.user, function(data){
               cfpLoadingBar.complete()
               if(data.length==1){
                   $location.path("/profile/"+data[0]._id);
               }
               else{
                   $scope.info="Users Can't be Authenticated. Please review your credentials.";
               }

           })
       }
    }])
    .controller('ProfileCtrl', ['$scope','$location', 'userData', 'cfpLoadingBar', 'appActions', '$routeParams', function ($scope, $location, userData, cfpLoadingBar, appActions, $routeParams) {
        $scope.user=userData.data();
        $scope.user.id= $routeParams.id;
        $scope.inventory=[];
        cfpLoadingBar.start()
        appActions.admin('userProfile/').get({id:$scope.user.id}, function(data){
            cfpLoadingBar.complete();
            $scope.user=data;
            $scope.user.fullname=data.firstName+" "+data.lastName;
            $scope.user.userName=data.userName;
            $scope.inventory=$scope.getUniqueInventory($scope.user.userBids);
            console.log(data);
        })
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
        $scope.Profilestate="";
        $scope.changeState=function(state){$scope.regState=state;}
     }])
  .controller('MenuCtrl', ['$scope','$location', function ($scope, $location) {
      $scope.getPath = function (path) {
      return $location.path() == path;
    };
  }]);
