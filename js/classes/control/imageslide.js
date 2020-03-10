//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_imageslide = function(owner,options){	
    this.bgColor = "#ffffff";
    this.background = "image/themes/dynpro/greygradient.png";
    if (options !== undefined){
        if (options.color !== undefined) this.bgColor = options.color;
        if (options.background !== undefined) this.background = options.background;
    }
	window.control_imageslide.prototype.parent.constructor.call(this,owner,options);	
	this.className = "control_imageslide";
	this.width = 300;
	this.height = 130;		
	this.items = [];
	this.page = 0;
	this.onItemClick = new control_eventHandler();
	this.timer = new control_timer(this);
	this.timer.setInterval(100);
	this.timer.onTimer.set(this,"doTimer");
	this.timer.setEnabled(false);
	if (options !== undefined){
        this.updateByOptions(options);        
	}
};
window.control_imageslide.extend(window.control_control);
window.imageslide = window.control_imageslide;
window.control_imageslide.implement({
	doDraw: function(canvas){
		try{		
			var n = this.getFullId();					
			canvas.style.backgroundImage = "url("+this.background+")";			
			canvas.style.backgroundPosition = "bottom left";	
			canvas.style.backgroundRepeat = "repeat-x";
			canvas.style.backgroundColor = this.bgColor;		
			canvas.style.overflow = "hidden";
			var html = 	"<div id='"+ n +"_frame' style='{position:absolute;left:0;width:100%;height:100%;top:5;overflow:hidden;}'>"+
							"<div id='"+ n +"_cont' style='{position:absolute;left:0;width:auto;height:auto;top:0;}' "+
							" onmouseover='system.getResource("+this.resourceId+").mouseOver(event);'"+
							" onmouseout='system.getResource("+this.resourceId+").mouseOut(event);'"+
							"></div>"+					
						"<div>";
			this.setInnerHTML(html, canvas);
			this.cont = $(n+"_cont");		
			this.caption = $(n+"_caption");
			this.canvas = canvas;
		}catch(e){
			systemAPI.alert(this+"draw ImageSlider",e);
		}
	},
	imageload: function(event,id){
	   try{	       
           //if (curvyBrowser.isWebKit || curvyBrowser.isIE || curvyBrowser.isOp)
           {
                var target = curvyBrowser.isIE ? event.srcElement: event.target;
                var w = 132, h = 100, nw, nh;
                var img = $(id);                                 
                if (img.getAttribute("loaded")) return;
                if (curvyBrowser.isWebKit || curvyBrowser.isIE || curvyBrowser.isOp){                    
                    if (target.id != id){
                        nh = parseInt(target.height);
                        nw = parseInt(target.width);;
                        img.setAttribute("loaded",true);
                        target.style.display = "none";    
                    }else return;
                }else{
                    nh = img.naturalHeight;
        			nw = img.naturalWidth;		
        			img.setAttribute("loaded",true);
                }                
                var sH = w / nh;
    			var sW = h / nw;		
    			if (sH < sW) {
    				img.height = h;
    				img.width = Math.round(nw * sH);
    				img.style.height = h;
    				img.style.width = Math.round(nw* sH);
    			} else {
    				img.width = w;
    				img.height = Math.round(nh * sW);
    				img.style.width = w;
    				img.style.height = Math.round(nh * sW);
    			}		
    			img.style.top = Math.round(h / 2 - parseInt(img.style.height) / 2 + 10);
    			img.setAttribute("loaded",true);
    			if (!this.timer.enabled) this.timer.setEnabled(true);
           } 
       }catch(e){
            systemAPI.alert(this+"#imageload ",e);
       }
    },
	addItems: function(item, containt, shortDesc, containtKode){
	   try{
    		var html = "";
    		for (var i in item){
    			html += "<img width=132 height=100 src='" +item[i]+"' onload='window.system.getResource("+this.resourceId+").imageload(event,\""+ this.getFullId()+"_"+ i +"\");' title='"+containt[i]+"' id='"+ this.getFullId()+"_"+ i +"' style='position:absolute;top:"+(this.height / 2 - 50 - 10)+";cursor:pointer;left:"+( (i - 0) * 132 )+"' "+
    				"onclick='system.getResource("+this.resourceId+").doChildClick(\""+containt[i]+"\",\""+containtKode[i]+"\");'/>";
   				if (curvyBrowser.isIE || curvyBrowser.isWebKit || curvyBrowser.isOp)
                    html += "<img id='"+ this.getFullId()+"_"+ i +"tmp' src='" +item[i]+"' style='filter:alpha(opacity=0);opacity:0' onload='window.system.getResource("+this.resourceId+").imageload(event,\""+ this.getFullId()+"_"+ i +"\");'/>";
    		}			
    		this.cont.innerHTML = html;	        
    		this.index = 0;
    		this.leftItem = 0;
    		if (!curvyBrowser.isIE) this.timer.setEnabled(true);
    		this.items = item;    		
  		}catch(e){
  		    alert("add Items"+e);
        }
	},
	mouseOver: function(event){	
		this.timer.setEnabled(false);
	},
	mouseOut: function(event){	
		this.timer.setEnabled(true);
	},
	doTimer: function(sender){	
		if (this.leftItem < this.items.length * 132) this.leftItem += 1;
		else {	
			this.leftItem = 0;
			var lft = 0;
			var child = this.cont.firstChild;	
			while (child != undefined){
				child.style.left = lft * 132 ;
				lft++;
				child = child.nextSibling;
			}
		}
		var child = this.cont.firstChild;	
		while (child != undefined){
			child.style.left = parseInt(child.style.left) - 1;		
			child = child.nextSibling;
		}
		child = this.cont.firstChild;
		if (parseInt(child.style.left) == -132){
			var clone = child.cloneNode(true);
			this.cont.removeChild(child);
			clone.style.left = (this.items.length - 1) * 132;
			this.cont.appendChild(clone);
		}
	},
	doChildClick: function(child, childCode){		
		this.onItemClick.call(this, childCode, child);
	},
	doItemClick: function(event){	
		var target = document.all ? event.srcElement : event.target;
		if (target.nextSibling.style.display == "")
			target.nextSibling.style.display = "none";	
		else target.nextSibling.style.display = "";	
	},
	setCaption: function(data){	
		this.caption.innerHTML = data;
	},
	setBackground: function(data){	
		this.canvas.style.background = data;
	},
	setHeight: function(data){
		window.control_imageslide.prototype.parent.setHeight.call(this, data);		
		var node = $(this.getFullId() +"_frame");		
		if (node !== undefined) node.style.height = data;		
	},
	setWidth: function(data){
		window.control_imageslide.prototype.parent.setWidth.call(this, data);			
		var node = $(this.getFullId() +"_frame");
		if (node !== undefined) node.style.width = data;		
	}
});
