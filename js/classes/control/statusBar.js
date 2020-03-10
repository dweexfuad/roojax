//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_statusBar = function(owner,options){
	if (owner){
		try{
			this.textWidth = 300;
			window.control_statusBar.prototype.parent.constructor.call(this,owner,options);			
			this.className = "control_statusBar";
			uses("control_timer");
			this.timer = new control_timer(this);
			this.timer.setInterval(10000);
			this.timer.onTimer.set(this, "timerTimer");
			this.autoHide = false;
			
		}catch(e){
			alert("statusbar:"+e);
		}
	}		
},
window.control_statusBar.extend(window.control_control);
window.statusBar = window.control_statusBar;
window.control_statusBar.implement({
	doDraw: function(canvas){
		var html = "<div id='"+this.getFullId()+"_frame' style='{position:absolute;left:0;top:-1;width:100%; height:100%;background:#333333}'>"+//
						"<div id='"+this.getFullId()+"_icon' style='{position:absolute;left:10;top:-4;width:100%; height:100%;}'></div>"+
				        "<div id='"+this.getFullId()+"_message' style='{position:absolute;left:50;top:4;width:auto; height:80%;color:#0099cc}'></div>"+
						"</div>"+
						"<div id='"+this.getFullId()+"_rightBg' style='{display:;position:absolute;left:500;top:0;width:25; height:35;background-image:url(image/themes/"+system.getThemes()+"/sbRight.png);background-repeat:no-repeat}'></div>"+
						"<div id='"+this.getFullId()+"_text1' style='{display:;position:absolute;left:500;top:0;width:400; color:#0099cc; height:100%;background-image:url(image/themes/"+system.getThemes()+"/sbCenter.png);background-repeat:no-repeat}'></div>"+
						"<div id='"+this.getFullId()+"_text2' style='{display:;align:center;position:absolute;left:500;top:0;color:#0099cc;width:100; height:100%;background-image:url(image/themes/"+system.getThemes()+"/sbCenter.png);background-repeat:no-repeat}'></div>"+
					"</div>";	             
	             
		this.setInnerHTML(html, canvas);
		this.frame = $("#"+this.getFullId() +"_frame");	
	},
	message: function(type, message){
		this.show();
		this.bringToFront();
		var icon = $("#"+this.getFullId() +"_icon");
		var psn = $("#"+this.getFullId() +"_message");
		psn.css({ color : "#0099cc" });
		switch(type)
		{
			case 0 :								
				icon.css({background : "url(image/themes/"+system.getThemes()+"/iconAlertSmall.png) no-repeat" });
				break;
			case 1 :				
				icon.css({background : "url(image/themes/"+system.getThemes()+"/iconConfirmSmall.png) no-repeat" });
				break;
			case 2 :							
				icon.css({background : "url(image/themes/"+system.getThemes()+"/iconInfoSmall.png) no-repeat" });
				break;
			case 3 :			//normal								
				icon.css({background : "" });
				break;
		}	
		
		psn.html ( message );
		psn.show();
		this.bringToFront();
		this.timer.setEnabled(true);
		psn.css({ width : this.width - this.textWidth - 80 });
	},
	clearMsg: function(type, message){
		this.message(3,"");
		$("#"+this.getFullId() +"_message").css({ background : "" });
		$("#"+this.getFullId() +"_message").hide();
		this.timer.setEnabled(false);		
		this.hide();
	},
	timerTimer: function(sender){
	    this.timer.setEnabled(false);
		if (this.autoHide)
			this.hide();
		this.clearMsg();
	},
	setAutoHide: function(data){
		this.autoHide = data;
	},
	setWidth: function(data){
		try{
			window.control_statusBar.prototype.parent.setWidth.call(this, data);	
			$("#"+this.getFullId()+"_rightBg").css({ left : data-6 });
			$("#"+this.getFullId()+"_text1").css({left : data- this.textWidth - 80 });		
			$("#"+this.getFullId()+"_text2").css({left : data-100 });				
		}catch(e){
			error_log("width:"+e);
		}
	},
	setText1: function(text, img){
		try{
			$("#"+this.getFullId()+"_text1").html ( (img != undefined ? "<img style='position:absolute;left:10;top:1' src='"+img+"' />":"")+"<span id='"+this.getFullId()+"_textValue1' style='position:absolute;left:35px;top:6px;width:auto;white-space: nowrap;'>"+text+"</span>" );
			var w = $("#"+this.getFullId()+"_textValue1").width() + 30;
			$("#"+this.getFullId()+"_textValue1").css({ left :  35 , top : 6 });
			if (w &&  w < 50) w = 100;
			$("#"+this.getFullId()+"_text1").css({ width :  w + 20, left : this.width - 100 - w - 20 });
			this.textWidth = w + 100;
		}catch(e){
			error_log(e);
		}
	},
	setText2: function(text){
		$("#"+this.getFullId()+"_text2").html ( "<span id='"+this.getFullId()+"_textValue1'style='position:absolute;left:10;top:6;width:auto;'>"+text+"</span>" );
	},
	show: function(){
		window.control_statusBar.prototype.parent.show.call(this);	
		var node = this.owner.getCanvas();
		var width = node.offsetWidth;
		var height = node.offsetHeight - this.owner.childTop - 23 - this.height;				
		if (this.app._mainForm.form){
			this.app._mainForm.form.setBound(0,this.owner.childTop,width,height);		
		}
	},
	hide: function(){
		window.control_statusBar.prototype.parent.hide.call(this);	
		var node = this.owner.getCanvas();
		var width = node.offsetWidth;
		var height = node.offsetHeight - this.owner.childTop  - 23;
		
		if (this.app._mainForm.form){
			this.app._mainForm.form.setBound(0,this.owner.childTop,width,height);		
		}
	}
});
