<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
include "resize.php";
	function getPath($path)
	{	
			{
				$realPath = str_replace("_", "/", $path) . ".php";

				//@include_once($realPath);
				include_once($realPath);			 			
			}        
	}	
	function func_notice($num, $str, $file, $line) {
		$serverDir = __FILE__;
		$pos = strrpos($serverDir, $dirSeparator);
		$serverDir = substr($serverDir, 0, $pos);
		$pos = strrpos($serverDir, $dirSeparator);
		$rootDir = substr($serverDir, 0, $pos);
		$pos = strrpos($rootDir, $dirSeparator);
		$path = $rootDir;
        error_log("Encountered notice $num in $file, line $line: $str\n",3,$path . "/server/tmp/error.log");
    }

    function func_error($num, $str, $file, $line) {
		$serverDir = __FILE__;
		$pos = strrpos($serverDir, $dirSeparator);
		$serverDir = substr($serverDir, 0, $pos);
		$pos = strrpos($serverDir, $dirSeparator);
		$rootDir = substr($serverDir, 0, $pos);
		$pos = strrpos($rootDir, $dirSeparator);
		$path = $rootDir;
        error_log("Encountered error $num in $file, line $line: $str\n",3,$path . "/server/tmp/error.log");
    }

    set_error_handler("func_notice", E_NOTICE);
    set_error_handler("func_error", E_ERROR);
    
	function uses($path, $isClass = true)
    {        
		try {
			if (!(class_exists($path) || interface_exists($path)))
			{
				$realPath = str_replace("_", "/", $path) . ".php";				
				//@include_once($realPath);
				$ret = include_once($realPath);
				if ((!(class_exists($path) || interface_exists($path))) && ($isClass))
				{
					throw new Exception("Failed to load class $path => $realPath=>$ret " . class_exists($path) ." || " .interface_exists($path));
				}
			}
		}catch(Exception $e){
			error_log($e->getMessage());
		}
    }
	function loadCSS($path, $createFile = true)	
	{
		if (!$createFile)
		{
			$realPath = str_replace("_", "/", $path) . ".css";
			//<!--<link rel="stylesheet" type="text/css" href="classes/css/laporan.css" />
			//error_log("<link rel='stylesheet' type='text/css' href=". $realPath ." />");
			echo ("<link rel='stylesheet' type='text/css' href=". $realPath ." />");			 		
		}else 
		{
			$realPath = str_replace("_", "/", $path) . ".css";
			uses("server_util_File");
			$tmp = new server_util_File($realPath);
			if ($tmp->isFile())
			{
				$ctns = $tmp->getContents();
				echo ($ctns);
			}		
			//error_log($ctns);
		}
	}
	function writeln($data = "")
	{
        if ($data instanceof server_util_XMLAble)
            echo($data->toString() . "\r\n");
        else
            echo($data . "\r\n");
	}

	function write($data = "")
	{	
        if ($data instanceof server_util_XMLAble)
		{
            echo($data->toString());
        }else
		{	
            echo($data);
		}
	}
	
	function echoln($data)
	{
        if ($data instanceof server_util_XMLAble)
            echo($data->toString() . "\r\n");
        else
            echo($data . "\r\n");
	}
	function replaceBetween($opening, $closing, $subject, $replacement){
	    $openingPosition = strpos($subject, $opening);
	    if ($openingPosition === false) return false;
	    $openingPosition += strlen($opening);
	    
	    $closingPosition = strpos($subject, $closing, $openingPosition);
	    if ($closingPosition === false) return false;
	    
	    return substr($subject, 0, $openingPosition) . $replacement . substr($subject, $closingPosition);
	}

	//fungsi buat report
	function namaBulan($bln)
	{
     switch ($bln)
     {
         case 1 : return "Januari";break;
         case 2 : return "Februari";break;
         case 3 : return "Maret";break;
         case 4 : return "April";break;
         case 5 : return "Mei";break;
         case 6 : return "Juni";break;
         case 7 : return "Juli";break;
         case 8 : return "Agustus";break;
         case 9 : return "September";break;
         case 10 : return "Oktober";break;
         case 11 : return "November";break;
         case 12 : return "Desember";break;
     }
    }
	
	function numToString($angka)
	{
     switch ($angka)
     {
        case 1 : return "1 (satu)";break;
        case 2 : return "2 (dua)";break;
        case 3 : return "3 (tiga)";break;
        case 4 : return "4 (empat)";break;
        case 5 : return "5 (lima)";break;
        case 6 : return "6 (enam)";break;
        case 7 : return "7 (tujuh)";break;
        case 8 : return "8 (delapan)";break;
        case 9 : return "9 (sembilan)";break;
        case 10 : return "10 (sepuluh)";break;
        case 11 : return "11 (sebelas)";break;
        case 12 : return "12 (dua belas)";break;
     }
    }
	
	function endDay($m,$y)
	{
      $bln[1]=31;
      if ($y%4==0)
      {
         $bln[2]=29;
      }else
      {
         $bln[2]=28;
      }
      
      $bln[3]=31;
      $bln[4]=30;
      $bln[5]=31;
      $bln[6]=30;
      $bln[7]=31;
      $bln[8]=31;
      $bln[9]=30;
      $bln[10]=31;
      $bln[11]=30;
      $bln[12]=31;
      return $bln[$m];
    }
	
	function hitungHari($sd,$sm,$sy,$fd,$fm,$fy)    {
      $bln[1]=31;
      $bln[2]=28;
      $bln[3]=31;
      $bln[4]=30;
      $bln[5]=31;
      $bln[6]=30;
      $bln[7]=31;
      $bln[8]=31;
      $bln[9]=30;
      $bln[10]=31;
      $bln[11]=30;
      $bln[12]=31;
      
      if ($fy-$sy==0)
      {
         if ($fy%4==0)
         {
             $bln[2]=29;             
         }
         
         if ($fm-$sm==0)
         {
             return $fd-$sd+1;
         }elseif ($fm-$sm==1)
         {
             return ($bln[$sm]-$sd)+$fd+1;
         }elseif ($fm-$sm>1)
         {
             $tothari=0;
             for ( $i=$sm+1; $i<$fm; $i++)
             {
                $tothari=$tothari+$bln[$i];
             }
             return $tothari+($bln[$sm]-$sd)+$fd+1;
         }
      }elseif ($fy-$sy==1)
      {
         if ($fy%4==0)
         {
            $jumAwal=$bln[$sm]-$sd;
            $tothari=0;
            for ($i=$sm+1;$i<=12;$i++)
            {
                $tothari=$tothari+$bln[$i];
            }
            $bln[2]=29;
            for ($j=1;$j<$fm;$j++)
            {
                $tothari=$tothari+$bln[$j];
            }
            return $jumAwal+$tothari+$fd+1;
         }elseif ($sy%4==0)
         {
            $bln[2]=29;
            $jumAwal=$bln[$sm]-$sd;
            $tothari=0;
            for ($i=$sm+1;$i<=12;$i++)
            {
                $tothari=$tothari+$bln[$i];
            }
            for ($j=1;$j<$fm;$j++)
            {
                $tothari=$tothari+$bln[$j];
            }
            return $jumAwal+$tothari+$fd+1;
         }else
         {
            $jumAwal=$bln[$sm]-$sd;
            $tothari=0;
            for ($i=$sm+1;$i<=12;$i++)
            {
                $tothari=$tothari+$bln[$i];
            }
            for ($j=1;$j<$fm;$j++)
            {
                $tothari=$tothari+$bln[$j];
            }
            return $jumAwal+$tothari+$fd+1;
         }
      }elseif ($fy-$sy>1)
      {
         if ($sy%4==0)
         {
            $bln[2]=29;
         }else
         {
            $bln[2]=28;
         }
         $jumAwal=$bln[$sm]-$sd;
         $tothari=0;
         for ($i=$sm+1;$i<=12;$i++)
         {
             $tothari=$tothari+$bln[$i];
         }
         for ($l=$sy+1;$l<$fy;$l++)
         {
             if ($l%4==0)
             {
                $hari=366;
             }else
             { 
                $hari=365;
             }
             $tothari=$tothari+$hari+1;
         }
         if ($fy%4==0)
         {
            $bln[2]=29;
         }
         else
         {
            $bln[2]=28;
         }
         for ($k=1;$k<$fm;$kj++)
         {
             $tothari=$tothari+$bln[$k];
         }
         return $jumAwal+$tothari+$fd+1;
      }
    }
	
	/**
	 * Functions for TEA encryption/decryption
	 */
