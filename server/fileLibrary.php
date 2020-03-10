<?php
include_once("library.php");
function listDir($dirName){    
    $list = scandir($dirName);            
    foreach ($list as $key => $value)
    {
        if (($value != ".svn") && ($value != ".") && ($value != ".."))
        {
		echo ("?" . $dirName . "/" . $value . "<br>");
		if (is_dir($dirName . "/" . $value))
			listDir($dirName . "/" . $value);            
        }
    }       
}
$dir = $_POST['dir'];	
$dir = urldecode($dir);
$dir = str_replace("\\\\","/",$dir);
listDir($dir);
?>
