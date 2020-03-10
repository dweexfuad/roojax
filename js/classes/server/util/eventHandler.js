/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/

window.server_util_eventHandler = function(target, method)
{
    {
		
        window.server_util_eventHandler.prototype.parent.constructor.call(this);
        this.className = "server_util_eventHandler";
        
        this.target = target;
        this.method = method;
    }
}

window.server_util_eventHandler.extend(window.control_eventHandler);
