//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at												
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_label= function(owner, options){
	try{
		if (owner){
			uses("control_font");
			this.fnt = new control_font();			
			window.control_label.prototype.parent.constructor.call(this, owner, options);
			window.control_label.prototype.parent.setHeight.call(this, 20);
			this.className = "control_label";
			this.caption = "Label";
			this.align = 1;			
			this.fnt.onChange.set(this, "fontChange");
			this.color = "#000000";
			this.underLine = false;
			this.onClick = new control_eventHandler();
			this.autoWidth = false;
			if (options !== undefined){
				this.updateByOptions(options);
				if (options.fontSize) this.fnt.setSize(options.fontSize);
				if (options.fontColor) this.fnt.setColor(options.fontColor);				
				
				if (options.caption) this.setCaption(options.caption);						
				if (options.color) this.setColor(options.color);				
				if (options.underline) this.setUnderLine(options.underline);
				if (options.autoWidth) this.setAutoWidth(options.autoWidth);
				if (options.click) {
                    if (typeof options.click == "string")
                        this.onClick.set(this.getTargetClass(),options.click);
                    else this.onClick.set(options.click[0],options.click[1]);	
                }
				if (options.bold) this.fnt.setBold(options.bold);	
				if (options.italics) this.fnt.setItalics(options.italics);	
				if (options.alignment) this.setAlignment(options.alignment);
			}
		}
	}catch(e)
	{
		alert("[label]::create:"+e);
	}
};
window.control_label.extend(window.control_control);
window.label = window.control_label;
//---------------------------- Function ----------------------------------------
window.control_label.implement({
	doDraw: function(canvas){
	    //canvas.style.overflow = "hidden";
	    var n = this.getFullId();		
	    var html =  "<span id='" + n + "_caption' style='{width:100%;height:100%;position:absolute;left:0,top:0}'"+
						" onClick = 'window.system.getResource("+this.resourceId+").doclick(event);'"+
						">Label</span>" +
	                "<div id='" + n + "_frame' style='{background: url(image/themes/"+system.getThemes()+"/dot.png) bottom left repeat-x; position: absolute; left: 0; top: 0; width: 100%; height: 100%;display:none}' "+	
					" onClick='window.system.getResource("+this.resourceId+").doclick(event);'"+
					"></div>";
	                    
	    this.setInnerHTML(html, canvas);
	    this.fnt.apply(canvas.get(0));		
	    this.captionCanvas = $("#"+n + "_caption"); 
	},	
	fontChange: function(sender){
	    var n = this.getFullId();
	    var node =  $("#"+n + "_caption").get(0);    
		this.fnt.apply(node);
	},
	doclick: function(sender){	
		this.onClick.call(this);
	},
	getAlign: function(){
		return this.align;
	},
	setAlign: function(data){
	    if ((this.data != data) && (data >= 1) && (data <= 3)){
	        this.align = data;	        
	        this.captionCanvas.css({'text-align' : data });
	    }
	},
	getCaption: function(){
		return this.caption;
	},
	getCaptionRect: function(){	
		return {width:parseFloat(this.captionCanvas.width()), height:parseFloat(this.captionCanvas.height())};
	},
	setCaption: function(data){
	    if (this.caption != data){	        
			this.caption = trim(data);	        	        
			this.captionCanvas.html(trim(data) );		
			if (this.autoWidth){
			  this.setWidth(parseInt(this.captionCanvas.width()));
			}
		}	
	},
	setColor: function(data){
		this.captionCanvas.css({color : data }); 
	},
	setUnderLine: function(data){
		this.underLine = data;
		var cnv = $("#"+this.getFullId() +"_frame");
		if ((this.underLine) && (cnv != undefined))
			cnv.show();
		else cnv.hide(); 
	},
	setLineText: function(data){	
		var node = $("#"+this.getFullId() + "_caption");	
		if (node != undefined){
			if (data || data == undefined)
				node.css({borderBottom : "1px solid #0000ff" });
			else node.css({borderBottom : ""});
		}		
	},
	setWidth: function(data){
		window.control_label.prototype.parent.setWidth.call(this, data);
		//var node =  $(this.getFullId() + "_caption");	
		//if (node != undefined)
		//	node.style.width=data;
	},
	setAutoWidth: function(data){
		this.autoWidth = data;
	},
	setAlignment: function(data){
	   this.captionCanvas.css({'text-align' : data });
    }
});
