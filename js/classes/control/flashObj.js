//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_flashObj = function(owner, options){	
	try
	{
		window.control_flashObj.prototype.parent.constructor.call(this,owner, options);
		this.className = "control_flashObj";							
		this.flashId = this.getFullId()+"_flash";		
		this.onObjectReady = new control_eventHandler();
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.resourceOwner) this.resourceOwner = options.resourceOwner;
			if (options.flashId) this.flashId = options.flashId;
			if (options.params) this.params = options.params;
			if (options.flashFile) this.loadFlash(options.flashFile);			
			if (options.objectReady) this.onObjectReady.set(options.objectReady[0],options.objectReady[1]);
		}		
	}catch(e){
		alert(e);
	}
};
window.control_flashObj.extend(window.control_control);
window.flashObj = window.control_flashObj;
window.control_flashObj.implement({
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
			alert(e);
		}
	},
	getObject: function(){
		return systemAPI.getFlexApp(this.flashId);
	},
	objectReady: function(){	   
	   this.onObjectReady.call(this);
    }
});
