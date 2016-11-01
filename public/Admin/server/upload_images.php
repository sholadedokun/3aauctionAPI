<?php
header('Access-Control-Allow-Origin: *');
$directory="../itemimages";
$z=1;
$pic_upload="";
$prof_pic="";
$t=time();
for($x=1; $x<10; $x++){
    $pan="pic".$x;
    if(isset($_FILES["$pan"])){
        $tmp_name1 = $_FILES["$pan"]['tmp_name'];
        if (file_exists($tmp_name1)){
            if(($_FILES["$pan"]["size"]<=2048000)&&($_FILES["$pan"]["size"]>=10240)){
                $name = $_FILES["$pan"]['name'];
                $exp=explode(".",$name);
                $newname=$t."$x.".$exp[count($exp)-1];
                if(is_uploaded_file($tmp_name1)){
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

//Add Icon
if(isset($_FILES["icon"])){
    $tmp_name1 = $_FILES["icon"]['tmp_name'];
    if (file_exists($tmp_name1)){
        $name = $_FILES["icon"]['name'];
        $exp=explode(".",$name);
        $newname=$t."icon.".$exp[count($exp)-1];
        if(is_uploaded_file($tmp_name1)){
            $move = move_uploaded_file($tmp_name1,"$directory/$newname");
            chmod ("$directory/$newname",0777);
            $icon=$newname;
        }
    }
}
$a_json=array('profile_pic'=>$prof_pic, 'all_pics'=>$pic_upload, 'icon'=>$icon);
echo $_POST['callback'].json_encode($a_json);

?>
