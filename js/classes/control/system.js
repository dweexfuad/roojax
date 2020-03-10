//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_system = function(options){	
	try
	{		
		this.finishInit = false;		
		var pg = $("system");					
		this.width = parseInt(pg.offsetWidth);
		this.height = parseInt(pg.offsetHeight);		
		this.screenWidth = parseInt(pg.offsetWidth);
		this.screenHeight = parseInt(pg.offsetHeight);				
		this.systemCanvas = pg;			
		window.control_system.prototype.parent.constructor.call(this,"system");
		this.className = "control_system";									
		this.resourceList = new control_arrayMap();		
		this.formList = new control_arrayMap();		
		this.mouseListenerList = new control_arrayMap();
		this.configList = new control_arrayMap();
		this.userConfigList = new control_arrayMap();		
		this.applicationList = new control_arrayMap();								
		this.buttonState = new control_buttonState();
		this.themes = "dynpro";
		this.color = "#90AFBF";		
		this.isMouseDown = false;		
		this.nextZIndex = 100;
		this.nextResourceId = 1000;
		this.mouseX = 0;
		this.mouseY = 0;					
		this.activeApplication=undefined;		
		this.count = 0;	
		if (document.all){
			document.onkeydown = new Function("return system.eventKeyDown(event);");
			document.onkeyup = new Function("system.eventKeyUp(event); return false;"); 				
			if (options === undefined){
				document.onmousedown = new Function("system.eventMouseDown(event);"); 
				document.onmousemove = new Function("system.eventMouseMove(event);"); 
				document.onmouseup = new Function("system.eventMouseUp(event);"); 						
				window.onresize = new Function("system.eventScreenResize(event); return false;"); 	
			}
		}else{			
			document.onkeydown = new Function("event","return system.eventKeyDown(event);");
			document.onkeyup = new Function("event","system.eventKeyUp(event); return false;"); 				
			if (options === undefined){
				document.onmousedown = new Function("event","system.eventMouseDown(event);"); 
				document.onmousemove = new Function("event","system.eventMouseMove(event);"); 
				document.onmouseup = new Function("event","system.eventMouseUp(event);"); 					
				window.onresize = new Function("event", "system.eventScreenResize(event); return false;"); 	
			}
		}		
		document.oncontextmenu = this.eventContextMenu;				
		this.loadCfg();		
		this.charCode = [];
		this.charCode[32] = " ";
		this.charCode[33] = "!";
		this.charCode[34] = "\"";
		this.charCode[35] = "#";
		this.charCode[36] = "$";
		this.charCode[37] = "%";
		this.charCode[38] = "&";
		this.charCode[39] = "'";
		this.charCode[40] = "(";
		this.charCode[41] = ")";
		this.charCode[42] = "*";
		this.charCode[43] = "+";
		this.charCode[44] = ",";
		this.charCode[45] = "-";
		this.charCode[46] = ".";
		this.charCode[47] = "/";
		this.charCode[48] = "0";
		this.charCode[49] = "1";
		this.charCode[50] = "2";
		this.charCode[51] = "3";
		this.charCode[52] = "4";
		this.charCode[53] = "5";
		this.charCode[54] = "6";
		this.charCode[55] = "7";
		this.charCode[56] = "8";
		this.charCode[57] = "9";
		this.charCode[58] = ":";
		this.charCode[59] = ";";
		this.charCode[60] = "<";
		this.charCode[61] = "=";
		this.charCode[62] = ">";
		this.charCode[63] = "?";
		this.charCode[64] = "@";
		this.charCode[65] = "A";
		this.charCode[66] = "B";
		this.charCode[67] = "C";
		this.charCode[68] = "D";
		this.charCode[69] = "E";
		this.charCode[70] = "F";
		this.charCode[71] = "G";
		this.charCode[72] = "H";
		this.charCode[73] = "I";
		this.charCode[74] = "J";
		this.charCode[75] = "K";
		this.charCode[76] = "L";
		this.charCode[77] = "M";
		this.charCode[78] = "N";
		this.charCode[79] = "O";
		this.charCode[80] = "P";
		this.charCode[81] = "Q";
		this.charCode[82] = "R";
		this.charCode[83] = "S";
		this.charCode[84] = "T";
		this.charCode[85] = "U";
		this.charCode[86] = "V";
		this.charCode[87] = "W";
		this.charCode[88] = "X";
		this.charCode[89] = "Y";
		this.charCode[90] = "Z";
		this.charCode[91] = "[";
		this.charCode[92] = "\\";
		this.charCode[93] = "]";
		this.charCode[94] = "^";
		this.charCode[95] = "_";
		this.charCode[96] = "`";
		this.charCode[97] = "a";
		this.charCode[98] = "b";
		this.charCode[99] = "c";
		this.charCode[100] = "d";
		this.charCode[101] = "e";
		this.charCode[102] = "f";
		this.charCode[103] = "g";
		this.charCode[104] = "h";
		this.charCode[105] = "i";
		this.charCode[106] = "j";
		this.charCode[107] = "k";
		this.charCode[108] = "l";
		this.charCode[109] = "m";
		this.charCode[110] = "n";
		this.charCode[111] = "o";
		this.charCode[112] = "p";
		this.charCode[113] = "q";
		this.charCode[114] = "r";
		this.charCode[115] = "s";
		this.charCode[116] = "t";
		this.charCode[117] = "u";
		this.charCode[118] = "v";
		this.charCode[119] = "w";
		this.charCode[120] = "x";
		this.charCode[121] = "y";
		this.charCode[122] = "z";
		this.charCode[123] = "{";
		this.charCode[124] = "|";
		this.charCode[125] = "}";
		this.charCode[126] = "~";
		
		this.KEY_ENTER = 13;
		this.KEY_ESC = 27;
		this.KEY_BACK = 8;
		this.KEY_TAB = 9;
		this.finishInit = true;
	}catch(e)
	{
		systemAPI.alert("[system]::constructor:",e);
	}
};
window.control_system.extend(window.control_containerControl);
window.control_system.implement({
	init: function(app,param){
		try	
		{						   			
			var script = "uses('"+app+";control_form;"+app.substr(0,app.length - 3)+"fMain');";					
			script += "this.connection = new util_Connection('server/serverApp.php',true);";
			script += "var app = new "+app+"(this,param);";
			eval(script);
			app.run();			
			if (app.className == "desktop_app"){
				window.desktop = app;
			}
		}catch(e)
		{
			systemAPI.alert("[system]::init: "+ e,"");
		}	
	},
	getColor: function(){
		return this.color;
	},
	setColor: function(data){
		this.color = data;
		this.systemCanvas.style.background = data;
	},
	addResource: function(object){
	    var result = this.getResourceId();
	    this.resourceList.set(result,object);
	    return result;
	},
	delResource: function(resourceId){
	    var app = this.applicationList.get(resourceId);
	    if (app != undefined)
	        this.applicationList.del(resourceId);       
	    this.resourceList.del(resourceId);
	},
	getResource: function(resourceId){
		var result = this.resourceList.get(resourceId);
		//if (result == undefined) alert(resourceId);
		return result;
	},
	getResourceId: function(){
	    var result = this.nextResourceId;
	    this.nextResourceId++;    
	    return result;
	},
	getNextZIndex: function(){
	    var result = this.nextZIndex;
	    this.nextZIndex++;    
	    return result;
	},
	getScreenWidth: function(){
		return this.screenWidth;
	},
	getMouseX: function(){
		return this.mouseX;
	},
	setMouseX: function(data){
		this.mouseX = data;
	},
	getMouseY: function(){
		return this.mouseY;	
	},
	setMouseY: function(data){
		this.mouseY = data;
	},
	getScreenHeight: function(){
		return this.screenHeight;
	},
	eventContextMenu: function(event){
		return false;
	},
	doExit: function(sender){
	    if (this.activeApplication instanceof control_application)
	        this.activeApplication.doExit(sender);	
	},
	eventKeyDown: function(event){
		try
		{						
			var target = document.all? event.srcElement:event.target;
			var keyCode = event.keyCode;
			if ((keyCode == 33 || keyCode == 34))
				return false;
			if ((keyCode == 32 || keyCode == 33 || keyCode == 34) && target.id.toLowerCase().search("swf") == -1 && (target.id.toLowerCase().search("edit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1)))
					return false;			
			this.buttonState.set(event);
			var charCode = undefined;
			charCode = this.charCode[event.keyCode];			
			if (this.activeApplication instanceof control_application)
				return this.activeApplication.doKeyDown(charCode, this.buttonState, keyCode,event);
			else return true;
		}catch(e)
		{		
			systemAPI.alert("[page] :: eventKeyDown : " + e +"\r\n"+this.activeApplication,event);		
			return true;
		}						
	},
	eventKeyUp: function(event){		
		try{
			this.buttonState.set(event);
		    if (this.activeApplication instanceof control_application)
		            this.activeApplication.doKeyUp(event.keyCode, this.buttonState);	    
		}catch(e){
			systemAPI.alert("system keyUp ",e);
		}
	},	
	eventKeyPress: function(event){
		try
		{			
			this.buttonState.set(event);
			var charCode = undefined;
			if (document.all)
				charCode = this.charCode[event.keyCode];
			else
				charCode = this.charCode[event.charCode];
			if (document.all)
				var keyCode = event.keyCode;
			else
				var keyCode = event.which;				
			{						
				if (this.activeApplication instanceof control_application)
					this.activeApplication.doKeyPress(charCode, this.buttonState, keyCode);
			}
		}catch(e)
		{
			systemAPI.alert("[page] :: eventKeyPress : " + e +"\r\n"+this.activeApplication,"");
		}
	},
	eventMouseDown: function(event){		
		try{
		    var obj = undefined;   		
		    this.mouseX = event.clientX;
		    this.mouseY = event.clientY;    
		    var button = this.getButton(event);    
			var target = document.all || window.opera ? event.srcElement : event.target;		
		    var tmpArray = [];    
		    for (var i in this.mouseListenerList.objList)    
		        tmpArray[i] = i;        
		    for (var i in tmpArray)
		    {
		        obj = this.getResource(i);        
		        if (obj instanceof control_control)
		            obj.doSysMouseDown(this.mouseX, this.mouseY, button, target);
		    }		
			if (button ==  2){//right Click
				var obj = document.all?event.srcElement : event.target;		
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	eventMouseMove: function(event){
		try{			
		    var obj = undefined;			
		    this.mouseX = event.clientX;
		    this.mouseY = event.clientY;	    
		    var button = this.getButton(event);
		    this.buttonState.set(event);
			var target = document.all || window.opera ?event.srcElement : event.target;		
		    var tmpArray = [];
		    for (var i in this.mouseListenerList.objList)tmpArray[i] = i;	    
		    for (var i in tmpArray)
		    {
		        obj = this.getResource(i);
		        if (obj instanceof control_control)
		            obj.doSysMouseMove(this.mouseX, this.mouseY, button, this.buttonState, target);
		    }
		}catch(e){	
			systemAPI.alert(e);
		}
	},
	eventMouseUp: function(event){		
		try{
		    var obj = undefined;    
		    this.mouseX = event.clientX;
		    this.mouseY = event.clientY;
		    var button = this.getButton(event);
			var target = document.all || window.opera ?event.srcElement : event.target;		
		    this.buttonState.set(event);
		    var tmpArray = [];
		    for (var i in this.mouseListenerList.objList)
		        tmpArray[i] = i;    
		    for (var i in tmpArray)
		    {
		        obj = this.getResource(i);
		        if (obj instanceof control_control)
		            obj.doSysMouseUp(this.mouseX, this.mouseY, button, this.buttonState,target);
		    }
		}catch(e){
			systemAPI.alert(e);
		}
	},
	eventScreenResize: function(event){		
	    var node = $("system");
	    if (node != undefined)
	    {
	        this.width = node.offsetWidth;
	        this.height = node.offsetHeight;       
			this.screenHeight = node.offsetHeight;
			this.screenWidth = node.offsetWidth;			
			var app = this.activeApplication;		
			if (app instanceof control_application){			
				if (app.activeForm.isMaximized)				
					app.doScreenResize(this.width, this.height);
			}		
	    }	
	},
	reSize: function(width, height){	
	    var node = $("system");
	    if (node != undefined)
	    {
	        this.width = width;
	        this.height = height;       
			node.style.width  = width;
			node.style.height  = height;
			var app = this.activeApplication;		
			if (app instanceof control_application)
				app.doScreenResize(this.width, this.height);
	    }	
	},
	showHint: function(x, y, caption,enabled){	
	    if (enabled) showHint(caption,x, y);	
	},
	hideHint: function(){
		//this.hintForm.hide();	
		hideHint();	
	},
	showToolTip: function(x, y, caption){
		if (this.activeApplication.toolTip === undefined ){
			uses("control_toolTip");
			this.activeApplication.toolTip = new control_toolTip(this.activeApplication);			
			this.activeApplication.toolTip.show(x, y, caption, 1);
		}else this.activeApplication.toolTip.show(x, y, caption, 1);
	},
	hideToolTip: function(){
		if (this.activeApplication.toolTip !== undefined)
			this.activeApplication.toolTip.hide();
	},
	showProgress: function(text){
		showProgress(text);		
	},
	hideProgress: function(){
		hideProgress();			
	},
	getFullId: function(){
		return "system";
	},
	loadCfg: function(){
		try{	       
			this.configList.objList = [];		
			usesHttp.open("GET", "image/themes/"+this.getThemes()+"/themes.conf", false);
			usesHttp.send("");
			if (usesHttp.status == 200)
			{            
				var data = usesHttp.responseText;						
				    var row = "";						
				    var lines = data.split("\n");			
				    var configPair = "";
				    for (var i=0; i < lines.length;i++)
				    {
					row = lines[i];
					if ((row.charAt(0) != "#") && (row.indexOf("=") > 0))
					{
					    configPair = row.split("=");					
					    this.configList.objList[configPair[0]] =  configPair[1];
					}
				    }
			}		
		}catch(e){
			systemAPI.alert("[page]:loadCfg:"+e,"");
		}
	},
	getConfig: function(configName){		
		var result = this.configList.objList[configName];    
	    if (result == undefined)
	        result = "";       
		result = result.replace("\r\n","");
		result = result.replace("\n","");
		result = result.replace("\r","");
	    return result;
	},
	getUserConfig: function(configName){	
		var result = this.userConfigList.objList[configName];    
	    if (result == undefined)
	        result = "";        
	    return result;
	},
	addMouseListener: function(resource){	
	    if (resource instanceof control_control)	   
	        this.mouseListenerList.set(resource.getResourceId(),resource.getResourceId());	    
	},
	delMouseListener: function(resource){
	    if (resource instanceof control_control)    
	        this.mouseListenerList.del(resource.getResourceId());	 
	},
	getButton: function(event){
	    var result = undefined;
	    if (document.all) // IE	    
			result = (event.button == 1 || event.button == 2 ? event.button : 3);	        	    
	    else // Fire Fox	    
			result = (event.which == 1? event.button : (event.which == 2 ? 3: 2));	        	        	    
	    return result;
	},
	getActiveApplication: function(){
		return this.activeApplication;
	},
	setActiveApplication: function(app){
	    if ((app != this.activeApplication))
	    {
	        var oldApplication = this.activeApplication;
	        {            			
	            this.activeApplication = app;
	            if ((oldApplication != undefined)&&(oldApplication instanceof control_application))
					oldApplication.doDeactivate();								
	        } 
	    }		
	    if ((this.activeApplication instanceof control_application))
	        this.activeApplication.doActivate(oldApplication);		
	},
	closeAllMDIChild: function(){
		var appChild = this.activeApplication.activeForm.childs;
		var res = undefined;
		for (var i in appChild.objList){
			res = system.getResource(appChild.objList[i]);		
			if (res instanceof control_childForm)		
	  			res.free();		
		}	
	},
	alert: function(sender, message, addInfo){		
		if (system.activeApplication != undefined) 
			system.activeApplication.alert(message,addInfo);
		else alert(message +"\n"+addInfo);
	},
	confirm: function(sender,event, message, addInfo){
	    if (system.activeApplication != undefined)      
     		system.activeApplication.confirm(sender,event, message, addInfo);
	},
	info: function(sender, message, addInfo){	      
        if (system.activeApplication != undefined) 
		   system.activeApplication.info(message,addInfo);
        else alert(message+"r\n"+addInfo);
	},
	inputDlg: function(sender, caption,prompt, value){		
		if (system.activeApplication != undefined) 
			system.activeApplication.inputDlg(sender, caption, prompt,value);		
	},
	getThemes: function(){
		return this.themes;
	},
	logout: function(){	
		var app;
		for (var i in this.applicationList.objList){
			app = this.getResource(this.applicationList.objList[i]);			
			if (app.logout)
				app.logout();
			if (app.className !== "desktop_app"){
				app.terminate();
			}
		}	
		if (window.desktop !== undefined){
			window.desktop.terminate();
		}
	},
	restart:function(){
		this.logout();		
		this.init(this.activeApplication.className);
	}
});
