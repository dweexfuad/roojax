<?php
$serverDir = __FILE__;

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {
    	$dirSeparator = "\\";        
    }
    else
    {
    	$dirSeparator = "/";     
    }
    
$pos = strrpos($serverDir, $dirSeparator);
$path = substr($serverDir, 0, $pos);

ini_set('display_errors', 'Off');
ini_set ('track_errors', 'On');	 
ini_set ('max_execution_time', '3000');	 
ini_set ('memory_limit', '2024M');
ini_set ('upload_max_filesize', '100M');
ini_set ('post_max_size	', '20M');
ini_set ('log_errors',   'On');
ini_set ('error_log',    $path .$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."php_error.log");	



include_once("server/library.php");

if ( 0 < $_FILES['file']['error'] ) {
	echo json_encode(array("tipe" => "1", "msg" => "Error: Upload file gagal. Maximum (5M) "));
}else {
	if (move_uploaded_file($_FILES['file']['tmp_name'], 'server/media/upload/' . $_FILES['file']['name']) ){
		error_log('UPLOAD SUCCESS : server/media/upload/' . $_FILES['file']['name']);
		echo json_encode(array("tipe" => "0", "msg" => "done"));
	}else{ 
		echo json_encode(array("tipe" => "1", "msg" => "Gagal copy file ke server. Hubungi Adminstrator Anda"));
		error_log("tmp name => ". $_FILES['file']['tmp_name']);
		error_log("file name => ". $_FILES['file']['name']);
	}
}

?>
