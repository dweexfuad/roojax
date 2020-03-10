//***********************************************************************************************
//*	Copyright (c) 2009 roojax
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			roojax jamboo											
//***********************************************************************************************
window.control_control = function(owner, options){
    if (owner)
    {				
        this.isRounded = false;
		window.control_control.prototype.parent.constructor.call(this, owner);		
		this.className = "control_control";
		this.left = 8;
		this.top = 0;        
		this.width = 32;
		this.height = 32;
		this.name = "control";			
		this.visible = true;        
		this.tabIndex = 1;
		this.tabStop = false;		
		this.tag = 0;
		this.opacity = 100;
		this.opacity2 = 100;
		this.heightTmp = 0;			
		this.isPopUp = false;
		this.interval = 50;
		this.fadeIn = false;
		this.data = "";
        this.enabled = true;
		this.hint = "";		
		this.options = options;
		if (options !== undefined){
			this.updateByOptions(options);			
			if (options.interval !== undefined) this.setIntvl(options.interval);
			if (options.autoComplete) this.setAutoComplete(options.autoComplete);
		}
    }
};
window.control_control.extend(window.control_component);
window.control = window.control_control;
window.control_control.implement({
	draw: function(canvas){		
		try{
			var node = $("<div id='"+this.getFullId()+"' style='position:absolute;left:0;top:0;width:32;height:32'></div>");			
			node.appendTo(canvas);
			if (this.doDraw) this.doDraw(node);
			this.canvas = node;
		}catch(e){
			error_log(this+"$draw()"+e);
		}
	},
	setInnerHTML: function(html, canvas){		
		var cnv = canvas !== undefined ? canvas : this.getCanvas();				
		if (cnv !== undefined){		    
			html = html.replace(/[{}]/gi,"");
			cnv.html(html);
		}
	},
	remBracket: function(html){
		return html.replace(/[{}]/gi,"");		
	},
	getCanvas: function(){	    
	    return $("#"+this.getFullId());
	},
	doDraw:function(canvas){
	},
	bringToFront:function(){
	    if (this.owner.isContainer){ 
	        var zIndex = this.owner.getNextZIndex();        
	        var canvas = this.getCanvas();
	        if (canvas != undefined)
	            canvas.css({'z-index' : zIndex});
	    }
	},
	sendToBack:function(){
	    if (this.owner.isContainer){ 
	        var canvas = this.getCanvas();
	        if (canvas != undefined)
	            canvas.css({'z-index' : 0});
	    }
	},
	getVisibility:function (el) {				
	},
	setFocus: function(){	
		try{
			var edit = $("#"+this.getFullId() +"_edit");			
			if (edit != undefined &&  edit.is(':visible') && this.isVisible()) {				
				edit.focus();							
			}else if (this.tabStop) this.getForm().setActiveControl(this);						
			this.doSetFocus();			
		}catch(e){						
			error_log("setFocus: "+e+":"+this.caption);
		}
	},
	doThemesChange: function(themeName){
	},
	doLostFocus: function(){
		try{				
			this.doDefocus();
		}catch(e){
			alert(e);
		}
	},
	doDefocus: function(){				
		var edit = $("#"+this.getFullId() +"_edit");
		if (edit && this.autoComplete && this.app.suggestionBox) {							
			if (edit.val() !="" )this.app.suggestionBox.add(edit.value);							
			this.app.suggestionBox.hide();
		}
	},
	doSetFocus: function(){
		var edit = $("#"+this.getFullId()+"_edit");		
		if (edit && this.autoComplete){			
			if (this.app.suggestionBox === undefined){			    		    			
				uses("control_suggestionBox");					
				this.app.suggestionBox = new control_suggestionBox(this.app);								
			}
			this.app.suggestionBox.setCtrl(this);
			this.app.suggestionBox.hide();
		}
	},
	eventMouseDown: function(event){	
	},
	eventMouseUp: function(event){				
	    switch (event.button)
	    {
	        case 1 :// left 
	                break;
	        case 2 :// right
	                var target = (document.all) ? event.srcElement : event.target;
	                var n = this.getFullId();	                
                    if (this.popUpMenu != undefined)
                    {
                        this.popUpMenu.setTarget(this);				
                        this.popUpMenu.popUp(event.clientX, event.clientY);
                    }
	                break;
	    }
	},
	eventMouseMove: function(event){
	    
	    if (this.hint != undefined && trim(this.hint) != ""){
            var target = (document.all) ? event.srcElement : event.target;
    	    var n = this.getFullId();	
    	    if ((target != undefined))
    	    {    	        
				if (event.clientY + 10 < system.getScreenHeight())
					window.system.showHint(event.clientX, event.clientY, this.hint,true);
				else window.system.showHint(event.clientX, event.clientY, this.hint,true);    	        
    	    }
   	    }
	},
	eventMouseOut: function(event){
	    if (this.hint != undefined)
	        window.system.hideHint();
	},
	doSysMouseDown: function(x, y, button, buttonState){
	},
	doSysMouseMove: function(x, y, button, buttonState){
	},
	doSysMouseUp: function(x, y, button, buttonState){
	},
	doKeyDown: function(keyCode, buttonState){	
	},
	doKeyUp: function(keyCode, buttonState){						
	},
	doKeyPress: function(charCode, buttonState,keyCode){				
	},
	doSizeChange: function(width, height){	 		
		$("#"+this.getFullId()).fixBoxModel();
	},
	getForm: function(){
		try{
			var result = this.owner;		
			if (window.control_childForm === undefined){
			     uses("control_childForm");
            }
			while ((result != undefined) && !(result instanceof control_commonForm  || result instanceof control_childForm))  							
				result = result.getOwner();
		}catch(e){
			error_log(this+"$getForm()"+e);
		}
	    return result;
	},
	getHint: function(){
		return this.hint;
	},
	setHint: function(data){
		//this.hint = data;	
		this.hint = "";
		this.canvas.prop("title", data);
	},
	getLeft: function(){
		return this.left;
	},
	setLeft: function(data){	 		
		$("#"+this.getFullId()).css({left: data});		
		this.left = data;//$("#"+this.getFullId()).position().left;
	},
	getTop: function(){
		return this.top;
	},
	setTop: function(data){	    		
		$("#"+this.getFullId()).css({top : data });		
		this.top = data;//$("#"+this.getFullId()).position().top;
	},
	invalidateSize : function(width, height){
	},
	getWidth: function(){
		return this.width;
	},
	setWidth: function(data){	
	   try{
    	    if (this.width != data)
    	    {    	        
    	        $("#"+this.getFullId()).width(data);
    	        this.width = $("#"+this.getFullId()).width();
    			this.doSizeChange(this.width, this.height);
    	    }	    
  	    }catch(e){
  	         systemAPI.alert(this+"$setWidth()",e);
        }
	},
	getHeight: function(){
		return this.height;
	},
	setHeight: function(data){
		try{
		    if (this.height != data)
		    {		        
				$("#"+this.getFullId()).height(data);
				this.height = $("#"+this.getFullId()).height();    
		        this.doSizeChange(this.width, this.height);			
		    }		    
		}catch(e){
			systemAPI.alert(this+"$setHeight()",e);
		}
	},
	getTabIndex: function(){
		return this.tabIndex;
	},
	setTabIndex: function(data){
		this.tabIndex = data;
	},
	isTabStop: function(){
		return this.tabStop;
	},
	setTabStop: function(data){
		this.tabStop = data;
	},
	isVisible: function(){
		return this.visible;
	},
	setVisible: function(data){
		this.visible = data;    
	    var node = this.getCanvas();
	    if (node != undefined){
			if (data)
				node.show();
			else node.hide();
	    }
	},
	getPopUpMenu: function(){
		return this.popUpMenu;
	},
	setPopUpMenu: function(data){
		this.popUpMenu = data;
	},	
	show: function(options){
		this.visible = true;
		this.getCanvas().show(options);
	},
	hide: function(options){
		this.visible = false;
		this.getCanvas().hide(options);
	},
	setTag: function(tag){
		this.tag = tag;
	},
	getTag: function(){
		return this.tag;
	},
	fade: function(){			
	},
	fadeOut: function(){		
	},
	slideVert: function(){		
	},
	setIntvl: function(data){	
		this.interval = data;
	},
	setOpacity: function(cnv,opacity){		
		if (opacity == undefined){
			opacity = cnv;
			cnv = this.getCanvas();
		}
		cnv.css({opacity : opacity/100, filter:"alpha(opacity="+opacity+")" });		
	},
	setBound:function(x, y, w, h){
		this.setLeft(x);
		this.setTop(y);
		this.setWidth(w);
		this.setHeight(h);
	},
	setData: function(data){
		this.data = data;
	},
	getData: function(){
		return this.data;
	},
	addStyle: function(style){
		var cnv = this.getCanvas();
		if (cnv !== undefined && cnv !== null){
			cnv.css(style);
		}
	},
	addNodeStyle: function(node,style){		
		if (node !== undefined && node !== null){
			node.css(style);
		}
	},
	setStyle: function(style){
		var cnv = this.getCanvas();
		if (cnv !== undefined && cnv !== null){
			cnv.css(style);
		}
	},
	removeStyle: function(){
		var cnv = this.getCanvas();
		if (cnv !== undefined && cnv !== null){
			cnv.css();
		}
	}, 
	updateByOptions: function(options){
		try{
			if (options.bound !== undefined) {
				this.setLeft(options.bound[0]);
				this.setTop(options.bound[1]);
				this.setWidth(options.bound[2]);
				this.setHeight(options.bound[3]);
			}
			if (options.height !== undefined) this.setHeight(options.height);
			if (options.left !== undefined) this.setLeft(options.left);
			if (options.top !== undefined) this.setTop(options.top);
			if (options.width !== undefined) this.setWidth(options.width);
			if (options.name !== undefined) this.setName(options.name);
			if (options.hint !== undefined) this.setHint(options.hint);			
			if (options.tag !== undefined) this.setTag(options.tag);			
			if (options.visible !== undefined) this.setVisible(options.visible);	
			if (options.border !== undefined) this.setBorder(options.border);
			if (options.corner !== undefined) this.corner(options.corner);
			if (options.cursor) this.setCursor(options.cursor);
			if (options.shadow) this.setShadow(options.shadow);

		}catch(e){
			error_log(e);
		}
	},	
	setShadow: function(shadow){
		this.getCanvas().shadow(shadow);
	},
	setBorder: function(border){
		this.getCanvas().css({border:border});
	},
	corner: function(rad){
		this.getCanvas().corner(rad);
	},
    getTargetClass: function(){
        var target = this.owner;
        while (!((target instanceof control_childForm && target.className != "control_childForm")|| 
                (target instanceof control_commonForm && target.className != "control_commonForm")|| 
                (target instanceof control_panel && target.className != "control_panel"))){        
            target = target.owner;
        }            
        return target;
    },
	addEventListener: function(event, fn, target){
		if (this.eventListener === undefined) this.eventListener = new control_arrayList();
		this.eventListener.add({event:event,method:fn, target:target});
	},
	removeEventListener: function(event, fn, target){
		this.eventListener.delObject({event:event,method:fn, target:target});	
	},
	invokeEvent: function(event,target, param){
		try{
			var obj,res;
			for (var i in this.eventListener.objList){
				obj = this.eventListener.get(i);
				if (obj.event == event && obj.target == target){					
					eval("res = target."+obj.method+"(target,param);");			
					return res;
				}
			}
		}catch(e){
			alert(e);
		}
	},	
	setAutoComplete: function(data){
		var edit = $("#"+this.getFullId()+"_edit");
		if (edit){
			this.autoComplete = data;			
			if (data) this.addEventListener("keyDown","doSearchKeyDown",this);		
		}
	},
	doSearchKeyDown: function(sender, keyCode){
		var edit = $("#"+this.getFullId()+"_edit");		
		if (this.autoComplete && this.app.suggestionBox){			
			if (keyCode == 13) this.app.suggestionBox.hide();
			else this.app.suggestionBox.search(edit.val());
		}
	},
	doSystemPaste: function(str){		
	},
	maximize: function(){
		this.setWidth(this.owner.width);
		this.setHeight(this.owner.height);
	},
	setCursor: function(cursor){
		try{
			this.getCanvas().css({cursor: cursor});
		}catch(e){
			error_log(e);
		}
	},
    addListener : function(event, listener)
	{
        try{
            var self = this;
            console.log("binding event "+event);
            switch (event)
            {
                case "click" :
                                this.canvas.bind("click", 
                                    function(e) 
                                    { 
                                        if (self.enabled)
                                        {
                                            if (!e) e = window.event; 
                                            self.emit("click", self, e.srcElement == self.canvas, e);
                                        }
                                    });
                                break;
                case "dblClick" :
                                this.canvas.bind("dblclick",
                                    function(e) 
                                    { 
                                        if (self.enabled)
                                        {
                                            if (!e) e = window.event; 
                                            self.emit("dblClick", self);
                                        }
                                    });
                                break;
                case "mouseOver" :
                                this.canvas.bind("mouseover",function(e) { if (!e) e = window.event; self.emit("mouseOver", self)});
                                break;
                case "mouseOut" :
                                this.canvas.bind("mouseout",function(e) { if (!e) e = window.event; self.emit("mouseOut", self)});
                                break;
                case "mouseUp" :
                                this.canvas.bind("mouseup", 
                                    function(e) 
                                    { 
                                        if (self.enabled)
                                        {
                                            if (!e) e = window.event; 
                                            self.emit("mouseUp", e.offsetX, e.offsetY, self);
                                        }
                                    });
                                break;
                case "mouseDown" :
                                this.canvas.bind("mousedown",
                                    function(e) 
                                    { 
                                        if (self.enabled)
                                        {
                                            if (!e) e = window.event; 
                                            self.emit("mouseDown", e.offsetX, e.offsetY, self);
                                        }
                                    });
                                break;
                case "touchStart" :
                                this.canvas.bind("touchstart", 
                                    function(e) 
                                    { 
                                        if (self.enabled)
                                        {
                                            self.emit("touchStart", 0, 0, self);
                                            e.preventDefault();
                                        }
                                    });
                                break;
                case "touchEnd" :
                                this.canvas.bind("touchend", 
                                    function(e) 
                                    { 
                                        if (self.enabled)
                                        {
                                            self.emit("touchEnd", 0, 0, self);
                                            e.preventDefault();
                                        }
                                    });
                                break;
                case "swipe" : 
                    $(this.canvas).on("swipe", function(){
                        self.emit("swipe", self);
                    });
                break;
                case "swipeleft" : 
                    $(this.canvas).on("swipeleft", function(){
                        self.emit("swipeleft", self);
                    });
                break;
                case "swiperight" : 
                    $(this.canvas).on("swiperight", function(){
                        self.emit("swiperight", self);
                    });
                break;
            }    
        }catch(e){
            console.log(e);
        }
		
		
		window.control_control.prototype.parent.addListener.call(this,event, listener);
	}
});
