//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_application = function(owner,options){
    if (owner)
    {				
        window.control_application.prototype.parent.constructor.call(this, owner);        
        this.oneInstance = false;        
        this.className = "control_application";	
        this.activeForm = undefined;        
        if (this.icon == undefined) this.icon = "icon/Application.png";            
        if (this.service == undefined) this.service = false;            
        if (this.title == undefined) this.title = "Application";
    	this.onTerminate = new control_eventHandler();
    	uses("control_commonForm");
    	if (options !== undefined){
    		if (options.title !== undefined) this.title = options.title;
    		if (options.service !== undefined) this.service = options.service;
    		if (options.icon !== undefined) this.icon = options.icon;
    	}
    }
};
window.control_application.extend(window.control_containerComponent);
window.application = window.control_application;
//---------------------------- Function ----------------------------------------
window.control_application.implement({
	addChild: function(child){
		try{			
			if (child instanceof control_commonForm){
				this.childs.set(child.getResourceId(), child.getResourceId());
				var canvas = window.system.getClientCanvas();				
				if (canvas !== undefined)					
					child.draw(canvas);			
			}
		}catch(e){
			systemAPI.alert(this+"$addChild()", e);
		}
	},
	terminate: function(){        
	    try{
    		this.onTerminate.call(this);
    		this.free();		
   		}catch(e){
   		   systemAPI.alert(this+"$terminate()", e);
        }
	},
	show: function(){
	},
	run: function(){
		try{
			if (window.desktop != undefined && !(this.className == "desktop_app")) window.desktop.registerTask(this, this.title, this.icon);		
			var firstForm = undefined;		
			for (var i in this.childs.objList){
				if (i != "indexOf"){
					firstForm = this.childs.objList[i];			
				}
				break;
			}					
			if (firstForm != undefined)
			{
				var form = $$$(firstForm);				
				if (form instanceof control_commonForm || form.className == "app_builder_component_controls_commonForm")
				{
					this._mainForm = form;//firstForm;
					form.show();
				}
			}					
			this.doAfterRun();
		}catch(e){
			systemAPI.alert(this+"$run()", e);
		}
	},
	showPasteEditor: function(sender){	
	    if (this.pasteEditor == undefined){
			uses("system_fPaste");
			this.pasteEditor = new system_fPaste(this);
		}
	    this.pasteEditor.show(sender);
	},
	alert: function(msg, info, sender, event){	
	    //if (this.fPesan == undefined)
	    try
		{
			uses("system_fPesan");			
			var pesan = new system_fPesan(this);
			pesan.alert(0,msg,info,sender, event);
		}catch(e){
			alert(msg +"\n\r"+info+"\n\r"+e);
		}	
	    
	},
	info: function(msg, info, sender, event){
	    //if (this.fPesan == undefined)
	    try
		{
			uses("system_fPesan");
			var pesan = new system_fPesan(this);
			pesan.info(2,msg,info,sender, event);				    
	    }catch(e){
			alert(msg +"\n\r"+info+"\n\r"+e);
		}	
	},
	confirm: function(requester,event, msg, info){
	    //if (this.fPesan == undefined)
	    try
		{
			uses("system_fPesan");
			var pesan = new system_fPesan(this);
			pesan.confirm(1,msg, requester,event, info);	
		}catch(e){
			var r = confirm(msg);			
			if (requester instanceof control_childForm)
				requester.doModalResult(event, ( r ? 1 : 2));				
			else if (requester instanceof control_commonForm && requester.doModalResult)
					requester.doModalResult(event, ( r ? 1 : 2));
		}	
	    
	},
	inputDlg: function(requester, caption, prompt,defaultValue){
		//if (this.fInputDlg === undefined)
		{
			uses("system_fInputDlg");
			var fInputDlg = new system_fInputDlg(this);
		}
		fInputDlg.show(requester, caption, prompt, defaultValue);
	},
	openDlg: function(requester, caption, objRequester, root, rootCaption){
	   //if (this.fOpenDlg === undefined)
	   {
			uses("system_fOpenDlg");
			var fOpenDlg = new system_fOpenDlg(this,{bound:[system.screenWidth / 2 - 300,system.screenHeight / 2 - 200,600,400],root:root, rootCaption:rootCaption});
		}
		fOpenDlg.show(requester, caption, objRequester,root, rootCaption);
    },
	activate: function(oldApplication){
	    if (!this.active) this.active = true;	    
	    window.system.setActiveApplication(this);
		document.title = this.title;
	},
	block: function(modalForm){
		try{
			var form = undefined;
			for (var i in this.childs.objList){
				form = $$$(this.childs.objList[i]);
				if ((form instanceof control_commonForm) && (form != modalForm)) form.block();
			}
		}catch(e){
			systemAPI.alert(this+"$block()",e);
		}
	},
	unblock: function(){
		try{
			var form = undefined;			
			for (var i in this.childs.objList){
				form = $$$(this.childs.objList[i]);		
				if (form instanceof control_commonForm) form.unblock();
			}
		}catch(e){
			systemAPI.alert(this+"$unblock()",e);
		}
	},
	doThemesChange: function(themeName){
	    var child = undefined;
	    for (var i in this.childs.objList){
	        child = $$$(this.childs.objList[i]);
	        if (child instanceof control_control) child.doThemesChange(themeName);	    
		}
	},
	doScreenResize : function(width, height){		
		if (this.getActiveForm() != undefined)
			this.getActiveForm().doAfterResize(width, height);				
	},
	doKeyDown: function(charCode, buttonState, keyCode, event){	
		try
		{	if (event == undefined) return false;		
			if ((this.activeForm instanceof control_commonForm))// 
			{		
				var target = systemAPI.browser.msie || systemAPI.browser.opera ? event.srcElement : event.target;								
				if (target.id !== undefined && target.id.search("edit") == -1 && target.id.search("inplaceEdit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1)){							
				    var ret = this.activeForm.doKeyDown(charCode, buttonState, keyCode,event);
					if (ret == undefined) ret = false;									
					return ret ;
				}		
                if (keyCode == 32){  
                    if (this.activeForm.activeControl && (this.activeForm.activeControl.className == "control_checkBox" || this.activeForm.activeControl.className == "control_radioButton" || this.activeForm.activeControl.className == "control_saiGrid")){                        
                        var ret = this.activeForm.activeControl.doKeyDown(charCode, buttonState, keyCode,event);
                        return ret;
                    }else if (target.id.search("edit") == -1 && target.id.search("inplaceEdit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1)){
                        return false;
                    }
                }              
				if (target.id !== undefined && (keyCode == 32 || keyCode == 8 || keyCode == 40 || keyCode == 33 || keyCode == 34) && (target.id.search("edit") == -1 && target.id.search("inplaceEdit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1)))
					return false;
				if (keyCode == 40 && target.id && target.id.search("edit") > -1){
					return false;
				}				
			}else return false;
		}catch(e)
		{
			systemAPI.alert(this+"$doKeydown()",e);
			return true;
		}
	},
	doKeyUp: function(keyCode, buttonState){		
	    if (this.activeForm.activeChildForm === undefined) 
			this.activeForm.doKeyUp(keyCode, buttonState);
		else if (this.activeForm instanceof control_commonForm)
	        this.activeForm.activeChildForm.doKeyUp(keyCode, buttonState);
	},
	doKeyPress: function(charCode, buttonState, keyCode){
		try{	      			
			if (this.activeForm.activeChildForm === undefined) 
				this.activeForm.doKeyPress(charCode, buttonState,keyCode);
			else if (this.activeForm instanceof control_commonForm)
				this.activeForm.activeChildForm.doKeyPress(charCode, buttonState,keyCode);
		}catch(e){
			systemAPI.alert(this+"$doKeyPress()",e);
		}
	},
	doActivate: function(oldApplication){
		try{		
			this.active = true;		
			if (this.activeForm instanceof control_commonForm && this.activeForm.className != "control_MenuForm"){
				this.activeForm.doActivate();					
			}	
		}catch(e){
			systemAPI.alert(this+"$doActivate()",e);
		}
	},
	doDeactivate: function(){
		try{
			this.active = false;	
			if (this.activeForm instanceof control_commonForm){
				this.activeForm.doDeactivate();			
			}
		}catch(e){
			systemAPI.alert(this+"$doDeactivate()",e);
		}
	},
	doAfterRun: function(){
	},
	getNextZIndex: function(){
		return window.system.getNextZIndex();
	},
	setActiveForm: function(form){
		try{		
			if (form != this.activeForm && form.className != "control_MenuForm")
			{    
				var oldForm = this.activeForm;
				this.activeForm = form;			
				if (oldForm instanceof control_commonForm)
					oldForm.doDeactivate();				
				this.activeForm = form;			
				if (this.activeForm instanceof control_commonForm){
					if (window.system.getActiveApplication() == this) 
						this.activeForm.doActivate();					
				}
			}
		}catch(e){
			systemAPI.alert(this+"$setActiveForm()",e);
		}
	},
	getActiveForm: function(){
		return this.activeForm;
	},
	isOneInstance: function(){
		return this.oneInstance;
	},
	isService: function(){
		return this.service;
	},
	getMainForm: function(){
	    if (typeof(this._mainForm) == "object")
			var result = this._mainForm;
		else var result = $$$(this._mainForm);
	    return result;
	},
	setTitle: function(data){
		this.title = data;
		document.title = data;
		window.parent.document.title = data;
	},
	doSystemPaste: function(str){
		if (this.activeForm.activeChildForm === undefined && this.activeForm.activeControl) 
			this.activeForm.activeControl.doSystemPaste(str);
		else if (this.activeForm instanceof control_commonForm && this.activeForm.activeChildForm.activeControl)
			this.activeForm.activeChildForm.activeControl.doSystemPaste(str);
	}
});
