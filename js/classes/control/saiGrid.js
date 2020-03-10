//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
if (window.cfHurufKecil == undefined) window.cfHuruKecil = 8;
if (window.cfLowerCase == undefined) window.cfLowerCase = 8;
if (window.cfUpperCase == undefined) window.cfUpperCase = 4;
if (window.bsEdit == undefined) window.bsEdit = 8;

window.control_saiGrid = function(owner, options){
	if (owner){
		try{
			this.height = 200;
			this.widthColNo = 25;
			this.width = 500;
			this.headerHeight = 20;
			window.control_saiGrid.prototype.parent.constructor.call(this, owner);	
			this.className = "control_saiGrid";
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
			this.rowPerPage = 100;
			this.autoPaging = false;
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
			this.onPager = new eventHandler();
			this.onKeyUp = new eventHandler();
			this.onKeyDown = new eventHandler();
			this.onKeyPress = new eventHandler();
			this.totFixedCol = 0;
			this.title = [];
			this.bottomColumns = new arrayMap();
			this.rowData = new control_arrayMap();
			this.rowsID = new control_arrayMap();
			this.cellValue =  [];
			this.pressKeyDown = false;
			this.rowSelect = false;
			this.fixColor = "#f5f5f5";//"#084972";//"#c4c4a3";		
			this.color = system.getConfig("form.grid.color");
			uses("control_rowGrid;control_column");			
			this.columnFormat = new arrayMap();
			this.columnWidth = new arrayMap();
			this.columnReadOnly = new arrayMap();
			//------------			
			this.first = false; //eventKeyPress
			this.rightBtn = false;			
			this.btnVisible = true;
			this.allowAutoAppend = true;
			this.addHeader = "";
			this.totalPage = 1;
			this.allowBlank = false;
			this.freezed = false;//da251d
			this.data = {rs : {rows:[]}};
			if (options !== undefined){
				this.updateByOptions(options);		
				if (options.headerHeight) this.setHeaderHeight(options.headerHeight);
				if (options.autoAppend !== undefined) this.setAllowAutoAppend(options.autoAppend);
				if (options.appendRow !== undefined) this.onAppendRow.set(options.appendRow[0],options.appendRow[1]);
				if (options.colCount !== undefined) this.setColCount(options.colCount);
				if (options.colWidth !== undefined) this.setColWidth(options.colWidth[0],options.colWidth[1]);
                
				if (options.colTitle !== undefined) this.setColTitle(options.colTitle);				
				if (options.colFormat !== undefined) this.setColFormat(options.colFormat[0],options.colFormat[1]);				
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
				if (options.pager !== undefined) this.onPager.set(options.pager[0], options.pager[1]);
				if (options.keyDown) this.onKeyDown.set(options.keyDown[0], options.keyDown[1]);
				if (options.keyUp) this.onKeyUp.set(options.keyUp[0], options.keyUp[1]);	
				if (options.keyPress) this.onKeyPress.set(options.keyPress[0], options.keyPress[1]);	
			}
		}catch(e){
			systemAPI.alert(this+"$create:",e);
		}
	}
};
window.control_saiGrid.extend(window.control_containerControl);
window.saiGrid = window.control_saiGrid;
window.control_saiGrid.implement({
	doDraw: function(canvas){
		try{	
			var n = this.getFullId();
			canvas.css({ 
						background : "#ffffff", 
						overflow : "hidden",
						border :  window.system.getConfig("3dborder.outer.top")
						});			
			var h = this.height - 40; 
			var w = this.width - this.widthColNo;
			var left = w / 2 - 25, top = h / 2 + 25;
			var html =  "<iframe name='"+ n +"_iframe' id ='"+ n +"_iframe' frameborder='0' style='{display:none;position: absolute;left: 0;top: 0; width:100%; height: 100%;background:#ffffff;z-index:999}' onscroll='$$$("+this.resourceId+").doScrollFrame(event)'></iframe>" +
						"<div id='"+n+"_no' style='{position:absolute;background-color:#f5ffff; overflow:visible;left: 0;top: "+this.headerHeight+"; width:"+this.widthColNo+"; height:100%;}'>"+
						"</div>"+
						"<div id='"+n+"form' style='{background:#fff;position:absolute;left: "+this.widthColNo+";top: "+this.headerHeight+"; width: "+w+"px; height: "+h+"px; overflow: auto;}' onscroll='$$$("+this.resourceId+").doScroll(event)' >"+
						"</div>"+
						"<div id='"+n+"_header' style='position:absolute;overflow:hidden;left: "+this.widthColNo+";top: 0; width:auto; height:"+this.headerHeight+"px;border:1px solid #transparent'"+
						" onmousemove ='$$$("+this.resourceId+").headerMove(event)' "+	
						" onmouseup ='$$$("+this.resourceId+").headerUp(event)' "+	
						"></div>"+
						"<div id='"+n+"_freezeContainer' style='background:#fff;border-right:1px solid #999;position:absolute;left: "+this.widthColNo+"px;top: "+this.headerHeight+"; width: "+this.widthColNo+"px; height: "+h+"px; overflow: hidden;' onscroll='$$$("+this.resourceId+").doScroll(event)' >"+
							"<div id='"+n+"_freezeForm' style='position:absolute;left: 0;top:0; width: 100%; height:100%; overflow: hidden;' onscroll='$$$("+this.resourceId+").doScroll(event)' >"+
							"</div>"+
						"</div>"+
						"<div id='"+n+"_freezeHeader' style='position:absolute;border-right:1px solid #007AFF;overflow:hidden;left: "+(this.widthColNo)+"px;top: 0; background:#dedede; width:auto; height:"+this.headerHeight+"px;border:1px solid transparent'"+
							" onmousemove ='$$$("+this.resourceId+").headerMove(event)' "+	
							" onmouseup ='$$$("+this.resourceId+").headerUp(event)' "+	
						"></div>"+
                        "<div id='"+n+"_topLeft' style='{position:absolute;background-color:#AAAAAA;cursor:pointer;"+
                            "left: 0;top: 0; width:"+(this.widthColNo)+"; height:"+this.headerHeight+"px; "+
                            "}' "+
                            " onclick ='$$$("+this.resourceId+").doTopLeftClick(); ' "+
                            " onmousemove ='$$$("+this.resourceId+").doTopLeftOver(event); ' "+
                            " onmouseout ='$$$("+this.resourceId+").doTopLeftOut(event); ' "+
                            "><i id='"+ n +"_img' class='fa fa-clipboard' style='position:absolute;left:5px;top:5px;font-size:14px;color:#ffffff'/>"+
                        "</div>"+
                        "<div id='"+n+"_spr' style='position:absolute;left:1px;top:0;width:1px;height:100%;background:#3992e5;display:none'></div>"+
                        "<div id='"+n+"_nos' style='{position:absolute;background-color:#AAAAAA;left: 0;top: "+(this.height - this.headerHeight).toString()+"px; width:"+this.widthColNo+"; height:20px;}'>"+
						"</div>"+
                        "<div id='"+n+"_nav' style='background:#AAAAAA;border:1px solid #transparent;position:absolute;left:"+this.widthColNo+";top: "+(this.height - this.headerHeight - 20).toString()+"; width:100%; height: 20px;color:#fff' >"+
						
						"</div>";			
			
			canvas.bind("mouseover",setEvent("$$$("+this.resourceId+").headerMove(event)"));
			canvas.bind("mouseup",setEvent("$$$("+this.resourceId+").headerUp(event)"));
			
			this.setInnerHTML(html, canvas);
			this.cnvNo = $("#"+ n +"_no");
			this.topLeft = $("#"+ n +"_topLeft");
			this.cnvHeader = $("#"+ n +"_header");
			this.headerCanvas = this.cnvHeader;
			this.frame = $("#"+ n +"form");
			this.navigatorCanvas = $("#"+ n +"_nav");
			this.canvas = canvas;
			this.cnvHeader.shadow({radius:0});
			var viewer =$("<div style='position:absolute;left:0;top:0;height:100%;width:130;'></div>");
			var navFirst = $("<div style='cursor:pointer;position:absolute;left:0;top:0;width:18;height:18;text-align:center'><img src='icon/skip-previous.png'  width=18 height=18/></div>");
			var navLeft = $("<div style='cursor:pointer;position:absolute;left:20;top:0;width:18;height:18;text-align:center'><img src='icon/chevron-left.png'  width=18 height=18/></div>");
			var nav = $("<div id='"+ n +"_navpos'style='position:absolute;left:40;top:2;width:50;height:100%;text-align:center'></div>");
			var navRight = $("<div style='cursor:pointer;position:absolute;left:90;top:0;width:18;height:18;text-align:center'><img src='icon/chevron-right.png'  width=18 height=18/></div>");
			var navLast = $("<div style='cursor:pointer;position:absolute;left:110;top:0;width:18;height:18;text-align:center'><img src='icon/skip-next.png'  width=18 height=18/></div>");
			navFirst.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickFirst(event);") );
			navLeft.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickLeft(event);") );
			navRight.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickRight(event);") );
			navLast.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickLast(event);") );
			
			viewer.append(navFirst);
			viewer.append(navLeft);
			viewer.append(nav);
			viewer.append(navRight);
			viewer.append(navLast);

			var trans =$("<div id='"+ n +"_trans' style='position:absolute;left:0;top:0;height:100%;width:100;'></div>");
			this.appendBtn = $("<div title='Append Row' style='cursor:pointer;position:absolute;left:0;top:2;width:20;height:100%;text-align:center'><img src='icon/plus.png' width=18 height=18/></div>");
			this.copyrowBtn = $("<div title='Copy Row' style='cursor:pointer;position:absolute;left:20;top:2;width:20;height:100%;text-align:center'><img src='icon/content-duplicate.png' width=18 height=18/></div>");
			this.removeBtn = $("<div title='Delete Row' style='cursor:pointer;position:absolute;left:40;top:2;width:20;height:100%;text-align:center'><img src='icon/minus2.png' width=18 height=18 /></div>");
			this.delAllBtn = $("<div title='Clear Table' style='cursor:pointer;position:absolute;left:60;top:2;width:20;height:100%;text-align:center'><img src='icon/reload2.png' width=18 height=18/></div>");
			this.downloadBtn = $("<div title='Download Data' style='cursor:pointer;position:absolute;left:80;top:2;width:20;height:100%;text-align:center'><img src='icon/download.png' width=18 height=18/></div>");
			
			this.appendBtn.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickAppend(event);") );
			this.copyrowBtn.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickCopy(event);") );
			this.removeBtn.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickRemove(event);") );
			this.delAllBtn.bind("click",setEvent("$$$(" + this.resourceId + ").eventMouseClickDelAll(event);") );
			this.downloadBtn.bind("click",setEvent("$$$(" + this.resourceId + ").download(event);") );
			
			trans.append(this.appendBtn);
			trans.append(this.copyrowBtn);
			trans.append(this.removeBtn);
			trans.append(this.delAllBtn);
			trans.append(this.downloadBtn);
			//$("#" + n + "_navpos").val("1");
			//$("<div id='"+n+"_total' style='position:absolute;left:200;top:4;height:100%;width:50'>1/1</div>").appendTo(this.navigatorCanvas);
			this.navigatorCanvas.append(viewer);
			this.navigatorCanvas.append(trans);
			var self = this;
			$("#" + n +"form").scroll(function(event){
				self.emit("scroll", event);
			});	
			this.freezeHeader = $("#"+ n +"_freezeHeader");this.freezeHeader.hide();
			this.freezeForm = $("#"+ n +"_freezeContainer");this.freezeForm.hide();
			this.freezeHeader.shadow({radius:0});
		}catch(e){
			alert(e);
		}
	},
	showNavigator : function(){
		this.navigatorCanvas.show();	
	},
	hideNavigator : function(){
		$("#"+this.getFullId()+"form").css({top: this.headerHeight, height: this.height - this.headerHeight});
		this.navigatorCanvas.hide();	
	},
    getHeaderCanvas : function(){
      return  $("#"+ this.getFullId() +"_header");
    },
	eventMouseClickAppend: function(event){
		
		if (this.callbackList["beforeAddRow"] == undefined){
			this.appendRow();
			this.row = this.rowCount - 1;
		}else {
			this.emit("beforeAddRow", (allow) => {
				if (allow){
					this.appendRow();
					this.row = this.rowCount - 1;
				}
			});
		}
		this.emit("afterAddRow", this.row);
	},
	eventMouseClickCopy: function(event){
		try{
			//system.alert(null,"Maaf untuk sementara fitur ini masih belum aktif","");
			//return;
			var row = this.row;
			if (this.autoPaging){
				//row = (this.page - 1) * this.rowPerPage + row;
			}
			console.log("CopyRow "+ row);
			var copyValue = this.rowData.get(row);
			
			if (copyValue){
				var tmp = [];
				$.each(copyValue, function(key, val){
					tmp.push(val);
				});
				this.appendData(tmp);
				this.doSelectPage(this.page);
			}
			
			this.emit("afterCopyRow", row, tmp);
				
			
		}catch(e){
			error_log(e);
		}
	},
	eventMouseClickRemove: function(event){
		var self = this;
		var row = this.row;
		var tmp  = this.rowData.get(row);
		if (this.callbackList["beforeDeleteRow"] == undefined){
			this.delRow(this.row);
			if (this.row > this.rowCount - 1){
				this.row = this.rowCount - 1;
			}
		}else {
			this.emit("beforeDeleteRow", function(allow){
				if (allow){
					self.delRow(self.row);
					if (self.row > self.rowCount - 1){
						self.row = self.rowCount - 1;
					}
				}
			});
		}

		this.emit("afterDeleteRow", row, tmp);
		
		
	},
	eventMouseClickDelAll: function(event){
		this.clear();
		this.page = 1;
		this.doSelectPage(1);
		this.emit("btnClearAll");
		
	},
	eventMouseClickFirst: function(event){			
		this.page = 1;
	    this.onPager.call(this,1);		
	    //$("#"+ this.getFullId()+"_navpos").html(this.page);
		$("#"+this.getFullId()+"_navpos").html(this.page+"/"+this.totalPage);
		this.doSelectPage(1);
		this.emit("btnFirstClick", 1);

	},
	eventMouseClickLeft: function(event){	
		if (this.page > 1)	this.page--;		
	    this.onPager.call(this, this.page);		
	    //$("#"+ this.getFullId()+"_navpos").val(this.page);
		$("#"+this.getFullId()+"_navpos").html(this.page+"/"+this.totalPage);
		//this.prevPage();
		this.doSelectPage(this.page);
		this.emit("btnPrevClick", this.page);
	},
	eventMouseClickRight: function(event){		
		//this.totalPage = this.getTotalPage();		
		if (this.page < this.totalPage ) this.page++;
	    this.onPager.call(this, this.page);		
	    //$("#"+ this.getFullId()+"_navpos").val(this.page);
		$("#"+this.getFullId()+"_navpos").html(this.page+"/"+this.totalPage);
		//this.nextPage();
		this.doSelectPage(this.page);
		this.emit("btnNextClick", this.page);
	},
	eventMouseClickLast: function(event){				
		//this.totalPage = this.getTotalPage();
		this.page = this.totalPage;
	    this.onPager.call(this, this.totalPage);		
	    //$("#"+ this.getFullId()+"_navpos").val(this.page);
		$("#"+this.getFullId()+"_navpos").html(this.page+"/"+this.totalPage);
		this.doSelectPage(this.page);
		this.emit("btnLastClick", this.page);
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
		try{
			if (this.resizeCol){
				var col = $$$(this.columnToResize);
				if (col){
					var width = e.clientX - col.headerCanvas.offset().left;
					col.separator.css({cursor:"default", background:"transparent"});
					col.setColWidth(width - 2);
					
					$("#"+this.getFullId()+"_spr").css({display:"none"});
					
				}
				this.resizeCol = false;
				this.columnToResize = -1;
			}
		}catch(e){
			error_log(e);
		}
	},
	
	hideButton: function(rowIndex, idx){
		if (!this.btnVisible) return;
		var colHeader = this.columns.get(idx);
		if (colHeader == undefined) return;
		var app = this.getApplication();
		switch(colHeader.buttonStyle){
			case bsAuto :
					var ellips = this.btnEllips;
					if ((ellips != null) && (ellips.is(":visible")))
						ellips.hide();
					var date = this.btnDate;
					if ((date != null) && (date.is(":visible"))){
						date.hide();	
						if (app !== undefined && app.systemDatePickerForm != undefined)
							app.systemDatePickerForm.hide();
					}
					break;
			case bsEllips :
					var combobox = this.btnDropDown;
					if ((combobox != null) && (combobox.is(":visible")))
						combobox.hide();
					var date = this.btnDate;
					if ((date != null) && (date.is(":visible"))){
						date.hide();	
						if (app !== undefined && app.systemDatePickerForm != undefined)
							app.systemDatePickerForm.hide();
					}
					break;	
			case bsDate :
					var combobox = this.btnDropDown;
					if ((combobox != null) && (combobox.is(":visible")) )
						combobox.hide();
					var ellips = this.btnEllips;
					if ((ellips != null) && (ellips.is(":visible")))
						ellips.hide();
					break;	
			case bsNone :
					var combobox = this.btnDropDown;
					if ((combobox != null) && (combobox.is(":visible")))
						combobox.hide();
					var ellips = this.btnEllips;
					if ((ellips != null) && (ellips.is(":visible")))
						ellips.hide();	
					var date = this.btnDate;
					if ((date != null) && (date.is(":visible")))
						date.hide();														
					break;
		}
		if (app !== undefined && app.systemDatePickerForm != undefined)
			app.systemDatePickerForm.hide();		
	},
	showButton: function(rowIndex, idx){
		if (!this.btnVisible) return;
		var colHeader = this.columns.get(idx);
		if (colHeader == undefined) return;
		switch(colHeader.buttonStyle)
		{
			case bsEllips :
				var node = this.btnEllips;				
				if (node == null){
					node = $("<div id='"+this.getFullId()+"_ellips"+"' style='position:absolute;cursor:pointer;z-index:99;background:url(icon/"+system.getThemes()+"/btnfind.png)' ></div>");
					node.appendTo(this.canvas);															
					var html = "<div style='position:absolute; left: 0; top : 1; width:18px; height: 19px;' "+
							"onclick = '$$$("+this.resourceId+").ellipsClick(event,"+idx+","+rowIndex+")' "+
							"onmousedown='$$$("+this.resourceId+").doMouseDown(event,"+idx+","+rowIndex+")'"+							
							"></div>";
					node.html( html );			
					this.btnEllips = node;
				}				
				var top = this.getRowTop(rowIndex, idx);
				var left = this.getRowLeft(idx);
				node.css({left:left + 5, top : top, width:18, height:18});				
				break;
			case bsAuto :		
				var node = this.btnDropDown;				
				if (node == null){					
					node = $("<div id='"+this.getFullId()+"_dropdown"+"' style='position:absolute;cursor:pointer;z-index:99;background:url(icon/"+system.getThemes()+"/combobox.png)' ></div>");
					node.appendTo(this.canvas);																				
					var html = "<div style='position:absolute; left: 0; top : 1; width:100%; height: 100%;' "+
							"onclick = '$$$("+this.resourceId+").dropDownClick(event,"+idx+","+rowIndex+")' "+
							"onmousedown='$$$("+this.resourceId+").doMouseDown(event,"+idx+","+rowIndex+")'"+														
							"></div>";
					node.html( html );
					this.btnDropDown = node;
				}				
				var top = this.getRowTop(rowIndex, idx);
				var left = this.getRowLeft(idx);
				node.css({left:left - 15, top : top, width:20, height:20});							
				break;
			case bsDate :
				var node = this.btnDate;				
				if (node == null){
					node = $("<div id='"+this.getFullId()+"_date"+"' style='position:absolute;cursor:pointer;z-index:99;background:url(icon/"+system.getThemes()+"/dpicker.png)' ></div>");					
					var html = "<div style='position:absolute; left: 0; top : 1; width:18px; height: 19px;' "+
							"onclick = '$$$("+this.resourceId+").dateClick(event,"+idx+","+rowIndex+")' "+
							"onmousedown='$$$("+this.resourceId+").doMouseDown(event,"+idx+","+rowIndex+")'"+						
							"></div>";
					node.appendTo(this.canvas);
					node.html ( html );
					this.btnDate = node;
				}				

				var top = this.getRowTop(rowIndex, idx);
				var left = this.getRowLeft(idx);
				
				node.css({left:left - 15, top : top, width:18, height:19});							
								
				var app = this.getApplication();
				if (app.systemDatePickerForm != undefined)
					app.systemDatePickerForm.setTop(top + this.headerHeight -2);				
				break;
			
		}
	},
	isLastCol: function(col){	
		/*if ((col + 1 == this.columns.getLength() && !this.columns.get(col).hideColumn) || this.columnFormat.get(col + 1) == cfButton)
			return true;
		else if (col < this.columns.getLength()){
			var lastHide = col;
			for (var i=col; i < this.columns.getLength(); i++){
				if (!this.columns.get(i).hideColumn) lastHide = i;
			}
			if (col == i && !this.columns.get(col).hideColumn) return true;
			else return false;
		}
		return false;*/
		//
		if (col + 1 == this.bottomColumns.getLength()){
			return true;
		}else if (col < this.bottomColumns.getLength()){
			var lastHide = col;
			for (var i=col; i < this.bottomColumns.getLength(); i++){
				if (!this.bottomColumns.get(i).hide || this.bottomColumns.get(i).format == cfButton || this.bottomColumns.get(i).format == cfBoolean) lastHide = i;
			}
			if (col == i && (!this.bottomColumns.get(i).hide || this.bottomColumns.get(i).format == cfButton || this.bottomColumns.get(i).format == cfBoolean)) return true;
			else return false;
		}
		return false;
	},
	nextCol: function(col){
		var lastHide = col;
		for (var i=col + 1; i < this.bottomColumns.getLength(); i++){
			if ( (this.bottomColumns.get(i).readOnly == undefined) || (!this.bottomColumns.get(i).hide && !this.bottomColumns.get(i).readOnly)) 
				return i;
		}
		return -1;
	},
	firstCol: function(){		
		var lastHide = 0;
		for (var i=0; i < this.bottomColumns.getLength(); i++){
			var column = this.bottomColumns.get(i)
			if ( column.readOnly === undefined || !column.readOnly){
				if (column.hide === undefined || !column.hide)
					return i;
			}
		}
		return false
	},
	eventKeyDown: function(event){
		try{
			window.system.buttonState.set(event);			
			
		}catch(e){
			systemAPI.alert(this+"$KeyDown()",e);
		}
	},
	doSizeChange: function(width, height){	
		if (this.frame){
			this.getClientCanvas().css({ 	
							width : width - this.widthColNo, 
							height : height - this.headerHeight - 20 
					});
			this.navigatorCanvas.css({ 	
							width : width - this.widthColNo, 
							top : height - 20 
					});
			/*$("#"+this.getFullId()+"_total").css({
							left : (width - this.widthColNo) / 2 - 25
					});*/
		}
	},	
	doScroll: function(event){
		try{
			var n = this.getFullId();			    		   
			this.cnvHeader.css({left : this.frame.scrollLeft() * -1 + this.widthColNo  });
			
			var colNo = $("#"+ n + "_no");
			colNo.css({ top : this.headerHeight + this.frame.scrollTop() * -1 }); 
			
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
			$("#"+this.getFullId()+"_freezeForm").css({top:  -this.frame.scrollTop()});
		}
		catch (e){
		    systemAPI.alert(this+"$doScroll()", e);
		}
	},
	doScrollFrame: function(target){
		try{						
			var n = this.getFullId();					    
		    this.cnvHeader.css({ left : -this.frame.scrollLeft() + this.widthColNo });
			$("#"+ n + "_no").css({ top : - this.frame.scrollTop() });
			//this.exitInplace();
			$("#"+this.getFullId()+"_freezeForm").css({top: -this.frame.scrollTop()});
		}catch (e){
		    systemAPI.alert(this+"$doScroll()", e);
		}
	},
	showLoading: function(){
		//$("#"+this.getFullId()+"_block").show();
		//this.getClientCanvas().hide();
	},
	hideLoading: function(){
		//$("#"+ this.getFullId()+"_block").hide();		
		//this.getClientCanvas().show();
	},
	setRowCount: function(data){	
		this.rowCount = 0;
		var rowNow = this.rowData.getLength();		
		if (rowNow > data)
		{
			for (var i= (rowNow - 1);i >= data;i--)
				this.delRow(i);
		}else
		{
			var values = Array();
			for (var i = 0; i < this.columns.getLength();i++)
				values[i] = "";	
			for (var i = rowNow;i< data;i++)
				this.addRowValues(values);
		}		

	},
	getRowCount: function(){
		return this.rowData.getLength();;//this.data.rs.rows.length;
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
			var lft  = 0;
			var wdth = 80;
			for (var i = 0; i < this.colCount; i++)
			{				
				col = new control_column(this,i);
				wdth = 80;					
				col.setColWidth(wdth);				
				col.setTitle("Column"+i);				
				col.setLeft(lft);
				lft += wdth; 
				this.columns.set(i, col);				
			}
			for (var i = 0; i < this.colCount; i++)
			{
				col = this.columns.get(i);
				col.createSeparator();
			}
			this.maxRowShow = this.calcMaxRowShow();
		}catch(e){
			error_log("setColCount."+e);
		}
	},
	getColCount: function(){
		return this.colCount;
	},
	setSelIndex: function(index){
		this.selIndex = index;
		this.col = index;
	},
	exitInplace: function(){

	},
	setRowIndex: function(index, colIdx, trigger){	
		try{
			if (colIdx === undefined) colIdx = this.col;						
			if (index >= this.rowData.getLength()) index = this.rowData.getLength() - 1;
			
			this.setSelIndex(colIdx);
			this.setActiveRow(index);			
			this.showButton(index, colIdx);
			
		}catch(e){
			systemAPI.alert(this+"$setRowIndex()",e);
		}
	},
	getMaxRowShow: function(){
		return this.maxRowShow;
	},
	getMaxColShow: function(){
		return this.maxColShow;
	},
	doSystemPaste: function(str){
		try{
			var method = this.onChange.method;			
			this.onChange.method = undefined;
			var line,rows = str.split("\n");
			var row = this.row;
			var col = [];
			var startCol = this.col; 
			var lastCol = (rows[0].split("\t").length + startCol >= this.getColCount() ? this.getColCount() : rows[0].split("\t").length + startCol);
			for (var c =startCol;c < lastCol;c++) col[col.length] = c;		
			this.data.rs.rows = [];
			this.data.rs.fields = {};
			this.clear();
			for (var i in rows){
				if (rows[i] == "") continue;
				line = rows[i];			
				// jika row masih kurang dari rowcount, edit row, else appendData
				var dataTmp = line.split("\t");
				for (var dt=0; dt < dataTmp.length; dt++){
					if (dataTmp[dt] == "") dataTmp[dt] = "-";
				}
				/*if (row < this.getRowCount()){				
					this.editData(row,dataTmp, col );
				}else */
				this.appendData(dataTmp);		
				row++;	
				//this.data.rs.rows.push(dataTmp);
			}		
			this.onChange.method = method;
			//error_log(this.onChange.method);
			this.onAfterPaste.call(this, this.rowCount);
			this.emit("paste", this.rowCount);
		}catch(e){
			error_log(e);
		}
	},
	doKeyDown: function(charCode, buttonState, keyCode,event){							
		
		return false;
	},
	addCol: function(data){	
		for (var i = this.colCount; i < this.colCount + data; i++){		
			col = new control_column(this,i);
			wdth = 80;
			col.setWidth(wdth);
			col.setTitle("Column"+i);		
			lft = (i * wdth); 
			col.setLeft(lft);
			this.columns.set(i, col);
		}	
		this.colCount += data;
		this.maxRowShow = this.calcMaxRowShow();
	},
	rearrange: function(startPos){
		try{
			// console.log("SaiGRid Width " + this.columnWidth.getArray());
			if (this.columns.getLength() > 0)
			{			
				var obj = this.columns.get(startPos);
				var newLeft = 0;
				if (obj){							
    				var left = obj.left;				
    				var width = obj.width;		
    				var newLeft = left + width;	
    				if (obj.separator)			
						obj.separator.css({ left: newLeft - 5});
					// console.log("Rearrange Column " + startPos +":"+ this.title.length +":"+newLeft +":"+ obj.title+":"+obj.width);
				}
				
				startPos++;
				
				for (var i = startPos; i < this.title.length; i++)
				{
					obj = this.columns.get(i);
					if (obj){
						// console.log("Index " + i +":"+newLeft + ":"+ obj.title+":"+obj.width);
    					obj.setLeft(newLeft);
    					obj.headerCanvas.css({ left: newLeft});
    					if (obj.separator)
    						obj.separator.css({ left: newLeft + obj.width - 5});
    					newLeft += obj.width;
    					//if (obj.hideColumn) obj.headerCanvas.hide();
    								
    				}
				}
				// newLeft = 0;
				// for (var i = 0; i < this.columnWidth.getLength(); i++){
				// 	newLeft +=  this.columnWidth.get(i);
				// }

				// console.log("Rearrange Column 2" + startPos +":"+ this.title.length +":"+newLeft);
				if (newLeft){
					
					this.cnvHeader.css({width : newLeft + 2});
				}
				
			}		
			
			
		}
		catch(e){
			error_log(this+"$rearrange:"+e);
		}
	},
	addRowValues: function(values){
		try{					
			var col;
			var app = this.getApplication();	
			var width = this.cnvHeader.width();
			//console.log("addRowValues " + values);
			this.rowData.set(this.rowCount, values);
			this.rowCount++;

			this.recordCount = this.rowCount;
			this.pageCount = Math.ceil(this.recordCount / this.rowPerPage);	
			this.totalPage = this.pageCount;
			$("#"+this.getFullId()+"_navpos").html(this.page+"/"+this.totalPage);			

			if (this.autoPaging && this.rowCount > this.rowPerPage )
				return;	
			
			var len = this.rowCount - 1;//this.rowData.getLength();
			var top = (this.rowCount - 1) * this.rowHeight;
			
		//---------------------			
			var headerCanvas = this.cnvNo;//$(this.getFullId()+"_no");
			
			var node = $("#"+this.getFullId()+"_no"+len);
			if ((node != undefined)&&(headerCanvas != undefined))
				node.remove();
			node = $("<div id='"+this.getFullId()+"_no"+len+"'></div>");
			node.css({ background : this.fixColor, 
					height : document.all ? this.rowHeight + 2:this.rowHeight,
					top : top + 2,
					width : this.widthColNo, 
					borderBottom :  window.system.getConfig("3dborder.inner.bottom"), 
					position : "absolute" });	
            node.fixBoxModel();
			var rowNumber  = (len + 1).toString();
			if (this.autoPaging){
				rowNumber = ( this.page - 1) * this.rowPerPage + (len + 1);
			}
			node.html( "<div style='position:absolute;left:0;top:0;width:100%;height:100%;background-image:url(icon/"+system.getThemes()+"/menuselect.png)'><span id='"+this.getFullId()+"_no_"+len+"' align='center' style='position:absolute;text-align:center;color:"+system.getConfig("form.grid.fontColor")+"; left : 0; top : 3; width:"+this.widthColNo+"; height:100%;'>"+rowNumber+"</span></div>" );
			if (this.autoPaging && this.rowCount <= this.rowPerPage )
				headerCanvas.append(node);
			else if (!this.autoPaging)
				headerCanvas.append(node);		
			else return;				
		//--------------------						
			var rowNode = $("<div id='"+this.getFullId()+"_row"+len+"'></div>");
			rowNode.css({ height : document.all ? this.rowHeight + 2:this.rowHeight,
					top : top ,
					width : width, 
                    overflow: "hidden",
					borderBottom: "1px solid #999",
				//	borderTop: "1px solid #999", 
					position : "absolute" });		
			rowNode.fixBoxModel();
			rowNode.on("mouseover", {row:len, id:this.getFullId()+"_row"+len, node : rowNode }, (event) => {
				event.preventDefault();
				event.stopPropagation();
				rowNode.css({background:"#dedede"});
				$("#" + rowNode.attr("id") +"_clone").css({background:"#dedede"});
			});	
			rowNode.on("mouseleave", {row:len, id:this.getFullId()+"_row"+len, node : rowNode }, (event) => {
				event.preventDefault();
				event.stopPropagation();
				rowNode.css({background:"transparent"});
				$("#" + rowNode.attr("id") +"_clone").css({background:"transparent"});
			});	
			var freezeCanvas = $("#"+this.getFullId()+"_freezeForm");
			var colIndexFreeze = -1;
			for (var i=0; i < this.columns.getLength();i++){
				if (this.columns.get(i).freeze) 
					colIndexFreeze = i;
			}
			var left = 0;
			var prevNode;
			var self = this;
			for (var i = 0; i < values.length; i ++){
				var col = this.columns.get(i);
				
                var id = this.getFullId()+"_row"+len+"_cell"+i;
                node = $("<div id='"+id+"'></div>");
				node.css({ 
					height : "100%",
					width : this.columnWidth.get(i),
					textAlign: this.columnFormat.get(i) == cfNilai ? 'right' : 'left',
					left: left, 
					borderLeft :  "1px solid #999",
					overflow:"hidden",
					whiteSpace: "nowrap",
					position : "absolute" });		
				if (this.columnReadOnly.get(i) === false || (this.bottomColumns.get(i) && this.bottomColumns.get(i).readOnly == false )){ //this.readOnly){//
					//node.attr("contenteditable","true");
					var contenteditable = "contenteditable='true'";
				}else var contenteditable = " ";
					//node.attr("contenteditable","false");
			
				if (this.columnFormat.get(i) == cfNilai){
					var nodeItem = $("<div  id='"+id+"_edit' "+contenteditable+"  style='white-space:nowrap;overflow:hidden;position:absolute;padding-left:3px; padding-right:3px;padding-top:3px;width:"+(this.columnWidth.get(i) - 6)+"px;height:"+(this.rowHeight)+"px;text-align:right'></div>");
					//node.html();
					
					if (values[i] === undefined || values[i] === "")
						nodeItem.html("0");
					else 
						nodeItem.html(floatToNilai(values[i]));
				}else if ((this.bottomColumns.get(i) && this.bottomColumns.get(i).format == cfBoolean) || this.columnFormat.get(i) == cfBoolean){//.this.columnFormat.get(i) 
					var l = this.columnWidth.get(i) / 2 - 6;
					
					if (values[i] === true || values[i].toUpperCase() == "TRUE")
						var nodeItem = $("<div style='position:absolute;top:3px;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
					else var nodeItem = $("<div style='position:absolute;top:3px;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
					
				}else if (this.columnFormat.get(i) == cfUpload){//.this.columnFormat.get(i) 
					var nodeFile = $("<input id='"+id+"_file' type='file' name='files' style='position:absolute;opacity: 0;filter:alpha(opacity:0);width:100%;height:100%' />");
					var nodeAnim = $("<div id='"+id+"_anim' class='loader' style='position:absolute;width:15px;height:15px;left:10px;border-radius:50%;border:5px solid #f3f3f3;border-top:5px solid #3498db' />");
					var nodeItem = $("<div id='"+id+"_edit' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:absolute;width:"+(this.columnWidth.get(i))+"px;height:"+(this.rowHeight)+"px'>"+
									"<div id='"+id+"_cap' style='position:absolute;width:100%;height:100%;text-align:center;padding-top:5px'>Browse</div> "+
									"</div>");
					nodeItem.append(nodeFile);
					nodeItem.append(nodeAnim);
					nodeAnim.hide();
					
					nodeFile.on("change", {col: i, row: len, id : id}, function(event){
						self.emit("change", event.data.col, event.data.row, $(this).val().replace("C:\\fakepath\\","") );
						$("#"+event.data.id+"_anim").show();
						$("#"+event.data.id+"_cap").hide();
						self.upload(event.data.col, event.data.row, $(this), function(){
							$("#"+event.data.id+"_anim").hide();
							$("#"+event.data.id+"_cap").show();
						});
					});
					
				}else 
					var nodeItem = $("<div id='"+id+"_edit' "+contenteditable+"  style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:absolute;padding-left:3px; padding-right:3px;padding-top:3px;width:"+(this.columnWidth.get(i) - 6)+"px;height:"+(this.rowHeight)+"px'>"+values[i]+"</div>");
				
				node.append(nodeItem);
				var nodeButton;
				if (this.bottomColumns.get(i) && this.bottomColumns.get(i).buttonStyle){

					switch (this.bottomColumns.get(i).buttonStyle){
						case bsAuto: 
							var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer'><i class='fa fa-caret-down' style='position:absolute;top:2;left:-20px;color:#888888;font-size:16px'/></div");
						break;
						case bsEllips:
							var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer;background:#fff'><i class='fa fa-search' style='position:absolute;top:2;left:-20px;color:#888888;font-size:16px'/></div");
						break;
						case bsNone :
						break;
						case bsDate: 
							var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer'><div style='position:absolute;left:-20px;width:100%;height:100%;top:1px;background:white;display:flex;justify-content: center;align-items: center;color:grey'><i class='fa fa-calendar'/></div");
						break;
						case bsEdit: 
							var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer'><img src='icon/ic_create_black_24px.svg' width=16 height=16 style='position:absolute;top:2;left:-20px'/></div");
						break;
					}
					nodeButton.on("click", {col:i, row:len, node : node}, function(event){
						event.preventDefault();
						event.stopPropagation();
						if (self.bottomColumns.get(event.data.col).buttonStyle == bsAuto){
							self.dropDownClick(event, event.data.node, event.data.col,event.data.row);
						}else if (self.bottomColumns.get(event.data.col).buttonStyle == bsEllips){
							self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
							//showListData
						}else if (self.bottomColumns.get(event.data.col).buttonStyle == bsDate){
							self.dateClick(event, event.data.col,event.data.row,event.data.node);
							//showListData
						}else {
							self.emit("btnClick", self, event.data.col, event.data.row, nodeButton);
							self.onEllipsClick.call(self, event.data.col, event.data.row);
						}
						
					});
					if (self.bottomColumns.get(i).buttonStyle != bsAuto && self.bottomColumns.get(i).buttonStyle != bsEdit && self.bottomColumns.get(i).buttonStyle != bsDate)
						nodeButton.hide();
					
					node.append(nodeButton);
				} 
				
				
				node.on("click",{resId:this.resourceId, col:i, row:len, values:values, w : this.columnWidth.get(i), id: id}, function(event){
					try{
						console.log("CLick");
						//event.preventDefault();
						//event.stopPropagation();
						self.prevRow = self.row;
						self.prevCol = self.col;
						self.col = event.data.col;
						self.row = event.data.row;
						var columnFormat = self.columnFormat.get(self.col) ||  (self.bottomColumns.get(self.col) && self.bottomColumns.get(self.col).format );
						var l = event.data.w / 2 - 6;
						var values = event.data.values;
						if (columnFormat == cfBoolean){
							if (values[event.data.col] === "TRUE"){
								values[event.data.col] = "FALSE";
								$(this).html("<div style='position:absolute;top:3;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
							}else{
								values[event.data.col] = "TRUE";
								$(this).html("<div style='position:absolute;top:3;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
							}
						}
						self.onClick.call(self, event.data.col, event.data.row);
						self.emit("cellclick", self, event.data.col, event.data.row, self.rowData.get(event.data.row), event.data.id);
						
					}catch(e){
						alert(e);
					}
				});
				
				
				node.dblclick({resId:this.resourceId, col:i, row:len, id: id, nodeItem: nodeItem }, function(event){
					console.log("double click grid");
					self.prevRow = self.row;
					self.prevCol = self.col;
					self.col = event.data.col;
					self.row = event.data.row;
					self.onDblClick.call(self, event.data.col, event.data.row);
					self.emit("dblClick",  event.data.col, event.data.row, event.data.nodeItem.html(), self.rowData.get(event.data.row) );
				});
				left += this.columnWidth.get(i);
				rowNode.append(node);
				nodeItem.attr("data", JSON.stringify({col:i, row:len} ) );
				nodeItem.on("paste", function(event){
					event.preventDefault();
					var data = JSON.parse($(this).attr("data"));
					var text = (event.originalEvent || event).clipboardData.getData('text/plain');
					$(this).html(text);
					self.emit("cellpaste", data.col, data.row, text);
					
				});
				nodeItem.focus( {resId: this.resourceId, col: i, row:len, button: nodeButton},function(event){
					try{
						console.log("Focused");
						//var self = $$$(event.data.resId);	
						var col = event.data.col;
						var row = event.data.row;
						var columnFormat = self.columnFormat.get(col) || (self.bottomColumns.get(col) && self.bottomColumns.get(col).format);
						if (columnFormat == cfNilai){
							var val = parseFloat(self.cells(col, row));
							if (isNaN(val))
							$(this).html("0");
							else 
								$(this).html(val);
						}else {
							
						}
						$(this).css({background:"#FAE658"});
						self.emit("cellenter", col, row,$(this).html());	
						//if (event.data.button)
						//	event.data.button.show();
					}catch(e){
						alert(e);
					}
				});
				nodeItem.blur( {resId: this.resourceId, col: i, row:len, button: nodeButton},function(event){
					try{
						var col = event.data.col;
						var row = event.data.row;
						var value = $(this).html();
						var columnFormat = self.columnFormat.get(col) || (self.bottomColumns.get(col) && self.bottomColumns.get(col).format );
						if (columnFormat == cfNilai){	
							self.cells(col, row, parseFloat(value));
							$(this).html(floatToNilai(self.cells(col, row)));
						}else{
							self.cells(col, row, value);
						}
						$(this).css({background:"transparent"});
						self.emit("cellexit", col, row,$(this).html());
						var target = event.explicitOriginalTarget||document.activeElement;
						//if (event.data.button )
						//	event.data.button.hide();
					}catch(e){
						alert(e);
					}
				});
				//$$$(event.data.resId)
				nodeItem.on("keyup", {resId: this.resourceId, col: i, row:len, id:id, node : node }, function(event){
					self.onChange.call(self, event.data.col, event.data.row,$(this).html());
					self.onKeyUp.call(self, event.data.col, event.data.row,$(this).html());
					self.emit("keyup", event.data.col, event.data.row,$(this).html(), event.data.id);
					self.emit("change", event.data.col, event.data.row,$(this).html() );
					console.log("Col " + event.data.col);
					if (self.bottomColumns.get(event.data.col) && self.bottomColumns.get(event.data.col).buttonStyle == bsEllips){
						if (app.listDropDownBox == undefined && $(this).html().length > 2){
							self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
						}else  if (app.listDropDownBox ) {
							var nodeBtn = $(id+"_btn");
							nodeBtn.show();
							self.emit("entrySearch", event.data.col, event.data.row, $(this).html(), function(data){
								if (data.rs.rows.length > 0) {
									self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
									app.listDropDownBox.sg.setData(data, false, 50);
								}
							});
						}
					}else if (self.columns.get(event.data.col) && self.columns.get(event.data.col).buttonStyle == bsEllips){
						if (app.listDropDownBox == undefined && $(this).html().length > 2){
							self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
						}else  if (app.listDropDownBox ) {
							var nodeBtn = $(id+"_btn");
							nodeBtn.show();
							self.emit("entrySearch", event.data.col, event.data.row, $(this).html(), function(data){
								if (data.rs.rows.length > 0) {
									self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
									app.listDropDownBox.sg.setData(data, false, 50);
								}
							});
						}
					}
				});

				nodeItem.on("mouseover", {resId: this.resourceId, col: i, row:len, id:id, node : node }, (event) => {
					this.emit("mouseover",event.data.col, event.data.row, event.data.node );

				});
				nodeItem.on("mouseleave",{resId: this.resourceId, col: i, row:len, id:id, node : node }, (event) => {
					this.emit("mouseleave",event.data.col, event.data.row, event.data.node );
				});
				
				if (i == (values.length - 1)){
					nextId = -1;
				}else {
					if (this.isLastCol(i))
						nextId = -1;
					else 
						nextId = this.nextCol(i);
				}
				
				nodeItem.on("keydown", {resId: this.resourceId, col: i, row:len, prevNode : prevNode, nextId: nextId , id : id }, function(event){
					try{
						//var self = $$$(event.data.resId);
						var col = event.data.col;
						var row = event.data.row;
						var nextId = event.data.nextId;
						self.onKeyDown.call(self, col, row,$(this).html());
						if ((event.keyCode == 9) || (event.keyCode == 13))
						{
							if (nextId != -1){
								$("#" + self.getFullId() +"_row"+row+"_cell"+nextId+"_edit").focus();
							}else {
								if (row < self.getRowCount() - 1){
									row++;
									$("#" + self.getFullId() +"_row"+row+"_cell"+nextId+"_edit").focus();
								}else {
									self.appendRow();
									row++;
									nextId = self.nextCol(-1);/// karena col + 1
									$("#" + self.getFullId() +"_row"+row+"_cell"+nextId+"_edit").focus();
								}
							}
							event.preventDefault();
						}else if (event.keyCode == 27){
							if(event.data.prevNode)
								event.data.prevNode.focus();
							event.preventDefault();
						}else {
							var keyCode = document.all ? event.keyCode: event.which;
							var charCode = document.all ? system.charCode[event.keyCode] : system.charCode[event.which];	
							if (event.charCode === 0){
							}else if (self.columnFormat.get(col) == cfNilai){
								var reg = /\d/;		
								var isFirstN = true ? charCode == '-' && $(this).html().indexOf('-') == -1 && start == 0: false;
								var isFirstD = true ? charCode == ',' && $(this).html().indexOf(',') == -1 : false;
								if (!(reg.test(charCode)) && (!isFirstN) && (!isFirstD))
									event.preventDefault();
							}
						}
						self.emit("keydown", event.data.col, event.data.row, keyCode, event.data.id);
						return true;
					}catch(e){
						alert(e);
					}
				});
				prevNode = nodeItem;
				node.fixBoxModel();
			}
			rowNode.fixBoxModel();
			if (top + 20> this.getClientCanvas().css("height")){
				var frame = this.frame;//$(n + "_frame");												
				frame.scrollTop ( top );    
			}

			if (this.autoPaging && this.rowCount <= this.rowPerPage )
				$("#"+this.getFullId()+"form").append(rowNode);
			else if (!this.autoPaging)
				$("#"+this.getFullId()+"form").append(rowNode);
			
			this.onAppendRow.call(this, len, values);
			if (colIndexFreeze != -1){
				var cloneNode = rowNode.clone(true);
				cloneNode.attr("id",this.getFullId()+"_row"+len+"_clone");
				// cloneNode.css({position:"relative", top:""});
				var rowContainer = cloneNode.children().first();
				rowContainer.attr("id", rowContainer.attr("id")+"_clone");
				// console.log("HTML CLone 1 " + rowContainer.html());
				rowContainer.width("100%");
				var cellNode = rowContainer.children().first().clone();
				cellNode.width("100%");
				cellNode.attr("id",cellNode.attr("id")+"_clone");
				rowContainer.empty();
				rowContainer.append(cellNode);
				
				cloneNode.empty();
				cloneNode.append(rowContainer);
				// console.log("HTML CLone " + cloneNode.html());
				
				cloneNode.appendTo(freezeCanvas);
				freezeCanvas.css({height:top + this.rowHeight + 3});
				
			}
			this.emit("appendRow", values);
			
		}catch(e){
			system.alert(this, "$addRowValues()" + e +"<br>"+ values);
		}
	},
	
	delRow: function(row){
		try{
			var length = this.rowData.getLength();
			if (this.autoPaging)
				row = (this.page - 1) * this.rowPerPage + row;
			var rowObj = this.rowData.get(row);
			this.onDeleteRow.call(this, rowObj, row);
			this.emit("deleteRow", row);
			for (var i=row; i < length;i++){
				if (i < length - 1)
					this.rowData.set(i, this.rowData.get(i+1));
			}
			this.rowData.del(length - 1);
			this.doSelectPage(this.page);
			
			this.onNilaiChange.call(this);
			this.rowCount--;
			this.setTotalPage();
			
		}catch(e){
			error_log(this+"$delRow()"+e);
		}	
	},
	setData: function(data, paging, rowPerPage){
		try{
				this.clear();
				this.data = data;
				if (data.rs == undefined){
					var tmp = { rs : {rows : data , fields : [] }};
					data = tmp;
				}
				this.autoPaging = paging;
				var obj = data;
				var line = '';
				var first = true;
				var title = [];
				if (obj.rs == undefined) 
					return false;
				if (obj.rs.fields)
					var fields = obj.rs.fields;
				else var fields = [];
				var field;
				var tmp = [];
				for (var i=0;i <  obj.rs.rows.length; i++) {
					line = obj.rs.rows[i];
					data = [];
					for (var c in line) {
						if (first) 
							title.push(c);
						if (obj.rs.fields){
							field = fields[c];
							//console.log(c +":"+field);
							if (field != undefined && field.type == "N" || field.type == "real" || field.type == "i" || field.type == "I" || field.type == "decimal" || field.type == "Number") 
								data.push(floatToNilai(parseFloat(line[c])));
							else 
								data.push(line[c]);
						}else data.push(line[c]);;
					}
					tmp.push(data);
					this.appendData(data);
				}
				if (rowPerPage)								
					this.rowPerPage = rowPerPage;
				this.recordCount = this.data.rs.rows.length;
				this.pageCount = Math.ceil(this.recordCount / this.rowPerPage);	
				this.totalPage = this.pageCount;
				$("#"+this.getFullId()+"_navpos").html(this.page+"/"+this.totalPage);			
				//this.selectPage(1);
						
				//this.rearrange(0);
		}catch(e){
			error_log(e);
		}
	},
	setValues: function(values){	
	},
	clear: function(defaultRow){
		try{
			this.onBeforeClear.call(this);
			this.rowData = new arrayMap();
			this.rowCount = 0;
			this.page = 1;
			this.startNumber = 0;
			this.getClientCanvas().empty();
			this.getClientCanvas().css({ scrollTop : 0, scrollLeft : 0 });
			var headerNo = $("#"+this.getFullId()+"_no");
			headerNo.empty();
			headerNo.css({ scrollTop : 0, scrollLeft : 0 });

			if (defaultRow != undefined){
			    this.row = 0;
                this.col = 0; 
				for (var i=0;i < defaultRow;i++){
					this.appendRow();
				}
			}
			//this.setTotalPage();
			$("#"+this.getFullId()+"_freezeForm").empty();
		}catch(e){
			error_log(this+"$clear()"+e);
		}
	},
	calcMaxRowShow: function(){
		var maxRow = 0;
		while (maxRow * 19 < this.getHeight() - 40)
			maxRow++;		
		return maxRow;
	},
	calcMaxColShow: function(){
		return this.maxRowShow;
	},
	getRowTop: function(col, idx){
		try{
			var row = this.rowData.get(col);
			var cell;
			idx++;
			if (row != undefined)
				cell = $("#"+row.getFullId());	
			if (cell != undefined)
				result = cell.position().top - this.frame.scrollTop() + 20;			
		
			return result;
		}catch(e){
			systemAPI.alert(this+"$getRowTop:",e);
		}
	},
	getRowLeft: function(col){
		try{	
			var column = this.columns.get(col);
			var cell = $("#"+column.getFullId());
			result = 0;
			if (cell != undefined)
				result = cell.position().left - this.frame.scrollLeft() + cell.width() + 20;			
	    	return result;
		}catch(e){
			systemAPI.alert(this+"$getRowLeft:",e);
		}
	},
	setCell: function(col, row, value){
		try{
			var colHeader = this.columns.get(col);		
					
			if (colHeader){			
				if (colHeader.buttonStyle == bsAuto && this.checkItem){					
					if (colHeader.pickList.getLength() != 0 ){
						var d,t = value;
						var f = false;
						for (var i in colHeader.pickList.objList){
							d = colHeader.pickList.objList[i];
							if ( d.toLowerCase() == t.toLowerCase()) {
								value = d;
								f = true;
								break;
							}
						}
						if (!f && value != "" ) {
							systemAPI.alert("Data "+value+" tidak ditemukan di list");
							return;
						}						
					}
				}
				/*
				if (this.autoPaging) {					
					var rowData = (this.page - 1) * this.rowPerPage + row;										
					if (this.rowData.get(rowData)) this.rowData.get(rowData)[col] = value;
				}else 
				*/
				//console.log("SetCell "+ row +":"+value);
				if (this.rowData.get(row)){
					var tmp = this.rowData.get(row);
					// console.log("Row "+row +" "+tmp);
					$.each(tmp, function(i, val){

					});
					tmp[col] = value;
					// console.log("RowBecome "+row +" "+tmp);
					this.rowData.set(row, tmp);
				}
			
				//console.log("SetCell rowData :" + this.rowData.getArray() );
				
				
				if (col >= this.columns.getLength()) return false;
				if (row >= this.getRowCount()) return false;	
				
				
				this.value(col, row, value);
				this.emit("change", col, row, value);
			}			
	  }catch(e){
	  	alert(e);
	    systemAPI.alert(this+"$setCell()",e);
	  }
	},
	setHTMLText: function(col, row, value){
		//alert(value);
		$("#"+this.getFullId()+"_row"+row+"_cell"+col+"_edit").html(value);
	},
	upload : function(col, row, node, callback){		
		try{
			var self = this;
			var file_data = $(node).prop('files')[0];   
			var form_data = new FormData();                  
			form_data.append('file', file_data);          
			$.ajax({
						url: 'uploadHandler.php', // point to server-side PHP script 
						dataType: 'json',  // what to expect back from the PHP script, if anything
						cache: false,
						contentType: false,
						processData: false,
						data: form_data,                         
						type: 'post',
						success: function(response){
							if (callback)
								callback();
							var res = response;//JSON.parse(response);
							if (res.tipe == "0") {
								//sukse
								
							}else if (res.tipe == "1") {
								//gagal
								self.emit("change", col, row, " " );
								system.alert(self.getApplication()._mainForm, res.msg);
								
							}
							
						},
						error: function(){
							if (callback)
								callback();
						}
			 });
		}catch(e){
			systemAPI.alert("do Upload",e);
		}	
	},
	viewFrameContent: function(col){
		/*var n = this.getFullId();
		$(n + "_bar"+col).style.display = "none";		
		$(n + "_cellUpload"+col).style.display = "";		
		*/
		this.reinitUpload(col);
	},
	getCellIdValue: function(col, row){
		var column = this.columns.get(col);
		if (column != undefined){
			var text = this.getCell(col,row);
			return column.pickList.indexOf(text);
		}
	},
	getCell: function(col, row){
		return this.rowData.get(row)[col];
	},
	cells: function(col, row, value){
		if (value !== undefined)
			this.setCell(col, row, value);			
		else {				
			if (this.rowData.get(row)) return this.rowData.get(row)[col];		
		}		
		return value;
	},
	value: function(col, row, value){
		if (value !== undefined){
			/*if (this.autoPaging) {					
				var rowData = (this.page - 1) * this.rowPerPage + row;										
				if (this.rowData.get(rowData)) this.rowData.get(rowData)[col] = value;
			}else 
			*/
			
			//if (this.rowData.get(row)) this.rowData.get(row)[col] = value;
			if (this.autoPaging) {					
				row = row - (this.page - 1) * this.rowPerPage ;
			}	
			//console.log("Value Row2: " + row +"::"+value);
			//console.log(this.rowData);
			if (this.columnFormat.get(col) == cfNilai)
				return $("#"+this.getFullId()+"_row"+row+"_cell"+col+"_edit").html(floatToNilai(value) );	
			else if (this.columnFormat.get(col) == cfBoolean){
				var l = this.columnWidth.get(col) / 2 - 6;
				if (value === true || value.toUpperCase() == "TRUE")
					return $("#"+this.getFullId()+"_row"+row+"_cell"+col).html("<div style='position:absolute;top:3px;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
				else return $("#"+this.getFullId()+"_row"+row+"_cell"+col).html("<div style='position:absolute;top:3px;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
			}else 
				return $("#"+this.getFullId()+"_row"+row+"_cell"+col+"_edit").html(value);	
		}else 
			return $("#"+this.getFullId()+"_row"+row+"_cell"+col+"_edit").html();
	},
	getCellDateValue: function(col, row){		
		var value = this.cells(col, row);
		var columns = this.columns.get(col);			
		if (value != ""){
			var tgl = value.split("/");
			if (this.app._dbEng == 'oci8'){
				value = "to_date('"+tgl[2] + "/" + tgl[1] + "/" + tgl[0]+":12:00:00AM','yyyy/mm/dd:hh:mi:ssam')";	
			}else{				
				value = tgl[2]+"-"+tgl[1]+"-"+tgl[0];
			}
		}	
		return value;
	},
	getThnBln: function(col, row){		
		var value = this.cells(col, row);
		var columns = this.columns.get(col);
		if (value != ""){
			var tgl = value.split("/");
			value = tgl[2]+(parseFloat(tgl[1]) < 10 ? "0":"") + parseFloat(tgl[1]);
		}	
		return value;
	},
	doLostFocus: function(){
	},
	setFixColor: function(data){
		this.fixColor = data;
	},
	setFixedCol: function(data){
		this.totFixedCol = data;
	},
	setReadOnly: function(data){
		try{
			this.readOnly = data;
			for (var i = 0; i < this.colCount; i++)
			{
				obj = this.columns.get(i);
				if (obj){		
					obj.setReadOnly(data);
					//obj.refreshCells();
				}
				if (this.bottomColumns.get(i)) 
					this.bottomColumns.get(i).readOnly = data;
			}	
			
		}catch(e){
			systemAPI.alert(this+"$setReadOnly()",e);
		}
	},
	doDblClick: function(sender, colIdx, rowIdx){
		this.onDblClick.call(this, colIdx, rowIdx);
	},
	doClick: function(sender, colIdx, rowIdx){
		this.onClick.call(this, colIdx, rowIdx);
	},
	doSelectCell: function(sender, colIdx, rowIdx){
		this.onSelectCell.call(this, colIdx, rowIdx);
	},
	doEllipsClick: function(sender, colIdx, rowIdx){
		this.onEllipsClick.call(this, colIdx, rowIdx);
	},
	doCellEnter: function(sender, colIdx, rowIdx){
		this.onCellEnter.call(this, colIdx, rowIdx);
	},
	doCellExit: function(sender, colIdx, rowIdx){
		try{
			var colHeader = this.columns.get(colIdx);
			if (this.columnFormat.get(colIdx) == window.cfNilai)
			{		
					var rowObj = this.rowData.objList[rowIdx];						
					var text = rowObj.getCellValue(colIdx);
					if ((text=="")||(text==" ")) text = "0";			
					text = RemoveTitik(text);
					text = text.replace(",",".");
					text = parseFloat(text);
					text = text.toString().replace(".",",");
					text = strToNilai(text);								
			}
			this.onCellExit.call(this, colIdx, rowIdx);
		}catch(e){
			systemAPI.alert(this+"$doCellExit()",e);
		}
	},
	goToRow: function(row){
		this.setRowIndex(row);
		var n = this.getFullId();
		var ros = this.rowData.getLength();
		var detailH = ros * 23;
		var rowPos = row * 23;
		var diff = rowPos / detailH; 
				
	    var header = $("#"+ n + "_header");
	    row = row * 19;
	    var scrollHeight = this.frame.height();	  	    
	    if (this.frame.scrollTop() + scrollHeight - (this.frame.height() - scrollHeight) < row){
			this.frame.scrollTop( this.frame.scrollTop() + ( row + 20) - (this.frame.scrollTop() + scrollHeight) );
		}else if (row < this.frame.scrollTop())
			this.frame.scrollTop( row );
		
	},
	setActiveRow: function(row){
		this.row = row;
	},
	setWidthColNo: function(data){
		this.widthColNo = data;
	},
	swapRow: function(row1, row2){	
		try{
			var app = this.getApplication();			
//----------------------------------------		
			var ellips = this.btnEllips;
			if ((ellips != null))
				ellips.hide();
			var date = this.btnDate;
			if ((date != null))
			{
				date.hide();	
				if (app.systemDatePickerForm != undefined)
					app.systemDatePickerForm.hide();
			}
			var combobox = this.btnDropDown;
			if ((combobox != null))
				combobox.hide();
//-----------------------------------			
			this.onSwap = true;
			var data1 = [];for (var i in this.rowData.get(row1).values) data1[i] = this.rowData.get(row1).values[i];
			var data2 = [];for (var i in this.rowData.get(row2).values) data2[i] = this.rowData.get(row2).values[i];
			for (var i=0;i < this.columns.getLength();i++)
				this.setCell(i,row1, data2[i]);
			for (var i=0;i < this.columns.getLength();i++)
				this.setCell(i,row2, data1[i]);
			this.onSwap = false;
		}catch(e){
			systemAPI.alert(this+"$swapRow()",e);
		}
	},
	validasi: function(){
		this.onNilaiChange.call(this);
	},
	doChange: function(sender, col, row, param1, param2, param3){	
		error_log("Change "+ col);	
		this.onChange.call(this, col, row, param1, param2, param3);
	},
	isEmpty: function(){
		return this.rowData.getLength() == 0;
	},
	appendRow: function(){
		try{
			var values = [];
			for (var i = 0; i < this.columns.getLength();i++)
				values[i] = "";	
			this.addRowValues(values);			
		}catch(e){
			alert(e);
		}
	},
	rowIsEmpty: function(row){
		var isEmpty = true;
		for (var i = 0;i < this.columns.getLength();i++){					
			isEmpty = isEmpty && ( this.cells(i,row) == "" || typeof this.cells(i,row) == "string");			
		}
		//if (this.inplaceEdit.style.display == "" && this.inplaceEdit.value == "") isEmpty = isEmpty && true;
		return isEmpty;
	},
	appendData: function(data){
		if (this.allowBlank){
			this.addRowValues(data);			
		}else{
			this.addRowValues(data);
			/*var lastRow = this.getRowCount();
			if (lastRow == 0 || (lastRow > 0) ){
				this.addRowValues(data);				
			}else if (lastRow > 0 && this.rowIsEmpty(lastRow - 1)){
				var cols = [];
				for (var c = 0; c < this.getColCount(); c++) cols[c] = c;				
				this.editData(lastRow - 1, data,cols);
			}*/
		}

		var i = this.rowData.getLength() - 1;			
		var cnv = $(this.getFullId()+"_no"+i);					
		if (cnv != undefined)
			cnv.html ("<span align='center' style='position:absolute;color:"+system.getConfig("form.grid.fontColor")+"; left : 2; top : 0; width:"+this.widthColNo+"; height:20px;'>"+(parseInt(i,10)+1+this.startNumber).toString()+"</span>");
		this.setTotalPage();
	},	
	insertData: function(row, data){		
		var lastRow = this.getRowCount();
		if (lastRow == 0 ){
			this.addRowValues(data);						
		}else {
			this.appendRow();
			var tmp;
			for (var i = lastRow - 1; i >= row; i--){
				tmp = this.rowData.get(i);
				var cols = [];
				for (var c = 0; c < this.getColCount(); c++) cols[c] = c;
				this.editData(i+1, tmp, cols);
			}
			cols = [];
			for (var c = 0; c < this.getColCount(); c++) cols[c] = c;
			this.editData(row, data, cols);
		}
		var i = this.rowData.getLength() - 1;			
		var cnv = $("#"+this.getFullId()+"_no"+i);					
		if (cnv != undefined)
			cnv.html (  "<span align='center' style='position:absolute;color:"+system.getConfig("form.grid.fontColor")+"; left : 2; top : 0; width:"+this.widthColNo+"; height:20px;'>"+(parseInt(i,10)+1+this.startNumber).toString()+"</span>" );
	},
	editData: function(row,data, col){
		for (var i in data){
			if (col == undefined)			
				this.setCell(i,row,data[i]);
			else this.setCell(col[i],row,data[i]);
		}
	},
	appendDataByRec: function(data, fields){
		try{
			if (!(data instanceof control_arrayMap)) return false;		
			var dataToAppend = [];
			for (var i in fields)
				dataToAppend.push(data.get(fields[i]));
			this.addRowValues(dataToAppend);
			this.rowCount++;
		}catch(e){
			systemAPI.alert(e);
		}
	},
	sort: function(){
	},
	setColTitle: function(data){
		try{
		    if (typeof data == "string") data = data.split(",");
            var colCount = 0, 
                idx = -1,
                colIndex = 0;
			this.title = data;
			if (typeof data[0] === "object") {
				//   console.log("SetCOlTitle Here " + data);
				  this.columnWidth = new arrayMap();
			}
			// console.log("iterate title Here " + this.columnWidth.getArray());
            for (var i=0; i < data.length; i ++){
                if (typeof data[i] == "string"){
                    if (this.columnWidth && this.columnWidth.get(i))
                    	data[i] = {title :data[i], width : this.columnWidth.get(i)};
                   	else {
                   		this.columnWidth.set(i,80);
                   		data[i] = {title :data[i], width : 80};
                   	}
                }
                if (typeof data[i] === "object" && data[i].column){

                   	colCount += data[i].column.length;
					idx = this.setColWidth(idx, data[i]);
					if (data[i].color){
						this.columns.get(i).setHeaderColor(data[i].color);
					}
					
                }else {
                   colCount ++; 
                   if (typeof data[i] === "object"){
					   idx++;
					   if (data[i].color){
							this.columns.get(i).setHeaderColor(data[i].color);
						}
                       this.columnWidth.set(idx, data[i].width);
                   }
                }
				this.columns.get(i).internalIndex = colIndex;
				
			    colIndex = this.columns.get(i).setTitle(data[i], colIndex);
			    colIndex++;
				//this.columns.get(i).setTitle(data[i]);
				if (data[i].freeze)
    		   		this.columns.get(i).setFreeze(data[i].freeze);
             	
            }
            this.initColIndex = -1;
            for (var i=0; i < data.length; i ++){
	            this.initBottomColumns(data[i]);  
	        }
			///alert(JSON.stringify(this.bottomColumns.objList));
			// console.log("COl Resize0nya:" + this.columnWidth.getArray() +":Count COunt = "+this.colCount);
            this.colCount = colCount;
        }catch(e){
            error_log("colTitle:"+e);
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
	    try{	
    	    // if (typeof this.title[0] == "object"){
            //     if (data.column){
            //         for (var i = 0 ; i < data.column.length; i++){
            //              if (data.column[i].column)
            //                 col = this.setColWidth(col, data.column[i]);
            //              else {
            //                  col++;
            //                  this.columnWidth.set(col, data.column[i].width);
            //              }
            //          }
            //     }else if (typeof col == "array") {
            //         for (var i in col){
            //               this.columnWidth.set(col[i], data[i]);
            //               this.columns.get(col[i]).setColWidth(data[i]);
            //         }   
            //     }
            //     return col;
            // }else {     
            //     //this.columnWidth = new arrayMap();
    		
            //     for (var i in col){
            //           this.columnWidth.set(col[i], data[i]);
            //           //this.columns.get(col[i]).setColWidth(data[i]);
            //     }
            //     //this.rearrange(0);
			// }
			if (typeof this.title === "object"){
				// console.log("setColWidth Here " + data.column + ":"+ col +":"+(typeof col));
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
				}else if (Array.isArray(col)) {
					// console.log("setColWidth array  :"+ col +"=>s"+data);
					for (var i in col){
						this.columnWidth.set(col[i], data[i]);
						this.columns.get(col[i]).setColWidth(data[i]);
					}   
				}
				return col;
			}else {		
				this.columnWidth = new arrayMap();
				// console.log("setColWidth " + col);
				for (var i in col){
					  this.columnWidth.set(col[i], data[i]);
					  //this.columns.get(col[i]).setColWidth(data[i]);
				}
			}	
        }catch(e){
            error_log("colWidth : "+e);
        }   
	},
	setColFormat: function(col, data){
		this.columnFormat = new arrayMap();
        for (var i in col){
            this.columnFormat.set(col[i], data[i]);
            //this.columns.get(col[i]).setColumnFormat(data[i]);
        }   
	},
	setColAlign: function(col, data){
		for (var i in col)
			this.columns.get(col[i]).setColumnAlign(data[i]);	
	},
	setNoUrut: function(start){
		if (start == undefined) start = 0;
		var cnv;
		this.startNumber = start;
		var maxLast = this.getRowCount() - (this.getTotalPage() - 1) * this.rowPerPage ;
		//var last = this.page < this.getTotalPage() ? this.rowPerPage : maxLast;

		for (var i=0; i < this.rowPerPage;i++)
		{


			cnv = $("#"+this.getFullId()+"_no"+i);
			if (cnv != undefined){
				if (this.autoPaging && this.page == this.getTotalPage() && i > maxLast-1)
					cnv.html ( "<span align='center' style='position:absolute;text-align:center;color:"+system.getConfig("form.grid.fontColor")+"; left : 2; top : 3; width:"+this.widthColNo+"; height:20px;'>&nbsp;</span>" );
				else 
					cnv.html ( "<span align='center' style='position:absolute;text-align:center;color:"+system.getConfig("form.grid.fontColor")+"; left : 2; top : 3; width:"+this.widthColNo+"; height:20px;'>"+(parseInt(i,10)+1+start).toString()+"</span>" );
			}
			cnv.attr("title", (parseInt(i,10)+1+start).toString() );
		}
	},
	setTop: function(data){
		window.control_saiGrid.prototype.parent.setTop.call(this,data);
	},
	setLeft: function(data){
		window.control_saiGrid.prototype.parent.setLeft.call(this,data);
	},
	doTopLeftOver: function(event){
		//system.showHint(event.clientX, event.clientY,this.pasteEnable ? "Paste Editor":"Setting Layout",true);
	},
	doTopLeftOut: function(event){
		system.hideHint();
	},
	doTopLeftClick: function(){
		try{
			if (this.pasteEnable){
				uses("system_fPaste",true);
				system.showPasteEditor(this);
			}
			
		}catch(e){
			systemAPI.alert(e);
		}
	},
	
	gridToHTML: function(){
		var width=0;
		var th = "<tr bgcolor='#CCCCCC'>";
		for (var i=0;i < this.columns.getLength();i++){
			width += this.columns.get(i).width;
			if (!this.columns.get(i).hideColumn)
				th += "<th class='header_laporan' height='25' width='"+this.columns.get(i).width+"'>"+ this.columns.get(i).title +"</th>";
		}
		th += "</tr>";	
		var tr,html = "<br><br><table width='"+width+"' border='1' cellspacing='0' cellpadding='0' class='kotak'>";
		html += th;	
		for (var i=0;i < this.getRowCount();i++){
			tr = "<tr>";
			for (var c=0;c < this.columns.getLength();c++){
				if (!this.columns.get(c).hideColumn){
					if (this.columnFormat.get(c) == cfNilai)
						tr += "<td height='20' valign='middle' class='isi_laporan' align='right'>"+this.cells(c,i)+"</td>";
					else
						tr += "<td height='20' valign='middle' class='isi_laporan' >&nbsp;"+this.cells(c,i)+"</td>";
				}
			}		
			tr += "</tr>";				
			html += tr;
		}
		html += "</table>";
		return html;
	},
	previewHTML: function(){
		var cnv = $(this.getFullId() + "_iframe");
		if (cnv != undefined)
			cnv.show();		
		var winfram= window.frames[this.getFullId() +"_iframe"];
		winfram.document.open();
		winfram.document.write(loadCSS("server_util_laporan"));
		winfram.document.write(this.gridToHTML());
		winfram.document.close();
	},
	hideFrame: function(){
		$("#"+this.getFullId() + "_iframe").hide();
	},
	useIframe: function(location){
		try{
			var cnv = $("#"+this.getFullId() + "_iframe").get(0);
			if (cnv != undefined){				
				cnv.src = location;				
			}
		}catch(e){
			systemAPI.alert(e, location);
		}		
	},
	print: function(addHeader, outerHtml){
		try{
			var cnv = $("#"+this.getFullId() + "_iframe");			
			//cnv.toggle();			
			if (addHeader == undefined) addHeader = "";
			var winfram= window.frames[this.getFullId() +"_iframe"];			
			if (!this.disableCtrl){
				winfram.document.open();
				winfram.document.write(loadCSS("server_util_laporan"));
				if (outerHtml){
					 winfram.document.write(outerHtml);
				}else{
					winfram.document.write(addHeader);
					winfram.document.write(this.gridToHTML());
				}
				winfram.document.close();			
			}
			winfram.focus();			
			winfram.print();	
			
		}catch(e){
			systemAPI.alert(e);
		}
	},
	ellipsClick: function(event, col, row){
		this.onEllipsClick.call(this, col, row );//this.col,this.row
	},
	dropDownClick: function(event, node, col, row){
		try{	
			var app = this.getApplication();
			var x = node.offset().left;
			var y = node.offset().top + this.rowHeight;

			var colHeader = this.columns.get(col);//this.col				
			var width = this.columnWidth.get(col);//colHeader.width;
			var form = this.getForm();				
			var items = this.bottomColumns.get(col).picklist;
			

			if ((app.dropDownCB == undefined) || (!app.dropDownCB.visible) || (app.dropDownCB.visible && app.dropDownCB.linkCtrl != node)){
				
				
				var owner = this.owner;
					
				while (!(owner.className == "control_childForm") && !(owner instanceof control_commonForm))
					owner = owner.owner;				
				if (app.dropDownCB !== undefined)
					app.dropDownCB.free();
				uses("control_dropDownBox",true);
				app.dropDownCB = new control_dropDownBox(app);//(window.app);			
				var self = this;
				app.dropDownCB.on("select", function(id, title){
					try{
						app.dropDownCB.close();
						self.setCell(col, row, title);	
						node.selectedId = id;		
					}catch(e){
						console.log(e);
					}
				} );
				//app.dropDownCB.onDblClick.set(this, "dropDownBoxDblClick");				
				app.dropDownCB.setItems(items);
				app.dropDownCB.setWidth(width);
				app.dropDownCB.setCtrl(node);
				
				app.dropDownCB.setSelectedId(this.selectedId);
				var scrHeight = app.activeForm.getHeight();
				if ((y + app.dropDownCB.getHeight()) > scrHeight)
				{
					if (document.all)
						app.dropDownCB.setTop(y - 2);
					else
						app.dropDownCB.setTop(y - 1);
				}
				else
					app.dropDownCB.setTop(y);		
				app.dropDownCB.setLeft(x);
				app.dropDownCB.setItemHeight(this.itemHeight);
				app.dropDownCB.show();
				
			}else {
				if (app.dropDownCB.linkCtrl ==  node)
					app.dropDownCB.close();					
				
			} 
		}
		catch (e){
			systemAPI.alert(this+"$dropDownClick()", e);
		}
	},
	dropDownBoxSelect: function(sender, selectedId, caption){
		try{
			window.dropDown.close();
			this.setCell(window.dropDown.col, window.dropDown.row, caption);	
			this.selectedId = selectedId;			
			
		}catch(e){
			systemAPI.alert(this+"$dropDownSelect()", e);
		}
	},
	ellipsDropDownClick: function(event, node, col, row){
		try{	
			var app = this.getApplication();
			var x = node.offset().left;
			var y = node.offset().top + this.rowHeight;

			var colHeader = this.columns.get(col);//this.col				
			var width = this.columnWidth.get(col);//colHeader.width;
			var form = this.getForm();				
			var items = this.bottomColumns.get(col).picklist;
			
			var self = this;
			if ((app.listDropDownBox == undefined) ){//|| (!app.listDropDownBox.visible) || (app.listDropDownBox.visible && app.listDropDownBox.linkCtrl != node)
				
				
				var owner = this.owner;
					
				while (!(owner.className == "control_childForm") && !(owner instanceof control_commonForm))
					owner = owner.owner;				
				if (app.listDropDownBox !== undefined)
					app.listDropDownBox.free();
				uses("control_listDropDown",true);
				app.listDropDownBox = new control_listDropDown(app);//(window.app);			
				
				
				
				app.listDropDownBox.setWidth(400);
				app.listDropDownBox.setHeight(300);
				
			}
			app.listDropDownBox.removeAllListeners();
			app.listDropDownBox.on("dblClick", function(listCol, listRow, value, data){

				self.emit("selectRow", col, row, value, data);
				app.listDropDownBox.hide();
				var id = node.attr("id");
				$(id+"_edit").focus();
		   });
		   
			app.listDropDownBox.setCtrl(node);
			var scrHeight = app.activeForm.getHeight();
			if ((y + app.listDropDownBox.getHeight()) > scrHeight)
			{
				if (document.all)
					app.listDropDownBox.setTop(y - 2);
				else
					app.listDropDownBox.setTop(y - 1);
			}
			else
				app.listDropDownBox.setTop(y);		
			app.listDropDownBox.setLeft(x);
			//app.listDropDownBox.setItemHeight(this.itemHeight);
			app.listDropDownBox.show();
		}
		catch (e){
			console.log(this+"$listDropDownClick()", e);
		}
	},
	dateClick: function(event, col, row, node){
		try{
			
			var pos = node.offset();

			this.col = col;
			this.row = row;
			var x = pos.left;
			var y = pos.top + this.rowHeight;
			

			var app = this.getApplication();
			if (app.systemDatePickerForm == undefined){
				uses("control_datePickerForm");
				app.systemDatePickerForm = new control_datePickerForm(app);
			}    
			app.systemDatePickerForm.onSelect.set(this, "pickerFormSelect");

			app.systemDatePickerForm.setSelectedDate(this.year, this.month, this.day);
			var scrHeight = app.activeForm.getHeight();
			app.systemDatePickerForm.setLeft(x);
			if ((y + app.systemDatePickerForm.getHeight()) > scrHeight){
				y += 15;
				app.systemDatePickerForm.setTop(y - this.getHeight() - app.systemDatePickerForm.getHeight() - 1);
			}else
				app.systemDatePickerForm.setTop(y);
			app.systemDatePickerForm.bringToFront();
			app.systemDatePickerForm.show();
		}catch(e){
			alert(e);
		}
	},
	pickerFormSelect: function(sender, yy, mm, dd){	
		try{
			this.year = yy;
		    this.month = mm;
		    this.day = dd;
		    
		    var month = this.month;

		    if (month < 10)
		        month = "0" + month;
		    var caption = this.day + "/" +month + "/" + this.year;			
			//this.inplaceEdit.value = caption;
			this.setCell(this.col, this.row, caption);
			//this.onChange.call(this, this.col, this.row); 
		}catch(e){
			systemAPI.alert(this+"$pickerSelect()", e);
		}
	},
	doMouseDown: function(event, idx){			
		var colHeader = this.columns.get(idx);
		switch(colHeader.buttonStyle)
		{
			case bsEllips :
					var ellips = this.btnEllips;
					if (ellips != null)
						ellips.show();
					break;
			case bsAuto :
					var combobox = this.btnDropDown;
					if (combobox != null)
						combobox.show();
					break;	
			case bsDate :
					var date = this.btnDate;
					if (date != null)
						date.show();
					break;	
		}	
	},
	doMouseOut: function(idx, row){
		return;		
	},
	doMouseOver: function(idx){
		return;			
	},
	clearTitle: function(){
		this.title = [];
	},
	allRowValid: function(){
		var valid = true;
		for (var r = 0 ;r < this.rowData.getLength();r++){
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
		for (var r = 0 ;r < this.rowData.getLength();r++){
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
	findText: function(text, col, rowKey, isSelf){
		for (var i=0;i < this.getRowCount();i++){
			if (text == this.getCell(col, i) && (rowKey != i && isSelf))
				return true;		
			else if (!isSelf && text == this.getCell(col, i))
				return true;
		}
		return false;
	},
	setBtnReadOnly: function(data){	
		if (this.readOnly){
			this.btnVisible = data;
		}else this.btnVisible = false;
	},
	setRowSelect: function(data){
		this.rowSelect = data;
	},
	setFocusCell: function(col, row ){
		$("#"+this.getFullId()+"_row"+row+"_cell"+col+"_edit").focus();
	},
	setAllowAutoAppend: function(data){
		this.allowAutoAppend = data;
	},
	setColumnReadOnly: function(data, incl, excl){
		for (var i = 0; i < incl.length; i++){
			this.columnReadOnly.set(incl[i],data);
			if (this.bottomColumns.get(incl[i])) 
				this.bottomColumns.get(incl[i]).readOnly = data;
		}
		for (var i = 0; i < excl.length; i++){
			this.columnReadOnly.set(excl[i],!data);
			if (this.bottomColumns.get(excl[i])) 
				this.bottomColumns.get(excl[i]).readOnly = !data;
		}
	},
	setButtonStyle: function(col, btnStyle){		
		for (var i in col) {
			this.columns.get(col[i]).setButtonStyle(btnStyle[i]);
			if (this.bottomColumns.get(col[i]))
				this.bottomColumns.get(col[i]).buttonStyle = btnStyle[i];	
		}
	},
	setPickList: function(col, items){		
		for (var i in col) {
			this.columns.get(col[i]).setPicklist(items[i]);	
			if (this.bottomColumns.get(col[i]))
				this.bottomColumns.get(col[i]).picklist = items[i];
		}
		
	},
	setAllowBlank: function(data){
		this.allowBlank = data;
	},
	setRowNumber: function(start){
	    this.setNoUrut(start);
		/*try{			
			var row, rowObj;
			for (var i=0;i < this.getRowCount();i++){	
				row = $("#"+this.getFullId()+"_no_"+(i+1)+"");
				if (row) row.html( (i  + start) + 1 );
			}
		}catch(e){
			systemAPI.alert(this+"$rowNumber()",e);
		}*/
	},
	setUploadParam: function(col, param1, param2, param3, param4){
		for (var i in col){
			var colObj = this.columns.get(col[i]);				
			if (colObj !== undefined){
				if (param1 !== undefined) colObj.setParam1(param1);
				if (param2 !== undefined) colObj.setParam2(param2);
				if (param3 !== undefined) colObj.setParam3(param3);
				if (param4 !== undefined) colObj.setParam4(param4);			
			}
		}
	},
	setAutoSubmit: function(col, data){
		for (var i in col){
			var colObj = this.columns.get(col[i]);							
			if (colObj !== undefined){
				colObj.setAutoSubmit(data);
			}
		}
	},
	setColHide: function(col, data){
		for (var i in col){
			var colObj = this.columns.get(col[i]);							
			if (colObj !== undefined && data){			
				if (data)
                    colObj.hide();
                else colObj.show();    
			}
		}
	},
	setCellColor: function(col, row, color){
	   //var rowObj = this.rowData.get(row);	
	   //rowObj.setCellColor(col, color);
	   $("#"+this.getFullId()+"_row"+row+"_cell"+col).css({background:color});
    },
    setRowHeight: function(rowHeight, row){
        this.rowHeight = rowHeight;
        if (row){
           var rowObj = this.rowData.get(row);	
    	   rowObj.setHeight(rowHeight); 
    	   row = $("#"+this.getFullId()+"_no"+row);
    	   row.css({ height : rowHeight });
    	   var top = rowObj.top;
    	   for (var i=row+1;i < this.getRowCount();i++){
				rowObj = this.rowData.get(i);			
				rowObj.setTop(top);
				row = $("#"+this.getFullId()+"_no"+i);
				row.css({ top : top + this.headerHeight });
				top += row.height();
	       }
	   }else {
	       var rowObj,top = 0; 
	       for (var i=0;i < this.getRowCount();i++){
				rowObj = this.rowData.get(i);				
				rowObj.setHeight(rowHeight);
				rowObj.setTop(top);
				row = $("#"+this.getFullId()+"_no"+i);
         	    row.css({ height : rowHeight, 
         	    		top : top + this.headerHeight });
				top += rowHeight;
	       }
       }
    },
    setAutoPaging: function(data){
        this.autoPaging = data;
        this.page = 1;        
    },
	setDisableCtrl: function(){		
		this.disableCtrl = true;
		this.setReadOnly(true);
	},
	showInplaceEdit: function(idx, row, top){
		try{
			
		}catch(e){
			alert(e);
		}
	},
	setColHint: function(col, hint){		
		for (var i in col){
			this.columns.get(col[i]).setHint(hint[i]);
		}
	},
	setColColor: function(col, color){		
		for (var i in col){
			this.columns.get(col[i]).setColor(color[i]);
		}
	},
	setColMaxLength: function(col, data){	
		try{	
			for (var i in col){				
				this.columns.get(col[i]).setMaxLength(data[i]);
			}					
		}catch(e){
			alert(e);
		}
	},
	setHeaderColor: function(col, color, fontColor){		
		for (var i in col){
			this.columns.get(col[i]).setHeaderColor(color[i]);
			// this.columns.get(col[i]).setFontColor(fontColor[i]);
			if (this.columns.get(col[i]).freeze){
				this.freezeHeader.children().css({background:color[i], borderRight:"1px solid " + this.columns.get(col[i]).fontColor});
			}
		}
	},
	selectPage: function(page){
		try {			
			if (this.rowPerPage === undefined) throw("");
			this.showLoading();			
			this.clear();			
			var start = (page - 1) * this.rowPerPage;
			var finish = start + this.rowPerPage;
			if (finish > this.recordCount) 
				finish = this.recordCount;
			if (this.data) {
				var line, field;
				var fields = this.data.fieldDesc || this.data.rs.fields;
				this.showLoading();					
				for (var i = start; i < finish; i++) {
					line = this.data.rs.rows[i];
					data = [];
					for (var c in line) {
						field = fields[c];
						if (field && field.type == "N" || field.type == "real") 
							data.push(floatToNilai(parseFloat(line[c])));
						else if (field == undefined){
							if (this.columns.get(data.length - 1).columnFormat === cfNilai)
								data.push(floatToNilai(parseFloat(line[c])));
							else data.push(line[c]);													
						}else 
							data.push(line[c]);													
					}
					this.appendData(data);
				}										
			}
			this.frame.scrollTop(0);
			this.page = page;
			this.setNoUrut(start);
		}catch(e){
			alert(e);
			systemAPI.alert(e);
		} 
	},
	setCheckItem: function(data){
		this.checkItem = data;
	},
	setRowPerPage: function(data){
		this.rowPerPage = data;
		
	},
	getTotalPage: function(data){
		return Math.ceil(this.rowData.getLength() / this.rowPerPage);
	},
	viewRowData: function(index,viewIndex){
		try{
			var self = this;
			var values = this.rowData.get(index);
			
			var col;
			var width = 0;
			for (var i in  this.columnWidth.objList)
			{
				width += this.columnWidth.get(i);
			}
			var len = viewIndex;//this.rowData.getLength();
			var top = viewIndex * this.rowHeight;
			
			var app = this.getApplication();	
			var width = this.cnvHeader.width();
			// console.log("len "+ len +" top "+ top + " " + width);
			// console.log(values);
			//---------------------			
				var headerCanvas = this.cnvNo;//$(this.getFullId()+"_no");
				
				var node = $("#"+this.getFullId()+"_no"+len);
				if ((node != undefined)&&(headerCanvas != undefined))
					node.remove();
				node = $("<div id='"+this.getFullId()+"_no"+len+"'></div>");
				node.css({ background : this.fixColor, 
						height : document.all ? this.rowHeight + 2:this.rowHeight,
						top : top + 2,
						width : this.widthColNo, 
						borderBottom :  window.system.getConfig("3dborder.inner.bottom"), 
						position : "absolute" });	
				node.fixBoxModel();
				var rowNumber  = (len + 1).toString();
				if (this.autoPaging){
					rowNumber = ( this.page - 1) * this.rowPerPage + (len + 1);
				}
				node.html( "<div style='position:absolute;left:0;top:0;width:100%;height:100%;background-image:url(icon/"+system.getThemes()+"/menuselect.png)'><span id='"+this.getFullId()+"_no_"+len+"' align='center' style='position:absolute;text-align:center;color:"+system.getConfig("form.grid.fontColor")+"; left : 0; top : 3; width:"+this.widthColNo+"; height:100%;'>"+rowNumber+"</span></div>" );
				headerCanvas.append(node);
				
			//--------------------						
				var rowNode = $("<div id='"+this.getFullId()+"_row"+len+"'></div>");
				rowNode.css({ height : document.all ? this.rowHeight + 2:this.rowHeight,
						top : top ,
						width : width, 
						overflow: "hidden",
						borderBottom: "1px solid #999",
					//	borderTop: "1px solid #999", 
						position : "absolute" });		
				rowNode.fixBoxModel();
				rowNode.on("mouseover", {row:len, id:this.getFullId()+"_row"+len, node : rowNode }, (event) => {
					rowNode.css({background:"#dedede"});
					$("#" + rowNode.attr("id") +"_clone").css({background:"#dedede"});
				});	
				rowNode.on("mouseleave", {row:len, id:this.getFullId()+"_row"+len, node : rowNode }, (event) => {
					rowNode.css({background:"transparent"});
					$("#" + rowNode.attr("id") +"_clone").css({background:"transparent"});
				});	
				var freezeCanvas = $("#"+this.getFullId()+"_freezeForm");
				var colIndexFreeze = -1;
				for (var i=0; i < this.columns.getLength();i++){
					if (this.columns.get(i).freeze) 
						colIndexFreeze = i;
				}
				var left = 0;
				var prevNode;
				var self = this;
				for (var i = 0; i < values.length; i ++){
					var col = this.columns.get(i);
					
					var id = this.getFullId()+"_row"+len+"_cell"+i;
					node = $("<div id='"+id+"'></div>");
					node.css({ 
						height : "100%",
						width : this.columnWidth.get(i),
						textAlign: this.columnFormat.get(i) == cfNilai ? 'right' : 'left',
						left: left, 
						borderLeft :  "1px solid #999",
						overflow:"hidden",
						whiteSpace: "nowrap",
						position : "absolute" });		
					if (this.columnReadOnly.get(i) === false || (this.bottomColumns.get(i) && this.bottomColumns.get(i).readOnly == false )){ //this.readOnly){//
						//node.attr("contenteditable","true");
						var contenteditable = "contenteditable='true'";
					}else var contenteditable = " ";
						//node.attr("contenteditable","false");
				
					if (this.columnFormat.get(i) == cfNilai){
						var nodeItem = $("<div  id='"+id+"_edit' "+contenteditable+"  style='white-space:nowrap;overflow:hidden;position:absolute;padding-left:3px; padding-right:3px;padding-top:3px;width:"+(this.columnWidth.get(i) - 6)+"px;height:"+(this.rowHeight)+"px;text-align:right'></div>");
						//node.html();
						
						if (values[i] === undefined || values[i] === "")
							nodeItem.html("0");
						else 
							nodeItem.html(floatToNilai(values[i]));
					}else if ((this.bottomColumns.get(i) && this.bottomColumns.get(i).format == cfBoolean) || this.columnFormat.get(i) == cfBoolean){//.this.columnFormat.get(i) 
						var l = this.columnWidth.get(i) / 2 - 6;
						
						if (values[i] === true || values[i].toUpperCase() == "TRUE")
							var nodeItem = $("<div style='position:absolute;top:3px;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
						else var nodeItem = $("<div style='position:absolute;top:3px;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
						
					}else if (this.columnFormat.get(i) == cfUpload){//.this.columnFormat.get(i) 
						var nodeFile = $("<input id='"+id+"_file' type='file' name='files' style='position:absolute;opacity: 0;filter:alpha(opacity:0);width:100%;height:100%' />");
						var nodeAnim = $("<div id='"+id+"_anim' class='loader' style='position:absolute;width:15px;height:15px;left:10px;border-radius:50%;border:5px solid #f3f3f3;border-top:5px solid #3498db' />");
						var nodeItem = $("<div id='"+id+"_edit' style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:absolute;width:"+(this.columnWidth.get(i))+"px;height:"+(this.rowHeight)+"px'>"+
										"<div id='"+id+"_cap' style='position:absolute;width:100%;height:100%;text-align:center;padding-top:5px'>Browse</div> "+
										"</div>");
						nodeItem.append(nodeFile);
						nodeItem.append(nodeAnim);
						nodeAnim.hide();
						
						nodeFile.on("change", {col: i, row: index, id : id}, function(event){
							self.emit("change", event.data.col, event.data.row, $(this).val().replace("C:\\fakepath\\","") );
							$("#"+event.data.id+"_anim").show();
							$("#"+event.data.id+"_cap").hide();
							self.upload(event.data.col, event.data.row, $(this), function(){
								$("#"+event.data.id+"_anim").hide();
								$("#"+event.data.id+"_cap").show();
							});
						});
						
					}else 
						var nodeItem = $("<div id='"+id+"_edit' "+contenteditable+"  style='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:absolute;padding-left:3px; padding-right:3px;padding-top:3px;width:"+(this.columnWidth.get(i) - 6)+"px;height:"+(this.rowHeight)+"px'>"+values[i]+"</div>");
					
					node.append(nodeItem);
					var nodeButton;
					if (this.bottomColumns.get(i) && this.bottomColumns.get(i).buttonStyle){
	
						switch (this.bottomColumns.get(i).buttonStyle){
							case bsAuto: 
								var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer'><i class='fa fa-caret-down' style='position:absolute;top:2;left:-20px;color:#888888;font-size:16px'/></div");
							break;
							case bsEllips:
								var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer;background:#fff'><i class='fa fa-search' style='position:absolute;top:2;left:-20px;color:#888888;font-size:16px'/></div");
							break;
							case bsNone :
							break;
							case bsDate: 
							var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer'><div style='position:absolute;left:-20px;width:100%;height:100%;top:1px;background:white;display:flex;justify-content: center;align-items: center;color:grey'><i class='fa fa-calendar'/></div");
							break;
							case bsEdit: 
								var nodeButton = $("<div id='"+id+"_btn' style='position:absolute;top:0;left:100%;width:20px;height:100%;cursor:pointer'><img src='icon/ic_create_black_24px.svg' width=16 height=16 style='position:absolute;top:2;left:-20px'/></div");
							break;
						}
						nodeButton.on("click", {col:i, row:index, node : node}, function(event){
							event.preventDefault();
							event.stopPropagation();
							if (self.bottomColumns.get(event.data.col).buttonStyle == bsAuto){
								self.dropDownClick(event, event.data.node, event.data.col,event.data.row);
							}else if (self.bottomColumns.get(event.data.col).buttonStyle == bsEllips){
								self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
								//showListData
							}else if (self.bottomColumns.get(event.data.col).buttonStyle == bsDate){
								self.dateClick(event, event.data.col,event.data.row,event.data.node);
								//showListData
							}else {
								self.emit("btnClick", self, event.data.col, event.data.row, nodeButton);
								self.onEllipsClick.call(self, event.data.col, event.data.row);
							}
							
						});
						if (self.bottomColumns.get(i).buttonStyle != bsAuto && self.bottomColumns.get(i).buttonStyle != bsEdit && self.bottomColumns.get(i).buttonStyle != bsDate)
							nodeButton.hide();
						node.append(nodeButton);
					} 
					
					
					node.on("click",{resId:this.resourceId, col:i, row:index, values:values, w : this.columnWidth.get(i), id: id}, function(event){
						try{
							console.log("CLick");
							//event.preventDefault();
							//event.stopPropagation();
							self.prevRow = self.row;
							self.prevCol = self.col;
							self.col = event.data.col;
							self.row = event.data.row;
							var columnFormat = self.columnFormat.get(self.col) ||  (self.bottomColumns.get(self.col) && self.bottomColumns.get(self.col).format );
							var l = event.data.w / 2 - 6;
							var values = event.data.values;
							if (columnFormat == cfBoolean){
								if (values[event.data.col] === "TRUE"){
									values[event.data.col] = "FALSE";
									$(this).html("<div style='position:absolute;top:3;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) 0px 0px no-repeat;'></div>");
								}else{
									values[event.data.col] = "TRUE";
									$(this).html("<div style='position:absolute;top:3;left:"+l+"px;width:13;height:13;background:url(image/themes/dynpro/checkBox.png) -13px 0px no-repeat;'></div>");
								}
							}
							self.onClick.call(self, event.data.col, event.data.row);
							self.emit("cellclick", self, event.data.col, event.data.row, self.rowData.get(event.data.row), event.data.id);
							
						}catch(e){
							alert(e);
						}
					});
					
					
					node.dblclick({resId:this.resourceId, col:i, row:index, id: id, nodeItem: nodeItem }, function(event){
						console.log("double click");
						self.prevRow = self.row;
						self.prevCol = self.col;
						self.col = event.data.col;
						self.row = event.data.row;
						self.onDblClick.call(self, event.data.col, event.data.row);
						self.emit("dblClick",  event.data.col, event.data.row, event.data.nodeItem.html(), self.rowData.get(event.data.row) );
					});
					left += this.columnWidth.get(i);
					rowNode.append(node);
					nodeItem.attr("data", JSON.stringify({col:i, row:index} ) );
					nodeItem.on("paste", function(event){
						event.preventDefault();
						var data = JSON.parse($(this).attr("data"));
						var text = (event.originalEvent || event).clipboardData.getData('text/plain');
						$(this).html(text);
						self.emit("cellpaste", data.col, data.row, text);
						
					});
					nodeItem.focus( {resId: this.resourceId, col: i, row:index, button: nodeButton},function(event){
						try{
							console.log("Focused");
							//var self = $$$(event.data.resId);	
							var col = event.data.col;
							var row = event.data.row;
							var columnFormat = self.columnFormat.get(col) || (self.bottomColumns.get(col) && self.bottomColumns.get(col).format);
							if (columnFormat == cfNilai){
								var val = parseFloat(self.cells(col, row));
								if (isNaN(val))
								$(this).html("0");
								else 
									$(this).html(val);
							}else {
								
							}
							$(this).css({background:"#FAE658"});
							self.emit("cellenter", col, row,$(this).html());	
							//if (event.data.button)
							//	event.data.button.show();
						}catch(e){
							alert(e);
						}
					});
					nodeItem.blur( {resId: this.resourceId, col: i, row:index, button: nodeButton},function(event){
						try{
							var col = event.data.col;
							var row = event.data.row;
							var value = $(this).html();
							var columnFormat = self.columnFormat.get(col) || (self.bottomColumns.get(col) && self.bottomColumns.get(col).format );
							if (columnFormat == cfNilai){	
								self.cells(col, row, parseFloat(value));
								$(this).html(floatToNilai(self.cells(col, row)));
							}else{
								self.cells(col, row, value);
							}
							$(this).css({background:"transparent"});
							self.emit("cellexit", col, row,$(this).html());
							var target = event.explicitOriginalTarget||document.activeElement;
							//if (event.data.button )
							//	event.data.button.hide();
						}catch(e){
							alert(e);
						}
					});
					//$$$(event.data.resId)
					nodeItem.on("keyup", {resId: this.resourceId, col: i, row:index, id:id, node : node }, function(event){
						self.onChange.call(self, event.data.col, event.data.row,$(this).html());
						self.onKeyUp.call(self, event.data.col, event.data.row,$(this).html());
						self.emit("keyup", event.data.col, event.data.row,$(this).html(), event.data.id);
						self.emit("change", event.data.col, event.data.row,$(this).html() );
						if (self.bottomColumns.get(event.data.col) && self.bottomColumns.get(event.data.col).buttonStyle == bsEllips){
							if (app.listDropDownBox == undefined && $(this).html().length > 2){
								self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
							}else  if (app.listDropDownBox ) {
								var nodeBtn = $(id+"_btn");
								nodeBtn.show();
								self.emit("entrySearch", event.data.col, event.data.row, $(this).html(), function(data){
									if (data.rs.rows.length > 0) {
										self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
										app.listDropDownBox.sg.setData(data, false, 50);
									}
								});
							}
						}else if (self.columns.get(event.data.col) && self.columns.get(event.data.col).buttonStyle == bsEllips){
							if (app.listDropDownBox == undefined && $(this).html().length > 2){
								self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
							}else  if (app.listDropDownBox ) {
								var nodeBtn = $(id+"_btn");
								nodeBtn.show();
								self.emit("entrySearch", event.data.col, event.data.row, $(this).html(), function(data){
									if (data.rs.rows.length > 0) {
										self.ellipsDropDownClick(event, event.data.node, event.data.col,event.data.row);
										app.listDropDownBox.sg.setData(data, false, 50);
									}
								});
							}
						}
					});
					
					if (i == (values.length - 1)){
						nextId = -1;
					}else {
						if (this.isLastCol(i))
							nextId = -1;
						else 
							nextId = this.nextCol(i);
					}
					
					nodeItem.on("keydown", {resId: this.resourceId, col: i, row:index, prevNode : prevNode, nextId: nextId , id : id }, function(event){
						try{
							//var self = $$$(event.data.resId);
							var col = event.data.col;
							var row = event.data.row;
							var nextId = event.data.nextId;
							self.onKeyDown.call(self, col, row,$(this).html());
							if ((event.keyCode == 9) || (event.keyCode == 13))
							{
								if (nextId != -1){
									$("#" + self.getFullId() +"_row"+row+"_cell"+nextId+"_edit").focus();
								}else {
									if (row < self.getRowCount() - 1){
										row++;
										$("#" + self.getFullId() +"_row"+row+"_cell"+nextId+"_edit").focus();
									}else {
										self.appendRow();
										row++;
										nextId = self.nextCol(-1);/// karena col + 1
										$("#" + self.getFullId() +"_row"+row+"_cell"+nextId+"_edit").focus();
									}
								}
								event.preventDefault();
							}else if (event.keyCode == 27){
								if(event.data.prevNode)
									event.data.prevNode.focus();
								event.preventDefault();
							}else {
								var keyCode = document.all ? event.keyCode: event.which;
								var charCode = document.all ? system.charCode[event.keyCode] : system.charCode[event.which];	
								if (event.charCode === 0){
								}else if (self.columnFormat.get(col) == cfNilai){
									var reg = /\d/;		
									var isFirstN = true ? charCode == '-' && $(this).html().indexOf('-') == -1 && start == 0: false;
									var isFirstD = true ? charCode == ',' && $(this).html().indexOf(',') == -1 : false;
									if (!(reg.test(charCode)) && (!isFirstN) && (!isFirstD))
										event.preventDefault();
								}
							}
							self.emit("keydown", event.data.col, event.data.row, keyCode, event.data.id);
							return true;
						}catch(e){
							alert(e);
						}
					});
					prevNode = nodeItem;
					node.fixBoxModel();
				}
			
			
			rowNode.fixBoxModel();
			/*
			if (top + 20> this.getClientCanvas().css("height")){
				var frame = this.frame;//$(n + "_frame");												
				frame.scrollTop ( top );    
			}
			*/
			if (colIndexFreeze != -1){
				var cloneNode = rowNode.clone(true);
				cloneNode.attr("id",this.getFullId()+"_row"+len+"_clone");
				var rowContainer = cloneNode.children().first();
				rowContainer.attr("id", rowContainer.attr("id")+"_clone");
				// console.log("HTML CLone 1 " + rowContainer.html());
				rowContainer.width("100%");
				var cellNode = rowContainer.children().first().clone();
				cellNode.width("100%");
				cellNode.attr("id",cellNode.attr("id")+"_clone");
				rowContainer.empty();
				rowContainer.append(cellNode);
				
				cloneNode.empty();
				cloneNode.append(rowContainer);
				// console.log("HTML CLone " + cloneNode.html());
				
				cloneNode.appendTo(freezeCanvas);
				freezeCanvas.css({height:top + this.rowHeight + 3});
				
			}
			$("#"+this.getFullId()+"form").append(rowNode);
		}catch(e){
			error_log(e);
		}
	},
	clearScreen: function(){
		$("#"+this.getFullId()+"form").empty();
		$("#"+this.getFullId()+"_freezeForm").empty();
	},
	doSelectPage: function(page){
		try{
			this.clearScreen();
			var start = (page - 1) * this.rowPerPage;
			var finish = start + this.rowPerPage > this.rowData.getLength() ? this.rowData.getLength() : start + this.rowPerPage;		
			console.log("Page => "+ start +":"+finish);
			for (var i = start; i < finish; i++){	
				this.viewRowData(i, i - start);
			};		
			this.setNoUrut(start);
			this.page = page;
		}catch(e){
			console.log(e);
		}
	},
	nextPage: function(){
		var totPage =  this.getTotalPage();
		if (this.page < totPage) 
			this.doSelectPage(this.page + 1);		
	},
	prevPage: function(){		
		if (this.page > 1) this.doSelectPage(this.page - 1);
	},
	setPasteEnable: function(data){
		this.pasteEnable = data;
		if (data){
			// $("#"+this.getFullId()+"_topLeft").show();
		}else {
			// $("#"+this.getFullId()+"_topLeft").hide();
		}

	},
	setHeaderHeight: function(height){
		this.headerHeight = height;
		$("#"+this.getFullId()+"_header").height(height);		
		$("#"+this.getFullId()+"_no").css({top:height, height: this.height - height - 20});	
		$("#"+this.getFullId()+"_topLeft").height(height);	
		$("#"+this.getFullId()+"_img").css({top:height / 2 - 10});		
		$("#"+this.getFullId()+"form").css({top:height, height: this.height - height - 20});	
		$("#"+this.getFullId()+"_freezeHeader").height(height);		
		$("#"+this.getFullId()+"_freezeContainer").css({ 
				top : this.headerHeight,	
				height : this.height - this.headerHeight
		});
	},
	setTotalPage: function(value, page){
		if (value === undefined)
			this.totalPage = Math.ceil(this.getRowCount() / this.rowPerPage );
		else this.totalPage = value;

		$("#"+this.getFullId()+"_navpos").html(this.page + "/" +this.totalPage);

	},
	setHeight: function(data){
		window.control_saiGrid.prototype.parent.setHeight.call(this, data);
		//$("#"+this.getFullId()+"_spr").css("height", data);	
		$("#"+this.getFullId()+"_nos").css({top:data -  20});
		$("#"+this.getFullId()+"form").css({height: this.height - this.headerHeight - 20});
		frame = $("#"+this.getFullId() + "_freezeContainer");
	    if (frame) frame.css({ height : data - 20 });
	},
	setWidth: function(data){
		window.control_saiGrid.prototype.parent.setWidth.call(this, data);
		$("#"+this.getFullId()+"_trans").css({left:data - 130});
		$("#"+this.getFullId()+"_nav").css({width:data});
	},
	initFreeze: function(){
		if (!this.freezed){
			this.grid.freezeForm.show();
	        this.grid.freezeHeader.show();
	        this.freezed = true;
	        
	    }
	},
	download: function(){
		var data = [];
		 var self = this;
		 console.log(this.bottomColumns.getArray());
		 for (var i=0; i < this.getRowCount(); i++){
			var row = this.rowData.get(i);
			var line = {};
			for (var c = 0; c < this.bottomColumns.getLength(); c++){
				// if (row[c].indexOf("<img") == -1)
					line[c + "." + this.bottomColumns.get(c).title] = row[c];
			}
			data.push(line);
		 }
		this.app.services.download(data,function(data){
			window.open("./server" + data);
		});
	},
    
    addListener: function(event , listener){
        var self = this;
        switch(event){
            case "addBtnClick":{
                    this.appendBtn.unbind("click");
                    this.appendBtn.bind("click",function(e) 
                                    { 
                                        if (!e) e = window.event; 
                                        self.emit("addBtnClick", self,e);
                                    });
                                break;
                }
                break;
            case "copyBtnClick":{
                    this.copyrowBtn.unbind("click");
                    this.copyrowBtn.bind("click",function(e) 
                                    { 
                                        if (!e) e = window.event; 
                                        self.emit("copyBtnClick", self,e);
                                    });
                                break;
                }
                break;
            case "delBtnClick":{
                    this.removeBtn.unbind("click");
                    this.removeBtn.bind("click",function(e) 
                                    { 
                                        if (!e) e = window.event; 
                                        self.emit("delBtnClick", self,e);
                                    });
                                break;
                }
                break;
             case "refreshBtnClick":{
                    this.delAllBtn.unbind("click");
                    this.delAllBtn.bind("click",function(e) 
                                    { 
                                        if (!e) e = window.event; 
                                        self.emit("refreshBtnClick", self,e);
                                    });
                                break;
                }
                break;
            case "downloadBtnClick":{
                    this.downloadBtn.unbind("click");
                    this.downloadBtn.bind("click",function(e) 
                                    { 
                                        if (!e) e = window.event; 
                                        self.emit("downloadBtnClick", self,e);
                                    });
                                break;
                }
                break;
        }
        window.control_saiGrid.prototype.parent.addListener.call(this, event, listener);
    }
});
