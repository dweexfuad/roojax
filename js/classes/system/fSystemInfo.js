//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.system_fSystemInfo = function(owner){
	try
	{
		if (owner)
		{
			this.formWidth = 500;
			this.formHeight = 420;
			window.system_fSystemInfo.prototype.parent.constructor.call(this,owner);
			this.className = "system_fSystemInfo";													
			this.maximize();
			this.requester = undefined;
			this.centerize();			
			this.caption = "System Info";
			this.message = "";		
			this.msgType = 0;			
			this.mouseX = 0;
			this.mouseY = 0;
			var top = (this.getHeight() / 2) - 64;			
			uses("saiMemo;panel;imageButton");				
			/*RFCPROTO:011
RFCCHARTYP:1100
RFCINTTYP:BIG
RFCFLOTYP:IE3
RFCDEST:telqas_Q00_00
RFCHOST:telqas
RFCSYSID:Q00
RFCDATABS:Q00
RFCDBHOST:telqas
RFCDBSYS:ORACLE
RFCSAPRL:701
RFCMACH: 324
RFCOPSYS:AIX
RFCTZONE: 25200
RFCDAYST:
RFCIPADDR:10.2.12.138
RFCKERNRL:701
RFCHOST2:telqas
RFCSI_RESV:
RFCIPV6ADDR:10.2.12.138 
			 * */
			this.p1 = new panel(this,{bound:[10,20,this.formWidth - 20,145],labelWidth:0, caption:"SAP"});	
			this.p1.eIP = new saiLabelEdit(this.p1,{bound:[10,1,200,20], caption:"IP Server", readOnly:true});
			this.p1.eSysID = new saiLabelEdit(this.p1,{bound:[10,2,200,20], caption:"System No.", readOnly:true});
			this.p1.eDATAB = new saiLabelEdit(this.p1,{bound:[10,3,200,20], caption:"Database", readOnly:true});
			this.p1.eHost = new saiLabelEdit(this.p1,{bound:[220,3,200,20], caption:"Host", readOnly:true});			
			this.p1.eDB = new saiLabelEdit(this.p1,{bound:[10,4,200,20], caption:"DBHost", readOnly:true});
			this.p1.eDBSys = new saiLabelEdit(this.p1,{bound:[220,4,200,20], caption:"DB. System", readOnly:true});
			this.p1.eOS = new saiLabelEdit(this.p1,{bound:[10,5,200,20], caption:"Op. System", readOnly:true});
			this.p1.rearrangeChild(25,23);
			this.p2 = new panel(this,{bound:[10,21,this.formWidth - 20,100],labelWidth:0, caption:"Database"});			
			this.p2.eIP = new saiLabelEdit(this.p2,{bound:[10,1,200,20], caption:"DB Server", readOnly:true});
			this.p2.eSysID = new saiLabelEdit(this.p2,{bound:[10,2,200,20], caption:"DB Engine.", readOnly:true});
			this.p2.eDATAB = new saiLabelEdit(this.p2,{bound:[10,3,200,20], caption:"Database", readOnly:true});
			this.p2.rearrangeChild(25,23);
			this.p3 = new panel(this,{bound:[10,22,this.formWidth - 20,80],labelWidth:0, caption:"Client"});			
			this.p3.eIP = new saiLabelEdit(this.p3,{bound:[10,1,200,20], caption:"Client", readOnly:true});
			this.p3.eUser = new saiLabelEdit(this.p3,{bound:[10,2,200,20], caption:"User", readOnly:true});			
			this.p3.rearrangeChild(25,23);
			this.rearrangeChild(20,23);
			this.pButton = new panel(this);
			this.pButton.setBound(0,this.formHeight - 50,this.formWidth,25);			
			this.pButton.setColor(system.getConfig("app.color.panel"));						
			this.b1 = new imageButton(this.pButton,{bound:[20,2,42,22], click:"doClick", hint:"Ok", image:"icon/"+system.getThemes()+"/bOkMed.png"});			
						
			this.isClick = false;					
			this.onClose.set(this,"doClose");
		}
	}catch(e)
	{
		alert("[fPesan]::contructor:"+e);
	}
};
window.system_fSystemInfo.extend(window.commonForm);
window.system_fSystemInfo.implement({
	doDraw: function(canvas){
		var n = this.getFullId();	
		canvas.style.background = "url(image/themes/dynpro/bg.png)";
		//canvas.style.height = 200;
		//canvas.style.width = 400;	
		var html = "<div id='"+n+"_frame' style='{border:1px #ffffff solid;background:#cbdbea;;position: absolute; left: 0; top: 0; width: "+this.formWidth+"; height: "+this.formHeight+";overflow:hidden;}' >" +
						"<div id = '"+n+"_header' style='{position:absolute;background:url(icon/"+system.getThemes()+"/formHeader.png) repeat;"+
						"left: 0; top: 0; height: 25; width: "+(this.formWidth - 23).toString()+";cursor:pointer;}' "+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDown(event)' "+
						//"onMouseMove='window.system.getResource("+this.resourceId+").eventMouseMove(event)' "+
						//"onMouseUp='window.system.getResource("+this.resourceId+").eventMouseUp(event)' "+
						" > </div>"+							
						"<div style='{position:absolute;background:url(icon/"+system.getThemes()+"/rBg.png) no-repeat;"+
						"left: "+(this.formWidth - 23).toString()+"; top: 0; height: 25; width: 23;cursor:pointer;}' "+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDown(event)' "+
						//"onMouseMove='window.system.getResource("+this.resourceId+").eventMouseMove(event)' "+
						//"onMouseUp='window.system.getResource("+this.resourceId+").eventMouseUp(event)' "+
						"></div>"+				
						"<div id = '"+n+"form' style = '{position:absolute;left: 0; top: 25; height: "+(this.formHeight - 25).toString()+"px; width: "+this.formWidth+";}'"+
						"onMouseDown='window.system.getResource("+this.resourceId+").eventMouseDownForm(event)' "+
						//"onMouseMove='window.system.getResource("+this.resourceId+").eventMouseMove(event)' "+
						//"onMouseUp='window.system.getResource("+this.resourceId+").eventMouseUp(event)' "+
						"> </div>"+
					"</div>"+
					"<div id='"+n+"_hidden' style='{position: absolute; left: 0; top: 0; width: "+this.formWidth+"; height: "+this.formHeight+";border:1px solid #ff9900;display:none;}' "+
						//"onMouseDown='system.getResource("+this.resourceId+").eventMouseDown(event)' "+
						//"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
						//"onMouseUp='system.getResource("+this.resourceId+").eventMouseUp(event)' "+
					"></div>";				
		this.setInnerHTML(html, canvas);
		eventOn(canvas,"mousemove","$$$(" + this.resourceId + ").eventMouseMove(event);");
		eventOn(canvas,"mouseup","$$$(" + this.resourceId + ").eventMouseUp(event);");
		this.blockElm = $(n +"_hidden");
		this.frameElm = $(n +"_frame");		
	},
	setMessage: function(data){
		this.message = data;
	},
	setMsgType: function(data){
		this.msgType = data;
	},
	setCaption: function(data){
		var canvas = $(this.getFullId()+"_header");
		if (canvas != undefined)
		{
			canvas.innerHTML = "<div style='position:absolute;left: 10; top : 3; width:100%; height:100%;"+
					" font-family: " + window.system.getConfig("form.titleFontName") + "; font-size: " + 
					window.system.getConfig("form.titleFontSize") + "; font-color: " + 
					window.system.getConfig("form.titleFontColor") + ";'> "+data+"</div>";	
		}		
	},
	show: function(sender, data){						
		this.frameElm.style.left = this.width / 2 - (this.formWidth / 2);
		this.frameElm.style.top = this.height / 2 - (this.formHeight / 2);
		this.blockElm.style.left = this.width / 2 - (this.formWidth / 2);
		this.blockElm.style.top = this.height / 2 - (this.formHeight / 2);
		this.formRequester = this.getApplication()._mainForm;		
		this.frameElm.style.color = "#00529B";
		this.frameElm.style.border = "1px solid #00529B";
		this.frameElm.style.backgroundColor = "#BDE5F8";		
		this.setCaption("System Info");
		this.requester = sender;
		this.setActiveControl(this.b1);	
		this.showModal();
		system.addMouseListener(this);	
	},	
	doClick: function(sender){	
		try		
		{
			system.delMouseListener(this);				
			this.onModal = false;
			this.close();
			var app = this.getApplication();
			app.setActiveForm(this.formRequester);
			this.formRequester.unblock();			
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
			this.blockElm.style.display = "";
			this.frameElm.style.display = "none";
		}
		this.activate();
	},
	doSysMouseDown: function(x, y, button, buttonState){	
		window.system_fSystemInfo.prototype.parent.doSysMouseDown.call(this,x, y, button, buttonState);
	},
	doSysMouseUp: function(x, y, button, buttonState){	
		window.system_fSystemInfo.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.system_fSystemInfo.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);		
	},
	eventMouseUp: function(event){
		this.isClick = false;
		this.blockElm.style.display = "none";
		this.frameElm.style.display = "";
	},
	eventMouseMove: function(event){
		if (this.isClick){
			
			var x = event.clientX;
			var y = event.clientY;
			var newLeft = parseFloat(this.blockElm.style.left) + (x - this.mouseX);
			var newTop = parseFloat(this.blockElm.style.top) + (y - this.mouseY);
								
			this.blockElm.style.left = newLeft;
			this.blockElm.style.top = newTop;			
			this.frameElm.style.left = newLeft;
			this.frameElm.style.top = newTop;			
			
			this.mouseX = x;
			this.mouseY = y;
		}
	},
	showModal: function(){				
		this.b1.setFocus();
		window.system_fSystemInfo.prototype.parent.showModal.call(this);
		this.centerize();
		this.b1.setFocus();
	},
	doClose: function(sender){
		system.delMouseListener(this);
	},	
	centerize: function(){
	    var system = $("systemform");
		var screenWidth = system.offsetWidth;
	    var screenHeight = system.offsetHeight;

	    this.setLeft(parseInt((screenWidth - this.width) / 2, 10));
	    this.setTop(parseInt((screenHeight - this.height) / 3, 10));
	},
	doKeyDown: function(charCode, buttonState, keyCode){
	   if (keyCode == 27) this.b2.click();
	   if (keyCode == 13) this.b1.click();
    },
    setInfo: function(sapInfo, sysInfo){
		this.p1.eIP.setText(sapInfo.get("RFCIPADDR"));
		this.p1.eSysID.setText(sapInfo.get("RFCSYSID"));
		this.p1.eDATAB.setText(sapInfo.get("RFCDATABS"));
		this.p1.eHost.setText(sapInfo.get("RFCHOST"));
		this.p1.eDB.setText(sapInfo.get("RFCDBHOST"));
		this.p1.eDBSys.setText(sapInfo.get("RFCDBSYS"));
		this.p1.eOS.setText(sapInfo.get("RFCOPSYS"));
		
		this.p2.eIP.setText(sysInfo.get("host"));
		this.p2.eSysID.setText(sysInfo.get("engine"));
		this.p2.eDATAB.setText(sysInfo.get("name"));
		this.p3.eIP.setText(sysInfo.get("ip"));
		this.p3.eUser.setText(this.app._userLog+":"+this.app._namaUser);
	}
});
