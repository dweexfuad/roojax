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
function error_log(msg, show){
	/*if (system.debuggingMode){
		$("#error_log").css({left: 0, top :$(window).height() - 100, width:$(window).width(), height: 100 });	//$(window).width() - 200//, top:$(window).height() - 200
		$("<div class='error'>"+msg+"</div>").appendTo($("#error_log_cont"));
		$("#error_log_cont").scrollTop(100000000);
		if (show)
			$("#error_log").show("slow");	
		$("#error_log").click(function(){
			$(this).hide("slow", function(){
				$("#error_log_cont").contents().each(function(){
					$(this).remove();
				});
			});		
		});
	}*/
	console.log(msg);
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
			$("#hint").show().delay(3000).hide("slow");
			if ($("#hint").offset().top + $("#hint_msg").height() + 10 > $(window).height()){
				y = y - $("#hint_msg").height() - 25;
				$("#hint").css({top : y });
			}
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
var MD5 = function (string) {
 
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
     }
 
     function F(x,y,z) { return (x & y) | ((~x) & z); }
     function G(x,y,z) { return (x & z) | (y & (~z)); }
     function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
 
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
 
    x = ConvertToWordArray(string);
 
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
 
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
    return temp.toLowerCase();
}
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
	uses("rexml;XMLAble");
	uses("util_EventEmitter;component;control;containerComponent;containerControl;buttonState;system_system;arrayMap;eventHandler;arrayList");
	uses("application;commonForm;server_util_arrayList;server_Request;server_Response;server_RemoteObject;util_Connection");
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
(function($) { 
	$.fn.uaMatch = function( ua ) {
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
	}
	var matched = $.uaMatch( navigator.userAgent );
	var browser = { msie: false, opera : false, firefox : false};
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
	$.browser = browser || {};

})(jQuery);
/*if ( !jQuery.browser ) {
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

};*/
function loadCSS(cssfile){
    var script = "";
    $.ajax({
        url : "uses.php",
        type : "POST",
        //dataType :"script",
        async : false,
        data : {    mode    :"loadCss",
                    filename:cssfile
                },
        success: function(data, status){        
            script = data;
            
            hideProgress();                                 
                            
        },
        error: function(xhr, desc, err) {   
            console.log("Desc: " + desc + "\nErr:" + err);
        }

    });   
    return script;
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

var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
Class = function(){};
Class.extend = function(prop) 
{
	var _super = this.prototype;
	
	initializing = true;
	var prototype = new this();
	initializing = false;
	
	for (var name in prop) 
	{
		prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		(function(name, fn)
		{
			return function() 
			{
				var tmp = this._super;
				this._super = _super[name];
				var ret = fn.apply(this, arguments);        
				this._super = tmp;
				return ret;
			};
		})(name, prop[name]) :
		prop[name];
	}
	
	function Class() 
	{
		if ( !initializing && this.init )
			this.init.apply(this, arguments);
	}
	
	Class.prototype = prototype;
	Class.prototype.constructor = Class;
	Class.extend = arguments.callee;
	
	return Class;
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
        //console.log(className);
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
					//console.log(data);
                    eval("try { " + script + " } catch (e2) {console.log(e2);}");						
				}catch (e){                        						
                    alert("Error Loading Class:"+className + ":"+e);
				}
				hideProgress();									
								
			},
			error: function(xhr, desc, err) {	
				console.log("Desc "+ className +": " + desc + "\nErr:" + err);
			}

		});						
	}catch(e){
		hideProgress();
		error_log("Server Connection Failed :Error Loading Class "+className);			
	}
};
function usesasync(className, cb, forceLoaded){			
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
				if ((!classExist || forceLoaded) ) if (cnTmp == "") cnTmp = cn[i]; else cnTmp += ";"+cn[i];
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
			data : {	mode	:"loadMultiClass",
						className:className,
						param2	: ""
					},
			success: function(data, status){		
				script = data;
				try{				
					eval("try { " + script + " } catch (e2) {}");						
					cb(true);
				}catch (e){                        						
					cb(false);
					alert("Error Loading Class:"+className + ":"+e);
				}
				hideProgress();									
								
			},
			error: function(xhr, desc, err) {	
				console.log("Desc: " + desc + "\nErr:" + err);
			}

		});						
	}catch(e){
		console.log(e);
		hideProgress();
		cb(false);
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
function getDetailNIK(nik){
	return $.ajax({
	        type: 'get',
	        url: 'dataKaryawan.php',
	        data:  "nik="+nik,
	        async : false,
	        beforeSend: function(xhr) {
	            showProgress("get NIK...");
	        },
	        complete: function() {
	            hideProgress("");
	            
	        },
	        error: function(xhr, status, thrown){
		        alert(status +":"+ thrown);
	        }
	
		}).responseText;
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


function findPos(form, obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft;
		curtop = obj.offsetTop;
		while (obj = obj.offsetParent != form?obj.offsetParent:undefined) {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		}
	}
	return [curleft,curtop];
};