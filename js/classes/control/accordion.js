//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_accordion = function(owner, options){	
    if (owner){
		try{			
		    this.styled = true;
	        window.control_accordion.prototype.parent.constructor.call(this, owner, options);        
	        this.className = "control_accordion";
	        this.selectedItem = undefined;
			this.maxExpandLevel = 0;		        
			this.childLength = 300;
	        this.onSelect = new control_eventHandler();
			this.onDblClick = new control_eventHandler();						
			this.onClick = new control_eventHandler();						
			this.tabStop = true;
			this.xmlData = undefined;
			if (options !== undefined){
				this.updateByOptions(options);
				if (options.color !== undefined) this.setColor(options.color);
				if (options.childLength !== undefined) this.childLength= options.childLength;	
				if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);	
				if (options.click !== undefined) this.onClick.set(options.click[0],options.click[1]);	
				if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);
				if (options.styled !== undefined) this.setStyled(options.styled);
			}
		}catch(e){
			alert("treeView" + e);
		}
    }
};
window.control_accordion.extend(window.control_containerControl);
window.accordion = window.control_accordion;
window.control_accordion.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    if (this.styled) canvas.css({ background : "#f5f5f5" });
	    canvas.css({overflow : "auto" });	    
	    var  html =  "<div id='" + n + "form' style='{position : relative; left: 0; top: 0; width: 100%; height: auto;}'></div>" ;
	    this.setInnerHTML(html, canvas);
	},	
	setColor: function(data){
	   this.color = data;
	   this.getCanvas().css({ background : data });
    },
	setStyled: function(data){
	   this.styled = data;
	   this.getCanvas().css({ background : system.getConfig("panel.color") });	   
    },
	addItem: function(id, caption, icon){
	},
	delItem: function(id){	
		var idOwner = id.owner;
		id.free();
		idOwner.rearrange();
	},
	rearrange: function(){
		var child,ix = 0;
		for (var i in this.childs.objList)
		{
			child = $$$(this.childs.get(i));
			if(child != undefined){
				ix++;
				child.childIndex = ix;
			}
		}	
	},
	clear: function(){
		var child;
		for (var i in this.childs.objList)
		{
			child = $$$(this.childs.objList[i]);
			if(child != undefined)
				child.free();		
		}
		this.childs.clear();
		this.childsIndex = [];
	},
	doSelectItem: function(item){
		try{			
		    var oldSelected = $$$(this.selectedItem);			
		    if (oldSelected instanceof control_accordionNode)
		        oldSelected.doDeselect();
		    if (item instanceof control_accordionNode){			
		        this.selectedItem = item.getResourceId();
		        this.onSelect.call(this, item);
		    }else
		        this.selectedItem = undefined;            
		}catch(e){
			systemAPI.alert("doSelectItem "+e+"<br>"+this.selectedItem,oldSelected);
		}			
	},
	getSelectedItem: function(){
		return $$$(this.selectedItem);
	},
	setWidth: function(data){
		try{
		    window.control_accordion.prototype.parent.setWidth.call(this, data);

		    var frame = $("#"+this.getFullId() + "_frame");
		    if (frame) frame.css({ width : data - 3 });
		}catch(e){
			alert(e);
		}
	},
	setHeight: function(data){
	    window.control_accordion.prototype.parent.setHeight.call(this, data);

	    var frame = $("#"+this.getFullId() + "_frame");
	    if (frame) frame.css({ height : data - 4 });
	},
	getMaxExpandLevel: function(node){
		var child = undefined;
		if (node instanceof control_accordion)
			this.maxExpandLevel = 0;
		for (var i in node.childs.objList)
		{
			child = $$$(node.childs.objList[i]);
			if (child instanceof window.control_accordionNode)
			{
				if (!child.isHasChild())
				{
					if (this.maxExpandLevel < child.getLevel())
					  this.maxExpandLevel = child.getLevel();
				}else if (child.isExpanded())				
				{
					this.getMaxExpandLevel(child);	
				}else
				{
					if (this.maxExpandLevel < child.getLevel())
					  this.maxExpandLevel = child.getLevel();
				}
			}
		}
		return this.maxExpandLevel;
	},
	updateCanvas: function(node){
		try{
			var child = undefined;
			var j = 0;
			for (var i in node.childs.objList)
			{
				child = $$$(node.childs.objList[i]);
				childCanvas = child.getCanvas();							
				j++;
				if (child.isHasChild()){
					$("#"+child.getFullId()+"_caption").css({background : "#ddd", color:"#166c88" });
				}
				
			}	
		}catch(e){
			error_log(e);
		}	
	},
	updateWidth: function(node){
		var child = undefined;
		for (var i in node.childs.objList)
		{
			child = $$$(node.childs.objList[i]);
			childCanvas = $(child.getFullId());					
			if (childCanvas != undefined)
				child.doDraw(childCanvas);
			this.updateWidth(child);				
		}	
	},
	doKeyDown: function(charCode, buttonState, keyCode){
	   switch (keyCode){
	       case 40 ://down
	            var item = this.getSelectedItem();
	            var child = item;
				if (item.isExpanded()){
    	            for (var i in item.childs.objList)
    				{
    					child = system.getResource(item.childs.objList[i]);
    					break;
    				}
                }else if (item.isLastChild()){ //lastChild
                    if (item.owner != this){
                        child = item.owner;
                        //var owner = child.owner;
                        while (child.isLastChild() && child.owner != this)
                            child = child.owner;
                        if (child.owner == this && child.isLastChild()) {
                            child = item;
                        }else{
            				var tmp;        				
            				for (var i in child.owner.childs.objList)
            				{
            					tmp = system.getResource(child.owner.childs.objList[i]);
            					if (tmp.childIndex == (child.childIndex + 1)) {
            						child = tmp;							
            						break;
                                }										
            				}      		
    				    }
    				}
                }else{
                    var owner = item.owner;
    				var tmp;
    				for (var i in owner.childs.objList)
    				{
    					tmp = system.getResource(owner.childs.objList[i]);
    					if (tmp.childIndex == (item.childIndex + 1)) 
    						child = tmp;																	
    				}    				
				}
				if (child) {
                    child.doSelect();
    				var node = child.getCanvas();    
                    var pos = findPos(this.getClientCanvas(),node);
                    var minus = parseInt(node.offsetWidth) > parseInt(this.getClientCanvas().offsetWidth) ? 20 : 0;
                    if (pos[1] + 22 > parseInt(this.getClientCanvas().scrollTop) + this.height - minus){
       	            	this.getClientCanvas().scrollTop += 22;            
                	}
       	        }
	       break;
	       case 38 ://up
	            var item = this.getSelectedItem();
	            var child = item;
	            if (item.isFirstChild()){
                    if (item.owner != this)
                        child = item.owner;
                }else{
    				var owner = item.owner;
    				var child,tmp;
    				for (var i in owner.childs.objList){
    					tmp = system.getResource(owner.childs.objList[i]);
    					if (tmp.childIndex == (item.childIndex - 1)) 
    						child = tmp;																	
    				}
    				if (child) {				                        
                        while (child.isHasChild() && child.isExpanded()){
                            for (var i in child.childs.objList)
            					tmp = system.getResource(child.childs.objList[i]);        					
    				        child = tmp;
                        }                            
                    }
                }
                child.doSelect();
                var node = child.getCanvas();    
                var pos = findPos(this.getClientCanvas(),node);
                if (pos[1] < parseInt(this.getClientCanvas().scrollTop)){
   	            	this.getClientCanvas().scrollTop = pos[1];            
            	}
	       break;
	       case 39 ://right
	           var item = this.getSelectedItem();
	            if (item.isHasChild() || (item.isXML && item.xmlNode.firstChild.nodeValue != "-")){
    	            item.expand();
    	            var child;
    	            for (var i in item.childs.objList)
    				{
    					child = system.getResource(item.childs.objList[i]);
    					break;
    				}
    				if (child) child.doSelect();
				}
	       break;
	       case 37 ://left	           
	           var item = this.getSelectedItem();
	           if (item.owner != this) 
                    if (item.isExpanded())
                        item.collapse();
                    else  item.owner.doSelect();
	           else item.collapse();
	       break;
	       case 13:
	           this.getSelectedItem().eventClick();
	       break;
       }
       return false;
	},
	collectData : function(node){
		
		while (node != undefined){		
			var nd = node.firstChild;	
			while (nd != undefined){				
				if (nd.tagName == "kode_form") kodeForm = nd.firstChild.nodeValue;
				else if (nd.tagName == "kode_menu") kode = nd.firstChild.nodeValue;
				else if (nd.tagName == "nama") nama = nd.firstChild.nodeValue;
				else if (nd.tagName == "icon" && nd.firstChild) icon = nd.firstChild.nodeValue;
				nd = nd.nextSibling;
			}	
			this.data.set(kodeForm,{'id' : kode, 'caption' : nama, 'idLain' : kodeForm} );
			if (node.lastChild.firstChild.nodeValue != "-"){
				this.collectData(node.lastChild.firstChild);
			}
			node = node.nextSibling;
		}
	},
	setXMLData: function(xml){	
		try{
			uses("control_accordionNode");
			this.xmlData = xml;
			var nodeTr, node = this.xmlData.firstChild.firstChild.firstChild;
			var kodeForm, kode, nama, icon, first = true;
			this.data = new arrayMap();
			while (node != undefined){		
				var nd = node.firstChild;	
				while (nd != undefined){				
					if (nd.tagName == "kode_form") kodeForm = nd.firstChild.nodeValue;
					else if (nd.tagName == "kode_menu") kode = nd.firstChild.nodeValue;
					else if (nd.tagName == "nama") nama = nd.firstChild.nodeValue;
					else if (nd.tagName == "icon" && nd.firstChild) icon = nd.firstChild.nodeValue;
					nd = nd.nextSibling;
				}	
				icon = icon == "-" ? 'icon/window.png' : "icon/"+ icon;
				nodeTr = new control_accordionNode(this);
				nodeTr.setItemData({'id' : kode, 'caption' : nama, 'idLain' : kodeForm, icon: icon});
				nodeTr.setXMLNode(node.lastChild);
				node = node.nextSibling;
				if (first) nodeTr.doSelect();
				first = false;
			}
			this.collectData(this.xmlData.firstChild.firstChild.firstChild);
		}catch(e){
			alert(e);
		}
	}
});
