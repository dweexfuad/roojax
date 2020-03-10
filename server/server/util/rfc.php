<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at
*	Contributors
* 			SAI, PT
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");
uses("server_util_arrayList");
uses("server_util_rfcLib");
class server_util_rfc  extends server_BasicObject
{
	protected $options;
	protected $rfc;
	function __construct($options = null)
	{
		parent::__construct();
		$this->options = $options;
	}
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("options", "string",$this->options);
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}

	/**
	 * getSAPInfo function.
	 * untuk informasi Konfigurasi SAP
	 * @access public
	 * @param mixed $login
	 * @return void
	 */
	function getSAPInfo($login){
		$this->rfc = new server_util_rfcLib($this->options);
		$rfc = $this->rfc->login($login->get("user"), $login->get("passwd"));
		if ($rfc){
			$sapImp = new server_util_Map();
			$sapExp = new server_util_arrayList(array("RFCSI_EXPORT"));
			$tmp = $this->rfc->callRFC($login,"RFC_SYSTEM_INFO", $sapImp, null, null, $sapExp, true);
			return $tmp->get("RFCSI_EXPORT");
		}else return "error:RFC connection failed <br>". str_replace("\n","<br>",saprfc_error()) ;
	}

	/**
	 * getPLSAPGL function.
	 * digunakan untuk download data Financial Statement dari SAP
	 * @access public
	 * @param mixed $login	: array berisi informasi login usrname dan password
	 * @param mixed $periode1	: periode report
	 * @param mixed $periode2	: periode pembanding
	 * @param mixed $fs			: versi financial statement yang akan di ambil
	 * @param mixed $ledger		: jenis report ledger (PSAK,IFRS)
	 * @param mixed $ubis		: array berisi filter divisi
	 * @return void
	 */
	function getPLSAPGL ($login, $periode1, $periode2, $fs, $ledger, $ubis){
		try{
			$this->rfc = new server_util_rfcLib($this->options);
			$bln1 = substr($periode1,4,2);
			$bln2 = substr($periode2,4,2);
			$tahun1 = substr($periode1,0,4);
			$tahun2 = substr($periode2,0,4);
			$sapImp = new server_util_Map(array(
									"BUKRS" => "1000" ,
									"COMPARE_PERIO_HIGH" => $bln1,
									"COMPARE_PERIO_LOW" => "01",
									"COMPARE_YEAR" => $tahun1,
									"GSBER_HIGH" => $ubis->get("high") ,
									"GSBER_LOW" => $ubis->get("low"),
									"IM_VERSN" => $fs,
									"KTOPL" => "1000",
									"REPORT_LEDGER" => $ledger,
									"REPORT_PERIO_HIGH" => $bln2,
									"REPORT_PERIO_LOW" => "01",
									"REPORT_YEAR" => $tahun2,
									"SAKNR_HIGH" => "0079999999",
									"SAKNR_LOW" => "0040000000"
									));
			$sapExpTable = new server_util_Map(array("T_OUTTAB"));
			return $this->rfc->callRFC($login,"ZRFC_FIN_STAT_CONTROLING", $sapImp, $sapExpTable, null, null, true);
		}catch(exception $e){
			error_log($e->getMessage());
		}
	}

	/**
	 * getActualSAPGL function.
	 *	digunakan untuk download data aktual/realisasi dari SAP
	 * @param mixed $login	: array berisi informasi login usrname dan password
	 * @param mixed $periode	: periode report
	 * @param mixed $fs			: versi financial statement yang akan di ambil
	 * @param mixed $ledger		: jenis report ledger (PSAK,IFRS)
	 * @param mixed $ubis		: array berisi filter divisi
	 * @return void
	 */
	function getActualSAPGL ($login, $periode, $fs, $ledger, $ubis){
		$this->rfc = new server_util_rfcLib($this->options);
		$sapImp = new server_util_Map(array(
								"BUKRS" => "1000" ,
								"GSBER_HIGH" => $ubis->get("high") ,
								"GSBER_LOW" => $ubis->get("low"),
								"IM_VERSN" => $fs,
								"KTOPL" => "1000",
								"REPORT_LEDGER" => $ledger,
								"REPORT_YEAR" => $periode,
								"SAKNR_HIGH" => "0079999999",
								"SAKNR_LOW" => "0040000000"
								));
		$sapExpTable = new server_util_Map(array("T_OUTTAB"));
		return $this->rfc->callRFC($login,"ZRFC_FIN_STAT_MONTHLY_ACTUAL", $sapImp, $sapExpTable, null, null, true);
	}

	/**
	 * getTBCC function.
	 * digunakan untuk download data aktual dan budget dari SAP
	 * @access public
	 * @param mixed $login	: array berisi informasi login username dan password
	 * @param mixed $tahun	: tahun yang akan diambil
	 * @param mixed $ubis	: filter divisi
	 * @return void
	 */
	function getTBCC($login, $tahun, $ubis){
		$this->rfc = new server_util_rfcLib($this->options);
		$sapImp = new server_util_Map(array(
								"IM_GJAHR" => $tahun ,
								"IM_KOKRS" => "1000",
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
		return $this->rfc->callRFC($login,"ZFMFI_PLAN_ACT_MONTHLY_REPORT", $sapImp, $sapExpTable, $sapImpTable, null, true);
	}

	/**
	 * getAggNewDatel function.
	 * digunakan untuk download data aktual dan budget hanya untuk akun pendapatan dari SAP
	 * @access public
	 * @param mixed $login	: array berisi informasi login username dan password
	 * @param mixed $tahun	: tahun yang akan diambil
	 * @param mixed $ubis	: filter divisi
	 * @return void
	 */
	function getAggNewDatel($login, $tahun, $ubis){
		$this->rfc = new server_util_rfcLib($this->options);
		$sapImp = new server_util_Map(array(
								"IM_GJAHR" => $tahun ,
								"IM_KOKRS" => "1000",
								"IM_VERSN" => "001",
								"IM_RLDNR"	=> "N1"
								));
		$dataAkun = new server_util_arrayList();
		$dataAkun->add(array("SIGN"=>"I","OPTION"=>"BT","LOW"=>"0040000000","HIGH"=>"0049999999"));

		$dataCC = new server_util_arrayList();
		if ($ubis->get("low") == "")
				;
		else if ($ubis->get("high") == "")
			$dataCC->add(array("SIGN"=>"I","OPTION"=>"CP","LOW"=>$ubis->get("low"),"HIGH"=>$ubis->get("high")));
		else
			$dataCC->add(array("SIGN"=>"I","OPTION"=>"BT","LOW"=>$ubis->get("low"),"HIGH"=>$ubis->get("high")));
		$sapExpTable = new server_util_Map(array("T_OUTPUT"));
		$sapImpTable = new server_util_Map(array("IT_PRCTR" => $dataCC,"IT_RACCT" => $dataAkun));
		return $this->rfc->callRFC($login,"ZFMFI_PLAN_ACT_MONTHLY_REPORT", $sapImp, $sapExpTable, $sapImpTable, null, true);
	}

	/**
	 * getGLLI function.
	 * TCODE FBL3N
	 * digunakan untuk melihat rincian data Jurnal
	 * @access public
	 * @param mixed $akun
	 * @param mixed $ubis
	 * @param mixed $periode
	 * @return void
	 */
	function getGLLI($login, $cc, $akun, $ubis, $tgl1 , $tgl2 ){
		$this->rfc = new server_util_rfcLib($this->options);
		$sapImp = new server_util_Map(array(
								"COMPANYCODE" 	=> $cc ,
								"GLACCT" 		=> $akun,
								"GSBER"			=> $ubis,
								"POSTDATE_FROM"	=> $tgl1,
								"POSTDATE_TO"	=> $tgl2,
								"XBLNR"			=> ""

								));
		$sapExpTable = new server_util_Map(array("PARAMETERS","LINEITEMS"));

		return $this->rfc->callRFC($login,"ZRFC_FINEST_GET_GL_LI", $sapImp, $sapExpTable, null, null, true);
	}

	/**
	 * getHRWitel function.
	 * digunakan untuk download data HR per Witel/Akun
	 * @access public
	 * @param mixed $periode
	 * @param mixed $divre
	 * @return void
	 */
	function getHRWitel($login, $bln, $tahun){
		$this->rfc = new server_util_rfcLib($this->options);
		$sapImp = new server_util_Map(array(
								"IM_GJAHR" => $tahun ,
								"IM_MONAT" => $bln
								));
		$sapExpTable = new server_util_Map(array("T_ZECOM_HR"));
		return $this->rfc->callRFC($login,"ZRFC_FINEST_GET_ECOMM_HR", $sapImp, $sapExpTable, null, null, true);
	}
}
?>
