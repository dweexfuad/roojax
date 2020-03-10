//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_listDropDown= function(owner)
{
	if (owner)
	{
		this.itemWidth = 200;
		window.control_listDropDown.prototype.parent.constructor.call(this, owner);
		this.className = "control_listDropDown";		
		this.color = "#F0F9EF";
		this.className = "listDropDownBox";
		this.items = new control_arrayMap();
        this.itemHeight = 5;
        this.sg = new saiGrid(this, {bound:[10,10,200,200], colCount: 2, colTitle:[{
                                title:"Kode", width:100, readOnly:true}, {title:"Uraian", width:250, readOnly:true},

                            ], pasteEnable:false},);
        var self = this;
        
        this.sg.on("cellclick", function(sender, col, row, data, id){
            self.emit("dblClick", col, row, data[0], data);
        });

	}
};
window.control_listDropDown.extend(window.control_commonForm);
window.listDropDown = window.control_listDropDown;
window.control_listDropDown.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
	                    "<div id='"+n+"form' style='{position:relative; left:0;top:0;width:"+this.itemWidth+"px;height:100%;"+
						"cursor: pointer;background:#fff;"+
						"border-top: " + window.system.getConfig("3dborder.inner.bottom") + ";"+
						"border-right: " + window.system.getConfig("3dborder.inner.left") + ";"+
						"border-bottom: " + window.system.getConfig("3dborder.inner.top") + ";"+
						"overflow:auto;}' > </div>"+
						"</div>";
		this.setInnerHTML(html, canvas);
		
	},
	eventDblClick: function(event, itemId){
		try{
			error_log("enter click")
			this.hide();
			this.close();
			this.onDblClick.call(this, this.selectedItem[0],this.selectedItem[1]);		
			if (this.linkCtrl) this.linkCtrl.setFocus();
			this.emit("dblClick", this.selectedItem[0],this.selectedItem[1]);
		}catch(e){
			error_log(e);
		}
	},
	setWidth: function(data){
		try{
			window.control_listDropDown.prototype.parent.setWidth.call(this, data);	
			$("#"+this.getFullId() + "form").css({ width : data});   
            this.sg.setWidth(data - 20);
			this.setShadow();
		}catch(e){
			error_log("[control_listDropDown]::setWidth:"+e);
		}
	},
	setHeight: function(data){
		window.control_listDropDown.prototype.parent.setHeight.call(this, data);	    
        $("#"+this.getFullId() + "form").css({ height : data });
        this.sg.setHeight( data - 50);
	},
	show: function(){
        window.control_listDropDown.prototype.parent.show.call(this);
        this.setShadow({type:"middle"});	    
	},
	doLostFocus: function(){
		window.control_listDropDown.prototype.parent.doLostFocus.call(this);
		this.setVisible(false);
	},
    setCtrl : function(ctrl){
        this.linkCtrl = ctrl;
    },
    setData: function(data){
        this.sg.setData(data,true,50);

    }
});
