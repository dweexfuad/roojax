//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
/* ****************************************BUGS************************************************** 
 * 	saiCBB dan saiCBBL : 
 * 			event: 
 * 			1. langsung selection : ok
 * 			2. selection -> selection cancel form : ok
 * 			3. selection -> new selection : ok
 * 			4. selection -> input text : dataSelection set undefined, bedain antara value dari selectOption dan 
 * 			5. langsung input text: ok
 * 			2. tekan button : cancel form selection 
*/
/*
 * 
 * @param {Object} owner
 */
window.system_fSelectOptions = function(owner){
	try{
		if (owner){
			window.system_fSelectOptions.prototype.parent.constructor.call(this, owner);
			this.className = "system_fSelectOptions";
			this.items = [];
			this.items2 = [];						
			this.isClick = false;
			this.mouseX = 0;
			this.mouseY = 0;
			this.setWidth(450);
			this.setHeight(477);
			this.init();
			this.requester = undefined;
			this.editNama = undefined;
			this.caption = "Select Options";
			this.kode = "";
			this.nama = "";
			this.startFind = 0;
			this.isFilter = false;	
			this.formRequester = undefined;
			this.fields = undefined;
			this.operator = undefined;
			this.filter = "";			
			this.scriptSql = undefined;
			this.scriptSqlCount = undefined;
			this.basicScript = undefined;
			this.basicCountScript = undefined;			
			this.pager = 15;
			this.page = 1;
			this.withBlankRow = false;//						
			this.dbLib = this.app.dbLib;
			this.dbLib.addListener(this);			
			this.onClose.set(this,"doClose");			
			this.dataList = undefined;
		}
	}catch(e){
		systemAPI.alert("[fListData]::contruct:"+e,"");
	}
};
/* 
 * 
 */
