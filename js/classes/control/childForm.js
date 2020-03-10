//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_childForm = function(owner, options){
    if (owner)
    {
		this.caption = "";	
		window.control_childForm.prototype.parent.constructor.call(this, owner, options);		
		this.className = "control_childForm";
		this.owner = owner;
		this.bgColor = system.getConfig("form.color");
		this.border = 0;
		this.activeControl = undefined;
		this.active = false;
		this.onClose = new control_eventHandler();
		this.opacity = 0;	
		this.setTop(owner.childTop);
    }
};
window.control_childForm.extend(window.control_containerControl);
window.childForm = window.control_childForm;
//---------------------------- Function ----------------------------------------
window.control_childForm.implement({
	draw: function(canvas){		
		window.control_childForm.prototype.parent.draw.call(this, canvas);		
		var n = this.getFullId();
		var nd = this.getCanvas();	
		nd.css({"background": "#fff" ,"overflow":"auto"});//system.getConfig("form.color")		
	    var html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:auto}' "+
						"onMouseDown ='$$$(" + this.resourceId + ").eventMouseDown(event);'"+
					"></div>"+
					"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%;z-index:99}' ></div>"+
					"<div id='" + n + "_loading' style='display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%;z-index:99}' align='center' >"+
						"<div style='position:absolute;background:#4d7795; filter:alpha(opacity:40);opacity:0.7;moz-opacity:0.7;width:100%;left:0;top:0;height:100% '></div>"+
						"<img id='"+n+"_imgloading' style='position:absolute;' width=60 height=60 src='image/progress/load.gif'/><br><div id='"+n+"_textloading' style='position:absolute;width:auto;font-style:italic;color:#ffffff'>Wait...</div>"+
					"</div>";	    
	    this.setInnerHTML(html, nd);
	},
	confirm: function(title, message, callback ){
		uses("system_fDialog");
		this.app._fDialog = new system_fDialog(this.app);
		this.app._fDialog.removeAllListeners();
		this.app._fDialog.confirm(title, message, this, callback);
	},
	info: function(title,message, callback ){
		uses("system_fDialog");
		this.app._fDialog = new system_fDialog(this.app);
		this.app._fDialog.removeAllListeners();
		this.app._fDialog.info(title,message, this, callback);
	},
	alert: function(title,message, callback ){
		uses("system_fDialog");
		this.app._fDialog = new system_fDialog(this.app);
		this.app._fDialog.removeAllListeners();
		this.app._fDialog.alert(title,message, this, callback);
	},
	setColor: function(data){
		this.bgColor = data;
		var nd = this.getCanvas();
		nd.css({background :  this.bgColor });
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){	
	    if (this.border != data){
	        var node = undefined;
	        var n = this.getFullId();	       
	        switch (data)
	        {
	            case 0 : // none
	                    node = $("#"+n + "_border1");	                    
	                    if (node != undefined)
	                        node.show();
	                    node = $("#"+n + "_border2");
	                    if (node != undefined)
	                        node.show();
	                    break;
	            case 1 : // raised
	                    node = $("#"+n + "_border1");
	                    if (node != undefined){
	                        node.css({"border-left" : window.system.getConfig("3dborder.outer.right") });
	                        node.css({"border-top" : window.system.getConfig("3dborder.outer.bottom") });
	                    }
	                    node = $("#"+n + "_border2");
	                    if (node != undefined){
	                        node.css({"border-right" : window.system.getConfig("3dborder.outer.left") });
	                        node.css({"border-bottom" : window.system.getConfig("3dborder.outer.top") });
	                    }	                    
	                    break;
	            case 2 : // lowered
	                    node = $("#"+n + "_border1");
	                    if (node != undefined){
	                        node.css({"border-left" : window.system.getConfig("3dborder.outer.left") });
	                        node.css({"border-top" : window.system.getConfig("3dborder.outer.top") });
	                    }
	                    node = $("#"+n + "_border2");
	                    if (node != undefined){
	                        node.css({"border-right" : window.system.getConfig("3dborder.outer.right") });
	                        node.css({"border-bottom" : window.system.getConfig("3dborder.outer.bottom") });
	                    }
	                    break;
				case 3 : // bordered
	                    node = $("#"+n + "_border1");
	                    if (node != undefined){
	                        node.css({"border-left" : window.system.getConfig("nonborder.inner.right") });
	                        node.css({"border-top" : window.system.getConfig("nonborder.inner.bottom") });
	                    }
	                    node = $("#"+n + "_border2");
	                    if (node != undefined){
	                        node.css({"border-right" : window.system.getConfig("nonborder.inner.left") });
	                        node.css({"border-bottom" : window.system.getConfig("nonborder.inner.top") });
	                    }	                    
	                    break;
	        }
	    }
	},
	setCaption: function(data){
		this.caption = data;	
	},
	doAfterResize: function(width, height){
		try{
			var cnv = $("#"+this.getFullId()+"_textloading");
			if (cnv) {		
				var w = parseInt(cnv.width());
				if (w > 200) {
					cnv.css({ width : 200 });
					w = 200;
				}
				cnv.css({top : this.height / 2 + 30, left : this.width / 2 - (w / 2) });
			}
			cnv =  $("#"+this.getFullId()+"_imgloading");
			if (cnv){
				cnv.css({top : this.height / 2 - 30, left : this.width / 2 - 30});
			}
		}catch(e){
			error_log(e);
		}
	},
	maximize: function(){
		try{
			this.isMaximized = true;
		    this.realWidth = this.width;
		    this.realHeight = this.height;
		    this.realLeft = this.left;
		    this.realTop = this.top;	    
			if (this.owner !== undefined){
				if (this.owner.childTop === undefined) this.owner.childTop = 0;
				var node = this.owner.getCanvas();

				var width = node.width();
				var height = node.height() - (this.owner instanceof control_panel ? 0 : this.owner.childTop + 22) ;			
				var offWidth=0;
				var offHeight=0;
				this.setBound(0,this.owner.childTop,width,height);			
				this.doAfterResize(width, height);
			}
		}catch(e){
			error_log(e);
		}
	},
	block: function(localy){
	    var node = $("#"+this.getFullId() + "_block");
	    if (node != undefined)
	        node.show();
		if (localy === undefined){
			try{			
				if (this.owner != undefined){
					var child = undefined;
					for (var i in this.owner.childs.objList){
						child = $$$(this.owner.childs.objList[i]);
						if (child instanceof control_panel)
							child.block();					
					}				
				}	
			}catch(e){
				systemAPI.alert(this+"$block()",e);
			}
		}
	},
	unblock: function(){
	    var node = $("#"+this.getFullId() + "_block");
	    if (node != undefined)
	        node.hide();
		if (this.owner != undefined){
			var child = undefined;
			for (var i in this.owner.childs.objList){
				child = $$$(this.owner.childs.objList[i]);
				if (child instanceof control_panel)
					child.unblock();
			}
		}
	},
	doDefocusCtrl: function(control){
		control.doLostFocus();
		if (control.blur) control.blur();
		this.activeControl= undefined;
	},
	setActiveControl: function(control){
	    if (control != this.activeControl){
	        this.activate();
	        if (this.activeControl instanceof window.control_control)
	            this.activeControl.doLostFocus();
            this.activeControl = control;
	        if (this.activeControl instanceof window.control_control)
	            this.activeControl.doSetFocus();	        
	    }
        return false;  
	},
	activate: function(oldApplication){	
		var app = this.app;//window.system.getActiveApplication();
	    if (!this.getForm().active){
	        this.active = true;
	        app.setActiveForm(this.getForm());
	    }		
		/*if ($(this.getFullId() + "_block").style.display == "none") {
			this.bringToFront();
			app.activeForm.setActiveForm(this);
		}*/
		app.activate();
	},
	show: function(){
		try{
			this.setVisible(true);		    
	        var firstControl = undefined;
	        var tabIndex = 100000;
	        var tabControl = undefined;	    
	        var ctrl = undefined;
	        for (var i in this.childs.objList){
	            ctrl = $$$(this.childs.objList[i]);			
				if (ctrl !== undefined){
		            if ((ctrl.className == "control_saiEdit") || (ctrl.className == "control_saiCB") ||  (ctrl.className == "control_saiCBBL") ||
						(ctrl.className == "control_saiLabelEdit")) 
		            {
						if (!ctrl.readOnly)
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
				}
	        }
	        if (tabControl != undefined)
					tabControl.setFocus();
	        else if (firstControl != undefined)			
					firstControl.setFocus();						
		this.activeControl = firstControl;
		if (this.activeControl !== undefined)
			this.activeControl.setFocus();
		}catch(e){
			systemAPI.alert(this+"$show()",e);
		}
	},	
	doKeyDown: function(charCode, buttonState,keyCode,event){
		try{		   						
			if ((this.activeControl instanceof control_control) || (this.activeControl instanceof control_containerControl ))
				this.activeControl.doKeyDown(charCode, buttonState,keyCode,event);
			return false;
	    	  
		}catch(e){
			alert("[control_childForm]::doKeyDown:"+e+"\r\n"+this.activeControl);
		}
	},
	doKeyUp: function(keyCode, buttonState){
		try{
			 if ((this.activeControl instanceof control_control) || (this.activeControl instanceof control_containerControl ))
				this.activeControl.doKeyUp(keyCode, buttonState,keyCode);
		}catch(e){
			systemAPI.alert(this+"$doKeyUp()",e);
		}
	},
	doKeyPress: function(charCode, buttonState,keyCode){
		try{
			if ((this.activeControl instanceof control_control) || (this.activeControl instanceof control_containerControl ))
				this.activeControl.doKeyPress(charCode, buttonState,keyCode);
		}catch(e){
			systemAPI.alert(this+"$doKeyPress()",e);
		}
	},
	eventMouseDown:  function(event){	
		var target = document.all ? event.srcElement : event.target;
		//if (target.id.search("form") != -1) this.doDefocusCtrl(this.activeControl);
	},
	doSysMouseDown: function(x, y, button, buttonState){
		if (this.getApplication().dropDownCB != undefined) 
			this.getApplication().dropDownCB.close();
		if (this.getApplication().dropDown != undefined)
			this.getApplication().dropDown.hide();		
	},
	doModalResult: function(sender, modalResult){
	},
	free: function(){	
		if (window.systemDatePickerForm != undefined) window.systemDatePickerForm.hide();
		window.control_childForm.prototype.parent.free.call(this);
		this.emit("close");
		
		this.onClose.call(this);		
	},
	close: function(){
		this.free();
		
	},
	showLoading: function(text){
		$("#"+this.getFullId()+"_loading").show();
		var cnv = $("#"+this.getFullId()+"_textloading");
		if (cnv) {
			cnv.text(text );
			var w = parseFloat(cnv.width());
			if (w > 200) {
				cnv.css({width : 200 });
				w = 200;
			}
			cnv.css({top : this.height / 2 + 30, left : this.width / 2 - (w / 2) });			
		}
		cnv =  $("#"+this.getFullId()+"_imgloading") ;
		if (cnv){
			cnv.css({top : this.height / 2 - 30, left : this.width / 2 - 30});			
		}
	},
	hideLoading : function(text){
		$("#"+this.getFullId()+"_loading").hide();
	}
});
