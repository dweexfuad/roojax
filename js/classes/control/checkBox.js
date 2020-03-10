//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_checkBox = function(owner,options){
    if (owner)
    {
        window.control_checkBox.prototype.parent.constructor.call(this, owner,options);
        this.className = "control_checkBox";
        window.control_checkBox.prototype.parent.setWidth.call(this, 13);
        window.control_checkBox.prototype.parent.setHeight.call(this, 13);        
        this.selected = false;
		this.checked = false;        
        this.onChange = new control_eventHandler();        
    	this.onClick = new control_eventHandler();
		this.showHint = false;
		this.tabStop = true;
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.caption!== undefined) this.setCaption(options.caption);						
			if (options.color !== undefined) this.setColor(options.color);				
			if (options.selected !== undefined) this.setSelected(options.selected);
			if (options.checked !== undefined) this.setSelected(options.checked);						
			if (options.eventChange !== undefined) this.onChange.set(options.eventChange[0],options.eventChange[1]);				
			if (options.change !== undefined) this.onChange.set(options.change[0],options.change[1]);				
			if (options.click !== undefined){
                if (typeof options.click == "string")
                    this.onClick.set(this.getTargetClass(),options.click);
                else this.onClick.set(options.click[0],options.click[1]);	
            }
		}
    }
};
window.control_checkBox.extend(window.control_control);
window.checkBox = window.control_checkBox;
//---------------------------- Function ----------------------------------------
window.control_checkBox.implement({
	doDraw: function(canvas){	    
	    var n = this.getFullId();
	    var html = "<div id='" + n + "_frame' style='{zIndex:2;cursor: pointer; position: absolute; left: 0; top: 0; width: auto; height: 100%}' " +
	                    "onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
	                    "onMouseOut ='window.system.getResource(" + this.resourceId + ").eventMouseOut(event);' " +
	                    "onMouseDown ='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' " +
	                    "onMouseUp ='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +                    
	                    "onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove(event);' " +
	                    "onClick ='window.system.getResource(" + this.resourceId + ").eventMouseClick(event);' " +
	                    ">"+
						"<div id='" + n + "_icon' style='{background-image:url(image/themes/"+system.getThemes()+"/checkBox.png);position : absolute; left: 0; top:3; width:13; height:"+(document.all ? 11:13)+"; }'></div>"+					
						"<div id='" + n + "_caption' style='{position : absolute; left: 14; top:4; width:auto; height:14; }'>"+					
						"<nobr id='"+ n +"_nobr' > checkbox </nobr></div>"+
					"</div>"+
					"<div id='" + n + "_block' style='{zIndex:3;background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>";
	    
	    this.setInnerHTML(html, canvas);
		this.block = $("#"+n+"_block");
		this.iconFrame = $("#"+n+"_icon");
		
	},
	doThemesChange: function(themeName){	    
	    if (this.selected)
	        this.iconFrame.css({background : "url(image/themes/"+themeName+"/checkBox.png) -13px 0px no-repeat" });
	    else
	        this.iconFrame.css({background : "url(image/themes/"+themeName+"/checkBox.png) 0px 0px no-repeat" });
	},
	eventMouseOver: function(event){	    
	    if (this.selected)
	        this.iconFrame.css({backgroundPosition : "-13px -13px" });
	    else
	        this.iconFrame.css({backgroundPosition : "0px -13px" });
	},
	eventMouseOut: function(event){    	  
	    if (this.selected)
	        this.iconFrame.css({backgroundPosition : "-13px 0px" });
	    else
	        this.iconFrame.css({backgroundPosition : "0px 0px" });
	},
	eventMouseDown: function(event){	    
	    if (this.selected)
	        this.iconFrame.css({backgroundPosition : "-13px -26px" });
	    else
	        this.iconFrame.css({backgroundPosition : "0px -26px" });
		try{
		    this.selected = !this.selected;		    
		    this.onChange.call(this, this.selected);
            this.setFocus();		                
		}catch(e){
			alert(e)	
		}
	},
	eventMouseClick: function(event){
		this.onClick.call(this);
	},
	setEnabled: function(data){
		this.enabled = data;
		if (data)
			this.block.hide();
		else this.block.show();
	},
	doAfterLoad: function(){
	    window.control_checkBox.prototype.parent.doAfterLoad.call(this);
	    this.loading = true;
	    this.setSelected(this.selected);
	    this.loading = false;
	},
	isSelected: function(){
		return this.selected;
	},
	isChecked: function(){
		return this.selected;
	},
	setSelected: function(data){
	    if ((this.selected != data) || this.loading)
	    {
	        this.selected = data;	        
	        if (this.selected)
	            this.iconFrame.css({backgroundPosition : "-13px 0px" });
	        else
	            this.iconFrame.css({backgroundPosition : "0px 0px" });
	        this.onChange.call(this, this.selected);
	    }
		this.checked = this.selected;
	},
	setWidth: function(data){		
		window.control_checkBox.prototype.parent.setWidth.call(this,data);
		var node = $("#"+this.getFullId() +"_caption");
		if (node !== undefined)
			node.css({width : data });
		this.block.css({ width : data });
	},
	setHeight: function(data){
		window.control_checkBox.prototype.parent.setHeight.call(this,data);
	},
	setCaption: function(data){
		this.caption = data;	
		var node = $("#"+this.getFullId() +"_caption");
		if (node != undefined)
			node.html( data );
	},
	setFocus: function(){
	    window.control_checkBox.prototype.parent.setFocus.call(this);
	    this.getCanvas().css({border : "1px dotted #999999" });
    },
    doLostFocus: function(){
	    window.control_checkBox.prototype.parent.doLostFocus.call(this);
	    this.getCanvas().css ({ border : "" });
    },
	getCaption: function(){
		return this.caption;
	},
	doKeyDown: function(charCode, buttonState, keyCode){
	   if (keyCode == 13){		
			this.setFocus();		
			this.owner.nextCtrl(this);
		}else if (keyCode == 32){		
			this.setFocus();		
			this.setSelected(!this.selected);						
		}else if (keyCode == 9)
			this.owner.nextCtrl(this);	
		else if (keyCode == 27)
			this.owner.prevCtrl(this);
		return false;
    }
});
