window.app_saku_modul_fChatICM = function(owner,menu)
{
	if (owner)
	{
		try{
			window.app_saku_modul_fChatICM.prototype.parent.constructor.call(this,owner);
			this.className  = "app_saku_modul_fChatICM";
			this.itemsValue = new arrayList();		
			this.maximize();	
			this.app._mainForm.childFormConfig(this, "mainButtonClick","ICM Message", 0);

			uses("control_popupForm;listCustomView;saiCBBL;panel;", true);			
            
            this.leftPanel = new panel(this, {bound:[0,0,400, this.height - 2]});
                this.leftPanel.getCanvas().css({border:"1px solid #919191"})
                this.eSearch = new saiEdit(this.leftPanel, {bound:[10,10, 350, 30], text:""});
                this.eSearch.getCanvas().css({borderRadius:"10px"});
                $("#"+ this.eSearch.getFullId() +"_edit").css({borderRadius:"10px",paddingLeft:"10px",paddingRight:"35"});


                this.iSearch = new control(this.leftPanel,{bound:[330,12,20,20]});
                this.iSearch.getCanvas().html("<i class='fa fa-search fa-2x' style='color:#919191'/>");

                this.iRefresh = new control(this.leftPanel,{bound:[370,12,20,20]});
                this.iRefresh.getCanvas().html("<i class='fa fa-refresh fa-2x' style='color:#919191'/>");

                this.iRefresh.on("click", () => {
                    this.refreshUser();
                });

                this.listContainer = new listCustomView(this.leftPanel, {bound:[0,50,400, this.leftPanel.height - 52]});
                this.listContainer.getCanvas().css({border:"", background:""});
                this.searchContainer = new msgSearchICM(this.leftPanel,{bound:[0,0,"100%","100%"], visible: false});
                this.searchContainer.on("backClick", () => {
                    this.floatingBtn.show();
                });
                this.searchContainer.on("startMessaging", (icm, user) => {
                    this.container.icm = icm;
                    this.container.toUser = user;
                    this.addItem({firstnamme : user, icm:icm});
                    this.container.title.setCaption(user);
                    this.container.subtitle.setCaption(icm);
                });

            this.rightPanel = new panel(this, {bound:[400,0, this.width - 404, this.height - 2]});
                this.rightPanel.getCanvas().css({border:"1px solid #919191",overflow:"hidden"});
                this.rightPanel.getClientCanvas().css({overflow:"hidden"});
                this.container = new control_msgForm(this.rightPanel,{bound:[0,0,"100%","100%"]});
                
                this.container.on("refreshClick",() =>{
					this.refreshMsg();
                });
                this.container.on("sendClick",(icm, user, msg) =>{
                    this.container.addItem({title: user , msg: msg });
                    this.app.services.callServices("financial_mantisChat","addMessage",[this.app._lokasi, {icm : icm, touser:user, msg: msg}], (data) =>{
                        console.log(data);
                    });
                });
            
            this.floatingBtn = new control(this,{bound:[340, this.height - 70, 50,50]});
                this.floatingBtn.getCanvas().css({display:"flex",cursor:"pointer",justifyContent:"center",alignItems:"center",background:"#03A9F4", borderRadius:"25px", boxShadow:"-5px 5px 20px rgba(0,0,0,0.75)"})
                                            .html("<i class='fa fa-pencil fa-2x' style='color:white'/>");

                this.floatingBtn.getCanvas().on("mouseover",() =>{
                    this.floatingBtn.getCanvas().css({background:"#1976D2"});
                });
                this.floatingBtn.getCanvas().on("mouseleave",() =>{
                    this.floatingBtn.getCanvas().css({background:"#2196F3"});
                });
                this.floatingBtn.on("click", () => {
                    this.searchContainer.show("slow");
                    this.floatingBtn.hide();
                });
		
			// self.icm.setServices(this.app.servicesBpc, "callServices",["financial_mantis","getUpdICM",["","","",0]],["icm","pekerjaan"],"","Daftar ICM");
			
			
			var self=this;

			
			self.app._mainForm.bSimpan.setVisible(false);
			self.app._mainForm.bHapus.setVisible(false);
			self.app._mainForm.bClear.setVisible(false);
			self.on("close",function(){
				self.app._mainForm.dashboard.refreshList();
				self.app._mainForm.bSimpan.setVisible(true);
				self.app._mainForm.bHapus.setVisible(true);
			    self.app._mainForm.bClear.setVisible(true);
			});
			
		}catch(e){
			alert(e);
			systemAPI.alert(e);
		}
		
	}
};
window.app_saku_modul_fChatICM.extend(window.childForm);
window.app_saku_modul_fChatICM.implement({	
	doAfterResize: function(w,h){
        if (this.leftPanel){
            this.leftPanel.setHeight(h - 2);
            this.rightPanel.setHeight(h - 2);
            this.rightPanel.setWidth(w - 404);
            this.listContainer.setHeight(this.leftPanel.height - 52 );
            this.floatingBtn.setTop(h - 70);
            this.container.doAfterResize(this.container.width, this.container.height);
        }
	},
	refreshUser: function(){
        this.app.services.callServices("financial_mantisChat","getInbox",[this.app._lokasi,"1"], (data) =>{
            this.listContainer.clearChild();
            $.each(data, (i, val) => {
                 this.addItem(val);
            });
        });
    },
    refreshMsg: function(icm){
		console.log(icm);
        this.app.services.callServices("financial_mantisChat","getMsg",[icm], (data) =>{
            this.container.container.clearChild();
            $.each(data, (i, val) => {
				console.log(JSON.stringify(data));
				this.container.addItem({title: val.firstname , msg: val.msg, tgl : val.send_date });
            });
        });
    },
    addItem: function(data){
        var itemCtrl = new control(this.listContainer,{bound:[0,0,"100%","100%"]});
        
        itemCtrl.getCanvas().css({height:"", width:"", position:"relative", marginTop:"10px" });
        
        var item = $("<div style='border-bottom:1px solid #888888;padding:10px 20px 10px 5px'><span style='font-size:14px;'>ICM "+data.icm+"</span></div>");
        itemCtrl.getCanvas().html(item);

        item.on("mouseover", () => {
            item.css({background :"#BBDEFB"});
        });
        item.on("mouseleave", () => {
            item.css({background :"white"});
		});
		
		itemCtrl.on("click", () => {
			this.container.icm = data.icm;
			this.container.toUser = data.touser;
			this.container.title.setCaption(data.touser);
			this.container.subtitle.setCaption(data.icm);
			this.refreshMsg(data.icm);
		});
        
		this.listContainer.getClientCanvas().animate({scrollTop: this.listContainer.getClientCanvas()[0].scrollHeight});
		
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
	}
});

