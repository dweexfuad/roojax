window.app_saku_modul_fAdminRekon = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fAdminRekon.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fAdminRekon";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Review ICM by GA", 0);

		uses("column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;sgNavigator;column;util_standar;frame;;listCustomView;reportViewer");			
		
		this.tab = new pageControl(this,{bound:[20,10,this.width-40, this.height - 35],
			childPage: ["List BA","Report BA"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});
		
		

		this.pnl1 = new panel(this.tab.childPage[0], {bound:[ 20, 5, 500, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.f1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode (YTD)",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[160, 23, 20, 20], caption:"s/d", bold: true, fontSize:9, visible:false});    
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM", visible:false});
		this.co_icm = new saiLabelEdit(this.pnl1,{bound:[180, 23, 200, 20],labelWidth:80,caption:"ICM"});    
		this.co_jasa = new saiCBBL(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Kode Jasa"});    
		this.f4 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status Elim", items:["BSPL","NON BSPL"], visible: false });
		this.co_cocd = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD", visible:false});
		this.co_tp = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"TP", rightLabelVisible:false});
		this.co_fcbp = new saiCB(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"FCBP",items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});  
		this.co_fcbp.setItemHeight(7);
		
		this.bOk = new button(this.pnl1, {bound:[400, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[400, 50, 80, 20], caption:"Export XLS", click:[this,"doChange"]});
		
		this.bOk.setColor("#4cd137");
		this.bOk.on("click", () => {
			let cocd = this.app._lokasi
			let icm = this.co_icm.getText();
			let akun = null;
			let perio = {
				perio_awal: this.f1.getText(),
				perio_akhir: this.f2.getText()
			};
			let tp = this.co_tp.getText();
			let status = "GA";//this.f4.getText();
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
			let status = "GA";//this.f4.getText();
			let jasa = this.co_jasa.getText();
			this.setTmpFilter(cocd, icm, akun, perio, tp, status, jasa);
			this.exportEliminasi(this.tmpFilter);
		});
		
		this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[10,120,this.tab.width-25,this.tab.height-125],
			colCount: 12, headerHeight: 65,
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
					title : "Jenis Rekon",
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
					title : "<i class='fa fa-check'/><br>Cek List",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				}
				
			],
			colFormat:[[12],[cfBoolean]],
			autoPaging: true, rowPerPage: 50, readOnly:true
		});
		var self = this;
		this.summaryBA.on("dblClick", (col, row) =>{
			if(col == 11){
				self.tab.setActivePage(self.tab.childPage[1]);
				this.icm = self.summaryBA.cells(0, row);
				this.ba_rekon = self.summaryBA.cells(8, row);
				self.getReport("getViewBA",[self.summaryBA.cells(0, row), self.summaryBA.cells(8, row)], self.viewba1.frame.frame);
								
			}
		});
		//View BA
		var dokViewer = new control(this.tab.childPage[1], {bound:[0,60, this.tab.width-2, this.tab.height-85 ]});	
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
		this.eMemo = new saiMemo(this.tab.childPage[1],{bound:[20,5,800,50], caption:"Catatan"});
		
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


			self.app._mainForm.bSimpan.setCaption("Submit");
			self.app._mainForm.bHapus.setCaption("Return");
			self.app._mainForm.bSimpan.setVisible(false);
			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);

			self.on("close",function(){
				self.app._mainForm.bSimpan.setCaption("Save");
				self.app._mainForm.bSimpan.setCaption("Delete");
				self.app._mainForm.bHapus.setVisible(true);
				self.app._mainForm.bClear.setVisible(true);
				self.app._mainForm.bSimpan.setVisible(true)
			});

		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fAdminRekon.extend(window.childForm);
window.app_saku_modul_fAdminRekon.implement({
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisRepTW", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doAfterResize: function(w, h){
		if (this.tab) {
			this.tab.setWidth( w - 40);
			this.bprint.setLeft(this.tab.width - 105);
		}
		
	},
	doTabChange: function(sender, activePage){
		console.log("testing " + activePage);
		if (activePage == this.tab.childPage[0]){
			this.app._mainForm.bSimpan.setVisible(false)
			this.app._mainForm.bHapus.setVisible(false)
		}else {
			this.app._mainForm.bSimpan.setVisible(true)
			this.app._mainForm.bHapus.setVisible(true)
		}
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
		this.app.services.callServices("financial_mantisFlowApproval", "exportBARekon", [this.tmpFilter], (filename) => {
			this.hideLoading();
			window.open("./server/reportDownloader.php?f="+filename+"&n=BARekon.xlsx");
		}, (err) => {
			this.hideLoading();
		});
	},
	getSummaryBA: function(lokasi = null, icm = null, akun = null, perio = null, tp = null, status = null, jasa = null){
		
		this.showLoading("Please wait...");
		this.app.services.callServices("financial_mantisFlowApproval", "reportBARekon", [this.tmpFilter], (data) => {
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
					line.jenis_rekon,
					 "<center><button style='background:#1976D2;cursor:pointer;border:none;width:100%;height:100%;color:white'><i class='fa fa-eye' style='color:white'/> View BA</button>",
					 "FALSE"

				]);
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
			system.confirm(this, "hapus", "Yakin data akan direturn?","");
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
				this.returnicm();
				break;
		}
	},
	simpan: function(){
		if (this.eMemo.getText() == ""){
			this.alert("Catatan tidak valid","Catatan tidak boleh kosong");
		}else{
			this.app.services.callServices("financial_mantisFlowApproval", "setDone", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
				 

			});
		}
	},
	returnicm : function(){
		if (this.eMemo.getText() == ""){
			this.alert("Catatan tidak valid","Catatan tidak boleh kosong");
		}else{
			this.app.services.callServices("financial_mantisFlowApproval", "returnICM", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
				 

			});
		}
	}
});
