window.app_saku_report_fMoUp = function(owner)
{
  if (owner)
  {
    window.app_saku_report_fMoUp.prototype.parent.constructor.call(this,owner);
    this.className  = "app_saku_report_fMoUp";
    this.itemsValue = new arrayList();    
    this.maximize();  
    this.app._mainForm.childFormConfig(this, "mainButtonClick","Report Monitoring Upload", 99);

    uses("control_popupForm;column;pageControl;saiEdit;datePicker;saiGrid;saiCBBL;childPage;panel;portalui_uploader;sgNavigator;column;frame;tinymceCtrl", true);      
    this.container = new panel(this, {bound:[0,0,this.width - 8, this.height - 25]});
    this.container.getCanvas().css({borderStyle: "none"});
    
    // this.bExport = new button(this.container,{bound:[this.width-300,0,100, 20],icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export to Xls", click: [this, "doClick"]});
    // this.bSearch = new button(this.container,{bound:[this.width-180,0,80, 20],icon:"<i class='fa fa-filter' style='color:white'></i>", caption:"Filter"});
    // this.bSearch.setColor("#3c40c6");		

    // this.cbMonth =  new saiCB(this.container,{ 
    // 	bound:[20, 0, 150, 20],
    // 	caption:"Month", 
    // 	items:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    // 	readOnly:true,
    // 	tag: 1
    // });		
    
    // this.fPeriode = new saiLabelEdit(this.container,{bound:[20, 0, 170, 20],caption:"Periode",placeHolder:"YYYYmm",maxLength:200, tag: 0});
    // this.fCOCD = new saiLabelEdit(this.container,{bound:[200,0,170,20],caption:"COCD"});		
    // this.fTP = new saiLabelEdit(this.container,{bound:[380,0,170,20],caption:"TP"});		
    // this.fJasa = new saiLabelEdit(this.container,{bound:[560,0,170,20],caption:"Kode Jasa"});		
    // this.fFCBP = new saiLabelEdit(this.container,{bound:[740,0,170,20],caption:"FCBP"});
    // this.cbStatus =  new saiCB(this.container,{ 
    //   bound:[930,0,170, 20],
    //   caption:"Status", 
    //   items:["OPEN", "CLEAR", "UNCLEAR", "CLOSE"],
    //   readOnly:true,
    //   tag: 1
    // });		
    // this.bSearchPeriode = new button(this.container,{bound:[1110,0,30, 20],icon:"<i class='fa fa-search' style='color:white'></i>", caption:"<i class='fa fa-search' style='color:white'></i>", click: [this, "doClick"], keyDown:[this, "keyDown"]});

    this.tab = new pageControl(this.container,{bound:[10,10,this.width-20,this.height-80],
            childPage: ["Report"],
            borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});						
    this.rearrangeChild(10, 22);

    this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 30), 1, 655, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.fPeriode1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		// this.sd = new label(this.pnl1, {bound:[157, 23, 20, 20], caption:"s/d", bold: true, fontSize:9});		
		// this.fPeriode2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		// this.fIcm = new saiLabelEdit(this.pnl1,{bound:[340, 23, 170, 20],labelWidth:80,caption:"No.ICM",placeHolder:""});
        // this.fFCBP = new saiLabelEdit(this.pnl1,{bound:[340, 47, 170, 20],labelWidth:80,caption:"FCBP",placeHolder:""});
        // this.fFCBP = new saiCB(this.pnl1,{bound:[340, 47, 170, 20],labelWidth:80, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
		
		// this.fJasa = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa", change:[this,"doChange"]});		
		// this.cbStatus = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status", items:["OPEN","CLEAR","UNCLEAR","CLOSE"] });
    this.fCOCD = new saiCBBL(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"COCD", change:[this,"doChange"]});
    this.fFCBP = new saiCB(this.pnl1,{bound:[10, 73, 170, 20],labelWidth:80, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
		// this.fTP = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP", change:[this,"doChange"]});
		// this.b_exportXls = new button(this.pnl1, {bound:[540, 60, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});	
		
		this.bOk = new button(this.pnl1, {bound:[550, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click: [this, "doFilter"], keyDown:[this, "keyDown"]});
		this.bOk.setColor("#4cd137");
		this.bCancel = new button(this.pnl1, {bound:[270, 20,80,20], visible:false, icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.bCancel.setColor("#e84393");
		this.bCancel.on("click", function(){
			self.pSearch.hide();
    });
    
    var self = this;

    this.sg = new saiGrid(this.tab.childPage[0], {bound:[0, 130, this.width - 40, this.height - 220],
        colCount: 3,
        colTitle: ["Company Code","FCBP","Tanggal Upload"],
        colWidth:[[2,1,0],[150,100]],
        colFormat:[[],[]],					
        columnReadOnly:[true, [2,1,0],[]],			
        rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]});
    var self = this;
        
    this.container.rearrangeChild(10, 22);
    
    this.setTabChildIndex();
    try {
      self.fCOCD.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
      // this.initReport();
      this.loadReport();
    }catch(e){
        systemAPI.alert(e);
    } 
  }
};
window.app_saku_report_fMoUp.extend(window.childForm);
window.app_saku_report_fMoUp.implement({  
  RefreshList : function(page){
    try{
      this.currentPage = page;
      var self  = this;
      // self.app.services.callServices("financial_Fca","getListDocSAP",[self.app._lokasi], function(data){
      //   self.sg1.clear();
        
      //   $.each(data, function(key, val){
      //     if(val.no_sap != "-" || val.no_spb != "-"){
      //       var edit = "<center><i class='fa fa-clipboard' style='color:orange;margin-top:2px'> </i>";
      //     }else{
      //       var edit = "-";
      //     }
      //     self.sg1.addRowValues([val.reg_id, val.no_tagihan, val.kode_vendor, val.nama, val.nama_proyek, val.kode_ba , val.tgl, val.nilai_tagihan, val.deskripsi, edit]);
          
      //   });
      // });
    }catch(e){
      console.log(e);
    }
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
          
        }catch(e){
          system.alert(this, e,"");
        }
      }
    }catch(e){
      systemAPI.alert(e);
    }
  },
  loadReport: function(){
    var self = this;
    self.sg.clear(0);	
    var periode = '';
    this.app.services.callServices("financial_mantisReport","getReportMoUp",[this.app._lokasi,periode], function(data){
        if (typeof data != 'undefined'){
            $.each(data, function(k, val){
                self.sg.addRowValues([
                    val.cc,
                    val.fcbp,
                    val.created_date
                ]);
            });
            // self.sg1.addRowValues(["","","",""]);
        }else{
            system.alert(self, "Data Report Tidak ditemukan","");
        }		
    });
  },
  doFilter: function(sender){
    try{
        if (sender == this.bOk){				
            var self = this;					
            var self = this;	
            var data = [];
            var items = {
                cocd : self.fCOCD.getText(),
                fcbp : self.fFCBP.getText(),
            }
            data.push(items);
            var periode = '';
            if(self.fPeriode1.getText() != ''){
                var periode = {
                    periode : self.fPeriode1.getText()
                };
            }
            this.app.services.callServices("financial_mantisReport","getReportMoUp",[this.app._lokasi, periode, data], function(data){
                if (typeof data != 'undefined'){
                    self.sg.clear(0);	
                    $.each(data, function(k, val){
                        self.sg.addRowValues([
                            val.cc,
                            val.fcbp,
                            val.created_date
                        ]);
                    });
                    // self.sg1.addRowValues(["","","",""]);
                }else{
                    system.alert(self, "Data Report Tidak ditemukan","");
                }		
            });
        }
    }catch(e){
        alert(e);
        error_log(e);
    }
  },
  keyDown: function(sender, keyCode, buttonState){
		if (keyCode == 13){
			this.bSearchPeriode.click();
		}
  },
  doClick: function(sender){
    if(sender == this.bOk){
        alert('oy');
        this.doFilter();
    }
  },
  getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisReport", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
  doChange: function(sender){
    try{      
      if (sender == this.bCari){        
        var self = this;          
          if (self.f1.getText() == "" && self.f2.getText() == "" && self.f3.getText() == "" && self.f5.getText() == "" && self.f6.getText() == "" ){
            system.alert(self, "Inputan Tidak Boleh Kosong");
          }else{
            var self = this;
            self.app.services.callServices("financial_Fca","searchInputSAP",[self.f1.getText(),self.f2.getText(),self.f3.getText(),self.f5.getText(),self.f6.getText(),self.app._lokasi], function(data){
              self.sg1.clear(0);
              
              $.each(data, function(key, val){
                if(val.no_sap != "-" || val.no_spb != "-"){
                  var edit = "<center><i class='fa fa-clipboard' style='color:orange;margin-top:2px'> </i>";
                }else{
                  var edit = "-";
                }
                self.sg1.addRowValues([val.reg_id, val.no_tagihan, val.kode_vendor, val.nama, val.nama_proyek, val.kode_ba , val.tgl, val.nilai_tagihan, val.deskripsi, edit]);
              });
            });
            self.f1.setText("");            
            self.f2.setText("");
            self.f3.setText("");
            self.f5.setText("");
            self.f6.setText("");
          }
      }

// if (sender == this.nTagih){
      //   if (this.nTagih.getText() != ""){
      //     var self = this;
            //         this.app.services.callServices("financial_Fca","getNoTagihanSAP2",[this.nTagih.getText()], function(data){
      //       self.noSAP.setText(data.draft.no_sap);
      //       self.regid.setText(data.draft.reg_id);            
            //         });
      //   }
      // }
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