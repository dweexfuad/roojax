//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_column = function(owner, index){
	if (owner){

		this.width = 80;		
		this.title = "column";
		this.internalIndex = index;
		this.sortEnabled = false;		
		this.formatAlign = alLeft;
		this.hideColumn = false;
		window.control_column.prototype.parent.constructor.call(this, owner);	
		
		this.className = "control_column";
		this.headerColor = "#f5f5f5";
		this.headerColorOver = "#0099cc";
		this.owner = owner;	
		this.mouseClick = false;
		this.readOnly = false;				
		this.EditedValue = "";
		this.buttonStyle = bsNone;
		this.pickList = new control_arrayMap();
		this.selCellIdx = 0;	//selected row 
		this.selectedId = 0;	//selected row in picklist
		this.Focused = false;
		this.fixedCol = false;
		this.columnFormat = cfText;
		this.maxLength = 0;
		
		var dt = new Date();
		this.day = dt.getDate();
        this.month = dt.getMonth() + 1;
        this.year = dt.getFullYear();
		this.oldWidth = this.width;
		this.color = system.getConfig("app.color.gridText");
		this.diffX = 0;
		this.sortOrder = "asc";				
		this.param1 = "";
		this.param2 = "";
		this.param3 = "";
		this.param4 = "";
		this.autoSubmit = true;
		
	}
};
window.control_column.extend(window.control_control);
window.column = window.control_column;
window.control_column.implement({
	doDraw: function(canvas){
		try{
			var n = this.getFullId();
			var left = this.internalIndex * this.width;
			var headerCanvas = $("#"+this.owner.getFullId()+"_header");		
			canvas.css({height:this.owner.headerHeight, top:0 });
			if (this.headerCanvas != undefined)
				this.headerCanvas.remove();
			//background-image:url(icon/gradient.png);
			var node = $("<div id='"+n+"_colHead' style='position:absolute;height:100%;top:0;left:"+left+";width:"+this.width+";border-right:1px solid transparent;background:#f5f5f5;'></div>");									
			if (this.hideColumn) node.hide();
			var html =  "<div id='"+ n +"_sort' style='position:absolute;top:2px;left:2px;display:none;width:11;height:10'></div>"+
						"<div id='"+ n +"_column' style='overflow:hidden;text-align:center;position:absolute; top: 3px; height : 100%; width:100%;color:"+system.getConfig("font.grid.fontColor")+";white-space:nowarp' "+						
						">"+this.title+"</div>";
			node.hover(function(){$(this).css({color:"#0099cc"});},function(){$(this).css({color:"#000"});});		
			
			
			this.setInnerHTML(html, node);
			this.headerCanvas = node;
			headerCanvas.append(node);
			headerCanvas.fixBoxModel();
			node.fixBoxModel();
			
			this.setSortEnabled(this.sortEnabled);				
		}catch(e){
			alert(e);
		}
	},
	createSeparator: function(){
		try{
			var n = this.getFullId();
				
			var headerCanvas = $("#"+this.owner.getFullId()+"_header");		
				
			var separator = $("<div id='"+n+"_colspr' style='cursor:pointer;position:absolute;background:url(icon/separator.png);height:100%;top:0;left:"+(this.left + this.width)+";width:1;' "+
								" onmousedown ='$$$("+this.resourceId+").eSeparatorDown(event); ' "+	
								" onmouseup ='$$$("+this.resourceId+").eSeparatorUp(event); ' "+	
								"></div>");									
			headerCanvas.append(separator);	
			separator.fixBoxModel();
			this.separator = separator;			
		}catch(e){
			error_log(e);
		}			
			
	},
	eSeparatorUp: function(e){
		try{
			var left = e.clientX - this.owner.cnvHeader.offset().left;
			this.separator.css({cursor:"default"});
			this.setColWidth(left - this.headerCanvas.position().left - 2);
			this.owner.resizeCol = false;
			this.owner.columnToResize = -1;
			$("#"+this.getFullId()+"_colspr").css({cursor:"default"});
		}catch(e){
			error_log(e);
		}
	},
	eSeparatorDown: function(e){
		this.owner.resizeCol = true;
		this.owner.columnToResize = this.internalIndex;
		$("#"+this.getFullId()+"_colspr").css({cursor:"col-resize"});
	},
	setHeaderColor : function(color){
		this.headerCanvas.css({backgroundColor : color });
		this.headerColor = color;
	},
	setFontColor : function(color){		
		$("$"+this.getFullId()+"_column").css({ color : color });
	},
	setTitle: function(data){
	    this.title = data;
		$("#"+this.getFullId()+"_column").html( this.title );
	},
	getTitle: function(){
		return this.title;
	},
	setIndex: function(index){
		this.internalIndex = index;
	},
	getIndex: function(){
		return this.internalIndex;
	},
	setPicklist: function(items){
		this.pickList = items;
	},
	getPicklist: function(){
		return this.pickList;
	},
	refreshCells: function(){
		try{	
			var width = 0;
			for (var i = 0;i < this.owner.columns.getLength();i++)
			{
				var col = this.owner.columns.get(i);
				width += col.getWidth();
			}

			for (var i = 0; i < this.owner.getRowCount();i++){				
				for (var c=this.internalIndex; c < this.owner.getColCount(); c++){
					var colObj = this.owner.columns.get(c);
					var node = $("#"+this.owner.getFullId()+"_row"+i+"_cell"+c);
					node.css({left:colObj.left, width:colObj.width});
				}
				$("#"+this.owner.getFullId()+"_row"+i).css({width:width});
			}

		}catch(e){
			systemAPI.alert(this+"$refreshCell()",e);
		}
	},
	setButtonStyle: function(data){
		this.buttonStyle = data;
		if (this.buttonStyle == bsDate)
			this.columnFormat = cfDate;
	},
	setColumnFormat: function(data){
		this.columnFormat = data;
		if (this.columnFormat == cfDate)
			this.buttonStyle = cfDate;
		this.refreshCells();
	},
	setColumnAlign: function(data){
		this.formatAlign = data;		
		this.refreshCells();
	},
	setFixedCol: function(data){
		this.fixedCol = data;
		this.readOnly = data;		
	},
	setColWidth: function(newWidth){
		try{
			this.setWidth(newWidth);			
			this.headerCanvas.css({ width : newWidth - 2, 
									left : this.left });
			if (this.separator) this.separator.css({ left : newWidth + this.left+1 });
			this.owner.rearrange(this.internalIndex);
			this.refreshCells();
			//this.setSortEnabled(this.sortEnabled);
		}catch(e){
			systemAPI.alert(this+"$setColWidth()",e);
		}
	},
	setReadOnly: function(data){
		this.readOnly = data;		
	},
	setColor: function(data){
		this.color = data;
		var row = undefined;
		var input = undefined;
		for (var i in this.owner.rows.objList){		
			row = this.owner.rows.get(i);
			input = $("#"+row.getFullId()+"cell"+this.internalIndex+"_input");
			if (input != undefined)
				input.css({background : this.color });
		}
	},
	getColor: function(){
		return this.color;
	},
	setSortEnabled: function(data){
		try{
			this.sortEnabled = data;
			var sortCnv = $("#"+this.getFullId()+"_sort");
			if (this.sortEnabled && sortCnv != undefined)
			{						
				sortCnv.show();
				sortCnv.css({left : this.width - 13 });
			}else  if (sortCnv != undefined) sortCnv.hide();
		}catch(e){
			systemAPI.alert(this+"$setSortEnabled()",e);
		}
	},
	sortValue: function(r1, r2){
		try{
			var x = r1; var y = r2;
			var result = ((x < y) ? -1 : ((x > y) ? 1 : 0));				
			return result;
		}catch(e){
			systemAPI.alert(this+"$sortValue()",e);
		}
	},
	sort: function(){
		try{
			var data = new Array();
			var obj = this.owner.rows.objList;
			var row1 = undefined;
			var row2 = undefined;
			var tmp = new Array();
			this.owner.showLoading();
				
			for (var i = 0; i < (obj.length - 1); i++){
				for (var j = i; j < obj.length;j++){
					row1 = this.owner.rows.get(i);
					row2 = this.owner.rows.get(j);				
					if (this.sortOrder == "asc"){
						if (row1.getCellValue(this.internalIndex).toLowerCase() > row2.getCellValue(this.internalIndex).toLowerCase())
						{					
							for (var k = 0; k < this.owner.columns.getLength();k++)								
								tmp[k] = row1.getCellValue(k);
							for (var k = 0; k < this.owner.columns.getLength();k++)				
								row1.setCellValue(k,row2.getCellValue(k));
							for (var k = 0; k < this.owner.columns.getLength();k++)				
								row2.setCellValue(k,tmp[k]);
							
						}
					}else if (row1.getCellValue(this.internalIndex).toLowerCase() < row2.getCellValue(this.internalIndex).toLowerCase()){					
							for (var k = 0; k < this.owner.columns.getLength();k++)								
								tmp[k] = row1.getCellValue(k);
							for (var k = 0; k < this.owner.columns.getLength();k++)				
								row1.setCellValue(k,row2.getCellValue(k));
							for (var k = 0; k < this.owner.columns.getLength();k++)				
								row2.setCellValue(k,tmp[k]);
						} 
				}
			}
			this.owner.hideLoading();
			var cnv = $("#"+this.getFullId()+"_sort");				
			if (this.sortOrder == "asc"){
				this.sortOrder = "desc";
				if (cnv != undefined)
					cnv.css({ background : "url(image/themes/"+system.getThemes()+"/up.png) no-repeat" });
			}else {
				this.sortOrder = "asc";
				if (cnv != undefined)
					cnv.css({ background : "url(image/themes/"+system.getThemes()+"/down.png) no-repeat" });
			}
				
		}catch(e)	{
			systemAPI.alert(this+"$sort:",e);
		}
	},
	bubbleSort: function(){
	},
	hide: function(){
		try{
			this.hideColumn = true;
			this.oldWidth = this.width;				
			this.setColWidth(0);		
			this.owner.rearrange(0);
			$("#"+this.getFullId()+"_colHead").hide();				
			var row, cnv;
			for (var i in this.owner.rows.objList){		
				row = this.owner.rows.get(i);
				cnv = $("#"+row.getFullId()+"_cell"+(this.internalIndex+1));
				if (cnv != undefined)
					cnv.hide();
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	show: function(){
		this.hideColumn = false;
		this.setColWidth(this.oldWidth);
		this.owner.rearrange(0);
		$("#"+this.getFullId()+"_colHead").show();			
		var row, cnv;
		for (var i in this.owner.rows.objList){			
			row = this.owner.rows.get(i);
			cnv = $("#"+row.getFullId()+"_cell"+(this.internalIndex+1));
			if (cnv != undefined)
				cnv.show();
		}
	},
	setParam1: function(data){
		this.param1 = data;
	},
	setParam2: function(data){
		this.param2 = data;
	},
	setParam3: function(data){
		this.param3 = data;
	},
	setParam4: function(data){
		this.param4 = data;
	},
	setAutoSubmit: function(data){
		this.autoSubmit = data;
	},
	setMaxLength: function(data){		
		this.maxLength = data;
	},
	setLeft: function(data){
		window.control_column.prototype.parent.setLeft.call(this, data);
		this.headerCanvas.css({left : data });
		if (this.separator)
			this.separator.css({ left : this.width + data});
		
	}
	
});
