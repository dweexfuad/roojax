<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
class server_Protocol
{
    protected $connection;
    
    function __construct($connection)
	{
		$this->connection = $connection;
	}
	
    public function doCall()
    {
    }
}

?>