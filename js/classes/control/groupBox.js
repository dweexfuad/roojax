//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_groupBox = function(owner, options){
    if (owner)
    {
        this.caption = "";
		window.control_groupBox.prototype.parent.constructor.call(this, owner, options);		
        this.className = "control_groupBox";
        this.owner = owner;
		this.bgColor = system.getConfig("form.panel.color");
		this.setBorder(1);
		this.scrolling = false;
		if (options !== undefined){
			this.updateByOptions(options);					
			if (options.color !== undefined) this.setColor(options.color);				
			if (options.border !== undefined) this.setBorder(options.border);				
			if (options.caption !== undefined) this.setCaption(options.caption);							
		}
    }
};
window.control_groupBox.extend(window.control_containerControl);
window.groupBox = window.control_groupBox;
//---------------------------- Function ----------------------------------------
window.control_groupBox.implement({
	draw: function(canvas){
		window.control_groupBox.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();		
		nd.style.overflow = "hidden";		
		
	   	html =  	"<div id='" + n + "_bordertop1' style='{position: absolute;left: 0;top: 10; width:10; height: 1;}'></div>"+								
					"<div id='" + n + "_bordertop2' style='{position: absolute;left: 10;top: 10; width:100; height: 1;}'></div>"+								
					"<div id='" + n + "_border' style='{position: absolute;left: 0;top: 10; width:100%; height: 100%;}'>"+					
						"<div id='" + n + "form' style='{position: absolute; left: 10; top: 10; width: 100%; height: 100%}' ></div>"+
					"</div>"+
					"<span id='" + n + "_cap' style='{background:transparent;position: absolute;left: 10;top: 3; width:auto; height: 18}'> </span>"+					
					"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>";	    
		this.setInnerHTML(html, nd);
		this.form = $(n+"form");
		this.border = $(n+"_border");
		this.border1 = $(n+"_bordertop1");
		this.border2 = $(n+"_bordertop2");
		this.form.style.background = system.getConfig("form.panel.color");
	},
	setScroll: function(data){
		this.scrolling=data;
		var cnv = this.getClientCanvas();
		if (data)
			cnv.style.overflow="auto";
		else cnv.style.overflow="hidden";
	},
	setColor: function(data){
		this.bgColor = data;
		var nd = this.border;
		nd.style.background = this.bgColor;
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){		
		try{
		    if (this.border != data){
		        var node = this.border;
		        var n = this.getFullId();	       
		        switch (data)
		        {
		            case 0 : // none		                    
		                    if (node != undefined){
		                        node.style.border = "";	                        	                    
								this.border1.style.borderTop = "";
								this.border2.style.borderTop = "";
							}
		                    break;
		            case 1 : // raised		                    
		                    if (node != undefined){
		                        node.style.borderRight = window.system.getConfig("3dborder.outer.left");
		                        node.style.borderBottom = window.system.getConfig("3dborder.outer.top");
								node.style.borderLeft = window.system.getConfig("3dborder.outer.right");
		                        this.border1.style.borderTop = window.system.getConfig("3dborder.outer.bottom");
								this.border2.style.borderTop = window.system.getConfig("3dborder.outer.bottom");
		                    }                    
		                    break;
		            case 2 : // lowered		                    
		                    if (node != undefined){
		                        node.style.borderLeft = window.system.getConfig("3dborder.outer.left");
		                        this.border1.style.borderTop = window.system.getConfig("3dborder.outer.top");
								this.border2.style.borderTop = window.system.getConfig("3dborder.outer.top");
								node.style.borderRight = window.system.getConfig("3dborder.outer.right");
		                        node.style.borderBottom = window.system.getConfig("3dborder.outer.bottom");
		                    }	                    
		                    break;
					case 3 : // bordered		                    
		                    if (node != undefined){
		                        node.style.borderLeft = window.system.getConfig("nonborder.inner.right");
		                        this.border1.style.borderTop = window.system.getConfig("nonborder.inner.bottom");
								this.border2.style.borderTop = window.system.getConfig("nonborder.inner.bottom");
								node.style.borderRight = window.system.getConfig("nonborder.inner.left");
		                        node.style.borderBottom = window.system.getConfig("nonborder.inner.top");
		                    }	                    
		                    break;
		        }
		    }
		}catch(e){
			systemAPI.alert(e);
		}
	},
	setBorderColor: function(data, options){		
		node = this.getCanvas();
		if (options == undefined){		
			if (node != undefined)
				node.style.border = data;	                        					
		}else{
			if (options.top) node.style.borderTop = data;
			if (options.left) node.style.borderLeft = data;
			if (options.right) node.style.borderRight = data;
			if (options.bottom) node.style.borderBottom = data;
		}
	},
	setCaption: function(data){
		this.caption = data;	
		if (this.caption != ""){		
			var n = $(this.getFullId() + "_cap");
			if (n != undefined){								
				n.innerHTML = "<nobr>&nbsp;"+data+" </nobr>";
			}				
			var width = n.offsetWidth;
			if (n.offsetWidth == 0) width = data.length * 5;
			this.border2.style.left = 10 + width;	
			this.border2.style.width = this.width - (10 + n.offsetWidth) - (document.all ? 2 : 0);
		}
	},
	block: function(){
	    var node = $(this.getFullId() + "_block");
	    if (node != undefined)
	        node.style.display = "";
	},
	setHeight: function(data){
		window.control_groupBox.prototype.parent.setHeight.call(this, data);
		this.form.style.height = data - 25;				
		this.border.style.height = data - (systemAPI.browser.msie ? 10:12);
	},
	setWidth: function(data){
		window.control_groupBox.prototype.parent.setWidth.call(this, data);
		this.form.style.width = data - 20;				
		this.border.style.width = data - (systemAPI.browser.msie ? 0:2);
	},
	unblock: function(){
	    var node = $(this.getFullId() + "_block");
	    if (node != undefined)
	        node.style.display = "none";
	},
	setShadow: function(data){
		var cnv = $(this.getFullId() + "_bottom");
		if (cnv != undefined){
			if (data) cnv.style.display = "";
			else cnv.style.display = "none";
		}
	}
});
