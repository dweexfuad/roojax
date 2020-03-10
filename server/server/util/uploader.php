<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
//require("Archive/Tar.php");
class server_util_uploader
{
	protected $html;
	function __construct()
	{
		$this->html= $html;
	}
	function upload($filename, $tmpFile)
	{
		if ($filename == "") return true;
		$tmp = __FILE__;	
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
			$dirSeparator = "\\";
		else
			$dirSeparator = "/";
		for ($i = 1; $i < 4; $i++)
		{	
			$pos = strrpos($tmp, $dirSeparator);
			$tmp = substr($tmp, 0, $pos);
		}
		copy($tmpFile,$tmp . $dirSeparator . "tmp". $dirSeparator . $filename);
		$tmpFile = $tmp . $dirSeparator . "tmp". $dirSeparator . $filename;
/*		error_log($tmpFile);
		$tar = new Archive_Tar($tmpFile);
		$tar->extract($tmp . $dirSeparator . "tmp" . $dirSeparator );
		error_log("sdf");		
*/		
		$zip = 	zip_open($tmpFile);
		if ($zip) 
		{
			while ($zip_entry = zip_read($zip)) 
			{
				$fname = zip_entry_name($zip_entry);
//				error_log( "Name:               " . zip_entry_name($zip_entry) );
//				error_log("Actual Filesize:    " . zip_entry_filesize($zip_entry));
//				error_log("Compressed Size:    " . zip_entry_compressedsize($zip_entry));
//				error_log("Compression Method: " . zip_entry_compressionmethod($zip_entry));
		
				if (zip_entry_open($zip, $zip_entry, "r")) 
				{
					//echo "File Contents:\n";
					$fname = $tmp . $dirSeparator . "tmp". $dirSeparator . $fname;
					$buf = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
					$file = fopen($fname,"w");		
					fputs($file,$buf);
					fclose($file); 
					zip_entry_close($zip_entry);
				}		
//				unlink($fname);
			}
		
			zip_close($zip);
		}
		unlink($tmpFile);
	}
	
}

?>