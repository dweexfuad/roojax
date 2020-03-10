<?php

class xml_Node
{
	var $name;
	var $attributes;
	var $type;
	var $parent;
	var $childNodes;
	var $data;	
	var $xmlStr;
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