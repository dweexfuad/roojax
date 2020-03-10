//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_sgNavigator = function(owner, options){
	if (owner){
		window.control_sgNavigator.prototype.parent.constructor.call(this, owner, options);
		this.className = "control_sgNavigator";
		window.control_sgNavigator.prototype.parent.setHeight.call(this, 25);
		this.sg = undefined;
		this.showPager = false;			
		this.totalPage = 0;
		this.activePage = 1;	
		this.startPage = 1;
		this.pager = 50;
		this.activeBtn = undefined;
				
		uses("control_imageButton;control_uploader;control_image");		
		this.addBtn = new control_imageButton(this,{bound:[2,2,22,22],image:"icon/"+system.getThemes()+"/createentries.png",hint:"Append Row",click:[this,"doNavigatorClick"],name:"addBtn"});
		this.delBtn = new control_imageButton(this,{bound:[24,2,22,22],image:"icon/"+system.getThemes()+"/delentries.png",hint:"Delete Row",click:[this,"doNavigatorClick"],name:"delBtn"});
		this.copyBtn = new control_imageButton(this,{bound:[46,2,22,22],image:"icon/"+system.getThemes()+"/copyentries.png",hint:"Copy Row",name:"copyBtn",click:[this,"doNavigatorClick"]});		
		this.separator = new control_image(this,{bound:[50,2,2,22],image:"icon/"+system.getThemes()+"/separator.png",name:"separator"});		
		this.downBtn = new control_imageButton(this,{bound:[54,2,22,22],image:"icon/"+system.getThemes()+"/down.png",hint:"Move Down",click:[this,"doNavigatorClick"],name:"addBtn"});
		this.upBtn = new control_imageButton(this,{bound:[76,2,22,22],image:"icon/"+system.getThemes()+"/up.png",name:"upBtn",hint:"Move Up",click:[this,"doNavigatorClick"]});
		this.separator2 = new control_image(this,{bound:[98,2,2,22],image:"icon/"+system.getThemes()+"/separator.png"});
		this.firstBtn = new control_imageButton(this,{bound:[102,2,22,22],image:"icon/"+system.getThemes()+"/imgFirst.png",name:"firstBtn",hint:"First Page",click:[this,"doNavigatorClick"]});
		this.leftBtn = new control_imageButton(this,{bound:[124,2,22,22],image:"icon/"+system.getThemes()+"/imgLeft.png",name:"leftBtn",hint:"Prev Page",click:[this,"doNavigatorClick"]});
		this.rightBtn = new control_imageButton(this,{bound:[140,2,22,22],image:"icon/"+system.getThemes()+"/imgRight.png",name:"rightBtn",hint:"Next Page",click:[this,"doNavigatorClick"]});		
		this.lastBtn = new control_imageButton(this,{bound:[162,2,22,22],image:"icon/"+system.getThemes()+"/imgLast.png",name:"lastBtn",hint:"Last Page",click:[this,"doNavigatorClick"]});				
		this.printBtn = new control_imageButton(this,{bound:[184,2,22,22],image:"icon/"+system.getThemes()+"/print.png",hint:"Print",name:"printBtn",click:[this,"doNavigatorClick"]});		
		this.xlsBtn = new control_imageButton(this,{bound:[206,2,22,22],image:"icon/"+system.getThemes()+"/excel.png",hint:"Save to excel",name:"xlsBtn",click:[this,"doNavigatorClick"]});		
		this.docBtn = new control_imageButton(this,{bound:[228,2,22,22],image:"icon/"+system.getThemes()+"/word.png",hint:"Save to word",name:"docBtn",click:[this,"doNavigatorClick"]});		
		this.loadBtn = new control_imageButton(this,{bound:[250,2,22,22],image:"icon/"+system.getThemes()+"/upload.png",hint:"Load to Files",name:"loadBtn",click:[this,"doNavigatorClick"]});				
		this.uploader = new control_uploader(this,{bound:[300,2,210,22],afterUpload:[this,"doAfterLoad"],autoSubmit:true, param4:"gridupload",param3:"object",visible:false});		
		this.setTabChildIndex();		
		this.onPager = new control_eventHandler();
		this.onAfterUpload = new control_eventHandler();
		this.onBeforePrint = new control_eventHandler();
		this.onBeforePager = new control_eventHandler();
		this.onRefreshGrid = new control_eventHandler();
		this.onXlsClick = new control_eventHandler();
		this.setColor("#ccdeea");//system.getConfig("form.navigator.color")
		this.printHeader = "";
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.buttonStyle !== undefined) this.setButtonStyle(options.buttonStyle);
			if (options.color !== undefined) this.setColor(options.color);
			if (options.borderStyle !== undefined) this.setBorder(options.borderStyle);
			if (options.pager !== undefined) this.onPager.set(options.pager[0],options.pager[1]);
			if (options.beforePager !== undefined) this.onBeforePager.set(options.beforePager[0],options.beforePager[1]);			
			if (options.refreshGrid !== undefined) this.onRefreshGrid.set(options.refreshGrid[0],options.refreshGrid[1]);
			if (options.afterUpload !== undefined) this.onAfterUpload.set(options.afterUpload[0],options.afterUpload[1]);
			if (options.beforePrint !== undefined) this.onBeforePrint.set(options.beforePrint[0],options.beforePrint[1]);
			if (options.xlsClick !== undefined) this.onXlsClick.set(options.xlsClick[0],options.xlsClick[1]);
			if (options.grid !== undefined) this.setGrid(options.grid);
			
		}
	}
};
window.control_sgNavigator.extend(window.control_containerControl);
window.sgNavigator = window.control_sgNavigator
window.control_sgNavigator.implement({
	draw: function(canvas){
		window.control_sgNavigator.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";	    
		var nd = this.getCanvas();
		nd.style.background = system.getConfig("form.panel.color");

		nd.style.overflow = "hidden";
	    if (document.all)
	        html =  "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
					"<div id='" + n + "_border1' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.outer.right") + ";border-top: " + window.system.getConfig("3dborder.outer.bottom") + ";}'></div>" +
	                "<div id='" + n + "_border2' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.outer.left") + ";border-bottom: " + window.system.getConfig("3dborder.outer.top") + ";}'></div>" +
					"<div id= '"+n+"_bottom' style='{position: absolute; left: 0; top: 100%; width: 100%; height: 100%; }' >" +
	                	"<div id='" + n + "_sBottom' style='{background: url(icon/"+system.getThemes()+"/panelShadow.png) top left repeat-x; position: absolute; left: 0; top: 0; width:100%; height: 100%}' ></div>" +
					"</div>"+
					"<div id='" + n + "_lcap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;}'> </div>"+
					"<div id='" + n + "_cap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;color:#ffffff}'> </div>"+
					"<div id='" + n + "_rcap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;}'> </div>"+
	                "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
					"<div id='" + n + "_block' style='{background: url(icon/"+system.getThemes()+"/background.png) left top; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
					"</div>";
	    else
	        html =  "<div id='" + n + "_border1' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.outer.right") + ";border-top: " + window.system.getConfig("3dborder.outer.bottom") + ";}'></div>" +
	                "<div id='" + n + "_border2' style='{position: absolute;left: -1;top: -1;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.outer.left") + ";border-bottom: " + window.system.getConfig("3dborder.outer.top") + ";}'></div>" +
					"<div id='" + n + "_bottom' style='{background: url(icon/"+system.getThemes()+"/panelShadow.png) bottom left repeat-x; position: absolute; left: 0; top: 0; width:100%; height: 100%;display:none}' ></div>" +
					"<div id='" + n + "_lcap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;}'> </div>"+
					"<div id='" + n + "_cap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;color:#ffffff}'> </div>"+
					"<div id='" + n + "_rcap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;}'> </div>"+
	                "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+
					"<div id='" + n + "_block' style='{background: url(icon/"+system.getThemes()+"/background.png) left top; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>";
	    this.setInnerHTML(html, nd);
	},
	setColor: function(data){
		this.bgColor = data;
		var nd = this.getCanvas();
		nd.style.background = this.bgColor;
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){	
	    if (this.border != data)
	    {
	        var node = undefined;
	        var n = this.getFullId();
	        
	        switch (data)
	        {
	            case 0 : // none
	                    node = $(n + "_border1");
	                    
	                    if (node != undefined)
	                        node.style.border = "";
	                        
	                    node = $(n + "_border2");

	                    if (node != undefined)
	                        node.style.border = "";
	                    break;
	            case 1 : // raised
	                    node = $(n + "_border1");
	                    if (node != undefined){
	                        node.style.borderLeft = window.system.getConfig("3dborder.outer.right");
	                        node.style.borderTop = window.system.getConfig("3dborder.outer.bottom");
	                    }
	                    node = $(n + "_border2");
	                    if (node != undefined){
	                        node.style.borderRight = window.system.getConfig("3dborder.outer.left");
	                        node.style.borderBottom = window.system.getConfig("3dborder.outer.top");
	                    }
	                    
	                    break;
	            case 2 : // lowered
	                    node = $(n + "_border1");
	                    if (node != undefined){
	                        node.style.borderLeft = window.system.getConfig("3dborder.outer.left");
	                        node.style.borderTop = window.system.getConfig("3dborder.outer.top");
	                    }

	                    node = $(n + "_border2");

	                    if (node != undefined){
	                        node.style.borderRight = window.system.getConfig("3dborder.outer.right");
	                        node.style.borderBottom = window.system.getConfig("3dborder.outer.bottom");
	                    }

	                    break;
				case 3 : // bordered
	                    node = $(n + "_border1");
	                    if (node != undefined){
	                        node.style.borderLeft = window.system.getConfig("nonborder.inner.right");
	                        node.style.borderTop = window.system.getConfig("nonborder.inner.bottom");
	                    }
	                    node = $(n + "_border2");
	                    if (node != undefined){
	                        node.style.borderRight = window.system.getConfig("nonborder.inner.left");
	                        node.style.borderBottom = window.system.getConfig("nonborder.inner.top");
	                    }	                   
	                    break;
	        }
	    }
	},
	setWidth: function(data){
		window.control_sgNavigator.prototype.parent.setWidth.call(this,data);
		this.uploader.setLeft(data - 220);
	},
	setGrid: function(grid){
		this.sg = grid;
	},
	doNavigatorClick: function(sender){
		try{		
			if (this.sg != undefined) this.sg.hideFrame();
			if (sender == this.addBtn)
			{
				var values= [];
				for (var i = 0; i < this.sg.columns.getLength();i++)			
					values[i] = "";		
				this.sg.appendData(values);
				var rowCount = this.sg.getRowCount();
				if (this.sg.rowPerPage){
					this.setTotalPage(Math.ceil(rowCount / this.sg.rowPerPage));
					this.rearrange();					
				}
			}else if (sender == this.copyBtn)
			{
				var data = [];
				for (var i = 0; i < this.sg.columns.getLength();i++){
					if (this.sg.autoPaging) {
						var row = (this.sg.rowPerPage * (this.sg.page - 1)) + this.sg.row;
					}else var row = this.sg.row;
					data[i] = this.sg.cells(i,row);
				}
				this.sg.appendData(data);
				var rowCount = this.sg.getRowCount();
				if (this.sg.rowPerPage){
					this.setTotalPage(Math.ceil(rowCount / this.sg.rowPerPage));
					this.rearrange();					
				}
			}else if(sender == this.delBtn)
			{
				this.sg.delRow(this.sg.row);
			}else if (sender == this.upBtn)
			{
				var row = this.sg.row;
				if (this.sg.row > 0 )
				{
					this.sg.row--;
					this.sg.swapRow(row, this.sg.row);
				}
				
			}else if (sender == this.downBtn)
			{
				var row = this.sg.row;
				if (this.sg.row < (this.sg.rows.getLength()-1) )
				{
					this.sg.row++;
					this.sg.swapRow(row, this.sg.row);
				}			
			}else if (sender == this.printBtn)
			{				
				this.onBeforePrint.call(this);				
				this.sg.print(this.printHeader, this.outerHtml);
			}else if (sender == this.loadBtn)
			{
				if (!this.uploader.visible)
					this.uploader.show();
				else this.uploader.upload(); 
				
			} else if (sender == this.xlsBtn)
			{				
				if (this.onXlsClick.method === undefined) {
					this.onBeforePrint.call(this);
					
					var html = "";//new server_util_arrayList();				
					if (this.outerHtml) 
						html = this.outerHtml;//.add(this.outerHtml);
					else 
						html = this.printHeader + this.sg.gridToHTML();//.add(this.printHeader +this.sg.gridToHTML());			
					//html.add("xls");			
					//html.add(new Date().valueOf() +"_data");				
					//this.sg.useIframe(upDownHtml(html));			
					download(html, "xls");
				}else this.onXlsClick.call(this);
			}else if (sender == this.docBtn)
			{
				this.onBeforePrint.call(this);	
				var html = "";//new server_util_arrayList();
				if (this.outerHtml)
                    html = this.outerHtml;//.add(this.outerHtml);
                else				
				    html = this.printHeader + this.sg.gridToHTML();//.add(this.printHeader + this.sg.gridToHTML());			
				//html.add("doc");			
				//html.add(new Date().valueOf() +"_data");								
				//this.sg.useIframe(upDownHtml(html));		      
				download(html,"doc");
			}else 
			{			
				var script = "";
				var pos = 0;
				var tmp = this.activePage;
				this.onBeforePager.call(this, this.activePage);
				if (sender == this.leftBtn)
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
									 "this.imgBtn"+pos+".setCaption("+i+");"+
									 "this.imgBtn"+pos+".setHint('page "+i+"'); ";						
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
									 "this.imgBtn"+pos+".setCaption("+i+");"+
									 "this.imgBtn"+pos+".setHint('page "+i+"'); ";												
							eval(script);
						}					
					}	
					if (this.activePage < this.totalPage)
						this.activePage++;				
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
									 "this.imgBtn"+i+".setCaption("+i+");"+
									 "this.imgBtn"+i+".setHint('page "+i+"'); ";												
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
									 "this.imgBtn"+pos+".setCaption("+i+");"+
									 "this.imgBtn"+pos+".setHint('page "+i+"'); ";							
							eval(script);
						}
					}
				}else
					this.activePage = sender.getTag1();				
				if ((sender != this.firstBtn) && (sender != this.leftBtn) && (sender != this.rightBtn) && (sender != this.lastBtn))	
					this.setSelectedPage(sender);
				if (tmp != this.activePage){	
					if (this.dataUpload !== undefined) this.refreshGrid(this.activePage);
                    this.onPager.call(this, this.activePage, sender);
				}
			}
		}catch(e)
		{
			alert("[sgNavigator]::doClick:"+e+"\r\n"+sender.getName());
		}
	},
	rearrange: function(){
		this.activeBtn = undefined;
		var startPos = this.leftBtn.left + 22;
		var script = "";
		var totPage = this.totalPage;
		if (totPage  > 5 )
		{
			for (var i = 1; i <= 5; i++)
			{
				script = "this.imgBtn"+i+" = new control_imageButton(this); "+
						"this.imgBtn"+i+".setTop(2); "+
						"this.imgBtn"+i+".setLeft(startPos); "+
						"this.imgBtn"+i+".setWidth(22); "+
						"this.imgBtn"+i+".setHeight(22); "+
						"this.imgBtn"+i+".setImage('icon/"+system.getThemes()+"/imgBtn.png'); "+
						"this.imgBtn"+i+".setHint('"+i+" page'); "+
						"this.imgBtn"+i+".onClick.set(this,'doNavigatorClick');	"+	
						"this.imgBtn"+i+".setName('imgBtn"+i+"');	"+		
						"this.imgBtn"+i+".setTag1("+i+"); "+
						"this.imgBtn"+i+".setCaption("+i+"); "+
						"startPos = (this.leftBtn.left+22) + (22 * "+i+");";
				eval(script);
			}		
			this.rightBtn.setLeft(startPos);
			this.lastBtn.setLeft(startPos + 22);
			this.printBtn.setLeft(startPos + 44);
			this.xlsBtn.setLeft(startPos + 66);
			this.docBtn.setLeft(startPos + 88);
			this.loadBtn.setLeft(startPos + 110);
			this.lastBtn.setTag1(totPage);
		}else
		{		
			for (var i = 1; i <= totPage; i++)
			{
				script = "this.imgBtn"+i+" = new control_imageButton(this); "+
						"this.imgBtn"+i+".setTop(2); "+
						"this.imgBtn"+i+".setLeft(startPos); "+
						"this.imgBtn"+i+".setWidth(22); "+
						"this.imgBtn"+i+".setHeight(22); "+
						"this.imgBtn"+i+".setImage('icon/"+system.getThemes()+"/imgBtn.png'); "+
						"this.imgBtn"+i+".setHint('"+i+" page'); "+
						"this.imgBtn"+i+".onClick.set(this,'doNavigatorClick');	"+	
						"this.imgBtn"+i+".setName('imgBtn"+i+"');	"+		
						"this.imgBtn"+i+".setTag1("+i+"); "+
						"this.imgBtn"+i+".setCaption("+i+"); "+
						"startPos = (this.leftBtn.left+22) + (22 * "+i+");";
				eval(script);
			}		
			this.rightBtn.setLeft(startPos);
			this.lastBtn.setLeft(startPos + 22);
			this.printBtn.setLeft(startPos + 44);
			this.xlsBtn.setLeft(startPos + 66);
			this.docBtn.setLeft(startPos + 88);
			this.loadBtn.setLeft(startPos + 110);
			this.lastBtn.setTag1(totPage);
		}
		if (totPage > 0){
			this.activePage = 1;
			this.startPage = 1;
            this.setSelectedPage(this.imgBtn1);			
		}
	},
	setShowPager: function(data){
		this.showPager = data;
		if (this.showPager)
		{
			this.firstBtn.show();
			this.leftBtn.show();
			this.rightBtn.show();
			this.lastBtn.show();
		}else
		{
			this.firstBtn.hide();
			this.leftBtn.hide();
			this.rightBtn.hide();
			this.lastBtn.hide();
		}
	},
	setSelectedPage: function(sender){
		if (this.activeBtn != undefined)
			this.activeBtn.setImage("icon/"+system.getThemes()+"/imgBtn.png");
		sender.setImage("icon/"+system.getThemes()+"/imgSelect.png");	
		this.activeBtn = sender;
	},
	setButtonStyle: function(button){
		try{
			this.addBtn.hide();
			this.delBtn.hide();
			this.copyBtn.hide();
			this.upBtn.hide();
			this.downBtn.hide();
			this.firstBtn.hide();
			this.leftBtn.hide();
			this.rightBtn.hide();
			this.lastBtn.hide();
			this.printBtn.hide();
			this.xlsBtn.hide();
			this.docBtn.hide();
			this.loadBtn.hide();
			this.separator.hide();
			this.separator2.hide();
			
			if (this.totalPage  > 5 )
			{
				for (var i = 1; i <= 5; i++)
				{
					script = "this.imgBtn"+i+".hide();";
					eval(script);
				}		
			}else
			{		
				for (var i = 1; i <= this.totalPage; i++)
				{
					script = "this.imgBtn"+i+".hide();";
					eval(script);
				}	
			}
			if (button == -1){
				this.addBtn.show();
				this.delBtn.show();
				this.copyBtn.show();								
				this.separator.setLeft(this.copyBtn.left + this.copyBtn.width); 
				this.separator.show();				
				this.upBtn.show();this.upBtn.setLeft(this.separator.left + this.separator.width); 
				this.downBtn.show();this.downBtn.setLeft(this.upBtn.left + this.upBtn.width); 
				this.separator2.show();this.separator2.setLeft(this.downBtn.left + this.downBtn.width); 
				this.firstBtn.show();this.firstBtn.setLeft(this.separator2.left + this.separator2.width); 
				this.leftBtn.show();this.leftBtn.setLeft(this.firstBtn.left + this.firstBtn.width); 
				var init = this.leftBtn.left + this.leftBtn.width;
				var startPos = init;
				if (this.totalPage > 5){
					for (var i = 1; i <= 5; i++){
						script = "this.imgBtn"+i+".show();"+
								 "this.imgBtn"+i+".setLeft(startPos);"+
								 "startPos = init + (22 * "+i+");";
						eval(script);
					}
				}else{
					for (var i = 1; i <= this.totalPage; i++)
					{
						script = "this.imgBtn"+i+".show();"+
								 "this.imgBtn"+i+".setLeft(startPos);"+
								 "startPos = init + (22 * "+i+");";
						eval(script);
					}
				}				
				this.rightBtn.show();
				this.rightBtn.setLeft(startPos);			
				this.lastBtn.show();
				this.lastBtn.setLeft(startPos+22);
				this.printBtn.show();
				this.xlsBtn.show();
				this.docBtn.show();
				this.loadBtn.show();
				this.printBtn.setLeft(startPos + 44);
				this.xlsBtn.setLeft(startPos + 66);
				this.docBtn.setLeft(startPos + 88);
				this.loadBtn.setLeft(startPos + 110);
			}else if (button == 0)
			{
				this.addBtn.show();
				this.delBtn.show();
				this.copyBtn.show();
				this.separator.setLeft(this.copyBtn.left + this.copyBtn.width); 
				this.separator.show();				
				this.upBtn.show();this.upBtn.setLeft(this.separator.left + this.separator.width); 
				this.downBtn.show();this.downBtn.setLeft(this.upBtn.left + this.upBtn.width); 
				this.separator2.show();this.separator2.setLeft(this.downBtn.left + this.downBtn.width); 
				this.firstBtn.show();this.firstBtn.setLeft(this.separator2.left + this.separator2.width); 
				this.leftBtn.show();this.leftBtn.setLeft(this.firstBtn.left + this.firstBtn.width); 
				this.rightBtn.show();
				this.lastBtn.show();
				this.separator.show();
				this.separator2.show();
				if (this.totalPage  > 5 )
				{
					for (var i = 1; i <= 5; i++)
					{
						script = "this.imgBtn"+i+".show();";
						eval(script);
					}		
				}else
				{		
					for (var i = 1; i <= this.totalPage; i++)
					{
						script = "this.imgBtn"+i+".show();";
						eval(script);
					}	
				}
			}else if (button == 1)
			{
				this.addBtn.show();
				this.delBtn.show();
				this.copyBtn.show();
			}else if (button == 2)
			{
				this.addBtn.show();
				this.delBtn.show();
				this.copyBtn.show();							
				this.upBtn.show();
				this.downBtn.show();
				this.separator.setLeft(this.copyBtn.left + this.copyBtn.width); 
				this.separator.show();				
				this.upBtn.show();this.upBtn.setLeft(this.separator.left + this.separator.width); 
				this.downBtn.show();this.downBtn.setLeft(this.upBtn.left + this.upBtn.width); 				
			}else if (button == 3)
			{
				this.firstBtn.show();
				this.firstBtn.setLeft(2);
				this.leftBtn.show();
				this.leftBtn.setLeft(24);
				var startPos = 46;
				if (this.totalPage > 5)
				{
					for (var i = 1; i <= 5; i++)
					{
						script = "this.imgBtn"+i+".show();"+
								 "this.imgBtn"+i+".setLeft(startPos);"+
								 "startPos = 46 + (22 * "+i+");";
						eval(script);
					}
				}else
				{
					for (var i = 1; i <= this.totalPage; i++)
					{
						script = "this.imgBtn"+i+".show();"+
								 "this.imgBtn"+i+".setLeft(startPos);"+
								 "startPos = 46 + (22 * "+i+");";
						eval(script);
					}
				}
				
				this.rightBtn.show();
				this.rightBtn.setLeft(startPos);			
				this.lastBtn.show();
				this.lastBtn.setLeft(startPos+22);
				this.printBtn.show();			
				this.printBtn.setLeft(startPos + 44);			
			}else if (button == 4){
				this.firstBtn.show();
				this.firstBtn.setLeft(2);
				this.leftBtn.show();
				this.leftBtn.setLeft(24);
				var startPos = 46;
				if (this.totalPage > 5){
					for (var i = 1; i <= 5; i++){
						script = "this.imgBtn"+i+".show();"+
								 "this.imgBtn"+i+".setLeft(startPos);"+
								 "startPos = 46 + (22 * "+i+");";
						eval(script);
					}
				}else{
					for (var i = 1; i <= this.totalPage; i++)
					{
						script = "this.imgBtn"+i+".show();"+
								 "this.imgBtn"+i+".setLeft(startPos);"+
								 "startPos = 46 + (22 * "+i+");";
						eval(script);
					}
				}
				
				this.rightBtn.show();
				this.rightBtn.setLeft(startPos);			
				this.lastBtn.show();
				this.lastBtn.setLeft(startPos+22);
				this.printBtn.show();
				this.xlsBtn.show();
				this.docBtn.show();
				this.loadBtn.show();
				this.printBtn.setLeft(startPos + 44);
				this.xlsBtn.setLeft(startPos + 66);
				this.docBtn.setLeft(startPos + 88);
				this.loadBtn.setLeft(startPos + 110);
			}else if (button == 5) {	
				var startPos = 2;			
				this.printBtn.show();
				this.xlsBtn.show();
				this.docBtn.show();
				this.loadBtn.show();
				this.printBtn.setLeft(startPos);
				this.xlsBtn.setLeft(startPos + 22);
				this.docBtn.setLeft(startPos + 44);
			}else {				
				this.firstBtn.hide();				
				this.leftBtn.hide();				
				var startPos = 2;								
				this.rightBtn.hide();				
				this.lastBtn.hide();				
				this.printBtn.show();
				this.xlsBtn.show();
				this.docBtn.show();
				this.loadBtn.show();
				this.printBtn.setLeft(startPos);
				this.xlsBtn.setLeft(startPos + 22);
				this.docBtn.setLeft(startPos + 44);
				this.loadBtn.hide();			
			}
		}catch(e){
			alert("[setButtonStyle]:"+e);
		}		
	},
	doAfterLoad: function(sender, result, data){
		if (this.onAfterUpload.target)
            this.onAfterUpload.call(this, result, data);
        else {
            if (!result) {
                systemAPI.alert(this+"$upload()","Error Upload");
                return;
            }
            try{                                          		
        		if (data.rows.length > 50){
                    this.setTotalPage(Math.ceil(data.rows.length / this.pager));
                    this.rearrange();
                    this.recordCount = data.rows.length;
                    this.dataUpload = data;
                    this.refreshGrid(1);
                }        		
       		}catch(e){
       		   this.sg.hideLoading();
       		   systemAPI.alert(this+"$upload()",e);
            }
        }
	},
	refreshGrid: function(page){
	   try{
	        this.sg.clear();
    		this.sg.showLoading();
    		var line,lineData = [];	
    		var colIndex = 0;        		            
            if (this.dataUpload.rows.length == 0) return;
            var startIx = (page - 1) * this.pager;
            var finish = startIx + this.pager -1;        
            if (finish > this.dataUpload.rows.length) finish = this.dataUpload.rows.length -1;
            for(var i=startIx;i< finish;i++){
                line = data.rows[i];
            	lineData = [];
            	colIndex = 0;
            	for (var c in line) {
            		if (this.sg.columns.get(colIndex).columnFormat == cfNilai){
            			var value = line[c];            			
            			value = value.replace(",",".");
            			lineData.push(floatToNilai(parseFloat(value)));
            		}else
            			lineData.push(line[c]);        			
            		colIndex++;
            	}                   
            	this.sg.appendData(lineData);            	
            } 
            this.sg.setNoUrut(startIx);			
            this.sg.hideLoading();
            this.onRefreshGrid.call(this, this.sg);
  		}catch(e){
       		   this.sg.hideLoading();
       		   systemAPI.alert(this+"$upload()",e);
        }
    },
	setTotalPage: function(data){
		var totPage = this.totalPage;	
		if (totPage  > 5 ){
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
		this.startPage = 1;
		this.activePage = 1;
		this.totalPage = data;
		this.lastBtn.setTag1(data);
	},
	refreshPage: function(){
		if (this.sg != undefined) this.sg.hideFrame();
		this.onPager.call(this, this.activePage);
	},
	nextPage: function(){
		this.rightBtn.click();
	},
	prevPage: function(){
		this.leftBtn.click();
	},
	lastPage: function(){
		this.lastBtn.click();
	},
	firstPage: function(){
		this.firstBtn.click();
	}
});
