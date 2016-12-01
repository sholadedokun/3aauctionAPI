'use strict';

/**
 * @ngdoc function
 * @name 3aAuctionsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 3aAuctionsApp
 */
angular.module('3aAuctionsApp')
.controller('indexCtrl',['$scope', '$rootScope', 'appService', '$uibModal', 'userData', 'appActions', 'cfpLoadingBar', '$location', function ($scope, $rootScope, appService, $uibModal, userData, appActions, cfpLoadingBar, $location) {
    $scope.user=userData.data()
    $scope.sumenu=[
        [   {url:'#/generalInfo', value:'General Informaton'},
            {url:'#/aboutUs', value:'About Us'},
            {url:'#/guideToBuy', value:'Guide To Buy'},
            {url:'#/guideToSell', value:'Guide To Sell'},
            {url:'#/whatWeDo', value:'What We Do'}
        ]
    ]
    $scope.subscriber=function(email){
        $scope.info='Please Wait...';
        cfpLoadingBar.start()
        var subscriber={emailAddress:email, source:'webapp'}
        appActions.admin('addSubscriber/').save(subscriber, function(data){
            cfpLoadingBar.complete()
            if(data.error){
                $scope.info=data.error
            }
            else{
                $scope.info='Thanks for subscribing to our Newsletter';
            }
        })
    }
    $scope.subMenu=function(action, index){
        $scope.sMenu=action;
        $scope.sIndex=index;
    }
    $scope.signOut=function(){
        var logout=appActions.admin('logout/').get({})
        logout.$promise.then(function(data){
            $scope.user={_id:0};
            userData.saveData($scope.user);
            $location.path('/');
            $rootScope.$broadcast('authenticationOccured');
            console.log(userData.data())
        },
        function(err){
            console.log(err);
        })
    }
    $scope.regSign=function(option){
        var modalInstance = $uibModal.open({
          templateUrl: 'views/registerSignIn.html',
          controller: 'regSignModalInstanceCtrl',
          size: 'lg',
          windowClass: 'register-modal-window',
          resolve: {
            option: function () {
              return option;
            }
          }
        })
        modalInstance.result.then(function (data) {
          $scope.user=data;
          $rootScope.$broadcast('authenticationOccured');
        }, function () {

        });
    }

    $scope.auctionMiniview=function(allAuction, index, filters, limits){
        if(limits===null){limits=allAucton.length}
        var modalInstance = $uibModal.open({
          templateUrl: 'views/auction_details_mini.html',
          controller: 'detailModalInstanceCtrl',
          size: 'lg',
          windowClass: 'register-modal-window',
          resolve: {
            index: function () {
              return index;
            },
            allAuction: function () {
              return allAuction;
            },
            filters: function () {
              return filters;
            },
            limits: function () {
              return limits;
            },
          }
        })
        modalInstance.result.then(function (option) {
          $scope.regSign(option);
        }, function () {

        });
    };


}])
.controller('regSignModalInstanceCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$location', 'cfpLoadingBar', 'userData', 'option','appActions', 'appService', '$http', function ($scope, $rootScope,  $uibModalInstance, $location, cfpLoadingBar, userData, option, appActions, appService, $http){
    $scope.regState=option;
    $scope.user=userData.data();
    $scope.infoRev=false;
    $scope.changeState=function(state){$scope.regState=state; $scope.info='';}
    $scope.register=function(){
        $scope.infoRev=true;
        $scope.info='Please Wait...';
        if($scope.user.password==$scope.user.repassword){
            if($scope.user.password.length>=8){
                cfpLoadingBar.start()
                appActions.admin('user/').save($scope.user, function(data){
                    cfpLoadingBar.complete()
                    if(data.error){
                        if(data.data[0].email==$scope.user.email){
                            $scope.info="Opps!! Your email address is already Registered";
                        }
                        else{
                            $scope.info="Opps!!  Username already taken, Please select another Username";
                        }
                    }
                    else{
                        $scope.user=data;
                        userData.saveData(data);
                        $location.path("/profile/"+$scope.user.userName)
                        $scope.cancel();

                    }
                });
            }
            else{
                $scope.info="Opps!! Your password must be atleast 8 characters";
            }
        }
        else{
            $scope.info="Opps!! The passwords provided doesn't match ";
        }

    }
    $scope.login=function(){
        cfpLoadingBar.start()
        $scope.infoRev=true;
        $scope.info='Please wait...';
        $scope.getUser=appActions.admin('userLogin/').save($scope.user);
        $scope.getUser.$promise.then(function(data){
            cfpLoadingBar.complete()
            $scope.user=data;
            userData.saveData(data);
            console.log($scope.user)
            $scope.user.userInfo=false;
            $uibModalInstance.close(data);
        },
        function(err){
            cfpLoadingBar.complete()
            console.log(err);
            if(err.status=='401'){
                $scope.info="Wrong Username or Password... Please try again";
            }
        }
        )
    }
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
}])
.controller('detailModalInstanceCtrl', ['$scope', '$filter', '$rootScope', '$uibModalInstance', 'index','allAuction', 'filters','limits','appActions', 'userData', function ($scope, $filter, $rootScope,  $uibModalInstance, index, allAuction, filters, limits, appActions, userData){
    $scope.auction;
    $scope.user=userData.data();
    console.log($scope.user)
    $scope.revHistory=false;
    $scope.bidIsClose=false;
    $scope.user=userData.data();
    var cdown;
    $scope.socket.on('userBiddedonProperty', function(bid){
        if(bid.inventory==$scope.auction._id){
            // appActions.admin('userProfile/').get({id:bid.userId}, function(data){
            //     bid.userId=data
                allAuction[index].biddingHistory.push(bid)
                processAuction(index)
            //})
        }
    });
    processAuction(index);
    function processAuction(index){
        $scope.auction=allAuction[index];
        $scope.allThumbs=$scope.auction.allPic.split(',');
        $scope.currentView=$scope.allThumbs[0];
        $scope.biddingRate=$scope.auction.biddingSettings.biddingRate;
        $scope.currentHighest=$scope.currentBid=$filter('getHighestBid')($scope.auction);
        $scope.currentBid+=$scope.biddingRate;
        $scope.reservedP=false;
        if($scope.currentHighest>=$scope.auction.biddingSettings.reservePrice){
            $scope.reservedP=true;
        }

        // var eventTime= 1366549200; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
        // var currentTime = moment().unix(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
        var diffTime = ($scope.auction.biddingSettings.closeTimeStamp/1000) - ($scope.serverTime/1000);
        var duration = moment.duration(diffTime*1000, 'milliseconds');
        var interval = 1000;
        $scope.countdown={};
        cdown=setInterval(function(){
          duration = moment.duration(duration - interval, 'milliseconds');

          if($scope.serverTime < $scope.auction.biddingSettings.closeTimeStamp){
              $scope.bidIsClose=false;
              $scope.countdown.days=duration.days();
              $scope.countdown.hours=duration.hours()
              $scope.countdown.minutes=duration.minutes()
              $scope.countdown.seconds=duration.seconds()
              $scope.$apply();
          }
          else{
              $scope.bidIsClose=true;
              $scope.$apply();
          }

        //$('.countdown').text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds())
        }, interval);
    }
    $scope.disableAuction=function(){

    }
	$scope.showMain= function (index){
        $scope.currentView=$scope.allThumbs[index];
	}
    $scope.Toggleview=function(value){
        $scope.revHistory=!value;
    }
    $scope.nextAuction=function(){
        clearInterval(cdown);
        index++;
        clearInterval(cdown);
        if(index>=allAuction.length)
            index=0;
        processAuction(index);
    }
    $scope.previousAuction=function(){
        clearInterval(cdown);
        index--;

        if(index<=0)
            index=allAuction.length;
        processAuction(index);
    }
    $scope.moveSlide=function(dir){
        var slideContainer=angular.element( document.querySelector( '#thumbSlide'))
        var currentLeft=parseInt(slideContainer.css('left'));
        var containerWidth=parseInt(slideContainer.css('width'));
        var thumbWidth=angular.element( document.querySelector( '.thumbImg'))
        thumbWidth=parseInt(thumbWidth.css('width'));
        if(dir=='r'){
            console.log(Math.abs(currentLeft), containerWidth)
            if(Math.abs(currentLeft)>=(containerWidth-(2*thumbWidth)))
                return
            slideContainer.animate({'left':currentLeft-thumbWidth})
        }
        else{
            console.log(Math.abs(currentLeft), containerWidth)
            if(Math.abs(currentLeft)<=0) return
            slideContainer.animate({'left':currentLeft+thumbWidth})
        }
    }
    $scope.updateBid=function(operation){
        if(operation=='add'){
            $scope.currentBid+=$scope.biddingRate;
        }
        else{
            if(($scope.currentBid - $scope.biddingRate)>$scope.currentHighest){
                $scope.currentBid-=$scope.biddingRate;
            }
        }
    }
    $scope.submitBid=function(){
        $scope.user.userInfo=true;
        console.log('user is', $scope.user)
        if($scope.user._id==0){
            $scope.user.userInfo=true;
            return;
        }
        $scope.user.userInfo=false;
        $scope.user.process=true;
        $scope.user.userMessage='Please wait';
        $scope.biddings={
            userId:$scope.user._id,
            inventory:$scope.auction._id,
            price:$scope.currentBid,
            state:'Lagos',
            ipaddress:'0.0.0.0',
            browser:'Chrome',
            operatingSystem:'Mac, OSX',
            medium:'Desktop',
            referrer:'3aauctions'
        }
        appActions.admin('biddings/').save($scope.biddings, function(data){
            $scope.user.userMessage='Your Bid as been accepted.';
            var bid={userId:{userName:$scope.user.userName}, inventory:$scope.auction._id, price:$scope.currentBid}
            $scope.socket.emit('userBiddedonProperty',bid);

            allAuction[index].biddingHistory.push(bid)
            processAuction(index)
            console.log(allAuction[index].biddingHistory)
        })
    }
    $scope.regstate=function(option){
        $uibModalInstance.close(option);
    }
    $scope.ok = function (user) {
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}])
.controller('MainCtrl',['$scope', 'appService',  function ($scope, appService) {
      $scope.startSlider=function(){
          jQuery('.bxslider').bxSlider({
              pager:false,
              mode:'fade',
              controls:false,
              auto:true,
              pause:8000,
              autoDelay:10000
          });
      }
}]);
