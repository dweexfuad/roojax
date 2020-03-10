<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			Saltanera Teknologi, PT											
***********************************************************************************************/

uses("server_xml_Node");

$xml_DocList = array();

function xml_StartElement($parser, $name, $attrs) 
{
    global $xml_DocList;
        $doc = $xml_DocList[$parser];   
        
        if (!isset($doc->rootNode))
        {               
                $newNode = new server_xml_Node();
                $newNode->name = $name;
                $newNode->type = "tag";
                $newNode->parent = $doc->rootNode;
                $newNode->attributes = $attrs;
                
                $doc->rootNode = $newNode;              
        }
        else if (!isset($doc->parentNode))
        {               
                $newNode = new server_xml_Node();
                $newNode->name = $name;
                $newNode->type = "tag";
                $newNode->parent = $doc->rootNode;
                $newNode->attributes = $attrs;
                
                $doc->rootNode->childNodes[count($doc->rootNode->childNodes)] = $newNode;
                                
                $doc->nowNode = $newNode;
                $doc->parentNode = $doc->rootNode;
        }
        else
        {               
                $newNode = new server_xml_Node();
                $newNode->name = $name;
                $newNode->type = "tag";
                $newNode->parent = $doc->nowNode;
                $newNode->attributes = $attrs;
                
                $doc->nowNode->childNodes[count($doc->nowNode->childNodes)] = $newNode;
                                
                $doc->parentNode = $doc->nowNode;
                $doc->nowNode = $newNode;
        }
}

function xml_EndElement($parser, $name) 
{
        global $xml_DocList;
        $doc = $xml_DocList[$parser];
        
        if (isset($doc->nowNode))
        {
                $doc->nowNode = $doc->parentNode;               
                $doc->parentNode = @$doc->parentNode->parent;           
        }
}

function xml_DataElement($parser, $data) 
{
    global $xml_DocList;
        $doc = $xml_DocList[$parser];
        
        if (isset($doc->nowNode))
        {
                $newNode = new server_xml_Node();
                $newNode->name = $data;
                $newNode->type = "data";
                $newNode->parent = $doc->nowNode;
                
                $doc->nowNode->childNodes[count($doc->nowNode->childNodes)] = $newNode;
        }
}

function xml_display($node, $ident = 0)
{       
        if (isset($node))
        {       
                for ($i = 0; $i < $ident; $i++)
                {
                        echo("&nbsp;&nbsp;&nbsp;");
                }
                
                echo("- " . $node->name . "<br/>");
                flush();
                        
                if (isset($node->childNodes))
                {               
                        foreach ($node->childNodes as $value)
                        {                               
                                xml_display($value, $ident + 1);
                        }
                }
        }
}

function xml_entities($data)
{
        $result = $data;
        $result = htmlentities($result);
        $result = str_replace("\r", "&r;", $result);
        $result = str_replace("\n", "&n;", $result);
        
        return $result;
}

function xml_entitiesDecode($data)
{
        $result = $data;
        $result = html_entity_decode($result);
        $result = str_replace("&r;", "\r", $result);
        $result = str_replace("&n;", "\n", $result);
        
        return $result;
}

class server_xml_Doc
{
        var $rootNode;
        var $parentNode;
        var $nowNode;

    function __construct()
        {
                $this->rootNode = null;
        }
        
        function parse($xmlString)
        {
                global $xml_DocList;
                
                $parser = xml_parser_create();
                $xml_DocList[$parser] = $this;
                $this->disp = "root -- ";
                
                xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, false);
                xml_set_element_handler($parser, "xml_StartElement", "xml_EndElement");
                xml_set_character_data_handler($parser, "xml_DataElement");     
                xml_parse($parser, $xmlString);                         
                
                xml_parser_free($parser);
                
                return $this->rootNode;
        }
        
        function parseFile($fileName)
        {
           $xmlString = file_get_contents($fileName);
           
           return $this->parse($xmlString);
        }
        
        function getRootNode()
        {
        return $this->rootNode;
        }
}

?>
