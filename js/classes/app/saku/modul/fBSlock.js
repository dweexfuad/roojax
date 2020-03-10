window.app_saku_modul_fBSlock = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSlock.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSlock";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Close/Open Period", 99);

		uses("control_popupForm;datePicker;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);
		
        this.fPeriode = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 25, 150, 20],labelWidth:80,caption:"Tahun",placeHolder:"YYYY"});
        this.fCOCD = new saiCBBL(this.tab.childPage[0],{bound:[10, 50, 150, 20],labelWidth:80,caption:"COCD", change:[this,"doChange"]});
		this.ltitleSD= new label(this.tab.childPage[0],{bound:[170,50,5,20],alignment:"left",caption:"S/D",fontSize:9});           
        this.fCOCD2 = new saiCBBL(this.tab.childPage[0],{bound:[200, 50, 70, 20],labelWidth:0,caption:"", change:[this,"doChange"]});
		this.fStatus = new saiCB(this.tab.childPage[0],{bound:[10, 75, 150, 20],labelWidth:80, caption:"Status", items:["OPEN","LOCK"]});
        this.bLock = new button(this.tab.childPage[0],{bound:[10,100,70,20],icon:"<i class='fa fa-save' style='color:white'></i>", caption:"Submit ", click: [this, "doClick"], keyDown:[this, "keyDown"]});  
		this.bSearch = new button(this.tab.childPage[0], { bound: [85, 100, 70, 20], icon: "<i class='fa fa-search' style='color:white'></i>", caption: "Search ", click: [this, "doClick"], keyDown: [this, "keyDown"] });
		
		this.sg1 = new saiGrid(this.tab.childPage[0], {
			bound: [10, 130, 620, 260],
			tag: 9,
			readOnly: true,
			colCount: 3,
			colWidth: [[1, 0], [80, 80, 120]],
			colTitle: ["Periode", "COCD", "STATUS"],
			rowPerPage: 10
		});
		this.note = new label(this.tab.childPage[0], { bound: [10, 400, 400, 20], caption: "*Note : Jika data tidak ditemukan, maka Period masih di lock", visible: true, bold: true, fontSize: 8 });

        var self = this;
        self.fPeriode.on("change", function(){
            self.CekLockPeriod();
        });
        self.fCOCD.on("change", function(){
            self.CekLockPeriod();
        });

		this.container.rearrangeChild(10, 50);
	
		this.setTabChildIndex();
		try {
			var self = this;
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();

            self.fPeriode.setText(yyyy+mm);
			this.fCOCD.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
			this.fCOCD2.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
        }catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSlock.extend(window.childForm);
