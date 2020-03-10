<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at
*	Contributors
* 			SAI, PT
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");
uses("server_DBConnection_dbLib");
uses("server_util_rfc");
uses("server_util_NodeNRC");
uses("server_util_PowerPoint");
uses("server_util_Xls");
uses("server_util_financeLibDatel");
include 'PHPPowerPoint.php';
include 'PHPExcel.php';

class server_util_financeLib  extends server_BasicObject
{
	protected $dbLib;
	protected $records;
	protected $thnComp;
	protected $lokasiNas;
	protected $userLogin;
	var $collectData;
    /**
     *  <#Description#>
     *
     *  @return <#return value description#>
     */
	function __construct()
	{
		parent::__construct();
		global $dbSetting;
		$this->dbLib = new server_DBConnection_dbLib($dbSetting);
		$this->dbLib->connect();
		$this->records = array();
		$this->collectData = false;
		$this->witelLib = new server_util_financeLibDatel($this->dbLib);
		$rs = $this->dbLib->execute("select value1 from spro where kode_spro = 'TELKOMLOK' ");
		if ($row = $rs->FetchNextObject(false))
			$this->lokasi = $row->value1;
		else $this->lokasi = "1000";

		$this->userLogin = $_SESSION["user"];

		$rs = $this->dbLib->execute("select kode_lokasi, cocd, kode_ubis from exs_karyawan where nik = '" . $this->userLogin . "' ");
		if ($row = $rs->FetchNextObject(false)){
			$this->lokasi = $row->kode_lokasi;
			$this->cocd = $row->kode_lokasi;
		}else {
			$this->lokasi = "1000";
			$this->cocd = "";
		}

		
			
		$this->lokasiNas = $this->getUnconsRoot($this->lokasi);
		$this->kode_ubis = $row->kode_ubis;

		//error_log("User " . $this->userLogin . ":" . $row->kode_ubis .":".$this->lokasi);
			
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
	private function getSAPConnection($compCode){
		$db = $this->dbLib;
		error_log("select a.kode_lokasi, b.ip, b.sys_id, b.ins_num, b.sap_router, a.sapuser, a.sappwd  
									from bpc_conn a 
									inner join bpc_sapconn b on b.kode = a.KODE_SERVER
							where a.kode_lokasi ='$compCode' ");
		$rs = $db->execute("select a.kode_lokasi, b.ip, b.sys_id, b.ins_num, b.sap_router, a.sapuser, a.sappwd  
									from bpc_conn a 
									inner join bpc_sapconn b on b.kode = a.KODE_SERVER
							where a.kode_lokasi ='$compCode' ");

		if ($row = $rs->FetchNextObject(false)){
			//error_log("SAP ". json_encode($row));
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
    /**
     *  <#digunakan untuk generate Session Insert ke table agar tidak bentrok waktu buffering generate report dengan user lain#>
     *
     *  @return <#return value session#>
     */
	function getSessionId(){
		global $userlog;
		$done = false;
		while (!$done){
			$session_id = session_id() . md5($userlog . date("r"));
			$rs = $this->dbLib->execute("select distinct session_id from exs_process_session where session_id = '$session_id' ");
			if ($row = $rs->FetchNextObject(false)){
				session_regenerate_id();
			}else {
				$done = true;
			}
		}
		$this->dbLib->execute("insert into exs_process_session values('$session_id','$userlog')");
		return $session_id;

	}
    /**
     *  <#untuk menghapus session/temporary table dari proses buffering #>
     *
     *  @param $session_id <#$session_id id session#>
     *
     *  @return <#return value null#>
     */
	function deleteSession($session_id){
		$this->dbLib->execute("delete from exs_process_summakun where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_agg where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_actual where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_exsum where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_session where session_id='$session_id'");
	}
    /**
     *  <#digunakan untuk menghitung summari dari struktur report #>
     *
     *  @param $item <#$item item summary beserta child yang di bawahnya#>
     *
     *  @return <#return value description#>
     */
	function summaries(&$item){
		//error_log($item->data->ubis);
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


			if ($val->data->kode_neraca == 'OE'){
				$this->nodeExp = $val;
			}else if ($val->data->kode_neraca == 'AR'){
				$this->nodeRev = $val;
			}
			$val->data->contrib = $this->nodeRev->data->actsd == 0 ? 0 : round($val->data->actsd / $this->nodeRev->data->actsd * 100, 1);
			if ($val->data->jenis_akun == "PENDAPATAN"){
				//$val->data->contrib = $this->nodeRev->data->actsd == 0 ? 0 : round($val->data->actsd / $this->nodeRev->data->actsd * 100, 1);
				$val->data->nilai_rev = $this->nodeRev->data->actsd;
			}else if ($val->data->jenis_akun == "BEBAN"){
				//$val->data->contrib = $this->nodeExp->data->actsd == 0 ? 0 : round($val->data->actsd / $this->nodeExp->data->actsd * 100, 1);
				$val->data->nilai_exp = $this->nodeExp->data->actsd;
			}else
				$val->data->contrib = round($val->data->contrib);
			/*if ($val->data->kode_neraca == 'LRU')
			{
				if ($val->data->aggbln < 0 && $val->data->actbln > 0){
					$val->data->acvpsn = $val->data->aggbln == 0 ? 0 : round((($val->data->actbln / -$val->data->aggbln) + 1) * 100 ,1);
				}
				if ($val->data->aggsd < 0 && $val->data->actsd > 0){
					$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->acvytdrp / $val->data->aggsd  * 100 * -1,1);
				}
				if ($val->data->trend < 0 && $val->data->actbln > 0){
					$val->data->growthpsn = $val->data->trend == 0 ? 0 : round($val->data->growthgap / $val->data->trend  * 100 * -1,1);
				}
			}*/
			{
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
			}else if (!isset($neraca))
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
    /**
     *  <#Digunakan untuk melakukan perhitungan Summary dari Struktur di bawahnya untuk Trend Triwulan#>
     *
     *  @param $item <#$item record yang akan di proses#>
     *  @param $thn2 <#$thn2 tidak digunakan lagi. karena hanya 1 thn pembanding#>
     *
     *  @return <#return value description#>
     */
	function summariesTrendQuart(&$item, $thn2){
		foreach ($item->childs as $key => $val){
			$line = $val;
			$this->summariesTrendQuart($line, $thn2);
			$item->data->q11 += $line->data->q11;
			$item->data->q12 += $line->data->q12;
			$item->data->q13 += $line->data->q13;
			$item->data->q14 += $line->data->q14;
			$item->data->total1 += $line->data->total1;
			$item->data->q21 += $line->data->q21;
			$item->data->q22 += $line->data->q22;
			$item->data->q23 += $line->data->q23;
			$item->data->q24 += $line->data->q24;
			$item->data->total2 += $line->data->total2;

			if ($line->data->sum_header != "-") {
				$sumheader = explode(",",$line->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->q11 += $line->data->q11;
						$nodeHeader->data->q12 += $line->data->q12;
						$nodeHeader->data->q13 += $line->data->q13;
						$nodeHeader->data->q14 += $line->data->q14;
						$nodeHeader->data->total1 += $line->data->total1;
						$nodeHeader->data->q21 += $line->data->q21;
						$nodeHeader->data->q22 += $line->data->q22;
						$nodeHeader->data->q23 += $line->data->q23;
						$nodeHeader->data->q24 += $line->data->q24;
						$nodeHeader->data->total2 += $line->data->total2;
					}
				}
			}

		}
	}
    /**
     *  <#Digunakan untuk melakukan konversi untuk nilai pendapatan ke plus#>
     *
     *  @param $item   <#$item record yang akan di proses#>
     *  @param $result <#$result array penampung hasil proses#>
     *  @param $thn2   <#$thn2 tidak digunakan lagi karena hanya 1 thn pembanding#>
     *  @param $neraca <#$neraca optional untuk filter dengan neraca tertentu#>
     *
     *  @return <#return value description#>
     */
	function generateResultTrendQuart($item, &$result, $thn2, $neraca = null){
		foreach ($item->childs as $key => $line){
			if ($line->data->jenis_akun == 'PENDAPATAN')
			{

				$line->data->q11 = round($line->data->q11) * -1;
				$line->data->q12 = round($line->data->q12) * -1;
				$line->data->q13 = round($line->data->q13) * -1;
				$line->data->q14 = round($line->data->q14) * -1;
				$line->data->total1 = round($line->data->total1) * -1;
				$line->data->q21 = round($line->data->q21) * -1;
				$line->data->q22 = round($line->data->q22) * -1;
				$line->data->q23 = round($line->data->q23) * -1;
				$line->data->q24 = round($line->data->q24) * -1;
				$line->data->total2 = round($line->data->total2) * -1;

			}else {
				$line->data->q11 = round($line->data->q11);
				$line->data->q12 = round($line->data->q12);
				$line->data->q13 = round($line->data->q13);
				$line->data->q14 = round($line->data->q14);
				$line->data->total1 = round($line->data->total1);
				$line->data->q21 = round($line->data->q21);
				$line->data->q22 = round($line->data->q22);
				$line->data->q23 = round($line->data->q23);
				$line->data->q24 = round($line->data->q24);
				$line->data->total2 = round($line->data->total2);

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
			$this->generateResultTrendQuart($line, $result, $thn2, $neraca);
		}
	}
    /**
     *  <#Description#>
     *
     *  @param $item <#$item description#>
     *  @param $thn2 <#$thn2 description#>
     *
     *  @return <#return value description#>
     */
	function summariesTrendHalf(&$item, $thn2){
		foreach ($item->childs as $key => $val){
			$line = $val;
			$this->summariesTrendHalf($line, $thn2);
			$item->data->s11 += $line->data->s11;
			$item->data->s12 += $line->data->s12;
			$item->data->total1 += $line->data->total1;
			$item->data->s21 += $line->data->q21;
			$item->data->s22 += $line->data->q22;
			$item->data->total2 += $line->data->total2;

			if ($line->data->sum_header != "-") {
				$sumheader = explode(",",$line->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->s11 += $line->data->s11;
						$nodeHeader->data->s12 += $line->data->s12;
						$nodeHeader->data->total1 += $line->data->total1;
						$nodeHeader->data->s21 += $line->data->s21;
						$nodeHeader->data->s22 += $line->data->s22;
						$nodeHeader->data->total2 += $line->data->total2;
					}
				}
			}

		}
	}
    /**
     *  <#Description#>
     *
     *  @param $item   <#$item description#>
     *  @param $result <#$result description#>
     *  @param $thn2   <#$thn2 description#>
     *  @param $neraca <#$neraca description#>
     *
     *  @return <#return value description#>
     */
	function generateResultTrendHalf($item, &$result, $thn2, $neraca = null){
		foreach ($item->childs as $key => $line){
			if ($line->data->jenis_akun == 'PENDAPATAN')
			{

				$line->data->s11 = round($line->data->s11) * -1;
				$line->data->s12 = round($line->data->s12) * -1;
				$line->data->total1 = round($line->data->total1) * -1;
				$line->data->s21 = round($line->data->s21) * -1;
				$line->data->s22 = round($line->data->s22) * -1;
				$line->data->total2 = round($line->data->total2) * -1;

			}else {
				$line->data->s11 = round($line->data->s11);
				$line->data->s12 = round($line->data->s12);
				$line->data->total1 = round($line->data->total1);
				$line->data->s21 = round($line->data->s21);
				$line->data->s22 = round($line->data->s22);
				$line->data->total2 = round($line->data->total2);

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
			$this->generateResultTrendHalf($line, $result, $thn2, $neraca);
		}
	}
    /**
     *  <#tidak di gunakan lagi karena hanya ada 1 tahun pembanding#>
     *
     *  @param $model <#$model description#>
     *  @param $thn1  <#$thn1 description#>
     *  @param $thn2  <#$thn2 description#>
     *  @param $ubis  <#$ubis description#>
     *
     *  @return <#return value description#>
     */
	function generateSQL($model,$thn1, $thn2, $ubis = null){
		$thn1 = floatval($thn1);
		$thn2 = floatval($thn2);//2012-1;
		$sqlField = "";
		$sqlTable = "";
		$tableAlias = array("c","d","e","f","g","h","i","j","k","l","m");
		$ix = 0;
		//for ($i = $thn2; $i < $thn1; $i++)
		{
			$alias = $tableAlias[$ix];
			$ix2 = $ix + 2;
			$sqlField .= ", nvl($alias.jan, 0) as jan$ix2
						, nvl($alias.feb, 0) as feb$ix2
						, nvl($alias.mar, 0) as mar$ix2
						, nvl($alias.apr, 0) as apr$ix2
						, nvl($alias.mei, 0) as mei$ix2
						, nvl($alias.jun, 0) as jun$ix2
						, nvl($alias.jul, 0) as jul$ix2
						, nvl($alias.aug, 0) as aug$ix2
						, nvl($alias.sep, 0) as sep$ix2
						, nvl($alias.okt, 0) as okt$ix2
						, nvl($alias.nop, 0) as nop$ix2
						, nvl($alias.des, 0) as des$ix2
						, nvl($alias.total, 0) as total$ix2";
			$sqlTable .= " left outer join (select x.kode_neraca
															, sum(nvl(jan,0) / $pembagi) as jan
															, sum(nvl(feb,0) / $pembagi) as feb
															, sum(nvl(mar,0) / $pembagi) as mar
															, sum(nvl(apr,0) / $pembagi) as apr
															, sum(nvl(mei,0) / $pembagi) as mei
															, sum(nvl(jun,0) / $pembagi) as jun
															, sum(nvl(jul,0) / $pembagi) as jul
															, sum(nvl(aug,0) / $pembagi) as aug
															, sum(nvl(sep,0) / $pembagi) as sep
															, sum(nvl(okt,0) / $pembagi) as okt
															, sum(nvl(nop,0) / $pembagi) as nop
															, sum(nvl(des,0) / $pembagi) as des
															, sum(nvl(total,0) / $pembagi) as total

														from exs_relakun x inner join exs_monthly_tmp y on y.account = x.kode_akun and y.tahun = '$thn2' and y.ref1 like '$ubis%'
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) $alias on $alias.kode_neraca = a.kode_neraca";
		}
		return array($sqlField,$sqlTable);
	}
    /**
     *  <#digunakan untuk mendapatkan laporan executive summary versi pertama digunakan dan sekarang di link kan ke getDataEXSUMCC#>
     *
     *  @param $model   <#$model model report#>
     *  @param $periode <#$periode periode laporan#>
     *  @param $ubis    <#$ubis filter divisi, jika kosong akan menampilkan secara nasional#>
     *  @param $neraca  <#$neraca filter untuk menampilkan neraca tertentu#>
     *  @param $pembagi <#$pembagi nilai pembagi agar bisa menampilkan dalam beberapa satuan, Milliar, juta ribu, atau mutlak#>
     *
     *  @return <#return value recordset data laporan executive summary#>
     */
	function getDataEXSUM($model, $periode, $ubis = null, $neraca = null, $pembagi = 1000000000){
		return $this->getDataEXSUMCC($model, $periode, $ubis, $this->lokasi,  $neraca, $pembagi);
	}
    /**
     *  <#digunakan untuk mendapatkan detail akun dari filter neraca tertentu versi 1 dan skrg di link kan ke getDataEXSUMDetail#>
     *
     *  @param $model   <#$model model report#>
     *  @param $periode <#$periode periode laporan#>
     *  @param $ubis    <#$ubis filter divisi, jika kosong akan menampilkan secara nasional#>
     *  @param $neraca  <#$neraca filter untuk menampilkan neraca tertentu#>
     *  @param $pembagi <#$pembagi nilai pembagi agar bisa menampilkan dalam beberapa satuan, Milliar, juta ribu, atau mutlak#>
     *
	 *  @return <#return value recordset data laporan executive summary#>
     */
	function getDataEXSUMDetail($model, $periode, $neraca, $ubis = null, $lokasi = null, $pembagi = 1000000000){
		error_log("getDataEXSUMDetail Lokasi $lokasi");
		return $this->getDataEXSUMDetailCC($model, $periode, $neraca, $ubis, $lokasi, $pembagi);
	}
    /**
     *  <#Digunakan untuk mendapatkan report Trend Bulanan Actual. untuk Fungsi ini sekarang di link-kan ke getDataTrendCC #>
     *
     *  @param $model   <#$model model report#>
     *  @param $thn1    <#$thn1 tahun yang akan di sajikan#>
     *  @param $thn2    <#$thn2 tahun untuk pembanding#>
     *  @param $ubis    <#$ubis filter divisi yang akan di tampilkan.#>
     *  @param $neraca  <#$neraca filter neraca yang akan ditampilkan#>
     *  @param $pembagi <#$pembagi nilai pembagi agar mendapatkan satuan yang diingikan, milliar, juta, ribu atau mutlak#>
     *
     *  @return <#return value recordset trend actual bulanan #>
     */
	function getDataTrend($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		return $this->getDataTrendCC($model, $thn1, $thn2, $ubis, $neraca,$pembagi);
	}
   /**
     *  <#Digunakan untuk mendapatkan report Trend Bulanan Budget. untuk Fungsi ini sekarang di link-kan ke getDataBudgetTrendCC #>
     *
     *  @param $model   <#$model model report#>
     *  @param $thn1    <#$thn1 tahun yang akan di sajikan#>
     *  @param $thn2    <#$thn2 tahun untuk pembanding#>
     *  @param $ubis    <#$ubis filter divisi yang akan di tampilkan.#>
     *  @param $neraca  <#$neraca filter neraca yang akan ditampilkan#>
     *  @param $pembagi <#$pembagi nilai pembagi agar mendapatkan satuan yang diingikan, milliar, juta, ribu atau mutlak#>
     *
     *  @return <#return value recordset trend actual bulanan #>
     */
	function getDataBudgetTrend($model, $thn1, $thn2, $ubis = null, $neraca = null,$pembagi = 1000000000){
		return $this->getDataBudgetTrendCC($model, $thn1, $thn2, $ubis, $neraca, $pembagi);
	}
    /**
     *  <#Digunakan untuk mendapatkan data executive summary hanya untuk Beban Usaha saja. fungsi ini sekarang di ganti ke getDataExp.#>
     *
     *  @param $model   <#$model model report yang diinginkan#>
     *  @param $periode <#$periode periode yang akan disajikan#>
     *  @param $ubis    <#$ubis filter divisi yang akan di sajikan, jika kosong, akan menampilkan secara nasional#>
     *  @param $pembagi <#$pembagi nilai pembagi untuk mendapat nilai satuan. milliar, juta, ribu, mutlak#>
     *
     *  @return <#return value recordset executive summary data beban usaha#>
     */
	function getDataExp($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->getDataExpCC($model, $periode, $ubis, $pembagi);
	}
    /**
     *  <#digunakan untuk mendapatkan data beban usaha untuk ubis tertentu#>
     *
     *  @param $model   <#$model Model report yang diinginkan#>
     *  @param $periode <#$periode periode report#>
     *  @param $ubis    <#$ubis filter divisi#>
     *  @param $pembagi <#$pembagi nilai pembagi untuk satuan yang diinginkan#>
     *
     *  @return <#return value description#>
     */
	function getDataExpUbis($model, $periode, $ubis = null,$pembagi = 1000000000){
		return $this->getDataExpUbisCC($model, $periode, $ubis, $pembagi);
	}

	/**
	 * generateResultExp function.
	 * digunakan untuk generate executive summary untuk beban usaha
	 * @access public
	 * @param mixed $item		: record yang akan di proses
	 * @param mixed &$result	: I/O array penampung hasil proses
	 * @param mixed $nodeExp	: node struktur yang menampung beban usaha
	 * @return void
	 */
	function generateResultExp($item, &$result, $nodeExp){
		foreach ($item->childs as $key => $val){
			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->aggthn = round($val->data->aggthn) * -1;
				$val->data->aggbln = round($val->data->aggbln) * -1;
				$val->data->trend = round($val->data->trend) * -1;
				$val->data->aggsd = round($val->data->aggsd) * -1;
				$val->data->actbln = round($val->data->actbln) * -1;
				$val->data->actsd = round($val->data->actsd) * -1;
				$val->data->actblnlalu = round($val->data->actblnlalu) * -1;
				$val->data->actall = round($val->data->actall) * -1;
			}else {
				$val->data->aggthn = round($val->data->aggthn);
				$val->data->aggbln = round($val->data->aggbln);
				$val->data->trend = round($val->data->trend);
				$val->data->aggsd = round($val->data->aggsd);
				$val->data->actbln = round($val->data->actbln);
				$val->data->actsd = round($val->data->actsd);
				$val->data->actblnlalu = round($val->data->actblnlalu);
				$val->data->actall = round($val->data->actall);

			}
			$val->data->acvpsn = $val->data->aggbln == 0 ? 0 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->acvgap = round($val->data->actbln - $val->data->aggbln);
			$val->data->growthpsn = $val->data->trend == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
			$val->data->growthgap = round($val->data->actbln - $val->data->trend);

			$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
			$val->data->grwytdpsn = $val->data->actall == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );
			$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);

			$val->data->ytdpsn = $val->data->aggthn == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = $val->data->actall == 0 ? 0 : round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );
			$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);

			if (!isset($val->data->ubis)){
				if ($val->data->kode_neraca == "OE"){
					$this->nodeExp = $val;
					$this->dataExp = (array) $val->data;
				}
			}else if ($val->data->ubis == $this->lokasiNas && $val->data->kode_neraca == "OE"){
				$this->nodeExp = $val;
				$this->dataExp = (array) $val->data;
			}
			$val->data->contrib = $this->nodeExp->data->actsd ===0 ? 0 : round ( ($val->data->actsd / $this->nodeExp->data->actsd)  * 100,1 );
			$val->data->contrib2 = $this->nodeExp->data->actall == 0 ? 0 : round ( ($val->data->actall / $this->nodeExp->data->actall)  * 100,1);


			$result["rs"]["rows"][] = (array) $val->data;
			$this->generateResultExp($val, $result, $nodeExp);
		}
	}

	/**
	 * getDataRev function.
	 * digunakan untuk mendapatkan executive summary untuk pendapatan usaha
	 * @access public
	 * @param mixed $model			: model report
	 * @param mixed $periode		: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan
	 * @return void
	 */
	function getDataRev($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->getDataRevCC($model, $periode, $ubis, $pembagi);
	}

	/**
	 * getDataRevUbis function.
	 * digunakan untuk mendapatkan executive summary untuk pendapatan usaha ubis
	 * @access public
	 * @param mixed $model			: model report
	 * @param mixed $periode		: periode yang diinginkan
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan
	 * @return void
	 */
	function getDataRevUbis($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->getDataRevUbisCC($model, $periode, $ubis, $pembagi);
	}

	//------- segmen

	/**
	 * getDataRevSegmen function.
	 * digunakan untuk untuk mendapatkan executive summary pendapata usaha per segmen
	 * @access public
	 * @param mixed $model			: model report
	 * @param mixed $periode		: periode yang diinginkan
	 * @param mixed $segmen (default: null)	: filter segmen
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan
	 * @return void
	 */
	function getDataRevSegmen($model, $periode, $segmen = null, $pembagi = 1000000000){
		return $this->getDataRevSegmenCC($model, $periode, $segmen, $pembagi);
	}

	/**
	 * getDataRevSegmenUbis function.
	 * digunakan untuk mendapatan executive summary pendapatan usaha dari unit bisnis per segmen
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	: periode yang diinginkan
	 * @param mixed $segmen (default: null)	: filter segmen
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi yang diinginkan
	 * @return void
	 */
	function getDataRevSegmenUbis($model, $periode, $segmen = null, $pembagi = 1000000000){
		return $this->getDataRevSegmenUbisCC($model, $periode, $segmen, $pembagi);
	}

	/**
	 * getDataBudgetTrendSegmen function.
	 * digunakan unutk mendapatkan trend bulanan untuk executive summary per segmen
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun yang akan disajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $segmen (default: null)	: filter segmen
	 * @param mixed $neraca (default: null)	: filter kode neraca
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan
	 * @return void
	 */
	function getDataBudgetTrendSegmen($model, $thn1, $thn2, $segmen = null, $neraca = null, $pembagi = 1000000000){
		return $this->getDataBudgetTrendSegmenCC($model, $thn1, $thn2, $segmen, $neraca, $pembagi);
	}

	//------------

	/**
	 * generateResultRev function.
	 * digunakan untuk generate report per record pendapatan usaha
	 * @access public
	 * @param mixed $item	: item yang akan di proses
	 * @param mixed &$result	: array penampung proses
	 * @param mixed $nodeExp	: node dari pendapatan usaha
	 * @return void
	 */
	function generateResultRev($item, &$result, $nodeExp){
		foreach ($item->childs as $key => $val){
			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->aggthn = round($val->data->aggthn) * -1;
				$val->data->aggbln = round($val->data->aggbln) * -1;
				$val->data->trend = round($val->data->trend) * -1;
				$val->data->aggsd = round($val->data->aggsd) * -1;
				$val->data->actbln = round($val->data->actbln) * -1;
				$val->data->actsd = round($val->data->actsd) * -1;
				$val->data->actsdfull = $val->data->actsdfull * -1;
				$val->data->actblnlalufull = $val->data->actblnlalufull * -1;
				$val->data->actblnlalu = round($val->data->actblnlalu) * -1;
				$val->data->actall = round($val->data->actall) * -1;
			}else {
				$val->data->aggthn = round($val->data->aggthn);
				$val->data->aggbln = round($val->data->aggbln);
				$val->data->trend = round($val->data->trend);
				$val->data->aggsd = round($val->data->aggsd);
				$val->data->actbln = round($val->data->actbln);
				$val->data->actsd = round($val->data->actsd);
				$val->data->actsdfull = $val->data->actsdfull ;
				$val->data->actblnlalufull = $val->data->actblnlalufull;
				$val->data->actblnlalu = round($val->data->actblnlalu);
				$val->data->actall = round($val->data->actall);
			}
			//$val->data->acvpsn = $val->data->aggbln == 0 ? 0 :  round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->acvgap = round($val->data->actbln - $val->data->aggbln);
			//$val->data->growthpsn = $val->data->trend == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
			$val->data->growthgap = round($val->data->actbln - $val->data->trend);

			//$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
			//$val->data->grwytdpsn = $val->data->actall == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );
			$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);

			//$val->data->ytdpsn = $val->data->aggthn == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			//$val->data->growthytypsn = $val->data->actall ==0 ? 0 : round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );
			$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);
			$val->data->acvpsn = $this->rumusAchieve($val->data->aggbln, $val->data->actbln);//floatval($val->data->aggbln) == 0 ? 100 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->growthpsn = $this->rumusGrowth($val->data->actbln,$val->data->trend);
			$val->data->acvytdpsn = $this->rumusAchieve($val->data->aggsd, $val->data->actsd);//floatval($val->data->aggsd) == 0 ? 100  : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->grwytdpsn = $this->rumusGrowth($val->data->actsd,$val->data->actall);//floatval($val->data->actall) == 0 ? 100 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );

			$val->data->ytdpsn = $this->rumusAchieve($val->data->aggthn, $val->data->actsd);//floatval($val->data->aggthn) == 0 ? 100 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = $this->rumusGrowth($val->data->actsd,$val->data->actall);//floatval($val->data->actall) == 0 ? 100 :round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );

			if (!isset($val->data->ubis) || trim($val->data->ubis) == ''  ){
				if ($val->data->kode_neraca == "AR"){
					$this->nodeExp = $val;
					$this->dataAR = (array) $val->data;
				}
			}else if ($val->data->ubis == $this->lokasiNas && $val->data->kode_neraca == "AR"){
				$this->nodeExp = $val;
				$this->dataAR = (array) $val->data;
			}
			$val->data->contrib = $this->nodeExp->data->actsd == 0 ? 0 : round ( ($val->data->actsd / $this->nodeExp->data->actsd)  * 100,1 );
			$val->data->contrib2 = $this->nodeExp->data->actall == 0 ? 0 : round ( ($val->data->actall / $this->nodeExp->data->actall)  * 100,1);

			$result["rs"]["rows"][] = (array) $val->data;
			$this->generateResultRev($val, $result, $nodeExp);
		}
	}

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
			$this->summariesJejer($val);
			foreach ($val->dataArray as $key => $value) {
				if ($key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex" )
				{
					if (!$item->checkingSummary && $key == "penetapan")
						;
					else
						$item->dataArray[$key] += $value;
				}
			}
			if ($val->data->sum_header != "-") {
				$sumheader = explode(",",$val->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
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
		foreach ($item->childs as $val){

			if ($val->data->jenis_akun == "PENDAPATAN"){
				foreach ($val->dataArray as $key => $value) {
					if ($key != 'jenis_akun' && $key != "kode_induk" &&  $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value) * -1;
					}
				}
			}else {
				foreach ($val->dataArray as $key => $value) {
					if ($key != 'jenis_akun' && $key != "kode_induk" &&  $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value);
					}
				}
			}
			$result["rs"]["rows"][] = $val->dataArray;
			$this->generateResultJejer($val, $result);
		}
	}

	/**
	 * getDataAccount function.
	 * digunakan untuk mendapatkan detail data per akun untuk perhitungan growth
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $nTop	: jumlah maksimal record yang akan di ambilΩ
	 * @param mixed $jenis	 : jenis beban atau pendapatan
	 * @param mixed $order	: urutan berdasar
	 * @param mixed $sortOrder (default: null) : jenis urutan
	 * @param mixed $cc (default: null)	: filter cc / ubis
	 * @param int $pembagi (default: 1000000000) : default pembagi untuk satuan milliar, juta , ribu, atau mutlak
	 * @return void
	 */
	function getDataAccount($model, $periode, $nTop, $jenis, $order, $sortOrder = null, $cc = null, $pembagi = 1000000000){
		return $this->getDataAccountCC($model, $periode, $nTop, $jenis, $order, $sortOrder, $cc, $pembagi);
	}

	/**
	 * getDataJejerAgg function.
	 * digunakan untuk mendapatkan jejer anggaran per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerAgg($model, $periode, $ubis = null, $pembagi = 1000000000){
		if ($this->isGubis($ubis))
			return $this->getDataJejerAggUbis($model, $periode, $ubis,null, $pembagi);
		else if (strlen($ubis) == 4)
			return $this->getDataJejerAggCostCenter($model, $periode, $ubis, $pembagi);
		else
		return $this->getDataJejerAggCC($model, $periode, $ubis, $pembagi);

	}

	/**
	 * getDataJejerActual function.
	 * digunakan untuk mendapatkan jejer actual per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerActual($model, $periode, $ubis = null, $pembagi = 1000000000){
		if ($this->isGubis($ubis))
			return $this->getDataJejerActualUbis($model, $periode, $ubis,null, $pembagi);
		else if (strlen($ubis) == 4)
			return $this->getDataJejerActualCostCenter($model, $periode, $ubis, $pembagi);
		else
			return $this->getDataJejerActualCC($model, $periode, $ubis, $pembagi);
	}
	//----------------- EBITDA COMMERCE

	/**
	 * getDataJejerAggDatel function.
	 * digunakan untuk mendapatkan jejer anggaran witel per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi / witel
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerAggDatel($model, $periode, $witel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataJejerAggDatel($model, $periode, $witel, $pembagi);
	}

	/**
	 * getDataJejerActualDatel function.
	 * digunakan untuk mendapatkan jejer actual per bulanan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerActualDatel($model, $periode, $witel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataJejerActualDatel($model, $periode, $witel, $pembagi);
	}

	/**
	 * getDataJejerAggWitel function.
	 * digunakan untuk mendapatkan jejer anggaran witel per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerAggWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataJejerAggWitel($model, $periode, $ubis, $pembagi);
	}

	/**
	 * getDataJejerAggWitelDetail function.
	 * digunakan untuk mendapatkan jejer anggaran witel detail per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca		: filter kode neraca
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak

	 * @return void
	 */
	function getDataJejerAggWitelDetail($model, $periode, $ubis = null, $neraca, $pembagi = 1000000000){
		return $this->witelLib->getDataJejerAggWitelDetail($model, $periode, $ubis, $neraca, $pembagi);
	}

	/**
	 * getDataJejerActualWitelDetail function.
	 * digunakan untuk mendapatkan jejer actual witel detail per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca		: filter kode neraca
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerActualWitelDetail($model, $periode, $ubis = null,$neraca,  $pembagi = 1000000000){
		return $this->witelLib->getDataJejerActualWitelDetail($model, $periode, $ubis,$neraca, $pembagi);
	}

	/**
	 * getDataJejerActualWitel function.
	 * digunakan untuk mendapatkan jejer actual witel per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerActualWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataJejerActualWitel($model, $periode, $ubis, $pembagi);
	}

	/**
	 * getDataRevSegmenDatel function.
	 * digunakan untuk mendapatkan executive summary segmen witel
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $segmen (default: null) : filter segmen
	 * @param mixed $witel (default: null) : filter witel
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataRevSegmenDatel($model, $periode, $segmen = null, $witel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataRevSegmenDatel($model, $periode, $segmen, $witel, $pembagi);
	}

	/**
	 * getDataEXSUMDatel2 function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $dataNasional (default: null)
	 * @param mixed $segmen (default: null)
	 * @param mixed $sourceData (default: null)
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataEXSUMDatel2($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null, $sourceData = null, $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatel2($model, $periode, $datel, $neraca, $dataNasional, $segmen, $sourceData, $pembagi);
	}

	/**
	 * getDataEXSUMDatelDetail2 function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $segmen (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDatelDetail2($model, $periode, $datel = null, $neraca = null, $segmen = null, $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatelDetail2($model, $periode, $datel, $neraca, $segmen, $pembagi);
	}

	/**
	 * getDataEXSUMDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $dataNasional (default: null)
	 * @param mixed $segmen (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDatel($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatel($model, $periode, $datel, $neraca, $dataNasional, $segmen, $pembagi);
	}
	
	function getDataEXSUMDatelAllRecalculate($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		//cek Buffer
		$temp = array("rs" => array("rows" => array()));
		{
			$sql = new server_util_arrayList();
			$datel = null;
			$result = $this->getDataEXSUMCC($model, $periode, "", $this->lokasi, $neraca, $pembagi);
			$result = json_decode($result); 
			$val =(array)  $result->rs->rows[0];
		
			$val["ubis"] = 'Telkom Unconsole';
			$val["kode_neraca"] = 'Telkom Unconsole';
			$val["nama"] = 'Telkom Unconsole';
			$tmpVal = array();
			foreach ($val as $key => $value){
				$tmpVal[$key] = $value;
			}
			$temp["rs"]["rows"][] = $tmpVal;
			$done = false;
			foreach ($result->rs->rows as $val){
				if (!$done){
					$val->ubis = 'NAS';
					$val->level_spasi = $val->level_spasi + 1;
					$val->nama = "&nbsp;&nbsp;&nbsp;&nbsp;" . $val->nama;
					$temp["rs"]["rows"][] = $val;
				}	
				if ($val->kode_neraca == 'EBD') $done = true;
			}
			$temp["rs"]["rows"][0] = $temp["rs"]["rows"][count($temp["rs"]["rows"]) - 1];
			$val =(array)  $temp["rs"]["rows"][0];
		
			$val["ubis"] = 'Telkom Unconsole';
			$val["kode_neraca"] = 'Telkom Unconsole';
			$val["nama"] = 'Telkom Unconsole';
			$tmpVal = array();
			foreach ($val as $key => $value){
				$tmpVal[$key] = $value;
			}
			$temp["rs"]["rows"][0] = $tmpVal;
		
			$segmen = json_decode($this->witelLib->getDataEXSUMDatelUnconsole($model, $periode, $datel, $neraca, $dataNasional, $segmen, $pembagi)); 
		
			foreach ($segmen->rs->rows as $val){
				$temp["rs"]["rows"][] = $val;
			}
			//save to table
			$nu = 0;
			$result = json_encode($temp);
			try{
				$sql->add("delete from exs_exsum_report where menu_report = 'ES199' and periode = '$periode' and pembagi = $pembagi ");
		
				foreach ($temp["rs"]["rows"] as $line){
					//error_log(json_encode($line));
					$line = json_decode(json_encode($line),false);
					$sql->add("insert into exs_exsum_report(
								pembagi, menu_report, no_urut, ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex,
								aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actthnlalu, acvpsn, acvgap,
								growthpsn, growthgap, acvytdpsn, acvytdrp,growthytypsn, growthytyrp, contrib, periode )
						values($pembagi, 'ES199',".$nu.",'".$line->ubis."','".$line->kode_neraca."','".$line->nama."','".$line->tipe."','".$line->jenis_akun."','".$line->sum_header."','".$line->level_spasi."','".$line->kode_induk."','".$line->rowindex."',
								".$line->aggthn.", ".$line->aggbln.", ". $line->aggsd.",".$line->actbln.", ".$line->actsd.",".$line->trend.",".$line->actall.",".$line->acvpsn.",".$line->acvgap.",
								". $line->growthpsn ." , ".$line->growthgap.",".$line->acvytdpsn.",".$line->acvytdrp.",".$line->growthytypsn.",". $line->growthytyrp .",".$line->contrib.",'$periode'           )");
					
					$nu++;
				}
				$ret = $this->dbLib->execArraySQL($sql);
				error_log($ret);
			}catch(Exception $e){
				error_log($ret);
			}
		}
		
		return $result;
	}
	
	function getDataEXSUMDatelAll($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		//cek Buffer
		$rs = $this->dbLib->execute("select distinct periode from exs_exsum_report where menu_report = 'ES199' and periode = '$periode' and pembagi = $pembagi ");
		$temp = array("rs" => array("rows" => array()));
		//if (!isset($datel)) $datel = "";
		if ($row = $rs->FetchNextObject(false) )
		{
		//"nama","aggthn","trend","aggbln","actbln","acvpsn","acvgap","growthpsn","growthgap", "aggsd", "actsd", "acvytdpsn","acvytdrp", "actall","growthytypsn","growthytyrp","contrib"
			$rs = $this->dbLib->execute("select pembagi, menu_report, no_urut, ubis
							, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex,
	 						aggthn, aggbln, aggsd, actbln, actsd, actblnlalu as trend, actthnlalu as actall, acvpsn, acvgap,
	 						growthpsn, growthgap, acvytdpsn, acvytdrp,growthytypsn, growthytyrp, contrib  from exs_exsum_report where menu_report = 'ES199' and periode = '$periode' and pembagi = $pembagi order by no_urut ");
			while ($row = $rs->FetchNextObject(false)){
				$temp["rs"]["rows"][] = (array) $row;
			}
			$result = json_encode($temp);
		}else
		 {
			
			$result = $this->getDataEXSUMCC($model, $periode, "", $this->lokasi,$neraca, $pembagi);
			$result = json_decode($result); 
			$val =(array)  $result->rs->rows[0];
		
			$val["ubis"] = 'Telkom Unconsole';
			$val["kode_neraca"] = 'Telkom Unconsole';
			$val["nama"] = 'Telkom Unconsole';
			$tmpVal = array();
			foreach ($val as $key => $value){
				$tmpVal[$key] = $value;
			}
			$temp["rs"]["rows"][] = $tmpVal;
			$done = false;
			foreach ($result->rs->rows as $val){
				if (!$done){
					$val->ubis = 'NAS';
					$val->level_spasi = $val->level_spasi + 1;
					$val->nama = "&nbsp;&nbsp;&nbsp;&nbsp;" . $val->nama;
					$temp["rs"]["rows"][] = $val;
				}	
				if ($val->kode_neraca == 'EBD') $done = true;
			}
			$temp["rs"]["rows"][0] = $temp["rs"]["rows"][count($temp["rs"]["rows"]) - 1];
			$val =(array)  $temp["rs"]["rows"][0];
		
			$val["ubis"] = 'Telkom Unconsole';
			$val["kode_neraca"] = 'Telkom Unconsole';
			$val["nama"] = 'Telkom Unconsole';
			$tmpVal = array();
			foreach ($val as $key => $value){
				$tmpVal[$key] = $value;
			}
			$temp["rs"]["rows"][0] = $tmpVal;
		
		
			$segmen = json_decode($this->witelLib->getDataEXSUMDatelUnconsole($model, $periode,$datel, $neraca, $dataNasional, $segmen, $pembagi)); 
		
			foreach ($segmen->rs->rows as $val){
				$temp["rs"]["rows"][] = $val;
			}
			//save to table
			$nu = 0;
			$result = json_encode($temp);
			
		}
		return $result;
	}
	/**
	 * getDataEXSUMDatelPlusAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $dataNasional (default: null)
	 * @param mixed $segmen (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDatelPlusAkun($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatelPlusAkun($model, $periode, $datel, $neraca, $dataNasional, $segmen, $pembagi);
	}

	/**
	 * getDataEXSUMDatelPlusAkun2 function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $dataNasional (default: null)
	 * @param mixed $segmen (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDatelPlusAkun2($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatelPlusAkun2($model, $periode, $datel, $neraca, $dataNasional, $segmen, $pembagi);
	}

	/**
	 * getDataEXSUMDatelDetail3 function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $segmen (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDatelDetail3($model, $periode, $datel = null, $neraca = null, $segmen = null, $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatelDetail3($model, $periode, $datel, $neraca, $segmen, $pembagi);
	}

	/**
	 * getDataEXSUMDatelDetail function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $kode_ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDatelDetail($model, $periode, $datel = null, $neraca = null, $kode_ubis = null,  $pembagi = 1000000000){
		return $this->witelLib->getDataEXSUMDatelDetail($model, $periode, $datel, $neraca, $kode_ubis, $pembagi);
	}

	/**
	 * getDataTrendDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDatel($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendDatel($model, $thn1, $thn2, $datel, $pembagi);
	}

	/**
	 * getDataTrendDatelAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDatelAkun($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendDatelAkun($model, $thn1, $thn2, $datel, $pembagi);
	}

	/**
	 * getDataTrendDatelBudget function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDatelBudget($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendDatelBudget($model, $thn1, $thn2, $datel, $pembagi);
	}

	/**
	 * getDataTrendDatelBudgetAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDatelBudgetAkun($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendDatelBudgetAkun($model, $thn1, $thn2, $datel, $pembagi);
	}

	/**
	 * getDataTrendSegmenDatelAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param mixed $kode_ubis (default: null)
	 * @param mixed $nama (default: null)
	 * @param mixed $segmen (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendSegmenDatelAkun($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendSegmenDatelAkun($model, $thn1, $thn2, $datel, $kode_ubis, $nama, $segmen, $pembagi);
	}

	/**
	 * getDataBudgetTrendDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataBudgetTrendDatel($model, $thn1, $thn2, $datel = null, $neraca = null, $pembagi = 1000000000){
		return $this->witelLib->getDataBudgetTrendDatel($model, $thn1, $thn2, $datel, $neraca, $pembagi);
	}
	/**
	 * getDataTrendOutlookDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $datel (default: null)
	 * @param mixed $neraca (default: null)
	 * @param mixed $metode (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendOutlookDatel($model, $thn1, $thn2, $datel = null, $neraca= null, $metode = null,$pembagi = 1000000000){
		return $this->witelLib->getDataTrendOutlookDatel($model, $thn1, $thn2, $datel, $neraca, $metode, $pembagi);
	}
	/**
	 * getDataTrendOutlookDatelDetail function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendOutlookDatelDetail($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendOutlookDatelDetail($model, $thn1, $thn2, $ubis, $neraca, $pembagi);
	}
	/**
	 * getDataRevDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataRevDatel($model, $periode, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataRevDatel($model, $periode, $datel, $pembagi);
	}
	/**
	 * getDataExpDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataExpDatel($model, $periode, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataExpDatel($model, $periode, $datel, $pembagi);
	}
	/**
	 * getDataAccountDatel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $nTop
	 * @param mixed $jenis
	 * @param mixed $order
	 * @param mixed $sortOrder (default: null)
	 * @param mixed $datel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataAccountDatel($model, $periode, $nTop, $jenis, $order, $sortOrder = null, $datel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataAccountDatel($model, $periode, $nTop, $jenis, $order, $sortOrder, $datel, $pembagi);
	}
	/**
	 * getDataJejerSegmen function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $witel (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataJejerSegmen($model, $periode, $witel = null, $pembagi = 1000000000){
		return $this->witelLib->getDataJejerSegmen($model, $periode, $witel, $pembagi);
	}
	//--------------------- end of ebitda commerce
	//----------- Per Cost Center
	//----------- outlook
	function getDataOutlook($model, $periode, $ubis = null, $neraca = null, $pembagi = 1000000000){
		// Laporan ini digunakan untuk Triwulan2 ke atas
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else if (strlen($ubis) == 7)
			$filter = " and a.kode_cc like '$ubis%' ";
		else if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		else $filter = " and z.kode_ubis like '$ubis%' ";
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, c.trend, d.trend as trendlalu
				   from exs_masakun a
					left outer join (
							select a.kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by a.kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as trend
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter  group by a.kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as trend
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter group by a.kode_akun, tahun ) d on  d.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){

			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summaries($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $val->data->aggthn;
						$nodeHeader->data->aggbln += $val->data->aggbln;
						$nodeHeader->data->trend += $val->data->trend;
						$nodeHeader->data->aggsd += $val->data->aggsd;
						$nodeHeader->data->actbln += $val->data->actbln;
						$nodeHeader->data->actsd += $val->data->actsd;
						$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
						//$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResult($rootNode, $result, $neraca);
		return json_encode($result);

	}

	/**
	 * getDataTrendOutlook function.
	 * digunakan untuk menampilkan data Outlook berdasar metode perhitungan AVERAGE, GROWTH, atau Gabungan.
	 * @access public
	 * @param mixed $model		: model report yang akan di tampilkan
	 * @param mixed $thn1		: tahun outlook yang akan di sajikan
	 * @param mixed $thn2		: tahun pembandign untuk growth
	 * @param mixed $ubis (default: null)	: filter divisi ubis
	 * @param mixed $neraca (default: null)	: filter neraca yang akan di tampilkan
	 * @param mixed $metode (default: null)	: filter metode yang akan digunakan
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk mendapatkan satuan sesuai dengan yang diinginkan
	 * @return void
	 */
	function getDataTrendOutlook($model, $thn1, $thn2, $ubis = null, $neraca= null, $metode = null,$pembagi = 1000000000){
		try
        {
			if (!isset($metode)) $metode = "GROWTH";
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			$month = floatval($month);

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";

			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)  as jan1
											, nvl(b.feb, 0)  as feb1
											, nvl(b.mar, 0)  as mar1
											, nvl(b.apr, 0)  as apr1
											, nvl(b.mei, 0)  as mei1
											, nvl(b.jun, 0)  as jun1
											, nvl(b.jul, 0)  as jul1
											, nvl(b.aug, 0)  as aug1
											, nvl(b.sep, 0)  as sep1
											, nvl(b.okt, 0)  as okt1
											, nvl(b.nop, 0)  as nop1
											, nvl(b.des, 0)  as des1
											, nvl(b.total, 0) as total1
											, nvl(b.jan2, 0)  as jan2
											, nvl(b.feb2, 0)  as feb2
											, nvl(b.mar2, 0)  as mar2
											, nvl(b.apr2, 0)  as apr2
											, nvl(b.mei2, 0)  as mei2
											, nvl(b.jun2, 0)  as jun2
											, nvl(b.jul2, 0)  as jul2
											, nvl(b.aug2, 0)  as aug2
											, nvl(b.sep2, 0)  as sep2
											, nvl(b.okt2, 0)  as okt2
											, nvl(b.nop2, 0)  as nop2
											, nvl(b.des2, 0)  as des2
											, nvl(b.total2, 0) as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
			//error_log(strtoupper($metode));
			while ($row = $rs->FetchNextObject(false)){
				$value = (array) $row;
				if (strtoupper($metode) == "GROWTH"){
					$prevMonthValue = $value[$listBulan[$month-1]."1"];
					$test = "";
					$total = $row->total1;
					for ($i = $month; $i <= 12; $i++){
						if ($value[$listBulan[$i-1]."2"] != 0)
							$growth = ($value[$listBulan[$i]."2"] - $value[$listBulan[$i-1]."2"]) / $value[$listBulan[$i-1]."2"];
						else $growth = 0;
						$test .= $i .":".$growth .":".$value[$listBulan[$i]."2"].":".$value[$listBulan[$i-1]."2"];
						$monthValue = $prevMonthValue * $growth + $prevMonthValue;
						$total += $monthValue;
						$value[$listBulan[$i]."1"] = $monthValue;
						$prevMonthValue = $monthValue;
						eval("\$row->".$listBulan[$i]."1 = $monthValue;");
					}
				}else if (strtoupper($metode) == "AVERAGE"){
					/*$total = 0;
					//3 bulan sebelumnya
					$start = $month - 3;
					for ($i = $start; $i <= $month-1; $i++){
						$total += $value[$listBulan[$i]."1"];
					}
					$avg = $total / 3;
					$total = $row->total1;
					for ($i = $month ; $i <= 12; $i++){
						$total += $avg;
						$value[$listBulan[$i]."1"] = $avg;
						eval("\$row->".$listBulan[$i]."1 = $avg;");
					}*/
					for ($m = $month; $m <= 12; $m++  ){
						$total = 0;
						$start = $m - 3;
						for ($i = $start; $i <= $m-1; $i++){
							$total += $value[$listBulan[$i]."1"];
						}
						$avg = $total / 3;
						$value[$listBulan[$m]."1"] = $avg;
						eval("\$row->".$listBulan[$m]."1 = $avg;");
					}
					$total = $row->total1;

					for ($i = $month; $i <= 12; $i++){
						$total += $value[$listBulan[$i]."1"];
						///$value[$listBulan[$i]."1"] = $avg;
						//eval("\$row->".$listBulan[$i]."1 = $avg;");
					}

				}else if (strtoupper($metode) == "CAR"){
					$prevMonthValue = $value[$listBulan[$month-1]."1"];
					$test = "";
					$total = $row->total1;
					for ($i = $month; $i <= 12; $i++){
						if ($value[$listBulan[$i-1]."2"] != 0)
							$growth = ($value[$listBulan[$i]."2"] - $value[$listBulan[$i-1]."2"]) / $value[$listBulan[$i-1]."2"];
						else $growth = 0;
						$test .= $i .":".$growth .":".$value[$listBulan[$i]."2"].":".$value[$listBulan[$i-1]."2"];
						$monthValue = $prevMonthValue * $growth + $prevMonthValue;
						$total += $monthValue;
						$value[$listBulan[$i]."1"] = $monthValue;
						$prevMonthValue = $monthValue;
						eval("\$row->".$listBulan[$i]."1 = $monthValue;");
					}
				}else{
					$total = 0;
					for ($i = 1; $i <= $month; $i++){
						$total += $value[$listBulan[$i-1]."1"];
					}
					$avg = $total / $month;
					$total = $row->total1;
					if ( $month % 3 == 0)
						$prevMonthValue = $value[$listBulan[$month-1]."1"];
					else $monthValue = $avg;
					for ($i = $month; $i <= 12; $i++){
						if ($i % 3 == 0){
							if ($value[$listBulan[$i-1]."2"] != 0)
								$growth = ($value[$listBulan[$i]."2"] - $value[$listBulan[$i-1]."2"]) / $value[$listBulan[$i-1]."2"];
							else $growth = 0;
							if ($value[$listBulan[$i-1]."2"] == 0)
								$monthValue = $value[$listBulan[$i]."2"];
							else $monthValue = $prevMonthValue * $growth + $prevMonthValue;
						}
						$total += $monthValue;
						$value[$listBulan[$i]."1"] = $monthValue;
						$prevMonthValue = $monthValue;
						eval("\$row->".$listBulan[$i]."1 = $monthValue;");
					}
				}
				//error_log($test);
				for ($i = 1; $i <= 12; $i++){
					$monthValue1 =  $value[$listBulan[$i]."1"];
					$monthValue2 =  $value[$listBulan[$i]."2"];
					eval("\$row->".$listBulan[$i]."1 = $monthValue1 / $pembagi;");
					eval("\$row->".$listBulan[$i]."2 = $monthValue2 / $pembagi;");
				}
				$row->total1 = $total / $pembagi;
				$row->total2 = $row->total2 / $pembagi;
				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrend($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(Exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * generateDataOutlook function.
	 * fungsi ini digunakan untuk proses generate xls data outlook detail sampe level akun
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun outlook
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default: null)	: filter neraca
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk mendapatkan satuan millir, juta, ribu, atau mutlak.
	 * @return void
	 */
	function generateDataOutlook($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000)
     {
			if (!isset($pembagi)) $pembagi = 1000000000;

			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			$month = floatval($month);

			$q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			$q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun, b.kode_cc,
									$q1,
									$q2
							from exs_masakun a
							inner join (
									select a.kode_cc, a.kode_akun,jan , feb , mar , apr , mei , jun , jul , aug , sep , okt , nop , des
											, (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_cc, a.kode_akun,jan , feb , mar , apr , mei , jun , jul , aug , sep , okt , nop , des
											, (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter  ) c on c.kode_akun = a.kode_akun and c.kode_cc = b.kode_cc
					";
			$rs = $this->dbLib->execute("select x.kode_neraca, x.kode_akun, z.nama, y.kode_cc, w.nama as nm_cc
																, sum(nvl(jan,0) ) as jan1
																, sum(nvl(feb,0) ) as feb1
																, sum(nvl(mar,0) ) as mar1
																, sum(nvl(apr,0) ) as apr1
																, sum(nvl(mei,0) ) as mei1
																, sum(nvl(jun,0) ) as jun1
																, sum(nvl(jul,0) ) as jul1
																, sum(nvl(aug,0) ) as aug1
																, sum(nvl(sep,0) ) as sep1
																, sum(nvl(okt,0) ) as okt1
																, sum(nvl(nop,0) ) as nop1
																, sum(nvl(des,0) ) as des1
																, sum(nvl(total,0) ) as total1
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															inner join exs_masakun z on z.kode_akun = x.kode_akun
															inner join exs_cc w on w.kode_cc = y.kode_cc
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun, z.nama, y.kode_cc, w.nama order by y.kode_cc, x.kode_akun");
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
			$result = array('rs' => array('rows' => array() ) );
			//save to file

			$data = new server_util_arrayList();
	        $optionsData = new server_util_arrayList();
			while ($row = $rs->FetchNextObject(false)){
				$value = (array) $row;
				$prevMonthValue = $value[$listBulan[$month-1]."1"];


				for ($m = $month; $m <= 12; $m++  ){
					$total = 0;
					$start = $m - 3;
					for ($i = $start; $i <= $m-1; $i++){
						$total += $value[$listBulan[$i]."1"];
					}
					$avg = $total / 3;
					$value[$listBulan[$m]."1"] = $avg;
					eval("\$row->".$listBulan[$m]."1 = $avg;");
				}
				$total = 0;

				for ($i = 1; $i <= 12; $i++){
					$total += $value[$listBulan[$i]."1"];
					///$value[$listBulan[$i]."1"] = $avg;
					//eval("\$row->".$listBulan[$i]."1 = $avg;");
				}
				//error_log($test);
				for ($i = 1; $i <= 12; $i++){
					$monthValue1 =  $value[$listBulan[$i]."1"];
					$monthValue2 =  $value[$listBulan[$i]."2"];
					eval("\$row->".$listBulan[$i]."1 = $monthValue1  ;");
					eval("\$row->".$listBulan[$i]."2 = $monthValue2  ;");
				}
				$row->total1 = $total  ;
				$row->total2 = $row->total2 ;
				$value = (array) $row;
				$dataRow = new server_util_Map($value);
				$optionsData->add($dataRow);
			}
		return $optionsData;
	}
	/**
	 * getDataTrendOutlookDetail function.
	 * digunakan untuk download data template outlook
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun outlook
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default: null)	: filter neraca
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk mendapatkan satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataTrendOutlookDetail($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		try{
			if ($ubis == ""){
				$rs = $this->dbLib->execute("select b.group_ubis as kode_ubis, b.group_ubis as nama from exs_ubis a inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis order by b.group_ubis ");
			}else {
				$rs = $this->dbLib->execute("select a.kode_ubis, a.nama from exs_ubis a where kode_ubis = '$ubis'");
			}
			$dataPL = new server_util_Map();
			uses("server_modules_xls_Writer", false);
			global $manager;
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
			$options = new server_util_Map();
	        $options->set("fields", new server_util_arrayList());
	        $options->get("fields")->add("kode_akun");
	        $options->get("fields")->add("nama");
	        $options->get("fields")->add("kode_cc");
	        $options->get("fields")->add("nm_cc");
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
		        	$options->get("fields")->add($value."1");
	        }
	        $options->get("fields")->add("total1");
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
		        		$options->get("fields")->add($value."2");
	        }
	        $options->get("fields")->add("total2");
	        $header = new server_util_Map();
	        $header->set("title","Outlook");
	        $header->set("periode", "");
	        $header->set("startRow",2);
	        $header->set("startCol",0);
	        $title = new server_util_arrayList();
	        $title->add(new server_util_Map(array("title" => "Account", "width" => 10)));
	        $title->add(new server_util_Map(array("title" => "Desk", "width" => 30)));
	        $title->add(new server_util_Map(array("title" => "Cost-Profit Center", "width" => 10)));
	        $title->add(new server_util_Map(array("title" => "CC Desk", "width" => 30)));
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
	        		$title->add(new server_util_Map(array("title" => $value ."-$thn1", "width" => 10)));
	        }
	        $title->add(new server_util_Map(array("title" => "total-$thn1", "width" => 10)));
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
	        		$title->add(new server_util_Map(array("title" => $value ."-$thn2", "width" => 10)));
	        }
	        $title->add(new server_util_Map(array("title" => "total-$thn2", "width" => 10)));
	        $header->set("columnTitle", $title);
	        $options->set("header", $header);

			$optionsData = $this->generateDataOutlook($model, $thn1, $thn2, $ubis, $neraca, $pembagi);
			$data = new server_util_Map();
			$data->set("data", $optionsData);
			$data->set("title", "Outlook Detail" );
			$data->set("witel", $this->lokasiNas );
			$dataPL->set($this->lokasiNas,$data);
			while ($row = $rs->FetchNextObject(false)){
				$optionsData = $this->generateDataOutlook($model, $thn1, $thn2, $row->kode_ubis, $neraca, $pembagi);
				$data = new server_util_Map();
				$data->set("data", $optionsData);
				$data->set("title", "Outlook Detail " . $row->kode_ubis );
				$data->set("witel", $row->kode_ubis );
				$dataPL->set($row->kode_ubis,$data);
			}

			$excel = new server_util_Xls();
			$file = md5(date("r"));
			$excel->generateDatel($options, $file, $dataPL);
			$excel->save();


		    ob_end_clean();
		    ob_start();
		    header("Content-Encoding: ");

			$manager->setSendResponse(false);
			header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
			header ("Cache-Control: no-cache, must-revalidate");
			header ("Pragma: no-cache");
			header ("Content-type: Content-Type: application/vnd.ms-excel");
			header ("Content-Disposition: attachment; filename=outlook.xls");
			header ("Content-Description: PHP/INTERBASE Generated Data" );
			echo file_get_contents("./tmp/$file");
			unlink("./tmp/$file");
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * generateDataOutlookDivre function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $divre (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function generateDataOutlookDivre($model, $thn1, $thn2, $divre = null, $neraca= null, $pembagi = 1000000000){
			if (!isset($pembagi)) $pembagi = 1000000000;

			$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$divre%' or kode_witel in (select witel from exs_divre where kode_ubis = '$divre' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			$month = date("m");
			$year = date("Y");
			$month = floatval($month);

			$q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			$q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun, b.kode_cc,
									$q1,
									$q2
							from exs_masakun a
							inner join (
									select a.kode_cc, a.kode_akun,jan , feb , mar , apr , mei , jun , jul , aug , sep , okt , nop , des
											, (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1'  $filter ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_cc, a.kode_akun,sum(jan ) as jan, sum(feb) as feb , sum(mar) as mar , sum(apr) as apr
											, sum(mei) as mei , sum(jun) as jun , sum(jul) as jul , sum(aug) as aug , sum(sep) as sep
											, sum(okt) as okt , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2'  $filter group by a.kode_cc, a.kode_akun ) c on c.kode_akun = a.kode_akun and c.kode_cc = b.kode_cc
					";
			$rs = $this->dbLib->execute("select x.kode_neraca, x.kode_akun, z.nama, y.kode_cc, w.nama as nm_cc
																, sum(nvl(jan,0) ) as jan1
																, sum(nvl(feb,0) ) as feb1
																, sum(nvl(mar,0) ) as mar1
																, sum(nvl(apr,0) ) as apr1
																, sum(nvl(mei,0) ) as mei1
																, sum(nvl(jun,0) ) as jun1
																, sum(nvl(jul,0) ) as jul1
																, sum(nvl(aug,0) ) as aug1
																, sum(nvl(sep,0) ) as sep1
																, sum(nvl(okt,0) ) as okt1
																, sum(nvl(nop,0) ) as nop1
																, sum(nvl(des,0) ) as des1
																, sum(nvl(total,0) ) as total1
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															inner join exs_masakun z on z.kode_akun = x.kode_akun
															inner join exs_cc w on w.kode_cc = y.kode_cc
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun, z.nama, y.kode_cc, w.nama order by y.kode_cc, x.kode_akun");
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
			$result = array('rs' => array('rows' => array() ) );
			//save to file

			$data = new server_util_arrayList();
	        $optionsData = new server_util_arrayList();
			while ($row = $rs->FetchNextObject(false)){
				$value = (array) $row;
				$prevMonthValue = $value[$listBulan[$month-1]."1"];


				for ($m = $month; $m <= 12; $m++  ){
					$total = 0;
					$start = $m - 3;
					for ($i = $start; $i <= $m-1; $i++){
						$total += $value[$listBulan[$i]."1"];
					}
					$avg = $total / 3;
					$value[$listBulan[$m]."1"] = $avg;
					eval("\$row->".$listBulan[$m]."1 = $avg;");
				}
				$total = 0;

				for ($i = 1; $i <= 12; $i++){
					$total += $value[$listBulan[$i]."1"];
					///$value[$listBulan[$i]."1"] = $avg;
					//eval("\$row->".$listBulan[$i]."1 = $avg;");
				}
				//error_log($test);
				for ($i = 1; $i <= 12; $i++){
					$monthValue1 =  $value[$listBulan[$i]."1"];
					$monthValue2 =  $value[$listBulan[$i]."2"];
					eval("\$row->".$listBulan[$i]."1 = $monthValue1  ;");
					eval("\$row->".$listBulan[$i]."2 = $monthValue2  ;");
				}
				$row->total1 = $total  ;
				$row->total2 = $row->total2 ;
				$value = (array) $row;
				$dataRow = new server_util_Map($value);
				$optionsData->add($dataRow);
			}
		return $optionsData;
	}
	/**
	 * getDataTrendOutlookDivreDetail function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendOutlookDivreDetail($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		try{

			$dataPL = new server_util_Map();
			uses("server_modules_xls_Writer", false);
			global $manager;
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
			$options = new server_util_Map();
	        $options->set("fields", new server_util_arrayList());
	        $options->get("fields")->add("kode_akun");
	        $options->get("fields")->add("nama");
	        $options->get("fields")->add("kode_cc");
	        $options->get("fields")->add("nm_cc");
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
		        	$options->get("fields")->add($value."1");
	        }
	        $options->get("fields")->add("total1");
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
		        		$options->get("fields")->add($value."2");
	        }
	        $options->get("fields")->add("total2");
	        $header = new server_util_Map();
	        $header->set("title","Outlook");
	        $header->set("periode", "");
	        $header->set("startRow",2);
	        $header->set("startCol",0);
	        $title = new server_util_arrayList();
	        $title->add(new server_util_Map(array("title" => "Account", "width" => 10)));
	        $title->add(new server_util_Map(array("title" => "Desk", "width" => 30)));
	        $title->add(new server_util_Map(array("title" => "Cost-Profit Center", "width" => 10)));
	        $title->add(new server_util_Map(array("title" => "CC Desk", "width" => 30)));
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
	        		$title->add(new server_util_Map(array("title" => $value ."-$thn1", "width" => 10)));
	        }
	        $title->add(new server_util_Map(array("title" => "total-$thn1", "width" => 10)));
	        foreach ($listBulan as $key => $value) {
	        	if ($key > 0)
	        		$title->add(new server_util_Map(array("title" => $value ."-$thn2", "width" => 10)));
	        }
	        $title->add(new server_util_Map(array("title" => "total-$thn2", "width" => 10)));
	        $header->set("columnTitle", $title);
	        $options->set("header", $header);
	        $rs = $this->dbLib->execute("select kode_ubis, nama from exs_ubis where kode_induk in ('T910','T911') order by kode_ubis");
			while ($row = $rs->FetchNextObject(false)){
				$optionsData = $this->generateDataOutlookDivre($model, $thn1, $thn2, $row->kode_ubis, $neraca, $pembagi);
				$data = new server_util_Map();
				$data->set("data", $optionsData);
				$data->set("title", "Outlook Detail " . $row->kode_ubis );
				$data->set("witel", $row->kode_ubis );
				$dataPL->set($row->kode_ubis,$data);
			}

			$excel = new server_util_Xls();
			$file = md5(date("r"));
			$excel->generateDatel($options, $file, $dataPL);
			$excel->save();


		    ob_end_clean();
		    ob_start();
		    header("Content-Encoding: ");

			$manager->setSendResponse(false);
			header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
			header ("Cache-Control: no-cache, must-revalidate");
			header ("Pragma: no-cache");
			header ("Content-type: Content-Type: application/vnd.ms-excel");
			header ("Content-Disposition: attachment; filename=outlook.xls");
			header ("Content-Description: PHP/INTERBASE Generated Data" );
			echo file_get_contents("./tmp/$file");
			unlink("./tmp/$file");
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataTrendQuartOutlook function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendQuartOutlook($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan as q11, 0 as q12, 0 as q13, 0 as q14, b.jan as total";
				if ($month == 2) $q1 = "b.jan + b.feb as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan + b.feb + b.mar as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan + b.feb + b.mar as q11, b.apr as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as q21, 0 as q22, 0 as q23, 0 as q24, c.jan as total2";
				if ($month == 2) $q2 = "c.jan + c.feb as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan + c.feb + c.mar as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan + c.feb + c.mar as q21, c.apr as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun  as total2";
				if ($month == 7) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select  a.kode_akun,
									 $q1,
									 $q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_outlook a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.q11, 0)  as q11
											, nvl(b.q12, 0)  as q12
											, nvl(b.q13, 0)  as q13
											, nvl(b.q14, 0)  as q14
											, nvl(b.total, 0)  as total1
											, nvl(b.q21, 0)  as q21
											, nvl(b.q22, 0)  as q22
											, nvl(b.q23, 0)  as q23
											, nvl(b.q24, 0)  as q24
											, nvl(b.total2, 0)  as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(q11,0) ) as q11
																, sum(nvl(q12,0) ) as q12
																, sum(nvl(q13,0) ) as q13
																, sum(nvl(q14,0) ) as q14
																, sum(nvl(total,0) ) as total
																, sum(nvl(q21,0) ) as q21
																, sum(nvl(q22,0) ) as q22
																, sum(nvl(q23,0) ) as q23
																, sum(nvl(q24,0) ) as q24
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$quarter = round(($month+1) /  3);
			$prevQuarter = $quarter - 1;
			while ($row = $rs->FetchNextObject(false)){
				$value = (array) $row;
				$prevQuarterValue = $value["q1". $prevQuarter ];
				for ($i= $quarter; $i <= 4; $i++){
					if ($value["q2" . ($quarter - 1)] != 0)
						$growth = ($value["q2$i"] - $value["q2".($i - 1)]) / $value["q2". ($i - 1)];
					else $growth = 0;
					$quarterValue = $prevQuarterValue * $growth + $prevQuarterValue;
					$prevQuarterValue = $quarterValue;
					$value["q1$i"] = $quarterValue;
					eval("\$row->q1$i = $quarterValue;");
				}
				$total1 = 0;
				for ($i = 1; $i <= 4 ; $i++){
					$total1 += $value["q1$i"];
					$quarterValue1 = $value["q1$i"];
					$quarterValue2 = $value["q2$i"];
					eval("\$row->q1$i = $quarterValue1 / $pembagi; ");
					eval("\$row->q2$i = $quarterValue2 / $pembagi; ");
				}
				$row->total1 = $total1 / $pembagi;
				$row->total2 = $row->total2 / $pembagi;

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrendQuart($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->q11 += $val->data->q11;
							$nodeHeader->data->q12 += $val->data->q12;
							$nodeHeader->data->q13 += $val->data->q13;
							$nodeHeader->data->q14 += $val->data->q14;
							$nodeHeader->data->total1 += $val->data->total1;
							$nodeHeader->data->q21 += $val->data->q21;
							$nodeHeader->data->q22 += $val->data->q22;
							$nodeHeader->data->q23 += $val->data->q23;
							$nodeHeader->data->q24 += $val->data->q24;
							$nodeHeader->data->total2 += $val->data->total2;

						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrendQuart($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendQuartOutlook1 function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendQuartOutlook1($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			$month = floatval($month);

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, 0 as q11
											, 0 as q12
											, 0 as q13
											, 0 as q14
											, 0 as q21
											, 0 as q22
											, 0 as q23
											, 0 as q24
											, nvl(b.jan, 0)  as jan1
											, nvl(b.feb, 0)  as feb1
											, nvl(b.mar, 0)  as mar1
											, nvl(b.apr, 0)  as apr1
											, nvl(b.mei, 0)  as mei1
											, nvl(b.jun, 0)  as jun1
											, nvl(b.jul, 0)  as jul1
											, nvl(b.aug, 0)  as aug1
											, nvl(b.sep, 0)  as sep1
											, nvl(b.okt, 0)  as okt1
											, nvl(b.nop, 0)  as nop1
											, nvl(b.des, 0)  as des1
											, nvl(b.total, 0) as total1
											, nvl(b.jan2, 0)  as jan2
											, nvl(b.feb2, 0)  as feb2
											, nvl(b.mar2, 0)  as mar2
											, nvl(b.apr2, 0)  as apr2
											, nvl(b.mei2, 0)  as mei2
											, nvl(b.jun2, 0)  as jun2
											, nvl(b.jul2, 0)  as jul2
											, nvl(b.aug2, 0)  as aug2
											, nvl(b.sep2, 0)  as sep2
											, nvl(b.okt2, 0)  as okt2
											, nvl(b.nop2, 0)  as nop2
											, nvl(b.des2, 0)  as des2
											, nvl(b.total2, 0) as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){
				$value = (array) $row;
				$prevMonthValue = $value[$listBulan[$month-1]."1"];
				$test = "";
				$total = $row->total1;
				for ($i = $month; $i <= 12; $i++){
					if ($value[$listBulan[$i-1]."2"] != 0)
						$growth = ($value[$listBulan[$i]."2"] - $value[$listBulan[$i-1]."2"]) / $value[$listBulan[$i-1]."2"];
					else $growth = 0;
					$test .= $i .":".$growth .":".$value[$listBulan[$i]."2"].":".$value[$listBulan[$i-1]."2"];
					$monthValue = $prevMonthValue * $growth + $prevMonthValue;
					$total += $monthValue;
					$value[$listBulan[$i]."1"] = $monthValue;
					$prevMonthValue = $monthValue;
					eval("\$row->".$listBulan[$i]."1 = $monthValue;");

				}
				for ($i = 1; $i <= 12; $i++){
					$monthValue1 =  $value[$listBulan[$i]."1"];
					$monthValue2 =  $value[$listBulan[$i]."2"];
					eval("\$row->".$listBulan[$i]."1 = $monthValue1;");
					eval("\$row->".$listBulan[$i]."2 = $monthValue2;");
				}
				$row->q11 = ($row->jan1 + $row->feb1 + $row->mar1) / $pembagi;
				$row->q12 = ($row->apr1 + $row->mei1 + $row->jun1) / $pembagi;
				$row->q13 = ($row->jul1 + $row->aug1 + $row->sep1) / $pembagi;
				$row->q14 = ($row->okt1 + $row->nop1 + $row->des1) / $pembagi;
				$row->q21 = ($row->jan2 + $row->feb2 + $row->mar2) / $pembagi;
				$row->q22 = ($row->apr2 + $row->mei2 + $row->jun2) / $pembagi;
				$row->q23 = ($row->jul2 + $row->aug2 + $row->sep2) / $pembagi;
				$row->q24 = ($row->okt2 + $row->nop2 + $row->des2) / $pembagi;

				$row->total1 = $total / $pembagi;
				$row->total2 = $row->total2 / $pembagi;
				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrendQuart($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->q11 += $val->data->q11;
							$nodeHeader->data->q12 += $val->data->q12;
							$nodeHeader->data->q13 += $val->data->q13;
							$nodeHeader->data->q14 += $val->data->q14;
							$nodeHeader->data->total1 += $val->data->total1;
							$nodeHeader->data->q21 += $val->data->q21;
							$nodeHeader->data->q22 += $val->data->q22;
							$nodeHeader->data->q23 += $val->data->q23;
							$nodeHeader->data->q24 += $val->data->q24;
							$nodeHeader->data->total2 += $val->data->total2;

						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrendQuart($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendHalfOutlook function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendHalfOutlook($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			$month = floatval($month);

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2,c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, 0 as s11
											, 0 as s12
											, 0 as s21
											, 0 as s22
											, nvl(b.jan, 0)  as jan1
											, nvl(b.feb, 0)  as feb1
											, nvl(b.mar, 0)  as mar1
											, nvl(b.apr, 0)  as apr1
											, nvl(b.mei, 0)  as mei1
											, nvl(b.jun, 0)  as jun1
											, nvl(b.jul, 0)  as jul1
											, nvl(b.aug, 0)  as aug1
											, nvl(b.sep, 0)  as sep1
											, nvl(b.okt, 0)  as okt1
											, nvl(b.nop, 0)  as nop1
											, nvl(b.des, 0)  as des1
											, nvl(b.total, 0) as total1
											, nvl(b.jan2, 0)  as jan2
											, nvl(b.feb2, 0)  as feb2
											, nvl(b.mar2, 0)  as mar2
											, nvl(b.apr2, 0)  as apr2
											, nvl(b.mei2, 0)  as mei2
											, nvl(b.jun2, 0)  as jun2
											, nvl(b.jul2, 0)  as jul2
											, nvl(b.aug2, 0)  as aug2
											, nvl(b.sep2, 0)  as sep2
											, nvl(b.okt2, 0)  as okt2
											, nvl(b.nop2, 0)  as nop2
											, nvl(b.des2, 0)  as des2
											, nvl(b.total2, 0) as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){
				$value = (array) $row;
				$prevMonthValue = $value[$listBulan[$month-1]."1"];
				$test = "";
				$total = $row->total1;

				$row->s11 = ($row->jan1 + $row->feb1 + $row->mar1 + $row->apr1 + $row->mei1 + $row->jun1) / $pembagi;
				$row->s12 = ($row->jul1 + $row->aug1 + $row->sep1 + $row->okt1 + $row->nop1 + $row->des1) / $pembagi;
				$row->s21 = ($row->jan2 + $row->feb2 + $row->mar2 + $row->apr2 + $row->mei2 + $row->jun2) / $pembagi;
				$row->s22 = ($row->jul2 + $row->aug2 + $row->sep2 + $row->okt2 + $row->nop2 + $row->des2) / $pembagi;

				$row->total1 = $total / $pembagi;
				$row->total2 = $row->total2 / $pembagi;
				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrendHalf($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->q11 += $val->data->q11;
							$nodeHeader->data->q12 += $val->data->q12;
							$nodeHeader->data->q13 += $val->data->q13;
							$nodeHeader->data->q14 += $val->data->q14;
							$nodeHeader->data->total1 += $val->data->total1;
							$nodeHeader->data->q21 += $val->data->q21;
							$nodeHeader->data->q22 += $val->data->q22;
							$nodeHeader->data->q23 += $val->data->q23;
							$nodeHeader->data->q24 += $val->data->q24;
							$nodeHeader->data->total2 += $val->data->total2;

						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrendHalf($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendOutlookTemplate function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendOutlookTemplate($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		try{
			if ($ubis == $this->lokasiNas) $ubis = '';
			if (!isset($pembagi)) $pembagi = 1000000000;
			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
			}else  if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			$q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			$q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrend($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendDetailTemplate function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDetailTemplate($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2,c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, b.kode_akun, c.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' and a.kode_neraca = '$neraca' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );

			while ($row = $rs->FetchNextObject(false)){
				if ($row->jenis_akun =='PENDAPATAN'){
					$row->jan1 = -$row->jan1;
					$row->feb1 = -$row->feb1;
					$row->mar1 = -$row->mar1;
					$row->apr1 = -$row->apr1;
					$row->mei1 = -$row->mei1;
					$row->jun1 = -$row->jun1;
					$row->jul1 = -$row->jul1;
					$row->aug1 = -$row->aug1;
					$row->sep1 = -$row->sep1;
					$row->okt1 = -$row->okt1;
					$row->nop1 = -$row->nop1;
					$row->des1 = -$row->des1;
					$row->total1 = -$row->total1;
					$row->jan2 = -$row->jan2;
					$row->feb2 = -$row->feb2;
					$row->mar2 = -$row->mar2;
					$row->apr2 = -$row->apr2;
					$row->mei2 = -$row->mei2;
					$row->jun2 = -$row->jun2;
					$row->jul2 = -$row->jul2;
					$row->aug2 = -$row->aug2;
					$row->sep2 = -$row->sep2;
					$row->okt2 = -$row->okt2;
					$row->nop2 = -$row->nop2;
					$row->des2 = -$row->des2;
					$row->total2 = -$row->total2;
				}
				$result["rs"]["rows"][] = (array)$row;
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendQuartTemplate function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendQuartTemplate($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan as q11, 0 as q12, 0 as q13, 0 as q14, b.jan as total";
				if ($month == 2) $q1 = "b.jan + b.feb as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan + b.feb + b.mar as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan + b.feb + b.mar as q11, b.apr as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as q21, 0 as q22, 0 as q23, 0 as q24, c.jan as total2";
				if ($month == 2) $q2 = "c.jan + c.feb as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan + c.feb + c.mar as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan + c.feb + c.mar as q21, c.apr as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun  as total2";
				if ($month == 7) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select  a.kode_akun,
									 $q1,
									 $q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.q11, 0)/ $pembagi as q11
											, nvl(b.q12, 0)/ $pembagi as q12
											, nvl(b.q13, 0)/ $pembagi as q13
											, nvl(b.q14, 0)/ $pembagi as q14
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.q21, 0)/ $pembagi as q21
											, nvl(b.q22, 0)/ $pembagi as q22
											, nvl(b.q23, 0)/ $pembagi as q23
											, nvl(b.q24, 0)/ $pembagi as q24
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(q11,0) ) as q11
																, sum(nvl(q12,0) ) as q12
																, sum(nvl(q13,0) ) as q13
																, sum(nvl(q14,0) ) as q14
																, sum(nvl(total,0) ) as total
																, sum(nvl(q21,0) ) as q21
																, sum(nvl(q22,0) ) as q22
																, sum(nvl(q23,0) ) as q23
																, sum(nvl(q24,0) ) as q24
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrendQuart($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->q11 += $val->data->q11;
							$nodeHeader->data->q12 += $val->data->q12;
							$nodeHeader->data->q13 += $val->data->q13;
							$nodeHeader->data->q14 += $val->data->q14;
							$nodeHeader->data->total1 += $val->data->total1;
							$nodeHeader->data->q21 += $val->data->q21;
							$nodeHeader->data->q22 += $val->data->q22;
							$nodeHeader->data->q23 += $val->data->q23;
							$nodeHeader->data->q24 += $val->data->q24;
							$nodeHeader->data->total2 += $val->data->total2;

						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrendQuart($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendQuartDetailTemplate function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $thn1
	 * @param mixed $thn2
	 * @param mixed $ubis (default: null)
	 * @param mixed $neraca (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendQuartDetailTemplate($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($ubis) == 7)
				$filter = " and a.kode_cc like '$ubis%' ";
			else if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan as q11, 0 as q12, 0 as q13, 0 as q14, b.jan as total";
				if ($month == 2) $q1 = "b.jan + b.feb as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan + b.feb + b.mar as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan + b.feb + b.mar as q11, b.apr as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as q21, 0 as q22, 0 as q23, 0 as q24, c.jan as total2";
				if ($month == 2) $q2 = "c.jan + c.feb as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan + c.feb + c.mar as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan + c.feb + c.mar as q21, c.apr as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun  as total2";
				if ($month == 7) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select  a.kode_akun,
									 $q1,
									 $q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs = $this->dbLib->execute("select a.kode_neraca,b.kode_akun, c.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.q11, 0)/ $pembagi as q11
											, nvl(b.q12, 0)/ $pembagi as q12
											, nvl(b.q13, 0)/ $pembagi as q13
											, nvl(b.q14, 0)/ $pembagi as q14
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.q21, 0)/ $pembagi as q21
											, nvl(b.q22, 0)/ $pembagi as q22
											, nvl(b.q23, 0)/ $pembagi as q23
											, nvl(b.q24, 0)/ $pembagi as q24
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a

											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(q11,0) ) as q11
																, sum(nvl(q12,0) ) as q12
																, sum(nvl(q13,0) ) as q13
																, sum(nvl(q14,0) ) as q14
																, sum(nvl(total,0) ) as total
																, sum(nvl(q21,0) ) as q21
																, sum(nvl(q22,0) ) as q22
																, sum(nvl(q23,0) ) as q23
																, sum(nvl(q24,0) ) as q24
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );

			while ($row = $rs->FetchNextObject(false)){
				if ($row->jenis_akun == 'PENDAPATAN'){
					$row->q11 += $row->q11;
					$row->q12 += $row->q12;
					$row->q13 += $row->q13;
					$row->q14 += $row->q14;
					$row->total1 += $$row->total1;
					$row->q21 += $row->q21;
					$row->q22 += $row->q22;
					$row->q23 += $row->q23;
					$row->q24 += $row->q24;
					$row->total2 += $row->total2;
				}
				$result["rs"]["rows"][] = (array) $row;
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	//----------- end outlook

	/**
	 * isGubis function.
	 * digunakan untuk mengecek divisi yg di filter adalah Group/Direktorat
	 * @access public
	 * @param mixed $ubis
	 * @return void
	 */
	function isGubis($ubis){
		$rs = $this->dbLib->execute("select kode_ubis from exs_ubis where kode_ubis = '$ubis' and level_spasi = '1' and kode_lokasi = '". $this->lokasi ."' ");
		if ($row = $rs->FetchNextObject(false)){
			return true;
		}else return false;

	}
	
    function getFilterUbis($tableAlias, $ubis, $lokasi = null){
		if ($tableAlias != "") $tableAlias .= ".";
		if ($ubis == ""){
			$db = $this->dbLib;
			$rs = $db->execute("select kode_ubis from exs_karyawan where nik = '". $this->userLogin."' ");
			if ($row = $rs->FetchNextObject(false))
				$ubis = $row->kode_ubis;
		}
		//error_log(" $ubis '". $this->userLogin."' ");
		return $tableAlias."kode_ubis in (
								select kode_ubis from exs_ubis 
										where kode_lokasi = '".$this->lokasi."'
										start with kode_ubis = '$ubis'
										connect by kode_induk = prior kode_ubis
							) ";
							
							/*
		return $tableAlias."kode_ubis in (
								select kode_ubis from exs_ubis 
										where kode_lokasi = '".$this->lokasi."' and  kode_ubis = '$ubis'
								union 
								select kode_ubis from exs_ubis 
										where kode_lokasi = '".$this->lokasi."' and  kode_induk = '$ubis'
								union
								select a.kode_ubis from exs_ubis a 
									inner join exs_ubis b on b.kode_ubis = a.kode_induk and b.kode_lokasi = a.kode_lokasi  
										where a.kode_lokasi = '".$this->lokasi."' and  b.kode_induk = '$ubis'
								union
								select a.kode_ubis from exs_ubis a 
									inner join exs_ubis b on b.kode_ubis = a.kode_induk and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis c on c.kode_ubis = b.kode_induk and c.kode_lokasi = a.kode_lokasi  
										where a.kode_lokasi = '".$this->lokasi."' and  c.kode_induk = '$ubis'
								union
								select a.kode_ubis from exs_ubis a 
									inner join exs_ubis b on b.kode_ubis = a.kode_induk and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis c on c.kode_ubis = b.kode_induk and c.kode_lokasi = a.kode_lokasi
									inner join exs_ubis d on d.kode_ubis = c.kode_induk and d.kode_lokasi = a.kode_lokasi  
										where a.kode_lokasi = '".$this->lokasi."' and  d.kode_induk = '$ubis'
								union
								select a.kode_ubis from exs_ubis a 
									inner join exs_ubis b on b.kode_ubis = a.kode_induk and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis c on c.kode_ubis = b.kode_induk and c.kode_lokasi = a.kode_lokasi
									inner join exs_ubis d on d.kode_ubis = c.kode_induk and d.kode_lokasi = a.kode_lokasi
									inner join exs_ubis e on e.kode_ubis = d.kode_induk and e.kode_lokasi = a.kode_lokasi  
										where a.kode_lokasi = '".$this->lokasi."' and  e.kode_induk = '$ubis'
							) ";
							*/
	}
	function getJoinFilterUbis($tableAlias, $ubis, $lokasi = null){
		if ($tableAlias != "") $tableAlias .= ".";
		if ($ubis == ""){
			$db = $this->dbLib;
			$rs = $db->execute("select kode_ubis from exs_karyawan where nik = '". $this->userLogin."' ");
			if ($row = $rs->FetchNextObject(false))
				$ubis = $row->kode_ubis;
		}
		//error_log(" $ubis '". $this->userLogin."' ");
		return " inner join  (
								select kode_ubis from exs_ubis 
										where kode_lokasi = '".$this->lokasi."'
										start with kode_ubis = '$ubis'
										connect by kode_induk = prior kode_ubis
							) bus on bus.kode_ubis = ".$tableAlias."kode_ubis";
							
		
	}
	/**
	 * getDataEXSUMCC function.
	 * digunakan untuk mendapatkan data executive summary
	 * @access public
	 * @param mixed $model				: model report
	 * @param mixed $periode			: periode report
	 * @param mixed $ubis (default: null)	: filter divisi, jika kosong, maka akan menampilkan secara nasional
	 * @param mixed $neraca (default: null)	: filter neraca
	 * @param int $pembagi (default: 1000000000): nilai pembagi untuk sesuai dengan satuan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataEXSUMCC($model, $periode, $ubis = null, $lokasi = null, $neraca = null, $pembagi = 1000000000){
		//if ($ubis == $this->lokasiNas) $ubis = '';
		if ($ubis == "")
			$ubis = $this->kode_ubis;
 		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		//error_log("Lokasi $lokasi ");
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;
		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		
		if ($ada){
			$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
		}else if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
            $joinFilter = $this->getJoinFilterUbis("z",$ubis);
            /*
            if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		  else $filter = " and z.kode_ubis like '$ubis%' ";
          */
        }
		$filter .= " and a.kode_lokasi = '". $lokasi ."' ";
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
				    inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
					left outer join (
							select a.kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi 
									$joinFilter
									where tahun = '$thn1' and a.jenis = 'S' $filter   group by a.kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									$joinFilter
									where tahun = '$thn1' and a.jenis = 'S' $filter  group by a.kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									$joinFilter
									where tahun = '$thn2' and a.jenis = 'S' $filter group by a.kode_akun, tahun ) d on  d.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									$joinFilter
									where tahun = '$thn3' and a.jenis = 'S' $filter   group by a.kode_akun, tahun ) e on  e.kode_akun = a.kode_akun
				
				where a.kode_lokasi = '$lokasi' ";
		$sql2 = "select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca
																, sum(nvl(aggthn,0)/ $pembagi) as aggthn
																, sum(nvl(aggbln,0) / $pembagi) as aggbln
																, sum(nvl(aggsd,0)/ $pembagi) as aggsd
																, sum(nvl(actbln,0)/ $pembagi) as actbln
																, sum(nvl(actsd,0)/ $pembagi) as actsd
																, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu
																, sum(nvl(actall,0)/ $pembagi) as actall
																, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$lokasi'
									order by  rowindex";
									/*
									union 
					select distinct 'UNMAPPED' as kode_neraca, left_pad('UNMAPPED',0) as nama, '-' as tipe,'INC' as jenis_akun, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 9999 as rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from exs_masakun a
										inner join (select '99999999' as kode_akun, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_masakun x inner join ($sql) y on y.kode_akun = x.kode_akun
														left outer join exs_relakun z on z.kode_fs = '$model'  and z.kode_lokasi = '$lokasi' and z.kode_akun = x.kode_akun 
														where z.kode_neraca is null and x.kode_lokasi = '$lokasi' ) b on b.kode_akun = '99999999'
										left outer join exs_relakun c on c.kode_fs = '$model'  and c.kode_lokasi = '$lokasi' and c.kode_akun = a.kode_akun
									where a.kode_lokasi = '$lokasi' and c.kode_akun is null
									
									*/
		error_log("Exeum CC $sql2");
        $rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){

			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summaries($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $val->data->aggthn;
						$nodeHeader->data->aggbln += $val->data->aggbln;
						$nodeHeader->data->trend += $val->data->trend;
						$nodeHeader->data->aggsd += $val->data->aggsd;
						$nodeHeader->data->actbln += $val->data->actbln;
						$nodeHeader->data->actsd += $val->data->actsd;
						$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
						//$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResult($rootNode, $result, $neraca);

		return json_encode($result);
	}
	/**
	 * getDataLM function.
	 * digunakan untuk mendapatkan report LM
	 * @access public
	 * @param mixed $model				: model report
	 * @param mixed $periode			: periode report
	 * @param mixed $ubis (default: null)	: filter divisi, jika kosong, maka akan menampilkan secara nasional
	 * @param mixed $neraca (default: null)	: filter neraca
	 * @param int $pembagi (default: 1000000000): nilai pembagi untuk sesuai dengan satuan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataLM($model, $periode, $ubis = null, $neraca = null, $pembagi = 1000000000){
		//if ($ubis == $this->lokasiNas) $ubis = '';
		if ($ubis == "")
			$ubis = $this->kode_ubis;
		
 		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		if ($ada){
			$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
		}else if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else if (strlen($ubis) == 7)
			$filter = " and a.kode_cc like '$ubis%' ";
		else if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		else $filter = " and z.kode_ubis like '$ubis%' ";
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select a.kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by a.kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter  group by a.kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter group by a.kode_akun, tahun ) d on  d.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter   group by a.kode_akun, tahun ) e on  e.kode_akun = a.kode_akun
				 ";
		$sql2 = "select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){

			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summaries($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $val->data->aggthn;
						$nodeHeader->data->aggbln += $val->data->aggbln;
						$nodeHeader->data->trend += $val->data->trend;
						$nodeHeader->data->aggsd += $val->data->aggsd;
						$nodeHeader->data->actbln += $val->data->actbln;
						$nodeHeader->data->actsd += $val->data->actsd;
						$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
						//$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResult($rootNode, $result, $neraca);
		return json_encode($result);

	}

	/**
	 * getDataTrendCC function.
	 * digunakan untuk mendapatkan data executive summary versi trend bulanan actual
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun untuk filter report
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi, jika kosong, maka kan menampilkan data nasional
	 * @param mixed $neraca (default: null)	: filter neraca
	 * @param int $pembagi (default: 1000000000): nilai pembagi untuk sesuai dengan satuan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataTrendCC($model, $thn1, $thn2, $ubis = null, $lokasi = null, $neraca= null, $pembagi = 1000000000){
		try{
			//if ($ubis == $this->lokasiNas) $ubis = '';
			if ($ubis == "")
				$ubis = $this->kode_ubis;
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi)){
				$lokasi = $this->lokasi;
			}else $this->lokasi = $lokasi;
			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$filter .= " and z.kode_lokasi = '". $this->lokasi ."'";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											$joinFilter
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi = '$this->lokasi'";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrend($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendDetail function.
	 * digunakan untuk mendapatkan trend bulanan per akun dari detail neraca yang dipilih
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun report
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi, jika kosong, maka menampilkan data nasional
	 * @param mixed $neraca (default: null) : filter neraca
	 * @param int $pembagi (default: 1000000000): nilai pembagi untuk sesuai dengan satuan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataTrendDetail($model, $thn1, $thn2, $ubis = null, $lokasi, $neraca= null, $pembagi = 1000000000){
		try{
			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;

			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
            }
			$filter .= " and z.kode_lokasi = '". $this->lokasi ."' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, 	  b.feb, 0 as mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan,    b.feb,    b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, 	  b.feb,    b.mar,    b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan,    b.feb,    b.mar,    b.apr,    b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan,    b.feb,    b.mar,    b.apr,    b.mei,    b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan,    b.feb,    b.mar,    b.apr,    b.mei,    b.jun,    b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan,    b.feb,    b.mar,    b.apr,    b.mei,    b.jun,    b.jul,    b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan,    b.feb,    b.mar,    b.apr,    b.mei,    b.jun,    b.jul,    b.aug,    b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan,   b.feb,    b.mar,    b.apr,    b.mei,    b.jun,    b.jul,    b.aug,    b.sep,    b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan,   b.feb,    b.mar,    b.apr,    b.mei,    b.jun,    b.jul,    b.aug,    b.sep,    b.okt,    b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan,   b.feb,    b.mar,    b.apr,    b.mei,    b.jun,    b.jul,    b.aug,    b.sep,    b.okt,    b.nop,    b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1)  $q2 = "c.jan as jan2, 	0 as feb2, 	   0 as mar2, 	  0 as apr2, 	 0 as mei2, 	0 as jun2,     0 as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan as total2";
				if ($month == 2)  $q2 = "c.jan as jan2, c.feb as feb2,	   0 as mar2, 	  0 as apr2, 	 0 as mei2, 	0 as jun2,     0 as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 	  0 as apr2, 	 0 as mei2, 	0 as jun2,     0 as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 	 0 as mei2, 	0 as jun2,     0 as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 	0 as jun2,     0 as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2,     0 as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2,     0 as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2,     0 as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9)  $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 	0 as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2,     0 as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2,     0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											$joinFilter
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi ='$this->lokasi'";
			$rs = $this->dbLib->execute("select a.kode_neraca, b.kode_akun, c.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' and a.kode_neraca = '$neraca' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );

			while ($row = $rs->FetchNextObject(false)){
				if ($row->jenis_akun =='PENDAPATAN'){
					$row->jan1 = -$row->jan1;
					$row->feb1 = -$row->feb1;
					$row->mar1 = -$row->mar1;
					$row->apr1 = -$row->apr1;
					$row->mei1 = -$row->mei1;
					$row->jun1 = -$row->jun1;
					$row->jul1 = -$row->jul1;
					$row->aug1 = -$row->aug1;
					$row->sep1 = -$row->sep1;
					$row->okt1 = -$row->okt1;
					$row->nop1 = -$row->nop1;
					$row->des1 = -$row->des1;
					$row->total1 = -$row->total1;
					$row->jan2 = -$row->jan2;
					$row->feb2 = -$row->feb2;
					$row->mar2 = -$row->mar2;
					$row->apr2 = -$row->apr2;
					$row->mei2 = -$row->mei2;
					$row->jun2 = -$row->jun2;
					$row->jul2 = -$row->jul2;
					$row->aug2 = -$row->aug2;
					$row->sep2 = -$row->sep2;
					$row->okt2 = -$row->okt2;
					$row->nop2 = -$row->nop2;
					$row->des2 = -$row->des2;
					$row->total2 = -$row->total2;
				}
				$result["rs"]["rows"][] = (array)$row;
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendQuart function.
	 * digunakan untuk mendapatkan trend triwulanan
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun report
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi, jika kosong, maka menampilkan data nasional
	 * @param mixed $neraca (default: null) : filter neraca
	 * @param int $pembagi (default: 1000000000): nilai pembagi untuk sesuai dengan satuan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataTrendQuart($model, $thn1, $thn2, $ubis = null, $neraca = null, $lokasi = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;
			
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
                $joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
            }
			$filter .= " and z.kode_lokasi =  '". $this->lokasi ."' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan as q11, 0 as q12, 0 as q13, 0 as q14, b.jan as total";
				if ($month == 2) $q1 = "b.jan + b.feb as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan + b.feb + b.mar as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan + b.feb + b.mar as q11, b.apr as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as q21, 0 as q22, 0 as q23, 0 as q24, c.jan as total2";
				if ($month == 2) $q2 = "c.jan + c.feb as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan + c.feb + c.mar as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan + c.feb + c.mar as q21, c.apr as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun  as total2";
				if ($month == 7) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select  a.kode_akun,
									 $q1,
									 $q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											$joinFilter
									where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
				$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.q11, 0)/ $pembagi as q11
											, nvl(b.q12, 0)/ $pembagi as q12
											, nvl(b.q13, 0)/ $pembagi as q13
											, nvl(b.q14, 0)/ $pembagi as q14
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.q21, 0)/ $pembagi as q21
											, nvl(b.q22, 0)/ $pembagi as q22
											, nvl(b.q23, 0)/ $pembagi as q23
											, nvl(b.q24, 0)/ $pembagi as q24
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(q11,0) ) as q11
																, sum(nvl(q12,0) ) as q12
																, sum(nvl(q13,0) ) as q13
																, sum(nvl(q14,0) ) as q14
																, sum(nvl(total,0) ) as total
																, sum(nvl(q21,0) ) as q21
																, sum(nvl(q22,0) ) as q22
																, sum(nvl(q23,0) ) as q23
																, sum(nvl(q24,0) ) as q24
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrendQuart($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->q11 += $val->data->q11;
							$nodeHeader->data->q12 += $val->data->q12;
							$nodeHeader->data->q13 += $val->data->q13;
							$nodeHeader->data->q14 += $val->data->q14;
							$nodeHeader->data->total1 += $val->data->total1;
							$nodeHeader->data->q21 += $val->data->q21;
							$nodeHeader->data->q22 += $val->data->q22;
							$nodeHeader->data->q23 += $val->data->q23;
							$nodeHeader->data->q24 += $val->data->q24;
							$nodeHeader->data->total2 += $val->data->total2;

						}
					}
				}
			}
			//perlu hitung ke summary
			$result = array('rs' => array('rows' => array() ) );
			$this->generateResultTrendQuart($rootNode, $result, $thn2);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendQuartDetail function.
	 * digunakan untuk mendapatkan detail akun untuk filter neraca yang dipilih dari trend triwulan
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun report
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi, jika kosong, maka menampilkan data nasional
	 * @param mixed $neraca (default: null) : filter neraca
	 * @param int $pembagi (default: 1000000000): nilai pembagi untuk sesuai dengan satuan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataTrendQuartDetail($model, $thn1, $thn2, $ubis = null, $neraca = null, $lokasi = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;
			
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
                $filter = " and " . $this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
            }
			$filter .= " and z.kode_lokasi = '". $this->lokasi ."' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan as q11, 0 as q12, 0 as q13, 0 as q14, b.jan as total";
				if ($month == 2) $q1 = "b.jan + b.feb as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan + b.feb + b.mar as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan + b.feb + b.mar as q11, b.apr as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as q21, 0 as q22, 0 as q23, 0 as q24, c.jan as total2";
				if ($month == 2) $q2 = "c.jan + c.feb as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan + c.feb + c.mar as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan + c.feb + c.mar as q21, c.apr as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun  as total2";
				if ($month == 7) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select  a.kode_akun,
									 $q1,
									 $q2
							from exs_masakun a
							inner join exs_relakun d on d.kode_akun = a.kode_akun and d.kode_lokasi = a.kode_lokasi 
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) 
								c on c.kode_akun = a.kode_akun
						where d.kode_neraca = '$neraca' and d.kode_fs = '$model'  and a.kode_lokasi = '$lokasi'
					 ";
			$rs = $this->dbLib->execute("select a.kode_neraca,b.kode_akun,concat(b.kode_akun,'-',c.nama) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.q11, 0)/ $pembagi as q11
											, nvl(b.q12, 0)/ $pembagi as q12
											, nvl(b.q13, 0)/ $pembagi as q13
											, nvl(b.q14, 0)/ $pembagi as q14
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.q21, 0)/ $pembagi as q21
											, nvl(b.q22, 0)/ $pembagi as q22
											, nvl(b.q23, 0)/ $pembagi as q23
											, nvl(b.q24, 0)/ $pembagi as q24
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a

											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(q11,0) ) as q11
																, sum(nvl(q12,0) ) as q12
																, sum(nvl(q13,0) ) as q13
																, sum(nvl(q14,0) ) as q14
																, sum(nvl(total,0) ) as total
																, sum(nvl(q21,0) ) as q21
																, sum(nvl(q22,0) ) as q22
																, sum(nvl(q23,0) ) as q23
																, sum(nvl(q24,0) ) as q24
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' and x.kode_neraca = '$neraca' and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun and c.kode_lokasi = a.kode_lokasi
											where a.kode_fs = '$model'  and a.kode_neraca = '$neraca' and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );

			while ($row = $rs->FetchNextObject(false)){
				if ($row->jenis_akun == 'PENDAPATAN'){
					$row->q11 = -$row->q11;
					$row->q12 = -$row->q12;
					$row->q13 = -$row->q13;
					$row->q14 = -$row->q14;
					$row->total1 = -$row->total1;
					$row->q21 = -$row->q21;
					$row->q22 = -$row->q22;
					$row->q23 = -$row->q23;
					$row->q24 = -$row->q24;
					$row->total2 = -$row->total2;
				}
				$row->q11 = round($row->q11);
				$row->q12 = round($row->q12);
				$row->q13 = round($row->q13);
				$row->q14 = round($row->q14);
				$row->total1 = round($row->total1);
				$row->q21 = round($row->q21);
				$row->q22 = round($row->q22);
				$row->q23 = round($row->q23);
				$row->q24 = round($row->q24);
				$row->total2 = round($row->total2);
				$result["rs"]["rows"][] = (array) $row;
			}
			///error_log("getDataTrendQuartDetail " . print_r($result, true));
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataEXSUMDetailCC function.
	 * digunakan untuk mendapatan detail akun dari report executive summary
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $neraca		: filter neraca
	 * @param mixed $ubis (default: null) : filter divisi
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataEXSUMDetailCC($model, $periode, $neraca, $ubis = null, $lokasi = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

		
		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		if ($ada){
			$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
		}else if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
                $filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
                /*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
            }
		//error_log("Lokasi $filter");
		$filter .= " and z.kode_lokasi = '". $lokasi ."' ";
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				from exs_masakun a
				left outer join (
							select a.kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop)
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									where tahun = '$thn1' and a.jenis = 'S' $filter group by a.kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun ) c on  c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									where tahun = '$thn2' and a.jenis = 'S' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					 ";
		$sql2 = "select distinct a.kode_neraca, c.kode_akun, concat(c.kode_akun,'-',c.nama) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$lokasi' and x.kode_neraca = '$neraca' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun

									where a.kode_fs = '$model'  and a.kode_lokasi = '$lokasi' and a.kode_neraca = '$neraca'
									
					union 
					select distinct 'UNMAPPED' as kode_neraca, a.kode_akun, left_pad(concat(a.kode_akun,concat('-',a.nama)),1) as nama, '-' as tipe, a.jenis as jenis_akun, '-' as sum_header, 1 as level_spasi, 'UNMAPPED' as kode_induk, 9999 as rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from exs_masakun a
										inner join (select x.kode_akun, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_masakun x inner join ($sql) y on y.kode_akun = x.kode_akun 
																	 and substr(x.kode_akun,1,1) in ('4','5','6','7','8')
														left outer join exs_relakun z on z.kode_fs = '$model'  and z.kode_lokasi = '$lokasi' and z.kode_akun = x.kode_akun 
														where z.kode_neraca is null and x.kode_lokasi = '$lokasi' 
														group by x.kode_akun) b on b.kode_akun = a.kode_akun
										left outer join exs_relakun c on c.kode_fs = '$model'  and c.kode_lokasi = '$lokasi' and c.kode_akun = a.kode_akun
									where a.kode_lokasi = '$lokasi' and substr(a.kode_akun,1,1) in ('4','5','6','7','8') 
											and 'UNMAPPED' = '$neraca' and c.kode_akun is null and (b.actsd <> 0 or b.aggthn <> 0) 	
									
									
									
									 order by  kode_akun";
		error_log("ExsumDetail => " . $sql2);
		$rs = $this->dbLib->execute($sql2);
		$result = array('rs' => array('rows' => array() ) );

		while ($row = $rs->FetchNextObject(false)){
			if ($row->jenis_akun == "PENDAPATAN"){
				$row->aggthn = round($row->aggthn) * -1;
				$row->aggbln = round($row->aggbln) * -1;
				$row->trend = round($row->trend) * -1;
				$row->aggsd = round($row->aggsd) * -1;
				$row->actbln = round($row->actbln) * -1;
				$row->actsd = round($row->actsd) * -1;
				$row->actblnlalu = round($row->actblnlalu) * -1;
				$row->actall = round($row->actall) * -1;
			}else {
				$row->aggthn = round($row->aggthn);
				$row->aggbln = round($row->aggbln);
				$row->trend = round($row->trend);
				$row->aggsd = round($row->aggsd);
				$row->actbln = round($row->actbln);
				$row->actsd = round($row->actsd);
				$row->actblnlalu = round($row->actblnlalu);
				$row->actall = round($row->actall);

			}
			$row->acvpsn = $row->aggbln == 0 ? 0 : round($row->actbln / $row->aggbln * 100,1);
			$row->acvgap = round($row->actbln - $row->aggbln);
			$row->growthpsn = $row->trend == 0 ? 0 : round( ($row->actbln - $row->trend) / $row->trend * 100,1 );
			$row->growthgap = round($row->actbln - $row->trend);

			$row->acvytdpsn = $row->aggsd == 0 ? 0 : round($row->actsd / $row->aggsd * 100,1);
			$row->acvytdrp = round($row->actsd - $row->aggsd);
			$row->grwytdpsn = $row->actall ==0 ? 0 : round(($row->actsd - $row->actall) / $row->actall * 100,1 );
			$row->grwytdgap = round($row->actsd - $row->actall);

			$row->ytdpsn = $row->aggthn == 0 ? 0 : round($row->actsd / $row->aggthn * 100,1);

			$row->growthytypsn = $row->actall ==0 ? 0 : round( ($row->actsd - $row->actall) / $row->actall * 100 ,1 );
			$row->growthytyrp = round($row->actsd -  $row->actall);

			$result["rs"]["rows"][] = (array) $row;
		}


		return json_encode($result);
	}
	/**
	 * getDataExpCC function.
	 * digunakan untuk mendapatkan report executive summary hanya untuk data beban usaha
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataExpCC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$result = array('rs' => array('rows' => array() ) );
		if ($ubis != ""){
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									where tahun = '$thn1' and a.jenis = 'S'   group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									where tahun = '$thn1' and a.jenis = 'S'   group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn2' and a.jenis = 'S'   group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn3' and a.jenis = 'S'   group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
			$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);
		}
		if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else{
                $filter = " and " . $this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
            }

		$return= new server_util_Map();
		if ($ubis == "") $ubis = $this->lokasiNas;
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdbln as actall, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdbln,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					 ";
		$sql2 = "select distinct '$ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);


		return json_encode($result);
	}
	/**
	 * getDataExpUbisCC function.
	 * digunakan untuk mendapatak report executive summary per ubis untuk data beban usaha
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataExpUbisCC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}


		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S'
									group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S'
									group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S'
									group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S'
									group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn, sum(nvl(aggbln,0) )/ $pembagi as aggbln, sum(nvl(aggsd,0))/ $pembagi as aggsd,
																sum(nvl(actbln,0))/ $pembagi as actbln, sum(nvl(actsd,0))/ $pembagi as actsd, sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu, sum(nvl(actall,0))/ $pembagi as actall, sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);
		if (substr($ubis,0,5) == "FINOP")
			$filter = "  where b.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
                $filter = $filter = " and " .$this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and b.kode_induk like '$ubis%' ";
              else $filter = " and b.kode_ubis like '$ubis%' ";
              */
        }
		$rsu = $this->dbLib->execute("select distinct a.kode_ubis, b.nama from exs_cc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					$filter and b.kode_ubis like 'T%' and not (b.kode_ubis like 'T1%' or b.kode_ubis like 'T2%' or b.kode_ubis like 'T3%' or b.kode_ubis like 'T4%' ) order by a.kode_ubis");


		while ($rowUbis = $rsu->FetchNextObject(false)){
			$filter  = " and b.kode_ubis = '$rowUbis->kode_ubis'";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter
									group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter
									group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter
									group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S'  $filter
									group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					 ";
		$sql2 = "select distinct '$rowUbis->kode_ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn, sum(nvl(aggbln,0) )/ $pembagi as aggbln, sum(nvl(aggsd,0))/ $pembagi as aggsd,
																sum(nvl(actbln,0))/ $pembagi as actbln, sum(nvl(actsd,0))/ $pembagi as actsd, sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu, sum(nvl(actall,0))/ $pembagi as actall, sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);
		}
		return json_encode($result);
	}
	/**
	 * getDataRevCC function.
	 * digunakan untuk mendapatkan report executive summary hanya untuk pendapatan usaha
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataRevCC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
                $filter = " and " . $this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
        }

		if ($ubis != ""){
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									where tahun = '$thn1' and a.jenis = 'S'   group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									where tahun = '$thn1' and a.jenis = 'S'   group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn2' and a.jenis = 'S'   group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn3' and a.jenis = 'S'   group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
			$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		}
		if ($ubis == "" || !isset($ubis)) $ubis = 'NAS';
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter  group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
		$sql2 = "select distinct '$ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);

		return json_encode($result);
	}
	/**
	 * getDataRevUbisCC function.
	 * digunakan untuk mendapatkan report executive summary  per divisi hanya untuk pendapatan usaha
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataRevUbisCC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter  group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				  ";
		$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												, nvl(b.actsdfull,0) as actsdfull
												, nvl(b.actblnlalufull,0) as actblnlalufull
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		if (substr($ubis,0,5) == "FINOP")
			$filter = "  where b.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
                $filter = $filter = " and " .$this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and b.kode_induk like '$ubis%' ";
              else $filter = " and b.kode_ubis like '$ubis%' ";
              */
            }
		$rsu = $this->dbLib->execute("select distinct a.kode_ubis, b.nama from exs_cc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					$filter and b.kode_ubis like 'T%' and not (b.kode_ubis like 'T1%' or b.kode_ubis like 'T2%' or b.kode_ubis like 'T3%' or b.kode_ubis like 'T4%' ) order by a.kode_ubis");

		while ($rowUbis = $rsu->FetchNextObject(false)){
			$filter = " and b.kode_ubis = '$rowUbis->kode_ubis' ";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter  group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				  ";
		$sql2 = "select distinct '$rowUbis->kode_ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												, nvl(b.actsdfull,0) as actsdfull
												, nvl(b.actblnlalufull,0) as actblnlalufull
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		}
		return json_encode($result);
	}
	/**
	 * getDataAccountCC function.
	  * digunakan untuk mendapatkan detail data per akun untuk perhitungan growth
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $nTop	: jumlah maksimal record yang akan di ambilΩ
	 * @param mixed $jenis	 : jenis beban atau pendapatan
	 * @param mixed $order	: urutan berdasar
	 * @param mixed $sortOrder (default: null) : jenis urutan
	 * @param mixed $cc (default: null)	: filter cc / ubis
	 * @param int $pembagi (default: 1000000000) : default pembagi untuk satuan milliar, juta , ribu, atau mutlak
	 * @return void
	 */
	function getDataAccountCC($model, $periode, $nTop, $jenis, $order, $sortOrder = null, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		if ($jenis == "AR"){
			$data2 = $this->getDataRevCC($model, $periode, $ubis, $pembagi);
			$dataSumm = $this->dataAR;
		}else{
			$data2 = $this->getDataExpCC($model, $periode, $ubis, $pembagi);
			$dataSumm = $this->dataExp;
		}
		if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
                $filter = " and " . $this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
                $filter = " and z.kode_induk like '$ubis%' ";
              else $filter = " and z.kode_ubis like '$ubis%' ";
              */
        }

		if (!isset($sortOrder)) $sortOrder = "desc";
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter   group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter   group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter   group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter   group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
			$filterAkun = $jenis == 'AR' ? " a.kode_akun like '4%'  ":" a.kode_akun like '5%' " . ($model == "LGNW" ? " " :" ");
			$sql2 = "select distinct 'NAS' as ubis, a.kode_akun, a.nama
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,2) as growthpsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthgap
												, case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end  as ytdpsn
												, case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, case when ".$dataSumm["actall"]." = 0 then 0 else nvl(b.actall,0) / ".$dataSumm["actall"]." end as contrib
												, case when nvl(b.aggsd,0) = 0 then 0 else nvl(b.actsd,0) / nvl(b.aggsd,0) end as achiev2

												, case when ".$dataSumm["actsd"]." = 0 then 0 else nvl(b.actsd,0) / ".$dataSumm["actsd"]." end as contrib2
										from exs_masakun a
										inner join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_akun = a.kode_akun

									where $filterAkun order by $order $sortOrder";

		$rs = $this->dbLib->execute($sql2,20,0);

		$data = array("rs" => array("rows" => array()));
		while ($row = $rs->FetchNextObject(false)){
			if ($row->aggthn != 0 || $row->aggbln != 0 || $row->aggsd != 0 || $row->actbln != 0 || $row->actsd != 0 || $row->actblnlalu != 0 || $row->actall != 0){
				if ($jenis == "AR" && substr($row->kode_akun,0,1) == "4"){
					$row->aggthn = round(-$row->aggthn,2);
					$row->aggbln = round(-$row->aggbln,2);
					$row->trend = round(-$row->trend,2);
					$row->aggsd = round(-$row->aggsd,2);
					$row->actbln = round(-$row->actbln,2);
					$row->actsd = round(-$row->actsd,2);
					$row->actblnlalu = round(-$row->actblnlalu,2);
					$row->actall = round(-$row->actall,2);
					$row->achiev2 = round($row->achiev2,2);
					//$row->growthpsn = round($row->growthpsn,2);
					$row->acvpsn = round($row->acvpsn,2);
					$row->growthgap = round(-$row->growthgap,2);
					//$row->contrib = round($row->contrib,2);
					//$row->contrib2 = round($row->contrib2,2);
					$data["rs"]["rows"][] = (array) $row;
				}else if ($jenis == "OE" && substr($row->kode_akun,0,1) == "5"){
					$row->aggthn = round($row->aggthn,2);
					$row->aggbln = round($row->aggbln,2);
					$row->trend = round($row->trend,2);
					$row->aggsd = round($row->aggsd,2);
					$row->actbln = round($row->actbln,2);
					$row->actsd = round($row->actsd,2);
					$row->actblnlalu = round($row->actblnlalu,2);
					$row->actall = round($row->actall,2);
					$row->achiev2 = round($row->achiev2,2);
					$row->acvpsn = round($row->acvpsn,2);
					$row->growthgap = round($row->growthgap,2);
					$data["rs"]["rows"][] = (array) $row;
				}
			}
		}
		$result = new server_util_Map();
		$result->set("akun",json_encode($data) );
		$result->set("pl",$data2);
		return $result;
	}
	/**
	 * getDataJejerAggCC function.
	 * digunakan unutk mendapatkan data report jejer budget bulanan
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataJejerAggCC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;

		$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where level_spasi = '1' and kode_lokasi = '". $this->lokasi ."'  order by rowindex");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		//inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_induk = '$row->kode_ubis'
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
            $filter = $this->getFilterUbis("z",$row->kode_ubis);
            $sql = " select x.kode_neraca, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
						from exs_relakun x 
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'  and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc  and z.kode_lokasi = x.kode_lokasi 
									and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and x.kode_lokasi = y.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi= x.kode_lokasi 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	/**
	 * getDataJejerActualCC function.
	 * digunakan untuk mendapatkan data report jejer aktual per ubis
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataJejerActualCC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;

		$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama, rowindex from exs_ubis where level_spasi = '1' and kode_lokasi = '". $this->lokasi ."'  order by rowindex");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
            $filter = $this->getFilterUbis("z",$row->kode_ubis);
            $sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and x.kode_lokasi = y.kode_lokasi
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi 
								and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	/**
	 * getDataJejerAggUbis function.
	 * digunakan untuk mendapatkan data report jejer anggaran per ubis
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $group (default: null) : filter divisi/direktorat
	 * @param mixed $tipeBulan (default: null) : pilihan data untuk YTD / CM
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataJejerAggUbis($model, $periode, $group = null, $lokasi = null, $tipeBulan = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;

		if (!isset($lokasi)){
			$lokasi = $this->lokasi; 
		}else $this->lokasi = $lokasi;

		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$filterAll = $this->getFilterUbis("", $group);
		if (substr($group,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select kode_ubis from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."') order by group_ubis");
		else {
            $rsUbis = $this->dbLib->execute("select kode_ubis  from exs_ubis a
						where  $filterAll and status_jejer = '1'  and kode_lokasi ='". $this->lokasi . "' order by kode_ubis");
            /*
            $rsUbis = $this->dbLib->execute("select distinct nvl(group_ubis,'UNMAP') as group_ubis  from exs_ubis a
						left outer join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_induk like '$group%' order by group_ubis");
                        */
        }
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
        


		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
            $filter = $this->getFilterUbis("z", $row->kode_ubis);
			if ($tipeBulan == "1")
				$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (feb )
														 when '03' then (mar )
														 when '04' then (apr )
														 when '05' then (mei )
														 when '06' then (jun )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and x.kode_lokasi = y.kode_lokasi
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi  and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			else
				$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and x.kode_lokasi = y.kode_lokasi
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$filter = " and " . $this->getFilterUbis("z", $group);
		if ($tipeBulan == "1")
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,
															sum(case '$bln' when '01' then jan
														 when '02' then (feb )
														 when '03' then (mar )
														 when '04' then (apr )
														 when '05' then (mei )
														 when '06' then (jun )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des )
												end) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = y.kode_lokasi
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter  group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");

		else
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,
															sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = y.kode_lokasi
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter  group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	function getDataJejerAggUbisDetail($model, $periode, $group = null, $tipeBulan = null, $neraca = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$filter = $this->getFilterUbis("", $group);
		if (substr($group,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select kode_ubis from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."') order by group_ubis");
		else {
            $rsUbis = $this->dbLib->execute("select kode_ubis  from exs_ubis a
						where $filter and kode_lokasi ='". $this->lokasi . "' order by kode_ubis");
            /*
            $rsUbis = $this->dbLib->execute("select distinct nvl(group_ubis,'UNMAP') as group_ubis  from exs_ubis a
						left outer join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_induk like '$group%' order by group_ubis");
                        */
        }
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
        

		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
            $filter = $this->getFilterUbis("z", $row->kode_ubis);
			if ($tipeBulan == "1")
				$sql = " select x.kode_akun, sum(case '$bln' when '01' then jan
														 when '02' then (feb )
														 when '03' then (mar )
														 when '04' then (apr )
														 when '05' then (mei )
														 when '06' then (jun )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi and $filter 
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' and x.kode_neraca = '$neraca'  group by x.kode_akun";
			else
				$sql = " select x.kode_akun, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and x.kode_lokasi = y.kode_lokasi
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi'  and x.kode_neraca = '$neraca' group by x.kode_akun";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$filter = " and ". $this->getFilterUbis("z", $group);
		if ($tipeBulan == "1")
			$rs = $this->dbLib->execute("select distinct c.kode_akun, left_pad(concat(c.kode_akun,'-',d.nama),level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_lokasi = a.kode_lokasi
										inner join exs_masakun d on d.kode_akun = c.kode_akun  
										inner join (select x.kode_akun,
															sum(case '$bln' when '01' then jan
														 when '02' then (feb )
														 when '03' then (mar )
														 when '04' then (apr )
														 when '05' then (mei )
														 when '06' then (jun )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des )
												end) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and x.kode_lokasi = y.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = y.kode_lokasi 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter and x.kode_neraca = '$neraca' group by x.kode_akun) b on b.kode_akun = c.kode_akun
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' and a.kode_neraca = '$neraca' order by  rowindex");

		else
			$rs = $this->dbLib->execute("select distinct c.kode_akun, left_pad(concat(c.kode_akun,'-',d.nama),level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_lokasi = a.kode_lokasi
										inner join exs_masakun d on d.kode_akun = c.kode_akun  
										inner join (select x.kode_akun,
															sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and x.kode_lokasi = y.kode_lokasi
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = y.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = y.kode_lokasi
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter and x.kode_neraca = '$neraca' group by x.kode_akun) b on b.kode_akun = c.kode_akun
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' and a.kode_neraca = '$neraca' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_akun" && $key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	/**
	 * getDataJejerActualUbis function.
	 * digunakan untuk mendapatkan report jejer actual per cost center
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $group (default: null)	 : filter group / direktorar
	 * @param mixed $filterBulan (default: null) : filter YTD/ CM
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataJejerActualUbis($model, $periode, $group = null, $lokasi = null,  $filterBulan = null,  $pembagi = 1000000000){
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$filter = $this->getFilterUbis("", $group);
		if (substr($group,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select  kode_ubis from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."')  and kode_lokasi = '". $this->lokasi ."'order by group_ubis");
		else {
            $rsUbis = $this->dbLib->execute("select kode_ubis, rowindex from exs_ubis a
						where $filter and status_jejer = '1' and kode_lokasi = '". $this->lokasi ."' order by rowindex");
            /*$rsUbis = $this->dbLib->execute("select distinct nvl(group_ubis,'UNMAP') as group_ubis  from exs_ubis a
						left outer join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_induk like '$group%' order by group_ubis");
                        */
        }
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis ";
            $filter = $this->getFilterUbis("z", $row->kode_ubis);
			if ($filterBulan == "1")
				$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (feb  )
														 when '03' then (mar  )
														 when '04' then (apr  )
														 when '05' then (mei )
														 when '06' then (jun  )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and x.kode_lokasi = y.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi and $filter 
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			else
				$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi  and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
            
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg / $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$filter = " and ". $this->getFilterUbis("z", $group);
		if ($filterBulan == "1")
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (feb  )
														 when '03' then (mar  )
														 when '04' then (apr  )
														 when '05' then (mei )
														 when '06' then (jun  )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = x.kode_lokasi 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		else
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = x.kode_lokasi 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != 'jenis_akun' && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
        
		return json_encode($result);

	}
	function getDataJejerActualUbisDetail($model, $periode, $group = null, $lokasi = null, $filterBulan = null, $neraca = null, $pembagi = 1000000000){
		if (!isset($lokasi) ){
			$lokasi = $this->lokasi;
		}else $this->lokasi = $lokasi;
		
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$filter = $this->getFilterUbis("", $group);
		if (substr($group,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select  kode_ubis from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."')  and kode_lokasi = '". $this->lokasi ."'order by group_ubis");
		else {
            $rsUbis = $this->dbLib->execute("select kode_ubis, rowindex from exs_ubis a
						where $filter and kode_lokasi = '". $this->lokasi ."' order by rowindex");
            /*$rsUbis = $this->dbLib->execute("select distinct nvl(group_ubis,'UNMAP') as group_ubis  from exs_ubis a
						left outer join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_induk like '$group%' order by group_ubis");
                        */
        }
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis ";
            $filter = $this->getFilterUbis("z", $row->kode_ubis);
			if ($filterBulan == "1")
				$sql = " select x.kode_akun, sum(case '$bln' when '01' then jan
														 when '02' then (feb  )
														 when '03' then (mar  )
														 when '04' then (apr  )
														 when '05' then (mei )
														 when '06' then (jun  )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and x.kode_lokasi = y.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi and $filter 
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' and x.kode_neraca = '$neraca'  group by x.kode_akun";
			else
				$sql = " select x.kode_akun, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi  and $filter
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi'  and x.kode_neraca = '$neraca'  group by x.kode_akun";
            
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg / $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$filter = " and ". $this->getFilterUbis("z", $group);
		if ($filterBulan == "1")
			$rs = $this->dbLib->execute("select distinct c.kode_akun, left_pad(concat(c.kode_akun,'-',d.nama),level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_lokasi = a.kode_lokasi
										inner join exs_masakun d on d.kode_akun = c.kode_akun  
										inner join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (feb  )
														 when '03' then (mar  )
														 when '04' then (apr  )
														 when '05' then (mei )
														 when '06' then (jun  )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = x.kode_lokasi 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter  and x.kode_neraca = '$neraca' group by x.kode_akun) b on b.kode_akun = c.kode_akun
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi'  and a.kode_neraca = '$neraca' order by  rowindex");
		else
			$rs = $this->dbLib->execute("select distinct c.kode_akun, left_pad(concat(c.kode_akun,'-',d.nama),level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_lokasi = a.kode_lokasi
										inner join exs_masakun d on d.kode_akun = c.kode_akun  
										inner join (select x.kode_akun,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi 
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_lokasi = x.kode_lokasi 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' $filter  and x.kode_neraca = '$neraca' group by x.kode_akun) b on b.kode_akun = c.kode_akun
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi'  and a.kode_neraca = '$neraca' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != 'kode_akun' && $key != 'jenis_akun' && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
        
		return json_encode($result);

	}
	/**
	 * getDataJejerAggCostCenter function.
	 * digunakan untuk mendapatkan data report jejer budget per cost center
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataJejerAggCostCenter($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;

		$rsUbis = $this->dbLib->execute("select distinct kode_cc,nama  from exs_cc where kode_ubis = '$ubis' order by kode_cc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_cc";
			$sql = " select x.kode_neraca, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_cc = '$row->kode_cc'
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_cc, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	/**
	 * getDataJejerActualCostCenter function.
	 * digunakan untuk mendapatkan data report jejer aktual per cost center
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataJejerActualCostCenter($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		//error_log("select distinct kode_cc,nama  from exs_cc where kode_ubis = '$ubis' order by kode_cc");
		$rsUbis = $this->dbLib->execute("select distinct kode_cc,nama  from exs_cc where kode_ubis = '$ubis' order by kode_cc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_cc";
			$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_cc = '$row->kode_cc' and y.kode_lokasi = x.kode_lokasi 

						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();
			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg / $pembagi);
			}
			$dataUbis->set($row->kode_cc, $itemUbis);
		}
		$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_ubis = '$ubis' and y.kode_lokasi = z.kode_lokasi 
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();
			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg / $pembagi);
			}
			$dataUbis->set($ubis, $itemUbis);
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	/**
	 * getDataBudgetTrendCC function.
	 * digunakan untuk mendapatkan data trend budget bulanan per divisi
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $thn1	 : tahun yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default: null)	: filter neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataBudgetTrendCC($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and " . $this->getFilterUbis("z",$ubis);
                /*
                if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
            */
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$sql2 = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											where tahun='$thn2' $filter and a.jenis = 'S' group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs2 = $this->dbLib->execute("select a.kode_neraca, left_pad(concat(a.nama,'(BUDGET)'),level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs2->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendBudgetCC function.
	 * digunakan untuk mendapatkan data trend budget bulanan per divisi
	 * @access public
	 * @param mixed $model 	: model report
	 * @param mixed $thn1	 : tahun yang akan disajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param mixed $neraca (default: null)	: filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataTrendBudgetCC($model, $thn1, $thn2, $ubis = null, $lokasi = null, $neraca = null, $pembagi = 1000000000){
		try{

			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;

			if (!isset($pembagi)) $pembagi = 1000000000;
			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis' ");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$sql2 = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn2' $filter and a.jenis = 'S' group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs2 = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs2->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	/**
	 * getDataTrendBudgetDetail function.
	 * digunakan untuk mendapatkan data detail akun untuk trend budget bulanan
	 * @access public
	 * @param mixed $model : model report
	 * @param mixed $thn1	: tahun yang akan disajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null) : filter ubis
	 * @param mixed $neraca (default: null)	 : filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataTrendBudgetDetail($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and " . $this->getFilterUbis("z", $ubis);
                /*if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			*/
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi = '$lokasi' ";
			$rs = $this->dbLib->execute("select a.kode_neraca, b.kode_akun, c.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' and a.kode_neraca = '$neraca' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );

			while ($row = $rs->FetchNextObject(false)){
				if ($row->jenis_akun =='PENDAPATAN'){
					$row->jan1 = -$row->jan1;
					$row->feb1 = -$row->feb1;
					$row->mar1 = -$row->mar1;
					$row->apr1 = -$row->apr1;
					$row->mei1 = -$row->mei1;
					$row->jun1 = -$row->jun1;
					$row->jul1 = -$row->jul1;
					$row->aug1 = -$row->aug1;
					$row->sep1 = -$row->sep1;
					$row->okt1 = -$row->okt1;
					$row->nop1 = -$row->nop1;
					$row->des1 = -$row->des1;
					$row->total1 = -$row->total1;
					$row->jan2 = -$row->jan2;
					$row->feb2 = -$row->feb2;
					$row->mar2 = -$row->mar2;
					$row->apr2 = -$row->apr2;
					$row->mei2 = -$row->mei2;
					$row->jun2 = -$row->jun2;
					$row->jul2 = -$row->jul2;
					$row->aug2 = -$row->aug2;
					$row->sep2 = -$row->sep2;
					$row->okt2 = -$row->okt2;
					$row->nop2 = -$row->nop2;
					$row->des2 = -$row->des2;
					$row->total2 = -$row->total2;
				}
				$result["rs"]["rows"][] = (array)$row;
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	//------- segmen cc
	/**
	 * getDataRevSegmenCC function.
	 * digunakan untuk mendapatkan data executive summary per segmen hanya untuk pendpatan usaha
	 * @access public
	 * @param mixed $model : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $segmen (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataRevSegmenCC($model, $periode, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn2' and jenis = 'S' group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn3' and jenis = 'S' group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";


		$rsu = $this->dbLib->execute("select distinct kode_segmen, kode_ubis from exs_segmend where kode_segmen like '$segmen%' order by kode_segmen, kode_ubis");
		$ubis ="' '";
		$segmenMap = new server_util_Map();
		while ($rowUbis = $rsu->FetchNextObject(false)){
			$sgmData = $segmenMap->get($rowUbis->kode_segmen) ;
			$sgmData .= ",'$rowUbis->kode_ubis'";
			$segmenMap->set($rowUbis->kode_segmen, $sgmData);
		}

		$sqlSegmen = "";
		$counter = 1;
		foreach ($segmenMap->getArray() as $key =>$val){
			$ubis = $val;
			$ubis = substr($ubis,1);
			$sql2 = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
							   from exs_masakun a
								left outer join (
										select kode_akun, tahun,
															sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
															sum(case '$bln' when '01' then jan
																	 when '02' then (jan + feb  )
																	 when '03' then (jan + feb + mar  )
																	 when '04' then (jan + feb + mar + apr  )
																	 when '05' then (jan + feb + mar + apr + mei )
																	 when '06' then (jan + feb + mar + apr + mei + jun  )
																	 when '07' then (jan + feb + mar + apr + mei + jun + jul )
																	 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
																	 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
																	 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
																	 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
																	 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
															end) as aggsd,
															sum(case '$bln' when '01' then jan
																	 when '02' then feb
																	 when '03' then MAR
																	 when '04' then APR
																	 when '05' then MEI
																	 when '06' then jun
																	 when '07' then jul
																	 when '08' then aug
																	 when '09' then sep
																	 when '10' then okt
																	 when '11' then nop
																	 when '12' then des
															end) as aggbln
												from exs_mbudget a
												inner join exs_cc b on b.kode_cc = a.kode_cc
												where tahun = '$thn1' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
								left outer join (
										select kode_akun,
															sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
															sum(case '$bln' when '01' then jan
																	 when '02' then (jan + feb  )
																	 when '03' then (jan + feb + mar  )
																	 when '04' then (jan + feb + mar + apr  )
																	 when '05' then (jan + feb + mar + apr + mei )
																	 when '06' then (jan + feb + mar + apr + mei + jun  )
																	 when '07' then (jan + feb + mar + apr + mei + jun + jul )
																	 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
																	 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
																	 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
																	 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
																	 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
															end) as actsd,
															sum(case '$bln' when '01' then jan
																	 when '02' then feb
																	 when '03' then MAR
																	 when '04' then APR
																	 when '05' then MEI
																	 when '06' then jun
																	 when '07' then jul
																	 when '08' then aug
																	 when '09' then sep
																	 when '10' then okt
																	 when '11' then nop
																	 when '12' then des
															end) as actbln
												from exs_mactual a
												inner join exs_cc b on b.kode_cc = a.kode_cc
												where tahun = '$thn1' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

								left outer join (
										select  kode_akun,
															sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
															sum(case '$bln' when '01' then jan
																	 when '02' then (jan + feb  )
																	 when '03' then (jan + feb + mar  )
																	 when '04' then (jan + feb + mar + apr  )
																	 when '05' then (jan + feb + mar + apr + mei )
																	 when '06' then (jan + feb + mar + apr + mei + jun  )
																	 when '07' then (jan + feb + mar + apr + mei + jun + jul )
																	 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
																	 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
																	 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
																	 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
																	 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
															end) as actsdlalu,
															sum(case '$bln' when '01' then jan
																	 when '02' then feb
																	 when '03' then MAR
																	 when '04' then APR
																	 when '05' then MEI
																	 when '06' then jun
																	 when '07' then jul
																	 when '08' then aug
																	 when '09' then sep
																	 when '10' then okt
																	 when '11' then nop
																	 when '12' then des
															end) as actblnlalu
												from exs_mactual a
												inner join exs_cc b on b.kode_cc = a.kode_cc
												where tahun = '$thn2' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
								left outer join (
										select  kode_akun,
															sum(case '$bln2' when '01' then jan
																	 when '02' then feb
																	 when '03' then MAR
																	 when '04' then APR
																	 when '05' then MEI
																	 when '06' then jun
																	 when '07' then jul
																	 when '08' then aug
																	 when '09' then sep
																	 when '10' then okt
																	 when '11' then nop
																	 when '12' then des
															end) as actblnlalu
												from exs_mactual a
												inner join exs_cc b on b.kode_cc = a.kode_cc
												where tahun = '$thn3' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
								";

			$sqlSegmen .= "
			union
			select '$key' as ubis, $counter as urutan, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, nvl(b.actblnlalufull,0) as actblnlalufull
												, nvl(b.actsdfull,0) as actsdfull
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
							from EXS_NERACA a
							left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																 , sum(nvl(actbln,0))/ $pembagi as actbln
																 , sum(nvl(actsd,0)) as actsdfull
																 , sum(nvl(actblnlalu,0))  as actblnlalufull
																 , sum(nvl(actsd,0))/ $pembagi as actsd
																 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																 , sum(nvl(actall,0))/ $pembagi as actall
																 , sum(nvl(trend,0))/ $pembagi as trend
											from exs_relakun x left outer join ($sql2) y on y.kode_akun = x.kode_akun
											where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

						where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' ";
			$counter++;
		}
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );

		//while ($rowUbis = $rsu->FetchNextObject(false)){
			$rs = $this->dbLib->execute("select distinct 'NAS' as ubis, 0 as urutan, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, nvl(b.actblnlalufull,0) as actblnlalufull
												, nvl(b.actsdfull,0) as actsdfull
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and a.kode_lokasi = '$this->lokasi'
						$sqlSegmen order by urutan, rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		//}

		return json_encode($result);
	}
	/**
	 * getDataRevSegmenUbisCC function.
	 * digunakan untuk mendapatakan data executive summary per segmen per ubis hanya untuk pendapatan usaha
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $segmen (default: null)	 : filter segmen
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataRevSegmenUbisCC($model, $periode, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select  kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select   kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn2' and jenis = 'S' group by  kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn3' and jenis = 'S'  group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";

		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$rs = $this->dbLib->execute("select distinct 'NAS' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, nvl(b.actblnlalufull,0) as actblnlalufull
												, nvl(b.actsdfull, 0) as actsdfull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			$this->generateResultRev($rootNode, $result, $rootNode);

		$rsu = $this->dbLib->execute("select distinct kode_segmen, kode_ubis from exs_segmend where kode_segmen = '$segmen' order by kode_segmen, kode_ubis");
		while ($rowUbis = $rsu->FetchNextObject(false)){
			$sql2 = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' and a.jenis = 'S' and b.kode_ubis = '$rowUbis->kode_ubis' group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' and jenis = 'S' and b.kode_ubis= '$rowUbis->kode_ubis' group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn2' and jenis = 'S' and b.kode_ubis='$rowUbis->kode_ubis' group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn3' and a.jenis = 'S' and b.kode_ubis = '$rowUbis->kode_ubis' group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select '$rowUbis->kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, nvl(b.actsdfull,0) as actsdfull
												, nvl(b.actblnlalufull, 0) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql2) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		}
		return json_encode($result);
	}

	/**
	 * getDataBudgetTrendSegmenCC function.
	 * digunakan untuk mendapakt data Trend budget bulanan segmen per ubis
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $thn1	: tahun yang akan disajikan
	 * @param mixed $thn2	 : tahun pembanding
	 * @param mixed $segmen (default: null)	 : filter segmen
	 * @param mixed $neraca (default: null)	 : filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataBudgetTrendSegmenCC($model, $thn1, $thn2, $segmen = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			$rsu = $this->dbLib->execute("select distinct kode_segmen, kode_ubis from exs_segmend where kode_segmen = '$segmen' order by kode_segmen, kode_ubis");
			$ubis ="' '";
			while ($rowUbis = $rsu->FetchNextObject(false)){
				$ubis .= ",'$rowUbis->kode_ubis'";
			}
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual where tahun='$thn1' and jenis = 'S' group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual where tahun='$thn2' and jenis = 'S' group by kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$sql2 = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn1' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn2' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs2 = $this->dbLib->execute("select a.kode_neraca, concat(left_pad(a.nama,level_spasi),'(BUDGET)') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs2->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	//-------- save file

	/**
	 * generatePPTX function.
	 * digunakan untuk mengkonersi data report executive summary ke form power point
	 * @access public
	 * @param mixed $options	: array berisi konfigurasi
	 * @param mixed $namafile 	: nama file yang akan di download
	 * @return void
	 */
	function generatePPTX($options, $namafile){
		$ppt = new server_util_PowerPoint();
		$ppt->generate($options);
		$ppt->save($namafile);
		global $manager;
		$manager->setSendResponse(false);
		ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");
		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: application/application/vnd.openxmlformats-officedocument.presentationml.presentation");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$namafile");
		unlink("./tmp/$namafile");
	}

	/**
	 * getDataAkunEXSUM function.
	 * digunakan untuk mencari akun beserta nilainya untuk generate report executive summary ke excel
	 * @access public
	 * @param mixed $model	 : model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null) : filter divisi
	 * @param mixed $neraca (default: null)	: filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunEXSUM($model, $periode, $ubis = null, $lokasi = null, $neraca=null, $pembagi = 1000000000){
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		if ($ada){
			$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
		}else if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else {
            $joinFilter = $this->getJoinFilterUbis("z",$ubis);
            /*
            if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		  else $filter = " and z.kode_ubis like '$ubis%' ";
          */
        }
		$filter .= " and a.kode_lokasi = '$lokasi' " ;
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				  from exs_masakun a
				  inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
				  left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc and a.kode_lokasi = b.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and a.kode_lokasi = z.kode_lokasi 
									$joinFilter
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and a.kode_lokasi = b.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and a.kode_lokasi = z.kode_lokasi
									$joinFilter
									where tahun = '$thn1' and jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and a.kode_lokasi = b.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and a.kode_lokasi = z.kode_lokasi
									$joinFilter
									where tahun = '$thn2' and a.jenis = 'S' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and a.kode_lokasi = b.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and a.kode_lokasi = z.kode_lokasi
									$joinFilter
									where tahun = '$thn3' and jenis = 'S' $filter group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					where a.kode_lokasi = '$lokasi' ";
		$sql2 = "select distinct a.kode_neraca, d.kode_akun, d.nama, a.tipe,d.jenis as jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,5) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,5 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,5) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,5)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,5) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun e on e.kode_neraca = a.kode_neraca and e.kode_fs = a.kode_fs and a.kode_lokasi = e.kode_lokasi 
										inner join exs_masakun d on d.kode_akun = e.kode_akun and d.kode_lokasi = a.kode_lokasi 
										left outer join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca,x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
		//error_log("Detail $sql2");
		$data = $this->dbLib->execute($sql2);
		$dataAkun = new server_util_Map();
		$kode_neraca = "";
		$collectData = false;

		while ($row = $data->FetchNextObject(false)){
			if ($kode_neraca != $row->kode_neraca){
				if ($kode_neraca != ""){
					$dataAkun->set($kode_neraca, $item );
				}
				$item = new server_util_arrayList();
				$kode_neraca = $row->kode_neraca;
			}
			$row2 = new server_util_Map();
			$row2->set("kode_akun", $row->kode_akun);
			$row2->set("nama", $row->nama);
			$row2->set("level_spasi", floatval($row->level_spasi) + 1);
			$row2->set("jenis_akun", strtoupper($row->jenis_akun) );
			if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
				$row2->set("aggthn", $row->aggthn * -1);
				$row2->set("trend", $row->trend * -1);
	   			$row2->set("aggbln", $row->aggbln * -1 );
	   			$row2->set("actbln", $row->actbln * -1 );
	   			$row2->set("acvpsn", $row->acvpsn );
	   			$row2->set("acvgap", -$row->acvgap );
	   			$row2->set("growthpsn", $row->growthpsn);
	   			$row2->set("growthgap", -$row->growthgap);
	   			$row2->set("actall",$row->actall * -1);
	   			$row2->set("aggsd", $row->aggsd * -1);
	   			$row2->set("actsd", $row->actsd * -1);
	   			$row2->set("acvytdpsn", $row->acvytdpsn);
	   			$row2->set("acvytdrp", -$row->acvytdrp);
	   			$row2->set("growthytypsn", $row->growthytypsn);
	   			$row2->set("growthytyrp", -$row->growthytyrp);
			}else
			{
				$row2->set("aggthn", $row->aggthn);
				$row2->set("trend", $row->trend );
	   			$row2->set("aggbln", $row->aggbln );
	   			$row2->set("actbln", $row->actbln );
	   			$row2->set("acvpsn", $row->acvpsn );
	   			$row2->set("acvgap", $row->acvgap );
	   			$row2->set("growthpsn", $row->growthpsn);
	   			$row2->set("growthgap", $row->growthgap);
	   			$row2->set("actall",$row->actall);
	   			$row2->set("aggsd", $row->aggsd);
	   			$row2->set("actsd", $row->actsd);
	   			$row2->set("acvytdpsn", $row->acvytdpsn);
	   			$row2->set("acvytdrp", $row->acvytdrp);
	   			$row2->set("growthytypsn", $row->growthytypsn);
	   			$row2->set("growthytyrp", $row->growthytyrp);
			}
			if ($row->kode_neraca == $neraca){
				$item->add($row2);
				$collectData = true;
			}else if (!isset($neraca) || $neraca == "")
				$item->add($row2);
			else if ($this->collectData){
				if ($row->kode_induk == "00")
					$collectData = false;
				else $item->add($row2);
			}
		}
		if ($kode_neraca != "")
			$dataAkun->set($kode_neraca, $item );
		return $dataAkun;
	}

	/**
	 * getDataAkunTrend function.
	 * digunakan untuk mendapatkan akun untuk report trend bulanan pada proses generate ke excel
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default: null)	: filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunTrend($model, $thn1, $thn2, $ubis = null, $lokasi = null,  $neraca= null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;

			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'  ");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$filter .= " and a.kode_lokasi = '$lokasi' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = b.kode_lokasi 
											$joinFilter
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi = '$lokasi'";
			$rs = $this->dbLib->execute("select a.kode_neraca, e.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun e on e.kode_neraca = a.kode_neraca and e.kode_fs = a.kode_fs and a.kode_lokasi = e.kode_lokasi 
											inner join exs_masakun d on d.kode_akun = e.kode_akun
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x
																inner join ($sql) y on y.kode_akun = x.kode_akun

															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = e.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("kode_neraca", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("jenis_akun", strtoupper($row->jenis_akun) );
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$notNol = false;
				foreach ($fields as $key => $value) {
					$notNol = $notNol || $tmp[$value] != 0;
				}
				if ($notNol)
					$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataAkunTrendAll function.
	* digunakan untuk mendapatkan akun untuk report trend bulanan pada proses generate ke excel
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default: null)	: filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunTrendAll($model, $thn1, $thn2, $ubis = null, $lokasi = null, $neraca= null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;
			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan, 0 as feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan as total";
				if ($month == 2) $q1 = "b.jan, b.feb, 0 as mar, 0 as apr,0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan, b.feb, b.mar, 0 as apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan, b.feb, b.mar, b.apr, 0 as mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, 0 as jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, 0 as jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, 0 as aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b. jul, b.aug, 0 as sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, 0 as okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, 0 as nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 11) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, 0 as des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
				if ($month == 12) $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt,b.nop, b.des, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";
			}else $q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as jan2, 0 as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan as total2";
				if ($month == 2) $q2 = "c.jan as jan2, c.feb as feb2, 0 as mar2, 0 as apr2,0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun as total2";
				if ($month == 7) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c. jul as jul2, c.aug as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, 0 as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, 0 as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, 0 as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi
											$joinFilter
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi = '$lokasi'";
			$rs = $this->dbLib->execute("select a.kode_neraca, e.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun e on e.kode_neraca = a.kode_neraca and e.kode_fs = a.kode_fs
											inner join exs_masakun d on d.kode_akun = e.kode_akun
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x
																inner join ($sql) y on y.kode_akun = x.kode_akun

															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = e.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$notNol= false;
				foreach ($fields as $key => $value) {
					$nol = $notNol || $tmp[$value] != 0;

				}
				if ($notNol)
					$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataAkunTrendBudget function.
	 * digunakan untuk mendapatkan detail akun untuk trend budget bulanan
	 * @access public
	 * @param mixed $model : model report
	 * @param mixed $thn1	: tahun report yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunTrendBudget($model, $thn1, $thn2, $ubis = null, $lokasi = null,  $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi))
				$lokasi = $this->lokasi;
			else $this->lokasi = $lokasi;

			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$joinFilter = $this->getJoinFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$filter .= " and a.kode_lokasi = '$lokasi' ";
			$sql2 = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn2' $filter and a.jenis = 'S' group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi = '$lokasi' ";
			$rs2 = $this->dbLib->execute("select a.kode_neraca as kode_neraca,d.kode_akun, d.nama as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs and c.kode_lokasi = a.kode_lokasi 
											inner join exs_masakun d on d.kode_akun  = c.kode_akun 
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs2->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$row2->set("jenis_akun", strtoupper($row->jenis_akun) );
				$row2->set("kode_neraca", $row->kode_akun);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$notNol= false;
				foreach ($fields as $key => $value) {
					$notNol = $notNol || $tmp[$value] != 0;

				}
				if ($notNol)
					$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataAkunBudgetTrend function.
	 * digunakan untuk mendapatkan detail akun untuk trend budget bulanan
	 * @access public
	 * @param mixed $model : model report
	 * @param mixed $thn1	: tahun report yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default : null) : filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunBudgetTrend($model, $thn1, $thn2, $ubis = null, $lokasi = null,  $neraca = null,$pembagi = 1000000000){
		try{

			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($lokasi))
				$lokasi= $this->lokasi;
			else $this->lokasi = $lokasi;

			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			$filter .= " and a.kode_lokasi = '$lokasi' ";
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					where a.kode_lokasi = '$lokasi'";
			$rs = $this->dbLib->execute("select concat(a.kode_neraca,'-A') as kode_neraca, d.kode_akun, concat(d.nama,'(ACTUAL)') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
											inner join exs_masakun d on d.kode_akun = c.kode_akun
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca , x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$sql2 = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn2' $filter and a.jenis = 'S' group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs2 = $this->dbLib->execute("select concat(a.kode_neraca,'-B') as kode_neraca,d.kode_akun, concat(d.nama,'(BUDGET)') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs and c.kode_lokasi = a.kode_lokasi
											inner join exs_masakun d on d.kode_akun  = c.kode_akun
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );

			while ($row = $rs2->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataAkunTrendQuart function.
	 * digunakan untuk mendapatkan detail akun untuk trend actual triwulan
	 * @access public
	 * @param mixed $model : model report
	 * @param mixed $thn1	: tahun report yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param mixed $neraca (default : null) : filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunTrendQuart($model, $thn1, $thn2, $ubis = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and " . $this->getFilterUbis("z",$ubis);//$filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else {
				$joinFilter = $this->getJoinFilterUbis("z",$ubis);
				/*
				if ($this->isGubis($ubis))
				$filter = " and z.kode_induk like '$ubis%' ";
			  else $filter = " and z.kode_ubis like '$ubis%' ";
			  */
			}
			if ($year == $thn1){
				if ($month == 1) $q1 = "b.jan as q11, 0 as q12, 0 as q13, 0 as q14, b.jan as total";
				if ($month == 2) $q1 = "b.jan + b.feb as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb as total ";
				if ($month == 3) $q1 = "b.jan + b.feb + b.mar as q11, 0 as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar as total";
				if ($month == 4) $q1 = "b.jan + b.feb + b.mar as q11, b.apr as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr as total";
				if ($month == 5) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei as total";
				if ($month == 6) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, 0 as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun as total";
				if ($month == 7) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul as total";
				if ($month == 8) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug as total";
				if ($month == 9) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, 0 as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 10) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep as total";
				if ($month == 11) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt as total";
				if ($month == 12) $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop as total";
			}else $q1 = "b.jan + b.feb + b.mar as q11, b.apr + b.mei + b.jun as q12, b.jul + b.aug + b.sep as q13, b.okt + b.nop + b.des as q14, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			if ($year == $thn2){
				if ($month == 1) $q2 = "c.jan as q21, 0 as q22, 0 as q23, 0 as q24, c.jan as total2";
				if ($month == 2) $q2 = "c.jan + c.feb as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb as total2 ";
				if ($month == 3) $q2 = "c.jan + c.feb + c.mar as q21, 0 as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar as total2";
				if ($month == 4) $q2 = "c.jan + c.feb + c.mar as q21, c.apr as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr as total2";
				if ($month == 5) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei as q22, 0 as q23, 0 as q24,  c.jan + c.feb + c.mar + c.apr + c.mei as total2";
				if ($month == 6) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, 0 as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun  as total2";
				if ($month == 7) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul as total2";
				if ($month == 8) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug as total2";
				if ($month == 9) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, 0 as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep as total2";
				if ($month == 10) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt as total2";
				if ($month == 11) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop as total2";
				if ($month == 12) $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";
			}else $q2 = "c.jan + c.feb + c.mar as q21, c.apr + c.mei + c.jun as q22, c.jul + c.aug + c.sep as q23, c.okt + c.nop + c.des as q24, c.jan + c.feb + c.mar + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select  a.kode_akun,
									 $q1,
									 $q2
							from exs_masakun a
							inner join exs_relakun x on x.kode_akun = a.kode_akun and x.kode_lokasi = a.kode_lokasi and x.kode_fs = '$model'
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
											$joinFilter
											where tahun='$thn1' and a.jenis = 'S' $filter group by a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi 
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis and z.kode_lokasi = a.kode_lokasi 
									$joinFilter
									where tahun='$thn2' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 where a.kode_lokasi = '$lokasi'";
			$rs = $this->dbLib->execute("select a.kode_neraca, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.q11, 0)/ $pembagi as q11
											, nvl(b.q12, 0)/ $pembagi as q12
											, nvl(b.q13, 0)/ $pembagi as q13
											, nvl(b.q14, 0)/ $pembagi as q14
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.q21, 0)/ $pembagi as q21
											, nvl(b.q22, 0)/ $pembagi as q22
											, nvl(b.q23, 0)/ $pembagi as q23
											, nvl(b.q24, 0)/ $pembagi as q24
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun e on e.kode_neraca = a.kode_neraca and e.kode_fs = a.kode_fs
											inner join exs_masakun d on d.kode_akun = e.kode_akun
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(q11,0) ) as q11
																, sum(nvl(q12,0) ) as q12
																, sum(nvl(q13,0) ) as q13
																, sum(nvl(q14,0) ) as q14
																, sum(nvl(total,0) ) as total
																, sum(nvl(q21,0) ) as q21
																, sum(nvl(q22,0) ) as q22
																, sum(nvl(q23,0) ) as q23
																, sum(nvl(q24,0) ) as q24
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("q11","q12","q13","q14","total1","q21","q22","q23","q24","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("jenis_akun", $row->jenis_akun);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataAkunExp function.
	 * digunakan untuk mendapatkan data detail akun untuk generate excel data beban usaha
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunExp($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$result = array('rs' => array('rows' => array() ) );
		if ($ubis != ""){
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									where tahun = '$thn1' and a.jenis = 'S'   group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									where tahun = '$thn1' and a.jenis = 'S'   group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn2' and a.jenis = 'S'   group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn3' and a.jenis = 'S'   group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
			$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);
		}
		if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else $filter = " and " . $this->getFilterUbis("z",$ubis);
        /*if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		else $filter = " and z.kode_ubis like '$ubis%' ";
        */
		$return= new server_util_Map();
		if ($ubis == "") $ubis = $this->lokasiNas;
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdbln as actall, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdbln,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					 ";
		$sql2 = "select distinct '$ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);


		return json_encode($result);
	}

	/**
	 * getDataAkunExpUbis function.
	 * digunakan untuk mendapatkan data detail akun untuk generate excel data beban usaha per ubis
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	* @return void
	 */
	function getDataAkunExpUbis($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}


		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S'
									group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S'
									group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S'
									group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S'
									group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn, sum(nvl(aggbln,0) )/ $pembagi as aggbln, sum(nvl(aggsd,0))/ $pembagi as aggsd,
																sum(nvl(actbln,0))/ $pembagi as actbln, sum(nvl(actsd,0))/ $pembagi as actsd, sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu, sum(nvl(actall,0))/ $pembagi as actall, sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);
		if (substr($ubis,0,5) == "FINOP")
			$filter = "  where b.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else $filter = " and " . $this->getFilterUbis("z",$ubis);
        /*if ($this->isGubis($ubis))
			$filter = "  where b.kode_induk like '$ubis%' ";
		else $filter = "  where b.kode_ubis like '$ubis%' ";
        */
		$rsu = $this->dbLib->execute("select distinct a.kode_ubis, b.nama from exs_cc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					$filter and b.kode_ubis like 'T%' and not (b.kode_ubis like 'T1%' or b.kode_ubis like 'T2%' or b.kode_ubis like 'T3%' or b.kode_ubis like 'T4%' ) order by a.kode_ubis");


		while ($rowUbis = $rsu->FetchNextObject(false)){
			$filter  = " and b.kode_ubis = '$rowUbis->kode_ubis'";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter
									group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter
									group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter
									group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S'  $filter
									group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					 ";
		$sql2 = "select distinct '$rowUbis->kode_ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn, sum(nvl(aggbln,0) )/ $pembagi as aggbln, sum(nvl(aggsd,0))/ $pembagi as aggsd,
																sum(nvl(actbln,0))/ $pembagi as actbln, sum(nvl(actsd,0))/ $pembagi as actsd, sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu, sum(nvl(actall,0))/ $pembagi as actall, sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "OE") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultExp($rootNode, $result, $rootNode);
		}
		return json_encode($result);
	}

	/**
	 * getDataAkunRev function.
	 * digunakan untuk mendapatkan data detail akun untuk generate excel data pendapatan usaha
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunRev($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else $filter = " and " . $this->getFilterUbis("z",$ubis);
        /*if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		else $filter = " and z.kode_ubis like '$ubis%' ";
        */
		$dataAkun = new server_util_Map();

		if ($ubis != ""){
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									where tahun = '$thn1' and a.jenis = 'S'   group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									where tahun = '$thn1' and a.jenis = 'S'   group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn2' and a.jenis = 'S'   group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									where tahun = '$thn3' and a.jenis = 'S'   group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
			$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
										inner join exs_masakun d on d.kode_akun = c.kode_akun
										inner join (select x.kode_neraca, x.kode_akun
																			 , sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex, kode_akun";
			$rs = $this->dbLib->execute($sql2);
			$kode_neraca = "";
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($this->lokasiNas . $kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca =  $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					$row2->set("trend", $row->trend * -1);
		   			$row2->set("aggbln", $row->aggbln * -1 );
		   			$row2->set("actbln", $row->actbln * -1 );
		   			$row2->set("actall",$row->actall * -1);
		   			$row2->set("aggsd", $row->aggsd * -1);
		   			$row2->set("actsd", $row->actsd * -1);
				}else {
					$row2->set("trend", $row->trend );
		   			$row2->set("aggbln", $row->aggbln );
		   			$row2->set("actbln", $row->actbln );
		   			$row2->set("acvpsn", $row->acvpsn );
		   			$row2->set("growthpsn", $row->growthpsn);
		   			$row2->set("actall",$row->actall);
		   			$row2->set("aggsd", $row->aggsd);
		   			$row2->set("actsd", $row->actsd);
				}
				$row2->set("acvpsn", $row->acvpsn );
		   		$row2->set("growthpsn", $row->growthpsn);
				$row2->set("acvytdpsn", $row->acvytdpsn);
		   		$row2->set("growthytypsn", $row->growthytypsn);
		   		$row2->set("contrib", $row->contrib);
		   		$row2->set("contrib2", $row->contrib2);
				$item->add($row2);

			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
		}
		if ($ubis == "" || !isset($ubis)) $ubis = 'NAS';
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter  group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				 ";
		$sql2 = "select distinct '$ubis' as ubis,a.kode_neraca, d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actsdfull,0)) as actsdfull
												, ( nvl(b.actblnlalufull,0) ) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
										inner join exs_masakun d on d.kode_akun = c.kode_akun
										inner join (select x.kode_neraca, x.kode_akun
																			 , sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex, kode_akun";
			$rs = $this->dbLib->execute($sql2);
			$kode_neraca = "";
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($ubis . $kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					$row2->set("trend", $row->trend * -1);
		   			$row2->set("aggbln", $row->aggbln * -1 );
		   			$row2->set("actbln", $row->actbln * -1 );
		   			$row2->set("actall",$row->actall * -1);
		   			$row2->set("aggsd", $row->aggsd * -1);
		   			$row2->set("actsd", $row->actsd * -1);
				}else {
					$row2->set("trend", $row->trend );
		   			$row2->set("aggbln", $row->aggbln );
		   			$row2->set("actbln", $row->actbln );
		   			$row2->set("acvpsn", $row->acvpsn );
		   			$row2->set("growthpsn", $row->growthpsn);
		   			$row2->set("actall",$row->actall);
		   			$row2->set("aggsd", $row->aggsd);
		   			$row2->set("actsd", $row->actsd);
				}
				$row2->set("acvpsn", $row->acvpsn );
		   		$row2->set("growthpsn", $row->growthpsn);
				$row2->set("acvytdpsn", $row->acvytdpsn);
		   		$row2->set("growthytypsn", $row->growthytypsn);
		   		$row2->set("contrib", $row->contrib);
		   		$row2->set("contrib2", $row->contrib2);
				$item->add($row2);

			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );

		return $dataAkun;
	}

	/**
	 * getDataAkunRevUbis function.
	 * digunakan untuk mendapatkan data detail akun untuk generate excel data pendapatan usaha per ubis
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $ubis (default: null)	 : filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunRevUbis($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter  group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				  ";
		$sql2 = "select distinct 'NAS' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												, nvl(b.actsdfull,0) as actsdfull
												, nvl(b.actblnlalufull,0) as actblnlalufull
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		if (substr($ubis,0,5) == "FINOP")
			$filter = "  where b.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else $filter = $filter = " and " .$this->getFilterUbis("z",$ubis);
        /*if ($this->isGubis($ubis))
			$filter = "  where b.kode_induk like '$ubis%' ";
		else $filter = "  where b.kode_ubis like '$ubis%' ";
        */
		$rsu = $this->dbLib->execute("select distinct a.kode_ubis, b.nama from exs_cc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					$filter and b.kode_ubis like 'T%' and not (b.kode_ubis like 'T1%' or b.kode_ubis like 'T2%' or b.kode_ubis like 'T3%' or b.kode_ubis like 'T4%' ) order by a.kode_ubis");

		while ($rowUbis = $rsu->FetchNextObject(false)){
			$filter = " and b.kode_ubis = '$rowUbis->kode_ubis' ";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, d.actblnlalu as actbln2, e.actblnlalu as trend
					from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter  group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter  group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
				  ";
		$sql2 = "select distinct '$rowUbis->kode_ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												, nvl(b.actsdfull,0) as actsdfull
												, nvl(b.actblnlalufull,0) as actblnlalufull
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		}
		return json_encode($result);
	}

	/**
	 * getDataAkunJejerAgg function.
	 * digunakan untuk mendapatkan detail akun pada waktu generate excel untuk report jejer budget
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunJejerAgg($model, $periode, $ubis = null, $lokasi = null, $tipeBulan = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

		$filter = $this->getFilterUbis("" ,$ubis);
		if (substr($ubis,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select kode_ubis from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') order by group_ubis");
		else $rsUbis = $this->dbLib->execute("select kode_ubis  from exs_ubis a
						where $filter  and status_jejer = '1' and kode_lokasi = '".$lokasi  . "' order by kode_ubis");
            /*
            $rsUbis = $this->dbLib->execute("select distinct nvl(group_ubis,'UNMAP')as group_ubis  from exs_ubis a
						left outer join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_induk like '$group%' order by group_ubis");
            */

		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
            $filter = $this->getFilterUbis("w", $row->kode_ubis);
			if ($tipeBulan == "1")
				$sql = " select x.kode_akun, case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum(case '$bln' when '01' then jan
														 when '02' then ( feb  )
														 when '03' then ( mar  )
														 when '04' then ( apr  )
														 when '05' then ( mei )
														 when '06' then ( jun  )
														 when '07' then ( jul )
														 when '08' then ( aug )
														 when '09' then ( sep )
														 when '10' then ( okt )
														 when '11' then ( nop )
														 when '12' then ( des)
													end)
												 as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi 
						inner join exs_ubis w on w.kode_ubis = z.kode_ubis and $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_akun, u.jenis_akun";
			else
				$sql = " select x.kode_akun, case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
													end)
												 as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_lokasi = x.kode_lokasi 
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_lokasi = x.kode_lokasi 
						inner join exs_ubis w on w.kode_ubis = z.kode_ubis and $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_akun, u.jenis_akun";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		if ($tipeBulan == "1")
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, b.kode_akun, c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										inner join (select x.kode_neraca,x.kode_akun,
														sum(case '$bln' when '01' then jan
														 when '02' then (feb )
														 when '03' then (mar )
														 when '04' then (apr )
														 when '05' then (mei )
														 when '06' then (jun )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
									  inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		else
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, b.kode_akun, c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										inner join (select x.kode_neraca,x.kode_akun,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
									  inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$result = new server_util_Map();

		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
			}
			$tmp = $result->get($row->kode_neraca);
			if (!isset($tmp)) $result->set($row->kode_neraca, new server_util_arrayList() );
			$items = $result->get($row->kode_neraca);
			$rowItem = new server_util_Map();
			$field = (array) $row;
			foreach ($field as $f => $val){
				$rowItem->set($f, $val);
			}
			$items->add($rowItem);
		}
		return $result;


	}

	/**
	 * getDataAkunJejerActual function.
	 * digunakan untuk mendapatkan detail akun pada waktu generate excel untuk report jejer actual
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	 : fitler divisi
	 * @param mixed $filterBulan (default: null)	: pilihan untuk current Month atau year to date
	 * @param int $pembagi (default: 1000000000) : nilai pembagi sesuai dengan satuan yang diinginkan
	 * @return void
	 */
	function getDataAkunJejerActual($model, $periode, $ubis = null, $lokasi = null,  $filterBulan = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$group = $ubis;
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

		$filter = $this->getFilterUbis("", $ubis);
		if (substr($ubis,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select kode_ubis from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."') order by group_ubis");
		else $rsUbis = $this->dbLib->execute("select kode_ubis , rowindex from exs_ubis a
						where $filter and status_jejer = '1' and kode_lokasi = '". $this->lokasi ."' order by rowindex");
            /*
            $rsUbis = $this->dbLib->execute("select distinct nvl(group_ubis,'UNMAP')as group_ubis  from exs_ubis a
						left outer join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_induk like '$group%' order by group_ubis");
                        */

		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
            $filter = $this->getFilterUbis("w", $row->kode_ubis);
			if ($filterBulan == "1")
				$sql = " select x.kode_akun, case when c.jenis = 'PENDAPATAN' then -1 else 1 end * sum(case '$bln' when '01' then jan
														 when '02' then (feb  )
														 when '03' then (mar  )
														 when '04' then (apr  )
														 when '05' then (mei )
														 when '06' then (jun  )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
						inner join exs_cc z on z.kode_cc = y.kode_cc
						inner join exs_ubis w on w.kode_ubis = z.kode_ubis and $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						inner join exs_masakun c on c.kode_akun = x.kode_akun and c.kode_lokasi = x.kode_lokasi
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_akun, c.jenis";
			else
				$sql = " select x.kode_akun, case when c.jenis = 'PENDAPATAN' then -1 else 1 end * sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
						inner join exs_cc z on z.kode_cc = y.kode_cc
						inner join exs_ubis w on w.kode_ubis = z.kode_ubis and $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						inner join exs_masakun c on c.kode_akun = x.kode_akun and c.kode_lokasi = x.kode_lokasi
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_akun, c.jenis";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		if ($filterBulan == "1")
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, b.kode_akun, c.nama as nama, a.tipe,c.jenis as jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex
												, case when c.jenis = 'PENDAPATAN' then -1 else 1 end * (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun,sum(case '$bln' when '01' then jan
														 when '02' then (feb  )
														 when '03' then (mar  )
														 when '04' then (apr  )
														 when '05' then (mei )
														 when '06' then (jun  )
														 when '07' then (jul )
														 when '08' then (aug )
														 when '09' then (sep )
														 when '10' then (okt )
														 when '11' then (nop )
														 when '12' then (des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
									   inner join exs_masakun c on c.kode_akun = b.kode_akun and c.kode_lokasi = a.kode_lokasi
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		else
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, b.kode_akun, c.nama as nama, a.tipe,c.jenis as jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex
												, case when c.jenis = 'PENDAPATAN' then -1 else 1 end * (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
                                                        inner join exs_ubis w on w.kode_ubis = z.kode_ubis 
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
									   inner join exs_masakun c on c.kode_akun = b.kode_akun and c.kode_lokasi = a.kode_lokasi
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$result = new server_util_Map();

		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
			}
			$tmp = $result->get($row->kode_neraca);
			if (!isset($tmp)) $result->set($row->kode_neraca, new server_util_arrayList() );
			$items = $result->get($row->kode_neraca);
			$rowItem = new server_util_Map();
			$field = (array) $row;
			foreach ($field as $f => $val){
				$rowItem->set($f, $val);
			}
			$items->add($rowItem);
		}
		return $result;

	}

	/**
	 * getDataAkunRevSegmen function.
	 * digunakan untuk mendapatkan detail akun pendapatan usaha per segmen pada proses generate excel
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	 : periode report
	 * @param mixed $segmen (default: null)	: filter segmen
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunRevSegmen($model, $periode, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn2' and jenis = 'S' group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn3' and jenis = 'S' group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";


		$rsu = $this->dbLib->execute("select distinct kode_segmen, kode_ubis from exs_segmend where kode_segmen = '$segmen' order by kode_segmen, kode_ubis");
		$ubis ="' '";
		while ($rowUbis = $rsu->FetchNextObject(false)){
			$ubis .= ",'$rowUbis->kode_ubis'";
		}
		$sql2 = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select  kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn2' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn3' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );

		//while ($rowUbis = $rsu->FetchNextObject(false)){
			$rs = $this->dbLib->execute("select distinct 'NAS' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, nvl(b.actblnlalufull,0) as actblnlalufull
												, nvl(b.actsdfull,0) as actsdfull
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'
						union
						select '$segmen' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd
												, ( nvl(b.actblnlalu,0) ) as actblnlalu
												, nvl(b.actblnlalufull,0) as actblnlalufull
												, nvl(b.actsdfull,0) as actsdfull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql2) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by ubis, rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		//}
		return json_encode($result);
	}

	/**
	 * getDataAkunRevSegmenUbis function.
	 * digunakan untuk mendapatkan detail akun pendapatan usaha per segmen per ubis pada proses generate excel
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $segmen (default: null)	: filter segmen
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunRevSegmenUbis($model, $periode, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select  kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select   kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual where tahun = '$thn1' and jenis = 'S' group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn2' and jenis = 'S' group by  kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual where tahun = '$thn3' and jenis = 'S'  group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";

		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$rs = $this->dbLib->execute("select distinct 'NAS' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, nvl(b.actblnlalufull,0) as actblnlalufull
												, nvl(b.actsdfull, 0) as actsdfull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			$this->generateResultRev($rootNode, $result, $rootNode);

		$rsu = $this->dbLib->execute("select distinct kode_segmen, kode_ubis from exs_segmend where kode_segmen = '$segmen' order by kode_segmen, kode_ubis");
		while ($rowUbis = $rsu->FetchNextObject(false)){
			$sql2 = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' and a.jenis = 'S' and b.kode_ubis = '$rowUbis->kode_ubis' group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' and jenis = 'S' and b.kode_ubis= '$rowUbis->kode_ubis' group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_masakun b on b.kode_cc = a.kode_cc
									where tahun = '$thn2' and jenis = 'S' and b.kode_ubis='$rowUbis->kode_ubis' group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
					left outer join (
							select  kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn3' and a.jenis = 'S' and b.kode_ubis = '$rowUbis->kode_ubis' group by  kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select '$rowUbis->kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, nvl(b.actsdfull,0) as actsdfull
												, nvl(b.actblnlalufull, 0) as actblnlalufull
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0))/ $pembagi as aggthn
																			 , sum(nvl(aggbln,0) )/ $pembagi as aggbln
																			 , sum(nvl(aggsd,0))/ $pembagi as aggsd
																			 , sum(nvl(actbln,0))/ $pembagi as actbln
																			 , sum(nvl(actsd,0)) as actsdfull
																			 , sum(nvl(actblnlalu,0))  as actblnlalufull
																			 , sum(nvl(actsd,0))/ $pembagi as actsd
																			 , sum(nvl(actblnlalu,0))/ $pembagi as actblnlalu
																			 , sum(nvl(actall,0))/ $pembagi as actall
																			 , sum(nvl(trend,0))/ $pembagi as trend
														from exs_relakun x left outer join ($sql2) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				if ($aktif){
					if ($node == ""){
						$node = new server_util_NodeNRC($rootNode);
					}else if ($node->level == floatval($row->level_spasi) - 1 ){
						$node = new server_util_NodeNRC($node);
					}else if ($node->level == floatval($row->level_spasi) ){
						$node = new server_util_NodeNRC($node->owner);
					}else if ($node->level > floatval($row->level_spasi) ){
						while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
							$node = $node->owner;
						}
						if ($node->owner == $rootNode) {
							$aktif = false;
						}
						if ($aktif)
							$node = new server_util_NodeNRC($node->owner);
					}
					if ($aktif){
						$node->setData($row);
						if ($row->tipe == "SUMMARY")
							$this->sumHeader->set($row->kode_neraca, $node);
					}
				}
			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summaries($val);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->aggthn += $val->data->aggthn;
							$nodeHeader->data->aggbln += $val->data->aggbln;
							$nodeHeader->data->trend += $val->data->trend;
							$nodeHeader->data->aggsd += $val->data->aggsd;
							$nodeHeader->data->actbln += $val->data->actbln;
							$nodeHeader->data->actsd += $val->data->actsd;
							$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
							$nodeHeader->data->actsdfull += $val->data->actsdfull;
							$nodeHeader->data->actblnlalufull += $val->data->actblnlalufull;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultRev($rootNode, $result, $rootNode);
		}
		return json_encode($result);
	}

	/**
	 * getDataAkunBudgetTrendSegmen function.
	 * digunakan untuk mendapatak detail akun untuk trend anggaran pada proses generate excel.
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun yang akan di sajikan
	 * @param mixed $thn2	: tahun pembanding
	 * @param mixed $segmen (default: null)	: filter segmen
	 * @param mixed $neraca (default: null)	: filter kode neraca
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunBudgetTrendSegmen($model, $thn1, $thn2, $segmen = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			$rsu = $this->dbLib->execute("select distinct kode_segmen, kode_ubis from exs_segmend where kode_segmen = '$segmen' order by kode_segmen, kode_ubis");
			$ubis ="' '";
			while ($rowUbis = $rsu->FetchNextObject(false)){
				$ubis .= ",'$rowUbis->kode_ubis'";
			}
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual where tahun='$thn1' and jenis = 'S' group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual where tahun='$thn2' and jenis = 'S' group by kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$sql2 = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn1' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn2' and a.jenis = 'S' and b.kode_ubis in ($ubis) group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs2 = $this->dbLib->execute("select a.kode_neraca, concat(left_pad(a.nama,level_spasi),'(BUDGET)') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											left outer join (select x.kode_neraca
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$result = array('rs' => array('rows' => array() ) );
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			while ($row = $rs2->FetchNextObject(false)){

				if ($node == ""){
					$node = new server_util_NodeNRC($rootNode);
				}else if ($node->level == floatval($row->level_spasi) - 1 ){
					$node = new server_util_NodeNRC($node);
				}else if ($node->level == floatval($row->level_spasi) ){
					$node = new server_util_NodeNRC($node->owner);
				}else if ($node->level > floatval($row->level_spasi) ){
					while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
						$node = $node->owner;
					}
					$node = new server_util_NodeNRC($node->owner);
				}
				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);

			}
			//error_log($this->sumHeader->getLength());
			foreach ($rootNode->childs as $key => $val){
				$this->summariesTrend($val, $thn2);
				if ($val->data->sum_header != "-"){
					$summaryHeader = explode(",",$val->data->sum_header);

					foreach ($summaryHeader as $header){
						$nodeHeader = $this->sumHeader->get($header);
						if ($nodeHeader){
							$nodeHeader->data->jan1 += $val->data->jan1;
							$nodeHeader->data->feb1 += $val->data->feb1;
							$nodeHeader->data->mar1 += $val->data->mar1;
							$nodeHeader->data->apr1 += $val->data->apr1;
							$nodeHeader->data->mei1 += $val->data->mei1;
							$nodeHeader->data->jun1 += $val->data->jun1;
							$nodeHeader->data->jul1 += $val->data->jul1;
							$nodeHeader->data->aug1 += $val->data->aug1;
							$nodeHeader->data->sep1 += $val->data->sep1;
							$nodeHeader->data->okt1 += $val->data->okt1;
							$nodeHeader->data->nop1 += $val->data->nop1;
							$nodeHeader->data->des1 += $val->data->des1;
							$nodeHeader->data->total1 += $val->data->total1;
							$code = "";
							$ix = 1;
							for ($i = 0; $i < 1; $i++){
								$ix++;
								$code .= "\$nodeHeader->data->jan$ix += \$val->data->jan$ix;
											\$nodeHeader->data->feb$ix += \$val->data->feb$ix;
											\$nodeHeader->data->mar$ix += \$val->data->mar$ix;
											\$nodeHeader->data->apr$ix += \$val->data->apr$ix;
											\$nodeHeader->data->mei$ix += \$val->data->mei$ix;
											\$nodeHeader->data->jun$ix += \$val->data->jun$ix;
											\$nodeHeader->data->jul$ix += \$val->data->jul$ix;
											\$nodeHeader->data->aug$ix += \$val->data->aug$ix;
											\$nodeHeader->data->sep$ix += \$val->data->sep$ix;
											\$nodeHeader->data->okt$ix += \$val->data->okt$ix;
											\$nodeHeader->data->nop$ix += \$val->data->nop$ix;
											\$nodeHeader->data->des$ix += \$val->data->des$ix;
											\$nodeHeader->data->total$ix += \$val->data->total$ix;";
							}
							eval($code);
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultTrend($rootNode, $result, $thn2, $neraca);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * getDataAkunJejerAggUbis function.
	 * digunakan untuk mendapatkan detail akun untuk report jejer anggaran per divisi
	 * @access public
	 * @param mixed $model	:model report
	 * @param mixed $periode	: periode report
	 * @param mixed $group (default: null)	: filter group / direktorat
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunJejerAggUbis($model, $periode, $group = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		if (substr($group,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."') order by rowindex");
		else
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where kode_induk = '$group' order by rowindex");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
			$sql = " select x.kode_neraca, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_ubis = '$row->kode_ubis'
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
                                                        inner jon exs_ubis w on w.kode_ubis = z.kode_ubis
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}

	/**
	 * getDataAkunJejerActualUbis function.
	 * digunakan untuk mendapatkan detail akun untuk report jejer actual per divisi
	 * @access public
	 * @param mixed $model	:model report
	 * @param mixed $periode	: periode report
	 * @param mixed $group (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunJejerActualUbis($model, $periode, $group = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		if (substr($group,0,5) == "FINOP")
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($group,5,2)."') order by rowindex");
		else $rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama, rowindex from exs_ubis where kode_induk = '$group' order by rowindex");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_ubis";
			$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_ubis = '$row->kode_ubis'
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg / $pembagi);
			}
			$dataUbis->set($row->kode_ubis, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}

	/**
	 * getDataAkunJejerAggCostCenter function.
	 * digunakan untuk mendapatkan detail akun untuk report jejer actual
	 * @access public
	 * @param mixed $model	:model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunJejerAggCostCenter($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;

		$rsUbis = $this->dbLib->execute("select distinct kode_cc,nama  from exs_cc where kode_ubis = '$ubis' order by kode_cc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_cc";
			$sql = " select x.kode_neraca, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_cc = '$row->kode_cc'
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
			}
			$dataUbis->set($row->kode_cc, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}

	/**
	 * getDataAkunJejerActualCostCenter function.
	 * digunakan untuk mendapatkan detail akun untuk report jejer actual
	 * @access public
	 * @param mixed $model	:model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000) : nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu atau mutlak
	 * @return void
	 */
	function getDataAkunJejerActualCostCenter($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		//error_log("select distinct kode_cc,nama  from exs_cc where kode_ubis = '$ubis' order by kode_cc");
		$rsUbis = $this->dbLib->execute("select distinct kode_cc,nama  from exs_cc where kode_ubis = '$ubis' order by kode_cc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$bln = substr($periode,4,2);
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_cc";
			$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S' and y.kode_cc = '$row->kode_cc'

						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();
			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg / $pembagi);
			}
			$dataUbis->set($row->kode_cc, $itemUbis);
		}
		$sql = " select x.kode_neraca, sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_ubis = '$ubis'
						where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();
			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg / $pembagi);
			}
			$dataUbis->set($ubis, $itemUbis);
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			foreach ($dataUbis->getArray() as $key => $itemUbis){
				eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);

	}
	//----------- akun Datel

	/**
	 * getDataAkunJejerAggWitel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataAkunJejerAggWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataAkunJejerAggWitel($model, $periode, $ubis, $pembagi);
	}

	/**
	 * getDataAkunJejerActualWitel function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $periode
	 * @param mixed $ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataAkunJejerActualWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataAkunJejerActualWitel($model, $periode, $ubis, $pembagi);
	}

	/**
	 * getDataTrendDatelPlusAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $prd1
	 * @param mixed $prd2
	 * @param mixed $ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDatelPlusAkun($model, $prd1, $prd2, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendDatelPlusAkun($model, $prd1, $prd2, $ubis, $pembagi);
	}

	/**
	 * getDataTrendOutlookDatelPlusAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $prd1
	 * @param mixed $prd2
	 * @param mixed $ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendOutlookDatelPlusAkun($model, $prd1, $prd2, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendOutlookDatelPlusAkun($model, $prd1, $prd2, $ubis, $pembagi);
	}

	/**
	 * getDataTrendDatelBudgetPlusAkun function.
	 *
	 * @access public
	 * @param mixed $model
	 * @param mixed $prd1
	 * @param mixed $prd2
	 * @param mixed $ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataTrendDatelBudgetPlusAkun($model, $prd1, $prd2, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataTrendDatelBudgetPlusAkun($model, $prd1, $prd2, $ubis, $pembagi);
	}

	/**
	 * getDataAkunTrendDatel function.
	 * digunakan untuk mendapatkan tren bulanan data witel
	 * @access public
	 * @param mixed $model
	 * @param mixed $prd1
	 * @param mixed $prd2
	 * @param mixed $ubis (default: null)
	 * @param int $pembagi (default: 1000000000)
	 * @return void
	 */
	function getDataAkunTrendDatel($model, $prd1, $prd2, $ubis = null, $pembagi = 1000000000){
		return $this->witelLib->getDataAkunTrendDatel($model, $prd1, $prd2, $ubis, $pembagi);
	}
	//-----------

	/**
	 * generateXLS function.
	 * digunaan untuk mendownload file excel untuk report executive summary.
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $function (default: null) : fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLS($options, $namafile, $function = null){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		$params = "";
        $pNo = 0;
        if ($function != "" || isset($function)) {
	        foreach ($funcParams->getArray() as $key => $value)
	        {
	            $params .= ",\$p$pNo";

	            eval("\$p$pNo = \$value;");

	            $pNo++;
	        }

	        if ($params != "")
	            $params = substr($params, 1);
	        eval("\$dataAkun = \$this->$function($params);");
	    }
       	$excel = new server_util_Xls();
		$file = md5(date("r"));
		$excel->generateXlsx($options, $file, $dataAkun);
		$excel->save();	

		//global $serverDir;

		//return "tmp/$file";
		ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		$data = file_get_contents("./tmp/$file");
		if ($data){
			echo($data);
			//unlink("./tmp/$file");
		}
		
	}
    
    function generateXLSFile2($options, $namafile){
		uses("server_modules_xls_Writer", false);
		error_log("Generate XLS File ");
		try{
			global $manager;
			$function = $options->get("function");
			$funcParams = $options->get("funcParams");
			$params = "";
			$pNo = 0;
			if ($function != "" || isset($function)) {
				foreach ($funcParams->getArray() as $key => $value)
				{
					$params .= ",\$p$pNo";

					eval("\$p$pNo = \$value;");

					$pNo++;
				}

				if ($params != "")
					$params = substr($params, 1);
				error_log("Call function \$dataAkun = \$this->$function($params); ");
				eval("\$dataAkun = \$this->$function($params);");
			}
			error_log("Generate Xlsx");
			$excel = new server_util_Xls();
			$file = md5(date("r"));
			$excel->generateXlsx($options, $file, $dataAkun);
			$excel->save();
		}catch(Exception $e){
			error_log("genereate File2 ". $e->getMessage());
		}
		error_log("Done xlsx $file");
		return array("file" => "./tmp/$file");
	}
	/**
	 * generateXLSDatel function.
	 * digunakan untuk mnendownload file excel executive summary untuk witel. bisa mendownload beberapa witel atau divre sekaligus.
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSDatel($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$periode = $paramFilter->get(1);
		$witel = $paramFilter->get(2);
		$pembagi = $paramFilter->get(4);
		//error_log($witel);
		$tahun = substr($periode,0,4);
		$bln = substr($periode,4,2);
		$namabln = array("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember");
		$bulan = $namabln[floatval($bln) - 1];

		if (substr($witel,0,2)=="T6"){
			$rs = $this->dbLib->execute("select nama from exs_ubis where kode_ubis = '$witel' ");
			$line = $rs->FetchNextObject(false);
			$regional = $line->nama;

			$data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
		    $result = $this->getDataEXSUMDatelPlusAkun($model, $periode, $witel, null, null,  "", $pembagi);
		    $result = json_decode($result);
		    foreach ($result->rs->rows as $line){
   	 				$dataRow = new server_util_Map();
   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
   	 				$dataRow->set("level_spasi", $line->level_spasi);
   	 				$dataRow->set("kode_akun", $line->kode_neraca);
   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
   	 				$dataRow->set("aggthn", $line->aggthn );
   	 				$dataRow->set("trend", $line->trend );
           			$dataRow->set("aggbln", $line->aggbln );
           			$dataRow->set("actbln", $line->actbln);
           			$dataRow->set("acvpsn", $line->acvpsn);
           			$dataRow->set("acvgap", $line->acvgap);
           			$dataRow->set("growthpsn",$line->growthpsn);
           			$dataRow->set("growthgap", $line->growthgap);
           			$dataRow->set("actall", $line->actall);
           			$dataRow->set("aggsd", $line->aggsd);
           			$dataRow->set("actsd", $line->actsd);
           			$dataRow->set("acvytdpsn", $line->acvytdpsn);
           			$dataRow->set("acvytdgap", $line->acvytdrp);
           			$dataRow->set("growthytypsn", $line->growthytypsn);
           			$dataRow->set("growthytygap", $line->growthytyrp);

   	 				$dataWitel->add($dataRow);
   	 			}
   	 		$data->set("data", $dataWitel);
			//$data->set("dataAkun", $dataAkun);
			$data->set("witel", $witel );
			$data->set("title","EBITDA Commerce Regional $regional $bulan $tahun");
			$dataPL->set($row->kode_cc,$data);
			$rs = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_cc in  (select witel from exs_divre where kode_ubis = '$witel' ) ");
		}else if ($witel == "") 
            $rs = $this->dbLib->execute("select kode_ubis as kode_cc, nama from exs_ubis where kode_ubis like 'T66%' order by kode_ubis");
        else 
			$rs = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_cc like '$witel%' and kode_cc like 'T91%' and kode_cc like '%-%' order by kode_cc");

		$function = $options->get("function");
		$funcParams = $options->get("funcParams");

		while ($row = $rs->FetchNextObject(false))
		{
			//error_log($row->kode_cc);
			$data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
		    $result = $this->getDataEXSUMDatelPlusAkun($model, $periode, $row->kode_cc, null, null,  "", $pembagi);
		    $result = json_decode($result);
		    foreach ($result->rs->rows as $line){
   	 				$dataRow = new server_util_Map();
   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
   	 				$dataRow->set("level_spasi", $line->level_spasi);
   	 				$dataRow->set("kode_akun", $line->kode_neraca);
   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
   	 				$dataRow->set("aggthn", $line->aggthn );
   	 				$dataRow->set("trend", $line->trend );
           			$dataRow->set("aggbln", $line->aggbln );
           			$dataRow->set("actbln", $line->actbln);
           			$dataRow->set("acvpsn", $line->acvpsn);
           			$dataRow->set("acvgap", $line->acvgap);
           			$dataRow->set("growthpsn",$line->growthpsn);
           			$dataRow->set("growthgap", $line->growthgap);
           			$dataRow->set("actall", $line->actall);
           			$dataRow->set("aggsd", $line->aggsd);
           			$dataRow->set("actsd", $line->actsd);
           			$dataRow->set("acvytdpsn", $line->acvytdpsn);
           			$dataRow->set("acvytdgap", $line->acvytdrp);
           			$dataRow->set("growthytypsn", $line->growthytypsn);
           			$dataRow->set("growthytygap", $line->growthytyrp);

   	 				$dataWitel->add($dataRow);
   	 			}
   	 		$data->set("data", $dataWitel);
			//$data->set("dataAkun", $dataAkun);
			if (strpos($row->nama,'(') == false)
				$data->set("witel", substr($row->nama,6,strlen($row->nama) - 6) );
			else
				$data->set("witel", substr($row->nama,6, strpos($row->nama,'(') - 6 ) );
			$data->set("title","EBITDA Commerce ".$row->nama." $bulan $tahun");
			$dataPL->set($row->kode_cc,$data);
		}
		$excel->generateDatel($options, $file, $dataPL);

	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		//unlink("./tmp/$file");
	}

	/**
	 * generateXLSDatel2 function.
	 * digunakan untuk mendownload file excel executive summary untuk witel. untuk 1 witel.
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSDatel2($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$periode = $paramFilter->get(1);
		$witel = $paramFilter->get(2);
		$pembagi = $paramFilter->get(4);
		$function = $options->get("function");
		$funcParams = $options->get("funcParams");

		{
			$data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
		    $result = $this->getDataEXSUMDatelPlusAkun($model, $periode, $witel, null, null,  "", $pembagi);
		    $result = json_decode($result);
		    foreach ($result->rs->rows as $line){
   	 				$dataRow = new server_util_Map();
   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
   	 				$dataRow->set("level_spasi", $line->level_spasi);
   	 				//if (substr($line->kode_neraca,0,1) --
   	 				$dataRow->set("kode_akun", $line->kode_neraca);
   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
   	 				$dataRow->set("aggthn", $line->aggthn );
   	 				$dataRow->set("trend", $line->trend );
           			$dataRow->set("aggbln", $line->aggbln );
           			$dataRow->set("actbln", $line->actbln);
           			$dataRow->set("acvpsn", $line->acvpsn);
           			$dataRow->set("acvgap", $line->acvgap);
           			$dataRow->set("growthpsn",$line->growthpsn);
           			$dataRow->set("growthgap", $line->growthgap);
           			$dataRow->set("aggsd", $line->aggsd);
           			$dataRow->set("actsd", $line->actsd);
           			$dataRow->set("acvytdpsn", $line->acvytdpsn);
           			$dataRow->set("acvytdgap", $line->acvytdrp);
           			$dataRow->set("actall", $line->actall);
           			$dataRow->set("growthytypsn", $line->growthytypsn);
           			$dataRow->set("growthytygap", $line->growthytyrp);

   	 				$dataWitel->add($dataRow);
   	 		}
   	 		$data->set("data", $dataWitel);
			//$data->set("dataAkun", $dataAkun);
			if (isset($witel))
				$data->set("witel", $witel );
			else
				$data->set("witel", "New Telkom");
			$dataPL->set("NewTelkom",$data);
		}
		$excel->generateDatel($options, $file, $dataPL);

	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		//unlink("./tmp/$file");
	}

	/**
	 * generateXLSTrendWitel function.
	 * digunakan untuk mendownload data trend bulan actual dalam form excel. jika beberapa witel, maka akan disajikan dalam bentuk sheet
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSTrendWitel($options, $namafile, $paramFilter){
		try{
			uses("server_modules_xls_Writer", false);
			global $manager;
			$excel = new server_util_Xls();
			$file = session_id() . md5(date("r"));
			$dataPL = new server_util_Map();
			$model = $paramFilter->get(0);
			$thn1 = $paramFilter->get(1);
			$thn2 = $paramFilter->get(2);
			$witel = $paramFilter->get(3);
			$pembagi = $paramFilter->get(4);
			$single = $paramFilter->get(5);
			if ($single == "1"){

				$function = $options->get("function");
				$funcParams = $options->get("funcParams");
				{
					$data = new server_util_Map();
					$dataWitel = new server_util_arrayList();
					$result = $this->getDataTrendDatelPlusAkun($model, $thn1, $thn2, $witel,   $pembagi);
					$result = json_decode($result);
					$nama = "";
					foreach ($result->rs->rows as $line){
							$dataRow = new server_util_Map();
							$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

							$dataRow->set("level_spasi", $line->level_spasi);
							$dataRow->set("kode_akun", $line->kode_neraca);
							$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
							$dataRow->set("jan1", $line->jan1 );
							$dataRow->set("feb1", $line->feb1 );
							$dataRow->set("mar1", $line->mar1 );
							$dataRow->set("apr1", $line->apr1);
							$dataRow->set("mei1", $line->mei1);
							$dataRow->set("jun1", $line->jun1);
							$dataRow->set("jul1", $line->jul1);
							$dataRow->set("aug1", $line->aug1);
							$dataRow->set("sep1", $line->sep1);
							$dataRow->set("okt1", $line->okt1);
							$dataRow->set("nop1", $line->nop1);
							$dataRow->set("des1", $line->des1);
							$dataRow->set("total1", $line->total1);
							$dataRow->set("jan2", $line->jan2);
							$dataRow->set("feb2", $line->feb2);
							$dataRow->set("mar2", $line->mar2);
							$dataRow->set("apr2", $line->apr2);
							$dataRow->set("mei2", $line->mei2);
							$dataRow->set("jun2", $line->jun2);
							$dataRow->set("jul2", $line->jul2);
							$dataRow->set("aug2", $line->aug2);
							$dataRow->set("sep2", $line->sep2);
							$dataRow->set("okt2", $line->okt2);
							$dataRow->set("nop2", $line->nop2);
							$dataRow->set("des2", $line->des2);
							$dataRow->set("total2", $line->total2);
							if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
									|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
									|| $line->total2 != 0 )
							$dataWitel->add($dataRow);
						}
					$data->set("data", $dataWitel);
					//$data->set("dataAkun", $dataAkun);
					$data->set("witel",$witel );
					$dataPL->set($witel,$data);
				}

			}else {
				$function = $options->get("function");
				$funcParams = $options->get("funcParams");

				if (substr($witel,0,2)=="T6"){
					$rs = $this->dbLib->execute("select nama from exs_ubis where kode_ubis = '$witel' ");
					$line = $rs->FetchNextObject(false);
					$regional = $line->nama;

					$data = new server_util_Map();
				    $dataWitel = new server_util_arrayList();
				    $result = $this->getDataTrendDatelPlusAkun($model, $thn1, $thn2, $witel,   $pembagi);
				    $result = json_decode($result);
				    $nama = "";
				    foreach ($result->rs->rows as $line){
		   	 				$dataRow = new server_util_Map();
		   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

		   	 				$dataRow->set("level_spasi", $line->level_spasi);
		   	 				$dataRow->set("kode_akun", $line->kode_neraca);
		   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
		   	 				$dataRow->set("jan1", $line->jan1 );
		   	 				$dataRow->set("feb1", $line->feb1 );
		           			$dataRow->set("mar1", $line->mar1 );
		           			$dataRow->set("apr1", $line->apr1);
		           			$dataRow->set("mei1", $line->mei1);
		           			$dataRow->set("jun1", $line->jun1);
		           			$dataRow->set("jul1", $line->jul1);
		           			$dataRow->set("aug1", $line->aug1);
		           			$dataRow->set("sep1", $line->sep1);
		           			$dataRow->set("okt1", $line->okt1);
		           			$dataRow->set("nop1", $line->nop1);
		           			$dataRow->set("des1", $line->des1);
		           			$dataRow->set("total1", $line->total1);
		           			$dataRow->set("jan2", $line->jan2);
		           			$dataRow->set("feb2", $line->feb2);
		           			$dataRow->set("mar2", $line->mar2);
				   			$dataRow->set("apr2", $line->apr2);
		           			$dataRow->set("mei2", $line->mei2);
		           			$dataRow->set("jun2", $line->jun2);
		           			$dataRow->set("jul2", $line->jul2);
		           			$dataRow->set("aug2", $line->aug2);
		           			$dataRow->set("sep2", $line->sep2);
		           			$dataRow->set("okt2", $line->okt2);
		           			$dataRow->set("nop2", $line->nop2);
		           			$dataRow->set("des2", $line->des2);
		           			$dataRow->set("total2", $line->total2);
		           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
		           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
		           				|| $line->total2 != 0 )
		   	 				$dataWitel->add($dataRow);
		   	 			}
		   	 		$data->set("data", $dataWitel);
					$data->set("witel", $regional);
					$dataPL->set($row->kode_cc,$data);

					$rs = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_cc in  (select witel from exs_divre where kode_ubis = '$witel' ) ");
				}else if ($witel == "")
					$rs = $this->dbLib->execute("select kode_ubis as kode_cc, nama from exs_ubis where kode_ubis like 'T66%' order by kode_ubis");
                else
					$rs = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_cc like '$witel%' and kode_cc like 'T91%' and kode_cc like '%-%' order by kode_cc");

				while ($row = $rs->FetchNextObject(false))
				{
					$data = new server_util_Map();
				    $dataWitel = new server_util_arrayList();
				    $result = $this->getDataTrendDatelPlusAkun($model, $thn1, $thn2, $row->kode_cc,   $pembagi);
				    $result = json_decode($result);
				    //error_log("Trend Witel " .$row->kode_cc);
				    foreach ($result->rs->rows as $line){
		   	 				$dataRow = new server_util_Map();
		   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
		   	 				$dataRow->set("level_spasi", $line->level_spasi);
		   	 				$dataRow->set("kode_akun", $line->kode_neraca);
		   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
		   	 				$dataRow->set("jan1", $line->jan1 );
		   	 				$dataRow->set("feb1", $line->feb1 );
		           			$dataRow->set("mar1", $line->mar1 );
		           			$dataRow->set("apr1", $line->apr1);
		           			$dataRow->set("mei1", $line->mei1);
		           			$dataRow->set("jun1", $line->jun1);
		           			$dataRow->set("jul1", $line->jul1);
		           			$dataRow->set("aug1", $line->aug1);
		           			$dataRow->set("sep1", $line->sep1);
		           			$dataRow->set("okt1", $line->okt1);
		           			$dataRow->set("nop1", $line->nop1);
		           			$dataRow->set("des1", $line->des1);
		           			$dataRow->set("total1", $line->total1);
		           			$dataRow->set("jan2", $line->jan2);
		           			$dataRow->set("feb2", $line->feb2);
		           			$dataRow->set("mar2", $line->mar2);
				   			$dataRow->set("apr2", $line->apr2);
		           			$dataRow->set("mei2", $line->mei2);
		           			$dataRow->set("jun2", $line->jun2);
		           			$dataRow->set("jul2", $line->jul2);
		           			$dataRow->set("aug2", $line->aug2);
		           			$dataRow->set("sep2", $line->sep2);
		           			$dataRow->set("okt2", $line->okt2);
		           			$dataRow->set("nop2", $line->nop2);
		           			$dataRow->set("des2", $line->des2);
		           			$dataRow->set("total2", $line->total2);
		           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
		           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
		           				|| $line->total2 != 0 )
		   	 				$dataWitel->add($dataRow);
		   	 		}
		   	 		$data->set("data", $dataWitel);
					//$data->set("dataAkun", $dataAkun);
					if (strpos($row->nama,'(') == false)
						$data->set("witel", substr($row->nama,6,strlen($row->nama) - 6) );
					else
						$data->set("witel", substr($row->nama,6, strpos($row->nama,'(') - 6 ) );
					$dataPL->set($row->kode_cc,$data);
				}
			}
			//error_log("Generate Trend Witel ".$witel);
			$excel->generateDatel($options, $file, $dataPL);

		    ob_end_clean();
		    ob_start();
		    header("Content-Encoding: ");

			$manager->setSendResponse(false);

			header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
			header ("Cache-Control: no-cache, must-revalidate");
			header ("Pragma: no-cache");
			header ("Content-type: Content-Type: application/vnd.ms-excel");
			header ("Content-Disposition: attachment; filename=". $namafile);
			header ("Content-Description: PHP/INTERBASE Generated Data" );
			//error_log("Trend WItel " . $file);
			echo file_get_contents("./tmp/$file");
		}catch(exception $e){
			error_log($e->getMessage());
		}
		//unlink("./tmp/$file");
	}

	/**
	 * generateXLSTrendWitelBudget function.
	 * digunakan untuk mendownload data trend bulanan budget witel dalam format excel. jika untuk all witel, disajikan per sheet.
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSTrendWitelBudget($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$thn1 = $paramFilter->get(1);
		$thn2 = $paramFilter->get(2);
		$witel = $paramFilter->get(3);
		$pembagi = $paramFilter->get(4);
		$single = $paramFilter->get(5);
		$file = $witel . session_id() . md5(date("r"));
		if ($single == "1"){

			$function = $options->get("function");
			$funcParams = $options->get("funcParams");
			{
				$data = new server_util_Map();
			    $dataWitel = new server_util_arrayList();
			    $result = $this->getDataTrendDatelBudgetPlusAkun($model, $thn1, $thn2, $witel,   $pembagi);
			    $result = json_decode($result);
			    foreach ($result->rs->rows as $line){
	   	 				$dataRow = new server_util_Map();
	   	 				//error_log($line->nama);
	   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
	   	 				$dataRow->set("level_spasi", $line->level_spasi);
	   	 				$dataRow->set("kode_akun", $line->kode_neraca);
	   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
	   	 				$dataRow->set("jan1", $line->jan1 );
	   	 				$dataRow->set("feb1", $line->feb1 );
	           			$dataRow->set("mar1", $line->mar1 );
	           			$dataRow->set("apr1", $line->apr1);
	           			$dataRow->set("mei1", $line->mei1);
	           			$dataRow->set("jun1", $line->jun1);
	           			$dataRow->set("jul1", $line->jul1);
	           			$dataRow->set("aug1", $line->aug1);
	           			$dataRow->set("sep1", $line->sep1);
	           			$dataRow->set("okt1", $line->okt1);
	           			$dataRow->set("nop1", $line->nop1);
	           			$dataRow->set("des1", $line->des1);
	           			$dataRow->set("total1", $line->total1);
	           			$dataRow->set("jan2", $line->jan2);
	           			$dataRow->set("feb2", $line->feb2);
	           			$dataRow->set("mar2", $line->mar2);
			   			$dataRow->set("apr2", $line->apr2);
	           			$dataRow->set("mei2", $line->mei2);
	           			$dataRow->set("jun2", $line->jun2);
	           			$dataRow->set("jul2", $line->jul2);
	           			$dataRow->set("aug2", $line->aug2);
	           			$dataRow->set("sep2", $line->sep2);
	           			$dataRow->set("okt2", $line->okt2);
	           			$dataRow->set("nop2", $line->nop2);
	           			$dataRow->set("des2", $line->des2);
	           			$dataRow->set("total2", $line->total2);
	   	 				$dataWitel->add($dataRow);
	   	 			}
	   	 		$data->set("data", $dataWitel);
				//$data->set("dataAkun", $dataAkun);
				$data->set("witel",$witel );
				$dataPL->set($witel,$data);
			}
			//$excel->generateDatel($options, $file, $dataPL);
		}else {
			$function = $options->get("function");
			$funcParams = $options->get("funcParams");

			if (substr($witel,0,2)=="T6"){
				//$excel = new server_util_Xls();
				//$file = $witel ."_".session_id() . md5(date("r")) .".xls";
				
				$rs = $this->dbLib->execute("select nama from exs_ubis where kode_ubis = '$witel' ");
				$line = $rs->FetchNextObject(false);
				$regional = $line->nama;
				$data = new server_util_Map();
			    $dataWitel = new server_util_arrayList();
			    $result = $this->getDataTrendDatelBudgetPlusAkun($model, $thn1, $thn2, $witel,   $pembagi);
			    $result = json_decode($result);
			    foreach ($result->rs->rows as $line){
	   	 				$dataRow = new server_util_Map();
	   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
	   	 				$dataRow->set("level_spasi", $line->level_spasi);
	   	 				$dataRow->set("kode_akun", $line->kode_neraca);
	   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
	   	 				$dataRow->set("jan1", $line->jan1 );
	   	 				$dataRow->set("feb1", $line->feb1 );
	           			$dataRow->set("mar1", $line->mar1 );
	           			$dataRow->set("apr1", $line->apr1);
	           			$dataRow->set("mei1", $line->mei1);
	           			$dataRow->set("jun1", $line->jun1);
	           			$dataRow->set("jul1", $line->jul1);
	           			$dataRow->set("aug1", $line->aug1);
	           			$dataRow->set("sep1", $line->sep1);
	           			$dataRow->set("okt1", $line->okt1);
	           			$dataRow->set("nop1", $line->nop1);
	           			$dataRow->set("des1", $line->des1);
	           			$dataRow->set("total1", $line->total1);
	           			$dataRow->set("jan2", $line->jan2);
	           			$dataRow->set("feb2", $line->feb2);
	           			$dataRow->set("mar2", $line->mar2);
			   			$dataRow->set("apr2", $line->apr2);
	           			$dataRow->set("mei2", $line->mei2);
	           			$dataRow->set("jun2", $line->jun2);
	           			$dataRow->set("jul2", $line->jul2);
	           			$dataRow->set("aug2", $line->aug2);
	           			$dataRow->set("sep2", $line->sep2);
	           			$dataRow->set("okt2", $line->okt2);
	           			$dataRow->set("nop2", $line->nop2);
	           			$dataRow->set("des2", $line->des2);
	           			$dataRow->set("total2", $line->total2);
	   	 				$dataWitel->add($dataRow);
	   	 			}
	   	 		$data->set("data", $dataWitel);
				//$data->set("dataAkun", $dataAkun);
				$data->set("witel",$regional );
				$dataPL->set($witel,$data);
				//$excel->generateDatel($options, $file, $dataPL);
				//
				$rs = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_cc in  (select witel from exs_divre where kode_ubis = '$witel' ) ");
			}else if ($witel == "")
					$rs = $this->dbLib->execute("select kode_ubis as kode_cc, nama from exs_ubis where kode_ubis like 'T66%' order by kode_ubis");
            else 
				$rs = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_cc like '$witel%' and kode_cc like 'T91%' and kode_cc like '%-%' order by kode_cc");

			while ($row = $rs->FetchNextObject(false))
			{
				$excel = new server_util_Xls();
				//$file = $row->kode_cc ."_".session_id() . md5(date("r")).".xls";
				//$dataPL = new server_util_Map();

				$data = new server_util_Map();
			    $dataWitel = new server_util_arrayList();
			    $result = $this->getDataTrendDatelBudgetPlusAkun($model, $thn1, $thn2, $row->kode_cc,   $pembagi);
			    $result = json_decode($result);
			    foreach ($result->rs->rows as $line){
	   	 				$dataRow = new server_util_Map();
	   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
	   	 				$dataRow->set("level_spasi", $line->level_spasi);
	   	 				$dataRow->set("kode_akun", $line->kode_neraca);
	   	 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
	   	 				$dataRow->set("jan1", $line->jan1 );
	   	 				$dataRow->set("feb1", $line->feb1 );
	           			$dataRow->set("mar1", $line->mar1 );
	           			$dataRow->set("apr1", $line->apr1);
	           			$dataRow->set("mei1", $line->mei1);
	           			$dataRow->set("jun1", $line->jun1);
	           			$dataRow->set("jul1", $line->jul1);
	           			$dataRow->set("aug1", $line->aug1);
	           			$dataRow->set("sep1", $line->sep1);
	           			$dataRow->set("okt1", $line->okt1);
	           			$dataRow->set("nop1", $line->nop1);
	           			$dataRow->set("des1", $line->des1);
	           			$dataRow->set("total1", $line->total1);
	           			$dataRow->set("jan2", $line->jan2);
	           			$dataRow->set("feb2", $line->feb2);
	           			$dataRow->set("mar2", $line->mar2);
			   			$dataRow->set("apr2", $line->apr2);
	           			$dataRow->set("mei2", $line->mei2);
	           			$dataRow->set("jun2", $line->jun2);
	           			$dataRow->set("jul2", $line->jul2);
	           			$dataRow->set("aug2", $line->aug2);
	           			$dataRow->set("sep2", $line->sep2);
	           			$dataRow->set("okt2", $line->okt2);
	           			$dataRow->set("nop2", $line->nop2);
	           			$dataRow->set("des2", $line->des2);
	           			$dataRow->set("total2", $line->total2);
	   	 				$dataWitel->add($dataRow);
	   	 			}
	   	 		$data->set("data", $dataWitel);
				//$data->set("dataAkun", $dataAkun);
				if (strpos($row->nama,'(') == false)
					$data->set("witel", substr($row->nama,6,strlen($row->nama) - 6) );
				else
					$data->set("witel", substr($row->nama,6, strpos($row->nama,'(') - 6 ) );
				$dataPL->set($row->kode_cc,$data);
				//$excel->generateDatel($options, $file, $dataPL);
			}
			//return;
		}
		$excel->generateDatel($options, $file, $dataPL);

	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		//unlink("./tmp/$file");
	}

	/**
	 * generateXLSDivisi function.
	 * digunakan untuk mendownload data PL/Executive summary nasional dan Divisi dalam bentuk excel.
	 disajikan dalam bentuk sheet-sheet.
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSDivisi($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$periode = $paramFilter->get(1);
		$ubis = $paramFilter->get(2);
		$lokasi = $paramFilter->get(3);
		$neraca = $paramFilter->get(4);
		$pembagi = $paramFilter->get(5);
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

		if ($ubis == ""){
			//$rs = $this->dbLib->execute("select b.group_ubis as kode_ubis, b.group_ubis as nama from exs_ubis a inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis order by b.group_ubis ");
            $rs = $this->dbLib->execute("select kode_ubis, kode_ubis as nama from exs_ubis a where status_export = '1' and level_spasi <> 0 and kode_lokasi = '$lokasi' order by rowindex");
		}else {
			$filterUbis = " and " . $this->getFilterUbis("",$ubis);
			$rs = $this->dbLib->execute("select a.kode_ubis, a.nama, rowindex from exs_ubis a where  kode_lokasi = '$lokasi' and status_export = '1' and kode_ubis <> '$ubis'   $filterUbis order by rowindex");
		}
		

		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		error_log("Generate akun $function $m$ubis ".date("r") );
		
		if ($function != "" || isset($function)) {
	        eval("\$dataAkun = \$this->$function('$model', '$periode','$ubis','$lokasi','',$pembagi);");
	    }
	    $data = new server_util_Map();
	    $dataWitel = new server_util_arrayList();
		error_log("Generate PL $ubis ".date("r") );
	    $result = $this->getDataEXSUMCC($model, $periode, $ubis, $lokasi,null, $pembagi);
	    $result = json_decode($result);
	    $header = $options->get("header");
	    $title = $header->get("title");
		
		$xlsx = $excel->createXlsx();
		$defaultTitle = $options->get("header")->get("title");
		
		$sheet = $excel->getWorksheet(0);
		if ($ubis == ""){
			$sheet->setTitle($this->lokasiNas);
			$title = str_replace("<ubis>", "Nasional" , $defaultTitle);
		}else{
			$sheet->setTitle($ubis);
			$title = str_replace("<ubis>", $ubis , $defaultTitle);
		}
		
		$options->get("header")->set("title", $title);
		$excel->writeHeader($sheet, $options);
		
		
		$col = $excel->col;
		$xlsrow = $excel->row;
		$fields = $options->get("fields")->getArray();
		$fieldKunci = $options->get("keyField");
		error_log("write xlsx PL $ubis $fieldKunci ".date("r") );
		$xlsrow+=2;
	    foreach ($result->rs->rows as $line){
			$line = (array)$line;
			$line["kode_akun"] = $line["kode_neraca"];
			foreach($fields as $col => $field){
				if ($col == 0)
					$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $line["nama"]), null);
				else {
					$excel->write($sheet, $col, $xlsrow, $line[$field], null);
					if ($col >= 3){
						$sheet->getStyleByColumnAndRow($col, $xlsrow)->getNumberFormat()->setFormatCode("#,##0_);[Red](#,##0)");
					}
				}	
			}
			$xlsrow++;
			if (isset($dataAkun)){
				$akun = $dataAkun->get( $line[$fieldKunci] );
				if ($akun){
					foreach ($akun->getArray() as $ki => $val){
						$lineData = (array)$val->getArray();
						foreach($fields as $col => $field){
							if ($col == 0)
								$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $lineData["nama"]), null);
							else {
								$excel->write($sheet, $col, $xlsrow, $lineData[$field], null);
								if ($col >= 3){
									$sheet->getStyleByColumnAndRow($col, $xlsrow)->getNumberFormat()->setFormatCode("#,##0_);[Red](#,##0)");
								}
							}
						}
						$xlsrow++;
					}
				}
			}
	 	}
 		//$defaultTitle = $options->get("header")->get("title");
		while ($row = $rs->FetchNextObject(false)){
			error_log("Generate akun ". $row->kode_ubis ." ".date("r") );
			if ($function != "" || isset($function)) {
		        eval("\$dataAkun = \$this->$function('$model', '$periode','".$row->kode_ubis."','".$this->lokasi."','',$pembagi);");
		    }
		    $data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
			error_log("Generate PL ". $row->kode_ubis ." ".date("r") );
		    $result = $this->getDataEXSUMCC($model, $periode, $row->kode_ubis, $this->lokasi, null, $pembagi);
		    $result = json_decode($result);
			
		    $title = str_replace("<ubis>", $row->nama , $defaultTitle);
			$options->get("header")->set("title", $title);
			$sheet = $excel->addWorksheet( $row->kode_ubis);
			
			
			$excel->writeHeader($sheet, $options);
			$col = $excel->col;
			$xlsrow = $excel->row;
			$xlsrow += 2;
			error_log("write xlsx PL  $row->kode_ubis ".date("r") );
			foreach ($result->rs->rows as $line){
				$line = (array)$line;
				$line["kode_akun"] = $line["kode_neraca"];
				foreach($fields as $col => $field){
					if ($col == 0)
						$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $line["nama"]), null);
					else {
						$excel->write($sheet, $col, $xlsrow, $line[$field], null);
						if ($col >= 3){
							$sheet->getStyleByColumnAndRow($col, $xlsrow)->getNumberFormat()->setFormatCode("#,##0_);[Red](#,##0)");
						}
					}	
				}
				$xlsrow++;
				if (isset($dataAkun)){
					$akun = $dataAkun->get( $line[$fieldKunci] );
					if ($akun){
						foreach ($akun->getArray() as $ki => $val){
							$lineData = (array)$val->getArray();
							foreach($fields as $col => $field){
								if ($col == 0)
									$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $lineData["nama"]), null);
								else {
									$excel->write($sheet, $col, $xlsrow, $lineData[$field], null);
									if ($col >= 3){
										$sheet->getStyleByColumnAndRow($col, $xlsrow)->getNumberFormat()->setFormatCode("#,##0_);[Red](#,##0)");
									}
								}
							}
							$xlsrow++;
						}
					}
				}
   	 				
   	 		}
   	 		
		}
		error_log("done xlsx $ubis ".date("r"));
		$excel->saveXlsx($file);
		ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		$data = file_get_contents("./tmp/$file");
		if ($data){
			echo($data);
			//unlink("./tmp/$file");
		}
		//
		//echo "./tmp/$file";
		
	}
    
    function generateXLSDivisiFile($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$periode = $paramFilter->get(1);
		$ubis = $paramFilter->get(2);
        $file = $ubis . "-". md5(date("r")).".xlsx";
		$lokasi = $paramFilter->get(3);
		$pembagi = $paramFilter->get(5);
		
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;

        //if ($ubis == ""){
		//	$rs = $this->dbLib->execute("select b.group_ubis as kode_ubis, b.group_ubis as nama from exs_ubis a inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis order by b.group_ubis ");
		//}else {
		//	$rs = $this->dbLib->execute("select a.kode_ubis, a.nama from exs_ubis a where kode_ubis = '$ubis'");
		//}
        $rs = $this->dbLib->execute("select a.kode_ubis, a.nama from exs_ubis a where kode_ubis = '$ubis' and kode_lokasi = '$lokasi' ");
        if ($row = $rs->FetchNextObject(false))
            $namaubis = $row->nama;
        else $namaubis = "Nasional";
        
		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		if ($function != "" || isset($function)) {
	        eval("\$dataAkun = \$this->$function('$model', '$periode','$ubis','$lokasi','',$pembagi);");
	    }
	    $data = new server_util_Map();
	    $dataWitel = new server_util_arrayList();
	    $result = $this->getDataEXSUMCC($model, $periode, $ubis, $lokasi, null, $pembagi);
	    $result = json_decode($result);
	    $header = $options->get("header");
	    $title = $header->get("title");
	    foreach ($result->rs->rows as $line){
 				$dataRow = new server_util_Map();
 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));
 				$dataRow->set("level_spasi", $line->level_spasi);
 				$dataRow->set("kode_akun", $line->kode_neraca);
 				$dataRow->set("kode_akun2", $line->ubis . $line->kode_neraca);
 				$dataRow->set("jenis_akun", $line->jenis_akun );
 				$dataRow->set("aggthn", $line->aggthn );
 				$dataRow->set("trend", $line->trend );
       			$dataRow->set("aggbln", $line->aggbln );
       			$dataRow->set("actbln", $line->actbln);
       			$dataRow->set("acvpsn", $line->acvpsn);
       			$dataRow->set("acvgap", $line->acvgap);
       			$dataRow->set("growthpsn",$line->growthpsn);
       			$dataRow->set("growthgap", $line->growthgap);
       			$dataRow->set("actall", $line->actall);
       			$dataRow->set("aggsd", $line->aggsd);
       			$dataRow->set("actsd", $line->actsd);
       			$dataRow->set("acvytdpsn", $line->acvytdpsn);
       			$dataRow->set("acvytdgap", $line->acvytdrp);
       			$dataRow->set("growthytypsn", $line->growthytypsn);
       			$dataRow->set("growthytygap", $line->growthytyrp);

	 			$dataWitel->add($dataRow);
	 	}
        if ($ubis == "")
            $ubis = $this->lokasiNas;
 		$data->set("data", $dataWitel);
		$data->set("dataAkun", $dataAkun);
		$data->set("title", str_replace("<ubis>",$nama, $title) );
		$data->set("witel", $ubis );
		$dataPL->set($ubis,$data);
       
		$excel->generateXlsxDatel($options, $file, $dataPL);

		return json_encode(array("file" => $file ));
	}

	/**
	 * generateXLSJejerDivisi function.
	 *	digunakan untuk mendownload file jejer actual divisi dalam format excel
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil	 * @return void
	 */
	function generateXLSJejerDivisi($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$thn1 = $paramFilter->get(1);
		$thn2 = $paramFilter->get(2);
		$ubis = $paramFilter->get(3);
		$lokasi = $paramFilter->get(4);
		$pembagi = $paramFilter->get(5);
		//$rs = $this->dbLib->execute("select distinct b.group_ubis as kode_ubis, b.group_ubis as nama, urutan from exs_ubis a inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis order by urutan ");
        
        $rs = $this->dbLib->execute("select kode_ubis,  kode_ubis as nama, rowindex from exs_ubis where status_export = '1' and kode_ubis <> 'NAS' order by rowindex ");
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;


		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		$fields = $options->get("fields");
		error_log("Generate Jejer Akun NAS");
		if ($function != "" || isset($function)) {
	        eval("\$dataAkun = \$this->$function('$model', '$thn1','$thn2',null,$lokasi, null,$pembagi);");
	    }
	    $data = new server_util_Map();
	    $dataWitel = new server_util_arrayList();
	    $header = $options->get("header");
	    $title = $header->get("title");
		error_log("Generate Jejer PL NAS");
	    $result = $this->getDataTrendCC($model, $thn1, $thn2, null,$lokasi, null, $pembagi);
	    $result = json_decode($result);
		$xlsx = $excel->createXlsx();
		$defaultTitle = $options->get("header")->get("title");
		
		$sheet = $excel->getWorksheet(0);
		if ($ubis == ""){
			$sheet->setTitle($this->lokasiNas);
			$title = str_replace("<ubis>", "Nasional" , $defaultTitle);
		}else{
			$sheet->setTitle($ubis);
			$title = str_replace("<ubis>", $ubis , $defaultTitle);
		}
		
		$options->get("header")->set("title", $title);
		$excel->writeHeader($sheet, $options);
		
		
		$col = $excel->col;
		$xlsrow = $excel->row;
		$fields = $options->get("fields")->getArray();
		$fieldKunci = $options->get("keyField");
		error_log("write xlsx PL $ubis ".date("r") );
		$xlsrow+=2;
		foreach ($result->rs->rows as $line){
			$line = (array)$line;
			$line["kode_akun"] = $line["kode_neraca"];
			$line["kode_akun2"] = $line["kode_neraca"];
			foreach($fields as $col => $field){
				if ($col == 0)
					$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $line["nama"]), null);
				else {
					$excel->write($sheet, $col, $xlsrow, $line[$field], null);
				}	
			}
			$xlsrow++;
			if (isset($dataAkun)){
				$akun = $dataAkun->get( $line[$fieldKunci] );
				if ($akun){
					foreach ($akun->getArray() as $ki => $val){
						$lineData = (array)$val->getArray();
						foreach($fields as $col => $field){
							if ($col == 0)
								$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $lineData["nama"]), null);
							else 
								$excel->write($sheet, $col, $xlsrow, $lineData[$field], null);
						}
						$xlsrow++;
					}
				}
			}
	 	}
		while ($row = $rs->FetchNextObject(false)){
			error_log("Generate akun ". $row->kode_ubis ." ".date("r") );
			if ($function != "" || isset($function)) {
				error_log("\$dataAkun = \$this->$function('$model', '$thn1','$thn2','".$row->kode_ubis."','$lokasi',null,$pembagi);");
		        eval("\$dataAkun = \$this->$function('$model', '$thn1','$thn2','".$row->kode_ubis."','$lokasi',null,$pembagi);");
		    }
		    $data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
			error_log("Generate PL ". $row->kode_ubis ." ".date("r") );
		    $result = $this->getDataTrendCC($model, $thn1, $thn2, $row->kode_ubis,$lokasi,  null, $pembagi);
		    $result = json_decode($result);
			
		    $title = str_replace("<ubis>", $row->nama , $defaultTitle);
			$options->get("header")->set("title", $title);
			$sheet = $excel->addWorksheet( $row->kode_ubis);
			
			
			$excel->writeHeader($sheet, $options);
			$col = $excel->col;
			$xlsrow = $excel->row;
			$xlsrow += 2;
			error_log("write xlsx PL  $row->kode_ubis ".date("r") );
			foreach ($result->rs->rows as $line){
				$line = (array)$line;
				$line["kode_akun"] = $line["kode_neraca"];
				$line["kode_akun2"] = $line["kode_neraca"];
				foreach($fields as $col => $field){
					if ($col == 0)
						$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $line["nama"]), null);
					else {
						$excel->write($sheet, $col, $xlsrow, $line[$field], null);
					}	
				}
				$xlsrow++;
				if (isset($dataAkun)){
					$akun = $dataAkun->get( $line[$fieldKunci] );
					if ($akun){
						foreach ($akun->getArray() as $ki => $val){
							$lineData = (array)$val->getArray();
							foreach($fields as $col => $field){
								if ($col == 0)
									$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $lineData["nama"]), null);
								else 
									$excel->write($sheet, $col, $xlsrow, $lineData[$field], null);
							}
							$xlsrow++;
						}
					}
				}
   	 				
   	 		}
   	 		
		}
		error_log("done Jejer xlsx $ubis ".date("r"));
		$excel->saveXlsx($file);
		/*
	    foreach ($result->rs->rows as $line){
 				$dataRow = new server_util_Map();
 				$lineObj = (array) $line;
 				foreach ($fields->getArray() as $k => $v){
	 				if ($v == "nama")
	 					$dataRow->set($v, str_replace("&nbsp;", "", $lineObj[$v]) );
	 				else
	 					$dataRow->set($v, $lineObj[$v]);
 				}
 				$dataWitel->add($dataRow);
	 	}
 		$data->set("data", $dataWitel);
		$data->set("dataAkun", $dataAkun);
		$data->set("title", str_replace("<ubis>", "Nasional", $title) );
		$data->set("witel", $this->lokasiNas );
		$dataPL->set($row->kode_ubis,$data);
		while ($row = $rs->FetchNextObject(false)){
			error_log("Generate akun " . $row->kode_ubis);	
			if ($function != "" || isset($function)) {
		        eval("\$dataAkun = \$this->$function('$model', '$thn1','$thn2','".$row->kode_ubis."',null,$pembagi);");
		    }
		    $data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
			error_log("Generate PL " . $row->kode_ubis);
		    $result = $this->getDataTrendCC($model, $thn1, $thn2, $row->kode_ubis, null, $pembagi);
		    $result = json_decode($result);
		    foreach ($result->rs->rows as $line){
   	 				$dataRow = new server_util_Map();
   	 				$lineObj = (array) $line;
	 				foreach ($fields->getArray() as $k => $v){
	 					if ($v == "nama")
	 						$dataRow->set($v, str_replace("&nbsp;", "", $lineObj[$v]) );
	 					else
		 					$dataRow->set($v, $lineObj[$v]);
	 				}
   	 				$dataWitel->add($dataRow);
   	 			}
   	 		$data->set("data", $dataWitel);
			$data->set("dataAkun", $dataAkun);
			$data->set("title", str_replace("<ubis>", $row->nama, $title) );
			$data->set("witel", $row->kode_ubis );
			$dataPL->set($row->kode_ubis,$data);
			
		}
		$excel->generateDatel($options, $file, $dataPL);
		*/
	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		//unlink("./tmp/$file");
	}

	/**
	 * generateXLSJejerBudgetDivisi function.
	 * digunakan untuk download data Jejer Budget Divisi dalam format excel
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSJejerBudgetDivisi($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		error_log("Start Generate Jejer Budget akun $ubis ".date("r") );
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$thn1 = $paramFilter->get(1);
		$thn2 = $paramFilter->get(2);
		$ubis = $paramFilter->get(3);
		$lokasi =$paramFilter->get(4);
		$pembagi = $paramFilter->get(5);
		if (!isset($lokasi))
			$lokasi = $this->lokasi;
		else $this->lokasi = $lokasi;
		$filter = $this->getFilterUbis("", $ubis);
		//$rs = $this->dbLib->execute("select distinct b.group_ubis as kode_ubis, b.group_ubis as nama, urutan from exs_ubis a inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis order by urutan ");
        $rs = $this->dbLib->execute("select kode_ubis,  nama, rowindex from exs_ubis where status_export = '1' and kode_ubis <> '$ubis'  and $filter order by rowindex ");

		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		$fields = $options->get("fields");
		if ($function != "" || isset($function)) {
	        eval("\$dataAkun = \$this->$function('$model', '$thn1','$thn2',$ubis, $lokasi,$pembagi);");
	    }
	    $data = new server_util_Map();
	    $dataWitel = new server_util_arrayList();
	    $header = $options->get("header");
	    $title = $header->get("title");
//$model, $thn1, $thn2, $ubis = null, $lokasi = null, $neraca = null, $pembagi = 1000000000
	    $result = $this->getDataTrendBudgetCC($model, $thn1, $thn2, $ubis,  $lokasi, null, $pembagi);
	    $result = json_decode($result);
		$xlsx = $excel->createXlsx();
		$defaultTitle = $options->get("header")->get("title");
		
		$sheet = $excel->getWorksheet(0);
		if ($ubis == ""){
			$sheet->setTitle($this->lokasiNas);
			$title = str_replace("<ubis>", "Nasional" , $defaultTitle);
		}else{
			$sheet->setTitle($ubis);
			$title = str_replace("<ubis>", $ubis , $defaultTitle);
		}
		
		$options->get("header")->set("title", $title);
		$excel->writeHeader($sheet, $options);
		
		
		$col = $excel->col;
		$xlsrow = $excel->row;
		$fields = $options->get("fields")->getArray();
		$fieldKunci = $options->get("keyField");
		error_log("write xlsx PL $ubis ".date("r") );
		$xlsrow+=2;
	    foreach ($result->rs->rows as $line){
			$line = (array)$line;
			$line["kode_akun"] = $line["kode_neraca"];
			$line["kode_akun2"] = $line["kode_neraca"];
			foreach($fields as $col => $field){
				if ($col == 0)
					$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $line["nama"]), null);
				else {
					$excel->write($sheet, $col, $xlsrow, $line[$field], null);
				}	
			}
			$xlsrow++;
			if (isset($dataAkun)){
				$akun = $dataAkun->get( $line[$fieldKunci] );
				if ($akun){
					foreach ($akun->getArray() as $ki => $val){
						$lineData = (array)$val->getArray();
						foreach($fields as $col => $field){
							if ($col == 0)
								$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $lineData["nama"]), null);
							else 
								$excel->write($sheet, $col, $xlsrow, $lineData[$field], null);
						}
						$xlsrow++;
					}
				}
			}
	 	}
 		//$defaultTitle = $options->get("header")->get("title");
		while ($row = $rs->FetchNextObject(false)){
			error_log("Generate akun ". $row->kode_ubis ." ".date("r") );
			if ($function != "" || isset($function)) {
		        eval("\$dataAkun = \$this->$function('$model', '$thn1','$thn2','".$row->kode_ubis."','$lokasi',$pembagi);");
		    }
		    $data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
			error_log("Generate PL ". $row->kode_ubis ." ".date("r") );
		    $result = $this->getDataTrendBudgetCC($model, $thn1, $thn2, $row->kode_ubis,$lokasi,null, $pembagi);
		    $result = json_decode($result);
			
		    $title = str_replace("<ubis>", $row->nama , $defaultTitle);
			$options->get("header")->set("title", $title);
			$sheet = $excel->addWorksheet( $row->kode_ubis);
			
			
			$excel->writeHeader($sheet, $options);
			$col = $excel->col;
			$xlsrow = $excel->row;
			$xlsrow += 2;
			error_log("write xlsx PL  $row->kode_ubis ".date("r") );
			foreach ($result->rs->rows as $line){
				$line = (array)$line;
				$line["kode_akun"] = $line["kode_neraca"];
				$line["kode_akun2"] = $line["kode_neraca"];
				foreach($fields as $col => $field){
					if ($col == 0)
						$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $line["nama"]), null);
					else {
						$excel->write($sheet, $col, $xlsrow, $line[$field], null);
					}	
				}
				$xlsrow++;
				if (isset($dataAkun)){
					$akun = $dataAkun->get( $line[$fieldKunci] );
					if ($akun){
						foreach ($akun->getArray() as $ki => $val){
							$lineData = (array)$val->getArray();
							foreach($fields as $col => $field){
								if ($col == 0)
									$excel->write($sheet, 0, $xlsrow, str_replace("&nbsp;", "", $lineData["nama"]), null);
								else 
									$excel->write($sheet, $col, $xlsrow, $lineData[$field], null);
							}
							$xlsrow++;
						}
					}
				}
   	 				
   	 		}
   	 		
		}
		error_log("done Jejer Budget xlsx $ubis ".date("r"));
		$excel->saveXlsx($file);
		/*
	    foreach ($result->rs->rows as $line){
 				$dataRow = new server_util_Map();
 				$lineObj = (array) $line;
 				foreach ($fields->getArray() as $k => $v){
	 				if ($v == "nama")
	 					$dataRow->set($v, str_replace("&nbsp;", "", $lineObj[$v]) );
	 				else
	 					$dataRow->set($v, $lineObj[$v]);
 				}
 				$dataWitel->add($dataRow);
	 	}
 		$data->set("data", $dataWitel);
		$data->set("dataAkun", $dataAkun);
		$data->set("title", str_replace("<ubis>", "Nasional", $title) );
		$data->set("witel", $this->lokasiNas );
		$dataPL->set($row->kode_ubis,$data);
		while ($row = $rs->FetchNextObject(false)){

			if ($function != "" || isset($function)) {
		        eval("\$dataAkun = \$this->$function('$model', '$thn1','$thn2','".$row->kode_ubis."',$pembagi);");
		    }
		    $data = new server_util_Map();
		    $dataWitel = new server_util_arrayList();
		    $result = $this->getDataTrendBudgetCC($model, $thn1, $thn2, $row->kode_ubis,null, $pembagi);
		    $result = json_decode($result);
		    foreach ($result->rs->rows as $line){
   	 				$dataRow = new server_util_Map();
   	 				$lineObj = (array) $line;
	 				foreach ($fields->getArray() as $k => $v){
	 					if ($v == "nama")
	 						$dataRow->set($v, str_replace("&nbsp;", "", $lineObj[$v]) );
	 					else
		 					$dataRow->set($v, $lineObj[$v]);
	 				}
   	 				$dataWitel->add($dataRow);
   	 			}
   	 		$data->set("data", $dataWitel);
			$data->set("dataAkun", $dataAkun);
			$data->set("title", str_replace("<ubis>", $row->nama, $title) );
			$data->set("witel", $row->kode_ubis );
			$dataPL->set($row->kode_ubis,$data);
		}
		$excel->generateDatel($options, $file, $dataPL);
		*/
	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		//unlink("./tmp/$file");
	}

	/**
	 * generateXLSJejerWitel function.
	 * digunakan untuk mendownload data Jejer Actual Witel dengan format excel
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSJejerWitel($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$periode = $paramFilter->get(1);
		$ubis = $paramFilter->get(2);
		$pembagi = $paramFilter->get(3);
		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		$fields = $options->get("fields");
		/*if ($function != "" || isset($function)) {
	        eval("\$dataAkun = \$this->$function('$model', '$periode','$ubis',$pembagi);");
	    }*/
        error_log($pembagi);
	    $dataAkun = $this->getDataAkunJejerActualWitel($model, $periode,$ubis,$pembagi);

	    $data = new server_util_Map();
	    $dataWitel = new server_util_arrayList();
	    $header = $options->get("header");
	    $title = $header->get("title");
		//error_log($dataAkun->getLength());
        
	    $result = $this->witelLib->getDataJejerActualWitel2($model, $periode, $ubis, $pembagi);
	    $result = json_decode($result);
	    foreach ($result->rs->rows as $line){
 				$dataRow = new server_util_Map();
 				$line->kode_akun = $line->kode_neraca;
 				$line->kode_neraca = $line->ubis . $line->kode_neraca;
 				$lineObj = (array) $line;
 				foreach ($lineObj as $k => $v){
	 				if ($k == "nama")
	 					$dataRow->set($k, str_replace("&nbsp;", "", $lineObj[$k]) );
	 				else
	 					$dataRow->set($k, $lineObj[$k]);
 				}
 				//$dataRow->set("kode_neraca", $line->kode_neraca);
 				$dataWitel->add($dataRow);
	 	}
 		$data->set("data", $dataWitel);
		$data->set("dataAkun", $dataAkun);
		$data->set("title", $title);
		$data->set("witel", "JejerActualWitel" );
		$dataPL->set($row->kode_ubis,$data);

		$excel->generateDatel($options, $file, $dataPL);

	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		unlink("./tmp/$file");
	}

	/**
	 * generateXLSJejerAggWitel function.
	 * digunakan untuk mendownload data Jejer Budget Witel dalam format excel
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $paramFilter	: parameter dari fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSJejerAggWitel($options, $namafile, $paramFilter){
		uses("server_modules_xls_Writer", false);
		global $manager;
		$excel = new server_util_Xls();
		$file = session_id() . md5(date("r"));
		$dataPL = new server_util_Map();
		$model = $paramFilter->get(0);
		$periode = $paramFilter->get(1);
		$ubis = $paramFilter->get(2);
		$pembagi = $paramFilter->get(3);
		$function = $options->get("function");
		$funcParams = $options->get("funcParams");
		$fields = $options->get("fields");
		$dataAkun = $this->getDataAkunJejerAggWitel($model, $periode,$ubis,$pembagi);
	    $data = new server_util_Map();
	    $dataWitel = new server_util_arrayList();
	    $header = $options->get("header");
	    $title = $header->get("title");

	    $result = $this->witelLib->getDataJejerAggWitel2($model, $periode, $ubis, $pembagi);
	    $result = json_decode($result);
	    foreach ($result->rs->rows as $line){
 				$dataRow = new server_util_Map();
 				$line->kode_akun = $line->kode_neraca;
 				$line->kode_neraca = $line->ubis . $line->kode_neraca;
 				error_log("Summary : " . $line->kode_neraca);
 				$lineObj = (array) $line;
 				foreach ($lineObj as $k => $v){
	 				if ($k == "nama")
	 					$dataRow->set($k, str_replace("&nbsp;", "", $lineObj[$k]) );
	 				else
	 					$dataRow->set($k, $lineObj[$k]);
 				}

 				$dataWitel->add($dataRow);
	 	}
 		$data->set("data", $dataWitel);
		$data->set("dataAkun", $dataAkun);
		$data->set("title", $title);
		$data->set("witel", "JejerAggWitel" );
		$dataPL->set($row->kode_ubis,$data);

		$excel->generateDatel($options, $file, $dataPL);

	    ob_end_clean();
	    ob_start();
	    header("Content-Encoding: ");

		$manager->setSendResponse(false);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		echo file_get_contents("./tmp/$file");
		unlink("./tmp/$file");
	}

	/**
	 * generateXLSTrendOutlook function.
	 * digunakan untuk generate file excel dan download data outlook dalam bentuk report jejer bulanan
	 * @access public
	 * @param mixed $options	: array data konfigurasi
	 * @param mixed $namafile	: nama dari file yang akan di download
	 * @param mixed $paramFilter	: parameter untuk menjalankan fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSTrendOutlook($options, $namafile, $paramFilter){
		try{
			uses("server_modules_xls_Writer", false);
			global $manager;
			$excel = new server_util_Xls();
			$file = session_id() . md5(date("r"));
			$dataPL = new server_util_Map();
			$model = $paramFilter->get(0);
			$thn1 = $paramFilter->get(1);
			$thn2 = $paramFilter->get(2);
			$witel = $paramFilter->get(3);
			$pembagi = $paramFilter->get(4);
			$single = $paramFilter->get(5);
			$function = $options->get("function");
			$funcParams = $options->get("funcParams");
			{
				$data = new server_util_Map();
			    $dataWitel = new server_util_arrayList();
			    $result = $this->getDataTrendOutlook($model, $thn1, $thn2, $witel, null,null,   $pembagi);
			    $result = json_decode($result);
			    $nama = "";
			    foreach ($result->rs->rows as $line){
	   	 				$dataRow = new server_util_Map();
	   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

	   	 				$dataRow->set("level_spasi", $line->level_spasi);
	   	 				$dataRow->set("kode_akun", $line->kode_neraca);
	   	 				$dataRow->set("kode_neraca", $line->kode_neraca);
	   	 				$dataRow->set("jan1", $line->jan1 );
	   	 				$dataRow->set("feb1", $line->feb1 );
	           			$dataRow->set("mar1", $line->mar1 );
	           			$dataRow->set("apr1", $line->apr1);
	           			$dataRow->set("mei1", $line->mei1);
	           			$dataRow->set("jun1", $line->jun1);
	           			$dataRow->set("jul1", $line->jul1);
	           			$dataRow->set("aug1", $line->aug1);
	           			$dataRow->set("sep1", $line->sep1);
	           			$dataRow->set("okt1", $line->okt1);
	           			$dataRow->set("nop1", $line->nop1);
	           			$dataRow->set("des1", $line->des1);
	           			$dataRow->set("total1", $line->total1);
	           			$dataRow->set("jan2", $line->jan2);
	           			$dataRow->set("feb2", $line->feb2);
	           			$dataRow->set("mar2", $line->mar2);
			   			$dataRow->set("apr2", $line->apr2);
	           			$dataRow->set("mei2", $line->mei2);
	           			$dataRow->set("jun2", $line->jun2);
	           			$dataRow->set("jul2", $line->jul2);
	           			$dataRow->set("aug2", $line->aug2);
	           			$dataRow->set("sep2", $line->sep2);
	           			$dataRow->set("okt2", $line->okt2);
	           			$dataRow->set("nop2", $line->nop2);
	           			$dataRow->set("des2", $line->des2);
	           			$dataRow->set("total2", $line->total2);
	           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
		           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
		           				|| $line->total2 != 0 )
	   	 				$dataWitel->add($dataRow);
	   	 			}
	   	 		$data->set("data", $dataWitel);
				//$data->set("dataAkun", $dataAkun);
				$data->set("witel",$witel );
				$dataPL->set($witel,$data);
			}


			$excel->generateDatel($options, $file, $dataPL);

		    ob_end_clean();
		    ob_start();
		    header("Content-Encoding: ");

			$manager->setSendResponse(false);

			header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
			header ("Cache-Control: no-cache, must-revalidate");
			header ("Pragma: no-cache");
			header ("Content-type: Content-Type: application/vnd.ms-excel");
			header ("Content-Disposition: attachment; filename=". $namafile);
			header ("Content-Description: PHP/INTERBASE Generated Data" );
			error_log("Trend WItel " . $file);
			echo file_get_contents("./tmp/$file");
		}catch(exception $e){
			error_log($e->getMessage());
		}
		//unlink("./tmp/$file");
	}

	/**
	 * getDataAkunTrendOutlook function.
	 * digunakan untuk memproses generate Data Trend Bulanan Outlook sampai level akun. fungsi ini digunakan waktu proses generate file Excel outlook hasil upload
	 * @access public
	 * @param mixed $model	: model report
	 * @param mixed $thn1	: tahun untuk outlook
	 * @param mixed $thn2	: tahun pembanding untuk growth
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk mendapatkan satuan yang diinginkan. milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataAkunTrendOutlook($model, $thn1, $thn2, $ubis = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
			$ada = false;
			while ($row = $rs->FetchNextObject()){
				$ada = true;
			}
			if ($ada){
				$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
			}else if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else $filter = " and z.kode_ubis like '$ubis%' ";
			$month = date("m");
			$year = date("Y");
			if ($month == '01') $month = 12;
			else $month = floatval($month) - 1;

			$q1 = "b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.jan + b.feb + b.mar  + b.apr + b.mei + b.jun + b.jul + b.aug + b.sep + b.okt + b.nop + b.des as total";

			$q2 = "c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.jan + c.feb + c.mar  + c.apr + c.mei + c.jun + c.jul + c.aug + c.sep + c.okt + c.nop + c.des as total2";

			$sql = "select a.kode_akun,
									$q1,
									$q2
							from exs_masakun a
							left outer join (
									select a.kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn1' and a.jenis = 'S' $filter group by  a.kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select a.kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											inner join exs_ubis z on z.kode_ubis = b.kode_ubis
											where tahun='$thn2' and a.jenis = 'S' $filter group by   a.kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, e.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/ $pembagi as jan1
											, nvl(b.feb, 0)/ $pembagi as feb1
											, nvl(b.mar, 0)/ $pembagi as mar1
											, nvl(b.apr, 0)/ $pembagi as apr1
											, nvl(b.mei, 0)/ $pembagi as mei1
											, nvl(b.jun, 0)/ $pembagi as jun1
											, nvl(b.jul, 0)/ $pembagi as jul1
											, nvl(b.aug, 0)/ $pembagi as aug1
											, nvl(b.sep, 0)/ $pembagi as sep1
											, nvl(b.okt, 0)/ $pembagi as okt1
											, nvl(b.nop, 0)/ $pembagi as nop1
											, nvl(b.des, 0)/ $pembagi as des1
											, nvl(b.total, 0)/ $pembagi as total1
											, nvl(b.jan2, 0)/ $pembagi as jan2
											, nvl(b.feb2, 0)/ $pembagi as feb2
											, nvl(b.mar2, 0)/ $pembagi as mar2
											, nvl(b.apr2, 0)/ $pembagi as apr2
											, nvl(b.mei2, 0)/ $pembagi as mei2
											, nvl(b.jun2, 0)/ $pembagi as jun2
											, nvl(b.jul2, 0)/ $pembagi as jul2
											, nvl(b.aug2, 0)/ $pembagi as aug2
											, nvl(b.sep2, 0)/ $pembagi as sep2
											, nvl(b.okt2, 0)/ $pembagi as okt2
											, nvl(b.nop2, 0)/ $pembagi as nop2
											, nvl(b.des2, 0)/ $pembagi as des2
											, nvl(b.total2, 0)/ $pembagi as total2
											from EXS_NERACA a
											inner join exs_relakun e on e.kode_neraca = a.kode_neraca and e.kode_fs = a.kode_fs
											inner join exs_masakun d on d.kode_akun = e.kode_akun
											inner join (select x.kode_neraca, x.kode_akun
																, sum(nvl(jan,0) ) as jan
																, sum(nvl(feb,0) ) as feb
																, sum(nvl(mar,0) ) as mar
																, sum(nvl(apr,0) ) as apr
																, sum(nvl(mei,0) ) as mei
																, sum(nvl(jun,0) ) as jun
																, sum(nvl(jul,0) ) as jul
																, sum(nvl(aug,0) ) as aug
																, sum(nvl(sep,0) ) as sep
																, sum(nvl(okt,0) ) as okt
																, sum(nvl(nop,0) ) as nop
																, sum(nvl(des,0) ) as des
																, sum(nvl(total,0) ) as total
																, sum(nvl(jan2,0) ) as jan2
																, sum(nvl(feb2,0) ) as feb2
																, sum(nvl(mar2,0) ) as mar2
																, sum(nvl(apr2,0) ) as apr2
																, sum(nvl(mei2,0) ) as mei2
																, sum(nvl(jun2,0) ) as jun2
																, sum(nvl(jul2,0) ) as jul2
																, sum(nvl(aug2,0) ) as aug2
																, sum(nvl(sep2,0) ) as sep2
																, sum(nvl(okt2,0) ) as okt2
																, sum(nvl(nop2,0) ) as nop2
																, sum(nvl(des2,0) ) as des2
																, sum(nvl(total2,0) ) as total2

															from exs_relakun x
																inner join ($sql) y on y.kode_akun = x.kode_akun

															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = e.kode_akun

											where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("kode_neraca", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("jenis_akun", strtoupper($row->jenis_akun) );
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				$tmp = (array) $row;
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value] * -1);
					}
				}else {
					foreach ($fields as $key => $value) {
						$row2->set($value, $tmp[$value]);
					}
				}
				$notNol = false;
				foreach ($fields as $key => $value) {
					$notNol = $notNol || $tmp[$value] != 0;
				}
				if ($notNol)
					$item->add($row2);
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	/**
	 * generateXLSTrendOutlookTemplate function.
	 * digunakan untuk generate data xls dan di download data Trend Bulanan Outlook hasil upload
	 * @access public
	 * @param mixed $options	: array berisi data konfigurasi untuk generate xls
	 * @param mixed $namafile	: nama dari file yang di akan di download
	 * @param mixed $paramFilter	: filter tambahan untuk menjalankan fungsi yang akan di panggil
	 * @return void
	 */
	function generateXLSTrendOutlookTemplate($options, $namafile, $paramFilter){
		try{
			uses("server_modules_xls_Writer", false);
			global $manager;
			$excel = new server_util_Xls();
			$file = session_id() . md5(date("r"));
			$dataPL = new server_util_Map();
			$model = $paramFilter->get(0);
			$thn1 = $paramFilter->get(1);
			$thn2 = $paramFilter->get(2);
			$witel = $paramFilter->get(3);

			$pembagi = $paramFilter->get(4);
			$single = $paramFilter->get(5);

			$function = $options->get("function");
			$funcParams = $options->get("funcParams");
			if ($single == "2"){
				$zip = new ZipArchive();
				global $serverDir;
				error_log($serverDir);
				$fileZip = "$serverDir/tmp/z_$file.zip" ;
				$zip->open($fileZip, ZipArchive::CREATE);
				$data = new server_util_Map();
			    $dataWitel = new server_util_arrayList();
			    $result = $this->getDataTrendOutlookDatelPlusAkun($model, $thn1, $thn2, "",   $pembagi);
			    $result = json_decode($result);
			    $nama = "";
			    foreach ($result->rs->rows as $line){
	   	 				$dataRow = new server_util_Map();
	   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

	   	 				$dataRow->set("level_spasi", $line->level_spasi);
	   	 				$dataRow->set("kode_akun", $line->kode_neraca);
	   	 				$dataRow->set("kode_neraca", $line->kode_neraca);
	   	 				$dataRow->set("jan1", $line->jan1 );
	   	 				$dataRow->set("feb1", $line->feb1 );
	           			$dataRow->set("mar1", $line->mar1 );
	           			$dataRow->set("apr1", $line->apr1);
	           			$dataRow->set("mei1", $line->mei1);
	           			$dataRow->set("jun1", $line->jun1);
	           			$dataRow->set("jul1", $line->jul1);
	           			$dataRow->set("aug1", $line->aug1);
	           			$dataRow->set("sep1", $line->sep1);
	           			$dataRow->set("okt1", $line->okt1);
	           			$dataRow->set("nop1", $line->nop1);
	           			$dataRow->set("des1", $line->des1);
	           			$dataRow->set("total1", $line->total1);
	           			$dataRow->set("jan2", $line->jan2);
	           			$dataRow->set("feb2", $line->feb2);
	           			$dataRow->set("mar2", $line->mar2);
			   			$dataRow->set("apr2", $line->apr2);
	           			$dataRow->set("mei2", $line->mei2);
	           			$dataRow->set("jun2", $line->jun2);
	           			$dataRow->set("jul2", $line->jul2);
	           			$dataRow->set("aug2", $line->aug2);
	           			$dataRow->set("sep2", $line->sep2);
	           			$dataRow->set("okt2", $line->okt2);
	           			$dataRow->set("nop2", $line->nop2);
	           			$dataRow->set("des2", $line->des2);
	           			$dataRow->set("total2", $line->total2);
	           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
		           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
		           				|| $line->total2 != 0 )
	   	 				$dataWitel->add($dataRow);
	   	 			}
	   	 		$data->set("data", $dataWitel);
				if ($witel == ""){
					$data->set("witel","TelkomRegional" );
					$fileWitel = "TelkomRegional.xls";
				}else{
					$data->set("witel",$witel );
					$fileWitel = "$witel.xls";
				}

				$dataPL->set($witel,$data);
				$options->set("keyField","kode_neraca");
				$excel->generateDatel($options, $file, $dataPL);
				$zip->addFile("$serverDir/tmp/$file");//$fileWitel,
				//$zip->addFromString($fileWitel,  file_get_contents("./tmp/$file"));
				//if ($single == "1")
				{
					$rs = $this->dbLib->execute("select kode_ubis as kode_cc, nama from exs_ubis where kode_induk in ('T910','T911') order by kode_cc");
					//error_log("select distinct kode_witel as kode_cc, a.nama from exs_cc a inner join exs_divre b on b.witel = a.kode_cc where b.kode_ubis like '$witel%' order by kode_cc");
					$fileCount = 0;
					while ($row = $rs->FetchNextObject(false)){
						error_log($row->kode_cc);
						$fileCount ++;
						$excel = new server_util_Xls();
						$file = $witel."_".$fileCount ."_". session_id() . md5(date("r"));
						$dataPL = new server_util_Map();
						$data = new server_util_Map();
					    $dataWitel = new server_util_arrayList();
					    $result = $this->getDataTrendOutlookDatelPlusAkun($model, $thn1, $thn2, $row->kode_cc,  $pembagi);
					    $result = json_decode($result);
					    $nama = "";
					    foreach ($result->rs->rows as $line){
			   	 				$dataRow = new server_util_Map();
			   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

			   	 				$dataRow->set("level_spasi", $line->level_spasi);
			   	 				$dataRow->set("kode_akun", $line->kode_neraca);
			   	 				$dataRow->set("kode_neraca", $line->kode_neraca);
			   	 				$dataRow->set("jan1", $line->jan1 );
			   	 				$dataRow->set("feb1", $line->feb1 );
			           			$dataRow->set("mar1", $line->mar1 );
			           			$dataRow->set("apr1", $line->apr1);
			           			$dataRow->set("mei1", $line->mei1);
			           			$dataRow->set("jun1", $line->jun1);
			           			$dataRow->set("jul1", $line->jul1);
			           			$dataRow->set("aug1", $line->aug1);
			           			$dataRow->set("sep1", $line->sep1);
			           			$dataRow->set("okt1", $line->okt1);
			           			$dataRow->set("nop1", $line->nop1);
			           			$dataRow->set("des1", $line->des1);
			           			$dataRow->set("total1", $line->total1);
			           			$dataRow->set("jan2", $line->jan2);
			           			$dataRow->set("feb2", $line->feb2);
			           			$dataRow->set("mar2", $line->mar2);
					   			$dataRow->set("apr2", $line->apr2);
			           			$dataRow->set("mei2", $line->mei2);
			           			$dataRow->set("jun2", $line->jun2);
			           			$dataRow->set("jul2", $line->jul2);
			           			$dataRow->set("aug2", $line->aug2);
			           			$dataRow->set("sep2", $line->sep2);
			           			$dataRow->set("okt2", $line->okt2);
			           			$dataRow->set("nop2", $line->nop2);
			           			$dataRow->set("des2", $line->des2);
			           			$dataRow->set("total2", $line->total2);
			           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
				           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
				           				|| $line->total2 != 0 )
			   	 				$dataWitel->add($dataRow);
			   	 			}
			   	 		$data->set("data", $dataWitel);
						$data->set("witel",$row->kode_cc );
						$dataPL->set($row->kode_cc,$data);
						$excel->generateDatel($options, $file, $dataPL);
						$fileWitel = $row->kode_cc .".xls";

						if (file_exists("./tmp/$file") || file_exists("$serverDir/tmp/$file")){
							error_log("Add to ZIP $fileWitel");
							$zip->addFile("$serverDir/tmp/$file");//$fileWitel,
							//$zip->addFromString($fileWitel,  file_get_contents("./tmp/$file"));
						}else error_log("file not found $file");
					}

				}
				$zip->close();
				error_log("Done ZIP");
				ob_end_clean();
			    ob_start();
			    header("Content-Encoding: ");

				$manager->setSendResponse(false);
				if ($witel == "") $namafile = "OutlookTelkomRegional.zip";
				else $namafile = "outlook_$witel.zip";
				header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
				header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
				header ("Cache-Control: no-cache, must-revalidate");
				header ("Pragma: no-cache");
				header ("Content-type: Content-Type:  application/zip");
				header ("Content-Disposition: attachment; filename=$namafile");
				header ("Content-Description: PHP/INTERBASE Generated Data" );
				error_log("Trend Outlook Read " . $fileZip);
				if (file_exists($fileZip))
					echo file_get_contents($fileZip);
				else error_log("File Not Found $fileZip");

				return;
			}else
			{
				$data = new server_util_Map();
			    $dataWitel = new server_util_arrayList();
			    $result = $this->getDataTrendOutlookTemplate($model, $thn1, $thn2, $witel, null,null,   $pembagi);
			    $result = json_decode($result);
			    $nama = "";
			    $dataAkun = $this->getDataAkunTrendOutlook($model, $thn1, $thn2, $witel, $pembagi);
			    foreach ($result->rs->rows as $line){
	   	 				$dataRow = new server_util_Map();
	   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

	   	 				$dataRow->set("level_spasi", $line->level_spasi);
	   	 				$dataRow->set("kode_akun", $line->kode_neraca);
	   	 				$dataRow->set("kode_neraca", $line->kode_neraca);
	   	 				$dataRow->set("jan1", $line->jan1 );
	   	 				$dataRow->set("feb1", $line->feb1 );
	           			$dataRow->set("mar1", $line->mar1 );
	           			$dataRow->set("apr1", $line->apr1);
	           			$dataRow->set("mei1", $line->mei1);
	           			$dataRow->set("jun1", $line->jun1);
	           			$dataRow->set("jul1", $line->jul1);
	           			$dataRow->set("aug1", $line->aug1);
	           			$dataRow->set("sep1", $line->sep1);
	           			$dataRow->set("okt1", $line->okt1);
	           			$dataRow->set("nop1", $line->nop1);
	           			$dataRow->set("des1", $line->des1);
	           			$dataRow->set("total1", $line->total1);
	           			$dataRow->set("jan2", $line->jan2);
	           			$dataRow->set("feb2", $line->feb2);
	           			$dataRow->set("mar2", $line->mar2);
			   			$dataRow->set("apr2", $line->apr2);
	           			$dataRow->set("mei2", $line->mei2);
	           			$dataRow->set("jun2", $line->jun2);
	           			$dataRow->set("jul2", $line->jul2);
	           			$dataRow->set("aug2", $line->aug2);
	           			$dataRow->set("sep2", $line->sep2);
	           			$dataRow->set("okt2", $line->okt2);
	           			$dataRow->set("nop2", $line->nop2);
	           			$dataRow->set("des2", $line->des2);
	           			$dataRow->set("total2", $line->total2);
	           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
		           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
		           				|| $line->total2 != 0 )
	   	 				$dataWitel->add($dataRow);
	   	 			}
	   	 		$data->set("data", $dataWitel);
				$data->set("dataAkun", $dataAkun);
				if ($witel == "")
					$data->set("witel",$this->lokasiNas );
				else $data->set("witel",$witel );
				$dataPL->set($witel,$data);
				if ($single == "1"){
					$rs = $this->dbLib->execute("select distinct b.group_ubis as kode_ubis, b.group_ubis as nama, urutan from exs_ubis a inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis order by urutan ");
					while ($row = $rs->FetchNextObject(false)){
						$data = new server_util_Map();
					    $dataWitel = new server_util_arrayList();
					    $result = $this->getDataTrendOutlookTemplate($model, $thn1, $thn2, $row->kode_ubis, null,null,   $pembagi);
					    $result = json_decode($result);
					    $nama = "";
					    $dataAkun = $this->getDataAkunTrendOutlook($model, $thn1, $thn2, $row->kode_ubis, $pembagi);
					    foreach ($result->rs->rows as $line){
			   	 				$dataRow = new server_util_Map();
			   	 				$dataRow->set("nama", str_replace("&nbsp;", "", $line->nama));

			   	 				$dataRow->set("level_spasi", $line->level_spasi);
			   	 				$dataRow->set("kode_akun", $line->kode_neraca);
			   	 				$dataRow->set("kode_neraca", $line->kode_neraca);
			   	 				$dataRow->set("jan1", $line->jan1 );
			   	 				$dataRow->set("feb1", $line->feb1 );
			           			$dataRow->set("mar1", $line->mar1 );
			           			$dataRow->set("apr1", $line->apr1);
			           			$dataRow->set("mei1", $line->mei1);
			           			$dataRow->set("jun1", $line->jun1);
			           			$dataRow->set("jul1", $line->jul1);
			           			$dataRow->set("aug1", $line->aug1);
			           			$dataRow->set("sep1", $line->sep1);
			           			$dataRow->set("okt1", $line->okt1);
			           			$dataRow->set("nop1", $line->nop1);
			           			$dataRow->set("des1", $line->des1);
			           			$dataRow->set("total1", $line->total1);
			           			$dataRow->set("jan2", $line->jan2);
			           			$dataRow->set("feb2", $line->feb2);
			           			$dataRow->set("mar2", $line->mar2);
					   			$dataRow->set("apr2", $line->apr2);
			           			$dataRow->set("mei2", $line->mei2);
			           			$dataRow->set("jun2", $line->jun2);
			           			$dataRow->set("jul2", $line->jul2);
			           			$dataRow->set("aug2", $line->aug2);
			           			$dataRow->set("sep2", $line->sep2);
			           			$dataRow->set("okt2", $line->okt2);
			           			$dataRow->set("nop2", $line->nop2);
			           			$dataRow->set("des2", $line->des2);
			           			$dataRow->set("total2", $line->total2);
			           			if ($line->jan1 != 0 || $line->feb1 != 0 || $line->mar1 != 0 || $line->apr1 != 0 || $line->mei1 != 0 || $line->jun1 != 0 || $line->jul1 != 0 || $line->aug1 != 0 || $line->sep1 != 0 || $line->okt1 != 0 || $line->nop1 != 0 || $line->des1 != 0
				           				|| $line->total1 != 0 || $line->jan2 != 0 || $line->feb2 != 0 || $line->mar2 != 0 || $line->apr2 != 0 || $line->mei2 != 0 || $line->jun2 != 0 || $line->jul2 != 0 || $line->aug2 != 0 || $line->sep2 != 0 || $line->okt2 != 0 || $line->nop2 != 0 || $line->des2 != 0
				           				|| $line->total2 != 0 )
			   	 				$dataWitel->add($dataRow);
			   	 			}
			   	 		$data->set("data", $dataWitel);
						$data->set("dataAkun", $dataAkun);
						$data->set("witel",$row->kode_ubis );
						$dataPL->set($row->kode_ubis,$data);

					}

				}
			}

			$options->set("keyField","kode_neraca");
			$excel->generateDatel($options, $file, $dataPL);

		    ob_end_clean();
		    ob_start();
		    header("Content-Encoding: ");

			$manager->setSendResponse(false);

			header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
			header ("Cache-Control: no-cache, must-revalidate");
			header ("Pragma: no-cache");
			header ("Content-type: Content-Type: application/vnd.ms-excel");
			header ("Content-Disposition: attachment; filename=". $namafile);
			header ("Content-Description: PHP/INTERBASE Generated Data" );
			error_log("Trend Outlook Templat " . $file);
			echo file_get_contents("./tmp/$file");
		}catch(exception $e){
			error_log($e->getMessage());
		}
		unlink("./tmp/$file");
	}

	/**
	 * getTBCC function.
	 * digunakan untuk proses mendownload data Budget & Actual dari SAP melalui RFC untuk di transfer ke FiPART dari menu FiPART
	 * @access public
	 * @param mixed $login	: array untuk menampung variabel login ke SAP, user dan passwd
	 * @param mixed $tahun	: filter tahun yang akan di transfer
	 * @param mixed $ubis	: array filter ubis yng akan di transfer
	 * @return void
	 */
	function callTBCC($login, $tahun, $ubis, $compCode = null){
		
		if (!isset($compCode)){
			$compCode = $this->cocd;
			if ($compCode == "9000"){
				$compCode = "1000";
				$this->lokasi = "1000";
			}
		}
		
		$rfc = $this->getSAPConnection($compCode);

		
		$sapImp = new server_util_Map(array(
								"IM_GJAHR" => $tahun ,
								"IM_KOKRS" => $compCode,
								"IM_VERSN" => "000",
								"IM_RLDNR"	=> "N1"
								));
		$dataAkun = new server_util_arrayList();
		$dataAkun->add(array("SIGN"=>"I","OPTION"=>"BT","LOW"=>"0040000000","HIGH"=>"0079999999"));

		$dataCC = new server_util_arrayList();
		if ($ubis->get("low") == "")
				;
		else if ($ubis->get("high") == "")
			$dataCC->add(array("SIGN"=>"I","OPTION"=>"CP","LOW"=>$ubis->get("low"),"HIGH"=>$ubis->get("high")));
		else
			$dataCC->add(array("SIGN"=>"I","OPTION"=>"BT","LOW"=>$ubis->get("low"),"HIGH"=>$ubis->get("high")));
		$sapExpTable = new server_util_Map(array("T_OUTPUT"));
		$sapImpTable = new server_util_Map(array("IT_PRCTR" => $dataCC,"IT_RACCT" => $dataAkun));
		return $rfc->callRFC($login,"ZFMFI_PLAN_ACT_MONTHLY_REPORT", $sapImp, $sapExpTable, $sapImpTable, null, true);
	}
	function getTBCC($login, $tahun, $ubis, $compCode = null){


		//$rfc = new server_util_rfc("rra/sap");
		$rs = $this->dbLib->execute("select flag from spro where kode_spro = 'SYNCH' ");
		if ($row = $rs->FetchNextObject(false)){
			if ($row->flag == "1"){
				return "Ada Proses synch yang sedang berjalan.";
			}else {
				$this->dbLib->execute("update spro set flag = '1' where kode_spro = 'SYNCH' ");
			}
		}
		$this->lokasi = "1000";
		$compCode = "1000";
		error_log("lokasi " . $this->lokasi);
		$dataSAP = $this->callTBCC($login, $tahun , $ubis, $compCode);
		if (gettype($dataSAP) == "string"){
            error_log($dataSAP);
			return $dataSAP;
		}
		
		
		$dataAkun = new server_util_Map();
		$rs = $this->dbLib->execute("select kode_akun from exs_masakun");
		while ($row = $rs->FetchNextObject(false)){
			$dataAkun->set($row->kode_akun, $row->kode_akun);
		}
		$output = $dataSAP->get("T_OUTPUT");
		$cc = "";
		$sqlText = array();
		$akunBaru= new server_util_arrayList();
		$allCC = false;
		if ($ubis->get("low") == "*"){
			$allCC = true;
		}
		foreach ($output->getArray() as $val){
			$line = $val->get(0);
			//error_log(print_r($line->getArray(), true));
			if ($line->get("RACCT") != ""){
				$actual = "";
				$budget = "";
				$actualDes = 0;
				$budgetDes = 0;
				for ($i = 1; $i <= 16; $i++){
					if ($i < 10) $prd = "0$i";
					else $prd = $i;
					$value = floatval($line->get("PLAN$prd"));
					if (strpos($line->get("PLAN$prd"),"-") > 0 ) $value = floatval($line->get("PLAN$prd")) * -1;
					if ($i >= 12)
						$budgetDes += $value;
					else 
						$budget .= ",'$value'";
					$value = floatval($line->get("ACT$prd"));
					if (strpos($line->get("ACT$prd"),"-") > 0 ) $value = floatval($line->get("ACT$prd")) * -1;
					if ($i >= 12)
						$actualDes += $value;
					else 
						$actual .= ",'$value'";
				}
				$actual .= ",'$actualDes'";
				$budget .= ",'$budgetDes'";
				$akun = substr($line->get("RACCT"),2,8);
				if ($dataAkun->get($akun) == null){
					$sqlText[] = "insert into exs_masakun(kode_akun, nama, kode_lokasi)values($akun, '-', '". $this->lokasi ."')";
					$dataAkun->set($akun, $akun);
					$akunBaru->add($akun);
				}
				if (!$allCC){
					if (strpos($cc,$line->get("RPRCTR")) === false){
						if ($cc != "") $cc .= ",";
						$cc .= "'" . $line->get("RPRCTR"). "'";
					}
				}
				if ($line->get("RPRCTR") == ""){
					if ($akun == "41412705")
						$line->set("RPRCTR","T921A00");
					else if ($akun == "52100001")
						$line->set("RPRCTR","T005D09");
					else if ($akun == "52100027")
						$line->set("RPRCTR","T005D09");
					else 
						$line->set("RPRCTR","-");
						// if ($akun == "41412705")
						// 	$cc = "T921A00";
						// if ($akun == "52100001")
						// 	$cc = "T005D09";
						// if ($akun == "52100027")
						// 	$cc = "T005D09";
				}
				

				$values1 = "'$tahun','".$line->get("RPRCTR")."','$akun' $budget,'S',sysdate, '".$this->lokasi."'";
				$values2 = "'$tahun','".$line->get("RPRCTR")."','$akun' $actual,'S',sysdate, '".$this->lokasi."'";
				$sqlText[] = "insert into exs_mbudget_tmp(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis, tgl_upd, kode_lokasi)values($values1)";
				$sqlText[] = "insert into exs_mactual_tmp(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis, tgl_upd, kode_lokasi)values($values2)";
				//error_log("insert into exs_mactual_tmp(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis, tgl_upd, kode_lokasi)values($values2)");
			}
		}
		$sql = new server_util_arrayList();
		if (!$allCC){
			$sql->add("delete from exs_mactual_tmp where tahun='$tahun' and kode_cc in ($cc)  and jenis = 'S' and kode_lokasi ='". $this->lokasi ."'");
			$sql->add("delete from exs_mbudget_tmp where tahun='$tahun' and kode_cc in ($cc)  and jenis = 'S' and kode_lokasi ='". $this->lokasi ."'");
		}else{
			$sql->add("delete from exs_mactual_tmp where tahun='$tahun'  and jenis = 'S' and kode_lokasi ='". $this->lokasi ."' ");
			$sql->add("delete from exs_mbudget_tmp where tahun='$tahun'  and jenis = 'S' and kode_lokasi ='". $this->lokasi ."' ");
		}

		foreach ($sqlText as $val){
			$sql->add($val);
		}
		$res = $this->dbLib->execArraySQL($sql);
		$this->dbLib->execute("update spro set flag = '0' where kode_spro = 'SYNCH' ");
		if ($res == "process completed"){
			$result = new server_util_Map();
			if (!$allCC){
				$result->set("result", $this->dbLib->getDataProviderPage("select a.kode_akun, a.kode_cc, a.tahun
									, a.jan, a.feb, a.mar, a.apr, a.mei, a.jun, a.jul, a.aug, a.sep, a.okt, a.nop, a.des
									, b.jan as jan1, b.feb as feb1, b.mar as mar1, b.apr as apr1, b.mei as mei1, b.jun as jun1
									, b.jul as jul1 , b.aug as aug1, b.sep as sep1, b.okt as okt1, b.nop as nop1, b.des as des1
								 from exs_mactual_tmp a
								 		inner join exs_mactual_tmp b on b.kode_akun = a.kode_akun and b.kode_cc = a.kode_cc and b.tahun = a.tahun and b.jenis = a.jenis and b.kode_lokasi = a.kode_lokasi
								 	 where a.tahun = '$tahun'  and a.kode_cc in ($cc) and a.jenis = 'S' and a.kode_lokasi ='". $this->lokasi ."' ", 1, 20) );

				$result->set("filter", "where tahun = '$tahun'  and kode_cc in ($cc)  and jenis = 'S' and kode_lokasi ='". $this->lokasi ."' ");
			}else{
				$result->set("result", $this->dbLib->getDataProviderPage("select a.kode_akun, a.kode_cc, a.tahun
									, a.jan, a.feb, a.mar, a.apr, a.mei, a.jun, a.jul, a.aug, a.sep, a.okt, a.nop, a.des
									, b.jan as jan1, b.feb as feb1, b.mar as mar1, b.apr as apr1, b.mei as mei1, b.jun as jun1
									, b.jul as jul1 , b.aug as aug1, b.sep as sep1, b.okt as okt1, b.nop as nop1, b.des as des1
								 from exs_mactual_tmp a
								 		inner join exs_mactual_tmp b on b.kode_akun = a.kode_akun and b.kode_cc = a.kode_cc and b.tahun = a.tahun and b.jenis = a.jenis
										  and b.kode_lokasi = a.kode_lokasi
								 	 where a.tahun = '$tahun' and a.jenis = 'S' and a.kode_lokasi ='". $this->lokasi ."' ", 1, 20) );
				$result->set("filter", "where tahun = '$tahun'  and jenis = 'S' and kode_lokasi ='". $this->lokasi ."'");
			}
			$result->set("akun", $akunBaru);
			$result->set("cc", $this->dbLib->getDataProvider("select distinct a.kode_cc from exs_mactual_tmp a
								 		left outer join exs_cc b on b.kode_cc = a.kode_cc and b.kode_lokasi = a.kode_lokasi
								 	 where a.tahun = '$tahun' and a.jenis = 'S' and a.kode_lokasi ='". $this->lokasi ."' and b.kode_cc is null  ") );

			return $result;
		}else {
			error_log($res);
			return $res;
		}

	}

	/**
	 * getAggNewDatel function.
	 * digunakan untuk proses mendownload data Budget & Actual dari SAP melalui RFC untuk di transfer ke FiPART dari crontab
	 * @access public
	 * @param mixed $login	: array untuk menampung variabel login ke SAP, user dan passwd
	 * @param mixed $tahun	: filter tahun yang akan di transfer
	 * @param mixed $ubis	: array filter ubis yng akan di transfer
	 * @return void
	 */

	function getDonloadSAPTB($login, $tahun, $ubis, $compCode = null){
		//$rfc = new server_util_rfc("rra/sap");
		$rfc = $this->getSAPConnection($compCode);
		$dataSAP = $rfc->getTBCC($login, $tahun , $ubis, $compCode);
		if (gettype($dataSAP) == "string"){
			return $dataSAP;
		}

		$dataAkun = new server_util_Map();
		$rs = $this->dbLib->execute("select kode_akun from exs_masakun");
		while ($row = $rs->FetchNextObject(false)){
			$dataAkun->set($row->kode_akun, $row->kode_akun);
		}
		$output = $dataSAP->get("T_OUTPUT");
		$cc = "";
		$sqlText = array();
		$akunBaru= new server_util_arrayList();
		$listBaru = "";
		$allCC = false;
		if ($ubis->get("low") == "*"){
			$allCC = true;
		}
		foreach ($output->getArray() as $val){
			$line = $val->get(0);
			if ($line->get("RACCT") != ""){
				$actual = "";
				$budget = "";
				for ($i = 1; $i <= 12; $i++){
					if ($i < 10) $prd = "0$i";
					else $prd = $i;
					$value = floatval($line->get("PLAN$prd"));
					if (strpos($line->get("PLAN$prd"),"-") > 0 ) $value = floatval($line->get("PLAN$prd")) * -1;
					$budget .= ",'$value'";
					$value = floatval($line->get("ACT$prd"));
					if (strpos($line->get("ACT$prd"),"-") > 0 ) $value = floatval($line->get("ACT$prd")) * -1;
					$actual .= ",'$value'";
				}
				$akun = substr($line->get("RACCT"),2,8);
				if ($dataAkun->get($akun) == null){
					$sqlText[] = "insert into exs_masakun(kode_akun, nama, kode_lokasi)values($akun, '-', '10')";
					$dataAkun->set($akun, $akun);
					$akunBaru->add($akun);
					$listBaru .= $akun . ",";
				}
				if (!$allCC){
					if (strpos($cc,$line->get("RPRCTR")) === false){
						if ($cc != "") $cc .= ",";
						$cc .= "'" . $line->get("RPRCTR"). "'";
					}
				}
				$values1 = "'$tahun','".$line->get("RPRCTR")."','$akun' $budget,'S',sysdate";
				$values2 = "'$tahun','".$line->get("RPRCTR")."','$akun' $actual,'S',sysdate";
				$sqlText[] = "insert into exs_mbudget(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis, tgl_upd)values($values1)";
				$sqlText[] = "insert into exs_mactual(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis, tgl_upd)values($values2)";
			}
		}
		$sql = new server_util_arrayList();
		if (!$allCC){
			$sql->add("delete from exs_mactual where tahun='$tahun' and kode_cc in ($cc)  and jenis = 'S'");
			$sql->add("delete from exs_mbudget where tahun='$tahun' and kode_cc in ($cc)  and jenis = 'S'");
		}else{
			$sql->add("delete from exs_mactual where tahun='$tahun'  and jenis = 'S'");
			$sql->add("delete from exs_mbudget where tahun='$tahun'  and jenis = 'S'");
		}

		foreach ($sqlText as $val){
			$sql->add($val);
		}
		$sql->add("insert into exs_cc(kode_cc, kode_lokasi, kode_ubis, nama) select a.kode_cc,'10',substr(a.kode_cc,1,4), '-' from exs_mbudget a
								 		left outer join exs_cc b on b.kode_cc = a.kode_cc
								 	 where a.tahun = '$tahun' and a.jenis = 'S' and b.kode_cc is null and a.kode_cc like 'T%' and not a.kode_cc like 'TI%' ");
		$rs = $this->dbLib->execute("select value1 from spro where kode_spro = 'ADMFIPART' ");
		$row = $rs->FetchNextObject(false);
		if ($row){
			$nb = "FIPART" . md5(date("r"));
			$no_telp = "0" . $row->value1;
			$sql->add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('$nb', sysdate, 'Ada Akun Baru untu FIPART $listBaru', '0','$no_telp')");
		}
		$res = $this->dbLib->execArraySQL($sql);
		if ($res == "process completed"){
			return "ok";
		}else {
			error_log($res);
			return $res;
		}

	}

	function getAggNewDatel($login, $tahun, $ubis){
		//$rfc = new server_util_rfc("rra/sap");
		$rfc = $this->getSAPConnection($compCode);
		$dataSAP = $rfc->getAggNewDatel($login, $tahun, $ubis);
		if (gettype($dataSAP) == "string"){
			return $dataSAP;
		}

		$dataAkun = new server_util_Map();
		$rs = $this->dbLib->execute("select kode_akun from exs_masakun");
		while ($row = $rs->FetchNextObject(false)){
			$dataAkun->set($row->kode_akun, $row->kode_akun);
		}
		$output = $dataSAP->get("T_OUTPUT");
		$cc = "";
		$sqlText = array();
		$akunBaru= new server_util_arrayList();
		$allCC = false;
		if ($ubis->get("low") == "*"){
			$allCC = true;
		}
		foreach ($output->getArray() as $val){
			$line = $val->get(0);
			if ($line->get("RACCT") != ""){
				$budget = "";
				for ($i = 1; $i <= 12; $i++){
					if ($i < 10) $prd = "0$i";
					else $prd = $i;
					$value = floatval($line->get("PLAN$prd"));
					if (strpos($line->get("PLAN$prd"),"-") > 0 ) $value = floatval($line->get("PLAN$prd")) * -1;
					$budget .= ",'$value'";

				}
				$akun = substr($line->get("RACCT"),2,8);
				if ($dataAkun->get($akun) == null){
					$sqlText[] = "insert into exs_masakun(kode_akun, nama, kode_lokasi)values($akun, '-', '10')";
					$dataAkun->set($akun, $akun);
					$akunBaru->add($akun);
				}
				if (!$allCC){
					if (strpos($cc,$line->get("RPRCTR")) === false){
						if ($cc != "") $cc .= ",";
						$cc .= "'" . $line->get("RPRCTR"). "'";
					}
				}
				$values1 = "'$tahun','".$line->get("RPRCTR")."','$akun' $budget,'C',sysdate";
				$sqlText[] = "insert into exs_mbudget_tmp(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis, tgl_upd)values($values1)";
			}
		}
		$sql = new server_util_arrayList();
		if (!$allCC){
			$sql->add("delete from exs_mbudget_tmp where tahun='$tahun' and kode_cc in ($cc)  and jenis in ('C','E','B','ZC','ZE','ZB' ) and kode_akun like '4%'");
		}else{
			$sql->add("delete from exs_mbudget_tmp where tahun='$tahun'  and jenis in ('C','E','B','ZC','ZE','ZB' ) and kode_akun like '4%'");
		}

		foreach ($sqlText as $val){
			$sql->add($val);
		}
		$res = $this->dbLib->execArraySQL($sql);
		if ($res == "process completed"){
			$result = new server_util_Map();
			if (!$allCC){
				$result->set("result", $this->dbLib->getDataProviderPage("select a.kode_akun, a.kode_cc, a.tahun
									, a.jan, a.feb, a.mar, a.apr, a.mei, a.jun, a.jul, a.aug, a.sep, a.okt, a.nop, a.des
								from exs_mbudget_tmp a
								 	where a.tahun = '$tahun'  and a.kode_cc in ($cc) and a.jenis in ('C','E','B','ZC','ZE','ZB' ) and a.kode_akun like '4%' ", 1, 20) );

				$result->set("filter", "where tahun = '$tahun'  and kode_cc in ($cc)  and jenis in ('C','E','B','ZC','ZE','ZB' ) and kode_akun like '4%'");
			}else{
				$result->set("result", $this->dbLib->getDataProviderPage("select a.kode_akun, a.kode_cc, a.tahun
									, a.jan, a.feb, a.mar, a.apr, a.mei, a.jun, a.jul, a.aug, a.sep, a.okt, a.nop, a.des
								 from exs_mbudget_tmp a where a.tahun = '$tahun' and a.jenis in ('C','E','B','ZC','ZE','ZB' ) and a.kode_akun like '4%'", 1, 20) );
				$result->set("filter", "where tahun = '$tahun'  and jenis in ('C','E','B','ZC','ZE','ZB' ) and kode_akun like '4%'");
			}
			$result->set("akun", $akunBaru);
			return $result;
		}else {
			error_log($res);
			return $res;
		}

	}
	//generate summary PL Divisi

	/**
	 * generateDataEXSUM function.
	 * digunakan untuk menggenerate  Data EXSUM dan di simpan ke tabel EXS_LM_EXSUM untuk kebutuhan report WARROOM.

	 * @access public
	 * @param mixed $periode : periode report
	 * @param mixed $model	: model report yang akan di generate
	 * @param mixed $ubis	: divisi yang akan di sajikan, jika kosong akan menggenerate data nasional
	 * @param mixed $pembagi : nilai pembagi untuk mendapatkan satuan sesuai yang diinginkan.
	 * @return void
	 */
	function generateDataEXSUM($periode, $model, $ubis, $pembagi){
		$pembagi = 1;
		$sql = new server_util_arrayList();
		$dataPL = new server_util_Map();
		if ($ubis == ""){
			/*
			$rs = $this->dbLib->execute("select b.group_ubis as kode_ubis, b.group_ubis as nama 
									from exs_ubis a 
									inner join exs_grouping_ubis b on b.kode_ubis = a.kode_ubis 
									where a.kode_lokasi = '".$this->lokasi."' order by b.group_ubis ");
			*/
			$ubis = $this->getUnconsRoot($this->lokasi);
			$rs = $this->dbLib->execute("select a.KODE_UBIS, rowindex, level_spasi
										from exs_ubis a 
										where a.kode_lokasi = '".$this->lokasi."' and level_spasi <= 2 and (kode_induk <> 'Others')
										start with kode_ubis = '$ubis'
										connect by kode_induk = prior kode_ubis
										order by a.rowindex ");
			
		}else {
			$rs = $this->dbLib->execute("select a.kode_ubis, a.nama from exs_ubis a where kode_ubis = '$ubis' and a.kode_lokasi = '".$this->lokasi."' ");
		}
		$sql->add("delete from exs_lm_exsum where periode ='$periode' and ubis ='$ubis'");

	    $result = $this->getDataEXSUMCC($model, $periode, "", null, $pembagi);
	    $result = json_decode($result);
	    foreach ($result->rs->rows as $line){
 			$sql->add("insert into exs_lm_exsum(
	 						ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex,
	 						aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actthnlalu, acvpsn, acvgap,
	 						growthpsn, growthgap, acvytdpsn, acvytdrp,growthytypsn, growthytyrp, periode )
	    			values('$ubis','".$line->kode_neraca."','".str_replace("&nbsp;", "", $line->nama)."','".$line->tipe."','".$line->jenis_akun."','".$line->sum_header."','".$line->level_spasi."','".$line->kode_induk."','".$line->rowindex."',
	    					".$line->aggthn.", ".$line->aggbln.", ". $line->aggsd.",".$line->actbln.", ".$line->actsd.",".$line->trend.",".$line->actall.",".$line->acvpsn.",".$line->acvgap.",
	    					". $line->growthpsn ." , ".$line->growthgap.",".$line->acvytdpsn.",".$line->acvytdrp.",".$line->growthytypsn.",". $line->growthytyrp .",'$periode'           )");

	 	}

 		while ($row = $rs->FetchNextObject(false)){
			//if ($function != "" || isset($function)) {
		    //    eval("\$dataAkun = \$this->$function('$model', '$periode','".$row->kode_ubis."','',$pembagi);");
		    //}
		    $sql->add("delete from exs_lm_exsum where periode ='$periode' and ubis ='".$row->kode_ubis."'");

		    $result = $this->getDataEXSUMCC($model, $periode, $row->kode_ubis, null, $pembagi);
		    $result = json_decode($result);
		    foreach ($result->rs->rows as $line){
   	 			$sql->add("insert into exs_lm_exsum(
	 						ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex,
	 						aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actthnlalu, acvpsn, acvgap,
	 						growthpsn, growthgap, acvytdpsn, acvytdrp,growthytypsn, growthytyrp, periode )
	    			values('". $row->kode_ubis ."','".$line->kode_neraca."','".str_replace("&nbsp;", "", $line->nama)."','".$line->tipe."','".$line->jenis_akun."','".$line->sum_header."','".$line->level_spasi."','".$line->kode_induk."','".$line->rowindex."',
	    					".$line->aggthn.", ".$line->aggbln.", ". $line->aggsd.",".$line->actbln.", ".$line->actsd.",".$line->trend.",".$line->actall.",".$line->acvpsn.",".$line->acvgap.",
	    					". $line->growthpsn ." , ".$line->growthgap.",".$line->acvytdpsn.",".$line->acvytdrp.",".$line->growthytypsn.",". $line->growthytyrp .",'$periode'           )");


   	 			}

		}
		return $this->dbLib->execArraySQL($sql);

	}
	//generate Summary PL Witel

	/**
	 * generateDataEXSUMWitel function.
	 * digunakan untuk mengenerate data Exsum Witel di simpan ke tabel EXS_LM_EXSUM untuk kebutuhan report WAR ROOM.
	 * @access public
	 * @param mixed $periode	: periode report
	 * @param mixed $model		: model report yang akan di generate
	 * @param mixed $ubis		: filter witel yang akan di generate
	 * @param mixed $pembagi	: nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function generateDataEXSUMWitel($periode, $model, $ubis, $pembagi){
		$pembagi = 1;

		$rs = $this->dbLib->execute("select distinct a.kode_cc, a.nama , b.urut_witel
					from exs_cc a
					inner join exs_mappc b on b.kode_witel = a.kode_cc
					where b.urut_witel like '$ubis%' and a.kode_cc like 'T91%' and a.kode_cc like '%-%' order by kode_cc");
		$nu = 0;
		while ($row = $rs->FetchNextObject(false))
		{
			$result = $this->getDataEXSUMDatel($model, $periode, $row->kode_cc, null, null,  "", $pembagi);
		    $result = json_decode($result);
		    $sql = new server_util_arrayList();
		    echo $row->urut_witel ;
		    $sql->add("delete from exs_lm_exsum where periode = '$periode' and ubis = '".$row->urut_witel."' ");
		    foreach ($result->rs->rows as $line){
   	 			$sql->add("insert into exs_lm_exsum(
	 						ubis, sub_ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex,
	 						aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actthnlalu, acvpsn, acvgap,
	 						growthpsn, growthgap, acvytdpsn, acvytdrp,growthytypsn, growthytyrp, periode, no_urut )
	    			values('". $row->urut_witel ."','".$line->ubis."','".$line->kode_neraca."','".str_replace("&nbsp;", "", $line->nama)."','".$line->tipe."','".$line->jenis_akun."','".$line->sum_header."','".$line->level_spasi."','".$line->kode_induk."','".$line->rowindex."',
	    					".$line->aggthn.", ".$line->aggbln.", ". $line->aggsd.",".$line->actbln.", ".$line->actsd.",".$line->trend.",".$line->actall.",".$line->acvpsn.",".$line->acvgap.",
	    					". $line->growthpsn ." , ".$line->growthgap.",".$line->acvytdpsn.",".$line->acvytdrp.",".$line->growthytypsn.",". $line->growthytyrp .",'$periode'    , $nu       )");
				$nu++;
   	 		}
   	 		echo $this->dbLib->execArraySQL($sql) ;
   	 		echo "<br>";
		}

		return "done";
	}

	/**
	 * generateDataEXSUMRegional function.
	 * digunakan untuk mengenerate data Exsum Divre di simpan ke tabel EXS_LM_EXSUM untuk kebutuhan report WAR ROOM.
	 * @access public
	 * @param mixed $periode	: periode report
	 * @param mixed $model		: model report yang akan di generate
	 * @param mixed $ubis		: filter witel yang akan di generate
	 * @param mixed $pembagi	: nilai pembagi untuk mendapatkan satuan yang diinginkan, milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function generateDataEXSUMRegional($periode, $model, $ubis, $pembagi){
		$pembagi = 1;
		$rs = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
		$nu = 0;
		while ($row = $rs->FetchNextObject(false))
		{
			$result = $this->getDataEXSUMDatel($model, $periode, $row->kode_witel, null, null,  "", $pembagi);
		    $result = json_decode($result);
		    echo $row->kode_witel;
		    $sql = new server_util_arrayList();
		    $sql->add("delete from exs_lm_exsum where periode = '$periode' and ubis = '".$row->kode_witel."' ");
		    foreach ($result->rs->rows as $line){
   	 				$sql->add("insert into exs_lm_exsum(
	 						ubis, sub_ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex,
	 						aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actthnlalu, acvpsn, acvgap,
	 						growthpsn, growthgap, acvytdpsn, acvytdrp,growthytypsn, growthytyrp, periode, no_urut )
	    			values('". $row->kode_witel ."','".$line->ubis."','".$line->kode_neraca."','".str_replace("&nbsp;", "", $line->nama)."','".$line->tipe."','".$line->jenis_akun."','".$line->sum_header."','".$line->level_spasi."','".$line->kode_induk."','".$line->rowindex."',
	    					".$line->aggthn.", ".$line->aggbln.", ". $line->aggsd.",".$line->actbln.", ".$line->actsd.",".$line->trend.",".$line->actall.",".$line->acvpsn.",".$line->acvgap.",
	    					". $line->growthpsn ." , ".$line->growthgap.",".$line->acvytdpsn.",".$line->acvytdrp.",".$line->growthytypsn.",". $line->growthytyrp .",'$periode'  ,$nu         )");
					$nu++;
   	 		}
   	 		echo $this->dbLib->execArraySQL($sql);
   	 		echo "<br>";
		}

		return "done";
	}


	/**/
	function getDataGLItem($akun, $ubis, $tgl1, $tgl2){
		$rfc = new server_util_rfc("rra/sap");
		$dataSAP = $rfc->getGLLI($login, $c, $akun, $ubis, $tgl1, $tgl2);
		foreach ($output->getArray() as $val){
			$line = $val->get(0);
		}
	}
	//** BPC
	/**
     *  <#digunakan untuk menghitung summari dari struktur report #>
     *
     *  @param $item <#$item item summary beserta child yang di bawahnya#>
     *
     *  @return <#return value description#>
     */
	function summariesRKM(&$item){
		//error_log($item->data->ubis);
		foreach ($item->childs as $key => $val){
			$line = $val;
			$this->summariesRKM($line);
			$item->data->aggthn += $line->data->aggthn;
			$item->data->aggthn1 += $line->data->aggthn1;
			$item->data->aggthn2 += $line->data->aggthn2;
			$item->data->aggthn3 += $line->data->aggthn3;
			$item->data->rkap += $line->data->rkap;

			if ($line->data->sum_header != "-") {
				$sumheader = explode(",",$line->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $line->data->aggthn;
						$nodeHeader->data->aggthn1 += $line->data->aggthn1;
						$nodeHeader->data->aggthn2 += $line->data->aggthn2;
						$nodeHeader->data->aggthn3 += $line->data->aggthn3;
						$nodeHeader->data->rkap += $line->data->rkap;

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
	function generateResultRKM($item, &$result, $neraca, $pembagi){
		foreach ($item->childs as $key => $val){
			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->aggthn = ($val->data->aggthn) * -1 / $pembagi;
				$val->data->aggthn1 = ($val->data->aggthn1) * -1 / $pembagi;
				$val->data->aggthn2 = ($val->data->aggthn2) * -1 / $pembagi;
				$val->data->aggthn3 = ($val->data->aggthn3) * -1 / $pembagi;
				$val->data->rkap = ($val->data->rkap) * -1 / $pembagi;
				$val->data->deviasi = ($val->data->rkap) * -1 / $pembagi;
			}else {
				$val->data->aggthn = ($val->data->aggthn) / $pembagi;
				$val->data->aggthn1 = ($val->data->aggthn1) / $pembagi;
				$val->data->aggthn2 = ($val->data->aggthn2) / $pembagi;
				$val->data->aggthn3 = ($val->data->aggthn3) / $pembagi;
				$val->data->rkap = ($val->data->rkap) / $pembagi;
				$val->data->deviasi = ($val->data->deviasi) / $pembagi;
			}
			$val->data->growthpsn = $this->rumusGrowth($val->data->rkap, $val->data->aggthn2);
			$val->data->growthpsn2 = $this->rumusGrowth($val->data->aggthn2, $val->data->aggthn1);
			$val->data->deviasi = $val->data->aggthn3 - $val->data->rkap;
			{
				$val->data->aggthn = round($val->data->aggthn);
				$val->data->aggthn1 = round($val->data->aggthn1);
				$val->data->aggthn2 = round($val->data->aggthn2);
				$val->data->aggthn3 = round($val->data->aggthn3);
				$val->data->rkap = round($val->data->rkap);
				$val->data->deviasi = round($val->data->deviasi);
			}
			if ($val->data->kode_neraca == $neraca){
				$result["rs"]["rows"][] = (array) $val->data;
				$this->collectData = true;
			}else if (!isset($neraca))
				$result["rs"]["rows"][] = (array) $val->data;
			else if ($this->collectData){
				if ($val->data->kode_induk == "00")
					$this->collectData = false;
				else $result["rs"]["rows"][] = (array) $val->data;
			}
			$this->generateResultRKM($val, $result, $neraca, $pembagi);
		}
	}

	function getDataTemplateBPC($model, $periode, $divisi = null, $pembagi = 1000000000){
		//if ($ubis == $this->lokasiNas) $ubis = '';
		if ($ubis == "")
			$ubis = $this->kode_ubis;
 		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		if ($ada){
			$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
		}else if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		else $filter = " and z.kode_ubis like '$ubis%' ";
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
				   from exs_masakun a
					left outer join (
							select a.kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as aggsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as aggbln
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by a.kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actall ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsd,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter  group by a.kode_akun, tahun ) c on c.kode_akun = a.kode_akun

					left outer join (
							select a.kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthn ,
												sum(case '$bln' when '01' then jan
														 when '02' then (jan + feb  )
														 when '03' then (jan + feb + mar  )
														 when '04' then (jan + feb + mar + apr  )
														 when '05' then (jan + feb + mar + apr + mei )
														 when '06' then (jan + feb + mar + apr + mei + jun  )
														 when '07' then (jan + feb + mar + apr + mei + jun + jul )
														 when '08' then (jan + feb + mar + apr + mei + jun + jul + aug )
														 when '09' then (jan + feb + mar + apr + mei + jun + jul + aug + sep )
														 when '10' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt )
														 when '11' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop )
														 when '12' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des)
												end) as actsdlalu,
												sum(case '$bln' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn2' and a.jenis = 'S' $filter group by a.kode_akun, tahun ) d on  d.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
												sum(case '$bln2' when '01' then jan
														 when '02' then feb
														 when '03' then MAR
														 when '04' then APR
														 when '05' then MEI
														 when '06' then jun
														 when '07' then jul
														 when '08' then aug
														 when '09' then sep
														 when '10' then okt
														 when '11' then nop
														 when '12' then des
												end) as actblnlalu
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn3' and a.jenis = 'S' $filter   group by a.kode_akun, tahun ) e on  e.kode_akun = a.kode_akun
				 ";
		$sql2 = "select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, round(case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end,0) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, round(case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end,0 ) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, round(case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end,0) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, round(case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end,0)  as ytdpsn
												, round(case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end,0) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)/ $pembagi) as aggthn, sum(nvl(aggbln,0) / $pembagi) as aggbln, sum(nvl(aggsd,0)/ $pembagi) as aggsd,
																sum(nvl(actbln,0)/ $pembagi) as actbln, sum(nvl(actsd,0)/ $pembagi) as actsd, sum(nvl(actblnlalu,0)/ $pembagi) as actblnlalu, sum(nvl(actall,0)/ $pembagi) as actall, sum(nvl(trend,0)/ $pembagi) as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){

			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summaries($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $val->data->aggthn;
						$nodeHeader->data->aggbln += $val->data->aggbln;
						$nodeHeader->data->trend += $val->data->trend;
						$nodeHeader->data->aggsd += $val->data->aggsd;
						$nodeHeader->data->actbln += $val->data->actbln;
						$nodeHeader->data->actsd += $val->data->actsd;
						$nodeHeader->data->actblnlalu += $val->data->actblnlalu;
						//$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResult($rootNode, $result, $neraca);
		return json_encode($result);
	}
	//** simulasi BPC
	function getDataSimulasiSIBPC($model, $periode, $ubis = null, $pembagi = 1000000000){
		//if ($ubis == $this->lokasiNas) $ubis = '';
		if ($ubis == "")
			$ubis = $this->kode_ubis;
 		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		if ($ada){
			$filter = " and c.kode_ubis in (select kode_ubis from exs_grouping_ubis where group_ubis='$ubis') ";
		}else if (strlen($ubis) == 7)
			$filter = " and a.kode_cc like '$ubis%' ";
		else if ($this->isGubis($ubis)){
			$filter = " and z.kode_induk like '$ubis%' ";
			$filter2 = " where z.kode_ubis like '$ubis%'";
			$filter3 = " where z.kode_induk like '$ubis%'";
		}else {
			$filter = " and z.kode_ubis like '$ubis%' ";
			$filter2 = " where z.kode_ubis in (select kode_induk from exs_ubis where kode_ubis like  '$ubis%')";
			$filter3 = " where z.kode_ubis like '$ubis%'";
		}
		$sql = "select a.kode_rkm, '$thn1' as tahun,  c.aggthn as rkap
				   from bpc_rkm a
					left outer join (
							select a.kode_rkm,
									sum(case when tahun = '$thn1' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) else 0 end) as aggthn

								from bpc_mbudget_rkm a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									inner join bpc_rkm c on c.kode_rkm = a.kode_rkm
									inner join bpc_si d on d.kode_si = c.kode_program
									where tahun = '$thn1'  $filter
									group by a.kode_rkm  ) c on c.kode_rkm = a.kode_rkm
					 ";
		$sql2 = "select distinct a.kode_si as kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,'-' as jenis_akun, '-' as sum_header, a.level_spasi, a.kode_induk, a.rowindex, a.lineindex, a.ix
												, 0 as aggthn, 0 as aggthn1, 0 as aggthn2,0 as aggthn3, 0 - nvl(y.rkap,0) as deviasi, nvl(y.rkap,0) as rkap
												, 'change' as ubah
				from (select kode_si, nama, tipe, rowindex, kode_induk, level_spasi, level_spasi as lineindex, ROWNUM as ix
						from bpc_si where tipe <> 'PROGRAM'
						union
						select a.kode_si, concat(a.kode_si, concat('-',a.nama)), a.tipe, a.rowindex , a.kode_induk, a.level_spasi,a.level_spasi, a.rowindex +  ROWNUM
						from bpc_si a
							inner join exs_ubis z on z.kode_ubis = a.kode_ubis
							 where a.tipe = 'PROGRAM'
						union
						select kode_rkm, concat(kode_rkm,concat('-',a.nama)) as nama, 'RKM' as tipe, b.rowindex, a.kode_program, b.level_spasi + 1, b.level_spasi + 1, b.rowindex + ROWNUM
						from bpc_rkm a
							inner join bpc_si b on b.kode_si = a.kode_program
							inner join exs_ubis z on z.kode_ubis = a.kode_ubis
				) a
				left outer join ($sql) y on y.kode_rkm = a.kode_si
			   order by  rowindex, lineindex, kode_si ";
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){

			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesRKM($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $val->data->aggthn;
						$nodeHeader->data->aggthn1 += $val->data->aggthn1;
						$nodeHeader->data->aggthn2 += $val->data->aggthn2;
						$nodeHeader->data->aggthn3 += $val->data->aggthn3;
						$nodeHeader->data->rkap += $val->data->rkap;

					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultRKM($rootNode, $result, $neraca, $pembagi);
		return ($result);
	}
	function getDataSimulasiBPC($model, $periode, $ubis = null, $pembagi = 1000000000){
		if ($ubis == $this->lokasiNas || $ubis === "undefined") $ubis = '';
		//if ($ubis == $this->lokasiNas) $ubis = '';
		if ($ubis == "")
			$ubis = $this->kode_ubis;
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);

		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		$rs = $this->dbLib->execute("select kode_ubis from exs_grouping_ubis where group_ubis = '$ubis'");
		$ada = false;
		while ($row = $rs->FetchNextObject()){
			$ada = true;
		}
		if ($ada){
			$filter = " and " . $this->getFilterUbis("z",$ubis, $lokasi);
		}else if (substr($ubis,0,5) == "FINOP")
			$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
		else if (strlen($ubis) == 7)
			$filter = " and a.kode_cc like '$ubis%' ";
		else if ($this->isGubis($ubis))
			$filter = " and z.kode_induk like '$ubis%' ";
		else $filter = " and z.kode_ubis like '$ubis%' ";
		$sql = "select a.kode_akun, '$thn1' as tahun, b.aggthn, b.aggthn1,b.aggthn2, c.aggthn as rkap
				   from exs_masakun a
					left outer join (
							select a.kode_akun,
									sum(case when tahun = '$thn1' - 1 then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) else 0 end) as aggthn ,
									sum(case when tahun = '$thn1' - 2 then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) else 0 end) as aggthn1 ,
									sum(case when tahun = '$thn1' - 3 then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) else 0 end) as aggthn2
								from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun between '$thn1' - 3 and '$thn1' - 1 and a.jenis = 'S' $filter group by a.kode_akun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select a.kode_akun,
									sum(case when tahun = '$thn1' then (jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) else 0 end) as aggthn

								from bpc_mbudget_rkm a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' and a.jenis = 'S' $filter group by a.kode_akun  ) c on c.kode_akun = a.kode_akun
					 ";
		$sql2 = "select distinct a.kode_neraca, left_pad(a.nama,a.level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggthn1,0) ) as aggthn1,( nvl(b.aggthn2,0) ) as aggthn2
												,nvl(c.nilai * 1000000000,0) as aggthn3, ( nvl(c.nilai * 1000000000,0) - nvl(b.rkap,0) ) as deviasi, nvl(b.rkap,0) as rkap
												, 'change' as ubah
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) as aggthn,sum(nvl(aggthn1,0)) as aggthn1,sum(nvl(aggthn2,0)) as aggthn2
															,0 as aggthn3, sum(nvl(rkap,0)) as rkap
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
										left outer join bpc_penetapan c on c.kode_neraca = a.kode_neraca and c.tahun = '$thn1' and c.kode_ubis = 'NAS'
									where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){

			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesRKM($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						$nodeHeader->data->aggthn += $val->data->aggthn;
						$nodeHeader->data->aggthn1 += $val->data->aggthn1;
						$nodeHeader->data->aggthn2 += $val->data->aggthn2;
						$nodeHeader->data->aggthn3 += $val->data->aggthn3;
						$nodeHeader->data->rkap += $val->data->rkap;

					}
				}
			}
		}
		//perlu hitung ke summary
		$dataSI = $this->getDataSimulasiSIBPC($model, $periode, $ubis, $pembagi);
		$result = array('rs' => array('rows' => array() ), "si" => $dataSI );
		$this->generateResultRKM($rootNode, $result, $neraca, $pembagi);
		//error_log(json_encode($result["rs"]["rows"]));
		return json_encode($result);
	}
	/**
	 * getDataJejerAggRKAP function.
	 * digunakan untuk mendapatkan jejer anggaran per bulan
	 * @access public
	 * @param mixed $model		: model report
	 * @param mixed $periode	: periode report
	 * @param mixed $ubis (default: null)	: filter divisi
	 * @param int $pembagi (default: 1000000000)	: nilai pembagi untuk satuan milliar, juta, ribu, atau mutlak
	 * @return void
	 */
	function getDataJejerAggRKAP($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		if ($ubis == null || $ubis == "" || $ubis == $this->lokasiNas) {
			$ubis = "";
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where level_spasi = '1' order by rowindex");
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$field .= ", 0  as $row->kode_ubis";
				$sql = " select x.kode_neraca, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
							from exs_relakun x
							inner join bpc_mbudget_rkm y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
							inner join exs_cc z on z.kode_cc = y.kode_cc
							inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_induk = '$row->kode_ubis'
							where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
				$rs = $this->dbLib->execute($sql);
				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
				}
				$dataUbis->set($row->kode_ubis, $itemUbis);
			}
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,a.level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, nvl(c.nilai, 0) as penetapan, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
											from EXS_NERACA a
											left outer join (select x.kode_neraca,sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
															from exs_relakun x
															inner join bpc_mbudget_rkm y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
															inner join exs_cc z on z.kode_cc = y.kode_cc
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
											left outer join bpc_penetapan c on c.kode_neraca = a.kode_neraca and c.tahun = '$thn1' and c.kode_ubis = 'NAS'
										where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		}else{
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where kode_induk = '$ubis' order by rowindex");
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$field .= ", 0  as $row->kode_ubis";
				$sql = " select x.kode_neraca, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
							from exs_relakun x
							inner join bpc_mbudget_rkm y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis = 'S'
							inner join exs_cc z on z.kode_cc = y.kode_cc
							inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_ubis = '$row->kode_ubis'
							where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca";
				$rs = $this->dbLib->execute($sql);
				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_neraca, $line->aggthn/ $pembagi);
				}
				$dataUbis->set($row->kode_ubis, $itemUbis);
			}
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,a.level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, nvl(c.nilai, 0) as penetapan, (nvl(b.aggthn,0))/ $pembagi  as aggthn $field
											from EXS_NERACA a
											left outer join (select x.kode_neraca,sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as aggthn
															from exs_relakun x
															inner join bpc_mbudget_rkm y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
															inner join exs_cc z on z.kode_cc = y.kode_cc
															inner join exs_ubis w on w.kode_ubis = z.kode_ubis and w.kode_induk = '$ubis'
															where x.kode_fs = '$model'  and x.kode_lokasi = '$this->lokasi' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
											left outer join bpc_penetapan c on c.kode_neraca = a.kode_neraca and c.tahun = '$thn1' and c.kode_ubis = '$ubis'
										where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");

		}

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			if ($row->jenis_akun == "PENDAPATAN"){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca) * -1;");
				}
				$row->penetapan = $row->penetapan * -1;
				$row->aggthn = $row->aggthn * -1;
			}else {
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
				}
			}
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejer($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);


	}
	function summariesJejerRKAP(&$item){
		foreach ($item->childs as $val){
			if (!isset($item->checkingSummary)) {
				$item->checkingSummary = true;
				foreach ($item->dataArray as $key => $value) {
					if ($key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						if (floatVal($value) != 0)
							$item->checkingSummary = false;
					}
				}
			}
			if ($item->checkingSummary){
				$this->summariesJejerRKAP($val);
				foreach ($val->dataArray as $key => $value) {
					if ($key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$item->dataArray[$key] += $value;
					}
				}
			}
			if ($val->data->sum_header != "-") {
				$sumheader = explode(",",$val->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "jenis_akun" && $key != "kode_induk" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
							{
								$nodeHeader->dataArray[$key] += $value;
							}
						}
					}
				}
			}

		}
	}
	function getDataJejerPenetapan($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		//if ($ubis == $this->lokasiNas) $ubis = '';
		if ($ubis == "")
			$ubis = $this->kode_ubis;
		if ($ubis == null || $ubis == "" || $ubis == $this->lokasiNas) {
			$ubis = "";
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where level_spasi = '1' order by rowindex");
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$field .= ", 0  as $row->kode_ubis";
				$sql = " select c.kode_neraca, c.nilai as aggthn
							from bpc_penetapan c
							where c.tahun = '$thn1' and c.kode_ubis = '$row->kode_ubis' ";
				$rs = $this->dbLib->execute($sql);
				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_neraca, $line->aggthn );
				}
				$dataUbis->set($row->kode_ubis, $itemUbis);
			}
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,a.level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, nvl(c.nilai, 0)  as aggthn $field
											from EXS_NERACA a
											left outer join bpc_penetapan c on c.kode_neraca = a.kode_neraca and c.tahun = '$thn1' and c.kode_ubis = 'NAS'
										where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");
		}else{
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis,nama,rowindex from exs_ubis where kode_induk = '$ubis' order by rowindex");
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$field .= ", 0  as $row->kode_ubis";
				$sql = " select c.kode_neraca, c.nilai as aggthn
							from bpc_penetapan c
							where c.tahun = '$thn1' and c.kode_ubis = '$row->kode_ubis' ";
				$rs = $this->dbLib->execute($sql);
				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_neraca, $line->aggthn );
				}
				$dataUbis->set($row->kode_ubis, $itemUbis);
			}
			$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,a.level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, nvl(c.nilai, 0) as aggthn, 0 as total, 0 as selisih $field
											from EXS_NERACA a
											left outer join bpc_penetapan c on c.kode_neraca = a.kode_neraca and c.tahun = '$thn1' and c.kode_ubis = '$ubis'
										where a.kode_fs = '$model'  and a.kode_lokasi = '$this->lokasi' order by  rowindex");

		}

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		while ($row = $rs->FetchNextObject(false)){
			if ($row->jenis_akun == "PENDAPATAN"){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca) * -1;");
					eval ("\$row->total += \$itemUbis->get(\$row->kode_neraca) * -1;");
				}
				$row->penetapan = $row->penetapan * -1;
				$row->aggthn = $row->aggthn * -1;

			}else {
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
					eval ("\$row->total += \$itemUbis->get(\$row->kode_neraca);");
				}
			}
			$row->selisih = $row->aggthn - $row->total;
			if ($node == ""){
				$node = new server_util_NodeNRC($rootNode);
			}else if ($node->level == floatval($row->level_spasi) - 1 ){
				$node = new server_util_NodeNRC($node);
			}else if ($node->level == floatval($row->level_spasi) ){
				$node = new server_util_NodeNRC($node->owner);
			}else if ($node->level > floatval($row->level_spasi) ){
				while ($node->owner != $rootNode && $node->level > floatval($row->level_spasi) ) {
					$node = $node->owner;
				}
				$node = new server_util_NodeNRC($node->owner);
			}
			$node->setData($row);
			if ($row->tipe == "SUMMARY")
				$this->sumHeader->set($row->kode_neraca, $node);

		}
		//error_log($this->sumHeader->getLength());
		foreach ($rootNode->childs as $key => $val){
			$this->summariesJejerRKAP($val);
			if ($val->data->sum_header != "-"){
				$summaryHeader = explode(",",$val->data->sum_header);

				foreach ($summaryHeader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejer($rootNode, $result);
		return json_encode($result);


	}
    function getDataAkunCFU($induk,$model, $periode, $pembagi){
        global $satuan;
		//$this->getDB();
		//$this->dbLib = $this->db;
		if (!isset($pembagi)) $pembagi = 1000000000;
		$satuan = $pembagi;
        $lokasi = "00";
		$thn1 = substr($periode,0,4);
        $bln = substr($periode,4,2);
		///$thn2 = floatval(substr($periode,0,4)) - 1;
        
            $ubis = "";
			$rsUbis = $this->dbLib->execute("select kode_cfu, nama, kode_lokasi, kode_ubis, rowindex, level_spasi from bpc_cfu where kode_induk = '$induk'  order by rowindex");
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$field .= ", 0  as ". $row->kode_cfu. ", 0  as actsd_". $row->kode_cfu. "";
                $sql = " select x.kode_akun,  nvl(v.nilai, 0) as actsd
							from bpc_relakun x
                            left outer join (select x.kode_akun
                                                                            , sum(nvl(case when t.periode <= '$periode' then t.nilai else 0 end,0)) as actsd
                                                                            , sum(nvl(case when t.periode = '$periode' then t.nilai else 0 end,0)) as actcm
                                                                    from bpc_relakun x
                                                                    inner join bpc_sap_tb t on t.kode_akun = x.kode_akun  and t.periode like '".$thn1."%' and t.jenis = 'TB'
                                                                    inner join bpc_cfu z on t.kode_cfu = z.kode_cfu 
                                                                    where x.kode_fs = '$model' and x.kode_lokasi = '$lokasi' and z.kode_cfu = '$row->kode_cfu' group by x.kode_akun
                                                                ) t on t.kode_akun = d.kode_akun
                            where x.kode_fs = '$model' and x.kode_lokasi = '$lokasi' ";
                //error_log($sql);
				
                $rs = $this->dbLib->execute($sql);
				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_akun, $line);
				}
				$dataUbis->set($row->kode_cfu, $itemUbis);
			}
            if ($induk != "CFU0"){
                $join1 = "inner join bpc_cfu t on t.kode_lokasi = z.kode_lokasi and ( t.kode_induk = '$induk' ) ";
                $join2 = "inner join bpc_ubis u on u.kode_ubis = y.kode_ubis and u.kode_lokasi = t.kode_lokasi
	                                                           and (u.kode_induk = t.kode_ubis  or u.kode_ubis in (select a.kode_ubis from bpc_ubis a inner join bpc_ubis b on b.kode_ubis = a.kode_induk and b.kode_lokasi = a.kode_lokasi where b.kode_induk = t.kode_ubis and b.kode_lokasi = t.kode_lokasi))";
            }else {
                //$join1 = "";
                $join1 = "inner join bpc_cfu t on t.kode_lokasi = z.kode_lokasi and not kode_cfu in ('CFUE','CFU40C','CFU205')  ";
                $join2 = "inner join bpc_ubis u on u.kode_ubis = y.kode_ubis and u.kode_lokasi = t.kode_lokasi
	                                                           and (u.kode_induk = t.kode_ubis  or u.kode_ubis in (select a.kode_ubis from bpc_ubis a inner join bpc_ubis b on b.kode_ubis = a.kode_induk and b.kode_lokasi = a.kode_lokasi where b.kode_induk = t.kode_ubis and b.kode_lokasi = t.kode_lokasi))";
                //$join2 = "left outer join bpc_ubis u on u.kode_ubis = y.kode_ubis and u.kode_lokasi = y.kode_lokasi";
            }
        
            $sql = "select distinct a.kode_neraca, d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, nvl(t.actsd,0) as actsd
                                                     $field
											from bpc_neraca a
                                            inner join bpc_relakun e on e.kode_neraca = a.kode_neraca and e.kode_fs = a.kode_fs and e.kode_lokasi = a.kode_lokasi
										    inner join bpc_masakun d on d.kode_akun = e.kode_akun and d.kode_lokasi = e.kode_lokasi
											left outer join (select x.kode_akun
                                                                            , sum(nvl(case when t.periode <= '$periode' then t.nilai else 0 end,0)) as actsd
                                                                            , sum(nvl(case when t.periode = '$periode' then t.nilai else 0 end,0)) as actcm
                                                                    from bpc_relakun x
                                                                    inner join bpc_sap_tb t on t.kode_akun = x.kode_akun and t.jenis = 'TB' and t.periode like '".$thn1."%' and t.jenis = 'TB'
                                                                    inner join bpc_cfu z on t.kode_cfu = z.kode_cfu 
                                                                    where x.kode_fs = '$model' and x.kode_lokasi = '$lokasi' and z.kode_induk = '$induk' group by x.kode_akun
                                                                ) t on t.kode_akun = d.kode_akun
                                            
										where a.kode_fs = '$model' and a.kode_lokasi = '$lokasi' order by a.kode_neraca, d.kode_akun ";
            //error_log($sql);
            $rs = $this->dbLib->execute($sql);
        
        $dataAkun = new server_util_Map();
		$kode_neraca = "";
		$collectData = false;

		while ($row = $rs->FetchNextObject(false)){
			if ($kode_neraca != $row->kode_neraca){
				if ($kode_neraca != ""){
					$dataAkun->set($kode_neraca, $item );
				}
				$item = new server_util_arrayList();
				$kode_neraca = $row->kode_neraca;
			}
			$row2 = new server_util_Map();
			$row2->set("kode_akun", $row->kode_akun);
			$row2->set("nama", $row->nama);
            $row2->set("kode_neraca", $row->kode_akun);
			$row2->set("level_spasi", floatval($row->level_spasi) + 1);
			$row2->set("jenis_akun", strtoupper($row->jenis_akun) );
			
            if ($row->jenis_akun == "PENDAPATAN"){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
                    $tmp = $itemUbis->get($row->kode_akun);
					$row2->set($key, $tmp->aggsd * -1 / $pembagi) ;
                    $row2->set("actsd_$key", $tmp->actsd / $pembagi);
				}
				$row2->set("aggsd",$row->aggsd * -1 / $pembagi );
                $row2->set("actsd",$row->actsd / $pembagi );
			}else {
				foreach ($dataUbis->getArray() as $key => $itemUbis){
                    $tmp = $itemUbis->get($row->kode_akun);
					$row2->set($key, $tmp->aggsd / $pembagi);
                    $row2->set("actsd_$key", $tmp->actsd / $pembagi);
				}
                $row2->set("aggsd",$row->aggsd / $pembagi );
                $row2->set("actsd",$row->actsd / $pembagi );
			}
            $item->add($row2);
			/*if ($row->kode_neraca == $kode_neraca){
				$item->add($row2);
				$collectData = true;
			}else if (!isset($kode_neraca) || $kode_neraca == "")
				$item->add($row2);
			else if ($this->collectData){
				if ($row->kode_induk == "00")
					$collectData = false;
				else $item->add($row2);
			}*/

		}
        error_log($pembagi);
		if ($kode_neraca != "")
			$dataAkun->set($kode_neraca, $item );
		return $dataAkun;
        
    }
	function downloadROWDataCFU($induk, $model, $periode, $tipe, $pembagi){
		//$this->getDb();
		
		
		//$this->cleanUp();
		uses("server_modules_codeplex_PHPExcel",false);
		$objPHPExcel = new PHPExcel();
 
 
		// Set document properties
		$objPHPExcel->getProperties()->setCreator("PT TELKOM ")
						 ->setLastModifiedBy("MA")
						 ->setTitle("Template RKAP")
						 ->setSubject("RKAP")
						 ->setDescription("Template RKAP")
						  ->setKeywords("RKAP Template")
							 ->setCategory("RKAP");
 
        $data = $this->getDataEXSUMCFU2($induk, $model, $periode, $tipe, $pembagi);					
		$akun = $this->getDataEXSUMCFU2Akun($induk, $model,$periode, $tipe, $pembagi);
			
		$objPHPExcel->setActiveSheetIndex(0);
		$sheet = $objPHPExcel->getActiveSheet();
		$sharedStyle1 = new PHPExcel_Style();
		$sharedStyle1->applyFromArray(
			array('fill' 	=> array(
										'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
										'color'		=> array('argb' => 'FFCCFFCC')
									),
				  'borders' => array(
										'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
										'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN)
									)
				 ));
		$column = array("Account","Uraian","Tipe","Level","Budget Thn","Prev. Month Actual","CM Budget","CM Actual","CM Achiev","CM Growth","Ytd Prev. year","Ytd Budget","Ytd Actual","Achieve","Growth");
		$col = 0;
		$row = 1;
		foreach ($column as $value){	
			$sheet->setCellValueByColumnAndRow($col, $row, $value);
			$col++;
		}
		$end = PHPExcel_Cell::stringFromColumnIndex($col-1);
		$sheet->setSharedStyle($sharedStyle1,"A1:".$end."1");
		
        
        foreach ($data["rs"]["rows"] as $val){
            $row++;
            $val  = json_decode(json_encode($val));
            $sheet->setCellValueByColumnAndRow(0, $row, $val->kode_neraca);
            $sheet->setCellValueByColumnAndRow(1, $row, str_replace("&nbsp;"," ",$val->nama) );
            $sheet->setCellValueByColumnAndRow(2, $row, $val->jenis);
            $sheet->setCellValueByColumnAndRow(3, $row, $val->level_spasi);
            $sheet->setCellValueByColumnAndRow(4, $row, $val->aggthn);
            $sheet->setCellValueByColumnAndRow(5, $row, $val->actcm_lalu);
            $sheet->setCellValueByColumnAndRow(6, $row, $val->aggcm);
            $sheet->setCellValueByColumnAndRow(7, $row, $val->actcm);
            $sheet->setCellValueByColumnAndRow(8, $row, $val->achiev);
            $sheet->setCellValueByColumnAndRow(9, $row, $val->growth);
            $sheet->setCellValueByColumnAndRow(10, $row, $val->actsd_lalu);
            $sheet->setCellValueByColumnAndRow(11, $row, $val->aggsd);
            $sheet->setCellValueByColumnAndRow(12, $row, $val->actsd);
            $sheet->setCellValueByColumnAndRow(13, $row, $val->achiev2);
            $sheet->setCellValueByColumnAndRow(14, $row, $val->growth2);
            $listAkun = $akun->get($val->kode_neraca);
            $level = $val->level_spasi;
            foreach ($listAkun as $item){
                $row++;
                $val  = json_decode(json_encode($item));
                $sheet->setCellValueByColumnAndRow(0, $row, $val->kode_akun);
                $sheet->setCellValueByColumnAndRow(1, $row, str_replace("&nbsp;"," ",$val->nama) );
                $sheet->setCellValueByColumnAndRow(2, $row, $val->jenis);
                $sheet->setCellValueByColumnAndRow(3, $row, $level + 1);
                $sheet->setCellValueByColumnAndRow(4, $row, $val->aggthn);
                $sheet->setCellValueByColumnAndRow(5, $row, $val->actcm_lalu);
                $sheet->setCellValueByColumnAndRow(6, $row, $val->aggcm);
                $sheet->setCellValueByColumnAndRow(7, $row, $val->actcm);
                $sheet->setCellValueByColumnAndRow(8, $row, $val->achiev);
                $sheet->setCellValueByColumnAndRow(9, $row, $val->growth);
                $sheet->setCellValueByColumnAndRow(10, $row, $val->actsd_lalu);
                $sheet->setCellValueByColumnAndRow(11, $row, $val->aggsd);
                $sheet->setCellValueByColumnAndRow(12, $row, $val->actsd);
                $sheet->setCellValueByColumnAndRow(13, $row, $val->achiev2);
                $sheet->setCellValueByColumnAndRow(14, $row, $val->growth2);
            }
            
        }
 
		// Set active sheet index to the first sheet, so Excel opens this as the first sheet
		$objPHPExcel->setActiveSheetIndex(0);
 
 
		// Save Excel 2007 file
		$namafile = MD5(date("r"));
 		global $serverDir;
 		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save($serverDir . "/tmp/CFU_$namafile.xlsx");
	
 
		return "/tmp/CFU_$namafile.xlsx";
	}
	function getUnconsRoot($compCode){
		$db = $this->dbLib;
		$rs = $db->execute("select kode_ubis from exs_ubis where kode_lokasi ='$compCode' and rowindex = 0");
		if ($row = $rs->FetchNextObject(false)){
			return $row->kode_ubis;
		}else return "";

	}
}
?>