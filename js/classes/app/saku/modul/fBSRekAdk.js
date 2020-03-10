window.app_saku_modul_fBSRekAdk = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSRekAdk.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSRekAdk";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Reklas ADK dan CAPEX", 99);

		uses("control_popupForm;column;checkBox;datePicker;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;datePicker;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer;app_saku_DashboardItem;app_saku_DashboardGrad;");			
		
		this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});		

		this.container2 = new panel(this.container, {bound:[0,20,this.width-60, this.height-60]});		

		this.tab = new pageControl(this.container,{visible:false,bound:[20,30,this.width - 60,this.height-75],
				childPage: ["List ICM","Summary BA","Create Aset"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

		this.fICMf = new saiLabelEdit(this.container2,{bound:[20, 10, 200, 20],labelWidth:80,caption:"ICM",placeHolder:""});
		this.fPeriodef = new saiLabelEdit(this.container2,{bound:[20, 35, 200, 20],labelWidth:80,caption:"Periode",placeHolder:"YYYYmm"});

		this.fFCBP = new saiCB(this.container2,{bound:[20, 60, 200, 20],labelWidth:80, caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"]});
        this.fCOCD = new saiCBBL(this.container2,{bound:[300, 10, 200, 20],labelWidth:100,caption:"COCD", change:[this,"doChange"]});		
		this.fTP = new saiCBBL(this.container2,{bound:[300, 35, 200, 20],labelWidth:100,caption:"TP", change:[this,"doChange"]});	
		this.bSearchf = new button(this.container2,{bound:[400,60,100,20],icon:"<i class='fa fa-search' style='color:white'></i>", caption:"Search",click:[this,"doClick"]});

		this.bCatRev = new button(this.tab.childPage[0],{bound:[120, 85, 110, 20],icon:"<i class='fa fa-newspaper-o' style='color:white'></i>", caption:"Catatan Review"});

		this.bCatRev.hide();
		
		this.pCatRev = new control_popupForm(this.app);
		this.pCatRev.setBound(0, 0,370, 120);
		this.pCatRev.setArrowMode(4);
		this.pCatRev.hide();
		var self = this;

		self.bCatRev.on("click",function(sender){
			if(self.pCatRev.isVisible()){
				self.pCatRev.hide();		
				self.pCatRev.getCanvas().fadeOut("slow");										
			}else{
				self.pCatRev.show();
				self.pCatRev.setArrowMode(2);
				// self.pCatRev.setArrowPosition(5,250);
				var node = sender.getCanvas();
				self.pCatRev.setTop(node.offset().top + 20 );
				self.pCatRev.setLeft(node.offset().left + (node.width() / 2 ) - 170);	
				self.pCatRev.getCanvas().fadeIn("slow");
				self.app.services.callServices("financial_BsplMaster","getDataCatRev",[self.app._lokasi,self.fICM.getText(),self.fPeriode.getText()], function(data){
					// console.log(data);
					if (typeof data.catrev != 'undefined' && data.catrev != null && data.catrev != 0){										
						self.fCatRev.setText(data.catrev);
					}
				});
			}
		});
		
		this.fCatRev = new saiMemo(this.pCatRev,{bound:[10,10,330,80],caption:"Catatan Reviewer"});	

		// this.sg0 = new saiGrid(this.tab.childPage[0],{bound:[20,110,700,this.tab.height-120],
		// 	colCount: 8,
		// 	headerHeight: 50,			
		// 	colTitle: ["ICM","PERIODE","COCD","TP","FCBP","JENIS REKON","Nilai Aset BA Rekon","STATUS"],
		// 	colWidth:[[7,6,5,4,3,2,1,0],[120,100,70,60,50,50,60,90]],										
		// 	colFormat:[[6],[cfNilai]],					
		// 	columnReadOnly:[true, [7,6,5,4,3,2,1,0],[]],	
		// 	rowperpage:1000, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"]});
		// var self = this;

		//dashboard		
		this.pDash = new panel(this.container2, {bound:[ 10, 100, this.width-90, 370], caption:"DASHBOARD BSPL",fontSize:17,border:1});
        this.pDash.getCanvas().css({border:"2px solid gray",boxShadow:"0px 1px 2px #888"});

        this.WADK = new app_saku_DashboardGrad(this.pDash, {bound:[10, 110, 240, 130], color:["#9198e5","#ffa040"], title:["ADK","<i class='fa fa-building' style='margin-left:1px;font-size:48px;color:#EA2027;padding-right:10px;;color:rgba(255,255,255,0.4)' ></i>"]});
        
        this.WCAPEX = new app_saku_DashboardGrad(this.pDash, {bound:[this.pDash.width/5*1+10, 110, 240, 130], color:["#f5af19","#f12711"], title:["CAPEX","<i class='fa fa-signal' style='margin-left:1px;font-size:48px;color:#009432;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});

		this.WTotal = new app_saku_DashboardGrad(this.pDash, {bound:[this.pDash.width/5*2+10, 110, 240, 130], color:["#004FF9","#FFF94C"], title:["TOTAL","<i class='fa fa-database' style='margin-left:1px;font-size:48px;color:#009432;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});

		this.bKembali = new button(this, {bound:[20,10,80,25], visible:false, icon:"<i class='fa fa-arrow-left' style='color:white'></i>", caption:"Back"});
        this.bKembali.setColor("#6c5ce7");

		this.bKembali2 = new button(this, {bound:[20,10,80,25], visible:false, icon:"<i class='fa fa-arrow-left' style='color:white'></i>", caption:"Back"});
		this.bKembali2.setColor("#6c5ce7");


		this.sg0 = new saiGrid(this,{visible:false,bound:[20,145,800,this.tab.height-150],
			colCount: 9,
			headerHeight: 50,			
			colTitle: ["ICM","PERIODE","COCD","TP","FCBP","JENIS REKON","Nilai Aset BA Rekon","STATUS BSPL","STATUS BA MANTIS"],
			colWidth:[[8,7,6,5,4,3,2,1,0],[100,100,100,70,60,50,50,60,90]],										
			colFormat:[[6],[cfNilai]],					
			columnReadOnly:[true, [8,7,6,5,4,3,2,1,0],[]],	
			rowPerPage:50, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"]});

        var self = this;
        
        this.sg0.on("dblClick", function(col, row, id){
			if(typeof row != 'undefined'){
				self.tab.show();
				self.bKembali2.show();
				self.container2.hide();
				self.bKembali.hide();
				self.sg0.hide();

				let cocd = self.sg0.cells(2,row);
				let icm = self.sg0.cells(0,row);
				let perio = {
					perio_awal: self.sg0.cells(1,row),
					perio_akhir: ''
				};
				let tp = self.sg0.cells(3,row);
				let fcbp = self.sg0.cells(4,row);
				let periode = self.sg0.cells(1,row);
				self.cc_icm = cocd;				
				self.tp_icm = tp;

				fcbp = fcbp.replace(/\s/g, '');
				
				self.total_nilai_ba_rekon_awal = nilaiToFloat(self.sg0.cells(6,row));

				self.total_nilai_ba_rekon_awal_v = self.total_nilai_ba_rekon_awal.toString().split(".");
				self.total_nilai_ba_rekon_awal_v[0] = self.total_nilai_ba_rekon_awal_v[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				self.total_nilai_ba_rekon_awal_v.join(".");
				
				var isValidAct = new Promise((resolve, reject)=>{
					self.loadSummaryBA(icm,perio,'','',fcbp);
					resolve(icm);					
				});																
				isValidAct.then((icm)=>{
					if(self.sg0.cells(7,row) == 'OPEN'){
						self.loadReport(icm,periode,cocd);
						self.bSubmit.show();								
						self.bSaveAsDraft.show();								
                    }else if(self.sg0.cells(7,row) == 'DRAFT'){
						self.jenis_regenerate = 'DRAFT';
						self.bSubmit.show();								
						self.bSaveAsDraft.show();
						self.loadReportDraft(icm,periode,cocd);
                    }else{
						self.bSubmit.show();								
						self.bSaveAsDraft.hide();
						self.jenis_regenerate = 'SUBMIT';						
						self.loadReportEdit(icm,periode,cocd);
						if(self.sg0.cells(7,row) == 'RETURN'){
							self.bSubmit.show();								
							self.bSaveAsDraft.show();
							self.bCatRev.show();		
						}
					}
				});
			}
		});
		
		self.WADK.on("click", function(){
			self.sg0.show();
			self.pDash.hide();
			self.bKembali.show();	
			
			var filter = {
				icm : self.fICMf.getText(),
				periode : self.fPeriodef.getText(),
				fcbp : self.fFCBP.getText(),
				cc : self.fCOCD.getText(),
				tp : self.fTP.getText(),
				status : "ADK"
			};
			self.sg0.clear(0);			
			self.showLoading("Please wait...");		
			self.app.services.callServices("financial_BsplMaster", "getListICMBSPLADK", [self.app._lokasi,filter], (data) => {
				if (typeof data.list != 'undefined' && data.list != null && data.list.length != 0){
					$.each(data.list, function(k, val){
						self.sg0.addRowValues([
							val.icm,
							val.periode,
							val.cocd,
							val.tp,
							val.fcbp,
							val.jenis_rekon,
							val.sakhir_doc,
                            val.status,
    						val.status_ba                        
						]);
					});		
				}else{
					system.alert(self, "Data tidak ditemukan");				
				}
				self.hideLoading();				
			}, (err) => {
				self.hideLoading();
			});		
        });
        self.WCAPEX.on("click", function(){
			self.sg0.show();
			self.pDash.hide();
			self.bKembali.show();	
			
			var filter = {
				icm : self.fICMf.getText(),
				periode : self.fPeriodef.getText(),
				fcbp : self.fFCBP.getText(),
				cc : self.fCOCD.getText(),
				tp : self.fTP.getText(),
				status : "CAPEX"
			};
			self.sg0.clear(0);			
			self.showLoading("Please wait...");		
			self.app.services.callServices("financial_BsplMaster", "getListICMBSPLADK", [self.app._lokasi,filter], (data) => {
				if (typeof data.list != 'undefined' && data.list != null && data.list.length != 0){
					$.each(data.list, function(k, val){
						self.sg0.addRowValues([
							val.icm,
							val.periode,
							val.cocd,
							val.tp,
							val.fcbp,
							val.jenis_rekon,
							val.sakhir_doc,
                            val.status,
						    val.status_ba                            
						]);
					});	
				}else{
					system.alert(self, "Data tidak ditemukan");				
				}
				self.hideLoading();				
			}, (err) => {
				self.hideLoading();
			});		
		});
		self.WTotal.on("click", function(){
			self.sg0.show();
			self.pDash.hide();
			self.bKembali.show();
			var filter = {
				icm : self.fICMf.getText(),
				periode : self.fPeriodef.getText(),
				fcbp : self.fFCBP.getText(),
				cc : self.fCOCD.getText(),
				tp : self.fTP.getText(),
			};
			self.sg0.clear(0);			
			self.showLoading("Please wait...");		
			self.app.services.callServices("financial_BsplMaster", "getListICMBSPL", [self.app._lokasi,filter], (data) => {
				if (typeof data.list != 'undefined' && data.list != null && data.list.length != 0){
					$.each(data.list, function(k, val){
						self.sg0.addRowValues([
							val.icm,
							val.periode,
							val.cocd,
							val.tp,
							val.fcbp,
							val.jenis_rekon,
							val.sakhir_doc,
                            val.status,
				    		val.status_ba                            
						]);
					});	
					
				}else{
					system.alert(self, "Data tidak ditemukan");				
				}
				self.hideLoading();				
			}, (err) => {
				self.hideLoading();
			});										
		});
	
		self.bKembali.on("click", function(){
			self.sg0.hide();
			self.pDash.show();
			self.bKembali.hide();		
		});

		self.bKembali2.on("click", function(){
			self.sg0.show();
			self.bKembali.show();	
			self.bKembali2.hide();		
			self.tab.hide();	
			self.container2.show();
			self.pDash.hide();	
			self.bSubmit.hide();	
		});

		this.summaryBA = new saiGrid(this.tab.childPage[0],{bound:[10,10,this.width-85,this.height-100],
			colCount: 23, headerHeight: 65, pasteEnable: false,
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
					width : 40,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Month",
					width : 40,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Curr",
					width : 40,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Kode Jasa",
					width : 40,
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
					title : "FCBP",
					width : 50,
					columnAlign: "bottom", 
					hint  : "",
					visible: false,
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
					title : "Mutasi Rekon",
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
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Balance",
					width : 100,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Status Elim",
					width : 80,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "BA Rekon",
					width : 80,
					columnAlign: "bottom", 
					hint  : "",
				},
				{
					title : "Status BA",
					width : 80,
					columnAlign: "bottom", 
					hint  : "",
				}
			],
			colFormat:[[15,16, 17,18, 19,20],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
			autoPaging: true, rowPerPage: 20, readOnly:true
		});
		
		this.fICM = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 10, 220, 20],labelWidth:110,caption:"ICM",placeHolder:"",readOnly:true});
		this.fPeriode = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 35, 220, 20],labelWidth:110,caption:"Periode Aset",placeHolder:"YYYYmm",readOnly:true});
		this.fCOCDi = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 60, 220, 20],labelWidth:110,caption:"COCD",readOnly:true});

		this.cboxPSAK = new checkBox(this.tab.childPage[1], {bound:[10, 85, 50, 20], caption:"PSAK"});
		this.cboxIFRS = new checkBox(this.tab.childPage[1], {bound:[65, 85, 50, 20], caption:"IFRS"});

		this.fExp = new saiMemo(this.tab.childPage[1],{bound:[10, 110, 220, 50],labelWidth:110,fontSize:11,caption:"Explanation"});		
		
		this.fICMP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 10, 220, 20],labelWidth:110,caption:"ICM",placeHolder:"",readOnly:true});
		this.fPeriodeP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 35, 220, 20],labelWidth:110,caption:"Periode",placeHolder:"YYYYmm",readOnly:true});
		this.fCOCDP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 60, 220, 20],labelWidth:110,caption:"COCD",readOnly:true});	

		this.cboxPSAKP = new checkBox(this.tab.childPage[3], {bound:[10, 85, 50, 20], caption:"PSAK"});
		this.cboxIFRSP = new checkBox(this.tab.childPage[3], {bound:[65, 85, 50, 20], caption:"IFRS"});

		this.fExpP = new saiMemo(this.tab.childPage[3],{bound:[10, 110, 220, 50],labelWidth:110,fontSize:11,caption:"Explanation"});		
		
		// this.bSearch = new button(this.tab.childPage[1],{bound:[10,60,80,20],icon:"<i class='fa fa-search' style='color:white'></i>", caption:"Search",click:[this,"doClick"]});
		
		// this.cbJenis = new saiCB(this.tab.childPage[1],{bound:[10, 160, 220, 20],labelWidth:110,caption:"Jenis Transaksi", items:["Jual Beli Aset","Jual Beli Inventory","BDC"] });		
		this.fRev = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 170, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Revenue ICM",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fRevBSPL = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 195, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Revenue BSPL",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fNilAst = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 220, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Aset BA Rekon",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fCogs = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 245, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"COGS",readOnly:true,placeHolder:"",change:[this,"doChange"]});	
		this.fMargin = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 270, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Margin BSPL",readOnly:true,placeHolder:""});
		this.fPersenMargin = new saiLabelEdit(this.tab.childPage[1],{bound:[10, 295, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"% Margin BSPL",readOnly:true,placeHolder:""});

		this.labelRev = new label(this.tab.childPage[1],{bound:[250,10,330,20],fontSize: 12,caption:"REVENUE"});
		this.labelCOGS = new label(this.tab.childPage[1],{bound:[925,10,330,20],fontSize: 12,caption:"COGS"});
		this.labelAset = new label(this.tab.childPage[1],{bound:[10,325,330,20],fontSize: 12,caption:"DAFTAR ASET"});
		this.labelJur = new label(this.tab.childPage[1],{bound:[10,660,330,20],fontSize: 12,caption:"JURNAL"});

		// this.cbJenisP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 185, 220, 20],labelWidth:100,caption:"Jenis Transaksi",readOnly:true});		
		this.fRevP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 170, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Revenue ICM",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fRevBSPLP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 195, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Revenue BSPL",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fNilAstP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 220, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Aset BA Rekon",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fCogsP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 245, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"COGS",readOnly:true,placeHolder:"",change:[this,"doChange"]});	
		this.fMarginP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 270, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Margin BSPL",readOnly:true,placeHolder:""});
		this.fPersenMarginP = new saiLabelEdit(this.tab.childPage[3],{bound:[10, 295, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"% Margin BSPL",readOnly:true,placeHolder:""});
		
		this.labelRevP = new label(this.tab.childPage[3],{bound:[250,10,330,20],fontSize: 12,caption:"REVENUE"});
		this.labelCOGSP = new label(this.tab.childPage[3],{bound:[925,10,330,20],fontSize: 12,caption:"COGS"});
		this.labelAsetP = new label(this.tab.childPage[3],{bound:[10,325,330,20],fontSize: 12,caption:"DAFTAR ASET"});
        this.labelJurP = new label(this.tab.childPage[3],{bound:[10,660,330,20],fontSize: 12,caption:"JURNAL"});
        
		
		this.sg1 = new saiGrid(this.tab.childPage[1],{bound:[250,40,650,this.tab.height-260],
			colCount: 6,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Orig. Acct",
					width : 70,
					columnAlign: "bottom",							
				},
				{
					title : "Nama Akun",
					width : 0,
					columnAlign: "bottom", 
				  
				},
				{
					title : "Revenue ICM",
					width : 140,
					columnAlign: "bottom", 
				  
				},
				{
					title : "Revenue BSPL",
					width : 140,
					columnAlign: "bottom", 
				  
				},
				{
					title : "(%)",
					width : 60,
					columnAlign: "bottom", 
				  
				},
				{
					title : "Margin Revenue",
					width : 140,
					columnAlign: "bottom", 
				},
			],
			buttonStyle:[[5,3],[bsEllips,bsEllips]], 														
			colFormat:[[5,4,3,2],[cfNilai,cfNilai,cfNilai,cfNilai]],					
			columnReadOnly:[true, [5,4,3,2,1,0],[]],		
			rowPerPage:100, autoPaging:true,pasteEnable: false, pager:[this,"doPager3"]});
		var self = this;

		this.sg1P = new saiGrid(this.tab.childPage[3],{bound:[250,40,680,this.tab.height-260],
			colCount: 6,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Orig. Acct",
					width : 70,
					columnAlign: "bottom",		
					freeze : true							
				},
				{
					title : "Nama Akun",
					width : 3,
					columnAlign: "bottom", 
				  
				},
				{
					title : "Revenue ICM",
					width : 140,
					columnAlign: "bottom", 
				  
				},
				{
					title : "Revenue BSPL",
					width : 140,
					columnAlign: "bottom", 
				  
				},
				{
					title : "(%)",
					width : 60,
					columnAlign: "bottom", 
				  
				},
				{
					title : "Margin Revenue",
					width : 140,
					columnAlign: "bottom", 
				},
			],
			buttonStyle:[[5,3],[bsEllips,bsEllips]], 														
			colFormat:[[5,4,3,2],[cfNilai,cfNilai,cfNilai,cfNilai]],					
			columnReadOnly:[true, [5,4,3,2,1,0],[]],	
			rowPerPage:1000, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"]});
		var self = this;

		this.sg2 = new saiGrid(this.tab.childPage[1],{bound:[915,40,360,this.tab.height-260],
			colCount: 5,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Orig. Acct",
					width : 70,
					columnAlign: "bottom"												
				},
				{
					title : "Nama Akun",
					width : 0,
					columnAlign: "bottom", 
				},
				{
					title : "Nilai",
					width : 120,
					columnAlign: "bottom", 
				},
				{
					title : "BACC",
					width : 55,
					columnAlign: "bottom", 
				},
				{
					title : "BATP",
					width : 55,
					columnAlign: "bottom", 
				},
			],
			buttonStyle:[[4,3,2,0],[bsEllips,bsEllips,bsEllips,bsEllips]], 														
			colFormat:[[2],[cfNilai]],					
			columnReadOnly:[true, [4,3,2,1,0],[]],	
			rowperpage:1000, autoPaging:true,pasteEnable: false, pager:[this,"doPager3"]});
		var self = this;

		this.sg2P = new saiGrid(this.tab.childPage[3],{bound:[925,40,330,this.tab.height-260],
			colCount: 3,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Orig. Acct",
					width : 70,
					columnAlign: "bottom"												
				},
				{
					title : "Nama Akun",
					width : 0,
					columnAlign: "bottom", 
				},
				{
					title : "Nilai",
					width : 160,
					columnAlign: "bottom", 
				},
			],
			buttonStyle:[[0,2],[bsEllips,bsEllips]], 														
			colFormat:[[2],[cfNilai]],					
			columnReadOnly:[true, [2,1,0],[]],	
			rowperpage:1000, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"]});
		var self = this;	

		this.sg3 = new saiGrid(this.tab.childPage[1],{bound:[10,355,this.tab.width-40,this.tab.height-210],
			colCount: 18,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Akun ADK",
					width : 70,
					columnAlign: "bottom"
				},
				{
					title : "Jenis Rekon",
					width : 60,
					columnAlign: "bottom", 
				},
				{
					title : "Transaksi",
					width : 125,
					columnAlign: "bottom", 	  
				},
				{
					title : "Nama Aset",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Akun Reklas",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Kelompok Aset",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Tgl Perolehan (YYYY/MM/DD)",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "BA CC",
					width : 50,
					columnAlign: "bottom", 	  
				},
				{
					title : "BA TP",
					width : 50,
					columnAlign: "bottom", 	  
				},
				{
					title : "Periode Susut",
					width : 60,
					columnAlign: "bottom", 	  
				},
				{
					title : "Umur (Bulan)",
					width : 50,
					columnAlign: "bottom", 	  
				},
				{
					title : "Margin",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Nilai Aset </br> (BA REKON)",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "AP",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "BP",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Depresiasi Per Bln",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Keterangan",
					width : 130,
					columnAlign: "bottom", 	  
				},
				{
					title : "NO.Aset",
					width : 0,
					columnAlign: "bottom", 	  
				},
			],
			buttonStyle:[[10,9,6,5,4,0],[bsEllips,bsEllips,bsEllips,bsEllips,bsEllips,bsEllips]], 					
			// picklist:[[2,1],[
			// 	new arrayMap({items:["Jual Beli Aset","Jual Beli Inventory","BDC"]}),
			// 	new arrayMap({items:["ASET","INVEN","BDC"]}),
			// ]],	
			colFormat:[[15,14,13,12,11,10],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],	
			columnReadOnly:[true, [15,12,11,10,9,8,7,2,1,0],[16,14,13,6,5,4,3]],
			// columnReadOnly:[true, [11,10,2,1],[15,14,13,12,9,8,7,6,5,4,3,0]],	
			rowperpage:1000, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"]});
		var self = this;

		this.sg3P = new saiGrid(this.tab.childPage[3],{bound:[10,355,this.tab.width-40,this.tab.height-210],
			colCount: 18,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Akun ADK",
					width : 70,
					columnAlign: "bottom"
				},
				{
					title : "Jenis Rekon",
					width : 60,
					columnAlign: "bottom", 
				},
				{
					title : "Transaksi",
					width : 125,
					columnAlign: "bottom", 	  
				},
				{
					title : "Nama Aset",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Akun Reklas",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Kelompok Aset",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Tgl Perolehan (YYYY/MM/DD)",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "BA CC",
					width : 50,
					columnAlign: "bottom", 	  
				},
				{
					title : "BA TP",
					width : 50,
					columnAlign: "bottom", 	  
				},
				{
					title : "Periode Susut",
					width : 60,
					columnAlign: "bottom", 	  
				},
				{
					title : "Umur (Bulan)",
					width : 50,
					columnAlign: "bottom", 	  
				},
				{
					title : "Margin",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Nilai Aset </br> (BA REKON)",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "AP",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "BP",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Depresiasi Per Bln",
					width : 100,
					columnAlign: "bottom", 	  
				},
				{
					title : "Keterangan",
					width : 130,
					columnAlign: "bottom", 	  
				},
				{
					title : "NO.Aset",
					width : 0,
					columnAlign: "bottom", 	  
				},
			],
			buttonStyle:[[10,5,4,2,1,0],[bsEllips,bsEllips,bsEllips,bsAuto,bsAuto,bsEllips]], 					
			picklist:[[2,1],[
				new arrayMap({items:["Jual Beli Aset","Jual Beli Inventory","BDC"]}),
				new arrayMap({items:["ASET","INVEN","BDC"]}),
			]],	
			colFormat:[[15,14,13,12,11,10],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],					
			columnReadOnly:[true, [15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],[]],	
			// columnReadOnly:[true, [11,10,2,1],[15,14,13,12,9,8,7,6,5,4,3,0]],	
			rowperpage:1000, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"]});
		var self = this;

		this.sg3.on("entrySearch", function(col, row, value, fn){
			if (value.length > 0) {
				if (self.myTimeExecSearch){
					clearTimeout(self.myTimeExecSearch);
				}
				self.myTimeExecSearch = setTimeout( function(){
					if (col == 0) {
						self.app.services.callServices("financial_BsplMaster","autoCompleteAkunAset",[value, self.cc_icm, "  "], function(data){
							if (typeof data.rs.rows != 'undefined' && data.rs.rows != null && data.rs.rows.length != 0){
								fn(data);			
								self.createJurnal();											
							}else{
								system.alert(self, "Data Akun tidak ditemukan");
								self.sg3.setCell(col, row, '');	
							}
						});
					}else if (col == 4) {
						if (value.length > 4) {	
							if(self.akunReklas.indexOf(value) != -1){  
								
							}else{
								var isValidAct = new Promise((resolve, reject)=>{
									self.app.services.callServices("financial_BsplMaster","autoCompleteAkunADK",[self.sg3.cells(0,row), " ",self.cc_icm], function(data){
										if(data.rs.rows.length > 0){
											var akun_adk_db = data.rs.rows[0].akun_aset;
											resolve(akun_adk_db);
										}else{
											self.sg3.setCell(4, row, '');
											system.alert(self, "Akun aset "+ value +" untuk ADK " + self.sg3.cells(0,row) + " tidak ditemukan");
										}
									});				
								});																
								isValidAct.then((akun_adk_db)=>{
									//jika akun aset = '-' maka akun aset nya bebas selama ada di coa cc tersebut
									if(akun_adk_db == '-'){
										if(self.akunAset.indexOf(value) != -1){  
											if(value.match(/1319.*/) || value.match(/1320.*/)){
												self.sg3.setCell(4, row, '');
												system.alert(self, "Akun reklas aset tidak boleh diisi dengan akun ADK ("+ value +") ");
											}else{
												// if (self.aset_reklas_icm.includes(value) != true){
												// 	system.alert(self, "Akun aset " + value + " tidak termasuk dalam daftar aset pada icm");
												// 	self.sg3.setCell(col, row, '-');	
												// }else{
													self.akunReklas.push(value);					
													self.sg3.setCell(4, row, value);													
													self.createJurnal();
												// }
											}
										}else{
											self.sg3.setCell(4, row, '');
											system.alert(self, "Akun aset "+ value +" untuk ADK " + self.sg3.cells(0,row) + " tidak ditemukan");
										}
									}else{
										//jika bukan = '-' maka cari di db
										self.app.services.callServices("financial_BsplMaster","autoCompleteAkunADK",[value, " and akun_adk = '" + self.sg3.cells(0,row) + "' ",self.cc_icm], function(data){
											if(data.rs.rows.length > 0){
												fn(data);
											}else{
												self.sg3.setCell(4, row, '');
												system.alert(self, "Akun aset "+ value +" untuk ADK " + self.sg3.cells(0,row) + " tidak ditemukan");
											}
										});	
									}
								});
							}
						}
					}else if (col == 5) {
						if (value.length > 4) {						
							self.app.services.callServices("financial_BsplMaster","autoCompleteKlpAset",[value, " and akun_aset = '" + self.sg3.cells(4,row) + "' "], function(data){
								if(data.rs.rows.length > 0){
									fn(data);
								}else{
									self.sg3.setCell(5, row, '');
									system.alert(self, "Kelompok aset "+ value +" untuk aset " + self.sg3.cells(4,row) + " tidak ditemukan");
								}
							});
						}
					}else if (col == 6) {
						var today = new Date();
						var dd = String(today.getDate()).padStart(2, '0');
						var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
						var yyyy = today.getFullYear();

						var thn_tgl_perolehan = value.substr(0, 4);						
						var bln_tgl_perolehan = value.substr(5, 2);	
						var dd_tgl_perolehan = value.substr(8, 2);	

						var thn_filter = self.fPeriodef.getText().substr(0, 4);						
						var bln_filter = self.fPeriodef.getText().substr(4, 6);

						var periode_filter = thn_filter + bln_filter;

						var thn_icm = self.fPeriode.getText().substr(0, 4);						
						var bln_icm = self.fPeriode.getText().substr(4, 6);

						var periode_tgl_perolehan = thn_tgl_perolehan + bln_tgl_perolehan;	
						var periode_icm = thn_icm + bln_icm;
						var periode_today = yyyy + mm;		
						
						var tgl_perolehan_hitung = thn_tgl_perolehan + bln_tgl_perolehan + dd_tgl_perolehan;
						var tgl_icm_hitung = thn_icm + bln_icm + '00';
						var tgl_today_hitung = yyyy + mm + dd;

						console.log("</br>");
						console.log("value " + value);
						console.log("thn_tgl_perolehan " + thn_tgl_perolehan);
						console.log("bln_tgl_perolehan " + bln_tgl_perolehan);
						console.log("thn_icm " + thn_icm);
						console.log("bln_icm " + bln_icm);
						console.log("periode_tgl_perolehan " + periode_tgl_perolehan);
						console.log("periode_icm " + periode_icm);
						console.log("periode_today " + periode_today);
						console.log("tgl_perolehan_hitung " + tgl_perolehan_hitung);
						console.log("tgl_icm_hitung " + tgl_icm_hitung);
						console.log("tgl_today_hitung " + tgl_today_hitung);
						console.log("tahun filter " + thn_filter);
						console.log("bln filter " + bln_filter);
						console.log("periode filter" + periode_filter);
						console.log("</br>");						
						
						// if(tgl_perolehan_hitung > tgl_today_hitung){
						// 	system.alert(self, "Tanggal perolehan (" + value + ") tidak boleh lebih tinggi dari periode hari ini, yaitu " + yyyy + '/' + mm + '/' + dd);
						// 	self.sg3.setCell(6, row, thn_filter + '/' + bln_filter + '/' + new Date(thn_filter, bln_filter, 0).getDate());	
						// }

						// alert(periode_tgl_perolehan  + " > " + periode_filter);
						// alert(thn_tgl_perolehan  + " = " + thn_filter);

						if(periode_tgl_perolehan > periode_filter){
							system.alert(self, "Periode Tanggal perolehan (" + periode_tgl_perolehan + ") tidak boleh lebih tinggi dari periode input, yaitu " + periode_filter);
							self.sg3.setCell(6, row, thn_filter + '/' + bln_filter + '/' + new Date(thn_filter, bln_filter, 0).getDate());	
						}

						if(thn_tgl_perolehan != thn_filter){
							system.alert(self, "Tahun Tanggal perolehan (" + thn_tgl_perolehan + ") harus sama dengan tahun input, yaitu " + thn_filter);
							self.sg3.setCell(6, row, thn_filter + '/' + bln_filter + '/' + new Date(thn_filter, bln_filter, 0).getDate());	
						}
					}else if (col == 9) {
						var today = new Date();
						var dd = String(today.getDate()).padStart(2, '0');
						var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
						var yyyy = today.getFullYear();

						var thn_periode_susut = value.substr(0, 4);						
						var bln_periode_susut = value.substr(4, 2);	

						var thn_tgl_perolehan = self.sg3.cells(6,row).substr(0, 4);						
						var bln_tgl_perolehan = self.sg3.cells(6,row).substr(5, 2);

						var thn_filter = self.fPeriodef.getText().substr(0, 4);						
						var bln_filter = self.fPeriodef.getText().substr(4, 6);

						var periode_filter = thn_filter + bln_filter;

						var thn_icm = self.fPeriode.getText().substr(0, 4);						
						var bln_icm = self.fPeriode.getText().substr(4, 2);

						var periode_susut = value;	
						var periode_tgl_perolehan = thn_tgl_perolehan + bln_tgl_perolehan;	
						var periode_icm = thn_icm + bln_icm;
						var periode_today = yyyy + mm;
						
						if(thn_periode_susut != thn_tgl_perolehan){
							system.alert(self, "Tahun pada periode susut (" + thn_periode_susut + ") harus sama dengan tahun pada tanggal perolehan (" + thn_tgl_perolehan + ")");	
							self.sg3.setCell(9, row, thn_filter + bln_filter);					
						}

						if(periode_susut < periode_tgl_perolehan){
							system.alert(self, "Periode susut (" + periode_susut + ") tidak boleh lebih kecil daripada periode pada tanggal perolehan (" + periode_tgl_perolehan + ")");
							self.sg3.setCell(9, row, thn_filter + bln_filter);
						}

						if(thn_periode_susut != thn_filter){
							system.alert(self, "Tahun Periode Susut (" + thn_periode_susut + ") harus sama dengan tahun input, yaitu " + thn_filter);
							self.sg3.setCell(6, row, thn_filter + '/' + bln_filter + '/' + new Date(thn_filter, bln_filter, 0).getDate());	
						}
					}else if (col == 10) {
						var today = new Date();
						var dd = String(today.getDate()).padStart(2, '0');
						var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
						var yyyy = today.getFullYear();
						var today_date = yyyy + '/' + mm + '/' + dd;

						//set depresiasi per bln
						if(isFinite(Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(value))) == false || isFinite(Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(value))) == "false"){
							var nilai_dep = 0;
						}else{
							var nilai_dep = Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(value));
						}
						self.sg3.setCell(15, row, nilai_dep);	

						self.createJurnal();						
					}else if(col == 12){
						// set total nilai aset ba rekon
						var total_nilast = 0;
						for(i=0;i < self.sg3.getRowCount();i++){
							if(row == i){
								var nilast_row = parseFloat(value);								
							}else{
								if(self.sg3.cells(12,i) != null && self.sg3.cells(12,i) != ''){
									var nilast_row = parseFloat(self.sg3.cells(12,i));
								}else{
									var nilast_row = 0;									
								}
							}
							total_nilast = Number(total_nilast) + Number(nilast_row);
						}													

						if(total_nilast > self.total_nilai_ba_rekon_awal){
							// for(i=0;i < self.sg3.getRowCount();i++){
							// 	self.sg3.setCell(5, i, self.nilai_aset_ba[i]);
							// }
							system.alert(self, "total nilai aset " + floatToNilai(total_nilast) + " tidak boleh melebihi total nilai aset BA Rekon " + floatToNilai(self.total_nilai_ba_rekon_awal));
						}else{
							var total_rev = 0;
							for(i=0;i < self.sg1.getRowCount();i++){
								if(self.sg1.cells(5,i) == ''){
									var margin_row = 0;
								}else{
									var margin_row = Number(parseFloat(self.sg1.cells(5,i)));								
								}
								total_rev = Number(total_rev) + Number(margin_row);
							}
							// self.fMargin.setText(total_rev);
							
							//set proporsi margin
							// console.log("proporse");
							for(i=0;i < self.sg3.getRowCount();i++){		
								if(row == i){
									var proporsi_margin = Math.round(Number(value)/Number(total_nilast)*Number(total_rev));
								}else{
									var proporsi_margin = Math.round(parseFloat(self.sg3.cells(12,i))/Number(total_nilast)*Number(total_rev))
								}
								self.sg3.setCell(10, i, proporsi_margin);								
								//depresiasi
								if(isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(10,i)))) == false || isFinite(Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(self.sg3.cells(10,i)))) == "false"){
									var nilai_dep = 0;
								}else{
									var nilai_dep = Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(self.sg3.cells(10,row)));
								}
								self.sg3.setCell(13, row, nilai_dep);
							}	

							self.createJurnal();							
						}
					}
				}, 500);
			}
		});
		this.sg3.on("selectRow", function(col, row, value, data){
			if (col == 0){
				self.sg3.setCell(col, row, data[0]);
				self.sg3.setCell(col + 1, row, data[1]);	
			}else if (col == 1){
				self.sg3.setCell(col, row, data[0]);
			}else if (col == 4){
				console.log("test aset icm");
				console.log(self.aset_reklas_icm);
				// if (self.aset_reklas_icm.includes(data[1]) != true){
				// 	system.alert(self, "Akun aset " + data[1] + " tidak termasuk dalam daftar aset pada icm");
				// 	self.sg3.setCell(col, row, '-');	
				// }else{
					self.sg3.setCell(col, row, data[1]);
					self.akunReklas.push(data[1]);	
					console.log(self.akunReklas);						
					self.createJurnal();
				// }
			}else if (col == 5){
				self.sg3.setCell(col, row, data[0]);
				self.sg3.setCell(col+5, row, data[2]);
				
				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				var today_date = yyyy + '/' + mm + '/' + dd;

				//set depresiasi per bln
				console.log('nilai dep');
				console.log(Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(data[2])));
				if(isFinite(Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(data[2]))) == false || isFinite(Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(data[2]))) == "false"){
					var nilai_dep = 0;
				}else{
					var nilai_dep = Math.round(parseFloat(self.sg3.cells(11,row))/parseFloat(data[2]));
				}
				console.log(nilai_dep);
				self.sg3.setCell(15, row, nilai_dep);	

				self.createJurnal();
			}
		});

		this.sg4 = new saiGrid(this.tab.childPage[1],{bound:[10,690,this.tab.width-40,this.tab.height-150],
			colCount: 9,
			headerHeight: 50,			
			colTitle: ["ICM","DR/CR","POST KEY","TGL JURNAL","KODE AKUN","NAMA AKUN","DEBET","KREDIT","KETERANGAN"],
			colWidth:[[8,7,6,5,4,3,2,1,0],[180,150,150,150,100,150,70,50,100]],
			buttonStyle:[[4],[bsEllips]], 																	
			colFormat:[[7,6],[cfNilai,cfNilai]],
			columnReadOnly:[true, [0,1,2,3,5],[4,6,7,8]],		
            rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]
		});

		this.sg4P = new saiGrid(this.tab.childPage[3],{bound:[10,690,this.tab.width-40,this.tab.height-150],
			colCount: 9,
			headerHeight: 50,			
			colTitle: ["ICM","DR/CR","POST KEY","TGL JURNAL","KODE AKUN","NAMA AKUN","DEBET","KREDIT","KETERANGAN"],
			colWidth:[[8,7,6,5,4,3,2,1,0],[180,150,150,150,100,150,70,50,100]],
			buttonStyle:[[4],[bsEllips]], 																	
			colFormat:[[7,6],[cfNilai,cfNilai]],
			columnReadOnly:[true, [0,1,2,3,5],[4,6,7,8]],		
            rowPerPage:100, autoPaging:true, pager:[this,"doPager3"]
		});

		this.sg4.on("entrySearch", function(col, row, value, fn){
			if (value.length > 0) {
				if (self.myTimeExecSearch){
					clearTimeout(self.myTimeExecSearch);
				}
				self.myTimeExecSearch = setTimeout( function(){
					if (col == 3) {
						self.app.services.callServices("financial_BsplMaster","autoCompleteAkun",[value, "  "], function(data){
							fn(data);
						});
					}
				}, 500);
			}
		});
		this.sg4.on("selectRow", function(col, row, value, data){
			if (col == 0){
				self.sg4.setCell(col, row, data[0]);
				self.sg4.setCell(col + 1, row, data[1]);				
			}
		});

		// this.container.rearrangeChild(10, 50);
        
        this.bSubmit = new button(this.container,{bound:[110,0,80,25],icon:"<i class='fa fa-save' style='color:white'></i>", caption:"Reklas", click: [this, "doClick"]});	

        this.bSaveAsDraft = new button(this.container,{bound:[200,0,110,25],icon:"<i class='fa fa-envelope-open' style='color:white'></i>", caption:"Save as Draft", click: [this, "doClick"]});	

        this.bExportKKP = new button(this.container,{bound:[this.width-220,0,180,20],icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export Xls KKP HPP (COGS)", click: [this, "doClick"]});		
        
        // this.bGenJur = new button(this.container,{bound:[this.width-420,0,180,20],icon:"<i class='fa fa-retweet' style='color:white'></i>", caption:"Regenerate Jurnal", click: [this, "doClick"]});
	
		this.setTabChildIndex();
		try {
			this.akunReklas = [];   
			var self = this;
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			var periode = yyyy + mm;
			self.bSubmit.hide();								
			self.bSaveAsDraft.hide();

			if(mm == '01'){
				self.fPeriodef.setText((yyyy-1) + '12');
			}else{
				self.fPeriodef.setText(Number(periode)-1);
			}
			
			self.fRev.setText(0);											
			self.fRevBSPL.setText(0);											
			self.fNilAst.setText(0);											
			self.fCogs.setText(0);											
			self.fMargin.setText(0);	
			self.fPersenMargin.setText(0);	
			// self.cbJenis.setText("Jual Beli Aset");   
			self.sg2.clear(1);
			self.nilai_aset_ba = [];
			self.aset_reklas_icm = [];
			self.nilai_aset_ba[0] = 0;
			self.loadICMBSPL();
            this.sg1.hideNavigator();			
            this.sg3.hideNavigator();			
			this.fCOCD.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
			this.fTP.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
			// self.loadReport();	
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSRekAdk.extend(window.childForm);
window.app_saku_modul_fBSRekAdk.implement({
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
	mainButtonClick: function(sender){
		if (sender == this.app._mainForm.bClear)
			system.confirm(this, "clear", "screen akan dibersihkan?","form inputan ini akan dibersihkan");
		if (sender == this.app._mainForm.bSimpan)
			system.confirm(this, "simpan", "Apa data sudah benar?","data diform ini apa sudah benar.");
		if (sender == this.app._mainForm.bEdit)
			system.confirm(this, "ubah", "Apa perubahan data sudah benar?","perubahan data diform ini akan disimpan.");
		if (sender == this.app._mainForm.bHapus)
			system.confirm(this, "hapus", "Yakin data akan dihapus?","data diform ini apa sudah benar.");
	},
	doClick: function(sender){
		if(sender == this.bExportKKP){
			this.doExportKKP();
		}else if(sender == this.bSearch){
			this.loadReport();
		}else if(sender == this.bSearchf){
			this.loadICMBSPL();
		}else if(sender == this.bGenJur){
			this.reGenerateJurnal();
		}else if(sender == this.bSubmit){
			this.simpan();
		}else if(sender == this.bSaveAsDraft){
			this.saveAsDraft();
		}
	},
	createJurnal: function(){
		var self = this;
		self.sg4.clear(0);	
		
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var today_date = yyyy + '/' + mm + '/' + dd;
		var periode = yyyy + mm;
		var quarter = Math.floor((today.getMonth() + 3) / 3);
		var yyyy_ket = yyyy;
		if(quarter == 1){
			yyyy_ket = yyyy-1;
		}
		
		//loop data aset
		var tot_j_rev = 0;
		var tot_j_cogs = 0;
		var tot_margin_rev = 0;
		var tot_margin_tax = 0;

		//jurnal reklas rev
		var jurnal_reklas_rev_array = [];		
		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(11,i) > 0){
				var items = {
					icm : self.fICM.getText(),
					dc : 'D',
					post_key : '40',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(0,i),
					nama_akun : self.sg3.cells(3,i),
					debet : parseFloat(self.sg3.cells(11,i)),
					kredit : 0,
					keterangan : 'REKLAS MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_REV',
					jenis_akun : 'ASET_ADK',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(0,i),
					acct_coa : '-'
				}	
			}else{
				var items = {
					icm : self.fICM.getText(),
					dc : 'C',
					post_key : '50',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(0,i),
					nama_akun : self.sg3.cells(3,i),
					debet : 0,
					kredit : -1*parseFloat(self.sg3.cells(11,i)),
					keterangan : 'REKLAS MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_REV',
					jenis_akun : 'ASET_ADK',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(0,i),
					acct_coa : '-'
				}	
			}
			jurnal_reklas_rev_array.push(items);			
		}							
		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(11,i) > 0){
				var items = {
					icm : self.fICM.getText(),
					dc : 'C',
					post_key : '50',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(4,i),
					nama_akun : self.sg3.cells(3,i),
					debet : 0,
					kredit : parseFloat(self.sg3.cells(11,i)),
					keterangan : 'REKLAS MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_REV',
					jenis_akun : 'ASET_REKLAS',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(4,i),
					acct_coa : '-'
				}	
			}else{
				var items = {
					icm : self.fICM.getText(),
					dc : 'D',
					post_key : '40',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(4,i),
					nama_akun : self.sg3.cells(3,i),
					debet : -1*parseFloat(self.sg3.cells(11,i)),
					kredit : 0,
					keterangan : 'REKLAS MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_REV',
					jenis_akun : 'ASET_REKLAS',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(4,i),
					acct_coa : '-'
				}	
			}
			jurnal_reklas_rev_array.push(items);			
		}
		jurnal_reklas_rev_array.sort((a,b) => (a.dc < b.dc) ? 1 : ((b.dc < a.dc) ? -1 : 0));

		var tot_j_cogs = 0;
		for(i=0;i < self.sg2.getRowCount();i++){
			if(self.sg2.cells(2,i) != 0){								
				tot_j_cogs = tot_j_cogs + parseFloat(self.sg2.cells(2,i));									
			}
		}
		
		//jurnal reklas cogs
		var jurnal_reklas_cogs_array = [];									
		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(11,i) > 0){
				var items = {
					icm : self.fICM.getText(),
					dc : 'D',
					post_key : '40',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(4,i),
					nama_akun : self.sg3.cells(3,i),
					debet : parseFloat(self.sg3.cells(11,i))/parseFloat(self.tot_margin_aset)*tot_j_cogs,
					kredit : 0,
					keterangan : 'REKLAS COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_COGS',
					jenis_akun : 'ASET_REKLAS',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(4,i),
					acct_coa : '-'
				}	
			}else{
				var items = {
					icm : self.fICM.getText(),
					dc : 'C',
					post_key : '50',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(4,i),
					nama_akun : self.sg3.cells(3,i),
					debet : 0,
					kredit : parseFloat(self.sg3.cells(11,i))/parseFloat(self.tot_margin_aset)*tot_j_cogs,
					keterangan : 'REKLAS COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_COGS',
					jenis_akun : 'ASET_REKLAS',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(4,i),
					acct_coa : '-'
				}	
			}
			jurnal_reklas_cogs_array.push(items);			
		}
		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(11,i) > 0){
				var items = {
					icm : self.fICM.getText(),
					dc : 'C',
					post_key : '50',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(0,i),
					nama_akun : self.sg3.cells(3,i),
					debet : 0,
					kredit : parseFloat(self.sg3.cells(11,i))/parseFloat(self.tot_margin_aset)*tot_j_cogs,
					keterangan : 'REKLAS COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_COGS',
					jenis_akun : 'ASET_ADK',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(0,i),
					acct_coa : '-'
				}	
			}else{
				var items = {
					icm : self.fICM.getText(),
					dc : 'D',
					post_key : '40',
					tgl_jurnal : today_date,
					kode_akun : self.sg3.cells(0,i),
					nama_akun : self.sg3.cells(3,i),
					debet : parseFloat(self.sg3.cells(11,i))/parseFloat(self.tot_margin_aset)*tot_j_cogs,
					kredit : 0,
					keterangan : 'REKLAS COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
					jenis_jurnal : 'REKLAS_COGS',
					jenis_akun : 'ASET_ADK',
					cc : self.cc_icm,
					tp : self.tp_icm,
					orig_acct : self.sg3.cells(0,i),
					acct_coa : '-'
				}	
			}
			jurnal_reklas_cogs_array.push(items);			
		}
		jurnal_reklas_cogs_array.sort((a,b) => (a.dc < b.dc) ? 1 : ((b.dc < a.dc) ? -1 : 0));

		//insert sg jurnal
		for(i=0;i<jurnal_reklas_rev_array.length;i++){
			self.sg4.addRowValues([
				jurnal_reklas_rev_array[i].icm,
				jurnal_reklas_rev_array[i].dc,
				jurnal_reklas_rev_array[i].post_key,
				jurnal_reklas_rev_array[i].tgl_jurnal,
				jurnal_reklas_rev_array[i].kode_akun,
				jurnal_reklas_rev_array[i].nama_akun,
				jurnal_reklas_rev_array[i].debet,
				jurnal_reklas_rev_array[i].kredit,
				jurnal_reklas_rev_array[i].keterangan
			]);
		}
		for(i=0;i<jurnal_reklas_cogs_array.length;i++){
			self.sg4.addRowValues([
				jurnal_reklas_cogs_array[i].icm,
				jurnal_reklas_cogs_array[i].dc,
				jurnal_reklas_cogs_array[i].post_key,
				jurnal_reklas_cogs_array[i].tgl_jurnal,
				jurnal_reklas_cogs_array[i].kode_akun,
				jurnal_reklas_cogs_array[i].nama_akun,
				jurnal_reklas_cogs_array[i].debet,
				jurnal_reklas_cogs_array[i].kredit,
				jurnal_reklas_cogs_array[i].keterangan
			]);
		}

		//jurnal pajak margin
		var jurnal_pajak_array = [];				
		var isValidAct = new Promise((resolve, reject)=>{
			self.app.services.callServices("financial_BsplMaster", "getDataParamAkunJTax", [self.app._lokasi,self.tp_icm], (data) => {
				if (typeof data != 'undefined' && data != null){
					self.akun_beban_pajak = data.BTX;
					self.nama_beban_pajak = data.BTX_desc;	
					self.akun_utang_pajak = data.UTX;
					self.nama_utang_pajak = data.UTX_desc;
					self.tarif_pajak = data.tarif;
					resolve(data);																		
				}			
			});
		});				

		isValidAct.then((data)=>{        
			if(self.akun_beban_pajak == 'undefined' || typeof self.akun_beban_pajak == 'undefined' || self.akun_beban_pajak == undefined || typeof self.akun_beban_pajak == undefined){
				self.akun_beban_pajak = '';
				self.nama_beban_pajak = '';
			}
			if(self.akun_utang_pajak == 'undefined' || typeof self.akun_utang_pajak == 'undefined' || self.akun_utang_pajak == undefined || typeof self.akun_utang_pajak == undefined){
				self.akun_utang_pajak = '';
				self.nama_utang_pajak = '';
			}
			if(self.tarif_pajak == 'undefined' || typeof self.tarif_pajak == 'undefined' || self.tarif_pajak == undefined || typeof self.tarif_pajak == undefined){
				self.tarif_pajak = 0;
			}

			for(i=0;i < self.sg3.getRowCount();i++){
				if(self.sg3.cells(11,i) != 0 && self.sg3.cells(2,i) == 'Jual Beli Aset'){
					if(self.sg3.cells(11,i) > 0){
						var akun_debet = self.akun_utang_pajak;
						var nama_debet = self.nama_utang_pajak;
						var akun_kredit = self.akun_beban_pajak;
						var nama_kredit = self.nama_beban_pajak;
						var nilai_pajak = Math.round(parseFloat(self.sg3.cells(11,i))*parseFloat(self.tarif_pajak)/100);
						var jenis_akun_debet = 'UTX'
						var jenis_akun_kredit = 'BTX'
					}else{
						var akun_debet = self.akun_beban_pajak;
						var nama_debet = self.nama_beban_pajak;
						var akun_kredit = self.akun_utang_pajak;
						var nama_kredit = self.nama_utang_pajak;
						var nilai_pajak = Math.round(-1*parseFloat(self.sg3.cells(11,i))*parseFloat(self.tarif_pajak)/100);
						var jenis_akun_debet = 'BTX'
						var jenis_akun_kredit = 'UTX'
					}			
				}
				if(nilai_pajak > 0){
					var items = {
						icm : self.fICM.getText(),
						dc : 'D',
						post_key : '40',
						tgl_jurnal : today_date,
						kode_akun : akun_debet,
						nama_akun : nama_debet,
						debet : nilai_pajak,
						kredit : 0,
						keterangan : 'PAJAK MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
						jenis_jurnal : 'PAJAK_REKLAS',
						jenis_akun : jenis_akun_debet,
						cc : self.tp_icm,
						tp : self.cc_icm,
						orig_acct : akun_debet,
						acct_coa : akun_debet
					}
					jurnal_pajak_array.push(items);	

					var items = {
						icm : self.fICM.getText(),
						dc : 'C',
						post_key : '50',
						tgl_jurnal : today_date,
						kode_akun : akun_kredit,
						nama_akun : nama_kredit,
						debet : 0,
						kredit : nilai_pajak,
						keterangan : 'PAJAK MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
						jenis_jurnal : 'PAJAK_REKLAS',
						jenis_akun : jenis_akun_kredit,
						cc : self.tp_icm,
						tp : self.cc_icm,
						orig_acct : akun_kredit,
						acct_coa : akun_kredit
					}
					jurnal_pajak_array.push(items);	
				}
			}
			self.jurnal_pajak_array = jurnal_pajak_array;	

			// for(i=0;i<jurnal_pajak_array.length;i++){
			// 	self.sg4.addRowValues([
			// 		jurnal_pajak_array[i].icm,
			// 		jurnal_pajak_array[i].dc,
			// 		jurnal_pajak_array[i].post_key,
			// 		jurnal_pajak_array[i].tgl_jurnal,
			// 		jurnal_pajak_array[i].kode_akun,
			// 		jurnal_pajak_array[i].nama_akun,
			// 		jurnal_pajak_array[i].debet,
			// 		jurnal_pajak_array[i].kredit,
			// 		jurnal_pajak_array[i].keterangan
			// 	]);
			// }
			self.jurnal_pajak_array = jurnal_pajak_array;		                
			console.table(jurnal_pajak_array);
		});	
		// console.log(jurnal_rev_array);
		// console.log(jurnal_cogs_array);
		// console.log(jurnal_pajak_array);

        self.jurnal_reklas_rev_array = jurnal_reklas_rev_array;
        self.jurnal_reklas_cogs_array = jurnal_reklas_cogs_array;
        self.jurnal_pajak_array = jurnal_pajak_array;		
	},
	doExportKKP: function(){
		var self = this;
		var tipe_ledger = '';
		if(self.cboxPSAK.selected == true && self.cboxIFRS.selected == true){
			var tipe_ledger = 'DOUBLE';
		}else if(self.cboxPSAK.selected == true && self.cboxIFRS.selected == false){
			var tipe_ledger = 'PSAK';
		}else if(self.cboxPSAK.selected == false && self.cboxIFRS.selected == true){
			var tipe_ledger = 'IFRS';
		}
		var data_rev = [];
		for(i=0;i < self.sg1.getRowCount();i++){
			var items = {
				orig_acct : self.sg1.cells(0,i),
				acct_coa : '-',
				rev_icm : self.sg1.cells(2,i),
				rev_bspl : self.sg1.cells(3,i),
				pmargin : self.sg1.cells(4,i),
				margin : self.sg1.cells(5,i)
			}
			data_rev.push(items);
		}
		var data_cogs = [];
		for(i=0;i < self.sg2.getRowCount();i++){
			var items = {
				orig_acct : self.sg2.cells(0,i),
				acct_coa : '-',
				nilai : self.sg2.cells(2,i)
			}
			data_cogs.push(items);
		}
		var data_aset = [];
		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(13,i) == '' || self.sg3.cells(13,i) == null || self.sg3.cells(13,i) == undefined){
				var ap_simpan = 0;
			}else{
				var ap_simpan = self.sg3.cells(13,i);										
			}
			if(self.sg3.cells(14,i) == '' || self.sg3.cells(14,i) == null || self.sg3.cells(14,i) == undefined){
				var bp_simpan = 0;
			}else{
				var bp_simpan = self.sg3.cells(14,i);										
			}
			if(self.sg3.cells(15,i) == '' || self.sg3.cells(15,i) == null || self.sg3.cells(15,i) == undefined || isFinite(self.sg3.cells(15,i)) == false || isFinite(self.sg3.cells(15,i)) == 'false'){
				var dep_per_bln_simpan = 0;
			}else{
				var dep_per_bln_simpan = self.sg3.cells(15,i);										
			}
			var items = {
				icm : self.fICM.getText(),
				periode : self.fPeriode.getText(),
				orig_acct : self.sg3.cells(0,i),
				acct_coa : '-',
				nama : self.sg3.cells(3,i),
				akun_reklas : self.sg3.cells(4,i),
				klp_aset : self.sg3.cells(5,i),
				tgl_perolehan : self.sg3.cells(6,i),
				periode_susut : self.sg3.cells(9,i),
				umur : self.sg3.cells(10,i),
				margin : self.sg3.cells(11,i),
				hp : self.sg3.cells(12,i),
				ap : ap_simpan,
				bp : bp_simpan,
				peny_per_bln : dep_per_bln_simpan,
				keterangan : self.sg3.cells(16,i),
				tipe_ledger : tipe_ledger,
				cc : self.cc_icm,
				tp : self.tp_icm,
				jenis_trans : self.sg3.cells(2,i),
				jenis_rekon : self.sg3.cells(1,i),
				explanation : self.fExp.getText(),			
				bacc : self.sg3.cells(7,i),
				batp : self.sg3.cells(8,i),							
				no_aset : self.sg3.cells(17,i),			
				periode_input : self.fPeriodef.getText()															
			}
			data_aset.push(items);
		}
		var filter = {
			tot_rev : nilaiToFloat(self.fRev.getText()),
			tot_rev_bspl : nilaiToFloat(self.fRevBSPL.getText()),
			tot_cogs : nilaiToFloat(self.fCogs.getText()),
			tot_margin : nilaiToFloat(self.fMargin.getText()),
			tot_persen_margin : nilaiToFloat(self.fPersenMargin.getText()),
			tot_nilai_aset_ba : nilaiToFloat(self.fNilAst.getText()),
			icm : self.fICM.getText(),
			cc : self.cc_icm,
			tp : self.tp_icm,
			jenis_jasa : self.jenis_jasa
		};
		self.showLoading("Export to Xls...");
		this.app.services.callServices("financial_BsplMaster","xlsKKP",[self.app._lokasi,filter,data_aset,data_rev,data_cogs], function(data){
			self.hideLoading();
			window.open("./server/reportDownloader.php?f="+data+"&n="+"KKP_HPP(COGS).xlsx");
		}, function(){
			self.hideLoading();
		});	
    },
	simpan : function(row){
		try{
			try {
                var self = this;
                self.confirm("Confirmation","Yakin Data sudah benar dan akan diSubmit?", function(result){
                    if(self.fICM.getText() != '' || self.fPeriode.getText() != '' ){
						//check box harus pilih salah satu	
						if(self.cboxPSAK.selected == false && self.cboxIFRS.selected == false){
							system.alert(self, "Harap Pilih Tick Mark PSAK atau IFRS");
						}else{
							var total_nilast = 0
							for(i=0;i < self.sg3.getRowCount();i++){
								if(self.sg3.cells(12,i) != 0){								
									total_nilast = parseFloat(total_nilast) + parseFloat(self.sg3.cells(12,i));	
									// console.log(total_nilast +"="+ parseFloat(total_nilast) +"+"+ parseFloat(self.sg3.cells(12,i)));
								}
							}
							//nilai  total aset tidak boleh melebihi total nilai aset ba rekon awal
							// console.log("aset sg 3" + total_nilast);
							// console.log("nilai aset awal" + self.total_nilai_ba_rekon_awal);
							//nilai  total aset tidak boleh melebihi total nilai aset ba rekon awal
							if(total_nilast > self.total_nilai_ba_rekon_awal){
								system.alert(self, "Total Nilai Aset " + floatToNilai(total_nilast) + " tidak boleh melebihi Total Nilai Aset BA Rekon" + floatToNilai(self.total_nilai_ba_rekon_awal));
							}else{
								//nilai total revenue bspl harus = total nilai aset ba rekon
								if(nilaiToFloat(self.fRevBSPL.getText()) > nilaiToFloat(self.fNilAst.getText())){
									system.alert(self, "Total Nilai Revenue BSPL " + floatToNilai(nilaiToFloat(self.fRevBSPL.getText())) + " tidak boleh lebih tinggi dari Total Nilai Aset BA Rekon " + floatToNilai(nilaiToFloat(self.fNilAst.getText())));
								}else{
									//jml margin = nilai aset ba rekon + cogs
									var nilai_aset_ba = 0;
									var tot_cogs = 0;
									var tot_margin_rev = 0;
									for(i=0;i < self.sg2.getRowCount();i++){
										if(self.sg2.cells(2,i) != 0){								
											tot_cogs = parseFloat(tot_cogs) + parseFloat(self.sg2.cells(2,i));									
										}
									}
									for(i=0;i < self.sg3.getRowCount();i++){
										if(self.sg3.cells(12,i) != 0){								
											nilai_aset_ba = parseFloat(nilai_aset_ba) + parseFloat(self.sg3.cells(12,i));
										}
									}
									for(i=0;i < self.sg3.getRowCount();i++){
										if(self.sg3.cells(11,i) != 0){								
											tot_margin_rev = parseFloat(tot_margin_rev) + parseFloat(self.sg3.cells(11,i));	
										}
									}

									// console.log(tot_cogs_v +" + "+ tot_margin_rev_v +" = "+ nilai_aset_ba_v);
									if((Number(tot_margin_rev) + Number(nilaiToFloat(self.fCogs.getText()))) > Number(nilaiToFloat(self.fNilAst.getText()))){
										system.alert(self, "Nilai Penjumlahan Total Margin BSPL " +floatToNilai(Number(tot_margin_rev))+ " ditambah Total COGS " +floatToNilai(nilaiToFloat(self.fCogs.getText()))+ " tidak boleh lebih tinggi dari nilai aset BA Rekon " +floatToNilai(nilaiToFloat(self.fNilAst.getText())));
									}else{
										//jurnal pajak margin
										if(self.status_periode == 'LOCK'){
											system.alert(self, "Periode " + self.fPeriode.getText() + " untuk cocd " + self.fCOCDi.getText() + " sudah di LOCK!");
										}else{
											var stat_akun_reklas = 0;
											var stat_klp_aset = 0;
											var alert_reklas = '';
											var baris = 0;
											for(i=0;i < self.sg3.getRowCount();i++){
												if(self.sg3.cells(4,i) == '-' || self.sg3.cells(4,i) == ''){								
													stat_akun_reklas = 1;
													alert_reklas = alert_reklas + ' Baris ' + baris + ' : Data Akun Reklas masih ada yang kosong <br/>';
												}
												if(self.sg3.cells(5,i) == '-'|| self.sg3.cells(5,i) == ''){								
													stat_klp_aset = 1;	
													alert_reklas = alert_reklas + ' Baris ' + baris + ' : Data Klp Aset masih ada yang kosong <br/>';
												}
												baris++;
											}
											if(stat_akun_reklas == 1 || stat_klp_aset == 1){
												system.alert(self, alert_reklas);
											}else{
												var today = new Date();
												var dd = String(today.getDate()).padStart(2, '0');
												var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
												var yyyy = today.getFullYear();
												var today_date = yyyy + '/' + mm + '/' + dd;
												var periode = yyyy + mm;
												var quarter = Math.floor((today.getMonth() + 3) / 3);
												var yyyy_ket = yyyy;
												if(quarter == 1){
													yyyy_ket = yyyy-1;
												}
												var jurnal_pajak_array = [];				
												var isValidAct = new Promise((resolve, reject)=>{
													self.createJurnal();                         
													
													var tot_margin_tax = 0;
													for(i=0;i < self.sg3.getRowCount();i++){
														if(self.sg3.cells(11,i) != 0 && self.sg3.cells(2,i) == 'Jual Beli Aset'){
															tot_margin_tax = tot_margin_tax + nilaiToFloat(self.sg3.cells(11,i));			
														}
													}
													self.app.services.callServices("financial_BsplMaster", "getDataParamAkunJTax", [self.app._lokasi,self.tp_icm], (data) => {
														console.log(data);
														if (typeof data != 'undefined' && data != null){
															self.akun_beban_pajak = data.BTX;
															self.nama_beban_pajak = data.BTX_desc;	
															self.akun_utang_pajak = data.UTX;
															self.nama_utang_pajak = data.UTX_desc;
															self.tarif_pajak = data.tarif;
															data.tot_margin_tax = tot_margin_tax;
															resolve(data);																		
														}			
													});
												});			
												isValidAct.then((data)=>{      
													if(self.akun_beban_pajak == 'undefined' || typeof self.akun_beban_pajak == 'undefined' || self.akun_beban_pajak == undefined || typeof self.akun_beban_pajak == undefined){
														self.akun_beban_pajak = '';
														self.nama_beban_pajak = '';
													}
													if(self.akun_utang_pajak == 'undefined' || typeof self.akun_utang_pajak == 'undefined' || self.akun_utang_pajak == undefined || typeof self.akun_utang_pajak == undefined){
														self.akun_utang_pajak = '';
														self.nama_utang_pajak = '';
													}
													if(self.tarif_pajak == 'undefined' || typeof self.tarif_pajak == 'undefined' || self.tarif_pajak == undefined || typeof self.tarif_pajak == undefined){
														self.tarif_pajak = 0;
													}
													self.pajak_margin = Math.round(self.tarif_pajak/100*parseFloat(data.tot_margin_tax));
													
													if(self.pajak_margin > 0){
														var akun_debet = self.akun_utang_pajak;
														var nama_debet = self.nama_utang_pajak;
														var akun_kredit = self.akun_beban_pajak;
														var nama_kredit = self.nama_beban_pajak;
														var nilai_pajak = self.pajak_margin;
														var jenis_akun_debet = 'UTX'
														var jenis_akun_kredit = 'BTX'
													}else{
														var akun_debet = self.akun_beban_pajak;
														var nama_debet = self.nama_beban_pajak;
														var akun_kredit = self.akun_utang_pajak;
														var nama_kredit = self.nama_utang_pajak;
														var nilai_pajak = -1*self.pajak_margin;
														var jenis_akun_debet = 'BTX'
														var jenis_akun_kredit = 'UTX'
													}
													if(nilai_pajak > 0){
														var items = {
															icm : self.fICM.getText(),
															dc : 'D',
															post_key : '40',
															tgl_jurnal : today_date,
															kode_akun : akun_debet,
															nama_akun : nama_debet,
															debet : nilai_pajak,
															kredit : 0,
															keterangan : 'PAJAK MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
															jenis_jurnal : 'PAJAK_REKLAS',
															jenis_akun : jenis_akun_debet,
															cc : self.tp_icm,
															tp : self.cc_icm,
															orig_acct : akun_debet,
															acct_coa : akun_debet
														}
														jurnal_pajak_array.push(items);	

														var items = {
															icm : self.fICM.getText(),
															dc : 'C',
															post_key : '50',
															tgl_jurnal : today_date,
															kode_akun : akun_kredit,
															nama_akun : nama_kredit,
															debet : 0,
															kredit : nilai_pajak,
															keterangan : 'PAJAK MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
															jenis_jurnal : 'PAJAK_REKLAS',
															jenis_akun : jenis_akun_kredit,
															cc : self.tp_icm,
															tp : self.cc_icm,
															orig_acct : akun_kredit,
															acct_coa : akun_kredit
														}
														jurnal_pajak_array.push(items);	
														self.jurnal_pajak_array = jurnal_pajak_array;	
													}
													var tipe_ledger = '';
													if(self.cboxPSAK.selected == true && self.cboxIFRS.selected == true){
														var tipe_ledger = 'DOUBLE';
													}else if(self.cboxPSAK.selected == true && self.cboxIFRS.selected == false){
														var tipe_ledger = 'PSAK';
													}else if(self.cboxPSAK.selected == false && self.cboxIFRS.selected == true){
														var tipe_ledger = 'IFRS';
													}
													var data_rev = [];
													for(i=0;i < self.sg1.getRowCount();i++){
														var items = {
															orig_acct : self.sg1.cells(0,i),
															acct_coa : '-',
															rev_icm : self.sg1.cells(2,i),
															rev_bspl : self.sg1.cells(3,i),
															pmargin : self.sg1.cells(4,i),
															margin : self.sg1.cells(5,i)
														}
														data_rev.push(items);
													}
													var data_cogs = [];
													for(i=0;i < self.sg2.getRowCount();i++){
														var items = {
															orig_acct : self.sg2.cells(0,i),
															acct_coa : '-',
															nilai : self.sg2.cells(2,i)
														}
														data_cogs.push(items);
													}
													var data_aset = [];
													for(i=0;i < self.sg3.getRowCount();i++){
														if(self.sg3.cells(13,i) == '' || self.sg3.cells(13,i) == null || self.sg3.cells(13,i) == undefined){
															var ap_simpan = 0;
														}else{
															var ap_simpan = self.sg3.cells(13,i);										
														}
														if(self.sg3.cells(14,i) == '' || self.sg3.cells(14,i) == null || self.sg3.cells(14,i) == undefined){
															var bp_simpan = 0;
														}else{
															var bp_simpan = self.sg3.cells(14,i);										
														}
														if(self.sg3.cells(15,i) == '' || self.sg3.cells(15,i) == null || self.sg3.cells(15,i) == undefined || isFinite(self.sg3.cells(15,i)) == false || isFinite(self.sg3.cells(15,i)) == 'false'){
															var dep_per_bln_simpan = 0;
														}else{
															var dep_per_bln_simpan = self.sg3.cells(15,i);										
														}
														var items = {
															icm : self.fICM.getText(),
															periode : self.fPeriode.getText(),
															orig_acct : self.sg3.cells(0,i),
															acct_coa : '-',
															nama : self.sg3.cells(3,i),
															akun_reklas : self.sg3.cells(4,i),
															klp_aset : self.sg3.cells(5,i),
															tgl_perolehan : self.sg3.cells(6,i),
															periode_susut : self.sg3.cells(9,i),
															umur : self.sg3.cells(10,i),
															margin : self.sg3.cells(11,i),
															hp : self.sg3.cells(12,i),
															ap : ap_simpan,
															bp : bp_simpan,
															peny_per_bln : dep_per_bln_simpan,
															keterangan : self.sg3.cells(16,i),
															tipe_ledger : tipe_ledger,
															cc : self.cc_icm,
															tp : self.tp_icm,
															jenis_trans : self.sg3.cells(2,i),
															jenis_rekon : self.sg3.cells(1,i),
															explanation : self.fExp.getText(),			
															bacc : self.sg3.cells(7,i),
															batp : self.sg3.cells(8,i),							
															batp : self.sg3.cells(8,i),							
															no_aset : self.sg3.cells(17,i),		
															periode_input : self.fPeriodef.getText()																											
														}
														data_aset.push(items);
													}
													console.log("jurnal backprocess");
													// console.log(self.jurnal_rev_array);
													// console.log(self.jurnal_cogs_array);
													// console.log(self.jurnal_pajak_array);
													// console.log(self.jurnal_pajak_array.length);                                                                                
													var data_j_rev = [];
													for(i=0;i<self.jurnal_reklas_rev_array.length;i++){
														if(self.jurnal_reklas_rev_array[i].post_key == '40'){
															var nilai_j = self.jurnal_reklas_rev_array[i].debet;
														}else{
															var nilai_j = self.jurnal_reklas_rev_array[i].kredit;
														}
														var items = {
															icm : self.jurnal_reklas_rev_array[i].icm,
															post_key : self.jurnal_reklas_rev_array[i].post_key,
															tgl_jurnal : self.jurnal_reklas_rev_array[i].tgl_jurnal,
															kode_akun : self.jurnal_reklas_rev_array[i].kode_akun,
															nilai : nilai_j,
															keterangan : self.jurnal_reklas_rev_array[i].keterangan,
															jenis_jurnal : self.jurnal_reklas_rev_array[i].jenis_jurnal,
															jenis_akun : self.jurnal_reklas_rev_array[i].jenis_akun,
															cc : self.jurnal_reklas_rev_array[i].cc,
															tp : self.jurnal_reklas_rev_array[i].tp,
															orig_acct : self.jurnal_reklas_rev_array[i].orig_acct,
															acct_coa : self.jurnal_reklas_rev_array[i].acct_coa
														}
														data_j_rev.push(items);
													}
													var data_j_cogs = [];
													for(i=0;i<self.jurnal_reklas_cogs_array.length;i++){
														if(self.jurnal_reklas_cogs_array[i].post_key == '40'){
															var nilai_j = self.jurnal_reklas_cogs_array[i].debet;
														}else{
															var nilai_j = self.jurnal_reklas_cogs_array[i].kredit;
														}
														var items = {
															icm : self.jurnal_reklas_cogs_array[i].icm,
															post_key : self.jurnal_reklas_cogs_array[i].post_key,
															tgl_jurnal : self.jurnal_reklas_cogs_array[i].tgl_jurnal,
															kode_akun : self.jurnal_reklas_cogs_array[i].kode_akun,
															nilai : nilai_j,
															keterangan : self.jurnal_reklas_cogs_array[i].keterangan,
															jenis_jurnal : self.jurnal_reklas_cogs_array[i].jenis_jurnal,
															jenis_akun : self.jurnal_reklas_cogs_array[i].jenis_akun,
															cc : self.jurnal_reklas_cogs_array[i].cc,
															tp : self.jurnal_reklas_cogs_array[i].tp,
															orig_acct : self.jurnal_reklas_cogs_array[i].orig_acct,
															acct_coa : self.jurnal_reklas_cogs_array[i].acct_coa
														}
														data_j_cogs.push(items);
													}                              
													var data_j_tax = [];										    
													$.each(self.jurnal_pajak_array,(k,v)=>{
														if(v.post_key == '40'){
															var nilai_j = v.debet;
														}else{
															var nilai_j = v.kredit;
														}									                                            
														var items = {
															icm : v.icm,
															post_key : v.post_key,
															tgl_jurnal : v.tgl_jurnal,
															kode_akun : v.kode_akun,
															nilai : nilai_j,
															keterangan : v.keterangan,
															jenis_jurnal : v.jenis_jurnal,
															jenis_akun : v.jenis_akun,
															cc : v.cc,
															tp : v.tp,
															orig_acct : v.orig_acct,
															acct_coa : v.acct_coa
														}
														data_j_tax.push(items);
													});
													console.table(data_j_rev);
													console.table(data_j_cogs);
													console.table(data_j_tax);
													
													this.app.services.callServices("financial_BsplMaster","reklasADK",[self.app._lokasi,self.fICM.getText(),self.fPeriode.getText(),data_rev,data_cogs,data_aset,data_j_rev,data_j_cogs,data_j_tax],function(data){
														if (data == 'process completed') {
															system.info(self, "Data berhasil tersimpan","");
								
															self.bSubmit.hide();
															
															self.fICM.setText('');
															self.fPeriode.setText('');
															self.fCOCDi.setText('');
															// self.fICMP.setText('');
															// self.fExp.setText('');
															// self.fExpP.setText('');
															// self.fPeriodeP.setText('');
															// self.fCOCDP.setText('');
															self.fRev.setText(0);
															self.fRevBSPL.setText(0);
															self.fNilAst.setText(0);																			
															self.fCogs.setText(0);
															self.fMargin.setText(0);
															// self.fRevP.setText(0);
															// self.fNilAstP.setText(0);																			
															// self.fCogsP.setText(0);
															// self.fMarginP.setText(0);
															self.cboxPSAK.setSelected(false);
															self.cboxIFRS.setSelected(false);
															// self.cboxPSAKP.setSelected(false);
															// self.cboxIFRSP.setSelected(false);									
								
															self.sg1.clear(0);	
															self.sg2.clear(1);	
															self.sg3.clear(0);	
															self.sg4.clear(0);
															// self.sg1P.clear(0);	
															// self.sg2P.clear(0);	
															// self.sg3P.clear(0);	
															// self.sg4P.clear(0);	
															self.tab.setActivePage(self.tab.childPage[0]);    		        
			
															self.sg0.hide();
															self.pDash.show();
															self.bKembali.hide();															
															self.loadICMBSPL();
															// self.loadDash();
														}else {
															system.alert(self, data,"");
														}
													});
												});
											}
										}
									}
								}
							}
						}
					}else{
						system.alert(self, "Inputan Tidak Boleh Kosong");
					}
                });
			}
			catch(e){
				system.alert(this, e,"");
			}
		}catch(e){
			systemAPI.alert(e);
		}
    },
	loadDash: function(){
		var self = this;
		var filter = {
			icm : self.fICMf.getText(),
			periode : self.fPeriodef.getText(),
			fcbp : self.fFCBP.getText(),
			cc : self.fCOCD.getText(),
			tp : self.fTP.getText()
		};			
		this.showLoading("Please wait...");		
		this.app.services.callServices("financial_BsplMaster", "getListICMBSPLADK", [self.app._lokasi,filter], (data) => {
			if (typeof data != 'undefined' && data != null && data.length != 0){
				if (typeof data.ADK != 'undefined' && data.ADK != null && data.ADK.length != 0){
					self.WADK.setValue(data.ADK);					
				}else{
					self.WADK.setValue(0);					
                }
                if (typeof data.CAPEX != 'undefined' && data.CAPEX != null && data.CAPEX.length != 0){
					self.WCAPEX.setValue(data.CAPEX);					
				}else{
					self.WCAPEX.setValue(0);					
				}
				if (typeof data.TOTAL != 'undefined' && data.TOTAL != null && data.TOTAL.length != 0){
					self.WTotal.setValue(data.TOTAL);					
				}else{
					self.WTotal.setValue(0);					
				}
			}else{
				system.alert(self, "Data tidak ditemukan");		
				self.WADK.setValue(0);					
				self.WCAPEX.setValue(0);					
				self.WTotal.setValue(0);											
			}
			this.hideLoading();				
		}, (err) => {
			this.hideLoading();
		});
	},
	loadICMBSPL: function(){
		var self = this;
		var filter = {
			icm : self.fICMf.getText(),
			periode : self.fPeriodef.getText(),
			fcbp : self.fFCBP.getText(),
			cc : self.fCOCD.getText(),
			tp : self.fTP.getText()
		};
		self.sg0.clear(0);			
		this.showLoading("Please wait...");		
		this.app.services.callServices("financial_BsplMaster", "getListICMBSPLADK", [self.app._lokasi,filter], (data) => {
			if (typeof data.list != 'undefined' && data.list != null && data.list.length != 0){
				$.each(data.list, function(k, val){
					self.sg0.addRowValues([
						val.icm,
						val.periode,
						val.cocd,
						val.tp,
						val.fcbp,
						val.jenis_rekon,
						val.sakhir_doc,
						val.status,
						val.status_ba
					]);
				});	
				// self.loadDash();
				if (typeof data.ADK != 'undefined' && data.ADK != null && data.ADK.length != 0){
					self.WADK.setValue(data.ADK);					
				}else{
					self.WADK.setValue(0);					
                }
                if (typeof data.CAPEX != 'undefined' && data.CAPEX != null && data.CAPEX.length != 0){
					self.WCAPEX.setValue(data.CAPEX);					
				}else{
					self.WCAPEX.setValue(0);					
				}
				if (typeof data.TOTAL != 'undefined' && data.TOTAL != null && data.TOTAL.length != 0){
					self.WTotal.setValue(data.TOTAL);					
				}else{
					self.WTotal.setValue(0);					
				}
			}else{
				system.alert(self, "Data tidak ditemukan");	
				self.WADK.setValue(0);					
				self.WCAPEX.setValue(0);					
				self.WTotal.setValue(0);				
			}
			this.hideLoading();				
		}, (err) => {
			this.hideLoading();
		});
	},
	loadSummaryBA: function(icm,perio,cocd,tp,fcbp){
		var self = this;
		var filter = {
			cocd : cocd,
			icm : icm, 
			perio : perio,
			tp : tp,
			fcbp : fcbp,
			status : 'BSPL'
		};			
		// console.log(filter);
		this.showLoading("Please wait...");		
		this.app.services.callServices("financial_BsplMaster", "getSummaryBA", [icm,perio.perio_awal], (data) => {
			this.summaryBA.clear();
			self.nilai_aset_ba = [];
			self.bacc_sumBA = [];
			self.batp_sumBA = [];
			var ctr = 0;
			self.bacc_icm = '';
			self.batp_icm = '';
			self.aset_reklas_icm = '';
			$.each(data, function(k, line){
				self.summaryBA.addRowValues([
					line.icm, line.periode.substr(0, 4), line.periode.substr(4, 6), line.curr,line.kode_jasa, line.pekerjaan,
					line.cocd, line.bacc, 
					line.tp, line.batp, line.kode_akun,
					line.description, line.akun_tlkm, line.short_text, line.fcbp,
					Math.round(line.sawal_doc,0),  Math.round(line.sawal_loc,0), 
					Math.round(line.doc_amount,0), Math.round(line.loc_amount,0),  
					Math.round(line.sakhir_doc,0), Math.round(line.sakhir_loc,0), 
					line.jenis_rekon,
					Math.round(line.balance,0),line.status_elim, line.ba_rekon, line.status_ba
				]);

				if(line.jenis_rekon == 'ASET' || line.jenis_rekon == 'INVEN'){
					self.nilai_aset_ba.push(line.loc_sakhir);
					self.bacc_sumBA.push(line.bacc);
					self.batp_sumBA.push(line.batp);
					self.sg3.setCell(6, ctr, line.bacc);
					self.sg3.setCell(7, ctr, line.batp);
					self.sg3.setCell(11, ctr, line.loc_sakhir);
					self.bacc_icm = self.bacc_icm + ',' + line.bacc; 
					self.batp_icm = self.batp_icm + ',' + line.batp; 
					self.aset_reklas_icm = self.aset_reklas_icm + ',' + line.kode_akun; 
					ctr++;																	
				}

				self.jenis_jasa = line.jenis_jasa;
			});
			this.hideLoading();				
		}, (err) => {
			this.hideLoading();
		});
	},
	loadReportEdit: function(icm,periode,cocd){
		var self = this;
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		self.sg1.clear(0);	
		self.sg2.clear(0);	
		self.sg3.clear(0);	
		self.sg4.clear(0);	
		self.sg1P.clear(0);	
		self.sg2P.clear(0);	
		self.sg3P.clear(0);	
		self.sg4P.clear(0);	
		var filter = {
			icm : icm,
			periode : periode,
			cc : self.cc_icm,
			periode_filter : self.fPeriodef.getText()
		};
		self.fICM.setText(icm);                
		self.fPeriode.setText(periode);                		
		self.fCOCDi.setText(cocd);            
		self.tab.setActivePage(self.tab.childPage[1]);    		
		this.showLoading("Please wait...");		
		this.app.services.callServices("financial_BsplMaster", "getDataElimBSPLEdit", [self.app._lokasi,filter], (data) => {
			if (typeof data != 'undefined' && data != null && data.length != 0){
				console.log(data);           	
				self.akunADK = data.akun_adk;				
				self.akunAset = data.akun_aset;				
		        self.fExp.setText(data.explanation);                            		
				self.tot_margin_aset = data.tot_margin_aset;  
				self.status_periode = data.status_periode; 									                          		
				var rev = 0;	
				var rev_bspl = 0;	
				var cogs = 0;	
				var aset_ba_rekon = 0;											
				var margin = 0;												
				// if (typeof data.rev != 'undefined' && data.rev != null && data.rev.length != 0){
				// 	$.each(data.rev, function(k, val){
				// 		self.sg1.addRowValues([
				// 			val.orig_acct + " - " + val.acct_coa,
				// 			val.orig_acct,
				// 			val.orig_acct,
				// 			val.description,
				// 			val.rev_icm,
				// 			val.rev_bspl,
				// 			val.pmargin,
				// 			val.margin
				// 		]);
				// 		rev = Number(rev) + Number(val.nilai);
				// 	});
				// }
				if (typeof data.cogs != 'undefined' && data.cogs != null && data.cogs.length != 0){				
					$.each(data.cogs, function(k, val){
						self.sg2.addRowValues([
							val.orig_acct,
							val.description,
							val.nilai,
							val.bacc,
							val.batp
						]);
						cogs = Number(cogs) + Number(val.nilai);						
					});
				}               							
				if (typeof data.aset != 'undefined' && data.aset != null && data.aset.length != 0){		
					if(data.aset[0].tipe_ledger == 'PSAK'){
						self.cboxPSAK.setSelected(true);
					}else if(data.aset[0].tipe_ledger == 'IFRS'){
						self.cboxIFRS.setSelected(true);
					}else if(data.aset[0].tipe_ledger == 'DOUBLE'){
						self.cboxPSAK.setSelected(true);
						self.cboxIFRS.setSelected(true);
					}		
					var ctr = 0;				
					// console.log(self.nilai_aset_ba);
					$.each(data.aset, function(k, val){
						if(self.akunADK.indexOf(val.orig_acct) != -1 || val.orig_acct.match(/1319.*/) || val.orig_acct.match(/1320.*/)){  
							if(val.tgl_perolehan == '' || val.tgl_perolehan == null || val.tgl_perolehan == '-' || val.tgl_perolehan == undefined){
								var tgl_perolehan_default = self.fPeriodef.getText().substr(0, 4) + '/' + self.fPeriodef.getText().substr(4, 6) + '/' + new Date(self.fPeriodef.getText().substr(0, 4), self.fPeriodef.getText().substr(4, 6), 0).getDate();
							}else{
								var tgl_perolehan_default = val.tgl_perolehan;
							}

							var thn_filter = self.fPeriodef.getText().substr(0, 4);						
							var bln_filter = self.fPeriodef.getText().substr(4, 6);
							var periode_filter = thn_filter + bln_filter;

							self.sg3.addRowValues([
								val.orig_acct,
								val.jenis_rekon,
								val.jenis_trans,
								val.nama,
								'-',
								val.klp_aset,
								tgl_perolehan_default,
								val.bacc,
								val.batp,
								periode_filter,
								val.umur,
								val.margin,
								val.hp,										
								val.ap,
								val.bp,
								val.peny_per_bln,
								val.keterangan,
								val.no_aset,
							]);	
						}					
						margin = Number(margin) + Number(val.margin);																				
						aset_ba_rekon = Number(aset_ba_rekon) + Number(val.hp);	
						ctr++;						
					});	
				}
				// self.fRev.setText(floatToNilai(rev));      
				var rev_bspl = 0;
				var rev_icm = 0;
				if (typeof data.rev_edit != 'undefined' && data.rev_edit != null && data.rev_edit.length != 0){
					$.each(data.rev_edit, function(k, val){
						self.sg1.addRowValues([
							val.orig_acct,
							val.description,
							val.rev_icm,
							val.rev_bspl,
							val.pmargin,
							val.margin,
						]);
						rev_bspl = Number(rev_bspl) + Number(Math.round(Number(val.sakhir_loc)/Number(data.tot_rev_db)*Number(aset_ba_rekon)));
						rev_icm = Number(rev_icm) + Number(val.sakhir_loc);
					});
				}
				self.fRev.setText(floatToNilai(rev_icm));
				self.fRevBSPL.setText(floatToNilai(rev_bspl));

				// console.log("nilai aset ba rekon " +aset_ba_rekon);     							
				self.fNilAst.setText(floatToNilai(aset_ba_rekon));           							
				self.fCogs.setText(floatToNilai(cogs));
				self.fMargin.setText(floatToNilai(margin));
				if (typeof data.jur != 'undefined' && data.jur != null && data.jur.length != 0){				
					$.each(data.jur, function(k, val){
						self.sg4.addRowValues([
							val.icm,
							val.dc,
							val.post_key,
							val.tgl_jurnal,
							val.kode_akun,
							val.description,
							val.debit,
							val.kredit,
							val.keterangan
						]);
					});	
				}	
				if (typeof data.jur_reverse != 'undefined' && data.jur_reverse != null && data.jur_reverse.length != 0){
					self.jur_reverse = data.jur_reverse;
				}

				self.total_nilai_ba_rekon_awal = aset_ba_rekon;

				self.total_nilai_ba_rekon_awal_v = self.total_nilai_ba_rekon_awal.toString().split(".");
				self.total_nilai_ba_rekon_awal_v[0] = self.total_nilai_ba_rekon_awal_v[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				self.total_nilai_ba_rekon_awal_v.join(".");

				// set total revenue
				var total_rev_icm_init = 0;
				var total_rev_bspl_init = 0;
				for(i=0;i < self.sg1.getRowCount();i++){
					if(self.sg1.cells(2,i) == ''){
						var rev_icm_row = 0;
					}else{
						var rev_icm_row = nilaiToFloat(self.sg1.cells(2,i));								
					}
					if(self.sg1.cells(3,i) == ''){
						var rev_bspl_row = 0;
					}else{
						var rev_bspl_row = nilaiToFloat(self.sg1.cells(3,i));								
					}
					// console.log(total_rev_init +"="+ total_rev_init +"+"+ rev_row);
					total_rev_icm_init = total_rev_icm_init + rev_icm_row;
					total_rev_bspl_init = total_rev_bspl_init + rev_bspl_row;
				}
				self.fRev.setText(floatToNilai(total_rev_icm_init));
				self.fRevBSPL.setText(floatToNilai(total_rev_bspl_init));
				self.fPersenMargin.setText((nilaiToFloat(self.fMargin.getText())/nilaiToFloat(self.fNilAst.getText())*100).toFixed(2));
				
				for(i=0;i < self.sg3.getRowCount();i++){
					if(self.sg3.cells(9,i) == '-' || self.sg3.cells(9,i) == '' || self.sg3.cells(9,i) == yyyy + '12'){
						self.sg3.setCell(9, i, yyyy + '12');
					}
				}

				self.createJurnal();                         				
			}else{
				system.alert(self, "Data tidak ditemukan");				
			}
			this.hideLoading();				
		}, (err) => {
			this.hideLoading();
		});
	},
	loadID: function(){
		var self = this;
        self.app.services.callServices("financial_BsplMaster","getIDAset",[self.app._lokasi],function(data){  
			self.fNoAset.setText(data.id_otomatis);                
		});
	},
	doChange: function(sender){
		try{
			if (sender == this.cb_pdrk){
				if(this.cb_pdrk.getText() != ""){
					var self = this;
					self.loadDok(self.cb_pdrk.getText());   
				};
			}
			// else if (sender == this.fRev){
			// 	if(this.fRev.getText() != "" || this.fCogs.getText() != "" ){
			// 		var self = this;
			// 		self.fMargin.setText(nilaiToFloat(this.fRev.getText())-nilaiToFloat(this.fCogs.getText()));											
			// 	}else{
			// 		self.fMargin.setText(0);											
			// 	}
			// }else if (sender == this.fCogs){
			// 	if(this.fRev.getText() != "" || this.fCogs.getText() != "" ){
			// 		var self = this;
			// 		self.fMargin.setText(nilaiToFloat(this.fRev.getText())-nilaiToFloat(this.fCogs.getText()));											
			// 	}else{
			// 		self.fMargin.setText(0);											
			// 	}
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
