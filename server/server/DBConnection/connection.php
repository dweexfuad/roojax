<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
require( "server/modules/ADODB/adodb5/adodb.inc.php");
require( "server/modules/ADODB/adodb5/adodb-xmlschema.inc.php" ); # or adodb-xmlschema03.inc.php
include_once("server/modules/ADODB/adodb5/toexport.inc.php");

uses("server_util_File");
uses("server_util_Config");

global $serverDir;
global $dirSeparator;
class server_DBConnection_connection 
{
	public $user;
	public $pass;
	public $dbName;
	public $dbHost;
	public $driver;
	public $db;
	public $connected = false;
	public $config;
	public $dbDriver;
	public function connect($driver, $host, $dbName, $user, $pass)
	{		
		$this->user = $user;
		$this->pass = $pass;
		$this->dbName = $dbName;
		$this->dbHost = $host;					
		try		
		{		    			
			$tmp = explode(":",$host);
			$socket = @fsockopen($tmp[0],$tmp[1]);			
			if (gettype($socket) == "Boolean"){
				return "Error:Server database down!!!";
			}			
			$this->db = ADONewConnection($driver); //# eg. 'mysql' or 'oci8' 
			$this->db->debug = false;			
			if ($driver == "ado_mssql"  || $driver == "odbc_mssql")
			{			  
			  $this->connected = $this->db->Connect($host, $user, $pass);
			  $this->db->hasTop = "TOP";			  
			}else if ($driver == "oci8"){
				$this->db->connectSID = false;
				$this->db->NLS_DATE_FORMAT = 'YYYY-MM-DD';						
				$this->connected = $this->db->Connect($host, $user, $pass, $dbName);				
			}else $this->connected = $this->db->PConnect($host, $user, $pass, $dbName); 				  		
			$this->dbDriver = $driver;					
			if ($this->connected != 1){
				error_log("Not Connect");
				error_log($this->db->ErrorMsg());
				return "error " .$this->db->ErrorMsg();
			}else return "success";
		}catch (exception $e)
        {			
			error_log($e->getMessage());
			return "error ". $e->getMessage();
		}
	}
	public function	changeDB($dbName)
	{
		try
		{
			$this->dbName = $dbName;
			$this->connected = $this->db->PConnect($this->dbHost, $this->user, $this->pass, $dbName);				
		}catch(Exception $e)
		{
			$this->connected = false;
			write($e->getMessage() . NEW_LINE);
		}
	}
	
	function readFileConfig($configName)
	{
		try
		{
			global $dbhost;
			global $dbuser;
			global $dbpass;
			global $database;
			global $dbdriver;			
			if ($configName != "dbSetting"){				
				if (file_exists("server/conf/$configName.conf")){	
					$this->config = new server_util_Config($configName);	
					$dbuser = $this->config->get("user"); 	
					$dbhost = $this->config->get("host"); 	
					$dbpass = $this->config->get("pass"); 
					$database = $this->config->get("database"); 
					$dbdriver = $this->config->get("driver"); 						
				}
			}	
			$this->user = $dbuser; 	
			$this->dbHost = $dbhost; 	
			$this->pass = $dbpass; 
			$this->dbName = $database; 
			$this->driver = $dbdriver; 	
			$this->dbDriver = $dbdriver;
			 	
			//error_log("loadfile ". $this->driver." ".$this->dbHost." ". $this->dbName." ". $this->user." ". $this->pass);
			return $this->connect($this->driver, $this->dbHost, $this->dbName, $this->user, $this->pass);
		}catch(Exception $e)
		{
			error_log("error :: " . $e->getMessage());
		}
		
	}
	function getDB()
	{
		return $this->db;
	}
	function isConnected()
	{
		return $this->connected;
	}
	function getDBName(){
		return $this->dbName ."-".$this->dbDriver;
	}
	function getDBHost(){
		return $this->dbHost;
	}
	function getDBDriver(){
		return $this->dbDriver;
	}
}
?>
