<?php	
	if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
		ob_start("ob_gzhandler"); 
		header("Content-Encoding: gzip");
	}else ob_start();
	
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
$path = $serverDir;

//----------------------------------
//-------------- error_log8

	ini_set('display_errors', 'Off');
	ini_set ('track_errors', 'On');	 
	ini_set ('max_execution_time', '3000');	 
	ini_set ('memory_limit', '1024M');
	ini_set ('log_errors',   'On');
	ini_set ('error_log',    $path .'/server/tmp/php_error.log');	
	//ini_set ('zlib.output_compression', 0);	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/OLE");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/PHPExcel/Shared");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path ."/server/PHPExcel/Shared/OLE");	
	error_reporting (E_ALL & ~E_NOTICE );
//-------------------------	
	include_once("lib/request.php");
	include_once("lib/file.php");
	include_once("server/library.php");			
	global $httpRequest;	
	uses("server_util_File");	
	if ($httpRequest->getParameter("mode") != "loadCss"){
		/*
		$zlibOn = ini_get('zlib.output_compression') || (ini_set('zlib.output_compression', 0) === false);
		$encodings = (isset($_SERVER['HTTP_ACCEPT_ENCODING'])) ? strtolower($_SERVER['HTTP_ACCEPT_ENCODING']) : "";
		$encoding = preg_match( '/\b(x-gzip|gzip)\b/', $encodings, $match) ? $match[1] : "";
	
		if (isset($_SERVER['---------------']))
			$encoding = "x-gzip";

		$supportsGzip = !empty($encoding) && !$zlibOn && function_exists('gzencode');
		*/
		$supportsGzip = false;
	}		
	//error_log($_SERVER["HTTP_ACCEPT_ENCODING"]);
    header("Content-Type: text/javascript");	
    if ($httpRequest->getParameter("mode") != "loadCss")
		header("Vary: Accept-Encoding");  // Handle proxies	    
	//header("Content-Encoding: deflate, gzip");		    
    header("Last-Modified: " . gmdate('D, d M Y H:i:s', time()) . ' GMT');
	header("Expires: " . gmdate("D, d M Y H:i:s", time()) . " GMT"); // expire in 3 year  + 31536003
    header("Cache-Control: public");   	
    if ($supportsGzip && $httpRequest->getParameter("mode") != "loadCss")
		header("Content-Encoding: " . $encoding);
    
		
	$loaded = array();
	$crypted = false;
    if ($httpRequest->getParameter("mode") == "loadJS")
    {        		
		$fileName = $httpRequest->getParameter("className");
		$file = explode(";",$fileName);		
		$buffer = "";
		foreach ($file as $key =>$fileName){
			$fileName = "js/classes/". $fileName;						
			if (file_exists($fileName))
			{						
				$cont = file_get_contents($fileName);
				if ($supportsGzip){
					$buffer .= $cont ."\r\n";
				}else echo $cont . "";
			}
		}
        if ($supportsGzip){
			$buffer = gzencode($buffer, 9, FORCE_GZIP);
			echo $buffer;
			$buffer = "";
		}
    }
	
	if ($httpRequest->getParameter("mode") == "loadClass")
    {        		
		$className = $httpRequest->getParameter("className");
		$param = $httpRequest->getParameter("param");		
		$param2 = $httpRequest->getParameter("param2");					
        if (file_exists("js/classes/" . str_replace("_", "/", $className) . ".jui")){			
			convertJuiToJs("js/classes/" . str_replace("_", "/", $className) . ".jui");						
		}
		$fileName = "js/classes/" . str_replace("_", "/", $className) . ".js";			
		if (file_exists($fileName)){    		
    		$cont = file_get_contents($fileName);		
    		if ($supportsGzip){
				$buffer = gzencode($cont, 9, FORCE_GZIP);
				echo $buffer;
				$buffer = "";
			}else echo $cont;
		}    		
		
    }
    else if ($httpRequest->getParameter("mode") == "loadPackage")
    {
		header("Content-Type: text/javascript");
        $packageName = $httpRequest->getParameter("packageName");		
        $folderName = "js/classes/" . str_replace("_", "/", $packageName);		
        $folder = new server_util_File($folderName);
    
        if ($folder->isDir())
        {
            $fileList = $folder->listDir();
        		
            foreach ($fileList->getArray() as $key => $file)
            {				
                if ($file->getExtention() == ".js")
                {					
                    readfile($file->getFileName());
                    echo "\r\n";
                }
            }
        }
	}else if ($httpRequest->getParameter("mode") == "loadCommon")		
    {				
		$param2 = $httpRequest->getParameter("param2");		
		$common = array("control_arrayList","control_arrayMap","server_util_arrayList","control_buttonState","control_component",
					"control_control","control_containerControl",
					"control_containerComponent","control_application","control_commonForm","control_hintFrame",
					"control_font","control_form","control_timer","control_page","control_childForm","control_msgBoard");															
		foreach ($common as $key => $fileName)
        {										
			loadClass($fileName, null, $crypted, $param2, $loaded);			
		}
    }else if ($httpRequest->getParameter("mode") == "loadMultiClass")		
    {		
		$className = $httpRequest->getParameter("className");
		$param = $httpRequest->getParameter("param");		
		$param2 = $httpRequest->getParameter("param2");		
		$common = explode(";",$className);
		$buffer = "";
		foreach ($common as $key => $fileName)
		{									
			//loadClass($fileName, null, $crypted, $param2, $loaded);									
			if (file_exists("js/classes/" . str_replace("_", "/", $fileName) . ".jui")){
				convertJuiToJs("js/classes/" . str_replace("_", "/", $fileName) . ".jui");						
			}			
			$fileName = "js/classes/" . str_replace("_", "/", $fileName) . ".js";			
			if (file_exists($fileName)){
    			$cont = file_get_contents($fileName);		
    			if ($supportsGzip){
					$buffer .= $cont ."\r\n";
				}else echo $cont;
			}
		}
		if ($supportsGzip){
			$buffer = gzencode($buffer, 9, FORCE_GZIP);
			echo $buffer;
			$buffer = "";
		}
		
    }else if ($httpRequest->getParameter("mode") == "loadCss")
	{		
		header("Content-Type: text/css");
		header("Content-Type: text/javascript");		
		$className = $httpRequest->getParameter("filename");
        $fileName = "server/" . str_replace("_", "/", $className) . ".css";		
		//return $fileName;
		
		$file = new server_util_File($fileName);    
		if ($file->isFile())
		        {		
		            readfile($file->getFileName());			
		            echo "\r\n";
		        }
	}else if ($httpRequest->getParameter("mode") == "query" && $httpRequest->getParameter("sqlText") !== null)	
	{
		$sql = $httpRequest->getParameter("sqlText");
		$sql = str_replace("\\'", "'", $sql);
		$res = execute($sql);
		if (!is_string($res)){
			$result = "<data>";
			while (!$res->EOF){
				$values = "<item ";
				for ($i = 0; $i < $res->FieldCount(); $i++)
				{
					$value =  $res->fields[$i];					
					$name = $res->FetchField($i)->name;
					$values .= " $name=\"$value\" ";
				}
				$values .= "/>";				
				$result .= $values;
				$res->MoveNext();
			}
			$result .= "</data>";												
			echo $result;			
		}else writeln($res);
		
	}else if ($httpRequest->getParameter("mode") == "query" && $httpRequest->getParameter("json") !== null)	
	{
		$sql = $httpRequest->getParameter("json");
		$sql = str_replace("\\'", "'", $sql);
		$res = execute($sql);
		if (!is_string($res)){
			$result = "{rows:[";
			$first = true;
			while (!$res->EOF){
				$values = "{";
				$first2 = true;
				for ($i = 0; $i < $res->FieldCount(); $i++)
				{
					$value =  $res->fields[$i];					
					$name = $res->FetchField($i)->name;
					if (!$first2) $values .= ",";
					$values .= " $name:\"$value\" ";
					$first2 = false;
				}
				$values .= "}";
                if (!$first) $result .= ",";
				$result .= $values;
				$res->MoveNext();
				$first = false;
			}
			$result .= "]}";
			echo $result;			
		}else writeln($res);
		
	}else if ($httpRequest->getParameter("mode") == "query")
	{
		$sql = $httpRequest->getParameter("sql");
		$setting = $httpRequest->getParameter("setting");		
		$sql = str_replace("\\'", "'", $sql);
		$sql = explode("\r\n",$sql);		
		$arr = array();
		foreach($sql as $key => $value){						
			if ($key > 0){
				if (strpos($value,"table")){	
					for ($i=0; $i < $key;$i++){
						$res = $arr[$i];
						$res = explode("<br>",$res);					
						$fields = explode(";",$res[0]);	
						$fieldVal = explode(";",$res[1]);	
						foreach($fields as $key2 => $field){														
							if (strpos($value,"table". ($i + 1)."_" . $field)){
								$value = str_replace("table". ($i + 1)."_" . $field, $fieldVal[$key2],$value); 
							}	
						}													
					}
				}
			}	
			if (strpos($value,"select") === false){				
				if (EW_CONN_DBDRIVER == "mysqlt"){
				//	execute("call " . $value);
				}else{
				//	execute("exec " . str_replave(array("(",")")," ",$value));
				}
			}else {
				$res = runQuery($value,$setting);											
				$res = str_replace("\r\n","<br>",$res);
				$arr[$key] = $res;							
			}
		}
		
		$ret = "";
		foreach ($arr as $key => $value){
			if ($key > 0) $ret .= "\r\n";
			$ret .= $value; 
		}
		$ret .= "";						
		if ($arr[0] != ""){		
			$session = md5(date("r"));
			$ret .= "\r\n";		
			$ret .= "SERVERVAR\r\n";		
			$result = "";		
			$ip = $_SERVER["REMOTE_ADDR"];
			
			$result .= $ip ."<br>";	//"REMOTE_ADDR=". 
			$result .= GetHostByName($ip)."<br>";//"REMOTE_HOST=". 
			$result .= CONN_DB . "-" . CONN_DBDRIVER."<br>";	//"DBNAME=". 
			$result .= CONN_HOST."<br>";	//"DBHOST=". 
			$result .= CONN_DBDRIVER."<br>";	//"DBDRIVER=". 
			$result .= $session ."<br>";//"SESSION=". 
			$result .= $_SERVER["REQUEST_URI"] ."<br>";
			$result .= $_SERVER["HTTP_HOST"] ."<br>";
			$ret .= $result;					
			$res = $arr[0];
			$userData = explode("<br>",$res);
			$uid = explode(";", $userData[1]);			
			
			if (CONN_DBDRIVER == "mysqlt")
				$valueSQL = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid[1] ."', '". $uid[5]."', now(), '". $session."','1900-01-01','". GetHostByName($ip)."','". $ip."' )";
			else if (CONN_DBDRIVER == "oci8")
				$valueSQL = "insert into userlog(\"UID\", userloc, \"TIMEIN\", \"SESSION\", \"TIMEOUT\", host, ip)values('" . $uid[1] ."', '". $uid[5]."', sysdate, '". $session."',sysdate,'". gethostbyname($ip)."','". $ip."' )";			
			else $valueSQL = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid[1] ."', '". $uid[5]."', getdate(), '". $session."','1900-01-01','". GetHostByName($ip)."','". $ip."' )";			
			execute($valueSQL);								
		}
		writeln($ret);		
	}else if ($httpRequest->getParameter("mode") == "visitor")
	{
	    $res = execute("select date_format(timein,'%Y-%m-%d') as timein,date_format(timein,'%Y-%m') as timemonth, WEEKOFYEAR(timein) as week from portal_log where userloc = '" . $httpRequest->getParameter("lokasi")."'");
		if (!is_string($res)){
		    $count = 0;
            $today = 0;
            $week = 0;
            $month = 0;  
    		while ($row = $res->FetchNextObject(false)){    			
    		  if ($row->timein == date("Y-m-d")) $today++;
    		  if ($row->timemonth == date("Y-m")) $month++;
    		  if ($row->week == date("W")) $week++;
    		  $count++;
    		}    	            
		}
		$res = execute("select count(*) as total from userlog where userloc = '" . $httpRequest->getParameter("lokasi")."' and date_format(timein,'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') and date_format(timeout,'%Y-%m-%d') = '1900-01-01' ");
		$online = 0;
		if (!is_string($res)){
    		while ($row = $res->FetchNextObject(false)){    			
    		  $online = $row->total;
    		}    	            
		}
		$result = "{total:$count,today:$today,month:$monthly,week:$week,online:$online}";	
		echo $result;			
	}
	ob_end_flush();
?>
