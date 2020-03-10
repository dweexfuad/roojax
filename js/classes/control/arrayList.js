//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at												
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_arrayList = function(options){
	window.control_arrayList.prototype.parent.constructor.call(this);	
	this.objList = new Array();
	this.className = "control_arrayList";
	this.tag1 = 0;
	this.tag2 = 0;
	this.tag3 = 0;
	uses("control_eventHandler");
	this.onCreateObject = new control_eventHandler();
	if (options !== undefined){
		if (options.tag1 !== undefined) this.setTag1(options.tag1);
		if (options.tag2 !== undefined) this.setTag2(options.tag2);
		if (options.tag3 !== undefined) this.setTag3(options.tag3);
		if (options.items !== undefined) {
			for (var i in options.items)
				this.add(options.items[i]);
		}
	}		
};
window.control_arrayList.extend(window.control_XMLAble);
window.arrayList = window.control_arrayList;
window.control_arrayList.prototype.toString = function(){
	return "control_arrayList [" + this.getLength() + " objects]";
};
window.control_arrayList.implement({
	doSerialize: function(){
		window.control_arrayList.prototype.parent.doSerialize.call(this);
	    this.serialize("tag1", "string");
	    this.serialize("tag2", "string");
	    this.serialize("tag3", "string");
	    this.serialXML += "<objList>";
	    var i = 0;
	    var value;
	    var type;
	    for (var j in this.objList)
	    {
	        value = this.objList[j];   
	        type = typeof(value);
	        if (value == undefined)
	    	   this.serialXML += "<obj" + i + " type=\"string\" isNull=\"true\"></obj" + i + ">";
	    	else if (value instanceof control_XMLAble)
	    	   this.serialXML += value.toXML("obj" + i);
	    	else if (type == "boolean")
	            this.serialXML += "<obj" + i + " type=\"" + type + "\">"+(value ? "true":"false")+"</obj" + i + ">";	            
	    	else if (type == "string")
	            this.serialXML += "<obj" + i + " type=\"" + type + "\">" + this.urlencode(value) + "</obj" + i + ">";
	    	else if (type == "number"){
                type = ((value % 1) == 0 ? "integer" : "float");
	    	    this.serialXML += "<obj" + i + " type=\"" + type + "\">" + value + "</obj" + i + ">";
	    	}
	        i++;
	    }
		this.serialXML += "</objList>";
	},
	fromXMLNode: function(node){
	    window.control_arrayList.prototype.parent.fromXMLNode.call(this, node);	    
	    var objListNode = node.childElement("objList");	    
	    if (objListNode != undefined){
	        var childNode = undefined;
	        var type = "";
	        var name = "";
	        var value = undefined; 
	        for (var i in objListNode.childElements){
	            childNode = objListNode.childElements[i];
	            if (childNode.type == "element"){
	                type = childNode.attribute("type");
	                name = childNode.name;
	                if ((type != undefined) && (type != "")){
	                    value = undefined; 
	                    if (childNode.attribute("isNull") != "true"){
	                        switch (type)
	                        {
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
                                                value = (childNode.getText() == "true");
	                							break;
	                			default         :
	                				            value = this.doDeserializeObject(name, type);
	                							if (value instanceof control_XMLAble)
	                                                value.fromXMLNode(childNode);
	                			        	    break;
	                        }
	                    }
	                        
	                    this.add(value);
	                }
	            }
	        }
	    }
	},
	doDeserializeObject: function(name, type){
	    var result = this.onCreateObject.call(this, name, type);
	    if (result == undefined){
	        uses(type);
	        eval("try { result = new " + type + "();} catch (e) { result = undefined; }");
	    }
	    return result;
	},
	add : function(obj){
		var res = this.objList.length;
		this.objList.push(obj);
		return res;
	},
	set : function(index, object){
		if ((index >= 0) && (index < this.objList.length))
			this.objList[index] = object;
	},					
	get : function(index){
		return this.objList[index];
	},
	del : function(index){
		var result = undefined;		
		if ((index >= 0) && (index < this.objList.length))
		{
			result = this.objList[index];        
			var newList = [];        
			for (var i = 0; i < index; i++)
				newList.push(this.objList[i]);                
			for (var i = (index + 1); i < this.objList.length; i++)        
				newList.push(this.objList[i]);                
			this.objList = newList;
		}	
		return result;
	},
	delObject:function(obj){
		try {
			var result = undefined;
			var newList = [];	    
			var i = 0;	    
			while (i < this.objList.length)
			{
				if (this.objList[i] == obj)
					break;
				else
				{
					newList.push(this.objList[i]);
					i++;
				}
			}	    
			i++;	    
			while (i < this.objList.length)
			{
				newList.push(this.objList[i]);
				i++;
			}   	    
			this.objList = newList;		
			return result;
		}catch(e){
			systemAPI.alert(this+"$delObject()",e);
		}
	},
	getLength: function(){
		var result = 0;    
		for (var i in this.objList) result++;
		return result;
	},					
	addAll: function(otherList){	
		if (otherList instanceof control_arrayList){
			for (var i in otherList.objList)							
				this.add(otherList.objList[i]);							
		}
	},
	insert:function(index, object){
		if ((index >= 0) && (index < this.getLength()))
		{
			var newList = [];        
			for (var i = 0; i < index; i++)
				newList.push(this.objList[i]);                
			newList.push(object);        
			for (var i = index; i < this.objList.length; i++)
				newList.push(this.objList[i]);                
			this.objList = newList;
		}
		else
			this.add(object);
	},
	getArray: function(){
		return this.objList;
	},
	isKeyExist:function(name){
		return (this.objList[name] != undefined);
	},
	getByIndex: function(index){
		var i = 0;
		var result = undefined;       
		for (var j in this.objList)
		{
			if (i == index)
			{
				result = this.objList[j];
				break;
			}
			else
				i++;
		}        
		return result;
	},
	clear: function(){
		this.objList = [];		
	},
	indexOf: function(object){
		var found = false;
		var i = 0;   
		while (!found && (i < this.objList.length))
		{
			if (this.objList[i] == object)
				found = true;
			else
				i++;
		}    
		return (found ? i :-1);
	},
	sort:function(){
		this.objList.sort();		
	},
	getTag1: function(){
		return this.tag1;
	},
	setTag1: function(data){
		this.tag1 = data;
	},
	getTag2: function(){
		return this.tag2;
	},
	setTag2: function(data){
		this.tag2 = data;
	},
	getTag3: function(){
		return this.tag3;
	},
	setTag3: function(data){
		this.tag3 = data;
	}
});
