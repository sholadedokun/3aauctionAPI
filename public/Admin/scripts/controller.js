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
                console.log(data)
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


    // $scope.cat.$promise.then(function(data){
    //     $scope.all_category = data //Changed data.data.topics to data.topics
    //     console.log($scope.all_category)
    // });
    $scope.subcategory={};
    $scope.newCategory={};
    $scope.images={};

    // appService.addRequest_data('getCategory','').then(function(response){
    //   $scope.all_category=response;
    // },
    // function(error){
    //   console.log('error this '.error)
    // });
    $scope.allnewCategory=function(){
        adminActions.admin('category/').save($scope.newCategory, function(data){
            $scope.all_category.push(data);
        });

        // appService.uploadImages($scope.images).then(function(response){
        //     if(response!=='no Images'){
        //         $scope.newCategory.all_pics=response.all_pics;
        //         $scope.newCategory.profile_pic=response.profile_pic;
        //         $scope.newCategory.avartar_url=response.icon;
        //         $scope.images={};
        //     }
        //     appService.addRequest_data('addCategory', $scope.newCategory).then(function(response){
        //         //$location.path('/viewI/'+response)
        //         $scope.all_category=response;
        //         console.log($scope.all_category)
        //     },
        //     function(error){
        //         console.log('error this '+error)
        //     });
        // },
        // function(error){
        //     console.log('Error Uploading Images '+error)
        // });
        // appService.addRequest_data('addCategory', data).then(function(response){
        // $location.path('/viewI/'+response)
        // },
        // function(error){
        //     console.log('error this '+error)
        // });
    }
    $scope.addnewSubCategory=function(){
        adminActions.admin('subcategory/').save($scope.subcategory, function(data){

        })
        // appService.uploadImages($scope.images).then(function(response){
        //     if(response!=='no Images'){
        //         $scope.all_category.all_pics=response.all_pics;
        //         $scope.all_category.profile_pic=response.profile_pic;
        //         $scope.all_category.avartar_url=response.icon;
        //         $scope.images={};
        //     }
        //     appService.addRequest_data('addSubCategory', $scope.all_subcategory).then(function(response){
        //         console.log($scope.all_category)
        //     },
        //     function(error){
        //         console.log('error this '+error)
        //     });
        // },
        // function(error){
        //     console.log('Error Uploading Images '+error)
        // });
    }
}])

.controller('viewallICtrl', ['$scope','appService', '$location', function ($scope, appService, $location) {
    appService.addRequest_data('getallInventory','').then(function(response){
     $scope.allInventory=response;
    },
    function(error){
      console.log('error this '.error)
    });
    // $scope.delete=function(id){
    //     appService.addRequest_data('deletec',id).then(function(response){
    //         $location.path('/');
    //     },
    //     function(error){
    //         console.log('error this '.error)
    //     });
    // }
  }])

  //controller for adding new item.
  .controller('addnewiCtrl', ['$scope','appService', '$location', function ($scope, appService, $location ) {
    $scope.idata={cat:'', itype:'', itag:''};
    $scope.images={};
    $scope.itype=[{value:'', name:'Select An Item Type'},
      {value:'Service', name:'Service'},
      {value:'Product', name:'Product'}
    ];
    $scope.measure_metric=[{value:'', name:'Select a Metric'},{value:'Sachet', name:'Sachet'},{value:'bottles', name:'bottles'},{value:'packs', name:'packs'},{value:'dozens', name:'dozens'}]
    $scope.taglist='';
    $scope.itag=[{value:'', name:'Select a Popular Tags'},  {value:'Affordable', name:'Affordable'},
    {value:'cooking', name:'cooking'},
    {value:'sachet', name:'sachet'},
    {value:'oilly', name:'oily'}];
    appService.addRequest_data('getallc','').then(function(response){
      $scope.categories=response;
    },
    function(error){
        //console.log('error this '+error)
    });
    $scope.additem=function(data){
        appService.uploadImages($scope.images).then(function(response){
            if(response!=='no Images'){
                data.all_pics=response.all_pics;
                data.profile_pic=response.profile_pic;
            }
            appService.addRequest_data('additem', data).then(function(response){
                $location.path('/viewI/'+response)
            },
            function(error){
                console.log('error this '+error)
            });
        },
        function(error){
            console.log('Error Uploading Images '+error)
        });
    }
    $scope.addtag=function(){
        if($scope.idata.itag=='')$scope.idata.itag=$scope.taglist;
        else{$scope.idata.itag=$scope.idata.itag+', '+$scope.taglist;}
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
  .controller('viewICtrl', ['$scope', '$routeParams', 'appService','$location',  function ($scope, $routeParams, appService, $location) {
    var id=$routeParams.id;

    appService.addRequest_data('viewI', id).then(function(response){
        $scope.inventory=response[0];
        console.log($scope.inventory);
        $scope.main_img=$scope.inventory.profilePic;
        $scope.img_list=$scope.inventory.allPic.split(',');

    },
    function(error){
      console.log('error this '.error);
    });

    $scope.delete=function(id){
      appService.addRequest_data('deleteq',id).then(function(response){
        $location.path('/viewallQ');
      })
    }
  }])

  .controller('editICtrl', ['$scope','appService', '$location','$routeParams', function ($scope, appService, $location, $routeParams) {
    var id=$routeParams.id;
    $scope.taglist='';
    $scope.all_category='';
    appService.addRequest_data('viewI', id).then(function(response){
        $scope.inventory=response[0];
        console.log($scope.inventory);
        $scope.main_img=$scope.inventory.profilePic;
        $scope.img_list=$scope.inventory.allPic.split(',');
        appService.addRequest_data('getCategoryWithSubCategory','').then(function(response){
          $scope.all_category=response;
          $scope.getSubcategory();
        },
        function(error){
          console.log('error this '.error)
        });
    //   $scope.itype=[{value:'', name:'Select An Item Type'},
    //     {value:'Service', name:'Service'},
    //     {value:'Pr   oduct', name:'Product'}
    //   ];
    //   $scope.measure_metric=[{value:'', name:'Select a Metric'},{value:'Sachet', name:'Sachet'},{value:'bottles', name:'bottles'},{value:'packs', name:'packs'},{value:'dozens', name:'dozens'}]
    //   $scope.itag=[{value:'', name:'Select a Popular Tags'},  {value:'Affordable', name:'Affordable'},
    //   {value:'cooking', name:'cooking'},
    //   {value:'sachet', name:'sachet'},
    //   {value:'oilly', name:'oily'}];
    //   console.log($scope.idata);
    },
    function(error){
      console.log('error this '.error);
    });

    $scope.getSubcategory=function(){
        $scope.all_subcategory=$scope.all_category[$scope.inventory.categoryId-1].allSubCategories;
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
        appService.uploadImages($scope.images).then(function(response){
            if(response!=='no Images'){
                console.log('foundimg');
                if(response.all_pics!=''){ $scope.inventory.allPic=$scope.inventory.allPic+','+response.all_pics;}
            }
            appService.addRequest_data('editI',$scope.inventory).then(function(response){
              $location.path('/viewI/'+id)
            },
            function(error){
              console.log('error this '.error)
            });
        },
        function(error){
            console.log('Error Uploading Images '+error)
        });
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
