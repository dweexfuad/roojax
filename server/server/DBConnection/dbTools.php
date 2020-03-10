<?php 
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_DBConnection_dbConnection");
uses("server_BasicObject");
uses("server_util_Map");

class server_DBConnection_dbTools extends server_BasicObject
{
	protected $db;
	protected $connection;
	protected $setting;
	function __construct($fileConfig = null)
	{
		parent::__construct();				
		if ($fileConfig == null)
			$this->setting = "dbSetting";		
		else $this->setting = $fileConfig;		
		$this->init();
	}
	protected function doSerialize()
	{
		parent::doSerialize();		
		$this->serialize("setting", "string");		
	}
	function init()
	{
		parent::init();					
		$this->connection = new server_DBConnection_dbConnection();
		$this->connection->readFileConfig($this->setting);
		$this->db = $this->connection->getDB();		
	}
	function deinit()
	{
		parent::deinit();
	}
//---------------------------------------	
	function runQuery($sql)
	{	
		try
		{	
			uses("server_DBConnection_dataModel");		
			if (!strpos($sql,'date_format'))
				$sql = strtolower($sql);							
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				$model = new server_DBConnection_dataModel();
				$result = $model->listData($rs);		
				return $result;
			}else return "Error::".$this->db->ErrorMsg();
		}catch(Exception $e)
		{
			error_log($e->getMessage());
		}
	}
	function runSQL($sql)
	{	
		try
		{	
			uses("server_DBConnection_dataModel");		
			if (!strpos($sql,'date_format'))
				$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			if ($rs)
			{			
				$model = new server_DBConnection_dataModel();
				$result = $model->listDataObj($rs);	
				return $result;			
			}else return "Error::".$this->db->ErrorMsg();
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function execSQL($sql, $rowPerPage = null, $start = null){		
		try
		{			
			if (($rowPerPage == null) && ($start == null)) 
				$rs = $this->execute($sql);
			else 
				$rs = $this->LimitQuery($sql,$rowPerPage,$start );
			
			if ($rs){
				uses("server_DBConnection_dataModel");		
				$model = new server_DBConnection_dataModel();
				return  $model->listDataStruc($rs);		
			}else 
				throw new Exception($this->db->ErrorMsg() . "\r\n");
			return $ret;
		}catch(Exception $e)
		{
			error_log($e->getMessage());
			return $e->getMessage();			
		}
	}
	function getRowCount($sql, $rowPerPage)
	{
		$sql = strtolower($sql);
		$rs = $this->db->Execute($sql);
		if ($rs)
		{
			$result = $rs->fields[0];			
			$result = ceil($result  / $rowPerPage); 
			return $result;
		}else return "Error::".$this->db->ErrorMsg();
	}
	function execQuery($sql)
	{
		try
	  {
			if (!strpos($sql,'date_format'))
				$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				return "success execute";			
			}else return "Error::".$this->db->ErrorMsg();
			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function updateBlob($table, $col, $value, $id)
	{
		try
	  {					
			$rs = $this->db->UpdateBlob($table, $col, $value, $id);
			if ($rs)
			{	
				error_log("sukses " . $table . $col . $value . $id);
				return "success execute";			
			}else{ 
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
		try
	  {
			$sql = strtolower($sql);
			$data = $this->db->BlobDecode($blob);
			return $data;			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function execute($sql)
	{
		try
		{
			if (!strpos($sql,'date_format'))
				$sql = strtolower($sql);			
			$rs = $this->db->Execute($sql);
			if ($rs)
			{
				return $rs;			
			}else 
				return "Error::".$this->db->ErrorMsg();
			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function LimitQuery($sql, $ncounts, $offset)
	{
		try
		{
			if (!strpos($sql,'date_format'))
				$sql = strtolower($sql);
			$rs = $this->db->SelectLimit($sql, $ncounts, $offset);
			if ($rs)
			{
				return $rs;			
			}else return "Error::".$this->db->ErrorMsg();
			
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function execArraySQL($sql)
	{
		try
		{	
			$this->db->BeginTrans();
			{				
			foreach($sql->getArray() as $key=> $value)
				//$value = strtolower($value);
				$ok = $this->db->Execute($value);			
				if (!$ok) 
				{	
//					$this->db->FailTrans();
					error_log($value);
					throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
				}
			}
			$this->db->CommitTrans();
			return "process completed";
		}catch(Exception $e)
		{
			$this->db->RollbackTrans();
//			error_log("error " . $e->getMessage());
//			write($e->getMessage() . NEW_LINE);
			error_log($e->getMessage());
			return "error " .  $e->getMessage();
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
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			return "Success insert data";
			
		}catch(Exception $e)
		{
			return "Error : ". $e->getMessage();
		}
	}
	function locateData($tableName, $keyField, $keyValues, $return, $allFields = null)
	{
		try	
		{	
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
				if ($key < $count)
					$filter .= $value . " = '" . $valObj[$key] ."' and "; 
				else $filter .= $value . " = '" . $valObj[$key] ."' ";  
			}
			$sql .= $filter;
			//$sql .= " limit 1"; 
			$result = "";
			$sql = strtolower($sql);
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
			return $result;
		}catch(Exception $e)
		{
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
			return "edit data success (" . $result .")";
		}catch(Exception $e)
		{
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

			return "Delete data success ";
		}catch(Exception $e)
		{
			return "Error : " . $e->getMessage();
		}
	}
	function listData($sql, $page, $rowPerPage)
	{
	  $sql = strtolower($sql);	
	  $sqlA = $sql; 
	  $start = -1;	  
		if ($page > 0)
		{		
			$start = (($page-1) * $rowPerPage);
			$end = $page * $rowPerPage;
			$sql .= " limit ". $start . "," . $rowPerPage;
		}else $rowPerPage = -1;
		  try
		  {
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
  			return $result;
  		}catch(Exception $e)
  		{
  		  return "ERROR ->" .$e;
      }
  		
			
	//	error_log($sql);
		//return $this->runQuery($sql);						
	}
	function listDataObj($sql, $page, $rowPerPage)
	{
		$sql = strtolower($sql);	
		$sqlA = $sql; 
		$start = -1;	  
		if ($page > 0)
		{		
			$start = (($page-1) * $rowPerPage);
			$end = $page * $rowPerPage;
			//$sql .= " limit ". $start . "," . $rowPerPage;
		}else $rowPerPage = -1;
		try
		{			
			uses("server_DBConnection_dataModel");		  		
			$this->db->setFetchMode(ADODB_FETCH_NUM);
			$rs = $this->db->SelectLimit($sqlA, $rowPerPage,$start);      	        
			if ($rs) 
			{
					$model = new server_DBConnection_dataModel();
					$result = $model->listDataObj($rs);
					
			}else $result = "Error::".$this->db->ErrorMsg();		
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
			if ($lokasi == null) $lokasi = "%";
			$sql = "select max(periode) as periode from periode where kode_lokasi like '". $lokasi ."' ";						
			$rs = $this->db->Execute($sql);
			if ($rs)
			{			
				$result = $rs->fields[0];			
			}else $result = "Error::"+$this->db->ErrorMsg();
			
			return $result;
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function getPP($user,$lokasi = null)
	{
		try	
		{						
			if ($lokasi == null) $lokasi = '%';
			if ($this->connection->driver == "mysqlt")
				$sql = "select concat(a.kode_pp,';',b.nama) as k from karyawan a inner join pp b on b.kode_pp = a.kode_pp and a.kode_lokasi = b.kode_lokasi where a.nik = '" . $user . "' and a.kode_lokasi = '".$lokasi."' ";			
			else
				$sql = "select a.kode_pp+';'+b.nama as k from karyawan a left outer join pp b on b.kode_pp = a.kode_pp and a.kode_lokasi = b.kode_lokasi where a.nik = '" . $user . "' and a.kode_lokasi = '".$lokasi."'";						
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			$result = $rs->fields[0];
			return $result;
		}catch(Exception $e)
		{
			return "Error :" . $e->getMessage();
		}
	}
	function getLokasi($user)
	{
		try	
		{	
			$sql = "select kode_lokasi from hakakses where nik = '" . $user . "'";			
			$sql = strtolower($sql);
			$rs = $this->db->Execute($sql);
			$result = $rs->fields[0];
			return $result;
		}catch(Exception $e)
		{
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
	function getAllTables(){
		$res = $this->db->MetaTables("TABLE",false);
		$ret = "";
		for ($i=0; $i < sizeof($res); $i++)
		{
			$ret .= "," .$res[$i];
		}				
		$ret = substr($ret,1);
		return $ret;
	}
	function updateEngine(){
		try
		{
			$tabel = $this->db->MetaTables("TABLE",false);
			for ($i = 0; $i <= count($tabel); $i++) 
			{
			    $rs = $this->db->Execute("ALTER TABLE `$tabel[$i]`  ENGINE = InnoDB");
				if (!$ok) 
				{	
					error_log($value);
					throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
				}
			}
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
		return $ret;
	}
	function addUserLog($uid, $hostname, $userlok, $ip)
	{
		try
		{	
		   
			$this->db->BeginTrans();
			$ses = md5(date("r"));
			if ($this->connection->driver == "mysqlt")
				$value = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid ."', '". $userlok."', now(), '". $ses."','1900-01-01','". $hostname."','". $ip."' )";
			else $value = "insert into userlog(uid, userloc, timein, session, timeout, host, ip)values('" . $uid ."', '". $userlok."', getdate(), '". $ses."','1900-01-01','". $hostname."','". $ip."' )";
			$ok = $this->db->Execute($value);			
			if (!$ok) 
			{	
				error_log($value);
				throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
			}
			$this->db->CommitTrans();
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
			$this->db->BeginTrans();			
			if ($this->connection->driver == "mysqlt")
				$value = "update userlog set timeout = now() where session = '". $sesId ."'";
			else $value = "update userlog set timeout = getdate() where session = '". $sesId ."'";
			$ok = $this->db->Execute($value);			
			if (!$ok) 
			{	
				error_log($value);
				throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
			}
			$this->db->CommitTrans();
			return $ses;
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
			$this->db->BeginTrans();			
			if ($this->connection->driver == "mysqlt")	
				$value = "insert into userformacces(uid, userloc, timeacc, session, form)values('" . $uid ."', '". $userlok."', now(), '". $sesId."','". $form."' )";
			else $value = "insert into userformacces(uid, userloc, timeacc, session, form)values('" . $uid ."', '". $userlok."', getdate(), '". $sesId."','". $form."' )";
			$ok = $this->db->Execute($value);			
			if (!$ok) 
			{	
				error_log($value);
				throw new Exception($this->db->ErrorMsg() . "\r\n" .$value);
			}
			$this->db->CommitTrans();
			return $ses;
		}catch(Exception $e)
		{
			$this->db->RollbackTrans();
			error_log($e->getMessage());
			return "error " .  $e->getMessage();
		}
	}
	function sqlToHtml($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null)
	{
		$start = ($page - 1) * $rowPerPage;		
		//$sql = strtolower($sql);	
		$this->db->setFetchMode(ADODB_FETCH_NUM);
		$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);	
		$html = "<table border='1' cellspacing='0' cellpadding='0' class='kotak'>".
				"<tr bgcolor='#cccccc'>".
				"<td class='header_laporan' align='center' width=25>No</td>";		
		$width = $width->getArray();
		foreach ($title->getArray() as $key => $value)
			$html  .= "<td class='header_laporan' align='center' width=".$width[$key].">" . $value . "</td>";				
		$fieldsType = $fieldType->getArray();
		$html  .= "</tr>";	
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
			}
		}
		$firstRow = true;
		$allChange = false;
		while (!$rs->EOF)
		{		
			$no++;
			$tmpTr = "<tr><td height='20' class='isi_laporan'>".$no."</td>";
			for ($i = 0; $i < $rs->FieldCount(); $i++)
			{
				$value =  $rs->fields[$i];
				if ($groupBy && in_array($rs->FetchField($i)->name,$groupArray) ){										
					$valTmp = $value;
					foreach($groupArray as $key =>$field){
						if ($rs->FetchField($i)->name == $field && $fieldGroup[$field] == $value) {							
							$value = "";							
							$changeFieldStatus[$field] = false;
						}else if ($rs->FetchField($i)->name == $field) {																																									
							$fieldGroup[$field] = $value;																				
							$changeFieldStatus[$field] = true;
						}
						if ($key > 0){
							if ($changeFieldStatus[$groupArray[$key-1]]) {
								$value = $valTmp;
								$fieldGroup[$field] = $value;
								$changeFieldStatus[$field] = true;								
							}
						}						
					}					
				}								
					
				if ($rs->FetchField($i)->type == "N" || $rs->FetchField($i)->type == "real" || $fieldsType[$i] == "N" ){
					$tmpTr .= "<td class='isi_laporan' align='right'>".number_format($value,0,",",".")."</td>";
					if ($withTotal){
						$total[$i] = floatval($total[$i]) + floatval($value);
						if ($groupBy){
							foreach($groupArray as $key =>$field){
								$totalGroup[$field][$i] = floatval($totalGroup[$field][$i]) + floatval($value);																								
							}
						}
					}
				}else {
					$tmpTr .= "<td class='isi_laporan'>".$value."</td>";
				}
			}			
			if ($groupBy){					
				if ((!$firstRow)){							
					for($i = count($groupArray) - 1;$i > -1;$i--){						
						$field = $groupArray[$i];						
						if ($changeFieldStatus[$field]){
							$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
							$lewat = false;
							for ($j = 0; $j < $rs->FieldCount(); $j++){								
								if ($rs->FetchField($j)->name == $field) $lewat = true;
								if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N")
									$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
								else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".($rs->FetchField($j)->name == $field ? "Sub Total" :"")."</td>";							 
							}
							$html .= "</tr>";			
							for ($j = 0; $j < $rs->FieldCount(); $j++){								
								if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N"){
									$totalGroup[$field][$j] = 0;		
								}
							}
						}
					}							
				}
			}
			$html .= $tmpTr . "</tr>";						
			$firstRow = false;
			$rs->MoveNext();
		}		
		if ($withTotal){						
			if ($groupBy){					
				if ((!$firstRow)){							
					for($i = count($groupArray) - 1;$i > -1;$i--){						
						$field = $groupArray[$i];										
						$html .= "<tr><td height='20' class='isi_laporan'>&nbsp;</td>";	
						$lewat = false;
						for ($j = 0; $j < $rs->FieldCount(); $j++){								
							if ($rs->FetchField($j)->name == $field) $lewat = true;
							if ($rs->FetchField($j)->type == "N" || $rs->FetchField($j)->type == "real" || $fieldsType[$j] == "N")
								$html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")." class='isi_laporan' align='right'>". number_format($totalGroup[$field][$j],0,",",".") ."</td>";							
							else $html .= "<td ". ($lewat ? " bgColor='#eeee00' ":"")."class='header_laporan'>".($rs->FetchField($j)->name == $field ? "Sub Total" :"")."</td>";							 
						}
						$html .= "</tr>";			
					}							
				}
			}
			$html .= "<tr bgcolor='#ffff00'><td height='20' class='isi_laporan'>&nbsp;</td>";
			$first = true;
			foreach ($total as $key => $value)
			{				
				if ($fieldsType[$key] == "N"){
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
		$html.="</table>";
		return $html;
	}
	function sqlToHtmlGrouping($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy)
	{
		$start = ($page - 1) * $rowPerPage;		
		//$sql = strtolower($sql);	
		$this->db->setFetchMode(ADODB_FETCH_NUM);
		$rs = $this->db->SelectLimit($sql, $rowPerPage,$start);	
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
				if ($groupBy && in_array($rs->FetchField($i)->name,$groupArray) ){										
					$valTmp = $value;
					foreach($groupArray as $key =>$field){
						if ($rs->FetchField($i)->name == $field && $fieldGroup[$field] == $value) {							
							$value = "";							
							$changeFieldStatus[$field] = false;
						}else if ($rs->FetchField($i)->name == $field) {						
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
				if (!in_array($rs->FetchField($i)->name,$groupArray)){						
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
		return $html;
	}
	function sqlToXls($sql, $page, $rowPerPage, $title, $width, $fieldType, $withTotal=null, $groupBy = null, $file)
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
}
?>