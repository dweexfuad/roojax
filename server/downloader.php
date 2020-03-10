<?php
	include("library.php");	
	
	global $serverPath;
	$serverPath = __FILE__;
	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {        
    	$dirSeparator = "\\";
        $separator = ";";
    }
    else
    {        
    	$dirSeparator = "/";
        $separator = ":";
    }	
	$pos = strrpos($serverPath, $dirSeparator);
	$serverPath = substr($serverPath, 0, $pos);
	$pos = strrpos($serverPath, $dirSeparator);
	global $serverTempDir;
	global $separator;
	$separator = "/" ;
	$serverTempDir = substr($serverPath, $pos + 1,6) . $separator . "tmp";	
	
	uses("server_Request");
	$req = new server_Request();
	$html = @$_REQUEST["html"];;
	$html = str_replace("\\\"", "\"", $html);
	$req->fromXML($html);
	
	$file = $req->params->get(2);
	$tipe = $req->params->get(1);	
	$html = $req->params->get(0);	
	if ($tipe == "xls"){		
		header ("Content-type: application/x-excel");
		header ("Content-Disposition: attachment; filename=". $file .".". $tipe."");
		header ("Content-Description: PHP/INTERBASE Generated Data" );						
		echo $html;
	}else if ($tipe == "doc"){
		header ("Content-type: application/x-msword");
		header ("Content-Disposition: attachment; filename=". $file .".". $tipe."");
		header ("Content-Description: PHP/INTERBASE Generated Data" );						
		echo $html;
	}else{				
	
		//error_log($html);
		uses("server_pdf_Pdf");
		$pdf = new server_pdf_Pdf();
		echo $pdf->createPdfD($html, "L", "mm", "A4", 100, 7, 3);		
	};					
			
?>