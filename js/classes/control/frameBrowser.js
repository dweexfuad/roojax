//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_frameBrowser = function(owner){
	if (owner){
		window.control_frameBrowser.prototype.parent.constructor.call(this, owner);
		this.className = "control_frameBrowser";		
	}	
};
window.control_frameBrowser.extend(window.control_commonForm);
window.frameBrowser = window.control_frameBrowser;
window.control_frameBrowser.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		canvas.css({background : system.getConfig("app.color.grid") ,
				border : system.getConfig("nonborder.inner.right") });
		var html = "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background-color:"+system.getConfig("form.color")+";}' " +
	                    "onMouseDown ='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseUp(event);'>" +
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
	                    "</div>" +
						"<div id='"+n+"_close' style='{position:absolute;left;-5;top:2;width:25;height:18;background:url(image/themes/"+system.getThemes()+"/formClose.png) top left no-repeat;background-color:#567890;cursor:pointer}'"+
							"onClick='window.system.getResource(" + this.resourceId + ").eventButtonMouseClick(event);' " +
							"onMouseOver='window.system.getResource(" + this.resourceId + ").eventButtonMouseOver(event);' " +
						"></div>"+
						"<iframe id='"+ n +"_container' frameborder='0' style='{position:absolute;left:10; top:20; width:100%; height:100%;overflow:auto;}'> </iframe>"+
						"<div id='"+ n +"_html' style='{position:absolute;left:10; top:20; width:100%; height:100%;overflow:auto;}'> </div>";
		this.setInnerHTML(html, canvas);
	},
	setHtml: function(html){
		var cnv = $("#"+this.getFullId() +"_container");	
		cnv.hide();
		
		var cnv = $("#"+this.getFullId() +"_html");	
		cnv.html( html );
		cnv.show();
		
	},
	setAddress: function(address){
		var cnv = $("#"+this.getFullId() +"_container");
		cnv.src = address;
		cnv.show();
		cnv = $("#"+this.getFullId() +"_html");	
		cnv.hide();
	},
	setWidth: function(data){
		window.control_frameBrowser.prototype.parent.setWidth.call(this, data);
		$("#"+this.getFullId() +"_container").css({ width : data - 20 });	
		$("#"+this.getFullId() +"_close").css({ left : data - 25 });
		$("#"+this.getFullId() +"_html").css({ width : data - 20 });
	},
	setHeight: function(data){
		try{			
			window.control_frameBrowser.prototype.parent.setHeight.call(this, data);					
			$("#"+this.getFullId() +"_container").css({ height : (data - 40 < 0 ? 0 : data - 40 ) });	
			$("#"+this.getFullId() +"_html").css({ height : (data - 40 < 0 ? 0 : data - 40 ) });
		}catch(e){
			error_log("frameBrowser:"+e);
		}
	},
	eventButtonMouseClick: function(event){
		this.close();	
	},
	eventButtonMouseOver: function(event){
		window.system.showHint(event.clientX - 50, event.clientY - 25, "Close Frame");
	}
});
