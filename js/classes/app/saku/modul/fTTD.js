window.app_saku_modul_fTTD = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fTTD.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fTTD";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "TTD BA", 0);

		uses("control_popupForm;column;saiMemo;radioButton;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
        this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});

		this.tab = new pageControl(this.container,{bound:[20,0,this.width - 60,this.height-100],
				childPage: ["Data Form"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

		this.fcocd = new saiCBBL(this.tab.childPage[0],{bound:[20,20,300,20], caption:"Comp. Code",multiSelection:false, btnClick:[this,"doCCClick"],change:[this,"doChange"]});
		this.fNik = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 45, 300, 20],labelWidth:100,caption:"NIK",placeHolder:""});
        this.fNama = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 70, 450, 20],labelWidth:100,caption:"Nama",placeHolder:""});
        this.fPeriode = new saiLabelEdit(this.tab.childPage[0],{bound:[20, 95, 300, 20],labelWidth:100,caption:"Periode",placeHolder:""});
		this.fFCBP = new saiCB(this.tab.childPage[0],{bound:[20, 120, 300, 20],labelWidth:100, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
		this.status1 = new radioButton(this.tab.childPage[0],{bound:[20,145,100,20], caption:"PIC", selected:true});
		this.status2 = new radioButton(this.tab.childPage[0],{bound:[80,145,100,20], caption:"NON PIC"});
        this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],labelWidth:100,caption:"Search",placeHolder:""}); 
		
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
		this.bCancelCC = new button(this.pCC,{bound:[320,210,80,20], caption:"Cancel", click:[this,"doOkClick"]});
		var self = this;
		this.app.services.callServices("financial_mantisMaster","getListCompCode",[""], function(data){
			self.sgTCC.clear();
			self.sgTCC.setData(data,["cocd","company_name","sts"]);
		});

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[20,175,this.tab.width-45,this.tab.height-200],
			colCount: 6,
			colTitle: ["Comp. Code","NIK","Nama","Periode","FCBP","IS PIC"],
			colWidth:[[5,4,3,2,1,0],[60,100,120,250,100,100]],
			colFormat:[[],[]],					
			columnReadOnly:[true, [5,4,3,2,1,0],[]],	
			rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
		var self = this;
		
		this.sg1.on("dblClick", function(col, row, id){
			if(typeof row != 'undefined'){
				if(self.sg1.cells(5,row) == 'PIC'){
					self.status1.setSelected(true);
					self.status2.setSelected(false);
				}else{
					self.status1.setSelected(false);
					self.status2.setSelected(true);
				}
				self.fcocd.setText(self.sg1.cells(0,row));
				self.fNik.setText(self.sg1.cells(1,row));
				self.fNama.setText(self.sg1.cells(2,row));
				self.fPeriode.setText(self.sg1.cells(3,row));
				self.fFCBP.setText(self.sg1.cells(4,row));
			}
		});

        this.fsearch.on("keyup", function(){
            self.app.services.callServices("financial_mantisTTD","getDataTTDBA",[self.app._lokasi,self.fsearch.getText()], function(data){
                if (typeof data != 'undefined'){
            		self.sg1.clear(0);	
                    $.each(data, function(k, val){
                        self.sg1.addRowValues([
                            val.cocd,
                            val.nik,
                            val.nama,
                            val.periode,
                            val.fcbp,                        
                            val.is_pic                        
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
            // this.fcocd.setServices(this.app.servicesBpc, "callServices",["financial_mantisTTD","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fTTD.extend(window.childForm);
window.app_saku_modul_fTTD.implement({
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
	doOkClick:function(sender){
		if (sender == this.bOkCC){
			var CC = "";
			for (var i = 0; i < this.sgTCC.getRowCount();i++){
				if (this.sgTCC.cells(2,i) == "TRUE"){
					CC += (CC == "" ? "":",") + this.sgTCC.cells(0,i);
				}
			}
			this.fcocd.setText(CC);
			this.pCC.hide();
		}
		if (sender == this.bCancelCC){
			this.pCC.hide();
		}
	},
	doCCClick: function(sender){
		try{
			if (sender == this.fcocd){
				if (this.pCC.visible){
					this.pCC.hide();
				}else {
					var CC = this.fcocd.getText().split(",");
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
					var node = this.fcocd.getCanvas();
					this.bOkCC.show();
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
	simpan : function(row){
		try{
			try {
				var self = this;
				if(self.fcocd.getText() != '' || self.fNik.getText() != '' || self.fNama.getText() != '' || self.fPeriode.getText() != '' || self.fFCBP.getText() != ''){
					var data = [];
					var items = {
						cocd : self.fcocd.getText(),
						pic : this.status1.selected,
						nonpic : this.status2.selected,
						nik : self.fNik.getText(),
						nama : self.fNama.getText(),
						periode : self.fPeriode.getText(),
						fcbp : self.fFCBP.getText()
					}
					data.push(items);
					this.app.services.callServices("financial_mantisTTD","addTTDBA",[data],function(data){
						if (data == 'process completed') {
							system.info(self, "Data TTD BA berhasil tersimpan","");

							self.fcocd.setText('');
							self.fNik.setText('');
							self.fNama.setText('');
							self.fPeriode.setText('');
							self.fFCBP.setText('');

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
	deleteTTD : function(row){
		try{
			try {
				var self = this;
				if(self.fcocd.getText() != '' || self.fNik.getText() != '' || self.fNama.getText() != '' || self.fPeriode.getText() != '' || self.fFCBP.getText() != ''){
					var data = [];
					var items = {
						cocd : self.fcocd.getText(),
						pic : this.status1.selected,
						nonpic : this.status2.selected,
						nik : self.fNik.getText(),
						nama : self.fNama.getText(),
						periode : self.fPeriode.getText(),
						fcbp : self.fFCBP.getText()
					}
					data.push(items);
					this.app.services.callServices("financial_mantisTTD","delTTDBA",[data],function(data){
						if (data == 'process completed') {
							system.info(self, "Data TTD BA berhasil dihapus","");

							self.fcocd.setText('');
							self.fNik.setText('');
							self.fNama.setText('');
							self.fPeriode.setText('');
							self.fFCBP.setText('');

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
		this.app.services.callServices("financial_mantisTTD","getDataTTDBA",[this.app._lokasi,""], function(data){
			console.log(data);
			if (typeof data != 'undefined'){
				$.each(data, function(k, val){
					self.sg1.addRowValues([
						val.cocd,
						val.nik,
						val.nama,
                        val.periode,
						val.fcbp,                        
						val.is_pic                        
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
				this.deleteTTD();
				break;
		}
	}
});
