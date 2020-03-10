//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_dropDownBox= function(owner)
{
	if (owner)
	{
		this.itemWidth = 200;
		window.control_dropDownBox.prototype.parent.constructor.call(this, owner);
		this.className = "control_dropDownBox";		
		this.color = "#F0F9EF";
		this.className = "dropDownBox";
		this.items = new control_arrayMap();
		this.onSelect = new control_eventHandler();
		this.onDblClick = new control_eventHandler();
		this.selectedItem = undefined;
		this.itemHeight=5;

	}
};
window.control_dropDownBox.extend(window.control_commonForm);
window.dropDownBox = window.control_dropDownBox;
window.control_dropDownBox.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		var html = "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
	                    "<div id='"+n+"_box' style='{position:relative; left:0;top:0;width:"+this.itemWidth+"px;height:100%;"+
						"cursor: pointer;background:#fff;"+
						"border-top: " + window.system.getConfig("3dborder.inner.bottom") + ";"+
						"border-right: " + window.system.getConfig("3dborder.inner.left") + ";"+
						"border-bottom: " + window.system.getConfig("3dborder.inner.top") + ";"+
						"overflow:auto;}'> </div>"+
						"</div>";
		this.setInnerHTML(html, canvas);
		
	},
	createItem: function(item){
		var client = $("#"+this.getFullId() + "_box");
		var n = this.getFullId() + "_item" +item[0];
		var html =    "<div id='" + n + "_caption' style='position: absolute; left: 2; top: 3; width:100%; height: 100%;white-space: nowrap'>" + item[1] + "</div>";		
		/*
		"<div style='cursor: pointer; background: url(images/transparent.png); position: absolute; left: 0; top: 0; width: 100%; height: 100%;' " +
								"onMouseOver='system.getResource(" + this.resourceId + ").eventMouseOver(event, " + resId + ");' " +
								"onMouseOut='system.getResource(" + this.resourceId + ").eventMouseOut(event, " + resId + ");' " +
								"onMouseDown='system.getResource(" + this.resourceId + ").eventMouseDown(event, " + resId + ");' " +
								//"onClick='system.getResource(" + this.resourceId + ").eventDblClick(event, " + resId + ");' " +
								"></div>"
								 */
		var node = $("<div style='position:relative;width:100%;height:20;overflow:hidden;background:#ffffff'></div>").html( html );
		var self = this;
		node.on("click", function(){
			$(this).css({background:"#FFF9C4"});
			self.selectedItem = item;
			self.onSelect.call(self, item[0], item[1]);
			self.emit("select", item[0], item[1]);
		});												
		node.on("mouseover", function(){
			if (self.selectedItem == item){
				$(this).css({background:"#FFF9C4"});
			}else {
				$(this).css({background:"#ECEFF1"});
			}
		});	
		node.on("mouseout", function(){
			if (self.selectedItem == item){
				$(this).css({background:"#FFF9C4"});
			}else {
				$(this).css({background:"#ffffff"});
			}
		});			
		client.append(node);
	},
	setItems: function(items){
		try{
			this.items.clear();
			var item;
			var realItem;
			var node;
			var resId = 0;
			var client = $("#"+this.getFullId() + "_box");
			
			var n;
			var tmpN = this.getFullId() + "_item";
			var width = this.width;
			var itemWidth = 0;
			client.empty("");
		    var itemC = -1;  	
		    var top = 0;	    
			//for (var i=0; i < items.objList.length; i++)
			var self = this;
			for (var i in items.objList)
			{
                itemC++;
                
				realItem = items.get(i);
				if (realItem == undefined) continue;
				resId = itemC;
				
				item = new Array(resId, realItem, realItem);
				
				this.items.set(i, item);
				n = tmpN + resId;
				itemWidth = realItem.length * 6;
				if (itemWidth > width)
					width = itemWidth;
				this.itemWidth = this.width;
				this.createItem(item);
				top += 20;
			}
			var h = this.items.getLength();
			if (h > 0) this.selectedItemId = 0;
			if (this.items.getLength() > this.itemHeight)
				h = this.itemHeight * 20 + 2;
			else
				h =  h * 20 + 2;
			this.setHeight(h);    			
		}catch(e){
			alert("test:[saiCB]::setItems:"+e);
		}
	},
	eventMouseOver: function(event, itemId){
	    if (itemId != this.selectedItemId){
	        $("#"+this.getFullId() + "_item" + itemId).css({ background : system.getConfig("text.overBgColor") });
	        $("#"+this.getFullId() + "_item" + itemId+ "_caption").css({ color : system.getConfig("text.overColor") });
			
	    }
	},
	eventMouseExit: function(event){
	},
	eventMouseOut: function(event, itemId){
	    if (itemId != this.selectedItemId){	        
	        $("#"+ this.getFullId() + "_item" + itemId).css({ background : system.getConfig("text.normalBgColor") });
	        $("#"+ this.getFullId() + "_item" + itemId + "_caption").css({ color : system.getConfig("text.normalColor") });
	    }
	},
	eventMouseDown: function(event, itemId){
		try{
			var item;
		    var tmpItem;	
			for (var i=0; i < this.items.objList.length;i++){
			    tmpItem = this.items.objList[i];		
				if (tmpItem)	
		        	$("#"+this.getFullId() + "_item" + tmpItem[0]).css({ background : system.getConfig("text.normalBgColor") });
			}		
			for (var i in this.items.objList){
		        tmpItem = this.items.objList[i];			
		        if (tmpItem[0] == itemId){
		            item = tmpItem;
		            break;
		        }
		    }
		    if (item != undefined){
				this.selectedItemId = itemId;	        	        
		        $("#"+this.getFullId() + "_item" + itemId).css({background : system.getConfig("text.highlightBgColor") }); 
		        $("#"+ this.getFullId() + "_item" + itemId + "_caption").css({ color : system.getConfig("text.highlightColor") });	        
				this.selectedItem = item;
				this.onSelect.call(this, item[0], item[1]);
				this.emit("select", item[0], item[1]);
		    }
		  }catch(e){
		  	error_log(e);
		  }
	},
	eventDblClick: function(event, itemId){
		try{
			error_log("enter click")
			this.hide();
			this.close();
			this.onDblClick.call(this, this.selectedItem[0],this.selectedItem[1]);		
			if (this.linkCtrl) this.linkCtrl.setFocus();
			this.emit("dblClick", this.selectedItem[0],this.selectedItem[1]);
		}catch(e){
			error_log(e);
		}
	},
	setWidth: function(data){
		try{
			window.control_dropDownBox.prototype.parent.setWidth.call(this, data);	
			$("#"+this.getFullId() + "_box").css({ width : data});    
			this.itemWidth = data;
			var itemNode = undefined;
			var tmpItem = undefined;
			for (var i in this.items.objList)
			{
				tmpItem = this.items.objList[i];
				$("#"+this.getFullId()+"_item"+ tmpItem).css({ width : data });
			}
			this.setShadow();
		}catch(e){
			error_log("[control_dropDownBox]::setWidth:"+e);
		}
	},
	setHeight: function(data){
		window.control_dropDownBox.prototype.parent.setHeight.call(this, data);	    
        $("#"+this.getFullId() + "_box").css({ height : data });
	},
	show: function(){
		window.control_dropDownBox.prototype.parent.show.call(this);
		this.setShadow({type:"middle"});	    
	},
	setSelectedId: function(data){
	    var item = this.items.get(data);
	    if (item != undefined)
	    {
	        var itemId = item[0];
	        var n = this.getFullId() + "_item" + itemId;
	        
	        this.selectedItemId = itemId;
	        $("#"+n).css({background : system.getConfig("text.highlightBgColor") });
	        $("#"+n + "_caption").css({ color : system.getConfig("text.highlightColor") });
	    }
	},
	doLostFocus: function(){
		window.control_dropDownBox.prototype.parent.doLostFocus.call(this);
		this.setVisible(false);
	},
	setItemHeight: function(itemHeight){
		this.itemHeight=itemHeight;
	},
	doKeyDown: function(charCode, buttonState, keyCode){
	   try{
	       if (this.selectedItemId === undefined) return false;
	       if (this.items.getLength() == 0) return false;
    	   switch(keyCode){
    	       case 40 :
    	            if (this.selectedItemId < this.items.getLength()) this.eventMouseDown(undefined, this.selectedItemId + 1);	       
    	            var n = this.getFullId() + "_item" + (this.selectedItemId);
       	            node = $("#"+n);   	            
       	            if (node.position().top+ 20 > $("#"+this.getFullId()+"_box").scrollTop() + $("#"+this.getFullId()+"_box").height() ){
       	            	$("#"+this.getFullId()+"_box").scrollTop("+= 20");
                	}
    	       break;
    	       case 38 :
    	           if (this.selectedItemId > 1) this.eventMouseDown(undefined, this.selectedItemId - 1);
    	           var n = this.getFullId() + "_item" + (this.selectedItemId);
       	            node = $("#"+n);   	            
                   if (node.position().top < $("#"+this.getFullId()+"_box").scrollTop() ){
       	            	$("#"+this.getFullId()+"_box").scrollTop (node.position().top);            
                	}  
    	       break;
    	       case 13:	
					this.hide();
    	           this.close();				   
    	           if (this.linkCtrl) this.linkCtrl.setFocus();
    	       break;
           }
           return false;
        }catch(e){
            alert(e);
        }
    },
    setCtrl : function(ctrl){
        this.linkCtrl = ctrl;
    }
});
