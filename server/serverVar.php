<?php
	include("library.php");
	// OS Base separator    
    $serverDir = __FILE__;

    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {
        $platform = WIN;
    	$dirSeparator = "\\";
        $separator = ";";
    }
    else
    {
        $platform = LINUX;
    	$dirSeparator = "/";
        $separator = ":";
    }
	$pos = strrpos($serverDir, $dirSeparator);
	$serverDir = substr($serverDir, 0, $pos);
	$exp = time() + 24*60*60; // Change cookie expiry time here
	setcookie("rujaxuid",$_POST["uid"],$exp);
	setcookie("rujaxpwd", encrypt($_POST["pwd"], 'R#8fxpeflHve%0YS'), $exp); // Set up password cookies
?>