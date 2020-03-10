window.app_saku_modul_fFBL1N = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fFBL1N.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fFBL1N";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Get Data FBL1N", 99);

		uses("control_popupForm;saiGrid;saiCBBL;radioButton");				
		this.searchContainer = new panel(this, {bound:[0, 0,this.width - 5, 100]});
        this.searchContainer.getCanvas().css({borderStyle: "none"});
        
        this.eCocd = new saiCBBL(this.searchContainer, {bound:[20,25, 200, 20], caption:"Comp Code"});
        // this.ePeriode = new saiCB(this.searchContainer, {bound:[20,26, 200, 20], caption:"Periode"});
        this.eYear = new saiLabelEdit(this.searchContainer, {bound:[20,20,200,20], caption:"Tahun"});
        this.eMonth = new saiCB(this.searchContainer, {bound:[230,20,50,20], labelWidth:0,caption:"Bulan", items:["00","01","02","03","04","05","06","07","08","09","10","11","12"]});

        this.eReload = new button(this.searchContainer, {bound:[300,20,100,20], caption:"View Data", icon:"<i class='fa fa-refresh' style='color:white'/>"});

        this.bSAP = new button(this.searchContainer, {bound:[420,20,100,20], caption:"Synch SAP", icon:"<i class='fa fa-apply' style='color:white'/>"});

        this.eSearch = new saiEdit(this.searchContainer, {bound:[this.width - 220, 20,200,20], text:""});
        $(this.eSearch.input).attr("placeholder","Search...");

        this.data = [];
        this.eSearch.on("change", () =>{
            this.frame.hide();
            var searctext = this.eSearch.getText().toLowerCase();
            var result = this.data.filter((object) => {
                    return (object.no_sap.toLowerCase().includes(searctext) || (object.keterangan ? object.keterangan.toLowerCase().includes(searctext) : false) || object.tp.toLowerCase().includes(searctext) || (object.no_clear ? object.no_clear.toLowerCase().includes(searctext) : false)  );
            });
            this.sg1.clear();
            $.each(result, (k,val) => {
                this.sg1.addRowValues([val.no_sap, val.keterangan, val.periode, val.no_clear, val.tgl_clear, val.kode_vendor, val.tp, val.tgl_post, val.tgl_synch, val.status]);
            });

        });
        this.sg1 = new saiGrid(this, {bound:[20, 27, this.width - 40, 500], 
                colCount: 11, headerHeight:40, autoPaging:true, rowPerPage:20,
                colTitle : ["No SAP","Keterangan", "periode", "No Clear", "Tgl Clear","Kode Vendor","TP","Nama TP", "Tgl Post", "Tgl Synch","Status"],
                colWidth: [[0,1,2,3,4,5,6,7,8,9,10],[100,300,80,100,80,80,80,200,80,80,100]]
            });
        
        this.sg1.on("dblClick",(col, row) => {
            this.pJurnal.show();
            console.log(col +":"+row);
            if (row !== undefined)
            {
                this.noSAP = this.sg1.cells(0, row);
                this.noClear = this.sg1.cells(3, row);
                this.tp = this.sg1.cells(6, row);
                console.log(this.noSAP +":"+this.noClear);
                this.sg2.clear();
                this.app.services.callServices("financial_mantisSAPLineItem", "getFBL1NJurnal", [this.eYear.getText()+this.eMonth.getText(), this.eCocd.getText(), this.noSAP, this.noClear], (data) => {
                    //no_sap, kode_vendor, periode,tgl_clear, no_clear, cocd, tp, status, tgl_post, tgl_synch, keterangan
                    
                    $.each(data, (k,val) => {
                        if (val.keterangan == null) 
                            val.keterangan = "-";
                        this.sg2.addRowValues(["FALSE",val.kode_akun, val.nama, val.dc,val.keterangan, val.nilai, val.nilai_curr, val.kode_vendor, this.tp, val.ba, val.no_clear, val.no_sap]);
                    });

                });
            }
            
            
        });
        this.pJurnal = new panel(this, {bound:[20,27, this.width - 40, 500], color:"#ffffff"});
        this.bBack = new button(this.pJurnal, {bound:[20,2, 80,20], caption:"Back", icon:"<i class='fa fa-chevron-left' style='color:white' />"});
        this.bBack.on("click", () => {
            this.pJurnal.hide();
            
        });
        this.bCopy = new button(this.pJurnal, {bound:[this.pJurnal.width  - 140,2, 120,20], caption:"Copy To Mantis", icon:"<i class='fa fa-copy' style='color:white' />"});
        this.bCopy.on("click", () => {
            this.confirmICM.show();
            
        });

        this.sg2 = new saiGrid(this.pJurnal, {bound:[0,25,this.pJurnal.width - 5, 400], colCount:12, headerHeight : 40,
                colTitle:["CEK","Kode Akun","Nama","DC","Keterangan","Nilai","Nilai Curr","Kode Vendor","TP","BA TP","Clear Doc","No SAP"],
                colFormat:[[0,5,6],[cfBoolean, cfNilai, cfNilai]],
                colWidth:[[0,1,2,3,4,5,6,7,8,9,10,11],[80,100,300,80,300,120,120,120,80,100,120,120]]});
            //no_sap, periode, kode_akun, cocd, nourut, dc, curr, nilai, nilai_curr, kode_vendor, keterangan
        this.pJurnal.hide();
        this.confirmICM = new popupForm(this.app);
		this.confirmICM.setBound(0, 0,400, 250);
		this.confirmICM.setArrowMode(0);
		this.confirmICM.getCanvas().css({ overflow : "hidden", background:"#fffff", borderRadius:"5px", boxShadow:"0px 10px 20px #888888" });
		this.confirmICM.getClientCanvas().css({ overflow : "hidden"});
		this.confirmICM.setTop( this.height / 2 - 100);
        this.confirmICM.setLeft( this.width / 2 - 200);
            this.title = new label(this.confirmICM,{bound:[20,10,200,20],caption:"Input ICM", fontSize:18});
            this.rb1 = new radioButton(this.confirmICM, {bound:[20, 60, 360, 20], caption: "New ICM", fontSize:12});
            this.eJasa = new saiCBBL(this.confirmICM,{bound:[60, 80, 200, 20],  labelWidth:50, caption:"Jasa"});
            this.eFCBP = new saiCB(this.confirmICM,{bound:[60, 105, 200, 20],  labelWidth:50, caption:"FCBP"});
            this.rb2 = new radioButton(this.confirmICM, {bound:[20, 140, 360, 20], caption: "Existing ICM", fontSize:12, selected : true});
            this.eICM = new saiCBBL(this.confirmICM,{bound:[60,160, 200, 20],  labelWidth:50, caption:"ICM"});
            this.bSave = new button(this.confirmICM, {bound:[250,200, 120,20], caption:"Save", icon:"<i class='fa fa-save' style='color:white' />"});
            this.bSave.on("click", () =>{
                icm = "";
                
                this.confirm("Submit Data","Anda yakin data akan di submit?", () =>{
                    var items = [];
                    var periode = this.eYear.getText() + this.eMonth.getText();
                    for (var i = 0; i < this.sg2.getRowCount();i++){
                        if (this.sg2.cells(0, i) == "TRUE") {
                            var item = {kode_akun: this.sg2.cells(1, i), 
                                        dc : this.sg2.cells(3, i),
                                        keterangan : this.sg2.cells(4, i),
                                        loc_amount : this.sg2.cells(5, i),
                                        doc_amount : this.sg2.cells(6, i),
                                        ba : this.sg2.cells(9, i),
                                        tp : this.sg2.cells(8, i)

                                    };
                            items.push(item);
                        }
                    }    
                    if (items.length == 0){
                        this.alert("Data Kosong","Tidak ada item jurnal yang dipilih");
                        return;
                    }
                    //$cocd, $icm, $periode, $nojurnal, $data, $fcbp = null, $jasa = null
                    icm = "";
                    if (this.rb1.isSelected()){
                        icm = "";
                    }else if (this.rb2.isSelected()){
                        icm  = this.eICM.getText();
                    }
                    this.app.services.callServices("financial_mantisSAPLineItem", "saveFBL1NJurnal", [this.eCocd.getText(), icm, periode, this.noSAP, items, this.eFCBP.getText(), this.eJasa.getText()], (data) => {
                        if (data == "process completed"){
                            this.info("Submit berhasil","Berhasil tersubmit");
                        }else {
                            this.alert("Submit gagal",data);
                        }

                    });
                });
                this.confirmICM.hide();
            });
            this.bCancel = new button(this.confirmICM, {bound:[120,200, 120,20], caption:"Cancel", icon:"<i class='fa fa-close' style='color:white' />"});
            this.bCancel.on("click", () => {
                this.confirmICM.hide();
            });

        this.confirmICM.hide();
        this.frame = new control(this, {bound:[20,27,this.width - 40, this.height - 150], shadow:true});
            this.frame.getCanvas().css({overflow:"hidden", background:"#ffffff"});
            this.frame.setInnerHTML("<iframe id='"+ this.getFullId()+"_frame' frameborder='0' style='position:absolute;left:0; top:0; width:100%; height:100%;overflow:auto;' />");
            var cnv = $("#"+this.getFullId() +"_frame");
            var self = this;
            cnv.bind("load", ()=>{
                    this.hideLoading();
                    //this.frame.hide();
            });
            
            this.bSAP.on('click', () => {
                this.frame.show();
                this.showLoading("Prosess sinkronisasi...");
                cnv.attr("src","server/synchFBL1N.php?c=" + this.eCocd.getText() +"&t="+this.eYear.getText()+this.eMonth.getText());
            });
        this.setTabChildIndex();
        this.rearrangeChild(25,23);
        this.frame.hide();
        this.searchContainer.rearrangeChild(25,23);
		try {
            this.app.services.callServices("financial_mantisUpload", "getListFCBP", [], (data) => {
                $.each(data, (k,v) => {
                    this.eFCBP.addItem(k, v);
                });
            });
            this.eReload.on("click",() => {
                this.frame.hide();
                showLoading("wait...");
                this.app.services.callServices("financial_mantisSAPLineItem", "getFBL1N", [this.eYear.getText()+this.eMonth.getText(), this.eCocd.getText()], (data) => {
                    //no_sap, kode_vendor, periode,tgl_clear, no_clear, cocd, tp, status, tgl_post, tgl_synch, keterangan
                    hideLoading();
                    this.sg1.clear();
                    this.data = data;
                    $.each(data, (k,val) => {
                        if (val.keterangan == null) val.keterangan = "-";
                        this.sg1.addRowValues([val.no_sap, val.keterangan, val.periode, val.no_clear, val.tgl_clear, val.kode_vendor, val.tp, val.nama_tp, val.tgl_post, val.tgl_synch, val.status]);
                    });
                    

                });
            });
            this.eCocd.setServices(this.app.servicesBpc, "callServices", ["financial_mantis", "getListCOCD", []], ["cocd", "company_name"], "", "Data Company Code");
            this.eICM.setServices(this.app.servicesBpc, "callServices", ["financial_mantisAdj", "getListICM", []], ["icm", "pekerjaan"], "", "List ICM");
            this.eJasa.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
			// this.app.services.callServices("financial_mantisSAPLineItem", "getListPeriode", [], (data) => {
            //     this.ePeriode.clearItem();
            //     $.each(data, (k,v) => {
            //         this.ePeriode.addItem(v,v);
            //     });
            // });
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fFBL1N.extend(window.childForm);
window.app_saku_modul_fFBL1N.implement({
    confirm : function(title, msg, callback ){
		if (this.confirmDialog){
			this.confirmDialog.free();
		}
		this.confirmDialog = new popupForm(this.app);
		this.confirmDialog.setBound(0, 0,400, 200);
		this.confirmDialog.setArrowMode(0);
		this.confirmDialog.getCanvas().css({ overflow : "hidden", background:"#fffff", borderRadius:"10px", boxShadow:"0px 10px 20px #888888" });
		this.confirmDialog.getClientCanvas().css({ overflow : "hidden"});
		this.confirmDialog.setTop( this.height / 2 - 100);
		this.confirmDialog.setLeft( this.width / 2 - 200);


			this.lTitle = new label(this.confirmDialog, {bound:[0,20,400,30], caption: title, alignment:"center", fontSize:18, bold :true});
			this.lMessage = new label(this.confirmDialog, {bound:[20, 60, 360, 100], caption: msg, fontSize:12});
			this.bCancel = new control(this.confirmDialog,{bound:[-1,160,201,40]});
			this.bCancel.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
									.html("<span style='font-size:12px;font-weight:bold'>CANCEL</span>")
									.on("mouseover",() =>{
										this.bCancel.getCanvas().find("span").css({fontSize:"14px"});
									})
									.on("mouseleave",() =>{
										this.bCancel.getCanvas().find("span").css({fontSize:"12px"});
									});
			this.bCancel.on("click", () => {
				this.confirmDialog.hide();
			});
			this.bOk = new control(this.confirmDialog,{bound:[200,160,200,40]});
			this.bOk.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
								.html("<span style='font-size:12px;font-weight:bold'>OK</span>")
								.on("mouseover",() =>{
									this.bOk.getCanvas().find("span").css({fontSize:"14px"});
								})
								.on("mouseleave",() =>{
									this.bOk.getCanvas().find("span").css({fontSize:"12px"});
								});;

		
		this.lTitle.setCaption(title);
		this.lMessage.setCaption(msg);
		this.bOk.removeAllListeners("click");
		this.bOk.on("click", () =>{
			this.confirmDialog.hide();
			if (callback)
				callback();
		});
		
		this.confirmDialog.show();
	},
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
