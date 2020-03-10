window.app_saku_modul_fCancelUpload = function(owner,menu)
{
	if (owner)
	{
		try{
			window.app_saku_modul_fCancelUpload.prototype.parent.constructor.call(this,owner);
			this.className  = "app_saku_modul_fCancelUpload";
			this.itemsValue = new arrayList();		
			this.maximize();	
			this.app._mainForm.childFormConfig(this, "mainButtonClick","Cancel Batch Input ", 0);

			uses("saiGrid;saiCBBL;panel;checkBox", true);			
			var self=this;
			

			
			
			this.data.upload = [];
			var periode = self.app._periode;
			
			if (periode == undefined || periode == ""){
				this.alert("Periode tidak valid","Tidak ada periode yang Open");	
				periode = (new Date()).getFullYear() +"";
			}
			var tahun = periode.substr(0,4);
			this.cocd = new saiCBBL(this,{bound:[20,20,200,20],caption:"Comp. Code"});
			this.tahun2 = new saiCB(this,{bound:[20,10,200,20],caption:"Tahun", readOnly:true, items:[tahun], change:[this,"doChange"]});
			this.bulan2 = new saiLabelEdit(this,{bound:[230,10,150,20],caption:"Bulan", readOnly:true});
            this.cekAll = new checkBox(this, {bound:[500, 10,100,20], caption:"Cek/Uncek All"});
                this.cekAll.on("click", () => {
                    for(var i = 0; i < this.sg.getRowCount(); i++){
                        this.sg.cells(2,i,this.cekAll.isChecked() ? "TRUE" : "FALSE");
                    }
				});
			this.eJenis = new saiCB(this,{bound:[20,11,200,20],caption:"Jenis Mutasi", readOnly:true, items:["TB","ADJ"]});
			this.eJenis.on("change", () => {
				if (this.isLoaded){
					this.bSearch.click();
				}
			});
			
            this.bSearch = new button(this, {bound:[20,40,100, 30], caption:"Load Data", icon:"<i class='fa fa-search' style='color:white'/>"});
                this.bSearch.on("click",  () => {
					this.isLoaded = true;
					if (this.eJenis.getText() == "TB"){
						this.app.services.callServices("financial_mantisUpload","getUploadBatch", [this.tahun2.getText()+""+this.bulan2.getText(), this.cocd.getText(),this.app._userLog] ,(data)=>{
							this.sg.clear();
							$.each(data,(k,v) => {
								this.sg.addRowValues([v.icm, v.idheader, 'FALSE']);
							});
						});
					}else{
						this.app.services.callServices("financial_mantisAdj","getUploadBatch", [this.tahun2.getText()+""+this.bulan2.getText(), this.cocd.getText(),this.app._userLog] ,(data)=>{
							this.sg.clear();
	
							$.each(data,(k,v) => {
								this.sg.addRowValues([v.icm, v.idheader, 'FALSE']);
							});
	
						});
					}
                    
                });

            this.bSubmit = new button(this, {bound:[140,40,100, 30], caption:"Delete", icon:"<i class='fa fa-send' style='color:white'/>"});
                this.bSubmit.on("click", () => {
                    this.event = "submit";
                        var listICM = [];
                        var listJU = [];
                        this.showLoading("Delete data... ");
                        for(var i = 0; i < this.sg.getRowCount(); i++){
                            if (this.sg.cells(2,i) == "TRUE"){
                                listICM.push(this.sg.cells(0,i));
                                listJU.push(this.sg.cells(1,i));
                            }
						}
						if (this.eJenis.getText() == "TB"){
							this.app.services.callServices("financial_mantisUpload","cancelUploadBatch", [listICM, listJU, this.tahun2.getText()+""+this.bulan2.getText(), this.cocd.getText()] ,(data)=>{
								this.hideLoading("Submit data... ");
								if (data == "Periode sedang di lock"){
									this.alert("Delete gagal", data);
								}else{
									this.info("Done Selesai", "Cancel data upload berhasil");
									this.sg.clear();
								}
								
							});
						}else{
							this.app.services.callServices("financial_mantisAdj","cancelUploadBatch", [listICM, listJU, this.tahun2.getText()+""+this.bulan2.getText(), this.cocd.getText()] ,(data)=>{
								this.hideLoading("Submit data... ");
								if (data == "Periode sedang di lock"){
									this.alert("Delete gagal", data);
								}else{
									this.info("Done Selesai", "Cancel data upload berhasil");
									this.sg.clear();
								}
								
							});
						}
                    
                });
            

			
			this.p1 = new panel(this,{bound:[10,50,600, this.height - 200],caption:"Data Upload" 
				
			});
			this.sg = new saiGrid(this.p1,{bound:[1,25,this.p1.width - 5, this.p1.height - 30],colCount:3, headerHeight : 60,
				colTitle: ["ICM","No Jurnal","Cek"],
                colWidth:[[2,1,0],[100,100,300]],
                colFormat:[[2],[cfBoolean]],
			});


			this.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			

			this.rearrangeChild(20,23);
		
				
			var self=this;

			
			self.bulan2.setText(periode.substr(4,2));
			this.tahun2.setText(tahun);
			this.cocd.setText(this.app._lokasi);
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
			
		}catch(e){
			alert(e);
			systemAPI.alert(e);
		}
		
	}
};
window.app_saku_modul_fCancelUpload.extend(window.childForm);
window.app_saku_modul_fCancelUpload.implement({	
	
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
		
	},
	hapus: function(){
		
	},
	
	doModalResult: function(event, modalResult){
		
	}
});
