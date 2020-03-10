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
uses("server_util_arrayList");

uses("server_Request");
uses("server_Response");

uses("server_LocalProtocol");
uses("server_HTTPProtocol");

class server_Connection extends server_util_XMLAble
{
    public $sessionId;
    protected $address;
    
    protected $request;
    protected $response;
    
    protected $protocol;
    
    function __construct($address = null, $autoInit = true)
	{
		parent::__construct();

		$this->address = $address;				
		$this->request = new server_Request();
		$this->response = new server_Response();
		
		if ($address == null)
            $this->protocol = new server_LocalProtocol($this); 
        else
        {
            $pos = strpos($address, ":/");
            
            if ($pos >= 0)
            {
                $protocol = strtolower(substr($address, 0, $pos));
                
                switch ($protocol)
                {
                    case "http" :
                                $this->protocol = new server_HTTPProtocol($this);
                                break;
                    default     :
                                throw new Exception("Invalid protocol !");
                                break;
                }
        	}
        	else
                return new Exception("Invalid protocol !");
    	}
		
		if ($autoInit)
            $this->init();
	}
	
    public function init()
    {
        $this->sessionId = $this->call("manager", "init");
    }
    
    public function synch()
    {
        $this->call("manager", "synch");
    }
    
    public function call($objId, $methodName, $params = null)
    {
        $this->request->clear();
        $this->request->setObjectId($objId);
        $this->request->setSessionId($this->sessionId);
        $this->request->setMethodName($methodName);
        $this->request->setParams($params);
        
        $retXML = $this->protocol->doCall();
        
        if (($retXML != null) && ($retXML != ""))
        {
            try
            {
                $this->response->fromXML($retXML);
                
                switch ($this->response->getCode())
                {
                    case 0 : // OK
                            return $this->response->getValue();
                            break;
                    case 1 : // server exception
                            $svrException = $this->response->getValue();
                            return $svrException;
//                            throw new Exception($svrException->getMessage(), $svrException->getCode());
                            break;
                    default :
                            return new Exception("Unknown response code : " . $this->response->getCode());
                            break;
                }
            }
            catch (Exception $e)
            {
                return new Exception("Invalid server response : $retXML ($methodName:$objId)");
            }
        }
        else
            return new Exception("Invalid server response : $retXML ($methodName:$objId)");
    }
        
    public function getRequestXML()
    {
        return $this->request->toXML();
    }
    
    public function getAddress()
    {
        return $this->address;
    }
}

?>