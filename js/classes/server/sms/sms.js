/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/

uses("server_RemoteObject");
window.server_sms_sms = function(connection)
{
	try
	{
		this.remoteClassName = "server_sms_sms";
		window.server_sms_sms.prototype.parent.constructor.call(this, connection);
		this.className = "server_sms_sms";
		
	}catch(e)
	{
		alert("[server_sms_sms] :: constructor : " + e);
	}

}
window.server_sms_sms.extend(window.server_RemoteObject);

window.server_sms_sms.prototype.sendSms = function(number, text, callback, callbackObj)
{
	this.params.clear();
	this.params.add(number);
	this.params.add(text);	
	this.callAsynch("sendSms", callback, callbackObj);
}
window.server_sms_sms.prototype.sendToMany = function(number, text, callback, callbackObj)
{
	this.params.clear();
	this.params.add(number);
	this.params.add(text);	
	this.callAsynch("sendToMany", callback, callbackObj);
}
window.server_sms_sms.prototype.inbox = function()
{
	this.params.clear();	
	return this.call("inbox");
}
window.server_sms_sms.prototype.outbox = function()
{
	this.params.clear();	
	return this.call("outbox");
}
window.server_sms_sms.prototype.delSms = function(id, box, callback, callbackObj)
{
	this.params.clear();	
	this.params.add(id);
	this.params.add(box);
	this.callAsynch("delSms", callback, callbackObj);
}
window.server_sms_sms.prototype.getIMEI = function(callback, callbackObj)
{
	this.params.clear();	
	this.params.add(id);
	this.params.add(box);
	this.callAsynch("getImei", callback, callbackObj);
}
