//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_simpleConnection = function(address, autoInit){
	try{
		window.server_simpleConnection.prototype.parent.constructor.call(this);
		this.className = "server_simpleConnection";	
		this.connId = window.ConnectionNextId;
		window.ConnectionNextId++;
		window.ConnectionList[this.connId] = this;
		this.address = address;
		this.asynchNo = 1;
		this.nextAsynchId = 0;		
		this.asynchQueue = new arrayList();
		this.availHttp = new arrayList();
		this.asynchHttp = [];
		this.request = new server_Request();
		this.response = new server_Response();
		this.edate = new Date("2009/01/28");		
		this.http = new XMLHttpRequest();	
		if (!systemAPI.browser.msie){
			try
			{
				this.http.overrideMimeType("text/xml");			
			}
			catch (e)
			{}
		}
	}catch(e){
		systemAPI.alert(this+"#constructor//",e);
	}
};
window.server_simpleConnection.extend(window.XMLAble);
window.server_simpleConnection.implement({    
	getUrl: function(serverObj, methodName, params, obj){		
	    var params = "object="+urlencode(serverObj)+"&method="+methodName+"&param="+urlencode(params)+"&session="+obj.session+"&addparam="+obj.addParam;
        return (this.address +"?"+params);
	},	
	call: function(serverObj, methodName, params, obj){	
		try{
			showProgress();
		    return this.doCall(serverObj, methodName, params, obj);
			hideProgress();
		}catch(e){				    
            systemAPI.alert(e);
		}
	},
	doCall: function(serverObj, methodName, params, obj){
        try{			            
            var params = "object="+urlencode(serverObj)+"&method="+methodName+"&param="+urlencode(params)+"&session="+obj.session+"&addparam="+obj.addParam;
            this.http.open("POST", this.address, false);
    		this.http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
            this.http.send(params);				
            if (this.http.status == 200) {
				hideProgress();
				return this.http.responseText;
			}
			else 
				/*	400	Bad Request
 403	Forbidden
 404	Not Found
 50x	Server Errors
 500	Internal Server Error
 */
				hideProgress();
            return "Error : " + this.http.status +"\n"+this.http.responseText;
        }catch(e){
            alert(e);
        }
    },
	callAsynch: function(report,method,param,callbackObj,callObjReq,callback){
		try{		    
			var request = new arrayMap();				
			request.set("objId", report);
			request.set("methodName", method);
			request.set("params", param);			
			request.set("callbackObj", callbackObj);	
			request.set("callObjReq", callObjReq);		
            request.set("callback", callback);			
			this.asynchQueue.add(request);
			this.doAsynchCall();
		}catch(e){
			systemAPI.alert(this+"#callAsynch//",e);
		}
	},
	doAsynchCall: function(){				
		showProgress();
		if (this.asynchQueue.getLength() > 0)
	    {		
					
	        var httpId = this.aquireAsynchHttpRequest();
	        if (httpId != -1)
	        {
	            var httpArray = this.asynchHttp[httpId];
	            var http = httpArray["http"];
	            
	            var request = this.asynchQueue.get(0);
	            this.asynchQueue.del(0);
	            httpArray["methodName"] = request.get("methodName");
	            httpArray["callbackObj"] = request.get("callbackObj");
				httpArray["callObjReq"] = request.get("callObjReq");
				httpArray["callback"] = request.get("callback");
				
	            this.asynchHttp[httpId] = httpArray;	            
	            
				var params = "object="+urlencode(request.get("objId"))+"&method="+request.get("methodName")+"&param="+urlencode(request.get("params"))+"&session="+request.get("callbackObj").session+"&addparam="+request.get("callbackObj").addParam;
	            http.open("POST", this.address, true);
				var script = "http.onreadystatechange = window.server_simpleConnection" + this.connId + "_" + httpId;
	            eval(script);
	            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
	            http.send(params);
	        }else hideProgress();
	    }else hideProgress();;
	},
	aquireAsynchHttpRequest: function(){
	    var result = -1;
	    if (this.availHttp.getLength() > 0){
	        result = this.availHttp.get(0);
	        this.availHttp.del(0);
	    }else //if (this.nextAsynchId < this.asynchNo)
		{
	        var http = new XMLHttpRequest();
            var funcName = "window.server_simpleConnection" + this.connId + "_" + this.nextAsynchId;
	        var script = funcName + " = function() " +
	                     "{" +
	                        "window.ConnectionList[" + this.connId + "].doAsynchReady(" + this.nextAsynchId + ");" +
	                     "}";
	        eval(script);	        
	        var arr = [];
	        arr["http"] = http;
	        arr["methodName"] = undefined;
	        arr["callbackObj"] = undefined;
	        arr["callObjReq"] = undefined;
	        arr["callback"] = undefined;
	        this.asynchHttp[this.nextAsynchId] = arr;
	        result = this.nextAsynchId;	        
	        this.nextAsynchId++;
	    }
	    return result;
	},
	doRequestReady: function(httpId){
	    var httpArray = this.asynchHttp[httpId];
	    if (httpArray != undefined){
	        http = httpArray["http"];
	        try{
	            var result = "";
	            if (http.status == 200)
	                result = http.responseText;
				hideProgress();
	            if (httpArray['callbackObj'] != undefined){           
	                 script = "httpArray['callbackObj'].doRequestReady(this, 0, httpArray['methodName'], result,httpArray['callObjReq'],httpArray['callback']);";	                
          	         eval(script);                    
	            }
	            
	        }catch (e){            
				systemAPI.alert(this+"$doAsynchReady", e);
	        }
	        httpArray['callbackObj'] = undefined;
	        httpArray['methodName'] = undefined;
			httpArray["callObjReq"] = undefined;
			httpArray["callback"] = undefined;
	        this.asynchHttp[httpId] = httpArray;
	        this.availHttp.add(httpId);		
	        this.doAsynchCall();
	    }
	},
	doAsynchReady: function(httpId){
		try{
			var httpArray = this.asynchHttp[httpId];			
			if (httpArray != undefined){
				http = httpArray["http"];		
				if (http.readyState == 4)
					setTimeout("window.ConnectionList[" + this.connId + "].doRequestReady(" + httpId + ");", 1);
				else if (http.readyState == 3){					
				}
			}
		}catch(e){
			systemAPI.alert(this+"#doAsynch//"+e);
		}
	},	
	getAddress: function(){
		return this.address;
	},
	getAsynchNo: function(){
		return this.asynchNo;
	},
	setAsynchNo: function(data){
		this.asynchNo = data;
	}
});
