window.app_bpcc_master_fSAPCON = function(owner)
{
	if (owner)
	{
		window.app_bpcc_master_fSAPCON.prototype.parent.constructor.call(this,owner);
		this.className  = "app_bpcc_master_fSAPCON";
		this.setTop(0);
		this.maximize();
		this.itemsValue = new arrayList();
		
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Data Koneksi SAP", 99);	
		
//------------------------------------------------------------------------
		uses("saiCBBL;datePicker;checkBox;control_popupForm",true);
		try
		{
			var self = this;
            this.bReload = new button(this,{bound:[20, 10, 120,20], caption:"Display Data"});
            this.bReload.on("click", function(){
                self.loadData();
            });
			this.bAdd = new button(this,{bound:[150, 10, 50,20], caption:"Add"});
            this.bAdd.on("click", function(sender){
                self.pRelated.show();
                var pos = sender.getCanvas().offset();
                self.pRelated.setTop(pos.top + 20);
                self.pRelated.setLeft(20);
                self.pRelated.setArrowPosition(5, 20);	
                self.pRelated.getCanvas().fadeIn("slow");
            });

            this.pRelated = new control_popupForm(this.app);
			this.pRelated.setBound(0, 0,500, 250);
			this.pRelated.setArrowMode(2);
			this.pRelated.hide();
            this.pRelated.getClientCanvas().css({overflow:"hidden"});

            this.eKode = new saiCBBL(this.pRelated, {bound:[20, 1, 200,20], caption:"Kode"});
			this.eNama = new saiLabelEdit(this.pRelated, {bound:[20,3,400,20], caption:"Deskripsi"});
            this.eIP = new saiLabelEdit(this.pRelated, {bound:[20,4,400,20], caption:"IP"});
            this.eSys = new saiLabelEdit(this.pRelated, {bound:[20,5,400,20], caption:"System Num."});
            this.eClient = new saiLabelEdit(this.pRelated, {bound:[20,6,400,20], caption:"Client ID"});
            this.eRouter = new saiLabelEdit(this.pRelated, {bound:[20,3,400,20], caption:"SAP Router"});

            this.pBlank = new panel(this.pRelated, {bound:[0, 4, 500,80], color:"#efefef", border:0});
            this.pBlank.getClientCanvas().css({overflow:"hidden", borderTop :"1px solid #cfcfcf"});
            
            this.eKode.on("change", function(sender){
                self.app.services.call("getSAPConn",[self.eKode.getText()], function(data){
                    if (data != null){
                        self.eNama.setText(data.desk);
                        self.eIP.setText(data.ip);
                        self.eSys.setText(data.sys_id);
                        self.eClient.setText(data.ins_num);
                        self.eRouter.setText(data.sap_router);
                    }
                });
            });
			this.bOk = new button(this.pBlank, {bound:[20, 20,80,20], caption:"OK"});
            this.bOk.on("click", function(){
				try{
					self.app.services.call("addSAPConn", [self.eKode.getText(), self.eNama.getText(), self.eIP.getText(), self.eSys.getText(), self.eClient.getText(), self.eRouter.getText(), self.app._userLog], function(data){
						self.loadData();
					});
				}catch(e){
					alert(e);
				}
            });
            this.bCancel = new button(this.pBlank, {bound:[120,20,100,20], caption:"Cancel"});
            this.bCancel.on("click", function(){
                self.pRelated.hide();
            });

            
            this.pRelated.rearrangeChild(20,23);
            this.pBlank.setTop(250 - 80);
            this.sg = new saiGrid(this, {
					bound: [20, 2, 900, 400],
					colCount: 6,headerHeight:40,
					colTitle: [ {title : "Kode", width: 80, readOnly:true, buttonStyle: bsEdit},
								{title : "Deskripsi", width: 400, readOnly: true},
                                {title : "IP", width: 100, readOnly: true},
                                {title : "Sys. Num", width: 100, readOnly: true},
                                {title : "Client ID", width: 100, readOnly: true},
                                {title : "Router", width: 300, readOnly: true}
							],
					readOnly: false,
					rowCount: 1,
					tag: 9,
					autoPaging : true, rowPerPage:50, pasteEnable:true, afterPaste:[this,"doAfterPaste"]
				}); 
            
            this.sg.hideNavigator();

			this.rearrangeChild(20,23);		
			this.setTabChildIndex();
			
			this.dbLib = new util_dbLib();
			this.dbLib.addListener(this);
			this.standarLib = new util_standar();
			//this.eLokasi.setText(this.app._lokasi);
			
			this.eKode.setSQL("select kode, desk from bpc_sapconn",["kode","desk"],false,["Kode","Keterangan"],"","Daftar Koneksi SAP",false);
			
		}catch(e)
		{
			alert(e);
		}
	}
};
window.app_bpcc_master_fSAPCON.extend(window.childForm);
//------------------------------------------------------------------ event
window.app_bpcc_master_fSAPCON.implement({
    getConn : function(){
        try{
            var self = this;
            this.app.services.call("getConn", [this.eKode.getText()], function(data){
                
            });
        }catch(e){
            console.log();
        }
    },
    loadData: function($compCode){
        try{
            var self = this;
            this.app.services.call("loadSAPConn", [], function(data){
                self.sg.clear();
                for(var i = 0; i < data.length; i++){
                    var line = data[i];
                    self.sg.appendData([line.kode,  line.desk, line.ip, line.sys_id, line.ins_num, line.sap_router]);
                }
            });
        }catch(e){
            console.log();
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
						this.app.services.call("add",[this.eCocd.getText(), this.eModul.getText(), nilaiToFloat(this.eNilai.getText()), this.app._userLog], function(data){
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
						this.app.services.call("deleteParamNilai",[this.eCocd.getText(), this.eModul.getText(), this.eNilai.getText(), this.app._userLog], function(data){
							system.info(this, data);
						}); 
					}
					catch(e)
					{
						system.alert(this, e,"");
					}
			   }
				break;
		}
		
	},
});
