//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_frame = function(owner,options){
    if (owner){
        this.showBorder = true;
        this.bgColor = "#FFFFFF";
        this.title = "Title";        
        window.control_frame.prototype.parent.constructor.call(this, owner, options);
        this.className = "control_frame";		
		this.onAfterResize = new control_eventHandler();
        this.isMinimize = false;
		this.isMaximize = false;
		if (options !== undefined){
			this.updateByOptions(options);		
			if (options.pointPosition) this.setPointPosition(options.pointPosition);
			if (options.pointMode) this.setPointMode(options.pointMode);					
		}
    }       
};
window.control_frame.extend(window.control_containerControl);
window.control_frame.PM_UP = 0;
window.control_frame.PM_DOWN = 1;
window.control_frame.PM_LEFT = 2;
window.control_frame.PM_RIGHT = 3;
window.frame = window.control_frame;
//---------------------------- Function ----------------------------------------
window.control_frame.implement({
	doDraw: function(canvas){
		window.control_frame.prototype.parent.doDraw.call(this, canvas);	
		canvas.css({background:"#fff"});
	    var n = this.getFullId();
	    var html = "";    
		var nd = canvas;
	    html =  "<div id='" + n + "form' style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;overflow:auto}' ></div>"+
	    		"<div id='"+ n +"_point' style='position:absolute;left:0;top:0;width:28;height:17'> </div>";	    
		this.setInnerHTML(html, nd);				
		nd.bind("click",setEvent("$$$(" + this.resourceId + ").doCanvasClick(event);"));		
		nd.bind("mousedown",setEvent("$$$(" + this.resourceId + ").doMouseDown(event);"));		
		nd.bind("mouseup",setEvent("$$$(" + this.resourceId + ").doMouseUp(event);"));		
		canvas.shadow({radius:0});
		this.pointCnv = $("#"+n+"_point");

	},
	setPointPosition : function(point){
		this.pointPosition = point;
		this.update();
	},
	setPointMode: function(mode){
		this.pointMode = mode;
		this.update();
	},
	update: function(){
		try{
			switch (this.pointMode){
				case 0 : //up
					this.pointCnv.css({left : this.pointPosition,
										top : -20,
										width : 28,
										height : 17,
										background : "url(image/framePointUp.png)0 0 no-repeat" });
				break;
				case 1 : //down
					this.pointCnv.css({ left : this.pointPosition,
										top : this.height,
										width : 28,
										height : 17,
										background : "url(image/framePointDown.png)0 0 no-repeat" });
				break;
				case 2 : //left
					this.pointCnv.css({ top : this.pointPosition,
									left : -17,
									width : 17,
									height : 28,
									background : "url(image/framePointLeft.png)0 0 no-repeat" });
				break;
				case 3: //right
					this.pointCnv.css({ top : this.pointPosition,
										left : this.width,
										width : 17,
										height : 28,
										background : "url(image/framePointRight.png)0 0 no-repeat" });
				break;	
			}
		}catch(e){
			error_log(e);
		}
	},
	block: function(){

	},
	unblock: function(){
		
	}
	
});
