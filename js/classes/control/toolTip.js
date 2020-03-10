//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_toolTip = function(owner){
    if (owner){
        window.control_toolTip.prototype.parent.constructor.call(this, owner);
		window.control_toolTip.prototype.parent.setWidth.call(this,200);				
		this.className = "control_toolTip";
		this.timer = new control_timer(this);
		this.timer.setInterval(6000);
		this.timer.onTimer.set(this, "timerTimer");
		this.caption = undefined;
    }
};
window.control_toolTip.extend(window.control_commonForm);
window.toolTip = window.control_toolTip;
window.control_toolTip.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    var r = this.resourceId;
	    canvas.style.left = 200;
	    canvas.style.top = 200;
		canvas.style.width = "200px";
		canvas.style.height = "auto";
	    canvas.style.display = "none";
	    canvas.style.zIndex = "999999";		
		canvas.style.height = "auto";		   
	    var html = "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
	                    "<div id='" + n + "_sLeftTop' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowLeftTop.png) top left no-repeat; position: absolute; left: -8; top: 0; width: 8; height: 8}' ></div>" +
	                    "<div style='{position: absolute; left: -8; top: 0; width: 8; height: 100%; overflow: hidden;}' >" +
	                        "<div id='" + n + "_sLeft' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowLeft.png) top left repeat-y; position: absolute; left: 0; top: 8; width: 100%; height: 100%}' ></div>" +
	                    "</div>" +
	                    "<div id='" + n + "_sEdgeLeft' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowEdgeLeft.png) top left no-repeat; position: absolute; left: -8; top: 100%; width: 8; height: 12}' ></div>" +
	                    "<div id='" + n + "_sBottomLeft' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowBottomLeft.png) top left no-repeat; position: absolute; left: 0; top: 100%; width: 8; height: 12}' ></div>" +
	                    "<div id='" + n + "_sRightTop' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowRightTop.png) top left no-repeat; position: absolute; left: 100%; top: 0; width: 8; height: 8}' ></div>" +
	                    "<div style='{position: absolute; left: 100%; top: 0; width: 8; height: 100%; overflow: hidden;}' >" +
	                        "<div id='" + n + "_sRight' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowRight.png) top left repeat-y; position: absolute; left: 0; top: 8; width: 100%; height: 100%}' ></div>" +
	                    "</div>" +
	                    "<div id='" + n + "_sEdgeRight' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowEdgeRight.png) top left no-repeat; position: absolute; left: 100%; top: 100%; width: 8; height: 12}' ></div>" +
	                    "<div style='{position: absolute; left: -8; top: 100%; width: 100%; height: 12;}' >" +
	                        "<div id='" + n + "_sBottomRight' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowBottomRight.png) top left no-repeat; position: absolute; left: 100%; top: 0; width: 8; height: 12}' ></div>" +
	                    "</div>" +
	                    "<div style='{position: absolute; left: -8; top: 100%; width: 100%; height: 12; overflow: hidden;}' >" +
	                        "<div id='" + n + "_sBottom' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowBottom.png) top left repeat-x; position: absolute; left: 16; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "</div>" +
	                   "<div style='{background: url(image/themes/"+system.getThemes()+"/menuBg.png) top left; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +					
	                    "<div id='" + n + "_bg' style='{background: url(image/themes/"+system.getThemes()+"/menuBg.png) top left; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_left' style='{background: url(image/themes/"+system.getThemes()+"/menuLeft.png) top left repeat-y; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_right' style='{background: url(image/themes/"+system.getThemes()+"/menuRight.png) top right repeat-y; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_top' style='{background: url(image/themes/"+system.getThemes()+"/menuTop.png) top left repeat-x; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_bottom' style='{background: url(image/themes/"+system.getThemes()+"/menuBottom.png) bottom left repeat-x; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_topLeft' style='{background: url(image/themes/"+system.getThemes()+"/menuTopLeft.png) top left no-repeat; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_topRight' style='{background: url(image/themes/"+system.getThemes()+"/menuTopRight.png) top right no-repeat; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_bottomLeft' style='{background: url(image/themes/"+system.getThemes()+"/menuBottomLeft.png) bottom left no-repeat; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_bottomRight' style='{background: url(image/themes/"+system.getThemes()+"/menuBottomRight.png) bottom right no-repeat; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "<div id='" + n + "_frame' style='{position : relative; left: 0; top: 0; width: 100%; height: 100%;}'>"+
						"<div id='" + n + "_caption' style='{position:absolute;margin:5px 5px 5px 5px;left:0;top:0;width:190;height:auto;}'>hint</div></div>" +
						"<div id='" + n + "_pointDown' style='{display:;background: url(image/themes/"+system.getThemes()+"/framePointDown.png) bottom left no-repeat; position: absolute; left: 0; top: 0; width: 100%; height: 15}' ></div>" +
						"<div id='" + n + "_pointUp' style='{display:;background: url(image/themes/"+system.getThemes()+"/framePointUp.png) top left no-repeat; position: absolute; left: 0; top: -15; width: 100%; height: 15}' ></div>" +
	                "</div>";	    
	    this.setInnerHTML(html, canvas);
		if (systemAPI.browser.msie && systemAPI.browser.version == 6){
			var b1 = $( n +"_sLeftTop");
			var b2 = $( n +"_sLeft");
			var b3 = $( n +"_sEdgeLeft");
			var b4 = $( n +"_sBottomLeft");
			var b5 = $( n +"_sRightTop");
			var b6 = $( n +"_sRight");
			var b7 = $( n +"_sEdgeRight");
			var b8 = $( n +"_sBottomRight");
			var b9 = $( n +"_sBottom");		
			var b10 = $( n +"_pointUp");		
			DD_belatedPNG.fixPngArray([b1,b2,b3,b4,b5,b6,b7,b8,b9]);
			DD_belatedPNG.fixPng(b10);
		}
	},
	show: function(x, y, caption, pointMode){		   
	    if (caption != this.caption){
	        this.caption = caption;    
	        this.timer.setEnabled(false);    	
	        var n = this.getFullId();		
	        var node = $(n + "_caption");
	        node.innerHTML = caption;  
	        this.setVisible(true);
	        var width = this.width;//node.offsetWidth;
	        var height = node.offsetHeight + 1;
	        this.setHeight(height+10);  
	        var x1 =x;y1=y;
			if (x + (width) > system.screenWidth) x = system.screenWidth - width;
			if (y + 20 > system.screenHeight) y = y - 20;
		    
		    this.setLeft(x);
		    this.setTop(y);
			
			this.timer.setEnabled(true);
			if (pointMode == undefined)
		        pointMode = 0;
		        
		    switch (pointMode)
		    {
		        case 0 :
		                var node = $(this.getFullId() + "_pointDown");
		                if (node != undefined)
		                    node.style.display = "none";
		                var node = $(this.getFullId() + "_pointUp");
		                if (node != undefined)
		                    node.style.display = "none";    
		                //this.setLeft(x);
		                //this.setTop(y);
		                break;
		        case 1 :
						var node = $(this.getFullId() + "_pointDown");	                
		                if (node != undefined)
		                    node.style.display = "none";
		                var node = $(this.getFullId() + "_pointUp");					
		                if (node != undefined){
		                    node.style.display = ""; 						
							node.style.left = 10;						
						}	
		                //this.setLeft(x - 24);
		                //this.setTop(y + this.getHeight());
		                break;
		        case 2 : 
		                var node = $(this.getFullId() + "_pointDown");
		                
		                if (node != undefined){
		                    node.style.display = "";
							node.style.left = (x1 - x);						
						}
		                var node = $(this.getFullId() + "_pointUp");
		                if (node != undefined)
		                    node.style.display = "none";    
		                //this.setLeft(x - 24);
		                //this.setTop(y + this.getHeight());
		                break;
		    }
	    }
	    else
	    {
			var width = this.width;//node.offsetWidth;
	        var height = this.height;//node.offsetHeight + 1;
	        var x1 =x;y1=y;
			if (x + (width) > system.screenWidth) x = system.screenWidth - width;
			if (y + 20 > system.screenHeight) y = y - 20;
		    
		    this.setLeft(x);
		    this.setTop(y);
			this.setVisible(true);
	    }
	},
	timerTimer: function(sender){
	    this.timer.setEnabled(false);
	    this.hide();
	},
	bringToFront: function(){
	}
});