window.system_fSelectOptions.extend(window.control_commonForm);
window.system_fSelectOptions.implement({
	doDraw: function(canvas){		
	    var n = this.getFullId(); 
	    var html =  "<div id='"+n+"_frame' style='{border:1px solid #ffffff;position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +                    
						"<div id='" + n + "_sLeftTop' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowLeftTop.png) top left no-repeat; position: absolute; left: -8; top: 0; width: 8; height: 8}' ></div>" +
	                    "<div style='{position: absolute; left: -8; top: 0; width: 8; height: 100%; overflow: hidden;}' >" +
	                        "<div id='" + n + "_sLeft' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowLeft.png) top left repeat-y; position: absolute; left: 0; top: 8; width: 100%; height: 100%}' ></div>" +
	                    "</div>" +
	                    "<div id='" + n + "_sEdgeLeft' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowEdgeLeft.png) top left no-repeat; position: absolute; left: -8; top: 100%; width: 8; height: 12}' ></div>" +
	                    "<div id='" + n + "_sBottomLeft' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowBottomLeft.png) top left no-repeat; position: absolute; left: 0; top: 100%; width: 8; height: 12}' ></div>" +
	                    "<div id='" + n + "_sRightTop' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowRightTop.png) top left no-repeat; position: absolute; left: 100%; top: 0; width: 8; height: 8}' ></div>" +
	                    "<div style='{position: absolute; left: 100%; top: 0; width: 8; height: 100%; overflow: hidden;}' >" +
	                        "<div id='" + n + "_sRight' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowRight.png) top left repeat-y; position: absolute; left: 0; top: 8; width: 100%; height: 100%}' ></div>" +
	                    "</div>" +
	                    "<div id='" + n + "_sEdgeRight' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowEdgeRight.png) top left no-repeat; position: absolute; left: 100%; top: 100%; width: 8; height: 12}' ></div>" +
	                    "<div style='{position: absolute; left: -8; top: 100%; width: 100%; height: 12;}' >" +
	                        "<div id='" + n + "_sBottomRight' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowBottomRight.png) top left no-repeat; position: absolute; left: 100%; top: 0; width: 8; height: 12}' ></div>" +
	                    "</div>" +
	                    "<div style='{position: absolute; left: -8; top: 100%; width: 100%; height: 12; overflow: hidden;}' >" +
	                        "<div id='" + n + "_sBottom' style='{background: url(image/themes/"+system.getThemes()+"/frameShadowBottom.png) top left repeat-x; position: absolute; left: 16; top: 0; width: 100%; height: 100%}' ></div>" +
	                    "</div>" +
						//#90AFBF
	                    "<div id='" + n + "_bg' style='{background: url(icon/"+system.getThemes()+"/bg.png); position: absolute; left: 0; top: 0; width: 100%; height: 477}' "+
						"onMouseDown='system.getResource("+this.resourceId+").eventMouseDown(event)' "+
						"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
						"onMouseUp='system.getResource("+this.resourceId+").eventMouseUp(event)' "+
						">"+
						"<div id = '"+n+"_top' style='{position:absolute;background:url(icon/"+system.getThemes()+"/formHeader.png) repeat;"+
						"left: 0; top: 0; height: 25; width: 427;cursor:pointer;font-family: " + window.system.getConfig("form.titleFontName") + "; font-size: " + window.system.getConfig("form.titleFontSize") + "; font-color: " + window.system.getConfig("form.titleFontColor") + ";}' "+					
						" > <span style='{position:absolute;left:20; top:5; width:100%; height:100%;}'> l i s t d a t a </span></div>"+							
						"<div style='{position:absolute;background:url(icon/"+system.getThemes()+"/rBg.png) no-repeat;"+
						"left: 427; top: 0; height: 25; width: 23;cursor:pointer;}' "+
						"></div>"+				
						
						"</div>" +
	                    "<div id='" + n + "form' style='{position: absolute; left: 0; top: 25; width: 100%; height: 100%;}' ></div>" +
	                    
	                "</div>"+
					"<div id='"+n+"_hidden' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;border:1px solid #ff9900;display:none;}' "+
						"onMouseDown='system.getResource("+this.resourceId+").eventMouseDown(event)' "+
						"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
						"onMouseUp='system.getResource("+this.resourceId+").eventMouseUp(event)' "+
					"></div>";
	    this.setInnerHTML(html,canvas);
		this.blockElm = $(n +"_hidden");
		this.frameElm = $(n +"_frame");
		if (BrowserDetect.browser == "Explorer" && BrowserDetect.version == 6){
			var b1 = $( n +"_sLeftTop");
			var b2 = $( n +"_sLeft");
			var b3 = $( n +"_sEdgeLeft");
			var b4 = $( n +"_sBottomLeft");
			var b5 = $( n +"_sRightTop");
			var b6 = $( n +"_sRight");
			var b7 = $( n +"_sEdgeRight");
			var b8 = $( n +"_sBottomRight");
			var b9 = $( n +"_sBottom");					
			DD_belatedPNG.fixPngArray([b1,b2,b3,b4,b5,b6,b7,b8,b9]);			
		}
	},
	setItems: function(items, items2){
	},
	centerize: function(){    
		var screenWidth = system.screenWidth;
	    var screenHeight = system.screenHeight;
	    this.setLeft(parseInt((screenWidth - this.width) / 2, 10));
	    this.setTop(parseInt((screenHeight - this.height) / 3, 10));
	},
	setLabels: function(data){
		this.sg.clear(1);	
		if (data == undefined)
			data = this.fields;		
		var script, top = 20;
		for (var i in this.p1.childs.objList) 
			if (!(system.getResource(i) instanceof control_imageButton))
				system.getResource(i).free();
		for (var i in data){			
			script = "this.e"+i+" = new control_saiLabelEdit(this.p2);";
			script += "this.e"+i+".setBound(10,"+top+",this.width - 20, 20);";
			script += "this.e"+i+".setCaption('"+data[i]+"');";
			script += "this.e"+i+".setText('');";
			script += "this.e"+i+".onKeyPress.set(this, 'editKeyPress');";
			script += "this.e"+i+".onKeyDown.set(this, 'doEditKeyDown');";
			eval(script);
			top += 23;
		}		
		this.e0.setWidth(this.width - 48);
		this.p2.setHeight(top + 3);
		this.sg2.setColTitle(data);
		this.sg2.refreshLayout();		
		this.pButton2.setTop(this.p2.top + this.p2.height);
		this.sg2.setTop(this.pButton2.top + this.pButton2.height);
		this.sg2.setHeight(this.height - this.sg2.top - 30 - this.pStatus2.height);
	
	},
	showForm : function(withBlank){
		try{			
			system.addMouseListener(this);
			this.withBlankRow = withBlank;		
			this.showModal();
			this.nama = "";
			this.kode = "";			
			this.centerize();
			this.setVisible(true);
			this.bringToFront();
			this.startFind = 0;
			var tmp = this.dbLib.getRowCount(this.scriptSqlCount, this.pager);						
			this.sgNav2.setTotalPage(tmp);
			this.sgNav2.rearrange();
			this.sgNav2.setButtonStyle(3);		
			this.basicScript = this.scriptSql;
			if (this.basicScript.search("order by") != -1){
				var pos = this.basicScript.search("order by");
				this.basicScript = this.basicScript.substr(0,pos);
			}				
			this.sg2.clear();			
			this.page = 1;
			this.pageCount = tmp;
			this.dbLib.listDataObjA(this.basicScript +" order by "+this.fields[0], 1,this.pager, undefined, this);														
			this.basicCountScript = this.scriptSqlCount;		
			this.eStatus2.setCaption("Page 1 of "+this.pageCount);
			if (this.pageCount > 0)
			{
				if (this.sgNav2.imgBtn1 != undefined)
					this.sgNav2.setSelectedPage(this.sgNav2.imgBtn1);
			}			
			this.getApplication().setActiveForm(this);
			if (this.requester.className == "control_saiGrid") {				
				var line,data;	
				if (this.requester.cells(this.linkGridCell.col,this.linkGridCell.row) == "") this.sg.clear(1); else this.sg.clear();
				data = 	this.requester.cells(this.linkGridCell.col,this.linkGridCell.row);
				if (data != "") {
					data = data.split(",");
					for (var i = 0; i < data.length; i++) {						
						this.sg.appendData(["=",data[i],"-"]);
					}
				}
			}else if (this.requester.className == "control_saiCBB" || this.requester.className == "control_saiCBBL"){
				var line,data;				
				if (this.requester.dataSelection) this.sg.clear(); else{
					this.sg.clear(1);
					return;
				}
								
				for (var i = 0; i < this.requester.dataSelection.length; i++) {
					line = this.requester.dataSelection[i];	
					if (line.tipe) this.sg.appendData([line.tipe,line.value1,line.value2]);
				}
			}
		}catch(e){
			systemAPI.alert(this+"::"+e,"Error Data");
		}
	},
	hide: function(){	
		this.setVisible(false);
		if (this.requester != undefined){
			this.requester.doSetFocus();
			if (this.formRequester.className == "control_childForm")
				this.getApplication().setActiveForm(this.formRequester.getForm());
			else this.getApplication().setActiveForm(this.formRequester);
			this.formRequester.unblock();
		}
	},
	doSysMouseUp: function(x, y, button, buttonState){
		window.system_fSelectOptions.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
		this.isClick = false;
		this.blockElm.style.display = "none";
		this.frameElm.style.display = "";
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.system_fSelectOptions.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
		if (this.isClick)
		{					
			var newLeft = this.left + (x - this.mouseX);
			var newTop = this.top + (y - this.mouseY);		
			if (newLeft < 0) newLeft = 0;			
			if (newLeft + this.width > system.screenWidth) newLeft = system.screenWidth - this.width;
			if (newTop < 0) newTop = 0;
			if (newTop + this.height > system.screenHeight) newTop = system.screenHeight - this.height;
			this.setLeft(newLeft);
			this.setTop(newTop);			
			this.mouseX = x;
			this.mouseY = y;		
		}
	},
	eventMouseDown: function(event){
		this.mouseX = event.clientX;
	    this.mouseY = event.clientY;
		
		this.isClick = true;
		this.blockElm.style.display = "";
		this.frameElm.style.display = "none";
	},
	eventMouseUp: function(event){
		this.isClick = false;
		this.blockElm.style.display = "none";
		this.frameElm.style.display = "";
	},
	eventMouseMove: function(event){
		if (this.isClick){
			var x = event.clientX;
			var y = event.clientY;
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			var newLeft = this.left + (x - this.mouseX);
			var newTop = this.top + (y - this.mouseY);
			this.setLeft(newLeft);
			this.setTop(newTop);
			this.mouseX = x;
			this.mouseY = y;
		}
	},
	doClick: function(sender){
		try{			
			if (sender == this.b12)
			{				
				this.sg.setCell(this.sg.col,this.sg.row, this.sg2.cells(0,this.sg2.row));								
				this.pSelection.show();
				this.pListData.hide();
				this.setActiveControl(this.sg);
			}else if (sender == this.b22) {
				this.pSelection.show();
				this.pListData.hide();
				this.setActiveControl(this.sg);
				
			}else if (sender == this.b1){
				this.close();				
			    if (this.formRequester.className == "control_childForm")
					this.getApplication().setActiveForm(this.formRequester.getForm());
				else this.getApplication().setActiveForm(this.formRequester);
				this.requester.setFocus();							
				var data = [], value = "";
				for (var i = 0; i < this.sg.getRowCount(); i++) {					
					data[data.length] = {
						tipe: this.sg.cells(0, i),
						value1: this.sg.cells(1, i),
						value2: this.sg.cells(2, i)
					};
					if (i > 0) value += ",";
					value += this.sg.cells(1, i);
				}
				this.requester.dataSelection = data;
				this.requester.dataFilter = this.getFilterStr(data);
				if (this.requester.className == "control_saiGrid"){
					this.requester.cells(this.linkGridCell.col,this.linkGridCell.row,value);
				}else if (this.requester.className == "control_saiCBB" || this.requester.className == "control_saiCBBL"){					
					if (this.sg.cells(1,0) != ""){
						this.requester.setText(this.sg.cells(1,0));
					}					
				}else if (this.formRequester.doModalResult) this.formRequester.doModalResult("loadData",window.mrOk, this.requester);
				this.formRequester.setActiveControl(this.requester);									
            }else if (sender == this.b2){
				this.close();
				this.formRequester.setActiveControl(this.requester);
			}			
		}catch(e){
			systemAPI.alert("[GUI fListData] :: doClick :" + e,"");
		}
	},
	setCaption: function(data){
		var canvas = $(this.getFullId() +"_top");
		if (canvas != undefined)
			canvas.innerHTML = "<div style='{positon:absolute; left: 2; top : 4; background:url(icon/"+system.getThemes()+"/folder.png) no-repeat;width:18;height:16;}'> </div>"+"<span style='{align:center;position:absolute;left:20; top: 4;"+
				"width:100%; height:100%;}'>"+data+"</span>";
		this.caption = data;
	},
	init: function(){
		try{		    
			uses("control_saiGrid;control_sgNavigator",true);			
			this.pSelection = new control_panel(this,{bound:[0,0,this.width, this.height - 25]});
			this.p1 = new control_panel(this.pSelection,{bound:[0,5,449,45],border:1,caption:"Selection"});					
			this.pButton = new control_panel(this.pSelection,{bound:[0,0,449,24],border:0,});									
			this.sg = new control_saiGrid(this.pSelection,{bound:[1,27,447,413],colCount:3,colTitle:["Type","Value1","Value2"],colWidth:[[2,1,0],[150,150,80]],
				rowCount:1, buttonStyle:[[0,1,2],[bsAuto, bsEllips, bsEllips]], ellipsClick:[this,"doEllipseClick"],selectCell:[this,"doSelectCell"]});
			this.sg.columns.get(0).setPicklist(new control_arrayMap({items:["=","Range","like"]}));//"<=","<",">",">=",
			this.b1 = new control_imageButton(this.pButton,{bound:[10,2,22,22],click:[this,"doClick"],hint:"Ok",image:"icon/"+system.getThemes()+"/bOk.png"});
			this.b2 = new control_imageButton(this.pButton,{bound:[31,2,22,22],click:[this,"doClick"],hint:"Cancel",image:"icon/"+system.getThemes()+"/bCancel.png"});
			this.sgNav =  new control_sgNavigator(this.pButton,{bound:[53,0,this.pButton.width - 55,24],grid:this.sg,border:0,pager:[this,"doSelectedPage"], buttonStyle:bsTrans});			
		    this.pSelection.setTabChildIndex();	
			
			uses("control_saiLabelEdit;control_saiGrid;control_sgNavigator");			
			this.pListData = new control_panel(this,{bound:[0,0,this.width, this.height - 25],visible:false});
			this.p2 = new control_panel(this.pListData,{bound:[0,5,449,45],border:1,caption:"Search"});							     	
			this.b32 = new control_imageButton(this.p2,{bound:[413,20,22,22],click:[this,"doFind"],image:"icon/"+system.getThemes()+"/bOk.png",hint:"Klik untuk cari data"});												
			this.pButton2 = new control_panel(this.pListData,{bound:[0,75,449,24],border:0});						
			this.sg2 = new control_saiGrid(this.pListData,{bound:[1,100,447,320],dblClick:[this,"doDblClick"],selectCell:[this,"doSelectCell"],
				readOnly:true,rowSelect:true});						
			this.sg2.setAllowAutoAppend(false);			
			this.b12 = new control_imageButton(this.pButton2,{bound:[10,2,22,22],click:[this,"doClick"],hint:"Select Row",image:"icon/"+system.getThemes()+"/bOk.png"});						
			this.b22 = new control_imageButton(this.pButton2,{bound:[31,2,22,22],click:[this,"doClick"],hint:"Cancel",image:"icon/"+system.getThemes()+"/bCancel.png"});						
			this.sgNav2 =  new control_sgNavigator(this.pButton2,{bound:[53,0,297,24],grid:this.sg2,border:0,pager:[this,"doSelectedPage"],buttonStyle:3});			
			this.pStatus2 = new control_panel(this.pListData,{bound:[0,this.height - 50,449,25]});							    
			this.eStatus2 = new control_label(this.pStatus2,{bound:[20,2,300,19],caption:"Page: ;TotalPage: ;"});		    
			this.pListData.setTabChildIndex();	
		}catch(e){
			systemAPI.alert("[fListData2]::init:"+e,step);
		}
	},
	setDataFromItems: function(){	
	},
	editKeyPress: function(sender){
		this.startFind = 0;
	},
	doEditKeyDown: function(sender, keyCode, buttonState){
		if (keyCode == 13)
			this.b32.click();
	},
	doKeyDown: function(charCode, buttonState,keyCode,event){   
	    try{
    		if (keyCode == 13 && this.activeControl == this.sg2){ 
    			this.b12.click();
    			return false;
    		}			
			if (keyCode == 27){
                 this.b2.click();
                 return false;
            }            
    		if (this.activeControl == this.sg2){
    		      switch(keyCode){
    		          case 38 :
    		              if (this.sg2.row == 0){		               
                                this.sgNav2.leftBtn.click();
                                return false;
                          }
    		          break;
    		          case 40:
    		             if (this.sg2.row == (this.pager  - 1)){
                                this.sgNav2.rightBtn.click();
                                return false;
                          } 
    		          break;
                  }
            }
            return window.system_fSelectOptions.prototype.parent.doKeyDown.call(this, charCode, buttonState, keyCode,event);
        }catch(e){
            alert(e);
        }
	},
	setRequester: function(formReq, req, row, col, isFilter, editNama){
		try {
			this.requester = req;
			this.formRequester = formReq;
			this.isFilter = isFilter;
			this.editNama = editNama;			
			if (req.className == "control_saiGrid"){
				this.linkGridCell = {col:col, row:row};
			}
		}catch(e){
			alert(e);
		}	
	},
	doDblClick: function(sender, colIdx, rowIdx){		
		this.doClick(this.b12);
	},
	doSelectCell: function(sender, colIdx, rowIdx){
		try{
			if (sender == this.sg2){
				this.e0.setText(this.sg2.getCell(0, rowIdx));
				this.startFind = rowIdx + 1;	
			}else {				
				if (colIdx == 2){
					if (sender.cells(0,rowIdx) == "=") {
						sender.columns.get(2).setButtonStyle(bsNone);
						sender.cells(2,rowIdx,"-");
					}else sender.columns.get(2).setButtonStyle(bsEllips);
				}
			}				
		}catch(e){
			alert(e);
		}
	},
	doFind: function(sender){
		try{
			var child;
			var text = ""; 
			for (var i in this.p2.childs.objList){
				child = system.getResource(i);
				if (child !== undefined && child instanceof control_saiLabelEdit && child.getText() != ""){
					text = child.getText();
					break;
				}
			}
			var value;
			var i = 0;		
			if (text != ""){
		  		for (i = this.startFind; i < this.sg2.rows.getLength(); i++){
		  			for (var j in this.sg2.columns.objList){		  		  				
						value = this.sg2.getCell(j,i);
						value = value.toLowerCase();
						text = text.toLowerCase();
						if (value.search(text) != -1)  {
							this.startFind = i + 1;
							this.sg2.goToRow(i);								
							return value;
						}
		  			}
		  		}
		  	}
			var script = "";
			var filter = "";
			for (var i in this.fields){		
				if (this.app._dbEng == 'oci8'){						
					if ( i > 0)
						script += "filter += \"and( lower(\" + this.fields["+i+"] +\") like '\" +this.e"+i+".getText().toLowerCase() +\"%')\"; ";			
					else
						script += "filter += \"( lower(\" + this.fields["+i+"] +\") like '\" +this.e"+i+".getText().toLowerCase() +\"%')\";";
				}else {
					if ( i > 0)
						script += "filter += \"and( \" + this.fields["+i+"] +\" like '\" +this.e"+i+".getText() +\"%')\"; ";			
					else
						script += "filter += \"( \" + this.fields["+i+"] +\" like '\" +this.e"+i+".getText() +\"%')\";";
				}
			}								
			eval(script);			
			filter = filter.replace(/\*/gi,"%");						
			
			this.filter = " "+this.operator+" (" + filter +")";
			this.scriptSql = this.basicScript +" "+this.filter ;
			this.scriptSqlCount = this.basicCountScript+" "+this.filter;
			this.sg2.clear();
			this.dbLib.listDataObjA(this.scriptSql +" order by "+this.fields[0], 1,this.pager, undefined, this);							
			this.pageCount = this.dbLib.getRowCount(this.scriptSqlCount, this.pager);		
			this.sgNav2.setTotalPage(this.pageCount);
			this.sgNav2.rearrange();
			this.sgNav2.setButtonStyle(3);
			this.eStatus2.setCaption("Page 1 of "+this.pageCount);			
			this.startFind = 0;
		}catch(e){
			systemAPI.alert("[GUI fListData]::doFind :" + e,"");
		}
	},
	doRequestReady: function(sender, methodName, result, callObj, connection){		
		try{	
			if (callObj != this) return;
			switch(methodName)
			{
				case "listDataObj" :
					if (result instanceof control_arrayMap){				
						this.sg2.setData(result);												
						if (this.withBlankRow){					    						
		                      this.sg2.addRowValues(['-','-']);
						}
						this.getApplication().setActiveForm(this);
						this.sg2.setNoUrut((this.page - 1) * this.pager);
						if (this.sg2.rows.getLength() > 0){
    						this.sg2.col  = 0;
    						this.sg2.row  = 0;
    						this.sg2.rows.get(0).eventClick(undefined,0);
    						this.e0.setText("");
						}
                        //this.setActiveControl(this.sg);
					}else throw(result);
				break;
			}		
		}catch(e){
			systemAPI.alert("[doRequestReady]"+e);
		}
	},
	doSelectedPage: function(sender, page){
		this.sg2.clear();
		this.dbLib.listDataObjA(this.scriptSql +" order by "+this.fields[0], page,this.pager, undefined, this);					
		this.eStatus2.setCaption("Page "+page+" of "+this.pageCount);				
		this.page = page;
	},
	setScriptSql: function(sql, sql2){
		if (sql.search("order by") != -1){
			var pos = sql.search("order by");
			sql = sql.substr(0,pos);
		}				
		this.scriptSql = sql;
		this.scriptSqlCount = sql2;
	},
	doTimer: function(){
		window.clearTimeout(this.interval);
	},
	setFields: function(fields, operator){	
		this.fields = fields;
		this.operator = operator;
		this.filter = "";
	},
	doClose: function(sender){
		system.delMouseListener(this);		
	},
	doEllipseClick: function(sender, col, row){
		this.pSelection.hide();
		this.pListData.show();
		this.setActiveControl(this.sg2);
	},
	getFilterStr: function(dataSelection){
		var data,tmp,filter = new control_arrayMap();
		filter.set("=",[]);
		filter.set("range",new control_arrayMap());
		filter.set("like",new control_arrayMap());					
		for (var i in dataSelection){
			data = dataSelection[i];
			if (data.tipe.toLowerCase() == "="){
				tmp = filter.get("=");
				tmp[tmp.length] = "'" + data.value1+"'";
				filter.set("=",tmp);
			}else if (data.tipe.toLowerCase() == "range"){
				tmp = filter.get("range");
				tmp.set(data.value1, " between '"+data.value1+"' and '"+data.value2+"' ");
				filter.set("range",tmp);
			}else if (data.tipe.toLowerCase() == "like"){
				tmp = filter.get("like");
				tmp.set(data.value1, " like '"+data.value1+"%' ");
				filter.set("like",tmp);
			}
		}
		return filter;
	}
});
