window.app_saku_report_fBSAset = function (owner, pdrk) {
	if (owner) {
		window.app_saku_report_fBSAset.prototype.parent.constructor.call(this, owner);
		this.className = "app_saku_report_fBSAset";
		this.itemsValue = new arrayList();
		this.maximize();
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Report Aset", 0);

		uses("control_popupForm;column;datePicker;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");

		this.container = new panel(this, { bound: [0, 0, this.width - 10, this.height - 20] });

		this.tab = new pageControl(this.container, {
			bound: [20, 0, this.width - 60, this.height - 100],
			childPage: ["Report"],
			borderColor: "#35aedb", pageChange: [this, "doTabChange"], headerAutoWidth: false
		});
		this.rearrangeChild(10, 22);

		// this.bGenerateJurnal = new button(this.tab.childPage[0],{bound:[10,20,130,20],icon:"<i class='fa fa-search' style='color:white'></i>", caption:"Generate Jurnal ", click: [this, "doClick"], keyDown:[this, "keyDown"]});        
		// this.fsearch = new saiLabelEdit(this.tab.childPage[0],{bound:[980, 20, 300, 20],labelWidth:100,caption:"Search",placeHolder:""});

		this.sg1 = new saiGrid(this.tab.childPage[0], {
			bound: [10, 130, this.tab.width - 15, this.tab.height - 150],
			colCount: 25,
			headerHeight: 50,
			colTitle: ["No.Aset", "Akun Aset", "Acct COA", "Nama Aset", "ICM", "Periode", "COCD", "TP", "Kelompok Aset", "Tgl Perolehan", "Periode Susut", "Margin", "Umur", "Nilai Aset ICM", "AP", "BP", "Nilai Penyusutan per Bulan", "Nilai Buku", "Pajak Margin", "Pajak Depresiasi", "Buku Pajak", "Status Dok", "Status Aset", "Jurnal Input", "Jurnal Dep"],
			colWidth: [[24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], [40, 40, 100, 100, 150, 150, 150, 150, 150, 150, 150, 150, 45, 150, 100, 100, 100, 100, 80, 80, 110, 100, 80, 80, 120]],
			colFormat: [[20, 19, 18, 17, 16, 15, 14, 13, 12, 11], [cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai]],
			columnReadOnly: [true, [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], []],
			rowPerPage: 100, autoPaging: true, pager: [this, "doPager3"]
		});
		var self = this;

		this.pnl = new panel(this.tab.childPage[0], { bound: [(10), 1, 480, 105], caption: "Summary", border: 1 });
		this.pnl.getCanvas().css({ border: "2px solid gray", boxShadow: "0px 1px 2px #888" });
		this.fThn = new saiLabelEdit(this.pnl, { bound: [10, 23, 200, 20], labelWidth: 80, caption: "Tahun", readOnly: true });
		this.fMargin = new saiLabelEdit(this.pnl, { bound: [10, 46, 200, 20], labelWidth: 80, caption: "Margin", tipeText: ttNilai, readOnly: true });
		this.fAPBP = new saiLabelEdit(this.pnl, { bound: [10, 69, 200, 20], labelWidth: 80, caption: "APBP", tipeText: ttNilai, readOnly: true });
		this.fTaxMargin = new saiLabelEdit(this.pnl, { bound: [240, 23, 200, 20], labelWidth: 80, caption: "Tax Margin", tipeText: ttNilai, readOnly: true });
		this.fTaxAPBP = new saiLabelEdit(this.pnl, { bound: [240, 46, 200, 20], labelWidth: 80, caption: "Tax APBP", tipeText: ttNilai, readOnly: true });

		this.pnl1 = new panel(this.tab.childPage[0], { bound: [550, 1, 685, 115], caption: "Filter Data", border: 1 });
		this.pnl1.getCanvas().css({ border: "2px solid gray", boxShadow: "0px 1px 2px #888" });
		this.fTglPerolehan = new datePicker(this.pnl1, { bound: [10, 23, 170, 20], labelWidth: 80, readOnly: true, caption: "Tgl Perolehan", placeHolder: "dd/mm/yyyy" });
		this.fTglPerolehan2 = new datePicker(this.pnl1, { bound: [202, 23, 90, 20], labelWidth: 0, readOnly: true, caption: "", placeHolder: "dd/mm/yyyy" });
		this.ltitleSD = new label(this.pnl1, { bound: [181, 25, 5, 20], alignment: "center", caption: "S/D", fontSize: 9 });

		this.fPeriode = new saiLabelEdit(this.pnl1, { bound: [10, 46, 170, 20], labelWidth: 80, caption: "Periode", placeHolder: "YYYYMM" });
		this.co_cocd = new saiCBBL(this.pnl1, { bound: [10, 69, 140, 20], labelWidth: 80, caption: "COCD" });
		this.fTP = new saiCBBL(this.pnl1, { bound: [10, 90, 140, 20], labelWidth: 80, caption: "TP", change: [this, "doChange"] });
		this.fKlp = new saiLabelEdit(this.pnl1, { bound: [310, 23, 200, 20], labelWidth: 100, caption: "Kelompok Aset", placeHolder: "Pilih Klp Aset" });
		this.co_sts_dok = new saiCB(this.pnl1, { bound: [310, 45, 200, 20], labelWidth: 80, caption: "Status Dok", items: ["REVIEWER", "APPROVER", "DONE", "RETURN"] });
		this.co_sts_ast = new saiCB(this.pnl1, { bound: [310, 68, 200, 20], labelWidth: 80, caption: "Status Aset", items: ["TERMINATE", "ADK", "KOREKSI", "REKLAS", "CAPEX"] });
		this.co_icm = new saiLabelEdit(this.pnl1, { bound: [310, 91, 200, 20], labelWidth: 80, caption: "ICM" });
		this.pKlp = new control_popupForm(this.app);
		this.pKlp.setBound(0, 0, 360, 195);
		this.pKlp.hide();
		this.sgKlp = new saiGrid(this.pKlp, {
			bound: [1, 0, 350, 190],
			colCount: 2,
			colTitle: ["Kode Kelompok", "Nama"],
			colWidth: [[0, 1], [90, 200]],
			columnReadOnly: [true, [0], []],
			rowPerPage: 20,
			autoPaging: true,
			pager: [this, "doPager"],
			// colFormat:[[1],[cfNilai]],
			nilaiChange: [this, "doNilaiChange"]
		});

		self.fKlp.on("keyup", function () {
			var node = self.fKlp.getCanvas();
			self.pKlp.setTop(node.offset().top + 20);
			self.pKlp.setLeft(node.offset().left + (node.width() / 2) - 150);
			self.pKlp.show();
			self.pKlp.getCanvas().fadeIn("slow");
			self.pKlp.getCanvas().fadeIn("slow");

			self.app.services.callServices("financial_BsplMaster", "getDataKlpAset", [self.app._lokasi, self.fKlp.getText()], function (data) {
				self.sgKlp.clear();
				$.each(data, function (key, val) {
					self.sgKlp.addRowValues([val.klp_aset, val.nama]);
				});
			});
		});

		self.sgKlp.on("dblClick", function (col, row, id) {
			if (col == 0 || col == 1) {
				self.fKlp.setText(self.sgKlp.cells(0, row));
				self.pKlp.hide();
			}
		});

		// this.b_exportXls = new button(this.pnl1, {bound:[540, 60, 90, 20], icon:"<i class='fa fa-download' style='color:white'></i>", caption:"Export XLS", click:[this,"doClick"]});	

		this.bOk = new button(this.pnl1, { bound: [580, 23, 80, 20], icon: "<i class='fa fa-check' style='color:white'></i>", caption: "Search", click: [this, "doClick"], keyDown: [this, "keyDown"] });
		this.bOk.setColor("#4cd137");
		this.bCancel = new button(this.pnl1, { bound: [270, 20, 80, 20], visible: false, icon: "<i class='fa fa-times' style='color:white'></i>", caption: "Cancel" });
		this.bCancel.setColor("#e84393");
		this.bCancel.on("click", function () {
			self.pSearch.hide();
		});
		this.b_exportXls = new button(this.pnl1, { bound: [580, 53, 80, 20], icon: "<i class='fa fa-download' style='color:white'></i>", caption: "Excel", click: [this, "doClick"] });

		this.pJurnal = new control_popupForm(this.app);
		this.pJurnal.setBound(0, 0, this.width - 90, 400);
		this.pJurnal.setArrowMode(4);
		this.pJurnal.hide();
		this.judul = new label(this.pJurnal, { bound: [20, 5, 300, 20], caption: "<b>Jurnal<b>", fontSize: 12 });
		// this.judul2 = new label(this.pJurnal, {bound:[20,22,300,20], caption:"...", fontSize:10});
		this.bCJurnal = new button(this.pJurnal, { bound: [20, 30, 80, 20], icon: "<i class='fa fa-times' style='color:white'></i>", caption: "Close" });
		this.bCJurnal.setColor("#e84393");
		this.fNoAset = new saiLabelEdit(this.pJurnal, { bound: [120, 30, 300, 20], labelWidth: 100, readOnly: true, caption: "NO.ASET : ", placeHolder: "" });
		this.b_exportJXls = new button(this.pJurnal, { bound: [920, 30, 80, 20], icon: "<i class='fa fa-download' style='color:white'></i>", caption: "Excel", click: [this, "doClick"] });

		this.sgJurnal = new saiGrid(this.pJurnal, {
			bound: [20, 60, this.pJurnal.width - 30, 300],
			colCount: 8,
			colTitle: ["DR/CR", "POST KEY", "TGL JURNAL", "KODE AKUN", "NAMA AKUN", "DEBET", "KREDIT", "KETERANGAN"],
			colWidth: [[7, 6, 5, 4, 3, 2, 1, 0], [180, 150, 150, 150, 100, 100, 70, 50]],
			colFormat: [[6, 5], [cfNilai, cfNilai]],
			columnReadOnly: [true, [0, 1, 2, 3, 4, 5, 6, 7], []],
			rowPerPage: 50, autoPaging: true, pager: [this, "doPager3"]
		});
		var self = this;

		this.bCJurnal.on("click", function () {
			self.pJurnal.hide();
			self.sgJurnal.clear(0);
			// self.nokon.setText("");
		});

		this.sg1.on("dblClick", function (col, row, id) {
			if (col == 22) {
				self.pJurnal.show();
				self.pJurnal.setTop(120);
				self.pJurnal.setLeft(50);
				self.pJurnal.getCanvas().fadeIn("slow");
				self.sgJurnal.clear();
				self.fNoAset.setText(self.sg1.cells(0, row));
				self.jenisPopUp = 'INP';
				self.app.services.callServices("financial_mantisRepSumBspl", "getJurnalByJenis", [self.app._lokasi, self.sg1.cells(0, row), 'CURRENT', 'ALL'], function (data) {
					if (typeof data != 'undefined' && data != null) {
						$.each(data, function (key, val) {
							self.sgJurnal.addRowValues([val.dc, val.post_key, val.tgl_jurnal, val.kode_akun, val.description, val.debit, val.kredit, val.keterangan]);
						});
					}
				});

				if (this.sgJurnal.getRowCount() == 0) {
					system.alert(self, "data not found");
					self.pJurnal.hide();
				}
			} else if (col == 23) {
				self.pJurnal.show();
				self.pJurnal.setTop(120);
				self.pJurnal.setLeft(50);
				self.pJurnal.getCanvas().fadeIn("slow");
				self.sgJurnal.clear();
				self.fNoAset.setText(self.sg1.cells(0, row));
				self.jenisPopUp = 'DEP';

				self.app.services.callServices("financial_mantisRepSumBspl", "getJurnalByJenis", [self.app._lokasi, self.sg1.cells(0, row), 'CURRENT_PORTION', 'ALL'], function (data) {
					if (typeof data != 'undefined' && data != null) {
						$.each(data, function (key, val) {
							self.sgJurnal.addRowValues([val.dc, val.post_key, val.tgl_jurnal, val.kode_akun, val.description, val.debit, val.kredit, val.keterangan]);
						});
					}
				});

				if (this.sgJurnal.getRowCount() == 0) {
					system.alert(self, "data not found");
					self.pJurnal.hide();
				}
			}
		});

		// this.fsearch.on("keyup", function(){
		//     self.app.services.callServices("financial_BsplMaster","getDataAset",[self.app._lokasi,self.fsearch.getText()], function(data){
		//         if (typeof data != 'undefined'){
		//     		self.sg1.clear(0);	
		//             $.each(data, function(k, val){
		//                 self.sg1.addRowValues([
		//                     val.no_aset,
		//                     val.nama,
		//                     val.periode,
		//                     val.tanggal,
		//                     val.pmargin,                        
		//                     val.peny_perbln,
		//                     val.hp,
		//                     val.klp_aset,
		//                     val.bp_cm,
		//                     val.ap,
		//                     val.bp,
		//                     val.umur,
		//                     val.tp,
		// 				    "<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>",                        
		// 				    "<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>"                          
		//                 ]);
		//             });
		//             // self.sg1.addRowValues(["","","",""]);
		//         }else{
		//             system.alert(self, "Data Report Tidak ditemukan","");
		//         }	
		//     });
		// });

		this.container.rearrangeChild(10, 50);

		this.setTabChildIndex();
		try {
			var self = this;
			this.co_cocd.setText(this.app._lokasi);
			// self.loadReport();
			this.fTP.setServices(this.app.servicesBpc, "callServices", ["financial_BsplMaster", "getListCOCD", ["", "", "", 0]], ["cocd", "company_name"], " ", "Daftar Company Code");
			this.co_cocd.setServices(this.app.servicesBpc, "callServices", ["financial_mantis", "getListCOCD", ["", "", "", 0]], ["cocd", "company_name"], " ", "Daftar CC");
		} catch (e) {
			systemAPI.alert(e);
		}
	}
};
window.app_saku_report_fBSAset.extend(window.childForm);
window.app_saku_report_fBSAset.implement({
	getReport: function (report, param, iframe) {
		var self = this;
		var data = JSON.stringify({ service: "RRA", method: report, params: param });
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doAfterResize: function (w, h) {
		if (this.listView) {
			this.listView.setHeight(this.height);
			this.container.setHeight(this.height);
		}
	},
	mainButtonClick: function (sender) {
		if (sender == this.app._mainForm.bClear)
			system.confirm(this, "clear", "screen akan dibersihkan?", "form inputan ini akan dibersihkan");
		if (sender == this.app._mainForm.bSimpan)
			system.confirm(this, "simpan", "Apa data sudah benar?", "data diform ini apa sudah benar.");
		if (sender == this.app._mainForm.bEdit)
			system.confirm(this, "ubah", "Apa perubahan data sudah benar?", "perubahan data diform ini akan disimpan.");
		if (sender == this.app._mainForm.bHapus)
			system.confirm(this, "hapus", "Yakin data akan dihapus?", "data yang sudah disimpan tidak bisa di<i>retrieve</i> lagi.");
	},
	doClick: function (sender) {
		if (sender == this.bGenerateJurnal) {
			this.generateJurnal();
		} else if (sender == this.bOk) {
			if (this.fPeriode.getText() != '') {
				this.loadReport();
			} else {
				system.alert(self, "Inputan Tidak Boleh Kosong");
			}
		} else if (sender == this.b_exportXls) {
			this.doExport();
		} else if (sender == this.b_exportJXls) {
			this.doExportJurnal();
		}
	},
	doExport: function () {
		var self = this;
		var filter = {
			tgl_perolehan: self.fTglPerolehan.getText(),
			tgl_perolehan2: self.fTglPerolehan2.getText(),
			periode: self.fPeriode.getText(),
			tp: self.fTP.getText(),
			klp_aset: self.fKlp.getText()
		};
		self.showLoading("Export to Xls...");
		this.app.services.callServices("financial_BsplMaster", "xlsDataAset", [self.app._lokasi, filter], function (data) {
			self.hideLoading();
			window.open("./server/reportDownloader.php?f=" + data + "&n=" + "DATA_KELOMPOK_ASET.xlsx");
		}, function () {
			self.hideLoading();
		});
	},
	doExportJurnal: function () {
		var self = this;
		if (self.jenisPopUp == 'DEP') {
			var judul_excel = 'DEPRESIASI';
		} else if (self.jenisPopUp == 'DTX') {
			var judul_excel = 'DEPRESIASI_PAJAK';
		} else if (self.jenisPopUp == 'CF') {
			var judul_excel = 'CARRY_FORWARD';
		} else if (self.jenisPopUp == 'RA') {
			var judul_excel = 'REKLAS_ASET';
		}

		self.showLoading("Export to Xls...");
		this.app.services.callServices("financial_BsplMaster", "xlsJurnalByJenis", [self.app._lokasi, self.fNoAset.getText(), self.jenisPopUp], function (data) {
			self.hideLoading();
			window.open("./server/reportDownloader.php?f=" + data + "&n=" + "JURNAL_" + judul_excel + ".xlsx");
		}, function () {
			self.hideLoading();
		});
	},
	generateJurnal: function (sender) {
		this.app.services.callServices("financial_BsplMaster", "genJurnalDep", [this.app._lokasi], function (data) {
			if (data == 'process completed') {
				system.info(self, "Process Completed", "");
				this.loadReport();
			} else {
				system.alert(self, data, "");
			}
		});
	},
	simpan: function (row) {
		try {
			try {
				var self = this;
				if (self.fID.getText() != '' || self.fNama.getText() != '' || self.fTrf.getText() != '') {
					var data = [];
					var items = {
						id: self.fID.getText(),
						nama: self.fNama.getText(),
						tarif: self.fTrf.getText(),
						cc: self.fCOCD.getText()
					}
					data.push(items);
					this.app.services.callServices("financial_BsplMaster", "addTrf", [data], function (data) {
						if (data == 'process completed') {
							system.info(self, "Data kelompok aset berhasil tersimpan", "");

							self.fID.setText('');
							self.fNama.setText('');
							self.fTrf.setText('');
							self.fCOCD.setText('');

							self.loadReport();
							self.loadID();
						} else {
							system.alert(self, data, "");
						}
					});
				} else {
					system.alert(self, "Inputan Tidak Boleh Kosong");
				}
			}
			catch (e) {
				system.alert(this, e, "");
			}
		} catch (e) {
			systemAPI.alert(e);
		}
	},
	loadReport: function () {
		var self = this;
		self.sg1.clear(0);
		var filter = {
			tgl_perolehan: self.fTglPerolehan.getText(),
			tgl_perolehan2: self.fTglPerolehan2.getText(),
			periode: self.fPeriode.getText(),
			tp: self.fTP.getText(),
			klp_aset: self.fKlp.getText(),
			sts_dok: self.co_sts_dok.getText(),
			sts_ast: self.co_sts_ast.getText(),
			icm: self.co_icm.getText(),
			cc: self.co_cocd.getText()
		};
		if (self.fPeriode !== '') {
			let tahun = self.fPeriode.getText();
			let periode = tahun.substring(0, 4);
			self.fThn.setText(periode);
		} else {
			let tahun = this.app._periode;
			let periode = tahun.substring(0, 4);
			self.fThn.setText(periode);
		}
		this.app.services.callServices("financial_mantisRepSumBspl", "getDataAset", [this.app._lokasi, filter], function (data) {
			if (typeof data != 'undefined' && data != null) {
				console.log(data);
				self.fMargin.setText(floatToNilai(data.margin));
				self.fAPBP.setText(floatToNilai(data.apbp));
				self.fTaxMargin.setText(floatToNilai(data.tax_margin));
				self.fTaxAPBP.setText(floatToNilai(data.tax_apbp));
				if (data.aset) {
					$.each(data.aset, function (k, val) {
						if (typeof val.no_aset != 'undefined' && val.no_aset != null) {
							if ((val.orig_acct.match(/1319.*/) || val.orig_acct.match(/1320.*/)) && val.status_aset != 'TERMINATE' && val.status_aset != 'KOREKSI' && val.status_aset != 'REKLAS') {
								if (val.orig_acct.match(/1319.*/)) {
									val.status_aset = 'CAPEX';
								} else if (val.orig_acct.match(/1320.*/)) {
									val.status_aset = 'ADK';
								}
							} else {
								if (val.status_aset == '-') {
									val.status_aset = 'ATS';
								}
							}
							self.sg1.addRowValues([
								val.no_aset,
								val.orig_acct,
								val.gl_acct,
								val.nama,
								val.icm,
								val.periode,
								val.cc,
								val.tp,
								val.klp_aset,
								val.tgl_perolehan,
								val.periode_susut,
								val.margin,
								val.umur,
								val.hp,
								val.ap,
								val.bp,
								val.peny_per_bln,
								val.bv,
								val.pajak,
								val.pajak_per_bln,
								val.bv_pajak,
								val.status,
								val.status_aset,
								"<center><i class='fa fa-eye' style='color:red;margin-top:2px'> </i>",
								"<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>"
							]);
						}
					});
				} else {
					self.alert("Kesalahan", "Data tidak ditemukan");
				}
			}
		});
	},
	loadID: function () {
		var self = this;
		self.app.services.callServices("financial_BsplMaster", "getIDTrf", [self.app._lokasi], function (data) {
			self.fID.setText(data.id_otomatis);
		});
	},
	doChange: function (sender) {
		try {
			if (sender == this.cb_pdrk) {
				if (this.cb_pdrk.getText() != "") {
					var self = this;
					self.loadDok(self.cb_pdrk.getText());
				};
			}
		} catch (e) {
			alert(e);
			error_log(e);
		}
	},
	doModalResult: function (event, modalResult) {
		if (modalResult != mrOk) return false;
		switch (event) {
			case "clear":
				break;
			case "simpan":
				this.simpan();
				break;
			case "simpancek":
				this.simpan();
				break;
			case "ubah":
				this.ubah();
				break;
			case "hapus":
				this.hapus();
				break;
		}
	}
});
