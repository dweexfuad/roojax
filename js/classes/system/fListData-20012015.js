//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.system_fListData = function(owner){
	try{
		if (owner){
			this.formWidth = 450;
			this.formHeight = 477;
			window.system_fListData.prototype.parent.constructor.call(this, owner);
			this.className = "system_fListData";
			this.maximize();
			this.items = [];
			this.items2 = [];						
			this.isClick = false;
			this.mouseX = 0;
			this.mouseY = 0;
			this.caption = "l i s t d a t a";
			this.kode = "";
			this.nama = "";
			this.startFind = 0;
			this.isFilter = false;	
			this.filter = "";						
			this.pager = 15;
			this.page = 1;
			this.withBlankRow = false;//						
			this.dbLib = this.app._dbLib;
			this.dbLib.addListener(this);			
			this.onClose.set(this,"doClose");
			
			this.init();
			this.setShadow("raised");
		}
	}catch(e){
		systemAPI.alert("[fListData]::contruct:"+e,"");
	}
};
window.system_fListData.extend(window.commonForm);
window.system_fListData.implement({
	doDraw: function(canvas){		
	    var n = this.getFullId(); 
	    var html =  "<div id='"+n+"_bg' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background:rgba(255,255,255,0);}' ></div>"+
					"<div id='"+n+"_frame' style='{border:1px #ffffff solid;background:#fff;;position: absolute; left: 0; top: 0; width: "+this.formWidth+"; height: "+(this.formHeight + 25).toString()+";overflow:hidden;}' >" +
						"<div id = '"+n+"_header' style='position:absolute;"+
						"left: 0; top: 0; height: 25; width: "+(this.formWidth).toString()+";cursor:pointer;background:#0099cc' "+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDown(event)' "+						
						" > </div>"+							
						"<div style='{position:absolute;background:url(icon/"+system.getThemes()+"/rBg.png) no-repeat;"+
						"left: "+(this.formWidth - 23).toString()+"; top: 0; height: 25; width: 23;cursor:pointer;}' "+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDown(event)' "+						
						"></div>"+				
						"<div id = '"+n+"form' style = 'position:absolute;left: 0; top: 25; height: "+(this.formHeight - 25).toString()+"px; width: "+this.formWidth+";}'"+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDownForm(event)' "+						
						"> </div>"+
					"</div>"+
					"<div id='"+n+"_hidden' style='{position: absolute; left: 0; top: 0; width: "+this.formWidth+"; height: "+this.formHeight+";border:1px solid #0099cc;display:none;}' "+						
					"></div>";
	    this.setInnerHTML(html,canvas);
	    canvas.bind("mousemove",setEvent("$$$(" + this.resourceId + ").eventMouseMove(event);") );
		canvas.bind("mouseup",setEvent("$$$(" + this.resourceId + ").eventMouseUp(event);") );
		
		this.blockElm = $("#"+ n +"_hidden");
		this.frameElm = $("#"+ n +"_frame");
	},
	show: function(x, y){
		window.system_fListData.prototype.parent.show.call(this);
		this.frameElm.css({
			left : this.width / 2 - (this.formWidth / 2),
			top  : this.height / 2 - (this.formHeight / 2),					
			color : "#0099cc",
			border : "1px solid #0099cc",
			backgroundColor : "#fff" });	
		this.blockElm.css({
			left : this.width / 2 - (this.formWidth / 2),
			top  : this.height / 2 - (this.formHeight / 2)
			});
	    this.formRequester = this.getApplication()._mainForm;
		this.sg.clear();
		this.page = 1;
		this.filter = "";
		system.addMouseListener(this);
		
		if ( this.scriptSql.indexOf("rowindex") > 1){
			this.pager = 10000;
			this.orderBy = "rowindex";
		}else {
			this.orderBy = this.fields[0];
			this.pager = 15;
		}
		this.pageCount = this.dbLib.getRowCount(this.scriptSqlCount, this.pager);
		
		this.dbLib.getDataProviderPageA(this.scriptSql +" order by "+this.orderBy, 1,this.pager);					
	},
	setItems: function(items, items2){
	},
	centerize: function(){    
		var screenWidth = system.screenWidth;
	    var screenHeight = system.screenHeight;
	    //this.setLeft(parseInt((screenWidth - this.formWidth) / 2, 10));
	    //this.setTop(parseInt((screenHeight - this.formHeight) / 3, 10));
	},
	doSizeChange: function(w, h){
		this.getCanvas().fixBoxModel();
		{
			this.frameElm.css({left : w / 2 - (this.formWidth / 2), top:h / 2 - (this.formHeight / 2) });
		}
	},
	hide: function(){	
		this.setVisible(false);
		if (this.requester != undefined){
			this.requester.doSetFocus();
			if (this.formRequester.className == "childForm")
				this.getApplication().setActiveForm(this.formRequester.getForm());
			else this.getApplication().setActiveForm(this.formRequester);
			this.formRequester.unblock();
		}
		system.delMouseListener(this);
	},
	doClick: function(sender){
		try{
			if (sender == this.bFirst){
				this.page = 1;
				this.dbLib.getDataProviderPageA(this.scriptSql + this.filter +" order by "+this.orderBy, 1,this.pager);					
			}else if (sender == this.bPrev){
				if (this.page > 1){
					this.page--;
					this.dbLib.getDataProviderPageA(this.scriptSql + this.filter +" order by "+this.orderBy, this.page,this.pager);					
				}
			}else if (sender == this.bNext){

				if (this.page < this.pageCount){
					this.page++;
					this.dbLib.getDataProviderPageA(this.scriptSql + this.filter +" order by "+this.orderBy, this.page,this.pager);					
				}
			}else if (sender == this.bLast){
				this.page = this.pageCount;
				this.dbLib.getDataProviderPageA(this.scriptSql + this.filter +" order by "+this.orderBy, this.page,this.pager);					
				
			}else if (sender == this.b1)
			{
				this.close();					
				if (this.formRequester.className == "control_childForm")
					this.getApplication().setActiveForm(this.formRequester.getForm());
				else this.getApplication().setActiveForm(this.formRequester);
				var data  = [];
				for (var i = 0; i < this.sg.columns.getLength();i++)
					data[data.length] = this.sg.cells(i,this.sg.row);	

				this.requester.dataFromList = data;							
				if (this.requester.className == "control_saiCBBL"){								
					this.requester.setText(data[0]);
					this.requester.setRightLabelCaption(data[1]);
					if (this.editNama !== undefined) this.editNama.setText(data[1]);
					this.requester.setFocus();
				} else
				if (this.requester.className == "control_saiCBB"){								
					this.requester.setText(data[0]);					
					if (this.editNama !== undefined) this.editNama.setText(data[1]);
					this.requester.setFocus();
				} else
				if ((this.requester.className == "control_saiGrid") && (!this.isFilter)){
					this.requester.setCell(this.requester.col,this.requester.row,data[0]);
					this.requester.setCell(this.requester.col+1,this.requester.row,data[1]);			
					this.requester.setFocusCell(this.requester.col,this.requester.row);
				}else
				if ((this.requester.className == "control_saiGrid") && (this.isFilter)){
					this.requester.setCell(this.requester.col,this.requester.row,data[0]);				
					this.requester.setFocusCell(this.requester.col,this.requester.row);
				}else
				if ((this.requester.className == "control_saiLabelEdit")||(this.requester.className == "control_saiEdit")){
					this.requester.setText(data[0]);
					this.requester.setFocus();
					if (this.editNama !== undefined) this.editNama.setText(data[1]);
				}	
				this.formRequester.setActiveControl(this.requester);												
			}else if (sender == this.b2) {
				this.close();					
			    if (this.formRequester.className == "control_childForm")
					this.getApplication().setActiveForm(this.formRequester.getForm());
				else this.getApplication().setActiveForm(this.formRequester);
				this.requester.setFocus();
				if ((this.requester.className == "control_saiGrid")){
					this.requester.setFocusCell(this.requester.col,this.requester.row);
				}
				this.formRequester.setActiveControl(this.requester);									
            }
			
		}catch(e){
			error_log("[GUI fListData] :: doClick :" + e);
		}
	},
	init: function(){
		try{		    
			uses("saiLabelEdit;saiTreeGrid;control_column",true);
			this.e0 = new saiLabelEdit(this,{bound:[5,5,this.formWidth -10, 20],caption:"Kode", keyDown:[this, "doEditKeyPress"], placeHolder:true});
			this.e1 = new saiLabelEdit(this,{bound:[5,28,this.formWidth -10, 20],caption:"Nama", keyDown:[this, "doEditKeyPress"], placeHolder:true});
			this.sg = new saiTreeGrid(this,{bound:[3,50,this.formWidth - 9,this.formHeight-93],readOnly:true, headerHeight:20, colCount:2,rowSelect:true, rowPerPage:15,dblClick:[this,"doDblClick"], selectCell:[this,"doSelectCell"], pager:[this,"doSelectedPage"]});
			this.b1 = new button(this,{bound:[10,this.formHeight - 32,80,22], click:[this,"doClick"], caption:"OK", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff"});
			this.b2 = new button(this,{bound:[100,this.formHeight - 32,80,22], click:[this,"doClick"], caption:"Cancel", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff"});
			this.ctrl = new control(this, {bound:[3,this.formHeight - 62,this.formWidth - 9, 22]});this.ctrl.getCanvas().css({background:"#6AC4F1"});
			this.bFirst = new button(this,{bound:[10,this.formHeight - 62,20,20], click:[this,"doClick"], caption:"Cancel", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff", icon:"icon/arrow-first.png"});
			this.bPrev = new button(this,{bound:[30,this.formHeight - 62,20,20], click:[this,"doClick"], caption:" ", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff", icon:"icon/arrow-left.png"});
			this.bInfo = new button(this,{bound:[50,this.formHeight - 62,60,20], click:[this,"doClick"], caption:" ", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff"});
			this.bNext = new button(this,{bound:[110,this.formHeight - 62,20,20], click:[this,"doClick"], caption:" ", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff", icon:"icon/arrow-right.png"});
			this.bLast = new button(this,{bound:[130,this.formHeight - 62,20,20], click:[this,"doClick"], caption:" ", borderColor:"#79B8ED", color:"#6AC4F1", fontColor:"#fff", icon:"icon/arrow-last.png"});
			this.sg.getCanvas().shadow({radius:0});
		}catch(e){
			systemAPI.alert("[fListData2]::init:"+e,step);
		}
	},
	doEditKeyPress: function(sender, charCode, buttonState){
	   if (charCode == 13){
	        this.sg.clear();
	        this.filter = " where ("+this.fields[0]+" like '"+this.e0.getText()+"%' and "+this.fields[1]+" like '"+this.e1.getText()+"%' )";
            this.dbLib.getDataProviderPageA(this.scriptSql + this.filter +" order by "+this.orderBy, 1,this.pager);                         
            this.pageCount = this.dbLib.getRowCount(this.scriptSqlCount + this.filter, this.pager);       
            this.sg.setTotalPage(this.pageCount);
	   }  
	},
	setDataFromItems: function(){	
	},
	editKeyPress: function(sender){
		this.startFind = 0;
	},
	doEditKeyDown: function(sender, keyCode, buttonState){
		if (keyCode == 13){
		    
		}
			
	},
	setRequester: function(formReq, req, row, col, isFilter, editNama){
		this.requester = req;
		this.formRequester = formReq;
		this.isFilter = isFilter;
		this.editNama = editNama;	
	},
	doDblClick: function(sender, colIdx, rowIdx){		
		this.doClick(this.b1);
	},
	doFind: function(sender){
		try{
			var child;
			var text; 
			var script = "";
			var filter = "";
			this.page = 1;					
			eval(script);						
			this.filter = " "+this.operator+" (" + filter +")";
			this.scriptSql = this.basicScript +" "+this.filter ;
			this.scriptSqlCount = this.basicCountScript+" "+this.filter;			
			this.sg.clear();
			this.dbLib.getDataProviderPageA(this.scriptSql +" order by "+this.orderBy, 1,this.pager);							
			this.pageCount = this.dbLib.getRowCount(this.scriptSqlCount, this.pager);		
			//this.sg.setTotalPage(this.pageCount);
			//this.sgNav.rearrange();
			//this.sgNav.setButtonStyle(3);
			//this.eStatus.setCaption("Page 1 of "+this.pageCount);			
			this.startFind = 0;
		}catch(e){
			systemAPI.alert("[GUI fListData]::doFind :" + e,"");
		}
	},
	doRequestReady: function(sender, methodName, result){		
		try{	
			switch(methodName)
			{
				case "getDataProviderPage" :	
					var res = result;	
				    result = JSON.parse(result);
					if (typeof result !="string"){
						this.sg.clear();				
						this.sg.setData(result, [this.fields[0],this.fields[1]], this.fields[0]);												
						if (this.withBlankRow){					    						
		                      this.sg.addRowValues(['-','-']);
						}
						this.getApplication().setActiveForm(this);
						//this.sg.setNoUrut((this.page - 1) * 20);
						
						this.bInfo.setCaption(this.page +"/"+this.pageCount);
						//this.sg.setTotalPage(this.pageCount, this.page);
                        //this.setActiveControl(this.sg);
					}else throw(result);
				break;
			}		
		}catch(e){
			error_log("[doRequestReady]"+e+"<br>"+res);
		}
	},
	doSelectedPage: function(sender, page){
		this.sg.clear();
		this.dbLib.getDataProviderPageA(this.scriptSql+ this.filter +" order by "+this.orderBy, page,this.pager);					
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
	setFields: function(fields, operator){	
		this.fields = fields;
		this.operator = operator;
		this.filter = "";
	},
	setLabels: function(labels){	  
	    try{
    		this.labels = labels;
    		this.sg.setColCount(labels.length);
    		var colTitle = [];
    		for (var i=0; i < labels.length; i++){
    		    colTitle.push({title : labels[i], width:80});
    		}
    		colTitle[1].width = 200;
    		this.sg.setColTitle(colTitle);
    	}catch(e){
    	    error_log(e);
    	}
	},
	doClose: function(sender){
		system.delMouseListener(this);
	},
	eventMouseDownForm: function(event){
	   this.activate();
    },
	eventMouseDown: function(event){				
		if (!this.isClick){
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;	
			
			this.isClick = true;
			this.blockElm.show();
			this.frameElm.hide();
		}
		this.activate();
	},
	doSysMouseDown: function(x, y, button, buttonState){	
		window.system_fListData.prototype.parent.doSysMouseDown.call(this,x, y, button, buttonState);
	},
	doSysMouseUp: function(x, y, button, buttonState){	
		window.system_fListData.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.system_fListData.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
		
	},
	eventMouseUp: function(event){
		this.isClick = false;
		this.blockElm.hide();
		this.frameElm.show();
	},
	eventMouseMove: function(event){
		if (this.isClick){
			
			var x = event.clientX;
			var y = event.clientY;
			var newLeft = parseFloat(this.blockElm.offset().left) + (x - this.mouseX);
			var newTop = parseFloat(this.blockElm.offset().top) + (y - this.mouseY);
								
			this.blockElm.css({left :  newLeft, top : newTop });
			this.frameElm.css({left : newLeft, top : newTop });
			
			this.mouseX = x;
			this.mouseY = y;
		}
	},
	setCaption: function(data){
		var canvas = $("#"+this.getFullId()+"_header");
		if (canvas != undefined)
		{
			canvas.html("<div style='position:absolute;left: 10; top : 3; width:100%; height:100%;text-align:center;"+
					" font-family: " + window.system.getConfig("form.titleFontName") + "; font-size: " + 
					window.system.getConfig("form.titleFontSize") + "; font-color:#fff;color:#fff'> "+data+"</div>" );	
		}		
	}
});
