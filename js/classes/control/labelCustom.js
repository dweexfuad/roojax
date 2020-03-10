window.control_labelCustom = function( owner, options){
	window.control_labelCustom.prototype.parent.constructor.call(this, owner, options);
	this.className = "labelCustom";
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.frame) this.frame = options.frame;
	}
};
window.control_labelCustom.extend(window.control_label);
window.labelCustom = window.control_labelCustom;
window.control_labelCustom.implement({
	doDraw: function(canvas){
		window.control_labelCustom.prototype.parent.doDraw.call(this, canvas);
		this.getCanvas().css({position:"relative", cursor:"pointer", borderBottom:"1px solid #dedede"});
		var cnv = this.getCanvas();
		//this.captionCanvas.css({display:"table",clear:"left"});
		cnv.on("mouseover", function(e){
			cnv.css({background:"#fefefe"});
		});
		cnv.on("mouseout", function(e){
			cnv.css({background:""});
		});
		
	},
	setCaption: function(text){
		window.control_labelCustom.prototype.parent.setCaption.call(this, text);
		this.captionCanvas.css({top: 10, left:10});

	}
});