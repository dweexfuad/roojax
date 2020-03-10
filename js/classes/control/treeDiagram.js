//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_treeDiagram = function(owner,options){
    if (owner)
    {
		this.withImage = false;
		window.control_treeDiagram.prototype.parent.constructor.call(this, owner, options);
        this.className = "control_treeDiagram";	
		this.owner = owner;				
        this.onClick = new control_eventHandler();
        this.onMouseOver = new control_eventHandler();
        this.onMouseOut = new control_eventHandler();
        this.onMouseDown = new control_eventHandler();
        this.onMouseMove = new control_eventHandler();
		this.hint = "Button";
		this.popUpWidth = 1200;
		this.showHint = false;		
		this.childFontSize = 6;
		if (options !== undefined){				
			this.updateByOptions(options);
			if (options.fontColor) this.setFontColor(options.fontColor);				
			if (options.showHint) this.setShowHint(options.showHint);	
			if (options.mouseMove) this.onMouseMove.set(options.mouseMove[0],options.mouseMove[1]);
			if (options.mouseOver) this.onMouseOver.set(options.mouseOver[0],options.mouseOver[1]);
			if (options.mouseOut) this.onMouseOut.set(options.mouseOut[0], options.mouseOut[1]);
			if (options.canvasWidth) this.setCanvasWidth(options.canvasWidth);
			if (options.click) {
                if (typeof options.click == "string")
                    this.onClick.set(this.getTargetClass(),options.click);
                else if (this.onClick.isFunction(options.click))
					this.onClick.set(undefined, options.click);
                else 
					this.onClick.set(options.click[0],options.click[1]);
            }
		}
    }
};
window.control_treeDiagram.extend(window.control_control);
window.treeDiagram = window.control_treeDiagram;
//---------------------------- Function ----------------------------------------
window.control_treeDiagram.implement({
	doDraw: function(canvas){
		try{	    			
			var n = this.getFullId();    		
		    var html = "<div id='" + n + "_container' style='position: absolute; left: 0; top: 0; width: 100%; height : 100%;text-align:center' ></div>"+
		    			"<div id='" + n + "_popup' style='position: absolute; left: 0; top: 0; width: 1200; height : 500;text-align:center;display:none;background:#fff' ></div>";	    
			this.setInnerHTML(html, canvas);

			canvas.css({overflow:"auto"});  
			this.canvas = canvas;
			this.container = $("#"+n+"_container");
			this.popUpWindow = $("#"+n+"_popup");
			this.popUpWindow.shadow();
		}catch(e){
			systemAPI.alert(this+"$doDraw()",e);
		}
	},
	eventMouseOver: function(event){		
		this.onMouseOver.call(this);
	},
	eventMouseOut: function(event){	    	    
		this.onMouseOut.call(this);
		window.system.hideHint();
	},
	eventMouseDown: function(event){
		this.getForm().setActiveControl(this);
		this.onMouseDown.call(this);
	},
	setColor: function(data){
		try{
			this.color = data;		
			this.canvas.css({background:data});
		}catch(e){
			systemAPI.alert(e);
		}
	},
	setBorderColor: function(data){
		try{
			this.borderColor = data;			
			this.canvas.css({border : "1px solid " +data });
		}catch(e){
			systemAPI.alert(e);
		}
	},
	eventMouseClick: function(event){				
	    this.onClick.call(this);		
	},
	doKeyUp: function(keyCode, buttonState){	
	},
	doElKeyDown: function(event){	
	},
	doKeyDown: function(charCode, buttonState, keyCode){				
		return false;
	},
	doSetFocus: function(){		
		
	},
	doLostFocus: function(){
		
	},
	setHeight: function(data){	
		try{
            window.control_treeDiagram.prototype.parent.setHeight.call(this, data);    		
		}catch(e){
		  	error_log(e);
        }            
	},
	eventMouseMove: function(event){
		if (this.showHint)
			window.system.showHint(event.clientX, event.clientY, this.hint,true);
        this.onMouseMove.call(this);
	},
	setShowHint: function(data){
		this.showHint = data;
	},
	getShowHint: function(){
		return this.showHint;
	},
	setFontColor: function(data){
		this.canvas.css({color : data });
 	},
 	setData: function(data){
 		this.data = data;
 		this.drawDiagram(data);
 	},
 	setCanvasWidth: function(data){
 		this.canvasWidth = data;
 		this.container.css({width:data});
 	},
 	drawConnector: function(points, container){
 		var connector = $("<div style='position:absolute;left:"+points.p1.x+";top:"+(points.p1.y - 25)+";width:1;height:25px;background: #999'></div>");
 		connector.appendTo(container);
 		if (points.p1.y - 25 == points.p2.y + 25 && points.p1.x == points.p2.x){
	 		var connector = $("<div style='position:absolute;left:"+points.p1.x+";top:"+(points.p1.y - 25)+";width:1;height:1px;background: #999'></div>");
 		}else {
 			if (points.p1.x <= points.p2.x){ //left hands
	 			var w = points.p2.x - points.p1.x;		
	 			var connector = $("<div style='position:absolute;left:"+points.p1.x+";top:"+(points.p1.y - 25)+";width:"+w+";height:1px;background: #999'></div>");
	 			//error_log("left "+ w);
	 		}else {
	 			var w = points.p1.x - points.p2.x;		
	 			var connector = $("<div style='position:absolute;left:"+points.p2.x+";top:"+(points.p2.y + 25)+";width:"+w+";height:1px;background: #999'></div>");
	 			//error_log("right "+ w);
	 		}
 		}

 		connector.appendTo(container);
 		var connector = $("<div style='position:absolute;left:"+points.p2.x+";top:"+points.p2.y+";width:1;height:25px;background: #999'></div>");
 		connector.appendTo(container);
 	},
 	drawDiagramPopup: function(data, parent, index){
 		try{
	 		if (parent === undefined) this.popUpWindow.empty();
	 		var node = $("<div id='"+this.getFullId()+"_"+data.id+"' style='cursor:pointer;position:absolute;left:0;top:0;width:200;height:80;background:"+data.color+";border:1px solid "+data.borderColor+"' ></div>");
	 		node.appendTo(this.popUpWindow);

	 		node.html(data.content.replace("font-size:"+this.childFontSize, "font-size:10"));
	 		if (parent){
	 			var left = parent.childContainerLeft + (index * parent.childWidth) + ((parent.childWidth / 2) - (200 / 2)) ;
	 			node.css({left: left, top : parent.position.y + 80 + 50});// (this.height / 2) - (data.height / 2)
	 			data.position = {y : parent.position.y + 80 + 50, x: left};
	 			data.bottomCenter = { y : data.position.y + 80, x: data.position.x + (200 / 2)};
	 			data.upCenter = { y : data.position.y, x: data.position.x + (200 / 2)};
	 			data.childContainerLeft = parent.childContainerLeft + (index * parent.childWidth);
	 			if (data.childs.length == 1)
	 				data.childWidth = parent.childWidth;
	 			else if (data.childs.length > 1)
	 				data.childWidth = parent.childWidth / data.childs.length;
	 			else data.childWidth = 0;
	 			data.connectorPoints = {p1 : data.upCenter, p2 : parent.bottomCenter };
	 			this.drawConnector(data.connectorPoints, this.popUpWindow);
	 			
	 		}else {

	 			node.css({left: (this.popUpWidth / 2) - (200 / 2), top : 20});// (this.height / 2) - (data.height / 2)
	 			data.position = {y : 20, x: (this.popUpWidth / 2) - (200 / 2) };
	 			data.bottomCenter = { y : 20 + 80, x: this.popUpWidth / 2};
	 			data.upCenter = { y : 20, x: this.popUpWidth / 2};
	 			data.childContainerLeft = 0;
 				if (data.childs.length == 1)
	 				data.childWidth = this.popUpWidth;
	 			else if (data.childs.length > 1)
	 				data.childWidth = this.popUpWidth / data.childs.length;
	 			else data.childWidth = 0;
		 		this.popUpLevel = data.data.level_spasi;
	 		}
	 		node.data("value",data);
	 		node.data("parent",parent);
	 		node.shadow();
	 		node.bind("mouseover", {data:data, fnt:this.childFontSize}, function(event){
	 			system.showHint(event.clientX, event.clientY,"<div style='width:200px;height:auto'>"+event.data.data.content.replace("font-size:"+event.data.fnt, "font-size:10")+"</div>", true);
			});
			node.bind("click", {resourceId:this.resourceId, data: data}, function(event){
				$$$(event.data.resourceId).onClick.call($$$(event.data.resourceId), event.data.data);
	 			$$$(event.data.resourceId).popUpWindow.hide("slow");
			});
	 		data.node = node;
	 		if (data.childs && parseFloat(data.data.level_spasi) < parseFloat(this.popUpLevel) + 2 ){
	 			for (var i = 0; i < data.childs.length; i++){
	 				this.drawDiagramPopup(data.childs[i], data, i);
	 			}
	 		}
	 	}catch(e){
	 		error_log("treeDiagram:"+e);
	 	}
 	},
 	drawDiagram: function(data, parent, index){
 		try{
	 		var node = $("<div id='"+this.getFullId()+"_"+data.id+"' style='cursor:pointer;position:absolute;left:0;top:0;width:"+data.width+";height:"+data.height+";background:"+data.color+";border:1px solid "+data.borderColor+"' ></div>");
	 		node.appendTo(this.container);
	 		node.html(data.content);
	 		if (parent){
	 			var left = parent.childContainerLeft + (index * parent.childWidth) + ((parent.childWidth / 2) - (data.width / 2)) ;
	 			node.css({left: left, top : parent.position.y + parent.height + 50});// (this.height / 2) - (data.height / 2)
	 			data.position = {y : parent.position.y + parent.height + 50, x: left};
	 			data.bottomCenter = { y : data.position.y + data.height, x: data.position.x + (data.width / 2)};
	 			data.upCenter = { y : data.position.y, x: data.position.x + (data.width / 2)};
	 			data.childContainerLeft = parent.childContainerLeft + (index * parent.childWidth);
	 			if (data.childs.length == 1)
	 				data.childWidth = parent.childWidth;
	 			else if (data.childs.length > 1)
	 				data.childWidth = parent.childWidth / data.childs.length;
	 			else data.childWidth = 0;
	 			data.connectorPoints = {p1 : data.upCenter, p2 : parent.bottomCenter };
	 			this.drawConnector(data.connectorPoints, this.container);
	 		}else {
	 			node.css({left: (this.canvasWidth / 2) - (data.width / 2), top : 20});// (this.height / 2) - (data.height / 2)
	 			data.position = {y : 20, x: (this.canvasWidth / 2) - (data.width / 2) };
	 			data.bottomCenter = { y : 20 + data.height, x: this.canvasWidth / 2};
	 			data.upCenter = { y : 20, x: this.canvasWidth / 2};
	 			if (data.childContainerLeft == undefined)
	 				data.childContainerLeft = 0;
	 			if (data.childWidth == undefined){
		 			if (data.childs.length == 1)
		 				data.childWidth = this.canvasWidth;
		 			else if (data.childs.length > 1)
		 				data.childWidth = this.canvasWidth / data.childs.length;
		 			else data.childWidth = 0;
		 		}
	 		}
	 		node.data("value",data);
	 		node.data("parent",parent);
	 		node.shadow();
	 		node.bind("mouseover", {data:data, fnt:this.childFontSize}, function(event){
	 			system.showHint(event.clientX, event.clientY,"<div style='width:200px;height:auto'>"+event.data.data.content.replace("font-size:"+event.data.fnt, "font-size:10")+"</div>", true);
			});
			node.bind("click", {resourceId:this.resourceId, data: data}, function(event){
	 			$$$(event.data.resourceId).drawDiagramPopup(event.data.data);		
				var canvas = $$$(event.data.resourceId).canvas; 
				var w = $$$(event.data.resourceId).width;
				$$$(event.data.resourceId).popUpWindow.css({left : canvas.scrollLeft() + (w / 2) - 600 , top : canvas.scrollTop()});
	 			$$$(event.data.resourceId).popUpWindow.show("slow");
			});
	 		data.node = node;
	 		if (data.childs){
	 			for (var i = 0; i < data.childs.length; i++){
	 				this.drawDiagram(data.childs[i], data, i);
	 			}
	 		}
	 	}catch(e){
	 		error_log("treeDiagram:"+e);
	 	}
 	}
});
