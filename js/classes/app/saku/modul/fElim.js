window.app_saku_modul_fElim = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fElim.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fElim";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Process Eliminasi", 99);

		uses("control_popupForm;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		this.container = new panel(this, {bound:[0, 0,this.width - 5, this.height - 8]});
		this.container.getCanvas().css({borderStyle: "none"});

		this.bSearch = new button(this.container,{bound:[this.container.width - 110, 30, 80, 20],icon:"<i class='fa fa-filter' style='color:white'></i>", caption:"Filter"});
   		this.bSearch.setColor("#3c40c6");

		this.bSearch.on("click", (sender) => {
			this.pSearch.show();
			this.pSearch.setArrowMode(2);
			this.pSearch.setArrowPosition(5,260);
			var node = sender.getCanvas();
			this.pSearch.setTop(node.offset().top + 20 );
			this.pSearch.setLeft(node.offset().left + (node.width() / 2 ) - 260);	
			this.pSearch.getCanvas().fadeIn("slow");
		});

		this.pSearch = new control_popupForm(this.app);
		this.pSearch.setBound(0, 0, 300, 250);
		this.pSearch.setArrowMode(4);
		this.pSearch.hide();
		
		this.cb_cocd = new saiCBBL(this.pSearch,{
			bound:[20,10,200,20],
			caption:"Company Code",
			tag:2,
			rightLabelVisible: false
		});
		this.cb_icm = new saiCBBL(this.pSearch,{
			bound:[20,35,200,20],
			caption:"ICM",
			tag:2,
			rightLabelVisible: false
		});
		this.cb_akun = new saiCBBL(this.pSearch,{
			bound:[20,60,200,20],
			caption:"Akun",
			tag:2,
			rightLabelVisible: false
		});
		
		this.tahun = new saiLabelEdit(this.pSearch,{
			bound:[20,85,200,20],
			caption:"Tahun",
			placeHolder: "YYYY",
			tag: 2
		});	
		this.bulan = new saiCB(this.pSearch,{
			bound: [20,110,200,20],
			caption: "Bulan",
			items: ["01","02","03","04","05","06","07","08","09","10","11","12"],
			readOnly: true,
			placeHolder: "MM",
			tag: 2
		});
		this.bulan = new saiCB(this.pSearch,{
			bound: [20,133,200,20],
			caption: "Jenis Elim",
			items: ["BSPL","Non BSPL"],
			readOnly: true,
			placeHolder: "Eliminasi",
			tag: 2
		});

		this.bOk = new button(this.pSearch, {bound:[20, 195,80,20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doFilter"]});
		this.bOk.setColor("#ffa801");
		this.bCancel = new button(this.pSearch, {bound:[120, 195,80,20], icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.bCancel.setColor("#485460");

		this.bOk.on("click", () => {
			this.pSearch.hide();

			let perio = {
				bulan: this.bulan.getText(),
				tahun: this.tahun.getText()
			};
			this.set_TmpPeriod(perio);
			this.getSummaryBA(this.cb_cocd.getText(), this.cb_icm.getText(), this.cb_akun.getText(), perio);
		});

		this.bCancel.on("click", () => {
			this.pSearch.hide();
		});
	
		this.tab = new pageControl(this.container,{bound:[10,50,this.width-20,this.height-80],
			childPage: ["Eliminasi"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});
		
		this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[20,10,this.tab.width-40,this.tab.height-35],
			colCount: 24,
			colTitle: [
				"ICM","Year","Month","CC","BA CC",
				"TP","BA TP","Kode Jasa","Jenis Jasa","Orig Acct",
				"Desc of Orig Acct", "Acct COA", "Desc of Acct COA", "Curr", "Saldo Awal",
				"Mutasi Doc Amount", "Mutasi Loc Amount", "Adjustment", "Saldo Akhir", "Jenis Rekon",
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

		this.setTabChildIndex();
		try {
			this.getSummaryBA();
			this.cb_cocd.setServices(this.app.servicesBpc, "callServices", ["financial_RRA", "getListCocd", []], ["cocd", "company_name"], "", "Data Company Code");
			this.cb_icm.setServices(this.app.servicesBpc, "callServices", ["financial_RRA", "getListIcm", []], ["icm", "pekerjaan"], "", "Data ICM");
			this.cb_akun.setServices(this.app.servicesBpc, "callServices", ["financial_RRA", "getListKdAkun", []], ["gl_acct", "deskripsi"], "", "Data Akun");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fElim.extend(window.childForm);
window.app_saku_modul_fElim.implement({
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

	set_TmpPeriod: function(period){
		this.tmp_mantisPeriod = period;
	},

	getSummaryBA: function(lokasi = null, icm = null, akun = null, tmp_mantisPeriod = null){
		console.log("call getSummaryBA");
		this.app.services.callServices("financial_RRA", "getSummaryBA", [lokasi, icm, akun, tmp_mantisPeriod], (data) => {
			for(var key in data){
				let line = data[key];
				this.summaryBA.addRowValues([
					line.icm, line.year, line.month, line.cc, line.ba_cc, 
					line.tp, line.ba_tp, line.kode_jasa, line.jenis_jasa, line.orig_acct,
					line.desc_orig_acct, line.acct_coa, line.desc_acct_coa, line.currency, line.saldo_awal, 
					line.mutasi_doc_amount, line.mutasi_loc_amount, line.adjustment, line.saldo_akhir, line.jenis_rekon,
					line.elim_reguler,line.elim_bspl,line.balance,line.status
				]);
			}
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
