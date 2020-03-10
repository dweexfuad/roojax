<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
//----------------------------------------------------	
	ob_end_clean();		
	if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
		ob_start("ob_gzhandler"); 
		header("Content-Encoding: gzip");
	}else ob_start();
	$result = "";

	$tempStr = $_POST['request'];	
	
	include("library.php");
    if (!defined('NEW_LINE'))
	   define("NEW_LINE", "<br>\r\n");
	
    define("WIN", "win");
    define("LINUX", "linux");

    // OS Base separator
    global $platform;
    global $dirSeparator;
    global $separator;
    global $serverDir;
    
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

global $rootDir;

$pos = strrpos($serverDir, $dirSeparator);
$serverDir = substr($serverDir, 0, $pos);
$pos = strrpos($serverDir, $dirSeparator);
$rootDir = substr($serverDir, 0, $pos);
$pos = strrpos($rootDir, $dirSeparator);
$path = $rootDir;
$rootDir = substr($rootDir,$pos);

//----------------------------------
//-------------- error_log8
	ignore_user_abort(true);
	set_time_limit(0);
	ini_set('display_errors', 'Off');
	ini_set ('track_errors', 'On');	 
	ini_set ('max_execution_time', '0');
	set_time_limit(0);	 
	//ini_set ('memory_limit', '2024M');
	//ini_set ('memory_limit', '2024M');
	//ini_set ('post_max_size	', '20M');
	ini_set ('log_errors',   'On');
	ini_set ('error_log',    $path.$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."php_error.log");	
	ini_set ('zlib.output_compression', 0);	
	set_include_path(get_include_path() . PATH_SEPARATOR . "C:\wamp\bin\php\php5.2.6\PEAR");
	
	set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php");
	set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php".$dirSeparator."PEAR");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex/PHPExcel");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex/PHPExcel/Shared");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex/PHPExcel/OLE");	
	set_time_limit(0);
	error_reporting (E_ALL & ~E_NOTICE );	
//------------------	
	
uses("server_httpRequest");
uses("server_Request");
uses("server_Response");
uses("server_Manager");
global $manager;

$manager = new server_Manager($serverDir);

/*
$zlibOn = ini_get('zlib.output_compression') || (ini_set('zlib.output_compression', 0) === false);
$encodings = (isset($_SERVER['HTTP_ACCEPT_ENCODING'])) ? strtolower($_SERVER['HTTP_ACCEPT_ENCODING']) : "";
$encoding = preg_match( '/\b(x-gzip|gzip)\b/', $encodings, $match) ? $match[1] : "";
*/

//if (isset($_SERVER['---------------']))
//			$encoding = "x-gzip";
//$supportsGzip =  !empty($encoding) && !$zlibOn && function_exists('gzencode');
		
header("ETag: PUB" . time());
header("Last-Modified: " . gmdate("D, d M Y H:i:s", time()-10) . " GMT");
header("Expires: " . gmdate("D, d M Y H:i:s", time() + 5) . " GMT");
//header("Vary: Accept-Encoding");  // Handle proxies	    
header("Pragma: no-cache");
header("Cache-Control: max-age=1, s-maxage=1, no-cache, must-revalidate");
session_cache_limiter("nocache");
//error_log(gmdate("D, d M Y H:i:s", time() + 5) ." ".gmdate("D, d M Y H:i:s", time() - 5));

//if ($supportsGzip)
//	header("Content-Encoding: " . $encoding);			
//-------------- Working Dir -----------------

//--------------------------------------------

$reqStr = $httpRequest->getParameter("request");

//$reqStr = AesCtr::decrypt($reqStr, "saisaisai", 128);
include("jsend.class.php");
$reqStr = urldecode($reqStr);

$reqStr = str_replace("\\\"", "\"", $reqStr);
$request = new server_Request();

$response = null;
try
{   $step = $reqStr;		
    $request->fromXML($reqStr);
	$step = "invoke manager";		
	global $dbSetting;
	global $userlog;
	$dbSetting = $request->dbSetting;
	$userlog = $request->userlog;	
    $response = $manager->invoke($request);
}
catch (Exception $e)
{
    $response = new server_Response();
//    write($request->getObjectId() ." ".$request->getMethodName() . " " );     	
    $response->setCode(1);
    $response-> setValue($e->getMessage());
	error_log($e->getMessage());
}

if ($response == null)
{
    $response = new server_Response();
//	write($request->getObjectId() ." ".$request->getMethodName() . " " );     
    $response->setCode(1);
    $response-> setValue("Invalid server response !");
	error_log("invalid response " . $tempStr. " ". $reqStr);
}

if ($manager->isSendResponse())
{   		
    header("Content-Type: text/xml"); 
	//$packer = new JavaScriptPacker($response->toXML(), 'Normal', false, false);
	//$data = $packer->pack();
	//error_log($data);
    //write($data);		    
    //if ($supportsGzip){
	//	$buffer = gzencode($response->toXML(), 9, FORCE_GZIP);		
	//	echo $buffer;
	//}else 	
	write($response->toXML());	
}
	
?>
