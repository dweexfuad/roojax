//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_listCustomView = function(owner, options){
	this.itemWidth = 100;
	this.color = "#F0F9EF";
	window.control_listCustomView.prototype.parent.constructor.call(this, owner, options);
	this.className = "listCustomView";
	this.items = new control_arrayMap();
	this.selectedId = undefined;
	this.onSelect = new control_eventHandler();
	this.onDblClick = new control_eventHandler();
	this.itemView = 5;
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.color !== undefined) this.setColor(options.color);						
		if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);				
		if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);				
	}
};
window.control_listCustomView.extend(window.control_containerControl);
window.listCustomView = window.control_listCustomView;
window.control_listCustomView.implement({
	draw: function(canvas){
		window.control_listCustomView.prototype.parent.draw.call(this, canvas);
		var n = this.getFullId();
	    var html = "";    
		var nd = this.getCanvas();
		nd.css({ overflow : "hidden" , border: "1px solid #dedede"});
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:hidden}' ></div>";	    
		this.setInnerHTML(html, nd);				
		
	}
	
});
