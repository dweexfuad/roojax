//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.app_saku_fLogin = function(owner){
	if (owner){
		try{		
			window.app_saku_fLogin.prototype.parent.constructor.call(this, owner);
			this.className  = "app_saku_fLogin";						
			this.maximize();								
            
			//------------------------ login data ------------------------				
			this.setColor("black");
			this.img = new image(this,{bound:[0,0,this.width,this.height], image:"image/z1.jpg"});
			this.img.setProportional(0);			
			this.panel = new panel(this, {bound:[5,0, 500, 280], color:"rgba(255,255,255,0.6)"});
			this.panel.getClientCanvas().css({overflow:"hidden",left:0});

			this.header_mantis = new image(this.panel,{bound:[300-200, 20, 300, 100], image:"image/mantis3.PNG"});

			
			this.e0 = new saiLabelEdit(this.panel,{bound:[25,140,450,30],caption:"User Name",placeHolder:true, text:"",name:"e0",autoComplete:false, underline:false});						
			this.e1 = new saiLabelEdit(this.panel,{bound:[25,173,450,30],caption:"Password",placeHolder:true, password:true,name:"e1",text:"", underline:false, keyDown:[this, "keyDown"]});
			var self = this;
			this.bLogin = new button(this.panel, {bound:[300 - 100,220, 80,30],icon:"icon/account.png", caption:"Login"});
			this.bLogin.setColor("#127859");
			this.l_titleV = new label(this.panel,{bound:[280, 470, 340, 25], visible:false, caption:"v2 by", fontSize:10, alignment:"center",color:"#2a2a2a"});
			this.img2 = new image(this.panel,{bound:[400, 220, 75,50], image:"image/logo/telkomindonesia.png"});
			this.bLogin.on("click", function(){
				try{
					self.showLoading("Loading...");
					// alert(data);
				 	self.app.services.call("callServices",["financial_mantis","login",[self.e0.getText(), self.e1.getText()]], function(data){
						try{
							if (data.type == 1){
								self.app.alert(data.msg, 200);
							}else {
								//{"kode_klp_menu":"RRA","nik":"650882","nama":"Asep Fiki",
								//"pass":"0cc175b9c0f1b6a831c399e269772661","status_admin":"A","klp_akses":"ADMIN","kode_lokasi":"01","nmlok":"PT TELKOM","kode_ubis":"-","kode_gubis":"-","nik_app1":null,"nik_app2":null,"nik_app3":null,"kode_kota":"BDG","kode_ba":"-","nmubis":"-","nmgubis":"-","kode_cc":"-","status":"FC","sts_locked":"0","singkatan":null},"type":0,"msg":"","periode":"201710","serverinfo":[],"portalinfo":[],"session":"a11f0ecb27f41a95ce6e96139f006e06"}
								// console.log(JSON.stringify(data));
								
								self.app.services.userid = self.e0.getText();						
								self.app._userPwd = self.e1.getText();
								self.app._isLogedIn = true;				
								self.app._userLog = self.e0.getText();
								self.app._lokasi = data.userdata.company_id;
								self.app._kodeMenu = data.userdata.kode_klp_menu;
								self.app._namalokasi = data.userdata.company_name;				
								self.app._userStatus = data.userdata.is_active;
								self.app._namaUser = data.userdata.firstname;
								self.app._jabatanUser = data.userdata.jabatan;
								self.app._kodeUbis = data.userdata.kode_ubis;
								self.app._fcbp = data.userdata.FCBP_2;
								self.app._akses = data.userdata.access;
								self.app._roleid = data.userdata.role_id;
			
							
								
								var tmpDate=new Date();
								var tmp="";				
								self.app._loginTime = tmpDate;
								self.app._nikUser= tmp.concat(self.e0.getText(),"_",tmpDate.valueOf());				
								self.app._periodeSys = data.periode;
								self.app._periodeCurrent = data.periode;
								self.app._periode = data.periode;
								//--krn periode report adalah periode berjalan - 1
								var bln = parseFloat(self.app._periode.substr(4,2));
								var thn = parseFloat(self.app._periode.substr(0,4));
								// if (bln == 1) {
								// 	thn--;
								// 	bln = 12;
								// }else {
								// 	bln--;
								// }
								// if (bln < 10) bln = '0' + bln;
								// self.app._periode = thn.toString() + bln.toString();
			
								self.app._year = thn;
								self.app._prevyear = (thn - 1).toString();
				//------------------------------------------------------------------- locking transaction													
								//------------- server info				
								self.app._userSession = data.session;
								self.app._dataUser = data;
								self.app.services.userid = self.e0.getText();
								self.app.services.session = data.session;
								self.app.services.session = data.session;
								//
								if (data.token)
									self.app.services.token = data.token;
								self.app._mainForm.doAfterLogin();	
								setCookie("roojuid","",-1);		
								setCookie("roojpwd","",-1);		

							}
						}catch(e){
							console.log(e);
						}
						self.hideLoading();
					},function(data){
						alert(JSON.stringify(data));
						self.hideLoading();
					});
				}catch(e){
					console.log(e)
				}
				
			});
						
			this.rearrangeChild(20,35);				
			this.setTabChildIndex();
			this.e0.setFocus();				
			this.app._rfcSetting = "rra/sap";
			this.app._dbSetting = "oramantis";			
			this.app._appState = "P00";			
			this.app._sapOnline = true;		
			this.app._pembagi = 1000000000;	
            this.panel.setLeft(this.width / 2 - 240);
			this.panel.setTop(this.height - 470);
			this.onClose.set(this,"doClose");
			if (getCookie("roojuid")){
				this.e0.setText(getCookie("roojuid"));
				this.e1.setText(getCookie("roojpwd"));
				this.bLogin.click();
				setCookie("roojuid","",-1);		
				setCookie("roojpwd","",-1);		
			}
		}catch(e){
			systemAPI.alert(this,"[app_saku_fLogin]::oncreate lib : "+e);
		}
	}
};
window.app_saku_fLogin.extend(window.childForm);
window.app_saku_fLogin.implement({
	doClose : function(sender){
		this.dbLib.delListener(this);
	},
	doSelectionChange: function(sender, value){
		
		this.app._dbSetting = "oramantis";
		this.app._rfcSetting = "rra/sap";
		this.app._appState = "P00";
		
	},
	
    mainButtonClick: function(sender){
		try{
        //    $("#loading_img").attr("src","image/progress/219.gif");
			var self = this;
			this.showLoading("Loading....");			
			if (this.app == undefined) this.app = this.getApplication();			
			this.e0.blur();
			this.e1.blur();			
			this.app._isLogedIn = false;
			this.app.dbLib = new util_dbLib(undefined, this.app._dbSetting);					
			this.dbLib = this.app.dbLib;
			this.dbLib.addListener(this);
			this.app._dbLib = this.app.dbLib;			
			this.app._addOnLib = new util_addOnLib(); 
			this.app.services.login(this.e0.getText(),this.e1.getText(), function(data){
				console.log(JSON.stringify(data) );
				if (data.userdata){
					self.app.services.userid = self.e0.getText();						
					self.app._userPwd = self.e1.getText();
					self.app._isLogedIn = true;				
					self.app._userLog = self.e0.getText();
					self.app._lokasi = data.userdata.kode_lokasi;
					self.app._kodeMenu = data.userdata.kode_klp_menu;
					self.app._namalokasi = data.userdata.nmlokasi;				
					self.app._userStatus = data.userdata.status;
					self.app._namaUser = data.userdata.nama;
					self.app._kodeUbis = data.userdata.kode_ubis;
					self.app._kodeCC = data.userdata.kode_cc;

					self.app._akses = data.userdata.akses;

					self.app._kodeGubis = data.userdata.kode_induk;
					self.app._kodeBA = data.userdata.kode_ubis;
					self.app._statusUser = data.userdata.status_admin;
					self.app._cfu = data.userdata.kode_cfu;
					
					var tmpDate=new Date();
					var tmp="";				
					self.app._loginTime = tmpDate;
					self.app._nikUser= tmp.concat(self.e0.getText(),"_",tmpDate.valueOf());				
					self.app._periodeSys = data.periode;
					self.app._periodeCurrent = data.periode;
					self.app._periode = data.periode;
					//--krn periode report adalah periode berjalan - 1
					var bln = parseFloat(self.app._periode.substr(4,2));
					var thn = parseFloat(self.app._periode.substr(0,4));
					if (bln == 1) {
						thn--;
						bln = 12;
					}else {
						bln--;
					}
					if (bln < 10) bln = '0' + bln;
					self.app._periode = thn.toString() + bln.toString();

					self.app._year = thn;
					self.app._prevyear = (thn - 1).toString();
	//------------------------------------------------------------------- locking transaction													
					//------------- server info				
					self.app._userSession = data.session;
					self.app.services.setSession( data.session );
					self.app._uri = data.path;
					self.app._rootDir = data.root;	
					//----------------- klp Akses			
					self.app._mainForm.doAfterLogin();	
				}else{
					alert(JSON.stringify(data));
				}															
				system.hideProgress();		
				self.hideLoading();
			}, function(error){
				self.hideLoading();
				system.hideProgress();		
			});	
			/*
			
            this.dbLib.loginAndLoad("select  a.kode_klp_menu, a.nik, a.nama, a.pass, a.status_admin, a.klp_akses, a.kode_lokasi,b.nama as nmlok "+
						"			, c.kode_ubis, d.kode_induk, c.kode_kota, c.kode_ba, c.kode_cc, c.status, c.cfu  "+
						"	from exs_hakakses a "+
						"		inner join bpc_lokasi b on b.kode_lokasi = a.kode_lokasi or b.cocd = a.kode_lokasi "+
						"		inner join exs_karyawan c on c.nik = a.nik and c.kode_lokasi = a.kode_lokasi "+
						"		left outer join (select kode_ubis, nama, kode_lokasi, kode_induk from exs_ubis union select kode_cc, nama, kode_lokasi, kode_induk from exs_cc) d on d.kode_ubis = c.kode_ubis and ( d.kode_lokasi = a.kode_lokasi or d.kode_lokasi = b.kode_lokasi)  "+
						"	where a.nik= '"+this.e0.getText()+"'\r\n"+
						"select status from exs_locktrans where kode_lokasi= 'table1_kode_lokasi'\r\n"+
						"select kode_form from exs_klp_akses_m where kode_klp_akses = 'table1_klp_akses'\r\n"+												
						"select to_char(sysdate,'YYYYMM') as periode, to_char(sysdate,'YYYYMM') as periode_sys from dual\r\n"+
						"select nama from spro where kode_spro = 'MODELREP'\r\n"+
						"select nama from spro where kode_spro = 'REPCONS'\r\n"+
						"select nama from spro where kode_spro = 'LOKKONSOL'"
						,this.e0.getText(),this.e1.getText(),true);
			*/
			
		}catch(e){					
			this.hideLoading();
			systemAPI.alert(e,"[fLogin2]::mainButtonClick:");						
		}		
	},
	buttonClick: function(sender){
	},
	EditExit: function(sender){
		if (this.e0.getText() == "") return false;
		try
		{		
		}catch(e)
		{
			system.alert(this,"[fLogin2]::editExit:"+e);
		}
	},
	keyDown: function(sender, keyCode, buttonState){
		if (keyCode == 13){
			this.bLogin.click();
		}
	},
	doRequestReady: function(sender, methodName, result){
		try{			
            //console.log(result);
			if (sender == this.dbLib){
				switch (methodName){
					case "loginAndLoad":
                        
						var data = result;						
						var dataRes = data.split("\r\n");					
						var kodeMenu = dataRes[0];						
						if ( (kodeMenu!= "") && (kodeMenu != undefined)){
							data = dataRes[0].split("<br>");
							data = data[1].split(";");
							var lokasi = data[6];
							var klpAkses = data[6];
							kodeMenu = data[0];				
							if ( (lokasi!= "") && (lokasi != undefined) && (kodeMenu != lokasi)){
								var nama = data[7];	
								setCookie("roojuid","",-1);		
								setCookie("roojpwd","",-1);		
								setCookie("dbSetting",this.app._dbSetting,-1);
								setCookie("rfcSetting",this.app._rfcSetting,-1);
								setCookie("appState",this.app._appState,-1);								
								setCookie("app",this.app.className,-1);		
								this.app.services.userid = this.e0.getText();						
								this.app._userPwd = this.e1.getText();
								this.app._isLogedIn = true;				
								this.app._userLog = this.e0.getText();
								this.app._lokasi = lokasi;
								this.app._kodeMenu = kodeMenu;
								this.app._namalokasi = nama;				
								this.app._userStatus = data[4];
								this.app._namaUser = data[2];
								this.app._kodeUbis = data[8];

								this.app._kodeGubis = data[9];
								this.app._kodeBA = data[11];
								this.app._kota = data[10];
								this.app._statusUser = data[13];
								this.app._cfu = data[14];
								
								var tmpDate=new Date();
								var tmp="";				
								this.app._loginTime = tmpDate;
								this.app._nikUser= tmp.concat(this.e0.getText(),"_",tmpDate.valueOf());				
								this.app._periodeSys = dataRes[3].split("<br>")[1].split(";")[0];						
								this.app._periodeCurrent = dataRes[3].split("<br>")[1].split(";")[1];
								this.app._periode = dataRes[3].split("<br>")[1].split(";")[1];
								//--krn periode report adalah periode berjalan - 1
								var bln = parseFloat(this.app._periode.substr(4,2));
								var thn = parseFloat(this.app._periode.substr(0,4));
								if (bln == 1) {
									thn--;
									bln = 12;
								}else {
									bln--;
								}
								if (bln < 10) bln = '0' + bln;
								this.app._periode = thn.toString() + bln.toString();

								this.app._year = thn;
								this.app._prevyear = (thn - 1).toString();
			//------------------------------------------------------------------- locking transaction													
								data = dataRes[3].split("<br>");
								if (data[1] != undefined) {
									data = data[1].split(";");								
									//this.app._periode = data[0];
								}			
								//------------------------------------- user access								
								data = dataRes[4].split("<br>");
								if (data[1] != undefined) {
									data = data[1].split(";");								
									this.app._modelReport = data[0];
								}
								data = dataRes[5].split("<br>");
								if (data[1] != undefined) {
									data = data[1].split(";");								
									this.app._modelReportUncons = data[0];
								}
								data = dataRes[6].split("<br>");
								if (data[1] != undefined) {
									data = data[1].split(";");								
									this.app._kodeLokasiKonsol = data[0];
								}
		
								//------------- server info				
								data = dataRes[8].split("<br>");					
								this.app._dbname = data[2];
								this.app._dbhost = data[3];
								this.app._hostname = data[1];				
								this.app._iphost = data[0];
								this.app._userSession = data[5];
								this.app.services.setSession( data[5] );
								this.app._dbEng = data[4];								
								this.app._uri = data[6].substr(0,data[6].indexOf("/uses.php"));
								if (this.app._uri == "") this.app._uri = data[6];
								this.app._servername = data[7];								
								this.app._rootDir = data[8];								
								this.app._fullPath = this.app._servername + this.app._uri;	
								this.app._dbInfo = {name:data[2], host:data[3], hostname:data[1], ip:data[0], engine:data[4]};							
								//----------------- klp Akses			
								//this.app._kodeLokasiKonsol = "-";
								this.app._klpAkses = [];															
								if (dataRes[2] != ""){													
									data = dataRes[2].split("<br>");											
									for (var i in data){
										 this.app._klpAkses[data[i]] = data[i];
									}									
								}
								/*if (dataRes[5] != ""){													
									data = dataRes[5].split("<br>");
									data = data.split(";");											
									this.app._defaultFS = data[0];									
								}			*/
								if (this.app._rfcLib != undefined)
									this.app._rfcLib = new util_rfcLib(this.app._rfcSetting);			
								if (this.app._rfc != undefined)	
									this.app._rfc = new util_rfc(undefined, this.app._rfcSetting);
								this.app._mainForm.doAfterLogin();																
								system.hideProgress();				
							}else
							{								
								this.hideLoading();
								system.hideProgress();
								system.alert(this,"Maaf lokasi/Area anda tidak terdaftar.","Hubungi Administrator anda.");
								
							}
							
						}else
						{							
							this.hideLoading();
							system.alert(this,"User atau Password anda salah","a-Gunakan password yang sudah diberikan");														
							system.hideProgress();
							
						}		
					break;
				}
			}
		}catch(e){		
			system.hideProgress();			
			this.hideLoading();
			system.alert(this,"Login Gagal dilakukan.<br>Gunakan password yang sudah diberikan."+result,e);			
			
		}
	},
	doAfterResize:	function(){
		var height = this.owner.getHeight();
		var width = this.owner.getWidth();	
		
		if (this.panel){
			this.img.setWidth(width-3);
			this.img.setHeight(height);
			this.img.setTop(0);
			this.img.setLeft(1);
			this.panel.setLeft(width / 2 - 240);
			this.panel.setTop(height - 470);
			
			/*
			this.e0.setLeft(width / 2 - 175);	
			this.e0.setTop(height / 2 - 30);	
			this.e1.setLeft(width / 2 - 175);	
			this.e1.setTop(height / 2 - 7);	
			this.bLogin.setLeft(width / 2 - 40);
			this.bLogin.setTop(height / 2 + 40);
			*/
			
		}
	},
	setImage: function(path,proportional,width,height){
		try{
			this.img1.setImage(path);			
			if (width !== undefined) this.img1.setWidth(width);
			if (height !== undefined) this.img1.setHeight(height);			
		}catch(e){
			alert(e);
		}
	}
});
window.labelCustom = function( owner, options){
	window.labelCustom.prototype.parent.constructor.call(this, owner, options);
	this.className = "labelCustom";
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.frame) this.frame = options.frame;
	}
};
window.labelCustom.extend(window.control_label);
window.labelCustom.implement({
	doDraw: function(canvas){
		window.labelCustom.prototype.parent.doDraw.call(this, canvas);
		this.getCanvas().css({position:"relative", cursor:"pointer", borderBottom:"1px solid #dedede"});
		var cnv = this.getCanvas();
		//this.captionCanvas.css({display:"table",clear:"left"});
		cnv.on("mouseover", function(e){
			cnv.css({background:"#fefefe"});
		});
		cnv.on("mouseout", function(e){
			cnv.css({background:""});
		});
		
	},
	setCaption: function(text){
		window.labelCustom.prototype.parent.setCaption.call(this, text);
		this.captionCanvas.css({top: 10, left:10});

	}
});