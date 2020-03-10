//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_eventHandler = function(target, method){
	try
	{		
        window.control_eventHandler.prototype.parent.constructor.call(this);
        this.className = "control_eventHandler";       
        this.target = target;
        this.method = method;
    }catch(e)
	{
		alert("[eventhandler]::contruct:"+e);
	}
};
window.control_eventHandler.extend(window.Function);
window.eventHandler = window.control_eventHandler;
window.control_eventHandler.prototype.toString = function()
{
    return this.method + "@" + this.target;
};
//---------------------------- Function ----------------------------------------
window.control_eventHandler.implement({
	call: function(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10){
	    var result = undefined;
	    if ((typeof(this.target) == "object") && (typeof(this.method) == "string") && (this.method.length > 0))
	    {
	        param = "";
	        max = 0;
	        if (p10 != undefined)
	            max = 10;
	        else if (p9 != undefined)
	            max = 9;
	        else if (p8 != undefined)
	            max = 8;
	        else if (p7 != undefined)
	        	max = 7;
	        else if (p6 != undefined)
	    	   max = 6;
	        else if (p5 != undefined)
	    	   max = 5;
	        else if (p4 != undefined)
	    	   max = 4;
	        else if (p3 != undefined)
	            max = 3;
	        else if (p2 != undefined)
	    	   max = 2;
	        else if (p1 != undefined)
	    	   max = 1;

	        for (i = 1; i <= max; i++)
	            param += ", p" + i;

	        if (max > 0)
	            param = param.substring(2, param.length);
	        target = this.target;
	        script = "result = target." + this.method + "(" + param + ");";
	        try
	        {
	            eval(script);
	        }
	        catch (e)
	        {
	            result = undefined;
	        }
	    }
	    
	    return result;
	},
	isFunction: function(o) {
		return typeof(o) == 'function' && (!Function.prototype.call || typeof(o.call) == 'function');
	},
	isValid: function(){
	    var result = false;
	    if ((typeof(this.target) == "object") && (typeof(this.method) == "string") && (this.method.length > 0))
	        result = true;    
	    return result;
	},
	set: function(target, method){
	    this.target = target;
	    this.method = method;
	},
	setHandler: function(method){
		this.method = method;
	},
	getTarget: function(){
		return this.target;
	},
	setTarget: function(data){
		this.target = data;
	},
	getMethod: function(){
		return this.method;
	},
	setMethod: function(data){
		this.method = data;
	}
});
