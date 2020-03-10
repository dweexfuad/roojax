//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_fileExplorer = function(owner,options){	
    if (owner){
		try{
			this.className = "control_fileExplorer";			
			window.control_fileExplorer.prototype.parent.constructor.call(this, owner,options);        
	        
			this.selectedItem = undefined;
			this.maxExpandLevel = 0;		        
			this.childLength = 300;
			this.onSelect = new control_eventHandler();
			this.onDblClick = new control_eventHandler();						
			this.tabStop = true;			
			this.folder = "";			
			if (this.app._file == undefined)
				this.app._file = new util_file();										
			this.file = this.app._file;
			this.file.addListener(this);	
			this.separator = "/";			
			if (this.app._rootDir == undefined) {
				this.rootDir = this.file.getRootDir();						
				this.rootDir = this.rootDir.substr(0,this.rootDir.search("server")-1);			
			}else this.rootDir  = this.app._rootDir;
			this.onAfterEdit = new control_eventHandler();
			this.onDataReady = new control_eventHandler();
			this.showFile = false;
			uses("control_fileExplorerItem");
			if (options !== undefined){
				this.updateByOptions(options);
				if (options.showFile !== undefined) this.setShowFile(options.showFile);
				if (options.dataReady !== undefined) this.onDataReady.set(options.dataReady[0],options.dataReady[1]);
				if (options.afterEdit !== undefined) this.onAfterEdit.set(options.afterEdit[0],options.afterEdit[1]);
				if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);
				if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);
			}
		}catch(e){
			alert("treeView" + e);
		}
    }
};
window.control_fileExplorer.extend(window.control_containerControl);
window.fileExplorer = window.control_fileExplorer;
window.control_fileExplorer.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    canvas.style.background = "#ffffff";//"#d9d7c6";
	    canvas.style.overflow = "hidden";
	    if (document.all)
	        html =  "<div id='" + n + "_border1' style='{position: absolute;left: 1;top: 1;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.inner.left") + ";border-top: " + window.system.getConfig("3dborder.inner.top") + ";}'></div>" +
	                "<div id='" + n + "_border2' style='{position: absolute;left: -1;top: -1;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.inner.right") + ";border-bottom: " + window.system.getConfig("3dborder.inner.bottom") + ";}'></div>" +
	                "<div id='" + n + "_border3' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.outer.left") + ";border-top: " + window.system.getConfig("3dborder.outer.top") + ";}'></div>" +
	                "<div id='" + n + "_border4' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.outer.right") + ";border-bottom: " + window.system.getConfig("3dborder.outer.bottom") + ";}'></div>" +
					
	                "<div id='" + n + "_frame' style='{position : relative; left: 0; top: 2; width: 100%; height: 100%;overflow: auto;}' "+
						" onMouseUp='system.getResource(" + this.resourceId + ").eventMouseUp(event);' " +
	                ">" +
	                    "<div id='" + n + "form' style='{position : relative; left: 2; top: 0; width: 100%; height: 100%;overflow: visible;}'></div>" +
	                "</div>"+
					"<div id='"+ n +"_block' style='{background:"+system.getConfig("form.grid.color")+";display:none;position:absolute;left: 0;top: 0; width: 100%; height: 100%;}'>"+
						"<div style='{background:url(image/gridload.gif) center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'>"+
						"<span style='{position:absolute;left: 50%;top: 40%;width: 100%; height: 100%;}'>P r o c e s s i n g</span></div>"+
					"</div>";
	    else
	        html =  
					"<div id='" + n + "_border1' style='{position: absolute;left: 1;top: 1;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.inner.left") + ";border-top: " + window.system.getConfig("3dborder.inner.top") + ";}'></div>" +
	                "<div id='" + n + "_border2' style='{position: absolute;left: -2;top: -2;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.inner.right") + ";border-bottom: " + window.system.getConfig("3dborder.inner.bottom") + ";}'></div>" +
	                "<div id='" + n + "_border3' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.outer.left") + ";border-top: " + window.system.getConfig("3dborder.outer.top") + ";}'></div>" +
	                "<div id='" + n + "_border4' style='{position: absolute;left: -1;top: -1;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.outer.right") + ";border-bottom: " + window.system.getConfig("3dborder.outer.bottom") + ";}'></div>" +
	                "<div id='" + n + "_frame' style='{position : relative; left: 1; top: 2; width: 100%; height: 100%;overflow: auto;}' "+
				" onMouseUp='system.getResource(" + this.resourceId + ").eventMouseUp(event);' " +
				">" +                	
				"<div id='" + n + "form' style='{position : relative; left: 2; top: 0; width: 100%; height: 100%;overflow: visible;}'></div>" +
	                "</div>"+
					"<div id='"+ n +"_block' style='{background:"+system.getConfig("form.grid.color")+";display:none;position:absolute;left: 0;top: 0; width: 100%; height: 100%;}'>"+
						"<div style='{background:url(image/gridload.gif) center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'>"+
						"<span style='{position:absolute;left: 40%;top: 40%;width: 100%; height: 100%;}'>P r o c e s s i n g</span></div>"+
					"</div>";
	    this.setInnerHTML(html, canvas);
		this.block = $(n+"_block");
	},
	eventMouseUp: function(event){	    
	    window.control_fileExplorerItem.prototype.parent.eventMouseUp.call(this, event);	
	},
	makeRounded: function(){
		settings = {
		  tl: { radius: 10 },
		  tr: { radius: 10 },
		  bl: { radius: 10 },
		  br: { radius: 10 },
		  antiAlias: true,
		  autoPad: true,
		  validTags: ["div"]
	    };		
		var rounded = new curvyCorners(settings,this.getFullId());				
		rounded.applyCornersToAll();
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
		for (var i in this.childs.objList){
			child = window.system.getResource(this.childs.get(i));
			if(child != undefined){
				ix++;
				child.childIndex = ix;
			}
		}	
	},
	clear: function(){
		var child;
		for (var i in this.childs.objList){
			child = window.system.getResource(this.childs.objList[i]);
			if(child != undefined)
				child.free();		
		}
		this.childs.clear();
	},
	doSelectItem: function(item){
	    var oldSelected = window.system.getResource(this.selectedItem);    
	    if (oldSelected instanceof control_fileExplorerItem)	
	        oldSelected.doDeselect();	

	    if (item instanceof control_fileExplorerItem)
	    {
	        this.selectedItem = item.getResourceId();
	        
	        this.onSelect.call(this, item);
	    }
	    else
	        this.selectedItem = undefined;
	},
	getSelectedItem: function(){
		return window.system.getResource(this.selectedItem);
	},
	setWidth: function(data){
		try{
		    window.control_fileExplorer.prototype.parent.setWidth.call(this, data);

		    var frame = $(this.getFullId() + "_frame");
		    frame.style.width = data - 3;				
		}catch(e){
			alert(e);
		}
	},
	setHeight: function(data){
	    window.control_fileExplorer.prototype.parent.setHeight.call(this, data);

	    var frame = $(this.getFullId() + "_frame");
	    frame.style.height = data - 4;
	},
	getMaxExpandLevel: function(node){
		var child = undefined;
		if (node instanceof control_fileExplorer)
			this.maxExpandLevel = 0;
		for (var i in node.childs.objList){
			child = window.system.getResource(node.childs.objList[i]);
			if (child instanceof window.control_fileExplorerItem)
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
		var child = undefined;
		var j = 0;
		for (var i in node.childs.objList){
			child = window.system.getResource(node.childs.objList[i]);
			childCanvas = child.getCanvas();				
			if (j == 0)
			{
			    if (childCanvas.style.borderTop == window.system.getConfig("3dborder.inner.top")) 
					childCanvas.style.borderTop = window.system.getConfig("3dborder.inner.bottom");
				else childCanvas.style.borderTop = window.system.getConfig("3dborder.inner.top");
			}
			j++;
			if (child instanceof window.control_fileExplorerItem)
			{
				if (child.isExpanded())				
				{												
					this.updateCanvas(child);	
				}else
				{								
				}
			}
		}		
	},
	updateWidth: function(node){
		var child = undefined;
		for (var i in node.childs.objList){
			child = window.system.getResource(node.childs.objList[i]);
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
	            if (item.isHasChild() || (!item.alreadyList && item.path != "roojaxnetwork" && item.path !== undefined)){
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
	           this.getSelectedItem().eventDblClick();
	       break;
       }
       return false;
	},
	setUsrRoot: function(usr, userPath,caption){
		this.user = usr;
		this.userPath = userPath;
		this.userRoot = this.rootDir +"/"+userPath;
		this.setPath(this.userRoot,caption);
	},
	getUsrRoot: function(usr){			
		return this.userRoot;	
	},
	getRootFolder: function(){
		return this.rootDir;	
	},
	refresh: function(data){
		this.setPath(this.folder);
	},
	setPath: function(data, caption){
		try{
			this.clear();
			this.showLoading();						
			this.folder = data;	
			if (this.user == undefined) this.user = this.folder;
			this.root = new control_fileExplorerItem(this);
			this.root.setCaption(caption === undefined? this.user : caption);							
			this.root.setSeparator(this.separator);
			this.root.setFolderName(this.userPath);
			this.root.setPath(this.folder);			
			this.root.iconElm.style.background = "url("+this.root.folderIcon+") top left no-repeat";			
			//this.file.setFilename(this.folder+this.separator);				
			this.hideLoading();
			this.root.setPopUpMenu(this.popUpMenu);
		}catch(e){
			this.hideLoading();
			if (systemAPI != undefined)
				systemAPI.alert(e,"");
			else alert(e);
		}
	},
	editItem: function(){
		var selected = window.system.getResource(this.selectedItem);
		selected.editItem();	
	},
	doRequestReady: function(sender, methodName, result, callObj){	
		if (sender == this.file && this == callObj){
			switch(methodName){
				case "listFolder": 
					var fold = result;
					if (fold == undefined) return false;
					if (fold.search(";") == -1)return false;		
					this.usrFolder = fold.split(";");
					var node, file,tipe;
					
					for (var i in this.usrFolder){			
						file = this.usrFolder[i];
						tipe = file.substr(file.lastIndexOf("_")+1);
						file = file.substr(0,file.lastIndexOf("_"));
						file = trim(file);			
						if (file != "" && file != "." && file != ".." && file != ".svn"){				
							if (tipe == "d") {
								node = new control_fileExplorerItem(this.root);
								node.setCaption(file);				
								node.setSeparator(this.separator);
								node.setFolderName(file);
								node.setPath(this.folder+this.separator+file);
								node.iconElm.style.background = "url("+node.folderIcon+") top left no-repeat";
								node.exploreChild();					
							}
						}
					}		
					break;			
			}
		}
	},
	showLoading: function(){
		this.block.style.display = "";
	},
	hideLoading: function(){
		this.block.style.display = "none";
	},
	setShowFile: function(data){
		this.showFile = data;
	}
});
/*spb0908264
nik 
*/
