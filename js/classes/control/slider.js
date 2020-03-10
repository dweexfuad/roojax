//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_slider = function(owner,options){	
	window.control_slider.prototype.parent.constructor.call(this,owner,options);	
	this.className = "control_slider";
	this.interval = 5000;	
	this.enabled = false;
	this.selId = -1;
	this.items = [];
	this.hoverClr = "url(image/tabOver.png) repeat-x";
	this.deactClr = "url(image/tabBg.png) repeat-x";
	this.actClr = "url(image/tabBgDe.png) repeat-x";
	this.onItemsClick = new control_eventHandler();
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.direction !== undefined) this.direction = options.direction;				
		if (options.interval !== undefined) this.setInterval(options.interval);	
	}
};
window.control_slider.extend(window.control_control);
window.slider = window.control_slider;
window.control_slider.implement({
	doDraw: function(canvas){	
		canvas.style.position = "absolute";
		canvas.style.border = "1px solid #cccccc";
		canvas.style.background = "#ffffff";			
		var ie = document.all ? true:false;
		this.id =this.getFullId();
		var n = this.id;
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
						"<div id='"+this.id+"_image' style='{border-bottom:1px solid #cccccc;position:absolute;background:#ffffff;top:0;left:0;width:100%;height:200;overflow:hidden}'></div>"+
	            "<div id='"+this.id+"_btn' style='{position:absolute;background:#ff0000;top:205;left:20;width:auto;height:26}'>"+
				"<div id='"+this.id+"_btnL' style='{display:none;position:absolute;background:url(image/toolbarL.png)0 0 no-repeat;top:0;left:0;width:14;height:26}'></div>"+
				"<div id='"+this.id+"_btnR' style='{display:none;position:absolute;background:url(image/toolbarR.png)0 0 no-repeat;top:0;left:0;width:14;height:26}'></div>"+
				"</div>"+
				"<div id='"+this.id+"_desc' style='{position:absolute;border-top:1px solid #cccccc;background:#ffffff;top:235;left:0;width:100%;height:200;overflow:hidden}'></div>";
		this.setInnerHTML(html, canvas);
		this.canvas = canvas;	
		this.btnL = $(this.id+"_btnL");
		this.btnR = $(this.id+"_btnR");	
		this.btn = $(this.id+"_btn");
		this.image = $(this.id+"_image");
		this.desc = $(this.id+"_desc");
	},
	setBackground: function(data){
		var cnv = this.canvas;
		if (cnv != undefined)
			cnv.style.background = data;
	},
	setBgColor: function(data){
		var cnv = this.canvas;
		if (cnv != undefined)
			cnv.style.backgroundColor = data;
	},
	addItem: function(img, header, shortDesc, id){
	  try{
	  	var arr = [img, header, shortDesc];	
	  	this.items[this.items.length] = arr;
	  	if (this.selId == -1) this.selId = 0;
	    var div,divBtn, divImg, divDesc;  
	    div = document.createElement("div");
	    div.style.position = "absolute";
	    div.id = this.id+"_btn"+this.items.length;
	    div.style.width = 30;
	    div.style.height = 26;
	    div.style.left = (this.items.length - 1) * 30 + 14;
		div.style.top = 0;
	    //div.style.border = "1px solid #cccccc";
	    div.style.cursor = "pointer";    
		div.style.background = this.deactClr;
	    div.onclick = new Function("event","window.system.getResource("+this.resourceId+").doClick(event,"+this.items.length+");");
	    div.align = "center";
		div.valign = "center";
	    div.innerHTML = "<span align='center' style='top:5;width:100%;background:;position:absolute;left:0;'>"+this.items.length+"</span>";
	    divBtn = this.btn;
	    divBtn.appendChild(div);
	    div = document.createElement("div");
	    div.id = this.id+"_image"+this.items.length;
	    div.style.position = "absolute";
	    div.style.width = "100%";
	    div.style.height = 200;
	    div.style.display = "none";
	    div.innerHTML ="<img src='"+img+"' align='center' height=200 width="+(this.width - 20)+" style='position:absolute; left:20;'/>";
	    div.onclick = new Function("event","window.system.getResource("+this.resourceId+").doItemsClick(event,'"+id+"');");
		divImg = $(this.id+"_image");
	    divImg.appendChild(div);  
	    div = document.createElement("div");
	    div.id = this.id+"_desc"+this.items.length;
	    div.style.position = "absolute";
	    //div.style.width = 30;
		div.style.height = "auto";
		div.style.overflow = "auto";
	    div.style.marginLeft = 10;
	    div.style.display = "none";
		div.onclick = new Function("event","window.system.getResource("+this.resourceId+").doItemsClick(event,'"+id+"');");
	    div.innerHTML ="<h2 style='color:#0000ff'>"+header+"</h2>"+shortDesc;
	    divDesc = $(this.id+"_desc");	
	    divDesc.appendChild(div);  
	   
		this.btnR.style.left =  (this.items.length) * 30 + 14; 
	    if (this.items.length == 1){
	      this.selId = 1;    
	      this.setEnabled(true);       
	    }
	  }catch(e){
	    alert(e)
	  }
	},
	clearItems: function(){
		this.items = [];
	},
	fadeImg : function(){		
		var cnv = $(this.id +"_image"+this.selId);
		if (this.selId > -1) {			
			cnv.style.display = "";		
			if (this.opacity < 100)
			  this.opacity += 10;
			 else {
				this.opacity = 0;
				return false;
			 }
	  	}else {
	  		//clearTimeout(this.intervalId2);  		
		    this.opacity = 0;
	  		return false;
	  	}
	  	this.counter++;		
	  	cnv.style.MozOpacity = (this.opacity/100);
	    cnv.style.opacity = (this.opacity/100);
	    cnv.style.filter = 'alpha(opacity='+this.opacity+')';				
		this.intervalId2 = window.setTimeout("window.system.getResource(" + this.resourceId + ").fadeImg();", 200);		
	},
	slide: function(){	
		//do slide	
		if (this.selId == -1) return false;			
		var cnv = $(this.id +"_image"+this.selId);
		cnv.style.display = "none";		
		cnv = $(this.id +"_desc"+this.selId);
		cnv.style.display = "none";
		cnv = $(this.id +"_btn"+this.selId);
		cnv.style.background = this.deactClr;
		if (this.selId < this.items.length)
			this.selId++;
		else this.selId = 1;
		cnv = $(this.id +"_image"+this.selId);
		cnv.style.display = "";
		cnv = $(this.id +"_desc"+this.selId);
		cnv.style.display = "";
		cnv = $(this.id +"_btn"+this.selId);
		cnv.style.background = this.actClr;
		this.opacity = 0;
		this.fadeImg();			
		if (this.enabled)
			this.intervalId = window.setTimeout("window.system.getResource(" + this.resourceId + ").slide();", this.interval);
	},
	setEnabled: function(data){
		this.enabled = data;
		if (this.enabled){	  
		  this.opacity = 0;
			this.slide();		
		}else {
			window.clearTimeOut(this.intervalId);
			window.clearTimeOut(this.intervalId2);
		}
	},
	doClick: function(event,data){	
		var cnv = $(this.id +"_image"+this.selId);
		cnv.style.display = "none";		
		cnv = $(this.id +"_desc"+this.selId);
		cnv.style.display = "none";
		cnv = $(this.id +"_btn"+this.selId);
		cnv.style.background = this.deactClr;
		this.selId = data;
		cnv = $(this.id +"_image"+this.selId);
		cnv.style.display = "";
		cnv = $(this.id +"_desc"+this.selId);
		cnv.style.display = "";
		cnv = $(this.id +"_btn"+this.selId);
		cnv.style.background = this.actClr;
		this.opacity = 0;
		this.fadeImg();    	
	},
	doItemsClick: function(event,data){
		this.onItemsClick.call(this, data, event);
	},
	setHeight: function(data){
		window.control_slider.prototype.parent.setHeight.call(this,data);
		this.desc.style.height = data - 235;
	}
});
