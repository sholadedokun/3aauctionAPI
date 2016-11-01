<?php
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 0);
$host = "localhost";
// $username = "root";
// $password = "";
// $database = "poweroil";
$username = "root";
$password = "root";
$database = "3aAuctions";
$con=mysqli_connect($host,$username,$password, $database);
$t=time();

function getallcategory($con){
    $a_json=array();
    $sqlCAT = "SELECT * FROM `Inventory Category` order by `Name` asc";
    $resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error($con));
    while($infoCAT= mysqli_fetch_array($resCAT)){
      $a__json['CategoryName']= $infoCAT[1];
      $a__json['CategoryId']= $infoCAT[0];
      array_push($a_json, $a__json);
    }

    return $a_json;
}
function getallSubcategory($con, $category_no){
    $a_json=array();
    $sqlCAT = "SELECT * FROM `Inventory Subcategory` where `CategoryId`='".$category_no."' order by `subcategoryName` asc";
    $resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error($con));
    while($infoCAT= mysqli_fetch_array($resCAT)){
      $a__json['subcategoryName']= $infoCAT[2];
      $a__json['subcategoryId']= $infoCAT[0];
      array_push($a_json, $a__json);
    }
    //print_r($a_json);
    return $a_json;
}
function getInventory($con, $condition){
    $a_json=array();
    $sqlCAT = "SELECT I.*, S.* FROM `inventories` AS I Join `Auction Settings` AS S on I.ID=S.propertyId ";
    if(is_object($condition)){
        $sqlCAT .=" Where ".$condition->column."=";
        if($condition->columDataType=='int'){$sqlCAT .=$condition->value;}
        else{$sqlCAT .="'".$condition->value."'";}
    }
    $sqlCAT .=" order by I.ID desc";
    //echo $sqlCAT;
    $resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Inventories" . mysqli_error($con));
    while($infoCAT= mysqli_fetch_assoc( $resCAT)){
      array_push($a_json, $infoCAT);
    }
    //print_r($a_json);
    return $a_json;
}

