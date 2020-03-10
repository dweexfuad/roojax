<?php

class clRequest
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
		$_REQUEST[$paramName] = $value;
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
$httpRequest = new clRequest();

?>