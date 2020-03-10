//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_reportViewer = function(owner,options){
	try{
		if (owner){
			this.caption = "";
			window.control_reportViewer.prototype.parent.constructor.call(this, owner,options);
			
			this.className = "control_reportViewer";
			this.owner = owner;
			this.bgColor = "#284b60";
			this.border = 1;	

			this.totalPage = 0;
			this.multiPage = false;			
			if (options !== undefined){
				this.updateByOptions(options);
			}				
		}
	}catch(e){
		alert("[reportViewer]::constructor:"+e);
	}
};
window.control_reportViewer.extend(window.control_containerControl);
window.reportViewer = window.control_reportViewer;
window.control_reportViewer.implement({
	draw: function(canvas){
		window.control_reportViewer.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html =  "<div id='" + n + "_border1' style='{position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-left: " + window.system.getConfig("3dborder.outer.right") + ";border-top: " + window.system.getConfig("3dborder.outer.bottom") + ";}'></div>" +
	                "<div id='" + n + "_border2' style='{position: absolute;left: -1;top: -1;width: 100%;height: 100%;border-right: " + window.system.getConfig("3dborder.outer.left") + ";border-bottom: " + window.system.getConfig("3dborder.outer.top") + ";}'></div>" +
					"<div id='" + n + "_lcap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;}'> </div>"+
					"<div id='" + n + "_cap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;color:#ffffff}'> </div>"+
					"<div id='" + n + "_rcap' style='{position: absolute;left: 0;top: 0; width:100%; height: 100%;}'> </div>"+
					"<div id='" + n + "_frame' style='{position: absolute; background:#ffffff;left: 10; top: 10; width: 100%; height: 100%;overflow:auto;}' >"+
	                "<div id='" + n + "_preview' style='{position: absolute; background:#ffffff;left: 10; top: 0; width: 100%; height: 100%;overflow:visible;}' align=center></div>"+
					"</div>"+
					"<div id='" + n + "form' style='{position: absolute;left: 0;top: 0; width:100%; height:30;background:#ffffff;}'> </div>"+
					"<iframe name='"+ n +"_iframe'  id ='"+ n +"_iframe' style='{display:none;position: absolute;left: 0;top: 0; width:100%; height: 100%;background:#ffffff}'></iframe>" +
					"<div id='"+ n +"_multiple' style='position:absolute;left:0;top:0;width:100%;height:100%;display:none;overflow:auto'></div>"+
					"<div id='"+ n +"_block' style='{background:"+system.getConfig("form.grid.color")+";display:none;position:absolute;left: 0;top: 0; width: 100%; height: 100%;}'>"+
						"<div style='{background:url(image/gridload.gif) center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'>"+
						"<span style='{position:absolute;left:49%;top:40%;width: 100%; height: 100%;}'>P r o c e s s i n g</span></div>"+
					"</div>";
	    this.setInnerHTML(html, canvas);
		this.block = $("#"+n+"_block"); 
		this.container = $("#"+ n +"_iframe");
		this.container.bind("load",{resId:this.resourceId},function(e){
			$$$(e.data.resId).frameLoad(e);
		});
	},
	showLoading: function(){
		this.block.show();
	},
	hideLoading: function(){
		this.block.hide();
	},
	setColor: function(data){
		this.bgColor = data;
		this.getCanvas().css({background : this.bgColor });
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){	
	    
	},
	setCaption: function(data){
		this.caption = data;
	},
	block: function(){
	    $("#"+this.getFullId() + "_block").show();
	},
	unblock: function(){
	   $("#"+this.getFullId() + "_block").hide();
	},
	prepare: function(){
		$("#"+this.getFullId() + "_preview").hide();
		$("#"+this.getFullId() + "_iframe").show();
		$("#"+this.getFullId() + "_frame").css({width : this.getWidth() - 20, height: this.getHeight() - 20});
	},
	getFrame: function(){
		return document.frames ? window.frames[this.getFullId() +"_iframe"] : $(this.getFullId()+"_iframe");
	},
	getFrameWindow: function(){
		return this.getFrame().contentWindow;
	},
	getFrameDocument: function(){
		return this.getFrame().document || this.getFrame().contentDocument;
	},
	getFrameBody: function(){
		return this.getFrameDocument().body;
	},	
	preview: function(html, append){
	    try{
			this.multiPage = false;
    		var cnv = $("#"+this.getFullId() + "_iframe");
    		if (cnv != undefined){
    			cnv.show();
    			//cnv.innerHTML = html;
				var winfram= window.frames[this.getFullId() +"_iframe"];
				if (append === undefined){					
					winfram.document.open();
					winfram.document.write("");
					winfram.document.close();
					winfram.document.open();
					winfram.document.write(loadCSS("server_util_laporan"));
				} else{
					var htmlTmp = this.getFrameBody().innerHTML;					
					winfram.document.open();
					winfram.document.write(loadCSS("server_util_laporan"));
					winfram.document.write(htmlTmp);
					winfram.document.write("<br>");
				}  				
				winfram.document.write("<div align='center'>");
    			winfram.document.write(html);
				winfram.document.write("</div>");
    			winfram.document.close();
    		}		
    		$("#"+this.getFullId() + "form").hide();
    		$("#"+this.getFullId() +"_multiple").hide();
	   }catch(e){
	       alert(e);
       }
	},
	getContent: function(){
		if (this.multiPage){			
			return $(this.getFullId() + "_iframe"+this.activePage).contentWindow.document.body.innerHTML;		
		}else 
			return this.container.get(0).contentWindow.document.body.innerHTML;		
	},
	setTotalPage: function(page){
		this.totalPage = page;	
	},
	getTotalPage: function(page){
		return this.totalPage;
	},
	doSelectedPage: function(sender, page){
		this.onSelectedsystem.call(sender, page);
	},
	doCloseClick: function(sender){	
		this.onCloseClick.call(sender);	
	},
	doAllClick: function(sender){
		this.onAllsystem.call(sender);
	},
	hideNavigator: function(sender){
	},
	enabledIframe: function(){
		$("#"+this.getFullId() +"_multiple").hide();    	
		$("#"+this.getFullId() + "_preview").hide();		
		$("#"+this.getFullId() + "_iframe").show();
	},
	useIframe: function(location){
		$("#"+this.getFullId() +"_multiple").hide();
		$("#"+this.getFullId() + "_preview").hide();	
		$("#"+this.getFullId() + "_iframe").show();
		$("#"+this.getFullId() + "_iframe").attr("src",location);
	},
	frameLoad: function(event){	
		hideProgress();
		hideStatus();		
	},
	frameUnload: function(event){
	},
	addButton: function(cnv, bound, id, first, hint){

		var node = $("<div id='"+this.getFullId()+"_btn"+id+"' style='cursor:pointer;position:absolute;left:"+bound[0]+";top:"+bound[1]+";width:"+bound[2]+";height:"+bound[3]+";-webkit-border-radius: 5px;-moz-border-radius: 5px;border:1px solid #f90;"+
				" background:url(icon/"+(first ? "buttonact.png":"button.png")+")no-repeat;text-align:center'></div>");
		
		cnv.append(node);
		node.bind("click",{resId:this.resourceId, id:id, hind:hint},function(e){
			$$$(e.data.resId).doButtonClick(e,e.data.id,e.data.hint);
		});
		node.bind("mouseover",{resId:this.resourceId, id:id, hind:hint},function(e){
			$$$(e.data.resId).doMouseOver(e,e.data.id,e.data.hint);
		});
	},
	doMouseOver: function(event,id, hint){
		var target = document.all ? event.srcElement : event.target;
		if (event.clientY + 10 < system.getScreenHeight())
			window.system.showHint(event.clientX, event.clientY, hint,true);
		else window.system.showHint(event.clientX, event.clientY, hint,true);    	        
		
	},
	doButtonClick: function(event, param){		
		try{			
			if (param != this.activePage){
				var n = this.getFullId();
				var cnv = $("#"+n + "_iframe"+this.activePage);
				var btn = $("#"+n + "_btn"+this.activePage);
				btn.css({background:"#dedede"});
				cnv.hide();
				$("#"+n + "_iframe"+param).show();
				$("#"+n + "_btn"+param).css({background:"#0099cc" });
				this.activePage = param;
			}
		}catch(e){
			alert(e);
		}
	},
	previewMultiPage: function(data, isUrl,caption){
		this.multiPage = true;
		this.activePage = 0;
		var n = this.getFullId();
		var tmp,cnv = $("#"+n + "_iframe");
    	cnv.hide();
    	cnv = $("#"+n+"_multiple");    	
    	cnv.show();
    	var innerCtrl  = "", first = true;    	
    	for (var i=0; i < data.length; i++){									
			innerCtrl += "<iframe name='"+ n +"_iframe"+i+"' id ='"+ n +"_iframe"+i+"' style='{display:"+(first ? "":"none")+";position: absolute;left: 0;top: 0; width:100%; height: 100%;background:#ffffff}'></iframe>";
			first = false;
		}				
		cnv.html (innerCtrl );
		var first = true, hint = "";
		for (var i=0; i < data.length; i++){									
			hint = ( caption[i] ? caption[i]: hint);
			this.addButton(cnv,[(40 * i) + 10 , 5, 30,30], i, first, hint);			
			tmp = $("#"+n+"_iframe"+i).get(0);
			if (tmp) {
				if (isUrl)
					tmp.src = data[i];
				else writeToIframe(n+"_iframe"+i, data[i]);
			}
			first = false;
		}		
		$("#"+n + "form").hide();
		this.doButtonClick(undefined, 0);
	}
});
