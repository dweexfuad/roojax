window.app_saku_report_fReportAdjustment = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_report_fReportAdjustment.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_report_fReportAdjustment";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Laporan Cek Anomali", 99);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		
		this.pnl1 = new panel(this, {bound:[ 20, 20, 900, 80],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.ePeriode = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode (YTD)",placeHolder:"YYYYMM"});
		this.eCocd = new saiCBBL(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"COCD"});
	
		this.cbNote1 = new saiCB(this.pnl1,{bound:[10,50,250,20],caption:"Simulasi TB vs Elim", items:["OK","ANOMALI"]});
		this.cbNote2 = new saiCB(this.pnl1,{bound:[270,50,250,20],caption:"Cek Adjustment", items:["OK","ADJUSTMENT DI LUAR REKON"]});
		this.cbNote3 = new saiCB(this.pnl1,{bound:[530,50,250,20],caption:"Cek TB Aft Rekon", items:["OK","ANOMALI"]});

		this.bOk = new button(this.pnl1, {bound:[530, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.b_exportXls = new button(this.pnl1, {bound:[640, 23, 80, 20], caption:"Export XLS", click:[this,"doChange"]});
		
		this.bOk.setColor("#4cd137");
		this.bOk.on("click", () => {
            this.bBack.hide();
            if (this.pSumBA)
                this.pSumBA.hide();
			this.getSummaryBA();
		});

		this.b_exportXls.on("click", () => {
			this.exportEliminasi(this.tmpFilter);
		});
        
        this.bBack = new button(this, {bound:[10, 24, 80, 20], icon:"<i class='fa fa-chevron-left' style='color:white'></i>", caption:"Back"});
        this.bBack.hide();
        this.bBack.on("click", () => {
            this.bBack.hide();
            this.pSumBA.hide();
        });
		this.summaryBA = new saiGrid(this,{bound:[10,120,this.width-25,this.height-125],
			colCount: 14, headerHeight: 65, pasteEnable: false,
			colTitle: [
				{
					title : "ORIGINAL ACCOUNT",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
					freeze: true
				},
				{
					title : "MAPPING ACCOUNT",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "DESCRIPTION",
					width : 250,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "TB SBLM REKON",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "ADJUST REKON",
					width : 150,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "SIMULASI TB",
					width : 150,//200,
					columnAlign: "bottom", 
					hint  : "",
					visible: false,
                },
				
                {
					title : "SALDO ELIMINASI",
					width : 150,//200,
					columnAlign: "bottom", 
					hint  : "",
					visible: false,
				},
                {
					title : "CEK SALDO TB SIMULASI",
					width : 150,//200,
					columnAlign: "bottom", 
					hint  : "",
					visible: false,
				},
				{
					title : "NOTES SALDO TB SIMULASI vs ELIMINASI",
					width : 200,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "TB AFTER REKON",
					width : 150,//200,
					columnAlign: "bottom", 
					hint  : "",
					visible: false,
                },
                {
					title : "SIMULASI vs TB AFTER REKON",
					width : 150,//200,
					columnAlign: "bottom", 
					hint  : "",
					visible: false,
				},
				{
					title : "NOTES SALDO ELIMINASI",
					width : 200,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "CEK SALDO TB AFTER REKON",
					width : 120,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "NOTES SALDO TB vs ELIMINASI",
					width : 200,
					columnAlign: "bottom", 
					hint  : "",
				}
			],
			colFormat:[[3,4,5,6,7,9,10,12],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
			autoPaging: true, rowPerPage: 20, readOnly:true
		});
		

        this.summaryBA.on("dblClick", (col, row) =>{
            if (col != this.summaryBA) {
                this.akun = this.summaryBA.cells(0, row);
                console.log(this.akun);
                this.showReportSummmaryBA();
            }
            
        });
        this.setTabChildIndex();
        this.rearrangeChild(20,23);
		try {
			this.eCocd.setText(this.app._lokasi);
			this.ePeriode.setText(this.app._periode);
			this.eCocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar CC");		
			
		}catch(e){
			systemAPI.alert(e);
		}
		

	}
};
window.app_saku_report_fReportAdjustment.extend(window.childForm);
window.app_saku_report_fReportAdjustment.implement({
	
	doAfterResize: function(w, h){
		if (this.listView) {
			this.listView.setHeight(this.height);
			this.container.setHeight(this.height);
		}
		
	},
	showReportSummmaryBA: function(){
        this.bBack.show();
		if (this.pSumBA === undefined){
			this.pSumBA = new panel(this, {bound:[10,this.summaryBA.top, this.summaryBA.width, this.summaryBA.height], caption:"", color:"#ffffff"});
			this.tDetailAkunBA = new saiGrid(this.pSumBA,{bound:[0,0,this.pSumBA.width-2,this.pSumBA.height-5],
				colCount: 24, headerHeight: 65, pasteEnable: false,
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
						width : 0,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Month",
						width : 0,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Curr",
						width : 0,
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
						width : 0,//200,
						columnAlign: "bottom", 
						hint  : "",
						visible: false,
					},
					{
						title : "CC",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "BA CC",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "TP",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "BA TP",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Orig Acct",
						width : 80,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Desc Of Orig Acct",
						width : 0,//200,
						columnAlign: "bottom", 
						hint  : "",
						visible: false,
					},
					{
						title : "Acct COA",
						width : 80,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Desc of Acct COA",
						width : 0, //200,
						columnAlign: "bottom", 
						hint  : "",
						visible: false,
					},
					
					{
						title : "Saldo Awal Pra Rekon",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100, //150
								format : cfNilai,
								columnAlign: "bottom", 
								visible: false,
								hint  : "Saldo Awal Doc Amount", 
								column : [{
									title :"1",
									width : 100, //150
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Awal Loc Amount", 
								column : [{
									title : "2",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Mutasi Pra Rekon",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,//150
								format : cfNilai,
								visible: false,
								columnAlign: "bottom", 
								hint  : "Mutasi Doc Amount", 
								column : [{
									title :"3",
									width : 100,//150
									format : cfNilai
								}]
							},
							{
								title : "Lc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Mutasi Loc Amount", 
								column : [{
									title : "4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Saldo Awal Rekon",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,
								visible: false,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Doc Amount", 
								column : [{
									title :"5 = 1 + 3",
									width : 100,
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Loc Amount", 
								column : [{
									title : "6 = 2 + 4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Adjustment",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,
								format : cfNilai,
								visible: false,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Doc Amount", 
								column : [{
									title :"5 = 1 + 3",
									width : 100,
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Loc Amount", 
								column : [{
									title : "6 = 2 + 4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Saldo Akhir",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,
								format : cfNilai,
								visible: false,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Doc Amount", 
								column : [{
									title :"5 = 1 + 3",
									width : 100,
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Loc Amount", 
								column : [{
									title : "6 = 2 + 4",
									width : 100,
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
                    },
					{
						title : "Status ICM",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
					}
				],
				colFormat:[[14, 15, 16, 17, 18,19, 20,21,22,23,25],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
				autoPaging: true, rowPerPage: 50, readOnly:true
			});
			this.tDetailAkunBA.on("mouseover", (col, row, node) => {
                if (col == 16 || col == 17){
                    node.css({cursor:"pointer"});
                    window.system.showHint(node.offset().left, node.offset().top + 20, "Silakan double klik untuk lihat detail jurnal",true);
                }
            });
            this.tDetailAkunBA.on("mouseleave", (col, row ,node) => {
                
			});
			this.tDetailAkunBA.on("downloadBtnClick", () => {
				// this.showLoading("Please wait...");
                console.log("masuk sini...");
                this.tmpFilter = {
                    cocd : this.eCocd.getText(),
                    icm : "", 
                    akun : this.akun,
                    perio :  {perio_awal : this.ePeriode.getText(), perio_akhir : this.ePeriode.getText()},
                    tp : "",
                    status : "",
                    jasa :"",
                    ba_rekon : ""
                };
				this.app.services.callServices("financial_mantisRepTW", "exportEliminasi", [this.tmpFilter], (filename) => {
					// this.hideLoading();
					window.open("./server/reportDownloader.php?f="+filename+"&n=Adjustment.xlsx");
				}, (err) => {
					// this.hideLoading();
				});
			});
            // this.tDetailAkunBA.on("dblClick", (col, row, value) => {
            //     if (col != this.summaryBA) {
            //         if (col == 16 || col == 17){
            //             this.selected_akun = this.tDetailAkunBA.cells(10, row);
            //             this.currency = this.tDetailAkunBA.cells(4,row);
            //             this.selected_cc = this.tDetailAkunBA.cells(6, row);
            //             this.selected_tp = this.tDetailAkunBA.cells(8, row);
            //             this.showPanelShowJurnal(0);
            //         }else if (col == 20 || col == 21){
            //             this.selected_akun = this.summaryBA.cells(10, row);
            //             this.showPanelShowJurnal(1);

            //         }
                    
            //     }
                
            // });
		}  
		this.pSumBA.show();
		
		this.getDetailBA();
		
	},
	getDetailBA: function(){
		console.log("call getSummaryBA");
        
        this.pSumBA.show();
        this.tDetailAkunBA.clear();
        this.tmpFilter = {
            cocd : this.eCocd.getText(),
            icm : "", 
            akun : this.akun,
            perio :  {perio_awal : this.ePeriode.getText(), perio_akhir : this.ePeriode.getText()},
            tp : "",
            status : "",
            jasa :"",
            ba_rekon : ""
        };
		this.app.services.callServices("financial_mantisRepTW", "getListEliminasi", [this.tmpFilter], (data) => {
			
			
			for(var key in data){
				let line = data[key];
				
				this.tDetailAkunBA.addRowValues([
					line.icm, line.year, line.month, line.currency,line.kode_jasa, line.jenis_jasa,
					line.cc, line.bacc, 
					line.tp, line.batp, line.kode_akun,
					line.description, line.gl_acct, line.short_text,
					Math.round(line.doc_sawal,0),  Math.round(line.loc_sawal,0),
					Math.round(line.doc_amount,0), Math.round(line.loc_amount,0), 
					Math.round(line.doc_sakhir,0), Math.round(line.loc_sakhir,0), 
					Math.round(line.doc_amount_adj,0), Math.round(line.loc_amount_adj,0), 
					Math.round(line.doc_sakhir_adj,0), Math.round(line.loc_sakhir_adj,0), 
					line.jenis_rekon,
					Math.round(line.balance,0),line.status, line.ba_rekon, line.status_ba
				]);
				
			}
			

			
		}, (err) => {
			
		});
	},
	exportEliminasi: function(filter){
		this.showLoading("Please wait...");
		console.log("masuk sini...");
		var filterNotes = {
			note1 : this.cbNote1.getText(),
			note2 : this.cbNote2.getText(),
			note3 : this.cbNote3.getText()
		}
		this.app.services.callServices("financial_mantisTB", "downloadAnomali", [this.eCocd.getText(), this.ePeriode.getText(), filterNotes], (filename) => {
			this.hideLoading();
			window.open("./server/reportDownloader.php?f="+filename+"&n=Eliminasi.xlsx");
		}, (err) => {
			this.hideLoading();
		});
	},
	getSummaryBA: function(){
		console.log("call getSummaryBA");
		this.showLoading("Please wait...");
		var filterNotes = {
			note1 : this.cbNote1.getText(),
			note2 : this.cbNote2.getText(),
			note3 : this.cbNote3.getText()
		}
		this.app.services.callServices("financial_mantisTB", "getReportAdjustment", [this.eCocd.getText(), this.ePeriode.getText(), filterNotes], (data) => {
			this.summaryBA.clear();
			// console.log(JSON.stringify(data));
			$.each(data, (key, line) => {
				// let line = data[key];
				//loc_amount_adj, sim_tb, tb_after, sim_after, saldo_elim, cek_saldo_sim, cek_saldo_after
				// console.log(line.note_adj +":"+line.note_tb_elim +":"+line.note_tb_sim);
				this.summaryBA.addRowValues([
					line.kode_akun, line.akun_tlkm,line.description,  line.amount, line.loc_amount_adj, line.sim_tb,  line.saldo_elim, line.cek_saldo_sim, line.note_tb_sim, line.tb_after, line.sim_after, line.note_adj, line.cek_saldo_after, line.note_tb_elim
				]);
			} );
				
			
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
