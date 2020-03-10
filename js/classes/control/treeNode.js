//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_treeNode = function(owner,options){
    if (owner){       
		if (owner instanceof control_treeView)		
			this.level = 1;
		else if (owner instanceof control_treeNode)
			this.level = owner.getLevel() + 1;
		else {		
			this.level = 1;
		}
		this.leftFrame = 0;
		this.childIndex = owner.childs.getLength() + 1;		
		this.childLength = owner.childLength;
		window.control_treeNode.prototype.parent.constructor.call(this, owner,options);        		
		this.className = "control_treeNode";
        this.caption = "Tree Item";        
        this.icon = undefined;
        this.onSelect = new control_eventHandler();
        this.kode = undefined;
		this.kodeForm = undefined;
		this.selected = false;
		this.color = "#d9d7c6";
		this.clicked = false;	
		this.isRightClick = false;
		
		this.mouseX = 0;
		this.mouseY = 0;
		
		this.showKode = false;
		
		this.data = undefined;
		this.data2 = undefined;
		this.isXML = false;
		this.childHasCreated = true;
		this.autoCreateChild = true;
		this.dbLib = this.app._dbLib;
		if (this.dbLib) this.dbLib.addListener(this);
		if (options !== undefined){
			if (options.caption !== undefined) this.setCaption(options.caption);
			if (options.color !== undefined) this.setColor(options.color);
			if (options.kode !== undefined) this.setKode(options.kode);
			if (options.kodeForm !== undefined) this.setKodeForm(options.kodeForm);
			if (options.data !== undefined) this.setData(options.data);
			if (options.icon !== undefined) this.setIcon(options.icon);
			if (options.iconWidth !== undefined) this.setIconWidth(options.iconWidth);
		}
    }
};
window.control_treeNode.extend(window.control_containerControl);
window.treeNode = window.control_treeNode;
window.control_treeNode.implement({
	doDraw : function(canvas){
	    var n = this.getFullId();
		var left = 0;
		var tree = this.getTreeView();
		if (this.level == 1)
			left = 0;
		else left = 20;
		left = (this.level-1) * 20;
		var leftIcon = left + 18;
		var leftCaption= left + 38;
	    var width = this.childLength - 5;
		var widthCapt = width - leftCaption;
		this.leftFrame = leftCaption;
		canvas.css({position:"relative", width: "auto", height:"auto", left:0, top : 0 , background:"#eee"});	    

	    var html =  "<div style='{cursor: pointer; position : relative; left: 0; top: 0; width: 100%; height: 20;}' " +
	                    "onMouseDown='$$$(" + this.resourceId + ").eventMouseDown(event);' " +
						"onMouseMove='$$$(" + this.resourceId + ").eventMouseMove(event);' " +
						"onMouseOver='$$$(" + this.resourceId + ").eventMouseOver(event);' " +
						"onMouseOut='$$$(" + this.resourceId + ").eventMouseOut(event);' " +
	                    "onDblClick='$$$(" + this.resourceId + ").eventDblClick(event);' " +
	                    //"onClick='$$$(" + this.resourceId + ").eventDblClick(event);' " +
	                    ">" +
	                    "<div id='" + n + "_collapse' style='{display: none;position : absolute; left: "+left+"; top: 2; width: 16; height: 16;background: url(image/themes/"+system.getThemes()+"/treeCollapse1.png) top left no-repeat;}' " +
	                       	"onMouseDown='$$$(" + this.resourceId + ").eventCollapeMouseDown(event);' " +
	                    "></div>" +										//18
	                    "<div id='" + n + "_icon' style='{position : absolute; left: "+leftIcon+"; top: 0; width: 16; height: 16;background: url(image/themes/"+system.getThemes()+"/treeNode.png) top left no-repeat;}'></div>" +			//38
	                    "<div id='" + n + "_caption' style='{position : absolute; left: "+leftCaption+"; top: 2; width: auto; height: 16;}'>&nbsp;Tree Item&nbsp;</div>" +											//38
	                    "<div id='" + n + "_frame' style='{position : absolute; left: "+leftCaption+"; top: 2; width: auto; height: 100%;background: url(images/transparent.png) top left;}' " +
	                        "onMouseUp='$$$(" + this.resourceId + ").eventMouseUp(event);' " +
	                        "></div>" +
	                "</div>" +
	                "<div id='" + n + "form' style='{display: none;position : relative; left: 0; top: 0; width: auto; height: auto;}'></div>";
	    this.setInnerHTML(html, canvas);
		
	},
	addChild: function(child){
	    if (child instanceof control_treeNode)
	    {
	        window.control_treeNode.prototype.parent.addChild.call(this, child);
	        
	        var node = $("#"+this.getFullId() + "_collapse");
	        node.show()
			node = $("#"+this.getFullId() + "_icon");
	    	if ((node != undefined) && (!this.isExpanded()))
	        	node.css({background : "url(image/themes/"+system.getThemes()+"/treeFolder1.png) top left no-repeat" });			
			
	    }
	},
	delChild: function(child){
	    if (child instanceof control_treeNode)
	    {
	        window.control_treeNode.prototype.parent.delChild.call(this, child);
	        var node = $("#"+this.getFullId() + "_collapse");        			
	        if (node != undefined)
			{
				if (this.childs.getLength() == 0)		
					node.hide();
				else 
					node.show();
			}
			node = $("#"+this.getFullId() + "_icon");

	    	if ((node != undefined) && (!this.isExpanded()))
			{
				if (this.childs.getLength() == 0)		
					node.css({background : "url(image/themes/"+system.getThemes()+"/treeNode.png) top left no-repeat" });
				else 
					node.css({background : "url(image/themes/"+system.getThemes()+"/treeFolder1.png) top left no-repeat" });
			}
	    }
	},
	expand: function(){	
	    var node = $("#"+this.getFullId() + "form");    		
	    node.show();
	    node = $("#"+this.getFullId() + "_collapse");	    
	    node.css({backgroundPosition : "bottom left" });
		if (this.isXML && !this.childHasCreated){
			this.childHasCreated = true;
			var nodeTr, node = this.xmlNode.firstChild;
			var kodeForm, kode, nama;
			while (node != undefined){		
				var nd = node.firstChild;		
				while (nd != undefined){				
					if (nd.tagName == "kode_form") kodeForm = nd.firstChild.nodeValue;
					else if (nd.tagName == "kode_menu") kode = nd.firstChild.nodeValue;
					else if (nd.tagName == "nama") nama = nd.firstChild.nodeValue;
					nd = nd.nextSibling;
				}				
				nodeTr = new control_treeNode(this);			
				nodeTr.setKodeForm(kodeForm);
				nodeTr.setKode(kode);
				nodeTr.setCaption(nama);		
				nodeTr.setXMLNode(node.lastChild);
				node = node.nextSibling;
			}		
		}
		if (node != undefined)
		{	        
			var tree = this.getTreeView();
			var maxLevel = tree.getMaxExpandLevel(tree);
			tree.updateCanvas(tree);		
		}
	},
	collapse: function(){
	    var node = $("#"+this.getFullId() + "form");
	    if (node != undefined)
		{
	        node.hide()
            var tree = this.getTreeView();
			var canvas = this.getCanvas();
			if (canvas != undefined && tree.styled)
				canvas.css({background : "url(icon/"+system.getThemes()+"/treeCol.png)" });
			//get owner
			var maxLevel = tree.getMaxExpandLevel(tree);
			tree.updateCanvas(tree);
		}
	    node = $("#"+this.getFullId() + "_collapse");

	    if (node != undefined)
	        node.css({backgroundPosition : "top left" });
	},
	doDeselect: function(sender){
		this.selected = false;
	    var node = $("#"+this.getFullId() + "_caption");
	    if (node != undefined){
	        node.css({backgroundColor : "",
	        	color : system.getConfig("text.normalColor") }); 
	    }
	    node = $("#"+this.getFullId() + "_icon");
	    if ((node != undefined) && (!this.isExpanded()))
	        node.css ({ backgroundPosition : "top left" });
	},
	isSelected: function(){
		return this.selected;
	},
	doSelect: function(){
		try{		
			this.selected = true;	
			var tree = this.getTreeView();				
			if (tree != undefined && tree instanceof control_treeView)
		        tree.doSelectItem(this);			
			var node = $("#"+this.getFullId() + "_caption");
		    if (node != undefined){				
				node.css({backgroundColor : "#0099cc" ,
						color : "#fff"});
		    }
		    node = $("#"+this.getFullId() + "_icon");
		    if (node != undefined)
		        node.css({backgroundPosition : "bottom left" });
		    this.onSelect.call(this);
		}catch(e){
			systemAPI.alert("treeNode:doSelect:"+e);
		}
	},
	eventMouseOver: function(event){		
		try{			
			var node = $("#"+this.getFullId() + "_caption");
		    if (node != undefined){				
				node.css({backgroundColor : "#0099cc",
						color : "#fff"});
		    }		    
		}catch(e){
			systemAPI.alert("treeNode:doSelect:"+e);
		}
	},	
	eventMouseOut: function(event){		
		try{			
			var node = $("#"+this.getFullId() + "_caption");
		    if (node != undefined){			
		    	if (this.isSelected()) 
		    		node.css({ backgroundColor : "#0099cc", 
						color : "#fff" });
		    	else 
					node.css({ backgroundColor : "transparent", 
						color : "#000" });
		    }	

		}catch(e){
			systemAPI.alert("treeNode:doSelect:"+e);
		}
	},	
	eventMouseDown: function(event){
	    try{
			var tree = this.getTreeView();			
			tree.owner.setActiveControl(tree);
			this.doSelect();
			this.clicked = true;
			this.isRightClick = system.getButton(event) == 2;
			if (this.isRightClick){							
			}
		}catch(e){
			alert(e);
		}
	},
	eventMouseUp: function(event){
		if (this.clicked)
		{			
			this.clicked = false;
		}
	    var target = (document.all) ? event.srcElement : event.target;

	    var n = this.getFullId();
		
	    if ((target != undefined) && (target.id == (n + "_frame")))
	        window.control_treeNode.prototype.parent.eventMouseUp.call(this, event);		
	},
	eventMouseMove: function(event){
	    var target = (document.all) ? event.srcElement : event.target;

	    var n = this.getFullId();
		if (this.hint != undefined)
			system.showHint(event.clientX + 10, event.clientY + 10,this.hint);
	    if ((target != undefined) && (target.id == (n + "_frame")))
	        window.control_treeNode.prototype.parent.eventMouseUp.call(this, event);
		if (this.clicked)
		{
			var x = event.clientX;
			var y = event.clientY;		
		}	
	},
	eventDblClick: function(event){
		if (this.isHasChild() || (this.isXML && this.xmlNode.firstChild.nodeValue != "-"))
		{
		   if (this.isExpanded())
			   this.collapse();
		   else
			   this.expand();
		}
		var tree = this.getTreeView();
	    tree.onDblClick.call(this, tree);
	},
	eventClick: function(event){
		try{
			if (this.isHasChild() || (this.isXML && this.xmlNode.firstChild.nodeValue != "-"))
			{
			   if (this.isExpanded())
				   this.collapse();
			   else
				   this.expand();
			}
			var tree = this.getTreeView();
			tree.onDblClick.call(this, tree);
		}catch(e){
			error_log(e);
		}
	},
	eventCollapeMouseDown: function(sender){
	    if (this.isExpanded())
	        this.collapse();
	    else
	        this.expand();
	},
	isExpanded: function(){
	    var result = false;
	    var node = $("#"+this.getFullId() + "form");
	    if (node != undefined)
	        result = (node.is(':visible'));
	    return result;
	},
	getCaption: function(){
		return this.caption;
	},
	setCaption: function(data){
	    if (this.caption != data)
	    {
			var kode = this.getKodeForm();
			
	        this.caption = data;
	 		if (kode != "-" && kode !== undefined)		
				data =  kode + " - " +data;
	        var node = $("#"+this.getFullId() + "_caption");			
	        node.html( "<nobr>&nbsp;" + data + "&nbsp;</nobr>" );
	        
			var width = (data.length * 6) + this.leftFrame;			
			var tree = this.getTreeView();	
			if (width > tree.getWidth())
			{
			//	tree.setWidth(width);
			}
	    }
	},
	getIcon: function(){
	    if (this.icon == undefined)
	        return "image/themes/"+system.getThemes()+"/treeFolder.png";
	    else
	        return this.icon;
	},
	setIcon: function(data){
	    if (data != this.icon)
	    {
	        this.icon = data;
	        var fileName = this.icon; // to do
	        
	        var node = $("#"+this.getFullId() + "_icon");

	        if (node != undefined)
	            node.css({backgroundImage : "url(" + fileName + ")" });
	    }
	},
	getTree: function(){
	    var result = this.getTreeView();
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
		this.getCanvas().css({background : data });		
	},
	getColor: function(){
		return this.color;
	},
	getTreeView: function(){
		var parent = this.owner;
		
		while (parent instanceof control_treeNode)	
			parent = parent.owner;	
		return parent;
	},
	setKodeForm: function(data){
		this.kodeForm = data;
	},
	getKodeForm: function(){
		return this.kodeForm;
	},
	setKode: function(data){
		this.kode = data;
	},
	getKode: function(){
		return this.kode;
	},
	setShowKode: function(data){
		this.showKode = data;
		if (data)
	    {
			var kode = this.getKodeForm();	
	 		if (kode != "-" )		
				data =  this.getKode() +" - " + kode + " - " +this.caption;
			else data = this.getKode() +" - " +this.caption;
	        var node = $("#"+this.getFullId() + "_caption");
			if (node != undefined)
	            node.html (  "<nobr>&nbsp;" + data + "&nbsp;</nobr>" );
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
		for (var i in this.childs.objList)
		{
			child = $$$(this.childs.objList[i]);
			if(child != undefined)
				child.free();		
		}
		var node = $("#"+this.getFullId() + "_collapse");	
		node.hide();
		this.childs.clear();
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
	setXMLNode: function(node){
		//for (var i in node) alert(i + " " +node[i]);
		//alert(node.cloneNode);
		this.xmlNode = node.cloneNode(true);	
		this.isXML = true;    
		this.childHasCreated = false;
		if (node.firstChild.nodeValue != "-"){
			node = $("#"+this.getFullId() + "_collapse");			
			node.show();
			node = $("#"+this.getFullId() + "_icon");

			if ((node != undefined) && (!this.isExpanded()))
				node.css ({ background : "url(image/themes/"+system.getThemes()+"/treeFolder1.png) top left no-repeat" });
		}
	},
	setIconWidth: function(data){
		if (this.level == 1)
			var left = 0;
		else var left = 20;
		left = (this.level-1) * 20;
		var leftIcon = left + 18;
		var leftCaption= leftIcon + data;
	    var width = this.childLength - 5;
		var widthCapt = width - leftCaption;		
		var node = $("#"+this.getFullId() + "_icon");
		if (node != undefined){
			node.css({ width : leftIcon });
			node = $("#"+this.getFullId() + "_caption");
			if (node != undefined){
				node.css({left : leftCaption,
						width : widthCapt });
			}
		}	
	},
	isLastChild: function(){
	   return (this.owner.childs.getLength() == this.childIndex);
    },
    isFirstChild: function(){
	   return (this.childIndex == 1);
    },
    free: function(){
		if (this.dbLib != undefined) this.dbLib.delListener(this);
		window.control_treeNode.prototype.parent.free.call(this);	
	},
	doRequestReady: function(sender, methodName, result, callObj){
		try{				
			if (sender == this.dbLib && this == callObj){						
				switch (methodName){
					case "getDataProvider" :														
                        eval('result = ' + result +';');                        
						if (typeof(result) !== "string"){	
						}
					break
				}
			}
		}catch(e){
		}
	},
	setWidth:function(){
		
	}
});
