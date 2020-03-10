window.app_saku_fDashboardUser = function(owner, menu)
{
	if (owner)
	{
		window.app_saku_fDashboardUser.prototype.parent.constructor.call(this,owner);
		this.className  = "app_saku_fDashboardUser";
		this.itemsValue = new arrayList();		
		this.maximize();	
		uses("control_popupForm;pageControl;childPage;checkBox;panel;frame;listCustomView;saiMemo;app_saku_DashboardItem;app_saku_DashboardGrad");			
		this.setHeight( this.height - 96);
		this.setColor("#ffffff");
		var self=this;

		this.getClientCanvas().css({overflow:"auto"});


		self.isi_filter = "XAPP";
        this.lTitle001 = new label(this, {bound:[20,20,400,20], caption:"TO DO",  visible:true, bold: true, fontSize:18});

        this.lTitle1 = new label(this, {bound:[20,200,400,20], caption:"Dokumen BA Rekon",  visible:true, bold: true, fontSize:18});
        
        this.lTitle2 = new label(this, {bound:[20,360,400,20], caption:"Approval BA Rekon",  visible:true, bold: true, fontSize:18});
        
        this.filter_periode = new saiLabelEdit(this,{bound:[360,20,150,20], labelWidth: 50,  caption:"Periode"});		
        this.filter_icm = new saiLabelEdit(this,{bound:[530,20,150,20], labelWidth: 50,  caption:"ICM"});		
		this.search_fcbp = new button(this,{bound:[700,15,100,30],caption:"Apply", icon:"<i class='fa fa-refresh' style='color:white;font-size:16px'></i>", change:[this,"doChange"]});		
        this.search_fcbp.setColor("mediumseagreen");	
        
        this.bUploadBatch = new button(this,{bound:[810,15,120,30],caption:"Upload Batch", icon:"<i class='fa fa-pencil' style='color:white;font-size:16px'></i>", change:[this,"doChange"]});		
        this.bUploadBatch.setColor("#1e88e5");	
        this.bUploadBatch.on("click", () => {
            this.app._mainForm.runTCODE("MT07");
        });
        this.bNewICM = new button(this,{bound:[940,15,120,30],caption:"Input ICM", icon:"<i class='fa fa-pencil' style='color:white;font-size:16px'></i>", change:[this,"doChange"]});		
        this.bNewICM.setColor("#1e88e5");	
        this.bNewICM.on("click", () => {
            this.app._mainForm.runTCODE("MT01");
        });
        this.bUploadBatch2= new button(this,{bound:[810,50,120,30],caption:"Upload Adjust", icon:"<i class='fa fa-edit' style='color:white;font-size:16px'></i>", change:[this,"doChange"]});		
        this.bUploadBatch2.setColor("#F44336");	
        this.bUploadBatch2.on("click", () => {
            this.app._mainForm.runTCODE("ADJ01");
        });
        this.bNewAdj = new button(this,{bound:[940,50,120,30],caption:"Input Adjust", icon:"<i class='fa fa-edit' style='color:white;font-size:16px'></i>", change:[this,"doChange"]});		
        this.bNewAdj.setColor("#F44336");
        this.bNewAdj.on("click", () => {
            this.app._mainForm.runTCODE("ADJ02");
        });
		var self=this;
		
		this.search_fcbp.on("click",(sender) =>{
			this.refreshList(0);
		});
		/*MANTIS*/
            //to do
                    
					this.mtsLogo0 = new app_saku_DashboardGrad(this, {bound:[30, 70, 200, 100], color:["#e66465", "#9198e5"], title:["RECEIVED","<i class='fa fa-angle-double-down' style='margin-left:1px;font-size:64px;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
										
					this.mtsLogo1 = new app_saku_DashboardGrad(this,{bound:[30,240,200,100], color:["#2980b9","#9198e5"], title:["OPEN","<i class='fa fa-retweet' style='margin-left:1px;font-size:48px;color:#2980b9;padding-right:10px;;color:rgba(255,255,255,0.4)' ></i>"]});
				    this.mtsLogo2 = new app_saku_DashboardGrad(this,{bound:[240,240,200,100], color:["#9198e5","#ffa040"], title:["CLEAR","<i class='fa fa-chain' style='margin-left:1px;font-size:48px;color:#FFC312;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo3 = new app_saku_DashboardGrad(this,{bound:[450,240,200,100], color:["#EA2027","#9198e5"], title:["UNCLEAR","<i class='fa fa-chain-broken' style='margin-left:1px;font-size:48px;color:#EA2027;padding-right:10px;;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo4 = new app_saku_DashboardGrad(this,{bound:[660,240,200,100], color:["#009432","#9198e5"], title:["CLOSE","<i class='fa fa-check' style='margin-left:1px;font-size:48px;color:#009432;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo5 = new app_saku_DashboardGrad(this,{bound:[870,240,200,100], color:["#30CFD0", "#330867"], title:["TOTAL","<i class='fa fa-check-square-o' style='margin-left:1px;font-size:48px;color:#388E3C;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo6 = new app_saku_DashboardGrad(this,{bound:[1080,240,200,100], color:["#9b0000","#9198e5"], title:["TRASH","<i class='fa fa-trash-o' style='margin-left:1px;font-size:48px;color:#9b0000;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
                   
                //-----
                    this.mtsLogo11 = new app_saku_DashboardGrad(this,{bound:[30,400,200,100], color:["#2980b9","#9198e5"], title:["REVIEW PIC REKON","<i class='fa fa-list' style='margin-left:1px;font-size:48px;color:#2980b9;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
                    this.mtsLogo21 = new app_saku_DashboardGrad(this,{bound:[240,400,200,100], color:["#9198e5","#ffa040"], title:["REVIEW PIC GA","<i class='fa fa-eye' style='margin-left:1px;font-size:48px;color:#FFC312;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo31 = new app_saku_DashboardGrad(this,{bound:[450,400,200,100], color:["#EA2027","#9198e5"], title:["RETURN","<i class='fa fa-reply' style='margin-left:1px;font-size:48px;color:#EA2027;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo41 = new app_saku_DashboardGrad(this,{bound:[660,400,200,100], color:["#009432","#9198e5"], title:["DONE","<i class='fa fa-check' style='margin-left:1px;font-size:48px;color:#009432;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					this.mtsLogo51 = new app_saku_DashboardGrad(this,{bound:[870,400,200,100], color:["#30CFD0" , "#330867"], title:["GRAND TOTAL","<i class='fa fa-check-square-o' style='margin-left:1px;font-size:48px;color:#388E3C;padding-right:10px;color:rgba(255,255,255,0.4)' ></i>"]});
					 
                    this.arrow = new control(this, {bound:[150,230,40,40]});
                    this.arrow.getCanvas().css({boxShadow:"0px 1px 20px #888888",background:"white", transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
                    
                    this.pData = new panel(this, {bound:[30,250, this.width - 60, 600], caption:"", color:"#ffffff"});
					this.pData.getCanvas().css({boxShadow:"0px 20px 20px #888"});
                    this.export = new button(this.pData,{bound:[2,2,100,20],caption:"Export", icon:"<i class='fa fa-search' style='color:white'></i>"});		
					this.export.on("click",() =>{
						if (this.export.caption == "Back"){
                            if (this.pInput && this.pInput.isVisible()){
                                this.pInput.hide();
                                this.bReceived.show();
                                this.summaryBA.hide();
                                this.bViewBA.show();
                                this.bViewSumBA.show();
                                this.bViewBADetail.show();
                            }else if (this.pEditJurnal && this.pEditJurnal.isVisible()){
                                this.pEditJurnal.hide();
                                this.summaryBA.show();
                            }else {
                                this.export.setCaption("Export");
                                this.export.setIcon("<i class='fa fa-download' style='color:white'></i>");
                                this.browser.hide();
                                this.browser2.hide();
                                this.bprint.hide();
                                this.pCatatan.hide();
                                this.bReceived.show();
                                this.summaryBA.hide();
                                this.bViewBA.hide();
                                this.bViewSumBA.hide();
                                this.bViewBADetail.hide();
                                this.pData.setHeight(600);
                                this.browser.setHeight(this.pData.height - 25);
                                this.browser2.setHeight(this.pData.height - 25);
                                this.pCatatan.setTop(this.pData.height - 60);
                            }
							
						}else{
							this.app.services.callServices("financial_mantisDashboard","downloadDashboardUser",[this.status], (data) =>{
								window.open("./server/reportDownloader.php?f="+data+"&n=INFO-"+ this.status +".xlsx");
							});
						}
                    });
                    this.bViewBA = new button(this.pData,{bound:[110,2,100,20],caption:"View BA", icon:"<i class='fa fa-file-text-o' style='color:white'></i>"});		
					this.bViewBA.on("click", () => {
						this.browser.show();
                        
                        this.browser2.hide();
                        if (this.frame1Height > 600) 
                            this.pData.setHeight(this.frame1Height + 70);
                        if (this.status == "clear" || this.status == "unclear" || this.status == 'return' || this.status == 'open' ){
                            this.pCatatan.show();
                        }else this.pCatatan.hide();
                        if (this.summaryBA)
                            this.summaryBA.hide();
					});
					this.bViewSumBA = new button(this.pData,{bound:[220,2,100,20],caption:"Summary BA", icon:"<i class='fa fa-eye' style='color:white'></i>"});		
					this.bViewSumBA.on("click", () => {
                        this.browser.hide();
                        this.browser2.hide();
                        
                        this.pData.setHeight(600);
                        this.pCatatan.hide();
                        this.showReportSummmaryBA();
                    });
                    this.bViewBADetail = new button(this.pData,{bound:[330,2,100,20],caption:"BA Detail", icon:"<i class='fa fa-eye' style='color:white'></i>"});		
					this.bViewBADetail.on("click", () => {
						this.browser.hide();
                        this.browser2.show();
                        if (this.summaryBA)
                            this.summaryBA.hide();
                        if (this.frame2Height > 600)
                            this.pData.setHeight(this.frame2Height + 70);
                        this.pCatatan.hide();
                        this.sgData.hide();
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
                        this.pCatatan.hide();
                        this.browser.hide();
						this.browser2.hide();
						this.bprint.hide();
                        this.pCatatan.hide();
                        if (this.summaryBA)
						    this.summaryBA.hide();
						this.bViewBA.hide();
						this.bViewSumBA.hide();
						this.bViewBADetail.hide();
						this.pData.setHeight(600);
						this.browser.setHeight(this.pData.height - 25);
						this.browser2.setHeight(this.pData.height - 25);
						this.pCatatan.setTop(this.pData.height - 60);
                    });
                    this.sgData = new saiGrid(this.pData, {bound:[1,25, this.pData.width - 5, this.pData.height - 50], colCount:3, rowPerPage:20, autoPaging:true});
                    var colTitle = [
                                    {title : "CoCd", width: 540, column: [
                                        { title:"ICM", width:100},
                                        { title:"BA Rekon", width:80},
                                        { title:"CoCD", width:60},
                                        { title:"FCBP", width:60},
                                        { title:"Doc Amount", width:120},
                                        { title:"Loc Amount", width:120}
                                        ]},
                                    {title : "TP", width: 460, column: [
                                            { title:"ICM", width:100},
                                            { title:"TP", width:60},
                                            { title:"FCBP", width:60},
                                            { title:"Doc Amount", width:120},
                                            { title:"Loc Amount", width:120}
                                        ] },
                                    {title : "Saldo Akhir", width: 240, column: [
                                        { title:"Doc Amount", width:120},
                                        { title:"Loc Amount", width:120} 
                                    ]}

                                ];
                    this.sgData.setHeaderHeight(60);
                    this.sgData.setColTitle(colTitle);
                    this.sgData.setColFormat([4,5,10,9,11,12],[cfNilai, cfNilai, cfNilai, cfNilai, cfNilai, cfNilai]);
                    this.arrow.hide();
                    this.pData.hide();
                    
					this.sgData.on("dblClick", (col, row) =>{

						if (this.sgData.cells(0, row)){
							this.browser.show();
                            this.bprint.show();
                            this.bViewBA.show();
                            this.bViewSumBA.show();
                            this.bViewBADetail.show();
                            this.pCatatan.hide();
                            this.bReceived.hide();
                            if (this.status == "clear" || this.status == "unclear" || this.status == 'return' || this.status == 'open' ){
                                this.pCatatan.show();
                            }
                            if (this.status == "received"){
                                this.bReceived.show();
                            }
                            if (this.pEditJurnal){
                                this.pEditJurnal.hide();
                            }
							this.export.setCaption("Back");
							this.export.setIcon("<i class='fa fa-chevron-left' style='color:white'></i>");
                            
                            this.icm = this.sgData.cells(0, row);
                            this.ba_rekon = this.sgData.cells(1, row);
                            this.cocd_tp = this.sgData.cells(2, row);
                            this.fcbp_tp =  this.sgData.cells(3, row);

                            this.selisih = this.sgData.cells(12, row);
                            
                            
                            this.getReport("getViewBA",[this.sgData.cells(0, row), this.sgData.cells(1, row)], this.browser.frame);
                            this.showReportSummmaryBA();
                            if (this.summaryBA)
                                this.summaryBA.hide();
                            this.browser2.show();
							this.getReportBADetail("getViewBA",[this.sgData.cells(0, row), this.sgData.cells(1, row)], this.browser2.frame);
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
                                // self.browser2.setHeight(self.frame2Height);    
                            }
							
						}
					);
					this.browser.frame = frame;
					
					this.browser2 = new control(this.pData, {bound:[0,25, this.pData.width-2, this.pData.height-25 ]});	
					var frame2 = $("<iframe frameBorder=0 style='width:100%;height:100%;border:0;top : 0px. left:0px;'/>");
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
                    
                    this.bReceived = new button(this.pData, { bound: [this.pData.width - 245, 2, 95, 20],  icon:"<i class='fa fa-check' style='color:white'></i>", caption: "Received"});
                    this.bReceived.hide();
                    this.bReceived.on("click", () => {
                        //show Form Reveic
                        this.bReceived.hide();
                        this.bViewBA.hide();
                        this.bViewSumBA.hide();
                        this.showPanelInput();
                    });

                    this.pCatatan = new panel(this.pData, {bound:[0,this.pData.height - 60, this.pData.width - 2, 60], color:"white", visible:false});
					this.eMemo = new saiMemo(this.pCatatan,{bound:[20, 5,800,50], caption:"Catatan"});
					var caption = "Submit";
					
					this.bSubmit = new button(this.pCatatan, {bound:[840, 5,100, 30], caption:caption, icon:"<i class='fa fa-send' style='color:white'/>"});
					this.bSubmit.on("click", () => {
                        this.confirm("Submit BA Rekon ","Apa data sudah benar?", ()=>{
                            if (this.selisih != 0){
                                this.showEditCatatan("Ada Selisih BA Rekon",() => {
                                    this.app.services.callServices("financial_mantisFlowApproval", "submitToPIC", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
                                        if (data == "process completed") {
                                            system.info(this,"Submit to PIC ", data);
                                            this.refreshList();
                                            this.getDataDetail(this.status);
									this.export.click();
                                        }else system.alert(this,"Submit to PIC ", data);
                                    });  
                                });
                            }else{
                                this.app.services.callServices("financial_mantisFlowApproval", "submitToPIC", [this.icm, this.ba_rekon, this.app._periode, this.eMemo.getText() ], (data) => {
                                    if (data == "process completed") {
                                        system.info(this,"Submit to PIC ", data);
                                        this.refreshList();
                                        this.getDataDetail(this.status);
									    this.export.click();
                                    }else system.alert(this,"Submit to PIC ", data);
                                });                      
                            }
                        });
						
						
					});
					
					
		this.setTabChildIndex();
		try {
            if (this.app._periode)
                this.filter_periode.setText(this.app._periode);
            else this.filter_periode.setText("");
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
					
                    self.mtsLogo0.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo0.top + 110);
                        this.pData.setTop(this.mtsLogo0.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo0.left + 80);
                        // this.arrow.getCanvas().css({background:"LIGHTCYAN"});
                        this.getDataDetail("received");
                    });
                    
					self.mtsLogo1.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo4.top + 110);
                        this.pData.setTop(this.mtsLogo4.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo1.left + 80);
                        // this.arrow.getCanvas().css({background:"LIGHTCYAN"});
						this.getDataDetail("open");
					});
					
					self.mtsLogo2.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo4.top + 110);
                        this.pData.setTop(this.mtsLogo4.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo2.left + 80);
                        // this.arrow.getCanvas().css({background:"CORNSILK"});
						this.getDataDetail("clear");
					});
					
					self.mtsLogo3.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo4.top + 110);
                        this.pData.setTop(this.mtsLogo4.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo3.left + 80);
                        // this.arrow.getCanvas().css({background:"PINK"});
						this.getDataDetail("unclear");
					});
					
					self.mtsLogo4.on("click", () =>{
                        this.arrow.setTop(this.mtsLogo4.top + 110);
                        this.pData.setTop(this.mtsLogo4.top + 100 + 20);	
						// this.arrow.getCanvas().css({background:"#dff9fb"});
                        this.arrow.setLeft(self.mtsLogo4.left + 80);
						this.getDataDetail("close");
					});
				// Approval
                    self.mtsLogo11.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo11.top + 110);
                        this.pData.setTop(this.mtsLogo11.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo11.left + 80);
                        // this.arrow.getCanvas().css({background:"LIGHTCYAN"});
                        this.getDataDetail("review_pic");
                    });
                
                    self.mtsLogo21.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo11.top + 110);
                        this.pData.setTop(this.mtsLogo11.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo21.left + 80);
                        // this.arrow.getCanvas().css({background:"CORNSILK"});
                        this.getDataDetail("review_ga");
                    });
                   
                    self.mtsLogo31.on("click", ()=>{	
                        this.arrow.setTop(this.mtsLogo41.top + 110);
                        this.pData.setTop(this.mtsLogo41.top + 100 + 20);
                        this.arrow.setLeft(self.mtsLogo31.left + 80);
                        // this.arrow.getCanvas().css({background:"PINK"});
                        this.getDataDetail("return");
                    });
                   
                    self.mtsLogo41.on("click", () =>{
                        this.arrow.setTop(this.mtsLogo41.top + 110);
                        this.pData.setTop(this.mtsLogo41.top + 100 + 20);	
                        // this.arrow.getCanvas().css({background:"#dff9fb"});
                        this.arrow.setLeft(self.mtsLogo41.left + 80);
                        this.getDataDetail("done");
                    });
                   


		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_fDashboardUser.extend(window.panel);
