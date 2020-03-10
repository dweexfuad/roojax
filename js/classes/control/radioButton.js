//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_radioButton = function(owner, options){
    if (owner){
        window.control_radioButton.prototype.parent.constructor.call(this, owner, options);
        this.className = "control_radioButton";
        window.control_radioButton.prototype.parent.setWidth.call(this, 13);
        window.control_radioButton.prototype.parent.setHeight.call(this, 13);
        this.selected = false;
        this.tabStop = true;
        this.onChange = new control_eventHandler();
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.color) this.setColor(options.color);									
			if (options.selected) this.setSelected(options.selected);
			if (options.caption) this.setCaption(options.caption);
			if (options.change) {
                if (typeof options.change == "string")
                    this.onChange.set(this.getTargetClass(),options.change);
                else this.onChange.set(options.change[0],options.change[1]);
            }
		}
    }
};
window.control_radioButton.extend(window.control_control);
window.radioButton = window.control_radioButton;
window.control_radioButton.implement({
	doDraw: function(canvas){
	    canvas.css({ "background" : "url(image/themes/"+system.getThemes()+"/radioButton.png) 0 0 no-repeat" });
	    var n = this.getFullId();

	    var html = "<div id='" + n + "_frame' style='{cursor: pointer;position: absolute; left: 0; top: 0; width: 100%; height: 100%}' " +
	                    "onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
	                    "onMouseOut ='window.system.getResource(" + this.resourceId + ").eventMouseOut(event);' " +
	                    "onMouseDown ='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' " +
	                    "onMouseUp ='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
	                    "onClick ='window.system.getResource(" + this.resourceId + ").eventMouseClick(event);' " +
	                    "onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove(event);' " +
	                    ">"+
						"<div id='" + n + "_caption' style='{position : absolute; left: 14; top:0; width:100%; height:100%; }'>"+
						"<nobr> Radiobutton </nobr></div>"
						+"</div>";
	    this.setInnerHTML(html, canvas);
	},
	doThemesChange: function(themeName){
	    var canvas = this.getCanvas();

	    if (this.selected)
	        canvas.css({"background" : "url(image/themes/"+system.getThemes()+"/radioButton.png) -13 0 no-repeat" });
	    else
	        canvas.css({"background" : "url(image/themes/"+system.getThemes()+"/radioButton.png) 0 0 no-repeat" });
	},
	eventMouseOver: function(event){
	    var canvas = this.getCanvas();

	    if (this.selected)
	        canvas.css({"background-position" : "-13 -13" });
	    else
	        canvas.css({"background-position" : "0-13" });
	},
	eventMouseOut: function(event){
	    var canvas = this.getCanvas();
	    if (this.selected)
	        canvas.css({"background-position" : "-13 0" });
	    else
	        canvas.css({"background-position" : "0 0" });
	},
	eventMouseDown: function(event){
	    var canvas = this.getCanvas();
	    if (this.selected)
	        canvas.css({"background-position" : "-13 -26" });
	    else
	        canvas.css({"background-position" : "0 -26" });
	},
	eventMouseClick: function(event){
	    if (!this.selected){
	        this.synchronize();
	        this.selected = true;
	        this.eventMouseOver(event);
	        this.onChange.call(this, this.selected);
	    }
	    else
	        this.eventMouseOver(event);
	},
	synchronize: function(){
	    if (this.owner != undefined){
	        var control = undefined;	       
	        for (var i in this.owner.childs.objList)
	        {
	            control = $$$(this.owner.childs.objList[i]);
	            
	            if (control instanceof control_radioButton)
	            {
	                if (control != this)
	                    control.synchDeselect();
	            }
	        }
	    }
	},
	synchDeselect: function(){
	    if (this.selected){
	        this.selected = false;
	        this.eventMouseOut(undefined);
	        this.onChange.call(this, this.selected);
	    }
	},
	doAfterLoad: function(){
	    window.control_radioButton.prototype.parent.doAfterLoad.call(this);
	    this.loading = true;
	    this.setSelected(this.selected);
	    this.loading = false;
	},
	isSelected: function(){
		return this.selected;
	},
	setSelected: function(data){
	    if ((this.selected != data) || this.loading){
	        this.selected = data;
	        var canvas = this.getCanvas();
	        
	        if (this.selected)
	        {
	            this.synchronize();	            
				canvas.css({"background-position" : "-13 0" });
			}else
				canvas.css({"background-position" : "0 0" });
	        
	        this.onChange.call(this, this.selected);
	    }
	},
	setWidth: function(data){		
		var node = $("#"+this.getFullId() +"_caption");
		if (node != undefined)
			node.css({width : data });
	},
	setHeight: function(data){
	},
	setCaption: function(data){
		this.caption = data;		
		var node = $("#"+this.getFullId() +"_caption");
		if (node != undefined)
			node.html(data);
	},
	getCaption: function(){
		return this.caption;
	},
	setFocus: function(){
	    window.control_radioButton.prototype.parent.setFocus.call(this);
	    this.getCanvas().css({ border : "1px dotted #999999" });
    },
    doLostFocus: function(){
	    window.control_radioButton.prototype.parent.doLostFocus.call(this);
	    this.getCanvas().css({ border : "" });
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
