<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT									
* $o : Orientation
* $pt : Paper Type
* $fs : fontSize
* $hs : header Font Size
* $h : header
* $t : report title
* $hh: header height
* untuk wordwrap :
* 	gunakan multicell:
* 		jika ada beberapa field yang perlu di wordwrap, cari field perlu row paling banyak.
* 	gambar kotak tiap cell
* 	$x = $GetX();
* 	$y = $GetY();
* 	$Cell(width, maxHeight, '', 1, 0);
* 	$SetXY($GetX()- width, $y);
* 	$Cell(width, maxNumRow = fieldNumRow ? defHeight:maxHeight, field, 1, 0)
***********************************************************************************************/
uses("server_modules_htmltopdf_fpdf", false); 
uses("server_util_PdfReport");
uses("server_BasicObject");
uses("server_util_arrayList");
uses("server_util_Map");
uses("server_DBConnection_dbLib");

class server_util_PdfDesigner extends server_BasicObject
{	
	protected $pdflib;
	public $reportConf;	
	function __construct()
	{
		parent::__construct();	
		$this->onPrintHeader = new server_util_EventHandler();
		$this->onPrintFooter = new server_util_EventHandler();
		$this->onPrintColumnHeader = new server_util_EventHandler();
		$this->onPrintSummary = new server_util_EventHandler();
		$this->onPrint = new server_util_EventHandler();
	}
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("reportConf","server_util_Map",$this->reportConf);
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}	
	function setReportConfig($reportConf){
		$this->reportConf = $reportConf;
	}
	function doPrintSubtitle($title, $parent, $left){		
		$w = $left;
		foreach($title as $i => $value){			
			$y = $this->pdflib->GetY();			
			$w += $value->get('width');
			$this->pdflib->Cell($value->get('width'),$value->get('height'),$value->get('caption'),1,0,'C',true);
			if ($value->get("subtitle") != null){
				$this->pdflib->SetXY($w - $value->get('width'), $y + $value->get('height'));
				$this->doPrintSubtitle($value->get("subtitle")->getArray(), $value, $w - $value->get('width'));
			}
			$this->pdflib->SetXY($w, $y);
		}
	}
	function doPrintHeader($sender, $page){	
		/*title
		 * title[] = {caption:'', font:{size:'', family:'', style:''}, height:''}
		 * */	
		$title = $this->colHeader->get('columns')->getArray();
		$w = 0;
		foreach($title as $i => $value){
			$w += $value->get('width');
		}
		$this->pdflib->SetX($this->margin);
		$title = $this->pageTitle->getArray();	
		foreach ($title as $i => $value){
			$font = $value->get('font');
			$this->pdflib->SetFont($font->get('family'),$font->get('style'),$font->get('size'));
			$this->pdflib->Cell($w,$value->get('height'),$value->get('caption'),0,1,'C');			
		}		
		/*colHeader
		 * colheader = {bgcolor:{r:,g:,b:},
		 * 				font:{family:, style:,size:},
		 * 				title:[{
			 * 					caption:'',
		
			 * 					width: '',
			 * 					height:'',
			 * 					field:
			 * 					}]
		 * 				}
		 * */
		$bgColor = $this->colHeader->get('bgcolor');
		if ($bgColor != null) $this->pdflib->SetFillColor($bgColor->get('r'),$bgColor->get('g'),$bgColor->get('b'));
		$font = $this->colHeader->get('font');
		$this->pdflib->SetFont($font->get('family'),$font->get('style'), $font->get('size'));
		//Header				
		$w = $this->pdflib->margin;		
		$this->colWidth = array();
		$maxrowheight = 0;
		$title = $this->colHeader->get('columns')->getArray();
		foreach($title as $i => $value){
			$y = $this->pdflib->GetY();
			$w += $value->get('width');
			$this->colWidth[] = $value->get('width');
			$maxrowheight = max($maxrowheight, $value->get('height'));
			$this->pdflib->Cell($value->get('width'),$value->get('height'),$value->get('caption'),1,0,'C',$this->colHeader->get("fill"));
			if ($value->get("subtitle") != null){
				$this->pdflib->SetXY($w - $value->get('width'), $y + $value->get('height'));				
				$this->doPrintSubtitle($value->get("subtitle")->getArray(), $value, $w - $value->get('width'));
			}
			$this->pdflib->SetXY($w, $y);
		}		
		$this->pdflib->Ln($maxrowheight);    
	}
	function doPrintFooter($sender, $page){
		
	}
	function doCheckSubtitle($title, $parent){
		foreach($title as $i => $value){										
			if ($value->get('field') != null){
				if ($value->get('wordwrap')){
					$numrow = $this->pdflib->WordWrap($row[$value->get('field')],$value->get('width') -2); 				
					$value->set("numrow",$numrow);
				}
				$this->maxrow = max($numrow, $this->maxrow);
			}else if ($value->get("subtitle") != null){					
				$this->doCheckSubtitle($value->get("subtitle")->getArray(), $value);
			}				
		}
	}
	function doPrintSub($title, $row, $rowHeight, &$w, $y1){
		foreach($title as $i => $value){									
			if ($value->get('field') != null){
				$this->colWidth[] = $value->get('width');
				$y = $this->pdflib->GetY();			
				$w += $value->get('width');
				if ($value->get('wordwrap')){
					$this->pdflib->Cell($value->get('width'),$rowHeight,'',1,0,'L',$value->get('fill'));//buat kotak dulu				
					$this->pdflib->SetXY($this->pdflib->GetX() - $value->get('width'),$y1);								
					$this->pdflib->MultiCell($value->get('width'),$this->rowHeight,$row[$value->get('field')],0);														
					$y2 = $this->pdflib->GetY();
					$y = $y2 - $y1;			
					$this->pdflib->SetXY($w,  $this->pdflib->GetY() - $y);
				}else {
					if (gettype($row[$value->get('field')]) == 'float' || gettype($row[$value->get('field')]) == 'integer' || gettype($row[$value->get('field')]) == 'double')
						$this->pdflib->Cell($value->get('width'),$rowHeight,number_format( floatval($row[$value->get('field')]),0,',','.'),1,0,$value->get('alignment'),$value->get('fill'));								
					else $this->pdflib->Cell($value->get('width'),$rowHeight,$row[$value->get('field')],1,0,$value->get('alignment'),$value->get('fill'));								
				}	
			}else {
				if ($value->get("subtitle") != null){					
					$this->doPrintSub($value->get("subtitle")->getArray(), $row, $rowHeight, $w, $y1);
				}
			}			
		}
	}
	function FetchNextObject(){
		$ret = false;
		if (!$this->rs->EOF){
			$ret = array();
			for ($i = 0; $i < $this->rs->FieldCount(); $i++){
				$ret[strtolower($this->rs->FetchField($i)->name)] = $this->rs->fields[$i];
			}
			$this->rs->MoveNext();
		}
		return $ret;
	}
	function generate($dataProvider,$reportConf = null){
		global $dbLib;
		if ($reportConf == null) $reportConf = $this->reportConf;		
		$dbLib = new server_DBConnection_dbLib($dataProvider->get("connection"));		
		//$pageTitle, $colHeader, $summary, $footer
		$this->pageTitle = $reportConf->get("pageTitle");
		$this->colHeader = $reportConf->get("colHeader");
		$this->summary = $reportConf->get("summary");
		$this->footer = $reportConf->get("footer");		
		$this->margin = $reportConf->get("margin");
		$this->groupHeader = $reportConf->get("groupHeader");
		$this->rowHeight = $reportConf->get("rowHeight");
		$this->pdflib = new server_util_PdfReport($reportConf->get("type"), $reportConf->get("orientation"), $reportConf->get("margin"));		
		$this->pdflib->AliasNbPages();			
		$this->pdflib->onPrintHeader->set($this,"doPrintHeader");
		$this->pdflib->onPrintFooter->set($this,"doPrintFooter");
		$sql = $dataProvider->get("sql");
		$start = (($dataProvider->get("page")-1) * $dataProvider->get("rowPerPage"));
		$rs=$dbLib->LimitQuery($sql->get("Q1")->get("sqlText"),$dataProvider->get("rowPerPage"),$start);			
		$this->rs= $rs;
		$title = $this->colHeader->get('columns')->getArray();		
		$this->pdflib->AddPage();
		$index = $start+1;
		while ($row = $this->FetchNextObject()){		
			//$row = $this->convertToMap($rs);			
			$this->maxrow = 1;					
			foreach($title as $i => $value){				
				if ($value->get('field') != null){								
					if ($value->get('wordwrap')){						
						$numrow = $this->pdflib->WordWrap($row[$value->get('field')],$value->get('width') -2); 				
						$value->set("numrow",$numrow);
					}					
					$this->maxrow = max($numrow, $this->maxrow);
				}else if ($value->get("subtitle") != null){					
					$this->doCheckSubtitle($value->get("subtitle")->getArray(), $value);
				}				
			}	
			if ($this->maxrow <0) $this->maxrow = 1;
			$rowHeight = $this->maxrow * $this->rowHeight;
			$w = $this->margin;
			$this->pdflib->SetX($this->margin);
			$y1 = $this->pdflib->GetY();
			foreach($title as $i => $value){						
				if ($value->get('field') != null){				
					$w += $value->get('width');
					$this->colWidth[] = $value->get('width');											
					if ($value->get('wordwrap')){
						$this->pdflib->Cell($value->get('width'),$rowHeight,'',1,0,'L',$value->get('fill'));//buat kotak dulu				
						$this->pdflib->SetXY($this->pdflib->GetX() - $value->get('width'),$y1);								
						$this->pdflib->MultiCell($value->get('width'),$this->rowHeight,$row[$value->get('field')],0);														
						$y2 = $this->pdflib->GetY();
						$y = $y2 - $y1;			
						$this->pdflib->SetXY($w,  $this->pdflib->GetY() - $y);
					}else {
						if (gettype($row[$value->get('field')]) == 'float' || gettype($row[$value->get('field')]) == 'integer' || gettype($row[$value->get('field')]) == 'double')
							$this->pdflib->Cell($value->get('width'),$rowHeight,number_format( floatval($row[$value->get('field')]),0,',','.'),1,0,$value->get('alignment'),$value->get('fill'));								
						else if ($value->get('field') == "rowid")
							$this->pdflib->Cell($value->get('width'),$rowHeight,$index,1,0,$value->get('alignment'),$value->get('fill'));									
						else $this->pdflib->Cell($value->get('width'),$rowHeight,$row[$value->get('field')],1,0,$value->get('alignment'),$value->get('fill'));								
					}	
					if ($y1 != $this->pdflib->GetY()) $y1 = $this->pdflib->GetY();
				}else if ($value->get("subtitle") != null){				
					$this->doPrintSub($value->get("subtitle")->getArray(), $row, $rowHeight, $w, $y1);
				}				
			}
			$this->pdflib->Ln($rowHeight);			
			$index++;			
		}		
		$ret = $this->pdflib->Output($reportConf->get("name").".pdf",'I',true);
		return $ret;		
	}
		
}

?>
