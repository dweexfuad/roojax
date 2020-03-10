//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_ShareObject = function(connection, addParam){
	try{				
		window.server_ShareObject.prototype.parent.constructor.call(this, connection, addParam);
		this.remoteClassName = "server_ShareObject";
		this.className = "server_ShareObject";			
	}catch(e){
		alert(e);
	}
};
window.server_ShareObject.extend(window.server_RemoteObject);
window.server_ShareObject.implement({
	register: function(session){
		this.params.clear();
		this.params.add(session);
		this.callAsynch("register");
	},
	unregister: function(session){
		this.params.clear();
		this.params.add(session);
		this.callAsynch("delSession");
	},
	createShare: function(shareName){
		this.params.clear();
		this.params.add(shareName);
		this.callAsynch("createShare");		
	},
	setShareValue: function(share, value)
	{
		this.params.clear();
		this.params.add(share);
		this.params.add(value);
		this.callAsynch("setShareValue");	
	},
	getShareValue: function(share, session)
	{
		this.params.clear();
		this.params.add(share);
		this.params.add(session);
		this.callAsynch("getShareValue");
	},
	callAsynch: function(methodName){
		this.connection.setRequester(this.getRequestObj(methodName));
		this.connection.callAsynch();
	}
});
