//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_invoker = function(owner, options){
	if (owner){
        try{
            this.frameReady = false;

            this.color = "#fdb54e";
            this.borderColor = "#7e7e7e";
            this.multiFile = false;
            this.autoSubmit = false;
            this.selector = undefined;
            this.filename = "";		
            window.control_invoker.prototype.parent.constructor.call(this, owner, options);
            this.className = "control_invoker";

            window.control_invoker.prototype.parent.setWidth.call(this, 180);
            this.setHeight(20);
            this.isFlash = false;
            this.onUpdate = new control_eventHandler();
            if (options !== undefined){
                this.updateByOptions(options);
                if (options.service) this.setService(options.service);
            }	
        }catch(e){
            alert(e);
        }
        
    }
};
window.control_invoker.extend(window.control_control);
window.invoker = window.control_invoker;
window.control_invoker.implement({
	doDraw: function(canvas){
		canvas.css({background:"#fefefe"});
	},
	update: function(data){      
	   this.onUpdate.call(this, data);
	},
	viewFrameContent: function(){
		this.reinit();
	},
    setService: function(service){
        this.service = service;
    },
    start: function(){
        var n = this.getFullId();
        var canvas = this.getCanvas();
		canvas.css({backgroundColor : this.color, cursor : "pointer", overflow:"hidden",textAlign:"center", border:"1px solid "+this.borderColor });
		var html =  "<iframe id='"+ n +"_frame' border=0 frameBorder='no' style='{position: absolute;left:0;top:0;width: 100%; height:100%;}' id='" + n + "_frame' name='" + n + "_frame'  src='"+this.service+"?resId=" + this.resourceId +"&param1="+this.param1+"' ></iframe>";
		this.setInnerHTML(html, canvas);
		this.html = html;
    },
    stop: function(){
        this.setInnerHTML("", this.getCanvas());
    },
	doUploadFinished: function(result, data,col){	
		try{						
			this.onChange.call(this, data);
			
		}catch(e){
			systemAPI.alert(e);
		}
	},
	reinit: function(){
	   this.setInnerHTML(this.html,this.getCanvas());
    },
	reset: function(){
	    var n = this.getFullId();
	    $("#"+ n + "_frame").attr("src",this.service+"?resId=" + this.resourceId +"&param1="+this.param1);
		this.clearAll();
	},
	setUploadClassName: function(data){
	    this.uploadClassName = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $("#"+this.getFullId() + "_frame")[0].contentWindow.document.forms[0].uploadClassName.value = data;
	        else
	            $("#"+this.getFullId() + "_frame")[0].contentDocument.forms[0].uploadClassName.value = data;
	    }
	},
	setFuncName: function(data){
	    this.funcName = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $("#"+this.getFullId() + "_frame")[0].contentWindow.document.forms[0].funcName.value = data;
	        else
	            $("#"+this.getFullId() + "_frame")[0].contentDocument.forms[0].funcName.value = data;
	    }
	},
	setParam1: function(data){
	    this.param1 = data;
	},
	setParam2: function(data){
	    this.param2 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $("#"+this.getFullId() + "_frame")[0].contentWindow.document.forms[0].param2.value = data;
	        else
	            $("#"+this.getFullId() + "_frame")[0].contentDocument.forms[0].param2.value = data;
	    }
	},
	setParam3: function(data){
	    this.param3 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $("#"+this.getFullId() + "_frame")[0].contentWindow.document.forms[0].param3.value = data;
	        else
	            $("#"+this.getFullId() + "_frame")[0].contentDocument.forms[0].param3.value = data;
	    }
	},
	setParam4: function(data){
	    this.param4 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $("#"+this.getFullId() + "_frame")[0].contentWindow.document.forms[0].param4.value = data;
	        else
	            $("#"+this.getFullId() + "_frame")[0].contentDocument.forms[0].param4.value = data;
	    }
	},
	
	clearAll: function(){
		try{
			this.count = 0;
			var cnv = $(this.getFullId()+"_file_list");
			var child = undefined;
			var i = 0; 
			while (cnv.childNodes.length > 0)
			{
				child = cnv.childNodes[i];
				cnv.removeChild(child);
			}
		}catch(e){
			systemAPI.alert("[uploader]::clearAll:"+e);
		}
	},
	
});
