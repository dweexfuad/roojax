window.control_listItemFileControl = function( owner, options){
	this.itemWidth = 100;
	this.color = "#FFFFFF";
	window.control_listItemFileControl.prototype.parent.constructor.call(this, owner, options);
	this.className = "listCustomView";
	
	if (options !== undefined){
		this.updateByOptions(options);
		this.title = new label(this, {bound:[10,10, this.width - 20, 25], fontSize:12 });
		this.subtitle = new label(this, {bound:[10,30, this.width - 20, 60], fontSize:10});
		this.subtitle.getCanvas().css({whiteSpace:"normal",textOverflow:"ellipsis"});
		this.bOpen = new button(this, {bound:[this.width - 110,10, 100, 25], caption:"Open"});
		if (options.caption) this.setCaption(options.caption[0], options.caption[1]);
		
	}
	
};

window.control_listItemFileControl.extend(window.control_containerControl);
window.listItemFileControl = window.control_listItemFileControl;
window.control_listItemFileControl.implement({
	draw: function(canvas){
		window.control_listItemFileControl.prototype.parent.draw.call(this, canvas);
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
	setCaption: function(title, subtitle){
		this.title.setCaption(title);
		this.subtitle.setCaption(subtitle);
	}

});