<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_modules_htmltopdf_html2fpdf", false); 
class server_util_Pdf
{
	protected $html;
	function __construct($html)
	{
		$this->html= $html;
	}
	function getPdf($orientation, $unit, $paperType, $margin, $fontSize, $lineHeight,$response = '')
	{
		//ob_start();
		if (empty($response)){
    		global $manager;
    		$manager->setSendResponse(true);		
		}
		$pdf = new HTML2FPDF($orientation,$unit,$paperType,$fontSize, $lineHeight);
		$pdf->AddPage();
		$pdf->toupper = true;
		$pdf->SetAutoPageBreak(false, $margin);
		$pdf->WriteHTML($this->html);
		$pdf->setBaseFontSize($fontSize);
		$ret = $pdf->Output("SAKU.pdf","I",$response);		
		return $ret;
		
	}
	function getPdfD($orientation, $unit, $paperType, $margin, $fontSize, $lineHeight)
	{
		//ob_start();		
		$pdf = new HTML2FPDF($orientation,$unit,$paperType,$fontSize, $lineHeight);
		$pdf->AddPage();
		$pdf->toupper = true;
		$pdf->SetAutoPageBreak(false, $margin);
		$pdf->usecss = true;
		$pdf->WriteHTML($this->html);
		$pdf->setBaseFontSize($fontSize);
		$ret =  $pdf->Output("SAKU.pdf","D");						
		return $ret;
		
	}
	
}

?>
