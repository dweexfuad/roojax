//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiTreeGrid = function(owner, options){	
    if (owner){
		try{			
		    this.styled = true;
		    this.widthColNo = 0;
		    this.headerHeight = 20;
		    this.height = 200;
			this.width = 500;
			window.control_saiTreeGrid.prototype.parent.constructor.call(this, owner, options);        
	        this.className = "control_saiTreeGrid";
	        this.selectedItem = undefined;
			this.maxExpandLevel = 0;		        
			this.childLength = 300;
	        this.onSelect = new control_eventHandler();
			this.onDblClick = new control_eventHandler();						
			this.tabStop = true;
			this.xmlData = undefined;
			this.year = (new Date()).getFullYear();
			this.month = (new Date()).getMonth() + 1;
			this.day = (new Date()).getDate();
				
			this.readOnly = false;
			this.startNumber = 0;
			this.pasteEnable = false;
			this.colCount = 0;
			this.rowCount = 0;	
            this.rowHeight = 22;	
            this.checkItem = false;	
			this.colCanvas = [];
			this.noCanvas = [];			
			this.mouseClick = false;
			this.mouseX = 0;	
			this.selIndex = 0;
			this.maxRowShow = 0;
			this.maxColShow = 0;
			this.topIndex = 0;
			this.leftIndex = 0;
			this.clientHTML = "";
			this.clientHeight = 0;
			this.disableCtrl = false;
			this.col = 0;
			this.row = 0;			
			this.tabStop = true;
			this.page = 1;
			this.rowPerPage = 20;
			this.columns = new control_arrayMap();
			this.rows = new control_arrayMap();			
			this.onEllipsClick = new control_eventHandler();
			this.onNilaiChange = new control_eventHandler();
			this.titleFromData = false;				
			this.onDblClick = new control_eventHandler();
			this.onClick = new control_eventHandler();
			this.onSelectCell = new control_eventHandler();
			this.onKeyDown = new control_eventHandler();
			this.onKeyPress = new control_eventHandler();
			this.onCellExit = new control_eventHandler();
			this.onCellEnter = new control_eventHandler();
			this.onChange = new control_eventHandler();			
			this.onDeleteRow = new control_eventHandler();
			this.onBeforeClear = new control_eventHandler();
			this.onAppendRow = new control_eventHandler();
			this.onAfterPaste = new eventHandler();
			this.totFixedCol = 0;
			this.title = [];
			this.rowData = new control_arrayMap();
			this.rowNodes = new control_arrayMap();
            this.columnFormat = new arrayMap();
			this.cellValue =  [];
			this.pressKeyDown = false;
			this.rowSelect = false;
			this.fixColor = "#f5f5f5";//"#084972";//"#c4c4a3";		
			this.color = system.getConfig("form.grid.color");
			uses("saiTreeGridNode;column");			
			//------------			
			this.first = false; //eventKeyPress
			this.rightBtn = false;			
			this.btnVisible = true;
			this.allowAutoAppend = true;
			this.addHeader = "";
			this.allowBlank = false;
			this.freezed = false;//da251d
			this.columnAlignment = [];
			this.bottomColumns = new arrayMap();
			//this.levelColor = ["#681C1D","#C6FFE4","#E6FFCF","#FFE5D0","#FFB6B3","#FCBCFF","#B7C0FF","#84D1FF","#64FFB3","#E3FF81"];
			//this.levelColor = ["#7B3C3E","#814445","#864A4B","#8D5254","#915A5B","#976164","#966164","#9D696C","#9D6A6D","#AA7B7C"];
			//this.levelColor = ["#681C1D","#874B4B","#976164","#AA7B7C","#BB9697","#C09FA0","#D3BCBC","#E0D0CF","#E1CECE","##E5D8D9"];
			//this.levelColor = ["#7B3A3D","#85474A","#8F5657","#976364","#A37273","#AC8181","#B89192","#C3A1A2","#CDB1B1","#D8C2C3"];
			//this.levelColor = ["#C5631C","#CC7622","#D5893C","#DC9F5B","#E4B37D","#EDC9A2","#F0D4B3","#F3DFC7","#F7EBDB","#FDF5EF"];
			this.levelColor = ["#dcdcdc","#FDF5EF","#dcdcdc","#FDF5EF","#dcdcdc","#FDF5EF","#dcdcdc","#FDF5EF","#dcdcdc","#FDF5EF"];
			this.levelFontColor = ["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"];
			//this.levelFontColor = ["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#000000","#000000","#000000"];
			this.selectedFontColor = "#ffffff";
			this.selectedColor = "#AE1B1A";
			if (options !== undefined){
				this.updateByOptions(options);
				if (options.headerHeight) this.setHeaderHeight(options.headerHeight);
				if (options.color !== undefined) this.setColor(options.color);
				if (options.childLength !== undefined) this.childLength= options.childLength;	
				if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);	
				if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);
				if (options.styled !== undefined) this.setStyled(options.styled);
				if (options.autoAppend !== undefined) this.setAllowAutoAppend(options.autoAppend);
				if (options.appendRow !== undefined) this.onAppendRow.set(options.appendRow[0],options.appendRow[1]);
				if (options.colCount !== undefined) this.setColCount(options.colCount);
				if (options.colTitle !== undefined) this.setColTitle(options.colTitle);				
				if (options.colFormat !== undefined) this.setColFormat(options.colFormat[0],options.colFormat[1]);				
				if (options.colWidth !== undefined) this.setColWidth(options.colWidth[0],options.colWidth[1]);
				if (options.buttonStyle !== undefined) this.setButtonStyle(options.buttonStyle[0],options.buttonStyle[1]);
				if (options.ellipsClick !== undefined) this.onEllipsClick.set(options.ellipsClick[0],options.ellipsClick[1]);
				if (options.change !== undefined) this.onChange.set(options.change[0],options.change[1]);
				if (options.defaultRow !== undefined) this.clear(options.defaultRow);
				if (options.columnReadOnly !== undefined) this.setColumnReadOnly(options.columnReadOnly[0],options.columnReadOnly[1],options.columnReadOnly[2]);
				if (options.colReadOnly !== undefined) this.setColumnReadOnly(options.colReadOnly[0],options.colReadOnly[1],options.colReadOnly[2]);
				if (options.picklist !== undefined) this.setPickList(options.picklist[0],options.picklist[1]);
				if (options.allowBlank !== undefined) this.setAllowBlank(options.allowBlank); 
				if (options.rowCount !== undefined) this.setRowCount(options.rowCount);
				if (options.selectCell !== undefined) this.onSelectCell.set(options.selectCell[0],options.selectCell[1]);
				if (options.cellExit !== undefined) this.onCellExit.set(options.cellExit[0],options.cellExit[1]);
				if (options.cellEnter !== undefined) this.onCellEnter.set(options.cellEnter[0],options.cellEnter[1]);
				if (options.nilaiChange !== undefined) this.onNilaiChange.set(options.nilaiChange[0],options.nilaiChange[1]);
				if (options.click !== undefined) this.onClick.set(options.click[0],options.click[1]);
				if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);
				if (options.beforeClear !== undefined) this.onBeforeClear.set(options.beforeClear[0], options.beforeClear[1]);
				if (options.deleteRow !== undefined) this.onDeleteRow.set(options.deleteRow[0], options.deleteRow[1]);
				if (options.afterPaste !== undefined) this.onAfterPaste.set(options.afterPaste[0], options.afterPaste[1]);
				if (options.colHide !== undefined) this.setColHide(options.colHide[0],options.colHide[1]);				
				if (options.rowHeight !== undefined) this.setRowHeight(options.rowHeight);
				if (options.rowSelect !== undefined) this.setRowSelect(options.rowSelect);
				if (options.autoPaging) this.setAutoPaging(options.autoPaging);
				if (options.disableCtrl) this.setDisableCtrl(options.disableCtrl);
				if (options.colAlign !== undefined) this.setColAlign(options.colAlign[0],options.colAlign[1]);
				if (options.colHint !== undefined) this.setColHint(options.colHint[0], options.colHint[1]);
				if (options.colColor !== undefined) this.setColColor(options.colColor[0],options.colColor[1]);
				if (options.colMaxLength !== undefined) this.setColMaxLength(options.colMaxLength[0], options.colMaxLength[1]);
				if (options.headerColor !== undefined) this.setHeaderColor(options.headerColor[0],options.headerColor[1]);
				if (options.readOnly !== undefined) this.setReadOnly(options.readOnly);
				if (options.checkItem !== undefined) this.setCheckItem(options.checkItem);
				if (options.rowPerPage !== undefined) this.setRowPerPage(options.rowPerPage);
				if (options.pasteEnable !== undefined) this.setPasteEnable(options.pasteEnable);
				
			}

		}catch(e){
			alert("treeView" + e);
		}
    }
};
window.control_saiTreeGrid.extend(window.control_containerControl);
window.saiTreeGrid = window.control_saiTreeGrid;
window.control_saiTreeGrid.implement({
	doDraw: function(canvas){
	    var n = this.getFullId();
	    canvas.css({ background : "#ffffff", border:"1px solid #ccc" });
	    canvas.css({overflow : "hidden" });	    
	  	var h = this.height - 20; 
		var w = this.width - this.widthColNo;
	   	var  html =  "<div id='" + n + "_frame' style='{position : relative; left: 0; top: 0; width: 100%; height: 100%;overflow: hidden;}' onscroll='$$$("+this.resourceId+").doScrollFrame(event)'>" +                	
						"<div id='"+n+"form' style='{background:#fff;position:relative;left: 0;top: "+this.headerHeight+"; width: "+w+"px; height: "+h+"px; overflow: auto;}' onscroll='$$$("+this.resourceId+").doScroll(event)' >"+
						"</div>"+
						"<div id='"+n+"_header' style='position:absolute;overflow:hidden;left: 0px;top: 0; width:auto; height:"+this.headerHeight+"px;border:1px solid #transparent'"+
							" onmousemove ='$$$("+this.resourceId+").headerMove(event)' "+	
							" onmouseup ='$$$("+this.resourceId+").headerUp(event)' "+	
						"></div>"+
						"<div id='"+n+"_freezeContainer' style='background:#fff;border-right:1px solid #999;position:absolute;left: 0;top: "+this.headerHeight+"; width: "+this.widthColNo+"px; height: "+h+"px; overflow: hidden;' onscroll='$$$("+this.resourceId+").doScroll(event)' >"+
							"<div id='"+n+"_freezeForm' style='position:absolute;left: 0;top:0; width: 100%; height: auto; overflow: hidden;' onscroll='$$$("+this.resourceId+").doScroll(event)' >"+
							"</div>"+
						"</div>"+
						"<div id='"+n+"_freezeHeader' style='position:absolute;border-right:1px solid #007AFF;overflow:hidden;left: 0px;top: 0; width:auto; height:"+this.headerHeight+"px;border:1px solid #transparent'"+
							" onmousemove ='$$$("+this.resourceId+").headerMove(event)' "+	
							" onmouseup ='$$$("+this.resourceId+").headerUp(event)' "+	
						"></div>"+
						"<div id='"+n+"_topleft' style='position:absolute;overflow:hidden;left: 0px;top: 0; width:38px; height:"+this.headerHeight+"px;border:1px solid #transparent;background:#fff'></div>"+
						"<div id='"+n+"_spr' style='position:absolute;left:38px;top:0;width:1px;height:100%;background:#3992e5;display:none'></div>"+
	                "</div>";
	    canvas.bind("mouseover",setEvent("$$$("+this.resourceId+").headerMove(event)"));
		canvas.bind("mouseup",setEvent("$$$("+this.resourceId+").headerUp(event)"));
	    this.setInnerHTML(html, canvas);
	    this.cnvNo = $("#"+ n +"_no");
		this.cnvHeader = $("#"+ n +"_header");
		this.headerCanvas = this.cnvHeader;
		this.frame = $("#"+ n +"form");
		this.cnvHeader.shadow({radius:0});
		this.freezeHeader = $("#"+ n +"_freezeHeader");this.freezeHeader.hide();
		this.freezeForm = $("#"+ n +"_freezeContainer");this.freezeForm.hide();
		this.freezeHeader.shadow({radius:0});
	},	
    getHeaderCanvas : function(){
      return  $("#"+ this.getFullId() +"_header");
    },
	headerMove: function(e){
		if (!e) var e = window.event;
		if (this.resizeCol){	
			var col = $$$(this.columnToResize);
			if (col){
				var w = e.clientX - col.headerCanvas.offset().left - 2;
				col.separator.css({left: w + col.headerCanvas.position().left, background:"#ff9900"});
				var w1 = e.clientX - this.cnvHeader.offset().left - this.frame.scrollLeft();
				$("#"+this.getFullId()+"_spr").css({left: w1 + this.widthColNo });
			}
		}
	},
	headerUp: function(e){
		if (this.resizeCol){
			var col = $$$(this.columnToResize);
			if (col){
				col.separator.css({cursor:"default", background:"transparent"});
				var w = e.clientX - col.headerCanvas.offset().left;
				col.setColWidth(w - 2);
				var w1 = e.clientX - this.cnvHeader.offset().left;
				$("#"+this.getFullId()+"_spr").css({left: w1 + this.widthColNo});
			}
			this.resizeCol = false;
			this.columnToResize = -1;
			$("#"+this.getFullId()+"_spr").css({display:"none"});
		}
	},
	initFreeze: function(){
		if (!this.freezed){
			this.grid.freezeForm.show();
	        this.grid.freezeHeader.show();
	        this.freezed = true;
	        
	    }
	},
	setColCount: function(data){	
		try{
			this.colCount = data;
			for (var i=0;i < data;i++) this.cellValue[i] = []; 
			this.row = 0;						
			$("#"+this.getFullId()+"_header").empty();
			for (var i in this.columns.objList){								
				node = this.columns.get(i);						
				node.free();									
			}				
			this.columns.clear();			
			var col;
			var lft  = 38;
			var wdth = 80;
			for (var i = 0; i < this.colCount; i++)
			{				
				col = new control_column(this,i);
				wdth = 80;					
				col.setWidth(wdth);				
				col.setTitle("Column"+i, i);				
				col.setLeft(lft);
				lft += wdth; 
				this.columns.set(i, col);			
			}
			for (var i = 0; i < this.colCount; i++)
			{
				col = this.columns.get(i);
				col.createSeparator();
			}
			//this.maxRowShow = this.calcMaxRowShow();
		}catch(e){
			error_log("setColCount."+e);
		}
	},
	getColCount: function(){
		return this.colCount;
	},
	setColor: function(data){
	   this.color = data;
	   this.getCanvas().css({ background : data });
    },
    setCellColor: function(col, row, color, fontColor){
    	try{
	    	var node = this.rowNode.get(row);
	    	if (node){
	    		$("#"+node.getFullId()+"_cell"+col).css({background:color, color:fontColor});

	    	}
	    }catch(e){
	    	error_log("setCellColor : "+e);
	    }
    	
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
	
	setColTitle: function(data){
		try{
		    if (typeof data == "string") data = data.split(",");
		    this.colCount = 0;
		    var idx = -1,
		        colIndex = 0;
			console.log(typeof data);
		    if (typeof data == "object")
		      	this.columnWidth = new arrayMap();
		    for (var i=0; i < data.length; i ++){
			    if (typeof data[i] == "object" && data[i].column){
			    	idx = this.setColWidth(idx, data[i]);
			    }else {
			    	this.colCount ++; 
    			   	if (typeof data[i] == "object"){
    			       	idx++;
    			       	this.columnWidth.set(idx, data[i].width);
    			   	}
    		    }
    		    if (data[i] && data[i].align) this.columns.get(i).formatAlign = data[i].align;
    		    this.columns.get(i).internalIndex = colIndex;
    		    //this.bottomColumns.set(i, this.columns.get(i));
    		    colIndex = this.columns.get(i).setTitle(data[i], colIndex);
			    colIndex++;
			    if (data[i].freeze)
    		   		this.columns.get(i).setFreeze(data[i].freeze);
			    
			}
			this.initColIndex = -1;
			for (var i=0; i < data.length; i ++){
	            this.initBottomColumns(data[i]);  
	        }
	        this.title = data;
			
		}catch(e){
			error_log(e +":"+data);
		}
	},
	initBottomColumns: function(title){
		if (title.column){
			for (var i = 0; i < title.column.length;i++){
				this.initBottomColumns(title.column[i]);
			}
		}else {
			this.initColIndex++;
			this.bottomColumns.set(this.initColIndex, title);
		}
	},
	setColWidth: function(col, data){
	    if (typeof this.title == "object"){
	        if (data.column){
	            for (var i = 0 ; i < data.column.length; i++){
                     if (data.column[i].column)
                        col = this.setColWidth(col, data.column[i]);
                     else {
                         col++;
                         this.colCount++;
                         this.columnWidth.set(col, data.column[i].width);
                     }
                 }
	        }
	        return col;
	    }else {		
    	    this.columnWidth = new arrayMap();
    		for (var i in col){
    		      this.columnWidth.set(col[i], data[i]);
    			  //this.columns.get(col[i]).setColWidth(data[i]);
    		}
    	}	
	},
	setColFormat: function(col, data){
	    this.columnFormat = new arrayMap();
		for (var i in col){
		    this.columnFormat.set(col[i], data[i]);
			//this.columns.get(col[i]).setColumnFormat(data[i]);
		}	
	},
	setHeaderHeight: function(height){
		this.headerHeight = height;
		$("#"+this.getFullId()+"_header").height(height);		
		$("#"+this.getFullId()+"_freezeHeader").height(height);		
		$("#"+this.getFullId()+"_topleft").height(height);		
		this.getClientCanvas().css({ 
							top : this.headerHeight,	
							height : this.height - this.headerHeight 
					});
		$("#"+this.getFullId()+"_freezeContainer").css({ 
							top : this.headerHeight,	
							height : this.height - this.headerHeight
					});
	},
	setColumnReadOnly: function(){
	    
	},
	/*rearrange: function(){
		var child,ix = 0;
		for (var i in this.childs.objList)
		{
			child = $$$(this.childs.get(i));
			if(child != undefined){
				ix++;
				child.childIndex = ix;
			}
		}	
	},*/
	rearrange: function(startPos){
		try{
			if (this.columns.getLength() > 0)
			{			
				var obj = this.columns.get(startPos);							
				var left = obj.left;				
				var width = obj.width;		
				var newLeft = left + width;	
				if (obj.separator)
					obj.separator.css({ left: newLeft});
				startPos++;
				for (var i = startPos; i < this.title.length; i++)
				{
					obj = this.columns.get(i);
					if (obj){
						obj.setLeft(newLeft);
						obj.headerCanvas.css({ left: newLeft});
						if (obj.separator)
							obj.separator.css({ left: newLeft + obj.width});
						newLeft += obj.width;
						if (obj.hideColumn) obj.headerCanvas.hide();
					}
					//obj.refreshCells();				
				}

				this.cnvHeader.css({width: newLeft+10});
					
			}		
		}catch(e){
			error_log(this+"$rearrange:"+ startPos +":"+e+":"+i);
		}
	},
	numClick:function(event, row){
		try{
			var node = $("#"+this.getFullId()+"_no"+row+"form");
			if (node.is(":visible")){
				node.hide();
			}else node.show();
			var node = $("#"+this.getFullId()+"_row"+row+"form");
			if (node.is(":visible")){
				node.hide();
			}else node.show();
		}catch(e){
			error_log(e);
		}
	},
	addRowValues: function(values, parentNode){
		
	},
	setCell: function(col, row, value){
		try{
			var node = this.rowNode.get(row);
			if (node){
				node.setCellValue(col, value);
			}		
	  }catch(e){
	    systemAPI.alert(this+"$setCell()",e);
	  }
	},
	getRowCount: function(){
		return this.rowData.length;
	},
	appendRow: function(){
		try{
			var values = [];
			for (var i = 0; i < this.columns.getLength();i++)
				values[i] = "";	
			return this.addRowValues(values);			
		}catch(e){
			alert(e);
		}
	},
	getCell: function(col, row){
		return this.rowData[row][this.fields[col]];
	},
	cells: function(col, row, value){
		if (value !== undefined)
			this.setCell(col, row, value);			
		else {				
			if (this.rowData[row]) return this.rowData[row][this.fields[col]];		

		}		
		return value;
	},
	appendData: function(data,level, currNode){
		var parentNode;
		
		var lastRow = this.getRowCount();
		if (lastRow == 0 || (lastRow > 0 && this.rowValid(lastRow - 1)) ){
			currNode = this.addRowValues(data, parentNode);
			currNode.data("level",level);
		}
		return currNode;
	},	
	clear: function(){
		try{
			if (this.rowNode){
				for (var i in this.rowNode.objList){
					var node = this.rowNode.get(i);
					if (node){
						node.free();
					}
				}
				this.rowNode = new arrayMap();
				this.rowCount = 0;
			}
			for (var i in this.childs.objList){
				if (this.childs.get(i) instanceof control_saiTreeGridNode){
					this.childs.get(i).free();
				}
				
			}
			$("#"+this.getFullId()+"_freezeForm").empty();
		}catch(e){
			error_log(e);



		}
	},
	doSelectItem: function(item){
		try{			
		    var oldSelected = $$$(this.selectedItem);			
		    if (oldSelected instanceof control_saiTreeGridNode)
		        oldSelected.doDeselect();
		    if (item instanceof control_saiTreeGridNode){			
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
		    window.control_saiTreeGrid.prototype.parent.setWidth.call(this, data);

		    var frame = $("#"+this.getFullId() + "_frame");
		    if (frame) frame.css({ width : data - 3 });
		    frame = $("#"+this.getFullId() + "form");
		    if (frame) frame.css({ width : data - this.widthColNo });
		}catch(e){
			alert(e);
		}
	},
	setHeight: function(data){
	    window.control_saiTreeGrid.prototype.parent.setHeight.call(this, data);

	    var frame = $("#"+this.getFullId() + "_frame");
	    if (frame) frame.css({ height : data - 4 });
	    frame = $("#"+this.getFullId() + "form");
	    if (frame) frame.css({ height : data - 20 });
	    frame = $("#"+this.getFullId() + "_freezeContainer");
	    if (frame) frame.css({ height : data - 20 });
	},
	getMaxExpandLevel: function(node){
		var child = undefined;
		if (node instanceof control_saiTreeGrid)
			this.maxExpandLevel = 0;
		for (var i in node.childs.objList)
		{
			child = $$$(node.childs.objList[i]);
			if (child instanceof window.control_saiTreeGridNode)
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
				if (child instanceof window.control_saiTreeGridNode)
				{
					//error_log(child.getFullId());
					//$("#"+child.getFullId()+"_caption").css({background:this.levelColor[child.getLevel()]});
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
	           this.getSelectedItem().eventDblClick();
	       break;
       }
       return false;
	},
	setData: function(treeData, fields, id){	
		try{
			var node = "";
			this.fields = fields;
			this.rowData = treeData.rs.rows;
			this.rowNode = new arrayList();
			var freezeCanvas = $("#"+this.getFullId()+"_freezeForm");
			var colIndexFreeze = -1;
			for (var i=0; i < this.columns.getLength();i++){
				if (this.columns.get(i).freeze) colIndexFreeze = i;
			}
			var first = true;
			var startLevel = 0;
			for (var i = 0; i < treeData.rs.rows.length; i++ ){
				line = treeData.rs.rows[i];
				if (line.level_spasi === undefined) line.level_spasi = 0;
				if (first){
					startLevel = parseFloat(line.level_spasi);
					first = false;
				}
				line.level_spasi = parseFloat(line.level_spasi) - startLevel;
				if (line.nama == undefined) line.nama = line[fields[1]];
				if (node == ""){
					node = new saiTreeGridNode(this);
				}else if (node.getLevel() == line.level_spasi - 1){
					node = new saiTreeGridNode(node);
				}else if (node.getLevel() == line.level_spasi ){
					node = new saiTreeGridNode(node.owner);
				}else if (node.getLevel() > line.level_spasi){
					while (node.owner instanceof saiTreeGridNode && node.getLevel() > line.level_spasi){
						node = node.owner;
					}
					node = new saiTreeGridNode(node.owner);
				}
				node.setCaption(line.nama);
				node.setData(line, fields, i, line[id]);
				this.rowNode.add(node);
				if (colIndexFreeze != -1){
					if (node.owner == this){
						node.clone(freezeCanvas);
					}else {
						var ownerClone = $("#"+node.owner.getFullId()+"formClone");
						$("#"+node.owner.getFullId()+"_collapseClone").show();
						node.clone(ownerClone);	
					}
				}
			}
			this.rowCount = treeData.rs.rows.length;
			
			
			//this.updateCanvas(this);
		}catch(e){
			alert(e);
		}
	},
	getRowData : function(row){
		return this.rowNode.get(row).data;
	},
	setReadOnly: function(data){
		try{
			for (var i = 0; i < this.title.length; i++)
			{
				obj = this.columns.get(i);		
				obj.setReadOnly(data);
				obj.refreshCells();
			}	
			this.readOnly = data;
		}catch(e){
			systemAPI.alert(this+"$setReadOnly()",e);
		}
	},
	setRowPerPage: function(data){
		this.rowPerPage = data;
	},
	allRowValid: function(){
		var valid = true;
		for (var r = 0 ;r < this.rowData.length;r++){
			for (var i = 0;i < this.columns.getLength();i++)
				valid = valid && (this.cells(i,r) != "" || typeof this.cells(i,r) == "number");
			if (!valid) break;
		}
		return valid;		
	},
	isEmpty: function(){
		var valid = true;
		for (var r = 0 ;r < this.getRowCount();r++){
			for (var i = 0;i < this.columns.getLength();i++)
				valid = valid && trim(this.cells(i,r)) == "";
			if (!valid) break;
		}
		return valid;		
	},
	getRowValidCount: function(){
		var valid = true, c = 0;
		for (var r = 0 ;r < this.rowData.length;r++){
			for (var i = 0;i < this.columns.getLength();i++)
				valid = valid && ( this.cells(i,r) != "" || typeof this.cells(i,r) == "number");
			if (valid) c++;			
		}
		return c;		
	},
	rowValid: function(row){
		var valid = true;
		for (var i = 0;i < this.columns.getLength();i++){					
			valid = valid && ( this.cells(i,row) != "" || typeof this.cells(i,row) == "number");			
		}
		//if (this.inplaceEdit.style.display == "" && this.inplaceEdit.value != "") valid = valid && true;
		return valid;
	},
	doSizeChange: function(width, height){	
		if (this.frame){
			$("#"+ this.getFullId() +"_no").css({
						top: this.headerHeight,
						height : height - this.headerHeight - 20 });
			this.getClientCanvas().css({ 
							top : this.headerHeight,	
							width : width, 
							height : height - this.headerHeight - 20 
					});
			/*this.navigatorCanvas.css({ 	
							width : width - this.widthColNo, 
							top : height - 20 
					});*/
		}
	},	
	doScroll: function(event){
		try{
			var n = this.getFullId();			    		   
			this.cnvHeader.css({left : -this.frame.scrollLeft() + this.widthColNo  });
			$("#"+this.getFullId()+"_freezeForm").css({top: -this.frame.scrollTop() });
			if (this.selIndex >= 0){
				var date = $(n + "_date");
				if (date != null){
					var app = this.getApplication();
					if (app.systemDatePickerForm != undefined)
						app.systemDatePickerForm.hide();
				}
			}
			if (this.btnEllips) this.btnEllips.hide();
			if (this.btnDropDown) this.btnDropDown.hide();
			if (this.btnDate) this.btnDate.hide();
			this.doDefocus();
		}
		catch (e){
		    error_log(this+"$doScroll()"+ e);
		}
	},
	doScrollFrame: function(target){
		try{		
			var n = this.getFullId();					    
		    this.cnvHeader.css({ left : -this.frame.scrollLeft() + this.widthColNo });
		    $("#"+this.getFullId()+"_freezeForm").css({top: -this.frame.scrollTop()});
			
			//$("#"+ n + "_no").css({ top : - this.frame.scrollTop() });
			this.exitInplace();
		}catch (e){
		   error_log(this+"$doScroll()"+e);
		}
	},
	setRowSelect: function(data){
		this.rowSelect = data;
	}
});
