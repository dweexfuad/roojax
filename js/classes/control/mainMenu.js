//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_mainMenu = function(owner){
    if (owner){
        this.caption = "";
		window.control_mainMenu.prototype.parent.constructor.call(this, owner);
		window.control_mainMenu.prototype.parent.setHeight.call(this,20);		
        this.setWidth(owner.width);		
		this.setTop(0);
		this.setLeft(0);
		this.className = "control_mainMenu";
        this.owner = owner;
		this.bgColor = system.getConfig("form.panel.color");
		this.border = 1;
		this.scrolling = false;
		this.popUp = [];
		this.items = [];
		this.itemInterval = [];
		this.itemLength = 0;
		this.owner.itemClicked = false;
		uses("control_mainMenuItem",true);		
    }
};
window.control_mainMenu.extend(window.control_containerControl);
window.mainMenu = window.control_mainMenu;
window.control_mainMenu.implement({
	draw: function(canvas){
		window.control_mainMenu.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();

	    var html = "";
	    
		var nd = this.getCanvas()
		nd.style.overflow = "hidden";
		//nd.style.border = "1px solid #ff9900";
	    if (document.all)
	        html =  "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
					"<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
					"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
					"</div>";
	    else
	        html =  "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +					
						"<div id='" + n + "form' style='{background:url(image/themes/"+system.getThemes()+"/menuMainBg.png)top left repeat-x;position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
						"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
					"</div>";

	    this.setInnerHTML(html, nd);
		this.cont = $(n+"form");
	},
	setColor: function(data){
		this.bgColor = data;
		var nd = this.getCanvas()
		nd.style.background = this.bgColor;
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){	
	    if (this.border != data){
	        var node = undefined;
	        var n = this.getFullId();
	        
	        switch (data)
	        {
	            case 0 : // none
	                    node = $(n + "_border1");
	                    
	                    if (node != undefined)
	                        node.style.border = "";
	                        
	                    node = $(n + "_border2");

	                    if (node != undefined)
	                        node.style.border = "";
	                    break;
	            case 1 : // raised
	                    node = $(n + "_border1");

	                    if (node != undefined)
	                    {
	                        node.style.borderLeft = window.system.getConfig("3dborder.outer.right");
	                        node.style.borderTop = window.system.getConfig("3dborder.outer.bottom");
	                    }

	                    node = $(n + "_border2");

	                    if (node != undefined)
	                    {
	                        node.style.borderRight = window.system.getConfig("3dborder.outer.left");
	                        node.style.borderBottom = window.system.getConfig("3dborder.outer.top");
	                    }
	                    
	                    break;
	            case 2 : // lowered
	                    node = $(n + "_border1");

	                    if (node != undefined)
	                    {
	                        node.style.borderLeft = window.system.getConfig("3dborder.outer.left");
	                        node.style.borderTop = window.system.getConfig("3dborder.outer.top");
	                    }

	                    node = $(n + "_border2");

	                    if (node != undefined)
	                    {
	                        node.style.borderRight = window.system.getConfig("3dborder.outer.right");
	                        node.style.borderBottom = window.system.getConfig("3dborder.outer.bottom");
	                    }

	                    break;
				case 3 : // bordered
	                    node = $(n + "_border1");
		
	                    if (node != undefined)
	                    {
	                        node.style.borderLeft = window.system.getConfig("nonborder.inner.right");
	                        node.style.borderTop = window.system.getConfig("nonborder.inner.bottom");
	                    }

	                    node = $(n + "_border2");

	                    if (node != undefined)
	                    {
	                        node.style.borderRight = window.system.getConfig("nonborder.inner.left");
	                        node.style.borderBottom = window.system.getConfig("nonborder.inner.top");
	                    }
	                    
	                    break;
	        }
	    }
	},
	block: function(){
	    var node = $(this.getFullId() + "_block");

	    if (node != undefined)
	        node.style.display = "";
	},
	setHeight: function(data){
		window.control_mainMenu.prototype.parent.setHeight.call(this, data);
	},
	unblock: function(){
	    var node = $(this.getFullId() + "_block");
	    if (node != undefined)
	        node.style.display = "none";
	},
	setShadow: function(data){
		var cnv = $(this.getFullId() + "_bottom");
		if (cnv != undefined)
		{
			if (data)
				cnv.style.display = "";
			else cnv.style.display = "none";
		}
	},
	addItem: function(item, popUp){
		try{		
			var itemObj = new control_mainMenuItem(this,item);		
			itemObj.setLeft(this.itemLength);
			this.itemLength += itemObj.width;
			if (this.items.length == 0)
				this.items[this.items.length] = itemObj;
			else {
				var tmpObj;
				for (var i=0;i < this.items.length;i++){
					tmpObj = this.items[i];		
					if (tmpObj == undefined && i < this.items.length - 1) this.items[i] = this.items[i+1];							
				}
				if (this.items[this.items.length-1] === undefined)
					this.items[this.items.length-1] = itemObj;
				else this.items[this.items.length] = itemObj;
			}		
		}catch(e){
			this.app.alert(e,"");
		}
	},
	delItem: function(idx){
		var itemObj = this.items[idx];
		if (itemObj != undefined) {
			var itemWidth = itemObj.width;
			var tmpObj,left = itemObj.left;
			for (var i=idx+1;i < this.items.length;i++){
				tmpObj = this.items[i];
				tmpObj.setLeft(left);
				left += tmpObj.width;
			}
			this.itemLength -= itemWidth;
			itemObj.free();
			delete this.items[idx];
		}
	},
	rearrange: function(){
		var tmpObj,left = 0;
		for (var i=0;i < this.items.length;i++){
			tmpObj = this.items[i];
			tmpObj.setLeft(left);
			left += tmpObj.width;
		}
	}
});
