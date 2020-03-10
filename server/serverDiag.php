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
	if ($_GET["state"] == "TEMP"){
		$file = md5(date("r"));
		$file = $serverDir . $dirSeparator . "tmp" . $dirSeparator . $file;				
		$ok = file_put_contents($file,"testing");
		if (!$ok)
			echo "error";
		else {
			echo "success";
			unlink($file);
		}
	}else if ($_GET["state"] == "MANAGER"){
		uses("server_Manager");
		$mgr = new server_Manager();
		echo $mgr->init();
	}else {
		uses("server_DBConnection_connection");
		global $dbConnection;
		echo  $dbConnection->readFileConfig("dbSetting");
	}
?>