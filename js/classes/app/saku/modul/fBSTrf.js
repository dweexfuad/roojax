window.app_saku_modul_fBSTrf = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSTrf.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSTrf";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Data Tarif", 0);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

		this.fCOCD = new saiCBBL(this.tab.childPage[0],{bound:[20, 20, 200, 20],labelWidth:100,caption:"COCD", change:[this,"doChange"]});
        this.fNama = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 45, 450, 20],labelWidth:100,caption:"Nama",placeHolder:""});
        this.fTrf = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 70, 300, 20],labelWidth:100,caption:"Tarif",tipeText:ttNilai,placeHolder:""});
		this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],labelWidth:100,caption:"Search",placeHolder:""});
		this.b_exportXls = new button(this.tab.childPage[0], {bound:[1190, 50, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});			

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,this.tab.width-45,this.tab.height-200],
			colCount: 3,
			colTitle: ["Nama","Tarif","COCD"],
			colWidth:[[2,1,0],[50,50,200]],
			colFormat:[[1],[cfNilai]],					
			columnReadOnly:[true, [2,1,0],[]],	
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
		var self = this;
		
		this.sg1.on("dblClick", function(col, row, id){
			if(typeof row != 'undefined'){
				self.fNama.setText(self.sg1.cells(0,row));
				self.fTrf.setText(self.sg1.cells(1,row));
				self.fCOCD.setText(self.sg1.cells(2,row));
			}
		});

        this.fsearch.on("keyup", function(){
            self.app.services.callServices("financial_BsplMaster","getDataTrf",[self.app._lokasi,self.fsearch.getText()], function(data){
				console.log(data);
				if (typeof data != 'undefined' && data != null){
            		self.sg1.clear(0);	
                    $.each(data, function(k, val){
                        self.sg1.addRowValues([
                            val.nama,
							val.tarif,
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
        }catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSTrf.extend(window.childForm);
window.app_saku_modul_fBSTrf.implement({
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
		this.app.services.callServices("financial_BsplMaster","xlsDataTrf",[self.app._lokasi,self.fsearch.getText()], function(data){
			self.hideLoading();
			window.open("./server/reportDownloader.php?f="+data+"&n="+"DATA_KELOMPOK_ASET.xlsx");
		}, function(){
			self.hideLoading();
		});	
	},
	simpan : function(row){
		try{
			try {
				var self = this;
				if(self.fNama.getText() != '' || self.fTrf.getText() != '' || self.fCOCD.getText() != ''){
					var data = [];
					var items = {
						nama : self.fNama.getText(),
						tarif : self.fTrf.getText(),
						cc : self.fCOCD.getText()
					}
					data.push(items);
					this.app.services.callServices("financial_BsplMaster","addTrf",[data],function(data){
						if (data == 'process completed') {
							system.info(self, "Data Tarif berhasil tersimpan","");

							self.fNama.setText('');
							self.fTrf.setText('');
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
		this.app.services.callServices("financial_BsplMaster","getDataTrf",[this.app._lokasi,""], function(data){
			if (typeof data != 'undefined' && data != null){
				$.each(data, function(k, val){
					self.sg1.addRowValues([
						val.nama,
						val.tarif,
						val.cc
					]);
				});
				// self.sg1.addRowValues(["","","",""]);
			}		
		});
	},
	// loadID: function(){
	// 	var self = this;
    //     self.app.services.callServices("financial_BsplMaster","getIDTrf",[self.app._lokasi],function(data){  
	// 		self.fID.setText(data.id_otomatis);                
	// 	});
	// },
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
