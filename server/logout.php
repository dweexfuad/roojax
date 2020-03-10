<?php
	try{
		error_reporting (E_ALL & ~E_NOTICE );
		global $dirSeparator;
		global $serverDir;
		$serverDir = __FILE__;
		$dirSeparator = "/";
		$pos = strrpos($serverDir, $dirSeparator);
		$serverDir = substr($serverDir, 0, $pos);
	
		include_once("library.php");
				
		uses("server_DBConnection_dbLib");				
		$dbLib = new server_DBConnection_dbLib($_POST["param"]);		
		$dbLib->execute("update userlog set timeout = now() where \"SESSION\" = '".$_POST["uid"]."'");	
		$rs = $dbLib->execute("select \"UID\" from userlog where \"SESSION\" = '".$_POST["uid"]."'");	
		if ($rs){
			$uid = $rs->FetchNextObject(false);
			$dbLib->execute("insert into chat(dari,kepada,pesan,tanggal,status, tipe)values('-','-','".$uid->uid." logout',sysdate,'N','O')");
		}
		
	}catch(Exception $e){
		echo $e->GetMessage() . "...\n";
	}
?>
