<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_ShareObject");
uses("server_util_Map");
uses("server_util_arrayList");
uses("server_BasicObject");
uses("server_DBConnection_dbLib");
uses("server_util_AddOnLib");
class server_app_rra_chat  extends server_BasicObject
{	
	var $dbLib;
	function __construct()
	{				
		parent::__construct();		
		global $dbSetting;
		global $userlog;			
	}
	protected function doSerialize()
	{
		parent::doSerialize();		
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}			
	function send($from, $to, $msg)
	{
		//insert into 
		try{	
			$dbLib = new server_DBConnection_dbLib($dbSetting);			
			$dbLib->connect();		
			$ok = $dbLib->db->Execute("insert into chat(dari,kepada,pesan,tanggal,status, tipe)values('$from','$to','$msg',sysdate,'N','M')");
			if (!$ok){
				return "Error " . $dbLib->db->ErrorMsg();
			}else return "{\"msg\" : '$msg', \"kepada\":'$to'}";
			return $id;
		}catch(Exception $e){
			return "error $e";
		}
		
	}	
	function updateStatus($chatId){
		
	}
	function listMessage($user, $to)
	{

		$dbLib = new server_DBConnection_dbLib($dbSetting);
		$dbLib->connect();		
		$rs = $dbLib->execute("select chatid,dari,kepada,pesan,to_char(tanggal,'DD-MM-YYYY HH:MI:SS') as tgl, tipe 
							from chat where kepada = '$user' and status = 'N' 
							union 
							select chatid,dari,kepada,pesan,to_char(tanggal,'DD-MM-YYYY HH:MI:SS') as tgl, tipe 
							from chat where kepada = '-' and tipe = 'B' and status = 'N' 
							union 
							select chatid,dari,kepada,pesan,to_char(tanggal,'DD-MM-YYYY HH:MI:SS') as tgl, tipe 
							from chat where kepada = '-' and tipe in ('L','O') and status = 'N' ");
		$res = "{";
		$rows = "\"rows\":[";
		$first = true;
		while ($row = $rs->FetchNextObject(false)){
			if (!$first) $rows .= ",";
			$line = "{\"chatid\":\"".$row->chatid."\", ";
			$line .= "\"dari\":\"".$row->dari."\", ";
			$line .= "\"kepada\":\"".$row->kepada."\", ";
			$line .= "\"tgl\":\"".$row->tgl."\", ";
			$line .= "\"tipe\":\"".$row->tipe."\", ";
			$line .= "\"msg\":\"".$row->pesan."\"} ";
			$rows .= $line;
			$first = false;
		}
		$rows .= "]";
		$res .= $rows;
		$res .= "}";
		$ok = $dbLib->execute("update chat set status='1' where (kepada = '$user' or tipe in ('O','L')) and status = 'N'");
		return $res;

	}	
	function broadcast($msg)
	{
		try{	
			$dbLib = new server_DBConnection_dbLib($dbSetting);
			$dbLib->connect();			
			$ok = $dbLib->db->Execute("insert into chat(dari,kepada,pesan,tanggal,status, tipe)values('-','-','$msg',sysdate,'N','B')");
			if (!$ok){
				return "Error " . $dbLib->db->ErrorMsg();
			}
			return $id;
		}catch(Exception $e){
			return "error $e";
		}
	}
	
}
?>
