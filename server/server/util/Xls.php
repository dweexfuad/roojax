<?php
class server_util_Xls extends server_BasicObject
{
	protected $xls;
	function __construct()
	{
		parent::__construct();


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
	//----------------------------------

	/**
	 * generate function.
	 * digunakan untuk menghasilkan file excel untuk di download
	 * @access public
	 * @param mixed $options	: array berisi konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $dataAkun (default: null)	: array berisi data-data akun untuk masing-masing kode neraca
	 * @return void
	 */
	function generate($options, $namafile, $dataAkun = null){
		$this->xls = new Spreadsheet_Excel_Writer("./tmp/$namafile");
		$periode = $options->get("periode");
		$this->xls->setCustomColor(14, 0,0,128);//#000080
		$this->xls->setCustomColor(15, 144,112,53);//#907035
		$this->xls->setCustomColor(16, 138,213,4);//8AD504
		$this->xls->setCustomColor(17, 252,255,151);//FCFF97
		$this->xls->setCustomColor(18, 193,255,205);//C0FFCD
		$this->xls->setCustomColor(19, 4,193,33);//04C121
		$this->xls->setCustomColor(20, 101,208,119);//65D077
		$this->xls->setCustomColor(21, 143,207,153);//8FCF99
		$this->xls->setCustomColor(22, 166,203,172);//A6CBAC
		$this->xls->setCustomColor(23, 187,229,194);//BBE5C2

		$sheetName = "Report";
		$sheetCount = 0;
		$done = false;
			$sheet =& $this->xls->addWorksheet($sheetName . $sheetCount);
			$hdrSAP =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'valign' => 'middle', 'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'red','pattern' => 1, 'color' => 'white'	));
			$hdr =& $this->xls->addFormat(array('size' => 20,'bold' => true, 'border' => 1,'valign' => 'middle', 'halign' => 'left'	));

			$hdrKonv =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'red','pattern' => 1, 'color' => 'white'	));
			$hdrVer =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'red','pattern' => 1, 'color' => 'white'	));

			$numFormat =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black'));
			$numFormat->setNumFormat("#,##0");
			$normalFormat =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black' ));

			$numFormat2 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 15,'pattern' => 1, 'color' => 'white'	));
			$numFormat2->setNumFormat("#,##0");
			$normalFormat2 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 15,'pattern' => 1, 'color' => 'white'	));

			$numFormat3 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 16,'pattern' => 1, 'color' => 'black'	));
			$numFormat3->setNumFormat("#,##0");
			$normalFormat3 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 16,'pattern' => 1, 'color' => 'black'	));

			$numFormat4 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 17,'pattern' => 1, 'color' => 'black'	));
			$numFormat4->setNumFormat("#,##0");
			$normalFormat4 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 17,'pattern' => 1, 'color' => 'black'	));

			$numFormat5 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 18,'pattern' => 1, 'color' => 'black'	));
			$numFormat5->setNumFormat("#,##0");
			$normalFormat5 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 18,'pattern' => 1, 'color' => 'black'	));

			$numFormat6 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 19,'pattern' => 1, 'color' => 'black'	));
			$numFormat6->setNumFormat("#,##0");
			$normalFormat6 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 19,'pattern' => 1, 'color' => 'black'	));

			$numFormat7 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 20,'pattern' => 1, 'color' => 'black'	));
			$numFormat7->setNumFormat("#,##0");
			$normalFormat7 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 20,'pattern' => 1, 'color' => 'black'	));

			$numFormat8 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 21,'pattern' => 1, 'color' => 'black'	));
			$numFormat8->setNumFormat("#,##0");
			$normalFormat8 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 21,'pattern' => 1, 'color' => 'black'	));

			$numFormat9 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 22,'pattern' => 1, 'color' => 'black'	));
			$numFormat9->setNumFormat("#,##0");
			$normalFormat9 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 22,'pattern' => 1, 'color' => 'black'	));

			$numFormat10 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 23,'pattern' => 1, 'color' => 'black'	));
			$numFormat10->setNumFormat("#,##0");
			$normalFormat10 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 23,'pattern' => 1, 'color' => 'black'	));

			$header = $options->get("header");
			$title = $header->get("title");
			$sheet->write(0,0,$title,$hdr);

			$columnTitle = $header->get("columnTitle");
			$col = $header->get("startCol");
			$startRow = $header->get("startRow");

			foreach ($columnTitle->getArray() as $val){
				$sheet->write($startRow,$col,$val->get("title"), $hdrSAP);
				if ($val->get("rowMerge") && $val->get("colMerge")){
					$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col+$val->get("colMerge"));
				}else if ($val->get("rowMerge") ){
					$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col);
				}else if ($val->get("colMerge") ){
					$sheet->setMerge($startRow,$col,$startRow,$col+$val->get("colMerge"));
				}
				if ($val->get("width"))
					$sheet->setColumn($col,$col,$val->get("width"));
				$level = 1;
				if ($val->get("column")){
					$column = $val->get("column");
					foreach ($column->getArray() as $val2){
						$sheet->write($startRow + $level,$col,$val2->get("title"), $hdrSAP);

						if ($val2->get("rowMerge") && $val2->get("colMerge")){
							$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col+$val2->get("colMerge"));
						}else if ($val->get("rowMerge") ){
							$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col);
						}else if ($val->get("colMerge") ){
							$sheet->setMerge($startRow,$col,$startRow,$col+$val2->get("colMerge"));
						}
						if ($val2->get("width"))
							$sheet->setColumn($col,$col,$val2->get("width"));
						$col++;
					}
				}else $col++;
			}

			$fields = $options->get("fields")->getArray();
			$fieldKunci = $options->get("keyField");
			$startRow += 1;
			foreach ($options->get("data")->getArray() as $k => $value){
				$startRow += 1;
				if ($startRow > 65536){
					$sheetCount++;
					$sheet =& $this->xls->addWorksheet($sheetName . $sheetCount);
					$col = $header->get("startCol");
					$startRow = $header->get("startRow");

					foreach ($columnTitle->getArray() as $val){
						$sheet->write($startRow,$col,$val->get("title"), $hdrSAP);
						if ($val->get("rowMerge") && $val->get("colMerge")){
							$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col+$val->get("colMerge"));
						}else if ($val->get("rowMerge") ){
							$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col);
						}else if ($val->get("colMerge") ){
							$sheet->setMerge($startRow,$col,$startRow,$col+$val->get("colMerge"));
						}
						if ($val->get("width"))
							$sheet->setColumn($col,$col,$val->get("width"));
						$level = 1;
						if ($val->get("column")){
							$column = $val->get("column");
							foreach ($column->getArray() as $val2){
								$sheet->write($startRow + $level,$col,$val2->get("title"), $hdrSAP);

								if ($val2->get("rowMerge") && $val2->get("colMerge")){
									$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col+$val2->get("colMerge"));
								}else if ($val->get("rowMerge") ){
									$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col);
								}else if ($val->get("colMerge") ){
									$sheet->setMerge($startRow,$col,$startRow,$col+$val2->get("colMerge"));
								}
								if ($val2->get("width"))
									$sheet->setColumn($col,$col,$val2->get("width"));
								$col++;
							}
						}else $col++;
					}
					$startRow += 1;
				}
				//$value->set("level_spasi", strval($value->get("level_spasi")));
				if ($value->get("level_spasi") == '0'){
					$format = $normalFormat2;
					$format2 = $numFormat2;
				}else if ($value->get("level_spasi") == '1'){
					$format = $normalFormat3;
					$format2 = $numFormat3;
				}else if ($value->get("level_spasi") == '2'){
					$format = $normalFormat4;
					$format2 = $numFormat4;
				}else if ($value->get("level_spasi") == '3'){
					$format = $normalFormat5;
					$format2 = $numFormat5;
				}else if ($value->get("level_spasi") == '4'){
					$format = $normalFormat6;
					$format2 = $numFormat6;
				}else if ($value->get("level_spasi") == '5'){
					$format = $normalFormat7;
					$format2 = $numFormat7;
				}else if ($value->get("level_spasi") == '6'){
					$format = $normalFormat8;
					$format2 = $numFormat8;
				}else if ($value->get("level_spasi") == '7'){
					$format = $normalFormat9;
					$format2 = $numFormat9;
				}else if ($value->get("level_spasi") == '8'){
					$format = $normalFormat10;
					$format2 = $numFormat10;
				}else{
				 	$format = $normalFormat;
				 	$format2 = $numFormat;
				}


				foreach($fields as $col => $field){
					if (gettype($value->get($field)) === "string")
						$sheet->write($startRow,$col,$value->get($field),$format);
					else $sheet->write($startRow,$col,floatval($value->get($field)),$format2);
				}

				if (isset($dataAkun)){
					$akun = $dataAkun->get($value->get($fieldKunci));
					if ($akun){
						foreach ($akun->getArray() as $ki => $val){
							$startRow++;
							$akunValue = "";
							foreach($fields as $col => $field){
								if (gettype($value->get($field)) === "string")
									$sheet->write($startRow,$col,$val->get($field),$normalFormat);
								else $sheet->write($startRow,$col, floatval($val->get($field)),$numFormat);
								$akunValue .= $field ."=". $val->get($field) . ";";
							}


						}
					}
				}

			}

	}

	/**
	 * generateDatel function.
	 * digunakan untuk menghasilkan file excel untuk di download dalam bentuk beberapa sheet
	 * @access public
	 * @param mixed $options	: array berisi konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $dataPL (default: null)	: array berisi data executive summary dan detail akun
	 * @return void
	 */
	function generateDatel($options, $namafile, $dataPL){
		$this->xls = new Spreadsheet_Excel_Writer("./tmp/$namafile");
		$periode = $options->get("periode");
		$this->xls->setCustomColor(14, 0,0,128);
		$this->xls->setCustomColor(15, 144,112,53);
		$this->xls->setCustomColor(16, 138,213,4);
		$this->xls->setCustomColor(17, 252,255,151);
		$this->xls->setCustomColor(18, 193,255,205);
		$this->xls->setCustomColor(19, 4,193,33);
		$this->xls->setCustomColor(20, 101,208,119);
		$this->xls->setCustomColor(21, 143,207,153);
		$this->xls->setCustomColor(22, 166,203,172);
		$this->xls->setCustomColor(23, 187,229,194);

		foreach($dataPL->getArray() as $key => $PL){
			//error_log($PL->get("witel"));
			$sheetName = $PL->get("witel");
			$sheetCount = 0;
			$sheet =& $this->xls->addWorksheet($sheetName);
			$hdrSAP =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'valign' => 'middle', 'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'orange','pattern' => 1, 'color' => 'white'	));
			$hdr =& $this->xls->addFormat(array('size' => 20,'bold' => true, 'border' => 1,'valign' => 'middle', 'halign' => 'left'	));

			$hdrKonv =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 14,'pattern' => 1, 'color' => 'white'	));
			$hdrVer =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'maroon','pattern' => 1, 'color' => 'white'	));

			$numFormat =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black'));
			$numFormat->setNumFormat("#,##0");
			$normalFormat =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black' ));

			$numFormat2 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 15,'pattern' => 1, 'color' => 'white'	));
			$numFormat2->setNumFormat("#,##0");
			$normalFormat2 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 15,'pattern' => 1, 'color' => 'white'	));

			$numFormat3 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 16,'pattern' => 1, 'color' => 'black'	));
			$numFormat3->setNumFormat("#,##0");
			$normalFormat3 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 16,'pattern' => 1, 'color' => 'black'	));

			$numFormat4 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 17,'pattern' => 1, 'color' => 'black'	));
			$numFormat4->setNumFormat("#,##0");
			$normalFormat4 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 17,'pattern' => 1, 'color' => 'black'	));

			$numFormat5 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 18,'pattern' => 1, 'color' => 'black'	));
			$numFormat5->setNumFormat("#,##0");
			$normalFormat5 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 18,'pattern' => 1, 'color' => 'black'	));

			$numFormat6 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 19,'pattern' => 1, 'color' => 'black'	));
			$numFormat6->setNumFormat("#,##0");
			$normalFormat6 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 19,'pattern' => 1, 'color' => 'black'	));

			$numFormat7 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 20,'pattern' => 1, 'color' => 'black'	));
			$numFormat7->setNumFormat("#,##0");
			$normalFormat7 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 20,'pattern' => 1, 'color' => 'black'	));

			$numFormat8 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 21,'pattern' => 1, 'color' => 'black'	));
			$numFormat8->setNumFormat("#,##0");
			$normalFormat8 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 21,'pattern' => 1, 'color' => 'black'	));

			$numFormat9 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 22,'pattern' => 1, 'color' => 'black'	));
			$numFormat9->setNumFormat("#,##0");
			$normalFormat9 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 22,'pattern' => 1, 'color' => 'black'	));

			$numFormat10 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 23,'pattern' => 1, 'color' => 'black'	));
			$numFormat10->setNumFormat("#,##0");
			$normalFormat10 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 23,'pattern' => 1, 'color' => 'black'	));

			$header = $options->get("header");
			if ($PL->get("title"))
				$title = $PL->get("title");
			else
				$title = $header->get("title");
			$sheet->write(0,0,$title,$hdr);

			$startRow = $header->get("startRow");
			$col = $header->get("startCol");
			$columnTitle = $header->get("columnTitle");

			foreach ($columnTitle->getArray() as $val){
				if ($val->get("rowMerge") && $val->get("colMerge")){
					$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col+$val->get("colMerge"));
				}else if ($val->get("rowMerge") ){
					$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col);
				}else if ($val->get("colMerge") ){
					$sheet->setMerge($startRow,$col,$startRow,$col+$val->get("colMerge"));
				}
				if ($val->get("width"))
					$sheet->setColumn($col,$col,$val->get("width"));
				$sheet->write($startRow,$col,$val->get("title"), $hdrSAP);
				$level = 1;
				if ($val->get("column")){
					$column = $val->get("column");
					foreach ($column->getArray() as $val2){
						if ($val2->get("rowMerge") && $val2->get("colMerge")){
							$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col+$val2->get("colMerge"));
						}else if ($val->get("rowMerge") ){
							$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col);
						}else if ($val->get("colMerge") ){
							$sheet->setMerge($startRow,$col,$startRow,$col+$val2->get("colMerge"));
						}
						if ($val2->get("width"))
							$sheet->setColumn($col,$col,$val2->get("width"));
						$sheet->write($startRow + $level,$col,$val2->get("title"), $hdrSAP);
						$col++;
					}
				}else $col++;
			}

			$fields = $options->get("fields")->getArray();
			$fieldKunci = $options->get("keyField");
			$startRow += 1;
			$dataAkun = $PL->get("dataAkun");
			foreach ($PL->get("data")->getArray() as $k => $value){
				$startRow += 1;
				if ($startRow > 65536){
					$sheetCount++;
					$sheet =& $this->xls->addWorksheet($sheetName . $sheetCount);
					$col = $header->get("startCol");
					$startRow = $header->get("startRow");

					foreach ($columnTitle->getArray() as $val){
						$sheet->write($startRow,$col,$val->get("title"), $hdrSAP);
						if ($val->get("rowMerge") && $val->get("colMerge")){
							$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col+$val->get("colMerge"));
						}else if ($val->get("rowMerge") ){
							$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col);
						}else if ($val->get("colMerge") ){
							$sheet->setMerge($startRow,$col,$startRow,$col+$val->get("colMerge"));
						}
						if ($val->get("width"))
							$sheet->setColumn($col,$col,$val->get("width"));
						$level = 1;
						if ($val->get("column")){
							$column = $val->get("column");
							foreach ($column->getArray() as $val2){
								$sheet->write($startRow + $level,$col,$val2->get("title"), $hdrSAP);

								if ($val2->get("rowMerge") && $val2->get("colMerge")){
									$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col+$val2->get("colMerge"));
								}else if ($val->get("rowMerge") ){
									$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col);
								}else if ($val->get("colMerge") ){
									$sheet->setMerge($startRow,$col,$startRow,$col+$val2->get("colMerge"));
								}
								if ($val2->get("width"))
									$sheet->setColumn($col,$col,$val2->get("width"));
								$col++;
							}
						}else $col++;
					}
					$startRow += 1;
				}
				//$value->set("level_spasi", strval($value->get("level_spasi")));
				if ($value->get("level_spasi") == '0'){
					$format = $normalFormat2;
					$format2 = $numFormat2;
				}else if ($value->get("level_spasi") == '1'){
					$format = $normalFormat3;
					$format2 = $numFormat3;
				}else if ($value->get("level_spasi") == '2'){
					$format = $normalFormat4;
					$format2 = $numFormat4;
				}else if ($value->get("level_spasi") == '3'){
					$format = $normalFormat5;
					$format2 = $numFormat5;
				}else if ($value->get("level_spasi") == '4'){
					$format = $normalFormat6;
					$format2 = $numFormat6;
				}else if ($value->get("level_spasi") == '5'){
					$format = $normalFormat7;
					$format2 = $numFormat7;
				}else if ($value->get("level_spasi") == '6'){
					$format = $normalFormat8;
					$format2 = $numFormat8;
				}else if ($value->get("level_spasi") == '7'){
					$format = $normalFormat9;
					$format2 = $numFormat9;
				}else if ($value->get("level_spasi") == '8'){
					$format = $normalFormat10;
					$format2 = $numFormat10;
				}else{
				 	$format = $normalFormat;
				 	$format2 = $numFormat;
				}


				foreach($fields as $col => $field){
					if (gettype($value->get($field)) === "string")
						$sheet->write($startRow,$col,$value->get($field),$format);
					else $sheet->write($startRow,$col,floatval($value->get($field)),$format2);
				}
				if (isset($dataAkun)){
					$akun = $dataAkun->get($value->get($fieldKunci));
					//error_log($fieldKunci .":". $value->get($fieldKunci));
					if ($akun){
						//error_log("ada");
						foreach ($akun->getArray() as $ki => $val){
							$startRow++;
							foreach($fields as $col => $field){
								if (gettype($value->get($field)) === "string")
									$sheet->write($startRow,$col,$val->get($field),$normalFormat);
								else $sheet->write($startRow,$col,floatval($val->get($field)),$numFormat);
							}
						}
					}
				}

			}
			error_log("done " . $PL->get("witel"));
		}
		$this->xls->close();
	}
	/**
	 * generate function.
	 * digunakan untuk menghasilkan file excel untuk di download. tidak di gunakan
	 * @access public
	 * @param mixed $options	: array berisi konfigurasi
	 * @param mixed $namafile	: nama file yang akan di download
	 * @param mixed $dataAkun (default: null)	: array berisi data-data akun untuk masing-masing kode neraca
	 * @return void
	 */
	function generateDivisi($options, $namafile, $dataAkun = null){
		$this->xls = new Spreadsheet_Excel_Writer("./tmp/$namafile");
		$periode = $options->get("periode");
		$this->xls->setCustomColor(14, 0,0,128);
		$this->xls->setCustomColor(15, 144,112,53);
		$this->xls->setCustomColor(16, 138,213,4);
		$this->xls->setCustomColor(17, 252,255,151);
		$this->xls->setCustomColor(18, 193,255,205);
		$this->xls->setCustomColor(19, 4,193,33);
		$this->xls->setCustomColor(20, 101,208,119);
		$this->xls->setCustomColor(21, 143,207,153);
		$this->xls->setCustomColor(22, 166,203,172);
		$this->xls->setCustomColor(23, 187,229,194);

		$sheet =& $this->xls->addWorksheet('REPORT');
		$hdrSAP =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'valign' => 'middle', 'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'orange','pattern' => 1, 'color' => 'white'	));
		$hdr =& $this->xls->addFormat(array('size' => 20,'bold' => true, 'border' => 1,'valign' => 'middle', 'halign' => 'left'	));

		$hdrKonv =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 14,'pattern' => 1, 'color' => 'white'	));
		$hdrVer =& $this->xls->addFormat(array('size' => 10,'bold' => true, 'border' => 1,'halign' => 'center', 'bordercolor' => 'white','fgcolor' => 'maroon','pattern' => 1, 'color' => 'white'	));

		$numFormat =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black'));
		$numFormat->setNumFormat("#,##0");
		$normalFormat =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black' ));

		$numFormat2 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 15,'pattern' => 1, 'color' => 'white'	));
		$numFormat2->setNumFormat("#,##0");
		$normalFormat2 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 15,'pattern' => 1, 'color' => 'white'	));

		$numFormat3 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 16,'pattern' => 1, 'color' => 'black'	));
		$numFormat3->setNumFormat("#,##0");
		$normalFormat3 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 16,'pattern' => 1, 'color' => 'black'	));

		$numFormat4 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 17,'pattern' => 1, 'color' => 'black'	));
		$numFormat4->setNumFormat("#,##0");
		$normalFormat4 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 17,'pattern' => 1, 'color' => 'black'	));

		$numFormat5 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 18,'pattern' => 1, 'color' => 'black'	));
		$numFormat5->setNumFormat("#,##0");
		$normalFormat5 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 18,'pattern' => 1, 'color' => 'black'	));

		$numFormat6 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 19,'pattern' => 1, 'color' => 'black'	));
		$numFormat6->setNumFormat("#,##0");
		$normalFormat6 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 19,'pattern' => 1, 'color' => 'black'	));

		$numFormat7 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 20,'pattern' => 1, 'color' => 'black'	));
		$numFormat7->setNumFormat("#,##0");
		$normalFormat7 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 20,'pattern' => 1, 'color' => 'black'	));

		$numFormat8 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 21,'pattern' => 1, 'color' => 'black'	));
		$numFormat8->setNumFormat("#,##0");
		$normalFormat8 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 21,'pattern' => 1, 'color' => 'black'	));

		$numFormat9 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 22,'pattern' => 1, 'color' => 'black'	));
		$numFormat9->setNumFormat("#,##0");
		$normalFormat9 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 22,'pattern' => 1, 'color' => 'black'	));

		$numFormat10 =& $this->xls->addFormat(array('numformat' => '0.00', 'border' => true, 'bordercolor' => 'black','fgcolor' => 23,'pattern' => 1, 'color' => 'black'	));
		$numFormat10->setNumFormat("#,##0");
		$normalFormat10 =& $this->xls->addFormat(array('border' => true, 'bordercolor' => 'black','fgcolor' => 23,'pattern' => 1, 'color' => 'black'	));

		$header = $options->get("header");
		$title = $header->get("title");
		$sheet->write(0,0,$title,$hdr);

		$startRow = $header->get("startRow");
		$col = $header->get("startCol");
		$columnTitle = $header->get("columnTitle");

		foreach ($columnTitle->getArray() as $val){
			if ($val->get("rowMerge") && $val->get("colMerge")){
				$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col+$val->get("colMerge"));
			}else if ($val->get("rowMerge") ){
				$sheet->setMerge($startRow,$col,$startRow+$val->get("rowMerge"),$col);
			}else if ($val->get("colMerge") ){
				$sheet->setMerge($startRow,$col,$startRow,$col+$val->get("colMerge"));
			}
			if ($val->get("width"))
				$sheet->setColumn($col,$col,$val->get("width"));
			$sheet->write($startRow,$col,$val->get("title"), $hdrSAP);
			$level = 1;
			if ($val->get("column")){
				$column = $val->get("column");
				foreach ($column->getArray() as $val2){
					if ($val2->get("rowMerge") && $val2->get("colMerge")){
						$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col+$val2->get("colMerge"));
					}else if ($val->get("rowMerge") ){
						$sheet->setMerge($startRow,$col,$startRow+$val2->get("rowMerge"),$col);
					}else if ($val->get("colMerge") ){
						$sheet->setMerge($startRow,$col,$startRow,$col+$val2->get("colMerge"));
					}
					if ($val2->get("width"))
						$sheet->setColumn($col,$col,$val2->get("width"));
					$sheet->write($startRow + $level,$col,$val2->get("title"), $hdrSAP);
					$col++;
				}
			}else $col++;
		}

		$fields = $options->get("fields")->getArray();
		$fieldKunci = $options->get("keyField");
		$startRow += 1;
		foreach ($options->get("data")->getArray() as $k => $value){
			$startRow += 1;
			//$value->set("level_spasi", strval($value->get("level_spasi")));
			if ($value->get("level_spasi") == '0'){
				$format = $normalFormat2;
				$format2 = $numFormat2;
			}else if ($value->get("level_spasi") == '1'){
				$format = $normalFormat3;
				$format2 = $numFormat3;
			}else if ($value->get("level_spasi") == '2'){
				$format = $normalFormat4;
				$format2 = $numFormat4;
			}else if ($value->get("level_spasi") == '3'){
				$format = $normalFormat5;
				$format2 = $numFormat5;
			}else if ($value->get("level_spasi") == '4'){
				$format = $normalFormat6;
				$format2 = $numFormat6;
			}else if ($value->get("level_spasi") == '5'){
				$format = $normalFormat7;
				$format2 = $numFormat7;
			}else if ($value->get("level_spasi") == '6'){
				$format = $normalFormat8;
				$format2 = $numFormat8;
			}else if ($value->get("level_spasi") == '7'){
				$format = $normalFormat9;
				$format2 = $numFormat9;
			}else if ($value->get("level_spasi") == '8'){
				$format = $normalFormat10;
				$format2 = $numFormat10;
			}else{
			 	$format = $normalFormat;
			 	$format2 = $numFormat;
			}


			foreach($fields as $col => $field){
				if (gettype($value->get($field)) === "string")
					$sheet->write($startRow,$col,$value->get($field),$format);
				else $sheet->write($startRow,$col,floatval($value->get($field)),$format2);
			}

			if (isset($dataAkun)){
				$akun = $dataAkun->get($value->get($fieldKunci));
				if ($akun){
					foreach ($akun->getArray() as $ki => $val){
						$startRow++;
						foreach($fields as $col => $field){
							if (gettype($value->get($field)) === "string")
								$sheet->write($startRow,$col,$val->get($field),$normalFormat);
							else $sheet->write($startRow,$col,floatval($val->get($field)),$numFormat);
						}
					}
				}
			}

		}

	}
	function save(){
		//$this->xls->send($namafile);
		if ($this->xls != null)
			$this->xls->close();
	}
	function generateXlsx($options, $namafile, $dataAkun = null){
		uses("server_modules_codeplex_PHPExcel",false);
		$objPHPExcel = new PHPExcel();
		$header = $options->get("header");
		$title = $header->get("title");
		$columnTitle = $header->get("columnTitle");
		$col = $header->get("startCol");
		$startRow = $header->get("startRow");
		$periode = $options->get("periode");	
 
		// Set document properties
		$objPHPExcel->getProperties()->setCreator("PT TELKOM ")
						 ->setLastModifiedBy("MA")
						 ->setTitle("Fipart")
						 ->setSubject("Fipart")
						 ->setDescription("Financial Performance & Reporting Tools")
						  ->setKeywords("Financial Performance & Reporting Tools")
							 ->setCategory("Fipart");
		$objPHPExcel->setActiveSheetIndex(0);
		$sheet = $objPHPExcel->getActiveSheet();
		
		
		$headerSAP = array('fill' 	=> array(
										'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
										'color'		=> array('rgb' => 'EFEFEF')
									),
				  	   'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array('rgb' => '0000ff')
																)
									
									),
						'font' => array('size' => 10, 'bold' => true, 'color' => array("rgb"=> "0000ff")),
						'alignment' => array(
							'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
						)		
				 );
				 
		$headerStyle = array('font' 	=> array(
										'size'		=> 20,
										'bold'		=> true
									)
				 		);
		
		//EFEFEF
		//D9D9D9
		//F1E9E4
		$normalAbu = array(
							'fill' => array(
								'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
								'color' => array('rgb' => 'F1E9E4')
							),
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array("rgb" => '908E8E'))
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
		$normalKuning = array(
							'fill' => array(
								'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
								'color' => array('rgb' => 'D9D9D9')
							),
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array("rgb" => '908E8E'))
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
		$formatAkun = array(
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN)
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
		$sheet->setCellValueByColumnAndRow(0,1,$title );
		$sheet->getStyle('A1')->applyFromArray($headerStyle);
		$startRow += 1;
		//mergeCellsByColumnAndRow
		foreach ($columnTitle->getArray() as $val){
			$sheet->setCellValueByColumnAndRow($col, $startRow,$val->get("title"));
			$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($headerSAP);
			///error_log($val->get("title") ."( $col : $startRow ) =>" ." merger ".$val->get("rowMerge") .":".$val->get("colMerge"));
			if ($val->get("rowMerge") && $val->get("colMerge")){
				$sheet->mergeCellsByColumnAndRow($col, $startRow, $col+$val->get("colMerge"),$startRow+$val->get("rowMerge"));
				for ($i = 0 ; $i <= $val->get("colMerge"); $i++){
					for ($ix = 0 ; $ix <= $val->get("rowMerge"); $ix++)
						$sheet->getStyleByColumnAndRow($col + $i, $startRow + $ix)->applyFromArray($headerSAP);
				}
			}else if ($val->get("rowMerge") ){
				$sheet->mergeCellsByColumnAndRow($col, $startRow, $col, $startRow+$val->get("rowMerge"));
				for ($i = 0 ; $i <= $val->get("rowMerge"); $i++){
					$sheet->getStyleByColumnAndRow($col, $startRow + $i)->applyFromArray($headerSAP);
				}
			}else if ($val->get("colMerge") ){
				$sheet->mergeCellsByColumnAndRow($col, $startRow, $col + $val->get("colMerge"), $startRow);
				for ($i = 0 ; $i <= $val->get("colMerge"); $i++){
					$sheet->getStyleByColumnAndRow($col + $i, $startRow)->applyFromArray($headerSAP);
				}
			}
			
			if ($val->get("width"))
				$sheet->getColumnDimensionByColumn($col)->setWidth($val->get("width"));
			$level = 1;
			if ($val->get("column")){
				$column = $val->get("column");
				foreach ($column->getArray() as $val2){
					//error_log("Childs " . $val2->get("title") ."( $col : $startRow ) =>" ." merger ".$val2->get("rowMerge") .":".$val2->get("colMerge"));
					$sheet->setCellValueByColumnAndRow($col,$startRow + $level,$val2->get("title"));
					
					if ($val2->get("rowMerge") && $val2->get("colMerge")){
						$sheet->mergeCellsByColumnAndRow($col, $startRow + $level,$col+$val2->get("colMerge"),$startRow+ $level +$val2->get("rowMerge"));
					}else if ($val2->get("rowMerge") ){
						$sheet->mergeCellsByColumnAndRow($col, $startRow + $level,$col,$startRow+ $level+$val2->get("rowMerge"));
					}else if ($val2->get("colMerge") ){
						$sheet->mergeCellsByColumnAndRow($col, $startRow + $level,$col +$val2->get("colMerge"), $startRow+ $level);
					}
					$sheet->getStyleByColumnAndRow($col, $startRow+ $level)->applyFromArray($headerSAP);
					if ($val2->get("width"))
						$sheet->getColumnDimensionByColumn($col)->setWidth($val2->get("width"));
					$col++;
				}
			}else $col++;
		}
		$fields = $options->get("fields")->getArray();
		$fieldKunci = $options->get("keyField");
		$startRow += 1;
		foreach ($options->get("data")->getArray() as $k => $value){
			$startRow += 1;
			
			
			if ($startRow % 2 == 0)
				$format = $normalAbu;
			else $format = $normalKuning;

			foreach($fields as $col => $field){
				if (gettype($value->get($field)) === "string")
					$sheet->setCellValueByColumnAndRow($col, $startRow,$value->get($field));
				else {
					$sheet->setCellValueByColumnAndRow($col, $startRow,floatval($value->get($field)));
					$sheet->getStyleByColumnAndRow($col, $startRow)->getNumberFormat()->setFormatCode("#,##0");
				}
				$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($format);
			}

			if (isset($dataAkun)){
				$akun = $dataAkun->get($value->get($fieldKunci));
				if ($akun){
					foreach ($akun->getArray() as $ki => $val){
						$startRow++;
						if ($startRow % 2 == 0)
							$format = $normalAbu;
						else $format = $normalKuning;
						$akunValue = "";
						foreach($fields as $col => $field){
							if (gettype($value->get($field)) === "string")
								$sheet->setCellValueByColumnAndRow($col, $startRow, $val->get($field));
							else {
								$sheet->setCellValueByColumnAndRow($col, $startRow, floatval($val->get($field)));
								$sheet->getStyleByColumnAndRow($col, $startRow)->getNumberFormat()->setFormatCode("#,##0");
							}
							$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($format);
							$akunValue .= $field ."=". $val->get($field) . ";";
						}


					}
				}
			}

		}
			 
		global $serverDir;
 		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save($serverDir . "/tmp/$namafile");
	
 
		return "/tmp/$namafile";
	}
	function generateXlsxDatel($options, $namafile, $dataPL = null){
		uses("server_modules_codeplex_PHPExcel",false);
		$objPHPExcel = new PHPExcel();
		$header = $options->get("header");
		$title = $header->get("title");
		$columnTitle = $header->get("columnTitle");
		
		$periode = $options->get("periode");	
 
		// Set document properties
		$objPHPExcel->getProperties()->setCreator("PT TELKOM ")
						 ->setLastModifiedBy("MA")
						 ->setTitle("Fipart")
						 ->setSubject("Fipart")
						 ->setDescription("Financial Performance & Reporting Tools")
						  ->setKeywords("Financial Performance & Reporting Tools")
							 ->setCategory("Fipart");
		$objPHPExcel->setActiveSheetIndex(0);
		$headerSAP = array('fill' 	=> array(
										'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
										'color'		=> array('rgb' => 'EFEFEF')
									),
				  	   'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array('rgb' => '0000ff')
																)
									
									),
						'font' => array('size' => 10, 'bold' => true, 'color' => array("rgb"=> "0000ff")),
						'alignment' => array(
							'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
						)			
				 );
				
		$headerStyle = array('font' 	=> array(
										'size'		=> 20,
										'bold'		=> true
									)
						);
		/*
		$this->xls->setCustomColor(14, 0,0,128);//#000080
		$this->xls->setCustomColor(15, 144,112,53);//#907035
		$this->xls->setCustomColor(16, 138,213,4);//8AD504
		$this->xls->setCustomColor(17, 252,255,151);//FCFF97
		$this->xls->setCustomColor(18, 193,255,205);//C0FFCD
		$this->xls->setCustomColor(19, 4,193,33);//04C121
		$this->xls->setCustomColor(20, 101,208,119);//65D077
		$this->xls->setCustomColor(21, 143,207,153);//8FCF99
		$this->xls->setCustomColor(22, 166,203,172);//A6CBAC
		$this->xls->setCustomColor(23, 187,229,194);//BBE5C2
		*/
		$normalAbu = array(
							'fill' => array(
								'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
								'color' => array('rgb' => 'F1E9E4')
							),
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array("rgb" => '908E8E'))
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
		$normalKuning = array(
							'fill' => array(
								'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
								'color' => array('rgb' => 'D9D9D9')
							),
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array("rgb" => '908E8E'))
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
						 
		$formatAkun = array(
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN)
									),
							'font' => array('color' => array("rgb"=> "000000") )
						);
		$sheetCount = -1;
		foreach($dataPL->getArray() as $key => $PL){
			$sheetCount++;
			if ($sheetCount > 0){
				$sheet = $objPHPExcel->createSheet();
			} 
			
			$objPHPExcel->setActiveSheetIndex($sheetCount);
			$sheet = $objPHPExcel->getActiveSheet();
			$sheetName = $PL->get("witel");
			$sheet->setTitle($sheetName);
			error_log("Generate XLSX ". $sheetName);
			if ($PL->get("title"))
				$title = $PL->get("title");
			else
				$title = $header->get("title");
			
			$sheet->setCellValueByColumnAndRow(0,1,$title );
			$sheet->getStyle('A1')->applyFromArray($headerStyle);
			$col = $header->get("startCol");
			$startRow = $header->get("startRow");
				
			//mergeCellsByColumnAndRow
			$startRow += 1;
			foreach ($columnTitle->getArray() as $val){
				$sheet->setCellValueByColumnAndRow($col, $startRow,$val->get("title"));
				$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($headerSAP);
				if ($val->get("rowMerge") && $val->get("colMerge")){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col+$val->get("colMerge"),$startRow+$val->get("rowMerge"));
					for ($i = 0 ; $i <= $val->get("colMerge"); $i++){
						for ($ix = 0 ; $ix <= $val->get("rowMerge"); $ix++)
							$sheet->getStyleByColumnAndRow($col + $i, $startRow + $ix)->applyFromArray($headerSAP);
					}
				}else if ($val->get("rowMerge") ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col, $startRow+$val->get("rowMerge"));
					for ($i = 0 ; $i <= $val->get("rowMerge"); $i++){
						$sheet->getStyleByColumnAndRow($col, $startRow + $i)->applyFromArray($headerSAP);
					}
				}else if ($val->get("colMerge") ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col + $val->get("colMerge"), $startRow);
					for ($i = 0 ; $i <= $val->get("colMerge"); $i++){
						$sheet->getStyleByColumnAndRow($col + $i, $startRow)->applyFromArray($headerSAP);
					}
				}
				if ($val->get("width"))
					$sheet->getColumnDimensionByColumn($col)->setWidth($val->get("width"));
				$level = 1;
				if ($val->get("column")){
					$column = $val->get("column");
					foreach ($column->getArray() as $val2){
						$sheet->setCellValueByColumnAndRow($col,$startRow + $level,$val2->get("title"));
						$sheet->getStyleByColumnAndRow($col, $startRow + $level )->applyFromArray($headerSAP);
						if ($val2->get("rowMerge") && $val2->get("colMerge")){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col+$val2->get("colMerge"), $startRow+ $level+$val2->get("rowMerge"));
						}else if ($val2->get("rowMerge") ){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col,$startRow+ $level+$val2->get("rowMerge"));
						}else if ($val2->get("colMerge") ){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col+$val2->get("colMerge"),$startRow+ $level);
						}
						if ($val2->get("width"))
							$sheet->getColumnDimensionByColumn($col)->setWidth($val2->get("width"));
						$col++;
					}
				}else $col++;
			}
			$fields = $options->get("fields")->getArray();
			$fieldKunci = $options->get("keyField");
			$startRow += 1;
			$dataAkun = $PL->get("dataAkun");
			error_log("Generate PL ". $sheetName);
			foreach ($PL->get("data")->getArray() as $k => $value){
				$startRow += 1;
				
				if ($startRow % 2 == 0)
					$format = $normalAbu;
				else $format = $normalKuning;

				foreach($fields as $col => $field){
					$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($format);
					if (gettype($value->get($field)) === "string")
						$sheet->setCellValueByColumnAndRow($col, $startRow,$value->get($field));
					else {
						$sheet->setCellValueByColumnAndRow($col, $startRow,floatval($value->get($field)));
						$sheet->getStyleByColumnAndRow($col, $startRow)->getNumberFormat()->setFormatCode("#,##0");
					}
					
				}
				if (isset($dataAkun)){
					$akun = $dataAkun->get($value->get($fieldKunci));
					if ($akun){
						foreach ($akun->getArray() as $ki => $val){
							$startRow++;
							if ($startRow % 2 == 0)
								$format = $normalAbu;
							else $format = $normalKuning;
							$akunValue = "";
							foreach($fields as $col => $field){
								$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($format);
								if (gettype($value->get($field)) === "string"){
									$sheet->setCellValueByColumnAndRow($col, $startRow,$val->get($field));
								}else {
									$sheet->setCellValueByColumnAndRow($col, $startRow, floatval($val->get($field)));
									$sheet->getStyleByColumnAndRow($col, $startRow)->getNumberFormat()->setFormatCode("#,##0");
								}
								
								$akunValue .= $field ."=". $val->get($field) . ";";
							}


						}
					}
				}
			}
			error_log("Done PL ". $sheetName);
			
		}
		global $serverDir;
 		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save($serverDir . "/tmp/$namafile");
	
 
		return "/tmp/$namafile";
	}
	function createXlsx(){
		uses("server_modules_codeplex_PHPExcel",false);
		$this->objPHPExcel = new PHPExcel();
		
		// Set document properties
		$this->objPHPExcel->getProperties()->setCreator("PT TELKOM ")
						 ->setLastModifiedBy("MA")
						 ->setTitle("Fipart")
						 ->setSubject("Fipart")
						 ->setDescription("Financial Performance & Reporting Tools")
						  ->setKeywords("Financial Performance & Reporting Tools")
							 ->setCategory("Fipart");
		$this->objPHPExcel->setActiveSheetIndex(0);
		$this->headerSAP = array('fill' 	=> array(
										'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
										'color'		=> array('rgb' => 'EFEFEF')
									),
				  	   'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array('rgb' => '0000ff')
																)
									
									),
						'font' => array('size' => 10, 'bold' => true, 'color' => array("rgb"=> "0000ff")),
						'alignment' => array(
							'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
						)			
				 );
				
		$this->headerStyle = array('font' 	=> array(
										'size'		=> 20,
										'bold'		=> true
									)
						);
		$this->normalAbu = array(
							'fill' => array(
								'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
								'color' => array('rgb' => 'F1E9E4')
							),
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array("rgb" => '908E8E'))
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
		$this->normalKuning = array(
							'fill' => array(
								'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
								'color' => array('rgb' => 'D9D9D9')
							),
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN,
																'color' => array("rgb" => '908E8E'))
									),
							'font' => array('color' => array("rgb"=> "000000") )
				 		);
						 
		$this->formatAkun = array(
							'borders' => array(
										'allborders'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN)
									),
							'font' => array('color' => array("rgb"=> "000000") )
						);
		return $this->objPHPExcel;
	}
	function getWorksheet($index){
		$this->objPHPExcel->setActiveSheetIndex($index);
		return $this->objPHPExcel->getActiveSheet();
	}
	function addWorksheet($sheetName){
		$this->sheetCount++;
		$sheet = $this->objPHPExcel->createSheet();
		$sheet->setTitle($sheetName);
		return $sheet;
	}
	function writeHeader($sheet, $options){
			$header = $options->get("header");
			$title = $header->get("title");
			$columnTitle = $header->get("columnTitle");
			
			$periode = $options->get("periode");
		
			$sheet->setCellValueByColumnAndRow(0,1,$title );
			$sheet->getStyle('A1')->applyFromArray($this->headerStyle);
			$col = $header->get("startCol");
			$startRow = $header->get("startRow");
				
			//mergeCellsByColumnAndRow
			$startRow += 1;
			foreach ($columnTitle->getArray() as $val){
				$sheet->setCellValueByColumnAndRow($col, $startRow,$val->get("title"));
				$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($this->headerSAP);
				if ($val->get("rowMerge") && $val->get("colMerge")){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col+$val->get("colMerge"),$startRow+$val->get("rowMerge"));
					for ($i = 0 ; $i <= $val->get("colMerge"); $i++){
						for ($ix = 0 ; $ix <= $val->get("rowMerge"); $ix++)
							$sheet->getStyleByColumnAndRow($col + $i, $startRow + $ix)->applyFromArray($this->headerSAP);
					}
				}else if ($val->get("rowMerge") ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col, $startRow+$val->get("rowMerge"));
					for ($i = 0 ; $i <= $val->get("rowMerge"); $i++){
						$sheet->getStyleByColumnAndRow($col, $startRow + $i)->applyFromArray($this->headerSAP);
					}
				}else if ($val->get("colMerge") ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col + $val->get("colMerge"), $startRow);
					for ($i = 0 ; $i <= $val->get("colMerge"); $i++){
						$sheet->getStyleByColumnAndRow($col + $i, $startRow)->applyFromArray($this->headerSAP);
					}
				}
				if ($val->get("width"))
					$sheet->getColumnDimensionByColumn($col)->setWidth($val->get("width"));
				$level = 1;
				if ($val->get("column")){
					$column = $val->get("column");
					foreach ($column->getArray() as $val2){
						$sheet->setCellValueByColumnAndRow($col,$startRow + $level,$val2->get("title"));
						$sheet->getStyleByColumnAndRow($col, $startRow + $level )->applyFromArray($this->headerSAP);
						if ($val2->get("rowMerge") && $val2->get("colMerge")){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col+$val2->get("colMerge"), $startRow+ $level+$val2->get("rowMerge"));
						}else if ($val2->get("rowMerge") ){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col,$startRow+ $level+$val2->get("rowMerge"));
						}else if ($val2->get("colMerge") ){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col+$val2->get("colMerge"),$startRow+ $level);
						}
						//if ($val2->get("width"))
						///	$sheet->getColumnDimensionByColumn($col)->setWidth($val2->get("width"));
						$col++;
					}
				}else $col++;
			}
			$this->col = $col;
			$this->row = $startRow;
			return $sheet;
	}
	function writeHeaderJSON($sheet, $options){
			$header = $options->header;
			$title = $header->title;
			$columnTitle = $header->columnTitle;
			
			$periode = $options->periode;
		
			$sheet->setCellValueByColumnAndRow(0,1,$title );
			$sheet->getStyle('A1')->applyFromArray($this->headerStyle);
			$col = $header->startCol;
			$startRow = $header->startRow;
				
			//mergeCellsByColumnAndRow
			$startRow += 1;
			foreach ($columnTitle as $val){
				$sheet->setCellValueByColumnAndRow($col, $startRow,$val->title);
				$sheet->getStyleByColumnAndRow($col, $startRow)->applyFromArray($this->headerSAP);
				if ( $val->rowMerge && $val->colMerge ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col+$val->colMerge,$startRow+$val->rowMerge);
					for ($i = 0 ; $i <= $val->colMerge; $i++){
						for ($ix = 0 ; $ix <= $val->rowMerge; $ix++)
							$sheet->getStyleByColumnAndRow($col + $i, $startRow + $ix)->applyFromArray($this->headerSAP);
					}
				}else if ($val->rowMerge ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col, $startRow+$val->rowMerge);
					for ($i = 0 ; $i <= $val->rowMerge; $i++){
						$sheet->getStyleByColumnAndRow($col, $startRow + $i)->applyFromArray($this->headerSAP);
					}
				}else if ($val->colMerge ){
					$sheet->mergeCellsByColumnAndRow($col, $startRow, $col + $val->colMerge, $startRow);
					for ($i = 0 ; $i <= $val->colMerge; $i++){
						$sheet->getStyleByColumnAndRow($col + $i, $startRow)->applyFromArray($this->headerSAP);
					}
				}
				if ($val->width)
					$sheet->getColumnDimensionByColumn($col)->setWidth($val->width);
				$level = 1;
				if ($val->column){
					$column = $val->column;
					foreach ($column as $val2){
						$sheet->setCellValueByColumnAndRow($col,$startRow + $level,$val2->title);
						$sheet->getStyleByColumnAndRow($col, $startRow + $level )->applyFromArray($this->headerSAP);
						if ($val2->rowMerge && $val2->colMerge){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col+$val2->colMerge, $startRow+ $level+$val2->rowMerge);
						}else if ($val2->rowMerge ){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col,$startRow+ $level+$val2->rowMerge);
						}else if ($val2->colMerge ){
							$sheet->mergeCellsByColumnAndRow($col, $startRow+ $level,$col+$val2->colMerge,$startRow+ $level);
						}
						//if ($val2->get("width"))
						///	$sheet->getColumnDimensionByColumn($col)->setWidth($val2->get("width"));
						$col++;
					}
				}else $col++;
			}
			$this->col = $col;
			$this->row = $startRow;
			return $sheet;
	}
	function write($sheet, $col, $row, $value, $style = null){
		if (isset($style))
			$sheet->getStyleByColumnAndRow($col, $row)->applyFromArray($style);
		if (gettype($value) === "string")
			$sheet->setCellValueByColumnAndRow($col, $row,$value);
		else {
			$sheet->setCellValueByColumnAndRow($col, $row,floatval($value));
			$sheet->getStyleByColumnAndRow($col, $row)->getNumberFormat()->setFormatCode("#,##0");
		}
		return $sheet;
	}
	function saveXlsx($namafile){
		global $serverDir;
 		$objWriter = PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel2007');
		$objWriter->save($serverDir . "/tmp/$namafile");
	
 
		return "/tmp/$namafile";
	}
}
?>
