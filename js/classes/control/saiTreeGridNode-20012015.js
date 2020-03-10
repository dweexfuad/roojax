//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiTreeGridNode = function(owner,options){
    if (owner){       
		if (owner instanceof control_saiTreeGrid)		
			this.level = 0;
		else if (owner instanceof control_saiTreeGridNode)
			this.level = owner.getLevel() + 1;
		else {		
			this.level = 0;
		}
		this.leftFrame = 0;
		this.childIndex = owner.childs.getLength() + 1;		
		this.childLength = owner.childLength;
		window.control_saiTreeGridNode.prototype.parent.constructor.call(this, owner,options);        		
		this.className = "control_saiTreeGridNode";
        this.caption = "Tree Item";        
        this.icon = undefined;
        this.onSelect = new control_eventHandler();
        this.kode = undefined;
		this.kodeLain = undefined;
		
		this.color = "#d9d7c6";
		this.clicked = false;	
		this.isRightClick = false;
		
		this.mouseX = 0;
		this.mouseY = 0;
		this.rowIndex = -1;
		this.showKode = false;
		this.selected = false;
		
		this.data = undefined;
		this.data2 = undefined;
		this.isXML = false;
		this.childHasCreated = true;
		this.autoCreateChild = true;
		this.dbLib = this.app._dbLib;
		this.rowHeight = 30;
		if (this.dbLib) this.dbLib.addListener(this);
		if (options !== undefined){
			if (options.caption !== undefined) this.setCaption(options.caption);
			if (options.color !== undefined) this.setColor(options.color);
			if (options.data !== undefined) this.setData(options.data);
			if (options.icon !== undefined) this.setIcon(options.icon);
			if (options.iconWidth !== undefined) this.setIconWidth(options.iconWidth);
		}
    }
};
window.control_saiTreeGridNode.extend(window.control_containerControl);
window.saiTreeGridNode = window.control_saiTreeGridNode;
window.control_saiTreeGridNode.implement({
	doDraw : function(canvas){
	    var n = this.getFullId();
		var left = 0;
		var tree = this.getAccordion();
		

		left = 0;
		var leftIcon = left + 18;
		var leftCaption= left + 38;
	    var width = this.childLength;
		var widthCapt = width - leftCaption;
		this.leftFrame = leftCaption;
		canvas.css({position:"relative", width: "100%", height:"auto", left:0, top : 0 , background:"transparent"});	    

	    var html =  "<div style='{cursor: pointer; position : relative; left: 0; top: 0; width: 100%; height: "+tree.rowHeight+";background:url(icon/grey_gradient.png);border-bottom:1px solid #999' " +
	                    "onMouseDown='$$$(" + this.resourceId + ").eventMouseDown(event);' " +
						"onMouseMove='$$$(" + this.resourceId + ").eventMouseMove(event);' " +
						"onMouseOver='$$$(" + this.resourceId + ").eventMouseOver(event);' " +
						"onMouseOut='$$$(" + this.resourceId + ").eventMouseOut(event);' " +
	                    //"onDblClick='$$$(" + this.resourceId + ").eventDblClick(event);' " +
	                   //
	                    ">" +
	                    "<div id='" + n + "_collapseCont' style='position:absolute;left:0;top:0;width:38;height:100%;'> "+
		                    "<div id='" + n + "_collapse' style='{display: none;position : absolute; left: "+left+"; top: 0; width: 16; height: 16;background: url(image/themes/"+system.getThemes()+"/treeCollapse1.png) top left no-repeat;}' " +
		                //        "onClick='$$$(" + this.resourceId + ").eventClick(event);' " +
		                    "></div>" +										//18
	                    //"<img id='" + n + "_icon' style='{position : absolute; left: "+leftIcon+"; top: 5; width: 16; height: 16}' src='icon/twg/gear_48.png'></img>" +			//38
	                    "</div> "+
	                    "<div id='" + n + "_caption' style='{position : absolute; left: "+leftCaption+"; top: 0; width: auto; height: 100%;}'></div>" +											//38
	                    "<div id='" + n + "_frame' style='{position : absolute; left: "+leftCaption+"; top: 0; width: auto; height: 100%;background: url(images/transparent.png) top left;}' " +
	                        "onMouseUp='$$$(" + this.resourceId + ").eventMouseUp(event);' " +
	                        "></div>" +
	                "</div>" +
	                "<div id='" + n + "form' style='{display: none;position : relative; left: 0; top: 0; width: auto; height: auto;}'></div>";
	    this.setInnerHTML(html, canvas);
		var node = $("#"+ n +"_collapse");
		node.bind("click", {resource:this.resourceId, id: n }, function(event){
			$$$(event.data.resource).eventClick(event, event.data.id);
		});
		canvas.bind("dblClick", {resource:this.resourceId, id: n }, function(event){
			$$$(event.data.resource).eventDblClick(event, event.data.id);
		});
	},
	setItemData: function(data){
		this.setCaption(data.caption);
	},
	addChild: function(child){
	    if (child instanceof control_saiTreeGridNode)
	    {
	        window.control_saiTreeGridNode.prototype.parent.addChild.call(this, child);
	        
	        var node = $("#"+this.getFullId() + "_collapse");
	        node.show();
			node = $("#"+this.getFullId() + "_icon");
	    	
	    }
	},
	delChild: function(child){
	    if (child instanceof control_saiTreeGridNode)
	    {
	        window.control_saiTreeGridNode.prototype.parent.delChild.call(this, child);
	        var node = $("#"+this.getFullId() + "_collapse");        			
	        if (node != undefined)
			{
				if (this.childs.getLength() == 0)		
					node.hide();
				else 
					node.show();
			}
			
	    }
	},
	expand: function(){	
		var node = $("#"+this.getFullId() + "formClone");    		
	    if (node.length != 0){
	    	node.show();
		    node = $("#"+this.getFullId() + "_collapseClone");	    
		    node.css({backgroundPosition : "bottom left" });
		}

	    var node = $("#"+this.getFullId() + "form");    		
	    node.show();
	    node = $("#"+this.getFullId() + "_collapse");	    
	    node.css({backgroundPosition : "bottom left" });
		if (this.isXML && !this.childHasCreated){
			this.childHasCreated = true;
			var nodeTr, node = this.xmlNode.firstChild;
			var nama;
			while (node != undefined){		
				var nd = node.firstChild;		
				while (nd != undefined){				
					if (nd.tagName == "nama") nama = nd.firstChild.nodeValue;
					nd = nd.nextSibling;
				}				
				nodeTr = new control_saiTreeGridNode(this);			
				nodeTr.setItemData({'caption' : nama});		
				nodeTr.setXMLNode(node.lastChild);
				node = node.nextSibling;
			}		
		}
		if (node != undefined)
		{	        
			var tree = this.getAccordion();
			//tree.updateCanvas(tree);		
		}
	},
	collapse: function(){
		var node = $("#"+this.getFullId() + "formClone");    		
	    if (node.length != 0){
	    	node.hide();
		    node = $("#"+this.getFullId() + "_collapseClone");	    
		    node.css({backgroundPosition : "top left" });
		}
	    var node = $("#"+this.getFullId() + "form");
	    node.hide();
		node = $("#"+this.getFullId() + "_collapse");
		node.css({backgroundPosition : "top left" });
	},
	doDeselect: function(sender){
	    var node = $("#"+this.getFullId() + "_caption");
	    node = $("#"+this.getFullId() + "_icon");
	  
	},
	doSelect: function(){
		try{			
			var tree = this.getAccordion();				
			if (tree != undefined && tree instanceof control_accordion)
		        tree.doSelectItem(this);			
			var node = $("#"+this.getFullId() + "_caption");
		    
		    this.onSelect.call(this);
		}catch(e){
			systemAPI.alert("treeNode:doSelect:"+e);
		}
	},
	eventMouseOver: function(event){		
		try{			
			var node = $("#"+this.getFullId() + "_caption");   
		}catch(e){
			systemAPI.alert("treeNode:doSelect:"+e);
		}
	},	
	eventMouseOut: function(event){		
		try{			
			var node = $("#"+this.getFullId() + "_caption");    
		}catch(e){
			systemAPI.alert("treeNode:doSelect:"+e);
		}
	},	
	eventMouseDown: function(event){
	    try{
			var tree = this.getAccordion();			
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
	        window.control_saiTreeGridNode.prototype.parent.eventMouseUp.call(this, event);		
	},
	eventMouseMove: function(event){
	    var target = (document.all) ? event.srcElement : event.target;

	    var n = this.getFullId();
		if (this.hint != undefined)
			system.showHint(event.clientX + 10, event.clientY + 10,this.hint);
	    if ((target != undefined) && (target.id == (n + "_frame")))
	        window.control_saiTreeGridNode.prototype.parent.eventMouseUp.call(this, event);
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
		//var tree = this.getAccordion();
	    //tree.onDblClick.call(this, tree);
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
			var kode = "-";
			
	        this.caption = data;
	 		if (kode != "-" && kode !== undefined)		
				data =  kode + " - " +data;
	        var node = $("#"+this.getFullId() + "_caption");			
	        //node.html( "<nobr>&nbsp;" + data + "&nbsp;</nobr>" );
	        
			
	    }
	},
	getIcon: function(){
	    if (this.icon == undefined)
	        return "icon/twg/folder_48.png";
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
	            node.attr("src",fileName);
	    }
	},
	getTree: function(){
	    var result = this.getAccordion();
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
		$("#"+this.getFullId()+"_clone").css({background : data });		
	},
	setFontColor: function(data){
		this.fontColor = data;
		this.getCanvas().css({color : data });		
		$("#"+this.getFullId()+"_clone").css({color : data });		
	},
	getColor: function(){
		return this.color;
	},
	getAccordion: function(){
		var parent = this.owner;
		
		while (parent instanceof control_saiTreeGridNode)	
			parent = parent.owner;	
		return parent;
	},
	setData: function(data, fields, rowIndex, id){
		this.data = data;
		this.itemId = id;
		this.dataFields = fields;
		this.rowIndex = rowIndex;
		var len = this.rowIndex;
		var sg = this.getAccordion();
		
		var nodeCont = $("#"+this.getFullId() + "_caption");
		nodeCont.css({borderBottom:"1px solid #999"});
		var left = 0;
		for (var i = 0; i < fields.length; i ++){
		   // var col = sg.columns.get(i);
		    var id = sg.getFullId()+"_row"+len+"_cell"+i;
			var node = $("<div id='"+id+"'></div>");
				node.css({ 
					height : "100%",
					width : sg.columnWidth.get(i),
					textAlign: sg.columnFormat.get(i) == cfNilai ? 'right' : 'left',
					left: left, 
					borderRight :  "1px solid #999",
					overflow:"hidden",
					whiteSpace: "nowrap",
					position : "absolute" });		
				/*if (sg.columnFormat.get(i) != cfBoolean ){
					node.attr("contenteditable","true");
				}else 
					node.attr("contenteditable","false");*/
				if (sg.columnFormat.get(i) == cfNilai){
					//node.html(floatToNilai(data[fields[i]]));
					
					node.html("<div  id='"+id+"_edit' style='white-space:nowrap;text-overflow:ellipsis;position:absolute;left:3px;top:2px;width:"+(sg.columnWidth.get(i) - 6)+"px;height:"+(sg.rowHeight - 6)+"px'>"+floatToNilai(data[fields[i]])+"</div>");
				}else if (sg.columnFormat.get(i) == cfBoolean){
					if (data[fields[i]] === true || data[fields[i]].toUpperCase() == "TRUE")
						node.html("<div style='position:absolute;top:3;left:3;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
					else node.html("<div style='position:absolute;top:3;left:3;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
					
				}else if (sg.columnFormat.get(i) == cfButton){
					node.html("<div style='position:absolute;width:100%;height:100%;text-align:center;background:#AE1B1A;color:#fff;border:1px solid #fff;border-radius:5px'>"+data[fields[i]]+"</div>");
					
				}else {
					node.html("<div id='"+id+"_edit' style='white-space:nowrap;text-overflow:ellipsis;position:absolute;left:3px;top:2px;width:"+(sg.columnWidth.get(i) - 6)+"px;height:"+(sg.rowHeight - 6)+"px'>"+data[fields[i]]+"</div>");
					//node.html(data[fields[i]]);
				}
				node.bind("click",{gridId:sg.resourceId, col:i, row:this.rowIndex, resourceId:this.resourceId}, function(event){
					try{
						$$$(event.data.gridId).col = event.data.col;
						$$$(event.data.gridId).row = event.data.row;
						var f = $$$(event.data.resourceId).dataFields;
						var d = $$$(event.data.resourceId).data;
						var columnFormat = $$$(event.data.gridId).columnFormat.get(event.data.col);
						if (columnFormat == cfBoolean){
							if (d[f[event.data.col]] === "TRUE"){
								d[f[event.data.col]] = "FALSE";
								$(this).html("<div style='position:absolute;top:3;left:3;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
							}else{
								d[f[event.data.col]] = "TRUE";
								$(this).html("<div style='position:absolute;top:3;left:3;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
							}
						}
						$$$(event.data.gridId).onClick.call($$$(event.data.gridId), event.data.col, event.data.row,$$$(event.data.resourceId) );
					}catch(e){
						error_log(e);
					}
				});
				node.bind("dblclick",{gridId:sg.resourceId, col:i, row:len, resourceId: this.resourceId}, function(event){
					$$$(event.data.gridId).col = event.data.col;
					$$$(event.data.gridId).row = event.data.row;
					if ($$$(event.data.gridId).selectedNode !== undefined)
						$$$(event.data.gridId).selectedNode.setSelected(false);
					$$$(event.data.gridId).selectedNode = $$$(event.data.resourceId);
					$$$(event.data.resourceId).setSelected(true);
					$$$(event.data.gridId).onDblClick.call($$$(event.data.gridId), event.data.col, event.data.row,$$$(event.data.resourceId) );
				});
				left += sg.columnWidth.get(i);
			nodeCont.append(node);
		}
		this.getCanvas().css({color:sg.levelFontColor[this.level],background:sg.levelColor[this.level], width:left + 38});
			
	},
	setSelected: function(selected){
		this.selected = selected;
		var sg = this.getAccordion();
		if (selected){
			this.getCanvas().css({color:sg.selectedFontColor,background:sg.selectedColor});
		}else{
			this.getCanvas().css({color:sg.levelFontColor[this.level],background:sg.levelColor[this.level]});
		}
	},
	setCellValue: function(col, value){
		this.data[this.dataFields[col]] = value;
		var sg = this.getAccordion();
		//sg.rowData[this.rowIndex][this.dataFields[col]] = value;
		if (sg.columnFormat.get(col) == cfBoolean){
			var node = $("#"+sg.getFullId()+"_row"+this.rowIndex+"_cell"+col);
			if (value){
				node.html("<div style='position:absolute;top:3;left:3;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
			}else node.html("<div style='position:absolute;top:3;left:3;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
		}else {
			if (sg.columnFormat.get(col) == cfNilai)
				$("#"+sg.getFullId()+"_row"+this.rowIndex+"_cell"+col+"_edit").html(floatToNilai(value) );
			else 
				$("#"+sg.getFullId()+"_row"+this.rowIndex+"_cell"+col+"_edit").html(value);
		}
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
		this.xmlNode = node.cloneNode(true);	
		this.isXML = true;    
		this.childHasCreated = false;
		if (node.firstChild.nodeValue != "-"){
			node = $("#"+this.getFullId() + "_collapse");			
			node.show();
			node = $("#"+this.getFullId() + "_icon");

			if ((node != undefined) && (!this.isExpanded()))
				node.attr ("src", "icon/twg/folder_48.png");
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
		window.control_saiTreeGridNode.prototype.parent.free.call(this);	
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
	/* 
		-- canvas
			-- container (first)
				-- collapseContainer (first)
					-- collapse (first)
				-- caption(next)
				-- frame (next.next)
			-- Form (next)
	*/
	clone: function(node){
		var cloneNode = this.getCanvas().clone(true);
		cloneNode.attr("id",this.getFullId()+"_clone");
		var collapse = cloneNode.children().first().children().first().children().first();
		if (collapse.length != 0){
			collapse.attr("id",this.getFullId()+"_collapseClone");
		}
		var collapse = cloneNode.children().first().next();
		if (collapse.length != 0){
			collapse.attr("id",this.getFullId()+"formClone");
		}
		var rowContainer = cloneNode.children().first().children().first().next();
		rowContainer.width("100%");
		if (rowContainer.length != 0){
			rowContainer.attr("id",this.getFullId()+"_captionClone");
		}
		var cellNode = rowContainer.children().first().clone(true);
		cellNode.width("100%");
		var id = cellNode.attr("id");
		cellNode.attr("id",id+"_clone");
		id = cellNode.children().first().attr("id");
		cellNode.children().first().width("100%");
		cellNode.children().first().attr("id",id+"_clone");
		rowContainer.empty();
		rowContainer.append(cellNode);
		cloneNode.appendTo(node);
	}
});
