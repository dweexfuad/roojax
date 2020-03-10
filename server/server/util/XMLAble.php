<?php

/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
class server_util_XMLAble
{
    protected $resId;
    protected $serialXML;
    
    function __construct()
	{
        $this->resId = md5(date("r"));
	}
	
	protected function doSerialize()
	{
	}
	
	protected function afterDeserialize()
	{
	}
	
	//--------------------------------- Function -------------------------------
	
	public function toString($bat = "man")
	{
        return $this->resId . "@$bat-" . $this->getClassName();
	}
	
	public function __toString()
	{
	   return $this->toString();
	}
	
	public function copy($src)
	{
        $this->fromXML($src->toXML());
	}
	
	public function copyMatch($src)
	{
        $xml = $src->toXML();

        if (($xml != null) && ($xml != ""))
        {
            uses("server_xml_Doc");
            uses("server_xml_Node");

            $doc = new server_xml_Doc();
    	   	$node = $doc->parse($xml);

            if ($node instanceof server_xml_Node)
                $this->fromXMLNode($node);
            else
                throw new Exception("Invalid XML format !");
    	}
    	else
            throw new Exception("Invalid XML format !");
	}
	
	public function cloneObj()
	{
        $className = $this->getClassName();
        $result = new $className();
        
        $result->copy($this);
        
        return $result;
	}
	
	public function toXML($name = null, $addAttributes = null)
	{
        if ($addAttributes != null)
            $addAttributes = " $addAttributes";
        else
            $addAttributes = "";
            
        if ($name == null)
	    	$this->serialXML = "<" . $this->getClassName() . "$addAttributes>";
		else
	    	$this->serialXML = "<" . $name . " $addAttributes type=\"" . $this->getClassName() . "\">";

		$this->doSerialize();

		if ($name == null)
	    	$this->serialXML .= "</" . $this->getClassName() . ">";
		else
		    $this->serialXML .= "</" . $name . ">";

    	return $this->serialXML;
	}
	
	public function fromXML($xml)
	{
        if (($xml != null) && ($xml != ""))
        {
            uses("server_xml_Doc");
            uses("server_xml_Node");
        	
			$step = "parse xml";
            $doc = new server_xml_Doc();
    	   	$node = $doc->parse($xml);
    	   	$step = "node";
            if ($node instanceof server_xml_Node)
            {		
                $type = $node->attributes["type"];
    			$step = "get type " . $type;
                if ($type == null)
                    $type = $node->getName();
                uses($type);
            
                if (class_exists($type) || interface_exists($type))
            	{
                    $ret = false;
        	   
                    $script = "\$ret = \$this instanceof $type;";
                    eval($script);
           			                     
                    if ($ret)
                        $this->fromXMLNode($node);
                    else
                        throw new Exception("Class mismatch between XML and object !");
                }
                else
                    throw new Exception("XML contains unknown class !");
            }
            else
                throw new Exception("Invalid XML format !" .$step);
    	}
    	else
            throw new Exception("Invalid XML format !" .$xml);
	}
	
	function doDeserializeObject($name, $type,$addParam = null)
    {
        $result = null;    		
        if ($type == "portalui_XMLAble" )$type = "server_util_XMLAble";
        uses($type);       		
        eval("try { \$result = new $type($addParam);} catch (Exception \$e) {}");
    
        return $result;
    }

	public function fromXMLNode($node)
	{
		uses("server_xml_Node");
        
        if ($node instanceof server_xml_Node)
        {
            foreach ($node->childNodes as $key => $childNode)
            {
                if ($childNode->getType() == "tag")
                {
                    $type = $childNode->attributes["type"];
                    $name = $childNode->getName();				                    
                    if ($type != null)
                    {
                        $value = null;
                        
                        if ($childNode->attributes["isNull"] != "true")
                        {
                            switch ($type)
                            {
                                case "string" 	:
                				                $child = @$childNode->childNodes[0];
                				                
                				                if ($child != null)
                                                    $value = urldecode(@$child->getName());
            	      							else
            	      							    $value = "";
                				                break;
                				case "double" 	:
                				                $child = @$childNode->childNodes[0];
                								$value = @$child->getName();
                				                settype($value, "float");
                				                break;
                                case "integer"  :
                                case "float"    :
                                                $child = @$childNode->childNodes[0];
        		  						        $value = @$child->getName();
        								        settype($value, $type);
                				                break;
                				case "boolean"	:
                	        	                $child = @$childNode->childNodes[0];
                								if ($child->getName() == "true")
                									$value = true;
                								else
                									$value = false;
                				                break;
                				default         :												
                				                $value = $this->doDeserializeObject($name, $type);

                								if ($value instanceof server_util_XMLAble)
                								    $value->fromXMLNode($childNode);
                			        	        break;
                            }
                        }
                            
                        try
                        {
                            $this->$name = $value;														
                        }
                        catch (Exception $e)
                        {
                        }
                    }
                }
            }
		}
	   
        $this->afterDeserialize();
	}
	
	protected function serialize($name, $defaultType = "string", $value = null)
	{
        try
        {
            if ($value === null)
				$value = $this->$name;						
            $type = gettype($value);
	    
    	    if ($type == "double")
    	       $type = "float";
	       
    	    if ($value === null)
    	    	$this->serialXML .= "<$name type=\"$defaultType\" isNull=\"true\"></$name>";
    	    else if (($type == "integer") || ($type == "string") || ($type == "float") || ($type == "double"))
    	        $this->serialXML .= "<$name type=\"$type\">" . urlencode($value) . "</$name>";
    	    else if (($type == "boolean"))
    	    {
    	        if ($value)
                    $this->serialXML .= "<$name type=\"$type\">true</$name>";
    			else
    			    $this->serialXML .= "<$name type=\"$type\">false</$name>";
    	    }
    	    else if ($value instanceof server_util_XMLAble)
    	        $this->serialXML .= $value->toXML($name);
    	}
    	catch (Exception $e)
    	{
    	}
	}
	function toJson(){
		$jsonContents = xml2json::transformXmlStringToJson($this->toXML());
		echo ($jsonContents);
	}
	//--------------------------------- Setter & Getter -------------------------------
	
	public function getClassName()
	{
		return get_class($this);
	}
	
	public function getName()
	{
		return $this->name;
	}
	
	public function setName($data)
	{
		$this->name = $data;
	}
}

// XMLAble Utilities Function

function xmlToObj($xml)
{
    $result = null;
    
    uses("server_xml_Doc");
    
    try
    {    
        $doc = new server_xml_Doc();
        $node = $doc->parse($xml);
	    
        $type = $node->attributes["type"];
    
        if ($type == null)
            $type = $node->getName();
        
        if ($type != null)
        {
            uses($type);
        
            eval("try { \$result = new $type();} catch (Exception \$e) { \$result = null;}");
        
            if ($result instanceof server_util_XMLAble)
                $result->fromXMLNode($node);
        }
    }
    catch (Exception $parseE)
    {
        $result = null;
    }
    
    return $result;
}

?>
