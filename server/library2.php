<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
  function getPath($path)
  {	
		{
			$realPath = str_replace("_", "/", $path) . ".php";

			//@include_once($realPath);
			include_once($realPath);			 			
		}        
  }
	function uses($path, $isClass = true)
    {        
		if (!(class_exists($path) || interface_exists($path)))
		{
			$realPath = str_replace("_", "/", $path) . ".php";

			//@include_once($realPath);
			include_once($realPath);
			 
			if ((!(class_exists($path) || interface_exists($path))) && ($isClass))
			{
				error_log("Failed to load class $path");
			}
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
            echo($data->toString() . NEW_LINE);
        else
            echo($data . NEW_LINE);
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

?>