<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
class server_httpRequest
{
	function __construct()
	{
	}
	
	function getParameter($paramName)
	{
		$value = @$_POST[$paramName];
		if ($value == "")
		{
			$value = @$_REQUEST[$paramName];
		}
		return $value;
	}
	
	function setParameter($paramName, $value)
	{
		$_POST[$paramName] = $value;
	}		
	
	function getParameterNames()
	{
		$result = array();
		$index = 0;
		
		foreach ($_POST as $key => $value)
		{
			$result[$index] = $key;
			$index++;
		}
		
		foreach ($_REQUEST as $key => $value)
		{
			$result[$index] = $key;
			$index++;
		}
		
		return $result;
	}						  
	
	function getParameters()
	{
		$result = array();
		
		foreach ($_REQUEST as $key => $value)
		{
			$result[$key] = $value;
		}
		
		foreach ($_POST as $key => $value)
		{
			$result[$key] = $value;
		}
		
		return $result;
	}
}

global $httpRequest;
$httpRequest = new server_httpRequest();

?>