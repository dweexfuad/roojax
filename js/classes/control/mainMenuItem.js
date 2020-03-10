//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_mainMenuItem = function(owner, caption){
    if (owner){
        this.caption = caption;		
		window.control_mainMenuItem.prototype.parent.constructor.call(this, owner);
		window.control_mainMenuItem.prototype.parent.setHeight.call(this,20);		        
		this.className = "control_mainMenuItem";
        this.owner = owner;		
		this.setWidth(this.caption.length * 8);
    }
};
window.control_mainMenuItem.extend(window.control_control);
window.mainMenuItem = window.control_mainMenuItem;
window.control_mainMenuItem.implement({
	doDraw: function(canvas){
		canvas.style.position = "absolute";
		canvas.style.top = 0;
		canvas.style.marginTop = "2px";
		canvas.style.width = this.caption.length * 8;
		canvas.style.height = "20";
		canvas.style.left = 0;
		canvas.style.cursor = "pointer";		
		canvas.align = "center";	
		canvas.innerHTML = "<div style='position:absolute;left:0;top:0;width:100%;height:100%;background:#2898d9;filter:alpha(0);opacity:0;moz-opacity:0;'></div>" + 
							"<div style='position:absolute;left:0;top:0;width:100%;height:100%;'>"+this.caption+"</div>";		
		canvas.onmouseover = new Function("event","system.getResource("+this.resourceId+").itemOver(event)");
		canvas.onmouseout = new Function("event","system.getResource("+this.resourceId+").itemOut(event)");
		canvas.onclick = new Function("event","system.getResource("+this.resourceId+").itemClick(event)");	
	},
	itemClick: function(event){
		this.owner.itemClicked = !this.owner.itemClicked;
		if (this.owner.itemClicked)
			this.popUpMenu.popUp(this.owner.owner.left+this.left,this.owner.owner.top + this.owner.top + 20 + 25);
	},
	itemOver: function(event){
		var target = document.all ? event.srcElement : event.target;
		//target.parentNode.firstChild.style.background = "#2898d9";	
		this.opacity = 0;
		this.elmIn = target.parentNode.firstChild; 
		this.lclFadeIn();
		if (this.owner.itemClicked)
			this.popUpMenu.popUp(this.owner.owner.left+this.left,this.owner.owner.top + this.owner.top + 20 + 25);
	},
	itemOut: function(event){
		var target = document.all ? event.srcElement : event.target;
		//target.parentNode.firstChild.style.background = "";
		this.opacity2 = 100;
		this.elmOut = target.parentNode.firstChild; 
		this.lclFadeOut();	
	},
	lclFadeIn: function(){
		try{	
			var cnv = this.elmIn;
			if (this.opacity < 100) {
				cnv.style.display = "";						
		  	}else 
		  	{
		  		window.clearTimeOut(this.intervalId2);  		
			    this.opacity = 0;
				this.setOpacity(cnv,this.opacity);
		  		return false;
		  	}	  	
		  	this.setOpacity(cnv,this.opacity);
			this.opacity += 10;			
			this.intervalId2 = window.setTimeout("window.system.getResource(" + this.resourceId + ").lclFadeIn();", 20);		
		}catch(e){
			this.intervalId2 = undefined;
			this.opacity = 0;
			//alert(e);
		}
	},
	lclFadeOut: function(){
		try{	
			var cnv = this.elmOut;
			if (this.opacity2 > 0) {			
				cnv.style.display = "";						
		  	}else 
		  	{			  			
				this.opacity2 = 0;					
				this.setOpacity(cnv,this.opacity2);
				cnv.style.display = "none";				
				window.clearTimeOut(this.intervalId3);  	
		  		return false;
		  	}	  	
		  	this.setOpacity(cnv,this.opacity2);
			this.opacity2 -= 10;			
			this.intervalId3 = window.setTimeout("window.system.getResource(" + this.resourceId + ").lclFadeOut();", 20);	
		}catch(e){
			this.intervalId3 = undefined;
			this.opacity2 = 100;
			//alert(e);
		}
	},
	setOpacity: function(cnv,opacity){
		cnv.style.MozOpacity = (opacity/100);
		cnv.style.opacity = (opacity/100);
		cnv.style.filter = 'alpha(opacity:'+opacity+')';		
	},
	setCaption: function(caption){
		this.caption = caption;
		this.setWidth(this.caption.length * 8);
		var canvas = this.getCanvas();
		canvas.innerHTML = "<div style='position:absolute;left:0;top:0;width:100%;height:100%;background:#2898d9;filter:alpha(0);opacity:0;moz-opacity:0;'></div>" + 
							"<div style='position:absolute;left:0;top:0;width:100%;height:100%;'>"+this.caption+"</div>";		
		
		this.owner.rearrange();
	}
});
