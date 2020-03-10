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
class server_util_keyManager extends server_BasicObject
{	
	protected $key;
	function __construct()
	{
		parent::__construct();		
	}	
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("key", "string");                		
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
	function setKey($data)
	{
		$this->key = $data;	
		return $this->key;
	}
	function getKey($data)
	{
		$this->key = md5($data);	
		return $this->key;
	}
	function setContent($data){
		$content = "[";
		foreach($data->getArray() as $key => $value){
			if ($key > 0) $content .= ",";
			$content .= " " . $value ."" ;
		}
		$content .= "]";
		file_put_contents("conf/".$this->key,crypted($content));
		return "save to file";
	}
	function getContent(){		
		if (file_exists("conf/".$this->key))
			$content = crypted(file_get_contents("conf/".$this->key));
		else $content = "[]";
		return $content;
	}
}