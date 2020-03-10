//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_pageControl = function(owner,options){
	window.control_pageControl.prototype.parent.constructor.call(this, owner,options);
	this.className = "control_pageControl";
	this.activePage = undefined;
	this.owner = owner;	
	this.onPageChange = new control_eventHandler();
	this.childPage = [];
	this.activePageIndex = -1;
	uses("control_childPage");
	this.headerCaption = [];
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.color !== undefined) this.setBGColor(options.color);
		if (options.pageChange != undefined) this.onPageChange.set(options.pageChange[0],options.pageChange[1]);
		if (options.childPage !== undefined){						
			for (var i in options.childPage)
				if (typeof options.childPage[i] == "string")
					this.childPage[this.childPage.length] = new control_childPage(this,{caption:options.childPage[i]},i);			
		}
	}
};
window.control_pageControl.extend(window.control_containerControl);
window.pageControl = window.control_pageControl;
window.control_pageControl.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var html =  "<div id='"+n+"_header' style='{position:absolute; left: 0;top: 0; width: 100%; height:20px;background:transparent;}'></div>"+
					"<div id='"+n+"form' style='{position:absolute; left: 0;top: 20; width: 100%; height:100%}' ></div>";
					
		this.setInnerHTML(html, canvas);
	},
	setWidth: function(data){
		window.control_pageControl.prototype.parent.setWidth.call(this, data);				
		this.getClientCanvas().css({width : data - 2 }); 	
	},
	setHeight: function(data){
		window.control_pageControl.prototype.parent.setHeight.call(this, data);	
		this.getClientCanvas().css({height : data - 22 }); 	
	},
	addChild: function(child){
		if (child instanceof control_childPage){
	        window.control_pageControl.prototype.parent.addChild.call(this, child);        
	        child.onChange.set(this, "pageChange");
	        this.addPage(child);
	        if (this.activePage == undefined){
    			this.setActivePage(child);
    			this.activePageIndex = 0;
    		}else this.deActivedPage(child);
    		this.rearrangeIndex();
	    }
	},
	getTextWidth : function(text)
		{
			if (this.app.tmpCanvas == null)
			{
				this.app.tmpCanvas = $("<span style='position:absolute;left:-2000px;top:-2000px;width:auto;height:auto'></span>");
				
				this.app.tmpCanvas.appendTo("body");
			}
			
			this.app.tmpCanvas.html(text);
			var tw = this.app.tmpCanvas.width() + 1; 
			//console.log("TextWidth " + text+"=" + tw +": ");
			return tw;
		},
	addPage: function(child){
		var left = 0;
	    var n = this.getFullId();

	    var node = $("#"+n + "_header");
	    
		n += "_" + child.getResourceId();
		
		var textWidth = this.getTextWidth(child.getCaption());
		
	    var html =  $("<div id='" + n + "' style='position: absolute;top: 0;height: 20;left:" + left + ";width: 86;cursor:pointer;border-left:1p solid #fff; border-top:1px solid #fff;border-right:1px solid #fff;background:#999' " +
	                        "onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event, " + child.getResourceId() + ");' " +
	                        "onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event, " + child.getResourceId() + ");' " +
	                        "onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event, " + child.getResourceId() + ");' " +
	                        ">" +
						"<div id='" + n + "_caption' style='white-space: nowrap;position: absolute;width: "+ textWidth +"px; height: 20px;left: 0;top: 0;font-family: Arial;font-size: 8pt;text-align: center;overflow: hidden;color:#ffffff'>" + child.getCaption() + "</div>" +
	                "</div>");

	    node.append(html);	    
	},
	delPage: function(child){
		if (child == undefined) child = system.getResource(this.activePage);
		var left = 0;
	    var n = this.getFullId();	
	    var node = $("#"+n + "_header");    
	    n += "_" + child.getResourceId();;
		var childHeader = $("#"+n);
		childHeader.remove();
		
		var childNode = node.first();       	
		while ((childNode != undefined) && (childNode != ""))
	    {
	        childNode.css({left : left });
			left += childNode.width()  - 10;
	        childNode = childNode.next();
	    }
		this.deActivedPage(child);
		this.childs.del(child.resourceId);
		child.free();
		this.activePage = undefined;
		var tmp;
		for (var i in this.childs.objList){
			tmp = i;
			break;
		}
		if 	(tmp != undefined) {
			child = system.getResource(tmp);
			this.setActivePage(child);
		}
	},
	setActivePage: function(child){
	    if (this.activePage != child.getResourceId())
	    {
	        var node = undefined;
	        var n =  undefined;
	        
	        var activePage = window.system.getResource(this.activePage);

	        if (activePage instanceof control_childPage)
	        {
	            this.deActivedPage(activePage);
	        }

	        this.activePage = child.getResourceId();

	        activePage = window.system.getResource(this.activePage);

	        if (activePage instanceof control_childPage)
	        {
	            n = this.getFullId() + "_" + activePage.getResourceId();
				$("#"+n).css({background:"#3BA4FF"});
				$("#"+n+"_caption").css({color : "#ffffff" });
				
				node = $("#"+n + "_caption");

	            if (node != undefined)
	                node.css({top : 2 });

	            activePage.setVisible(true);
	        }
			this.onPageChange.call(this,activePage);
	    }	    
	},
	pageChange: function(sender, field){
	    if (sender instanceof control_childPage)
	    {
	        switch (field)
	        {
				case "caption" :
								var textWidth = this.getTextWidth(sender.getCaption());
	                            var n = this.getFullId() + "_" + sender.getResourceId();
	                           
	                            node = $("#"+n + "_caption");

	                            if (node != undefined){
									node.html(sender.getCaption());  
									node.width(textWidth);
								}
	                            this.rearrangeHeader();    
	                            break;
	            case "image" :
	                            var n = this.getFullId() + "_" + sender.getResourceId();

	                            node = $("#"+n + "_image");

	                            if (node != undefined)
	                            {
	                                var imageAddress = sender.getImage();

	                                node.css({background: "url(" + imageAddress + ") top center no-repeat" });
	                            }
	                            break;
	        }
	    }
	},
	eventMouseOver: function(event, childId){
	    if (childId != this.activePage){
	        var child = window.system.getResource(childId);

	        if (child instanceof control_childPage)
	        {
	            var n = this.getFullId() + "_" + child.getResourceId();
	           
	            node = $("#"+n +"_btn");

	            
	        }
	    }
	},
	eventMouseOut: function(event, childId){
	    if (childId != this.activePage)
	    {
	        var child = window.system.getResource(childId);

	        if (child instanceof control_childPage)
	        {
	            var n = this.getFullId() + "_" + child.getResourceId();
	           
	            node = $("#"+ n +"_btn");

	        }
	    }
	},
	eventMouseDown: function(event, childId){
	    if (childId != this.activePage)
	    {
	        var child = window.system.getResource(childId);

	        if (child instanceof control_childPage)
	        {
				this.setActivePage(child);
			    this.owner.setActiveControl(this);
			    this.rearrangeIndex();
	        }
	    }
	},
	deActivedPage: function(activePage){
		n = this.getFullId() + "_" + activePage.getResourceId();
		$("#"+n).css({background:"#999"});
		node = $("#"+n + "_caption");
		activePage.setVisible(false);
	},
	setBGColor: function(color){
		var cnv = $("#"+this.getFullId() + "_header");
		if (cnv != undefined)
			cnv.css({background : color });
	},
	doKeyDown: function(keyCode,buttonState){
		var page = window.system.getResource(this.activePage);
		if (page instanceof control_childPage)
			page.doKeyDown(keyCode, buttonState);
	},
	rearrangeIndex: function(){
		var cnv, child,zIndex = this.childs.getLength(); 
		var maxIndex = zIndex;
		/*//zIndex = 0;
		for (var i in this.childs.objList){						
			child = window.system.getResource(i);
			cnv = $("#"+this.getFullId() + "_" + child.getResourceId());
			if (cnv){
				if (this.childs.objList[i] == this.activePage)
					cnv.style.zIndex = maxIndex;
				else cnv.style.zIndex = zIndex;
				zIndex--;
			}
		}*/		
	},
	rearrangeHeader: function(){
	    var left = 0;
	    var n = this.getFullId();
	    try
	    {
	      var lengthCap = 0;
	      var child,cnv, first = true;
	      var zIndex = this.childs.getLength();       
	      var maxIndex = zIndex;
	      for (var i in this.childs.objList)
	      {
		  	 if (!first) left-= 40;
	         child = system.getResource(this.childs.objList[i]);
	         n = this.getFullId() + "_" + child.getResourceId();
	         cnv = $("#"+n);	         
	         lengthCap = $("#"+n+"_caption").width() + 20;
	         cnv.css({left : left, width:lengthCap + 20});
	         
	         {
	            cnv = $("#"+n+"_caption");
	            cnv.css({left : 20});
	            left += lengthCap + 60;
	         }
			 first = false;
	      }            
	    }catch(e){
	      alert(e);
	    }
	}
});
