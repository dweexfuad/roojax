//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_datePicker = function(owner, options)
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
			this.labelWidth = 100;
			this.formatDate = "dd-mm-yyyy";
			
	        window.control_datePicker.prototype.parent.constructor.call(this, owner, options);
	        this.className = "control_datePicker";
	        
	        this.setWidth(80);
	        window.control_datePicker.prototype.parent.setHeight.call(this, 20);

	        this.wantTab = false;
			this.popupVisible = false;
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
				if (options.caption!== undefined) this.setCaption(options.caption);		
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
				if (options.format !== undefined) this.setFormatDate(options.format);
				if (options.labelWidth !== undefined) this.setLabelWidth(options.labelWidth);
			}
			
    }
};
window.control_datePicker.extend(window.control_control);
window.datePicker = window.control_datePicker;
window.control_datePicker.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    canvas.css({background :  " ", overflow: ""});
	    var n = this.getFullId();	    	  
		var lebar = this.width-this.labelWidth;
		var html = "<div id='"+n+"_border' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'> "+
					"<label id='"+n+"_label' for='"+n+"_edit'  style='position:absolute;top : 5; left:0;width:100%;height:100%;text-overflow:ellipsis;overflow:hidden' "+
					"onmousemove = '$$$("+this.resourceId+").eventMouseMove(event);' "+
					">Label </label> "+ 				
					"<input id='"+n+"_edit' type='text'  class='datepicker' "+
					"style='{width:"+lebar+"px;height:100%;font-family:Arial;color:"+this.fontColor+";"+
					"position:absolute;left:"+this.labelWidth+";top:0;background:"+this.color+";border-radius:;"+//border:1px solid #a3a6a8;border-width:1;
					"text-align:"+this.alignment+";}' "+
					"onkeypress= 'return $$$("+this.resourceId+").eventkeypress(event);' "+
					"onkeydown= 'return $$$("+this.resourceId+").eventkeydown(event);' "+
					"onkeyup= 'return $$$("+this.resourceId+").eventkeyup(event);' "+
					"onblur = '$$$("+this.resourceId+").doExit();' "+
					"onchange = '$$$("+this.resourceId+").doChange();' "+
					"onfocus = '$$$("+this.resourceId+").doFocus();' "+
					"onmouseover = '$$$("+this.resourceId+").eventMouseOver(event);' "+			
					"onmouseout = '$$$("+this.resourceId+").eventMouseOut(event);' "+
					"onmousemove = '$$$("+this.resourceId+").eventMouseMove(event);' "+
			"/><div id='"+ n +"_btn' style='position:absolute;width:20px;height:100%;left:"+(this.width - 20)+"px'><span style='top:5px;left:5px;position:absolute;'><i class='fa fa-calendar' /></span></div></div>";

	    this.setInnerHTML(html, canvas);
		//$("#"+n +"_edit").datepicker({format:"dd-mm-yyyy"});
		this.input = $("#" + n + "_edit");
		$("#" + n + "_btn").click(() => {
			// if (document.getElementById('cal')){
			// 	pureJSCalendar.close();
			// }else {
			// 	var d =new Date();
			// 	var w = $("#cal").width(); 
			// 	var x = this.input.offset().left;
			// 	if (this.input.offset().left + w > $(window).width()){
			// 		x = this.input.offset().left + this.input.width() - w; 
			// 	}
			// 	pureJSCalendar.open(this.formatDate, x, this.input.offset().top - 23 , 1, '2018-1-1', d.getFullYear() + '-12-31', this.getFullId() +"_edit", 1020);
			// }
			try{
				var app = this.getApplication();
				if (app.systemDatePickerForm != undefined && this.popupVisible){
					app.systemDatePickerForm.close();
					this.popupVisible = false;
				}else{
					this.showPopup();
				}		
				
			}catch(e){
				console.log(e);
			}
			
		});
		
	},
	showPopup: function(){
		this.popupVisible = true;
		var app = this.app;
		var canvas = this.getCanvas();
		//var width = canvas.offsetWidth + 20;// - this.labelWidth;
		var x = this.input.offset().left;
		var y = this.input.offset().top + this.height;//x[1] + parseInt(canvas.offsetHeight,10);
		uses("datePickerForm", true);		
		if (app.systemDatePickerForm != undefined){
			app.systemDatePickerForm.close();
			app.systemDatePickerForm.free();
		}
		app.systemDatePickerForm = new datePickerForm(app);
		app.systemDatePickerForm.formatDate = this.formatDate;
		//x = x[0] ;
		app.systemDatePickerForm.onSelect.set(this, "pickerFormSelect");
	
		app.systemDatePickerForm.setSelectedDate(this.year, this.month, this.day);
		var scrHeight = system.screenHeight;
		if ($(window).width() < x + 240){
			x = $(window).width() - 240;
		}
		app.systemDatePickerForm.setLeft(x);
		if ((y + app.systemDatePickerForm.getHeight()) > scrHeight)
		{
			if (document.all)
				app.systemDatePickerForm.setTop(y - this.getHeight() - app.systemDatePickerForm.getHeight() + 1);
			else
				app.systemDatePickerForm.setTop(y - this.getHeight() - app.systemDatePickerForm.getHeight() - 1);
		}else
			app.systemDatePickerForm.setTop(y);
		app.systemDatePickerForm.bringToFront();
		app.systemDatePickerForm.show();
	},
	setLabelWidth: function(w){
		$("#"+ this.getFullId() +"_label").css({width : w});
		$("#"+ this.getFullId() +"_edit").css({left:w, width : this.width - w});
	},
	pickerFormSelect: function(sender,yy,mm,dd, date){
		//this.setDate(yy, mm, dd);    
		this.setText(date);
	    //this.onSelect.call(this, yy, mm, dd);	
	},
	setFormatDate: function(format){
		this.formatDate = format;
	},
	setCaption: function(data){
		this.caption = data;
		this.getCanvas().attr("title",data);
		$("#"+ this.getFullId() +"_label").html(data);
	},
	getCaption: function(){
		return this.caption;
	},
	doKeyDown: function(keyCode, buttonState){	
	},
	doKeyPress: function(charCode, buttonState){			
	},
	eventKeyPress: function(event, sender){
		window.system.buttonState.set(event);
	    
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
		
		this.onExit.call(sender);
		this.isFocused = false;
		//pureJSCalendar.close();
		//input.style.border = system.getConfig("text.normalBorderColor");	
	},
	doChange: function(sender){
		this.onChange.call(sender);
		this.emit("change", this.getText());
	},
	doLostFocus: function(){
		window.control_datePicker.prototype.parent.doLostFocus.call(this);
	   
	    this.isFocused = false;
		this.onDefocus.call(this);
		//pureJSCalendar.close();
	},
	doSetFocus: function(){
	    var nd = this.input;
		if (nd != undefined)
			nd.focus();
		this.isFocused = true;	
		window.control_datePicker.prototype.parent.doSetFocus.call(this);

	},
	doFocus: function(){
		this.getForm().setActiveControl(this);
		if ((this.app.systemDatePickerForm != undefined) && (this.app.systemDatePickerForm.visible)){	 
			this.showPopup();
		}
		// var input = this.input;
		// if ( ( this.tipeText == window.ttNilai ) && ( input != undefined) )
		// {		
		// 	 input.text= nilaiToStr(this.getText());
		// }
		// input.style.background = system.getConfig("text.focus");
		// this.isFocused = true;
		// setCaret(this.input,0,this.input.value.length);
	
		
	},
	getText: function(){
	 	
	    return this.input.val();	
	},
	setText: function(data){
	   this.input.val(data);
	},
	isWantTab: function(){
		return this.wantTab;
	},
	setWantTab: function(data){
		this.wantTab = data;
	},
	
	isReadOnly: function(){
		return this.readOnly;
	},
	setReadOnly: function(data){
		try{
			this.readOnly = data;    
			this.input.attr("readonly",data);		
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
			this.input.css({background : this.color, color :this.fontColor });
		}catch(e){
			alert("[saiEdit]::setReadOnly:"+e);
		}
	},
	setWidth: function(data){
		var n = this.getFullId();
		var nd = this.getCanvas();
		window.control_datePicker.prototype.parent.setWidth.call(this,data); 	
		this.doDraw(nd);
	},
	
	eventMouseOut: function(){
		var input = this.input;
		// if (this.isFocused){
		// 	input.style.background = system.getConfig("text.focus");
		// 	input.style.color = system.getConfig("text.normalColor");
		// 	//input.style.border = system.getConfig("text.overBorderColor");			
		// }else {
		// 	if (this.readOnly){
		// 		input.style.background = system.getConfig("text.disabled");
		// 		input.style.color = system.getConfig("text.disabledFontColor");
		// 	}
		// 	else{
		// 		input.style.background = system.getConfig("text.normalBgColor");
		// 		input.style.color = system.getConfig("text.normalColor");
		// 	}
		// 	//input.style.border = system.getConfig("text.normalBorderColor");			
		// }
		this.input.css({background : this.color, color :this.fontColor });
	},
	eventMouseOver: function(event){
		var input = this.input;
		// if (this.isFocused){
		// 	input.style.background = system.getConfig("text.focus");
		// 	input.style.color = system.getConfig("text.normalColor");			
		// }else {
		// 	input.style.background = system.getConfig("text.overBgColor");
		// 	input.style.color = system.getConfig("text.overColor");
		// }	
		//input.style.border = system.getConfig("text.overBorderColor");			
	},
	setColor: function(data){
		this.color = data;
		// var editObj = this.input;
		// 	if(editObj != undefined)
		// 	{
	    //     editObj.style.background = data;		  
	    // }
      
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
	getInput: function(){
		return $("#" + this.getFullId()+"_edit");
	}
});
