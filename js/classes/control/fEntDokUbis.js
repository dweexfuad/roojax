window.app_fca_modul_fEntDokUbis = function(owner,menu)
{
	if (owner)
	{
		window.app_fca_modul_fEntDokUbis.prototype.parent.constructor.call(this,owner);
		this.className  = "app_fca_modul_fEntDokUbis";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Entry Dokumen (UBIS)", 0);
		uses("control_popupForm;column;saiMemo;pageControl;radioButton;saiUpload;saiEdit;control_popupForm;checkBox;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");			
		var self = this;
		self.fcbp="-";
		if(menu == undefined){
			menu = this.app._menu;
		}else{
			this.app._menu = menu;
		}
		if(menu == "REJECTOFF"){
			self.fcbp = "REJECTOFF";
		}

		this.tab = new pageControl(this,{bound:[10,30,this.width,this.height-50],
				childPage: ["Document List","Entry Document","Note"],
				borderColor:"#35aedb", headerAutoWidth:false});			

		this.bFilter = new button(this.tab.childPage[0],{bound:[this.width-150,0,100, 20], caption:"Filter"});
		this.bFilter.setIcon("icon/fslint.png");

		this.sg1 = new saiGrid(this.tab.childPage[0],{bound:[1,25,this.width-50,this.height-100],
			colCount: 7,
			colTitle: ["ID","Kode Vendor","Nama Vendor","BA","Tgl Input","Status","Note"],
			colWidth:[[6,5,4,3,2,1,0],[50,150,120,50,300,80,40]],
			columnReadOnly:[true, [0,1,2,3,4],[]],		
			// colFormat:[[7],[cfNilai]],		
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			ellipsClick: [this,"doEllipsClick"]
		});
		self.sg1.on("dblClick", function(col, row, id){
			if(col == 0 || col == 1 || col == 2 || col == 3 || col == 4 || col == 5){	

				self.sgAddInvoice.clear();
				self.sgAddDPP.clear();
				self.sgAddFP.clear();
				self.sgAddPPH.clear();
				self.sgAddUM.clear();
				self.sgAddBast.clear();
				self.sgAddBaut.clear();
				self.sgAddJUM.clear();
				self.sgAddJapel.clear();
				self.sgAddJapem.clear();
				self.totKP.setText("");
				self.totDPP.setText("");
				self.totFP.setText("");
				self.totPPH.setText("");
				self.totBast.setText("");
				self.totUM.setText("");
				self.totJapel.setText("");
				self.totJapem.setText("");
				self.ckStagih.setSelected(false);
								
				self.noStagih.setText("");
				self.tglDokStagih.setText("");
				self.tglMasukStagih.setText("");

				self.ckInv.setSelected(false);
				self.noInv.setText("");
				self.tglDokInv.setText("");
				self.tglMasukInv.setText("");

				self.ckPo.setSelected(false);
				self.amountPo.setText("");
				self.tahapPo.setText("");
				self.nAman.setText("");

				self.ckBaut.setSelected(false);
				self.noBaut.setText("");
				self.tglBaut.setText("");


				self.ckPPH.setSelected(false);
				self.jenisPPH.setText("");
				self.persenPPH.setText("");
				self.amPPH.setText("");
				self.wapuPPH.setText("");

				self.ckBast.setSelected(false);
				self.amBast.setText("");
				self.tglBast.setText("");
				self.noMIGOBast.setText("");
				self.tanggal.setText("");
			
				self.ckKP.setSelected(false);
				self.amKP.setText("");
				self.dppKP.setText("");
				self.noKP.setText("");

				self.ckNrRek.setSelected(false);
				self.noRek.setText("");
				self.bankRek.setText("");
				self.aNamaRek.setText("");
				// self.nBrgRek.setText("");

				self.ckFP.setSelected(false);
				self.amFP.setText("");
				self.noFP.setText("");
				self.tglFP.setText("");

				self.ckJUM.setSelected(false);
				self.nomJUM.setText("");
				self.amJUM.setText("");
				self.asJUM.setText("");
				self.tglJUM.setText("");
				self.noAsJUM.setText("");

				self.ckJapel.setSelected(false);
				self.amJapel.setText("");
				self.asJapel.setText("");
				self.tglJapel.setText("");
				self.noAsJapel.setText("");

				self.ckJapem.setSelected(false);
				self.amJapem.setText("");
				self.asJapem.setText("");
				self.tglJapem.setText("");
				self.noAsJapem.setText("");

				self.ckPa.setSelected(false);
				self.amPa.setText("");
				self.asPa.setText("");
				self.tglPa.setText("");

				self.ckTT.setSelected(false);
				self.noTT.setText("");
				self.tglTT.setText("");

				self.ckSIU.setSelected(false);
				self.noSIU.setText("");
				self.tglmSIU.setText("");
				self.tglaSIU.setText("");

				self.ckNpwp.setSelected(false);
				self.noNpwp.setText("");
				self.tglNpwp.setText("");
				
				self.ckForm.setSelected(false);
				self.noForm.setText("");
				self.tglForm.setText("");
				self.ngrForm.setText("");

				self.ckCod.setSelected(false);
				self.noCod.setText("");
				self.tglCod.setText("");
				self.ngrCod.setText("");

				self.ckCoo.setSelected(false);
				self.noCoo.setText("");
				self.isCoo.setText("");

				self.ckSL.setSelected(false);
				self.noSL.setText("");
				self.tglSL.setText("");

				self.ckDenda.setSelected(false);
				self.jmlDenda.setText("");
				self.jmlHari.setText("");

				self.ckProposal.setSelected(false);
				self.adaProposal.setText("");
							
				self.app.services.callServices("financial_Fca","sendWaktu01",[self.sg1.cells(0, row),self.app._lokasi], function(data){				
				});

				if(self.sg1.cells(5, row) == "Waiting For Approval"){
					self.note1.setText("-");
					self.dppmaterial.setText(0);					
					self.dppjasa.setText(0);
					self.app.services.callServices("financial_Fca","sendWaktu001",[self.sg1.cells(0, row),"7",self.app._lokasi], function(data){	
						self.statusbaru.setText("7");	
					});
					self.nt.setText("1");
					self.sts_baru.setText("New");	

					self.app.services.callServices("financial_Fca","getBaDis",[self.sg1.cells(0, row),self.app._lokasi], function(data){				
						self.kodeBA.setText(data.induk.kode_ubis);
						self.cc.setServices(self.app.servicesBpc, "callServices",["financial_Fca","getListCC",["","","",0]],["kode_cc","nama"],"kode_ubis = '"+data.induk.kode_ubis+"' and kode_lokasi='"+self.app._lokasi+"' ","Daftar Cost Center");
					});

					self.app.services.callServices("financial_Fca","getBank",[self.sg1.cells(1, row),self.app._lokasi], function(data){				
						if(data.induk.no_rek != "" && data.induk.nama_bank != "" && data.induk.an_rek != ""){
							self.ckNrRek.setSelected(true);
							self.noRek.setText(data.induk.no_rek);
							self.bankRek.setText(data.induk.nama_bank);
							self.aNamaRek.setText(data.induk.an_rek);
						}else{
							self.ckNrRek.setSelected(false);
							self.noRek.setText(data.induk.no_rek);
							self.bankRek.setText(data.induk.nama_bank);
							self.aNamaRek.setText(data.induk.an_rek);
						}
					});
				}

				

				if(self.sg1.cells(5, row) == "Reject" || self.sg1.cells(5, row) == "Waiting For Approval (Revisi)"){	
					self.bDetNote.setVisible(true);
					self.app.services.callServices("financial_Fca","getDetNote",[self.sg1.cells(0, row)], function(data){	
						$.each(data.detail, function(key, val){ 
							if(val.no_item == "0"){			
								self.revvend2.setCaption(val.notes);
							}
							else if(val.no_item == "1"){
								self.revakun2.setCaption(val.notes);
							}	
							else if(val.no_item == "2"){								
								self.revcc2.setCaption(val.notes);
							}	
							else if(val.no_item == "3"){								
								self.revpo2.setCaption(val.notes);
							}	
							else if(val.no_item == "4"){		
								self.revsurtagih2.setCaption(val.notes);
							}	
							else if(val.no_item == "5"){		
								self.revkp2.setCaption(val.notes);
							}	
							else if(val.no_item == "6"){		
								self.revfp2.setCaption(val.notes);
							}	
							else if(val.no_item == "7"){		
								self.revpoppn2.setCaption(val.notes);
							}	
							else if(val.no_item == "8"){		
								self.revrek2.setCaption(val.notes);
							}	
							else if(val.no_item == "9"){		
								self.revoth2.setCaption(val.notes);
							}	
						});													
					});

					self.app.services.callServices("financial_Fca","sendWaktu001",[self.sg1.cells(0, row),"70",self.app._lokasi], function(data){
						self.statusbaru.setText("70");
					});

					self.note1.setVisible(true);

					self.app.services.callServices("financial_Fca","getRejectDoc",[self.sg1.cells(0, row)], function(data){	
						
						if(data.induk.jenis_uang == "Uang Muka"){
							self.persenSblm.setText(data.detail1.persen_um);
							self.app.services.callServices("financial_Fca","getTbhUM",[self.sg1.cells(0, row),self.app._lokasi], function(data){											
								self.totUM.setText(floatToNilai(data.induk.uang_muka));	
								self.totPerUM.setText(floatToNilai(data.induk.persen_um));	
								
									$.each(data.detail, function(key, val){
										self.sgAddUM.addRowValues([val.persen_um, val.uang_muka]);	
									});
								
							});
						}
							self.kat_dok.setText(data.induk.kat_dok);
							self.totBast.setText(floatToNilai(data.induk.am_bast));
							self.totJUM.setText(floatToNilai(data.induk.am_jum));
							self.totJapel.setText(floatToNilai(data.induk.am_japel));
							self.totJapem.setText(floatToNilai(data.induk.am_japem));

							self.dppmaterial.setText(floatToNilai(data.induk.dppmaterial));							
							self.dppjasa.setText(floatToNilai(data.induk.dppjasa));		
							self.nt.setText(data.induk.no_tagihan);
							self.sts_baru.setText("Reject");
						
							if(data.induk.jenis == "KT"){
								self.checkbox1.setSelected(true);
							}else if (data.induk.jenis == "NP"){
								self.checkbox2.setSelected(true);
							}

							self.ntagih2.setText(data.induk.nilai_tagihan_asli);
							self.proyek.setText(data.induk.nama_proyek);
							self.jenisvendor.setText(data.induk.jenis_vendor);
							self.ket.setText(data.induk.keterangan);
							self.nokon.setText(data.induk.no_kontrak);
							
							self.tglkon.setText(data.induk.tgl_kontrak);
							self.currkon.setText(data.induk.curr_kontrak);
							self.nilkon.setText(floatToNilai(data.induk.nilai_kontrak));
							self.nopo.setText(data.induk.no_posp);
							self.tglpo.setText(data.induk.tgl_posp);
							self.currpo.setText(data.induk.curr_po);
							self.nilpo.setText(floatToNilai(data.induk.nilai_posp));
							self.noaman.setText(data.induk.no_amd);
							self.nilaman.setText(floatToNilai(data.induk.nilai_amd));
							self.tglaman.setText(data.induk.tgl_amd);
							self.curraman.setText(data.induk.curr_amd);
							self.jenis_nilai.setText(data.induk.jenis_nilai);
							self.ntagih.setText(floatToNilai(data.induk.nilai_tagihan));
							self.ntagihcurr.setText(floatToNilai(data.induk.nilai_curr));
							self.currtagih.setText(data.induk.curr);
							self.nbayar.setText(floatToNilai(data.induk.nilai_bayar));
							self.nbayarcurr.setText(data.induk.nilai_bayar_curr);
							self.currbayar.setText(data.induk.curr_bayar);
	
							self.kodeBA.setText(data.induk.kode_ba);
							self.jnsTrans.setText(data.induk.jns_trans);	

							self.kdAkun.setText(data.induk.kode_akun, data.induk.nama_akun);
							self.cc.setText(data.induk.kode_cc, data.induk.nama_cc);						
							self.keg.setText(data.induk.kode_rkm, data.induk.nama_kegiatan);
							self.termin.setText(data.induk.termin);
							self.jenis_uang.setText(data.induk.jenis_uang);
							if(data.induk.jns_dpp == "gabung"){
								self.jenis_dpp.setSelected(false);
								self.jenis_dpp2.setText(data.induk.jns_dpp);
							}else{
								self.jenis_dpp.setSelected(true);
								self.jenis_dpp2.setText(data.induk.jns_dpp);
							}

							self.amKP.setCaption("Amount ("+data.induk.curr_po+")");	
							self.dppKP.setCaption("DPP ("+data.induk.curr_po+")");

							self.totFP.setCaption("Total Faktur Pajak ("+data.induk.curr_po+")");
							self.totFP.setText(floatToNilai(data.induk.tot_fp));
							self.totDPP.setCaption("Total DPP ("+data.induk.curr_po+")");
							self.totDPP.setText(floatToNilai(data.induk.tot_dpp));
							self.totKP.setCaption("Total Kwitansi ("+data.induk.curr_po+")");
							self.totKP.setText(floatToNilai(data.induk.tot_kp));


							self.amFP.setCaption("Amount ("+data.induk.curr_po+")");	
							self.amPPH.setCaption("Amount ("+data.induk.curr_po+")");
							self.totPPH.setCaption("Total PPh ("+data.induk.curr_po+")");
							self.totPPH.setText(floatToNilai(data.induk.tot_pph));
							self.amountPo.setCaption("Amount ("+data.induk.curr_po+")");
							self.nAman.setCaption("Nil. Amand ("+data.induk.curr_po+")");		
							self.amBast.setCaption("Amount ("+data.induk.curr_po+")");	
							// self.nBrgBast.setCaption("Nilai Barang ("+data.induk.curr_po+")");	
							// self.nJasaBast.setCaption("Nilai Jasa ("+data.induk.curr_po+")");	
							self.amJUM.setCaption("Amount ("+data.induk.curr_po+")");	
							self.amJapel.setCaption("Amount ("+data.induk.curr_po+")");
							self.amJapem.setCaption("Amount ("+data.induk.curr_po+")");	
							self.jmlDenda.setCaption("Amount ("+data.induk.curr_po+")");
							self.nbayar.setCaption("Nilai Bayar ("+data.induk.curr_po+")");		

							


						$.each(data.detail, function(key, val){

							if(val.no_urut == "1"){
								self.ckStagih.setSelected(true);
								self.noStagih.setText(val.value1);
								self.tglDokStagih.setText(val.value2);
								self.tglMasukStagih.setText(val.value3);
							}
	
							if(val.no_urut == "2"){
								self.ckInv.setSelected(true);
								self.sgAddInvoice.addRowValues([val.value1, val.value2, val.value3]);
								// self.noInv.setText(val.value1);
								// self.tglDokInv.setText(val.value2);
								// self.tglMasukInv.setText(val.value3);
								// self.sgAdd1.addRowValues([val.value1,val.value2,val.value3]);
								
							}

							if(val.no_urut == "3"){
								self.ckKP.setSelected(true);
								self.sgAddDPP.addRowValues([val.value1, val.value2, val.value3, val.value4, val.value5]);

								// self.persen.setText(val.value1)
								// self.amKP.setText(floatToNilai(val.value2));
								// self.dppKP.setText(floatToNilai(val.value3));
								// self.noKP.setText(val.value4);
								// self.tglKP.setText(val.value5);
								// self.sgAdd2.addRowValues([val.value1,val.value2,val.value3]);
							}

							if(val.no_urut == "4"){
								self.ckFP.setSelected(true);
								self.sgAddFP.addRowValues([val.value1, val.value2, val.value3, val.value4]);		
								// self.amFP.setText(floatToNilai(val.value1));
								// self.noFP.setText(val.value2);	
								// self.tglFP.setText(val.value3);	
								// self.wapuPPH.setText(val.value4);					
								// self.sgAdd3.addRowValues([val.value1, val.value3]);							
							}
	
							if(val.no_urut == "5"){
								self.ckPPH.setSelected(true);	
								// self.jenisPPH.setText(val.value1);
								// self.persenPPH.setText(val.value2);	
								// self.amPPH.setText(val.value3);										
								self.sgAddPPH.addRowValues([val.value1, val.value2, val.value3]);							
							}

							if(val.no_urut == "6"){
								self.ckPo.setSelected(true);
								self.amountPo.setText(floatToNilai(val.value1));
								self.tahapPo.setText(val.value2);
								self.nAman.setText(floatToNilai(val.value3));
							}
	
							if(val.no_urut == "7"){
								self.ckBaut.setSelected(true);
								self.sgAddBaut.addRowValues([val.value1, val.value2]);
								// self.noBaut.setText(val.value1);
								// self.tglBaut.setText(val.value2);
							}
	
							if(val.no_urut == "8"){
								self.ckBast.setSelected(true);
								self.sgAddBast.addRowValues([floatToNilai(val.value1), val.value2, val.value3, val.value4]);
								// self.amBast.setText(floatToNilai(val.value1));
								// self.tglBast.setText(val.value2);
								// self.noMIGOBast.setText(val.value3);
								// self.tanggal.setText(val.value4);
								// self.nBrgBast.setText(floatToNilai(val.value5));
								// self.nJasaBast.setText(floatToNilai(val.value6));
							}
	
						
	
							if(val.no_urut == "9"){
								self.ckNrRek.setSelected(true);
								self.noRek.setText(val.value1);
								self.bankRek.setText(val.value2);
								self.aNamaRek.setText(val.value3);
								// self.nBrgRek.setText(val.value4);
							}
	
							if(val.no_urut == "10"){
								self.ckJUM.setSelected(true);
								self.sgAddJUM.addRowValues([val.value5, floatToNilai(val.value1), val.value2, val.value3, val.value4]);
								// self.nomJUM.setText(val.value5);
								// self.amJUM.setText(floatToNilai(val.value1));
								// self.asJUM.setText(val.value2);
								// self.tglJUM.setText(val.value3);
								// self.noAsJUM.setText(val.value4);
							}
	
							if(val.no_urut == "11"){
								self.ckJapel.setSelected(true);
								self.sgAddJapel.addRowValues([floatToNilai(val.value1), val.value2, val.value3, val.value4]);
								// self.amJapel.setText(floatToNilai(val.value1));
								// self.asJapel.setText(val.value2);
								// self.tglJapel.setText(val.value3);
								// self.noAsJapel.setText(val.value4);
							}
	
							if(val.no_urut == "12"){
								self.ckJapem.setSelected(true);
								self.sgAddJapem.addRowValues([floatToNilai(val.value1), val.value2, val.value3, val.value4]);
								// self.amJapem.setText(floatToNilai(val.value1));
								// self.asJapem.setText(val.value2);
								// self.tglJapem.setText(val.value3);
								// self.noAsJapem.setText(val.value4);
							}
	
							if(val.no_urut == "13"){
								
								self.amPa.setText(val.value1);
								self.asPa.setText(val.value2);
								self.tglPa.setText(val.value3);
								if(val.value1 != "" || val.value2 != "" ){
									self.ckPa.setSelected(true);
								}else{
									self.ckPa.setSelected(false);
								}
							}
	
							if(val.no_urut == "14"){
								self.noTT.setText(val.value1);
								self.tglTT.setText(val.value2);

								if(val.value1 != "" || val.value2 != ""){
									self.ckTT.setSelected(true);
								}else{
									self.ckTT.setSelected(false);
								}
							}
	
							if(val.no_urut == "15"){								
								self.noSIU.setText(val.value1);
								self.tglmSIU.setText(val.value2);
								self.tglaSIU.setText(val.value3);

								if(val.value1 != "" || val.value2 != "" || val.value3 != "" ){
									self.ckSIU.setSelected(true);
								}else{
									self.ckSIU.setSelected(false);
								}
							}
	
							if(val.no_urut == "16"){								
								self.noNpwp.setText(val.value1);
								self.tglNpwp.setText(val.value2);

								if(val.value1 != "" || val.value2 != ""){
									self.ckNpwp.setSelected(true);
								}else{
									self.ckNpwp.setSelected(false);
								}
							}
	
							if(val.no_urut == "17"){
								self.noForm.setText(val.value1);
								self.tglForm.setText(val.value2);
								self.ngrForm.setText(val.value3);
								if(val.value1 != "" || val.value2 != "" || val.value3 != "" ){
									self.ckForm.setSelected(true);
								}else{
									self.ckForm.setSelected(false);
								}
							}

							if(val.no_urut == "18"){
								
								self.noCod.setText(val.value1);
								self.tglCod.setText(val.value2);
								self.ngrCod.setText(val.value3);
								if(val.value1 != "" || val.value2 != "" || val.value3 != ""){
									self.ckCod.setSelected(true);
								}else{
									self.ckCod.setSelected(false);
								}
							}
	
							if(val.no_urut == "19"){
								
								self.noCoo.setText(val.value1);
								self.isCoo.setText(val.value2);

								if(val.value1 != "" || val.value2 != "" ){
									self.ckCoo.setSelected(true);
								}else{
									self.ckCoo.setSelected(false);
								}
							}
	
							if(val.no_urut == "20"){
								
								self.noSL.setText(val.value1);
								self.tglSL.setText(val.value2);	
								if(val.value1 != "" || val.value2 != "" ){
									self.ckSL.setSelected(true);
								}else{
									self.ckSL.setSelected(false);
								}						
							}
	
							if(val.no_urut == "21"){							
								self.jmlHari.setText(val.value1);
							
								if(val.value1 != "" || val.value2 != "" ){
									self.ckDenda.setSelected(true);
									self.jmlDenda.setText(floatToNilai(val.value2));
								}else{
									self.ckDenda.setSelected(false);
									self.jmlDenda.setText(val.value2);
								}					
							}

							
							if(val.no_urut == "22"){
								self.ckProposal.setSelected(true);
								self.adaProposal.setText(val.value1);																
							}
	
						
			
							
						});
						
					});



				
					

				
	
				}
				// page = self.sg1.page;
				// row = ((page-1) * self.sg1.rowPerPage)+row;
				self.tab.setActivePage(self.tab.childPage[1]);
				self.regid.setText(self.sg1.cells(0, row));
				self.kdmitra.setText(self.sg1.cells(1, row));
				self.mitra.setText(self.sg1.cells(2, row));
			}
		
		});

		this.messageContainer = new listCustomView(this.tab.childPage[1], {bound:[0,0, this.width-50, this.tab.height - 100 ]});
		
		this.rearrangeChild(10, 22);
		this.messageContainer.setHeight(this.tab.height - 30);
		this.bSaveAsDraft = new button(this.tab.childPage[1],{bound:[this.width-190,0,100,20], icon:"<i class='fa fa-database' style='color:white'></i>",caption:"Save as Draft", click:[this,"doChange"]});
		this.bSaveAsDraft.setColor("#e84393");
		this.bDetNote = new button(this.tab.childPage[1],{bound:[this.width-180,0,60,20],visible:false, icon:"<i class='fa fa-clipboard' style='color:white'></i>",caption:"Revisi", click:[this,"doChange"]});
		this.bDetNote.setColor("orange");
		this.bDetNote.on("click", function(){
			self.pAlert10.show();
			self.pAlert10.setArrowMode(4);
			self.pAlert10.setTop(20 );
			self.pAlert10.setLeft(180);			
			self.pAlert10.getCanvas().fadeIn("slow");			
		});
		this.bScan = new button(this.tab.childPage[1],{bound:[this.width-260,0,60,20], icon:"<i class='fa fa-braille' style='color:white'></i>",caption:"Scan", click:[this,"doChange"]});
		this.bScan.setColor("#6c5ce7");
		this.bScan.on("click", function(){
			self.pScan.show();
			self.pScan.setArrowMode(4);
			self.pScan.setTop(20 );
			self.pScan.setLeft(180);			
			self.pScan.getCanvas().fadeIn("slow");			
		});



		this.pScan = new control_popupForm(this.app);
		this.pScan.setBound(0, 0,1000, 600);
		this.pScan.setArrowMode(4);
		this.pScan.hide();

		this.pAlert10 = new control_popupForm(this.app);
		this.pAlert10.setBound(0, 0,1000, 600);
		this.pAlert10.setArrowMode(4);
		this.pAlert10.hide();
		this.rev1 = new label(this.pAlert10, {bound:[10, 5, 350,20],caption:"<b>Data Detail Revisi :<b>", fontSize:14});
		//vendor	
		this.revvend = new label(this.pAlert10, {bound:[10, 50, 350,20],caption:"<b>Data Vendor<b>", fontSize:11, visible:true});	
		this.revvend1 = new label(this.pAlert10, {bound:[10, 75, 50,20],caption:"Notes :", fontSize:9, visible:true});
		this.revvend2 = new label(this.pAlert10, {bound:[60, 75, 350,20],caption:"-", fontSize:9, visible:true});
		//akun
		this.revakun = new label(this.pAlert10, {bound:[10, 120, 350,20],caption:"<b>Data Akun<b>", fontSize:11, visible:true});		
		this.revakun1 = new label(this.pAlert10, {bound:[10, 150, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revakun2 = new label(this.pAlert10, {bound:[60, 150, 350,20],caption:"-", fontSize:9, visible:true});
		//cc
		this.revcc = new label(this.pAlert10, {bound:[10, 195, 350,20],caption:"<b>Data Cost Center<b>", fontSize:11, visible:true});		
		this.revcc1 = new label(this.pAlert10, {bound:[10, 220, 350,20],caption:"Notes :", fontSize:9, visible:true});	
		this.revcc2 = new label(this.pAlert10, {bound:[60, 220, 350,20],caption:"-", fontSize:9, visible:true});	
		//po
		this.revpo = new label(this.pAlert10, {bound:[10, 265, 350,20],caption:"<b>Data PO/SP<b>", fontSize:11, visible:true});		
		this.revpo1 = new label(this.pAlert10, {bound:[10, 290, 350,20],caption:"Notes :", fontSize:9, visible:true});	
		this.revpo2 = new label(this.pAlert10, {bound:[60, 290, 350,20],caption:"-", fontSize:9, visible:true});		
		//surat tagihan
		this.revsurtagih = new label(this.pAlert10, {bound:[10, 335, 350,20],caption:"<b>Data Surat Tagihan<b>", fontSize:11, visible:true});		
		this.revsurtagih1 = new label(this.pAlert10, {bound:[10, 360, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revsurtagih2 = new label(this.pAlert10, {bound:[60, 360, 350,20],caption:"-", fontSize:9, visible:true});
		//kwitansi ppn
		this.revkp = new label(this.pAlert10, {bound:[10, 405, 350,20],caption:"<b>Data Kwitansi + PPN<b>", fontSize:11, visible:true});		
		this.revkp1 = new label(this.pAlert10, {bound:[10, 430, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revkp2 = new label(this.pAlert10, {bound:[60, 430, 350,20],caption:"-", fontSize:9, visible:true});
		//faktur pajak
		this.revfp = new label(this.pAlert10, {bound:[10, 475, 350,20],caption:"<b>Data Faktur Pajak<b>", fontSize:11, visible:true});		
		this.revfp1 = new label(this.pAlert10, {bound:[10, 500, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revfp2 = new label(this.pAlert10, {bound:[60, 500, 350,20],caption:"-", fontSize:9, visible:true});
		//po awal non ppn
		this.revpoppn = new label(this.pAlert10, {bound:[10, 545, 350,20],caption:"<b>Data PO Awal Non PPN<b>", fontSize:11, visible:true});		
		this.revpoppn1 = new label(this.pAlert10, {bound:[10, 570, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revpoppn2 = new label(this.pAlert10, {bound:[60, 570, 350,20],caption:"-", fontSize:9, visible:true});
		//rekening
		this.revrek = new label(this.pAlert10, {bound:[10, 615, 350,20],caption:"<b>Data Rekening<b>", fontSize:11, visible:true});		
		this.revrek1 = new label(this.pAlert10, {bound:[10, 640, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revrek2 = new label(this.pAlert10, {bound:[60, 640, 350,20],caption:"-", fontSize:9, visible:true});
		//data lain lain
		this.revoth = new label(this.pAlert10, {bound:[10, 685, 350,20],caption:"<b>Data Lain-Lain<b>", fontSize:11, visible:true});		
		this.revoth1 = new label(this.pAlert10, {bound:[10, 710, 350,20],caption:"Notes :", fontSize:9, visible:true});
		this.revoth2 = new label(this.pAlert10, {bound:[60, 710, 350,20],caption:"-", fontSize:9, visible:true});
		


		
		this.bTutup = new button(this.pAlert10, {bound:[870, 15,80,20], caption:"Close"});
		this.bTutup.setIcon("icon/application-exit2.png");
		this.bTutup.on("click", function(){
			self.pAlert10.hide();			
		});
		
		

		this.mitra = new saiLabelEdit(this.tab.childPage[1],{bound:[0,20,290,20],caption:"Nama Vendor",readOnly:true});	
		this.kdmitra = new saiLabelEdit(this.tab.childPage[1],{bound:[320,20,180,20],caption:"Kode Vendor",readOnly:true});
		this.nt = new saiLabelEdit(this.tab.childPage[1],{bound:[800,20,200,20],caption:"notagih",readOnly:true, visible:false});	
		this.sts_baru = new saiLabelEdit(this.tab.childPage[1],{bound:[1000,20,200,20],caption:"status",readOnly:true, visible:false});	
		this.statusbaru = new saiLabelEdit(this.tab.childPage[1],{bound:[1000,20,200,20],caption:"status baru",readOnly:true, visible:false});	
		

		this.regid = new saiLabelEdit(this.tab.childPage[1],{bound:[500,20,200,20],caption:"Regid",readOnly:true,visible:false});	
		this.proyek = new saiLabelEdit(this.tab.childPage[1],{bound:[0,45,500,20],caption:"Pekerjaan"});
		this.kat_dok = new saiCB(this.tab.childPage[1],{bound:[520,45,200,20],caption:"Kategori",items:["CPE","Non CPE","Imprest Fund"]});	
		this.b11 = new label(this.tab.childPage[1], {bound:[590,45,5,20], caption:"<div style='color:red'><sup>*<sup></div>", bold: true, fontSize:15});	
		this.ket = new saiLabelEdit(this.tab.childPage[1],{bound:[0,70,500,20],caption:"Keterangan"});	

		this.jenisvendor = new saiCB(this.tab.childPage[1],{bound:[520,20,200,20],caption:"Jenis Vendor",items:["Dalam Negeri","Luar Negeri"],change:[this,"doChange"]});		
		this.b1 = new label(this.tab.childPage[1], {bound:[590,20,5,20], caption:"<div style='color:red'><sup>*<sup></div>", bold: true, fontSize:15});		

		this.kodeBA = new saiLabelEdit(this.tab.childPage[1],{bound:[740, 20, 200,20],caption:"Kode BA",readOnly:true});
		this.kdAkun = new saiCBBL(this.tab.childPage[1],{bound:[740,45,200,20],caption:"Kode Akun",readOnly:true,change:[this,"doChange"]});	
		
		this.cc = new saiCBBL(this.tab.childPage[1],{bound:[740,70,200,20],caption:"Cost Center",readOnly:true,change:[this,"doChange"]});	
		this.keg = new saiCBBL(this.tab.childPage[1],{bound:[740,95,200,20],caption:"Kode Aktivitas",readOnly:true,change:[this,"doChange"]});	
	
	
		this.alertpark = new label(this.tab.childPage[1], {bound:[420,this.height+450,300,20], caption:"*ISI NOTE DRAFT JIKA MELAKUKAN DRAFT DOKUMEN", bold: true, fontSize:8, visible:true});
		this.eFile = new saiLabelEdit(this.tab.childPage[1], {bound:[420,this.height+475,200,20], readOnly:true,labelWidth:120,caption:"<b>UPLOAD NOTES<b>"});
		this.eUploader = new saiUpload(this.tab.childPage[1], {bound:[420,this.height+500,200,20],icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.eUploader.setCaption("<i class='fa fa-upload' style='color:white'> UPLOAD NOTE DRAFT</i>");
		this.eUploader.on("change", function (file){
			self.eUploader.setAddParam({uploadto : "media/uploadparksmart/"});
			self.eFile.setText(file);	
			self.eUploader.submit();
		});
		this.eUploader.on("onload", function(data){
			// alert(JSON.stringify(data));
		});
		this.note1 = new saiMemo(this.tab.childPage[1], {bound:[420,this.height+525,300,80], caption:"<b>NOTE DRAFT<b>",visible:true});
		

		this.alertpetugas = new label(this.tab.childPage[1], {bound:[840,this.height+450,350,20], caption:"*ISI NOTE PETUGAS UNTUK MENAMBAHKAN CATATAN TAMBAHAN", bold: true, fontSize:8, visible:true});
		this.notepetugas = new saiMemo(this.tab.childPage[1], {bound:[840,this.height+475,350,100], caption:"<b>NOTE PETUGAS<b>",visible:true});
		

		this.checkbox1 = new checkBox(this.tab.childPage[1],{bound:[0,95,100,20], caption:"Kontrak"});
		this.checkbox2 = new checkBox(this.tab.childPage[1],{bound:[60,95,300,20], caption:"Nota Pesanan"});
		this.jnsTrans = new saiCB(this.tab.childPage[1],{bound:[300,95,200,20],caption:"Jenis Transaksi",items:["Mandatory","Umum"],change:[this,"doChange"]});		
		this.b5 = new label(this.tab.childPage[1], {bound:[380,95,5,20], caption:"<div style='color:red'><sup>*<sup></div>", bold: true, fontSize:15});		
		
		this.nopo = new saiLabelEdit(this.tab.childPage[1],{bound:[0,140,200,20],caption:"No PO/SP"});
		this.bRFC = new button(this.tab.childPage[1],{bound:[210,140,50,20], icon:"<i class='fa fa-search' style='color:white'></i>",caption:"RFC"});
		this.bRFC.setColor("mediumseagreen");

		this.bRFC.on("click", function(){
			try{
				
				self.app.services.callServices("financial_Fca","getDetailPO",[self.app._lokasi,self.nopo.getText()], function(data){	
					console.log(JSON.stringify(data));
					self.nilpo.setText(data.HEADER.LIFNR);
					
					// $.each(data.DETAIL, function(key, val){	
					// 	new messagingViewItem(self.messageContainer1, {bound:[0,0, self.messageContainer1.width - 10,50], message:[val[0].EBELN]});
					// });	
				});


			}catch(e){
				alert(e);
			}
		});

		this.tglpo = new saiLabelEdit(this.tab.childPage[1],{bound:[300,140,200,20],placeHolder:"DD/MM/YYYY",caption:"Tgl PO/SP"});	
		this.currpo = new saiCB(this.tab.childPage[1],{bound:[520,140,200,20],caption:"Curr", items:["IDR","SGD","JPY","GBP","USD","EURO","AUD"],readOnly:true,change:[this,"doChange"]});		
		this.b6 = new label(this.tab.childPage[1], {bound:[550,140,5,20], caption:"<div style='color:red'><sup>*<sup></div>", bold: true, fontSize:15});		
		this.nilpo = new saiLabelEdit(this.tab.childPage[1],{bound:[740,140,200,20],caption:"Nilai PO/SP",tipeText:ttNilai});
		

		this.nokon = new saiLabelEdit(this.tab.childPage[1],{bound:[0,170,200,20],caption:"No Kontrak"});	
		this.cek2 = new button(this.tab.childPage[1],{bound:[210,170,50,20], caption:"Cek ", click:[this,"doChange"]});
		this.cek2.setIcon("icon/system-search.png");
		this.tglkon = new saiLabelEdit(this.tab.childPage[1],{bound:[300,170,200,20],placeHolder:"DD/MM/YYYY",caption:"Tgl Kontrak"});	
		this.currkon = new saiLabelEdit(this.tab.childPage[1],{bound:[520,170,200,20],caption:"Curr", readOnly:true});		
		this.nilkon = new saiLabelEdit(this.tab.childPage[1],{bound:[740,170,200,20],caption:"Nilai Kontrak",tipeText:ttNilai});
		
		this.jenis_nilai = new saiCB(this.tab.childPage[1],{bound:[960,140,200,20],caption:"Dokumen Tagihan", items:["Kontrak","Amandemen","SP"],readOnly:true,change:[this,"doChange"]});		
		this.noaman = new saiLabelEdit(this.tab.childPage[1],{bound:[0,200,200,20],caption:"No Amandemen"});
		this.tglaman = new saiLabelEdit(this.tab.childPage[1],{bound:[300,200,200,20],placeHolder:"DD/MM/YYYY",caption:"Tgl Amandemen"});	
		this.curraman = new saiLabelEdit(this.tab.childPage[1],{bound:[520,200,200,20],caption:"Curr",readOnly:true});		
		this.nilaman = new saiLabelEdit(this.tab.childPage[1],{bound:[740,200,200,20],caption:"Nilai Amandemen",tipeText:ttNilai});
		
		this.currtagih = new saiLabelEdit(this.tab.childPage[1],{bound:[520,230,200,20],caption:"Curr", visible:false, readOnly:true,change:[this,"doChange"]});		
		this.ntagihcurr = new saiLabelEdit(this.tab.childPage[1],{bound:[300,230,200,20],caption:"Nilai Curr (IDR)",readOnly:true,tipeText:ttNilai});	
		this.ntagih = new saiLabelEdit(this.tab.childPage[1],{bound:[0,230,200,20],caption:"Nilai Tagihan",tipeText:ttNilai});
			
		this.ntagih2 = new saiLabelEdit(this.tab.childPage[1],{bound:[740,230,200,20],caption:"Nilai Tagihan Asli",visible:false,tipeText:ttNilai});		

		this.jenis_uang = new saiCB(this.tab.childPage[1],{bound:[0,260,260,20],caption:"Payment Method", items:["Pembayaran Penuh","Uang Muka","Termin"],change:[this,"doChange"]});		
		this.b4 = new label(this.tab.childPage[1], {bound:[85,260,5,20], caption:"<div style='color:red'><sup>*<sup></div>", bold: true, fontSize:15});		
		this.termin = new saiLabelEdit(this.tab.childPage[1],{bound:[0,290,200,20],caption:"Termin"});	
		this.b5 = new label(this.tab.childPage[1], {bound:[40,290,5,20], caption:"<div style='color:red'><sup>*<sup></div>", bold: true, fontSize:15});		
			
		
		this.persenUM = new saiLabelEdit(this.tab.childPage[1],{bound:[0,320,200,20],caption:"Persen UM (%)",visible:false});	
		this.nilaiUM = new saiLabelEdit(this.tab.childPage[1],{bound:[300,320,200,20],caption:"Nilai UM",readOnly:true,visible:false});
		this.addUM = new button(this.tab.childPage[1],{bound:[520,320,50,20], caption:"Add", click:[this,"doChange"],visible:false});
		this.addUM.setIcon("icon/plus.png");		
		this.detUM = new button(this.tab.childPage[1],{bound:[580,320,130,20], caption:"Detail Uang Muka", click:[this,"doChange"],visible:false});
		this.detUM.setIcon("icon/view-list-tree.png");
		this.totUM = new saiLabelEdit(this.tab.childPage[1],{bound:[0,350,200,20], caption:"Total UM", tipeText:ttNilai, readOnly:true,visible:false});
		this.totPerUM = new saiLabelEdit(this.tab.childPage[1],{bound:[300,350,200,20], caption:"Total persen UM", tipeText:ttNilai, readOnly:true,visible:false});
		this.persenSblm = new saiLabelEdit(this.tab.childPage[1],{bound:[520,350,200,20], caption:"persen sebelum", tipeText:ttNilai, readOnly:true,visible:false});
		
		this.addUM.on("click",function(sender){				
			var det1 = [nilaiToFloat(self.persenUM.getText()),nilaiToFloat(self.nilaiUM.getText())];
				if(self.persenUM.getText() == "" || self.nilaiUM.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totum = 0;
					var totperum = 0;
					self.sgAddUM.appendData(det1);
					self.persenUM.setText("");
					self.nilaiUM.setText("");
					for (var i = 0 ; i < self.sgAddUM.getRowCount();i++){
						totum += nilaiToFloat(self.sgAddUM.cells(1, i));
						totperum += nilaiToFloat(self.sgAddUM.cells(0, i));
					}
					// self.totUM.setText(floatToNilai(nilaiToFloat(totum)));
					self.totPerUM.setText(floatToNilai(nilaiToFloat(totperum)));

                    if(self.wapuPPH.getText() == "Wapu" ){
						if(self.jenis_uang.getText() == "Uang Muka"){
							self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
							if(self.persen.getText() != ""){
								// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
								// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
								var pembagi = 100 + nilaiToFloat(self.persen.getText());
								// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
								self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							}	
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Termin"){
							var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText()) ;
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}
								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								// );
							}
						}
					}



					if(self.wapuPPH.getText() == "Non Wapu"){
						if(self.jenis_uang.getText() == "Uang Muka"){
							self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
							if(self.persen.getText() != ""){
								// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
								// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
								var pembagi = 100 + nilaiToFloat(self.persen.getText());
								// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
								self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							}	
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Termin"){
							var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								// );
							}
						}
					}

					if(self.currbayar.getText() == "IDR"){	
						self.nbayarcurr.setText(0);		
					}
					if(self.currbayar.getText() == "USD"){	
						var usd2 = 14709;
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
					}
					if(self.currbayar.getText() == "GBP"){	
						var gbp2 = 19156;
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
					}
					if(self.currbayar.getText() == "JPY"){
						var jpy2 = 131;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
					}
					if(self.currbayar.getText() == "SGD"){
						var sgd2 = 10769;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
					}	
					if(self.currbayar.getText() == "EURO"){
						var euro2 = 17210;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
					}	
					if(self.currbayar.getText() == "AUD"){
						var aud2 = 10609;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
					}	
				}
		});

        this.detUM.on("click",function(sender){			
			self.pUM.show();
			self.pUM.setArrowMode(4);
			var node = sender.getCanvas();
			self.pUM.setTop(node.offset().top - 250 );
			self.pUM.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
			self.pUM.getCanvas().fadeIn("slow");
		});
		
		// this.kodeBA = new saiLabelEdit(this.tab.childPage[1],{bound:[740,290,200,20],caption:"Kode BA",readOnly:true});
		//ceklist dokumen		
		this.lTitle = new label(this.tab.childPage[1], {bound:[0,400,this.width-50,20], caption:"Checklist Verifikasi", bold: true, fontSize:10});
		this.lTitle.getCanvas().css({background:"lightsteelblue",position:"relative"});

		this.tabVerifikasi = new pageControl(this.tab.childPage[1],{bound:[0,420,this.width-50,this.height-30],
			childPage: ["Invoice","Pajak","Dokumen Pendukung"],
			borderColor:"#35aedb"});	
			
	
		this.up1 = new saiUpload(this.tabVerifikasi.childPage[0], {bound:[160, 10,20,15],caption:" "});
		this.up1.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done1 = new button(this.tabVerifikasi.childPage[0], {bound:[190, 10,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done1.setColor("#00b894");
		this.lTitle1 = new label(this.tabVerifikasi.childPage[0], {bound:[0,10,50,20], caption:"1)", bold: true, fontSize:10});
		this.ckStagih = new checkBox(this.tabVerifikasi.childPage[0],{bound:[15,10,100,20], caption:"Surat Tagihan"});
		this.noStagih = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[220,10,200,20],caption:"No Surat Tagihan"});		
		this.tglDokStagih = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,10,200,20],caption:"Tgl Surat Tagihan",placeHolder:"DD/MM/YYYY"});	
		this.tglMasukStagih = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,10,200,20],caption:"Tgl Masuk",placeHolder:"DD/MM/YYYY"});	
		this.eFile1 = new saiLabelEdit(this.tabVerifikasi.childPage[0], {bound:[900,10,200,20], visible:false, readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up1.on("change", function (file){
			self.up1.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile1.setText(file);	
			self.up1.submit();
			self.done1.setVisible(true);
		});

		
		// this.up1.on("change",  (file) => {
		// 	self.up1.setAddParam({service:"callServices",dataType:"xls", param: ["financial_Fca","uploadDetVer",[ [] , [] ] ], fields:[ [],[],[] ]});
		//  	self.up1.submit();
		//   	self.app._mainForm.pTrans.show();
		// });
		
		// self.eFile1.setText(file);	
		
		// self.up1.on("onload", (data) => {
		// self.alert("Done Upload", JSON.stringify(data.contents) );
		// // self.RefreshList();
		// });
		
		
		this.up2 = new saiUpload(this.tabVerifikasi.childPage[0], {bound:[160, 50,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:""});
		this.up2.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done2 = new button(this.tabVerifikasi.childPage[0], {bound:[190, 50,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done2.setColor("#00b894");
		this.lTitle2 = new label(this.tabVerifikasi.childPage[0], {bound:[0,50,50,20], caption:"2)", bold: true, fontSize:10});
		this.ckInv = new checkBox(this.tabVerifikasi.childPage[0],{bound:[15,50,100,20], caption:"Invoice"});
		this.noInv = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[220,50,200,20],caption:"No Invoice"});		
		this.tglDokInv = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,50,200,20],caption:"Tgl Invoice",placeHolder:"DD/MM/YYYY"});	
		this.tglMasukInv = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,50,200,20],caption:"Tgl Masuk",placeHolder:"DD/MM/YYYY"});		
		this.addInvoice = new button(this.tabVerifikasi.childPage[0],{bound:[220,80,50,20], caption:"Add", click:[this,"doChange"]});
		this.addInvoice.setIcon("icon/plus.png");
		this.detInvoice = new button(this.tabVerifikasi.childPage[0],{bound:[280,80,130,20], caption:"Detail Invoice", click:[this,"doChange"]});
		this.detInvoice.setIcon("icon/view-list-tree.png");
		this.eFile2 = new saiLabelEdit(this.tabVerifikasi.childPage[0], {bound:[440,80,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up2.on("change", function (file){
			self.up2.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile2.setText(file);	
			self.up2.submit();
			self.done2.setVisible(true);
		});
		this.addInvoice.on("click",function(sender){				
			var det1 = [self.noInv.getText(),self.tglDokInv.getText(),self.tglMasukInv.getText()];
				if(self.ckInv.selected == false || self.noInv.getText() == "" || self.tglDokInv.getText() == "" || self.tglMasukInv.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					self.sgAddInvoice.appendData(det1);
					self.noInv.setText("");
					self.tglDokInv.setText("");
					self.tglMasukInv.setText("");
				}
		});
		this.detInvoice.on("click",function(sender){			
			self.pInvoice.show();
			self.pInvoice.setArrowMode(4);
			var node = sender.getCanvas();
			self.pInvoice.setTop(node.offset().top - 250 );
			self.pInvoice.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pInvoice.getCanvas().fadeIn("slow");
		});

		
		////ga kepake, belom diapus
		this.det1 = new button(this.tabVerifikasi.childPage[0],{bound:[880,50,80,20], caption:"Detail",visible:false, click:[this,"doChange"]});
		this.det1.setIcon("icon/view-list-tree.png");
		this.det1.on("click",function(sender){			
			self.pDet1.show();
			self.pDet1.setArrowMode(4);
			var node = sender.getCanvas();
			self.pDet1.setTop(node.offset().top - 250 );
			self.pDet1.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
			self.pDet1.getCanvas().fadeIn("slow");
		});

		
		this.up3 = new saiUpload(this.tabVerifikasi.childPage[0], {bound:[160, 120,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up3.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done3 = new button(this.tabVerifikasi.childPage[0], {bound:[190, 120,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done3.setColor("#00b894");
		this.lTitle3 = new label(this.tabVerifikasi.childPage[0], {bound:[0,120,50,20], caption:"3)", bold: true, fontSize:10});
		this.ckKP = new checkBox(this.tabVerifikasi.childPage[0],{bound:[15,120,130,20], caption:"Kwitansi + PPN",visible:true});		
		this.persen = new saiCB(this.tabVerifikasi.childPage[0],{bound:[220,120,150,20],caption:"Persen (%)",items:["1","10"],visible:true,change:[this,"doChange"]});
		this.amKP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,120,200,20],caption:"Amount Kwt",readOnly:false,tipeText:ttNilai,visible:true});	
		this.dppKP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,120,200,20],caption:"DPP",readOnly:false,tipeText:ttNilai,visible:true});	
		this.noKP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[880,120,200,20],caption:"No Kwitansi",visible:true,change:[this,"doChange"]});	
		this.tglKP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[1100,120,200,20],caption:"Tgl Kwitansi",placeHolder:"DD/MM/YYYY",visible:true,change:[this,"doChange"]});		
		this.jenis_dpp2 = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[1100,120,200,20],caption:"nilai DPP",visible:false});		
		this.jenis_dpp = new checkBox(this.tabVerifikasi.childPage[0],{bound:[220,150,200,20],caption:"Pisah Nilai DPP",visible:true,change:[this,"doChange"]});		
		this.dppmaterial = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,150,200,20],caption:"Nilai Material",visible:false,tipeText:ttNilai});		
		this.dppjasa = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,150,200,20],caption:"Nilai Jasa",visible:false,tipeText:ttNilai});		
		this.addDPP = new button(this.tabVerifikasi.childPage[0],{bound:[220,180,50,20], caption:"Add", click:[this,"doChange"]});
		this.addDPP.setIcon("icon/plus.png");
		this.detDPP = new button(this.tabVerifikasi.childPage[0],{bound:[280,180,130,20], caption:"Detail Kwt + PPN", click:[this,"doChange"]});
		this.detDPP.setIcon("icon/view-list-tree.png")
		this.totKP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,180,200,20], caption:"Total Kwitansi", tipeText:ttNilai, readOnly:true});
		this.totDPP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,180,200,20], caption:"Total DPP", tipeText:ttNilai, readOnly:true});
		this.eFile3 = new saiLabelEdit(this.tabVerifikasi.childPage[0], {bound:[880,180,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up3.on("change", function (file){
			self.up3.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile3.setText(file);	
			self.up3.submit();
			self.done3.setVisible(true);
		});

		this.addDPP.on("click",function(sender){	
			var detDPP = [
				nilaiToFloat(self.persen.getText()),
				nilaiToFloat(self.amKP.getText()),
				nilaiToFloat(self.dppKP.getText()),
				self.noKP.getText(),
				self.tglKP.getText()
			];
				if(self.ckKP.selected == false || self.amKP.getText() == "" || self.dppKP.getText() == "" || self.noKP.getText() == "" || self.tglKP.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totkp = 0;
					var totdpp = 0;
					self.sgAddDPP.appendData(detDPP);
					// self.persen.setText("");
					self.amKP.setText("");
					
                    self.noKP.setText("");
					self.tglKP.setText("");
                    
					for (var i = 0 ; i < self.sgAddDPP.getRowCount();i++){
						totkp += nilaiToFloat(self.sgAddDPP.cells(1, i));
					}
					self.totKP.setText(floatToNilai(nilaiToFloat(totkp)));

                    for (var i = 0 ; i < self.sgAddDPP.getRowCount();i++){
						totdpp += nilaiToFloat(self.sgAddDPP.cells(2, i));
					}
					self.totDPP.setText(floatToNilai(nilaiToFloat(totdpp)));
					self.nbayar.setText(floatToNilai(nilaiToFloat(totdpp)));
					self.ckKP.setSelected(true);
					

					if(self.wapuPPH.getText() == "Wapu" ){
						if(self.jenis_uang.getText() == "Uang Muka"){
							self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
							if(self.persen.getText() != ""){
								// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
								// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
								var pembagi = 100 + nilaiToFloat(self.persen.getText());
								// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
								self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							}	
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}


								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Termin"){
							var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText()) ;
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								// );
							}
						}
					}



					if(self.wapuPPH.getText() == "Non Wapu"){
						if(self.jenis_uang.getText() == "Uang Muka"){
							self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
							if(self.persen.getText() != ""){
								// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
								// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
								var pembagi = 100 + nilaiToFloat(self.persen.getText());
								// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
								self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							}	
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}
								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									if(self.totPPH.getText() == ""){
										self.nbayar.setText(
											floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
										);
									}else{
										self.nbayar.setText(
											floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
										);
									}

									// self.nbayar.setText(
									// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									// );
								}else{
									if(self.totPPH.getText() == ""){
										self.nbayar.setText(
											floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
										);
									}else{
										self.nbayar.setText(
											floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
										);
									}
									
									// self.nbayar.setText(
									// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									// );
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								// );
							}
						}else if (self.jenis_uang.getText() == "Termin"){
							var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								// );
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}

								// self.nbayar.setText(
								// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								// );
							}
						}
					}

					if(self.currbayar.getText() == "IDR"){	
						self.nbayarcurr.setText(0);		
					}
					if(self.currbayar.getText() == "USD"){	
						var usd2 = 14709;
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
					}
					if(self.currbayar.getText() == "GBP"){	
						var gbp2 = 19156;
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
					}
					if(self.currbayar.getText() == "JPY"){
						var jpy2 = 131;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
					}
					if(self.currbayar.getText() == "SGD"){
						var sgd2 = 10769;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
					}	
					if(self.currbayar.getText() == "EURO"){
						var euro2 = 17210;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
					}	
					if(self.currbayar.getText() == "AUD"){
						var aud2 = 10609;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
					}	
				}
		});
		this.detDPP.on("click",function(sender){			
			self.pDPP.show();
			self.pDPP.setArrowMode(4);
			var node = sender.getCanvas();
			self.pDPP.setTop(node.offset().top - 250 );
			self.pDPP.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pDPP.getCanvas().fadeIn("slow");
		});


		this.up4 = new saiUpload(this.tabVerifikasi.childPage[0], {bound:[160, 220,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up4.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done4 = new button(this.tabVerifikasi.childPage[0], {bound:[190, 220,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done4.setColor("#00b894");
		this.lTitle4 = new label(this.tabVerifikasi.childPage[0], {bound:[0,220,50,20], caption:"4)", bold: true, fontSize:10});
		this.FPalert = new label(this.tabVerifikasi.childPage[0], {bound:[0,220,500,20], caption:"<i>Vendor Berasal Dari Luar Negeri. Field Faktur Pajak Tidak Perlu Diisi<i>", bold: true, visible:false, fontSize:9});
		this.ckFP = new checkBox(this.tabVerifikasi.childPage[0],{bound:[15,220,100,20], caption:"Faktur Pajak",visible:true});
		this.amFP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[220,220,200,20],caption:"Amount",readOnly:false,tipeText:ttNilai,visible:true});	
		this.noFP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,220,200,20],caption:"No Faktur Pajak",visible:true});	
		this.tglFP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,220,200,20],caption:"Tgl Faktur Pajak",placeHolder:"DD/MM/YYYY",visible:true});
		this.wapuPPH = new saiCB(this.tabVerifikasi.childPage[0],{bound:[880,220,200,20],caption:"Kategori", items:["Wapu","Non Wapu"],change:[this,"doChange"],visible:true});		
		this.addFP = new button(this.tabVerifikasi.childPage[0],{bound:[220,250,50,20], caption:"Add", click:[this,"doChange"]});
		this.addFP.setIcon("icon/plus.png");
		this.detFP = new button(this.tabVerifikasi.childPage[0],{bound:[280,250,130,20], caption:"Detail Faktur Pajak", click:[this,"doChange"]});
		this.detFP.setIcon("icon/view-list-tree.png")
		this.totFP = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,250,200,20], caption:"Total Faktur Pajak", tipeText:ttNilai, readOnly:true});
		this.eFile4 = new saiLabelEdit(this.tabVerifikasi.childPage[0], {bound:[660,250,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up4.on("change", function (file){
			self.up4.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile4.setText(file);	
			self.up4.submit();
			self.done4.setVisible(true);
		});
		this.addFP.on("click",function(sender){				
			var det1 = [nilaiToFloat(self.amFP.getText()),self.noFP.getText(),self.tglFP.getText(),self.wapuPPH.getText()];
				if(self.ckFP.selected == false || self.amFP.getText() == "" || self.noFP.getText() == "" || self.tglFP.getText() == "" || self.wapuPPH.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totfp = 0;
					self.sgAddFP.appendData(det1);
					self.amFP.setText("");
					self.noFP.setText("");
					self.tglFP.setText("");
					for (var i = 0 ; i < self.sgAddFP.getRowCount();i++){
						totfp += nilaiToFloat(self.sgAddFP.cells(0, i));
					}
					self.totFP.setText(floatToNilai(nilaiToFloat(totfp)));
				}
		});
		this.detFP.on("click",function(sender){			
			self.pFP.show();
			self.pFP.setArrowMode(4);
			var node = sender.getCanvas();
			self.pFP.setTop(node.offset().top - 250 );
			self.pFP.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pFP.getCanvas().fadeIn("slow");
		});


		this.up5 = new saiUpload(this.tabVerifikasi.childPage[1], {bound:[160, 10,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up5.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done5 = new button(this.tabVerifikasi.childPage[1], {bound:[190, 10,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done5.setColor("#00b894");
		this.lTitle5 = new label(this.tabVerifikasi.childPage[1], {bound:[0,10,50,20], caption:"5)", bold: true, fontSize:10});
		this.ckPPH = new checkBox(this.tabVerifikasi.childPage[1],{bound:[15,10,120,20], caption:"PPh With <br> Holding Tax",visible:true});
		this.jenisPPH = new saiCB(this.tabVerifikasi.childPage[1],{bound:[220,10,200,20],caption:"Jenis", items:["PPh 21","PPh 22","PPh 23","PPh 24","Pasal 4 Ayat 2","PPh 26"],change:[this,"doChange"],visible:true});		
		this.persenPPH = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[440,10,200,20],caption:"Persen (%)",tipeText:ttNilai,visible:true});
		this.amPPH = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[660,10,200,20],caption:"Amount PPh",tipeText:ttNilai,visible:true});
		this.addPPH = new button(this.tabVerifikasi.childPage[1],{bound:[220,40,50,20], caption:"Add", click:[this,"doChange"]});
		this.addPPH.setIcon("icon/plus.png");
		this.detPPH = new button(this.tabVerifikasi.childPage[1],{bound:[280,40,140,20], caption:"Detail PPH", click:[this,"doChange"]});
		this.detPPH.setIcon("icon/view-list-tree.png")
		this.totPPH = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[440,40,200,20], caption:"Total PPh", tipeText:ttNilai});
		this.eFile5 = new saiLabelEdit(this.tabVerifikasi.childPage[1], {bound:[660,40,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up5.on("change", function (file){
			self.up5.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile5.setText(file);	
			self.up5.submit();
			self.done5.setVisible(true);
		});
		this.addPPH.on("click",function(sender){				
			var det1 = [self.jenisPPH.getText(),nilaiToFloat(self.persenPPH.getText()),nilaiToFloat(self.amPPH.getText())];
				if(self.ckPPH.selected == false || self.jenisPPH.getText() == "" || self.persenPPH.getText() == "" || self.amPPH.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totpph = 0;
					self.sgAddPPH.appendData(det1);
					self.jenisPPH.setText("");
					self.persenPPH.setText("");
					self.amPPH.setText("");
					for (var i = 0 ; i < self.sgAddPPH.getRowCount();i++){
						totpph += self.sgAddPPH.cells(2, i);
					}
					self.totPPH.setText(floatToNilai(totpph));

					if(self.wapuPPH.getText() == "Wapu" ){
						if(self.jenis_uang.getText() == "Uang Muka"){
							self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
							if(self.persen.getText() != ""){
								// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
								// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
								var pembagi = 100 + nilaiToFloat(self.persen.getText());
								// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
								self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							}	
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}
							}
						}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()))
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

							}
						}else if (self.jenis_uang.getText() == "Termin"){
							var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText()) ;
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
									);
								}

							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}

							}
						}
					}


					if(self.wapuPPH.getText() == "Non Wapu"){
						if(self.jenis_uang.getText() == "Uang Muka"){
							self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
							if(self.persen.getText() != ""){
								// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
								// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
								var pembagi = 100 + nilaiToFloat(self.persen.getText());
								// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
								self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							}	
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}
								
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}

							}
						}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
									);
								}
							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
									);
								}
							}
						}else if (self.jenis_uang.getText() == "Termin"){
							var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
							if(self.jmlHari.getText() == ""){
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
									);
								}

							}else{
								if(self.totPPH.getText() == ""){
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}else{
									self.nbayar.setText(
										floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
									);
								}

							}
						}
					}

					if(self.currbayar.getText() == "IDR"){	
						self.nbayarcurr.setText(0);		
					}
					if(self.currbayar.getText() == "USD"){	
						var usd2 = 14709;
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
					}
					if(self.currbayar.getText() == "GBP"){	
						var gbp2 = 19156;
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
					}
					if(self.currbayar.getText() == "JPY"){
						var jpy2 = 131;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
					}
					if(self.currbayar.getText() == "SGD"){
						var sgd2 = 10769;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
					}	
					if(self.currbayar.getText() == "EURO"){
						var euro2 = 17210;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
					}
					if(self.currbayar.getText() == "AUD"){
						var aud2 = 10609;	
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
					}		
				}
		});
		this.detPPH.on("click",function(sender){			
			self.pPPH.show();
			self.pPPH.setArrowMode(4);
			var node = sender.getCanvas();
			self.pPPH.setTop(node.offset().top - 250 );
			self.pPPH.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
			self.pPPH.getCanvas().fadeIn("slow");
		});

		
		this.up7 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 10,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up7.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done7 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 10,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done7.setColor("#00b894");
		this.lTitle7 = new label(this.tabVerifikasi.childPage[2], {bound:[0,10,50,20], caption:"6)", bold: true, fontSize:10});
		this.alert7 = new label(this.tabVerifikasi.childPage[2], {bound:[0,10,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckPo = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,10,100,20], caption:"PO Awal <br> Non PPN",visible:true});
		this.amountPo = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,10,200,20],caption:"Amount",tipeText:ttNilai,visible:true});		
		this.tahapPo = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,10,200,20],caption:"Tahap Rekon",visible:true});	
		this.nAman = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,10,200,20],caption:"Nilai Amandemen",tipeText:ttNilai, readOnly:true,visible:true});		
		this.eFile7 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[880,10,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up7.on("change", function (file){
			self.up7.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile7.setText(file);	
			self.up7.submit();
			self.done7.setVisible(true);
		});
		
		this.up8 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 50,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up8.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done8 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 50,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done8.setColor("#00b894");
		this.lTitle8 = new label(this.tabVerifikasi.childPage[2], {bound:[0,50,50,20], caption:"7)", bold: true, fontSize:10});
		this.alert8 = new label(this.tabVerifikasi.childPage[2], {bound:[0,50,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckBaut = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,50,110,20], caption:"Batas Akhir <br> Pekerjaan",visible:true});
		this.noBaut = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,50,200,20],caption:"No BAUT",visible:true});		
		this.tglBaut = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,50,200,20],caption:"Tgl BAUT",placeHolder:"DD/MM/YYYY",visible:true});	
		this.addBaut = new button(this.tabVerifikasi.childPage[2],{bound:[220,80,50,20], caption:"Add", click:[this,"doChange"]});
		this.addBaut.setIcon("icon/plus.png");
		this.detBaut = new button(this.tabVerifikasi.childPage[2],{bound:[280,80,140,20], caption:"Detail BAUT", click:[this,"doChange"]});
		this.detBaut.setIcon("icon/view-list-tree.png");
		this.eFile8 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[440,80,200,20],visible:false, readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up8.on("change", function (file){
			self.up8.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile8.setText(file);	
			self.up8.submit();
			self.done8.setVisible(true);
		});

		this.addBaut.on("click",function(sender){				
			var det1 = [self.noBaut.getText(),self.tglBaut.getText()];
				if(self.noBaut.selected == false || self.tglBaut.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totBaut = 0;
					self.sgAddBaut.appendData(det1);
					self.noBaut.setText("");
					self.tglBaut.setText("");
				}
		});
		this.detBaut.on("click",function(sender){			
			self.pBaut.show();
			self.pBaut.setArrowMode(4);
			var node = sender.getCanvas();
			self.pBaut.setTop(node.offset().top - 250 );
			self.pBaut.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pBaut.getCanvas().fadeIn("slow");
		});
		
		this.up9 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 130,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up9.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done9 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 130,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done9.setColor("#00b894");
		this.lTitle9 = new label(this.tabVerifikasi.childPage[2], {bound:[0,130,50,20], caption:"8)", bold: true, fontSize:10});
		this.alert9 = new label(this.tabVerifikasi.childPage[2], {bound:[0,130,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckBast = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,130,110,20], caption:"BAST/BAPP <br> Non PPN",visible:true});
		this.amBast = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,130,200,20],caption:"Amount",tipeText:ttNilai,readOnly:false,visible:true});
		this.tglBast = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,130,200,20],caption:"Tgl BAST/BAPP",placeHolder:"DD/MM/YYYY",visible:true});		
		this.noMIGOBast = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,130,200,20],caption:"No MIGO",visible:true});	
		this.tanggal = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[880,130,200,20],caption:"Tgl MIGO",placeHolder:"DD/MM/YYYY",visible:true});		
		// this.nBrgBast = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[1100,130,200,20],caption:"Nilai Barang",tipeText:ttNilai,visible:false});		
		// this.nJasaBast = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[1320,130,200,20],caption:"Nilai Jasa",tipeText:ttNilai,visible:false});		
		this.addBast = new button(this.tabVerifikasi.childPage[2],{bound:[220,160,50,20], caption:"Add", click:[this,"doChange"]});
		this.addBast.setIcon("icon/plus.png");
		this.detBast = new button(this.tabVerifikasi.childPage[2],{bound:[280,160,140,20], caption:"Detail", click:[this,"doChange"]});
		this.detBast.setIcon("icon/view-list-tree.png");
		this.totBast = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,160,200,20],caption:"Total",tipeText:ttNilai,readOnly:false,visible:true});
		this.eFile9 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,160,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up9.on("change", function (file){
			self.up9.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile9.setText(file);	
			self.up9.submit();
			self.done9.setVisible(true);
		});

		this.addBast.on("click",function(sender){				
			var det1 = [nilaiToFloat(self.amBast.getText()),self.tglBast.getText(),self.noMIGOBast.getText(),self.tanggal.getText()];
				if(self.ckBast.selected == false || self.amBast.getText() == "" || self.tglBast.getText() == "" || self.noMIGOBast.getText() == "" || self.tanggal.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totBast = 0;
					self.sgAddBast.appendData(det1);
					self.amBast.setText("");
					self.tglBast.setText("");
					self.noMIGOBast.setText("");
					self.tanggal.setText("");
					for (var i = 0 ; i < self.sgAddBast.getRowCount();i++){
						totBast += nilaiToFloat(self.sgAddBast.cells(0, i));
					}
					self.totBast.setText(floatToNilai(nilaiToFloat(totBast)));
				}
		});
		this.detBast.on("click",function(sender){			
			self.pBast.show();
			self.pBast.setArrowMode(4);
			var node = sender.getCanvas();
			self.pBast.setTop(node.offset().top - 250 );
			self.pBast.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pBast.getCanvas().fadeIn("slow");
		});		

		this.up10 = new saiUpload(this.tabVerifikasi.childPage[0], {bound:[160, 290,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up10.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done10 = new button(this.tabVerifikasi.childPage[0], {bound:[190, 290,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done10.setColor("#00b894");
		this.lTitle10 = new label(this.tabVerifikasi.childPage[0], {bound:[0,290,50,20], caption:"9)", bold: true, fontSize:10});
		this.ckNrRek = new checkBox(this.tabVerifikasi.childPage[0],{bound:[15,290,100,20], caption:"Rekening",visible:true});
		this.noRek = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[220,290,200,20],caption:"No Rekening",visible:true});		
		this.bankRek = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[440,290,200,20],caption:"Bank",visible:true});	
		this.aNamaRek = new saiLabelEdit(this.tabVerifikasi.childPage[0],{bound:[660,290,420,20],caption:"Atas Nama",visible:true});
		this.eFile10 = new saiLabelEdit(this.tabVerifikasi.childPage[0], {bound:[880,290,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up10.on("change", function (file){
			self.up10.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile10.setText(file);	
			self.up10.submit();
			self.done10.setVisible(true);
		});

		this.up11 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 210,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up11.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done11 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 210,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done11.setColor("#00b894");
		this.lTitle11 = new label(this.tabVerifikasi.childPage[2], {bound:[0,210,50,20], caption:"10)", bold: true, fontSize:10});
		this.jumalert = new label(this.tabVerifikasi.childPage[2], {bound:[0,210,500,20], caption:"<i>Silahkan Pilih Payment Method : 'Uang Muka' Untuk Menampilkan Field Ini<i>", bold: true, visible:false, fontSize:9});
		this.ckJUM = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,210,110,20], caption:"Jaminan <br> Uang Muka",visible:true});
		this.nomJUM = new saiCB(this.tabVerifikasi.childPage[2],{bound:[220,210,200,20],caption:"Terms (%)", items:["15","30","45","60","75","90"],change:[this,"doChange"],visible:true});		
		this.amJUM = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,210,200,20],caption:"Amount",tipeText:ttNilai,visible:true});		
		this.asJUM= new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,210,200,20],caption:"Asuransi",visible:true});	
		this.tglJUM = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[880,210,200,20],caption:"Tgl Expire",placeHolder:"DD/MM/YYYY",visible:true});
		this.noAsJUM = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[1100,210,200,20],caption:"No Asuransi",visible:true});		
		this.addJUM = new button(this.tabVerifikasi.childPage[2],{bound:[220,240,50,20], caption:"Add", click:[this,"doChange"]});
		this.addJUM.setIcon("icon/plus.png");
		this.detJUM = new button(this.tabVerifikasi.childPage[2],{bound:[280,240,140,20], caption:"Detail JUM", click:[this,"doChange"]});
		this.detJUM.setIcon("icon/view-list-tree.png");	
		this.totJUM = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,240,200,20],caption:"Total JUM",tipeText:ttNilai,readOnly:false,visible:true});
		this.eFile11 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,240,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up11.on("change", function (file){
			self.up11.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile11.setText(file);	
			self.up11.submit();
			self.done11.setVisible(true);
		});
		
		this.addJUM.on("click",function(sender){				
			var det1 = [self.nomJUM.getText(),nilaiToFloat(self.amJUM.getText()),self.asJUM.getText(),self.tglJUM.getText(),self.noAsJUM.getText()];
				if(self.ckJUM.selected == false || self.nomJUM.getText() == "" || self.amJUM.getText() == "" || self.tglJUM.getText() == "" || self.asJUM.getText() == "" || self.noAsJUM.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totJUM = 0;
					self.sgAddJUM.appendData(det1);
					self.nomJUM.setText("");
					self.amJUM.setText("");
					self.asJUM.setText("");
					self.tglJUM.setText("");
					self.noAsJUM.setText("");
					for (var i = 0 ; i < self.sgAddJUM.getRowCount();i++){
						totJUM += nilaiToFloat(self.sgAddJUM.cells(1, i));
					}
					self.totJUM.setText(floatToNilai(nilaiToFloat(totJUM)));
				}
		});
		this.detJUM.on("click",function(sender){			
			self.pJUM.show();
			self.pJUM.setArrowMode(4);
			var node = sender.getCanvas();
			self.pJUM.setTop(node.offset().top - 250 );
			self.pJUM.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pJUM.getCanvas().fadeIn("slow");
		});
	

		this.up12 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 290,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up12.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done12 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 290,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done12.setColor("#00b894");
		this.lTitle12 = new label(this.tabVerifikasi.childPage[2], {bound:[0,290,50,20], caption:"11)", bold: true, fontSize:10});
		this.ckJapel = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,290,130,20], caption:"Jaminan Pelaksanaan",visible:true});
		this.amJapel = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,290,200,20],caption:"Amount",tipeText:ttNilai,readOnly:false,visible:true});		
		this.asJapel= new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,290,200,20],caption:"Asuransi",visible:true});	
		this.tglJapel = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,290,200,20],caption:"Tgl Expire",placeHolder:"DD/MM/YYYY",visible:true});
		this.noAsJapel = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[880,290,200,20],caption:"No Asuransi",visible:true});		
		this.addJapel = new button(this.tabVerifikasi.childPage[2],{bound:[220,320,50,20], caption:"Add", click:[this,"doChange"]});
		this.addJapel.setIcon("icon/plus.png");
		this.detJapel = new button(this.tabVerifikasi.childPage[2],{bound:[280,320,140,20], caption:"Detail JAPEL", click:[this,"doChange"]});
		this.detJapel.setIcon("icon/view-list-tree.png");	
		this.totJapel = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,320,200,20],caption:"Total JAPEL",tipeText:ttNilai,readOnly:false,visible:true});
		this.eFile12 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,320,200,20],visible:false, readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up12.on("change", function (file){
			self.up12.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile12.setText(file);	
			self.up12.submit();
			self.done12.setVisible(true);
		});

		this.addJapel.on("click",function(sender){				
			var det1 = [nilaiToFloat(self.amJapel.getText()),self.asJapel.getText(),self.tglJapel.getText(),self.noAsJapel.getText()];
				if(self.ckJapel.selected == false || self.amJapel.getText() == "" || self.asJapel.getText() == "" || self.tglJapel.getText() == "" || self.noAsJapel.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totJapel = 0;
					self.sgAddJapel.appendData(det1);
					self.amJapel.setText("");
					self.asJapel.setText("");
					self.tglJapel.setText("");
					self.noAsJapel.setText("");
					for (var i = 0 ; i < self.sgAddJapel.getRowCount();i++){
						totJapel += nilaiToFloat(self.sgAddJapel.cells(0, i));
					}
					self.totJapel.setText(floatToNilai(nilaiToFloat(totJapel)));
				}
		});
		this.detJapel.on("click",function(sender){			
			self.pJapel.show();
			self.pJapel.setArrowMode(4);
			var node = sender.getCanvas();
			self.pJapel.setTop(node.offset().top - 250 );
			self.pJapel.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pJapel.getCanvas().fadeIn("slow");
		});
	
		
		this.up13 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 370,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up13.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done13 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 370,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done13.setColor("#00b894");
		this.lTitle13 = new label(this.tabVerifikasi.childPage[2], {bound:[0,370,50,20], caption:"12)", bold: true, fontSize:10});
		this.alert13 = new label(this.tabVerifikasi.childPage[2], {bound:[0,370,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckJapem = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,370,130,20], caption:"Jaminan Pemeliharaan",visible:true});
		this.amJapem = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,370,200,20],caption:"Amount",tipeText:ttNilai,readOnly:false,visible:true});		
		this.asJapem = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,370,200,20],caption:"Asuransi",visible:true});	
		this.tglJapem = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,370,200,20],caption:"Tgl Expire",placeHolder:"DD/MM/YYYY",visible:true});
		this.noAsJapem = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[880,370,200,20],caption:"No Asuransi",visible:true});		
		this.addJapem = new button(this.tabVerifikasi.childPage[2],{bound:[220,400,50,20], caption:"Add", click:[this,"doChange"]});
		this.addJapem.setIcon("icon/plus.png");
		this.detJapem = new button(this.tabVerifikasi.childPage[2],{bound:[280,400,140,20], caption:"Detail JAPEM", click:[this,"doChange"]});
		this.detJapem.setIcon("icon/view-list-tree.png");
		this.totJapem = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,400,200,20],caption:"Total JAPEM",tipeText:ttNilai,readOnly:false,visible:true});
		this.eFile13 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,400,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up13.on("change", function (file){
			self.up13.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile13.setText(file);	
			self.up13.submit();
			self.done13.setVisible(true);
		});

		this.addJapem.on("click",function(sender){				
			var det1 = [nilaiToFloat(self.amJapem.getText()),self.asJapem.getText(),self.tglJapem.getText(),self.noAsJapem.getText()];
				if(self.ckJapem.selected == false || self.amJapem.getText() == "" || self.asJapem.getText() == "" || self.tglJapem.getText() == "" || self.noAsJapem.getText() == ""){
					system.alert(this, "Harap Lengkapi Inputan Anda");
				}else{
					var totJapem = 0;
					self.sgAddJapem.appendData(det1);
					self.amJapem.setText("");
					self.asJapem.setText("");
					self.tglJapem.setText("");
					self.noAsJapem.setText("");
					for (var i = 0 ; i < self.sgAddJapem.getRowCount();i++){
						totJapem += nilaiToFloat(self.sgAddJapem.cells(0, i));
					}
					self.totJapem.setText(floatToNilai(nilaiToFloat(totJapem)));
				}
		});
		this.detJapem.on("click",function(sender){			
			self.pJapem.show();
			self.pJapem.setArrowMode(4);
			var node = sender.getCanvas();
			self.pJapem.setTop(node.offset().top - 250 );
			self.pJapem.setLeft(node.offset().left + (node.width() / 2 ) - 350);	
			self.pJapem.getCanvas().fadeIn("slow");
		});


		this.up14 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 450,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up14.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done14 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 450,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done14.setColor("#00b894");
		this.lTitle14 = new label(this.tabVerifikasi.childPage[2], {bound:[0,450,50,20], caption:"13)", bold: true, fontSize:10});
		this.alert14 = new label(this.tabVerifikasi.childPage[2], {bound:[0,450,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckPa = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,450,110,20], caption:"Polis Asuransi",visible:true});
		this.amPa = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,450,200,20],caption:"No Polis",visible:true});		
		this.asPa = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,450,200,20],caption:"Asuransi",visible:true});	
		this.tglPa = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,450,200,20],caption:"Tgl Expire",placeHolder:"DD/MM/YYYY",visible:true});
		this.eFile14 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[880,450,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up14.on("change", function (file){
			self.up14.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile14.setText(file);	
			self.up14.submit();
			self.done14.setVisible(true);
		});
		
		this.up15 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 490,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up15.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done15 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 490,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done15.setColor("#00b894");
		this.lTitle15 = new label(this.tabVerifikasi.childPage[2], {bound:[0,490,50,20], caption:"14)", bold: true, fontSize:10});
		this.alert15 = new label(this.tabVerifikasi.childPage[2], {bound:[0,490,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.TTalert = new label(this.tabVerifikasi.childPage[2], {bound:[0,490,500,20], caption:"<i>Vendor Berasal Dari Luar Negeri. Field Build Draw Tidak Perlu Diisi<i>", bold: true, visible:false, fontSize:9});
		this.ckTT = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,490,110,20], caption:"Td Terima <br> As Build Draw",visible:true});
		this.noTT = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,490,200,20],caption:"No Tanda Terima",visible:true});		
		this.tglTT= new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,490,200,20],caption:"Tgl Tanda Terima",placeHolder:"DD/MM/YYYY",visible:true});	
		this.eFile15 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,490,200,20],visible:false, readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up15.on("change", function (file){
			self.up15.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile15.setText(file);	
			self.up15.submit();
			self.done15.setVisible(true);
		});

		this.up16 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 530,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up16.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done16 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 530,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done16.setColor("#00b894");
		this.lTitle16 = new label(this.tabVerifikasi.childPage[2], {bound:[0,530,50,20], caption:"15)", bold: true, fontSize:10});
		this.alert16 = new label(this.tabVerifikasi.childPage[2], {bound:[0,530,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.SIUalert = new label(this.tabVerifikasi.childPage[2], {bound:[0,530,500,20], caption:"<i>Vendor Berasal Dari Luar Negeri. Field SIUJK Tidak Perlu Diisi<i>", bold: true, visible:false, fontSize:9});
		this.ckSIU = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,530,100,20], caption:"SIUJK",visible:true});
		this.noSIU = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,530,200,20],caption:"No SIUJK",visible:true});		
		this.tglmSIU= new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,530,200,20],caption:"Tgl Mulai",placeHolder:"DD/MM/YYYY",visible:true});	
		this.tglaSIU = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[660,530,200,20],caption:"Tgl Akhir",placeHolder:"DD/MM/YYYY",visible:true});
		this.eFile16 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[880,530,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up16.on("change", function (file){
			self.up16.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile16.setText(file);	
			self.up16.submit();
			self.done16.setVisible(true);
		});

		this.up17 = new saiUpload(this.tabVerifikasi.childPage[1], {bound:[160, 90,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up17.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done17 = new button(this.tabVerifikasi.childPage[1], {bound:[190, 90,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done17.setColor("#00b894");
		this.lTitle17 = new label(this.tabVerifikasi.childPage[1], {bound:[0,90,50,20], caption:"16)", bold: true, fontSize:10});
		this.alert17 = new label(this.tabVerifikasi.childPage[1], {bound:[0,90,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.NPWPalert = new label(this.tabVerifikasi.childPage[1], {bound:[0,90,500,20], caption:"<i>Vendor Berasal Dari Luar Negeri. Field NPWP Tidak Perlu Diisi<i>", bold: true, visible:false, fontSize:9});
		this.ckNpwp = new checkBox(this.tabVerifikasi.childPage[1],{bound:[15,90,100,20], caption:"NPWP",visible:true});
		this.noNpwp= new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[220,90,200,20],caption:"No NPWP",visible:true});		
		this.tglNpwp= new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[440,90,200,20],caption:"Tgl NPWP",placeHolder:"DD/MM/YYYY",visible:true});	
		this.eFile17 = new saiLabelEdit(this.tabVerifikasi.childPage[1], {bound:[660,90,200,20],visible:false, readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up17.on("change", function (file){
			self.up17.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile17.setText(file);	
			self.up17.submit();
			self.done17.setVisible(true);
		});

		this.up17a = new saiUpload(this.tabVerifikasi.childPage[1], {bound:[160, 130,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up17a.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done17a = new button(this.tabVerifikasi.childPage[1], {bound:[190, 130,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done17a.setColor("#00b894");
		this.lTitle17a = new label(this.tabVerifikasi.childPage[1], {bound:[0,130,50,20], caption:"17)", bold: true, fontSize:10});
		this.alert17a = new label(this.tabVerifikasi.childPage[1], {bound:[0,130,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.Formalert = new label(this.tabVerifikasi.childPage[1], {bound:[0,130,500,20], caption:"<i>Vendor Berasal Dari Dalam Negeri. Field DGT - 1 Tidak Perlu Diisi<i>", bold: true, visible:false, fontSize:9});
		this.ckForm = new checkBox(this.tabVerifikasi.childPage[1],{bound:[15,130,100,20], caption:"Form DGT - 1",visible:true});
		this.noForm = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[220,130,200,20],caption:"No DGT",visible:true});		
		this.tglForm = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[440,130,200,20],caption:"Tgl DGT",placeHolder:"DD/MM/YYYY",visible:true});	
		this.ngrForm = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[660,130,200,20],caption:"Negara Asal",visible:true});	
		this.eFile17a = new saiLabelEdit(this.tabVerifikasi.childPage[1], {bound:[880,130,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up17a.on("change", function (file){
			self.up17a.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile17a.setText(file);	
			self.up17a.submit();
			self.done17a.setVisible(true);
		});

		this.up18 = new saiUpload(this.tabVerifikasi.childPage[1], {bound:[160, 170,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up18.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done18 = new button(this.tabVerifikasi.childPage[1], {bound:[190, 170,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done18.setColor("#00b894");
		this.lTitle18 = new label(this.tabVerifikasi.childPage[1], {bound:[0,170,50,20], caption:"18)", bold: true, fontSize:10});
		this.alert18 = new label(this.tabVerifikasi.childPage[1], {bound:[0,170,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.Codalert = new label(this.tabVerifikasi.childPage[1], {bound:[0,170,500,20], caption:"<i>Vendor Berasal Dari Dalam Negeri. Field Cert Of Domisili Tidak Perlu Diisi<i>", bold: true, visible:false, fontSize:9});
		this.ckCod = new checkBox(this.tabVerifikasi.childPage[1],{bound:[15,170,100,20], caption:"Cert of Domisili",visible:true});
		this.noCod = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[220,170,200,20],caption:"No COD",visible:true});		
		this.tglCod = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[440,170,200,20],caption:"Tgl COD",placeHolder:"DD/MM/YYYY",visible:true});	
		this.ngrCod = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[660,170,200,20],caption:"Negara Asal",visible:true});		
		this.eFile18 = new saiLabelEdit(this.tabVerifikasi.childPage[1], {bound:[880,170,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up18.on("change", function (file){
			self.up18.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile18.setText(file);	
			self.up18.submit();
			self.done18.setVisible(true);
		});


		this.up19 = new saiUpload(this.tabVerifikasi.childPage[1], {bound:[160, 210,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up19.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done19 = new button(this.tabVerifikasi.childPage[1], {bound:[190, 210,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done19.setColor("#00b894");
		this.lTitle19 = new label(this.tabVerifikasi.childPage[1], {bound:[0,210,50,20], caption:"19)", bold: true, fontSize:10});
		this.alert19 = new label(this.tabVerifikasi.childPage[1], {bound:[0,210,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckCoo = new checkBox(this.tabVerifikasi.childPage[1],{bound:[15,210,100,20], caption:"Cert of Origin",visible:true});
		this.noCoo = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[220,210,200,20],caption:"No COO",visible:true});	
		this.isCoo = new saiLabelEdit(this.tabVerifikasi.childPage[1],{bound:[440,210,200,20],caption:"Issued By",visible:true});				
		this.eFile19 = new saiLabelEdit(this.tabVerifikasi.childPage[1], {bound:[660,210,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up19.on("change", function (file){
			self.up19.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile19.setText(file);	
			self.up19.submit();
			self.done19.setVisible(true);
		});

		this.up20 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 570,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up20.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done20 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 570,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done20.setColor("#00b894");
		this.lTitle20 = new label(this.tabVerifikasi.childPage[2], {bound:[0,570,50,20], caption:"20)", bold: true, fontSize:10});
		this.alert20 = new label(this.tabVerifikasi.childPage[2], {bound:[0,570,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckSL = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,570,100,20], caption:"Side Letter",visible:true});
		this.noSL = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,570,200,20],caption:"No Side Letter",visible:true});		
		this.tglSL = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,570,200,20],caption:"Tgl Side Letter",placeHolder:"DD/MM/YYYY",visible:true});	
		this.eFile20 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,570,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up20.on("change", function (file){
			self.up20.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile20.setText(file);	
			self.up20.submit();
			self.done20.setVisible(true);
		});

		this.up21 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 610,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up21.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done21 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 610,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done21.setColor("#00b894");
		this.lTitle21 = new label(this.tabVerifikasi.childPage[2], {bound:[0,610,50,20], caption:"21)", bold: true, fontSize:10});
		this.alert21 = new label(this.tabVerifikasi.childPage[2], {bound:[0,610,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckDenda = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,610,100,20], caption:"Denda (Hari)",visible:true});
		this.jmlHari = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[220,610,200,20],caption:"Jumlah Hari",tipeText:ttNilai,visible:true, change:[this,"doChange"]});		
		this.jmlDenda = new saiLabelEdit(this.tabVerifikasi.childPage[2],{bound:[440,610,200,20],caption:"Jumlah Denda",tipeText:ttNilai,visible:true, change:[this,"doChange"]});	
		this.eFile21 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[660,610,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up21.on("change", function (file){
			self.up21.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile21.setText(file);	
			self.up21.submit();
			self.done21.setVisible(true);
		});

		this.up22 = new saiUpload(this.tabVerifikasi.childPage[2], {bound:[160, 650,20,15], icon:"<i class='fa fa-upload' style='color:white'></i>",caption:" "});
		this.up22.setCaption("<i class='fa fa-upload' style='color:white'></i>");
		this.done22 = new button(this.tabVerifikasi.childPage[2], {bound:[190, 650,20,15], visible:false, icon:"<i class='fa fa-check' style='color:white'></i>",caption:" "});
		this.done22.setColor("#00b894");
		this.lTitle22 = new label(this.tabVerifikasi.childPage[2], {bound:[0,650,50,20], caption:"22)", bold: true, fontSize:10});
		this.alert22 = new label(this.tabVerifikasi.childPage[2], {bound:[0,650,500,20], caption:"<i>-<i>", bold: true, visible:false, fontSize:9});
		this.ckProposal = new checkBox(this.tabVerifikasi.childPage[2],{bound:[15,650,100,20], caption:"Proposal",visible:true});
		this.adaProposal = new saiCB(this.tabVerifikasi.childPage[2],{bound:[220,650,200,20],caption:"Keterangan", items:["Ada","Tidak"],change:[this,"doChange"],visible:true});		
		this.eFile22 = new saiLabelEdit(this.tabVerifikasi.childPage[2], {bound:[440,650,200,20], visible:false,readOnly:true,labelWidth:120,caption:"<b>UPLOAD<b>"});
		this.up22.on("change", function (file){
			self.up22.setAddParam({uploadto : "media/smartUplDetVer/"});
			self.eFile22.setText(file);	
			self.up22.submit();
			self.done22.setVisible(true);
		});

		this.lTitleEnd = new label(this.tab.childPage[1], {bound:[0,this.height+400,this.width-50,20], caption:"Jumlah Pembayaran", bold: true, fontSize:10});
		this.lTitleEnd.getCanvas().css({background:"lightsteelblue",position:"relative"});
		this.nbayar = new saiLabelEdit(this.tab.childPage[1],{bound:[0,this.height+450,200,20],caption:"Nilai Bayar",tipeText:ttNilai});		
		this.nbayarcurr = new saiLabelEdit(this.tab.childPage[1],{bound:[0,this.height+475,200,20],caption:"Nilai Curr (IDR)",readOnly:true,tipeText:ttNilai, readOnly:true});	
		this.currbayar = new saiLabelEdit(this.tab.childPage[1],{bound:[0,this.height+505,200,20],caption:"Curr", readOnly:true, visible:false, change:[this,"doChange"]});		
		
		this.lTitleEnd2 = new label(this.tab.childPage[1], {bound:[0,this.height+610,this.width-50,70], caption:" ", bold: true, fontSize:10});
		


		this.messageContainer1 = new listCustomView(this.tab.childPage[2], {bound:[0,0, this.width - 320, this.tab.height - 20 ]});
		

		this.setTabChildIndex();

		this.pRelated = new control_popupForm(this.app);
		this.pRelated.setBound(0, 0,this.width-50, 500);
		this.pRelated.setArrowMode(4);
		this.pRelated.hide();

		//isi cek no kontrak
		this.titleCek = new label(this.pRelated, {bound:[10,15,250,20], readOnly:true, caption:"Pengawasan Uang Muka", bold: true, fontSize:12});
		this.kd_vendor = new saiLabelEdit(this.pRelated,{bound:[10,45,250,20],caption:"No Vendor",readOnly:true,tipeText:ttNilai});	
		this.nm_vendor = new saiLabelEdit(this.pRelated,{bound:[10,70,250,20],caption:"Nama Vendor",readOnly:true,tipeText:ttNilai});	
		this.no_kon = new saiLabelEdit(this.pRelated,{bound:[800,45,250,20],caption:"No Kontrak",readOnly:true,tipeText:ttNilai});	
		this.titleCek1 = new saiLabelEdit(this.pRelated,{bound:[800,70,250,20],caption:"Nilai PO",readOnly:true,tipeText:ttNilai});	
		this.sgCek = new saiGrid(this.pRelated,{bound:[10,100,1300,250],
			colCount: 11,
			colTitle: ["No Tagihan","Nama Proyek","Paymnet Method","Termin","Persen Uang Muka","Nilai Tagihan","Potongan Uang Muka","PPH","Nilai Bayar","Saldo Utang","Saldo Uang Muka"],
			colWidth:[[10,9,8,7,6,5,4,3,2,1,0],[150,100,100,100,100,100,140,50,100,250,80]],
			columnReadOnly:[true, [0,1,2,3],[]],		
			colFormat:[[5,6,7,8,9,10],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],		
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			ellipsClick: [this,"doEllipsClick"]
		});

		this.titleCek2 = new saiLabelEdit(this.pRelated,{bound:[20,400,250,20],caption:"Total Tagihan",readOnly:true,tipeText:ttNilai,visible:false});	
		this.titleCek3 = new saiLabelEdit(this.pRelated,{bound:[20,425,250,20],caption:"Sisa Tagihan",readOnly:true,tipeText:ttNilai,visible:false});	
		this.titleCek4 = new saiLabelEdit(this.pRelated,{bound:[20,450,250,20],caption:"Status",readOnly:true,visible:false});	

		this.bCancel = new button(this.pRelated, {bound:[this.width-150, 15,80,20], caption:"Close"});
		this.bCancel.setIcon("icon/application-exit2.png");
		this.bCancel.on("click", function(){
			self.pRelated.hide();
			self.sgCek.clear(0);
			// self.nokon.setText("");
		});
		


		this.pDet1 = new control_popupForm(this.app);
		this.pDet1.setBound(0, 0,345,260);
		this.pDet1.setArrowMode(4);
		this.pDet1.hide();
		this.sgAdd1 = new saiGrid(this.pDet1,{bound:[1,0,340,200],
			colCount: 3,
			colTitle: ["No Kontrak","Tgl Dokumen","Termin"],
			colWidth:[[2,1,0],[100,100,100]],
			columnReadOnly:[true, [0,1,2],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"]
		});
		this.bCancel = new button(this.pDet1, {bound:[250,210,80,20], caption:"<i class='fa fa-times'/i> Close"});
		this.bCancel.on("click", function(){
			self.pDet1.hide();
			self.sgAdd1.clear(0);
			// self.nokon.setText("");
		});

		this.pFilter = new control_popupForm(this.app);
		this.pFilter.setBound(0, 0, 450, 250);
		this.pFilter.setArrowMode(4);
		this.pFilter.hide();
		var self = this;		
		this.isiNote1 = new label(this.pFilter,{bound:[20,20,200,20],caption:"...",fontSize:10});		
		this.isiNote2 = new label(this.pFilter,{bound:[20,45,200,20],caption:"...",fontSize:10});
		this.isiNote22 = new label(this.pFilter,{bound:[20,70,200,20],caption:"Note :",fontSize:10});
		this.isiNote3 = new saiMemo(this.pFilter,{bound:[20,95,410,100],caption:"Notes",readOnly:true,labelWidth:0});
		this.bCancel = new button(this.pFilter, {bound:[350, 200,80,20], caption:"Close"});
		this.bCancel.on("click", function(){
			self.pFilter.hide();
		});



		this.pReject = new control_popupForm(this.app);
		this.pReject.setBound(0, 0,500, 210);
		this.pReject.setArrowMode(4);
		this.pReject.hide();
		this.judul = new label(this.pReject, {bound:[10, 5, 350,20],caption:"<b>Yakin Akan Reject Dokumen?<b>", fontSize:14});
		this.judul2 = new label(this.pReject, {bound:[10,30,200,20], caption:"...", fontSize:10});
		this.note = new saiMemo(this.pReject, {bound:[10, 50, 470,100], caption:"Masukan Notes"});
		
		this.bOkReject = new button(this.pReject, {bound:[300, 160,80,20], caption:"OK"});
		this.bCancelReject = new button(this.pReject, {bound:[390, 160,80,20], caption:"Cancel"});
		this.bCancelReject.on("click", function(){
			self.pReject.hide();
		});


		this.pPPH = new control_popupForm(this.app);
		this.pPPH.setBound(0, 0,345,260);
		this.pPPH.setArrowMode(4);
		this.pPPH.hide();
		this.sgAddPPH = new saiGrid(this.pPPH,{bound:[1,0,340,200],
			colCount: 3,
			colTitle: ["Jenis PPh","Persen (%)","Amount"],
			colWidth:[[2,1,0],[100,100,100]],
			columnReadOnly:[true, [0,1,2],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[2],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bClosePPH = new button(this.pPPH, {bound:[250,210,80,20], caption:"Close"});
		this.bClosePPH.setIcon("icon/application-exit2.png");
		this.bClosePPH.on("click", function(){
			self.pPPH.hide();
			// self.sgAddPPH.clear(0);
			// self.nokon.setText("");
		});


		this.pInvoice = new control_popupForm(this.app);
		this.pInvoice.setBound(0, 0,480,260);
		this.pInvoice.setArrowMode(4);
		this.pInvoice.hide();
		this.sgAddInvoice = new saiGrid(this.pInvoice,{bound:[1,0,470,200],
			colCount: 3,
			colTitle: ["No Invoice","Tanggal Dokumen","Tanggal Masuk"],
			colWidth:[[2,1,0],[110,110,150]],
			columnReadOnly:[true, [0,1,2],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseInvoice = new button(this.pInvoice, {bound:[380,210,80,20], caption:"Close"});
		this.bCloseInvoice.setIcon("icon/application-exit2.png");
		this.bCloseInvoice.on("click", function(){
			self.pInvoice.hide();
		});

		this.pFP = new control_popupForm(this.app);
		this.pFP.setBound(0, 0,480,260);
		this.pFP.setArrowMode(4);
		this.pFP.hide();
		this.sgAddFP = new saiGrid(this.pFP,{bound:[1,0,470,200],
			colCount: 4,
			colTitle: ["Amount FP","No Faktur Pajak","Tanggal Faktur Pajak","Kategori"],
			colWidth:[[3,2,1,0],[110,110,110,110]],
			columnReadOnly:[true, [0,1,2],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[0],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseFP = new button(this.pFP, {bound:[380,210,80,20], caption:"Close"});
		this.bCloseFP.setIcon("icon/application-exit2.png");
		this.bCloseFP.on("click", function(){
			self.pFP.hide();
		});

		this.pDPP = new control_popupForm(this.app);
		this.pDPP.setBound(0, 0,580,260);
		this.pDPP.setArrowMode(4);
		this.pDPP.hide();
		this.sgAddDPP = new saiGrid(this.pDPP,{bound:[1,0,570,200],
			colCount: 5,
			colTitle: ["Persen (%)","Amount","DPP","No Kwitansi","Tgl Kwitansi"],
			colWidth:[[4,3,2,1,0],[100,110,110,110,110]],
			columnReadOnly:[true, [0,1,2],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[1,2],[cfNilai,cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseDPP = new button(this.pDPP, {bound:[470,210,80,20], caption:"Close"});
		this.bCloseDPP.setIcon("icon/application-exit2.png");
		this.bCloseDPP.on("click", function(){
			self.pDPP.hide();
		});




		this.pUM = new control_popupForm(this.app);
		this.pUM.setBound(0, 0,345,260);
		this.pUM.setArrowMode(4);
		this.pUM.hide();
		this.sgAddUM = new saiGrid(this.pUM,{bound:[1,0,340,200],
			colCount: 2,
			colTitle: ["Persen (%)","Amount"],
			colWidth:[[2,1,0],[100,100,100]],
			columnReadOnly:[true, [0,1,2],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[1],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseUM = new button(this.pUM, {bound:[250,210,80,20], caption:"Close"});
		this.bCloseUM.setIcon("icon/application-exit2.png");
		this.bCloseUM.on("click", function(){
			self.pUM.hide();
			// self.sgAddPPH.clear(0);
			// self.nokon.setText("");
		});


		this.pBaut = new control_popupForm(this.app);
		this.pBaut.setBound(0, 0,480,260);
		this.pBaut.setArrowMode(4);
		this.pBaut.hide();
		this.sgAddBaut = new saiGrid(this.pBaut,{bound:[1,0,470,200],
			colCount: 2,
			colTitle: ["No Baut","Tanggal BAUT"],
			colWidth:[[1,0],[110,110]],
			columnReadOnly:[true, [0,1],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseBaut = new button(this.pBaut, {bound:[380,210,80,20], caption:"Close"});
		this.bCloseBaut.setIcon("icon/application-exit2.png");
		this.bCloseBaut.on("click", function(){
			self.pBaut.hide();
		});

		this.pBast = new control_popupForm(this.app);
		this.pBast.setBound(0, 0,480,260);
		this.pBast.setArrowMode(4);
		this.pBast.hide();
		this.sgAddBast = new saiGrid(this.pBast,{bound:[1,0,470,200],
			colCount: 4,
			colTitle: ["Amount","Tgl Bast","No MIGO","Tgl MIGO"],
			colWidth:[[3,2,1,0],[110,110,110,110]],
			columnReadOnly:[true, [0,1,2,3],[]],
			rowPerPage:20, 
            colFormat:[[0],[cfNilai]],	
			autoPaging:true, 
			pager:[this,"doPager"],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseBast = new button(this.pBast, {bound:[380,210,80,20], caption:"Close"});
		this.bCloseBast.setIcon("icon/application-exit2.png");
		this.bCloseBast.on("click", function(){
			self.pBast.hide();
		});

		this.pJUM = new control_popupForm(this.app);
		this.pJUM.setBound(0, 0,590,260);
		this.pJUM.setArrowMode(4);
		this.pJUM.hide();
		this.sgAddJUM = new saiGrid(this.pJUM,{bound:[1,0,580,200],
			colCount: 5,
			colTitle: ["Persen (%)","Amount JUM","Asuransi","Tgl Expire","No Asuransi"],
			colWidth:[[4,3,2,1,0],[110,110,110,110,110]],
			columnReadOnly:[true, [0,1,2,3,4],[]],
			rowPerPage:20, 
            colFormat:[[1],[cfNilai]],	
			autoPaging:true, 
			pager:[this,"doPager"],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseJUM = new button(this.pJUM, {bound:[490,210,80,20], caption:"Close"});
		this.bCloseJUM.setIcon("icon/application-exit2.png");
		this.bCloseJUM.on("click", function(){
			self.pJUM.hide();
		});

		this.pJapel = new control_popupForm(this.app);
		this.pJapel.setBound(0, 0,480,260);
		this.pJapel.setArrowMode(4);
		this.pJapel.hide();
		this.sgAddJapel = new saiGrid(this.pJapel,{bound:[1,0,470,200],
			colCount: 4,
			colTitle: ["Amount","Asuransi","Tgl Expire","No Asuransi"],
			colWidth:[[3,2,1,0],[110,110,110,110]],
			columnReadOnly:[true, [0,1,2,3],[]],
			rowPerPage:20, 
            colFormat:[[0],[cfNilai]],	
			autoPaging:true, 
			pager:[this,"doPager"],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseJapel = new button(this.pJapel, {bound:[380,210,80,20], caption:"Close"});
		this.bCloseJapel.setIcon("icon/application-exit2.png");
		this.bCloseJapel.on("click", function(){
			self.pJapel.hide();
		});

		this.pJapem = new control_popupForm(this.app);
		this.pJapem.setBound(0, 0,480,260);
		this.pJapem.setArrowMode(4);
		this.pJapem.hide();
		this.sgAddJapem = new saiGrid(this.pJapem,{bound:[1,0,470,200],
			colCount: 4,
			colTitle: ["Amount","Asuransi","Tgl Expire","No Asuransi"],
			colWidth:[[3,2,1,0],[110,110,110,110]],
			columnReadOnly:[true, [0,1,2,3],[]],
			rowPerPage:20, 
            colFormat:[[0],[cfNilai]],	
			autoPaging:true, 
			pager:[this,"doPager"],
			nilaiChange:[this,"doNilaiChange"]
		});
		this.bCloseJapem = new button(this.pJapem, {bound:[380,210,80,20], caption:"Close"});
		this.bCloseJapem.setIcon("icon/application-exit2.png");
		this.bCloseJapem.on("click", function(){
			self.pJapem.hide();
		});

		this.pAsuransi = new control_popupForm(this.app);
		this.pAsuransi.setBound(0, 0,360,195);
		// this.pAsuransi.setArrowMode(2);
		this.pAsuransi.hide();
		this.sgAsuransi = new saiGrid(this.pAsuransi,{bound:[1,0,350,190],
			colCount: 1,
			colTitle: ["Nama Asuransi"],
			colWidth:[[0],[290]],
			columnReadOnly:[true, [0],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[1],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});

		
		this.pAsuransi2 = new control_popupForm(this.app);
		this.pAsuransi2.setBound(0, 0,360,195);
		// this.pAsuransi.setArrowMode(2);
		this.pAsuransi2.hide();
		this.sgAsuransi2 = new saiGrid(this.pAsuransi2,{bound:[1,0,350,190],
			colCount: 1,
			colTitle: ["Nama Asuransi"],
			colWidth:[[0],[290]],
			columnReadOnly:[true, [0],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[1],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});

		this.pAsuransi3 = new control_popupForm(this.app);
		this.pAsuransi3.setBound(0, 0,360,195);
		// this.pAsuransi.setArrowMode(2);
		this.pAsuransi3.hide();
		this.sgAsuransi3 = new saiGrid(this.pAsuransi3,{bound:[1,0,350,190],
			colCount: 1,
			colTitle: ["Nama Asuransi"],
			colWidth:[[0],[290]],
			columnReadOnly:[true, [0],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[1],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});

		this.pAsuransi4 = new control_popupForm(this.app);
		this.pAsuransi4.setBound(0, 0,360,195);
		// this.pAsuransi.setArrowMode(2);
		this.pAsuransi4.hide();
		this.sgAsuransi4 = new saiGrid(this.pAsuransi4,{bound:[1,0,350,190],
			colCount: 1,
			colTitle: ["Nama Asuransi"],
			colWidth:[[0],[290]],
			columnReadOnly:[true, [0],[]],
			rowPerPage:20, 
			autoPaging:true, 
			pager:[this,"doPager"],
			colFormat:[[1],[cfNilai]],
			nilaiChange:[this,"doNilaiChange"]
		});


		// this.pUmum250 = new control_popupForm(this.app);
		// this.pUmum250.setBound(0, 0,500, 210);
		// this.pUmum250.setArrowMode(4);
		// this.pUmum250.hide();
		// this.bAppSendiri = new button(this.pUmum250, {bound:[150, 50,200,20], caption:"Approve Sendiri?"});
		// var self=this;
		// this.bAppSendiri.on("click", function(){
		// 	try{
				
		// 			if(self.checkbox1.selected == false && self.checkbox2.selected != false){
		// 				var jenisCK = 'NP';
		// 			}else if(self.checkbox2.selected == false && self.checkbox1.selected != false){
		// 				var jenisCK = 'KT';
		// 			}else if(self.checkbox1.selected == false && self.checkbox2.selected == false){
		// 				var jenisCK = '';
		// 			}

		// 			// if(this.checkbox1.selected == false){
		// 			if(self.totPPH.getText() == ""){
		// 				var totalpph = 0;
		// 			}else{
		// 				var totalpph = nilaiToFloat(self.totPPH.getText());
		// 			}

		// 				var data = {					
		// 					kode_ba : self.kodeBA.getText(),
		// 					jns_trans : self.jnsTrans.getText(),
		// 					kode_akun : self.kdAkun.getText(),
		// 					kode_cc : self.cc.getText(),
		// 					kode_rkm : self.keg.getText(),
		// 					termin : self.termin.getText(),
		// 					jenis_uang : self.jenis_uang.getText(),
		// 					jenis_vendor : self.jenisvendor.getText(),
							
		// 					kode_vendor : self.kdmitra.getText(),
		// 					nama_vendor : self.mitra.getText(),
		// 					reg_id : self.regid.getText(),
		// 					nama_proyek : self.proyek.getText(), 
		// 					keterangan : self.ket.getText(),
		// 					jenis : jenisCK,							
							
		// 					no_kontrak : self.nokon.getText(),
		// 					tgl_kontrak : self.tglkon.getText(),
		// 					curr_kontrak : self.currkon.getText(),
		// 					nilai_kontrak : nilaiToFloat(self.nilkon.getText()),
	
		// 					no_posp : self.nopo.getText(),
		// 					tgl_posp : self.tglpo.getText(),
		// 					curr_po : self.currpo.getText(),
		// 					nilai_posp : nilaiToFloat(self.nilpo.getText()),
	
		// 					no_amd : self.noaman.getText(),
		// 					tgl_amd : self.tglaman.getText(),
		// 					curr_amd : self.curraman.getText(),
		// 					nilai_amd : self.nilaman.getText(),
	
		// 					nilai_tagihan : nilaiToFloat(self.ntagih.getText()),
		// 					nilai_curr : nilaiToFloat(self.ntagihcurr.getText()),
		// 					curr : self.currtagih.getText(),
	
		// 					nilai_bayar : nilaiToFloat(self.nbayar.getText()),
		// 					nilai_bayar_curr : nilaiToFloat(self.nbayarcurr.getText()),
		// 					curr_bayar : self.currbayar.getText(),
							
		// 					jns_dpp : self.jenis_dpp2.getText(),
		// 					jenis_nilai : self.jenis_nilai.getText(),

		// 					tot_pph : totalpph,
		// 					dppmaterial : nilaiToFloat(self.dppmaterial.getText()),
		// 					dppjasa : nilaiToFloat(self.dppjasa.getText()),
		// 					nilai_tagihan_asli : nilaiToFloat(self.ntagih2.getText()),
		// 					persen_um : nilaiToFloat(self.totPerUM.getText()),
		// 					nilai_um : nilaiToFloat(self.totUM.getText()),
		// 					tot_fp : nilaiToFloat(self.totFP.getText()),
		// 					tot_dpp : nilaiToFloat(self.totDPP.getText()),
		// 					tot_kp : nilaiToFloat(self.totKP.getText()),

		// 					am_bast :nilaiToFloat(self.totBast.getText()),							
		// 					am_jum :nilaiToFloat(self.totJUM.getText()),
		// 					am_japel :nilaiToFloat(self.totJapel.getText()),
		// 					am_japem :nilaiToFloat(self.totJapem.getText()),

		// 					note_petugas : self.notepetugas.getText(),

		// 					kat_dok : self.kat_dok.getText()
		// 				};
					
								
		// 			/*tambahan uang muka*/
		// 			var UM = {
		// 				itemsUM : [],												
		// 			}
		// 			var dataUM = [];
		// 			for (var i = 0; i < self.sgAddUM.getRowCount();i++){				
		// 				var itemUM = {
		// 					value1 : nilaiToFloat(self.sgAddUM.cells(0,i)),
		// 					value2 : nilaiToFloat(self.sgAddUM.cells(1,i))
							
		// 				};
		// 				dataUM.push(itemUM);					
		// 			}						
		// 			UM.itemsUM.push(dataUM);
		// 			////////////////////////////

		// 			var header = {
		// 				items : [],												
		// 			}

		// 			if(self.ckStagih.selected == true && self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != ""){
		// 				item1 = {
		// 					no_urut : "1",
		// 					jenis : "ST",
		// 					value1 : self.noStagih.getText(),
		// 					value2 : self.tglDokStagih.getText(),
		// 					value3 : self.tglMasukStagih.getText()	
		// 				}
		// 				header.items.push(item1);
		// 			}
					
				

		// 			if(self.ckInv.selected == true){
		// 				var dataInvoice = [];
		// 				for (var i = 0; i < self.sgAddInvoice.getRowCount();i++){				
		// 					var item2 = {
		// 						no_urut : "2",
		// 						jenis :"INV",
		// 						value1 : self.sgAddInvoice.cells(0,i), 
		// 						value2 : self.sgAddInvoice.cells(1,i),
		// 						value3 : self.sgAddInvoice.cells(2,i)
		// 					};
		// 					dataInvoice.push(item2);					
		// 				}						
		// 				header.items.push(dataInvoice);
						
		// 			}	
					
		// 			if(self.ckKP.selected == true){
		// 				var dataKP = [];
		// 					for (var i = 0; i < self.sgAddDPP.getRowCount();i++){				
		// 						var item3 = {
		// 							no_urut : "3",
		// 							jenis :"KPPN",
		// 							value1 : nilaiToFloat(self.sgAddDPP.cells(0,i)), 
		// 							value2 : nilaiToFloat(self.sgAddDPP.cells(1,i)),
		// 							value3 : nilaiToFloat(self.sgAddDPP.cells(2,i)),
		// 							value4 : self.sgAddDPP.cells(3,i),
		// 							value5 : self.sgAddDPP.cells(4,i)
									
		// 						};
		// 						dataKP.push(item3);					
		// 					}						
		// 					header.items.push(dataKP);
					
		// 			}	

		// 			if(self.jenisvendor.getText() == "Dalam Negeri"){
		// 				if(self.ckFP.selected == true  ){
		// 					var dataFP = [];
		// 					for (var i = 0; i < self.sgAddFP.getRowCount();i++){				
		// 						var item4 = {
		// 							no_urut : "4",
		// 							jenis :"FP",
		// 							value1 : self.sgAddFP.cells(0,i), 
		// 							value2 : self.sgAddFP.cells(1,i),
		// 							value3 : nilaiToFloat(self.sgAddFP.cells(2,i)),
		// 							value4 : self.sgAddFP.cells(3,i)
									
		// 						};
		// 						dataFP.push(item4);					
		// 					}						
		// 					header.items.push(dataFP);

		// 				}	
		// 			}

		// 			if(self.ckPPH.selected == true){
		// 				var dataPPH = [];
		// 				for (var i = 0; i < self.sgAddPPH.getRowCount();i++){				
		// 					var item5 = {
		// 						no_urut : "5",
		// 						jenis :"PPH",
		// 						value1 : self.sgAddPPH.cells(0,i), 
		// 						value2 : self.sgAddPPH.cells(1,i),
		// 						value3 : nilaiToFloat(self.sgAddPPH.cells(2,i))
								
		// 					};
		// 					dataPPH.push(item5);					
		// 				}						
		// 				header.items.push(dataPPH);
		// 			}
										
		// 			if(self.ckPo.selected == true && self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != ""){
		// 				item6 = {
		// 					no_urut : "6",
		// 					jenis :"POSP",
		// 					value1 : nilaiToFloat(self.amountPo.getText()),
		// 					value2 : self.tahapPo.getText(),
		// 					value3 : self.nAman.getText()						
		// 				}
		// 				header.items.push(item6);
		// 			}

		// 			if(self.ckBaut.selected == true ){
		// 				var dataBaut = [];
		// 					for (var i = 0; i < self.sgAddBaut.getRowCount();i++){				
		// 						var item7 = {
		// 							no_urut : "7",
		// 							jenis :"BAP",
		// 							value1 : self.sgAddBaut.cells(0,i), 
		// 							value2 : self.sgAddBaut.cells(1,i)
									
		// 						};
		// 						dataBaut.push(item7);					
		// 					}						
		// 					header.items.push(dataBaut);
					
		// 			}

		// 			if(self.ckBast.selected == true){
		// 				var dataBast = [];
		// 				for (var i = 0; i < self.sgAddBast.getRowCount();i++){				
		// 					var item8 = {
		// 						no_urut : "8",
		// 						jenis :"BAST",
		// 						value1 : nilaiToFloat(self.sgAddBast.cells(0,i)), 
		// 						value2 : self.sgAddBast.cells(1,i),
		// 						value3 : self.sgAddBast.cells(2,i), 
		// 						value4 : self.sgAddBast.cells(3,i),
		// 						value5 : nilaiToFloat(self.sgAddBast.cells(4,i)), 
		// 						value6 : nilaiToFloat(self.sgAddBast.cells(5,i))
								
		// 					};
		// 					dataBast.push(item8);					
		// 				}						
		// 				header.items.push(dataBast);

		// 			}

				
					
		// 			if(self.ckNrRek.selected == true && self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != "" ){
		// 				item9 = {
		// 					no_urut : "9",
		// 					jenis :"RKN",
		// 					value1 : self.noRek.getText(),
		// 					value2 : self.bankRek.getText(),
		// 					value3 : self.aNamaRek.getText()
		// 					// value4 : self.nBrgRek.getText()
		// 				}
		// 				header.items.push(item9);
		// 			}	

				
		// 			if(self.ckJUM.selected == true ){
		// 				var dataJum = [];
		// 				for (var i = 0; i < self.sgAddJUM.getRowCount();i++){				
		// 					var item10 = {
		// 						no_urut : "10",
		// 						jenis :"JUM",
		// 						value1 : nilaiToFloat(self.sgAddJUM.cells(1,i)),
		// 						value2 : self.sgAddJUM.cells(2,i), 
		// 						value3 : self.sgAddJUM.cells(3,i),
		// 						value4 : self.sgAddJUM.cells(4,i),
		// 						value5 : self.sgAddJUM.cells(0,i)
		// 					};
		// 					dataJum.push(item10);					
		// 				}						
		// 				header.items.push(dataJum);
	
		// 			}	

		// 			if(self.ckJapel.selected == true ){
		// 				var dataJapel = [];
		// 				for (var i = 0; i < self.sgAddJapel.getRowCount();i++){				
		// 					var item11 = {
		// 						no_urut : "11",
		// 						jenis :"JAPEL",
		// 						value1 : nilaiToFloat(self.sgAddJapel.cells(0,i)), 
		// 						value2 : self.sgAddJapel.cells(1,i),
		// 						value3 : self.sgAddJapel.cells(2,i), 
		// 						value4 : self.sgAddJapel.cells(3,i)
								
		// 					};
		// 					dataJapel.push(item11);					
		// 				}						
		// 				header.items.push(dataJapel);

		// 			}

		// 			if(self.ckJapem.selected == true ){
		// 				var dataJapem = [];
		// 				for (var i = 0; i < self.sgAddJapem.getRowCount();i++){				
		// 					var item12 = {
		// 						no_urut : "12",
		// 						jenis :"BAP",
		// 						value1 : nilaiToFloat(self.sgAddJapem.cells(0,i)), 
		// 						value2 : self.sgAddJapem.cells(1,i),
		// 						value3 : self.sgAddJapem.cells(2,i), 
		// 						value4 : self.sgAddJapem.cells(3,i)
								
		// 					};
		// 					dataJapem.push(item12);					
		// 				}						
		// 				header.items.push(dataJapem);

		// 			}

		// 			if(self.ckPa.selected == true && self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != "" ){
		// 				item13 = {
		// 					no_urut : "13",
		// 					jenis :"PA",
		// 					value1 : self.amPa.getText(),
		// 					value2 : self.asPa.getText(),
		// 					value3 : self.tglPa.getText()
		// 				}
		// 				header.items.push(item13);
		// 			}
					
		// 			if(self.jenisvendor.getText() == "Dalam Negeri"){
		// 			if(self.ckTT.selected == true && self.noTT.getText() != "" && self.tglTT.getText() != "" ){
		// 				item14 = {
		// 					no_urut : "14",
		// 					jenis :"TTABD",
		// 					value1 : self.noTT.getText(),
		// 					value2 : self.tglTT.getText()
		// 				}
		// 				header.items.push(item14);
		// 			}
					
		// 			if(self.ckSIU.selected == true && self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != "" ){
		// 				item15 = {
		// 					no_urut : "15",
		// 					jenis :"SIUJK",
		// 					value1 : self.noSIU.getText(),
		// 					value2 : self.tglmSIU.getText(),
		// 					value3 : self.tglaSIU.getText()
		// 				}
		// 				header.items.push(item15);
		// 			}

		// 			if(self.ckNpwp.selected == true && self.noNpwp.getText() != "" && self.tglNpwp.getText() != "" ){
		// 				item16 = {
		// 					no_urut : "16",
		// 					jenis :"NPWP",
		// 					value1 : self.noNpwp.getText(),
		// 					value2 : self.tglNpwp.getText()
		// 				}	
		// 				header.items.push(item16);
		// 			}
		// 			}


		// 			if(self.jenisvendor.getText() == "Luar Negeri"){

		// 			if(self.ckForm.selected == true && self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != "" ){
		// 				item17 = {
		// 					no_urut : "17",
		// 					jenis :"FDGT",
		// 					value1 : self.noForm.getText(),
		// 					value2 : self.tglForm.getText(),
		// 					value3 : self.ngrForm.getText()
		// 				}
		// 				header.items.push(item17);
		// 			}

		// 			if(self.ckCod.selected == true && self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != "" ){
		// 				item18 = {
		// 					no_urut : "18",
		// 					jenis :"COD",
		// 					value1 : self.noCod.getText(),
		// 					value2 : self.tglCod.getText(),
		// 					value3 : self.ngrCod.getText()
		// 				}
		// 				header.items.push(item18);
		// 			}

		// 			}
					
		// 			if(self.ckCoo.selected == true && self.noCoo.getText() != "" && self.isCoo.getText() != "" ){
		// 				item19 = {
		// 					no_urut : "19",
		// 					jenis :"COO",
		// 					value1 : self.noCoo.getText(),
		// 					value2 : self.isCoo.getText()
		// 				}	
		// 				header.items.push(item19);
		// 			}

		// 			if(self.ckSL.selected == true && self.noSL.getText() != "" && self.tglSL.getText() != "" ){
		// 				item20 = {
		// 					no_urut : "20",
		// 					jenis :"SL",
		// 					value1 : self.noSL.getText(),
		// 					value2 : self.tglSL.getText()						
		// 				}	
		// 				header.items.push(item20);
		// 			}

		// 			if(self.ckDenda.selected == true && self.jmlDenda.getText() != "" && self.jmlHari.getText() != "" ){
		// 				item21 = {
		// 					no_urut : "21",
		// 					jenis :"DH",
		// 					value1 : self.jmlHari.getText(),
		// 					value2 : nilaiToFloat(self.jmlDenda.getText())	
		// 				}
		// 				header.items.push(item21);	
		// 			}	

		// 			if(self.ckProposal.selected == true && self.adaProposal.getText() != "" ){
		// 				item22 = {
		// 					no_urut : "22",
		// 					jenis :"PRP",
		// 					value1 : self.adaProposal.getText()
		// 				}
		// 				header.items.push(item22);	
		// 			}	
					

		// 			if(nilaiToFloat(self.totKP.getText()) > 0){
		// 				if(nilaiToFloat(self.totKP.getText()) != nilaiToFloat(self.ntagih.getText())){
		// 					var persamaan = "0";
		// 				}else{
		// 					var persamaan = "1";
		// 				}
		// 			}

		// 			//alert penyimpanan
		// 			if( self.nbayarcurr.getText() == "" || self.currbayar.getText() == ""){
		// 				system.alert(self, "Data Tidak Boleh Kosong");
		// 			}
					
		// 			else if(self.nbayar.getText() == "0" || self.nbayar.getText() == 0 ){
		// 				system.alert(self, "Nilai Bayar Harap Diisi");	
		// 			}
		// 			// else if(self.checkbox2.selected == false && self.checkbox1.selected == false ){
		// 			// 	system.alert(self, "Pilihan Kontrak/Nota Pesanan Harap Dipilih");	
		// 			// }
		// 			else if(self.ket.getText() == ""){
		// 				system.alert(self, "Keterangan Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.proyek.getText() == ""){
		// 				system.alert(self, "Nama Proyek Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.currpo.getText() == ""){
		// 				system.alert(self, "Currency Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.jenisvendor.getText() == ""){
		// 				system.alert(self, "Jenis Vendor Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.jenis_uang.getText() == ""){
		// 				system.alert(self, "Payment Method Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.jnsTrans.getText() == ""){
		// 				system.alert(self, "Jenis Transaksi Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.kodeBA.getText() == ""){
		// 				system.alert(self, "Kode BA Tidak Boleh Kosong");	
		// 			}
		// 			//validasi 1
		// 			else if(self.ckStagih.selected == true && (self.noStagih.getText() == "" || self.tglDokStagih.getText() == "" || self.tglMasukStagih.getText() == "" )){
		// 				system.alert(self, "Inputan Checklist No 1 (SURAT TAGIHAN) Tidak Boleh Kosong");						
		// 			}					
		// 			// else if(self.ckInv.selected == true && (self.noInv.getText() == "" || self.tglDokInv.getText() == "" || self.tglMasukInv.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }
		// 			// else if(self.ckKP.selected == true && (self.amKP.getText() == "" || self.dppKP.getText() == "" || self.noKP.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }
		// 			// else if(self.ckFP.selected == true && (self.amFP.getText() == "" || self.wapuPPH.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }	
		// 			// else if(self.ckPPH.selected == true && (self.jenisPPH.getText() == "" || self.persenPPH.getText() == "" || self.amPPH.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }
		// 			else if(self.ckPo.selected == true && (self.amountPo.getText() == "" || self.tahapPo.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 6 (PO Awal Non PPN) Tidak Boleh Kosong");
		// 			}
		// 			// else if(self.ckBaut.selected == true && (self.noBaut.getText() == "" || self.tglBaut.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }else if(self.ckBast.selected == true && (self.amBast.getText() == "" || self.tglBast.getText() == "" || self.noMIGOBast.getText() == "" || self.noMIGOBast.getText() == "" || self.tanggal.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
					
		// 			else if(self.ckNrRek.selected == true && (self.noRek.getText() == "" || self.bankRek.getText() == "" || self.aNamaRek.getText() == "" )){
		// 				system.alert(self, "Inputan Checklist No 9 (Rekening) Tidak Boleh Kosong");
		// 			}
						
		// 			// else if(self.ckJUM.selected == true && (self.amJUM.getText() == "" || self.asJUM.getText() == "" || self.tglJUM.getText() == "" || self.noAsJUM.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
		// 			// else if(self.ckJapel.selected == true && (self.amJapel.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }else if(self.ckJapem.selected == true && (self.amJapem.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
					
		// 			else if(self.ckPa.selected == true && (self.amPa.getText() == "" || self.asPa.getText() == "" || self.tglPa.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 13 (POLIS ASURANSI) Tidak Boleh Kosong");
		// 			}else if(self.ckTT.selected == true && (self.noTT.getText() == "" || self.tglTT.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 14 (Tanda Terima As Build Draw) Tidak Boleh Kosong");
		// 			}else if(self.ckSIU.selected == true && (self.noSIU.getText() == "" || self.tglmSIU.getText() == "" || self.tglaSIU.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 15 (SIUJK) Tidak Boleh Kosong");
		// 			}else if(self.ckNpwp.selected == true && (self.noNpwp.getText() == "" || self.tglNpwp.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 16 (NPWP) Tidak Boleh Kosong");
		// 			}
		// 			// else if(self.ckForm.selected == true && (self.noForm.getText() == "" || self.tglForm.getText() == "" || self.ngrForm.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
		// 			// else if(self.ckCod.selected == true && (self.noCod.getText() == "" || self.tglCod.getText() == "" || self.ngrCod.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
		// 			else if(self.ckCoo.selected == true && (self.noCoo.getText() == "" && self.isCoo.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 19 (CERT OF ORIGIN) Tidak Boleh Kosong");
		// 			}else if(self.ckSL.selected == true && (self.noSL.getText() == "" || self.tglSL.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 20 (SIDE LETTER) Tidak Boleh Kosong");
		// 			}else if(self.ckDenda.selected == true && ( self.jmlDenda.getText() == "" || self.jmlHari.getText() == "" )){
		// 				system.alert(self, "Inputan Checklist No 21 (DENDA-HARI) Tidak Boleh Kosong");
		// 			}
		// 			else if(self.ckProposal.selected == true && self.adaProposal.getText() == ""){
		// 				system.alert(self, "Inputan Checklist No 22 (PROPOSAL) Tidak Boleh Kosong");
		// 			}
		// 			else if(persamaan == "0"){
		// 				system.alert(self, "Nilai Tagihan Harus Sesuai Dengan Nilai Kwitansi + PPN");
		// 			}
		// 			else if(self.kat_dok.getText() == ""){
		// 				system.alert(self, "Kategori Tidak Boleh Kosong");	
		// 			}
					

		// 			else{
					
		// 				self.app.services.callServices("financial_Fca","saveEntDok2", [data,header,self.regid.getText(),self.nt.getText(),self.sts_baru.getText(),self.statusbaru.getText(),self.note1.getText(),self.app._lokasi,UM] ,function(data){
		// 					if (data == "process completed") {
		// 						system.info(self, data,"");
		// 						self.app._mainForm.bClear.click();
								
		// 						//hapus inputan
		// 						self.sgAdd1.setCell("");
		// 						self.kat_dok.setText("");
		// 						// self.sgAdd2.setCell("");
		// 						// self.sgAdd3.setCell("");
			
		// 						self.pUmum250.hide();
			
			
		// 						self.jenis_nilai.setText("");
		// 						self.jenis_dpp2.setText("");
		// 						self.jenis_dpp.setSelected(false);
		// 						self.sgAddPPH.setCell("");
		// 						self.note1.setText("");
		// 						self.mitra.setText("");
		// 						self.kdmitra.setText(""),
		// 						self.persen.setText("");
		// 						self.jnsTrans.getText(""),
		// 						self.proyek.setText("");
		// 						self.ket.setText("");
		// 						self.checkbox1.setSelected(false);
		// 						self.checkbox2.setSelected(false);
		// 						self.nokon.setText("");
		// 						self.jenisvendor.setText("");
		// 						self.tglkon.setText("");
		// 						self.currkon.setText("");
		// 						self.nilkon.setText("");
		// 						self.nopo.setText("");
		// 						self.tglpo.setText("");
		// 						self.currpo.setText("");
		// 						self.nilpo.setText("");
		// 						self.noaman.setText("");
		// 						self.tglaman.setText("");
		// 						self.curraman.setText("");
		// 						self.nilaman.setText("");
		// 						self.ntagih.setText("");
		// 						self.ntagihcurr.setText("");
		// 						self.currtagih.setText("");									
		// 						self.nbayar.setText("");
		// 						self.nbayarcurr.setText("");
		// 						self.currbayar.setText("");	
			
		// 						self.ckStagih.setSelected(false);
		// 						self.noStagih.setText("");
		// 						self.tglDokStagih.setText("");
		// 						self.tglMasukStagih.setText("");
			
		// 						self.ckInv.setSelected(false);
		// 						self.noInv.setText("");
		// 						self.tglDokInv.setText("");
		// 						self.tglMasukInv.setText("");
			
		// 						self.ckPo.setSelected(false);
		// 						self.amountPo.setText("");
		// 						self.tahapPo.setText("");
		// 						self.nAman.setText("");
			
		// 						self.ckBaut.setSelected(false);
		// 						self.noBaut.setText("");
		// 						self.tglBaut.setText("");
			
			
		// 						self.ckPPH.setSelected(false);
		// 						self.jenisPPH.setText("");
		// 						self.persenPPH.setText("");
		// 						self.amPPH.setText("");
		// 						self.wapuPPH.setText("");
			
		// 						self.ckBast.setSelected(false);
		// 						self.amBast.setText("");
		// 						self.tglBast.setText("");
		// 						self.noMIGOBast.setText("");
		// 						self.tanggal.setText("");
		// 						// self.nBrgBast.setText("");
		// 						// self.nJasaBast.setText("");
			
		// 						// self.ckPotum.setSelected(false);
		// 						// self.amPotum.setText("");
			
		// 						self.ckKP.setSelected(false);
		// 						self.amKP.setText("");
		// 						self.dppKP.setText("");
		// 						self.noKP.setText("");
			
		// 						self.ckNrRek.setSelected(false);
		// 						self.noRek.setText("");
		// 						self.bankRek.setText("");
		// 						self.aNamaRek.setText("");
		// 						// self.nBrgRek.setText("");
			
		// 						self.ckFP.setSelected(false);
		// 						self.amFP.setText("");
		// 						self.noFP.setText("");
		// 						self.tglFP.setText("");
			
		// 						self.ckJUM.setSelected(false);
		// 						self.nomJUM.setText("");
		// 						self.amJUM.setText("");
		// 						self.asJUM.setText("");
		// 						self.tglJUM.setText("");
		// 						self.noAsJUM.setText("");
			
		// 						self.ckJapel.setSelected(false);
		// 						self.amJapel.setText("");
		// 						self.asJapel.setText("");
		// 						self.tglJapel.setText("");
		// 						self.noAsJapel.setText("");
			
		// 						self.ckJapem.setSelected(false);
		// 						self.amJapem.setText("");
		// 						self.asJapem.setText("");
		// 						self.tglJapem.setText("");
		// 						self.noAsJapem.setText("");
			
		// 						self.ckPa.setSelected(false);
		// 						self.amPa.setText("");
		// 						self.asPa.setText("");
		// 						self.tglPa.setText("");
			
		// 						self.ckTT.setSelected(false);
		// 						self.noTT.setText("");
		// 						self.tglTT.setText("");
			
		// 						self.ckSIU.setSelected(false);
		// 						self.noSIU.setText("");
		// 						self.tglmSIU.setText("");
		// 						self.tglaSIU.setText("");
			
		// 						self.ckNpwp.setSelected(false);
		// 						self.noNpwp.setText("");
		// 						self.tglNpwp.setText("");
								
		// 						self.ckForm.setSelected(false);
		// 						self.noForm.setText("");
		// 						self.tglForm.setText("");
		// 						self.ngrForm.setText("");
			
		// 						self.ckCod.setSelected(false);
		// 						self.noCod.setText("");
		// 						self.tglCod.setText("");
		// 						self.ngrCod.setText("");
			
		// 						self.ckCoo.setSelected(false);
		// 						self.noCoo.setText("");
		// 						self.isCoo.setText("");
			
		// 						self.ckSL.setSelected(false);
		// 						self.noSL.setText("");
		// 						self.tglSL.setText("");
			
		// 						self.ckDenda.setSelected(false);
		// 						self.jmlDenda.setText("");
		// 						self.jmlHari.setText("");
			
		// 						self.ckProposal.setSelected(false);
		// 						self.adaProposal.setText("");
			
		// 						self.kdAkun.setText("");
		// 						self.cc.setText("");
		// 						self.keg.setText("");
		// 						self.termin.setText("");
		// 						self.jenis_uang.setText("");
		// 						self.jnsTrans.setText("");
		// 						self.kodeBA.setText("");
			
		// 						self.nt.setText("");
		// 						self.sts_baru.setText("");
			
		// 						// page = self.sg1.page;
		// 						// row = ((page-1) * self.sg1.rowPerPage)+row;
		// 						self.tab.setActivePage(self.tab.childPage[0]);
		// 						self.RefreshList();
			
		// 						self.app._mainForm.runTCODE("F0005");
								
		// 					}else {
		// 						system.alert(self, data,"");
		// 					}
		// 				});

		// 			}
		// 	}catch(e){
		// 		alert(e);
		// 	}
			
		// });
		// this.bAppOrgLain = new button(this.pUmum250, {bound:[150, 120,200,20], caption:"Approve By Cash Bank Officer?"});
		// this.bAppOrgLain.on("click", function(){
		// 	try{
				

		// 			if(self.checkbox1.selected == false && self.checkbox2.selected != false){
		// 				var jenisCK = 'NP';
		// 			}else if(self.checkbox2.selected == false && self.checkbox1.selected != false){
		// 				var jenisCK = 'KT';
		// 			}else if(self.checkbox1.selected == false && self.checkbox2.selected == false){
		// 				var jenisCK = '';
		// 			}

		// 			// if(this.checkbox1.selected == false){
		// 			if(self.totPPH.getText() == ""){
		// 				var totalpph = 0;
		// 			}else{
		// 				var totalpph = nilaiToFloat(self.totPPH.getText());
		// 			}

		// 			var data = {					
		// 				kode_ba : self.kodeBA.getText(),
		// 				jns_trans : self.jnsTrans.getText(),
		// 				kode_akun : self.kdAkun.getText(),
		// 				kode_cc : self.cc.getText(),
		// 				kode_rkm : self.keg.getText(),
		// 				termin : self.termin.getText(),
		// 				jenis_uang : self.jenis_uang.getText(),
		// 				jenis_vendor : self.jenisvendor.getText(),
						
		// 				kode_vendor : self.kdmitra.getText(),
		// 				nama_vendor : self.mitra.getText(),
		// 				reg_id : self.regid.getText(),
		// 				nama_proyek : self.proyek.getText(), 
		// 				keterangan : self.ket.getText(),
		// 				jenis : jenisCK,							
						
		// 				no_kontrak : self.nokon.getText(),
		// 				tgl_kontrak : self.tglkon.getText(),
		// 				curr_kontrak : self.currkon.getText(),
		// 				nilai_kontrak : nilaiToFloat(self.nilkon.getText()),

		// 				no_posp : self.nopo.getText(),
		// 				tgl_posp : self.tglpo.getText(),
		// 				curr_po : self.currpo.getText(),
		// 				nilai_posp : nilaiToFloat(self.nilpo.getText()),

		// 				no_amd : self.noaman.getText(),
		// 				tgl_amd : self.tglaman.getText(),
		// 				curr_amd : self.curraman.getText(),
		// 				nilai_amd : self.nilaman.getText(),

		// 				nilai_tagihan : nilaiToFloat(self.ntagih.getText()),
		// 				nilai_curr : nilaiToFloat(self.ntagihcurr.getText()),
		// 				curr : self.currtagih.getText(),

		// 				nilai_bayar : nilaiToFloat(self.nbayar.getText()),
		// 				nilai_bayar_curr : nilaiToFloat(self.nbayarcurr.getText()),
		// 				curr_bayar : self.currbayar.getText(),
						
		// 				jns_dpp : self.jenis_dpp2.getText(),
		// 				jenis_nilai : self.jenis_nilai.getText(),

		// 				tot_pph : totalpph,
		// 				dppmaterial : nilaiToFloat(self.dppmaterial.getText()),
		// 				dppjasa : nilaiToFloat(self.dppjasa.getText()),
		// 				nilai_tagihan_asli : nilaiToFloat(self.ntagih2.getText()),
		// 				persen_um : nilaiToFloat(self.totPerUM.getText()),
		// 				nilai_um : nilaiToFloat(self.totUM.getText()),
		// 				tot_fp : nilaiToFloat(self.totFP.getText()),
		// 				tot_dpp : nilaiToFloat(self.totDPP.getText()),
		// 				tot_kp : nilaiToFloat(self.totKP.getText()),

		// 				am_bast :nilaiToFloat(self.totBast.getText()),							
		// 				am_jum :nilaiToFloat(self.totJUM.getText()),
		// 				am_japel :nilaiToFloat(self.totJapel.getText()),
		// 				am_japem :nilaiToFloat(self.totJapem.getText()),

		// 				note_petugas : self.notepetugas.getText(),

		// 				kat_dok : self.kat_dok.getText()
		// 			};
				
						
								
		// 			/*tambahan uang muka*/
		// 			var UM = {
		// 				itemsUM : [],												
		// 			}
		// 			var dataUM = [];
		// 			for (var i = 0; i < self.sgAddUM.getRowCount();i++){				
		// 				var itemUM = {
		// 					value1 : nilaiToFloat(self.sgAddUM.cells(0,i)),
		// 					value2 : nilaiToFloat(self.sgAddUM.cells(1,i))
							
		// 				};
		// 				dataUM.push(itemUM);					
		// 			}						
		// 			UM.itemsUM.push(dataUM);
		// 			////////////////////////////

		// 			var header = {
		// 				items : [],												
		// 			}

		// 			if(self.ckStagih.selected == true && self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != ""){
		// 				item1 = {
		// 					no_urut : "1",
		// 					jenis : "ST",
		// 					value1 : self.noStagih.getText(),
		// 					value2 : self.tglDokStagih.getText(),
		// 					value3 : self.tglMasukStagih.getText()	
		// 				}
		// 				header.items.push(item1);
		// 			}
					
				

		// 			if(self.ckInv.selected == true){
		// 				var dataInvoice = [];
		// 				for (var i = 0; i < self.sgAddInvoice.getRowCount();i++){				
		// 					var item2 = {
		// 						no_urut : "2",
		// 						jenis :"INV",
		// 						value1 : self.sgAddInvoice.cells(0,i), 
		// 						value2 : self.sgAddInvoice.cells(1,i),
		// 						value3 : self.sgAddInvoice.cells(2,i)
		// 					};
		// 					dataInvoice.push(item2);					
		// 				}						
		// 				header.items.push(dataInvoice);
						
		// 			}	
					
		// 			if(self.ckKP.selected == true){
		// 				var dataKP = [];
		// 					for (var i = 0; i < self.sgAddDPP.getRowCount();i++){				
		// 						var item3 = {
		// 							no_urut : "3",
		// 							jenis :"KPPN",
		// 							value1 : nilaiToFloat(self.sgAddDPP.cells(0,i)), 
		// 							value2 : nilaiToFloat(self.sgAddDPP.cells(1,i)),
		// 							value3 : nilaiToFloat(self.sgAddDPP.cells(2,i)),
		// 							value4 : self.sgAddDPP.cells(3,i),
		// 							value5 : self.sgAddDPP.cells(4,i)
									
		// 						};
		// 						dataKP.push(item3);					
		// 					}						
		// 					header.items.push(dataKP);
					
		// 			}	

		// 			if(self.jenisvendor.getText() == "Dalam Negeri"){
		// 				if(self.ckFP.selected == true  ){
		// 					var dataFP = [];
		// 					for (var i = 0; i < self.sgAddFP.getRowCount();i++){				
		// 						var item4 = {
		// 							no_urut : "4",
		// 							jenis :"FP",
		// 							value1 : self.sgAddFP.cells(0,i), 
		// 							value2 : self.sgAddFP.cells(1,i),
		// 							value3 : nilaiToFloat(self.sgAddFP.cells(2,i)),
		// 							value4 : self.sgAddFP.cells(3,i)
									
		// 						};
		// 						dataFP.push(item4);					
		// 					}						
		// 					header.items.push(dataFP);

		// 				}	
		// 			}

		// 			if(self.ckPPH.selected == true){
		// 				var dataPPH = [];
		// 				for (var i = 0; i < self.sgAddPPH.getRowCount();i++){				
		// 					var item5 = {
		// 						no_urut : "5",
		// 						jenis :"PPH",
		// 						value1 : self.sgAddPPH.cells(0,i), 
		// 						value2 : self.sgAddPPH.cells(1,i),
		// 						value3 : nilaiToFloat(self.sgAddPPH.cells(2,i))
								
		// 					};
		// 					dataPPH.push(item5);					
		// 				}						
		// 				header.items.push(dataPPH);
		// 			}
										
		// 			if(self.ckPo.selected == true && self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != ""){
		// 				item6 = {
		// 					no_urut : "6",
		// 					jenis :"POSP",
		// 					value1 : nilaiToFloat(self.amountPo.getText()),
		// 					value2 : self.tahapPo.getText(),
		// 					value3 : self.nAman.getText()						
		// 				}
		// 				header.items.push(item6);
		// 			}

		// 			if(self.ckBaut.selected == true ){
		// 				var dataBaut = [];
		// 					for (var i = 0; i < self.sgAddBaut.getRowCount();i++){				
		// 						var item7 = {
		// 							no_urut : "7",
		// 							jenis :"BAP",
		// 							value1 : self.sgAddBaut.cells(0,i), 
		// 							value2 : self.sgAddBaut.cells(1,i)
									
		// 						};
		// 						dataBaut.push(item7);					
		// 					}						
		// 					header.items.push(dataBaut);
					
		// 			}

		// 			if(self.ckBast.selected == true){
		// 				var dataBast = [];
		// 				for (var i = 0; i < self.sgAddBast.getRowCount();i++){				
		// 					var item8 = {
		// 						no_urut : "8",
		// 						jenis :"BAST",
		// 						value1 : nilaiToFloat(self.sgAddBast.cells(0,i)), 
		// 						value2 : self.sgAddBast.cells(1,i),
		// 						value3 : self.sgAddBast.cells(2,i), 
		// 						value4 : self.sgAddBast.cells(3,i),
		// 						value5 : nilaiToFloat(self.sgAddBast.cells(4,i)), 
		// 						value6 : nilaiToFloat(self.sgAddBast.cells(5,i))
								
		// 					};
		// 					dataBast.push(item8);					
		// 				}						
		// 				header.items.push(dataBast);

					
		// 			}

				
					
		// 			if(self.ckNrRek.selected == true && self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != "" ){
		// 				item9 = {
		// 					no_urut : "9",
		// 					jenis :"RKN",
		// 					value1 : self.noRek.getText(),
		// 					value2 : self.bankRek.getText(),
		// 					value3 : self.aNamaRek.getText()
		// 					// value4 : self.nBrgRek.getText()
		// 				}
		// 				header.items.push(item9);
		// 			}	

				
		// 			if(self.ckJUM.selected == true ){
		// 				var dataJum = [];
		// 				for (var i = 0; i < self.sgAddJUM.getRowCount();i++){				
		// 					var item10 = {
		// 						no_urut : "10",
		// 						jenis :"JUM",
		// 						value1 : nilaiToFloat(self.sgAddJUM.cells(1,i)),
		// 						value2 : self.sgAddJUM.cells(2,i), 
		// 						value3 : self.sgAddJUM.cells(3,i),
		// 						value4 : self.sgAddJUM.cells(4,i),
		// 						value5 : self.sgAddJUM.cells(0,i)
		// 					};
		// 					dataJum.push(item10);					
		// 				}						
		// 				header.items.push(dataJum);
	
		// 			}	

		// 			if(self.ckJapel.selected == true ){
		// 				var dataJapel = [];
		// 				for (var i = 0; i < self.sgAddJapel.getRowCount();i++){				
		// 					var item11 = {
		// 						no_urut : "11",
		// 						jenis :"JAPEL",
		// 						value1 : nilaiToFloat(self.sgAddJapel.cells(0,i)), 
		// 						value2 : self.sgAddJapel.cells(1,i),
		// 						value3 : self.sgAddJapel.cells(2,i), 
		// 						value4 : self.sgAddJapel.cells(3,i)
								
		// 					};
		// 					dataJapel.push(item11);					
		// 				}						
		// 				header.items.push(dataJapel);

		// 			}

		// 			if(self.ckJapem.selected == true ){
		// 				var dataJapem = [];
		// 				for (var i = 0; i < self.sgAddJapem.getRowCount();i++){				
		// 					var item12 = {
		// 						no_urut : "12",
		// 						jenis :"BAP",
		// 						value1 : nilaiToFloat(self.sgAddJapem.cells(0,i)), 
		// 						value2 : self.sgAddJapem.cells(1,i),
		// 						value3 : self.sgAddJapem.cells(2,i), 
		// 						value4 : self.sgAddJapem.cells(3,i)
								
		// 					};
		// 					dataJapem.push(item12);					
		// 				}						
		// 				header.items.push(dataJapem);

		// 			}

		// 			if(self.ckPa.selected == true && self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != "" ){
		// 				item13 = {
		// 					no_urut : "13",
		// 					jenis :"PA",
		// 					value1 : self.amPa.getText(),
		// 					value2 : self.asPa.getText(),
		// 					value3 : self.tglPa.getText()
		// 				}
		// 				header.items.push(item13);
		// 			}
					
		// 			if(self.jenisvendor.getText() == "Dalam Negeri"){
		// 			if(self.ckTT.selected == true && self.noTT.getText() != "" && self.tglTT.getText() != "" ){
		// 				item14 = {
		// 					no_urut : "14",
		// 					jenis :"TTABD",
		// 					value1 : self.noTT.getText(),
		// 					value2 : self.tglTT.getText()
		// 				}
		// 				header.items.push(item14);
		// 			}
					
		// 			if(self.ckSIU.selected == true && self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != "" ){
		// 				item15 = {
		// 					no_urut : "15",
		// 					jenis :"SIUJK",
		// 					value1 : self.noSIU.getText(),
		// 					value2 : self.tglmSIU.getText(),
		// 					value3 : self.tglaSIU.getText()
		// 				}
		// 				header.items.push(item15);
		// 			}

		// 			if(self.ckNpwp.selected == true && self.noNpwp.getText() != "" && self.tglNpwp.getText() != "" ){
		// 				item16 = {
		// 					no_urut : "16",
		// 					jenis :"NPWP",
		// 					value1 : self.noNpwp.getText(),
		// 					value2 : self.tglNpwp.getText()
		// 				}	
		// 				header.items.push(item16);
		// 			}
		// 			}


		// 			if(self.jenisvendor.getText() == "Luar Negeri"){

		// 			if(self.ckForm.selected == true && self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != "" ){
		// 				item17 = {
		// 					no_urut : "17",
		// 					jenis :"FDGT",
		// 					value1 : self.noForm.getText(),
		// 					value2 : self.tglForm.getText(),
		// 					value3 : self.ngrForm.getText()
		// 				}
		// 				header.items.push(item17);
		// 			}

		// 			if(self.ckCod.selected == true && self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != "" ){
		// 				item18 = {
		// 					no_urut : "18",
		// 					jenis :"COD",
		// 					value1 : self.noCod.getText(),
		// 					value2 : self.tglCod.getText(),
		// 					value3 : self.ngrCod.getText()
		// 				}
		// 				header.items.push(item18);
		// 			}

		// 			}
					
		// 			if(self.ckCoo.selected == true && self.noCoo.getText() != "" && self.isCoo.getText() != "" ){
		// 				item19 = {
		// 					no_urut : "19",
		// 					jenis :"COO",
		// 					value1 : self.noCoo.getText(),
		// 					value2 : self.isCoo.getText()
		// 				}	
		// 				header.items.push(item19);
		// 			}

		// 			if(self.ckSL.selected == true && self.noSL.getText() != "" && self.tglSL.getText() != "" ){
		// 				item20 = {
		// 					no_urut : "20",
		// 					jenis :"SL",
		// 					value1 : self.noSL.getText(),
		// 					value2 : self.tglSL.getText()						
		// 				}	
		// 				header.items.push(item20);
		// 			}

		// 			if(self.ckDenda.selected == true && self.jmlDenda.getText() != "" && self.jmlHari.getText() != "" ){
		// 				item21 = {
		// 					no_urut : "21",
		// 					jenis :"DH",
		// 					value1 : self.jmlHari.getText(),
		// 					value2 : nilaiToFloat(self.jmlDenda.getText())	
		// 				}
		// 				header.items.push(item21);	
		// 			}	

		// 			if(self.ckProposal.selected == true && self.adaProposal.getText() != "" ){
		// 				item22 = {
		// 					no_urut : "22",
		// 					jenis :"PRP",
		// 					value1 : self.adaProposal.getText()
		// 				}
		// 				header.items.push(item22);	
		// 			}	
					
				
		// 			if(nilaiToFloat(self.totKP.getText()) > 0){
		// 				if(nilaiToFloat(self.totKP.getText()) != nilaiToFloat(self.ntagih.getText())){
		// 					var persamaan = "0";
		// 				}else{
		// 					var persamaan = "1";
		// 				}
		// 			}

		// 			//alert penyimpanan
		// 			if( self.nbayarcurr.getText() == "" || self.currbayar.getText() == ""){
		// 				system.alert(self, "Data Tidak Boleh Kosong");
		// 			}
					
		// 			else if(self.nbayar.getText() == "0" || self.nbayar.getText() == 0 ){
		// 				system.alert(self, "Nilai Bayar Harap Diisi");	
		// 			}
		// 			// else if(self.checkbox2.selected == false && self.checkbox1.selected == false ){
		// 			// 	system.alert(self, "Pilihan Kontrak/Nota Pesanan Harap Dipilih");	
		// 			// }
		// 			else if(self.ket.getText() == ""){
		// 				system.alert(self, "Keterangan Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.proyek.getText() == ""){
		// 				system.alert(self, "Nama Proyek Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.currpo.getText() == ""){
		// 				system.alert(self, "Currency Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.jenisvendor.getText() == ""){
		// 				system.alert(self, "Jenis Vendor Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.jenis_uang.getText() == ""){
		// 				system.alert(self, "Payment Method Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.jnsTrans.getText() == ""){
		// 				system.alert(self, "Jenis Transaksi Tidak Boleh Kosong");	
		// 			}
		// 			else if(self.kodeBA.getText() == ""){
		// 				system.alert(self, "Kode BA Tidak Boleh Kosong");	
		// 			}
		// 			//validasi 1
		// 			else if(self.ckStagih.selected == true && (self.noStagih.getText() == "" || self.tglDokStagih.getText() == "" || self.tglMasukStagih.getText() == "" )){
		// 				system.alert(self, "Inputan Checklist No 1 (SURAT TAGIHAN) Tidak Boleh Kosong");						
		// 			}					
		// 			// else if(self.ckInv.selected == true && (self.noInv.getText() == "" || self.tglDokInv.getText() == "" || self.tglMasukInv.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }
		// 			// else if(self.ckKP.selected == true && (self.amKP.getText() == "" || self.dppKP.getText() == "" || self.noKP.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }
		// 			// else if(self.ckFP.selected == true && (self.amFP.getText() == "" || self.wapuPPH.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }	
		// 			// else if(self.ckPPH.selected == true && (self.jenisPPH.getText() == "" || self.persenPPH.getText() == "" || self.amPPH.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
		// 			// }
		// 			else if(self.ckPo.selected == true && (self.amountPo.getText() == "" || self.tahapPo.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 6 (PO Awal Non PPN) Tidak Boleh Kosong");
		// 			}
		// 			// else if(self.ckBaut.selected == true && (self.noBaut.getText() == "" || self.tglBaut.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }else if(self.ckBast.selected == true && (self.amBast.getText() == "" || self.tglBast.getText() == "" || self.noMIGOBast.getText() == "" || self.noMIGOBast.getText() == "" || self.tanggal.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
					
		// 			else if(self.ckNrRek.selected == true && (self.noRek.getText() == "" || self.bankRek.getText() == "" || self.aNamaRek.getText() == "" )){
		// 				system.alert(self, "Inputan Checklist No 9 (Rekening) Tidak Boleh Kosong");
		// 			}
						
		// 			// else if(self.ckJUM.selected == true && (self.amJUM.getText() == "" || self.asJUM.getText() == "" || self.tglJUM.getText() == "" || self.noAsJUM.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
		// 			// else if(self.ckJapel.selected == true && (self.amJapel.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }else if(self.ckJapem.selected == true && (self.amJapem.getText() == "" )){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
					
		// 			else if(self.ckPa.selected == true && (self.amPa.getText() == "" || self.asPa.getText() == "" || self.tglPa.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 13 (POLIS ASURANSI) Tidak Boleh Kosong");
		// 			}else if(self.ckTT.selected == true && (self.noTT.getText() == "" || self.tglTT.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 14 (Tanda Terima As Build Draw) Tidak Boleh Kosong");
		// 			}else if(self.ckSIU.selected == true && (self.noSIU.getText() == "" || self.tglmSIU.getText() == "" || self.tglaSIU.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 15 (SIUJK) Tidak Boleh Kosong");
		// 			}else if(self.ckNpwp.selected == true && (self.noNpwp.getText() == "" || self.tglNpwp.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 16 (NPWP) Tidak Boleh Kosong");
		// 			}
		// 			// else if(self.ckForm.selected == true && (self.noForm.getText() == "" || self.tglForm.getText() == "" || self.ngrForm.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
		// 			// else if(self.ckCod.selected == true && (self.noCod.getText() == "" || self.tglCod.getText() == "" || self.ngrCod.getText() == "")){
		// 			// 	system.alert(self, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
		// 			// }
		// 			else if(self.ckCoo.selected == true && (self.noCoo.getText() == "" && self.isCoo.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 19 (CERT OF ORIGIN) Tidak Boleh Kosong");
		// 			}else if(self.ckSL.selected == true && (self.noSL.getText() == "" || self.tglSL.getText() == "")){
		// 				system.alert(self, "Inputan Checklist No 20 (SIDE LETTER) Tidak Boleh Kosong");
		// 			}else if(self.ckDenda.selected == true && ( self.jmlDenda.getText() == "" || self.jmlHari.getText() == "" )){
		// 				system.alert(self, "Inputan Checklist No 21 (DENDA-HARI) Tidak Boleh Kosong");
		// 			}
		// 			else if(self.ckProposal.selected == true && self.adaProposal.getText() == ""){
		// 				system.alert(self, "Inputan Checklist No 22 (PROPOSAL) Tidak Boleh Kosong");
		// 			}
					
		// 			else if(persamaan == "0"){
		// 				system.alert(this, "Nilai Tagihan Harus Sesuai Dengan Nilai Kwitansi + PPN");
		// 			}
		// 			else if(self.kat_dok.getText() == ""){
		// 				system.alert(self, "Kategori Tidak Boleh Kosong");	
		// 			}
					

		// 			else{
					
		// 				self.app.services.callServices("financial_Fca","saveEntDok1", [data,header,self.regid.getText(),self.nt.getText(),self.sts_baru.getText(),self.statusbaru.getText(),self.note1.getText(),self.app._lokasi,UM] ,function(data){
		// 					if (data == "process completed") {
		// 						system.info(self, data,"");
		// 						self.app._mainForm.bClear.click();
								
		// 						//hapus inputan
		// 						self.sgAdd1.setCell("");
		// 						self.kat_dok.setText("");
		// 						// self.sgAdd2.setCell("");
		// 						// self.sgAdd3.setCell("");
		// 						self.pUmum250.hide();
			
		// 						self.jenis_nilai.setText("");
		// 						self.jenis_dpp2.setText("");
		// 						self.jenis_dpp.setSelected(false);
		// 						self.sgAddPPH.setCell("");
		// 						self.note1.setText("");
		// 						self.mitra.setText("");
		// 						self.kdmitra.setText(""),
		// 						self.persen.setText("");
		// 						self.jnsTrans.getText(""),
		// 						self.proyek.setText("");
		// 						self.ket.setText("");
		// 						self.checkbox1.setSelected(false);
		// 						self.checkbox2.setSelected(false);
		// 						self.nokon.setText("");
		// 						self.jenisvendor.setText("");
		// 						self.tglkon.setText("");
		// 						self.currkon.setText("");
		// 						self.nilkon.setText("");
		// 						self.nopo.setText("");
		// 						self.tglpo.setText("");
		// 						self.currpo.setText("");
		// 						self.nilpo.setText("");
		// 						self.noaman.setText("");
		// 						self.tglaman.setText("");
		// 						self.curraman.setText("");
		// 						self.nilaman.setText("");
		// 						self.ntagih.setText("");
		// 						self.ntagihcurr.setText("");
		// 						self.currtagih.setText("");									
		// 						self.nbayar.setText("");
		// 						self.nbayarcurr.setText("");
		// 						self.currbayar.setText("");	
			
		// 						self.ckStagih.setSelected(false);
		// 						self.noStagih.setText("");
		// 						self.tglDokStagih.setText("");
		// 						self.tglMasukStagih.setText("");
			
		// 						self.ckInv.setSelected(false);
		// 						self.noInv.setText("");
		// 						self.tglDokInv.setText("");
		// 						self.tglMasukInv.setText("");
			
		// 						self.ckPo.setSelected(false);
		// 						self.amountPo.setText("");
		// 						self.tahapPo.setText("");
		// 						self.nAman.setText("");
			
		// 						self.ckBaut.setSelected(false);
		// 						self.noBaut.setText("");
		// 						self.tglBaut.setText("");
			
			
		// 						self.ckPPH.setSelected(false);
		// 						self.jenisPPH.setText("");
		// 						self.persenPPH.setText("");
		// 						self.amPPH.setText("");
		// 						self.wapuPPH.setText("");
			
		// 						self.ckBast.setSelected(false);
		// 						self.amBast.setText("");
		// 						self.tglBast.setText("");
		// 						self.noMIGOBast.setText("");
		// 						self.tanggal.setText("");
		// 						// self.nBrgBast.setText("");
		// 						// self.nJasaBast.setText("");
			
		// 						// self.ckPotum.setSelected(false);
		// 						// self.amPotum.setText("");
			
		// 						self.ckKP.setSelected(false);
		// 						self.amKP.setText("");
		// 						self.dppKP.setText("");
		// 						self.noKP.setText("");
			
		// 						self.ckNrRek.setSelected(false);
		// 						self.noRek.setText("");
		// 						self.bankRek.setText("");
		// 						self.aNamaRek.setText("");
		// 						// self.nBrgRek.setText("");
			
		// 						self.ckFP.setSelected(false);
		// 						self.amFP.setText("");
		// 						self.noFP.setText("");
		// 						self.tglFP.setText("");
			
		// 						self.ckJUM.setSelected(false);
		// 						self.nomJUM.setText("");
		// 						self.amJUM.setText("");
		// 						self.asJUM.setText("");
		// 						self.tglJUM.setText("");
		// 						self.noAsJUM.setText("");
			
		// 						self.ckJapel.setSelected(false);
		// 						self.amJapel.setText("");
		// 						self.asJapel.setText("");
		// 						self.tglJapel.setText("");
		// 						self.noAsJapel.setText("");
			
		// 						self.ckJapem.setSelected(false);
		// 						self.amJapem.setText("");
		// 						self.asJapem.setText("");
		// 						self.tglJapem.setText("");
		// 						self.noAsJapem.setText("");
			
		// 						self.ckPa.setSelected(false);
		// 						self.amPa.setText("");
		// 						self.asPa.setText("");
		// 						self.tglPa.setText("");
			
		// 						self.ckTT.setSelected(false);
		// 						self.noTT.setText("");
		// 						self.tglTT.setText("");
			
		// 						self.ckSIU.setSelected(false);
		// 						self.noSIU.setText("");
		// 						self.tglmSIU.setText("");
		// 						self.tglaSIU.setText("");
			
		// 						self.ckNpwp.setSelected(false);
		// 						self.noNpwp.setText("");
		// 						self.tglNpwp.setText("");
								
		// 						self.ckForm.setSelected(false);
		// 						self.noForm.setText("");
		// 						self.tglForm.setText("");
		// 						self.ngrForm.setText("");
			
		// 						self.ckCod.setSelected(false);
		// 						self.noCod.setText("");
		// 						self.tglCod.setText("");
		// 						self.ngrCod.setText("");
			
		// 						self.ckCoo.setSelected(false);
		// 						self.noCoo.setText("");
		// 						self.isCoo.setText("");
			
		// 						self.ckSL.setSelected(false);
		// 						self.noSL.setText("");
		// 						self.tglSL.setText("");
			
		// 						self.ckDenda.setSelected(false);
		// 						self.jmlDenda.setText("");
		// 						self.jmlHari.setText("");
			
		// 						self.ckProposal.setSelected(false);
		// 						self.adaProposal.setText("");
			
		// 						self.kdAkun.setText("");
		// 						self.cc.setText("");
		// 						self.keg.setText("");
		// 						self.termin.setText("");
		// 						self.jenis_uang.setText("");
		// 						self.jnsTrans.setText("");
		// 						self.kodeBA.setText("");
			
		// 						self.nt.setText("");
		// 						self.sts_baru.setText("");
			
		// 						// page = self.sg1.page;
		// 						// row = ((page-1) * self.sg1.rowPerPage)+row;
		// 						self.tab.setActivePage(self.tab.childPage[0]);
		// 						self.RefreshList();
			
		// 						self.app._mainForm.runTCODE("F0005");
								
		// 					}else {
		// 						system.alert(self, data,"");
		// 					}
		// 				});

		// 			}
		// 	}catch(e){
		// 		alert(e);
		// 	}
			
		// });
		this.sg1.on("cellclick", function(sender, col, row, data, id){
			try{
				if (id != undefined){
					 
					if (col == 10) {
						// self.pReject.show();
						// self.pReject.setArrowMode(2);
						// var node = sender.getCanvas();
						// self.pReject.setTop(node.offset().top + 20 );
						// self.pReject.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
						// self.pReject.getCanvas().fadeIn("slow");
						
						// // self.app.services.callServices("financial_Fca","sendWaktuRejOff",[self.sg1.cells(0, row),"1111"], function(data){
											
						// // });

						// self.bOkReject.on("click", function(){
						// 	self.app.services.callServices("financial_Fca","rejectOffCek", [self.sg1.cells(0, row),self.note.getText(),self.statusbaru.getText()] ,function(data){
						// 		if (data == "process completed") {
						// 			system.info(self, data,"");
						// 			self.app._mainForm.bClear.click();
						// 			self.RefreshList();
						// 			self.pReject.hide();
									
						// 		}else {
						// 			self.pReject.hide();
						// 			system.alert(self, data,"");
						// 		}
						// 	});	
						
						// });

					}
				
					if(col == 6){						
						page = self.sg1.page;
						row = ((page-1) * self.sg1.rowPerPage)+row;
						self.tab.setActivePage(self.tab.childPage[2]);
						self.app.services.callServices("financial_Fca","getCatatan",[self.sg1.cells(0,row)], function(data){
							self.messageContainer1.clearChild();
							$.each(data.draft, function(key, val){	
								new messagingViewItem(self.messageContainer1, {bound:[0,0, self.messageContainer1.width - 10,50], message:[val.nik, val.no_tagihan, val.tanggal, val.note]});
							});	
						});
					}

				}
				
				
			}catch(e){
				alert(e);
			}
		});	

		this.bFilter.on("click",function(sender){
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
		
		this.f1 = new saiLabelEdit(this.pSearch,{bound:[20,45,330,20],caption:"ID"});		
		this.f2 = new saiLabelEdit(this.pSearch,{bound:[20,70,330,20],caption:"Nama Vendor"});		
		// this.f3 = new saiLabelEdit(this.pSearch,{bound:[20,95,330,20],caption:"Nama Proyek"});
		// this.f4 = new saiLabelEdit(this.pSearch,{bound:[20,120,330,20],caption:"Nilai Tagihan",tipeText:ttNilai});

		this.f5 = new saiLabelEdit(this.pSearch,{bound:[20,20,200,20],caption:"Periode",placeHolder:"YYYYMM"});
		this.sd = new label(this.pSearch, {bound:[225,20,40,20], caption:"s/d", bold: true, fontSize:9});		
		this.f6 = new saiLabelEdit(this.pSearch,{bound:[250,20,100,20],caption:"",labelWidth:0,placeHolder:"YYYYMM"});

		this.bOk = new button(this.pSearch, {bound:[180, 195,80,20], caption:"Search", click:[this,"doChange"]});
		this.bOk.setIcon("icon/search3.png");
		this.bCancel = new button(this.pSearch, {bound:[270, 195,80,20], caption:"Cancel"});
		this.bCancel.setIcon("icon/application-exit2.png");
		this.bCancel.on("click", function(){
			self.pSearch.hide();
		});


		
		try {
			var self = this;

		

			self.app._mainForm.bSimpan.setCaption("Submit");
			self.on("close",function(){
				self.app._mainForm.dashboard.refreshList();
				self.app._mainForm.bSimpan.setCaption("Save");
				// alert("tutup");
			});
			
			self.sg1.clear(1);
			self.loadMonitoring({sts:"default"});
			self.jenis_dpp2.setText("gabung");

		
			
			self.ntagih.on("keyup", function(){
				self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText())));
				// if(nilaiToFloat(self.ntagih.getText()) > nilaiToFloat(self.titleCek3.getText())){
				// 	alert("Uang Tagihan Tidak Boleh Melebihi Sisa Tagihan");
				// 	self.ntagih.setText(0);
				// }else{
				// 	self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText())));
				// }
			});

			self.nilpo.on("keyup", function(){
				// self.amBast.setText(floatToNilai(nilaiToFloat(self.nilpo.getText())));
				// self.amJapem.setText(floatToNilai(Math.round(nilaiToFloat(self.amBast.getText())*5/100)));
				var pembagi = 100 + nilaiToFloat(self.persen.getText());
				self.dppKP.setText(floatToNilai(nilaiToFloat(self.nilpo.getText())));
				self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				if(self.persen.getText() != ""){
					// var persen = self.persen.getText() * nilaiToFloat(self.nilpo.getText()) / 100;
					// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
					var pembagi = 100 + nilaiToFloat(self.persen.getText());
					// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
					self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
				}	
				if(self.jenis_dpp.selected == false){
					var totpph = 0;
					if(self.sgAddPPH.getRowCount() != 0){
						for (var i = 0 ; i < self.sgAddPPH.getRowCount();i++){
							self.sgAddPPH.setCell(2,i,self.sgAddPPH.cells(1,i)*nilaiToFloat(self.nilpo.getText())/100);
							totpph += nilaiToFloat(self.sgAddPPH.cells(2, i));
							self.totPPH.setText(floatToNilai(nilaiToFloat(totpph)));
						}
					}
				}

				if(self.wapuPPH.getText()=="Wapu"){
					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
						}	
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText())  )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
							
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}

						}
					}
				}
				if(self.wapuPPH.getText()=="Non Wapu"){
					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));	
						}	
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}
						}
					}
				}
					
				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
				}	
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
				}	
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
				}	
			});
			

			self.nilkon.on("keyup", function(){
				// self.amJapel.setText(floatToNilai(nilaiToFloat(self.nilkon.getText())*5/100));
			});
			
			self.nilaman.on("keyup", function(){
				self.nAman.setText(floatToNilai(nilaiToFloat(self.nilaman.getText())));
				// self.amBast.setText(floatToNilai(nilaiToFloat(self.nilaman.getText())));
				// self.amJapem.setText(floatToNilai(Math.round(nilaiToFloat(self.amBast.getText())*5/100)));
				var pembagi = 100 + nilaiToFloat(self.persen.getText());
				self.dppKP.setText(floatToNilai(nilaiToFloat(self.nilaman.getText())));			
				self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				if(self.persen.getText() != ""){
					// var persen = self.persen.getText() * nilaiToFloat(self.nilaman.getText()) / 100;
					var pembagi = 100 + nilaiToFloat(self.persen.getText());
					// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));	
					self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
				}	
				if(self.nilaman.getText() == "0"){
					// self.amBast.setText(floatToNilai(nilaiToFloat(self.nilpo.getText())));
					// self.amJapem.setText(floatToNilai(Math.round(nilaiToFloat(self.amBast.getText())*5/100)));
					self.dppKP.setText(floatToNilai(nilaiToFloat(self.nilpo.getText())));
					self.amFP.setText(floatToNilai(10 / 100 * nilaiToFloat(self.dppKP.getText())));
				}	
				if(self.jenis_dpp.selected == false){
					if(self.sgAddPPH.getRowCount() != 0){
						var totpph = 0;
						for (var i = 0 ; i < self.sgAddPPH.getRowCount();i++){
							self.sgAddPPH.setCell(2,i,self.sgAddPPH.cells(1,i)*nilaiToFloat(self.nilaman.getText())/100);
							totpph += nilaiToFloat(self.sgAddPPH.cells(2, i));	
							self.totPPH.setText(floatToNilai(nilaiToFloat(totpph)));			
						}
					}
				}
				if(self.wapuPPH.getText()=="Wapu"){
					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
					// if(self.jmlHari.getText()==""){
					// 	self.jmlDenda.setText("");
					// 	self.nbayar.setText(
					// 		floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// 	);
					// }
					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));	
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							
						}	
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}
							
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) -  nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}
						}
					}
				}
				if(self.wapuPPH.getText()=="Non Wapu"){
					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	

							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));	
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
						}	
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}


							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}
				}

				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
				}	
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
				}	
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
				}	
			});
			
			

			self.persenPPH.on("keyup", function(){	
				if(self.jenis_dpp.selected == false){
					var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
					// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())*persenPPH));
					self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.totDPP.getText())*persenPPH)));	
				}
				if(self.jenis_dpp.selected == true){
					var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
					if(self.jenisPPH.getText() == "PPh 22"){
						self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.dppmaterial.getText())*persenPPH)));	
						// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppmaterial.getText())*persenPPH));
					}
					else if(self.jenisPPH.getText() == "PPh 23"){
						self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.dppjasa.getText())*persenPPH)));	
						// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppjasa.getText())*persenPPH));
					}
					else{
						self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.totDPP.getText())*persenPPH)));	
						// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())*persenPPH));	
					}
				}	
			});

			self.jmlHari.on("keyup", function(){
				self.jmlDenda.setText(floatToNilai(Math.round(2 * nilaiToFloat(self.jmlHari.getText()) * nilaiToFloat(self.nilkon.getText()) / 1000 )));
				if(self.wapuPPH.getText()=="Wapu"){
					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));	
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));	
						}	
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
					// if(self.jmlHari.getText()==""){
					// 	self.jmlDenda.setText("");
					// 	self.nbayar.setText(
					// 		floatToNilai(nilaiToFloat(self.dppKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// 	);
					// }
				}
				if(self.wapuPPH.getText()=="Non Wapu"){
					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));	
						}	
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							self.jmlDenda.setText("");
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}

					
					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
					// if(self.jmlHari.getText()==""){
					// 	self.jmlDenda.setText("");
					// 	self.nbayar.setText(
					// 		floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// 	);
					// }
				}

				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
				}	
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
				}	
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
				}	
			});


			self.dppmaterial.on("keyup", function(){
				// self.nBrgBast.setText(nilaiToFloat(self.dppmaterial.getText()));	
				// if(self.dppjasa.getText() == 0){
				// 	if(nilaiToFloat(self.dppmaterial.getText()) > nilaiToFloat(self.totDPP.getText())){
				// 		// system.alert(this, "Nilai Material Melebihi Jumlah DPP!");
				// 		self.dppmaterial.setText(0);
				// 	}
				// }else{
				// 	var tot = nilaiToFloat(self.dppjasa.getText()) + nilaiToFloat(self.dppmaterial.getText());
				// 	if(tot > nilaiToFloat(self.totDPP.getText())){
				// 		// system.alert(this, "Total Nilai Material & Jasa Melebihi DPP!");
				// 		self.dppmaterial.setText(0);
				// 	}
				// }

				if(self.jenis_dpp.selected == true){					
					if(self.sgAddPPH.getRowCount() == 0){
						var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
						if(self.jenisPPH.getText() == "PPh 22"){
							self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.dppmaterial.getText())*persenPPH)));	
							// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppmaterial.getText())*persenPPH));
						}
					}else{
						var totpph = 0;
						for (var i = 0 ; i < self.sgAddPPH.getRowCount();i++){
							if(self.sgAddPPH.cells(0,i) == "PPh 22"){
								self.sgAddPPH.setCell(2,i,self.dppmaterial.getText()*self.sgAddPPH.cells(1,i)/100);
							}
							totpph += nilaiToFloat(self.sgAddPPH.cells(2, i));	
							self.totPPH.setText(floatToNilai(nilaiToFloat(totpph)));
						}
					}
				}

			});

			self.dppjasa.on("keyup", function(){
				// self.nJasaBast.setText(nilaiToFloat(self.dppjasa.getText()));		
				// if(self.dppmaterial.getText() == 0){
				// 	if(nilaiToFloat(self.dppjasa.getText()) > nilaiToFloat(self.totDPP.getText())){
				// 		// system.alert(this, "Nilai Jasa Melebihi Jumlah DPP!");
				// 		self.dppjasa.setText(0);
				// 	}
				// }else{
				// 	var tot = nilaiToFloat(self.dppjasa.getText()) + nilaiToFloat(self.dppmaterial.getText());
				// 	if(tot > nilaiToFloat(self.totDPP.getText())){
				// 		// system.alert(this, "Total Nilai Material & Jasa Melebihi DPP!");
				// 		self.dppjasa.setText(0);
				// 	}
				// }

				if(self.jenis_dpp.selected == true){					
					if(self.sgAddPPH.getRowCount() == 0){
						var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
						if(self.jenisPPH.getText() == "PPh 23"){
							// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppjasa.getText())*persenPPH));
							self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.dppjasa.getText())*persenPPH)));	
						}
					}else{
						var totpph =0;
						for (var i = 0 ; i < self.sgAddPPH.getRowCount();i++){
							var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
							if(self.sgAddPPH.cells(0,i) == "PPh 23"){
								self.sgAddPPH.setCell(2,i,self.dppjasa.getText()*self.sgAddPPH.cells(1,i)/100);
							}
							totpph += nilaiToFloat(self.sgAddPPH.cells(2, i));	
							self.totPPH.setText(floatToNilai(nilaiToFloat(totpph)));
						}
					}
				}
			});
 
			
			

			//validasi checklist yg otomatis kecentang
			self.noStagih.on("keyup", function(){
				self.ckStagih.setSelected(true);
				// if(self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != "" ){
				// 	self.ckStagih.setSelected(true);
				// }else{
				// 	self.ckStagih.setSelected(false);
				// }
			});
			self.tglDokStagih.on("keyup", function(){
				self.ckStagih.setSelected(true);
				// if(self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != "" ){
				// 	self.ckStagih.setSelected(true);
				// }else{
				// 	self.ckStagih.setSelected(false);
				// }
			});
			self.tglMasukStagih.on("keyup", function(){
				self.ckStagih.setSelected(true);
				// if(self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != "" ){
				// 	self.ckStagih.setSelected(true);
				// }else{
				// 	self.ckStagih.setSelected(false);
				// }
			});

			self.noInv.on("keyup", function(){
				self.ckInv.setSelected(true);
				// if(self.noInv.getText() != "" && self.tglDokInv.getText() != "" && self.tglMasukInv.getText() != "" ){
				// 	self.ckInv.setSelected(true);
				// }else{
				// 	self.ckInv.setSelected(false);
				// }
			});
			self.tglDokInv.on("keyup", function(){
				self.ckInv.setSelected(true);
				// if(self.noInv.getText() != "" && self.tglDokInv.getText() != "" && self.tglMasukInv.getText() != "" ){
				// 	self.ckInv.setSelected(true);
				// }else{
				// 	self.ckInv.setSelected(false);
				// }
			});
			self.tglMasukInv.on("keyup", function(){
				self.ckInv.setSelected(true);
				// if(self.noInv.getText() != "" && self.tglDokInv.getText() != "" && self.tglMasukInv.getText() != "" ){
				// 	self.ckInv.setSelected(true);
				// }else{
				// 	self.ckInv.setSelected(false);
				// }
			});
			
			self.amountPo.on("keyup", function(){
				self.ckPo.setSelected(true);
				// if(self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != "" ){
				// 	self.ckPo.setSelected(true);
				// }else{
				// 	self.ckPo.setSelected(false);
				// }
			});

			self.tahapPo.on("keyup", function(){
				self.ckPo.setSelected(true);
				// if(self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != "" ){
				// 	self.ckPo.setSelected(true);
				// }else{
				// 	self.ckPo.setSelected(false);
				// }
			});

			self.nAman.on("keyup", function(){
				self.ckPo.setSelected(true);
				// if(self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != "" ){
				// 	self.ckPo.setSelected(true);
				// }else{
				// 	self.ckPo.setSelected(false);
				// }
			});

			
			self.noBaut.on("keyup", function(){
				self.ckBaut.setSelected(true);
				// if(self.noBaut.getText() != "" && self.tglBaut.getText() != ""){
				// 	self.ckBaut.setSelected(true);
				// }else{
				// 	self.ckBaut.setSelected(false);
				// }
			});
			self.tglBaut.on("keyup", function(){
				self.ckBaut.setSelected(true);
				// if(self.noBaut.getText() != "" && self.tglBaut.getText() != ""){
				// 	self.ckBaut.setSelected(true);
				// }else{
				// 	self.ckBaut.setSelected(false);
				// }
			});
			
			self.amBast.on("keyup", function(){
				self.ckBast.setSelected(true);
				// if(self.amBast.getText() != "" && self.tglBast.getText() != "" && self.noMIGOBast.getText() != "" && self.tanggal.getText() != "" && self.nBrgBast.getText() != "" && self.nJasaBast.getText() != ""){
				// 	self.ckBast.setSelected(true);
				// }else{
				// 	self.ckBast.setSelected(false);
				// }
			});
			self.tglBast.on("keyup", function(){
				self.ckBast.setSelected(true);
				// if(self.amBast.getText() != "" && self.tglBast.getText() != "" && self.noMIGOBast.getText() != "" && self.tanggal.getText() != "" && self.nBrgBast.getText() != "" && self.nJasaBast.getText() != ""){
				// 	self.ckBast.setSelected(true);
				// }else{
				// 	self.ckBast.setSelected(false);
				// }	
			});
			self.noMIGOBast.on("keyup", function(){
				self.ckBast.setSelected(true);
				// if(self.amBast.getText() != "" && self.tglBast.getText() != "" && self.noMIGOBast.getText() != "" && self.tanggal.getText() != "" && self.nBrgBast.getText() != "" && self.nJasaBast.getText() != ""){
				// 	self.ckBast.setSelected(true);
				// }else{
				// 	self.ckBast.setSelected(false);
				// }
			});
			self.tanggal.on("keyup", function(){
				self.ckBast.setSelected(true);
				// if(self.amBast.getText() != "" && self.tglBast.getText() != "" && self.noMIGOBast.getText() != "" && self.tanggal.getText() != "" && self.nBrgBast.getText() != "" && self.nJasaBast.getText() != ""){
				// 	self.ckBast.setSelected(true);
				// }else{
				// 	self.ckBast.setSelected(false);
				// }
			});
			
			
			// self.amPotum.on("keyup", function(){self.ckPotum.setSelected(true);});
			
			// self.persen.on("keyup", function(){
			// 	if(self.persen.getText() != "" && self.noKP.getText() != ""){
			// 		self.ckKP.setSelected(true);
			// 	}else{
			// 		self.ckKP.setSelected(false);
			// 	}
			// });

			// self.amKP.on("keyup", function(){self.ckKP.setSelected(true);});
			// self.dppKP.on("keyup", function(){self.ckBast.setSelected(true);});
			self.noKP.on("keyup", function(){
				self.ckKP.setSelected(true);
				// if(self.noKP.getText() != "" && self.tglKP.getText() != "" && self.persen.getText() != ""){
				// 	self.ckKP.setSelected(true);
				// }else{
				// 	self.ckKP.setSelected(false);
				// }
			});
			self.tglKP.on("keyup", function(){
				self.ckKP.setSelected(true);
				// if(self.noKP.getText() != "" && self.tglKP.getText() != "" && self.persen.getText() != ""){
				// 	self.ckKP.setSelected(true);
				// }else{
				// 	self.ckKP.setSelected(false);
				// }
			});

			

			self.persenPPH.on("keyup", function(){
				self.ckPPH.setSelected(true);				
			});
			
			
			self.noRek.on("keyup", function(){
				self.ckNrRek.setSelected(true);
				// if(self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != ""){
				// 	self.ckNrRek.setSelected(true);
				// }else{
				// 	self.ckNrRek.setSelected(false);
				// }
			});
			self.bankRek.on("keyup", function(){
				self.ckNrRek.setSelected(true);
				// if(self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != ""){
				// 	self.ckNrRek.setSelected(true);
				// }else{
				// 	self.ckNrRek.setSelected(false);
				// }
			});
			self.aNamaRek.on("keyup", function(){
				self.ckNrRek.setSelected(true);
				// if(self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != ""){
				// 	self.ckNrRek.setSelected(true);
				// }else{
				// 	self.ckNrRek.setSelected(false);
				// }
			});
			// self.nBrgRek.on("keyup", function(){self.ckNrRek.setSelected(true);});
			
			self.noFP.on("keyup", function(){
				self.ckFP.setSelected(true);
				// if(self.noFP.getText() != "" && self.amFP.getText() != "" && self.tglFP.getText() != "" && self.wapuPPH.getText() != ""){
				// 	self.ckFP.setSelected(true);
				// }else{
				// 	self.ckFP.setSelected(false);
				// }
			});
			self.amFP.on("keyup", function(){
				self.ckFP.setSelected(true);
				// if(self.noFP.getText() != "" && self.amFP.getText() != "" && self.tglFP.getText() != "" && self.wapuPPH.getText() != ""){
				// 	self.ckFP.setSelected(true);
				// }else{
				// 	self.ckFP.setSelected(false);
				// }
			});
			self.tglFP.on("keyup", function(){
				self.ckFP.setSelected(true);
				// if(self.noFP.getText() != "" && self.amFP.getText() != "" && self.tglFP.getText() != "" && self.wapuPPH.getText() != ""){
				// 	self.ckFP.setSelected(true);
				// }else{
				// 	self.ckFP.setSelected(false);
				// }
			});
			self.wapuPPH.on("keyup", function(){
				self.ckFP.setSelected(true);
				// if(self.noFP.getText() != "" && self.amFP.getText() != "" && self.tglFP.getText() != "" && self.wapuPPH.getText() != ""){
				// 	self.ckFP.setSelected(true);
				// }else{
				// 	self.ckFP.setSelected(false);
				// }
			});

			
			self.amJUM.on("keyup", function(){
				self.ckJUM.setSelected(true);
				// if(self.amJUM.getText() != "" && self.asJUM.getText() != "" && self.tglJUM.getText() != "" && self.noAsJUM.getText() != ""){
				// 	self.ckJUM.setSelected(true);
				// }else{
				// 	self.ckJUM.setSelected(false);
				// }
			});
			self.asJUM.on("keyup", function(){
				var node = self.asJUM.getCanvas();
				self.pAsuransi.setTop(node.offset().top + 20 );
				self.pAsuransi.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
				self.pAsuransi.show();		
				self.pAsuransi.getCanvas().fadeIn("slow");
				self.pAsuransi.getCanvas().fadeIn("slow");

				self.app.services.callServices("financial_Fca","searchAsuransiJUM",[self.asJUM.getText(),self.app._lokasi], function(data){				
					self.sgAsuransi.clear();
					$.each(data, function(key, val){
						self.sgAsuransi.addRowValues([val.value2]);
					});
				});

				self.ckJUM.setSelected(true);
				// if(self.amJUM.getText() != "" && self.asJUM.getText() != "" && self.tglJUM.getText() != "" && self.noAsJUM.getText() != ""){
				// 	self.ckJUM.setSelected(true);
				// }else{
				// 	self.ckJUM.setSelected(false);
				// }
			});
			self.tglJUM.on("keyup", function(){
				self.ckJUM.setSelected(true);
				// if(self.amJUM.getText() != "" && self.asJUM.getText() != "" && self.tglJUM.getText() != "" && self.noAsJUM.getText() != ""){
				// 	self.ckJUM.setSelected(true);
				// }else{
				// 	self.ckJUM.setSelected(false);
				// }
			});
			self.noAsJUM.on("keyup", function(){
				self.ckJUM.setSelected(true);
				// if(self.amJUM.getText() != "" && self.asJUM.getText() != "" && self.tglJUM.getText() != "" && self.noAsJUM.getText() != ""){
				// 	self.ckJUM.setSelected(true);
				// }else{
				// 	self.ckJUM.setSelected(false);
				// }
			});
			
			self.amJapel.on("keyup", function(){
				// self.ckJapel.setSelected(true);
				if(self.amJapel.getText() != "" && self.asJapel.getText() != "" && self.tglJapel.getText() != "" && self.noAsJapel.getText() != ""){
					self.ckJapel.setSelected(true);
				}else{
					self.ckJapel.setSelected(false);
				}
			});
			self.asJapel.on("keyup", function(){
				var node = self.asJapel.getCanvas();
				self.pAsuransi2.setTop(node.offset().top + 20 );
				self.pAsuransi2.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
				self.pAsuransi2.show();		
				self.pAsuransi2.getCanvas().fadeIn("slow");
				self.pAsuransi2.getCanvas().fadeIn("slow");

				self.app.services.callServices("financial_Fca","searchAsuransi",[self.asJapel.getText(),self.app._lokasi], function(data){				
					self.sgAsuransi2.clear();
					$.each(data, function(key, val){
						self.sgAsuransi2.addRowValues([val.value2]);
					});
				});

				// self.ckJapel.setSelected(true);
				if(self.amJapel.getText() != "" && self.asJapel.getText() != "" && self.tglJapel.getText() != "" && self.noAsJapel.getText() != ""){
					self.ckJapel.setSelected(true);
				}else{
					self.ckJapel.setSelected(false);
				}
			});
			self.tglJapel.on("keyup", function(){
				// self.ckJapel.setSelected(true);
				if(self.amJapel.getText() != "" && self.asJapel.getText() != "" && self.tglJapel.getText() != "" && self.noAsJapel.getText() != ""){
					self.ckJapel.setSelected(true);
				}else{
					self.ckJapel.setSelected(false);
				}
			});
			self.noAsJapel.on("keyup", function(){
				// self.ckJapel.setSelected(true);
				if(self.amJapel.getText() != "" && self.asJapel.getText() != "" && self.tglJapel.getText() != "" && self.noAsJapel.getText() != ""){
					self.ckJapel.setSelected(true);
				}else{
					self.ckJapel.setSelected(false);
				}
			});
			
			self.amJapem.on("keyup", function(){
				// self.ckJapem.setSelected(true);
				if(self.amJapem.getText() != "" && self.asJapem.getText() != "" && self.tglJapem.getText() != "" && self.noAsJapem.getText() != ""){
					self.ckJapem.setSelected(true);
				}else{
					self.ckJapem.setSelected(false);
				}
			});

			self.asJapem.on("keyup", function(){
				var node = self.asJapem.getCanvas();
				self.pAsuransi3.setTop(node.offset().top + 20 );
				self.pAsuransi3.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
				self.pAsuransi3.show();		
				self.pAsuransi3.getCanvas().fadeIn("slow");
				self.pAsuransi3.getCanvas().fadeIn("slow");

				self.app.services.callServices("financial_Fca","searchAsuransiJapem",[self.asJapem.getText(),self.app._lokasi], function(data){				
					self.sgAsuransi3.clear();
					$.each(data, function(key, val){
						self.sgAsuransi3.addRowValues([val.value2]);
					});
				});
				// self.ckJapem.setSelected(true);
				if(self.amJapem.getText() != "" && self.asJapem.getText() != "" && self.tglJapem.getText() != "" && self.noAsJapem.getText() != ""){
					self.ckJapem.setSelected(true);
				}else{
					self.ckJapem.setSelected(false);
				}
			});
			
			self.tglJapem.on("keyup", function(){
				// self.ckJapem.setSelected(true);
				if(self.amJapem.getText() != "" && self.asJapem.getText() != "" && self.tglJapem.getText() != "" && self.noAsJapem.getText() != ""){
					self.ckJapem.setSelected(true);
				}else{
					self.ckJapem.setSelected(false);
				}
			});
			self.noAsJapem.on("keyup", function(){
				// self.ckJapem.setSelected(true);
				if(self.amJapem.getText() != "" && self.asJapem.getText() != "" && self.tglJapem.getText() != "" && self.noAsJapem.getText() != ""){
					self.ckJapem.setSelected(true);
				}else{
					self.ckJapem.setSelected(false);
				}
			});
			
			self.amPa.on("keyup", function(){
				self.ckPa.setSelected(true);
				// if(self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != ""){
				// 	self.ckPa.setSelected(true);
				// }else{
				// 	self.ckPa.setSelected(false);
				// }
			});
			self.asPa.on("keyup", function(){
				var node = self.asPa.getCanvas();
				self.pAsuransi4.setTop(node.offset().top + 20 );
				self.pAsuransi4.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
				self.pAsuransi4.show();		
				self.pAsuransi4.getCanvas().fadeIn("slow");
				self.pAsuransi4.getCanvas().fadeIn("slow");

				self.app.services.callServices("financial_Fca","searchAsuransiPA",[self.asPa.getText(),self.app._lokasi], function(data){				
					self.sgAsuransi4.clear();
					$.each(data, function(key, val){
						self.sgAsuransi4.addRowValues([val.value2]);
					});
				});

				self.ckPa.setSelected(true);
				// if(self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != ""){
				// 	self.ckPa.setSelected(true);
				// }else{
				// 	self.ckPa.setSelected(false);
				// }
			});
			self.tglPa.on("keyup", function(){
				self.ckPa.setSelected(true);
				// if(self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != ""){
				// 	self.ckPa.setSelected(true);
				// }else{
				// 	self.ckPa.setSelected(false);
				// }
			});
			
			self.noTT.on("keyup", function(){
				self.ckTT.setSelected(true);
				// if(self.noTT.getText() != "" && self.tglTT.getText() != ""){
				// 	self.ckTT.setSelected(true);
				// }else{
				// 	self.ckTT.setSelected(false);
				// }
			});
			self.tglTT.on("keyup", function(){
				self.ckTT.setSelected(true);
				// if(self.noTT.getText() != "" && self.tglTT.getText() != ""){
				// 	self.ckTT.setSelected(true);
				// }else{
				// 	self.ckTT.setSelected(false);
				// }
			});
			
			self.noSIU.on("keyup", function(){
				self.ckSIU.setSelected(true);
				// if(self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != ""){
				// 	self.ckSIU.setSelected(true);
				// }else{
				// 	self.ckSIU.setSelected(false);
				// }
			});
			self.tglmSIU.on("keyup", function(){
				self.ckSIU.setSelected(true);
				// if(self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != ""){
				// 	self.ckSIU.setSelected(true);
				// }else{
				// 	self.ckSIU.setSelected(false);
				// }
			});
			self.tglaSIU.on("keyup", function(){
				self.ckSIU.setSelected(true);
				// if(self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != ""){
				// 	self.ckSIU.setSelected(true);
				// }else{
				// 	self.ckSIU.setSelected(false);
				// }
			});
			
			self.noNpwp.on("keyup", function(){
				self.ckNpwp.setSelected(true);
				// if(self.noNpwp.getText() != "" && self.tglNpwp.getText() != ""){
				// 	self.ckNpwp.setSelected(true);
				// }else{
				// 	self.ckNpwp.setSelected(false);
				// }
			});
			self.tglNpwp.on("keyup", function(){
				self.ckNpwp.setSelected(true);
				// if(self.noNpwp.getText() != "" && self.tglNpwp.getText() != ""){
				// 	self.ckNpwp.setSelected(true);
				// }else{
				// 	self.ckNpwp.setSelected(false);
				// }
			});
			
			self.noForm.on("keyup", function(){
				self.ckForm.setSelected(true);
				// if(self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != ""){
				// 	self.ckForm.setSelected(true);
				// }else{
				// 	self.ckForm.setSelected(false);
				// }
			});
			self.tglForm.on("keyup", function(){
				self.ckForm.setSelected(true);
				// if(self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != ""){
				// 	self.ckForm.setSelected(true);
				// }else{
				// 	self.ckForm.setSelected(false);
				// }
			});
			self.ngrForm.on("keyup", function(){
				self.ckForm.setSelected(true);
				// if(self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != ""){
				// 	self.ckForm.setSelected(true);
				// }else{
				// 	self.ckForm.setSelected(false);
				// }
			});

			self.noCod.on("keyup", function(){
				self.ckCod.setSelected(true);
				// if(self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != ""){
				// 	self.ckCod.setSelected(true);
				// }else{
				// 	self.ckCod.setSelected(false);
				// }
			});
			self.tglCod.on("keyup", function(){
				self.ckCod.setSelected(true);
				// if(self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != ""){
				// 	self.ckCod.setSelected(true);
				// }else{
				// 	self.ckCod.setSelected(false);
				// }
			});
			self.ngrCod.on("keyup", function(){
				self.ckCod.setSelected(true);
				// if(self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != ""){
				// 	self.ckCod.setSelected(true);
				// }else{
				// 	self.ckCod.setSelected(false);
				// }
			});
			
			self.noCoo.on("keyup", function(){
				self.ckCoo.setSelected(true);
				// if(self.noCoo.getText() != "" && self.isCoo.getText() != ""){
				// 	self.ckCoo.setSelected(true);
				// }else{
				// 	self.ckCoo.setSelected(false);
				// }
			});
			self.isCoo.on("keyup", function(){
				self.ckCoo.setSelected(true);
				// if(self.noCoo.getText() != "" && self.isCoo.getText() != ""){
				// 	self.ckCoo.setSelected(true);
				// }else{
				// 	self.ckCoo.setSelected(false);
				// }
			});
			
			self.noSL.on("keyup", function(){
				self.ckSL.setSelected(true);
				// if(self.noSL.getText() != "" && self.tglSL.getText() != ""){
				// 	self.ckSL.setSelected(true);
				// }else{
				// 	self.ckSL.setSelected(false);
				// }
			});
			self.tglSL.on("keyup", function(){
				self.ckSL.setSelected(true);
				// if(self.noSL.getText() != "" && self.tglSL.getText() != ""){
				// 	self.ckSL.setSelected(true);
				// }else{
				// 	self.ckSL.setSelected(false);
				// }
			});
			
			self.jmlHari.on("keyup", function(){
				self.ckDenda.setSelected(true);
				// if(self.jmlHari.getText() != "" && self.jmlDenda.getText() != ""){
				// 	self.ckDenda.setSelected(true);
				// }else{
				// 	self.ckDenda.setSelected(false);
				// }
			});
			self.jmlDenda.on("keyup", function(){
				self.ckDenda.setSelected(true);
				// if(self.jmlHari.getText() != "" && self.jmlDenda.getText() != ""){
				// 	self.ckDenda.setSelected(true);
				// }else{
				// 	self.ckDenda.setSelected(false);
				// }
			});

			self.sgAsuransi.on("dblClick", function(col, row, id){
				if(col == 0 ){
					self.asJUM.setText(self.sgAsuransi.cells(0, row));
					self.pAsuransi.hide();
				}
			});

			self.sgAsuransi2.on("dblClick", function(col, row, id){
				if(col == 0 ){
					self.asJapel.setText(self.sgAsuransi2.cells(0, row));
					self.pAsuransi2.hide();
				}
			});
	
			self.sgAsuransi3.on("dblClick", function(col, row, id){
				if(col == 0 ){
					self.asJapem.setText(self.sgAsuransi3.cells(0, row));
					self.pAsuransi3.hide();
				}
			});

			self.sgAsuransi4.on("dblClick", function(col, row, id){
				if(col == 0 ){
					self.asPa.setText(self.sgAsuransi4.cells(0, row));
					self.pAsuransi4.hide();
				}
			});

			
			this.kdAkun.setServices(this.app.servicesBpc, "callServices",["financial_Fca","getAkun",["",""]],["kode_akun","nama"],"kode_lokasi='"+self.app._lokasi+"'","Daftar Akun");
			var thn = parseFloat(self.app._periode.substr(0,4));
			this.keg.setServices(this.app.servicesBpc, "callServices",["financial_Fca","getListAct",["",""]],["kode_rkm","nama"],"kode_lokasi = '"+self.app._lokasi+"' and tahun = '"+thn+"'","Daftar Kegiatan");
		
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_fca_modul_fEntDokUbis.extend(window.childForm);
window.app_fca_modul_fEntDokUbis.implement({	
	
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
			system.confirm(this, "hapus", "Yakin data akan dihapus?","data yang sudah disimpan tidak bisa di<i>retrieve</i> lagi.");
	},
	addItemFile: function(file){
		var item = new listItemFileControl(this.listDokumen, {bound:[0,0, this.tab.width - 200,60], caption:["File: " + file.file_dok, file.nama]});
		item.bOpen.on("click", function(sender){
				window.open("server/bacaFile.php?action=read&no="+file.no_pdrk+"&nu="+file.no_urut);
		});
	},
	
	doPager: function(sender, page) {
		this.sg1.doSelectPage(page);
	},
	loadMonitoring: function(filter){
		try{
			var self  = this;
			
			self.app.services.callServices("financial_Fca","getListEntAdmin",[self.app._lokasi,self.fcbp], function(data){
				self.sg1.clear();
				$.each(data, function(key, val){
					if(val.stsd == "1111"){
						var status = "Reject";
						var note = "<center><i class='fa fa-file-text-o' style='color:tomato;margin-top:2px'> </i>";
						var reject = "-";
					}else if(val.stsd == null || val.stsd == 0){
						var status = "Waiting For Approval";
						var note = "-";
						var reject = "-";
					}	
					else if(val.stsd == "600"){
						var status = "Reject";
						var note = "<center><i class='fa fa-file-text-o' style='color:tomato;margin-top:2px'> </i>";
						var reject = "-";
					}	
					
					self.judul2.setCaption("No Tagihan : "+ val.no_tagihan);
					self.sg1.addRowValues([val.reg_id,val.kode_vendor, val.nama, val.kode_ubis, val.tgl, status,note]);
				});
			});
			
		}catch(e){
			console.log(e);
		}
	},
	simpan: function(row){
		try{
			
				try{					
					var self = this;

					if(this.checkbox1.selected == false && this.checkbox2.selected != false){
						var jenisCK = 'NP';
					}else if(this.checkbox2.selected == false && this.checkbox1.selected != false){
						var jenisCK = 'KT';
					}else if(this.checkbox1.selected == false && this.checkbox2.selected == false){
						var jenisCK = '';
					}

					// if(this.checkbox1.selected == false){
					if(this.totPPH.getText() == ""){
						var totalpph = 0;
					}else{
						var totalpph = nilaiToFloat(this.totPPH.getText());
					}

						var data = {					
							kode_ba : this.kodeBA.getText(),
							jns_trans : this.jnsTrans.getText(),
							kode_akun : this.kdAkun.getText(),
							kode_cc : this.cc.getText(),
							kode_rkm : this.keg.getText(),
							termin : this.termin.getText(),
							jenis_uang : this.jenis_uang.getText(),
							jenis_vendor : this.jenisvendor.getText(),
							
							kode_vendor : this.kdmitra.getText(),
							nama_vendor : this.mitra.getText(),
							reg_id : this.regid.getText(),
							nama_proyek : this.proyek.getText(), 
							keterangan : this.ket.getText(),
							jenis : jenisCK,							
							
							no_kontrak : this.nokon.getText(),
							tgl_kontrak : this.tglkon.getText(),
							curr_kontrak : this.currkon.getText(),
							nilai_kontrak : nilaiToFloat(this.nilkon.getText()),
	
							no_posp : this.nopo.getText(),
							tgl_posp : this.tglpo.getText(),
							curr_po : this.currpo.getText(),
							nilai_posp : nilaiToFloat(this.nilpo.getText()),
	
							no_amd : this.noaman.getText(),
							tgl_amd : this.tglaman.getText(),
							curr_amd : this.curraman.getText(),
							nilai_amd : this.nilaman.getText(),
	
							nilai_tagihan : nilaiToFloat(this.ntagih.getText()),
							nilai_curr : nilaiToFloat(this.ntagihcurr.getText()),
							curr : this.currtagih.getText(),
	
							nilai_bayar : nilaiToFloat(this.nbayar.getText()),
							nilai_bayar_curr : nilaiToFloat(this.nbayarcurr.getText()),
							curr_bayar : this.currbayar.getText(),
							
							jns_dpp : this.jenis_dpp2.getText(),
							jenis_nilai : this.jenis_nilai.getText(),

							tot_pph : totalpph,
							dppmaterial : nilaiToFloat(this.dppmaterial.getText()),
							dppjasa : nilaiToFloat(this.dppjasa.getText()),
							nilai_tagihan_asli : nilaiToFloat(this.ntagih2.getText()),
							persen_um : nilaiToFloat(this.totPerUM.getText()),
							nilai_um : nilaiToFloat(this.totUM.getText()),
							tot_fp : nilaiToFloat(this.totFP.getText()),
							tot_dpp : nilaiToFloat(this.totDPP.getText()),
							tot_kp : nilaiToFloat(this.totKP.getText()),

							am_bast :nilaiToFloat(this.totBast.getText()),							
							am_jum :nilaiToFloat(this.totJUM.getText()),
							am_japel :nilaiToFloat(this.totJapel.getText()),
							am_japem :nilaiToFloat(this.totJapem.getText()),

							note_petugas : this.notepetugas.getText(),

							kat_dok : this.kat_dok.getText()
						};
					
								
					/*tambahan uang muka*/
					var UM = {
						itemsUM : [],												
					}
					var dataUM = [];
					for (var i = 0; i < self.sgAddUM.getRowCount();i++){				
						var itemUM = {
							value1 : nilaiToFloat(self.sgAddUM.cells(0,i)),
							value2 : nilaiToFloat(self.sgAddUM.cells(1,i))
							
						};
						dataUM.push(itemUM);					
					}						
					UM.itemsUM.push(dataUM);
					////////////////////////////

					var header = {
						items : [],												
					}

					var uplVer = {
						itemsUpl : [],												
					}

					if(self.ckStagih.selected == true && self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != ""){
						/*checklist, fca_check_dok1*/
						item1 = {
							no_urut : "1",
							jenis : "ST",
							value1 : self.noStagih.getText(),
							value2 : self.tglDokStagih.getText(),
							value3 : self.tglMasukStagih.getText()	
						}
						header.items.push(item1);

						/*upload file, fca_check_upl*/
						var upl1 = "";
						var str = self.eFile1.getText();
						if(str.includes("akepath")){ 
							var upl1 = str.substring(12,1000);
						}else{						  
							var upl1 = str;					   
						}
						itemU1 = {
							no_urut : "1",
							jenis : "ST",
							file_upl : upl1
						}
						uplVer.itemsUpl.push(itemU1);
					}
					
				

					if(self.ckInv.selected == true){
						var dataInvoice = [];
						for (var i = 0; i < self.sgAddInvoice.getRowCount();i++){				
							var item2 = {
								no_urut : "2",
								jenis :"INV",
								value1 : self.sgAddInvoice.cells(0,i), 
								value2 : self.sgAddInvoice.cells(1,i),
								value3 : self.sgAddInvoice.cells(2,i)
							};
							dataInvoice.push(item2);					
						}						
						header.items.push(dataInvoice);

						/*upload file, fca_check_upl*/
						var upl2 = "";
						var str = self.eFile2.getText();
						if(str.includes("akepath")){ 
							var upl2 = str.substring(12,1000);
						}else{						  
							var upl2 = str;					   
						}
						itemU2 = {
							no_urut : "2",
							jenis : "INV",
							file_upl : upl2
						}
						uplVer.itemsUpl.push(itemU2);
						
					}	
					
					if(self.ckKP.selected == true){
							var dataKP = [];
							for (var i = 0; i < self.sgAddDPP.getRowCount();i++){				
								var item3 = {
									no_urut : "3",
									jenis :"KPPN",
									value1 : nilaiToFloat(self.sgAddDPP.cells(0,i)), 
									value2 : nilaiToFloat(self.sgAddDPP.cells(1,i)),
									value3 : nilaiToFloat(self.sgAddDPP.cells(2,i)),
									value4 : self.sgAddDPP.cells(3,i),
									value5 : self.sgAddDPP.cells(4,i)
									
								};
								dataKP.push(item3);					
							}						
							header.items.push(dataKP);

							/*upload file, fca_check_upl*/
							var upl3 = "";
							var str = self.eFile3.getText();
							if(str.includes("akepath")){ 
								var upl3 = str.substring(12,1000);
							}else{						  
								var upl3 = str;					   
							}
							itemU3 = {
								no_urut : "3",
								jenis : "KPPN",
								file_upl : upl3
							}
							uplVer.itemsUpl.push(itemU3);
			
					}	

					if(self.jenisvendor.getText() == "Dalam Negeri"){
						if(self.ckFP.selected == true  ){
							var dataFP = [];
							for (var i = 0; i < self.sgAddFP.getRowCount();i++){				
								var item4 = {
									no_urut : "4",
									jenis :"FP",
									value1 : self.sgAddFP.cells(0,i), 
									value2 : self.sgAddFP.cells(1,i),
									value3 : nilaiToFloat(self.sgAddFP.cells(2,i)),
									value4 : self.sgAddFP.cells(3,i)
									
								};
								dataFP.push(item4);					
							}						
							header.items.push(dataFP);

							/*upload file, fca_check_upl*/
							var upl4 = "";
							var str = self.eFile4.getText();
							if(str.includes("akepath")){ 
								var upl4 = str.substring(12,1000);
							}else{						  
								var upl4 = str;					   
							}
							itemU4 = {
								no_urut : "4",
								jenis : "FP",
								file_upl : upl4
							}
							uplVer.itemsUpl.push(itemU4);

						}	
					}

					if(self.ckPPH.selected == true){
						var dataPPH = [];
						for (var i = 0; i < self.sgAddPPH.getRowCount();i++){				
							var item5 = {
								no_urut : "5",
								jenis :"PPH",
								value1 : self.sgAddPPH.cells(0,i), 
								value2 : self.sgAddPPH.cells(1,i),
								value3 : nilaiToFloat(self.sgAddPPH.cells(2,i))
								
							};
							dataPPH.push(item5);					
						}						
						header.items.push(dataPPH);


						/*upload file, fca_check_upl*/
						var upl5 = "";
						var str = self.eFile5.getText();
						if(str.includes("akepath")){ 
							var upl5 = str.substring(12,1000);
						}else{						  
							var upl5 = str;					   
						}
						itemU5 = {
							no_urut : "5",
							jenis : "PPH",
							file_upl : upl5
						}
						uplVer.itemsUpl.push(itemU5);
					}
										
					if(self.ckPo.selected == true && self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != ""){
						item6 = {
							no_urut : "6",
							jenis :"POSP",
							value1 : nilaiToFloat(self.amountPo.getText()),
							value2 : self.tahapPo.getText(),
							value3 : self.nAman.getText()						
						}
						header.items.push(item6);

						/*upload file, fca_check_upl*/
						var upl6 = "";
						var str = self.eFile7.getText();
						if(str.includes("akepath")){ 
							var upl6 = str.substring(12,1000);
						}else{						  
							var upl6 = str;					   
						}
						itemU6 = {
							no_urut : "6",
							jenis : "POSP",
							file_upl : upl6
						}
						uplVer.itemsUpl.push(itemU6);
					}

					if(self.ckBaut.selected == true ){
						var dataBaut = [];
						for (var i = 0; i < self.sgAddBaut.getRowCount();i++){				
							var item7 = {
								no_urut : "7",
								jenis :"BAP",
								value1 : self.sgAddBaut.cells(0,i), 
								value2 : self.sgAddBaut.cells(1,i)
								
							};
							dataBaut.push(item7);					
						}						
						header.items.push(dataBaut);

						/*upload file, fca_check_upl*/
						var upl7 = "";
						var str = self.eFile8.getText();
						if(str.includes("akepath")){ 
							var upl7 = str.substring(12,1000);
						}else{						  
							var upl7 = str;					   
						}
						itemU7 = {
							no_urut : "7",
							jenis : "BAP",
							file_upl : upl7
						}
						uplVer.itemsUpl.push(itemU7);
			
					}

					if(self.ckBast.selected == true){
						var dataBast = [];
						for (var i = 0; i < self.sgAddBast.getRowCount();i++){				
							var item8 = {
								no_urut : "8",
								jenis :"BAST",
								value1 : nilaiToFloat(self.sgAddBast.cells(0,i)), 
								value2 : self.sgAddBast.cells(1,i),
								value3 : self.sgAddBast.cells(2,i), 
								value4 : self.sgAddBast.cells(3,i)
								
							};
							dataBast.push(item8);					
						}						
						header.items.push(dataBast);

						/*upload file, fca_check_upl*/
						var upl8 = "";
						var str = self.eFile9.getText();
						if(str.includes("akepath")){ 
							var upl8 = str.substring(12,1000);
						}else{						  
							var upl8 = str;					   
						}
						itemU8 = {
							no_urut : "8",
							jenis : "BAP",
							file_upl : upl8
						}
						uplVer.itemsUpl.push(itemU8);

					}

				
					
					if(self.ckNrRek.selected == true && self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != "" ){
						item9 = {
							no_urut : "9",
							jenis :"RKN",
							value1 : self.noRek.getText(),
							value2 : self.bankRek.getText(),
							value3 : self.aNamaRek.getText()
							// value4 : self.nBrgRek.getText()
						}
						header.items.push(item9);

						/*upload file, fca_check_upl*/
						var upl9 = "";
						var str = self.eFile10.getText();
						if(str.includes("akepath")){ 
							var upl9 = str.substring(12,1000);
						}else{						  
							var upl9 = str;					   
						}
						itemU9 = {
							no_urut : "9",
							jenis : "RKN",
							file_upl : upl9
						}
						uplVer.itemsUpl.push(itemU9);
					}	

				
					if(self.ckJUM.selected == true ){
						var dataJum = [];
						for (var i = 0; i < self.sgAddJUM.getRowCount();i++){				
							var item10 = {
								no_urut : "10",
								jenis :"JUM",
								value1 : nilaiToFloat(self.sgAddJUM.cells(1,i)),
								value2 : self.sgAddJUM.cells(2,i), 
								value3 : self.sgAddJUM.cells(3,i),
								value4 : self.sgAddJUM.cells(4,i),
								value5 : self.sgAddJUM.cells(0,i)
							};
							dataJum.push(item10);					
						}						
						header.items.push(dataJum);

						/*upload file, fca_check_upl*/
						var upl10 = "";
						var str = self.eFile11.getText();
						if(str.includes("akepath")){ 
							var upl10 = str.substring(12,1000);
						}else{						  
							var upl10 = str;					   
						}
						itemU10 = {
							no_urut : "10",
							jenis : "JUM",
							file_upl : upl10
						}
						uplVer.itemsUpl.push(itemU10);
					}	

					if(self.ckJapel.selected == true ){
						var dataJapel = [];
						for (var i = 0; i < self.sgAddJapel.getRowCount();i++){				
							var item11 = {
								no_urut : "11",
								jenis :"JAPEL",
								value1 : nilaiToFloat(self.sgAddJapel.cells(0,i)), 
								value2 : self.sgAddJapel.cells(1,i),
								value3 : self.sgAddJapel.cells(2,i), 
								value4 : self.sgAddJapel.cells(3,i)
								
							};
							dataJapel.push(item11);					
						}						
						header.items.push(dataJapel);

						/*upload file, fca_check_upl*/
						var upl11 = "";
						var str = self.eFile12.getText();
						if(str.includes("akepath")){ 
							var upl11 = str.substring(12,1000);
						}else{						  
							var upl11 = str;					   
						}
						itemU11 = {
							no_urut : "11",
							jenis : "JAPEL",
							file_upl : upl11
						}
						uplVer.itemsUpl.push(itemU11);
					}

					if(self.ckJapem.selected == true ){
						var dataJapem = [];
						for (var i = 0; i < self.sgAddJapem.getRowCount();i++){				
							var item12 = {
								no_urut : "12",
								jenis :"JAPEM",
								value1 : nilaiToFloat(self.sgAddJapem.cells(0,i)), 
								value2 : self.sgAddJapem.cells(1,i),
								value3 : self.sgAddJapem.cells(2,i), 
								value4 : self.sgAddJapem.cells(3,i)
								
							};
							dataJapem.push(item12);					
						}						
						header.items.push(dataJapem);

						/*upload file, fca_check_upl*/
						var upl12 = "";
						var str = self.eFile13.getText();
						if(str.includes("akepath")){ 
							var upl12 = str.substring(12,1000);
						}else{						  
							var upl12 = str;					   
						}
						itemU12 = {
							no_urut : "12",
							jenis : "JAPEM",
							file_upl : upl12
						}
						uplVer.itemsUpl.push(itemU12);

					}

					if(self.ckPa.selected == true && self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != "" ){
						item13 = {
							no_urut : "13",
							jenis :"PA",
							value1 : self.amPa.getText(),
							value2 : self.asPa.getText(),
							value3 : self.tglPa.getText()
						}
						header.items.push(item13);

						/*upload file, fca_check_upl*/
						var upl13 = "";
						var str = self.eFile14.getText();
						if(str.includes("akepath")){ 
							var upl13 = str.substring(12,1000);
						}else{						  
							var upl13 = str;					   
						}
						itemU13 = {
							no_urut : "13",
							jenis : "PA",
							file_upl : upl13
						}
						uplVer.itemsUpl.push(itemU13);
					}
					
					if(self.jenisvendor.getText() == "Dalam Negeri"){
						if(self.ckTT.selected == true && self.noTT.getText() != "" && self.tglTT.getText() != "" ){
							item14 = {
								no_urut : "14",
								jenis :"TTABD",
								value1 : self.noTT.getText(),
								value2 : self.tglTT.getText()
							}
							header.items.push(item14);

							/*upload file, fca_check_upl*/
							var upl14 = "";
							var str = self.eFile15.getText();
							if(str.includes("akepath")){ 
								var upl14 = str.substring(12,1000);
							}else{						  
								var upl14 = str;					   
							}
							itemU14 = {
								no_urut : "14",
								jenis : "TTABD",
								file_upl : upl14
							}
							uplVer.itemsUpl.push(itemU14);

						}
						
						if(self.ckSIU.selected == true && self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != "" ){
							item15 = {
								no_urut : "15",
								jenis :"SIUJK",
								value1 : self.noSIU.getText(),
								value2 : self.tglmSIU.getText(),
								value3 : self.tglaSIU.getText()
							}
							header.items.push(item15);

							/*upload file, fca_check_upl*/
							var upl15 = "";
							var str = self.eFile16.getText();
							if(str.includes("akepath")){ 
								var upl15 = str.substring(12,1000);
							}else{						  
								var upl15 = str;					   
							}
							itemU15 = {
								no_urut : "15",
								jenis : "SIUJK",
								file_upl : upl15
							}
							uplVer.itemsUpl.push(itemU15);
						}

						if(self.ckNpwp.selected == true && self.noNpwp.getText() != "" && self.tglNpwp.getText() != "" ){
							item16 = {
								no_urut : "16",
								jenis :"NPWP",
								value1 : self.noNpwp.getText(),
								value2 : self.tglNpwp.getText()
							}	
							header.items.push(item16);


							/*upload file, fca_check_upl*/
							var upl16 = "";
							var str = self.eFile17.getText();
							if(str.includes("akepath")){ 
								var upl16 = str.substring(12,1000);
							}else{						  
								var upl16 = str;					   
							}
							itemU16 = {
								no_urut : "16",
								jenis : "NPWP",
								file_upl : upl16
							}
							uplVer.itemsUpl.push(itemU16);
						}
					}


					if(self.jenisvendor.getText() == "Luar Negeri"){

						if(self.ckForm.selected == true && self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != "" ){
							item17 = {
								no_urut : "17",
								jenis :"FDGT",
								value1 : self.noForm.getText(),
								value2 : self.tglForm.getText(),
								value3 : self.ngrForm.getText()
							}
							header.items.push(item17);

							/*upload file, fca_check_upl*/
							var upl17 = "";
							var str = self.eFile17a.getText();
							if(str.includes("akepath")){ 
								var upl17 = str.substring(12,1000);
							}else{						  
								var upl17 = str;					   
							}
							itemU17 = {
								no_urut : "17",
								jenis : "FDGT",
								file_upl : upl17
							}
							uplVer.itemsUpl.push(itemU17);
						}

						if(self.ckCod.selected == true && self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != "" ){
							item18 = {
								no_urut : "18",
								jenis :"COD",
								value1 : self.noCod.getText(),
								value2 : self.tglCod.getText(),
								value3 : self.ngrCod.getText()
							}
							header.items.push(item18);

							/*upload file, fca_check_upl*/
							var upl18 = "";
							var str = self.eFile18.getText();
							if(str.includes("akepath")){ 
								var upl18 = str.substring(12,1000);
							}else{						  
								var upl18 = str;					   
							}
							itemU18 = {
								no_urut : "18",
								jenis : "COD",
								file_upl : upl18
							}
							uplVer.itemsUpl.push(itemU18);
						}
					}
					
					if(self.ckCoo.selected == true && self.noCoo.getText() != "" && self.isCoo.getText() != "" ){
						item19 = {
							no_urut : "19",
							jenis :"COO",
							value1 : self.noCoo.getText(),
							value2 : self.isCoo.getText()
						}	
						header.items.push(item19);

						/*upload file, fca_check_upl*/
						var upl19 = "";
						var str = self.eFile19.getText();
						if(str.includes("akepath")){ 
							var upl19 = str.substring(12,1000);
						}else{						  
							var upl19 = str;					   
						}
						itemU19 = {
							no_urut : "19",
							jenis : "COO",
							file_upl : upl19
						}
						uplVer.itemsUpl.push(itemU19);

					}

					if(self.ckSL.selected == true && self.noSL.getText() != "" && self.tglSL.getText() != "" ){
						item20 = {
							no_urut : "20",
							jenis :"SL",
							value1 : self.noSL.getText(),
							value2 : self.tglSL.getText()						
						}	
						header.items.push(item20);

						/*upload file, fca_check_upl*/
						var upl20 = "";
						var str = self.eFile20.getText();
						if(str.includes("akepath")){ 
							var upl20 = str.substring(12,1000);
						}else{						  
							var upl20 = str;					   
						}
						itemU20 = {
							no_urut : "20",
							jenis : "SL",
							file_upl : upl20
						}
						uplVer.itemsUpl.push(itemU20);
					}

					if(self.ckDenda.selected == true && self.jmlDenda.getText() != "" && self.jmlHari.getText() != "" ){
						item21 = {
							no_urut : "21",
							jenis :"DH",
							value1 : self.jmlHari.getText(),
							value2 : nilaiToFloat(self.jmlDenda.getText())	
						}
						header.items.push(item21);
						
						/*upload file, fca_check_upl*/
						var upl21 = "";
						var str = self.eFile21.getText();
						if(str.includes("akepath")){ 
							var upl21 = str.substring(12,1000);
						}else{						  
							var upl21 = str;					   
						}
						itemU21 = {
							no_urut : "21",
							jenis : "DH",
							file_upl : upl21
						}
						uplVer.itemsUpl.push(itemU21);
					}	

					if(self.ckProposal.selected == true && self.adaProposal.getText() != "" ){
						item22 = {
							no_urut : "22",
							jenis :"PRP",
							value1 : self.adaProposal.getText()
						}
						header.items.push(item22);	

						/*upload file, fca_check_upl*/
						var upl22 = "";
						var str = self.eFile22.getText();
						if(str.includes("akepath")){ 
							var upl22 = str.substring(12,1000);
						}else{						  
							var upl22 = str;					   
						}
						itemU22 = {
							no_urut : "22",
							jenis : "PRP",
							file_upl : upl22
						}
						uplVer.itemsUpl.push(itemU22);
					}	
				

					if(nilaiToFloat(this.totKP.getText()) > 0){
						if(nilaiToFloat(this.totKP.getText()) != nilaiToFloat(this.ntagih.getText())){
							var persamaan = "0";
						}else{
							var persamaan = "1";
						}
					}

					//alert penyimpanan
					if( this.nbayarcurr.getText() == "" || this.currbayar.getText() == ""){
						system.alert(this, "Data Tidak Boleh Kosong");
					}
					
					else if(this.nbayar.getText() == "0" || this.nbayar.getText() == 0 ){
						system.alert(self, "Nilai Bayar Harap Diisi");	
					}
					else if(this.checkbox2.selected == false && this.checkbox1.selected == false ){
						system.alert(this, "Pilihan Kontrak / Nota Pesanan Harap Dipilih");	
					}
					else if(this.checkbox2.selected == true && this.checkbox1.selected == true ){
						system.alert(this, "Harap Isi Salah Satu Antara Kontrak / Nota Pesanan");	
					}
					else if(this.ket.getText() == ""){
						system.alert(this, "Keterangan Tidak Boleh Kosong");	
					}
					else if(this.proyek.getText() == ""){
						system.alert(this, "Nama Proyek Tidak Boleh Kosong");	
					}
					else if(this.currpo.getText() == ""){
						system.alert(this, "Currency Tidak Boleh Kosong");	
					}
					else if(this.jenisvendor.getText() == ""){
						system.alert(this, "Jenis Vendor Tidak Boleh Kosong");	
					}
					else if(this.jenis_uang.getText() == ""){
						system.alert(this, "Payment Method Tidak Boleh Kosong");	
					}
					else if(this.jnsTrans.getText() == ""){
						system.alert(this, "Jenis Transaksi Tidak Boleh Kosong");	
					}
					else if(this.kodeBA.getText() == ""){
						system.alert(this, "Kode BA Tidak Boleh Kosong");	
					}
					//validasi 1
					else if(this.ckStagih.selected == true && (this.noStagih.getText() == "" || this.tglDokStagih.getText() == "" || this.tglMasukStagih.getText() == "" )){
						system.alert(this, "Inputan Checklist No 1 (SURAT TAGIHAN) Tidak Boleh Kosong");						
					}					
					// else if(this.ckInv.selected == true && (this.noInv.getText() == "" || this.tglDokInv.getText() == "" || this.tglMasukInv.getText() == "" )){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
					// }
					// else if(this.ckKP.selected == true && (this.amKP.getText() == "" || this.dppKP.getText() == "" || this.noKP.getText() == "" )){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
					// }
					// else if(this.ckFP.selected == true && (this.amFP.getText() == "" || this.wapuPPH.getText() == "")){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
					// }	
					// else if(this.ckPPH.selected == true && (this.jenisPPH.getText() == "" || this.persenPPH.getText() == "" || this.amPPH.getText() == "" )){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");						
					// }
					else if(this.ckPo.selected == true && (this.amountPo.getText() == "" || this.tahapPo.getText() == "")){
						system.alert(this, "Inputan Checklist No 6 (PO Awal Non PPN) Tidak Boleh Kosong");
					}
					// else if(this.ckBaut.selected == true && (this.noBaut.getText() == "" || this.tglBaut.getText() == "")){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }else if(this.ckBast.selected == true && (this.amBast.getText() == "" || this.tglBast.getText() == "" || this.noMIGOBast.getText() == "" || this.noMIGOBast.getText() == "" || this.tanggal.getText() == "" )){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }
					
					else if(this.ckNrRek.selected == true && (this.noRek.getText() == "" || this.bankRek.getText() == "" || this.aNamaRek.getText() == "" )){
						system.alert(this, "Inputan Checklist No 9 (Rekening) Tidak Boleh Kosong");
					}
						
					// else if(this.ckJUM.selected == true && (this.amJUM.getText() == "" || this.asJUM.getText() == "" || this.tglJUM.getText() == "" || this.noAsJUM.getText() == "")){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }
					// else if(this.ckJapel.selected == true && (this.amJapel.getText() == "" )){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }else if(this.ckJapem.selected == true && (this.amJapem.getText() == "" )){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }
					
					else if(this.ckPa.selected == true && (this.amPa.getText() == "" || this.asPa.getText() == "" || this.tglPa.getText() == "")){
						system.alert(this, "Inputan Checklist No 13 (POLIS ASURANSI) Tidak Boleh Kosong");
					}else if(this.ckTT.selected == true && (this.noTT.getText() == "" || this.tglTT.getText() == "")){
						system.alert(this, "Inputan Checklist No 14 (Tanda Terima As Build Draw) Tidak Boleh Kosong");
					}else if(this.ckSIU.selected == true && (this.noSIU.getText() == "" || this.tglmSIU.getText() == "" || this.tglaSIU.getText() == "")){
						system.alert(this, "Inputan Checklist No 15 (SIUJK) Tidak Boleh Kosong");
					}else if(this.ckNpwp.selected == true && (this.noNpwp.getText() == "" || this.tglNpwp.getText() == "")){
						system.alert(this, "Inputan Checklist No 16 (NPWP) Tidak Boleh Kosong");
					}
					// else if(this.ckForm.selected == true && (this.noForm.getText() == "" || this.tglForm.getText() == "" || this.ngrForm.getText() == "")){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }
					// else if(this.ckCod.selected == true && (this.noCod.getText() == "" || this.tglCod.getText() == "" || this.ngrCod.getText() == "")){
					// 	system.alert(this, "Inputan Pada Checkbox Yang Dipilih Tidak Boleh Kosong");
					// }
					else if(this.ckCoo.selected == true && (this.noCoo.getText() == "" && this.isCoo.getText() == "")){
						system.alert(this, "Inputan Checklist No 19 (CERT OF ORIGIN) Tidak Boleh Kosong");
					}else if(this.ckSL.selected == true && (this.noSL.getText() == "" || this.tglSL.getText() == "")){
						system.alert(this, "Inputan Checklist No 20 (SIDE LETTER) Tidak Boleh Kosong");
					}else if(this.ckDenda.selected == true && ( this.jmlDenda.getText() == "" || this.jmlHari.getText() == "" )){
						system.alert(this, "Inputan Checklist No 21 (DENDA-HARI) Tidak Boleh Kosong");
					}
					else if(this.ckProposal.selected == true && this.adaProposal.getText() == ""){
						system.alert(this, "Inputan Checklist No 22 (PROPOSAL) Tidak Boleh Kosong");
					}
					else if(persamaan == "0"){
						system.alert(this, "Nilai Tagihan Harus Sesuai Dengan Nilai Kwitansi + PPN");
					}
					else if(this.kat_dok.getText() == ""){
						system.alert(this, "Kategori Tidak Boleh Kosong");	
					}
					

					else{
					
						if(self.currpo.getText() == "IDR"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText());
						}else if(self.currpo.getText() == "USD"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText()) * 14709;
						}else if(self.currpo.getText() == "GBP"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText()) * 19156;
						}else if(self.currpo.getText() == "JPY"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText()) * 131;
						}else if(self.currpo.getText() == "SGD"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText()) * 10769;
						}else if(self.currpo.getText() == "EURO"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText() * 17210)
						}else if(self.currpo.getText() == "AUD"){
							$nilai_bayar_asli = nilaiToFloat(self.nbayar.getText() * 10609)
						}


						// console.log("isi det ver " + JSON.stringify(uplVer));

						self.app.services.callServices("financial_Fca","saveEntUbis", [data,header,self.regid.getText(),self.nt.getText(),self.sts_baru.getText(),self.statusbaru.getText(),self.note1.getText(),self.app._lokasi,UM, uplVer] ,function(data){
							if (data == "process completed") {
								system.info(self, data,"");
								self.app._mainForm.bClear.click();
								
								//hapus inputan
								self.sgAdd1.setCell("");
								self.kat_dok.setText("");
								
								self.sgAddInvoice.clear();
								self.sgAddDPP.clear();
								self.sgAddFP.clear();
								self.sgAddPPH.clear();
								self.sgAddUM.clear();
								self.sgAddBast.clear();
								self.sgAddBaut.clear();
								self.sgAddJUM.clear();
								self.sgAddJapel.clear();
								self.sgAddJapem.clear();
								self.totKP.setText("");
								self.totDPP.setText("");
								self.totFP.setText("");
								self.totPPH.setText("");
								self.totBast.setText("");
								self.totUM.setText("");
								self.totJapel.setText("");
								self.totJapem.setText("");
								// self.sgAdd2.setCell("");
								// self.sgAdd3.setCell("");

								self.jenis_nilai.setText("");
								self.jenis_dpp2.setText("");
								self.jenis_dpp.setSelected(false);
								self.sgAddPPH.setCell("");
								self.note1.setText("");
								self.mitra.setText("");
								self.kdmitra.setText(""),
								self.persen.setText("");
								self.jnsTrans.getText(""),
								self.proyek.setText("");
								self.ket.setText("");
								self.checkbox1.setSelected(false);
								self.checkbox2.setSelected(false);
								self.nokon.setText("");
								self.jenisvendor.setText("");
								self.tglkon.setText("");
								self.currkon.setText("");
								self.nilkon.setText("");
								self.nopo.setText("");
								self.tglpo.setText("");
								self.currpo.setText("");
								self.nilpo.setText("");
								self.noaman.setText("");
								self.tglaman.setText("");
								self.curraman.setText("");
								self.nilaman.setText("");
								self.ntagih.setText("");
								self.ntagihcurr.setText("");
								self.currtagih.setText("");									
								self.nbayar.setText("");
								self.nbayarcurr.setText("");
								self.currbayar.setText("");	

								self.ckStagih.setSelected(false);
								self.noStagih.setText("");
								self.tglDokStagih.setText("");
								self.tglMasukStagih.setText("");

								self.ckInv.setSelected(false);
								self.noInv.setText("");
								self.tglDokInv.setText("");
								self.tglMasukInv.setText("");

								self.ckPo.setSelected(false);
								self.amountPo.setText("");
								self.tahapPo.setText("");
								self.nAman.setText("");

								self.ckBaut.setSelected(false);
								self.noBaut.setText("");
								self.tglBaut.setText("");


								self.ckPPH.setSelected(false);
								self.jenisPPH.setText("");
								self.persenPPH.setText("");
								self.amPPH.setText("");
								self.wapuPPH.setText("");

								self.ckBast.setSelected(false);
								self.amBast.setText("");
								self.tglBast.setText("");
								self.noMIGOBast.setText("");
								self.tanggal.setText("");
								// self.nBrgBast.setText("");
								// self.nJasaBast.setText("");

								// self.ckPotum.setSelected(false);
								// self.amPotum.setText("");

								self.ckKP.setSelected(false);
								self.amKP.setText("");
								self.dppKP.setText("");
								self.noKP.setText("");

								self.ckNrRek.setSelected(false);
								self.noRek.setText("");
								self.bankRek.setText("");
								self.aNamaRek.setText("");
								// self.nBrgRek.setText("");

								self.ckFP.setSelected(false);
								self.amFP.setText("");
								self.noFP.setText("");
								self.tglFP.setText("");

								self.ckJUM.setSelected(false);
								self.nomJUM.setText("");
								self.amJUM.setText("");
								self.asJUM.setText("");
								self.tglJUM.setText("");
								self.noAsJUM.setText("");

								self.ckJapel.setSelected(false);
								self.amJapel.setText("");
								self.asJapel.setText("");
								self.tglJapel.setText("");
								self.noAsJapel.setText("");

								self.ckJapem.setSelected(false);
								self.amJapem.setText("");
								self.asJapem.setText("");
								self.tglJapem.setText("");
								self.noAsJapem.setText("");

								self.ckPa.setSelected(false);
								self.amPa.setText("");
								self.asPa.setText("");
								self.tglPa.setText("");

								self.ckTT.setSelected(false);
								self.noTT.setText("");
								self.tglTT.setText("");

								self.ckSIU.setSelected(false);
								self.noSIU.setText("");
								self.tglmSIU.setText("");
								self.tglaSIU.setText("");

								self.ckNpwp.setSelected(false);
								self.noNpwp.setText("");
								self.tglNpwp.setText("");
								
								self.ckForm.setSelected(false);
								self.noForm.setText("");
								self.tglForm.setText("");
								self.ngrForm.setText("");

								self.ckCod.setSelected(false);
								self.noCod.setText("");
								self.tglCod.setText("");
								self.ngrCod.setText("");

								self.ckCoo.setSelected(false);
								self.noCoo.setText("");
								self.isCoo.setText("");

								self.ckSL.setSelected(false);
								self.noSL.setText("");
								self.tglSL.setText("");

								self.ckDenda.setSelected(false);
								self.jmlDenda.setText("");
								self.jmlHari.setText("");

								self.ckProposal.setSelected(false);
								self.adaProposal.setText("");

								self.kdAkun.setText("");
								self.cc.setText("");
								self.keg.setText("");
								self.termin.setText("");
								self.jenis_uang.setText("");
								self.jnsTrans.setText("");
								self.kodeBA.setText("");

								self.nt.setText("");
								self.sts_baru.setText("");

								page = self.sg1.page;
								row = ((page-1) * self.sg1.rowPerPage)+row;
								self.tab.setActivePage(self.tab.childPage[0]);
								self.RefreshList();

								// self.app._mainForm.runTCODE("F0005");
								
							}else {
								system.alert(self, data,"");
							}
						});


						


					

						
					}
				}catch(e){
					system.alert(this, e,"");
				}
			
		}catch(e){
			systemAPI.alert(e);
		}
	},
	hapus: function(){
		try{
			if (this.checkEmptyByTag([0])){
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
	doDoubleClick: function(sender, col , row) {
		try{
			this.setActivePage(this.tab.childPage[1]);
		}catch(e){
			
		} 
	},
	doChange: function(sender, col, row){
		try{		
			if (sender == this.bOk){				
				var self = this;					
				if (self.f1.getText() == "" && self.f2.getText() == "" && self.f5.getText() == "" && self.f6.getText() == "" ){
						system.alert(self, "Inputan Tidak Boleh Kosong");
					}else{
						var self = this;	
						self.app.services.callServices("financial_Fca","searchEntUbis",[self.f1.getText(),self.f2.getText(),self.f5.getText(),self.f6.getText(),self.app._lokasi], function(data){
							self.sg1.clear(0);
								$.each(data, function(key, val){
									if(val.stsd == "1111"){
										var status = "Reject";
										var note = "<center><i class='fa fa-file-text-o' style='color:tomato;margin-top:2px'> </i>";
										var reject = "-";
									}else if(val.stsd == null || val.stsd == 0){
										var status = "Waiting For Approval";
										var note = "-";
										var reject = "-";
									}	
									else if(val.stsd == "600"){
										var status = "Reject";
										var note = "<center><i class='fa fa-file-text-o' style='color:tomato;margin-top:2px'> </i>";
										var reject = "-";
									}	
												
									self.judul2.setCaption("No Tagihan : "+ val.no_tagihan);
									self.sg1.addRowValues([val.reg_id,val.kode_vendor, val.nama, val.kode_ubis, val.tgl, status,note]);
								});
						});
						self.pSearch.hide();
						self.f1.setText("");						
						self.f2.setText("");
					
					}
			}

			if(sender == this.adaProposal){
				var self = this;
				if(self.adaProposal.getText() != ""){
					self.ckProposal.setSelected(true);
				}
			}
			if(sender == this.jenisPPH){
				var self = this;
				if(self.jenis_dpp.selected == false){
					var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
					// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())*persenPPH));	
					self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.totDPP.getText())*persenPPH)));
				}
				if(self.jenis_dpp.selected == true){
					var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
					if(self.jenisPPH.getText() == "PPh 22"){
						// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppmaterial.getText())*persenPPH));
						self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.dppmaterial.getText())*persenPPH)));
					}
					else if(self.jenisPPH.getText() == "PPh 23"){
						// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppjasa.getText())*persenPPH));
						self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.dppjasa.getText())*persenPPH)));
					}
					else{
						// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())*persenPPH));	
						self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.totDPP.getText())*persenPPH)));
					}	
				}

					
			}

			if(sender==this.jenis_dpp){
				var self=this;
				if(self.jenis_dpp.selected == false){
					self.jenis_dpp2.setText("gabung");
					self.dppmaterial.setVisible(false);					
					self.dppjasa.setVisible(false);
					var persenPPH = nilaiToFloat(self.persenPPH.getText()) / 100;
					// self.amPPH.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())*persenPPH));
					self.amPPH.setText(floatToNilai(Math.round(nilaiToFloat(self.totDPP.getText())*persenPPH)));	
				}
				if(self.jenis_dpp.selected == true){
					self.jenis_dpp2.setText("pisah");
					self.dppmaterial.setVisible(true);					
					self.dppjasa.setVisible(true);
				}
			}

			if(sender == this.jenis_nilai){
				var self=this;
				if(self.jenis_nilai.getText() == "Kontrak"){
					self.noaman.setVisible(false);
					self.tglaman.setVisible(false);
					self.curraman.setVisible(false);self.curraman.setVisible(false);
					self.nAman.setText(nilaiToFloat(0));
					self.nilaman.setVisible(false);
					self.nilaman.setText(0);
					self.nilkon.setVisible(true);

					self.persenUM.on("keyup", function(){
						var persenUM = nilaiToFloat(self.persenUM.getText()) / 100;
						self.nilaiUM.setText(floatToNilai(nilaiToFloat(self.nilkon.getText())*persenUM));	
					});
				}
				else if(self.jenis_nilai.getText() == "SP"){
					self.noaman.setVisible(false);
					self.tglaman.setVisible(false);
					self.curraman.setVisible(false);self.curraman.setVisible(false);
					self.nAman.setText(nilaiToFloat(0));
					self.nilaman.setVisible(false);
					// self.nilaman.setText(0);
					self.nilkon.setVisible(true);
					
					self.persenUM.on("keyup", function(){
						var persenUM = nilaiToFloat(self.persenUM.getText()) / 100;
						self.nilaiUM.setText(floatToNilai(nilaiToFloat(self.nilpo.getText())*persenUM));	
					});
				}
				else if(self.jenis_nilai.getText() == "Amandemen"){
					self.noaman.setVisible(true);
					self.tglaman.setVisible(true);
					self.curraman.setVisible(true);
					self.nAman.setText(floatToNilai(nilaiToFloat(self.nilkon.getText())));	
					self.nilaman.setVisible(true);
					// self.nilaman.setText("");	
					self.nilkon.setVisible(false);

					self.persenUM.on("keyup", function(){
						var persenUM = nilaiToFloat(self.persenUM.getText()) / 100;
						self.nilaiUM.setText(floatToNilai(nilaiToFloat(self.nilaman.getText())*persenUM));	
					});
				}
			}
			

			if(sender == this.persen){
				var self = this;
				if(self.noKP.getText() != "" && self.tglKP.getText() != ""){					
					self.ckKP.setSelected(true);
				}else{
					self.ckKP.setSelected(false);
				}
				if(self.persen.getText()=="1"){
					// var persen = 1 / 100 * nilaiToFloat(self.nilpo.getText());
					// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	

					// var pembagi = 100 + nilaiToFloat(self.persen.getText());
					self.amKP.setText(floatToNilai(Math.round(101 / 100 * nilaiToFloat(self.dppKP.getText()))));
					self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				}
				if(self.persen.getText()=="10"){
					// var persen = 10 / 100 * nilaiToFloat(self.nilpo.getText());
					// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
					self.amKP.setText(floatToNilai(Math.round(110 / 100 * nilaiToFloat(self.dppKP.getText()))));
					self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				}	
				
				var nilaipo = nilaiToFloat(self.nilpo.getText());
				var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
				var totalkwt = nilaipo + persenpo;
				// self.amJapem.setText(floatToNilai(5/100 * totalkwt));
				// self.amJapel.setText(floatToNilai(5/100 * totalkwt));
			}

			if(sender == this.noKP){
				var self = this;
				if(self.noKP.getText() != "" && self.tglKP.getText() != ""){					
					self.ckKP.setSelected(true);
				}else{
					self.ckKP.setSelected(false);
				}
				// if(self.persen.getText()=="1"){
				// 	var persen = 1 / 100 * nilaiToFloat(self.nilpo.getText());
				// 	self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
				// 	self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				// }
				// if(self.persen.getText()=="10"){
				// 	var persen = 10 / 100 * nilaiToFloat(self.nilpo.getText());
				// 	self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
				// 	self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				// }			
			}

			if(sender == this.tglKP){
				var self = this;
				if(self.noKP.getText() != "" && self.tglKP.getText() != ""){					
					self.ckKP.setSelected(true);
				}else{
					self.ckKP.setSelected(false);
				}
				// if(self.persen.getText()=="1"){
				// 	var persen = 1 / 100 * nilaiToFloat(self.nilpo.getText());
				// 	self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
				// 	self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				// }
				// if(self.persen.getText()=="10"){
				// 	var persen = 10 / 100 * nilaiToFloat(self.nilpo.getText());
				// 	self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
				// 	self.amFP.setText(floatToNilai((10 / 100 * nilaiToFloat(self.dppKP.getText()))));
				// }			
			}



			if (sender == this.nomJUM){
				var self = this;	
				if(self.nomJUM.getText() == "15"){				
					var nilaipo = nilaiToFloat(self.nilpo.getText());
					var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
					var totalkwt = nilaipo + persenpo;
					self.amJUM.setText(floatToNilai(totalkwt * 15 / 100));

					// self.amJUM.setText(floatToNilai(15/100*nilaiToFloat(self.nilkon.getText())));
				}
				if(self.nomJUM.getText() == "30"){
					var nilaipo = nilaiToFloat(self.nilpo.getText());
					var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
					var totalkwt = nilaipo + persenpo;
					self.amJUM.setText(floatToNilai(totalkwt * 30 / 100 ));
					// self.amJUM.setText(floatToNilai(nilaiToFloat(self.nilkon.getText()) * 30 / 100 ));
				}
				if(self.nomJUM.getText() == "45"){
					var nilaipo = nilaiToFloat(self.nilpo.getText());
					var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
					var totalkwt = nilaipo + persenpo;
					self.amJUM.setText(floatToNilai(totalkwt * 45 / 100 ));
					// self.amJUM.setText(floatToNilai(nilaiToFloat(self.nilkon.getText()) * 45 / 100 ));
				}
				if(self.nomJUM.getText() == "60"){
					var nilaipo = nilaiToFloat(self.nilpo.getText());
					var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
					var totalkwt = nilaipo + persenpo;
					self.amJUM.setText(floatToNilai(totalkwt * 60 / 100 ));
					// self.amJUM.setText(floatToNilai(nilaiToFloat(self.nilkon.getText()) * 60 / 100 ));
				}
				if(self.nomJUM.getText() == "75"){
					var nilaipo = nilaiToFloat(self.nilpo.getText());
					var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
					var totalkwt = nilaipo + persenpo;
					self.amJUM.setText(floatToNilai(totalkwt * 75 / 100 ));
					// self.amJUM.setText(floatToNilai(nilaiToFloat(self.nilkon.getText()) * 75 / 100 ));
				}
				if(self.nomJUM.getText() == "90"){
					var nilaipo = nilaiToFloat(self.nilpo.getText());
					var persenpo = nilaiToFloat(self.nilpo.getText()) * self.persen.getText() / 100;
					var totalkwt = nilaipo + persenpo;
					self.amJUM.setText(floatToNilai(totalkwt * 90 / 100 ));
					// self.amJUM.setText(floatToNilai(nilaiToFloat(self.nilkon.getText()) * 90 / 100 ));
				}
			}
			

			if(sender == this.jenisvendor){
				var self = this;
				if(self.jenisvendor.getText() == "Dalam Negeri"){
					self.Formalert.setVisible(true);
					self.Codalert.setVisible(true);
					self.up17a.setVisible(false);
					self.up18.setVisible(false);
					//form dgt 1
					self.lTitle17a.setVisible(false);
					self.ckForm.setVisible(false);
					self.noForm.setVisible(false);
					self.tglForm.setVisible(false);
					self.ngrForm.setVisible(false);
					//cert of dmomisili
					self.lTitle18.setVisible(false);
					self.ckCod.setVisible(false);
					self.noCod.setVisible(false);
					self.tglCod.setVisible(false);
					self.ngrCod.setVisible(false);
					
					//yg luar negri di munculin lagi
					//faktur pajak
					self.lTitle4.setVisible(true);
					self.FPalert.setVisible(false);
					self.ckFP.setVisible(true);
					self.amFP.setVisible(true);
					self.noFP.setVisible(true);
					self.tglFP.setVisible(true);
					//build draw
					self.lTitle15.setVisible(true);
					self.TTalert.setVisible(false);
					self.ckTT.setVisible(true);
					self.noTT.setVisible(true);
					self.tglTT.setVisible(true);
					//siujk
					self.lTitle16.setVisible(true);
					self.SIUalert.setVisible(false);
					self.ckSIU.setVisible(true);
					self.noSIU.setVisible(true);
					self.tglmSIU.setVisible(true);
					self.tglaSIU.setVisible(true);
					//npwp
					self.lTitle17.setVisible(true);
					self.NPWPalert.setVisible(false);
					self.ckNpwp.setVisible(true);
					self.noNpwp.setVisible(true);
					self.tglNpwp.setVisible(true);
				}
				if(self.jenisvendor.getText() == "Luar Negeri"){
					//faktur pajak
					self.lTitle4.setVisible(false);
					self.FPalert.setVisible(true);
					self.ckFP.setVisible(false);
					self.amFP.setVisible(false);
					self.noFP.setVisible(false);
					self.tglFP.setVisible(false);
					//build draw
					self.lTitle15.setVisible(false);
					self.TTalert.setVisible(true);
					self.ckTT.setVisible(false);
					self.noTT.setVisible(false);
					self.tglTT.setVisible(false);
					//siujk
					self.lTitle16.setVisible(false);
					self.SIUalert.setVisible(true);
					self.ckSIU.setVisible(false);
					self.noSIU.setVisible(false);
					self.tglmSIU.setVisible(false);
					self.tglaSIU.setVisible(false);
					//npwp
					self.lTitle17.setVisible(false);
					self.NPWPalert.setVisible(true);
					self.ckNpwp.setVisible(false);
					self.noNpwp.setVisible(false);
					self.tglNpwp.setVisible(false);

					//yg dalam negri di munculin kembali					
					//form dgt 1
					self.lTitle17a.setVisible(true);
					self.Formalert.setVisible(false);
					self.ckForm.setVisible(true);
					self.noForm.setVisible(true);
					self.tglForm.setVisible(true);
					self.ngrForm.setVisible(true);
					//cert of dmomisili
					
					self.lTitle18.setVisible(true);
					self.Codalert.setVisible(false);
					self.ckCod.setVisible(true);
					self.noCod.setVisible(true);
					self.tglCod.setVisible(true);
					self.ngrCod.setVisible(true);

					self.up17a.setVisible(true);
					self.up18.setVisible(true);

				}

			}


			if (sender == this.jenis_uang){
				var self = this;	
				if(self.jenis_uang.getText() == "Pembayaran Penuh" && (self.jenisvendor.getText() == "Luar Negeri" || self.jenisvendor.getText() == "Dalam Negeri") ){
					self.amJUM.setReadOnly(true);
					self.asJUM.setReadOnly(true);
					self.tglJUM.setReadOnly(true);
					self.noAsJUM.setReadOnly(true);
					self.amJUM.setText("");
					self.asJUM.setText("");
					self.tglJUM.setText("");
					self.noAsJUM.setText("");
					
					self.jumalert.setVisible(true);
					self.up11.setVisible(false);
					self.lTitle11.setVisible(false);
					
					self.nomJUM.setVisible(false);
					self.amJUM.setVisible(false);
					self.asJUM.setVisible(false);
					self.tglJUM.setVisible(false);
					self.noAsJUM.setVisible(false);
					self.ckJUM.setVisible(false);

					self.addJUM.setVisible(false);
					self.detJUM.setVisible(false);
					self.totJUM.setVisible(false);

					self.amJUM.setLeft(220);
					self.asJUM.setLeft(440);
					self.tglJUM.setLeft(660);
					self.noAsJUM.setLeft(880);
					
					

					self.persenUM.setVisible(false);
					self.nilaiUM.setVisible(false);
					self.addUM.setVisible(false);
					self.totUM.setVisible(false);
					self.detUM.setVisible(false);
				}
				if(self.jenis_uang.getText() == "Uang Muka" && (self.jenisvendor.getText() == "Luar Negeri" || self.jenisvendor.getText() == "Dalam Negeri")){
					self.jumalert.setVisible(false);
					self.up11.setVisible(true);
					self.lTitle11.setVisible(true);
					self.nomJUM.setVisible(true);
					self.amJUM.setVisible(true);
					self.asJUM.setVisible(true);
					self.tglJUM.setVisible(true);
					self.noAsJUM.setVisible(true);
					self.ckJUM.setVisible(true);

					self.addJUM.setVisible(true);
					self.detJUM.setVisible(true);
					self.totJUM.setVisible(true);

					self.asJUM.setReadOnly(false);
					self.tglJUM.setReadOnly(false);
					self.noAsJUM.setReadOnly(false);					
					
					self.nomJUM.setLeft(220);	
					self.amJUM.setLeft(440);
					self.asJUM.setLeft(660);
					self.tglJUM.setLeft(880);
					self.noAsJUM.setLeft(1100);	
					
					self.persenUM.setVisible(true);
					self.nilaiUM.setVisible(true);
					self.addUM.setVisible(true);
					self.totUM.setVisible(true);
					self.detUM.setVisible(true);

					// self.alert7.setVisible(true);
					// self.lTitle7.setVisible(false);
					// self.ckPo.setVisible(false);
					// self.amountPo.setVisible(false);
					// self.tahapPo.setVisible(false);
					// self.nAman.setVisible(false);

					// self.alert8.setVisible(true);	
					// self.lTitle8.setVisible(false);
					// self.ckBaut.setVisible(false);
					// self.noBaut.setVisible(false);
					// self.tglBaut.setVisible(false);

					// self.alert9.setVisible(true);
					// self.lTitle9.setVisible(false);
					// self.ckBast.setVisible(false);
					// self.amBast.setVisible(false);
					// self.tglBast.setVisible(false);
					// self.noMIGOBast.setVisible(false);
					// self.tanggal.setVisible(false);
					// self.nBrgBast.setVisible(false);
					// self.nJasaBast.setVisible(false);

					// self.alert13.setVisible(true);
					// self.lTitle13.setVisible(false);
					// self.ckJapem.setVisible(false);
					// self.amJapem.setVisible(false);
					// self.asJapem.setVisible(false);
					// self.tglJapem.setVisible(false);
					// self.noAsJapem.setVisible(false);

					// self.alert14.setVisible(true);
					// self.lTitle14.setVisible(false);
					// self.ckPa.setVisible(false);
					// self.amPa.setVisible(false);
					// self.asPa.setVisible(false);
					// self.tglPa.setVisible(false);

					// self.alert15.setVisible(true);
					// self.lTitle15.setVisible(false);
					// self.TTalert.setVisible(false);
					// self.ckTT.setVisible(false);
					// self.noTT.setVisible(false);
					// self.tglTT.setVisible(false);
					
					// self.alert16.setVisible(true);
					// self.lTitle16.setVisible(false);
					// self.SIUalert.setVisible(false);
					// self.ckSIU.setVisible(false);
					// self.noSIU.setVisible(false);
					// self.tglmSIU.setVisible(false);
					// self.tglaSIU.setVisible(false);

					// self.alert17.setVisible(true);
					// self.lTitle17.setVisible(false);
					// self.NPWPalert.setVisible(false);
					// self.ckNpwp.setVisible(false);
					// self.noNpwp.setVisible(false);
					// self.tglNpwp.setVisible(false);

					// self.alert17a.setVisible(true);
					// self.lTitle17a.setVisible(false);
					// self.Formalert.setVisible(false);
					// self.ckForm.setVisible(false);
					// self.noForm.setVisible(false);
					// self.tglForm.setVisible(false);
					// self.ngrForm.setVisible(false);

					// self.alert18.setVisible(true);
					// self.lTitle18.setVisible(false);
					// self.Codalert.setVisible(false);
					// self.ckCod.setVisible(false);
					// self.noCod.setVisible(false);
					// self.tglCod.setVisible(false);
					// self.ngrCod.setVisible(false);

					// self.alert19.setVisible(true);
					// self.lTitle19.setVisible(false);
					// self.ckCoo.setVisible(false);
					// self.noCoo.setVisible(false);
					// self.isCoo.setVisible(false);

					// self.alert20.setVisible(true);
					// self.lTitle20.setVisible(false);
					// self.ckSL.setVisible(false);
					// self.noSL.setVisible(false);
					// self.tglSL.setVisible(false);
					
					// self.alert21.setVisible(true);
					// self.lTitle21.setVisible(false);
					// self.ckDenda.setVisible(false);
					// self.jmlHari.setVisible(false);
					// self.jmlDenda.setVisible(false);

					// self.alert22.setVisible(true);
					// self.lTitle22.setVisible(false);
					// self.ckProposal.setVisible(false);
					// self.adaProposal.setVisible(false);
				}

				if(self.jenis_uang.getText() == "Termin"){
					self.persenUM.setVisible(false);
					self.nilaiUM.setVisible(false);
					self.addUM.setVisible(false);
					self.totUM.setVisible(false);
					self.detUM.setVisible(false);
				}
			}

			if (sender == this.currpo){
				var self = this;	
				if(self.currpo.getText() == "IDR"){	
					self.currkon.setText("IDR");
					self.curraman.setText("IDR");					
					self.currtagih.setText("IDR");
					self.currbayar.setText("IDR");
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");	
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");					
				}
				if(self.currpo.getText() == "JPY"){	
					self.currkon.setText("JPY");
					self.curraman.setText("JPY");					
					self.currtagih.setText("JPY");
					self.currbayar.setText("JPY");	
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");	
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");				
				}
				if(self.currpo.getText() == "SGD"){	
					self.currkon.setText("SGD");
					self.curraman.setText("SGD");					
					self.currtagih.setText("SGD");
					self.currbayar.setText("SGD");	
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");	
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");				
				}
				if(self.currpo.getText() == "GBP"){	
					self.currkon.setText("GBP");
					self.curraman.setText("GBP");					
					self.currtagih.setText("GBP");
					self.currbayar.setText("GBP");
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");	
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");					
				}
				if(self.currpo.getText() == "USD"){	
					self.currkon.setText("USD");
					self.curraman.setText("USD");					
					self.currtagih.setText("USD");
					self.currbayar.setText("USD");
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");
											
				}
				if(self.currpo.getText() == "EURO"){	
					self.currkon.setText("EURO");
					self.curraman.setText("EURO");					
					self.currtagih.setText("EURO");
					self.currbayar.setText("EURO");
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");
											
				}
				if(self.currpo.getText() == "AUD"){	
					self.currkon.setText("AUD");
					self.curraman.setText("AUD");					
					self.currtagih.setText("AUD");
					self.currbayar.setText("AUD");
					self.amKP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.dppKP.setCaption("DPP ("+this.currpo.getText()+")");
					self.amFP.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amPPH.setCaption("Amount ("+this.currpo.getText()+")");
					self.totPPH.setCaption("Total PPh ("+this.currpo.getText()+")");
					self.amountPo.setCaption("Amount ("+this.currpo.getText()+")");
					self.nAman.setCaption("Nil. Amand ("+this.currpo.getText()+")");		
					self.amBast.setCaption("Amount ("+this.currpo.getText()+")");	
					// self.nBrgBast.setCaption("Nilai Barang ("+this.currpo.getText()+")");	
					// self.nJasaBast.setCaption("Nilai Jasa ("+this.currpo.getText()+")");	
					self.amJUM.setCaption("Amount ("+this.currpo.getText()+")");	
					self.amJapel.setCaption("Amount ("+this.currpo.getText()+")");
					self.amJapem.setCaption("Amount ("+this.currpo.getText()+")");	
					self.jmlDenda.setCaption("Amount ("+this.currpo.getText()+")");
					self.nbayar.setCaption("Nilai Bayar ("+this.currpo.getText()+")");
											
				}
			}

			if (sender == this.currtagih){	
				var self = this;	
				var usd = 14709;
				var sgd = 10769;
				var jpy = 131;
				var gbp = 19156;
				var euro = 17210;
				var aud = 10609;
								
				if(self.currtagih.getText() == "IDR"){	
					self.ntagihcurr.setText(0);		
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText())));
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(0);		
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText())));	
					});		
				}
				if(self.currtagih.getText() == "USD"){	
					var usd2 = 14709;
					self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * usd2));
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * usd2));		
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * usd));
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * usd));	
					});							
							
				}
				if(self.currtagih.getText() == "GBP"){	
					var gbp2 = 19156;
					self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * gbp2));
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * gbp2));	
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * gbp));	
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * gbp));	
					
					});								
				}
				if(self.currtagih.getText() == "JPY"){	
					var jpy2 = 131;
					self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * jpy2));
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * jpy2));	
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * jpy));	
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * jpy));	
					});									
				}
				if(self.currtagih.getText() == "SGD"){
					var sgd2 = 10769;	
					self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * sgd2));
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * sgd2));	
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * sgd));	
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * sgd));	
					});									
				}
				if(self.currtagih.getText() == "EURO"){
					var euro2 = 17210;	
					self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * euro2));
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * euro2));	
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * euro));	
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * euro));	
					});									
				}
				if(self.currtagih.getText() == "AUD"){
					var aud2 = 10609;	
					self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * aud2));
					self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * aud2));	
					self.ntagih.on("keyup", function(){
						self.ntagihcurr.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * aud));	
						self.ntagih2.setText(floatToNilai(nilaiToFloat(self.ntagih.getText()) * aud));	
					});									
				}
			}

			
			if (sender == this.currbayar){	
				var self = this;	
				var usd = 14709;
				var sgd = 10769;
				var jpy = 131;
				var gbp = 19156;
				var euro = 17210;
				var aud = 10609;
								
				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
					self.nbayar.on("keyup", function(){
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd));	
					});										
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
					self.nbayar.on("keyup", function(){
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp));	
					});										
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
					self.nbayar.on("keyup", function(){
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy));	
					});										
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
					self.nbayar.on("keyup", function(){
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd));	
					});										
				}
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
					self.nbayar.on("keyup", function(){
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro));	
					});										
				}
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
					self.nbayar.on("keyup", function(){
						self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud));	
					});										
				}
			}


			if(sender == this.wapuPPH){				
				var self = this;
				if(self.wapuPPH.getText() == "Wapu" ){
					if(self.noFP.getText() != "" || self.tglFP.getText() != ""){
						self.ckFP.setSelected(true)
					}

					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));	
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
							
						}	
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText())  )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText())  )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText()) ;
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}

				}
				if(self.wapuPPH.getText() == "Non Wapu"){
					if(self.noFP.getText() != "" || self.tglFP.getText() != ""){
						self.ckFP.setSelected(true)
					}

					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));	
						}	
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}


							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText())  )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}


							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}


							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}

					// if(self.jmlHari.getText() == ""){
					// 	self.nbayar.setText(
					// 		floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// 	);	
					// }else{
					// 	self.nbayar.setText(
					// 		floatToNilai(nilaiToFloat(self.amKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// 	);	
					// }
				}

				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
				}	
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
				}	
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
				}	
			}

			if(sender == this.jmlHari){				
				var self = this;
				if(self.wapuPPH.getText() == "Wapu" ){
					if(self.noFP.getText() != "" || self.tglFP.getText() != ""){
						self.ckFP.setSelected(true)
					}

					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
						}	
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}


							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}

				}
				if(self.wapuPPH.getText() == "Non Wapu"){
					if(self.noFP.getText() != "" || self.tglFP.getText() != ""){
						self.ckFP.setSelected(true)
					}

					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
						}	
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText())  )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}
				}

				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
				}	
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
				}	
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
				}	
			}

			if(sender == this.jmlDenda){				
				var self = this;
				if(self.wapuPPH.getText() == "Wapu" ){
					if(self.noFP.getText() != "" || self.tglFP.getText() != ""){
						self.ckFP.setSelected(true)
					}

					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));	
						}	
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}
							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}

				}
				if(self.wapuPPH.getText() == "Non Wapu"){
					if(self.noFP.getText() != "" || self.tglFP.getText() != ""){
						self.ckFP.setSelected(true)
					}

					if(self.jenis_uang.getText() == "Uang Muka"){
						self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
						if(self.persen.getText() != ""){
							// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
							// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));
							var pembagi = 100 + nilaiToFloat(self.persen.getText());
							// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));	
							self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
						}	
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText())  )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
							// );
						}
					}else if (self.jenis_uang.getText() == "Termin"){
						var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
						if(self.jmlHari.getText() == ""){
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
								);
							}

							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
							// );
						}else{
							if(self.totPPH.getText() == ""){
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}else{
								self.nbayar.setText(
									floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
								);
							}


							// self.nbayar.setText(
							// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
							// );
						}
					}
				}

				if(self.currbayar.getText() == "IDR"){	
					self.nbayarcurr.setText(0);		
				}
				if(self.currbayar.getText() == "USD"){	
					var usd2 = 14709;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
				}
				if(self.currbayar.getText() == "GBP"){	
					var gbp2 = 19156;
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
				}
				if(self.currbayar.getText() == "JPY"){
					var jpy2 = 131;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
				}
				if(self.currbayar.getText() == "SGD"){
					var sgd2 = 10769;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
				}
				if(self.currbayar.getText() == "EURO"){
					var euro2 = 17210;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
				}	
				if(self.currbayar.getText() == "AUD"){
					var aud2 = 10609;	
					self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
				}	
			}
			
			
			

			if (sender == this.cek2){
				var self = this;					
					if (self.nokon.getText() == ""){
						system.alert(self, "No Kontrak Tidak Boleh Kosong");
					}else{
						var self = this;
						self.sgCek.clear();
						self.app.services.callServices("financial_Fca","getUM",[this.nokon.getText(),self.app._lokasi], function(data){
							console.log(JSON.stringify(data.jumlah));
							if(data.jumlah == 0){
								self.pRelated.hide();
								system.alert(self, "Nomor Kontrak Tidak Ditemukan.");
							}else{
								self.pRelated.show();
								self.pRelated.setArrowMode(2);
								var node = sender.getCanvas();
								self.pRelated.setTop(100);
								self.pRelated.setLeft(20);	
								self.pRelated.getCanvas().fadeIn("slow");
								$.each(data.draft, function(key, val){
									if(val.jenis_uang == "Uang Muka"){
										var nominal = val.uang_muka;
									}else if(val.jenis_uang == "Termin"){
										var nominal = val.nilai_tagihan;
									}
									self.sgCek.addRowValues([val.no_tagihan, val.deskripsi, val.jenis_uang, val.termin, val.persen_um+"%", nominal, val.pot_um, val.pph, val.nilai_bayar, val.saldo_utang, val.saldo_um]);	
								});		
							}
						});

						this.app.services.callServices("financial_Fca","getUM1",[this.nokon.getText(),self.app._lokasi], function(data){
							if(data.jumlah == 0){
								// self.pRelated.hide();
							}else{
								self.kd_vendor.setText(data.nilai_posp.kode_vendor);
								self.nm_vendor.setText(data.nilai_posp.nama);
								self.no_kon.setText(data.nilai_posp.no_kontrak);
								self.titleCek1.setText(floatToNilai(data.nilai_posp.nilai_posp));								
								self.titleCek2.setText(floatToNilai(data.total_tagihan.total_tagihan));
								self.titleCek3.setText(floatToNilai(nilaiToFloat(data.nilai_posp.nilai_posp) - nilaiToFloat(data.total_tagihan.total_tagihan)));
								if(nilaiToFloat(data.nilai_posp.nilai_posp) - nilaiToFloat(data.total_tagihan.total_tagihan) != 0){
									self.titleCek4.setText("Open");
								}else{
									self.titleCek4.setText("Close");
								}
							}
						});
						// this.app.services.callServices("financial_Fca","getNoKontrak",[this.nokon.getText(),self.app._lokasi], function(data){
						// 	console.log(JSON.stringify(data.jumlah));
						// 	if(data.jumlah == 0){
						// 		self.pRelated.hide();
						// 		system.alert(self, "Data Tidak Ditemukan");
						// 	}else{
						// 		self.pRelated.show();
						// 		self.pRelated.setArrowMode(2);
						// 		var node = sender.getCanvas();
						// 		self.pRelated.setTop(20 );
						// 		self.pRelated.setLeft(node.offset().left + (node.width() / 2 ) - 150);	
						// 		self.pRelated.getCanvas().fadeIn("slow");
						// 		$.each(data.draft, function(key, val){
						// 			self.sgCek.addRowValues([val.no_kontrak,val.no_tagihan,val.kode_vendor,val.nama,val.nama_proyek,val.jenis_uang,val.termin, val.nilai_tagihan]);	
						// 		});		
						// 	}
						// });

						// this.app.services.callServices("financial_Fca","getNoKontrak1",[this.nokon.getText(),self.app._lokasi], function(data){
						// 	if(data.jumlah == 0){
						// 		self.pRelated.hide();
						// 		// system.alert(self, "Silahkan Masukan No Kontrak Lain");
						// 	}else{
						// 		self.titleCek1.setText(floatToNilai(data.nilai_posp.nilai_posp));								
						// 		self.titleCek2.setText(floatToNilai(data.total_tagihan.total_tagihan));
						// 		self.titleCek3.setText(floatToNilai(nilaiToFloat(data.nilai_posp.nilai_posp) - nilaiToFloat(data.total_tagihan.total_tagihan)));
						// 		if(nilaiToFloat(data.nilai_posp.nilai_posp) - nilaiToFloat(data.total_tagihan.total_tagihan) != 0){
						// 			self.titleCek4.setText("Open");
						// 		}else{
						// 			self.titleCek4.setText("Close");
						// 		}
						// 	}
						// });
					}
			}

			if (sender == this.det1){
				var self = this;					
					if (self.nokon.getText() == ""){
						system.alert(self, "No Kontrak Tidak Boleh Kosong");
					}else{
						var self = this;
						this.app.services.callServices("financial_Fca","getDetInv",[this.nokon.getText()], function(data){
							
							if(data.jumlah == 0){
								self.pDet1.hide();
								system.alert(self, "data not found");
							}else{
								$.each(data.draft, function(key, val){
									self.sgAdd1.addRowValues([val.no_kontrak,val.value2,val.termin]);	
								});		
							}
						});
					}
			}

			
			if (sender == this.bSaveAsDraft){ 
			
				var self = this;
				self.confirm("Draft Dokumen","Yakin Simpan Dokumen Sebagai Draft?", function(result){
					if(self.checkbox1.selected == false && self.checkbox2.selected != false){
						var jenisCK = 'NP';
					}else if(self.checkbox2.selected == false && self.checkbox1.selected != false){
						var jenisCK = 'KT';
					}else if(self.checkbox1.selected == false && self.checkbox2.selected == false){
						var jenisCK = '';
					}

					// if(self.checkbox1.selected == false){
						if(self.totPPH.getText() == ""){
							var totalpph = 0;
						}else{
							var totalpph = nilaiToFloat(self.totPPH.getText());
						}

						var data = {	
							kode_ba : self.kodeBA.getText(),
							jns_trans : self.jnsTrans.getText(),
							kode_akun : self.kdAkun.getText(),
							kode_cc : self.cc.getText(),
							kode_rkm : self.keg.getText(),
							termin : self.termin.getText(),
							jenis_uang : self.jenis_uang.getText(),
							jenis_vendor : self.jenisvendor.getText(),

							kode_vendor : self.kdmitra.getText(),
							nama_vendor : self.mitra.getText(),
							reg_id : self.regid.getText(),
							nama_proyek : self.proyek.getText(), 
							keterangan : self.ket.getText(),
							jenis : jenisCK,							
							
							no_kontrak : self.nokon.getText(),
							tgl_kontrak : self.tglkon.getText(),
							curr_kontrak : self.currkon.getText(),
							nilai_kontrak : nilaiToFloat(self.nilkon.getText()),
	
							no_posp : self.nopo.getText(),
							tgl_posp : self.tglpo.getText(),
							curr_po : self.currpo.getText(),
							nilai_posp : nilaiToFloat(self.nilpo.getText()),
	
							no_amd : self.noaman.getText(),
							tgl_amd : self.tglaman.getText(),
							curr_amd : self.curraman.getText(),
							nilai_amd : self.nilaman.getText(),
	
							nilai_tagihan : nilaiToFloat(self.ntagih.getText()),
							nilai_curr : nilaiToFloat(self.ntagihcurr.getText()),
							curr : self.currtagih.getText(),
	
							nilai_bayar : nilaiToFloat(self.nbayar.getText()),
							nilai_bayar_curr : nilaiToFloat(self.nbayarcurr.getText()),
							curr_bayar : self.currbayar.getText(),
							
							jns_dpp : self.jenis_dpp2.getText(),
							jenis_nilai : self.jenis_nilai.getText(),

							tot_pph : totalpph,
							dppmaterial : nilaiToFloat(self.dppmaterial.getText()),
							dppjasa : nilaiToFloat(self.dppjasa.getText()),
							nilai_tagihan_asli : nilaiToFloat(self.ntagih2.getText()),

							persen_um : nilaiToFloat(self.totPerUM.getText()),
							nilai_um : nilaiToFloat(self.totUM.getText()),
							tot_fp : nilaiToFloat(self.totFP.getText()),
							tot_dpp : nilaiToFloat(self.totDPP.getText()),
							tot_kp : nilaiToFloat(self.totKP.getText()),

							am_bast :nilaiToFloat(self.totBast.getText()),							
							am_jum :nilaiToFloat(self.totJUM.getText()),
							am_japel :nilaiToFloat(self.totJapel.getText()),
							am_japem :nilaiToFloat(self.totJapem.getText()),

							note_petugas : self.notepetugas.getText(),

							kat_dok : self.kat_dok.getText()
						};
										
				
					/*tambahan uang muka*/
					var UM = {
						itemsUM : [],												
					}
					var dataUM = [];
					for (var i = 0; i < self.sgAddUM.getRowCount();i++){				
						var itemUM = {
							value1 : nilaiToFloat(self.sgAddUM.cells(0,i)),
							value2 : nilaiToFloat(self.sgAddUM.cells(1,i))
							
						};
						dataUM.push(itemUM);					
					}						
					UM.itemsUM.push(dataUM);
					////////////////////////////

					var header = {
						items : [],												
					}

					var uplVer = {
						itemsUpl : [],												
					}

					if(self.ckStagih.selected == true && self.noStagih.getText() != "" && self.tglDokStagih.getText() != "" && self.tglMasukStagih.getText() != ""){
						item1 = {
							no_urut : "1",
							jenis : "ST",
							value1 : self.noStagih.getText(),
							value2 : self.tglDokStagih.getText(),
							value3 : self.tglMasukStagih.getText()	
						}
						header.items.push(item1);

						/*upload file, fca_check_upl*/
						var upl1 = "";
						var str = self.eFile1.getText();
						if(str.includes("akepath")){ 
							var upl1 = str.substring(12,1000);
						}else{						  
							var upl1 = str;					   
						}
						itemU1 = {
							no_urut : "1",
							jenis : "ST",
							file_upl : upl1
						}
						uplVer.itemsUpl.push(itemU1);
					}
					
				

					if(self.ckInv.selected == true){
						var dataInvoice = [];
						for (var i = 0; i < self.sgAddInvoice.getRowCount();i++){				
							var item2 = {
								no_urut : "2",
								jenis :"INV",
								value1 : self.sgAddInvoice.cells(0,i), 
								value2 : self.sgAddInvoice.cells(1,i),
								value3 : self.sgAddInvoice.cells(2,i)
							};
							dataInvoice.push(item2);					
						}						
						header.items.push(dataInvoice);

						/*upload file, fca_check_upl*/
						var upl2 = "";
						var str = self.eFile2.getText();
						if(str.includes("akepath")){ 
							var upl2 = str.substring(12,1000);
						}else{						  
							var upl2 = str;					   
						}
						itemU2 = {
							no_urut : "2",
							jenis : "INV",
							file_upl : upl2
						}
						uplVer.itemsUpl.push(itemU2);
						
					}	
					
					if(self.ckKP.selected == true ){
						var dataKP = [];
						for (var i = 0; i < self.sgAddDPP.getRowCount();i++){				
							var item3 = {
								no_urut : "3",
								jenis :"KPPN",
								value1 : nilaiToFloat(self.sgAddDPP.cells(0,i)), 
								value2 : nilaiToFloat(self.sgAddDPP.cells(1,i)),
								value3 : nilaiToFloat(self.sgAddDPP.cells(2,i)),
								value4 : self.sgAddDPP.cells(3,i),
								value5 : self.sgAddDPP.cells(4,i)
								
							};
							dataKP.push(item3);					
						}						
						header.items.push(dataKP);

						/*upload file, fca_check_upl*/
						var upl3 = "";
						var str = self.eFile3.getText();
						if(str.includes("akepath")){ 
							var upl3 = str.substring(12,1000);
						}else{						  
							var upl3 = str;					   
						}
						itemU3 = {
							no_urut : "3",
							jenis : "KPPN",
							file_upl : upl3
						}
						uplVer.itemsUpl.push(itemU3);

					}	

					if(self.jenisvendor.getText() == "Dalam Negeri"){
						if(self.ckFP.selected == true ){
							var dataFP = [];
							for (var i = 0; i < self.sgAddFP.getRowCount();i++){				
								var item4 = {
									no_urut : "4",
									jenis :"FP",
									value1 : self.sgAddFP.cells(0,i), 
									value2 : self.sgAddFP.cells(1,i),
									value3 : nilaiToFloat(self.sgAddFP.cells(2,i)),
									value4 : self.sgAddFP.cells(3,i)
									
								};
								dataFP.push(item4);					
							}						
							header.items.push(dataFP);

							/*upload file, fca_check_upl*/
							var upl4 = "";
							var str = self.eFile4.getText();
							if(str.includes("akepath")){ 
								var upl4 = str.substring(12,1000);
							}else{						  
								var upl4 = str;					   
							}
							itemU4 = {
								no_urut : "4",
								jenis : "FP",
								file_upl : upl4
							}
							uplVer.itemsUpl.push(itemU4);
		
						
						}	
					}

					if(self.ckPPH.selected == true){
						
						var dataPPH = [];
						for (var i = 0; i < self.sgAddPPH.getRowCount();i++){				
							var item5 = {
								no_urut : "5",
								jenis :"PPH",
								value1 : self.sgAddPPH.cells(0,i), 
								value2 : self.sgAddPPH.cells(1,i),
								value3 : nilaiToFloat(self.sgAddPPH.cells(2,i))
								
							};
							dataPPH.push(item5);					
						}						
						header.items.push(dataPPH);

						/*upload file, fca_check_upl*/
						var upl5 = "";
						var str = self.eFile5.getText();
						if(str.includes("akepath")){ 
							var upl5 = str.substring(12,1000);
						}else{						  
							var upl5 = str;					   
						}
						itemU5 = {
							no_urut : "5",
							jenis : "PPH",
							file_upl : upl5
						}
						uplVer.itemsUpl.push(itemU5);
					
					}
										
					if(self.ckPo.selected == true && self.amountPo.getText() != "" && self.tahapPo.getText() != "" && self.nAman.getText() != ""){
						item6 = {
							no_urut : "6",
							jenis :"POSP",
							value1 : nilaiToFloat(self.amountPo.getText()),
							value2 : self.tahapPo.getText(),
							value3 : self.nAman.getText()						
						}
						header.items.push(item6);

						/*upload file, fca_check_upl*/
						var upl6 = "";
						var str = self.eFile7.getText();
						if(str.includes("akepath")){ 
							var upl6 = str.substring(12,1000);
						}else{						  
							var upl6 = str;					   
						}
						itemU6 = {
							no_urut : "6",
							jenis : "POSP",
							file_upl : upl6
						}
						uplVer.itemsUpl.push(itemU6);
					}

					if(self.ckBaut.selected == true ){
						var dataBaut = [];
						for (var i = 0; i < self.sgAddBaut.getRowCount();i++){				
							var item7 = {
								no_urut : "7",
								jenis :"BAP",
								value1 : self.sgAddBaut.cells(0,i), 
								value2 : self.sgAddBaut.cells(1,i)
								
							};
							dataBaut.push(item7);					
						}						
						header.items.push(dataBaut);

						/*upload file, fca_check_upl*/
						var upl7 = "";
						var str = self.eFile8.getText();
						if(str.includes("akepath")){ 
							var upl7 = str.substring(12,1000);
						}else{						  
							var upl7 = str;					   
						}
						itemU7 = {
							no_urut : "7",
							jenis : "BAP",
							file_upl : upl7
						}
						uplVer.itemsUpl.push(itemU7);
				
					}

					if(self.ckBast.selected == true){
						var dataBast = [];
						for (var i = 0; i < self.sgAddBast.getRowCount();i++){				
							var item8 = {
								no_urut : "8",
								jenis :"BAST",
								value1 : nilaiToFloat(self.sgAddBast.cells(0,i)), 
								value2 : self.sgAddBast.cells(1,i),
								value3 : self.sgAddBast.cells(2,i), 
								value4 : self.sgAddBast.cells(3,i)
							};
							dataBast.push(item8);					
						}						
						header.items.push(dataBast);

						/*upload file, fca_check_upl*/
						var upl8 = "";
						var str = self.eFile9.getText();
						if(str.includes("akepath")){ 
							var upl8 = str.substring(12,1000);
						}else{						  
							var upl8 = str;					   
						}
						itemU8 = {
							no_urut : "8",
							jenis : "BAP",
							file_upl : upl8
						}
						uplVer.itemsUpl.push(itemU8);
					
					}

					
					
					if(self.ckNrRek.selected == true && self.noRek.getText() != "" && self.bankRek.getText() != "" && self.aNamaRek.getText() != "" ){
						item9 = {
							no_urut : "9",
							jenis :"RKN",
							value1 : self.noRek.getText(),
							value2 : self.bankRek.getText(),
							value3 : self.aNamaRek.getText()
							// value4 : self.nBrgRek.getText()
						}
						header.items.push(item9);

						/*upload file, fca_check_upl*/
						var upl9 = "";
						var str = self.eFile10.getText();
						if(str.includes("akepath")){ 
							var upl9 = str.substring(12,1000);
						}else{						  
							var upl9 = str;					   
						}
						itemU9 = {
							no_urut : "9",
							jenis : "RKN",
							file_upl : upl9
						}
						uplVer.itemsUpl.push(itemU9);
					}	

					if(self.ckJUM.selected == true ){
						var dataJum = [];
						for (var i = 0; i < self.sgAddJUM.getRowCount();i++){				
							var item10 = {
								no_urut : "10",
								jenis :"JUM",
								value1 : nilaiToFloat(self.sgAddJUM.cells(1,i)),
								value2 : self.sgAddJUM.cells(2,i), 
								value3 : self.sgAddJUM.cells(3,i),
								value4 : self.sgAddJUM.cells(4,i),
								value5 : self.sgAddJUM.cells(0,i)
							};
							dataJum.push(item10);					
						}						
						header.items.push(dataJum);

						/*upload file, fca_check_upl*/
						var upl10 = "";
						var str = self.eFile11.getText();
						if(str.includes("akepath")){ 
							var upl10 = str.substring(12,1000);
						}else{						  
							var upl10 = str;					   
						}
						itemU10 = {
							no_urut : "10",
							jenis : "JUM",
							file_upl : upl10
						}
						uplVer.itemsUpl.push(itemU10);
	
					}	

					if(self.ckJapel.selected == true ){
						var dataJapel = [];
						for (var i = 0; i < self.sgAddJapel.getRowCount();i++){				
							var item11 = {
								no_urut : "11",
								jenis :"JAPEL",
								value1 : nilaiToFloat(self.sgAddJapel.cells(0,i)), 
								value2 : self.sgAddJapel.cells(1,i),
								value3 : self.sgAddJapel.cells(2,i), 
								value4 : self.sgAddJapel.cells(3,i)
								
							};
							dataJapel.push(item11);					
						}						
						header.items.push(dataJapel);

						/*upload file, fca_check_upl*/
						var upl11 = "";
						var str = self.eFile12.getText();
						if(str.includes("akepath")){ 
							var upl11 = str.substring(12,1000);
						}else{						  
							var upl11 = str;					   
						}
						itemU11 = {
							no_urut : "11",
							jenis : "JAPEL",
							file_upl : upl11
						}
						uplVer.itemsUpl.push(itemU11);

					}

					if(self.ckJapem.selected == true ){
						var dataJapem = [];
						for (var i = 0; i < self.sgAddJapem.getRowCount();i++){				
							var item12 = {
								no_urut : "12",
								jenis :"JAPEM",
								value1 : nilaiToFloat(self.sgAddJapem.cells(0,i)), 
								value2 : self.sgAddJapem.cells(1,i),
								value3 : self.sgAddJapem.cells(2,i), 
								value4 : self.sgAddJapem.cells(3,i)
								
							};
							dataJapem.push(item12);					
						}						
						header.items.push(dataJapem);

						/*upload file, fca_check_upl*/
						var upl12 = "";
						var str = self.eFile13.getText();
						if(str.includes("akepath")){ 
							var upl12 = str.substring(12,1000);
						}else{						  
							var upl12 = str;					   
						}
						itemU12 = {
							no_urut : "12",
							jenis : "JAPEM",
							file_upl : upl12
						}
						uplVer.itemsUpl.push(itemU12);

					}


					if(self.ckPa.selected == true && self.amPa.getText() != "" && self.asPa.getText() != "" && self.tglPa.getText() != "" ){
						item13 = {
							no_urut : "13",
							jenis :"PA",
							value1 : self.amPa.getText(),
							value2 : self.asPa.getText(),
							value3 : self.tglPa.getText()
						}
						header.items.push(item13);

						/*upload file, fca_check_upl*/
						var upl13 = "";
						var str = self.eFile14.getText();
						if(str.includes("akepath")){ 
							var upl13 = str.substring(12,1000);
						}else{						  
							var upl13 = str;					   
						}
						itemU13 = {
							no_urut : "13",
							jenis : "PA",
							file_upl : upl13
						}
						uplVer.itemsUpl.push(itemU13);
					}
					

					if(self.jenisvendor.getText() == "Dalam Negeri"){
						if(self.ckTT.selected == true && self.noTT.getText() != "" && self.tglTT.getText() != "" ){
							item14 = {
								no_urut : "14",
								jenis :"TTABD",
								value1 : self.noTT.getText(),
								value2 : self.tglTT.getText()
							}
							header.items.push(item14);

							/*upload file, fca_check_upl*/
							var upl14 = "";
							var str = self.eFile15.getText();
							if(str.includes("akepath")){ 
								var upl14 = str.substring(12,1000);
							}else{						  
								var upl14 = str;					   
							}
							itemU14 = {
								no_urut : "14",
								jenis : "TTABD",
								file_upl : upl14
							}
							uplVer.itemsUpl.push(itemU14);
						}
						
						if(self.ckSIU.selected == true && self.noSIU.getText() != "" && self.tglmSIU.getText() != "" && self.tglaSIU.getText() != "" ){
							item15 = {
								no_urut : "15",
								jenis :"SIUJK",
								value1 : self.noSIU.getText(),
								value2 : self.tglmSIU.getText(),
								value3 : self.tglaSIU.getText()
							}
							header.items.push(item15);

							/*upload file, fca_check_upl*/
							var upl15 = "";
							var str = self.eFile16.getText();
							if(str.includes("akepath")){ 
								var upl15 = str.substring(12,1000);
							}else{						  
								var upl15 = str;					   
							}
							itemU15 = {
								no_urut : "15",
								jenis : "SIUJK",
								file_upl : upl15
							}
							uplVer.itemsUpl.push(itemU15);
						}

						if(self.ckNpwp.selected == true && self.noNpwp.getText() != "" && self.tglNpwp.getText() != "" ){
							item16 = {
								no_urut : "16",
								jenis :"NPWP",
								value1 : self.noNpwp.getText(),
								value2 : self.tglNpwp.getText()
							}	
							header.items.push(item16);

							/*upload file, fca_check_upl*/
							var upl16 = "";
							var str = self.eFile17.getText();
							if(str.includes("akepath")){ 
								var upl16 = str.substring(12,1000);
							}else{						  
								var upl16 = str;					   
							}
							itemU16 = {
								no_urut : "16",
								jenis : "NPWP",
								file_upl : upl16
							}
							uplVer.itemsUpl.push(itemU16);
						}
					}

					if(self.jenisvendor.getText() == "Luar Negeri"){
						if(self.ckForm.selected == true && self.noForm.getText() != "" && self.tglForm.getText() != "" && self.ngrForm.getText() != "" ){
							item17 = {
								no_urut : "17",
								jenis :"FDGT",
								value1 : self.noForm.getText(),
								value2 : self.tglForm.getText(),
								value3 : self.ngrForm.getText()
							}
							header.items.push(item17);

							/*upload file, fca_check_upl*/
							var upl17 = "";
							var str = self.eFile17a.getText();
							if(str.includes("akepath")){ 
								var upl17 = str.substring(12,1000);
							}else{						  
								var upl17 = str;					   
							}
							itemU17 = {
								no_urut : "17",
								jenis : "FDGT",
								file_upl : upl17
							}
							uplVer.itemsUpl.push(itemU17);
						}

						if(self.ckCod.selected == true && self.noCod.getText() != "" && self.tglCod.getText() != "" && self.ngrCod.getText() != "" ){
							item18 = {
								no_urut : "18",
								jenis :"COD",
								value1 : self.noCod.getText(),
								value2 : self.tglCod.getText(),
								value3 : self.ngrCod.getText()
							}
							header.items.push(item18);

							/*upload file, fca_check_upl*/
							var upl18 = "";
							var str = self.eFile18.getText();
							if(str.includes("akepath")){ 
								var upl18 = str.substring(12,1000);
							}else{						  
								var upl18 = str;					   
							}
							itemU18 = {
								no_urut : "18",
								jenis : "COD",
								file_upl : upl18
							}
							uplVer.itemsUpl.push(itemU18);
						}
					}
					
					if(self.ckCoo.selected == true && self.noCoo.getText() != "" && self.isCoo.getText() != "" ){
						item19 = {
							no_urut : "19",
							jenis :"COO",
							value1 : self.noCoo.getText(),
							value2 : self.isCoo.getText()
						}	
						header.items.push(item19);

						/*upload file, fca_check_upl*/
						var upl19 = "";
						var str = self.eFile19.getText();
						if(str.includes("akepath")){ 
							var upl19 = str.substring(12,1000);
						}else{						  
							var upl19 = str;					   
						}
						itemU19 = {
							no_urut : "19",
							jenis : "COO",
							file_upl : upl19
						}
						uplVer.itemsUpl.push(itemU19);
					}

					if(self.ckSL.selected == true && self.noSL.getText() != "" && self.tglSL.getText() != "" ){
						item20 = {
							no_urut : "20",
							jenis :"SL",
							value1 : self.noSL.getText(),
							value2 : self.tglSL.getText()						
						}	
						header.items.push(item20);

						/*upload file, fca_check_upl*/
						var upl20 = "";
						var str = self.eFile20.getText();
						if(str.includes("akepath")){ 
							var upl20 = str.substring(12,1000);
						}else{						  
							var upl20 = str;					   
						}
						itemU20 = {
							no_urut : "20",
							jenis : "SL",
							file_upl : upl20
						}
						uplVer.itemsUpl.push(itemU20);
					}

					if(self.ckDenda.selected == true && self.jmlDenda.getText() != "" && self.jmlHari.getText() != "" ){
						item21 = {
							no_urut : "21",
							jenis :"DH",
							value1 : self.jmlHari.getText(),
							value2 : nilaiToFloat(self.jmlDenda.getText())	
						}
						header.items.push(item21);
						
						/*upload file, fca_check_upl*/
						var upl21 = "";
						var str = self.eFile21.getText();
						if(str.includes("akepath")){ 
							var upl21 = str.substring(12,1000);
						}else{						  
							var upl21 = str;					   
						}
						itemU21 = {
							no_urut : "21",
							jenis : "DH",
							file_upl : upl21
						}
						uplVer.itemsUpl.push(itemU21);

					}	
					
					if(self.ckProposal.selected == true && self.adaProposal.getText() != "" ){
						item22 = {
							no_urut : "22",
							jenis :"PRP",
							value1 : self.adaProposal.getText()
						}
						header.items.push(item22);	

						/*upload file, fca_check_upl*/
						var upl22 = "";
						var str = self.eFile22.getText();
						if(str.includes("akepath")){ 
							var upl22 = str.substring(12,1000);
						}else{						  
							var upl22 = str;					   
						}
						itemU22 = {
							no_urut : "22",
							jenis : "PRP",
							file_upl : upl22
						}
						uplVer.itemsUpl.push(itemU22);
					}	
					
				

					//alert penyimpanan
					if( self.nbayarcurr.getText() == "" || self.currbayar.getText() == ""){
						system.alert(self, "Data Tidak Boleh Kosong");
					}
				
					else if(self.ket.getText() == ""){
						system.alert(self, "Keterangan Tidak Boleh Kosong");	
					}
					else if(self.proyek.getText() == ""){
						system.alert(self, "Nama Proyek Tidak Boleh Kosong");	
					}
					else if(self.currpo.getText() == ""){
						system.alert(self, "Currency Tidak Boleh Kosong");	
					}
					else if(self.jenisvendor.getText() == ""){
						system.alert(self, "Jenis Vendor Tidak Boleh Kosong");	
					}
					else if(self.jenis_uang.getText() == ""){
						system.alert(self, "Payment Method Tidak Boleh Kosong");	
					}
					else if(self.jnsTrans.getText() == ""){
						system.alert(self, "Jenis Transaksi Tidak Boleh Kosong");	
					}
					else if(self.kodeBA.getText() == ""){
						system.alert(self, "Kode BA Tidak Boleh Kosong");	
					}				
					else if(self.note1.getText() == "" && self.eFile.getText() == ""){
						system.alert(this, "Isi Note Draft / Upload Note Jika Ingin Draft Dokumen");
					}	
					else if(self.kat_dok.getText() == ""){
						system.alert(self, "Kategori Tidak Boleh Kosong");	
					}
					else{

						var c = "";
						var str = self.eFile.getText();
						var a = str.substring(2);
						
						if(str.includes("akepath")){ 
							var c = str.substring(12,1000);
						}else{						  
							var c = str;					   
						}

						
						self.app.services.callServices("financial_Fca","saveParkUbis", [data,header,self.regid.getText(),self.nt.getText(),self.sts_baru.getText(),self.statusbaru.getText(),self.note1.getText(),self.app._lokasi, UM, c, uplVer] ,function(data){
							if (data == "process completed") {
								system.info(self, data,"");
								self.app._mainForm.bClear.click();
								
								//hapus inputan
								self.sgAddInvoice.clear();
								self.sgAddDPP.clear();
								self.sgAddFP.clear();
								self.sgAddPPH.clear();
								self.sgAddUM.clear();
								self.sgAddBast.clear();
								self.sgAddBaut.clear();
								self.sgAddJUM.clear();
								self.sgAddJapel.clear();
								self.sgAddJapem.clear();
								self.totKP.setText("");
								self.totDPP.setText("");
								self.totFP.setText("");
								self.totPPH.setText("");
								self.totBast.setText("");
								self.totUM.setText("");
								self.totJapel.setText("");
								self.totJapem.setText("");
								
								self.sgAdd1.setCell("");
								self.sgAddUM.clear(0);
								self.sgAddUM.clear();
								self.sgAddUM.setCell("");
								self.totUM.setText("");
								self.kat_dok.setText("");
								// self.sgAdd2.setCell("");
								// self.sgAdd3.setCell("");
								self.jenis_nilai.setText("");
								self.jenis_dpp2.setText("");
								self.jenis_dpp.setSelected(false);
								self.sgAddPPH.setCell("");
								self.note1.setText("");
								self.mitra.setText("");
								self.kdmitra.setText("");
								self.amBast.setText("");
								self.dppKP.setText("");
								self.noKP.setText("");
								self.amFP.setText("");
								self.tglFP.setText("");
								self.jenisvendor.setText("");
								self.persen.setText("");
								self.proyek.setText("");
								self.ket.setText("");
								self.checkbox1.setSelected(false);
								self.checkbox2.setSelected(false);
								self.nokon.setText("");
								self.tglkon.setText("");
								self.currkon.setText("");
								self.nilkon.setText("");
								self.nopo.setText("");
								self.tglpo.setText("");
								self.currpo.setText("");
								self.nilpo.setText("");
								self.noaman.setText("");
								self.tglaman.setText("");
								self.curraman.setText("");
								self.nilaman.setText("");
								self.ntagih.setText("");
								self.ntagihcurr.setText("");
								self.currtagih.setText("");									
								self.nbayar.setText("");
								self.nbayarcurr.setText("");
								self.currbayar.setText("");	

								self.ckStagih.setSelected(false);
								self.noStagih.setText("");
								self.tglDokStagih.setText("");
								self.tglMasukStagih.setText("");

								self.ckInv.setSelected(false);
								self.noInv.setText("");
								self.tglDokInv.setText("");
								self.tglMasukInv.setText("");

								self.ckPo.setSelected(false);
								self.amountPo.setText("");
								self.tahapPo.setText("");
								self.nAman.setText("");

								self.ckPPH.setSelected(false);
								self.jenisPPH.setText("");
								self.persenPPH.setText("");
								self.amPPH.setText("");
								self.wapuPPH.setText("");
								

								self.ckBaut.setSelected(false);
								self.noBaut.setText("");
								self.tglBaut.setText("");

								self.ckBast.setSelected(false);
								self.tglBast.setText("");
								self.noMIGOBast.setText("");
								self.tanggal.setText("");
								// self.nBrgBast.setText("");
								// self.nJasaBast.setText("");

								// self.ckPotum.setSelected(false);
								// self.amPotum.setText("");

								self.ckKP.setSelected(false);
								self.amKP.setText("");
								self.tglKP.setText("");
								self.totPPH.setText("");

								self.ckNrRek.setSelected(false);
								self.noRek.setText("");
								self.bankRek.setText("");
								self.aNamaRek.setText("");
								// self.nBrgRek.setText("");

								self.ckFP.setSelected(false);
								self.noFP.setText("");

								self.ckJUM.setSelected(false);
								self.nomJUM.setText("");								
								self.amJUM.setText("");
								self.asJUM.setText("");
								self.tglJUM.setText("");
								self.noAsJUM.setText("");

								self.ckJapel.setSelected(false);
								self.amJapel.setText("");
								self.asJapel.setText("");
								self.tglJapel.setText("");
								self.noAsJapel.setText("");

								self.ckJapem.setSelected(false);
								self.amJapem.setText("");
								self.asJapem.setText("");
								self.tglJapem.setText("");
								self.noAsJapem.setText("");

								self.ckPa.setSelected(false);
								self.amPa.setText("");
								self.asPa.setText("");
								self.tglPa.setText("");

								self.ckTT.setSelected(false);
								self.noTT.setText("");
								self.tglTT.setText("");

								self.ckSIU.setSelected(false);
								self.noSIU.setText("");
								self.tglmSIU.setText("");
								self.tglaSIU.setText("");

								self.ckNpwp.setSelected(false);
								self.noNpwp.setText("");
								self.tglNpwp.setText("");
								
								self.ckForm.setSelected(false);
								self.noForm.setText("");
								self.tglForm.setText("");
								self.ngrForm.setText("");
								
								self.ckCod.setSelected(false);
								self.noCod.setText("");
								self.tglCod.setText("");
								self.ngrCod.setText("");

								self.ckCoo.setSelected(false);
								self.noCoo.setText("");
								self.isCoo.setText("");

								self.ckSL.setSelected(false);
								self.noSL.setText("");
								self.tglSL.setText("");

								self.ckDenda.setSelected(false);
								self.jmlDenda.setText("");
								self.jmlHari.setText("");

								self.ckProposal.setSelected(false);
								self.adaProposal.setText("");

								self.kdAkun.setText("");
								self.cc.setText("");
								self.keg.setText("");
								self.termin.setText("");
								self.jenis_uang.setText("");
								self.jnsTrans.setText("");
								self.kodeBA.setText("");

								self.nt.setText("");
								self.sts_baru.setText("");

								page = self.sg1.page;
								row = ((page-1) * self.sg1.rowPerPage)+row;
								self.tab.setActivePage(self.tab.childPage[0]);
								self.RefreshList();
							}else {
								system.alert(self, data,"");
							}
						});
					}
					
				});
			
		}

			
		}catch(e){
			alert(e);
			error_log(e);
		}
	},	
	doNilaiChange: function(sender, col, row){
		var self=this;
		var totpph = 0;	
		var totum = 0;		
		var totperum =0;
		var totfp =0;
		var totdpp = 0;
		var totkp =0;
		var totambast =0;
		var totamjum =0;
		var totamjapel = 0;
		var totamjapem =0;

		for (var i = 0;i < self.sgAddDPP.getRowCount();i++){			
			totkp += nilaiToFloat(self.sgAddDPP.cells(1,i));
		}
		self.totKP.setText(floatToNilai(totkp));

		for (var i = 0;i < self.sgAddDPP.getRowCount();i++){			
			totdpp += nilaiToFloat(self.sgAddDPP.cells(2,i));
		}
		self.totDPP.setText(floatToNilai(totdpp));

		for (var i = 0;i < self.sgAddFP.getRowCount();i++){			
			totfp += nilaiToFloat(self.sgAddFP.cells(0,i));
		}
		self.totFP.setText(floatToNilai(totfp));

		for (var i = 0;i < self.sgAddPPH.getRowCount();i++){			
			totpph += nilaiToFloat(self.sgAddPPH.cells(2,i));
		}
		self.totPPH.setText(floatToNilai(totpph));
		
		for (var i = 0;i < self.sgAddUM.getRowCount();i++){			
			totum += nilaiToFloat(self.sgAddUM.cells(1,i));
			totperum += nilaiToFloat(self.sgAddUM.cells(0,i));
		}
		// self.totUM.setText(floatToNilai(totum));
		self.totPerUM.setText(floatToNilai(nilaiToFloat(totperum)));

		for (var i = 0;i < self.sgAddBast.getRowCount();i++){			
			totambast += nilaiToFloat(self.sgAddBast.cells(0,i));
		}
		self.totBast.setText(floatToNilai(nilaiToFloat(totambast)));

		for (var i = 0;i < self.sgAddJUM.getRowCount();i++){			
			totamjum += nilaiToFloat(self.sgAddJUM.cells(1,i));
		}
		self.totJUM.setText(floatToNilai(nilaiToFloat(totamjum)));

		for (var i = 0;i < self.sgAddJapel.getRowCount();i++){			
			totamjapel += nilaiToFloat(self.sgAddJapel.cells(0,i));
		}
		self.totJapel.setText(floatToNilai(nilaiToFloat(totamjapel)));

		for (var i = 0;i < self.sgAddJapem.getRowCount();i++){			
			totamjapem += nilaiToFloat(self.sgAddJapem.cells(0,i));
		}
		self.totJapem.setText(floatToNilai(nilaiToFloat(totamjapem)));
		

		if(self.wapuPPH.getText() == "Wapu" ){
			
			if(self.jenis_uang.getText() == "Uang Muka"){
				self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
				if(self.persen.getText() != ""){
					// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
					// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
					var pembagi = 100 + nilaiToFloat(self.persen.getText());
					// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
					self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
				}	
				if(self.jmlHari.getText() == ""){
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// );
				}else{
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
				}
			}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
				if(self.jmlHari.getText() == ""){
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
						);
					}


					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// );
				}else{
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText())- nilaiToFloat(self.jmlDenda.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
				}
			}else if (self.jenis_uang.getText() == "Termin"){
				var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText()) ;
				if(self.jmlHari.getText() == ""){
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - termin)
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
					// );
				}else{
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totDPP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
					// );
				}
			}

			if(self.currbayar.getText() == "IDR"){	
				self.nbayarcurr.setText(0);		
			}
			if(self.currbayar.getText() == "USD"){	
				var usd2 = 14709;
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
			}
			if(self.currbayar.getText() == "GBP"){	
				var gbp2 = 19156;
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
			}
			if(self.currbayar.getText() == "JPY"){
				var jpy2 = 131;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
			}
			if(self.currbayar.getText() == "SGD"){
				var sgd2 = 10769;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
			}	
			if(self.currbayar.getText() == "EURO"){
				var euro2 = 17210;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
			}	
			if(self.currbayar.getText() == "AUD"){
				var aud2 = 10609;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
			}	
		}
		if(self.wapuPPH.getText() == "Non Wapu"){
			if(self.jenis_uang.getText() == "Uang Muka"){
				self.dppKP.setText(floatToNilai(nilaiToFloat(self.totUM.getText())));
				if(self.persen.getText() != ""){
					// var persen = self.persen.getText() * nilaiToFloat(self.totUM.getText()) / 100;
					// self.amKP.setText(floatToNilai(nilaiToFloat(self.dppKP.getText())+persen));	
					var pembagi = 100 + nilaiToFloat(self.persen.getText());
					// self.amKP.setText(floatToNilai(pembagi / 100 * nilaiToFloat(self.dppKP.getText())));
					self.amKP.setText(floatToNilai(Math.round(pembagi / 100 * nilaiToFloat(self.dppKP.getText()))));
				}	
				if(self.jmlHari.getText() == ""){
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// );
				}else{
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
				}
			}else if (self.jenis_uang.getText() == "Pembayaran Penuh"){
				if(self.jmlHari.getText() == ""){
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
						);
					}


					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) )
					// );
				}else{
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) )
					// );
				}
			}else if (self.jenis_uang.getText() == "Termin"){
				var termin = (nilaiToFloat(self.persenSblm.getText()) / 100) * nilaiToFloat(self.ntagih.getText());
				if(self.jmlHari.getText() == ""){
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - termin)
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - termin)
					// );
				}else{
					if(self.totPPH.getText() == ""){
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
						);
					}else{
						self.nbayar.setText(
							floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
						);
					}

					// self.nbayar.setText(
					// 	floatToNilai(nilaiToFloat(self.totKP.getText()) - nilaiToFloat(self.totPPH.getText()) - nilaiToFloat(self.jmlDenda.getText()) - termin)
					// );
				}
			}

			if(self.currbayar.getText() == "IDR"){	
				self.nbayarcurr.setText(0);		
			}
			if(self.currbayar.getText() == "USD"){	
				var usd2 = 14709;
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * usd2));
			}
			if(self.currbayar.getText() == "GBP"){	
				var gbp2 = 19156;
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * gbp2));
			}
			if(self.currbayar.getText() == "JPY"){
				var jpy2 = 131;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * jpy2));
			}
			if(self.currbayar.getText() == "SGD"){
				var sgd2 = 10769;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * sgd2));
			}	
			if(self.currbayar.getText() == "EURO"){
				var euro2 = 17219;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * euro2));
			}	
			if(self.currbayar.getText() == "AUD"){
				var aud2 = 10609;	
				self.nbayarcurr.setText(floatToNilai(nilaiToFloat(self.nbayar.getText()) * aud2));
			}	
		}
	},
	
	RefreshList : function(page){
		try{
			this.currentPage = page;
			var self  = this;
			
			self.app.services.callServices("financial_Fca","getListEntAdmin",[self.app._lokasi,self.fcbp], function(data){
				self.sg1.clear();
				$.each(data, function(key, val){
					if(val.stsd == "1111"){
						var status = "Reject";
						var note = "<center><i class='fa fa-file-text-o' style='color:tomato;margin-top:2px'> </i>";
						var reject = "-";
					}else if(val.stsd == null || val.stsd == 0){
						var status = "Waiting For Approval";
						var note = "-";
						var reject = "-";
					}	
					else if(val.stsd == "600"){
						var status = "Reject";
						var note = "<center><i class='fa fa-file-text-o' style='color:tomato;margin-top:2px'> </i>";
						var reject = "-";
					}	
				
					self.judul2.setCaption("No Tagihan : "+ val.no_tagihan);			
							
					self.sg1.addRowValues([val.reg_id,val.kode_vendor, val.nama, val.kode_ubis, val.tgl, status,note]);
				});
			});
			
		}catch(e){
			console.log(e);
		}
		
	},
	doModalResult: function(event, modalResult){
		if (modalResult != mrOk) return false;
		switch (event){
			case "clear" :
				// if (modalResult == mrOk)
				// 	this.standarLib.clearByTag(this, new Array("0"),this.kdmitra);
				break;
			case "simpan" :
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
	},
	
});
