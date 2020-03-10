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
uses("server_modules_powerpoint", false); 
uses("server_util_EventHandler");
class server_util_powerpoint extends FPDF
{	
	var $header;
	var $orientation;
	var $fs;
	var $headerSize;
	var $title;
	var $paperType;
	var $headerHeight;
	var $headerWidth;
	var $titleHeader;
	var $titleSize;
	var $onPrintHeader;
	var $onPrintFooter;
	var $row;
	var $changeHeader;
	function server_util_PdfLib($t,$th, $ts, $o, $pt, $fs, $h,$hs, $hh, $hw, $margin)
	{	
		$this->header = $h;
		$this->orientation = $o;
		$this->fs = $fs;
		$this->headerSize = $hs;
		$this->title = $t;
		$this->titleHeight = $th;
		$this->titleSize = $ts;
		$this->paperType = $pt;		
		$this->headerHeight = $hh;
		$this->headerWidth = $hw;
		$this->changeHeader = false;
		$this->onPrintHeader = new server_util_EventHandler();
		$this->onPrintFooter = new server_util_EventHandler();
		//Call parent constructor		
		$this->FPDF($o,'mm',$pt);
		//To make the function Footer() work properly		
		$this->SetAutoPageBreak(true, $margin);
	}	
	function Header(){
		//Title		
		//Move to the right
		//$this->Cell(80);
		//Title	
		if ($this->onPrintHeader->getTarget() == null){			
			$this->SetY(10);
			foreach ($this->title as $i => $value){
				$this->SetFont('Times','B',$this->titleSize[$i]);
				$this->Cell(0,$this->titleHeight[$i],$value,0,1,'C');			
			}
			$this->Ln(10);
			$this->SetFillColor(128,128,128);				
			$this->SetLineWidth(.3);
			$this->SetFont('','B', $this->headerSize);
			//Header
			$w= $this->headerWidth;        	
			$h= $this->headerHeight;      
			foreach($this->header as $i => $value){
				$this->Cell($w[$i],$h,$value,1,0,'C',true);
			}
			$this->Ln();    
		}else {
			$this->onPrintHeader->call($this, $this->page);	
		}
	}
	function Footer(){
		//Position at 1.5 cm from bottom
		if ($this->onPrintFooter->getTarget() == null){					
			$this->SetY(-10);
			//Arial italic 8
			$this->SetFont('Arial','I',8);
			//Page number
			$this->Cell(0,10,'Hal: '.$this->PageNo().'/{nb}',0,0,'C');			
			//			
			$this->SetX(10);
			//Arial italic 8
			$this->SetFont('Arial','I',6);
			//Page number
			$this->Cell(0,10,'Dicetak '.date("d M Y"),0,0,'L');
		}else {
			$this->onPrintFooter->call($this, $this->page);	
		}
	}
}

?>