window.control_msgSearchICM = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_msgSearchICM.prototype.parent.constructor.call(this, owner, options);
	this.className = "control_msgSearchICM";
	if (options !== undefined){
		this.updateByOptions(options);
        this.header = new panel(this, {bound:[0,0,"100%","50"], color:"#D32F2F"});
        this.backBtn = new control(this.header, {bound:[10,10, 25, 25]});
            this.backBtn.getCanvas().html("<i class='fa fa-arrow-left fa-2x' style='color:white'/>");
            this.backBtn.on("click", () =>{
                this.hide("slow");
                this.emit("backClick");
            });
		this.title = new label(this.header, {bound:[40,13, this.width - 60, 25], fontSize:16, caption:"New Chat", fontColor:"white"});
    }
    
    this.icm = new saiCBBL(this, {bound:[20,25 + 50, 350,30], caption:"ICM"});
        $("#" + this.icm.getFullId() + "_edit").css({height:"30px", fontSize:"14px", paddingRight:"20px"});
        $("#" + this.icm.getFullId() + "_label").css({background:"", fontSize:"14px", top :"7px"});
        $("#" + this.icm.getFullId() + "_rightlabel").css({fontSize:"14px", top :"7px"});
        this.icm.btn.css({top:"5px"});
    this.toUser = new saiCBBL(this, {bound:[20, 60 + 50, 350, 30], caption:"To User"});
        $("#" + this.toUser.getFullId() + "_edit").css({height:"30px", fontSize:"14px", paddingRight:"20px"});
        $("#" + this.toUser.getFullId() + "_label").css({background:"", fontSize:"14px", top :"7px"});
        $("#" + this.toUser.getFullId() + "_rightlabel").css({fontSize:"14px", top :"7px"});
        this.toUser.btn.css({top:"5px"});
    
    this.bStart = new button(this, {bound:[20,160, 350,30 ], caption:"<i class='fa fa-send' style='color:white'/>&nbsp;&nbsp;Start Send Message"});

    this.bStart.on("click", () => {
        this.emit("startMessaging", this.icm.getText(), this.toUser.getText());
    });

    this.icm.setServices(this.app.servicesBpc, "callServices",["financial_mantisChat","getListICM",["","","",0]],["icm","pekerjaan"],"","Daftar ICM");
    this.icm.on("change", () => {
        this.toUser.setText("");
        this.toUser.setServices(this.app.servicesBpc, "callServices",["financial_mantisChat","getListUser",["","","",0]],["useraccname","firstname"]," and b.icm = '"+ this.icm.getText() +"' ","Daftar User");
    } );
    
};

