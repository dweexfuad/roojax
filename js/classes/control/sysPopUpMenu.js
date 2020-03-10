//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_sysPopUpMenu= function( owner){
    this.className = "control_sysPopUpMenu";	
	window.control_sysPopUpMenu.prototype.parent.constructor.call(this, owner);    
    this.menuForm = undefined;
    this.target = undefined;
	this.isPopUp = false;	
	uses("control_sysMenuForm");
};
window.control_sysPopUpMenu.extend(window.control_containerComponent);
window.sysPopUpMenu = window.control_sysPopUpMenu;
window.control_sysPopUpMenu.implement({
	addChild: function(child){	
		if (this.menuForm == undefined)
		{  		
			var app = this.getApplication();
			this.menuForm = new control_sysMenuForm(app);				
			this.menuForm.requesterForm = this.requester;		   			
			this.menuForm.popUpObj = this;
		}	
	    if (child instanceof control_sysMenuItem)
	    {
	        window.control_sysPopUpMenu.prototype.parent.addChild.call(this, child);

	        if (this.menuForm != undefined)
	            this.menuForm.addItem(child);
	    }
	},
	popUp: function(x, y, pointMode){
	    if (this.menuForm != undefined)
	    {		
	        this.menuForm.popUp(x, y, pointMode);
			this.isPopUp = true;
	    }	
	},
	unPopUp: function(){
	    if (this.menuForm != undefined)
	    {		
	        this.menuForm.unPopUp();
			this.isPopUp = false;
	    }	
	},
	getTarget: function(){
		return this.target;
	},
	setTarget: function(data){
		this.target = data;
	}
});
