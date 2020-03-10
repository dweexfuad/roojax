window.app_saku_report_fHistReklas = function (owner, pdrk) {
	if (owner) {
		window.app_saku_report_fHistReklas.prototype.parent.constructor.call(this, owner);
		this.className = "app_saku_report_fHistReklas";
		this.itemsValue = new arrayList();
		this.maximize();
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Report History Reklas", 0);

		uses("control_popupForm;column;datePicker;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");

		this.container = new panel(this, { bound: [0, 0, this.width - 10, this.height - 20] });

		this.tab = new pageControl(this.container, {
			bound: [20, 0, this.width - 60, this.height - 100],
			childPage: ["Report"],
			borderColor: "#35aedb", pageChange: [this, "doTabChange"], headerAutoWidth: false
		});

		this.rearrangeChild(10, 22);

		this.HistReklas = new saiGrid(this.tab.childPage[0], {
			bound: [0, 150, this.width - 720, this.height - 250],
			colCount: 6, headerHeight: 50, pasteEnable: false,
			colTitle: [
				{
					title: "ICM",
					width: 100,
				},
				{
					title: "No ADK",
					width: 80,
				},
				{
					title: "No Aset",
					width: 80,
				},
				{
					title: "Kelas Aset",
					width: 80,
				},
				{
					title: "Nilai",
					width: 130,
					columnAlign: "right"
				},
				{
					title: "Pajak",
					width: 130,
					columnAlign: "right"
				}
			],
			colFormat: [[4, 5], [cfNilai, cfNilai]],
			autoPaging: true, rowPerPage: 50, readOnly: true
		});

		var self = this;

		this.pnl1 = new panel(this.tab.childPage[0], { bound: [0, 1, 585, 80], caption: "Filter Data", border: 1 });
		this.pnl1.getCanvas().css({ border: "2px solid gray", boxShadow: "0px 1px 2px #888" });
		this.co_icm = new saiLabelEdit(this.pnl1, { bound: [10, 22, 200, 20], labelWidth: 80, caption: "ICM" });
		this.fKlp = new saiLabelEdit(this.pnl1, { bound: [250, 22, 200, 20], labelWidth: 100, caption: "Kelompok Aset", placeHolder: "Pilih Klp Aset" });
		this.fPeriode = new saiLabelEdit(this.pnl1, { bound: [10, 46, 170, 20], labelWidth: 80, caption: "Periode", placeHolder: "YYYYMM" });
		this.bOk = new button(this.pnl1, { bound: [480, 22, 80, 20], icon: "<i class='fa fa-check' style='color:white'></i>", caption: "Search", click: [this, "doClick"], keyDown: [this, "keyDown"] });
		this.bOk.setColor("#4cd137");

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

		this.container.rearrangeChild(10, 50);

		this.setTabChildIndex();
		try {
			this.fPeriode.setText(this.app._periode);

		} catch (e) {
			systemAPI.alert(e);
		}
	}
};
window.app_saku_report_fHistReklas.extend(window.childForm);
window.app_saku_report_fHistReklas.implement({
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
		if (sender == this.bOk) {
			if (param) {
				this.loadReport();
			} else {
				system.alert(self, "Inputan Tidak Boleh Kosong");
			}
		} else if (sender == this.b_exportXls) {
			this.doExport();
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
		self.HistReklas.clear(0);
		var filter = {
			periode: self.fPeriode.getText(),
			icm: self.co_icm.getText(),
			klp: self.fKlp.getText()
		};
		this.app.services.callServices("financial_mantisRepSumBspl", "getHistReklas", [this.app._lokasi, filter], function (data) {
			if (typeof data != 'undefined' && data != null) {
				console.log(data);
				$.each(data.hist, function (k, val) {
					if (typeof val.icm != 'undefined' && val.icm != null) {
						self.HistReklas.addRowValues([
							val.icm,
							val.akun_reklas,
							val.no_aset,
							val.klp_aset,
							val.margin,
							val.pajak
						]);
					}
				});
			}
		});
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