window.app_saku_modul_fBSlock.implement({
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"RRA", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doAfterResize: function(w, h){
		if (this.listView) {
			this.listView.setHeight(this.height);
			this.container.setHeight(this.height);
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
	doClick: function(sender){
		if(sender == this.bGenerateJurnal){
			this.generateJurnal();
		}else if(sender == this.bOk){
			if(this.fTglJurnal.getText() != '' || this.fTglJurnal2.getText() != ''){
				this.loadReport();
			}else{
				system.alert(self, "Inputan Tidak Boleh Kosong");
			}
		}else if(sender == this.b_exportXls){
			this.doExport();
		}else if(sender == this.bLock){
			this.lockPeriod();
		}else if (sender == this.bSearch) {
			this.loadPeriod();
		}
	},
	loadPeriod: function () {
		let self = this;
		let filter = {
			periode: self.fPeriode.getText(),
			cocd1: self.fCOCD.getText(),
			cocd2: self.fCOCD2.getText()
		}
		self.sg1.clear(0);
		this.app.services.callServices("financial_mantisRepSumBspl", "getDataPeriod", [filter], function (data) {
			if (data.period) {
				if (typeof data != 'undefined' && data != null) {
					console.log(data);
					$.each(data.period, function (k, val) {
						if (typeof val.periode != 'undefined' && val.periode != null) {
							self.sg1.addRowValues([
								val.periode,
								val.cocd,
								val.status
							]);
						}
					});
				}
			} else {
				system.alert(self, "Data Tidak Ditemukan");
			}
		});
	},
	doExport: function(){
		var self = this;
		self.showLoading("Export to Xls...");
		this.app.services.callServices("financial_BsplMaster","xlsJurnalByJenis",[self.app._lokasi,'','CF'], function(data){
			self.hideLoading();
			window.open("./server/reportDownloader.php?f="+data+"&n="+"JURNAL_CARRY_FORWARD.xlsx");
		}, function(){
			self.hideLoading();
		});	
	},
    CekLockPeriod: function(){
		var self = this;
        this.app.services.callServices("financial_BsplMaster","cekLockPeriode",[this.fCOCD.getText(),this.fPeriode.getText()],function(data){
            if (typeof data != 'undefined' && data != null){
				self.fStatus.setText(data);
            }
        });
    },
	lockPeriod : function(row){
        try {
            var self = this;
            if(self.fPeriode.getText() != '' || self.fCOCD.getText() != '' || self.fStatus.getText() != ''){
                var data = [];
                var items = {
                    cocd : self.fCOCD.getText(),
                    cocd2 : self.fCOCD2.getText(),
                    periode : self.fPeriode.getText(),
                    status : self.fStatus.getText()
                }
				data.push(items);
				if(self.fStatus.getText() == 'OPEN'){
					self.lockPeriodeProcess();
				}else{
					this.app.services.callServices("financial_BsplMaster","cekAsetBelumDepresiasi",[data],function(data){
						console.log("data cek");
						console.log(data);
						if (data.alert_cek == 1) {
							self.confirm("Warning",data.alert_aset + "Tetap lakukan lock period?", function(result){
								self.lockPeriodeProcess();								
							});                     
						}else {
							self.lockPeriodeProcess();															
						}
					});
				}
            }else{
                system.alert(self, "Inputan Tidak Boleh Kosong");
            }
        }
        catch(e){
            system.alert(this, e,"");
        }
	},
	lockPeriodeProcess: function(){
		var self = this;
		if(self.fPeriode.getText() != '' || self.fCOCD.getText() != '' || self.fStatus.getText() != ''){
			var data = [];
			var items = {
				cocd : self.fCOCD.getText(),
				cocd2 : self.fCOCD2.getText(),
				periode : self.fPeriode.getText(),
				status : self.fStatus.getText()
			}
			data.push(items);
			this.app.services.callServices("financial_BsplMaster","lockPeriod",[data],function(data){
				if (data == 'process completed') {
					system.info(self, "Data periode berhasil di " + self.fStatus.getText(),"");

					self.fCOCD.setText('');
					self.fCOCD2.setText('');
					self.fStatus.setText('');
				}else {
					system.alert(self, data,"");
				}
			});
		}else{
			system.alert(self, "Inputan Tidak Boleh Kosong");
		}
	},
	loadReport: function(){
		var self = this;
		self.sg1.clear(0);	
		var filter = {
			tgl_jurnal : self.fTglJurnal.getText(),
			tgl_jurnal2 : self.fTglJurnal2.getText()
		};
		this.app.services.callServices("financial_BsplMaster","getJurnalByJenis",[this.app._lokasi,'','CF',filter], function(data){
			if (typeof data != 'undefined' && data != null){
				$.each(data, function(k, val){
					self.sg1.addRowValues([
						val.dc,
						val.post_key,
						val.tgl_jurnal,
						val.kode_akun,
						val.description,
						val.debit,
						val.kredit,
						val.keterangan
					]);
                });
				// self.sg1.addRowValues(["","","",""]);
			}	
		});
	},
	loadID: function(){
		var self = this;
        self.app.services.callServices("financial_BsplMaster","getIDTrf",[self.app._lokasi],function(data){  
			self.fID.setText(data.id_otomatis);                
		});
	},
	doChange: function(sender){
		try{
			if (sender == this.cb_pdrk){
				if(this.cb_pdrk.getText() != ""){
					var self = this;
					self.loadDok(self.cb_pdrk.getText());   
				};
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
				break;
			case "simpan" :
				this.simpan();
				break;
            case "simpancek" : 
                this.simpan();
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
