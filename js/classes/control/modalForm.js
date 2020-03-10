//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_modalForm = function(owner){
	try
	{
		if (owner)
		{
			this.formWidth = 520;
			this.formHeight = 220;
			window.control_modalForm.prototype.parent.constructor.call(this,owner);
			this.className = "control_modalForm";
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
window.control_modalForm.extend(window.commonForm);
window.popupForm = window.control_modalForm;
window.control_modalForm.implement({
	doDraw: function(canvas){
		var n = this.getFullId();			
        var html =  "<div id='"+n+"_bg' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background:rgba(255,255,255,0);}' ></div>"+
                    "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: "+this.formWidth+"px; height: "+this.formHeight+"px;overflow:auto;background:#ffffff}' ></div>"+
                    "<div id='" + n + "_cap' style='{position: absolute; left: 0;top: 0; width:100%; height: 36;color:#ffffff;padding-left:10px;display:none}'> </div>"+
                    "<div id='" + n + "_loading' style='display: none; position: absolute; left: 0; top: 0; width: "+this.formWidth+"px; height: "+this.formHeight+"px;z-index:99}' align='center' >"+
                        "<div style='position:absolute;background:#4d7795; filter:alpha(opacity:40);opacity:0.7;moz-opacity:0.7;width:100%;left:0;top:0;height:100% '></div>"+
                        "<img id='"+n+"_imgloading' style='position:absolute;' width=60 height=60 src='image/progress/load.gif'/><br><div id='"+n+"_textloading' style='position:absolute;width:auto;font-style:italic;color:#ffffff'>Wait...</div>"+
                    "</div>";				
        this.setInnerHTML(html, canvas);
        this.clientCanvas = $("#" + n + "form");
        this.clientCanvas.on("mousemove", (e) =>{
            this.eventMouseMove(e);
        });
        this.clientCanvas.on("mouseup", (e) =>{
            this.eventMouseUp(e);
        });
        this.clientCanvas.on("mousedown", (e) =>{
            this.eventMouseUp(e);
        });
       
	},
    setArrowMode: function(mode){
		var n = this.getFullId();
		switch (mode){
			case 0 : 
				this.getCanvas().css({ overflow : "", background:"" });
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
		window.control_modalForm.prototype.parent.doSysMouseDown.call(this,x, y, button, buttonState);
	},
	doSysMouseUp: function(x, y, button, buttonState){	
		window.control_modalForm.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.control_modalForm.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
	},
	eventMouseUp: function(event){
		this.isClick = false;
		// this.blockElm.hide();
		// this.frameElm.show();
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
		$("#"+this.getFullId()+"_block").hide();
	},
	hide: function(){
		this.visible = false;
		this.getCanvas().fadeOut("slow");
	},
	showLoading: function(text){
		$("#"+this.getFullId()+"_loading").show();
		var cnv = $("#"+this.getFullId()+"_textloading");
		if (cnv) {
			cnv.text(text );
			var w = parseFloat(cnv.width());
			if (w > 200) {
				cnv.css({width : 200 });
				w = 200;
			}
			cnv.css({top : this.height / 2 + 30, left : this.width / 2 - (w / 2) });			
		}
		cnv =  $("#"+this.getFullId()+"_imgloading") ;
		if (cnv){
			cnv.css({top : this.height / 2 - 30, left : this.width / 2 - 30});			
		}
	},
	hideLoading : function(text){
		$("#"+this.getFullId()+"_loading").hide();
	}
	
});