window.control_msgSearchICM.extend(window.control_containerControl);
window.msgSearchICM = window.control_msgSearchICM;
window.control_msgSearchICM.implement({
	draw: function(canvas){
		window.control_msgSearchICM.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		var self = this;
		nd.css({border:"", overflow:"hidden", background: this.color});
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
		window.control_msgSearchICM.prototype.parent.setWidth.call(this, data);
		if (this.ldate){
			
		}
	},
	setColor: function(color){
		this.getCanvas().css({background: color});
		this.color = color;
	},
	setCaption: function(title){
		this.title.setCaption(title);
	},
	

});

window.control_msgForm = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_msgForm.prototype.parent.constructor.call(this, owner, options);
    this.className = "control_msgForm";
    this.icm = "";
    this.toUser = "";
	if (options !== undefined){
		this.updateByOptions(options);
        this.header = new panel(this, {bound:[0,0,"100%","50"], color:"#BDBDBD"});
        this.header.getCanvas().css({overflow:"hidden"});
        this.title = new label(this.header, {bound:[10,10, this.width - 20, 25], fontSize:12, caption:"Chat user Info" });
        this.subtitle = new label(this.header, {bound:[10,30, this.width - 20, 60], caption:"ICM Number"});
        this.bRefresh = new control(this.header, {bound:["100%",15,20,20]});
            this.bRefresh.getCanvas().html("<i class='fa fa-refresh fa-2x' style='left:-40px;position:absolute;'/>");
            this.bRefresh.on("click",() => {
                this.emit("refreshClick", this.icm, this.toUser);
            });
        this.container = new msgContainer(this, {bound:[0,50, "100%", this.height - 102]});
        this.container.getClientCanvas().css({overflow:"auto"});
        this.textContainer = new panel(this, {bound:[0,"100%","100%","50"], color:"#BDBDBD"});
            this.textContainer.getCanvas().css({overflow:""});
            this.textContainer.getClientCanvas().css({overflow:"hidden",top:"-50px",position:"absolute"});
            this.mMsg = new saiEdit(this.textContainer, {bound:[0,10, "100%", 30], text:"text to send"});
            $("#" + this.mMsg.getFullId() + "_edit").css({background:"transparent",border:"1px solid transparent",height:"30px", width:"100%", fontSize:"14px", paddingLeft:20, paddingRight:60,borderRadius:"10px"});
            $("#" + this.mMsg.getFullId() + "_edit").attr("placeholder","text to send");
            $("#" + this.mMsg.getFullId() + "_edit").on("mouseover",() => {
                $("#" + this.mMsg.getFullId() + "_edit").css({background:"transparent",border:"1px solid transparent"});
            });
            $("#" + this.mMsg.getFullId() + "_edit").on("focus",() => {
                $("#" + this.mMsg.getFullId() + "_edit").css({background:"transparent",border:"1px solid transparent"});
            });
            $("#" + this.mMsg.getFullId() + "_edit").on("mouseleave",() => {
                $("#" + this.mMsg.getFullId() + "_edit").css({background:"transparent",border:"1px solid transparent"});
            });
            $("#" + this.mMsg.getFullId() + "_edit").on("blur",() => {
                $("#" + this.mMsg.getFullId() + "_edit").css({background:"transparent",border:"1px solid transparent"});
            });
        
      
        $("#" + this.mMsg.getFullId() + "_edit").on("keydown",(e) =>{
            if (e.keyCode == 13){
                this.emit("sendClick", this.icm, this.toUser, this.mMsg.getText());
            }
        });
        
        this.bSend = new control(this.textContainer, {bound:["100%",15,20,50]});
            this.bSend.getCanvas().html("<i class='fa fa-paper-plane-o fa-2x' style='left:-40px;position:absolute;color:#1976D2'/>");
            this.bSend.on("click",() => {
                this.emit("sendClick", this.icm, this.toUser, this.mMsg.getText());
            });
	}
	
};

