//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiCB = function(owner, options){
    if (owner){
    		this.stateRO 	= "";
			this.text 		= "";
    		this.caption 	= "saiCB";
    		this.labelWidth = 100;
    		this.type 		= "text";
    		this.color = system.getConfig("text.normalBgColor");
    		this.fontColor  = system.getConfig("text.normalColor");    		
    		this.isFocused = false;    		
			this.width = 80;
    		window.control_saiCB.prototype.parent.constructor.call(this, owner,options);
	        this.className = "control_saiCB";	        
	        window.control_saiCB.prototype.parent.setWidth.call(this, 80);
	        window.control_saiCB.prototype.parent.setHeight.call(this, 20);

	        this.wantTab = false;
	        this.tabStop = true;
	        this.password = false;
	        this.readOnly = false;
	        this.textLength = 0;
			this.itemHeight = 5;
			
	        this.onDefocus = new control_eventHandler();
	        this.onKeyDown = new control_eventHandler();
	        this.onKeyPress = new control_eventHandler();
    		this.onBtnClick = new control_eventHandler();
    		this.onEnter = new control_eventHandler();
    		this.onExit = new control_eventHandler();
    		this.onChange = new control_eventHandler();
    		this.items = new control_arrayMap();
    		this.useSelection = false;
			this.mustCheck = true;
			if (options !== undefined){
				this.updateByOptions(options);				
				if (options.caption!== undefined) this.setCaption(options.caption);
				if (options.tipeText !== undefined) this.setTipeText(options.tipeText);			
				if (options.labelWidth !== undefined) this.setLabelWidth(options.labelWidth);
				if (options.color !== undefined) this.setColor(options.color);				
				if (options.fontColor !== undefined) this.setFontColor(options.fontColor);				
				if (options.alignment !== undefined) this.setAlignment(options.alignment);							
				if (options.mustCheck !== undefined) this.setMustCheck(options.mustCheck);										
				if (options.checkItem !== undefined) this.setMustCheck(options.checkItem);										
				if (options.readOnly !== undefined) this.setReadOnly(options.readOnly);
				if (options.keyDown !== undefined) this.onKeyDown.set(options.keyDown[0],options.keyDown[1]);
				if (options.keyPress !== undefined) this.onKeyPress.set(options.keyPress[0],options.keyPress[1]);
				if (options.enter !== undefined) this.onEnter.set(options.enter[0],options.enter[1]);
				if (options.change !== undefined) this.onChange.set(options.change[0],options.change[1]);
				if (options.exit !== undefined) this.onExit.set(options.exit[0],options.exit[1]);			
				if (options.text !== undefined) this.setText(options.text);
				if (options.items !== undefined) {
					for (var i in options.items) 
						this.addItem(i,options.items[i]);
				}
			}
    }
};
window.control_saiCB.extend(window.control_control);
window.saiCB = window.control_saiCB;
window.control_saiCB.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();		    	    
	    canvas.css({overflow:"hidden"});
		var lebar = this.width-this.labelWidth;
		var lft = this.width - 20, shadLeft = this.labelWidth - 8;
		this.lebar = lebar;
		var heightBg = this.height;
		var lebarBg = lebar + 18;
		var bottm = this.height-4;		
		 var html =   
				"<div id='"+n+"_frame' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
				"<div id='"+n+"_label' style='{background:url(image/themes/"+system.getThemes()+"/dot.png) bottom left  repeat-x;"+
					"position:absolute;top : 0; left:0;white-space: nowrap;font-size:11;width:100%;height:100%;}'>"+
				this.caption+" </div> "+ 							
				"<div id='"+ n +"_bg' style='position:absolute;left:"+this.labelWidth+";width:"+lebarBg+";height:100%;top:0;background:"+this.color+";border:1px solid #a3a6a8'> </div>"+
				"<input id='"+n+"_edit' type='"+this.type+"' "+this.stateRO+" value='"+this.text+"' "+
				"style='{width:"+lebar+"px;height:100%;color:"+this.fontColor+";"+
				"position:absolute;left:"+this.labelWidth+";top:0;border:1px solid #a3a6a8;"+
				"background:transparent;border-width:1;}' "+
				"onkeypress='return window.system.getResource(" + this.resourceId + ").eventKeyPress(event,\""+this+"\");' "+
				"onkeydown='return window.system.getResource(" + this.resourceId + ").eventKeyDown(event,\""+this+"\");' "+
				"onblur='window.system.getResource(" + this.resourceId + ").eventExit();' "+
				"onfocus='window.system.getResource(" + this.resourceId + ").doFocus();' "+			
				"onchange='window.system.getResource(" + this.resourceId + ").doChange();' "+				
				"/>"+
				"<img id='"+n+"_btn' src='icon/menu-down.png' style='{position:absolute; left:"+lft+
				";top:0;width:20px;height:100%;"+
				"cursor: pointer;" +
				";} '  "+
				//"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
				//"onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove(event);' " +
				//"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' " +
				//"onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
				//"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event);' " +
				"onClick='window.system.getResource(" + this.resourceId + ").eventMouseClick(event);' />" +
				"</div>";
	    this.setInnerHTML(html, canvas);
		this.input = $("#"+n+"_edit").get(0);
		this.bg = $("#"+n+"_bg").get(0);		
		canvas.bind("mouseover","$$$(" + this.resourceId + ").editMouseOver(event);");
		canvas.bind("mouseout","$$$(" + this.resourceId + ").editMouseOut(event);");		
	},
	addItem: function(id, caption){
	    var item = this.items.get(id);
	    var node = undefined;
	    var n = this.getFullId();

	    if (item == undefined){
	        item = new Array(caption);
	        this.items.set(id, item);
	        if (this.selectedId == undefined)
	        {
	            this.selectedId = id;
	            
	            node = this.edit;
	            if (node != undefined)
	                node.value = caption;
	        }
	    }
	    else
	    {
	        item = caption;
	        this.items.set(id, item);
	        
	        if (id == this.selectedId)
	        {
	            node = this.edit;
	            if (node != undefined)
	                node.value = caption;
	        }
	    }
	},
	delItem: function(id){
		this.items.del(id);  
	},
	clearItem: function(){
		this.items.clear();
		this.selectedId = undefined;	    
	    node = this.edit;		
	    if (node != undefined)
	        node.value = "";
		this.addItem("-","");
	},
	capacity: function(){
		return this.items.getLength();
	},
	indexOf: function(object){
	    var found = false;
	    var i = 0;
	    
	    while (!found && (i < this.items.length))
	    {
	        if (this.items[i] == object)
	            found = true;
	        else
	            i++;
	    }
	    
	    if (found)
	        return i;
	    else
	        return -1;
	},
	isValidItem: function(){   
		return (this.getText() == "") || (!this.mustCheck) ||(this.mustCheck && this.getText() != "" && this.items.indexOf(this.getText()) != undefined);
	},
	dropDownBoxSelect: function(sender, selectedId, caption){
	    try{

	    	this.app.dropDownCB.close();
    	    
	    	this.selectedId = selectedId;    		
    	    this.input.value = caption; 	
    	    this.onChange.call(this, caption, selectedId);
    	    this.emit("change", caption);
 	    }catch(e){
 	       alert(e);
        }
	},
	dropDownBoxDblClick: function(sender, selectedId, caption){
		this.setText(caption);
	},
	eventMouseClick: function(event){
		try{	
			if (!event) event = window.event;
			var app = this.getApplication();
			var x = event.clientX;
			var y = event.clientY;
			var canvas = this.getCanvas();
			var width = canvas.width() - this.labelWidth;
			if (document.all || window.opera)
			{					
				x = (x - event.offsetX) - width + 18;
				y = (y - event.offsetY)+ this.getHeight() - 2;
			}
			else
			{
				x = (x - event.layerX) - width + 20;
				y = (y - event.layerY)+ this.getHeight();
			}
			this.setFocus();
			if ((app.dropDownCB == undefined) || (!app.dropDownCB.visible))	
			{
						
				var owner = this.owner;

				while (!(owner.className == "control_childForm") && !(owner instanceof control_commonForm))
					owner = owner.owner;				
				if (app.dropDownCB !== undefined)
					app.dropDownCB.free();
				uses("control_dropDownBox",true);
				app.dropDownCB = new control_dropDownBox(app);//(window.app);			
						
				app.dropDownCB.onSelect.set(this, "dropDownBoxSelect");
				app.dropDownCB.onDblClick.set(this, "dropDownBoxDblClick");	
				app.dropDownCB.setItemHeight(this.itemHeight);			
				app.dropDownCB.setItems(this.items);
				// console.log("Width " + width);
				for (var i in this.items.objList){
					var item = this.items.get(i);
					// console.log(item.length * 7);
					if (width < item.length * 6.5){
						width = item.length * 6.5;
					}
				};
				// console.log("Width 2 " + width);

				app.dropDownCB.setWidth(width);
				app.dropDownCB.controller = this;
				
				app.dropDownCB.setSelectedId(this.selectedId);
				var scrHeight = app.activeForm.getHeight();
				if ((y + app.dropDownCB.getHeight()) > scrHeight)
				{
					if (document.all)
						app.dropDownCB.setTop(y - 2);
					else
						app.dropDownCB.setTop(y - 1);
				}
				else
					app.dropDownCB.setTop(y);		
				app.dropDownCB.setLeft(x);
				
				app.dropDownCB.show();
			}else { 
				if (app.dropDownCB.controller == this)
					app.dropDownCB.close();					
				else {
					app.dropDownCB.setItemHeight(this.itemHeight);
					app.dropDownCB.setItems(this.items);
					app.dropDownCB.setWidth(width);
					app.dropDownCB.controller = this;
					
					app.dropDownCB.setSelectedId(this.selectedId);
					var scrHeight = app.activeForm.getHeight();
					if ((y + app.dropDownCB.getHeight()) > scrHeight)
					{
						if (document.all)
							app.dropDownCB.setTop(y - 2);
						else
							app.dropDownCB.setTop(y - 1);
					}
					else
						app.dropDownCB.setTop(y);		
					app.dropDownCB.setLeft(x);
					
					app.dropDownCB.show();
				}
			}
		}
		catch (e){
		    alert("[saiCB]::eventMouseClick : " + e);
		}
	},
	eventMouseOver: function(event){	    
		var lbl = this.getCanvas();	
		lbl.css({color : "#000000" });
		var canvas = $("#"+this.getFullId()+"_btn").get(0);
	    //canvas.css({ backgroundPosition : "0 -21" });	  
	},
	eventMouseOut: function(event){    
	    var canvas = $("#"+this.getFullId()+"_btn").get(0); 
	    //canvas.style.backgroundPosition = "0 0";		
	},
	eventMouseDown: function(event){
	    var canvas = $("#"+this.getFullId()+"_btn").get(0);
	    //canvas.style.backgroundPosition = "0 -42";    
	},
	eventExit: function(sender){
		var input = this.bg;//$(this.getFullId()+"_edit");
		if (input != undefined)
			input.style.background = this.color;	
		this.onExit.call(this);
		this.isFocused = false;		
		if (!this.isValidItem()){
			this.app.alert(this.getText() + " tidak valid","Cek kembali isian anda");//this.getForm(),
			this.setText("");
		}
		input.style.border = system.getConfig("text.normalBorderColor");
	},
	doFocus: function(sender){		
		this.getForm().setActiveControl(this);	
		var input = this.input;//$(this.getFullId()+"_edit");
		this.onEnter.call(this);
		this.isFocused = true;		
		setCaret(input,0,input.value.length);
	},
	doChange: function(sender){
		var text = this.getText();	
		var itemIdx = this.items.indexOf(text);
	    this.onChange.call(this, text, itemIdx);
		this.emit("change", text);
	},
	getId: function(){
		var text = this.getText();		
		return this.items.indexOf(text);
	},
	doKeyDown: function(keyCode, buttonState){
    },
	doKeyPress: function(charCode, buttonState){		
	},
	eventKeyPress: function(event, sender){
		window.system.buttonState.set(event);	
	    var keyCode = document.all ? event.keyCode : event.which;
	    var charCode = document.all ? window.system.charCode[event.keyCode] : window.system.charCode[event.charCode];		
		this.onKeyPress.call(sender, charCode, window.system.buttonState); 	
	    if (system.charCode[keyCode] != undefined && keyCode > 48 && this.textLength > 0 && this.textLength <= this.getText().length)
			return false;
		else return true;
	},
	eventKeyDown: function(event, sender){
		var app = this.getApplication();
		window.system.buttonState.set(event);	
		this.onKeyDown.call(sender, event.keyCode, window.system.buttonState); 
		if ((event.keyCode == 9) || (event.keyCode == 13)){	
			this.owner.nextCtrl(this);		
			return false;
		}else if (event.keyCode == 27){
		    this.input.blur();    
			this.owner.prevCtrl(this);		
			return false;
	    }else if ((event.keyCode == 40)){
	         try{	
	            this.input.blur();
    			var app = this.getApplication();
    			if ((app.dropDownCB == undefined) || (!app.dropDownCB.visible))	
    			{
    				var x;
    				var y;
    				var canvas = this.input;//this.getCanvas();
    				var width = canvas.offsetWidth + 20;// - this.labelWidth;
   					x = findPos(window.pageCnv,canvas);
   					y = x[1] + parseInt(this.input.offsetHeight);
   					x = x[0] ;//+ this.labelWidth;
    				var owner = this.owner;
    
    				while (!(owner.className == "control_childForm") && !(owner instanceof control_commonForm))
    					owner = owner.owner;				
    				if (app.dropDownCB === undefined){
    					var app = this.getApplication();
    					uses("control_dropDownBox");
    					app.dropDownCB = new control_dropDownBox(app);//(window.app);			
    				}			
                    app.dropDownCB.setCtrl(this);					
    				app.dropDownCB.onSelect.set(this, "dropDownBoxSelect");
    				app.dropDownCB.onDblClick.set(this, "dropDownBoxDblClick");				
    				app.dropDownCB.setItems(this.items);
    				app.dropDownCB.setWidth(width);
    				app.dropDownCB.setSelectedId(this.selectedId);
    				var scrHeight = app.activeForm.getHeight();
    				if ((y + app.dropDownCB.getHeight()) > scrHeight)
    				{
    					if (document.all)
    						app.dropDownCB.setTop(y - 2);
    					else
    						app.dropDownCB.setTop(y);
    				}
    				else
    					app.dropDownCB.setTop(y);		
    				app.dropDownCB.setLeft(x + 1);
    				app.dropDownCB.setItemHeight(this.itemHeight);
    				app.dropDownCB.show();
    			}else app.dropDownCB.close();					
    		}
    		catch (e){
    		    alert("[saiCB]::eventMouseClick : " + e);
    		}    
    		return false;
        }
        if (system.charCode[event.keyCode] != undefined && event.keyCode > 48 && this.textLength > 0 && this.textLength <= this.getText().length)
			return false;
		else return true;
	},
	clear: function(){
		if (this.items.getLength() == 0) 
			this.setText("");	
		else {
			for (var i in this.items.objList){
				this.setText(this.items.get(i));
				break;
			}
		}
	},
	doLostFocus: function(){	    
	    this.onDefocus.call(this);
		this.isFocused = false;
	},
	doSetFocus: function(){
		this.isFocused = true;
	},
	getText: function(){
	 	return this.input.value;
	},
	setSelectedId: function(data){
		var item = this.items.get(data);
		//alert(item + " "+data);
		if (item != undefined)
		{
			this.setText(item);
			this.selectedId = data;
		}
	},
	setText: function(data){
		try{
			this.text = data;
			var nd = $("#"+this.getFullId()+"_edit").get(0);
			if (nd != undefined)
				nd.value = data;
			
			if (this.items != undefined)
				if (this.items.getLength()>0)
				{
					var i = this.items.indexOf(data);
					var item = this.items.getByIndex(i);
					this.selectedId = i;
				}
			this.doChange.call(this);
			this.emit("change", data);
		}catch(e){
			alert("[saiCB]::setText:"+e+"\r\n"+nd);
		}
	},
	isWantTab: function(){
		return this.wantTab;
	},
	setWantTab: function(data){
		this.wantTab = data;
	},
	isPassword: function(){
		return this.password;
	},
	setPassword: function(data){
		this.password = data;   			
	},
	isReadOnly: function(){
		return this.readOnly;
	},
	setReadOnly: function(data){
		this.readOnly = data;    
		//this.tabStop = !this.readOnly;
		
		var nd = $(this.getFullId());		
		if (this.readOnly)
		{
			this.color = system.getConfig("text.disabled");
			this.fontColor  = system.getConfig("text.disabledFontColor");
			this.stateRO = "readonly";
		}
		else
		{
			this.color = system.getConfig("text.normalBgColor");
			this.fontColor  = system.getConfig("text.normalColor");
			this.stateRO = "";
		}
		this.doDraw(nd);
	},
	setWidth: function(data){
		var n = this.getFullId();
		var nd = $(n);
		window.control_saiCB.prototype.parent.setWidth.call(this,data); 		
		this.doDraw(nd);
	},
	setLabelWidth: function(data){
		
		this.labelWidth = data;
		if (data == 0 ) this.setCaption(" ");
		var n = this.getFullId();
		var nd = $("#"+n);
		this.doDraw(nd);
	},
	setCaption: function(data){
		this.caption = data;
		var n = this.getFullId();
		var nd = $("#"+n);
		this.doDraw(nd);
	},
	getCaption: function(){
		return this.caption;	
	},
	setRightLabelCaption: function(data){
		if (this.rightLabelVisible){
			var lbr = this.width - this.rightLabelWidth;	
			this.rightLabelCaption = data;
			this.rightLabelWidth = data.length * 6;
			var canvas = $("#"+this.getFullId());
			lbr = this.width + this.rightLabelWidth;
			this.setWidth(lbr);
			this.doDraw(canvas);
		}else
		{
			var canvas = $("#"+this.getFullId() + "_rightlabel");
			var lbr = canvas.width();
			lbr = this.width - lbr;
			this.setWidth(lbr);
		}
	},
	setItem: function(item){
		this.items = item;
	},
	getItem: function(){
		return this.items;
	},
	editMouseOut: function(){
		try{
			var input = this.bg;//this.getCanvas();//$(this.getFullId()+"_edit");
			if (input == undefined) return false;
			if (this.isFocused)
			{
				input.css({ background : system.getConfig("text.focus"), 
							color : system.getConfig("text.normalColor"),
							border : system.getConfig("text.overBorderColor") });			
			}else {
				if (this.readOnly)
				{
					input.css({background : system.getConfig("text.disabled"),					
								color : system.getConfig("text.disabledFontColor"),
								border : system.getConfig("text.normalBorderColor") });
				}
				else
				{
					input.css({background : system.getConfig("text.normalBgColor"),
							color : system.getConfig("text.normalColor"),
							border : system.getConfig("text.normalBorderColor") });
				}			
			}		
		}catch(e){
			error_log(e);
		}
	},
	editMouseOver: function(){
		var input = this.bg;//this.getCanvas();//$(this.getFullId()+"_edit");
		if (input == undefined) return false;
		if (this.isFocused)
		{
			input.css({background : system.getConfig("text.focus"),
				color : system.getConfig("text.normalColor"),
				border : system.getConfig("text.overBorderColor") });
		}else {
			input.css({background : system.getConfig("text.overBgColor"),
				color : system.getConfig("text.overColor"),
				border : system.getConfig("text.overBorderColor") });
			
		}		
	},
	setColor: function(data){
	  this.color = data;
	  var editObj = $("#"+this.getFullId()+"_edit").get(0);
		if(editObj != undefined)
		{
			editObj.style.background = data;		  
			
		}
	      
	},
	getColor: function(){
		return this.color;
	},
	blur: function(){
		this.input.blur();		
	},
	setLength: function(data){	
		this.textLength = data;
	},
	setMustCheck: function(data){
		this.mustCheck = data;
	},
	setItemHeight: function(data){
		this.itemHeight = data;
	}
});
