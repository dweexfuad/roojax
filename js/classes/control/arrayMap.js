//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_arrayMap = function(options){
	window.control_arrayMap.prototype.parent.constructor.call(this);	
	this.objList = new Array();	
	this.className = "control_arrayMap";
	this.tag1 = 0;
	this.tag2 = 0;
	this.tag3 = 0;
	if (options !== undefined){
		if (options.tag1 !== undefined) this.setTag1(options.tag1);
		if (options.tag2 !== undefined) this.setTag2(options.tag2);
		if (options.tag3 !== undefined) this.setTag3(options.tag3);
		if (options.items !== undefined) {
			for (var i in options.items)
				this.set(i,options.items[i]);
		}		
	}
};
window.control_arrayMap.extend(window.control_XMLAble);
window.arrayMap = window.control_arrayMap;
window.control_arrayMap.prototype.toString = function(){
	return "control_arrayMap [" + this.getLength() + " objects]";
};
window.control_arrayMap.implement({
	doSerialize: function(){
	    window.control_arrayMap.prototype.parent.doSerialize.call(this);
	    this.serialize("tag1", "string");
	    this.serialize("tag2", "string");
	    this.serialize("tag3", "string");
		this.serialize("tag4", "string");
	    this.serialize("tag5", "string");
	    this.serialXML += "<objList>";
	    var i = 0;
	    var value;
	    var type;	        
	    for (var j in this.objList)
	    {
	        if ((typeof(j) == "string") || (typeof(j) == "number")){
	            value = this.objList[j];
	            type = typeof(value);		    
	            if (value == undefined)
	        	   this.serialXML += "<obj" + i + " name=\"" + this.urlencode(j) + "\" type=\"string\" isNull=\"true\"></obj" + i + ">";
	        	else if (value instanceof control_XMLAble)
	        	   this.serialXML += value.toXML("obj" + i, "name=\"" + this.urlencode(j) + "\"");
	        	else if (type == "boolean")
                    this.serialXML += "<obj" + i + " name=\"" + this.urlencode(j) + "\" type=\"" + type + "\">"+(value ? "true":"false")+"</obj" + i + ">";	                
	        	else if (type == "string")
	                this.serialXML += "<obj" + i + " name=\"" + this.urlencode(j) + "\" type=\"" + type + "\">" + this.urlencode(value) + "</obj" + i + ">";
	        	else if (type == "number"){
                    type = ((value % 1) == 0 ? "integer" : "float");
                    this.serialXML += "<obj" + i + " name=\"" + this.urlencode(j) + "\" type=\"" + type + "\">" + value + "</obj" + i + ">";
	            }	    	
	            i++;
	        }
	    }
	            		  
		this.serialXML += "</objList>";
	},
	fromXMLNode: function(node){
	    window.control_arrayMap.prototype.parent.fromXMLNode.call(this, node);	    
	    var objListNode = node.childElement("objList");	    
	    if (objListNode != undefined){
	        var childNode = undefined;
	        var type = "";
	        var name = "";
	        var objName = "";
	        var value = undefined;
	        for (var i in objListNode.childElements){
	            childNode = objListNode.childElements[i];
	            if (childNode.type == "element"){
	                type = childNode.attribute("type");
	                objName = childNode.name;
	                name = this.urldecode(childNode.attribute("name")); 
	                if ((type != undefined) && (type != "")){
	                    value = undefined;
	                    if (childNode.attribute("isNull") != "true")
	                    {
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
	                				            value = this.doDeserializeObject(objName, type);

	                							if (value instanceof control_XMLAble)
	                                                value.fromXMLNode(childNode);
	                			        	    break;
	                        }
	                    }
	                        
	                    this.set(name, value);
	                }
	            }
	        }
	    }
},
	set : function(name, obj){
		this.objList[name] = obj;
	},
	get : function(name){
		return this.objList[name];
	},
	del : function(name){
		delete this.objList[name];
	},
	delObject:function(obj){
		for (var i in this.objList)
		{
			if (this.objList[i] == obj)
			{            
				delete this.objList[i];
				break;
			}
		}
	},
	getLength: function(){
		var result = 0;    
		for (var i in this.objList)
		{
			if (this.objList[i] != undefined)
				result++;
		}
		return result;
	},					
	addAll: function(otherList){	
		if (otherList instanceof control_arrayMap)
		{
			for (var i in otherList.objList)
			{
				this.set(i, otherList.objList[i]);
			}
		}
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
		var result = undefined;    
		for (var i in this.objList)
		{
			if (this.objList[i] == object)
			{
				result = i;
				break;
			}
		}   
		return result;
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
	},
	getTag4: function(){
		return this.tag4;
	},
	setTag4: function(data){
		this.tag4 = data;
	},
	getTag5: function(){
		return this.tag5;
	},
	setTag5: function(data){
		this.tag5 = data;
	},
	getTotalPage: function(rowPerPage){
		var data = this.getTag1();
		return Math.ceil(data / rowPerPage);
	},
	toHTML : function(){
		try{
			var start = 0;
			var last = this.objList.length;
			var fieldType,width = 0,tag2 = this.getTag2();	
			var excludeField = this.getTag5();		
			if (tag2 != undefined) {
				fieldType = tag2.get(1);
				tag2 = tag2.get(0);			
			}		
			for (var i in tag2.objList)
			{								
				if (excludeField == undefined || ((excludeField[i] == undefined && !excludeField[i])))
					width += tag2.get(i);	
			}		
			width += 40 + (tag2.getLength() * 2);	
			var line,tr,html = "<table width='"+width+"pt' border='1' cellspacing='0' cellpadding='0' class='kotak' style='table-layout:relative'>";	
			var first = true;
			var ix, th,value,color, col,rowId=0;
			var title = this.getTag4();			
			this.setTag3(width);		
			for (var i = start;i < last;i++){		    		
				line = this.get(i);
				if (first){
					th = "<tr style='font-size:12px;font-family:arial;height:20;background:#cccccc;'>";
					th += "<td width='40px' align='center' class='grid_header' style='background:#cccccc;'>No.</td>";
					if (title == undefined)
						for (var j in line.objList){					
							if (excludeField == undefined || ((excludeField[j] == undefined && !excludeField[j])))
								th += "<td width='"+tag2.get(j) +"px' class='grid_header' align='center'>"+ j +"</td>";
						}
					else {
						for (var j in title.objList){								
							if (excludeField == undefined || ((excludeField[j] == undefined && !excludeField[j])))
								th += "<td width='"+tag2.get(j) +"px' class='grid_header' align='center'>"+ title.get(j) +"</td>";
						}
					}
					th += "</tr>";	
					html += th;	
					first = false;
				}
				rowId++;		
				tr = "<tbody><tr >";
				tr += "<td  width='40pt' height='20' style='font-style:bold;border:1px solid #919B9B' valign='middle' class='isi_laporan'>"+(i + 1).toString()+"</td>";		
				
				for (var c in line.objList){		
					if (excludeField == undefined || ((excludeField[c] == undefined && !excludeField[c]))){
						col++; 			
						//if ( typeof(line.get(c)) == "number")						
						if (fieldType.get(c) == "N" || fieldType.get(c) == "real")
							value = floatToNilai(parseFloat(line.get(c))) ;
						else if (fieldType.get(c) == "D" || fieldType.get(c) == "datetime")
							value = (new Date).idFormat(line.get(c)) ;
						else value = line.get(c);
						if (fieldType.get(c) == "N" || fieldType.get(c) == "real")
							tr += "<td  width='"+tag2.get(c)+"pt' height='20' valign='middle' class='isi_laporan' align='right' "+						
									">"+value+"</td>";
						else
							tr += "<td width='"+tag2.get(c)+"pt' height='20' valign='middle' class='isi_laporan' "+						
									">"+value+"</td>";		
					}
				}		
				
				
				tr += "</tr></tbody>";				
				html += tr;
			}
			html += "</table>";
			return html;
		}catch(e){
			systemAPI.alert(this+"$toHtml()",e)
		}
	},
	toHTMLCtrl: function(resId, start, last){	
		if (start == undefined) start = 0;
		if (last == undefined) last = this.objList.length;
		var fieldType,width = 0,tag2 = this.getTag2();	
		if (tag2 != undefined) {
			fieldType = tag2.get(1);
			tag2 = tag2.get(0);			
		}
		for (var i in tag2.objList)
		{
			width += tag2.get(i);	
		}	
		width += 40 + (tag2.getLength() * 2);	
		var line,tr,html = "<table width='"+width+"pt' border='1' cellspacing='0' cellpadding='0' class='kotak' style='table-layout:relative;background-color:#ff9900;'>";	
		var first = true;
		var ix, th,value,color, col,rowId=0;	
		var title = this.getTag4();		
		this.setTag3(width);		
		for (var i = start;i < last;i++){		    		
			line = this.get(i);
			if (first){
				th = "<tr style='font-size:10px;font-weight:bold;font-family:arial;height:20;background-image:url(icon/"+system.getThemes()+"/tableHeader.png);background-position:0 0;background-repeat:repeat-x;'>";
				th += "<td width='40px' align='center' class='grid_header'>No.</td>";
				if (title == undefined)
					for (var j in line.objList){								
						th += "<td width='"+tag2.get(j) +"px' class='grid_header' align='center'>"+ j +"</td>";
					}
				else {
					for (var j in title.objList){								
						th += "<td width='"+tag2.get(j) +"px' class='grid_header' align='center'>"+ title.get(j) +"</td>";
					}
				}
				th += "</tr>";	
				html += th;	
				first = false;
			}
			rowId++;
			if (rowId % 2 == 0)
				color = system.getConfig("app.color.gridDisabledText");
			else 	
				color = system.getConfig("app.color.gridRowDiff");
			tr = "<tbody><tr style='background:"+color+"'"+								
							" onMouseOver = 'window.system.getResource("+resId+").eventMouseOver(event, "+rowId+")' "+
							" onMouseOut = 'window.system.getResource("+resId+").eventMouseOut(event, "+rowId+")' "+				  
				">";
			tr += "<td  width='40pt' height='20' style='background:"+system.getConfig('app.color.fixedColumn')+
					";font-style:bold;border-left:1px solid #E7E7D6;border-top:1px solid #E7E7D6;border-right:1px solid #919B9B;border-bottom:1px solid #919B9B;' valign='middle' align='center' class='isi_laporan'>"+(i + 1).toString()+"</td>";		
			col = 0;
			for (var c in line.objList){		
				col++; 			
				//if ( typeof(line.get(c)) == "number")						
				if (fieldType.get(c) == "N" || fieldType.get(c) == "real")
					value = floatToNilai(parseFloat(line.get(c))) ;
				else if (fieldType.get(c) == "D" || fieldType.get(c) == "datetime")
					value = (new Date).idFormat(line.get(c)) ;
				else value = line.get(c);
				if (fieldType.get(c) == "N" || fieldType.get(c) == "real")
					tr += "<td  width='"+tag2.get(c)+"pt' height='20' valign='middle' class='isi_laporan' align='right' "+
							" onDblClick = 'window.system.getResource("+resId+").eventDoubleClick(event, "+rowId+","+col+")' "+										
							" onClick = 'window.system.getResource("+resId+").eventClick(event, "+rowId+","+col+")' "+																		
							">"+value+"</td>";
				else
					tr += "<td width='"+tag2.get(c)+"pt' height='20' valign='middle' class='isi_laporan' "+
							" onDblClick = 'window.system.getResource("+resId+").eventDoubleClick(event, "+rowId+","+col+")' "+						
							" onClick = 'window.system.getResource("+resId+").eventClick(event, "+rowId+","+col+")' "+												
							//" onMouseOver = 'window.system.getResource("+resId+").eventMouseOver(event, "+rowId+")' "+
							//" onMouseOut = 'window.system.getResource("+resId+").eventMouseOut(event, "+rowId+")' "+				  
							">"+value+"</td>";		
			}		
			
			
			tr += "</tr></tbody>";				
			html += tr;
		}
		html += "</table>";
		return html;
	}
});
