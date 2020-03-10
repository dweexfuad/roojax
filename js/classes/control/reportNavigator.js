//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_reportNavigator = function(owner, options){
	if (owner){
		try{
			window.control_reportNavigator.prototype.parent.constructor.call(this, owner, options);
			this.className = "control_reportNavigator";
			window.control_reportNavigator.prototype.parent.setHeight.call(this, 30);
			window.control_reportNavigator.prototype.parent.setWidth.call(this, 320);
			
			this.report = undefined;
			this.showPager = false;			
			this.totalPage = 0;
			this.serverDownload = false;
			
			this.activePage = 1;	
			this.startPage = 1;
			this.activeBtn = undefined;
			this.onCloseClick = new control_eventHandler();
			this.onAllClick = new control_eventHandler();
			this.onPdfClick = new control_eventHandler();
			this.onXlsClick = new control_eventHandler();
			this.onRowPPClick = new control_eventHandler();
			this.onTransClick = new control_eventHandler();
			this.onFindClick = new control_eventHandler();
			this.onGraphClick = new control_eventHandler();
			this.onPrintClick = new control_eventHandler();
			this.onPreviewClick = new control_eventHandler();
			this.onSendClick = new control_eventHandler();
			this.onSortChange = new control_eventHandler();
			this.rowPerPage = 30;
			
			var app = this.getApplication();
			uses("control_frameBrowser");//control_frameNavigator;
			//this.frame = new control_frameNavigator(app,{bound:[20,this.top + this.height + 30,620,40],visible:false});//(window.app);						
			this.browser = new control_frameBrowser(app,{bound:[5,this.top + this.height + 35,this.width, this.height - 117],visible:false});									
			//this.e0 = new control_saiLabelEdit(this.frame,{bound:[20,5,300,20],caption:"Search"});
			//this.e1 = new control_saiCB(this.frame,{bound:[325,5,200,20],caption:"in Field",change:[this,"doChange"]});			
			//this.b1 = new control_button(this.frame,{bound:[530,5,78,18],caption:"Find",click:[this,"doFindText"]});
			this.btnTop = 4;			
			this.firstBtn = new control_imageButton(this,{bound:[20,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/imgFirst.png", hint:"First Page",tag:1,click:[this,"doNavigatorClick"],name:"firstBtn"});			
			this.leftBtn = new control_imageButton(this,{bound:[42,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/imgLeft.png", hint:"Prev Page",tag:1,click:[this,"doNavigatorClick"],name:"leftBtn"});						
			this.rightBtn = new control_imageButton(this,{bound:[64,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/imgRight.png", hint:"Next Page",tag:1,click:[this,"doNavigatorClick"],name:"rightBtn"});									
			this.lastBtn = new control_imageButton(this,{bound:[88,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/imgLast.png", hint:"Last Page",tag:1,click:[this,"doNavigatorClick"],name:"LastBtn"});									
			this.allBtn = new control_imageButton(this,{bound:[110,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/fullscreen.png", hint:"All Page",tag:1,click:[this,"doAllClick"],name:"allBtn"});															
			this.pdfBtn = new control_imageButton(this,{bound:[132,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/pdf.png", hint:"Create PDF",tag:1,click:[this,"doPdfClick"],name:"pdfBtn"});																		
			this.xlsBtn = new control_imageButton(this,{bound:[154,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/excel.png", hint:"Create XLS",tag:1,click:[this,"doXlsClick"],name:"xlsBtn"});																		
			this.create = new control_imageButton(this,{bound:[176,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/createentries.png", hint:"Create Record",tag:1,click:[this,"doCreateClick"],name:"create"});																		
			this.edit = new control_imageButton(this,{bound:[198,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/editentries.png", hint:"Edit Record",tag:1,click:[this,"doCreateClick"],name:"edit"});																		
			this.del = new control_imageButton(this,{bound:[220,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/delentries.png", hint:"Delete Record",tag:1,click:[this,"doCreateClick"],name:"del"});																		
			this.findText = new control_imageButton(this,{bound:[242,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/relakun.png", hint:"Find Record",tag:1,click:[this,"doFindClick"],name:"findText"});																		
			this.graph = new control_imageButton(this,{bound:[264,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/graph.png", hint:"Graph",tag:1,click:[this,"doGraphClick"],name:"graph"});																		
			this.PrintBtn = new control_imageButton(this,{bound:[286,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/print.png", hint:"Print Page",tag:1,click:[this,"doPrintClick"],name:"PrintBtn"});																		
			this.PreviewBtn = new control_imageButton(this,{bound:[308,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/printPreview.png", hint:"Print Preview",tag:1,click:[this,"doPreviewClick"],name:"PreviewBtn"});																											
			this.MailBtn = new control_imageButton(this,{bound:[330,this.btnTop,22,22],image:"icon/"+system.getThemes()+"/sendMail.png", hint:"Send Email",tag:1,click:[this,"doNavigatorClick"],name:"MailBtn"});
			this.cbSort = new control_saiCB(this,{bound:[352,this.btnTop,100,20],caption:"",labelWidth:0,change:[this,"doSelectChange"],items:["Sort By"], hint:"Sort By"});				
			this.img = new control_image(this,{bound:[20,5,15,20],image:"image/loader.gif",visible:false});						
			this.cb = new control_saiCB(this,{bound:[this.getWidth() / 2 ,this.btnTop,50,20],caption:"",labelWidth:0,change:[this,"doSelectChange"],items:["10","20","30","50","100","500","1000","5000","10000"], hint:"Pilih Jumlah Baris per Halaman"});				
			this.cb.setSelectedId(3);				
			this.closeBtn = new control_button(this,{bound:[this.getWidth() - 80,this.btnTop,80,18],caption:"Back",click:[this,"doCloseClick"]});
			this.setTabChildIndex();			
			this.onPager = new control_eventHandler();				
			if (options !== undefined){
				this.updateByOptions(options);								
				if (options.color !== undefined) this.setColor(options.color);
				if (options.border !== undefined) this.setBorder(options.border);
				if (options.shadow !== undefined) this.setShadow(options.shadow);
				if (options.caption !== undefined) this.setCaption(options.caption);
			}
		}catch(e){
			systemAPI.alert("reportNavigator",e);
		}
	}	
};
window.control_reportNavigator.extend(window.control_panel);
window.reportNavigator = window.control_reportNavigator;
window.control_reportNavigator.implement({
	setReport:function(report){
		this.report = report;
	},
	doNavigatorClick: function(sender){
		try{
			var script = "";
			var pos = 0;
			var tmp = this.activePage;
			if (sender == this.MailBtn){
			     if (this.confirmMail === undefined)
			         uses("control_ConfirmMail");		
			     this.confirmMail = new control_ConfirmMail(this.owner,{bound:[this.owner.width / 2 - 125,this.owner.height / 2 - 100,250,100],caption:"Konfirmasi Email",visible:true});			     
			     this.confirmMail.onConfirmClick.set(this.onSendClick.target,"doConfirmClick");
			     this.confirmMail.email.setFocus();
			     return false;
            }else if (sender == this.leftBtn)
			{
				if (this.startPage > 1) 
					this.startPage--;	
				else this.startPage = 1;
				if (this.totalPage > 5)
				{					
					for (var i = this.startPage; i < (this.startPage + 5); i++)
					{
						pos = (i - this.startPage) + 1;
						script = "this.imgBtn"+pos+".setTag1("+i+");" +
								 "this.imgBtn"+pos+".setCaption("+i+");";						
						eval(script);
					}					
				}
				if (this.activePage > 1)
					this.activePage--;				
				if ((this.startPage + 4) == 5)
				{
					pos = (this.activePage - this.startPage) + 1;
					if ((pos > 0) && (pos <=5))
					{
						script = "this.setSelectedPage(this.imgBtn"+pos+")";						
						eval(script);
					}
				}
			}else if (sender == this.rightBtn)
			{
				if (this.activePage == this.totalPage)
					return false;
				if (this.totalPage > 5)
				{					
					if (this.startPage < (this.totalPage-4))
						this.startPage++;				
					var max = (this.startPage + 5) > this.totalPage ? this.totalPage +1:(this.startPage + 5);
					
					for (var i = this.startPage; i < max; i++)
					{
						pos = (i - this.startPage) + 1;
						script = "this.imgBtn"+pos+".setTag1("+i+");" +
								 "this.imgBtn"+pos+".setCaption("+i+");";						
						eval(script);
					}					
				}	
				if (this.activePage < this.totalPage)
					this.activePage++;	
				//alert(this.startPage +" "+this.activePage);
				//if ((this.startPage + 4) < this.totalPage)
				{
					pos = (this.activePage - this.startPage) + 1;
					if ((pos > 0) && (pos <=5))
					{
						script = "this.setSelectedPage(this.imgBtn"+pos+")";						
						eval(script);
					}
				}
						
			}else if (sender == this.firstBtn)
			{
				this.activePage = 1;
				this.startPage = 1;
				script = "this.setSelectedPage(this.imgBtn1)";						
				eval(script);					
				if (this.totalPage  > 5 )
				{		
					for (var i = 1; i <= 5; i++)
					{
						script = "this.imgBtn"+i+".setTag1("+i+");" +
								 "this.imgBtn"+i+".setCaption("+i+");";						
						eval(script);
					}
				}
			}else if (sender == this.lastBtn)
			{
				this.activePage = this.totalPage;				
				if (this.totalPage > 5)
				{
					this.startPage = this.totalPage - 4;
					script = "this.setSelectedPage(this.imgBtn5);";						
				}else 
				{
					this.startPage = 1;
					script = "this.setSelectedPage(this.imgBtn"+this.totalPage+");";
				}
				eval(script);					
				if (this.totalPage > 5)
				{
					for (var i = (this.totalPage - 4); i <= this.totalPage; i++)
					{					
						pos = i - (this.totalPage - 4) + 1;	
						script = "this.imgBtn"+pos+".setTag1("+i+");" +
								 "this.imgBtn"+pos+".setCaption("+i+");";	
						eval(script);
					}
				}
			}else
				this.activePage = sender.getTag1();				
			if ((sender != this.firstBtn) && (sender != this.leftBtn) && (sender != this.rightBtn) && (sender != this.lastBtn))	
				this.setSelectedPage(sender);
			if (tmp != this.activePage)	
				this.onPager.call(sender, this.activePage);
		}catch(e){
			alert("[sgNavigator]::doClick:"+e+"\r\n"+sender);
		}
	},
	rearrange: function(){
		this.activeBtn = undefined;
		this.activePage = 1;
		this.startPage = 1;
		var startPos = 64;
		var script = "";
		var totPage = this.totalPage;
		if (totPage  > 5 )
		{
			for (var i = 1; i <= 5; i++)
			{
				script = "this.imgBtn"+i+" = new control_imageButton(this); "+
						"this.imgBtn"+i+".setTop(this.btnTop); "+
						"this.imgBtn"+i+".setLeft(startPos); "+
						"this.imgBtn"+i+".setWidth(22); "+
						"this.imgBtn"+i+".setHeight(22); "+
						"this.imgBtn"+i+".setImage('icon/"+system.getThemes()+"/imgBtn.png'); "+
						"this.imgBtn"+i+".setHint('"+i+" page'); "+
						"this.imgBtn"+i+".onClick.set(this,'doNavigatorClick');	"+	
						"this.imgBtn"+i+".setName('imgBtn"+i+"');	"+		
						"this.imgBtn"+i+".setTag1("+i+"); "+
						"this.imgBtn"+i+".setCaption("+i+"); "+
						"startPos = 64 + (22 * "+i+");";
				eval(script);
			}		
			this.rightBtn.setLeft(startPos);
			this.lastBtn.setLeft(startPos + 22);
			this.lastBtn.setTag1(totPage);
			this.allBtn.setLeft(startPos + 44);
			this.pdfBtn.setLeft(startPos + 66);
			this.xlsBtn.setLeft(startPos + 88);
			this.create.setLeft(startPos + 110);
			this.edit.setLeft(startPos + 132);
			this.del.setLeft(startPos + 154);
			this.findText.setLeft(startPos + 176);
			this.graph.setLeft(startPos + 198);
			this.PrintBtn.setLeft(startPos + 220);
			this.PreviewBtn.setLeft(startPos + 242);
			this.MailBtn.setLeft(startPos + 264);
			this.cbSort.setLeft(startPos + 286);
		}else
		{		
			for (var i = 1; i <= totPage; i++)
			{
				script = "this.imgBtn"+i+" = new control_imageButton(this); "+
						"this.imgBtn"+i+".setTop(this.btnTop); "+
						"this.imgBtn"+i+".setLeft(startPos); "+
						"this.imgBtn"+i+".setWidth(22); "+
						"this.imgBtn"+i+".setHeight(22); "+
						"this.imgBtn"+i+".setImage('icon/"+system.getThemes()+"/imgBtn.png'); "+
						"this.imgBtn"+i+".setHint('"+i+" page'); "+
						"this.imgBtn"+i+".onClick.set(this,'doNavigatorClick');	"+	
						"this.imgBtn"+i+".setName('imgBtn"+i+"');	"+		
						"this.imgBtn"+i+".setTag1("+i+"); "+
						"this.imgBtn"+i+".setCaption("+i+"); "+
						"startPos = 64 + (22 * "+i+");";
				eval(script);
			}		
			this.rightBtn.setLeft(startPos);
			this.lastBtn.setLeft(startPos + 22);
			this.lastBtn.setTag1(totPage);
			this.allBtn.setLeft(startPos + 44);
			this.pdfBtn.setLeft(startPos + 66);
			this.xlsBtn.setLeft(startPos + 88);
			this.create.setLeft(startPos + 110);
			this.edit.setLeft(startPos + 132);
			this.del.setLeft(startPos + 154);
			this.findText.setLeft(startPos + 176);
			this.graph.setLeft(startPos + 198);
			this.PrintBtn.setLeft(startPos + 220);
			this.PreviewBtn.setLeft(startPos + 242);
			this.MailBtn.setLeft(startPos + 264);
			this.cbSort.setLeft(startPos + 286);
		}
		if (totPage > 5 && this.cb.left < this.MailBtn.left + 22) this.cb.setLeft(this.MailBtn.left + 25);
		if (totPage > 0 )
			this.setSelectedPage(this.imgBtn1);
	},
	setShowPager: function(data){
		this.showPager = data;
		if (this.showPager){
			this.firstBtn.setVisible(true);
			this.leftBtn.setVisible(true);
			this.rightBtn.setVisible(true);
			this.lastBtn.setVisible(true);
		}else
		{
			this.firstBtn.setVisible(false);
			this.leftBtn.setVisible(false);
			this.rightBtn.setVisible(false);
			this.lastBtn.setVisible(false);
		}
	},
	setSelectedPage: function(sender){
		if (this.activeBtn != undefined)
			this.activeBtn.setImage("icon/"+system.getThemes()+"/imgBtn.png");
		sender.setImage("icon/"+system.getThemes()+"/imgSelect.png");	
		this.activeBtn = sender;
	},
	setTotalPage: function(data){
		var totPage = this.totalPage;
		this.activePage= 1;
		this.startPage = 1;
		this.activeBtn = undefined;
		if (totPage > 5 ){
			for (var i = 1; i <= 5; i++){
				script = "this.imgBtn"+i+".free();";
				eval(script);
			}		
		}else{		
			for (var i = 1; i <= totPage; i++){
				script = "this.imgBtn"+i+".free();";
				eval(script);
			}		
		}
		this.totalPage = data;
		this.lastBtn.setTag1(data);
	},
	setWidth: function(data){
		window.control_reportNavigator.prototype.parent.setWidth.call(this, data);
		if (this.closeBtn !== undefined) this.closeBtn.setLeft(this.getWidth() - 80);
		if (this.img !== undefined) this.img.setLeft(this.getWidth() - 350);
		if (this.cb !== undefined){ 
			this.cb.setLeft(this.getWidth() / 2  - 25);
			if (this.cb.left < this.cbSort.left + 22) 
				this.cb.setLeft(this.cbSort.left + 102);
		}
		if (this.browser !== undefined) this.browser.setWidth(this.getWidth() - 20);
	},
	doCloseClick: function(sender){		
		this.onCloseClick.call(sender);		
	},
	doAllClick: function(sender){
		this.onAllClick.call(sender);
	},
	doPdfClick: function(sender){
		this.onPdfClick.call(sender);
	},
	doXlsClick: function(sender){
		//
		if (!this.serverDownload) download(this.report.getContent(),"xls");
		else this.onXlsClick.call(sender);
	},
	hideNavigator: function(){
		this.setTotalPage(0);	
//	this.setWidth(90);
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
		if (this.rowPerPage != sender.getTag1()){
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
		if (sender == this.cbSort){
			this.onSortChange.call(this, text, itemIdx);
		}else  if (this.rowPerPage != parseInt(text)){
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
		//this.onPrintClick.call(sender);		
		if (this.report.multiPage){
			var cnv = $(this.report.getFullId()+"_iframe"+this.report.activePage);
			cnv.contentWindow.focus();
			cnv.contentWindow.print();
		}else{
			window.frames[this.report.getFullId() +"_iframe"].focus();
			window.frames[this.report.getFullId() +"_iframe"].print();
		}
	},
	doPreviewClick: function(sender){  
		//this.onPreviewClick.call(sender);	
		var winfram = window.open();
		winfram.document.open();			
		winfram.document.write(loadCSS("server_util_laporan"));
		winfram.document.write(this.report.getContent());
		winfram.document.close();
	},
	doSendClick: function(sender){
		this.onSendClick.call(sender);
	},
	doChange: function(sender, text, itemIdx){
	},
	setAddress: function(address){
		this.browser.setAddress(address);
		this.browser.setHeight(system.activeApplication.activeForm.getHeight() - 117);
		this.browser.setTop(this.top + this.height + 35);
		this.browser.show();
	},
	setHtml: function(html){
		this.browser.setHtml(html);
		this.browser.setTop(this.top + this.height + 35);
		this.browser.setHeight(system.activeApplication.activeForm.getHeight() - 117);
		this.browser.show();
	},
	hideBrowser: function(){
		this.browser.hide();	
	},
	setSortBy: function(items){
		this.cbSort.clearItem();
		for (var i in items.objList){
			this.cbSort.addItem(i, items.get(i));
		}
	}
});
