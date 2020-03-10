//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_hintFrame = function(owner){
    if (owner)
    {
        window.control_hintFrame.prototype.parent.constructor.call(this, owner);
		this.className = "control_hintFrame";		
		this.timer = new control_timer(this);
		this.timer.setInterval(3000);
		this.timer.onTimer.set(this, "timerTimer");		
		this.caption = undefined;
    }
};
window.control_hintFrame.extend(window.control_commonForm);
window.hintFrame = window.control_hintFrame;
//---------------------------- Function ----------------------------------------
window.control_hintFrame.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    var r = this.resourceId;
	    canvas.style.left = 200;
	    canvas.style.top = 200;
	    canvas.style.display = "none";
	    canvas.style.zIndex = "999999";
	    canvas.style.overflow = "visible";	
		canvas.style.border = "1px solid #ffffff";
	    var html =      "<div id='" + n + "_bg' style='{background:#d2e0ff;filter:alpha(opacity:50);opacity:0.5;moz-opacity:0.5;position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_left' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_right' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_top' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_bottom' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_topLeft' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_topRight' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_bottomLeft' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_bottomRight' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_frame' style='{position : relative; left: 0; top: 0; width: 100%; height: 100%;}'>"+
						"<span id='" + n + "_caption'><nobr>Hint</nobr></span></div>";	    
	    this.setInnerHTML(html, canvas);
	},
	show: function(x, y, caption){    
	    if (caption != this.caption)
	    {
	        this.caption = caption;	   
	        this.timer.setEnabled(false);	    	
	        var n = this.getFullId();			
	        var node = $(n + "_caption");
	        var pos = caption.indexOf("\r\n");
	        while (pos > 0)
	        {
	            caption = caption.replace("\r\n", "&nbsp;</nobr><br><nobr>&nbsp;");
	            pos = caption.indexOf("\r\n");
	        }	        
	        node.innerHTML = "<nobr>&nbsp;" + caption + "&nbsp;</nobr>";	        
	        this.setVisible(true);
	        var width = node.offsetWidth;
	        var height = node.offsetHeight + 1;
	        var width = node.offsetWidth;
	        var height = node.offsetHeight + 1;
	        this.setWidth(width);
	        this.setHeight(height);    	        	    
		    this.setLeft(x);
		    this.setTop(y);	    	
	        this.timer.setEnabled(true);
	    }
	    else
	    {
	        this.timer.setEnabled(false);
	        this.setVisible(true);
	        this.timer.setEnabled(true);
	    }
	},
	timerTimer: function(sender){
		this.timer.setEnabled(false);
		this.hide();
	},
	bringToFront: function(){
	}
});
