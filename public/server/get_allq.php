<?php
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$host = "localhost";
// $username = "root";
// $password = "";
// $database = "poweroil";
    // $username = "autonimr_3aauct";
    // $password = "3aauctions";
    // $database = "autonimr_3aautions";
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
function getInventory($con){
    $a_json=array();
    $sqlCAT = "SELECT I.*, S.* FROM `inventories` AS I Join `Auction Settings` AS S on I.ID=S.propertyId where I.status='active' order by I.ID desc";
    $resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error($con));
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
else if ($_POST['action']=='getallInventory'){
    $allinventory=getInventory($con);
    echo json_encode($allinventory);
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
else if($_POST['action'] =='updatec'){
  $t=time();
  $sqlu="Update `category` set `category_title` ='".mysqli_real_escape_string($con, $_POST['c_name'])."', `category_descripiton`='".mysqli_real_escape_string($con, $_POST['c_desc'])."', `category_update`='$t' where `category_id`=".mysqli_real_escape_string($con, $_POST['c_id']);
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  $c_id = mysqli_insert_id();
  if($rsu){}
}
else if($_POST['action'] =='deletec'){
  $sqlu="Delete from category  where `category_id`=".$_POST['data'];
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  if($rsu){echo $_POST['callback'].'Deleted';}
  else{echo $_POST['callback'].'Error Deleting category';}
}
elseif ($_POST['action']=='getallc') {
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

  //retrieve all the item's data
  $sqlQ = "SELECT * FROM `item` where item_no='".$_POST['data']."' ";
  $resQ=mysqli_query($con, $sqlQ) or die ("Error : could not Select category" . mysqli_error($con));;
  $infoQ= mysqli_fetch_array($resQ);

  //select the category name from the database//
  $sqlQc = "SELECT category_title FROM `category` where category_id='".$infoQ[1]."' ";
  $resQc=mysqli_query($con, $sqlQc) or die ("Error : could not Select category" . mysqli_error($con));
  $infoQc= mysqli_fetch_array($resQc);
  $a_json['item_data']= $infoQ;
  $a_json['category_name']=$infoQc[0];
  echo $_POST['callback'].json_encode($a_json);
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
elseif($_POST['action']=='sendContact'){
    $to=$_POST['email'];
    $subject = "Thanks for contacting 3A Auction House";
    $message= 'Dear '.$_POST['name'].',<br> <br>';
    $message.= 'Thank you for contacting our Auction House. Our representative will contact you shortly.';
    $message.='<br><br><b><em>3A Auction House Team</em></b>';
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=iso-8859-1" . "\r\n";
  //   $headers .= "Bcc:sholadedokun@gmail.com\r\n";
    $headers .= "From:3A Auction House<info@3aauctions.com>\r\n";
    $a = mail($to, $subject, $message, $headers);

    // $to='info@3aauctions.com';
    $to="sholadedokun@yahoo.com";
    $subject = "An Online User contacted you.";
    $message= 'Dear Admin,<br> <br>';
    $message.= 'Find below User details:';
    $message.= '<br><b>User Email:</b> '.$_POST['email'];
    $message.= '<br><b>User Name:</b>'.$_POST['name'];
    $message.= '<br><b>User Phone Number:</b>'.$_POST['phone'];
    $message.= '<br><b>User Message:<b> '.$_POST['message'];
    $headers = "MIME-Version: 1.0" . "\r\n";

    $headers .= "Content-type:text/html;charset=iso-8859-1" . "\r\n";

  //   $headers .= "Bcc:sholadedokun@gmail.com\r\n";
    $headers .= "From:3A Auction House Webmaster<info@3aauctions.com>\r\n";
    $a = mail($to, $subject, $message, $headers);
    echo 'Your message was received our representative will contact you shorlty.';
}
else if($_POST['action'] =='addSubscriber'){
  $t=time();
  $sql="Select * from `Newsletter`  Where emailAddress='".$_POST['data']."'";
  $rs=mysqli_query($con, $sql) or die ("Error : could not Fetch items" . mysqli_error($con));
  $total_rows= mysqli_num_rows($rs);
  if($total_rows==0){
      $sqlu="Insert into `Newsletter` values ( NULL,
      '".mysqli_real_escape_string($con, $_POST['data'])."',
     '".$t."')";
      $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Inventory " . mysqli_error($con));
      if($rsu){
          echo 'Thanks for subscribing to our Newsletter.';
          $to=$_POST['data'];
          $subject = "Thanks for subscribing to our Newsletter";
          $message= 'Dear Subscriber,<br> <br>';
          $message.= 'Thank you for subscribing to our Newsletter. We are glad to have you on board.';
          $message.='<br><br><b><em>3A Auction House Team</em></b>';
          $headers = "MIME-Version: 1.0" . "\r\n";
          $headers .= "Content-type:text/html;charset=iso-8859-1" . "\r\n";
          //$headers .= "Bcc:poweroil.omp@tolaram.com\r\n";
        //   $headers .= "Bcc:sholadedokun@gmail.com\r\n";
          $headers .= "From:3A Auction House<info@3aauctions.com>\r\n";
          $a = mail($to, $subject, $message, $headers);
      }
  }
  else{
      echo 'Your email is already subscribed. Thanks for trying again!!!';
  }

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
