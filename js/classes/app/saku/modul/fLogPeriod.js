window.app_saku_modul_fLogPeriod = function(owner)
{
	if (owner)
	{
		window.app_saku_modul_fLogPeriod.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fLogPeriod";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Lock / Unlock Period", 0);

		uses("saiCBBL;", true);			
		var self=this;
		
		
		
		

		var thn = self.app._periode;
		var tahun = thn.substr(0,4);
		// this.tahun = new saiCB(this,{bound:[20,70,200,20],caption:"Tahun", readOnly:true, items:[tahun], change:[this,"doChange"]});
		this.tahun = new saiLabelEdit(this,{bound:[20,95,200,20],caption:"Tahun", placeHolder:"YYYY", change:[this,"doChange"]});
		this.bulan1 = new saiCB(this,{bound:[20,70,200,20],caption:"Bulan", readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
		this.lTitle001 = new label(this, {bound:[250,70,30,20], caption:"S/d",  visible:false, bold: true, fontSize:10});
		this.bulan2 = new saiCB(this,{bound:[300,70,200,20],caption:"Bulan", visible:false, readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
		this.cocd1 = new saiCBBL(this,{bound:[20,20,200,20],caption:"Comp. Code", rightLabelVisible:false});
		this.cocd2 = new saiCBBL(this,{bound:[230,20,150,20],caption:"s/d",labelWidth:50, rightLabelVisible:false});
		
		this.lStatus = new label(this, {bound:[20, 21, 100, 20], caption:"Status"});
		this.lStatusValue = new label(this, {bound:[120, 21, 100, 20], caption:"..."});
		this.setTabChildIndex(0);
		this.rearrangeChild(20,23);
		this.bSave = new button(this,{bound:[20,150,100, 30],icon:"<i class='fa fa-lock' style='color:white'></i>", caption:"Lock"});
		this.bSave.setColor("#980202");

		this.bUnlock = new button(this,{bound:[140,150,100, 30],icon:"<i class='fa fa-unlock' style='color:white'></i>", caption:"Unlock"});
		this.bUnlock.setColor("#27ae60");

		this.cocd1.on("change", () => {
			this.getStatus(); 
		});
		this.cocd2.on("change", () => {
			this.getStatus(); 
		});
		this.tahun.on("change", () => {
			this.getStatus();
		});
		this.bulan1.on("change", () => {
			this.getStatus();
		});

		this.bSave.on("click",(sender) => {
			try{
				self.pembeda = "Y";
				
				if(self.cocd1.getText() == "" || self.tahun.getText() == "" ||  self.bulan1.getText() == "" ){
					this.alert(self, "Harap Lengkapi Isian!", "");
				}else{
					self.app.services.callServices("financial_mantis","saveLockPeriod", [{cocd1 : self.cocd1.getText(), cocd2:self.cocd2.getText() }, self.pembeda, self.bulan1.getText(), self.tahun.getText()] ,function(data){
						if (data == "process completed") {
							system.info(self, data,"");
							self.cocd1.setText("");
							self.tahun.setText("");
							self.bulan1.setText("");
						}else {
							system.alert(self, data,"");
						}
					});
				}
			}catch(e){
				alert(e);
			}
		});
		this.bUnlock.on("click",(sender) => {
			try{
				self.pembeda = "N";
			
				// alert(self.pembeda);

				if(self.cocd1.getText() == "" || self.tahun.getText() == "" ||  self.bulan1.getText() == "" ){
					this.alert(self, "Harap Lengkapi Isian!", "");
				}else{
					self.app.services.callServices("financial_mantis","saveLockPeriod", [{cocd1 : self.cocd1.getText(), cocd2:self.cocd2.getText() }, self.pembeda, self.bulan1.getText(), self.tahun.getText()] ,function(data){
						if (data == "process completed") {
							system.info(self, data,"");
							self.cocd1.setText("");
							self.tahun.setText("");
							self.bulan1.setText("");
						}else {
							system.alert(self, data,"");
						}
					});
				}
			}catch(e){
				alert(e);
			}
		});
		

		this.tData = new saiGrid(this, {bound:[20, this.bSave.top + 50, 600, 400],
				colCount : 4, colTitle:["CoCD","Uraian","Status Lock","Period"], readOnly:true,
				colWidth: [[3,2,1,0],[100,100,300,100]],
		});

		this.tData.on("afterCopyRow", (row, values) => {
			
		});

		
		this.bulan1.setItemHeight(12);
		var self=this;

		try{			
			var self=this;

			var thn = self.app._periode;
			var tahun = thn.substr(0,4);
			self.tahun.setText(tahun);

			
			
			self.cocd1.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			self.cocd2.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
					
			
			self.app._mainForm.bSimpan.setVisible(false);
			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);
			self.on("close",function(){
				self.app._mainForm.dashboard.refreshList();
				self.app._mainForm.bSimpan.setVisible(true);
				self.app._mainForm.bHapus.setVisible(true);
			self.app._mainForm.bClear.setVisible(true);
			});
			
			this.RefreshList();
			

		}catch(e){
			systemAPI.alert(e);
		}
		
	}
};
window.app_saku_modul_fLogPeriod.extend(window.childForm);
window.app_saku_modul_fLogPeriod.implement({	
	getStatus : function(){
		console.log(this.tahun.getText() + ":"+this.bulan1.getText() +":"+ this.cocd1.getText());
		if (this.tahun.getText().length == 4 && this.bulan1.getText() != "" && this.cocd1.getText() != "") {
			
			this.app.services.callServices("financial_mantis","getLock",[this.tahun.getText(), this.bulan1.getText(), this.cocd1.getText()],(data)=>{  
				this.lStatusValue.setCaption(data == "Y" ? "LOCK" : "UNLOCK");
			});    
			
		}
		this.app.services.callServices("financial_mantisRepTW","getPeriodeStatus",[this.cocd1.getText(), this.tahun.getText(), this.bulan1.getText(),this.cocd2.getText(),],(data)=>{  
			this.tData.clear();
			$.each(data, (k ,v) => {
				this.tData.addRowValues([v.cocd, v.company_name, v.status, v.period]);
			});
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
	}
	
});
