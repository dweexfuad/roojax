window.app_saku_modul_fInbox = function(owner, menu)
{
	if (owner)
	{
		window.app_saku_modul_fInbox.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_modul_fInbox";
		this.itemsValue = new arrayList();		
		this.maximize();	
		uses("control_popupForm;pageControl;childPage;panel;frame;tinymceCtrl;listCustomView");			
		this.setHeight( this.height - 96);
		this.setColor("#dedede");
		var self=this;

		this.getClientCanvas().css({overflow:"auto"});

		self.fcbp="-";
		if(menu == undefined){
			menu = this.app._menu;
		}else{
			this.app._menu = menu;
		}

		
		
		if(menu == "SMX41" || menu == "SMX42" || menu == "SMX43" || menu == "SMX44" || menu == "SMX45" || menu == "SMX46" || menu == "SMX47" || menu == "SMX48" || menu == "SMX49"){
			self.fcbp = "1";
		}else if(menu == "SMX51" || menu == "SMX52" || menu == "SMX53" || menu == "SMX54" || menu == "SMX55" || menu == "SMX56" || menu == "SMX57" || menu == "SMX58" || menu == "SMX59"){
			self.fcbp = "2";
		}else if(menu == "SMX61" || menu == "SMX62" || menu == "SMX63" || menu == "SMX64" || menu == "SMX65" || menu == "SMX66" || menu == "SMX67" || menu == "SMX68" || menu == "SMX69"){
			self.fcbp = "3";
		}else if(menu == "SMX71" || menu == "SMX72" || menu == "SMX73" || menu == "SMX74" || menu == "SMX75" || menu == "SMX76" || menu == "SMX77" || menu == "SMX78" || menu == "SMX79"){
			self.fcbp = "4";
		}else if(menu == "SMX81" || menu == "SMX82" || menu == "SMX83" || menu == "SMX84" || menu == "SMX85" || menu == "SMX86" || menu == "SMX87" || menu == "SMX88" || menu == "SMX89"){
			self.fcbp = "5";
		}else if(menu == "ALL"){
			self.fcbp = "ALL";
		}else if(menu == "FINAL"){
			self.fcbp = "FINAL";
		}else if(menu == "SPBDONE"){
			self.fcbp = "SPBDONE";
		}else if(menu == "REJECTOFF"){
			self.fcbp = "REJECTOFF";
		}else if(menu == "SUBCHECK"){
			self.fcbp = "SUBCHECK";
		}


		self.isi_filter = "XAPP";

		this.lTitle000 = new label(this, {bound:[20,20,400,20], caption:"To Do", visible:true, bold: true, fontSize:18});
		this.lTitle001 = new label(this, {bound:[20,240,400,20], caption:"Dokumen BA Rekon",  visible:true, bold: true, fontSize:18});
		
		this.filter_fcbp = new saiCB(this,{bound:[500,20,200,20], visible:false, caption:"FCBP", items:["ALL","1","2","3","4","5"],readOnly:true,change:[this,"doChange"]});		
		this.filter_fcbp.setItemHeight(6);

		this.periode = new saiLabelEdit(this,{bound:[500,45,200,20], visible:false, placeHolder:"YYYY", caption:"Tahun", change:[this,"doChange"]});		
		this.search_fcbp = new button(this,{bound:[600,70,100,20], visible:false, caption:"Search", icon:"<i class='fa fa-search' style='color:white'></i>", change:[this,"doChange"]});		
		this.search_fcbp.setColor("mediumseagreen");	
		var self=this;
		
		this.search_fcbp.on("click",function(sender){
			try{
				
				if(self.periode.getText() == "" && self.filter_fcbp.getText() == ""){
					system.alert(this, "FCBP & Tahun Harap Diisi!");
				}else{
					
					if(self.periode.getText() != "" && self.filter_fcbp.getText() != "" ){
						self.isi_filter = "XAPP1"
					}else if(self.periode.getText() == ""){
						self.isi_filter = "XAPP2"
					}else if(self.filter_fcbp.getText() == ""){
						self.isi_filter = "XAPP3"
					}

				
				}
				// self.hideLoading();
			}catch(e){
				alert(e);
			}
		});



		
		/*MANTIS*/
			//to do
				this.mtsLogo0 = new control(this,{bound:[30,70,200,100]});
				this.mtsLogo0.addStyle({background:"#01a3a4", overflow:"hidden"});
				this.mtsLogo0.setShadow();
				this.mtsLogo0.setInnerHTML("<div  style='position:absolute;width:170;height:320px;top:20px;padding:10px;background:LAVENDER;border: 1em solid transparent;overflow:auto'>"
											+"<i class='fa fa-share ' style='margin-left:1px;font-size:48px;color:#1B1464' ></i>"+
											"</div>"+
											"<div style='position:absolute;height:20px;width:180;padding-left:10px;padding-right:10px;padding-top:10px;color:#ffffff;background:#1B1464;'><center><b>RECEIVED</b></center></div>");
				(this.mtsLogo0.canvas).css({cursor:"pointer"});
				this.mtsIsi0 = new label(this, {bound:[130,125,50,30], fontColor:"black" ,caption:"<b>...<b>", bold: true, fontSize:17, visible:true});
				(this.mtsIsi0.canvas).css({cursor:"pointer"});


				//my unit
					//send
					this.mtsLogo1 = new control(this,{bound:[30,320,200,100]});
					this.mtsLogo1.addStyle({background:"#01a3a4", overflow:"hidden"});
					this.mtsLogo1.setShadow();
					this.mtsLogo1.setInnerHTML("<div  style='position:absolute;width:170;height:320px;top:20px;padding:10px;background:LIGHTCYAN;border: 1em solid transparent;overflow:auto'>"
												+"<i class='fa fa-retweet' style='margin-left:1px;font-size:48px;color:#2980b9' ></i>"+
												"</div>"+
												"<div style='position:absolute;height:20px;width:180;padding-left:10px;padding-right:10px;padding-top:10px;color:#ffffff;background:#2980b9;'><center><b>OPEN</b></center></div>");
					(this.mtsLogo1.canvas).css({cursor:"pointer"});
					this.mtsIsi1 = new label(this, {bound:[130,375,50,30], fontColor:"black" ,caption:"<b>...<b>", bold: true, fontSize:17, visible:true});
					(this.mtsIsi1.canvas).css({cursor:"pointer"});

					//clear
					this.mtsLogo2 = new control(this,{bound:[240,320,200,100]});
					this.mtsLogo2.addStyle({background:"#01a3a4", overflow:"hidden"});
					this.mtsLogo2.setShadow();
					this.mtsLogo2.setInnerHTML("<div  style='position:absolute;width:170;height:320px;top:20px;padding:10px;background:CORNSILK;border: 1em solid transparent;overflow:auto'>"
												+"<i class='fa fa-check' style='margin-left:1px;font-size:48px;color:#FFC312' ></i>"+
												"</div>"+
												"<div style='position:absolute;height:20px;width:180;padding-left:10px;padding-right:10px;padding-top:10px;color:#ffffff;background:#FFC312;'><center><b>CLEAR</b></center></div>");
					(this.mtsLogo2.canvas).css({cursor:"pointer"});
					this.mtsIsi2 = new label(this, {bound:[340,375,50,30], fontColor:"black" ,caption:"<b>...<b>", bold: true, fontSize:17, visible:true});
					(this.mtsIsi2.canvas).css({cursor:"pointer"});

					//unclear 
					this.mtsLogo3 = new control(this,{bound:[450,320,200,100]});
					this.mtsLogo3.addStyle({background:"#01a3a4", overflow:"hidden"});
					this.mtsLogo3.setShadow();
					this.mtsLogo3.setInnerHTML("<div  style='position:absolute;width:170;height:320px;top:20px;padding:10px;background:PINK;border: 1em solid transparent;overflow:auto'>"
												+"<i class='fa fa-window-close' style='margin-left:1px;font-size:48px;color:#EA2027' ></i>"+
												"</div>"+
												"<div style='position:absolute;height:20px;width:180;padding-left:10px;padding-right:10px;padding-top:10px;color:#ffffff;background:#EA2027;'><center><b>UNCLEAR</b></center></div>");
					(this.mtsLogo3.canvas).css({cursor:"pointer"});
					this.mtsIsi3 = new label(this, {bound:[540,375,50,30], fontColor:"black" ,caption:"<b>...<b>", bold: true, fontSize:17, visible:true});
					(this.mtsIsi3.canvas).css({cursor:"pointer"});

					//close 
					this.mtsLogo4 = new control(this,{bound:[660,320,200,100]});
					this.mtsLogo4.addStyle({background:"#01a3a4", overflow:"hidden"});
					this.mtsLogo4.setShadow();
					this.mtsLogo4.setInnerHTML("<div  style='position:absolute;width:170;height:320px;top:20px;padding:10px;background:#dff9fb;border: 1em solid transparent;overflow:auto'>"
											+"<i class='fa fa-check-square-o' style='margin-left:1px;font-size:48px;color:#009432' ></i>"+
											"</div>"+
											"<div style='position:absolute;height:20px;width:180;padding-left:10px;padding-right:10px;padding-top:10px;color:#ffffff;background:#009432;'><center><b>CLOSE</b></center></div>");
					(this.mtsLogo4.canvas).css({cursor:"pointer"});
					this.mtsIsi4 = new label(this, {bound:[750,375,50,30], fontColor:"black" ,caption:"<b>...<b>", bold: true, fontSize:17, visible:true});
					(this.mtsIsi4.canvas).css({cursor:"pointer"});

					

		
		
		this.setTabChildIndex();
		try {
			this.refreshList();
			var self = this;

			if (self.myTimeExec){
				//clearInterval(self.myTimeExec);
			}
			// self.myTimeExec = setInterval( function(){
			// 	self.refreshList();
			// },900000);
			
			//fungsi masuk ke menu langsung dari notifikasi, pas di dbl click
				//to do
					self.mtsLogo0.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","TTER");
					});
					self.mtsIsi0.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","TTER");
					});
				//view
					self.mtsLogo1.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VOPEN");
					});
					self.mtsIsi1.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VOPEN");
					});

					self.mtsLogo2.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VCLEAR");
					});
					self.mtsIsi2.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VCLEAR");
					});

					self.mtsLogo3.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VUNCLEAR");
					});
					self.mtsIsi3.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VUNCLEAR");
					});

					self.mtsLogo4.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VCLOSE");
					});
					self.mtsIsi4.on("click", function(){	
						self.app._mainForm.runTCODE("MT01","VCLOSE");
					});


		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_modul_fInbox.extend(window.panel);
