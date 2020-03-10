get<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_XMLAble");
uses("server_util_Map");

class server_DBConnection_dataModel extends server_util_XMLAble
{
	public $fields;
	public $type;
	public $values;
	function __construct()
	{
		parent::__construct();
		uses("server_util_Map");
		$this->fields = new server_util_Map();
		$this->type = new server_util_Map();
	}
	
	function doSerialize()
	{
		parent::doSerialize();
		
		foreach ($this->fields as $key => $value)
		{
			$type = $this->type->get($key);
			$this->serialize($value, $type);
		}
	}
	function setValues($resultSet)
	{		
		foreach ($resultSet->fields as $key)
		{
			$name = $resultSet->fetchField[$key].name;					
			$tipe = $resultSet->fetchField[$key].type;					
			$this->values->set($name,$resultSet->fields[$key]);
			$this->fields->set($key, $name);
			$this->type->set($key, $tipe);			
		}
	}
	function listData($resultSet)
	{

		$first = true;
		$headerString = "";
		$result = "";
		while (!$resultSet->EOF)
		{
			if ($first)
			{
				for ($i = 0; $i < $resultSet->FieldCount(); $i++)
				{
					$name = $resultSet->FetchField($i)->name;					
					$headerString .= ";" . $name;
				}					
				$first = false;
				$headerString = substr($headerString,1) . "\r\n";
			}
			$values = "";
			for ($i = 0; $i < $resultSet->FieldCount(); $i++)
			{
				$value =  $resultSet->fields[$i];
				$values .= ";" . $value;
			}		
			if ($values != "")
				$result .= substr($values,1) . "\r\n";
			$resultSet->MoveNext();
		}				
		if ($result != "")
			$result = substr($result,0,strlen($result)-2);	
		$result = $headerString . $result;
		$resultSet->close();
		return $result;
	}
	function listDataObj($resultSet)
	{
		uses("server_util_Map");
		$first = true;
		$result = new server_util_Map();
		$row = 0; 
		$fieldDesc = new server_util_Map();							
		$desc1 = new server_util_Map();
		$desc2 = new server_util_Map();
		while (!$resultSet->EOF)
		{			
			$values = "";		
			$val =  new server_util_Map();
			for ($i = 0; $i < $resultSet->FieldCount(); $i++)
			{
				if ($first){
					if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real")
						$desc1->set($resultSet->FetchField($i)->name,100);
					else{
						$length = $resultSet->FetchField($i)->max_length * 6;
						if ($length > 250) $length = 250;
						$desc1->set($resultSet->FetchField($i)->name,$length);
					}					
					$desc2->set($resultSet->FetchField($i)->name,$resultSet->FetchField($i)->type);
				}				
				$value =  $resultSet->fields[$i];								
				if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real")  {
					$tmpvalue = strval($value);
					if (strpos($tmpvalue,"E") != false)
						$value = $tmpvalue;  					
				}else if ($resultSet->FetchField($i)->type == "blob" || $resultSet->FetchField($i)->type == "blob"){
					$value = addslashes($value);
				}								 								
				$val->set(strtolower($resultSet->FetchField($i)->name), $value);				
			}	
			$first = false;	
			$result->set($row, $val);
			$row++;
			$resultSet->MoveNext();
		}						
		$fieldDesc->set(0,$desc1);
		$fieldDesc->set(1,$desc2);
		$result->setTag1($row);
		$result->setTag2($fieldDesc);		
		$resultSet->close();						
		return $result;
	}
	function listDataArray($resultSet)
	{

		$first = true;
		$headerString = "";
		while (!$resultSet->EOF)
		{
			if ($first)
			{
				for ($i = 0; $i < $resultSet->FieldCount(); $i++)
				{
					$name = $resultSet->FetchField($i)->name;					
					$headerString .= ";" . $name;
				}					
				$first = false;
				$headerString = substr($headerString,1) . "\r\n";
			}
			$values = "";
			for ($i = 0; $i < $resultSet->FieldCount(); $i++)
			{
				$value =  $resultSet->fields[$i];
				$values .= ";" . $value;
			}		
			if ($values != "")
				$result .= substr($values,1) . "\r\n"; 				
			$resultSet->MoveNext();
		}				
		if ($result != "")
			$result = substr($result,0,strlen($result)-2);	
		$result = $headerString . $result;
		$resultSet->close();
		return $result;
	}
	function listDataStruc($resultSet)
	{
		$first = true;
		$result = "{ \"rs\" : {";
		$result .= "\"rows\": [";
		$values = "";
		$fields = " \"fields\" : {";		
		if (gettype($resultSet) != "string"){
			try{
				while (!$resultSet->EOF)
				{			
					if (!$first) { $values .= ",";}		
					$values .= "{";			
					for ($i = 0; $i < $resultSet->FieldCount(); $i++)
					{		
						if ($i > 0) {$values .= ","; if ($first) $fields .= ",";}						
						if ($resultSet->FetchField($i)->type == "text" || $resultSet->FetchField($i)->type == "blob") {
							$value = addslashes($resultSet->fields[$i]);
							$value = str_replace("\n","",$value);
							$values .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";																				
						}else		
							$values .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $resultSet->fields[$i]."\"";																				
						if ($first){					
							if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real")
								$length = 100;
							else{
								$length = $resultSet->FetchField($i)->max_length * 6;
								if ($length > 250) $length = 250;					
							}
							$fields .= " \"". strtolower($resultSet->FetchField($i)->name) ."\" : {";
							$fields .= " \"type\" : \"" . $resultSet->FetchField($i)->type ."\"";	
							$fields .= ",";
							$fields .= " \"length\" : " . $length;	
							$fields .= "}";
						}
					}								
					$values .= "}"; 							
					$first = false;
					$resultSet->MoveNext();
				}			
			}catch(Exception $e){
				error_log($e->getMessage());
			}
		}else {
			$values .= "{\"msg\" : \"". $resultSet."\"}";			
		}
		$fields .= "}";	
		$result .= $values;
		$result .= "] ";
		$result .= "," . $fields;
		$result .= "} }";							
		if (gettype($resultSet) != "string") $resultSet->close();	
		return $result;
	}
	function getDataProvider($resultSet)
	{
		$first = true;
		$result = "{ \"rs\" : {";
		$result .= " \"rows\": [";
		$values = "";
		$fields = " \"fields\" : {";		
		if (gettype($resultSet) != "string"){
			try{
				while (!$resultSet->EOF)
				{			
					if (!$first) { $values .= ",";}		
					$values .= "{";			
					for ($i = 0; $i < $resultSet->FieldCount(); $i++)
					{							
						if ($i > 0) {$values .= ","; if ($first) $fields .= ",";}						
						if ($resultSet->FetchField($i)->type == "text" || $resultSet->FetchField($i)->type == "blob"){
							//$pos = strpos($resultSet->fields[$i],"'");
							//if (gettype($pos) != "boolean") $value = $resultSet->fields[$i];
							//else 
							$value = addslashes($resultSet->fields[$i]);
							$values .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";																											
						}else if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real" || $resultSet->FetchField($i)->type == "I"  || $resultSet->FetchField($i)->type == "i" || $resultSet->FetchField($i)->type == "decimal" || $resultSet->FetchField($i)->type == "NUMBER"){
							$values .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . floatval($resultSet->fields[$i])."\"";
						}else {
							//$pos = strpos($resultSet->fields[$i],"'");
							//if (gettype($pos) != "boolean") $value = $resultSet->fields[$i];
							//else 
							$value = addslashes($resultSet->fields[$i]);
							if ($value == "") $value = "-";							
							$values .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";						
						}
						if ($first){					
							if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real" || $resultSet->FetchField($i)->type == "I" || $resultSet->FetchField($i)->type == "i" || $resultSet->FetchField($i)->type == "decimal" || $resultSet->FetchField($i)->type == "NUMBER" )
								$length = 100;
							else{
								$length = $resultSet->FetchField($i)->max_length * 6;
								if ($length > 250) $length = 250;					
							}
							$fields .= " \"". strtolower($resultSet->FetchField($i)->name) ."\" : {";
							$fields .= " \"type\" : \"" . $resultSet->FetchField($i)->type ."\"";	
							$fields .= ",";
							$fields .= " \"length\" : " . $length;	
							$fields .= "}";
						}						
					}								
					$values .= "}";
					
					$first = false;
					$resultSet->MoveNext();
				}			
			}catch(Exception $e){
				error_log($e->getMessage());
			}
		}else {
			$values .= "{\"msg\" : \"". $resultSet."\"}";			
		}		
		$fields .= "}";	
		$result .= $values;
		$result .= "] ";
		$result .= "," . $fields;
		$result .= "} }";									
		if (gettype($resultSet) != "string") $resultSet->close();	
		return $result;
	}
	function getDataProviderKeyMap($resultSet, $keyField)
	{
		$first = true;
		$result = "{ \"rs\" : {";
		$result .= " \"data\": { ";
		$values = "";
		$rowCount = 0;
		$fields = " \"fields\" : {";		
		if (gettype($resultSet) != "string"){
			try{
				while (!$resultSet->EOF)
				{		
					if ($values != "")	$values .= ",";
					$rowCount++;
					$line = "{";		
					$key = "";
					for ($i = 0; $i < $resultSet->FieldCount(); $i++)
					{		
						if ($i > 0) {$line .= ","; if ($first) $fields .= ",";}						
						if ($resultSet->FetchField($i)->type == "text" || $resultSet->FetchField($i)->type == "blob"){
							$pos = strpos($resultSet->fields[$i],"'");
							if (gettype($pos) != "boolean") $value = $resultSet->fields[$i];
							else $value = addslashes($resultSet->fields[$i]);
							$line .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";																											
						}else if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real" || $resultSet->FetchField($i)->type == "I"  || $resultSet->FetchField($i)->type == "i" || $resultSet->FetchField($i)->type == "decimal" || $resultSet->FetchField($i)->type == "NUMBER"){
							$line .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . floatval($resultSet->fields[$i])."\"";
						}else {
							$pos = strpos($resultSet->fields[$i],"'");
							if (gettype($pos) != "boolean") $value = $resultSet->fields[$i];
							else $value = addslashes($resultSet->fields[$i]);
							if ($value == "") $value = "-";							
							$line .=  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";						
						}
						if (strtolower($resultSet->FetchField($i)->name) == $keyField)
							$key = $value;
						if ($first){					
							if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real" || $resultSet->FetchField($i)->type == "I" || $resultSet->FetchField($i)->type == "i" || $resultSet->FetchField($i)->type == "decimal" || $resultSet->FetchField($i)->type == "NUMBER" )
								$length = 100;
							else{
								$length = $resultSet->FetchField($i)->max_length * 6;
								if ($length > 250) $length = 250;					
							}
							$fields .= " \"". strtolower($resultSet->FetchField($i)->name) ."\" : {";
							$fields .= " \"type\" : \"" . $resultSet->FetchField($i)->type ."\"";	
							$fields .= ",";
							$fields .= " \"length\" : " . $length;	
							$fields .= "}";
						}
					}								
					$line .= "}"; 							
					$values .= "\"$key\" : " . $line;
					$first = false;
					$resultSet->MoveNext();
				}			
			}catch(Exception $e){
				error_log($e->getMessage());
			}
		}else {
			$values .= "{\"msg\" : \"". $resultSet."\"}";			
		}
		$fields .= "}";	
		$result .= $values;
		$result .= " } , ";	
		$result .= "\"length\" : $rowCount , ";
		$result .= $fields;
		$result .= "} }";									
		if (gettype($resultSet) != "string") $resultSet->close();	
		return $result;
	}
	function getDataProviderDirect($resultSet)
	{
		$first = true;
		echo "{ \"rs\" : {";
		echo " \"rows\": [";
		$values = "";
		$fields = " \"fields\" : {";		
		if (gettype($resultSet) != "string"){
			try{
				while (!$resultSet->EOF)
				{			
					if (!$first) { echo ",";}		
					echo  "{";			
					for ($i = 0; $i < $resultSet->FieldCount(); $i++)
					{		
						if ($i > 0) {echo ","; if ($first) $fields .= ",";}						
						if ($resultSet->FetchField($i)->type == "text" || $resultSet->FetchField($i)->type == "blob"){
							$pos = strpos($resultSet->fields[$i],"\"");
							if (gettype($pos) != "boolean") $value = addslashes($resultSet->fields[$i]);							
							echo   " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";																				
						}else if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real"){							
							echo  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . floatval($resultSet->fields[$i])."\"";
						}else {
							$value = addslashes($resultSet->fields[$i]);
							if ($value == "") $value = "-";
							echo  " \"". strtolower($resultSet->FetchField($i)->name) ."\":\"" . $value ."\"";						
						}
						if ($first){					
							if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real")
								$length = 100;
							else{
								$length = $resultSet->FetchField($i)->max_length * 6;
								if ($length > 250) $length = 250;					
							}
							$fields .= " \"". strtolower($resultSet->FetchField($i)->name) ."\" : {";
							$fields .= " \"type\" : \"" . $resultSet->FetchField($i)->type ."\"";	
							$fields .= ",";
							$fields .= " \"length\" : " . $length;	
							$fields .= "}";
						}
					}								
					echo  "}"; 							
					$first = false;
					$resultSet->MoveNext();
				}			
			}catch(Exception $e){
				error_log($e->getMessage());
			}
		}else {
			echo "{\"msg\" : \"". $resultSet."\"}";			
		}
		$fields .= "}";	
		echo  $values;
		echo  "] ";
		echo  "," . $fields;
		echo  "} }";							
		if (gettype($resultSet) != "string") $resultSet->close();	
		return "\r\n";
	}
}
?>
