window.app_saku_modul_fBSPARTX = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSPARTX.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSPARTX";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Parameter Akun", 0);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

        this.fCOCD = new saiCBBL(this.tab.childPage[0],{bound:[20, 20, 200, 20],labelWidth:100,caption:"COCD", change:[this,"doChange"]});
		this.fJenisAkun = new saiCB(this.tab.childPage[0],{bound:[20, 45, 200, 20],labelWidth:100, caption:"Jenis Akun", items:["Beban Pajak","Utang Pajak","Laba Ditahan"]});
		this.fAkunParam = new saiCBBL(this.tab.childPage[0],{bound:[20,70,300,20],caption:"Akun Parameter", change:[this,"doChange"]});      
		this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],labelWidth:100,caption:"Search",placeHolder:""});
		this.b_exportXls = new button(this.tab.childPage[0], {bound:[1190, 50, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});			

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,this.tab.width-45,this.tab.height-200],
			colCount: 4,
			colTitle: ["Kode Akun","Nama Akun","Jenis Akun","COCD"],
			colWidth:[[3,2,1,0],[50,100,200,100]],			
			columnReadOnly:[true, [3,2,1,0],[]],	
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
		var self = this;
		
		this.sg1.on("dblClick", function(col, row, id){
			if(typeof row != 'undefined'){
				self.fAkunParam.setText(self.sg1.cells(0,row));
				self.fCOCD.setText(self.sg1.cells(3,row));
				self.fJenisAkun.setText(self.sg1.cells(2,row));
			}
		});

        this.fsearch.on("keyup", function(){
            self.app.services.callServices("financial_BsplMaster","getDataParamAkun",[self.app._lokasi,'TX',self.fsearch.getText()], function(data){
				// console.log(data);
				if (typeof data != 'undefined' && data != null){
            		self.sg1.clear(0);	
                    $.each(data, function(k, val){
                        self.sg1.addRowValues([
                            val.id,
                            val.kode_akun,
							val.description,
							val.cc
                        ]);
                    });
                    // self.sg1.addRowValues(["","","",""]);
                }else{
                    // system.alert(self, "Data Report Tidak ditemukan","");
                }	
            });
        });

		this.container.rearrangeChild(10, 50);
	
		this.setTabChildIndex();
		try {
			var self = this;
			self.loadReport();
            this.fCOCD.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
            this.fAkunParam.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListAkunAset",["","","",0]],["glaccount","description"]," ","Daftar Company code");            
        }catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSPARTX.extend(window.childForm);
window.app_saku_modul_fBSPARTX.implement({
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
				if(self.fAkunParam.getText() != '' || self.fJenisAkun.getText() != '' || self.fCOCD.getText() != ''){
					var data = [];
					var items = {
						kode_akun : self.fAkunParam.getText(),
						jenis_akun : self.fJenisAkun.getText(),
						cc : self.fCOCD.getText()
					}
					data.push(items);
					this.app.services.callServices("financial_BsplMaster","addParamAkun",[data],function(data){
						if (data == 'process completed') {
							system.info(self, "Data Parameter Akun Berhasil Tersimpan","");

							self.fAkunParam.setText('');
							self.fJenisAkun.setText('');
							self.fCOCD.setText('');

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
		this.app.services.callServices("financial_BsplMaster","getDataParamAkun",[this.app._lokasi,"",""], function(data){
			if (typeof data != 'undefined' && data != null){
                console.log(data);
				$.each(data, function(k, val){
					self.sg1.addRowValues([	
                        val.kode_akun,
                        val.description,
                        val.jenis_akun,
                        val.cc
                    ]);
				});
				// self.sg1.addRowValues(["","","",""]);
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
