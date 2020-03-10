window.app_saku_modul_fUser = function(owner)
{
	if (owner)
	{
		window.app_saku_modul_fUser.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fUser";
		this.itemsValue = new arrayList();
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Data User", 0);
	
		uses("saiCBBL;radioButton;saiEdit;saiGrid;control_popupForm", true);
			
		this.e_username = new saiCBBL(this,{bound:[20,15,200,20],caption:"Username",maxLength:10,rightLabelVisible:false,change:[this,"doChange"]});
		this.status1 = new radioButton(this,{bound:[230,15,100,20], caption:"Aktif", selected:true});
		this.status2 = new radioButton(this,{bound:[300,15,100,20], caption:"Non Aktif"});
		this.cb_cc = new saiCBBL(this,{bound:[20,40,200,20],caption:"Company ID",maxLength:10,rightLabelVisible:false,change:[this,"doChange"]});
		this.cb_kode = new saiCBBL(this,{bound:[20,65,200,20],caption:"NIK",maxLength:10,rightLabelVisible:false,change:[this,"doChange"]});
		this.e_nama = new saiLabelEdit(this,{bound:[20,90,400,20],caption:"Nama",maxLength:100});
		this.e_jab = new saiLabelEdit(this,{bound:[20,115,400,20],caption:"Jabatan",tag:2});
		this.e_email = new saiLabelEdit(this,{bound:[20,140,400,20],caption:"Email",tag:2});
		this.e_pass = new saiLabelEdit(this,{bound:[20,165,250,20],caption:"Password",password:true});
		this.e_pass2 = new saiEdit(this,{bound:[272,165,150,20],password:true});
		this.fFCBP = new saiCB(this,{bound:[20, 190, 200, 20],labelWidth:100, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
		this.cb_access = new saiCBBL(this,{bound:[20,215,200,20], caption:"Akses",multiSelection:false, btnClick:[this,"doCCClick"],change:[this,"doChange"]});
		this.cb_access_action = new saiCBBL(this,{bound:[20,240,200,20], caption:"Akses Action",multiSelection:false, btnClick:[this,"doCCClick"],change:[this,"doChange"]});
		this.cb_klp = new saiCB(this,{bound:[20,265,200,20],caption:"Kode Kelompok"});
		this.app.services.callServices("financial_mantisMaster","getListKlp",[],function(data){	
			$.each(data, function(key, val){
				self.cb_klp.addItem(val.kode_klp, val.kode_klp);
			});
		});  
		this.cb_role = new saiCB(this,{bound:[20,290,200,20],caption:"Role"});
		this.app.services.callServices("financial_mantisMaster","getListRole",[],function(data){	
			$.each(data, function(key, val){
				self.cb_role.addItem(val.id, val.name);
			});
		});  
		this.iFoto = new image(this,{bound:[430,this.cb_kode.top, 118,150]});

		this.pCC = new control_popupForm(this.app);
        this.pCC.setBound(0, 0,450, 250);
        this.pCC.setArrowMode(2);
        this.pCC.hide();
		this.sgTCC = new saiGrid(this.pCC, {bound:[0,0,448,200], colCount:[3], headerHeight:20,
								colTitle:[	{title:"Kode", width:80},
											{title:"Deskripsi",width:200},
											{title:"Ceklist", width:100, format:cfBoolean}
										],
								colFormat:[[2],[cfBoolean]],
								colWidth:[[2,1,0],[80,200,100]], shadow:{radius:0}});
		this.sgTCC.rearrange(0);
		this.bOkCC = new button(this.pCC,{bound:[20,210,80,20], caption:"OK", click:[this,"doOkClick"]});
		this.bOkCC_action = new button(this.pCC,{bound:[20,210,80,20], caption:"OK", click:[this,"doOkClick"]});
		this.bCancelCC = new button(this.pCC,{bound:[320,210,80,20], caption:"Cancel", click:[this,"doOkClick"]});
		var self = this;
		this.app.services.callServices("financial_mantisMaster","getListCompCode",[""], function(data){
			self.sgTCC.clear();
			self.sgTCC.setData(data,["cocd","company_name","sts"]);
		});

		this.sg1 = new saiGrid(this,{bound:[20,325,1100,200],
			colCount: 10,
			colTitle: ["Username","Nama","Nik","Jabatan","Email","Role","Akses","Akses Action","Kode Klp","Created Date"],
			colWidth:[[9,8,7,6,5,4,3,2,1,0],[100,75,150,150,75,100,150,100,200,100]],
			columnReadOnly:[true, [9,8,7,6,5,4,3,2,1,0],[]],	
			colFormat:[[],[]],					
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
        var self = this;

		this.maximize();
		this.setTabChildIndex();
		try {
			this.dbLib = this.app.dbLib;
			this.dbLib.addListener(this);
			this.standarLib = new util_standar();
			this.onClose.set(this,"doClose");
			
			this.loadReport();

			this.cb_kode.setServices(this.app.servicesBpc, "callServices",["financial_mantisMaster","getListUserByNik",["","","",0]],["nik","firstname"],"","Daftar Karyawan", false);

			this.e_username.setServices(this.app.servicesBpc, "callServices",["financial_mantisMaster","getListUserByUsername",["","","",0]],["useraccname","firstname"],"","Daftar Username", false);

			this.cb_cc.setServices(this.app.servicesBpc, "callServices",["financial_mantisMaster","getListCOCD",["","","",0]],["cocd","company_name"],"","Daftar Company Code", false);
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fUser.extend(window.childForm);
window.app_saku_modul_fUser.implement({
	doClose: function(){
		this.dbLib.delListener(this);
	},
	doOkClick:function(sender){
		if (sender == this.bOk){
			var ubis = "";
			for (var i = 0; i < this.sgT.getRowCount();i++){
				if (this.sgT.cells(2,i) == "TRUE"){
					ubis += (ubis == "" ? "":",") + this.sgT.cells(0,i);
				}
			}
			this.cb_ubis.setText(ubis);
			this.pUbis.hide();
		}
		if (sender == this.bOkCC){
			var CC = "";
			for (var i = 0; i < this.sgTCC.getRowCount();i++){
				if (this.sgTCC.cells(2,i) == "TRUE"){
					CC += (CC == "" ? "":",") + this.sgTCC.cells(0,i);
				}
			}
			this.cb_access.setText(CC);
			this.pCC.hide();
		}
		if (sender == this.bOkCC_action){
			var CC = "";
			for (var i = 0; i < this.sgTCC.getRowCount();i++){
				if (this.sgTCC.cells(2,i) == "TRUE"){
					CC += (CC == "" ? "":",") + this.sgTCC.cells(0,i);
				}
			}
			this.cb_access_action.setText(CC);
			this.pCC.hide();
		}
		if (sender == this.bCancelCC){
			this.pCC.hide();
		}
	},
	doUbisClick: function(){
		try{
			if (this.pUbis.visible){
				this.pUbis.hide();
			}else {
				var ubis = this.cb_ubis.getText().split(",");
				for (var i=0; i < ubis.length; i++){
					for (var r=0; r < this.sgT.getRowCount();r++){
						if (this.sgT.cells(0,r) == ubis[i]){
							this.sgT.cells(2,r, "TRUE");
						}
					}
				}
                var node = this.cb_ubis.getCanvas();
                this.pUbis.show();
				this.pUbis.setTop(node.offset().top + 20);
                this.pUbis.setLeft(node.offset().left + 180);
                this.pUbis.setArrowPosition(5,20);
                this.pUbis.getCanvas().fadeIn("slow");
			}
		}catch(e){
			alert(e);
		}
	},
	doCCClick: function(sender){
		try{
			if (sender == this.cb_access){
				if (this.pCC.visible){
					this.pCC.hide();
				}else {
					var CC = this.cb_access.getText().split(",");
					for (var r=0; r < this.sgTCC.getRowCount();r++){
						this.sgTCC.cells(2,r, "FALSE");
					}
					for (var i=0; i < CC.length; i++){
						for (var r=0; r < this.sgTCC.getRowCount();r++){
							if (this.sgTCC.cells(0,r) == CC[i]){
								this.sgTCC.cells(2,r, "TRUE");
							}
						}
					}
					var node = this.cb_access.getCanvas();
					this.bOkCC_action.hide();
					this.bOkCC.show();
					this.pCC.show();
					this.pCC.setTop(node.offset().top + 20);
					this.pCC.setLeft(node.offset().left + 180);
					this.pCC.setArrowPosition(5,20);
					this.pCC.getCanvas().fadeIn("slow");
				}
			}else if (sender == this.cb_access_action){
				if (this.pCC.visible){
					this.pCC.hide();
				}else {
					var CC = this.cb_access_action.getText().split(",");
					for (var r=0; r < this.sgTCC.getRowCount();r++){
							this.sgTCC.cells(2,r, "FALSE");
					}
					for (var i=0; i < CC.length; i++){
						for (var r=0; r < this.sgTCC.getRowCount();r++){
							if (this.sgTCC.cells(0,r) == CC[i]){
								this.sgTCC.cells(2,r, "TRUE");
							}
						}
					}
					var node = this.cb_access_action.getCanvas();
					this.bOkCC.hide();
					this.bOkCC_action.show();
					this.pCC.show();
					this.pCC.setTop(node.offset().top + 20);
					this.pCC.setLeft(node.offset().left + 180);
					this.pCC.setArrowPosition(5,20);
					this.pCC.getCanvas().fadeIn("slow");
				}
			}
		}catch(e){
			alert(e);
		}
	},
    
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
	simpan: function(){
		try{
			if (this.e_pass.getText() != this.e_pass2.getText()){
				system.alert(this, "Konfirmasi Password tidak sama", "Coba ulangi Password lagi");
				return;
			}
			// console.log(this.status1.selected);
			// console.log(this.status2.selected);
			var data = {
				nik : this.cb_kode.getText(), 
				company_id : this.cb_cc.getText(), 
				unlocked : this.status1.selected,
				locked : this.status2.selected,
				useraccname : this.e_username.getText(), 
				firstname : this.e_nama.getText(), 
				jabatan : this.e_jab.getText(),
				email : this.e_email.getText(),
				pass : this.e_pass.getText(),
				access : this.cb_access.getText(),
				access_action : this.cb_access_action.getText(),
				kode_klp : this.cb_klp.getText(),
				role : this.cb_role.getId(),
				fcbp : this.fFCBP.getText()
			};
			
			// for (var i = 0; i < this.sgT.getRowCount();i++){
			// 	if (this.sgT.cells(2,i) == 'TRUE'){
			// 		data.listUbis.push( this.sgT.cells(0, i));
			// 	}
			// }

			var self = this;
			this.app.services.callServices("financial_mantisMaster", "addUser", [data,this.app._userLog] ,function(data){
				if (data == "process completed") {
					system.info(self, data,"");
					self.loadReport();
					self.app._mainForm.bClear.click();
				}else{
					system.alert(self, data,"");
				}
			});
		}catch(e){
			systemAPI.alert(e);
		}
	},
	loadReport: function(){
		var self = this;
		self.sg1.clear(0);	
		this.app.services.callServices("financial_mantisMaster","getDataUser",[this.app._lokasi,""], function(data){
			if (typeof data != 'undefined'){
				$.each(data, function(k, val){
					self.sg1.addRowValues([
						val.useraccname,
						val.firstname,
						val.nik,
                        val.jabatan,
						val.email,                        
						val.role,                        
						val.access,                        
						val.access_action,                        
						val.kode_klp,                     
						val.craeted_date                 
					]);
				});
				// self.sg1.addRowValues(["","","",""]);
			}else{
				system.alert(self, "Data Report Tidak ditemukan","");
			}		
		});
	},
	ubah: function(){
		try{
			if (this.standarLib.checkEmptyByTag(this, [0])){
				try {
					uses("server_util_arrayList");
					if (this.e_pass.getText() != this.e_pass2.getText()){
						system.alert(this, "Konfirmasi Password tidak sama", "Coba ulangi Password lagi");
						return;
					}
                    var self = this;
					uses("server_util_arrayList");
                    //$data->nik','$data->nama','$data->jabatan','-','$data->ubis','-','$data->lokasi','$data->email','$data->telp','$data->cfu
                    var data = {nik : this.cb_kode.getText(), 
                                lokasi : this.e_lokasi,
                                nama : this.e_nama.getText(),
                                jabatan : this.e_jab.getText(),
                                ubis : this.cb_ubis.getText(),
                                email : this.e_email.getText(),
                                telp : this.e_mobile.getText(),
                                listUbis : [],
                                listCFU : []
                            };
					for (var i = 0; i < this.sgT.getRowCount();i++){
						if (this.sgT.cells(2,i) == 'TRUE'){
							data.listUbis.push( this.sgT.cells(0, i));
						}
					}

                    var self = this;
					this.app.services.call("addUser", [data, this.app._userLog] ,function(data){
                        system.info(self, data,"");
                        self.app._mainForm.bClear.click();
                    });
                    

				}
				catch(e){
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
                    var self = this;
					this.app.services.call("deleteUser", [this.cb_kode.getText(), this.e_lokasi.getText(), this.app._userLog] ,function(data){
                        system.info(self, data,"");
                        self.app._mainForm.bClear.click();
                    });
				}
				catch(e){
					system.alert(this, e,"");
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	doModalResult: function(event, modalResult){
		if (modalResult != mrOk) return false;
		switch (event){
			case "clear" :
				if (modalResult == mrOk)
					this.standarLib.clearByTag(this, new Array("0"),this.cb_kode);
				break;
			case "simpan" :
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
	},
	doChange: function(sender){
		try{
			if (sender == this.cb_kode){
				if (this.cb_kode.getText() != ""){
					var self = this;
					// this.app.services.callServices("financial_mantisMaster","getUserByNik",[this.cb_kode.getText()], function(data){
					// 	console.log(data);
                    //     self.e_username.setText(data.useraccname);
                    //     self.e_nama.setText(data.firstname);
                    //     self.e_jab.setText(data.jabatan);
                    //     self.e_pass.setText(data.password);
                    //     self.e_email.setText(data.email);
                    //     self.cb_access.setText(data.access);
                    //     self.cb_klp.setText(data.kode_klp);
					// 	self.cb_role.setText(data.role);
                    // });
					this.iFoto.setImage("./foto/"+this.cb_kode.getText()+"");
				}
			}else if (sender == this.e_username){
				if (this.e_username.getText() != ""){
                    var self = this;
                    this.app.services.callServices("financial_mantisMaster","getUserByUsername",[this.e_username.getText()], function(data){
						console.log(data);
						if(data.is_active == '1'){
							self.status1.setSelected(true);
						}else{
							self.status2.setSelected(true);
						}
                        self.cb_cc.setText(data.company_id);
                        self.cb_kode.setText(data.nik);
                        self.e_nama.setText(data.firstname);
                        self.e_jab.setText(data.jabatan);
                        self.e_pass.setText(data.password);
                        self.e_email.setText(data.email);
                        self.cb_access.setText(data.access);
                        self.cb_access_action.setText(data.access_action);
                        self.cb_klp.setText(data.kode_klp);
						self.cb_role.setText(data.nama_role);
						self.fFCBP.setText(data.fcbp);
                    });
				}
			}
		}catch(e){
			alert(e);
			error_log(e);
		}
	},
	doTampilClick: function(sender){
		try{
			


		}catch(e){
			systemAPI.alert(e);
		}
	},
	
	doPager: function(sender, page) {
		this.sg1.doSelectPage(page);
	},
	doRequestReady: function(sender, methodName, result, callObj, conn){
		if (sender == this.dbLib){
			try{
				switch(methodName){
	    			case "execArraySQL" :
						if (result.toLowerCase().search("error") == -1)
						{
							system.info(this,"Transaksi Sukses","");
							this.app._mainForm.bClear.click();
						}else system.alert(this,result,"");
	    			break;
	    			case "getDataProvider":
						eval("result = "+result+";");
						if (typeof result == "object"){
							for (var i in result.rs.rows){
								this.e_menu.addItem(i,result.rs.rows[i].kode_klp);
							}
						}
					break;
	    		}
			}
			catch(e){
				systemAPI.alert("step : "+step+"; error = "+e);
			}
	    }

	},
	doDblClick: function(sender, col, row){
		console.log(col +":"+row);
		this.cb_kode.setText(sender.cells(0, row));
	},
	doFind: function(){
		try{
			var self = this;
			//["NIK","Nama","Jabatan","Lokasi","CFU","Kode UBIS","UBIS","Status","Email","No Telp","Menu"]
			this.app.services.callServices("financial_Amor","findUser",[this.e_cari.getText()],function(data){
				try{
					self.sg1.clear();
					$.each(data, function(i, row){
						self.sg1.appendData([row.nik, row.nama, row.jabatan, row.kode_lokasi, row.cfu,  row.kode_ubis, row.nmubis,  row.kode_klp_menu]);
					});
				}catch(e){
					alert(e);
				}
			}, function (){

			});

		}catch(e){
			error_log(e);
		}
	},
	doCariKeyDown: function(sender, keyCode, buttonState){
		if (keyCode == 13){
			this.doFind();
			return false;
		}
	}
});
