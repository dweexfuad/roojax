//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_uploader = function(owner, options){
	if (owner){
		this.frameReady = false;
		
		this.uploadClassName = "";
		this.funcName = "";
		this.param1 = "";
		this.param2 = "";
		this.param3 = "";
		this.param4 = "";
		this.color = "#fdb54e";
		this.borderColor = "#7e7e7e";
		this.multiFile = false;
		this.autoSubmit = false;
		this.selector = undefined;
		this.filename = "";		
		this.ctrlStyle = "default";
		if (options !== undefined && options.ctrlStyle !== undefined) this.ctrlStyle = options.ctrlStyle;
		window.control_uploader.prototype.parent.constructor.call(this, owner, options);
		this.className = "control_uploader";

		window.control_uploader.prototype.parent.setWidth.call(this, 180);
		this.setHeight(20);
		this.isFlash = false;
		this.onAfterUpload = new control_eventHandler();
		this.onChange = new control_eventHandler();
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.multiFile !== undefined) this.setMultiFile(options.multiFile);
			if (options.afterUpload !== undefined) this.onAfterUpload.set(options.afterUpload[0],options.afterUpload[1]);													
			if (options.onChange !== undefined) this.onChange.set(options.onChange[0],options.onChange[1]);													
			if (options.autoSubmit !== undefined) this.setAutoSubmit(options.autoSubmit);
			if (options.param1 !== undefined) this.setParam1(options.param1);
			if (options.param2 !== undefined) this.setParam2(options.param2);
			if (options.param3 !== undefined) this.setParam3(options.param3);
			if (options.param4 !== undefined) this.setParam4(options.param4);
			if (options.uploadClassName !== undefined) this.setUploadClassName(options.uploadClassName);
			if (options.funcName !== undefined) this.setFuncName(options.funcName);
			if (options.title || options.caption) this.setCaption(options.title || options.caption || "Upload");
			if (options.usingFlash !== undefined) this.usingFlash(true);			
		}		
    }
};
window.control_uploader.extend(window.control_control);
window.uploader = window.control_uploader;
window.control_uploader.implement({
	doDraw: function(canvas){
		var n = this.getFullId();		
		canvas.style.backgroundColor = this.color;//fdb54e
		//canvas.style.backgroundImage = "url(icon/dynpro/button.png)";		
		canvas.style.cursor = "pointer";
		canvas.style.overflow = "hidden";
		canvas.style.textAlign = "center";
		canvas.style.border = "1px solid "+this.borderColor;			
		var html =  "<iframe id='"+ n +"_frame' border=1 frameBorder='no' style='{position: absolute;left:0;top:0;width: 100%; height:100%;}' id='" + n + "_frame' name='" + n + "_frame'  src='uploadCtrl.php?resId=" + this.resourceId + "&ctrl="+this.ctrlStyle+"&col=0&caption=Upload' ></iframe>" +				
				    "<img id='" + n + "_bar' style='{position: absolute;top:3;display: none;}' src= 'image/upload.gif' onDblClick='system.getResource(" + this.resourceId + ").viewFrameContent();'></img>" +
				    "<div id='" + n + "_result' style='{position: absolute;width: 100%; height: 100%; display: none;}'></div>"+
				    "<div id='" + n + "_file_list' style='{position: absolute;width: 100%; height: 100%; display: none;}'></div>"+
					"<div id='" + n + "_swf' style='position:absolute;top:0;left:0;width:100%;height:100%;display:none'></div>";
		this.setInnerHTML(html, canvas);
		eventOn(canvas,"mousemove","$$$(" + this.resourceId + ").eventMouseMove(event);");
	    this.html = html;
	},
	doInit: function(){      
	    this.frameReady = true;
	    this.setUploadClassName(this.uploadClassName);
	    this.setFuncName(this.funcName);
	    this.setParam1(this.param1);
	    this.setParam2(this.param2);
	    this.setParam3(this.param3);
	    this.setParam4(this.param4);
	    this.setCaption(this.title || "Upload");
		
		//
		if (this.multiFile)
		{
			var cnv = undefined;
			if (document.all)
	            cnv = $(this.getFullId() + "_file_list");
	        else
	            cnv = $(this.getFullId() + "_file_list");		
			this.selector = new control_multiSelector( cnv,this.maxFile);		
			var file = undefined;
			if (document.all)
				file = $(this.getFullId() + "_frame").contentWindow.document.forms[0].uploadFile;			
			else
	            file = $(this.getFullId() + "_frame").contentDocument.forms[0].uploadFile;	
			file.uploader = this;	
			this.selector.addElement(file);
		}
	},
	doChange: function(sender, file){
		try{			
			if (this.isFlash){
				var obj = systemAPI.getFlexApp(this.getFullId()+"_flash");				
				if (file !== undefined){
					var fileName = file.name;
					if (!this.autoSubmit)
						this.onChange.call(this, fileName,false);
					this.filename = fileName;							
				}
			}else{
				var fileName = this.getValue();					
				if (document.all || systemAPI.browser.chrome){
					var filename = fileName;						
					filename = filename.substr(filename.lastIndexOf("\\") + 1, filename.length - filename.lastIndexOf("\\"));					
					fileName = filename;
				}
				if (!this.autoSubmit)
					this.onChange.call(this, fileName,false);									
				
				this.filename = fileName;			
				if (this.multiFile)
				{		
					var file;
					if (document.all)
						file = $(this.getFullId() + "_frame").contentWindow.document.forms[0].uploadFile;			
					else
						file = $(this.getFullId() + "_frame").contentDocument.forms[0].uploadFile;	
					this.doSelectChange(file);						
				}
			}
			if (this.autoSubmit)
				this.upload();			
		}catch(e){
			systemAPI.alert(e,fileName);
		}
	},
	viewFrameContent: function(){
		/*var n = this.getFullId();
		$(n + "_bar").style.display = "none";		
		$(n + "_frame").style.display = "";		
		*/
		this.reinit();
	},
	doUploadFinished: function(result, data,col){	
		try{						
			if (!this.isFlash){					
				var n = this.getFullId();    			
				$(n + "_frame").style.display = "";
				$(n + "_result").style.display = "none";		
				$(n + "_bar").style.display = "none";		
				this.reset();					
				if (document.all && this.param4 != "gridupload"){					
					var data = xmlToObj(urldecode(data));								
				}				
				if (this.param3 == "object" && typeof data == "string" && data.search("<server_Response") > -1 ){					
					var data = xmlToObj(urldecode(data));				
				}else if (this.param3 == "object" && typeof data == "string"){						
					eval("data = "+data+";");					
				}				
				
				if (result){
					$(n + "_result").innerHTML = "Upload OK";
					if (this.param3 == "object"){						
						if (this.param1 == "uploadTo" && this.param4 != ""){
                            eval("data = "+urldecode(data.value.toString()));
                        }else data = data.value;
					}else {		
						data = ""+data;
						var tmp = xmlToObj(data);						
						tmp = tmp.getValue();							
						data = tmp;						
					}
					this.onAfterUpload.call(this, result, data, this.filename);					
				}else{
					$(n + "_result").innerHTML = "Upload Failed";												
					if (this.param3 == "object"){						
						data = data.value;
					}else {		
						data = ""+data;
						var tmp = xmlToObj(data);
						tmp = tmp.getValue();							
						data = tmp;						
					}
					systemAPI.alert("Upload Failed("+data+")","Mungkin file terlalu besar (max.10M)");
				}
				if (this.autoSubmit){
					this.onChange.call(this, this.filename,result, data);
				}
				this.reinit();
			}else{
				this.onAfterUpload.call(this, result, data, this.filename);
				if (this.autoSubmit){
					this.onChange.call(this, this.filename,result, data);
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	},
	reinit: function(){
	   this.setInnerHTML(this.html,this.getCanvas());
    },
	reset: function(){
	    var n = this.getFullId();
	    
	    $(n + "_bar").style.display = "none";
	    $(n + "_frame").style.display = "";
	    $(n + "_result").style.display = "none";		
	    this.frameReady = false;
	    $(n + "_frame").src = "uploadCtrl.php?resId=" + this.resourceId + "&ctrl="+this.ctrlStyle+"&col=0&caption="+this.title;
			
		this.clearAll();
	},
	upload: function(){
		try{
			if (this.isFlash){
				var obj = systemAPI.getFlexApp(this.getFullId()+"_flash");				
				obj.upload("starting");
			}else{
			    var n = this.getFullId();	    
			    $(n + "_bar").style.display = "";
			    $(n + "_result").style.display = "none";
			    $(n + "_frame").style.display = "none";		
			    if (document.all){										        								
					$(this.getFullId() + "_frame").contentWindow.document.forms[0].submit();								
			    }else
			        $(n + "_frame").contentDocument.forms[0].submit();			
			}
		}catch(e){
			systemAPI.alert("do Upload",e);
		}
	},
	hollow: function(){	
	},
	browse: function(){
		try{
			var n = this.getFullId();
			if (document.all){
				var   file = $(n + "_frame").contentWindow.document.forms[0].uploadFile;
				file.click();
			}
		    else{
		      var  file = $(n + "_frame").contentDocument.forms[0].uploadFile;		
			  file.select();
			}	
		}catch(e){
			alert(e);
		}	
	},
	setUploadClassName: function(data){
	    this.uploadClassName = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $(this.getFullId() + "_frame").contentWindow.document.forms[0].uploadClassName.value = data;
	        else
	            $(this.getFullId() + "_frame").contentDocument.forms[0].uploadClassName.value = data;
	    }
	},
	setFuncName: function(data){
	    this.funcName = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $(this.getFullId() + "_frame").contentWindow.document.forms[0].funcName.value = data;
	        else
	            $(this.getFullId() + "_frame").contentDocument.forms[0].funcName.value = data;
	    }
	},
	setParam1: function(data){
	    this.param1 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $(this.getFullId() + "_frame").contentWindow.document.forms[0].param1.value = data;
	        else
	            $(this.getFullId() + "_frame").contentDocument.forms[0].param1.value = data;
	    }
	},
	setParam2: function(data){
	    this.param2 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $(this.getFullId() + "_frame").contentWindow.document.forms[0].param2.value = data;
	        else
	            $(this.getFullId() + "_frame").contentDocument.forms[0].param2.value = data;
	    }
	},
	setParam3: function(data){
	    this.param3 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $(this.getFullId() + "_frame").contentWindow.document.forms[0].param3.value = data;
	        else
	            $(this.getFullId() + "_frame").contentDocument.forms[0].param3.value = data;
	    }
	},
	setParam4: function(data){
	    this.param4 = data;

	    if (this.frameReady)
	    {
	        if (document.all)
	            $(this.getFullId() + "_frame").contentWindow.document.forms[0].param4.value = data;
	        else
	            $(this.getFullId() + "_frame").contentDocument.forms[0].param4.value = data;
	    }
	},
	setCaption: function(data){
		try{
			this.title = data;			
			if (this.frameReady)
			{
				if (document.all)
					$(this.getFullId() + "_frame").contentWindow.document.getElementById("content").innerHTML = data;
				else
					$(this.getFullId() + "_frame").contentDocument.getElementById("content").innerHTML = data;			
			}
		}catch(e){
			alert(e);
		}
	},
	getValue: function(){
	    if (this.frameReady)
	    {
	        if (document.all)
	            return $(this.getFullId() + "_frame").contentWindow.document.forms[0].uploadFile.value;
	        else
	            return $(this.getFullId() + "_frame").contentDocument.forms[0].uploadFile.value;
	    }
	    else
	        return "";
	},	
	doClick: function(data){		
		if (document.all)
			$(this.getFullId() + "_frame").contentWindow.document.forms[0].uploadFile.click();
		else
			$(this.getFullId() + "_frame").contentDocument.forms[0].uploadFile.browse();	
	},
	setMaxFile: function(data){
		this.maxFile = data;
	},
	setMultiFile: function(data){
		this.multiFile = data;
	},
	doSelectChange: function(element){
		try{		
			var new_element = document.createElement( 'input' );
			new_element.type = 'file';
			new_element.style.fontFamily= "Arial";
			new_element.style.fontSize = "9pt";		
			new_element.uploader = this;
			new_element.onchange = function()
			{
				this.uploader.doSelectChange(this);			
			};
			// Add new element
			
			var step = "add element";
			element.multi_selector.addElement( new_element );
			// Update list
			step = "update list row";
			element.multi_selector.addListRow( element );
			// Hide this: we can't use display:none because Safari doesn't like it
			element.style.position = 'absolute';
			element.style.left = '-1000px';
			step = "insert before element " + element +" "+element.parentNode.tagName;
			if (document.all)
			 	element.parentNode.insertBefore( new_element, element);
			else
			 	element.parentNode.insertBefore( new_element, element);
			// Apply 'update' to element
		}catch(e)
		{
			systemAPI.alert("[uploader]::doSelectChange:"+e,step);
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
	uploadTo: function(folder){
		this.setParam1("uploadTo");
		this.setParam2(folder);
		this.upload();
	},
	setAutoSubmit: function(data){
		this.autoSubmit = data;	
	},
	usingFlash: function(){
		try{
			this.isFlash = true;
			var flash = "jambooIDE-debug/uploader.swf";
			var obj = $(this.getFullId() +"_swf");						
			obj.style.display = "";
			obj = $(this.getFullId() +"_frame");						
			obj.style.display = "none";
			this.so = new SWFObject(flash, this.getFullId()+"_flash", "100%", "100%", "9.0.0", "#999999");			
			this.so.addParam("wmode","transparent");
			this.so.addParam("quality","high");
			this.so.addVariable("resId",this.resourceId);
			this.so.addVariable("title",this.title);
			this.so.addVariable("resourceOwner",this.resourceOwner);
			if (this.params !== undefined){
				for (var i in this.params) this.so.addVariable(i,this.params[i]);
			}
			this.so.useExpressInstall("classes/app/officeair/swf/playerProductInstall.swf");
			this.so.write(this.getFullId()+"_swf");
		}catch(e){
			systemAPI.alert(e);
		}
	}, 	
	setFlashResource: function(){
		try{
			var obj = systemAPI.getFlexApp(this.getFullId()+"_flash");	
			obj.setResId(this.resourceId);			
		}catch(e){
			systemAPI.alert(e);
		}
	},	
	setFlashTitle: function(){
		if (this.title !== undefined){
			var obj = systemAPI.getFlexApp(this.getFullId()+"_flash");	
			obj.setTitles(this.title);			
		}
	},
	getListFiles: function(){
		if (this.title !== undefined){
			var obj = systemAPI.getFlexApp(this.getFullId()+"_flash");	
			return obj.getListFiles();			
		}
	}
});
	
