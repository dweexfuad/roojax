window.app_saku_modul_fBSUserLog = function (owner, pdrk) {
    if (owner) {
        window.app_saku_modul_fBSUserLog.prototype.parent.constructor.call(this, owner);
        this.className = "app_saku_modul_fBSUserLog";
        this.itemsValue = new arrayList();
        this.maximize();
        this.app._mainForm.childFormConfig(this, "mainButtonClick", "User Log", 99);

        uses("control_popupForm;datePicker;column;saiMemo;pageControl;saiEdit;saiGrid;saiCBBL;childPage;panel;portalui_uploader;highchart;sgNavigator;util_financeLib;column;saiTreeGrid;saiTreeGridNode;util_standar;frame;util_file;tinymceCtrl;listCustomView;reportViewer");

        this.container = new panel(this, { bound: [0, 0, this.width - 10, this.height - 20] });

        this.tab = new pageControl(this.container, {
            bound: [20, 0, this.width - 60, this.height - 100],
            childPage: ["Data User Log"],
            borderColor: "#35aedb", pageChange: [this, "doTabChange"], headerAutoWidth: false
        });
        this.rearrangeChild(10, 22);

        this.pnl = new panel(this.tab.childPage[0], { bound: [(10), 5, 480, 150], caption: "Filter Data", border: 1 });
        this.pnl.getCanvas().css({ border: "2px solid gray", boxShadow: "0px 1px 2px #888" });

        this.fPeriode = new saiLabelEdit(this.pnl, { bound: [10, 25, 150, 20], labelWidth: 80, caption: "Periode", placeHolder: "YYYY" });
        this.fCOCD = new saiCBBL(this.pnl, { bound: [10, 50, 150, 20], labelWidth: 80, caption: "COCD", change: [this, "doChange"] });
        this.fUser = new saiLabelEdit(this.pnl, { bound: [10, 75, 150, 20], labelWidth: 80, caption: "User", placeHolder: "" });
        this.fTP = new saiCBBL(this.pnl, { bound: [280, 25, 150, 20], labelWidth: 80, caption: "TP", change: [this, "doChange"] });
        this.fTglApp = new datePicker(this.pnl, { bound: [280, 50, 170, 20], labelWidth: 80, readOnly: true, caption: "Tgl App", placeHolder: "dd/mm/yyyy" });
        this.fStatus = new saiCB(this.pnl, { bound: [10, 100, 150, 20], labelWidth: 80, caption: "Status", items: ["KOREKSI", "OOPEN", "SUBMIT", "DRAFT", "KOREKSI_UMUR", "DEPRESIASI", "RETURN", "DONE", "PIC", "REKLAS", "TERMINATE"] });
        this.fAset = new saiLabelEdit(this.pnl, { bound: [280, 75, 190, 20], labelWidth: 80, caption: "No.Aset", placeHolder: "" });
        this.fICM = new saiLabelEdit(this.pnl, { bound: [280, 100, 190, 20], labelWidth: 80, caption: "ICM", placeHolder: "" });
        this.bSearch = new button(this.pnl, { bound: [400, 125, 70, 20], icon: "<i class='fa fa-search' style='color:white'></i>", caption: "Search ", click: [this, "doClick"], keyDown: [this, "keyDown"] });
        this.sg1 = new saiGrid(this.tab.childPage[0], {
            bound: [10, 165, this.tab.width - 30, 260],
            tag: 9,
            readOnly: true,
            colCount: 9,
            colWidth: [[8, 7, 6, 5, 4, 3, 2, 1, 0], [350, 350, 80, 80, 80, 80, 80, 80, 80]],
            colTitle: ["ICM", "Periode", "User ID", "COCD", "TP", "Tgl.App", "Status", "Message", "No.Aset"],
            rowPerPage: 10
        });

        this.container.rearrangeChild(10, 50);

        this.setTabChildIndex();
        try {
            var self = this;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            self.fPeriode.setText(yyyy + mm);
            this.fCOCD.setServices(this.app.servicesBpc, "callServices", ["financial_BsplMaster", "getListCOCD", ["", "", "", 0]], ["cocd", "company_name"], " ", "Daftar Company Code");
            this.fTP.setServices(this.app.servicesBpc, "callServices", ["financial_BsplMaster", "getListCOCD", ["", "", "", 0]], ["cocd", "company_name"], " ", "Daftar Company Code");
        } catch (e) {
            systemAPI.alert(e);
        }
    }
};
window.app_saku_modul_fBSUserLog.extend(window.childForm);
window.app_saku_modul_fBSUserLog.implement({
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
        if (sender == this.bSearch) {
            this.loadLog();
        }
    },
    doExport: function () {
        var self = this;
        self.showLoading("Export to Xls...");
        this.app.services.callServices("financial_BsplMaster", "xlsJurnalByJenis", [self.app._lokasi, '', 'CF'], function (data) {
            self.hideLoading();
            window.open("./server/reportDownloader.php?f=" + data + "&n=" + "JURNAL_CARRY_FORWARD.xlsx");
        }, function () {
            self.hideLoading();
        });
    },
    loadLog: function () {
        let self = this;
        let filter = {
            periode: self.fPeriode.getText(),
            cocd: self.fCOCD.getText(),
            tp: self.fTP.getText(),
            user: self.fUser.getText(),
            tgl: self.fTglApp.getText(),
            status: self.fStatus.getText(),
            aset: self.fAset.getText(),
            icm: self.fICM.getText()
        }
        self.sg1.clear(0);
        this.app.services.callServices("financial_mantisRepSumBspl", "getUserLog", [filter], function (data) {
            if (data.log) {
                if (typeof data != 'undefined' && data != null) {
                    console.log(data);
                    $.each(data.log, function (k, val) {
                        if (typeof val.userid != 'undefined' && val.userid != null) {
                            self.sg1.addRowValues([
                                val.icm,
                                val.periode,
                                val.userid,
                                val.cocd,
                                val.tp,
                                val.tgl_app,
                                val.status,
                                val.log_msg,
                                val.no_aset
                            ]);
                        }
                    });
                }
            } else {
                system.alert(self, "Data Tidak Ditemukan");
            }
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
