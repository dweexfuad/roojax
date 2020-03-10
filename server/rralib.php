<?php
uses("server_DBConnection_dbLib");


class rralib
{
	function __construct()
	{
		$this->db = null;
	}
	
	function hello($param)
	{
		$result = "Hello $param ";
		
		return $result;
	}
	
	private function getDb()
	{
	
		if ($this->db == null)
		{
			$this->db = new server_DBConnection_dbLib("orarra");
		}
		
		return $this->db;
	}
	function cleanUp()
    {
    	global $serverDir;
        uses("server_util_File");
        $tmpDir = new server_util_File($serverDir . "/tmp");
        
        $oldest = strtotime("-24 hour");
        
        if ($tmpDir->isDir())
        {
            $fileList = $tmpDir->listDir();
            
            foreach ($fileList->getArray() as $key => $value)
            {
                if ($value->isFile() && (substr($value->getBaseFileName(), 0, 4) == "ses_"))
                {
                    if ($value->getModifTime() < $oldest)
                        $value->delete();
                }                             
            }
        }
    }
    function getDetailUserInfoFromPortal($nik){
		return file_get_contents("http://10.65.10.184/organisasi/index.php?c=org&m=cariorg&key=$nik");
	}
    function login($user, $pass){
		try{	
			$this->getDb();
			global $ldaphost;
			
			$result = array("userdata" => "", "type" => 0, "msg" => "","periode" => "", "serverinfo" => array(),"portalinfo" =>array());
			$this->getDb();
			$ret = $this->db->connect();
			if ($ret != "success") throw new Exception($ret);
		
			
			
			$auth = $this->db->LDAP_auth($user, $pass, $ldaphost);	
			session_regenerate_id();  									
			if ($auth == 1){//$auth == 1
				$detailPortal = json_decode($this->getDetailUserInfoFromPortal($user));
				if (count($detailPortal->items) > 0){
					foreach ($detailPortal->items as $value){
						if ($value->NIK == $user){
							$kd_unit = strtoupper($value->KD_UNIT);
							$nama = $value->NAMA;
						}
						if ($value->NIK_POH == $user){
							$kd_unit = strtoupper($value->KD_UNIT);
						}
						$jabatanid = $value->OBJ_POSISI;
						$jabatan = $value->VS_POSISI;
					}
					$result["portalinfo"] = $detailPortal;
				}
				$rs = $this->db->execute("select  a.kode_klp_menu, a.nik, a.nama, a.pass, a.status_admin, a.klp_akses, a.kode_lokasi,b.nama as nmlok 
									, c.kode_ubis, c.kode_gubis, ifnull(e.nik_app,d.nik_app1) as nik_app1, d.nik_app2, d.nik_app3, c.kode_kota
									, c.kode_ba, ifnull(d.nama, '-') as nmubis, ifnull(e.nama, '-') as nmgubis
									, c.kode_cc, c.status, c.kode_ba, nvl(c.sts_locked,'0') as sts_locked, d.singkatan 
							from hakakses a 
								inner join lokasi b on b.kode_lokasi = a.kode_lokasi 
								left outer join rra_karyawan c on c.nik = a.nik and c.kode_lokasi = a.kode_lokasi 
								left outer join rra_ubis d on d.kode_ubis = c.kode_ubis and d.kode_lokasi = c.kode_lokasi 
								left outer join rra_ba e on e.kode_ba = c.kode_ba and e.kode_lokasi = c.kode_lokasi 
							where a.nik= '$user'");
						
				if ($row = $rs->FetchNextObject(false))
				{
					$result["userdata"] = (array) $row;
					
				}else {
					$result["msg"] = "User Profile tidak ditemukan";		
				 	$result["type"] = 1;
				 	throw new Exception("User Profile tidak ditemukan");
				}
					
				$loginOk = true;
				//$this->sendMail("","650882@telkom.co.id", "Akun $user login",  "login RKAP");
			}else {
				$result["msg"] = "User Profile tidak ditemukan";		
			 	$result["type"] = 1;
			 	throw new Exception("User Profile tidak ditemukan");
			}			
			
			if ($loginOk){
				$rs = $this->db->execute("select to_char(sysdate,'YYYYMM') as periode, to_char(sysdate,'YYYYMM') as periode_sys from dual");
				if ($row = $rs->FetchNextObject(false))
					$result["periode"] = $row->periode;				
				
				$result["session"] = session_id();
				//$_SESSION["pass"] = $pass;
				$_SESSION["username"] = $user;
				
				$session = $result["session"];//md5(date("r"));
				$path = $_SERVER["REQUEST_URI"];
				global $dirSeparator;
				global $serverDir;			
				$rootPath = substr($serverDir,0,strpos($serverDir,"server") - 1);
				for ($i = 0; $i < 2; $i++){
					  $path = substr($path,0,strrpos($path,"/"));		
				} 
				$ip = $_SERVER["REMOTE_ADDR"];
				global $dbConnection;
				$serverinfo = array("ip" => $ip, "host" => GetHostByName($ip), "dbname" => $dbConnection->dbName . "-" . $dbConnection->dbDriver,
									"dbhost" => $dbConnection->dbHost, "driver" => $dbConnection->dbDriver,
									"path" => $path, "http_host" => $_SERVER["HTTP_HOST"], "root" => $rootPath,
									"url" => $_SERVER["REQUEST_URI"] );
				//$result["serverinfo"] = $serverinfo;
				$this->db->execute("insert into userlog(id,\"UID\", \"TIMEIN\", \"SESSION\", \"TIMEOUT\", host, ip)
									values(0,'$user',sysdate,  '$session',sysdate,'".GetHostByName($ip)."','".$ip."'  )");
			}
			
			
		}catch(Exception $e){
			$result["msg"] = $e->getMessage();		
			$result["type"] = 1;
		}
		//error_log(json_encode($result));
		return $result;
	}
	function logout($user){
		$this->getDb();
		$session = session_id();
		$this->db->execute("update userlog set \"TIMEOUT\" = sysdate where \"session\" = '$session'");
		session_unset();
		session_destroy();
		return true;
	}
	function loadMenu($kodeMenu){
		$this->getDb();
		$result = array();
		$rs = $this->db->execute("select * from menu where kode_klp = '$kodeMenu' order by kode_klp, rowindex");
		while ($row = $rs->FetchNextObject(false)){
			$result[] = (array) $row;
		}
		return $result;
	}
	function getNoBuktiOtomatis($table, $field, $format, $formatNumber, $addFilter = null, $reverse = null){
		$this->getDb();
		$db = $this->db;
		$nb = $format . $formatNumber;
		$formatTmp = "";
		for ($i = 0; $i < strlen($formatNumber); $i++)
			$formatTmp .= "_";
		if ($reverse)
			$rs =$db->execute("select max($field) as no_bukti from $table where $field like '".$formatTmp.$format."' $addFilter");
		else 
			$rs =$db->execute("select max($field) as no_bukti from $table where $field like '".$format.$formatTmp."' $addFilter");
	
		while ($row = $rs->FetchNextObject(false)){
			$nb = $row->no_bukti;
		}
		if ($reverse)
			$no = floatval(substr($nb,0,strlen($formatNumber)));
		else 
			$no = floatval(substr($nb,strlen($format)));
		$no ++;
		$noStr = (string) $no;
		$len = strlen($noStr);
	
		for ($i = $len; $i < strlen($formatNumber); $i++){
			$noStr = "0" . $noStr;	
		}
		if ($reverse)
			$nb = $noStr . $format;	
		else 
			$nb = $format . $noStr;	
		return $nb;
	}
	function listKaryawan($ubis){
		
	}
	function listBA($ubis){
		
	}
	function getInbox($nik){
		//cek Session
		if (isset($_SESSION["username"])){
			$this->getDb();
			$detailPortal = json_decode($this->getDetailUserInfoFromPortal($nik));
			if (count($detailPortal->items) > 0){
				foreach ($detailPortal->items as $value){
					if ($value->NIK == $user){
						$kd_unit = strtoupper($value->KD_UNIT);
						$nama = $value->NAMA;
					}
					if ($value->NIK_POH == $user){
						$kd_unit = strtoupper($value->KD_UNIT);
					}
					$jabatanid = $value->OBJ_POSISI;
					$jabatan = $value->VS_POSISI;
				}
			}
			$rs = $this->db->execute("select a.no_pdrk, a.tgl, a.catatan, a.dari from rra_posisi_pdrk a where nik = '$nik' or jabatan = '$jabatanid' ");
			$result = array();
			while ($row = $rs->FetchNextObject(false)){
				$result[] = (array) $row;
			}
			return $result;
		}
	}
	function mySentItem($nik){
		if (isset($_SESSION["username"])){
			
		}
	}
	function savePDRK($header, $donor, $penerima, $justifikasi, $dokumen){
		//cek Session			
	}
	function editPDRK($header, $donor, $penerima, $justifikasi, $dokumen){
		
	}
	function cancelPDRK($pdrk){
		
	}
	function deletePDRK($pdrk){
		
	}
	function validasiPDRK($donor, $penerima){
		//cek Session		
	}
	// PDRK
	function saveAsDraft($header, $donor, $penerima, $justifikasi, $lampiran, $kajian, $catatan, $sukka){
		//cek Session		
	}
	function approvePDRK($pdrk, $catatan){
		//cek Session		
	}
	function disposisi($pdrk, $catatan){
		//cek Session		
	}
	function returnPDRK($pdrk, $catatan){
		
	}
	// SUKKA
	function saveSUKKA($header, $nota){
		
	}
	function saveAsDraftSUKKA($header, $nota){
		
	}
	function approveSUKKA($sukka, $catatan){
		
	}
	function returnSUKKA($sukka, $catatan){
		
	}
	// tools
	function getSaldo($akun, $cc, $wbs = null){
		//cek Session		
	}
	function getFMDeriver($wbs){
		
	}
	function listAkunOfWBS($wbs){
		
	}
	function getDetailWBS($wbs){
		
	}
	
	function searchPDRK($pdrk){
		
	}
	function monitoringPDRK($filter){
		
	}
	function getPosisiWorkflow($prdk){
		
	}
	function updatePosisiPDRK($pdrk,$posisi){
		
	}
}
?>