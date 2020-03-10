<?php
class server_util_financeLibDatel  extends server_BasicObject
{
	protected $dbLib;
	protected $records;
	protected $thnComp;
	var $collectData;
	function __construct($dbLib)
	{
		parent::__construct();
		global $dbSetting;
		$this->dbLib = $dbLib;
		$this->records = array();

		$this->collectData = false;
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
	function deleteSession($session_id){
		$this->dbLib->execute("delete from exs_process_summakun where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_agg where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_actual where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_exsum where session_id='$session_id'");
		$this->dbLib->execute("delete from exs_process_session where session_id='$session_id'");
	}
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
			 	return round(1 - ($actual - $budget ) / $budget,2) * 100;
			 else if ($actual > 0 )
			 	return round(1 - ($actual - $budget ) / $budget,2) * 100;
			 else if ($actual < 0)
			 	return 0;
			 else return round(1 - ($actual - $budget ) / $budget,2) * 100;
		}else if ($budget == 0){
			if ($actual > 0)
				return 100;
			else return 0;
		}else {
			error_log("Achieve ". $budget .":".$actual);
			return 0;
		}
	}
	function rumusGrowth($current, $previous){
		$current = floatval($current);
		$previous = floatval($previous);
		if ($previous > 0){
			return round($current / $previous - 1,2) * 100;
		}else if ($previous < 0) {
			 if ($current < $previous)
			 	return round((1 - ($current - $previous ) / $previous) - 1,2) * 100;
			 else if ($current > 0 )
			 	return round((1 - ($current - $previous ) / $previous) - 1,2) * 100;
			 else if ($current < 0)
			 	return 0;
			 else return round((1 - ($current - $previous ) / $previous) - 1,2) * 100;
		}else if ($previous == 0){
			if ($current > 0)
				return 100;
			else return -100;
		}else {
			error_log("Growth ". $current .":".$previous);
			return 0;
		}
	}

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
			$val->data->acvpsn = $val->data->aggbln == 0 ? 0 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->acvgap = round($val->data->actbln - $val->data->aggbln);
			$val->data->growthpsn =  $val->data->trend == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
			$val->data->growthgap = round($val->data->actbln - $val->data->trend);

			$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
			$val->data->grwytdpsn = $val->data->actall == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );
			$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);

			$val->data->ytdpsn = $val->data->aggthn == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = $val->data->actall == 0 ? 0 : round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );
			$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);
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
			//if ($val->data->kode_neraca == 'LRU')
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
			}
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
			$val->data->acvpsn = $val->data->aggbln == 0 ? 0 :  round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->acvgap = round($val->data->actbln - $val->data->aggbln);
			$val->data->growthpsn = $val->data->trend == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
			$val->data->growthgap = round($val->data->actbln - $val->data->trend);

			$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
			$val->data->grwytdpsn = $val->data->actall == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );
			$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);

			$val->data->ytdpsn = $val->data->aggthn == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = $val->data->actall ==0 ? 0 : round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );
			$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);

			if (!isset($val->data->ubis) || trim($val->data->ubis) == ''  ){
				if ($val->data->kode_neraca == "AR"){
					$this->nodeExp = $val;
					$this->dataAR = (array) $val->data;
				}
			}else if ($val->data->ubis == "NAS" && $val->data->kode_neraca == "AR"){
				$this->nodeExp = $val;
				$this->dataAR = (array) $val->data;
			}
			$val->data->contrib = $this->nodeExp->data->actsd == 0 ? 0 : round ( ($val->data->actsd / $this->nodeExp->data->actsd)  * 100,1 );
			$val->data->contrib2 = $this->nodeExp->data->actall == 0 ? 0 : round ( ($val->data->actall / $this->nodeExp->data->actall)  * 100,1);

			$result["rs"]["rows"][] = (array) $val->data;
			$this->generateResultRev($val, $result, $nodeExp);
		}
	}
	function summariesJejer(&$item){
		foreach ($item->childs as $val){
			$this->summariesJejer($val);
			foreach ($val->dataArray as $key => $value) {
				if ($key != "kode_neraca" && $key != 'jenis_akun' && $key !='ubis' && $key != 'kode_akun' && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
				{
					$item->dataArray[$key] += $value;
				}
			}

			if ($val->data->sum_header != "-") {
				$sumheader = explode(",",$val->data->sum_header);
				foreach ($sumheader as $header){
					$nodeHeader = $this->sumHeader->get($header);
					if ($nodeHeader){
						foreach ($val->dataArray as $key => $value) {
							if ($key != "kode_neraca" && $key != 'jenis_akun' && $key !='ubis' && $key != 'kode_akun' && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
							{
								$nodeHeader->dataArray[$key] += $value;
							}
						}
					}
				}
			}

		}
	}
	function generateResultJejer($item, &$result){
		foreach ($item->childs as $val){

			if ($val->data->jenis_akun == "PENDAPATAN"){
				foreach ($val->dataArray as $key => $value) {
					if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value) * -1;
					}
				}
			}else {
				foreach ($val->dataArray as $key => $value) {
					if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value);
					}
				}
			}
			$result["rs"]["rows"][] = $val->dataArray;
			$this->generateResultJejer($val, $result);
		}
	}
	function generateResultJejerDatel($item, &$result){
		$allNol = false;
		foreach ($item->childs as $val){

			/*foreach ($val->dataArray as $key => $value) {
				if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
				{
					$val->dataArray[$key] = round($value);
				}
			}*/
			$nonZero = false;
			if ($val->data->jenis_akun == "PENDAPATAN"){
				foreach ($val->dataArray as $key => $value) {
					if ($key != "ubis" && $key != 'jenis_akun' && $key != 'kode_akun' && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value) * -1;
						$nonZero = $nonZero || $value != 0;
					}
				}
			}else {
				foreach ($val->dataArray as $key => $value) {
					if ($key != "ubis" && $key != 'jenis_akun' && $key != 'kode_akun' && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value);
						$nonZero = $nonZero || $value != 0;
					}
				}
			}
			if ($nonZero || $val->dataArray["kode_neraca"] == "EBD")
				$result["rs"]["rows"][] = $val->dataArray;
			$this->generateResultJejerDatel($val, $result);
		}
	}
	function generateResultJejerDatel2($item, &$result){
		$allNol = false;
		foreach ($item->childs as $val){

			/*foreach ($val->dataArray as $key => $value) {
				if ($key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
				{
					$val->dataArray[$key] = round($value);
				}
			}*/
			$nonZero = false;
			if ($val->data->jenis_akun == "PENDAPATAN"){
				foreach ($val->dataArray as $key => $value) {
					if ($key != "ubis" && $key != 'jenis_akun' && $key != 'kode_akun' && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value) * -1;
						$nonZero = $nonZero || $value != 0;
					}
				}
			}else {
				foreach ($val->dataArray as $key => $value) {
					if ($key != "ubis" && $key != 'jenis_akun' && $key != 'kode_akun' && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
					{
						$val->dataArray[$key] = round($value);
						$nonZero = $nonZero || $value != 0;
					}
				}
			}
			//if ($nonZero)
				$result["rs"]["rows"][] = $val->dataArray;
			$this->generateResultJejerDatel2($val, $result);
		}
	}
	function getDataJejerAggDatel($model, $periode, $witel = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$rsUbis = $this->dbLib->execute("select distinct kode_cc, nama from exs_cc where kode_witel like '$witel%' and length(kode_cc) = 9  order by kode_cc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$cc = str_replace("-", "_", $row->kode_cc);
			$field .= ", 0  as $cc";
			$sql = " select x.kode_neraca, sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						where x.kode_fs = '$model' and  y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel = '$row->kode_cc'  )
						 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($cc, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))/$pembagi  as aggthn $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											) as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc

														where x.kode_fs = '$model' and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if($row->kode_neraca == 'EBD') $done = true;
			}

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
		$this->generateResultJejerDatel($rootNode, $result);
		return json_encode($result);

	}
	function getDataJejerActualDatel($model, $periode, $witel = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$rsUbis = $this->dbLib->execute("select kode_cc, nama from exs_cc where kode_witel like '$witel%' and length(kode_cc) = 7 order by kode_cc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as $row->kode_cc";
			$sql = " select x.kode_neraca, sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_cc = '$row->kode_cc'
						where x.kode_fs = '$model' group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($row->kode_cc, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))/$pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_witel like '$witel%' and z.kode_cc like 'T91%'
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex");
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
		$this->generateResultJejerDatel($rootNode, $result);
		return json_encode($result);

	}
	function getDataJejerAggWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
			$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6")
			{//divre
				$rsUbis = $this->dbLib->execute("select distinct a.kode_ubis as kode_witel from exs_ubis a where a.kode_induk like '$ubis%' or a.kode_ubis = '$ubis' order by kode_witel");// where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)

				//select distinct kode_pc from exs_mappc a inner join exs_ubis b on b.kode_ubis = a.kode_witel where b.kode_induk = '$row->kode_witel'
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$row->kode_witel%'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%')  ";


			else
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  ) ";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";

			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}

		$witel = $ubis;
		if ($ubis == "") $ubis = "Telkom Regional";
		if ($divre)
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$witel%'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$witel%')  ";

			else
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
							 						inner join exs_ubis b on b.kode_ubis = a.kode_witel
							 						where a.kode_witel like '%'
							 										and b.kode_induk like '$witel%'
							 					union
							 			select distinct kode_pc from exs_mappc where kode_witel like '$witel%') ";
		$nama = $ubis;
		$rs = $this->dbLib->execute("select nama from exs_ubis where kode_ubis = '$ubis'");
		if ($row = $rs->FetchNextObject(false))
			$nama = $row->nama;
			
		//error_log($filter2);
		$rs = $this->dbLib->execute("select '$ubis' as ubis, '$ubis' as kode_neraca, '$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn $field
				from dual
				union
				select distinct '$ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.aggthn,0))  as aggthn $field
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2 group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  order by  rowindex");

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD') $done = true;
			}

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
							if ($key != 'ubis' && $key != 'jenis_akun' && $key != 'kode_akun'  &&  $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejerDatel($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;
		/*$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$witel' )
					order by kode_ubis");*/
		$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis2 as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like'$witel%' )
					order by a.urut_ubis");

		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			$resConsumer = $this->getDataJejerAggWitelSegmen($model, $periode, $witel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
			if (count($resConsumer["rs"]["rows"]) > 1)
			{
				foreach ($resConsumer["rs"]["rows"] as $val){
					$result["rs"]["rows"][] = $val;
				}
			}
		}
		return json_encode($result);

	}
	function getDataJejerAggWitelSegmen($model, $periode, $ubis = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$divre = false;
		$bln = substr($periode, 4,2);
		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis'  order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6"){//divre//where b.kode_ubis ='$ubis'
				$rsUbis = $this->dbLib->execute("select distinct a.kode_ubis as kode_witel from exs_ubis a where a.kode_induk like '$ubis%' or a.kode_ubis = '$ubis' order by kode_witel");
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$row->kode_witel%' and a.kode_ubis2 = '$kode_ubis'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' and a.kode_ubis2 = '$kode_ubis') ";
			else
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis2 = '$kode_ubis'  ) ";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			/*case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des*/
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";

			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		if ($divre){
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$ubis%' and a.kode_ubis2 = '$kode_ubis'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis2 = '$kode_ubis') ";
		}else {
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
							 						inner join exs_ubis b on b.kode_ubis = a.kode_witel
							 						where a.kode_witel like '%'
							 										and b.kode_induk like '$ubis%' and kode_ubis2 = '$kode_ubis'
							 			union
							 			select distinct kode_pc from exs_mappc where kode_witel like '$ubis%' and kode_ubis2 = '$kode_ubis' )";
		}

		$rs = $this->dbLib->execute("select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '&nbsp;&nbsp;&nbsp;&nbsp;$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as aggthn $field
				from dual
				union
				select distinct '$kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 2) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.aggthn,0))  as aggthn $field
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2 group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD') $done = true;
			}

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
							if ($key != 'ubis' && $key != "jenis_akun" && $key != 'kode_akun'  && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejerDatel($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			//error_log($key);
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;

		return ($result);

	}
	function getDataJejerActualWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$divre = false;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
			$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6")
			{//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis   where kode_induk like '$ubis%' or kode_ubis = '$ubis' order by kode_witel");// where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			//a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as $witel ";
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			//error_log($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		/*
		if ($ubis != ""){
			$field .= ", 0  as total ";
			$filter = "  ";
			if ($divre)
				$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) ) and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
								or 
								(y.kode_akun like '4%' and y.tahun > '2014')
							)";
			else
				$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) ) and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$ubis%'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
								or 
								(y.kode_akun like '4%' and y.tahun > '2014')
							)";

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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set("total", $itemUbis);
		}
		*/
		if($ubis == "") $kode_ubis = "All Divre";
		else if (strlen($ubis) == 2) $kode_ubis = "All Witel";
		else $kode_ubis = $ubis;
		if (!$divre){
			if (substr($ubis,0,2)=="T6" && $ubis != "T6"){//where b.kode_ubis = '$ubis'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													 where b.kode_induk like '$ubis%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%'
												  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";

			}else if (strlen($ubis) == 9) {
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													 where b.kode_induk like '$ubis%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%'
												  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			}else {
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
						
			}
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ('T910','T911')
										union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$nama = $kode_ubis;
		$rs = $this->dbLib->execute("select nama from exs_ubis where kode_ubis = '$kode_ubis'");
		if ($row = $rs->FetchNextObject(false))
			$nama = $row->nama;
		

		$sql = "select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as actsd $field
				from dual
				union 	select distinct '$kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.actsd,0))  as actsd $field
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex";
		//error_log("jejerActualWitel => $sql");
		$rs = $this->dbLib->execute($sql);
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == "EBD") $done = true;
			}
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
							if ($key != "ubis" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejerDatel($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			//error_log($key);
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;
		/*$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$ubis%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like '$ubis%' )
					order by kode_ubis");
		*/
		$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis2 as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					where a.kode_witel like '$ubis%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like '$ubis%' )
					order by a.urut_ubis");

		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			$resConsumer = $this->getDataJejerActualWitelSegmen($model, $periode, $ubis, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
			if (count($resConsumer["rs"]["rows"]) > 1){
				foreach ($resConsumer["rs"]["rows"] as $val){
					$result["rs"]["rows"][] = $val;
				}
			}
		}
		return json_encode($result);

	}
	function getDataJejerActualWitelSegmen($model, $periode, $ubis = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$divre = false;

		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis'  order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6"){//divre//where b.kode_ubis ='$ubis'
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis   where kode_induk like '$ubis%' or kode_ubis = '$ubis' order by kode_witel");
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();

		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where (kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) ) and a.kode_ubis2 = '$kode_ubis')
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis2 = '$kode_ubis'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as $witel ";
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();
			//error_log($sql);
			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		/*
		if ($ubis != ""){
			$field .= ", 0  as total ";
			$filter = "  ";
			$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$ubis%' and kode_ubis = '$kode_ubis' )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
								or 
								(y.kode_akun like '4%' and y.tahun > '2014')
							)";

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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set("total", $itemUbis);
		}
		*/
		if (!$divre)
			if (substr($ubis,0,2)=="T6")
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
												 where  a.kode_ubis2 = '$kode_ubis' and b.kode_induk like '$ubis%' 
									union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis2 = '$kode_ubis' 
									 )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis2 = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
						)";
		else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911') and a.kode_ubis2 = '$kode_ubis'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' and a.kode_ubis2 = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$sql = "select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '&nbsp;&nbsp;&nbsp;&nbsp;$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as actsd $field
				from dual
				union
				select distinct '$kode_ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi + 2) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.actsd,0))  as actsd $field
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex";
		//error_log("jejerActualWitelSegmen => $sql");
		$rs = $this->dbLib->execute($sql);
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("	\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
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
				if ($row->kode_neraca == "EBD") $done = true;
			}
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
		$this->generateResultJejerDatel($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			//error_log($key);
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;
		return ($result);

	}
	/******** detail Akun untuk *******/
	function getDataAkunJejerAggWitelDetail($model, $periode, $ubis = null, $neraca = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$witel = $ubis;
		$tmp = explode(";", $neraca);
		$ubisNrc = $tmp[0];
		$neraca = $tmp[1];
		$result = array("rs" => array("rows" => array()));

		if ($ubisNrc == "Telkom Regional"){
			if (strlen($ubis) == 9){
				$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

			}else if ($ubis == ""){
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
				$divre = true;
			}else {
				//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
				if (substr($ubis,0,2) == "T6"){//divre
					$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");//where b.kode_ubis ='$ubis'
					$divre = false;
				}else{ //data DTT DTB namplinin divre
					$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
					$divre = true;
				}

			}
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$filter = "  ";

				if ($divre)
					$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
								 and y.kode_cc in (select distinct kode_pc from exs_mappc a inner join exs_ubis b on b.kode_ubis = a.kode_witel where b.kode_induk = '$row->kode_witel' )  
								 and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 )
								 ";

				else
					$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
								 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  ) 
								 and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 )";

				$witel = str_replace("-", "_", $row->kode_witel);
				$field .= ", 0  as \"$witel\" ";
				$sql = " select x.kode_neraca,x.kode_akun, case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end *
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
													end)/$pembagi as agg
							from exs_relakun x
							inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
							inner join exs_cc z on z.kode_cc = y.kode_cc $filter
							inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
							where x.kode_fs = '$model' and x.kode_neraca = '$neraca' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";

				$rs = $this->dbLib->execute($sql);

				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_akun, $line->agg);
				}
				$dataUbis->set($witel, $itemUbis);
			}

			$witel = $ubis;
			if ($ubis == "") $ubis = "Telkom Regional";
			if ($divre)
					$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
								 and y.kode_cc in (select distinct kode_pc from exs_mappc a
														inner join exs_ubis b on b.kode_ubis = a.kode_witel
														 where b.kode_induk like '$witel%'
													union
													select distinct kode_pc from exs_mappc a where kode_witel like '$witel%' 
												) 
								and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 ) ";

				else
					$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
								 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$witel%'  ) 
								 and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 )";


			$rs = $this->dbLib->execute("select distinct '$ubis' as ubis, a.kode_neraca, c.kode_akun,c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
													, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.aggthn,0))  as aggthn $field
											from EXS_NERACA a
											inner join (select x.kode_neraca, x.kode_akun, sum(case '$bln' when '01' then jan
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
													end)/$pembagi as aggthn
															from exs_relakun x
															inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
															inner join exs_cc z on z.kode_cc = y.kode_cc
															where x.kode_fs = '$model' $filter2
															group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
										where a.kode_fs = '$model' and x.kode_neraca = '$neraca' order by  rowindex,kode_induk, kode_akun");
			while ($row = $rs->FetchNextObject(false)){
				$result["rs"]["rows"][] = (array) $row;
			}

		}else {
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis2 as kode_ubis from exs_mappc a
						inner join exs_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$witel' )
							and a.kode_ubis2 = '$ubisNrc'
						order by kode_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{
				$result = $this->getDataAkunJejerAggWitelSegmenDetail($model, $periode, $witel,$neraca, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);

			}
		}




		return json_encode($result);

	}
	function getDataAkunJejerAggWitelSegmenDetail($model, $periode, $ubis = null, $neraca = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$tmp = explode(";", $neraca);

		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
			$divre = true;
		}else {
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
			if (substr($ubis,0,2) == "T6"){//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");//where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
				$divre = true;
			}

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a inner join exs_ubis b on b.kode_ubis = a.kode_witel where b.kode_induk = '$row->kode_witel' and a.kode_ubis = '$kode_ubis') 
						and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 )";
			else
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis = '$kode_ubis'  ) 
						and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 )";
			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			$sql = " select x.kode_neraca,x.kode_akun,case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum(case '$bln' when '01' then jan
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model' and x.kode_neraca = '$neraca' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";

			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		if ($divre){
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
											inner join exs_ubis b on b.kode_ubis = a.kode_witel 
											where b.kode_induk like '$ubis%' and a.kode_ubis2 = '$kode_ubis'
											union
											select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis2 = '$kode_ubis' 
										)
						and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 ) ";
		}else {
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis2 = '$kode_ubis' )
						and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								 )";
		}
		$rs = $this->dbLib->execute("select distinct '$kode_ubis' as ubis, a.kode_neraca, c.kode_akun, c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.aggthn,0))  as aggthn $field
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model' and x.kode_neraca = '$neraca' order by  rowindex");

			while ($row = $rs->FetchNextObject(false)){
				$result["rs"]["rows"][] = (array) $row;
			}

				//perlu hitung ke summary
		return ($result);

	}
	function getDataAkunJejerActualWitelDetail($model, $periode, $ubis = null, $neraca = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$witel = $ubis;
		$bln = substr($periode,4,2);
		$divre = false;
		$ubisNrc = $tmp[0];
		$neraca = $tmp[1];
		$result = array("rs" => array("rows" => array()));

		if ($ubisNrc == "Telkom Regional"){
			if (strlen($ubis) == 9){
				$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

			}else if ($ubis == ""){
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
				$divre = true;
			}else {
				//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
				if (substr($ubis,0,2) == "T6"){//divre
					$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");//where b.kode_ubis ='$ubis'
					$divre = false;
				}else{ //data DTT DTB namplinin divre
					$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
					$divre = true;
				}

			}
			$sql = "";
			$field = "";
			$dataUbis = new server_util_Map();
			while ($row = $rsUbis->FetchNextObject(false)){
				$filter = "  ";
				if ($divre)
					$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
							and y.kode_cc in (select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) )
							and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
									
								)";
				else $filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
									and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  )
							and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
									
								)";
				$witel = str_replace("-", "_", $row->kode_witel);
				$field .= ", 0  as \"$witel\" ";
				$sql = " select x.kode_neraca,x.kode_akun, case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum(
								case '$bln' when '01' then jan
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
													end )/$pembagi as agg
							from exs_relakun x
							inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
							inner join exs_cc z on z.kode_cc = y.kode_cc $filter
							inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
							where x.kode_fs = '$model' and x.kode_neraca = '$neraca' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";
				//error_log($sql);
				$rs = $this->dbLib->execute($sql);

				$itemUbis = new server_util_Map();

				while ($line = $rs->FetchNextObject(false)){
					$itemUbis->set($line->kode_akun, $line->agg);
				}
				$dataUbis->set($witel, $itemUbis);
			}

			$witel = $ubis;
			if ($ubis == "") $ubis = "All Divre";
			if (!$divre){
				if (substr($ubis,0,2)=="T6"){// where b.kode_ubis = '$witel'
					$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
														inner join exs_ubis b on b.kode_ubis = a.kode_witel
														where b.kode_induk like '$witel%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$witel%'
													 )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";

				}else
					$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			} else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
														inner join exs_divre b on b.witel = a.kode_witel
														inner join exs_ubis c on c.kode_ubis = b.kode_ubis
													 where c.kode_induk in ( 'T910','T911' )
										union
									  select distinct kode_pc from exs_mappc a where kode_witel like 'T6%')
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			$rs = $this->dbLib->execute("select distinct '$ubis' as ubis, a.kode_neraca, c.kode_akun,c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
													, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.actsd,0))  as actsd $field
											from EXS_NERACA a
											inner join (select x.kode_neraca, x.kode_akun, sum(case '$bln' when '01' then jan
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
													end)/$pembagi as actsd
															from exs_relakun x
															inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
															inner join exs_cc z on z.kode_cc = y.kode_cc
															where x.kode_fs = '$model' $filter2
															group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
										where a.kode_fs = '$model' and x.kode_neraca = '$neraca' order by  rowindex,kode_induk, kode_akun");
			while ($row = $rs->FetchNextObject(false)){
				$result["rs"]["rows"][] = (array) $row;
			}
		}else {
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis2 as kode_ubis from exs_mappc a
						inner join exs_ubis b on b.kode_ubis = a.kode_ubis
						where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like '$witel%' )
						and a.kode_ubis2 = '$ubisNrc'
						order by kode_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{
				$result = $this->getDataAkunJejerActualWitelSegmenDetail($model, $periode, $witel, $neraca, $row->kode_ubis, $row->nama, $row->segmen,$result, $pembagi);

			}
		}
		return json_encode($result);

	}
	function getDataAkunJejerActualWitelSegmenDetail($model, $periode, $ubis = null, $neraca = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		$divre = false;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
			$divre = true;
		}else {
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
			if (substr($ubis,0,2) == "T6"){//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%'  order by kode_witel");//where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where (kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) ) and a.kode_ubis = '$kode_ubis')
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = "
						and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis = '$kode_ubis'  )
						and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			$sql = " select x.kode_neraca,x.kode_akun,case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum( case '$bln' when '01' then jan
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
												end )/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model' and x.kode_neraca = '$neraca' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";

			$rs = $this->dbLib->execute($sql);
			//error_log($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		if (!$divre)
			if (substr($ubis,0,2)=="T6") //b.kode_ubis = '$ubis' and
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
												 where  a.kode_ubis = '$kode_ubis' and b.kode_induk like '$ubis%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis2 = '$kode_ubis' 									
									  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911') and a.kode_ubis = '$kode_ubis'
									union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' and a.kode_ubis = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$rs = $this->dbLib->execute("select distinct '$kode_ubis' as ubis, a.kode_neraca, c.kode_akun, c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.actsd,0))  as actsd $field
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  and x.kode_neraca= '$neraca' order by  rowindex");
		while ($row = $rs->FetchNextObject(false)){
			$result["rs"]["rows"][] = (array) $row;
		}

				//perlu hitung ke summary
		return ($result);

	}

	/***************/
	function getDataJejerAggWitel2($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
			$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6")
			{//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");// where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$row->kode_witel%'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' )  ";

			else
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  ) ";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			//error_log("Summary : " . $sql);
			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}

		$witel = $ubis;
		if ($ubis == "") $ubis = "Telkom Regional";
		/*if ($divre)
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													 where b.kode_ubis like '$witel%')  ";

			else
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$witel%'  ) ";
		*/
		if (!$divre){
			if (substr($ubis,0,2)=="T6"){// where b.kode_ubis = '$witel'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													where b.kode_induk like '$witel%'
										union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$witel%'
												 )
					";

			}else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )
					";
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911' )
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like 'T6%')
					";

		$rs = $this->dbLib->execute("select '$ubis' as ubis, '$ubis' as kode_neraca, '$ubis' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as aggthn $field
				from dual
				union
				select distinct '$ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.aggthn,0))  as aggthn $field
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2 group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD') $done = true;
			}

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
							if ($key != 'ubis' && $key != 'jenis_akun' && $key != 'kode_akun'  &&  $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejerDatel2($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;
		/*$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$witel' )
					order by kode_ubis");*/
		$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$filterWitel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$filterWitel' )
					order by a.urut_ubis");

		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			$resConsumer = $this->getDataJejerAggWitelSegmen2($model, $periode, $witel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
			if (count($resConsumer["rs"]["rows"]) > 1)
			{
				foreach ($resConsumer["rs"]["rows"] as $val){
					$result["rs"]["rows"][] = $val;
				}
			}
		}
		return json_encode($result);

	}
	function getDataJejerAggWitelSegmen2($model, $periode, $ubis = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$divre = false;
		$bln = substr($periode, 4,2);
		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis'  order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6"){//divre//where b.kode_ubis ='$ubis'
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc  where b.kode_induk like '$ubis%' order by kode_witel");
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$row->kode_witel%' and a.kode_ubis = '$kode_ubis'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' and a.kode_ubis = '$kode_ubis') ";
			else
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis = '$kode_ubis'  ) ";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			/*case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des*/
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";

			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		/*if ($divre){
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
							inner join exs_divre b on b.witel = a.kode_witel where b.kode_ubis like '$ubis%' and a.kode_ubis = '$kode_ubis') ";
		}else {
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis = '$kode_ubis' )";
		}*/
		if (!$divre){
			if (substr($ubis,0,2)=="T6"){// where b.kode_ubis = '$witel'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													where b.kode_induk like '$ubis%' and a.kode_ubis = '$kode_ubis'
										 union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis = '$kode_ubis'
												 )
					";

			}else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$ubis%' and a.kode_ubis = '$kode_ubis' )
					";
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911' ) and a.kode_ubis = '$kode_ubis'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' and a.kode_ubis = '$kode_ubis')
					";

		$rs = $this->dbLib->execute("select '$nama' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as aggthn $field
				from dual
				union
				select distinct '$nama' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.aggthn,0))  as aggthn $field
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2 group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model'  order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD') $done = true;
			}

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
							if ($key != 'ubis' && $key != "jenis_akun" && $key != 'kode_akun'  && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejerDatel2($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			//error_log($key);
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;

		return ($result);

	}
	function getDataJejerActualWitel2($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$divre = false;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
			$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6")
			{//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");// where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			//a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as $witel ";
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			//error_log("Summary : ".$sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}

		if($ubis == "") $kode_ubis = "All Divre";
		else if (strlen($ubis) == 2) $kode_ubis = "All Witel";
		else $kode_ubis = $ubis;
		if (!$divre){
			if (substr($ubis,0,2)=="T6"){//where b.kode_ubis = '$ubis'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													 where b.kode_induk like '$ubis%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' 
												  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";

			}else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ('T910','T911')
									union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$sql = "select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$kode_ubis' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as actsd $field
				from dual
				union 	select distinct '$kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.actsd,0))  as actsd $field
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex";
		//error_log("jejerWitel =>  " . $sql);
		$rs = $this->dbLib->execute($sql);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == "EBD") $done = true;
			}
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
							if ($key != "ubis" && $key != "kode_neraca" && $key != "nama" && $key != "tipe" && $key != "sum_header" && $key != "level_spasi" && $key != "rowindex")
								$nodeHeader->dataArray[$key] += $value;
						}
						$nodeHeader->data =(object) $nodeHeader->dataArray;
					}
				}
			}
		}
		//perlu hitung ke summary
		$result = array('rs' => array('rows' => array() ) );
		$this->generateResultJejerDatel($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			//error_log($key);
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;
		/*$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$ubis%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like '$ubis%' )
					order by kode_ubis");
		*/
		$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$ubis%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like '$ubis%' )
					order by a.urut_ubis");

		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			$resConsumer = $this->getDataJejerActualWitelSegmen2($model, $periode, $ubis, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
			if (count($resConsumer["rs"]["rows"]) > 1){
				foreach ($resConsumer["rs"]["rows"] as $val){
					$result["rs"]["rows"][] = $val;
				}
			}
		}
		return json_encode($result);

	}
	function getDataJejerActualWitelSegmen2($model, $periode, $ubis = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$divre = false;

		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis'  order by kode_cc");

		}else if ($ubis == ""){
			//$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;

		}else {
			if (substr($ubis,0,2) == "T6"){//divre//where b.kode_ubis ='$ubis'
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%'  order by kode_witel");
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();

		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where 
										(kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) ) and a.kode_ubis = '$kode_ubis')
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis = '$kode_ubis'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as $witel ";
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();
			//error_log($sql);
			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		/*
		if ($ubis != ""){
			$field .= ", 0  as total ";
			$filter = "  ";
			$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$ubis%' and kode_ubis = '$kode_ubis' )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
								or 
								(y.kode_akun like '4%' and y.tahun > '2014')
							)";

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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set("total", $itemUbis);
		}
		*/
		if (!$divre)
			if (substr($ubis,0,2)=="T6")
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
												 where  a.kode_ubis = '$kode_ubis' and b.kode_induk like '$ubis%' 
									union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis = '$kode_ubis' 
									 )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911') and a.kode_ubis = '$kode_ubis'
									union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' and a.kode_ubis = '$kode_ubis' )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$sql = "select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				,0 as actsd $field
				from dual
				union
				select distinct '$kode_ubis' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1, a.kode_induk, a.rowindex + 1
												, (nvl(b.actsd,0))  as actsd $field
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex";
		//error_log("jejerWitelSegmen $kode_ubis =>  " . $sql);
		$rs = $this->dbLib->execute($sql);
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("	\$row->$key = \$itemUbis->get(\$row->kode_neraca);");
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
				if ($row->kode_neraca == "EBD") $done = true;
			}
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
		$this->generateResultJejerDatel($rootNode, $result);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];

		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		foreach ($dataUbis->getArray() as $key => $itemUbis){
			//error_log($key);
			$nodeUbis[$key] = $nodeEBD[$key];
		}
		$result["rs"]["rows"][0] = $nodeUbis;
		return ($result);

	}

	/***************/
	function getDataRevSegmenDatel($model, $periode, $segmen = null, $witel = null, $pembagi = 1000000000){
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
		switch ($segmen) {
			case "DBS" : $segmen = "B";break;
			case "DCS" : $segmen = "N";break;
			case "DES" : $segmen = "E";break;
			default : $segmen = "N";break;
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
									from exs_mbudget a

									where tahun = '$thn1' and jenis in ('S') group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									where tahun = '$thn1' and b.kode_witel like '%' and jenis in ('E','B','C','ZC','ZE','ZB') group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
									where tahun = '$thn2' and b.kode_witel like '%' and jenis in ('E','B','C','ZC','ZE','ZB') group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where tahun = '$thn3' and b.kode_witel like '%' and jenis in ('E','B','C','ZC','ZE','ZB')group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";


		$ubis ="' '";
		$segmenMap = new server_util_Map();
		{
			$sgmData = "'E','ZE'";
			$segmenMap->set('Enterprise', $sgmData);
			$sgmData = "'B','ZB'";
			$segmenMap->set('Bisnis', $sgmData);
			$sgmData = "'C','ZC'";
			$segmenMap->set('Consumer', $sgmData);
			//$sgmData = "'ZC','ZE','ZB' ";
			//$segmenMap->set('SAP', $sgmData);

		}

		$sqlSegmen = "";
		$counter = 1;
		foreach ($segmenMap->getArray() as $key =>$val){
			$ubis = $val;
			{
				switch  ($key){
					case "Bisnis" :  $jenis = "'B','ZB'";
					break;
					case "Consumer" : $jenis = "'C','ZC'";
					break;
					case "Enterprise" : $jenis = "'E','ZE'";
					break;
					default :$jenis= "'C','E','B','ZC','ZE','ZB'";
					break;
				}
			}
			if (strlen($witel) == 7){
				$filter = "  and jenis in ($jenis) and a.kode_cc = '$witel' ";
			}else if (strlen($datel) == 4) {
				$filter = " and a.kode_cc like '$witel%' and (( kode_akun like '4%' and a.jenis in ($jenis)) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}else{
				$filter = " and b.kode_induk like '$witel%' and (( kode_akun like '4%' and a.jenis in ($jenis)) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}
			//$ubis = substr($ubis,1);
			$sql2 = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthnini, c.actbln, c.actsd, d.actblnlalu, d.actsdlalu as actall, e.actblnlalu as trend
							   from exs_masakun a
								left outer join (
										select kode_akun, tahun,
															sum(nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0)
																	+ nvl(jul,0) + nvl(aug,0) + nvl(sep,0) + nvl(okt,0) + nvl(nop,0) + nvl(des,0) ) as aggthn ,
															sum(case '$bln' when '01' then nvl(jan,0)
																	 when '02' then (nvl(jan,0) + nvl(feb,0)  )
																	 when '03' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0)  )
																	 when '04' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0)  )
																	 when '05' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) )
																	 when '06' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0)  )
																	 when '07' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0) + nvl(jul,0) )
																	 when '08' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0) + nvl(jul,0) + nvl(aug,0) )
																	 when '09' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0) + nvl(jul,0) + nvl(aug,0) + nvl(sep,0) )
																	 when '10' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0) + nvl(jul,0) + nvl(aug,0) + nvl(sep,0) + nvl(okt,0) )
																	 when '11' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0) + nvl(jul,0) + nvl(aug,0) + nvl(sep,0) + nvl(okt,0) + nvl(nop,0) )
																	 when '12' then (nvl(jan,0) + nvl(feb,0) + nvl(mar,0) + nvl(apr,0) + nvl(mei,0) + nvl(jun,0) + nvl(jul,0) + nvl(aug,0) + nvl(sep,0) + nvl(okt,0) + nvl(nop,0) + nvl(des,0))
															end) as aggsd,
															sum(case '$bln' when '01' then nvl(jan,0)
																	 when '02' then nvl(feb,0)
																	 when '03' then nvl(MAR,0)
																	 when '04' then nvl(APR,0)
																	 when '05' then nvl(MEI,0)
																	 when '06' then nvl(jun,0)
																	 when '07' then nvl(jul,0)
																	 when '08' then nvl(aug,0)
																	 when '09' then nvl(sep,0)
																	 when '10' then nvl(okt,0)
																	 when '11' then nvl(nop,0)
																	 when '12' then nvl(des,0)
															end) as aggbln
												from exs_mbudget a
												inner join exs_cc b on b.kode_cc = a.kode_cc
												where b.kode_cc like 'T91%' and tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
												where tahun = '$thn1' and b.kode_witel like '$witel%' and a.jenis in ($ubis) group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												where tahun = '$thn2' and b.kode_witel like '$witel%' and a.jenis  in ($ubis) group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
												where tahun = '$thn3' and b.kode_witel like '$witel%' and a.jenis in ($ubis) group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
								";

			$sqlSegmen .= "
			union
			select '$key' as ubis, $counter as urutan, a.kode_neraca, left_pad(case when level_spasi=0 then '$key' else a.nama end,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
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
											where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

						where a.kode_fs = '$model' ";
			$counter++;
		}
		//error_log($sqlSegmen);
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );

		//while ($rowUbis = $rsu->FetchNextObject(false)){
			$rs = $this->dbLib->execute("select distinct 'Telkom Regional' as ubis, 0 as urutan, a.kode_neraca, left_pad(case when level_spasi=0 then 'Telkom Regional' else a.nama end,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
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
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model'
						$sqlSegmen order by urutan, rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$aktif = false;
			$total = 0;
			while ($row = $rs->FetchNextObject(false)){
				if ($row->kode_neraca == "AR") $aktif = true;
				//if ($row->kode_neraca == "OE") $aktif = false;
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
	function getDataEXSUMDatel2($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null, $sourceData = null, $pembagi = 1000000000){
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
		if (!isset($segmen) || trim($segmen) == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default :$jenis= "'C','E','B','ZC','ZE','ZB'";
				break;
			}
		}
		$source = "'C','E','B','ZC','ZE','ZB'";
		switch  (strtoupper($sourceData)){
				case "SAP" :  $source = "'ZE','ZB','ZC'";
				break;
				case "DES" : $source = "'E'";
				break;
				case "DBS" : $source = "'B'";
				break;
				case "MYARM(CONSUMER)" : $source = "'C'";
				break;
			}
		//error_log($sourceData);
		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
		}else if (strlen($datel) == 4) {
			$filter = " and a.kode_cc like '$datel%' and (( kode_akun like '4%' and a.jenis in ($jenis) and a.jenis in ($source)) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
		}else{
			$filter = " and b.kode_induk like '$datel%' and (( kode_akun like '4%' and a.jenis in ($jenis) and a.jenis in ($source)) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
		}
		$result = array('rs' => array('rows' => array() ) );
		if ($dataNasional){
			$filter2 = " and a.kode_cc like '%' and a.jenis = 'S'  ";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
										where tahun = '$thn1' $filter2 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
						left outer join (
								select kode_akun,
													sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
										where tahun = '$thn1' $filter2 group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
													end) as actbln
										from exs_mactual a
										inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter2 group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
										where tahun = '$thn3' $filter2 group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
						";
			$sql2 = "select distinct 'NAS' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
													, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
													, ( nvl(b.actall,0) ) as actall
													, (nvl(b.trend,0)) as trend
													, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
													, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
													, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
													, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
													, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
													, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
													, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
													, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
													, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
													, 0 as contrib
													, 0 as nilai_rev
													, 0 as nilai_exp
													, 0 as contrib2
											from EXS_NERACA a
											left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																				, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																				, sum(nvl(aggsd,0)) / $pembagi as aggsd
																				, sum(nvl(actbln,0))/ $pembagi  as actbln
																				, sum(nvl(actsd,0)) / $pembagi as actsd
																				, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																				, sum(nvl(actall,0)) / $pembagi as actall
																				, sum(nvl(trend,0)) / $pembagi as trend
															from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

										where a.kode_fs = '$model' order by  rowindex";

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
							$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultDatel($rootNode, $result, $neraca, true);
		};
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where a.kode_cc like 'T91%' and  tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
									where a.kode_cc like 'T91%' and tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where a.kode_cc like 'T91%' and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where a.kode_cc like 'T91%' and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		if ($datel == '') $datel ='Telkom Regional';
		$sql2 = "select distinct '$datel' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 order by  rowindex";

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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->generateResultDatel($rootNode, $result, $neraca);
		return json_encode($result);

	}
	function getDataEXSUMDatelDetail2($model, $periode, $datel = null, $neraca = null, $segmen = null, $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','S'";
				break;
			}
		}
		if (strlen($datel) == 7){
			$filter = "   ";
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)  ";//and segmen in ($jenis)
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";//and segmen in ($jenis)


		}else if (strlen($datel) == 4) {
			$filter = "   " ;
			if (substr($datel,0,2) == "T6"){
				$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )  ";//and segmen in ($jenis)


			}else {
				$filter4 = "((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";//and segmen in ($jenis)
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select witel from exs_divre a inner join exs_ubis b on b.kode_ubis = a.kode_ubis where b.kode_induk = '$datel' ) )  ";//and segmen in ($jenis)

			}
		}else{
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";//and segmen in ($jenis)


			$filter = "  " ;
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) ) and  a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%')
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)    ";// and segmen in ($jenis
		}


		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where  tahun = '$thn1' $filter3 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									where $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct a.kode_neraca, concat(d.kode_akun, '-', d.nama) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
										inner join exs_masakun d on d.kode_akun  = c.kode_akun
										inner join (select x.kode_neraca, x.kode_akun
																			, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model' and a.kode_neraca = '$neraca' order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$result = array('rs' => array('rows' => array() ) );

		while ($row = $rs->FetchNextObject(false)){

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

			if ($row->jenis_akun == "PENDAPATAN"){
				$row->aggthn = -round($row->aggthn,2);
				$row->aggbln = -round($row->aggbln,2);
				$row->trend = -round($row->trend,2);
				$row->aggsd = -round($row->aggsd,2);
				$row->actbln = -round($row->actbln,2);
				$row->actsd = -round($row->actsd,2);
				$row->actblnlalu = -round($row->actblnlalu,2);
				$row->actall = -round($row->actall,2);
				$row->acvgap = -round($row->actbln - $row->aggbln,2);
				$row->growthpsn = floatval($row->trend) == 0 ? 0 : -round( ($row->actbln - $row->trend) / $row->trend * 100,1 );
				$row->growthgap = -round($row->actbln - $row->trend,2);
			}else{
				$row->aggthn = round($row->aggthn,2);
				$row->aggbln = round($row->aggbln,2);
				$row->trend = round($row->trend,2);
				$row->aggsd = round($row->aggsd,2);
				$row->actbln = round($row->actbln,2);
				$row->actsd = round($row->actsd,2);
				$row->actblnlalu = round($row->actblnlalu,2);
				$row->actall = round($row->actall,2);
				$row->acvgap = round($row->actbln - $row->aggbln,2);
				$row->growthpsn = floatval($row->trend) == 0 ? 0 : round( ($row->actbln - $row->trend) / $row->trend * 100,1 );
				$row->growthgap = round($row->actbln - $row->trend,2);
			}
			$result["rs"]["rows"][] = $row;
		}


		return json_encode($result);

	}
	function getDataEXSUMDatel($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		if ($datel == "Cons"){
			$datel = "";
		}
		if (floatval($bln) == 1){
			$thn3 = floatval(substr($periode,0,4)) - 1;
			$bln2 = "12";
		}else {
			$thn3 = $thn1;
			$bln2 = floatval($bln) - 1;
			$bln2 = $bln2 < 10 ? "0$bln2" : $bln2;
		}
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','S','H'";
				break;
			}
		}
		//error_log("getDataEXSUMDatel $jenis $segmen");
		if (strlen($datel) == 7){
			$filter = "   ";
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%' )
								OR
								(a.kode_akun like '5%')
							)  ";//and segmen in ($jenis)
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";//and segmen in ($jenis)


		}else if (strlen($datel) == 4) {
			$filter = "   " ;
			if (substr($datel,0,2) == "T6"){
				$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )  ";//and segmen in ($jenis)


			}else {
				$filter4 = "((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
								
							) ";//and segmen in ($jenis)
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select witel from exs_divre a inner join exs_ubis b on b.kode_ubis = a.kode_ubis where b.kode_induk = '$datel' ) )  ";//and segmen in ($jenis)

			}
		}else{
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";//and segmen in ($jenis)


			$filter = "  " ;
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) ) 
					and  a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%')
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%' )
								OR
								(a.kode_akun like '5%')
							)    ";// and segmen in ($jenis
		}

		$result = array('rs' => array('rows' => array() ) );
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";
		global $userlog;
		$session_id = $this->getSessionId();//md5( $userlog . date("r"));
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id)
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
												end) as aggbln, '$session_id' as session_id
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter3 group by kode_akun, tahun
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ");

		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_summakun
							(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
							select a.kode_akun, b.tahun, '-'
								, b.aggthn, b.aggbln, b.aggsd
								, c.actthn, c.actsd, c.actbln, e.actblnlalu as trend
								, d.actsd as actall
								,'$session_id' as session_id
					from exs_masakun a
					left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.tahun='$thn1' and b.session_id = '$session_id'
					left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
					left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
					left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
					 ");

		$sql = "select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
									, sum(nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(nvl(aggsd,0)) / $pembagi as aggsd
									, sum(nvl(actbln,0))/ $pembagi  as actbln
									, sum(nvl(actsd,0)) / $pembagi as actsd
									, sum(nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x inner join exs_process_summakun y on y.kode_akun = x.kode_akun
				where x.kode_fs = '$model' and session_id='$session_id' group by x.kode_neraca";
		$witel = $datel;
		if ($datel == '') {
			$datel ='Telkom Regional';
			$nama = $datel;
		} else {
			$nama = $witel;
			$rs = $this->dbLib->execute("select nama from exs_ubis where kode_ubis = '$datel' ");
			if ($row = $rs->FetchNextObject(false))
				$nama = $row->nama;
		}
		
		
		$sql2 = "select '$datel' as ubis,'$datel' as kode_neraca, '$nama' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$datel' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join ($sql) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->ubisIsRoot = false;
		$this->generateResultDatel($rootNode, $result, $neraca);
		if (isset($neraca)){
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
			echo("Neraca $neraca");
			echo(json_encode($nodeUbis)  );
			echo(json_encode($nodeEBD)  );
		}else {
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
			echo("Non Neraca");
			echo(json_encode($nodeUbis)  );
			echo(json_encode($nodeEBD)  );
		}
		$this->deleteSession($session_id);
		/*if (count($witel) == 9)
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel = '$witel'
					order by kode_ubis");
		else */

			/*$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$witel' )
					order by kode_ubis");*/
		$rs = $this->dbLib->execute("select distinct b.nama as nama, a.kode_ubis2 as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$witel' )
					order by a.urut_ubis");
		//kode : buat select ke mappc
		//nama : buat sheet

		while ($row = $rs->FetchNextObject(false))
		{
			$this->collectData = false;
			if ($witel != ""){
				if ($row->kode_ubis == "T910" || $row->kode_ubis == "T911")
					$nama = "(EX) " . $row->nama;
				else
					$nama = $row->nama;
				if ($row->kode_ubis == "T910" || $row->kode_ubis == "T911"){
					$witel2 = substr($witel,0,6) ."1";
					$rs2 = $this->dbLib->execute("select nama from exs_cc where kode_cc = '$witel2' ");
					while ($row2 = $rs2->FetchNextObject(false)){
						$nama = "(EX) " . $row2->nama;
					}

				}
			}else {
				if ($row->kode_ubis == "T910" || $row->kode_ubis == "T911")
					$nama = "(EX) " . $row->nama;
				else
					$nama = $row->nama;
			}
			$resConsumer = $this->getDataSegmenWitel($model, $periode, $witel, $row->kode_ubis, $nama, $segmen,$neraca, $pembagi);
			if (count($resConsumer["rs"]["rows"]) > 1){
				foreach ($resConsumer["rs"]["rows"] as $val){
					$result["rs"]["rows"][] = $val;
				}
			}
		}

		return json_encode($result);

	}
	function getDataSegmenWitel($model, $periode, $datel = null,$kode_ubis = null, $ubis = null,  $segmen = null, $neraca = null, $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  (strtoupper($segmen)) {
				case "BISNIS" :  $jenis = "'B','ZB'";
				break;
				case "CONSUMER" : $jenis = "'C','ZC'";
				break;
				case "ENTERPRISE" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','S','H'";
				break;
			}
			if (isset($segmen))
				$jenis = "'S','".substr($segmen,0,1)."'";
			else $jenis = "'S','E','B','C','E','B','ZC','ZE','ZB','S','H'";
			//$segmen = $ubis;
		}
		if (strpos($ubis,'DCS') === false && $thn1 == '2013')
			$filter3 = "and (
							(substr(a.kode_akun,1,1) = '4' and  a.jenis in ('S',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%'  and kode_ubis2 like '$kode_ubis%') )
						 	or
						 	(substr(a.kode_akun,1,1) = '5' and a.jenis in ($jenis) and a.kode_cc like 'T91%' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' ) )
						 )";
		else {
			$filter3 = "and a.jenis in ('S','F','E','B','H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%'  and kode_ubis2 like '$kode_ubis%' )";
		}

		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%' )
								OR
								(a.kode_akun like '5%')
								
							)	 ";
		}else if (strlen($datel) == 4) {
			$filter = " " ;

			if (substr($datel,0,2) == "T6"){
				$filter4 = "  ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 like '$kode_ubis%')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%' )
								OR
								(a.kode_akun like '5%')
								
							)";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 like '$kode_ubis%' )  ";//and segmen in ($jenis)

			}else{
				$filter4 = "  ((a.jenis in ('S','F',$jenis) and tahun >= '2014' ) or (a.jenis in ($jenis) and tahun < '2014')  )
						and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
								
							)
						";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select witel from exs_divre a inner join exs_ubis b on b.kode_ubis = a.kode_ubis where b.kode_induk = '$datel' )) and kode_ubis like '$kode_ubis%' )  ";//and segmen in ($jenis)
			}
		}else{
			$filter = "  " ;
			$filter4 = "  ((a.jenis in ('S','F',$jenis) and tahun >= '2014' ) or (a.jenis in ($jenis) and tahun < '2014')  )
						and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
								
							)	  ";
		}

		$result = array('rs' => array('rows' => array() ) );
		global $userlog;
		//error_log($filter4);
		$session_id = $this->getSessionId();//md5( $userlog . date("r"));
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id)
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
												end) as aggbln, '$session_id' as session_id
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter3 group by kode_akun, tahun
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_summakun
							(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,
										actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
										select a.kode_akun, b.tahun, '-'
										, b.aggthn, b.aggbln, b.aggsd
										, c.actthn, c.actsd, c.actbln, e.actblnlalu as trend
										, d.actsd as actall
										,'$session_id' as session_id
							from exs_masakun a
							left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.session_id = '$session_id'
							left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
							left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
							left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
							 ");

		$sql = "select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
									, sum(nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(nvl(aggsd,0)) / $pembagi as aggsd
									, sum(nvl(actbln,0))/ $pembagi  as actbln
									, sum(nvl(actsd,0)) / $pembagi as actsd
									, sum(nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x inner join exs_process_summakun y on y.kode_akun = x.kode_akun
				where x.kode_fs = '$model' and session_id='$session_id' group by x.kode_neraca";
		if ($datel == '') $datel = $kode_ubis;
		$sql2 = "select '$kode_ubis' as ubis,'$datel' as kode_neraca, '&nbsp;&nbsp;&nbsp;&nbsp;$ubis' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 2) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join ($sql) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 order by  rowindex";
			/*(select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca)*/
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				//DES

				$node->setData($row);
				if ($row->tipe == "SUMMARY")
					$this->sumHeader->set($row->kode_neraca, $node);
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->ubisIsRoot = false;
		$this->generateResultDatel($rootNode, $result, $neraca);

		if (isset($neraca)){
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
		}else {
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
		}
		$this->deleteSession($session_id);
		return $result;
	}
	function getDataEXSUMNonWitel($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','S','H'";
				break;
			}
		}
		//error_log("getDataEXSUMDatel $jenis $segmen");
		{
				$filter3 = "and ( (a.jenis in ('S','E') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and not a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						";//and segmen in ($jenis)and not ( a.kode_cc like 'T651%' and a.kode_akun like '4%') 
	
				$filter31 = "and ( (a.jenis in ('E','H') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						";//and segmen in ($jenis)
						
		
				$filter = "  " ;
				$filter4 = " ((a.jenis in ('S') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) ) 
						and (
								not a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%')
								or 
								(a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
							)
							and not ( a.kode_cc like 'T651%' and a.kode_akun like '4%' and not a.kode_cc like 'T651W%' and a.kode_akun in ( select distinct gl_acc from exs_flexiakun))
						";
				$filter41 = "( (a.jenis in ('H') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						";//and segmen in ($jenis)
				$filter42 = " ((a.jenis in ('S') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) ) 
						and  (a.kode_cc like 'T651%' or a.kode_cc like 'T651W%') and jenis = 'S' and a.kode_akun like '4%'
						and not a.kode_akun in ( select distinct gl_acc from exs_flexiakun) 
						";
				
		}

		$result = array('rs' => array('rows' => array() ) );
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";
		global $userlog;
		$session_id = $this->getSessionId();//md5( $userlog . date("r"));
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id, kode_neraca)
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
												end) as aggbln, '$session_id' as session_id,'ori' as status 
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter3 group by kode_akun, tahun
								 
							 ");
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id, kode_neraca)
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
												end) as aggbln, '$session_id' as session_id,'des' as status
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter31 group by kode_akun, tahun
								 
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'H'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter41 and tahun = '$thn1'  group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'F'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter42 and tahun = '$thn1'  group by  kode_akun, tahun ");
																
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'H2'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter41 and tahun = '$thn3' $filter group by kode_akun, tahun");							
		$this->dbLib->execute("insert into exs_process_summakun
							(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
							select a.kode_akun, b.tahun, '-'
								, b.aggthn - nvl(f.aggthn,0) as aggthn
								, b.aggbln  - nvl(f.aggbln,0) as aggbln
								, b.aggsd  - nvl(f.aggsd,0) as aggsd
								, c.actthn - nvl(c1.actthn,0) + nvl(c2.actthn,0)  as actthn
								, c.actsd - nvl(c1.actsd,0) + nvl(c2.actsd,0) as actsd
								, c.actbln - nvl(c1.actbln,0) + nvl(c2.actbln,0) as actbln
								, e.actblnlalu -  nvl(e1.actblnlalu,0) as trend
								, d.actsd as actall
								,'$session_id' as session_id
					from exs_masakun a
					left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.tahun='$thn1' and b.session_id = '$session_id' and b.kode_neraca = 'ori'
					left outer join exs_process_agg f on f.kode_akun = a.kode_akun and f.tahun='$thn1' and f.session_id = '$session_id' and f.kode_neraca = 'des'
					left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
					left outer join exs_process_actual c2 on c2.kode_akun = a.kode_akun and c2.tahun='$thn1' and c2.jenis = 'F' and c2.session_id = '$session_id'
					left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
					left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
					left outer join exs_process_actual c1 on c1.kode_akun = a.kode_akun and c1.tahun='$thn1' and c1.jenis = 'H' and c1.session_id = '$session_id'
					left outer join exs_process_actual e1 on e1.kode_akun = a.kode_akun and e1.tahun='$thn3' and e1.jenis = 'H2' and e1.session_id = '$session_id'
					 ");

		$sql = "select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
									, sum(nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(nvl(aggsd,0)) / $pembagi as aggsd
									, sum(nvl(actbln,0))/ $pembagi  as actbln
									, sum(nvl(actsd,0)) / $pembagi as actsd
									, sum(nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x inner join exs_process_summakun y on y.kode_akun = x.kode_akun
				where x.kode_fs = '$model' and session_id='$session_id' group by x.kode_neraca";
		$witel = $datel;
		//if ($datel == '') $datel ='Telkom Regional';

		$sql2 = "select 'NonWitel' as ubis,'NonWitel' as kode_neraca, 'NonWitel' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$datel' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join ($sql) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->ubisIsRoot = false;
		$this->generateResultDatel($rootNode, $result, $neraca);
		if (isset($neraca)){
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
		}else {
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
		}
		$this->deleteSession($session_id);
		return ($result);

	}
	function getDataEXSUMNonWitelUbis($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','S','H'";
				break;
			}
		}
		//error_log("getDataEXSUMDatel $jenis $segmen");
			if ($datel == "Others"){
				$filter3 = "and ( (a.jenis in ('S','E') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and not a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						and not substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis in ('DCS','DWB','DBS','DES','DWS') )
						";//and segmen in ($jenis)and not ( a.kode_cc like 'T651%' and a.kode_akun like '4%') 
	
				$filter31 = "and ( (a.jenis in ('E','H') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' 
										and not kode_ubis in (select kode_ubis from exs_grouping_ubis where group_ubis in ('DCS','DWB','DBS','DES','DWS'))  
						 )
						 and substr(a.kode_cc,1,4) ='T826' 
						";//and segmen in ($jenis)
						
						//and not substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis in ('DCS','DWB','DBS','DES','DWS') )
						
		
				$filter = "  " ;
				$filter4 = " ((a.jenis in ('S') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) ) 
						and (
								not a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%')
								or 
								(a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
							
							)
						and not substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis in ('DCS','DWB','DBS','DES','DWS') )
						and not ( a.kode_cc like 'T651%' and a.kode_akun like '4%' and not a.kode_cc like 'T651W%' and a.kode_akun in ( select distinct gl_acc from exs_flexiakun))
						";// and segmen in ($jenis
				$filter41 = " ( (a.jenis in ('H') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						";
				$filter42 = " ((a.jenis in ('S') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) ) 
						and  (a.kode_cc like 'T651%' or a.kode_cc like 'T651W%') and jenis = 'S' and a.kode_akun like '4%'
						and not a.kode_akun in ( select distinct gl_acc from exs_flexiakun) 
						";
			}else {
				$filter3 = "and ( (a.jenis in ('S','E') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and not a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						and substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis = '$datel')
						";//and segmen in ($jenis)and not ( a.kode_cc like 'T651%' and a.kode_akun like '4%') 
	
				$filter31 = "and ( (a.jenis in ('E','H') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' 
											and kode_ubis in (select kode_ubis from exs_grouping_ubis where group_ubis = '$datel') ) 
						
						";//and segmen in ($jenis)
						//and substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis = '$datel')
						
						
		
				$filter = "  " ;
				$filter4 = " ((a.jenis in ('S') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) ) 
						and (
								not a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%')
								or 
								(a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
							
							)
						and substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis = '$datel')
						and not ( a.kode_cc like 'T651%' and a.kode_akun like '4%' and not a.kode_cc like 'T651W%' and a.kode_akun in ( select distinct gl_acc from exs_flexiakun))
						 ";// and segmen in ($jenis
								
								/*and (
									( a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								) */
				$filter41 = " ( (a.jenis in ('H') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  ) 
						and substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis = '$datel')";
				$filter42 = " ((a.jenis in ('S') and tahun >= '2014')  or (tahun < '2014' and a.jenis in ('S') ) ) 
						and  (a.kode_cc like 'T651%' or a.kode_cc like 'T651W%') and jenis = 'S' and a.kode_akun like '4%'
						and not a.kode_akun in ( select distinct gl_acc from exs_flexiakun) 
						and substr(a.kode_cc,1,4) in (select kode_ubis from exs_grouping_ubis where group_ubis = '$datel')";
			}
		
		$result = array('rs' => array('rows' => array() ) );
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";
		global $userlog;
		$session_id = $this->getSessionId();//md5( $userlog . date("r"));
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id, kode_neraca)
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
												end) as aggbln, '$session_id' as session_id,'ori' as status 
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter3 group by kode_akun, tahun
								 
							 ");
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id, kode_neraca)
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
												end) as aggbln, '$session_id' as session_id,'des' as status
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter31 group by kode_akun, tahun
								 
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'H'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter41 and tahun = '$thn1' $filter group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'F'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter42 and tahun = '$thn1' $filter group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_summakun
							(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
							select a.kode_akun, b.tahun, '-'
								, b.aggthn - nvl(f.aggthn,0) as aggthn
								, b.aggbln - nvl(f.aggbln,0) as aggbln
								, b.aggsd - nvl(f.aggsd,0) as aggsd
								, c.actthn - nvl(c1.actthn,0) + nvl(c2.actthn,0) as actthn
								, c.actsd - nvl(c1.actthn,0) + nvl(c2.actthn,0) as actsd
								, c.actbln - nvl(c1.actbln,0) + nvl(c2.actbln,0) as actbln
								, e.actblnlalu as trend
								, d.actsd as actall
								,'$session_id' as session_id
					from exs_masakun a
					left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.tahun='$thn1' and b.session_id = '$session_id' and b.kode_neraca = 'ori'
					left outer join exs_process_agg f on f.kode_akun = a.kode_akun and f.tahun='$thn1' and f.session_id = '$session_id' and f.kode_neraca = 'des'
					left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
					left outer join exs_process_actual c2 on c2.kode_akun = a.kode_akun and c2.tahun='$thn1' and c2.jenis = 'F' and c2.session_id = '$session_id'
					left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
					left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
					left outer join exs_process_actual c1 on c1.kode_akun = a.kode_akun and c1.tahun='$thn1' and c1.jenis = 'H' and c.session_id = '$session_id'
					 ");

		$sql = "select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
									, sum(nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(nvl(aggsd,0)) / $pembagi as aggsd
									, sum(nvl(actbln,0))/ $pembagi  as actbln
									, sum(nvl(actsd,0)) / $pembagi as actsd
									, sum(nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x inner join exs_process_summakun y on y.kode_akun = x.kode_akun
				where x.kode_fs = '$model' and session_id='$session_id' group by x.kode_neraca";
		$witel = $datel;
		//if ($datel == '') $datel ='Telkom Regional';

		$sql2 = "select '$datel' as ubis,'$datel' as kode_neraca, '$datel' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$datel' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join ($sql) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->ubisIsRoot = false;
		$this->generateResultDatel($rootNode, $result, $neraca);
		{
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
			$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
			$nodeUbis["trend"] = $nodeEBD["trend"];
			$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
			$nodeUbis["actbln"] = $nodeEBD["actbln"];
			$nodeUbis["actsd"] = $nodeEBD["actsd"];
			$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
			$nodeUbis["actall"] = $nodeEBD["actall"];
			$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
			$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
			$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
			$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
			$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
			$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
			$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
			$nodeUbis["contrib"] = $nodeEBD["contrib"];
			$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
			$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
			$result["rs"]["rows"][0] = $nodeUbis;
		}
		$this->deleteSession($session_id);
		return ($result);

	}
	function getDataEXSUMDatelUnconsole($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
		$result = $this->getDataEXSUMDatel($model, $periode, $datel, $neraca, $dataNasional, $segmen, $pembagi);
		//error_log($result);
		$result = json_decode($result);
		$temp = array("rs" => array("rows" => array()));
		$val =  (array)$result->rs->rows[0];
		//error_log(json_encode($val));
		$val["ubis"] = 'Divre Allocation';
		$val["kode_neraca"] = 'Divre Allocation';
		$val["nama"] = 'Divre Allocation';
		$tmpVal = array();
		foreach ($val as $key => $val){
			$tmpVal[$key] = $val;
		}
		//error_log(json_encode($tmpVal));
		$temp["rs"]["rows"][] = $tmpVal;
		
		
		foreach ($result->rs->rows as $key =>$val){
			if ($key > 0){
				if ($val->ubis != "Telkom Regional"){
					$val->level_spasi = $val->level_spasi  + 1;
					$val->nama = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" .$val->nama; 
				}
				
				$temp["rs"]["rows"][] = $val;
			}
		}
		$resOther = $this->getDataEXSUMNonWitel($model, $periode, $datel, $neraca, $dataNasional, $segmen, $pembagi);
		if (count($resOther["rs"]["rows"]) > 1){
			$val = $resOther["rs"]["rows"][0];
			$val["ubis"]  = 'Non Divre Allocation';
			$val["kode_neraca"]  = 'Non Divre Allocation';
			$val["nama"]  = 'Non Divre Allocation';
			$tmpVal = array();
			foreach ($val as $key => $value){
				$tmpVal[$key] = $value;
			}
			$temp["rs"]["rows"][] = $tmpVal;
			
			/*$resOther["rs"]["rows"][0]["ubis"]  = 'Total Non Divre Allocation';
			$resOther["rs"]["rows"][0]["kode_neraca"]  = 'Total Non Divre Allocation';
			$resOther["rs"]["rows"][0]["nama"]  = 'Total Non Divre Allocation';
			*/
			foreach ($resOther["rs"]["rows"] as $key => $val){
				if ($key > 0){
					//$val["level_spasi"] = $val["level_spasi"] + 1;
					//$val["nama"] = "&nbsp;&nbsp;&nbsp;&nbsp;" .$val["nama"];
					$val["ubis"] = "NonDivre"; 
					$temp["rs"]["rows"][] = $val;
				}
			}
		}
		$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis2 as kode_ubis, a.urut_ubis, c.group_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					left outer join EXS_GROUPING_UBIS c on c.kode_ubis = a.kode_ubis2
					where a.kode_witel like '%' 
					order by a.urut_ubis");
		while ($row = $rs->FetchNextObject(false)){
			//error_log($row->kode_ubis);
			if ($row->group_ubis == "")
				$resOther = $this->getDataEXSUMNonWitelUbis($model, $periode, $row->nama, $neraca, $dataNasional, $segmen, $pembagi);
			else 
				$resOther = $this->getDataEXSUMNonWitelUbis($model, $periode, $row->group_ubis, $neraca, $dataNasional, $segmen, $pembagi);
			if (count($resOther["rs"]["rows"]) > 1){
				foreach ($resOther["rs"]["rows"] as $val){
					$val["level_spasi"] = $val["level_spasi"] + 1;
					$val["nama"] = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" .$val["nama"]; 
					$temp["rs"]["rows"][] = $val;
				}
			}
		}
		
		return json_encode($temp);
	} 
	function getDataEXSUMDatelPlusAkun($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','H'";
				break;
			}
		}
		//error_log("getDataEXSUMDatel $jenis $segmen");
		if (strlen($datel) == 7){
			$filter = "   ";
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)  ";//and segmen in ($jenis)
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";//and segmen in ($jenis)


		}else if (strlen($datel) == 4) {
			$filter = "   " ;
			if (substr($datel,0,2) == "T6"){
				$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )  ";//and segmen in ($jenis)


			}else {
				$filter4 = "((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";//and segmen in ($jenis)
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select witel from exs_divre a inner join exs_ubis b on b.kode_ubis = a.kode_ubis where b.kode_induk = '$datel' ) )  ";//and segmen in ($jenis)

			}
		}else{
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";//and segmen in ($jenis)


			$filter = "  " ;
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) ) and  a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%')
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)    ";// and segmen in ($jenis
		}

		$result = array('rs' => array('rows' => array() ) );
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";
		global $userlog;
		$session_id = $this->getSessionId();//md5($userlog . date("r"));
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id)
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
												end) as aggbln, '$session_id' as session_id
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter3 group by kode_akun, tahun
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ");

		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_summakun
									(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
									select a.kode_akun, b.tahun, '-'
										, b.aggthn, b.aggbln, b.aggsd
										, c.actthn, c.actsd, c.actbln, e.actblnlalu as trend
										, d.actsd as actall
													,'$session_id' as session_id
										from exs_masakun a
										left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.tahun='$thn1' and b.session_id = '$session_id'
										left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
										left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
										left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
										 ");

		$sql = "select x.kode_neraca, sum(case when jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggthn,0)) / $pembagi as aggthn
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggsd,0)) / $pembagi as aggsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actbln,0))/ $pembagi  as actbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actsd,0)) / $pembagi as actsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x
				inner join exs_process_summakun y on y.kode_akun = x.kode_akun
				inner join exs_neraca c on c.kode_neraca = x.kode_neraca and c.kode_fs = x.kode_fs
				where x.kode_fs = '$model' and session_id='$session_id' group by x.kode_neraca";
		$sql2 = "select x.kode_neraca as nrc, x.kode_akun as kode_neraca, b.nama, 0 as level_spasi
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggthn,0)) / $pembagi as aggthn
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggsd,0)) / $pembagi as aggsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actbln,0))/ $pembagi  as actbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actsd,0)) / $pembagi as actsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x
					inner join exs_masakun b on b.kode_akun = x.kode_akun
					inner join exs_process_summakun y on y.kode_akun = x.kode_akun
					inner join exs_neraca c on c.kode_neraca = x.kode_neraca and c.kode_fs = x.kode_fs
				where x.kode_fs = '$model' and session_id='$session_id'
				group by x.kode_neraca, x.kode_akun, b.nama order by kode_neraca";

		$witel = $datel;
		if ($datel == '') $datel ='Telkom Regional';

		$sqli = "select '$datel' as ubis,'$datel' as kode_neraca, '$datel' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				, '$session_id' as session_id
				from dual";
		$this->dbLib->execute("insert into exs_process_exsum $sqli");
		$sqli = "select distinct '$datel' as ubis, a.kode_neraca, a.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
												, '$session_id' as session_id
										from EXS_NERACA a
										left outer join ($sql) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0";
			$this->dbLib->execute("insert into exs_process_exsum $sqli");
			/*$sqli =	"select distinct '$datel' as ubis, b.kode_akun, a.kode_neraca, c.nama as nama, 'AKUN' as tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
												, '$session_id' as session_id
										from EXS_NERACA a
										inner join ($sql2) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model' order by kode_neraca";
								*/
		//$this->dbLib->execute("insert into exs_process_exsum $sqli");
		$rs = $this->dbLib->execute("select ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex
					, aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actall, trend, acvpsn, acvgap, growthpsn, growthgap, acvytdpsn, acvytdrp, ytdpsn, growthytypsn
					, growthytyrp, contrib, nilai_rev, nilai_exp, contrib2
					 from exs_process_exsum where session_id='$session_id' order by  rowindex");

		$detailAkun = new server_util_Map();
		$rsa = $this->dbLib->execute($sql2);
		while ($rowa = $rsa->FetchNextObject(false)){
			if ($detailAkun->get($rowa->nrc) == null){
				$listAkun = array();
			}else $listAkun = $detailAkun->get($rowa->nrc);
			$listAkun[] = $rowa;
			$detailAkun->set($rowa->nrc, $listAkun);
		}
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){

				$result["rs"]["rows"][] = (array) $row;
				$listAkun = $detailAkun->get($row->kode_neraca);
				if ($listAkun != null){
					foreach ($listAkun as $key => $value) {
						$value->level_spasi = $row->level_spasi + 1;
						$value->acvpsn = floatval($value->aggbln) == 0 ? 0 : round($value->actbln / $value->aggbln * 100,1);
						$value->acvgap = round($value->actbln - $value->aggbln,0);
						$value->growthpsn = floatval($value->trend) == 0 ? 0 : round( ($value->actbln - $value->trend) / $value->trend * 100,1 );
						$value->growthgap = round($value->actbln - $value->trend,0);
						$value->acvytdpsn = floatval($value->aggsd) == 0 ? 0  : round($value->actsd / $value->aggsd * 100,1);
						$value->acvytdrp = round($value->actsd - $value->aggsd);
						$value->grwytdpsn = floatval($value->actall) == 0 ? 0 : round(($value->actsd - $value->actall) / $value->actall * 100,1 );
						$value->grwytdgap = round($value->actsd - $value->actall);
						$value->ytdpsn = floatval($value->aggthn) == 0 ? 0 : round($value->actsd / $value->aggthn * 100,1);
						$value->growthytypsn = floatval($value->actall) == 0 ? 0 :round( ($value->actsd - $value->actall) / $value->actall * 100 ,1 );
						$value->growthytyrp = round($value->actsd -  $value->actall);
						if ($value->aggthn != 0 || $value->aggbln != 0 || $value->aggsd != 0 || $value->actbln != 0 || $value->actsd != 0 || $value->actall != 0 || $value->trend != 0 )
							$result["rs"]["rows"][] = (array) $value;
					}
				}
				if ($row->kode_neraca == 'EBD')$done = true;
			}
		}

		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
		$nodeUbis["trend"] = $nodeEBD["trend"];
		$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
		$nodeUbis["actbln"] = $nodeEBD["actbln"];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
		$nodeUbis["actall"] = $nodeEBD["actall"];
		$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
		$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
		$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
		$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
		$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
		$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
		$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
		$nodeUbis["contrib"] = $nodeEBD["contrib"];
		$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
		$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
		$result["rs"]["rows"][0] = $nodeUbis;


		$this->deleteSession($session_id);

		if (substr($witel,0,2) == "T6")
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis3 as kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis3
					where ((not a.kode_ubis3 like 'T66%' and not a.kode_ubis3 like 'T91%' )
						or a.kode_ubis3 like 'T651'
						or a.kode_ubis3 in (select distinct substr(kode_witel,1,4) from exs_mappc where kode_ubis = '$witel') )
					order by kode_ubis");
		else
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					order by kode_ubis");
		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			if ($witel != ""){
				if ($row->kode_ubis == "T910" || $row->kode_ubis == "T911")
					$nama = "(EX) " . $row->nama;
				else
					$nama = $row->nama;
				if ($row->kode_ubis == "T910" || $row->kode_ubis == "T911"){
					$witel2 = substr($witel,0,6) ."1";
					$rs2 = $this->dbLib->execute("select nama from exs_cc where kode_cc = '$witel2' ");
					while ($row2 = $rs2->FetchNextObject(false)){
						$nama = "(EX) " . $row2->nama;
					}

				}
			}else {
				if ($row->kode_ubis == "T910" || $row->kode_ubis == "T911")
					$nama = "(EX) " . $row->nama;
				else
					$nama = $row->nama;
			}


			$resConsumer = $this->getDataSegmenWitelPlusAkun($model, $periode, $witel, $row->kode_ubis, $nama, $row->segmen, $pembagi);
			if (count($resConsumer["rs"]["rows"]) > 1){
				foreach ($resConsumer["rs"]["rows"] as $val){
					$result["rs"]["rows"][] = $val;
				}
			}
		}

		return json_encode($result);

	}
	function getDataSegmenWitelPlusAkun($model, $periode, $datel = null,$kode_ubis = null, $ubis = null,  $segmen = null, $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			/*switch  ($segmen){
				case "DBS" :  $jenis = "'B','ZB'";
				break;
				case "DCS" : $jenis = "'C','ZC'";
				break;
				case "DES" : $jenis = "'E','ZE'";
				break;
			}*/
			$jenis = "'S','E','B','C','E','B','ZC','ZE','ZB','H'";
			$segmen = $ubis;
		}
		
		if (strpos($ubis,'DCS') === false && $thn1 == '2013')
			$filter3 = "and (
							(substr(a.kode_akun,1,1) = '4' and  a.jenis in ('S',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%'  and kode_ubis3 like '$kode_ubis%') )
						 	or
						 	(substr(a.kode_akun,1,1) = '5' and a.jenis in ($jenis) and a.kode_cc like 'T91%' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis3 like '$kode_ubis%' ) )
						 )";
		else {
			$filter3 = "and a.jenis in ('S','F','E','B','H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%'  and kode_ubis3 like '$kode_ubis%' )";
		}

		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis3 like '$kode_ubis%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)	 ";
		}else if (strlen($datel) == 4) {
			$filter = " " ;

			if (substr($datel,0,2) == "T6"){
				$filter4 = "  ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis3 like '$kode_ubis%')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis3 like '$kode_ubis%' )  ";//and segmen in ($jenis)

			}else{
				$filter4 = "  ((a.jenis in ('S','F',$jenis) and tahun >= '2014' ) or (a.jenis in ($jenis) and tahun < '2014')  )
						and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis3 like '$kode_ubis%')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)
						";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select witel from exs_divre a inner join exs_ubis b on b.kode_ubis = a.kode_ubis where b.kode_induk = '$datel' )) and kode_ubis3 like '$kode_ubis%' )  ";//and segmen in ($jenis)
			}
		}else{
			$filter = "  " ;
			$filter4 = "  ((a.jenis in ('S','F',$jenis) and tahun >= '2014' ) or (a.jenis in ($jenis) and tahun < '2014')  )
						and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis3 like '$kode_ubis%' )
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)	  ";
		}

		$result = array('rs' => array('rows' => array() ) );
		$session_id = $this->getSessionId();//md5(date("r"));
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id)
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
												end) as aggbln, '$session_id' as session_id
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where tahun = '$thn1' $filter3 group by kode_akun, tahun
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_summakun
									(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,
												actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
												select a.kode_akun, b.tahun, '-'
												, b.aggthn, b.aggbln, b.aggsd
												, c.actthn, c.actsd, c.actbln, e.actblnlalu as trend
												, d.actsd as actall
												,'$session_id' as session_id
									from exs_masakun a
									left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.session_id = '$session_id'
									left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
									left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
									left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
									 ");

		$sql = "select x.kode_neraca, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggthn,0)) / $pembagi as aggthn
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggsd,0)) / $pembagi as aggsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actbln,0))/ $pembagi  as actbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actsd,0)) / $pembagi as actsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x
				inner join exs_process_summakun y on y.kode_akun = x.kode_akun
				inner join exs_neraca c on c.kode_neraca = x.kode_neraca and c.kode_fs = x.kode_fs
				where x.kode_fs = '$model' and session_id='$session_id' group by x.kode_neraca";
		$sql2 = "select x.kode_neraca as nrc, x.kode_akun as kode_neraca, b.nama
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggthn,0)) / $pembagi as aggthn
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggsd,0)) / $pembagi as aggsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actbln,0))/ $pembagi  as actbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actsd,0)) / $pembagi as actsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnthnlalu,0)) / $pembagi as actall

									, 0 as actblnlalu
				from exs_relakun x
					inner join exs_masakun b on b.kode_akun = x.kode_akun
					inner join exs_process_summakun y on y.kode_akun = x.kode_akun
					inner join exs_neraca c on c.kode_neraca = x.kode_neraca and c.kode_fs = x.kode_fs
				where x.kode_fs = '$model' and session_id='$session_id'
				group by x.kode_neraca, x.kode_akun, b.nama order by x.kode_neraca";

		$datel = $kode_ubis;
		$sqli = "select '$ubis' as ubis,'$datel' as kode_neraca, '$segmen' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				, '$session_id' as session_id
				from dual";
		$this->dbLib->execute("insert into exs_process_exsum $sqli");

		$sqli = "select distinct '$ubis' as ubis, a.kode_neraca, a.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
												, '$session_id' as session_id
										from EXS_NERACA a
										left outer join ($sql) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 ";
		$this->dbLib->execute("insert into exs_process_exsum $sqli");

		$rs = $this->dbLib->execute("select  ubis, kode_neraca, nama, tipe, jenis_akun, sum_header, level_spasi, kode_induk, rowindex
					, aggthn, aggbln, aggsd, actbln, actsd, actblnlalu, actall, trend, acvpsn, acvgap, growthpsn, growthgap, acvytdpsn, acvytdrp, ytdpsn, growthytypsn
					, growthytyrp, contrib, nilai_rev, nilai_exp, contrib2
					 from exs_process_exsum where session_id='$session_id' order by  rowindex");

		$detailAkun = new server_util_Map();
		$rsa = $this->dbLib->execute($sql2);
		while ($rowa = $rsa->FetchNextObject(false)){
			if ($detailAkun->get($rowa->nrc) == null){
				$listAkun = array();
			}else $listAkun = $detailAkun->get($rowa->nrc);
			$listAkun[] = $rowa;
			$detailAkun->set($rowa->nrc, $listAkun);
		}
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){

				$result["rs"]["rows"][] = (array) $row;
				$listAkun = $detailAkun->get($row->kode_neraca);
				if ($listAkun != null){
					foreach ($listAkun as $key => $value) {
						$value->level_spasi = $row->level_spasi + 1;
						$value->acvpsn = floatval($value->aggbln) == 0 ? 0 : round($value->actbln / $value->aggbln * 100,1);
						$value->acvgap = round($value->actbln - $value->aggbln,0);
						$value->growthpsn = floatval($value->trend) == 0 ? 0 : round( ($value->actbln - $value->trend) / $value->trend * 100,1 );
						$value->growthgap = round($value->actbln - $value->trend,0);
						$value->acvytdpsn = floatval($value->aggsd) == 0 ? 0  : round($value->actsd / $value->aggsd * 100,1);
						$value->acvytdrp = round($value->actsd - $value->aggsd);
						$value->grwytdpsn = floatval($value->actall) == 0 ? 0 : round(($value->actsd - $value->actall) / $value->actall * 100,1 );
						$value->grwytdgap = round($value->actsd - $value->actall);
						$value->ytdpsn = floatval($value->aggthn) == 0 ? 0 : round($value->actsd / $value->aggthn * 100,1);
						$value->growthytypsn = floatval($value->actall) == 0 ? 0 :round( ($value->actsd - $value->actall) / $value->actall * 100 ,1 );
						$value->growthytyrp = round($value->actsd -  $value->actall);
						if ($value->aggthn != 0 || $value->aggbln != 0 || $value->aggsd != 0 || $value->actbln != 0 || $value->actsd != 0 || $value->actall != 0 || $value->trend != 0 )
							$result["rs"]["rows"][] = (array) $value;
					}
				}
				if ($row->kode_neraca == 'EBD')$done = true;
			}
		}

		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
		$nodeUbis["trend"] = $nodeEBD["trend"];
		$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
		$nodeUbis["actbln"] = $nodeEBD["actbln"];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
		$nodeUbis["actall"] = $nodeEBD["actall"];
		$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
		$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
		$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
		$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
		$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
		$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
		$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
		$nodeUbis["contrib"] = $nodeEBD["contrib"];
		$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
		$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
		$result["rs"]["rows"][0] = $nodeUbis;
		$this->deleteSession($session_id);
		return $result;
	}


	function generateResultDatelAll($item, &$result, $neraca = null, $revMinus = null){
		foreach ($item->childs as $key => $val){

			$val->data->acvpsn = floatval($val->data->aggbln) == 0 ? 0 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->acvytdpsn = floatval($val->data->aggsd) == 0 ? 0  : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->grwytdpsn = floatval($val->data->actall) == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );

			$val->data->ytdpsn = floatval($val->data->aggthn) == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = floatval($val->data->actall) == 0 ? 0 :round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );

			if (!isset($val->data->ubis)){
				if ($val->data->kode_neraca == 'OE'){
					$this->nodeExp = $val;
					$this->dataExp = (array) $val->data;
				}else if ($val->data->kode_neraca == 'AR'){
					$this->nodeRev = $val;
					$this->dataAR = (array) $val->data;
				}
			}else if ($val->data->ubis == "NAS" && $val->data->kode_neraca == "AR"){
				$this->nodeRev = $val;
				$this->dataAR = (array) $val->data;
			}else if ($val->data->ubis == "NAS" && $val->data->kode_neraca == "OE"){
				$this->nodeExp = $val;
				$this->dataExp = (array) $val->data;
			}



			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->aggthn = -round($val->data->aggthn,0);
				$val->data->aggbln = -round($val->data->aggbln,0);
				$val->data->trend = -round($val->data->trend,0);
				$val->data->aggsd = -round($val->data->aggsd,0);
				$val->data->actbln = -round($val->data->actbln,0);
				$val->data->actsd = -round($val->data->actsd,0);
				$val->data->actblnlalu = -round($val->data->actblnlalu,0);
				$val->data->actall = -round($val->data->actall,0);
				$val->data->acvgap = round($val->data->actbln - $val->data->aggbln,0);
				$val->data->growthpsn = floatval($val->data->trend) == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
				$val->data->growthgap = round($val->data->actbln - $val->data->trend,0);
				$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
				$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);
				$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);

			}else{
				$val->data->aggthn = round($val->data->aggthn,0);
				$val->data->aggbln = round($val->data->aggbln,0);
				$val->data->trend = round($val->data->trend,0);
				$val->data->aggsd = round($val->data->aggsd,0);
				$val->data->actbln = round($val->data->actbln,0);
				$val->data->actsd = round($val->data->actsd,0);
				$val->data->actblnlalu = round($val->data->actblnlalu,0);
				$val->data->actall = round($val->data->actall,0);
				$val->data->acvgap = round($val->data->actbln - $val->data->aggbln,0);
				$val->data->growthpsn = floatval($val->data->trend) == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
				$val->data->growthgap = round($val->data->actbln - $val->data->trend,0);
				$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
				$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);
				$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);
			}

			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->contrib = floatval($this->nodeRev->data->actsd) == 0 ? 0 : round($val->data->actsd / $this->nodeRev->data->actsd * 100, 1);
				$val->data->contrib2 = floatval($this->nodeRev->data->actblnlalu) == 0 ? 0 :round ( ($val->data->actblnlalu / $this->nodeRev->data->actblnlalu)  * 100,1);
				$val->data->contrib3 = floatval($this->nodeRev->data->actall) == 0 ? 0 : round ( ($val->data->actall / $this->nodeRev->data->actall)  * 100,1);
				$val->data->nilai_rev = $this->nodeRev->data->actsd;
			}else if ($val->data->jenis_akun == "BEBAN"){
				$val->data->contrib =  floatval($this->nodeExp->data->actsd) == 0 ? 0 : round($val->data->actsd / $this->nodeExp->data->actsd * 100, 1);
				$val->data->contrib2 = floatval($this->nodeExp->data->actblnlalu) == 0 ? 0 : round ( ($val->data->actblnlalu / $this->nodeExp->data->actblnlalu)  * 100,1);
				$val->data->contrib3 = floatval($this->nodeExp->data->actall) ==0 ? 0 : round ( ($val->data->actall / $this->nodeExp->data->actall)  * 100,1);
				$val->data->nilai_exp = $this->nodeExp->data->actsd;
			}else
				$val->data->contrib = round($val->data->contrib);
			if ($val->data->kode_neraca == 'LRU'){
				if ($val->data->aggbln < 0 && $val->data->actbln > 0){
					$val->data->acvpsn = floatval($val->data->aggbln) == 0 ? 0 : round((($val->data->actbln / $val->data->aggbln) + 1) * 100 * -1,1);
				}
			}
			$result["rs"]["rows"][] = (array) $val->data;
			$this->generateResultDatelAll($val, $result, $neraca, $revMinus);
		}
	}
	function getDataEXSUMDatelPlusAkun2($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				case "Netbro": $jenis = "'T'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','H'";
				break;
			}
		}
		$filter3 = "and a.jenis in ('S',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";

		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";
		}else if (strlen($datel) == 4) {
			$filter = " and a.jenis in ('S',$jenis) " ;
			$filter4 = " a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";
		}else{
			$filter = " and a.jenis in ('S',$jenis)" ;
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";
		}

		$result = array('rs' => array('rows' => array() ) );
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where tahun = '$thn1' $filter3 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$witel = $datel;
		if ($datel == '') $datel ='Telkom Regional';

		$sql2 = "select '$datel' as ubis,'$datel' as kode_neraca, '$datel' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$datel' as ubis, a.kode_neraca, a.nama  as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x
														inner join exs_masakun z on z.kode_akun = x.kode_akun
														left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0

								union
								select distinct '$datel' as ubis, b.kode_akun, b.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 2 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun, z.nama, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x
														inner join exs_masakun z on z.kode_akun = x.kode_akun
														left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun, z.nama) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0
								 order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->generateResultDatel($rootNode, $result, $neraca);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
		$nodeUbis["trend"] = $nodeEBD["trend"];
		$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
		$nodeUbis["actbln"] = $nodeEBD["actbln"];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
		$nodeUbis["actall"] = $nodeEBD["actall"];
		$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
		$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
		$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
		$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
		$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
		$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
		$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
		$nodeUbis["contrib"] = $nodeEBD["contrib"];
		$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
		$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
		$result["rs"]["rows"][0] = $nodeUbis;
		$resConsumer = $this->getDataSegmenWitelPlusAkun($model, $periode, $witel, 'DBS', $pembagi);
		foreach ($resConsumer["rs"]["rows"] as $val){
			$result["rs"]["rows"][] = $val;
		}
		$resBisnis = $this->getDataSegmenWitelPlusAkun($model, $periode, $witel, 'DCS', $pembagi);
		foreach ($resBisnis["rs"]["rows"] as $val){
			$result["rs"]["rows"][] = $val;
		}
		$resEnterprise = $this->getDataSegmenWitelPlusAkun($model, $periode, $witel, 'DES', $pembagi);
		foreach ($resEnterprise["rs"]["rows"] as $val){
			$result["rs"]["rows"][] = $val;
		}
		return json_encode($result);

	}
	function getDataSegmenWitelPlusAkun2($model, $periode, $datel = null, $segmen = null, $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "DBS" :  $jenis = "'B','ZB'";
				break;
				case "DCS" : $jenis = "'C','ZC'";
				break;
				case "DES" : $jenis = "'E','ZE'";
				break;
			}
		}
		if ($segmen != 'DCS' && $thn1 = '2013')
			$filter3 = "and (
							(substr(a.kode_akun,1,1) = '4' and  a.jenis in ('S',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ('C',$jenis) ) )
						 	or
						 	(substr(a.kode_akun,1,1) = '5' and a.jenis in ($jenis) and a.kode_cc like 'T91%' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ('C',$jenis) ) )
						 )";
		else {
			$filter3 = "and a.jenis in ('S',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ('C',$jenis) )";
		}

		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )  ";
		}else if (strlen($datel) == 4) {
			$filter = " and a.jenis in ('S',$jenis) " ;
			$filter4 = " a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen
				in ($jenis) )  ";
		}else{
			$filter = " and a.jenis in ('S',$jenis)" ;
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )  ";
		}

		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where tahun = '$thn1' $filter3 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";

		if ($datel == '') $datel = $segmen;
		$sql2 = "select '$datel' as ubis,'$segmen' as kode_neraca, '$segmen' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$datel' as ubis, a.kode_neraca, a.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0
							union
								select distinct '$datel' as ubis, b.kode_akun, b.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 2 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun, z.nama, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x
														inner join exs_masakun z on z.kode_akun = x.kode_akun
														left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun, z.nama) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0
							order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->generateResultDatel($rootNode, $result, $neraca);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
		$nodeUbis["trend"] = $nodeEBD["trend"];
		$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
		$nodeUbis["actbln"] = $nodeEBD["actbln"];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
		$nodeUbis["actall"] = $nodeEBD["actall"];
		$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
		$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
		$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
		$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
		$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
		$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
		$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
		$nodeUbis["contrib"] = $nodeEBD["contrib"];
		$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
		$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
		$result["rs"]["rows"][0] = $nodeUbis;
		return $result;
	}
	function getDataEXSUMDatelAll($model, $periode, $datel = null, $neraca = null, $dataNasional= null, $segmen = null,  $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default: $jenis= "'C','E','B','ZC','ZE','ZB','H'";
				break;
			}
		}
		//if ($datel == "")
			$filter3 = "and a.jenis in ('S',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )  ";
		//else
		//	$filter3 = "and b.kode_witel like '$datel%' and (( kode_akun like '4%' and a.jenis in ($jenis)) or ( not (kode_akun like '4%') and a.jenis = 'S') ) ";

		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			//$filter4 = "(substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and a.kode_cc = '$datel%') or ";
			//$filter3 = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )  ";
		}else if (strlen($datel) == 4) {
			$filter = " and a.jenis in ('S','F',$jenis) " ;
			$filter4 = " a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )  ";
		}else{
			$filter = " and a.jenis in ('S','F',$jenis)" ;
			$filter4 = "  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )  ";
		}

		$result = array('rs' => array('rows' => array() ) );
		if ($dataNasional){
			$filter2 = " and a.kode_cc like '%' and a.jenis = 'S'  ";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
										where tahun = '$thn1' $filter2 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
						left outer join (
								select kode_akun,
													sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
										where tahun = '$thn1' $filter2 group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
													end) as actbln
										from exs_mactual a
										inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter2 group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
										where tahun = '$thn3' $filter2 group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
						";
			$sql2 = "select distinct 'NAS' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
													, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
													, ( nvl(b.actall,0) ) as actall
													, (nvl(b.trend,0)) as trend
													, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
													, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
													, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
													, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
													, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
													, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
													, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
													, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
													, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
													, 0 as contrib
													, 0 as nilai_rev
													, 0 as nilai_exp
													, 0 as contrib2
											from EXS_NERACA a
											left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																				, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																				, sum(nvl(aggsd,0)) / $pembagi as aggsd
																				, sum(nvl(actbln,0))/ $pembagi  as actbln
																				, sum(nvl(actsd,0)) / $pembagi as actsd
																				, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																				, sum(nvl(actall,0)) / $pembagi as actall
																				, sum(nvl(trend,0)) / $pembagi as trend
															from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

										where a.kode_fs = '$model' order by  rowindex";

			$rs = $this->dbLib->execute($sql2);

			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if($row->kode_neraca == 'EBD') $done = true;
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
							$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary

			$this->generateResultDatel($rootNode, $result, $neraca, true);
		};
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where tahun = '$thn1' $filter3 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
									where  $filter4 and tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  $filter4 and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where  $filter4 and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		if ($datel == '') $datel ='Telkom Regional';
		$sql2 = "select '$datel' as ubis,'$datel' as kode_neraca, '$datel' as nama, '-' as tipe, 'PENDAPATAN' as jenis_akun, '-' as sum_header,0 as level_spasi, '00' as kode_induk, 0 as rowindex
				, 0 as aggthn, 0 as aggbln, 0 as aggsd
				, 0 as actbln, 0 as actsd, 0 as actblnlalu
				, 0 as actall, 0 as trend
				, 0 as acvpsn, 0 as acvgap
				, 0 as growthpsn, 0 as growthgap
				, 0 as acvytdpsn
				, 0 as acvytdrp, 0 as ytdpsn
				, 0 as growthytypsn, 0 as growthytyrp
				, 0 as contrib, 0 as nilai_rev, 0 as nilai_exp, 0 as contrib2
				from dual
				union
				select distinct '$datel' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 1 as level_spasi, case when level_spasi = 0 then '$datel' else a.kode_induk end as kode_induk, a.rowindex + 1 as rowindex
												, (nvl(b.aggthn,0))  as aggthn
												,( nvl(b.aggbln,0) ) as aggbln
												,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln
												,( nvl(b.actsd,0)) as actsd
												,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' and instr(a.nama ,'MINOR') = 0 order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;

		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
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
				if ($row->kode_neraca == 'EBD')$done = true;
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
						$nodeHeader->data->actsdlalu += $val->data->actsdlalu;
						$nodeHeader->data->actall += $val->data->actall;
					}
				}
			}
		}
		//perlu hitung ke summary
		//$result = array('rs' => array('rows' => array() ) );
		$this->generateResultDatel($rootNode, $result, $neraca);
		$nodeUbis = $result["rs"]["rows"][0];
		$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
		$nodeUbis["aggthn"] = $nodeEBD["aggthn"];
		$nodeUbis["aggbln"] = $nodeEBD["aggbln"];
		$nodeUbis["trend"] = $nodeEBD["trend"];
		$nodeUbis["aggsd"] = $nodeEBD["aggsd"];
		$nodeUbis["actbln"] = $nodeEBD["actbln"];
		$nodeUbis["actsd"] = $nodeEBD["actsd"];
		$nodeUbis["actblnlalu"] = $nodeEBD["actblnlalu"];
		$nodeUbis["actall"] = $nodeEBD["actall"];
		$nodeUbis["acvgap"] = $nodeEBD["acvgap"];
		$nodeUbis["acvpsn"] = $nodeEBD["acvpsn"];
		$nodeUbis["growthpsn"] = $nodeEBD["growthpsn"];
		$nodeUbis["growthgap"] = $nodeEBD["growthgap"];
		$nodeUbis["acvytdrp"] = $nodeEBD["acvytdrp"];
		$nodeUbis["grwytdgap"] = $nodeEBD["grwytdgap"];
		$nodeUbis["growthytyrp"] = $nodeEBD["growthytyrp"];
		$nodeUbis["contrib"] = $nodeEBD["contrib"];
		$nodeUbis["contrib2"] = $nodeEBD["contrib3"];
		$nodeUbis["contrib3"] = $nodeEBD["growthytyrp3"];
		$result["rs"]["rows"][0] = $nodeUbis;


		return json_encode($result);

	}
	function getDataEXSUMDatelDetail3($model, $periode, $datel = null, $neraca = null, $segmen = null, $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
			}
		}
		if ($datel == "")
			$filter3 = "and a.jenis = 'S' and ((substr(a.kode_akun,1,1) ='4' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%')  )
											or (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))";
		else
			$filter3 = "and b.kode_induk like '$datel%' and (( kode_akun like '4%' and a.jenis in ($jenis)) or ( not (kode_akun like '4%') and a.jenis = 'S') ) ";

		if (strlen($datel) == 7){
			$filter = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
			$filter4 = "(substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and a.kode_cc = '$datel%') or ";
			$filter3 = "  and jenis in ($jenis) and a.kode_cc = '$datel' ";
		}else if (strlen($datel) == 4) {
			$filter = " and a.jenis = 'S' " ;
			$filter4 = "(substr(a.kode_akun,1,1) ='4' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%')  )
											or ";
		}else{
			$filter = " and a.jenis = 'S' " ;
			$filter4 = "(substr(a.kode_akun,1,1) ='4' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%')  )
											or ";
		}

		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where tahun = '$thn1' $filter3 group by kode_akun, tahun ) b on b.kode_akun = a.kode_akun
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
									where  ($filter4 (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))
										and tahun = '$thn1' $filter group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									where  ($filter4 (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))
										and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where  ($filter4 (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))
										and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct a.kode_neraca, concat(d.kode_akun, '-', d.nama) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
										inner join exs_masakun d on d.kode_akun  = c.kode_akun
										inner join (select x.kode_neraca, x.kode_akun
																			, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model' and a.kode_neraca = '$neraca' order by  rowindex";
		//error_log($sql2);
		$rs = $this->dbLib->execute($sql2);

		$result = array('rs' => array('rows' => array() ) );

		while ($row = $rs->FetchNextObject(false)){

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

			if ($row->jenis_akun == "PENDAPATAN"){
				$row->aggthn = -round($row->aggthn,0);
				$row->aggbln = -round($row->aggbln,0);
				$row->trend = -round($row->trend,0);
				$row->aggsd = -round($row->aggsd,0);
				$row->actbln = -round($row->actbln,0);
				$row->actsd = -round($row->actsd,0);
				$row->actblnlalu = -round($row->actblnlalu,0);
				$row->actall = -round($row->actall,0);
				$row->acvgap = -round($row->actbln - $row->aggbln,0);
				$row->growthpsn = floatval($row->trend) == 0 ? 0 : -round( ($row->actbln - $row->trend) / $row->trend * 100,1 );
				$row->growthgap = -round($row->actbln - $row->trend,0);
			}else{
				$row->aggthn = round($row->aggthn,0);
				$row->aggbln = round($row->aggbln,0);
				$row->trend = round($row->trend,0);
				$row->aggsd = round($row->aggsd,0);
				$row->actbln = round($row->actbln,0);
				$row->actsd = round($row->actsd,0);
				$row->actblnlalu = round($row->actblnlalu,0);
				$row->actall = round($row->actall,0);
				$row->acvgap = round($row->actbln - $row->aggbln,0);
				$row->growthpsn = floatval($row->trend) == 0 ? 0 : round( ($row->actbln - $row->trend) / $row->trend * 100,1 );
				$row->growthgap = round($row->actbln - $row->trend,0);
			}
			$result["rs"]["rows"][] = $row;
		}


		return json_encode($result);

	}
	function getDataEXSUMDatelDetail($model, $periode, $datel = null, $neraca = null, $kode_ubis = null,  $pembagi = 1000000000){
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
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default : $jenis= "'C','E','B','ZC','ZE','ZB','S','H'";
				break;
			}
		}
		//error_log("getDataEXSUMDatel $jenis $segmen");
		if (strlen($datel) == 7){
			$filter = "   ";
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)  ";//and segmen in ($jenis)
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )  ";//and segmen in ($jenis)


		}else if (strlen($datel) == 4) {
			$filter = "   " ;
			if (substr($datel,0,2) == "T6"){
				$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
						and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 like '$kode_ubis%' )
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)";
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ))and kode_ubis2 like '$kode_ubis%' )  ";//and segmen in ($jenis)


			}else {
				$filter4 = "((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";//and segmen in ($jenis)
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select witel from exs_divre a inner join exs_ubis b on b.kode_ubis = a.kode_ubis where b.kode_induk = '$datel' )) and kode_ubis2 like '$kode_ubis%' )  ";//and segmen in ($jenis)

			}
		}else{
			$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )  ";//and segmen in ($jenis)


			$filter = "  " ;
			$filter4 = " ((a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) ) and  a.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%')
					and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							)    ";// and segmen in ($jenis
		}

		$result = array('rs' => array('rows' => array() ) );
		// budget untuk witel diambil dari budget witel
		//"left outer join exs_mappc bb on bb.kode_pc = a.kode_cc  and bb.kode_witel like '$datel%' ";
		//"and (a.kode_cc like 'T651%' or a.kode_cc between 'T711A00' and 'T718Z99' or a.kode_cc like 'T903%' or a.kode_cc like 'T904%' or a.kode_cc like 'T701%' or a.kode_cc like 'T905%' or a.kode_cc like 'T906%')";
		global $userlog;
		$session_id = $this->getSessionId();//md5($userlog . date("r"));
		
		$this->dbLib->execute("insert into exs_process_agg(kode_akun, tahun, aggthn, aggsd, aggbln, session_id)
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
												end) as aggbln, '$session_id' as session_id
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									inner join exs_relakun x on a.kode_akun = x.kode_akun
									where tahun = '$thn1' and x.kode_neraca = '$neraca' and x.kode_fs ='$model'  $filter3 group by a.kode_akun, tahun
							 ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select a.kode_akun, tahun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
												end) as actbln,'$session_id' as session_id,'C'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									inner join exs_relakun x on a.kode_akun = x.kode_akun
									where  $filter4 and x.kode_neraca = '$neraca' and x.kode_fs ='$model' and tahun = '$thn1' $filter group by  a.kode_akun, tahun ");

		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun, actthn, actsd, actbln, session_id, jenis)
								select  a.kode_akun, tahun,
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
												end) as actbln,'$session_id' as session_id,'LY'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									inner join exs_relakun x on a.kode_akun = x.kode_akun
									where  $filter4 and x.kode_neraca = '$neraca' and x.kode_fs ='$model' and tahun = '$thn2' $filter group by a.kode_akun, tahun ");
		$this->dbLib->execute("insert into exs_process_actual(kode_akun, tahun,actthn, actsd, actbln, actblnlalu, session_id, jenis)
							select  a.kode_akun, tahun, 0,0,0,
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
												end) as actblnlalu,'$session_id' as session_id,'LM'
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									inner join exs_ubis z on z.kode_ubis = b.kode_ubis
									inner join exs_relakun x on a.kode_akun = x.kode_akun
									where  $filter4 and x.kode_neraca = '$neraca' and x.kode_fs ='$model' and tahun = '$thn3' $filter group by a.kode_akun, tahun");
		$this->dbLib->execute("insert into exs_process_summakun
									(kode_akun, tahun, kode_neraca, aggthn, aggbln, aggsd,actthn, actsd, actbln, actblnlalu, actblnthnlalu, session_id)
									select a.kode_akun, b.tahun, '-'
										, b.aggthn, b.aggbln, b.aggsd
										, c.actthn, c.actsd, c.actbln, e.actblnlalu as trend
										, d.actsd as actall
													,'$session_id' as session_id
										from exs_masakun a
										left outer join exs_process_agg b on b.kode_akun = a.kode_akun and b.tahun='$thn1' and b.session_id = '$session_id'
										left outer join exs_process_actual c on c.kode_akun = a.kode_akun and c.tahun='$thn1' and c.jenis = 'C' and c.session_id = '$session_id'
										left outer join exs_process_actual d on d.kode_akun = a.kode_akun and d.tahun='$thn2' and d.jenis = 'LY' and d.session_id = '$session_id'
										left outer join exs_process_actual e on e.kode_akun = a.kode_akun and e.tahun='$thn3' and e.jenis = 'LM' and e.session_id = '$session_id'
										 ");

		$sql2 = "select x.kode_neraca as nrc, x.kode_akun as kode_neraca, concat(x.kode_akun, '-', b.nama) as nama, 0 as level_spasi
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggthn,0)) / $pembagi as aggthn
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggbln,0) ) / $pembagi as aggbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(aggsd,0)) / $pembagi as aggsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actbln,0))/ $pembagi  as actbln
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actsd,0)) / $pembagi as actsd
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnlalu,0)) / $pembagi  as trend
									, sum(case when c.jenis_akun = 'PENDAPATAN' then -1 else 1 end * nvl(actblnthnlalu,0)) / $pembagi as actall
									, 0 as actblnlalu
				from exs_relakun x
					inner join exs_masakun b on b.kode_akun = x.kode_akun
					inner join exs_process_summakun y on y.kode_akun = x.kode_akun
					inner join exs_neraca c on c.kode_neraca = x.kode_neraca and c.kode_fs = x.kode_fs
				where x.kode_fs = '$model' and x.kode_neraca = '$neraca' and session_id='$session_id'
				group by x.kode_neraca, x.kode_akun, b.nama order by kode_neraca";

		$witel = $datel;
		if ($datel == '') $datel ='Telkom Regional';


		$detailAkun = new server_util_Map();
		$rsa = $this->dbLib->execute($sql2);
		while ($rowa = $rsa->FetchNextObject(false)){
			if ($detailAkun->get($rowa->nrc) == null){
				$listAkun = array();
			}else $listAkun = $detailAkun->get($rowa->nrc);
			$listAkun[] = $rowa;
			$detailAkun->set($rowa->nrc, $listAkun);
		}

		$listAkun = $detailAkun->get($neraca);
		if ($listAkun != null){
			foreach ($listAkun as $key => $value) {
				$value->level_spasi = $row->level_spasi + 1;
				$value->acvpsn = floatval($value->aggbln) == 0 ? 0 : round($value->actbln / $value->aggbln * 100,1);
				$value->acvgap = round($value->actbln - $value->aggbln,0);
				$value->growthpsn = floatval($value->trend) == 0 ? 0 : round( ($value->actbln - $value->trend) / $value->trend * 100,1 );
				$value->growthgap = round($value->actbln - $value->trend,0);
				$value->acvytdpsn = floatval($value->aggsd) == 0 ? 0  : round($value->actsd / $value->aggsd * 100,1);
				$value->acvytdrp = round($value->actsd - $value->aggsd);
				$value->grwytdpsn = floatval($value->actall) == 0 ? 0 : round(($value->actsd - $value->actall) / $value->actall * 100,1 );
				$value->grwytdgap = round($value->actsd - $value->actall);
				$value->ytdpsn = floatval($value->aggthn) == 0 ? 0 : round($value->actsd / $value->aggthn * 100,1);
				$value->growthytypsn = floatval($value->actall) == 0 ? 0 :round( ($value->actsd - $value->actall) / $value->actall * 100 ,1 );
				$value->growthytyrp = round($value->actsd -  $value->actall);
				$value->aggthn = round($value->aggthn,0);
				$value->aggbln = round($value->aggbln,0);
				$value->trend = round($value->trend,0);
				$value->aggsd = round($value->aggsd,0);
				$value->actbln = round($value->actbln,0);
				$value->actsd = round($value->actsd,0);
				$value->actblnlalu = round($value->actblnlalu,0);
				$value->actall = round($value->actall,0);

				if ($value->aggthn != 0 || $value->aggbln != 0 || $value->aggsd != 0 || $value->actbln != 0 || $value->actsd != 0 || $value->actall != 0 || $value->trend != 0 )
					$result["rs"]["rows"][] = (array) $value;
			}
		}


		$this->deleteSession($session_id);

		return json_encode($result);

	}
	function generateResultDatel($item, &$result, $neraca = null, $revMinus = null){
		foreach ($item->childs as $key => $val){

			/*$val->data->acvpsn = floatval($val->data->aggbln) == 0 ? 0 : round($val->data->actbln / $val->data->aggbln * 100,1);
			if ($val->data->aggbln < 0 && $val->data->actbln > 0){
				$val->data->acvpsn = $val->data->aggbln == 0 ? 0 : round((($val->data->actbln / -$val->data->aggbln) + 1) * 100 ,1);
			}

			$val->data->acvytdpsn = floatval($val->data->aggsd) == 0 ? 0  : round($val->data->actsd / $val->data->aggsd * 100,1);
			if ($val->data->aggsd < 0 && $val->data->actsd > 0){
				$val->data->acvytdpsn = $val->data->aggsd == 0 ? 0 : round($val->data->acvytdrp / $val->data->aggsd  * 100 * -1,1);
			}

			$val->data->grwytdpsn = floatval($val->data->actall) == 0 ? 0 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );

			$val->data->ytdpsn = floatval($val->data->aggthn) == 0 ? 0 : round($val->data->actsd / $val->data->aggthn * 100,1);

			if ($val->data->trend < 0 && $val->data->actbln > 0){
				$val->data->growthpsn = $val->data->trend == 0 ? 0 : round($val->data->growthgap / $val->data->trend  * 100 * -1,1);
			}
			$val->data->growthytypsn = floatval($val->data->actall) == 0 ? 0 :round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );
			if ($val->data->actall < 0 && $val->data->actsd > 0){
				$val->data->growthytypsn = $val->data->actall == 0 ? 100 : round( ($val->data->actsd - $val->data->actall) / $val->data->actall  * 100 * -1,1);
			}
			*/


			//error_log($val->data->nama.":".$val->data->acvpsn .":".$val->data->growthpsn .":".$val->data->acvytdpsn .":".$val->data->grwytdpsn.":".$val->data->ytdpsn.":".$val->data->growthytypsn );
			if (!isset($val->data->ubis)){
				if ($val->data->kode_neraca == 'OE'){
					$this->nodeExp = $val;
					$this->dataExp = (array) $val->data;
				}else if ($val->data->kode_neraca == 'AR'){
					$this->nodeRev = $val;
					$this->dataAR = (array) $val->data;
				}
			}else if ($val->data->ubis == "NAS" && $val->data->kode_neraca == "AR"){
				$this->nodeRev = $val;
				$this->dataAR = (array) $val->data;
			}else if ($val->data->ubis == "NAS" && $val->data->kode_neraca == "OE"){
				$this->nodeExp = $val;
				$this->dataExp = (array) $val->data;
			}else if ($val->data->ubis == "Telkom Regional" && $val->data->kode_neraca == "AR"){
				$this->nodeRev = $val;
				$this->dataAR = (array) $val->data;
			}else if ($val->data->ubis == "Telkom Regional" && $val->data->kode_neraca == "OE"){
				$this->nodeExp = $val;
				$this->dataExp = (array) $val->data;
			}



			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->aggthn = -round($val->data->aggthn,0);
				$val->data->aggbln = -round($val->data->aggbln,0);
				$val->data->trend = -round($val->data->trend,0);
				$val->data->aggsd = -round($val->data->aggsd,0);
				$val->data->actbln = -round($val->data->actbln,0);
				$val->data->actsd = -round($val->data->actsd,0);
				$val->data->actblnlalu = -round($val->data->actblnlalu,0);
				$val->data->actall = -round($val->data->actall,0);
				$val->data->acvgap = round($val->data->actbln - $val->data->aggbln,0);
				//$val->data->growthpsn = floatval($val->data->trend) == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
				$val->data->growthgap = round($val->data->actbln - $val->data->trend,0);
				$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
				$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);
				$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);

			}else{
				$val->data->aggthn = round($val->data->aggthn,0);
				$val->data->aggbln = round($val->data->aggbln,0);
				$val->data->trend = round($val->data->trend,0);
				$val->data->aggsd = round($val->data->aggsd,0);
				$val->data->actbln = round($val->data->actbln,0);
				$val->data->actsd = round($val->data->actsd,0);
				$val->data->actblnlalu = round($val->data->actblnlalu,0);
				$val->data->actall = round($val->data->actall,0);
				$val->data->acvgap = round($val->data->actbln - $val->data->aggbln,0);
				//$val->data->growthpsn = floatval($val->data->trend) == 0 ? 0 : round( ($val->data->actbln - $val->data->trend) / $val->data->trend * 100,1 );
				$val->data->growthgap = round($val->data->actbln - $val->data->trend,0);
				$val->data->acvytdrp = round($val->data->actsd - $val->data->aggsd);
				$val->data->grwytdgap = round($val->data->actsd - $val->data->actall);
				$val->data->growthytyrp = round($val->data->actsd -  $val->data->actall);
			}
			$val->data->acvpsn = $this->rumusAchieve($val->data->aggbln, $val->data->actbln);//floatval($val->data->aggbln) == 0 ? 100 : round($val->data->actbln / $val->data->aggbln * 100,1);
			$val->data->growthpsn = $this->rumusGrowth($val->data->actbln,$val->data->trend);
			$val->data->acvytdpsn = $this->rumusAchieve($val->data->aggsd, $val->data->actsd);//floatval($val->data->aggsd) == 0 ? 100  : round($val->data->actsd / $val->data->aggsd * 100,1);
			$val->data->grwytdpsn = $this->rumusGrowth($val->data->actsd,$val->data->actall);//floatval($val->data->actall) == 0 ? 100 : round(($val->data->actsd - $val->data->actall) / $val->data->actall * 100,1 );

			$val->data->ytdpsn = $this->rumusAchieve($val->data->aggthn, $val->data->actsd);//floatval($val->data->aggthn) == 0 ? 100 : round($val->data->actsd / $val->data->aggthn * 100,1);

			$val->data->growthytypsn = $this->rumusGrowth($val->data->actsd,$val->data->actall);//floatval($val->data->actall) == 0 ? 100 :round( ($val->data->actsd - $val->data->actall) / $val->data->actall * 100 ,1 );

			if ($val->data->jenis_akun == "PENDAPATAN"){
				$val->data->contrib = floatval($this->nodeRev->data->actsd) == 0 ? 0 : round($val->data->actsd / $this->nodeRev->data->actsd * 100, 1);
				$val->data->contrib2 = floatval($this->nodeRev->data->actblnlalu) == 0 ? 0 :round ( ($val->data->actblnlalu / $this->nodeRev->data->actblnlalu)  * 100,1);
				$val->data->contrib3 = floatval($this->nodeRev->data->actall) == 0 ? 0 : round ( ($val->data->actall / $this->nodeRev->data->actall)  * 100,1);
				$val->data->nilai_rev = $this->nodeRev->data->actsd;
			}else if ($val->data->jenis_akun == "BEBAN"){
				$val->data->contrib =  floatval($this->nodeExp->data->actsd) == 0 ? 0 : round($val->data->actsd / $this->nodeExp->data->actsd * 100, 1);
				$val->data->contrib2 = floatval($this->nodeExp->data->actblnlalu) == 0 ? 0 : round ( ($val->data->actblnlalu / $this->nodeExp->data->actblnlalu)  * 100,1);
				$val->data->contrib3 = floatval($this->nodeExp->data->actall) ==0 ? 0 : round ( ($val->data->actall / $this->nodeExp->data->actall)  * 100,1);
				$val->data->nilai_exp = $this->nodeExp->data->actsd;
			}else
				$val->data->contrib = round($val->data->contrib);
			if ($val->data->kode_neraca == 'LRU'){
				if ($val->data->aggbln < 0 && $val->data->actbln > 0){
					$val->data->acvpsn = floatval($val->data->aggbln) == 0 ? 0 : round((($val->data->actbln / $val->data->aggbln) + 1) * 100 * -1,1);
				}
			}
			if ($val->data->ubis == $val->data->nama){
				$result["rs"]["rows"][] = (array) $val->data;
				$this->ubisIsRoot = true;
				$this->ubis = $val->data->kode_neraca;
			}else if ($val->data->kode_neraca == $neraca ){
				if ($val->data->aggthn !=0 || $val->data->aggbln != 0 || $val->data->trend != 0 || $val->data->aggsd != 0 || $val->data->actbln != 0 || $val->data->actsd != 0 || $val->data->actblnlalu != 0 || $val->data->actall != 0)
					$result["rs"]["rows"][] = (array) $val->data;
				$this->collectData = true;
			}else if (!isset($neraca)){
				if ($val->data->aggthn !=0 || $val->data->aggbln != 0 || $val->data->trend != 0 || $val->data->aggsd != 0 || $val->data->actbln != 0 || $val->data->actsd != 0 || $val->data->actblnlalu != 0 || $val->data->actall != 0)
					$result["rs"]["rows"][] = (array) $val->data;
			}else if ($this->collectData){
				//error_log($val->data->kode_induk .":". $this->ubis);
				if ($this->ubisIsRoot && $val->data->kode_induk == $this->ubis){
					$this->collectData = false;
				}else if ($val->data->kode_induk == "00")
					$this->collectData = false;
				else {
					if ($val->data->kode_neraca != "EBD"){
						if ($val->data->aggthn !=0 || $val->data->aggbln != 0 || $val->data->trend != 0 || $val->data->aggsd != 0 || $val->data->actbln != 0 || $val->data->actsd != 0 || $val->data->actblnlalu != 0 || $val->data->actall != 0){
							$result["rs"]["rows"][] = (array) $val->data;
						}
					}
				}
			}
			$this->generateResultDatel($val, $result, $neraca, $revMinus);
		}
	}
	function getDataTrendDatel($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			/*
				$filter3 = "and ( (a.jenis in ('S','F', $jenis) and tahun >= '2014')  or (tahun < '2014' and a.jenis in ($jenis) ) )
					and a.kode_cc in (select distinct kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis like '$kode_ubis%' )  ";//and segmen in ($jenis)

			*/
			if ($datel == "Cons")
				$datel = "";
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";
			$rs = $this->dbLib->execute("
				select '$filterWitel' as ubis, '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$filterWitel' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			/*if (substr($filterWitel,0,2) == "T6"  ){
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_ubis = '$filterWitel' or not  a.kode_ubis like '".substr($filterWitel,0,2)."%'
					order by kode_ubis");
			}else */
				$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis2 as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					where a.kode_witel like '$filterWitel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$filterWitel' )
					order by a.urut_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{

				$resConsumer = $this->getDataTrendSegmenDatel($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendSegmenDatel($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {

				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$kode_ubis' as ubis, a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return ($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendDatelAkun($model, $thn1, $thn2, $datel = null, $neraca= null, $kode_ubis = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			$filterWitel = $datel;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) and kode_ubis2 like '$kode_ubis%')
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
								and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 like '$kode_ubis%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca
											inner join exs_masakun c on c.kode_akun = b.kode_akun
											where a.kode_fs = '$model' and a.kode_neraca = '$neraca' order by  rowindex");
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
	function getDataTrendSegmenDatelAkun($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {

				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
			}
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return ($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataBudgetTrendDatel($model, $thn1, $thn2, $datel = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis = 'S' and ((substr(a.kode_akun,1,1) ='4' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  )
											or (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))";
			}
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn1' $filter group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn2'  $filter group by  kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/$pembagi as jan1
											, nvl(b.feb, 0)/$pembagi as feb1
											, nvl(b.mar, 0)/$pembagi as mar1
											, nvl(b.apr, 0)/$pembagi as apr1
											, nvl(b.mei, 0)/$pembagi as mei1
											, nvl(b.jun, 0)/$pembagi as jun1
											, nvl(b.jul, 0)/$pembagi as jul1
											, nvl(b.aug, 0)/$pembagi as aug1
											, nvl(b.sep, 0)/$pembagi as sep1
											, nvl(b.okt, 0)/$pembagi as okt1
											, nvl(b.nop, 0)/$pembagi as nop1
											, nvl(b.des, 0)/$pembagi as des1
											, nvl(b.total, 0)/$pembagi as total1
											, nvl(b.jan2, 0)/$pembagi as jan2
											, nvl(b.feb2, 0)/$pembagi as feb2
											, nvl(b.mar2, 0)/$pembagi as mar2
											, nvl(b.apr2, 0)/$pembagi as apr2
											, nvl(b.mei2, 0)/$pembagi as mei2
											, nvl(b.jun2, 0)/$pembagi as jun2
											, nvl(b.jul2, 0)/$pembagi as jul2
											, nvl(b.aug2, 0)/$pembagi as aug2
											, nvl(b.sep2, 0)/$pembagi as sep2
											, nvl(b.okt2, 0)/$pembagi as okt2
											, nvl(b.nop2, 0)/$pembagi as nop2
											, nvl(b.des2, 0)/$pembagi as des2
											, nvl(b.total2, 0)/$pembagi as total2
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
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
											where tahun='$thn1' $filter  group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";

			$rs2 = $this->dbLib->execute("
					select a.kode_neraca, concat(left_pad(a.nama,level_spasi),'(BUDGET)') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi , a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/$pembagi as jan1
											, nvl(b.feb, 0)/$pembagi as feb1
											, nvl(b.mar, 0)/$pembagi as mar1
											, nvl(b.apr, 0)/$pembagi as apr1
											, nvl(b.mei, 0)/$pembagi as mei1
											, nvl(b.jun, 0)/$pembagi as jun1
											, nvl(b.jul, 0)/$pembagi as jul1
											, nvl(b.aug, 0)/$pembagi as aug1
											, nvl(b.sep, 0)/$pembagi as sep1
											, nvl(b.okt, 0)/$pembagi as okt1
											, nvl(b.nop, 0)/$pembagi as nop1
											, nvl(b.des, 0)/$pembagi as des1
											, nvl(b.total, 0)/$pembagi as total1
											, nvl(b.jan2, 0)/$pembagi as jan2
											, nvl(b.feb2, 0)/$pembagi as feb2
											, nvl(b.mar2, 0)/$pembagi as mar2
											, nvl(b.apr2, 0)/$pembagi as apr2
											, nvl(b.mei2, 0)/$pembagi as mei2
											, nvl(b.jun2, 0)/$pembagi as jun2
											, nvl(b.jul2, 0)/$pembagi as jul2
											, nvl(b.aug2, 0)/$pembagi as aug2
											, nvl(b.sep2, 0)/$pembagi as sep2
											, nvl(b.okt2, 0)/$pembagi as okt2
											, nvl(b.nop2, 0)/$pembagi as nop2
											, nvl(b.des2, 0)/$pembagi as des2
											, nvl(b.total2, 0)/$pembagi as total2
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
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

			$this->generateResultTrendDatel($rootNode, $result, $thn2, $neraca);

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

			$this->generateResultTrendDatel($rootNode, $result, $thn2, $neraca);
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendDatelBudget($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if ($datel == "Cons")
				$datel = "";

			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			}


			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";
			$rs = $this->dbLib->execute("
				select '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			/*if (substr($filterWitel,0,2) == "T6"  ){
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_ubis = '$filterWitel' or not  a.kode_ubis like '".substr($filterWitel,0,2)."%'
					order by kode_ubis");
			}else */
				$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis2 as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					where a.kode_witel like '$filterWitel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$filterWitel' )
					order by a.urut_ubis");

				/*$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$filterWitel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$filterWitel' )
					order by kode_ubis");*/
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{

				$resConsumer = $this->getDataTrendSegmenDatelBudget($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendSegmenDatelBudget($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {

				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return ($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendDatelBudgetAkun($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis in ('S','F','E','B','H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";
			$rs = $this->dbLib->execute("
				select '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					order by kode_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{

				$resConsumer = $this->getDataTrendSegmenDatel($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendSegmenDatelBudgetAkun($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis in ('S','F','E','B','H') and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis = '$kode_ubis')";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return ($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	//--outlook
	function getDataTrendOutlookDatel($model, $thn1, $thn2, $datel = null, $neraca = null, $metode = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;

			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";
			$rs = $this->dbLib->execute("
				select '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			/*if (substr($filterWitel,0,2) == "T6"  ){
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_ubis = '$filterWitel' or not  a.kode_ubis like '".substr($filterWitel,0,2)."%'
					order by kode_ubis");
			}else */
				$rs = $this->dbLib->execute("select distinct b.nama, a.kode_ubis2 as kode_ubis, a.urut_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis2
					where a.kode_witel like '$filterWitel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$filterWitel' )
					order by a.urut_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{

				$resConsumer = $this->getDataTrendSegmenOutlookDatel($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendSegmenOutlookDatel($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {

				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis2 = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select a.kode_neraca, left_pad(a.nama,level_spasi + 1) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return ($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	function getDataTrendOutlookDatel2($model, $thn1, $thn2, $datel = null, $neraca= null, $metode = null,$pembagi = 1000000000){
		try{
			if (!isset($metode)) $metode = "GROWTH";
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else if (strlen($datel) == 4) {
				$filter = " and a.kode_cc like '$datel%' and  a.jenis = 'S'  ";
			}else{
				$filter = " and b.kode_induk like '$datel%' and a.jenis = 'S' ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where a.kode_cc like 'T91%' and tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where a.kode_cc like 'T91%' and tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, left_pad(a.nama,level_spasi) as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca ) b on b.kode_neraca = a.kode_neraca

											where a.kode_fs = '$model' order by  rowindex");

			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
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
					$total = 0;
					//3 bulan sebelumnya
					$start = $month - 3;
					for ($i = $start; $i <= $month; $i++){
						$total += $value[$listBulan[$i-1]."1"];
					}
					$avg = $total / 4;
					$total = $row->total1;
					for ($i = $month + 1; $i <= 12; $i++){
						$total += $avg;
						$value[$listBulan[$i]."1"] = $avg;
						eval("\$row->".$listBulan[$i]."1 = $avg;");
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
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendOutlookDatelDetail2($model, $thn1, $thn2, $ubis = null, $neraca= null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (substr($ubis,0,5) == "FINOP")
				$filter = " and z.kode_ubis in (select kode_ubis from exs_finop_ubis where kode_finop='".substr($ubis,5,2)."') ";
			else if (strlen($ubis) > 4)
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
			$rs = $this->dbLib->execute("select x.kode_neraca, x.kode_akun, y.kode_cc
																, (nvl(jan,0) ) as jan1
																, (nvl(feb,0) ) as feb1
																, (nvl(mar,0) ) as mar1
																, (nvl(apr,0) ) as apr1
																, (nvl(mei,0) ) as mei1
																, (nvl(jun,0) ) as jun1
																, (nvl(jul,0) ) as jul1
																, (nvl(aug,0) ) as aug1
																, (nvl(sep,0) ) as sep1
																, (nvl(okt,0) ) as okt1
																, (nvl(nop,0) ) as nop1
																, (nvl(des,0) ) as des1
																, (nvl(total,0) ) as total1
																, (nvl(jan2,0) ) as jan2
																, (nvl(feb2,0) ) as feb2
																, (nvl(mar2,0) ) as mar2
																, (nvl(apr2,0) ) as apr2
																, (nvl(mei2,0) ) as mei2
																, (nvl(jun2,0) ) as jun2
																, (nvl(jul2,0) ) as jul2
																, (nvl(aug2,0) ) as aug2
																, (nvl(sep2,0) ) as sep2
																, (nvl(okt2,0) ) as okt2
																, (nvl(nop2,0) ) as nop2
																, (nvl(des2,0) ) as des2
																, (nvl(total2,0) ) as total2

															from exs_relakun x inner join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' ");
			$listBulan = array("jan","jan","feb","mar","apr","mei","jun","jul","aug","sep","okt","nop","des");
			$result = array('rs' => array('rows' => array() ) );
			//save to file
			uses("server_modules_xls_Writer", false);
			global $manager;
			$options = new server_util_Map();
	        $data = new server_util_arrayList();
	        $options->set("fields", new server_util_arrayList());
	        $options->get("fields")->add("kode_akun");
	        $options->get("fields")->add("kode_cc");
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
	        $title->add(new server_util_Map(array("title" => "Cost-Profit Center", "width" => 10)));
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
	        $optionsData = new server_util_arrayList();
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
			$options->set("data", $optionsData);
			$excel = new server_util_Xls();
			$file = md5(date("r"));
			$excel->generate($options, $file);
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
	function generateResultTrendDatel($item, &$result, $thn2, $neraca = null){
		foreach ($item->childs as $key => $line){
			//error_log("genereateResult " . $line->data->nama);
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

			$this->generateResultTrendDatel($line, $result, $thn2, $neraca);
		}
	}
	function getDataRevDatel($model, $periode, $datel = null, $pembagi = 1000000000){
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
		$filter = "and a.jenis = 'S' and ((substr(a.kode_akun,1,1) ='4' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  )
											or (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))";

		//$filter = " and a.kode_cc like '%' and a.kode_cc like 'T91%' and a.jenis = 'S'  ";
		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthn, c.actbln, c.actsd, d.actblnlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									 where tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									where tahun = '$thn1' $filter group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actblnlalu,
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
									where tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
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
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' order by  rowindex";
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
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultDatel($rootNode, $result);
		if (strlen($datel) == 7){
			$filter = "  and a.kode_cc = '$datel' ";
		}else if (strlen($datel) == 4) {
			$filter = " and a.kode_cc like '$datel%' ";
		}else{
			$filter = " and b.kode_cc like 'T91%' and b.kode_induk like '$datel%' ";
		}
		$rsu = $this->dbLib->execute("select distinct a.kode_witel, b.nama from exs_cc a
					inner join exs_cc b on b.kode_cc = a.kode_witel where a.kode_witel <> '-'
					and a.kode_witel <> '00' $filter order by a.kode_witel");

		while ($rowUbis = $rsu->FetchNextObject(false)){
			$datel = $rowUbis->kode_witel;
			if (strlen($datel) == 7){
				$filter = "  and a.jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else if (strlen($datel) == 4) {
				$filter = " and a.kode_cc like '$datel%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}else{
				$filter = " and b.kode_cc like 'T91%' and b.kode_induk like '$datel%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}
			$namaWitel = $rowUbis->nama;
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthn, c.actbln, c.actsd, d.actblnlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									inner join exs_cc b on b.kode_cc= a.kode_cc
									where tahun = '$thn1' $filter group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actblnlalu,
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
									where tahun = '$thn2' $filter group by   kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									 where tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct '$namaWitel' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
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
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' order by  rowindex";

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
							$nodeHeader->data->actall += $val->data->actall;
						}
					}
				}
			}
			//perlu hitung ke summary
			$this->generateResultDatel($rootNode, $result);

		}

		return json_encode($result);
	}
	function getDataExpDatel($model, $periode, $datel = null, $pembagi = 1000000000){
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
		//$filterNas = "and b.kode_cc like 'T91%' and b.kode_induk like '%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
		$filterNas = "and a.jenis in ('S','E','C','B','ZE','ZB','ZC') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '%' ) ";
		$rsu = $this->dbLib->execute("select distinct a.kode_witel, b.nama from exs_cc a inner join exs_cc b on b.kode_cc = a.kode_witel where a.kode_witel <> '-'  and a.kode_witel <> '00' and a.kode_witel like '$datel%' order by a.kode_witel");

		$return= new server_util_Map();
		$result = array('rs' => array('rows' => array() ) );
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthn, c.actbln, c.actsd, d.actblnlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where tahun = '$thn1' $filterNas group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									where tahun = '$thn1' $filterNas group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actblnlalu,
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
									where tahun = '$thn2' $filterNas group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where tahun = '$thn3' $filterNas group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
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
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' order by  rowindex";

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
			$this->generateResultDatel($rootNode, $result);

		while ($rowUbis = $rsu->FetchNextObject(false)){
			$datel = $rowUbis->kode_witel;
			if (strlen($datel) == 7){
				$filter = "  and a.jenis in ('C','E','B','ZC','ZE','ZB','H' ) and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis in ('S','C','E','B','ZC','ZE','ZB' ,'H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";
			}
			$namaWitel = $rowUbis->nama;
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall as actthn, c.actbln, c.actsd, d.actblnlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									from exs_mbudget a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									where tahun = '$thn1' $filter group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actblnlalu,
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
									where tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		$sql2 = "select distinct '$namaWitel' as ubis,a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
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
										left outer join (select x.kode_neraca, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca

									where a.kode_fs = '$model' order by  rowindex";

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
			$this->generateResultDatel($rootNode, $result);

		}

		return json_encode($result);
	}
	function getDataAccountDatel($model, $periode, $nTop, $jenis, $order, $sortOrder = null, $datel = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		if ($jenis == "AR"){
			$divisi = substr($datel,0,4);
			$data2 = $this->getDataEXSUMDatelAll($model, $periode,"","AR", true, $pembagi);
			$dataSumm =  $this->dataAR;
		}else{
			$divisi = substr($datel,0,4);
			$data2 = $this->getDataEXSUMDatelAll($model, $periode, "","OE",true, $pembagi);
			$dataSumm = $this->dataExp;
		}

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
		if (strlen($datel) == 7){
				$filter = "  and a.jenis in ('C','E','B','ZC','ZE','ZB','H' ) and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis = 'S' and ((substr(a.kode_akun,1,1) ='4' and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  )
											or (substr(a.kode_akun,1,1) ='5' and a.kode_cc like 'T91%' and b.kode_witel like '$datel%'))";
			}

		if (!isset($sortOrder)) $sortOrder = "desc";
		//select a.kode_cc, b.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actall, c.actbln, c.actsd, d.actblnlalu, d.actbln as actbln2, e.actblnlalu as trend

		$sql = "select a.kode_akun, b.tahun, sum(b.aggthn) / $pembagi as aggthn
											, sum(b.aggbln) / $pembagi as aggbln
											, sum(b.aggsd) / $pembagi as aggsd
											, sum(c.actall) / $pembagi as actthn
											, sum(c.actbln) / $pembagi as actbln
											, sum(c.actsd) / $pembagi as actsd
											, sum(d.actblnlalu) / $pembagi as actall
											, sum(d.actbln) / $pembagi as actblnlalu
											, sum(e.actblnlalu) / $pembagi  as trend
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
									where tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
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
									where tahun = '$thn1' $filter group by kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actblnlalu,
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
									 where tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									 where tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					group by b.tahun, a.kode_akun";
		$rs = $this->dbLib->execute("select x.kode_akun,z.nama,  round((nvl(aggthn,0)),2) as aggthn,
									round((nvl(aggbln,0)),2) as aggbln,
									round((nvl(aggsd,0)),2) as aggsd,
									round((nvl(actbln,0)),2) as actbln,
									round((nvl(actsd,0)),2) as actsd,
									round((nvl(actblnlalu,0)),2) as actblnlalu,
									round((nvl(actall,0)),2) as actall,
									round((nvl(actblnlalu,0)),2) as actlalu,
									case when ". $dataSumm["actall"]." <> 0 then round((nvl(actall,0)) /". $dataSumm["actall"].",2)* 100 else 0 end as contrib,
									case when ".$dataSumm["actsd"]." <> 0 then round((nvl(actsd,0)) / ".$dataSumm["actsd"].",2) * 100 else 0 end as contrib2,
									case when actall <> 0 and not actall is null then round(nvl(actsd - actall,0) / nvl(actall,0) ,2)  else 0 end as growthpsn,
									round(nvl(actsd - actall,0) ,2) as growth,
									round(case when aggbln <> 0 then nvl(actbln,0) / aggbln * 100 else 0 end, 2) as achiev,
									round(case when aggsd <> 0 then nvl(actsd,0) / aggsd * 100 else 0 end, 2) as achiev2,
									round(case when aggsd <> 0 then nvl(actsd,0) - aggsd else 0 end, 2) as achiev3


							from exs_relakun x
								inner join exs_masakun z on z.kode_akun = x.kode_akun and (z.kode_akun like '5%' or z.kode_akun like '4%')
								left outer join ($sql) y on y.kode_akun = x.kode_akun
							where x.kode_fs = '$model' order by $order $sortOrder",20,0);


		$data = array("rs" => array("rows" => array()));
		$count = 0;

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
					$row->achiev = round($row->achiev,2);
					$row->acvpsn = round($row->acvpsn,2);
					$row->growthgap = round(-$row->growthgap,2);
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
					$row->achiev = round($row->achiev,2);
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
	function getDataMyARMPerProduct($periode, $witel, $produk){

	}
	function getDataJejerSegmen($model, $periode, $witel = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bulan = floatval(substr($periode, 4,2));
		$rsUbis = $this->dbLib->execute("select distinct segmen from exs_mappc");
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		$month = array('jan','feb','mar','apr','mei','jun','jul','aug','sep','okt','nop','des');
		$monthSd = "";
		for ($m = 0 ; $m < $bulan; $m++){
			if ($m > 0) $monthSd .= " + ";
			$monthSd .= $month[$m];
		}
		while ($row = $rsUbis->FetchNextObject(false)){
			$field .= ", 0  as b_$row->segmen, 0 as a_$row->segmen";
			$sql = " select a.kode_neraca, a.aggsd, b.actsd
					from (
						select x.kode_neraca, sum($monthSd) as aggsd
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis in ('S','E','C','B','ZE','ZB','ZC')
						inner join exs_cc z on z.kode_cc = y.kode_cc
						where x.kode_fs = '$model' and z.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$witel%' and segmen = '$row->segmen')
						 group by x.kode_neraca ) a
					left outer join (select x.kode_neraca, sum($monthSd) as actsd
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and jenis in ('S','E','C','B','ZE','ZB','ZC')
						inner join exs_cc z on z.kode_cc = y.kode_cc
						where x.kode_fs = '$model' and z.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$witel%' and segmen = '$row->segmen')
						 group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca ";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, array($line->aggsd/ $pembagi,$line->actsd/ $pembagi ) );
			}
			$dataUbis->set($row->segmen, $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggsd,0))/ $pembagi  as aggsd
												, (nvl(c.actsd,0))/ $pembagi  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum($monthSd) as aggsd
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' and z.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$witel%') group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
										left outer join (select x.kode_neraca,sum($monthSd) as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1' and y.jenis = 'S'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' and z.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$witel%') group by x.kode_neraca) c on c.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex");
		$node = "";
		$rootNode = new server_util_NodeNRC("00");
		$this->sumHeader = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					$val = $itemUbis->get($row->kode_neraca);
					$budget = $val[0];
					$actual = $val[1];
					eval ("\$row->b_$key = \$budget;");
					eval ("\$row->a_$key = \$actual;");
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
				if ($row->kode_neraca == 'EBD') $done = true;
			}

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
	//-akun untuk xls
	function getDataAkunJejerActualWitelx($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");
		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct substr(kode_cc,0,4) as kode_witel from exs_cc where kode_cc like 'T91%' order by kode_witel");
		}else{
			$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_ubis like '$ubis%' and kode_cc like 'T91%' and length(kode_cc) = 9 order by kode_witel");
		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();

		while ($row = $rsUbis->FetchNextObject(false)){
			if (strlen($ubis) == 9){
				$filter = "and z.kode_cc = '$row->kode_witel' ";
				$filter2 = "  and y.jenis in ('C','E','B','ZC','ZE','ZB','H' ) ";
			}else if ($ubis == ""){
				$filter = "and z.kode_cc like '$row->kode_witel%'";
				$filter2 = "  and z.kode_cc like '$row->kode_witel%' and (( y.kode_akun like '4%' and y.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (y.kode_akun like '4%') and y.jenis = 'S') )  ";
			}else {
				$filter = "and z.kode_witel = '$row->kode_witel'";
				$filter2 = "  and z.kode_witel = '$row->kode_witel' and (( y.kode_akun like '4%' and y.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (y.kode_akun like '4%') and y.jenis = 'S') )  ";
			}
			$witel = str_replace("-", "", $row->kode_witel);
			$field .= ", 0  as $witel ";
			$sql = " select x.kode_neraca, sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		if ($ubis != ""){
			$field .= ", 0  as total ";
			if (strlen($ubis) == 9){
				$filter = "and z.kode_witel = '$ubis' ";
				$filter2 = "  and z.kode_witel = '$ubis' and (( y.kode_akun like '4%' and y.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (y.kode_akun like '4%') and y.jenis = 'S') )  ";
			}else {
				$filter = " and z.kode_cc like '$ubis%'";
				$filter2 = " and z.kode_cc like '$ubis%' and (( y.kode_akun like '4%' and y.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (y.kode_akun like '4%') and y.jenis = 'S') )  ";
			}
			$sql = " select x.kode_neraca, sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											)/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca";
			$rs = $this->dbLib->execute($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_neraca, $line->agg);
			}
			$dataUbis->set("total", $itemUbis);
		}
		$rs = $this->dbLib->execute("select distinct a.kode_neraca, left_pad(a.nama,level_spasi) as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.actsd,0))  as actsd $field
										from EXS_NERACA a
										left outer join (select x.kode_neraca,sum(
												case '".substr($periode,4,2)."' when '01' then jan
																				when '02' then feb
																				when '03' then mar
																				when '04' then apr
																				when '05' then mei
																				when '06' then jun
																				when '07' then jul
																				when '08' then aug
																				when '09' then sep
																				when '10' then okt
																				when '11' then nop
																				when '12' then des
												end
											)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc and z.kode_cc like 'T91%'
														where x.kode_fs = '$model' and (( y.kode_akun like '4%' and y.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (y.kode_akun like '4%') and y.jenis = 'S') )  group by x.kode_neraca) b on b.kode_neraca = a.kode_neraca
									where a.kode_fs = '$model' order by  rowindex");
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
		$this->generateResultJejerDatel($rootNode, $result);
		return json_encode($result);

	}
	function getDataAkunEXSUMDatel2($model, $periode, $datel = null, $neraca = null, $pembagi = 1000000000){
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
		$this->getDataEXSUMDatelAll($model, $periode, "","","", $pembagi);

		if ($neraca == "AR"){
			$dataNas = $this->nodeRev->data;
		}else if ($neraca == "OE"){
			$dataNas = $this->nodeExp->data;
		}

		if (strlen($datel) == 7){
			$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H' ) and a.kode_cc = '$datel' ";
		}else {
			$filter = " and  a.jenis in ('S','C','E','B','ZC','ZE','ZB','H' ) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%'  )  ";
		}
		$dataAkun = new server_util_Map();

		if ($datel != '' || isset($datel)){
			$filter2 = " and a.kode_cc like '%' and a.jenis = 'S'  ";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
										where tahun = '$thn1' $filter2 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
						left outer join (
								select kode_akun,
													sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
										where tahun = '$thn1' $filter2 group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
													end) as actbln
										from exs_mactual a
										inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter2 group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
										where tahun = '$thn3' $filter2 group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
						";
			$sql2 = "select distinct 'NAS' as ubis, a.kode_neraca,d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
													, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
													, ( nvl(b.actall,0) ) as actall
													, (nvl(b.trend,0)) as trend
													, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
													, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
													, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
													, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
													, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
													, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
													, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
													, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
													, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
													, 0 as contrib
													, 0 as nilai_rev
													, 0 as nilai_exp
													, 0 as contrib2
											from EXS_NERACA a
											inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
											inner join exs_masakun d on d.kode_akun = c.kode_akun
											inner join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0)) / $pembagi as aggthn
																				, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																				, sum(nvl(aggsd,0)) / $pembagi as aggsd
																				, sum(nvl(actbln,0))/ $pembagi  as actbln
																				, sum(nvl(actsd,0)) / $pembagi as actsd
																				, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																				, sum(nvl(actall,0)) / $pembagi as actall
																				, sum(nvl(trend,0)) / $pembagi as trend
															from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

										where a.kode_fs = '$model' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$kode_neraca = "";
			$collectData = false;

			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($ubis .$kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$ubis = $row->ubis;
				$row2 = new server_util_Map();
				$row2->set("ubis", $row->ubis);
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					$row2->set("aggthn", $row->aggthn * -1);
					$row2->set("trend", $row->trend * -1);
		   			$row2->set("aggbln", $row->aggbln * -1 );
		   			$row2->set("actbln", $row->actbln * -1 );
		   			$row2->set("acvpsn", $row->acvpsn );
		   			$row2->set("acvgap", -$row->acvgap );
		   			$row2->set("growthpsn", $row->growthpsn);
		   			$row2->set("growthgap", -$row->growthytyrp);
		   			$row2->set("actall",$row->actall * -1);
		   			$row2->set("aggsd", $row->aggsd * -1);
		   			$row2->set("actsd", $row->actsd * -1);
		   			$row2->set("acvytdpsn", $row->acvytdpsn);
		   			$row2->set("acvytdgap", -$row->acvytdrp);
		   			$row2->set("growthytypsn", $row->growthytypsn);
		   			$row2->set("growthytygap", -$row->growthytyrp);
		   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round(-$row->actsd / $dataNas->actsd * 100,2) ) ;
	   				$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round(-$row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   				$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round(-$row->actall / $dataNas->actall * 100,2) ) ;

				}else {
					$row2->set("aggthn", $row->aggthn );
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
		   			$row2->set("acvytdgap", $row->acvytdrp);
		   			$row2->set("growthytypsn", $row->growthytypsn);
		   			$row2->set("growthytygap", $row->growthytyrp);
		   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round($row->actsd / $dataNas->actsd * 100,2) ) ;
	   				$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round($row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   				$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round($row->actall / $dataNas->actall * 100,2) ) ;

				}

				$item->add($row2);


			}
			if ($kode_neraca != "")
				$dataAkun->set($ubis . $kode_neraca, $item );

		};
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where a.kode_cc like 'T91%' and  tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
									where a.kode_cc like 'T91%' and tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where a.kode_cc like 'T91%' and tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where a.kode_cc like 'T91%' and tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		if ($datel == '') $datel ='Telkom Regional';
		$sql2 = "select distinct '$datel' as ubis, a.kode_neraca, d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
										inner join exs_masakun d on d.kode_akun = c.kode_akun
										inner join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model' order by  rowindex";

		$rs = $this->dbLib->execute($sql2);
		$kode_neraca = "";
		$collectData = false;

		while ($row = $rs->FetchNextObject(false)){
			if ($kode_neraca != $row->kode_neraca){
				if ($kode_neraca != ""){
					$dataAkun->set($ubis . $kode_neraca, $item );
				}
				$item = new server_util_arrayList();
				$kode_neraca = $row->kode_neraca;
			}
			$ubis = $row->ubis;
			$row2 = new server_util_Map();
			$row2->set("ubis", $row->ubis);
			$row2->set("kode_akun", $row->kode_akun);
			$row2->set("nama", $row->nama);
			$row2->set("level_spasi", floatval($row->level_spasi) + 1);
			if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
				$row2->set("aggthn", $row->aggthn * -1 );
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
	   			$row2->set("acvytdgap", -$row->acvytdrp);
	   			$row2->set("growthytypsn", $row->growthytypsn);
	   			$row2->set("growthytygap", -$row->growthytyrp);
	   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round(-$row->actsd / $dataNas->actsd * 100,2) ) ;
	   			$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round(-$row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   			$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round(-$row->actall / $dataNas->actall * 100,2) ) ;

			}else
			{
				$row2->set("aggthn", $row->aggthn );
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
	   			$row2->set("acvytdgap", $row->acvytdrp);
	   			$row2->set("growthytypsn", $row->growthytypsn);
	   			$row2->set("growthytygap", $row->growthytyrp);
	   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round($row->actsd / $dataNas->actsd * 100,2) ) ;
	   			$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round($row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   			$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round($row->actall / $dataNas->actall * 100,2) ) ;

			}

			$item->add($row2);


		}
		if ($kode_neraca != "")
			$dataAkun->set($ubis . $kode_neraca, $item );
		return $dataAkun;

	}
	function getDataAkunEXSUMDatel($model, $periode, $datel = null, $neraca = null, $segmen = null, $pembagi = 1000000000){
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
		$this->getDataEXSUMDatelAll($model, $periode, $datel,null,$segmen, $pembagi);

		if ($neraca == "AR"){
			$dataNas = $this->nodeRev->data;
		}else if ($neraca == "OE"){
			$dataNas = $this->nodeExp->data;
		}
		if (!isset($segmen) || $segmen == ""){
			$jenis= "'C','E','B','ZC','ZE','ZB','H'";
		}else {
			switch  ($segmen){
				case "Bisnis" :  $jenis = "'B','ZB'";
				break;
				case "Consumer" : $jenis = "'C','ZC'";
				break;
				case "Enterprise" : $jenis = "'E','ZE'";
				break;
				default: $jenis= "'C','E','B','ZC','ZE','ZB','H'";
				break;
			}
		}

		if (strlen($datel) == 7){
			$filter = "  and jenis in ('S' ) and a.kode_cc = '$datel' ";
		}else {
			$filter = " and a.jenis in ('S','F',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )   ";
		}
		
		$dataAkun = new server_util_Map();

		if ($datel != '' || isset($datel)){
			$filter2 = "and a.jenis in ( 'S','F',$jenis) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and segmen in ($jenis) )   ";
			$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
										where tahun = '$thn1' $filter2 group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
						left outer join (
								select kode_akun,
													sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
										where tahun = '$thn1' $filter2 group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
													end) as actbln
										from exs_mactual a
										inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter2 group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
										where tahun = '$thn3' $filter2 group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
						";
			$sql2 = "select distinct 'NAS' as ubis, a.kode_neraca,d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
													, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
													, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
													, ( nvl(b.actall,0) ) as actall
													, (nvl(b.trend,0)) as trend
													, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
													, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
													, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
													, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
													, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
													, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
													, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
													, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
													, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
													, 0 as contrib
													, 0 as nilai_rev
													, 0 as nilai_exp
													, 0 as contrib2
											from EXS_NERACA a
											inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
											inner join exs_masakun d on d.kode_akun = c.kode_akun
											inner join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0)) / $pembagi as aggthn
																				, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																				, sum(nvl(aggsd,0)) / $pembagi as aggsd
																				, sum(nvl(actbln,0))/ $pembagi  as actbln
																				, sum(nvl(actsd,0)) / $pembagi as actsd
																				, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																				, sum(nvl(actall,0)) / $pembagi as actall
																				, sum(nvl(trend,0)) / $pembagi as trend
															from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

										where a.kode_fs = '$model' order by  rowindex";
			$rs = $this->dbLib->execute($sql2);
			$kode_neraca = "";
			$collectData = false;

			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($ubis .$kode_neraca, $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$ubis = $row->ubis;
				$row2 = new server_util_Map();
				$row2->set("ubis", $row->ubis);
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi) + 1);
				if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
					$row2->set("aggthn", $row->aggthn * -1 );
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
		   			$row2->set("acvytdgap", -$row->acvytdrp);
		   			$row2->set("growthytypsn", $row->growthytypsn);
		   			$row2->set("growthytygap", -$row->growthytyrp);
		   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round(-$row->actsd / $dataNas->actsd * 100,2) ) ;
	   				$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round(-$row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   				$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round(-$row->actall / $dataNas->actall * 100,2) ) ;

				}else {
					$row2->set("aggthn", $row->aggthn );
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
		   			$row2->set("acvytdgap", $row->acvytdrp);
		   			$row2->set("growthytypsn", $row->growthytypsn);
		   			$row2->set("growthytygap", $row->growthytyrp);
		   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round($row->actsd / $dataNas->actsd * 100,2) ) ;
	   				$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round($row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   				$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round($row->actall / $dataNas->actall * 100,2) ) ;

				}

				$item->add($row2);


			}
			if ($kode_neraca != "")
				$dataAkun->set($ubis . $kode_neraca, $item );

		};
		$sql = "select a.kode_akun, b.tahun, b.aggthn, b.aggbln, b.aggsd, c.actthnini as actthn, c.actbln, c.actsd, d.actsdlalu as actall, d.actbln as actblnlalu, e.actblnlalu as trend
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
									where tahun = '$thn1' $filter group by kode_akun, tahun  ) b on b.kode_akun = a.kode_akun
					left outer join (
							select kode_akun,
												sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as actthnini ,
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
									where tahun = '$thn1' $filter group by  kode_akun, tahun ) c on c.kode_akun = a.kode_akun

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
												end) as actbln
									from exs_mactual a
									inner join exs_cc b on b.kode_cc = a.kode_cc
									where tahun = '$thn2' $filter group by kode_akun, tahun ) d on d.kode_akun = a.kode_akun
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
									where tahun = '$thn3' $filter group by kode_akun, tahun ) e on e.kode_akun = a.kode_akun
					";
		if ($datel == '') $datel ='Telkom Regional';
		$sql2 = "select distinct '$datel' as ubis, a.kode_neraca, d.kode_akun, d.nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
												, (nvl(b.aggthn,0))  as aggthn,( nvl(b.aggbln,0) ) as aggbln,( nvl(b.aggsd,0) ) as aggsd
												, ( nvl(b.actbln,0) ) as actbln,( nvl(b.actsd,0)) as actsd,( nvl(b.actblnlalu,0) ) as actblnlalu
												, ( nvl(b.actall,0) ) as actall
												, (nvl(b.trend,0)) as trend
												, (case when b.aggbln <> 0 then nvl(b.actbln,0) / nvl(b.aggbln,0) * 100 else 0 end) as acvpsn
												, nvl(b.actbln,0) - nvl(b.aggbln,0)   as acvgap
												, (case when b.trend <> 0 then (nvl(b.actbln,0) -  nvl(b.trend,0) )/ nvl(b.trend,0) * 100 else 0 end) as growthpsn
												, nvl(b.actbln,0) -  nvl(b.trend,0) as growthgap
												, (case when b.aggsd <> 0 then nvl(b.actsd,0) / nvl(b.aggsd,0) * 100 else 0 end) as acvytdpsn
												, nvl(b.actsd,0) - nvl(b.aggsd,0) as acvytdrp
												, (case when b.aggthn <> 0 then nvl(b.actsd,0) / nvl(b.aggthn,0) * 100 else 0 end)  as ytdpsn
												, (case when b.actall <> 0 then (nvl(b.actsd,0) -  nvl(b.actall,0) )/ nvl(b.actall,0) * 100 else 0 end) as growthytypsn
												, nvl(b.actsd,0) -  nvl(b.actall,0) as growthytyrp
												, 0 as contrib
												, 0 as nilai_rev
												, 0 as nilai_exp
												, 0 as contrib2
										from EXS_NERACA a
										inner join exs_relakun c on c.kode_neraca = a.kode_neraca and c.kode_fs = a.kode_fs
										inner join exs_masakun d on d.kode_akun = c.kode_akun
										inner join (select x.kode_neraca, x.kode_akun, sum(nvl(aggthn,0)) / $pembagi as aggthn
																			, sum(nvl(aggbln,0) ) / $pembagi as aggbln
																			, sum(nvl(aggsd,0)) / $pembagi as aggsd
																			, sum(nvl(actbln,0))/ $pembagi  as actbln
																			, sum(nvl(actsd,0)) / $pembagi as actsd
																			, sum(nvl(actblnlalu,0)) / $pembagi  as actblnlalu
																			, sum(nvl(actall,0)) / $pembagi as actall
																			, sum(nvl(trend,0)) / $pembagi as trend
														from exs_relakun x left outer join ($sql) y on y.kode_akun = x.kode_akun
														where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

									where a.kode_fs = '$model' order by  rowindex";

		$rs = $this->dbLib->execute($sql2);
		$kode_neraca = "";
		$collectData = false;

		while ($row = $rs->FetchNextObject(false)){
			if ($kode_neraca != $row->kode_neraca){
				if ($kode_neraca != ""){
					$dataAkun->set($ubis . $kode_neraca, $item );
				}
				$item = new server_util_arrayList();
				$kode_neraca = $row->kode_neraca;
			}
			$ubis = $row->ubis;
			$row2 = new server_util_Map();
			$row2->set("ubis", $row->ubis);
			$row2->set("kode_akun", $row->kode_akun);
			$row2->set("nama", $row->nama);
			$row2->set("level_spasi", floatval($row->level_spasi) + 1);
			if (strtoupper($row->jenis_akun) == "PENDAPATAN"){
				$row2->set("aggthn", $row->aggthn * -1 );
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
	   			$row2->set("acvytdgap", -$row->acvytdrp);
	   			$row2->set("growthytypsn", $row->growthytypsn);
	   			$row2->set("growthytygap", -$row->growthytyrp);
	   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round(-$row->actsd / $dataNas->actsd * 100,2) ) ;
	   			$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round(-$row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   			$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round(-$row->actall / $dataNas->actall * 100,2) ) ;

			}else
			{
				$row2->set("aggthn", $row->aggthn );
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
	   			$row2->set("acvytdgap", $row->acvytdrp);
	   			$row2->set("growthytypsn", $row->growthytypsn);
	   			$row2->set("growthytygap", $row->growthytyrp);
	   			$row2->set("contrib", $dataNas->actsd == 0 ? 0 : round($row->actsd / $dataNas->actsd * 100,2) ) ;
	   			$row2->set("contrib2", $dataNas->actblnlalu == 0 ? 0 : round($row->actblnlalu / $dataNas->actblnlalu * 100,2) ) ;
	   			$row2->set("contrib3", $dataNas->actall == 0 ? 0 : round($row->actall / $dataNas->actall * 100,2) ) ;

			}

			$item->add($row2);


		}
		if ($kode_neraca != "")
			$dataAkun->set($ubis . $kode_neraca, $item );
		return $dataAkun;

	}
	function getDataAkunTrendDatel2($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H' ) and a.kode_cc = '$datel' ";
			}else if (strlen($datel) == 4) {
				$filter = " and a.kode_cc like '$datel%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}else{
				$filter = " and b.kode_induk like '$datel%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where a.kode_cc like 'T91%' and tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where a.kode_cc like 'T91%' and tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model' order by  rowindex");
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
						$row2->set($value, -$tmp[$value]);
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
	function getDataAkunTrendDatel($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis in ('S','F','E','B','H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";
			}
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where a.kode_cc like 'T91%' and tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where a.kode_cc like 'T91%' and tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
							$row2->set($value, -$tmp[$value]);
						}
					}else {
						foreach ($fields as $key => $value) {
							$row2->set($value, $tmp[$value]);
						}
					}
					$item->add($row2);
				}
				if ($row->kode_neraca == "EBD") $done = true;
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					order by kode_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			//while ($row = $rs->FetchNextObject(false))
			{

			//	$dataAkun = $this->getDataAkunTrendSegmenDatel($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $dataAkun, $pembagi);

			}
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataAkunTrendSegmenDatel($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $dataAkun = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				$filter = "and a.jenis in ('S','F','E','B','H') and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis = '$kode_ubis')";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("
				select a.kode_neraca, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($done){
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
							$row2->set($value, -$tmp[$value]);
						}
					}else {
						foreach ($fields as $key => $value) {
							$row2->set($value, $tmp[$value]);
						}
					}
					$item->add($row2);
				}
				if ($row->kode_neraca == 'EBD') $done = true;
			}
			if ($kode_neraca != "")
				$dataAkun->set($kode_neraca, $item );
			return $dataAkun;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

	function getDataAkunBudgetTrendDatel($model, $thn1, $thn2, $datel = null, $neraca = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H' ) and a.kode_cc = '$datel' ";
			}else if (strlen($datel) == 4) {
				$filter = " and a.kode_cc like '$datel%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}else{
				$filter = " and b.kode_cc like 'T91%' and b.kode_induk like '$datel%' and (( kode_akun like '4%' and a.jenis in ('C','E','B','ZC','ZE','ZB','H' )) or ( not (kode_akun like '4%') and a.jenis = 'S') )  ";
			}
			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn1' $filter group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn2'  $filter group by  kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$rs = $this->dbLib->execute("select a.kode_neraca, d.kode_akun, concat(d.nama,'(ACTUAL') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/$pembagi as jan1
											, nvl(b.feb, 0)/$pembagi as feb1
											, nvl(b.mar, 0)/$pembagi as mar1
											, nvl(b.apr, 0)/$pembagi as apr1
											, nvl(b.mei, 0)/$pembagi as mei1
											, nvl(b.jun, 0)/$pembagi as jun1
											, nvl(b.jul, 0)/$pembagi as jul1
											, nvl(b.aug, 0)/$pembagi as aug1
											, nvl(b.sep, 0)/$pembagi as sep1
											, nvl(b.okt, 0)/$pembagi as okt1
											, nvl(b.nop, 0)/$pembagi as nop1
											, nvl(b.des, 0)/$pembagi as des1
											, nvl(b.total, 0)/$pembagi as total1
											, nvl(b.jan2, 0)/$pembagi as jan2
											, nvl(b.feb2, 0)/$pembagi as feb2
											, nvl(b.mar2, 0)/$pembagi as mar2
											, nvl(b.apr2, 0)/$pembagi as apr2
											, nvl(b.mei2, 0)/$pembagi as mei2
											, nvl(b.jun2, 0)/$pembagi as jun2
											, nvl(b.jul2, 0)/$pembagi as jul2
											, nvl(b.aug2, 0)/$pembagi as aug2
											, nvl(b.sep2, 0)/$pembagi as sep2
											, nvl(b.okt2, 0)/$pembagi as okt2
											, nvl(b.nop2, 0)/$pembagi as nop2
											, nvl(b.des2, 0)/$pembagi as des2
											, nvl(b.total2, 0)/$pembagi as total2
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
															where x.kode_fs = '$model' group by x.kode_neraca,x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun

											where a.kode_fs = '$model' order by  rowindex");
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
											where tahun='$thn1' $filter  group by kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun='$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";

			$rs2 = $this->dbLib->execute("select a.kode_neraca, d.kode_akun, concat(d.nama,'(BUDGET)') as nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi, a.kode_induk, a.rowindex
											, nvl(b.jan, 0)/$pembagi as jan1
											, nvl(b.feb, 0)/$pembagi as feb1
											, nvl(b.mar, 0)/$pembagi as mar1
											, nvl(b.apr, 0)/$pembagi as apr1
											, nvl(b.mei, 0)/$pembagi as mei1
											, nvl(b.jun, 0)/$pembagi as jun1
											, nvl(b.jul, 0)/$pembagi as jul1
											, nvl(b.aug, 0)/$pembagi as aug1
											, nvl(b.sep, 0)/$pembagi as sep1
											, nvl(b.okt, 0)/$pembagi as okt1
											, nvl(b.nop, 0)/$pembagi as nop1
											, nvl(b.des, 0)/$pembagi as des1
											, nvl(b.total, 0)/$pembagi as total1
											, nvl(b.jan2, 0)/$pembagi as jan2
											, nvl(b.feb2, 0)/$pembagi as feb2
											, nvl(b.mar2, 0)/$pembagi as mar2
											, nvl(b.apr2, 0)/$pembagi as apr2
											, nvl(b.mei2, 0)/$pembagi as mei2
											, nvl(b.jun2, 0)/$pembagi as jun2
											, nvl(b.jul2, 0)/$pembagi as jul2
											, nvl(b.aug2, 0)/$pembagi as aug2
											, nvl(b.sep2, 0)/$pembagi as sep2
											, nvl(b.okt2, 0)/$pembagi as okt2
											, nvl(b.nop2, 0)/$pembagi as nop2
											, nvl(b.des2, 0)/$pembagi as des2
											, nvl(b.total2, 0)/$pembagi as total2
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

															from exs_relakun x inner join ($sql2) y on y.kode_akun = x.kode_akun
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun  = d.kode_akun

											where a.kode_fs = '$model' order by  rowindex");
			$dataAkun = new server_util_Map();
			$kode_neraca = "";
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			while ($row = $rs->FetchNextObject(false)){
				if ($kode_neraca != $row->kode_neraca){
					if ($kode_neraca != ""){
						$dataAkun->set($kode_neraca."-A", $item );
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
						$row2->set($value, $tmp[$value] *-1);
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
						$dataAkun->set($kode_neraca."-B", $item );
					}
					$item = new server_util_arrayList();
					$kode_neraca = $row->kode_neraca;
				}
				$row2 = new server_util_Map();
				$row2->set("kode_akun", $row->kode_akun);
				$row2->set("nama", $row->nama);
				$row2->set("level_spasi", floatval($row->level_spasi));
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
	function getDataAkunJejerAggWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		$witel = $ubis;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
			$divre = true;
		}else {
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
			if (substr($ubis,0,2) == "T6"){//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");//where b.kode_ubis ='$ubis'
				$divre = false;
				error_log("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
				$divre = true;
			}

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			/*$filter2 = "  and y.kode_cc in (select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) )
							and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								) ";
			*/
			if ($divre)

				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$row->kode_witel%'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%') 
							and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								) ";

			else
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  )
							 and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								) ";

			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			$sql = " select x.kode_neraca,x.kode_akun, case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end *
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";
			//error_log("Akun : " . $sql );
			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}

		$witel = $ubis;
		if ($ubis == "") $ubis = "Telkom Regional";
		/*if ($divre)
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													 where b.kode_ubis like '$witel%')  ";

			else
				$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
							 and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$witel%'  ) ";
		*/
		if (!$divre){
			if (substr($ubis,0,2)=="T6"){// where b.kode_ubis = '$witel'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													where b.kode_induk like '$witel%'
									 union
												select distinct kode_pc from exs_mappc where kode_witel like '$witel%' 		 )
					and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";

			}else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$witel%'  )
					and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911' )
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like 'T6%')
					and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";
		$rs = $this->dbLib->execute("select distinct '$ubis' as ubis, a.kode_neraca, c.kode_akun,c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.aggthn,0))  as aggthn $field
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun, sum(case '$bln' when '01' then jan
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  order by  rowindex,kode_induk, kode_akun");
		$node = "";
		$result = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
				}
				$tmp = $result->get($row->ubis . $row->kode_neraca);
				if (!isset($tmp)) $result->set($row->ubis . $row->kode_neraca, new server_util_arrayList() );
				$items = $result->get($row->ubis.$row->kode_neraca);
				$rowItem = new server_util_Map();
				//error_log("Akun : " . $row->ubis.$row->kode_neraca );
				$field = (array) $row;
				foreach ($field as $f => $val){
					$rowItem->set($f, $val);
				}
				$items->add($rowItem);

				if ($row->kode_neraca == 'EBD') $done = true;
			}

		}

		$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$witel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$witel' )
					order by kode_ubis");
		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			$result = $this->getDataAkunJejerAggWitelSegmen($model, $periode, $witel, $row->kode_ubis, $row->nama, $row->segmen,$result, $pembagi);

		}
		return ($result);

	}
	function getDataAkunJejerAggWitelSegmen($model, $periode, $ubis = null, $kode_ubis = null, $nama = null, $segmen = null, $result = null,$pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode, 4,2);
		/*if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where  length(kode_cc) = 4 and kode_cc like 'T91%' order by kode_witel");

		}else {
			$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");

		}*/
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
			$divre = true;
		}else {
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
			if (substr($ubis,0,2) == "T6"){//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");//where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
				$divre = true;
			}

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_ubis like '$row->kode_witel%' and a.kode_ubis = '$kode_ubis'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' and a.kode_ubis = '$kode_ubis') 
						and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";
			else
				$filter2 = "  and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis = '$kode_ubis'  ) 
						and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";


			/*$filter2 = "  and y.jenis in ('S','F','E','B','H')
					and y.kode_cc in (select distinct kode_pc from exs_mappc a where (kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) ) and a.kode_ubis = '$kode_ubis')
							and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)
							";*/
			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			$sql = " select x.kode_neraca,x.kode_akun,case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum(case '$bln' when '01' then jan
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
												end)/$pembagi as agg
						from exs_relakun x
						inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";

			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		/*if ($divre){
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a
							inner join exs_divre b on b.witel = a.kode_witel where b.kode_ubis like '$ubis%' and a.kode_ubis2 = '$kode_ubis') ";
		}else {
			$filter2 = " and ( (y.jenis in ('S','F', 'E','B','H') and tahun >= '2014')  or (tahun < '2014' and y.jenis in ('E','B') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis2 = '$kode_ubis' )";
		}*/

		if (!$divre){
			if (substr($ubis,0,2)=="T6"){// where b.kode_ubis = '$witel'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													where b.kode_induk like '$ubis%' and a.kode_ubis = '$kode_ubis'
												union
												select distinct kode_pc from exs_mappc where kode_witel like '$ubis%' and kode_ubis = '$kode_ubis' )
					and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";

			}else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  and a.kode_ubis = '$kode_ubis' )
					and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911' ) and a.kode_ubis = '$kode_ubis'
									  union
									  select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' and a.kode_ubis = '$kode_ubis')
					and (
									(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
									OR
									(y.kode_akun like '5%')
								)";
		$rs = $this->dbLib->execute("select distinct '$nama' as ubis, a.kode_neraca, c.kode_akun, c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.aggthn,0))  as aggthn $field
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
												end)/$pembagi as aggthn
														from exs_relakun x
														inner join exs_mbudget y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  order by  rowindex");
		$node = "";
		//$result = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
				}
				$tmp = $result->get($row->ubis . $row->kode_neraca);
				if (!isset($tmp)) $result->set($row->ubis . $row->kode_neraca, new server_util_arrayList() );
				$items = $result->get($row->ubis . $row->kode_neraca);
				$rowItem = new server_util_Map();
				//error_log("Akun : " . $row->ubis.$row->kode_neraca );
				$field = (array) $row;
				foreach ($field as $f => $val){
					$rowItem->set($f, $val);
				}
				$items->add($rowItem);
				//error_log($row->ubis . $row->kode_neraca);
				if ($row->kode_neraca == 'EBD') $done = true;
			}

		}
				//perlu hitung ke summary
		return ($result);

	}
	function getDataAkunJejerActualWitel($model, $periode, $ubis = null, $pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$witel = $ubis;
		$filterWitel = $ubis;
		$bln = substr($periode,4,2);
		$divre = false;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
			$divre = true;
		}else {
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
			if (substr($ubis,0,2) == "T6"){//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%' order by kode_witel");//where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ('T910','T911') order by kode_witel");
				$divre = true;
			}

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			$sql = " select x.kode_neraca,x.kode_akun, case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum(
							case '$bln' when '01' then jan
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
												end )/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";
			//error_log("Detail Divre : ". $sql);
			$rs = $this->dbLib->execute($sql);

			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}

		if($ubis == "") $kode_ubis = "All Divre";
		else if (strlen($ubis) == 2) $kode_ubis = "All Witel";
		if (!$divre){
			if (substr($ubis,0,2)=="T6" && $ubis != "T6"){//where b.kode_ubis = '$ubis'
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													 where b.kode_induk like '$ubis%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%'
												  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";

			}else if (strlen($ubis) == 9){
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
													 where b.kode_induk like '$ubis%'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%'
												  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			}else 
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		} else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ('T910','T911')
										union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$rs = $this->dbLib->execute("select distinct '$kode_ubis' as ubis, a.kode_neraca, c.kode_akun,c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.actsd,0))  as actsd $field
										from EXS_NERACA a
										inner join (select x.kode_neraca, x.kode_akun, sum(case '$bln' when '01' then jan
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  order by  rowindex,kode_induk, kode_akun");

		$node = "";
		$result = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
				}
				$tmp = $result->get($row->ubis . $row->kode_neraca);
				if (!isset($tmp)) 
					$result->set($row->ubis . $row->kode_neraca, new server_util_arrayList() );
				$items = $result->get($row->ubis.$row->kode_neraca);
				
				//error_log("Akun " . $row->ubis.$row->kode_neraca);
				$rowItem = new server_util_Map();
				$field = (array) $row;
				foreach ($field as $f => $val){
					$rowItem->set($f, $val);
				}
				//if ($row->actsd != 0 )
					$items->add($rowItem);

				if ($row->kode_neraca == 'EBD') $done = true;
			}

		}

		$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_witel like '$filterWitel%' or a.kode_witel in (select kode_ubis from exs_ubis where kode_induk like '$filterWitel%' )
					order by kode_ubis");
		//kode : buat select ke mappc
		//nama : buat sheet
		while ($row = $rs->FetchNextObject(false))
		{
			$result = $this->getDataAkunJejerActualWitelSegmen($model, $periode, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen,$result, $pembagi);

		}
		return ($result);

	}
	function getDataAkunJejerActualWitelSegmen($model, $periode, $ubis = null, $kode_ubis = null, $nama = null, $segmen = null, $result = null,$pembagi = 1000000000){
		if (!isset($pembagi)) $pembagi = 1000000000;
		$thn1 = substr($periode,0,4);
		$thn2 = floatval(substr($periode,0,4)) - 1;
		$bln = substr($periode,4,2);
		$divre = false;
		if (strlen($ubis) == 9){
			$rsUbis = $this->dbLib->execute("select distinct kode_cc as kode_witel from exs_cc where kode_witel = '$ubis' and kode_cc like 'T91%' order by kode_cc");

		}else if ($ubis == ""){
			$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
			$divre = true;
		}else {
			//$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc where kode_cc like '$ubis%' and length(kode_cc) = 9 order by kode_witel");
			if (substr($ubis,0,2) == "T6"){//divre
				$rsUbis = $this->dbLib->execute("select distinct kode_witel from exs_cc a inner join exs_ubis b on b.kode_ubis = a.kode_cc where b.kode_induk like '$ubis%'  order by kode_witel");//where b.kode_ubis ='$ubis'
				$divre = false;
			}else{ //data DTT DTB namplinin divre
				$rsUbis = $this->dbLib->execute("select distinct kode_ubis as kode_witel from exs_ubis where kode_induk in ( 'T910','T911') order by kode_witel");
				$divre = true;
			}

		}
		$sql = "";
		$field = "";
		$dataUbis = new server_util_Map();
		while ($row = $rsUbis->FetchNextObject(false)){
			$filter = "  ";
			if ($divre)
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc a where (kode_witel like '$row->kode_witel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$row->kode_witel' ) ) and a.kode_ubis = '$kode_ubis')
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			else
				$filter2 = " and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
						and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '$row->kode_witel%' and kode_ubis2 = '$kode_ubis'  )
						and (
								(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
								OR
								(y.kode_akun like '5%')
							)";
			$witel = str_replace("-", "_", $row->kode_witel);
			$field .= ", 0  as \"$witel\" ";
			$sql = " select x.kode_neraca,x.kode_akun,case when u.jenis_akun = 'PENDAPATAN' then -1 else 1 end * sum( case '$bln' when '01' then jan
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
												end )/$pembagi as agg
						from exs_relakun x
						inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
						inner join exs_cc z on z.kode_cc = y.kode_cc $filter
						inner join exs_neraca u on u.kode_neraca = x.kode_neraca and u.kode_fs = x.kode_fs
						where x.kode_fs = '$model' $filter2 group by x.kode_neraca, x.kode_akun, u.jenis_akun";

			$rs = $this->dbLib->execute($sql);
			//error_log($sql);
			$itemUbis = new server_util_Map();

			while ($line = $rs->FetchNextObject(false)){
				$itemUbis->set($line->kode_akun, $line->agg);
			}
			$dataUbis->set($witel, $itemUbis);
		}
		if (!$divre)
			if (substr($ubis,0,2)=="T6")
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_ubis b on b.kode_ubis = a.kode_witel
												 where  a.kode_ubis2 = '$kode_ubis' and b.kode_induk like '$ubis%' 
									union
										select distinct kode_pc from exs_mappc a where kode_witel like '$ubis%' and a.kode_ubis = '$kode_ubis' 
									 )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
			else
				$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc where kode_witel like '%' and kode_ubis = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
						)";
		else
			$filter2 = "and ( (y.tahun <= '2013' and y.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( y.tahun > '2013'  and y.jenis in ('S','F','E','B','H') ) )
					and y.kode_cc in (select distinct kode_pc from exs_mappc a
													inner join exs_divre b on b.witel = a.kode_witel
													inner join exs_ubis c on c.kode_ubis = b.kode_ubis
												 where c.kode_induk in ( 'T910','T911') and a.kode_ubis = '$kode_ubis'
										union
										select distinct kode_pc from exs_mappc a where kode_witel like 'T6%' and a.kode_ubis = '$kode_ubis'  )
					and (
							(not y.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= y.tahun) and y.kode_akun like '4%')
							OR
							(y.kode_akun like '5%')
							
						)";
		$rs = $this->dbLib->execute("select distinct '$kode_ubis' as ubis, a.kode_neraca, c.kode_akun, c.nama as nama, a.tipe,a.jenis_akun, a.sum_header, a.level_spasi + 2 as level_spasi, a.kode_neraca as kode_induk, a.rowindex + 2 as rowindex
												, case when a.jenis_akun = 'PENDAPATAN' then -1 else 1 end * (nvl(b.actsd,0))  as actsd $field
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
												end)/$pembagi as actsd
														from exs_relakun x
														inner join exs_mactual y on y.kode_akun = x.kode_akun and y.tahun = '$thn1'
														inner join exs_cc z on z.kode_cc = y.kode_cc
														where x.kode_fs = '$model' $filter2
														group by x.kode_neraca, x.kode_akun) b on b.kode_neraca = a.kode_neraca
										inner join exs_masakun c on c.kode_akun = b.kode_akun
									where a.kode_fs = '$model'  order by  rowindex");
		$node = "";
		//$result = new server_util_Map();
		$done = false;
		while ($row = $rs->FetchNextObject(false)){
			if (!$done){
				foreach ($dataUbis->getArray() as $key => $itemUbis){
					eval ("\$row->$key = \$itemUbis->get(\$row->kode_akun);");
				}
				$tmp = $result->get($row->ubis . $row->kode_neraca);
				if (!isset($tmp)) $result->set($row->ubis . $row->kode_neraca, new server_util_arrayList() );
				$items = $result->get($row->ubis . $row->kode_neraca);
				//error_log("Akun Segmen " . $row->ubis.$row->kode_neraca);
				$rowItem = new server_util_Map();
				$field = (array) $row;
				foreach ($field as $f => $val){
					$rowItem->set($f, $val);
				}
				//if ($row->actsd != 0)
					$items->add($rowItem);
				//error_log($row->ubis . $row->kode_neraca);
				if ($row->kode_neraca == 'EBD') $done = true;
			}

		}
				//perlu hitung ke summary
		return ($result);

	}
	function getDataTrendDatelPlusAkun($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun)  and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			} /*{

				$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
						and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
					and (
							(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
							OR
							(a.kode_akun like '5%')
						)";
			}*/

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";

			$rs = $this->dbLib->execute("
				select '$datel' as ubis, '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$datel' as ubis, a.kode_neraca, a.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from EXS_NERACA a
				where a.kode_fs = '$model'
				union
				select '$datel' as ubis, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 2, a.kode_induk, a.rowindex + 2
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun
											where a.kode_fs = '$model'


				order by  rowindex");

			$node = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);			//perlu hitung ke summary
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			if (substr($filterWitel,0,2) == "T6"  ){
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_ubis = '$filterWitel' or not  a.kode_ubis like '".substr($filterWitel,0,2)."%'
					order by kode_ubis");
			}else
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					order by kode_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{
				//error_log($row->nama);
				$resConsumer = $this->getDataTrendSegmenDatelPlusAkun($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendSegmenDatelPlusAkun($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";

				/*$filter = "and( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) ) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis ='$kode_ubis' )
					and (
							(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
							OR
							(a.kode_akun like '5%')
						)";*/

			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$kode_ubis' as ubis, a.kode_neraca, a.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1  as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from EXS_NERACA a
				where a.kode_fs = '$model'
				union
				select '$kode_ubis' as ubis,d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 2, a.kode_induk, a.rowindex + 2
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun
											where a.kode_fs = '$model'

				order by  rowindex");
			$node = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return $result;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendDatelBudgetPlusAkun($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				//$filter = "and a.jenis in ('S','F','E','B','H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )  ";
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";

			$rs = $this->dbLib->execute("
				select '$filterWitel' as ubis, '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$filterWitel' as ubis, a.kode_neraca, a.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1  as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from EXS_NERACA a
				where a.kode_fs = '$model'
				union
				select '$filterWitel' as ubis, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 2, a.kode_induk, a.rowindex + 2
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun
											where a.kode_fs = '$model'

				order by  rowindex");
			$node = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);			//perlu hitung ke summary
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			if (substr($filterWitel,0,2) == "T6"  ){
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_ubis = '$filterWitel' or not  a.kode_ubis like '".substr($filterWitel,0,2)."%'
					order by kode_ubis");
			}else
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					order by kode_ubis");			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{

				$resConsumer = $this->getDataTrendSegmenDatelBudgetPlusAkun($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendSegmenDatelBudgetPlusAkun($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				//$filter = "and a.jenis in ('S','F','E','B','H') and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis ='$kode_ubis' )  ";
				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";

			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mbudget a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;

			$rs = $this->dbLib->execute("
				select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$kode_ubis' as ubis, a.kode_neraca, a.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from EXS_NERACA a
				where a.kode_fs = '$model'
				union
				select '$kode_ubis' as ubis,d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 2, a.kode_induk, a.rowindex + 2
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun
										where a.kode_fs = '$model'

				order by  rowindex");
			$node = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return $result;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	//--oulook
	function getDataTrendOutlookDatelPlusAkun($model, $thn1, $thn2, $datel = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) =="T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' ) )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
							and (
									(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
									OR
									(a.kode_akun like '5%')
								)  ";
			} /*{

				$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
						and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' )
					and (
							(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
							OR
							(a.kode_akun like '5%')
						)";
			}*/

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			if ($datel == "") $datel = "Telkom Regional";

			$rs = $this->dbLib->execute("
				select '$datel' as ubis, '$datel' as kode_neraca, '$datel' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$datel' as ubis, a.kode_neraca, a.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1 as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from EXS_NERACA a
				where a.kode_fs = '$model'
				union
				select '$datel' as ubis, d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 2, a.kode_induk, a.rowindex + 2
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun
											where a.kode_fs = '$model'


				order by  rowindex");

			$node = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);			//perlu hitung ke summary
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			if (substr($filterWitel,0,2) == "T6"  ){
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					where a.kode_ubis = '$filterWitel' or not  a.kode_ubis like '".substr($filterWitel,0,2)."%'
					order by kode_ubis");
			}else
				$rs = $this->dbLib->execute("select distinct a.segmen, b.nama, a.kode_ubis from exs_mappc a
					inner join exs_ubis b on b.kode_ubis = a.kode_ubis
					order by kode_ubis");
			//kode : buat select ke mappc
			//nama : buat sheet
			while ($row = $rs->FetchNextObject(false))
			{
				//error_log($row->nama);
				$resConsumer = $this->getDataTrendOutlookSegmenDatelPlusAkun($model, $thn1, $thn2, $filterWitel, $row->kode_ubis, $row->nama, $row->segmen, $pembagi);
				if (count($resConsumer["rs"]["rows"]) > 1){
					foreach ($resConsumer["rs"]["rows"] as $val){
						$result["rs"]["rows"][] = $val;
					}
				}
			}
			return json_encode($result);
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}
	function getDataTrendOutlookSegmenDatelPlusAkun($model, $thn1, $thn2, $datel = null, $kode_ubis = null, $nama = null, $segmen = null, $pembagi = 1000000000){
		try{
			if (!isset($pembagi)) $pembagi = 1000000000;
			if (strlen($datel) == 7){
				$filter = "  and jenis in ('C','E','B','ZC','ZE','ZB','H') and a.kode_cc = '$datel' ";
			}else {
				if (substr($datel,0,2) == "T6")
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )
							and  a.kode_cc in (select kode_pc from exs_mappc where (kode_witel like '$datel%' or kode_witel in (select kode_ubis from exs_ubis where kode_induk = '$datel' )) and kode_ubis = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";
				else
					$filter = "and ( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) )  and  a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis = '$kode_ubis')
						and (
								(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget where tahun_report >= a.tahun) and a.kode_akun like '4%')
								OR
								(a.kode_akun like '5%')
							) ";

				/*$filter = "and( (a.tahun <= '2013' and a.jenis in ('C','E','B','ZC','ZE','ZB','H')) or ( a.tahun > '2013'  and a.jenis in ('S','F','E','B','H') ) ) and a.kode_cc in (select kode_pc from exs_mappc where kode_witel like '$datel%' and kode_ubis ='$kode_ubis' )
					and (
							(not a.kode_cc in (select distinct kode_pc from exs_desnonbudget) and a.kode_akun like '4%')
							OR
							(a.kode_akun like '5%')
						)";*/

			}

			$sql = "select a.kode_akun,
									 b.jan, b.feb, b.mar, b.apr, b.mei, b.jun, b.jul, b.aug, b.sep, b.okt, b.nop, b.des, b.total,
									 c.jan as jan2, c.feb as feb2, c.mar as mar2, c.apr as apr2, c.mei as mei2, c.jun as jun2, c.jul as jul2, c.aug as aug2, c.sep as sep2, c.okt as okt2, c.nop as nop2, c.des as des2, c.total as total2
							from exs_masakun a
							left outer join (
									select kode_akun, sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total
											from exs_outlook a
											inner join exs_cc b on b.kode_cc = a.kode_cc
											where tahun = '$thn1' $filter
											group by  kode_akun ) b on b.kode_akun = a.kode_akun
							left outer join (
										select kode_akun,  sum(jan) as jan , sum(feb) as feb , sum(mar) as mar , sum(apr) as apr , sum(mei) as mei , sum(jun) as jun , sum(jul) as jul
											, sum(aug) as aug , sum(sep) as sep , sum(okt) as okt  , sum(nop) as nop , sum(des) as des
											, sum(jan + feb + mar + apr + mei + jun + jul + aug + sep + okt + nop + des) as total

											from exs_mactual a
											inner join exs_cc b on b.kode_cc = a.kode_cc
										where tahun = '$thn2' $filter group by kode_akun  ) c on c.kode_akun = a.kode_akun
					";
			$filterWitel = $datel;
			$rs = $this->dbLib->execute("
				select '$kode_ubis' as ubis, '$kode_ubis' as kode_neraca, '$nama' as nama, 'PENDAPATAN' as jenis_akun, '-' as tipe, '-' as sum_header, 0 as level_spasi, '00' as kode_induk, 0 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from dual
				union
				select '$kode_ubis' as ubis, a.kode_neraca, a.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 1  as level_spasi, a.kode_induk, a.rowindex + 1 as rowindex
					, 0 as jan1, 0 as feb1, 0 as mar1, 0 as apr1, 0 as mei1, 0 as jun1, 0 as jul1, 0 as aug1, 0 as sep1, 0 as okt1, 0 as nop1, 0 as des1, 0 as total1
					, 0 as jan2, 0 as feb2, 0 as mar2, 0 as apr2, 0 as mei2, 0 as jun2, 0 as jul2, 0 as aug2, 0 as sep2, 0 as okt2, 0 as nop2, 0 as des2, 0 as total2
				from EXS_NERACA a
				where a.kode_fs = '$model'
				union
				select '$kode_ubis' as ubis,d.kode_akun, d.nama,a.jenis_akun, a.tipe, a.sum_header, a.level_spasi + 2, a.kode_induk, a.rowindex + 2
											, nvl(b.jan, 0) / $pembagi as jan1
											, nvl(b.feb, 0) / $pembagi as feb1
											, nvl(b.mar, 0) / $pembagi as mar1
											, nvl(b.apr, 0) / $pembagi as apr1
											, nvl(b.mei, 0) / $pembagi as mei1
											, nvl(b.jun, 0) / $pembagi as jun1
											, nvl(b.jul, 0) / $pembagi as jul1
											, nvl(b.aug, 0) / $pembagi as aug1
											, nvl(b.sep, 0) / $pembagi as sep1
											, nvl(b.okt, 0) / $pembagi as okt1
											, nvl(b.nop, 0) / $pembagi as nop1
											, nvl(b.des, 0) / $pembagi as des1
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
															where x.kode_fs = '$model' group by x.kode_neraca, x.kode_akun ) b on b.kode_neraca = a.kode_neraca and b.kode_akun = d.kode_akun
											where a.kode_fs = '$model'

				order by  rowindex");
			$node = "";
			$done = false;
			$fields = array("jan1","feb1","mar1","apr1","mei1","jun1","jul1","aug1","sep1","okt1","nop1","des1","total1","jan2","feb2","mar2","apr2","mei2","jun2","jul2","aug2","sep2","okt2","nop2","des2","total2");
			$node = "";
			$rootNode = new server_util_NodeNRC("00");
			$this->sumHeader = new server_util_Map();
			$done = false;
			while ($row = $rs->FetchNextObject(false)){
				if (!$done){
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
					if ($row->kode_neraca == "EBD") $done = true;
				}

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
			$this->generateResultTrendDatel($rootNode, $result, $thn2);
			$nodeUbis = $result["rs"]["rows"][0];
			$nodeEBD = $result["rs"]["rows"][count($result["rs"]["rows"]) - 1];
			$nodeUbis["jan1"] = $nodeEBD["jan1"];
			$nodeUbis["feb1"] = $nodeEBD["feb1"];
			$nodeUbis["mar1"] = $nodeEBD["mar1"];
			$nodeUbis["apr1"] = $nodeEBD["apr1"];
			$nodeUbis["mei1"] = $nodeEBD["mei1"];
			$nodeUbis["jun1"] = $nodeEBD["jun1"];
			$nodeUbis["jul1"] = $nodeEBD["jul1"];
			$nodeUbis["aug1"] = $nodeEBD["aug1"];
			$nodeUbis["sep1"] = $nodeEBD["sep1"];
			$nodeUbis["okt1"] = $nodeEBD["okt1"];
			$nodeUbis["nop1"] = $nodeEBD["nop1"];
			$nodeUbis["des1"] = $nodeEBD["des1"];
			$nodeUbis["total1"] = $nodeEBD["total1"];
			$nodeUbis["jan2"] = $nodeEBD["jan2"];
			$nodeUbis["feb2"] = $nodeEBD["feb2"];
			$nodeUbis["mar2"] = $nodeEBD["mar2"];
			$nodeUbis["apr2"] = $nodeEBD["apr2"];
			$nodeUbis["mei2"] = $nodeEBD["mei2"];
			$nodeUbis["jun2"] = $nodeEBD["jun2"];
			$nodeUbis["jul2"] = $nodeEBD["jul2"];
			$nodeUbis["aug2"] = $nodeEBD["aug2"];
			$nodeUbis["sep2"] = $nodeEBD["sep2"];
			$nodeUbis["okt2"] = $nodeEBD["okt2"];
			$nodeUbis["nop2"] = $nodeEBD["nop2"];
			$nodeUbis["des2"] = $nodeEBD["des2"];
			$nodeUbis["total2"] = $nodeEBD["total2"];
			$result["rs"]["rows"][0] = $nodeUbis;
			return $result;
		}catch(exception $e){
			error_log($e->getMessage());
			return "Error:" . $e->getMessage();
		}
	}

}
?>