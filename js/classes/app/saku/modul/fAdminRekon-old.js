window.app_saku_modul_fAdminRekon = function(owner)
{
	if (owner)
	{
		window.app_saku_modul_fAdminRekon.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fAdminRekon";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Admin - Rekon", 0);

		uses("control_popupForm;column;pageControl;saiEdit;radioButton;datePicker;saiGrid;saiCBBL;childPage;panel;portalui_uploader;sgNavigator;column;frame;tinymceCtrl", true);			
		var self=this;
		
		this.tab = new pageControl(this,{bound:[20,10,this.width-40,this.height-30],
			childPage: ["Document List","View BA","View Summary BA"],
			borderColor:"#35aedb", headerAutoWidth:false});	

		this.tab2 = new pageControl(this.tab.childPage[1],{bound:[10,10,this.tab.width-20,this.tab.height-40],
			childPage: ["View BA 1","View BA 2","View BA 3","View BA 4"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});	
		
		this.bTambah = new button(this.tab.childPage[0],{bound:[10,10,80, 30],visible:false,icon:"<i class='fa fa-plus' style='color:white'></i>", caption:"Input"});
		this.bTambah.setColor("#474787");
		
		this.bRekon = new button(this.tab.childPage[0],{bound:[10,10,80, 30],icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Submit"});
		this.bRekon.setColor("#474787");

		
		this.bCariICM = new saiLabelEdit(this.tab.childPage[0], {bound:[this.width-320, 20, 200, 20],caption:"Search...", visible:false,placeHolder:true});
	
		this.bCariICM2 = new button(this.tab.childPage[0],{visible:false,bound:[this.width-200, 20, 100, 20],icon:"<i class='fa fa-filter' style='color:white'></i>", caption:"Filter"});
		this.bCariICM2.setColor("#6c5ce7");

		this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 200), 1, 820, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.f1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[160, 23, 20, 20], caption:"s/d", bold: true, fontSize:9});		
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.f3 = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Company",rightLabelVisible: false});	
		
		this.cek0 = new label(this.pnl1, {bound:[335, 48, 20, 20], caption:"as", bold: true, fontSize:9});	
		this.cek1 = new radioButton(this.pnl1,{bound:[360, 48, 40, 20], caption:"COCD"});
		this.cek2 = new radioButton(this.pnl1,{bound:[420, 48, 40, 20], caption:"TP"});

		this.f4 = new saiLabelEdit(this.pnl1,{bound:[10, 73, 310, 20],labelWidth:80,caption:"Pekerjaan"});		
		this.f5 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status", items:["Open","Clear","Unclear","Close"] });
	
		this.f6 = new saiLabelEdit(this.pnl1,{bound:[330, 73, 200, 20],labelWidth:80,caption:"No ICM"});		
		this.f7 = new saiCB(this.pnl1,{bound:[550, 73, 150, 20],labelWidth:40,caption:"FCBP",items:["FCBP 1","FCBP 2","FCBP 3","FCBP 4","FCBP 5","DWS","DES/DBS"]});	
		this.f7.setItemHeight("7");

		this.bOk = new button(this.pnl1, {bound:[710, 23, 90, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.bOk.setColor("#4cd137");
		this.bCancel = new button(this.pnl1, {bound:[270, 20,80,20], visible:false, icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.bCancel.setColor("#e84393");
		this.bCancel.on("click", function(){
			self.pSearch.hide();
		});

		
		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[1,120,this.width-70,this.height-160],
			colCount: 17,
			colTitle:[	
				{title:"IC DOC", width:90},
				{title:"COCD", width:50},
				{title:"TP",width:40},
				{title:"Periode",width:60},
				{title:"Kode Jasa", width:75},
				{title:"Nama Jasa",width:180},
				{title:"Pekerjaan",width:150},
				{title:"Curr",width:40},
				{title:"FCBP",width:60},
				{title:"Status",width:60},
				{title:"No Jurnal COCD",width:105},
				{title:"Nilai Jurnal COCD",width:105},
				{title:"No Jurnal TP",width:105},
				{title:"Nilai Jurnal TP",width:105},
				{title:"View BA",width:60},
				{title:"View Summary BA",width:115},
				{title:"Cek",width:40, format:cfBoolean},
			],

			// colTitle: ["IC DOC","COCD","TP","Periode","Kode Jasa","Nama Jasa","Pekerjaan","Curr","FCBP","Status","No Jurnal Kirim","No Jurnal Terima","View BA","Vew Summary BA","Check"],
			// colWidth:[[14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],[50,120,60,110,110,70,60,40,150,180,80,60,40,50,90]],
			// columnReadOnly:[true, [0,1,2,3,4,5],[]],		
			colFormat:[[11,13],[cfNilai,cfNilai]],		
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

		this.print1 = new labelCustom(this.tab2.childPage[0], {bound:[0,10,10,30], caption:" ", frame: dokViewer });
		this.print1.frame.show();
		
		this.bprint = new button(this.tab2.childPage[0], { bound: [600, 5, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
		this.bprint.setColor("#be2edd");
		this.bprint.on("click", function () {
		self.print1.frame.frame.get(0).contentWindow.print();;
		});

		this.print2 = new labelCustom(this.tab2.childPage[1], {bound:[0,10,10,30], caption:" ", frame: dokViewer2 });
		this.print2.frame.show();
		
		this.bprint = new button(this.tab2.childPage[1], { bound: [600, 5, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
		this.bprint.setColor("#be2edd");
		this.bprint.on("click", function () {
		self.print2.frame.frame.get(0).contentWindow.print();;
		});

		this.print3 = new labelCustom(this.tab2.childPage[2], {bound:[0,10,10,30], caption:" ", frame: dokViewer3 });
		this.print3.frame.show();
		
		this.bprint = new button(this.tab2.childPage[2], { bound: [600, 5, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
		this.bprint.setColor("#be2edd");
		this.bprint.on("click", function () {
		self.print3.frame.frame.get(0).contentWindow.print();;
		});

		this.print4 = new labelCustom(this.tab2.childPage[3], {bound:[0,10,10,30], caption:" ", frame: dokViewer4 });
		this.print4.frame.show();
		
		this.bprint = new button(this.tab2.childPage[3], { bound: [600, 5, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
		this.bprint.setColor("#be2edd");
		this.bprint.on("click", function () {
		self.print4.frame.frame.get(0).contentWindow.print();;
		});
	



		self.sg1.on("dblClick", function(col, row, id){
			//kalo terima
			if(col == 0 || col == 1 || col == 2 || col == 3 || col == 4 || col == 5 || col == 6 || col == 7 || col == 8 || col == 9 ){
				
				// self.app.services.callServices("financial_mantis","getTerima",[self.sg1.cells(0, row)], function(data){
				// 	console.log("isi compcode"+data.induk.cc);
				// 	// if( self.app._lokasi == data.induk.cc ){
				// 	// 	system.alert(self, "Anda Diluar Akses Untuk Menerima Dokumen!", "");
				// 	// }else{
				// 		// self.baru = "TRM";
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
				// 		// self.idheader_old = data.induk.idheader;
				// 	// }
				// });
			}

			//recurring
			// if(col == 15 ){
			// 	if(self.sg1.cells(15, row) == "-"){
			// 		system.alert(self, "Anda Diluar Akses Untuk Melakukan Recurring!", "");
			// 	}else{
			// 		self.baru = "REC";
			// 		self.idheader_old = "-";
			// 		self.bCreateICM.setVisible(false);
			// 		self.tab.setActivePage(self.tab.childPage[1]);
			// 		self.app.services.callServices("financial_mantis","getTerima",[self.sg1.cells(0, row)], function(data){
			// 			self.cocd.setText(data.induk.tp),
			// 			self.jasa.setText(data.induk.kode_jasa),
			// 			self.tahun.setText(data.induk.year),
			// 			self.curr.setText(data.induk.currency),
			// 			self.tp.setText(data.induk.cc),
			// 			self.fcbp.setText(data.induk.fcbp),
			// 			self.bulan.setText(data.induk.month),
			// 			self.icm.setText(data.induk.icm),
			// 			self.pekerjaan.setText(data.induk.pekerjaan)
			// 		});
			// 		this.tabTerima = new pageControl(this.tab.childPage[1],{bound:[20,10,this.width-90,this.height-50],
			// 			childPage: ["BA Rekon 1","BA Rekon 2"],
			// 			borderColor:"#35aedb", headerAutoWidth:false});
			// 	}
					
			// };

			//view ba
			if(col == 14){
				self.tab.setActivePage(self.tab.childPage[1]);
				// self.getReport("getViewBA",[self.sg1.cells(0, row),self.sg1.cells(1, row),self.sg1.cells(2, row),self.sg1.cells(9, row)], self.viewba1.frame.frame);
			
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

						// self.getReport("getViewBA",[val.icm, val.ba_rekon, self.sg1.cells(3, row).substr(4,6), self.viewba1.frame.frame);
						
					}else{
						system.alert(self, "Data Tidak ditemukan","");
					}
					console.log("masuk ke halo");	
				});

				// self.getReport("getViewBA1",[self.sg1.cells(0, row), self.sg1.cells(10, row)], self.viewba1.frame.frame);
				// self.getReport("getViewBA2",[self.sg1.cells(0, row), self.sg1.cells(10, row)], self.viewba2.frame.frame);
				
				console.log("halo view ba");
			}

			//view summary ba
			if(col == 15){
				self.tab.setActivePage(self.tab.childPage[2]);
				self.showLoading("Please wait...");
				self.app.services.callServices("financial_mantisSumBA", "getSummaryBA", [self.sg1.cells(1, row), self.sg1.cells(0, row), null, self.sg1.cells(3, row)], (data) => {
					self.summaryBA.clear();
					let sa_loc = 0;
					let sa_doc = 0;
					let mu_loc = 0;
					let mu_doc = 0;
					let sak_loc = 0;
					let sak_doc = 0;
					for(var key in data){
						let line = data[key];
						self.summaryBA.addRowValues([
							line.icm, line.year, line.month, line.cc, line.ba_cc, 
							line.tp, line.ba_tp, line.kode_jasa, line.jenis_jasa, line.orig_acct,
							line.desc_orig_acct, line.acct_coa, line.desc_acct_coa, line.currency, line.saldo_awal_doc, line.saldo_awal_loc,
							line.doc_amount, line.loc_amount, line.saldo_akhir_doc, line.saldo_akhir_loc, line.jenis_rekon,
							line.elim_reguler,line.elim_bspl,line.balance,line.status
						]);
						sa_loc += parseFloat(line.saldo_awal_loc);
						sa_doc += parseFloat(line.saldo_awal_doc);
						mu_loc += parseFloat(line.loc_amount);
						mu_doc += parseFloat(line.doc_amount);
						sak_loc += parseFloat(line.saldo_akhir_loc);
						sak_doc += parseFloat(line.saldo_akhir_doc);
					}
					self.sAwal1.setCaption(floatToNilai(parseFloat(sa_doc)));
					self.sAwal2.setCaption(floatToNilai(parseFloat(sa_loc)));
					self.mut1.setCaption(floatToNilai(parseFloat(mu_doc)));
					self.mut2.setCaption(floatToNilai(parseFloat(mu_loc)));
					self.sAkhir1.setCaption(floatToNilai(parseFloat(sak_doc)));
					self.sAkhir2.setCaption(floatToNilai(parseFloat(sak_loc)));
					self.hideLoading();
				}, (err) => {
					self.hideLoading();
				});
				
			}

		});
		
		
		this.cocd = new saiCBBL(this.tab.childPage[1],{bound:[20,20,200,20],visible:false,caption:"Comp. Code",readOnly:true});
		this.jasa = new saiCBBL(this.tab.childPage[1],{bound:[20,45,200,20],visible:false,caption:"Jasa", tag:1});	
		var thn = self.app._periode;
		var tahun = thn.substr(0,4);
		this.tahun = new saiCB(this.tab.childPage[1],{bound:[20,70,200,20],caption:"Tahun", visible:false,readOnly:true, items:[tahun], change:[this,"doChange"]});
		this.curr = new saiCB(this.tab.childPage[1],{bound:[20,95,200,20],caption:"Curr", visible:false,readOnly:true, items:["IDR","AUD","USD"], change:[this,"doChange"]});
		
		
		this.tp = new saiCBBL(this.tab.childPage[1],{bound:[520,20,200,20],caption:"TP",visible:false,readOnly:true,change:[this,"doChange"],tag:1});
		this.fcbp = new saiCB(this.tab.childPage[1],{bound:[520,45,200,20],caption:"FCBP", visible:false,readOnly:true, visible:false, items:["FCBP 1","FCBP 2","FCBP 3","FCBP 4","FCBP 5","DWS","DES/DBS"], change:[this,"doChange"]});
		this.fcbp.setItemHeight(7);
		this.bulan = new saiCB(this.tab.childPage[1],{bound:[520,70,200,20],caption:"Bulan", visible:false,readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
		this.bulan.setItemHeight(12);

		this.icm = new saiLabelEdit(this.tab.childPage[1],{bound:[520,95,200,20],caption:"ICM", visible:false, readOnly:true});
		this.bCreateICM = new button(this.tab.childPage[1],{bound:[730,95,130,20],icon:"<i class='fa fa-spinner' style='color:white'></i>", visible:false, caption:"Create No. ICM"});
		this.bCreateICM.setColor("#6c5ce7");
		this.bCreateICM.on("click",function(sender){
			if(self.jasa.getText() == "" && self.tahun.getText() == "" && self.bulan.getText() == ""){
				system.alert(self, "Harap isi Tahun, Jasa dan Bulan Terlebih Dahulu!", "");
			}else if(self.tahun.getText() == ""){
				system.alert(self, "Harap isi Tahun Terlebih Dahulu!", "");
			}
			else if(self.jasa.getText() == "" ){
				system.alert(self, "Harap isi Jasa Terlebih Dahulu!", "");
			}
			else if(self.bulan.getText() == ""){
				system.alert(self, "Harap isi Bulan Terlebih Dahulu!", "");
			}
			else{
				self.app.services.callServices("financial_mantis","createNoICM",[self.tahun.getText(),self.bulan.getText(),self.jasa.getText()], function(data){
					self.icm.setText(data);
				});
			}
		
		});
		
		this.pekerjaan = new saiLabelEdit(this.tab.childPage[1],{bound:[20,120,700,20],visible:false,caption:"Pekerjaan"});
		
		
		// this.bTambah.on("click",function(sender){
		// 	self.tab.setActivePage(self.tab.childPage[1]);
		// 	self.baru = "NEW";
		// 	self.bCreateICM.setVisible(true);
		// 	self.cocd.setText(self.app._lokasi);
		// 	self.idheader_old = "-";

		// 	self.jasa.setText("");
		// 	self.curr.setText("");
		// 	self.pekerjaan.setText("");
		// 	self.tp.setText("");
		// 	self.fcbp.setText("");
		// 	self.fcbp.setVisible(false);
		// 	self.bulan.setText("");
		// 	self.icm.setText("");
		// });

		var self=this;
		this.tp.on("change", function(){
			if(self.tp.getText() == "1000"){
				self.fcbp.setVisible(true);
			}else{
				self.fcbp.setVisible(false);
			}
		});
		
		

		this.sg2 = new saiGrid(this.tab.childPage[1],{visible:false,bound:[20,145,this.width-200,this.height-250],
			colCount: 9,
			colTitle: ["Post Key","GL Acc","Nama Akun","BA","Keterangan","Doc Amount","Loc Amount","Cost Center","Profit Center"],
			colWidth:[[0,1,2,3,4,5,6,7,8],[70,80,230,100,230,100,100,90,90]],
			columnReadOnly:[true, [],[0,1,2,3,4,5,6,7,8]],		
			buttonStyle:[[0,1,3,7,8],[bsAuto,bsEllips,bsEllips,bsEllips,bsEllips]], 
			colFormat:[[5,6],[cfNilai,cfNilai]],		
			picklist:[[0],[new arrayMap({items:["40 - Debet","50 - Credit"]})
							   ]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager1"]
		});

		this.sg2.on("entrySearch", function(col, row, value, fn){
			if (value.length > 2) {
				if (self.myTimeExecSearch){
					clearTimeout(self.myTimeExecSearch);
				}
				self.myTimeExecSearch = setTimeout( function(){
					if (col == 1) {
						self.app.services.callServices("financial_mantis","getListGL",[value, self.cocd.getText()], function(data){
							fn(data);
						});
					}
					else if (col == 3) {
						self.app.services.callServices("financial_mantis","getListBA",[value, self.cocd.getText(), self.tp.getText()], function(data){
							fn(data);
						});
					}
					else if (col == 7) {
						self.app.services.callServices("financial_mantis","getListCC",[value, self.sg2.cells(3, row)], function(data){
							fn(data);
						});
					}
					else if (col == 8) {
						self.app.services.callServices("financial_mantis","getListProfitCenter",[value, self.sg2.cells(3, row)], function(data){
							fn(data);
						});
					}
				}, 500);
			}
		});

		this.sg2.on("change", function(col, row, data){
			if ( col == 1 ){
				console.log("masuk 1");
				var isValidGL = new Promise((resolve, reject)=>{
					var gl = self.sg2.cells(1, row);
					console.log("process validasi", gl);
					self.app.services.callServices("financial_mantis","isValidGL",[self.app._lokasi, gl], function(data){
						resolve(data);
					});
				});
				
				isValidGL.then((validGL)=>{
					console.log(validGL);
					if(self.sg2.cells(1,row) != ""){
						if(validGL){
							
						}else{
							self.sg2.setCell(1, row, "");
							system.alert(self, "Cust/Vend/GL Acc Tidak DItemukan!", "");
						}
					}
				});
			}

		
			if ( col == 3 ){
				console.log("masuk 3");
				var isValidBA = new Promise((resolve, reject)=>{
					var ba = self.sg2.cells(3, row);
					console.log("process validasi", ba);
					self.app.services.callServices("financial_mantis","isValidBA",[self.app._lokasi, ba], function(data){
						resolve(data);
					});
				});
				
				isValidBA.then((validBA)=>{
					console.log(validBA);
					if(self.sg2.cells(3,row) != ""){
						if(validBA){
							
						}else{
							self.sg2.setCell(3, row, "");
							system.alert(self, "Business Area Tidak Ditemukan!", "");
						}
					}
				});
			}

			if ( col == 7 ){
				console.log("masuk 7");
				var isValidCC = new Promise((resolve, reject)=>{
					var cc = self.sg2.cells(7, row);
					console.log("process validasi", cc);
					self.app.services.callServices("financial_mantis","isValidCC",[self.app._lokasi, cc], function(data){
						resolve(data);
					});
				});
				
				isValidCC.then((validCC)=>{
					console.log(validCC);
					if(self.sg2.cells(7,row) != ""){
						if(validCC){
							
						}else{
							self.sg2.setCell(7, row, "");
							system.alert(self, "Cost Center Tidak DItemukan!", "");
						}
					}
				});
			}

			if ( col == 8 ){
				console.log("masuk 8");
				var isValidPC = new Promise((resolve, reject)=>{
					var pc = self.sg2.cells(8, row);
					console.log("process validasi", pc);
					self.app.services.callServices("financial_mantis","isValidProfit",[self.app._lokasi, pc], function(data){
						resolve(data);
					});
				});
				
				isValidPC.then((validPC)=>{
					console.log(validPC);
					if(self.sg2.cells(8,row) != ""){
						if(validPC){
							
						}else{
							self.sg2.setCell(8, row, "");
							system.alert(self, "Profit Center Tidak Ditemukan!", "");
						}
					}
				});
			}
			
		
		});

		

	

		this.sg2.on("selectRow", function(col, row, value, data){
			if (col == 1){
				self.sg2.setCell(col, row, value);
				self.sg2.setCell(col + 1, row, data[1]);
			}else if (col == 3){
				self.sg2.setCell(col, row, value);
				// self.sg2.setCell(col + 1, row, data[1]);
			}else if (col == 7){
				self.sg2.setCell(col, row, value);
				// self.sg2.setCell(col + 1, row, data[1]);
			}else if (col == 8){
				self.sg2.setCell(col, row, value);
				// self.sg2.setCell(col + 1, row, data[1]);
			}

		});

		this.bSave = new button(this.tab.childPage[1],{bound:[20,this.tab.childPage[1].height-40,80, 30],visible:false,icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Save"});
		this.bSave.setColor("#27ae60");

		this.bRekon.on("click",function(sender){
			try{


				var data1 = [];
				for (var i = 0; i < self.sg1.getRowCount();i++){				
					if (self.sg1.cells(16,i) == "TRUE"){
						var item8 = {
							icm : self.sg1.cells(0,i),
							no_jurnal_kirim : self.sg1.cells(10,i),
							no_jurnal_terima : self.sg1.cells(12,i)
						};
						data1.push(item8);	
					}			
				}

				// var dataDetail = [];
				// var validasiPenerima = false;
				// for (var i = 0; i < self.sg2.getRowCount();i++){				
				// 	if(self.sg2.cells(0,i) != "" || self.sg2.cells(1,i) != "" || self.sg2.cells(2,i) != ""  || self.sg2.cells(5,i) != ""  || self.sg2.cells(6,i) != "" ){
				// 		var item1 = {
				// 			post_key : self.sg2.cells(0,i), 
				// 			gl_acc : self.sg2.cells(1,i),
				// 			keterangan : self.sg2.cells(4,i),
				// 			ba : self.sg2.cells(3,i),
				// 			docAm : self.sg2.cells(5,i),
				// 			locAm : self.sg2.cells(6,i),
				// 			cc : self.sg2.cells(7,i),
				// 			profit : self.sg2.cells(8,i),
				// 		};
				// 		dataDetail.push(item1);
				// 		validasiPenerima = true;
				// 	}else{
				// 		validasiPenerima = false;
				// 	}
				// }

				self.app.services.callServices("financial_mantis","updateAdminRekon", [data1] ,function(data){
					if (data == "process completed") {
						system.info(self, data,"");
						self.app._mainForm.bClear.click();
						self.RefreshList();
					}else {
						system.alert(self, data,"");
					}
				});
				

			
			}catch(e){
				alert(e);
			}
		});
		

		//summary ba
		this.pnl0 = new panel(this.tab.childPage[3], {bound:[ 10, 5, 500, 100],caption:"Summary",border:1});
		this.pnl0.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
	
		this.judul1 = new label(this.pnl0,{bound:[170, 20, 140, 20],caption:"Total Doc Amount"});
		this.judul1 = new label(this.pnl0,{bound:[350, 20, 140, 20],caption:"Total Loc Amount"});
		
		this.sAwal = new label(this.pnl0,{bound:[10, 40, 140, 20],caption:"Saldo Awal :"});
		this.sAwal1 = new label(this.pnl0,{bound:[150, 40, 140, 20],alignment:"right",caption:"-"});
		this.sAwal2 = new label(this.pnl0,{bound:[310, 40, 140, 20],alignment:"right",caption:"-"});
	
		this.mut = new label(this.pnl0,{bound:[10, 60, 140, 20],caption:"Mutasi :"});
		this.mut1 = new label(this.pnl0,{bound:[150, 60, 140, 20],alignment:"right",caption:"-"});
		this.mut2 = new label(this.pnl0,{bound:[310, 60, 140, 20],alignment:"right",caption:"-"});

		this.sAkhir = new label(this.pnl0,{bound:[10, 80, 140, 20],caption:"Saldo Akhir :"});
		this.sAkhir1 = new label(this.pnl0,{bound:[150, 80, 140, 20],alignment:"right",caption:"-"});
		this.sAkhir2 = new label(this.pnl0,{bound:[310, 80, 140, 20],alignment:"right",caption:"-"});
		
		this.summaryBA = new saiGrid(this.tab.childPage[2],{bound:[10,120,this.tab.width-25,this.tab.height-125],
			colCount: 22, headerHeight: 65,
			colTitle: [
				{
					title : "ICM",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Year",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Month",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "CC",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "BA CC",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "TP",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "BA TP",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Kode Jasa",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Jenis Jasa",
					width : 200,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Orig Acct",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Desc Of Orig Acct",
					width : 200,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Acct COA",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Desc of Acct COA",
					width : 200,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Curr",
					width : 70,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Saldo Awal",
					width : 300,
					hint  : "",
					column : [
						{
							title : "Doc Amount",
							width : 150,
							format : cfNilai,
							columnAlign: "bottom", 
							hint  : "Saldo Awal Doc Amount", 
							column : [{
								title :"1",
								width : 150,
								format : cfNilai
							}]
						},
						{
							title : "Loc Amount",
							width : 150,
							format : cfNilai,
							columnAlign: "bottom", 
							hint  : "Saldo Awal Loc Amount", 
							column : [{
								title : "2",
								width : 150,
								format : cfNilai
							}]
						}
					]
				},
				{
					title : "Mutasi",
					width : 300,
					hint  : "",
					column : [
						{
							title : "Doc Amount",
							width : 150,
							format : cfNilai,
							columnAlign: "bottom", 
							hint  : "Mutasi Doc Amount", 
							column : [{
								title :"3",
								width : 150,
								format : cfNilai
							}]
						},
						{
							title : "Loc Amount",
							width : 150,
							format : cfNilai,
							columnAlign: "bottom", 
							hint  : "Mutasi Loc Amount", 
							column : [{
								title : "4",
								width : 150,
								format : cfNilai
							}]
						}
					]
				},
				{
					title : "Saldo Akhir",
					width : 300,
					hint  : "",
					column : [
						{
							title : "Doc Amount",
							width : 150,
							format : cfNilai,
							columnAlign: "bottom", 
							hint  : "Saldo Akhir Doc Amount", 
							column : [{
								title :"5 = 1 + 3",
								width : 150,
								format : cfNilai
							}]
						},
						{
							title : "Loc Amount",
							width : 150,
							format : cfNilai,
							columnAlign: "bottom", 
							hint  : "Saldo Akhir Loc Amount", 
							column : [{
								title : "6 = 2 + 4",
								width : 150,
								format : cfNilai
							}]
						}
					]
				},
				{
					title : "Jenis Rekon",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Elim Reguler",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Elim BSPL",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Balance",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "status",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
			],
			colFormat:[[14, 15, 16, 17, 18, 19],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
			autoPaging: true, rowPerPage: 50, readOnly:true
		});


	
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
		this.drJurnal = new saiLabelEdit(this.pJurnal,{bound:[940,420,240,20],caption:"Total Debit",readOnly:true,tipeText:ttNilai});
		this.crJurnal = new saiLabelEdit(this.pJurnal,{bound:[940,450,240,20],caption:"Total Kredit",readOnly:true,tipeText:ttNilai});
	

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
									var totdr = 0;
									var totcr = 0;
									$.each(data.draft, function(key, val){
										if(val.post_key == "40"){
											totdr += nilaiToFloat(val.loc_amount);
											var isi_post_key = "40 - Debet";
										}
										if(val.post_key == "50"){
											totcr += nilaiToFloat(val.loc_amount);
											var isi_post_key = "50 - Credit";
										}
										self.sgAddJurnal.addRowValues([isi_post_key,val.custven,val.nama_akun,val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);	
										self.drJurnal.setText(floatToNilai(nilaiToFloat(totdr)));
										self.crJurnal.setText(floatToNilai(nilaiToFloat(totcr)));
									});		
								}
							});
						
						}
					}
					else if ( col == 12){
						var node = $("#" + id);
							if (node != null){
								
								self.pJurnal.show();
								self.pJurnal.setTop(120);
								self.pJurnal.setLeft(50);	
								self.pJurnal.getCanvas().fadeIn("slow");
								
								self.app.services.callServices("financial_mantis","viewJurnalCOCD",[self.sg1.cells(0,row),"TP",self.app._lokasi,self.sg1.cells(12,row)], function(data){
									if(data.jumlah == 0){
										system.alert(self, "data not found");
										self.pJurnal.hide();
									}else{
										var totdr = 0;
										var totcr = 0;
										$.each(data.draft, function(key, val){
											if(val.post_key == "40"){
												totdr += nilaiToFloat(val.loc_amount);
												var isi_post_key = "40 - Debet";
											}
											if(val.post_key == "50"){
												totcr += nilaiToFloat(val.loc_amount);
												var isi_post_key = "50 - Credit";
											}
											self.sgAddJurnal.addRowValues([isi_post_key,val.custven,val.nama_akun,val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);		
											self.drJurnal.setText(floatToNilai(nilaiToFloat(totdr)));
											self.crJurnal.setText(floatToNilai(nilaiToFloat(totcr)));
										});		
									}
								});

							}
					}
					else if(col == 16){

						if(self.sg1.cells(16, row) == "TRUE"){
							if(typeof self.dataCek == "undefined"){
								self.dataCek = [];
							}
							var itemCek = {
								icm : self.sg1.cells(0,i),
								no_jurnal_kirim : self.sg1.cells(10,i),
								no_jurnal_terima : self.sg1.cells(12,i)
							};
							self.dataCek.push(itemCek);			

							console.log("data cek"+JSON.stringify(self.dataCek));
						}
						else{
							$.each(self.dataCek, function(key, val){
								console.log("isi keyyyyyyyyy"+JSON.stringify(key));
								console.log("if satu"+JSON.stringify(val.idheader));
								console.log("if kedua"+JSON.stringify(self.sg1.cells(10,row)));
								if(val.idheader == self.sg1.cells(10,row) ){
									self.isi_index = key;
									console.log("masuk ifffff");
								}													
							});

							console.log("isi indexxxx"+JSON.stringify(self.isi_index));
							self.dataCek.splice(self.isi_index,1); 			
							console.log("data cek"+JSON.stringify(self.dataCek));
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
		this.s0d = new label(this.pSearch, {bound:[225,20,40,20], caption:"s/d", bold: true, fontSize:9});		
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

			
			self.f3.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
		

			self.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
					
			self.tp.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			
			self.jasa.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
			
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
window.app_saku_modul_fAdminRekon.extend(window.childForm);
window.app_saku_modul_fAdminRekon.implement({	
	RefreshList : function(page){
		try{
			this.currentPage = page;
			var self  = this;
			console.log("haloooo");
			self.showLoading("Loading...");
			self.app.services.callServices("financial_mantis","getListAdminRekon",[self.app._lokasi], function(data){
				console.log("haloooom2");
				self.sg1.clear();
				$.each(data, function(key, val){
					
					if(val.idheader_clear == "-" || val.idheader_clear == ""){
						var status = "Open";
						var cek = "FALSE";
					}else if( val.idheader_clear != "-" && ( val.jml_loc_terima == val.jml_loc_kirim ) ){
						var status = "Clear";
						var cek = "FALSE";
					}else if( val.idheader_clear != "-" && ( val.jml_loc_terima != val.jml_loc_kirim ) ){
						var status = "Unclear";
						var cek = "FALSE";
					}else if( val.status = "4"){
						var status = "Close";
						var cek = "";
					}
				
					self.sg1.addRowValues([ val.icm, val.cc, val.tp, val.year+val.month, val.kode_jasa, val.jenis_jasa, val.pekerjaan, val.currency, val.fcbp, status, val.idheader, val.jml_loc_kirim, val.idheader_clear, val.jml_loc_terima, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>", cek]);
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
	doChange: function(sender){
		try{			
			
			if (sender == this.bOk){				
				var self = this;					
				if (self.f1.getText() == "" && self.f2.getText() == "" && self.f3.getText() == "" && self.f4.getText() == "" && self.f5.getText() == "" && self.f6.getText() == "" && self.f7.getText() == "" ){
						system.alert(self, "Inputan Tidak Boleh Kosong");
					}else{
						var self = this;	
						self.app.services.callServices("financial_mantis","cariAdminRekon",[self.f1.getText(),self.f2.getText(),self.f3.getText(),self.f4.getText(),self.f5.getText(),self.app._lokasi,self.f6.getText(),self.f7.getText(),self.cek1.selected,self.cek2.selected], function(data){
							self.sg1.clear(0);
								$.each(data, function(key, val){
									var cek = "FALSE";
									if(typeof self.dataCek != "undefined"){
										for(i=0;i<self.dataCek.length;i++){
											if(val.idheader == self.dataCek[i].idheader ){
												var cek = "TRUE";
												break;
											}	
										}
									}


									if(val.idheader_clear == "-" || val.idheader_clear == ""){
										var status = "Open";
									}else if( val.idheader_clear != "-" && ( val.jml_loc_terima == val.jml_loc_kirim ) ){
										
										if( val.status == "4"){
											var status = "Close";
											var cek = "";
										}else{
											var status = "Clear";
										}

									}else if( val.idheader_clear != "-" && ( val.jml_loc_terima != val.jml_loc_kirim ) ){
										var status = "Unclear";
									}else if( val.status == "4"){
										var status = "Close";
										var cek = "";
									}

									
									self.sg1.addRowValues([ val.icm, val.cc, val.tp, val.year+val.month, val.kode_jasa, val.jenis_jasa, val.pekerjaan, val.currency, val.fcbp, status, val.idheader, val.jml_loc_kirim, val.idheader_clear, val.jml_loc_terima, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>", cek ]);
				
								});
						});
						self.pSearch.hide();
						self.f1.setText("");						
						self.f2.setText("");
						self.f3.setText("");						
						self.f4.setText("");
						self.f5.setText("");	
						self.f6.setText("");
						self.f7.setText("");	
						self.cek1.setSelected(false);
						self.cek2.setSelected(false);
					
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