window.app_saku_fDashboardUser.implement({
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
		window.app_saku_fDashboardUser.prototype.parent.setWidth.call(this,data);
		if (this.pData){
            this.pData.setWidth(data - 60);
            this.sgData.setWidth(this.pData.width - 5);
            this.bClose.setLeft(this.pData.width - 40);
            this.pCatatan.setWidth(this.pData.width - 2);
            this.browser.setWidth(this.pData.width - 2);
            this.browser2.setWidth(this.pData.width - 2);
            this.bprint.setLeft(this.pData.width - 145);
            if (this.pInput){
                this.pInput.setWidth(data - 60);
            }
            if (this.pEditJurnal){
                this.pEditJurnal.setWidth(data - 60);
                this.pEditJurnal.sgEdit.setWidth(this.pEditJurnal.width - 42);
                this.pEditJurnal.totDebet.setLeft(this.pEditJurnal.width - 250);
                this.pEditJurnal.totKredit.setLeft(this.pEditJurnal.width - 250);
            }
            if (this.summaryBA){
                // this.summaryBA.setWidth(this.pData.width - 5);
                // this.summaryBA.setWidth(this.summaryBA.width - 2);

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
		window.app_saku_fDashboardUser.prototype.parent.setHeight.call(this,data);
		if (this.pData){
            //this.pData.setHeight(data - this.pData.top - 20);
            //this.sgData.setHeight( this.pData.height - 50);
			
		}
	},
	getDataDetail: function(status){
        this.arrow.show();
        this.pData.show();
        this.pCatatan.hide();
        this.bReceived.hide();
        showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");
		this.status = status;
        this.app.services.callServices("financial_mantisDashboard","getDetailDashboardUser",[status,this.filter_icm.getText(), this.filter_periode.getText()], (data) =>{
               this.sgData.clear();
               $.each(data, (k,v) =>{
                   this.sgData.addRowValues([v.icm, v.ba_rekon,v.cocd, v.fcbp, (v.doc_amount), (v.loc_amount),v.icm2, v.tp, v.fcbp2, (v.doc_amount2), (v.loc_amount2), v.doc_sakhir, v.loc_sakhir]);
               });
               hideLoading();
               this.getClientCanvas().scrollTop(this.pData.top);
        });
    },
	doAfterResize: function(w, h){
		
		
    },
    filterICMChange: function(){
		var self = this;
		console.log("Change inputan ");
		if(self.cocd.getText() != "" && self.tp.getText() != "" && self.jasa.getText() != "" ){
			self.app.services.callServices("financial_mantisAdj","getNoICMLama",[self.cocd.getText(),self.tp.getText(),self.jasa.getText(),self.tahun.getText(),self.bulan.getText()],function(data){  
				console.log("isi data di change inputan "+data);
				self.listICM = new arrayMap();
				self.eIcm.clearItem();
				$.each(data.induk, function(key, val){
					console.log("isi val di change inputan "+val.icm +"-"+val.pekerjaan);
					self.eIcm.addItem(val.icm,val.icm+" - "+val.pekerjaan);
					self.listICM.set(val.icm,val);
				});
			});       
		}
		
    },
    doChange: function(sender,col, row){
		try{			
			var self=this;
			if (sender == this.bulan){	
				if (this.bulan.getText() != ""){
                    self.app.services.callServices("financial_mantis","isPeriodeOpen",[self.cocd.getText() , self.tahun.getText() , self.bulan.getText()], (data) => {
                        if (data === false){
                                system.alert(self, "Bulan "+self.bulan.getText()+" di Tahun "+self.tahun.getText()+" Untuk COCD "+self.cocd.getText()+" Sudah Di Lock Admin!");
                                self.bulan.setText("");
                        }
                            
                        });
                        self.filterICMChange();
                    
                }
			}

			if(sender == this.cocd){
				self.filterICMChange();
				
			}

			if(sender == this.jasa){
				self.filterICMChange();
				
			}

			if(sender == this.tahun){
				self.filterICMChange();
				
			}

			if(sender == this.tp){
				
			}

			

		}catch(e){
			alert(e);
			error_log(e);
		}
	},
    showPanelInput: function(){
        var self = this;
        if (this.pInput === undefined){
            this.pInput = new panel(this.pData, {bound:[0,25, this.pData.width - 2, this.pData.height - 30], caption:"", color:"#ffffff"});
            this.cocd = new saiCBBL(this.pInput,{bound:[20,20,200,20],caption:"Comp. Code",readOnly:true, change:[this,"doChange"]});
            this.jasa = new saiCBBL(this.pInput,{bound:[20,45,200,20],caption:"Jasa", tag:1, change:[this,"doChange"]});	
            var thn = self.app._periode;
            var tahun = thn.substr(0,4);
            this.tahun = new saiCB(this.pInput,{bound:[20,70,200,20],caption:"Tahun", readOnly:true, items:[tahun], change:[this,"doChange"]});
            this.curr = new saiCB(this.pInput,{bound:[20,95,200,20],caption:"Curr", readOnly:true, items:["IDR","AUD","USD"], change:[this,"doChange"]});
            
            
            this.tp = new saiCBBL(this.pInput,{bound:[520,20,300,20],caption:"TP",change:[this,"doChange"],tag:1});
            this.fcbp = new saiCB(this.pInput,{bound:[520,45,300,20],caption:"FCBP", readOnly:true, visible:false, items:["FCBP01","FCBP02","FCBP03","FCBP04","FCBP05","DWS","DES/DBS"], change:[this,"doChange"]});
            this.fcbp.setItemHeight(7);
            this.bulan = new saiCB(this.pInput,{bound:[520,70,300,20],caption:"Bulan", readOnly:true, items:["01","02","03","04","05","06","07","08","09","10","11","12"], change:[this,"doChange"]});
            this.bulan.setItemHeight(12);

            // this.icm = new saiLabelEdit(this.tab.childPage[1],{bound:[520,95,200,20],caption:"ICM", readOnly:true});
            this.eIcm = new saiCB(this.pInput,{bound:[520,95,300,20],caption:"ICM", readOnly:true,change:[this,"doChange"]});
            
            
            this.pekerjaan = new saiLabelEdit(this.pInput,{bound:[20,120,800,20],caption:"Pekerjaan"});
            
            this.tp.on("change", function(){
                if(self.tp.getText() == "1000"){
                    self.fcbp.setVisible(true);
                }else{
                    self.fcbp.setVisible(false);
                }
            });
            
            

            this.sg2 = new saiGrid(this.pInput,{bound:[20,145,this.pInput.width-42,this.pInput.height-200],
                colCount: 9,
                colTitle: ["Post Key","GL Acc","Nama Akun","BA Telkom","Keterangan","Doc Amount","Loc Amount","Cost Center","Profit Center"],
                colWidth:[[0,1,2,3,4,5,6,7,8],[70,80,230,100,230,100,100,90,90]],
                columnReadOnly:[true, [],[0,1,2,3,4,5,6,7,8]],		
                buttonStyle:[[0,1,3,7,8],[bsAuto,bsEllips,bsEllips,bsEllips,bsEllips]], 
                colFormat:[[5,6],[cfNilai,cfNilai]],		
                picklist:[[0],[new arrayMap({items:["40 - Debet","50 - Credit"]})
                                ]],
                rowPerPage:20, 
                autoPaging:true, 
                pager:[this,"doPager1"]
            });

            this.sg2.on("entrySearch", function(col, row, value, fn){
                //if (value.length > 2) 
                {
                    if (self.myTimeExecSearch){
                        clearTimeout(self.myTimeExecSearch);
                    }
                    self.myTimeExecSearch = setTimeout( function(){
                        if (col == 1) {
                            self.app.services.callServices("financial_mantis","getListGL",[value, self.app._lokasi], function(data){
                                fn(data);
                            });
                        }
                        else if (col == 3) {
                            self.app.services.callServices("financial_mantis","getListBA",[value, self.app._lokasi, self.tp.getText()], function(data){
                                fn(data);
                            });
                        }
                        else if (col == 7) {
                            self.app.services.callServices("financial_mantis","getListCC",[value, self.sg2.cells(3, row)], function(data){
                                fn(data);
                            });
                        }
                        else if (col == 8) {
                            self.app.services.callServices("financial_mantis","getListProfitCenter",[value, self.sg2.cells(3, row)], function(data){
                                fn(data);
                            });
                        }
                    }, 500);
                }
            });

            this.sg2.on("change", function(col, row, data){
                if ( col == 1 ){
                    console.log("masuk 1");
                    var gl = self.sg2.cells(1, row);
                    if ( gl == "")
                        return;
                    var isValidGL = new Promise((resolve, reject)=>{
                        self.app.services.callServices("financial_mantisAdj","isValidGL",[self.app._lokasi, gl], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidGL.then((validGL)=>{
                        console.log(validGL);
                        if(self.sg2.cells(1,row) != ""){
                            if(validGL){
                                
                            }else{
                                self.sg2.setCell(1, row, "");
                                system.alert(self, "Cust/Vend/GL Acc Tidak DItemukan!", "");
                            }
                        }
                    });
                }

            
                if ( col == 3 ){
                    console.log("masuk 3");
                    var isValidBA = new Promise((resolve, reject)=>{
                        var ba = self.sg2.cells(3, row);
                        console.log("process validasi", ba);
                        self.app.services.callServices("financial_mantis","isValidBA",[self.app._lokasi, ba], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidBA.then((validBA)=>{
                        console.log(validBA);
                        if(self.sg2.cells(3,row) != ""){
                            if(validBA){
                                
                            }else{
                                self.sg2.setCell(3, row, "");
                                system.alert(self, "Business Area Tidak Ditemukan!", "");
                            }
                        }
                    });
                }

                if ( col == 7 ){
                    console.log("masuk 7");
                    var isValidCC = new Promise((resolve, reject)=>{
                        var cc = self.sg2.cells(7, row);
                        console.log("process validasi", cc);
                        self.app.services.callServices("financial_mantis","isValidCC",[self.app._lokasi, cc], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidCC.then((validCC)=>{
                        console.log(validCC);
                        if(self.sg2.cells(7,row) != ""){
                            if(validCC){
                                
                            }else{
                                self.sg2.setCell(7, row, "");
                                system.alert(self, "Cost Center Tidak DItemukan!", "");
                            }
                        }
                    });
                }

                if ( col == 8 ){
                    console.log("masuk 8");
                    var isValidPC = new Promise((resolve, reject)=>{
                        var pc = self.sg2.cells(8, row);
                        console.log("process validasi", pc);
                        self.app.services.callServices("financial_mantis","isValidProfit",[self.app._lokasi, pc], function(data){
                            resolve(data);
                        });
                    });
                    
                    isValidPC.then((validPC)=>{
                        console.log(validPC);
                        if(self.sg2.cells(8,row) != ""){
                            if(validPC){
                                
                            }else{
                                self.sg2.setCell(8, row, "");
                                system.alert(self, "Profit Center Tidak Ditemukan!", "");
                            }
                        }
                    });
                }
                
            
            });

            this.sg2.on("selectRow", function(col, row, value, data){
                if (col == 1){
                    self.sg2.setCell(col, row, value);
                    self.sg2.setCell(col + 1, row, data[1]);
                }else if (col == 3){
                    self.sg2.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
                }else if (col == 7){
                    self.sg2.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
                }else if (col == 8){
                    self.sg2.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
                }

            });

            this.bSave = new button(this.pInput,{bound:[20,this.pInput.height-40,80, 30],icon:"<i class='fa fa-check' style='color:white'></i>", caption:"Save"});
            this.bSave.setColor("#27ae60");

            this.bSave.on("click",function(sender){
                try{
                    var listAkun = [];
                    var dataHeader = {					
                        cocd : self.cocd.getText(),
                        jasa : self.jasa.getText(),
                        tahun : self.tahun.getText(),
                        curr : self.curr.getText(),
                        tp : self.tp.getText(),
                        fcbp : self.fcbp.getText(),
                        bulan : self.bulan.getText(),
                        icm : self.eIcm.getText().substr(0,12),
                        pekerjaan : self.pekerjaan.getText()
                    };
                    

                    var dataDetail = [];
                    var validasiPenerima = false;
                    for (var i = 0; i < self.sg2.getRowCount();i++){				
                        if(self.sg2.cells(0,i) != "" || self.sg2.cells(1,i) != "" || self.sg2.cells(2,i) != ""  || self.sg2.cells(5,i) != ""  || self.sg2.cells(6,i) != "" ){
                            var item1 = {
                                post_key : self.sg2.cells(0,i), 
                                gl_acc : self.sg2.cells(1,i),
                                keterangan : self.sg2.cells(4,i),
                                ba : self.sg2.cells(3,i),
                                docAm : self.sg2.cells(5,i),
                                locAm : self.sg2.cells(6,i),
                                cc : self.sg2.cells(7,i),
                                profit : self.sg2.cells(8,i),
                            };
                            dataDetail.push(item1);
                            validasiPenerima = true;
                            listAkun.push(self.sg2.cells(1,i));
                        }else{
                            validasiPenerima = false;
                        }
                    }
                    
                    if (dataDetail.length > 0 && validasiPenerima == false){
                        validasiPenerima = true;
                    }
                    if(self.eIcm.getText() == ""){
                        system.alert(self, "Harap Create ICM Terlebih Dahulu!", "");
                    }else if (validasiPenerima) {
                        // alert(self.baru);
                        // alert(self.idheader_old);
                        // alert(self.baru+" : "+dataHeader.icm);
                        // return;
                        var periode = self.tahun.getText() + self.bulan.getText();
                        self.app.services.callServices("financial_mantisUpload","isBARekonSubmitted", [self.eIcm.getText().substr(0,11), self.cocd.getText(), periode,listAkun ] ,function(submitted){
                            if (!submitted){
                                self.app.services.callServices("financial_mantis","saveInputICM", [self.app._lokasi, dataHeader, dataDetail, "TRM", self.idheader_old] ,function(data){
                                    // alert(JSON.stringify(data));
                                    if (data.return == "process completed") {
                                        system.info(self, data.return,"");
                                        self.cocd.setText("");
                                        self.jasa.setText("");
                                        self.tahun.setText("");
                                        self.curr.setText("");
                                        self.tp.setText("");
                                        self.fcbp.setText("");
                                        self.bulan.setText("");
                                        self.eIcm.setText("");
                                        self.pekerjaan.setText("");
                                        self.sg2.clear(1);
                                        self.refreshList();
                                        // self.app._mainForm.doRecall();
                                    }else {
                                        system.alert(self, data.return,"");
                                    }
                                });
                            }else {
                                self.alert("Gagal Submit","ICM sudah di Submitted");
                            }
                        });

                        
                    }else{
                        system.alert(self, "Harap Lengkapi Isian Anda!", "");
                    }
                }catch(e){
                    alert(e);
                }
            });


            this.totDebet = new saiLabelEdit(this.pInput,{bound:[940,this.pInput.height-50,240,20],caption:"Total Debit",readOnly:true,tipeText:ttNilai});
            this.totKredit = new saiLabelEdit(this.pInput,{bound:[940,this.pInput.height-25,240,20],caption:"Total Kredit",readOnly:true,tipeText:ttNilai});
            

            this.sg2.on("change", function (col, row, id){
                var totdr = 0;
                var totcr = 0;
                for (var i = 0 ; i < self.sg2.getRowCount();i++){
                    if(self.sg2.cells(0, i) == "40 - Debet"){
                        totdr += nilaiToFloat(self.sg2.cells(6, i));
                    }
                    if(self.sg2.cells(0, i) == "50 - Credit"){
                        totcr += nilaiToFloat(self.sg2.cells(6, i));
                    }
                }
                self.totDebet.setText(floatToNilai(nilaiToFloat(totdr)));
                self.totKredit.setText(floatToNilai(nilaiToFloat(totcr)));
            });


            
            this.sg2.on("keyup", function(col, row, value){
                if(self.curr.getText() == "IDR"){
                    // for (var i = 0 ; i < self.sg2.getRowCount();i++){
                        if (col == 5){
                            // alert("halo");
                            console.log(row+":"+col+""+value);
                            console.log(self.sg2.cells(5,row));
                            
                            self.sg2.cells(6,row,value);				
                        }
                    // }
                }
            });
            self.cocd.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			self.tp.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListCOCD2",["","","",0]],["cocd","company_name"]," ","Daftar Company code");
			self.jasa.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getListJASA",["","","",0]],["kode_jasa","jenis_jasa"]," ","Daftar Jasa");
			
			
            this.sg2.clear(1);
        }
        this.cocd.setText(this.app._lokasi);
        this.tp.setText(this.cocd_tp);
        this.tahun.setText(this.app._periode.substr(0,4));
        this.bulan.setText(this.app._periode.substr(4,2));
        this.eIcm.setText(this.icm);
        if (this.cocd_tp == "1000"){
            this.fcbp.setText(this.fcbp_tp);
        }
        showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");
        this.app.services.callServices("financial_mantisDashboard","getICMHeader",[this.icm], (data) => {
            this.curr.setText("");
            this.pekerjaan.setText("");
            this.jasa.setText("");
            if (data.currency){
                this.curr.setText(data.currency);
                this.pekerjaan.setText(data.pekerjaan);
                this.jasa.setText(data.kode_jasa);
            }
            hideLoading();
        });
        this.bprint.hide();
        this.pInput.show();
    },
    showPanelShowJurnal: function(adj){
        var self = this;
        this.is_adj = adj;
		this.isLoadedAkun = true;
        if (this.pEditJurnal === undefined){
            this.pEditJurnal = new panel(this.pData, {bound:[0,25, this.pData.width - 2, this.pData.height - 30], caption:"", color:"#ffffff"});
            
            this.cbAll = new checkBox(this.pEditJurnal, {bound:[20,2,150,20], caption:"View All Item Jurnal"});
			this.eListHeader = new saiCB(this.pEditJurnal,{bound:[170,2,200,20],caption:"No Jurnal", readOnly:true,change:[this,"doChange"]});
			this.bReloadJurnal = new button(this.pEditJurnal, {bound:[380, 2, 100,20], caption:"Show Jurnal"});
            
            this.cbAll.on("click", () => {
                if (this.eListHeader.getText() != "")
                    this.bReloadJurnal.click();
            });
			this.bReloadJurnal.on("click", () => {
                this.bApplyClick = true;
                if (this.eListHeader.getText() == ""){
                    system.alert(this, "No Jurnal belum di pilih dari List","Silakan cek kembali");
                    this.eListHeader.setFocus();
                    return;
                }
                showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");//$icm, $periode, $akun, $isAdj = null
                
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
                colTitle: ["No Jurnal","Post Key","GL Acc","Nama Akun","BA Telkom","Keterangan","Doc Amount","Loc Amount","TP","Created By"],
                colWidth:[[0,1,2,3,4,5,6,7,8,9],[80,70,80,230,100,230,100,100,90,90]],
                columnReadOnly:[true, [0,8],[1,2,3,4,5,6,7]],		
                buttonStyle:[[1,2,4,8,9],[bsAuto,bsEllips,bsEllips,bsEllips,bsEllips]], 
                colFormat:[[6,7],[cfNilai,cfNilai]],		
                picklist:[[1],[new arrayMap({items:["40","50"]})]],
                rowPerPage:20, 

                autoPaging:true, 
                pager:[this,"doPager1"]
            });

            this.pEditJurnal.sgEdit.on("entrySearch", function(col, row, value, fn){
                //if (value.length > 2) 
                console.log("entry seasrc" + value);
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

                if (col == 6){
                    console.log(self.currency);
                    if (self.currency == "IDR"){
                        self.pEditJurnal.sgEdit.cells(7, row, nilaiToFloat( self.pEditJurnal.sgEdit.cells(6, row) ) );
                    }
                }
                

                
                
            
            });

            this.pEditJurnal.sgEdit.on("selectRow", function(col, row, value, data){
                if (col == 2){
                    self.pEditJurnal.sgEdit.setCell(col, row, value);
                    self.pEditJurnal.sgEdit.setCell(col + 1, row, data[1]);
                }else if (col == 4){
                    self.pEditJurnal.sgEdit.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
                }else if (col == 8){
                    self.pEditJurnal.sgEdit.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
                }else if (col == 9){
                    self.pEditJurnal.sgEdit.setCell(col, row, value);
                    // self.sg2.setCell(col + 1, row, data[1]);
                }

            });
            this.pEditJurnal.sgEdit.on("afterAddRow", (row)=>{
                var sg = this.pEditJurnal.sgEdit;
                sg.cells(0, row, sg.cells(0, row - 1));
                sg.cells(8, row, sg.cells(8, row - 1));
                sg.cells(9, row, sg.cells(9, row - 1));
                sg.cells(4, row, sg.cells(4, row - 1));

            });

            this.pEditJurnal.bSave = new button(this.pEditJurnal,{bound:[20,this.pEditJurnal.height-60,80, 30],icon:"<i class='fa fa-save' style='color:white;font-size:14px'></i>", caption:"Save"});
            this.pEditJurnal.bSave.setColor("#27ae60");

            this.pEditJurnal.bSave.on("click",() => {
                try{
                    if (this.eListHeader.getText() == ""){
                        system.alert(this, "Jurnal belum di pilih dari List","Silakan cek kembali");
                        this.eListHeader.setFocus();
                        return;
                    }
					this.confirm("Update jurnal " + this.eListHeader.getText(),"Apa data sudah benar?", ()=>{
                        if (this.cbAll.isChecked() ){
                            var data = [];
                            for (var row = 0; row < this.pEditJurnal.sgEdit.getRowCount();row++){

                                var line = {
                                    post_key : this.pEditJurnal.sgEdit.cells(1, row),
                                    doc : this.pEditJurnal.sgEdit.cells(6, row),
                                    loc : this.pEditJurnal.sgEdit.cells(7, row),
                                    ba : this.pEditJurnal.sgEdit.cells(4, row),
                                    gl_acc : this.pEditJurnal.sgEdit.cells(2, row),
                                    keterangan : this.pEditJurnal.sgEdit.cells(5, row),
                                    cc : "",//this.pEditJurnal.sgEdit.cells(8, row),
                                    profit : ""//this.pEditJurnal.sgEdit.cells(9, row)
                                };	
                                if (parseFloat(line.doc) < 0 || parseFloat(line.loc) < 0 ){
                                    system.alert("Data Doc Amount tidak boleh minus","silakan cek kembali isian Anda baris ke " + row);
                                    return;
                                }
                                if (parseFloat(line.loc) < 0 ){
                                    system.alert("Data Loc Amount tidak boleh minus","silakan cek kembali isian Anda baris ke " + row);
                                    return;
                                }
                                data.append(data);
                                if (this.selected_tp == "1000" && ( line.ba == undefined || (line.ba.substr(0,1) != "T" ) )) {
                                    system.alert("Data BA tidak valid","silakan cek kembali isian Anda baris ke " + row);
                                    return;
                                }else if (this.selected_cc == "1000" && ( line.ba == undefined || (line.ba.substr(0,1) != "T" ) )) {
                                    system.alert("Data BA tidak valid","silakan cek kembali isian Anda");
                                    return;
                                }
                            }
                            
                            // $data->doc, $data->loc, $data->ba
                            this.app.services.callServices("financial_mantisDashboard","updateJurnalAll",[this.icm, this.eListHeader.getText(), data, this.is_adj, this.selected_cc, this.selected_tp], data => {
                                if (data == "process completed"){
                                    system.info(this,"Proses update berhasil ", "");
                                    this.showReportSummmaryBA();
                                }else{
                                    system.alert(this,"Gagal update jurnal", data);
                                }
                            });
                        }else{
                            // system.info("Update Jurnal","Update Jurnal per item masih belum support");
                            // return;
                            var row = this.pEditJurnal.sgEdit.row;
                            var data = {
                                post_key : this.pEditJurnal.sgEdit.cells(1, row),
                                doc : this.pEditJurnal.sgEdit.cells(6, row),
                                loc : this.pEditJurnal.sgEdit.cells(7, row),
                                ba : this.pEditJurnal.sgEdit.cells(4, row)
                            };
                            // $data->doc, $data->loc, $data->ba
                            var idheader = this.pEditJurnal.sgEdit.cells(0, row);
                            this.app.services.callServices("financial_mantisDashboard","updateJurnal",[this.icm, this.selected_akun, idheader, data, this.is_adj, this.selected_cc, this.selected_tp], data => {
                                if (data == "process completed"){
                                    system.info(this,"Proses update berhasil ", "");
                                    this.showReportSummmaryBA();
                                }else{
                                    system.alert(this,"Gagal update jurnal", data);
                                }
                            });	
                        }
                    });
					
                    
                }catch(e){
                    alert(e);
                }
            });
            this.pEditJurnal.bDelete = new button(this.pEditJurnal,{bound:[120,this.pEditJurnal.height-60,80, 30],icon:"<i class='fa fa-trash' style='color:white;font-size:14px'></i>", caption:"Delete"});
            this.pEditJurnal.bDelete.setColor("#b71c1c");

            this.pEditJurnal.bDelete.on("click",() => {
                try{
                    if (this.eListHeader.getText() == ""){
                        system.alert(this, "Jurnal belum di pilih dari List","Silakan cek kembali");
                        this.eListHeader.setFocus();
                        return;
                    }
                    var msg = "Delete jurnal " + this.eListHeader.getText();
                    if (!this.cbAll.isChecked()){
                        msg = "Delete akun "+ this.selected_akun +" di No Jurnal " + this.eListHeader.getText();
                    }
                    this.confirm("Delete Jurnal",msg +"<br/> Apa data sudah benar?", ()=>{
                        var row = this.pEditJurnal.sgEdit.row;
                        var data = {
                            post_key : this.pEditJurnal.sgEdit.cells(1, row),
                            doc : this.pEditJurnal.sgEdit.cells(6, row),
                            loc : this.pEditJurnal.sgEdit.cells(7, row),
                            ba : this.pEditJurnal.sgEdit.cells(4, row)
                        };
                        // $data->doc, $data->loc, $data->ba
                        var idheader = this.pEditJurnal.sgEdit.cells(0, row);
                        if (this.cbAll.isChecked() ){
                            this.app.services.callServices("financial_mantisDashboard","deleteAllJurnal",[this.icm, this.eListHeader.getText(), this.is_adj], data => {
                                if (data == "process completed"){
                                    system.info(this,"Proses delete berhasil ", "");
                                    this.showReportSummmaryBA();
                                }else{
                                    system.alert(this,"Gagal delete jurnal", data);
                                }
                            });
                        }else{
                            // system.info("Delete Jurnal","Delete Jurnal per item masih belum support");
                            // return;
                            this.app.services.callServices("financial_mantisDashboard","deleteJurnal",[this.icm, this.selected_akun, idheader, this.is_adj], data => {
                                if (data == "process completed"){
                                    system.info(this,"Proses delete berhasil ", "");
                                    this.showReportSummmaryBA();
                                }else{
                                    system.alert(this,"Gagal delete jurnal", data);
                                }
                            });	
                        }
                    });
                    
                    
                }catch(e){
                    alert(e);
                }
            });
			/*
            this.pEditJurnal.bDeleteAll = new button(this.pEditJurnal,{bound:[220,this.pEditJurnal.height-60,120, 30],icon:"<i class='fa fa-trash' style='color:white;font-size:14px'></i>", caption:"Delete Jurnals"});
            this.pEditJurnal.bDeleteAll.setColor("#7f0000");

            this.pEditJurnal.bDeleteAll.on("click",() => {
                try{
                    var row = this.pEditJurnal.sgEdit.row;
                    var data = {
                        post_key : this.pEditJurnal.sgEdit.cells(1, row),
                        doc : this.pEditJurnal.sgEdit.cells(6, row),
                        loc : this.pEditJurnal.sgEdit.cells(7, row),
                        ba : this.pEditJurnal.sgEdit.cells(4, row)
                    };
                    // $data->doc, $data->loc, $data->ba
                    var idheader = this.pEditJurnal.sgEdit.cells(0, row);
                    this.app.services.callServices("financial_mantisDashboard","deleteAllJurnal",[this.icm, idheader, this.is_adj], data => {
                        if (data == "process completed"){
                            system.info(this,"Proses delete berhasil ", "");
                        }else{
                            system.alert(this,"Gagal delete jurnal", data);
                        }
                    });s
                }catch(e){
                    alert(e);
                }
            });
			*/


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
        this.bApplyClick = false;
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
        this.bprint.hide();
        this.pEditJurnal.show();
        this.summaryBA.hide();
    },
    
    showHint : function(){

    },
    showReportSummmaryBA: function(){
		if (this.summaryBA === undefined){
            // this.summaryBA = new panel(this.pData, {bound:[0,25, this.pData.width - 2, this.pData.height - 30], caption:"", color:"#ffffff"});
            // this.bXls = new control(this.summaryBA, {bound:[20,2,80,25 ]});
            // this.bXls.getCanvas().html("<i class='fa fa-download' style='font-size:16px;color:#1e88e5'>&nbsp;Excel</i>").css({cursor:"pointer"});
                    //View BA
			this.summaryBA = new saiGrid(this.pData,{bound:[0,25,this.pData.width-2,this.pData.height-30],
				colCount: 28, headerHeight: 65, pasteEnable: false,
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
						title : "Elim Reguler",
						width : 0,
						columnAlign: "bottom", 
						hint  : "",
					},
					{
						title : "Elim BSPL",
						width : 0,
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
						title : "Change Kelompok BA Rekon",
						width : 100,
						columnAlign: "bottom", 
						hint  : "",
					}
				],
				colFormat:[[14, 15, 16, 17, 18,19,20,21,22,23,25,26,27],[cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai,cfNilai]],
				autoPaging: true, rowPerPage: 50, readOnly:true
            });
            // this.summaryBA.on("mouseover", (col, row, node) => {
            //     if (col == 16 || col == 17){
            //         node.css({cursor:"pointer"});
            //         window.system.showHint(node.offset().left, node.offset().top + 20, "Silakan double klik untuk lihat detail jurnal",true);
            //     }
            // });
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
            this.summaryBA.on("mouseleave", (col, row ,node) => {
                
            });
            this.summaryBA.on("dblClick", (col, row, value) => {
                if (col != this.summaryBA) {
                    this.selected_akun = this.summaryBA.cells(10, row);
                    this.currency = this.summaryBA.cells(3,row);
                    this.selected_cc = this.summaryBA.cells(6, row);
                    this.selected_tp = this.summaryBA.cells(8, row);
                    console.log("Double Click " + col +" "+ row);
                    if (col == 30){
                        this.showPanelShowJurnal(0);
                    }else if (col == 31){
                        this.selected_akun = this.summaryBA.cells(10, row);
                        this.showPanelShowJurnal(1);
                    }else if (col == 32){
                        //$icm, $periode, $cocd, $akun, $ba_rekon, $jenis_akun
                        system.alert(this,"Silakan Hubungi PIC / Admin untuk mengubah BA Rekon");
                        return;
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
            this.summaryBA.setWidth(this.summaryBA.cnvHeader.width() + 40);
		}  
		this.summaryBA.show();
		// this.summaryBA.setWidth(this.summaryBA.width + 4);
		
		this.getSummaryBA(this.app._lokasi, this.icm, "", "", "", "", "", this.ba_rekon);
		
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
			ba_rekon : ba_rekon.substr(4,5)
		};
		
		this.app.services.callServices("financial_mantisRepTW", "getListEliminasi", [this.tmpFilter], (data) => {
			this.summaryBA.clear();
			
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
					Math.round(line.elim_reg,0),Math.round(line.elim_bspl,0),
					Math.round(line.balance,0),line.status, line.ba_rekon, "<font style='color:blue'>View Jurnal</font>","<font style='color:blue'>View Adj</font>","<font style='color:blue'>Edit BA</font>"
				]);
				
			}
			

			
		}, (err) => {
			
		});
	},
	refreshList: function(page){
		try{
            showLoading("<i class='fa fa-spinner fa-2x' /><br>Loading...");
			this.currentPage = page;
			var self = this;
			//view
                //open
                if (this.pInput)
                    this.pInput.hide();
                if (this.summaryBA)
                    this.summaryBA.hide();
                this.browser.hide();
                this.bprint.hide();
                this.bViewBA.hide();
                this.bViewSumBA.hide();
                this.pCatatan.hide();
                this.bReceived.hide();
				self.app.services.callServices("financial_mantisDashboard","getDashboardUser",[this.filter_icm.getText(),this.filter_periode.getText()], function(data){
                    //self.mtsIsi0.setCaption(data.total_received);	
                    self.mtsLogo0.setValue(data.total_received);	
                    self.mtsLogo1.setValue(data.total_open);		
                    self.mtsLogo2.setValue(data.total_clear);	
                    self.mtsLogo3.setValue(data.total_unclear);	
                    self.mtsLogo4.setValue(data.total_close);	
                    self.mtsLogo5.setValue(parseFloat(data.total_open) + parseFloat(data.total_clear) + parseFloat(data.total_unclear) );	

					self.mtsLogo11.setValue(data.total_submitted);		
                    self.mtsLogo21.setValue(data.total_review);	
                    self.mtsLogo31.setValue(data.total_return);	
                    self.mtsLogo41.setValue(data.total_done);	
                    self.mtsLogo51.setValue(parseFloat(data.total_open) + parseFloat(data.total_clear) + parseFloat(data.total_unclear) + parseFloat(data.total_submitted) + parseFloat(data.total_review) +parseFloat(data.total_return) + parseFloat(data.total_done) );																
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
        
    },
    showEditCatatan: function(title, callback){
        if (this.confirmEditCatatan){
			this.confirmEditCatatan.free();
		}
		this.confirmEditCatatan = new popupForm(this.app);
		this.confirmEditCatatan.setBound(0, 0,400, 200);
		this.confirmEditCatatan.setArrowMode(0);
		this.confirmEditCatatan.getCanvas().css({ overflow : "hidden", background:"#fffff", borderRadius:"5px", boxShadow:"0px 10px 20px #888888" });
		this.confirmEditCatatan.getClientCanvas().css({ overflow : "hidden"});
		this.confirmEditCatatan.setTop( this.height / 2 - 100);
		this.confirmEditCatatan.setLeft( this.width / 2 - 200);


			this.confirmEditCatatan.lTitle = new label(this.confirmEditCatatan, {bound:[0,20,400,30], caption: title, alignment:"center", fontSize:18, bold :true});
            // this.confirmEditCatatan.lMessage = new label(this.confirmEditCatatan, {bound:[20, 60, 360, 100], caption: , fontSize:12});
            this.confirmEditCatatan.cbCatatan = new saiCB(this.confirmEditCatatan,{bound:[20,80,300,20], caption:"Catatan", items:["Selisih saldo akhir dikarenakan Selisih Kurs","Selisih saldo akhir dikarenakan PPN","Selisih saldo akhir tidak material","Selisih saldo akhir dikarenakan dispute"]});
            this.confirmEditCatatan.bCancel = new control(this.confirmEditCatatan,{bound:[-1,160,201,40]});
			this.confirmEditCatatan.bCancel.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
									.html("<span style='font-size:12px;font-weight:bold'>CANCEL</span>")
									.on("mouseover",() =>{
										this.confirmEditCatatan.bCancel.getCanvas().find("span").css({fontSize:"14px"});
									})
									.on("mouseleave",() =>{
										this.confirmEditCatatan.bCancel.getCanvas().find("span").css({fontSize:"12px"});
									});
			this.confirmEditCatatan.bCancel.on("click", () => {
				this.confirmEditCatatan.hide();
			});
			this.confirmEditCatatan.bOk = new control(this.confirmEditCatatan,{bound:[200,160,200,40]});
			this.confirmEditCatatan.bOk.getCanvas().css({cursor:"pointer",border:"0.5px solid #888888", background:"#ffffff",textAlign:"center", display:"flex",justifyContent: "center",alignItems: "center"})
								.html("<span style='font-size:12px;font-weight:bold'>OK</span>")
								.on("mouseover",() =>{
									this.confirmEditCatatan.bOk.getCanvas().find("span").css({fontSize:"14px"});
								})
								.on("mouseleave",() =>{
									this.confirmEditCatatan.bOk.getCanvas().find("span").css({fontSize:"12px"});
								});;

		
		this.confirmEditCatatan.lTitle.setCaption(title);
		// this.confirmEditCatatan.lMessage.setCaption(msg);
		this.confirmEditCatatan.bOk.removeAllListeners("click");
		this.confirmEditCatatan.bOk.on("click", () =>{
            //$icm,$periode, $ba_rekon, $catatan
            this.app.services.callServices("financial_mantisFlowApproval", "addCatatan", [this.icm, this.app._periode, this.ba_rekon, this.confirmEditCatatan.cbCatatan.getText() ], (data) => {
                if (data == "process completed") {
                    if (callback)
                        callback();
                }else system.alert(this,"Gagal add Catatan ", data);
                this.confirmEditCatatan.hide();
            }); 
            
            
			
		});
		
        this.confirmEditCatatan.show();
        
    },
});


