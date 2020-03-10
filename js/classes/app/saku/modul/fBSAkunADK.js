window.app_saku_modul_fBSAkunADK = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSAkunADK.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSAkunADK";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Akun ADK", 0);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

		this.fAkunAdk = new saiCBBL(this.tab.childPage[0],{bound:[20, 20, 200, 20],labelWidth:100, caption:"Akun ADK", change:[this,"doChange"]});
		this.fAkunAset = new saiCBBL(this.tab.childPage[0],{bound:[20, 45, 200, 20],labelWidth:100,caption:"Akun Aset", change:[this,"doChange"]});
	
		this.fsearch1 = new saiLabelEdit(this.tab.childPage[0],{bound:[350, 20, 200, 20],labelWidth:100,caption:"Search",placeHolder:""});
		this.bOk = new button(this.tab.childPage[0], {bound:[560, 20, 70, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.bOk.setColor("#4cd137");

        this.fCOCD = new saiCBBL(this.tab.childPage[0],{bound:[20, 20, 200, 20],visible:false,labelWidth:100,caption:"COCD", change:[this,"doChange"]});
		this.fAkunParam = new saiCBBL(this.tab.childPage[0],{bound:[20,45,300,20],visible:false,caption:"Akun Parameter", change:[this,"doChange"]});      
		this.fJenisAkun = new saiCB(this.tab.childPage[0],{bound:[20, 70, 200, 20],visible:false,labelWidth:100, caption:"Jenis Akun", items:["Beban Pajak","Utang Pajak","Laba Ditahan"]});
		this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],visible:false,labelWidth:100,caption:"Search",placeHolder:""});
		this.b_exportXls = new button(this.tab.childPage[0], {bound:[1190, 50, 90, 20],visible:false, icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});			

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,610,this.tab.height-200],
			colCount: 2,
			colTitle: ["Akun Aset","Akun Adk"],
			colWidth:[[1,0],[100,100]],			
			columnReadOnly:[true, [1,0],[]],	
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
		var self = this;
		
		this.sg1.on("dblClick", function(col, row, id){
			if(typeof row != 'undefined'){
				self.fAkunAset.setText(self.sg1.cells(0,row));
				self.fAkunAdk.setText(self.sg1.cells(1,row));
			}
		});

		this.container.rearrangeChild(10, 50);
	
		this.setTabChildIndex();
		try {
			var self = this;
			self.loadReport();

			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);
			self.on("close",function(){
				self.app._mainForm.bHapus.setVisible(true);
				self.app._mainForm.bClear.setVisible(true);
			});

            this.fAkunAset.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListAkun",["","","",0]],["glaccount","description"]," ","Daftar Akun");
            this.fAkunAdk.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListAkun",["","","",0]],["glaccount","description"]," ","Daftar Akun");            
        }catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSAkunADK.extend(window.childForm);
window.app_saku_modul_fBSAkunADK.implement({
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
		this.app.services.callServices("financial_BsplMaster","xlsDataParamAkun",[self.app._lokasi,'TX',self.fsearch.getText()], function(data){
			self.hideLoading();
			window.open("./server/reportDownloader.php?f="+data+"&n="+"DATA_PARAMETER_AKUN.xlsx");
		}, function(){
			self.hideLoading();
		});	
	},
	simpan : function(row){
		try{
			try {
				var self = this;
				if(self.fAkunAdk.getText() != '' || self.fAkunAset.getText() != ''){
					var data = [];
					var items = {
						akun_aset : self.fAkunAset.getText(),
						akun_adk : self.fAkunAdk.getText(),
					}
					data.push(items);
					this.app.services.callServices("financial_BsplAdk","saveAdk",[data],function(data){
						if (data == 'process completed') {
							system.info(self, "Data Parameter Akun Berhasil Tersimpan","");

							self.fAkunAset.setText('');
							self.fAkunAdk.setText('');
							
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
		}catch(e){
			systemAPI.alert(e);
		}
	},
	loadReport: function(){
		var self = this;
		self.sg1.clear(0);	
		this.app.services.callServices("financial_BsplAdk","getListAkunAdk",[], function(data){
			if (typeof data != 'undefined' && data != null){
                console.log(data);
				$.each(data, function(k, val){
					self.sg1.addRowValues([	
                        val.akun_aset,
                        val.akun_adk
                    ]);
				});
			}		
		});
	},
	doChange: function(sender){
		try{
			if (sender == this.bOk){				
				var self = this;					
				// if (self.fsearch1.getText() == "" ){
				// 		system.alert(self, "Inputan Tidak Boleh Kosong");
				// }else{
					var self = this;	
					self.app.services.callServices("financial_BsplAdk","searchAdk",[self.fsearch1.getText()], function(data){
						self.sg1.clear(0);	
						if (typeof data != 'undefined' && data != null){			
							$.each(data, function(k, val){
								self.sg1.addRowValues([	
									val.akun_aset,
									val.akun_adk
								]);
							});
						}
					});
				// }
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
