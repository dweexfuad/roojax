//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiMemo = function(owner, options){
    if (owner){
		this.stateRO 	= "";
        this.text 		= "";
		this.caption 	= "saiLabel";
		this.labelWidth = 100;
		this.type 		= "textarea";
		this.color      = system.getConfig("text.normalBgColor");
		this.fontColor  = system.getConfig("text.normalColor");
		this.alignment  = window.alLeft;
		this.isFocused = false;
		window.control_saiMemo.prototype.parent.constructor.call(this, owner,options);
        this.className = "control_saiMemo";        
        this.setWidth(80);
        this.wantTab = false;
        this.tabStop = true;
        this.password = false;
        this.readOnly = false;
		this.tipeText = window.ttNormal;        
        this.onDefocus = new control_eventHandler();
        this.onKeyDown = new control_eventHandler();
        this.onKeyPress = new control_eventHandler();
		this.onChange = new control_eventHandler();
		this.onExit = new control_eventHandler();
		this.onEnter = new control_eventHandler();
		this.maxLength = 0;
		this.rightBtn = false;
		this.first = true;		
		this.allowTab = false;
		if (options !== undefined){
			this.updateByOptions(options);			
			if (options.caption!== undefined) this.setCaption(options.caption);			
			if (options.labelWidth !== undefined) this.setLabelWidth(options.labelWidth);
			if (options.color !== undefined) this.setColor(options.color);				
			if (options.fontColor !== undefined) this.setFontColor(options.fontColor);				
			if (options.alignment !== undefined) this.setAlignment(options.alignment);				
			if (options.readOnly !== undefined) this.setReadOnly(options.readnOnly);
			if (options.maxLength !== undefined) this.setMaxLength(options.maxLength);
			if (options.wrap !== undefined ) this.setWarp(options.wrap);
		}
    }
};
window.control_saiMemo.extend(window.control_control);
window.saiMemo = window.control_saiMemo;
window.control_saiMemo.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    canvas.css({ overflow : "hidden" });
		var lebar = this.width-this.labelWidth;
		var bottm = this.height - 1;
		var html = "";
		if (document.all)
			html =   "<div id='"+n+"_frame' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
					"<div id='"+n+"_label' style='{position:absolute;top : 3; left:0;font-size:11;width:"+this.labelWidth+"px;height:20px;}'>"+
					this.caption+" </div> "+ 
					"<div id='"+n+"_line' style='{background:url(image/themes/"+system.getThemes()+"/dot.png) bottom left repeat-x;position:absolute;top : 5; left:0;width:"+this.labelWidth+"px;height:2px;}'></div> "+ 
					"<textarea id='"+n+"_edit' "+(this.stateRO == "" ? "" : "readonly='readonly' ")+" value='"+this.text+"' "+
					"style='{width:"+lebar+"px;height:"+this.getHeight()+"px;font-size:11;resize:none;color:"+this.fontColor+";"+
					"position:absolute;left:"+this.labelWidth+";top:0;border:small solid #999999;background:"+
					this.color+";border-width:1;text-align:"+this.alignment+"; }' "+
					"onkeypress= 'system.getResource("+this.resourceId+").eventKeyPress(event,\""+this+"\");' "+
					"onkeydown= 'system.getResource("+this.resourceId+").eventKeyDown(event,\""+this+"\");' "+
					"onblur = 'window.system.getResource("+this.resourceId+").doExit();' "+
					"onfocus = 'window.system.getResource("+this.resourceId+").doFocus();' "+
					"onchange = 'window.system.getResource("+this.resourceId+").doChange();' "+
					"onmouseover = 'window.system.getResource("+this.resourceId+").eventMouseOver();' "+
					"onmouseout = 'window.system.getResource("+this.resourceId+").eventMouseOut();' "+
					"></textarea></div>";
		else 
		  html =   "<div id='"+n+"_frame' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
				"<div id='"+n+"_label' style='{background:url(image/themes/"+system.getThemes()+"/dot.png) bottom left repeat-x;position:absolute;top : 2; left:0;font-size:11;width:100%;height:18px;}'>"+
				this.caption+" </div> "+ 
				"<div id='"+n+"_line' style='{background:url(image/themes/"+system.getThemes()+"/dot.png) bottom left repeat-x;position:absolute;top : 18; left:0;font-size:11;width:"+this.labelWidth+"px;height:2px;}'></div> "+ 
				"<textarea id='"+n+"_edit' "+(this.stateRO == "" ? "" : "readonly='readonly' ")+" value='"+this.text+"' "+
				"style='{width:"+lebar+"px;height:"+(this.getHeight() - 2).toString()+"px;font-size:11;color:"+this.fontColor+";"+
				"position:absolute;left:"+this.labelWidth+";top:1;background:"+this.color+";resize:none;border-width:1;border:1px solid #999999;"+
				"text-align:"+this.alignment+";}' "+
				"onkeypress= 'system.getResource("+this.resourceId+").eventKeyPress(event,\""+this+"\");' "+
				"onkeydown= 'system.getResource("+this.resourceId+").eventKeyDown(event,\""+this+"\");' "+
				"onblur = 'window.system.getResource("+this.resourceId+").doExit();' "+
				"onchange = 'window.system.getResource("+this.resourceId+").doChange();' "+
				"onfocus = 'window.system.getResource("+this.resourceId+").doFocus();' "+
				"onmouseover = 'window.system.getResource("+this.resourceId+").eventMouseOver();' "+
				"onmouseout = 'window.system.getResource("+this.resourceId+").eventMouseOut();' "+
				"></textarea>"+
				"</div>";
	    this.setInnerHTML(html, canvas);
		this.input = $("#"+n +"_edit").get(0);
	},
	fontChange: function(sender){
	    var n = this.getFullId();   		
	},
	doKeyDown: function(keyCode, buttonState){			
	},
	doKeyPress: function(charCode, buttonState){
	},
	doFocus: function(){
		this.onEnter.call(this);
		var input = this.input;
		if ( ( this.tipeText == window.ttNilai ) && ( input != undefined) )
		{		
			 var num = input.value;
			  var numtmp ="";
			  var i;		  
			  for (i=0;i<num.length;i++)
			   {     
				if (num.charAt(i) != ".")
					 numtmp += num.charAt(i); 
			   }  
			  num = numtmp; 
			input.value = num;
		}	
		input.style.background = system.getConfig("text.focus");
		this.isFocused = true;
		this.getForm().setActiveControl(this);
	},
	eventMouseOut: function(){
		var input = this.input;
		if (this.isFocused)
		{
			input.style.background = system.getConfig("text.focus");
			input.style.color = system.getConfig("text.normalColor");
		}else {
			if (this.readOnly)
			{
				input.style.background = system.getConfig("text.disabled");
				input.style.color = system.getConfig("text.disabledFontColor");
			}
			else
			{
				input.style.background = system.getConfig("text.normalBgColor");
				input.style.color = system.getConfig("text.normalColor");
			}
		}
	},
	eventMouseOver: function(){
		var input = this.input;
		if (this.isFocused){
			input.style.background = system.getConfig("text.focus");
			input.style.color = system.getConfig("text.normalColor");
		}else {
			input.style.background = system.getConfig("text.overBgColor");
			input.style.color = system.getConfig("text.overColor");
		}
	},
	clear: function(){
		this.setText("");  
	},
	doExit: function(sender){
		this.isFocused = false;
		var input = this.input;	
		if (this.tipeText == window.ttNilai)
			input.value = RemoveTitik(this.getText());				
		input.style.background = this.color;
		this.onExit.call(this);  	
	},
	doChange: function(sender){
		this.onChange.call(this);  
	},
	doLostFocus: function(){
	    this.onDefocus.call(this);
		this.isFocused = false;
	},
	doSetFocus: function(){ 
	},
	getText: function(){
		try{
			var nd = this.input;
			if (nd != undefined)
				this.text = nd.value;
		}catch(e){
			alert("[saiLabelEdit]::getText:"+e);
		}		
		return this.text;	
	},
	setText: function(data){
		try{
			this.text = data;
			var nd = this.input;
			if (nd != undefined)
				nd.value = data;
			this.doSetFocus();
			this.doChange();
		}catch(e){
			alert("[saiLabelEdit]::setText:"+e);
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
		var nd = $(this.getFullId());
	    if (this.password)
			this.type = "password";		   
	    else this.type = "text";		   
		this.doDraw(nd);
	},
	isReadOnly: function(){
		return this.readOnly;
	},
	setReadOnly: function(data){
		this.readOnly = data;    
		this.tabStop = !this.readOnly;		
		var nd = $(this.getFullId());
		var edt = this.input;
		if (this.readOnly){
			this.color = system.getConfig("text.disabled");
			this.fontColor  = system.getConfig("text.disabledFontColor");
			this.stateRO = "readonly";
		}else{
			this.color = system.getConfig("text.normalBgColor");
			this.fontColor  = system.getConfig("text.normalColor");
			this.stateRO = "";
		}
		//this.doDraw(nd);	
		this.input.style.background = this.color;
		this.input.style.color = this.fontColor;
		this.input.readonly = "readonly";
	},
	setWidth: function(data){
		var n = this.getFullId();
		var nd = $(n);
		window.control_saiMemo.prototype.parent.setWidth.call(this,data); 
		this.doDraw(nd);
	},
	setHeight: function(data){
		var n = this.getFullId();
		var nd = $(n);
		window.control_saiMemo.prototype.parent.setHeight.call(this,data); 		
		this.doDraw(nd);
	},
	setLabelWidth: function(data){
		this.labelWidth = data;
		var nd = this.getCanvas();
		this.doDraw(nd);
	},
	setCaption: function(data){
		this.caption = data;
		var nd = this.getCanvas();
		this.doDraw(nd);
	},
	getCaption: function(data){
		return this.caption;
	},
	setAlignment: function(data){
		try{
			this.alignment = data;
			var editObj = $(this.getFullId()+"_edit");
			if(editObj != undefined)
				editObj.style.TextAlign = this.alignment;
			
		}catch(e){
			alert("[labelEdit]::setAlignment:"+e);
		}
	},
	setTipeText: function(data){
		this.tipeText = data;
		if (data == window.ttNilai)
			this.setAlignment(window.alRight);
	},
	getLineIndex: function(){
	  try{
	    var input = $(this.getFullId()+"_edit");
	    var start = 0;
	    var text = this.getText();
	    var end = text.length;	
	    if ("selectionStart" in input)
	  			start = input.selectionStart;
	  	else if (document.selection)//ie
	    {
	      var sel = document.selection.createRange();
	      var clone = sel.duplicate();
	      sel.collapse(true);
	      clone.moveToElementText(input);
	      clone.setEndPoint('EndToEnd', sel);
	      start = clone.text.length;      
			}  	
	  	text = text.substr(0,start);
	  	text = text.replace(/\s+$/gi,"");
	    var lines = text.split("\n");
	    return lines.length;
	   }catch(e){
			alert(e);
	   }     
	},
	getElements: function(){
		return this.input;
	},
	eventKeyPress: function(event, sender){
		window.system.buttonState.set(event);
		var charCode = undefined;	    
	    if (document.all)
	        charCode = window.system.charCode[event.keyCode];
	    else
	        charCode = window.system.charCode[event.charCode];			
		if ((this.maxLength != 0) && (this.maxLength <= (this.getText().length) )){						
			return false;
		}
		this.onKeyPress.call(sender, charCode, window.system.buttonState);    
	},
	eventKeyDown: function(event, sender){
		var app = this.getApplication();
		window.system.buttonState.set(event);
		if ((event.keyCode == 9 && !this.allowTab))
			this.owner.nextCtrl(this);				
		if ((this.maxLength != 0) && (this.maxLength <= (this.getText().length) )){			
			return false;
		}
		this.onKeyDown.call(sender, event.keyCode, window.system.buttonState);    
	},
	blur: function(){
		this.input.blur();
	},
	setAllowTab: function(allow){
		this.allowTab = allow;
	},
	addText: function(text){
		var nd = this.input;
		if (nd != undefined)
			nd.value = nd.value +text;	
	},
	setWarp: function(data){
		this.warp = data;
		var nd = this.input;
		if (typeof data == "String"){
			nd.wrap = data;			
		}else if (typeof data == "boolean") {
			nd.wrap = data ? "hard":"off";
		}else nd.wrap = "hard";
		
	},
	setMaxLength: function(data){
		this.maxLength = data;
	}
});
