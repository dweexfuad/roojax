//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_fileExplorerItem = function(owner){
    if (owner){
        this.owner = owner;
		if (owner instanceof control_fileExplorer)		
			this.level = 1;
		else if (owner instanceof control_fileExplorerItem)
			this.level = owner.getLevel() + 1;
		this.leftFrame = 0;
		this.childIndex = owner.childs.getLength() + 1;
		this.className = "control_fileExplorerItem";
		window.control_fileExplorerItem.prototype.parent.constructor.call(this, owner);        
		this.caption = "Tree Item";       
		this.icon = undefined;
		this.onSelect = new control_eventHandler();
		this.kode = undefined;
		
		this.color = "#d9d7c6";
		this.clicked = false;	
		this.isRightClick = false;
		this.share = false;
		this.shareName = "";
		this.readOnly = false;
		
		this.mouseX = 0;
		this.mouseY = 0;
		
		this.showKode = false;
		
		this.data = undefined;
		this.data2 = undefined;		
		
		this.folderIcon = "image/themes/"+system.getThemes()+"/treeFolder1.png";
		this.fileIcon =  "image/themes/"+system.getThemes()+"/treeNode.png";
		this.folderIconList = "classes/app/explorer/icon/folderSmall.png";
		//this.tree = this.getTreeView();	
		this.setPopUpMenu(this.tree.popUpMenu);
    }
};
window.control_fileExplorerItem.extend(window.control_containerControl);
window.fileExplorerItem = window.control_fileExplorerItem;
window.control_fileExplorerItem.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var left = 0;
		this.tree = this.getTreeView();
		var tree = this.tree;
		if (this.level == 1)
			left = 0;
		else left = 20;
		left = (this.level-1) * 20;
		var leftIcon = left + 18;
		var leftCaption= left + 38;
		var width = tree.childLength - 5;
		var widthCapt = width - leftCaption;
		this.leftFrame = leftCaption;
		    canvas.style.position = "relative";
		    canvas.style.width = width;
		    canvas.style.height = "auto";
		    canvas.style.left = 0;
		    canvas.style.top = 0;
		//canvas.style.background= "url(icon/"+system.getThemes()+"/treebg.png)";

	    var html =  "<div style='{cursor: pointer; position : relative; left: 0; top: 0; width: 100%; height: 20;}' " +
	                    "onMouseUp='system.getResource(" + this.resourceId + ").eventMouseDown(event);' " +
						"onMouseMove='system.getResource(" + this.resourceId + ").eventMouseMove(event);' " +
	                    "onDblClick='system.getResource(" + this.resourceId + ").eventDblClick(event);' " +
	                    ">" +
	                    "<div id='" + n + "_collapse' style='{display: none;position : absolute; left: "+left+"; top: 2; width: 16; height: 16;background: url(image/themes/"+system.getThemes()+"/treeCollapse1.png) top left no-repeat;}' " +
	                        "onMouseDown='system.getResource(" + this.resourceId + ").eventCollapeMouseDown(event);' " +
	                    "></div>" +										//18
	                    "<div id='" + n + "_icon' style='{position : absolute; left: "+leftIcon+"; top: 0; width: 16; height: 16;background: url(image/themes/"+system.getThemes()+"/treeNode.png) top left no-repeat;}'></div>" +			//38
	                    "<div id='" + n + "_iconshare' style='{display:none;position : absolute; left: "+leftIcon+"; top: 6; width: 10; height: 10;background: url(icon/explorer/share.png) top left no-repeat;}'></div>" +			//38
						"<div id='" + n + "_caption' style='{position : absolute; left: "+leftCaption+"; top: 2; width: auto; height: 16;}'>&nbsp;Tree Item&nbsp;</div>" +
	                    "<input id='"+ n +"_edit' type='' style='position:absolute;left:"+leftCaption+";top:2;width:50;height:20;display:none'"+
							"onBlur='system.getResource("+this.resourceId+").exitEdit(event)' "+
							"onKeyDown='system.getResource("+this.resourceId+").keyDown(event)' "+							
						"/>"+
						"<div id='" + n + "_frame' style='{position : absolute; left: "+leftCaption+"; top: 2; width: "+widthCapt+"; height: 100%;background: url(images/transparent.png) top left;}' " +
	                        "onMouseUp='system.getResource(" + this.resourceId + ").eventMouseUp(event);' " +
	                        "></div>" +
	                "</div>" +
	                "<div id='" + n + "form' style='{display: none;position : relative; left: 0; top: 0; width: "+width+"; height: auto;}'></div>"+
			"<div id='"+ n +"_block' style='{background:#123456;display:none;position:absolute;left: 0;top: 0; width: 100%; height: 100%;}'>"+
					"<div style='{background:url(image/upload.gif) center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'>"+
				"</div>";
		this.setInnerHTML(html, canvas);
		this.iconElm = $( n + "_icon");
		this.iconShare = $( n + "_iconshare");
		this.iconCollapse = $( n + "_collapse");
		this.edit = $( n + "_edit");
		this.block = $(n+"_block");
	},
	addChild: function(child){
	    if (child instanceof control_fileExplorerItem){
	        window.control_fileExplorerItem.prototype.parent.addChild.call(this, child);        
	        var node = $(this.getFullId() + "_collapse");
	        if (node != undefined) node.style.display = "";
		node = $(this.getFullId() + "_icon");
	    	if ((node != undefined) && (!this.isExpanded()) && this.path != "roojaxnetwork")
	        	node.style.background = "url(image/themes/"+system.getThemes()+"/treeFolder1.png) top left no-repeat";
	    }
	},
	delChild: function(child){
	    if (child instanceof control_fileExplorerItem){
	        window.control_fileExplorerItem.prototype.parent.delChild.call(this, child);
	        var node = $(this.getFullId() + "_collapse");        			
	        if (node != undefined){
				if (this.childs.getLength() == 0)		
					node.style.display = "none";
				else 
					node.style.display = "";			
			}
			node = $(this.getFullId() + "_icon");
	    	if ((node != undefined) && (!this.isExpanded()) && this.path != "roojaxnetwork")
				node.style.background = "url(image/themes/"+system.getThemes()+"/treeFolder1.png) top left no-repeat";			
	    }
	},
	expand: function(){
	    var node = $(this.getFullId() + "form");
	    if (node != undefined){
	        node.style.display = "";
			var tree = this.getTreeView();
			var maxLevel = tree.getMaxExpandLevel(tree);		
			if (this.childs.getLength() == 0){}				
		}
	    node = $(this.getFullId() + "_collapse");
	    if (node != undefined)
	        node.style.backgroundPosition = "bottom left";
		if (!this.alreadyList && this.path != "roojaxnetwork" && this.path !== undefined) this.exploreChild();
	},
	collapse: function(){
	    var node = $(this.getFullId() + "form");
	    if (node != undefined){
	        node.style.display = "none";
			var canvas = this.getCanvas();
			if (canvas != undefined){}
			//get owner
			var tree = this.getTreeView();
			var maxLevel = tree.getMaxExpandLevel(tree);			
		}
	    node = $(this.getFullId() + "_collapse");
	    if (node != undefined)
	        node.style.backgroundPosition = "top left";
	},
	doDeselect: function(sender){
	    var node = $(this.getFullId() + "_caption");
	    if (node != undefined){
	        node.style.backgroundColor = "";
	        node.style.color = system.getConfig("text.normalColor");
	    }
	    node = $(this.getFullId() + "_icon");

	    if ((node != undefined) && (!this.isExpanded()))
	        node.style.backgroundPosition = "top left";
		if (this.edit.style.display == "")this.edit.blur();
	},
	doSelect: function(){
		try{
			var tree = this.getTree();
			if (tree != undefined)
		        tree.doSelectItem(this);
			var node = $(this.getFullId() + "_caption");

		    if (node != undefined){
		        node.style.backgroundColor = system.getConfig("text.highlightBgColor");
		        node.style.color = system.getConfig("text.highlightColor");
		    }		    
		    node = $(this.getFullId() + "_icon");
		    if (node != undefined)
		        node.style.backgroundPosition = "bottom left";

		    this.onSelect.call(this);
		}catch(e){
			alert("treeNode:doSelect:"+e);
		}
	},
	eventMouseDown: function(event){
	    try{			
			var tree = this.getTreeView();
			//if (tree.popup.menuForm.visible)
			//	tree.popup.menuForm.setVisible(false);	   	
			this.doSelect();
			this.clicked = true;
			this.isRightClick = system.getButton(event) == 2;		
			if (this.app!= undefined && tree instanceof control_control) this.app.activeForm.setActiveControl(tree);
			if (this.isRightClick){
				window.control_fileExplorerItem.prototype.parent.eventMouseUp.call(this, event);	
			}
		}catch(e){
			alert(e);
		}
	},
	eventMouseUp: function(event){
		
		if (this.clicked){
			var tree = this.getTree();
			var selNode = tree.getSelectedItem();
			if ((selNode.getKode() != this.getKode())){			
				if (selNode.owner instanceof control_fileExplorerItem)
					if (selNode.owner.getKode() != this.getKode()) 
					{												   
						var kode = selNode.getKode();
						var capt = selNode.getCaption();
						var node = new treeNode(this);
						node.setKode(kode);
						node.setCaption(capt);
					}
			}
			this.clicked = false;
		}
	    var target = (document.all) ? event.srcElement : event.target;
	    var n = this.getFullId();		
	   //if ((target != undefined) && (target.id == (n + "_frame")))	   
	    window.control_fileExplorerItem.prototype.parent.eventMouseUp.call(this, event);	
	},
	eventMouseMove: function(event){
	    var target = (document.all) ? event.srcElement : event.target;
	    var n = this.getFullId();
		if (this.hint != undefined)
			system.showHint(event.clientX + 10, event.clientY + 10,this.hint);
	    if ((target != undefined) && (target.id == (n + "_frame")))
	        window.control_fileExplorerItem.prototype.parent.eventMouseUp.call(this, event);
		if (this.clicked){
			var x = event.clientX;
			var y = event.clientY;		
		}		
	},
	eventDblClick: function(event){
		if (this.isHasChild()){
		   if (this.isExpanded())
			   this.collapse();
		   else			
			this.expand();			
		}else {
			this.expand();
		}		
		var tree = this.getTreeView();
		tree.onDblClick.call(this);
	},
	eventCollapeMouseDown: function(sender){
	    if (this.isExpanded())
	        this.collapse();
	    else{
			if (this.alreadyList || this.path == "roojaxnetwork" || this.path == undefined) 
				this.expand();
			else if (this.path != "roojaxnetwork" && this.path !== undefined) this.exploreChild();
		}
	},
	isExpanded: function(){
	    var result = false;    
	    var node = $(this.getFullId() + "form");
	    if (node != undefined)
	        result = (node.style.display != "none");
	    return result;
	},
	getCaption: function(){
		return this.caption;
	},
	setCaption: function(data){
	    if (this.caption != data){
			this.caption = data; 		
	        var node = $(this.getFullId() + "_caption");
			if (node != undefined)
	            node.innerHTML = "<nobr>&nbsp;" + data + "&nbsp;</nobr>";
	        
			var width = (data.length * 6) + this.leftFrame;			
			var tree = this.tree;	
			if (width > tree.getWidth()){}			
	    }
	},
	getIcon: function(){
	    if (this.icon == undefined)
	        return "image/themes/"+system.getThemes()+"/treeFolder.png";
	    else
	        return this.icon;
	},
	setIcon: function(data){
	    if (data != this.icon){
	        this.icon = data;
	        var fileName = this.icon; // to do
	        
	        var node = $(this.getFullId() + "_icon");

	        if (node != undefined)
	            node.style.backgroundImage = "url(" + fileName + ")";
	    }
	},
	getTree: function(){
	    var result = this.owner;
	    while ((result != undefined) && !(result instanceof control_fileExplorer)){
	        result= result.getOwner();
	    }
	    return result;
	},
	setLevel: function(data){
		this.level = data;	
	},
	getLevel: function(){
		return this.level;
	},
	setColor: function(data){
		this.color = data;	
		var canvas = this.getCanvas();
		if (canvas != undefined)
			canvas.style.background = data;
	},
	getColor: function(){
		return this.color;
	},
	getTreeView: function(){
		var parent = this.owner;	
		while (!(parent instanceof control_fileExplorer))	
			parent = parent.owner;
		return parent;
	},
	setKode: function(data){
		this.kode = data;
	},
	getKode: function(){
		return this.kode;
	},
	setShowKode: function(data){
		this.showKode = data;
		if (data){		
	 		data = this.getKode() +" - " +this.caption;
	        var node = $(this.getFullId() + "_caption");
			if (node != undefined)
	            node.innerHTML = "<nobr>&nbsp;" + data + "&nbsp;</nobr>";       		
	    }
	},
	setData: function(data){
		this.data = data;
	},
	getData: function(){
		return this.data;
	},
	setData2: function(data){
		this.data2 = data;
	},
	getData2: function(){
		return this.data2;
	},
	clearChild: function(){
		var child;
		for (var i in this.childs.objList)
		{
			child = window.system.getResource(this.childs.objList[i]);
			if(child != undefined)
				child.free();		
		}
		var node = $(this.getFullId() + "_collapse");
		if (node != undefined)
			node.style.display = "none";
		this.childs.clear();
	},
	findChild: function(caption){
		try{
			var child;
			for (var i in this.childs.objList)
			{
				child = window.system.getResource(this.childs.objList[i]);
				if(child != undefined && child.getCaption() == caption){
					return child;	
				}					
			}
			return false;
		}catch(e){
			alert(e);
			return false;
		}
	},
	rearrange: function(){
		var child,ix = 0;
		for (var i in this.childs.objList)
		{
			child = window.system.getResource(this.childs.get(i));
			if(child != undefined){
				ix++;
				child.childIndex = ix;
			}
		}	
	},
	setSeparator: function(data){	
		this.separator = data;
	},
	setFolderName: function(data){	
		this.folderName = data;
	},
	getFolderName: function(){	
		return this.folderName;
	},
	getRealPath: function(){	
		var result = this.owner;
		var path = this.folderName;
		while ((result != undefined) && !(result instanceof control_fileExplorer) && (result.getFolderName() !== undefined))
		{
			path = result.getFolderName()+this.separator+path;
			result= result.getOwner();
		}
		return path;
	},
	setPath: function(data){	
		//this.hint = data+this.separator;		
		this.path = data;	
		if (data == "roojaxnetwork") data = undefined;
		this.file = this.app._file;//data		
		this.file.addListener(this);		
		this.alreadyList = false;
		//this.path undefined digunakan untuk sharing network user path.
		this.file.isDirA(this.path, undefined, this);
		if (this.path == "roojaxnetwork" || this.path === undefined)  this.iconCollapse.style.display = "";
		else this.iconCollapse.style.display = "none";
	},
	getPath: function(){	
		return this.path;
	},
	getContaint: function(){				
		return this.containt;
	},
	exploreChild: function(){	
		try{
			this.clearChild();
			if (this.path != "roojaxnetwork" && this.path !== undefined)
				if (this.file.isDir(this.path)) this.file.listFolderA(this.path+this.separator, undefined, this);//this.getContaint();		
			this.alreadyList = true;	
		}catch(e){
			if (systemAPI != undefined) systemAPI.alert(e,"ExploreItem::exploreChild");
			else alert(e);
		}
	},
	exitEdit: function(event){
		var path = this.path;//.substr(0,this.path.lastIndexOf(this.separator)-1);
		path = path.substr(0,path.lastIndexOf(this.separator)+1);	
		this.edit.style.display = "none";
		var oldValue = this.caption;
		this.setCaption(this.edit.value);
		this.setFolderName(this.edit.value);
		this.setPath(path+this.edit.value);					
		var tree = this.tree;
		tree.onAfterEdit.call(this,oldValue, this.caption);
	},
	keyDown: function(event){
		if (event.keyCode == 13){
			this.edit.blur();
		}
	},
	refresh: function(){
		this.exploreChild();
	},
	editItem: function(){	
		this.edit.style.width = this.caption.length * 8;
		this.edit.value = this.caption;
		this.edit.style.display = "";
		this.edit.focus();
	},
	doRequestReady: function(sender, methodName, result, callObj){	
		try{
			if (sender == this.file && this == callObj){
				switch(methodName){
					case "createDir":				
						this.refresh();
						break;
					case "isDir" :
					   if (result) this.iconCollapse.style.display = "";
					   else this.iconCollapse.style.display = "none";
					   break;
					case "listFolder": 									    
						this.showLoading();
						this.containt = result;
						var fold = result;
						if (fold == undefined) return false;
						if (fold.search(";") == -1)return false;		
						var data = fold.split(";");		
						var node, file,tipe, folder = [], fileList = [];			
						for (var i in data){			
							file = data[i];
							tipe = file.substr(file.lastIndexOf("_")+1);
							file = file.substr(0,file.lastIndexOf("_"));
							file = trim(file);																	
							if (file != "" && file != "." && file != ".." && file != ".svn"){		
								if (tipe == "d") folder[folder.length] = file;								
								if (tipe == "f") fileList[fileList.length] = file;								
							}else if (file == ".svn") {
								this.alreadyCheckOut = true;
							}
						}	
						folder.sort();
						fileList.sort();
						for (var i in folder){
							file = folder[i];
							node = new control_fileExplorerItem(this);
							node.setCaption(file);				
							node.setSeparator(this.separator);
							node.setFolderName(file);
							node.setPath(this.path+this.separator+file);
							node.iconElm.style.background = "url("+node.folderIcon+") top left no-repeat";														
						}
						if (this.tree.showFile){
							for (var i in fileList){
								file = fileList[i];
								node = new control_fileExplorerItem(this);
								node.setCaption(file);				
								node.setSeparator(this.separator);
								node.setFolderName(file);
								node.setPath(this.path+this.separator+file);
								var ext = file.substring(file.lastIndexOf(".")+1);								
								node.iconElm.style.background = "url(icon/explorer/"+ext+".ico) top left no-repeat";						
							}	
						}
						this.hideLoading();
						if (folder.length + fileList.length > 0) this.expand();
						this.tree.onDataReady.call(this.tree,this, result);						
					break;			
				}
			}
		}catch(e){
			this.hideLoading();
			systemAPI.alert(e);
		}
	},
	showLoading: function(){
		this.block.style.display = "";
	},
	hideLoading: function(){
		this.block.style.display = "none";
	},
	isAlreadyCheckOut: function(){
		return this.alreadyCheckOut == true;
	},
	setShare: function(data, shareName){
		this.share = data;
		this.shareName = shareName;		
		this.iconShare.style.display = data ? "" :"none";
	},
	isLastChild: function(){
	   return (this.owner.childs.getLength() == this.childIndex);
    },
    isFirstChild: function(){
	   return (this.childIndex == 1);
    }
});
