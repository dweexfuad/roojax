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

class server_RemoteObject extends server_util_XMLAble
{
    protected $objectId;
    protected $connection;
    protected $params;
    
    protected $remoteClassName;
    
    function __construct($connection = null)
	{
		parent::__construct();
		
		$this->objectId = null;
		
		$this->connection = $connection;
		$this->params = new server_util_arrayList();
		
		if ($this->remoteClassName != null)
		{
            $this->params->clear();
            $this->params->add($this->remoteClassName);
            
            $this->objectId = "manager";
            $this->objectId = $this->call("createObject");
		}
	}
	
    protected function call($methodName)
    {
        if ($this->connection != null)
        {            
			$result = $this->connection->call($this->objectId, $methodName, $this->params);
            
            return $result;
        }
        else
            return null;
    }
    
    public function isValid()
    {
        return ($this->objectId != null);
    }
}

?>
