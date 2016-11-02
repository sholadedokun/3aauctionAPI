'use strict';

/**
 * @ngdoc function
 * @name 3aAuctionsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 3aAuctionsApp
 */
angular.module('3aAuctionsApp')
.controller('indexCtrl',['$scope', 'appService', '$uibModal', 'userData',  function ($scope, appService, $uibModal, userData) {
    $scope.user=userData.data();
    //console.log('server time is :'+$scope.serverTime);
    $scope.sumenu=[
        [   {url:'#/generalInfo', value:'General Informaton'},
            {url:'#/aboutUs', value:'About Us'},
            {url:'#/guideToBuy', value:'Guide To Buy'},
            {url:'#/guideToSell', value:'Guide To Sell'},
            {url:'#/whatWeDo', value:'What We Do'}
        ]
    ]
    $scope.subscriber=function(email){
        appService.addRequest_data('addSubscriber', email).then(function(response){
          $scope.info=response;
        },
        function(error){
          console.log('error this '.error)
        });
    }
    $scope.subMenu=function(action, index){
        $scope.sMenu=action;
        $scope.sIndex=index;

    }
    $scope.signOut=function(){
        $scope.user={id:0}
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
          $log.info('modal-component dismissed at: ' + new Date());
        });
    };


}])
.controller('regSignModalInstanceCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$location', 'cfpLoadingBar', 'userData', 'option','appActions', function ($scope, $rootScope,  $modalInstance, $location, cfpLoadingBar, userData, option, appActions){
    $scope.regState=option;
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
                $scope.user.id=data[0]._id;
                $scope.user.userName=data[0].userName;
                $scope.user.firstName=data[0].firstName;
                $scope.user.lastName=data[0].lastName;
                $scope.user.email=data[0].firstName;
                $scope.user.bids=data[0].userBids;
                $scope.user.auctions=data[0].userAuctions;
                $scope.user.userInfo=false;
                $modalInstance.dismiss('cancel');
                //$location.path("/profile/"+data[0]._id);
            }
            else{
                $scope.info="Users Can't be Authenticated. Please review your credentials.";
            }

        })
    }
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
.controller('detailModalInstanceCtrl', ['$scope', '$filter', '$rootScope', '$uibModalInstance', 'index','allAuction', 'filters','limits','appActions', 'userData', function ($scope, $filter, $rootScope,  $uibModalInstance, index, allAuction, filters, limits, appActions, userData){
    $scope.auction;
    console.log($scope.serverTime)
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
        if($scope.user.id==0){
            $scope.user.userInfo=true;
            return;
        }
        $scope.user.userInfo=false;
        $scope.user.process=true;
        $scope.user.userMessage='Please wait';
        $scope.biddings={
            userId:$scope.user.id,
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
    // $scope.regUser = registerUser.get({title:user.title, fname:user.fname, lname:user.lname, email:user.email, pass:user.password, phone:user.phone, date_birth:user.dbirth, con_add:user.caddress, city:user.city, state:user.state, postal_c:user.pcode, country:user.country, national:user.nationality, agent:user.agent },	function(regUser) {
	// if($scope.regUser[0]=='o'){
	// 	userData.setData(user);
	// 	setCookie('getCentreUser',user, 30 )
	// 	function setCookie(cname, cvalue, exdays) {
	// 		var d = new Date();
	// 		d.setTime(d.getTime() + (exdays*24*60*60*1000));
	// 		var expires = "expires="+d.toUTCString();
	// 		document.cookie = cname + "=" + JSON.stringify(cvalue) + "; " + expires;
	// 	}
	// $scope.getUdata=userData.data();
	// $scope.getUdata[0].status="Logged_in";
	// $rootScope.$broadcast('logged-in');
	// $modalInstance.dismiss('cancel');
	//}
	//})
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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

      $scope.subscriber=function(email){
          appService.addRequest_data('addSubscriber', email).then(function(response){
            $scope.info=response;
          },
          function(error){
            console.log('error this '.error)
          });
      }

}]);
