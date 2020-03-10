//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_progressbar = function(owner){
    if (owner){
		this.withImage = false;
		this.color = system.getConfig("form.button.color");
        window.control_progressbar.prototype.parent.constructor.call(this, owner);
        this.className = "control_progressbar";	
		this.owner = owner;
				
        window.control_progressbar.prototype.parent.setWidth.call(this, 73);
        window.control_progressbar.prototype.parent.setHeight.call(this, 18);
		
        this.mode = 1;
        this.caption = "Button";
		this.glyph = "";
		this.icon = "";
        this.onClick = new control_eventHandler();
		this.hint = "Button";
		this.showHint = false;		
		this.tabStop = true;
		this.enabled = true;
    }
};
window.control_progressbar.extend(window.control_control);
window.progressbar = window.control_progressbar;
window.control_progressbar.implement({
	doDraw: function(canvas){	
	    canvas.style.background ="";	
	    var n = this.getFullId();    
	    var html = "<div id='" + n + "_frame' style='{position: absolute; left: 0; top: 0; width: 100%; height: 16; cursor: pointer}' " +
	                    "onClick='window.system.getResource(" + this.resourceId + ").eventMouseClick(event);' " +
	                    ">"+
					"<div style='{border:1px solid #ffff00;background:#cccccc;position:absolute;left:0;top:0;height:5;width:100%;filter:alpha(opacity:0.7);opacity:0.7;moz-opacity:0.7}'>"+
						"<div id='"+ n +"_progress' style='{position:absolute;top:0;left:0;height:100%;width:0;background:url(image/progress.png)repeat-x;}'></div>"+
					"</div>"+
					"<div id='"+ n +"_text' style='{position:absolute;left:0;top:8;width:100%;}'>Loading....</div>"+
				"</div>";
	    this.setInnerHTML(html, canvas);
		this.canvas = canvas;
		this.progress = $(n+"_progress");	
		this.text = $(n+"_text");		
	},
	setProgress: function(data,status){
		this.progress.style.width = data+"%";
		this.text.innerHTML = status;
	}
});
