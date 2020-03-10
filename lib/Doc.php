<?php

require_once("Node.php");

$xml_DocList = array();

function xml_StartElement($parser, $name, $attrs) 
{
    global $xml_DocList;
	$doc = $xml_DocList[$parser];	
	if (!isset($doc->rootNode))
	{		
		$newNode = new xml_Node();
		$newNode->name = $name;
		$newNode->type = "tag";
		$newNode->parent = $doc->rootNode;
		$newNode->attributes = $attrs;
		
		$doc->rootNode = $newNode;		
	}
	else if (!isset($doc->parentNode))
	{		
		$newNode = new xml_Node();
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
		$newNode = new xml_Node();
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
		$newNode = new xml_Node();
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
		if (!($node == null || $node == undefined))
		{
			echo $node->name;	
			echo "<br/>";
			foreach ($node->attributes As $key => $value) //access root /node
			{
				echo "- " .$key." ".$value ." ";
			}
			echo "<br/>";
			flush();
		}
			
		if (isset($node->childNodes))
		{		
			foreach ($node->childNodes as $value)
			{				
				xml_display($value, $ident + 1);
			}
		}
	}
}

function xml_fieldDesc($node)
{
	if (isset($node))
	{					
		if (!($node == null || $node == undefined))
		{
			if ($node->name == "FIELD")
			{
				foreach ($node->attributes As $key => $value) //access root /node
				{
					if ($key == "attrname")
					$header .= "," . $value;
					break;
				}
			}
			if ($node->name != "ROWDATA")
			{
				if (isset($node->childNodes))
				{	
					foreach ($node->childNodes as $value)
					{				
						$header .= xml_fieldDesc($value);
					}
				}
			}
		} 					
	}
	return $header;
}
function xml_data($node)
{
	$data ="";
	if (isset($node))
	{			
		if (!($node == null || $node == undefined))
		{
			if ($node->name == "ROW")
			{
				foreach ($node->attributes As $key => $value) //access root /node
				{
					$data .= ", '" . $value . "'";
				}
				$data = substr($data,1);
				$data = ",($data)";
			}
			if ($node->name != "METADATA")
			{
				if (isset($node->childNodes))
				{	
					foreach ($node->childNodes as $value)
					{				
						$data.= xml_data($value);
					}
				}
			}
			
		}
		return $data;	
		
	}
	return $data;
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

class xml_Doc
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