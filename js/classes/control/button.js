//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_button = function(owner,options){
    if (owner)
    {
		this.withImage = false;
		this.color = "#AE1B1A";//"#3BA4FF";//62b4c3 "#f6b354";
		this.borderColor = "#888888";//33b5e5//417983"#d98815";
		this.fontColor = "#ffffff";//system.getConfig("form.button.fontColor");
		this.hoverColor = "#3BA4FF";
		this.boxShadow = "0px 0px 10px #888";
        window.control_button.prototype.parent.constructor.call(this, owner, options);
        this.className = "control_button";	
		this.owner = owner;				
        this.setWidth(73);
        this.setHeight(20);	
        this.mode = 1;
        this.caption = "Button";
		this.glyph = "";
		this.icon = "";
        this.onClick = new control_eventHandler();
        this.onMouseOver = new control_eventHandler();
        this.onMouseOut = new control_eventHandler();
        this.onMouseDown = new control_eventHandler();
        this.onMouseMove = new control_eventHandler();
		this.hint = "Button";
		this.showHint = false;		
		this.tabStop = true;
		this.enable = true;
		if (options !== undefined){				
			this.updateByOptions(options);
			if (options.caption) this.setCaption(options.caption);
			if (options.color) this.setColor(options.color);				
			if (options.borderColor) this.setBorderColor(options.borderColor);	
			if (options.hoverColor) this.setHoverColor(options.hoverColor);			
			if (options.fontColor) this.setFontColor(options.fontColor);				
			if (options.withImage) this.setWithImage(options.withImage);
			if (options.icon) this.setIcon(options.icon);				
			if (options.enable) this.setEnabled(options.enable);	
			if (options.showHint) this.setShowHint(options.showHint);	
			if (options.mouseMove) this.onMouseMove.set(options.mouseMove[0],options.mouseMove[1]);
			if (options.mouseOver) this.onMouseOver.set(options.mouseOver[0],options.mouseOver[1]);
			if (options.mouseOut) this.onMouseOut.set(options.mouseOut[0], options.mouseOut[1]);
			if (options.boxShadow) this.setBoxShadow(options.boxShadow);
			if (options.click) {
                if (typeof options.click == "string")
                    this.onClick.set(this.getTargetClass(),options.click);
                else if (this.onClick.isFunction(options.click))
					this.onClick.set(undefined, options.click);
                else 
					this.onClick.set(options.click[0],options.click[1]);
            }
		}
    }
};
window.control_button.extend(window.control_control);
window.button = window.control_button;
//---------------------------- Function ----------------------------------------
window.control_button.implement({
	doDraw: function(canvas){
		try{	    			
			canvas.css({border : "1px solid "+this.borderColor, cursor : "pointer", background:this.color,overflow:"hidden" , borderRadius:"5px"});			
		    var n = this.getFullId();    		
		    var html = "<table border=0 cellpadding=0 cellspacing=0 height='100%' width='100%'>"+
						"<tr><td id='"+ n +"_tdicon' halign='middle' style='padding-left:5px'><img id='" + n + "_icon' style='left:10px;width: 14px; height : 16px;cursor: pointer' /></td>" +
					    "<td id='"+ n +"_captionContainer' align='center' halign='middle' ><span id='" + n + "_caption' style='overflow:hidden;font-size:12;cursor:pointer;color:"+this.fontColor+"' >Button</span></tr></table>" +
					"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7;display: none; position: absolute; left: -1; top:-1; width: 103%; height: 115%;cursor:default}' ></div>";	    
			this.setInnerHTML(html, canvas);
			canvas.bind("mouseover", {resourceId:this.resourceId}, function(event){
				$$$(event.data.resourceId).eventMouseOver(event);
			} );
			canvas.bind("mouseenter",setEvent("$$$(" + this.resourceId + ").eventMouseMove(event);"));
			canvas.bind("mouseout",setEvent("$$$(" + this.resourceId + ").eventMouseOut(event);"));
			canvas.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClick(event);") );
			canvas.bind("mousedown",setEvent("$$$(" + this.resourceId + ").eventMouseDown(event);"));
					
			this.canvas = canvas;
			this.captionFrame = $("#"+n+"_caption");
			this.iconFrame = $("#"+n+"_icon");					
			this.iconFrame.hide();
		}catch(e){
			systemAPI.alert(this+"$doDraw()",e);
		}
	},
	eventMouseOver: function(event){		
		this.canvas.css({border:"1px solid "+this.borderColor, "font-weight": "bold", background:this.hoverColor, boxShadow:"0px 0px 20px "+this.hoverColor});
		this.onMouseOver.call(this);
	},
	eventMouseOut: function(event){	    	    
		this.canvas.css({border:"1px solid "+this.borderColor, "font-weight": "normal", background:this.color, boxShadow: ""});
		this.onMouseOut.call(this);
		window.system.hideHint();
	},
	eventMouseDown: function(event){
		this.getForm().setActiveControl(this);
		this.onMouseDown.call(this);
	},
	setBoxShadow: function(boxShadow){
		this.boxShadow = boxShadow;
		this.canvas.css({boxShadow : boxShadow});
	},
	setColor: function(data){
		try{
			this.color = data;		
			this.canvas.css({background:data});
		}catch(e){
			systemAPI.alert(e);
		}
	},
	setBorderColor: function(data){
		try{
			this.borderColor = data;			
			this.canvas.css({border : "1px solid " +data });
		}catch(e){
			systemAPI.alert(e);
		}
	},
	eventMouseClick: function(event){				
	    this.onClick.call(this);		
	},
	doKeyUp: function(keyCode, buttonState){	
	},
	doElKeyDown: function(event){	
	},
	doKeyDown: function(charCode, buttonState, keyCode){				
		if (keyCode == 13)
		{
			this.setFocus();		
			this.onClick.call(this);
            this.owner.nextCtrl(this);			
		}else if (keyCode == 9){				
			this.owner.nextCtrl(this);
		}else if (keyCode == 27){				
		    this.setFocus();
			this.owner.prevCtrl(this);
		}
		return false;
	},
	doSetFocus: function(){		
		this.canvas.css({border : "1px solid "+ this.borderColor});
	},
	doLostFocus: function(){
		this.canvas.css({border : "1px solid "+ this.borderColor });
	},
	getMode: function(){
		return this.mode;
	},
	setMode: function(mode){	    
	},
	doThemesChange: function(themeName){		
	},	
	setHeight: function(data){	
		try{
            //if (data == 20) data = document.all ? 20 : 18;
    		window.control_button.prototype.parent.setHeight.call(this, data);    		
		}catch(e){
		  systemAPI.alert(this+"$setHeight("+this.name+")",e);
        }            
	},
	getCaption: function(){
		return this.caption;
	},
	setCaption: function(data){
	    if (this.caption != data)
	    {
	        this.caption = data;
			if (this.captionFrame != undefined)				
				this.captionFrame.html( "&nbsp;"+data );				
			else {
				var node = $("#"+this.getFullId() + "_caption");
				if (node != undefined && node !== null) node.html("&nbsp;"+data);					
			}			
	    }
	},
	setIcon: function(data){
		try{
			if (trim(data) != ""){
				if (data.substr(0,2) == "<i"){
					this.iconFrame.hide();
					$("#"+this.getFullId()+"_captionContainer").attr("align","left");
					$("#"+this.getFullId()+"_tdicon").html(data);
				}else{
					this.iconFrame.show();
					this.icon = data;
					$("#"+this.getFullId()+"_captionContainer").attr("align","left");
					if (this.iconFrame != undefined)
						this.iconFrame.attr("src", this.icon);
					else {
						var node = $("#"+this.getFullId() +"_icon");
						if (node != undefined) node.attr("src", this.icon);
						this.iconFrame = node;
					}	
					var node = $("#"+this.getFullId() +"_caption");
					//node.css({left:"25px", "text-align": "left"});
					if ($.browser.msie && systemAPI.browser.version == 6){				
						DD_belatedPNG.fixPng(this.iconFrame);
					}
				}
				
			}else{
				this.iconFrame.hide();
				this.captionFrame.html( this.caption );
			}
		}catch(e){
			alert(e);
		}
	},
	setGlyph: function(data){
		this.glyph = data;
		var node = $("#"+this.getFullId()+"_icon");
		node.css({background : data+" 0 0 no-repeat " });
	},
	getGlyph: function(){
		return his.glyph;
	},
	eventMouseMove: function(event){
		if (this.showHint)
			window.system.showHint(this.canvas.offset().left + 20, this.canvas.offset().top - 40, this.hint,this.canvas);
        this.onMouseMove.call(this);
	},
	setShowHint: function(data){
		this.showHint = false;
	},
	getShowHint: function(){
		return this.showHint;
	},
	setEnabled: function(data){
		this.enable = data;
		$("#"+this.getFullId() + "_block").toggle();	
	},
	setWithImage: function(data){
		this.withImage = data;
		this.iconFrame.hide();
	},
	click: function(){
		this.onClick.call(this); 
		this.emit("click");
	},
	setFontColor: function(data){
		this.fontColor = data;
		this.captionFrame.css({color : data });
 	},
 	setHoverColor : function(color){
 		this.hoverColor = color;
 	}
});
