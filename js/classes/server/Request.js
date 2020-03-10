//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_Request = function(){
	try{
		window.server_Request.prototype.parent.constructor.call(this);
		this.className = "server_Request";        
		this.objectId = undefined;
		this.sessionId = undefined;
		this.methodName = undefined;
		this.encryption = 0;
		this.dbSetting = undefined;
		this.userlog = undefined;				
		//uses("server_util_arrayList");
		this.params = new server_util_arrayList();
	}catch(e){
		alert("[request]::contructor:"+e);
	}
};
window.server_Request.extend(window.control_XMLAble);
window.server_Request.implement({
	doSerialize: function(){
	    window.server_Request.prototype.parent.doSerialize.call(this);
	    this.serialize("objectId",  "string");
		this.serialize("sessionId", "string");
		this.serialize("methodName","string");
		this.serialize("encryption","integer");
		this.serialize("dbSetting", "string");
		this.serialize("userlog",	"string");
		this.serialize("params",    "server_util_arrayList");
	},
	clear: function(){
	    this.objectId = undefined;
		this.methodName = undefined;
		this.params.clear();
		if (system.activeApplication){
			this.dbSetting = system.activeApplication._dbSetting;
			this.userlog = system.activeApplication._userLog;
		}
	},
	decrypt: function(){
	},
	getEncryption: function()	{
		return this.encryption;
	},
	setEncryption: function(data){
		this.encryption = data;
	},
	getObjectId: function(){
		return this.objectId;
	},
	setObjectId: function(data){
		this.objectId = data;
	},
	getSessionId: function(){
		return this.sessionId;
	},
	setSessionId: function(data){
		this.sessionId = data;
	},
	getMethodName: function(){
		return this.methodName;
	},
	setMethodName: function(data){
		this.methodName = data;
	},
	getParams: function(){
		return this.params;
	},
	setParams: function(params){
		this.params.clear();
	    this.params.addAll(params);
	}
});
