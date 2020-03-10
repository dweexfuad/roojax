//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_panel = function(owner, options){
    if (owner)
    {
		this.caption = "";
		window.control_panel.prototype.parent.constructor.call(this, owner, options);		
		this.className = "control_panel";
		this.owner = owner;
		this.bgColor = system.getConfig("form.panel.color");
		this.setBorder(1);
		this.scrolling = false;		
		this.onMouseDown = new control_eventHandler();
		this.onMouseMove = new control_eventHandler();
		this.onMouseUp = new control_eventHandler();
		this.onClick = new eventHandler();
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.color) this.setColor(options.color);						
			if (options.borderColor) this.setBorderColor(options.borderColor);						
			if (options.border || options.border == 0) this.setBorder(options.border);
			if (options.caption) this.setCaption(options.caption);
			if (options.click) this.onClick.set(options.click[0],options.click[1]);
			if (options.arrowMode) this.setArrow(options.arrowMode);
		}
    }
};
window.control_panel.extend(window.control_containerControl);
window.panel = window.control_panel;
//---------------------------- Function ----------------------------------------
window.control_panel.implement({
	draw: function(canvas){
		window.control_panel.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		nd.css({ overflow : "hidden" });
		
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:auto}' ></div>"+
	    		"<div id='" + n + "_cap' style='{position: absolute; left: 0;top: 0; width:100%; height: 20;color:#ffffff;padding-left:10px;display:none}'> </div>"+
				"<div id='" + n + "_arrowContainer' style='overflow:hidden;position:absolute;height:100%;left:-10px;width:30px;display:none;overflow:hidden;background-color:transparent'>"+
					"<div id='" + n + "_arrow' style='position:absolute;left:10px;width:20px;height:20px;background-color:transparent;box-shadow:0px 5px 10px #888'></div> "+
				"</div>";	    
		this.setInnerHTML(html, nd);				
		nd.bind("click",setEvent("$$$(" + this.resourceId + ").doCanvasClick(event);"));		
		nd.bind("mousedown",setEvent("$$$(" + this.resourceId + ").doMouseDown(event);"));		
		nd.bind("mouseup",setEvent("$$$(" + this.resourceId + ").doMouseUp(event);"));
		var self = this;
		$("#" + n +"form").scroll(function(event){
			self.emit("scroll", event);
		});		
	},
	setArrow: function(mode){
		var n = this.getFullId();
		switch (mode){
			case 0 : 
				this.getCanvas().css({ overflow : "hidden" });
				$("#"+ n +"_arrowContainer").hide();
				$("#"+ n +"form").css({width:"100%",height:"100%",left:0,top:0});
				break;//none
			case 1 : 
				this.setBorder(0);
				this.getCanvas().css({ overflow : "" });
				$("#"+ n +"_arrowContainer").show();
				$("#"+ n +"_arrowContainer").css({width:25});
				$("#"+ n +"form").css({borderRadius:"5px",boxShadow:"0px 5px 10px #888", width: $("#"+ n).width() - 15,height: "100%",left:15,top:0});
				$("#"+ n +"_arrow").css({background: this.bgColor, boxShadow:"0px 5px 10px #888", top : $("#" + n).height() / 2 - 10, left: 15, transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
				break;//left
			case 2 : ;break;//top
			case 3 : ;break;//right
			case 4 : 
				this.setBorder(0);
				this.getCanvas().css({ overflow : "" });
				$("#"+ n +"_arrowContainer").show();
				$("#"+ n +"_arrowContainer").css({width:"100%", height: 25,top: this.height - 20});
				$("#"+ n +"form").css({borderRadius:"5px",boxShadow:"0px 5px 10px #888", width: "100%", height: this.height - 20,left:0,top: 0});
				$("#"+ n +"_arrow").css({background: this.bgColor, boxShadow:"0px 5px 10px #888", top : - 10, left: this.width / 2 - 15 , transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
				break;
		}
	},
	doMouseDown: function(event){
		this.onMouseDown.call(this,event);		
		system.addMouseListener(this);
		this.isClick = true;
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	},
	doMouseUp: function(event){
		system.delMouseListener(this);
		this.isClick = false;
	},
	doCanvasClick : function(event){
		this.onClick.call(this);
	},
	doSysMouseUp: function(x, y, button, buttonState){		
		this.isClick = false;
		system.delMouseListener(this);
		this.onMouseUp.call(this,x,y,button, buttonState);		
	},
	doSysMouseMove: function(x, y, button, buttonState){		
		this.onMouseMove.call(this,x,y,button, buttonState);		
		this.mouseX = x;
		this.mouseY = y;		
	},
	setScroll: function(data){
		this.scrolling=data;
		var cnv = this.getClientCanvas();
		if (data)
			cnv.css({overflow:"auto" });
		else cnv.css({overflow:"hidden"});
	},
	setColor: function(data){
		this.bgColor = data;
		var nd = this.getCanvas();
		$("#" + this.getFullId() +"form").css({background :  this.bgColor });
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){		
		try{
		    if (this.border != data){
		        var node = undefined;
		        var n = this.getFullId();	       
		        switch (data)
		        {
		            case 0 : // none
		                    node = this.getCanvas();	                    
		                    if (node != undefined){
		                        node.css({border : "" }); 
							}
		                    break;
		            case 1 : // raised
		                    node = this.getCanvas();
		                    if (node != undefined){
		                        node.css({"border-right" : window.system.getConfig("3dborder.outer.left") ,
										    "border-bottom" : window.system.getConfig("3dborder.outer.top") , 
											"border-left" : window.system.getConfig("3dborder.outer.right") ,
											"border-top" : window.system.getConfig("3dborder.outer.bottom") });
		                    }                    
		                    break;
		            case 2 : // lowered
		                    node = this.getCanvas();
		                    if (node != undefined){
		                        node.css({"border-left" : window.system.getConfig("3dborder.outer.left"),
									"border-top" : window.system.getConfig("3dborder.outer.top"),
									"border-right" : window.system.getConfig("3dborder.outer.right"),
									"border-bottom" : window.system.getConfig("3dborder.outer.bottom") });
		                    }	                    
		                    break;
					case 3 : // bordered
		                    node = this.getCanvas();
		                    if (node != undefined){
		                        node.css({"border-left" : window.system.getConfig("nonborder.inner.right") ,
										"border-top" : window.system.getConfig("nonborder.inner.bottom"),
										"border-right" : window.system.getConfig("nonborder.inner.left"),
										"border-bottom" : window.system.getConfig("nonborder.inner.top")})
		                    }	                    
		                    break;
		        }
		    }
		}catch(e){
			systemAPI.alert(e);
		}
	},
	maximize: function(){
		this.setWidth(this.owner.width);
		this.setHeight(this.owner.height);
	},
	setBorderColor: function(data, options){		
		node = this.getCanvas();
		if (options == undefined){		
			if (node != undefined)
				node.css({border: data });
		}else{
			if (options.top) node.css({"border-top" : data });
			if (options.left) node.css({"border-left" : data });
			if (options.right) node.css({"border-right" : data });
			if (options.bottom) node.css({"border-bottom" : data });
		}
	},
	setCaption: function(data){
		this.caption = data;	
		var n = $("#"+this.getFullId() + "_cap");
		if (this.caption != ""){
			var wdth = data.length * 6;			
			n.css({background:"#888888"});						
			n.show();
			n.html( "<div style='position:absolute;top:3;width:100%; height:100%;color:#ffffff'><bold>"+data+" </bold></div>" );						
		}else n.hide();
	},
    setHeaderColor: function(color){
        $("#" + this.getFullId() +"_cap").css({background:color});
    },
    setHeaderHeight: function(data){
        $("#" + this.getFullId() +"_cap").css({height:data});
    },
    setCaptionFontSize: function(data){
        $("#" + this.getFullId() +"_cap").css({fontSize:data});
    },
	block: function(){
	    var node = $("#"+this.getFullId() + "_block");
	    if (node != undefined)
	        node.show();
	},
	setHeight: function(data){
		window.control_panel.prototype.parent.setHeight.call(this, data);		
	},
	unblock: function(){
	    var node = $("#"+this.getFullId() + "_block");
	    if (node != undefined)
	        node.hide();
	}
});
