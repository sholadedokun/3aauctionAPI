<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	$host = "localhost";
	$username = "root";
	$password = "root";
	$database = "poweroil";
	$con=mysqli_connect($host,$username,$password, $database);
	$t=time();
	$pic_upload="";
	$prof_pic="";
	if(isset($_POST['AddItem'])){
		$directory="itemimages";
		$z=1;
		for($x=1; $x<10; $x++){
			$pan="pic".$x;
			if(isset($_FILES["$pan"])){
				echo('here'.$x);
				$tmp_name1 = $_FILES["$pan"]['tmp_name'];
				if (file_exists($tmp_name1)){ 	echo('here2'.$x);
					if(($_FILES["$pan"]["size"]<=2048000)&&($_FILES["$pan"]["size"]>=10240)){
						$name = $_FILES["$pan"]['name'];
						$exp=explode(".",$name);
						$newname=$t."$x.".$exp[count($exp)-1];
						if(is_uploaded_file($tmp_name1)){
								echo('here3'.$x);
							$move = move_uploaded_file($tmp_name1,"$directory/$newname");
							chmod ("$directory/$newname",0777);
							if($pic_upload!=""){$pic_upload= $pic_upload.",".$newname;}
							else{$pic_upload=$newname;}
							${'name'.$x}=$newname;$z++;
							$prof_pic= $name1;
						}
					}
					else{ echo "Picture $x file is either too Large or too Small, Please Update with a smaller size";}
				}
			}
		}

		$sqlu="Insert into item values ( NULL,
		'".$_POST['item_category']."',
		'".$_POST['item_type']."',
		'".mysqli_real_escape_string($con, $_POST['item_title'])."',
		'".$_POST['item_rate']."',
		'".$_POST['item_discount']."',
		'".mysqli_real_escape_string($con,$_POST['item_description'])."',
		'".$_POST['item_tag']."',
		'".$prof_pic."',
		'".$pic_upload."',
		'".$t."',
		'".$t."')";
		$rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Item" . mysqli_error());
		$item_no = mysqli_insert_id($con);
	//	if($rsu){ header("Location: index.php?action=viewItem&item_no=".$item_no);}

	}
	else if (isset ($_GET['UpdateQ'])){
			$t=time();	$item_no=$_GET['item_no'];
		$sqlu="Update item set `item_text`='".mysqli_real_escape_string($con, $_GET['item_title'])."', `item_category`='".$_GET['item_category']."',  `item_type` ='".$_GET['item_type']."', `item_response_options`='".mysqli_real_escape_string($con, $_GET['q_res_options'])."', `item_scale`='".$_GET['item_tag']."', `item_response_min`='".$_GET['min_response']."', `item_response_max`='".$_GET['max_response']."', `item_weight`='".$_GET['q_weight']."', `item_updated`='".$t."' where `item_no`=".$item_no;
		$rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new item" . mysqli_error());
		if($rsu){ header("Location: index.php?action=viewItem&item_no=$item_no");}
		}
	else if(isset($_GET['AddC'])){
		$t=time();
		$sqlu="Insert into category values ( NULL, '".$_GET['category_title']."','".$_GET['category_description']."', '', '".$t."', '".$t."')";
		$rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Category" . mysqli_error());
		$c_id = mysqli_insert_id();
		if($rsu){ header("Location: index.php?action=viewC&c_id=".$c_id);}
	}
	else if(isset($_GET['UpdateC'])){
		$t=time();
		$sqlu="Update category set category_title, category_description, category_update values ( '".$_GET['category_title']."','".$_GET['category_description']."', '', '".$t."') where `category_id`=".$_GET['c_id'];
		$rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error());
		$c_id = mysqli_insert_id();
		if($rsu){ header("Location: index.php?action=viewC&c_id=".$c_id);}
	}
	else if(isset($_GET['action'])&& ($_GET['action'] =='deleteq')){
		$sqlu="Delete from item  where `item_no`=".$_GET['item_no'];
		$rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error());
		$c_id = mysqli_insert_id();
		if($rsu){ header("Location: index.php?action=viewallItem");}
	}
	$sql='Select * from item  order by item_no Desc';
	$rs=mysqli_query($con, $sql) or die ("Error : could not Fetch items" . mysqli_error());
	$total_rows= mysqli_num_rows($rs);
	$info=mysqli_fetch_array($rs);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>item Update</title>
