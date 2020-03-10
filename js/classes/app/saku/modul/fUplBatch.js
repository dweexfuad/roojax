window.app_saku_modul_fUplBatch = function(owner,menu)
{
	if (owner)
	{
		try{
			window.app_saku_modul_fUplBatch.prototype.parent.constructor.call(this,owner);
			this.className  = "app_saku_modul_fUplBatch";
			this.itemsValue = new arrayList();		
			this.maximize();	
			this.app._mainForm.childFormConfig(this, "mainButtonClick","Upload Batch Input ", 0);

			uses("saiEdit;saiGrid;saiCBBL;panel;saiUpload;sgNavigator;", true);			
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
			// this.bulan2 = new saiCB(this,{bound:[230,10,150,20],caption:"Bulan", readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
			// this.bulan2.setItemHeight(12);
			this.bulan2 = new saiLabelEdit(this,{bound:[230,10,150,20],caption:"Bulan", readOnly:true});
			
			
			this.eUpload = new saiUpload(this,{bound:[20,40,80, 30], caption:"<i class='fa fa-upload' />&nbsp;&nbsp;&nbsp;Browse"});
			this.eUpload.on("change",  (file) => {
				this.event = "validated";
				this.eUpload.setAddParam({service:"callServices",dataType:"xls", param: ["financial_mantisUpload","validateBatchJurnal",[this.tahun2.getText()+""+this.bulan2.getText(), this.app._userLog, this.cocd.getText()] ], fields:[]});
				//self.eFile.setText(file);
				this.eUpload.submit();
				this.dataUpload = [];
				// this.app._mainForm.pTrans.show();
				
            });
            this.eUpload.on("onload", (data) => {

				if (this.event == "submit"){
					this.info("Done Selesai", "Silakan cek file log hasil upload. Namafile " + this.file);
					window.open("./server/reportDownloader.php?f="+data.contents+"&n=Edited-"+this.file);
				}else{
					this.sg.clear();
					this.sg.page = 1;

					this.dataUpload = [];
					$.each(data.contents.rows, (k,v) =>{
						this.sg.addRowValues(v);
						v.shift();
						this.dataUpload.push(v);
					});
					this.error = [];
					this.file = data.contents.file;
					if (data.contents.error.length > 0){
						this.error = data.contents.error;
						this.alert("Error Upload","Ada Error di template upload. silakan cek kembali template upload-nya.<br>" + JSON.stringify(this.error));
					}
					
				}
				
			});
			this.bSubmit = new button(this, {bound:[120,40,100, 30], caption:"Submit", icon:"<i class='fa fa-send' style='color:white'/>"});
			this.bSubmit.on("click", () => {
				this.event = "submit";
			
				if (this.error.length > 0){
					this.alert("Error Upload","Hasil validasi masih ada yg Error. Submit tidak dapat dilanjutkan");
				}else if (this.dataUpload.length == 0){
					this.alert("Error Upload","Tidak ada data yang akan diupload");
				}else{
					this.showLoading("Submit data... ");
					this.app.services.callServices("financial_mantisUpload","uploadBatchJurnal2", [this.tahun2.getText()+""+this.bulan2.getText(), this.app._userLog, this.cocd.getText(), this.dataUpload] ,(data)=>{
						this.hideLoading("Submit data... ");
						if (data == "Periode sedang di lock"){
							this.alert("Upload gagal", data);
						}else{
							this.info("Done Selesai", "Silakan cek file log hasil upload. Namafile " + this.file);
							window.open("./server/reportDownloader.php?f="+data+"&n=Edited-"+this.file);
						}
						
					});
				}
				
			});
			this.bTemplate = new button(this, {bound:[240,40,100, 30], caption:"Template", icon:"<i class='fa fa-download' style='color:white'/>"});

			this.bTemplate.on("click", () => {
				window.open("./server/media/template-upload.xlsx");
			});
			this.p1 = new panel(this,{bound:[10,50,this.width - 20, this.height - 200],caption:"Hasil Validasi" 
				
			});
			this.sg = new saiGrid(this.p1,{bound:[1,25,this.p1.width - 5, this.p1.height - 30],colCount:19, headerHeight : 60,
				colTitle: ["Check","Kelompok ICM","Line item ICM","Company Code","BA CC","TP","BA TP","FCBP","Kode Jasa","Pekerjaan","Bulan","Tahun","Posting Key","GL Acc","Currency","Doc Amount","Loc Amomunt","ICM","BA Rekon"],
				colWidth:[[18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],[100,120,150,150,100,100,80,80,80,300,100,80,80,80,80,100,100,100,300]]
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
window.app_saku_modul_fUplBatch.extend(window.childForm);
window.app_saku_modul_fUplBatch.implement({	
	
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
