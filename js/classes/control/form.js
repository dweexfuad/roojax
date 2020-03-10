//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_form = function(owner,options){
    if (owner){
		this.color = '#ffffff';//system.getConfig("form.color");
		window.control_form.prototype.parent.constructor.call(this, owner,options);
		this.className = "control_form";        
		this.mouseMode = 0;
		this.caption = "Form";
		this.resizeAble = false;
		this.setWidth(300);
		this.setHeight(300);		
		this.mouseX = 0;
		this.mouseY = 0;		
		this.onClose.set(this,"doClose");	
		this.onMouseDown = new control_eventHandler();
		this.onAfterResize = new control_eventHandler();		
		this.isClick = false;
		this.setBorderStyle(bsNormal);
		if(options !== undefined){
			this.updateByOptions(options);
			if (options.caption !== undefined) this.setCaption(options.caption);
			if (options.color !== undefined) this.setColor(options.color);
			if (options.resizeAble !== undefined) this.setResizeAble(options.resizeAble);			
			if (options.borderStyle !== undefined) this.setBorderStyle(options.borderStyle);
			if (options.afterResize !== undefined) this.onAfterResize.set(options.afterResize[0], options.afterResize[1]);
		}
    }
};
window.control_form.extend(window.control_commonForm);
window.form = window.control_form;
//---------------------------- Function ----------------------------------------
window.control_form.implement({
	doDraw: function(canvas){
		try{								
			window.control_form.prototype.parent.doDraw.call(this, canvas);	
		    
			
		    var n = this.getFullId();
		    var sizerPos  = -14;
		    if (document.all) sizerPos = -16;
		    var html =  "<div id='"+n+"formBody'style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background-color:"+this.color+";}' " +
				    "onMouseDown ='$$$(" + this.resourceId + ").eventMouseDown(event);' >" +
				    "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;}' >" +
					"<div id='" + n + "form' style='{background-color:"+system.getConfig("form.color")+";position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
				    "</div>" +
					
						
						"<div id='" + n + "_block' align='center' style='{background:transparent; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; z-index:1000000;display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' >"+
							"<span style='color:#ffffff;top:40%;position:absolute;left:40%;font-size:50;font-family:arial'>roo<font color='#ff9900'>J</font>ax</span>"+					
						"</div>";				
				
		    this.setInnerHTML(html, canvas);
			
		}catch(e){
			systemAPI.alert(this+"$draw()",e);
		}
	},
	doThemesChange: function(themeName){
		var canvas = this.getCanvas();
	},
	eventMouseDown: function(event){	
	    this.bringToFront();
	    this.activate();
		this.onMouseDown.call(this,event);
	},
	eventSizerMouseDown: function(event){
	    if (!this.isMaximized){
	        this.mouseMode = 1;
	        window.system.addMouseListener(this);

	        this.mouseX = window.system.getMouseX();
	        this.mouseY = window.system.getMouseY();		
	    }
	},
	eventTitleMouseDown: function(event){
	    if (!this.isMaximized){
	        this.mouseMode = 2;
	        window.system.addMouseListener(this);

	        this.mouseX = window.system.getMouseX();
	        this.mouseY = window.system.getMouseY();
			this.titleBar.css({"cursor" : "move"});
	    }else this.titleBar.css({"cursor" : "pointer"});
	},
	eventTitleDblClick: function(event){
			if (this.isMaximized)
				this.restore();
			else
				this.maximize();
	},
	doSysMouseDown: function(x, y, button, buttonState){
		if (this.getApplication().dropDownCB != undefined) 
			this.getApplication().dropDownCB.hide();
		if (this.getApplication().dropDown != undefined)
			this.getApplication().dropDown.hide();
	},
	doSysMouseMove: function(x, y, button, buttonState){    
		switch (this.mouseMode)
	    {
	        case 1 : // resizing form
	                var newWidth = this.width + (x - this.mouseX);
	                var newHeight = this.height + (y - this.mouseY);
	                
	                if (newWidth < 50)
	                    newWidth = 50;

	                if (newHeight < 50)
	                    newHeight = 50;
	                
	                this.setWidth(newWidth);
	                this.setHeight(newHeight);

	                this.mouseX = x;
	                this.mouseY = y;
	                break;
	        case 2 : // moving form
	                var newLeft = this.left + (x - this.mouseX);
	                var newTop = this.top + (y - this.mouseY);

	                this.setLeft(newLeft);
	                this.setTop(newTop);

	                this.mouseX = x;
	                this.mouseY = y;
	                break;
	    }
	},
	doSysMouseUp: function(x, y, button, buttonState){
	    window.system.delMouseListener(this);
	    
	    if (this.mouseMode == 1)
	        this.doAfterResize(this.getClientWidth(), this.getClientHeight());
	        
	    this.mouseMode = 0;
		this.titleBar.css({"cursor" : "pointer"})
	},
	eventButtonMouseOver: function(event, id){		
	    var node = $("#"+this.getFullId() + "_" + id);    
		var bg = "";
		switch (id)
	    {
	        case "btnMinimize" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formMinimizeOver.png) top left no-repeat";
	                            break;
	        case "btnMaximize" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formMaximizeOver.png) top left no-repeat";
	                            break;
	        case "btnClose" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formCloseOver.png) top left no-repeat";
	                            break;
	    }
	    if (node != undefined)
	        node.css({background : bg });
	    switch (id)
	    {
	        case "btnMinimize" :
	                            window.system.showHint(event.clientX, event.clientY, "Minimize",true);
	                            break;
	        case "btnMaximize" :
	                            if (this.isMaximized)
	                                window.system.showHint(event.clientX, event.clientY, "Restore",true);
	                            else
	                                window.system.showHint(event.clientX, event.clientY, "Maximize",true);
	                            break;
	        case "btnClose" :
	                            window.system.showHint(event.clientX, event.clientY, "Close",true);
	                            break;
	    }
	},
	eventButtonMouseOut: function(event, id){
	    window.system.hideHint();	    
	    var node = $("#"+this.getFullId() + "_" + id);
		var bg = "";
		switch (id)
	    {
	        case "btnMinimize" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formMinimize.png) top left no-repeat";
	                            break;
	        case "btnMaximize" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formMaximize.png) top left no-repeat";
	                            break;
	        case "btnClose" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formClose.png) top left no-repeat";
	                            break;
	    }
	    if (node != undefined)
	        node.css({background : bg });
	},
	eventButtonMouseDown: function(event, id){
	    var node = $("#"+this.getFullId() + "_" + id);
		var bg = "";
		switch (id)
	    {
	        case "btnMinimize" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formMinimizeOver.png) top left no-repeat";
	                            break;
	        case "btnMaximize" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formMaximizeOver.png) top left no-repeat";
	                            break;
	        case "btnClose" :
	                            bg = "url(image/themes/"+system.getThemes()+"/formCloseOver.png) top left no-repeat";
	                            break;
	    }
	    if (node != undefined)
	        node.css({background : bg });
	},
	eventButtonMouseClick: function(event, id){
	    switch (id)
	    {
	        case "btnMinimize" :
	                            this.minimize();
	                            break;
	        case "btnMaximize" :
	                            if (this.isMaximized)
	                                this.restore();
	                            else
	                                this.maximize();
	                            break;
	        case "btnClose" :
	                            this.close();
	                            break;
	    }	    
	    window.system.hideHint();
	},
	eventButtonMouseMove: function(event, id){  
	    /*switch (id)
	    {
	        case "btnMinimize" :
	                            window.system.showHint(event.clientX, event.clientY, "Minimize",true);
	                            break;
	        case "btnMaximize" :
	                            if (this.isMaximized)
	                                window.system.showHint(event.clientX, event.clientY, "Restore",true);
	                            else
	                                window.system.showHint(event.clientX, event.clientY, "Maximize",true);
	                            break;
	        case "btnClose" :
	                            window.system.showHint(event.clientX, event.clientY, "Close",true);
	                            break;
	    }*/
	},
	doActivate: function(){
	    window.control_form.prototype.parent.doActivate.call(this);	    
	    $("#"+this.getFullId() + "_title").css({color : system.getConfig("form.titleFontColor") });	
	},
	doDeactivate: function(){
	    window.control_form.prototype.parent.doDeactivate.call(this);
	    
	    var node = $("#"+this.getFullId() + "_title");
	    if (node != undefined)
			node.css({color : system.getConfig("form.titleFontColor") });	
	},
	getCaption: function(){
		return this.caption;
	},
	setCaption: function(data){
	    if (this.caption != data){
	        this.caption = data;	        
	        $("#"+this.getFullId() + "_title").html( data );
			
	    }
	},
	isResizeAble: function(){
		return this.resizeAble;
	},
	setResizeAble: function(data){
	    if (this.resizeAble != data){
	        this.resizeAble = data;
	        $("#"+this.getFullId() + "_sizer").toggle();	        
	    }
	},
	getClientHeight: function(){
		return this.height;
	},
	close: function(){
		window.control_form.prototype.parent.close.call(this);
	},
	setFormButton: function(type){
		var btn1 = $("#"+this.getFullId()+"_btnMinimize");btn1.hide();
		var btn2 = $("#"+this.getFullId()+"_btnMaximize");btn2.hide();
		var btn3 = $("#"+this.getFullId()+"_btnClose");btn3.hide();
		switch(type)
		{
			case 0 :			
				btn1.show();
				break;
			case 1 :
				btn2.show();
				break;
			case 2 :
				btn3.show();
				break;
			case 3 :
				btn1.show();
				btn1.show();
				btn1.show();
				break;
				
		}
	},
	setColor: function(data){
		this.color = data;
		var cnv = $("#"+this.getFullId() + "_bg");
		cnv.css({"background-color" : data });
		var cnv = $("#"+this.getFullId() + "form");
		cnv.css({"background-color" : data });
	},
	setBtnPos: function(data){
	    var cnv = $("#"+this.getFullId() +'_button');
	    var title = $("#"+this.getFullId() +'_title');
	    var img = $("#"+this.getFullId() +'_image');  
	    if (cnv != undefined)
	    {
	      cnv.css({left : data });
	      title.css({width : data });
		  img.css({top : 1 , left : data + 75 }); 
	    }
	},
	setImage: function(image){
	  var img = $("#"+this.getFullId() + "_image" );
	  if (img != undefined)
	  {
	    img.css({"background-image" :image,"background-position" : "center","background-repeat": "no-repeat", "background-color" : system.getConfig("form.panel.color") });
	    img.show();
	  }
	},
	doClose: function(){	
		system.delMouseListener(this);
	},
	setBorderStyle: function(data){
		this.borderStyle = data;
		var btnMin = $("#"+this.getFullId()+"_btnMinimize");
		var btnMax = $("#"+this.getFullId()+"_btnMaximize");
		var btnClose = $("#"+this.getFullId()+"_btnClose");
		var bSizer = $("#"+ this.getFullId() +"_sizer");	
		$("#"+this.getFullId() +"_id").css({left : -238 });
		switch(data){
			case bsDialog :
				btnMin.hide();
				btnMax.hide();
				btnClose.show();
				bSizer.hide();
			break;
			case bsHide :
				btnMin.hide();
				btnMax.hide();
				btnClose.hide();
				bSizer.hide();
				$("#"+ this.getFullId() +"_id").css({left : -168 });
			break;
			case bsSingle :
				btnMin.show()
				btnMax.show()
				btnClose.show()
				bSizer.hide();
			break;					
			case bsSizeToolWin :
				btnMin.hide();
				btnMax.hide();
				btnClose.show();
				bSizer.show();
			break;		
			default:
				btnMin.show();
				btnMax.show();
				btnClose.show();
				bSizer.show();
			break;
		}
	},
	addChild: function(child){
		try{
			window.control_form.prototype.parent.addChild.call(this, child);
			if (child instanceof control_childForm){
				if (this.mdiChilds  === undefined) this.mdiChilds = [];
				child.childIndex = this.mdiChilds.length;
				this.mdiChilds[this.mdiChilds.length] = child;
			}
		}catch(e){
			error_log(e);
		}
	},
	delChild: function(child){
		try{
			window.control_form.prototype.parent.delChild.call(this, child);
			var ix = child.childIndex;
			delete this.mdiChilds[child.childIndex];			
			var tmp = [];
			for (var i in this.mdiChilds){			
				this.mdiChilds[i].childIndex = tmp.length;
				tmp[tmp.length] = this.mdiChilds[i];
			}
			this.mdiChilds = tmp;
			if (tmp.length > 0) {
				if (ix > tmp.length) ix = tmp.length - 1;			
				this.setActiveForm(this.mdiChilds[ix]);
			}			
		}catch(e){
			error_log(e);
		}
	},
	setActiveForm: function(child){
		this.activeChildForm = child;
	},
	doAfterResize: function(width, height){
		window.control_form.prototype.parent.delChild.call(this, width, height);
		//jika parent maximize.. client disesuaikan dengan parent
		for (var i in this.mdiChilds){			
			this.mdiChilds[i].setWidth(width);
			this.mdiChilds[i].setHeight(height - this.mdiChilds[i].top);
		}
	},
	closeAllMDIChild: function(){
		var appChild = this.childs;
		var res = undefined;
		for (var i in appChild.objList){
			res = system.getResource(appChild.objList[i]);		
			if (res instanceof control_childForm)		
	  			res.free();		
		}	
	}
	
});