<script src="jquery.js" type="text/javascript"></script>
<script>
	$(document).ready(function() {
		$('.seo').change( function(){
		$tex=$(this).attr('id')+'t';
		$tet="#"+"$tex";
		console.log($("#"+$tex).val());
		$z="";
		$x=$("#"+$tex).val();
		$y=$(this).val();
		if($x!=""){
			$z= $x+"| "+$y;
			$("#"+$tex).val($z);
		}
		else{$("#"+$tex).val($y);}
		})
	})
</script>
</head>

<body>

	<div class="" style="margin:10% 0 0 30%; width:600px; height:auto; border:2px solid #aaa">
    		<div style="padding:10px; background:#999; color:#fff; text-align:right"><a href="index.php">Home</a></div>
    		<?php if (isset($updated)){?><div style="padding:10px"> <?php echo $updated; ?> </div> <?php } ?>

        	<?php if(!isset($_GET['action'])){ ?>

    	   	<div class="" style="padding:5px 15px; background:#ccc; color:#555"><h2>Update Item</h2></div>
        	<div class="" style="padding:10px; background:#eee; color:#555">
            	<div><a href="index.php?action=addnewi">Add New Item</a></div>
            </div>
            <div class="" style="padding:10px; background:#bbb; color:#555">
            	<div><a href="index.php?action=addnewc">Add New Category</a></div>
            </div>
            <div class="" style="padding:10px; background:#eee; color:#555">
            	<div><a href="index.php?action=viewItem">View All items</a></div>
            </div>
            <div class="" style="padding:10px; background:#eee; color:#555">
            	<div><a href="index.php?action=viewallCategory">View All Categories</a></div>
            </div>

        <div  style="padding:10px;"><b>Last Updated :</b>  <?php echo gmdate("F j, Y, g:i a", $info[10]); ?></div>
        <div  style="padding:10px;"><b>Total items :</b> <?php echo $total_rows;  ?></div>
         <?php }
		 else if(($_GET['action']=='addnewi')|| ($_GET['action']=='editq'))
		 {$a=$_GET['action']; $infoU=array('','','','','','','','','','','','');?>
         	<div class="" style="padding:5px 15px; background:#ccc; color:#555">
            	<?php if($a=='addnewi'){?>	<h2>Add New item</h2><?php } else{?><h2>Update item</h2> <?php
					$sqlU = "SELECT * FROM `item` where `item_no`=".$_GET['item_no'];
					$resU=mysqli_query($con, $sqlU) or die ("Error : could not Seect category" . mysqli_error());
					$infoU= mysqli_fetch_array($resU);
				} ?>
            </div>
            <form action="" method="post" enctype="multipart/form-data" >
            	<input type="hidden" name="item_no" value="<?php echo $infoU[0]  ?>" />
        	<div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Select item Category</b></div>
                <span><select name="item_category" id="item_category" class="seo">
                  	<option  value="">Select A Category</option>
                    <?php
						$sqlcheck = "SELECT category_id, category_title FROM `category` order by category_id";
						$rescheck = mysqli_query($con, $sqlcheck) or die ("Error : could not Select category ". mysqli_error());;
						while($info= mysqli_fetch_array($rescheck)){
					?>
        	        <option  value="<?php echo $info[0]?>" <?php if ($infoU[5]==$info[0]) {echo "selected";} ?>><?php echo ($info[1])?></option>
                    <?php }?>
                    </select>
      	        </span>
            </div>
            <div class="" style="padding:10px; background:#bbb; color:#555">
            	<div><b>Select item Type</b></div>
                <div><select name="item_type" id="item_type" class="seo">
                  	<option  value="">Select A Type</option>
                    <option  value="p" <?php if ($infoU[4]=="p") {echo "selected";}?>>Product</option>
                    <option  value="s" <?php if ($infoU[4]=="s") {echo "selected";}?>>Services</option>
                    </select>
      	        </div>
            </div>
            <div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Item Name</b></div>
                <div>
                	<input type="textbox" name="item_title" value="<?php echo $infoU[1] ?>">
      	        </div>
            </div>
			<div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Item Description</b></div>
                <div>
                	<textarea name="item_description"  cols="40" rows="5"><?php echo $infoU[2] ?></textarea>
      	        </div>
            </div>
			<div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Item Rate in Naira</b></div>
                <div>
                	<input type="textbox"  name="item_rate" value="<?php echo $infoU[3] ?>"/>
      	        </div>
            </div>
			<div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Item Discount</b></div>
                <div>
                	<input type="textbox" name="item_discount" value="<?php echo $infoU[4] ?>"/>
      	        </div>
            </div>
            <div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Tags</b></div>
                <div>
					<select name="item_tags" id="item_tag" class="seo">
	                  	<option  value="">Popular Tags</option>
	                    <option  value="Affordable">Affordable</option>
	                    <option  value="cooking">cooking</option>
	                    <option  value="sachet">sachet</option>
	                    <option  value="oilly">oily</option>
                    </select>
      	        </div>
                <div>
                	<textarea id="item_tagt" name="item_tag" cols="50" rows="8"><?php echo $infoU[6] ?></textarea>
      	        </div>
            </div>
			<div class="" style="padding:10px; background:#eee; color:#555">
            	<div><b>Upload Pictures</b></div>
                <div>
					<div><input type="file" name="pic1" id="pic1" size="30" /></div>
					<div><input type="file" name="pic2" id="pic2" size="30" /></div>
					<div><input type="file" name="pic3" id="pic3" size="30" /></div>
					<div><input type="file" name="pic4" id="pic4" size="30" /></div>
					<div><input type="file" name="pic5" id="pic5" size="30" /></div>
					<div><input type="file" name="pic6" id="pic6" size="30" /></div>

      	        </div>

            </div>

            <?php if($a=='addnewi'){?><div  style="padding:10px; " ><input type="submit" value="Add item" name="AddItem" /></div><?php } else{ ?>
            	<div  style="padding:10px; " ><input type="submit" value="Update item" name="UpdateQ" /></div>
			<?php }?>
           	</form>
          <?php }
		 else if($_GET['action']=='addnewc')
		 {?>
         	<div class="" style="padding:5px 15px; background:#ccc; color:#555"><h2>Add New Category</h2></div>
            <form action="index.php?action=updateC" method="get" >
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Category Title</b></div>
                    <div>
                        <textarea name="category_title"></textarea>
                    </div>
                </div>
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Category Description</b></div>
                    <div>
                        <textarea name="category_description"></textarea>
                    </div>
                </div>
                <div  style="padding:10px;"><input type="submit" value="Add Category" name="AddC" /></div>
           	</form>
         <?php  }
		 else if($_GET['action']=='viewItem')
		 {
						$sqlQ = "SELECT * FROM `item` where item_no='".$_GET['item_no']."' ";
						$resQ= mysqli_query($con, $sqlQ) or die ("Error : could not Select category" . mysqli_error());;
						$infoQ= mysqli_fetch_array($resQ);
					?>
         	<div class="" style="padding:5px 15px; background:#ccc; color:#555"><h2>Item View</h2></div>
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Select Item Category</b></div>
                    <div><?php $sqlQc = "SELECT category_title FROM `category` where category_id='".$infoQ[2]."' ";
						$resQc=mysqli_query($con, $sqlQc) or die ("Error : could not Select category" . mysqli_error());;
						$infoQc= mysqli_fetch_array($resQc); echo $infoQc[0] ?></div>
                </div>
                <div class="" style="padding:10px; background:#bbb; color:#555">
                    <div><b>Select Item Type</b></div>
                    <div><?php if( $infoQ[4] == 'p'){echo 'Product';} else if( $infoQ[4] == 's'){echo 'Service';}  ?></div>
                </div>
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Item Text</b></div>
                    <span> <?php echo $infoQ[1] ?>     </span>
                </div>
                <?php if(  $infoQ[5]!=''){?>
                <div class="" style="padding:10px; background:#bbb; color:#555">
                    <div><b>Response Options</b></div>
                    <div>     <?php echo $infoQ[5];?>   </div>
                </div>
                <?php } if(  $infoQ[6]!=''){?>
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Measuring Scale</b></div>
                    <div>   <?php echo $infoQ[6];?>  </div>
                </div>
                <?php } ?>
                <div class="" style="padding:10px; background:#bbb; color:#555">
                    <div><b>Min Response</b></div>
                    <div> <?php echo $infoQ[7];?> </div>
                </div>
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Max Response</b></div>
                    <div> <?php echo $infoQ[8];?></div>
                </div>
                <div class="" style="padding:10px; background:#bbb; color:#555">
                    <div><b>Item Weight</b></div>
                    <div><?php echo $infoQ[9];?></div>
                </div>
                <span  style="padding:10px; " ><b>Last Updated:</b> <?php echo gmdate("F j, Y, g:i a", $infoQ[10]) ?></span><br/>
                <span  style="padding:10px; " ><b>Date Created:</b> <?php echo gmdate("F j, Y, g:i a", $infoQ[11]) ?></span><br/>
                <span  style="padding:10px; " ><a href="index.php?action=addnewi">Add New Item</a></span>
                <span  style="padding:10px; " ><a href="index.php?action=editq&item_no=<?php echo $_GET['item_no'] ?>">Edit this Item</a></span>
                <span  style="padding:10px; " ><a href="index.php?action=deleteq&item_no=<?php echo $_GET['item_no'] ?>">Delete Item</a></span>
                <span  style="padding:10px; " ><a href="index.php?action=viewallItem">View all Items</a></span>


         <?php }
		 else if($_GET['action']=='viewC'){


						$sqlC = "SELECT * FROM `category` where category_id='".$_GET['c_id']."' ";
						$resC=mysqli_query($con, $sqlC) or die ("Error : could not Select category" . mysqli_error());;
						$infoC= mysqli_fetch_array($resC);
					?>
         	<div class="" style="padding:5px 15px; background:#ccc; color:#555"><h2>Category View</h2></div>
                <div class="" style="padding:10px; background:#eee; color:#555">
                    <div><b>Category Title</b></div>
                    <div><?php  echo $infoC[1] ?></div>
                </div>
                <div class="" style="padding:10px; background:#bbb; color:#555">
                    <div><b>Category Description</b></div>
                    <div><?php echo $infoC[2]?></div>
                </div>
                <span  style="padding:10px; " ><b>Last Updated:</b> <?php echo gmdate("F j, Y, g:i a", $infoC[4]) ?></span><br/>
                <span  style="padding:10px; " ><b>Date Created:</b> <?php echo gmdate("F j, Y, g:i a", $infoC[5]) ?></span><br/>
                <span  style="padding:10px; " ><a href="index.php?action=addnewc">Add New Category</a></span>
                <span  style="padding:10px; " ><a href="index.php?action=editC&c_id=<?php echo $_GET['c_id'] ?>">Edit this category</a></span>
                <span  style="padding:10px; " ><a href="index.php?action=viewallCategory">View all Categories</a></span>


         <?php }else if($_GET['action']=='viewallItem'){  ?>
         	<div style="padding:5px 15px; background:#ccc; color:#555"><h2>View All Items</h2></div>
			<?php
				$sqlCAT = "SELECT * FROM `category` order by `category_title` asc";
				$resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error());
				while($infoCAT= mysqli_fetch_array($resCAT)){
			?>
                    <div class="" style="padding:10px; background:#eee; color:#555; border-bottom:2px solid #555">
                    <div><b> <?php echo $infoCAT[1] ?></b></div>
                    <?php
						$sqlAQ = "SELECT * FROM `item` where `category` = '$infoCAT[0]' order by `item_order` asc";
						$resAQ=mysqli_query($con, $sqlAQ) or die ("Error : could not Select Items" . mysqli_error());;
						while($infoAQ= mysqli_fetch_array($resAQ)){
					?>
                    <div>
                    	<a href="index.php?action=viewItem&item_no=<?php echo $infoAQ[0] ?>"><?php  echo $infoAQ[1] ?></a></div>
                    <?php } ?>
                </div>
             <?php }

			 }
			 else if($_GET['action']=='viewallCategory'){ ?>
             <div style="padding:5px 15px; background:#ccc; color:#555"><h2>View All Categories</h2></div>
             <?php
			 $sqlCAT = "SELECT * FROM `category` order by `category_title` asc";
				$resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error());
				while($infoCAT= mysqli_fetch_array($resCAT)){
			  ?>
               <div class="" style="padding:10px; background:#eee; color:#555; border-bottom:2px solid #555">
                   <div><b> <?php echo $infoCAT[1] ?></b></div>
                   <div><?php echo $infoCAT[2] ?></div>
                   <div>Total Items: <?php
				   		$sqlCATq = "SELECT * FROM `item` where `item_category`='".$infoCAT[0]."'";
						$resCATq=mysqli_query($con, $sqlCATq) or die ("Error : could not Select Categories" . mysqli_error());
				   		$total_row= mysqli_num_rows($resCATq);
				    echo $total_row ?></div>
                   <div>Date Created: <?php echo gmdate("F j, Y, g:i a",  $infoCAT[5]) ?></div>
                   <div>Last Updated:  <?php echo gmdate("F j, Y, g:i a",  $infoCAT[4]) ?></div>
               </div>
             <?php }
			 }?>
    </div>



</body>
</html>
