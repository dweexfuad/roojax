<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");

class server_util_remoteScript  extends server_BasicObject
{
	protected $script;	
	function __construct($script)
	{
		parent::__construct();
		$this->runScript($script);
	}
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("script","string");
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	function runScript($script)
	{
		try{
			$this->script = $script;
			eval($script);
		}catch(Exception $e){
			return "error $e->getMessage()";
		}
	}
}
?>