/*
function long2str($v, $w) {
		$len = count($v);
		$s = array();
		for ($i = 0; $i < $len; $i++)
		{
			$s[$i] = pack("V", $v[$i]);
		}
		if ($w) {
			return substr(join('', $s), 0, $v[$len - 1]);
		}	else {
			return join('', $s);
		}
}

function str2long($s, $w) {
		$v = unpack("V*", $s. str_repeat("\0", (4 - strlen($s) % 4) & 3));
		$v = array_values($v);
		if ($w) {
			$v[count($v)] = strlen($s);
		}
		return $v;
}

// encrypt
function encrypt($str, $key) {
		if ($str == "") {
			return "";
		}
		$v = str2long($str, true);
		$k = str2long($key, false);
		if (count($k) < 4) {
			for ($i = count($k); $i < 4; $i++) {
				$k[$i] = 0;
			}
		}
		$n = count($v) - 1;
		$z = $v[$n];
		$y = $v[0];
		$delta = 0x9E3779B9;
		$q = floor(6 + 52 / ($n + 1));
		$sum = 0;
		while (0 < $q--) {
			$sum = int32($sum + $delta);
			$e = $sum >> 2 & 3;
			for ($p = 0; $p < $n; $p++) {
				$y = $v[$p + 1];
				$mx = int32((($z >> 5 & 0x07ffffff) ^ $y << 2) + (($y >> 3 & 0x1fffffff) ^ $z << 4)) ^ int32(($sum ^ $y) + ($k[$p & 3 ^ $e] ^ $z));
				$z = $v[$p] = int32($v[$p] + $mx);
			}
			$y = $v[0];
			$mx = int32((($z >> 5 & 0x07ffffff) ^ $y << 2) + (($y >> 3 & 0x1fffffff) ^ $z << 4)) ^ int32(($sum ^ $y) + ($k[$p & 3 ^ $e] ^ $z));
			$z = $v[$n] = int32($v[$n] + $mx);
		}
		return lclUrlEncode(long2str($v, false));
}

// decrypt
function decrypt($str, $key) {
		$str = lclUrlDecode($str);
		if ($str == "") {
			return "";
		}
		$v = str2long($str, false);
		$k = str2long($key, false);
		if (count($k) < 4) {
			for ($i = count($k); $i < 4; $i++) {
				$k[$i] = 0;
			}
		}
		$n = count($v) - 1;
		$z = $v[$n];
		$y = $v[0];
		$delta = 0x9E3779B9;
		$q = floor(6 + 52 / ($n + 1));
		$sum = int32($q * $delta);
		while ($sum != 0) {
			$e = $sum >> 2 & 3;
			for ($p = $n; $p > 0; $p--) {
				$z = $v[$p - 1];
				$mx = int32((($z >> 5 & 0x07ffffff) ^ $y << 2) + (($y >> 3 & 0x1fffffff) ^ $z << 4)) ^ int32(($sum ^ $y) + ($k[$p & 3 ^ $e] ^ $z));
				$y = $v[$p] = int32($v[$p] - $mx);
			}
			$z = $v[$n];
			$mx = int32((($z >> 5 & 0x07ffffff) ^ $y << 2) + (($y >> 3 & 0x1fffffff) ^ $z << 4)) ^ int32(($sum ^ $y) + ($k[$p & 3 ^ $e] ^ $z));
			$y = $v[0] = int32($v[0] - $mx);
			$sum = int32($sum - $delta);
		}
		return long2str($v, true);
}

function int32($n) {
		while ($n >= 2147483648) $n -= 4294967296;
		while ($n <= -2147483649) $n += 4294967296;
		return (int)$n;
}

function lclUrlEncode($string) {
		$data = base64_encode($string);
		return str_replace(array('+','/','='), array('-','_','.'), $data);
}

function lclUrlDecode($string) {
		$data = str_replace(array('-','_','.'), array('+','/','='), $string);
		return base64_decode($data);
}
*/
function crypted($Str_Message) { 
//Function : 
//Author   : Aitor Solozabal Merino (spain) 
//Email    : aitor-3@euskalnet.net 
//Date     : 01-04-2005 
    $Len_Str_Message=STRLEN($Str_Message); 
    $Str_Encrypted_Message=""; 
    for ($Position = 0;$Position<$Len_Str_Message;$Position++){ 
        // long code of the function to explain the algoritm 
        //this function can be tailored by the programmer modifyng the formula 
        //to calculate the key to use for every character in the string. 
        $Key_To_Use = (($Len_Str_Message+$Position)+1); // (+5 or *3 or ^2) 
        //after that we need a module division because can´t be greater than 255 
        $Key_To_Use = (255+$Key_To_Use) % 255; 
        $Byte_To_Be_Encrypted = SUBSTR($Str_Message, $Position, 1); 
        $Ascii_Num_Byte_To_Encrypt = ORD($Byte_To_Be_Encrypted); 
        $Xored_Byte = $Ascii_Num_Byte_To_Encrypt ^ $Key_To_Use;  //xor operation 
        $Encrypted_Byte = CHR($Xored_Byte); 
        $Str_Encrypted_Message .= $Encrypted_Byte; 
        
        //short code of  the function once explained 
        //$str_encrypted_message .= chr((ord(substr($str_message, $position, 1))) ^ ((255+(($len_str_message+$position)+1)) % 255)); 
    } 
    return $Str_Encrypted_Message; 
}
function db_Connect($setting = null) { 
	include_once( "server/server/ADODB/adodb5/adodb.inc.php");	
	include_once( "server/server/ADODB/adodb5/adodb-xmlschema.inc.php" ); # or adodb-xmlschema03.inc.php
	require_once("lib/Doc.php");			
	include_once("server/server/conf/dbSetting.php");			
	global $dbhost;
	global $dbuser;
	global $dbpass;
	global $database;
	global $dbdriver;		
	if (!($setting == null || $setting == "undefined")){			
		uses("server_util_Map");
		$config = new server_util_Map();		
		$file = new server_util_File("server/server/conf/" . $setting . ".conf");
		//error_log("loadfile ".$serverDir . $dirSeparator . "server/conf" . $dirSeparator . $configName . ".conf");
		if ($file->isExist() && $file->isFile())
		{
            $setting = $file->getContents();
            $setting = str_replace("\r","",$setting);            
            $settingList = explode("\n", $setting);
            
            foreach ($settingList as $lineNo => $line)
            {
                $pos = strpos($line, "=");
                
                if ((substr($line, 0, 1) != "#") && ($pos > 0))
                {
                    $config->set(substr($line, 0, $pos), substr($line, $pos + 1));
                }
            }
            $dbuser = $config->get("user"); 	
			$dbhost = $config->get("host"); 	
			$dbpass = $config->get("pass"); 
			$database = $config->get("database"); 
			$dbdriver = $config->get("driver"); 	
		}			
	}
	define("CONN_DB",$database);
	define("CONN_DBDRIVER",$dbdriver);
	define("CONN_HOST",$dbhost);
	$adoc = ADONewConnection($dbdriver);	
	if ($dbdriver == "ado_mssql"|| $dbdriver == "odbc_mssql")
	{
	  $connected = $adoc->Connect($dbhost, $dbuser, $dbpass);
	  $adoc->hasTop = "TOP";			  
	}else if ($dbdriver == "oci8"){
		$adoc->connectSID = true;
		$adoc->NLS_DATE_FORMAT = 'YYYY-MM-DD';				
		$connected = $adoc->Connect($dbhost, $dbuser, $dbpass, $database);				
	}else 			
		$connected = $adoc->PConnect($dbhost, $dbuser, $dbpass, $database); 				  		
	if (!$connected){
		error_log($adoc->ErrorMsg());
		return "Error ::" . $adoc->ErrorMsg(). "\r\n";
	}
	return $adoc;
}

