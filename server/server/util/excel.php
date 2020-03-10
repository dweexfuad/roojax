<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_modules_xls_excelReader",false);
//uses("server_xls_Writer",false);
class server_util_excel
{
	protected $filename;
	protected $xls;
	function __construct($filename)
	{
		$this->filename= $filename;		
	}	
	function read($filename){		 	
		$xls = new Spreadsheet_Excel_Reader($filename);
		$ret = 	"{\"rows\" : [";
		$values = "";
		$first = true;		
		$desc = "{\"desc\" : [";
		for ($row=1;$row<=$xls->rowcount();$row++) { 	
			if ($row == 1){
				for ($col=1;$col<=$xls->colcount();$col++) {				
					if ($col > 1) $desc .= ",";
					$desc .= "{\"name\" : \"". $xls->val($row,$col) ."\",";
					$desc .= "\"type\" : \"". $xls->type($row,$col) ."\",";
					$desc .= "\"format\" : \"". $xls->format($row,$col) ."\",";
					$desc .= "\"formatIndex\" : \"". $xls->formatIndex($row,$col) ."\"}";
				}
				continue;
			}
			if (!$first) { $values .= ",";}		
			$values .= "{";			
			for ($col=1;$col<=$xls->colcount();$col++) {				
				if ($col > 1) $values .= ",";
				$values .= "\"cell$col\" : {";
				$values .= "\"value\" : \"" . $xls->val($row,$col) ."\","; 
				$values .= "\"type\" : \"". $xls->type($row,$col) ."\",";
				$values .= "\"format\" : \"" .  $xls->format($row,$col). "\"," ;
				$values .= "\"formatIndex\" : \"" .$xls->formatIndex($row,$col). "\"";
				$values .= "}";							
			}
			$values .= "}"; 							
			$first = false;
		} 
		$desc .= "]}";
		$ret .= $values;	
		$ret .= "]";		
		$ret .= "," . $desc;		
		$ret .= "}";
		return $ret;
	}
	function read2Obj($filename){		 	
		$xls = new Spreadsheet_Excel_Reader($filename);
		uses("server_util_Map");
		$map = new server_util_Map();		
		$fieldDesc = new server_util_Map();							
		$desc1 = new server_util_Map();
		$desc2 = new server_util_Map();
		$header = array();
		for ($row=1;$row<=$xls->rowcount();$row++) { 	
			if ($row == 1){
				for ($col=1;$col<=$xls->colcount();$col++) {				
					$header[$col] = $xls->val($row,$col);					
					$desc1->set($header[$col],250);
					$desc2->set($header[$col],"S");
				}
				continue;
			}					
			$lineMap = new server_util_Map();
			for ($col=1;$col<=$xls->colcount();$col++) {				
				$lineMap->set($header[$col],$xls->val($row,$col));				
			}			
			$map->set(($i - 1),$lineMap);
		} 			
		$fieldDesc->set(0,$desc1);
		$fieldDesc->set(1,$desc2);
		$map->setTag1(($xls->rowcount()-1));
		$map->setTag2($fieldDesc);		
		return $map;
	}
	function read2Txt($filename){		 	
	    try{     
    		$xls = new Spreadsheet_Excel_Reader($filename);	
    		$result = "\r\n";			
    		for ($row=1;$row<=$xls->rowcount();$row++) { 	
    			if ($row == 1){
    				$headerText = "";			
    				for ($col=1;$col<=$xls->colcount();$col++) {				
    					$headerText .= ";" . $xls->val($row,$col);										
    				}
    				$headerText = substr($headerText,1);
    				continue;
    			}					
    			$data = "";
    			for ($col=1;$col<=$xls->colcount();$col++) {				
    				$data .= ";" . $xls->val($row,$col);				
    			}			
    			$data = substr($data,1);	
    			$result .= $data . "\n";
    		} 					
    		$map = $headerText . $result ."\r\n". ($xls->rowcount()-1);						
   		}catch(Exception $e){
   		   error_log("error");
   		   error_log($e->getMessage());
         }
		return $map;
	}
	function getExcelObject(){
			
	}
	
	
}

?>
