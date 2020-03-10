window.app_saku_report_fBARek = function(owner)
{
	if (owner)
	{
		window.app_saku_report_fBARek.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_report_fBARek";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Report BA Rekon", 0);

		uses("column;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;sgNavigator;column;frame", true);			
		var self=this;
		
		this.tab = new pageControl(this,{bound:[20,10,this.width-40,this.height-35],
			childPage: ["Document List","View BA","View Summary BA"],
			borderColor:"#35aedb", headerAutoWidth:false});	

		this.tab2 = new pageControl(this.tab.childPage[1],{bound:[10,10,this.tab.width-20,this.tab.height-40],
			childPage: ["View BA 1","View BA 2","View BA 3","View BA 4"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});	
		
		this.bTambah = new button(this.tab.childPage[0],{bound:[10,10,80, 30],icon:"<i class='fa fa-plus' style='color:white'></i>", visible:false, caption:"Input"});
		this.bTambah.setColor("#474787");

		this.bUpl = new button(this.tab.childPage[0],{bound:[100,10,80, 30],icon:"<i class='fa fa-upload' style='color:white'></i>", visible:false, caption:"Upload"});
		this.bUpl.setColor("green");
		

		this.bCariICM = new saiLabelEdit(this.tab.childPage[0], {bound:[this.width-320, 20, 200, 20],caption:"Search...", visible:false,placeHolder:true});
	
		this.bCariICM2 = new button(this.tab.childPage[0],{bound:[this.width-200, 20, 100, 20], visible:false, icon:"<i class='fa fa-filter' style='color:white'></i>", caption:"Filter"});
		this.bCariICM2.setColor("#6c5ce7");

		this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 30), 1, 655, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.f1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[160, 23, 20, 20], caption:"s/d", bold: true, fontSize:9});		
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.f7 = new saiLabelEdit(this.pnl1,{bound:[340, 23, 170, 20],labelWidth:80,caption:"No.ICM",placeHolder:""});
		
		this.f3 = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa", change:[this,"doChange"]});	
		this.cb_fcbp = new saiCB(this.pnl1,{bound:[this.f3.left + this.f3.width + 20, 48, 170, 20],labelWidth:80,caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"] });

		this.f4 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status", items:["Open","Clear","Unclear","Close"] });
		this.f5 = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD", change:[this,"doChange"]});
		this.f6 = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP", change:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[540, 60, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});	
		
		this.bOk = new button(this.pnl1, {bound:[550, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.bOk.setColor("#4cd137");
		this.bCancel = new button(this.pnl1, {bound:[270, 20,80,20], visible:false, icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.bCancel.setColor("#e84393");
		this.bCancel.on("click", function(){
			self.pSearch.hide();
		});

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[10,120,this.width-60,this.height-160],
			colCount: 14,
			colTitle: ["IC DOC","COCD","TP","Periode","Kode Jasa","Nama Jasa","Pekerjaan","Curr","FCBP","Status","No Jurnal Kirim","No Jurnal Terima","View BA","Vew Summary BA"],
			colWidth:[[13,12,11,10,9,8,7,6,5,4,3,2,1,0],[120,60,110,110,80,60,40,150,180,80,60,40,50,100]],
			// columnReadOnly:[true, [0,1,2,3,4,5],[]],		
			// colFormat:[[7],[cfNilai]],		
			rowPerPage:15, 
			autoPaging:true, 
			pager:[this,"doPager"],
			ellipsClick: [this,"doEllipsClick"]
		});


		
		var dokViewer = new control(this.tab2.childPage[0], {bound:[0,10, this.width-100, this.height-100 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		dokViewer.getCanvas().append(frame);
		dokViewer.frame = frame;
		this.viewba1 = new labelCustom(this.tab2.childPage[0], {bound:[0,10,10,30], caption:" ", frame: dokViewer });
			this.viewba1.frame.show();
		
		var dokViewer2 = new control(this.tab2.childPage[1], {bound:[0,10, this.width-100, this.height-100 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		dokViewer2.getCanvas().append(frame);
		dokViewer2.frame = frame;
		this.viewba2 = new labelCustom(this.tab2.childPage[1], {bound:[0,10,10,30], caption:" ", frame: dokViewer2 });
		this.viewba2.frame.show();
		
		var dokViewer3 = new control(this.tab2.childPage[2], {bound:[0,10, this.width-100, this.height-100 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		dokViewer3.getCanvas().append(frame);
		dokViewer3.frame = frame;
		this.viewba3 = new labelCustom(this.tab2.childPage[2], {bound:[0,10,10,30], caption:" ", frame: dokViewer3 });
		this.viewba3.frame.show();

		var dokViewer4 = new control(this.tab2.childPage[3], {bound:[0,10, this.width-100, this.height-100 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		dokViewer4.getCanvas().append(frame);
		dokViewer4.frame = frame;
		this.viewba4 = new labelCustom(this.tab2.childPage[3], {bound:[0,10,10,30], caption:" ", frame: dokViewer4 });
		this.viewba4.frame.show();



		self.sg1.on("dblClick", function(col, row, id){
			//kalo terima
			if(col == 11 ){
				
				// self.app.services.callServices("financial_mantis","getTerima",[self.sg1.cells(0, row)], function(data){
				// 	console.log("isi compcode"+data.induk.cc);
				// 	if( self.app._lokasi == data.induk.cc ){
				// 		system.alert(self, "Anda Diluar Akses Untuk Menerima Dokumen!", "");
				// 	}else{
				// 		self.baru = "TRM";
				// 		self.tab.setActivePage(self.tab.childPage[1]);
				// 		self.cocd.setText(data.induk.tp);
				// 		self.jasa.setText(data.induk.kode_jasa);
				// 		self.tahun.setText(data.induk.year);
				// 		self.curr.setText(data.induk.currency);
				// 		self.tp.setText(data.induk.cc);
				// 		self.fcbp.setText(data.induk.fcbp);
				// 		self.bulan.setText(data.induk.month);
				// 		self.icm.setText(data.induk.icm);
				// 		self.pekerjaan.setText(data.induk.pekerjaan);
				// 		self.idheader_old = data.induk.idheader;
				// 	}
				// });
			}

			//recurring
			if(col == 15 ){
				// if(self.sg1.cells(15, row) == "-"){
				// 	system.alert(self, "Anda Diluar Akses Untuk Melakukan Recurring!", "");
				// }else{
				// 	self.baru = "REC";
				// 	self.idheader_old = "-";
				// 	self.bCreateICM.setVisible(false);
				// 	self.tab.setActivePage(self.tab.childPage[1]);
				// 	self.app.services.callServices("financial_mantis","getTerima",[self.sg1.cells(0, row)], function(data){
				// 		self.cocd.setText(data.induk.tp),
				// 		self.jasa.setText(data.induk.kode_jasa),
				// 		self.tahun.setText(data.induk.year),
				// 		self.curr.setText(data.induk.currency),
				// 		self.tp.setText(data.induk.cc),
				// 		self.fcbp.setText(data.induk.fcbp),
				// 		self.bulan.setText(data.induk.month),
				// 		self.icm.setText(data.induk.icm),
				// 		self.pekerjaan.setText(data.induk.pekerjaan)
				// 	});
				// 	this.tabTerima = new pageControl(this.tab.childPage[1],{bound:[20,10,this.width-90,this.height-50],
				// 		childPage: ["BA Rekon 1","BA Rekon 2"],
				// 		borderColor:"#35aedb", headerAutoWidth:false});
				// }
					
			};

			//view ba
			if(col == 12){
				self.tab.setActivePage(self.tab.childPage[1]);
			
				self.app.services.callServices("financial_mantisReport","cekBA",[self.sg1.cells(0, row),self.sg1.cells(3, row)], function(data){
					console.log("isi view ba "+JSON.stringify(data));
					if (typeof data != 'undefined'){
						var i = 1;
						try{
							$.each(data, function(k, val){
								console.log(val);
								// console.log('self.getReport("getViewBA",[val.icm, val.ba_rekon, self.sg1.cells(3, row).substr(4,6), self.viewba'+i+'.frame.frame);');
							eval('self.getReport("getViewBA",[val.icm, val.ba_rekon, self.sg1.cells(3, row).substr(4,6)], self.viewba'+i+'.frame.frame);');
							i++;
							});
						}catch(e){
							alert(e);
						}

						
					}else{
						system.alert(self, "Data Tidak ditemukan","");
					}
					console.log("masuk ke halo");	
				});

				console.log("halo view ba");
			}

			//view summary ba
			if(col == 13){
				self.tab.setActivePage(self.tab.childPage[2]);
				// alert("halo");
				self.showLoading("Please wait...");
				self.app.services.callServices("financial_mantisSumBA", "getSummaryBA", [self.sg1.cells(1, row), self.sg1.cells(0, row), null, self.sg1.cells(3, row)], (data) => {
					self.summaryBA.clear();
					for(var key in data){
						let line = data[key];
						self.summaryBA.addRowValues([
							line.icm, line.year, line.month, line.cc, line.ba_cc, 
							line.tp, line.ba_tp, line.kode_jasa, line.jenis_jasa, line.orig_acct,
							line.desc_orig_acct, line.acct_coa, line.desc_acct_coa, line.currency, line.saldo_awal, 
							line.doc_amount, line.loc_amount, line.mutasi, line.saldo_akhir, line.jenis_rekon,
							line.elim_reguler,line.elim_bspl,line.balance,line.status
						]);
					}
					self.hideLoading();
				}, (err) => {
					self.hideLoading();
				});

			}

		});
		
		
		
		//summary ba
		this.summaryBA = new saiGrid(this.tab.childPage[2],{bound:[20,10,this.tab.width-40,this.tab.height-35],
			colCount: 24,
			colTitle: [
				"ICM","Year","Month","CC","BA CC",
				"TP","BA TP","Kode Jasa","Jenis Jasa","Orig Acct",
				"Desc of Orig Acct", "Acct COA", "Desc of Acct COA", "Curr", "Saldo Awal",
				"Doc Amount", "Loc Amount", "Mutasi", "Saldo Akhir", "Jenis Rekon",
				"Elim Reguler", "Elim BSPL", "Balance", "Status"
			],
			colWidth: [
					[
						0,1,2,3,4
						,5,6,7,8,9
						,10,11,12,13,14
						,15,16,17,18,19
						,20,21,22,23
					],
					[
						100,70,70,70,70
						,70,70,70,200,100
						,200,100,200,70,150
						,150,150,150,150,100
						,150,150,150,100
					]
				],
			columnReadOnly: [true,
				[
					0,1,2,3,4
					,5,6,7,8,9
					,10,11,12,13,14
					,15,16,17,18,19
					,20,21,22
				],[]],		
			colFormat: [[14,15,16,17,18,20,21,22],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
			autoPaging: true,
			pager: [this,"doPager1"]}
		);


		

	
		this.pJurnal = new control_popupForm(this.app);
		this.pJurnal.setBound(0,0,1240,500);
		this.pJurnal.setArrowMode(4);
		this.pJurnal.hide();
		this.judul = new label(this.tab.childPage[4], {bound:[10,5,300,20], caption:"<b>Jurnal<b>", fontSize:12});
		this.judul2 = new label(this.tab.childPage[4], {bound:[10,22,300,20], caption:"...", fontSize:10});
		this.bCJurnal = new button(this.pJurnal, {bound:[20 ,10,80,20], icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Close"});
		this.bCJurnal.setColor("#e84393");
		this.sgAddJurnal = new saiGrid(this.pJurnal,{bound:[20,40,1200,370],
			colCount: 9,
			colTitle: ["Post key","Cust/Vend/GL Acc","Deskripsi","BA","Keterangan","Doc. Amount","Loc. Amount","Cost Center","Profit Center"],
			colWidth:[[0,1,2,3,4,5,6,7,8],[70,80,230,100,230,100,100,90,90]],
			columnReadOnly:[true, [0,1,2,3,4,5,6,7,8],[]],		
			rowPerPage:20, 
			colFormat:[[5,6],[cfNilai,cfNilai]],
			autoPaging:true, 
			pager:[this,"doPager"]
		});
	

		this.bCJurnal.on("click", function(){
			self.pJurnal.hide();
			self.sgAddJurnal.clear(0);
			// self.nokon.setText("");
		});
		
	
		this.sg1.on("cellclick", function(sender, col, row, data, id){
			try{
				if (id != undefined){
					if ( col == 10){
					var node = $("#" + id);
						if (node != null){
							
							self.pJurnal.show();
							self.pJurnal.setTop(120);
							self.pJurnal.setLeft(50);	
							self.pJurnal.getCanvas().fadeIn("slow");

							self.app.services.callServices("financial_mantis","viewJurnalCOCD",[self.sg1.cells(0,row),"COCD",self.app._lokasi,self.sg1.cells(10,row)], function(data){
								if(data.jumlah == 0){
									system.alert(self, "data not found");
									self.pJurnal.hide();
								}else{
									$.each(data.draft, function(key, val){
										self.sgAddJurnal.addRowValues([val.post_key,val.custven,val.nama_akun,val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);	
									});		
								}
							});
						
						}
					}
					else if ( col == 11){
						var node = $("#" + id);
							if (node != null){
								
								self.pJurnal.show();
								self.pJurnal.setTop(120);
								self.pJurnal.setLeft(50);	
								self.pJurnal.getCanvas().fadeIn("slow");
								
								self.app.services.callServices("financial_mantis","viewJurnalCOCD",[self.sg1.cells(0,row),"TP",self.app._lokasi,self.sg1.cells(11,row)], function(data){
									if(data.jumlah == 0){
										system.alert(self, "data not found");
										self.pJurnal.hide();
									}else{
										$.each(data.draft, function(key, val){
											self.sgAddJurnal.addRowValues([val.post_key,val.custven,val.nama_akun,val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);		
										});		
									}
								});

							}
						}
					
					
				}
				
				
			}catch(e){
				alert(e);
			}
		});	

		
		this.bCariICM2.on("click",function(sender){
			self.pSearch.show();
			self.pSearch.setArrowMode(2);
			var node = sender.getCanvas();
			self.pSearch.setTop(node.offset().top + 20 );
			self.pSearch.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pSearch.getCanvas().fadeIn("slow");
		});

		this.pSearch = new control_popupForm(this.app);
		this.pSearch.setBound(0, 0,390, 250);
		this.pSearch.setArrowMode(4);
		this.pSearch.hide();
		var self = this;
	
		this.f01 = new saiLabelEdit(this.pSearch,{bound:[20,20,200,20],caption:"Periode",placeHolder:"YYYYMM"});
		this.sad = new label(this.pSearch, {bound:[225,20,40,20], caption:"s/d", bold: true, fontSize:9});		
		this.f02 = new saiLabelEdit(this.pSearch,{bound:[250,20,100,20],caption:"",labelWidth:0,placeHolder:"YYYYMM"});
		this.f03 = new saiLabelEdit(this.pSearch,{bound:[20,45,330,20],caption:"No ICM"});		
		this.f04 = new saiLabelEdit(this.pSearch,{bound:[20,70,330,20],caption:"Pekerjaan"});		
		this.f05 = new saiCB(this.pSearch,{bound:[20,95,330,20],caption:"Status", items:["Open","Clear","Unclear","Close"], });
	
	
		this.b0Ok = new button(this.pSearch, {bound:[180, 195,80,20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b0Ok.setColor("#4cd137");
		this.b0Cancel = new button(this.pSearch, {bound:[270, 195,80,20], icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.b0Cancel.setColor("#e84393");
		this.b0Cancel.on("click", function(){
			self.pSearch.hide();
		});

		try{			
			var self=this;

			var thn = self.app._periode;
			var tahun = thn.substr(0,4);
			self.tahun.setText(tahun);

			
			//cocd
			self.f5.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
					
			//tp
			self.f6.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			
			//kode jasa
			self.f3.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
			
			self.app._mainForm.bSimpan.setVisible(false);
			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);
			self.on("close",function(){
				self.app._mainForm.dashboard.refreshList();
				self.app._mainForm.bSimpan.setVisible(true);
				self.app._mainForm.bHapus.setVisible(true);
			self.app._mainForm.bClear.setVisible(true);
				// alert("tutup");
			});
			self.sg2.clear(1);
			// self.loadMonitoring({sts:"default"});
			// this.RefreshList();
			// this.nTagih.setServices(this.app.servicesBpc, "callServices",["financial_Fca","getNoTagihanSAP",["",""]],["no_tagihan","nama_proyek"],"kode_lokasi='"+self.app._lokasi+"'","Daftar Tagihan");
		
			

		}catch(e){
			systemAPI.alert(e);
		}
		
	}
};
window.app_saku_report_fBARek.extend(window.childForm);
window.app_saku_report_fBARek.implement({	
	RefreshList : function(page){
		try{
			this.currentPage = page;
			var self  = this;
			self.showLoading("Loading...");
			self.app.services.callServices("financial_mantis","getListInputICM",[self.app._lokasi], function(data){
				self.sg1.clear();
				$.each(data, function(key, val){
					
					if(val.idheader_clear == "-" || val.idheader_clear == ""){
						var status = "Open";
					}else if( val.idheader_clear != "-" && ( val.jml_loc_terima == val.jml_loc_kirim ) ){
						var status = "Clear";
					}else if( val.idheader_clear != "-" && ( val.jml_loc_terima != val.jml_loc_kirim ) ){
						var status = "Unclear";
					}else if( val.status = "4"){
						var status = "Close";
					}
					// if(val.status == "1"){
					// 	var status = "Send"
					// }else if(val.status == "2"){
					// 	var status = "Received"
					// }else if(val.status == "3"){
					// 	var status = "Recurring";
					// }else if(val.status == "4"){
					// 	var status = "Done";
					// }

					if(self.app._lokasi == val.cc){
						var icon_recurring = "<center><i class='fa fa-paper-plane-o' style='color:brown;margin-top:2px'> </i>";
					}else{
						var icon_recurring = "-";
					}
					self.sg1.addRowValues([ val.icm, val.cc, val.tp, val.year+val.month, val.kode_jasa, val.jenis_jasa, val.pekerjaan, val.currency, val.fcbp, status, val.idheader, val.idheader_clear, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>" ]);
				});
				self.hideLoading();
			});
		}catch(e){
			console.log(e);
		}
	},
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisUpload", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
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
		if(sender == this.b_exportXls){
			this.doExport();
		}else if(sender == this.bSearchPeriode){
			if(this.fPeriode.getText() != ''){
				this.genLaporan();
			}else{
				system.alert(self, "Inputan Bulan dan Tahun Tidak Boleh Kosong");
			}
		}
	},
	doExport: function(){
		var self = this;					
		if (self.f1.getText() == "" && self.f2.getText() == "" && self.f3.getText() == "" && self.f4.getText() == "" && self.f5.getText() == "" && self.f6.getText() == "" && self.f7.getText() == ""){
			system.alert(self, "Inputan Tidak Boleh Kosong");
		}else{
			var self = this;	
			self.app.services.callServices("financial_mantisReport","xlsBAREK",[self.f7.getText(),self.f1.getText(),self.f2.getText(),self.f3.getText(),self.f4.getText(),self.f5.getText(),self.f6.getText(),self.app._lokasi], function(data){
				window.open("./server/reportDownloader.php?f="+data+"&n="+"Lap_BA_Rekon.xlsx");
			});
			self.pSearch.hide();
		}
		// var self = this;
		// var data = [];
		
		// var items = {
		// 	kode_cc : self.fKodeCC.getText(),
		// 	nama_cc : self.fNamaCC.getText()
		// }
		// data.push(items);
		// var periode = '';
		// if(self.fPeriode.getText() != ''){
		// 	var periode = {
		// 		periode : self.fPeriode.getText(),
		// 	};
		// }
		// self.showLoading("Export to Xls...");
		// this.app.services.callServices("financial_Amor","xlsReportAccPerCCPel",[this.app._lokasi,periode,data], function(data){
		// 	self.hideLoading();
		// 	window.open("./server/reportDownloader.php?f="+data+"&n="+"Lap_BA_Rekon_.xlsx");
		// }, function(){
		// 	self.hideLoading();
		// });	
	},
	doChange: function(sender){
		try{			
			
			if (sender == this.bOk){				
				var self = this;					
				if (self.f1.getText() == "" && self.f2.getText() == "" && self.f3.getText() == "" && self.f4.getText() == "" && self.f5.getText() == "" && self.f6.getText() == "" && self.f7.getText() == ""){
						system.alert(self, "Inputan Tidak Boleh Kosong");
					}else{
						var self = this;	
						self.app.services.callServices("financial_mantisReport","cariBAREK",[self.f7.getText(),self.f1.getText(),self.f2.getText(),self.f3.getText(),self.f4.getText(),self.f5.getText(),self.f6.getText(),self.app._lokasi, self.cb_fcbp.getText()], function(data){
							self.sg1.clear(0);
								$.each(data, function(key, val){
									if(val.idheader_clear == "-" || val.idheader_clear == ""){
										var status = "Open";
									}else if( val.idheader_clear != "-" && ( val.jml_loc_terima == val.jml_loc_kirim ) ){
										var status = "Clear";
									}else if( val.idheader_clear != "-" && ( val.jml_loc_terima != val.jml_loc_kirim ) ){
										var status = "Unclear";
									}else if( val.status = "4"){
										var status = "Close";
									}

									// if(val.status == "1"){
									// 	var status = "Send"
									// }else if(val.status == "2"){
									// 	var status = "Received"
									// }else if(val.status == "3"){
									// 	var status = "Recurring";
									// }else if(val.status == "4"){
									// 	var status = "Done";
									// }
				
									if(self.app._lokasi == val.cc){
										var icon_recurring = "<center><i class='fa fa-paper-plane-o' style='color:brown;margin-top:2px'> </i>";
									}else{
										var icon_recurring = "-";
									}
									self.sg1.addRowValues([ val.icm, val.cc, val.tp, val.year+val.month, val.kode_jasa, val.jenis_jasa, val.pekerjaan, val.currency, val.fcbp, status, val.idheader, val.idheader_clear, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>" ]);
								
								});
						});
						self.pSearch.hide();
						self.f1.setText("");						
						self.f2.setText("");
						self.f3.setText("");						
						self.f4.setText("");
						self.f5.setText("");	
						self.f6.setText("");	
					
					}
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
