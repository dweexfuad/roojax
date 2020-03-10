//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.bsNormal = 0;//border Style
window.bsDialog = 1;
window.bsHide = 2;
window.bsSingle = 3;
window.bsSizeToolWin = 4;

window.fsNormal = 0;
window.fsMDIForm = 1;
window.fsMDIChild = 2;
window.fsStayOnTop = 3;

window.control_sysForm = function(owner, options){
    if (owner){
		this.color = '#ffffff';//system.getConfig("form.color");
		this.caption = "Form";
		window.control_sysForm.prototype.parent.constructor.call(this, owner, options);
		this.className = "control_sysForm";		
		this.mouseMode = 0;        
		this.resizeAble = true;
		this.setTop(83);
		this.setWidth(300);
		this.setHeight(300);
		
		this.mouseX = 0;
		this.mouseY = 0;
		//this.onClose = new control_eventHandler();		
		this.onClose.set(this,"doClose");		
		this.isClick = false;
		this.borderStyle = bsNormal;
		this.onMouseDown = new control_eventHandler();
		this.onAfterResize = new control_eventHandler();
		this.formStyle = fsNormal;
		if(options !== undefined){
			this.updateByOptions(options);
			if (options.caption !== undefined) this.setCaption(options.caption);
			if (options.color !== undefined) this.setColor(options.color);
			if (options.resizeAble !== undefined) this.setResizeAble(options.resizeAble);
			if (options.closeToHide !== undefined) this.setCloseToHide(options.closeToHide);
			if (options.borderStyle !== undefined) this.setBorderStyle(options.borderStyle);
			if (options.afterResize !== undefined) this.onAfterResize.set(options.afterResize[0], options.afterResize[1]);
			if (options.formStyle !== undefined) this.setFormStyle(options.formStyle);
		}
    }
};
window.control_sysForm.extend(window.control_commonForm);
window.sysForm = window.control_sysForm;
window.control_sysForm.implement({
	doDraw: function(canvas){
		try{
			canvas.style.border = "1px solid #ffffff";
			window.control_sysForm.prototype.parent.doDraw.call(this, canvas);
			
		    //canvas.style.background = "url(image/themes/formBg.png) top left";
			//canvas.style.background = "#90AFBF";
			
		    var n = this.getFullId();
		    var sizerPos  = -14;
		    if (document.all)
			sizerPos = -16;
		    var html =  "<div id='"+n+"formBody' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background-color:"+this.color+";}' " +
				    "onMouseDown ='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' >" +
				    "<div id='" + n + "_sLeftTop' style='{background: url(image/themes/"+system.getThemes()+"/shadowLeftTop.png) top left; position: absolute; left: -15; top: 0; width: 15; height: 20}' ></div>" +
				    "<div style='{position: absolute; left: -15; top: -20; width: 15; height: 100%; overflow: hidden;}' >" +
					"<div id='" + n + "_sLeft' style='{background: url(image/themes/"+system.getThemes()+"/shadowLeft.png) top left repeat-y; position: absolute; left: 0; top: 40; width: 100%; height: 100%}' ></div>" +
				    "</div>" +
				    "<div style='{position: absolute; left: -15; top: -20; width: 15; height: 100%;}' >" +
					"<div id='" + n + "_sLeftBottom' style='{background: url(image/themes/"+system.getThemes()+"/shadowLeftBottom.png) top left; position: absolute; left: 0; top: 100%; width: 100%; height: 20}' ></div>" +
				    "</div>" +
				    "<div id='" + n + "_sEdgeLeft' style='{background: url(image/themes/"+system.getThemes()+"/shadowEdgeLeft.png) top left; position: absolute; left: -15; top: 100%; width: 15; height: 20}' ></div>" +
				    "<div id='" + n + "_sRightTop' style='{background: url(image/themes/"+system.getThemes()+"/shadowRightTop.png) top left; position: absolute; left: 100%; top: 0; width: 15; height: 20}' ></div>" +
				    "<div style='{position: absolute; left: 100%; top: -20; width: 15; height: 100%; overflow: hidden;}' >" +
					"<div id='" + n + "_sRight' style='{background: url(image/themes/"+system.getThemes()+"/shadowRight.png) top left repeat-y; position: absolute; left: 0; top: 40; width: 100%; height: 100%}' ></div>" +
				    "</div>" +
				    "<div style='{position: absolute; left: 100%; top: -20; width: 15; height: 100%;}' >" +
					"<div id='" + n + "_sRightBottom' style='{background: url(image/themes/"+system.getThemes()+"/shadowRightBottom.png) top left; position: absolute; left: 0; top: 100%; width: 100%; height: 20}' ></div>" +
				      "</div>" +
				    "<div id='" + n + "_sEdgeRight' style='{background: url(image/themes/"+system.getThemes()+"/shadowEdgeRight.png) top left; position: absolute; left: 100%; top: 100%; width: 15; height: 20}' ></div>" +
				    "<div id='" + n + "_sBottomLeft' style='{background: url(image/themes/"+system.getThemes()+"/shadowBottomLeft.png) top left; position: absolute; left: 0; top: 100%; width: 15; height: 20}' ></div>" +
				    "<div style='{position: absolute; left: -15; top: 100%; width: 100%; height: 20; overflow: hidden;}' >" +
					"<div id='" + n + "_sBottom' style='{background: url(image/themes/"+system.getThemes()+"/shadowBottom.png) top left repeat-x; position: absolute; left: 30; top: 0; width: 100%; height: 100%}' ></div>" +
				    "</div>" +
				    "<div style='{position: absolute; left: -15; top: 100%; width: 100%; height: 20;}' >" +
					"<div id='" + n + "_sBottomRight' style='{background: url(image/themes/"+system.getThemes()+"/shadowBottomRight.png) top left repeat-x; position: absolute; left: 100%; top: 0; width: 15; height: 100%}' ></div>" +
				    "</div>" +                //
				    "<div id='" + n + "_bg' style='{background-color:"+system.getConfig("form.color")+"; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +							//background: url(image/themes/formLeft.png) top left repeat-y; 
				    "<div id='" + n + "_left' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
													//background: url(image/themes/formRight.png) top right repeat-y; 
				    "<div id='" + n + "_right' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +											//background: url(image/themes/formTop.png) top left repeat-x
				    "<div id='" + n + "_top' style='{background:url(icon/"+system.getThemes()+"/formHeader.png) repeat-x; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +//background: url(image/themes/formBottom.png) bottom left repeat-x;
				    "<div id='" + n + "_bottom' style='{ position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
																//background: url(image/themes/formTopLeft.png) top left no-repeat;
				    "<div id='" + n + "_topLeft' style='{ position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
																//background: url(image/themes/formTopRight.png) top right no-repeat; 
				    "<div id='" + n + "_topRight' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
																//background: url(image/themes/formBottomLeft.png) bottom left no-repeat; 
				    "<div id='" + n + "_bottomLeft' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
															//background: url(image/themes/formBottomRight.png) bottom right no-repeat;
				    "<div id='" + n + "_bottomRight' style='{ position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
				    "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;}' >" +
					"<div id='" + n + "form' style='{background-color:"+system.getConfig("form.color")+";position: absolute; left: 0; top: 25; width: 100%; height: 100%}' ></div>" +
				    "</div>" +                                  //"+system.getConfig("form.color")+"
				    
				    "<div id='"+ n +"_titleBar' style='{position: absolute; left: 0; top: 0; width: 100%; height: 25; overflow: hidden;cursor:pointer}' "+
							"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +	
							">" +
					"<div id='" + n + "_title' style='{font-family: " + window.system.getConfig("form.titleFontName") + "; font-size: " + window.system.getConfig("form.titleFontSize") + "; font-color: " + window.system.getConfig("form.titleFontColor") + "; position: absolute; left: 30; top: 5; width: 100%; height: 100%; align: left}' align='left'"+						
								"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +	
								"onDblClick ='window.system.getResource(" + this.resourceId + ").eventTitleDblClick(event);' "+
								">"+this.caption+"</div>" +
					"<div id='" + n + "_titleImg' style='{position: absolute; left: 5; top: 3; width: 100%; height: 100%; align: left;background-image:url(image/themes/"+system.getThemes()+"/fis.png);background-position:top lef;background-repeat:no-repeat;}' align='left'"+
								"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +	
								"onDblClick ='window.system.getResource(" + this.resourceId + ").eventTitleDblClick(event);' "+
								"></div>" +
								"<div id='" + n + "_id' style='{position: absolute;left: -115; top: 0; width: 100%; height: 25;}' "+
									"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +								
									">	<span style='position:absolute;left:100%;top:2;width:auto;height:auto;color:#ffffff;font-weight:bold;'>roojax </span>"+
									"	<span style='position:absolute;left:100%;top:1;width:auto;height:auto;color:#999999;font-weight:bold;'>roojax </span>" +						
								"</div>"+
					"<div id='" + n + "_button' style='{position: absolute;left: -75; top: 0; width: 100%; height: 25;}' "+
									"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +								
									">" +						
					    "<div style='{position: absolute;left: 100%; top: 1; width: 75; height: 25;}' >" +
						"<div id='" + n + "_btnMinimize' style='{cursor: pointer;background: url(image/themes/"+system.getThemes()+"/formMinimize.png) top left no-repeat;position: absolute; ;left: 0; top: -3; width: 25; height: 25;}' " +
						    "onMouseOver='window.system.getResource(" + this.resourceId + ").eventButtonMouseOver(event, \"btnMinimize\");' " +
						    "onMouseOut ='window.system.getResource(" + this.resourceId + ").eventButtonMouseOut(event, \"btnMinimize\");' " +	
						    "onClick ='window.system.getResource(" + this.resourceId + ").eventButtonMouseClick(event, \"btnMinimize\");' " +
						    "onMouseMove='window.system.getResource(" + this.resourceId + ").eventButtonMouseMove(event, \"btnMinimize\");' " +
						    " ></div>" +
						"<div id='" + n + "_btnMaximize' style='{cursor: pointer;background: url(image/themes/"+system.getThemes()+"/formMaximize.png) top left no-repeat;position: absolute; ;left: 25; top: -3; width: 25; height: 25;}' " +
						    "onMouseOver='window.system.getResource(" + this.resourceId + ").eventButtonMouseOver(event, \"btnMaximize\");' " +
						    "onMouseOut ='window.system.getResource(" + this.resourceId + ").eventButtonMouseOut(event, \"btnMaximize\");' " +
						    "onClick ='window.system.getResource(" + this.resourceId + ").eventButtonMouseClick(event, \"btnMaximize\");' " +
						    "onMouseMove='window.system.getResource(" + this.resourceId + ").eventButtonMouseMove(event, \"btnMaximize\");' " +
						    " ></div>" +
						"<div id='" + n + "_btnClose' style='{cursor: pointer;background: url(image/themes/"+system.getThemes()+"/formClose.png) top left no-repeat;position: absolute; ;left: 50; top: -3; width: 25; height: 25;}' " +
						    "onMouseOver='window.system.getResource(" + this.resourceId + ").eventButtonMouseOver(event, \"btnClose\");' " +
						    "onMouseOut ='window.system.getResource(" + this.resourceId + ").eventButtonMouseOut(event, \"btnClose\");' " +
						    "onClick ='window.system.getResource(" + this.resourceId + ").eventButtonMouseClick(event, \"btnClose\");' " +
						    "onMouseMove='window.system.getResource(" + this.resourceId + ").eventButtonMouseMove(event, \"btnClose\");' " +
						    " ></div>" +
					    "</div>" +                            
					"</div>" +                                          					  
							"</div>" +                         
							"<div style='{position: absolute; left: 100%; top: 100%; width: 100%; height: 100%}' >" +
					"<div id='" + n + "_sizer' style='{background: url(image/themes/formSizer.png) bottom right no-repeat; position: absolute; left: -14; top: " + sizerPos + "; width: 12; height: 12;cursor: se-resize;}' onMouseDown='window.system.getResource(" + this.resourceId + ").eventSizerMouseDown(event);' ></div>" +
				    "</div>" +
				"</div>" +				
				"<div id='" + n + "_block' style='{background:url(image/fis.jpg)bottom left repeat-x;background-color: #034891;filter:alpha(opacity:0.3);opacity:0.3;moz-opacity:0.5; zindex:1000000;display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>";
				
		    this.setInnerHTML(html, canvas);
			this.titleBar = $(n +"_titleBar");
			if (systemAPI.browser.msie && systemAPI.browser.version == 6){
				var b1 = $( n +"_sLeftTop");
				var b2 = $( n +"_sLeft");
				var b3 = $( n +"_sEdgeLeft");
				var b4 = $( n +"_sBottomLeft");
				var b41 = $( n +"_sLeftBottom");
				var b5 = $( n +"_sRightTop");
				var b6 = $( n +"_sRight");
				var b7 = $( n +"_sEdgeRight");
				var b8 = $( n +"_sBottomRight");
				var b81 = $( n +"_sRightBottom");
				var b9 = $( n +"_sBottom");	
				var b10 = $( n +"_btnMinimize");
				var b11 = $( n +"_btnMaximize");
				var b12 = $( n +"_btnClose");					
				var b13 = $( n +"_titleImg");	
				var b14 = $( n +"_sizer");	
				DD_belatedPNG.fixPngArray([b1,b2,b3,b4,b5,b6,b7,b8,b9,b41, b81]);
				DD_belatedPNG.fixPng(b10);DD_belatedPNG.fixPng(b11);DD_belatedPNG.fixPng(b12);
				DD_belatedPNG.fixPng(b13);DD_belatedPNG.fixPng(b14);
			}
		}catch(e){
			alert(e);
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
			this.titleBar.style.cursor = "move";
	    }else this.titleBar.style.cursor = "pointer";
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
	    if (this.mouseMode == 1){
	        this.doAfterResize(this.getClientWidth(), this.getClientHeight());	   
			this.onAfterResize.call(this,this.getClientWidth(), this.getClientHeight());
		}
	    this.mouseMode = 0;
		this.titleBar.style.cursor = "pointer";
	},
	eventButtonMouseOver: function(event, id){
	    var node = $(this.getFullId() + "_" + id);    
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
	        node.style.background = bg;
	},
	eventButtonMouseOut: function(event, id){
	    window.system.hideHint();
	    
	    var node = $(this.getFullId() + "_" + id);
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
	        node.style.background = bg;
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
	    switch (id){
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
	doActivate: function(){
	    window.control_sysForm.prototype.parent.doActivate.call(this);
	    
	    var node = $(this.getFullId() + "_title");
	    node.style.color = system.getConfig("form.titleFontColor");	
	},
	doDeactivate: function(){
	    window.control_sysForm.prototype.parent.doDeactivate.call(this);
	    
	    var node = $(this.getFullId() + "_title");
	    if (node != undefined)
			node.style.color = system.getConfig("form.titleFontColor");	
	},
	getCaption: function(){
		return this.caption;
	},
	setCaption: function(data){
	    if (this.caption != data){
	        this.caption = data;                
	        node = $(this.getFullId() + "_title");
	        node.innerHTML = data;		
	    }
	},
	isResizeAble: function(){
		return this.resizeAble;
	},
	setResizeAble: function(data){
	    if (this.resizeAble != data)
	    {
	        this.resizeAble = data;

	        var node = $(this.getFullId() + "_sizer");
	        
	        if (this.resizeAble)
	            node.style.display = "";
	        else
	            node.style.display = "none";
	    }
	},
	getClientHeight: function(){
		return (this.height - 25);
	},
	close: function(){
		if (this.closeToHide)
			this.hide();
		else
			window.control_sysForm.prototype.parent.close.call(this);
	},
	setFormButton: function(type){
		var btn1 = $(this.getFullId()+"_btnMinimize");btn1.style.display = "none";
		var btn2 = $(this.getFullId()+"_btnMaximize");btn2.style.display = "none";
		var btn3 = $(this.getFullId()+"_btnClose");btn3.style.display = "none";
		switch(type)
		{
			case 0 :			
				btn1.style.display = "";
				break;
			case 1 :
				btn2.style.display = "";
				break;
			case 2 :
				btn3.style.display = "";
				break;
			case 3 :
				btn1.style.display = "";
				btn1.style.display = "";
				btn1.style.display = "";
				break;
				
		}
	},
	setColor: function(data){
		this.color = data;
		var cnv = $(this.getFullId() + "_bg");
		cnv.style.backgroundColor = data;
		var cnv = $(this.getFullId() + "form");
		cnv.style.backgroundColor = data;
	},
	setBtnPos: function(data){
	    var cnv = $(this.getFullId() +'_button');
	    var title = $(this.getFullId() +'_title');
	    if (cnv != undefined)
	    {
	      cnv.style.left = data;
	      title.style.width = data;      
	    }
	},
	doClose: function(){	
		system.delMouseListener(this);
	},
	setCloseToHide: function(data){
		this.closeToHide = data;
	},
	setBorderStyle: function(data){
		this.borderStyle = data;
		var btnMin = $(this.getFullId()+"_btnMinimize");
		var btnMax = $(this.getFullId()+"_btnMaximize");
		var btnClose = $(this.getFullId()+"_btnClose");
		var bSizer = $( this.getFullId() +"_sizer");	
		switch(data){
			case bsDialog :
				btnMin.style.display = "none";
				btnMax.style.display = "none";				
				btnClose.style.display = "";
				bSizer.style.display = "none";
			break;
			case bsHide :
				btnMin.style.display = "none";
				btnMax.style.display = "none";
				btnClose.style.display = "none";
				bSizer.style.display = "none";
			break;
			case bsSingle :
				btnMin.style.display = "";
				btnMax.style.display = "";
				btnClose.style.display = "";
				bSizer.style.display = "none";
			break;					
			case bsSizeToolWin :
				btnMin.style.display = "none";
				btnMax.style.display = "none";
				btnClose.style.display = "";
				bSizer.style.display = "";
			break;		
			default:
				btnMin.style.display = "";
				btnMax.style.display = "";
				btnClose.style.display = "";
				bSizer.style.display = "";
			break;
		}
	},
	setFormStyle: function(data){
		this.formStyle = data;
		if (data == fsMDIForm)
			this.MDIChild = [];
	},
	isMDIForm: function(){
		return this.formStyle == fsMDIForm;
	}
});
