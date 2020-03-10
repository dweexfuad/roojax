window.app_saku_modul_fBSInpAsetKor = function(owner, pdrk)
{
	if (owner)
	{
		window.app_saku_modul_fBSInpAsetKor.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fBSInpAsetKor";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Input Aset Koreksi", 99);

		uses("control_popupForm;column;checkBox;datePicker;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;datePicker;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer;app_saku_DashboardItem;app_saku_DashboardGrad;");			
		
		this.container = new panel(this, {bound:[0,0,this.width-10, this.height-20]});		

		this.tab = new pageControl(this.container,{visible:true,bound:[20,30,this.width - 60,this.height-75],
				childPage: ["Create Aset"],
				borderColor:"#35aedb", pageChange:[this,"doTabChange"], headerAutoWidth:false});									
		this.rearrangeChild(10, 22);

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
		
		this.fICM = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 10, 220, 20],labelWidth:110,caption:"ICM",placeHolder:""});
		this.fPeriode = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 35, 220, 20],labelWidth:110,caption:"Periode",placeHolder:"YYYYmm"});
        this.fCOCD = new saiCBBL(this.tab.childPage[0],{bound:[10, 60, 220, 20],labelWidth:110,caption:"COCD", change:[this,"doChange"]});
        this.fTP = new saiCBBL(this.tab.childPage[0],{bound:[10, 85, 220, 20],labelWidth:110,caption:"TP", change:[this,"doChange"]});

		this.cboxPSAK = new checkBox(this.tab.childPage[0], {bound:[10, 110, 50, 20], caption:"PSAK"});
        this.cboxIFRS = new checkBox(this.tab.childPage[0], {bound:[65, 110, 50, 20], caption:"IFRS"});
        
		this.cboxOtomatisasi = new checkBox(this.tab.childPage[0], {bound:[120, 110, 50, 20], caption:"Otomatisasi"});

		this.fExp = new saiMemo(this.tab.childPage[0],{bound:[10, 135, 220, 50],labelWidth:110,fontSize:11,caption:"Explanation"});	
        
		this.fRev = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 190, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Revenue ICM",readOnly:true,placeHolder:"",change:[this,"doChange"],visible:false});
		this.fRevBSPL = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 190, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Revenue BSPL",readOnly:true,placeHolder:"",change:[this,"doChange"]});
		this.fNilAst = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 240, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Aset BA Rekon",readOnly:true,placeHolder:"",change:[this,"doChange"],visible:false});
		// this.fCogs = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 245, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"COGS",readOnly:true,placeHolder:"",change:[this,"doChange"]});	
		this.fMargin = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 265, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"Margin BSPL",readOnly:true,placeHolder:"",visible:false});
		this.fPersenMargin = new saiLabelEdit(this.tab.childPage[0],{bound:[10, 290, 220, 20],labelWidth:110,tipeText:ttNilai,caption:"% Margin BSPL",readOnly:true,placeHolder:"",visible:false});

		this.labelRev = new label(this.tab.childPage[0],{bound:[250,10,330,20],fontSize: 12,caption:"REVENUE"});
		// this.labelCOGS = new label(this.tab.childPage[0],{bound:[925,10,330,20],fontSize: 12,caption:"COGS"});
		this.labelAset = new label(this.tab.childPage[0],{bound:[10,320,330,20],fontSize: 12,caption:"DAFTAR ASET"});
		// this.labelJur = new label(this.tab.childPage[0],{bound:[10,660,330,20],fontSize: 12,caption:"JURNAL"});
		
		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[250,40,650,this.tab.height-260],
			colCount: 6,
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
					title : "Revenue ICM",
					width : 0,
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
			buttonStyle:[[5,3,0],[bsEllips,bsEllips,bsEllips]], 														
			colFormat:[[5,4,3,2],[cfNilai,cfNilai,cfNilai,cfNilai]],					
			columnReadOnly:[true, [2,1],[5,4,3,0]],		
			rowPerPage:1000, autoPaging:true,pasteEnable: true, pager:[this,"doPager3"], afterPaste:[this,"doAfterPaste"]});
		var self = this;

		this.sg1.on("entrySearch", function(col, row, value, fn){
			if (value.length > 0) {
				if (self.myTimeExecSearch){
					clearTimeout(self.myTimeExecSearch);
				}
				self.myTimeExecSearch = setTimeout( function(){
					if (col == 0) {
						self.app.services.callServices("financial_BsplMaster","autoCompleteAkunRev",[value, "  "], function(data){
							if (typeof data.rs.rows != 'undefined' && data.rs.rows != null && data.rs.rows.length != 0){
								fn(data);								
							}else{
								system.alert(self, "Data Akun tidak ditemukan");
								self.sg3.setCell(col, row, '');	
							}
						});
					}else if(col == 3){
						var total_rev = 0;
                        for(i=0;i < self.sg1.getRowCount();i++){
                            if(row == i){
                                var margin_row = nilaiToFloat(value);								
                            }else{									
                                var margin_row = nilaiToFloat(self.sg1.cells(3,i));								
                            }
                            // console.log(total_rev + "=" + total_rev + "+" + margin_row);
                            total_rev = Number(total_rev) + Number(margin_row);
                        }
                        self.fRevBSPL.setText(floatToNilai(total_rev));	

                        //perhitungan margin dan % bspl
                        // var margin_bspl = Number(nilaiToFloat(self.fNilAst.getText())) - Number(nilaiToFloat(self.fCogs.getText()));
                        // var persen_margin_bspl = margin_bspl/Number(nilaiToFloat(self.fNilAst.getText()))*100;
                        // self.fMargin.setText(floatToNilai(margin_bspl));	
                        // self.fPersenMargin.setText(floatToNilai(persen_margin_bspl.toFixed(2)));

                        //perhitungan persentase margin revenue
                        for(i=0;i < self.sg1.getRowCount();i++){
                            // if(self.cboxOtomatisasi.selected == true){
                            // 	self.sg1.setCell(4, i, floatToNilai(persen_margin_bspl.toFixed(2)));
                            // }
                            if(self.sg1.cells(5,i) == ''){
                                var rev_bspl = 0;
                            }else{
                                var rev_bspl = nilaiToFloat(self.sg1.cells(5,i));
                            }
                            if(row == i){
                                if(value == ''){
                                    var rev_margin = 0;
                                }else{
                                    var rev_margin = nilaiToFloat(value);
                                }
                            }else{
                                if(self.sg1.cells(3,i) == ''){
                                    var rev_margin = 0;
                                }else{
                                    var rev_margin = nilaiToFloat(self.sg1.cells(3,i));
                                }
                            }
                            var rev_persen = Number(rev_bspl)/Number(rev_margin)*100;
                            if(isNaN(rev_persen)){
                                rev_persen = 0;
                            }
                            if(self.cboxOtomatisasi.selected == true){
                                self.sg1.setCell(4, i, (rev_persen).toFixed(2));
                            }
                        }

                        //perhitungan margin sg3 (sg aset)
                        var margin_rev = 0;
                        for(i=0;i < self.sg1.getRowCount();i++){
                            if(self.sg1.cells(5,i) != 0){								
                                margin_rev = margin_rev + nilaiToFloat(self.sg1.cells(5,i));									
                            }
                        }

                        var nilai_aset_ba = 0;
                        for(i=0;i < self.sg3.getRowCount();i++){
                            if(self.sg3.cells(11,i) != 0){								
                                nilai_aset_ba = nilai_aset_ba + nilaiToFloat(self.sg3.cells(11,i));									
                            }
                        }
                        
                        for(i=0;i < self.sg3.getRowCount();i++){							
                            if(self.sg3.cells(11,i) != 0){	
                                var proporsi_margin = Math.round(Number(nilaiToFloat(self.sg3.cells(11,i)))/Number(nilai_aset_ba)*Number(margin_rev));		
                                self.sg3.setCell(10, i, proporsi_margin);
                            }else{
                                self.sg3.setCell(10, i, 0);									
                            }
                            //depresiasi
                            if(isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == false || isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == "false"){
                                var nilai_dep = 0;
                            }else{
                                var nilai_dep = Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(self.sg3.cells(9,row)));
                            }
                            self.sg3.setCell(13, row, nilai_dep);
                        }

                        self.createJurnal();						
					}else if(col == 5){
						var total_rev = 0;
						if(value > nilaiToFloat(self.sg1.cells(2,row))){
							system.alert(self, "Nilai Revenue BSPL " + floatToNilai(value) + " tidak boleh lebih besar dari nilai Revenue ICM " + floatToNilai(self.sg1.cells(2,row)));
							self.sg1.setCell(col, row, 0);							
						}else{
							//perhitungan margin dan % bspl
							// var margin_bspl = Number(nilaiToFloat(self.fNilAst.getText())) - Number(nilaiToFloat(self.fCogs.getText()));
							// var persen_margin_bspl = margin_bspl/Number(nilaiToFloat(self.fNilAst.getText()))*100;
							// self.fMargin.setText(floatToNilai(margin_bspl));	
							// self.fPersenMargin.setText(floatToNilai(persen_margin_bspl.toFixed(2)));

							//perhitungan persentase margin revenue
							for(i=0;i < self.sg1.getRowCount();i++){
								if(row == i){
									if(self.cboxOtomatisasi.selected == true){								
										self.sg1.setCell(4, i, (nilaiToFloat(value)/Number(nilaiToFloat(self.sg1.cells(3,i)))*100).toFixed(2));
									}
								}else{
									if(self.cboxOtomatisasi.selected == true){	
										self.sg1.setCell(4, i, (Number(nilaiToFloat(self.sg1.cells(5,i)))/Number(nilaiToFloat(self.sg1.cells(3,i)))*100).toFixed(2));
									}
								}
                            }
                            
							//perhitungan persentase margin revenue
							for(i=0;i < self.sg1.getRowCount();i++){
								// if(self.cboxOtomatisasi.selected == true){																
								// 	self.sg1.setCell(2, i, floatToNilai(persen_margin_bspl.toFixed(2)));
								// }
								if(row == i){
									if(value == ''){
										var rev_bspl = 0;
									}else{
										var rev_bspl = nilaiToFloat(value);
									}
								}else{
									if(self.sg1.cells(5,i) == ''){
										var rev_bspl = 0;
									}else{
										var rev_bspl = nilaiToFloat(self.sg1.cells(5,i));
									}
								}
								if(self.sg1.cells(3,i) == ''){
									var rev_margin = 0;
								}else{
									var rev_margin = nilaiToFloat(self.sg1.cells(3,i));
								}
								var rev_persen = Number(rev_bspl)/Number(rev_margin)*100;
								if(isNaN(rev_persen)){
									rev_persen = 0;
								}
								if(self.cboxOtomatisasi.selected == true){																
									self.sg1.setCell(4, i, (rev_persen).toFixed(2));
								}
							}

							//perhitungan margin sg3 (sg aset)
							var margin_rev = 0;
							for(i=0;i < self.sg1.getRowCount();i++){
								if(row == i){
									margin_rev = margin_rev + nilaiToFloat(value);									
								}else{
									margin_rev = margin_rev + nilaiToFloat(self.sg1.cells(5,i));
								}
							}

							var nilai_aset_ba = 0;
							for(i=0;i < self.sg3.getRowCount();i++){
								if(self.sg3.cells(11,i) != 0){								
									nilai_aset_ba = nilai_aset_ba + nilaiToFloat(self.sg3.cells(11,i));									
								}
							}
							
							for(i=0;i < self.sg3.getRowCount();i++){							
								if(self.sg3.cells(11,i) != 0){	
									var proporsi_margin = Math.round(Number(nilaiToFloat(self.sg3.cells(11,i)))/Number(nilai_aset_ba)*Number(margin_rev));		
									self.sg3.setCell(10, i, proporsi_margin);
								}else{
									self.sg3.setCell(10, i, 0);									
								}
								//depresiasi
								if(isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == false || isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == "false"){
									var nilai_dep = 0;
								}else{
									var nilai_dep = Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(self.sg3.cells(9,row)));
								}
								self.sg3.setCell(13, row, nilai_dep);
							}

							self.createJurnal();
						}													
					}
				}, 500);
			}
        });
        this.sg1.on("selectRow", function(col, row, value, data){
			if (col == 0){
				self.sg1.setCell(col, row, data[0]);
			}
		});

		this.sg3 = new saiGrid(this.tab.childPage[0],{bound:[10,350,this.tab.width-40,this.tab.height-210],
			colCount: 17,
			headerHeight: 50,			
			colTitle: [
				{
					title : "Orig. Acct",
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
					title : "No. Aset",
					width : 0,
					columnAlign: "bottom", 	  
				},
			],
			buttonStyle:[[11,9,8,5,4,2,1,0],[bsEllips,bsEllips,bsEllips,bsEllips,bsEllips,bsAuto,bsAuto,bsEllips]], 	
			picklist:[[2,1],[
				new arrayMap({items:["Jual Beli Aset","Jual Beli Inventory","BDC"]}),
				new arrayMap({items:["ASET","INVEN","BDC"]}),
			]],	
			colFormat:[[14,13,12,11,10,9],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],					
			columnReadOnly:[true, [14,10,9],[15,13,12,11,8,7,6,5,4,3,2,1,0]],	
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
						self.app.services.callServices("financial_BsplMaster","autoCompleteAkunAset",[value, self.fCOCD.getText(), "  "], function(data){
							if (typeof data.rs.rows != 'undefined' && data.rs.rows != null && data.rs.rows.length != 0){
								fn(data);								
							}else{
								system.alert(self, "Data Akun tidak ditemukan");
								self.sg3.setCell(col, row, '');	
							}
						});
					}else if (col == 4) {
						if(self.akunADK.indexOf(self.sg3.cells(0,row)) != -1 || self.sg3.cells(0,row).match(/1319.*/) || self.sg3.cells(0,row).match(/1320.*/)){  
							self.sg3.setCell(4, row, '-');
							system.alert(self, "Akun ADK tidak boleh mengisi kelompok aset");
						}else{
							if (value.length > 4) {						
								self.app.services.callServices("financial_BsplMaster","autoCompleteKlpAset",[value, " and akun_aset = '" + self.sg3.cells(0,row) + "' "], function(data){
									if(data.rs.rows.length > 0){
										fn(data);
									}else{
										self.sg3.setCell(4, row, '');
										system.alert(self, "Kelompok aset "+ value +" untuk aset " + self.sg3.cells(0,row) + " tidak ditemukan");
									}
								});
							}
						}
					}else if (col == 5) {
						if(self.akunADK.indexOf(self.sg3.cells(0,row)) != -1 || self.sg3.cells(0,row).match(/1319.*/) || self.sg3.cells(0,row).match(/1320.*/)){  
							self.sg3.setCell(5, row, '');
							system.alert(self, "Akun ADK tidak boleh mengisi tgl perolehan");
						}else{
							var today = new Date();
							var dd = String(today.getDate()).padStart(2, '0');
							var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
							var yyyy = today.getFullYear();

							var thn_tgl_perolehan = value.substr(0, 4);						
							var bln_tgl_perolehan = value.substr(5, 2);	
							var dd_tgl_perolehan = value.substr(8, 2);	

							var thn_icm = self.fPeriode.getText().substr(0, 4);						
							var bln_icm = self.fPeriode.getText().substr(4, 6);

							var periode_tgl_perolehan = thn_tgl_perolehan + bln_tgl_perolehan;	
							var periode_icm = thn_icm + bln_icm;
							var periode_today = yyyy + mm;		
							
							var tgl_perolehan_hitung = thn_tgl_perolehan + bln_tgl_perolehan + dd_tgl_perolehan;
							var tgl_perolehan_setahun_sebelumnya = (thn_icm-1) + bln_icm + '01';
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
							console.log("tgl_perolehan_setahun_sebelumnya " + tgl_perolehan_setahun_sebelumnya);
							console.log("tgl_icm_hitung " + tgl_icm_hitung);
							console.log("tgl_today_hitung " + tgl_today_hitung);
							console.log("</br>");	
							
							var alert_error = '';
							
							if(tgl_perolehan_hitung > tgl_today_hitung){
								alert_error = alert_error + " Tanggal perolehan (" + value + ") tidak boleh lebih tinggi dari periode hari ini, yaitu " + yyyy + '/' + mm + '/' + dd + ' <br/>';
							}

							if(periode_tgl_perolehan > periode_icm){
								alert_error = alert_error + " Periode Tanggal perolehan (" + periode_tgl_perolehan + ") tidak boleh lebih tinggi dari periode icm, yaitu " + periode_icm + ' <br/>';	
							}

							if(tgl_perolehan_hitung < tgl_perolehan_setahun_sebelumnya){
								alert_error = alert_error + " Tanggal Perolehan tidak boleh lebih kecil dari pada " + (thn_icm-1) + '/' + bln_icm + '/01' + " <br/>";
							}

							if(alert_error != ''){
								system.alert(self, alert_error);
								self.sg3.setCell(5, row, thn_icm + '/' + bln_icm + '/' + new Date(thn_icm, bln_icm, 0).getDate());
							}
						}
					}else if (col == 8) {
						if(self.akunADK.indexOf(self.sg3.cells(0,row)) != -1 || self.sg3.cells(0,row).match(/1319.*/) || self.sg3.cells(0,row).match(/1320.*/)){  
							self.sg3.setCell(8, row, '-');
							system.alert(self, "Akun ADK tidak boleh mengisi periode susut");
						}else{
							var today = new Date();
							var dd = String(today.getDate()).padStart(2, '0');
							var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
							var yyyy = today.getFullYear();

							var thn_periode_susut = value.substr(0, 4);						
							var bln_periode_susut = value.substr(4, 2);	

							var thn_tgl_perolehan = self.sg3.cells(5,row).substr(0, 4);						
							var bln_tgl_perolehan = self.sg3.cells(5,row).substr(5, 2);

							var thn_icm = self.fPeriode.getText().substr(0, 4);						
							var bln_icm = self.fPeriode.getText().substr(4, 2);

							var periode_susut = value;	
							var periode_tgl_perolehan = thn_tgl_perolehan + bln_tgl_perolehan;	
							var periode_icm = thn_icm + bln_icm;
							var periode_today = yyyy + mm;
							
							// if(thn_periode_susut != thn_tgl_perolehan){
							// 	system.alert(self, "Tahun pada periode susut (" + thn_periode_susut + ") harus sama dengan tahun pada tanggal perolehan (" + thn_tgl_perolehan + ")");	
							// 	self.sg3.setCell(8, row, yyyy + '12');					
							// }

							var alert_error = '';							

							if(periode_susut < periode_tgl_perolehan){
								alert_error = alert_error + "Periode susut (" + periode_susut + ") tidak boleh lebih kecil daripada periode pada tanggal perolehan (" + periode_tgl_perolehan + ") <br/>";
								self.sg3.setCell(8, row, yyyy + '12');
							}

							// console.log(periode_susut + " periode " + periode_susut);

							// if(periode_susut < periode_today){
							// 	alert_error = alert_error + "Periode susut (" + periode_susut + ") tidak boleh lebih kecil daripada periode hari ini (" + periode_today + ") <br/>";
							// 	self.sg3.setCell(8, row, yyyy + '12');
							// }

							if(alert_error != ''){
								system.alert(self, alert_error);
							}
						}					
					}else if (col == 9) {
						if(self.akunADK.indexOf(self.sg3.cells(0,row)) != -1 || self.sg3.cells(0,row).match(/1319.*/) || self.sg3.cells(0,row).match(/1320.*/)){  
							self.sg3.setCell(9, row, 0);
							system.alert(self, "Akun ADK tidak boleh mengisi umur");
						}else{
							var today = new Date();
							var dd = String(today.getDate()).padStart(2, '0');
							var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
							var yyyy = today.getFullYear();
							var today_date = yyyy + '/' + mm + '/' + dd;

							//set depresiasi per bln
							if(isFinite(Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(value))) == false || isFinite(Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(value))) == "false"){
								var nilai_dep = 0;
							}else{
								var nilai_dep = Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(value));
							}
							self.sg3.setCell(14, row, nilai_dep);	

							self.createJurnal();
						}						
					}else if(col == 11){
						// set total nilai aset ba rekon
						var total_nilast = 0;
						for(i=0;i < self.sg3.getRowCount();i++){
							if(row == i){
								var nilast_row = parseFloat(value);								
							}else{
								if(self.sg3.cells(11,i) != null && self.sg3.cells(11,i) != ''){
									var nilast_row = parseFloat(self.sg3.cells(11,i));
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
									var proporsi_margin = Math.round(parseFloat(self.sg3.cells(11,i))/Number(total_nilast)*Number(total_rev))
								}
								self.sg3.setCell(10, i, proporsi_margin);								
								//depresiasi
								if(isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == false || isFinite(Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(self.sg3.cells(9,i)))) == "false"){
									var nilai_dep = 0;
								}else{
									var nilai_dep = Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(self.sg3.cells(9,row)));
								}
								self.sg3.setCell(14, row, nilai_dep);
							}	

							self.createJurnal();							
						}
					}
				}, 500);
			}
		});
		this.sg3.on("afterCopyRow", (row) => {
			var self = this;
			var last_row = self.sg3.getRowCount() - 1;

			let periode = self.sg0.cells(1,row);
			var tgl_peolehan_app = periode.substr(0, 4) + '/' + periode.substr(4, 6) + '/' + new Date(periode.substr(0, 4), periode.substr(4, 6), 0).getDate();

			self.sg3.setCell(0, last_row, '');
			self.sg3.setCell(1, last_row, '');
			self.sg3.setCell(2, last_row, '');
			self.sg3.setCell(3, last_row, '-');
			self.sg3.setCell(4, last_row, '-');
			self.sg3.setCell(5, last_row, tgl_peolehan_app);
			self.sg3.setCell(6, last_row, '-');
			self.sg3.setCell(7, last_row, '-');
			self.sg3.setCell(8, last_row, self.fPeriode.getText().substr(0, 4) + self.fPeriode.getText().substr(4, 2));
			self.sg3.setCell(9, last_row, 0);
			self.sg3.setCell(10, last_row, 0);
			self.sg3.setCell(11, last_row, 0);
			self.sg3.setCell(12, last_row, 0);
			self.sg3.setCell(13, last_row, 0);
			self.sg3.setCell(14, last_row, 0);
			self.sg3.setCell(15, last_row, '-');
			self.sg3.setCell(16, last_row, '');
		});
		this.sg3.on("selectRow", function(col, row, value, data){
			if (col == 0){
				self.sg3.setCell(col, row, data[0]);
				// self.sg3.setCell(col + 1, row, data[1]);	
			}else if (col == 1){
				self.sg3.setCell(col, row, data[0]);
			}else if (col == 4){
				self.sg3.setCell(col, row, data[0]);
				self.sg3.setCell(col+5, row, data[2]);

				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				var today_date = yyyy + '/' + mm + '/' + dd;

				//set depresiasi per bln
				if(isFinite(Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(data[2]))) == false || isFinite(Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(data[2]))) == "false"){
					var nilai_dep = 0;
				}else{
					var nilai_dep = Math.round(parseFloat(self.sg3.cells(10,row))/parseFloat(data[2]));
				}
				self.sg3.setCell(14, row, nilai_dep);	

				self.createJurnal();
			}else if (col == 5){
				self.sg3.setCell(col, row, data[0]);
			}
		});
		
        this.bSubmit = new button(this.container,{bound:[20,0,80,25],icon:"<i class='fa fa-save' style='color:white'></i>", caption:"Submit", click: [this, "doClick"]});	

        // this.bGenJur = new button(this.container,{bound:[this.width-420,0,180,20],icon:"<i class='fa fa-retweet' style='color:white'></i>", caption:"Regenerate Jurnal", click: [this, "doClick"]});
	
		this.setTabChildIndex();
		try {
			var self = this;
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			var periode = yyyy + mm;
			// self.bSubmit.hide();																
          
			self.fRev.setText(0);											
			self.fRevBSPL.setText(0);											
			self.fNilAst.setText(0);											
			self.fPeriode.setText(periode);											
			// self.fCogs.setText(0);											
			self.fMargin.setText(0);	
            self.fPersenMargin.setText(0);
		    self.cboxOtomatisasi.setSelected(true);					            	
		    self.cboxIFRS.setSelected(true);					            	
		    self.cboxPSAK.setSelected(true);					            	
			// self.cbJenis.setText("Jual Beli Aset");   
            // self.sg2.clear(1);
            
			self.sg1.clear(1);
            self.sg3.clear(1);
            
            self.sg3.setCell(5, 0, yyyy + '/' + mm + '/' + new Date(self.fPeriode.getText().substr(0, 4), self.fPeriode.getText().substr(4, 6), 0).getDate());            
            self.sg3.setCell(8, 0, periode);            

			self.nilai_aset_ba = [];
			self.nilai_aset_ba[0] = 0;
            
            // this.sg1.hideNavigator();			
            // this.sg3.hideNavigator();			
            self.getVarForm();	
            
            this.fCOCD.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
			this.fTP.setServices(this.app.servicesBpc, "callServices",["financial_BsplMaster","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company Code");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fBSInpAsetKor.extend(window.childForm);
window.app_saku_modul_fBSInpAsetKor.implement({
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
	doAfterPaste: function (sender, rowCount, page){
		self.cboxOtomatisasi.setSelected(false);					
		if (sender == this.sg1){
			var self = this;
			var total_rev = 0;
			for(i=0;i < self.sg1.getRowCount();i++){									
				var margin_row = nilaiToFloat(self.sg1.cells(3,i));								
				// console.log(total_rev + "=" + total_rev + "+" + margin_row);
				total_rev = Number(total_rev) + Number(margin_row);
			}
			self.fRevBSPL.setText(floatToNilai(total_rev));	

			//perhitungan margin dan % bspl
			var margin_bspl = Number(nilaiToFloat(self.fNilAst.getText())) - Number(nilaiToFloat(self.fCogs.getText()));
			var persen_margin_bspl = margin_bspl/Number(nilaiToFloat(self.fNilAst.getText()))*100;
			self.fMargin.setText(floatToNilai(margin_bspl));	
			self.fPersenMargin.setText(floatToNilai(persen_margin_bspl.toFixed(2)));

			//perhitungan persentase margin revenue
			for(i=0;i < self.sg1.getRowCount();i++){
				// self.sg1.setCell(2, i, floatToNilai(persen_margin_bspl.toFixed(2)));
				if(self.sg1.cells(5,i) == ''){
					var rev_bspl = 0;
				}else{
					var rev_bspl = nilaiToFloat(self.sg1.cells(5,i));
				}
				if(self.sg1.cells(3,i) == ''){
					var rev_margin = 0;
				}else{
					var rev_margin = nilaiToFloat(self.sg1.cells(3,i));
				}
				var rev_persen = Number(rev_bspl)/Number(rev_margin)*100;
				if(isNaN(rev_persen)){
					rev_persen = 0;
				}
				// self.sg1.setCell(4, i, (rev_persen).toFixed(2));
			}

			//perhitungan margin sg3 (sg aset)
			var margin_rev = 0;
			for(i=0;i < self.sg1.getRowCount();i++){
				if(self.sg1.cells(5,i) != 0){								
					margin_rev = margin_rev + parseFloat(self.sg1.cells(5,i));									
				}
			}

			var nilai_aset_ba = 0;
			for(i=0;i < self.sg3.getRowCount();i++){
				if(self.sg3.cells(11,i) != 0){								
					nilai_aset_ba = nilai_aset_ba + parseFloat(self.sg3.cells(11,i));									
				}
			}
			
			for(i=0;i < self.sg3.getRowCount();i++){					
				if(self.sg3.cells(11,i) != 0){	
					var proporsi_margin = Math.round(Number(parseFloat(self.sg3.cells(11,i)))/Number(nilai_aset_ba)*Number(margin_rev));		
					self.sg3.setCell(10, i, proporsi_margin);
				}else{
					self.sg3.setCell(10, i, 0);									
				}
				//depresiasi
				if(isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == false || isFinite(Math.round(proporsi_margin/parseFloat(self.sg3.cells(9,i)))) == "false"){
					var nilai_dep = 0;
				}else{
					var nilai_dep = Math.round(parseFloat(self.sg3.cells(10,i))/parseFloat(self.sg3.cells(9,i)));
				}
				self.sg3.setCell(13, i, nilai_dep);
			}	

			//check validasi			
			var error_paste = '';	
			data_rev_bener = [];		
			console.log(self.dataRev);
			for(i=0;i < self.sg1.getRowCount();i++){
				var validate = 0;
				console.log("akun = " + self.sg1.cells(0,i));
				console.log("rev icm = " + self.sg1.cells(2,i));
				$.each(self.dataRev, function(k, val){
					console.log(self.sg1.cells(0,i) + ' == ' + val.orig_acct + self.sg1.cells(2,i) + ' == ' + val.rev_icm);
					if(validate == 0){
						if(self.sg1.cells(0,i) == val.orig_acct && self.sg1.cells(2,i) == val.rev_icm){
							validate = 1;				
						}	
					}			
				});
				console.log("validate = " + validate);
				if(validate == 0){
					error_paste = error_paste + "Baris : " + (i+1) + ", akun " + self.sg1.cells(0,i) + " atau nilai " + floatToNilai(self.sg1.cells(2,i)) + " tidak sesuai data icm </br>";
				}else{
					var items = {
						orig_acct : self.sg1.cells(0,i),
						deskripsi : self.sg1.cells(1,i),
						rev_icm : self.sg1.cells(2,i),
						rev_bspl : self.sg1.cells(3,i),
						pmargin : self.sg1.cells(4,i),
						margin : self.sg1.cells(5,i)												
					}
					data_rev_bener.push(items);
				}
			}
			self.sg1.clear(0);				
			console.log("data rev bener");
			console.log(data_rev_bener);
			$.each(self.dataRev, function(k, val){
				self.sg1.addRowValues([
					val.orig_acct,
					val.deskripsi,
					val.rev_icm,
					0,
					0,
					0
				]);
			});	
			for(i=0;i < self.sg1.getRowCount();i++){
				$.each(data_rev_bener, function(k, val){
					console.log(self.sg1.cells(0,i) + ' == ' + val.orig_acct + self.sg1.cells(2,i) + ' == ' + val.rev_icm);					
					if(self.sg1.cells(0,i) == val.orig_acct && self.sg1.cells(2,i) == val.rev_icm){
						self.sg1.setCell(3, i, val.rev_bspl);
						self.sg1.setCell(4, i, val.pmargin);
						self.sg1.setCell(5, i, val.margin);
					}
				});
			}
			// $.each(data_rev_bener, function(k, val){
			// 	self.sg1.addRowValues([
			// 		val.orig_acct,
			// 		val.deskripsi,
			// 		val.rev_icm,
			// 		val.rev_bspl,
			// 		val.pmargin,
			// 		val.margin
			// 	]);
			// });	

			for(i=0;i < self.sg1.getRowCount();i++){
				if(parseFloat(self.sg1.cells(3,i)) > parseFloat(self.sg1.cells(2,i))){
					error_paste = error_paste + "Baris : " + (i+1) + ", nilai rev bspl " + floatToNilai(self.sg1.cells(3,i)) + " melebihi nilai rev icm " + floatToNilai(self.sg1.cells(2,i)) + "<br/> selisih = " + floatToNilai(parseFloat(self.sg1.cells(3,i)) - parseFloat(self.sg1.cells(2,i))) + " </br>";
					self.sg1.setCell(3, i, 0);					
				}
			}	
			
			if(error_paste != ''){
				system.alert(self, error_paste);				
			}

			self.createJurnal();
		}
	  },
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisRepSumBspl", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doClick: function(sender){
		if(sender == this.bExportKKP){
			var self = this;
			// console.log('frame doclik');
			// console.log(self.viewKKP.frame.frame);
			// self.getReport(self.getReport("getViewAset",[self.fICM.getText(), self.fPeriode.getText(), self.cc_icm, self.tp_icm], self.viewKKP.frame.frame));
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
        // self.sg4.clear(0);	
        
        self.tp_icm = self.fTP.getText();
        self.cc_icm = self.fCOCD.getText();
		
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
		var tot_nilai_aset_sg3 = 0;

		//jurnal input aset rev-aset
		var jurnal_rev_array = [];									
		for(i=0;i < self.sg1.getRowCount();i++){
			if(self.sg1.cells(5,i) != 0){
				if(self.sg1.cells(5,i) > 0){
					var items = {
						icm : self.fICM.getText(),
						dc : 'D',
						post_key : '40',
						tgl_jurnal : today_date,
						kode_akun : self.sg1.cells(0,i),
						nama_akun : self.sg1.cells(1,i),
						debet : self.sg1.cells(5,i),
						kredit : 0,
						keterangan : 'MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
						jenis_jurnal : 'REV-ASET',
						jenis_akun : 'REV',
						cc : self.tp_icm,
						tp : self.cc_icm,
						orig_acct : self.sg1.cells(0,i),
						acct_coa : '-'
					}
				}else{
					var items = {
						icm : self.fICM.getText(),
						dc : 'C',
						post_key : '50',
						tgl_jurnal : today_date,
						kode_akun : self.sg1.cells(0,i),
						nama_akun : self.sg1.cells(1,i),
						debet : 0,
						kredit : -1*self.sg1.cells(5,i),
						keterangan : 'MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
						jenis_jurnal : 'REV-ASET',
						jenis_akun : 'REV',
						cc : self.tp_icm,
						tp : self.cc_icm,
						orig_acct : self.sg1.cells(0,i),
						acct_coa : '-'
					}
				}
				jurnal_rev_array.push(items);				
				tot_j_rev = tot_j_rev + self.sg1.cells(5,i);
			}
		}	

		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(10,i) != 0){
				if(self.sg3.cells(10,i) > 0){
					var items = {
						icm : self.fICM.getText(),
						dc : 'C',
						post_key : '50',
						tgl_jurnal : today_date,
						kode_akun : self.sg3.cells(0,i),
						nama_akun : self.sg3.cells(3,i),
						debet : 0,
						kredit : self.sg3.cells(10,i),
						keterangan : 'MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
						jenis_jurnal : 'REV-ASET',
						jenis_akun : 'ASET',
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
						debet : -1*self.sg3.cells(10,i),
						kredit : 0,
						keterangan : 'MARGIN BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
						jenis_jurnal : 'REV-ASET',
						jenis_akun : 'ASET',
						cc : self.cc_icm,
						tp : self.tp_icm,
						orig_acct : self.sg3.cells(0,i),
						acct_coa : '-'
					}	
				}
				jurnal_rev_array.push(items);			
			}
		}
		jurnal_rev_array.sort((a,b) => (a.dc < b.dc) ? 1 : ((b.dc < a.dc) ? -1 : 0));
		
		//jurnal input aset aset-cogs	
		var jurnal_cogs_array = [];		
		// for(i=0;i < self.sg2.getRowCount();i++){
		// 	if(self.sg2.cells(2,i) != 0){								
		// 		tot_j_cogs = tot_j_cogs + nilaiToFloat(self.sg2.cells(2,i));									
		// 	}
		// }

		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(10,i) != 0){								
				tot_margin_rev = tot_margin_rev + nilaiToFloat(self.sg3.cells(10,i));									
			}
		}

		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(10,i) != 0 && self.sg3.cells(2,i) == 'Jual Beli Aset'){								
				tot_margin_tax = tot_margin_tax + nilaiToFloat(self.sg3.cells(10,i));									
			}
		}

		for(i=0;i < self.sg3.getRowCount();i++){
			if(self.sg3.cells(11,i) != 0){								
				tot_nilai_aset_sg3 = tot_nilai_aset_sg3 + nilaiToFloat(self.sg3.cells(11,i));									
			}
		}

		// for(i=0;i < self.sg3.getRowCount();i++){
		// 	if(Math.round(nilaiToFloat(self.sg3.cells(11,i))/tot_nilai_aset_sg3*nilaiToFloat(self.fCogs.getText())) != 0){
		// 		if(Math.round(nilaiToFloat(self.sg3.cells(11,i))/tot_nilai_aset_sg3*nilaiToFloat(self.fCogs.getText())) > 0){
		// 			var items = {
		// 				icm : self.fICM.getText(),
		// 				dc : 'D',
		// 				post_key : '40',
		// 				tgl_jurnal : today_date,
		// 				kode_akun : self.sg3.cells(0,i),
		// 				nama_akun : self.sg3.cells(3,i),
		// 				debet : Math.round(nilaiToFloat(self.sg3.cells(11,i))/tot_nilai_aset_sg3*nilaiToFloat(self.fCogs.getText())),
		// 				kredit : 0,
		// 				keterangan : 'COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
		// 				jenis_jurnal : 'ASET-COGS',
		// 				jenis_akun : 'ASET',
		// 				cc : self.cc_icm,
		// 				tp : self.tp_icm,
		// 				orig_acct : self.sg3.cells(0,i),
		// 				acct_coa : '-'
		// 			}
		// 		}else{
		// 			var items = {
		// 				icm : self.fICM.getText(),
		// 				dc : 'C',
		// 				post_key : '50',
		// 				tgl_jurnal : today_date,
		// 				kode_akun : self.sg3.cells(0,i),
		// 				nama_akun : self.sg3.cells(3,i),
		// 				debet : 0,
		// 				kredit : Math.round(nilaiToFloat(self.sg3.cells(11,i))/tot_nilai_aset_sg3*nilaiToFloat(self.fCogs.getText())*-1),
		// 				keterangan : 'COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
		// 				jenis_jurnal : 'ASET-COGS',
		// 				jenis_akun : 'ASET',
		// 				cc : self.cc_icm,
		// 				tp : self.tp_icm,
		// 				orig_acct : self.sg3.cells(0,i),
		// 				acct_coa : '-'
		// 			}
		// 		}
		// 		jurnal_cogs_array.push(items);	
		// 	}		
		// }
		// for(i=0;i < self.sg2.getRowCount();i++){
		// 	if(self.sg2.cells(2,i) != 0){	
		// 		if(self.sg2.cells(2,i) > 0){
		// 			var items = {
		// 				icm : self.fICM.getText(),
		// 				dc : 'C',
		// 				post_key : '50',
		// 				tgl_jurnal : today_date,
		// 				kode_akun : self.sg2.cells(0,i),
		// 				nama_akun : self.sg2.cells(1,i),
		// 				debet : 0,
		// 				kredit : nilaiToFloat(self.sg2.cells(2,i)),
		// 				keterangan : 'COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
		// 				jenis_jurnal : 'ASET-COGS',
		// 				jenis_akun : 'COGS',
		// 				cc : self.tp_icm,
		// 				tp : self.cc_icm,
		// 				orig_acct : self.sg2.cells(0,i),
		// 				acct_coa : '-'
		// 			}
		// 		}else{
		// 			var items = {
		// 				icm : self.fICM.getText(),
		// 				dc : 'D',
		// 				post_key : '40',
		// 				tgl_jurnal : today_date,
		// 				kode_akun : self.sg2.cells(0,i),
		// 				nama_akun : self.sg2.cells(1,i),
		// 				debet : nilaiToFloat(self.sg2.cells(2,i))*-1,
		// 				kredit : 0,
		// 				keterangan : 'COGS BSPL q' + (Number(quarter)-1) + ' ' + yyyy_ket,
		// 				jenis_jurnal : 'ASET-COGS',
		// 				jenis_akun : 'COGS',
		// 				cc : self.tp_icm,
		// 				tp : self.cc_icm,
		// 				orig_acct : self.sg2.cells(0,i),
		// 				acct_coa : '-'
		// 			}
		// 		}
		// 		jurnal_cogs_array.push(items);			
		// 	}
		// }
		// jurnal_cogs_array.sort((a,b) => (a.dc < b.dc) ? 1 : ((b.dc < a.dc) ? -1 : 0));	
		
		//insert sg jurnal
		// for(i=0;i<jurnal_rev_array.length;i++){
		// 	self.sg4.addRowValues([
		// 		jurnal_rev_array[i].icm,
		// 		jurnal_rev_array[i].dc,
		// 		jurnal_rev_array[i].post_key,
		// 		jurnal_rev_array[i].tgl_jurnal,
		// 		jurnal_rev_array[i].kode_akun,
		// 		jurnal_rev_array[i].nama_akun,
		// 		jurnal_rev_array[i].debet,
		// 		jurnal_rev_array[i].kredit,
		// 		jurnal_rev_array[i].keterangan
		// 	]);
		// }
		// for(i=0;i<jurnal_cogs_array.length;i++){
		// 	self.sg4.addRowValues([
		// 		jurnal_cogs_array[i].icm,
		// 		jurnal_cogs_array[i].dc,
		// 		jurnal_cogs_array[i].post_key,
		// 		jurnal_cogs_array[i].tgl_jurnal,
		// 		jurnal_cogs_array[i].kode_akun,
		// 		jurnal_cogs_array[i].nama_akun,
		// 		jurnal_cogs_array[i].debet,
		// 		jurnal_cogs_array[i].kredit,
		// 		jurnal_cogs_array[i].keterangan
		// 	]);
		// }

		//jurnal pajak margin
		var jurnal_pajak_array = [];				
		var isValidAct = new Promise((resolve, reject)=>{
			self.app.services.callServices("financial_BsplMaster", "getDataParamAkunJTax", [self.app._lokasi,self.cc_icm], (data) => {
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
				if(self.sg3.cells(10,i) != 0 && self.sg3.cells(2,i) == 'Jual Beli Aset'){
					if(self.sg3.cells(10,i) > 0){
						var akun_debet = self.akun_utang_pajak;
						var nama_debet = self.nama_utang_pajak;
						var akun_kredit = self.akun_beban_pajak;
						var nama_kredit = self.nama_beban_pajak;
						var nilai_pajak = Math.round(parseFloat(self.sg3.cells(10,i))*parseFloat(self.tarif_pajak)/100);
						var jenis_akun_debet = 'UTX'
						var jenis_akun_kredit = 'BTX'
					}else{
						var akun_debet = self.akun_beban_pajak;
						var nama_debet = self.nama_beban_pajak;
						var akun_kredit = self.akun_utang_pajak;
						var nama_kredit = self.nama_utang_pajak;
						var nilai_pajak = Math.round(-1*parseFloat(self.sg3.cells(10,i))*parseFloat(self.tarif_pajak)/100);
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
							jenis_jurnal : 'PAJAK',
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
							jenis_jurnal : 'PAJAK',
							jenis_akun : jenis_akun_kredit,
							cc : self.tp_icm,
							tp : self.cc_icm,
							orig_acct : akun_kredit,
							acct_coa : akun_kredit
						}
						jurnal_pajak_array.push(items);	
					}		
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
			console.log("create jurnal atas");
			console.table(jurnal_pajak_array);
		});														
	
		// console.log(jurnal_rev_array);
		// console.log(jurnal_cogs_array);
		// console.log(jurnal_pajak_array);

        self.jurnal_rev_array = jurnal_rev_array;
        self.jurnal_cogs_array = jurnal_cogs_array;
		self.jurnal_pajak_array = jurnal_pajak_array;
		
		// var jurnal_reverse_array = [];
		// if (typeof self.jur_reverse != 'undefined' && self.jur_reverse != null && self.jur_reverse.length != 0){	
		// 	$.each(self.jur_reverse, function(k, val){
		// 		if(val.post_key = '40'){
		// 			var nilai_d_reverse = val.nilai;
		// 			var nilai_k_reverse = 0;
		// 		}else{
		// 			var nilai_d_reverse = 0;
		// 			var nilai_k_reverse = val.nilai;
		// 		}
		// 		var items = {
		// 			icm : self.fICM.getText(),
		// 			dc : val.dc,
		// 			post_key : val.post_key,
		// 			tgl_jurnal : today_date,
		// 			kode_akun : val.kode_akun,
		// 			nama_akun : '-',
		// 			debet : nilai_d_reverse,
		// 			kredit : nilai_k_reverse,
		// 			keterangan : 'JURNAL BALIK ' + val.periode + ' ' + val.jenis + ' q' + (Number(quarter)-1) + ' ' + yyyy_ket,
		// 			jenis_jurnal : 'REVERSE_INPUT_' + val.jenis,
		// 			jenis_akun : val.jenis_akun,
		// 			cc : val.cc,
		// 			tp : val.cc,
		// 			orig_acct : val.kode_akun,
		// 			acct_coa : val.kode_akun,
		// 			no_aset : val.no_aset
		// 		}
		// 		jurnal_reverse_array.push(items);	
		// 	});	
		// }	
		
		// self.jurnal_reverse_array = jurnal_reverse_array;
		
        // console.log("jur leng");
        // console.log(self.jurnal_pajak_array.length);
		
		// console.log("self.jur_reverse");			
		// console.log(self.jur_reverse);			
		//jurnal reklass
		// if(self.sg3P.getRowCount() > 0 && self.sg3P.cells(6,0) <= periode){			
		// 	if (typeof self.jur_reverse != 'undefined' && self.jur_reverse != null && self.jur_reverse.length != 0){	
		// 		$.each(self.jur_reverse, function(k, val){
		// 			self.sg4.addRowValues([
		// 				val.dc,
		// 				val.post_key_reverse,
		// 				val.tgl_jurnal,
		// 				val.kode_akun,
		// 				val.description,
		// 				val.debit,
		// 				val.kredit,
		// 				'REKLAS ASET'
		// 			]);
		// 		});	
		// 	}	
		// }
		// //jurnal reklass depresiasi 
		// if(self.sg3P.getRowCount() > 0){			
		// 	for(i=0;i < self.sg3P.getRowCount();i++){			
		// 		if(self.sg3P.cells(6,i) != '' && self.sg3P.cells(6,i) <= periode && self.sg3P.cells(4,i) != ''){
		// 			var isValidAct = new Promise((resolve, reject)=>{
		// 				resolve(i);							
		// 			});	
		// 			isValidAct.then((i)=>{
		// 				self.app.services.callServices("financial_BsplMaster","getDataKlpAset",[self.app._lokasi,self.sg3P.cells(4,i)], function(data){
		// 					if (typeof data != 'undefined' && data != null){
		// 						self.dep_prev = self.sg3P.cells(12,i);	
		// 						self.periode_susut_prev = self.sg3P.cells(6,i);	
		// 						// console.log('reklas');							
		// 						// console.log(Number(nilaiToFloat(self.dep_prev)) +"+"+ (Number(periode) +"-"+ Number(nilaiToFloat(self.periode_susut_prev))) +"*"+ Number(nilaiToFloat(self.dep_prev)));
		// 						var dep_prev = Number(nilaiToFloat(self.dep_prev)) + (Number(periode) - Number(nilaiToFloat(self.periode_susut_prev))) * Number(nilaiToFloat(self.dep_prev));
		// 						self.sg4.addRowValues([
		// 							'D',
		// 							'40',
		// 							today_date,
		// 							data[0].akun_bp,
		// 							'-',
		// 							dep_prev,								
		// 							0,
		// 							'REKLAS ASET - DEPRESIASI'								
		// 						]);	
		// 						self.sg4.addRowValues([
		// 							'C',
		// 							'50',
		// 							today_date,
		// 							data[0].akun_ap,
		// 							'-',
		// 							0,
		// 							dep_prev,		
		// 							'REKLAS ASET - DEPRESIASI'
		// 						]);	
		// 					}	
		// 				});
		// 			});
		// 		}
		// 	}
		// }
		// // jurnal percepatan depresiasi
		// if(self.sg3P.getRowCount() > 0){
		// 	for( var i=0;i < self.sg3.getRowCount();i++){	
		// 		console.log(self.sg3.cells(4,i) + ' + ' + periode);
		// 		if(self.sg3.cells(4,i) != '' && self.sg3.cells(4,i) <= periode && self.sg3.cells(2,i) != '' && self.sg3P.cells(6,i) <= periode){
		// 			var isValidAct = new Promise((resolve, reject)=>{
		// 				resolve(i);							
		// 			});																
		// 			isValidAct.then((i)=>{
		// 				self.app.services.callServices("financial_BsplMaster","getDataKlpAset",[self.app._lokasi,'-'], function(data){
		// 					if (typeof data != 'undefined' && data != null){
		// 						self.dep = self.sg3.cells(10,i);	
		// 						self.periode_susut = self.sg3.cells(4,i);
		// 						// console.log('percepatan');
		// 						// console.log(Number(nilaiToFloat(self.dep)) +"+"+ (Number(periode) +"-"+ Number(nilaiToFloat	(self.periode_susut_prev))) +"*"+ Number(nilaiToFloat(self.dep)));
		// 						var dep_prev = Number(nilaiToFloat(self.dep)) + (Number(periode) - Number(nilaiToFloat(self.periode_susut))) * Number(nilaiToFloat(self.dep));
		// 						self.sg4.addRowValues([
		// 							'D',
		// 							'40',
		// 							today_date,
		// 							data[0].akun_ap,
		// 							'-',
		// 							dep_prev,								
		// 							0,
		// 							'REKLAS ASET - PERCEPATAN DEPRESIASI'								
		// 						]);	
		// 						self.sg4.addRowValues([
		// 							'C',
		// 							'50',
		// 							today_date,
		// 							data[0].akun_bp,
		// 							'-',
		// 							0,
		// 							dep_prev,		
		// 							'REKLAS ASET - PERCEPATAN DEPRESIASI'					
		// 						]);	
		// 					}	
		// 				});
		// 			});
		// 		}	
		// 	}
		// }
	},
	simpan : function(row){
		try{
			try {
                var self = this;
                self.confirm("Warning","Yakin Data sudah benar dan akan diSubmit?", function(result){
                    if(self.fICM.getText() != '' || self.fPeriode.getText() != '' ){
						//check box harus pilih salah satu	
						if(self.cboxPSAK.selected == false && self.cboxIFRS.selected == false){
							system.alert(self, "Harap Pilih Tick Mark PSAK atau IFRS");
						}else{
							var total_nilast = 0
							for(i=0;i < self.sg3.getRowCount();i++){
								if(self.sg3.cells(11,i) != 0){								
									total_nilast = parseFloat(total_nilast) + parseFloat(self.sg3.cells(11,i));	
									// console.log(total_nilast +"="+ parseFloat(total_nilast) +"+"+ parseFloat(self.sg3.cells(11,i)));
								}
							}
							//nilai  total aset tidak boleh melebihi total nilai aset ba rekon awal
							// console.log("aset sg 3" + total_nilast);
							// console.log("nilai aset awal" + self.total_nilai_ba_rekon_awal);
							//nilai  total aset tidak boleh melebihi total nilai aset ba rekon awal
							// if(total_nilast > total_nilast){
							// 	system.alert(self, "Total Nilai Aset " + floatToNilai(total_nilast) + " tidak boleh melebihi Total Nilai Aset BA Rekon" + floatToNilai(total_nilast) + ", selisih = " + floatToNilai(total_nilast - total_nilast));
							// }else{
								//nilai total revenue bspl harus = total nilai aset ba rekon
								var selisih = nilaiToFloat(self.fRevBSPL.getText()) - nilaiToFloat(total_nilast);
								if(nilaiToFloat(self.fRevBSPL.getText()) > nilaiToFloat(total_nilast)){
									system.alert(self, "Total Nilai Revenue BSPL " + floatToNilai(nilaiToFloat(self.fRevBSPL.getText())) + " tidak boleh lebih tinggi dari Total Nilai Aset BA Rekon " + floatToNilai(nilaiToFloat(total_nilast)) + ", selisih = " + floatToNilai(selisih));
								}else{
									//jml margin = nilai aset ba rekon + cogs
									var nilai_aset_ba = 0;
									var tot_cogs = 0;
									var tot_margin_rev = 0;
									var error_bacc = 0;
									var error_batp = 0;
									// for(i=0;i < self.sg2.getRowCount();i++){
									// 	if(self.sg2.cells(2,i) != 0){								
									// 		tot_cogs = parseFloat(tot_cogs) + parseFloat(self.sg2.cells(2,i));
									// 	}
										//cek kalo cocd / tp seribu bacc / batpnya ga boleh kosong
										// if(self.cc_icm == '1000' && (self.sg2.cells(4,i) == '' || self.sg2.cells(4,i) == null || self.sg2.cells(4,i) == undefined)){
										// 	var error_bacc = 1;
										// }
										// if(self.tp_icm == '1000' && (self.sg2.cells(3,i) == '' || self.sg2.cells(3,i) == null || self.sg2.cells(3,i) == undefined)){
										// 	var error_batp = 1;
										// }
									// }
									for(i=0;i < self.sg3.getRowCount();i++){
										if(self.sg3.cells(11,i) != 0){								
											nilai_aset_ba = parseFloat(nilai_aset_ba) + parseFloat(self.sg3.cells(11,i));
										}
									}
									for(i=0;i < self.sg3.getRowCount();i++){
										if(self.sg3.cells(10,i) != 0){								
											tot_margin_rev = parseFloat(tot_margin_rev) + parseFloat(self.sg3.cells(10,i));	
										}
									}
									//jika nilai aset tidak minus margin tidak boleh minus
									var error_minus_margin = 0;	
									var error_minus_str = '';								
									for(i=0;i < self.sg3.getRowCount();i++){
										if(self.sg3.cells(11,i) > 0 && self.sg3.cells(10,i) < 0){								
											var error_minus_margin = 1;
											error_minus_str = error_minus_str + 'baris ' + (i+1) + ' : Margin negatif tetapi nilai aset positif <br/>';
										}
									}

									if(error_bacc == 1 || error_batp == 1){
										if(error_bacc == 1){
											system.alert(self, "BATP tidak boleh ada yang kosong karena cocd icm adalah 1000");
										}
										if(error_batp == 1){
											system.alert(self, "BACC tidak boleh ada yang kosong karena tp icm adalah 1000");
										}
									}else{
										// console.log(Number(tot_margin_rev) +" + "+ Number(nilaiToFloat(self.fCogs.getText())) +" <= "+ Number(nilaiToFloat(self.fNilAst.getText())));
										// var selisih = nilaiToFloat(self.fNilAst.getText()) - (Number(tot_margin_rev) + Number(nilaiToFloat(self.fCogs.getText())));
										// if((Number(tot_margin_rev) + Number(nilaiToFloat(self.fCogs.getText()))) > Number(nilaiToFloat(self.fNilAst.getText()))){
										// 	system.alert(self, "Nilai Penjumlahan Total Margin BSPL " +floatToNilai(Number(tot_margin_rev))+ " ditambah Total COGS " +floatToNilai(nilaiToFloat(self.fCogs.getText()))+ " tidak boleh lebih tinggi dari nilai aset BA Rekon " +floatToNilai(nilaiToFloat(self.fNilAst.getText())) + ", selisih = " + floatToNilai(selisih));
										// }else{
											// if((Number(tot_margin_rev) + Number(nilaiToFloat(self.fCogs.getText()))) < Number(nilaiToFloat(self.fNilAst.getText()))){
											// 	self.confirm("Warning","Nilai Penjumlahan Total Margin BSPL " +floatToNilai(Number(tot_margin_rev))+ " ditambah Total COGS " +floatToNilai(nilaiToFloat(self.fCogs.getText()))+ " lebih rendah dari nilai aset BA Rekon " +floatToNilai(nilaiToFloat(self.fNilAst.getText())) + ", selisih = " + floatToNilai(selisih) + ", submit data?", function(result){
											// 		if(self.fExp.getText() == '' || self.fExp.getText() == undefined){
											// 			submit_data = 0;
											// 			system.alert(self, "Karena nilai penjumlahan margin BSPL dengan COGS lebih kecil daripada nilai aset BA Rekon, kolom explanation wajib diisi!");
											// 		}else{
											// 			if(error_minus_margin == 1){	
											// 				self.confirm("Warning","terdapat margin yang bernilai negatif yang berarti transaksi aset mengalami kerugian , submit data?", function(result){
											// 					self.saveDB();
											// 				});									
											// 			}else{
											// 				self.saveDB();															
											// 			}
											// 		}
											// 	});
											// }else{
												if(error_minus_margin == 1){	
													self.confirm("Warning","terdapat margin yang bernilai negatif yang berarti transaksi aset mengalami kerugian , submit data?", function(result){
														self.saveDB();
													});									
												}else{
													self.saveDB();													
												}
											// }	
										// }
									}
								}
							// }
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
	saveDB : function(){
		try{
			var self = this;
			//jurnal pajak margin
			if(self.status_periode == 'LOCK'){
				system.alert(self, "Periode " + self.fPeriode.getText() + " untuk cocd " + self.fCOCDi.getText() + " belum di OPEN di Menu LOCK Period!");
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
						if(self.sg3.cells(10,i) != 0 && self.sg3.cells(2,i) == 'Jual Beli Aset'){
							tot_margin_tax = tot_margin_tax + nilaiToFloat(self.sg3.cells(10,i));			
						}
					}
					self.app.services.callServices("financial_BsplMaster", "getDataParamAkunJTax", [self.app._lokasi,self.cc_icm], (data) => {
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
						if(self.sg3.cells(10,i) != 0 && self.sg3.cells(2,i) == 'Jual Beli Aset'){
							if(self.sg3.cells(10,i) > 0){
								var akun_debet = self.akun_utang_pajak;
								var nama_debet = self.nama_utang_pajak;
								var akun_kredit = self.akun_beban_pajak;
								var nama_kredit = self.nama_beban_pajak;
								var nilai_pajak = Math.round(parseFloat(self.sg3.cells(10,i))*parseFloat(self.tarif_pajak)/100);
								var jenis_akun_debet = 'UTX'
								var jenis_akun_kredit = 'BTX'
							}else{
								var akun_debet = self.akun_beban_pajak;
								var nama_debet = self.nama_beban_pajak;
								var akun_kredit = self.akun_utang_pajak;
								var nama_kredit = self.nama_utang_pajak;
								var nilai_pajak = Math.round(-1*parseFloat(self.sg3.cells(10,i))*parseFloat(self.tarif_pajak)/100);
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
									jenis_jurnal : 'PAJAK',
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
									jenis_jurnal : 'PAJAK',
									jenis_akun : jenis_akun_kredit,
									cc : self.tp_icm,
									tp : self.cc_icm,
									orig_acct : akun_kredit,
									acct_coa : akun_kredit
								}
								jurnal_pajak_array.push(items);	
							}		
						}
					}
					self.jurnal_pajak_array = jurnal_pajak_array;
					
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
					// for(i=0;i < self.sg2.getRowCount();i++){
					// 	var items = {
					// 		orig_acct : self.sg2.cells(0,i),
					// 		acct_coa : '-',
					// 		nilai : self.sg2.cells(2,i),
					// 		bacc : self.sg2.cells(3,i),
					// 		batp : self.sg2.cells(4,i),
					// 	}
					// 	data_cogs.push(items);
					// }
					var data_aset = [];
					for(i=0;i < self.sg3.getRowCount();i++){
						if(self.sg3.cells(12,i) == '' || self.sg3.cells(12,i) == null || self.sg3.cells(12,i) == undefined){
							var ap_simpan = 0;
						}else{
							var ap_simpan = self.sg3.cells(12,i);										
						}
						if(self.sg3.cells(13,i) == '' || self.sg3.cells(13,i) == null || self.sg3.cells(13,i) == undefined){
							var bp_simpan = 0;
						}else{
							var bp_simpan = self.sg3.cells(13,i);										
						}
						if(self.sg3.cells(14,i) == '' || self.sg3.cells(14,i) == null || self.sg3.cells(14,i) == undefined || isFinite(self.sg3.cells(14,i)) == false || isFinite(self.sg3.cells(14,i)) == 'false'){
							var dep_per_bln_simpan = 0;
						}else{
							var dep_per_bln_simpan = self.sg3.cells(14,i);										
						}
						var items = {
							icm : self.fICM.getText(),
							periode : self.fPeriode.getText(),
							orig_acct : self.sg3.cells(0,i),
							acct_coa : '-',
							nama : self.sg3.cells(3,i),
							klp_aset : self.sg3.cells(4,i),
							tgl_perolehan : self.sg3.cells(5,i),
							periode_susut : self.sg3.cells(8,i),
							umur : self.sg3.cells(9,i),
							margin : self.sg3.cells(10,i),
							hp : self.sg3.cells(11,i),
							ap : ap_simpan,
							bp : bp_simpan,
							peny_per_bln : dep_per_bln_simpan,
							keterangan : self.sg3.cells(15,i),
							tipe_ledger : tipe_ledger,
							cc : self.fCOCD.getText(),
							tp : self.fTP.getText(),
							jenis_trans : self.sg3.cells(2,i),
							jenis_rekon : self.sg3.cells(1,i),
							explanation : self.fExp.getText(),			
							bacc : self.sg3.cells(6,i),
							batp : self.sg3.cells(7,i),							
							no_aset : self.sg3.cells(16,i),							
							periode_input : self.fPeriode.getText()							
						}
						data_aset.push(items);
					}
					console.log("jurnal backprocess");
					// console.log(self.jurnal_rev_array);
					// console.log(self.jurnal_cogs_array);
					// console.log(self.jurnal_pajak_array);                                    
					// console.table(self.jurnal_reverse_array);                                                                              
					var data_j_rev = [];
					for(i=0;i<self.jurnal_rev_array.length;i++){
						if(self.jurnal_rev_array[i].post_key == '40'){
							var nilai_j = self.jurnal_rev_array[i].debet;
						}else{
							var nilai_j = self.jurnal_rev_array[i].kredit;
						}
						var items = {
							icm : self.jurnal_rev_array[i].icm,
							post_key : self.jurnal_rev_array[i].post_key,
							tgl_jurnal : self.jurnal_rev_array[i].tgl_jurnal,
							kode_akun : self.jurnal_rev_array[i].kode_akun,
							nilai : nilai_j,
							keterangan : self.jurnal_rev_array[i].keterangan,
							jenis_jurnal : self.jurnal_rev_array[i].jenis_jurnal,
							jenis_akun : self.jurnal_rev_array[i].jenis_akun,
							cc : self.jurnal_rev_array[i].cc,
							tp : self.jurnal_rev_array[i].tp,
							orig_acct : self.jurnal_rev_array[i].orig_acct,
							acct_coa : self.jurnal_rev_array[i].acct_coa
						}
						data_j_rev.push(items);
					}
					var data_j_cogs = [];
					// for(i=0;i<self.jurnal_cogs_array.length;i++){
					// 	if(self.jurnal_cogs_array[i].post_key == '40'){
					// 		var nilai_j = self.jurnal_cogs_array[i].debet;
					// 	}else{
					// 		var nilai_j = self.jurnal_cogs_array[i].kredit;
					// 	}
					// 	var items = {
					// 		icm : self.jurnal_cogs_array[i].icm,
					// 		post_key : self.jurnal_cogs_array[i].post_key,
					// 		tgl_jurnal : self.jurnal_cogs_array[i].tgl_jurnal,
					// 		kode_akun : self.jurnal_cogs_array[i].kode_akun,
					// 		nilai : nilai_j,
					// 		keterangan : self.jurnal_cogs_array[i].keterangan,
					// 		jenis_jurnal : self.jurnal_cogs_array[i].jenis_jurnal,
					// 		jenis_akun : self.jurnal_cogs_array[i].jenis_akun,
					// 		cc : self.jurnal_cogs_array[i].cc,
					// 		tp : self.jurnal_cogs_array[i].tp,
					// 		orig_acct : self.jurnal_cogs_array[i].orig_acct,
					// 		acct_coa : self.jurnal_cogs_array[i].acct_coa
					// 	}
					// 	data_j_cogs.push(items);
					// }                              
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
	
					var data_j_reverse = [];										    
					// $.each(self.jurnal_reverse_array,(k,v)=>{
					// 	if(v.post_key == '40'){
					// 		var nilai_j = v.debet;
					// 	}else{
					// 		var nilai_j = v.kredit;
					// 	}									                                            
					// 	var items = {
					// 		icm : v.icm,
					// 		post_key : v.post_key,
					// 		tgl_jurnal : v.tgl_jurnal,
					// 		kode_akun : v.kode_akun,
					// 		nilai : nilai_j,
					// 		keterangan : v.keterangan,
					// 		jenis_jurnal : v.jenis_jurnal,
					// 		jenis_akun : v.jenis_akun,
					// 		cc : v.cc,
					// 		tp : v.tp,
					// 		orig_acct : v.orig_acct,
					// 		acct_coa : v.acct_coa,
					// 		no_aset : v.no_aset,
					// 	}
					// 	data_j_reverse.push(items);
					// });
	
					// console.table(data_j_rev);
					// console.table(data_j_cogs);
					// console.table(data_j_tax);
					// console.table(data_j_reverse);
					
					this.app.services.callServices("financial_BsplMaster","addAsetKoreksi",[self.app._lokasi,self.fICM.getText(),self.fPeriode.getText(),data_rev,data_cogs,data_aset,data_j_rev,data_j_cogs,data_j_tax,data_j_reverse],function(data){
						if (data == 'process completed') {
							self.filter = {
								tot_rev : nilaiToFloat(self.fRev.getText()),
								tot_rev_bspl : nilaiToFloat(self.fRevBSPL.getText()),
								tot_cogs : 0,
								tot_margin : nilaiToFloat(self.fMargin.getText()),
								tot_persen_margin : nilaiToFloat(self.fPersenMargin.getText()),
								tot_nilai_aset_ba : nilaiToFloat(self.fNilAst.getText()),
								icm : self.fICM.getText(),
								periode : self.fPeriode.getText(),
								cc : self.cc_icm,
								tp : self.tp_icm,
								jenis_jasa : self.jenis_jasa
							};
	
							self.tab.setActivePage(self.tab.childPage[0]);
							
							// self.bExportKKP.show();													
							// self.bSubmit.hide();
							// self.bSaveAsDraft.hide();

							self.fICM.setText('');
							self.fPeriode.setText(self.periode_today);
							self.fCOCD.setText('');
							self.fTP.setText('');
							self.fExp.setText('');
							self.fRev.setText(0);
							self.fRevBSPL.setText(0);
							self.fNilAst.setText(0);																			
							// self.fCogs.setText(0);
							self.fMargin.setText(0);
							// self.cboxPSAK.setSelected(false);
                            // self.cboxIFRS.setSelected(false);
                            	
							self.sg1.clear(1);	
							self.sg3.clear(1);	
							// self.sg4.clear(0);
							
							system.info(self, "Data berhasil tersimpan","");
						}else {
							system.alert(self, data,"");
						}
					});
				});
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	loadID: function(){
		var self = this;
        self.app.services.callServices("financial_BsplMaster","getIDAset",[self.app._lokasi],function(data){  
			self.fNoAset.setText(data.id_otomatis);                
		});
    },
    getVarForm: function(){
		var self = this;
        self.app.services.callServices("financial_BsplMaster","getAkunADK",[self.app._lokasi,''],function(data){  
            if (typeof data != 'undefined' && data != null && data != 0){
                self.akunADK = data;          
            }   
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
