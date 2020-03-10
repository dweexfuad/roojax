<?php
ini_set( 'date.timezone', 'Asia/Jakarta' );
error_reporting (E_ALL & ~E_NOTICE &  ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_STRICT & ~E_WARNING);

$index = $_GET["id"];
switch ($index)
{
	case "bpc":
		$app_class="app_bpcc_app";
		$app_nama="BPC Web Model";
		$app_keterangan="BPC Web Model";
		$app_logo_depan="image/logo/telkomindonesia.png";
		$app_logo_kanan="image/play.png";
		$app_logo_pojok="image/logo/telkom.png";
		$app_logo_main="image/logo/telkomindonesia.png";
	break;
	case "e":
		$app_class="app_dashboard_app";
		$app_nama="DASHBOARD EXECUTIVE SUMMARY";
		$app_keterangan="EXECUTIVE SUMMARY REPORTING TOOLS";
		$app_logo_depan="image/logo/telkomindonesia.png";
		$app_logo_kanan="image/play.png";
		$app_logo_pojok="image/logo/telkom2.png";
		$app_logo_main="image/logo/telkomindonesia.png";
	break;
	case "r":
		$app_class="app_rranew_app";
		$app_nama="Executive Summary";
		$app_keterangan="EXECUTIVE SUMMARY";
		$app_logo_depan="image/logo/telkomindonesia.png";
		$app_logo_kanan="image/play.png";
		$app_logo_pojok="image/logo/telkom.png";
		$app_logo_main="image/logo/telkomindonesia.png";
	break;	
	case "f":
		$app_class="app_fca_app";
		$app_nama="SMART FCA";
		$app_keterangan="SMART FCA";
		$app_logo_depan="image/logo/telkomindonesia.png";
		$app_logo_kanan="image/play.png";
		$app_logo_pojok="image/logo/telkom.png";
		$app_logo_main="image/logo/telkomindonesia.png";
	break;
	// case "m":
	// 	$app_class="app_saku_app";
	// 	$app_nama="MANTIS";
	// 	$app_keterangan="MANTIS";
	// 	$app_logo_depan="image/logo/telkomindonesia.png";
	// 	$app_logo_kanan="image/play.png";
	// 	$app_logo_pojok="image/logo/telkom.png";
	// 	$app_logo_main="image/logo/telkomindonesia.png";
	// break;
	default :
		$app_class="app_saku_app";
		$app_nama="MANTIS";
		$app_keterangan="MANTIS";
		$app_logo_depan="image/logo/telkomindonesia.png";
		$app_logo_kanan="image/play.png";
		$app_logo_pojok="image/logo/telkom.png";
		$app_logo_main="image/logo/telkomindonesia.png";
	break;

}
?>