window.control_multiSelector = function(list_target, max ){
	window.control_multiSelector.prototype.parent.constructor.call(this);
	this.list_target = list_target;
	// How many elements?
	this.count = 0;
	// How many elements?
	this.id = 0;
	// Is there a maximum?
	if( max ){
		this.max = max;
	} else {
		this.max = -1;
	};
};
window.control_multiSelector.extend(window.Function);
window.control_multiSelector.implement({
	addElement: function(element){
		try
		{
			// Make sure it's a file input element
			var step = "check element "+element;
			if ((element.tagName == 'INPUT') && (element.type == 'file' ))
			{
				// Element name -- what number am I?
				step = "create id";			
				element.name = 'uploadFile' + this.id++;
//			element.id = 'uploadFile' + this.id++;
				// Add reference to this object
				step = "init multi selector";
				element.multi_selector = this;
				// What to do when a file is selected
				step = "define onchange";
/*			
				element.onchange = function(){
					step = "create new element";
					// New file input
					var new_element = document.createElement( 'input' );
					new_element.type = 'file';
					new_element.style.fontFamily= "Arial";
					new_element.style.fontSize = "9pt";
					// Add new element
					step = "insert before element";
					this.parentNode.insertBefore( new_element, this );
					// Apply 'update' to element
					step = "add element";
					this.multi_selector.addElement( new_element );
					// Update list
					step = "update list row";
					this.multi_selector.addListRow( this );
					// Hide this: we can't use display:none because Safari doesn't like it
					this.style.position = 'absolute';
					this.style.left = '-1000px';				
				};
*/			
				// If we've reached maximum number, disable input element
				if( this.max != -1 && this.count >= this.max ){
					element.disabled = true;
				};
				// File element counter
				this.count++;
				// Most recent element
				this.current_element = element;
				
			} else {
				// This can only be applied to file input elements!
				alert( 'Error: not a file input element' );
			};
		}catch(e)
		{
			alert("[control_multiselector]::addElement:"+e+"\r\n"+step);
		}
	},
	addListRow: function(element){
		try
		{
			// Row div
			var new_row = document.createElement( 'div' );
			// Delete button
			var new_row_button = document.createElement( 'input' );
			new_row_button.type = 'button';
			new_row_button.value = 'Delete';
			new_row_button.style.fontFamily= "Arial";
			new_row_button.style.fontSize = "9pt";
			// References
			new_row.element = element;
			// Delete function
			new_row_button.onclick= function(){
				// Remove element from form
				this.parentNode.element.parentNode.removeChild( this.parentNode.element );
				// Remove this row from the list
				this.parentNode.parentNode.removeChild( this.parentNode );
				// Decrement counter
				this.parentNode.element.multi_selector.count--;
				// Re-enable input element (if it's disabled)
				this.parentNode.element.multi_selector.current_element.disabled = false;
				// Appease Safari
				//    without it Safari wants to reload the browser window
				//    which nixes your already queued uploads
				return false;
			};
			// Set row value
			new_row.innerHTML = element.value;
			// Add button
			new_row.appendChild( new_row_button );
			// Add it to the list
			this.list_target.appendChild( new_row );			
		}catch(e)
		{
			alert("[control_multiselector]::addListRow:"+e);
		}
	},
	eventMouseMove: function(event){
		if (this.hint != "")
			window.system.showHint(event.clientX, event.clientY, this.hint,true);
	}
});
/*
<?php 	if ($_REQUEST["ctrl"]== "default"){
						echo "<div  class='button' style='cursor:pointer;position: absolute;z-index:2;width: 100%; height:100%;' align='center'>upload</div>";					
						$style = "filter:alpha(opacity:0);position:relative;text-align: left;opacity: 0;moz-opacity: 0;background:#ff9900;z-index:3;";
					}else{
						$style = "filter:alpha(opacity:100);position:relative;text-align: left;opacity: 1;moz-opacity: 1;z-index:3;";
					}
					echo '<input type="file" name="uploadFile" style="$stlyecursor:pointer;width:100%;font-family: Arial;font-size: 9pt;top:0"  onChange="doChange(event)"/>';
			?>		
*/
