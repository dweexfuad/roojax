window.app_saku_modul_fBSAsetKlp = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSAsetKlp.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSAsetKlp";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Kelompok Aset", 0);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

		this.fKlp = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 20, 300, 20],labelWidth:100,caption:"Kelompok Aset",placeHolder:""});
        this.fNama = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 45, 450, 20],labelWidth:100,caption:"Nama",placeHolder:""});
		this.fAkunAset = new saiCBBL(this.tab.childPage[0],{bound:[20,70,300,20],caption:"Akun Aset",readOnly:true, change:[this,"doChange"]});
		this.fAkunAP = new saiCBBL(this.tab.childPage[0],{bound:[20,95,300,20],caption:"Akun AP",readOnly:true, change:[this,"doChange"]});
		this.fAkunBP = new saiCBBL(this.tab.childPage[0],{bound:[20,120,300,20],caption:"Akun BP",readOnly:true, change:[this,"doChange"]});
        this.fUmur = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 145, 300, 20],labelWidth:100,caption:"Umur (Bulan)",tipeText:ttNilai,placeHolder:""});
        this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],labelWidth:100,caption:"Search",placeHolder:""}); 
		this.b_exportXls = new button(this.tab.childPage[0], {bound:[1190, 50, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});	
		
		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,this.tab.width-45,this.tab.height-200],
			colCount: 6,
			colTitle: ["Kelompok Aset","Nama","Akun Aset","Akun AP","Akun BP","Umur (Bulan)"],
			colWidth:[[5,4,3,2,1,0],[100,200,200,200,200,150]],
			colFormat:[[],[]],					
			columnReadOnly:[true, [5,4,3,2,1,0],[]],	
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
		var self = this;
		
		this.sg1.on("dblClick", function(col, row, id){
			if(typeof row != 'undefined'){
				self.fKlp.setText(self.sg1.cells(0,row));
				self.fNama.setText(self.sg1.cells(1,row));
				self.fAkunAset.setText(self.sg1.cells(2,row));
				self.fAkunAP.setText(self.sg1.cells(3,row));
				self.fAkunBP.setText(self.sg1.cells(4,row));
				self.fUmur.setText(self.sg1.cells(5,row));
			}
		});

        this.fsearch.on("keyup", function(){
            self.app.services.callServices("financial_BsplMaster","getDataKlpAset",[self.app._lokasi,self.fsearch.getText()], function(data){
                if (typeof data != 'undefined' && data != null){
            		self.sg1.clear(0);	
                    $.each(data, function(k, val){
                        self.sg1.addRowValues([
                            val.klp_aset,
                            val.nama,
                            val.akun_aset,
                            val.akun_ap,
                            val.akun_bp,                        
                            val.umur
                        ]);
                    });
                    // self.sg1.addRowValues(["","","",""]);
                }else{
                    system.alert(self, "Data Report Tidak ditemukan","");
                }	
            });
        });

		this.container.rearrangeChild(10, 50);
	
		this.setTabChildIndex();
		try {
			this.loadReport();
            this.fAkunAset.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListAkunAset",["","","",0]],["glaccount","description"]," ","Daftar Company code");
            this.fAkunAP.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListAkunAset",["","","",0]],["glaccount","description"]," ","Daftar Company code");
            this.fAkunBP.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListAkun",["","","",0]],["glaccount","description"]," ","Daftar Company code");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSAsetKlp.extend(window.childForm);
window.app_saku_modul_fBSAsetKlp.implement({
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
		if(sender == this.b_exportXls){
			this.doExport();
		}
	},
	doExport: function(){
		var self = this;
		self.showLoading("Export to Xls...");
		this.app.services.callServices("financial_BsplMaster","xlsDataKlpAset",[self.app._lokasi,self.fsearch.getText()], function(data){
			self.hideLoading();
			window.open("./server/reportDownloader.php?f="+data+"&n="+"DATA_KELOMPOK_ASET.xlsx");
		}, function(){
			self.hideLoading();
		});	
	},
	simpan : function(row){
		try {
			var self = this;
			if(self.fKlp.getText() != '' || self.fNama.getText() != '' || self.fAkunAset.getText() != '' || self.fAkunAP.getText() != '' || self.fAkunBP.getText() != '' || self.fUmur.getText() != ''){
				var data = [];
				var items = {
					klp_aset : self.fKlp.getText(),
					nama : self.fNama.getText(),
					akun_aset : self.fAkunAset.getText(),
					akun_ap : self.fAkunAP.getText(),
					akun_bp : self.fAkunBP.getText(),
					umur : self.fUmur.getText()
				}
				data.push(items);
				this.app.services.callServices("financial_BsplMaster","addKlpAset",[data],function(data){
					if (data == 'process completed') {
						system.info(self, "Data kelompok aset berhasil tersimpan","");

						self.fKlp.setText('');
						self.fNama.setText('');
						self.fAkunAset.setText('');
						self.fAkunAP.setText('');
						self.fAkunBP.setText('');
						self.fUmur.setText('');

						self.loadReport();
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
	},
	loadReport: function(){
		var self = this;
		self.sg1.clear(0);	
		this.app.services.callServices("financial_BsplMaster","getDataKlpAset",[this.app._lokasi,""], function(data){
			if (typeof data != 'undefined' && data != null){
				$.each(data, function(k, val){
					self.sg1.addRowValues([
						val.klp_aset,
						val.nama,
						val.akun_aset,
                        val.akun_ap,
						val.akun_bp,                        
						val.umur
					]);
				});
				// self.sg1.addRowValues(["","","",""]);
			}else{
				system.alert(self, "Data Report Tidak ditemukan","");
			}		
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
