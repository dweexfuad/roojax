//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_listBox = function(owner, options){
	this.itemWidth = 100;
	this.color = "#F0F9EF";
	window.control_listBox.prototype.parent.constructor.call(this, owner, options);
	this.className = "listBox";
	this.items = new control_arrayMap();
	this.selectedId = undefined;
	this.onSelect = new control_eventHandler();
	this.onDblClick = new control_eventHandler();
	this.itemView = 5;
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.color !== undefined) this.setColor(options.color);						
		if (options.itemView !== undefined) this.setItemViewed(options.itemView);							
		if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);				
		if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);				
	}
};
window.control_listBox.extend(window.control_control);
window.listBox = window.control_listBox;
window.control_listBox.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div id='"+n+"_box' style='{position:relative; left:0;top:0;width:"+this.itemWidth+"px;height:100%;cursor: pointer;background-color:"+this.color+";border: " + window.system.getConfig("3dborder.inner.bottom") + ";overflow:visible;}' > </div>";
		this.setInnerHTML(html, canvas);
	},
	addItem: function(id, caption, icon){
	    var item = this.items.get(id);
	    var node = undefined;
	    var resId = 0;
	    var fileName = icon;

	    if (item == undefined)
	    {
	        resId = window.system.getResourceId();
	        item = new Array(resId, id, caption, icon);
	        
	        this.items.set(id, item);

			var client = $(this.getFullId() + "_box");
	        var node = document.createElement("div");
			
	        var n = this.getFullId() + "_item" + resId;
	        node.id = n;
	        node.style.width = "100%";
	        node.style.height = "20";
	        node.style.position = "relative";
	        node.style.overflow = "hidden";
	        
	        var iconDisplay = "none";
	        var captionLeft = 2;

	        if (this.showIcon)
	        {
	            iconDisplay = "";
	            captionLeft = 24;
	        }

	        var html = "<div id='" + n + "_icon' style='{" + iconDisplay + " position: absolute; left: 2; top: 2; width: 16; height: 16;background: url(" + fileName + ") center center no-repeat;}'></div>" +
	                            "<div id='" + n + "_caption' style='{position: absolute; left: " + captionLeft + "; top: 3; width: 100%; height: 100%;}'>" + caption + "</div>" +
	                            "<div style='{cursor: pointer; background: url(images/transparent.png); position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' " +
	                                "onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event, " + resId + ");' " +
	                                "onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event, " + resId + ");' " +
	                                "onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event, " + resId + ");' " +
	                                "onDblClick='window.system.getResource(" + this.resourceId + ").eventDblClick(event, " + resId + ");' " +
	                                "></div>";
	        this.setInnerHTML(html, node);
	        client.appendChild(node);
			
	    }
	    else
	    {
	        item[2] = caption;
	        item[3] = icon;
	        
	        this.items.set(id, item);
	        
	        var n = this.getFullId() + "_item" + item[0];
	        
	        node = $(n + "_caption");
	        
	        if (node != undefined)
	            node.innerHTML = caption;
	            
	        node = $(n + "_icon");

	        if (node != undefined)
	            node.style.background = "url(" + fileName + ") center center no-repeat";
	    }
		var h = this.items.getLength();
	    if (this.items.getLength() > this.itemView)
	        h = this.itemView * 20 + 2;
	    else
	        h =  h * 20 + 2;
	    //this.setHeight(h);    
	},
	delItem: function(id){
	    var item = this.items.get(id);

	    if (item != undefined)
	    {
	        var itemId = item[0];
	        var node = $(this.getFullId() + "_box");
	            
	        if (id == this.selectedId)
	        {
	            this.selectedId = undefined;
	            this.selectedId = undefined;
	        }
	            
	        node.removeChild($(this.getFullId() + "_item" + itemId));
	        this.items.del(id);
	    }
		var h = this.items.getLength();
	    if (this.items.getLength() > this.itemView)
	        h = this.itemView * 20 + 2;
	    else
	        h =  h * 20 + 2;
	    //this.setHeight(h);    
	},
	clearItem: function(){
	    this.selectedId = undefined;
	    this.selectedId = undefined;
		var cnv,item, node = $(this.getFullId() + "_box");
		for (var i in this.items.objList){
			
			item = this.items.get(i);
			cnv = $(this.getFullId()+"_item"+item[0]);
			node.removeChild(cnv);
		}
	    this.items.clear();
	    var node = $(this.getFullId() + "_box");
	    node.innerHTML = "";
	},
	setItems: function(items){
		try{
			this.items.clear();
			var item = undefined;
		    var realItem = undefined;
		    var node = undefined;
		    var resId = 0;
		    var client = $(this.getFullId() + "_box");
			
		    var n = undefined;
		    var tmpN = this.getFullId() + "_item";
		    var width = this.width;
		    var itemWidth = 0;
		    client.innerHTML = "";		
			for (var i in items.objList)
		    {
		        realItem = items.objList[i];
		        resId = window.system.getResourceId();
		        item = new Array(resId, realItem, realItem);

		        this.items.set(resId, item);

		        node = document.createElement("div");

		        n = tmpN + resId;
		        node.id = n;
		        node.style.width = "100%";
		        node.style.height = "20";
		        node.style.position = "relative";
		        node.style.overflow = "hidden";
		        
		        itemWidth = realItem.length * 6;
		        
		        if (itemWidth > width)
		            width = itemWidth;
				var iconDisplay = "none";
		        var captionLeft = 2;
			
		        if (this.showIcon)
		        {
		            iconDisplay = "";
		            captionLeft = 24;
		        }
		        var html =    "<div id='" + n + "_icon' style='{" + iconDisplay + " position: absolute; left: 2; top: 2; width: 16; height: 16;}'></div>" +
					"<div id='" + n + "_caption' style='{position: absolute; left: 2; top: 3; width: 100%; height: 100%;}'>" + realItem + "</div>" +
		                            "<div style='{cursor: pointer; background: url(images/transparent.png); position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' " +
		                                "onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event, " + resId + ");' " +
		                                "onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event, " + resId + ");' " +
		                                "onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event, " + resId + ");' " +
		                                "onDblClick='window.system.getResource(" + this.resourceId + ").eventDblClick(event, " + resId + ");' " +
		                                "></div>";
				this.setInnerHTML(html, node);
		        client.appendChild(node);
		    }
		    var h = this.items.getLength();
		    if (this.items.getLength() > this.itemView)
		        h = this.itemView * 20 + 2;
		    else
		        h =  h * 20 + 2;
		    this.setHeight(h);    
		    this.setWidth(width);
		}catch(e){
			systemAPI.alert("setItems:listbox:"+e);
		}
	},
	bringToFront: function(){
	},
	eventMouseOver: function(event, itemId){
	    if (itemId != this.selectedId){
	        var n = this.getFullId() + "_item" + itemId;

	        var node = $(n);

	        if (node != undefined)
	            node.style.background = window.system.getConfig("text.overBgColor");

	        node = $(n + "_caption");

	        if (node != undefined)
	            node.style.color = window.system.getConfig("text.overColor");
			
	    }
	},
	eventMouseOut: function(event, itemId){
	    if (itemId != this.selectedId){
	        var n = this.getFullId() + "_item" + itemId;

	        var node = $(n);

	        if (node != undefined)
	            node.style.background = window.system.getConfig("text.normalBgColor");

	        node = $(n + "_caption");

	        if (node != undefined)
	            node.style.color = window.system.getConfig("text.normalColor");
	    }
	},
	getSelectedItem: function(event){
		var item = undefined;
	    var tmpItem = undefined;
		for (var i in this.items.objList)
	    {			
	        tmpItem = this.items.objList[i];		
	        if (tmpItem[0] == this.selectedId)
	        {
	            item = tmpItem;
	            break;
	        }
	    }
		return item;
	},
	eventMouseDown: function(event, itemId){
	    var item = undefined;
	    var tmpItem = undefined;
		
		for (var i in this.items.objList)
	    {
		    
			tmpItem = this.items.objList[i];
			var n = this.getFullId() + "_item" + tmpItem[0];

	        var node = $(n);
	        if (node != undefined)
	            node.style.background = window.system.getConfig("text.normalBgColor");
		}
		
		for (var i in this.items.objList)
	    {
			
	        tmpItem = this.items.objList[i];		
	        if (tmpItem[0] == itemId)
	        {
	            item = tmpItem;
	            break;
	        }
	    }

	    if (item != undefined)
	    {
			this.selectedId = itemId;
	        var node = undefined;
	        var n = "";
	        n = this.getFullId() + "_item" + itemId;

	        node = $(n);

	        if (node != undefined)
	            node.style.background = window.system.getConfig("text.highlightBgColor");

	        node = $(n + "_caption");

	        if (node != undefined)
	            node.style.color = window.system.getConfig("text.highlightColor");
	        
	        this.onSelect.call(this, item[0], item[1]);
	    }
	},
	eventDblClick: function(event, itemId){
	    var item = undefined;
	    var tmpItem = undefined;

	    for (var i in this.items.objList)
	    {
			
	        tmpItem = this.items.objList[i];
	        if (tmpItem[0] == itemId)
	        {
	            item = tmpItem;
	            break;
	        }
	    }

	    if (item != undefined)
	        this.onDblClick.call(this, item[1], item[2], item[3], item[0]);
	},
	isItemExist: function(data){
	    var item = this.items.get(data);    
	    return (item != undefined);
	},
	getSelectedId: function(){
	    var result = undefined;
	    var item = this.items.get(this.selectedId);

	    if (item != undefined)
	        result = item[1];

	    return result;
	},
	setWidth: function(data){
		window.control_listBox.prototype.parent.setWidth.call(this, data);
		var frame = $(this.getFullId() + "_box");
        frame.style.width = data;    
	},
	setHeight: function(data){
		window.control_listBox.prototype.parent.setHeight.call(this, data);
		var frame = $(this.getFullId() + "_box");
        frame.style.height = data;
		frame.style.position = "relative";
		frame.style.overflow = "auto";
    },
	setSelectedId: function(data){
	    if (data != this.selectedId)
	    {
	        var item = this.items.get(data);

	        if (item != undefined)
	        {
	            var itemId = item[0];
	            var node = undefined;
	            var n = "";

	            if (this.selectedId != undefined)
	            {
	                n = this.getFullId() + "_item" + this.selectedId;
	                node = $(n);

	                if (node != undefined)
	                    node.style.background = window.system.getConfig("text.normalBgColor");

	                node = $(n + "_caption");

	                if (node != undefined)
	                    node.style.color = window.system.getConfig("text.normalColor");
	            }

	            this.selectedId = itemId;

	            n = this.getFullId() + "_item" + itemId;

	            node = $(n);

	            if (node != undefined)
	                node.style.background = window.system.getConfig("text.highlightBgColor");

	            node = $(n + "_caption");

	            if (node != undefined)
	                node.style.color = window.system.getConfig("text.highlightColor");

	            this.onSelect.call(this, item[1], item[2], item[3]);
	        }
	    }
	},
	show: function(){
		this.setVisible(true);
	},
	setItemViewed: function(data){
		this.itemView = data;
	},
	hide: function(){
		this.setVisible(false);
	},
	selectByCaption: function(data){
		var dt;
		for (var i in this.items.objList){			
			dt = this.items.get(i);
			if (dt[1] == data){
				this.setSelectedId(i);
				break;
			}
		}
	}
});
