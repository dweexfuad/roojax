//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_containerControl = function(owner, options){
	try
	{
		if (owner)
		{			
			window.control_containerControl.prototype.parent.constructor.call(this, owner, options);			
			this.className = "control_containerControl";
			this.childs = new control_arrayMap();
			this.nextZIndex = 1;			
			this.isContainer = true;
			this.childsIndex = [];
			
			$(window).scroll(() => {
				if (this.app.systemDatePickerForm != undefined && this.app.systemDatePickerForm.isVisible() ){
					this.app.systemDatePickerForm.close();
				}
			});
			this.getClientCanvas().scroll(() => {
				if (this.app.systemDatePickerForm != undefined && this.app.systemDatePickerForm.isVisible() ){
					this.app.systemDatePickerForm.close();
				}
			});
			this.getCanvas().scroll(() => {
				if (this.app.systemDatePickerForm != undefined && this.app.systemDatePickerForm.isVisible() ){
					this.app.systemDatePickerForm.close();
				}
			});
		}
	}catch(e)
	{
		systemAPI.alert(this+"$contructor()",e);
	}
};
window.control_containerControl.extend(window.control_control);
window.containerControl = window.control_containerControl;
//---------------------------- Function ----------------------------------------
window.control_containerControl.implement({
	
	addChild: function(child){		
		try{			
		    if ((child instanceof control_component))
		    {			
		        this.childs.set(child.getResourceId(), child.getResourceId());
				this.childsIndex[this.childsIndex.length] = child.getResourceId();
		        if (child instanceof control_control)
		        {			
		            var canvas = this.getClientCanvas();							    
		            if (canvas != undefined && child.draw)
		                child.draw(canvas);					
		        }			
				if (this instanceof system_system){
					this.applicationList.set(child.resourceId, child.resourceId);
				}
		    }
		}catch(e){
			error_log(this+"$addChild()"+e);
		}
	},
	delChild: function(child){
		try{
			if (child instanceof control_component)
		    {		
				var res = child.resourceId;
		        delete this.childs.objList[child.getResourceId()];
		        if (child instanceof control_control)
		        {
		            var canvas = this.getClientCanvas();
		            var node = $("#"+child.getFullId());
		            node.remove();		                
		        }				
				var tmp = [];
				for (var i in this.childsIndex){
					if (this.childsIndex[i] != res)
						tmp[tmp.length] = this.childsIndex[i];
				}
				this.childsIndex = tmp;
		    }	
		}catch(e){
			error_log(this+"$delChild()"+e);
		}
	},
	setTabChildIndex: function(startIndex){
		try{
			var j = startIndex;
			if (startIndex == undefined)
				j = 0;
			var child = undefined;
			for (var i in this.childs.objList)	
			{				
				child = $$$(i);
				if (child instanceof control_containerControl && child.className != "control_saiGrid" && child.className != "control_reportViewer"){
				    j++;
                    child.setTabIndex(j);
					child.setTabChildIndex(j);
				}else if (child instanceof control_control && child.isTabStop()){
				    j++;
					child.setTabIndex(j);					
				}
			}
		}catch(e){
			error_log(this+"$setTabChildIndex()"+e);
		}
	},
	clearChild: function(){
		try{
			var child = undefined;
			this.childsIndex = [];
			for (var i in this.childs.objList){	
				child = $$$(i);	
				if (child instanceof control_component)
					child.free();
			}			  
			this.childs.objList = [];	    
		}catch(e){
			error_log(this+"$clearChild()"+e);
		}
	},
	free: function(){
	    this.clearChild();	    
		window.control_containerControl.prototype.parent.free.call(this);    	
		if (this instanceof control_commonForm){
			var cnv2 = this.getCanvas();
			if (cnv2)
		    	cnv2.remove();		    
		}
	},
	prevCtrl: function(sender){
	   try{
    	    var nextControl,tabControl;
			var tabIndex = sender.getTabIndex(); 
			var firstControl = sender;
			for (var i=this.childsIndex.length;i >=0 ;i--){
				ctrl = $$$(this.childsIndex[i]);	
				if (ctrl instanceof control_containerControl && ctrl.className != "control_saiGrid" && ctrl.className != "control_reportViewer"){				
					tabControl = ctrl.prevCtrl(sender);
					if (tabControl) break;
				}else if ((ctrl instanceof control_control) && (ctrl != sender) && ctrl.isTabStop() && ctrl.isVisible())
				{
                    if (ctrl.getTabIndex() <= tabIndex)
					{
						tabControl = ctrl;
						//tabIndex = ctrl.getTabIndex();
						break;
					}					
				}				
			}			
            if (tabControl == undefined && sender.owner == this){
			     tabControl = firstControl;
            }
            if (tabControl != undefined){
				tabControl.setFocus();				
				//if ((tabControl.className ==  "control_button" || tabControl.className ==  "control_saiGrid"|| tabControl.className == "control_imageButton")){                    
                //    return tabControl.getForm().setActiveControl(tabControl);
				//}								
				if (tabControl.className ==  "control_saiGrid") {
                    if (tabControl.getRowCount() > 0 && tabControl.getColCount() > 0) {
                        tabControl.setRowIndex(0,0);tabControl.rows.get(0).showInplaceEdit(0);
                        tabControl.inplaceEdit.focus();
                    }
                }                    
			}	
			return tabControl;	
  		}catch(e){
            alert(e);
        }
	},
	nextCtrl: function(sender){
		try
		{
			var tmp;	
			var nextTabIndex = sender.getTabIndex() + 1000;// + 1000
			var nextTabStop = undefined;
			if (sender.blur) sender.blur();			
			sender.doLostFocus();
			for (var i in this.childs.objList)
			{
				tmp = $$$(this.childs.objList[i]);
				//if (tmp instanceof control_containerControl && tmp.className != "control_saiGrid"){
				//	nextTabStop = tmp.nextCtrl(sender);
				//	break;
				//}else 
				if ((tmp instanceof control_control) && (tmp != sender) && tmp.isVisible())
				{				
					if ((tmp.getTabIndex() >= sender.getTabIndex()) && (tmp.getTabIndex() < nextTabIndex) )
					{
						if (tmp.isTabStop()){
							nextTabStop = tmp;
							nextTabIndex = tmp.getTabIndex();
						}else if (tmp instanceof control_containerControl && tmp.className != "control_saiGrid")
						{
							nextTabStop = tmp.nextCtrl(sender);
						}
						break;
					}
				}
			}			
			if (nextTabStop == undefined)
			{			
				if (this instanceof control_childForm)	;			
				else if (this instanceof control_containerControl){				    
					return undefined;
				}
				for (var i in this.childs.objList)
				{
					
					tmp = $$$(this.childs.objList[i]);
					if ((tmp instanceof control_control) && (tmp != sender) && tmp.isTabStop())
					{
						nextTabStop = tmp;
						break;
					}
				}
			}			
			if (nextTabStop instanceof control_control){			    
				nextTabStop.setFocus();
				if ((nextTabStop.className ==  "control_button" || nextTabStop.className ==  "control_saiGrid"|| nextTabStop.className == "control_imageButton")){
                    nextTabStop.getForm().setActiveControl(nextTabStop);
				}								
				if (nextTabStop.className ==  "control_saiGrid") {
                    if (nextTabStop.getRowCount() > 0 && nextTabStop.getColCount() > 0) {
                        nextTabStop.setRowIndex(0,0);nextTabStop.rows.get(0).showInplaceEdit(0);
                        nextTabStop.inplaceEdit.focus();
                    }
                }                                
				return nextTabStop;
			}
		}catch(e)
		{
			error_log(this+"$nextCtrl()"+e);
		}
	},
	doDefocusCtrl: function(control){
		control.doLostFocus();
		if (control.blur) control.blur();
		this.activeControl= undefined;
	},
	setActiveControl: function(control){
	    try{
    		if (control != this.activeControl){
    			this.activate();
    			if (this.activeControl instanceof window.control_control)
    			    this.activeControl.doLostFocus();
    			this.activeControl = control;
    			if (this.activeControl instanceof window.control_control)
    			    this.activeControl.doSetFocus();
    		}
   		}catch(e){
   		   alert(e);
        }
	},
	activate: function(oldApplication){	
		var app = window.system.getActiveApplication();
		if (this.getForm() instanceof control_commonForm){
			if (!this.getForm().active){
				this.active = true;
				app.setActiveForm(this.getForm());
			}
		}else {
			var form = this.getForm();
			if (!form.getForm().active){
				this.active = true;
				app.setActiveForm(form.getForm());
			}
		}
		app.activate();
	},
	doThemesChange: function(themeName){
	    var child = undefined;    
	    for (var i in this.childs.objList)
	    {			
	        child = $$$(this.childs.objList[i]);        
	        if (child instanceof control_control)
	            child.doThemesChange(themeName);
	    }
	},
	isHasChild: function(){
	    var result = false;	    
	    for (var i in this.childs.objList)
	    {		
	        result = true;
	        break;
	    }	   
	    return result;
	},
	getNextZIndex: function(){
	    var result = this.nextZIndex;
	    this.nextZIndex++;    
	    return result;
	},
	getClientCanvas: function(){	    				
	    var result = $("#"+this.getFullId() + "form");		
		if (result == undefined) result = $("#"+this.getFullId() + "_form");						
	    return result;
	},
	getClientWidth: function(){
		return this.width;
	},
	getClientHeight: function(){
		return this.height;
	},
	rearrangeChild: function(startTop, padding){
		var tmp, tmpBfr;
		var topTmp, topComp = startTop;
		for (var i=0;i < this.childsIndex.length; i++){			
			tmp = $$$(this.childsIndex[i]);					
			if (tmp instanceof control_control && !(tmp instanceof control_containerControl || tmp.className == "control_saiTable" || tmp.className == "control_richTextArea" || tmp.className == "control_saiMemo")){
				if (topTmp != undefined && topTmp != tmp.top){					
					topTmp = tmp.top;
					tmp.setTop(topComp);				
				}else if (topTmp == undefined){
					topTmp = tmp.top;
					tmp.setTop(startTop);								
				}else if (topTmp == tmp.top){
					topTmp = tmp.top;
					topComp = topComp - tmpBfr.height - (padding - 20); ///padding
					tmp.setTop(topComp);				
				}												
				topComp += tmp.getHeight() ;
				topComp += padding - 20;	
			}else if (tmp instanceof control_containerControl || tmp.className == "control_saiTable" || tmp.className == "control_richTextArea" || tmp.className == "control_saiMemo"){
				if (!(tmp.className == "control_panel" && tmp.caption == "Layout")){
					if (topTmp != undefined && topTmp != tmp.top){					
						topTmp = tmp.top;
						tmp.setTop(topComp);				
					}else if (topTmp == undefined){
						topTmp = tmp.top;
						tmp.setTop(startTop);								
					}else if (topTmp == tmp.top){
						topTmp = tmp.top;
						topComp = topComp - tmpBfr.height - 5;
						tmp.setTop(topComp);				
					}							
					topComp += tmp.getHeight();
					topComp += 5;
				}				
			}	
			tmpBfr = tmp;			
		}		
	},
	rearrangeH: function(startLeft, padding){
		var tmp;
		var leftComp = startLeft;
		for (var i=0;i < this.childsIndex.length; i++){			
			tmp = $$$(this.childsIndex[i]);					
			tmp.setLeft(leftComp);	
			leftComp += tmp.getWidth() + padding;
		}		
	},
	checkEmptyByTag: function(tag){
		try{
			var comp = undefined;
			var container = this;
			var valid = true; 
			for (var i in this.childs.objList)
			{
				comp = system.getResource(container.childs.objList[i]);			
				for (var j = 0; j < tag.length;j++)
				{
					if (comp.getTag() == parseInt(tag[j]) )
					{					  
						if ((comp.className == "control_saiLabelEdit") || (comp.className == "control_saiEdit") || (comp.className == "control_saiCBBL") || (comp.className == "control_saiCB") || (comp.className == "control_saiMemo")  || (comp.className == "control_saiCBB"))
						{
							if ((comp.getText() == "")&&(comp.visible))
				            {															
				              //comp.fadeBackground("ffff00","ff0000",100,5,comp.getFullId() +"_edit");
				              comp.setFocus();
				              if (!(comp.className == "control_saiEdit"))                
				                system.alert(container,"field tidak boleh kosong ("+comp.getCaption()+")");
				              else system.alert(undefined,"field tidak boleh kosong ("+comp.getName()+")");                 
				              valid = false;              
				              return valid;
				              break;            
				            }								
						}else if ((comp.className == "control_saiSG")||(comp.className == "control_saiGrid")||(comp.className == "control_treeGrid")||(comp.className == "control_stringGrid")||(comp.className == "control_mdGrid"))
						{						  
				            /*
							for (var i=0; i < comp.rows.getLength(); i++){
				                for (var c=0;c<comp.columns.getLength();c++)
				                {
				                   if (comp.getCell(c,i) == "")
				                   {
				                      system.alert(container,"field tidak boleh kosong \n"+
				                        "column :"+comp.columns.get(c).getTitle()+"\n"+
				                        "row    :"+i);
				                      valid = false;              
				                      return valid;
				                   } 
				                }
				            }
				            if (comp.getRowValidCount() == 0)
				            {
				              system.alert(container,"Table tidak boleh kosong \n");
				              valid = false;
				              return valid;
							}
							*/

				        }          
					}				
				}			
				if ((comp instanceof control_containerControl))
				{
					valid = comp.checkEmptyByTag(tag);
					if (!valid) return valid;
				}				
			}
			return valid;
		}catch(e){
			systemAPI.alert("Error Message",e);
		}
	}
});
