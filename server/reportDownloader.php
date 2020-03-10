<?php

        header("Content-Encoding: ");

		$file = $_GET["f"];
        $namafile = $_GET["n"];

        $file = str_replace("tmp/","",$file);

		header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header ("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header ("Cache-Control: no-cache, must-revalidate");
		header ("Pragma: no-cache");
		header ("Content-type: Content-Type: application/vnd.ms-excel");
		header ("Content-Disposition: attachment; filename=". $namafile);
		header ("Content-Description: PHP/INTERBASE Generated Data" );
		$data = file_get_contents("./tmp/$file");

        echo $data;
			
?>