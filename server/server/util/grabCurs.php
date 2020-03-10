<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");

class server_util_grabCurs  extends server_BasicObject
{
	protected $curr;
	protected $curs;
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
	function getCurs($fromCurs, $toCurs)
	{
		$fp = fopen ("http://finance.yahoo.com/d/quotes.csv?s=$fromCurs$toCurs=X&f=sl1d1t1c1ohgv&e=.csv","r");
		$data = fgetcsv ($fp, 1000, ",");
		
		fclose ($fp);
		$curs = $data[1];
		if ($toCurs == "IDR")
			$curs = str_replace(".",",",$curs);
		return $curs;
	}
}
?>