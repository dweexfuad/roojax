
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
uses("server_util_EventHandler");
class server_util_PdfReport extends FPDF
{		
	public $margin;
	function server_util_PdfReport($type, $orientation, $margin)
	{					
		$this->margin = $margin;
		$this->onPrintHeader = new server_util_EventHandler();
		$this->onPrintFooter = new server_util_EventHandler();
		//Call parent constructor		
		$this->FPDF($orientation,'mm',$type);
		//To make the function Footer() work properly		
		$this->SetAutoPageBreak(true, $margin);
	}	
	function Header(){				
		$this->onPrintHeader->call($this, $this->page);			
	}
	function Footer(){
		//Position at 1.5 cm from bottom
		$this->onPrintFooter->call($this, $this->page);			
	}
}

?>
