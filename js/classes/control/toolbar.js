//***********************************************************************************************
//*	Copyright (c) 2009 roojax
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			roojax jamboo											
//***********************************************************************************************
window.control_toolbar = function(owner, options){
	if (owner){				
		window.control_toolbar.prototype.parent.constructor.call(this, owner, options);		
		this.className = "control_toolbar";
		this.onButtonClick = new control_eventHandler();		
		this.buttonList = new control_arrayMap();
		this.separatorList = new control_arrayMap();
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.buttonClick !== undefined) this.onButtonClick.set(options.buttonClick[0],options.buttonClick[1]);
		}
	}
};
window.control_toolbar.extend(window.control_control);
window.toolbar = window.control_toolbar;
window.control_toolbar.implement({
	doDraw: function(canvas){		
		canvas.style.backgroundImage = "url(icon/"+system.getThemes()+"/toolbarbg.png)";
		canvas.style.backgroundPosition = "top left";
		canvas.style.backgroundRepeat = "repeat-x";
		canvas.style.border = "1px solid #999999";	
		var n = this.getFullId();
		var html = "<div id='" + n + "_lImg' style='position: absolute;left: 0;top: 0; width:5; height: 100%;display:none'> </div>"+
				"<div id='" + n + "_content' style='position: absolute;left: 0;top: 0; width:100%; height: 100%;color:#ffffff;'> </div>"+				
				"<div id='" + n + "_rImg' style='position: absolute;left: 0;top: 0; width:100%; height: 20;display:none'> </div>";
		canvas.innerHTML = html;
		this.content = $(n +"_content");
	},
	addButton: function(id,caption, icon, hint){
		var node = document.createElement("div");
		node.id = this.getFullId()+"_"+id;		
		//var left = this.buttonList.getLength() * 22 + 2;
		var left = 2;
		for (var i in this.buttonList.objList){
			left += parseInt(this.buttonList.get(i).offsetWidth) + 2;
		}		
		var width = 22 + caption.length * 7;
		node.style.cssText = "position:absolute;left:"+left+";top:2;width:"+width+";height:20;border:1px solid transparent;cursor:pointer";
		eventOn(node,"mousemove","$$$("+this.resourceId+").buttonMouseMove(event,'"+hint+"');");		
		node.onmouseover = function(event){
			this.style.border = "1px solid #ff9900";
			this.style.backgroundImage = "url(icon/dynpro/menuselect.png)";
			this.style.backgroundColor = "#ff9900";
			//system.showHint(event.clientX, event.clientY, hint, true);
		};
		node.onmouseout = function(){
			this.style.border = "1px solid transparent";
			this.style.backgroundImage = "";
			this.style.backgroundColor = "transparent";
			system.hideHint();
		};
		eventOn(node,"click","$$$("+this.resourceId+").buttonClick(event,'"+id+"');");
		var html = "<div style='position:absolute;left:2;top:2;height:16;width:16;background-image:url("+icon+");background-position:top left;background-repeat: no-repeat;font-size:11;font-family:arial;'><span style='position:absolute;width:100%;heigth:100%;left:22;top:0;cursor:pointer'>"+caption+"</span></div>";
		node.innerHTML = html;		
		this.content.appendChild(node);
		this.buttonList.set(id, node);
	},
	addSeparator: function(){
		var id = this.separatorList.getLength();
		var node = document.createElement("div");
		node.id = this.getFullId()+"_sepr"+id;
		var left = 2;
		for (var i in this.buttonList.objList){
			left += parseInt(this.buttonList.get(i).offsetWidth) + 2;
		}		
		var width = 2;
		node.style.cssText = "position:absolute;left:"+left+";top:2;width:"+width+";height:20;background-image:url(icon/dynpro/separator.png)";		
		this.content.appendChild(node);
		this.buttonList.set("_sepr"+id, node);
		this.separatorList.set("_sepr"+id, node);
	},
	buttonClick: function(event,id){
		this.onButtonClick.call(this, id);
	},
	buttonMouseMove: function(event,hint){
		system.showHint(event.clientX, event.clientY, hint, true); 
	}
});
