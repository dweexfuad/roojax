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
	error_log("path :" . $path);
	ini_set ('error_log',    $path .'/server/tmp/php_error.log');	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/OLE");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/PHPExcel/Shared");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/PHPExcel/Shared/OLE");	
	error_reporting (E_ALL & ~E_DEPRECATED );
 
//------------------	
    
    
    
    $classObject = $_REQUEST['object'];	
	$param = $_REQUEST['param'];	
	$method = $_REQUEST['method'];	
	$session = $_REQUEST['session'];	
	$addparam = $_REQUEST['addparam'];	
	include("library.php");
    if (!defined('NEW_LINE'))
	   define("NEW_LINE", "<br>\r\n");	    
    
    uses("server_Manager");
	global $manager;
    $manager = new server_Manager($serverDir);

    $param = str_replace("\\","",$param);
    $reqParams = explode("#", urldecode($param));
	uses($classObject);
	if ($session == "undefined") $session = null;	
	$object = new $classObject($addparam);
	$params = "";
    $pNo = 0;	
    uses("server_util_arrayList");
    foreach ($reqParams as $key => $value)
    {
        $params .= ",\$p$pNo";                
        if (strpos($value,"<array>") != false){
            $array = explode("<array>",urldecode($value));
            $value = new server_util_arrayList();
            foreach($array as $key2 => $val) 
                if ($val != "") $value->add($val);
        }else if ($value == "undefined") $value = null;
        else if ($value == "false") $value = false;
        else if ($value == "true") $value = true;        
        eval("\$p$pNo = \$value;");        
        $pNo++;
    }    
    if ($params != "")
        $params = substr($params, 1);
    $script = "\$result = \$object->" . $method . "($params);";	
    eval($script);
    echo ($result);  
	$object->deinit();
    ob_end_flush();
?>
