/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
window.controls_exception = function(message, code, file, line)
{
    window.controls_exception.prototype.parent.constructor.call(this);
    
    this.className = "controls_exception";
    
    if (message == undefined)
        message = "Unknown exception";
        
    if (code == undefined)
        code = 0;
        
    this.message = message;
    this.code = code;
    this.file = file;
    this.line = line;
}

window.controls_exception.extend(window.controls_XMLAble);
window.controls_exception  = window.controls_exception;
window.controls_exception.prototype.doSerialize = function()
{
    window.controls_exception.prototype.parent.doSerialize.call(this);
    
    this.serialize("message",   "string");
    this.serialize("code",      "integer");
    this.serialize("file",      "string");
    this.serialize("line",      "integer");
}

window.controls_exception.prototype.toString = function()
{
    return "[Error " + this.getCode() + "] " + this.getMessage() + " (" + this.getFile() + ":" + this.getLine() + ")";
}

//---------------------------- Setter & Getter -----------------------------------

window.controls_exception.prototype.getMessage = function()
{
    return this.message;
}

window.controls_exception.prototype.setMessage = function(data)
{
    this.message = data;
}

window.controls_exception.prototype.getCode = function()
{
    return this.code;
}

window.controls_exception.prototype.setCode = function(data)
{
    this.code = data;
}

window.controls_exception.prototype.getFile = function()
{
    return this.file;
}

window.controls_exception.prototype.setFile = function(data)
{
    this.file = data;
}

window.controls_exception.prototype.getLine = function()
{
    return this.line;
}

window.controls_exception.prototype.setLine = function(data)
{
    this.line = data;
}
