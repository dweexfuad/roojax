function showLoading(msg){
	//$("#loading_img").show();	
	$("#loading").show();
	$("#loading_txt").html(msg);

};
function hideLoading(){
	//$("#loading_img").hide();	
	$("#loading").hide();
	$("#loading_txt").html('');
};
function showProgress(msg){
	$("#progress_text").text(msg);
	$("#progress").show();	
	//$("#loading_img").show();	
};
function hideProgress(){
	$("#progress").hide();
	//$("#loading_img").hide();	
};
function showStatus(msg){
	$("#progress").show();
	$("#progress_text").text(msg);
};
function hideStatus(){
	$("#progress").hide();
};
function block(){
	$("#system_block").show();
};
function unblock(){
	$("#system_block").hide();
};
function error_log(msg){
	if (system.debuggingMode){
		$("#error_log").css({left: 0, top :$(window).height() - 100, width:$(window).width(), height: 100 });	//$(window).width() - 200//, top:$(window).height() - 200
		$("<div class='error'>"+msg+"</div>").appendTo($("#error_log_cont"));
		$("#error_log_cont").scrollTop(100000000);
		$("#error_log").show("slow");	
		$("#error_log").click(function(){
			$(this).hide("slow", function(){
				$("#error_log_cont").contents().each(function(){
					$(this).remove();
				});
			});		
		});
	}
};
function setEvent(fn) {
    try{        
        if (document.all)
            return new Function(fn);
        else return new Function("event",fn);           
    }catch(e){
        alert("event " + e);
    }
};
setCookie = function(c_name,value,exdays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
};
getCookie = function(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  x=x.replace(/^\s+|\s+$/g,"");
	  if (x==c_name)
		{
		return unescape(y);
		}
	  }
};
function trim(text){
	return $.trim(text);
};
function showHint(msg, x, y){
	try{
		if (trim(msg) != ""){
			$("#hint_msg").html(msg);	
			$("#hint").css({left : x, top: y, width : $("#hint_msg").width(), height:"auto"});
			$("#hint").shadow();
			$("#hint").show().delay(5000).hide("slow");
		}
	}catch(e){
		error_log(e);
	}
};
function hideHint(){
	$("#hint").hide("slow");
};
function getCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  x=x.replace(/^\s+|\s+$/g,"");
	  if (x==c_name)
		{
		return unescape(y);
		}
	  }
};
function getBasicResourceId()
{
    var result = window.basicResourceId;
    window.basicResourceId++;
    
    return result;
};
function setCaret(o,start, end){
	try{		
		if("selectionStart" in o){						
			o.setSelectionRange(start, end);
		}else if(document.selection){
			var t = o.createTextRange();
			end -= start + o.value.slice(start + 1, end).split("\n").length - 1;
			start -= o.value.slice(0, start).split("\n").length - 1;            
            t.moveStart("character", start), t.moveEnd("character", end), t.select();
		}
		o.focus();
	}catch(e){
		alert("$setCaret:"+e);
	}
};
function getCaret(o){		
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate();
		r.moveEnd('character', o.value.length);
		if (r.text == '') return o.value.length;
		return o.value.lastIndexOf(r.text);
	} else return o.selectionStart;
};
function startSystem(){
	$("#system").css({width:$(window).width(), height:$(window).height()});		
	$("#progress").css({width:$(window).width()});		
	showProgress("Loading system libraries....");						
	uses("rexml;XMLAble;component;control;containerComponent;containerControl;buttonState;system_system;arrayMap;eventHandler;arrayList;");
	uses("application;commonForm;server_util_arrayList;server_Request;server_Response;server_RemoteObject;util_Connection;");
	uses("form;util_dbLib;"+window.initApp +";"+ window.initApp.substr(0,window.initApp.length - 3) +"fMain;");
	showProgress("initialization system...");				
	if (system_system){
		showProgress("system start...");
		window.system = new system_system();								
		showProgress("start Application...");		
		window.system.init(window.initApp, window.paramApp);		
		showProgress("welcome...");				
		$("#splash").hide("slow");
		$("#splash").remove();
		hideProgress();		
	}
};
/***********************************************************************

***********************************************************************/
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();
	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
	    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
	    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
	    /(msie) ([\w.]+)/.exec( ua ) ||
	    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
	    [];
	return {
	    browser: match[ 1 ] || "",
	    version: match[ 2 ] || "0"
	};
};
if ( !jQuery.browser ) {
	try{
		matched = jQuery.uaMatch( navigator.userAgent );
		browser = { msie: false, opera : false, firefox : false};
		if ( matched.browser ) {
		    browser[ matched.browser ] = true;
		    browser.version = matched.version;
		    browser.name = matched.browser;
		}
		// Chrome is Webkit, but Webkit is also Safari.
		if ( browser.chrome ) {
		    browser.webkit = true;
		} else if ( browser.webkit ) {
		    browser.safari = true;
		}
		jQuery.browser = browser;
	}catch(e){
		alert(e);
	}

};
function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
};
systemAPI = {
	alert : function(msg,addMsg){
				error_log(msg);
				error_log("info:"+addMsg);
			},
	browser : $.browser,
	mobile : detectmob()
};