window.app_saku_modul_fInbox.implement({	
	setWidth: function(data){
		window.app_saku_modul_fInbox.prototype.parent.setWidth.call(this,data);
		if (this.lTitle){
			
			
		}
	},
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"RRA", method: report, params: param });
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	doAfterResize: function(w, h){
		
		
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
	
	refreshList: function(page){
		try{
			this.currentPage = page;
			var self = this;

		
			//to do
			self.app.services.callServices("financial_mantisUpload","getNotMts0",[self.app._lokasi], function(data){
				self.mtsIsi0.setCaption(data.draft.baris);									
			});

			//view
				//open
				self.app.services.callServices("financial_mantisUpload","getNotMts1",[self.app._lokasi], function(data){
					self.mtsIsi1.setCaption(data.draft.baris);									
				});

				//clear
				self.app.services.callServices("financial_mantisUpload","getNotMts2",[self.app._lokasi], function(data){
					self.mtsIsi2.setCaption(data.draft.baris);									
				});

				//unclear
				self.app.services.callServices("financial_mantisUpload","getNotMts3",[self.app._lokasi], function(data){
					self.mtsIsi3.setCaption(data.draft.baris);									
				});

				//close
				self.app.services.callServices("financial_mantisUpload","getNotMts4",[self.app._lokasi], function(data){
					self.mtsIsi4.setCaption(data.draft.baris);									
				});


		
		}catch(e){
			console.log(e);
		}
	},	
});




