//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_selection = function(owner, options){
    if (owner){
		this.stateRO 	= "";
		this.type 		= "text";
		this.color      = "#ffffff";
		this.fontColor  = "#000000";
		this.alignment = window.alLeft;
		this.isFocused = false;
		window.control_selection.prototype.parent.constructor.call(this, owner, options);
		this.className = "control_selection";
		this.setWidth(80);
		window.control_selection.prototype.parent.setHeight.call(this, 20);
		this.wantTab = false;
		this.tabStop = true;
		this.password = false;
		this.readOnly = false;
		this.text = "selection";
		this.onChange = new control_eventHandler();
		this.multiple = "";
		this.size = 10;
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.items !== undefined) this.setItems(options.items);													
			if (options.multiple !== undefined) this.setMultiple(options.multiple);
			if (options.size !== undefined) this.setSize(options.size);
		}
    }
};
window.control_selection.extend(window.control_control);
window.selection = window.control_selection;
window.control_selection.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    canvas.style.background = " ";
	    canvas.style.overflow = "hidden";
		var html = "<div id='"+n+"_frame' style='{position: absolute;left: 0;top: 0;width:100%;height: 100%;}'></div>";
	    this.setInnerHTML(html, canvas);
	},
	doChange: function(sender){
		this.onChange.call(this);
	},
	setHeight: function(data){
		window.control_selection.prototype.parent.setHeight.call(this, data);
		var nd = $(this.getFullId()+"_selection");	
		if (nd != undefined)
			nd.style.height = data;
	},
	doLostFocus: function(){
	    if (this.activeChar != undefined)
	        this.activeChar.style.background = "";
	    this.isFocused = false;
	    this.onDefocus.call(this);
	},
	doSetFocus: function(){	
	    var nd = $(this.getFullId()+"_selection");
		if (nd != undefined)
			nd.focus();
		this.isFocused = true;	
	},
	doFocus: function(){
		this.getForm().setActiveControl(this);
		var input = $(this.getFullId()+"_selection");		
		this.isFocused = true;
	},
	getText: function(){
	 	var nd = $(this.getFullId()+"_selection");	
		this.text ="";
		if (nd != undefined)
		{
			if (nd.selectedIndex > -1)
				this.text = nd.options[nd.selectedIndex].value;		
		}
	    return this.text;	
	},
	getTextAndId: function(){
	 	var nd = $(this.getFullId()+"_selection");	
		var ret = "";
		if (nd != undefined)
		{
			if (nd.selectedIndex > -1)
				ret = nd.options[nd.selectedIndex].value+";"+nd.options[nd.selectedIndex].innerHTML;		
		}
	    return ret;	
	},
	getSelectedTextAndId: function(){ 	
		var nd = $(this.getFullId()+"_selection");	
		var ret = new control_arrayMap();
		if (nd != undefined)
		{		
			for (var i in nd.options)		
			{
				if (nd.options[i].selected)
					ret.set(nd.options[i].value,nd.options[i].innerHTML);		
			}
		}
	    return ret;	
	},
	setSelectedItems: function(items){
		var nd = $(this.getFullId()+"_selection");		
		if (nd != undefined)
		{		
			for (var i in nd.options)		
			{
				for (var j in items){					
					if (nd.options[i].value == j)
						nd.options[i].selected = true;				
				}
			}
		}    
	},
	getId: function(){
	 	var nd = $(this.getFullId()+"_selection");	
		var ret = "";
		if (nd != undefined)
		{	
			if (nd.selectedIndex > -1)
				ret = nd.options[nd.selectedIndex].value;				
		}
	    return ret;	
	},
	setText: function(data){
	    this.text = data;
	    var nd = $(this.getFullId()+"_selection");
		for (var i in nd.options)
		{
			if (nd.options[i].value == data)
			{
				nd.selectedIndex = i;
				return false;
			}
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
		try{
			this.readOnly = data;    
			this.tabStop = !this.readOnly;
			
			var nd = $(this.getFullId());
			var edt = $(this.getFullId()+"_selection");
			if (this.readOnly)
			{
				this.color = "#aaa5a5";
				this.fontColor  = "#ffffff";
				this.stateRO = "readonly";
			}
			else
			{
				this.color = "$ffffff";
				this.fontColor  = "#000000";
				this.stateRO = "";
			}
		
			this.doDraw(nd);
		}catch(e){
			alert("[saiselection]::setReadOnly:"+e);
		}
	},
	setWidth: function(data){
		var n = this.getFullId();
		var nd = $(n);
		window.control_selection.prototype.parent.setWidth.call(this,data); 	
		this.doDraw(nd);	
	},
	setTipeText: function(tipe){
		this.tipeText = tipe;
	},
	getTipeText: function(){
		return this.tipeText;
	},
	setAlignment: function(data){
		this.alignment = data;
		var selectionObj = $(this.getFullId()+"_selection");
		if(selectionObj != undefined)
			selectionObj.style.align = this.alignment;
	},
	eventMouseOut: function(){
		var input = $(this.getFullId()+"_selection");
		if (this.isFocused)
		{
			input.style.background = "#ff9900";
			input.style.color = "#000000";
		}else {
			if (this.readOnly)
			{
				input.style.background = "#aaa5a5";
				input.style.color = "#ffffff";
			}
			else
			{
				input.style.background = "#ff9900";
				input.style.color = "#000000";
			}
		}
	},
	eventMouseOver: function(){
		var input = $(this.getFullId()+"_selection");
		if (this.isFocused)
		{
			input.style.background = "#ff9900";
			input.style.color = "#000000";
		}else {
			input.style.background = "#ffffff";
			input.style.color = "#000000";
		}
	},
	setColor: function(data){
		this.color = data;
		var selectionObj = $(this.getFullId()+"_selection");
			if(selectionObj != undefined)
			{
	        selectionObj.style.background = data;		  
	    }      
	},
	getColor: function(){
		return this.color;
	},
	setItems: function(item){
		  var cnv = $(this.getFullId() + "_frame");
		  if (this.multiple == "")
		  {
			var html = "<select id='"+this.getFullId()+"_selection' value='"+this.text+"' "+
				" onchange='system.getResource("+this.resourceId+").doChange(event)'"+
				"style='{width:"+this.width+"px;height:20px;position:absolute;top:0; "+
				"border:1px solid #058fad;background:"+this.color+";color:"+this.fontColor+";font-size:11;font-family:arial;}' "+		
				">Pilih item";
		  }else 
			var html = "<select id='"+this.getFullId()+"_selection' value='"+this.text+"'  multiple='multiple' size='"+this.size+"' "+
				" onchange='system.getResource("+this.resourceId+").doChange(event)'"+
				"style='{width:"+this.width+"px;position:absolute;top:0; "+
				"border:1px solid #058fad;background:"+this.color+";color:"+this.fontColor+";font-size:11;font-family:arial;}' "+		
				">Pilih item";
		  for (var i in item)
		  {
		     html +="<option value='"+i+"'>"+item[i]+"</option>" ;
		  }  
		  html += "</select>";
		  cnv.innerHTML = this.remBracket(html);
	},
	setItemsWithId: function(item){
		  var cnv = $(this.getFullId() + "_frame");
		  if (this.multiple == "")
		  {
			var html = "<select id='"+this.getFullId()+"_selection' value='Pilih item' "+
				" onchange='system.getResource("+this.resourceId+").doChange(event)'"+
				"style='{width:"+this.width+"px;height:20px;position:absolute;top:0; "+
				"border:1px solid #058fad;background:"+this.color+";color:"+this.fontColor+";font-size:12;font-family:arial;}' "+		
				">Pilih item";
		  } else 
			var html = "<select id='"+this.getFullId()+"_selection' value='Pilih item' multiple='multiple' size='"+this.size+"' "+
				" onchange='system.getResource("+this.resourceId+").doChange(event)'"+
				"style='{width:"+this.width+"px;position:absolute;top:0; "+
				"border:1px solid #058fad;background:"+this.color+";color:"+this.fontColor+";font-size:12;font-family:arial;}' "+		
				">Pilih item";
		  for (var i in item)
		  {
		     html +="<option value='"+i+"'>"+item[i]+"</option>" ;
		  }
		  html += "</select>";
		  cnv.innerHTML = this.remBracket(html);
	},
	setMultiple: function(data){
		this.multiple = data;	
	},
	setSize: function(data){
		this.size = data;	
	},
	setUnselect: function(){
		var nd = $(this.getFullId()+"_selection");	
		if (nd != undefined)
			nd.selectedIndex = -1;
	}
});
