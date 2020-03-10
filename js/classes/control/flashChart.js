//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_flashChart = function(owner, options){	
	try
	{
		window.control_flashChart.prototype.parent.constructor.call(this,owner, options);
		this.className = "control_flashChart";							
		this.flashId = this.getFullId()+"_flash";		
		this.onObjectReady = new control_eventHandler();		
		this.loaded = false;
		this.ready = false;
		this.loadFlash("swf/open-flash-chart.swf");			
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.resourceOwner) this.resourceOwner = options.resourceOwner;
			if (options.flashId) this.flashId = options.flashId;
			if (options.params) this.params = options.params;
			if (options.title) this.title = options.title;
			if (options.objectReady) this.onObjectReady.set(options.objectReady[0],options.objectReady[1]);
		}		
	}catch(e){
		alert("initFlash " + e);
	}
};
window.control_flashChart.extend(window.control_control);
window.flashChart = window.control_flashChart;
window.control_flashChart.implement({
	doDraw: function(canvas){
		var html = "<div id='"+this.getFullId() +"_swf' stlye='width:100%;height:100%;border:1px solid #ff9900'></div>";					
		canvas.innerHTML = html;
	},
	loadFlash : function(flash){
		try{
			var obj = $(this.getFullId() +"_swf");	
			this.so = new SWFObject(flash, this.flashId, "100%", "100%", "9.0.0", "#999999");			
			this.so.addParam("wmode","transparent");
			this.so.addParam("quality","high");
			this.so.addVariable("resId",this.resourceId);
			this.so.addVariable("resourceOwner",this.resourceOwner);
			if (this.params !== undefined){
				for (var i in this.params) this.so.addVariable(i,this.params[i]);
			}
			this.so.useExpressInstall("classes/app/officeair/swf/playerProductInstall.swf");
			this.so.write(this.getFullId()+"_swf");
			//this.so,{resId:this.resourceId,resourceOwner:this.resourceOwner},{wmode:"transparent",quality:"high"},{id:this.flashId,name:this.flashId});
		}catch(e){
			alert("loading flash "+e);
		}
	},
	getObject: function(){
		return systemAPI.getFlexApp(this.flashId);
	},
	objectReady: function(){	   
		this.ready = true;
		this.loaded = false;
		this.onObjectReady.call(this);
		this.refresh();
    },
	setChartData: function(data, autoRefresh){
		this.chartData = data;
		this.loaded = false;		
		if (autoRefresh === undefined || autoRefresh) this.refresh();
	},
	refresh: function(){		
		if (this.chartData !== undefined && !this.loaded && this.ready){
			this.getObject().load( JSON.stringify(this.chartData) ); 
			this.loaded = true;
		}
	}
});
