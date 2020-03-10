//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_rssReader = function(owner, options){
    if (owner)
    {
		this.caption = "";
		window.control_rssReader.prototype.parent.constructor.call(this, owner,options);		
		this.className = "control_rssReader";
		this.owner = owner;
		this.bgColor = system.getConfig("form.panel.color");
		this.setBorder(1);
		this.scrolling = false;
		this.site = "";
		this.xhrRSS = new XMLHttpRequest();
		var script = "doReadyState = function() {"+
					"	system.getResource("+this.resourceId+").doRequestReady("+this.resourceId+");"+
				"};";			
		eval(script);
		this.xhrRSS.onreadystatechange = doReadyState;	
		this.onRemove = new control_eventHandler();
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.url !== undefined) this.setSite(options.url,5,options.url);
			if (options.remove !== undefined) this.onRemove.set(options.remove[0],options.remove[1]);
		}
    }
};
window.control_rssReader.extend(window.control_containerControl);
//---------------------------- Function ----------------------------------------
window.control_rssReader.implement({
	draw: function(canvas){
		window.control_rssReader.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
		var html = "";    
		var nd = this.getCanvas();
		nd.style.background = system.getConfig("form.panel.color");
		nd.style.overflow = "hidden";		
		
		if (document.all)
			html =  "<div id='" + n + "_bottom' style='{background: url(icon/"+system.getThemes()+"/panelShadow.png) bottom left repeat-x; position: absolute; left: 0; top: 0; width:100%; height: 100%;display:none}' ></div>" +										
					"<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+					
					"<div id='" + n + "_content' frameborder='0' style='{position: absolute; left: 0; top: 20; width: 100%; height: 100%;overflow:auto}' ></div>"+					
					"<div id='" + n + "_loading' style='{background-color:#4d7795;background:url(image/gridload.gif) center center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'></div>"+						
					"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' >"+												
					"</div>"+
					"<div id='" + n + "_cap' style='{position: absolute;left:0;top: 0; width:100%; height: 20;color:#ffffff;padding-left:10px}'> </div>"+
					"<div id='" + n + "_icon' style='{background-image:url(icon/rss_16.png);background-position:top left;background-repeat:no-repeat;position: absolute;left: 5;top: 2; width:16; height: 16;display:'> </div>"+
					"<div id='" + n + "_options' style='{cursor:pointer;position: absolute;left: 0;top: 0; width:20; height: 20;background-image:url(icon/"+system.getThemes()+"/bCopy.png)}'> </div>"+
					"<div id='" + n + "_panel' style='display:none;position:absolute;left:0;top:20;height:30;width:100%;border:1px solid #0000ff;background:#a7bef8'> "+
						"<input id='"+ n +"_edit' style='position:absolute;left:10;top:5;height:20;width:100;' />"+
						"<div id='"+ n +"_save' style='{position:absolute;cursor:pointer;left: 0;top: 7; width:20; height: 20;background-image:url(icon/"+system.getThemes()+"/save.png)}'></div>"+
						"<div id='"+ n +"_refresh' style='{position:absolute;cursor:pointer;left: 0;top: 5; width:20; height: 20;background-image:url(icon/"+system.getThemes()+"/cancel.png)}'></div>"+
					"</div>";
		else
			html =  "<div id='" + n + "_bottom' style='{background: url(icon/"+system.getThemes()+"/panelShadow.png) bottom left repeat-x; position: absolute; left: 0; top: 0; width:100%; height: 100%;display:none}' ></div>" +										
					"<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+					
					"<div id='" + n + "_content' frameborder='0' style='{position: absolute; left: 0; top: 20; width: 100%; height: 100%;overflow:auto}' ></div>"+					
					"<div id='" + n + "_loading' style='{background-color:#4d7795;background:url(image/gridload.gif) center center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'></div>"+						
					"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' >"+												
					"</div>"+
					"<div id='" + n + "_cap' style='{position: absolute;left:0;top: 0; width:100%; height: 20;color:#ffffff;padding-left:10px}'> </div>"+
					"<div id='" + n + "_icon' style='{background-image:url(icon/rss_16.png);background-position:top left;background-repeat:no-repeat;position: absolute;left: 5;top: 2; width:16; height: 16;display:'> </div>"+
					"<div id='" + n + "_options' style='{cursor:pointer;position: absolute;left: 0;top: 0; width:20; height: 20;background:url(icon/"+system.getThemes()+"/bCopy.png)no-repeat}'> </div>"+
					"<div id='" + n + "_panel' style='display:none;position:absolute;left:0;top:20;height:30;width:100%;border:1px solid #0000ff;background:#a7bef8'> "+
						"<input id='"+ n +"_edit' style='position:absolute;left:10;top:5;height:20;width:100;' />"+
						"<div id='"+ n +"_save' style='{position:absolute;cursor:pointer;left: 0;top: 7; width:20; height: 20;background:url(icon/"+system.getThemes()+"/save.png)no-repeat}'></div>"+
						"<div id='"+ n +"_refresh' style='{position:absolute;cursor:pointer;left: 0;top: 5; width:20; height: 20;background:url(icon/"+system.getThemes()+"/cancel.png)no-repeat}'></div>"+
					"</div>";
		this.setInnerHTML(html, nd);
		this.content = $(n +"_content");		
		this.btnRefresh = $(n+"_options");
		this.icon = $(n+"_icon");
		this.loading = $(n+"_loading");
		this.capCont = $(n+"_cap");
		this.inputPath = $(n+"_edit");
		this.panelPath = $(n+"_panel");
		this.bSave = $(n+"_save");
		this.bRefresh = $(n+"_refresh");
		if (document.all){		
			this.btnRefresh.onclick = new Function("system.getResource("+this.resourceId+").viewOptions();");
			this.bRefresh.onclick = new Function("system.getResource("+this.resourceId+").refreshPage();");
			this.bSave.onclick = new Function("system.getResource("+this.resourceId+").doSaveSite();");
			nd.onclick = new Function("system.getResource("+this.resourceId+").doClick(event);");
			this.capCont.onmousedown  = new Function("system.getResource("+this.resourceId+").doMouseDown(event);");
			this.capCont.onmouseup = new Function("system.getResource("+this.resourceId+").doMouseUp(event);");			
		}else{
			this.btnRefresh.onclick = new Function("event","system.getResource("+this.resourceId+").viewOptions();");
			this.bRefresh.onclick = new Function("event","system.getResource("+this.resourceId+").refreshPage();");
			this.bSave.onclick = new Function("event","system.getResource("+this.resourceId+").doSaveSite();");
			nd.onclick = new Function("event","system.getResource("+this.resourceId+").doClick(event);");
			this.capCont.onmousedown  = new Function("event","system.getResource("+this.resourceId+").doMouseDown(event);");
			this.capCont.onmouseup = new Function("event","system.getResource("+this.resourceId+").doMouseUp(event);");
		}
		if (systemAPI.browser.msie && systemAPI.browser.version == 6){				
			DD_belatedPNG.fixPng(this.btnRefresh);DD_belatedPNG.fixPng(this.icon);DD_belatedPNG.fixPng(this.loading);
		}
	},	
	viewOptions: function(){
		this.panelPath.style.display = this.panelPath.style.display == "" ? "none":"";
	},
	doMouseDown: function(event){
		system.addMouseListener(this);
		this.isClick = true;
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	},
	doMouseUp: function(event){
		system.delMouseListener(this);
		this.isClick = false;
	},
	doSysMouseUp: function(x, y, button, buttonState){
		this.isClick = false;
		system.delMouseListener(this);
	},
	doSysMouseMove: function(x, y, button, buttonState){		
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
	doClick: function(event){
		this.bringToFront();
	},
	doSaveSite: function(){
		this.site = this.inputPath.value;
		this.getURL(this.site);			
	},
	refreshPage: function(){	
		try{
			this.onRemove.call(this);
			this.free();
		}catch(e){
			alert(e);
		}
	},
	showLoading: function(){
		this.loading.style.display = "";
	},
	hideLoading: function(){
		this.loading.style.display = "none";
	},
	setScroll: function(data){
		this.scrolling=data;
		var cnv = this.getClientCanvas();
		if (data)
			cnv.style.overflow="auto";
		else cnv.style.overflow="hidden";
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
		try{
		    if (this.border != data){
		        var node = undefined;
		        var n = this.getFullId();	       
		        switch (data)
		        {
		            case 0 : // none
		                    node = this.getCanvas();	                    
		                    if (node != undefined){
		                        node.style.border = "";	                        	                    
							}
		                    break;
		            case 1 : // raised
		                    node = this.getCanvas();
		                    if (node != undefined){
		                        node.style.borderRight = window.system.getConfig("3dborder.outer.left");
		                        node.style.borderBottom = window.system.getConfig("3dborder.outer.top");
								node.style.borderLeft = window.system.getConfig("3dborder.outer.right");
		                        node.style.borderTop = window.system.getConfig("3dborder.outer.bottom");
		                    }                    
		                    break;
		            case 2 : // lowered
		                    node = this.getCanvas();
		                    if (node != undefined){
		                        node.style.borderLeft = window.system.getConfig("3dborder.outer.left");
		                        node.style.borderTop = window.system.getConfig("3dborder.outer.top");
								node.style.borderRight = window.system.getConfig("3dborder.outer.right");
		                        node.style.borderBottom = window.system.getConfig("3dborder.outer.bottom");
		                    }	                    
		                    break;
					case 3 : // bordered
		                    node = this.getCanvas();
		                    if (node != undefined){
		                        node.style.borderLeft = window.system.getConfig("nonborder.inner.right");
		                        node.style.borderTop = window.system.getConfig("nonborder.inner.bottom");
								node.style.borderRight = window.system.getConfig("nonborder.inner.left");
		                        node.style.borderBottom = window.system.getConfig("nonborder.inner.top");
		                    }	                    
		                    break;
		        }
		    }
		}catch(e){
			systemAPI.alert(e);
		}
	},
	setBorderColor: function(data, options){		
		node = this.getCanvas();
		if (options == undefined){		
			if (node != undefined)
				node.style.border = data;	                        					
		}else{
			if (options.top) node.style.borderTop = data;
			if (options.left) node.style.borderLeft = data;
			if (options.right) node.style.borderRight = data;
			if (options.bottom) node.style.borderBottom = data;
		}
	},
	setCaption: function(data){
		this.caption = data;	
		if (this.caption != ""){
			var wdth = data.length * 6;
			var l = $(this.getFullId() + "_lcap");						
			var n = $(this.getFullId() + "_cap");
			if (n != undefined){				
				n.style.background = "url(image/tabBg.png) repeat-x";				
				n.innerHTML = "<div style='position:absolute;top:3;left:20;width:100%; height:100%;'><bold>"+data+" </bold></div>";
			}			
		}
	},
	block: function(){
	    var node = $(this.getFullId() + "_block");
	    if (node != undefined)
	        node.style.display = "";
	},
	setWidth: function(data){
		window.control_rssReader.prototype.parent.setWidth.call(this, data);		
		if (this.btnRefresh !== undefined) this.btnRefresh.style.left = data - 20;
		if (this.inputPath !== undefined) this.inputPath.style.width = data - 60;
		if (this.bSave !== undefined) this.bSave.style.left = data - 45;
		if (this.bRefresh !== undefined) this.bRefresh.style.left = data - 25;
	},
	setHeight: function(data){
		window.control_rssReader.prototype.parent.setHeight.call(this, data);		
		if (this.content !== undefined) this.content.style.height = data - 20;
	},
	unblock: function(){
	    var node = $(this.getFullId() + "_block");
	    if (node != undefined)
	        node.style.display = "none";
	},
	setShadow: function(data){
		var cnv = $(this.getFullId() + "_bottom");
		if (cnv != undefined){
			if (data) cnv.style.display = "";
			else cnv.style.display = "none";
		}
	},
	setSite: function(site,number, caption){
		try{			
			this.setCaption(caption);
			this.site = site;			
			this.inputPath.value = site;			
			this.getURL(this.site);
		}catch(e){
			alert(e);
		}
	},
	doRequestReady: function(resId){
		try{
			if (this.xhrRSS.readyState == 4){
				this.hideLoading();
				if (this.xhrRSS.status == 200){
					var res = this.xhrRSS.responseText;									
					system.getResource(this.resourceId).content.innerHTML = res;			
				}						
			}			
		}catch(e){
			//alert(e);			
			this.hideLoading();
		}
	},
	readRSS: function(rss,number){		
		var hrSwitch = true, authorSwitch = true, dateSwitch = true, doubleSpace = true, showBody = false, showTime12 = false, showTime24 = false, showTitle = true, altform = false, datefirst = false;
		if (arguments.length > 2)
			for (i=2; i<arguments.length; i++) {
				if (arguments[i] == "NOHR")
					hrSwitch = false;
				if (arguments[i] == "NOAUTHOR")
					authorSwitch = false;
				if (arguments[i] == "NODATE")
					dateSwitch = false;
				if (arguments[i] == "NODOUBLESPACE")
					doubleSpace = false;
				if (arguments[i] == "NOTITLE")
					showTitle = false;
				if (arguments[i] == "SHOWBODY")
					showBody = true;
				if (arguments[i] == "SHOWTIME12")
					showTime12 = true;
				if (arguments[i] == "SHOWTIME24")
					showTime24 = true;
				if (arguments[i] == "ALTDATEAUTH")
					altform = true;
				if (arguments[i] == "DATEFIRST")
					datefirst = true;
			}		
		this.items= loadXMLDoc(rss);		
		if(typeof(xmlDoc)!="undefined") {
		if(window.ActiveXObject) this.formatRSS(arguments[1]);
		else xmlDoc.onload=this.formatRSS;
	}
	},
	verify: function(){if(this.items.readyState!=4) return false;
	},
	formatRSS: function(number) {
		var items_count;
		var items = this.items;
		if ((number == 0) || (number > items.getElementsByTagName('item').length))
			items_count=items.getElementsByTagName('item').length;
		else
			items_count=number;
		var date=new Array(), time=new Array(), link=new Array(), title=new Array(), description=new Array(), guid=new Array(), body=new Array(), temp, temp2;
		for(var i=0; i<items_count; i++) {
			if(items.getElementsByTagName('item')[i].getElementsByTagName('dc:date').length==1)
				date[i]=items.getElementsByTagName('item')[i].getElementsByTagName('dc:date')[0];
			if(items.getElementsByTagName('item')[i].getElementsByTagName('link').length==1)
				link[i]=items.getElementsByTagName('item')[i].getElementsByTagName('link')[0];
			if(items.getElementsByTagName('item')[i].getElementsByTagName('guid').length==1)
				guid[i]=items.getElementsByTagName('item')[i].getElementsByTagName('guid')[0];
			if(items.getElementsByTagName('item')[i].getElementsByTagName('title').length==1)
				title[i]=items.getElementsByTagName('item')[i].getElementsByTagName('title')[0];
			if(items.getElementsByTagName('item')[i].getElementsByTagName('dc:creator').length==1)
				description[i]=items.getElementsByTagName('item')[i].getElementsByTagName('dc:creator')[0];
			if(items.getElementsByTagName('item')[i].getElementsByTagName('content:encoded').length==1)
				body[i]=items.getElementsByTagName('item')[i].getElementsByTagName('content:encoded')[0];
			temp = date[i].firstChild.nodeValue;
			date[i] = temp.substring(0,temp.indexOf("T"));
			if (showTime24)
				time[i] = temp.substring(temp.indexOf("T")+1,temp.indexOf("Z"));
			else if (showTime12) {
				temp2 = temp.substring(temp.indexOf("T")+1,temp.indexOf("T")+3);
				if (temp2 > 12)
					time[i] = temp2 - 12;
				else	
					time[i] = temp2;
				time[i] = time[i] + temp.substring(temp.indexOf("T")+3,temp.indexOf("Z"));
			}
		}
		if((description.length==0)&&(title.length==0)) return false;
		var ws=/\S/;
		var oDoc = this.content.contentWindow || this.content.contentDocument;
	    if (oDoc.document)
	        var doc = oDoc.document;	    
	    else return;
		for(var i=0; i<items_count; i++) {
			var title_w, link_w;
			if(document.all)
				title_w=(title.length>0)?title[i].text:"<i>Untitled</i>";
			else
				title_w=(title.length>0)?title[i].firstChild.nodeValue:"<i>Untitled</i>";
			link_w=(link.length>0)?link[i].firstChild.nodeValue:"";
			if (datefirst && !altform) {
				doc.write('<a class="rssdate">' + date[i]);
				if (showTime12 || showTime24) doc.write(' - ' + time[i]);
				doc.write(':</a><BR>');
			}
			if(link.length==0) link_w=(guid.length>0)?guid[i].firstChild.nodeValue:"";
			if(title.length>0) title_w=(!ws.test(title_w))?"<i>Untitled</i>":title_w;
			if (showTitle) doc.write('<div STYLE="word-wrap: break-word"><a href="'+link_w+'" class="rsslink" target="_parent">'+title_w+'</a></div>');
			if(showBody) doc.write(body[i].firstChild.nodeValue + '<BR>');
			if (dateSwitch & !altform & !datefirst) {
				doc.write('<a class="rssdate">(' + date[i]);
				if (showTime12 || showTime24) doc.write(' - ' + time[i]);
				doc.write(')</a><BR>');
			}
			if (authorSwitch && description.length>0 &!altform)
				doc.write('<a class="rssauthor"> by: '+description[i].firstChild.nodeValue+'</a><BR>');
			if (altform) {
				if (description[i].firstChild)
					doc.write('- <a class="rssauthor">' +description[i].firstChild.nodeValue+ '</a> :: <a class="rssdate">(' +date[i]+ ')</a><BR>');
				else
					doc.write('- <a class="rssauthor">No Name In Profile</a> :: <a class="rssdate">(' +date[i]+ ')</a><BR>');
			}
			if (hrSwitch) doc.write('<HR>'); if (doubleSpace) doc.write('<BR>');
		}
	},
	getURL: function(site){
		this.xhrRSS.open("GET", "urlReader.php?url="+site);				
		this.xhrRSS.send("");																	
	}
});
