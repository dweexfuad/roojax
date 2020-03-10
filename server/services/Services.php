<?php
uses("server_DBConnection_dbLib");
uses("server_util_NodeNRC");
uses("server_util_arrayList");
uses("server_util_rfcLib");

class services_Services{
    function __construct()
	{
		//$this->db = $this->getDb();
    }
    function getDb($config = null)
	{
	
		if ($this->db == null)
		{
			if (!isset($config))
				$config = "orarra";
			$this->db = new server_DBConnection_dbLib($config);
		}
		return $this->db;
	}
	function setUserId($userid){
		$this->userid = $userid;
	}
	function getFilterUbis($tableAlias, $ubis, $lokasi = null){
		if ($tableAlias != "") $tableAlias .= ".";
		if (!isset($lokasi)) $lokasi = $this->lokasi;
		return $tableAlias."kode_ubis in (
								select kode_ubis from exs_ubis 
								where kode_lokasi = '$lokasi'
								start with kode_ubis = '$ubis'
								connect by kode_induk = prior kode_ubis
								union 
								select 'T0' from dual
								union 
								select 'T000' from dual
								union 
								select kode_ubis from bpc_ubis 
								where kode_lokasi = '$lokasi'
								start with kode_ubis = '$ubis'
								connect by kode_induk = prior kode_ubis) ";
	}
	
	function getSAPConnection($compCode){
		$db = new server_DBConnection_dbLib("orarra");//$this->getDb();
		$rs = $db->execute("select a.kode_lokasi, b.ip, b.sys_id, b.ins_num, b.sap_router, a.sapuser, a.sappwd  
									from bpc_conn a 
									inner join bpc_sapconn b on b.kode = a.KODE_SERVER
							where a.kode_lokasi ='$compCode' ");

		if ($row = $rs->FetchNextObject(false)){
			error_log("SAP ". json_encode($row));
			$router = $row->sap_router;
			$host = $row->ip;
			$sysnr = $row->sys_id;
			$clientid = $row->ins_num;
			$codePage = "1100";
			$this->sapuser = $row->sapuser;
			$this->sappwd = $row->sappwd;
			$rfc = new server_util_rfcLib();
			if ($router == "-")
				$router = "";
			$rfc->setConfig($router . $host, $sysnr, $clientid, $codePage);
		}else {
			$rfc = new server_util_rfcLib("rra/sap");
		}
		return $rfc;
	}
	function getCOA($compCode){
		$db = $this->getDb();
		$rs = $db->execute("select coa   
									from bpc_coa a 
							where a.kode_lokasi ='$compCode' ");

		if ($row = $rs->FetchNextObject(false)){
			return $row->coa;
		}else {
			return $compCode;
		}

	}
	public function  cleanUp(){
		global $serverDir;
        uses("server_util_File");
        $tmpDir = new server_util_File($serverDir . "/tmp");
        
        $oldest = strtotime("-1 day");
        
        if ($tmpDir->isDir())
        {
            $fileList = $tmpDir->listDir();
            
            foreach ($fileList->getArray() as $key => $value)
            {
                if ($value->isFile() )//&& (substr($value->getBaseFileName(), 0, 4) == "ses_")
                {
                    if ($value->getModifTime() < $oldest)
                        $value->delete();
                }                             
            }
        }
	}
	function getLokKonsol(){
		$db = $this->getDb();
		$rs = $db->execute("select value1 from bpc_rules where kode_rules = 'LOKKONSOL'");
		if ($row = $rs->FetchNextObject(false)){
			return $row->value1;
		}else return "";
	}
	function isUbis($ubis){
		$rsUbis = $this->db->execute("select distinct kode_ubis,nama,rowindex, tipe from exs_ubis where kode_ubis ='$ubis' ");

		if ($row = $rsUbis->FetchNextObject(false)){
			return true;
		} else return false;
		
	}
	function isGubis($ubis){
		$rsUbis = $this->db->execute("select distinct kode_ubis,nama,rowindex, tipe from exs_ubis where kode_ubis ='$ubis' and level_spasi = 1 ");

		if ($row = $rsUbis->FetchNextObject(false)){
			return $row->level_spasi == 1;
		} else return false;
		
	}
	function isDivre($ubis){
		$rsUbis = $this->db->execute("select distinct kode_ubis  from exs_divre where kode_ubis ='$ubis' ");

		if ($row = $rsUbis->FetchNextObject(false)){
			return true;
		} else return false;
	}
	function isWitel($ubis){
		$rsUbis = $this->db->execute("select distinct kode_witel2  from exs_mappc where kode_witel2 ='$ubis' 
									union 
									select distinct kode_witel from exs_mappc where kode_witel ='$ubis' 
									");

		if ($row = $rsUbis->FetchNextObject(false)){
			return true;
		} else return false;
	}
	function getUbis($nik){
		$db = $this->getDb();
		$rs = $db->execute("select kode_ubis from exs_karyawan where nik = '$nik'");
		if ($row = $rs->FetchNextObject(false)){
			return $row->kode_ubis;

		}else return "";
	}
	function setSessionLokasi($lokasi){
		$this->lokasi = $lokasi;
	}
	//** BPC
	/**
	 * summariesJejer function.
	 * digunakan untuk menghitung summary untuk report jejer bulanan
	 * @access public
	 * @param mixed &$item	: item yang akan di proses
	 * @return void
	 */
	function summariesJejer(&$item){
		foreach ($item->childs as $val){
			if (!isset($item->checkingSummary)) {
				$item->checkingSummary = true;
				if ($item->dataArray["penetapan"] != 0){
					$item->checkingSummary = false;
				}
			}
			global $writeLog;
			if ($item->dataArray["kode_neraca"] == "P_NL"){
				$writeLog = true;
			}else if ($item->dataArray["kode_neraca"] == "P_R"){
				$writeLog = false;
			}
			$this->summariesJejer($val);
			foreach ($val->dataArray as $key => $value) {
				if ($key != "jenis_akun" && $key != "jenis" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex" && $key != "kode_si" )
				{
					if (!$key == "penetapan")
						;
					else
						$item->dataArray[$key] += $value;
				}
			}
			//if ($writeLog)
			//	error_log("summaries " . json_encode($item->dataArray));
				
			if ($val->data->sum_header != "-") {
				$sumheader = explode(",",$val->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "penetapan" &&  $key != "jenis_akun" && $key != "jenis" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex" && $key != "kode_si")
							{
								$nodeHeader->dataArray[$key] += $value;
							}
						}
					}
				}
			}

		}
	}

	/**
	 * generateResultJejer function.
	 * digunakan untuk generate data jejer bulanan per record
	 * @access public
	 * @param mixed $item	: item yang akan di proses
	 * @param mixed &$result	: array penampung prosess generate
	 * @return void
	 */
	function generateResultJejer($item, &$result){
		global $satuan;
		foreach ($item->childs as $val){
			
			if (strtoupper($val->data->jenis_akun) == "PENDAPATAN"){
				foreach ($val->dataArray as $key => $value) {
					if ($key != 'penetapan' && $key != 'jenis_akun' && $key != 'jenis' && $key != "kode_induk" &&  $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex"&& $key != "kode_si")
					{
						if ($val->data->tipe != "RASIO"){
							$val->dataArray[$key] = round($value / $satuan) * -1 ;
						}
					}else if ($key == "penetapan"){
						if ($val->data->tipe != "RASIO"){
							$val->dataArray[$key] = round($value / $satuan);
						}
					}
				}
			}else {
				foreach ($val->dataArray as $key => $value) {
					if ($key != 'jenis_akun' && $key != 'jenis' && $key != "kode_induk" &&  $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex"&& $key != "kode_si")
					{
						if ($val->data->tipe != "RASIO"){
							$val->dataArray[$key] = round($value / $satuan) ;
						}
					}
				}
			}
			//error_log("GenerateJejer ". json_encode($val->dataArray));
			if ($val->dataArray["sem1"] != null){
				$val->dataArray["contrib1"] = round($val->dataArray["sem1"] / $val->dataArray["aggthn"] * 100,2);
				$val->dataArray["contrib2"] = round($val->dataArray["sem2"] / $val->dataArray["aggthn"] * 100,2);
			}			
			if ($val->dataArray["budgetori1"] != null){
				$val->dataArray["ach1"] = round($val->dataArray["actbgt1"] / $val->dataArray["budgetori1"] * 100,2);
				$val->dataArray["ach2"] = round($val->dataArray["actbgt1"] / $val->dataArray["budgetori2"] * 100,2);
				
			}
			$result["rs"]["rows"][] = $val->dataArray;
			$this->generateResultJejer($val, $result);
			
		}
	}
	/**
     *  <#digunakan untuk menghitung summari dari struktur report #>
     *
     *  @param $item <#$item item summary beserta child yang di bawahnya#>
     *
     *  @return <#return value description#>
     */
	function summaries(&$item){
		foreach ($item->childs as $key => $val){
			$line = $val;
			$this->summaries($line);
			$item->data->aggthn += $line->data->aggthn;
			$item->data->trend += $line->data->trend;
			$item->data->aggbln += $line->data->aggbln;
			$item->data->aggsd += $line->data->aggsd;
			$item->data->actbln += $line->data->actbln;
			$item->data->actsd += $line->data->actsd;
			$item->data->actblnlalu += $line->data->actblnlalu;
			$item->data->actsdfull += $line->data->actsdfull;
			$item->data->actblnlalufull += $line->data->actblnlalufull;
			$item->data->actall += $line->data->actall;

			if ($line->data->sum_header != "-") {
				$sumheader = explode(",",$line->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $line->data->aggthn;
						$nodeHeader->data->trend += $line->data->trend;
						$nodeHeader->data->aggbln += $line->data->aggbln;
						$nodeHeader->data->aggsd += $line->data->aggsd;
						$nodeHeader->data->actbln += $line->data->actbln;
						$nodeHeader->data->actsd += $line->data->actsd;
						$nodeHeader->data->actblnlalu += $line->data->actblnlalu;
						$nodeHeader->data->actsdfull += $line->data->actsdfull;
						$nodeHeader->data->actblnlalufull += $line->data->actblnlalufull;
						$nodeHeader->data->actall += $line->data->actall;
					}
				}
			}
		}
	}
    /**
     *  <#digunakan untuk menghitung rumus growth dan achievment serta mengkonversi tanda minus untuk pendapatan agar di report menampilkan nilai standar report keuangan.#>
     *
     *  @param $item   <#$item record data yang akan di proses#>
     *  @param $result <#$result array penampung hasil proses#>
     *  @param $neraca <#$neraca filter neraca untuk kasus tertentu#>
     *
     *  @return <#return value description#>
     */
	function generateResult($item, &$result, $neraca){
		foreach ($item->childs as $key => $val){
			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->aggthn = ($val->data->aggthn) * -1;
				$val->data->aggbln = ($val->data->aggbln) * -1;
				$val->data->trend = ($val->data->trend) * -1;
				$val->data->aggsd = ($val->data->aggsd) * -1;
				$val->data->actbln = ($val->data->actbln) * -1;
				$val->data->actsd = ($val->data->actsd) * -1;
				$val->data->actblnlalu = ($val->data->actblnlalu) * -1;
				$val->data->actall = ($val->data->actall) * -1;
			}else {
				$val->data->aggthn = ($val->data->aggthn);
				$val->data->aggbln = ($val->data->aggbln);
				$val->data->trend = ($val->data->trend);
				$val->data->aggsd = ($val->data->aggsd);
				$val->data->actbln = ($val->data->actbln);
				$val->data->actsd = ($val->data->actsd);
				$val->data->actblnlalu = ($val->data->actblnlalu);
				$val->data->actall = ($val->data->actall);

			}
			//$val->data->acvpsn = $val->data->aggbln == 0 ? 0 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->acvgap = round($val->data->actbln - $val->data->aggbln);
			//$val->data->growthpsn =  $val->data->trend == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
			$val->data->growthgap = round($val->data->actbln - $val->data->trend);

			//$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
			//$val->data->grwytdpsn = $val->data->actall == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );
			$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);

			//$val->data->ytdpsn = $val->data->aggthn == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			//$val->data->growthytypsn = $val->data->actall == 0 ? 0 : round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );
			$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);

			$val->data->acvpsn = $this->rumusAchieve($val->data->aggbln, $val->data->actbln);//floatval($val->data->aggbln) == 0 ? 100 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->growthpsn = $this->rumusGrowth($val->data->actbln,$val->data->trend);
			$val->data->acvytdpsn = $this->rumusAchieve($val->data->aggsd, $val->data->actsd);//floatval($val->data->aggsd) == 0 ? 100  : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->grwytdpsn = $this->rumusGrowth($val->data->actsd,$val->data->actall);//floatval($val->data->actall) == 0 ? 100 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );

			$val->data->ytdpsn = $this->rumusAchieve($val->data->aggthn, $val->data->actsd);//floatval($val->data->aggthn) == 0 ? 100 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = $this->rumusGrowth($val->data->actsd,$val->data->actall);//floatval($val->data->actall) == 0 ? 100 :round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );


			if ($val->data->tipe == "RASIO"){
				$val->data->acvpsn = 0;
				$val->data->growthpsn = 0;
				$val->data->acvytdpsn = 0;
				$val->data->grwytdpsn = 0;
				$val->data->ytdpsn = 0;
				$val->data->growthytypsn = 0;
			}else{
				$val->data->aggthn = round($val->data->aggthn);
				$val->data->aggbln = round($val->data->aggbln);
				$val->data->trend = round($val->data->trend);
				$val->data->aggsd = round($val->data->aggsd);
				$val->data->actbln = round($val->data->actbln);
				$val->data->actsd = round($val->data->actsd);
				$val->data->actblnlalu = round($val->data->actblnlalu);
				$val->data->actall = round($val->data->actall);

			}
			if ($val->data->kode_neraca == $neraca){
				$result["rs"]["rows"][] = (array) $val->data;
				$this->collectData = true;
			}else if (!isset($neraca) || $neraca == "")
				$result["rs"]["rows"][] = (array) $val->data;
			else if ($this->collectData){
				if ($val->data->kode_induk == "00")
					$this->collectData = false;
				else $result["rs"]["rows"][] = (array) $val->data;
			}
			$this->generateResult($val, $result, $neraca);
		}
	}

	/**
     *  <#digunakan untuk menghitung nilai secara report ke header/summary untuk trend bulanan dalam bentuk jejer/deret#>
     *
     *  @param $item <#$item record yang akan di proses#>
     *  @param $thn2 <#$thn2 tidak digunakan lagi. karena hanya 1 tahun pembanding#>
     *
     *  @return <#return value description#>
     */
	function summariesTrend(&$item, $thn2){
		foreach ($item->childs as $key => $val){
			$line = $val;
			$this->summariesTrend($line, $thn2);
			$item->data->jan1 += $line->data->jan1;
			$item->data->feb1 += $line->data->feb1;
			$item->data->mar1 += $line->data->mar1;
			$item->data->apr1 += $line->data->apr1;
			$item->data->mei1 += $line->data->mei1;
			$item->data->jun1 += $line->data->jun1;
			$item->data->jul1 += $line->data->jul1;
			$item->data->aug1 += $line->data->aug1;
			$item->data->sep1 += $line->data->sep1;
			$item->data->okt1 += $line->data->okt1;
			$item->data->nop1 += $line->data->nop1;
			$item->data->des1 += $line->data->des1;
			$item->data->total1 += $line->data->total1;
			$code = "";
			$ix = 1;
			for ($i = 0; $i < 1; $i++){
				$ix++;
				$code .= "\$item->data->jan$ix += \$line->data->jan$ix;
						\$item->data->feb$ix += \$line->data->feb$ix;
						\$item->data->mar$ix += \$line->data->mar$ix;
						\$item->data->apr$ix += \$line->data->apr$ix;
						\$item->data->mei$ix += \$line->data->mei$ix;
						\$item->data->jun$ix += \$line->data->jun$ix;
						\$item->data->jul$ix += \$line->data->jul$ix;
						\$item->data->aug$ix += \$line->data->aug$ix;
						\$item->data->sep$ix += \$line->data->sep$ix;
						\$item->data->okt$ix += \$line->data->okt$ix;
						\$item->data->nop$ix += \$line->data->nop$ix;
						\$item->data->des$ix += \$line->data->des$ix;
						\$item->data->total$ix += \$line->data->total$ix;";
			}
			eval($code);
			if ($line->data->sum_header != "-") {
				$sumheader = explode(",",$line->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->jan1 += $line->data->jan1;
						$nodeHeader->data->feb1 += $line->data->feb1;
						$nodeHeader->data->mar1 += $line->data->mar1;
						$nodeHeader->data->apr1 += $line->data->apr1;
						$nodeHeader->data->mei1 += $line->data->mei1;
						$nodeHeader->data->jun1 += $line->data->jun1;
						$nodeHeader->data->jul1 += $line->data->jul1;
						$nodeHeader->data->aug1 += $line->data->aug1;
						$nodeHeader->data->sep1 += $line->data->sep1;
						$nodeHeader->data->okt1 += $line->data->okt1;
						$nodeHeader->data->nop1 += $line->data->nop1;
						$nodeHeader->data->des1 += $line->data->des1;
						$nodeHeader->data->total1 += $line->data->total1;
						$code = "";
						$ix = 1;
						for ($i = 0; $i < 1; $i++){
							$ix++;
							$code .= "
									\$nodeHeader->data->jan$ix += \$line->data->jan$ix;
									\$nodeHeader->data->feb$ix += \$line->data->feb$ix;
									\$nodeHeader->data->mar$ix += \$line->data->mar$ix;
									\$nodeHeader->data->apr$ix += \$line->data->apr$ix;
									\$nodeHeader->data->mei$ix += \$line->data->mei$ix;
									\$nodeHeader->data->jun$ix += \$line->data->jun$ix;
									\$nodeHeader->data->jul$ix += \$line->data->jul$ix;
									\$nodeHeader->data->aug$ix += \$line->data->aug$ix;
									\$nodeHeader->data->sep$ix += \$line->data->sep$ix;
									\$nodeHeader->data->okt$ix += \$line->data->okt$ix;
									\$nodeHeader->data->nop$ix += \$line->data->nop$ix;
									\$nodeHeader->data->des$ix += \$line->data->des$ix;
									\$nodeHeader->data->total$ix += \$line->data->total$ix;";
						}
						eval($code);
					}
				}
			}

		}
	}
    /**
     *  <#digunakan untuk melakukan proses konversi dari minus ke plus untuk pendapatan.untuk proses report trend bulanan #>
     *
     *  @param $item   <#$item record yang akan di proses.#>
     *  @param $result <#$result array untuk menampung hasil proses#>
     *  @param $thn2   <#$thn2 tdk digunakan lagi ,karena hanya menggunakan #>
     *  @param $neraca <#$neraca optional , digunakan untuk filter neraca tertentu#>
     *
     *  @return <#return value description#>
     */
	function generateResultTrend($item, &$result, $thn2, $neraca = null){
		foreach ($item->childs as $key => $line){
			if ($line->data->jenis_akun == 'PENDAPATAN')
			{

				$line->data->jan1 = round($line->data->jan1) * -1;
				$line->data->feb1 = round($line->data->feb1) * -1;
				$line->data->mar1 = round($line->data->mar1) * -1;
				$line->data->apr1 = round($line->data->apr1) * -1;
				$line->data->mei1 = round($line->data->mei1) * -1;
				$line->data->jun1 = round($line->data->jun1) * -1;
				$line->data->jul1 = round($line->data->jul1) * -1;
				$line->data->aug1 = round($line->data->aug1) * -1;
				$line->data->sep1 = round($line->data->sep1) * -1;
				$line->data->okt1 = round($line->data->okt1) * -1;
				$line->data->nop1 = round($line->data->nop1) * -1;
				$line->data->des1 = round($line->data->des1) * -1;
				$line->data->total1 = round($line->data->total1) * -1;
				$code = "";
				$ix = 1;
				for ($i = 0; $i < 1; $i++){
					$ix++;
					$code .= "\$line->data->jan$ix = round(\$line->data->jan$ix) * -1;
							\$line->data->feb$ix = round(\$line->data->feb$ix) * -1;
							\$line->data->mar$ix = round(\$line->data->mar$ix) * -1;
							\$line->data->apr$ix = round(\$line->data->apr$ix) * -1;
							\$line->data->mei$ix = round(\$line->data->mei$ix) * -1;
							\$line->data->jun$ix = round(\$line->data->jun$ix) * -1;
							\$line->data->jul$ix = round(\$line->data->jul$ix) * -1;
							\$line->data->aug$ix = round(\$line->data->aug$ix) * -1;
							\$line->data->sep$ix = round(\$line->data->sep$ix) * -1;
							\$line->data->okt$ix = round(\$line->data->okt$ix) * -1;
							\$line->data->nop$ix = round(\$line->data->nop$ix) * -1;
							\$line->data->des$ix = round(\$line->data->des$ix) * -1;
							\$line->data->total$ix = round(\$line->data->total$ix) * -1;";
				}
			}else {
				$line->data->jan1 = round($line->data->jan1);
				$line->data->feb1 = round($line->data->feb1);
				$line->data->mar1 = round($line->data->mar1);
				$line->data->apr1 = round($line->data->apr1);
				$line->data->mei1 = round($line->data->mei1);
				$line->data->jun1 = round($line->data->jun1);
				$line->data->jul1 = round($line->data->jul1);
				$line->data->aug1 = round($line->data->aug1);
				$line->data->sep1 = round($line->data->sep1);
				$line->data->okt1 = round($line->data->okt1);
				$line->data->nop1 = round($line->data->nop1);
				$line->data->des1 = round($line->data->des1);
				$line->data->total1 = round($line->data->total1);
				$code = "";
				$ix = 1;
				for ($i = 0; $i < 1; $i++){
					$ix++;
					$code .= "\$line->data->jan$ix = round(\$line->data->jan$ix);
							\$line->data->feb$ix = round(\$line->data->feb$ix);
							\$line->data->mar$ix = round(\$line->data->mar$ix);
							\$line->data->apr$ix = round(\$line->data->apr$ix);
							\$line->data->mei$ix = round(\$line->data->mei$ix);
							\$line->data->jun$ix = round(\$line->data->jun$ix);
							\$line->data->jul$ix = round(\$line->data->jul$ix);
							\$line->data->aug$ix = round(\$line->data->aug$ix);
							\$line->data->sep$ix = round(\$line->data->sep$ix);
							\$line->data->okt$ix = round(\$line->data->okt$ix);
							\$line->data->nop$ix = round(\$line->data->nop$ix);
							\$line->data->des$ix = round(\$line->data->des$ix);
							\$line->data->total$ix = round(\$line->data->total$ix);";
				}

			}
			eval($code);
			if ($line->data->kode_neraca == $neraca) {
				$result["rs"]["rows"][] = (array) $line->data;
				$this->collectData = true;
			}else if (!isset($neraca))
				$result["rs"]["rows"][] = (array) $line->data;
			else if ($this->collectData){
				if ($line->data->kode_induk == "00")
					$this->collectData = false;
				else $result["rs"]["rows"][] = (array) $line->data;
			}
			$this->generateResultTrend($line, $result, $thn2, $neraca);
		}
	}
	//---- common function -----
    /**
     *  <#Digunakan untuk menghitung formula Achievement untuk report Executive Summary#>
     *
     *  @param $budget <#$budget nilai anggaran#>
     *  @param $actual <#$actual nilai actual#>
     *
     *  @return <#return value nilai setelah rumus#>
     */
	function rumusAchieve($budget, $actual){
		/*
		IF(budget>0,Actual/budget,IF(budget<0,IF(Actual<budget,1-(Actual-budget)/budget,IF(Actual>0,(1-(Actual-budget)/budget),1-(Actual-budget)/budget)),""))
		if (budget>0)
			Actual/budget
		else if (budget<0){
			if (Actual<budget)
				return 1-(Actual-budget)/budget
			else if (Actual>0)
				return (1-(Actual-budget)/budget)
			else return 1-(Actual-budget)/budget);
		}else return ""
		*/

		$budget = floatval($budget);
		$actual = floatval($actual);
		if ($budget > 0){
			return round($actual / $budget,2) * 100;
		}else if ($budget < 0) {
			 if ($actual < $budget)
			 	return round(1 - ($actual - $budget ) / $budget) * 100;
			 else if ($actual > 0 )
			 	return round(1 - ($actual - $budget ) / $budget) * 100;
			 else if ($actual < 0)
			 	return 0;
			 else return round(1 - ($actual - $budget ) / $budget) * 100;
		}else if ($budget == 0){
			if ($actual > 0)
				return 100;
			else return 0;
		}else {
			error_log("Achieve ". $budget .":".$actual);
			return 0;
		}
	}
    /**
     *  <#Digunakan untuk menghitung formula growth untuk report executive summary#>
     *
     *  @param $current  <#$current nilai actual skrg#>
     *  @param $previous <#$previous nilai actual pembanding#>
     *
     *  @return <#return value nilai setelah rumus#>
     */
	function rumusGrowth($current, $previous){
		$current = floatval($current);
		$previous = floatval($previous);
		if ($previous > 0){
			return round($current / $previous - 1, 3) * 100;
		}else if ($previous < 0) {
			 if ($current < $previous)
			 	return round((1 - ($current - $previous ) / $previous) - 1, 3) * 100;
			 else if ($current > 0 )
			 	return round((1 - ($current - $previous ) / $previous) - 1, 3) * 100;
			 else if ($current < 0)
			 	return 0;
			 else return round((1 - ($current - $previous ) / $previous) - 1, 3) * 100;
		}else if ($previous == 0){
			if ($current > 0)
				return 100;
			else return -100;
		}else {
			error_log("Growth ". $current .":".$previous);
			return 0;
		}
	}
	function writeError($modul, $error){
		error_log("[".$modul ."] $error ");
		//send to Admin

	}
}
?>