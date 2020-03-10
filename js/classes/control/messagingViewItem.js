
window.control_messagingViewItem = function( owner, options){
	this.itemWidth = 100;
	this.color = "#F0F9EF";
	window.control_messagingViewItem.prototype.parent.constructor.call(this, owner, options);
	this.className = "messagingViewItem";
	
	if (options !== undefined){
		this.updateByOptions(options);
		this.image = new image(this, {bound:[5,5,50,50], rounded: true});
		this.cMessage = new panel(this, {bound:[60,5, this.width - 70, 60]});
		this.cMessage.getCanvas().css({border:"1px solid #eeeeee", borderRadius:"10px"});
		this.lFrom  = new label(this.cMessage, {bound:[5,5,200,20], caption:"Test", bold:true});
		this.ldate = new label(this.cMessage, {bound:[this.width - 70 - 130,5,120,20], caption:"Tgl"});
		this.lMessage = new label(this.cMessage, {bound:[5,30, this.width - 80, 50], caption: "Message"});
		
		if (options.message) this.setMessage(options.message[0],options.message[1],options.message[2],options.message[3] );
	}
	
};
window.control_messagingViewItem.extend(window.control_containerControl);
window.messagingViewItem = window.control_messagingViewItem;
window.control_messagingViewItem.implement({
	draw: function(canvas){
		window.control_messagingViewItem.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		nd.css({position:"relative", background:"#ffffff",overflow : "hidden", cursor:"pointer" });
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:hidden}' ></div>";	    
		this.setInnerHTML(html, nd);
		
	},
	setMessage: function(nik, message, tgl, nama){
		this.image.setImage("./foto/"+nik, undefined, true);
		this.image.getCanvas().css({overflow:"hidden", borderRadius:"25px"});
		this.lFrom.setCaption(nik );//;
		this.ldate.setCaption(tgl);
		this.lMessage.getCanvas().css({display:"table",clear:"left"});
		this.lMessage.captionCanvas.css({display:"table",clear:"left",height:"auto"});
		this.lMessage.setCaption(message);
		
		//console.log(this.lMessage.captionCanvas.height() +":"+this.lMessage.captionCanvas.scrollHeight +":"+this.lMessage.captionCanvas[0].scrollHeight );
		this.lMessage.setHeight(this.lMessage.captionCanvas.height());
		this.cMessage.setHeight(this.lMessage.captionCanvas.height() + 40);
		this.setHeight(this.cMessage.height + 10);
		var self = this;
		self.lFrom.setCaption(nik +" ( "+ nama +" ) ");

		//this.app.services.callServices("financial_RRA","getNamaFromNIK",[nik], function(data){
		//	self.lFrom.setCaption(nik +":"+data);//;
		//});
	}

});

