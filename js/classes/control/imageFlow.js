//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*  Thanks to http://imageflow.finnrudolph.de/, admiralguade. coverflow
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_imageFlow = function(owner,options){	
	window.control_imageFlow.prototype.parent.constructor.call(this,owner,options);	
	this.className = "control_imageFlow";
	this.interval = 5000;	
	this.enabled = false;
	this.opacity = 0;
	this.array_images = [];
	this.caption_id = "i1";
    this.new_caption_id = "";
    this.current = 0;
    this.target = 0;
    this.timer = 0;
    this.reflection_p = 0.5;	
	this.onItemsClick = new control_eventHandler();
	if (options !== undefined){
	   this.updateByOptions(options);
       if (options.color !== undefined )this.setColor(options.color);
       if (options.background !== undefined) this.setBackground(options.background);  
    }
};
window.control_imageFlow.extend(window.control_control);
window.imageFlow = window.control_imageFlow;
window.control_imageFlow.implement({
	doDraw: function(canvas){		
		canvas.style.cssText = "position:absolute;border:1px solid #cccccc;background:#ffffff;overflow:hidden";
		this.id =this.getFullId();
		var html ="<div id='"+this.id+"_images' style='{border:1px solid #cccccc;position:absolute;background:#f5f5f5;top:40;left:-1;width:100%;height:100%;overflow:hidden}'></div>"+
	            "<div id='"+this.id+"_caption' style='{position:absolute;top:275;left:10;width:100%;height:200}'></div>";
		this.setInnerHTML(html, canvas);
		this.canvas = canvas;	
		this.img_div = $(this.id+"_images");
		this.caption_div = $(this.id+"_caption");
	},
    step: function(){
    	switch (this.target < this.current-1 || this.target > this.current+1){
    		case true:
    			this.moveTo(this.current + (this.target-this.current)/3);
    			window.setTimeout(this.step, 50);
    			this.timer = 1;
    			break;    
    		default:
    			this.timer = 0;
    			break;
    	}
    },
    glideTo:function (x, new_caption_id){	
    	/* Animate gliding to new x position */
    	this.target = x;
    	if (this.timer == 0){
    		window.setTimeout(this.step, 50);
    		this.timer = 1;
    	}    
    	/* Display new caption */
    	this.caption_id = new_caption_id;
    	var caption = $(this.caption_id)
    	if (caption) this.caption_div.innerHTML = caption.innerHTML;
    },
    moveTo: function(x){
        this.current = x;
        var zIndex = this.max;
        
        /* Loop */
        for (var index = 0; index < this.max; index++)
        { 
        	var image = this.img_div.childNodes.item(array_images[index]);
        	var z = Math.sqrt(10000 + x * x)+100;
        	var xs = x / z * size + size;
        	
        	/* Get current image properties */
        	var img_h = image.height;
        	var img_w = image.width;
        	
        	/* Check source image format. Get image height minus reflection height! */
        	switch ((img_w + 1) > (img_h / (reflection_p + 1))) 
        	{
        		/* Landscape format */
        		case true:
        			var img_percent = 118;
        			break;
        
        		/* Portrait and square format */
        		default:
        			var img_percent = 100;
        			break;
        	}
        	
        	/* Process new image height and top spacing */
        	var new_img_h = (img_h / img_w * img_percent) / z * size;
        	var new_img_top = (images_width * 0.33 - new_img_h) + images_top + ((new_img_h / (reflection_p + 1)) * reflection_p);
        
        	/* Set new image properties */
        	image.style.left = xs - (img_percent / 2) / z * size + imageflow_left + "px";
        	image.style.height = new_img_h + "px";
        	image.style.width= "";
        	image.style.top = new_img_top + "px";
        
        	/* Set image layer through zIndex */
        	switch ( x < 0) 
        	{
        		case true:
        			zIndex++;
        			break;
        
        		default:
        			zIndex = zIndex -1;
        			break;
        	}
        	image.style.zIndex = zIndex;
        
        	x += 150;
        }
    },
/* Main function */
    refresh: function(){
        /* Change images div properties */
        var images_width = this.img_div.offsetWidth;
        var images_height = images_width * 0.33;
        this.img_div.style.height = images_height + "px";
        
        /* Change captions div properties */
        this.caption_div.style.top = this.img_div.offsetTop + images_height + "px";
        this.caption_div.style.width = images_width + "px";
        this.caption_div.innerHTML = $(this.caption_id).innerHTML;
        
        /* Cache global variables, that only change on refresh */
        this.imageflow_left = $("imageflow").offsetLeft;
        images_top = this.img_div.offsetTop;
        size = images_width * 0.5;
        this.max = this.img_div.childNodes.length;
        
        /* Cache correct node type indices in an array */
        var count=0;
        for (var index = 0; index < this.max; index++)
        { 
        	var image = this.img_div.childNodes.item(index);
        	if (image.nodeType == 1)
        	{
        		this.array_images[count] = index;
        		count++;
        	}
        }
        this.max = this.array_images.length;
        
        /* Display images in current order */
        this.moveTo(this.current);
    },
    /* JavaScript mouse wheel support */
    handle: function(delta) {
    	var caption_id_int = this.caption_id.substr(1);
    	caption_id_int = parseInt(caption_id_int);    
    	switch (delta > 0) 
    	{
    	case true:
    		if(this.target != 0)
    		{
    			this.target = this.target + 150;
    			this.new_caption_id = 'i' + (caption_id_int - 1);
    		}
    		break;
    
    	default:
    		if(caption_id_int < max)
    		{
    			this.target = this.target - 150;
    			this.new_caption_id = 'i' + (caption_id_int + 1);
    			break;
    		}
    	}
    	this.glideTo(this.target, this.new_caption_id);
    }
});
