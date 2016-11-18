var appServices=angular.module('appServices', ['ngResource']);
appServices.filter('posttime', function(){
  return function (input) {
    if(isNaN(input)){
        var n =moment.utc(input).fromNow();
    }
    else{
        var n =moment.unix(input/1000).fromNow();
    }

    return n;
  }
});
appServices.filter('getHighestBid', function(){
  return function (input) {
    if(input.biddingHistory.length==0){
        return input.biddingSettings.startingPrice
    }
    else{
        input.biddingHistory.sort(function(a, b){return b.price-a.price})
        return input.biddingHistory[0].price;
    }
  }
});
appServices.filter('numberFixedLen', function () {
    return function(a,b){
        if(a!='' && (typeof a!=='undefined'))   return(1e4+""+a).slice(-b);
        else return '00';
    };
});
appServices.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
appServices.service('userData', ['$rootScope','$location', function($rootScope,$location){
 var savedData =  {name:'',  _id:0, email:''}
 return{
    data:function() {   return savedData; }
 }
}])
appServices.service('checkLoggedin', ['$rootScope','$location', '$http', '$q',  function($rootScope,$location, $http, $q){

return{
    getStatus:function(access, routeId){
        var deferred = $q.defer();
        $http.get('/appActions/checkLoggedin').success(function(data){
            if (data.user){
                $http.get('/appActions/userProfile/'+data.user).success(function(userData){
                    if(userData){
                        $rootScope.user=userData;
                        if(access=='route' && routeId!=$rootScope.user.userName){
                            deferred.reject();
                            $location.url('/login');
                        }
                        deferred.resolve($rootScope.user);
                        console.log($rootScope.user);
                    }
                },
                function(err){
                    console.log(err);
                    if(access!='init'){
                        $rootScope.regSign('signin');
                    }
                })
                //deferred.resolve(data.user);
            }
            // Not Authenticated
            else {
                console.log('here')
                $rootScope.message = 'You need to log in.';
                deferred.reject();
                if(access=='route'){$location.url('/login');}

            }
        });
        return deferred.promise;

    }
}

}])
appServices.factory('appActions', ['$resource', function($resource){
    return {
        admin:function(url){
            return $resource('/appActions/'+url+':id', null, {
              'update': { method:'PUT' }
          })
        }
    }
}])
appServices.service('appService', ['$q','$http','$location','$rootScope', 'cfpLoadingBar', function( $q, $http, $location, $rootScope, cfpLoadingBar) {
    var urlprefix = 'http://localhost:8888/3aauctions/App/';//offline
    // var urlprefix= '';//online

    var uploadImages = function(file){
        return $q(function(resolve, reject) {
            if(file!=null){
               form_data=parsetoformdata(file);

               $http.post(urlprefix+'server/upload_images.php', form_data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}                })
                .success(function(response){ resolve(response); })
                .error(function(err){ reject('Images Couldn\'t be added.'+err); });
            }
            else{
                console.log('No Images');
                resolve('no Images');
            }
        });
    }

    var parsetoformdata= function(data){
        var form_data = new FormData();
        if(typeof(data)==='object'){
            for ( var key in data ) {
                form_data.append(key, data[key]);
            }
        }
        else if(data!=''){
            form_data.append('data', data);
        }
        else{form_data.append('data', '');}
        return form_data;
    }
    var addRequest_data=function(url, data){

		return $q(function(resolve, reject) {
            cfpLoadingBar.start();
            //if(data==''){data={}}
            //var url=urlprefix+'server/get_allq.php';
            // if(action!='' && data!=''){
            //     if(typeof(data)!=='object'){
            //         temp={action:action, data:data};
            //         data=temp;
            //     }
            //     else{data.action=action; }
            // }
            form_data=parsetoformdata(data);
            $http({
                method: 'POST',
                url: url,
                data: form_data,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
                //headers : {"application/x-www-form-urlencoded; charset=utf-8"}
            }).
            success(function(response) {
              //console.log(response)
              cfpLoadingBar.complete();
              resolve(response);
            },
            function(err) {reject('Data Couldn\'t be added.');}
            );
        });
	}
        return{
        addRequest_data :function(action, data) {
            return addRequest_data(action, data)
        },
        uploadImages :function(file) {
            return uploadImages(file)
        },
  	    register:function(regprams){
  		    register(regprams)
  	    }
    }
}])
