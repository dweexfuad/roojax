window.app_saku_report_fBARek = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_report_fBARek.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_report_fBARek";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Laporan BA Rekon", 99);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
		this.tab = new pageControl(this,{bound:[2,10,this.width-10, this.height - 35],
			childPage: ["List BA","Report BA","Report BA Detail"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});
		
		

		this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 30), 5, 655, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.f1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode (YTD)",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[160, 23, 20, 20], caption:"s/d", bold: true, fontSize:9, visible:false});    
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM", visible:false});
		this.co_icm = new saiLabelEdit(this.pnl1,{bound:[180, 23, 200, 20],labelWidth:80,caption:"ICM"});    
		this.co_jasa = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa"});    
		this.f4 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status", items:["DONE","OPEN","CLEAR","UNCLEAR","CLOSE","PIC","GA","RETURN","DELETE"] });
		this.co_cocd = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD"});
		this.co_tp = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP"});  
		
		
		this.bOk = new button(this.pnl1, {bound:[400, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[400, 50, 80, 20], caption:"Export XLS", click:[this,"doChange"]});
		
		this.bOk.setColor("#4cd137");
		this.bOk.on("click", () => {
			let cocd = this.co_cocd.getText();
			let icm = this.co_icm.getText();
			let akun = null;
			let perio = {
				perio_awal: this.f1.getText(),
				perio_akhir: this.f2.getText()
			};
			let tp = this.co_tp.getText();
			let status = this.f4.getText();
			let jasa = this.co_jasa.getText();
			this.setTmpFilter(cocd, icm, akun, perio, tp, status, jasa);
			this.getSummaryBA(cocd, icm, akun, perio, tp, status, jasa);
		});

		this.b_exportXls.on("click", () => {
			let cocd = this.co_cocd.getText();
			let icm = this.co_icm.getText();
			let akun = null;
			let perio = {
				perio_awal: this.f1.getText(),
				perio_akhir: this.f2.getText()
			};
			let tp = this.co_tp.getText();
			let status = this.f4.getText();
			let jasa = this.co_jasa.getText();
			this.setTmpFilter(cocd, icm, akun, perio, tp, status, jasa);
			this.exportEliminasi(this.tmpFilter);
		});
		
		this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[10,120,this.tab.width-25,this.tab.height-125],
			colCount: 17, headerHeight: 65,
			colTitle: [
				{
					title : "ICM",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
					freeze: true
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
					title : "TP",
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
					title : "FCBP",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "No BA REKON",
					width : 100,
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
					title : "Last Update",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "View BA Rekon",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Status BA",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				}
			],
			colFormat:[[10, 11, 12, 13, 14, 15],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
			autoPaging: true, rowPerPage: 50, readOnly:true
		});
		var self = this;
		this.summaryBA.on("dblClick", (col, row) =>{
			if(col == 18){
				self.tab.setActivePage(self.tab.childPage[1]);
				self.getReport("getViewBA",[self.summaryBA.cells(0, row), self.summaryBA.cells(8, row)], self.viewba1.frame.frame);
				self.getReport_2("getViewBA",[self.summaryBA.cells(0, row), self.summaryBA.cells(8, row)], self.viewbadet.frame.frame);
			}
			// if(col == 19){
			// 	self.tab.setActivePage(self.tab.childPage[2]);
			// 	self.getReport_2("getViewBA",[self.summaryBA.cells(0, row), self.summaryBA.cells(8, row)], self.viewbadet.frame.frame);
								
			// }
		});
		//View BA
		var dokViewer = new control(this.tab.childPage[1], {bound:[0,10, this.width-2, this.tab.height-25 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		dokViewer.getCanvas().append(frame);
		dokViewer.frame = frame;
		this.viewba1 = new labelCustom(this.tab.childPage[1], {bound:[0,10,10,30], caption:" ", frame: dokViewer });
			this.viewba1.frame.show();
		
		
		this.print1 = new labelCustom(this.tab.childPage[1], {bound:[0,10,10,30], caption:" ", frame: dokViewer });
		this.print1.frame.show();
		
		this.bprint = new button(this.tab.childPage[1], { bound: [this.tab.width - 105, 5, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
		this.bprint.on("click", function () {
		self.print1.frame.frame.get(0).contentWindow.print();;
		});


		//View BA DETAIL
		var dokViewer = new control(this.tab.childPage[2], {bound:[0,10, this.width-2, this.tab.height-25 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		dokViewer.getCanvas().append(frame);
		dokViewer.frame = frame;
		this.viewbadet = new labelCustom(this.tab.childPage[2], {bound:[0,10,10,30], caption:" ", frame: dokViewer });
			this.viewbadet.frame.show();
		
		
		this.print1det = new labelCustom(this.tab.childPage[2], {bound:[0,10,10,30], caption:" ", frame: dokViewer });
		this.print1det.frame.show();
		
		this.bprintdet = new button(this.tab.childPage[2], { bound: [this.tab.width - 105, 5, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
		this.bprintdet.on("click", function () {
		self.print1det.frame.frame.get(0).contentWindow.print();;
		});

		
		//----- 
		this.setTabChildIndex();
		try {
			this.co_cocd.setText(this.app._lokasi);
			// this.co_cocd.setServices(this.app.servicesBpc, "callServices", ["financial_RRA", "getListCocd", []], ["cocd", "company_name"], "", "Data Company Code");
			// this.co_jasa.setServices(this.app.servicesBpc, "callServices", ["financial_RRA", "getListIcm", []], ["icm", "pekerjaan"], "", "Data ICM");
			// this.co_tp.setServices(this.app.servicesBpc, "callServices", ["financial_RRA", "getListCocd", []], ["cocd", "company_name"], "", "Data Company Code");

			this.co_cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar CC");		
			this.co_tp.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar TP");
			this.co_jasa.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_report_fBARek.extend(window.childForm);
window.app_saku_report_fBARek.implement({
	getReport: function( report, param, iframe){
		var self = this;
		if (this.f1.getText().substr(4,2) == "03" || this.f1.getText().substr(4,2) == "06" || this.f1.getText().substr(4,2) == "09" || this.f1.getText().substr(4,2) == "12"){
			var data = JSON.stringify({service:"mantisRepTW", method: report, params: param } );
		}else {
			var data = JSON.stringify({service:"mantisUpload", method: report, params: param } );
		}
		
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	getReport_2: function( report, param, iframe){
		var self = this;
		if (this.f1.getText().substr(4,2) == "03" || this.f1.getText().substr(4,2) == "06" || this.f1.getText().substr(4,2) == "09" || this.f1.getText().substr(4,2) == "12"){
			var data = JSON.stringify({service:"mantisDetBA", method: report, params: param } );
		}
		else {
			var data = JSON.stringify({service:"mantisUpload", method: report, params: param } );
		}
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doAfterResize: function(w, h){
		if (this.tab) {
			this.tab.setWidth( w - 40);
			this.bprint.setLeft(this.tab.width - 105);
		}
		
	},
	doTabChange: function(){

	},
	setTmpFilter: function(cocd, icm, akun, perio, tp, status, jasa){
		this.tmpFilter = {
			cocd : cocd,
			icm : icm, 
			akun : akun,
			perio : perio,
			tp : tp,
			status : status,
			jasa : jasa
		};
	},

	exportEliminasi: function(filter){
		this.showLoading("Please wait...");
		console.log("masuk sini...");
		this.app.services.callServices("financial_mantisUpload", "downloadBARekon", [this.tmpFilter], (filename) => {
			this.hideLoading();
			window.open("./server/reportDownloader.php?f="+filename+"&n=Eliminasi.xlsx");
		}, (err) => {
			this.hideLoading();
		});
	},
	getSummaryBA: function(lokasi = null, icm = null, akun = null, perio = null, tp = null, status = null, jasa = null){
		console.log("call getSummaryBA");
		this.showLoading("Please wait...");
		this.app.services.callServices("financial_mantisUpload", "reportBARekon", [this.tmpFilter], (data) => {
			this.summaryBA.clear();
			var sa_loc = 0;
			var sa_doc = 0;
			var mu_loc = 0;
			var mu_doc = 0;
			var sak_loc = 0;
			var sak_doc = 0;
			for(var key in data){
				let line = data[key];
				
				this.summaryBA.addRowValues([
					line.icm, line.year, line.month, line.cc,  
					line.tp, line.kode_jasa, line.jenis_jasa, line.fcbp, line.ba_rekon,
					line.currency,
					Math.round(line.doc_sawal,0),  Math.round(line.loc_sawal,0),
					Math.round(line.doc_amount,0), Math.round(line.loc_amount,0), 
					Math.round(line.doc_sakhir,0), Math.round(line.loc_sakhir,0), line.jenis_rekon,
					line.last_update, "<center><button style='background:#1976D2;cursor:pointer;border:none;width:100%;height:100%;color:white'><i class='fa fa-eye' style='color:white'/> View BA</button>"
					, line.status
				]);
				sa_loc += parseFloat(line.loc_sawal);
				sa_doc += parseFloat(line.doc_sawal);
				mu_loc += parseFloat(line.loc_amount);
				mu_doc += parseFloat(line.doc_amount);
				sak_loc += parseFloat(line.loc_sakhir);
				sak_doc += parseFloat(line.doc_sakhir);
			}
			
			this.hideLoading();
		}, (err) => {
			this.hideLoading();
		});
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
	keyDown: function(sender, keyCode, buttonState){
		if (keyCode == 13){
			this.bSearchPeriode.click();
		}
	},
	doClick: function(sender){
		if(sender == this.bExport){
			this.doExport();
		}else if(sender == this.bSearchPeriode){
			if(this.fPeriode.getText() != ''){
				this.genLaporan();
			}else{
				system.alert(self, "Inputan Bulan dan Tahun Tidak Boleh Kosong");
			}
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
