//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.app_saku_fMain = function(owner)
{
	if (owner)
	{	
		try
		{
			window.app_saku_fMain.prototype.parent.constructor.call(this, owner);			
			this._mainButtonClick = new eventHandler();						
			this.title = "MANTIS";
			document.title = "MANTIS";
			this._isLogedIn	= false;
			this.app._kodeMenu = "MANTIS";
			this._userLog = "";
			this._lokasi = "";
			this._pp = "";
			this.setColor("#ffffff");
			this.alwaysLoad = true;
			this._openAccess = true;
			this.activeChildForm = undefined;
			this.centerize();				
			this.menuWidth = 300;	
			uses("control_popupForm;saiLabelEdit;saiEdit;image;imageButton;button;label;labelCustom;listItemControl;messagingViewItem;listItemFileControl;saiCBBL;panel;util_addOnLib;util_standar;arrayMap;saiCB;saiGrid;saiTreeGrid;");					
			this.className  = "fMain";			
			this.formCaption = "MANTIS";	
			this.setCaption(this.formCaption);
			this.maximize();	
			//this.bg = new image(this,{bound:[0,0,this.width, this.height], image:"image/linen_bg_tile.jpg"});									
			this.pChildForm = new panel(this,{bound:[0, 0, this.width, this.height], color:"#fff", border:3 });
			
			//this.iDrop = new image(this.pChildForm,{bound:[40,10,350,240], image:"image/logo/telkomindonesia.png"});
         
			//this.iLogo = new image(this.pChildForm,{bound:[500,10,300,300], image:"image/chart3.png"});
			
			//this.lSpace = new control(this.pChildForm, {bound:[400,250,450,30]});
			//this.lSpace.getCanvas().html("<p style='text-align:center;color:#3BA4FF;font:26px \"Myriad Pro\",\"Lucida Grande\", \"Lucida Sans Unicode\", Helvetica, Arial, Verdana, sans-serif;'>Financial Performance Analysis & Reporting Tools</p><p style='text-align:center;color:#3BA4FF'>v1.0 &copy2013 TELKOM INDONESIA</p>");
			this.pChildForm.getClientCanvas().css({overflow:"hidden"});
			//this.pChildForm.getCanvas().css({boxShadow:"0px 0px 20px #888888", borderRadius:"20px"});
			//this.pChildForm.getCanvas().shadow({type:"sides", sides:"hz-1"});
//--------------------------------------------------
			this.pChildForm.childTop = 0;
			this.childTop = 0;
			this.initiated = true;	
			this.firstInit = true;
			this.getClientCanvas().css({background : "#eee" });
			this.onSatuanChange = new eventHandler();
			
		}catch(e){
			systemAPI.alert("[fMain]::constructor:lib : " + e,"");
		}
	}	
};
window.app_saku_fMain.extend(window.form);
window.app_saku_fMain.implement({
	gotoLogin: function(){
		this.form = new app_saku_fLogin(this.pChildForm);
		this.form.setBound(0, 0, this.width, this.height);
		this.form.doAfterResize();
		this.form.show();
		if (window.parent.hideLoading == undefined && getCookie("roojuid")){			
			this.form.showLoading("Init Parameter");
			this.form.e0.hide();
			this.form.e1.hide();
			this.form.e0.setText(getCookie("roojuid"));
			this.form.e1.setText(getCookie("roojpwd"));
			//error_log(getCookie("rfcSetting") +":"+getCookie("dbSetting")+":"+getCookie("appState"));
			this.app._rfcSetting = getCookie("rfcSetting");
			this.app._dbSetting = getCookie("dbSetting");
			this.app._appState = getCookie("appState");								
		}
	},	
	hideMainComp: function(){
		this.form.maximize();				
	},
	initDashboard: function(){
		
	},
	doToolClick: function(sender){
		if (sender == this.lMenu){
			if (this.pMenu.isVisible()){
				this.pMenu.hide("slow");
				this.pChildForm.setLeft(0);
				this.dashboard.setLeft(0);
				this.dashboard.setWidth(this.width);
			}else {
				this.pMenu.show("slow");
				this.pChildForm.setLeft(this.menuWidth);
				this.dashboard.setLeft(this.menuWidth);
				this.dashboard.setWidth(this.width - this.menuWidth -2);
			}
		}
		
		if (sender == this.tClose){
			if (this.form !== undefined) this.form.free();
			this.form = undefined;
			this.pTrans.hide();
			this.pChildForm.hide();
			this.lCaption.setCaption(" ");
			this.pTool.hide();
			this.pMenu.show("slow");
			this.dashboard.setLeft(this.menuWidth);
			
			this.dashboard.show("slow");
			if (this.pMenu.isVisible()){
				this.dashboard.setLeft(this.menuWidth);
				this.dashboard.setWidth(this.width - this.menuWidth);
			}else {
				this.dashboard.setLeft(0);
				this.dashboard.setWidth(this.width);
			}
			this.lCaption.setCaption("MANTIS");
		}
		if (sender == this.tRef){
			this.doRecall();
		}
		if (sender == this.tLog){
			//system.confirm(this, "close", "Yakin akan logout?","");	
		}
	},
	doAfterLogin: function(){
		try{		    
			this.getClientCanvas().css({background : "#ffffff" });
			this.form.free();
			this.iLogo2 = new image(this,{bound:[this.width / 2 - 400,this.height / 2 - 233 + 60, 800, 466], image:"image/img_telkom.jpg"});
			this.iLogo3 = new image(this,{bound:[this.width - 200,this.height - 100, 123, 80], image:"image/telkom2.png"});
			this.app._dbSetting = "oramantis";
			this.app.dbLib = new util_dbLib(undefined, this.app._dbSetting);					
			this.dbLib = this.app.dbLib;
			this.dbLib.addListener(this);
			this.app._dbLib = this.app.dbLib;
			
			this.childTop = 0;
			this.pChildForm.setHeight(this.height - 95);
			this.pChildForm.setTop(95);
			this.pChildForm.setLeft(0);
			
			this.pChildForm.setWidth(this.width);
			//this.pChildForm.setShadow({type:"left"});
			uses("accordion;accordionNode;saiGrid;arrayMap;pageControl;childPage;system_fListData;treeView;treeNode;server_util_Map;timer;app_saku_modul_fInbox",true);
			this.pTool = new panel(this, {bound:[0,30,70,40], border:0, visible:true});
            this.pTool.getCanvas().css({backgroundColor:"transparent"});
            this.pTool.setScroll(false);
            this.tClose = new image(this.pTool, {bound:[5,10,20,20], image:"icon/close.png", click:[this,"doToolClick"], cursor:"pointer", showHint:true, hint:"Close"});
            this.tClose.setCursor("pointer");
            this.tRef = new image(this.pTool, {bound:[30,10,20,20], image:"icon/reload3.png", click:[this,"doToolClick"], cursor:"pointer", showHint:true, hint:"Refresh Form"});
            this.tRef.setCursor("pointer");

			this.toolbar = new panel(this, {bound:[0,0,this.width, 30], border:0 });//3BA4FF
			this.toolbar.getCanvas().css({backgroundColor:"#da251d", "border-bottom":"1px solid #0066CC"});
			this.toolbar.setScroll(false);
			this.lHeader = new label(this.toolbar, {bound:[this.width / 2 - 250,5,500,20],fontSize: 12, fontColor:"#fff",caption:"Telkom Indonesia", alignment:"center"});
			this.itlkm = new image(this.toolbar, {bound:[this.width / 2 + 65, 0,30,28], image:"image/whitetelkom.png"}); 
			this.eTCODE = new saiEdit(this.toolbar, {bound:[100,5,100,20], text:"",visible:false});
			this.iRun = new image(this.toolbar, {bound:[220,5,20,20], image:"icon/settings.png", click:[this,"doRunTCode"], visible:false});
			this.iShow = new image(this.toolbar, {bound:[100,3,20,20], image:"image/framePointRight.png", click:[this,"doToogleRunTCode"], showHint:true, hint:"Run TCODE"});
			this.iNew = new image(this.toolbar, {bound:[130,5,20,20], image:"icon/monitor.png", click:[this,"doToogleRunTCode"], showHint:true, hint:"New Window"});
			this.iHelp = new image(this.toolbar, {bound:[160,5,20,20], image:"icon/help.png", click:[this,"doShowHelp"], showHint:true, hint:"Show Help Panel"});
			
			
			///------- user info
			var self = this;
			this.lpanel = new panel(this, {bound:[this.width - 160,0,160,30], border:0,visible:true, color:"#b71c1c"});
			this.lpanel.getCanvas().css({zIndex:999});
			this.lUser = new label(this.lpanel, {bound:[45,10,100,20], color:"#fff", caption:this.app._namaUser,visible:true});
			this.tLog = new image(this.lpanel, {bound:[10,3,25,25], image:"icon/user_male.png", hint:"logout", click:[this,"doToolClick"]});
			this.lpanel.getClientCanvas().css({overflow:"hidden",cursor:"pointer"});
			this.lpanel.on("click", function(){
				//system.confirm(self, "close", "Yakin akan logout?","");
				if (self.lpanel.height == 180)
					self.lpanel.setHeight(30);
				else self.lpanel.setHeight(180);
			});

			this.iFotoUser = new control(this.lpanel, {bound:[40,40, 80, 80]});
			this.iFotoUser.getCanvas().html("<img src='./foto/"+this.app._userLog + "' width='100%'/>");
			this.iFotoUser.getCanvas().css({borderRadius:40, overflow:"hidden"});

			this.lSignOut = new label(this.lpanel, {bound: [15, 150, 100, 30], caption:"Sign Out", fontSize:11, color:"#ffffff"});
			this.lSignOut.on("click", function (){
				system.confirm(self, "close", "Yakin akan logout?","");
			});

			this.lChangePass = new label(this.lpanel, {bound: [90, 135, 100, 30], caption:"Change Password", fontSize:11, color:"#ffffff"});
			this.lChangePass.on("click", function (){
				self.pChangePass.show();
				self.pChangePass.setArrowMode(2);
				self.pChangePass.setArrowPosition(5,350);
				var node = sender.getCanvas();
				self.pChangePass.setTop(node.offset().top + 20 );
				self.pChangePass.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
				self.pChangePass.getCanvas().fadeIn("slow");
			});

			this.pChangePass = new control_popupForm(this.app);
			this.pChangePass.setBound(this.width - 420, 40,390, 250);
			this.pChangePass.setArrowMode(4);
			this.pChangePass.hide();
			var self = this;
			
			this.fOldPass = new saiLabelEdit(this.pChangePass,{bound:[20,20,330,20],labelWidth:150,caption:"Old Password",password:true,tag:9});		
			this.fNewPass = new saiLabelEdit(this.pChangePass,{bound:[20,45,330,20],labelWidth:150,caption:"New Password",password:true,tag:9});		
			this.fConfirmPass = new saiLabelEdit(this.pChangePass,{bound:[20,70,330,20],labelWidth:150,caption:"Confirm Password",password:true,tag:9});		
		
			this.bOk = new button(this.pChangePass, {bound:[180, 195,80,20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Submit", click:[this,"doFilter"]});
			this.bOk.setColor("green");
			this.bCancel = new button(this.pChangePass, {bound:[270, 195,80,20], icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
			this.bCancel.on("click", function (){
				self.pChangePass.hide();
			});
			this.bOk.on("click", function (){
				self.doChangePass();
			});
			//----------
			this.lCaption = new label(this, {bound:[70,40,1000,20],fontSize: 14, italics : true, fontColor:"#3BA4FF",caption:"MANTIS", alignment:"left"});
			//this.ePembagi = new saiCB(this,{bound:[this.width - 250,43,200,20], caption:"Satuan",items:["Miliar","Juta","Ribu","Mutlak"], change:[this, "doSatuanChange"]});
			this.getUserMenu();
			
			//this.iPin = new image(this, {bound:[this.width / 2 - 15,35,50,50], image:"image/pin-blue.png", click:[this,"doToolClick"]});
            this.pMenu = new panel(this, {bound:[0,96,this.menuWidth,this.height - 100], color:"rgba(255,255,255,1)" , border:1, visible:true });
			this.pMenu.setScroll(false);
			this.pAcc = new accordion(this.pMenu,{bound:[0,0,400,this.pMenu.height], click:[this,"doMenuClick"]});
			
			
			this.iRefr = new image(this.pMenu, {bound:[this.pMenu.width - 30,5,20,20], image:"icon/reload-2.png", click:[this,"doRefreshMenu"]});
			this.iRefr.setCursor("pointer");
			this.pChildForm.bringToFront();
			this.pChildForm.hide();
			//this.ePembagi.setText("Juta");
			this.app._pembagi = 1000000;

			this.pButton = new panel(this, {bound:[0,70,this.width, 25], color:"#ccc", visible:true, borderColor:"transparent"});
			this.pButton.setScroll(false);
			this.pButton.getCanvas().css("border-top","1px solid #bbb");
			this.lMenu = new button(this.toolbar, {bound:[20,3,70,24],icon:"icon/menu2.png", caption:"Menu", borderColor:"transparent", color:"transparent",hoverColor:"transparent", fontColor:"#fff",click:[this, "doToolClick"]});
			this.pTrans = new panel(this.pButton, {bound:[10,0,this.width,25], color:"#ccc",visible:false, borderColor:"transparent"});
			this.pTrans.setScroll(false);
			
			this.bSimpan = new button(this.pTrans, {bound:[20,1,80,20],  fontColor:"#fff",caption:"Save",icon:"icon/content-save.png", click:[this,"doToolClick"], cursor:"pointer"});
			this.bHapus = new button(this.pTrans, {bound:[120,1,80,20],  fontColor:"#fff",caption:"Delete",icon:"icon/delete.png", click:[this,"doToolClick"], cursor:"pointer"});
			this.bClear = new button(this.pTrans, {bound:[220,1,80,20],  fontColor:"#fff", caption:"Clear",icon:"icon/refresh.png", click:[this,"doToolClick"], cursor:"pointer"});


			this.setCaption("MANTIS");
						
			this.cMessage = new control(this,{bound:[this.width - 400,100,350,300]});
			this.cMessage.addStyle({background:"#ffffff", overflow:"hidden"});
			this.cMessage.setShadow();
			
			this._periode = this.app._periodeGAR;
			this.menuStr = "";																					
			this.addOnLib = this.app._addOnLib;						
			this.baris = true;												
			this.app._baris = 20;
			this.app._pernext = 1;
			this.cek = 1;			
					
			
			this.unblock();		
			this.createListData();		
			this.onSatuanChange = new eventHandler();	
			/*
			var data = this.dbLib.getDataProvider("select pesan, tanggal from exs_adminmsg order by tanggal desc", true);
			if (data && data.rs && data.rs.rows[0]){
				
				
			}else {
				this.cMessage.hide();
			}
			*/
			this.cMessage.hide();
			this.cHelp = new control(this,{bound:[this.iHelp.left - 20,40,350,100], visible:false});
			this.cHelp.addStyle({background:"#ffffff", overflow:"hidden"});
			this.cHelp.setShadow();
			// this.cHelp.setInnerHTML("<div style='height:20;width:100%;color:#ffffff;background:#DA241C'>SOP MANTIS</div><div  style='width:100%;height:100%;background:#ffffff;padding:10px'><a href='docs/sop_mantis.docx' target='_blank'>SOP Aplikasi MANTIS</a></div>");
		
			this.cHelp.setInnerHTML("<div style='height:20;width:100%;color:#ffffff;background:#DA241C;padding-left:10px;padding-top:5px'>Dokumen Petunjuk</div><div  style='width:100%;height:15;background:#ffffff;padding:10px'><a href='docs/sop_mantis.docx' target='_blank'>SOP MANTIS</a></div><div  style='width:100%;height:100%;background:#ffffff;padding:10px'><a href='docs/temUpl.xlsx' target='_blank'>Template Upload Batch Input</a></div>");
		

			this.lNotify = new control(this, {bound:[this.width - 50,35,30,30]});
			this.lNotify.getCanvas().html("<i class='fa fa-bell-o fa-2x' style='color:#DA241C;cursor:pointer'/><span style='position:absolute;left:0;top:0;background:#DA241C;color:white;border-radius:50%;padding:5px'>90</span>");

			
			//this.timer = new timer();
			//this.timer.setInterval(5000);
			//this.timer.onTimer(this, "doTimerWidget");
			//this.timer.start();
			//this.createDashboard();	
		}catch(e){
			alert(e);
		}
	},	
	doShowHelp: function(){
		this.cHelp.setLeft(this.iHelp.left - 20);
		this.cHelp.setVisible(!this.cHelp.visible);
		this.cHelp.bringToFront();
		if (this.cHelp.isVisible()){
			this.iHelp.setHint("Hide Help Panel");
		}else this.iHelp.setHint("Show Help Panel"); 
	},
	doSatuanChange: function(sender){
		if (sender.getText() === "Ribu"){
			this.app._pembagi = 1000;
		}else if (sender.getText() === "Juta"){
			this.app._pembagi = 1000000;
		}else if (sender.getText() === "Mutlak"){
			//system.alert(this,"Sementara untuk Nilai Mutlak summary level maximum bernilai 214783648 (2Milyar)","Untuk itu di sarankan menggunakan minimum dalam Juta");
			this.app._pembagi = 1;
		}else this.app._pembagi = 1000000000;
		this.onSatuanChange.call(this, this.app._pembagi);
	},
	doChangePass: function(sender){
		try {
			if (this.checkEmptyByTag([9])){
				if (this.fNewPass.getText() != this.fConfirmPass.getText()){
					system.alert(this, "Konfirmasi Password tidak sama", "Coba ulangi Password lagi");
					return;
				}
		
				var data = [];
				var items = {
					old_pass : this.fOldPass.getText(),
					new_pass : this.fNewPass.getText(),
					confirm_pass : this.fConfirmPass.getText()
				}
				data.push(items);
				// console.log(data);

				var self = this;
				this.app.services.callServices("financial_mantisMaster", "ChangePass", [self.app._lokasi, data] ,function(data){
					if (data == "process completed") {
						system.info(self, data,"");
					}else {
						system.alert(self, data,"");
					}
				});
			}	
		}catch(e){
			systemAPI.alert(e);
		}
	},
	doToogleRunTCode: function(sender){
		if (sender == this.iNew){
			this.openNewWindow();
			return;
		}
		if (this.eTCODE.isVisible()){
			this.eTCODE.hide();
			this.iRun.hide();
			this.iShow.setLeft(100);
			this.iNew.setLeft(130);
			this.iHelp.setLeft(160);
			this.iShow.setImage("image/framePointRight.png");
		}else{
			this.eTCODE.show();
			this.iRun.show();
			this.iShow.setLeft(250);
			this.iNew.setLeft(280);
			this.iHelp.setLeft(310);
			this.iShow.setImage("image/framePointLeft.png");
		}
	},
	doRefreshMenu: function(sender){
		this.getUserMenu();
	},
	doRunTCode : function(sender){
		this.runTCODE(this.eTCODE.getText());
	},
	createDashboard: function(){
		if (this.dashboard == undefined){
			if (this.app._roleid == "5" || this.app._roleid == "6" || this.app._roleid == "4" || this.app._roleid == "8" || this.app._roleid == "7"){
				uses("app_saku_fDashboard", true);	
				this.dashboard = new app_saku_fDashboard(this);
				this.dashboard.setBound(this.menuWidth,96, this.width - this.menuWidth-2, this.height - 96);
				
			}else{
				uses("app_saku_fDashboardUser", true);	
				// uses("app_saku_modul_fInbox", true);
				this.dashboard = new app_saku_fDashboardUser(this);
				// this.dashboard = new app_saku_modul_fInbox(this);
				this.dashboard.setBound(this.menuWidth,96, this.width - this.menuWidth-2, this.height - 96);
			
			}
		}else{
			if (this.dashboard.refreshList)
				this.dashboard.refreshList();
		}
		 //this.dashboard.setShadow({type:"left"});
   },
	initParam: function(str){	
		try{		
			if (str.search("<rows>") == -1) this.menuIsLoaded = false; 
			else this.menuIsLoaded = true;		

			this.menuXML = loadXMLDoc(str);		
			this.treev.setXMLData(this.menuXML);						
			this.setActiveControl(this.treev);
		}catch(e){
			system.alert(this,e,"");
		}
	},
	initLoad: function(){
		try{	   	  
			if (!this.menuIsLoaded){
				this.treev.show();				
			}
		}catch(e){
			system.alert(this,"[fMain]::initLoad :"+e,"");
		}
	},
	doModalResult : function(event, modalResult){
		if (event == "close" && modalResult == mrOk){
			if (setCookie){
				setCookie("roojuid","",-100);
				setCookie("roojpwd","",-100);
			}	
			
			this.app.services.callServices("financial_mantis","logout",[], function(data){
			});
                    
			//this.chat.stopPolling();
			//this.chat.free();
			this.app.restart();
			//this.treev.show();			
		}
		
	},
	bTutupClick: function(sender){	
		try{			
			if (this.form instanceof app_saku_fLogin && sender == this.bExit){
				return false;
			}			
			if (this.form == undefined){
				system.confirm(this, "close", "Yakin akan logout?","");	
				//this.app.restart();
				//this.treev.show();
				return false;
			}
			if ((sender == this.bTutup)||(sender == this.bExit)){
				window.system.closeAllMDIChild();
				this.form = undefined;
				this.pChildForm.hide();
				if (this.dashboard) {
					this.dashboard.show();		
				} 
			}
			
		}catch(e){
			error_log(e);
		}
	},
	setActiveForm: function(child){
		this.activeChildForm = child;
	},
	setFormCaption: function(caption){
		this.formCaption = caption;
		this.lCaption.setCaption(caption);
	},

	getformCaption: function(){
		return this.formCaption;
	},
	childFormConfig: function(child, formClick, formCaption, formType){
		this.setFormCaption(formCaption);
		this.activeChildForm = child;	
		this.pTrans.hide();
		switch(formType){
			case 99 :
				this.bSimpan.onClick.set(child, formClick);
				this.bHapus.onClick.set(child, formClick);
				this.bClear.onClick.set(child, formClick);
			break;
			default:
				this.pTrans.show();
				this.bSimpan.onClick.set(child, formClick);
				this.bHapus.onClick.set(child, formClick);
				this.bClear.onClick.set(child, formClick);
			break;

		}
		
	},
	mainButtonClick: function(sender){
		this._mainButtonClick.call(this, sender);
	},
	doMenuClick: function(item){
		try{		
			// alert(JSON.stringify(item.kode));
			var kodeForm = item.getKodeLain().toUpperCase();	
			if (item.getKodeLain() == '-') return;
			if (this.form != undefined) this.form.free();
			this.form = undefined;

			switch(kodeForm){
				case "U01I" :				
					window.location = ".";
					break;			
				default :
					showLoading();
					this.pChildForm.show();
					system.showProgress("load "+kodeForm);
				    uses("server_util_Map");
					fields = new server_util_Map();	
					values = new server_util_Map();	
					fields.set(0, "kode_form");		    			
					values.set(0, item.getKodeLain());
					this.tcode = item.getKodeLain();
					this.app._tcode = this.tcode;
					var temp = this.dbLib.locateData("m_form",fields, values, "form");
					// var temp = this.dbLib.locateData("m_form",fields, values, "form");         	
					this.alertFormLisence = false;
					if (temp != undefined && temp != "" )
					{				    								
						uses(temp,this.alwaysLoad);
						this.setFormCaption(item.getCaption());		
			
						this.activeFormClass = temp;
					// alert(this.app._tcode);
					// alert(this.app._kodeMenu);
						var script = "this.form = new "+temp+"(this.pChildForm,'"+item.kode+"' );"+
									"this.form.setTop(this.childTop); "+
									"this.form.setTabChildIndex(),this.form.show(); 	";
						eval(script);									
						this.form.bringToFront();
						this.form.getClientCanvas().css({ backgroundImage:"url(image/themes/dynpro/frameShadowBottom.png)",backgroundRepeat:"repeat-x"});
					};
					break;
			}
			if (this.form != undefined){		
				//this.pMenu.hide("slow");	
				this.pChildForm.setLeft(0);
				//this.lCaption.setLeft(this.pChildForm.left + 90);
				this.pButton.bringToFront();
				//this.iPin.bringToFront();
				this.pTool.show();
				//this.form.setShadow({radius : 0});
				//this.form.setShadow(true);
				//this.dashboard.hide();
			}
			system.hideProgress();
			this.setActiveControl(undefined);
			hideLoading();
		}catch(e){
			this.pChildForm.hide();
			hideLoading();
			// system.alert(this,"[fMain]::treeClick : " + e,"Error Class ::"+temp);
			system.hideProgress();
		}
	},
	doAfterResize: function(width, height){
		console.log("FmAINAfter ResizE "+ width +":"+height );
		this.setWidth(width);
		this.setHeight(height);
		if (this.form && this.form instanceof app_saku_fLogin){
			this.pChildForm.setWidth(width);
			this.pChildForm.setHeight(height);
			this.form.setWidth(width);
			this.form.setHeight(height);	
			this.form.doAfterResize(width, height);
		}
		
		if (this.pMenu){
			try{
				this.pChildForm.setWidth(width);
				this.pChildForm.setHeight(height - 95);
				
				
				if (this.form){
					this.form.maximize();
				}
				this.pMenu.setHeight(height - 100);
				this.iLogo2.setLeft( this.width / 2 - 400 );
				///this.iDrop.setLeft( this.width / 2 - 200 );
				this.toolbar.setWidth(width);
				this.pButton.setWidth(width);
				//this.ePembagi.setLeft(width - 250);
				//this.lUser.setLeft(width - 120);
				//this.tLog.setLeft(width - 30);
				this.lCaption.setLeft( this.pChildForm.left + 90 );
				this.cMessage.setLeft(this.width - 400);
				this.lpanel.setLeft(this.width - 160);		
					
				if(this.dashboard){
					if (this.pMenu.isVisible()){
						this.dashboard.setLeft(this.menuWidth);
						this.dashboard.setWidth(this.width - this.menuWidth - 2);
					}else {
						this.dashboard.setLeft(0);
						this.dashboard.setWidth(this.width);
					}
					this.dashboard.setHeight(height - 100);
				}


				this.lNotify.setLeft(width - 50);
			}catch(e){
				error_log("Resize :" + e);
			}
		}
		
	},
	getUserMenu: function(){  		   
	   var self = this;
	   this.app.services.callServices("financial_mantis","loadMenu",[this.app._kodeMenu], 
	   		function(data){
				// console.log(JSON.stringify(data));
				self.pAcc.clear();  
				var node;
				var dataMenu = new server_util_Map();
				var start = 1;
				if (data[0] && data[0].level_menu == 0){
					var start = 0;
				}
				for (var i = 0; i < data.length;i++){
					if (start == 0){
						data[i].level_menu = parseFloat(data[i].level_menu) + 1;		
					}
					if (node){
						// console.log(node.level +"-" + data[i].level_menu);
					}
					if (node == undefined){
						node = new accordionNode(self.pAcc);
					}else if (node.level == data[i].level_menu - 1){
						node = new accordionNode(node);
					}else if (node.level == data[i].level_menu){
						node = new accordionNode(node.owner);
					}else {
						while (node.owner instanceof control_accordionNode && node.level > data[i].level_menu){
							node = node.owner;
						}
						node = new accordionNode(node.owner);
					}
					dataMenu.set(data[i].kode_form, data[i]);
					node.setItemData({'id' : data[i].kode_menu, 'caption' : data[i].nama, 'idLain' : data[i].kode_form, icon: 'icon/window.png'});	
				}
				self.pAcc.data = dataMenu;
				self.pAcc.setFocus();	
				self.createDashboard();
				self.doToolClick(self.lMenu);
	  		 },function(data){
				   alert("Error "+ data);
			   }

	   );
	},
	
	initScreen: function(){
		try{			
			this.dbLib.getDataXMLA("select * from exs_menu where kode_klp = '"+this.app._kodeMenu+"'  or kode_klp = 'ALLMENU' order by kode_klp, rowindex", undefined, this);	            
		}catch(e){
			alert(e);
		}
	},
	
	pesan: function(type, message){ 
		this.sb.message(type, message);
	},
	doActivate: function(){
	},
	doClose: function(sender){		
		window.close();
		/*
		//-----
		this.dashboard.dataProvider2.unregister(this.dashboard.msgBoard.msg.sessionId);
		//-----
		if (window.parent) window.parent.frameLoader.style.zIndex = 0;
		this.app.restart();
		*/
	},//
	showProgress: function(sender){	
		system.showProgress();
	},
	hideProgress: function(sender){	
		system.hideProgress();
	},
	doSave: function(sender){
		if (this.pTrans.visible && this.bSimpan.visible && this.bSimpan.enable) this.bSimpan.click();
		else if (this.pTrans.visible && this.bEdit.visible && this.bEdit.enable) this.bEdit.click();
	},
	createSession: function(sender){		
		this.app.restart();
	},
	doMenuKeyDown: function(sender, keyCode){	
		if (keyCode == 13){		
			this.doExecuteMenu();
		}
	},
	doExecuteMenu: function(sender){
		if (this.runTCODE(this.cb1.getText()) ){
			var count = this.cb1.capacity(); 
			if (count == 50)  
				this.cb1.delItem((count - 1));		
			this.cb1.addItem(count, this.cb1.getText());
		}
	},
	runTCODE: function(tcode, param){
		try{
			if (this.app == undefined) this.app = this.getApplication();
			this.pChildForm.show();
						
			if (this.form != undefined) this.form.free();
			this.form = undefined;
			this.alertFormLisence = false;
			var temp = this.pAcc.data.get(tcode);
			// console.log(temp);
			// console.log(tcode);
			if (temp != undefined && temp != "")
			{
				
				//if (this.pAcc.data.get(tcode))
				{
					uses(temp.form,this.alwaysLoad);
					var script = "this.form = new "+temp.form+"(this.pChildForm, param);"+
									"this.form.setTop(this.childTop); "+
									"this.form.show();    	";
					eval(script);			
					this.form.bringToFront();
				}
				
			}else {
				system.alert(this, "Anda tidak ada otorisasi dengan TCode "+tcode,"Cek kembali otorisasi anda");
				this.pChildForm.hide();
			}
			if (this.form != undefined)
			{
				this.pMenu.hide("slow");	
				this.pChildForm.setLeft(0);
				this.lCaption.setLeft(this.pChildForm.left + 90);
				this.pButton.bringToFront();
				//this.iPin.bringToFront();
				this.pTool.show();
				//this.form.setShadow({radius : 0});
				//this.form.setShadow(true);
				this.dashboard.hide();
			} 
			
			return true;
		}catch(e){
			this.pChildForm.hide();
			error_log(e);
		}
	},
	doBtnList: function(sender){		
		//this.dashboard.setVisible(!this.dashboard.visible);
		//if (this.msgBoard.visible) this.msgBoard.bringToFront();		
		try{
			var login = new server_util_Map();
			login.set("user",this.app._defsapuid.uid);
			login.set("passwd",this.app._defsapuid.pwd);
			uses("util_rfc;system_fSystemInfo");
			if (this.app._sysInfo == undefined){
				this.app._sysInfo = new system_fSystemInfo(this.app);
			}
			if (this.app._rfc == undefined)
				this.app._rfc = new util_rfc(undefined,this.app._rfcSetting);		
			var info = this.app._rfc.getSAPInfo(login);		
			if (typeof info != "string"){
				this.app._sysInfo.setInfo(info, new arrayMap({items: this.app._dbInfo}));
				this.app._sysInfo.show();
			}else {
				system.alert(this, info);
			}
		}catch(e){
			error_log(e);
		}
	},
	
	gotoFrontEnd: function(sender){			
	},
	
	doFindText: function(sender){		
	},
	createListData: function(){
		try{
			uses("system_fListData");
			this.app._mainForm.listDataForm = new system_fListData(this.app);	
			this.app._mainForm.listDataForm.hide();					
		}catch(e){
			system.alert(this,e,"");
		}
	},
	loadLisence: function(){		
	},
	isValidLisence: function(form){
		return true;
	},
	doRecall: function(sender){	    
        if (this.form !== undefined){
        	var className = this.form.className;
			uses(className,true);			
            this.form.free();       
            this.form  = undefined;
            var script = "this.form = new "+className+"(this.pChildForm);"+
							"this.form.show();    	";

			eval(script);		
			//this.form.setShadow(true);            
			this.form.setTop(this.childTop);
			//this.form.bringToFront();            
            

        }       
    },
	loadWidgets: function(){				
	},
	doObjectReady: function(sender){		
	},
	doTimerWidget: function(sender){
		var data = this.dbLib.getDataProvider("select pesan, tanggal from exs_adminmsg order by tanggal desc", true);
		if (data && data.rs && data.rs.rows[0]){
			
			this.cMessage.setInnerHTML("<div style='height:20;width:100%;color:#ffffff;background:#DA241C'>Pesan dari Administrator</div><div  style='width:100%;height:100%;background:#ffffff;box-sizing: border-box;border: 1em solid transparent'>"+urldecode(data.rs.rows[0].pesan).replace(/\n/gi,"<br>").replace("\r","<br><br>")+"</div>");
		}		
	},
	updateWidget: function(){		
	},
	openNewWindow: function(sender){
		setCookie("roojuid",this.app._userLog,1);		
		setCookie("roojpwd",this.app._userPwd,1);		
		setCookie("dbSetting",this.app._dbSetting,1);
		setCookie("rfcSetting",this.app._rfcSetting,1);
		setCookie("appState",this.app._appState,1);
		setCookie("app",this.app.className,1);
		window.open("index.php");
	},
	openNewWindow2: function(sender){
		setCookie("roojuid","",-100);
		setCookie("roojpwd","",-100);	
		setCookie("dbSetting",this.app._dbSetting,-1);
		setCookie("rfcSetting",this.app._rfcSetting,-1);
		setCookie("appState",this.app._appState,-1);
		window.open(".");
	}
});
