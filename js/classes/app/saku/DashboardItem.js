
window.app_saku_DashboardItem = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.app_saku_DashboardItem.prototype.parent.constructor.call(this, owner, options);
	this.className = "listCustomView";
    this.colorHeader = "#01a3a4";
    this.colorBg = "LAVENDER";
	
	if (options !== undefined){
		this.updateByOptions(options);
        this.mtsLogo = new control(this,{bound:[0,0,200,100]});
        this.mtsLogo.addStyle({overflow:"hidden"});
        this.mtsLogo.setShadow();
        this.nodeContainer = $("<div  style='position:absolute;width:170;height:320px;top:20px;padding:10px;background:LAVENDER;border: 1em solid transparent;overflow:auto'>"
                            +"<i class='fa fa-share ' style='margin-left:1px;font-size:48px;color:#1B1464' ></i>"+
                            "</div>");
        this.nodeTitle = $("<div style='position:absolute;height:20px;width:180;padding-left:10px;padding-right:10px;padding-top:10px;color:#ffffff;background:#1B1464;'></div>");
        this.mtsLogo.getCanvas().append(this.nodeContainer);
        this.mtsLogo.getCanvas().append(this.nodeTitle);
        this.mtsLogo.canvas.css({cursor:"pointer"});
        this.mtsIsi = new label(this, {bound:[80,55,50,30], fontColor:"black" ,caption:"<b>...<b>", bold: true, fontSize:17, visible:true});
        this.mtsIsi2 = new label(this, {bound:[150,80,50,30], fontColor:"black" ,caption:"<b>...<b>", fontSize:12, visible:true});
        this.mtsIsi.canvas.css({cursor:"pointer"});	
        if (options.color) this.setColor(options.color[0],options.color[1]);
        if (options.title) this.setTitle(options.title[0], options.title[1]);
        this.getCanvas().on("mouseover",() => {
            this.getCanvas().css({boxShadow:"0px 10px 20px #888"});
        });
        this.getCanvas().on("mouseleave",() => {
            this.getCanvas().css({boxShadow:"0px 0px 3px #adadad"});
        });
	}
	
};

window.app_saku_DashboardItem.extend(window.control_containerControl);
window.listItemControl = window.app_saku_DashboardItem;
window.app_saku_DashboardItem.implement({
    doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
	                    "<div id='"+n+"form' style='{position:relative; left:0;top:0;width:100%;height:100%;"+
						"cursor: pointer}' > </div>"+
						"</div>";
        this.setInnerHTML(html, canvas);
       
		
	},
	setColor: function(header, color){
        this.nodeTitle.css({background: header});
        this.nodeContainer.css({background: color});
		this.color = color;
	},
	setTitle: function(title, icon){
        this.nodeTitle.html("<center><b>"+ title +"</b></center>");
        this.nodeContainer.html(icon);
    },
    setValue: function(value, value2){
        this.mtsIsi.setCaption(value);
        this.mtsIsi2.hide();
        if (value2){
            this.mtsIsi2.show();
            this.mtsIsi2.setCaption(value2);
        }
    }

});
