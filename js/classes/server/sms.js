//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_Response = function()
{
    window.server_Response.prototype.parent.constructor.call(this);
    this.className = "server_Response";
    this.encryption = 0;
    this.code = 0;
    this.value = undefined;
}

window.server_Response.extend(window.control_XMLAble);

window.server_Response.prototype.doSerialize = function()
{
    window.server_Response.prototype.parent.doSerialize.call(this);
    
    this.serialize("code",          "string");
	this.serialize("encryption",   "integer");
	this.serialize("value",        "server_util_XMLAble");
}

//---------------------------- Function -----------------------------------

window.server_Response.prototype.clear = function()
{
    this.code = 0;
	this.value = undefined;
}
	
//---------------------------- Setter & Getter -----------------------------------

window.server_Response.prototype.getEncryption = function()	
{
	return this.encryption;
}

window.server_Response.prototype.setEncryption = function(data)
{
	this.encryption = data;
}

window.server_Response.prototype.getCode = function()	
{
	return this.code;
}

window.server_Response.prototype.setCode = function(data)
{
	this.code = data;
}

window.server_Response.prototype.getValue = function()	
{
	return this.value;
}

window.server_Response.prototype.setValue = function(data)
{
	this.value = data;
}
