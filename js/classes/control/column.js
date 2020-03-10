//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_column = function(owner, index ,freeze){
	if (owner){

		this.width = 80;		
		this.title = "column";
		this.columnIndex = index;
		if (owner instanceof column)
			this.internalIndex = owner.internalIndex + index + 1;
		else 
			this.internalIndex = index;
		this.sortEnabled = false;		
		this.formatAlign = alLeft;
		this.hideColumn = false;
		this.freeze = false;
		window.control_column.prototype.parent.constructor.call(this, owner);	
		
		this.className = "control_column";
		this.headerColor = "#0099CC";
		this.headerColorOver = "#999999";
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
		this.columns = new control_arrayMap();
		
		
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
		this.onClick = new eventHandler();
		this.onMouseDown = new eventHandler();
		this.grid = this.getGrid();
	}
};
window.control_column.extend(window.control_containerControl);
window.column = window.control_column;
window.control_column.implement({
	doDraw: function(canvas){
		try{
			var n = this.getFullId();
			var left = this.internalIndex * this.width;
			var headerCanvas = $("#"+this.owner.getFullId()+"_header");		
			canvas.css({height: "100%", top:0 });
			if (this.headerCanvas != undefined)
				this.headerCanvas.remove();
			//background-image:url(icon/gradient.png);
			if (this.owner instanceof column && this.columnIndex == 0)
				var node = $("<div id='"+n+"_colHead' style='position:absolute;height:100%;top:0;left:"+left+";width:100%;background:#efefef;color:#007AFF;'></div>");									
			else 
				var node = $("<div id='"+n+"_colHead' style='position:absolute;height:100%;top:0;left:"+left+";width:100%;background:#efefef;color:#007AFF;'></div>");									
			if (this.hideColumn) node.hide();
			var html =  "<div id='"+ n +"_sort' style='position:absolute;top:2px;left:2px;display:none;width:11;height:10'></div>"+
						"<div id='"+ n +"_column' style='overflow:hidden;text-align:center;position:absolute; top: 0px; height :100%; width:100%;color:#ffffff;' "+						
						">"+this.title+"</div>"+
                        "<div id='"+ n +"_header' style='position:absolute;top:"+this.owner.headerHeight+"px;left:0px;width:100%;height:100%;overflow:hidden;background:#ff0'>"+
                        "</div>"+
                        "<div id='"+ n +"_borderBottom' style='top:100%;height:1px;width:100%;background:#007AFF'></div>"+
                        "<div id='"+ n +"_borderLeft' style='left:0;height:100%;width:1px;background:#007AFF'></div>";
			
            //node.hover(function(){$(this).css({color:"#0099cc"});},function(){$(this).css({color:"#000"});});		
			node.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClick(event);") );
			node.bind("mousedown",setEvent("$$$(" + this.resourceId + ").eventMouseDown(event);"));
			node.html(html);
			this.setInnerHTML(html, node);
            this.borderBottom = $("#"+ n + "_borderBottom" );
			this.headerCanvas = node;
			headerCanvas.append(node);
			headerCanvas.fixBoxModel();
			node.fixBoxModel();

			this.setSortEnabled(this.sortEnabled);				
			
		}catch(e){
			alert(e);
		}
	},
	eventMouseClick: function(event){
		this.onClick.call(this, this.internalIndex);
	},
	eventMouseDown: function(event){
		this.onMouseDown.call(this, this.internalIndex, event);
	},
	createSeparator: function(){
		try{
			var n = this.getFullId();
			var left = this.left + this.width - 5;
			var headerCanvas = $("#"+this.owner.getFullId()+"_header");		
				
			var separator = $("<div id='"+n+"_colspr' style='cursor:pointer;position:absolute;height:100%;top:0;left:"+left+"px;width:5;'></div>");		

			separator.bind("mouseover",setEvent("$$$(" + this.resourceId + ").eSeparatorOver(event);"));
			separator.bind("mouseout",setEvent("$$$(" + this.resourceId + ").eSeparatorOut(event);"));
			separator.bind("mouseup",setEvent("$$$(" + this.resourceId + ").eSeparatorUp(event);") );
			separator.bind("mousedown",setEvent("$$$(" + this.resourceId + ").eSeparatorDown(event);"));

			headerCanvas.append(separator);	

			separator.fixBoxModel();
			this.separator = separator;			
		}catch(e){
			error_log(e);
		}			
			
	},
	eSeparatorOver: function(e){
		this.separator.css({"background":"#ff9900" });
	},
	eSeparatorOut: function(e){
		this.separator.css({"background":"transparent" });
	},

	eSeparatorUp: function(e){
		try{
			//var left = e.clientX - this.owner.cnvHeader.offset().left;
			//this.separator.css({cursor:"default","z-index":0,"background":"transparent"});
			//this.setColWidth(left - this.headerCanvas.position().left - 2);
			//var grid = this.grid;
			//grid.resizeCol = false;
			//grid.columnToResize = -1;
			//$("#"+this.getFullId()+"_colspr").css({cursor:"default"});
		}catch(e){
			error_log(e);
		}
	},
	eSeparatorDown: function(e){
		var grid = this.grid;
		grid.resizeCol = true;
		grid.columnToResize = this.resourceId;
		$("#"+this.getFullId()+"_colspr").css({cursor:"col-resize"});
		this.separator.css({"z-index":1000});

		var w1 = e.clientX - grid.cnvHeader.offset().left - grid.frame.scrollLeft();
		$("#"+grid.getFullId()+"_spr").css({display:"", left: w1 + grid.widthColNo});
	},
	setHeaderColor : function(color){
		this.headerCanvas.css({backgroundColor : color });
		this.headerColor = color;
		for (var i=0;i <= this.columns.getLength()-1; i++){
			var col = this.columns.get(i);
			col.setHeaderColor(color);
		}
					
	},
	setFontColor : function(color){		
		$("$"+this.getFullId()+"_column").css({ color : color });
		for (var i=0;i <= this.columns.getLength()-1; i++){
			var col = this.columns.get(i);
			col.setFontColor(color);
		}
	},
	setTitle: function(data, colIndex){
        //borderTop:"1px solid #ff9900",borderBottom:"1px solid #ff9900",
	    if (typeof (data) == "string"){
		  this.title = data;
		  $("#"+this.getFullId()+"_column").html("<table height='100%' width='100%' border=0 style='font-size:12;color:#007AFF'><tr><td valign='middle' align='center'> "+this.title+"</td></tr></table>" );
		}else {
			this.title = data.title;
			this.fontColor = data.fontColor;
		    $("#"+this.getFullId()+"_header").css({ top : this.owner.headerHeight +"px"});
			$("#"+this.getFullId()+"_column").css({height:this.owner.headerHeight +"px"});
			if (data.fontColor){
				this.fontColor = data.fontColor;
				$("#"+this.getFullId()+"_column").html("<table height='100%' width='100%' border=0 style='font-size:12;color:"+ data.fontColor +"'><tr><td valign='middle' align='center'> "+this.title+"</td></tr></table>" );
				$("#"+this.getFullId()+"_borderBottom").css({background: data.fontColor});
				$("#"+this.getFullId()+"_borderLeft").css({background: data.fontColor});
			}else {
				$("#"+this.getFullId()+"_column").html("<table height='100%' width='100%' border=0 style='font-size:12;color:#007AFF'><tr><td valign='middle' align='center'> "+this.title+"</td></tr></table>" );
			}
		    
           	
           	/*if (data.freeze){
           		if (this.owner instanceof saiTreeGrid || this.owner instanceof saiGrid){
           			this.grid.initFreezed();
           		}
           	}*/
			if (data.align) this.formatAlign = data.align;
		    this.setColWidth(data.width);
		    this.headerHeight = this.owner.headerHeight;
		    if (data.click){
		    	this.onClick.set(data.click[0],data.click[1]);
		    	$("#"+this.getFullId()+"_column").css({cursor:"pointer"});
		    }
		    if (data.mousedown){
		    	this.onMouseDown.set(data.mousedown[0],data.mousedown[1]);
		    }
		    if (data.hint){
		    	//$("#"+this.getFullId()+"_column").mouseEnter();
		    }
		    var col,
		        lft  = 0,
		        wdth = 0;
            if (data.column){
                try{
                	if (data.columnAlign){
                        //borderTop:"1px solid #007AFF",borderBottom:"1px solid #ff9900"
                		var h = this.owner.headerHeight - 20;
                		$("#"+this.getFullId()+"_header").css({top:h+"px"});
	                    $("#"+this.getFullId()+"_column").css({height:h+"px"});
	                    this.headerHeight = 20;
                	}else{
                        //borderTop:"1px solid #007AFF",borderBottom:"1px solid #ff9900",
	                    $("#"+this.getFullId()+"_header").css({ top:"20px"});
	                    $("#"+this.getFullId()+"_column").css({height:"20px"});
	                    this.headerHeight = this.owner.headerHeight - 20;
	                }
                    if (colIndex === undefined ) colIndex = 0;
                    for (var i = 0; i < data.column.length; i++)
                    {               
                        col = new control_column(this,i);
                        wdth = data.column[i].width;
                        col.setColWidth(wdth);
                        col.internalIndex = colIndex;
                        colIndex = col.setTitle(data.column[i], colIndex);
                        col.setColumnFormat(data.column[i].format);
                        col.setLeft(lft);
                        lft += wdth; 
                        this.columns.set(i, col); 
                        colIndex++;
                    }
                    colIndex--;
                    for (var i = 0; i < data.column.length; i++)
                    {
                        col = this.columns.get(i);
                        col.createSeparator();
                    }
                }catch(e){
                    error_log(e);
                }
            }
		}
		return colIndex;
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
	rowRearrange: function(nodeItem, width){
		try{
			for (var i in nodeItem.childs.objList)	
			{				
				var left = this.headerCanvas.offset().left - this.grid.headerCanvas.offset().left - 38;
				var childNode= $$$(i);
				for (var c=this.internalIndex; c < this.grid.columnWidth.getLength(); c++){
					var cellNode = childNode.cellNode[c];
					if (cellNode){
						var w = this.grid.columnWidth.get(c);
						cellNode.css({left: left, width:w});
						var cellNodeEdit = cellNode.children();
						if (cellNodeEdit)
							cellNodeEdit.css({width:w - 6});
					}
					left += w;
				}
				childNode.getCanvas().css({width : width + 38});
				this.rowRearrange(childNode, width);
			}
		}catch(e){
			alert("row Arrange "+ e);
		}
	},
	refreshCells: function(freeze){
		try{	
			var width = 0;
			var grid = this.grid;
			if (grid instanceof saiTreeGrid){
				for (var i = 0;i < grid.getColCount();i++)
				{
					width += grid.columnWidth.get(i);
				}
			}else{
				for (var i = 0;i < grid.columnWidth.getLength();i++)
				{
					width += grid.columnWidth.get(i);
				}
			}
            var left = this.headerCanvas.offset().left - grid.headerCanvas.offset().left ;
            if (grid instanceof saiTreeGrid){
                
            	for (var i in grid.childs.objList)	
				{				

					var left = this.headerCanvas.offset().left - grid.headerCanvas.offset().left - 38;
					var nodeItem = $$$(i);
					if (nodeItem instanceof saiTreeGridNode){
						nodeItem.getCanvas().css({width : width + 38});
						for (var c=this.internalIndex; c < grid.columnWidth.getLength(); c++){
							var cellNode = nodeItem.cellNode[c];
							if (cellNode){
								var w = grid.columnWidth.get(c);
								cellNode.css({left: left, width:w});
								var cellNodeEdit = cellNode.children();
								if (cellNodeEdit)
									cellNodeEdit.css({width:w - 6});
							}
							left += w;
						}
						this.rowRearrange(nodeItem, width);
					}
				}
            	/*for (var i = 0; i < grid.getRowCount();i++){	
					var left = this.headerCanvas.offset().left - grid.headerCanvas.offset().left - 38;
					for (var c=this.internalIndex; c < grid.columnWidth.getLength(); c++){
						var node = $("#"+ grid.getFullId()+"_row"+i+"_cell"+c);
						var w = grid.columnWidth.get(c);
						node.css({left: left, width:w});
						node = $("#"+ grid.getFullId()+"_row"+i+"_cell"+c+"_edit");
						if (node)
							node.css({width:w - 6});
						left += w;
					}
					grid.rowNode.get(i).getCanvas().css({width : width + 38});
				}*/
            }else {
				// console.log("Column :"+this.internalIndex +":"+grid.columnWidth.getLength()+":"+ (width) );
				// console.log("Col Width " + grid.columnWidth.getArray());
				for (var i = 0; i < grid.getRowCount();i++){	
					var left = this.headerCanvas.offset().left - grid.headerCanvas.offset().left ;
					for (var c=this.internalIndex; c < grid.columnWidth.getLength(); c++){
						var node = $("#"+ grid.getFullId()+"_row"+i+"_cell"+c);
						var w = grid.columnWidth.get(c);
						node.css({left: left, width:w});
						node = $("#"+ grid.getFullId()+"_row"+i+"_cell"+c+"_edit");
						if (node)
							node.css({width:w - 6});
						left += w;
					}
					$("#"+grid.getFullId()+"_row"+i).css({width:width });
				}
			}
		}catch(e){
			///alert("rearrange " + e +" : "+grid);
			error_log("$refreshCell()"+e);
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
		//this.refreshCells();
	},
	setColumnAlign: function(data){
		this.formatAlign = data;		
		this.refreshCells();
	},
	setFixedCol: function(data){
		this.fixedCol = data;
		this.readOnly = data;		
	},
	setColWidth: function(newWidth, headerResize){
		try{
			if (headerResize == undefined) headerResize = false;
			this.setWidth(newWidth);			
			var grid = this.grid;
			this.width = newWidth;
			var owner = this.owner;
			var w = 0;
			if (grid.resizeCol && owner instanceof column){
				var w = 0;
				for (var i=0;i < this.owner.columns.getLength(); i++){
					w += this.owner.columns.get(i).width;
				}
				owner.setColWidth(w, true);
			}

			
			this.headerCanvas.css({ width : newWidth,  left : this.left });
			if (this.separator) this.separator.css({ left : newWidth + this.left - 5});

			if (this.columns.getLength() > 0){
				if (!headerResize){
					var w = newWidth;
					for (var i=0;i < this.columns.getLength()-1; i++){
						w -= this.columns.get(i).width;//grid.columnWidth.get(this.columns.internalIndex);
					}
					this.columns.get(this.columns.getLength()-1).setColWidth(w);
				}
			}else if (!headerResize){
				if (grid instanceof saiTreeGrid)
					grid.columnWidth.set(this.internalIndex, newWidth);
				else 
				 	grid.columnWidth.set(this.internalIndex, newWidth);
				//error_log(this.title +":"+this.internalIndex+":"+newWidth);
				this.refreshCells();
			}
			this.owner.rearrange(this.columnIndex);
			if (this.freeze){
				this.setFreeze(true);
			}
		}catch(e){
			error_log(this+"$setColWidth()"+e);
		}
	},
	rearrange: function(startPos){
	    try{
            if (this.columns.getLength() > 0)
            {           
                var obj = this.columns.get(startPos);   
                if (obj){                        
                    var left = obj.left;                
                    var width = obj.width;      
                    var newLeft = left + width; 
                    if (obj.separator)
                        obj.separator.css({ left: newLeft - 5 });
                }
                startPos++;
                for (var i = startPos; i < this.columns.getLength(); i++)
                {
                    obj = this.columns.get(i);
                    if (obj){
                        obj.setLeft(newLeft);
                        width = obj.width;  
                        obj.headerCanvas.css({ left: newLeft});
                        if (obj.separator)
                            obj.separator.css({ left: newLeft + width - 5});
                        newLeft += width;
                        if (obj.hideColumn) obj.headerCanvas.hide();
                        //obj.refreshCells();
                    }             
                }

                //this.cnvHeader.css({width: newLeft+2});
                    
            }       
        }catch(e){
            error_log(this+"$rearrange:"+ e);
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
			this.separator.css({ left : this.width + data - 5});
		
	},
	getGrid: function(){
	    if (this.owner instanceof saiGrid)
	       return this.owner;
	    else if (this.owner instanceof saiTreeGrid)
	       return this.owner;
	    else{
	        var owner = this.owner;  
	        while (owner instanceof column){
	           owner = owner.owner;
	        }
	        return owner;
	        
	    }
	}
	,
	setFreeze: function(data){
		try{
			this.freeze = data;

			if (data){
				var node = this;
				while (node.owner instanceof control_column){
					 node = node.owner;
				}
				$("#"+node.owner.getFullId()+"_freezeHeader").empty();
				for (var i = 0; i < this.grid.columns.getLength();i++){
					if (this.grid.columns.get(i).freeze) {
						var cloneNode = this.grid.columns.get(i).headerCanvas.clone();
						cloneNode.appendTo("#"+node.owner.getFullId()+"_freezeHeader");
						cloneNode.css({borderRight:"1px solid #007AFF"});
					}
				}
				$("#"+node.owner.getFullId()+"_freezeHeader").show();
				$("#"+node.owner.getFullId()+"_freezeContainer").show();
				//freeze header
				var w = 0;
				for (var i = 0; i < this.grid.columns.getLength();i++){
					if (this.grid.columns.get(i).freeze) w += this.grid.columns.get(i).headerCanvas.width();
				}
				//w = node.headerCanvas.width();
				if (node.owner instanceof saiGrid){
					$("#"+node.owner.getFullId()+"_freezeHeader").width(w );
					//w = $("#"+node.owner.getFullId()+"_freezeContainer").width();
					$("#"+node.owner.getFullId()+"_freezeContainer").width(w);
				}else{
					$("#"+node.owner.getFullId()+"_freezeHeader").width(w + 38);
					//w = $("#"+node.owner.getFullId()+"_freezeContainer").width();
					$("#"+node.owner.getFullId()+"_freezeContainer").width(w  + 38);
				}
				
				
			}
		}catch(e){
			error_log(e);
		}
	}
	
});
