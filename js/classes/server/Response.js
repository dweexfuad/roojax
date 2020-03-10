//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_Response = function(){
    window.server_Response.prototype.parent.constructor.call(this);
    this.className = "server_Response";    
    this.encryption = 0;
    this.code = 0;
    this.value = undefined;
};
window.server_Response.extend(window.control_XMLAble);
window.server_Response.implement({
	doSerialize: function(){
	    window.server_Response.prototype.parent.doSerialize.call(this);
	    
	    this.serialize("code",          "string");
		this.serialize("encryption",   "integer");
		this.serialize("value",        "server_util_XMLAble");
	},
	clear: function(){
	    this.code = 0;
		this.value = undefined;
	},
	getEncryption: function(){
		return this.encryption;
	},
	setEncryption: function(data){
		this.encryption = data;
	},
	getCode: function(){
		return this.code;
	},
	setCode: function(data){
		this.code = data;
	},
	getValue: function(){
		return this.value;
	},
	setValue: function(data){
		this.value = data;
	}
});
