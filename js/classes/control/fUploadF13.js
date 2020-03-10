window.app_bpcc_transaksi_fUploadF13 = function(owner)
{
	if (owner)
	{
		window.app_bpcc_transaksi_fUploadF13.prototype.parent.constructor.call(this,owner);
		this.className  = "app_bpcc_transaksi_fUploadF13";
		this.setTop(30);
		this.maximize();
		this.itemsValue = new arrayList();
		
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Upload Data Hutang (F13)", 0);	
		
//------------------------------------------------------------------------
		uses("saiCBBL;datePicker;checkBox;popupForm;saiUpload",true);
		var self = this;//where kode_lokasi = '"+this.app._lokasi +"' 
		this.eCocd = new saiCBBL(this, {bound:[20,3,200,20], caption:"Lokasi", 
						sql : ["select cocd, nama from bpc_lokasi ",["cocd","nama"],false,["Kode","Keterangan"],"","Daftar Company Code",true]
					});
		this.eCocd.on("change", function(){
			self.eVendor1.setSQL("select kode_vendor, nama from bpc_vendor_ap where kode_lokasi = '"+ self.eCocd.getText() +"'  ",["kode_vendor","nama"],false,["Kode","Keterangan"],"","Daftar Vendor",true);
			self.eVendor2.setSQL("select kode_vendor, nama from bpc_vendor_ap where kode_lokasi = '"+ self.eCocd.getText() +"'  ",["kode_vendor","nama"],false,["Kode","Keterangan"],"","Daftar Vendor",true);
		});
        this.ePeriode = new saiLabelEdit(this, {bound:[20,2,200,20], caption:"Periode"});
		this.eFile = new saiLabelEdit(this, {bound:[20,3,400,20], caption: "File Upload"});
		this.eUpload = new saiUpload(this, {bound:[430,3,80,20]});
		this.eUpload.on("change", function (file){
			if (self.eCocd.getText() == ""){
				self.alert("Company Code belum terisi","Silahkan isi terlebih dahulu company code", function(){
					self.eCocd.setFocus();
				});
				return;
			}
			if (self.ePeriode.getText() == ""){
				self.alert("Periode belum terisi","Silahkan isi terlebih dahulu Periode", function(){
					self.ePeriode.setFocus();
				});
				return;
			}
			self.eUpload.setAddParam({cek:"vendor", cc: self.eCocd.getText(), periode: self.ePeriode.getText()});
			self.eFile.setText(file);
			self.eUpload.submit();
		});
		this.eUpload.on("onload", function(data){
			var colTitle = [{title : "Kode Vendor", width: 80, readOnly:false},
							{title : "Desk Upload", width: 200, readOnly: true},
							{title : "Desk. Master", width: 200, readOnly: false},
							{title : "Mata Uang", width: 100, readOnly: true},
                            {title : "Nilai Currency", width: 100, readOnly: true, format:cfNilai},
                            {title : "Kurs", width: 60, readOnly: true, format:cfNilai},
                            {title : "Nilai IDR", width: 100, readOnly: true, format:cfNilai},
							{title : "Akun", width: 100, readOnly: false, format:cfNilai}];
			var colFormat = [[4,5,6],[cfNilai, cfNilai, cfNilai]];
			self.sg.clear();
            self.sg.setColCount(colTitle.length);
            self.sg.setColTitle(colTitle);
            self.sg.setColFormat(colFormat[0],colFormat[1]);
            self.sg.rearrange(0);

			var line1 = data.contents[0][0];
			if (line1[0] != self.eCocd.getText()){
				self.alert("File Security Error","Pastikan file sesuai dengan template upload. Company Code File "+ line1[0], function(){
					self.eCocd.setFocus();
				});
			}
			if (line1[1] != self.ePeriode.getText()){
				self.alert("File Security Error","Pastikan file sesuai dengan template upload. Periode File "+line1[1], function(){
					self.eCocd.setFocus();
				});
			}
			self.sg.clear();
			var listError = [];
			var total = 0;
			for (var i = 6; i <= data.contents.length;i++){
				if (data.contents[i] != null){
					var line = data.contents[i][0];
					console.log(i+ "."+ JSON.stringify(line) );
					if (line[1] != null && line[1].substr(0,1) == "V") {
						
						if (line[5] == null ) line[5] = 0;
						if (line[7] == null){
							line[7] = "-";
							listError.push("Akun blank "+ line[2]);
						}		
						if (data.contents[i][1] == null)
							data.contents[i][1] = "-";
						self.sg.appendData([line[1], line[2], data.contents[i][1], line[3], line[4], line[5] , line[6], line[7]]);
						total += parseFloat(line[6]);
					}
				}
			}
			self.lTotal.setCaption(floatToNilai(total));
			if (listError.length > 0){
				self.alert("Akun blank", "Akun hutang tidak terisi.<br>"+listError, function(){
				});
			}
			//self.app._mainForm.bSimpan.setEnable(true);
		});
		this.bReload = new button(this,{bound:[20,4,80,20], caption:"Reload"});
		this.bReload.on("click",function(sender){
			self.loadVendor(1);
		});
		this.bSynch = new button(this,{bound:[780,4,120,20], caption:"Get SAP Detail"});
        this.bSynch.on("click", function(){
			self.pFilter.show();
        });
		
		
		this.sg = new saiGrid(this, {
				bound: [20, 2, 900, 400],
				colCount: 8,headerHeight:40,
				colTitle: [ {title : "Kode Vendor", width: 80, readOnly:false},
							{title : "Desk Upload", width: 200, readOnly: true},
							{title : "Desk. Master", width: 200, readOnly: false},
							{title : "Mata Uang", width: 100, readOnly: true},
                            {title : "Nilai Currency", width: 100, readOnly: true, format:cfNilai},
                            {title : "Kurs", width: 60, readOnly: true, format:cfNilai},
                            {title : "Nilai IDR", width: 100, readOnly: true, format:cfNilai},
							{title : "Akun", width: 100, readOnly: false, format:cfNilai}
						 ],
				readOnly: false,
				change: [this, "doGridChange"],
				rowCount: 1,
				tag: 9,
				colFormat:[[4,5,6],[cfNilai, cfNilai, cfNilai]],
				autoPaging : true, rowPerPage:1000, pasteEnable:true,
				afterPaste:[this,"doAfterPaste"],
				pager:[this,"doPager"],
		});
		this.sg.on("keyup", function(col, row, value, id){
				try{
					console.log("KyeUp "+col + ":" + row);
					if (id != undefined){
						if ( col == 0 || col == 2){
							var node = $("#" + id);
							if (node != null){
								self.puListData.show();
								
								self.puListData.setTop(node.offset().top + 20);
								self.puListData.setLeft(node.offset().left + 10);	
								self.puListData.getCanvas().fadeIn("slow");
								self.puListData.setArrowPosition(5, 40);
								
							}
						}else self.puListData.hide();
					}
					
				}catch(e){
					alert(e);
				}
			});	

		this.puListData = new popupForm(this.app);
		this.puListData = new control_popupForm(this.app);
		this.puListData.setBound(0, 0,400, 170);
		this.puListData.setArrowMode(2);
		self.puListData.setTop(185);
		self.puListData.setLeft(470);
		this.puListData.hide();

		this.sgFilter = new saiGrid(this.puListData, {bound:[10,10,380,130],
				colCount: 2,headerHeight:20,
				colTitle: [ {title : "Kode Vendor", width: 80, readOnly:true},
							{title : "Desk", width: 300, readOnly: true},
						 ],
				readOnly: false
			});

		this.sgFilter.hideNavigator();
		this.pNavigator = new panel(this, {
				bound:[20,20,900,40],
				color:"#ababab"		
			});
		this.l1 = new label(this.pNavigator, {bound:[580, 10, 140, 20], caption: "Total (IDR) :", fontSize: 16, color:"#ffffff"});
		this.lTotal = new label(this.pNavigator, {bound:[680,10,200,20], caption:"0", alignment:"right", fontSize: 16, color:"#ffffff"});

		this.bFirst = new button(this.pNavigator, {bound:[0,0,40,40], caption:"<<", visible:false});
		this.bFirst.on("click", function(){
			self.loadVendor(1);
		});
		this.bPrev = new button(this.pNavigator, {bound:[42,0,40,40], caption:"<", visible:false});
		this.bPrev.on("click", function(){
			var page = self.currentPage;
			if (self.currentPage > 1)
				page = self.currentPage - 1;  
			self.loadVendor(page);
		});
		this.bCurrent = new button(this.pNavigator, {bound:[84,0,40,40], caption:" ", visible:false});
		this.bNext = new button(this.pNavigator, {bound:[126,0,40,40], caption:">", visible:false});
		this.bNext.on("click", function(){
			var page = self.currentPage;
			if (self.currentPage < self.maxPage)
				page = self.currentPage + 1;
			self.loadVendor(page);
		});
		this.bLast = new button(this.pNavigator, {bound:[168,0,40,40], caption:">>", visible:false});
		this.bLast.on("click", function(){
			self.loadVendor(self.maxPage);
		});
		this.rearrangeChild(20,23);		
		
		this.pFilter = new control_popupForm(this.app);
		this.pFilter.setBound(0, 0,400, 150);
		this.pFilter.setArrowMode(2);
		self.pFilter.setTop(210);
		self.pFilter.setLeft(670);
				
		this.pFilter.hide();
			
		this.eVendor1 = new saiCBBL(this.pFilter, {bound:[20,20,160,20],  caption:"Vendor", labelWidth: 60});
		this.eVendor2 = new saiCBBL(this.pFilter, {bound:[190,20,140,20], labelWidth: 40,caption:" s / d"});
		this.eTgl = new saiLabelEdit(this.pFilter, {bound:[20,43, 160, 20], caption:"Tanggal", labelWidth: 60});
		
		this.pBottom = new panel(this.pFilter, {bound:[0,90,400,46], color:"#efefef"});
		this.eProc = new button(this.pBottom, {bound:[230, 10, 160,20], caption:"Sinkronisasi"});
		this.eCancel = new button(this.pBottom, {bound:[140, 10, 80,20], caption:"Cancel"});
		this.eCancel.on("click", function(){
			self.pFilter.hide();
		});
		self.fromRFC = false;
		this.eProc.on("click", function(sender){
			try{
				self.pFilter.hide();
				//$compCode, $tgl, $periode, $kurs2, $vendor1, $vendor2
				self.showLoading();
				self.app.services.call("getDataAPFromRFC",[self.eCocd.getText(), self.eTgl.getText(), self.ePeriode.getText(), 0, self.eVendor1.getText(), self.eVendor2.getText()], function(data){
					try{
						self.hideLoading();
						self.loadVendorDetail(1);
						self.info("Retrieve data SAP selesai.",data, function(){});
						//self.app._mainForm.bSimpan.setEnable(false);
						self.fromRFC = true;
					}catch(e){
						alert(e);
					}
				}, function(){
					self.hideLoading();
				});
			}catch(e){
				alert(e);
			}
		});
				
		this.setTabChildIndex();
		try
		{
			this.dbLib = new util_dbLib();
			this.dbLib.addListener(this);
			this.standarLib = new util_standar();
		}catch(e)
		{
			alert(e);
		}
	}
};
window.app_bpcc_transaksi_fUploadF13.extend(window.childForm);
//------------------------------------------------------------------ event
window.app_bpcc_transaksi_fUploadF13.implement({
	loadVendor : function(page){
		try{
			
			this.currentPage = page;
			var self  = this;
			this.app.services.call("getListAP",[this.eCocd.getText(), this.ePeriode.getText()], function(data){
					self.sg.clear();
					self.bCurrent.setCaption(page);
					self.maxPage = data.maxpage;
					var total = 0;
					for (var i = 0; i < data.rs.rows.length; i++){
						var line = data.rs.rows[i];
						self.sg.appendData([line.kode_vendor, line.nama, '-', line.curr, line.nilai_orig, line.kurs , line.nilai, line.kode_akun]);
						total += parseFloat(line.nilai);
					}
					self.sg.setNoUrut(0);
					self.lTotal.setCaption(floatToNilai(total));
				});
		}catch(e){
			alert(e);
		}
		
	},
	loadVendorDetail : function(page){
		try{
			var colTitle = [{title : "Kode Vendor", width: 80, readOnly:false},
							{title : "Desk Upload", width: 200, readOnly: true},
							{title : "Kode Group", width: 80, readOnly: false},
							{title : "Desk. Master", width: 200, readOnly: false},
							{title : "Mata Uang", width: 100, readOnly: true},
                            {title : "Nilai Currency", width: 100, readOnly: true, format:cfNilai},
                            {title : "Kurs", width: 60, readOnly: true, format:cfNilai},
                            {title : "Nilai IDR", width: 100, readOnly: true, format:cfNilai},
							{title : "Akun", width: 100, readOnly: false, format:cfNilai}];
			var colFormat = [[5,6,7],[cfNilai, cfNilai, cfNilai]];
			this.sg.clear();
            this.sg.setColCount(colTitle.length);
            this.sg.setColTitle(colTitle);
            this.sg.setColFormat(colFormat[0],colFormat[1]);
            this.sg.rearrange(0);

			this.currentPage = page;
			var self  = this;
			this.app.services.call("getListAPDetail",[this.eCocd.getText(),  this.ePeriode.getText()], function(data){
					self.sg.clear();
					self.bCurrent.setCaption(page);
					self.maxPage = data.maxpage;
					var total = 0;
					for (var i = 0; i < data.rs.rows.length; i++){
						var line = data.rs.rows[i];
						self.sg.appendData([line.kode_vendor, line.nama, line.kode_group, line.nm_group, line.curr, line.nilai_orig, line.kurs , line.nilai, line.kode_akun]);
						total += parseFloat(line.nilai);
					}
					self.sg.setNoUrut((page - 1) * 50 );
					self.lTotal.setCaption(floatToNilai(total));
				});
		}catch(e){
			alert(e);
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
	doModalResult: function(event, modalResult){
		switch (event)
		{
			case "clear" :
				if (modalResult == mrOk)
				{
								
					
				}
				break;
			case "simpan" :
				if (modalResult == mrOk)
				{
					try
					{
						if (this.fromRFC ){
							this.app.services.call("saveRFCAPDetail",[this.eCocd.getText(), this.eTgl.getText(), this.ePeriode.getText()], function(data){
								system.info(this, data);
							});
						}else {
							var data = [];
							for (var i =0; i < this.sg.getRowCount();i++){
								data.push({vendor : this.sg.cells(0,i), nama: this.sg.cells(1,i), curr: this.sg.cells(3,i), nilai_orig: this.sg.cells(4,i), kurs :this.sg.cells(5,i), nilai :this.sg.cells(6,i), akun :this.sg.cells(7,i)});
							}
							this.app.services.uploadDataAP(this.app._userLog, this.eCocd.getText(), data,this.ePeriode.getText(), function(data){
								system.info(this, data);
							}); 
						}
						
                        
					}
					catch(e)
					{
						system.alert(this, e,"");
					}
				}
				break;
			case "ubah" :
				break;
			case "hapus" :
			   if (modalResult == mrOk)
			   {
				    try
					{
						
					}
					catch(e)
					{
						system.alert(this, e,"");
					}
			   }
				break;
		}
		
	}
});
