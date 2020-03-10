//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_simpleRemoteObject = function(address, addParam){
	try{
		this.remoteClassName = undefined;
		window.server_simpleRemoteObject.prototype.parent.constructor.call(this);
		this.className = "simpleRemoteObject";
		if (system.simpleConnection === undefined){
            uses("server_simpleConnection");				
            system.simpleConnection = new server_simpleConnection("server/simpleServer.php");		
            address = "server/simpleServer.php";
        }		
        this.connection = system.simpleConnection;
        this.address = address;		
		this.params = "";
		this.requestReadyListener = new server_util_arrayList();	
		this.requester = undefined;		
		this.addParam = addParam;
		this.property = {};		
	}catch(e){
		alert(e);
	}
};
window.server_simpleRemoteObject.extend(window.XMLAble);
window.server_simpleRemoteObject.implement({
	addListener: function(listener){
	    if (this.requestReadyListener.indexOf(listener) < 0)
	        this.requestReadyListener.add(listener);
	},
	delListener: function(listener){
		this.requestReadyListener.delObject(listener);
	},
	getUrl: function(methodName){
	    if ((this.connection != undefined) && (this.remoteClassName != undefined) && (this.remoteClassName != "")){
	        result = this.connection.getUrl(this.remoteClassName, methodName, this.params, this);
	        return result;
	    }
	    else
	        return undefined;
	},	
	call: function(methodName){		
		try{		
			if ((this.connection != undefined) && (this.remoteClassName != undefined) && (this.remoteClassName != "")){				
				result = this.connection.call(this.remoteClassName, methodName, this.params, this);    
				return result;
			}
			else
				return undefined;
		}catch(e){
			alert(e);
		}
	},
	getObjToParam: function(methodName){
		return {remoteObj:this.remoteClassName, methodName:methodName, param:this.params, obj:this};
	},
	callAsynch: function(methodName,callback){				 
	    if ((this.connection != undefined) && (this.remoteClassName != undefined) && (this.remoteClassName != "")){	           
	        this.connection.callAsynch(this.remoteClassName, methodName, this.params, this, this.requester,callback);
		}
	},
	doRequestReady: function(sender, retCode, methodName, value, requester,callback){
	    var obj;	    
	    for (var i in this.requestReadyListener.objList){
	        obj = this.requestReadyListener.objList[i];
	        try{
	           if ((callback) && (eval("obj."+callback)) )
	               eval("obj."+callback+"(this, methodName, value, requester);");
	           else obj.doRequestReady(this, methodName, value, requester);
	        }
	        catch (e){
	        }
	    }
	},
	getRemoteClassName: function(){
		return this.remoteClassName;
	},
	getProperty: function(){
		return this.property;
	},
	setProperty: function(name, value){
		this.property[name] = value;
	}
});
