window.app_saku_modul_fBSCF = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSCF.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSCF";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Generate Jurnal Carry Forward", 99);

		uses("control_popupForm;datePicker;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-60],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);
		
		this.fPeriode = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 20, 150, 20],labelWidth:80,caption:"Tahun",placeHolder:"YYYY"});
		this.bGenerateJurnal = new button(this.tab.childPage[0],{bound:[170,20,130,20],icon:"<i class='fa fa-retweet' style='color:white'></i>", caption:"Generate Jurnal ", click: [this, "doClick"], keyDown:[this, "keyDown"]});  
		this.bSimpan = new button(this.tab.childPage[0],{bound:[170,45,130,20],icon:"<i class='fa fa-save' style='color:white'></i>", caption:"Simpan Jurnal ", click: [this, "doClick"], keyDown:[this, "keyDown"]}); 
		
		this.bGenerateJurnal.setColor("blue");
		this.bSimpan.setColor("green");	

		this.lch01 = new label(this.tab.childPage[0],{bound:[350, 20, this.tab.width-405, 100],alignment:"left",caption:"Log: ",fontSize:11});
		this.pLog = new panel(this.tab.childPage[0], {bound:[390, 20, this.tab.width-405, 100]});
		this.log = new control(this.pLog, {bound:[0,0,this.pLog.width-25,this.pLog.height-8]});
		
		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[10,140,this.tab.width-15,this.tab.height-150],
			colCount: 13,
			headerHeight: 50,			
			colTitle: ["ICM","COCD","TP","No.Aset","DR / CR","PK","TGL JURNAL","ORIG ACCT","ACCT COA","NAMA AKUN","DEBET","KREDIT","KETERANGAN"],
			colWidth:[[12,11,10,9,8,7,6,5,4,3,2,1,0],[270,120,120,120,100,100,90,30,30,100,40,40,100]],
			colFormat:[[11,10],[cfNilai,cfNilai]],
			columnReadOnly:[true, [0,1,2,3,4,5,6,7,8,9,10,11,12],[]],		
            rowPerPage:50, autoPaging:true, pager:[this,"doPager3"]
		});
        
		// this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[10,200,this.tab.width-15,this.tab.height-210],
		// 	colCount: 8,
		// 	headerHeight: 50,			
		// 	colTitle: ["DR/CR","POST KEY","TGL JURNAL","KODE AKUN","NAMA AKUN","DEBET","KREDIT","KETERANGAN"],
		// 	colWidth:[[7,6,5,4,3,2,1,0],[180,150,150,150,100,150,70,50]],
		// 	colFormat:[[6,5],[cfNilai,cfNilai]],
		// 	columnReadOnly:[true, [0,1,2,3,4,5,6,7],[]],		
        //     rowPerPage:50, autoPaging:true, pager:[this,"doPager3"]
		// });
		// var self = this;
		
		// this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 70), 1, 685, 100],caption:"Filter Data",border:1});
		// this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.fTglJurnal = new datePicker(this.pnl1,{bound:[10, 23, 170, 20],labelWidth:80,readOnly:true,caption:"Tgl Jurnal",placeHolder:"dd/mm/yyyy"});
		// this.fTglJurnal2 = new datePicker(this.pnl1,{bound:[202, 23, 90, 20],labelWidth:0,readOnly:true,caption:"",placeHolder:"dd/mm/yyyy"});
		// this.ltitleSD= new label(this.pnl1,{bound:[181,25,5,20],alignment:"center",caption:"S/D",fontSize:9}); 

		// this.bOk = new button(this.pnl1, {bound:[580, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click: [this, "doClick"], keyDown:[this, "keyDown"]});
		// this.bOk.setColor("#4cd137");
		// this.bCancel = new button(this.pnl1, {bound:[270, 20,80,20], visible:false, icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		// this.bCancel.setColor("#e84393");
		// this.bCancel.on("click", function(){
		// 	self.pSearch.hide();
		// });
		// this.b_exportXls = new button(this.pnl1, {bound:[580, 53, 80, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Excel", click:[this,"doClick"]});		

		this.container.rearrangeChild(10, 50);
	
		this.setTabChildIndex();
		try {
			var self = this;
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();

			if(mm == '01'){
				self.fPeriode.setText(yyyy-1);
			}else{
				self.fPeriode.setText(yyyy);
			}

			self.bSimpan.hide();
			// self.loadReport();
        }catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSCF.extend(window.childForm);
window.app_saku_modul_fBSCF.implement({
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
			this.generateJurnalSimulation();
		}else if(sender == this.bSimpan){
			this.generateJurnal();
		}else if(sender == this.bOk){
			if(this.fTglJurnal.getText() != '' || this.fTglJurnal2.getText() != ''){
				// this.loadReport();
			}else{
				system.alert(self, "Inputan Tidak Boleh Kosong");
			}
		}else if(sender == this.b_exportXls){
			this.doExport();
		}
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
	generateJurnalSimulation: function(sender){
		var self = this;
		self.sg1.clear(0);
		self.log.getCanvas().html('');		
        this.app.services.callServices("financial_BsplMaster","genJurnalCFSimulation",[this.app._lokasi,this.fPeriode.getText()],function(data){
			console.log(data);
			self.bSimpan.show();		
			if (typeof data.alert_aset != 'undefined' && data.alert_aset != null){
				self.log.getCanvas().html(data.alert_aset);
			}
			if (typeof data.jurnal != 'undefined' && data.jurnal != null){
				self.bSimpan.show();		
				$.each(data.jurnal, function(k, val){
					if(val.post_key == '40'){
						var debit = val.nilai;
						var kredit = 0;
						var dc = 'D';
					}else{
						var debit = 0;
						var kredit = val.nilai;
						var dc = 'C';
					}
					self.sg1.addRowValues([
						val.icm,
						val.cc,
						val.tp,
						val.no_aset,
						dc,
						val.post_key,
						val.tgl_jurnal,
						val.kode_akun,
						val.akun_tlkm,
						val.description,
						debit,
						kredit,
						val.keterangan
					]);
                });
			}	
        });
    },
    generateJurnal: function(sender){
		var self = this;
        this.app.services.callServices("financial_BsplMaster","genJurnalCF",[this.app._lokasi,this.fPeriode.getText()],function(data){
            if (data == 'process completed') {
				// self.loadReport();
				system.info(self, "Process Completed","");
				self.bSimpan.hide();				
            }else {
                system.alert(self, data,"");
            }
        });
    },
	simpan : function(row){
		try{
			try {
				var self = this;
				if(self.fID.getText() != '' || self.fNama.getText() != '' || self.fTrf.getText() != ''){
					var data = [];
					var items = {
						id : self.fID.getText(),
						nama : self.fNama.getText(),
						tarif : self.fTrf.getText(),
						cc : self.fCOCD.getText()
					}
					data.push(items);
					this.app.services.callServices("financial_BsplMaster","addTrf",[data],function(data){
						if (data == 'process completed') {
							system.info(self, "Data kelompok aset berhasil tersimpan","");

							self.fID.setText('');
							self.fNama.setText('');
							self.fTrf.setText('');
							self.fCOCD.setText('');

							self.loadReport();
							self.loadID();
						}else {
							system.alert(self, data,"");
						}
					});
				}else{
					system.alert(self, "Inputan Tidak Boleh Kosong");
				}
			}
			catch(e){
				system.alert(this, e,"");
			}
		}catch(e){
			systemAPI.alert(e);
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
