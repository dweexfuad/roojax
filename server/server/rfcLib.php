
<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at
*	Contributors
* 			SAI, PT
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");
uses("server_util_arrayList");

class server_util_rfcLib  extends server_BasicObject
{
	protected $options;
	function __construct($options = null)
	{
		parent::__construct();
		$this->options = $options;
	}
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("options", "string",$this->options);
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	function login($usr, $pwd){
		/*$this->config = new server_util_Config($this->options);
		$this->sysnr = $this->config->get("sysnr");
		$this->host = $this->config->get("host");
		$this->client = $this->config->get("client");
		$this->codepage = $this->config->get("codepage");
		$this->r3name = $this->config->get("r3name");
		$this->group = $this->config->get("group");
		$this->lang = $this->config->get("lang");
		try{
			$login = array (
				"MSHOST"	=> $this->host,
				"SYSNR"		=> $this->sysnr,
				"CLIENT"	=> $this->client,
				"R3NAME"	=> $this->r3name,
				"GROUP"		=> $this->group,
				"LANG"		=> $this->lang,
				"USER"		=> $usr,
				"PASSWD"	=> $pwd,
				"CODEPAGE"	=> $this->codepage);
			return saprfc_open ($login );
		}catch(Exception $e){
			error_log($e->getMessage());
			return 0;
		}*/
		$this->config = new server_util_Config($this->options);
		$this->sysnr = $this->config->get("sysnr");
		$this->host = $this->config->get("host");
		$this->client = $this->config->get("client");
		$this->codepage = $this->config->get("codepage");
		try{
			$login = array (
				"ASHOST"=>$this->host,
				"SYSNR"=>$this->sysnr,
				"CLIENT"=>$this->client,
				"USER"=>$usr,
				"PASSWD"=>$pwd,
				"CODEPAGE"=>$this->codepage);
			return saprfc_open ($login );
		}catch(Exception $e){
			echo($e->getMessage());
			return 0;
		}
	}
	/* login = arrayMap => user => uid, passwd => pwd
	 * sapFunc = string = sap function
	 * sapImp = arrayMap = import parameter, sap import field => value
	 * sapExpTable = arrayList = list of export table, TLOG, T51
	 * sapImpTable = arrayMap = import table.
	 * 					table1 = array of table content (arrayMap)
	 * 							1 => arrayMap => field1 => value1, field2 => value2
	 * 							2 => arrayMap => field1 => value1, field2 => value2
	 * 					table2 = array of table content (arrayMap)
	 * 							1 => arrayMap => field1 => value1, field2 => value2
	 * 							2 => arrayMap => field1 => value1, field2 => value2
	 * sapExp = string = export return value. (EX_RETURN)
	 *
	 * */
	function callRFC($login, $sapFunc, $sapImp = null,  $sapExpTable = null, $sapImpTable = null, $sapExp = null, $closeRfc = null, $keepRFC = null, $rfc = null){
		try{
			if (!isset($rfc)) $rfc = $this->login($login->get("user"),$login->get("passwd"));
			if ($rfc){
				error_log("Discover");
				$fce = saprfc_function_discover($rfc,$sapFunc);
				if (! $fce ) { 
					error_log("error:Discovering interface of function module failed($sapFunc))");
					return "error:Discovering interface of function module failed($sapFunc))";  
				}
				if (isset($sapImp)){
					foreach ($sapImp->getArray() as $impField => $impValue){
						saprfc_import ($fce,$impField,$impValue);
					}
				}
				if (isset($sapExpTable)){
					foreach ($sapExpTable->getArray() as $expValue){
						saprfc_table_init ($fce,$expValue);
					}
				}
				if (isset($sapImpTable)){
					foreach($sapImpTable->getArray() as $table => $tabValue){
						saprfc_table_init ($fce,$table);
						if (isset($tabValue)){
							foreach ($tabValue->getArray() as $value){
								saprfc_table_append($fce, $table, $value);
							}
						}
					}
				}
				error_log("Call RFC");
				$rfc_rc = saprfc_call_and_receive ($fce);
				if ($rfc_rc != SAPRFC_OK) {
					error_log("Error");
					if ($rfc == SAPRFC_EXCEPTION ){
						error_log(saprfc_exception($fce));
					
						return "error: ".saprfc_exception($fce);
					}else{
						error_log("error: ".str_replace("\n","<br>",saprfc_error($fce)));
					 	return "error: ".str_replace("\n","<br>",saprfc_error($fce));
					}
				}
				error_log("Done");
				$result = new server_util_Map();
				if (isset($sapExp)){
					if (gettype($sapExp) == "string"){
						$value = saprfc_export ($fce,$sapExp);
						if (gettype($value) == "array"){
							$tmp = new server_util_Map($value);
							$result->set($sapExp, $tmp);
						}else $result->set($sapExp, $value);
					}else foreach ($sapExp->getArray() as $value){
						$valtmp = saprfc_export ($fce,$value);
						if (gettype($valtmp) == "array"){
							$tmp = new server_util_Map($valtmp);
							$result->set($value, $tmp);
						}else $result->set($value, $valtmp);
					}
				}
				if (isset($sapExpTable)){
					foreach ($sapExpTable->getArray() as $expValue){
						$tmpExport = new server_util_arrayList();
						$rows = saprfc_table_rows ($fce,$expValue);
						$table = array();
						for ($i=1;$i<=$rows;$i++){
							$table[] = saprfc_table_read ($fce,$expValue,$i);
							$tmp = new server_util_Map();
							foreach ($table as $key => $logval){
								$row = new server_util_Map();
								foreach ($logval as $k => $val){
									if (isset($sapExp)){
										if ($result->get("EX_RETURN") == "FAILED"){
											if (strpos(strtolower($val),"posted") > 1) $result->set("EX_RETURN","SUCCESS");
											//The records are already being processed
											if (strpos(strtolower($val),"already being processed") > 1) $result->set("EX_RETURN","SUCCESS");
										}
									}
									$row->set($k,$val);
								}
								$tmp->set($key,$row);
							}
							$table = array();
							$tmpExport->add($tmp);
						}
						$result->set($expValue, $tmpExport);
					}
				}
				saprfc_function_free($fce);
				if ($keepRFC) $result->set("rfc",$rfc);
				if ($closeRfc) saprfc_close($rfc);
				return $result;
			}else return "error:RFC connection failed <br>". str_replace("\n","<br>",saprfc_error()) ;
		}catch(Exception $e){
			error_log("error " . $e->getMessage());
			return "error:$sapFunc" . $e->getMessage(). "<br>". str_replace("\n","<br>",saprfc_error());
		}
	}
	function callRFCToJSON($login, $sapFunc, $sapImp,  $sapExpTable = null, $sapImpTable = null, $sapExp = null, $closeRfc = null, $keepRFC = null, $rfc = null){
		try{
			if (!isset($rfc)) $rfc = $this->login($login->get("user"),$login->get("passwd"));
			if ($rfc){
				$fce = saprfc_function_discover($rfc,$sapFunc);
				if (! $fce ) { return "error:Discovering interface of function module failed($sapFunc))";  }
				foreach ($sapImp->getArray() as $impField => $impValue){
					saprfc_import ($fce,$impField,$impValue);
				}
				if (isset($sapExpTable)){
					foreach ($sapExpTable->getArray() as $expValue){
						saprfc_table_init ($fce,$expValue);
					}
				}
				if (isset($sapImpTable)){
					foreach($sapImpTable->getArray() as $table => $tabValue){
						saprfc_table_init ($fce,$table);
						foreach ($tabValue->getArray() as $value){
							saprfc_table_append($fce, $table, $value);
						}
					}
				}
				$rfc_rc = saprfc_call_and_receive ($fce);
				if ($rfc_rc != SAPRFC_OK) {
					if ($rfc == SAPRFC_EXCEPTION )
						return "error: ".saprfc_exception($fce);
					else return "error: ".str_replace("\n","<br>",saprfc_error($fce));
				}
				$result = new server_util_Map();
				if (isset($sapExp)){
					if (gettype($sapExp) == "string"){
						$value = saprfc_export ($fce,$sapExp);
						if (gettype($value) == "array"){
							$tmp = new server_util_Map($value);
							$result->set($sapExp, $tmp);
						}else $result->set($sapExp, $value);
					}else foreach ($sapExp->getArray() as $value){
						$valtmp = saprfc_export ($fce,$value);
						if (gettype($valtmp) == "array"){
							$tmp = new server_util_Map($valtmp);
							$result->set($value, $tmp);
						}else $result->set($value, $valtmp);
					}
				}
				if (isset($sapExpTable)){
					foreach ($sapExpTable->getArray() as $expValue){
						$tmpExport = new server_util_arrayList();
						$rows = saprfc_table_rows ($fce,$expValue);
						$table = array();
						for ($i=1;$i<=$rows;$i++){
							$table[] = saprfc_table_read ($fce,$expValue,$i);
						}
						$result->set($expValue, $table);
					}
				}
				saprfc_function_free($fce);
				if ($keepRFC) $result->set("rfc",$rfc);
				if ($closeRfc) saprfc_close($rfc);
				return $result;
			}else return "error:RFC connection failed <br>". str_replace("\n","<br>",saprfc_error()) ;
		}catch(Exception $e){
			return "error:$sapFunc" . $e->getMessage(). "<br>". str_replace("\n","<br>",saprfc_error());
		}
	}
	function callRFCToFile($login, $sapFunc, $sapImp,  $sapExpTable = null, $sapImpTable = null, $sapExp = null, $file){
		try{
			unlink($file);
			if (!isset($rfc)) $rfc = $this->login($login->get("user"),$login->get("passwd"));
			if ($rfc){
				$fce = saprfc_function_discover($rfc,$sapFunc);
				if (! $fce ) { return "error:Discovering interface of function module failed($sapFunc))";  }
				foreach ($sapImp->getArray() as $impField => $impValue){
					saprfc_import ($fce,$impField,$impValue);
				}
				if (isset($sapExpTable)){
					foreach ($sapExpTable->getArray() as $expValue){
						saprfc_table_init ($fce,$expValue);
					}
				}
				if (isset($sapImpTable)){
					foreach($sapImpTable->getArray() as $table => $tabValue){
						saprfc_table_init ($fce,$table);
						foreach ($tabValue->getArray() as $value){
							saprfc_table_append($fce, $table, $value);
						}
					}
				}
				$rfc_rc = saprfc_call_and_receive ($fce);
				if ($rfc_rc != SAPRFC_OK) {
					if ($rfc == SAPRFC_EXCEPTION )
						return "error: ".saprfc_exception($fce);
					else return "error: ".str_replace("\n","<br>",saprfc_error($fce));
				}
				$result = new server_util_Map();
				if (isset($sapExp)){
					if (gettype($sapExp) == "string"){
						$value = saprfc_export ($fce,$sapExp);
						if (gettype($value) == "array"){
							$tmp = new server_util_Map($value);
							$result->set($sapExp, $tmp);
						}else $result->set($sapExp, $value);
					}else foreach ($sapExp->getArray() as $value){
						$valtmp = saprfc_export ($fce,$value);
						if (gettype($valtmp) == "array"){
							$tmp = new server_util_Map($valtmp);
							$result->set($value, $tmp);
						}else $result->set($value, $valtmp);
					}
				}
				if (isset($sapExpTable)){
					foreach ($sapExpTable->getArray() as $expValue){
						$rows = saprfc_table_rows ($fce,$expValue);
						$first = true;
						for ($i=1;$i<=$rows;$i++){
							$rowValue = saprfc_table_read ($fce,$expValue,$i);
							if ($first){
								$rowFile = "";
								foreach ($rowValue as $key => $val){
									if ($rowFile != "") $rowFile .= "\t";
									$rowFile .= $key;
								}
								$rowFile .="\r\n";
								file_put_contents($file, $rowFile, FILE_APPEND);
							}
							$rowFile = "";
							foreach ($rowValue as $key => $val){
								if ($rowFile != "") $rowFile .= "\t";
								$rowFile .= $val;
							}
							$rowFile .="\r\n";
							file_put_contents($file, $rowFile, FILE_APPEND);
							$first = false;
						}
					}
				}
				saprfc_function_free($fce);
				saprfc_close($rfc);
				return $file;
			}else return "error:RFC connection failed <br>". str_replace("\n","<br>",saprfc_error()) ;
		}catch(Exception $e){
			return "error:$sapFunc" . $e->getMessage(). "<br>". str_replace("\n","<br>",saprfc_error());
		}
	}
}
?>
