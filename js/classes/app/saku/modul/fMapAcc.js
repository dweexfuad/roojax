window.app_saku_modul_fMapAcc = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fMapAcc.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fMapAcc";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Mapping Akun", 0);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

		this.cocd = new saiCBBL(this.tab.childPage[0],{bound:[20,20,300,20],caption:"Comp. Code"});
		
		this.cocd.on("change", () => {
			this.app.services.callServices("financial_mantisMaster","getCOA",[this.cocd.getText()],(data) => {
				this.coa.setText(data);
				this.loadReport();
			});       	
		});
		
		this.coa = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 45, 300, 20],labelWidth:100,caption:"COA",placeHolder:""});
		this.orig = new saiCBBL(this.tab.childPage[0],{bound:[20,70,300,20],caption:"Orig. Account",readOnly:false});
		this.orig.on("change", () =>{
			this.app.services.callServices("financial_mantisMaster","getOrigDetail",[this.coa.getText(), this.orig.getText(), this.cocd.getText()],(data) => {	
				this.desc.setText(data.nama);
				this.cb_klp.setText(data.code);
				this.mapAcc.setText(data.gl_acct);
				
			});       
		});
		this.desc = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 95, 450, 20],labelWidth:100,caption:"Deskripsi",placeHolder:""});
		this.cb_klp = new saiCB(this.tab.childPage[0],{bound:[20,120,300,20],caption:"Kelompok"});
		this.app.services.callServices("financial_mantisMaster","getListKlpAcc",[],function(data){	
			$.each(data, function(key, val){
				self.cb_klp.addItem(val.code, val.code);
			});
		});       
        this.mapAcc = new saiCBBL(this.tab.childPage[0],{bound:[20,145,300,20],caption:"Mapping Akun", change:[this,"doChange"]});
        this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],labelWidth:100,caption:"Search",placeHolder:"", tag:99}); 

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,this.tab.width-45,this.tab.height-200],
			colCount: 5,
			colTitle: ["Comp. Code","Orig. Account","Deskripsi","Kelompok Akun","Mapping Account"],
			colWidth:[[4,3,2,1,0],[200,150,250,120,100]],
			columnReadOnly:[true, [4,3,2,1,0],[]],	
			colFormat:[[],[]],					
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
        var self = this;

        this.fsearch.on("keyup", function(){
			if (self.myTimeExecSearch){
				clearTimeout(self.myTimeExecSearch);
			}
			self.myTimeExecSearch = setTimeout(function(){
				self.app.services.callServices("financial_mantisMaster","getDataMapAcc",[self.coa.getText(),self.fsearch.getText()], function(data){
					console.log(JSON.stringify(data));
					self.sg1.clear();
					if (typeof data != 'undefined'){
						
						$.each(data, function(k, val){
							self.sg1.addRowValues([
								val.cocd,
								val.orig_acct,
								val.long_text,
								val.code,
								val.gl_acct                        
							]);
						});
						// self.sg1.addRowValues(["","","",""]);
					}else{
						system.alert(self, "Data Report Tidak ditemukan","");
					}	
				});
			},500);
            
        });
        
        // this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,this.tab.width-45,this.tab.height-200],
		// 	colCount: 6,
		// 	colTitle: ["Comp. Code","COA","Orig. Account","Deskripsi","Kelompok Akun","Mapping Account"],
		// 	colWidth:[[5,4,3,2,1,0],[200,150,250,120,120,100]],
		// 	columnReadOnly:[true, [5,4,3,2,1,0],[]],	
		// 	colFormat:[[],[]],					
		// 	rowPerPage:500, autoPaging:true, pager:[this,"doPager3"]});
		// var self = this;

		// this.container.rearrangeChild(10, 50);
	
		this.setTabChildIndex();
		try {
			
            self.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantisMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code", true);

            self.orig.setServices(this.app.servicesBpc, "callServices",["financial_mantisMaster","getListAcc",["","","",0]],["glaccount","description"]," ","Daftar Company code", false);

            self.mapAcc.setServices(this.app.servicesBpc, "callServices",["financial_mantisMaster","getListAcc",["","","",0]],["glaccount","description"]," ","Daftar Company code", false);
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fMapAcc.extend(window.childForm);
window.app_saku_modul_fMapAcc.implement({
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
		if(sender == this.bExportTemplate){
			this.doExportTemplate();
		}else if(sender == this.bExportResult){
			this.doExportResult();
		}else if(sender == this.bSearchPeriode){
			if(this.cbMonth.getText() != '' && this.fYear.getText() != ''){
				this.sg2.clear(0);	
				this.loadReklasSAP();
			}else{
				system.alert(self, "Inputan Bulan dan Tahun Tidak Boleh Kosong");
			}
		}
	},
	doExportTemplate: function(){
		var self = this;
		self.showLoading("Export to Xls...");
		window.open("docs/template%20koreksi%20activity.xlsx");
		self.hideLoading();
	},
	doExportResult: function(){
		var self = this;
		self.showLoading("Export to Xls...");
		this.app.services.callServices("financial_Amor","xlsReportHasilKoreksi",[this.app._lokasi], function(data){
			self.hideLoading();
			window.open("./server/reportDownloader.php?f="+data+"&n="+"Hasil_Koreksi.xlsx");
		}, function(){
			self.hideLoading();
		});	
	},
	simpan : function(row){
		try{
			if (this.checkEmptyByTag([0])){
				try {
					var self = this;
					if(self.cocd.getText() != '' || self.coa.getText() != '' || self.orig.getText() != '' || self.desc.getText() != '' || self.cb_klp.getText() != '' || self.mapAcc.getText() != ''){
						var data = [];
                        var items = {
                            coa : self.coa.getText(),
                            akun : self.orig.getText(),
                            nama : self.desc.getText(),
                            klp : self.cb_klp.getText().trim(),
                            akun_map : self.mapAcc.getText()
                        }
                        data.push(items);
						this.app.services.callServices("financial_mantisMaster","addMappingCOA",[self.cocd.getText(),data],function(data){
							if (data.ret) {
								system.info(self, "Data Mapping Akun berhasil tersimpan","");
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
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	loadReport: function(){
		var self = this;
		self.sg1.clear(0);	
		this.app.services.callServices("financial_mantisMaster","getDataMapAcc",[this.coa.getText(),""], function(data){
			console.log(JSON.stringify(data));
			if (typeof data != 'undefined'){
				$.each(data, function(k, val){
					self.sg1.addRowValues([
						val.cocd,
						val.orig_acct,
						val.long_text,
                        val.code,
						val.gl_acct                        
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
