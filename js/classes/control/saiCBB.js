//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiCBB = function(owner, options){
    if (owner){
		this.stateRO 	= "";
		this.text 		= "";
		this.caption 	= "saiLabel";
		this.labelWidth = 20;
		this.type 		= "text";
		this.color      = system.getConfig("text.normalBgColor");
		this.fontColor  = system.getConfig("text.normalColor");
		this.isFocused  = false;
		this.mode = 1;	
		this.rightLabelCaption = "";		
		window.control_saiCBB.prototype.parent.constructor.call(this, owner, options);
		this.className = "control_saiCBB";        
		this.setLabelWidth(100);
		this.setWidth(80);
		window.control_saiCBB.prototype.parent.setHeight.call(this, 20);

		this.wantTab = false;
		this.textLength = 0;
		this.tabStop = true;
		this.password = false;
		this.readOnly = false;
		this.pressKeyDown = false;		
		this.onDefocus = new control_eventHandler();
		this.onKeyDown = new control_eventHandler();
		this.onKeyPress = new control_eventHandler();
		this.onBtnClick = new control_eventHandler();
		this.onBtnRefreshClick = new control_eventHandler();
		this.onExit = new control_eventHandler();
		this.onEnter = new control_eventHandler();
		this.onChange = new control_eventHandler();
		this.onRightLabelChange = new control_eventHandler();
		
		this.items = new control_arrayMap();
		this.items2 = new control_arrayMap();
				
		this.sqlScript = "";
		this.arrayKey = [];
		this.dataCheck = false;
		
		this.operator = "";
		this.rightLabelWidth = 0;		
		this.rightLabelVisible = true;
		this.realWidth = this.width;
		this.btnVisible = true;
		this.owner = owner;		
		this.sql = "";
		this.fields = [];
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.readOnly !== undefined) this.setReadOnly(options.readOnly);
			if (options.caption!== undefined) this.setCaption(options.caption);
			if (options.tipeText !== undefined) this.setTipeText(options.tipeText);
			if (options.password !== undefined) this.setPassword(options.password);
			if (options.labelWidth !== undefined) this.setLabelWidth(options.labelWidth);
			if (options.color !== undefined) this.setColor(options.color);				
			if (options.fontColor !== undefined) this.setFontColor(options.fontColor);				
			if (options.alignment !== undefined) this.setAlignment(options.alignment);				
			if (options.rightLabelVisible !== undefined) this.setRightLabelVisible(options.rightLabelVisible);					
			if (options.btnVisible !== undefined) this.setBtnVisible(options.btnVisible);				
			if (options.textLength !== undefined) this.setTextLength(options.textLength);										
			if (options.lengthChar !== undefined) this.setTextLength(options.lengthChar);										
			if (options.maxLength !== undefined) this.setTextLength(options.maxLength);										
			if (options.btnClick !== undefined) this.onBtnClick.set(options.btnClick[0],options.btnClick[1]);										
			if (options.btnRefreshClick !== undefined) this.onBtnRefreshClick.set(options.btnRefreshClick[0],options.btnRefreshClick[1]);										
			if (options.change !== undefined) this.onChange.set(options.change[0],options.change[1]);										
			if (options.keyDown !== undefined) this.onKeyDown.set(options.keyDown[0],options.keyDown[1]);
			if (options.keyPress !== undefined) this.onKeyPress.set(options.keyPress[0],options.keyPress[1]);
			if (options.enter !== undefined) this.onEnter.set(options.enter[0],options.enter[1]);			
			if (options.exit !== undefined) this.onExit.set(options.exit[0],options.exit[1]);			
			if (options.text !== undefined) this.setText(options.text);
			if (options.sql !== undefined) this.setSQL(options.sql[0], options.sql[1],options.sql[2],options.sql[3], options.sql[4],options.sql[5],options.sql[6]);
			if (options.multiSelection !== undefined) this.setMultiSelection(options.multiSelection);
		}
    }
};
window.control_saiCBB.extend(window.control_control);
window.saiCBB = window.control_saiCBB;
window.control_saiCBB.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();	
	    canvas.style.background = " ";
	    
		var lebar = this.width-this.labelWidth - 20 - this.rightLabelWidth;;
		var lft = lebar + this.labelWidth;
		var lft2 = lft + 20;
		var bottm = this.height-4;
		var html = "";
		if (document.all)	
			html =    "<div id='"+n+"_frame' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
				"<div id='"+n+"_label' style='{background:url(image/themes/"+system.getThemes()+"/dot.png) bottom left  repeat-x;"+
				"position:absolute;top : 0; left:0;font-size:11;width:"+this.labelWidth+"px;height:100%;}'>"+this.caption+" </div> "+ 
				"<div id='"+n+"_shadow' style='{display:none;filter:alpha(opacity:0.7);opacity:0.7;moz-opacity:0.7;border:1px solid #ff9900}'>"+
				"</div>"+
				"<input id='"+n+"_edit' type='"+this.type+"' "+this.stateRO+" value='"+this.text+"' "+
				"style='{width:"+lebar+"px;height:20px;color:"+this.fontColor+";"+
				"position:absolute;left:"+this.labelWidth+";top:0;border:1px solid #a3a6a8;"+
				"background:"+this.color+";border-width:1;}' "+
				"onkeypress='return system.getResource(" + this.resourceId + ").eventKeyPress(event);' "+
				"onkeydown='return system.getResource(" + this.resourceId + ").eventKeyDown(event);' "+
				"onfocus='window.system.getResource(" + this.resourceId + ").doFocus();' "+
				"onblur='window.system.getResource(" + this.resourceId + ").eventExit();' " +
				"onchange='window.system.getResource(" + this.resourceId + ").doChange();' " +
				"onmouseover = 'window.system.getResource("+this.resourceId+").editMouseOver();' "+
				"onmouseout = 'window.system.getResource("+this.resourceId+").editMouseOut();' "+
				"/>"+
				"<div id='"+n+"_btn' style='{position:absolute; left:"+lft+";top:0;width:20px;height:100%;"+
				"background:url(icon/"+system.getThemes()+"/btnfind.png) 0 0 no-repeat;cursor: pointer} '  "+
				"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
				"onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove(event);' " +
				"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' " +
				"onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
				"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event);' " +
				"onClick='window.system.getResource(" + this.resourceId + ").eventMouseClick(event);' >" +
				"</div>"+//this.rightLabelWidth+"px
				"<div id='"+n+"_btnrefresh' style='{position:absolute; left:"+lft2+";top:-1;width:21;height:21; "+
				"background:url(icon/"+system.getThemes()+"/reload.png) 0 0 no-repeat;cursor: pointer;display:none}'  "+
				"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver2(event);' " +
				"onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove2(event);' " +
				"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown2(event);' " +
				"onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseOver2(event);' " +
				"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut2(event);' " +
				"onClick='window.system.getResource(" + this.resourceId + ").eventMouseClick2(event);' " +
				"></div>"+
				"<div id='"+n+"_rightlabel' style='{position:absolute; left:"+(lft2 + 20)+";top:0;width:100%;height:100%;display:none}'>"+this.rightLabelCaption+			
					"</div>"+
				"</div>";
		else 
			html =   "<div id='"+n+"_frame' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
				"<div id='"+n+"_label' style='{background:url(image/themes/"+system.getThemes()+"/dot.png) bottom left  repeat-x;"+
				"position:absolute;top : 0; left:0;font-size:11;width:"+this.labelWidth+"px;height:100%;}'>"+this.caption+" </div> "+ 
				"<div id='"+n+"_shadow' style='{display:none;filter:alpha(opacity:0.3);opacity:0.3;moz-opacity:0.3}'>"+				 
				 "</div>"+
				"<input id='"+n+"_edit' type='"+this.type+"' "+this.stateRO+" value='"+this.text+"' "+
				"style='{width:"+lebar+"px;height:20px;color:"+this.fontColor+";"+
				"position:absolute;left:"+this.labelWidth+";top:0;border:1px solid #a3a6a8;"+
				"background:"+this.color+";border-width:1;}' "+
				"onkeypress='return system.getResource(" + this.resourceId + ").eventKeyPress(event);' "+
				"onkeydown='return system.getResource(" + this.resourceId + ").eventKeyDown(event);' "+
				"onfocus='window.system.getResource(" + this.resourceId + ").doFocus();' "+
				"onblur='window.system.getResource(" + this.resourceId + ").eventExit();' " +
				"onchange='window.system.getResource(" + this.resourceId + ").doChange();' " +
				"onmouseover = 'window.system.getResource("+this.resourceId+").editMouseOver();' "+
				"onmouseout = 'window.system.getResource("+this.resourceId+").editMouseOut();' "+
				"/>"+
				"<div id='"+n+"_btn' style='{position:absolute; left:"+lft+";top:0;width:20px;height:100%;"+
				"background:url(icon/"+system.getThemes()+"/btnfind.png) 0 0 no-repeat;cursor: pointer;display:none} '  "+
				"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
				"onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove(event,'Search Data');' " +
				"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event);' " +
				"onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseOver(event);' " +
				"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event);' " +
				"onClick='window.system.getResource(" + this.resourceId + ").eventMouseClick(event);' >" +
				
				"</div>"+//this.rightLabelWidth+"px
				"<div id='"+n+"_btnrefresh' style='{position:absolute; left:"+lft2+";top:-1;width:21;height:21; "+
					"background:url(icon/"+system.getThemes()+"/reload.png) 0 0 no-repeat;cursor: pointer}' "+
					"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver2(event);' " +
					"onMouseMove='window.system.getResource(" + this.resourceId + ").eventMouseMove2(event,'Refresh');' " +
					"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown2(event);' " +
					"onMouseUp='window.system.getResource(" + this.resourceId + ").eventMouseOver2(event);' " +
					"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut2(event);' " +
					"onClick='window.system.getResource(" + this.resourceId + ").eventMouseClick2(event);'  "+
				"></div>"+
				"<div id='"+n+"_rightlabel' style='{position:absolute; left:"+(lft2 + 20).toString()+";top:0;width:100%;height:100%;display:none}'>"+this.rightLabelCaption+			
					"</div>"+
				"</div>";	
	    this.setInnerHTML(html, canvas);
		this.setBtnVisible(this.btnVisible);
		this.input = $(n+"_edit");
		this.shadow = $(this.getFullId() +"_shadow");	
		this.btnRefresh = $(n+"_btnrefresh");	
		this.btn = $(n+"_btn");
		eventOn(canvas,"mouseover","$$$(" + this.resourceId + ").eventMouseOver3(event);");		
		eventOn(canvas,"mouseout","$$$(" + this.resourceId + ").eventMouseOut3(event);");	
		if (systemAPI.browser.msie && systemAPI.browser.version == 6){
			/*var b1 = $( n +"_shadTop");
			var b2 = $( n +"_shadLeft");
			var b3 = $( n +"_shadBottom");
			var b4 = $( n +"_shadRight");				*/
			var b5 = $( n +"_btn");				
			var b6 = $( n +"_btnrefresh");				
			//DD_belatedPNG.fixPngArray([b1,b2,b3,b4]);
			DD_belatedPNG.fixPng(b5);DD_belatedPNG.fixPng(b6);
		}
	},
	eventMouseOut3: function(event){	   
	    if (this.btnVisible && !this.isFocused) this.btn.style.display= "none";
	},	
	eventMouseOver3: function(event){	
		if (this.btnVisible) this.btn.style.display= "";
	},	
	eventMouseMove: function(event){	
		system.showHint(event.clientX, event.clientY, "Search Data",true);
	},
	eventMouseMove2: function(event){	
		system.showHint(event.clientX, event.clientY, "Refresh",true);
	},
	eventMouseOver: function(event){		
		var lbl = this.getCanvas();	
		if (lbl !== undefined) lbl.style.color = "#000000"; 	
	    var canvas = $(this.getFullId()+"_btn");
	    switch (this.mode)
	    {
	        case 1 :
	                canvas.style.backgroundPosition = "0 -20";
	                break;
	        case 2 :
	        case 3 :
	                canvas.style.backgroundPosition = "0 -18";
	                break;
	    }
	},
	eventMouseOver2: function(event){		
		var canvas = this.btnRefresh;
		canvas.style.backgroundPosition = "0 -22";	    		
	},
	eventMouseOut2: function(event){		
		var canvas = this.btnRefresh;
		canvas.style.backgroundPosition = "0 0";	    
		system.hideHint();
	},
	eventMouseDown2: function(event){		
		var canvas = this.btnRefresh;
	    canvas.style.backgroundPosition = "0 -44";	    
	},
	eventMouseClick2: function(event){
	    this.onBtnRefreshClick.call(this,event);		
	},
	eventMouseOut: function(event){
	    var canvas = $(this.getFullId()+"_btn");    
	    canvas.style.backgroundPosition = "0 0";
	    system.hideHint();
	},
	eventMouseDown: function(event){
	    var canvas = $(this.getFullId()+"_btn");    
	    switch (this.mode)
	    {
	        case 1 :
	                canvas.style.backgroundPosition = "0 -39";
	                break;
	        case 2 :
	        case 3 :
	                canvas.style.backgroundPosition = "0 -36";
	                break;
	    }
	},
	eventMouseClick: function(event){
	    if (this.multiSelection){
			if (this.sql){
				if (this.app.fMultipleSelection === undefined) 
				{
					uses("system_fSelectOptions");
					this.app.fMultipleSelection = new system_fSelectOptions(this.app);					
					
				}
				this.app.fMultipleSelection.setCaption("Filter Data ("+(this.listDataCaption || this.caption).toString()+")");
				this.app.fMultipleSelection.setRequester(this.getTargetClass(), this, 0,0,false,undefined);		
				this.app.fMultipleSelection.setScriptSql(this.sql, this.getSqlCount(this.sql));
				this.app.fMultipleSelection.setFields(this.fields, this.operator);
				this.app.fMultipleSelection.setLabels(this.labels);
				this.app.fMultipleSelection.show(false);				
				this.app.fMultipleSelection.setFocus();				
			}else systemAPI.alert("SQL not defined.","Contact your administrator");
		}else if (this.multiSelection == false){
			if (this.sql){				
				{
					uses("util_standar");
					this.app._mainForm.listDataForm = new portalapp_fListData(this.app);
					this.app._mainForm.listDataForm.setWidth(450);
					this.app._mainForm.listDataForm.setHeight(477);			
					this.app._mainForm.listDataForm.hide();													
				}				
				this.app._mainForm.listDataForm.setCaption("Cari Data ("+(this.listDataCaption || this.caption).toString()+")");
				this.app._mainForm.listDataForm.setRequester(this.getTargetClass(), this, 0,0,false,undefined);		
				this.app._mainForm.listDataForm.setScriptSql(this.sql, this.getSqlCount(this.sql));
				this.app._mainForm.listDataForm.setFields(this.fields, this.operator);
				this.app._mainForm.listDataForm.setLabels(this.labels);
				this.app._mainForm.listDataForm.show(false);				
				this.app._mainForm.listDataForm.setFocus();				
			}else systemAPI.alert("SQL not defined.","Contact your administrator");
		}else{
			this.onBtnClick.call(this,this, event);
			this.pressKeyDown = false;
		}
	},
	eventExit: function(sender){
		this.input.style.background = this.readOnly ? system.getConfig("text.disabled") : this.color;
	    this.onExit.call(this);
		this.isFocused  = false;
		this.shadow.style.display = "none";
		this.input.style.border = system.getConfig("text.normalBorderColor");			
	},
	doFocus: function(sender){
		var input = $(this.getFullId()+"_edit");
		if (input != undefined)
			input.style.background = system.getConfig("text.focus");
		this.onEnter.call(this);
		this.isFocused  = true;
		this.getForm().setActiveControl(this);	
		this.shadow.style.display = "";
		setCaret(input,0,input.value.length);
		if (this.btnVisible) this.btn.style.display = "";
	},
	doKeyDown: function(keyCode, buttonState){
	},
	doKeyPress: function(charCode, buttonState){		
	},
	doChange: function(sender){	
		this.setRightLabelCaption("");
		this.onChange.call(this); 
	},
	eventKeyPress: function(event, sender){
		try{		
			window.system.buttonState.set(event);		
		    var keyCode = document.all ? event.keyCode: event.which;
		    var charCode = document.all ? system.charCode[event.keyCode] : system.charCode[event.charCode];		
			if (keyCode != 40)
				this.pressKeyDown = false;		
			this.onKeyPress.call(sender, charCode, window.system.buttonState);    
			if (system.charCode[keyCode] != undefined && keyCode > 48 && this.textLength > 0 && this.textLength <= this.getText().length)
				return false;
			else return true;
		}catch(e){
			alert("saiCBBL:keypress:"+e);
		}	
	},
	eventKeyDown: function(event, sender){
		window.system.buttonState.set(event);
		var tab = false;
		if (event.keyCode == 9){
			tab = true;
		}	
		if (event.keyCode == 13 || tab)
		{
			this.owner.nextCtrl(this);
			this.pressKeyDown = false;	
		}else if ((event.keyCode == 27))
		{
		    this.input.blur();    
			this.owner.prevCtrl(this);
			this.pressKeyDown = false;	
		}else if ((event.keyCode == 40)&&(!this.pressKeyDown))
		{
			this.pressKeyDown = true;
			if (this.multiSelection){
				if (this.sql){
					if (system.fMultipleSelection === undefined) 
					{
						uses("system_fSelectOptions");
						this.app.fMultipleSelection = new system_fSelectOptions(this.app);					
						
					}
					this.app.fMultipleSelection.setCaption("Cari Data ("+(this.listDataCaption || this.caption).toString()+")");
					this.app.fMultipleSelection.setRequester(this.getTargetClass(), this, 0,0,false,undefined);		
					this.app.fMultipleSelection.setScriptSql(this.sql, this.getSqlCount(this.sql));
					this.app.fMultipleSelection.setFields(this.fields, this.operator);
					this.app.fMultipleSelection.setLabels(this.labels);
					this.app.fMultipleSelection.show(false);				
					this.app.fMultipleSelection.setFocus();				
				}else systemAPI.alert("SQL not defined.","Contact your administrator");
			}else if (this.multiSelection == false){
				if (this.sql){				
					{
						uses("util_standar");
						this.app._mainForm.listDataForm = new portalapp_fListData(this.app);
						this.app._mainForm.listDataForm.setWidth(450);
						this.app._mainForm.listDataForm.setHeight(477);			
						this.app._mainForm.listDataForm.hide();													
					}
					this.app._mainForm.listDataForm.setCaption("Cari Data ("+(this.listDataCaption || this.caption).toString()+")");
					this.app._mainForm.listDataForm.setRequester(this.getTargetClass(), this, 0,0,false,undefined);		
					this.app._mainForm.listDataForm.setScriptSql(this.sql, this.getSqlCount(this.sql));
					this.app._mainForm.listDataForm.setFields(this.fields, this.operator);
					this.app._mainForm.listDataForm.setLabels(this.labels);
					this.app._mainForm.listDataForm.show(false);				
					this.app._mainForm.listDataForm.setFocus();				
				}else systemAPI.alert("SQL not defined.","Contact your administrator");
			}else{
				this.onBtnClick.call(this,this, event);
				this.pressKeyDown = true;
			}
			return false;
		}else if (event.keyCode != 40)
			this.pressKeyDown = false;
		this.onKeyDown.call(sender, event.keyCode, window.system.buttonState);    
		if (tab)
			return false;
		if (system.charCode[event.keyCode] != undefined && event.keyCode > 48 && this.textLength > 0 && this.textLength <= this.getText().length)
			return false;
		else return true;		
	},
	doLostFocus: function(fromEdit){
		window.control_saiCBB.prototype.parent.doLostFocus.call(this);
	    if (this.activeChar != undefined)
	        this.activeChar.style.background = "";    
		this.isFocused  = false;
		this.onDefocus.call(this);
		this.shadow.style.display = "none";
		if (this.btnVisible && fromEdit == undefined) this.btn.style.display = "none";
		if (this.sql) this.checkItem();		
	},
	blur: function(){
		this.input.blur();
		this.shadow.style.display = "none";
	},
	getText: function(){
	 	var nd = this.input;
		this.text = nd.value;
	    return this.text;	
	},
	setText: function(data, rightCaption){	
		if (data == undefined) data = "";
	    this.text = data;				
	    var nd = $(this.getFullId()+"_edit");
		if (nd != undefined)
			nd.value = data;	
		this.setRightLabelCaption(rightCaption !== undefined ? rightCaption : "");						
		this.onChange.call(this);		
		this.pressKeyDown = false;
	},
	clear: function(data){
		this.setText("");
		this.setRightLabelCaption("");
		this.dataSelection = undefined;	
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
		if (nd != undefined)
		{
			if (this.password)
				this.type = "password";		   
			else this.type = "text";		   
			this.input.type = this.type;
			//this.doDraw(nd);
		}
	},
	isReadOnly: function(){
		return this.readOnly;
	},
	setReadOnly: function(data){
		this.readOnly = data;    
		//this.tabStop = !this.readOnly;		
		this.stateRO = data ? "readonly": "";
		this.input.readOnly = data;	
		this.input.style.background = data ? system.getConfig("text.disabled") : this.color;
		if (document.all)
			this.input.color = data ? system.getConfig("text.disabledFontColor") : this.fontColor;		
		else 
			this.input.style.color = data ? system.getConfig("text.disabledFontColor") : this.fontColor;		
	},
	setWidth: function(data){
		var n = this.getFullId();
		var nd = $(n);
		window.control_saiCBB.prototype.parent.setWidth.call(this,data); 
		this.doDraw(nd);
	},
	setLabelWidth: function(data){
		this.labelWidth = data;		
		var nd = this.getCanvas();
		this.doDraw(nd);
	},
	setCaption: function(data){
		this.caption = data;
		var nd = $(this.getFullId() +"_label");	
		if (nd != undefined) nd.innerHTML = data;
	},
	getCaption: function(){
		return this.caption;	
	},
	setRightLabelCaption: function(data){
		if (data == undefined) data = "";		
		this.onRightLabelChange.call(this, data);			
	},
	setItem: function(item){
		this.items = item;
	},
	getItem: function(){
		return this.items;
	},
	setItem2: function(item){
		this.items2 = item;
	},
	getItem2: function(){
		return this.items2;
	},
	isRightLabelVisible: function(){
		return this.rightLabelVisible;
	},
	setRightLabelVisible: function(data){
		try{			
		}catch(e){
			alert("saiCBBL:setRightLabelVisible"+e);
		}	
	},
	clearItem: function(){
		this.items = [];
		this.items2 = [];
	},
	editMouseOut: function(){
		var input = this.input;//$(this.getFullId()+"_edit");
		if (input == undefined) return false;
		if (this.isFocused)
			this.shadow.style.display = "";
		else
			this.shadow.style.display = "none";	
		this.input.style.background = this.readOnly ? system.getConfig("text.disabled") : this.isFocused ? system.getConfig("text.focus") : this.color;
		if (document.all){
			this.input.color = this.readOnly ? system.getConfig("text.disabledFontColor") : this.isFocused ? system.getConfig("text.normalColor") : this.fontColor;	
			this.input.style.border = system.getConfig("text.overBorderColor");			
		}else{
			this.input.style.color = this.readOnly ? system.getConfig("text.disabledFontColor") : this.isFocused ? system.getConfig("text.normalColor") : this.fontColor;	
			this.input.style.border = this.isFocused ? system.getConfig("text.overBorderColor") : system.getConfig("text.normalBorderColor");			
		}
	},
	editMouseOver: function(){
		var input = this.input;//$(this.getFullId()+"_edit");
		if (input == undefined) return false;	
		this.input.style.background = this.readOnly ? system.getConfig("text.disabled") : this.isFocused ? system.getConfig("text.focus") : system.getConfig("text.overBgColor");
		if (document.all){
			this.input.color = this.readOnly ? system.getConfig("text.disabledFontColor") : this.isFocused ? system.getConfig("text.normalColor") : system.getConfig("text.overColor");			
			this.input.style.border = system.getConfig("text.overBorderColor");			
		}else{
			this.input.style.color = this.readOnly ? system.getConfig("text.disabledFontColor") : this.isFocused ? system.getConfig("text.normalColor") : system.getConfig("text.overColor");
			this.input.style.border = system.getConfig("text.overBorderColor");			
		}
		this.shadow.style.display = "";
	},
	setColor: function(data){
		this.color = data;  
		if(this.input != undefined)
	        this.input.style.background = data;		      
	},
	setFontColor: function(data){
		this.fontColor = data;
		if(this.input != undefined){
			if (document.all)
				this.input.color = data;		  
			else 
				this.input.style.color = data;		  
		}
	},
	getColor: function(){
		return this.color;
	},
	setBtnVisible: function(data){
		this.btnVisible = data;
		/*var canvas = $(this.getFullId()+"_btn");			
		if (data)	
			canvas.style.display = "";
		else
			canvas.style.display = "none";*/
	},
	setLength: function(data){	
		this.textLength = data;
	},
	setTextLength: function(data){	
		this.textLength = data;
	},
	checkItem: function(notWithRightLabel){		
		this.notWithRightLabel = notWithRightLabel == undefined ? false: notWithRightLabel;
		if (this.getText() == "") return false;	
		if (this.getText() == "-") return false;	
		if (this.fields[0] == undefined || this.fields[0] == "") return false;
		if (this.sql == "") {
			this.app.alert(this.getForm(), "Properti SQL belum didefinisikan","Eksekusi batal dilanjutkan");
			return false;
		}
		
		if (this.dbLib == undefined) return false;
//--masih belum bisa complex sql			
		if (this.sql.lastIndexOf("where") == -1)
			this.dbLib.getDataProviderA(this.sql +" where "+this.fields[0]+" = '"+this.getText()+"' ", undefined,this);
		else this.dbLib.getDataProviderA(this.sql +" and "+this.fields[0]+" = '"+this.getText()+"' ", undefined,this);
		if (this.doubleCheck) this.status = 1;
	},
	free: function(){
		if (this.dbLib != undefined) this.dbLib.delListener(this);
		window.control_saiCBB.prototype.parent.free.call(this);	
	},
	setSQL: function(sql, fields, doubleCheck, labels, operator, caption, checkItem){
		this.sql = sql;	
		this.fields = fields;
		this.doubleCheck = false;
		this.labels = labels;//label edit and grid
		this.operator = operator;//search filter
		if (typeof doubleCheck == "boolean") this.doubleCheck = doubleCheck;
		//uses("util_dbLarge");
		this.dbLib = this.app.dbLib || new util_dbLib();		
		this.dbLib.addListener(this);
		this.listDataCaption = caption;
		this.needCheckItem = checkItem === undefined ? true: checkItem;
	},
	doRequestReady: function(sender, methodName, result, callObj){
		try{				
			if (sender == this.dbLib && this == callObj){						
				switch (methodName){
					case "getDataProvider" :								
                        eval('result = ' + result +';');
						if (typeof(result) !== "string"){						
							var row = result.rs.rows[0];
							if (row == undefined) {
							    if (this.doubleCheck && this.status == 1){
							         if (this.sql.lastIndexOf("where") == -1)
             			                this.dbLib.getDataProviderA(this.sql +" where "+this.fields[1]+" = '"+this.getText()+"' ", undefined, this);
                                     else this.dbLib.getDataProviderA(this.sql +" and "+this.fields[1]+" = '"+this.getText()+"' ", undefined, this);
							         this.status = 2;
							         return;
                                }else if (!this.doubleCheck || this.status == 2){									
									throw("Data "+this.getText()+" tidak ditemukan.");
								}else if (this.status == 3) return;
                            }
							if (row.msg != undefined && row.msg.toLowerCase().search("error") != -1) throw(row.msg+"<br>Hubungi administrator anda");					
							
							var field0 = this.fields[0].substr(this.fields[0].indexOf(".")+1);
							var field1 = this.fields[1].substr(this.fields[1].indexOf(".")+1);
							
							if (this.doubleCheck && this.status  == 2){	
								this.status = 3;
                                eval("var rightLbl = row." +field1+";this.setText(row." +field0+");");     
							}else eval("var rightLbl = row." +field1);													
							if (!this.notWithRightLabel) this.setRightLabelCaption(rightLbl);
						}else throw("Ada Kesalahan transfer data " +result+"<br>Hubungi administrator anda");
						break;
				}
			}
		}catch(e){
			this.status = 3;
			this.fadeBackground("ff9900","ff0000",10,100,this.getFullId()+"_edit");			
			this.app.alert(e,"Cek kembali data inputan anda (field " + this.getCaption()+").");
			this.setText("");
		}
	},
	getRightLabelCaption : function(){
		return this.rightLabelCaption;
	},
	setMultiSelection : function(data){
		this.multiSelection = data;
	},
	getSqlCount: function(sql){
		var pos = sql.indexOf("select");
		var str1 = sql.substr(pos,pos+7);
		pos = sql.indexOf("from");
		var str2 = sql.substr(pos);
		return str1 +" count(*) "+str2;
	},
	clear: function(){
		this.setText("");
	},
	convertFilter: function(field){
		if (this.dataFilter === undefined) return "";
		var filterStr = "";
		var filter = this.dataFilter;
		if (filter.get("=").length != 0) filterStr = field + " in ("+filter.get("=")+")";
		if (filter.get("range").getLength() != 0) {
			tmp = filter.get("range");
			var tmp2 = "";
			for (var i in tmp.objList){
				if (tmp2 != "") tmp2 += " or ";
				tmp2 += field + " "+tmp.get(i);							
			}
			if (tmp2 != "") {
				if (filterStr != "") filterStr += " or ";
				filterStr += "("+ tmp2 +")";
			}
		}					
		if (filter.get("like").getLength() != 0) {
			tmp = filter.get("like");
			var tmp2 = "";
			for (var i in tmp.objList){
				if (tmp2 != "") tmp2 += " or ";
				tmp2 += field + " "+tmp.get(i);							
			}
			if (tmp2 != "") {
				if (filterStr != "") filterStr += " or ";
				filterStr += "("+ tmp2 +")";
			}
		}
		if (filterStr != "") filterStr = "(" + filterStr +")";
		return filterStr;
	}
});
