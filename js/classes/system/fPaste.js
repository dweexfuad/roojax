window.system_fPaste = function(owner,lokasi)
{
	if (owner)
	{
		window.system_fPaste.prototype.parent.constructor.call(this, owner);
		this.setWidth(600);
		this.setHeight(400);
		this.centerize();
		this.setCaption("Paste Editor");
		
		this.className = "system_fPaste";
		
		this.mouseX = 0;
		this.mouseY = 0;					
		uses("saiMemo;saiUpload", true);
		this.uploader = new saiUpload(this, {bound:[10, 10, this.width - 20, 23]});
		this.editor = new saiMemo(this,{bound:[10,20,this.width - 20,this.height - 100],labelWidth:0, wrap:false});			
					
		this.b1 = new button(this, {bound:[this.width - 200,this.height - 50,80,20], caption:"OK", icon:"icon/ok.png", click:"doClick"});				
		this.b2 = new button(this, {bound:[this.width - 100,this.height - 50,80,20], caption:"Cancel", icon:"icon/cancel.png", click:"doClick"});		
		
			
		this.dblib = new util_dbLib();
		this.dblib.addListener(this);		
		
		this.rearrangeChild(20,23);
		//this.setTabChildIndex();
		uses("util_standar");
		this.standarLib = new util_standar();
		this.onClose.set(this,"doClose");
		system.addMouseListener(this);
		this.elokasi = lokasi;
		
	}
};
window.system_fPaste.extend(window.commonForm);
window.system_fPaste.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div id='"+n+"_frame' style='{border:1px #ffffff solid;background:#fff;position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
					"<div id = '"+n+"_header' style='{position:absolute;background:#999;"+
					"left: 0; top: 0; height: 23; width: 100%;cursor:pointer;color:#ffffff}' "+
					"onMouseDown='system.getResource("+this.resourceId+").eventMouseDown(event)' "+
					"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
					"onMouseUp='system.getResource("+this.resourceId+").eventMouseUp(event)' "+
					" > </div>"+							
					"<div id = '"+n+"form' style = '{position:absolute;"+
					"left: 0; top: 23; height: 100%; width: 100%;}'"+
					"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
					"> </div>"+
				"</div>";				
		this.setInnerHTML(html,canvas);
		this.header = $("#"+n+"_header");
		this.frameElm = $("#"+n +"_frame");
		canvas.bind("mouseup",{resId:this.resourceId}, function(event){
			$$$(event.data.resId).frameElm.show();
			$$$(event.data.resId).isClick = false;
		});
		canvas.css({background:"rgba(255,255,255,0.8)",boxShadow:"0px 10px 20px #888"});
	},
	doAfterResize: function(event){
		this.p1.setWidth(this.width - 40);
		this.p1.setHeight(this.height - 80);
		if (this.b1){
			this.b1.setTop(this.height - 50);
			this.b1.setLeft(this.width - 200);
			
			this.b2.setTop(this.height - 50);
			this.b2.setLeft(this.width - 120);
		}
	},
	setWidth: function(data){
		window.system_fPaste.prototype.parent.setWidth.call(this, data);
		
	},
	setHeight: function(data){
		window.system_fPaste.prototype.parent.setHeight.call(this, data);
		this.getClientCanvas().css({height:data-23});
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.system_fPaste.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
		if (this.isClick)
		{		
			var newLeft = this.left + (x - this.mouseX);
			var newTop = this.top + (y - this.mouseY);
		
			this.setLeft(newLeft);
			this.setTop(newTop);
		
			this.mouseX = x;
			this.mouseY = y;				
		}
	},
	eventMouseDown: function(event){	
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
		
		this.isClick = true;
		this.frameElm.hide();
	},
	eventMouseUp: function(event){
		this.isClick = false;
		this.frameElm.show();
	},
	eventMouseMove: function(event){
		if (this.isClick)
		{
			var x = event.clientX;
			var y = event.clientY;
			var newLeft = this.left + (x - this.mouseX);
			var newTop = this.top + (y - this.mouseY);
		
			this.setLeft(newLeft);
			this.setTop(newTop);
		
			this.mouseX = x;
			this.mouseY = y;
		}
	},
	doClick: function(sender){
		try		
		{
			system.delMouseListener(this);				
			this.onModal = false;
			this.close();
			var app = this.getApplication();
			app.setActiveForm(app._mainForm);
			
			if (sender == this.b2){				
				return;
			}						
			if (this.requester != undefined){											
				this.requester.doSystemPaste(this.editor.getText());
			}			
		}catch(e){
			alert(e);
		}
	},
	setCaption: function(data){
		var caption = $("#"+this.getFullId() + "_header");
		caption.html("<span style='{align:center;position:absolute;left:25; top: 4;width:100%; height:100%;color:#ffffff; }'>"+data+"</span>");
	},
	show: function(requester){
		window.system_fPaste.prototype.parent.show.call(this);
		this.requester = requester;
	},
	hide: function(){
		this.setVisible(false);
		if (this.formRequester != undefined)
		{
			this.app.setActiveForm(this.app._mainForm);
		}
	},
	doClose: function(sender){
		system.delMouseListener(this);
	}
});
