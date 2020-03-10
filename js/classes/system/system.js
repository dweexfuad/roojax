//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.system_system = function(options){	
	try
	{	
		this.finishInit = false;		
		var pg = $("#system");					
		this.width = $(window).width();
		this.height = $(window).height();		
		this.screenWidth = $(window).width();
		this.screenHeight = $(window).height();
		this.systemCanvas = pg;			
		window.system_system.prototype.parent.constructor.call(this,"system");
		this.className = "system_system";									
		this.resourceList = new arrayMap();		
		this.formList = new arrayMap();		
		this.mouseListenerList = new arrayMap();
		this.configList = new arrayMap();
		this.userConfigList = new arrayMap();		
		this.applicationList = new arrayMap();								
		this.buttonState = new buttonState();		
		this.themes = "simple";
		this.color = "#90AFBF";		
		this.isMouseDown = false;		
		this.nextZIndex = 100;
		this.nextResourceId = 1000;
		this.mouseX = 0;
		this.mouseY = 0;					
		this.activeApplication=undefined;		
		this.count = 0;			
		$(document).bind("contextmenu",this.eventContextMenu);
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
		this.debuggingMode = false;
	}catch(e)
	{
		alert("[system]::constructor:"+e);
	}
};
window.system_system.extend(window.containerControl);
window.system_system.implement({
	init: function(app,param){
		try	
		{						
			$(document).bind("keydown",setEvent("return system.eventKeyDown(event);") );
			$(document).bind("keyup",setEvent("system.eventKeyUp(event); return false;") );
			$(document).bind("keypress", setEvent("return system.eventKeyPress(event);")); 						
			$(document).bind("mousedown",setEvent("system.eventMouseDown(event);") ); 
			$(document).bind("mousemove",setEvent("system.eventMouseMove(event);") ); 
			$(document).bind("mouseup",setEvent("system.eventMouseUp(event);") );
			$(window).bind("resize",setEvent("system.eventScreenResize(event); return false;")); 	
			var script = "this.connection = new util_Connection('server/serverApp.php',true);";
			script += "var app = new "+app+"(this,param);";
			eval(script);
			app.run();			
		}catch(e)
		{
			error_log("[system]::init: "+ e);
		}	
	},
	getColor: function(){
		return this.color;
	},
	setColor: function(data){
		this.color = data;
		this.systemCanvas.css({"background" : data });
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
			
		var target = event.srcElement || event.target;
		if (target.tagName == "INPUT" || target.tagName == "TEXTAREA") return true;
		return false;
		if (window.mnuForm == undefined){
			createMenu();			
		}
		mnuForm.style.display = "";
		mnuForm.style.left = event.clientX;
		mnuForm.style.top = event.clientY;	
		return false;
	},
	doExit: function(sender){
	    if (this.activeApplication instanceof application)
	        this.activeApplication.doExit(sender);	
	},
	eventKeyDown: function(event){
		try
		{	

			var target = event.srcElement || event.target;				
			var keyCode = event.keyCode;
			
			this.keyReturn = false;			
			if ((keyCode == 33 || keyCode == 34))				
				return false;			
			if ((keyCode == 33 || keyCode == 34 || keyCode == 8) && target.id.toLowerCase().search("swf") == -1 && (target.id.toLowerCase().search("edit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1)))
				return false;									
			if (this.activeApplication instanceof application){
			    this.buttonState.set(event);
			    var charCode = this.charCode[event.keyCode];						 
			    var ret = this.activeApplication.doKeyDown(charCode, this.buttonState, keyCode,event);
				this.keyReturn = ret;				
				return ret;				
			}else {
              if ((keyCode == 32 || keyCode == 8) && target.id.toLowerCase().search("swf") == -1 && (target.id.toLowerCase().search("edit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1))) {
			  	this.keyReturn = false;
			  	return false;
			  } 
			  this.keyReturn = true;						                            
              return true;
            }
		}catch(e)
		{		
			systemAPI.alert("[page] :: eventKeyDown : " + e +"\r\n"+this.activeApplication,event);		
			return true;
		}						
	},
	eventKeyUp: function(event){		
		try{			
			this.buttonState.set(event);		
		    if (this.activeApplication instanceof application)
		            this.activeApplication.doKeyUp(event.keyCode, this.buttonState);	    
		}catch(e){
			systemAPI.alert("system keyUp ",e);
		}
	},	
	eventKeyPress: function(event){
		try
		{				
			return this.keyReturn;			
			/*this.buttonState.set(event);
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
				if (this.activeApplication instanceof application)
					this.activeApplication.doKeyPress(charCode, this.buttonState, keyCode);
			}
			*/
		}catch(e)
		{
			error_log("[system] :: eventKeyPress : " + e +"\r\n"+this.activeApplication);
		}
	},
	eventMouseDown: function(event){		
		try{		    			
			var obj = undefined;   		
		    this.mouseX = event.clientX;
		    this.mouseY = event.clientY;    
		    var button = this.getButton(event); 			
			if (window.mnuForm && button != 2 && event.target.id != "mnuSelect") window.mnuForm.style.display = "none";
			var target = document.all || window.opera ? event.srcElement : event.target;		
		    var tmpArray = [];    
		    for (var i in this.mouseListenerList.objList)    
		        tmpArray[i] = i;        
		    for (var i in tmpArray)
		    {
		        obj = this.getResource(i);        
		        if (obj instanceof control)
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
		        if (obj instanceof control)
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
		        if (obj instanceof control)
		            obj.doSysMouseUp(this.mouseX, this.mouseY, button, this.buttonState,target);
		    }
		}catch(e){
			systemAPI.alert(e);
		}
	},
	eventScreenResize: function(event){		
	    var node = $(window);
	    if (node != undefined)
	    {
	        this.width = node.width();
	        this.height = node.height();
			this.screenHeight = node.height();
			this.screenWidth = node.width();
			var app = this.activeApplication;		
			if (app instanceof application){			
				if (app.activeForm.isMaximized)				
					app.doScreenResize(this.width, this.height);
			}		
	    }	
	},
	reSize: function(width, height){	
	    var node = $(window);
	    if (node != undefined)
	    {
	        this.width = width;
	        this.height = height;       
			node.css({width:width , height:height});			
			var app = this.activeApplication;		
			if (app instanceof application)
				app.doScreenResize(this.width, this.height);
	    }	
	},
	showHint: function(x, y, caption,control){	
		y += 10;
	    if (true) showHint(caption,x, y);
	},
	hideHint: function(){
		//this.hintForm.hide();	
		hideHint();	
	},
	showToolTip: function(x, y, caption){
		if (this.activeApplication.toolTip === undefined ){
			uses("toolTip");
			this.activeApplication.toolTip = new toolTip(this.activeApplication);			
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
	updateCfg: function(data,status){				
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
	},
	loadCfg: function(){
		try{	       						
			this.configList.objList = [];			
			var xhr = $.ajaxSettings.xhr();
			xhr.open("GET", "image/themes/"+this.getThemes()+"/themes.conf", false);
			xhr.send("");
			if (xhr.status == 200)
			{            
				var data = xhr.responseText;						
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
			alert("[page]:loadCfg:"+e,"");
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
	    if (resource instanceof control)	   
	        this.mouseListenerList.set(resource.getResourceId(),resource.getResourceId());	    
	},
	delMouseListener: function(resource){
	    if (resource instanceof control)    
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
	            if ((oldApplication != undefined)&&(oldApplication instanceof application))
					oldApplication.doDeactivate();								
	        } 
	    }		
	    if ((this.activeApplication instanceof application))
	        this.activeApplication.doActivate(oldApplication);		
	},
	closeAllMDIChild: function(){
		var appChild = this.activeApplication.activeForm.childs;
		var res = undefined;
		for (var i in appChild.objList){
			res = system.getResource(appChild.objList[i]);		
			if (res instanceof childForm)		
	  			res.free();		
		}	
	},	
	alert: function(sender, message, addInfo, event){				
		if (system.activeApplication != undefined) 
			system.activeApplication.alert(message,addInfo,sender, event);
		else alert(message +"\n"+addInfo);
	},
	confirm: function(sender,event, message, addInfo){
	    if (system.activeApplication != undefined)      
     		system.activeApplication.confirm(sender,event, message, addInfo);
	},
	info: function(sender, message, addInfo, event){	      
        if (system.activeApplication != undefined) 
		   system.activeApplication.info(message,addInfo,sender, event);
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
		try{
			var app;			
			for (var i in this.applicationList.objList){
				app = this.getResource(this.applicationList.objList[i]);			
				if (app.logout){					
					app.logout();
				}
				app.terminate();
				
			}
		}catch(e){
			error_log(e);
		}
	},
	restart:function(app){
		this.logout();	
		if (app !== undefined)
			this.init(app);
		else this.init(this.activeApplication.className);
	},
	showPasteEditor: function(sender){
		if (sender == undefined){
			if (system.activeApplication.activeForm.activeChildForm === undefined && system.activeApplication.activeForm.activeControl) 
				var ctrl = system.activeApplication.activeForm.activeControl;
			else if (system.activeApplication.activeForm instanceof commonForm && system.activeApplication.activeForm.activeChildForm.activeControl)
				var ctrl = system.activeApplication.activeForm.activeChildForm.activeControl;
		}else var ctrl = sender;
		if (system.activeApplication != undefined )      
     		system.activeApplication.showPasteEditor(ctrl);
	},
	eventPaste: function(e){
		try{
			var target = e.srcElement || e.target;			
			if (target.nodeName == "INPUT" || target.nodeName == "TEXTAREA") return true;
			
			if ((systemAPI.browser.firefox || systemAPI.browser.name == "Mozilla")){
				/*var target = $("editable");								
				target.focus();
				var t = target.createTextRange();
				t.execCommand('paste');
				alert(target.value);				*/
				try {
					if (netscape.security.PrivilegeManager.enablePrivilege) {
						netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
					} else {						
						this.showPasteEditor();
					}
				} catch (ex) {
					this.showPasteEditor();					
					return;
				}
			 
				var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
				if (!clip) return false;
			 
				var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
				if (!trans) return false;
				trans.addDataFlavor("text/unicode");
			 
				clip.getData(trans, clip.kGlobalClipboard);
			 
				var str       = new Object();
				var strLength = new Object();
				var pastetext = "";
			 
				trans.getTransferData("text/unicode", str, strLength);
				if (str) str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
				if (str) pastetext = str.data.substring(0, strLength.value / 2);				
				this.activeApplication.doSystemPaste(pastetext);				
			}else{
				e.preventDefault();
				this.activeApplication.doSystemPaste(e.clipboardData.getData("text/plain"));
			}
		}catch(e){
			alert(e);
		}
	},
	textWidth: function(pText, pFontSize, pStyle) {
		var lDiv = document.createElement('lDiv');
		document.body.appendChild(lDiv);
		if (pStyle != null) {
			lDiv.style = pStyle;
		}
		lDiv.style.fontSize = "" + pFontSize + "px";
		lDiv.style.position = "absolute";
		lDiv.style.whiteSpace = "nowrap";
		lDiv.style.height = "20px";
		lDiv.style.left = -1000;
		lDiv.style.top = -1000;
		
		lDiv.innerHTML = pText;

		var lResult = {
			width: lDiv.clientWidth,
			height: lDiv.clientHeight
		};
		var width = lDiv.clientWidth;

		document.body.removeChild(lDiv);
		lDiv = null;

		return width;
	}
});

function $$$(res) {
  return window.system.getResource(res);
};

window.onbeforeunload = function(){return "You work will be lost.";};