window.control_listItemControlInbox = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_listItemControlInbox.prototype.parent.constructor.call(this, owner, options);
	this.className = "listItemControlInbox";
	

	if (options !== undefined){
		this.updateByOptions(options);
		this.title = new label(this, {bound:[10,10, this.width - 20, 25], fontSize:12 });
		this.subtitle = new label(this, {bound:[10,30, this.width - 20, 60]});
		this.title.getCanvas().css({whiteSpace:"normal",textOverflow:"ellipsis"});
		this.ldate = new label(this, {bound:[this.width - 110,10, 100, 25], alignment: "right"});
		this.lNilai1 = new label(this, {bound:[10,50, 200, 25], fontSize:9});
		this.lNilai2 = new label(this, {bound:[210,50, 200, 25], fontSize:9});
		this.lStatus = new label(this, {bound:[this.width - 210,30, 200, 25], alignment: "right"});
		this.lPosisi = new label(this, {bound:[this.width - 210,50, 200, 25], alignment: "right"});
		if (options.caption) this.setCaption(options.caption[0], options.caption[1], options.caption[2], options.caption[3], options.caption[4], options.caption[5], options.caption[6] );
		if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);				
		if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);				
	}
	
};

window.control_listItemControlInbox.extend(window.control_containerControl);
window.listItemControlInbox = window.control_listItemControlInbox;
window.control_listItemControlInbox.implement({
	draw: function(canvas){
		window.control_listItemControlInbox.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		var self = this;
		nd.css({borderBottom:"1px solid #dedede", overflow:"hidden", background: this.color});
		nd.css({ position:"relative", overflow : "hidden", cursor:"pointer" });
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:hidden}' ></div>";	    
		this.setInnerHTML(html, nd);
		var self = this;
		nd.on("mouseover", function(e){
			nd.css({background:"#eeeeee"});
		});
		nd.on("mouseout", function(e){
			nd.css({background: self.color});
		});
		nd.on("click", function(e){
			//self.onSelect.call(self, self.title.getCaption());
			self.emit("click", self.title.getCaption(), self);
		});
	},
	setWidth: function(data){
		window.control_listItemControlInbox.prototype.parent.setWidth.call(this, data);
		if (this.ldate){
			this.ldate.setLeft(data - 110);
			this.lPosisi.setLeft(data - 210);
			this.lStatus.setLeft(data - 210);
			this.title.setWidth(data - 130);
		}
	},
	setColor: function(color){
		this.getCanvas().css({background: color});
		this.color = color;
	},
	setCaption: function(title, subtitle, date, nilai, nilai2, posisi, status){
		this.title.setCaption(title);
		this.subtitle.setCaption(subtitle);
		this.ldate.setCaption(date);
		this.lNilai1.setCaption(nilai);
		this.lNilai2.setCaption(nilai2);
		this.lPosisi.setCaption(posisi);
		this.lStatus.setCaption(status);
	},
	// setItemHeight: function(data){
	// 	this.itemHeight = data;
	// }

});