window.Function.prototype.extend = function(parentClassOrObject){
    try
    {				
        if (typeof(parentClassOrObject) == "function")
        {
        	if (parentClassOrObject.constructor == Function)
            {
                this.prototype = new parentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.parent = parentClassOrObject.prototype;				
    	    }
    	    else
    	    {
                this.prototype = parentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.parent = parentClassOrObject;
    	    }			
            return this;
        }
    }
    catch (e)
    {
        if (this.className != undefined)
            alert("Error when extending class : " + this.className + " : " + e);
        else
            alert("Error when extending class : " + this + " : " + e);
    }
};
window.Function.prototype.implement = function(a1, a2, a3){
	try{
		if (a2 == undefined) a2 = true;
		if (typeof a1 == 'string') return this.addMethod(a1, a2, a3);	
		for (var p in a1) this.addMethod(p, a1[p], a2);						
	}catch(e){
		alert(e);
	}		
};

window.Function.prototype.addMethod = function(name, method, force){				
		if (force || !this.prototype[name]) eval( "this.prototype."+ name+" = "+method);			
};

window.Function.prototype.add = function(a1, a2, a3){
	try{
		if (a2 == undefined) a2 = true;
		if (typeof a1 == 'string') return this.addMethod(a1, a2, a3);	
		for (var p in a1) this.addMethod(p, a1[p], a2);						
	}catch(e){
		alert(e);
	}		
};

