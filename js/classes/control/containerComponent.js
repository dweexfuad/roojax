//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_containerComponent = function(owner){
    if (owner)
    {
        window.control_containerComponent.prototype.parent.constructor.call(this, owner);
        this.className = "control_containerComponent";        
        this.childs = new control_arrayMap();		
		this.isContainer = true;
    }
};
window.control_containerComponent.extend(window.control_component);
window.containerComponent = window.control_containerComponent;
//---------------------------- Function ----------------------------------------
window.control_containerComponent.implement({
	addChild: function(child){	
		try{
			if (child instanceof control_component)
				this.childs.objList[child.getResourceId()] =  child.getResourceId();
		}catch(e){
			alert("componentContainer add Child "+e);
		}
	},
	delChild: function(child){
		if (child instanceof control_component)
			this.childs.del(child.getResourceId());
	},
	clearChild: function(){
	   try{
    		var child = undefined;
    	    for (var i in this.childs.objList)
    	    {
    	        child = window.system.getResource(i);
    
    	        if (child instanceof control_component)
    	            child.free();
    	    }
    
    	    this.childs.clear();
        }catch(e){
            error_log(this+"$clearChild()"+e);
        }
	},
	free: function(){
	    this.clearChild();
	    window.control_containerComponent.prototype.parent.free.call(this);
	},
	isHasChild: function(){	   
		var result = false;    
	    for (var i in this.childs.objList)
	    {
	        result = true;
	        break;
	    }
	    
	    return result;
	}
});
