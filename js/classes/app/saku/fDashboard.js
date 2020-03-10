window.app_saku_fDashboard = function(owner, menu)
{
	if (owner)
	{
		window.app_saku_fDashboard.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_fDashboard";
		this.itemsValue = new arrayList();		
		this.maximize();	
		uses("control_popupForm;pageControl;childPage;panel;frame;listCustomView;saiMemo;app_saku_DashboardItem;app_saku_DashboardGrad;checkBox");			
		this.setHeight( this.height - 96);
		this.setColor("#ffffff");
		var self=this;

		this.getClientCanvas().css({overflow:"auto"});

        this.cocd = new saiCBBL(this,{bound:[20, 20, 150, 20],labelWidth:100,caption:"Company",rightLabelVisible: false, labelWidth: 60});	
        this.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code", false);

		this.filter_fcbp = new saiCB(this,{bound:[190,20,150,20], labelWidth: 50,  caption:"FCBP", items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"],readOnly:true,change:[this,"doChange"]});		
		this.filter_fcbp.setItemHeight(6);

		this.filter_periode = new saiLabelEdit(this,{bound:[360,20,150,20], labelWidth: 50,  caption:"Periode"});		

		this.filter_icm = new saiLabelEdit(this,{bound:[530,20,150,20], labelWidth: 50,  caption:"ICM"});		
		

		this.search_fcbp = new button(this,{bound:[700,20,100,20],caption:"Search", icon:"<i class='fa fa-search' style='color:white'></i>", change:[this,"doChange"]});		
		this.search_fcbp.setColor("mediumseagreen");	
		var self=this;
		
		this.search_fcbp.on("click",(sender) =>{
			this.refreshList(0);
			if (this.pData.isVisible()){
				this.getDataDetail(this.status);
			}
		});
		if (this.app._periode){
			this.filter_periode.setText(this.app._periode);
		}else{
			this.filter_periode.setText("");
		}

		/*MANTIS*/
			//to do
// 					this.filter_periode.setText(this.app._periode);
				//my unit
					//send
					this.lTitle1 = new label(this, {bound:[20,60,400,20], caption:"Dokumen BA Rekon",  visible:true, bold: true, fontSize:18});
					this.carryFW = new app_saku_DashboardGrad(this, {bound:[30, 100, 200, 100], color:["#e66465", "#9198e5"], title:["CARRY FORWARD","<i class='fa fa-forward' style='margin-left:1px;font-size:64px;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
										
					this.mtsLogo1 = new app_saku_DashboardGrad(this,{bound:[30,220,200,100], color:["#2980b9","#9198e5"], title:["OPEN","<i class='fa fa-retweet' style='margin-left:1px;font-size:48px;color:#2980b9;padding-right:10px;;color:rgba(255,255,255,0.4)' ></i>"]});
				    this.mtsLogo2 = new app_saku_DashboardGrad(this,{bound:[240,220,200,100], color:["#9198e5","#ffa040"], title:["CLEAR","<i class='fa fa-chain' style='margin-left:1px;font-size:48px;color:#FFC312;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo3 = new app_saku_DashboardGrad(this,{bound:[450,220,200,100], color:["#EA2027","#9198e5"], title:["UNCLEAR","<i class='fa fa-chain-broken' style='margin-left:1px;font-size:48px;color:#EA2027;padding-right:10px;;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo4 = new app_saku_DashboardGrad(this,{bound:[660,220,200,100], color:["#009432","#9198e5"], title:["CLOSE","<i class='fa fa-check' style='margin-left:1px;font-size:48px;color:#009432;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo5 = new app_saku_DashboardGrad(this,{bound:[870,220,200,100], color:["#30CFD0", "#330867"], title:["TOTAL","<i class='fa fa-check-square-o' style='margin-left:1px;font-size:48px;color:#388E3C;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo6 = new app_saku_DashboardGrad(this,{bound:[1080,220,200,100], color:["#9b0000","#9198e5"], title:["TRASH","<i class='fa fa-trash-o' style='margin-left:1px;font-size:48px;color:#9b0000;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
                   
                //----
					this.lTitle2 = new label(this, {bound:[20,340,400,20], caption:"Approval BA Rekon",  visible:true, bold: true, fontSize:18});
                    this.mtsLogo11 = new app_saku_DashboardGrad(this,{bound:[30,380,200,100], color:["#2980b9","#9198e5"], title:["REVIEW PIC REKON","<i class='fa fa-list' style='margin-left:1px;font-size:48px;color:#2980b9;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
                    this.mtsLogo21 = new app_saku_DashboardGrad(this,{bound:[240,380,200,100], color:["#9198e5","#ffa040"], title:["REVIEW PIC GA","<i class='fa fa-eye' style='margin-left:1px;font-size:48px;color:#FFC312;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo31 = new app_saku_DashboardGrad(this,{bound:[450,380,200,100], color:["#EA2027","#9198e5"], title:["RETURN","<i class='fa fa-reply' style='margin-left:1px;font-size:48px;color:#EA2027;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo41 = new app_saku_DashboardGrad(this,{bound:[660,380,200,100], color:["#009432","#9198e5"], title:["DONE","<i class='fa fa-check' style='margin-left:1px;font-size:48px;color:#009432;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo51 = new app_saku_DashboardGrad(this,{bound:[870,380,200,100], color:["#30CFD0" , "#330867"], title:["GRAND TOTAL","<i class='fa fa-check-square-o' style='margin-left:1px;font-size:48px;color:#388E3C;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					

// 					this.carryFW.setValue("100");
                //-----

				//---
                    
                    this.arrow = new control(this, {bound:[150,250,40,40]});
                    this.arrow.getCanvas().css({boxShadow:"0px 1px 20px #888888",background:"white", transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
                    
                    this.pData = new panel(this, {bound:[30,270, this.width - 60, 600], caption:"", color:"#ffffff"});
					this.pData.getCanvas().css({boxShadow:"0px 20px 20px #888"});
                    this.export = new button(this.pData,{bound:[2,2,100,20],caption:"Export", icon:"<i class='fa fa-download' style='color:white'></i>"});		
					this.export.on("click",() =>{
						if (this.pEditJurnal && this.pEditJurnal.isVisible()){
							this.pEditJurnal.hide();
							this.pSumBA.show();
							
						}else if (this.export.caption == "Back"){
							this.export.setCaption("Export");
							this.export.setIcon("<i class='fa fa-download' style='color:white'></i>");
							this.browser.hide();
							this.browser2.hide();
							this.bprint.hide();
							this.pCatatan.hide();
							this.pSumBA.hide();
							this.bViewBA.hide();
							this.bViewSumBA.hide();
							this.bViewBADetail.hide();
							this.pData.setHeight(600);
							this.browser.setHeight(this.pData.height - 25);
							this.browser2.setHeight(this.pData.height - 25);
							this.pCatatan.setTop(this.pData.height - 60);
						}else{
							this.app.services.callServices("financial_mantisDashboard","downloadDashboard",[this.cocd.getText(), this.filter_fcbp.getText(), this.filter_periode.getText(), this.filter_icm.getText(), this.status], (data) =>{
								window.open("./server/reportDownloader.php?f="+data+"&n=INFO-"+ this.status +".xlsx");
							});
						}
						
					});
					this.bViewBA = new button(this.pData,{bound:[110,2,100,20],caption:"View BA", icon:"<i class='fa fa-file-text-o' style='color:white'></i>"});		
					this.bViewBA.on("click", () => {
						this.browser.show();
						this.browser2.hide();
						this.pSumBA.hide();
						// this.pData.setWidth(this.width - 40);
						if (this.frame1Height >= this.pData.height){
							this.pData.setHeight(this.frame1Height + 70);
						}
						if ((this.status == "clear" ||this.status == "unclear" ||this.status == "cf" )){
							this.pCatatan.show();
							this.bSubmit.hide();
							this.eMemo.show();
							this.bReturn.hide();

						}else {
							this.pCatatan.show();
							this.bSubmit.hide();
							this.bReturn.hide();
							if (this.app._roleid == "6" || this.app._roleid == "5" ){
								this.bSubmit.show();
								this.eMemo.show();	
								this.bReturn.show();

							}
							if (this.app._roleid == "4" ){
								this.eMemo.show();	
								this.bReturn.show();

							}
							this.bReturn.setCaption("Return");
							if (this.status == "done"){
								this.bSubmit.hide();
								this.eMemo.hide();
								this.bReturn.hide();
								if (this.app._roleid == "6" || this.app._roleid == "7" ){
									this.eMemo.show();
									this.bReturn.show();
									this.bReturn.setCaption("Set Open");
								}
						   }
						   
						}

					});
					this.bViewSumBA = new button(this.pData,{bound:[220,2,100,20],caption:"Summary BA", icon:"<i class='fa fa-eye' style='color:white'></i>"});		
					this.bViewSumBA.on("click", () => {
						this.browser.hide();
						this.browser2.hide();
						this.pSumBA.show();
						this.pData.setHeight(625);
						// this.pData.setWidth(this.sgData.width + 4);
						this.pCatatan.hide();
					});
					this.bViewBADetail = new button(this.pData,{bound:[330,2,100,20],caption:"BA Detail", icon:"<i class='fa fa-eye' style='color:white'></i>"});		
					this.bViewBADetail.on("click", () => {
						this.browser.hide();
						this.browser2.show();
						this.pSumBA.hide();
						if (this.frame2Height >= 625){
							this.pData.setHeight(this.frame2Height + 70);
						}

						this.pCatatan.hide();
					});
					this.bViewBA.hide();
					this.bViewSumBA.hide();
					this.bViewBADetail.hide();
                    this.bClose = new control(this.pData,{bound:[40,0,30,30]});		
                    this.bClose.getCanvas().css({cursor:"pointer"});
                    this.bClose.getCanvas().html("<i class='fa fa-times-circle-o fa-2x' style='color:#AE1B1A' />");
                    this.bClose.on("click",() => {
                        this.pData.hide();
						this.arrow.hide();
						this.browser.hide();
						this.browser2.hide();
						this.bprint.hide();
						this.pCatatan.hide();
						this.pSumBA.hide();
						this.bViewBA.hide();
						this.bViewSumBA.hide();
						this.bViewBADetail.hide();
						this.pData.setHeight(600);
						this.browser.setHeight(this.pData.height - 25);
						this.browser2.setHeight(this.pData.height - 25);
						this.pCatatan.setTop(this.pData.height - 60);
                    });
                    this.sgData = new saiGrid(this.pData, {bound:[1,25, this.pData.width - 5, this.pData.height - 50], colCount:5, rowPerPage:20, autoPaging:true});
                    var colTitle = [
									{ title:"ICM", width:120, freeze:true,fontColor:"#ffffff"},
									{ title:"BA Rekon", width:80,fontColor:"#ffffff"},
                                    {title : "CoCd", width: 360,  fontColor:"#ffffff", column: [
                                        { title:"CoCD", width:60,fontColor:"#ffffff"},
                                        { title:"FCBP", width:60,fontColor:"#ffffff"},
                                        { title:"Doc Amount", width:120,fontColor:"#ffffff"},
                                        { title:"Loc Amount", width:120,fontColor:"#ffffff"}
                                        ]},
                                    {title : "TP", width: 360, color:"#ffa040",fontColor:"#ffffff", column: [
                                            { title:"TP", width:60,fontColor:"#ffffff"},
                                            { title:"FCBP", width:60,fontColor:"#ffffff"},
                                            { title:"Doc Amount", width:120,fontColor:"#ffffff"},
                                            { title:"Loc Amount", width:120,fontColor:"#ffffff"}
										] },
									{title : "Saldo Akhir", color:"#ffa040",fontColor:"#ffffff", width: 240, column: [
										{ title:"Doc Amount", width:120,fontColor:"#ffffff"},
										{ title:"Loc Amount", width:120,fontColor:"#ffffff"} 
									]}

								];
								
                    this.sgData.setHeaderHeight(60);
                    this.sgData.setColTitle(colTitle);
					this.sgData.setColFormat([4,5,8,9,10,11],[cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai]);
					this.sgData.setHeaderColor([0,1,2,3,4],["#0077c2","#0077c2","#0077c2","#0077c2","#0077c2"]);
					// this.sgData.setWidth(200 + 480 + 480 + 300);
					// this.pData.setWidth( this.sgData.width + 4);
                    this.arrow.hide();
					this.pData.hide();
					
					//View BA
					this.sgData.on("dblClick", (col, row) =>{

						if (this.sgData.cells(0, row))
						{
							this.browser.show();
							this.bprint.show();
							if (this.status == "close"){
								this.bSetClose.setCaption("Set ICM Open");
							}else {
								this.bSetClose.setCaption("Set ICM Close");
							}
							if (this.status == "trash"){
								this.bSetTrash.setCaption("Recovered ICM");
							}else {
								this.bSetTrash.setCaption("Move To Trash");
							}
							
							this.bSetClose.show();
							this.bSetTrash.show();
// 							if (!(this.status == "open" || this.status == "received" || this.status == "clear" ||this.status == "unclear" || this.status == "return")){
								
// 								this.bSetClose.hide();
// 							}
							// this.pData.setHeight(2000);
							// this.browser.setHeight(2000);
							
							// if ((this.status == "open" || this.status == "received" || this.status == "clear" ||this.status == "unclear" )){
							// 	this.pCatatan.hide();
							// }else 
							this.pCatatan.show();
							if ((this.status == "done" && this.app._userLog == "SM_CONSOL")){
								
								this.bReturn.setCaption("Set Open");
							}else {
								this.bReturn.setCaption("Return");
								
							}
							
							this.export.setCaption("Back");
							this.export.setIcon("<i class='fa fa-chevron-left' style='color:white'></i>");
							
							this.bViewBA.show();
							this.bViewSumBA.show();
							this.bViewBADetail.show();
								
							this.icm = this.sgData.cells(0, row);
							this.ba_rekon = this.sgData.cells(1, row);
							//console.log(this.icm +":"+this.ba_rekon);
							this.getReport("getViewBA",[this.sgData.cells(0, row), this.sgData.cells(1, row)], this.browser.frame);
							this.showReportSummmaryBA();
							this.pSumBA.hide();
							this.browser2.show();
							this.getReportBADetail("getViewBA",[this.sgData.cells(0, row), this.sgData.cells(1, row)], this.browser2.frame);
							
							// var body = document.body,
							// 	html = document.documentElement;

							// var height = Math.max( body.scrollHeight, body.offsetHeight, 
							// 					html.clientHeight, html.scrollHeight, html.offsetHeight );
							this.bViewBA.click();
						}
						
					});
					this.browser = new control(this.pData, {bound:[0,25, this.pData.width-2, this.pData.height-25 ]});	
					var frame = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
					var self = this;
					this.browser.getCanvas().append(frame);
					frame.load(
						function() {
							self.frame1Height = this.contentWindow.document.body.offsetHeight;
							if (self.frame1Height > 600){
								self.pData.setHeight(self.frame1Height + 70);
								self.browser.setHeight(self.frame1Height + 30);
								self.pCatatan.setTop(self.frame1Height);
								// self.browser2.setHeight(self.frame1Height);
							}
							
							
						}
					);
					this.browser.frame = frame;
					
					this.browser2 = new control(this.pData, {bound:[0,25, this.pData.width-2, this.pData.height-25 ]});	
					var frame2 = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
					var seld = this;
					this.browser2.getCanvas().append(frame2);
					frame2.load(
						function() {
							self.frame2Height = this.contentWindow.document.body.offsetHeight;
							if (self.frame2Height > 600){
								self.browser2.setHeight(self.frame2Height + 30);
							}else if (self.frame2Height > self.frame1Height){
								self.browser2.setHeight(self.frame2Height + 30);
							}else self.browser2.setHeight(self.frame1Height + 30);
						});
					this.browser2.frame = frame2;
					

					this.bprint = new button(this.pData, { bound: [this.pData.width - 145, 2, 95, 20],  icon:"<i class='fa fa-print' style='color:white'></i>", caption: "Print"});
					this.bprint.on("click", () => {
						this.browser.frame.get(0).contentWindow.print();;
						
					});
					this.browser.hide();
					this.browser2.hide();
					this.bprint.hide();
					
					this.pCatatan = new panel(this.pData, {bound:[0,this.pData.height - 60, this.pData.width, 60], color:"white", visible:false});
					this.eMemo = new saiMemo(this.pCatatan,{bound:[20, 5,600,50], caption:"Catatan"});
					var caption = "Approved";
					if (this.app._roleid == "6"){
						caption = "Done";
					}
					
					this.bSubmit = new button(this.pCatatan, {bound:[640, 5,100, 30], caption:caption, icon:"<i class='fa fa-send' style='color:white'/>"});
					this.bSubmit.on("click", () => {
						
						if (this.app._roleid == "6" ) {
							if (this.status == "done"){
								this.refreshList();
								system.alert(this,"Gagal Submit","Status sudah Done.");
								return;
							}
							this.app.services.callServices("financial_mantisFlowApproval", "setDone", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
								if (data == "process completed"){
									system.info(this,"Done ", data);
									this.refreshList();
									this.getDataDetail(this.status);
									this.export.click();
								}else system.alert(this,data);
								
							});
						}else if (this.app._roleid == "5"){
							{
								this.app.services.callServices("financial_mantisFlowApproval", "submitToGA", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
									if (data == "process completed"){
										system.info(this,"Submit to PIC ", data);
										this.refreshList();
										this.getDataDetail(this.status);
										this.export.click();
									}else system.alert(this,data);
								});	
							}
							
							
						}else system.alert(this,"Tidak ada otorisasi untuk Approve","Cek kembali Otorisasi anda.");
					});
					if (this.app._roleid == "4"){
						this.bSubmit.hide();
					}
					this.bReturn = new button(this.pCatatan, {bound:[750, 5,100, 30], caption:"Return", icon:"<i class='fa fa-send' style='color:white'/>"});
					this.bReturn.on("click", () => {
						if (this.status == "done"){
							if (this.app._roleid == "7"){
								this.confirm("Return ICM","Anda yakin akan meng-Return ICM " + this.icm +" (status sudah <b>Done</b>) ke pelaku Rekon?<br><br><span style='font-size:10px'><i>Pelaku Rekon harus men-submit kembali ICM yang di-return.</i></span>", () =>{
									this.app.services.callServices("financial_mantisFlowApproval", "setUnDone", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else system.alert(this,data);
									});
								});
							}else {
								system.alert(this,"Tidak ada otorisasi untuk Return yang Done","Cek kembali Otorisasi anda.");
							}
						}else {
							this.confirm("Return ICM","Anda yakin akan meng-Return ICM " + this.icm +" ke pelaku Rekon?<br><br><span style='font-size:10px'><i>Pelaku Rekon harus men-submit kembali ICM yang di-return.</i></span>", () =>{
								if (this.app._roleid == "6")
									this.app.services.callServices("financial_mantisFlowApproval", "returnICM", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else system.alert(this,data);

									});
								else if (this.app._roleid == "4" || this.app._roleid == "5")
									this.app.services.callServices("financial_mantisFlowApproval", "returnICM", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else {
											system.alert(this,data);
										}

									});
								else system.alert(this,"Tidak ada otorisasi untuk Approve","Cek kembali Otorisasi anda.");
							});	
						}
						
					});

					this.bSetClose = new button(this.pCatatan, {bound:[860, 5,100, 30],visible: false, caption:"Set ICM Close", icon:"<i class='fa fa-check' style='color:white'/>"});
					this.bSetClose.on("click", () => {
						if (this.status == "close"){
							this.confirm("Open ICM","Anda yakin akan mengubah ICM " + this.icm +" jadi Open kembali?<br><br><span style='font-size:10px'><i>ICM yang diopen akan kembali ke pelaku Rekon .</i></span>", () =>{
								if (this.app._roleid == "6" || this.app._roleid == "7")
									this.app.services.callServices("financial_mantisFlowApproval", "setUnClose", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else {
											system.alert(this,data);
										}

									});
								else system.alert(this,"Tidak ada otorisasi untuk Approve","Cek kembali Otorisasi anda.");
							});
							
						}else {
							this.confirm("Close ICM","Anda yakin akan meng-Close ICM " + this.icm +"?<br><br><span style='font-size:10px'><i>ICM yang diclose tidak bisa di pakai lagi.</i></span>", () =>{
								if (this.app._roleid == "6")
									this.app.services.callServices("financial_mantisFlowApproval", "setClose", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else system.alert(this,data);

									});
								else if (this.app._roleid == "4" || this.app._roleid == "5")
									this.app.services.callServices("financial_mantisFlowApproval", "setClose", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else {
											system.alert(this,data);
										}

									});
								else system.alert(this,"Tidak ada otorisasi untuk Approve","Cek kembali Otorisasi anda.");
							});
	
						}
						
						
					});

					this.bSetTrash = new button(this.pCatatan, {bound:[970, 5,100, 30],visible: false, caption:"Delete ICM", icon:"<i class='fa fa-trash' style='color:white'/>"});
					this.bSetTrash.on("click", () => {
						if (this.status == "trash"){
							this.confirm("Recovered ICM","Anda yakin akan mengubah ICM " + this.icm +" jadi Open kembali?<br><br><span style='font-size:10px'><i>ICM yang diopen akan kembali ke pelaku Rekon .</i></span>", () =>{
								if (this.app._roleid == "6" || this.app._roleid == "7")
									this.app.services.callServices("financial_mantisFlowApproval", "setRecovered", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else {
											system.alert(this,data);
										}

									});
								else system.alert(this,"Tidak ada otorisasi untuk Approve","Cek kembali Otorisasi anda.");
							});
							
						}else {
							this.confirm("Delete ICM","Anda yakin akan menghapus ICM " + this.icm +"?<br><br><span style='font-size:10px'><i>ICM yang di delete tidak bisa di pakai lagi.</i></span>", () =>{
								if (this.app._roleid == "6"  || this.app._roleid == "7")
									this.app.services.callServices("financial_mantisFlowApproval", "setTrash", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else system.alert(this,data);

									});
								else if (this.app._roleid == "6"  || this.app._roleid == "7")
									this.app.services.callServices("financial_mantisFlowApproval", "setRecovered", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
										if (data == "process completed"){
											system.info(this,"Done", data);
											this.refreshList();
											this.getDataDetail(this.status);
										}else {
											system.alert(this,data);
										}

									});
								else system.alert(this,"Tidak ada otorisasi untuk Approve","Cek kembali Otorisasi anda.");
							});
	
						}
						
						
					});
					
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
					
					
				self.mtsLogo1.on("click", ()=>{	
					this.arrow.setTop(this.mtsLogo4.top + 110);
					this.pData.setTop(this.mtsLogo4.top + 120);
					this.arrow.setLeft(self.mtsLogo1.left + 80);
					// this.arrow.getCanvas().css({background:"LIGHTCYAN"});
					this.getDataDetail("open");
				});
				
				self.mtsLogo2.on("click", ()=>{	
					this.arrow.setTop(this.mtsLogo4.top + 110);
					this.pData.setTop(this.mtsLogo4.top + 120);
					this.arrow.setLeft(self.mtsLogo2.left + 80);
					// this.arrow.getCanvas().css({background:"CORNSILK"});
					this.getDataDetail("clear");
				});
				
				
				self.mtsLogo3.on("click", ()=>{	
					this.arrow.setTop(this.mtsLogo4.top + 110);
					this.pData.setTop(this.mtsLogo4.top + 120);
					this.arrow.setLeft(self.mtsLogo3.left + 80);
					// this.arrow.getCanvas().css({background:"PINK"});
					this.getDataDetail("unclear");
				});
				
				self.mtsLogo4.on("click", () =>{
					this.arrow.setTop(this.mtsLogo4.top + 130);
					this.pData.setTop(this.mtsLogo4.top + 120 + 20);	
					// this.arrow.getCanvas().css({background:"#dff9fb"});
					this.arrow.setLeft(self.mtsLogo4.left + 80);
					this.getDataDetail("close");
				});
				self.mtsLogo6.on("click", () =>{
					this.arrow.setTop(this.mtsLogo6.top + 130);
					this.pData.setTop(this.mtsLogo6.top + 120 + 20);	
					// this.arrow.getCanvas().css({background:"#dff9fb"});
					this.arrow.setLeft(self.mtsLogo6.left + 80);
					this.getDataDetail("trash");
				});
				
			// Approval
				self.mtsLogo11.on("click", ()=>{	
					this.arrow.setTop(this.mtsLogo11.top + 110);
					this.pData.setTop(this.mtsLogo11.top + 120);
					this.arrow.setLeft(self.mtsLogo11.left + 80);
					// this.arrow.getCanvas().css({background:"LIGHTCYAN"});
					this.getDataDetail("review_pic");
				});
				
				self.mtsLogo21.on("click", ()=>{	
					this.arrow.setTop(this.mtsLogo11.top + 110);
					this.pData.setTop(this.mtsLogo11.top + 120);
					this.arrow.setLeft(self.mtsLogo21.left + 80);
					// this.arrow.getCanvas().css({background:"CORNSILK"});
					this.getDataDetail("review_ga");
				});
				

				self.mtsLogo31.on("click", ()=>{	
					this.arrow.setTop(this.mtsLogo41.top + 110);
					this.pData.setTop(this.mtsLogo41.top + 120);
					this.arrow.setLeft(self.mtsLogo31.left + 80);
					// this.arrow.getCanvas().css({background:"PINK"});
					this.getDataDetail("return");
				});
				
				self.mtsLogo41.on("click", () =>{
					this.arrow.setTop(this.mtsLogo41.top + 110);
					this.pData.setTop(this.mtsLogo41.top + 120);	
					// this.arrow.getCanvas().css({background:"#dff9fb"});
					this.arrow.setLeft(self.mtsLogo41.left + 80);
					this.getDataDetail("done");
				});
				

				self.carryFW.on("click", () =>{
					this.arrow.setTop(this.carryFW.top + 110);
					this.pData.setTop(this.carryFW.top + 120);	
					// this.arrow.getCanvas().css({background:"#dff9fb"});
					this.arrow.setLeft(self.carryFW.left + 80);
					this.getDataDetail("cf");
				});

		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_fDashboard.extend(window.panel);
window.app_saku_fDashboard.implement({	
	confirm : function(title, msg, callback ){
		if (this.confirmDialog){
			this.confirmDialog.free();
		}
		this.confirmDialog = new popupForm(this.app);
		this.confirmDialog.setBound(0, 0,400, 200);
		this.confirmDialog.setArrowMode(0);
		this.confirmDialog.getCanvas().css({ overflow : "hidden", background:"#fffff", borderRadius:"10px", boxShadow:"0px 10px 20px #888888" });
		this.confirmDialog.getClientCanvas().css({ overflow : "hidden"});
		this.confirmDialog.setTop( this.height / 2 - 100);
		this.confirmDialog.setLeft( this.width / 2 - 200);


			this.lTitle = new label(this.confirmDialog, {bound:[0,20,400,30], caption: title, alignment:"center", fontSize:18, bold :true});
			this.lMessage = new label(this.confirmDialog, {bound:[20, 60, 360, 100], caption: msg, fontSize:12});
			this.bCancel = new control(this.confirmDialog,{bound:[-1,160,201,40]});
			this.bCancel.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
									.html("<span style='font-size:12px;font-weight:bold'>CANCEL</span>")
									.on("mouseover",() =>{
										this.bCancel.getCanvas().find("span").css({fontSize:"14px"});
									})
									.on("mouseleave",() =>{
										this.bCancel.getCanvas().find("span").css({fontSize:"12px"});
									});
			this.bCancel.on("click", () => {
				this.confirmDialog.hide();
			});
			this.bOk = new control(this.confirmDialog,{bound:[200,160,200,40]});
			this.bOk.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
								.html("<span style='font-size:12px;font-weight:bold'>OK</span>")
								.on("mouseover",() =>{
									this.bOk.getCanvas().find("span").css({fontSize:"14px"});
								})
								.on("mouseleave",() =>{
									this.bOk.getCanvas().find("span").css({fontSize:"12px"});
								});;

		
		this.lTitle.setCaption(title);
		this.lMessage.setCaption(msg);
		this.bOk.removeAllListeners("click");
		this.bOk.on("click", () =>{
			this.confirmDialog.hide();
			if (callback)
				callback();
		});
		
		this.confirmDialog.show();
	},
	getReport: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisRepTW", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
		
	},
	getReportBADetail: function( report, param, iframe){
		var self = this;
		var data = JSON.stringify({service:"mantisDetBA", method: report, params: param } );
		iframe.attr("src", "server/reportServices.php?params=" + data);
	},
	setWidth: function(data){
		window.app_saku_fDashboard.prototype.parent.setWidth.call(this,data);
		if (this.pData){
            this.pData.setWidth(data - 60);
			this.sgData.setWidth(this.pData.width - 5);
			this.bClose.setLeft(this.pData.width - 40);
			this.pCatatan.setWidth(this.pData.width - 2);
			this.bprint.setLeft(this.pData.width - 145);
			// this.bSetClose.setLeft(this.bprint.left - 110);
			// this.bSetTrash.setLeft(this.bSetClose.left - 110);
			if (this.pSumBA){
				this.pSumBA.setWidth(this.pData.width - 2);
				this.summaryBA.setWidth(this.pSumBA.width-2);
				this.browser.setWidth(this.pData.width - 2);
				this.browser2.setWidth(this.pData.width - 2);
			}
			if (this.pEditJurnal){
                this.pEditJurnal.setWidth(data - 60);
                this.pEditJurnal.sgEdit.setWidth(this.pEditJurnal.width - 42);
                this.pEditJurnal.totDebet.setLeft(this.pEditJurnal.width - 250);
                this.pEditJurnal.totKredit.setLeft(this.pEditJurnal.width - 250);
			}
			this.rearrangeBox();
		}
	},
	rearrangeBox: function(){
		let listBox = [this.mtsLogo1, this.mtsLogo2, this.mtsLogo3, this.mtsLogo4, this.mtsLogo5, this.mtsLogo6];
		let listBox2 = [this.mtsLogo11, this.mtsLogo21, this.mtsLogo31, this.mtsLogo41, this.mtsLogo51];

		var row = this.mtsLogo2.top;
		var width = this.width - 40;
		var jmlRow = 1;
		var boxTotalWidth = 30;
		var jumlahCol = Math.round( width / (this.mtsLogo1.width + 10) ) ;
		$.each(listBox, (k, box) =>{
			if (boxTotalWidth  + box.width + 10 < width){
				box.setLeft(boxTotalWidth);
				boxTotalWidth += box.width + 10;
				box.setTop(row);
			}else {
				jmlRow++;
				boxTotalWidth = 30;
				row += box.height + 20;
				box.setLeft(boxTotalWidth);
				boxTotalWidth += box.width + 10;
				box.setTop(row);
			}
		});
		var boxTotalWidth = 30;
		this.lTitle2.setTop(row + this.mtsLogo1.height + 20);
		row = this.lTitle2.top + 50;
		$.each(listBox2, (k, box) =>{
			if (boxTotalWidth  + box.width + 10 < width){
				box.setLeft(boxTotalWidth);
				boxTotalWidth += box.width + 10;
				box.setTop(row);
			}else {
				boxTotalWidth = 30;
				row += box.height + 20;
				box.setLeft(boxTotalWidth);
				boxTotalWidth += box.width + 10;
				box.setTop(row);
			}
		});

	},	
    setHeight: function(data){
		window.app_saku_fDashboard.prototype.parent.setHeight.call(this,data);
		if (this.pData){
            //this.pData.setHeight(data - this.pData.top - 20);
            //this.sgData.setHeight( this.pData.height - 50);
			
		}
	},
	getDataDetail: function(status){
        this.arrow.show();
		this.pData.show();
		this.status = status;
		if (this.pSumBA)
			this.pSumBA.hide();
		this.browser.hide();
		this.bprint.hide();
		this.bViewBA.hide();
		this.browser2.hide();
		this.bViewSumBA.hide();
		this.bViewBADetail.hide();
		this.pCatatan.hide();
		this.bSetClose.hide();
		this.bSetTrash.hide();

		showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");
        this.app.services.callServices("financial_mantisDashboard","getDetailDashboard",[this.cocd.getText(), this.filter_fcbp.getText(), this.filter_periode.getText(), this.filter_icm.getText(), status], (data) =>{
			   this.sgData.clear();
			   if (this.status == "done"){
					this.bSubmit.hide();
					this.eMemo.hide();
					this.bReturn.hide();
					if (this.app._roleid == "5" || this.app._roleid == "4"){
						this.eMemo.show();
						this.bReturn.show();
					}
			   }
               $.each(data, (k,v) =>{
                   this.sgData.addRowValues([v.icm, v.ba_rekon,v.cocd, v.fcbp, (v.doc_amount), (v.loc_amount), v.tp, v.fcbp2, (v.doc_amount2), (v.loc_amount2), v.doc_sakhir, v.loc_sakhir]);
			   });
			   hideLoading();
			   this.getClientCanvas().scrollTop(this.pData.top);
        });
    },
	doAfterResize: function(w, h){
		
		
	},
	
	showReportSummmaryBA: function(){
		if (this.pSumBA === undefined){
			this.pSumBA = new panel(this.pData, {bound:[0,25, this.pData.width - 2, this.pData.height - 30], caption:"", color:"#ffffff"});
			this.summaryBA = new saiGrid(this.pSumBA,{bound:[0,25,this.pSumBA.width-2,this.pSumBA.height-30],
				colCount: 26, headerHeight: 65, pasteEnable: false,
				colTitle: [
					{
						title : "ICM",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
						freeze: true
					},
					{
						title : "Year",
						width : 0,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Month",
						width : 0,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Curr",
						width : 0,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Kode Jasa",
						width : 70,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Jenis Jasa",
						width : 0,//200,
						columnAlign: "bottom", 
						hint  : "",
						visible: false,
					},
					{
						title : "CC",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "BA CC",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "TP",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "BA TP",
						width : 40,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Orig Acct",
						width : 80,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Desc Of Orig Acct",
						width : 0,//200,
						columnAlign: "bottom", 
						hint  : "",
						visible: false,
					},
					{
						title : "Acct COA",
						width : 80,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Desc of Acct COA",
						width : 0, //200,
						columnAlign: "bottom", 
						hint  : "",
						visible: false,
					},
					
					{
						title : "Saldo Awal Pra Rekon",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100, //150
								format : cfNilai,
								columnAlign: "bottom", 
								visible: false,
								hint  : "Saldo Awal Doc Amount", 
								column : [{
									title :"1",
									width : 100, //150
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Awal Loc Amount", 
								column : [{
									title : "2",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Mutasi Pra Rekon",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,//150
								format : cfNilai,
								visible: false,
								columnAlign: "bottom", 
								hint  : "Mutasi Doc Amount", 
								column : [{
									title :"3",
									width : 100,//150
									format : cfNilai
								}]
							},
							{
								title : "Lc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Mutasi Loc Amount", 
								column : [{
									title : "4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Saldo Awal Rekon",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,
								visible: false,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Doc Amount", 
								column : [{
									title :"5 = 1 + 3",
									width : 100,
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Loc Amount", 
								column : [{
									title : "6 = 2 + 4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Adjustment",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,
								format : cfNilai,
								visible: false,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Doc Amount", 
								column : [{
									title :"5 = 1 + 3",
									width : 100,
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Loc Amount", 
								column : [{
									title : "6 = 2 + 4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Saldo Akhir",
						width : 200,
						hint  : "",
						column : [
							{
								title : "Doc Amount",
								width : 100,
								format : cfNilai,
								visible: false,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Doc Amount", 
								column : [{
									title :"5 = 1 + 3",
									width : 100,
									format : cfNilai
								}]
							},
							{
								title : "Loc Amount",
								width : 100,
								format : cfNilai,
								columnAlign: "bottom", 
								hint  : "Saldo Akhir Loc Amount", 
								column : [{
									title : "6 = 2 + 4",
									width : 100,
									format : cfNilai
								}]
							}
						]
					},
					{
						title : "Jenis Rekon",
						width : 150,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Balance",
						width : 150,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "status",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "BA Rekon",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
					},
                    {
						title : "View Jurnal Mutasi",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
                    },
                    {
						title : "View Jurnal Adjustment",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
                    },
                    {
						title : "Update BA Rekon",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
                    }
				],
				colFormat:[[14, 15, 16, 17, 18,19, 20,21, 22,23,25],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
				autoPaging: true, rowPerPage: 50, readOnly:true
			});
			// this.summaryBA.on("mouseover", (col, row, node) => {
            //     if (col == 16 || col == 17){
            //         node.css({cursor:"pointer"});
            //         window.system.showHint(node.offset().left, node.offset().top + 20, "Silakan double klik untuk lihat detail jurnal",true);
            //     }
            // });
            this.summaryBA.on("mouseleave", (col, row ,node) => {
                
			});

			this.summaryBA.on("downloadBtnClick", () => {
				// this.showLoading("Please wait...");
				console.log("masuk sini...");
				this.app.services.callServices("financial_mantisRepTW", "exportEliminasi", [this.tmpFilter], (filename) => {
					// this.hideLoading();
					window.open("./server/reportDownloader.php?f="+filename+"&n=SummaryBA.xlsx");
				}, (err) => {
					// this.hideLoading();
				});
			});
            this.summaryBA.on("dblClick", (col, row, value) => {
                if (col != this.summaryBA) {
                    if (col == 28){
                        this.selected_akun = this.summaryBA.cells(10, row);
                        this.currency = this.summaryBA.cells(4,row);
                        this.selected_cc = this.summaryBA.cells(6, row);
                        this.selected_tp = this.summaryBA.cells(8, row);
						this.showPanelShowJurnal(0);
						this.pSumBA.hide();
                    }else if (col == 29){
                        this.selected_akun = this.summaryBA.cells(10, row);
						this.showPanelShowJurnal(1);
						this.pSumBA.hide();

                    }else if (col == 30){
						//$icm, $periode, $cocd, $akun, $ba_rekon, $jenis_akun
						this.selected_akun = this.summaryBA.cells(10, row);
						this.currency = this.summaryBA.cells(4,row);
                        this.selected_cc = this.summaryBA.cells(6, row);
                        this.selected_tp = this.summaryBA.cells(8, row);
                        this.showPopupEditBA("Update ICM " + this.icm, () => {
                            this.confirm("Ganti BA Rekon","Yakin akan mengganti BA Rekon ke BA-"+this.confirmEditBARekon.cbBA.getText()+"?", () => {
                               
                                    //updateKlpBARekon($icm, $periode, $cocd, $akun, $ba_rekon, $jenis_akun)
                                    this.app.services.callServices("financial_mantisRepTW", "updateKlpBARekon", [this.icm, 
                                            this.filter_periode.getText(),
                                            this.selected_cc,
                                            this.selected_akun,
                                            this.confirmEditBARekon.cbBA.getText(),
                                            this.confirmEditBARekon.cbJenis.getText() ], (data) => {
                                                if (data == "process completed"){
                                                    system.info(this, "Data berhasil tersimpan","Silakan di cek kembali");
                                                }else{
                                                    system.alert(this, "Data gagal tersimpan",data);
                                                }
                                            });
                            });
                           
                        });
                    }
                    
                }
                
			});
			//sthis.summaryBA.setWidth(this.summaryBA.cnvHeader.width() + 40);
		}  
		this.pSumBA.show();
		//this.pSumBA.setWidth(this.summaryBA.width + 4);
		this.getSummaryBA("", this.icm, "", "", "", "", "", this.ba_rekon);
		
	},
	getSummaryBA: function(cocd = null, icm = null, akun = null, perio = null, tp = null, status = null, jasa = null, ba_rekon = null){
		console.log("call getSummaryBA");
		
		this.tmpFilter = {
			cocd : cocd,
			icm : icm, 
			akun : akun,
			perio :  {perio_awal : this.filter_periode.getText(), perio_akhir : this.filter_periode.getText()},
			tp : tp,
			status : status,
			jasa : jasa,
			ba_rekon : ba_rekon.substr(4,5),
			status_ba : ""
		};
		this.summaryBA.clear();
		this.app.services.callServices("financial_mantisRepTW", "getListEliminasi", [this.tmpFilter], (data) => {
			
			
			for(var key in data){
				let line = data[key];
				
				this.summaryBA.addRowValues([
					line.icm, line.year, line.month, line.currency,line.kode_jasa, line.jenis_jasa,
					line.cc, line.bacc, 
					line.tp, line.batp, line.kode_akun,
					line.description, line.gl_acct, line.short_text,
					Math.round(line.doc_sawal,0),  Math.round(line.loc_sawal,0),
					Math.round(line.doc_amount,0), Math.round(line.loc_amount,0), 
					Math.round(line.doc_sakhir,0), Math.round(line.loc_sakhir,0), 
					Math.round(line.doc_amount_adj,0), Math.round(line.loc_amount_adj,0), 
					Math.round(line.doc_sakhir_adj,0), Math.round(line.loc_sakhir_adj,0), 
					line.jenis_rekon,
					Math.round(line.balance,0),line.status, line.ba_rekon, "<font style='color:blue'>View Jurnal</font>","<font style='color:blue'>View Adj</font>","<font style='color:blue'>Edit BA</font>"
				]);
				
			}
			

			
		}, (err) => {
			
		});
	},
	showPanelShowJurnal: function(adj){
		var self = this;
		this.is_adj = adj;
		this.isLoadedAkun = true;
        if (this.pEditJurnal === undefined){
            this.pEditJurnal = new panel(this.pData, {bound:[0,25, this.pData.width - 2, this.pData.height - 30], caption:"", color:"#ffffff"});
            
			this.cbAll = new checkBox(this.pEditJurnal, {bound:[20,2,150,20], caption:"View All Item Jurnal"});
			this.eListHeader = new saiCB(this.pEditJurnal,{bound:[170,2,200,20],caption:"No Jurnal", readOnly:true,change:[this,"doChange"]});
			this.bReloadJurnal = new button(this.pEditJurnal, {bound:[380, 2, 100,20], caption:"Apply"});
			this.bReloadJurnal.on("click", () => {
				showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");//$icm, $periode, $akun, $isAdj = null
				console.log("ICM " +this.icm +":"+ this.filter_periode.getText()+":"+ this.eListHeader.getText()+":"+ this.is_adj);
				if (this.cbAll.isChecked()) {
					this.app.services.callServices("financial_mantisDashboard","viewMemoJurnalAll",[this.icm, this.filter_periode.getText(), this.eListHeader.getText(), this.is_adj], data => {
						this.pEditJurnal.sgEdit.clear();
						var totdr = 0;
						var totcr = 0;
						this.isLoadedAkun = false;
						$.each(data, (k,v) => {
							this.pEditJurnal.sgEdit.addRowValues([v.idheader, v.post_key, v.rekon_akun, v.nama, v.ba, v.keterangan, v.doc_amount, v.loc_amount, v.tp, v.created_by]);
							if(v.post_key == "40"){
								totdr += nilaiToFloat(v.loc_amount);
							}else {
								totcr += nilaiToFloat(v.loc_amount);
							}
							if (this.selected_akun == v.rekon_akun){

							}
						});

						this.pEditJurnal.totDebet.setText(floatToNilai(nilaiToFloat(totdr)));
						this.pEditJurnal.totKredit.setText(floatToNilai(nilaiToFloat(totcr)));
						hideLoading();
					});	
				}else{
					showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");//$icm, $periode, $akun, $isAdj = null
					this.app.services.callServices("financial_mantisDashboard","viewMemoJurnal",[this.icm, this.filter_periode.getText(), this.selected_akun, this.is_adj], data => {
						this.pEditJurnal.sgEdit.clear();
						var totdr = 0;
						var totcr = 0;
						var listHeader = new arrayMap();
						$.each(data, (k,v) => {
							this.pEditJurnal.sgEdit.addRowValues([v.idheader, v.post_key, v.rekon_akun, v.nama, v.ba, v.keterangan, v.doc_amount, v.loc_amount, v.tp, v.created_by]);
							if(v.post_key == "40"){
								totdr += nilaiToFloat(v.loc_amount);
							}else {
								totcr += nilaiToFloat(v.loc_amount);
							}
							if (this.selected_akun == v.rekon_akun){

							}
							listHeader.set(k, v.idheader);
						});
						this.eListHeader.clearItem();
						this.eListHeader.setItem(listHeader);

						this.pEditJurnal.totDebet.setText(floatToNilai(nilaiToFloat(totdr)));
						this.pEditJurnal.totKredit.setText(floatToNilai(nilaiToFloat(totcr)));
						hideLoading();
					});
				}
				
			});
            this.pEditJurnal.sgEdit = new saiGrid(this.pEditJurnal,{bound:[20,25,this.pEditJurnal.width-42,this.pEditJurnal.height-100],
                colCount: 10,
                colTitle: ["No Jurnal","Post Key","GL Acc","Nama Akun","BA Telkom","Keterangan","Doc Amount","Loc Amount","TP","User Entry"],
                colWidth:[[0,1,2,3,4,5,6,7,8,9],[80,70,80,230,100,230,100,100,90,90]],
                columnReadOnly:[true, [],[0,1,2,3,4,5,6,7,8]],		
                buttonStyle:[[1,2,4,8,9],[bsAuto,bsEllips,bsEllips,bsEllips,bsEllips]], 
                colFormat:[[6,7],[cfNilai,cfNilai]],		
                picklist:[[1],[new arrayMap({items:["40 - Debet","50 - Credit"]})]],
                rowPerPage:20, 
                autoPaging:true, 
                pager:[this,"doPager1"]
            });

            this.pEditJurnal.sgEdit.on("entrySearch", function(col, row, value, fn){
                //if (value.length > 2) 
                {
                    if (self.myTimeExecSearch){
                        clearTimeout(self.myTimeExecSearch);
                    }
                    self.myTimeExecSearch = setTimeout( function(){
                        if (col == 2) {
                            self.app.services.callServices("financial_mantis","getListGL",[value, self.selected_cc], function(data){
                                fn(data);
                            });
                        }
                        else if (col == 4) {
                            self.app.services.callServices("financial_mantis","getListBA",[value, self.selected_cc, self.self.selected_tp], function(data){
                                fn(data);
                            });
                        }
                        // else if (col == 8) {
                        //     self.app.services.callServices("financial_mantis","getListCC",[value, self.pEditJurnal.sgEdit.cells(4, row)], function(data){
                        //         fn(data);
                        //     });
                        // }
                        // else if (col == 9) {
                        //     self.app.services.callServices("financial_mantis","getListProfitCenter",[value, self.pEditJurnal.sgEdit.cells(4, row)], function(data){
                        //         fn(data);
                        //     });
                        // }
                    }, 500);
                }
            });

            this.pEditJurnal.sgEdit.on("change", function(col, row, data){
                if ( col == 2 ){
                    console.log("masuk 1");
                    var gl = self.pEditJurnal.sgEdit.cells(2, row);
                    if ( gl == "")
                        return;
                    var isValidGL = new Promise((resolve, reject)=>{
                        self.app.services.callServices("financial_mantisAdj","isValidGL",[self.app._lokasi, gl], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidGL.then((validGL)=>{
                        console.log(validGL);
                        if(self.pEditJurnal.sgEdit.cells(2,row) != ""){
                            if(validGL){
                                
                            }else{
                                self.pEditJurnal.sgEdit.setCell(1, row, "");
                                system.alert(self, "Cust/Vend/GL Acc Tidak DItemukan!", "");
                            }
                        }
                    });
                }

            
                if ( col == 4 ){
                    console.log("masuk 3");
                    var isValidBA = new Promise((resolve, reject)=>{
                        var ba = self.pEditJurnal.sgEdit.cells(4, row);
                        console.log("process validasi", ba);
                        self.app.services.callServices("financial_mantis","isValidBA",[self.app._lokasi, ba], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidBA.then((validBA)=>{
                        console.log(validBA);
                        if(self.pEditJurnal.sgEdit.cells(4,row) != ""){
                            if(validBA){
                                
                            }else{
                                self.pEditJurnal.sgEdit.setCell(3, row, "");
                                system.alert(self, "Business Area Tidak Ditemukan!", "");
                            }
                        }
                    });
                }

                if ( col == 8 ){
                    console.log("masuk 7");
                    var isValidCC = new Promise((resolve, reject)=>{
                        var cc = self.pEditJurnal.sgEdit.cells(8, row);
                        console.log("process validasi", cc);
                        self.app.services.callServices("financial_mantis","isValidCC",[self.app._lokasi, cc], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidCC.then((validCC)=>{
                        console.log(validCC);
                        if(self.pEditJurnal.sgEdit.cells(8,row) != ""){
                            if(validCC){
                                
                            }else{
                                self.pEditJurnal.sgEdit.setCell(8, row, "");
                                system.alert(self, "Cost Center Tidak DItemukan!", "");
                            }
                        }
                    });
                }

                if ( col == 9 ){
                    console.log("masuk 8");
                    var isValidPC = new Promise((resolve, reject)=>{
                        var pc = self.pEditJurnal.sgEdit.cells(9, row);
                        console.log("process validasi", pc);
                        self.app.services.callServices("financial_mantis","isValidProfit",[self.app._lokasi, pc], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidPC.then((validPC)=>{
                        console.log(validPC);
                        if(self.pEditJurnal.sgEdit.cells(9,row) != ""){
                            if(validPC){
                                
                            }else{
                                self.sgEdit.setCell(9, row, "");
                                system.alert(self, "Profit Center Tidak Ditemukan!", "");
                            }
                        }
                    });
                }
                
            
            });

            this.pEditJurnal.sgEdit.on("selectRow", function(col, row, value, data){
                if (col == 2){
                    self.pEditJurnal.sgEdit.setCell(col, row, value);
                    self.pEditJurnal.sgEdit.setCell(col + 1, row, data[1]);
                }else if (col == 4){
                    self.pEditJurnal.sgEdit.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
				}
				// else if (col == 8){
                //     self.pEditJurnal.sgEdit.setCell(col, row, value);
                //     // self.sg2.setCell(col + 1, row, data[1]);
                // }else if (col == 9){
                //     self.pEditJurnal.sgEdit.setCell(col, row, value);
                //     // self.sg2.setCell(col + 1, row, data[1]);
                // }

            });

            this.pEditJurnal.bSave = new button(this.pEditJurnal,{bound:[20,this.pEditJurnal.height-60,80, 30],icon:"<i class='fa fa-save' style='color:white;font-size:14px'></i>", caption:"Save"});
            this.pEditJurnal.bSave.setColor("#27ae60");

            this.pEditJurnal.bSave.on("click",() => {
                try{
                    this.confirm("Simpan","Apa anda yakin untuk menyimpan data perubahan?<br> Data yang disimpan adalah sesuai baris yang di pilih", () => {
						var data = {
								doc : this.pEditJurnal.sgEdit.cells(6, this.pEditJurnal.sgEdit.row),
								loc : this.pEditJurnal.sgEdit.cells(7, this.pEditJurnal.sgEdit.row),
								ba : this.pEditJurnal.sgEdit.cells(4, this.pEditJurnal.sgEdit.row),
								post_key : this.pEditJurnal.sgEdit.cells(1, this.pEditJurnal.sgEdit.row)
							};
						var akun = this.pEditJurnal.sgEdit.cells(2, this.pEditJurnal.sgEdit.row);
						var idheader = this.pEditJurnal.sgEdit.cells(0, this.pEditJurnal.sgEdit.row);
						this.app.callServices("financial_mantisDashboard","updateJurnal",[this.icm, akun, idheader, data,"" ], (result) => {
							if (result == "process completed"){
								system.info(this, result);
							}else 
								system.alert(this, result);
						});
					});
                }catch(e){
                    alert(e);
                }
            });
            this.pEditJurnal.bDelete = new button(this.pEditJurnal,{bound:[120,this.pEditJurnal.height-60,80, 30],icon:"<i class='fa fa-trash' style='color:white;font-size:14px'></i>", caption:"Delete"});
            this.pEditJurnal.bDelete.setColor("#b71c1c");

            this.pEditJurnal.bDelete.on("click",() => {
                try{
                    this.confirm("Delete Jurnal","Apa anda yakin untuk menghapus?<br> Data yang dihapus adalah sesuai baris yang di pilih", () => {
						var akun = this.pEditJurnal.sgEdit.cells(2, this.pEditJurnal.sgEdit.row);
						var idheader = this.pEditJurnal.sgEdit.cells(0, this.pEditJurnal.sgEdit.row);
						this.app.callServices("financial_mantisDashboard","deleteJurnal",[this.icm, akun, idheader,"" ], (result) => {
							if (result == "process completed"){
								system.info(this, result);
							}else 
								system.alert(this, result);
						});
					});
                }catch(e){
                    alert(e);
                }
            });

            this.pEditJurnal.bDeleteAll = new button(this.pEditJurnal,{bound:[220,this.pEditJurnal.height-60,120, 30],icon:"<i class='fa fa-trash' style='color:white;font-size:14px'></i>", caption:"Delete Jurnals"});
            this.pEditJurnal.bDeleteAll.setColor("#7f0000");

            this.pEditJurnal.bDeleteAll.on("click",() => {
                try{
                    this.confirm("Delete Jurnal","Apa anda yakin untuk menghapus semua jurnal untuk Akun terkait?<br> Data yang dihapus adalah sesuai baris yang di pilih", () => {
						var akun = this.pEditJurnal.sgEdit.cells(2, this.pEditJurnal.sgEdit.row);
						var idheader = [];
						for (var i = 0; i < this.pEditJurnal.sgEdit.getRowCount();i++){
							idheader.push(this.pEditJurnal.sgEdit.cells(0, i));	
						}
						this.app.callServices("financial_mantisDashboard","deleteJurnal",[this.icm, akun, idheader,"" ], (result) => {
							if (result == "process completed"){
								system.info(this, result);
							}else 
								system.alert(this, result);
						});
					});
                }catch(e){
                    alert(e);
                }
            });


            this.pEditJurnal.totDebet = new saiLabelEdit(this.pEditJurnal,{bound:[this.pEditJurnal.width - 250,this.pEditJurnal.height-50,240,20],caption:"Total Debit",readOnly:true,tipeText:ttNilai});
            this.pEditJurnal.totKredit = new saiLabelEdit(this.pEditJurnal,{bound:[this.pEditJurnal.width - 250,this.pEditJurnal.height-25,240,20],caption:"Total Kredit",readOnly:true,tipeText:ttNilai});
            

            this.pEditJurnal.sgEdit.on("change", function (col, row, id){
                var totdr = 0;
                var totcr = 0;
                for (var i = 0 ; i < self.pEditJurnal.sgEdit.getRowCount();i++){
                    if(self.pEditJurnal.sgEdit.cells(0, i) == "40 - Debet"){
                        totdr += nilaiToFloat(self.pEditJurnal.sgEdit.cells(6, i));
                    }
                    if(self.pEditJurnal.sgEdit.cells(0, i) == "50 - Credit"){
                        totcr += nilaiToFloat(self.pEditJurnal.sgEdit.cells(6, i));
                    }
                }
                self.pEditJurnal.totDebet.setText(floatToNilai(nilaiToFloat(totdr)));
                self.pEditJurnal.totKredit.setText(floatToNilai(nilaiToFloat(totcr)));
            });


            
            this.pEditJurnal.sgEdit.on("keyup", function(col, row, value){
                if(self.currency  == "IDR"){
                    // for (var i = 0 ; i < self.sg2.getRowCount();i++){
                        if (col == 5){
                            // alert("halo");
                            // console.log(row+":"+col+""+value);
                            // console.log(self.sg2.cells(5,row));
                            
                            self.pEditJurnal.sgEdit.cells(6,row,value);				
                        }
                    // }
                }
            });
			
            this.pEditJurnal.sgEdit.clear(1);
        }
       
		showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");//$icm, $periode, $akun, $isAdj = null
		
        this.app.services.callServices("financial_mantisDashboard","viewMemoJurnal",[this.icm, this.filter_periode.getText(), this.selected_akun, adj], data => {
            this.pEditJurnal.sgEdit.clear();
            var totdr = 0;
			var totcr = 0;
			var listHeader = new arrayMap();
            $.each(data, (k,v) => {
                this.pEditJurnal.sgEdit.addRowValues([v.idheader, v.post_key, v.rekon_akun, v.nama, v.ba, v.keterangan, v.doc_amount, v.loc_amount, v.tp, v.created_by]);
                if(v.post_key == "40"){
                    totdr += nilaiToFloat(v.loc_amount);
                }else {
                    totcr += nilaiToFloat(v.loc_amount);
				}
				listHeader.set(k, v.idheader);
            });
            this.eListHeader.clearItem();
			this.eListHeader.setItem(listHeader);
            this.pEditJurnal.totDebet.setText(floatToNilai(nilaiToFloat(totdr)));
            this.pEditJurnal.totKredit.setText(floatToNilai(nilaiToFloat(totcr)));
            hideLoading();
        });
        this.bprint.hide();
        this.pEditJurnal.show();
    },
	refreshList: function(page){
		try{
			showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");
			this.currentPage = page;
			var self = this;
			//view
				//open
				if (this.pSumBA)
                    this.pSumBA.hide();
				this.browser.hide();
				this.browser2.hide();
                this.bprint.hide();
				this.bViewBA.hide();
				this.bViewBADetail.hide();
                this.bViewSumBA.hide();
                this.pCatatan.hide();
                
				self.app.services.callServices("financial_mantisDashboard","getDashboard",[this.cocd.getText(), this.filter_fcbp.getText(), this.filter_periode.getText(), this.filter_icm.getText()], function(data){
					var total1 = parseFloat(data.total_open) + parseFloat(data.total_clear) + parseFloat(data.total_unclear);
					var total2 = parseFloat(data.total_open) + parseFloat(data.total_clear) + parseFloat(data.total_unclear) + parseFloat(data.total_submitted) + parseFloat(data.total_review) +parseFloat(data.total_return) + parseFloat(data.total_done) 

                    self.mtsLogo1.setValue(data.total_open, Math.round(data.total_open / total1 * 100) +"%"  ) ;		
                    self.mtsLogo2.setValue(data.total_clear, Math.round(data.total_clear / total1 * 100)+"%" );	
                    self.mtsLogo3.setValue(data.total_unclear, Math.round(data.total_unclear / total1 * 100)+"%"  );	
					self.mtsLogo4.setValue(data.total_close );	
					self.mtsLogo6.setValue(data.total_trash );	
					
					// self.mtsIsi1_1.setCaption(Math.round(data.total_open / total1 * 100) +"%" ) ;		
                    // self.mtsIsi2_1.setCaption();	
                    // self.mtsIsi3_1.setCaption();	
					// self.mtsIsi4_1.setCaption(0 );	

					self.mtsLogo5.setValue(total1 );	
																				
					self.mtsLogo11.setValue(data.total_submitted, Math.round(data.total_submitted / total2 * 100)+"%"  );		
                    self.mtsLogo21.setValue(data.total_review, Math.round(data.total_review / total2 * 100)+"%");	
                    self.mtsLogo31.setValue(data.total_return, Math.round(data.total_return / total2 * 100)+"%");	
					self.mtsLogo41.setValue(data.total_done, Math.round(data.total_done / total2 * 100)+"%");	
					// self.mtsIsi111.setCaption();		
                    // self.mtsIsi211.setCaption();	
                    // self.mtsIsi311.setCaption();	
					// self.mtsIsi411.setCaption();	
					self.mtsLogo51.setValue(total2);	
					self.carryFW.setValue(data.total_cf);	
					hideLoading();
																				
				});
		}catch(e){
			console.log(e);
		}
	},	
    showPopupEditBA: function(title, callback){
        if (this.confirmEditBARekon){
			this.confirmEditBARekon.free();
		}
		this.confirmEditBARekon = new popupForm(this.app);
		this.confirmEditBARekon.setBound(0, 0,400, 200);
		this.confirmEditBARekon.setArrowMode(0);
		this.confirmEditBARekon.getCanvas().css({ overflow : "hidden", background:"#fffff", borderRadius:"5px", boxShadow:"0px 10px 20px #888888" });
		this.confirmEditBARekon.getClientCanvas().css({ overflow : "hidden"});
		this.confirmEditBARekon.setTop( this.height / 2 - 100);
		this.confirmEditBARekon.setLeft( this.width / 2 - 200);


			this.confirmEditBARekon.lTitle = new label(this.confirmEditBARekon, {bound:[0,20,400,30], caption: title, alignment:"center", fontSize:18, bold :true});
            // this.confirmEditBARekon.lMessage = new label(this.confirmEditBARekon, {bound:[20, 60, 360, 100], caption: , fontSize:12});
            this.confirmEditBARekon.cbBA = new saiCB(this.confirmEditBARekon,{bound:[20,80,200,20], caption:"Ganti ke BA ", items:["1","2","3","4","12"]});
            this.confirmEditBARekon.cbJenis = new saiCB(this.confirmEditBARekon,{bound:[20,110,200,20], caption:"Jenis Akun", items:["AR","AP","REV","EXP","BDD","PDD","ASET","UM","OTHER"]});
			this.confirmEditBARekon.bCancel = new control(this.confirmEditBARekon,{bound:[-1,160,201,40]});
			this.confirmEditBARekon.bCancel.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
									.html("<span style='font-size:12px;font-weight:bold'>CANCEL</span>")
									.on("mouseover",() =>{
										this.confirmEditBARekon.bCancel.getCanvas().find("span").css({fontSize:"14px"});
									})
									.on("mouseleave",() =>{
										this.confirmEditBARekon.bCancel.getCanvas().find("span").css({fontSize:"12px"});
									});
			this.confirmEditBARekon.bCancel.on("click", () => {
				this.confirmEditBARekon.hide();
			});
			this.confirmEditBARekon.bOk = new control(this.confirmEditBARekon,{bound:[200,160,200,40]});
			this.confirmEditBARekon.bOk.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
								.html("<span style='font-size:12px;font-weight:bold'>OK</span>")
								.on("mouseover",() =>{
									this.confirmEditBARekon.bOk.getCanvas().find("span").css({fontSize:"14px"});
								})
								.on("mouseleave",() =>{
									this.confirmEditBARekon.bOk.getCanvas().find("span").css({fontSize:"12px"});
								});;

		
		this.confirmEditBARekon.lTitle.setCaption(title);
		// this.confirmEditBARekon.lMessage.setCaption(msg);
		this.confirmEditBARekon.bOk.removeAllListeners("click");
		this.confirmEditBARekon.bOk.on("click", () =>{
			this.confirmEditBARekon.hide();
			if (callback)
				callback();
		});
		
        this.confirmEditBARekon.show();
        
    }
});