/**********************************************************************/
function classExists(c) {
    return typeof(c) == "function" && typeof(c.prototype) == "function" ? true : false;
}; 
function loadXMLDoc(xmlFile){
	try //Internet Explorer
	  {
		var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
	  }
	catch(e)
	  {
	  try //Firefox, Mozilla, Opera, etc.
	    {
			if (xmlFile.search(".xml") != -1){
				var  xmlDoc= document.implementation.createDocument("","",null);			
				xmlDoc.async=false;
			}else var parser= new DOMParser();									
	    }
	  catch(e) {alert(e.message)}
	  }
	try 
	  {	  
		  if (xmlFile.search(".xml") != -1)
			xmlDoc.load(xmlFile);	  
		  else {
			 if (parser !== undefined)
				var xmlDoc=parser.parseFromString(xmlFile,"text/xml");
			else xmlDoc.loadXML(xmlFile);
		  }	  
		  return xmlDoc;
	  }
	catch(e) {alert(e.message)}
};
function uses(className, alwaysLoad,classFile, param, param2){			
	if (alwaysLoad === undefined) alwaysLoad = false;
	if (classFile === undefined) classFile = true;
	if (param2 === undefined) param2 = "";
	var classExist = false;		
	try{	
		var cn = className.split(";");
		var cnTmp = "",
			script="";
		var classExist = false;			
		showProgress("load Class");		
		var t = "";				
		for (var i=0;i < cn.length;i++){
			if (cn[i] != ""){
				if (cn[i].search("_") == -1 && cn[i] != ""){									
					cn[i] = "control_"+cn[i];					
				}
				script =  "try {classExist = (" + cn[i] + " != undefined); } catch (e) {classExist = false;}";				   						   
				//script = "classExist = classExists("+cn[i]+"); ";
				eval(script);										
				if ((!classExist || alwaysLoad) ) if (cnTmp == "") cnTmp = cn[i]; else cnTmp += ";"+cn[i];
			}
		}				
		if (cnTmp == "") {
			hideProgress();				
			return false;
		}							
		className = cnTmp;
		$.ajax({
			url : "uses.php",
			type : "POST",
			//dataType :"script",
			async : false,
			data : {	mode	:"loadMultiClass",
						className:className,
						param2	: param2
					},
			success: function(data, status){		
				script = data;
				try{									
					eval("try { " + script + " } catch (e2) {}");						
				}catch (e){                        						
					alert("Error Loading Class:"+className + ":"+e);
				}
				hideProgress();									
								
			},
			error: function(xhr, desc, err) {	
				console.log("Desc: " + desc + "\nErr:" + err);
			}

		});						
	}catch(e){
		hideProgress();
		error_log("Server Connection Failed :Error Loading Class "+className);			
	}
};
function urldecode(str) {
	var encoded = str;
	return decodeURIComponent(encoded.replace(/\+/g,  " "));
};
function urlencode(str){
		   var replaceCharArray = new Array();
		   	   
		   replaceCharArray["%"] = "%25";
		   replaceCharArray["\r"] = "%0D";
		   replaceCharArray["\n"] = "%0A";
		   replaceCharArray["+"] = "%2B";
		   replaceCharArray[" "] = "+";
		   replaceCharArray["!"] = "%21";
		   replaceCharArray['"'] = "%22";
		   replaceCharArray["#"] = "%23";
		   replaceCharArray["$"] = "%24";
		   replaceCharArray["&"] = "%26";
		   replaceCharArray["'"] = "%27";
		   replaceCharArray["("] = "%28";
		   replaceCharArray[")"] = "%29";
		   replaceCharArray["*"] = "%2A";
		   replaceCharArray[","] = "%2C";
		   replaceCharArray["/"] = "%2F";
		   replaceCharArray[":"] = "%3A";
		   replaceCharArray[";"] = "%3B";
		   replaceCharArray["<"] = "%3C";
		   replaceCharArray["="] = "%3D";
		   replaceCharArray[">"] = "%3E";
		   replaceCharArray["?"] = "%3F";
		   replaceCharArray["@"] = "%40";
		   replaceCharArray["["] = "%5B";
		   replaceCharArray['\\'] = "%5C";
		   replaceCharArray["]"] = "%5D";
		   replaceCharArray["^"] = "%5E";
		   replaceCharArray["`"] = "%60";
		   replaceCharArray["{"] = "%7B";
		   replaceCharArray["|"] = "%7C";
		   replaceCharArray["}"] = "%7D";
		   replaceCharArray["~"] = "%7E";
		
		if (typeof(str) == "string")
	    {
	        var result = new Array();
	        var lgt = str.length;
	            
	        var nowChar = "";
	        var replaceStr = undefined;
	            
	        for (var i = 0; i < lgt; i++)
	        {
	            nowChar = str.charAt(i);
	            
	            replaceStr = replaceCharArray[nowChar];
	                
	            if (replaceStr != undefined)
	                result.push(replaceStr);
	            else                 
	                result.push(nowChar);
	        }
	            
		    return result.join("");
		}
		else
	        return str;
};
function downloadFile(request, target){
	try{
		//showStatus("Requesting...");
		//showProgress("download...");
		var iframe = $("#downloader").get(0);	
		var doc = iframe.contentWindow.document || iframe.contentDocument;	
		//var doc = iframe.contentWindow.document;	
		var form = doc.forms[0];    
		if (target) form.target = target;
		else form.target = "framecontainer";
		form.request.value = urlencode(request.encode64());    		
		form.submit();
	}catch(e){
		alert(e);
	}
};

