//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_commonForm = function(owner){
    if (owner)
    {
        window.control_commonForm.prototype.parent.constructor.call(this, owner);
        this.className = "control_commonForm";        
        this.visible = false;
        this.active = false;
        this.activeControl = undefined;
        
		this.onModal = false;
		this.onClose = new control_eventHandler();
		this.opacity = 0;
		this.isMaximized = false;
		this.alwaysOnTop = false;
		this.closeToHide = true;
		this.onKeyDown = new control_eventHandler();
		this.onActivate = new control_eventHandler();
    }
};
window.control_commonForm.extend(window.control_containerControl);
window.commonForm = window.control_commonForm;
//---------------------------- Function ----------------------------------------
window.control_commonForm.implement({
	doDraw: function(canvas){		
		canvas.hide();
		canvas.html( "<div id='" + this.getFullId() + "_form' style='position: absolute; left: 0; top: 0; width: 100%; height: 100%' ></div>"+
					 "<div id='" + this.getFullId() + "_block' style='background:#ffffff; filter:alpha(opacity:20);opacity:0.2;moz-opacity:0.2; zindex:9;display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%' ></div>" );
	},
	centerize: function(){
	    var screenWidth = system.screenWidth;
	    var screenHeight = system.screenHeight;

	    this.setLeft(parseInt((screenWidth - this.width) / 2, 10));
	    this.setTop(parseInt((screenHeight - this.height) / 3, 10));
	},
	show: function(){
		try
		{
			if (this.onModal) return;
			var app = this.getApplication();
			var form = app.getActiveForm();	
			if (form != this){			
				if (form instanceof control_commonForm)
					this.modalOrigin = form.getResourceId();
				else this.modalOrigin = undefined;												
			}			
			this.onModal = false;   
			this.setVisible(true);
			this.bringToFront();
			this.activate();			
			if (this.activeControl == undefined)
			{
				var firstControl = undefined;
				var tabIndex = 100000;
				var tabControl = undefined;			
				var ctrl = undefined;			
				for (var i in this.childs.objList)
				{
					ctrl = $$$(this.childs.objList[i]);		
					if ((ctrl instanceof control_control) && (ctrl.isTabStop()))
					{
						if (firstControl == undefined)
							firstControl = ctrl;						
						if (ctrl.getTabIndex() < tabIndex)
						{
							tabControl = ctrl;
							tabIndex = ctrl.getTabIndex();
						}
					}
				}				
				if (tabControl != undefined)
					tabControl.setFocus();
				else if (firstControl != undefined)
					firstControl.setFocus();
			}
		}catch(e)
		{
			systemAPI.alert(this+"$show()", e);
		}
	},
	showModal: function(){
		try
		{		
			var app = this.getApplication(); 			
			var form = app.getActiveForm();					
			if (form instanceof control_commonForm)
				this.modalOriginator = form.getResourceId();
			else this.modalOriginator = undefined;						
			if (form.activeChildForm != undefined)
				if (form.activeChildForm.activeControl != undefined){									
					form.activeChildForm.doDefocusCtrl(form.activeChildForm.activeControl);
				}		
			
			this.modalResult = 0;				
			app.block(this);		
			this.onModal = true;		
			this.setVisible(true);				
			this.activate();		
			this.bringToFront();		
		}catch(e)
		{
			systemAPI.alert(this+"$showModal", e);
		}
	},
	close: function(){
		try
		{			
			this.hide();	
			this.onClose.call(this);			
			if (this.onModal)
			{			
				this.getApplication().unblock();						           
				var form = $$$(this.modalOriginator);								
				if (form instanceof control_commonForm)
				{				
					form.doModalResult(this, this.modalResult);            
					form.show();
				}
			}else{	
				var form = $$$(this.modalOrigin);								
				if (form instanceof control_commonForm)
				{				
					form.doModalResult(this, this.modalResult);            
					form.show();
				}
				this.modalOrigin = undefined;
			}
			this.onModal = false;			
			if (!this.closeToHide && (this.getApplication().getMainForm() != this)) this.free();
			if (this.getApplication().getMainForm() == this)
				this.getApplication().terminate();
		}catch(e)
		{
			systemAPI.alert(this+"$close", e);
		}	
	},
	hide: function(){
		this.setVisible(false);
	},
	block: function(message){
	    var node = $("#"+this.getFullId() + "_block");
	    if (node != undefined){
	        if (message === undefined) message = "";
	        node.show();
	        node.html( "<span style='position:absolute;left:0;top:0;width:auto;height:auto;color:#ffff00;font-style:italic'>"+message+"</span>");
	        var textNode = $("#"+this.getFullId() + "_block span:first");
	        textNode.css({left : this.width / 2 - parseInt(textNode.width()) / 2, 
						  top : this.height / 2 - parseInt(textNode.height()) / 2 });
        }
		this.blocked = true;
	},
	unblock: function(){
		var node = $("#"+this.getFullId() + "_block");	
	    if (node != undefined){
	        node.hide();
	        node.contents().each(function(){
				$(this).remove();
			});
        }
		this.blocked = false;
	},
	isBlocked: function(){
		return this.blocked;
	},
	minimize: function(){
		try{
			this.hide();
			this.isMaximized = false;		
			if (this.app._mainForm == this)
			{				
				var child;
				for (var i in this.app.childs.objList){													
					child = system.getResource(i);					
					if (this != child && child instanceof control_commonForm)
						child.hide();					
				}
			}
		}catch(e){
			systemAPI.alert(this+"$minimize",e);
		}
	},
	maximize: function(){
		this.isMaximized = true;
	    this.realWidth = this.width;
	    this.realHeight = this.height;
	    this.realLeft = this.left;
	    this.realTop = this.top;	   		
	    this.setLeft(0);
	    this.setTop(0);
	    
	    this.setWidth(system.screenWidth);
	    this.setHeight(system.screenHeight);	    
	    this.getCanvas().css({width : "100%", height : "100%" }); 
	    this.doAfterResize(this.width, this.height);
		if (this.app._mainForm == this){
			var child;
			for (var i in this.app.childs.objList){													
				child = system.getResource(i);					
				if (this != child && child instanceof control_commonForm)
				child.restore();					
			}
		}	
	},
	restore: function(){
	    if (this.isMaximized)
	    {
	        this.isMaximized = false;
	        this.setLeft(this.realLeft);
			this.setTop(this.realTop);
	        this.setWidth(this.realWidth);
	        this.setHeight(this.realHeight);
	        
	        this.doAfterResize(this.width, this.height);
	    }
	    else
	        this.setVisible(true);
		if (this.app._mainForm == this){
			var child;
			for (var i in this.app.childs.objList){													
				child = system.getResource(i);					
				if (this != child && child instanceof control_commonForm)
				child.restore();					
			}
		}
	},
	activate: function(oldApplication){
		try
		{
			var app = this.getApplication();
			//if (!this.active)
			{			
				this.active = true;
				app.setActiveForm(this);
				this.unblock();
			}
			app.activate();
			this.onActivate.call(this);
		}catch(e)
		{
			systemAPI.alert(this+"$activate", e);
		}
	},
	alert: function(msg, info){
	    var app = this.getApplication();	    
	    if (app != undefined)
	        app.alert(msg, info);
	},
	info: function(msg, info){
		var app = this.getApplication();    
	    if (app != undefined)
	        app.info(msg, info);
	},
	confirm: function(sender, event, msg, info){
	    var app = this.getApplication();   
	    if (app != undefined)
	        app.confirm(sender, event, msg, info);
	},
	doKeyDown: function(charCode, buttonState, keyCode,event){					
		if  (this.activeChildForm !== undefined){
			if (this.activeChildForm.activeControl !== undefined){																		
				return this.activeChildForm.activeControl.doKeyDown(charCode, buttonState, keyCode, event);
			} 			
            return this.activeChildForm.doKeyDown(charCode, buttonState, keyCode);
		}else if (this.activeControl instanceof control_control)
			return this.activeControl.doKeyDown(charCode, buttonState, keyCode);		
		if (this.onKeyDown.method !== undefined)
			return this.onKeyDown.call(this, charCode, buttonState, keyCode);
		else return false;
	},
	doKeyPress: function(charCode, buttonState, keyCode){		
	    if  (this.activeChildForm !== undefined){
			if (this.activeChildForm.activeControl !== undefined){														
				return this.activeChildForm.activeControl.doKeyPress(charCode, buttonState, keyCode, event);
			} 	
            return this.activeChildForm.doKeyPress(charCode, buttonState, keyCode);
		}else if (this.activeControl instanceof control_control)
			return this.activeControl.doKeyPress(charCode, buttonState, keyCode);		
	},
	doKeyUp: function(keyCode, buttonState){		
	    if  (this.activeChildForm !== undefined){
			if (this.activeChildForm.activeControl !== undefined){														
				return this.activeChildForm.activeControl.doKeyUp(keyCode, buttonState);
			} 	
            return this.activeChildForm.doKeyUp(keyCode, buttonState);
		}else if (this.activeControl instanceof control_control)
			return this.activeControl.doKeyUp(keyCode, buttonState);		
	},
	doModalResult: function(sender, modalResult){
	},
	doActivate: function(){
		try
		{
		    this.bringToFront();
		    this.active = true;		
		    if ((this.activeControl != undefined) && (this.activeControl instanceof control_control))
		        this.activeControl.doSetFocus();   
		    this.setVisible(true);
		}
		catch (e)
		{
		    systemAPI.alert(this+"$doActivate",e);
		}
	},
	doDeactivate: function(){
		try{
		    this.active = false;		    
		    if (this.activeControl instanceof control_control){
				if (this.activeControl.blur) this.activeControl.blur();//14 december 2008
				this.activeControl.doLostFocus();		
			}		
			//this.setVisible(false);
		}catch(e){
			systemAPI.alert(this+"$commonForm",e+"\n"+this.activeControl);
		}
	},
	doAfterResize: function(width, height){	
	},
	getActiveControl: function(){
		return this.activeControl;	
	},
	setActiveControl: function(control){	
		try
		{
			if (control != this.activeControl)
			{
				//this.activate();		
                var step = this.activeControl+".lostControl";				
				if (this.activeControl instanceof window.control_control)
					this.activeControl.doLostFocus();				
				else if (this.activeChildForm !== undefined){
					if (this.activeChildForm.activeControl instanceof window.control_control)
						this.activeChildForm.activeControl.doLostFocus();				
				}
				this.activeControl = control;		
				step = this.activeControl+".setFocus";				
				if (this.activeControl instanceof window.control_control)
					this.activeControl.doSetFocus();
			}
		}catch(e)
		{
			systemAPI.alert(this+"$setActiveControl"+step, e);
		}
	},
	resize: function(width, height){
		//iE and FireFox
	    this.setBound(0,0,width,height);
		this.doAfterResize(this.width,this.height);
	},
	setAlwaysOnTop: function(data){
		this.alwaysOnTop = data;
	},
	isAlwaysOnTop: function(){
		return this.alwaysOnTop;
	}
});
