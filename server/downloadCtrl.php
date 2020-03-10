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
	$html = @$_POST['html'];
	$html = str_replace("\\\"", "\"", $html);
	$req->fromXML($html);
	
	$file = $req->params->get(2);
	$tipe = $req->params->get(1);	
	$html = $req->params->get(0);		
	if ($tipe == "xls"){				
		header ("Content-type: application/x-msexcel");
		header ("Content-Disposition: attachment; filename=". $file .".". $tipe."");
		header ("Content-Description: PHP/INTERBASE Generated Data" );				
		$save = $serverPath . $separator . "tmp".$separator . $file .".".$tipe;			
		file_put_contents($save, $html);		
		echo  $serverTempDir.$separator . $file .".".$tipe;		
	}else if ($tipe == "doc"){
		header ("Content-type: application/x-msword");
		header ("Content-Disposition: attachment; filename=". $file .".". $tipe."");
		header ("Content-Description: PHP/INTERBASE Generated Data" );				
		$save = $serverPath . $separator . "tmp".$separator . $file .".".$tipe;				
		$html2 = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'></head><body>";
		$html2 .= $html;
		$html2 .= "</body></html>";
		file_put_contents($save, $html2);		
		echo $serverTempDir.$separator . $file .".".$tipe;
	}else{				
	
		//error_log($html);
		uses("server_pdf_Pdf");
		$pdf = new server_pdf_Pdf();
		echo $pdf->createPdfD($html, "P", "mm", "A4", 100, 7, 3);		
	};					
			
?>
