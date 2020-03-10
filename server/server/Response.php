<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_XMLAble");
uses("server_util_EventHandler");

uses("server_util_arrayList");

class server_Response extends server_util_XMLAble
{
    protected $encryption;
	protected $code;
	protected $value;
	
	public $onEncrypt;
	public $onDecrypt;
	
	function __construct()
	{
		parent::__construct();
		
		$this->encryption = 0;
		
		$this->onEncrypt = new server_util_EventHandler();
        $this->onDecrypt = new server_util_EventHandler();
	}

    protected function doSerialize()
	{
		parent::doSerialize();
		
		$this->serialize("encryption",    "integer");
		$this->serialize("code",          "integer");
		$this->serialize("value",         "server_util_XMLAble");
	}
	
	public function clear()
	{
		$this->code = 0;
		$this->value = null;
	}
	
	//--------------------------------------------------------------------------
	
	public function getEncryption()
	{
	    return $this->encryption;
	}
	
	public function setEncryption($data)
	{
	    $this->encryption = $data;
	}
	
	public function getCode()
	{
	    return $this->code;
	}
	
	public function setCode($data)
	{
	    $this->code = $data;
	}
		
	public function getValue()
	{
	    return $this->value;
	}
	
	public function setValue($data)
	{
	    $this->value = $data;
	}
}

?>