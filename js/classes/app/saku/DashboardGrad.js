
window.app_saku_DashboardGrad = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.app_saku_DashboardGrad.prototype.parent.constructor.call(this, owner, options);
	this.className = "listCustomView";
    this.color = ["#e66465", "#9198e5"];
	//#30CFD0 , #330867 --> hijau
	//
	
	if (options !== undefined){
		this.updateByOptions(options);
		this.nodeIconContainer = $("<div style='position:absolute;left:0px;height:100%;display:flex;align-items:center;justify-content:flex-end;width:100%;'></div>");
        this.nodeTitle = $("<div style='position:absolute;top:10px;font-size:14px;left:20px;color:#ffffff;'></div>");
		this.nodeSubtitle = $("<div style='position:absolute;top:40px;left:20px;color:#ffffff;font-size:24px'></div>");
		this.nodeSubtitle2 = $("<div style='position:absolute;top:70px;left:20px;color:#ffffff;font-size:14px'></div>");
		this.getCanvas().append(this.nodeIconContainer);
		this.getCanvas().append(this.nodeTitle);
		this.getCanvas().append(this.nodeSubtitle);
		this.getCanvas().append(this.nodeSubtitle2);
		this.getCanvas().css({borderRadius:"10px",boxShadow:"0px 3px 10px #adadad", background:"#e66465",cursor:"pointer",
							  background:"linear-gradient(45deg,#e66465, #9198e5)"});
        if (options.color) this.setColor(options.color);
        if (options.title) this.setTitle(options.title[0], options.title[1]);
        this.getCanvas().on("mouseover",() => {
            this.getCanvas().css({boxShadow:"0px 10px 20px #888"});
        });
        this.getCanvas().on("mouseleave",() => {
            this.getCanvas().css({boxShadow:"0px 3px 10px #adadad"});
        });
	}
	
};

window.app_saku_DashboardGrad.extend(window.control_control);
window.DashboardGrad = window.app_saku_DashboardGrad;
window.app_saku_DashboardGrad.implement({
    doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' ></div>";
        this.setInnerHTML(html, canvas);
	},
	setColor: function(color){
		this.getCanvas().css({borderRadius:"10px",boxShadow:"0px 3px 10px #adadad", background:color[0],
							  background:"linear-gradient(45deg,"+color[0]+", "+color[1]+")"});
		this.color = color;
	},
	setTitle: function(title, icon){
        this.nodeTitle.html("<center><b>"+ title +"</b></center>");
        this.nodeIconContainer.html(icon);
    },
    setValue: function(value, value2){
        this.nodeSubtitle.html(value);
        this.nodeSubtitle2.hide();
        if (value2){
            this.nodeSubtitle2.show();
            this.nodeSubtitle2.html(value2);
        }
    }

});
