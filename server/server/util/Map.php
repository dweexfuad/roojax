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

class server_util_Map extends server_util_XMLAble
{
        protected $objList;
        
        protected $tag1;
        protected $tag2;
        protected $tag3;
        
        function __construct($options = null)
        {
                parent::__construct();
                if (isset($options)){
					$this->objList = $options;	
				}else
					$this->objList = array();
        }
        
        function doSerialize()
        {
                parent::doSerialize();
                
                $this->serialize("tag1", "string");
                $this->serialize("tag2", "string");
                $this->serialize("tag3", "string");
                
                $this->serialXML .= "<objList>";
            
        $i = 0;
        
        foreach ($this->objList as $key => $value)
        {
            $keyType = gettype($key);
            
            if (($keyType == "integer") || ($keyType == "string") || ($keyType == "float") || ($keyType == "double"))
            {
                $type = gettype($value);
            
                    if ($type == "double" || $type == "integer")
                       $type = "float";
               
                    if ($value === null)
                        $this->serialXML .= "<obj$i name=\"" . urlencode($key) . "\" type=\"string\" isNull=\"true\"></obj$i>";
                    else if (($type == "integer") || ($type == "string") || ($type == "float") || ($type == "double"))
                        $this->serialXML .= "<obj$i name=\"" . urlencode($key) . "\" type=\"$type\">" . urlencode($value) . "</obj$i>";
                    else if (($type == "boolean"))
                    {
                        if ($value)
                        $this->serialXML .= "<obj$i name=\"" . urlencode($key) . "\" type=\"$type\">true</obj$i>";
                                else
                                    $this->serialXML .= "<obj$i name=\"" . urlencode($key) . "\" type=\"$type\">false</obj$i>";
                    }
                    else if ($value instanceof server_util_XMLAble)
                        $this->serialXML .= $value->toXML("obj$i", "name=\"" . urlencode($key) . "\"");

                    $i++;
                }
        }

                $this->serialXML .= "</objList>";
        }

        function fromXMLNode($node)
        {
        uses("server_xml_Node");

        if ($node instanceof server_xml_Node)
        {
            parent::fromXMLNode($node);

            $objListNode = $node->getChildByName("objList");

            if (isset($objListNode))
            {
                foreach ($objListNode->childNodes as $key => $childNode)
                {
                    if ($childNode->getType() == "tag")
                    {
                        $type = @$childNode->attributes["type"];
                        $objName = $childNode->getName();
                        $name = urldecode(@$childNode->attributes["name"]);						
                        if ($type != null)
                        {
                            $value = null;
                        
                            if ($childNode->attributes["isNull"] != "true")
                            {
                                switch ($type)
                                {
                                    case "string"       :
												$child = @$childNode->childNodes[0];
												if ($child != null)
													$value = urldecode(@$child->getName());
												else
													$value = "";												
												break;
									case "double"   :
													$child = @$childNode->childNodes[0];
													if ($child != null)
																		$value = @$child->getName();
										else
											$value = 0;

													settype($value, "float");
													break;
                                    case "integer"  :
                                    case "float"    :
                                                    $child = @$childNode->childNodes[0];

                                                    if ($child != null)
                                                        $value = @$child->getName();
                                                    else
                                                        $value = 0;

                                                                                settype($value, "float");													
                                                                     break;
                                                case "boolean"  :
                                                        $child = @$childNode->childNodes[0];

                                                        if ($child != null)
                                                        {
                                                                                    if ($child->getName() == "true")
                                                                                            $value = true;
                                                                                        else
                                                                                           $value = false;
                                                    }
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
                                $this->set($name, $value);
                            }
                            catch (Exception $e)
                            {
                            }
                        }
                    }
                }
            }
        }
        }
        
        //--------------------------------- Function -------------------------------
        
    function set($name, $object)
        {
                $this->objList[$name] = $object;
        }
        
        function addAll($otherList)
        {
                if ($otherList instanceof server_util_Map)
                {
                        foreach ($otherList->getArray() as $key => $value)
                        {
                                $this->set($key, $value);
                        }
                }
        }
        
        function getArray()
        {
                return $this->objList;
        }
        
        function del($name)
        {
                $result = $this->objList[$name];
                
                unset($this->objList[$name]);
                
                return $result;
        }
        
        function delObject($obj)
        {
                $index = $this->indexOf($obj);
                
                if ($index != null)
                        $this->del($index);
        }
        
        function getLength()
        {
           return count($this->objList);
        }
        
        function get($name)
        {
                return @$this->objList[$name];
        }
        
        function getByIndex($index)
        {
        $i = 0;
        $result = null;
        
        foreach ($this->objList as $key => $value)
        {
            if ($i == $index)
            {
                $result = $value;
                break;
            }
            else
                $i++;
        }
        
                return $result;
        }
        
        function clear()
        {
                unset($this->objList);
                $this->objList = array();
        }
                
        function indexOf($object)
        {
        $result = null;
        
        foreach ($this->objList as $key => $value)
        {
            if ($value == $object)
            {
                $result = $key;
                break;
            }
        }
        
                return $result;
        }
        
        //--------------------------------- Setter & Getter -------------------------------
        
        function getTag1()
        {
           return $this->tag1;
        }
        
        function setTag1($data)
        {
           $this->tag1 = $data;
        }
        
        function getTag2()
        {
           return $this->tag2;
        }
        
        function setTag2($data)
        {
           $this->tag2 = $data;
        }
        
        function getTag3()
        {
           return $this->tag3;
        }
        
        function setTag3($data)
        {
           $this->tag3 = $data;
        }
}

?>
