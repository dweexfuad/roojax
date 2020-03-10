//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_RemoteObject = function(connection, addParam){
	try{
		window.server_RemoteObject.prototype.parent.constructor.call(this);
		this.className = "RemoteObject";
		//uses("server_util_arrayList");
		if (connection == undefined){
			if (window.system != undefined)
				connection = window.system.connection;
		}
		this.connection = connection;
		this.params = new server_util_arrayList();
		this.requestReadyListener = new server_util_arrayList();	
		this.requester = undefined;
		if (this.remoteClassName != undefined)
		{
			this.params.clear();			
			this.params.add(this.remoteClassName);			
			if (addParam != undefined) this.params.add(addParam);				
			this.objectId = "manager";			
			this.objectId = this.call("createObject");			
		}
		this.addParam = addParam;
		this.property = {};				
	}catch(e){
		alert(e);
	}
};
window.server_RemoteObject.extend(window.control_XMLAble);
window.server_RemoteObject.implement({	
	addListener: function(listener){
	    if (this.requestReadyListener.indexOf(listener) < 0)
	        this.requestReadyListener.add(listener);
	},
	delListener: function(listener){
		this.requestReadyListener.delObject(listener);
	},
	getUrl: function(methodName){
	    if ((this.connection != undefined) && (this.objectId != undefined) && (this.objectId != "")){
	        result = this.connection.getUrl(this.objectId, methodName, this.params);
	        return result;
	    }
	    else
	        return undefined;
	},
	getUrl2: function(methodName){
	    if ((this.connection != undefined) && (this.objectId != undefined) && (this.objectId != "")){
	        result = this.connection.getUrl2(this.objectId, methodName, this.params);
	        return result;
	    }
	    else
	        return undefined;
	},
	getRequestObj: function(methodName){		
		try{			
			if ((this.connection != undefined) && (this.objectId != undefined) && (this.objectId != "")){	
				result = this.connection.getRequestObj(this.objectId, methodName, this.params, this);    
				return result;
			}
			else
				return undefined;
		}catch(e){
			system.alert(this, e,"");
		}
	}, 
	call: function(methodName){		
	    if ((this.connection != undefined) && (this.objectId != undefined) && (this.objectId != "")){	
			result = this.connection.call(this.objectId, methodName, this.params, this);    
	        return result;
	    }
	    else
	        return undefined;
	},
	callAsynch: function(methodName,callback, requester){				
	    if ((this.connection != undefined) && (this.objectId != undefined) && (this.objectId != "")){
	        this.connection.callAsynch(this.objectId, methodName, this.params, this, requester || this.requester,callback);
		}
	},
	doRequestReady: function(sender, retCode, methodName, value, requester,callback){
	    var obj;	    
	    for (var i in this.requestReadyListener.objList){
	        obj = this.requestReadyListener.objList[i];
	        try{
	           if ((callback) && (eval("obj."+callback)) )
	               eval("obj."+callback+"(this, methodName, value, requester, sender);");
	           else obj.doRequestReady(this, methodName, value, requester, sender);
	        }
	        catch (e){
	        }
	    }
	},
	getObjectId: function(){
		return this.objectId;
	},
	getProperty: function(){
		return this.property;
	},
	setProperty: function(name, value){
		this.property[name] = value;
	},
	free: function(){
		this.params.clear();			
		this.params.add(this.objectId);					
		this.connection.callAsynch("manager", "delObject", this.params, undefined);
	}
});
