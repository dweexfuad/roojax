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
	
	
    $classObject = $_REQUEST['object'];	
	$param = $_REQUEST['param'];	
	$method = $_REQUEST['method'];	
	include("library.php");
    if (!defined('NEW_LINE'))
	   define("NEW_LINE", "<br>\r\n");	    
    $param = str_replace("\\","",$param);
    $params = explode("#",$param);
    $filter = $params[0];
    $rows = $params[1];
    $filter2 = $params[2];
    $page = $params[3];
    $showFilter = $params[4];
    $perusahaan = $params[5];
    $dataFilter = $params[6];
    $resultType = $params[7];
	uses($classObject);
	$obj = new $classObject();
	$obj->setFilter($filter);
	$obj->setRows($rows);
	$obj->setFilter2($filter2);

    switch ($method){
        case "preview":
            loadCSS("server_util_laporan");     		
    		$obj->setPage($page);    		
    		$obj->setShowFilter($showFilter);
    		$obj->setPerusahaan($perusahaan);    		
    		$result = $obj->getHtml($resultType);					    
        break;
        case "getTotalPage":
    		$result = $obj->getTotalPage();		
        break;  
        case "createPdf" :		
     		$obj->setPage($page);
    		$obj->setShowFilter($showFilter);
    		$obj->setPerusahaan($perusahaan);
    		$result = $obj->createPdf();		
        break;
        case "createXls":
            $obj->setPage($page);
    		$obj->setShowFilter($showFilter);
    		$obj->setPerusahaan($perusahaan);
    		$html = $obj->getHtml();		
    		$name = md5(date("r")) .".xls";
    		$save =  $serverDir ."/tmp/$name";
    		$f=fopen($save,'w');
    		fputs($f,$html);
    		fclose($f);    
    		$filename = split("_",$classObject);
    		$c = count($filename);
    		$file = $filename[($c-1)]; 
    		
    		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
    		header ("Cache-Control: no-cache, must-revalidate");
    		header ("Pragma: no-cache");
    		header ("Content-type: application/x-msexcel");
    		header ("Content-Disposition: attachment; filename=". $file .".xls");
    		header ("Content-Description: PHP/INTERBASE Generated Data" );
    		readfile($save);
    		unlink($save);
    		return;
        break;
        case "createCSV":
            $obj->setPage($page);    		
    		$obj->setShowFilter($showFilter);
    		$obj->setPerusahaan($perusahaan);
    		$result = $obj->createCSV();
        break;
        case "createTxt":            
    		$obj->setPage($page);
    		$obj->setShowFilter($showFilter);
    		$obj->setPerusahaan($perusahaan);
    		$result = $obj->createTxt();		
        break;
        case "previewWithHeader":
            try
        	  {
        		$result = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
                    <html xmlns='http://www.w3.org/1999/xhtml'>
                    <head>
                    <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1' />
                    <title>Preview</title>
                    </head>                    
                    <body align='center'>";
        		loadCSS("server_util_laporan");
        		$obj->setPage($page);          		
          		$obj->setShowFilter($showFilter);
          		$obj->setPerusahaan($perusahaan);
        		$html = $obj->getHtml();		          		           
                $result .= $html ."</body></html>";
        	  }catch(Exception $e)
        	  {
        	  	  error_log($e->getMessage());
        	  }
        break;
        
    }	  
    echo ($result);  
    ob_end_flush();
?>
