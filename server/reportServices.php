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
	ob_start();
	$result = "";
	
    $serverDir = __FILE__;
	
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {        
    	$dirSeparator = "\\";    
    }else{
        $dirSeparator = "/";        
    }
    
    //$pos = strrpos($serverDir, $dirSeparator);
    //$serverDir = substr($serverDir, 0, $pos);
	
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

	ini_set('display_errors', 'Off');
	ini_set ('track_errors', 'On');	 
	ini_set ('max_execution_time', '300');	 
	ini_set ('memory_limit', '512M');
	ini_set ('log_errors',   'On');	
	ini_set ('error_log',    $path .'/server/tmp/php_error.log');	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/OLE");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/PHPExcel/Shared");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/PHPExcel/Shared/OLE");	
	error_reporting (E_ALL & ~E_NOTICE );	
//------------------	
    /*
    $postdata = file_get_contents("php://input"); 
    error_log(print_r($postdata, true) );
    $message = json_decode($postdata);
    */
    $postdata = $_GET["params"];
    $postdata = str_replace("\\", "", $postdata);
    $message = json_decode($postdata);
    
    
    $classObject = $message->service;	
	$params = $message->params;	
	$method = $message->method;	
	include("library.php");
    if (!defined('NEW_LINE'))
	   define("NEW_LINE", "<br>\r\n");	    
    include("bpc.php");
    $obj = new bpc();
    
	 try
        {
        echo "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
            <html xmlns='http://www.w3.org/1999/xhtml'>
            <head>
                <meta charset=utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <meta name='description' content='Mantis - Recon Intercompany's>
            <title>Preview</title>
            </head>                    
            <body>";
        loadCSS("server_util_laporan");
        $obj->callServices("financial_" . $classObject, $method, $params);
        echo "</body></html>";
    }catch(Exception $e)
    {
        error_log($e->getMessage());
    }
    ob_end_flush();
?>
