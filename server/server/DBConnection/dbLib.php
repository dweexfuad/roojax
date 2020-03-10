<?php 
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors locat
* 			SAI, PT											
* max current month :
* 		 MSSQL : DATEADD(s,-1,DATEADD(mm, DATEDIFF(m,0,GETDATE())+1,0))
* 		 Oracle : LAST_DAY()
***********************************************************************************************/
uses("server_DBConnection_connection");
uses("server_BasicObject");
uses("server_util_Map");
session_start();
global $ldaphost;
 $ldaphost = "";
class server_DBConnection_dbLib extends server_BasicObject
{
	var $db;
	public $connection;
	protected $options;
	function __construct($options = null, $autoConnect = true)
	{				
		parent::__construct();
		try{						
			$this->options = $options;		
			$this->autoConnect = $autoConnect;
			if ($autoConnect){				
				//$this->killAllConnection();			
			}
		}catch (Exception $e) {
			return $e->getMessage();
		}
	}		
	protected function doSerialize()
	{		
		parent::doSerialize();	
		$this->serialize("options", "string",$this->options);
		$this->serialize("autoConnect", "string",$this->autoConnect);		
		//$this->connect();
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	public function connect(){
		global $dbConnection;
		global $schema;
		global $dbdriver;		
		global $dbSetting;
		$dbConnection = new server_DBConnection_connection();			
		if ($this->options == null || $this->options == ""){
			$ret = $dbConnection->readFileConfig($dbSetting);
		}else {
			if (strpos("#",$this->options)){
				$config = explode("#",$this->options);
				foreach ($config as $key=>$value){
					$temp = explode(":",$value);
					if ($temp[0] == "host") $dbHost = $temp[1];	
					else if ($temp[0] == "driver") $dbdriver = $temp[1];
					else if ($temp[0] == "database") $dbName = $temp[1];
					else if ($temp[0] == "user") $dbUser = $temp[1];
					else if ($temp[0] == "pass") $dbPass = $temp[1];
				}			
				$ret = $dbConnection->connect($dbdriver, $dbHost, $dbName, $dbUser, $dbPass);
			}else{							
				$ret = $dbConnection->readFileConfig($this->options);					
			}			
		}
		if ($ret != "success"){			
			error_log($ret);
			return $ret;
		}
		
		$schema = $dbConnection->getDB();			
		$this->connection = $dbConnection;
		$this->db = $schema;		
		if ($dbdriver == "oci8"){
			//$this->db->Execute("ALTER SYSTEM set NLS_DATE_FORMAT = 'YYYY-MM-DD hh24: mi: ss' scope = both; ");			
			$this->db->Execute("ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD hh24: mi: ss' ");
		}				
		return $ret;
	}
//---------------------------------------	
	function replaceStr($findme, $replacewith, $subject) {		
     // Replaces $findme in $subject with $replacewith
     // Ignores the case and do keep the original capitalization by using $1 in $replacewith
     // Required: PHP 5
		 $rest = $subject;
		 $result = '';
		while (stripos($rest, $findme) !== false) {
			  $pos = stripos($rest, $findme);
			  // Remove the wanted string from $rest and append it to $result
			  $result .= substr($rest, 0, $pos);
			  $rest = substr($rest, $pos, strlen($rest)-$pos);
			  // Remove the wanted string from $rest and place it correctly into $result
			  $result .= str_replace('$1', substr($rest, 0, strlen($findme)), $replacewith);
			  $rest = substr($rest, strlen($findme), strlen($rest)-strlen($findme));
		}
		// After the last match, append the rest
		$result .= $rest;
		return $result;
	}
	function sqlConvertSqlSvr($sql) {
		$sql = str_replace("now()", "getdate()", $sql);
		$sql = str_replace("date_format(", "convert(varchar,", $sql);
		$sql = str_replace("to_char(sysdate,'yyyymm')", "left(convert(varchar,getdate(),112),6)", $sql);
		$sql = str_replace("to_char(", "convert(varchar,", $sql);
		$sql = str_replace("'%d/%m/%Y')", "103)", $sql);
		$sql = str_replace("'%d-%m-%Y')", "103)", $sql);
		$sql = str_replace("'%e %M %Y')", "106)", $sql);
		if (strpos($sql,"datediff(day") == false) $sql = str_replace("datediff(", "datediff(day,", $sql);
		$sql = str_replace("ifnull", "isnull", $sql);		
		$sql = str_replace("nvl", "isnull", $sql);		
		$sql = str_replace("NVL", "isnull", $sql);		
		$pos = strpos($sql, "call ");		
		if ( gettype($pos) != "boolean" && $pos == 0){
			$sql = str_replace("call ", "exec ", $sql);						
			$pos = strpos($sql, "(");
			$sqlTmp = substr($sql, 0, $pos - 1);
			$sqlTmp2 = substr($sql, $pos +1);
			$sqlTmp2 = substr($sqlTmp2, 0, strrpos($sqlTmp2, ")"));
			$sql = $sqlTmp . $sqlTmp2;
		}
		$sql = str_replace("fn_", "dbo.fn_", $sql);
		$sql = str_replace("left_pad", "dbo.left_pad", $sql);
		$pos = strpos($sql, "concat");		
		if ( gettype($pos) != "boolean" ){
			$temp = explode("concat",strtolower($sql));
			$sqlTemp = "";
			foreach ($temp as $key => $value){
				if ($key == 0) {
					$sqlTemp .= $value;
					continue;
				}							
				$pos = strpos($value,")");
				$temp1 = substr($value, 0, $pos+1);
				$_conc = str_replace(",","+",$temp1);							
				$temp2 = substr($value, $pos+1);
				$sqlTemp .= $_conc . $temp2;				
			}
			$sql = $sqlTemp;
		}
		return $sql;
	}
	function sqlConvertOra($sql) {	
		$dbuser = $this->connection->user;
		$pos = strpos($sql, "'to_date");		
		if ( gettype($pos) != "boolean" ){
			$sql = str_replace("'to_date", "to_date", $sql);						
			$sql = str_replace("'yyyy/mm/dd')'", "'yyyy/mm/dd')", $sql);									
		}
		$pos = strpos($sql, "'dd/mm/yyyy')'");		
		if ( gettype($pos) != "boolean" ){			
			$sql = str_replace("'dd/mm/yyyy')'", "'dd/mm/yyyy')", $sql);									
		}		
		$sql = str_replace("now()", "SYSDATE", $sql);
		$sql = str_replace("NOW()", "SYSDATE", $sql);
		$sql = str_replace("substring", "SUBSTR", $sql);
		$sql = str_replace("SUBSTRING", "SUBSTR", $sql);
		//$sql = str_replace("1900-01-01", "01-JAN-1900", $sql);
		$sql = str_replace("date_format","to_char",$sql);
		$sql = str_replace("'%d/%m/%Y')", "'dd/mm/YYYY')", $sql);
		$sql = str_replace("'%d-%m-%Y')", "'dd-mm-YYYY')", $sql);
		$sql = str_replace("'%e %M %Y')", "'DD FMMonth YYY')", $sql);		
		$sql = str_replace("ifnull", "NVL", $sql);				
		$sql = str_replace("isnull", "NVL", $sql);				
		$sql = str_replace("call ", "execute ", $sql);
		$sql = str_replace("fn_", $dbuser.".fn_", $sql);
		$pos = strpos(strtolower($sql), "concat(");		
		if ( gettype($pos) != "boolean" ){
			$sql = str_replace("CONCAT", "concat", $sql);
			$temp = explode("concat",$sql);
			$sqlTemp = "";
			foreach ($temp as $key => $value){
				if ($key == 0) {
					$sqlTemp .= $value;
					continue;
				}							
				$pos = strpos($value,")");
				$temp1 = substr($value, 0, $pos+1);
				$_conc = explode(",",$temp1);				
				$_concate = "CONCAT";
				$_concatAll = "";
				$first = true;
				foreach ($_conc as $i => $val){		
					if ($i > 1){
						$_concate .= ")";						
						$_concate = "CONCAT(" . $_concate ; 
					}
					if (!$first) $_concate .= ",";
					$_concate .= $val;
					$first = false;										
				}
				$temp2 = substr($value, $pos+1);
				$sqlTemp .= $_concate . $temp2;				
			}
			$sql = $sqlTemp;			
		}						
		return $sql;
	}
	function runQuery($sql)
	{	
		try
		{	
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);							
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				$model = new server_DBConnection_dataModel();
				$result = $model->listData($rs);				
				//$this->db->Close();
				return $result;
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
		}catch(Exception $e)
		{
			//$this->db->Close();
			error_log($e->getMessage());
		}
	}
	function runSQL($sql)
	{	
		try
		{	
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);			
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->Execute($sql);
			if ($rs)
			{			
				$model = new server_DBConnection_dataModel();
				$result = $model->listDataObj($rs);	
				//$this->db->Close();
				return $result;			
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();				
			}
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}	
	function isSelectSQL($sql){
		$sql = trim($sql);
		$pos = strpos(strtolower($sql),"delete ");
		if (!is_bool($pos)) return false;
		$pos = strpos(strtolower($sql),"drop ");
		if (!is_bool($pos)) return false;
		$pos = strpos(strtolower($sql),"update ");
		if (!is_bool($pos)) return false;
		$pos = strpos(strtolower($sql),"alter ");
		if (!is_bool($pos)) return false;
		return true;
	}
	function isDropSQL($sql){
		$sql = trim($sql);
		$pos = strpos(strtolower($sql),"drop ");
		if (!is_bool($pos) && $pos <= 5 ) return false;
		$pos = strpos(strtolower($sql),"alter ");
		if (!is_bool($pos) && $pos <= 5) return false;
		return true;
	}
	function getDataProvider($sql)
	{	
		try
		{	
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;					
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);						
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {	
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){												
				$sql = $this->sqlConvertOra($sql);																		
			}			
			$rs = $this->db->Execute($sql);
			if ($rs)
			{	
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProvider($rs);	
				//$this->db->Close();
				$result = str_replace("\r\n","<br>",$result);
				$result = str_replace("\n","<br>",$result);				
				$result = str_replace("\r","",$result);
				//error_log($result);
				return $result;			
			}else {
				//$this->db->Close();
				error_log($this->db->ErrorMsg() ."\r\n".$sql);
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			error_log($e->getMessage()."\r\n".$sql);
			return $e->getMessage();			
		}
	}
	function getDataProviderKeyMap($sql, $keyField)
	{	
		try
		{	
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;					
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);						
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {	
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){												
				$sql = $this->sqlConvertOra($sql);																		
			}
			
			$rs = $this->db->Execute($sql);
			if ($rs)
			{	
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProviderKeyMap($rs, $keyField);	
				//$this->db->Close();
				$result = str_replace("\r\n","<br>",$result);
				$result = str_replace("\n","<br>",$result);				
				$result = str_replace("\r","",$result);
				//error_log($result);
				return $result;			
			}else {
				//$this->db->Close();
				error_log($this->db->ErrorMsg() ."\r\n".$sql);
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			error_log($e->getMessage()."\r\n".$sql);
			return $e->getMessage();			
		}
	}
	function getDataProviderDirect($sql)
	{	
		try
		{	
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);				
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->Execute($sql);
			if ($rs)
			{			
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProviderDirect($rs);	
				//$this->db->Close();				
				return $result;			
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function getMultiDataProviderDirect($sql)
	{	
		try
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");	
			$Allresult = "{\"result\": [";
			$dbdriver = $this->connection->driver;			
			foreach($sql->getArray() as $key=> $value)
			{
				if (!$this->isSelectSQL($value)) return "Error SQL:".$value;				
				if ($key > 0) $Allresult .= ",";
				if (!strpos($value,'date_format') && $dbdriver != "oci8")
					$value = strtolower($value);			
				if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
					$value = $this->sqlConvertSqlSvr($value);
				}else if ($dbdriver == "oci8"){					
					$value = $this->sqlConvertOra($value);					
				}
				
				$rs = $this->db->Execute($value);
				if ($rs){
					$model = new server_DBConnection_dataModel();
					$result = $model->getDataProviderDirect($rs);														
				}else {
					//$this->db->Close();
					throw new Exception("Error::".$this->db->ErrorMsg() . "\r\n" . $value);
				}				
				$Allresult .= $result;
			}			
			$Allresult .= "]}";			
			return $Allresult;			
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function getMultiDataProvider($sql)
	{	
		try
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");	
			$Allresult = "{\"result\": [";
			$dbdriver = $this->connection->driver;
			foreach($sql->getArray() as $key=> $value)
			{				
				if (!$this->isSelectSQL($value)) return "Error SQL:". $value;
				if ($key > 0) $Allresult .= ",";
				if (!strpos($value,'date_format') && $dbdriver != "oci8")
					$value = strtolower($value);			
				if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
					$value = $this->sqlConvertSqlSvr($value);
				}else if ($dbdriver == "oci8"){					
					$value = $this->sqlConvertOra($value);				
				}				
				$rs = $this->db->Execute($value);
				if ($rs){
					$model = new server_DBConnection_dataModel();
					$result = $model->getDataProvider($rs);														
				}else {
					//$this->db->Close();
					error_log("Error::".$this->db->ErrorMsg() . "\r\n" . $value);
					throw new Exception("Error::".$this->db->ErrorMsg() . "\r\n" . $value);
				}				
				$result = str_replace("\r\n","<br>",$result);
				$result = str_replace("\n","<br>",$result);
				$result = str_replace("\r","",$result);
				$Allresult .= $result;
			}						
			$Allresult .= "]}";		
				
			return $Allresult;			
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage() ."<br>".$value;			
		}
	}
	function createXML(&$xmlDoc,$name, $data){
		$newNode = new server_xml_Node();
		$newNode->name = $name;
		$newNode->type = "tag";
		$newNode->attributes = $data;		
		$newNode->xmlStr = "";
		foreach ($data As $key => $value) //access root /node		
			$newNode->xmlStr .= "<$key>$value</$key>";				
		if (!isset($xmlDoc->rootNode)){		
			$xmlDoc->rootNode = new server_xml_Node();
			$xmlDoc->rootNode->name = "root";
			$xmlDoc->rootNode->type = "tag";
			$xmlDoc->rootNode->attributes = array();		
			$xmlDoc->rootNode->xmlStr = "";
			$xmlDoc->rootNode->childNodes = array();
			$newNode->parent = $xmlDoc->rootNode;				
			$xmlDoc->nowNode = $newNode;						
			$xmlDoc->rootNode->childNodes[count($xmlDoc->rootNode->childNodes)] = $newNode; 				
		}else if ($xmlDoc->nowNode->attributes["level_menu"] == ($data["level_menu"] - 1)){		
			$newNode->parent = $xmlDoc->nowNode;		
			$xmlDoc->nowNode->childNodes[count($xmlDoc->nowNode->childNodes)] = $newNode; 				
		}else if ($xmlDoc->nowNode->attributes["level_menu"] == $data["level_menu"]){			
			$newNode->parent = $xmlDoc->nowNode->parent;		
			$xmlDoc->nowNode->parent->childNodes[count($xmlDoc->nowNode->parent->childNodes)] = $newNode; 
		}else if ($xmlDoc->nowNode->attributes["level_menu"] > $data["level_menu"]){
			$node = $xmlDoc->nowNode->parent;
			while ($node->attributes["level_menu"] > $data["level_menu"]){
				$node = $node->parent;
			}
			$newNode->parent = $node->parent;		
			$newNode->parent->childNodes[count($newNode->parent->childNodes)] = $newNode; 
		}	
		$xmlDoc->nowNode = $newNode;
	}
	function getDataXML($sql)
	{	uses("server_xml_Doc");
        uses("server_xml_Node");
		try		
		{	

			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}			

			$resultSet = $this->db->Execute($sql);
			
			if ($resultSet)
			{			
				$first = true;
				$xml = new server_xml_Doc();												
				$row = 0;
				while (!$resultSet->EOF){							
					$values = "";
					$xmlItem = array();
					for ($i = 0; $i < $resultSet->FieldCount(); $i++){
						$value =  $resultSet->fields[$i];
						$values .= ";" . $value;
						$name = strtolower( $resultSet->FetchField($i)->name );
						$xmlItem[$name] = $value;
					}		
					$resultSet->MoveNext();
					$this->createXML($xml, "row$row",$xmlItem);													
					$row++;
				}				
				$resultSet->close();
				$xmlStr = xmlText($xml->rootNode);	
				//$this->db->Close();								

				return $xmlStr;				
			}else {
				//$this->db->Close();				
				return "Error::".$this->db->ErrorMsg();
			}
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function getDataProviderPage($sql,$page, $rowPerPage)
	{	
		try
		{				
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			$start = -1;	  
			if ($page > 0)
			{		
				$start = (($page-1) * $rowPerPage);							
			}else $rowPerPage = -1;
			uses("server_DBConnection_dataModel");		
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);				
			}
			$rs = $this->db->SelectLimit($sql, $rowPerPage, $start);
			if ($rs)
			{			
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProvider($rs);	
				//$this->db->Close();
				$result = str_replace("\r\n","<br>",$result);
				$result = str_replace("\n","<br>",$result);
				$result = str_replace("\r","",$result);
				return $result;			
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function getDataProviderPageDirect($sql,$page, $rowPerPage)
	{	
		try
		{	
			if (!$this->isSelectSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			$start = -1;	  
			if ($page > 0)
			{		
				$start = (($page-1) * $rowPerPage);							
			}else $rowPerPage = -1;
			uses("server_DBConnection_dataModel");		
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);						
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->SelectLimit($sql, $rowPerPage, $start);
			if ($rs)
			{			
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProviderDirect($rs);	
				//$this->db->Close();
				return $result;			
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function execSQL($sql, $rowPerPage = null, $start = null){		
		try
		{			
			if ($this->isDropSQL($sql)) return "Error SQL:".$sql;
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			if (($rowPerPage == null) && ($start == null)) 
				$rs = $this->execute($sql);
			else 
				$rs = $this->LimitQuery($sql,$rowPerPage,$start );
			
			if ($rs){
				uses("server_DBConnection_dataModel");		
				$model = new server_DBConnection_dataModel();
				//$this->db->Close();
				return  $model->listDataStruc($rs);		
			}else 
				throw new Exception($this->db->ErrorMsg() . "\r\n");
			return $ret;
		}catch(Exception $e)
		{
			//$this->db->Close();
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function getRowCount($sql, $rowPerPage)
	{
		try{
			if (!$this->isSelectSQL($sql)) return "Error SQL:$sql";
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
					$sql = strtolower($sql);					
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				$result = $rs->fields[0];			
				$result = ceil($result  / $rowPerPage); 
				$rs->close();
				//$this->db->Close();
				return $result;
			}else return "Error::".$this->db->ErrorMsg();
		}catch(Exception $e){
			error_log("error ". $e->getMessage());
			return "Error::". $e->getMessage();
		}
	}
	function execQuery($sql)
	{
		try{
			if (!$this->isDropSQL($sql)) return "Error SQL:$sql";
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ((!strpos($sql,'date_format') && $dbdriver != "oci8") && strpos($sql,'select'))
				$sql = strtolower($sql);
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				//$this->db->Close();
				return "success execute";			
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			error_log($e->getMessage()."\r\n".$sql);
			return "Error :" . $e->getMessage();
		}
	}
	function updateBlob($table, $col, $value, $id)
	{
		try{					
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$rs = $this->db->UpdateBlob($table, $col, $value, $id);
			if ($rs)
			{	
				error_log("sukses " . $table . $col . $value . $id);
				//$this->db->Close();
				return "success execute";			
			}else{ 
				//$this->db->Close();
				error_log($this->db->ErrorMsg());
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function updateClob($table, $field, $value, $id)
	{
		try{					
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$rs = $this->db->UpdateClob($table, $field, $value, $id);
			if ($rs)
			{	
				error_log("sukses " . $table . $field . $value . $id);
				//$this->db->Close();
				return "success execute";			
			}else{ 
				//$this->db->Close();
				error_log($this->db->ErrorMsg());
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function BlobDecode($blob)
	{
		try{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$sql = strtolower($sql);			
			$data = $this->db->BlobDecode($blob);
			return $data;			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function execute($sql, $param = null)
	{
		try
		{
			if (!$this->isDropSQL($sql)) return "Error SQL:$sql";	
			$ret = $this->connect();						
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->Execute($sql, $param);
			if ($rs)
			{				
				return $rs;			
			}else {
				echo "Error::".$this->db->ErrorMsg() . "\r\n" . $sql ."\n";
				error_log("Error::".$this->db->ErrorMsg() . "\r\n" . $sql);    
                return "Error::".$this->db->ErrorMsg();
			}
		}catch(Exception $e)		
		{
			echo $e->getMessage();
			return "Error :" . $e->getMessage();
		}
	}
	function LimitQuery($sql, $ncounts, $offset)
	{
		try
		{
			if (!$this->isSelectSQL($sql)) return "Error SQL:$sql";
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->SelectLimit($sql, $ncounts, $offset);
			if ($rs)
			{
				return $rs;			
			}else throw new Exception($this->db->ErrorMsg());
			
		}catch(Exception $e)
		{
			error_log("Error::".$this->db->ErrorMsg() . "\r\n" . $sql);    
			return "Error :" . $e->getMessage();
		}
	}
	function execArraySQL($sql)
	{
		try
		{						
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$this->db->BeginTrans();			
			$dbdriver = $this->connection->driver;
			$file = new server_util_arrayList();
			foreach($sql->getArray() as $key=> $value)
			{	
				if ($value instanceof server_util_Map){
					//error_log($value->get("table").":".$value->get("field").":".$value->get("value").":".$value->get("filter"));
					if ($value->get("tipe") == "clob")
						$ok = $this->db->updateClob($value->get("table"), $value->get("field"), $value->get("value"), $value->get("filter") );	
					else if ($value->get("tipe") == "blob")
						$ok = $this->db->updateBlob($value->get("table"), $value->get("field"), $value->get("value"), $value->get("filter") );	
					else if ($value->get("tipe") == "file"){
						$content = file_get_contents($value->get("filename"));
						$ok = $this->db->updateBlob($value->get("table"), $value->get("field"), $content, $value->get("filter") );	
						$file->add($value->get("filename"));
					}else if ($value->get("tipe") == "param"){
						//error_log($key .". ".$value->get("sql"));
						$ok = $this->db->Execute($value->get("sql"), $value->get("value"));
						//error_log($key .".". json_encode( $value->get("value")) );
					}
				}else if (is_array($value)){
					$ok = $this->db->Execute($value[0], $value[1]);
				}else {						
					if (!$this->isDropSQL($value)) {
						//error_log("Drop SQL $sql");
						return "Error SQL:$value";
					}
					//$value = strtolower($value);
					if ($dbdriver == "ado_mssvql" || $dbdriver == "odbc_mssql") {
						$value = $this->sqlConvertSqlSvr($value);
					}else if ($dbdriver == "oci8"){
						//error_log("convert SQL $value");
						$value = $this->sqlConvertOra($value);
						//error_log("convert SQL $sql");
						
					}
					$ok = $this->db->Execute($value);											
				}
				if (!$ok) 
				{	
//					$this->db->FailTrans();					
					//$this->db->Close();					
					if ($value instanceof server_util_Map){
						error_log(print_r($value->getArray(), true));
						throw new Exception($this->db->ErrorMsg() . "\r\n" .$value->get("id"));
					}else if (is_array($value) ){
						error_log(print_r($value, true));
						
						throw new Exception($this->db->ErrorMsg() . "\r\n" . print_r($value, true) );
					}else {
						error_log($value);
						throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
					}
				}
			}
			$this->db->CommitTrans();
			//$this->db->Close();
			foreach ($file->getArray() as $value){
				unlink($value);
			}
			return "process completed";
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			$this->db->RollbackTrans();			
//			error_log("error " . $e->getMessage());
//			write($e->getMessage() . NEW_LINE);
			
			return " error " .  $e->getMessage();
		}
	}
	function beginTrans()
	{
		$this->db->StartTrans();
	}
	function completeTrans()
	{
		$this->db->CompleteTrans();
	}
	function checkTrans()
	{
		if (!CheckRecords) $this->db->FailTrans();
	}
	function insertData($tableName, $fields, $values)		
	{
		//$fields = string = field1, field2, field3, ...
		//$values = array () 
		try
		{		
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$sql = "insert into " . $tableName . "(" . $fields .") values " ;
			$data = "";		
			$valuesArray = $values->getArray();
			foreach ($valuesArray as $key => $value)
			{
				$data .= ",'" . $value ."'";
			}
			$data = substr($data,1);
			$data = "($data)";
			$sql .= $data;					
			$sql = strtolower($sql);
			$this->db->Execute($sql);	
			//$this->db->Close();
			return "insert data success";
		}catch(Exception $e)
		{
			return "Error : ".$e->getMessage();
		}			
	}
	function insertDataString($tableName, $fields, $values)
	{

		$sql = "insert into " . $tableName . "(" . $fields .") values " . $values ;
		try
		{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			//$this->db->Close();
			return "Success insert data";
			
		}catch(Exception $e)
		{
			return "Error : ". $e->getMessage();
		}
	}
	function isLock(){
		
	}
	function locateData($tableName, $keyField, $keyValues, $return, $allFields = null)
	{
		try	
		{	
			
			
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($allFields)
				$sql = "select * from " . $tableName . " where ";
			else
				$sql = "select " . $return . " from " . $tableName . " where ";
					
			if (count($keyField) != count($keyValues))		
				return "";			
			$filter = "";	
			$keyObj = $keyField->getArray();
			$valObj = $keyValues->getArray();
			$count = count($keyObj);
			$count--;
			foreach ($keyObj as $key => $value)
			{				
				/*if ($tableName == "m_form" && (substr($valObj[$key],strlen($valObj[$key])-1) == "I" || substr($valObj[$key],strlen($valObj[$key])-1) == "K")) {
				
					$rs = $this->db->Execute("select flag from spro where lower(kode_spro)= 'veatstatus'");
					if ($row = $rs->FetchNextObject(false)){
						if ($row->flag == "1"){
							return null;
						}
					}
				}*/
				if ($key < $count)
					$filter .= $value . " = '" . $valObj[$key] ."' and "; 
				else $filter .= $value . " = '" . $valObj[$key] ."' ";  				
			}
			$sql .= $filter;			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}				
			//$sql .= " limit 1"; 
			$result = "";
			if ($dbdriver != "oci8") $sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			if ($allFields)
			{
				for ($i = 0; $i < $rs->FieldCount(); $i++)
				{
					$value =  $rs->fields[$i];
					$result .= ";" . $value;
				}				
				$result = substr($result,1);	
			}else
				$result = $rs->fields[0];
			//$this->db->Close();	
			return $result;
		}catch(Exception $e)
		{
			//$this->db->Close();
			return "Error : " . $e->getMessage();
		}
	}
	function locateAndEditData($tableName, $keyField, $keyValues, $fields, $values)
	{
		try	
		{	
			$sql = "update $tableName set ";
			
			if (count($keyField) != count($keyValues))		
				return "";
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);	
			$filter = "";	
			$keyObj = $keyField->getArray();
			$valObj = $keyValues->getArray();
			$count = count($keyObj);
			$count--;
			foreach ($keyObj as $key => $value)
			{
				if ($key < $count)
					$filter .= $value . " = '" . $valObj[$key] ."' and "; 
				else $filter .= $value . " = '" . $valObj[$key] ."' ";  
			}
			$filter = " where " . $filter;
			$update = "";
			$keyObj = $fields->getArray();
			$valObj = $values->getArray();
			$count = count($keyObj);
			$count--;
			foreach ($keyObj as $key => $value)
			{
				if ($key < $count)
					$update .= $value . " = '" . $valObj[$key] ."' , "; 
				else $update .= $value . " = '" . $valObj[$key] ."' ";  
			}
			$sql .= $update;
			$sql .= $filter;
			//$sql .= " limit 1"; 
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);

			$result = $rs->fields[0];
			//$this->db->Close();
			return "edit data success (" . $result .")";
		}catch(Exception $e)
		{
			//$this->db->Close();
			return "Error : " . $e->getMessage();
		}
	}
	function locateAndDeleteData($tableName, $keyField, $keyValues)
	{
		try	
		{	
			$sql = "delete from " . $tableName . " where ";
			
			if (count($keyField) != count($keyValues))		
				return "";
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);	
			$filter = "";	
			$keyObj = $keyField->getArray();
			$valObj = $keyValues->getArray();
			$count = count($keyObj);
			$count--;
			foreach ($keyObj as $key => $value)
			{
				if ($key < $count)
					$filter .= $value . " = '" . $valObj[$key] ."' and "; 
				else $filter .= $value . " = '" . $valObj[$key] ."' ";  
			}
			$sql .= $filter;
			//$sql .= " limit 1"; 
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			//$this->db->Close();
			return "Delete data success ";
		}catch(Exception $e)
		{
			//$this->db->Close();
			return "Error : " . $e->getMessage();
		}
	}
	function listData($sql, $page, $rowPerPage)
	{
	    try{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
					$sql = strtolower($sql);		
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$sqlA = $sql; 
			$start = -1;	  
			if ($page > 0)
			{		
				$start = (($page-1) * $rowPerPage);
				$end = $page * $rowPerPage;
				//$sql .= " limit ". $start . "," . $rowPerPage;
			}else $rowPerPage = -1;
			//if ($start == 0) $start = 0;
			uses("server_DBConnection_dataModel");		
  			//$this->connection->connect();	
  			$this->db->setFetchMode(ADODB_FETCH_NUM);
  			$rs = $this->db->SelectLimit($sqlA, $rowPerPage,$start);      
			$result = null;
			if ($rs && !$rs->EOF) 
			{
					$model = new server_DBConnection_dataModel();
					$result = $model->listData($rs);
			}		
		//$this->db->Close();
  			return $result;
  		}catch(Exception $e)
  		{
			//$this->db->Close();
  		  return "ERROR ->" .$e;
      }
  		
			
	//	error_log($sql);
		//return $this->runQuery($sql);						
	}
	function listDataObj($sql, $page = 0, $rowPerPage = 15)
	{
		try{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
					$sql = strtolower($sql);								
			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$sqlA = $sql; 
			$start = -1;	  
			if ($page > 0)
			{		
				$start = (($page-1) * $rowPerPage);
				$end = $page * $rowPerPage;
				//$sql .= " limit ". $start . "," . $rowPerPage;
			}else $rowPerPage = -1;
			uses("server_DBConnection_dataModel");		  		
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			$rs = $this->db->SelectLimit($sqlA, $rowPerPage,$start);      	        
			if ($rs) 
			{
					$model = new server_DBConnection_dataModel();
					$result = $model->listDataObj($rs);
					
			}else $result = "Error::".$this->db->ErrorMsg();		
			//$this->db->Close();
			return $result;
  		}catch(Exception $e)
  		{
  		  return "ERROR ->" .$e;
		}
	}
//------------------------------------------------- add on 	
	function listDataAkun($sql, $page, $rowPerPage)
	{
		if ($page > 0)
		{
			$start = (($page-1) * $rowPerPage)  + 1;
			$end = $page * $rowPerPage;
			$sql .= " limit ". $start . "," . $end;
		}
		$sql = strtolower($sql);
		return $this->runQuery($sql);			
	}
	function listDataPP($sql, $page, $rowPerPage)
	{
		if ($page > 0)
		{
			$start = (($page-1) * $rowPerPage)  + 1;
			$end = $page * $rowPerPage;
			$sql .= " limit ". $start . "," . $end;
		}
		$sql = strtolower($sql);
		return $this->runQuery($sql);					
	}
	function listDataKaryawan($sql, $page, $rowPerPage)
	{
		if ($page > 0)
		{
			$start = (($page-1) * $rowPerPage)  + 1;
			$end = $page * $rowPerPage;
			$sql .= " limit ". $start . "," . $end;
		}
		$sql = strtolower($sql);
		return $this->runQuery($sql);					
	}
	function getPeriode($lokasi = null)
	{
		try	
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			if ($lokasi == null) $lokasi = "%";
			$sql = "select max(periode) as periode from periode where kode_lokasi like '". $lokasi ."' ";						
			$rs = $this->db->Execute($sql);
			if ($rs)
			{			
				$result = $rs->fields[0];			
			}else $result = "Error::"+$this->db->ErrorMsg();
			//$this->db->Close();
			return $result;
		}catch(Exception $e)
		{
			//$this->db->Close();
			return "Error :" . $e->getMessage();
		}
	}
	function getPP($user,$lokasi = null)
	{
		try	
		{						
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			if ($lokasi == null) $lokasi = '%';
			if ($this->connection->driver == "mysqlt")
				$sql = "select concat(a.kode_pp,';',b.nama) as k from karyawan a inner join pp b on b.kode_pp = a.kode_pp and a.kode_lokasi = b.kode_lokasi where a.nik = '" . $user . "' and a.kode_lokasi = '".$lokasi."' ";			
			else
				$sql = "select a.kode_pp+';'+b.nama as k from karyawan a inner join pp b on b.kode_pp = a.kode_pp and a.kode_lokasi = b.kode_lokasi where a.nik = '" . $user . "' and a.kode_lokasi = '".$lokasi."'";			
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			$result = $rs->fields[0];
			//$this->db->Close();
			return $result;
		}catch(Exception $e)
		{
			//$this->db->Close();
			return "Error :" . $e->getMessage();
		}
	}
	function getLokasi($user)
	{
		try	
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$sql = "select kode_lokasi from hakakses where nik = '" . $user . "'";			
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			$result = $rs->fields[0];
			//$this->db->Close();
			return $result;
		}catch(Exception $e)
		{
			//$this->db->Close();
			return "Error :" . $e->getMessage();
		}
	}
	function getAllPeriode() //$lokasi = null
	{		
		//if ($lokasi == null) $lokasi = '%';
		return $this->runQuery("select distinct periode from periode order by periode");//where kode_lokasi = '". $lokasi ."' order by periode");
	}
	function getAllPeriodeLok($lokasi)
	{		
		//if ($lokasi == null) $lokasi = '%';	
		return $this->runQuery("select distinct periode from periode where kode_lokasi = '". $lokasi ."' order by periode");
	}
	function getDBName(){		
		return $this->connection->getDBName();
	}
	function getDBHost(){
		return $this->connection->getDBHost();
	}
	function getDatabaseInfo(){
		$dbdriver = $this->connection->driver;
		$dbHost = $this->connection->dbHost;
		$dbName = $this->connection->database;
		return "{\"driver\":\"$dbdriver\", \"host\":\"$dbHost\",\"name\":\"$dbName\"}";
	}
	function getAllTables(){
		try{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$res = $this->db->MetaTables("TABLES",false);
			$ret = "";
			for ($i=0; $i < sizeof($res); $i++)
			{
				$ret .= "," .$res[$i];
			}				
			$ret = substr($ret,1);
			return $ret;
		}catch(Exception $e){
			return "error ". $e->getMessage();
		}
	}
	function getColumnOfTable($table){
		$res = $this->db->MetaColumnNames($table,false);
		$ret = "";
		foreach ($res as $key =>$value)
		{
			$ret .= "," .$value;
		}				
		$ret = substr($ret,1);
		return $ret;
	}
	function updateEngine(){
		try
		{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$tabel = $this->db->MetaTables("TABLES",false);
			for ($i = 0; $i <= count($tabel); $i++) 
			{
			    $rs = $this->db->Execute("ALTER TABLE `$tabel[$i]`  ENGINE = InnoDB");
				if (!$rs) 
				{	
					//$this->db->Close();
					error_log($tabel[$i]);
					throw new Exception($this->db->ErrorMsg() . "\r\n" .$tabel[$i]);
				}				
			}
			//$this->db->Close();
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return "error " .  $e->getMessage();
		}
	
	}
	function bufferTable($table){		
		$rs = $this->execute("select * from " . $table);
		if ($rs){
			uses("server_DBConnection_dataModel");		
			$model = new server_DBConnection_dataModel();
			return  $model->listDataStruc($rs);		
		}else $ret = $this->db->ErrorMsg();
		//$this->db->Close();
		return $ret;
	}
	function addUserLog($uid, $hostname, $userlok, $ip)
	{
		try
		{	
		    $ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$this->db->BeginTrans();
			$ses = md5(date("r"));
			$sql = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid ."', '". $userlok."', now(), '". $ses."','1900-01-01','". $hostname."','". $ip."' )";			
			$dbdriver = $this->connection->driver;			
			
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = "insert into userlog(\"UID\", userloc, \"TIMEIN\", \"SESSION\", \"TIMEOUT\", \"HOST\", ip)values('" . $uid ."', '". $userlok."', sysdate, '". $ses."','1900-01-01','". $hostname."','". $ip."' )";						
			}
			$ok = $this->db->Execute($sql);			
			if (!$ok) 
			{	
				//$this->db->Close();
				error_log($sql);
				throw new Exception($this->db->ErrorMsg() . "\r\n" .$sql);
			}
			$this->db->CommitTrans();
			//$this->db->Close();
			return $ses;
		}catch(Exception $e)
		{
			$this->db->RollbackTrans();
			error_log($e->getMessage());
			return "error " .  $e->getMessage();
		}
	}
	function logout($sesId)
	{
		try
		{	
			//error_log("logout ".$sesId);
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$this->db->BeginTrans();			
			if ($this->connection->driver == "mysqlt")
				$value = "update userlog set timeout = now() where session = '". $sesId ."'";
			else if ($this->connection->driver == "oci8")
				$value = "update userlog set \"TIMEOUT\" = sysdate where \"SESSION\" = '". $sesId ."'";
			else $value = "update userlog set timeout = getdate() where session = '". $sesId ."'";			
			$ok = $this->db->Execute($value);			
			if (!$ok) 			
			{	
				//$this->db->Close();
				error_log($value);
				throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
			}
			$this->db->CommitTrans();
			//$this->db->Close();
			return $ret;
		}catch(Exception $e)
		{
			$this->db->RollbackTrans();
			error_log($e->getMessage());
			return "error " .  $e->getMessage();
		}
	}
	function addUserFormAccess($uid, $form, $userlok, $sesId)
	{
		try
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$this->db->BeginTrans();			
			if ($this->connection->driver != "oci8")
				$sql = "insert into userformacces(uid, userloc, timeacc, session, form)values('" . $uid ."', '". $userlok."', now(), '". $sesId."','". $form."' )";
			else $sql = "insert into userformacces(\"ID\",\"UID\", \"USERLOC\", \"TIMEACC\", \"SESSION\", \"FORM\")values(0,'" . $uid ."', '". $userlok."', sysdate, '". $sesId."','". $form."' )";
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$ok = $this->db->Execute($sql);			
			if (!$ok) 
			{	
				//$this->db->Close();				
				throw new Exception($this->db->ErrorMsg() . "\r\n" .$sql);
			}
			$this->db->CommitTrans();
			//$this->db->Close();
			return $ses;
		}catch(Exception $e)
		{
			$this->db->RollbackTrans();
			error_log($e->getMessage());
			return "error " .  $e->getMessage();
		}
	}
	function sqlToHtml($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null, $summaryField = null, $groupHeader = null, $calFields = null, $groupTotal = null)
	{
		try{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$pg= $page;
			$pgtmp = $page;
			if ($rowPerPage > 500){												
				$pgtmp = ceil($rowPerPage / 500);				
				$pg = ($page - 1) * $pgtmp + 1;
				$pgtmp = $pg + ($pgtmp -1);
				$rowPerPage = 500;
				
			}
			$width = $width->getArray();
			$widthTable = 0;
			foreach ($title->getArray() as $key => $value) $widthTable += floatval( $width[$key] );		
			$html = "<table border='1' cellspacing='0' cellpadding='0' class='kotak' width='$widthTable'>".
							"<tr bgcolor='#cccccc'>".
							"<td class='header_laporan' align='center' width=25>No</td>";						
			foreach ($title->getArray() as $key => $value)
				$html  .= "<td class='header_laporan' align='center' width='".$width[$key]."pt'>" . $value . "</td>";				
			$fieldsType = $fieldType-> getArray();
			if (isset($calFields)){
				$tmp = $calFields->getArray();
				$calFields = array();
				foreach ($tmp as $key => $value){
					$field = explode(";", $value);						
					$calFields[$field[0]] = $field[1];
				}
			}
			
			$html  .= "</tr>";				
			if ($withTotal){
				$total = array();
				foreach ($title->getArray() as $key => $value)
					$total[$key] = "0";
			}
			if ($groupBy){
				$totalGroup = array();//penampung subtotal
				$fieldGroup = array();//penampung kode 
				$changeFieldStatus = array();
				$groupArray = $groupBy->getArray();
				foreach($groupArray as $key =>$value){
					$totalGroup[$value] = array();
					$fieldGroup[$value] = "";
					$changeFieldStatus[$value] = false;
				}
			}	
			if ($groupHeader) {
				$groupTmp = array();
				foreach($groupHeader->getArray() as $key => $value) {
					$groupTmp[$value] = $value;
				}
				$groupHeader = $groupTmp;
			}
			if ($summaryField != null)
					$summ = $summaryField->getArray();
			$firstRow = true;
			$allChange = false;
			$cetak = false;
										
			for ($page = $pg; $page <= $pgtmp; $page++)
			{				
				$start = ($page - 1) * $rowPerPage;				
				$no = $start;	
				$this->db->setFetchMode(ADODB_FETCH_NUM);
				$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);	
				if ($rs){					
					while (!$rs->EOF)
					{		
						$no++;
						$tmpTr = "<tr><td height='20' class='isi_laporan'>".$no."</td>";
						for ($i = 0; $i < $rs->FieldCount(); $i++)
						{
							$value =  $rs->fields[$i];
							if ($groupBy && in_array(strtolower($rs->FetchField($i)->name),$groupArray) ){										
								$valTmp = $value;
								foreach($groupArray as $key =>$field){
									if (strtolower($rs->FetchField($i)->name) == $field && $fieldGroup[$field] == $value) {															
										$value = "";							
										$changeFieldStatus[$field] = false;
									}else if (strtolower($rs->FetchField($i)->name) == $field) {																																									
										$fieldGroup[$field] = $value;																				
										if (!$firstRow) $changeFieldStatus[$field] = true;
									}							
									//jika groupby sebelumnya berubah tetapi posisi sekarang tidak berubah maka dianggap berubah
									if ($key > 0){
										if ($changeFieldStatus[$groupArray[$key-1]] && !$changeFieldStatus[$field]) {
											$value = $valTmp;
											$fieldGroup[$field] = $value;
											$changeFieldStatus[$field] = true;								
										}
									}																			
								}					
							}								
							if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i] == "N" || $fieldsType[$i] == "C") {
								if ($value != "")
									$tmpTr .= "<td class='isi_laporan' align='right'>".number_format($value, 0, ",", ".")."</td>";
								else $tmpTr .= "<td class='isi_laporan' align='right'>&nbsp;</td>";
								if ($withTotal) {
									if ($groupBy) {
										if ($value == "") $value = 0;
										foreach($groupArray as $key => $field) {
											$totalGroup[$field][$i] = floatval($totalGroup[$field][$i]) + floatval($value);
										}								
										$total[$i] = floatval($total[$i]) + floatval($value);
									}else 
										$total[$i] = floatval($total[$i]) + floatval($value);
								}
							}else if ($fieldsType[$i] == "F")
								$tmpTr .= "<td class='isi_laporan'><a href='".$value."'>$value</a></td>";
							else {
								$tmpTr .= "<td class='isi_laporan'>".$value."</td>";
							}
						}			
						$cetak = false;
						//if ($groupBy){					
						if (!isset($groupTotal) || $groupTotal){
							if ((!$firstRow)) {													
								for($i = count($groupArray) - 1;$i > -1;$i--){						
									$field = $groupArray[$i];																				
									if ($changeFieldStatus[$field]){
										for ($j = 0; $j < $rs->FieldCount(); $j++){								
											if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
												$value = $rs->fields[$j];
												$totalGroup[$field][$j] = floatval($totalGroup[$field][$j]) - floatval($value);;												
											}
										}
										if ($groupHeader) {							
											if ($withTotal){//$cetak
												if ($groupHeader[$field]) 
												{
													$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";											
													$lewat = false;
													for ($j = 0; $j < $rs->FieldCount(); $j++){								
														if (strtolower($rs->FetchField($j)->name) == $field) $lewat = true;
														if (($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C") && ($summ[$j] == "Y")) {
															if ($fieldsType[$j] == "C" && isset($calFields)) {
																$rumus = $calFields[strtolower($rs->FetchField($j)->name)];
																if (isset($rumus)) {
																	$rumus = explode(",", $rumus);										
																	$firstC = true;																
																	foreach ($rumus as $key => $f) {									
																		for ($c = 0; $c < $rs->FieldCount(); $c++) {																	
																			if (strtolower($rs->FetchField($c)->name) == $f) {																			
																				if ($firstC) $value = $totalGroup[$field][$c];
																				else $value -= $totalGroup[$field][$c];																			
																			}										
																		}
																		$firstC = false;
																	}
																	if ($i == 0)
																		$total[$j] = floatval($total[$j]) + floatval($value);																																
																	$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($value,0,",",".") ."</td>";							
																}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
															}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
														}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
													}
													$html .= "</tr>";														
													$cetak = true;
												}
											}
											for ($j = 0; $j < $rs->FieldCount(); $j++){								
												if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
													$value = $rs->fields[$j];
													$totalGroup[$field][$j] = floatval($value);		
												}
											}
										}else {
											if ($withTotal){//$cetak
												$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
												$lewat = false;
												for ($j = 0; $j < $rs->FieldCount(); $j++){								
													if (strtolower($rs->FetchField($j)->name) == $field) $lewat = true;
													if (($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C") && ($summ[$j] == "Y"))
														$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
													else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
												}
											}
											$html .= "</tr>";			
											for ($j = 0; $j < $rs->FieldCount(); $j++){								
												if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
													$value = $rs->fields[$j];
													$totalGroup[$field][$j] = floatval($value);		
												}
											}
										}
									}
								}													
								if (false){
									$tmpTr = "<tr><td height='20' class='isi_laporan'>".$no."</td>";
									for ($i = 0; $i < $rs->FieldCount(); $i++){
										$value =  $rs->fields[$i];																			
										if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i] == "N" || $fieldsType[$i] == "C" ){										
											$tmpTr .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";									
										}else {
											$tmpTr .= "<td class='isi_laporan'>".$value."</td>";
										}
									}
								}
							}
						}
						if ($groupHeader) {
							
						}
						$html .= $tmpTr . "</tr>";						
						$firstRow = false;
						$rs->MoveNext();
					}												
				}
			}
			if ($rs){
				if ($withTotal){						
					//if ($groupBy){					
					if (!isset($groupTotal) || $groupTotal){	
						if ((!$firstRow)) {				
							$cetak = false;
							for($i = count($groupArray) - 1;$i > -1;$i--){						
								$field = $groupArray[$i];										
								if ($groupHeader){									
									if ($groupHeader[$field]) 
									if (true){								
										$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
										$lewat = true;
										for ($j = 0; $j < $rs->FieldCount(); $j++){								
											if (strtolower($rs->FetchField($j)->name)) $lewat = true;
											if (($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C") && ($summ[$j] == "Y")){
												if ($fieldsType[$j] == "C" && isset($calFields)) {
													$rumus = $calFields[strtolower($rs->FetchField($j)->name)];							
													if (isset($rumus)) {
														$rumus = explode(",", $rumus);										
														$firstC = true;																
														foreach ($rumus as $key => $f) {									
															for ($c = 0; $c < $rs->FieldCount(); $c++) {																	
																if (strtolower($rs->FetchField($c)->name) == $f) {																			
																	if ($firstC) $value = $totalGroup[$field][$c];
																	else $value -= $totalGroup[$field][$c];																			
																}										
															}
															$firstC = false;
														}
														if ($i == 0)
															$total[$j] = floatval($total[$j]) + floatval($value);														
														$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($value,0,",",".") ."</td>";							
													}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
												}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
											}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
										}
										$html .= "</tr>";		
										$cetak = true;
									}
								}else {
									$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
									$lewat = false;
									for ($j = 0; $j < $rs->FieldCount(); $j++){								
										if (strtolower($rs->FetchField($j)->name) == $field) $lewat = true;
										if (($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C") && ($summ[$j] == "Y"))
											$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
										else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
									}
									$html .= "</tr>";			
								}
							}							
						}
					}
					$html .= "<tr bgcolor='#ffff00'><td height='20' class='isi_laporan'>&nbsp;</td>";
					$first = true;					
					foreach ($total as $key => $value)
					{				
						if ($fieldsType[$key] == "N" || $fieldsType[$key] == "C"){
							if ($summaryField != null){													
								if ($summ[$key] == "Y")
									$html .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";					
								else $html .= "<td class='isi_laporan' align='right'>&nbsp;</td>";					
							}else
								$html .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";					
						}else {
							if ($first){
								$html .= "<td class='header_laporan'>Summary per Page</td>";
								$first = false;
							}else $html .= "<td class='isi_laporan'>&nbsp;</td>";
						}
					}
					$html .= "</tr>";			
				}
			}else{					
				$html .= "<tr><td colspan='". count($title->getArray())."'>Error". $this->db->ErrorMsg()."</td></tr></table>";
			}				
			$html.="</table>";
		}catch (exception $e) {
			error_log($sql);
			return "error" . $e->getMessage(); 
		}
		//$rs->close();
		//$this->db->Close();
		return $html;
	}
	function sqlToHtmlWithHeader($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null, $summaryField = null, $groupHeader = null, $calFields = null,$formHeader = "",$lokasi = "",$periode = "", $groupTotal = null)
	{
		try{			
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}			
			
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			echo "<html><head>";
			loadCSS("server_util_laporan");
			echo "</head>";
			
			echo "<body>";
			echo $formHeader;
			echo "<table border='1' cellspacing='0' cellpadding='0' class='kotak'>".
						"<tr bgcolor='#cccccc'>".
						"<td class='header_laporan' align='center' width=25>No</td>";		
			$width = $width->getArray();
			foreach ($title->getArray() as $key => $value)
				echo "<td class='header_laporan' align='center' width=".$width[$key].">" . $value . "</td>";				
			
			$fieldsType = $fieldType-> getArray();				
			if (isset($calFields)){
				$tmp = $calFields->getArray();
				$calFields = array();
				foreach ($tmp as $key => $value){
					$field = explode(";", $value);						
					$calFields[$field[0]] = $field[1];
				}
			}
			
			echo "</tr>";	
			
			if ($withTotal){
				$total = array();
				foreach ($title->getArray() as $key => $value)
					$total[$key] = 0;
			}
			if ($groupBy){
				$totalGroup = array();//penampung subtotal
				$fieldGroup = array();//penampung kode 
				$changeFieldStatus = array();
				$groupArray = $groupBy->getArray();
				foreach($groupArray as $key =>$value){
					$totalGroup[$value] = array();
					$fieldGroup[$value] = "";
					$changeFieldStatus[$value] = false;
				}
			}	
			if ($groupHeader) {
				$groupTmp = array();
				foreach($groupHeader->getArray() as $key => $value) {
					$groupTmp[$value] = $value;
				}
				$groupHeader = $groupTmp;
			}
			$pg= $page;
			$pgtmp = $page;
			if ($rowPerPage > 500){												
				$pgtmp = ceil($rowPerPage / 500);				
				$pg = ($page - 1) * $pgtmp + 1;
				$pgtmp = $pg + ($pgtmp -1);
				$rowPerPage = 500;
				
			}
			for ($page = $pg; $page <= $pgtmp; $page++)
			{			
				$start = ($page - 1) * $rowPerPage;				
				$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);			
				if ($rs){
					uses("server_util_AddOnLib");
					$AddOnLib=new server_util_AddOnLib();						
					$no = $start;						
					$firstRow = true;
					$allChange = false;
					$cetak = false;				
					
					while (!$rs->EOF){		
						$no++;
						$html = "";
						$tmpTr = "<tr><td height='20' class='isi_laporan'>".$no."</td>";
						for ($i = 0; $i < $rs->FieldCount(); $i++)
						{
							$value =  $rs->fields[$i];
							if ($groupBy && in_array(strtolower($rs->FetchField($i)->name),$groupArray) ){										
								$valTmp = $value;
								foreach($groupArray as $key =>$field){
									if (strtolower($rs->FetchField($i)->name) == $field && $fieldGroup[$field] == $value) {															
										$value = "";							
										$changeFieldStatus[$field] = false;
									}else if (strtolower($rs->FetchField($i)->name) == $field) {																																									
										$fieldGroup[$field] = $value;																				
										if (!$firstRow) $changeFieldStatus[$field] = true;
									}							
									//jika groupby sebelumnya berubah tetapi posisi sekarang tidak berubah maka dianggap berubah
									if ($key > 0){
										if ($changeFieldStatus[$groupArray[$key-1]] && !$changeFieldStatus[$field]) {
											$value = $valTmp;
											$fieldGroup[$field] = $value;
											$changeFieldStatus[$field] = true;								
										}
									}																			
								}					
							}								
							if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i] == "N" || $fieldsType[$i] == "C") {
								if ($value != "")
									$tmpTr .= "<td class='isi_laporan' align='right'>".number_format($value, 0, ",", ".")."</td>";
								else $tmpTr .= "<td class='isi_laporan' align='right'>&nbsp;</td>";
								if ($withTotal) {
									if ($groupBy) {
										if ($value == "") $value = 0;
										foreach($groupArray as $key => $field) {
											$totalGroup[$field][$i] = floatval($totalGroup[$field][$i]) + floatval($value);
										}								
										$total[$i] = floatval($total[$i]) + floatval($value);
									}else 
										$total[$i] = floatval($total[$i]) + floatval($value);
								}
							}else {
								$tmpTr .= "<td class='isi_laporan'>".$value."</td>";
							}
						}			
						$cetak = false;
						//if ($groupBy){					
						if (!isset($groupTotal) || $groupTotal){	
							if ((!$firstRow)) {													
								for($i = count($groupArray) - 1;$i > -1;$i--){						
									$field = $groupArray[$i];																				
									if ($changeFieldStatus[$field]){
										for ($j = 0; $j < $rs->FieldCount(); $j++){								
											if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
												$value = $rs->fields[$j];
												$totalGroup[$field][$j] = floatval($totalGroup[$field][$j]) - floatval($value);;												
											}
										}
										if ($groupHeader) {
											if (true){//$cetak
												if ($groupHeader[$field]){
													$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";											
													$lewat = false;
													for ($j = 0; $j < $rs->FieldCount(); $j++){								
														if (strtolower($rs->FetchField($j)->name) == $field) $lewat = true;
														if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C") {
															if ($fieldsType[$j] == "C" && isset($calFields)) {
																$rumus = $calFields[strtolower($rs->FetchField($j)->name)];							
																if (isset($rumus)) {
																	$rumus = explode(",", $rumus);										
																	$firstC = true;																
																	foreach ($rumus as $key => $f) {									
																		for ($c = 0; $c < $rs->FieldCount(); $c++) {																	
																			if (strtolower($rs->FetchField($c)->name) == $f) {																			
																				if ($firstC) $value = $totalGroup[$field][$c];
																				else $value -= $totalGroup[$field][$c];																			
																			}										
																		}
																		$firstC = false;
																	}
																	if ($i == 0)
																		$total[$j] = floatval($total[$j]) + floatval($value);																																
																	$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($value,0,",",".") ."</td>";							
																}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
															}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
														}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
													}
													$html .= "</tr>";														
													$cetak = true;
												}
											}
											for ($j = 0; $j < $rs->FieldCount(); $j++){								
												if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
													$value = $rs->fields[$j];
													$totalGroup[$field][$j] = floatval($value);		
												}
											}
										}else {
											$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
											$lewat = false;
											for ($j = 0; $j < $rs->FieldCount(); $j++){								
												if ($rs->FetchField($j)->name == $field) $lewat = true;
												if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C")
													$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
												else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
											}
											$html .= "</tr>";			
											for ($j = 0; $j < $rs->FieldCount(); $j++){								
												if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
													$value = $rs->fields[$j];
													$totalGroup[$field][$j] = floatval($value);		
												}
											}
										}
									}
								}													
								if (false){
									$tmpTr = "<tr><td height='20' class='isi_laporan'>".$no."</td>";
									for ($i = 0; $i < $rs->FieldCount(); $i++){
										$value =  $rs->fields[$i];																			
										if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i] == "N" || $fieldsType[$i] == "C" ){
											$tmpTr .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";									
										}else {
											$tmpTr .= "<td class='isi_laporan'>".$value."</td>";
										}
									}
								}
							}
						}
						if ($groupHeader) {
							
						}
						$html .= $tmpTr . "</tr>";
						echo $html;						
						$firstRow = false;
						$rs->MoveNext();
					}					
				}else{
					$html = "<tr><td colspan='". count($title->getArray())."'>Error:". $this->db->ErrorMsg()."</td></tr>";
					echo $html;
				}
			}
			if ($rs){								
				$html = "";
				if ($withTotal){						
					//if ($groupBy){					
					if (!isset($groupTotal) || $groupTotal){		
						if ((!$firstRow)) {				
							$cetak = false;
							for($i = count($groupArray) - 1;$i > -1;$i--){						
								$field = $groupArray[$i];										
								if ($groupHeader){									
									if ($groupHeader[$field]) 
									if (true){								
										$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
										$lewat = true;
										for ($j = 0; $j < $rs->FieldCount(); $j++){								
											if (strtolower($rs->FetchField($j)->name)) $lewat = true;
											if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C"){
												if ($fieldsType[$j] == "C" && isset($calFields)) {
													$rumus = $calFields[strtolower($rs->FetchField($j)->name)];							
													if (isset($rumus)) {
														$rumus = explode(",", $rumus);										
														$firstC = true;																
														foreach ($rumus as $key => $f) {									
															for ($c = 0; $c < $rs->FieldCount(); $c++) {																	
																if (strtolower($rs->FetchField($c)->name) == $f) {																			
																	if ($firstC) $value = $totalGroup[$field][$c];
																	else $value -= $totalGroup[$field][$c];																			
																}										
															}
															$firstC = false;
														}
														if ($i == 0)
															$total[$j] = floatval($total[$j]) + floatval($value);														
														$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($value,0,",",".") ."</td>";							
													}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
												}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
											}else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
										}
										$html .= "</tr>";		
										$cetak = true;
									}
								}else {
									$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
									$lewat = false;
									for ($j = 0; $j < $rs->FieldCount(); $j++){								
										if (strtolower($rs->FetchField($j)->name) == $field) $lewat = true;
										if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N" || $fieldsType[$j] == "C")
											$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
										else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".(strtolower($rs->FetchField($j)->name) == $field ? "Sub Total" :"")."</td>";							 
									}
									$html .= "</tr>";			
								}
							}							
						}
					}
					$html .= "<tr bgcolor='#ffff00'><td height='20' class='isi_laporan'>&nbsp;</td>";
					$first = true;
					if ($summaryField != null)
						$summ = $summaryField->getArray();
					foreach ($total as $key => $value)
					{				
						if ($fieldsType[$key] == "N" || $fieldsType[$key] == "C"){
							if ($summaryField != null){													
								if ($summ[$key] == "Y")
									$html .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";					
								else $html .= "<td class='isi_laporan' align='right'>&nbsp;</td>";					
							}else
								$html .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";					
						}else {
							if ($first){
								$html .= "<td class='header_laporan'>Summary per Page</td>";
								$first = false;
							}else $html .= "<td class='isi_laporan'>&nbsp;</td>";
						}
					}
					$html .= "</tr>";			
				}
			}
			$html.="</table>";
			echo $html;
			echo "</body></html>";
		}catch (exception $e) {
			error_log($sql);
			return "error" . $e->getMessage(); 
		}
		//$rs->close();
		//$this->db->Close();		
		return "";
	}
	function sqlToHtmlGrouping($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy)
	{
		try{
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$start = ($page - 1) * $rowPerPage;		
			//$sql = strtolower($sql);	
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);	
			if ($rs){
				$html = "<table border='1' cellspacing='0' cellpadding='0' class='kotak'>";
				$headHtml = "<table border='1' cellspacing='0' cellpadding='0' class='kotak'>";
				$headHtml .= "<tr bgcolor='#cccccc'>";
				$headHtml .= "<td class='header_laporan' align='center' width=25>No</td>";		
				$width = $width->getArray();
				foreach ($title->getArray() as $key => $value)
					$headHtml  .= "<td class='header_laporan' align='center' width=".$width[$key].">" . $value . "</td>";						
				$headHtml  .= "</tr>";	
				$htmlChild = "";
				$fieldsType = $fieldType->getArray();
				$no = $start;	
				if ($withTotal){
					$total = array();
					foreach ($title->getArray() as $key => $value)
						$total[$key] = "";
				}
				if ($groupBy){
					$totalGroup = array();//penampung subtotal
					$fieldGroup = array();//penampung kode 
					$changeFieldStatus = array();
					$groupArray = $groupBy->getArray();
					foreach($groupArray as $key =>$value){
						$totalGroup[$value] = array();
						$fieldGroup[$value] = "";
						$changeFieldStatus[$value] = false;
						$groupHtml[$value] = "";
					}
				}
				$firstRow = true;
				$firstPrint = false;	
				$lastHtml ="";
				$rowBefore = "";
				$noReset = true;
				$fieldCount = 0;
				while (!$rs->EOF)
				{			
					$tmpTr = "";$row = "";			
					$fieldCount = $rs->FieldCount();
					for ($i = 0; $i < $rs->FieldCount(); $i++)
					{
						$value =  $rs->fields[$i];
						if ($groupBy && in_array(strtolower($rs->FetchField($i)->name),$groupArray) ){										
							$valTmp = $value;
							foreach($groupArray as $key =>$field){
								if (strtolower($rs->FetchField($i)->name) == $field && $fieldGroup[$field] == $value) {							
									$value = "";							
									$changeFieldStatus[$field] = false;
								}else if (strtolower($rs->FetchField($i)->name) == $field) {						
									$fieldGroup[$field] = $value;
									$changeFieldStatus[$field] = true;																																							
									$no = 0;
								}
								if ($key > 0){
									if ($changeFieldStatus[$groupArray[$key-1]]) {
										$value = $valTmp;
										$fieldGroup[$field] = $value;
										$changeFieldStatus[$field] = true;
										$no = 0;
									}
								}
							}						
						}													
						if (!in_array(strtolower($rs->FetchField($i)->name),$groupArray)){						
							if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i - count($groupArray)] == "N"){
								$tmpTr .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";
								if ($withTotal){
									$total[$i] = floatval($total[$i]) + floatval($value);							
									foreach($groupArray as $key =>$field){
										$totalGroup[$field][$i] = floatval($totalGroup[$field][$i]) + floatval($value);																								
									}
								}
							}else {					
								$tmpTr .= "<td class='isi_laporan'>".$value."</td>";
							}
						}
						$row .= $value ." ;"; 
					}					
			
					if ((!$firstRow)){														
						for($i = 0;$i < count($groupArray);$i++){						
							$field = $groupArray[$i];												
							if ($changeFieldStatus[$field]){											
								for ($j = 0; $j < $rs->FieldCount(); $j++){				
									$value =  $rs->fields[$j];
									if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$i - (count($groupArray) - 2)] == "N"){
										$totalGroup[$field][$j] = floatval($totalGroup[$field][$j]) - floatval($value);																															
									}
								}																				
							}
						}								
						if ($no == 0)
								{
									$field = $groupArray[count($groupArray) - 1];												
									foreach($groupArray as $key =>$field2){								
										//if ($changeFieldStatus[$field2])
											$html .= "<tr style='{font-size:10;font-family:arial;font-weight:bold}' ><td>$field2 : ". $rowBfr[$key]."</td></tr>";															
									}
									$html .= "<tr><td>". $headHtml . $htmlChild;															
									$html .= "<tr bgcolor='#ffff00'>";		
									$html .= "<td bgColor='#eeee00'  class='isi_laporan' align='right'>&nbsp;</td>";	
									for ($j = 0; $j < $rs->FieldCount(); $j++){								
										if ($j > count($groupArray) - 1){									
											if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" )
												$html .= "<td bgColor='#eeee00'  class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";															
											else $html .= "<td bgColor='#eeee00'  class='isi_laporan' align='right'>&nbsp;</td>";																						
										}
									}								
									$html .= "</tr>";									
									$html .= "</table></td></tr>";
									$htmlChild = "";
									for ($j = 0; $j < $rs->FieldCount(); $j++){								
										$value =  $rs->fields[$j];
										if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N"){
											$totalGroup[$field][$j] = $value;		
										}
									}														
								}
					}else $firstPrint = true;
					$no++;		
					$tmpTr = "<tr><td height='20' class='isi_laporan'>".$no."</td>" . $tmpTr;			
					$tmpTr .= "</tr>";						
					$htmlChild .= $tmpTr;								
					$firstRow = false;
					$rowBfr = $rs->fields;
					$rs->MoveNext();
				}		
				if ($firstPrint){								
					for($i = 0;$i < count($groupArray);$i++){						
						$field = $groupArray[$i];																
						if ($i == count($groupArray) -1)
						{
							foreach($groupArray as $key =>$field2){								
								//if ($changeFieldStatus[$field2])
									$html .= "<tr style='{font-size:10;font-family:arial;font-weight:bold}' ><td>$field2 : ". $rowBfr[$key]."</td></tr>";															
							}
							$html .= "<tr><td>". $headHtml . $htmlChild;															
							$html .= "<tr bgcolor='#ffff00'>";		
							$html .= "<td bgColor='#eeee00'  class='isi_laporan' align='right'>&nbsp;</td>";	
							$ix = -1;
							for ($j = 0; $j < $fieldCount; $j++){								
								if ($j > count($groupArray) - 1){									
									$ix++;							
									if ($fieldsType[$ix] == "N")
										$html .= "<td bgColor='#eeee00'  class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";															
									else $html .= "<td bgColor='#eeee00'  class='isi_laporan' align='right'>&nbsp;</td>";																						
								}
							}								
							$html .= "</tr>";									
							$html .= "</table></td></tr>";
							$htmlChild = "";																		
						}
					}
				}
				$html .= "<tr><td>";
				$html .= $headHtml;
				$html .= "<tr bgcolor='#ffff00'><td height='20' class='isi_laporan'>&nbsp;</td>";
				$first = true;
				$ix = -1;
				for ($j = 0; $j < $fieldCount; $j++){								
					$value = $total[$j];
					if ($j > count($groupArray) - 1){																
						$ix++;
						if ($fieldsType[$ix] == "N"){
							$html .= "<td class='isi_laporan' align='right' width=".$width[$ix].">".number_format($value,0,",",".")."</td>";					
						}else {
							if ($first){
								$html .= "<td class='header_laporan' width=".$width[$ix].">Total</td>";
								$first = false;
							}else $html .= "<td class='isi_laporan' width=".$width[$ix].">&nbsp;</td>";
						}
					}
				}
				$html .= "</tr></table></td></tr>";			
				$html.="</table>";					
			}else{
				$html = "<table><tr><td>Error</td><td>:</td><td>". $this->db->ErrorMsg()."</td></tr></table>";
			}
			$rs->close();
			//$this->db->Close();
			return $html;
		}catch(Exception $e){
			return "error." . $e->getMessage();
		}
	}
	function sqlToXlsTemp($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null, $file)
	{					
		global $manager;
		$manager->setSendResponse(false);
		$html = $this->sqlToHtml($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal, $groupBy);		
		$name = md5(uniqid(rand(), true)) .".xls";
		$save = $manager->getTempDir() . "/$name";
		file_put_contents($save, $html);		
		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: application/x-msexcel");
		header ("Content-Disposition: attachment; filename=". $file .".xls");
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		readfile($save);
		unlink($save);	  	
	}
	function sqlToPdf($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null)
	{
		uses("server_pdf_Pdf");
		$pdf = new server_pdf_Pdf();
		$html = $this->sqlToHtml($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal, $groupBy);		
		$ret = $pdf->createPdf($html, "L", "mm", "A4", 100, 7, 3);
		return $ret;		
	}
	function doPrintHeader($sender, $page){
		if ($page == 1){
			//$sender->SetY(10);
			foreach ($sender->title as $i => $value){
				$sender->SetFont('Times','B',$sender->titleSize[$i]);
				$sender->Cell(0,$sender->titleHeight[$i],$value,0,1,'C');			
			}
			$sender->Ln();
			$sender->SetFillColor(128,128,128);				
			$sender->SetLineWidth(.3);
			$sender->SetFont('','B', $sender->headerSize);
			//Header
			$w= $sender->headerWidth;        	
			$h= $sender->headerHeight;      
			foreach($sender->header as $i => $value){
				$sender->Cell($w[$i],$h,$value,1,0,'C',true);
			}			
		}else {
			$sender->SetFillColor(128,128,128);				
			$sender->SetLineWidth(.3);
			$sender->SetFont('','B', $sender->headerSize);
			//Header
			$w= $sender->headerWidth;        	
			$h= $sender->headerHeight;      
			foreach($sender->header as $i => $value){
				$sender->Cell($w[$i],$h,$value,1,0,'C',true);
			}			
		}
		$sender->Ln();    
	}
	function sqlToPdfExt($sql, $title, $titleHeight, $titleSize, $orientation, $paperType, $fontSize, $rowHeight, $header,$headerSize, $headerHeight, $headerWidth, $namafile= null, $margin = null)
	{		
		try{
			uses("server_util_PdfLib");			
			$pdf = new server_util_PdfLib($title->getArray(), $titleHeight->getArray(), $titleSize->getArray(), $orientation, $paperType, $fontSize, $header->getArray(),$headerSize, $headerHeight, $headerWidth->getArray(), $margin);
			$pdf->onPrintHeader->set($this, "doPrintHeader");
			$pdf->AliasNbPages();
			$pdf->AddPage();			
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}		
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			$resultSet = $this->db->execute($sql);	
			if (!isset($namafile)) $namafile = "report.pdf";		
			$w = $pdf->headerWidth;
			$fill = false;
			$pdf->SetFillColor(224,235,255);
			$pdf->SetTextColor(0);
			$pdf->SetFont('','', $fontSize);
			$ix = 0;
			while (!$resultSet->EOF){				
				for ($i = 0; $i < $resultSet->FieldCount(); $i++)
				{							
					if ($resultSet->FetchField($i)->type == "text" || $resultSet->FetchField($i)->type == "blob"){
						$pos = strpos($resultSet->fields[$i],"'");
						if (gettype($pos) != "boolean") $value = $resultSet->fields[$i];
						else $value = addslashes($resultSet->fields[$i]);						
						$pdf->Cell($w[$i],$rowHeight,$value,1,0,'L',$fill);
					}else if ($resultSet->FetchField($i)->type == "N" || $resultSet->FetchField($i)->type == "real" || $resultSet->FetchField($i)->type == "I"  || $resultSet->FetchField($i)->type == "i" || $resultSet->FetchField($i)->type == "decimal" || $resultSet->FetchField($i)->type == "NUMBER"){
						$value =  floatval($resultSet->fields[$i]);
						$value = number_format($value,0,",",".");
						$pdf->Cell($w[$i],$rowHeight,$value,1,0,'R',$fill);
					}else {
						$pos = strpos($resultSet->fields[$i],"'");
						if (gettype($pos) != "boolean") $value = $resultSet->fields[$i];
						else $value = addslashes($resultSet->fields[$i]);
						if ($value == "") $value = "-";			
						$pdf->Cell($w[$i],$rowHeight,$value,1,0,'L',$fill);										
					}
				}
				$pdf->Ln();
				$fill=!$fill;
				$resultSet->MoveNext();
			}	
			$pdf->SetFillColor(200,200,200);							
			for ($i = 0; $i < $resultSet->FieldCount(); $i++){
				$pdf->Cell($w[$i],$rowHeight,'',1,0,'L',true);
			}
			
			$pdf->Output($namafile,'I',true);
		}catch(Exception $e){
			error_log($e->getMessage());
			$manager->setSendResponse(true);
			return 	$e->getMessage();
		}			
	}
	function sqlToGraph($sql, $type)
	{
	}
	function killAllConnection(){		
		$rs = $this->db->execute("SHOW PROCESSLIST");		
		if ($rs){
			while ($line = $rs->FetchNextObject(true)){			
				if ($line->COMMAND == "Sleep"){
					$id= $line->ID;					
					$this->db->execute("KILL $id");
				}
			}
		}
	}
	function getTableStructure($table){
		$rs = $this->db->execute("DESCRIBE $table");		
		$res = "{\"table\" : [";
		if ($rs){			
			$first = true;
			while ($line = $rs->FetchNextObject(false)){			
				if (!$first) $res .= ",";					
				$res .= "{\"Field\": \"$line->FIELD\", \"Type\" : \"$line->TYPE\"}";
				$first = false;
			}			
		}
		$res .= "]}";
		return $res;
	}
	function getAllTableStructure(){
		$tabel = $this->db->MetaTables("TABLES",false);
		echo "{\"tables\" : [";
		for ($i = 0; $i <= count($tabel); $i++) {
			if ($tabel[$i] == "") continue;
			$rs = $this->db->execute("DESCRIBE $tabel[$i]");					
			//$rs = $this->db->MetaColumns($tabel[$i]);					
			if ($i > 0) echo ",";
			if ($rs){
				echo "{\"$tabel[$i]\" : [";
				$first = true;
				while ($line = $rs->FetchNextObject(true)){			
					if (!$first) echo ",";					
					echo "{\"Field\": \"$line->FIELD\", \"Type\" : \"$line->TYPE\",\"Null\":\"$line->NULL\",\"Key\":\"$line->KEY\",\"Default\":\"$line->DEFAULT\"}";
					$first = false;
				}
				echo "]}";
			}
		}
		echo "]}";		
		return "";
	}
	function loginSQL($sql)
	{	
		try
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");
			$dbdriver = $this->connection->driver;		
			if (!strpos($sql,'date_format') && $dbdriver != "oci8")
				$sql = strtolower($sql);					
			else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$rs = $this->db->Execute($sql);
			if ($rs)
			{			
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProvider($rs);
				$result = "{ resultset: " . $result .", session: \"". md5(date("r"))."\" }";				
				return $result;			
			}else {
				return "error::".$this->db->ErrorMsg();
			}			
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function runQueryText($sql){			
												
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				$model = new server_DBConnection_dataModel();
				$result = $model->listData($rs);				
				//$this->db->Close();
				return $result;
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
	}
	function loginAndLoad($sql, $usr, $pwd, $ldap){
		try{
		  $ret = $this->connect();
		  if ($ret != "success") throw new Exception($ret);
		  
		  if ($ldap == true){
			  global $ldaphost;			
		  }		
		  $rs = $this->execute("select flag from spro where kode_spro ='VEATSTATUS'"); 		  
		  if ($rs && $row = $rs->FetchNextObject(false)){
			  if ($row->flag == "1" && ($usr != "AMU" && $usr != "830151" && $usr != "700671" && $usr != "700656" && $usr != "621542" && $usr != "621359")){
				  return "error: Aplikasi sedang di lock.Hubungi Administrator anda ";
			  }
		  }
		  uses("server_DBConnection_dataModel");	
		  $sql = str_replace("\\'", "'", $sql);
		  $sql = explode("\r\n",$sql);		
		  $arr = array();
		  foreach($sql as $key => $value){			
			  if ($key > 0){
				  if (strpos($value,"table")){	
					  for ($i=0; $i < $key;$i++){
						  $res = $arr[$i];										
						  $res = explode("<br>",$res);					
						  $fields = explode(";",$res[0]);	
						  if (count($res) > 1){
							  $fieldVal = explode(";",$res[1]);	
							  foreach($fields as $key2 => $field){														
								  if (strpos($value,"table". ($i + 1)."_" . strtolower($field))){
									  $value = str_replace("table". ($i + 1)."_" . strtolower($field), $fieldVal[$key2],$value); 
								  }	
							  }													
						  }						
					  }
				  }
			  }	
			  if (strpos($value,"select") === false){				
			  }else {
				  $dbdriver = $this->connection->driver;
				  if (!strpos($value,'date_format') && $dbdriver != "oci8")
					  $value = strtolower($value);							
				  if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
					  $value = $this->sqlConvertSqlSvr($value);
				  }else if ($dbdriver == "oci8"){
					  $value = $this->sqlConvertOra($value);
				  }						
				  if ($key == 0 && $ldap == true && is_numeric($usr)){					
					  //error_log("host" . $ldaphost);
					  $auth = $this->LDAP_auth($usr, $pwd, $ldaphost);										
					  if ($auth == 1){
					  	 //error_log("OKAY");
						  //$tbl = explode("from ",$value);
						  //$tbl = explode(" ",$tbl[1]);
						  //$tbl = $tbl[0];						
						  //$this->db->Execute("update $tbl set pass = '".$pwd."' where nik = '". $usr."' ");						
					  }else {
						  //$value .= " and pass = '" . $pwd. "' ";
						  //error_log("Check Login ");
						  $rs = $this->db->Execute($value);
						  if ($row = $rs->FetchNextObject(false) ){
							  error_log("nik $usr $row->pass $pwd");
							  if ($row->pass != $pwd) {
								  	error_log($row->pass . ":" . md5($pwd));
									if ($row->pass != md5($pwd)) {
								  		return "error: Gunakan user Portal Intranet Telkom";
									}
							  }
						  }
						  $rs = $this->db->Execute($value);
						  if ($rs){
							  $model = new server_DBConnection_dataModel();
							  $res = $model->listData($rs);				
						  }else return "error: Gunakan user Portal Intranet Telkom";
					  }
				  }else if ($key == 0){
					 // $value .= " and pass = '" . $pwd. "' ";
					 //error_log("Check Login $value" . md5($pwd));
					 $rs = $this->db->Execute($value);
						  if ($row = $rs->FetchNextObject(false) ){
							  error_log("MD5 " . $row->pass . " : ". md5($pwd));
							  if ($row->pass != $pwd) {
								  	if ($row->pass != md5($pwd)) {
								  		return "error: Gunakan user Portal Intranet Telkom";
									}
							  }
						  }
				  }					
			
				  $rs = $this->db->Execute($value);
				  if ($rs)
				  {
					  $model = new server_DBConnection_dataModel();
					  $res = $model->listData($rs);				
					  //$this->db->Close()
				  }else {
					  //$this->db->Close();
				  	  error_log($value);
					  return "Error::".$this->db->ErrorMsg();
				  }				
				  $res = str_replace("\r\n","<br>",$res);
				  $arr[$key] = $res;							
			  }
		  }
		  $ret = "";
		  foreach ($arr as $key => $value){
			  if ($key > 0) $ret .= "\r\n";
			  $ret .= $value; 
		  }
		  $ret .= "";						
		  if ($arr[0] != ""){	
			  session_regenerate_id();	
			  $session = session_id();;//md5(date("r"));
			  //cek di database...
			  $ret .= "\r\n";		
			  $ret .= "SERVERVAR\r\n";
			  $_SESSION["user"] = $usr;

			  $result = "";		
			  $ip = $_SERVER["REMOTE_ADDR"];
			  global $dbConnection;
			  $result .= $ip ."<br>";	//"REMOTE_ADDR=". 
			  $result .= GetHostByName($ip)."<br>";//"REMOTE_HOST=". 
			  $result .= $dbConnection->dbName . "-" . $dbConnection->dbDriver."<br>";	//"DBNAME=". 
			  $result .= $dbConnection->dbHost."<br>";	//"DBHOST=". 
			  $result .= $dbConnection->dbDriver."<br>";	//"DBDRIVER=". 
			  $result .= $session ."<br>";//"SESSION=".
			  global $dirSeparator;
			  global $serverDir;			
			  $rootPath = substr($serverDir,0,strpos($serverDir,"server") - 1);
			  $path = $_SERVER["REQUEST_URI"];
			  for ($i = 0; $i < 2; $i++){
				  $path = substr($path,0,strrpos($path,"/"));		
			  } 
			  $result .= $path ."<br>";
			  $result .= $_SERVER["HTTP_HOST"] ."<br>";
			  $result .= $rootPath ."<br>";
			  $ret .= $result;					
			  $res = $arr[0];
			  $userData = explode("<br>",$res);
			  $uid = explode(";", $userData[1]);
			  $dbdriver = $this->connection->driver;
			  $ip = $this->get_client_ip();
			  $this->execute("insert into bpc_sessions(username, tgl, ip,  tgl_logout, sessions, last_update)
									values('$usr',sysdate,'$ip', sysdate, '$session', sysdate)");
			 /* if ($dbdriver == "mysqlt")
				  $valueSQL = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid[1] ."', '". $uid[5]."', now(), '". $session."','1900-01-01','". gethostbyname($ip)."','". $ip."' )";
			  else if ($dbdriver == "oci8")
				  $valueSQL = "insert into userlog(\"ID\",\"UID\", \"USERLOC\", \"TIMEIN\", \"SESSION\", \"TIMEOUT\", \"HOST\", \"IP\")values(0,'" . $uid[1] ."', '". $uid[5]."', sysdate, '". $session."',sysdate,'". gethostbyname($ip)."','". $ip."' )";
			  else if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") 
				  $valueSQL = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid[1] ."', '". $uid[5]."', getdate(), '". $session."','1900-01-01','". gethostbyname($ip)."','". $ip."' )";			
			  */
			  //$this->db->Execute($valueSQL);
			  //$this->db->Execute("insert into chat(dari,kepada,pesan,tanggal,status, tipe)values('-','-','".$uid[1]." login',sysdate,'N','L')");
		  }		
		  return $ret;	
		}catch(Exception $e ){	
		  error_log($e->getMessage());
		  return $e->getMessage();
		}
    }
	function get_client_ip() {
		$ipaddress = '';
		if (isset($_SERVER['HTTP_CLIENT_IP']))
			$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
		else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
			$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_X_FORWARDED']))
			$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
		else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
			$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_FORWARDED']))
			$ipaddress = $_SERVER['HTTP_FORWARDED'];
		else if(isset($_SERVER['REMOTE_ADDR']))
			$ipaddress = $_SERVER['REMOTE_ADDR'];
		else
			$ipaddress = 'UNKNOWN';
		return $ipaddress;
	}
//Direct response	
    function backupTable($tableList, $allTable, $lokasi = '',$maxRow = 500){
        $filename = date("Ymd_His");
        if ($allTable == "true"){
            $tableList  = $this->getAllTables();
			$tableList = explode(",",$tableList);
        }		
		global $manager;            
		global $rootDir;            
		$data = "";
		$filter = "";
		$ret = "{\"files\": [";
		echo "{\"files\": [";
		$first = true;
		if (!empty($lokasi)) $filter = "where kode_lokasi = '".$lokasi."'";
		foreach ($tableList->getArray() as $key => $value){
			$rs = $this->db->Execute("select * from ".$value." ".$filter);
			$rowCount = 0;
			$tableName = $value;
			$sqlInsert = "";
			$sqlData = "";
			$bulk = "";
			$save = $manager->getTempDir() . "/".$value."_".$filename.".sql";
			if (!$first) { 
				$ret .=",";
				echo ",";
			}
			$f = fopen($save,"w");
			while ($row = $rs->FetchNextObject(false)){
				if ($rowCount == $maxRow || $rowCount == 0){    			          
					if ($rowCount == $maxRow){ 
						$bulk = substr($bulk,1); 
						fwrite($f,$sqlInsert . " ".$bulk .";\r\n");
					}
					$sqlInsert = "insert into $tableName (";
					$sqlField = "";
					foreach ($row as $key =>$value)
						 $sqlField .= "," . $key;		                  
					$sqlField = substr($sqlField,1);     
					$sqlInsert .= $sqlField . ")";
					$bulk = "";
					$rowCount = 1;
				}
				$sqlData = "";
				foreach ($row as $key =>$value) $sqlData .=",'".addslashes($value)."'";                    
				$sqlData = "(". substr($sqlData,1) . ")";
				$bulk .= "," . $sqlData;
				$rowCount++;
			} 
			if (!empty($bulk)){
				$bulk = substr($bulk,1);                 
				fwrite($f,$sqlInsert . " ".$bulk .";\r\n");
			}
			fclose($f);
			$zip = new ZipArchive;
			$zipfile = $manager->getTempDir() . "/".$tableName."_".$filename.".zip";
			if ($zip->open($zipfile,ZIPARCHIVE::OVERWRITE) === TRUE) {
				$zip->addFile($save, $tableName.".sql");
				$zip->close();
				$size = formatBytes(filesize($zipfile));
				$ret .= "{\"filename\": \"/$rootDir/server/tmp/".$tableName."_".$filename.".zip\",\"size\": \"$size\"}";
				echo "{\"filename\": \"/$rootDir/server/tmp/".$tableName."_".$filename.".zip\",\"size\": \"$size\"}";
				$zip2 = new ZipArchive;
				if ($zip2->open($manager->getTempDir() . "/AllFile_".$filename.".zip",ZIPARCHIVE::CREATE) === TRUE) {
				   $zip2->addFile($save, $tableName.".sql");
				   $zip2->close();    
				   $zipAll = true;
				}        			
				unlink($save);
			} else {
				$size = formatBytes(filesize($save));
				$ret .= "{\"filename\":\"/$rootDir/server/tmp/".$tableName."_".$filename.".sql\",\"size\":\"$size\"}";
				echo "{\"filename\":\"/$rootDir/server/tmp/".$tableName."_".$filename.".sql\",\"size\":\"$size\"}";
			}
			$first = false;
		}
		if ($zipAll) {
			$sizeAll = formatBytes(filesize($manager->getTempDir() . "/AllFile_".$filename.".zip"));
			$ret .= ",{\"filename\":\"/$rootDir/server/tmp/AllFile_".$filename.".zip\",\"size\":\"$sizeAll\"}";
			echo ",{\"filename\":\"/$rootDir/server/tmp/AllFile_".$filename.".zip\",\"size\":\"$sizeAll\"}";
		}    
		$ret .= "]}";
		echo "]}";
		return "";
    }
    function sqlBackup($sql, $maxRow = 500){
        global $manager;            
        global $rootDir;            
        $filename = date("Ymd_His");
        $data = "";
        $filter = "";
        $ret = "{\"files\": [";
        echo "{\"files\": [";
        $first = true;
		$rs = $this->db->Execute($sql);
		$rowCount = 0;
		$tableName = "result";
		$sqlInsert = "";
		$sqlData = "";
		$bulk = "";
		$save = $manager->getTempDir() . "/".$filename.".sql";		
        $f = fopen($save,"w");
		while ($row = $rs->FetchNextObject(false)){
		    if ($rowCount == $maxRow || $rowCount == 0){    			          
		        if ($rowCount == $maxRow){ 
			        $bulk = substr($bulk,1); 
			        fwrite($f,$sqlInsert . " ".$bulk .";\r\n");
		        }
		        $sqlInsert = "insert into $tableName (";
		        $sqlField = "";
                foreach ($row as $key =>$value)
		             $sqlField .= "," . $key;		                  
		        $sqlField = substr($sqlField,1);     
                $sqlInsert .= $sqlField . ")";
                $bulk = "";
                $rowCount = 1;
            }
            $sqlData = "";
            foreach ($row as $key =>$value) $sqlData .=",'".addslashes($value)."'";                    
            $sqlData = "(". substr($sqlData,1) . ")";
            $bulk .= "," . $sqlData;
            $rowCount++;
        } 
        if (!empty($bulk)){
            $bulk = substr($bulk,1);                 
            fwrite($f,$sqlInsert . " ".$bulk .";\r\n");
        }
        fclose($f);
        $zip = new ZipArchive;
        $zipfile = $manager->getTempDir() . "/".$tableName."_".$filename.".zip";
        if ($zip->open($zipfile,ZIPARCHIVE::OVERWRITE) === TRUE) {
            $zip->addFile($save, $tableName.".sql");
            $zip->close();
            $size = formatBytes(filesize($zipfile));
			$ret .= "{\"filename\": \"/$rootDir/server/tmp/".$tableName."_".$filename.".zip\",\"size\": \"$size\"}";
			echo "{\"filename\": \"/$rootDir/server/tmp/".$tableName."_".$filename.".zip\",\"size\": \"$size\"}";
			unlink($save);
        } else {
            $size = formatBytes(filesize($save));
			$ret .= "{\"filename\":\"/$rootDir/server/tmp/".$tableName."_".$filename.".sql\",\"size\":\"$size\"}";
			echo "{\"filename\":\"/$rootDir/server/tmp/".$tableName."_".$filename.".sql\",\"size\":\"$size\"}";
        }
    	$ret .= "]}";
    	echo "]}";
        return "";
    }
    function ldapLogin($pid, $pwd, $host){
    	$baseDn = 'ou=people,dc=vt,dc=edu';		
		$credential = $pwd;
		$return = array("code" => -1, "value" => false, "message" => "error");
		/*ldap will bind anonymously, make sure we have some credentials*/
		if (isset($pid) && $pid != '' && isset($credential)) {
			$ldap = @ldap_connect($host);
			//ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
			//ldap_start_tls($ldap);
			if (isset($ldap) && $ldap != '') {
				/* search for pid dn */
				$result = @ldap_search($ldap, " ", 'uid='.$pid);//, array('dn')
				if ($result != 0) {
					$entries = ldap_get_entries($ldap, $result);
					$principal = $entries[0]['dn'];
					if (isset($principal)) {
						/* bind as this user */
						if (@ldap_bind($ldap, $principal, $credential)) {
							$return = array("code" => 0, "value" => true, "message" => "success");
						} else {
							$return = array("code" => 1, "value" => false, "message" => "Password anda salah");
						}
					} else {
						$return = array("code" => 2, "value" => false, "message" => "User tidak ditemukan di LDAP");
					}
					ldap_free_result($result);
				} else {
					$return = array("code" => 3, "value" => false, "message" => "error LDAP");
				}
				ldap_close($ldap);
			} else {
				$return = array("code" => 4, "value" => false, "message" => "tidal bisa connect ke LDAP ".$host);
			}
		}
		return $return;		    
    }
    
    function LDAP_auth($pid, $pwd, $host = null){
	   try{	
		   $auth=0;
		   if (!isset($host)) return $auth;
		   //global $ldaphost;			
		   $ldapconfig['host'] = $host;
		   $ldapconfig['authrealm'] = 'User Intranet';		   
		   if ($pid != "" && $pwd != "") {				
				$ds= @ldap_connect($ldapconfig['host']) or die("Could not connect to $ldaphost");;
				if (isset($ds) && $ds != '') {				
					$r = @ldap_search( $ds, " ", 'uid=' . $pid);
					if ($r) {
						$result = @ldap_get_entries( $ds, $r);
						if (isset($result[0])) {
							if (@ldap_bind( $ds, $result[0]['dn'], $pwd) ) {
								$auth=1;
							}
						}
					}else error_log("e");
				}else error_log("tidak konek");
			}			
		   return $auth; 
		 }catch(Exception $e){			
			error_log($e->getMessage());
			return $auth = 0;
		 }
	}
    function getJurnalHtml($sql,$sql2){
		uses("server_util_AddOnLib");
		$rs=$this->execute($sql);	
		
		$i = $start+1;		
		$AddOnLib=new server_util_AddOnLib();
		echo "<br>";
		while ($row = $rs->FetchNextObject($toupper=false))
		{
			echo "<table border='1' cellspacing='0' cellpadding='0' class='kotak'>
  <tr>
    <td colspan='9' style='padding:5px'><table width='622' border='0' cellspacing='2' cellpadding='1'>
      <tr>
        <td colspan='2' align='center' class='header_laporan'>BUKTI JURNAL</td>
        </tr>
	  <tr>
        <td width='100' class='header_laporan'>No Bukti </td>
        <td width='496' class='header_laporan'>:&nbsp;$row->no_ju</td>
        </tr>
      <tr>
        <td width='100' class='header_laporan'>No Dokumen </td>
        <td width='496' class='header_laporan'>:&nbsp;$row->no_dokumen</td>
        </tr>
      <tr>
        <td class='header_laporan'>Periode</td>
        <td class='header_laporan'>:&nbsp;$row->periode</td>
        </tr>
      <tr>
        <td class='header_laporan'>Tanggal</td>
        <td class='header_laporan'>:&nbsp;$row->tanggal1</td>
        </tr>
     
	<tr>
        <td class='header_laporan'>Keterangan </td>
        <td class='header_laporan'>:&nbsp;$row->keterangan</td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td width='20' class='header_laporan'><div align='center'>No</div></td>
    <td width='50' class='header_laporan'><div align='center'>Akun</div></td>
    <td width='100' class='header_laporan'><div align='center'>Nama Akun </div></td>
    <td width='150' class='header_laporan'><div align='center'>Keterangan </div></td>
    <td width='40' class='header_laporan'><div align='center'>Kode PP </div></td>
    <td width='40' class='header_laporan'><div align='center'>Kode RKM </div></td>
    <td width='70' class='header_laporan'><div align='center'>Debet</div></td>
    <td width='70' class='header_laporan'><div align='center'>Kredit</div></td>
  </tr>";	  
		$rs1 = $this->execute($sql2);
		$i=1;
		$tot_debet=0;
		$tot_kredit=0;
		while ($row1 = $rs1->FetchNextObject($toupper=false))
		{
			$debet=number_format($row1->debet,0,",",".");
			$kredit=number_format($row1->kredit,0,",",".");
			$tot_debet=$tot_debet+$row1->debet;
			$tot_kredit=$tot_kredit+$row1->kredit;
			echo "<tr>
    <td class='isi_laporan' align='center'>$i</td>
    <td class='isi_laporan'>$row1->kode_akun</td>
    <td class='isi_laporan'>$row1->nama</td>
    <td class='isi_laporan'>$row1->keterangan</td>
    <td class='isi_laporan'>$row1->kode_pp</td>
    <td class='isi_laporan'>$row1->kode_drk</td>
    <td class='isi_laporan' align='right'>$debet</td>
    <td class='isi_laporan' align='right'>$kredit</td>
  </tr>";
		$i=$i+1;
		}
		$tot_debet1=number_format($tot_debet,0,",",".");
		$tot_kredit1=number_format($tot_debet,0,",",".");
	  echo "<tr>
   
    <td colspan='6' class='header_laporan' align='right'>Total</td>
    <td class='isi_laporan' align='right'>$tot_debet1</td>
    <td class='isi_laporan' align='right'>$tot_kredit1</td>
  </tr>
  <tr>
    <td colspan='9' align='right'><table width='714' border='0' cellspacing='0' cellpadding='0'>
      <tr>
        <td width='334'>&nbsp;</td>
        <td width='185'>&nbsp;</td>
        <td width='195'>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class='header_laporan'>Bandung, ".substr($row->tanggal,8,2)." ".$AddOnLib->ubah_periode(substr(str_replace("-","",$row->tanggal),0,6))."</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td class='header_laporan'>Diperiksa Oleh : </td>
        <td class='header_laporan'>Dibuat Oleh : </td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td height='40'>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td class='header_laporan'>$row->nama_setuju</td>
        <td class='header_laporan'>$row->nama_buat</td>
      </tr>
	  <tr>
        <td>&nbsp;</td>
        <td class='header_laporan'>$row->jabatan_setuju</td>
        <td class='header_laporan'>$row->jabatan_buat</td>
      </tr>
    </table></td>
  </tr>
</table><br>";
			
			$i=$i+1;
		}
		
		//$html = str_replace(chr(9),"",$html);
		
		return "";
	}
	function sqlToXls($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null, $summaryField = null, $groupHeader = null, $calFields = null, $namafile = null)
	{
		try{
			global $manager;
    		$manager->setSendResponse(false);	
			uses("server_xls_Writer", false);
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}
			$start = ($page - 1) * $rowPerPage;				
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);	
			if (!isset($namafile)) $namafile = "report.xls";
			$excel = new Spreadsheet_Excel_Writer();
			
			$excel->send($namafile);
			$excel->setCustomColor(14, 192,192,192); 
			
			$sheet =& $excel->addWorksheet('report');
			$headerFormat =& $excel->addFormat();
			$headerFormat->setBold();			
			$headerFormat->setBgColor(14);
			$headerFormat->setBorder(1);			
			$headerFormat->setBorderColor('black');
			$numFormat =& $excel->addFormat();
			$numFormat->setNumFormat("0.00");		
			$numFormat->setBorder(1);			
			$numFormat->setBorderColor('black');	
			$normalFormat =& $excel->addFormat();
			$normalFormat->setBorder(1);			
			$normalFormat->setBorderColor('black');	
			$rowcount = 0;
			if ($rs){
				$width = $width->getArray();
				$widthTable = 0;
				foreach ($title->getArray() as $key => $value) $widthTable += floatval( $width[$key] );								
				
				foreach ($title->getArray() as $key => $value)
					$sheet->write($rowcount, $key, $value, $headerFormat);					
				$fieldsType = $fieldType-> getArray();
				if (isset($calFields)){
					$tmp = $calFields->getArray();
					$calFields = array();
					foreach ($tmp as $key => $value){
						$field = explode(";", $value);						
						$calFields[$field[0]] = $field[1];
					}
				}											
				$no = $start;	
				if ($withTotal){
					$total = array();
					foreach ($title->getArray() as $key => $value)
						$total[$key] = "0";
				}
				if ($groupBy){
					$totalGroup = array();//penampung subtotal
					$fieldGroup = array();//penampung kode 
					$changeFieldStatus = array();
					$groupArray = $groupBy->getArray();
					foreach($groupArray as $key =>$value){
						$totalGroup[$value] = array();
						$fieldGroup[$value] = "";
						$changeFieldStatus[$value] = false;
					}
				}	
				if ($groupHeader) {
					$groupTmp = array();
					foreach($groupHeader->getArray() as $key => $value) {
						$groupTmp[$value] = $value;
					}
					$groupHeader = $groupTmp;
				}
				if ($summaryField != null)
						$summ = $summaryField->getArray();							
				while (!$rs->EOF)
				{		
					$rowcount++;
					for ($i = 0; $i < $rs->FieldCount(); $i++)
					{
						$value =  $rs->fields[$i];
						if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i] == "N")
							$sheet->write($rowcount, $i, $value, $numFormat);
						else $sheet->write($rowcount, $i, $value,$normalFormat);
					}								
					$rs->MoveNext();
				}
				if ($withTotal)
				{														
					$rowcount++;
					foreach ($title->getArray() as $key => $value){
						if ($fieldsType[$key] == "N"){							
							$start = Spreadsheet_Excel_Writer::rowcolToCell(1,$key);
							$end = Spreadsheet_Excel_Writer::rowcolToCell(($rowcount - 1), $key);
							$sheet->writeFormula($rowcount, $key, "=sum($start:$end)");
						}
					}										
				}
			}else{				
				$sheet->write($rowcount, 0, $this->db->ErrorMsg());					
			}
			$excel->close();
		}catch (exception $e) {
			error_log($sql);
			return "error" . $e->getMessage(); 
		}
		//$rs->close();
		//$this->db->Close();
		return $html;
	}
	function sqlToXls2($sql, $title, $namafile = null)
	{
		try{
			global $manager;
    		$manager->setSendResponse(false);		
    		
			uses("server_xls_Writer", false);
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}						
			$this->db->setFetchMode(ADODB_FETCH_NUM);
						
			if (!isset($namafile)) $namafile = "report.xls";
			$excel = new Spreadsheet_Excel_Writer();
						
			$excel->send($namafile);
			$excel->setCustomColor(14, 192,192,192); 
			
			$sheet =& $excel->addWorksheet('report');
			$headerFormat =& $excel->addFormat();
			$headerFormat->setBold();			
			$headerFormat->setFgColor(14);
			$headerFormat->setPattern(1);
			$headerFormat->setBorder(1);			
			$headerFormat->setBorderColor('black');
			$numFormat =& $excel->addFormat();
			$numFormat->setNumFormat("#,##0");		
			$numFormat->setBorder(1);			
			$numFormat->setBorderColor('black');	
			$normalFormat =& $excel->addFormat();
			$normalFormat->setBorder(1);			
			$normalFormat->setBorderColor('black');
			$sumFormat =& $excel->addFormat(array('numformat' => '#,##0', 'border' => 1, 'borderColor' => 'black', 'fgcolor' => 'yellow', 'pattern' => '1'));			
			$sumFormat2 =& $excel->addFormat(array( 'border' => 1, 'borderColor' => 'black', 'fgcolor' => 'yellow', 'pattern' => '1'));
			$rowcount = 0;
			foreach ($title->getArray() as $key => $value)
					$sheet->write($rowcount, $key, $value, $headerFormat);				
			
			$rs = $this->db->Execute("select count(*) as tot from (". $sql .") a");		
			$rowPerPage = 500;
			if ($rs)
			{
				$count = $rs->fields[0];
				$rowPerPage = $count;
			}
			
			
			$pg= 1;			
			$pgtmp = ceil($rowPerPage / 500);
			$pgtmp = $pg + ($pgtmp -1);
			$rowPerPage = 500;				

			$sheetC =0;
			for ($page = $pg; $page <= $pgtmp; $page++){
				$start = ($page - 1) * $rowPerPage;				
				$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);			
				//$rs = $this->db->Execute($sql);
				if ($rs){
					$fieldType = array();				
														
					while (!$rs->EOF){
						$rowcount++;
						if ($rowcount >= 65535){ 
							foreach ($fieldType as $key => $value){							
								if ($key == 0) $sheet->write($rowcount, 0, "Total", $sumFormat2);										
								else if ($value == "N" || $value == "real" || $value == "float" || $value == "decimal" || $value == "NUMBER"){
									$start = Spreadsheet_Excel_Writer::rowcolToCell(1,$key);
									$end = Spreadsheet_Excel_Writer::rowcolToCell(($rowcount - 1), $key);
									error_log("=sum($start:$end)");
									$sheet->writeFormula($rowcount, $key, "=sum($start:$end)", $sumFormat);
								}else $sheet->write($rowcount, $key, " ", $sumFormat2);
							}	
							$sheetC++;							
							$sheet =& $excel->addWorksheet("report $sheetC");
							$rowcount = 0;
							foreach ($title->getArray() as $key => $value)
									$sheet->write($rowcount, $key, $value, $headerFormat);				
							$rowcount++;
						}
						
						for ($i = 0; $i < $rs->FieldCount(); $i++)
						{
							$value =  $rs->fields[$i];
							if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $rs->FetchField($i)->type == "float" || $rs->FetchField($i)->type == "decimal" || $rs->FetchField($i)->type == "i" || $rs->FetchField($i)->type == "I" || $rs->FetchField($i)->type == "NUMBER")
								$sheet->write($rowcount, $i, $value, $numFormat);
							else $sheet->writeString($rowcount, $i, $value,$normalFormat);
							$fieldType[$i] = $rs->FetchField($i)->type;
						}								
						$rs->MoveNext();
						$first = false;
					}					
				}
			}
			if ($rs){
					$rowcount++;
					foreach ($fieldType as $key => $value){							
						if ($key == 0) $sheet->write($rowcount, 0, "Total", $sumFormat2);										
						else if ($value == "N" || $value == "real" || $value == "float" || $value == "decimal" || $value == "NUMBER"){
							$start = Spreadsheet_Excel_Writer::rowcolToCell(1,$key);
							$end = Spreadsheet_Excel_Writer::rowcolToCell(($rowcount - 1), $key);
							error_log("=sum($start:$end)");
							$sheet->writeFormula($rowcount, $key, "=sum($start:$end)", $sumFormat);
						}else $sheet->write($rowcount, $key, " ", $sumFormat2);
					}				
			}else{				
				$sheet->write($rowcount, 0, $this->db->ErrorMsg());					
			}
			$excel->close();
		}catch (exception $e) {
			error_log($sql);
			return "error" . $e->getMessage(); 
		}
		//$rs->close();
		//$this->db->Close();
		return $html;
	}
	function sqlToXls3($sql, $title, $namafile = null)
	{
		try{			
			uses("server_xls_Writer", false);
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			$dbdriver = $this->connection->driver;
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {
				$sql = $this->sqlConvertSqlSvr($sql);				
			}else if ($dbdriver == "oci8"){
				$sql = $this->sqlConvertOra($sql);
			}						
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			$rs = $this->db->Execute($sql);	
			if (!isset($namafile)) $namafile = "report.xls";
			global $manager;
			$namafile = md5(date("r")) . "_". $namafile;
			$excel = new Spreadsheet_Excel_Writer($manager->getTempDir() . "/$namafile");//
			
			//$excel->send($namafile);
			$excel->setCustomColor(14, 192,192,192); 
			
			$sheet =& $excel->addWorksheet('report');
			$headerFormat =& $excel->addFormat();
			$headerFormat->setBold();			
			$headerFormat->setFgColor(14);
			$headerFormat->setPattern(1);
			$headerFormat->setBorder(1);			
			$headerFormat->setBorderColor('black');
			$numFormat =& $excel->addFormat();
			$numFormat->setNumFormat("#,##.00");		
			$numFormat->setBorder(1);			
			$numFormat->setBorderColor('black');	
			$normalFormat =& $excel->addFormat();
			$normalFormat->setBorder(1);			
			$normalFormat->setBorderColor('black');
			$sumFormat =& $excel->addFormat(array('numformat' => '#,##.00', 'border' => 1, 'borderColor' => 'black', 'fgcolor' => 'yellow', 'pattern' => '1'));			
			$sumFormat2 =& $excel->addFormat(array( 'border' => 1, 'borderColor' => 'black', 'fgcolor' => 'yellow', 'pattern' => '1'));
			$rowcount = 0;
			foreach ($title->getArray() as $key => $value)
					$sheet->write($rowcount, $key, $value, $headerFormat);				
			if ($rs){
				$fieldType = array();				
				 									
				while (!$rs->EOF)
				{							
					$rowcount++;
					for ($i = 0; $i < $rs->FieldCount(); $i++)
					{
						$value =  $rs->fields[$i];
						if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $rs->FetchField($i)->type == "float")
							$sheet->write($rowcount, $i, $value, $numFormat);
						else $sheet->writeString($rowcount, $i, $value,$normalFormat);
						$fieldType[$i] = $rs->FetchField($i)->type;
					}								
					$rs->MoveNext();
					$first = false;
				}
				$rowcount++;
				foreach ($fieldType as $key => $value){					
					if ($key == 0) $sheet->write($rowcount, 0, "Total", $sumFormat2);					
					if ($value == "N" || $value == "real" || $value == "float"){							
						$start = Spreadsheet_Excel_Writer::rowcolToCell(1,$key);
						$end = Spreadsheet_Excel_Writer::rowcolToCell(($rowcount - 1), $key);
						$sheet->writeFormula($rowcount, $key, "=sum($start:$end)", $sumFormat);
					}
				}				
			}else{				
				$sheet->write($rowcount, 0, $this->db->ErrorMsg());					
			}
			$excel->close();
			return "server/tmp/$namafile";
		}catch (exception $e) {
			error_log($sql);
			return "error" . $e->getMessage(); 
		}
		//$rs->close();
		//$this->db->Close();
		return $html;
	}
	function getUserLog($lokasi)
	{	
		try
		{	
			$ret = $this->connect();
			if ($ret != "success") throw new Exception($ret);
			uses("server_DBConnection_dataModel");		
			$dbdriver = $this->connection->driver;								
			if ($dbdriver == "ado_mssql" || $dbdriver == "odbc_mssql") {	
				$sql = $this->sqlConvertSqlSvr("select a.uid, ifnull(b.nama,a.uid) as nama, ifnull(c.nama, a.userloc) as lokasi, a.timeacc, a.session,  a.form from userformacces a 
                           left outer join lokasi c on c.kode_lokasi = a.userloc 
                           left outer join karyawan b on b.nik = a.uid and b.kode_lokasi = a.userloc 
                           where a.userloc like '$lokasi%' order by a.timeacc desc, a.uid");
			}else if ($dbdriver == "oci8"){												
				$sql = $this->sqlConvertOra("select \"A\".\"UID\", nvl(b.nama,\"A\".\"UID\") as nama, nvl(c.nama, \"A\".\"USERLOC\") as lokasi, a.timeacc, a.session,  a.form from userformacces a 
                           left outer join lokasi c on c.kode_lokasi = a.userloc 
                           left outer join karyawan b on b.nik = a.uid and b.kode_lokasi = a.userloc 
                           where a.userloc like '$lokasi%' order by a.timeacc desc, a.uid");															
			}
			$rs = $this->db->Execute($sql);
			if ($rs)
			{	
				$model = new server_DBConnection_dataModel();
				$result = $model->getDataProvider($rs);	
				//$this->db->Close();
				$result = str_replace("\r\n","<br>",$result);
				$result = str_replace("\n","<br>",$result);
				$result = str_replace("\r","",$result);
				return $result;			
			}else {
				//$this->db->Close();
				return "Error::".$this->db->ErrorMsg();
			}
			
		}catch(Exception $e)
		{
			error_log($e->getMessage()."\r\n".$sql);
			return $e->getMessage();			
		}
	}
	function saveBlobToFile($table, $field, $filter, $fieldBlob, $fieldFilename){
		global $rootDir;
		$ret = $this->connect();
		$rs = $this->db->Execute("select $field from $table $filter");
		$result = "{\"rows\" : [ ";
		if ($rs){
			$first = true;
			while ($row = $rs->FetchNextObject(false)){
				$rowObj = (array) $row;
				if (!$first) $result .= ",";
				$data = $rowObj[$fieldBlob];
				$filename = $rowObj[$fieldFilename];
				$filename = $rootDir ."/media/$filename";
				file_put_contents($filename, $data);
				$line = "{";
				foreach($rowObj as $key => $value){
					if ($key != $fieldBlob)
						$line .= "\"".lower($key)."\":'". $value."' ";
				}				
				$line .= "}";
				$first = false;
			}
		}
		$result .= " ]";
		$result .= "}";
		return $result;
	}
	function onlineUser()
	{		
		$this->connect();
		$rs = $this->execute("select distinct a.\"UID\", b.nama, b.jabatan, b.kode_ubis from userlog a inner join rra_karyawan b on b.nik = a.\"UID\" where \"TIMEIN\" = \"TIMEOUT\" and to_char(\"TIMEIN\",'DD-MM-YYYY') = to_char(sysdate,'DD-MM-YYYY')");	
		$res = "{";
		$rows = "\"rows\":[";
		$first = true;
		while ($row = $rs->FetchNextObject(false)){
			if (!$first) $rows .= ",";
			$line = "{\"nik\":\"".$row->uid."\", ";
			$line .= "\"nama\":\"".$row->nama."\", ";
			$line .= "\"jabatan\":\"".$row->jabatan."\", ";
			$line .= "\"kode_ubis\":\"".$row->kode_ubis."\" }";			
			$rows .= $line;
			$first = false;
		}
		$rows .= "]";
		$res .= $rows;
		$res .= "}";
		return $res;
	}
	function listUser()
	{		
		$this->connect();
		$rs = $this->execute("select nik, nama, jabatan, kode_ubis from rra_karyawan order by nik");	
		$res = "{";
		$rows = "\"rows\":[";
		$first = true;
		while ($row = $rs->FetchNextObject(false)){
			if (!$first) $rows .= ",";
			
			$line = "{\"nik\":\"".$row->nik."\", ";
			$line .= "\"nama\":\"".$row->nama."\", ";
			$line .= "\"jabatan\":\"".$row->jabatan."\", ";
			$line .= "\"kode_ubis\":\"".$row->kode_ubis."\" } ";			
			$rows .= $line;
			$first = false;
		}
		$rows .= "]";
		$res .= $rows;
		$res .= "}";
		return $res;
	}
}

global $dbLib;
global $dbSetting;
$dbLib = new server_DBConnection_dbLib($dbSetting);


?>
