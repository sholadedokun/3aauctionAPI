'use strict';

/**
 * @ngdoc overview
 * @name 3aAuctionsApp
 * @description
 * # 3aAuctionsApp
 *
 * Main module of the application.
 */
angular
  .module('3aAuctionsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'appServices',
    'cfp.loadingBar',
    'ngTouch',
    'ui.bootstrap'
  ])
  .run(['$rootScope', 'appActions', 'checkLoggedin', 'userData','$location', function($rootScope, appActions, checkLoggedin,  userData, $location){
    $rootScope.socket = io();
    $rootScope.user=userData.data();
    appActions.admin('serverDate/').get({},function(data){
        $rootScope.serverTime=data.date;
        // var stimer=setInterval(function(){
        //     $rootScope.serverTime=$rootScope.serverTime - 1000;
        // }, 1000);
    })
    checkLoggedin.getStatus('init');
    // $rootScope.checkLoggedin=function(access){
    //     $rootScope.loginChecker=appActions.admin('checkLoggedin/').get({});
    //     $rootScope.loginChecker.$promise.then(function(data){
    //         if(data.user){
    //             var getUser=appActions.admin('userProfile/').get({id:data.user});
    //             getUser.$promise.then(function(data){
    //                 $rootScope.user=data;
    //
    //                 console.log($rootScope.user);
    //             },
    //             function(err){
    //                 console.log(err);
    //                 if(access!='init'){
    //                     $rootScope.regSign('signin');
    //                 }
    //             })
    //         };
    //     },
    //     function(err){
    //         console.log('please check your internet connection')
    //     })
    // }
    //$rootScope.checkLoggedin('init');
    var socket = io.connect('http://localhost');
    }])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push(function($q, $location) {
        return {
          response: function(response) {
            // do something on success
            return response;
          },
          responseError: function(response) {
            if (response.status === 401)
                console.log('i got 401ed');
            //  $location.url('/login');
            return $q.reject(response);
          }
        };
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/auction', {
        templateUrl: 'views/auction.html',
        controller: 'AuctionCtrl',
        controllerAs: 'auction'
      })
      .when('/auction_details', {
        templateUrl: 'views/auction_details.html',
        controller: 'AuctionDetailsCtrl',
        controllerAs: 'auction_details'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/faqs', {
        templateUrl: 'views/faqs.html',
        controller: 'FaqsCtrl',
        controllerAs: 'faqs'
      })
      .when('/aboutUs', {
        templateUrl: 'views/about_us.html',
        controller: 'FaqsCtrl',
        controllerAs: 'faqs'
      })
      .when('/generalInfo', {
        templateUrl: 'views/general_info.html',
        controller: 'FaqsCtrl',
        controllerAs: 'faqs'
      })
      .when('/guideToBuy', {
        templateUrl: 'views/guide_to_buying.html',
        controller: 'FaqsCtrl',
        controllerAs: 'faqs'
      })
      .when('/guideToSell', {
        templateUrl: 'views/guide_to_sell.html',
        controller: 'FaqsCtrl',
        controllerAs: 'faqs'
      })
      .when('/whatWeDo', {
        templateUrl: 'views/what_we_do.html',
        controller: 'FaqsCtrl',
        controllerAs: 'faqs'
      })
      .when('/register', {
        templateUrl: 'views/registerSignIn.html',
        controller: 'RegCtrl',
        controllerAs: 'regs'
      })
      .when('/profile/:id', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        resolve: {
            data: function (checkLoggedin, $route) {
                return checkLoggedin.getStatus('route', $route.current.params.id);
            }

        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
