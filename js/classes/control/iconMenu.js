//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_iconMenu = function(owner,options){
    if (owner)
    {

		this.withImage = false;
		this.items = new arrayMap();
		this.itemWidth = 300;
		this.itemHeight = 150;
		this.childWidth = 300;
		this.color = system.getConfig("form.button.color");;//"#57A9FF";//62b4c3 "#f6b354";
		this.borderColor =system.getConfig("form.button.color");//417983"#d98815";
		window.control_iconMenu.prototype.parent.constructor.call(this, owner, options);
        this.className = "control_iconMenu";	
		this.owner = owner;
        this.setWidth(73);
        this.setHeight(20);	
        this.onClick = new eventHandler();
        this.onIconClick = new  eventHandler();
		this.tabStop = true;
		
		this.url = "";
		if (options !== undefined){				
			this.updateByOptions(options);
			if (options.color) this.setColor(options.color);				
			if (options.borderColor) this.setBorderColor(options.borderColor);
		}
		uses("util_ajaxPush");
    }
};
window.control_iconMenu.extend(window.control_control);
window.iconMenu = window.control_iconMenu;
//---------------------------- Function ----------------------------------------
window.control_iconMenu.implement({
	doDraw: function(canvas){
		try{	    
			canvas.css({overflow:"auto"});
			this.canvas = canvas;
			
		}catch(e){
			systemAPI.alert(this+"$doDraw()",e);
		}
	},
	eventMouseOver: function(event){
	   
	},
	eventMouseOut: function(event){	    
	    
	},
	eventMouseDown: function(event){
	
	},
	setColor: function(data){
		
	},
	setBorderColor: function(data){
		
	},
	eventMouseClick: function(event){		
	    this.onClick.call(this);
	},
	doKeyDown: function(charCode, buttonState, keyCode){				
		
	},
	setHeight: function(data){	
		try{
            window.control_iconMenu.prototype.parent.setHeight.call(this, data);
		}catch(e){
		  systemAPI.alert(this+"$setHeight("+this.name+")",e);
        }            
	},
	eventMouseMove: function(event){
		if (this.showHint)
			window.system.showHint(event.clientX, event.clientY, this.hint,true);
	},
	
	doRequestReady: function(sender, methodName, result, errorCode, xhr){
		try{
			result = JSON.parse(result);
			this.nodeNotifikasi.innerHTML = result.message;
		}catch(e){
			error_log(e);
		}

	},
	setUrl : function(url){
		this.url = url;
	},
	itemClick: function(event, item){
		this.onClick.call(this, item,this.items.get(item).index ); 
	},
	iconClick: function(event, item){
		this.onIconClick.call(this, item);
	},
	addMenu: function(menu){
		try{
			var container = $("<div id='"+menu.id+"_background' style='cursor:pointer;position:absolute;left:0;top:0;width:142;height:180;background:"+menu.color+"'></div>");
			container.appendTo(this.canvas);
			var node = $("<div id='"+menu.id+"_container' style='cursor:pointer;position:absolute;left:0;top:0;width:142;height:180;'></div>");
			$("<img src='"+menu.image+"' width=142 height=142 style='position:absolute;left:0;top:0;height:142px;width:142px'/>").appendTo(node);
			$("<span style='text-align:center;color:#fff;whitespace:nowrap;font-size:18;text-overflow:ellipsis;position:absolute;left:0;width:100%;height:40;top:160'>"+menu.label+"</span>").appendTo(container);
			
			container.bind("click",{ item: menu, context:this}, function(event){
				event.data.context.onClick.call(event.data.context, event.data.item);
			});
			container.bind("mouseover",{item:menu},function(event){
				var bg = $(this).css("background-color");
				bg = bg.replace("rgb","rgba").substring(0, bg.length);
				bg += ",0.5)";
				$(this).css("background-color",bg);
			});
			container.bind("mouseout",{item:menu},function(event){
				var bg = $(this).css("background-color");
				bg = bg.replace("rgba","rgb").substring(0, bg.length - 7);
				bg += ")";
			
				$(this).css({background : bg});
			});
			node.appendTo(container);
			this.items.set(menu.id, node);
			container.shadow();
			this.rearrange();

		}catch(e){
			error_log(e);
		}
	},
	rearrange: function(){
		var left = 0;
		var childWidth = this.childWidth;//this.width / this.items.getLength();
		var ix = 0;
		var top = 0;
		for (var i in  this.items.objList ){
			var node = this.items.get(i);
			node.css({left: ((childWidth / 2) - 71)});
			if (childWidth * ix + 5 + this.childWidth > this.width){
				left = 0;
				ix = 1;
				top += 190;
			}else {
				left = childWidth * ix ;
				ix++;
			}
			$("#"+i+"_background").css({width:childWidth - 10, left: left + 5, top : top});
		
		}
	},
	setWidth: function(data){
		window.control_iconMenu.prototype.parent.setWidth.call(this,data);
		this.rearrange();
	}
});
