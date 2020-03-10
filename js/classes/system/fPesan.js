//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.system_fPesan = function(owner){
	try
	{
		if (owner)
		{
			this.formWidth = 520;
			this.formHeight = 220;
			window.system_fPesan.prototype.parent.constructor.call(this,owner);
			this.className = "system_fPesan";
			this.maximize();
			this.requester = undefined;
			this.centerize();			
			this.caption = "Alert Form";
			this.message = "";		
			this.msgType = 0;			
			this.mouseX = 0;
			this.mouseY = 0;
			var top = (this.getHeight() / 2) - 64;			
			uses("image;label");
			this.image = new image(this,{bound:[10,28,48,48], image:"image/themes/"+system.getThemes()+"/iconAlert.png"});			
			this.lblMessage = new label(this,{bound:[60,10,this.formWidth - 80,100],caption:"Alert"});			
			this.lblMessage.fnt.setColor("#0099cc");
			this.lblMessage.fnt.setBold(true);			
			this.lblMessage.getCanvas().css({overflow : "auto" });
			$("#"+this.lblMessage.getFullId() + "_caption").css({width : "auto", height : "auto" });
			
			this.lblDetMsg = new label(this, {bound:[10,120,this.formWidth - 20,48], caption:"Alert" });			
			this.lblDetMsg.fnt.setColor("#0099cc");						
			this.lblDetMsg.getCanvas().css({overflow : "auto", width : "auto", height : "auto" });			
			this.pButton = new panel(this, {bound:[0,this.formHeight - 70,this.formWidth+23,45], color:"#dedede",borderColor:"#fff"});						
			this.b1 = new button(this.pButton,{bound:[this.pButton.width - 120 ,10,80,25], color:"#33b5e5",click:"doClick", hint:"Ok", caption:"OK"});
			this.b2 = new button(this.pButton,{bound:[this.pButton.width - 220,10,80,25], click:"doClick", hint:"Cancel", caption:"Cancel"});			
						
			this.isClick = false;					
			this.onClose.set(this,"doClose");
			this.getCanvas().css({width:"100%",height:"100%"});
		}
	}catch(e)
	{
		alert("[fPesan]::contructor:"+e);
	}
};
window.system_fPesan.extend(window.commonForm);
window.system_fPesan.implement({
	doDraw: function(canvas){
		var n = this.getFullId();			
		var html = "<div id='"+n+"_bg' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;background:rgba(255,255,255,0.5);}' ></div>"+
					"<div id='"+n+"_frame' style='{border:1px #ffffff solid;background:#fff;;position: absolute; left: 0; top: 0; width: "+this.formWidth+"; height: "+this.formHeight+";overflow:hidden;}' >" +
						"<div id = '"+n+"_header' style='position:absolute;"+
						"left: 0; top: 0; height: 25; width: "+(this.formWidth).toString()+";cursor:pointer' "+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDown(event)' "+						
						" > </div>"+
						"<div style='position:absolute;width:100%;height:1px;background:#03A9F4;top:25px'></div>"+							
						"<div style='{position:absolute;background:url(icon/"+system.getThemes()+"/rBg.png) no-repeat;"+
						"left: "+(this.formWidth - 23).toString()+"; top: 0; height: 25; width: 23;cursor:pointer;}' "+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDown(event)' "+						
						"></div>"+				
						"<div id = '"+n+"form' style = 'position:absolute;left: 0; top: 25; height: "+(this.formHeight - 25).toString()+"px; width: "+this.formWidth+";}'"+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDownForm(event)' "+						
						"> </div>"+
					"</div>"+
					"<div id='"+n+"_hidden' style='{position: absolute; left: 0; top: 0; width: "+this.formWidth+"; height: "+this.formHeight+";border:1px solid #ff9900;display:none;}' "+						
					"></div>";				
		this.setInnerHTML(html, canvas);
		canvas.bind("mousemove",setEvent("$$$(" + this.resourceId + ").eventMouseMove(event);") );
		canvas.bind("mouseup",setEvent("$$$(" + this.resourceId + ").eventMouseUp(event);") );
		this.blockElm = $("#"+n +"_hidden");
		this.frameElm = $("#"+n +"_frame");	
		this.frameElm.shadow("raised");
	},
	setMessage: function(data){
		this.message = data;
	},
	setMsgType: function(data){
		this.msgType = data;
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
	show: function(message, type, addInfo){				
		switch(type)
		{
			case 0 :
				this.alert(type, message, addInfo);	
				break;
			case 2 :
				this.info(type, message, addInfo);
				break;
		}
	},
	alert: function(code, msg, addInfo, sender, event){	 
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
		this.b2.setVisible(false);		
		this.lblMessage.setCaption(msg);
		this.lblDetMsg.setCaption(addInfo);		
				
		this.setCaption("A l e r t");
		this.image.setImage("image/themes/"+system.getThemes()+"/iconAlert.png");
		this.event = event;			
		this.requester = sender;
		this.setActiveControl(this.b1);	
		this.showModal();		
		system.addMouseListener(this);
	},
	confirm: function(code, msg, requester, event, addInfo){
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
		this.b2.setVisible(true);	
		this.lblMessage.setCaption(msg);
		this.lblDetMsg.setCaption(addInfo);
		this.setCaption("C o n f i r m a t i o n");
		this.image.setImage("image/themes/"+system.getThemes()+"/iconConfirm.png");
		this.requester = requester;
		this.event = event;	
		this.setActiveControl(this.b1);    	
		this.showModal();	
		system.addMouseListener(this);	
	},
	info: function(code, msg, addInfo,sender, event){
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
		this.b2.setVisible(false);
		this.lblMessage.setCaption(msg);
		this.lblDetMsg.setCaption(addInfo);
		this.setCaption("I n f o r m a t i o n");
		this.image.setImage("image/themes/"+system.getThemes()+"/iconInfo.png");
		this.event = event;	
		this.requester = sender;
		this.setActiveControl(this.b1);
		this.showModal();	
		system.addMouseListener(this);
	},
	doClick: function(sender){	
		try
		{
			if (sender == this.b1)
			{
				if (this.event != undefined)
					this.modalResult = window.mrOk;
			}else 
			{
				if (this.event != undefined)
					this.modalResult = window.mrCancel;
			}		
			this.onModal = false;
			this.close();				
			var app = this.getApplication();
			app.setActiveForm(this.formRequester);
			if (this.formRequester.activeChildForm != undefined)
				this.formRequester.activeChildForm.setActiveControl(this.formRequester.activeChildForm.childs[0]);											
			this.formRequester.unblock();
			if (this.requester != undefined){	
			     if (window.childForm === undefined){
			         uses("childForm");
                 }
				if (this.requester instanceof childForm)
						this.requester.doModalResult(this.event, this.modalResult);				
				else if (this.requester instanceof commonForm && this.requester.doModalResult)
						this.requester.doModalResult(this.event, this.modalResult);				
			}
			this.free();
		}catch(e){
			alert(e);
		}
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
		window.system_fPesan.prototype.parent.doSysMouseDown.call(this,x, y, button, buttonState);
	},
	doSysMouseUp: function(x, y, button, buttonState){	
		window.system_fPesan.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.system_fPesan.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
		/*if (this.isClick)
		{		
			var newLeft = this.blockElm.style.left + (x - this.mouseX);
			var newTop = this.blockElm.style.top + (y - this.mouseY);
		
			//this.setLeft(newLeft);
			//this.setTop(newTop);
			this.blockElm.style.left = newLeft;
			this.blockElm.style.top = newTop;
			this.frameElm.style.left = newLeft;
			this.frameElm.style.top = newTop;
		
			this.mouseX = x;
			this.mouseY = y;		
		}*/
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
	showModal: function(){				
		this.b1.setFocus();
		window.system_fPesan.prototype.parent.showModal.call(this);
		this.centerize();
		this.b1.setFocus();
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
	doKeyDown: function(charCode, buttonState, keyCode){
	   if (keyCode == 27) this.b2.click();
	   if (keyCode == 13) this.b1.click();
    }
});
