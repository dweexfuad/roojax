window.app_saku_modul_fUploadDokICM = function(owner)
{
	if (owner)
	{
		window.app_saku_modul_fUploadDokICM.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fUploadDokICM";
		this.itemsValue = new arrayList();		
		this.maximize();	
		this.app._mainForm.childFormConfig(this, "mainButtonClick", "Upload Dokumen ICM", 0);

        uses("control_popupForm;column;saiEdit;saiGrid;saiUpload;portalui_uploader", true);			
        this.container = new panel(this, {bound:[0, 0,this.width - 5, this.height - 8]});
		this.container.getCanvas().css({borderStyle: "none"});
	
		this.icm = new saiCBBL(this.container, {bound:[20, 5, 200, 20], caption:"ICM"});
		this.tahun = new saiLabelEdit(this.container, {bound:[20, 10, 200, 20], caption:"Tahun", placeHolder:"YYYYMM", readOnly: true});
		this.bulan = new saiCB(this.container, {bound:[20, 15, 200, 20], caption:"Bulan", readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"]});
		this.reload = new button(this.container, {bound:[this.bulan.width + 30, 15, 80, 20], icon:"<i class='fa fa-refresh' style='color:white'></i>", caption:"Reload"});
		// this.info = new label(this.container, {bound:[20, 20, 400, 20], fontColor:"black" ,caption:"*) : bulan yang tersedia sesuai bulan yang tidak di-lock admin.", bold: true, fontSize:8, visible:true});

		this.icm.on("change", () => {
			this.sg1.clear(1);
		});
		this.reload.on("click", () => {
			let res = this.formValidate();
			if(res.isError){
				let msg = this.createError(res.message);
				system.alert(this, msg, "");
			}else{
				this.loadFiles();
			}
		});
		this.container.rearrangeChild(15, 25);

		this.sg1 = new saiGrid(this.container,{bound:[20, this.reload.top + 40, this.container.width * (3/4) + 260, this.container.height * (3/4)],
			colCount: 7,
			colTitle: ["Status File", "Upload", "Nama File", "Tanggal Update", "User Update", "Open File", "Delete"],
			colWidth:[[0, 1, 2, 3, 4, 5, 6],[100, 100, 400, 150, 100, 100, 100]],
			columnReadOnly:[true, [2, 3, 4],[0, 1]],	
			colFormat:[[1],[cfUpload]],					
			rowPerPage:20, autoPaging:true});
		this.sg1.hideNavigator();

		this.sg1.on('change', (col, row, val) => {
			if(col == 1){
				if(this.sg1.cells(0, row) == ""){
					this.sg1.addRowValues(["", "", "", "-", "-", "-", "-"]);
				}

				let status = this.sg1.cells(0, row) == "Current" ||  this.sg1.cells(0, row) == "Edit"? "Edit" : "New";
				this.sg1.setCell(0, row, status);
				this.sg1.setCell(2, row, val);
			}
		});

		this.sg1.on("cellclick", (sender, col, row, data, id) => {
			if(col == 5 && this.sg1.cells(5, row) == this.btn1){

				let period = this.tahun.getText() +''+ this.bulan.getText();
				let icm = this.icm.getText();
				let nu = row + 1;
				let file = this.sg1.cells(2, row);
				this.downloadS3(period, icm, nu, file);
			}

			if(col == 6){
				
				if(this.sg1.cells(6, row) == this.btn2){

					this.sg1.setCell(0, row, "Delete");
					this.sg1.setCell(6, row, this.btn3);

				}else if(this.sg1.cells(6, row) == this.btn3){
					
					this.sg1.setCell(0, row, "Current");
					this.sg1.setCell(6, row, this.btn2);

				}
			}

		});

		try{
			this.sg1.addRowValues(["", "", "", "-", "-", "-", "-"]);

			let period = this.app._periode;
			let year = period.substr(0,4);
			this.tahun.setText(year);

			// this.app.services.callServices("financial_mantisFiles", "getFilesICM", [this.app._lokasi, this.icm.getText()] , (data) => {
			// 	if(data.length > 0) {
	
			// 	}
			// });

			this.icm.setServices(this.app.servicesBpc, "callServices",["financial_mantisFiles","getListIcm",[]],["icm","pekerjaan"],"","Data ICM");


			this.app._mainForm.bHapus.hide();
			this.app._mainForm.bClear.hide();
			this.on("close", () => {
				this.app._mainForm.bHapus.show();
				this.app._mainForm.bClear.show();
			});
		}catch(error) {

		}

	}
};
window.app_saku_modul_fUploadDokICM.extend(window.childForm);
window.app_saku_modul_fUploadDokICM.implement({
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
	downloadS3: function(period, icm, nu, file) {
		console.log(period, icm, nu, file);
		window.open("server/bacaFileMantis.php?action=read&period="+ period +"&icm="+ icm +"&nu="+ nu +"&file="+ file);
	},
	setPrevState: function(col, row, val) {
		if(this.prevState == undefined){
			alert("found undefined");

			this.prevState = [];
		}
		this.prevState.push(val);
		console.log(this.prevState);
	},
	setBtn: function() {
		this.btn1 = "<div style='padding-top:3px; top:-3px;left:-3px;width:100%;height:100%;text-align: center;cursor: pointer;background-color:#ce93d8'><i style='text-align:center;' class='fa fa-download fa-lg' aria-hidden='true'></i></div>";
		this.btn2 = "<div style='padding-top:3px; top:-3px;left:-3px;width:100%;height:100%;text-align: center;cursor: pointer;background-color:#ef5350'><i style='text-align:center;' class='fa fa-trash fa-lg' aria-hidden='true'></i></div>";
		this.btn3 = "<div style='padding-top:3px; top:-3px;left:-3px;width:100%;height:100%;text-align: center;cursor: pointer;background-color:#ef5350'>Cancel</div>";
	},
	loadFiles: function() {
		let data = {
			icm : this.icm.getText(),
			tahun: this.tahun.getText(),
			bulan: this.bulan.getText()
		};
		this.app.services.callServices("financial_mantisFiles", "getFilesICM", [this.app._lokasi, data] , (data) => {
			if(data.isSuccess){
				if(data.files.length > 0) {
					this.sg1.clear();
					
					this.setBtn();
	
					for(let key in data.files){
						let val = data.files[key];
						this.sg1.addRowValues([val.status, "", val.nama_file, val.tgl_update, val.user_update, this.btn1, this.btn2]);
					}
					this.sg1.addRowValues(["", "", "", "-", "-", "-", "-"]);
	
				}else{
					this.sg1.clear(1);
					let periode = this.tahun.getText() +''+ this.bulan.getText();
					system.info(this, 'Dokumen upload untuk ICM ' + this.icm.getText() + ' dan periode ' + periode + ' tidak ditemukan.', '');
				}
			}else{
				system.info(this, data.message, '');
			}
		});
	},
	formValidate: function(files) {
		console.log("validate form...");
		let errors = [];
		let foundErr = false;

		if(this.icm.getText() == ""){
			errors.push("Mohon isi ICM");
			foundErr = true;
		}
		if(this.tahun.getText() == ""){
			errors.push("Mohon isi tahun");
			foundErr = true;
		}
		if(this.bulan.getText() == ""){
			errors.push("Mohon isi bulan");
			foundErr = true;
		}

		let res = {
			isError: foundErr,
			message: errors
		};

		return res;
	},
	createError: function(errors) {
		let li = "";
		let ul = "";

		for(var val in errors){
			li += "<li>" +errors[val]+ "</li>";
		}
		ul = "<ul>" +li+ "</ul>";
		return ul;
	},
	saveFiles: function() {
		console.log("save files ICM...");
		var files = [];
		for (var i = 0; i < this.sg1.getRowCount();i++){				
			var file = {
				status_file : this.sg1.cells(0,i),
				nama_file : this.sg1.cells(2,i)
			};
			files.push(file);
		}

		const res = this.formValidate(files);
		if(res.isError){
			let err = this.createError(res.message);
			system.alert(this, err);
		}else{
			let data = {
				icm: this.icm.getText(),
				tahun: this.tahun.getText(),
				bulan: this.bulan.getText()
			}
			this.app.services.callServices("financial_mantisFiles", "saveFilesICM", [this.app._lokasi, data, files] , (ret) => {
				if(ret.type == 'success'){
					system.info(this, ret.message, "");
				}else{
					system.alert(this, ret.message, "");
				}
			});
		}
		
	},
	doModalResult: function(event, modalResult){
		if (modalResult != mrOk) return false;
		switch (event){
			case "clear" :
				break;
			case "simpan" :
				this.saveFiles();
				break;
			case "simpancek" :
				break;
			case "ubah" :
				break;
			case "hapus" :
				break;
		}
	}
});
