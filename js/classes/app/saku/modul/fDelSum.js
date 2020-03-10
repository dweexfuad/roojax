window.app_saku_modul_fDelSum = function(owner,menu)
{
	if (owner)
	{
		try{
			window.app_saku_modul_fDelSum.prototype.parent.constructor.call(this,owner);
			this.className  = "app_saku_modul_fDelSum";
			this.itemsValue = new arrayList();		
			this.maximize();	
			this.app._mainForm.childFormConfig(this, "mainButtonClick","Delete Summary ", 0);

			uses("control_popupForm;column;pageControl;saiEdit;datePicker;saiGrid;saiCBBL;childPage;panel;saiUpload;sgNavigator;column;frame;tinymceCtrl", true);			
			var self=this;
			self.notif="-";
			if(menu == undefined){
				menu = this.app._menu;
			}else{
				this.app._menu = menu;
			}

			
			var thn = self.app._periode;
			var tahun = thn.substr(0,4);
			this.icm = new saiLabelEdit(this,{bound:[20,20,200,20],caption:"ICM",change:[this,"doChange"]});
			this.cocd = new saiCBBL(this,{bound:[20,45,200,20],caption:"COCD",change:[this,"doChange"]});
			this.tp = new saiCBBL(this,{bound:[20,70,200,20],caption:"TP",change:[this,"doChange"]});
			this.bulan = new saiCB(this,{bound:[20,95,200,20],caption:"Bulan", items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
			this.bulan.setItemHeight(12);
			this.tahun = new saiCB(this,{bound:[20,120,200,20],caption:"Tahun", items:["2019"], change:[this,"doChange"]});
			this.idheader = new saiCBBL(this,{bound:[20,145,200,20],caption:"No Jurnal",rightLabelVisible: false, click: [this, "doClick"]});
			this.sd = new label(this, {bound:[230, 145, 20, 20], caption:"s/d", bold: true, fontSize:9, click: [this, "doClick"]});	
			this.idheader2 = new saiCBBL(this,{bound:[260,145,200,20],caption:"No Jurnal",rightLabelVisible: false, click: [this, "doClick"]});
			
			this.rearrangeChild(20,23);

			// this.idheader.on("click",function(sender){	
			// 	var self = this;	
			// 	this.idheader.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListNoJurnal",[self.icm.getText(),self.cocd.getText(),self.tp.getText(),self.bulan.getText(),self.tahun.getText(),"","",0]],["idheader","pekerjaan"]," ","Daftar No Jurnal");
			// });

			// this.idheader2.on("click",function(sender){	
			// 	var self = this;	
			// 	self.idheader2.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListNoJurnal",[self.icm.getText(),self.cocd.getText(),self.tp.getText(),self.bulan.getText(),self.tahun.getText(),"","",0]],["idheader","pekerjaan"]," ","Daftar No Jurnal");
			// });

			this.bDel = new button(this,{bound:[20,170,80, 30],icon:"<i class='fa fa-trash' style='color:white'></i>", caption:"Delete"});
			this.bDel.setColor("red");
			this.bDel.on("click",function(sender){
				try{
					var dataHeader = {					
						cocd : self.cocd.getText(),
						tahun : self.tahun.getText(),
						tp : self.tp.getText(),
						bulan : self.bulan.getText(),
						icm : self.icm.getText(),
						idheader : self.idheader.getText(),
						idheader2 : self.idheader2.getText()
					};

					self.confirm("Data BA Rekon","Yakin Data Akan di hapus?", function(result){
						self.app.services.callServices("financial_mantis","delSum", [dataHeader, self.app._lokasi] ,function(data){
							if (data == "process completed") {
								system.info(self, data,"");
								self.cocd.setText("");
								self.tahun.setText("");
								self.tp.setText("");
								self.bulan.setText("");
								self.icm.setText("");
								self.idheader.setText("");
								self.app._mainForm.bClear.click();
							}else {
								system.alert(self, data,"");
							}
						});
					});
				
						
				}catch(e){
					alert(e);
				}
			});


		
			this.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			
			this.tp.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			
			self.idheader.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getNoJurnal",["","","",0]],["idheader","pekerjaan"],"","Daftar No Jurnal");
			self.idheader2.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getNoJurnal",["","","",0]],["idheader","pekerjaan"],"","Daftar No Jurnal");

			
				
			var self=this;

			
			self.app._mainForm.bSimpan.setVisible(false);
			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);
			self.on("close",function(){
				self.app._mainForm.dashboard.refreshList();
				self.app._mainForm.bSimpan.setVisible(true);
				self.app._mainForm.bHapus.setVisible(true);
			self.app._mainForm.bClear.setVisible(true);
			});
			
		}catch(e){
			alert(e);
			systemAPI.alert(e);
		}
		
	}
};
window.app_saku_modul_fDelSum.extend(window.childForm);
window.app_saku_modul_fDelSum.implement({	
	
	mainButtonClick: function(sender){
		if (sender == this.app._mainForm.bClear)
			system.confirm(this, "clear", "screen akan dibersihkan?","form inputan ini akan dibersihkan");
		if (sender == this.app._mainForm.bSimpan)
			system.confirm(this, "simpan", "Apa data sudah benar?","data diform ini apa sudah benar.");
		if (sender == this.app._mainForm.bEdit)
			system.confirm(this, "ubah", "Apa perubahan data sudah benar?","perubahan data diform ini akan disimpan.");
		if (sender == this.app._mainForm.bHapus)
			system.confirm(this, "hapus", "Yakin data akan dihapus?","data yang sudah disimpan tidak bisa di<i>retrieve</i> lagi.");
	},
	simpan: function(row){
		try{
			if (this.checkEmptyByTag([0])){
				try{
					
					var self = this;
					var data = {
						no_tagihan : this.nTagih.getText(), 
						no_sap : this.noSAP.getText(),
						no_spb : "-",												
					};

					// var data1 = [];
					// for (var i = 0; i < this.sg1.getRowCount();i++){				
					// 	var item1 = {
					// 		bln : this.sg1.cells(0,i), 
					// 		cc : this.sg1.cells(1,i),
					// 		akun : this.sg1.cells(3,i),
					// 		nilai : this.sg1.cells(5,i),
					// 		jenis : this.sg1.cells(6,i),
					// 		target : this.sg1.cells(7,i),
					// 		status : this.sg1.cells(8,i),
					// 		dc : "D",
							
							
					// 	};
					// 	data1.push(item1);
					// }
					
					// self.app.services.callServices("financial_Fca","editSAP", [data,self.regid.getText(),self.statusbaru.getText()] ,function(data){
					// 	if (data == "process completed") {
					// 		system.info(self, data,"");
					// 		self.app._mainForm.bClear.click();
					// 		self.noSAP.setText("");
					// 		self.nTagih.setText("");
					// 		page = self.sg1.page;
					// 		row = ((page-1) * self.sg1.rowPerPage)+row;
					// 		self.tab.setActivePage(self.tab.childPage[0]);
					// 		self.RefreshList();
							
							
					// 	}else {
					// 		system.alert(self, data,"");
					// 	}
					// });

					
				}catch(e){
					system.alert(this, e,"");
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	hapus: function(){
		try{
			if (this.standarLib.checkEmptyByTag(this, [0])){
				try {

				}
				catch(e){
					system.alert(this, e,"");
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	doClick: function(sender){
		// if(sender == this.bExport){
		// 	this.doExport();idheader2
		// }else if(sender == this.idheader){
		// 	alert("oy");
		// }else if(sender == this.idheader2){
		// 	alert("iy");
		// }else if(sender == this.sd){
		// 	alert("uy");
		// }
	},
	doChange: function(sender){
		try{			
			if(sender == this.cocd || sender == this.tp || sender == this.icm || sender == this.tahun || sender == this.bulan){	
				var self = this;
				let filter = {
					icm : self.icm.getText(),
					cocd : self.cocd.getText(),
					tp : self.tp.getText(),
					bulan : self.bulan.getText(),
					tahun : self.tahun.getText()
				};
				// console.log(filter);

				self.idheader.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getNoJurnal",["","","",0]],["idheader","pekerjaan"],filter,"Daftar No Jurnal");
				self.idheader2.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getNoJurnal",["","","",0]],["idheader","pekerjaan"],filter,"Daftar No Jurnal");
			}
		}catch(e){
			alert(e);
			error_log(e);
		}
	},

	doModalResult: function(event, modalResult){
		if (modalResult != mrOk) return false;
		switch (event){
			case "clear" :
				if (modalResult == mrOk)
					//this.standarLib.clearByTag(this, new Array("0"),this.e_ket);
				break;
			case "simpan" :
				if(this.noSAP.getText() == "" ){
					system.alert(this,"No SAP Tidak Boleh Kosong!.","Harap Diisi");
					return false;
				}
			
				this.simpan();
				break;
			case "simpancek" : this.simpan();
				break;
			case "ubah" :
				this.ubah();
				break;
			case "hapus" :
				this.hapus();
				break;
		}
	}
});
