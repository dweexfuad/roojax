//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
 window.control_component = function(owner){
	if (owner)
	{
		try
		{				
			window.control_component.prototype.parent.constructor.call(this);				
            this.init();
			this.className = "control_component";				
			this.owner = owner;				
			this.name = "component";
			this.isContainer = false;
			if ((window.system != undefined) && (window.system.addResource != undefined))
				this.resourceId = window.system.addResource(this);
			else
				this.resourceId = getBasicResourceId();
			if (this.owner.isContainer)
				this.owner.addChild(this);	
			if (!(this instanceof system_system))
				this.app = this.getApplication();		
		}catch(e){
			systemAPI.alert("component:$contructor()", e);
		}
	}
};
window.control_component.extend(window.EventEmitter);
window.component = window.control_component;
//---------------------------- Function ----------------------------------------
window.control_component.prototype.toString = function(){
	return "[object " +this.className+"]";
};
window.control_component.implement({
    init : function()
	{
        window.control_component.prototype.parent.init.call(this);
    },
	free : function(){		
		try{
		    if (this.isContainer)
				this.clearChild();		
			if (this.getCanvas){	
				var cnv = this.getCanvas();		
				if (cnv !== null)
					cnv.remove();
			}			   
		    window.system.delResource(this.resourceId);				
			if (this.owner.isContainer)
		        this.owner.delChild(this);
		}catch(e){
			error_log(e);
		}
	},
	getResourceId:function(){
		return this.resourceId;
	},
	getName: function(){
		return this.compname;
	},
	setName: function(data){		
		this.name = data;		
		this.compname = data;				
	},
	getFullId: function(){
	    if (this.owner instanceof control_component)
	        return this.owner.getFullId() + "___" + this.resourceId;
	    else
	        return "systemform___" + this.resourceId;
	},
	getOwner: function(){
		return this.owner;
	},
	getApplication: function(){
		try{
		    var tmp = this.owner;
		    while ((tmp != undefined) && !(tmp instanceof control_application) && !(tmp instanceof system_system))		    
				tmp = tmp.getOwner();		    
		    if (tmp instanceof control_application)
		        return tmp;
		    else
		        return undefined;
		}catch(e){
			systemAPI.alert(this+"$getApplication()",e);
		}
	}
});
