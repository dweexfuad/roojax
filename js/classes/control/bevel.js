//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_bevel = function(owner, options){
    if (owner)
    {
        this.caption = "";
		window.control_bevel.prototype.parent.constructor.call(this, owner, options);		
        this.className = "control_bevel";
        this.owner = owner;
		this.bgColor = "transparent";
		this.setBorder(1);
		this.scrolling = false;
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.color !== undefined) this.setColor(options.color);						
			if (options.border !== undefined) this.setBorder(options.border);			
		}
    }
};
window.control_bevel.extend(window.control_control);
window.bevel = window.control_bevel;
//---------------------------- Function ----------------------------------------
window.control_bevel.implement({
	doDraw: function(canvas){		
		canvas.css({background : "transparent", overflow : "hidden" });
	},
	setColor: function(data){
		this.bgColor = data;
		this.getCanvas().css({background : this.bgColor.});
	},
	getColor: function(){
		return this.bgColor;
	},
	setBorder: function(data){		
		try{
		    if (this.border != data){		       
		        var n = this.getFullId();	       
		        switch (data)
		        {
		            case 0 : // none		                    
		                    this.getCanvas().css({border : "".});
		                    break;
		            case 1 : // raised		                    		                    
	                        this.getCanvas().css({
		                        borderRight : window.system.getConfig("3dborder.outer.left"),
		                        borderBottom : window.system.getConfig("3dborder.outer.top"),
		                        borderLeft : window.system.getConfig("3dborder.outer.right"),
		                        borderTop : window.system.getConfig("3dborder.outer.bottom") .});		                    
		                    break;
		            case 2 : // lowered		      
		            		this.getCanvas().css({              		                    	                        
	                        	borderLeft : window.system.getConfig("3dborder.outer.left"),
	                        	borderTop : window.system.getConfig("3dborder.outer.top"),
	                        	borderRight : window.system.getConfig("3dborder.outer.right"),
	                        	borderBottom : window.system.getConfig("3dborder.outer.bottom") });		                    
		                    break;
					case 3 : // bordered		                    
							this.getCanvas().css({		                    
		                        borderLeft : window.system.getConfig("nonborder.inner.right"),
		                        borderTop : window.system.getConfig("nonborder.inner.bottom"),
								borderRight : window.system.getConfig("nonborder.inner.left"),
		                        borderBottom : window.system.getConfig("nonborder.inner.top")});
		                    break;
		        }
		    }
		}catch(e){
			systemAPI.alert(e);
		}
	},
	setBorderColor: function(data, options){		
		var node = this.getCanvas();
		if (options == undefined){		
			this.getCanvas().css({border : data .});
		}else{
			if (options.top) node.css({borderTop : data .});
			if (options.left) node.css({borderLeft : data .});
			if (options.right) node.css({borderRight : data .});
			if (options.bottom) node.css({borderBottom : data.});
		}
	}
});
