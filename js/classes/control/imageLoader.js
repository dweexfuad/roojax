//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_imageLoader = function(owner){
    if (owner){
		this.color = '#ffffff';//system.getConfig("form.color");
		this.caption = "Form";
        window.control_imageLoader.prototype.parent.constructor.call(this, owner);
        this.className = "control_imageLoader";        
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
    }
};
window.control_imageLoader.extend(window.control_commonForm);
window.imageLoader = window.control_imageLoader;
window.control_imageLoader.implement({
	doDraw: function(canvas){
		canvas.style.border = "1px solid #ffffff";
		//window.control_imageLoader.prototype.parent.doDraw.call(this, canvas);
		canvas.onclick = new Function("system.getResource("+this.resourceId+").close()");
	    var n = this.getFullId();
	    var sizerPos  = -14;
	    if (document.all)
	        sizerPos = -16;
	    var html =  "<div id='"+n+"formBody'style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background-color:"+this.color+";}' " +
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
	                       "<div id='" + n + "form' align='center' style='{background-color:"+system.getConfig("form.color")+";position: absolute; left: 0; top: 0; width: 100%; height: 100%}' >"+													
							"</div>" +
	                    "</div>" +                                  //"+system.getConfig("form.color")+"
	                    
	                    "<div id='"+ n +"_titleBar' style='{position: absolute; left: 0; top: 0; width: 100%; height: 25; overflow: hidden;cursor:pointer}' "+
						"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +	
						"onMouseOver ='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event)'" +								
						">" +                        
	                        "<div id='" + n + "_button' style='{position: absolute;left: -50; top: 0; width: 100%; height: 25;}' "+
								"onMouseDown ='window.system.getResource(" + this.resourceId + ").eventTitleMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event)'" +													
								">" +						
	                            "<div style='{position: absolute; ;left: 100%; top: 1; width: 25; height: 25;}' "+							
								">" +                                							
	                                "<div id='" + n + "_btnClose' style='{display:;cursor: pointer;background: url(image/themes/"+system.getThemes()+"/formClose.png) top left no-repeat;position: absolute; ;left: 25; top: -3; width: 25; height: 25;}' " +
	                                    "onMouseOver='try{window.system.getResource(" + this.resourceId + ").eventButtonMouseOver(event, \"btnClose\");}catch (e){}' " +
	                                    "onMouseOut ='try{window.system.getResource(" + this.resourceId + ").eventButtonMouseOut(event, \"btnClose\");}catch (e){}' " +
	                                    "onMouseDown ='try{window.system.getResource(" + this.resourceId + ").eventButtonMouseDown(event, \"btnClose\");}catch (e){}' " +
	                                    "onMouseUp ='try{window.system.getResource(" + this.resourceId + ").eventButtonMouseOver(event, \"btnClose\");}catch (e){}' " +
	                                    "onClick ='try{window.system.getResource(" + this.resourceId + ").eventButtonMouseClick(event, \"btnClose\");}catch (e){}' " +
	                                    "onMouseMove='try{window.system.getResource(" + this.resourceId + ").eventButtonMouseMove(event, \"btnClose\");}catch (e){}' " +
	                                    "></div>" +
	                            "</div>" +                            
	                      "</div>" +                                          					  
						"</div>" +                         						
	                "</div>" +				
	                "<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; zindex:1000000;display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>";	                	
		this.setInnerHTML(html, canvas);
	},
	setImage: function(data){
		try{
			this.filePath = data;		
			var canvas = this.getClientCanvas();
			if (canvas != undefined){	
				canvas.innerHTML = "";
				var img = new Image();
				img.src = data;
				img.style.cssText = "position:absolute;left:0;top:0;width:auto;height:auto;";
				if (document.all){
					canvas.innerHTML = img.outerHTML;								
					var h = img.height;
					var w = img.width;				
				}else{
					canvas.appendChild(img);
					var h = img.naturalHeight;
					var w = img.naturalWidth;
				}
				this.setBound(system.screenWidth / 2 - w / 2, system.screenHeight / 2 - h / 2,w,h)
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
	},
	eventMouseOver: function(event){
	},
	eventMouseOut: function(event){
	},
	eventSizerMouseDown: function(event){
	    if (!this.isMaximized)
	    {
	        this.mouseMode = 1;
	        window.system.addMouseListener(this);

	        this.mouseX = window.system.getMouseX();
	        this.mouseY = window.system.getMouseY();		
	    }
	},
	eventTitleMouseDown: function(event){
	    if (!this.isMaximized)
	    {
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
			this.getApplication().dropDownCB.close();
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
	eventButtonMouseDown: function(event, id){
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
	eventButtonMouseClick: function(event, id){
	    switch (id)
	    {
	        case "btnMinimize" :
	                            this.hide();
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
	    switch (id)
	    {
	        case "btnMinimize" :
	                            window.system.showHint(event.clientX, event.clientY + 25, "Minimize");
	                            break;
	        case "btnMaximize" :
	                            if (this.isMaximized)
	                                window.system.showHint(event.clientX, event.clientY + 25, "Restore");
	                            else
	                                window.system.showHint(event.clientX, event.clientY + 25, "Maximize");
	                            break;
	        case "btnClose" :
	                            window.system.showHint(event.clientX, event.clientY + 25, "Close");
	                            break;
	    }
	},
	doActivate: function(){
		window.control_imageLoader.prototype.parent.doActivate.call(this);     
	},
	doDeactivate: function(){
		window.control_imageLoader.prototype.parent.doDeactivate.call(this);
    },
	getCaption: function(){
		return this.caption;
	},
	setCaption: function(data){
	    if (this.caption != data)
	        this.caption = data;                   
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
		window.control_imageLoader.prototype.parent.close.call(this);	
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
	}
});
