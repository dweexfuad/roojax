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

class server_Request extends server_util_XMLAble
{
	protected $objectId;
	protected $sessionId;
	protected $methodName;
	protected $encryption;
	public $params;
	public $dbSetting;
	public $userlog;
	public $onEncrypt;
	public $onDecrypt;
	
	public function __construct()
	{
		parent::__construct();
		
		$this->params = new server_util_arrayList();
		$this->encryption = 0;
		
		$this->onEncrypt = new server_util_EventHandler();
        $this->onDecrypt = new server_util_EventHandler();
	}
	
	protected function doSerialize()
	{
		parent::doSerialize();
		
		if ($this->encryption != 0)
		{
            $oldobjectId = $this->objectId;
            $oldmethodName = $this->methodName;
            $oldparams = $this->params;
            
            // ToDo : Do Encript here 
		}
		
		$this->serialize("objectId",  "string");
		$this->serialize("sessionId", "string");
		$this->serialize("methodName","string");
		$this->serialize("encryption","integer");
		$this->serialize("dbSetting", "string");
		$this->serialize("userlog",   "string");
		$this->serialize("params",    "server_util_arrayList");
		
		if ($this->encryption != 0)
		{
            $this->objectId = $oldobjectId;
            $this->methodName = $oldmethodName;
            $this->params = $oldparams;
		}
	}
	
	public function clear()
	{
		$this->objectId = null;
		$this->methodName = null;
		$this->params->clear();
	}
	
	//--------------------------------- Function -------------------------------
	
	public function decrypt()
	{
	   // ToDo: Impelement encryption
	}
	
	//--------------------------------- Setter & Getter -------------------------------
	
	public function getEncryption()
	{
	    return $this->encryption;
	}
	
	public function setEncryption($data)
	{
	    $this->encryption = $data;
	}
	
	public function getObjectId()
	{
        return $this->objectId;
	}
	
	public function setObjectId($data)
	{
        $this->objectId = $data;
	}
	
	public function getSessionId()
	{
        return $this->sessionId;
	}
	
	public function setSessionId($data)
	{
        $this->sessionId = $data;
	}
	
	public function getMethodName()
	{
        return $this->methodName;
	}
	
	public function setMethodName($data)
	{
        $this->methodName = $data;
	}
	
	public function getParams()
	{
        return $this->params;
	}
	
	public function setParams($params)
	{
        $this->params->clear();
        $this->params->addAll($params);
	}
}
		
?>
