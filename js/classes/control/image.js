//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_image = function(owner, options){
	window.control_image.prototype.parent.constructor.call(this, owner, options);
	this.className = "control_image";
	this.filePath = "";
	this.onClick = new control_eventHandler();
	this.hint = "image";        
	this.showHint = false;
	this.autoView = false;	
	this.viewType = 0;	
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.color) this.setColor(options.color);
		if (options.showHint) this.setShowHint(options.showHint);						
		if (options.image) this.setImage(options.image);						
		if (options.border) this.setBorder(options.border[0],options.border[1]);				
		if (options.autoView) this.setAutoView(options.autoView);				
		if (options.proportional !== undefined) this.setProportional(options.proportional);			
		if (options.click) {
                if (typeof options.click == "string")
                    this.onClick.set(this.getTargetClass(),options.click);
                 else if (this.onClick.isFunction(options.click))
					this.onClick.set(undefined, options.click);
                else this.onClick.set(options.click[0],options.click[1]);	
        }
        
	}
};
window.control_image.extend(window.control_control);
window.image = window.control_image;
window.control_image.implement({
	doDraw: function(canvas){
		var html = "<div id ='"+ this.getFullId() +"_container' style='position:absolute;left:0;top:0;width:100%;height:100%;;' "+
					//" onMouseOver='system.getResource("+this.resourceId+").doMouseOver(event);' "+
					"></div>";
		this.setInnerHTML(html, canvas);
		this.cnv = $("#"+this.getFullId() +"_container");
		canvas.bind("click",setEvent("$$$(" + this.resourceId + ").doClick(event);"));
		canvas.bind("mousemove",setEvent("$$$(" + this.resourceId + ").doMouseOver(event);"));
		canvas.bind("mouseout",setEvent("$$$(" + this.resourceId + ").doMouseOut(event);"));

	},
	setImage: function(data, iframe, withoutHeight){
		try{
			this.filePath = data;	
			var canvas = this.cnv;
			if (canvas != undefined){	
				if (withoutHeight){
					if (iframe == undefined)
						canvas.html("<img id='"+this.getFullId()+"_img' width='100%' src='"+data+"' "+			
							"style='position:absolute;left:0;top:0;width:100%;cursor:' />" );
					else canvas.html( "<iframe id='"+this.getFullId()+"_img' width='100%' src='"+data+"' frameborder='0' "+			
							"style='position:absolute;left:0;top:0;width:100%;height:100%;' />" );
				}else {
					if (iframe == undefined)
						canvas.html("<img id='"+this.getFullId()+"_img' width='100%' height='100%' src='"+data+"' "+			
							"style='position:absolute;left:0;top:0;width:100%;height:100%;cursor:' />" );
					else canvas.html( "<iframe id='"+this.getFullId()+"_img' width='100%' height='100%' src='"+data+"' frameborder='0' "+			
							"style='position:absolute;left:0;top:0;width:100%;height:100%;' />" );
				}
				
			}
			this.img = $("#"+this.getFullId()+"_img").get(0);
			this.setProportional(0);			
			
		}catch(e){
			alert(e);
		}
	},
	setBorder: function(width, color){
		this.getCanvas().css({border : width +" solid "+ color});		
		width = parseInt(width);		
		this.img.css({width : document.all ? this.width - (width * 2): this.width, 
					  height : document.all ? this.height - (width * 2):this.height });		
	},
	setColor: function(data){
		var canvas = this.getCanvas();
		if (canvas != undefined)	
			canvas.css({background : data });
	},
	doClick: function(event){
		this.onClick.call(this);
	},
	doMouseOver: function(event){
	    try{
	    	if (this.showHint)
    			window.system.showHint(event.clientX, event.clientY, this.hint, true);
        }catch(e){
            error_log(e);
        }	
	},
	
	doMouseOut: function(event){
		try{
			window.system.hideHint();	
		}catch(e){
			error_log(e);
		}

	},
	setShowHint: function(data){
		this.showHint = data;
	},
	setWidth: function(data){
		window.control_image.prototype.parent.setWidth.call(this, data);	
		if (this.img !== undefined){
			this.img.attr("width" , data );
			this.img.css({width : data });
		}		
	},
	setHeight: function(data){
		window.control_image.prototype.parent.setHeight.call(this, data);	
		if (this.img !== undefined){
			this.img.attr('height' , data );
			this.img.css({height : data });
		}	
	},
	setProportional: function(data){
		this.viewType = data;
		if (data == 1){//proportional
			//this.img = $(this.getFullId()+"_img");
			var sH = this.height / this.img.naturalHeight;
			var sW = this.width / this.img.naturalWidth;					
			if (sH < sW) {
				this.img.attr('height' , data );
				this.img.attr('width' , Math.round(this.img.naturalWidth * sH) );
				this.img.css({height : this.height, width : Math.round(this.img.naturalWidth * sH) });
			} else {				
				this.img.attr('width' , this.width );
				this.img.attr('height', Math.round(this.img.naturalHeight * sW) );
				this.img.css({ width : this.width, height : Math.round(this.img.naturalHeight * sW) });
			}		
		}else{	//stretch
			this.img = $("#"+this.getFullId()+"_img");
			this.img.css({ 'height' :this.height , width : this.width });
			this.img.attr('height', this.height);
			this.img.attr('width' , this.width );
		}	
	},
	showActualSize: function(){	
		try{
			var app = this.getApplication();
			if (app.imgLoader == undefined || (system.getResource(app.imgLoader.resourceId) == undefined ) ){		
				uses("control_imageLoader");
				app.imgLoader = new control_imageLoader(app);				
			}								
			app.imgLoader.setImage(this.filePath);			
			app.imgLoader.fade();
			app.imgLoader.showModal();
		}catch(e){
			systemAPI.alert(e);
		}
	},
	setAutoView: function(data){
		this.autoView = data;
	},
	setViewLup: function(data){	
		var img = this.img;		
		if (img == undefined) return;
		if (data)
			img.css({cursor : "url(image/cursor.gif), default" });	
		else img.css({ cursor : "default" }); 	
	},
	setCursor: function(data){
		var img = this.getCanvas();		
		img.css({cursor : data });	
	}
});
