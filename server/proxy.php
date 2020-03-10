<?php
	try{
		session_start();
		ob_start();
		global $dirSeparator;
		global $serverDir;
		$serverDir = __FILE__;
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
	    {
	        $dirSeparator = "\\";
	        $separator = ";";
	    }
	    else
	    {
	        $dirSeparator = "/";
	        $separator = ":";
	    }
		$pos = strrpos($serverDir, $dirSeparator);
		$serverDir = substr($serverDir, 0, $pos);
		$pos = strrpos($serverDir, $dirSeparator);
		$rootDir = substr($serverDir, 0, $pos);
		$pos = strrpos($rootDir, $dirSeparator);
		$path = $rootDir;
		$rootDir = substr($rootDir,$pos);
		ini_set('display_errors', 'Off');
		ini_set ('track_errors', 'On');	 
		ini_set ('max_execution_time', '0');
		ini_set ('set_time_limit', '0');
		//ini_set ('memory_limit', '4024M');
		ini_set ('post_max_size	', '20M');
		ini_set ('log_errors',   'On');
		ini_set ('error_log',    $path.$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."proxy_error.log");	
		set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php");
		set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php".$dirSeparator."PEAR");
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server");	
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."PHPExcel".$dirSeparator."Shared");	
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."PHPExcel".$dirSeparator."Shared".$dirSeparator."OLE");	
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex");
	
		error_reporting (E_ALL & ~E_NOTICE &  ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_STRICT & ~E_WARNING);
		include_once("library.php");
		include_once("JSONRPCJWC.php");
		include_once("bpc.php");
		
		$jsonRPC = new JSONRPC();
		$jsonRPC->invoke(new bpc());
		ob_end_flush();
	}catch(Exception $e){
		error_log($e->getMessage());
	}
?>