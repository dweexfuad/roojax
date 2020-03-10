window.app_saku_report_fPivotICM = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_report_fPivotICM.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_report_fPivotICM";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Laporan PIVOT ICM", 99);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
		this.pnl1 = new panel(this, {bound:[10, 5, 655, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.f1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode (YTD)",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[160, 23, 20, 20], caption:"s/d", bold: true, fontSize:9, visible:false});    
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM", visible:false});
		this.co_icm = new saiLabelEdit(this.pnl1,{bound:[180, 23, 200, 20],labelWidth:80,caption:"ICM"});    
		this.co_ba = new saiCB(this.pnl1,{bound:[400, 23, 150, 20],labelWidth:80,caption:"BA Rekon",items:["BA-1","BA-2","BA-3","BA-4"]});    
		this.co_fcbp = new saiCB(this.pnl1,{bound:[400, 48, 150, 20],labelWidth:80,caption:"FCBP",items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});    

		this.co_jasa = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa"});    
		this.f4 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status Elim", items:["BSPL","NON BSPL"] });
		this.co_cocd = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD"});
		this.co_tp = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP"});  
		this.eStatus = new saiCB(this.pnl1,{bound:[400, 74, 150, 20],labelWidth:80,caption:"Status BA", items:["DONE","GA","PIC","OPEN","CLEAR/UNCLEAR","CLOSE","RETURN","TRASH"] });
		
		this.bOk = new button(this.pnl1, {bound:[560, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[560, 48, 80, 20], caption:"Export XLS", click:[this,"doChange"]});
		
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
			let ba_rekon = this.co_ba.getText();
			this.setTmpFilter(cocd, icm, akun, perio, tp, status, jasa, ba_rekon, this.co_fcbp.getText());
			this.getSummaryBA(cocd, icm, akun, perio, tp, status, jasa, ba_rekon);
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
			let ba_rekon = this.co_ba.getText();
			this.setTmpFilter(cocd, icm, akun, perio, tp, status, jasa, ba_rekon, this.co_fcbp.getText());
			this.exportEliminasi(this.tmpFilter);
		});
		
		this.summaryBA = new saiGrid(this,{bound:[10,120,this.width-25,this.height-125],
			colCount: 6, headerHeight: 65, pasteEnable: false,
			colTitle: [
				{
					title : "ICM",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
					freeze: true
				},
				{
					title : "1",
					width : 140,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "2",
					width : 140,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "4",
					width : 140,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "5",
					width : 140,
					columnAlign: "bottom", 
					hint  : "",
                },
				{
					title : "Balance",
					width : 140,
					columnAlign: "bottom", 
					hint  : "",
				}
			],
			colFormat:[[1,2,3,4,5],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
			autoPaging: true, rowPerPage: 20, readOnly:true
		});
		

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
window.app_saku_report_fPivotICM.extend(window.childForm);
window.app_saku_report_fPivotICM.implement({
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisRepTW", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doAfterResize: function(w, h){
		if (this.listView) {
			this.listView.setHeight(this.height);
			this.container.setHeight(this.height);
		}
		
	},
	setTmpFilter: function(cocd, icm, akun, perio, tp, status, jasa, ba_rekon, fcbp){
		this.tmpFilter = {
			cocd : cocd,
			icm : icm, 
			akun : akun,
			perio : perio,
			tp : tp,
			status : status,
			jasa : jasa,
			ba_rekon : ba_rekon,
			fcbp : fcbp,
			status_ba : this.eStatus.getText()

		};
	},

	exportEliminasi: function(filter){
		this.showLoading("Please wait...");
		console.log("masuk sini...");
		this.app.services.callServices("financial_mantisRepTW", "exportReportPivotICM", [this.tmpFilter], (filename) => {
			this.hideLoading();
			window.open("./server/reportDownloader.php?f="+filename+"&n=SummaryBA"+this.tmpFilter.perio.perio_awal+".xlsx");
		}, (err) => {
			this.hideLoading();
		});
	},
	getSummaryBA: function(lokasi = null, icm = null, akun = null, perio = null, tp = null, status = null, jasa = null){
		console.log("call getSummaryBA");
		this.showLoading("Please wait...");
		this.app.services.callServices("financial_mantisRepTW", "getReportPivotICM", [this.tmpFilter], (data) => {
			this.summaryBA.clear();
			
			for(var key in data){
				let line = data[key];
				
				this.summaryBA.addRowValues([
					line.icm, line.ast, line.htg, line.rev,line.expe, line.total
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
