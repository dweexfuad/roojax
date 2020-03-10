//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_popupForm = function(owner){
	try
	{
		if (owner)
		{
			this.formWidth = 520;
			this.formHeight = 220;
			window.control_popupForm.prototype.parent.constructor.call(this,owner);
			this.className = "control_popupForm";
			this.centerize();			
			this.msgType = 0;			
			this.mouseX = 0;
			this.mouseY = 0;
			var top = (this.getHeight() / 2) - 64;			
			uses("image;label");
			this.onClose.set(this,"doClose");
			
		}
	}catch(e)
	{
		alert("[popupForm]::contructor:"+e);
	}
};
window.control_popupForm.extend(window.commonForm);
window.popupForm = window.control_popupForm;
window.control_popupForm.implement({
	doDraw: function(canvas){
		var n = this.getFullId();			
		var html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:auto;background:#ffffff}' ></div>"+
                        "<div id='" + n + "_cap' style='{position: absolute; left: 0;top: 0; width:100%; height: 36;color:#ffffff;padding-left:10px;display:none}'> </div>"+
                        "<div id='" + n + "_arrowContainer' style='overflow:hidden;position:absolute;height:100%;left:-10px;width:30px;display:none;overflow:hidden;background-color:transparent'>"+
                            "<div id='" + n + "_arrow' style='position:absolute;left:10px;width:20px;height:20px;background-color:ffffff;box-shadow:0px 5px 10px #888'></div> "+
                        "</div>";				
		this.setInnerHTML(html, canvas);
	},
    setArrowMode: function(mode){
		var n = this.getFullId();
		switch (mode){
			case 0 : 
				this.getCanvas().css({ overflow : "hidden" });
				$("#"+ n +"_arrowContainer").hide();
				$("#"+ n +"form").css({width:"100%",height:"100%",left:0,top:0});
				break;//none
			case 1 : 
				this.setBorder(0);
				this.getCanvas().css({ overflow : "", background:"" });
				$("#"+ n +"_arrowContainer").show();
				$("#"+ n +"_arrowContainer").css({width:25, height:"100%", top:0});
				$("#"+ n +"form").css({background:this.bgColor,borderRadius:"5px",boxShadow:"0px 5px 10px #888", width: $("#"+ n).width() - 15,height: "100%",left:15,top:0});
				$("#"+ n +"_arrow").css({background: this.bgColor, boxShadow:"0px 5px 10px #888", top : $("#" + n).height() / 2 - 10, left: 15, transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
				break;//left
			case 2 : 
                //top
                this.setBorder(0);
				this.getCanvas().css({ overflow : "", background:""  });
				$("#"+ n +"_arrowContainer").show();
				$("#"+ n +"_arrowContainer").css({width:"100%", height: 15,top: 0});
				$("#"+ n +"form").css({background:this.bgColor,borderRadius:"5px",boxShadow:"0px 5px 10px #888", width: "100%", height: this.height - 15,left: 0,top: 15});
				$("#"+ n +"_arrow").css({background: this.bgColor, boxShadow:"0px 5px 10px #888", top : 5, left: this.width / 2 - 15 , transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
				break;
			case 3 : 
                //right
                this.setBorder(0);
				this.getCanvas().css({ overflow : "", background:""  });
				$("#"+ n +"_arrowContainer").show();
				$("#"+ n +"_arrowContainer").css({width:25, left: this.width - 25});
				$("#"+ n +"form").css({background: this.bgColor, borderRadius:"5px",boxShadow:"0px 5px 10px #888", width: $("#"+ n).width() - 15,height: "100%",left:0,top:0});
				$("#"+ n +"_arrow").css({background: this.bgColor, boxShadow:"0px 5px 10px #888", top : $("#" + n).height() / 2 - 10, left: 15, transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
				break;
			case 4 : 
                //bottom
				this.setBorder(0);
				this.getCanvas().css({ overflow : "" });
				$("#"+ n +"_arrowContainer").show();
				$("#"+ n +"_arrowContainer").css({width:"100%", height: 25,top: this.height - 20});
				$("#"+ n +"form").css({background: this.bgColor, borderRadius:"5px",boxShadow:"0px 5px 10px #888", width: "100%", height: this.height - 20,left:0,top: 0});
				$("#"+ n +"_arrow").css({background: this.bgColor, boxShadow:"0px 5px 10px #888", top : - 10, left: this.width / 2 - 15 , transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
				break;
		}
	},
	setArrowPosition: function(top, left){
		$("#"+ this.getFullId() +"_arrow").css({top:top, left:left});
	},
	setCaption: function(data){
		var canvas = $("#"+this.getFullId()+"_header");
		if (canvas != undefined)
		{
			canvas.html("<div style='position:absolute;left: 10; top : 3; width:100%; height:100%;"+
					" font-family: " + window.system.getConfig("form.titleFontName") + "; font-size: " + 
					window.system.getConfig("form.titleFontSize") + "; font-color: " + 
					window.system.getConfig("form.titleFontColor") + ";'> "+data+"</div>" );	
		}		
	},
	
	doSysMouseDown: function(x, y, button, buttonState){	
		window.control_popupForm.prototype.parent.doSysMouseDown.call(this,x, y, button, buttonState);
	},
	doSysMouseUp: function(x, y, button, buttonState){	
		window.control_popupForm.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.control_popupForm.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
	},
	eventMouseUp: function(event){
		this.isClick = false;
		this.blockElm.hide();
		this.frameElm.show();
	},
	eventMouseMove: function(event){
	},
	doClose: function(sender){
		system.delMouseListener(this);
	},	
	centerize: function(){
	    
		var screenWidth = system.screenWidth;
	    var screenHeight = system.screenHeight;

	    this.setLeft(parseInt((screenWidth - this.width) / 2, 10));
	    this.setTop(parseInt((screenHeight - this.height) / 3, 10));
	},
	show: function(){
		this.visible = true;
		this.bringToFront();
		this.getCanvas().fadeIn("slow");
		this.activate();
	},
	hide: function(){
		this.visible = false;
		this.getCanvas().fadeOut("slow");
	}
	
});
