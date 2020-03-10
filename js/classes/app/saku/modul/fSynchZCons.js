/**
 * @author dweexfuad
 */
window.app_saku_modul_fSynchZCons = function(owner) {
	if (owner){
		window.app_saku_modul_fSynchZCons.prototype.parent.constructor.call(this,owner);
		this.maximize();
		this.className  = "app_saku_modul_fSynchZCons";		
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Synch Data ZCons", 99);	
		try{
            uses("datePicker;saiCBBL;saiGrid;pageControl;checkBox;util_standar;frameBrowser;frame;saiUpload");	
            this.co_cocd = new saiCBBL(this,{bound:[20, 23, 200, 20],labelWidth:100,caption:"COCD"});		
			this.bSAP = new button(this,{bound:[500,20, 100, 25], caption:"Synch SAP", icon:"icon/reload.png"});
            this.eYear = new saiLabelEdit(this, {bound:[20,20,200,25], caption:"Tahun"});
            this.eMonth = new saiCB(this, {bound:[230,20,50,25], labelWidth:0,caption:"Bulan", items:["00","01","02","03","04","05","06","07","08","09","10","11","12"]});
            this.eJenis = new saiCB(this, {bound:[290,20, 200, 25], caption:"Jenis TB", items:["PRA","AFTER"]});
            
            this.eUpload = new saiUpload(this,{bound:[620,20,80, 25], caption:"<i class='fa fa-upload' />&nbsp;&nbsp;&nbsp;Browse"});
			this.eUpload.on("change",  (file) => {
				this.event = "validated";
				this.eUpload.setAddParam({service:"callServices",dataType:"xls", param: ["financial_mantisTB","validasiUpload",[this.eYear.getText()+""+this.eMonth.getText(),  this.co_cocd.getText(),this.app._userLog, this.eJenis.getText()] ], fields:[]});
				//self.eFile.setText(file);
				this.eUpload.submit();
                this.dataUpload = [];
                this.frame.hide();
				// this.app._mainForm.pTrans.show();
				
            });
            this.eUpload.on("onload", (data) => {
                this.dataUpload = [];
                this.sg1.clear();
                if (data.contents.error){
                    this.alert("Gagal Upload",data.contents.error);
                    return;
                }
                $.each(data.contents.rows, (k,v) => {
                    this.dataUpload.push(v);
                    this.sg1.addRowValues([v.ba, v.akun, v.desc, v.akunTlkm,  v.sakhir ]);
                })
				
			});
			this.bSubmit = new button(this, {bound:[720,20,100, 25], caption:"Submit", icon:"<i class='fa fa-send' style='color:white'/>"});
			this.bSubmit.on("click", () => {
				this.event = "submit";
			
				
                this.showLoading("Submit data... ");
                this.app.services.callServices("financial_mantisTB","uploadTB", [this.eYear.getText()+""+this.eMonth.getText(),  this.co_cocd.getText(),this.app._userLog, this.eJenis.getText(), this.dataUpload] ,(data)=>{
                    this.hideLoading("Submit data... ");
                    if (data != "process completed"){
                        this.alert("Upload gagal", data);
                    }else{
                        this.info("Upload selesai", " ");
                        
                    }
                    
                })
				
			});
            
            this.sg1 = new saiGrid(this,{bound:[20,65,this.width-25,this.height-150],
                colCount: 5, headerHeight: 65, pasteEnable: false,
                colTitle: [
                    {
                        title : "BusA",
                        width : 0,
                        columnAlign: "bottom", 
                        hint  : ""
                    },
                    {
                        title : "Gl Acount",
                        width : 100,
                        columnAlign: "bottom", 
                        hint  : "",
                    },
                    {
                        title : "Description",
                        width : 250,
                        columnAlign: "bottom", 
                        hint  : "",
                    },
                    {
                        title : "Mapping Acct",
                        width : 100,
                        columnAlign: "bottom", 
                        hint  : "",
                    },
                    
                    {
                        title : "Ending Balance",
                        width : 150,
                        columnAlign: "bottom", 
                        hint  : "",
                    }
                ],
                colFormat:[[4,5,6,7],[cfNilai,cfNilai,cfNilai,cfNilai]],
                autoPaging: true, rowPerPage: 20, readOnly:true
            });

            this.frame = new control(this, {bound:[20,65,this.width - 40, this.height - 150], shadow:true});
            this.frame.getCanvas().css({overflow:"hidden"});
            this.frame.setInnerHTML("<iframe id='"+ this.getFullId()+"_frame' frameborder='0' style='position:absolute;left:0; top:0; width:100%; height:100%;overflow:auto;' />");
            var cnv = $("#"+this.getFullId() +"_frame");
            var self = this;
            cnv.bind("load", function(){
                    self.hideLoading();
            });
            
            this.frame.hide();
            var self = this;
            this.bSAP.on('click', () => {
                this.frame.show();
                this.sg1.hide();
                if (this.co_cocd.getText() == ""){
                    this.alert("Synch Gagal","Company Code belum terisi");
                    return;
                }
                if (this.eMonth.getText() == ""){
                    this.alert("Synch Gagal","Periode belum terisi");
                    return;
                }
                self.showLoading("Prosess sinkronisasi...");
                cnv.attr("src","server/getDataZCons.php?y="+self.eYear.getText()+"&b="+self.eMonth.getText()+"&s="+self.eJenis.getText()+"&cocd="+self.co_cocd.getText());
            });
            this.rearrangeChild(20,23);
            this.co_cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar CC");		
		}catch(e){
			alert(e);
		}
	}
};
window.app_saku_modul_fSynchZCons.extend(window.childForm);
window.app_saku_modul_fSynchZCons.implement({
	doClose: function(sender){		
		this.bSAP.free();			
	},
	doDownloadSAP: function(sender){
		if (this.frSAPGUI.isVisible()){
			this.frSAPGUI.hide();
		}else this.frSAPGUI.show();
	},
	doApply: function(sender){
		try{
			/*
			showLoading();
			var dataFinest = this.dbLib2.getDataProvider("select substr(gl_acc,3,8),PROFIT_CENTER,  "+
							"		sum(case prd when 1 then amount else 0 end) as jan,"+
							"		sum(case prd when 2 then amount else 0 end) as feb,"+
							"		sum(case prd when 3 then amount else 0 end) as mar,"+
							"		sum(case prd when 4 then amount else 0 end) as apr, "+
							"		sum(case prd when 5 then amount else 0 end) as mei,"+
							"		sum(case prd when 6 then amount else 0 end) as jun,"+
							"		sum(case prd when 7 then amount else 0 end) as jul,"+
							"		sum(case prd when 8 then amount else 0 end) as aug,"+
							"		sum(case prd when 9 then amount else 0 end) as sep,"+
							"		sum(case prd when 10 then amount else 0 end) as  okt,"+
							"		sum(case prd when 11 then amount else 0 end) as  nop,"+
							"		sum(case prd when 12 then amount else 0 end) as des, year, '-',year,'N' "+
							"	from ( "+
							"	select profit_center, gl_acc,   "+
							"			case when substr(NPER,5,2) = '01' then to_number(substr(nper,1,4)) - 1 else to_number(substr(nper,1,4)) end as year, "+
							"			case when substr(NPER,5,2) = '01' then 12 else to_number(substr(NPER,5,2) ) - 1 end as prd, "+
							"			amount 	"+
							"	from EXS_REALBILL where profit_center between '"+this.efUBIS1.getText()+"' and '"+this.efUBIS2.getText()+"' ) a    "+
				"where  a.year = '"+this.efPrd.getText()+"' "+
				"group by profit_center, gl_acc, year", true);
			if (typeof dataFinest == "string"){
				throw (dataFinest);
			}
			for (var i = 0;i < dataFinest.rs.rows.length; i++){
				var line = dataFinest.rs.rows[i];
				this.sg.appendData([line.ccsap, line.accid, 
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										"0",
										floatToNilai(line.janb),
										floatToNilai(line.febb),
										floatToNilai(line.marb),
										floatToNilai(line.aprb),
										floatToNilai(line.meib),
										floatToNilai(line.junb),
										floatToNilai(line.julb),
										floatToNilai(line.augb),
										floatToNilai(line.sepb),
										floatToNilai(line.oktb),
										floatToNilai(line.nopb),
										floatToNilai(line.desb)  ]);
			}

			var data = this.dbLib.getDataProvider("select kode_akun, nama from exs_masakun ",true);
			var dataListAkun = new arrayMap();

			for (var i = 0;i < data.rs.rows.length; i++){
				var line = data.rs.rows[i];
				dataListAkun.set(line.kode_akun, line.nama);
			}
			this.sg2.clear();
			for (var i=0; i < this.sg.getRowCount(); i++){
				if (this.sg.cells(5,i) != "-" && trim(this.sg.cells(5,i)) != ""){
					if (dataListAkun.get(this.sg.cells(5,i).substr(2,8)) === undefined){
						this.sg2.appendData([this.sg.cells(4,i), this.sg.cells(5,i),'BARU']);
					}
				}
			}
			hideLoading();
			*/
		}catch(e){
			hideLoading();
			error_log(e);
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
	nextNB: function(nb){
		var format = "RKN/"+this.dp_tgl.getYear()+"/";
		var numeric = '0000';
		var no = parseFloat(nb.substr(format.length,numeric.length));
		no++;
		var no_str = no.toString();

		for (var i = no.toString().length; i < numeric.length; i++){
			no_str = "0"+no_str;
		}
		return format + no_str;
	},
	doModalResult: function(event, result){				
		try{
			if (result != mrOk) return;
			var sql = new server_util_arrayList();			
			switch(event){
				case "clear" :
					if (result == mrOk){
						this.standarLib.clearByTag(this, new Array("0","1","9"),this.ed_kode);		
						this.sg.clear(1);					
						this.dataKonversi = undefined;	
					}
				break;
				case "simpan" :
				/*
					if (this.standarLib.checkEmptyByTag(this,[0,1,2])){
						var periode = this.ePrd1.getText();
						sql.add("delete from exs_mbudget where tahun = '"+periode+"' and kode_cc between '"+this.efUBIS1.getText()+"' and '"+this.efUBIS2.getText()+"' and jenis = 'N' ");
						sql.add("delete from exs_mactual where tahun = '"+periode+"' and kode_cc between '"+this.efUBIS1.getText()+"' and '"+this.efUBIS2.getText()+"' and jenis = 'N' ");
						
						for (var i=0; i < this.sg.getRowCount(); i++){
							if (this.sg.cells(1,i) != "-"){
								var akun = this.sg.cells(1,i);
								var cc = this.sg.cells(0,i);
								sql.add("insert into exs_mbudget(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis) "+
										" values('"+periode+"','"+cc+"','"+akun+"','"+parseNilai(this.sg.cells(2,i))+"','"+parseNilai(this.sg.cells(3,i))+"','"+parseNilai(this.sg.cells(4,i))+"','"+parseNilai(this.sg.cells(5,i))+"'"+
											" ,'"+parseNilai(this.sg.cells(6,i))+"','"+parseNilai(this.sg.cells(7,i))+"','"+parseNilai(this.sg.cells(8,i))+"','"+parseNilai(this.sg.cells(9,i))+"','"+parseNilai(this.sg.cells(10,i))+"','"+parseNilai(this.sg.cells(11,i))+"'"+
											" ,'"+parseNilai(this.sg.cells(12,i))+"','"+parseNilai(this.sg.cells(13,i))+"','N')");
								sql.add("insert into exs_mactual(tahun, kode_cc, kode_akun, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nop, des, jenis) "+
										" values('"+periode+"','"+cc+"','"+akun+"','"+parseNilai(this.sg.cells(14,i))+"','"+parseNilai(this.sg.cells(15,i))+"','"+parseNilai(this.sg.cells(16,i))+"','"+parseNilai(this.sg.cells(17,i))+"'"+
											" ,'"+parseNilai(this.sg.cells(18,i))+"','"+parseNilai(this.sg.cells(19,i))+"','"+parseNilai(this.sg.cells(20,i))+"','"+parseNilai(this.sg.cells(21,i))+"','"+parseNilai(this.sg.cells(22,i))+"','"+parseNilai(this.sg.cells(23,i))+"'"+
											" ,'"+parseNilai(this.sg.cells(24,i))+"','"+parseNilai(this.sg.cells(25,i))+"','N')");
								
							}
						}	
						for (var i=0; i < this.sg2.getRowCount(); i++){
							if (this.sg2.rowValid(i))
								sql.add("insert into exs_masakun (kode_akun, nama, kode_lokasi)values('"+this.sg2.cells(1,i)+"','"+this.sg2.cells(0,i)+"','"+this.app._lokasi+"')");
						}
						this.dbLib.execArraySQL(sql);													
					}
					*/
				break;
				case "ubah" :
					
				break;
				case "delete" :
					
				break;
			}			
		}catch(e){
			systemAPI.alert(e);
		}
	},
	
	doRequestReady: function(sender, methodName, result){		
		if (sender == this.dbLib)
		{
			try
			{   				
				switch(methodName)
	    		{
	    			case "execArraySQL" :	    				
						if (result.toLowerCase().search("error") == -1)					
						{							
							this.app._mainForm.pesan(2,"transaksi telah sukses tersimpan (ID : "+ this.ed_kode.getText()+")");
							this.app._mainForm.bClear.click();
                                                      
						}else system.info(this,result,"");
	    			break;	    			
	    		}
			}
			catch(e)
			{
				systemAPI.alert("error = "+e,result);
			}		       
		}
	},	
	doGridChange: function(sender, col, row,param1,result, data){	    		
    },    
	doEllipsClick:function(sender, col ,row){						
	},
	doEditChange: function(sender){
		
	},					
	doAfterPaste: function (sender, rowCount, page){
		if (sender == this.sg){
			var data = this.dbLib.getDataProvider("select kode_akun, nama from exs_masakun ",true);
			var dataListAkun = new arrayMap();

			for (var i = 0;i < data.rs.rows.length; i++){
				var line = data.rs.rows[i];
				dataListAkun.set(line.kode_akun, line.nama);
			}
			this.sg2.clear();
			for (var i=0; i < this.sg.getRowCount(); i++){
				if (this.sg.cells(2,i) != "-"){
					if (dataListAkun.get(this.sg.cells(2,i)) === undefined){
						this.sg2.appendData([this.sg.cells(2,i), this.sg.cells(1,i),'BARU']);
					}
				}
			}
		}
		
	},
	doPager: function(sender, page){
		this.sg.doSelectPage(page);
	}
});
