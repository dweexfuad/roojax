//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.app_saku_app = function(owner){
	window.app_saku_app.prototype.parent.constructor.call(this, owner);
	this.className = "app_saku_app";
	this.onTerminate.set(this,"doTerminate");
	this.form = undefined;
	this.setTitle("MANTIS");
	this.showForm();
	system.debuggingMode = true;
};
window.app_saku_app.extend(window.application);
window.app_saku_app.implement({
	showForm: function(){
		try
		{
			uses("util_dbLib;form;childForm;util_financeLib;app_saku_fLogin;label;util_EventEmitter;util_JSONRPC");	//;
			this.services = new util_JSONRPC("server/proxy.php");
			var self = this;
			this.services.on("ready", function(){
                console.log("ready");
			});
			this.services.on("error", function(message){
                console.log("error BPC" + message);
				system.alert(this, message);
			});
			this._dbSetting = "oramantis";
			

			this._rfcCall = true;			
			this._emailAktif = true;
			this._mainForm = new app_saku_fMain(this);	
			this.activeForm = this._mainForm;
			this.setActiveForm(this._mainForm);	
			this._mainForm.show();					
			this._mainForm.gotoLogin();
		}catch(e)
		{
			systemAPI.alert(this+"$showMainForm",e);
		}
	},
	doTerminate: function(sender){	
	},	
	restart: function(){	
		this.logout();		
		this._mainForm.free();
		this.showForm();
		this._isLogedIn = false;
	},	
	loginFocus: function(){
		this._mainForm.form.e0.setFocus();
	},	
	logout: function(){		
		try{
			/*if (this._isLogedIn){
				showProgress("Logout ... ");
				var http = new XMLHttpRequest();
				var params = "uid="+this._userSession+"&param="+this._dbSetting;
				http.open("POST", "server/logout.php", true);
				http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
				http.setRequestHeader("Accept-Encoding", "gzip");  
				http.send(params);	        
			}*/
		}catch(e){
			alert(e);
		}
	},
	doKeyDown: function(charCode, buttonState, keyCode, event){
		try{	
			window.app_saku_app.prototype.parent.doKeyDown.call(this, charCode, buttonState, keyCode, event);
			var target = document.all ? event.srcElement : event.target;
			if (this.activeForm.activeChildForm !== undefined) {
				if (system.activeApplication.activeForm !== undefined && buttonState.isAltKey()){					
					if (charCode == "S" || charCode == "s" && this._mainForm.bSimpan !== undefined ){ 
						if (system.activeApplication.activeForm.bSimpan.enabled)
							system.activeApplication.activeForm.bSimpan.click();
					}
					if (charCode == "E" || charCode == "e" && system.activeApplication.activeForm.bEdit !== undefined ){
						if (system.activeApplication.activeForm.bEdit.enabled) 
							system.activeApplication.activeForm.bEdit.click();
					}
					if (charCode == "H" || charCode == "h" && system.activeApplication.activeForm.bHapus !== undefined ){
						if (system.activeApplication.activeForm.bHapus.enabled) 
							system.activeApplication.activeForm.bHapus.click();
					}
					if (charCode == "C" || charCode == "c" && system.activeApplication.activeForm.bClear !== undefined) 
						system.activeApplication.activeForm.bClear.click();
					if (charCode == "X" || charCode == "x" ) 
						system.activeApplication.activeForm.bTutup.click();										
					return false;
				}	
				switch (keyCode){
					case 32 :
					case 8	:
					case 40	:
					case 38	:
					case 33	:
					case 34 :
					case 35	:
					case 39	: if (target.id.search("inplaceEdit") == -1 && target.id.search("edit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1))
							return false;
						  else if (keyCode == 40 && target.id && target.id.search("edit") > -1)
							return false;
						   else return true;
					break;
					case 40	: if (target.id && target.id.search("edit") > -1) return false;
							else return true;
					default : return true;
					break;
				}				
			}else{																						
				switch (keyCode){
					case 32 :
					case 8	:
					case 40	:					
					case 33	:
					case 34 :
					case 35	:
					case 39	: if (target.id.search("inplaceEdit") == -1 && target.id.search("edit") == -1 && (target.id.search("input") == -1 || target.id.search("textarea") == -1))
							return false;
						  else if (keyCode == 40 && target.id && target.id.search("edit") > -1)
							return false;
							else return true;
					break;
					case 40	: if (target.id && target.id.search("edit") > -1) return false;
							else return true;
					default : return true;
					break;
				}		
			}
		}catch(e){
			systemAPI.alert(this+"$keyDown",e);
		}
	},
	readFile: function(handler)
	{
		if (this.captureHadlerList == null)
		{
			this.captureHandlerId = 0;
			this.captureHadlerList = [];
		}

		this.captureHandlerId++;

		if (handler != null)
			this.captureHadlerList.push({id : this.captureHandlerId, handler : handler});

		if (window.File && window.FileReader && window.FileList && window.Blob)
		{
			if (this.fileSelector == null)
			{
				this.fileSelector = new control(this._mainForm);
				this.fileSelector.setInnerHTML("<input type='file' id='fileSelector' accept='text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' style='display:none' onchange='handleFiles(this.files)'>");
				this.fileSelector.setVisible(false);
				
			}

			var fileSelect = document.getElementById("fileSelector");

			if (fileSelect != null)
				fileSelect.click();
			else
				alert("error file select");
		}
		else
		{
			application.alert("Flazo", "Maaf browser anda tidak mendukung fungsi pembacaan file. Mohon upgrade ke versi terbaru");
		}
	},
	handleMessage : function(msg, data)
	{
		switch (msg)
		{
			case "capturePictureOK" :
								if  (this.captureHadlerList != null)
								{
									for (var i = 0; i < this.captureHadlerList.length; i++)
									{
										var obj = this.captureHadlerList[i];

										if (obj.id == data.id)
										{
											if (obj.handler instanceof Array)
												obj.handler[1].apply(obj.handler[0], [data.data]);
											else if (typeof(obj.handler) == "function")
												obj.handler.call(null, [data.data]);
										}
									}
								}
								break;
			case "readPictureOK" :
								if  (this.captureHadlerList != null)
								{
									for (var i = 0; i < this.captureHadlerList.length; i++)
									{
										var obj = this.captureHadlerList[i];

										if (obj.id == data.id)
										{
											if (obj.handler instanceof Array)
												obj.handler[1].apply(obj.handler[0], [data.data]);
											else if (typeof(obj.handler) == "function")
												obj.handler.apply(null, [data.data]);
										}
									}
								}
								break;
			case "readOK" :
								try{
									if  (this.captureHadlerList != null)
									{
										for (var i = 0; i < this.captureHadlerList.length; i++)
										{
											var obj = this.captureHadlerList[i];

											if (obj.id == data.id)
											{
												if (obj.handler instanceof Array)
													obj.handler[1].apply(obj.handler[0], [data.data]);
												else if (typeof(obj.handler) == "function")
													obj.handler.call(null, data.data, data.files);
											}
										}
									}
								}catch(e){
									alert(e);
								}
								break;
		}
	}
});
function handleFiles(fileList)
{
	try{
		if (fileList.length > 0)
		{
			if (window.fileReader == null)
			{
				window.fileReader = new FileReader();
				window.fileReader.onload =
					function(event)
					{
						var result = event.target.result;
						system.getActiveApplication().handleMessage("readOK", {id : system.getActiveApplication().captureHandlerId, data : result, files:fileList[0] });
					};
			}
			window.fileReader.readAsArrayBuffer(fileList[0]);
	
		}
	}catch(e){
		alert(e);
	}
}
function process_wb(wb) {
	output = to_json(wb);//JSON.stringify(to_json(wb), 2, 2);
	return output;
}
function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

function to_formulae(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
		if(formulae.length > 0){
			result.push("SHEET: " + sheetName);
			result.push("");
			result.push(formulae.join("\n"));
		}
	});
	return result.join("\n");
}
function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return o;
}

function ab2str(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
	return o;
}

function s2ab(s) {
	var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
	for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
	return [v, b];
}


Date.prototype.strToDate = function(strDate){
	if (strDate == undefined) strDate = "1900-01-01";
  if (strDate.search("/") != -1)
  {
	//20/01/2008
	var d = strDate.split("/");
	var ret = new Date(parseInt(d[2],10),parseInt(d[1],10) - 1,parseInt(d[0],10));	
  }else 
  {
	//2008-01-20
	var d = strDate.split("-");
	if (d[0].length == 4)
		var ret = new Date(parseInt(d[0],10),parseInt(d[1],10) - 1,parseInt(d[2],10));	
	else var ret = new Date(parseInt(d[2],10),parseInt(d[1],10) - 1,parseInt(d[0],10));	
  }	  
  return ret;
};
Date.prototype.sqlDateStr = function(strDate){
	if (strDate == undefined) strDate = "1900-01-01";
  if (strDate.search("/") != -1)
  {
	//20/01/2008
	var d = strDate.split("/");
	var ret = parseInt(d[2],10)+"-"+parseInt(d[1],10)+"-"+parseInt(d[0],10);	
  }	  
  return ret;
};
