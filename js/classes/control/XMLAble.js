//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_XMLAble = function(){
    this.className = "control_XMLAble";    
    this.serialXML = "";
};
window.control_XMLAble.extend(window.Function);
window.XMLAble = window.control_XMLAble;
window.control_XMLAble.implement({
	doSerialize: function(){
	},
	afterDeserialize: function(){
	},
	toString: function(){	
		return "[object " + this.getClassName()+"]";
	},
	copy: function(src){
		this.fromXML(src.toXML());
	},
	cloneObj: function(){	
	    className = this.getClassName();
	    var result = undefined;    
	    eval("try { result = new " + className + "(); } catch (e) {}");        
	    result.copy(this);        
	    return result;
	},
	toXML: function(name, addAttribute){
	    if (addAttribute != undefined)
	        addAttribute = " " + addAttribute;
	    else
	        addAttribute = "";
	    if (name == undefined)
	        this.serialXML = "<" + this.getClassName() + addAttribute + ">";
		else
	        this.serialXML = "<" + name + addAttribute + " type=\"" + this.getClassName() + "\">";
		this.doSerialize();
		if (name == undefined)
		   this.serialXML += "</" + this.getClassName() + ">";
		else
		   this.serialXML += "</" + name + ">";
	    return this.serialXML;
	},
	fromXML: function(xml){    
		var doc = new REXML(xml);	
		var result = this.fromXMLNode(doc.rootElement);
		return result;
	},
	doDeserializeObject: function(name, type){
	    var result = undefined;
	    uses(type);	
	    eval("try { result = new " + type + "();} catch (e) { result = undefined; }");
	    return result;
	},
	fromXMLNode: function(node){		
		try{
		    if (node != undefined){
		        var childNode = undefined;
		        var type = "";
		        var name = "";
		        var value = undefined;
		        for (var i in node.childElements){
		            childNode = node.childElements[i];    							
		            if (childNode.type == "element"){
		                type = childNode.attribute("type");
		                name = childNode.name;									
		                if ((type != undefined) && ((type != "")) ){
		                    value = undefined;                    
		                    if (childNode.attribute("isNull") != "true"){
		                        switch (type){
		                            case "string" 	:					
		                							value = this.urldecode(childNode.getText());												
		                				            break;
		                			case "double" 	:
		                			case "float"    :
		                                            try{
		                                                value = parseFloat(childNode.getText());
		                				            }catch (e){
		                				                value = 0;
		                				            }
		                				            break;
		                            case "integer"  :
		                                            try{
		                                                value = parseInt(childNode.getText());
		                				            }catch (e){
		                				                value = 0;
		                				            }
		                				            break;
		               				case "boolean"	: 
		                							if (childNode.getText() == "true")
		                                                value = true;
		                							else
		                                                value = false;
		                				            break;
		                			default         :												
		                				            value = this.doDeserializeObject(name, type);																						
		                							if (value instanceof control_XMLAble)
		                                                value.fromXMLNode(childNode);
		                			        	    break;
		                        }
		                    }
		                    try{
		                        eval("try { this. " + name + " = value; } catch (e2) { alert(e2);}");
		                    }catch (e){
		                    }
		                }
		            }			
				}
			}
		    this.afterDeserialize();
		}catch(e){
			alert(e);
		}
	},
	urlencode: function(str){
		if (this.prototype.replaceCharArray == undefined)
		{
		   this.prototype.replaceCharArray = new Array();
		   	   
		   this.prototype.replaceCharArray["%"] = "%25";
		   this.prototype.replaceCharArray["\r"] = "%0D";
		   this.prototype.replaceCharArray["\n"] = "%0A";
		   this.prototype.replaceCharArray["+"] = "%2B";
		   this.prototype.replaceCharArray[" "] = "+";
		   this.prototype.replaceCharArray["!"] = "%21";
		   this.prototype.replaceCharArray['"'] = "%22";
		   this.prototype.replaceCharArray["#"] = "%23";
		   this.prototype.replaceCharArray["$"] = "%24";
		   this.prototype.replaceCharArray["&"] = "%26";
		   this.prototype.replaceCharArray["'"] = "%27";
		   this.prototype.replaceCharArray["("] = "%28";
		   this.prototype.replaceCharArray[")"] = "%29";
		   this.prototype.replaceCharArray["*"] = "%2A";
		   this.prototype.replaceCharArray[","] = "%2C";
		   this.prototype.replaceCharArray["/"] = "%2F";
		   this.prototype.replaceCharArray[":"] = "%3A";
		   this.prototype.replaceCharArray[";"] = "%3B";
		   this.prototype.replaceCharArray["<"] = "%3C";
		   this.prototype.replaceCharArray["="] = "%3D";
		   this.prototype.replaceCharArray[">"] = "%3E";
		   this.prototype.replaceCharArray["?"] = "%3F";
		   this.prototype.replaceCharArray["@"] = "%40";
		   this.prototype.replaceCharArray["["] = "%5B";
		   this.prototype.replaceCharArray['\\'] = "%5C";
		   this.prototype.replaceCharArray["]"] = "%5D";
		   this.prototype.replaceCharArray["^"] = "%5E";
		   this.prototype.replaceCharArray["`"] = "%60";
		   this.prototype.replaceCharArray["{"] = "%7B";
		   this.prototype.replaceCharArray["|"] = "%7C";
		   this.prototype.replaceCharArray["}"] = "%7D";
		   this.prototype.replaceCharArray["~"] = "%7E";
		}
		if (typeof(str) == "string")
	    {
	        var result = new Array();
	        var lgt = str.length;
	            
	        var nowChar = "";
	        var replaceStr = undefined;
	            
	        for (var i = 0; i < lgt; i++)
	        {
	            nowChar = str.charAt(i);
	            
	            replaceStr = this.prototype.replaceCharArray[nowChar];
	                
	            if (replaceStr != undefined)
	                result.push(replaceStr);
	            else                 
	                result.push(nowChar);
	        }
	            
		    return result.join("");
		}
		else
	        return str;
	},
	urldecode: function(str){
		if (this.prototype.replaceCodeArray == undefined)
		{
		   this.prototype.replaceCodeArray = new Array();
		   	   	   	
		   this.prototype.replaceCodeArray["%25"] = "%";
		   this.prototype.replaceCharArray["%0D"] = "\r";
		   this.prototype.replaceCharArray["%0A"] = "\n";
		   this.prototype.replaceCodeArray["%2B"] = "+";
		   this.prototype.replaceCodeArray["+"] = " ";
		   this.prototype.replaceCodeArray["%21"] = "!";
		   this.prototype.replaceCodeArray["%22"] = '"';
		   this.prototype.replaceCodeArray["%23"] = "#";
		   this.prototype.replaceCodeArray["%24"] = "$";
		   this.prototype.replaceCodeArray["%26"] = "&";
		   this.prototype.replaceCodeArray["%27"] = "'";
		   this.prototype.replaceCodeArray["%28"] = "(";
		   this.prototype.replaceCodeArray["%29"] = ")";
		   this.prototype.replaceCodeArray["%2A"] = "*";
		   this.prototype.replaceCodeArray["%2C"] = ",";
		   this.prototype.replaceCodeArray["%2F"] = "/";
		   this.prototype.replaceCodeArray["%3A"] = ":";
		   this.prototype.replaceCodeArray["%3B"] = ";";
		   this.prototype.replaceCodeArray["%3C"] = "<";
		   this.prototype.replaceCodeArray["%3D"] = "=";
		   this.prototype.replaceCodeArray["%3E"] = ">";
		   this.prototype.replaceCodeArray["%3F"] = "?";
		   this.prototype.replaceCodeArray["%40"] = "@";
		   this.prototype.replaceCodeArray["%5B"] = "[";
		   this.prototype.replaceCodeArray["%5C"] = '\\';
		   this.prototype.replaceCodeArray["%5D"] = "]";
		   this.prototype.replaceCodeArray["%5E"] = "^";
		   this.prototype.replaceCodeArray["%60"] = "`";
		   this.prototype.replaceCodeArray["%7B"] = "{";
		   this.prototype.replaceCodeArray["%7C"] = "|";
		   this.prototype.replaceCodeArray["%7D"] = "}";
		   this.prototype.replaceCodeArray["%7E"] = "~";
		}
		
		if (typeof(str) == "string")
	    {
	        var result = new Array();
	        var lgt = str.length;
	            
	        var nowChar = "";
	        var replaceStr = undefined;
	         
	        var i = 0;
	        var nowStr = "";
	        var replaceChar = "";
	                      
	        while (i < lgt)
	        {
	            nowChar = str.charAt(i);
	            
	            if (nowChar == '%')
	            {
	                nowStr = '%';
	                
	                i++;
	                nowStr += str.charAt(i);
	                
	                i++;
	                nowStr += str.charAt(i);
	                
	                if (nowStr == "%0D")
	                    replaceChar = "\r";
	                else if (nowStr == "%0A")
	                    replaceChar = "\n";
	                else if (nowStr == "%23")
	                    replaceChar = "#";
	                else
	                    replaceChar = this.prototype.replaceCodeArray[nowStr];
	                
	                if (replaceChar != undefined)
	                    result.push(replaceChar);
	                else
	                    result.push(nowStr);
	            }
	            else if (nowChar == '+')
	                result.push(" "); 
	            else
	                result.push(nowChar);
	            
	            i++;
	        }

		    return result.join("");
		}
		else
	        return str;
	},
	serialize: function(name, defaultType){
	    try{
	        if (defaultType == undefined)
	            defaultType = "string";
	            
	        var value = eval("this. " + name);
	        var type = typeof(value);
		    
	        if (value == undefined)
	    	   this.serialXML += "<" + name + " type=\"" + defaultType + "\" isNull=\"true\"></" + name + ">";
	    	else if (value instanceof control_XMLAble)
	    	   this.serialXML += value.toXML(name);
	    	else if (type == "boolean")
	    	{
	            if (value)
	                this.serialXML += "<" + name + " type=\"" + type + "\">true</" + name + ">";
	            else
	                this.serialXML += "<" + name + " type=\"" + type + "\">false</" + name + ">";
	    	}
	    	else if (type == "string")
	            this.serialXML += "<" + name + " type=\"" + type + "\">" + this.urlencode(value) + "</" + name + ">";
	    	else if (type == "number")
	    	{
	    	   if ((value % 1) == 0)
	    	       type = "integer";
	    	    else
	    	       type = "float";
	    	       
	    	   this.serialXML += "<" + name + " type=\"" + type + "\">" + value + "</" + name + ">";
	    	}
	    }
	    catch (e){
	        alert("[control_XMLAble] :: serialize : " + e);
	    }
	},
	serializeValue: function(name, defaultType, value){
	    try{
	        if (defaultType == undefined)
	            defaultType = "string";

	        var type = typeof(value);

	        if (value == undefined)
	    	   this.serialXML += "<" + name + " type=\"" + defaultType + "\" isNull=\"true\"></" + name + ">";
	    	else if (value instanceof control_XMLAble)
	    	   this.serialXML += value.toXML(name);
	    	else if (type == "boolean")
	    	{
	            if (value)
	                this.serialXML += "<" + name + " type=\"" + type + "\">true</" + name + ">";
	            else
	                this.serialXML += "<" + name + " type=\"" + type + "\">false</" + name + ">";
	    	}
	    	else if (type == "string")
	            this.serialXML += "<" + name + " type=\"" + type + "\">" + this.urlencode(value) + "</" + name + ">";
	    	else if (type == "number")
	    	{
	    	   if ((value % 1) == 0)
	    	       type = "integer";
	    	    else
	    	       type = "float";

	    	   this.serialXML += "<" + name + " type=\"" + type + "\">" + value + "</" + name + ">";
	    	}
	    }
	    catch (e){
	        alert(e);
	    }
	},
	getClassName: function(){		
		return this.className;
	},
	toJson: function(){	
	    var data = xml2json.parser(this.toXML());
		return data;
	},
	encode64:function(){
		//if (Base64 != undefined)
			//return Base64.encode(this.toXML());
		//else 
		return this.toXML();
	},
	encode:function(){			
		if (jSEND != undefined)
			return jSEND(this.toXML());
		else system.alert(this,"Tolong clear cache browser anda. Kemudian refresh lagi.","Ada Komponen yang belum terupdate")
	}
});

window.xmlToObj = function(xml){	
    try{
		var result = undefined;
	    var doc = new REXML(xml);
		var node = doc.rootElement;
		var type = node.attribute("type");
		
		if ((type == undefined) || (type == ""))
	        type = node.name;
		
		if ((type != undefined) && (type != ""))
		{
	        uses(type);		
	        eval("try { result = new " + type + "();} catch (e) { result = undefined; }");
	        if (result instanceof control_XMLAble)
	            result.fromXMLNode(node);
		}
		
		return result;
	}catch(e){
		alert(e);
	}
};
