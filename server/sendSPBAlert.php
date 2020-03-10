<?php
	try{
	ob_end_clean();		
	if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
		ob_start("ob_gzhandler"); 
		header("Content-Encoding: gzip");
	}else ob_start();
	$result = "";

	
	include("library.php");
    if (!defined('NEW_LINE'))
	   define("NEW_LINE", "<br>\r\n");
	
    define("WIN", "win");
    define("LINUX", "linux");

    // OS Base separator
    global $platform;
    global $dirSeparator;
    global $separator;
    global $serverDir;
    
    $serverDir = __FILE__;

    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {
        $platform = WIN;
    	$dirSeparator = "\\";
        $separator = ";";
    }
    else
    {
        $platform = LINUX;
    	$dirSeparator = "/";
        $separator = ":";
    }

global $rootDir;

$pos = strrpos($serverDir, $dirSeparator);
$serverDir = substr($serverDir, 0, $pos);
$pos = strrpos($serverDir, $dirSeparator);
$rootDir = substr($serverDir, 0, $pos);
$pos = strrpos($rootDir, $dirSeparator);
$path = $rootDir;
$rootDir = substr($rootDir,$pos);

//----------------------------------
//-------------- error_log8

	ini_set('display_errors', 'Off');
	ini_set ('track_errors', 'On');	 
	ini_set ('max_execution_time', '259200');
	set_time_limit(0);	 
	//ini_set ('memory_limit', '2024M');
	ini_set ('post_max_size	', '20M');
	ini_set ('log_errors',   'On');
	ini_set ('error_log',    $path.$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."php_error.log");	
	//ini_set ('zlib.output_compression', 0);	
	set_include_path(get_include_path() . PATH_SEPARATOR . "C:\wamp\bin\php\php5.2.6\PEAR");
	set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php");
	set_include_path(get_include_path() . PATH_SEPARATOR . $dirSeparator."appl".$dirSeparator."php".$dirSeparator."lib".$dirSeparator."php".$dirSeparator."PEAR");
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server");	
	//set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."OLE");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."PHPExcel".$dirSeparator."Shared");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server".$dirSeparator."PHPExcel".$dirSeparator."Shared".$dirSeparator."OLE");	
	set_include_path(get_include_path() . PATH_SEPARATOR . $path .$dirSeparator."server/server/modules/codeplex");
	ini_set( 'date.timezone', 'Asia/Jakarta' );
	error_reporting (E_ALL & ~E_NOTICE &  ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_STRICT & ~E_WARNING);
		
//------------------	
	
uses("server_httpRequest");
uses("server_Request");
uses("server_Response");
uses("server_Manager");
global $manager;
$tempStr = $_POST['request'];	
	
$manager = new server_Manager($serverDir);
//------------------
		echo "entering....<br>";
		try{
			require_once "setting.php";
			require_once "library.php";
			require_once  "exsum.php";
				
				$dbLib = new server_DBConnection_dbLib("orarra");
				$dbKbm = new server_DBConnection_dbLib("orakbm");
				
				$exsum = new exsum();
				echo "starting...";
				$data = $getSPBAlert("20150114");
				
				foreach ($data as $val){
					$nik = $val["nikapp"];
					$pesan = "Approve SPB NO " . $val["po"] . " untuk Vendor ".$val["vendor"];
					echo $pesan;
					{
						$rs = $dbLib->execute("select * from simtel_user_device where nik ='$nik' ");
						while ($row = $rs->FetchNextObject(false)){
							$ret = $dbKbm->execute("insert into telkom_pushmessage(appid, token, pesan, os, nik, tgl_input, status)values
														('simtel','".$row->device_token."','".$pesan."','".$row->device_os."','".$nik."', sysdate, '0')");
					
						}

					}
				}
			
			function getSPBAlert($tgl){
				$rfc = new server_util_rfcLib("rra/sapdev");
				$login = new server_util_Map();
				//query 
				$login->set("user", "860107");
				$login->set("passwd", "pu860107");
				$sapImp = new server_util_Map(array(
										"I_DATUM" => $tgl 
										));
				$sapExpTable = new server_util_Map(array("T_OUTPUT","T_BNAME"));
				$sapImpTable = null;
				$dataSAP = $rfc->callRFC($login,"ZRFC_SPB_ALERT", $sapImp, $sapExpTable, $sapImpTable, null, true);
		
				$output = $dataSAP->get("T_OUTPUT");
				$rs = array();
				foreach ($output->getArray() as $val){
					$line = $val->get(0);
					$rs[] = array("po" =>$line->get("PYORD"), "vendor" => $line->get("ZNME1"),"nikapp" => $line->get("NIKAPP") ); 
				}
				return $rs;
			}
			
		}catch(Exception $e){
			echo "error ... ". $e->getMessage();

		}
	}catch(Exception $e){
		echo $e->GetMessage() . "...\n";
	}
?>
