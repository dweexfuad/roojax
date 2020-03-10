<?php

/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			Saltanera Teknologi, PT											
***********************************************************************************************/
class server_xml_Node
{
	var $name;
	var $attributes;
	var $type;
	var $parent;
	var $childNodes;

    function __construct()
	{
		$this->childNodes = array();
	}
	
	//------------------------------------ Setter & Getter -----------------------------------
	
	function getName()
	{
	   return $this->name;
	}
	
	function getType()
	{
	   return $this->type;
	}
	
	function getFirstChild()
	{
	   $result = @$this->childNodes[0];
	   
	   return $result;
	}
	function hasChilds(){
		return count($this->childNodes) != 0;
	}
	function getChild($index)
	{
	   $result = @$this->childNodes[$index];
	   
	   return $result;
	}
	
	function getChildByName($name)
	{
        $result = null;
        
        foreach ($this->childNodes as $key => $value)
        {
            if ($value->getName() == $name)
            {
                $result = $value;
                break;
            }
        }
        
        return $result;
	}
	
	function getAttribute($name)
	{
	   $result = @$this->attributes[$name];
	   
	   return $result;
	}
}

?>