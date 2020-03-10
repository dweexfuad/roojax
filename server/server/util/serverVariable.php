<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_arrayList");
uses("server_BasicObject");

class server_util_serverVariable extends server_BasicObject
{
	function __construct()
	{
		parent::__construct();		
	}	
	protected function doSerialize()
	{
		parent::doSerialize();
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	//------------------------------- Setter & Getter --------------------------------
	
	function getAllVariable()
	{			
		$result = new server_util_Map();
		foreach($_SERVER as $c => $value){			
			$result->set($c,$value);
		}
		foreach($_ENV as $c => $value){			
			$result->set($c,$value);
		}		
		$ip == $_SERVER["REMOTE_ADDR"];
		$result->set("REMOTE_HOST",GetHostByName($ip));
		return $result;
	}
	
}

?>
