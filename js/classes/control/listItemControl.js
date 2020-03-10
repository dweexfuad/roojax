
window.control_listItemControl = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_listItemControl.prototype.parent.constructor.call(this, owner, options);
	this.className = "listCustomView";
	this.items = new control_arrayMap();
	this.selectedId = undefined;
	this.onSelect = new control_eventHandler();
	this.onDblClick = new control_eventHandler();

	if (options !== undefined){
		this.updateByOptions(options);
		this.title = new label(this, {bound:[10,10, this.width - 20, 25], fontSize:12 });
		this.subtitle = new label(this, {bound:[10,30, this.width - 20, 60], fontSize:11});
		this.ldate = new label(this, {bound:[this.width - 110,10, 100, 25], alignment: "right"});
		this.nilai1 = new label(this, {bound:[10,60, this.width, 25], alignment: "left"});
		this.nilai2 = new label(this, {bound:[0,60, this.width - 10, 25], alignment: "right"});
		if (options.caption) this.setCaption(options.caption[0], options.caption[1], options.caption[2], options.caption[3],  options.caption[4]);
		if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);				
		if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);				
	}
	
};

window.control_listItemControl.extend(window.control_containerControl);
window.listItemControl = window.control_listItemControl;
window.control_listItemControl.implement({
	draw: function(canvas){
		window.control_listItemControl.prototype.parent.draw.call(this, canvas);
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
	setColor: function(color){
		this.getCanvas().css({background: color});
		this.color = color;
	},
	setCaption: function(title, subtitle, date, nilai1, nilai2){
		this.title.setCaption(title);
		this.subtitle.setCaption(subtitle);
		this.ldate.setCaption(date);
		this.nilai1.setCaption(nilai1);
		this.nilai2.setCaption(nilai2);

		var id = this.subtitle.getFullId();
		$("#" + id + "_caption").css({whiteSpace: "nowrap", textOverflow: "ellipsis",  display: "inline-block", overflow: "hidden"});
	}

});
