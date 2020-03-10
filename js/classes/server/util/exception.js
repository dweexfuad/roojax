/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/

window.server_util_exception = function(message, code, file, line)
{
    window.server_util_exception.prototype.parent.constructor.call(this);
    
    this.className = "server_util_exception";
    
    if (message == undefined)
        message = "Unknown server_util_exception";
        
    if (code == undefined)
        code = 0;
        
    this.message = message;
    this.code = code;
    this.file = file;
    this.line = line;
}

window.server_util_exception.extend(window.control_exception);
