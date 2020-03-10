window.app_bpcc_master_fDataVendor = function(owner)
{
	if (owner)
	{
		window.app_bpcc_master_fDataVendor.prototype.parent.constructor.call(this,owner);
		this.className  = "app_bpcc_master_fDataVendor";
		this.setTop(0);
		this.maximize();
		this.itemsValue = new arrayList();
		
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Data Vendor Comp Code", 0);	
		
//------------------------------------------------------------------------
		uses("saiCBBL;datePicker;checkBox;control_popupForm",true);
		try
		{
			var self = this;
			this.eLokasi = new saiCBBL(this, {bound:[20,3,200,20], caption:"Lokasi", 
							sql : ["select kode_lokasi, nama from bpc_lokasi ",["kode_lokasi","nama"],false,["Kode","Keterangan"],"","Daftar Company Code",true]
						});
			this.eLokasi.on("change", function(sender){
				try{
					self.app.services.getCompCode(self.eLokasi.getText(), function(data){
						self.eCocd.setText(data);
					});	
				}catch(e){
					console.log(e);
				}
				
			});
			this.eCocd = new saiLabelEdit(this, {bound:[20,1,200,20], caption:"Comp Code", readOnly:true});
			this.bReload = new button(this,{bound:[20,4,80,20], caption:"Reload", click:[this,"doReload"]});
			this.bReload.on("click",function(sender){
				self.loadVendor(1);
			});
			this.bSynch = new button(this,{bound:[640,4,80,20], caption:"Sinkron SAP", click:[this,"doReload"]});
			this.bSynch.on("click",function(sender){
				self.showLoading();
				self.app.services.getDataVendor(self.eCocd.getText(), function(data){
					if (data == "process completed"){
						self.loadVendor(1);
						
					}
					self.hideLoading();
				}, function(){
					self.hideLoading();
				});
			});
			this.sg = new saiGrid(this, {
					bound: [20, 2, 700, 400],
					colCount: 6,headerHeight:40,
					colTitle: [ {title : "Kode Vendor", width: 80, readOnly:true},
								{title : "Nama", width: 200, readOnly: true},
								{title : "Related", width: 100, readOnly: true},
								{title : "Kode Group", width: 100, readOnly: true},
								{title : "Group", width: 100, readOnly: true},
								{title : "Edit", width: 80, readOnly: true, align:"cneter"},
							],
					readOnly: false,
					change: [this, "doGridChange"],
					rowCount: 1,
					tag: 9,
					autoPaging : true, rowPerPage:50, pasteEnable:true, afterPaste:[this,"doAfterPaste"],
					pager:[this,"doPager"],
					ellipsClick: [this,"doEllipsClick"],
					keyDown: [this,"doSearchSI"],
					dblClick:[this, "doGenerateKode"]
				});
			this.sg.hideNavigator();
			this.pNavigator = new panel(this, {
					bound:[20,20,700,40],
					color:"#ababab"		
				});
			this.pNavigator.setBorder(0);
			this.bFirst = new button(this.pNavigator, {bound:[0,0,40,40], caption:"<<"});
			this.bFirst.on("click", function(){
				self.loadVendor(1);
			});
			this.bPrev = new button(this.pNavigator, {bound:[42,0,40,40], caption:"<"});
			this.bPrev.on("click", function(){
				var page = self.currentPage;
				if (self.currentPage > 1)
					page = self.currentPage - 1;  
				self.loadVendor(page);
			});
			this.bCurrent = new button(this.pNavigator, {bound:[84,0,40,40], caption:" "});
			this.bNext = new button(this.pNavigator, {bound:[126,0,40,40], caption:">"});
			this.bNext.on("click", function(){
				var page = self.currentPage;
				if (self.currentPage < self.maxPage)
					page = self.currentPage + 1;
				self.loadVendor(page);
			});
			this.bLast = new button(this.pNavigator, {bound:[168,0,40,40], caption:">>"});
			this.bLast.on("click", function(){
				self.loadVendor(self.maxPage);
			});
			this.eFilter = new saiLabelEdit(this.pNavigator, {bound:[this.pNavigator.width - 250, 10,200,20],caption:"Search...", placeHolder:true});
			this.eImage = new image(this.pNavigator, {bound:[this.pNavigator.width - 30, 10,20,20], image:"icon/search2.png" });
			
			this.rearrangeChild(20,23);		
			
			this.pRelated = new control_popupForm(this.app);
			this.pRelated.setBound(0, 0,300, 150);
			this.pRelated.setArrowMode(4);
			this.pRelated.hide();
			
			this.l1 = new label(this.pRelated, {bound:[20,15,100,20], caption:""});
			this.l2 = new label(this.pRelated, {bound:[120,15,200,20], caption:""});
			
			this.cbRelated = new checkBox(this.pRelated, {bound:[20,37,80,20], caption:"Related"});
			this.cbGroup = new saiCBBL(this.pRelated, {bound:[20,65,200,20], caption:"Group", 
				sql : ["select kode_vendor, nama from bpc_vendor_group  ",["kode_vendor","nama"],false,["Kode","Nama"],"","Daftar Vendor Group",true]
			});
			
			this.bOk = new button(this.pRelated, {bound:[20, 90,80,20], caption:"OK"});
			this.bOk.on("click", function(){
				
				self.pRelated.hide();
			});
			this.bCancel = new button(this.pRelated, {bound:[120, 90,80,20], caption:"Cancel"});
			this.bCancel.on("click", function(){
				self.pRelated.hide();
			});
			
			this.setTabChildIndex();
			this.sg.on("scroll", function(sender, event){
				try{
					self.pRelated.hide();
				}catch(e){
					alert(e);
				}
				
			});
			this.sg.on("cellclick", function(sender, col, row, id){
				try{
					if (id != undefined){
						if ( col == 5){
							var node = $("#" + id);
							if (node != null){
								self.pRelated.show();
								self.pRelated.setTop(node.offset().top - 55 - 86 );
								self.pRelated.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
								self.pRelated.getCanvas().fadeIn("slow");
								self.cbRelated.setSelected(self.sg.cells(2,row) == "0" ? false : true );
								self.l1.setCaption(self.sg.cells(0, row));
								self.l2.setCaption(self.sg.cells(1, row));
								self.cbGroup.setText(self.sg.cells(3,row));
							}
						}else self.pRelated.hide();
						
						self.cbRelated.setTag(self.sg.cells(0,row));
					}
					
					
				}catch(e){
					alert(e);
				}
			});		
		
		
			this.dbLib = new util_dbLib();
			this.dbLib.addListener(this);
			this.standarLib = new util_standar();
			this.eLokasi.setText(this.app._lokasi);
			
			if (this.app._statusUser == "FC"){
				this.eLokasi.setSQL("select kode_lokasi, nama from bpc_lokasi ",["kode_lokasi","nama"],false,["Kode","Keterangan"],"","Daftar Lokasi",true);
			}else this.eLokasi.setSQL("select kode_lokasi, nama from bpc_lokasi where kode_lokasi = '"+this.app._lokasi+"' ",["kode_lokasi","nama"],false,["Kode","Keterangan"],"","Daftar Company Code",true);
		}catch(e)
		{
			alert(e);
		}
	}
};
window.app_bpcc_master_fDataVendor.extend(window.childForm);
//------------------------------------------------------------------ event
window.app_bpcc_master_fDataVendor.implement({
	loadVendor : function(page){
		this.currentPage = page;
		var self  = this;
		this.app.services.getListVendor(this.eLokasi.getText(), 50, page, function(data){
				self.sg.clear();
				self.bCurrent.setCaption(page);
				self.maxPage = data.maxpage;
				for (var i = 0; i < data.rs.rows.length; i++){
					var line = data.rs.rows[i];
					self.sg.appendData([line.kode_vendor, line.nama, line.related, line.kode_group, line.nm_group, "<img src='icon/tooltip-edit.svg' width='18' style='color:#999999' />"]);
				}
				self.sg.setNoUrut((page - 1) * 50 );
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
						var data = [];
						for (var i =0; i < this.sg.getRowCount();i++){
							data.push({vendor : this.sg.cells(0,i), nama: this.sg.cells(1,i), flag: this.sg.cells(2,i), group :this.sg.cells(4,i)});
						}
                        this.app.services.uploadDataVendor(this.eLokasi.getText(), this.app._userLog,  data, function(data){
							system.info(this, data);
						}); 
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
		
	},
	doSearchSI: function(sender, col, row, value){
		if (col == 0){
			if (value.length >= 2){
				var self = this;
				this.app.services.listSI(value, this.thn.getText(), function(data){
					if (data.rs.rows[0])
						sender.cells(1,row, data.rs.rows[0].nama);
				});			
			}
		}
	},
	doGenerateKode: function(sender, col, row){
		if (col == 2){
			var self = this;
			
			
		}
	},
	doGridChange: function(){
		
	},
	doReload: function(sender){
		var self = this;
		this.app.services.listMapAKun(this.eLokasi.getText(), this.thn.getText(), function(result){
				self.sg.clear();
				self.dataProgramLama = new arrayMap();
				for (var i = 0; i < result.rs.rows.length; i++){
					var line = result.rs.rows[i];
					self.sg.appendData([line.kode_induk, line.si, line.kode_si, line.nama, line.utama.toUpperCase()]);
					self.dataProgramLama.set(i, line);
				}
			});
	},
	doSimulate: function(){
		var self = this;
		var node;
		this.treev.clear();
		this.sg.rowDone = new arrayMap();
		this.app.services.listStrukturSI(this.thn.getText(), function(result){
			for (var i = 0; i < result.rs.rows.length; i++){
				var line = result.rs.rows[i];
				var level = line.level_spasi;
				level++;
				if (node == undefined)
					node = new treeNode(self.treev);
				else if ((node instanceof treeNode) && (node.getLevel() == level - 1))
					node = new treeNode(node);
				else if ((node instanceof treeNode) && (node.getLevel() == level))
					node = new treeNode(node.owner);
				else if ((node instanceof treeNode) && (node.getLevel() > level))
				{	
					if (!(node.owner instanceof treeView))
					{
						node = node.owner;
						while (node.getLevel() > level)
						{
							if (node.owner instanceof treeNode)
								node = node.owner;
						}
					}	
					node = new treeNode(node.owner);				
				}
				node.setKodeForm('-');
				node.setKode(line.kode_si);
				node.setCaption(line.nama);
				node.setShowKode(true);
				node.data = line;
				//loop to grid
				for (var l = 0; l < self.sg.getRowCount();l++){
					if (self.sg.rowDone.get(l) === undefined && self.sg.cells(0,l) == line.kode_si){
						self.sg.rowDone.set(l, true);
						var nodeItem = new treeNode(node);
						nodeItem.setKodeForm('-');
						nodeItem.setKode(self.sg.cells(2,l) );
						nodeItem.setCaption(self.sg.cells(3,l));
						if (self.sg.cells(4,l) === "TRUE"){
							nodeItem.setIcon("icon/star.png");
						}
						nodeItem.setShowKode(true);
						nodeItem.data = self.sg.rowData.get(l);
					}
				}		
				
			}
		});
	},
	doPager: function(sender, page){
		sender.doSelectPage(page);
	},
	doEllipsClick: function(sender, col, row){
		try{
			this.standarLib.showListDataForSG(this, "Find Strategic Initiative", sender, row, col
						, sender.bottomColumns.get(col).sql
						, "select count(*) from ("+sender.bottomColumns.get(col).sql+")"
						, ["kode_si","nama"]
						, ""
						, ["kode","nama"]
						, false
						, false
						, false
						);	
		}catch(e){
			alert(e);
		}
	},
	keyPress: function(sender, charCode, buttonState ){
	},
	doGenerate: function(sender){
		var data = this.dbLib.getDataProvider("select max(kode_prog) as kd from bpc_program where kode_prog like '"+this.thn.getText().substr(3,1)+this.idUbis+"%'", true);
		var nb = "";
		if (typeof data != "string" && data.rs.rows[0])
		{	
			var nb = data.rs.rows[0].kd;
		}		
		
	},
	doChange : function(sender){
		
		
	},
	doEditChange: function(sender){
		if (this.e0.getText() != "")
		{
			try
			{			
				var data = this.dbLib.getDataProvider("select * from bpc_si where kode_si = '"+this.e0.getText()+"'   ", true);
							
				if (typeof data != "string" && data.rs.rows[0])
				{				
					
					this.e1.setText(data.rs.rows[0].nama);
					this.e2.setText(data.rs.rows[0].kelompok);;
						
				}
			}catch(e)
			{
				system.alert(this, e,"");
			}
		}
	},
	
	doRequestReady: function(sender, methodName, result){	
		if (sender == this.dbLib)
		{
			switch	(methodName)
			{
				case "execArraySQL" :
					if (result.toLowerCase().search("error") == -1){
						system.info(this,"Transaksi Sukses","");
						this.doModalResult("clear",mrOk);						
					}else system.alert(this, result,""); 
					break;
			}
		}
	}
});
