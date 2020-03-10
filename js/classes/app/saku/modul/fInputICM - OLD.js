window.app_saku_modul_fInputICM = function(owner,menu)
{
	if (owner)
	{
		window.app_saku_modul_fInputICM.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fInputICM";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Input ICM", 0);

		uses("control_popupForm;column;pageControl;saiEdit;datePicker;saiGrid;saiCBBL;childPage;panel;portalui_uploader;sgNavigator;column;frame;tinymceCtrl", true);			
		var self=this;
		self.notif="-";
		if(menu == undefined){
			menu = this.app._menu;
		}else{
			this.app._menu = menu;
		}

		if(menu == "TTER"){
			self.notif = "TTER";
		}else if(menu == "VOPEN"){
			self.notif = "VOPEN";
		}else if(menu == "VCLEAR"){
			self.notif = "VCLEAR";
		}else if(menu == "VUNCLEAR"){
			self.notif = "VUNCLEAR";
		}else if(menu == "VCLOSE"){
			self.notif = "VCLOSE";
		}
		
		this.tab = new pageControl(this,{bound:[20,10,this.width-40,this.height-50],
			childPage: ["Document List","Entry Data","View BA","View Summary BA"],
			borderColor:"#35aedb", headerAutoWidth:false});	

		this.tab2 = new pageControl(this.tab.childPage[2],{bound:[10,10,this.tab.width-20,this.tab.height-40],
			childPage: ["View BA 1","View BA 2"],
			borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});	
		
		this.bTambah = new button(this.tab.childPage[0],{bound:[10,10,80, 30],icon:"<i class='fa fa-plus' style='color:white'></i>", caption:"Input"});
		this.bTambah.setColor("#474787");

		this.bUpl = new button(this.tab.childPage[0],{bound:[100,10,80, 30],icon:"<i class='fa fa-upload' style='color:white'></i>", caption:"Upload"});
		this.bUpl.setColor("green");
		

		this.bCariICM = new saiLabelEdit(this.tab.childPage[0], {bound:[this.width-320, 20, 200, 20],caption:"Search...", visible:false,placeHolder:true});
	
		this.bCariICM2 = new button(this.tab.childPage[0],{bound:[this.width-200, 20, 100, 20],icon:"<i class='fa fa-filter' style='color:white'></i>", caption:"Filter"});
		this.bCariICM2.setColor("#6c5ce7");

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[1,50,this.width-100,this.height-110],
			colCount: 16,
			colTitle: ["IC DOC","COCD","TP","Periode","Kode Jasa","Nama Jasa","Pekerjaan","Curr","FCBP","Status","No Jurnal Kirim","Terima","No Jurnal Terima","View BA","Vew Summary BA","Recurring"],
			colWidth:[[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],[60,120,60,110,50,110,80,60,40,150,180,80,60,40,50,100]],
			// columnReadOnly:[true, [0,1,2,3,4,5],[]],		
			// colFormat:[[7],[cfNilai]],		
			rowPerPage:15, 
			autoPaging:true, 
			pager:[this,"doPager"],
			ellipsClick: [this,"doEllipsClick"]
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


		self.sg1.on("dblClick", function(col, row, id){
			//kalo terima
			if(col == 11 ){
				
				self.app.services.callServices("financial_mantis","getTerima",[self.sg1.cells(0, row)], function(data){
					console.log("isi compcode"+data.induk.cc);
					if( self.app._lokasi == data.induk.cc ){
						system.alert(self, "Anda Tidak Berhak Menerima Dokumen Ini. Ini Adalah Dokumen Kiriman Anda!", "");
					}else{
						self.baru = "TRM";
						self.tab.setActivePage(self.tab.childPage[1]);
						self.cocd.setText(data.induk.tp);
						self.jasa.setText(data.induk.kode_jasa);
						self.tahun.setText(data.induk.year);
						self.curr.setText(data.induk.currency);
						self.tp.setText(data.induk.cc);
						self.fcbp.setText(data.induk.fcbp);
						self.bulan.setText(data.induk.month);
						self.icm.setText(data.induk.icm);
						self.pekerjaan.setText(data.induk.pekerjaan);
						self.idheader_old = data.induk.idheader;
					}
				});
			}

			//recurring
			if(col == 15 ){
				if(self.sg1.cells(15, row) == "-"){
					system.alert(self, "Anda Tidak Berhak Menerima Dokumen Ini. Ini Adalah Dokumen Kiriman Anda!", "");
				}else{
					self.baru = "REC";
					self.idheader_old = "-";
					self.bCreateICM.setVisible(false);
					self.tab.setActivePage(self.tab.childPage[1]);
					self.app.services.callServices("financial_mantis","getTerima",[self.sg1.cells(0, row)], function(data){
						self.cocd.setText(data.induk.tp),
						self.jasa.setText(data.induk.kode_jasa),
						self.tahun.setText(data.induk.year),
						self.curr.setText(data.induk.currency),
						self.tp.setText(data.induk.cc),
						self.fcbp.setText(data.induk.fcbp),
						self.bulan.setText(data.induk.month),
						self.icm.setText(data.induk.icm),
						self.pekerjaan.setText(data.induk.pekerjaan)
					});
					this.tabTerima = new pageControl(this.tab.childPage[1],{bound:[20,10,this.width-90,this.height-50],
						childPage: ["BA Rekon 1","BA Rekon 2"],
						borderColor:"#35aedb", headerAutoWidth:false});
				}
					
			};

			//view ba
			if(col == 13){
				self.tab.setActivePage(self.tab.childPage[2]);
				// self.getReport("getViewBA",[self.sg1.cells(0, row),self.sg1.cells(1, row),self.sg1.cells(2, row),self.sg1.cells(9, row)], self.viewba1.frame.frame);
			
				self.getReport("getViewBA1",[self.sg1.cells(0, row), self.sg1.cells(10, row)], self.viewba1.frame.frame);
				self.getReport("getViewBA2",[self.sg1.cells(0, row), self.sg1.cells(12, row)], self.viewba2.frame.frame);
				
				console.log("halo view ba");
			}

			//view summary ba
			if(col == 14){
				self.tab.setActivePage(self.tab.childPage[3]);
			}

		});
		
		
		this.cocd = new saiCBBL(this.tab.childPage[1],{bound:[20,20,200,20],caption:"Comp. Code",readOnly:true});
		this.jasa = new saiCBBL(this.tab.childPage[1],{bound:[20,45,200,20],caption:"Jasa", tag:1});	
		var thn = self.app._periode;
		var tahun = thn.substr(0,4);
		this.tahun = new saiCB(this.tab.childPage[1],{bound:[20,70,200,20],caption:"Tahun", readOnly:true, items:[tahun], change:[this,"doChange"]});
		this.curr = new saiCB(this.tab.childPage[1],{bound:[20,95,200,20],caption:"Curr", readOnly:true, items:["IDR","AUD","USD"], change:[this,"doChange"]});
		
		
		this.tp = new saiCBBL(this.tab.childPage[1],{bound:[520,20,200,20],caption:"TP",readOnly:true,change:[this,"doChange"],tag:1});
		this.fcbp = new saiCB(this.tab.childPage[1],{bound:[520,45,200,20],caption:"FCBP", readOnly:true, visible:false, items:["FCBP 1","FCBP 2","FCBP 3","FCBP 4","FCBP 5","DWS","DES/DBS"], change:[this,"doChange"]});
		this.fcbp.setItemHeight(7);
		this.bulan = new saiCB(this.tab.childPage[1],{bound:[520,70,200,20],caption:"Bulan", readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
		this.bulan.setItemHeight(12);

		this.icm = new saiLabelEdit(this.tab.childPage[1],{bound:[520,95,200,20],caption:"ICM", readOnly:true});
		this.bCreateICM = new button(this.tab.childPage[1],{bound:[730,95,130,20],icon:"<i class='fa fa-spinner' style='color:white'></i>", visible:false, caption:"Create No. ICM"});
		this.bCreateICM.setColor("#6c5ce7");
		this.bCreateICM.on("click",function(sender){
			if(self.jasa.getText() == "" && self.tahun.getText() == "" && self.bulan.getText() == ""){
				system.alert(self, "Harap isi Tahun, Jasa dan Bulan Terlebih Dahulu!", "");
			}else if(self.tahun.getText() == ""){
				system.alert(self, "Harap isi Tahun Terlebih Dahulu!", "");
			}
			else if(self.jasa.getText() == "" ){
				system.alert(self, "Harap isi Jasa Terlebih Dahulu!", "");
			}
			else if(self.bulan.getText() == ""){
				system.alert(self, "Harap isi Bulan Terlebih Dahulu!", "");
			}
			else{
				self.app.services.callServices("financial_mantis","createNoICM",[self.tahun.getText(),self.bulan.getText(),self.jasa.getText()], function(data){
					self.icm.setText(data);
				});
			}
		
		});
		
		this.pekerjaan = new saiLabelEdit(this.tab.childPage[1],{bound:[20,120,700,20],caption:"Pekerjaan"});
		
		
		this.bTambah.on("click",function(sender){
			self.tab.setActivePage(self.tab.childPage[1]);
			self.baru = "NEW";
			self.bCreateICM.setVisible(true);
			self.cocd.setText(self.app._lokasi);
			self.idheader_old = "-";
			self.sg2.clear(1);
			self.jasa.setText("");
			self.curr.setText("");
			self.pekerjaan.setText("");
			self.tp.setText("");
			self.fcbp.setText("");
			self.fcbp.setVisible(false);
			self.bulan.setText("");
			self.icm.setText("");
		});

		var self=this;
		this.tp.on("change", function(){
			if(self.tp.getText() == "1000"){
				self.fcbp.setVisible(true);
			}else{
				self.fcbp.setVisible(false);
			}
		});
		
		

		this.sg2 = new saiGrid(this.tab.childPage[1],{bound:[20,145,this.width-200,this.height-250],
			colCount: 9,
			colTitle: ["Post Key","GL Acc","Nama Akun","BA Telkom","Keterangan","Doc Amount","Loc Amount","Cost Center","Profit Center"],
			colWidth:[[0,1,2,3,4,5,6,7,8],[70,80,230,100,230,100,100,90,90]],
			columnReadOnly:[true, [],[0,1,2,3,4,5,6,7,8]],		
			buttonStyle:[[0,1,3,7,8],[bsAuto,bsEllips,bsEllips,bsEllips,bsEllips]], 
			colFormat:[[5,6],[cfNilai,cfNilai]],		
			picklist:[[0],[new arrayMap({items:["40 - Debet","50 - Credit"]})
							   ]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager1"]
		});

		this.sg2.on("entrySearch", function(col, row, value, fn){
			if (value.length > 2) {
				if (self.myTimeExecSearch){
					clearTimeout(self.myTimeExecSearch);
				}
				self.myTimeExecSearch = setTimeout( function(){
					if (col == 1) {
						self.app.services.callServices("financial_mantis","getListGL",[value, self.cocd.getText()], function(data){
							fn(data);
						});
					}
					else if (col == 3) {
						self.app.services.callServices("financial_mantis","getListBA",[value, self.cocd.getText(), self.tp.getText()], function(data){
							fn(data);
						});
					}
					else if (col == 7) {
						self.app.services.callServices("financial_mantis","getListCC",[value, self.sg2.cells(3, row)], function(data){
							fn(data);
						});
					}
					else if (col == 8) {
						self.app.services.callServices("financial_mantis","getListProfitCenter",[value, self.sg2.cells(3, row)], function(data){
							fn(data);
						});
					}
				}, 500);
			}
		});

		this.sg2.on("change", function(col, row, data){
			if ( col == 1 ){
				console.log("masuk 1");
				var isValidGL = new Promise((resolve, reject)=>{
					var gl = self.sg2.cells(1, row);
					console.log("process validasi", gl);
					self.app.services.callServices("financial_mantis","isValidGL",[self.app._lokasi, gl], function(data){
						resolve(data);
					});
				});
				
				isValidGL.then((validGL)=>{
					console.log(validGL);
					if(self.sg2.cells(1,row) != ""){
						if(validGL){
							
						}else{
							self.sg2.setCell(1, row, "");
							system.alert(self, "Cust/Vend/GL Acc Tidak DItemukan!", "");
						}
					}
				});
			}

		
			if ( col == 3 ){
				console.log("masuk 3");
				var isValidBA = new Promise((resolve, reject)=>{
					var ba = self.sg2.cells(3, row);
					console.log("process validasi", ba);
					self.app.services.callServices("financial_mantis","isValidBA",[self.app._lokasi, ba], function(data){
						resolve(data);
					});
				});
				
				isValidBA.then((validBA)=>{
					console.log(validBA);
					if(self.sg2.cells(3,row) != ""){
						if(validBA){
							
						}else{
							self.sg2.setCell(3, row, "");
							system.alert(self, "Business Area Tidak Ditemukan!", "");
						}
					}
				});
			}

			if ( col == 7 ){
				console.log("masuk 7");
				var isValidCC = new Promise((resolve, reject)=>{
					var cc = self.sg2.cells(7, row);
					console.log("process validasi", cc);
					self.app.services.callServices("financial_mantis","isValidCC",[self.app._lokasi, cc], function(data){
						resolve(data);
					});
				});
				
				isValidCC.then((validCC)=>{
					console.log(validCC);
					if(self.sg2.cells(7,row) != ""){
						if(validCC){
							
						}else{
							self.sg2.setCell(7, row, "");
							system.alert(self, "Cost Center Tidak DItemukan!", "");
						}
					}
				});
			}

			if ( col == 8 ){
				console.log("masuk 8");
				var isValidPC = new Promise((resolve, reject)=>{
					var pc = self.sg2.cells(8, row);
					console.log("process validasi", pc);
					self.app.services.callServices("financial_mantis","isValidProfit",[self.app._lokasi, pc], function(data){
						resolve(data);
					});
				});
				
				isValidPC.then((validPC)=>{
					console.log(validPC);
					if(self.sg2.cells(8,row) != ""){
						if(validPC){
							
						}else{
							self.sg2.setCell(8, row, "");
							system.alert(self, "Profit Center Tidak Ditemukan!", "");
						}
					}
				});
			}
			
		
		});

		

	

		this.sg2.on("selectRow", function(col, row, value, data){
			if (col == 1){
				self.sg2.setCell(col, row, value);
				self.sg2.setCell(col + 1, row, data[1]);
			}else if (col == 3){
				self.sg2.setCell(col, row, value);
				// self.sg2.setCell(col + 1, row, data[1]);
			}else if (col == 7){
				self.sg2.setCell(col, row, value);
				// self.sg2.setCell(col + 1, row, data[1]);
			}else if (col == 8){
				self.sg2.setCell(col, row, value);
				// self.sg2.setCell(col + 1, row, data[1]);
			}

		});

		this.bSave = new button(this.tab.childPage[1],{bound:[20,this.tab.childPage[1].height-40,80, 30],icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Save"});
		this.bSave.setColor("#27ae60");

		this.bSave.on("click",function(sender){
			try{

				var dataHeader = {					
					cocd : self.cocd.getText(),
					jasa : self.jasa.getText(),
					tahun : self.tahun.getText(),
					curr : self.curr.getText(),
					tp : self.tp.getText(),
					fcbp : self.fcbp.getText(),
					bulan : self.bulan.getText(),
					icm : self.icm.getText(),
					pekerjaan : self.pekerjaan.getText()
				};
				

				var dataDetail = [];
				var validasiPenerima = false;
				for (var i = 0; i < self.sg2.getRowCount();i++){				
					if(self.sg2.cells(0,i) != "" || self.sg2.cells(1,i) != "" || self.sg2.cells(2,i) != ""  || self.sg2.cells(5,i) != ""  || self.sg2.cells(6,i) != "" ){
						var item1 = {
							post_key : self.sg2.cells(0,i), 
							gl_acc : self.sg2.cells(1,i),
							keterangan : self.sg2.cells(4,i),
							ba : self.sg2.cells(3,i),
							docAm : self.sg2.cells(5,i),
							locAm : self.sg2.cells(6,i),
							cc : self.sg2.cells(7,i),
							profit : self.sg2.cells(8,i),
						};
						dataDetail.push(item1);
						validasiPenerima = true;
					}else{
						validasiPenerima = false;
					}
				}
				

				if(self.icm.getText() == ""){
					system.alert(self, "Harap Create ICM Terlebih Dahulu!", "");
				}else if (validasiPenerima) {
					self.app.services.callServices("financial_mantis","saveInputICM", [self.app._lokasi, dataHeader, dataDetail, self.baru, self.idheader_old] ,function(data){
						if (data == "process completed") {
							system.info(self, data,"");
							self.cocd.setText("");
							self.jasa.setText("");
							self.tahun.setText("");
							self.curr.setText("");
							self.tp.setText("");
							self.fcbp.setText("");
							self.bulan.setText("");
							self.icm.setText("");
							self.pekerjaan.setText("");
							self.app._mainForm.bClear.click();
							self.sg2.clear();
							self.tab.setActivePage(self.tab.childPage[0]);
							self.RefreshList();
							// self.app._mainForm.doRecall();
						}else {
							system.alert(self, data,"");
						}
					});
				}else{
					system.alert(self, "Harap Lengkapi Isian Anda!", "");
				}
			}catch(e){
				alert(e);
			}
		});


		this.totDebet = new saiLabelEdit(this.tab.childPage[1],{bound:[940,this.tab.childPage[1].height-50,240,20],caption:"Total Debit",readOnly:true,tipeText:ttNilai});
		this.totKredit = new saiLabelEdit(this.tab.childPage[1],{bound:[940,this.tab.childPage[1].height-25,240,20],caption:"Total Kredit",readOnly:true,tipeText:ttNilai});
		

		this.sg2.on("change", function (col, row, id){
			var totdr = 0;
			var totcr = 0;
			for (var i = 0 ; i < self.sg2.getRowCount();i++){
				if(self.sg2.cells(0, i) == "40 - Debet"){
					totdr += nilaiToFloat(self.sg2.cells(6, i));
				}
				if(self.sg2.cells(0, i) == "50 - Credit"){
					totcr += nilaiToFloat(self.sg2.cells(6, i));
				}
			}
			self.totDebet.setText(floatToNilai(nilaiToFloat(totdr)));
			self.totKredit.setText(floatToNilai(nilaiToFloat(totcr)));
		});

		// this.bCariICM.on("keyup", function(){
		// 	self.app.services.callServices("financial_mantis","cariICM",[self.bCariICM.getText(),self.app._lokasi], function(data){
		// 		self.sg1.clear();
		// 		// self.bCurrent.setCaption(1);
		// 		for (var i = 0; i < data.rs.rows.length; i++){
		// 			var line = data.rs.rows[i];

		// 			if(val.status == "1"){
		// 				var status = "Send"
		// 			}else if(val.status == "2"){
		// 				var status = "Received"
		// 			}else if(val.status == "3"){
		// 				var status = "Recurring";
		// 			}else if(val.status == "4"){
		// 				var status = "Done";
		// 			}


		// 			if(self.app._lokasi == line.cc){
		// 				var icon_recurring = "<center><i class='fa fa-paper-plane-o' style='color:brown;margin-top:2px'> </i>";
		// 			}else{
		// 				var icon_recurring = "-";
		// 			}
					
		// 			self.sg1.addRowValues([ line.icm, line.cc, line.tp, line.periode, line.kode_jasa, line.jenis_jasa, line.pekerjaan, line.currency, line.fcbp, status, line.idheader, "<center><i class='fa fa-paper-plane ' style='color:green;margin-top:2px'> </i>", line.idheader_clear, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>", icon_recurring ]);
				
		// 		}
		// 		self.sg1.setNoUrut(0 );
		// 	});
		// });
		

	
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
	

		this.drJurnal = new saiLabelEdit(this.pJurnal,{bound:[940,420,240,20],caption:"Total Debit",readOnly:true,tipeText:ttNilai});
		this.crJurnal = new saiLabelEdit(this.pJurnal,{bound:[940,450,240,20],caption:"Total Kredit",readOnly:true,tipeText:ttNilai});
		

		this.bCJurnal.on("click", function(){
			self.pJurnal.hide();
			self.sgAddJurnal.clear(0);
			// self.nokon.setText("");
		});
		
	
		this.sg1.on("cellclick", function(sender, col, row, data, id){
			try{
				if (id != undefined){
					if ( col == 10){
					var node = $("#" + id);
						if (node != null){
							
							self.pJurnal.show();
							self.pJurnal.setTop(120);
							self.pJurnal.setLeft(50);	
							self.pJurnal.getCanvas().fadeIn("slow");

							self.app.services.callServices("financial_mantis","viewJurnalCOCD",[self.sg1.cells(0,row),"COCD",self.app._lokasi,self.sg1.cells(10,row)], function(data){
								
								if(data.jumlah == 0){
									system.alert(self, "data not found");
									self.pJurnal.hide();
								}else{
									
									var totdr = 0;
									var totcr = 0;

									$.each(data.draft, function(key, val){
										if(val.post_key == "40"){
											totdr += nilaiToFloat(val.loc_amount);
											var isi_post_key = "40 - Debet";
										}
										if(val.post_key == "50"){
											totcr += nilaiToFloat(val.loc_amount);
											var isi_post_key = "50 - Credit";
										}

										self.sgAddJurnal.addRowValues([isi_post_key,val.custven,val.nama_akun,val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);	
										
										self.drJurnal.setText(floatToNilai(nilaiToFloat(totdr)));
										self.crJurnal.setText(floatToNilai(nilaiToFloat(totcr)));

									});		

								

								}
							});
						
						}
					}
					else if ( col == 12){
						var node = $("#" + id);
							if (node != null){
								
								self.pJurnal.show();
								self.pJurnal.setTop(120);
								self.pJurnal.setLeft(50);	
								self.pJurnal.getCanvas().fadeIn("slow");
								
								self.app.services.callServices("financial_mantis","viewJurnalCOCD",[self.sg1.cells(0,row),"TP",self.app._lokasi,self.sg1.cells(12,row)], function(data){
									if(data.jumlah == 0){
										system.alert(self, "data not found");
										self.pJurnal.hide();
									}else{
										var totdr = 0;
										var totcr = 0;
										$.each(data.draft, function(key, val){
											if(val.post_key == "40"){
												totdr += nilaiToFloat(val.loc_amount);
												var isi_post_key = "40 - Debet";
											}
											if(val.post_key == "50"){
												totcr += nilaiToFloat(val.loc_amount);
												var isi_post_key = "50 - Credit";
											}
											self.sgAddJurnal.addRowValues([isi_post_key,val.custven,val.nama_akun,val.ba,val.keterangan,val.doc_amount,val.loc_amount,val.cost_center, val.profit_center]);		
										
											self.drJurnal.setText(floatToNilai(nilaiToFloat(totdr)));
											self.crJurnal.setText(floatToNilai(nilaiToFloat(totcr)));
										});		
									}
								});

							}
						}
					
					
				}
				
				
			}catch(e){
				alert(e);
			}
		});	

		
		this.bCariICM2.on("click",function(sender){
			self.pSearch.show();
			self.pSearch.setArrowMode(2);
			var node = sender.getCanvas();
			self.pSearch.setTop(node.offset().top + 20 );
			self.pSearch.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pSearch.getCanvas().fadeIn("slow");
		});

		this.pSearch = new control_popupForm(this.app);
		this.pSearch.setBound(0, 0,390, 250);
		this.pSearch.setArrowMode(4);
		this.pSearch.hide();
		var self = this;
	
		this.f1 = new saiLabelEdit(this.pSearch,{bound:[20,20,200,20],caption:"Periode",placeHolder:"YYYYMM"});
		this.sd = new label(this.pSearch, {bound:[225,20,40,20], caption:"s/d", bold: true, fontSize:9});		
		this.f2 = new saiLabelEdit(this.pSearch,{bound:[250,20,100,20],caption:"",labelWidth:0,placeHolder:"YYYYMM"});
		this.f3 = new saiLabelEdit(this.pSearch,{bound:[20,45,330,20],caption:"No ICM"});		
		this.f4 = new saiLabelEdit(this.pSearch,{bound:[20,70,330,20],caption:"Pekerjaan"});		
		this.f5 = new saiCB(this.pSearch,{bound:[20,95,330,20],caption:"Status", items:["Open","Clear","Unclear","Close"], });
	
	
		this.bOk = new button(this.pSearch, {bound:[180, 195,80,20], icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Search", click:[this,"doChange"]});
		this.bOk.setColor("#4cd137");
		this.bCancel = new button(this.pSearch, {bound:[270, 195,80,20], icon:"<i class='fa fa-times' style='color:white'></i>", caption:"Cancel"});
		this.bCancel.setColor("#e84393");
		this.bCancel.on("click", function(){
			self.pSearch.hide();
		});

		try{			
			var self=this;

			var thn = self.app._periode;
			var tahun = thn.substr(0,4);
			self.tahun.setText(tahun);

			
			self.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
					
			self.tp.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			
			self.jasa.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
			
			self.app._mainForm.bSimpan.setVisible(false);
			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);
			self.on("close",function(){
				self.app._mainForm.dashboard.refreshList();
				self.app._mainForm.bSimpan.setVisible(true);
				self.app._mainForm.bHapus.setVisible(true);
			self.app._mainForm.bClear.setVisible(true);
				// alert("tutup");
			});
			self.sg2.clear(1);
			// self.loadMonitoring({sts:"default"});
			this.RefreshList();
			// this.nTagih.setServices(this.app.servicesBpc, "callServices",["financial_Fca","getNoTagihanSAP",["",""]],["no_tagihan","nama_proyek"],"kode_lokasi='"+self.app._lokasi+"'","Daftar Tagihan");
		
			

		}catch(e){
			systemAPI.alert(e);
		}
		
	}
};
window.app_saku_modul_fInputICM.extend(window.childForm);
window.app_saku_modul_fInputICM.implement({	
	RefreshList : function(page){
		try{
			this.currentPage = page;
			var self  = this;
			console.log("haloooo");
			self.showLoading("Loading...");
			self.app.services.callServices("financial_mantis","getListInputICM",[self.app._lokasi,self.notif], function(data){
				console.log("haloooom2");
				self.sg1.clear();
				$.each(data, function(key, val){
					
					if(val.idheader_clear == "-" || val.idheader_clear == ""){
						var status = "Open";
					}else if( val.idheader_clear != "-" && ( val.jml_loc_terima == val.jml_loc_kirim ) ){
						var status = "Clear";
					}else if( val.idheader_clear != "-" && ( val.jml_loc_terima != val.jml_loc_kirim ) ){
						var status = "Unclear";
					}else if( val.status = "4"){
						var status = "Close";
					}
					// if(val.status == "1"){
					// 	var status = "Send"
					// }else if(val.status == "2"){
					// 	var status = "Received"
					// }else if(val.status == "3"){
					// 	var status = "Recurring";
					// }else if(val.status == "4"){
					// 	var status = "Done";
					// }

					if(self.app._lokasi == val.cc){
						var icon_recurring = "<center><i class='fa fa-paper-plane-o' style='color:brown;margin-top:2px'> </i>";
					}else{
						var icon_recurring = "-";
					}
					self.sg1.addRowValues([ val.icm, val.cc, val.tp, val.year+val.month, val.kode_jasa, val.jenis_jasa, val.pekerjaan, val.currency, val.fcbp, status, val.idheader, "<center><i class='fa fa-paper-plane ' style='color:green;margin-top:2px'> </i>", val.idheader_clear, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>", icon_recurring ]);
				});
				self.hideLoading();
			});
		}catch(e){
			console.log(e);
		}
	},
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisReport", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
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
					
					var self = this;
					var data = {
						no_tagihan : this.nTagih.getText(), 
						no_sap : this.noSAP.getText(),
						no_spb : "-",												
					};

					// var data1 = [];
					// for (var i = 0; i < this.sg1.getRowCount();i++){				
					// 	var item1 = {
					// 		bln : this.sg1.cells(0,i), 
					// 		cc : this.sg1.cells(1,i),
					// 		akun : this.sg1.cells(3,i),
					// 		nilai : this.sg1.cells(5,i),
					// 		jenis : this.sg1.cells(6,i),
					// 		target : this.sg1.cells(7,i),
					// 		status : this.sg1.cells(8,i),
					// 		dc : "D",
							
							
					// 	};
					// 	data1.push(item1);
					// }
					
					// self.app.services.callServices("financial_Fca","editSAP", [data,self.regid.getText(),self.statusbaru.getText()] ,function(data){
					// 	if (data == "process completed") {
					// 		system.info(self, data,"");
					// 		self.app._mainForm.bClear.click();
					// 		self.noSAP.setText("");
					// 		self.nTagih.setText("");
					// 		page = self.sg1.page;
					// 		row = ((page-1) * self.sg1.rowPerPage)+row;
					// 		self.tab.setActivePage(self.tab.childPage[0]);
					// 		self.RefreshList();
							
							
					// 	}else {
					// 		system.alert(self, data,"");
					// 	}
					// });

					
				}catch(e){
					system.alert(this, e,"");
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	hapus: function(){
		try{
			if (this.standarLib.checkEmptyByTag(this, [0])){
				try {

				}
				catch(e){
					system.alert(this, e,"");
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	doChange: function(sender){
		try{			
			
			if (sender == this.bOk){				
				var self = this;					
				if (self.f1.getText() == "" && self.f2.getText() == "" && self.f3.getText() == "" && self.f4.getText() == "" && self.f5.getText() == "" ){
						system.alert(self, "Inputan Tidak Boleh Kosong");
					}else{
						var self = this;	
						self.app.services.callServices("financial_mantis","cariICM2",[self.f1.getText(),self.f2.getText(),self.f3.getText(),self.f4.getText(),self.f5.getText(),self.app._lokasi], function(data){
							self.sg1.clear(0);
								$.each(data, function(key, val){
									if(val.idheader_clear == "-" || val.idheader_clear == ""){
										var status = "Open";
									}else if( val.idheader_clear != "-" && ( val.jml_loc_terima == val.jml_loc_kirim ) ){
										var status = "Clear";
									}else if( val.idheader_clear != "-" && ( val.jml_loc_terima != val.jml_loc_kirim ) ){
										var status = "Unclear";
									}else if( val.status = "4"){
										var status = "Close";
									}

									// if(val.status == "1"){
									// 	var status = "Send"
									// }else if(val.status == "2"){
									// 	var status = "Received"
									// }else if(val.status == "3"){
									// 	var status = "Recurring";
									// }else if(val.status == "4"){
									// 	var status = "Done";
									// }
				
									if(self.app._lokasi == val.cc){
										var icon_recurring = "<center><i class='fa fa-paper-plane-o' style='color:brown;margin-top:2px'> </i>";
									}else{
										var icon_recurring = "-";
									}
									self.sg1.addRowValues([ val.icm, val.cc, val.tp, val.year+val.month, val.kode_jasa, val.jenis_jasa, val.pekerjaan, val.currency, val.fcbp, status, val.idheader, "<center><i class='fa fa-paper-plane ' style='color:green;margin-top:2px'> </i>", val.idheader_clear, "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>","<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>", icon_recurring ]);
								
								});
						});
						self.pSearch.hide();
						self.f1.setText("");						
						self.f2.setText("");
						self.f3.setText("");						
						self.f4.setText("");
						self.f5.setText("");	
					
					}
			}

			if (sender == this.bulan){	
				// alert("halo");			
				var self = this;					
				if (self.cocd.getText() == "" && self.tahun.getText() == "" && self.bulan.getText() == "" ){
						system.alert(self, "Harap Isi tahun dan Bulan terlebih Dahulu");
					}else{
						var self = this;
						// alert("halo1");		
						self.app.services.callServices("financial_mantis","getDataLock",[self.cocd.getText() , self.tahun.getText() , self.bulan.getText()], function(data){
								$.each(data, function(key, val){
									console.log("tahun "+data.draft.year);
									console.log("tahun "+self.tahun.getText());

									console.log("bulan "+data.draft.bulan);
									console.log("bulan "+self.bulan.getText());

									if( (data.draft.year == self.tahun.getText()) && (data.draft.bulan == self.bulan.getText()) ){
										system.alert(self, "Bulan "+self.bulan.getText()+" di Tahun "+self.tahun.getText()+" Untuk COCCD "+self.cocd.getText()+" Sudah Di Lock Admin!");
										self.bulan.setText("");
									}
									
								});
						});
					}
			}


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
