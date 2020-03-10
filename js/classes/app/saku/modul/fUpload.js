window.app_saku_modul_fUpload = function(owner)
{
	if (owner)
	{
		window.app_saku_modul_fUpload.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fUpload";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick","Upload Saldo Awal Maret", 0);

        uses("control_popupForm;column;saiEdit;saiGrid;saiUpload;portalui_uploader", true);			
        
        this.ePeriode = new saiLabelEdit(this, {bound:[20,2, 200,20], caption:"Periode"});
        this.cocd = new saiCBBL(this,{bound:[20,20,200,20],caption:"Comp. Code",readOnly:false});
        this.tp = new saiCBBL(this,{bound:[20,21,200,20],caption:"TP",readOnly:false,change:[this,"doChange"],tag:1});
        this.jasa = new saiCBBL(this,{bound:[20,45,200,20],caption:"Jasa", tag:1});	
        this.bReload = new button(this,{bound:[250,13,130,20],icon:"<i class='fa fa-refresh' style='color:white'></i>", caption:"Reload"});
        this.bReload.on("click", () => {
            this.app.services.callServices("financial_mantisUpload","getListBARekon",[this.ePeriode.getText(), this.cocd.getText(), this.tp.getText(), this.jasa.getText() ], (data) => {
				this.sg.clear();
                $.each(data.rs.rows, (key, val) => {
                    this.sg.addRowValues([val.icm, val.ba_rekon,val.jenis_rekon, val.cocd, val.tp, val.fcbp, val.kode_jasa, val.jenis_jasa,  "<center><i class='fa fa-eye' style='color:blue;margin-top:2px'> </i>"]);
                });
            });

        });
        this.bClose = new button(this,{bound:[this.width - 140,13,130,20],icon:"<i class='fa fa-close' style='color:white'></i>", caption:"Tutup Report BA"});
        this.bClose.on("click",() => {
            this.dokViewer.hide();
            this.bClose.hide();
        });
        this.bClose.hide();
        this.eUpload = new saiUpload(this, {bound:[20,13,100,20], caption:"<i class='fa fa-upload' /> Upload"});
			this.eUpload.on("change",  (file) => {
				this.eUpload.setAddParam({service:"callServices",dataType:"xls", param: ["financial_mantisUpload","uploadSO",[this.ePeriode.getText()] ], fields:[]});
				//self.eFile.setText(file);
				this.eUpload.submit();
				this.app._mainForm.pTrans.show();
            });
            this.eUpload.on("onload", (data) => {
				this.info("Done Upload", JSON.stringify(data.contents) );
				// this.RefreshList();
            });

        this.eUpload2 = new saiUpload(this, {bound:[140,13,100,20], caption:"<i class='fa fa-upload' /> Upload BA"});
			this.eUpload2.on("change",  (file) => {
				this.eUpload2.setAddParam({service:"callServices",dataType:"xls", param: ["financial_mantisUpload","uploadSOBA",[this.ePeriode.getText()] ], fields:[]});
				this.eUpload2.submit();
				
            });
            this.eUpload2.on("onload", (data) => {
				this.info("Done Upload", JSON.stringify(data.contents) );
				
            });

        
            
        this.sg = new saiGrid(this,{bound:[20,14,this.width - 40,this.height - 150], 
                colCount: 9, autoPaging : true, rowPerPage : 50,
                headerHeight: 60,
                colTitle:["New ICM","BA Rekon","Jenis Rekon","CC","TP","FCBP","Kode Jasa","Jenis Jasa","View BA"],
                colWidth:[[8, 7,6, 5, 4,3,2,1,0],
                          [80,250,80, 80,80,80,250,120,120]]});
        this.sg.setHeaderHeight(60);

        this.rearrangeChild(20,23);

        this.dokViewer = new control(this, {bound:[20,this.sg.top, this.width-40, this.height-150 ]});	
		var luas = this.width;	
		var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
		this.dokViewer.getCanvas().append(frame);
        this.dokViewer.frame = frame;
        
        this.dokViewer.hide();
        this.sg.on("dblClick", (col, row) =>{
            
            this.dokViewer.show();
            this.bClose.show();
            this.getReport("getViewBA",[this.sg.cells(0, this.sg.row), this.sg.cells(1, this.sg.row)], this.dokViewer.frame);
        });
        this.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
		this.tp.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			
		this.jasa.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
		this.cocd.setText(this.app._lokasi);
	}
};
window.app_saku_modul_fUpload.extend(window.childForm);
window.app_saku_modul_fUpload.implement({	
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisUpload", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
});
