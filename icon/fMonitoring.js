//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors
//* 			SAI, PT
//***********************************************************************************************
//
window.app_rra_dashboard_fMonitoring = function(owner,options){
	try{
		if (owner)
		{
			window.app_rra_dashboard_fMonitoring.prototype.parent.constructor.call(this, owner,options);
			this.className = "app_rra_dashboard_fMonitoring";
			this.maximize();
			this.app._mainForm.childFormConfig(this, "mainButtonClick","Monitoring Opex",99);
			this.setTop(55);
			this.setHeight(this.height + 40);
            this.onClose.set(this,"doClose");
            this.initComponent();
            uses("util_gridLib;app_rra_remote_dataProvider",true);
            this.gridLib = new util_gridLib();
            this.dataProviderPDRK = new app_rra_remote_dataProvider();
            this.dataProviderPDRK.addListener(this);
		}
	}catch(e)
	{
		alert("[app_rra_dashboard_fMonitoring]::contruct:"+e,"");
	}
};
window.app_rra_dashboard_fMonitoring.extend(window.childForm);
window.app_rra_dashboard_fMonitoring.implement({
	doAfterResize: function(width, height){
	   this.setTop(55);
	 //  this.setHeight(height + 40);
    },
    doClose: function(sender){
        this.app._mainForm.pButton.show();
        this.dbLib.delListener(this);
    },
    initComponent: function(){
		try{
			uses("util_standar;button;saiGrid;sgNavigator;toolbar;pageControl;roundPanel;datePicker;radioButton;util_filterRep;reportViewer");
			uses("uploader",true);
			this.standarLib = new util_standar();
			this.dbLib = this.app.dbLib;
			this.dbLib.addListener(this);

			this.p1mp = new pageControl(this,{bound:[10,5,this.width - 25,this.height - 80],
				childPage:["Daftar PDRK","Log Catatan","PDRK","Review UBIS","Review Grup UBIS","Review MA","Review FC","SUKKA", "Tracking PDRK","Dokumen Pendukung"]});

			this.toolbar = new toolbar(this,{bound:[this.width - 80,5,75,25],buttonClick:[this,"doToolBarClick"]});
			this.toolbar.addButton("bFilter","Filter","icon/dynpro/filter2.png","Filter");
			this.toolbar.makeRound(5);

			this.pNIK = new panel(this,{bound:[this.width / 2 - 200,10,400,80], caption:"Ubah NIK", visible:false});
			this.cbNIK = new saiCBBL(this.pNIK, {bound:[10,25,200,20],caption:"NIK",
					multiSelection:false,
					sql : ["select nik, nama from rra_karyawan",["nik","nama"],false,["NIK","Nama"],"","Daftar Karyawan",true]

				});

			this.bOK = new button(this.pNIK, {bound:[10,55,80,20], caption:"OK", click:[this,"doUpdateNIK"]});
			this.bCancel = new button(this.pNIK, {bound:[300,55,80,20], caption:"Cancel", click:[this,"doUpdateNIK"]});

			this.pSMSNIK = new panel(this,{bound:[this.width / 2 - 200,10,800,100], caption:"Kirim Notifikasi SMS", visible:false});
			this.cbSMSNIK = new saiCBBL(this.pSMSNIK, {bound:[10,25,200,20],caption:"NIK",
					multiSelection:false,
					sql : ["select nik, nama from rra_karyawan",["nik","nama"],false,["NIK","Nama"],"","Daftar Karyawan",true]

				});
			this.eSMSKet = new saiLabelEdit(this.pSMSNIK, {bound:[10,48,700,20 ], caption:"Text"});
			this.bSMSOK = new button(this.pSMSNIK, {bound:[10,70,80,20], caption:"Send", click:[this,"doSendSMS"]});
			this.bSMSCancel = new button(this.pSMSNIK, {bound:[600,70,80,20], caption:"Cancel", click:[this,"doSendSMS"]});

			this.pDataPDRK = new panel(this,{bound:[this.width / 2 - 200,10,800,300], caption:"Update Progress", visible:false});
			this.eJudul = new saiLabelEdit(this.pDataPDRK, {bound:[10,2,700,20 ], caption:"Kegiatan"});
			this.eProgress = new saiLabelEdit(this.pDataPDRK, {bound:[10,1,200,20 ], caption:"Progress"});
			this.bProgOk = new button(this.pDataPDRK, {bound:[10,70,80,20], caption:"Send", click:[this,"doUpdatePDRK"]});
			this.bProgCancel = new button(this.pDataPDRK, {bound:[600,70,80,20], caption:"Cancel", click:[this,"doUpdatePDRK"]});
			this.pDataPDRK.rearrangeChild(25,23);

			this.sg1mp = new saiGrid(this.p1mp.childPage[0], {
				bound: [1, 0, this.p1mp.width - 4, this.p1mp.height - 30],
				colCount: 11,
				colTitle: ["Status UBIS","Status GUBIS","Status MA","Status FC","Proses SAP","No PDRK","UBIS","Tanggal","Keterangan","Nilai Usulan","Jenis"],
				colWidth: [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], [100,100,250,100,100,150,100,150,150,150,150]],
				dblClick: [this, "sg1onDblClick"],
				colFormat: [[9],

				[cfNilai]],
				colAlign: [[0,1,2,3,4,6,7,9,10], [alCenter, alCenter, alCenter, alCenter, alCenter,  alCenter, alCenter, alCenter, alCenter]],
				readOnly: true
			});
            this.sgn = new sgNavigator(this.p1mp.childPage[0], {
				bound: [1, this.sg1mp.height + 2, this.p1mp.width - 4, 25],
				buttonStyle: -1,
				pager: [this, "doPager"],
				grid: this.sg1mp
			});
			this.bRefresh = new button(this.sgn, {bound:[this.sgn.width - 90, 2, 80, 18], caption:"Refresh", click:[this,"doClick"]});
			this.viewer = new reportViewer(this.p1mp.childPage[2],{bound:[0,0,this.p1mp.width - 3, this.p1mp.height - 25]});
			this.bPrint = new button(this.p1mp.childPage[2],{bound:[this.p1mp.width - 100,10,80, 20], caption:"Print", click:[this,"doPrint"]});
			this.bUpdatePeriode = new button(this.sgn, {bound:[this.sgn.width - 190, 2, 80, 18],caption:"Update Periode", click:[this, "updatePeriode"], visible: this.app._statusLokasiUser == "FC"});
			var page2 = this.p1mp.childPage[3];
			page2.no_rev = new saiLabelEdit(page2,{bound:[10,1,200,20], caption:"No Review", readOnly:true, tag:1});
			page2.jenis = new saiLabelEdit(page2,{bound:[410,1,200,20], caption:"Jenis", readOnly:false, tag:1});
			page2.bJenis = new button(page2, {bound:[620,1,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.ubis = new saiLabelEdit(page2,{bound:[10,2,300,20], caption:"UBIS", readOnly:true, tag:1});
			page2.modul = new saiLabelEdit(page2,{bound:[410,2,200,20], caption:"Modul", readOnly:true, tag:1});
			page2.tgl = new saiLabelEdit(page2,{bound:[10,3,200,20], caption:"Tanggal", readOnly:true, tag:1});
			page2.nilai = new saiLabelEdit(page2,{bound:[410,3,200,20], caption:"Nilai Usulan", readOnly:true, tag:1, tipeText:ttNilai});
			page2.ket = new saiLabelEdit(page2,{bound:[10,4,600,20], caption:"Keterangan", readOnly:false, tag:1});
			page2.bKet = new button(page2, {bound:[620,4,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.nd = new saiLabelEdit(page2,{bound:[10,6,400,20], caption:"No Nota Dinas", readOnly:true, tag:1});
			page2.eProg = new saiLabelEdit(page2,{bound:[410,6,200,20], caption:"Progress", readOnly:false, tag:1});
			page2.bProg = new button(page2, {bound:[620,6,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.filend = new saiLabelEdit(page2,{bound:[10,7,400,20], caption:"File NoDin", readOnly:true, tag:1});
			page2.mDesk = new tinymceCtrl(page2,{bound:[10,8,800,300], withForm:false});

			page2.rearrangeChild(10,23);
			page2.bSave = new button(page2, {bound:[720,page2.mDesk.top + 2,80,20],caption:"Save", click:[this,"doUpdatePDRK"]});

			page2 = this.p1mp.childPage[4];
			page2.no_rev = new saiLabelEdit(page2,{bound:[10,1,200,20], caption:"No Review", readOnly:true, tag:1});
			page2.jenis = new saiLabelEdit(page2,{bound:[410,1,200,20], caption:"Jenis", readOnly:false, tag:1});
			page2.bJenis = new button(page2, {bound:[620,1,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.ubis = new saiLabelEdit(page2,{bound:[10,2,300,20], caption:"GUBIS", readOnly:true, tag:1});
			page2.modul = new saiLabelEdit(page2,{bound:[410,2,200,20], caption:"Modul", readOnly:true, tag:1});
			page2.tgl = new saiLabelEdit(page2,{bound:[10,3,200,20], caption:"Tanggal", readOnly:true, tag:1});
			page2.nilai = new saiLabelEdit(page2,{bound:[410,3,200,20], caption:"Nilai Usulan", readOnly:true, tipeText:ttNilai, tag:1});
			page2.ket = new saiLabelEdit(page2,{bound:[10,4,600,20], caption:"Keterangan", readOnly:false, tag:1});
			page2.bKet = new button(page2, {bound:[620,4,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.nd = new saiLabelEdit(page2,{bound:[10,6,400,20], caption:"No Nota Dinas", readOnly:true, tag:1});
			page2.eProg = new saiLabelEdit(page2,{bound:[410,6,200,20], caption:"Progress", readOnly:false, tag:1});
			page2.bProg = new button(page2, {bound:[620,6,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.filend = new saiLabelEdit(page2,{bound:[10,7,400,20], caption:"File NoDin", readOnly:true, tag:1});
			page2.mDesk = new tinymceCtrl(page2,{bound:[10,8,800,300], withForm:false});

			page2.rearrangeChild(10,23);
			page2.bSave = new button(page2, {bound:[720,page2.mDesk.top + 2,80,20],caption:"Save", click:[this,"doUpdatePDRK"]});

			page2 = this.p1mp.childPage[5];
			page2.no_rev = new saiLabelEdit(page2,{bound:[10,1,200,20], caption:"No Review", readOnly:true, tag:1});
			page2.jenis = new saiLabelEdit(page2,{bound:[410,1,200,20], caption:"Jenis", readOnly:false, tag:1});
			page2.bJenis = new button(page2, {bound:[620,1,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.ubis = new saiLabelEdit(page2,{bound:[10,2,300,20], caption:"GUBIS", readOnly:true, tag:1});
			page2.modul = new saiLabelEdit(page2,{bound:[410,2,200,20], caption:"Modul", readOnly:true, tag:1});
			page2.tgl = new saiLabelEdit(page2,{bound:[10,3,200,20], caption:"Tanggal", readOnly:true, tag:1});
			page2.nilai = new saiLabelEdit(page2,{bound:[410,3,200,20], caption:"Nilai Usulan", readOnly:true, tipeText:ttNilai, tag:1});
			page2.ket = new saiLabelEdit(page2,{bound:[10,4,600,20], caption:"Keterangan", readOnly:false, tag:1});
			page2.bKet = new button(page2, {bound:[620,4,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.nd = new saiLabelEdit(page2,{bound:[10,6,400,20], caption:"No Nota Dinas", readOnly:true, tag:1});
			page2.eProg = new saiLabelEdit(page2,{bound:[410,6,200,20], caption:"Progress", readOnly:false, tag:1});
			page2.bProg = new button(page2, {bound:[620,6,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.filend = new saiLabelEdit(page2,{bound:[10,7,400,20], caption:"File NoDin", readOnly:true, tag:1});
			page2.mDesk = new tinymceCtrl(page2,{bound:[10,8,800,300], withForm:false});
			page2.rearrangeChild(10,23);
			page2.bSave = new button(page2, {bound:[720,page2.mDesk.top + 2,80,20],caption:"Save", click:[this,"doUpdatePDRK"]});


			page2 = this.p1mp.childPage[6];
			page2.no_rev = new saiLabelEdit(page2,{bound:[10,1,200,20], caption:"No Review", readOnly:true, tag:1});
			page2.jenis = new saiLabelEdit(page2,{bound:[410,1,200,20], caption:"Jenis", readOnly:false, tag:1});
			page2.bJenis = new button(page2, {bound:[620,1,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.ubis = new saiLabelEdit(page2,{bound:[10,2,300,20], caption:"GUBIS", readOnly:true, tag:1});
			page2.modul = new saiLabelEdit(page2,{bound:[410,2,200,20], caption:"Modul", readOnly:true, tag:1});
			page2.tgl = new saiLabelEdit(page2,{bound:[10,3,200,20], caption:"Tanggal", readOnly:true, tag:1});
			page2.nilai = new saiLabelEdit(page2,{bound:[410,3,200,20], caption:"Nilai Usulan", readOnly:true, tipeText:ttNilai, tag:1});
			page2.ket = new saiLabelEdit(page2,{bound:[10,4,600,20], caption:"Keterangan", readOnly:false, tag:1});
			page2.bKet = new button(page2, {bound:[620,4,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.nd = new saiLabelEdit(page2,{bound:[10,6,400,20], caption:"No Nota Dinas", readOnly:true, tag:1});
			page2.eProg = new saiLabelEdit(page2,{bound:[410,6,200,20], caption:"Progress", readOnly:false, tag:1});
			page2.bProg = new button(page2, {bound:[620,6,80,20],caption:"Update", click:[this,"doUpdatePDRK"]});
			page2.filend = new saiLabelEdit(page2,{bound:[10,7,400,20], caption:"File NoDin", readOnly:true, tag:1});
			page2.mDesk = new tinymceCtrl(page2,{bound:[10,8,800,300], withForm:false});
			page2.rearrangeChild(10,23);
			page2.bSave = new button(page2, {bound:[720,page2.mDesk.top + 2,80,20],caption:"Save", click:[this,"doUpdatePDRK"]});

			page2 = this.p1mp.childPage[7];
			page2.no_rev = new saiLabelEdit(this.p1mp.childPage[7],{bound:[10,1,200,20], caption:"No SUKKA", readOnly:true, tag:1});
			page2.ubis = new saiLabelEdit(this.p1mp.childPage[7],{bound:[10,2,300,20], caption:"UBIS", readOnly:true, tag:1});
			page2.tgl = new saiLabelEdit(this.p1mp.childPage[7],{bound:[10,3,200,20], caption:"Tanggal", readOnly:true, tag:1});
			page2.jenis = new saiLabelEdit(this.p1mp.childPage[7],{bound:[10,8,200,20], caption:"Jenis", readOnly:true, tag:1});
			page2.modul = new saiLabelEdit(this.p1mp.childPage[7],{bound:[10,9,200,20], caption:"Modul", readOnly:true, tag:1});
			page2.sukka = new control(this.p1mp.childPage[7],{bound:[10,9,200,20], caption:"Modul", readOnly:true, tag:1});
            page2.mDesk = new tinymceCtrl(page2,{bound:[10,8,800,300], withForm:false});
			page2.rearrangeChild(10,23);
			page2.bSave = new button(page2, {bound:[720,page2.mDesk.top + 2,80,20],caption:"Save", click:[this,"doUpdatePDRK"]});

			//tracking
			page2 = this.p1mp.childPage[8];
			page2.lPDRK = new label(page2, {bound:[10,0,500,30], caption:" NO PDRK : ", fontSize:18});
			page2.lProgress = new label(page2, {bound:[10,1,500,30], caption:" ", fontSize:12, fontColor:"#000099"});
			page2.lCatatan = new label(page2, {bound:[10,3,800,30], caption:" ", fontSize:14});
			page2.lSpace = new label(page2, {bound:[10,2,500,60], caption:" ", fontSize:18});
			page2.pO = new panel (page2, {bound:[5,3,this.p1mp.width - 30, this.p1mp.height - 100],caption: "OPEX"});
			page2.pO.getClientCanvas().style.overflow = "auto";
			page2.pO.getClientCanvas().style.top = "25";
			page2.pO.getClientCanvas().style.height = page2.pO.height - 30;

			page2.p1 = new panel(page2.pO,{bound:[10,1,450,150], caption:"Proses UBIS"});
			page2.p1.ePengaju = new saiLabelEdit(page2.p1,{bound:[10,3,300,20], caption:"Pengaju", readOnly:true, tag:1, dblClick:[this,"doChangeNIK"]});
			page2.p1.tPengaju = new saiLabelEdit(page2.p1,{bound:[320,3,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p1.ePengaju.tglObj = page2.p1.tPengaju;
			page2.p1.eReview = new saiLabelEdit(page2.p1,{bound:[10,4,300,20], caption:"Review", readOnly:true, tag:1, dblClick:[this,"doChangeNIK"]});
			page2.p1.tReview = new saiLabelEdit(page2.p1,{bound:[320,4,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p1.eReview.tglObj = page2.p1.tReview;
			page2.p1.eApp1 = new saiLabelEdit(page2.p1,{bound:[10,5,300,20], caption:"Approve Agg", readOnly:true, dblClick:[this,"doChangeNIK"], tag:1});
			page2.p1.tApp1 = new saiLabelEdit(page2.p1,{bound:[320,5,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p1.eApp1.tglObj = page2.p1.tApp1;
			page2.p1.bApp1 = new imageButton(page2.p1,{bound:[425,5,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p1.bApp1.edit = page2.p1.eApp1;page2.p1.bApp1.status = 'UBIS';
			page2.p1.eApp2 = new saiLabelEdit(page2.p1,{bound:[10,6,300,20], caption:"App. Pnj. Prog.", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p1.tApp2 = new saiLabelEdit(page2.p1,{bound:[320,6,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p1.eApp2.tglObj = page2.p1.tApp2;
			page2.p1.bApp2 = new imageButton(page2.p1,{bound:[425,6,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p1.bApp2.edit = page2.p1.eApp2;page2.p1.bApp2.status = 'UBIS';
			page2.p1.eApp3 = new saiLabelEdit(page2.p1,{bound:[10,7,300,20], caption:"Mengetahui.", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p1.tApp3 = new saiLabelEdit(page2.p1,{bound:[320,7,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p1.eApp3.tglObj = page2.p1.tApp3;
            page2.p1.bApp3 = new imageButton(page2.p1,{bound:[425,7,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p1.bApp3.edit = page2.p1.eApp3;page2.p1.bApp2.status = 'UBIS';

            page2.p1.rearrangeChild(25,23);
            page2.p6 = new panel(page2.pO,{bound:[470,1,450,150], caption:"Reviewer Pengelola Anggaran"});
			page2.p6.eReview = new saiLabelEdit(page2.p6,{bound:[10,3,300,20], caption:"Approve Agg.", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p6.tReview = new saiLabelEdit(page2.p6,{bound:[320,3,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p6.eReview.tglObj = page2.p6.tReview;
			page2.p6.eKeep = new saiLabelEdit(page2.p6,{bound:[10,4,300,20], caption:"Reviewer 1", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p6.tKeep = new saiLabelEdit(page2.p6,{bound:[320,4,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p6.eKeep.tglObj = page2.p6.tKeep;
			page2.p6.bRev1 = new imageButton(page2.p6,{bound:[425,4,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p6.bRev1.edit = page2.p6.eKeep;page2.p6.bRev1.status = 'UBIS';
			page2.p6.eReview2 = new saiLabelEdit(page2.p6,{bound:[10,5,300,20], caption:"Reviewer 2", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p6.tReview2 = new saiLabelEdit(page2.p6,{bound:[320,5,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p6.eReview2.tglObj = page2.p6.tReview2;
			page2.p6.bRev2 = new imageButton(page2.p6,{bound:[425,5,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p6.bRev2.edit = page2.p6.eReview2;page2.p6.bRev2.status = 'UBIS';
			page2.p6.eApp1 = new saiLabelEdit(page2.p6,{bound:[10,6,300,20], caption:"Reviewer 3", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p6.tApp1 = new saiLabelEdit(page2.p6,{bound:[320,6,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p6.eApp1.tglObj = page2.p6.tApp1;
			page2.p6.bRev3 = new imageButton(page2.p6,{bound:[425,6,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p6.bRev3.edit = page2.p6.eApp1;page2.p6.bRev3.status = 'UBIS';
			page2.p6.eSAP = new saiLabelEdit(page2.p6,{bound:[10,7,300,20], caption:"Reviewer 4", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p6.tSAP = new saiLabelEdit(page2.p6,{bound:[320,7,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p6.eSAP.tglObj = page2.p6.tSAP;
            page2.p6.bRev4 = new imageButton(page2.p6,{bound:[425,7,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p6.bRev4.edit = page2.p6.eSAP;page2.p6.bRev4.status = 'UBIS';
			page2.p6.rearrangeChild(25,23);

            page2.pO.bSMS = new button(page2.pO,{bound:[930, 1, 80, 20], caption:"Send SMS", click:[this, "clickSendSMS"]});
            page2.pO.bBatal = new button(page2.pO,{bound:[930, 2, 80, 20], caption:"Batal", click:[this, "doBatalPDRK"], visible: this.app._statusLokasiUser == 'FC'});
           	this.eCatatan = new saiLabelEdit(page2.pO,{bound:[930, 2, 300, 20], caption:"Catatan", click:[this, "doBatalPDRK"], visible: this.app._statusLokasiUser == 'FC'});
		   	page2.pO.bSukka = new button(page2.pO,{bound:[930, 4, 80, 20], caption:"No SUKKA", click:[this, "doGenNoSUKKA"]});


            page2.p7 = new panel(this.p1mp.childPage[1],{bound:[5,5,this.p1mp.width - 20,this.p1mp.height - 20], caption:"History Catatan"});
			page2.p7.eLog = new control(page2.p7,{bound:[0,0,page2.p7.width -2, page2.p7.height - 25]});
			page2.p7.getClientCanvas().style.top = '25';
			page2.p7.getClientCanvas().style.overflow = 'auto';
			page2.p7.getClientCanvas().style.height = page2.p7.height - 50;
			page2.p7.eLog.getCanvas().style.margin = "10px";
			/*sg = new saiGrid(page2.p7,{bound:[0,25,page2.p7.width -2, page2.p7.height - 25], colCount:3,
				colWidth:[[2,1,0],[50,80,200]], colTitle:["Catatan","Tanggal","Dari"], readOnly:true
			});*/

            page2.p3 = new panel(page2.pO,{bound:[10,2,450,100], caption:"Proses Group Bisnis"});
			page2.p3.eReview = new saiLabelEdit(page2.p3,{bound:[10,3,300,20], caption:"Review", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p3.tReview = new saiLabelEdit(page2.p3,{bound:[320,3,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p3.eReview.tglObj = page2.p3.tReview;
			page2.p3.eApp1 = new saiLabelEdit(page2.p3,{bound:[10,5,300,20], caption:"Approve 1", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p3.tApp1 = new saiLabelEdit(page2.p3,{bound:[320,5,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p3.eApp1.tglObj = page2.p3.tApp1;
            page2.p3.bApp1 = new imageButton(page2.p3,{bound:[425,5,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p3.bApp1.edit = page2.p3.eApp1;page2.p3.bApp1.status = 'GUBIS';

            page2.p3.eApp2 = new saiLabelEdit(page2.p3,{bound:[10,6,300,20], caption:"Approve 2", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p3.tApp2 = new saiLabelEdit(page2.p3,{bound:[320,6,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p3.eApp2.tglObj = page2.p3.tApp2;
            page2.p3.bApp2 = new imageButton(page2.p3,{bound:[425,6,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p3.bApp2.edit = page2.p3.eApp2;page2.p3.bApp2.status = 'GUBIS';

            page2.p3.rearrangeChild(25,23);

            page2.p4 = new panel(page2.pO,{bound:[470,2,450,100], caption:"Proses Dir. Kug"});
			page2.p4.eReview = new saiLabelEdit(page2.p4,{bound:[10,3,300,20], caption:"Review", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p4.tReview = new saiLabelEdit(page2.p4,{bound:[320,3,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p4.eReview.tglObj = page2.p4.tReview;
			page2.p4.eApp1 = new saiLabelEdit(page2.p4,{bound:[10,5,300,20], caption:"Approve 1", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p4.tApp1 = new saiLabelEdit(page2.p4,{bound:[320,5,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p4.eApp1.tglObj = page2.p4.tApp1;
			page2.p4.bApp1 = new imageButton(page2.p4,{bound:[425,5,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p4.bApp1.edit = page2.p4.eApp1;page2.p4.bApp1.status = 'MA';
			page2.p4.eApp2 = new saiLabelEdit(page2.p4,{bound:[10,6,300,20], caption:"Approve 2", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p4.tApp2 = new saiLabelEdit(page2.p4,{bound:[320,6,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p4.eApp2.tglObj = page2.p4.tApp2;
            page2.p4.bApp2 = new imageButton(page2.p4,{bound:[425,6,20,20],hint:"Cancel",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p4.bApp2.edit = page2.p4.eApp2;page2.p4.bApp2.status = 'MA';

            page2.p4.rearrangeChild(25,23);
            page2.p2 = new panel(page2.pO,{bound:[10,4,450,170], caption:"Proses FC"});
			page2.p2.eFinop = new saiLabelEdit(page2.p2,{bound:[10,1,300,20], caption:"Review Finop", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p2.tFinop = new saiLabelEdit(page2.p2,{bound:[320,1,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p2.eFinop.tglObj = page2.p2.tFinop;

			page2.p2.eReview = new saiLabelEdit(page2.p2,{bound:[10,3,300,20], caption:"Review Keep", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p2.tReview = new saiLabelEdit(page2.p2,{bound:[320,3,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p2.eReview.tglObj = page2.p2.tReview;
			page2.p2.eKeep = new saiLabelEdit(page2.p2,{bound:[10,4,300,20], caption:"Keep/Release", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p2.tKeep = new saiLabelEdit(page2.p2,{bound:[320,4,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p2.eKeep.tglObj = page2.p2.tKeep;
			page2.p2.bApp1 = new imageButton(page2.p2,{bound:[425,4,20,20],hint:"Batal Keep",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p1.bApp1.edit = page2.p1.eApp1;page2.p1.bApp1.status = 'UBIS';
			page2.p2.eReview2 = new saiLabelEdit(page2.p2,{bound:[10,5,300,20], caption:"Review ", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p2.tReview2 = new saiLabelEdit(page2.p2,{bound:[320,5,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p2.eReview2.tglObj = page2.p2.tReview2;
			page2.p2.eApp1 = new saiLabelEdit(page2.p2,{bound:[10,6,300,20], caption:"Approve", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p2.tApp1 = new saiLabelEdit(page2.p2,{bound:[320,6,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p2.eApp1.tglObj = page2.p2.tApp1;
			page2.p2.eSAP = new saiLabelEdit(page2.p2,{bound:[10,7,300,20], caption:"Proses SAP", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p2.tSAP = new saiLabelEdit(page2.p2,{bound:[320,7,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p2.eSAP.tglObj = page2.p2.tSAP;
			page2.p2.bSap = new imageButton(page2.p2,{bound:[425,7,20,20],hint:"Batal proses SAP",image:"icon/"+system.getThemes()+"/cancel2.png",click:[this,"doFCClick"], visible: this.app._statusLokasiUser == 'FC'});page2.p2.bSap.edit = page2.p2.eSAP;page2.p2.bSap.status = 'FC';

            page2.p2.rearrangeChild(25,23);

            page2.p5 = new panel(page2.pO,{bound:[470,4,450,150], caption:"Proses SUKKA"});
            page2.p5.ePengaju = new saiLabelEdit(page2.p5,{bound:[10,1,300,20], caption:"Pembuat", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p5.tPengaju = new saiLabelEdit(page2.p5,{bound:[320,1,100,20], labelWidth:30, caption:"Tgl", readOnly:true, tag:1});page2.p5.ePengaju.tglObj = page2.p5.tPengaju;
			page2.p5.eReview = new saiLabelEdit(page2.p5,{bound:[10,3,300,20], caption:"Review", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p5.tReview = new saiLabelEdit(page2.p5,{bound:[320,3,100,20], labelWidth:30, caption:"No.", readOnly:true, tag:1});page2.p5.eReview.tglObj = page2.p5.tReview;
			page2.p5.eApp1 = new saiLabelEdit(page2.p5,{bound:[10,5,300,20], caption:"Approve", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p5.tApp1 = new saiLabelEdit(page2.p5,{bound:[320,5,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p5.eApp1.tglObj = page2.p5.tApp1;
            page2.p5.eApp2 = new saiLabelEdit(page2.p5,{bound:[10,4,300,20], caption:"Approve 2", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p5.tApp2 = new saiLabelEdit(page2.p5,{bound:[320,4,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p5.eApp1.tglObj = page2.p5.tApp1;
            page2.p5.eApp3 = new saiLabelEdit(page2.p5,{bound:[10,5,300,20], caption:"Approve 3", dblClick:[this,"doChangeNIK"], readOnly:true, tag:1});
			page2.p5.tApp3 = new saiLabelEdit(page2.p5,{bound:[320,5,100,20], labelWidth:30,caption:"Tgl", readOnly:true, tag:1});page2.p5.eApp1.tglObj = page2.p5.tApp1;

            page2.p5.rearrangeChild(25,23);
            page2.rearrangeChild(10,23);
			//page2.p5.setTop(page2.p3.top + 103);

			page2.pO.rearrangeChild(0,23);
			page2.pO.bSMS.setTop(page2.p6.top);
			page2.pO.bBatal.setTop(page2.p6.top+23);
			page2.pO.bSukka.setTop(page2.p5.top+23);
			this.eCatatan.setTop(page2.p6.top+46);

			page2 = this.p1mp.childPage[9];
			page2.sgUpld = new saiGrid(page2,{
						bound:[1,0,400,page2.height - 35],
						colCount:2,
						colTitle:["Dokumen","Deskripsi"],
						colWidth:[[1,0],[250,130]],
						readOnly:true,
						tag:3,
						dblClick:[this,"doOpenFileGrid"],
						hint:"Double Click untuk membuka filenya"
					});
			page2.sgnUpld = new sgNavigator(page2,{bound:[1,page2.sgUpld.height + 3,page2.width-3,25],buttonStyle:1, grid:page2.sgUpld});
			page2.viewer = new reportViewer(page2,{bound:[420,0,page2.width - 420, page2.height - 35]});
			this.app._dataKaryawan.set("-",{nama:"-"});
			this.app._dataKaryawan.set(undefined,{nama:"-"});
			this.pager = 25;
			this.userLogin="";
			var sql =  "select  count(*) "+
					" from rra_pdrk_m a "+
					" where a.kode_lokasi = '"+this.app._lokasi+"' ";

			this.sqlCount = sql;

            this.pFilter = new roundPanel(this,{bound:[this.width - 520,35,500,250],caption:"Filter",visible:false,background:"image/themes/dynpro/roundpanelBgCenter.png",icon:"image/themes/dynpro/iconpanel.png",color:"#edf5f8",titleBg:"#95cae8"});

            this.bApply = new button(this.pFilter,{bound:[10,160,80,20],caption:"Apply",click:[this,"doClick"]});
			this.sgFilter = new saiGrid(this.pFilter,{bound:[10,0,this.pFilter.width - 30,150],colCount:4,rowCount:6,
				colTitle:["Filter","Type","Value1","Value2"],selectCell:[this,"doSelectFilterCell"],ellipsClick:[this,"doEllipsFilterClick"],change:[this,"sg1onChange"],
				colWidth:[[3,2,1,0],[100,100,60,150]]});
			this.sgFilter.columns.get(1).setButtonStyle(window.bsAuto);
			var val = new arrayMap({items:["All","=","Range","Like","<="]});
			this.sgFilter.columns.get(1).setPicklist(val);
            this.pFilter.setTabChildIndex();
            var dataKaryawan = this.dbLib.getDataProvider("select nik, nama, jabatan, email, no_telp, sts_email, sts_telp, kode_cc, kode_ba, status from rra_karyawan ",true);
            for (var i=0; i < dataKaryawan.rs.rows.length; i++){
            	line = dataKaryawan.rs.rows[i];
            	this.app._dataKaryawan.set(line.nik, line);
            }

			this.sql = "select distinct a.periode, a.jenis_agg, a.no_pdrk,  a.nik_user, a.tanggal, to_char(a.tanggal ,'dd-mm-YYYY') as tgl, a.KETERANGAN, cc.nilai as nilai, nvl(b.sts_pdrk,a.sts_pdrk) as sts_pdrk,nvl(b.sts_pdrk,'-') as sts_pdrkr, nvl(i.sts_pdrk, '-') as sts_pdrkg, nvl(k.sts_pdrk,'-') as sts_pdrkm, a.kode_ubis "+
					"				, nvl( nvl(nvl(nvl(fr.flag_rfc,k.flag_rfc),i.flag_rfc),b.flag_rfc),a.flag_rfc) as flag_rfc, a.progress, a.kode_gubis , a.flag_rfc as flag_rfc2	"+
					"				, NVL(b.progress, 'null') as progress_rev 							"+
					"				, NVL(i.progress, 'null') as progress_grev					"+
					"				, NVL(k.progress, 'null') as progress_mrev	"+
					"				, NVL(fr.progress, 'null') as progress_fc	"+
					"				, NVL(fr.status_sukka, 'PENGAJU') as status_sukka	"+
					"				, nvl(b.nik_user,a.nik_buat) as nik_review "+
					"				, nvl(b.nik_review2,a.nik_review2) as nik_review2  "+
					"				, nvl(b.nik_review3,a.nik_review3) as nik_review3  "+
					"				, nvl(b.nik_review4,a.nik_review4) as nik_review4	"+
					"				, nvl(b.nik_review5,a.nik_review5) as nik_review5 	"+
					"				, nvl(b.nik_review,a.nik_review) as nik_appagg "+
					"				, nvl(b.nik_appjust,a.nik_appjust) as nik_appjust "+
					"				, nvl(b.nik_appjust2,a.nik_appjust2) as nik_appjust2 "+

					"				, nvl(c.nik_user,'-') as nik_finop "+
					"				, nvl(i.nik_user,bbb.reviewer) as nik_gubis "+
					"				, nvl(i.nik_buat,'-') as nik_app1gubis "+
					"				, nvl(i.nik_review,'-') as nik_app2gubis "+
					"				, nvl(i.nik_app3,'-') as nik_app3gubis "+
					"				, nvl(nvl(k.nik_keep,i.nik_keep),b.nik_keep) as nik_keep "+

					"				, nvl(k.nik_user,bbbb.reviewer) as nik_ma "+
					"				, nvl(k.nik_buat,'-') as nik_reviewma "+
					"				, nvl(k.nik_review,'-') as nik_reviewma2 "+

					"				, nvl(rk.nik_user,'-') as nik_rk "+
					"				, nvl(kp.nik_user,'-') as nik_kp "+

					"				, nvl(fr.nik_user,'-') as nik_fc "+
					"				, nvl(fap.nik_user,fr.nik_review) as nik_fap "+

					"				, nvl(sk.nik_buat,fr.nik_sukka) as nik_sk "+
					"				, nvl(sk.nik_review,fr.nik_buat) as nik_skreview "+
					"				, nvl(sk.nik_app,fr.nik_app3) as nik_skapp "+
					"				, nvl(sk.nik_app2,'-') as nik_skapp2 "+
					"				, nvl(sk.nik_app3,'-') as nik_skapp3 "+
					"				, nvl(sk.no_sukka,'-') as no_sukka "+
					"				, nvl(ps.nik_user, '-') as nik_fctrn "+
 					"				, kk.nama as nik_sgmfc, a.posisi_nik, a.kewenangan  "+
 					" 				, fr.nik_review2 as fc_rev1 "+
 					" 				, fr.nik_review3 as fc_rev2 "+
 					" 				, fr.nik_review4 as fc_rev3 "+
					"		from RRA_PDRK_M a "+
					"				inner join rra_ubis bb on bb.kode_ubis = a.kode_ubis and bb.kode_lokasi = a.kode_lokasi  "+
					"				inner join rra_gubis bbb on bbb.kode_gubis = a.kode_gubis and bbb.kode_lokasi = a.kode_lokasi  "+
					"				left outer join rra_gubis bbbb on bbbb.kode_gubis = 'G09' and bbbb.kode_lokasi = a.kode_lokasi  "+
					 "				left outer join spro kk on kk.kode_spro = 'SGMFBCC' "+
					"				left outer join (select no_bukti, sum(nilai) as nilai from rra_anggaran where dc='D' group by no_bukti ) cc on cc.no_bukti = a.no_pdrk   "+
					"				left outer join rra_rev_m b on b.no_pdrk = a.no_pdrk "+
					"				left outer join rra_frev_m c on c.no_pdrk = a.no_pdrk and c.no_frev like 'FINOP%' "+
					"				left outer join rra_grev_m i on i.no_pdrk = a.no_pdrk and i.kode_lokasi = a.kode_lokasi "+
					"				left outer join rra_mrev_m k on k.no_pdrk = a.no_pdrk and k.kode_lokasi = a.kode_lokasi "+
					"				left outer join rra_frev_m fr on fr.no_pdrk = a.no_pdrk and fr.no_frev like 'FREV%' "+
					"				left outer join rra_sukka sk on sk.no_pdrk = a.no_pdrk  "+
					//		-- Keep
					"				left outer join (select distinct z.catatan as no_pdrk, x.tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'FCRK%' ) rk on rk.no_pdrk = a.no_pdrk and rk.kode_lokasi = a.kode_lokasi "+
					"				left outer join (select distinct z.catatan as no_pdrk, x.tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'FCKEP%' ) kp on kp.no_pdrk = a.no_pdrk and kp.kode_lokasi = a.kode_lokasi "+
					//		-- app FC
					"				left outer join (select distinct z.catatan as no_pdrk, x.tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APPFC%' and z.status = 'APP' ) fap on fap.no_pdrk = a.no_pdrk and fap.kode_lokasi = a.kode_lokasi  "+
					//		-- proses SAP
					"				left outer join (select distinct z.catatan as no_pdrk, x.tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'FCTRN%' ) ps on ps.no_pdrk = a.no_pdrk and ps.kode_lokasi = a.kode_lokasi ";

					//			order by a.no_pdrk";

			this.filter = " where a.jenis_agg ='OPEX' and a.kode_ubis = '"+this.app._kodeUbis+"' and (a.periode = '"+this.app._periodeGAR+"'  or (a.flag_rfc <> '2' and substr(a.periode,1,4) = '"+this.app._periodeGAR.substr(0,4)+"' )) ";

			this.sqlCount = "select count(*) from ("+this.sql+") a ";

			this.rowCount = this.dbLib.getRowCount(this.sqlCount + this.filter, this.pager);

            this.sgn.setTotalPage(this.rowCount);
            this.sgn.rearrange();

			this.doPager(this.sgn,1);
			this.sgFilter.editData(0,["Periode","=",this.app._periodeGAR,""]);
			this.sgFilter.editData(1,["UBIS","=",this.app._kodeUbis,""]);
			this.sgFilter.editData(2,["No PDRK","All","",""]);
			this.sgFilter.editData(3,["Modul","All","",""]);
			this.sgFilter.editData(4,["Posisi","All","",""]);
			this.sgFilter.editData(5,["Status PDRK","All","",""]);
			this.filterRep = new util_filterRep();
			this.app._mainForm.pButton.hide();

		}catch(e){
			alert(e);
		}
	},
	updatePeriode : function(){
		try{
			if (this.app._statusLokasiUser == 'FC'){
				var sql  = new server_util_arrayList();
				sql.add("update rra_pdrk_m set periode = '"+this.app._periodeGAR+"' where progress <> 'D' and  periode like '2014%' and (flag_rfc <> '2' or flag_rfc is null) and jenis_agg = 'OPEX'");
				this.dbLib.execArraySQL(sql);
			}
		}catch(e){
			alert(e);
		}
	},
	doGenNoSUKKA: function(){
		if (this.app._statusLokasiUser == "FC"){
			var sql  = new server_util_arrayList();
			var prd = this.app._periodeGAR.substr(3,4);
			sql.add("insert into rra_app_m "+
					"select concat('APPSK-"+prd+"',msgid), '01',sysdate, 'Acc','RRR','"+this.app._periodeGAR+"','-',nik_user , nik_user, nik_user, sysdate, 'APP' "+
					" from rra_catatan where no_pdrk in ('"+this.PDRK+"') and NIK_USER=  '641998'");
			sql.add(" insert into rra_app_d "+
					" select concat('APPSK-"+prd+"',msgid), 'RRR','"+this.PDRK+"','01','-','"+this.PDRK+"','Acc','-','APP' "+
					" from rra_catatan where no_pdrk in ('"+this.PDRK+"') and NIK_USER=  '641998'");
			this.dbLib.execArraySQL(sql);
		}
	},
	doAfterLoad: function(sender, result, data){
		var first = true;
		var header = [];
		for (var i=0; i < data.rows.length;i++){
			var line = data.rows[i];
			if (first){
				for (var l in line)
					header.push(l);
			}
			var row = [];
			for (var c in line)
				row.push(line[c]);
			//error_log(row);
			first = false;
		}
	},
	doChangeNIK: function(sender){
		try{
			this.pSMSNIK.callObject = sender;
			if (this.app._statusLokasiUser != "FC") return;
			var scWidth = system.getScreenWidth();
			var scHeight = system.getScreenHeight();
			this.pNIK.setTop(scHeight / 2 - 30);
			this.pNIK.setLeft(scWidth / 2 - 200);
			//if (sender.tglObj.getText() == "-" || sender.tglObj.getText() == "")
			{
				this.pNIK.show();
				this.pNIK.callObject = sender;
			}
		}catch(e){
			error_log(e);
		}
	},
	doBatalPDRK: function(){
		try{
			var sql = new server_util_arrayList();
			sql.add("update rra_pdrk_m set progress='D' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_rev_m set progress='D' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_grev_m set progress='D' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_frev_m set progress='D' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("delete from rra_anggaran where no_bukti = '"+this.PDRK+"' ");
			sql.add("insert into rra_catatan(no_pdrk,catatan, tgl_input, nik_user)values('"+this.PDRK+"','Pembatalan PDRK : "+this.eCatatan.getText()+"',now(), '"+this.app._userLog+"')");
			this.dbLib.execArraySQL(sql, undefined, this);
		}catch(e){
			error_log(e);
		}
	},
	doFCClick: function(sender){
		var sql = new server_util_arrayList();
		if (sender === this.p1mp.childPage[8].p2.bApp1){
			sql.add("update rra_pdrk_m set flag_rfc='0' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_rev_m set flag_rfc='0' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_grev_m set flag_rfc='0' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("delete from rra_app_d where catatan = '"+this.PDRK+"' and no_app like 'FCKEP%'");
		}else  if (sender === this.p1mp.childPage[8].p2.bSap){
			sql.add("update rra_pdrk_m set flag_rfc='1' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_rev_m set flag_rfc='1' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_grev_m set flag_rfc='1' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("update rra_frev_m set flag_rfc='1' where no_pdrk = '"+this.PDRK+"' ");
			sql.add("delete from rra_app_d where catatan = '"+this.PDRK+"' and no_app like 'FCTRN%'");
		}
		this.dbLib.execArraySQL(sql, undefined, this);
	},
	doUpdateNIK: function(sender){
		try{
			if (sender == this.bOK){
				var page2 = this.p1mp.childPage[8];
				var sql = new server_util_arrayList();
				var nik = this.getDataKaryawan(this.cbNIK.getText());
				sender.owner.callObject.setText(this.cbNIK.getText()+": "+nik.nama);
				switch (sender.owner.callObject){
					case page2.p1.eReview:
						sql.add("update rra_pdrk_m set nik_buat = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p1.eApp1:
						sql.add("update rra_pdrk_m set nik_review = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_review = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p1.eApp2:
						sql.add("update rra_pdrk_m set nik_appjust = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_appjust = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p1.eApp3:
						sql.add("update rra_pdrk_m set nik_appjust2 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_appjust2 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p2.eReview:
						//sql.add("update rra_pdrk_m set nik_buat = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p6.eKeep:
						sql.add("update rra_pdrk_m set nik_review2 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_review2 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p6.eReview2:
						sql.add("update rra_pdrk_m set nik_review3 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_review3 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p6.eApp1:
						sql.add("update rra_pdrk_m set nik_review4 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_review4 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p6.eSAP:
						sql.add("update rra_pdrk_m set nik_review5 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_review5 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p2.eKeep:
						sql.add("update rra_pdrk_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_grev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_mrev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p2.eReview2:
						//sql.add("update rra_pdrk_m set nik_appjust = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						//sql.add("update rra_rev_m set nik_appjust = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p2.eApp1:
						sql.add("update rra_frev_m set nik_review = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' and no_frev like 'FREV%'");
					break;
					case page2.p2.eSAP:
						sql.add("update rra_pdrk_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_rev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_grev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_mrev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						sql.add("update rra_frev_m set nik_keep = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p3.eReview:
						sql.add("update rra_gubis set reviewer = '"+this.cbNIK.getText()+"' where kode_gubis = '"+this.aktif_record.kode_gubis+"' ");
					break;
					case page2.p3.eApp1:
						sql.add("update rra_grev_m set nik_buat = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p3.eApp2:
						sql.add("update rra_grev_m set nik_review = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p4.eReview:
						sql.add("update rra_gubis set reviewer = '"+this.cbNIK.getText()+"' where kode_gubis = 'G09' ");
					break;
					case page2.p4.eApp1:
						sql.add("update rra_mrev_m set nik_buat = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p4.eApp2:
						sql.add("update rra_mrev_m set nik_review = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;

					case page2.p5.ePengaju:

						if (nik.status == "FC"){
							sql.add("update rra_pdrk_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_rev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_grev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_mrev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_frev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						}else {
							sql.add("update rra_pdrk_m set status_sukka='PENGAJU',nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_frev_m set status_sukka='PENGAJU',nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						}
					break;
					case page2.p5.eReview:
						sql.add("update rra_sukka set nik_review = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p5.eApp1:
						sql.add("update rra_sukka set nik_app = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p5.eApp2:
						sql.add("update rra_sukka set nik_app2 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p5.eApp3:
						sql.add("update rra_sukka set nik_app3 = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
				}
				if (sql.getLength() > 0)
					this.dbLib.execArraySQL(sql, undefined, this);
			}
			this.pNIK.hide();
		}catch(e){
			error_log(e);
		}
	},
	clickSendSMS: function(sender){
		var scWidth = system.getScreenWidth();
		var scHeight = system.getScreenHeight();
		this.pSMSNIK.setTop(scHeight / 2 - 50);
		this.pSMSNIK.setLeft(scWidth / 2 - 400);
		this.pSMSNIK.show();
	},
	clickUpdatePDRK: function(){
		var scWidth = system.getScreenWidth();
		var scHeight = system.getScreenHeight();
		this.pDataPDRK.setTop(scHeight / 2 - 150);
		this.pDataPDRK.setLeft(scWidth / 2 - 400);
		this.pDataPDRK.show();
	},
	doUpdatePDRK: function(sender){
		if (this.app._statusLokasiUser == "FC" ){
			var pageUbis =this.p1mp.childPage[3];
			if (sender == pageUbis.bJenis){
				var sql = new server_util_arrayList();
				sql.add("update rra_rev_m set sts_pdrk = '"+pageUbis.jenis.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bKet){
				var sql = new server_util_arrayList();
				sql.add("update rra_rev_m set keterangan = '"+pageUbis.ket.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				sql.add("update rra_pdrk_m set keterangan = '"+pageUbis.ket.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bProg){
				var sql = new server_util_arrayList();
				sql.add("update rra_rev_m set progress = '"+pageUbis.eProg.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bSave){
				var sql = new server_util_arrayList();
				sql.add(new server_util_Map({items:{tipe : "clob", table : 'rra_rev_m', field : "justifikasi", filter : "no_pdrk = '"+this.PDRK+"' ",value:urlencode(pageUbis.mDesk.getCode())}}));
	    		this.dbLib.execArraySQL(sql, undefined, this);
	    	}
	    	var pageUbis =this.p1mp.childPage[4];
			if (sender == pageUbis.bJenis){
				var sql = new server_util_arrayList();
				sql.add("update rra_grev_m set sts_pdrk = '"+pageUbis.jenis.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bKet){
				var sql = new server_util_arrayList();
				sql.add("update rra_grev_m set keterangan = '"+pageUbis.ket.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bProg){
				var sql = new server_util_arrayList();
				sql.add("update rra_grev_m set progress = '"+pageUbis.eProg.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bSave){
				var sql = new server_util_arrayList();
				sql.add(new server_util_Map({items:{tipe : "clob", table : 'rra_grev_m', field : "justifikasi", filter : "no_pdrk = '"+this.PDRK+"' ",value:urlencode(pageUbis.mDesk.getCode())}}));
	    		this.dbLib.execArraySQL(sql, undefined, this);
	    	}
	    	var pageUbis =this.p1mp.childPage[5];
			if (sender == pageUbis.bJenis){
				var sql = new server_util_arrayList();
				sql.add("update rra_mrev_m set sts_pdrk = '"+pageUbis.jenis.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bKet){
				var sql = new server_util_arrayList();
				sql.add("update rra_mrev_m set keterangan = '"+pageUbis.ket.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bProg){
				var sql = new server_util_arrayList();
				sql.add("update rra_mrev_m set progress = '"+pageUbis.eProg.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bSave){
				var sql = new server_util_arrayList();
				sql.add(new server_util_Map({items:{tipe : "clob", table : 'rra_mrev_m', field : "justifikasi", filter : "no_pdrk = '"+this.PDRK+"' ",value:urlencode(pageUbis.mDesk.getCode())}}));
	    		this.dbLib.execArraySQL(sql, undefined, this);
	    	}
	    	var pageUbis =this.p1mp.childPage[6];
			if (sender == pageUbis.bJenis){
				var sql = new server_util_arrayList();
				sql.add("update rra_frev_m set sts_pdrk = '"+pageUbis.jenis.getText()+"' where no_pdrk = '"+this.PDRK+"' and no_frev like 'FREV%' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bKet){
				var sql = new server_util_arrayList();
				sql.add("update rra_frev_m set keterangan = '"+pageUbis.ket.getText()+"' where no_pdrk = '"+this.PDRK+"' and no_frev like 'FREV%' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bProg){
				var sql = new server_util_arrayList();
				sql.add("update rra_frev_m set progress = '"+pageUbis.eProg.getText()+"' where no_pdrk = '"+this.PDRK+"' and no_frev like 'FREV%' ");
				this.dbLib.execArraySQL(sql, undefined, this);
			}else if (sender == pageUbis.bSave){
				var sql = new server_util_arrayList();
				sql.add(new server_util_Map({items:{tipe : "clob", table : 'rra_frev_m', field : "justifikasi", filter : "no_pdrk = '"+this.PDRK+"' and no_frev like 'FREV%' ",value:urlencode(pageUbis.mDesk.getCode())}}));
	    		this.dbLib.execArraySQL(sql, undefined, this);
	    	}
	    	var pageUbis =this.p1mp.childPage[7];
	    	if (sender == pageUbis.bSave){
				var sql = new server_util_arrayList();
				sql.add(new server_util_Map({items:{tipe : "clob", table : 'rra_sukka', field : "keterangan", filter : "no_pdrk = '"+this.PDRK+"'  ",value:urlencode(pageUbis.mDesk.getCode())}}));
	    		this.dbLib.execArraySQL(sql, undefined, this);
	    	}
		}else {
			system.info(this, "Anda tidak boleh merubah data ini karena sudah tersubmit","Hubungi Administrator");
		}
	},
	doSendSMS: function(sender){
		try{
			if (sender == this.bSMSOK){
				var page2 = this.p1mp.childPage[8];
				var sql = new server_util_arrayList();
				var nik = this.getDataKaryawan(this.cbSMSNIK.getText());
				switch (sender.owner.callObject){
					case page2.p1.eReview:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Review PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p1.eApp1:
					case page2.p1.eApp2:
					case page2.p1.eApp3:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Approve PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p2.eReview:
						//sql.add("update rra_pdrk_m set nik_buat = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p2.eKeep:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Keep PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p2.eReview2:
						//sql.add("update rra_pdrk_m set nik_appjust = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						//sql.add("update rra_rev_m set nik_appjust = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
					break;
					case page2.p2.eApp1:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Approve FC PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p2.eSAP:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Proses SAP PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p3.eReview:
						//sql.add("update rra_gubis set reviewer = '"+this.cbNIK.getText()+"' where kode_gubis = '"+this.aktif_record.kode_gubis+"' ");
					break;
					case page2.p3.eApp1:
					case page2.p3.eApp2:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Approve Group PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p4.eReview:
						//sql.add("update rra_gubis set reviewer = '"+this.cbNIK.getText()+"' where kode_gubis = 'G09' ");
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Review PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p4.eApp1:
					case page2.p4.eApp2:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Approve PDRK "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;

					case page2.p5.ePengaju:

						if (nik.status == "FC"){
							sql.add("update rra_pdrk_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_rev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_grev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_mrev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_frev_m set status_sukka='FC',nik_keep='"+this.cbNIK.getText()+"', nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						}else {
							sql.add("update rra_pdrk_m set nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
							sql.add("update rra_frev_m set nik_sukka = '"+this.cbNIK.getText()+"' where no_pdrk = '"+this.PDRK+"' ");
						}
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan membuat SUKKA "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p5.eReview:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Review SUKKA "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					case page2.p5.eApp1:
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'Silahkan Approve SUKKA "+this.PDRK+"-"+this.eSMSKet.getText()+"  di RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
					default :
						sql.add("insert into sms_outbox(no_outbox,tanggal,pesan,flag_kirim,no_telp)values('"+new Date().valueOf() +"-"+this.PDRK+"',now(),'"+this.PDRK+"-"+this.eSMSKet.getText()+"  RRA Online. http://10.32.18.137/webRRA.','0','"+nik.no_telp+"')");
					break;
				}
				if (sql.getLength() > 0){
					this.dbLib.execArraySQL(sql, undefined, this);
					system.info(this, "SMS dikirim ke no "+nik.no_telp,"");
				}
			}
			this.pSMSNIK.hide();
		}catch(e){
			error_log(e);
		}
	},
	doOpenFileGrid : function(sender, col, row){
		try{
			if (sender.cells(0,row) != "-" && sender.cells(0,row) != "") {
				row++;
				//error_log("server/bacaFile.php?&param="+this.app._dbSetting+"&action=read&process="+this.table+"&id=dok&no="+this.no_review+"&nu="+row+"&field=file_dok");
				sender.owner.viewer.useIframe("server/bacaFile.php?&param="+this.app._dbSetting+"&action=read&process="+this.table+"&id=dok&no="+this.no_review+"&nu="+row+"&field=file_dok");

				//if (this.app._fileUtil.isExist(this.app._rootDir +"/"+"server/media/"+sender.cells(0,row))){
				//	sender.owner.viewer.useIframe("server/media/"+sender.cells(0,row));
				//}
			}
		}catch(e){
			error_log(e);
		}
	},
	doToolBarClick: function(sender, id){
	   switch(id){
	       case "bFilter" :
	           this.pFilter.setVisible(!this.pFilter.visible);
	       break;
       }
    },

    doClick: function(sender){
        try{

        	if (sender == this.bRefresh){
        		this.doPager(this.sgn, this.activePage);
        	}

            if (sender == this.bApply){
            	var addFilter = "",
            		addFilter2 = "";
            	if (this.sgFilter.cells(1,5) == "="){
            		addFilter = " and "+(this.sgFilter.cells(2,5).toUpperCase() == 'SELESAI' ? " a.flag_rfc = '2' " : " (a.flag_rfc <> '2' or a.flag_rfc is null) ") +" and a.progress <> 'D'"
            		addFilter2 = " and "+(this.sgFilter.cells(2,5).toUpperCase() == 'SELESAI' ? " a.flag_rfc2 = '2' " : " (a.flag_rfc2 <> '2' or a.flag_rfc2 is null) ") +" and a.progress <> 'D'"
            	}
                this.filter = this.filterRep.filterStr("a.kode_ubis",this.sgFilter.getCell(1,1),this.sgFilter.getCell(2,1),this.sgFilter.getCell(3,1),"where")+
				    this.filterRep.filterStr("a.no_pdrk",this.sgFilter.getCell(1,2),this.sgFilter.getCell(2,2),this.sgFilter.getCell(3,2),"and")+
				    this.filterRep.filterStr("a.periode",this.sgFilter.getCell(1,0),this.sgFilter.getCell(2,0),this.sgFilter.getCell(3,0),"and")+
				    " and a.jenis_agg = 'OPEX'" ;
				if (this.sgFilter.cells(2,4) != "" && this.sgFilter.cells(1,4) == '='){
					var dataPDRK = this.dataProviderPDRK.getPosisiPDRK(this.sgFilter.cells(2,4));
					try{
						dataPDRK = JSON.parse(dataPDRK);
					}catch(e){
						alert(e +":"+dataPDRK);
					}
					var list = ["' '"];
					for (var i=0 ;i < dataPDRK.rs.rows.length;i++){
						var line = dataPDRK.rs.rows[i];
						list.push("'" + line +"'");
					}
					this.filter += " and a.no_pdrk in ("+list+")";
				}
				//error_log(this.sqlCount+this.filter + addFilter2);
    			this.rowCount = this.dbLib.getRowCount(this.sqlCount+this.filter + addFilter2, this.pager);
    			this.filter += addFilter;
				this.sgn.setTotalPage(this.rowCount);
                this.sgn.rearrange();

    	        this.doPager(this.sgn,1);
    	        this.pFilter.hide();
            }
       }catch(e){
            error_log(e);
       }
    },

	doPager: function(sender,page){
		try{
			   this.activePage = page;
			   //error_log(this.sql+this.filter);
			   this.dbLib.getDataProviderPageA(this.sql+this.filter +" order by a.kode_ubis, a.tanggal desc, a.no_pdrk",page, this.pager, undefined, this);
		}catch(e){
			error_log(e);
		}
    },
    getDataKaryawan: function(nik){
	    try{
		    var result = this.app._dataKaryawan.get(nik);
		    if (result){
			    return result;
		    }else {
		    	alert(nik +" - tidak di temukan");
			    return {nik :"-", nama:"-", jabatan:"-", email:"-", no_telp:"-", sts_email:"-", sts_telp:"-", kode_cc:"-", kode_ba:"-", status:"-"};
		    }
	    }catch(e){
		    alert(nik);

	    }
    },
	doRequestReady: function(sender, methodName, result, callbackObj){
		try{
		   	if (sender === this.dbLib && this == callbackObj) {
		   		if (methodName == "execArraySQL") {
		   			if (result.toLowerCase().search("error") == -1)	{
						system.info(this, result,"");
					}else system.info(this, result,"");
		   			return;
		   		}
			   	if (methodName == "getDataProviderPage") {
			   		eval("brg = " + result + ";");
			   		if (typeof(brg) !== "string") {
			   			this.sg1mp.clear();
			   			this.gridDataTmp = new arrayMap();
			   			if (brg.rs.rows[0] != undefined) {
			   				this.sg1mp.showLoading();
			   				var line;
			   				for (var i in brg.rs.rows) {
			   					try{
				   					line = brg.rs.rows[i];
				   					this.gridDataTmp.set(line.no_pdrk, line);
				   					var data = [];
				   					if (line.jenis_agg == "CAPEX"){

				   					}else {
				   						//ubis
										reviewSelesai = 0;
										var sudahReview = false;
										if (line.progress == '0')
											data[0] = "Review ("+line.nik_review+": "+this.getDataKaryawan(line.nik_review).nama+")";
										else if (line.progress == 'R')
											data[0] = "Review Kembali("+line.nik_user+": "+this.getDataKaryawan(line.nik_user).nama+")";
										else if (line.progress == 'D' || line.progress_rev == 'D')
											data[0] = "Batal";
										else{
											sudahReview = true;
											switch (line.progress_rev) {
												case "R" : data[0] = "Review Kembali ("+line.nik_review+": "+this.getDataKaryawan(line.nik_review).nama+")";
													sudahReview = false;
													break;
												case "A" :
													var finop = lclLib.getNIKFC(line.kode_ubis, 'OFF','FINOP');
													if (finop)
														data[0] = "FINOP ("+finop.nik+": "+this.getDataKaryawan(finop.nik).nama+")";
													break;
												case "02" : data[0] = "Approve ("+line.nik_review2+": "+this.getDataKaryawan(line.nik_review2).nama+")";
													break;
												case "03" : data[0] = "Approve ("+line.nik_review3+": "+this.getDataKaryawan(line.nik_review3).nama+")";
															/*if (line.nik_review5 != "-")
																data[0] = "Approve ("+line.nik_review3+": "+this.getDataKaryawan(line.nik_review3).nama+")";
															else data[0] = "Approve ("+line.nik_review2+": "+this.getDataKaryawan(line.nik_review2).nama+")";
															*/
													break;
												case "04" : data[0] = "Approve ("+line.nik_review4+": "+this.getDataKaryawan(line.nik_review4).nama+")";
															/*if (line.nik_review5 != "-" )
																data[0] = "Approve ("+line.nik_review4+": "+this.getDataKaryawan(line.nik_review4).nama+")";
															else if (line.nik_review4 != "-")
																data[0] = "Approve ("+line.nik_review3+": "+this.getDataKaryawan(line.nik_review3).nama+")";
															else data[0] = "Approve ("+line.nik_review2+": "+this.getDataKaryawan(line.nik_review2).nama+")";
															*/
													break;
												case "05" : data[0] = "Approve ("+line.nik_review5+": "+this.getDataKaryawan(line.nik_review5).nama+")";
															/*if (line.nik_review5 != "-" )
																data[0] = "Approve ("+line.nik_review5+": "+this.getDataKaryawan(line.nik_review5).nama+")";
															else if (line.nik_review4 != "-")
																data[0] = "Approve ("+line.nik_review4+": "+this.getDataKaryawan(line.nik_review4).nama+")";
															else if (line.nik_review3 != "-")
																data[0] = "Approve ("+line.nik_review3+": "+this.getDataKaryawan(line.nik_review3).nama+")";
															else data[0] = "Approve ("+line.nik_review2+": "+this.getDataKaryawan(line.nik_review2).nama+")";
															*/
													break;
												case "-" : data[0] = "Approve ("+line.nik_appagg+": "+this.getDataKaryawan(line.nik_appagg).nama+")";
													break;
												case "0" : data[0] = "Approve ("+line.nik_appjust+": "+this.getDataKaryawan(line.nik_appjust).nama+")";
													break;
												case "01" : data[0] = "Approve ("+line.nik_appjust2+": "+this.getDataKaryawan(line.nik_appjust2).nama+")";
													break;
												default : data[0] = "<img width=17 height=17 src='icon/green.png' />.";
													reviewSelesai = 1;
													break;
											}
										}
										//gubis
										data[1] = ".";
										if ( (line.sts_pdrk == "ABT" || line.sts_pdrk == "OPN") ) {
											data[1] = "<img width=17 height=17 src='icon/grey.png' />.";
											sudahReview = false;
											if (reviewSelesai == 1) {
												reviewSelesai = 0;
												if (line.progress_rev == "P")
													data[1] = "Review ("+line.posisi_nik+": "+this.getDataKaryawan(line.posisi_nik).nama+")";
												else if (line.progress_grev == "null")
													data[1] = "Review ("+line.nik_gubis+": "+this.getDataKaryawan(line.nik_gubis).nama+")";
												else  {
													sudahReview = true;
													if (line.progress_grev == "0" || line.progress_grev == "-"){
														data[1] = "Approve ("+line.nik_app1gubis+": "+this.getDataKaryawan(line.nik_app1gubis).nama+")";
													}else if (line.progress_grev == "01"){
														data[1] = "Approve ("+line.nik_app2gubis+": "+this.getDataKaryawan(line.nik_app2gubis).nama+")";
													}else if (line.progress_grev == "A"){
														data[1] = "Reviewer OpenHold/Standby ("+line.nik_app1gubis+": "+this.getDataKaryawan(line.nik_app1gubis).nama+")";
													}else if (line.progress_grev == "A1"){
														if (line.sts_pdrk == "OPN")
															data[1] = "Approve ("+line.nik_app2gubis+": "+this.getDataKaryawan(line.nik_app2gubis).nama+")";
														else
															data[1] = "Approve ("+line.nik_app3gubis+": "+this.getDataKaryawan(line.nik_app3gubis).nama+")";
													}else if (line.progress_grev == "R"){
														data[1] = "Review Kembali ("+line.nik_gubis+": "+this.getDataKaryawan(line.nik_gubis).nama+")";
														sudahReview = false;
													}else if (line.progress_grev == "10"){
														reviewSelesai = 1;
														data[1] = "<img width=17 height=17 src='icon/green.png' />.";
														data[2] = "Review MA ("+line.nik_ma+": "+this.getDataKaryawan(line.nik_ma).nama+")";
													}else {
														data[1] = "<img width=17 height=17 src='icon/green.png' />.";
														reviewSelesai = 1;
														//review FC;
													}
												}
											}
										}

					   					//MA
					   					data[2] = ".";
					   					if ((line.sts_pdrkg == "ABT" && line.kode_gubis != 'G09') || (line.sts_pdrkm == 'OPN' && line.progress_mrev == 'R') || ( line.sts_pdrkm == 'OPN' && line.progress_grev == '2' )|| (line.sts_pdrkg == 'OPN' && ( (line.progress_grev == '2' && line.flag_rfc == '-')|| line.progress_grev == '10' || line.progress_grev == 'P') ) ){
					   						data[2] = "<img width=17 height=17 src='icon/grey.png' />.";
					   						sudahReview = false;
					   						if (reviewSelesai == 1){
					   							reviewSelesai = 0;
					   							if (line.progress_grev == "P")
													data[2] = "Review ("+line.posisi_nik+": "+this.getDataKaryawan(line.posisi_nik).nama+")";
												else if (line.progress_fc == "P")
													data[2] = "Review ("+line.posisi_nik+": "+this.getDataKaryawan(line.posisi_nik).nama+")";
												else if (line.progress_mrev == "null")
					   								data[2] = "Review ("+line.nik_ma+": "+this.getDataKaryawan(line.nik_ma).nama+")";
					   							else if (line.progress_mrev == "A"){
					   								sudahReview = true;
					   								data[2] = "Approve ("+line.nik_reviewma+": "+this.getDataKaryawan(line.nik_reviewma).nama+")";
					   							}else if (line.progress_mrev == "0"){
					   								sudahReview = true;
					   								data[2] = "Approve ("+line.nik_reviewma2+": "+this.getDataKaryawan(line.nik_reviewma2).nama+")";
					   							}else if (line.progress_mrev == "R"){
					   								sudahReview = true;
					   								data[2] = "Review Kembali ("+line.nik_ma+": "+this.getDataKaryawan(line.nik_ma).nama+")";
					   							}else { //if (line.progress_mrev == "1"){
					   								sudahReview = true;
													data[2] = "<img width=17 height=17 src='icon/green.png' />.";
													reviewSelesai = 1;
					   							}

					   						}
					   					}
					   					//FC

					   					//error_log(line.no_pdrk +":"+reviewSelesai +":"+line.progress_rev+":"+line.flag_rfc +":"+sudahReview+":"+line.sts_pdrk);

					   					data[3] = "<img width=17 height=17 src='icon/grey.png' />.";
					   					if (line.flag_rfc == "-" && sudahReview && (line.sts_pdrk == "STB" || line.sts_pdrk == "RRR" || line.sts_pdrkg == "RRR" || line.sts_pdrkm == "RRR" || line.sts_pdrkm == "ABT" || line.sts_pdrkg == "ABT" || line.kewenangan == 'GAB') ){
											//isGubis // GUBIS
											//error_log(lclLib.isGubis(line.kode_ubis) +":"+ line.sts_pdrkg+":"+ line.sts_pdrkm);
											if (lclLib.isGubis(line.kode_ubis) || line.sts_pdrkg == "RRR" || line.sts_pdrk == "STB" || line.sts_pdrkm == "RRR" || line.sts_pdrkm == "ABT" || line.sts_pdrkg == "ABT" || line.kewenangan == "GAB"  )
												var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FC");
											else var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FINOP");
											data[3] = "Review Keep("+nik.nik+": "+this.getDataKaryawan(nik.nik).nama+")";
										}else if (line.flag_rfc == "0" && line.progress_rev != "null" && (line.sts_pdrk == "RRR" || line.sts_pdrkg == "RRR" || line.sts_pdrkm == "RRR" || line.sts_pdrkm == "ABT" || line.kewenangan == "GAB") ){
											data[3] = "Keep("+line.nik_keep+": "+this.getDataKaryawan(line.nik_keep).nama+")";
										}else if ( ( line.flag_rfc == "1") || (line.flag_rfc == "-" && sudahReview && ( line.sts_pdrk == "STB" || line.sts_pdrk == "OPN") ) ){
											if (reviewSelesai > 0){
												if (line.progress_fc == "null"){//
													if ( lclLib.isGubis(line.kode_ubis) || line.sts_pdrk == "STB" || line.sts_pdrk == "OPN" || line.kewenangan == "GAB"  || line.progress_grev != "null" )
														var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FC");
													else var nik = lclLib.getNIKFC(line.kode_ubis,"OFF","FINOP");
													data[3] = "Review FC("+nik.nik+": "+this.getDataKaryawan(nik.nik).nama+")";
												}else if (line.progress_fc == "0" || line.progress_fc == "-") {
													data[3] = "Approve FC("+line.nik_fap+": "+this.getDataKaryawan(line.nik_fap).nama+")";
												}else if (line.progress_fc == "01" && (line.sts_pdrk == "OPN" || line.sts_pdrk == 'STB') ) {
													data[3] = "Approve FC("+line.nik_sgmfc+": "+this.getDataKaryawan(line.nik_sgmfc).nama+")";
												}else if (line.progress_fc == "02" ) {
													data[2] = "Approve MA("+line.fc_rev1+": "+this.getDataKaryawan(line.fc_rev1).nama+")";
												}else if (line.progress_fc == "03" ) {
													data[2] = "Approve MA("+line.fc_rev2+": "+this.getDataKaryawan(line.fc_rev2).nama+")";
												}else if (line.progress_fc == "P")
													data[2] = "Review ("+line.posisi_nik+": "+this.getDataKaryawan(line.posisi_nik).nama+")";
												else if (line.progress_fc == "04" ) {
													data[2] = "Approve MA("+line.fc_rev3+": "+this.getDataKaryawan(line.fc_rev3).nama+")";
												}else if (line.progress_fc == "1") {
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													if (line.sts_pdrk == "RRR" || line.sts_pdrk == "RSH" || line.sts_pdrkg == "RRR" || line.sts_pdrkm == "ABT"  || (line.sts_pdrkg == "ABT" && line.kode_gubis == 'G09')|| line.sts_pdrkm == "RRR" ){
														if (line.status_sukka == "FC")
															data[3] = "SUKKA("+line.nik_keep+": "+this.getDataKaryawan(line.nik_keep).nama+")";
														else if (line.status_sukka == "PENGAJU"){
															if (line.progress_grev == "null")
																data[0] = "SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
															else if (line.progress_mrev == "null")
																	data[1] = "SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
															else
																	data[2] = "SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
														}else{
															//if (lclLib.isGubis(line.kode_ubis) || lclLib.progress_grev != "null")
																//var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FC");
															var nik = {nik : line.nik_keep};
															//else var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FINOP");
															data[3] = "Proses SAP("+nik.nik+": "+this.getDataKaryawan(nik.nik).nama+")";
														}
													}
												}else if (line.progress_fc == "6") {
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													if (line.status_sukka == "PENGAJU"){
														if (line.progress_grev == "null")
															data[0] = "Review SUKKA("+line.nik_skreview+": "+this.getDataKaryawan(line.nik_skreview).nama+")";
														else if (line.progress_mrev == "null")
															data[1] = "Review SUKKA("+line.nik_skreview+": "+this.getDataKaryawan(line.nik_skreview).nama+")";
														else data[2] = "Review SUKKA("+line.nik_skreview+": "+this.getDataKaryawan(line.nik_skreview).nama+")";
													}else  data[3] = "Review SUKKA("+line.nik_skreview+": "+this.getDataKaryawan(line.nik_skreview).nama+")";
												}else if (line.progress_fc == "M") {
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													data[2] = "Review MA ("+line.nik_ma+": "+this.getDataKaryawan(line.nik_ma).nama+")";
												}else if (line.progress_fc == "R") {
													if (line.no_sukka == '-'){
														data[3] = "Koreksi Review FC ("+line.nik_fc+": "+this.getDataKaryawan(line.nik_fc).nama+")";
													}else {
														data[3] = "<img width=17 height=17 src='icon/green.png' />.";
														if (line.status_sukka == "PENGAJU"){
															if (line.progress_grev == "null")
																data[0] = "Koreksi SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
															else if (line.progress_mrev == "null")
																data[1] = "Koreksi SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
															else data[2] = "Koreksi SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
														}else  data[3] = "Koreksi SUKKA("+line.nik_sk+": "+this.getDataKaryawan(line.nik_sk).nama+")";
													}
												}else if (line.progress_fc == "4") {
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													if (line.status_sukka == "PENGAJU"){
														if (line.progress_grev == "null")
															data[0] = "Approve SUKKA("+line.nik_skapp+": "+this.getDataKaryawan(line.nik_skapp).nama+")";
														else if (line.progress_mrev == "null")
															data[1] = "Approve SUKKA("+line.nik_skapp+": "+this.getDataKaryawan(line.nik_skapp).nama+")";
														else data[2] = "Approve SUKKA("+line.nik_skapp+": "+this.getDataKaryawan(line.nik_skapp).nama+")";
													}else data[3] = "Approve SUKKA("+line.nik_skapp+": "+this.getDataKaryawan(line.nik_skapp).nama+")";
												}else if (line.progress_fc == "41") {
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													if (line.status_sukka == "PENGAJU"){
														if (line.progress_grev == "null")
															data[0] = "Approve SUKKA("+line.nik_skapp2+": "+this.getDataKaryawan(line.nik_skapp2).nama+")";
														else if (line.progress_mrev == "null")
															data[1] = "Approve SUKKA("+line.nik_skapp2+": "+this.getDataKaryawan(line.nik_skapp2).nama+")";
														else data[2] = "Approve SUKKA("+line.nik_skapp2+": "+this.getDataKaryawan(line.nik_skapp2).nama+")";
													}else data[3] = "Approve SUKKA("+line.nik_skapp2+": "+this.getDataKaryawan(line.nik_skapp2).nama+")";
												}else if (line.progress_fc == "42") {
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													if (line.status_sukka == "PENGAJU"){
														if (line.progress_grev == "null")
															data[0] = "Approve SUKKA("+line.nik_skapp3+": "+this.getDataKaryawan(line.nik_skapp3).nama+")";
														else if (line.progress_mrev == "null")
															data[1] = "Approve SUKKA("+line.nik_skapp3+": "+this.getDataKaryawan(line.nik_skapp3).nama+")";
														else data[2] = "Approve SUKKA("+line.nik_skapp3+": "+this.getDataKaryawan(line.nik_skapp3).nama+")";
													}else data[3] = "Approve SUKKA("+line.nik_skapp3+": "+this.getDataKaryawan(line.nik_skapp3).nama+")";
												}else if (line.progress_fc == "2"){
													data[3] = "<img width=17 height=17 src='icon/green.png' />.";
													//if (lclLib.isGubis(line.kode_ubis) || line.progress_grev != "null" )
														var nik = {nik : line.nik_keep};
													//else var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FINOP");

													data[4] = "Proses SAP("+nik.nik+": "+this.getDataKaryawan(nik.nik).nama+")";
												}
											}else {
												/*if (lclLib.isGubis(line.kode_ubis) || line.sts_pdrk == "STB" || line.sts_pdrk == "OPN")
													var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FC");
												else var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FINOP");
												data[3] = "Review FC("+nik.nik+")";*/
											}
										}else if(!sudahReview){
											data[3] = "<img width=17 height=17 src='icon/grey.png' />.";
										}else data[3] = "<img width=17 height=17 src='icon/green.png' />.";
					   					//Pros SAP
					   					if (line.flag_rfc == "2" || line.flag_rfc == "3")
											data[4] = "<img width=17 height=17 src='icon/green.png' />.";
										else if (line.flag_rfc == "P")
                                            data[4] = "<img width=17 height=17 src='icon/grey.png' />Proses Tidak dilanjutkan.";
                                        else if ( (line.flag_rfc == "1" ||line.flag_rfc == "-" ) &&  ( ( line.progress_fc == "2" && ( line.sts_pdrkg == 'RRR' || line.sts_pdrk == "RRR" || line.sts_pdrkm == "ABT" || line.sts_pdrkm == "RRR") ) || ( line.progress_fc == "1" && ( line.sts_pdrk == 'STB' || line.sts_pdrkg == 'OPN' )  ) ) ){
											data[3] = "<img width=17 height=17 src='icon/green.png' />.";
											//if (lclLib.isGubis(line.kode_ubis) || ( line.sts_pdrk == 'STB' || line.sts_pdrkg == 'OPN' || line.progress_grev != "null") )
												//var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FC");
											//	var nik = {nik : line.nik_keep};
											var nik = {nik : line.nik_keep};
											//var nik = lclLib.getNIKFC(line.kode_ubis,"MGR","FINOP");
											data[4] = "Proses SAP("+nik.nik+":"+this.getDataKaryawan(nik.nik).nama+")";
										}else data[4] = "<img width=17 height=17 src='icon/grey.png' />.";
					   					//--------------------------------------
					   					if (line.progress == 'D')
					   						data[5] = "<span style='color:#ff0000;font-style:italic'>"+ line.no_pdrk +"</span>";
					   					else if (line.progress == 'R')
					   						data[5] = "<span style='color:#ffff00;font-style:italic'>"+ line.no_pdrk +"</span>";
					   					else
					   						data[5] = line.no_pdrk;
					   					data[6] = line.kode_ubis;
					   					data[7] = line.tgl;
					   					data[8] = line.keterangan;
					   					data[9] = parseFloat(line.nilai);
					   					data[10] = line.sts_pdrk;


				   					}
				   					this.sg1mp.appendData(data);
				   					this.sg1mp.rows.get(this.sg1mp.getRowCount()-1).setData(line);
				   				}catch(e){
				   					error_log(e);
									var l = "";
									for (var idx in line) l += idx +":"+line[idx];
									error_log(data + ":"+ l);

				   				}

							}

							this.sg1mp.hideLoading();
							this.sg1mp.frame.scrollTop = 0;
							this.sg1mp.setNoUrut((this.activePage - 1) * this.pager);
						}
					}
				}
			}
			if (sender == this.dataProviderPDRK && this == callbackObj){
				if (methodName == "getPosisiPDRK") {
			   		eval("brg = " + result + ";");
			   		if (typeof(brg) !== "string") {
			   			alert(brg.rs.rows);
			   		}
			   	}
			}
		  }catch(e){
				error_log(e+":"+result);
				var l = "";
				for (var idx in line) l += idx +":"+line[idx];
				error_log(data + ":"+ l);
				this.sg1mp.hideLoading();

		  }
	},
	doSgBtnClick: function(sender, col, row){
		try{
			if (col === 2)
				window.open("server/media/"+this.sg1mp2.getCell(1,row));
		}catch(e){
			alert(e);
		}
	},
	sg1onDblClick:function(sender, col, row){
		try{
			if (sender == this.sg1mp){
				var sql = new  server_util_arrayList();
				this.PDRK = sender.cells(5, row);
				this.doViewReport(sender.cells(5, row));
				var rowGrid = row;
				//var row = ((this.activePage - 1) * this.pager) + row;

				var line = sender.rows.get(rowGrid).getData();
				if (line){
					this.jenis_agg = line.jenis_agg;
					var page = this.p1mp.childPage[8];
				}
				this.aktif_record = line;

				sql.add("select a.no_rev, b.nama as ubis, date_format(a.tanggal, '%d-%m-%Y') as tgl, a.keterangan, "+
					"	c.nilai , a.no_nd, a.file_nd, a.sts_pdrk, a.jenis_agg, a.progress, a.justifikasi "+
					" from rra_rev_m a "+
					" inner join rra_ubis b on b.kode_ubis = a.kode_ubis and b.kode_lokasi = a.kode_lokasi "+
					" inner join (select kode_lokasi, no_rev, sum(nilai) as nilai from rra_rev_d where dc='D' and no_pdrk = '"+sender.cells(5, row)+"' group by kode_lokasi, no_rev) c on c.no_rev = a.no_rev and c.kode_lokasi = a.kode_lokasi "+
					" where a.no_pdrk = '"+sender.cells(5, row)+"' ");
				sql.add("select a.no_grev, b.nama as gubis, date_format(a.tanggal, '%d-%m-%Y') as tgl, a.keterangan, "+
					"	c.nilai , a.no_nd, a.file_nd, a.sts_pdrk, a.jenis_agg, a.progress, a.justifikasi "+
					" from rra_grev_m a "+
					" inner join rra_gubis b on b.kode_gubis = a.kode_gubis and b.kode_lokasi = a.kode_lokasi "+
					" inner join (select kode_lokasi, no_grev, sum(nilai) as nilai from rra_grev_d where dc='D' and no_pdrk = '"+sender.cells(5, row)+"' group by kode_lokasi, no_grev) c on c.no_grev = a.no_grev and c.kode_lokasi = a.kode_lokasi "+
					" where a.no_pdrk = '"+sender.cells(5, row)+"' ");
				sql.add("select a.no_mrev, b.nama as ubis, date_format(a.tanggal, '%d-%m-%Y') as tgl, a.keterangan, "+
					"	c.nilai , a.no_nd, a.file_nd, a.sts_pdrk, a.jenis_agg, a.progress, a.justifikasi "+
					" from rra_mrev_m a "+
					" inner join rra_ubis b on b.kode_ubis = a.kode_ubis and b.kode_lokasi = a.kode_lokasi "+
					" inner join (select kode_lokasi, no_mrev, sum(nilai) as nilai from rra_mrev_d where dc='D' and no_pdrk = '"+sender.cells(5, row)+"' group by kode_lokasi, no_mrev) c on c.no_mrev = a.no_mrev and c.kode_lokasi = a.kode_lokasi "+
					" where a.no_pdrk = '"+sender.cells(5, row)+"' ");
				sql.add("select a.no_frev, b.nama as ubis, date_format(a.tanggal, '%d-%m-%Y') as tgl, a.keterangan, "+
					"	c.nilai , a.no_nd, a.file_nd, a.sts_pdrk, a.jenis_agg, a.progress, a.justifikasi "+
					" from rra_frev_m a "+
					" inner join rra_ubis b on b.kode_ubis = a.kode_ubis and b.kode_lokasi = a.kode_lokasi "+
					" inner join (select kode_lokasi, no_frev, sum(nilai) as nilai from rra_frev_d where dc='D' and no_pdrk = '"+sender.cells(5, row)+"' group by kode_lokasi, no_frev) c on c.no_frev = a.no_frev and c.kode_lokasi = a.kode_lokasi "+
					" where a.no_pdrk = '"+sender.cells(5, row)+"' and a.no_frev like 'FREV%'");
				sql.add("select a.no_sukka, b.nama as ubis,date_format(a.tanggal, '%d-%m-%Y') as tgl, "+
					"	 a.modul, c.sts_pdrk, a.keterangan  "+
					" from rra_sukka a "+
					"	inner join rra_pdrk_m c on c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi "+
					" inner join rra_ubis b on b.kode_ubis = c.kode_ubis and b.kode_lokasi = a.kode_lokasi "+
					" where a.no_pdrk = '"+sender.cells(5, row)+"' ");

				sql.add("select distinct a.no_pdrk, a.nik_user, nvl(b.sts_pdrk, a.sts_pdrk) as sts_pdrk, date_format(a.tgl_input, '%d-%m-%Y') as tgl "+
						" , a.nik_buat, date_format(b.tgl_input,'%d-%m-%Y') as tgl1 "+
						" , nvl(b.nik_review,a.nik_review) as nik_review, date_format(c.tanggal,'%d-%m-%Y') as tgl2 "+
						" , nvl(b.nik_apppdrk3,a.nik_apppdrk3) as nik_apppdrk3, date_format(d.tanggal, '%d-%m-%Y') as tgl3 "+
						" , nvl(b.nik_apppdrk32,a.nik_apppdrk32) as nik_apppdrk32, date_format(dd.tanggal, '%d-%m-%Y') as tgl32 "+

						" , e.nik_user as fc1, date_format(e.tanggal, '%d-%m-%Y') as tgl4 "+
						" , f.nik_user as fc2, date_format(f.tanggal, '%d-%m-%Y') as tgl5 "+
						" , g.nik_user as fc3, date_format(g.tgl_input, '%d-%m-%Y') as tgl6 "+
						" , h.nik_user as fc4, date_format(h.tanggal, '%d-%m-%Y') as tgl7 "+
						" , o.nik_user as fc5, date_format(o.tanggal, '%d-%m-%Y') as tgl15 "+
						" , gg.nik_user as fnp1, date_format(gg.tgl_input, '%d-%m-%Y') as tglfinop "+

						" , nvl(i.nik_user,p.reviewer) as gr1, date_format(i.tgl_input, '%d-%m-%Y') as tgl8 "+
						" , nvl(i.nik_buat,'-') as gr2, date_format(j.tanggal, '%d-%m-%Y') as tgl9 "+
						" , nvl(i.nik_review,'-') as gr3, date_format(q.tanggal, '%d-%m-%Y') as gtgl9 "+
						" , nvl(k.nik_user,g.nik_review2) as ma1, date_format(k.tgl_input, '%d-%m-%Y') as tgl10 "+
						" , nvl(k.nik_buat,g.nik_review3) as ma2, date_format(l.tanggal, '%d-%m-%Y') as tgl11 "+
						" , nvl(k.nik_review,g.nik_review4) as ma3, date_format(ll.tanggal, '%d-%m-%Y') as tgl16 "+

						" , nvl(m.nik_buat,g.nik_sukka) as su1, date_format(m.tanggal, '%d-%m-%Y') as tgl12 "+
						" , nvl(m.nik_review, nvl(i.nik_review, nvl(b.nik_review,a.nik_review))) as su2, mm.no_surat as tgl13 "+
						" , nvl(m.nik_app, nvl(i.nik_app3, nvl(b.nik_app3,a.nik_app3))) as su3, date_format(n.tanggal, '%d-%m-%Y') as tgl14 "+
						" , nvl(m.nik_app2,'-') as su4, nvl(m.nik_app3,'-') as su5, date_format(oo.tanggal, '%d-%m-%Y') as tglsk4, date_format(pp.tanggal, '%d-%m-%Y') as tglsk5 "+
						" ,  b.no_rev, i.no_grev, k.no_mrev, g.no_frev "+
						" ,  a.progress, b.progress as prog_rev, i.progress as prog_grev, k.progress as prog_mrev, g.progress as prog_frev "+
						" ,  nvl(b.nik_appjust,a.nik_appjust) as nik_appjust "+
						" ,  nvl(b.nik_appjust2,a.nik_appjust2) as nik_appjust2 "+
						" ,  nvl(b.nik_review2,a.nik_review2) as nik_review2 "+
						" ,  nvl(b.nik_review3,a.nik_review3) as nik_review3 "+
						" ,  nvl(b.nik_review4,a.nik_review4) as nik_review4 "+
						" ,  nvl(b.nik_review5,a.nik_review5) as nik_review5 "+
						" ,  a.catatan "+
						" , nvl(g.nik_review2,'-') as fc_rev1 "+
						" , nvl(g.nik_review3,'-') as fc_rev2 "+
						" , nvl(g.nik_review4,'-') as fc_rev3 "+
						" from rra_pdrk_m a "+
						" 	inner join rra_gubis p on p.kode_gubis = a.kode_gubis "+
						"	left outer join rra_rev_m b on b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi "+
						"	left outer join rra_grev_m i on i.no_pdrk = a.no_pdrk and i.kode_lokasi = a.kode_lokasi "+
						"	left outer join rra_mrev_m k on k.no_pdrk = a.no_pdrk and k.kode_lokasi = a.kode_lokasi "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APP%' and z.status = 'APP') c on c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi and c.nik_app = nvl(b.nik_review,a.nik_review) "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APP%' and z.status = 'APP' ) d on d.no_pdrk = a.no_pdrk and d.kode_lokasi = a.kode_lokasi and d.nik_app = nvl(b.nik_appjust,a.nik_appjust) "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APP%' and z.status = 'APP') dd on dd.no_pdrk = a.no_pdrk and dd.kode_lokasi = a.kode_lokasi and dd.nik_app =  nvl(b.nik_appjust2,a.nik_appjust2) "+

						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'FCRK%' ) e on e.no_pdrk = a.no_pdrk and e.kode_lokasi = a.kode_lokasi "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'FCKEP%' ) f on f.no_pdrk = a.no_pdrk and f.kode_lokasi = a.kode_lokasi "+
						"	left outer join rra_frev_m g on g.no_pdrk = a.no_pdrk and g.kode_lokasi = a.kode_lokasi and g.no_frev like 'FREV%' "+
						"	left outer join rra_frev_m gg on gg.no_pdrk = a.no_pdrk and gg.kode_lokasi = a.kode_lokasi and gg.no_frev like 'FINOP%' "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APPFC%' and (z.status = 'APP' or z.status is null)) h on h.no_pdrk = a.no_pdrk and h.kode_lokasi = a.kode_lokasi "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_user, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'FCTRN%' ) o on o.no_pdrk = a.no_pdrk and o.kode_lokasi = a.kode_lokasi "+

						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where (x.no_app like 'GAPP%' or (x.no_app like 'APP%' and z.no_bukti like 'GREV%') ) and z.status = 'APP') j on j.no_pdrk = a.no_pdrk and j.kode_lokasi = a.kode_lokasi and j.nik_app = i.nik_buat "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'GAPP%' and z.status = 'APP') q on q.no_pdrk = a.no_pdrk and q.kode_lokasi = a.kode_lokasi and q.nik_app = i.nik_review "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where (x.no_app like 'MAPP%' or x.no_app like 'APPFC%' )and z.status = 'APP') l on l.no_pdrk = a.no_pdrk and l.kode_lokasi = a.kode_lokasi and l.nik_app = nvl(k.nik_buat, g.nik_review3) "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where (x.no_app like 'MAPP%' or x.no_app like 'APPFC%')and z.status = 'APP') ll on ll.no_pdrk = a.no_pdrk and ll.kode_lokasi = a.kode_lokasi and ll.nik_app = nvl(k.nik_review, g.nik_review4) "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where (x.no_app like 'MAPP%' or x.no_app like 'APPFC%')and z.status = 'APP') lll on lll.no_pdrk = a.no_pdrk and lll.kode_lokasi = a.kode_lokasi and lll.nik_app = nvl(k.nik_user, g.nik_review2) "+
						"	left outer join rra_sukka m on m.no_pdrk = a.no_pdrk and m.kode_lokasi = a.kode_lokasi "+
						"	left outer join rra_nosukka mm on mm.no_sukka = m.no_sukka and mm.kode_lokasi = a.kode_lokasi "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APP%SK%') n on n.no_pdrk = a.no_pdrk and n.kode_lokasi = a.kode_lokasi and n.nik_app = m.nik_app "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APP%SK%') oo on oo.no_pdrk = a.no_pdrk and oo.kode_lokasi = a.kode_lokasi and oo.nik_app = m.nik_app2 "+
						"	left outer join (select distinct z.catatan as no_pdrk, x.tgl_input as tanggal, x.nik_app, x.kode_lokasi from rra_app_m x inner join rra_app_d z on z.no_app = x.no_app and z.kode_lokasi = x.kode_lokasi where x.no_app like 'APP%SK%') pp on pp.no_pdrk = a.no_pdrk and pp.kode_lokasi = a.kode_lokasi and pp.nik_app = m.nik_app3 "+

						" where a.no_pdrk = '"+sender.cells(5, row) +"' and a.kode_lokasi = '"+this.app._lokasi+"' ");
				sql.add("select distinct file_dok, nama, no_urut, 'pdrk' as posisi  from rra_pdrk_dok a "+
						" left outer join rra_rev_m b on b.no_pdrk = a.no_pdrk "+
						"	where a.no_pdrk = '"+sender.cells(5, row) +"' and b.no_pdrk is null and a.kode_lokasi = '"+this.app._lokasi+"' "+
						" union "+
						"select distinct file_dok, nama, no_urut , 'rev' as posisi from rra_rev_dok a "+
						"  inner join rra_rev_m b on b.no_rev = a.no_rev "+
						"  left outer join rra_grev_m c on c.no_pdrk = b.no_pdrk "+
						"  left outer join rra_frev_m d on d.no_pdrk = b.no_pdrk and d.no_frev like 'FREV%' "+
						"	where b.no_pdrk = '"+sender.cells(5, row) +"' and c.no_pdrk is null and d.no_pdrk is null and a.kode_lokasi = '"+this.app._lokasi+"' "+
						" union "+
						"select distinct file_dok, nama, no_urut, 'grev' as posisi  from rra_grev_dok a "+
						"  inner join rra_grev_m b on b.no_grev = a.no_grev "+
						"  left outer join rra_mrev_m c on c.no_pdrk = b.no_pdrk "+
						"  left outer join rra_frev_m d on d.no_pdrk = b.no_pdrk and d.no_frev like 'FREV%' "+
						"	where b.no_pdrk = '"+sender.cells(5, row) +"' and c.no_pdrk is null and d.no_pdrk is null and a.kode_lokasi = '"+this.app._lokasi+"' "+
						" union "+
						"select distinct file_dok, nama, no_urut, 'mrev' as posisi  from rra_mrev_dok a "+
						"  inner join rra_mrev_m b on b.no_mrev = a.no_mrev "+
						"  left outer join rra_frev_m c on c.no_pdrk = b.no_pdrk and c.no_frev like 'FREV%' "+
						"	where b.no_pdrk = '"+sender.cells(5, row) +"' and c.no_pdrk is null   and a.kode_lokasi = '"+this.app._lokasi+"' "+
						" union "+
						"select distinct file_dok, nama, no_urut, 'frev' as posisi  from rra_frev_dok a "+
						"  inner join rra_frev_m b on b.no_frev = a.no_frev "+
						"	where b.no_pdrk = '"+sender.cells(5, row) +"' and a.kode_lokasi = '"+this.app._lokasi+"'  and b.no_frev like 'FREV%'  "+

						" order by no_urut");
				sql.add("select a.catatan, '-' as catatan2, a.tgl_input, to_char(a.tgl_input, 'dd-mm-yyyy HH24:MI') as tgl, a.nik_user,'c' as status,b.nama,'-' as nmtujuan from rra_catatan a inner join rra_karyawan b on b.nik = a.nik_user where no_pdrk = '"+sender.cells(5, row)+"' "+
						" union "+
						"select DBMS_LOB.substr(keterangan,4000,1) as keterangan,DBMS_LOB.substr(keterangan,4000,4001) as ket2, tanggal, to_char(tanggal, 'dd-mm-yyyy HH24:MI') as tgl, nik_user,'dis' as status, b.nama, c.nama as nmtujuan "+
						" from rra_disposisi a inner join rra_karyawan b on b.nik = a.nik_user "+
						" inner join rra_karyawan c on c.nik = a.nik_tujuan "+
						" where no_pdrk = '"+sender.cells(5, row)+"' order by tgl_input");

				var data = this.dbLib.getMultiDataProvider(sql,true);
				//eval("data = "+data+";");
				this.standarLib.clearByTag(this, ["1"],undefined);
				if (typeof data != "String"){

					var tmp = data.result[0];
					if (tmp.rs.rows[0] != undefined){
						var page = this.p1mp.childPage[3];
						page.no_rev.setText(tmp.rs.rows[0].no_rev);
						page.ubis.setText(tmp.rs.rows[0].ubis);
						page.tgl.setText(tmp.rs.rows[0].tgl);
						page.ket.setText(tmp.rs.rows[0].keterangan);
						page.nilai.setText(floatToNilai(tmp.rs.rows[0].nilai));
						page.nd.setText(tmp.rs.rows[0].no_nd);
						page.filend.setText(tmp.rs.rows[0].file_nd);
						page.jenis.setText(tmp.rs.rows[0].sts_pdrk);
						page.modul.setText(tmp.rs.rows[0].jenis_agg);
						page.eProg.setText(tmp.rs.rows[0].progress);
						page.mDesk.setCode(urldecode(tmp.rs.rows[0].justifikasi));
					}
					tmp = data.result[1];
					if (tmp.rs.rows[0] != undefined){
						var page = this.p1mp.childPage[4];
						page.no_rev.setText(tmp.rs.rows[0].no_grev);
						page.ubis.setText(tmp.rs.rows[0].gubis);
						page.tgl.setText(tmp.rs.rows[0].tgl);
						page.ket.setText(tmp.rs.rows[0].keterangan);
						page.nilai.setText(floatToNilai(tmp.rs.rows[0].nilai));
						page.nd.setText(tmp.rs.rows[0].no_nd);
						page.filend.setText(tmp.rs.rows[0].file_nd);
						page.jenis.setText(tmp.rs.rows[0].sts_pdrk);
						page.modul.setText(tmp.rs.rows[0].jenis_agg);
						page.eProg.setText(tmp.rs.rows[0].progress);
						page.mDesk.setCode(urldecode(tmp.rs.rows[0].justifikasi));
					}
					tmp = data.result[2];
					if (tmp.rs.rows[0] != undefined){
						var page = this.p1mp.childPage[5];
						page.no_rev.setText(tmp.rs.rows[0].no_mrev);
						page.ubis.setText(tmp.rs.rows[0].ubis);
						page.tgl.setText(tmp.rs.rows[0].tgl);
						page.ket.setText(tmp.rs.rows[0].keterangan);
						page.nilai.setText(floatToNilai(tmp.rs.rows[0].nilai));
						page.nd.setText(tmp.rs.rows[0].no_nd);
						page.filend.setText(tmp.rs.rows[0].file_nd);
						page.jenis.setText(tmp.rs.rows[0].sts_pdrk);
						page.modul.setText(tmp.rs.rows[0].jenis_agg);
						page.eProg.setText(tmp.rs.rows[0].progress);
						page.mDesk.setCode(urldecode(tmp.rs.rows[0].justifikasi));
					}
					tmp = data.result[3];
					if (tmp.rs.rows[0] != undefined){
						var page = this.p1mp.childPage[6];
						page.no_rev.setText(tmp.rs.rows[0].no_frev);
						page.ubis.setText(tmp.rs.rows[0].ubis);
						page.tgl.setText(tmp.rs.rows[0].tgl);
						page.ket.setText(tmp.rs.rows[0].keterangan);
						page.nilai.setText(floatToNilai(tmp.rs.rows[0].nilai));
						page.nd.setText(tmp.rs.rows[0].no_nd);
						page.filend.setText(tmp.rs.rows[0].file_nd);
						page.jenis.setText(tmp.rs.rows[0].sts_pdrk);
						page.modul.setText(tmp.rs.rows[0].jenis_agg);
						page.eProg.setText(tmp.rs.rows[0].progress);
						page.mDesk.setCode(urldecode(tmp.rs.rows[0].justifikasi));
					}
					tmp = data.result[4];
					if (tmp.rs.rows[0] != undefined){
						var page = this.p1mp.childPage[7];
						page.no_rev.setText(tmp.rs.rows[0].no_sukka);
						page.ubis.setText(tmp.rs.rows[0].ubis);
						page.tgl.setText(tmp.rs.rows[0].tgl);
						page.modul.setText(tmp.rs.rows[0].modul);
						page.jenis.setText(tmp.rs.rows[0].sts_pdrk);
						page.mDesk.setCode(urldecode(tmp.rs.rows[0].keterangan));
					}
					tmp = data.result[5];
					this.p1mp.childPage[8].lPDRK.setCaption(" NO PDRK : " + sender.cells(5,row));
					if (tmp.rs.rows[0] != undefined){
						var page = this.p1mp.childPage[8];
						var line = tmp.rs.rows[0];
						var posisi = "";
						for (var i=0;i <= 4;i++){
							if (sender.cells(i, rowGrid) != "." && sender.cells(i, rowGrid).substr(0,4) != "Keep" && sender.cells(i, rowGrid).substr(0,11) !="Review Keep" )
								posisi = sender.cells(i, rowGrid);
						}

						if (sender.rowData.get(row)[4].indexOf("green") > -1)
							page.lProgress.setCaption("Selesai");
						else page.lProgress.setCaption("Posisi : " + posisi);
						page.lCatatan.setCaption("Catatan : " + line.catatan);
						page.p1.ePengaju.setText(line.nik_user+": "+this.getDataKaryawan(line.nik_user).nama);
						page.p1.tPengaju.setText(line.tgl);
						page.p1.eReview.setText(line.nik_buat+": "+this.getDataKaryawan(line.nik_buat).nama);
						page.p1.tReview.setText(line.tgl1);
						page.p1.eApp1.setText(line.nik_review+": "+this.getDataKaryawan(line.nik_review).nama);
						page.p1.tApp1.setText(line.tgl2);
						//if (line.sts_pdrk == "OPN" || line.sts_pdrk == "STB"){
							page.p1.eApp2.setText(line.nik_appjust+": "+this.getDataKaryawan(line.nik_appjust).nama);
							page.p1.eApp3.setText(line.nik_appjust2+": "+this.getDataKaryawan(line.nik_appjust2).nama);
						//}else{
						//	page.p1.eApp2.setText(line.nik_apppdrk3);
						//	page.p1.eApp3.setText(line.nik_apppdrk32);
						//}
						page.p1.tApp2.setText(line.tgl3);

						page.p1.tApp3.setText(line.tgl32);
						page.p2.eFinop.setText(line.fnp1+": "+this.getDataKaryawan(line.fnp1).nama);
						page.p2.tFinop.setText(line.tglfinop);

						page.p2.eReview.setText(line.fc1+": "+this.getDataKaryawan(line.fc1).nama);
						page.p2.tReview.setText(line.tgl4);
						page.p2.eKeep.setText(line.fc2+": "+this.getDataKaryawan(line.fc2).nama);
						page.p2.tKeep.setText(line.tgl5);
						page.p2.eReview2.setText(line.fc3+": "+this.getDataKaryawan(line.fc3).nama);
						page.p2.tReview2.setText(line.tgl6);
						page.p2.eApp1.setText(line.fc4+": "+this.getDataKaryawan(line.fc4).nama);
						page.p2.tApp1.setText(line.tgl7);
						page.p2.eSAP.setText(line.fc5+": "+this.getDataKaryawan(line.fc5).nama);
						page.p2.tSAP.setText(line.tgl15);

						page.p6.eReview.setText(line.nik_review+": "+this.getDataKaryawan(line.nik_review).nama);
						page.p6.eKeep.setText(line.nik_review2+": "+this.getDataKaryawan(line.nik_review2).nama);
						page.p6.eReview2.setText(line.nik_review3+": "+this.getDataKaryawan(line.nik_review3).nama);
						page.p6.eApp1.setText(line.nik_review4+": "+this.getDataKaryawan(line.nik_review4).nama);
						page.p6.eSAP.setText(line.nik_review5+": "+this.getDataKaryawan(line.nik_review5).nama);

						page.p6.tReview.setText(this.getTglReview(sender.cells(5, row), line.nik_review ));
						page.p6.tKeep.setText(this.getTglReview(sender.cells(5, row), line.nik_review2 ));
						page.p6.tReview2.setText(this.getTglReview(sender.cells(5, row), line.nik_review3 ));
						page.p6.tApp1.setText(this.getTglReview(sender.cells(5, row), line.nik_review4 ));
						page.p6.tSAP.setText(this.getTglReview(sender.cells(5, row), line.nik_review5 ));


						page.p3.eReview.setText(line.gr1+": "+this.getDataKaryawan(line.gr1).nama);
						page.p3.tReview.setText(line.tgl8);
						page.p3.eApp1.setText(line.gr2+": "+this.getDataKaryawan(line.gr2).nama);
						page.p3.tApp1.setText(line.tgl9);
						page.p3.eApp2.setText(line.gr3+": "+this.getDataKaryawan(line.gr3).nama);
						page.p3.tApp2.setText(line.gtgl9);

						page.p4.eReview.setText(line.ma1+": "+this.getDataKaryawan(line.ma1).nama);
						page.p4.tReview.setText(line.tgl10);
						page.p4.eApp1.setText(line.ma2+": "+this.getDataKaryawan(line.ma2).nama);
						page.p4.tApp1.setText(line.tgl11);
						page.p4.eApp2.setText(line.ma3+": "+this.getDataKaryawan(line.ma3).nama);
						page.p4.tApp2.setText(line.tgl16);

						page.p5.ePengaju.setText(line.su1+": "+this.getDataKaryawan(line.su1).nama);
						page.p5.tPengaju.setText(line.tgl12);
						page.p5.eReview.setText(line.su2+": "+this.getDataKaryawan(line.su2).nama);
						page.p5.tReview.setText(line.tgl13);
						page.p5.eApp1.setText(line.su3+": "+this.getDataKaryawan(line.su3).nama);
						page.p5.tApp1.setText(line.tgl14);
						page.p5.eApp2.setText(line.su4+": "+this.getDataKaryawan(line.su4).nama);
						page.p5.tApp2.setText(line.tglsk4);
						page.p5.eApp3.setText(line.su5+": "+this.getDataKaryawan(line.su5).nama);
						page.p5.tApp3.setText(line.tglsk5);
						this.no_review = line.no_pdrk;
						if (line.no_frev != "-" && line.no_frev != ""){
							table = "frev";
							this.no_review = line.no_frev;
						}else if (line.prog_mrev != "-" && line.prog_mrev != ""){
							table = "mrev";
							this.no_review = line.no_mrev;
						}else if (line.prog_grev != "-" && line.prog_grev != ""){
							table = "grev";
							this.no_review = line.no_grev;
						}else if (line.prog_rev != ""){
							table = "rev";
							this.no_review = line.no_rev;
						}else{
							 table = "pdrk";
							 this.no_review = line.no_pdrk;
						}

					}
					result = data.result[6];
					tmp = data.result[7];
					page = this.p1mp.childPage[8];
					var catatan = "";
					//error_log(this.dataProviderPDRK.getLogCatatan(sender.cells(5, row) );
					//page.p7.sg.clear();
					if (tmp.rs.rows[0] != undefined){
						for (var r in tmp.rs.rows){
							line = tmp.rs.rows[r];
							try{
								if (line.status == 'dis'){
									catatan += "<h3>"+line.nama+" disposisi ke "+line.nmtujuan+" - "+line.tgl+" </h3><div style='border-bottom:1px solid #999'>"+urldecode(line.catatan+line.catatan2)+"</div>";
								}else
									catatan += "<h3>"+line.nama+" - "+line.tgl+" </h3><p style='border-bottom:1px solid #999'>"+line.catatan+"</p>";
							}catch(e){
								catatan += "<h3>"+line.nama+" disposisi ke "+line.nmtujuan+" - "+line.tgl+" </h3><div style='border-bottom:1px solid #999'>"+line.catatan+"</div>";
							}

						}
					}

					/*tmp = data.result[8];
					if (tmp.rs.rows[0] != undefined){
						for (var r in tmp.rs.rows){
							line = tmp.rs.rows[r];
							//page.p7.sg.appendData([line.catatan, line.tgl, line.nik_user]);
							catatan += "<h3>"+line.nama+" - "+line.tgl+" </h3><p>"+urldecode(line.keterangan)+"</p>";
						}
					}	*/
					//error_log(catatan);
					page.p7.eLog.setInnerHTML(catatan);
					this.table = table;
					/*result = this.dbLib.getDataProvider("select distinct file_dok, nama, no_urut  from rra_"+table+ "_m a "+
						" inner join rra_"+table+"_dok b on b.no_"+table+" = a.no_"+table+" " +
						"	where a.no_pdrk = '"+sender.cells(5, row) +"' and a.kode_lokasi = '"+this.app._lokasi+"' order by no_urut", true);
					*/
					if (result){
						page = this.p1mp.childPage[9];
						page.sgUpld.clear();
						if (result.rs.rows[0] != undefined){
							for (var r in result.rs.rows){
								line = result.rs.rows[r];
								page.sgUpld.appendData([line.file_dok, line.nama]);
							}
						}
					}
				}
			}

		}catch(e){
			alert(e);
		}
	},
	getTglReview: function(no_pdrk, nik){
		var data = this.dbLib.getDataProvider("select date_format(tanggal,'%d-%m-%Y') as tgl from rra_app_m a  "+
			" inner join rra_app_d b on b.no_app = a.no_app and b.kode_lokasi = a.kode_lokasi  "+
			" where a.nik_app = '"+nik+"' and b.catatan = '"+no_pdrk+"' and a.no_app like 'APP%'  ",true);
		if (typeof data == "string"){
			error_log(data);
			return;
		}
		if (data.rs.rows[0] != undefined){
			return data.rs.rows[0].tgl;
		}else return "";
	},
	doSgClick:function(sender, col, row){
	},
	mainButtonClik: function(sender){
	   if (sender == this.app._mainForm.bSimpan) system.confirm(this, "simpan", "Apa data sudah benar?","data di form ini akan di proses.");
    },
	doSelectFilterCell: function(sender, col, row){
		try{
			//sender.columns.get(2).setReadOnly(false);
			//sender.columns.get(2).setReadOnly(true);
			this.filterRep.setSGFilterRowTipe(sender, row,new Array(0,1,2,3,4,5,6),new  Array("1235","1235i","1235","123","123","13","13","13"));
			this.filterRep.setSGFilterRowButtonStyle(sender, row,new Array(0,1,2,3,4,5,6),new  Array(0,2,2,0,2,0,0));
			if (row == 0)
			{

				var rs = this.dbLib.runSQL("select distinct periode from rra_pdrk_m where kode_lokasi='"+this.app._lokasi+"' order by periode desc ");
				if (rs instanceof arrayMap){
					sender.columns.get(2).pickList.clear();
					var ix=0;
					for (var i in rs.objList){
						sender.columns.get(2).pickList.set(ix, rs.get(i).get("periode"));
						ix++;
					}
				}
			}

			if (row == 3){
				this.sgFilter.columns.get(2).pickList.clear();
				this.gridLib.SGIsiItemsFromArray(this.sgFilter.columns.get(2).pickList,["OPEX","CAPEX"]);
			}
			if (row == 5){
				this.sgFilter.columns.get(2).pickList.clear();
				this.gridLib.SGIsiItemsFromArray(this.sgFilter.columns.get(2).pickList,["BELUM","SELESAI"]);
			}
		}catch(e){
			alert(e);
		}

	},
	doEllipsFilterClick: function(sender, col, row){
		if (row == 1)
		{
			this.filterRep.ListDataSGFilter(this, "Data UBIS",sender, sender.row, sender.col,
					"select distinct a.kode_ubis, a.nama from rra_ubis a where kode_lokasi = '"+this.app._lokasi+"'",
					"select count(*) from rra_ubis where kode_lokasi = '"+this.app._lokasi+"' ",
					["kode_ubis","nama"],"and",["Kode","Deskripsi"], false, sender.cells(1,row) == "in");
		}
		if (row == 2)
		{
			this.filterRep.ListDataSGFilter(this, "Data PDRK",sender, sender.row, sender.col,
					"select distinct no_pdrk, keterangan from rra_pdrk_m a "+
					" where a.kode_lokasi = '"+this.app._lokasi+"'   "+
					this.filterRep.filterStr("a.kode_ubis",sender.cells(1,1),sender.cells(2,1),sender.cells(3,1),"and"),
					"select count(*) from rra_pdrk_m a "+
					" where a.kode_lokasi = '"+this.app._lokasi+"' "+
					this.filterRep.filterStr("a.kode_ubis",sender.cells(1,1),sender.cells(2,1),sender.cells(3,1),"and")+ "  ",
					["no_pdrk","keterangan"],"and",["No PDRK","Keterangan"]);
		}
		if (row == 4)
		{
			this.filterRep.ListDataSGFilter(this, "Data Karyawan",sender, sender.row, sender.col,
					"select distinct a.nik, a.nama from rra_karyawan a where kode_lokasi = '"+this.app._lokasi+"'",
					"select count(*) from rra_karyawan where kode_lokasi = '"+this.app._lokasi+"' ",
					["nik","nama"],"and",["NIK","Nama"], false, sender.cells(1,row) == "in");
		}
	},
	doViewReport: function(no_bukti,jenis){
		if (this.report == undefined)
			this.report = new server_report_report();
		var filter = "where a.no_pdrk = '"+no_bukti+"'";
		var filter2 = "/"+this.app._periodeGAR+"/"+jenis+"/"+this.app._kodeUbis+"/"+this.app._namaForm;
		var url = [
			this.report.previewWithHeader("server_report_rra_rptPdrk1",filter, 1,  1, this.showFilter, this.app._namaLokasi,filter2),
			this.report.previewWithHeader("server_report_rra_rptPdrk2",filter, 1,  1, this.showFilter, this.app._namaLokasi,filter2),
			this.report.previewWithHeader("server_report_rra_rptPdrk3",filter, 1,  1, this.showFilter, this.app._namaLokasi,filter2),
			this.report.previewWithHeader("server_report_rra_rptPdrk4",filter, 1,  1, this.showFilter, this.app._namaLokasi,filter2),
			this.report.previewWithHeader("server_report_rra_rptSukka",filter, 1,  1, this.showFilter, this.app._namaLokasi,filter2)
			];
		this.viewer.previewMultiPage(url, true, ["PDRK-1","PDRK-2","PDRK-3","PDRK-4","SUKKA"]);
		this.p1mp.setActivePage(this.p1mp.childPage[1]);
		this.url = url;
		this.urlName = ["PDRK-1","PDRK-2","PDRK-3","PDRK-4","SUKKA"];
	},
	doPrint: function(sender){
		for (var i in this.url){
			//this.viewer.print();
			window.open(this.url[i], this.urlName[i]);
		}
	}
});


function urldecode(str) {
    try{
	   /*var encoded = str;
	   return decodeURIComponent(encoded.replace(/\+/g,  " "));*/
     replaceCodeArray = [];

     replaceCodeArray["%25"] = "%";
     replaceCodeArray["%0D"] = "\r";
     replaceCodeArray["%0A"] = "\n";
     replaceCodeArray["%2B"] = "+";
     replaceCodeArray["+"] = " ";
     replaceCodeArray["%21"] = "!";
     replaceCodeArray["%22"] = '"';
     replaceCodeArray["%23"] = "#";
     replaceCodeArray["%24"] = "$";
     replaceCodeArray["%26"] = "&";
     replaceCodeArray["%27"] = "'";
     replaceCodeArray["%28"] = "(";
     replaceCodeArray["%29"] = ")";
     replaceCodeArray["%2A"] = "*";
     replaceCodeArray["%2C"] = ",";
     replaceCodeArray["%2F"] = "/";
     replaceCodeArray["%3A"] = ":";
     replaceCodeArray["%3B"] = ";";
     replaceCodeArray["%3C"] = "<";
     replaceCodeArray["%3D"] = "=";
     replaceCodeArray["%3E"] = ">";
     replaceCodeArray["%3F"] = "?";
     replaceCodeArray["%40"] = "@";
     replaceCodeArray["%5B"] = "[";
     replaceCodeArray['%5C'] = "\\";
     replaceCodeArray["%5D"] = "]";
     replaceCodeArray["%5E"] = "^";
     replaceCodeArray["%60"] = "`";
     replaceCodeArray["%7B"] = "{";
     replaceCodeArray["%7C"] = "|";
     replaceCodeArray["%7D"] = "}";
     replaceCodeArray["%7E"] = "~";
    if (typeof(str) == "string")
    {
          var result = [];
          var lgt = str.length;

          var nowChar = "";
          var replaceStr = undefined;
              //%2D
          for (var i = 0; i < lgt; i++)
          {
              nowChar = str.charAt(i);
              if (nowChar == '%'){
                 nowChar = str.substr(i,3);
                 i += 2;
              }
              replaceStr = replaceCodeArray[nowChar];

              if (replaceStr != undefined)
                  result.push(replaceStr);
              else
                  result.push(nowChar);
          }
        return result.join("");
    }
    else
          return str;
    }catch(e){
      systemAPI.alert(e);
    }
};