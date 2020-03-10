<?php

include("Doc.php");
//reset ($_FILES);
include("Archive/Tar.php");
try
{	
		$filename = strtolower($_FILES["uploadFile"]['name']);
		$tmpFile = $_FILES["uploadFile"]['tmp_name'];
		$tmp = __FILE__;	
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
			$dirSeparator = "\\";
		else
			$dirSeparator = "/";
		for ($i = 1; $i < 3; $i++)
		{	
			$pos = strrpos($tmp, $dirSeparator);
			$tmp = substr($tmp, 0, $pos);
		}
		$ext = strpos($filename,".zip");		
		if (!$ext)
		{
			$ext = strpos($filename,".tar");			
			if 	(!$ext)	
			{
				$ext = strpos($filename,".xml");
				if (!$ext)
					die ("unreadable file");					
				$xml = new XML_Doc();					
				$xml->parseFile($tmpFile);				
				xml_data($xml->rootNode);
			}else 
			{				
				$obj = new Archive_Tar($tmpFile); // name of archive
				if ($obj->extract($tmp . $dirSeparator . "tmp". $dirSeparator)){} 													
				else
					die ('Error in file extraction');				
				$files = $obj->listContent();       // array of file information												
				foreach ($files as $f) 
				{					
					$file = $tmp . $dirSeparator . "tmp". $dirSeparator. $f["filename"];		
					echo $file ."<br>";
//					$xml = new XML_Doc();						
//					$xml->parseFile($file);
//					xml_data($xml->rootNode);
					echo file_get_contents($file);
					unlink($file);				
					echo "<br>";
				}
			}
		}else 
		{ 
			$zip = 	zip_open($tmpFile);
			if ($zip) 
			{
				while ($zip_entry = zip_read($zip)) 
				{
					$fname = zip_entry_name($zip_entry);
					if (zip_entry_open($zip, $zip_entry, "r")) 
					{
						$buf = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
						zip_entry_close($zip_entry);
						$xml = new XML_Doc();					
						$xml->parse($buf);
						$data = xml_data($xml->rootNode);
						$data = substr($data,1);
						echo $data;
						echo "<br>";
					}		
				}			
				zip_close($zip);
			}
		}

}
catch (Exception $e)
{
    error_log($e->getTraceAsString());
    $ret = false;
}

if ($ret)
    $retVal = "true";
else
    $retVal = "false";

?>
