<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_Protocol");

class server_LocalProtocol extends server_Protocol
{
    function __construct($connection)
	{
		parent::__construct($connection);
	}
	    
    public function doCall()
    {
        parent::doCall();
    }
}

?>