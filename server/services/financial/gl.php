<?php

uses("services_Services");
global $serverDir;
ini_set ('error_log',    $serverDir ."/tmp/gl_error.log");	
class services_financial_gl extends services_Services{
	
    function __construct()
	{
		parent::__construct();
		global $serverDir;
		if (file_exists($serverDir ."/tmp/gl_error.log"))
			unlink($serverDir ."/tmp/gl_error.log");
		
	}
	function writeErrorLog($error){
		$time = "[". date("d-m-Y H:i:s")."]";
		global $serverDir;
		
		error_log($time . " ". $error . "\r\n",3,"$serverDir/tmp/gl_error.log");
    }
    function getDb()
	{
	
		if ($this->db == null)
		{
			$this->db = new server_DBConnection_dbLib("mssql");
		}
		
		$this->dbLib = $this->db;
		return $this->db;
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
	function login($user, $pass){
		try{
			global $ldaphost;

			$this->cleanUp();
			$result = array("userdata" => "", "type" => 0, "msg" => "","periode" => "", "serverinfo" => array(),"portalinfo" =>array());
			$db = $this->getDb();
			//$ret = $this->db->connect();
			//if ($ret != "success") throw new Exception($ret);
		
			session_regenerate_id();  	
			$auth = 0;
			
			if ($auth == 1){//$auth == 1
				
			
				$sql = "select  a.kode_klp_menu, a.nik, a.nama, '-' as pass, a.status_admin, a.klp_akses, a.kode_lokasi,b.nama as nmlok 
                                , c.kode_pp, c.jabatan
							from hakakses a 
								inner join lokasi b on b.kode_lokasi = a.kode_lokasi 
								inner join karyawan c on c.nik = a.nik and c.kode_lokasi = a.kode_lokasi 
						where a.nik = '$user'";
				
				$rs = $this->db->execute($sql);
				if ($row = $rs->FetchNextObject(false))
				{
					$result["userdata"] = (array) $row;
					
				}else {
					{		
						$result["msg"] = "User Profile tidak ditemukan";		
						$result["type"] = 1;
						throw new Exception("User Profile tidak ditemukan");
					}
				}
					
				$loginOk = true;
			}else {
                $sql = "select  a.kode_klp_menu, a.nik, a.nama, a.pass, a.status_admin, a.klp_akses, a.kode_lokasi,b.nama as nmlok 
                                , c.kode_pp, c.jabatan
                            from hakakses a 
                                inner join lokasi b on b.kode_lokasi = a.kode_lokasi 
                                inner join karyawan c on c.nik = a.nik and c.kode_lokasi = a.kode_lokasi 
                        where a.nik = '$user' ";
                $rs = $this->db->execute($sql);

				if ($row = $rs->FetchNextObject(false)){
                    if ($row->pass == md5($pass) || md5($row->pass) == md5($pass) ) {
                        $result["userdata"] = (array) $row;
				 	    $loginOk = true;
                    }else{
                        $result["msg"] = "Password atau UserId anda salah";		
				        $result["type"] = 1;
                    }
				 	
				 }else 	{			
				  $result["msg"] = "Password atau UserId anda salah";		
				  $result["type"] = 1;
				}
			}				
			
			if ($loginOk){
                $lokasi = $result["userdata"]["kode_lokasi"];
                $rs = $this->db->execute("select max(periode) periode from periode where kode_lokasi = '$lokasi'");
                if ($row = $rs->FetchNextObject(false)){
                    $result["periode"] = $row->periode;
                }
				$result["periode"] = date("Ym");
				$result["session"] = session_id();
				$_SESSION["pass"] = $pass;
				$_SESSION["username"] = $user;
				
				$session = $result["session"];//md5(date("r"));
				$path = $_SERVER["REQUEST_URI"];
				 
				$ip = $this->get_client_ip();
				global $dbConnection;
				$serverinfo = array("ip" => $ip, "host" => GetHostByName($ip),
									"http_host" => $_SERVER["HTTP_HOST"], 
									"url" => $_SERVER["REQUEST_URI"] );
				$result["serverinfo"] = $serverinfo;
				$this->db->execute("insert into sai_sessions(username, tgl, ip,  tgl_logout, sessions_id, last_update)
									values('$user',getdate(),'$ip', getdate(), '$session', getdate())");
			}
			
			
		}catch(Exception $e){
			$result["msg"] = $e->getMessage();		
			$result["type"] = 1;
		}
		error_log(json_encode($result));
		return $result;
	}
	function getUserMenu($menu){
        $db = $this->getDb();
        $result =  $db->getDataXML("select * from menu where kode_klp = '$menu' order by kode_klp, rowindex");
        
        return $result;

	}
	function getForm($kode){
		$db = $this->getDb();
		$rs = $db->execute("select form from m_form where kode_form = '$kode'");
		if ($row = $rs->FetchNextObject(false)){
			return $row->form;
		}else {
			return "-";
		}
	}
	function getListJurnal($lokasi, $periode){
		$db = $this->getDb();
		$rs = $db->execute("select no_bukti, convert(varchar,tanggal,105) as tanggal, form, keterangan, nilai1 as nilai from trans_m where kode_lokasi = '$lokasi' and periode = '$periode'");
		$result = array("rs" => array("rows" => array()));
		while ($row = $rs->FetchNextObject(false)){
			$result["rs"]["rows"][] = (array)$row;
		}
		return $result;

	}
	function searchAkun($lokasi, $akun){
		$db = $this->getDb();
		$rs = $db->execute("select kode_akun, nama from masakun where kode_lokasi = '$lokasi' and (kode_akun like '$akun%' or nama like '%$akun%') ");
		$result = array("rs" => array("rows" => array()));
		while ($row = $rs->FetchNextObject(false)){
			$result["rs"]["rows"][] = (array)$row;
		}
		return $result;

	}
	function searchPp($lokasi, $pp){
		$db = $this->getDb();
		$rs = $db->execute("select kode_pp, nama from pp where kode_lokasi = '$lokasi' and (kode_pp like '$pp%' or nama like '%$pp%') ");
		$result = array("rs" => array("rows" => array()));
		while ($row = $rs->FetchNextObject(false)){
			$result["rs"]["rows"][] = (array)$row;
		}
		return $result;

	}
	function loadJurnal($lokasi, $nobukti){
		$db = $this->getDb();
		$sql = "select a.kode_akun, b.nama, a.dc, a.keterangan, a.kode_pp, c.nama as nama_pp, a.nilai from trans_j a 
			left outer join masakun b on b.kode_akun = a.kode_akun and b.kode_lokasi = a.kode_lokasi 
			left outer join pp c on c.kode_pp = a.kode_pp and c.kode_lokasi = a.kode_lokasi
			where a.kode_lokasi = '$lokasi' and no_bukti = '$nobukti' ";
		error_log($sql);
		$rs = $db->execute($sql);
		$result = array();
		while ($row = $rs->FetchNextObject(false)){
			$result[] = (array) $row;
		}
		return $result;
	}
	function logout($user){
		$this->getDb();
		$session = session_id();
		error_log("Session $session " . $this->userid ." " . $this->session);
		$this->db->execute("update sai_sessions set tgl_logout = sysdate where sessions_id = '$this->session'");
		session_unset();
		session_destroy();
		return true;
	}
}