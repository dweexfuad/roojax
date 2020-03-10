<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");
class server_util_xlsChart  extends server_BasicObject
{
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
	function getChart($filename, $title, $data, $chartType, $series, $xTitle, $yTitle, $colTitle){
		global $manager;
		$manager->setSendResponse(false);
		uses("server_util_File");
		$file = md5(date("r"));
		$filename = $filename;
		$tmpfile = $manager->getTempDir() . "/$filename";		
		$perl = new server_util_File($manager->getTempDir() . "/$file.pl");
		$perl->appendFile("#!/usr/bin/perl -w 
					use strict;
					use lib '". $manager->getWorkingDir() ."/perl/OLE';
					use lib '". $manager->getWorkingDir() ."/perl/Parse';
					use lib '". $manager->getWorkingDir() ."/perl/Spreadsheet';
					use lib '". $manager->getWorkingDir() ."/perl';
					use Spreadsheet::WriteExcel;

					my \$workbook  = Spreadsheet::WriteExcel->new( '$tmpfile' );
					my \$worksheet = \$workbook->add_worksheet();
					my \$bold      = \$workbook->add_format( bold => 1 );\n");
		
		# Add the worksheet data that the charts will refer to.		
		$perl->appendFile("my \$data = [\n");
		$max = 0;
		$first = true;
		foreach ($data->getArray() as $key => $value){
			$perl->appendFile(" [");
			$dt = "";							
			foreach ($value->getArray() as $key2 => $value2){				
				$type = gettype($value2);
				if ($type == "string") $dt .= ",'" . $value2 ."'";
				else $dt .= "," . $value2;
				if ($first) $max++;
			}
			$dt = substr($dt,1);
			$perl->appendFile($dt . " ],\n");	
			$first = false;
		}
		$perl->appendFile("];\n");
		
		$perl->appendFile("my \$headings = [ ");
		$header = "";
		foreach($colTitle->getArray() as $key => $value){						
			$header .= ",'". $value ."'";
		}
		$header = substr($header, 1);		
		$perl->appendFile("$header ];\n");    
		$perl->appendFile("\$worksheet->write( 'A1', \$headings, \$bold );
			\$worksheet->write( 'A2', \$data );
			# Create a new chart object. In this case an embedded chart.
			
			my \$chart = \$workbook->add_chart( type => '$chartType', embedded => 1 );
			
			# Configure the first series. (Sample 1)\n");
		foreach($series->getArray() as $key => $value){	
			$value = $value->getArray();
			$perl->appendFile("\$chart->add_series(
				name       => '". $value[0]."',
				categories => '=Sheet1!".$value[1] ."',
				values     => '=Sheet1!".$value[2] ."',
			);\n");		
		}
		$perl->appendFile("# Add a chart title and some axis labels.
			\$chart->set_title ( name => '$title' );
			\$chart->set_x_axis( name => '$xTitle' );
			\$chart->set_y_axis( name => '$yTitle' );

			# Insert the chart into the worksheet (with an offset).
			\$worksheet->insert_chart( 'A".($max + 3)."', \$chart, 0,0,2, 1.3 );\n");
   
		$perl->appendFile("__END__");
		$ret = @exec("perl ". $manager->getTempDir() . "/$file.pl");
		Header("Content-type: application/octet-stream");
        Header("Content-Disposition: attachment; filename=".$filename);
        readfile($tmpfile);
		unlink($tmpfile);		
		unlink($manager->getTempDir() . "/$file.pl");
		//return "server/tmp/$filename";
	}
	
}
?>
