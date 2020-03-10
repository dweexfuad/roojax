window.app_saku_report_fBaDetail = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_report_fBaDetail.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_report_fBaDetail";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Report BA Detail", 99);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		this.container = new panel(this, {bound:[0, 0,this.width - 5, this.height - 8]});
		this.container.getCanvas().css({borderStyle: "none"});

	
		
		this.tab = new pageControl(this,{bound:[20,10,this.width-40,this.height-35],
			childPage: ["Eliminasi"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});
		
		this.pnl0 = new panel(this.tab.childPage[0], {bound:[ 10, 5, 500, 100],caption:"Summary", visible:false,order:1});
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
		this.sd = new label(this.pnl1, {bound:[155, 23, 20, 20], caption:"s/d", bold: true, fontSize:9});    
		this.f2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.co_icm = new saiLabelEdit(this.pnl1,{bound:[350, 23, 180, 20],labelWidth:60,caption:"ICM"});    
		
		this.f4 = new saiLabelEdit(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"No Jurnal"});

		// this.f4 = new saiLabelEdit(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"No Jurnal" });
		// this.co_jasa = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa"});    
		this.co_akun = new saiLabelEdit(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Akun"});    
	
		// this.f4 = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status Elim", items:["BSPL","NON BSPL"] });
		this.co_cocd = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD"});
		this.co_tp = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP"});  
		// this.co_fcbp = new saiCB(this.pnl1,{bound:[350, 73, 150, 20],labelWidth:80,caption:"FCBP",items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});    

		
		
		this.bOk = new button(this.pnl1, {bound:[560, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[560, 48, 80, 20], caption:"Export XLS", click:[this,"doChange"]});
		
		this.bOk.setColor("#4cd137");
		this.bOk.on("click", () => {
			let cocd = this.co_cocd.getText();
			let icm = this.co_icm.getText();
			let akun = this.co_akun.getText();
			let perio = {
				perio_awal: this.f1.getText(),
				perio_akhir: this.f2.getText()
			};
			let tp = this.co_tp.getText();
			// let fcbp = this.co_fcbp.getText();
			// this.alert(this.f4.getText());
			let no_jurnal = this.f4.getText();
			
			this.setTmpFilter(cocd, icm, akun, perio, tp, no_jurnal);
			this.getBaDetail(cocd, icm, akun, perio, tp, no_jurnal);
		});

		this.b_exportXls.on("click", () => {
			let cocd = this.co_cocd.getText();
			let icm = this.co_icm.getText();
			let akun = this.co_akun.getText();
			let perio = {
				perio_awal: this.f1.getText(),
				perio_akhir: this.f2.getText()
			};
			let tp = this.co_tp.getText();
			// let fcbp = this.co_fcbp.getText();
			let no_jurnal = this.f4.getText();
			
			this.setTmpFilter(cocd, icm, akun, perio, tp, no_jurnal);
			this.exportBaDetail(cocd, icm, akun, perio, tp, no_jurnal);
		});
		
		// this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[10,120,this.tab.width-25,this.tab.height-125],
		// 	colCount: 25, headerHeight: 65, pasteEnable: false,
		// 	colTitle: [
		// 		{
		// 			title : "ICM",
		// 			width : 100,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 			freeze: true
		// 		},
		// 		{
		// 			title : "Year",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Month",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Curr",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Kode Jasa",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Jenis Jasa",
		// 			width : 0,//200,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 			visible: false,
		// 		},
		// 		{
		// 			title : "CC",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "BA CC",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "TP",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "BA TP",
		// 			width : 70,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Orig Acct",
		// 			width : 100,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Desc Of Orig Acct",
		// 			width : 0,//200,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 			visible: false,
		// 		},
		// 		{
		// 			title : "Acct COA",
		// 			width : 100,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 		},
		// 		{
		// 			title : "Desc of Acct COA",
		// 			width : 0, //200,
		// 			columnAlign: "bottom", 
		// 			hint  : "",
		// 			visible: false,
		// 		},
				
		// 	// 	{
		// 	// 		title : "Saldo Awal Pra Rekon",
		// 	// 		width : 150,
		// 	// 		hint  : "",
		// 	// 		column : [
		// 	// 			{
		// 	// 				title : "Doc Amount",
		// 	// 				width : 0, //150
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				visible: false,
		// 	// 				hint  : "Saldo Awal Doc Amount", 
		// 	// 				column : [{
		// 	// 					title :"1",
		// 	// 					width : 0, //150
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			},
		// 	// 			{
		// 	// 				title : "Loc Amount",
		// 	// 				width : 150,
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Awal Loc Amount", 
		// 	// 				column : [{
		// 	// 					title : "2",
		// 	// 					width : 150,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			}
		// 	// 		]
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Mutasi Pra Rekon",
		// 	// 		width : 150,
		// 	// 		hint  : "",
		// 	// 		column : [
		// 	// 			{
		// 	// 				title : "Doc Amount",
		// 	// 				width : 0,//150
		// 	// 				format : cfNilai,
		// 	// 				visible: false,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Mutasi Doc Amount", 
		// 	// 				column : [{
		// 	// 					title :"3",
		// 	// 					width : 0,//150
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			},
		// 	// 			{
		// 	// 				title : "Loc Amount",
		// 	// 				width : 150,
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Mutasi Loc Amount", 
		// 	// 				column : [{
		// 	// 					title : "4",
		// 	// 					width : 150,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			}
		// 	// 		]
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Saldo Awal Rekon",
		// 	// 		width : 150,
		// 	// 		hint  : "",
		// 	// 		column : [
		// 	// 			{
		// 	// 				title : "Doc Amount",
		// 	// 				width : 0,
		// 	// 				visible: false,
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Akhir Doc Amount", 
		// 	// 				column : [{
		// 	// 					title :"5 = 1 + 3",
		// 	// 					width : 0,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			},
		// 	// 			{
		// 	// 				title : "Loc Amount",
		// 	// 				width : 150,
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Akhir Loc Amount", 
		// 	// 				column : [{
		// 	// 					title : "6 = 2 + 4",
		// 	// 					width : 150,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			}
		// 	// 		]
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Adjustment",
		// 	// 		width : 150,
		// 	// 		hint  : "",
		// 	// 		column : [
		// 	// 			{
		// 	// 				title : "Doc Amount",
		// 	// 				width : 0,
		// 	// 				format : cfNilai,
		// 	// 				visible: false,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Akhir Doc Amount", 
		// 	// 				column : [{
		// 	// 					title :"5 = 1 + 3",
		// 	// 					width : 0,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			},
		// 	// 			{
		// 	// 				title : "Loc Amount",
		// 	// 				width : 150,
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Akhir Loc Amount", 
		// 	// 				column : [{
		// 	// 					title : "6 = 2 + 4",
		// 	// 					width : 150,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			}
		// 	// 		]
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Saldo Akhir",
		// 	// 		width : 150,
		// 	// 		hint  : "",
		// 	// 		column : [
		// 	// 			{
		// 	// 				title : "Doc Amount",
		// 	// 				width : 0,
		// 	// 				format : cfNilai,
		// 	// 				visible: false,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Akhir Doc Amount", 
		// 	// 				column : [{
		// 	// 					title :"5 = 1 + 3",
		// 	// 					width : 0,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			},
		// 	// 			{
		// 	// 				title : "Loc Amount",
		// 	// 				width : 150,
		// 	// 				format : cfNilai,
		// 	// 				columnAlign: "bottom", 
		// 	// 				hint  : "Saldo Akhir Loc Amount", 
		// 	// 				column : [{
		// 	// 					title : "6 = 2 + 4",
		// 	// 					width : 150,
		// 	// 					format : cfNilai
		// 	// 				}]
		// 	// 			}
		// 	// 		]
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Jenis Rekon",
		// 	// 		width : 150,
		// 	// 		columnAlign: "bottom", 
		// 	// 		hint  : "",
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Elim Reguler",
		// 	// 		width : 150,
		// 	// 		columnAlign: "bottom", 
		// 	// 		hint  : "",
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Elim BSPL",
		// 	// 		width : 150,
		// 	// 		columnAlign: "bottom", 
		// 	// 		hint  : "",
		// 	// 	},
		// 	// 	{
		// 	// 		title : "Balance",
		// 	// 		width : 150,
		// 	// 		columnAlign: "bottom", 
		// 	// 		hint  : "",
		// 	// 	},
		// 	// 	{
		// 	// 		title : "status",
		// 	// 		width : 100,
		// 	// 		columnAlign: "bottom", 
		// 	// 		hint  : "",
		// 	// 	},
		// 	// 	{
		// 	// 		title : "BA Rekon",
		// 	// 		width : 100,
		// 	// 		columnAlign: "bottom", 
		// 	// 		hint  : "",
		// 	// 	},
		// 	// ],
		// 	colFormat:[[14, 15, 16, 17, 18,19,20,21,22,23,25,26,27],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
		// 	autoPaging: true, rowPerPage: 50, readOnly:true
		// });


		       
        this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[10,120,this.tab.width-25,this.tab.height-125],
            colCount: 14,
            colTitle: ["ICM","No Jurnal","Rekon Akun","BA","Cost Center","Profit Center","Keterangan","Post Key","CC","TP","Doc Amount","Loc Amount","Tahun","Bulan"],
            colWidth:[[13,12,11,10,9,8,7,6,5,4,3,2,1,0],[50,50,120,120,50,50,60,100,100,100,40,80,130,130]],
            columnReadOnly:[true, [0,1,2,3,4,5,6,7,8,9],[]],		
            colFormat:[[10,11],[cfNilai,cfNilai]],		
            rowPerPage:15, 
            autoPaging:true, 
            pager:[this,"doPager"],
            ellipsClick: [this,"doEllipsClick"]
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
		this.listField = [
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
				visible: false,
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
				visible: false,
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
				visible: false,
			},
			{
				title : "Curr",
				width : 70,
				columnAlign: "bottom", 
				hint  : "",
			},
				
			{
				title : "Doc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Awal Doc Amount", 
				
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
			},	
			{
				title : "Doc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Mutasi Doc Amount"
			},
			{
				title : "Loc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Mutasi Loc Amount"
			},
			
			{
				title : "Doc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Akhir Doc Amount"
			},
			{
				title : "Loc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Akhir Loc Amount"
			},
			{
				title : "Doc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Akhir Doc Amount"
			},
			{
				title : "Loc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Akhir Loc Amount"
			},
			{
				title : "Doc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Akhir Doc Amount"
			},
			{
				title : "Loc Amount",
				width : 150,
				format : cfNilai,
				columnAlign: "bottom", 
				hint  : "Saldo Akhir Loc Amount"
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
			{
				title : "BA Rekon",
				width : 100,
				columnAlign: "bottom", 
				hint  : "",
			}];
		this.fChangeLayout = new control_popupForm(this.app);
			
		this.fChangeLayout.setBound(0, 0,500, 300);
		this.fChangeLayout.setArrowMode(2);
		this.fChangeLayout.getClientCanvas().css({overflow:"hidden"});
		this.fChangeLayout.setArrowPosition(5, 30);

	}
};
window.app_saku_report_fBaDetail.extend(window.childForm);
window.app_saku_report_fBaDetail.implement({
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
	setTmpFilter: function(cocd, icm, akun, perio, tp, no_jurnal){
		this.tmpFilter = {
			cocd : cocd,
			icm : icm, 
			akun : akun,
			perio : perio,
			tp : tp,
			no_jurnal : no_jurnal

		};
	},

	exportBaDetail: function(filter){
		this.showLoading("Please wait...");
		console.log("masuk sini...");
		this.app.services.callServices("financial_mantisDetBA", "exportBaDetail", [this.tmpFilter], (filename) => {
			this.hideLoading();
			window.open("./server/reportDownloader.php?f="+filename+"&n=BA-Detail.xlsx");
		}, (err) => {
			this.hideLoading();
		});
	},
	getBaDetail: function(cocd = null, icm = null, akun = null, perio = null, tp = null, no_jurnal = null){
		console.log("call getBaDetail");
		this.showLoading("Please wait...");
		this.app.services.callServices("financial_mantisDetBA", "getListBaDetail", [this.tmpFilter], (data) => {
			this.summaryBA.clear();
			var sa_loc = 0;
			var sa_doc = 0;
			var mu_loc = 0;
			var mu_doc = 0;
			var sak_loc = 0;
			var sak_doc = 0;
			var adj_loc = 0;
			var adj_doc = 0;
			var sakadj_loc = 0;
			var sakadj_doc = 0;
			for(var key in data){
				let line = data[key];
				
				this.summaryBA.addRowValues([
					line.icm, line.idheader, line.rekon_akun, line.ba, line.cost_center,line.profit_center, line.keterangan, line.post_key, line.cc, line.tp, line.doc_amount, line.loc_amount,line.tahun,line.bulan
					// Math.round(line.doc_sawal,0),  Math.round(line.loc_sawal,0),
					// Math.round(line.doc_amount,0), Math.round(line.loc_amount,0), 
					// Math.round(line.doc_sakhir,0), Math.round(line.loc_sakhir,0), 
					// Math.round(line.doc_amount_adj,0), Math.round(line.loc_amount_adj,0), 
					// Math.round(line.doc_sakhir_adj,0), Math.round(line.loc_sakhir_adj,0), 
					// line.jenis_rekon,
					// Math.round(line.elim_reg,0),Math.round(line.elim_bspl,0),
					// Math.round(line.balance,0),line.status, line.ba_rekon
				]);
				// sa_loc += parseFloat(line.loc_sawal);
				// sa_doc += parseFloat(line.doc_sawal);
				// mu_loc += parseFloat(line.loc_amount);
				// mu_doc += parseFloat(line.doc_amount);
				// sak_loc += parseFloat(line.loc_sakhir);
				// sak_doc += parseFloat(line.doc_sakhir);
				// adj_loc += parseFloat(line.loc_amount_adj);
				// adj_doc += parseFloat(line.doc_amount_adj);
				// sakadj_loc += parseFloat(line.loc_sakhir_adj);
				// sakadj_doc += parseFloat(line.doc_sakhir_adj);
			}
			// this.sAwal1.setCaption(floatToNilai((Math.round(sa_doc,0))));
			// this.sAwal2.setCaption(floatToNilai(Math.round(sa_loc,0)));
			// this.mut1.setCaption(floatToNilai(Math.round(mu_doc,0)));
			// this.mut2.setCaption(floatToNilai(Math.round(mu_loc,0)));
			// this.sAkhir1.setCaption(floatToNilai(Math.round(sak_doc,0)));
			// this.sAkhir2.setCaption(floatToNilai(Math.round(sak_loc,0)));

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