window.control_msgForm.extend(window.control_containerControl);
window.control_msgForm.implement({
	draw: function(canvas){
		window.control_msgForm.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		var self = this;
		nd.css({borderBottom:"1px solid #dedede", overflow:"hidden", background: this.color});
		nd.css({  overflow : "hidden", cursor:"pointer" });
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
    doAfterResize: function(w,h){
        console.log("Msg Form DoAfterReize " + w +"::"+h);
        if (this.container){
            this.container.setHeight(h - 102);
        }
    },
	setWidth: function(data){
		window.control_msgForm.prototype.parent.setWidth.call(this, data);
		if (this.bRefresh){
			this.bRefresh.setLeft(data - 30);
		}
	},
	setColor: function(color){
		this.getCanvas().css({background: color});
		this.color = color;
	},
	setCaption: function(title, subtitle){
		this.title.setCaption(title);
		this.subtitle.setCaption(subtitle);
		
    },
    addItem: function(item, isSender){
        var itemCtrl = new control(this.container,{bound:[0,0,"100%","100%"]});
        
        itemCtrl.getCanvas().css({height:"", width:"", position:"relative", marginTop:"10px" });
        
        var item = $("<div style='border:0.5px solid #A7A7A7;border-radius:10px;margin-left:5px;margin-right:5px;padding:20px 5px 20px 5px'>"+ item.msg +"</div>");
        itemCtrl.getCanvas().html(item);
		if (isSender){
			item.css({background :"#BBDEFB"});
		}else {
			item.css({background :"#BBDEFB"});
		}
        item.on("mouseover", () => {
            item.css({background :"#BBDEFB"});
        });
        item.on("mouseleave", () => {
            item.css({background :"white"});
        });
        //console.log(this.container.getClientCanvas().scrollTop +":"+this.container.getClientCanvas().scrollHeight);
        this.container.getClientCanvas().animate({scrollTop: this.container.getClientCanvas()[0].scrollHeight});
    }
	

});
window.control_msgContainer = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_msgContainer.prototype.parent.constructor.call(this, owner, options);
    this.className = "msgContainer";
    this.icm = "";
    this.toUser = "";
	if (options !== undefined){
		this.updateByOptions(options);
        
	}
	
};

window.control_msgContainer.extend(window.control_containerControl);
window.msgContainer = window.control_msgContainer;
window.control_msgContainer.implement({
	draw: function(canvas){
		window.control_msgContainer.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		var self = this;
		nd.css({borderBottom:"", overflow:"hidden", background: "white"});
		nd.css({position:"relative",  overflow : "hidden", cursor:"pointer" });
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:hidden}' ></div>";	    
		this.setInnerHTML(html, nd);
		var self = this;
		// nd.on("mouseover", function(e){
		// 	nd.css({background:"#eeeeee"});
		// });
		// nd.on("mouseout", function(e){
		// 	nd.css({background: self.color});
		// });
		nd.on("click", function(e){
			//self.onSelect.call(self, self.title.getCaption());
			self.emit("click", self.title.getCaption(), self);
		});
	},
	setWidth: function(data){
		window.control_msgContainer.prototype.parent.setWidth.call(this, data);
		if (this.bRefresh){
			this.bRefresh.setLeft(data - 30);
		}
	},
	setColor: function(color){
		this.getCanvas().css({background: color});
		this.color = color;
	},
	setCaption: function(title, subtitle){
		this.title.setCaption(title);
		this.subtitle.setCaption(subtitle);
		
	},
	

});

window.control_listItem = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_listItem.prototype.parent.constructor.call(this, owner, options);
	this.className = "listCustomView";

	if (options !== undefined){
		this.updateByOptions(options);
	}
	
};

window.control_listItem.extend(window.control_containerControl);
window.listItemControl = window.control_listItem;
window.control_listItem.implement({
	draw: function(canvas){
		window.control_listItem.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		var self = this;
		nd.css({borderBottom:"1px solid #dedede", overflow:"hidden", background: this.color});
		nd.css({ position:"relative", overflow : "hidden", cursor:"pointer",height:"" });
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%;overflow:hidden}' ></div>";	    
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
	setColor: function(color){
		this.getCanvas().css({background: color});
		this.color = color;
	},
	setCaption: function(title, subtitle){
		this.title.setCaption(title);
		this.subtitle.setCaption(subtitle);
		var id = this.subtitle.getFullId();
		$("#" + id + "_caption").css({whiteSpace: "nowrap", textOverflow: "ellipsis",  display: "inline-block", overflow: "hidden"});
	}
});

