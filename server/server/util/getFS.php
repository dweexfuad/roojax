<?php
	try{
		global $dirSeparator;
		global $serverDir;
		$serverDir = __FILE__;
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
	    {
	        $dirSeparator = "\\";
	        $separator = ";";
	    }
	    else
	    {
	        $dirSeparator = "/";
	        $separator = ":";
	    }
	    echo $serverDir."<br>";
		$pos = strrpos($serverDir, $dirSeparator);
		$serverDir = substr($serverDir, 0, $pos);
		echo $serverDir."<br>";
		$pos = strrpos($serverDir, $dirSeparator);
		$rootDir = substr($serverDir, 0, $pos);
		$pos = strrpos($rootDir, $dirSeparator);
		echo $rootDir."<br>$dirSeparator<br>";
		$path = $rootDir;
		$rootDir = substr($rootDir,$pos);
		ini_set('display_errors', 'Off');
		ini_set ('track_errors', 'On');
		//ini_set ('max_execution_time', '30');
		//ini_set ('memory_limit', '2024M');
		ini_set ('post_max_size	', '20M');
		ini_set ('log_errors',   'On');

		ini_set ('error_log',    $path.$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."php_error.log");
		set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php");
		set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php".$dirSeparator."PEAR");
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server");
		//set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."OLE");
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."PHPExcel".$dirSeparator."Shared");
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."PHPExcel".$dirSeparator."Shared".$dirSeparator."OLE");
		set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex");

		error_reporting (E_ALL & ~E_NOTICE);
		echo "start..<br>";
		include_once("library.php");
		echo "load dblib..<br>";
		uses("server_DBConnection_dbLib");
		echo "load arrayList..<br>";
		uses("server_util_arrayList");
		uses("server_util_Map");
		$done = false;
		$dbLib = new server_DBConnection_dbLib("orarra");
		$periode = date("Y");
		$jam = date("H");
		echo "starting...<br>";
		$rs = $dbLib->execute("select nama, modul from spro where kode_spro = 'DEFUID' ");
		$row = $rs->FetchNextObject(false);
		//if (floatval($jam) == 1)
		{
			try{
				uses("server_util_rfcLib");
				echo ("Loading....<br>" );
				$options = "rra/sapdev";
				$rfcLib = new server_util_rfcLib($options);

				$user = $_GET["u"];
				$pwd = $_GET["p"];
				$login = new server_util_Map();
				$login->set("user", $user);
				$login->set("passwd", $pwd);
				$rfc = $rfcLib->login($user,$pwd);


				$result = array("fs" => array());
				$sapImp = new server_util_Map(array(
											"IM_VERSN" 		=> $_GET["v"] ,
											"REPORT_LEDGER" => $_GET["l"],
											"REPORT_PERIO_HIGH" => $_GET["p1"],
											"REPORT_PERIO_LOW" 	=> $_GET["p2"],
											"REPORT_YEAR" 	=> $_GET["y"]
										));
				$bedat = new server_util_arrayList();
				$bedat->add(array("SIGN" => "I", "OPTION" => "EQ", "LOW" => "1000", "HIGH" => ""));

				$sapImpTab = new server_util_Map(array(	"R_BUKRS" => $bedat,"R_KTOPL" => $bedat));
				$sapExpTab = new server_util_Map(array("GT_GRIDOUTTAB","GT_OUTPUT"));
				$sapres = $rfcLib->callRFCToJSON($login,"ZRFC_FIN_STAT_V2", $sapImp, $sapExpTab, $sapImpTab, null, true, false, $rfc);

				$sql = new server_util_arrayList();

				if ($rfc){
					$list = $sapres->get("GT_GRIDOUTTAB");
					$listd = $sapres->get("GT_OUTPUT");
					$y = $_GET["y"];
					$p1 = $_GET["p1"];
					$p2 = $_GET["p2"];
					foreach ($list as $value){
						$value["BLC"] = floatval($value["BLC"]);
						$ERGSL = $value["ERGSL"];
						$TXT45 = $value["TXT45"];
						$blc = $value["BLC"];
						$sql->add("insert into simtel_fs(ERGSL,TXT45, BLC, TAHUN, PERIODE, PERIODE2)values('$ERGSL','$TXT45',$blc,'$y','$p1','$p2')");
					}
					foreach ($listd as $value){
						$value["BLC"] = floatval($value["BLC"]);
						$ERGSL = $value["ERGSL"];
						$TXT45 = $value["TXT45"];
						$blc = $value["BLC"];
						$sql->add("insert into simtel_fsd(ERGSL,TXT45, BLC, TAHUN, PERIODE, PERIODE2)values('$ERGSL','$TXT45',$blc,'$y','$p1','$p2')");
					}
					echo "done";
				}else {
					$message = saprfc_error();
					echo $message ."<br>";
				}
				$res = $dbLib->execArraySQL($sql);
				echo $res;
			}catch(Exception $e){
				echo $e->getMessage();
			}

		}

	}catch(Exception $e){
		//echo "<script> setTimeout(\"location = 'getTBCC.php'\",5000); </script>";
		echo $e->getMessage() . "...\n";
	}
?>
