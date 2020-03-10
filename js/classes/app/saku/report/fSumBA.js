window.app_saku_report_fSumBA = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_report_fSumBA.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_report_fSumBA";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Laporan Summary BA", 99);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		this.container = new panel(this, {bound:[0, 0,this.width - 5, this.height - 8]});
		this.container.getCanvas().css({borderStyle: "none"});
		
		this.tab = new pageControl(this,{bound:[20,10,this.width-40,this.height-35],
			childPage: ["Summary BA"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});
		
		this.pnl0 = new panel(this.tab.childPage[0], {bound:[ 10, 5, 500, 100],caption:"Summary",border:1});
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
	

		this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 30), 5, 655, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.f1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode (YTD)",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[157, 23, 20, 20], caption:"s/d", bold: true, fontSize:9, visible:false});    
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM", visible:false});
		this.icm = new saiLabelEdit(this.pnl1,{bound:[this.f2.left + this.f2.width + 20, 23, 200, 20], labelWidth:80, caption:"ICM"});
		
		this.f3 = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa", rightLabelVisible: false});
		this.fcbp = new saiCB(this.pnl1,{bound:[this.f3.left + this.f3.width + 20, 48, 200, 20],labelWidth:80, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
  
		this.f4 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status Elim", items:["BSPL","NON BSPL"] });

		this.f5 = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD", rightLabelVisible: false});
		this.f6 = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP", rightLabelVisible: false});  

		this.bOk = new button(this.pnl1, {bound:[560, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[560, 50, 80, 20], caption:"Export XLS", click:[this,"doChange"]});
		
		this.bOk.setColor("#4cd137");
		this.bOk.on("click", () => {
			if(this.f1.getText() == '' && this.f2.getText() == ''){
				system.alert(this, 'Silahkan isi periode awal atau periode akhir terlebih dahulu.', '');
			}else{
				let cocd = this.f5.getText();
				let icm = this.icm.getText();
				let akun = null;
				let perio = {
					perio_awal: this.f1.getText(),
					perio_akhir: this.f2.getText()
				};
				let tp = this.f6.getText();
				let status = this.f4.getText();
				let jasa = this.f3.getText();
				let fcbp = this.fcbp.getText();
				let company_id = this.app._lokasi;
				this.setTmpFilter(cocd, icm, akun, perio, tp, status, jasa, fcbp, company_id);
				this.getSummaryBA(cocd, icm, akun, perio, tp, status, jasa, fcbp, company_id);
			}
		});

		this.b_exportXls.on("click", () => {
			console.log(this.tmpFilter);
			this.exportXls(this.tmpFilter);
		});
	
		
		this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[10,120,this.tab.width-25,this.tab.height-125],
			colCount: 24, headerHeight: 65,
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
					title : "FCBP",
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
					title : "Status",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "BA Rekon",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				}
			],
			colFormat:[[15, 16, 17, 18, 19, 20, 22, 23, 24],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai, cfNilai, cfNilai, cfNilai, cfNilai]],
			autoPaging: true, rowPerPage: 50, readOnly:true
		});

		this.setTabChildIndex();
		try {
			this.f5.setText(this.app._lokasi);
			this.f5.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar CC");		
			this.f6.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar TP");
			this.f3.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_report_fSumBA.extend(window.childForm);
window.app_saku_report_fSumBA.implement({
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
	setTmpFilter: function(cocd, icm, akun, perio, tp, status, jasa, fcbp, company_id){
		this.tmpFilter = {
			cocd : cocd,
			icm : icm, 
			akun : akun,
			perio : perio,
			tp : tp,
			status : status,
			jasa : jasa,
			fcbp : fcbp,
			company_id : company_id,
			sort : ""
		};
	},

	exportXls: function(filter){
		this.showLoading("Please wait...");
		this.app.services.callServices("financial_mantisSumBA", "exportXls", [filter], (data) => {
			window.open("./server/reportDownloader.php?f="+data.filetmp+"&n="+data.filename+".xlsx");
			this.hideLoading();
		}, (err) => {
			this.hideLoading();
		});
	},
	getSummaryBA: function(lokasi = null, icm = null, akun = null, perio = null, tp = null, status = null, jasa = null, fcbp = null, company_id = null){
		this.showLoading("Please wait...");
		this.app.services.callServices("financial_mantisSumBA", "getSummaryBA", [lokasi, icm, akun, perio, this.tmpFilter], (data) => {
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
					line.icm, line.year, line.month, line.cc, line.ba_cc, 
					line.tp, line.ba_tp, line.fcbp, line.kode_jasa, line.jenis_jasa, line.orig_acct,
					line.desc_orig_acct, line.acct_coa, line.desc_acct_coa, line.currency
					, Math.round(line.saldo_awal_doc, 0)
					, Math.round(line.saldo_awal_loc, 0)
					, Math.round(line.doc_amount, 0)
					, Math.round(line.loc_amount, 0)
					, Math.round(line.saldo_akhir_doc, 0)
					, Math.round(line.saldo_akhir_loc, 0)
					, line.jenis_rekon
					, Math.round(line.elim_reguler, 0)
					, Math.round(line.elim_bspl, 0)
					, Math.round(line.balance, 0)
					, line.status
					, line.ba_rekon
				]);				
				sa_loc += parseFloat(line.saldo_awal_loc);
				sa_doc += parseFloat(line.saldo_awal_doc);
				mu_loc += parseFloat(line.loc_amount);
				mu_doc += parseFloat(line.doc_amount);
				sak_loc += parseFloat(line.saldo_akhir_loc);
				sak_doc += parseFloat(line.saldo_akhir_doc);
				
			}
			
			this.sAwal1.setCaption(floatToNilai(Math.round(sa_doc, 0)));
			this.sAwal2.setCaption(floatToNilai(Math.round(sa_loc, 0)));
			this.mut1.setCaption(floatToNilai(Math.round(mu_doc, 0)));
			this.mut2.setCaption(floatToNilai(Math.round(mu_loc, 0)));
			this.sAkhir1.setCaption(floatToNilai(Math.round(sak_doc, 0)));
			this.sAkhir2.setCaption(floatToNilai(Math.round(sak_loc, 0)));
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
