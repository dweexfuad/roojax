//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiEdit = function(owner, options)
{
    if (owner)
    {
    		this.stateRO 	= "";
    		this.type 		= "";
    		this.color      = system.getConfig("text.normalBgColor");
    		this.fontColor  = system.getConfig("text.normalColor");
    		this.tipeText   = window.ttNormal;
    		this.alignment = window.alLeft;
    		this.isFocused = false;
		
	        window.control_saiEdit.prototype.parent.constructor.call(this, owner, options);
	        this.className = "control_saiEdit";
	        
	        this.setWidth(80);
	        window.control_saiEdit.prototype.parent.setHeight.call(this, 20);

	        this.wantTab = false;

	        this.tabStop = true;
	        this.password = false;
	        this.readOnly = false;
	        this.textLength = 0;
	        this.onDefocus = new control_eventHandler();
	        this.onKeyDown = new control_eventHandler();
	        this.onKeyPress = new control_eventHandler();
    		this.onExit = new control_eventHandler();
    		this.onChange = new control_eventHandler();
    		this.onEnter = new control_eventHandler();    		
			if (options !== undefined){
				this.updateByOptions(options);				
				if (options.text!== undefined) this.setText(options.text);
				if (options.tipeText !== undefined) this.setTipeText(options.tipeText);
				if (options.password !== undefined) this.setPassword(options.password);				
				if (options.color !== undefined) this.setColor(options.color);				
				if (options.fontColor !== undefined) this.setFontColor(options.fontColor);				
				if (options.alignment !== undefined) this.setAlignment(options.alignment);				
				if (options.readOnly !== undefined) this.setReadOnly(options.readOnly);
				if (options.lengthChar !== undefined) this.setLength(options.lengthChar);
				if (options.maxLength !== undefined) this.setLength(options.maxLength);										
				if (options.keyDown !== undefined) this.onKeyDown.set(options.keyDown[0],options.keyDown[1]);
				if (options.keyPress !== undefined) this.onKeyPress.set(options.keyPress[0],options.keyPress[1]);
				if (options.enter !== undefined) this.onEnter.set(options.enter[0],options.enter[1]);
				if (options.change !== undefined) this.onChange.set(options.change[0],options.change[1]);
				if (options.exit !== undefined) this.onExit.set(options.exit[0],options.exit[1]);			
			}
    }
};
window.control_saiEdit.extend(window.control_control);
window.saiEdit = window.control_saiEdit;
window.control_saiEdit.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    canvas.css({background :  " ", overflow: "hidden"});
	    
		var html = "<div id='"+n+"_border' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
			"<input id='"+n+"_edit' type='"+this.type+"' value='saiEdit' "+this.stateRO+" "+
			"style='{width:"+this.width+"px;height:100%;position:absolute;top:0; "+
			"border:1px solid #a3a6a8;background:"+this.color+";color:"+this.fontColor+";border-width:1;}' "+
			"onkeypress='return window.system.getResource("+this.resourceId+").eventKeyPress(event,\""+this+"\");' "+
			"onkeydown='return window.system.getResource("+this.resourceId+").eventKeyDown(event,\""+this+"\");' "+
			"onblur='window.system.getResource("+this.resourceId+").doExit(\""+this+"\")' "+
			"onchange='window.system.getResource("+this.resourceId+").doChange(\""+this+"\")' "+
			"onfocus='window.system.getResource("+this.resourceId+").doFocus(\""+this+"\")' "+
			"onmouseover = 'window.system.getResource("+this.resourceId+").eventMouseOver();' "+
			"onmousemove = 'window.system.getResource("+this.resourceId+").eventMouseMove(event);' "+
			"onmouseout = 'window.system.getResource("+this.resourceId+").eventMouseOut();' "+
			"/></div>";

	    this.setInnerHTML(html, canvas);
		this.input = $("#"+n +"_edit").get(0);
	},
	doKeyDown: function(keyCode, buttonState){	
	},
	doKeyPress: function(charCode, buttonState){			
	},
	eventKeyPress: function(event, sender){
		window.system.buttonState.set(event);
	    var keyCode = document.all ? event.keyCode: event.which;
		var charCode = document.all ? system.charCode[event.keyCode] : system.charCode[event.charCode];		
		var input = this.input;
		if (this.tipeText == window.ttNilai)
		{
			var reg = /\d/;		
			var isFirstN = true ? charCode == '-' && input.value.indexOf('-') == -1 && start == 0: false;
		 	var isFirstD = true ? charCode == ',' && input.value.indexOf(',') == -1 : false;
			if (!(reg.test(charCode)) && (!isFirstN) && (!isFirstD))
				return false;
		}else if (this.tipeText == window.ttAngka)
		{
			var reg = /\d/;	
			if (!(reg.test(charCode)))
				return false;
		}
		this.onKeyPress.call(sender, charCode, window.system.buttonState); 
		this.emit("keypress", charCode, keyCode);
		if (system.charCode[keyCode] != undefined && keyCode > 48 && this.textLength > 0 && this.textLength <= this.getText().length)
			return false;
		else return true;
	},
	eventKeyDown: function(event, sender){
		window.system.buttonState.set(event);
		var app = this.getApplication();
		if ((event.keyCode == 9) || (event.keyCode == 13))
		{
			this.owner.nextCtrl(this);
		}
		if ((event.keyCode == 27))
		{
		    this.input.blur();  
			this.owner.prevCtrl(this);
		}
		this.onKeyDown.call(sender, event.keyCode, window.system.buttonState); 
		if (system.charCode[event.keyCode] != undefined && event.keyCode > 48 && this.textLength > 0 && this.textLength <= this.getText().length)
			return false;
		else return true;
	},
	clear: function(){
		this.setText("");
	},
	doExit: function(sender){
		var input = this.input;	
		if (input == undefined) return false;
		if (this.tipeText == window.ttNilai)
			this.setText(strToNilai(this.getText()));			
		input.style.background = this.color;
		this.onExit.call(sender);
		this.isFocused = false;
		input.style.border = system.getConfig("text.normalBorderColor");	
	},
	doChange: function(sender){
		this.onChange.call(sender);
		this.emit("change", this.getText());
	},
	doLostFocus: function(){
		window.control_saiEdit.prototype.parent.doLostFocus.call(this);
	    if (this.activeChar != undefined)
			this.activeChar.style.background = "";    
	    this.isFocused = false;
	    this.onDefocus.call(this);
	},
	doSetFocus: function(){
	    var nd = this.input;
		if (nd != undefined)
			nd.focus();
		this.isFocused = true;	
		window.control_saiEdit.prototype.parent.doSetFocus.call(this);
	},
	doFocus: function(){
		this.getForm().setActiveControl(this);
		var input = this.input;
		if ( ( this.tipeText == window.ttNilai ) && ( input != undefined) )
		{		
			 input.text= nilaiToStr(this.getText());
		}
		input.style.background = system.getConfig("text.focus");
		this.isFocused = true;
		setCaret(this.input,0,this.input.value.length);
	},
	getText: function(){
	 	var nd = this.input;
		if (nd != undefined)
			this.text = nd.value;
		if (this.tipeText == ttHurufBesar || this.tipeText == ttUpperCase) this.text = this.text.toUpperCase();
		else if (this.tipeText == ttHurufKecil || this.tipeText == ttLowerCase) this.text = this.text.toLowerCase();
	    return this.text;	
	},
	setText: function(data){
	    this.text = data;
	    var nd = this.input;
		if (nd != undefined)
		{
			if (this.tipeText == window.ttNilai)
				nd.align = 'right';
			nd.value = data;	
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
		var nd = this.getCanvas();
	    if (this.password)
			this.type = "password";		   
	    else this.type = "text";		   
		this.doDraw(nd);
	},
	isReadOnly: function(){
		return this.readOnly;
	},
	setReadOnly: function(data){
		try{
			this.readOnly = data;    
			this.input.readOnly = data;		
			//this.tabStop = !this.readOnly;		
			var edt = this.input;
			if (this.readOnly){
				this.color = system.getConfig("text.disabled");
				this.fontColor  = system.getConfig("text.disabledFontColor");			
			}
			else{
				this.color = system.getConfig("text.normalBgColor");
				this.fontColor  = system.getConfig("text.normalColor");			
			}	
			this.input.style.background = this.color;
			this.input.style.color = this.fontColor;
		}catch(e){
			alert("[saiEdit]::setReadOnly:"+e);
		}
	},
	setWidth: function(data){
		var n = this.getFullId();
		var nd = this.getCanvas();
		window.control_saiEdit.prototype.parent.setWidth.call(this,data); 	
		this.doDraw(nd);
	},
	setTipeText: function(tipe){
		this.tipeText = tipe;
		if (tipe == window.ttNilai)
			this.setAlignment(window.alRight);
		else if (tipe == ttHurufBesar || tipe == ttUpperCase) this.input.style.textTransform = "uppercase";
		else if (tipe == ttHurufKecil || tipe == ttLowerCase) this.input.style.textTransform = "lowercase";
	},
	getTipeText: function(){
		return this.tipeText;
	},
	setAlignment: function(data){
		this.alignment = data;
		var editObj = this.input;
		if(editObj != undefined)
			editObj.style.textAlign = this.alignment;
	},
	eventMouseOut: function(){
		var input = this.input;
		if (this.isFocused){
			input.style.background = system.getConfig("text.focus");
			input.style.color = system.getConfig("text.normalColor");
			input.style.border = system.getConfig("text.overBorderColor");			
		}else {
			if (this.readOnly){
				input.style.background = system.getConfig("text.disabled");
				input.style.color = system.getConfig("text.disabledFontColor");
			}
			else{
				input.style.background = system.getConfig("text.normalBgColor");
				input.style.color = system.getConfig("text.normalColor");
			}
			input.style.border = system.getConfig("text.normalBorderColor");			
		}
	},
	eventMouseOver: function(event){
		var input = this.input;
		if (this.isFocused){
			input.style.background = system.getConfig("text.focus");
			input.style.color = system.getConfig("text.normalColor");			
		}else {
			input.style.background = system.getConfig("text.overBgColor");
			input.style.color = system.getConfig("text.overColor");
		}	
		input.style.border = system.getConfig("text.overBorderColor");			
	},
	setColor: function(data){
		this.color = data;
		var editObj = this.input;
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
	}
});
