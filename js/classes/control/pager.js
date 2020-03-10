//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_pager = function(owner,options){
	if (owner){
		window.control_pager.prototype.parent.constructor.call(this, owner,options);
		this.className = "control_pager";
		window.control_pager.prototype.parent.setHeight.call(this, 30);
		window.control_pager.prototype.parent.setWidth.call(this, 320);		
		this.report = undefined;
		this.showPager = false;			
		this.totalPage = 0;		
		this.page = 1;	
		this.startPage = 1;
		this.activeBtn = undefined;
		this.onCloseClick = new control_eventHandler();
		this.rowPerPage = 30;		
		this.onPager = new control_eventHandler();		
		if (options !== undefined) 
            this.updateByOptions(options);
	}	
};
window.control_pager.extend(window.control_control);
window.pager = window.control_pager;
window.control_pager.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		canvas.style.border = "1px solid #88d5f4";		
		var html = "<div style='{position:absolute;width:100%;height:100%;top:0;left:0;background-image:url(image/tabBg.png)}'>"+
					"<div id='"+ n +"_first' style='{cursor:pointer;position:absolute;width:18;height:18;left:5;top:1;background-image:url(icon/"+system.getThemes()+"/first.png)}' onclick='system.getResource("+this.resourceId+").doSelectedPage(event,\"first\")'></div>"+
					"<div id='"+ n +"_left' style='{cursor:pointer;position:absolute;width:18;height:18;left:24;top:1;background-image:url(icon/"+system.getThemes()+"/left.png)}' onclick='system.getResource("+this.resourceId+").doSelectedPage(event,\"left\")'></div>"+
					"<div id='"+ n +"_centerFr' style='{position:absolute;width:100%;height:18;left:42;top:1;overflow:hidden}'>"+	
						"<div id='"+ n +"_center' align='center' style='{cursor:pointer;position:absolute;width:auto;height:18;left:42;top:1;}'></div>"+	
					"</div>"+
					"<div id='"+ n +"_selected' align='center' style='{display:none;border:1px solid #88d5f4;position:absolute;width:40;height:18;left:50;top:0;font-size:14;color:#ffffff}'>1</div>"+					
					"<div id='"+ n +"_right' style='{cursor:pointer;position:absolute;width:18;height:18;left:100%;top:1;background-image:url(icon/"+system.getThemes()+"/right.png)}' onclick='system.getResource("+this.resourceId+").doSelectedPage(event,\"right\")'></div>"+		
					"<div id='"+ n +"_last' style='{cursor:pointer;position:absolute;width:18;height:18;left:100%;top:1;background-image:url(icon/"+system.getThemes()+"/last.png)}' onclick='system.getResource("+this.resourceId+").doSelectedPage(event,\"last\")'></div>"+				
				"</div>";	
		this.setInnerHTML(html, canvas);
		this.firstBtn = $( n +"_first");
		this.leftBtn = $( n +"_left");
		this.rightBtn = $( n +"_right");	
		this.lastBtn = $( n +"_last");
		this.centerCont = $( n +"_center");
		this.centerFr = $( n +"_centerFr");
		this.selectedBtn = $( n +"_selected");
		if (systemAPI.browser.msie && systemAPI.browser.version == 6){				
			DD_belatedPNG.fixPngArray([this.firstBtn, this.leftBtn, this.rightBtn, this.lastBtn], false);
		}
	},
	doSelectedPage: function(event, sender){			
		var cnv = $(this.getFullId()+"_"+this.page);
		if (cnv !== undefined) {
			cnv.style.border = "";
			cnv.style.color = "#000000";
		}
		if (sender == "first") this.page = 1;
		else if (sender == "left") this.page = this.page > 1 ? this.page - 1 : 1;
		else if (sender == "right") this.page = this.page < this.totalPage ? this.page + 1 : this.totalPage;
		else if (sender == "last") this.page = this.totalPage;
		else this.page = parseInt(sender);
		this.selectedBtn.innerHTML = this.page;	
		if (sender != "first" && sender != "right" && sender != "left" && sender != "last"){
			var target = document.all ? event.srcElement : event.target;					
		}else {
			var target = $(this.getFullId() +"_"+this.page);			
		}
		target.style.color = "#ffffff";
		target.style.border = "1px solid #fffff";
		if (target.offsetLeft < (this.centerCont.offsetWidth / 2)) 		
			this.centerCont.style.left = (this.centerFr.offsetWidth / 2)  - target.offsetLeft;
		else this.centerCont.style.left = ((this.centerFr.offsetWidth / 2) - (this.centerCont.offsetWidth / 2) ) + ((this.centerCont.offsetWidth / 2) - target.offsetLeft); 		
		this.onPager.call(this, this.page);	
	},
	rearrange: function(){	
	},
	setTotalPage: function(data){
		var totPage = this.totalPage;
		this.page = 1;
		this.totalPage = data;
		var html = "";
		for (var i=1; i<= data;i++)
			html += "<span id='"+ this.getFullId() +"_"+ i +"' style='position:inline;width:auto;cursor:pointer' onclick='system.getResource("+this.resourceId+").doSelectedPage(event,\""+i+"\")' >"+i+"</span>&nbsp;&nbsp;";
		this.centerCont.innerHTML = html;					
		this.centerCont.style.left = (parseInt(this.centerFr.style.width) / 2);
		this.selectedBtn.innerHTML = this.page;	
	},
	setWidth: function(data){
		window.control_pager.prototype.parent.setWidth.call(this, data);	
		this.rightBtn.style.left = data - 41;
		this.lastBtn.style.left = data - 23;
		this.centerFr.style.width = data - 82;
		this.selectedBtn.style.left = data / 2 - 10;	
	},
	doClick: function(sender){
		this.onCloseClick.call(sender);
	},
	doAllClick: function(sender){
		this.onAllClick.call(sender);
	},
	doPdfClick: function(sender){
		this.onPdfClick.call(sender);
	},
	doXlsClick: function(sender){
		this.onXlsClick.call(sender);
	},
	hideNavigator: function(){
		this.setTotalPage(0);	
		this.firstBtn.setVisible(false);
		this.leftBtn.setVisible(false);
		this.rightBtn.setVisible(false);
		this.lastBtn.setVisible(false);
		this.allBtn.setVisible(false);
		this.closeBtn.setLeft(this.getWidth() - 80);
	},
	showProgress: function(){
	},
	hideProgress: function(){
	},
	doRowPPageClick: function(sender){
		if (this.rowPerPage != sender.getTag1())
		{
			this.rowPerPage = sender.getTag1();		
			this.onRowPPClick.call(this, this.rowPerPage);
		}
	},
	doFindClick: function(){	
		this.frame.setTop(83);
		if (this.frame.visible)			
			this.frame.hide();		
		else
			this.frame.show();		
	},
	doSelectChange: function(sender, text, itemIdx){
		if (this.rowPerPage != parseInt(text)){
			this.rowPerPage = parseInt(text);
			this.onRowPPClick.call(this, this.rowPerPage);
		}	
	},
	doCreateClick: function(sender){
		this.onTransClick.call(sender, sender.getName()); 
	},
	setFields: function(items){
		for (var i in items.objList)
			this.e1.addItem(i, items.objList[i]);	
	},
	doFindText: function(sender){
		this.onFindClick.call(sender, this.e0.getText(), this.e1.getText());	
	},
	doGraphClick: function(sender){
		this.onGraphClick.call(sender);	
	},
	doPrintClick: function(sender){  
		this.onPrintClick.call(sender);		
	},
	doPreviewClick: function(sender){  
		this.onPreviewClick.call(sender);	
	},
	doChange: function(sender, text, itemIdx){	
	},
	setAddress: function(address){
		this.browser.setAddress(address);
		this.browser.setTop(90);
		this.browser.show();
	},
	setHtml: function(html){
		this.browser.setHtml(html);
		this.browser.setTop(90);
		this.browser.show();
	},
	hideBrowser: function(){
		this.browser.hide();	
	},
	setReport: function(report){
		this.report = report;
	},
	doNavigatorClick: function(sender){
		try{	
			this.activePage = sender.getTag1();				
			if (tmp != this.activePage)	
				this.onPager.call(sender, this.activePage);
		}catch(e){
			alert("[sgNavigator]::doClick:"+e+"\r\n"+sender.getName());
		}
	},
	setSelectedPage: function(sender){
		this.activeBtn = sender;
	}
});