function db_Connect2() { 
	include_once( "server/ADODB/adodb5/adodb.inc.php");
	include_once( "server/ADODB/adodb5/adodb-xmlschema.inc.php" ); # or adodb-xmlschema03.inc.php
	include_once("server/conf/dbSetting.php");		
	global $dbhost;
	global $dbuser;
	global $dbpass;
	global $database;
	global $dbdriver;
	define("CONN_DB",$database);
	define("CONN_DBDRIVER",$dbdriver);
	define("CONN_HOST",$dbhost);
	
	$adoc = ADONewConnection($dbdriver);
	if ($driver == "ado_mssql")
	{
	  $connected = $adoc->Connect($host, $user, $pass);
	  $adoc->hasTop = "TOP";			  
	}else 			
	  $connected = $adoc->PConnect($dbhost, $dbuser, $dbpass, $database); 				  		
	if (!$connected){
		error_log($adoc->ErrorMsg());
		return "Error ::" . $adoc->ErrorMsg(). "\r\n";
	}
	return $adoc;
}
function execute2($sql) { 	
	$schema = db_Connect2();
	if (gettype($schema) == "string" && strpos($schema,"Error") != -1){   
	   return $schema;
	}
	$resultSet = $schema->execute($sql);	
	if (!$resultSet){
		error_log($schema->ErrorMsg());
		error_log($sql);
		return "error::" . $schema->ErrorMsg();
	}else return $resultSet;
}
function execute($sql) { 	
	$schema = db_Connect();
	if (gettype($schema) == "string" && strpos($schema,"Error") != -1){   
	   return $schema;
	}
	$resultSet = $schema->execute($sql);	
	if (!$resultSet){
		error_log($schema->ErrorMsg());
		error_log($sql);
		return "error::" . $schema->ErrorMsg();
	}else return $resultSet;
}
function createXML(&$xmlDoc,$name, $data){
	$newNode = new xml_Node();
	$newNode->name = $name;
	$newNode->type = "tag";
	$newNode->attributes = $data;		
	$newNode->xmlStr = "";
	foreach ($data As $key => $value) //access root /node		
		$newNode->xmlStr .= "<$key>$value</$key>";				
	if (!isset($xmlDoc->rootNode)){		
		$xmlDoc->rootNode = new xml_Node();
		$xmlDoc->rootNode->name = "root";
		$xmlDoc->rootNode->type = "tag";
		$xmlDoc->rootNode->attributes = array();		
		$xmlDoc->rootNode->xmlStr = "";
		$xmlDoc->rootNode->childNodes = array();
		$newNode->parent = $xmlDoc->rootNode;				
		$xmlDoc->nowNode = $newNode;						
		$xmlDoc->rootNode->childNodes[count($xmlDoc->rootNode->childNodes)] = $newNode; 				
	}else if ($xmlDoc->nowNode->attributes["level_menu"] == ($data["level_menu"] - 1)){		
		$newNode->parent = $xmlDoc->nowNode;		
		$xmlDoc->nowNode->childNodes[count($xmlDoc->nowNode->childNodes)] = $newNode; 				
	}else if ($xmlDoc->nowNode->attributes["level_menu"] == $data["level_menu"]){			
		$newNode->parent = $xmlDoc->nowNode->parent;		
		$xmlDoc->nowNode->parent->childNodes[count($xmlDoc->nowNode->parent->childNodes)] = $newNode; 
	}else if ($xmlDoc->nowNode->attributes["level_menu"] > $data["level_menu"]){
		$node = $xmlDoc->nowNode->parent;
		while ($node->attributes["level_menu"] > $data["level_menu"]){
			$node = $node->parent;
		}
		$newNode->parent = $node->parent;		
		$newNode->parent->childNodes[count($newNode->parent->childNodes)] = $newNode; 
	}	
	$xmlDoc->nowNode = $newNode;
}
function xmlText($node) { 	
	$xmlStr = "";
	if ($node != null){
		$xmlStr .= "<" . $node->name .">";
			$xmlStr .= $node->xmlStr;
			$xmlStr .= "<childs>";
			if (count($node->childNodes) > 0){
				for($i=0; $i < count($node->childNodes);$i++){
					$value=$node->childNodes[$i];
					$xmlStr .= xmlText($value);
				}
			}else $xmlStr .= "-";
			$xmlStr .= "</childs>";
		$xmlStr .= "</" . $node->name .">";
	}
	$xmlStr =  str_replace("&","dan",$xmlStr);
	return $xmlStr;
}
function runQuery($sql, $setting) { 	
	$schema = db_Connect($setting);
	if (gettype($schema) == "string" && strpos($schema,"Error") != -1){   
	   return $schema;
	}
	$resultSet = $schema->execute($sql);
	if(!$resultSet){
		error_log($schema->ErrorMsg());
		error_log($sql);
		return "error::" . $schema->ErrorMsg();
	}
	$first = true;
	$headerString = "";
	$result = "";
	$isMenu = strpos($sql, "menu") > strpos($sql,"from");	
	if ($isMenu) {
		$xml = new xml_Doc();				
	}
	$row = 0;
	while (!$resultSet->EOF)
	{		
		if ($first)
		{
			for ($i = 0; $i < $resultSet->FieldCount(); $i++)
			{
				$name = $resultSet->FetchField($i)->name;					
				$headerString .= ";" . $name;
			}					
			$first = false;
			$headerString = substr($headerString,1) . "\r\n";
		}else{
			//if ($isMenu) $xml .= ",";
		}
		$values = "";
		if ($isMenu) $xmlItem = array();
		for ($i = 0; $i < $resultSet->FieldCount(); $i++)
		{
			$value =  $resultSet->fields[$i];
			$values .= ";" . $value;
			$name = $resultSet->FetchField($i)->name;
			if ($isMenu) $xmlItem[$name] = $value;
		}		
		if ($values != "")
			$result .= substr($values,1) . "\r\n";
		$resultSet->MoveNext();
		if ($isMenu){			
			createXML($xml, "row$row",$xmlItem);			
		}
		
		$row++;
	}				
	if ($result != "")
		$result = substr($result,0,strlen($result)-2);	
	$result = $headerString . $result;
	$resultSet->close();
	if ($isMenu) {		
		$xmlStr = xmlText($xml->rootNode);	
		return $xmlStr;
	}else return $result;
}
function loadClass($className, $param, $encrypt = false, $param2 = "", &$loaded) { 
	if (strpos($className,"_") === false){
		$fileName = $className;		
	}else 
		$fileName = "classes/" . str_replace("_", "/", $className) . ".js";			
	if (array_search($fileName,$loaded) == false){
		//error_log("include::".$fileName);
		$loaded[] = $fileName;		
	}else {	
		return;
	}
	$file = new server_util_File($fileName);    		
	if ($file->isFile())
	{				
		if (!$encrypt)
			$cont = file_get_contents($file->getFileName());									
		else $cont = crypted(file_get_contents($file->getFileName()));											
		$funcClass = substr($cont, strpos($cont,"window." . $className ." = function("),strpos($cont,"window." . $className .".extend(") - strpos($cont,"window." . $className ." = function("));												
		$idx = strpos($funcClass,"uses(");		
		if ($idx !== false) {			
			$contAft = substr($cont,strpos($cont,"window." . $className .".extend("));			
			$contTmp = "";
			$lines = explode("\r\n",$funcClass);
			if (count($lines) == 1)
				$lines = explode("\n",$funcClass);							
			foreach ($lines as $key => $value){
				$idx = strpos($value,"uses(");				
				if (strpos($value,"//uses") === false &&  $idx !== false) {
					if ($param2 == "include"){
						$usesCont = substr($value,$idx + 6,strpos($value,');') - ($idx + 7));															
						$common = explode(";",$usesCont);
						foreach ($common as $key2 => $fileName)
						{		
							loadClass($fileName, $param, $encrypt, $param2, $loaded);							
						}						
					}
				}					
				if (strpos($value,"this.initParam(") === false){										
					if (strpos($value,"this.loadCfgFile(") === false)					
						$contTmp .= $value . "\r\n";																							
				}else {	
					if (strpos($value,"strParam") === false){
						
					}else{
						$param = str_replace("\\","",$param);						
						$res = runQuery($param);						
						$res = str_replace("\r\n","<br>",$res);																												
						$value = str_replace("this.initParam(\"strParam\");","this.initParam('" . $res ."');",$value);												
						$contTmp .= $value . "\r\n";						
					}
				}										
			}
			if ($contTmp != ""){				
				write($contTmp);								
			}else write($functClass);
			write($contAft);
		}else{
			write($cont);
		}									
		echo "\r\n";
	}
}
function parseXML($node){		
	$script = "";
	if ($node instanceof server_xml_Node){
		if ($node->name == "application"){
			$script .= "window.app_" . $node->attributes["id"]. "_app = new portalui_application(system);\r\n";
		}else{					
			if ($node->name == "portalui_sysForm" || $node->name == "portalui_form" || $node->name == "portalui_childForm"){
				$script .= "window.app_" . $node->parent->attributes["id"] ."_".$node->attributes["id"] ." = function(owner){\r\n".
						 "window.app_" . $node->parent->attributes["id"] ."_".$node->attributes["id"] .".prototype.parent.constructor.call(this,owner);\r\n";								
						
				foreach($node->attributes as $key=>$value){
					if ($key == "id") 
						$script .= "this.setName('".$value."');\r\n";
					else
						$script .= "this.set".ucfirst($key) ."(".$value.");\r\n";
				}			
			}else{	
				if ($node->name != " "){
					$options = "{bound:[".$node->attributes["left"] .",".$node->attributes["top"].",".$node->attributes["width"].",".$node->attributes["height"]."]";								
					foreach($node->attributes as $key=>$value){
						if ($key != "width" && $key != "height" && $key != "left" && $key != "top"){							
							$options .=",". $key .":". ( is_numeric($value) || $value == "true" || $value == "false" ? $value : "'" . $value."'");
						}
					}
					$options .= "}";
					$script .= "uses('$node->name');";
					if ($node->parent->name == "portalui_sysForm" || $node->parent->name == "portalui_form" || $node->parent->name == "portalui_childForm")
						$script .= "this.".$node->attributes["id"]." = new ".$node->name."(this,$options);\r\n";
					else $script .= "this.".$node->attributes["id"]." = new ".$node->name."(this." . $node->parent->attributes["id"]. ",$options);\r\n";
				}				
			}
		}
		foreach ($node->childNodes as $key =>$value){		
			$script .= parseXML($value);
		}	
		if ($node->name == "portalui_sysForm" || $node->name == "portalui_form" || $node->name == "portalui_childForm" )
			$script .= "};\r\n".
					"window.app_" . $node->parent->attributes["id"] ."_".$node->attributes["id"] .".extend(".$node->name.");\r\n";
	}		
	return $script;
}
function formatBytes($bytes, $precision = 2) { 
    $units = array('B', 'KB', 'MB', 'GB', 'TB'); 
   
    $bytes = max($bytes, 0); 
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
    $pow = min($pow, count($units) - 1); 
   
    $bytes /= pow(1024, $pow); 
   
    return round($bytes, $precision) . ' ' . $units[$pow]; 
} 
function convertJuiToJs($filename){
	$cont = "";	
	if (file_exists($filename)){
		uses("server_xml_Doc");		
		uses("server_xml_Node");		
		$cont = file_get_contents($filename);
		$cont = str_replace("\r\n","",$cont);
		$xml = new server_xml_Doc();
		$node = $xml->parse($cont);		
		if ($node instanceof server_xml_Node){			
			$cont = parseXML($node);
		}		
	}	
	error_log($cont);
	echo $cont;
}
function resizeImg($image, $newPath){	
	$resize_image = new Resize_Image;
	$info = GetImageSize($image);
	if(empty($info))
	{
	  exit("The file ".$resize_image->image_to_resize." doesn't seem to be an image.");
	}

	$width = $info[0];
	$height = $info[1];
	$mime = $info['mime'];
		
	if(!@file_exists($image))
	{
		exit('The requested image does not exist.');
	}

	// Get the new with & height
	$new_width = $width;
	$new_height = $height;
	if ($width > 600 )
		$new_width = 600;
	if ($height > 600 )
		$new_height = 400;

	$resize_image->new_width = $new_width;
	$resize_image->new_height = $new_height;

	$resize_image->image_to_resize = $image; // Full Path to the file
	$resize_image->save_folder = $newPath;
	$resize_image->ratio = true; // Keep aspect ratio

	$process = $resize_image->resize(); // Output image
}
?>
