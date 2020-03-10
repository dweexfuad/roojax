//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_listView = function(owner, options){
	this.itemWidth = 100;
	this.color = "#F0F9EF";
	window.control_listView.prototype.parent.constructor.call(this, owner, options);
	this.className = "listBox";
	this.items = new control_arrayMap();
	this.selectedId = undefined;
	this.selectedCaption = "";
	this.onSelect = new control_eventHandler();
	this.onDblClick = new control_eventHandler();
	this.onAfterEdit = new control_eventHandler();
	this.itemView = 5;	
	if (options !== undefined){
		this.updateByOptions(options);
		if (options.color !== undefined) this.setColor(options.color);						
		if (options.itemView !== undefined) this.setItemViewed(options.itemView);							
		if (options.dblClick !== undefined) this.onDblClick.set(options.dblClick[0],options.dblClick[1]);				
		if (options.select !== undefined) this.onSelect.set(options.select[0],options.select[1]);				
		if (options.showIcon !== undefined) this.setShowIcon(options.showIcon);
	}
};
window.control_listView.extend(window.control_control);
window.listView =window.control_listView;
window.control_listView.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div id='"+n+"_header' style='{position:absolute; left:0;top:0;width:100%;height:20;cursor: pointer;background-image:url(image/themes/"+system.getThemes()+"/menuMainBg.png);background-position:0 0;background-repeat: repeat-x;background-color:"+this.color+";border: " + window.system.getConfig("3dborder.inner.bottom") + ";overflow:visible;}' > Name </div>"+
				   "<div id='"+n+"_box' style='{position:absolute; left:0;top:20;width:100%;height:100%;cursor: pointer;background-color:"+this.color+";border: " + window.system.getConfig("3dborder.inner.bottom") + ";overflow:auto;}' "+
					"onMouseDown='system.getResource("+this.resourceId+").doMouseDown(event);'"+
					"onMouseUp='system.getResource(" + this.resourceId + ").eventMouseUp(event);' " +
				   "> </div>"+
					"<input id='"+ n +"_edit' type='' style='position:absolute;left:0;top:0;width:50;height:20;display:none'"+
						"onBlur='system.getResource("+this.resourceId+").exitEdit(event)' "+
						"onKeyDown='system.getResource("+this.resourceId+").keyDown(event)' "+
					"/>"+
					"<div id='"+ n +"_frameCont' style='{display:none;position:absolute;left:0;top:20;width:100%;height:100%;background:#ffffff;}'> "+					
						"<iframe id='"+ n +"_iframe' frameborder=0 style='position:absolute;left:0;top:0;width:100%;height:95%;'></iframe>"+
						"<div  style='cursor:pointer;position:absolute;left:0;top:0;width:100%;height:20;background-image:url(icon/"+system.getThemes()+"/close2.bmp);background-position:top right;background-repeat: no-repeat'"+
						" onClick='system.getResource("+this.resourceId+").doCloseFrame();'"+
						" onMouseOver='system.getResource("+this.resourceId+").doMouseOver(event);'"+
						">"+
						"</div> "+
					"</div>"+
					"<div id='"+ n +"_block' style='{background:"+system.getConfig("form.grid.color")+";display:none;position:absolute;left: 0;top: 0; width: 100%; height: 100%;}'>"+
						"<div style='{background:url(image/gridload.gif) center no-repeat;position:absolute;left: 0;top: 0; width: 100%; height: 100%;color:#ff8a00}'>"+
						"<span style='{position:absolute;left: 50%;top: 40%;width: 100%; height: 100%;}'>P r o c e s s i n g</span></div>"+
					"</div>";
		this.setInnerHTML(html, canvas);
		this.iframe = $(n+"_iframe");
		this.frameCont = $(n+"_frameCont");
		this.edit = $(n+"_edit");
		this.block = $(n+"_block");
	},
	addItem: function(id, caption, icon, tipe,icon2){		    
		    var node = undefined;
		    var resId = this.items.getLength();
		    var item = this.items.get(resId);
		icon = icon == "" ? "icon/"+system.getThemes()+"/default.png": icon;
	    var fileName = icon;

	    if (item == undefined)
	    {        			
	        var client = $(this.getFullId() + "_box");
	        var node = document.createElement("div");
			
	        var n = this.getFullId() + "_item" + resId;
	        node.id = n;
	        node.style.width = "100%";
	        node.style.height = "20";
	        node.style.position = "relative";
	        node.style.overflow = "hidden";
	        
	        var iconDisplay = "display:none;";
	        var captionLeft = 2;
			
	        item = new Array(resId, id, caption, icon, tipe, node,icon2);
					
	        this.items.set(resId, item);
	        if (this.showIcon)
	        {
	            iconDisplay = "display:;";
	            captionLeft = 24;
	        }

	        var html = "<img id='" + n + "_icon' width=14 height=16 style='{" + iconDisplay + " position: absolute; left: 2; top: 2; width: 14; height: 16;}' src='"+fileName+"'/>" +
	                            "<div id='" + n + "_caption' style='{position: absolute; left: " + captionLeft + "; top: 3; width: 100%; height: 100%;}'>" + caption + "</div>" +
	                            "<div id='"+n +"_item' style='{cursor: pointer; background: url(images/transparent.png); position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' " +
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
			item[4] = tipe;
	        
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
	            this.selectedId = undefined;            
	            
	        node.removeChild($(this.getFullId() + "_item" + itemId));
	        this.items.del(id);
	    }
		var h = this.items.getLength();
	    if (this.items.getLength() > this.itemView)
	        h = this.itemView * 20 + 2;
	    else
	        h =  h * 20 + 2;
		this.selectedCaption = "";
	    //this.setHeight(h);    
	},
	clearItem: function(){
		this.selectedId = undefined;
		/*var cnv,item, node = $(this.getFullId() + "_box");
		for (var i in this.items.objList){
			item = this.items.get(i);		
			node.removeChild(item[5]);
		}*/
		this.items.clear();
		var node = $(this.getFullId() + "_box");
		if (node !== undefined) node.innerHTML = "";
		this.selectedCaption = "";
	},
	setItems: function(items, sender){
		try{
			this.items.clear();		
		    var client = $(this.getFullId() + "_box");
		    client.innerHTML = "";				
			var icon = "";
			for (var i in items.data)
		    {
				if (items.data[i] != undefined && items.data[i].file != ""){
			        realItem = items.data[i].file;
					icon = items.data[i].icon;
					if (items.data[i].tipe == "d")
						icon = sender.folderIconList;
					this.addItem(i,realItem,icon,items.data[i].tipe);
				}
		    }    
		}catch(e){
			alert("setItems:listbox:"+e);
		}
	},
	bringToFront: function(){
	},
	eventMouseUp: function(event){			
		window.control_listView.prototype.parent.eventMouseUp.call(this, event);	
	},
	eventMouseOver: function(event, itemId){	
	    if (itemId != this.selectedId)
	    {
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
	    if (itemId != this.selectedId)
	    {
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
			if (this.edit.style.display == "") this.edit.blur();
			this.selectedId = itemId;
			this.selectedCaption = item[2];
			var node = undefined;
			var n = "";
			n = this.getFullId() + "_item" + itemId;

			node = $(n);

			if (node != undefined)
			    node.style.background = window.system.getConfig("text.highlightBgColor");

			node = $(n + "_caption");

			if (node != undefined)
			    node.style.color = window.system.getConfig("text.highlightColor");
			
			this.onSelect.call(this, item[1], item[2], item[3],item[0],item[4]);
			if (this.app!= undefined) this.app.activeForm.setActiveControl(this);
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
	        this.onDblClick.call(this, item[1], item[2], item[3], item[0],item[4]);
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
	    window.control_listView.prototype.parent.setWidth.call(this, data);
		//if (document.all)
	    {
	        var frame = $(this.getFullId() + "_box");
	        frame.style.width = data;
	    }
	},
	setHeight: function(data){
	    window.control_listView.prototype.parent.setHeight.call(this, data);

	    //if (document.all)
	    {
	        var frame = $(this.getFullId() + "_box");
	        frame.style.height = data - 20;
			frame.style.position = "relative";
			frame.style.overflow = "auto";
	    }
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
	setShowIcon: function(data){
		this.showIcon = data;
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
	},
	doMouseDown: function(event){	
		switch (event.button)
	    {
	        case 1 :case 0:// left 
	                break;
	        case 2 :// right
	                if (this.popUpMenu != undefined)
					{								
						this.popUpMenu.popUp(event.clientX, event.clientY);
					}                
	                break;
	    }
	},
	doMouseOver: function(event){
		system.showHint(event.clientX, event.clientY+20, "back");
	},
	getData: function(src){
		this.iframe.src = "-";
		this.iframe.src = src;
		this.frameCont.style.display = "";
	},
	doCloseFrame: function(){	
		this.frameCont.style.display = "none";
	},
	exitEdit: function(event){
		this.edit.style.display = "none";
		var item = this.items.get(this.selectedId);
		var oldValue = item[2];
		item[2] = this.edit.value;
		var cnv = item[5].firstChild.nextSibling;
		cnv.innerHTML = item[2];
		this.items.set(this.selectedId, item);
		this.onAfterEdit.call(this,oldValue, item[2]);
	},
	keyDown: function(event){
		if (event.keyCode == 13){
			this.edit.blur();
		}
	},
	editItem: function(){
		var item = this.items.get(this.selectedId);
		if (item != undefined){
			var cnv = item[5];
			this.edit.style.top = cnv.offsetTop + 20;
			this.edit.style.left = 20;
			this.edit.style.width = item[2].length * 7;
			this.edit.value = item[2];
			this.edit.style.display = "";
			this.edit.focus();
		}
	},
	changeView: function(view){		
		try{
			var client = $(this.getFullId() + "_box");			
			client.innerHTML = "";
			var item, caption, icon;
			this.selectedId = undefined;
			this.viewType= view;
			if (view == "list"){			
				for (var i in this.items.objList){	
					item = this.items.get(i);
					caption = item[2];
					icon = item[3];
					var node = document.createElement("div");
					var n = this.getFullId() + "_item" + i;
					var resId = i;
					node.id = n;
					node.style.width = "100%";
					node.style.height = "20";
					node.style.position = "relative";
					node.style.overflow = "hidden";				
					var iconDisplay = "display:none;";
					var captionLeft = 2;								
					if (this.showIcon)
					{
					    iconDisplay = "display:;";
					    captionLeft = 24;
					}

					var html = "<img id='" + n + "_icon' width=14 height=16 style='{" + iconDisplay + " position: absolute; left: 2; top: 2; width: 14; height: 16;}' src='"+icon+"'/>" +
							    "<div id='" + n + "_caption' style='{position: absolute; left: " + captionLeft + "; top: 3; width: 100%; height: 100%;}'>" + caption + "</div>" +
							    "<div  style='{cursor: pointer; background: url(images/transparent.png); position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' " +
								"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event, " + resId + ");' " +
								"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event, " + resId + ");' " +
								"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event, " + resId + ");' " +
								"onDblClick='window.system.getResource(" + this.resourceId + ").eventDblClick(event, " + resId + ");' " +
								"></div>";
					this.setInnerHTML(html, node);
					client.appendChild(node);			
				}
			}else{
				var ix = 0, left = 3, width = 0;
				var top = 3;				
				for (var i in this.items.objList){				
					item = this.items.get(i);
					caption = item[2];
					icon = item[6];					
					var node = document.createElement("div");
					var n = this.getFullId() + "_item" + i;
					var resId = i;
					
					node.id = n;
					if (width + 105 < this.width)  {
						width += 105;					
					}else {
						top += 125;
						width = 0;
						left = 3;
					}
					node.style.top = top;
					node.style.left = left;
					node.style.width = "98";
					node.style.height = "120";
					node.style.position = "absolute";
					node.style.overflow = "hidden";				
					left += 105;
					var iconDisplay = "display:none;";
					var captionLeft = 2;								
					if (this.showIcon)
					{
					    iconDisplay = "display:;";
					    captionLeft = 24;
					}

					var html = "<img id='" + n + "_icon' width=96 height=96 style='{" + iconDisplay + " position: absolute; left: 0; top: 0; width: 96; height: 96;border:1px solid #999999}' src='"+icon+"' "+
								"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event, " + resId + ");' " +
								"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event, " + resId + ");' " +
								"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event, " + resId + ");' " +
								"onDblClick='window.system.getResource(" + this.resourceId + ").eventDblClick(event, " + resId + ");' " +
								"/>" +
							    "<div id='" + n + "_caption' style='{position: absolute; left: 0; top: 97; width: 100%; height: 20;text-align:center;white-space:nowarp}'>" + caption + "</div>" +
							    "<div style='{cursor: pointer; background: url(images/transparent.png); position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' " +
								"onMouseOver='window.system.getResource(" + this.resourceId + ").eventMouseOver(event, " + resId + ");' " +
								"onMouseOut='window.system.getResource(" + this.resourceId + ").eventMouseOut(event, " + resId + ");' " +
								"onMouseDown='window.system.getResource(" + this.resourceId + ").eventMouseDown(event, " + resId + ");' " +
								"onDblClick='window.system.getResource(" + this.resourceId + ").eventDblClick(event, " + resId + ");' " +
								"></div>";
					this.setInnerHTML(html, node);
					client.appendChild(node);			
					ix++;
				}
			}
		}catch(e){
			alert(e);
		}
	}
});
