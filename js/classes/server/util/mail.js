//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_util_mail = function(connection,lokasi){
	try{
		this.remoteClassName = "server_util_mail";
		window.server_util_mail.prototype.parent.constructor.call(this, connection,lokasi);
		this.className = "server_util_mail";
		this.requester = undefined;	
	}catch(e){
		if (systemAPI != undefined)
			systemAPI.alert("[server_util_mail] :: constructor : " + e,"");
		else 
			alert("[server_util_mail] :: constructor : " + e);
	}
};
window.server_util_mail.extend(window.server_RemoteObject);
window.server_util_mail.implement({
	setUser: function(user, pwd,connectionType){
		this.params.clear();
		this.params.add(user);
		this.params.add(pwd);
		this.params.add(connectionType);			
		this.callAsynch("setUser");	
	},
	configSmtp: function(host, port, timeout){
		this.params.clear();
		this.params.add(host);
		this.params.add(port);
		this.params.add(timeout);		
		this.callAsynch("configSmtp");	
	},
	configPop3: function(host, port){
		this.params.clear();
		this.params.add(host);
		this.params.add(port);		
		this.callAsynch("configPop3");	
	},
	send :  function(from, to, subject, body, attach, callback, callbackObj){
		this.params.clear();
		this.params.add(from);
		this.params.add(to);
		this.params.add(subject);
		this.params.add(body);
		this.params.add(attach);
		this.callAsynch("sendMail", callback, callbackObj);	
	},
	inbox: function(page, rowPerPage, callback, callbackObj){
		this.params.clear();
		this.params.add(page);
		this.params.add(rowPerPage);
		return this.call("inbox", callback, callbackObj);
	},
	inboxA: function(page, rowPerPage, callback, callbackObj){
		this.params.clear();
		this.params.add(page);
		this.params.add(rowPerPage);
		this.callAsynch("inbox", callback, callbackObj);
	},
	getMessage: function(msgIndex){
		this.params.clear();
		this.params.add(msgIndex);
		return this.call("getMessage");
	},
	getMessageA: function(msgIndex, callback, callbackObj){
		this.params.clear();
		this.params.add(msgIndex);
		this.callAsynch("getMessage", callback, callbackObj);
	}
});
