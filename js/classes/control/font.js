//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_font = function(){
    window.control_font.prototype.parent.constructor.call(this);
    this.className = "control_font";
    
	this.bold = false;
	this.italics = false;
	this.underline = false;
	this.fontName = "Arial";
	this.size = 8;
	this.color = "#000000";	
	this.onChange = new control_eventHandler();
};
window.control_font.extend(window.control_component);
window.font =window.control_font;
//------------------------- Setter & Getter ------------------------------------
window.control_font.implement({
	getCss: function(){
		var result = "color: " + this.color + ";" +
					 "font-family: " + this.fontName + ";" +
					 "font-size: " + this.size + "pt;";	
		if (this.bold)
		    result += "font-weight: bolder;";
		else
		    result += "font-weight: normal;";
		
		if (this.italics)
		    result += "font-style: italics;";
		else
		    result += "font-style: normal;";
		    
	    if (this.underline)
		    result += "text-decoration: underline;";
		else
		    result += "text-decoration: none;";
		    
		return result;
	},
	apply: function(htmlObj){
		htmlObj.style.fontFamily = this.fontName;
		htmlObj.style.fontSize = this.size + "pt";
		htmlObj.style.color = this.color;

		if (this.bold)
		    htmlObj.style.fontWeight = "bolder";
		else
		    htmlObj.style.fontWeight = "normal";

		if (this.italics)
		    htmlObj.style.fontStyle = "italic";
		else
		    htmlObj.style.fontStyle = "normal";

	    if (this.underline)
	        htmlObj.style.textDecoration = "underline";
		else
		    htmlObj.style.textDecoration = "none";
		
	},
	getColor: function(){
		return this.color;
	},
	setColor: function(data){
		this.color = data;
		this.onChange.call(this);
	},
	isBold: function(){
		return this.bold;
	},
	setBold: function(data){
		this.bold = data;
		this.onChange.call(this);
	},
	isItalics: function(){
		return this.italics;
	},
	setItalics: function(data){
		this.italics = data;
		this.onChange.call(this);
	},
	isUnderline: function(){
		return this.underline;
	},
	setUnderline: function(data){
		this.underline = data;
		this.onChange.call(this);
	},
	getFontName: function(){
		return this.fontName;
	},
	setFontName: function(data){
		this.fontName = data;
		this.onChange.call(this);
	},
	getSize: function(){
		return this.size;
	},
	setSize: function(data){
		this.size = data;
		this.onChange.call(this);
	}
});
