window.app_saku_report_fBSSumBspl = function (owner, pdrk) {
    if (owner) {
        window.app_saku_report_fBSSumBspl.prototype.parent.constructor.call(this, owner);
        this.className = "app_saku_report_fBSSumBspl";
        this.itemsValue = new arrayList();
        this.maximize();
        this.app._mainForm.childFormConfig(this, "mainButtonClick", "Report Summary BSPL", 0);

        uses("control_popupForm;column;datePicker;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");

        this.container = new panel(this, { bound: [0, 0, this.width - 10, this.height - 20] });

        this.tab = new pageControl(this.container, {
            bound: [20, 0, this.width - 60, this.height - 100],
            childPage: ["Report"],
            borderColor: "#35aedb", pageChange: [this, "doTabChange"], headerAutoWidth: false
        });

        this.tabSub = new pageControl(this.tab.childPage[0], {
            bound: [0, 150, this.width - 50, this.height - 175],
            childPage: ["Margin", "COGS", "Pajak"],
            borderColor: "#35aedb"
        });

        this.rearrangeChild(10, 22);

        this.SumBspl = new saiGrid(this.tab.childPage[0], {
            bound: [0, 150, this.width - 330, this.height - 210],
            colCount: 9, headerHeight: 50, pasteEnable: false,
            colTitle: [
                {
                    title: "ICM",
                    width: 100,
                },
                {
                    title: "Periode",
                    width: 80,
                },
                {
                    title: "COCD",
                    width: 80,
                },
                {
                    title: "TP",
                    width: 80,
                },
                {
                    title: "Revenue ICM",
                    width: 130,
                    columnAlign: "right"
                },
                {
                    title: "Revenue BSPL",
                    width: 130,
                    columnAlign: "right"
                },
                {
                    title: "COGS",
                    width: 130,
                    columnAlign: "right"
                },
                {
                    title: "Total Aset",
                    width: 130,
                    columnAlign: "right"
                },
                {
                    title: "Margin",
                    width: 130,
                    columnAlign: "right"
                },
            ],
            colFormat: [[4, 5, 6, 7, 8], [cfNilai, cfNilai, cfNilai, cfNilai, cfNilai]],
            autoPaging: true, rowPerPage: 50, readOnly: true
        });

        this.margin = new saiGrid(this.tabSub.childPage[0], {
            bound: [0, 0, this.width - 450, this.height - 210],
            colCount: 10, headerHeight: 40, pasteEnable: false,
            colTitle: [
                {
                    title: "ICM",
                    width: 100,
                    columnAlign: "bottom",
                    freeze: true
                },
                {
                    title: "COCD",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "COCD Lawan",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "BA",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "BATP",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "COA",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "GL Account",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "CURR",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "PERIOD",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "YTD-BALANCE MARGIN",
                    width: 130,
                    columnAlign: "right"
                }
            ],
            colFormat: [[9], [cfNilai]],
            autoPaging: true, rowPerPage: 50, readOnly: true
        });
        this.cogs = new saiGrid(this.tabSub.childPage[1], {
            bound: [0, 0, this.width - 450, this.height - 210],
            colCount: 10, headerHeight: 40, pasteEnable: false,
            colTitle: [
                {
                    title: "ICM",
                    width: 100,
                    columnAlign: "bottom",
                    freeze: true
                },
                {
                    title: "COCD",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "COCD Lawan",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "BA",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "BATP",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "COA",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "GL Account",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "CURR",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "PERIOD",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "YTD-BALANCE",
                    width: 130,
                    columnAlign: "right"
                },
            ],
            colFormat: [[9], [cfNilai]],
            autoPaging: true, rowPerPage: 50, readOnly: true
        });
        this.pajak = new saiGrid(this.tabSub.childPage[2], {
            bound: [0, 0, this.width - 450, this.height - 210],
            colCount: 10, headerHeight: 40, pasteEnable: false,
            colTitle: [
                {
                    title: "ICM",
                    width: 100,
                    columnAlign: "bottom",
                    freeze: true
                },
                {
                    title: "COCD",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "COCD Lawan",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "BA",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "BATP",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "COA",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "GL Account",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "CURR",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "PERIOD",
                    width: 80,
                    columnAlign: "bottom"
                },
                {
                    title: "YTD-BALANCE",
                    width: 130,
                    columnAlign: "right"
                },
            ],
            colFormat: [[9], [cfNilai]],
            autoPaging: true, rowPerPage: 50, readOnly: true
        });

        this.SumBspl.on("dblClick", (col, row) => {
            if (col != this.SumBspl) {
                this.SumBspl.hide();
                this.bBack.show();
                this.icm = this.SumBspl.cells(0, row);
                this.periode = this.SumBspl.cells(1, row);
                this.co_icm.setText(this.icm);
                this.tabSub.show();
                this.margin.clear();
                this.cogs.clear();
                this.pajak.clear();
                this.loadMargin();
                this.loadCogs();
                this.loadPajak();
            }
        });

        var self = this;

        this.pnl1 = new panel(this.tab.childPage[0], { bound: [0, 1, 685, 105], caption: "Filter Data", border: 1 });
        this.pnl1.getCanvas().css({ border: "2px solid gray", boxShadow: "0px 1px 2px #888" });
        this.fPeriode = new saiLabelEdit(this.pnl1, { bound: [10, 22, 170, 20], labelWidth: 80, caption: "Periode (YTD)", placeHolder: "YYYYMM" });
        this.co_cocd = new saiCBBL(this.pnl1, { bound: [10, 45, 140, 20], labelWidth: 80, caption: "COCD" });
        this.co_icm = new saiLabelEdit(this.pnl1, { bound: [230, 22, 200, 20], labelWidth: 80, caption: "ICM" });
        this.fTP = new saiCBBL(this.pnl1, { bound: [10, 67, 140, 20], labelWidth: 80, caption: "TP", change: [this, "doChange"] });
        this.co_fcbp = new saiCB(this.pnl1, { bound: [230, 45, 150, 20], labelWidth: 80, caption: "FCBP", items: ["FCBP01", "FCBP02", "FCBP03", "FCBP04", "FCBP05", "DWS", "DES/DBS"] });

        this.bOk = new button(this.pnl1, { bound: [580, 23, 80, 20], icon: "<i class='fa fa-check' style='color:white'></i>", caption: "Search", click: [this, "doClick"], keyDown: [this, "keyDown"] });
        this.bOk.setColor("#4cd137");
        this.b_exportXls = new button(this.pnl1, { bound: [580, 53, 80, 20], icon: "<i class='fa fa-download' style='color:white'></i>", caption: "Excel", click: [this, "doClick"] });
        this.bBack = new button(this.tab.childPage[0], { bound: [10, 120, 80, 20], icon: "<i class='fa fa-chevron-left' style='color:white'></i>", caption: "Back" });

        this.bBack.on("click", () => {
            this.bBack.hide();
            this.tabSub.hide();
            this.SumBspl.show();
            this.co_icm.setText("");
        });
        this.container.rearrangeChild(10, 50);

        this.setTabChildIndex();
        try {
            this.bBack.hide();
            this.tabSub.hide();
            this.fPeriode.setText(this.app._periode);
            this.co_cocd.setText(this.app._lokasi);
            this.co_cocd.setServices(this.app.servicesBpc, "callServices", ["financial_mantis", "getListCOCD", ["", "", "", 0]], ["cocd", "company_name"], " ", "Daftar CC");
            this.fTP.setServices(this.app.servicesBpc, "callServices", ["financial_BsplMaster", "getListCOCD", ["", "", "", 0]], ["cocd", "company_name"], " ", "Daftar Company Code");
        } catch (e) {
            systemAPI.alert(e);
        }
    }
};
window.app_saku_report_fBSSumBspl.extend(window.childForm);
window.app_saku_report_fBSSumBspl.implement({
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
    loadMargin: function () {
        var self = this;
        var filter = {
            periode: self.periode,
            icm: self.icm
        };
        this.app.services.callServices("financial_mantisRepSumBspl", "getMargin", [this.app._lokasi, filter], function (data) {
            if (typeof data != 'undefined' && data != null) {
                console.log(data);
                $.each(data.margin, function (k, val) {
                    if (typeof val.icm != 'undefined' && val.icm != null) {
                        self.margin.addRowValues([
                            val.icm,
                            val.cc,
                            val.tp,
                            val.bacc,
                            val.batp,
                            val.coa,
                            val.orig_acct,
                            val.curr,
                            val.periode,
                            val.margin
                        ]);
                    }
                });
            }
        });
    },
    loadCogs: function () {
        var self = this;
        var filter = {
            periode: self.periode,
            icm: self.icm
        };
        this.app.services.callServices("financial_mantisRepSumBspl", "getCogs", [this.app._lokasi, filter], function (data) {
            if (typeof data != 'undefined' && data != null) {
                console.log(data);
                $.each(data.cogs, function (k, val) {
                    if (typeof val.icm != 'undefined' && val.icm != null) {
                        self.cogs.addRowValues([
                            val.icm,
                            val.cc,
                            val.tp,
                            val.bacc,
                            val.batp,
                            val.coa,
                            val.orig_acct,
                            val.currency,
                            val.periode,
                            val.cogs
                        ]);
                    }
                });
            }
        });
    },
    loadPajak: function () {
        var self = this;
        var filter = {
            periode: self.periode,
            icm: self.icm
        };
        this.app.services.callServices("financial_mantisRepSumBspl", "getPajak", [this.app._lokasi, filter], function (data) {
            if (typeof data != 'undefined' && data != null) {
                console.log(data);
                $.each(data.pajak, function (k, val) {
                    if (typeof val.icm != 'undefined' && val.icm != null) {
                        self.pajak.addRowValues([
                            val.icm,
                            val.cc,
                            val.tp,
                            val.bacc,
                            val.batp,
                            val.coa,
                            val.kode_akun,
                            val.currency,
                            val.periode,
                            val.pajak
                        ]);
                    }
                });
            }
        });
    },
    doClick: function (sender) {
        if (sender == this.bOk) {
            if (this.fPeriode.getText() != '') {
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
        self.SumBspl.clear(0);
        self.bBack.hide();
        var filter = {
            periode: self.fPeriode.getText(),
            tp: self.fTP.getText(),
            cocd: self.co_cocd.getText(),
            icm: self.co_icm.getText(),
            fcbp: self.co_fcbp.getText()
        };
        this.app.services.callServices("financial_mantisRepSumBspl", "getSumBspl", [this.app._lokasi, filter], function (data) {
            if (typeof data != 'undefined' && data != null) {
                console.log(data);
                if (data.sum_bspl) {
                    $.each(data.sum_bspl, function (k, val) {
                        if (typeof val.icm != 'undefined' && val.icm != null) {
                            self.SumBspl.addRowValues([
                                val.icm,
                                val.periode,
                                val.cc,
                                val.tp,
                                val.revenue_icm,
                                val.revenue_bspl,
                                val.cogs,
                                val.total_aset,
                                val.margin
                            ]);
                        }
                    });
                } else {
                    self.alert("Peringatan", "Data tidak ditemukan");
                }
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