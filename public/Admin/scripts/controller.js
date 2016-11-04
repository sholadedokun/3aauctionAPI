angular.module('Admin')
  .controller('MainCtrl', ['$scope','appService', function ($scope, appService) {
    appService.addRequest_data('','').then(function(response){
      $scope.init_data=response;
    },
    function(error){
      console.log('error this '.error)
    });
  }])
.controller('manageAIctrl', ['$scope','appService', '$location', 'adminActions','$http', function ($scope, appService, $location, adminActions, $http) {
    $scope.inventory={};
    $scope.all_category=adminActions.admin('category/').query({Type:'category'})
    $scope.get_allSubcategories=function(){
        $scope.all_subcategory=adminActions.admin('subcategory/').query({id:$scope.inventory.category})
    }
    $scope.addInventory=function(){
        $scope.inventory.startTimeStamp=$scope.inventory.startTimeReadable.getTime();
        $scope.inventory.closeTimeStamp=$scope.inventory.closeTimeReadable.getTime();
        appService.uploadImages($scope.images).then(function(response){
            if(response!=='no Images'){
                $scope.inventory.allPic='';
                for ( var key in response ) {
                    if($scope.inventory.allPic==''){
                        $scope.inventory.allPic=response[key].filename;
                        $scope.inventory.profilePic=response[key].filename
                    }
                    else{$scope.inventory.allPic=$scope.inventory.allPic+','+response[key].filename;
                }

            }
            adminActions.admin('inventory/').save($scope.inventory, function(data){
                $location.path('/');
            })
        }
        },
        function(error){
            console.log('Error Uploading Images '+error)
        });

    }
}])

.controller('manageACctrl', ['$scope','adminActions', '$q', function ($scope, adminActions, $q) {
    $scope.all_category=adminActions.admin('category/').query()
    $scope.subcategory={};
    $scope.newCategory={};
    $scope.images={};
    $scope.allnewCategory=function(){
        adminActions.admin('category/').save($scope.newCategory, function(data){
            $scope.all_category.push(data);
        });
    }
    $scope.addnewSubCategory=function(){
        adminActions.admin('subcategory/').save($scope.subcategory, function(data){
        })
    }
}])

.controller('viewallICtrl', ['$scope','adminActions', '$location', function ($scope, adminActions, $location) {
    $scope.allInventory=adminActions.admin('inventory/').query();
}])

.controller('viewICtrl', ['$scope', '$routeParams', 'appService','$location', 'adminActions', function ($scope, $routeParams, appService, $location, adminActions) {
    var id=$routeParams.id;
    $scope.allInventory=adminActions.admin('').get({id:id}, function(data){
        $scope.inventory=data;
        $scope.main_img=$scope.inventory.profilePic;
        $scope.img_list=$scope.inventory.allPic.split(',');
    });
    $scope.delete=function(id){
      appService.addRequest_data('deleteq',id).then(function(response){
        $location.path('/viewallQ');
      })
    }
}])
.controller('editICtrl', ['$scope','appService', '$location','$routeParams', 'adminActions', '$filter', function ($scope, appService, $location, $routeParams,adminActions, $filter) {
    var id=$routeParams.id;
    $scope.taglist='';
    $scope.all_category=adminActions.admin('category/').query()
    $scope.allInventory=adminActions.admin('').get({id:id}, function(data){
        $scope.inventory=data;
        console.log($scope.inventory);
        $scope.main_img=$scope.inventory.profilePic;
        $scope.img_list=$scope.inventory.allPic.split(',');
        $scope.inventory.subCategory=$scope.inventory.subCategory._id;
        $scope.startTime=new Date($scope.inventory.biddingSettings.startTimeReadable)
        $scope.closeTime=new Date($scope.inventory.biddingSettings.closeTimeReadable)
        $scope.get_allSubcategories($scope.inventory.category);
    });
    $scope.get_allSubcategories=function(categoryId){
        $scope.all_subcategory=adminActions.admin('subcategory/').query({id:categoryId})
    }

    $scope.editinventory=function(item){
        var imgparse=''
        for(var i=0; i< $scope.img_list.length; i++){
            if(i==0){imgparse=$scope.img_list[0];}
            else{imgparse=imgparse+','+$scope.img_list[i]}
        }
        $scope.inventory.allPic=imgparse;
        $scope.inventory.profilePic=$scope.img_list[0];
        console.log($scope.inventory.allPic)

        $scope.inventory.startTimeStamp=$scope.startTime.getTime();
        $scope.inventory.closeTimeStamp=$scope.closeTime.getTime();
        appService.uploadImages($scope.images).then(function(response){
            if(response!=='no Images'){
                var res_allPic='';
                for ( var key in response ) {
                    if(res_allPic==''){
                        res_allPic=','+response[key].filename;
                    }
                    else{res_allPic=res_allPic+','+response[key].filename;}
                }
                $scope.inventory.allPic=$scope.inventory.allPic+res_allPic;
            }
            adminActions.admin('').update({id: $scope.inventory._id}, $scope.inventory, function(){
                //$location.url('/');
            });
        },
        function(error){
            console.log('Error Uploading Images '+error)
        });
        //console.log($scope.inventory)

    }
    $scope.delete_pic=function(index){
        $scope.img_list.splice(index, 1);
    }
    $scope.make_prof=function(index){
        var temp=$scope.img_list[index];
        $scope.img_list.splice(index, 1);
        $scope.img_list.unshift(temp);
        $scope.main_img=$scope.img_list[index];
    }
    $scope.addtag=function(){
        if($scope.idata[11]=='')$scope.idata[11]=$scope.taglist;
        else{$scope.idata[11]=$scope.idata[11]+', '+$scope.taglist;}
        //$scope.$apply();
    }

}])
.controller('categoryCtrl', ['$scope','appService', '$location', function ($scope, appService, $location) {
    appService.addRequest_data('getallc','').then(function(response){
      $scope.categories=response;
      $scope.categories.shift();
    },
    function(error){
      console.log('error this '.error)
    });
    $scope.delete=function(id){
        appService.addRequest_data('deletec',id).then(function(response){
            $location.path('/');
        },
        function(error){
            console.log('error this '.error)
        });
    }
  }])
  .controller('addcatCtrl', ['$scope','appService', function ($scope, appService) {
    $scope.cat={};
    $scope.addc=function(){
        appService.addRequest_data('addc',$scope.cat).then(function(response){
            $location.path('/viewallc')
        },
      function(error){
        console.log('error this '.error)
      });
    }
}])
.controller('editCCtrl', ['$scope','appService', '$routeParams', '$location', function ($scope, appService, $routeParams, $location) {
    $scope.cat=JSON.parse($routeParams.cat);
    $scope.editc=function(){
      appService.addRequest_data('updatec',$scope.cat).then(function(response){
        $location.path('/viewallc')
      },
      function(error){
        console.log('error this '.error)
      });
    }
  }])