if($_POST['action']=='addCategory'){
    $sqlu="Insert into `Inventory Category` values ( NULL,
    '".mysqli_real_escape_string($con, $_POST['title'])."',
    '".mysqli_real_escape_string($con, $_POST['desc'])."',
    '".mysqli_real_escape_string($con, $_POST['avartar_url'])."',
    '".$t."')";
    $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Category" . mysqli_error($con));
    $item_no = mysqli_insert_id($con);
    if($item_no!=''){
        //retrieve all from Category
        $allcategory=getallcategory($con);
        echo json_encode($allcategory);
    }

}
else if ($_POST['action']=='getCategory'){
    $allcategory=getallcategory($con);
    echo json_encode($allcategory);
}
else if ($_POST['action']=='getCategoryWithSubCategory'){
    $allcategory=getallcategory($con);
    for($i=0; $i<count($allcategory); $i++){
        $allsubcategory=getallSubcategory($con, $allcategory[$i]['CategoryId']);
        if(count($allsubcategory)>0){
        //    $allcategory[$i]['allCategories']=array();
            $allcategory[$i]['allSubCategories']=$allsubcategory;
        }



        //print_r($value);
    }
    echo json_encode($allcategory);
}
else if ($_POST['action']=='addSubCategory'){
    $sqlu="Insert into `Inventory Subcategory` values ( NULL,
    '".mysqli_real_escape_string($con, $_POST['category'])."',
    '".mysqli_real_escape_string($con, $_POST['title'])."',
    '".mysqli_real_escape_string($con, $_POST['desc'])."',
    '".mysqli_real_escape_string($con, $_POST['avartar_url'])."',
    '".$t."')";
    $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Sub Category" . mysqli_error($con));
    $item_no = mysqli_insert_id($con);
    if($rsu){ echo 'Subcategory Added'; }
}
else if ($_POST['action']=='getallInventory'){
    $allinventory=getInventory($con);
    echo json_encode($allinventory);
}
else if($_POST['action'] =='deleteq'){
  $sqlu="Delete from `item`  where `item_no`=".$_POST['data'];
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  if($rsu){echo $_POST['callback'].'Deleted';}
  else{echo $_POST['callback'].'Error Deleting item';}
}
else if($_POST['action'] =='addInventory'){
  $t=time();
  $sqlu="Insert into `Inventories` values ( NULL,
  '".mysqli_real_escape_string($con, $_POST['category'])."',
  '".mysqli_real_escape_string($con, $_POST['subcategory'])."',
  '".mysqli_real_escape_string($con, $_POST['type'])."',
  '".mysqli_real_escape_string($con, $_POST['name'])."',
  '".mysqli_real_escape_string($con, $_POST['description'])."',
  '".mysqli_real_escape_string($con, $_POST['address'])."',
  '".mysqli_real_escape_string($con, $_POST['lg'])."',
  '".mysqli_real_escape_string($con, $_POST['state'])."',
  '".mysqli_real_escape_string($con, $_POST['country'])."',
  '".mysqli_real_escape_string($con, $_POST['proPic'])."',
  '".mysqli_real_escape_string($con, $_POST['allPic'])."',
  '".mysqli_real_escape_string($con, $_POST['status'])."',
  '".$t."', '".$t."')";
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Inventory " . mysqli_error($con));
  $Inv_id = mysqli_insert_id($con);
  if($rsu){
      $sqlu="Insert into `Auction Settings` values ( NULL,
      '".$Inv_id."',
      '".mysqli_real_escape_string($con, $_POST['startingPrice'])."',
      '".mysqli_real_escape_string($con, $_POST['reservePrice'])."',
      '".mysqli_real_escape_string($con, $_POST['buyNowPrice'])."',
      '".mysqli_real_escape_string($con, $_POST['biddingRate'])."',
      '".mysqli_real_escape_string($con, $_POST['startDate'])."',
      '".mysqli_real_escape_string($con, $_POST['startTime'])."',
      '".mysqli_real_escape_string($con, $_POST['closeDate'])."',
      '".mysqli_real_escape_string($con, $_POST['closeTime'])."',
      '".$t."', '".$t."')";
      $rsuI=mysqli_query($con, $sqlu) or die ("Error : could not Add new Auction Settings" . mysqli_error($con));
      if($rsuI){
          $sqlu="Insert into `Inventory tags` values ( NULL,
          '".$Inv_id."',
          '".mysqli_real_escape_string($con, $_POST['itag'])."',
          '".$t."', '".$t."')";
          $rsuT=mysqli_query($con, $sqlu) or die ("Error : could not Add new Auction tags" . mysqli_error($con));
          if($rsuT){
              echo $_POST['callback'].$Inv_id;
          }
      }
  }

}
else if($_POST['action'] =='editI'){
  $t=time();
  $sqlu="Update `inventories` set
  `categoryId` ='".mysqli_real_escape_string($con, $_POST['categoryId'])."',
  `subcategoryId`='".mysqli_real_escape_string($con, $_POST['subcategoryId'])."',
  `type`='".mysqli_real_escape_string($con, $_POST['type'])."',
  `name`='".mysqli_real_escape_string($con, $_POST['name'])."',
  `description`='".mysqli_real_escape_string($con, $_POST['description'])."',
  `address`='".mysqli_real_escape_string($con, $_POST['address'])."',
  `lg`='".mysqli_real_escape_string($con, $_POST['lg'])."',
  `state`='".mysqli_real_escape_string($con, $_POST['state'])."',
  `country`='".mysqli_real_escape_string($con, $_POST['country'])."',
  `profilePic`='".mysqli_real_escape_string($con, $_POST['profilePic'])."',
  `allPic`='".mysqli_real_escape_string($con, $_POST['allPic'])."',
  `status`='".mysqli_real_escape_string($con, $_POST['status'])."',
  `lastUpdated`='$t' where `ID`=".mysqli_real_escape_string($con, $_POST['ID']);
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  if($rsu){
      $sqlu="Update `Auction Settings` set
      `startingPrice` ='".mysqli_real_escape_string($con, $_POST['startingPrice'])."',
      `reservePrice`='".mysqli_real_escape_string($con, $_POST['reservePrice'])."',
      `buyNowPrice`='".mysqli_real_escape_string($con, $_POST['buyNowPrice'])."',
      `biddingGap`='".mysqli_real_escape_string($con, $_POST['biddingGap'])."',
      `biddingStartDate`='".mysqli_real_escape_string($con, $_POST['biddingStartDate'])."',
      `biddingStartTime`='".mysqli_real_escape_string($con, $_POST['biddingStartTime'])."',
      `biddingCloseDate`='".mysqli_real_escape_string($con, $_POST['biddingCloseDate'])."',
      `biddingCloseTime`='".mysqli_real_escape_string($con, $_POST['biddingCloseTime'])."',
      `aSettingsLastupdated`='".mysqli_real_escape_string($con, $_POST['aSettingsLastupdated'])."',
      `aSettingsLastupdated`='$t' where `propertyId`=".mysqli_real_escape_string($con, $_POST['ID']);
      $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
      echo 'done';}
}
else if($_POST['action'] =='deletec'){
  $sqlu="Delete from category  where `category_id`=".$_POST['data'];
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  if($rsu){echo $_POST['callback'].'Deleted';}
  else{echo $_POST['callback'].'Error Deleting category';}
}
else if ($_POST['action']=='getallc') {
  $a_json[0]=array('c_id' => '', 'c_name'=>'Select a category' );
  $sqlcheck = "SELECT category_id, category_title, category_descripiton FROM `category` order by category_id";
  $rescheck = mysqli_query($con, $sqlcheck) or die ("Error : could not Select category ". mysqli_error());;
  while($info= mysqli_fetch_array($rescheck)){
    $qobject = array('c_id' => $info[0], 'c_name'=>$info[1], 'c_desc'=>$info[2] );
    array_push($a_json, $qobject);
  }
  echo $_POST['callback'].json_encode($a_json);
}
else if($_POST['action']=='viewI'){

    $condition = (object) array('column' => 'I.ID', 'columDataType'=>'int', 'value'=> $_POST['data']);
    $inventory= getInventory($con, $condition);
    echo $_POST['callback'].json_encode($inventory);
}
else if($_POST['action']=='viewallI'){
  //retrieve all the Categories
  $a_json=array();
  $sqlCAT = "SELECT * FROM `category` order by `category_title` asc";
  $resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error($con));
  while($infoCAT= mysqli_fetch_array($resCAT)){
    $a_sub_json['categoryname']= $infoCAT[1];
    $a_sub_json['items']=array();
    //select the item with the category_id//
    $sqlAQ = "SELECT * FROM `item` where `item_category` = $infoCAT[0] order by `item_no` asc";

    $resAQ=mysqli_query($con, $sqlAQ) or die ("Error : could not Select items" . mysqli_error($con));;
    while($infoAQ= mysqli_fetch_array($resAQ)){
      $qobject = array('i_id' => $infoAQ[0], 'i_title'=>$infoAQ[3] );

      array_push($a_sub_json['items'], $qobject);
    }

    array_push($a_json, $a_sub_json);
  }
 // print_r($a_json);
  echo $_POST['callback'].json_encode($a_json);
}
elseif ($_POST['action']=='getallqinc') {
  $a_json[0]=array('q_id' => '', 'q_text'=>'Select a item' );
  $sqlAQ = "SELECT * FROM `item` where `item_category` = '$data' order by `item_order` asc";
  $resAQ=mysqli_query($con, $sqlAQ) or die ("Error : could not Select items" . mysqli_error($con));
  while($infoAQ= mysqli_fetch_array($resAQ)){
    $qobject = array('q_id' => $infoAQ[0], 'q_text'=>$infoAQ[1] );
    array_push($a_json, $qobject);
  }
  echo $_POST['callback'].json_encode($a_json);
}
else{
    $sql='Select * from item  order by item_no Desc';
    $rs=mysqli_query($con, $sql) or die ("Error : could not Fetch items" . mysqli_error());
    $total_rows= mysqli_num_rows($rs);
    $info=mysqli_fetch_array($rs);
    $a_json['total_items']= $total_rows;
    $a_json['last_update']=gmdate("F j, Y, g:i a",$info[11]);
    echo $_POST['callback'].json_encode($a_json);
}

 ?>
