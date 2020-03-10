window.app_saku_fMenuDetail = function(owner,modul)
{
	if (owner)
	{
		window.app_saku_fMenuDetail.prototype.parent.constructor.call(this, owner);
		window.app_saku_fMenuDetail.prototype.parent.setWidth.call(this, 300);
		window.app_saku_fMenuDetail.prototype.parent.setHeight.call(this, 400);
		
		this.centerize();
		
		this.className = "app_saku_fMenuDetail";
		
		this.mouseX = 0;
		this.mouseY = 0;			
		
		this.p1 = new panel(this,{bound:[20,10,this.width - 40,this.height - 100], color:"#dedede", shadow:true});						
		this.e0 = new saiLabelEdit(this.p1,{bound:[20,11,150,20],caption:"Kode"});				
		this.e1 = new saiLabelEdit(this.p1,{bound:[20,12,300,20],caption:"Nama"});						
		this.e2 = new saiCBBL(this.p1,{bound:[20,13,300,20],caption:"Program", 
					multiSelection : false,
                	sql:["select kode_form, nama_form from m_form ",["kode_form","nama_form"],false, ["Kode","Nama"],"where","Daftar Program",true]
            });						
		this.e3 = new saiCB(this.p1,{bound:[20,14,300,20],caption:"Icon", items:["-","table.png","pie.png","bar.png","line.png"]});						
						
		this.p1.rearrangeChild(20,23);
		this.b1 = new button(this,{bound:[this.width - 200,this.height - 50,80,20],caption:"Ok",icon:"icon/bOk2.png",click:"doClick"});				
		this.b2 = new button(this,{bound:[this.width - 100,this.height - 50,80,20],caption:"Cancel",icon:"icon/cancel.png",click:"doClick"});		
		this.setTabChildIndex();
		this.onClose.set(this,"doClose");
		system.addMouseListener(this);

	}
};
window.app_saku_fMenuDetail.extend(window.commonForm);
window.app_saku_fMenuDetail.implement({
	doDraw: function(canvas){
		var n = this.getFullId();	
		var html =  "<div id='"+n+"_frame' style='{border:1px #ffffff solid;background:#fff;position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
					"<div id = '"+n+"_header' style='{position:absolute;background:#0099cc;"+
					"left: 0; top: 0; height: 23; width: 100%;cursor:pointer;color:#ffffff}' "+
					"onMouseDown='system.getResource("+this.resourceId+").eventMouseDown(event)' "+
					"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
					"onMouseUp='system.getResource("+this.resourceId+").eventMouseUp(event)' "+
					" > </div>"+							
					"<div style='{position:absolute;"+
					"left: 377; top: 0; height: 23; width: 23;cursor:pointer;}' "+
					"onMouseDown='system.getResource("+this.resourceId+").eventMouseDown(event)' "+
					"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
					"onMouseUp='system.getResource("+this.resourceId+").eventMouseUp(event)' "+
					"></div>"+				
					"<div id = '"+n+"form' style = '{position:absolute;"+
					"left: 0; top: 23; height: 100%; width: 100%;}'"+
					"onMouseMove='system.getResource("+this.resourceId+").eventMouseMove(event)' "+
					"> </div>"+
					"</div>";				
		this.setInnerHTML(html,canvas);
		this.frameElm = $("#"+n +"_frame");
		canvas.bind("mouseup",{resId:this.resourceId}, function(event){
			$$$(event.data.resId).frameElm.show();
			$$$(event.data.resId).isClick = false;
		});
		//$("#"+ n +"_header").shadow("raised");
		canvas.shadow("raised");
	},
	doAfterResize: function(event){
		this.p1.setWidth(this.width - 40);
		this.p1.setHeight(this.height - 80);
		
		this.b1.setTop(this.height - 50);
		this.b1.setLeft(this.width - 200);
		
		this.b2.setTop(this.height - 50);
		this.b2.setLeft(this.width - 120);
	},
	doSysMouseDown: function(x, y, button, buttonState){	
		window.app_saku_fMenuDetail.prototype.parent.doSysMouseDown.call(this,x, y, button, buttonState);
	},
	doSysMouseUp: function(x, y, button, buttonState){	
		window.app_saku_fMenuDetail.prototype.parent.doSysMouseUp.call(this,x, y, button, buttonState);
	},
	doSysMouseMove: function(x, y, button, buttonState){
		window.app_saku_fMenuDetail.prototype.parent.doSysMouseMove.call(this,x, y, button, buttonState);
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
		try{
			if (sender == this.b1)
				this.modalResult = mrOk;
			else this.modalResult = mrCancel;
			var value = this.e0.getText() + ";" + this.e1.getText()+ ";" + this.e2.getText()+ ";" + this.e3.getText();
			this.formRequester.doModalResult(this.event, this.modalResult, value);
			this.close();
		}catch(e){
			error_log(e);
		}
	},
	doRequestReady: function(sender, methodName, result){
	},
	findBtnClick: function(sender){
	},
	setCaption: function(data){
		var caption = $("#"+this.getFullId() + "_header");
		caption.html("<span style='{align:center;position:absolute;left:25; top: 4;width:100%; height:100%;color:#ffffff; }'>"+data+"</span>" );
	},
	setItemParent: function(data){
		this.itemParent = data;
	},
	setSummaryItems: function(data){
		this.e4.clearItem();	
		for (var i in data)
			this.e4.addItem(i, data[i]);	
	},
	doClose: function(sender){
		system.delMouseListener(this);
	},
	setItemParent: function(data){
		this.itemParent = data;
	}
});
