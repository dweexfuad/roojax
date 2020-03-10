window.app_saku_report_fListCM = function(owner)
{
  if (owner)
  {
    window.app_saku_report_fListCM.prototype.parent.constructor.call(this,owner);
    this.className  = "app_saku_report_fListCM";
    this.itemsValue = new arrayList();    
    this.maximize();  
    this.app._mainForm.childFormConfig(this, "mainButtonClick","Report List ICM", 99);

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
            childPage: ["Report","View BA","View Summary BA"],
            borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});					
    
    this.tab2 = new pageControl(this.tab.childPage[1],{bound:[10,10,this.tab.width-20,this.tab.height-40],
              childPage: ["View BA 1","View BA 2","View BA 3","View BA 4"],
              borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});					
    this.rearrangeChild(10, 22);

    this.pnl1 = new panel(this.tab.childPage[0], {bound:[ (this.width / 2 - 30), 1, 655, 100],caption:"Filter Data",border:1});
		this.pnl1.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});
		// this.J1 = new label(this.pnl2, {bound:[20,10,150,20], caption:"Filter Data", bold: true, fontSize:10});

		this.fPeriode1 = new saiLabelEdit(this.pnl1,{bound:[10, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.sd = new label(this.pnl1, {bound:[157, 23, 20, 20], caption:"s/d", bold: true, fontSize:9});		
		this.fPeriode2 = new saiLabelEdit(this.pnl1,{bound:[180, 23, 140, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYMM"});
		this.fIcm = new saiLabelEdit(this.pnl1,{bound:[340, 23, 170, 20],labelWidth:80,caption:"No.ICM",placeHolder:""});
    // this.fFCBP = new saiLabelEdit(this.pnl1,{bound:[340, 47, 170, 20],labelWidth:80,caption:"FCBP",placeHolder:""});
    this.fFCBP = new saiCB(this.pnl1,{bound:[340, 47, 170, 20],labelWidth:80, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
		
		this.fJasa = new saiCBBL(this.pnl1,{bound:[180, 48, 140, 20],labelWidth:80,caption:"Kode Jasa", change:[this,"doChange"]});		
		this.cbStatus = new saiCB(this.pnl1,{bound:[10, 48, 140, 20],labelWidth:80,caption:"Status", items:["OPEN","CLEAR","UNCLEAR","CLOSE"] });
		this.fCOCD = new saiCBBL(this.pnl1,{bound:[10, 73, 140, 20],labelWidth:80,caption:"COCD", change:[this,"doChange"]});
		this.fTP = new saiCBBL(this.pnl1,{bound:[180, 73, 140, 20],labelWidth:80,caption:"TP", change:[this,"doChange"]});
		// this.b_exportXls = new button(this.pnl1, {bound:[540, 60, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});	
		
		this.bOk = new button(this.pnl1, {bound:[550, 23, 80, 20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click: [this, "doClick"], keyDown:[this, "keyDown"]});
		this.bOk.setColor("#4cd137");
		this.bCancel = new button(this.pnl1, {bound:[270, 20,80,20], visible:false, icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.bCancel.setColor("#e84393");
		this.bCancel.on("click", function(){
			self.pSearch.hide();
    });
    
    var self = this;

    // this.bSearch.on("click",function(sender){
    //     self.pSearch.show();
    //     self.pSearch.setArrowMode(2);
    //     self.pSearch.setArrowPosition(5,350);
    //     var node = sender.getCanvas();
    //     self.pSearch.setTop(node.offset().top + 20 );
    //     self.pSearch.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
    //     self.pSearch.getCanvas().fadeIn("slow");
    // });

    // this.pSearch = new control_popupForm(this.app);
    // this.pSearch.setBound(0, 0,390, 250);
    // this.pSearch.setArrowMode(4);
    // this.pSearch.hide();
    // var self = this;	

    // this.bOk = new button(this.pSearch, {bound:[180, 195,80,20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doFilter"]});
    // this.bOk.setColor("#ffa801");
    // this.bCancel = new button(this.pSearch, {bound:[270, 195,80,20], icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
    // this.bCancel.setColor("#485460");

    
    // this.bCancel.on("click", function(){
    //     self.pSearch.hide();
    // });

    //summary ba
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
    this.print2 = new labelCustom(this.tab2.childPage[1], {bound:[0,10,10,30], caption:" ", frame: dokViewer2 });
    this.print2.frame.show();
    this.print3 = new labelCustom(this.tab2.childPage[2], {bound:[0,10,10,30], caption:" ", frame: dokViewer3 });
    this.print3.frame.show();
    this.print4 = new labelCustom(this.tab2.childPage[3], {bound:[0,10,10,30], caption:" ", frame: dokViewer4 });
    this.print4.frame.show();
    
    this.bprint = new button(this.tab.childPage[1], { bound: [this.width-180,5,80, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
    this.bprint.setColor("#be2edd");
    this.bprint.on("click", function () {
      self.print1.frame.frame.get(0).contentWindow.print();
      self.print2.frame.frame.get(0).contentWindow.print();
      self.print3.frame.frame.get(0).contentWindow.print();
      self.print4.frame.frame.get(0).contentWindow.print();
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

		this.bCJurnal.on("click", function(){
			self.pJurnal.hide();
			self.sgAddJurnal.clear(0);
			// self.nokon.setText("");
    });
        
    this.container.rearrangeChild(10, 22);
    
    this.setTabChildIndex();
    try {
        this.initReport();
        // this.loadReport();
    }catch(e){
        systemAPI.alert(e);
    } 
  }
};
window.app_saku_report_fListCM.extend(window.childForm);
window.app_saku_report_fListCM.implement({  
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
  initReport : function (){
		var self = this;
    this.sg = new saiTreeGrid(this.tab.childPage[0], {bound:[0, 130, this.width - 40, this.height - 220], 
    colCount: 14, headerHeight:80,
    colTitle: [
      {
        title : "IC DOC",
        width : 140,
        freeze : true,
        columnAlign: "bottom", 
        column : [ {
          title :"1",
          width : 140,
          freeze : true
        }
        ]
      },
      {
        title : "COCD",
        width : 50,
        columnAlign: "bottom", 
        column : [ {
          title :"2",
          width : 50,
        }
        ]
      },
      {
        title : "TP",
        width : 50,
        columnAlign: "bottom", 
        column : [ {
          title :"3",
          width : 50,
        }
        ]
      },
      {
        title : "Kode Jasa",
        width : 100,
        columnAlign: "bottom", 
        column : [ {
          title :"4",
          width : 100,
        }
        ]
      },
      {
        title : "Nama Jasa",
        width : 150,
        columnAlign: "bottom", 
        column : [ {
          title :"5",
          width : 150,
        }
        ]
      },

      {
        title : "Pekerjaan",
        width : 150,
        columnAlign: "bottom", 
        column : [ {
          title :"6",
          width : 150,
        }
        ]
      },
      {
        title : "Currency",
        width : 60,
        columnAlign: "bottom", 
        column : [ {
          title :"7",
          width : 60,
        }
        ]
      },
      {
        title : "FCBP",
        width : 60,
        columnAlign: "bottom", 
        column : [ {
          title :"8",
          width : 60,
        }
        ]
      },
      {
        title : "Status",
        width : 80,
        columnAlign: "bottom", 
        column : [ {
          title :"9",
          width : 80,
        }
        ]
      },
      {
        title : "View Jurnal COCD",
        width : 70,
        columnAlign: "bottom", 
        column : [ {
          title :"10",
          width : 70,
        }
        ]
      },
      {
        title : "View Jurnal TP",
        width : 70,
        columnAlign: "bottom", 
        column : [ {
          title :"11",
          width : 70,
        }
        ]
      },
      {
        title : "Amount",
        width : 120,
        columnAlign: "bottom", 
        column : [ {
          title :"12",
          width : 120,
        }
        ]
      },
      {
        title : "View BA",
        width : 70,
        columnAlign: "bottom", 
        column : [ {
          title :"13",
          width : 70,
        }
        ]
      },
      {
        title : "View Summary BA",
        width : 70,
        columnAlign: "bottom", 
        column : [ {
          title :"14",
          width : 70,
        }
        ]
      },
      
    ], 
    colFormat:[[11],[cfNilai]],
    readOnly:true, dblClick : [this,"doItemClick"],
    rowPerPage:20});
    this.sg.setHeaderHeight(80);
    this.sg.rearrange(0);
    
    this.sg.on("dblclick", (col, row, event) => {
      if (col == 0 || col == 1 || col == 2 || col == 3 || col == 4 || col == 5 || col == 6 || col == 7 || col == 8){
        var node = this.sg.selectedNode;
        var data = node.data;
        var icm = data.icm;
        var status = self.cbStatus.getText();
        
        var periode = '';
        var filter = [];
        if(self.fFCBP.getText() == "DWS"){
          var FCBP = 'FCBP05';
        }else{
          var FCBP = self.fFCBP.getText();
        }
        var items = {
          cocd : self.fCOCD.getText(),
          tp : self.fTP.getText(),
          kode_jasa : self.fJasa.getText(),
          fcbp : FCBP,
          icm : self.fIcm.getText(),
          status : self.cbStatus.getText()
        }
        console.log(items);

        filter.push(items);

        if(self.fPeriode1.getText() != ''){
          if(self.fPeriode1.getText() == ''){
            var fperiode2 = self.fPeriode1.getText();
          }else{
            var fperiode2 = self.fPeriode2.getText();
          }
          var periode = {
            periode1 : self.fPeriode1.getText(),
            periode2 : fperiode2
          };
        }
        if(icm.length > 12){
          var filter = [];
					var items = {
						idheader : data.j_cocd,
						idheader_clear : data.j_tp,
            cc_icm : data.cc
					}
          filter.push(items);
          var fungsi_php = 'getReportListCMDetailJurnal';

          var field = [
            "icm",
            "cc",
            "tp",
            "custven",
            "long_text",
            "pekerjaan",
            "currency",
            "fcbp",
            "dr_cr",
            "idheader_pengirim",
            "idheader_penerima",
            "loc_amount",
            "v_ba",
            "v_sum_ba",
          ];
        }else{
          var fungsi_php = 'getReportListCMDetail';     
          
          var field = [
            "icm",
            "cc",
            "tp",
            "kode_jasa",
            "jenis_jasa",
            "pekerjaan",
            "currency",
            "fcbp",
            "status",
            "j_cocd",
            "j_tp",
            "loc_amount",
            "v_ba",
            "v_sum_ba",
          ];
        }
        console.log(filter);
        self.app.services.callServices("financial_mantisReport",fungsi_php,[self.app._lokasi, periode, filter, icm], (data) => {
          console.log(data);
          if (data.rs == undefined || data.rs.rows.length > 0){
            node.clearChild();
            var nodeClone = $("#"+node.getFullId()+"formClone");
            if (nodeClone != null)
              nodeClone.empty();
          }
          try{
            // error_log(JSON.stringify(data));
            self.hideLoading();

            for (var i =0; i < data.rs.rows.length;i++){
              var line = data.rs.rows[i];
              var tmpNode = new saiTreeGridNode(node);
              tmpNode.setCaption(line.icm);
              tmpNode.setData(line,field,"icm");
              var ownerClone = $("#"+tmpNode.owner.getFullId()+"formClone");
              $("#"+tmpNode.owner.getFullId()+"_collapseClone").show();
              tmpNode.clone(ownerClone);  
            }
            node.expand();
          }catch(e){
            self.hideLoading();
            console.log(e);
          }
        });

        // for(var i = 0; i< this.sg.getRowCount(); i++){
        //   var node = this.sg.rowNode.get(i);
        //   if(data.report.rs.rows[i].level_spasi == 0){
        //     $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOver", "$(this).css({'background':'rgb(178,34,34)','color':'white'});");
        //     $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOut", "$(this).css({'background':'rgb(211,211,211)','color':'black'});");
        //     node.setColor('rgb(211,211,211)');
        //   }else if(data.report.rs.rows[i].level_spasi == 1){
        //     $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOver", "$(this).css({'background':'rgb(255,127,80)','color':'white'});");
        //     $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOut", "$(this).css({'background':'rgb(224,255,255)','color':'black'});");
        //     node.setColor('rgb(224,255,255)');
        //   }else if(data.report.rs.rows[i].level_spasi == 2){
        //     $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOver", "$(this).css({'background':'rgb(240,230,140)','color':'black'});");
        //     $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOut", "$(this).css({'background':'rgb(255,255,240)','color':'black'});");
        //     node.setColor('rgb(255,255,240)');
        //   }
        // }
      }else if ( col == 9){
        var node = this.sg.selectedNode;
        var data = node.data;
                
        self.pJurnal.show();
        self.pJurnal.setTop(120);
        self.pJurnal.setLeft(50);	
        self.pJurnal.getCanvas().fadeIn("slow");

        self.app.services.callServices("financial_mantisReport","viewJurnalCOCD",[data.icm.slice(0, -9),"COCD",self.app._lokasi,data.j_cocd], function(data){
          if(data.jumlah == 0){
            system.alert(self, "data not found");
            self.pJurnal.hide();
          }else{
            self.sgAddJurnal.clear();
            $.each(data.draft, function(key, val){
              self.sgAddJurnal.addRowValues([val.post_key,val.custven,"",val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);	
            });		
          }
        });
      }
      else if ( col == 10){
        var node = this.sg.selectedNode;
        var data = node.data;
          
        self.pJurnal.show();
        self.pJurnal.setTop(120);
        self.pJurnal.setLeft(50);	
        self.pJurnal.getCanvas().fadeIn("slow");
        
        self.app.services.callServices("financial_mantisReport","viewJurnalCOCD",[data.icm.slice(0, -9),"TP",self.app._lokasi,data.j_tp], function(data){
          if(data.jumlah == 0){
            system.alert(self, "data not found");
            self.pJurnal.hide();
          }else{
            self.sgAddJurnal.clear();
            $.each(data.draft, function(key, val){
              self.sgAddJurnal.addRowValues([val.post_key,val.custven,"",val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);		
            });		
          }
        });
      }else if (col == 12){
        self.tab.setActivePage(self.tab.childPage[1]);
        var node = this.sg.selectedNode;
        var data = node.data;
        self.app.services.callServices("financial_mantisReport","cekBA",[data.icm.slice(0, -9),data.icm.slice(-6)], function(data){
          console.log(data);
          if (typeof data != 'undefined'){
            var i = 1;
            $.each(data, function(k, val){
              eval('self.getReport("getViewBA",[val.icm, val.ba_rekon], self.viewba'+i+'.frame.frame);');
              i++;
            });
          }else{
            system.alert(self, "Data Tidak ditemukan","");
          }	
        });
      }else if(col == 13){
        self.tab.setActivePage(self.tab.childPage[2]);
        self.showLoading("Please wait...");
        var node = this.sg.selectedNode;
				self.app.services.callServices("financial_mantisSumBA", "getSummaryBA", [node.data.cc, node.data.icm.slice(0, -9), null, node.data.icm.slice(-6)], (data) => {
					self.summaryBA.clear();
					for(var key in data){
						let line = data[key];
						self.summaryBA.addRowValues([
							line.icm, line.year, line.month, line.cc, line.ba_cc, 
							line.tp, line.ba_tp, line.kode_jasa, line.jenis_jasa, line.orig_acct,
							line.desc_orig_acct, line.acct_coa, line.desc_acct_coa, line.currency, line.saldo_awal_doc, line.saldo_awal_loc,
							line.doc_amount, line.loc_amount, line.saldo_akhir_doc, line.saldo_akhir_loc, line.jenis_rekon,
							line.elim_reguler,line.elim_bspl,line.balance,line.status
						]);
					}
					self.hideLoading();
				}, (err) => {
					self.hideLoading();
				});
      }
    });
			
    this.showLoading("Loading...");
    this.genLaporan();
	},
	doItemClick: function(sender,col, row,  node){
		console.log(node);
		// alert(node.canvas[0].attributes[0].nodeValue);
		// alert($("#"+ node.canvas[0].attributes[0].nodeValue).attr('style'));
		// $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOver", "$(this).css({'background':'red','color':'white'});");
		// $("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOut", "$(this).css({'background':'rgb(253, 245, 239)','color':'black'});");
	},
	genLaporan: function (filter = null){
		var self = this;
    var data = [];
    if(self.fFCBP.getText() == "DWS"){
      var FCBP = 'FCBP05';
    }else{
      var FCBP = self.fFCBP.getText();
    }
    var items = {
      cocd : self.fCOCD.getText(),
      tp : self.fTP.getText(),
      kode_jasa : self.fJasa.getText(),
      fcbp : FCBP,
      icm : self.fIcm.getText(),
      status : self.cbStatus.getText()
    }
    console.log(items);

    data.push(items);
    var periode = '';
    if(self.fPeriode1.getText() != ''){
      if(self.fPeriode2.getText() == ''){
        var fperiode2 = self.fPeriode1.getText();
      }else{
        var fperiode2 = self.fPeriode2.getText();
      }
      var periode = {
        periode1 : self.fPeriode1.getText(),
        periode2 : fperiode2
      };
    }

		self.app.services.callServices("financial_mantisReport", "getReportListCM", [self.app._lokasi, periode, data], function (data) {
      console.log(JSON.stringify(data));
      self.sg.clear();
      if(data.report.rs.rows.length > 0){
        self.processRecord(data);
      }
			self.hideLoading();
		}, function(){
			self.hideLoading();
		});
	},
	processRecord : function(data){
		var field = [
      "icm",
      "cc",
      "tp",
      "kode_jasa",
      "jenis_jasa",
      "pekerjaan",
      "currency",
      "fcbp",
      "status",
      "j_cocd",
      "j_tp",
      'loc_amount',
      "v_ba",
      "v_sum_ba",
    ];
						
		this.sg.setData(data.report, field, "icm");

		for(var i = 0; i< this.sg.getRowCount(); i++){
			var node = this.sg.rowNode.get(i);
			if(data.report.rs.rows[i].level_spasi == 0){
				$("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOver", "$(this).css({'background':'rgb(178,34,34)','color':'white'});");
				$("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOut", "$(this).css({'background':'rgb(220,220,220)','color':'black'});");
			}else{
				$("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOver", "$(this).css({'background':'yellow','color':'black'});");
				$("#"+ node.canvas[0].attributes[0].nodeValue).attr("onMouseOut", "$(this).css({'background':'rgb(253, 245, 239)','color':'black'});");
			}
		}
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
  doFilter: function(sender){
		try{
			if (sender == this.bOk){				
				var self = this;					
				if (self.fCOCD.getText() == "" && self.fTP.getText() == "" && self.fJasa.getText() == "" && self.fFCBP.getText() == "" && self.cbStatus.getText() == ""){
					system.alert(self, "Inputan Tidak Boleh Kosong");
				}else{
					var self = this;	
          var data = [];
          if(self.fFCBP.getText() == "DWS"){
            var FCBP = 'FCBP05';
          }else{
            var FCBP = self.fFCBP.getText();
          }
					var items = {
						cocd : self.fCOCD.getText(),
						tp : self.fTP.getText(),
						kode_jasa : self.fJasa.getText(),
						fcbp : FCBP,
						status : self.cbStatus.getText()
					}
					data.push(items);
					var periode = '';
					if(self.fPeriode.getText() != ''){
						var periode = {
							periode : self.fPeriode.getText()
						};
					}
					this.app.services.callServices("financial_mantisReport","getReportListCM",[this.app._lokasi, periode, data], function(data){
						if (typeof data != 'undefined'){
							self.sg.clear();
							self.processRecord(data);
							self.pSearch.hide();
							// self.fKodeAkun.setText("");
							// self.fNamaAkun.setText("");
						}else{
							system.alert(self, "Data Report Tidak ditemukan","");
						}		
					});	
				}
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
      this.initReport();
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