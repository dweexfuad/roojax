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

uses("server_Object");

class server_BasicObject extends server_util_XMLAble implements server_Object
{	
    protected $manager;
    
	function __construct()
	{
		parent::__construct();
	}

    protected function doSerialize()
	{
		parent::doSerialize();
	}
	
	//--------------------------------------------------------------------------
	
	public function init()
	{
	}

    public function deinit()
    {
    }
    
    //--------------------------------------------------------------------------
    
	public function getManager($manager)
	{
        return $this->manager;
	}
	
	public function setManager($manager)
	{
        $this->manager = $manager;
	}
    
    public function getSessionObject($objId)
    {
        $result = null;

        if ($this->manager instanceof server_Manager)
            $result = $this->manager->getSessionObject($objId);

        return $result;
    }
    
    public function getSessionObjectByClass($className)
    {
        $result = null;
        
        if ($this->manager instanceof server_Manager)
            $result = $this->manager->getSessionObjectByClass($className);
        
        return $result;
    }
}

?>
