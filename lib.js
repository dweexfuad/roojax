function fail()
{
	alert("Failed Access get Filesystem");
	console.log("failed to get filesystem");	
}

if (Uint8Array === undefined){
	(function() {
	try {
	var a = new Uint8Array(1);
	return; //no need
	} catch(e) { }
	function subarray(start, end) {
	return this.slice(start, end);
	}

	function set_(array, offset) {
	if (arguments.length < 2) offset = 0;
	for (var i = 0, n = array.length; i < n; ++i, ++offset)
	  this[offset] = array[i] & 0xFF;
	}

	// we need typed arrays
	function TypedArray(arg1) {
	var result;
	if (typeof arg1 === "number") {
	   result = new Array(arg1);
	   for (var i = 0; i < arg1; ++i)
		 result[i] = 0;
	} else
	   result = arg1.slice(0);
	result.subarray = subarray;
	result.buffer = result;
	result.byteLength = result.length;
	result.set = set_;
	if (typeof arg1 === "object" && arg1.buffer)
	  result.buffer = arg1.buffer;

	return result;
	}

	window.Uint8Array = TypedArray;
	window.Uint32Array = TypedArray;
	window.Int32Array = TypedArray;
	window.uint8array = TypedArray;
	})();
}
__uses_waitlist = [];
__classDir = "js";
__Color = [];
__Color["colorPrimary"] = "#d32f2f";
__Color["colorPrimaryDark"] = "#b71c1c";
__Color["colorApply"] = "#25A5F2";
__Color["colorCancel"] = "#b71c1c";
__Color["colorAccent"] = "#03A9F4";
__Color["colorLightPrimary"] = "#ffffff";
__Color["colorText"] = "#FFFFFF";
__Color["colorPrimaryText"] = "#212121";
__Color["colorSecondaryText"] = "#727272";
__Color["colorDivider"] = "#d5d5d5";
__Color["colorBackground"] = "#d9d9d9";
__Color["headerBackground"] = "#555555";
__Color["tab_line"] = "#1976D2";
__Color["textColorPrimary"] = "#212121";
__Color["textColorSecondary"] = "#727272";
__Color["linkColor"] = "#42a5f5";
__Color["white"] = "#FFFFFF";
__Color["black"] = "#000000";

__Color["warning"] = "#f39c12";
__Color["success"] = "#00a65a";
__Color["danger"] = "#dd4b39";
__Color["info"] = "#00c0ef";
__Color["primary"] = "#3c8dbc";

__Color["red"] = "#d50000";
__Color["teal"] = "#00bfa5";
__Color["aqua"] = "#00b0ff";
__Color["yellow"] = "#f57f17";
__Color["green"] = "#4caf50";


function uses(classList, cb)
{
	var loadIndicator = document.getElementById("loadIndicator");
	__classVer = "?v="+Date().toString();

	if (loadIndicator != null)
		loadIndicator.style.display = "";

	if (typeof(classList) == "string")
	{
		var className = classList;
		classList = [className];
	}

	//console.log("Uses : " + JSON.stringify(classList));

	var wait = false;

	var head = document.getElementsByTagName('head')[0];

	for (var i in classList)
	{

		if (!classExist(classList[i]))
		{
			var className = classList[i];

			wait = true;

			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = filePath(className);
			head.appendChild(script);

			script.onload = function () { usesComplete(className); }
		}
	}

	__uses_waitlist.push({usesList : classList, callBack : cb});

	if (!wait)
		usesComplete("synch : " + JSON.stringify(classList));

	function filePath(className)
	{
		var result = className;
		result = result.replace(/\./g, "/");
		
		result = __classDir + "/" + result + ".js" + __classVer;
		console.log(result);
		return result;
	}
}

function classExist(className)
{
	var result = false;
	
	var script = "result = (" + className + " != undefined);";

	try
	{
		console.log(script);
		eval(script);
	}
	catch (e)
	{
		result = false;
	}
	console.log(result);
	return result;
}

function usesComplete(className)
{
	try{
		console.log("usesComplete : " + className);

		do
		{
			var i = 0;
			var changed = false;

			while (i < __uses_waitlist.length)
			{
				var item = __uses_waitlist[i];

				var complete = true;
			
				for (var j in item.usesList)
				{
					
					if (!classExist(item.usesList[j]))
					{
						complete = false;
						break;
					}
				}

				if (complete)
				{
					item.callBack.call(null);
					__uses_waitlist.splice(i, 1);
					changed = true;
				}
				else
					i++;
			}
		} while (changed);

		if (__uses_waitlist.length <= 0)
		{
			var loadIndicator = document.getElementById("loadIndicator");

			if (loadIndicator != null)
				loadIndicator.style.display = "none";
		}
	}catch(e){
		console.log(e);
	}
}

function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}
//web
var server = "./../";
//mobile
window.cfNilai = 0;
window.cfDate = 1;
window.cfList = 2;
window.cfButton = 3;
window.cfBoolean = 4;

var request = {};
request.post = function(address, message, callback, hideLoading, errorHandling){
	var urlTarget = address;
	var msEpoch = new Date().getTime();

	if (urlTarget.indexOf("?") <= 0)
		urlTarget += "?timeStamp=" + msEpoch;
	else
		urlTarget += "&timeStamp=" + msEpoch;
    console.log(JSON.stringify(message));
	xhr = $.ajax({url: urlTarget,
		data: JSON.stringify(message),
		type: 'POST',
		dataType : "json",
		headers: {Accept: 'application/json','Access-Control-Allow-Origin': '*'},//,
		crossDomain: true,
		beforeSend: function() {
			if (hideLoading){
					//
			}else 
				app.showLoading();
		},
		complete: function() {
            console.log("complete");
			app.hideLoading();
		},
		success: function (result) {
			try{
				if (true)
				{
					callHandler = true;
					var handlerFunc = null;
					var handlerObj = null;

					if (typeof(callback) == "function")
						handlerFunc = callback;
					else if ((callback instanceof Array) && (callback.length == 2) && (typeof(callback[1]) == "function"))
					{
						handlerObj = callback[0];
						handlerFunc = callback[1];
					}

					if (handlerFunc != null)
					{
						var response = result;
						//console.log(JSON.stringify(response));	
						try
						{
							var responseMessage = response;
						}
						catch (e)
						{
							response = JSON.stringify(response);

							if (errorHandling)
								errorHandling.call(null, "(Success 1.0)Calling " + message.method + ", returning invalid response :" + response );
							else 
								app.alert("Error", "(Success 1.0)Calling " + message.method + ", returning invalid response :" + response,200);
							
							return;
						}
						
						if (responseMessage.error == null){
							if (message.method == "describe")
								handlerFunc.call(handlerObj, responseMessage);//.result
							else handlerFunc.call(handlerObj, responseMessage.result);//
						}else 
							app.alert("Error", "(Success 1.1)Calling " + message.method + ", returning Object Error : " + JSON.stringify(responseMessage.error), 200);
					}
				}

			}catch(e){
                 console.log("error : " + e);    
				 app.hideLoading();
				 if (errorHandling)
					errorHandling.call(null, "(Success 2.0)Calling " + message.method + ", returning Server Error : " + e + " : " + response);
				 else
				 	app.alert("Error", "(Success 2.1)Calling " + message.method + ", returning Server Error : " + e + " : " + response,200);
				// return false;
			 }
		},
		error: function (request,error, thrown) {
			console.log(error +":"+thrown);
			if (errorHandling)
				errorHandling.call(null, "Gagal terhubung ke server");
			else
				app.alert("Error", "Gagal terhubung ke server", 200);
			app.hideLoading();
			//return false;
		}
	});
	return xhr;
};
function serviceMsg(funcName, paramArray, handler, hideLoading, errorHandler)
{
	var message = {jsonrpc : "2.0", method : funcName, params : paramArray, id : 1 };
	
	return request.post(server, message,handler, hideLoading, errorHandler);
}


function initSystem()
{
	//process.on("uncaughtException", function(err) { console.log("error: " + err); });

	function package(fullPackageName)
	{
		var item = fullPackageName.split(".");
		var currName = "";
		
		for (var i = 0; i < item.length; i++)
		{
			if (i == 0)
				currName = item[i];
			else
				currName += "." + item[i];
			
			var script = "this." + currName + " = this." + currName + " || {};";
			eval(script);
		}
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

		
	window.ttNilai = 1;
	//----------------------------------------------------------------------------------------------------------------------------------

	EventEmitter = Class.extend(
	{
		init : function() 
		{
			this.callbackList = {};
			this.onceCallbackList = {};
		},
		
		addListener : function(event, listener) 
		{
			if ((typeof(listener) == "function") || ((listener instanceof Array) && (listener.length == 2) && (typeof(listener[1]) == "function")))
			{
				if (this.callbackList[event] == undefined)
					this.callbackList[event] = new Array();
				
				this.callbackList[event].push(listener);
				
				this.emit("newListener", event, listener);
			}
		},
		
		on : function(event, listener)
		{
			this.addListener(event, listener);
		},
		
		once : function(event, listener) 
		{
			if (typeof(listener) == "function")
			{
				if (this.onceCallbackList[event] == undefined)
					this.onceCallbackList[event] = new Array();
				
				this.onceCallbackList[event].push(listener);
			}
		},
		
		removeListener : function(event, listener) 
		{
			var list = this.callbackList[event];
			
			if (list != undefined)
			{
				var pos = list.indexOf(listener);
				
				if (pos > 0)
					list.splice(pos, 1);
			}
		},
		
		removeAllListeners : function(event)
		{
			if (event != null)
			{
				this.callbackList[event] = undefined;
				this.onceCallbackList[event] = undefined;
			}
			else
			{
				for (var i in this.callbackList)
					this.callbackList[i] = undefined;
				
				for (var i in this.onceCallbackList)
					this.onceCallbackList[i] = undefined;
			}
		},
		
		setMaxListeners : function(n)
		{
			this.maxListener = n;
		},
		
		listeners : function(event)
		{
			return this.callbackList[event];
		},
		
		callFunc : function()
		{
			if (arguments.length > 0)
			{
				var cb = arguments[0];
				
				if (cb != null)
				{
					var param = new Array();
					
					for (var i = 1; i < arguments.length; i++)
						param.push(arguments[i]);
					
					if (cb instanceof Array)
						cb[1].apply(cb[0], param);
					else
						cb.apply(null, param);
				}
			}
		},
		
		emit : function()
		{
			if (arguments.length > 0)
			{
				var event = arguments[0];
				
				var param = new Array();
				
				for (var i = 1; i < arguments.length; i++)
					param.push(arguments[i]);
				
				var list = this.callbackList[event];
				
				if (list != undefined)
				{
					for (var i in list)
					{
						if (list[i] instanceof Array)
							list[i][1].apply(list[i][0], param);
						else
							list[i].apply(null, param);
					}
				}
				
				var list = this.onceCallbackList[event];
				
				if (list != undefined)
				{
					for (var i in list)
					{
						list[i].apply(null, param);
					}
				}
				
				this.onceCallbackList[event] = undefined;
			}
		}
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	package("pasta.gui");

	//----------------------------------------------------------------------------------------------------------------------------------
	pasta.services = EventEmitter.extend(
		{
		init: function(){
			this._super();
			var self = this;
			
			this.request("describe", [], function(data){
				self.session = data.session;
			});
		},
		request: function(funcName, paramArray, handler, hideLoading, errorHandler){
			try{
				var message = {jsonrpc : "2.0", method : funcName, params : paramArray, id : 1, session : this.session };
				request.post(server, message, handler, hideLoading, errorHandler);
			}catch(e){
				console.log(e);
			}
		}
	});
	pasta.gui.LineStyle = EventEmitter.extend(
	{
		init : function() 
		{
			this._super();
			
			this.color = "#000000";
			this.weight = 1;
			this.pattern = "solid"; 		//	dotted | dashed | solid
			this.radius = 0;
		},

		getCSS : function()
		{
			var result = "";
			
			if ((this.color != undefined) && (this.weight != undefined))
				result = this.weight + "px " + this.pattern + " " + this.color;
				
			return result;
		},
		
		getColor : function()
		{
			return this.color;
		},
		
		setColor : function(data)
		{
			this.color = data;
			
			this.emit("change", "color", data);
		},
		
		getWeight : function()
		{
			return this.weight;
		},
		
		setWeight : function(data)
		{
			this.weight = data;
			
			this.emit("change", "weight", data);
		},
		
		getPattern : function()
		{
			return this.pattern;
		},
		
		setPattern : function(data)
		{
			this.pattern = data;
			
			this.emit("change", "pattern", data);
		},
		
		getRadius : function()
		{
			return this.radius;
		},
		
		setRadius : function(data)
		{
			this.radius = data;
			
			this.emit("change", "radius", data);
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.FillStyle = EventEmitter.extend(
	{
		init : function() 
		{
			this._super();
			
			this.color = "#FFFFFF";
			this.image = undefined;
			this.repeat = "repeat";
			this.position = "left top";
			this.size = "left top";
		},

		getCSS : function()
		{
			var result = "";
			
			if (this.image != undefined)
				result = "url(" + this.image + ") " + this.position + " " + this.repeat;
			else if (this.color != undefined)
				result = this.color;
			
			return result;
		},
		
		getColor : function()
		{
			return this.color;
		},
		
		setColor : function(data)
		{
			this.color = data;
			
			this.emit("change", "color", data);
		},
		
		getImage : function()
		{
			return this.image;
		},
		
		setImage : function(data)
		{
			this.image = data;
			
			this.emit("change", "image", data);
		},
		
		getPosition : function()
		{
			return this.position;
		},
		
		setPosition : function(data)
		{
			this.position = data;
			
			this.emit("change", "position", data);
		},
		
		getRepeat : function()
		{
			return this.repeat;
		},
		
		setRepeat : function(data)
		{
			this.repeat = data;
			
			this.emit("change", "repeat", data);
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.ShadowStyle = EventEmitter.extend(
	{
		init : function() 
		{
			this._super();
			
			this.left = 3;
			this.top = 3;
			this.blur = 0;
			this.spread = 0;
			this.color = "#000000";
		},

		getCSS : function()
		{
			var result = "";
			
			if (this.color != undefined)
			{
				result = this.left + "px " + this.top + "px ";
				
				if (this.blur != undefined)
				{
					result += this.blur + "px ";
					
					//if (this.spread != undefined)
						//result += this.spread + "px ";
				}
				
				result += this.color;
			}
			
			return result;
		},
		
		getLeft : function()
		{
			return this.left;
		},
		
		setLeft : function(data)
		{
			this.left = data;
			
			this.emit("change", "left", data);
		},
		
		getTop : function()
		{
			return this.top;
		},
		
		setTop : function(data)
		{
			this.top = data;
			
			this.emit("change", "top", data);
		},
		
		getColor : function()
		{
			return this.color;
		},
		
		setColor : function(data)
		{
			this.color = data;
			
			this.emit("change", "color", data);
		},
		
		getBlur : function()
		{
			return this.blur;
		},
		
		setBlur : function(data)
		{
			this.blur = data;
			
			this.emit("change", "blur", data);
		},
		
		getSpread : function()
		{
			return this.spread;
		},
		
		setSpread : function(data)
		{
			this.spread = data;
			
			this.emit("change", "spread", data);
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Font = EventEmitter.extend(
	{
		init : function() 
		{
			this._super();
			
			this.bold = false;
			this.underline = false;
			this.italics = false;
			this.size = 12;
			this.fontName = '"Helvetica Neueu", Helvetica, sans-serif,"Trebuchet MS", Arial';
			this.color = "#000000";
		},
		
		applyFont : function(canvas)
		{
			canvas.style.fontWeight = this.bold ? "bold" : "normal";
			canvas.style.fontSize = this.size + "px";
			canvas.style.color = this.color;
			canvas.style.fontFamily = this.fontName;
			canvas.style.textDecoration = this.underline ? "underline" : "";
			canvas.style.fontStyle = this.italics ? "italic" : "normal";
		},
		
		wrapHTML : function(data, id) 
		{
			var result = data;
			
			if (this.bold)
				result = "<b id='" + id + "'>" + result + "</b>";
			
			if (this.underline)
				result = "<u id='" + id + "'>" + result + "</u>";
			
			if (this.italics)
				result = "<i id='" + id + "'>" + result + "</i>";
			
			return result;
		},
		
		isBold : function() 
		{
			return this.bold;
		},
		
		setBold : function(data) 
		{
			this.bold = data;
			
			this.emit("change", "bold", data);
		},
		
		isUnderline : function() 
		{
			return this.underline;
		},
		
		setUnderline : function(data) 
		{
			this.underline = data;
			
			this.emit("change", "underline", data);
		},
		
		isItalics : function() 
		{
			return this.italics;
		},
		
		setItalics : function(data) 
		{
			this.italics = data;
			
			this.emit("change", "italics", data);
		},
		
		getSize : function() 
		{
			return this.size;
		},
		
		setSize : function(data) 
		{
			this.size = data;
			
			this.emit("change", "size", data);
		},
		
		getColor : function() 
		{
			return this.color;
		},
		
		setColor : function(data) 
		{
			this.color = data;
			
			this.emit("change", "color", data);
		},
		
		getFontName : function() 
		{
			return this.fontName;
		},
		
		setFontName : function(data) 
		{
			this.fontName = data;
			
			this.emit("change", "fontName", data);
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Control = EventEmitter.extend(
	{
		init : function(options) 
		{
			this._super();
			
			this.visible = true;
			
			this.top = 0;
			this.left = 0;
			
			this.canvas = document.createElement("div");
			
			this.canvas.style.position = "absolute";	
			
			this.canvas.style.userSelect = "none";
			this.canvas.style.webkitUserSelect = "none";
			this.canvas.style.mozUserSelect = "none";
			
			this.enabled = true;
			
			var self = this;
			
			this.border = new pasta.gui.LineStyle();
			this.border.setColor(undefined);
			this.border.on("change",
				function(property, value)
				{
					self.canvas.style.border = self.border.getCSS();
					
					if (property == "radius")
						self.canvas.style.borderRadius = self.border.radius + "px";
				});
			
			this.background = new pasta.gui.FillStyle();
			this.background.setColor(undefined);
			this.background.setImage(undefined);
			this.background.on("change",
				function(property, value)
				{
					self.canvas.style.background = self.background.getCSS();
				});
			
			this.shadow = new pasta.gui.ShadowStyle();
			this.shadow.setColor(undefined);
			this.shadow.on("change",
				function(property, value)
				{
					self.canvas.style.boxShadow = self.shadow.getCSS();
				});
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.class){
					this.canvas.className = options.class;
				}
			}
		},
		
		free : function()
		{
			if (this.parent != null)
			{
				this.parent.delControl(this);
				this.parent = null;
			}
		},
		
		bringToFront : function()
		{
			if (this.parent != null)
				this.parent.bringChildToFront(this);
		},
		
		sendToBack : function()
		{
			if (this.parent != null)
				this.parent.sendChildToBack(this);
		},
		
		addListener : function(event, listener)
		{
			var self = this;
			
			switch (event)
			{
				case "click" :
							$(this.canvas).click(function(e){
								if (self.enabled)
										{
											e.stopPropagation();
											if (!e) e = window.event; 
											self.emit("click", self, e.srcElement == self.canvas, e);
										}
							});
								/*
								this.canvas.onclick = 
									function(e) 
									{ 
										if (self.enabled)
										{
											e.stopPropagation();
											if (!e) e = window.event; 
											self.emit("click", self, e.srcElement == self.canvas, e);
										}
									};
									*/
								break;
				case "dblClick" :
								this.canvas.ondblclick = 
									function(e) 
									{ 
										if (self.enabled)
										{
											if (!e) e = window.event; 
											self.emit("dblClick", self);
										}
									};
								break;
				case "mouseOver" :
								this.canvas.onmouseover = function(e) { if (!e) e = window.event; self.emit("mouseOver", self)};
								break;
				case "mouseOut" :
								this.canvas.onmouseout = function(e) { if (!e) e = window.event; self.emit("mouseOut", self)};
								break;
				case "mouseUp" :
								this.canvas.onmouseup = 
									function(e) 
									{ 
										if (self.enabled)
										{
											if (!e) e = window.event; 
											self.emit("mouseUp", e.offsetX, e.offsetY, self);
										}
									};
								break;
				case "mouseDown" :
								this.canvas.onmousedown = 
									function(e) 
									{ 
										if (self.enabled)
										{
											if (!e) e = window.event; 
											self.emit("mouseDown", e.offsetX, e.offsetY, self);
										}
									};
								break;
				case "touchStart" :
								this.canvas.ontouchstart = 
									function(e) 
									{ 
										if (self.enabled)
										{
											self.emit("touchStart", 0, 0, self);
											e.preventDefault();
										}
									};
								break;
				case "touchEnd" :
								this.canvas.ontouchend = 
									function(e) 
									{ 
										if (self.enabled)
										{
											self.emit("touchEnd", 0, 0, self);
											e.preventDefault();
										}
									};
								break;
				case "swipe" : 
					$(this.canvas).on("swipe", function(){
						self.emit("swipe", self);
					});
				break;
				case "swipeleft" : 
					$(this.canvas).on("swipeleft", function(){
						self.emit("swipeleft", self);
					});
				break;
				case "swiperight" : 
					$(this.canvas).on("swiperight", function(){
						self.emit("swiperight", self);
					});
				break;
			}
			
			this._super(event, listener);
		},
		
		getClientRect : function()
		{
			return this.canvas.getBoundingClientRect();
		},
		
		//--------------------- Setter & Getter -------------------
		
		isEnabled : function()
		{
			return this.enabled;
		},
		
		setEnabled : function(data)
		{
			this.enabled = data;
		},
		
		getParent : function()
		{
			return this.parent;
		},
		
		getCanvas : function()
		{
			return this.canvas;
		},
		
		getCursor : function()
		{
			return this.canvas.style.cursor;
		},
		
		setCursor : function(data)
		{
			this.canvas.style.cursor = data;
		},
		
		getLeft : function()
		{
			return this.left;
		},
		
		getOffsetLeft : function()
		{
			return this.canvas.offsetLeft;
		},
		
		setLeft : function(data)
		{
			this.left = data;
			
			if (typeof(data) == "string")
				this.canvas.style.left = data;
			else
				this.canvas.style.left = data + "px";
		},
		
		getTop : function()
		{
			return this.top;
		},
		
		getOffsetTop : function()
		{
			return this.canvas.offsetTop;
		},
		
		setTop : function(data)
		{
			this.top = data;
			
			if (typeof(data) == "string")
				this.canvas.style.top = data;
			else
				this.canvas.style.top = data + "px";
		},
		
		getWidth : function()
		{
			return this.width;
		},
		
		getOffsetWidth : function()
		{
			return this.canvas.offsetWidth;
		},
		
		setWidth : function(data)
		{
			this.width = data;
			
			if (typeof(data) == "string")
				this.canvas.style.width = data;
			else
				this.canvas.style.width = data + "px";
		},
		
		getHeight : function()
		{
			return this.height;
		},
		
		getOffsetHeight : function()
		{
			return this.canvas.offsetHeight;
		},
		
		setHeight : function(data)
		{
			this.height = data;
			
			if (typeof(data) == "string")
				this.canvas.style.height = data;
			else
				this.canvas.style.height = data + "px";
		},
		
		isVisible : function()
		{
			return this.visible;
		},
		
		setVisible : function(data)
		{
			this.visible = data;
			this.canvas.style.display = (this.visible ? "" : "none");
		},
		
		getTooltip : function()
		{
			return this.canvas.title;
		},
		
		setTooltip : function(data)
		{
			this.canvas.title = data;
		},
		hide: function(){
			var self = this;
			$(this.canvas).fadeOut(function(){
				self.setVisible(false);
			})
		},
		show: function(){
			this.setVisible(true);
			$(this.canvas).fadeIn();
		}
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.ContainerControl = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super(options);
			
			this.controls = new Array();
			this.canvas.style.overflow = "hidden";
			this.clientCanvas = document.createElement("div");
			this.clientCanvas.style.position = "absolute";
			this.clientCanvas.style.left = "0px";
			this.clientCanvas.style.top = "0px";
			this.clientCanvas.style.width = "100%";
			this.clientCanvas.style.height = "100%";
			this.clientCanvas.style.userSelect = "none";
			this.clientCanvas.style.webkitUserSelect = "none";
			this.clientCanvas.style.mozUserSelect = "none";
			
			this.canvas.appendChild(this.clientCanvas);
			
			this.highestZIndex = 1;
			this.lowestZIndex = -1;
		},

		bringChildToFront : function(child)
		{
			child.getCanvas().style.zIndex = this.highestZIndex;
			this.highestZIndex++;
		},
		
		sendChildToBack : function(child)
		{
			child.getCanvas().style.zIndex = this.lowestZIndex;
			this.lowestZIndex--;
		},
		
		addFirstControl : function(control)
		{
			if (control.parent != this)
			{
				if (control && control.canvas)
				{
					control.parent = this;
					this.controls.unshift(control);
					this.clientCanvas.appendChild(control.canvas);
				}
				else
					console.log("unable to addControl :" + JSON.stringify(control));
			}
		},
		
		addControl : function(control) 
		{
			if (control.parent != this)
			{
				if (control && control.canvas)
				{
					control.parent = this;
					this.controls.push(control);
					this.clientCanvas.appendChild(control.canvas);
				}
				else
					console.log("unable to addControl :" + JSON.stringify(control));
			}
		},
		
		delControl : function(control)
		{
			if (control.parent == this)
			{
				var index = this.controls.indexOf(control);
				
				if (index >= 0)
				{
					this.controls.splice(index, 1);
					this.clientCanvas.removeChild(control.canvas);
				}
			}
		},
		
		clear : function()
		{
			for (var i = 0; i < this.controls.length; i++)
			{
				var control = this.controls[i];
				
				this.clientCanvas.removeChild(control.canvas);
				control.parent = undefined;
			}
			
			this.controls.length = 0;
		},
		/*
		addListener : function(event, listener)
		{
			this._super(event, listener);
			
			var self = this;
			
			switch (event)
			{
				case "click" :
								this.canvas.onclick = function(e) { if (!e) e = window.event; self.emit("click", self, e.srcElement == self.clientCanvas)};
								break;
			}
		},
		*/
		//------------------- setter & getter ---------------------
		
		getClientCanvas : function()
		{
			return this.clientCanvas;
		},
		
		getClipMode : function()
		{
			return this.clientCanvas.style.overflow;
		},
		
		setClipMode : function(mode)
		{
			this.clientCanvas.style.overflow = mode;
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Shape = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super(options);
			var self = this;
			
			this.mode = 1;
			this.bgColor = null;
			this.borderWeight = 1;
			this.borderColor = "#000000";
			
			this.canvas.style.backgroundColor = undefined;
			this.canvas.style.border = this.borderWeight + "px solid " + this.borderColor;
		
			this.border.removeAllListeners("change");
			this.border.on("change",
				function(property, value)
				{
					self.setMode(self.mode);
				});
			
			this.background.removeAllListeners("change");
			this.background.on("change",
				function(property, value)
				{
					self.setMode(self.mode);
				});
			if (options){
				if (options.mode) this.setMode(options.mode);
				if (options.borderColor) this.border.setColor(options.borderColor);
				if (options.borderSize) this.border.setWeight(options.borderSize);
			}
		},
		
		//------------------ Setter & Getter -----------------
		
		setMode : function(data)
		{
			this.mode = data;
			
			switch (this.mode)
			{
				case 1 : // rectangle
						this.canvas.style.border = this.border.getCSS();
						this.canvas.style.background = this.background.getCSS();
						break;
				case 2 : // top line
						this.canvas.style.border = "";
						this.canvas.style.background = "";
						
						this.canvas.style.borderTop = this.border.getCSS();
						break;
				case 3 : // left line
						this.canvas.style.border = "";
						this.canvas.style.background = "";
						
						this.canvas.style.borderLeft = this.border.getCSS();
						break;
			}
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Picture = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super(options);
			var self = this;
			
			this.imgObj = new Image();
			this.imgObj.onload = function() 
				{
					//self.setMode(self.mode);
					self.emit("load");
				};
			
			this.canvas.style.overflow = "hidden";
			
			this.mode = 1;
			this.image = null;
			if (options){
				if (options.image) this.setImage(options.image);
				if (options.mode) this.setMode(options.mode);
				
			}
		},
		
		//------------------ Setter & Getter -----------------
		
		setMode : function(data)
		{
			this.mode = data;
			
			switch (this.mode)
			{
				case 1 : // top left
						this.canvas.style.backgroundImage = "url(" + this.imgObj.src + ")";
						this.canvas.style.backgroundRepeat = "no-repeat";
						this.canvas.style.backgroundPosition = "left top";
						this.canvas.style.backgroundSize = "auto";
						break;
				case 2 : // center
						this.canvas.style.backgroundImage = "url(" + this.imgObj.src + ")";
						this.canvas.style.backgroundRepeat = "no-repeat";
						this.canvas.style.backgroundPosition = "center center";
						this.canvas.style.backgroundSize = "auto";
						break;
				case 3 : // thumb
						this.canvas.style.backgroundImage = "url(" + this.imgObj.src + ")";
						this.canvas.style.backgroundSize = "100%";
						this.canvas.style.backgroundRepeat = "no-repeat";
						this.canvas.style.backgroundPosition = "left top";
						break;
				case 4 : // repeat
						this.canvas.style.backgroundImage = "url(" + this.imgObj.src + ")";
						this.canvas.style.backgroundRepeat = "repeat";
						this.canvas.style.backgroundPosition = "left top";
						this.canvas.style.backgroundSize = "auto";
						break;
				case 5 : // best fit
						this.canvas.style.backgroundImage = "url(" + this.imgObj.src + ")";
						this.canvas.style.backgroundSize = "auto 100%";
						this.canvas.style.backgroundRepeat = "no-repeat";
						this.canvas.style.backgroundPosition = "center top";
						break;
				case 6 : // best fit
						this.canvas.style.backgroundImage = "url(" + this.image + ")";
						this.canvas.style.backgroundSize = "cover";					
						this.canvas.style.backgroundRepeat = "no-repeat";
						//this.canvas.style.backgroundPosition = "center top";
						//alert(this.canvas.style.backgroundImage);
						break;
			}
		},
		
		setGray : function(data)
		{
			if (data)
				this.canvas.innerHTML = "<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;background:rgba(0,0,0,0.4)'>&nbsp;</div>";
			else
				this.canvas.innerHTML = "";
		},
		
		getImage : function()
		{
			return this.imgObj.src;
		},
		
		setImage : function(data)
		{
			this.image = data;
			if (data)
			{
				if (typeof(data) == "string")
					this.imgObj.src = data;
				else if (data.src)
					this.imgObj.src = data.src;
			}
			else
				this.canvas.style.backgroundImage = "";
		},
		
		getRealWidth : function() 
		{
			return this.imgObj.width;
		},
		
		getRealHeight : function() 
		{
			return this.imgObj.height;
		},
		
		setWidth : function(data)
		{
			this._super(data);
			
			//this.setMode(this.mode);
		},
		
		setHeight : function(data)
		{
			this._super(data);
			
			//this.setMode(this.mode);
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Label = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super(options);
			
			var self = this;
			
			this.font = new pasta.gui.Font();
			this.font.on("change", 
				function()
				{
					self.font.applyFont(self.canvas);
				});
			
			this.canvas.innerHTML = "";
			this.canvas.textAlign = "left";
			this.canvas.style.overflow = "hidden";
			this.canvas.style.whiteSpace = "nowrap";
			this.canvas.style.textOverflow = "ellipsis";
			
			//this.setHeight(20);
			this.setSelectable(true);
			
			self.font.applyFont(self.canvas);
			
			this.shadow.removeAllListeners("change");
			
			this.shadow.on("change",
				function(property, value)
				{
					self.canvas.style.textShadow = self.shadow.getCSS();
				});
			if (options){
				if (options.caption) this.setCaption(options.caption);
				if (options.align) this.setAlign(options.align);
				if (options.wordWrap) this.setWordWrap(options.wordWrap);
				if (options.bold) this.font.setBold(options.bold);
				if (options.fontSize) this.font.setSize(options.fontSize);
				if (options.color) this.font.setColor(options.color);
			}
			
		},
		
		getTextWidth : function()
		{
			if (pasta.gui.tmpCanvas == null)
			{
				pasta.gui.tmpCanvas = document.createElement("div");
				
				pasta.gui.tmpCanvas.style.position = "absolute";
				pasta.gui.tmpCanvas.style.left = "-2000px";
				pasta.gui.tmpCanvas.style.top = "-2000px";
				pasta.gui.tmpCanvas.style.width = "auto";
				pasta.gui.tmpCanvas.style.height = "auto";
				
				stage.canvas.appendChild(pasta.gui.tmpCanvas);
			}
			
			pasta.gui.tmpCanvas.innerHTML = this.getCaption();
			this.font.applyFont(pasta.gui.tmpCanvas);
			
			return pasta.gui.tmpCanvas.clientWidth + 1;
		},
		
		getTextHeight : function()
		{
			if (pasta.gui.tmpCanvas == null)
			{
				pasta.gui.tmpCanvas = document.createElement("div");
				
				pasta.gui.tmpCanvas.style.position = "absolute";
				pasta.gui.tmpCanvas.style.left = "-2000px";
				pasta.gui.tmpCanvas.style.top = "-2000px";
				
				stage.canvas.appendChild(pasta.gui.tmpCanvas);
			}
			
			pasta.gui.tmpCanvas.style.width = this.getWidth() + "px";
			
			pasta.gui.tmpCanvas.innerHTML = this.getCaption();
			this.font.applyFont(pasta.gui.tmpCanvas);
			
			return pasta.gui.tmpCanvas.clientHeight + 1;
		},
		
		//----------------------- Setter & Getter ------------------
		
		isWordWrap : function()
		{
			return this.canvas.style.whiteSpace != "nowrap";
		},
		
		setWordWrap : function(data)
		{
			this.wordWrap = data;
			
			if (this.wordWrap)
				this.canvas.style.whiteSpace = "";
			else
				this.canvas.style.whiteSpace = "nowrap";
		},
		
		getAlign : function()
		{
			return this.canvas.textAlign;
		},
		
		setAlign : function(align)
		{
			this.canvas.style.textAlign = align;
		},
		
		getCaption : function()
		{
			return this.canvas.innerHTML;
		},
		
		setCaption : function(data)
		{
			if ((data == undefined) || (data == null))
				data = "";
			
			this.canvas.innerHTML = data;
		},
		
		setSelectable : function(data)
		{
			this.canvas.style.userSelect = (data ? "text" : "none");
			this.canvas.style.webkitUserSelect = (data ? "text" : "none");
			this.canvas.style.mozUserSelect = (data ? "text" : "none");
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Edit = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super();
			var self = this;
			
			this.canvas = document.createElement("input");
			this.canvas.type = "text";
			//this.canvas.style.paddingLeft = "2px";
			//this.canvas.style.paddingRight = "2px";
			this.canvas.style.position = "absolute";
			this.canvas.className = "form-control";
			
			this.font = new pasta.gui.Font();
			this.font.on("change", function() { self.font.applyFont(self.canvas); });
			
			this.focused = false;
			
			this.canvas.onfocus = function(e) { 
				self.focused = true; 
				if (self.tipeText == ttNilai){
					var text = self.canvas.value;
					self.canvas.value = text.replace(/\./gi,"");
				}
				self.emit("focus"); 
			};
			this.canvas.onblur = function(e) { 
				self.focused = false;
				self.emit("blur"); 
				if (self.tipeText == ttNilai){
					var text = self.canvas.value;
					if (text == "")
						self.canvas.value = "0";    
					else 
						self.canvas.value = toRp(text);
				}
			};
			this.canvas.onkeydown = function(e) { 
				if (!e) e = window.event; 
				if (window.event)
					key = e.keyCode; 
				else key = e.which; 
				if (self.tipeText === ttNilai) // nilai
				{
					// Allow: backspace, delete, tab, escape, enter and .
					if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
						// Allow: Ctrl+A, Command+A
						(e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
						// Allow: home, end, left, right, down, up
						(e.keyCode >= 35 && e.keyCode <= 40)) {
							// let it happen, don't do anything
							return;
					}
					// Ensure that it is a number and stop the keypress
					if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
						e.preventDefault();
					}
				};
				self.emit("keyDown", key, self); 
			};
			this.canvas.onkeyup = function(e) { if (!e) e = window.event; if (window.event) key = e.keyCode; else key = e.which; self.emit("keyUp", key, self); };
			//this.canvas.style.border = "1px solid #999999";
			
			this.canvas.onchange = function(e){
				self.emit("change", self);
			}
			this.setHeight(18);
			this.setWidth(100);
			
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.class){
					this.canvas.className = options.class;
				}
				if (options.placeHolder) this.setPlaceHolder(options.placeHolder);
				if (options.maxLength) this.setMaxLength(options.maxLength);
				if (options.enabled) this.setEnabled(options.enabled);
				if (options.password) this.setPassword(options.password);
				if (options.readOnly) this.setReadOnly(options.readOnly);
				if (options.tipeText) this.setTipeText(options.tipeText);
				if (options.type) this.setType(options.type);
				
			}
		},
		
		//------------------ Setter & Getter -----------------
		
		getPlaceHolder : function()
		{
			return this.canvas.placeholder;
		},
		
		setPlaceHolder : function(data)
		{
			this.canvas.placeholder = data;
		},
		
		isEnabled : function(data)
		{
			return (this.canvas.disabled == false);
		},
		
		setEnabled : function(data)
		{
			if (data)
				this.canvas.disabled = false;
			else
				this.canvas.disabled = true;
		},
		
		isReadOnly : function(data)
		{
			return this.canvas.readOnly;
		},
		
		setReadOnly : function(data)
		{
			this.canvas.readOnly = data;
		},
		
		isFocused : function()
		{
			return this.focused;
		},
		
		setFocus : function()
		{
			this.canvas.focus();
		},
		getFormatText: function(){
			return this.canvas.value;    
		},
		getText : function()
		{
			return this.canvas.value.replace(/\./gi,"");;
		},
		
		setText : function(data)
		{
			this.canvas.value = data;
			if (this.tipeText == ttNilai){
					var text = this.canvas.value;
					if (text == "")
						this.canvas.value = "0";    
					else 
						this.canvas.value = toRp(text);
				}
		},
		
		isPassword : function()
		{
			return (this.canvas.type == "password");
		},
		
		setPassword : function(data)
		{
			if (data)
				this.canvas.type = "password";
			else
				this.canvas.type = "text";
		},
		
		getMaxLength : function()
		{
			return this.canvas.maxLength;
		},
		
		setMaxLength : function(data)
		{
			this.canvas.maxLength = data;
		},
		setType: function(data){
			this.canvas.type = data;
		},
		setAlign: function(align){
			this.canvas.style.textAlign = align;
		},
		setTipeText: function(tipetext){
			this.tipeText = tipetext;
			if (tipetext == ttNilai)
				this.setAlign("right");
		}
	});
	pasta.gui.LabelEdit = pasta.gui.ContainerControl.extend({
		init : function(options){
			this._super(options);
			this.setClipMode("hidden");
			this.label = new pasta.gui.Label({bound:[0,5,100,25], caption:""});
			this.edit = new pasta.gui.Edit({bound:[0,0,100,25]});
			this.labelWidth = 100;
			this.addControl(this.label);
			this.addControl(this.edit);
			if (options){
				if (options.tipeText) this.edit.setTipeText(options.tipeText);
				if (options.labelWidth) this.setLabelWidth(options.labelWidth);
			}
		},
		setCaption: function(data){
			this.label.setCaption(data);
		},
		setText: function(data){
			this.Edit.setText(data);
		},
		setTipeText: function(tipeText){
			this.edit.setTipeText(tipeText);
		},
		setLabelWidth : function(data){
			this.labelWidth = data;
			this.label.setWidth(this.labelWidth);
			this.edit.setWidth( this.width - this.labelWidth);
			this.edit.setLeft(this.labelWidth);
		}, 
		setWidth: function(data){
			this._super(data);
			if (this.edit){
				this.edit.setWidth( this.width - this.labelWidth);
			}
		}
	});
	pasta.gui.File = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super();
			var self = this;

			//this.canvas.className = "form-control-wrapper fileinput";
			
			this.label = new pasta.gui.Label({bound:[35,0,100,20], caption:"Browse...", color:"#EF6C00"});
			this.bgIcon = new pasta.gui.Control({bound:[0,0,30,40]});
			this.bgIcon.background.setColor("#EF6C00");
			this.cIcon = new pasta.gui.Control({bound:[0,0,30,40]});
			this.cIcon.canvas.className = "fa fa-upload";
			$(this.cIcon.canvas).css({color : "white", fontSize : "24px", top : "5px",left : "5px" });
			
			this.form =document.createElement("form");
			$(this.form).css({opacity:0, filter: "alpha(opacity=0)",position : "absolute", left:0, top:0, height:"100%", width:"100%"});
			this.input2 = document.createElement("input");
			this.input2.type = "file";
			this.input2.multiple = "";
			$(this.input2).css({opacity:0, filter: "alpha(opacity=0)",position : "absolute", left:0, top:0, height:"100%", width:"100%"});
			
			$(this.input2).on("change", function(e){
				self.files = e.target.files;
				self.setCaption($(self.input2).val());
				
				self.emit("fileReady");
				
			});
			
			$(this.canvas).css({border:"1px solid #EF6C00", borderRadius:"5px", background:"#EEEEEE", overflow:"hidden"});
			this.canvas.appendChild(this.label.canvas);
			this.canvas.appendChild(this.bgIcon.canvas);
			this.canvas.appendChild(this.cIcon.canvas);
			this.canvas.appendChild(this.form);
			this.form.appendChild(this.input2);
			
			this.focused = false;
			
			this.setHeight(18);
			this.setWidth(100);
			var self = this;
			$(this.form).on("submit", function(event){
				try{
					console.log("submit form");
					event.stopPropagation(); // Stop stuff happening
					event.preventDefault(); // Totally stop stuff happening
					var data = new FormData();
					$.each(self.files, function(key, value)
					{
						data.append(key, value);
					});
					$.ajax({
						url: self.server,
						type: 'POST',
						data: data,
						cache: false,
						dataType: 'text',
						processData: false, // Don't process the files
						contentType: false, // Set content type to false as jQuery will tell the server its a query string request
						beforeSend : function(){
							app.showLoading();
						},
						complete: function(){
							console.log("data completed");
							app.hideLoading();
						},
						success: function(data, textStatus, jqXHR)
						{
							console.log(JSON.stringify(data));
							
							if(typeof data.error === 'undefined')
							{
								// Success so call function to process the form
								self.cb(data);
							}
							else
							{
								// Handle errors here
								console.log('ERRORS : ' + data.error);
								app.alert("ERROR : ",data.error, 200);
							}
							app.hideLoading();   
						},
						error: function(jqXHR, textStatus, errorThrown)
						{
							// Handle errors here
							console.log('ERRORS ::' + textStatus +":"+ errorThrown);
							app.alert("ERROR :: ",textStatus, 200);
							// STOP LOADING SPINNER
						}
					});
				}catch(e){
					console.log(e);
				}
			});
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.enabled) this.setEnabled(options.enabled);
				if (options.fontSize) this.setFontSize(options.fontSize);
				if (options.icon) this.setIcon(options.icon);
				if (options.iconSize) this.setIconSize(options.iconSize);
				if (options.iconColor) this.setIconColor(options.iconColor);
				if (options.iconBg) this.setIconBgColor(options.iconBg);
				if (options.caption) this.setCaption(options.caption);
				
			}
		},
		setCaption : function(data){
			this.label.setCaption(data);
		},
		setWidth: function(data){
			this._super(data);
			$(this.input2).css({width:data - 30});
		},
		setHeight: function(data){
			this._super(data);
			this.label.setTop(data / 2 - 10);
			
		},
		//------------------ Setter & Getter -----------------
		upload: function(server, cb){
			try{
				this.server  = server;
				this.cb = cb;
				console.log("upload submit...");
				$(this.form).submit();
			}catch(e){
				console.log(e);
			}
		},
		isEnabled : function(data)
		{
			return (this.canvas.disabled == false);
		},
		
		setEnabled : function(data)
		{
			if (data)
				this.canvas.disabled = false;
			else
				this.canvas.disabled = true;
		},
		setFontSize: function(data){
			this.bTitle.font.setSize(data);
		},
		setIcon: function(className){
			this.cIcon.canvas.className = className;
		},
		setIconSize: function(data){
			$(this.cIcon.canvas).css({fontSize:data});
		},
		setColor: function(color){
			$(this.canvas).css({background:color});
		},
		setIconColor: function(color){
			$(this.cIcon.canvas).css({color:color});
		},
		setIconBgColor : function(color){
			$(this.bgIcon.canvas).css({background:color});
			$(this.canvas).css({border:"1px solid "+color});
		}
		
	});
	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.ProgressBar = pasta.gui.Control.extend(
	{
		init : function() 
		{
			this._super();
			var self = this;
			
			this.canvas = document.createElement("progress");
			this.canvas.style.position = "absolute";
			this.canvas.value = 0;
			this.canvas.max = 100;
			
			this.setHeight(18);
			this.setWidth(100);
		},
		
		//------------------ Setter & Getter -----------------
		
		getValue : function()
		{
			return this.canvas.value;
		},
		
		setValue : function(data)
		{
			this.canvas.value = data;
		},
		
		getMax : function()
		{
			return this.canvas.max;
		},
		
		setMax : function(data)
		{
			this.canvas.max = data;
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Memo = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super(options);
			var self = this;
			
			this.canvas = document.createElement("textarea");
			this.canvas.wrap = "off";
			this.canvas.style.position = "absolute";
			
			this.font = new pasta.gui.Font();
			this.font.on("change", function() { self.font.applyFont(self.canvas); });
			
			this.canvas.onfocus = function(e) { self.emit("focus"); };
			this.canvas.onblur = function(e) { self.emit("blur"); };
			this.canvas.onkeydown = function(e) { if (!e) e = window.event; if (window.event) key = e.keyCode; else key = e.which; self.emit("keyDown", key, self); };
			this.canvas.onkeyup = function(e) { if (!e) e = window.event; if (window.event) key = e.keyCode; else key = e.which; self.emit("keyUp", key, self); };
			this.canvas.style.border = "1px solid #999999";
			
			this.setHeight(18);
			this.setWidth(100);
			if (options){
				if (options.bound) {
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.maxLength) this.setMaxLength(options.maxLength);
				if (options.enabled) this.setEnabled(options.enabled);
				if (options.readOnly) this.setReadOnly(options.readOnly);
				
			}
		},
		
		//------------------ Setter & Getter -----------------
		
		isEnabled : function(data)
		{
			return (this.canvas.disabled == false);
		},
		
		setEnabled : function(data)
		{
			if (data)
				this.canvas.disabled = false;
			else
				this.canvas.disabled = true;
		},
		
		isReadOnly : function(data)
		{
			return this.canvas.readOnly;
		},
		
		setReadOnly : function(data)
		{
			this.canvas.readOnly = data;
		},
		
		setFocus : function()
		{
			this.canvas.focus();
		},
		
		getText : function()
		{
			return this.canvas.value;
		},
		
		setText : function(data)
		{
			this.canvas.value = data;
		},
		
		getMaxLength : function()
		{
			return this.canvas.maxLength;
		},
		
		setMaxLength : function(data)
		{
			this.canvas.maxLength = data;
		},
		setPlaceHolder : function(data){
			$(this.canvas).attr("placeholder", data);
		}
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Button = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super();
			
			this.canvas.style.overflow = "hidden";
			
			this.middleBg = document.createElement("div");
			this.middleBg.style.position = "absolute";
			this.middleBg.style.left = "0px";
			this.middleBg.style.top = "0px";
			this.middleBg.style.height = "100%";
			this.middleBg.style.width = "100%";
			this.canvas.appendChild(this.middleBg);
			
			this.titleTop = 7;
			this.titleLeft = 0;
			
			this.title = document.createElement("div");
			this.title.style.position = "absolute";
			this.title.style.left = this.titleLeft + "px";
			this.title.style.top = this.titleTop + "px";
			this.title.style.width = "100%";
			this.title.style.height = "100%";
			this.title.style.textAlign = "center";
			this.title.innerHTML = "";
			this.title.style.userSelect = "none";
			this.canvas.appendChild(this.title);
			
			var self = this;
			
			this.font = new pasta.gui.Font();
			this.font.on("change", 
				function() 
				{ 
					if (self.enabled) 
						self.enabledColor = self.font.getColor();
					
					self.font.applyFont(self.title) 
				});
			this.font.setSize(13);
			this.font.setBold(true);
			
			this.enabledColor = this.font.getColor();
			
			this.iconCanvas = null;
			
			this.iconWidth = 24;
			this.iconLeft = 6;
			this.iconTop = 6;
			
			this.setHeight(36);
			
			this.canvas.style.cursor = "pointer";
			
			this.on("mouseOver",
				function()
				{
					$(self.canvas).css({background : self.hoverColor});	
				});
			
			this.on("mouseOut",
				function()
				{
					$(self.canvas).css({background : self.bgColor});
				});
			
			this.on("mouseDown",
				function()
				{
					
					self.title.style.top = (self.titleTop + 1) + "px";
				});
			
			this.on("mouseUp",
				function()
				{
					self.title.style.top = self.titleTop + "px";
				});
				
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.bgColor = options.background;
					this.background.setColor(options.background);
				}
				if (options.hoverColor){
					this.hoverColor = options.hoverColor;
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.icon) this.setIcon(options.icon);
				if (options.caption) this.setCaption(options.caption);
				if (options.enabled) this.setEnabled(options.enabled);
			}
		},
		
		//------------------ Setter & Getter -----------------
		
		setEnabled : function(data)
		{
			this._super(data);
			
			this.font.setColor(this.enabled ? this.enabledColor : "#AAAAAA");
		},
		
		setImage : function(data)
		{
			if ((data == null) || (data == "default"))
			{
				
			}
			else
			{
				
			}
		},
		
		getCaption : function()
		{
			return this.title.innerHTML;
		},
		
		setCaption : function(data)
		{
			this.title.innerHTML = data;
		},
		
		setIconWidth : function(data)
		{
			this.iconWidth = data;
			
			if (this.iconCanvas != null)
			{
				this.iconCanvas.style.width = this.iconWidth + "px";
				this.iconCanvas.style.height = this.iconWidth + "px";
			}
		},
		
		setIconTop : function(data)
		{
			this.iconTop = data;
			
			if (this.iconCanvas != null)
				this.iconCanvas.style.top = this.iconTop + "px";
		},
		
		setIconLeft : function(data)
		{
			this.iconLeft = data;
			
			if (this.iconCanvas != null)
				this.iconCanvas.style.left = this.iconLeft + "px";
		},
		
		setIcon : function(data)
		{
			if (data != null)
			{
				if (this.iconCanvas == null)
				{
					this.iconCanvas = document.createElement("div");
					this.iconCanvas.style.position = "absolute";
					this.iconCanvas.style.left = this.iconLeft + "px";
					this.iconCanvas.style.top = this.iconTop + "px";
					this.iconCanvas.style.width = this.iconWidth + "px";
					this.iconCanvas.style.height = this.iconWidth + "px";
					this.iconCanvas.style.backgroundPosition = "center";
					this.iconCanvas.style.backgroundRepeat = "no-repeat";
					this.iconCanvas.style.cursor = "pointer";
					this.canvas.appendChild(this.iconCanvas);
				}
				
				//this.iconCanvas.style.backgroundImage = "url(" + data + ")";
				$(this.iconCanvas).html(data);
				
				this.title.style.left = (this.iconLeft + this.iconWidth + this.titleLeft) + "px";
				this.title.style.textAlign = "left";
			}
			else
			{
				if (this.iconCanvas != null)
					this.iconCanvas.style.backgroundImage = "";
				
				this.title.style.left = "0px";
				this.title.style.textAlign = "center";
			}
		},
		
		setTitleTop : function(data)
		{
			this.titleTop = data;
			
			this.title.style.top = this.titleTop + "px";
		},
		
		setTitleLeft : function(data)
		{
			this.titleLeft = data;
			
			if ((this.iconCanvas != null) && (this.iconCanvas.style.backgroundImage != ""))
				this.title.style.left = (this.iconLeft + this.iconWidth + this.titleLeft) + "px";
			else
				this.title.style.left = this.titleLeft + "px";
		},
		
		setWidth : function(data)
		{
			this._super(data);
			
			this.middleBg.style.width = (this.width) + "px";
		}
	});

	
	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.ImageButton = pasta.gui.Control.extend(
	{
		init : function() 
		{
			this._super();
			var self = this;
			
			this.caption = "";
			
			this.canvas.style.backgroundPosition = "left top";
			
			this.titleTop = 7;
			this.titleLeft = 0;
			
			this.title = document.createElement("div");
			this.title.id = this.cid + "_titleFrame";
			this.title.style.position = "absolute";
			this.title.style.left = this.titleLeft + "px";
			this.title.style.top = this.titleTop + "px";
			this.title.style.width = "100%";
			this.title.style.height = "100%";
			this.title.style.textAlign = "center";
			this.title.innerHTML = this.caption;
			this.title.style.cursor = "pointer";
			this.canvas.appendChild(this.title);
			
			this.font = new pasta.gui.Font();
			this.font.on("change", function() {self.font.applyFont(self.title); });
			this.font.setSize(13);
			this.font.setBold(true);
			
			this.iconCanvas = null;
			
			this.iconWidth = 24;
			this.iconLeft = 6;
			this.iconTop = 6;
			
			this.setCursor("pointer");
			
			this.on("mouseOver",
				function()
				{
					self.canvas.style.backgroundPosition = "left center";
				});
			
			this.on("mouseOut",
				function()
				{
					self.canvas.style.backgroundPosition = "left top";
				});
			
			this.on("mouseDown",
				function()
				{
					self.canvas.style.backgroundPosition = "left bottom";
					
					self.title.style.top = (self.titleTop + 1) + "px";
				});
			
			this.on("mouseUp",
				function()
				{
					self.canvas.style.backgroundPosition = "left top";
					
					self.title.style.top = self.titleTop + "px";
				});
		},
		
		//------------------ Setter & Getter -----------------
		
		getCaption : function(data)
		{
			return this.title.innerHTML;
		},
		
		setCaption : function(data)
		{
			this.title.innerHTML = data;
		},
		
		setIconWidth : function(data)
		{
			this.iconWidth = data;
			
			if (this.iconCanvas != null)
			{
				this.iconCanvas.style.width = this.iconWidth + "px";
				this.iconCanvas.style.height = this.iconWidth + "px";
			}
		},
		
		setIconTop : function(data)
		{
			this.iconTop = data;
			
			if (this.iconCanvas != null)
				this.iconCanvas.style.top = this.iconTop + "px";
		},
		
		setIconLeft : function(data)
		{
			this.iconLeft = data;
			
			if (this.iconCanvas != null)
				this.iconCanvas.style.left = this.iconLeft + "px";
		},
		
		setTitleTop : function(data)
		{
			this.titleTop = data;
			this.title.style.top = this.titleTop + "px";
		},
		
		getTitleTop : function()
		{
			return this.titleTop;
		},
		
		setImage : function(data)
		{
			this.canvas.style.backgroundImage = "url(" + data + ")";
		},
		
		setIcon : function(data)
		{
			if (data != null)
			{
				if (this.iconCanvas == null)
				{
					this.iconCanvas = document.createElement("div");
					this.iconCanvas.style.position = "absolute";
					this.iconCanvas.style.left = this.iconLeft + "px";
					this.iconCanvas.style.top = this.iconTop + "px";
					this.iconCanvas.style.width = this.iconWidth + "px";
					this.iconCanvas.style.height = this.iconWidth + "px";
					this.iconCanvas.style.backgroundPosition = "center";
					this.iconCanvas.style.backgroundRepeat = "no-repeat";
					this.canvas.appendChild(this.iconCanvas);
				}
				
				this.iconCanvas.style.backgroundImage = "url(" + data + ")";
				
				this.title.style.left = (this.iconLeft + this.iconWidth + this.titleLeft) + "px";
				this.title.style.textAlign = "left";
			}
			else
			{
				if (this.iconCanvas != null)
					this.iconCanvas.style.backgroundImage = "";
				
				this.title.style.left = "0px";
				this.title.style.textAlign = "center";
			}
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.HTML = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super();
			var self = this;
			
			this.canvas = document.createElement("iframe");
			this.canvas.style.position = "absolute";
			this.canvas.style.left = "0px";
			this.canvas.style.top = "0px";
			this.canvas.style.width = this.getWidth() + "px";
			this.canvas.style.height = this.getHeight() + "px";
			this.canvas.frameBorder = "0px";
			
			this.canvas.onload = function() { self.emit("load"); };
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.url){
					this.load(options.url);
				}
			}
		},
		
		load : function(data)
		{	
			this.canvas.src = data;
		},
		
		print : function()
		{
			var ifWin = this.canvas.contentWindow || iframe;
			
			this.canvas.focus();
			ifWin.print();
		},
		
		getContent : function()
		{
			return this.canvas.contentWindow;
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Stage = pasta.gui.ContainerControl.extend(
	{
		init : function() 
		{
			this._super();
			
			var stageDiv = null;
			
			stageDiv = document.getElementsByTagName('body')[0];
			
			stageDiv.innerHTML = "";
			stageDiv.appendChild(this.canvas);
			
			this.canvas.style.left = "0px";
			this.canvas.style.top = "0px";
			this.canvas.style.width = "100%";
			this.canvas.style.height = "100%";
			//this.canvas.style.background = "url(img/bg.jpg)";
			var self = this;
			self.touchDrag = false;
			
			this.canvas.ontouchstart = 
				function()
				{
					self.touchDrag = false;
				};
			
			this.canvas.ontouchmove = 
				function()
				{
					self.touchDrag = true;
				};
			
			this.setClipMode("hidden");
			
			var self = this;
			
			self.loadingPanel = new pasta.gui.ContainerControl();
			self.loadingPanel.canvas.id = "loadIndicator";
			self.loadingPanel.canvas.style.zIndex = 99999;
			self.loadingPanel.setLeft($(window).width() / 2 - 33);
			self.loadingPanel.setTop($(window).height() / 2 - 33);
			self.loadingPanel.setWidth(66);
			self.loadingPanel.setHeight(66);
			self.loadingPanel.border.setColor("#FFFFFF");
			self.loadingPanel.border.setRadius(33);
			self.loadingPanel.background.setColor("rgba(0, 0, 0, 0.1)");
			self.loadingPanel.setVisible(false);
			self.addControl(self.loadingPanel);
			
				self.picLoading = new pasta.gui.Control();
				$(self.picLoading.canvas).addClass("loader");
				$(self.picLoading.canvas).css({width:66, height:66});
				self.loadingPanel.addControl(self.picLoading);
				
				self.lblLoading = new pasta.gui.Label();
				self.lblLoading.setLeft(5);
				self.lblLoading.setTop(25);
				self.lblLoading.setVisible(false);
				self.lblLoading.font.setColor("#FFFFFF");
				self.lblLoading.setCaption("Wait...");
				self.loadingPanel.addControl(self.lblLoading);
			
			setTimeout(
				function() 
				{
					//self.showLoading();
							
				},
				100);
			this.on("resize", function(){
				self.loadingPanel.setLeft($(window).width() / 2 - 33);
				self.loadingPanel.setTop($(window).height() / 2 - 33);
			});
		},
		showLoading: function(){
			this.loadingPanel.setVisible(true);
		},
		hideLoading: function(){
			this.loadingPanel.setVisible(false);
		},
		
		addListener : function(event, listener)
		{
			var self = this;
			
			this._super(event, listener);
			
			switch (event)
			{
				case "resize" :
								//window.onresize = function() { try { self.emit("resize", self.getWidth(), self.getHeight()); }catch(e){alert(e)}};
								$(window).resize(function(){
									try { self.emit("resize", self.getWidth(), self.getHeight()); }catch(e){alert(e)}
								});
								break;
				case "mouseMove" :
								window.onmousemove = function(e) { if (!e) e = window.event; self.doScreenMouseMove(e.pageX, e.pageY, e.which); return false;};
								this.canvas.onmousemove = null;
								break;
				case "mouseUp" :
								window.onmouseup = function(e) { if (!e) e = window.event; self.doScreenMouseUp(e.pageX, e.pageY); return false;};
								this.canvas.onmouseup = null;
								break;
			}
		},
		
		refresh : function()
		{
			this.emit("resize", this.getWidth(), this.getHeight());
		},
		
		clearSelection : function()
		{
			if (window.getSelection) 
			{
				if (window.getSelection().empty) 
				{  // Chrome
					window.getSelection().empty();
				} 
				else if (window.getSelection().removeAllRanges) 
				{  // Firefox
					window.getSelection().removeAllRanges();
				}
			} 
			else if (document.selection) 
			{  // IE?
				document.selection.empty();
			}
		},
		
		doScreenMouseMove : function(x, y, button)
		{
			this.mouseX = x;
			this.mouseY = y;
			
			this.emit("mouseMove", this.mouseX, this.mouseY, button);
		},
		
		doScreenMouseUp : function(x, y)
		{
			this.mouseX = x;
			this.mouseY = y;
			
			this.emit("mouseUp", this.mouseX, this.mouseY);
		},
		
		getMouseX : function()
		{
			return this.mouseX;
		},
		
		getMouseY : function()
		{
			return this.mouseY;
		},
		
		getHeight : function()
		{
			var result = 800;
			
			try
			{
				result = this.canvas.offsetHeight;
			}
			catch (e)
			{
				result = 800;
			}
			
			return result;
		},
		
		getWidth : function()
		{
			var result = 1024;
			
			try
			{
				result = this.canvas.offsetWidth;
			}
			catch (e)
			{
				result = 1024;
			}
			
			return result;
		},
		
		loadFont : function(fontName, src)
		{
			var style = document.createElement("style");
			style.type = "text/css";
			style.innerHTML = "@font-face { font-family: " + fontName + "; src: url(" + src + ");}";
			document.getElementsByTagName('head')[0].appendChild(style);
		},
	});

	//----------------------------------------------------------------------------------------------------------------------------------

	pasta.gui.Panel = pasta.gui.ContainerControl.extend(
	{
		init : function(options) 
		{
			this._super(options);
		},

		close : function()
		{
			this.setVisible(false);
			
			this.emit("close");
		},
		
		show : function()
		{
			this.setVisible(true);
			
			this.emit("show");
		},
	});
	//-----
	pasta.gui.Image = pasta.gui.Control.extend(
	{
		init : function(options) 
		{
			this._super(options);
			var self = this;
			this.canvas = document.createElement("IMG");
			this.canvas.style.position = "absolute";
			
			this.mode = 1;
			this.image = null;
			
			if (options){
				if (options.image) this.setImage(options.image);
			}
		},
		
		//------------------ Setter & Getter -----------------
		
		getImage : function()
		{
			return this.canvas.src;
		},
		
		setImage : function(data)
		{
			this.image = data;
			if (data)
			{
				if (typeof(data) == "string")
					this.canvas.src = data;
				else if (data.src)
					this.canvas.src = data.src;
			}
			else
				this.canvas.src = "";
		},
		
		getRealWidth : function() 
		{
			return this.imgObj.width;
		},
		
		getRealHeight : function() 
		{
			return this.imgObj.height;
		},
		
		setWidth : function(data)
		{
			this._super(data);
			
		},
		
		setHeight : function(data)
		{
			this._super(data);
			
			
		},
	});
	//----------------------------------------------------------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------------------------------------------------------
	function getTextWidth(text){
		if (pasta.gui.tmpCanvas == null)
		{
			pasta.gui.tmpCanvas = document.createElement("span");
			
			pasta.gui.tmpCanvas.style.position = "absolute";
			pasta.gui.tmpCanvas.style.left = "-2000px";
			pasta.gui.tmpCanvas.style.top = "-2000px";
			
			stage.canvas.appendChild(pasta.gui.tmpCanvas);
		}
		pasta.gui.tmpCanvas.innerHTML = text;
		return pasta.gui.tmpCanvas.clientWidth + 1;
	}
	pasta.gui.Options = pasta.gui.Control.extend({
		init : function(options) 
			{
				try{
					this._super();
					var self = this;
					
					this.cnvSelect = document.createElement("select");
					this.cnvSelect.style.position = "absolute";
					this.cnvSelect.style.left = "0";
					this.cnvSelect.style.top = "0";
					this.cnvSelect.style.width = "100%";
					this.cnvSelect.style.height = "100%";
					this.cnvSelect.className = "selectpicker show-tick form-control";//
					
					//this.background.setColor("white");
					$(this.cnvSelect).attr("data-live-search",true);

					this.font = new pasta.gui.Font();
					this.font.on("change", function() { self.font.applyFont(self.cnvSelect); });
					
					this.focused = false;
					this.canvas.appendChild(this.cnvSelect);

					this.setHeight(30);
					this.setWidth(100);
				}catch(e){
					console.log(e);
				}
			
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.class){
					this.canvas.className = options.class;
				}
				if (options.placeHolder) this.setPlaceHolder(options.placeHolder);
				if (options.maxLength) this.setMaxLength(options.maxLength);
				if (options.enabled) this.setEnabled(options.enabled);
				if (options.password) this.setPassword(options.password);
				if (options.readOnly) this.setReadOnly(options.readOnly);
				if (options.tipeText) this.setTipeText(options.tipeText);
				if (options.type) this.setType(options.type);
				
			}
			},
			
			//------------------ Setter & Getter -----------------
			addItem: function(item, itemId, checked){
				//var option = document.createElement("option");
				//option.text = "Text";
				//option.value = "myvalue";
				var idx = this.cnvSelect.options.length;
				this.cnvSelect.options[idx] = new Option(item, itemId, checked);

			},
			getSelectedId: function(){
				return this.cnvSelect.options[this.cnvSelect.selectedIndex].value;
			},
			getText: function(){
				return this.cnvSelect.options[this.cnvSelect.selectedIndex].text;
			},
			getPlaceHolder : function()
			{
				return this.cnvSelect.placeholder;
			},
			
			setPlaceHolder : function(data)
			{
				this.cnvSelect.placeholder = data;
			},
			
			isEnabled : function(data)
			{
				return (this.cnvSelect.disabled == false);
			},
			
			setEnabled : function(data)
			{
				if (data)
					this.cnvSelect.disabled = false;
				else
					this.cnvSelect.disabled = true;
			},
			
			isReadOnly : function(data)
			{
				return this.cnvSelect.readOnly;
			},
			
			setReadOnly : function(data)
			{
				this.cnvSelect.readOnly = data;
			},
			
			isFocused : function()
			{
				return this.focused;
			},
			
			setFocus : function()
			{
				this.cnvSelect.focus();
			},
			
			setText : function(data)
			{
				this.cnvSelect.value = data;
			},
			
	});
	pasta.gui.DropDown = pasta.gui.ContainerControl.extend({
		init : function(options) 
		{
			this._super();
			var self = this;
			this.useService = false;
			this.edit = new pasta.gui.Edit();
			this.items = [];
			this.edit.on("keyUp", function(key, sender){
				try{
					self.dropButton.canvas.className = "fa fa-caret-up";//'glyphicon glyphicon-chevron-up';
					sender.isDown = true;
					//self.showList();
					if (app.listItem.isVisible()){
						if (self.useService){
							self.callService();
						}else {
							if (self.edit.getText().length == 0){
								for (i = 0; i < app.listItem.controls.length;i++){
									var ctrl = app.listItem.controls[i];
									ctrl.setVisible(true);
								}
							}
							var totalHeight = 0;
							for (i = 0; i < app.listItem.controls.length;i++){
								var ctrl = app.listItem.controls[i];
								if (ctrl.caption.indexOf(self.edit.getText()) == -1)
									ctrl.setVisible(false);
								else {
									ctrl.setVisible(true);
									totalHeight += 42;
								}
							}
							if(totalHeight > 210)
								app.listItem.setHeight(210);
							else app.listItem.setHeight(totalHeight);
						}
					}
				}catch(e){
					console.log(e);
				}
			});
			$(this.edit.canvas).blur(function(){
				app.listItem.hide();
				self.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-down';
				self.isDown = false;		
			});
			/*
			this.edit.on("change", function(sender){
				if (self.changeEmitted == false){
				//	self.emit("change", self, self.getSelectedItem(), self.edit.getText());
				}
				self.changeEmitted = false;
			});
			*/
				this.bgButton = new pasta.gui.Control({bound:[0,0,20, this.getHeight()]});
				this.bgButton.canvas.style.background="#03A9F4";
				this.bgButton.canvas.style.cursor = "pointer";
				this.dropButton = new pasta.gui.Control();
				this.dropButton.isDown = false;
				this.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-down';
				this.dropButton.canvas.style.color = "white";
				this.dropButton.canvas.style.cursor = "pointer";
				//this.dropButton.setTop(0);
				this.dropButton.setWidth(20);
				this.bgButton.on("click", function(sender, obj, e){	
					try{
						if (!self.isDown){
							self.dropButton.canvas.className = "fa fa-caret-up";//'glyphicon glyphicon-chevron-up';
							self.showList();
						}else {
							self.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-down';
							app.listItem.setVisible(false);
							app.listItem.setWidth(self.width);
						}	
						self.isDown = !self.isDown;		
									
					}catch(e){
						console.log(e);
					}
				});
				this.dropButton.on("click", function(sender, obj, e){	
					try{
						if (!self.isDown){
							self.dropButton.canvas.className = "fa fa-caret-up";//'glyphicon glyphicon-chevron-up';
							self.showList();
						}else {
							self.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-down';
							app.listItem.setVisible(false);
							app.listItem.setWidth(self.width);
						}	
						self.isDown = !self.isDown;		
									
					}catch(e){
						console.log(e);
					}
				});
				this.addControl(this.edit);
				this.addControl(this.bgButton);
				this.addControl(this.dropButton);
				
				if (app.listItem == undefined){
					app.listItem = new pasta.gui.ContainerControl();
					app.listItem.clientCanvas.style.position = "relative";
					app.listItem.clientCanvas.className = "menu-wrap";
					app.listItem.canvas.style.overflowX = "hidden";
					app.listItem.canvas.style.background = "#ffffff";
					app.listItem.clientCanvas.style.background = "#ffffff";
					app.listItem.canvas.style.boxShadow = "0px 1px 5px #888";
					app.listItem.canvas.style.zIndex = 199999;
					app.listItem.setVisible(false);
					app.listItem.setHeight(100);
					
					stage.addControl(app.listItem);
				}
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.placeHolder) this.setPlaceHolder(options.placeHolder);
				if (options.items){
					this.setItems(options.items);
				}
			}
		},
		showList: function(){
			try{
					var self = this;
					if (app.listItem.linkCtrl != undefined){
						app.listItem.linkCtrl.isDown = false;
						app.listItem.linkCtrl.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-up';
					}
					app.listItem.setWidth(self.getWidth());
					var pos = $(self.canvas).offset();
					app.listItem.setLeft(pos.left);
					app.listItem.setTop(pos.top + self.getHeight());
					app.listItem.setWidth(self.getWidth());
					app.listItem.clear();
					app.listItem.linkCtrl = this;
					$.each(self.items, function(key, item){
						if (item instanceof Array)
							self.addItem(item[0],item[1]);
						else 
							self.addItem(item);
					});
					app.listItem.setVisible(true);
			}catch(e){
				console.log(e);
			}
		},
		hideList: function(){
			app.listItem.hide();
		},
		setMode: function(mode){
			switch (mode){
				case 0 : this.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-down';
				break;
				case 1 : this.dropButton.canvas.className = "fa fa-search";//'glyphicon glyphicon-search';
				break;
			}
		},
		setWidth: function(data){
			this._super(data);
			this.edit.setWidth(data - 20);
			this.dropButton.setLeft(data - 15);
			this.bgButton.setLeft(data - 20);
			//this.listItem.setWidth(data);
		},
		setHeight : function(data){
			this._super(data);
			this.edit.setHeight(data);
			this.dropButton.setHeight(data);
			this.dropButton.setTop(data / 2 - 5);
			this.bgButton.setHeight(data);
			//this.listItem.setTop(data);
		},
		displayList: function(){
			
		},
		setPlaceHolder: function(data){
			this.edit.setPlaceHolder(data);
		},
		addItem: function(caption, id){
			try{
				var self = this;
				var item = new pasta.gui.ContainerControl();
				if (getTextWidth(caption) < app.listItem.width)
					var w = app.listItem.width;
				else if (getTextWidth(caption) < 300)
					var w = getTextWidth(caption);
				else var w = 300;
				
				app.listItem.setWidth(w);
				item.setHeight(30);
				item.setWidth(w);
				item.canvas.style.position = "relative";
				item.canvas.className = "saku-item";			
			
				var label = new pasta.gui.Label();
				label.setLeft(20);
				label.setWidth(w - 20);
				label.setTop(5);
				label.setCaption(caption);
				item.addControl(label);
				if (id == undefined) id = caption;
				item.caption = caption;
				item.id = id;
				item.on("click", function(sender){
					self.changeEmitted = true;
					self.edit.setText(sender.caption);
					self.selectedId = sender.id;
					
					app.listItem.setVisible(false);
					self.isDown = false;
					self.dropButton.canvas.className = "fa fa-caret-down";//'glyphicon glyphicon-chevron-down';
					self.emit("change", self, sender.id, sender.caption);
				});
				item.on("mouseOver", function(sender){
					sender.canvas.style.background = "#dfdfdf";
				});
				item.on("mouseOut", function(sender){
					sender.canvas.style.background = "#ffffff";
				});	
				app.listItem.addControl(item);
				
				if(app.listItem.controls.length * 42 > 210)
					app.listItem.setHeight(210);
			}catch(e){
				console.log(e);
			}
		},
		setItems: function(items){
			this.items = items;
		},
		getSelectedItem: function(){
			return this.selectedId;
		},
		setText : function(text){
			this.edit.setText(text);
		},
		getText: function(){
			return this.edit.getText();
		},
		setService: function(service,fieldKey, fieldNama, offset){
			try{
				this.useService = true;
				var self = this;
				this.service = service;
				this.fieldKey = fieldKey;
				this.fieldNama = fieldNama;
				this.offset = offset;
				this.callService();
			}catch(e){
				console.log(e);
			}
		},
		callService: function(){
			var self = this;
			self.useService = true;
			serviceMsg(self.service,[this.edit.getText(), this.offset], function(data){
					app.listItem.clear();
					try{
						//if (data.length <= self.offset && data.length != 0)
						//	self.useService = false;
						//console.log(data.length);
						app.listItem.clear();
						for (var i = 0; i < data.length; i++){
							console.log(data[i][self.fieldNama]);
							self.addItem(data[i][self.fieldNama], data[i][self.fieldKey]);
						}
					}catch(e){
						console.log(e);
					}
				});
		}
	});
	pasta.gui.PopupList = pasta.gui.Panel.extend({
		init : function() 
		{
			this._super();
			var self = this;	
			self.canvas.className = "panel panel-default";
			self.clientCanvas.className = "panel-body";
			self.headerCanvas = document.createElement("div");
			self.headerCanvas.className = "panel-heading";
			
			self.headerCanvas.style.userSelect = "none";
			self.headerCanvas.style.webkitUserSelect = "none";
			self.headerCanvas.style.mozUserSelect = "none";
			
			self.canvas.appendChild(self.headerCanvas);
		},
		setTitle: function(title){
			this.headerCanvas.innerHTML = title;
		},
		setWidth: function(data){
			this._super(data);	},
		setHeight : function(data){
			this._super(data);
		},
		show : function(){
			this.setWidth(400);
			this.setHeight(300);
			this.setLeft($(window).width() / 2 - 200);
			this.setTop($(window).height() / 2 - 150);
			this._super();
		}
		
	});
	pasta.gui.Header = pasta.gui.Control.extend({
		init: function(){
			this._super();
			var self = this;
			this.controls = new Array();
			this.canvas = document.createElement("header");
			this.canvas.style.width ="100%";
			this.canvas.style.height = "46px";
			this.canvas.style.top = "0px";
			this.canvas.style.zIndex = 20;
			this.canvas.style.position = "fixed";
			this.canvas.style.backgroundColor = "#D32F2F";
			this.canvas.style.boxShadow = "0 1px 6px 0 rgba(0, 0, 0, 0.12), 0 1px 6px 0 rgba(0, 0, 0, 0.12)";
			//this.canvas.className = "header";
			stageDiv = document.getElementsByTagName('body')[0];
			stageDiv.appendChild(this.canvas);
			
		},
		addControl : function(control)
		{
			if (control.parent != this)
			{
				if (control && control.canvas)
				{
					control.parent = this;
					this.controls.push(control);
					this.canvas.appendChild(control.canvas);
				}
				else
					console.log("unable to addControl :" + JSON.stringify(control));
			}
		},
		
		delControl : function(control)
		{
			if (control.parent == this)
			{
				var index = this.controls.indexOf(control);
				
				if (index >= 0)
				{
					this.controls.splice(index, 1);
					$(control.canvas).remove();
				}
			}
		},
		
		clear : function()
		{
			for (var i = 0; i < this.controls.length; i++)
			{
				var control = this.controls[i];
				
				$(control.canvas).remove();
				control.parent = undefined;
			}
			
			this.controls.length = 0;
		},
		
		addListener : function(event, listener)
		{
			this._super(event, listener);
			
			var self = this;
			
			switch (event)
			{
				case "click" :
								this.canvas.onclick = function(e) { if (!e) e = window.event; self.emit("click", self, e.srcElement == self.clientCanvas)};
								break;
			}
		}
	});
	pasta.gui.Footer = pasta.gui.Control.extend({
		init: function(){
			this._super();
			var self = this;
			this.controls = new Array();
			this.canvas = document.createElement("footer");
			this.canvas.style.width ="100%";
			this.canvas.style.height = "20px";
			this.canvas.style.top = $(window).height() - 20;
			this.canvas.style.zIndex = 20;
			this.canvas.style.position = "absolute";
			this.canvas.style.backgroundColor = "#eee";
			this.canvas.style.borderTop = "1px solid #F9F9F9";
			//this.canvas.className = "header";
			stageDiv = document.getElementsByTagName('body')[0];
			stageDiv.appendChild(this.canvas);
			stage.on("resize", function(w, h){
				self.setTop($(window).height() - 20);
			});
		},
		addControl : function(control)
		{
			if (control.parent != this)
			{
				if (control && control.canvas)
				{
					control.parent = this;
					this.controls.push(control);
					this.canvas.appendChild(control.canvas);
				}
				else
					console.log("unable to addControl :" + JSON.stringify(control));
			}
		},
		
		delControl : function(control)
		{
			if (control.parent == this)
			{
				var index = this.controls.indexOf(control);
				
				if (index >= 0)
				{
					this.controls.splice(index, 1);
					$(control.canvas).remove();
				}
			}
		},
		
		clear : function()
		{
			for (var i = 0; i < this.controls.length; i++)
			{
				var control = this.controls[i];
				
				$(control.canvas).remove();
				control.parent = undefined;
			}
			
			this.controls.length = 0;
		},
		
		addListener : function(event, listener)
		{
			this._super(event, listener);
			
			var self = this;
			
			switch (event)
			{
				case "click" :
								this.canvas.onclick = function(e) { if (!e) e = window.event; self.emit("click", self, e.srcElement == self.clientCanvas)};
								break;
			}
		}
	});
	pasta.gui.Chart = pasta.gui.Control.extend({
		init : function(chartOptions){
			this._super();
			var self = this;
			
			this.chartOptions = {
									color : ["#D32f2f","#2196F3","#FFC107","#388E3C","#00796B","#7B1FA2","#673AB7","#FFA000","#689F38"],
									chart: {
											backgroundColor: {
												linearGradient: { x1: 1, y1: 0, x2: 1, y2: 1 },
												stops: [
													[0, '#FFFFFF'],
													[1, '#FFFFFF']
												]
											},
											events: {
												load: function() {
													$(window).resize();
												}
												},
											renderTo: self.canvas,
											type: chartOptions.type
										},
									title : {text : chartOptions.title },
									xAxis: { categories: [], labels: {}},
									yAxis : { title:{ text:chartOptions.yTitle } },
									credits: {
										enabled: false
									},
									plotOptions : {
										line: {
												dataLabels: {
													enabled: true
												},
											},
									 	series: {
											cursor: 'pointer',
											point: {
												events: {
													click: function (e) {
														self.emit("pointClick", this.series.name, this.x, this.y);
													}
												}
											},
											marker: {
												lineWidth: 1
											}
										}

									},
									legend:{
										layout: 'horizontal',
										backgroundColor: '#FFFFFF',
										align: 'left',
										verticalAlign: 'bottom',
										floating: false
									},
									tooltip: {
											formatter: function() {
												return '<b>'+ this.series.name +'</b><br/>'+
													toRp(this.y) +' '+ this.x;
											}
										},
									exporting: {
										enable:true
									},
									series:[]
								};
			if (chartOptions){
				if (chartOptions.bound){
					this.setLeft(chartOptions.bound[0]);
					this.setTop(chartOptions.bound[1]);
					this.setWidth(chartOptions.bound[2]);
					this.setHeight(chartOptions.bound[3]);
				}
				if (chartOptions.shadow){
					this.shadow.setColor(chartOptions.shadow);
				}
				if (chartOptions.background){
					this.background.setColor(chartOptions.background);
				}
				if (chartOptions.parent){
					chartOptions.parent.addControl(this);
				}
				
			}
			
		},
		addSeries: function(serie){
			this.chartOptions.series.push(serie);
		},
		setType: function(chartType){
			this.chartOptions.chart.type = chartType;
		},
		setCategories: function (cat){
			this.chartOptions.xAxis.categories = cat;
		},
		setyAxisTitle: function(title){
			this.chartOptions.yAxis.title.text = title;
		},
		redraw: function(){
			this.chart.redraw();
		},
		render: function(){
			this.chart = new Highcharts.Chart(this.chartOptions);	
			this.chart.redraw();
			var self = this;
			setTimeout(function(){ 
					self.chart.redraw();
				}, 3000);
		},
		pointClick : function(series, x, y){
			this.emit("pointClick", this, series, x, y);
		}
	});
	pasta.gui.Column = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			this.lTitle = new pasta.gui.Label();
			this.lTitle.font.setColor("#FFFFFF");
			this.lTitle.setTop(3);
			this.lTitle.setLeft(5);
			this.addControl(this.lTitle);
		},	
		setTitle: function(title){
			this.title = title;
			this.lTitle.setCaption(title);
		},
		setWidth: function(data){
			this._super(data);
			this.lTitle.setWidth(data - 10);
		},
		setHeight : function(data){
			this._super(data);
			this.lTitle.setHeight(data);
		}
	});
	pasta.gui.Grid = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super();
			this.headerHeight = 20;
			this.colNumWidth = 40;
			this.rowHeight = 20;
			this.background.setColor("#fff");
			//this.canvas.style.border = "1px solid #dddddd";
			//Col No
			this.noColumn = new pasta.gui.Control();
			this.noColumn.setWidth(this.colNumWidth);
			this.noColumn.setHeight(this.headerHeight);
			this.noColumn.canvas.style.color = "#ffffff";
			this.noColumn.background.setColor("#1979D2");
			this.noColumn.canvas.innerHTML = "No.";
			this.noColumn.canvas.style.borderBottom  ="1px solid #dddddd";
			this.columnContainer = new pasta.gui.ContainerControl();
			this.columnContainer.clientCanvas.style.overflow = "hidden";
			this.columnContainer.canvas.style.color = "#FFFFFF";
			this.columnContainer.canvas.style.borderBottom  ="1px solid #dddddd";
			//this.columnContainer.canvas.style.boxShadow = "0px 1px 3px #888";
			this.columnContainer.canvas.style.borderBottom  ="1px solid #dddddd";
			this.columnContainer.background.setColor("#1979D2");
			
			this.container = new pasta.gui.ContainerControl();
			this.container.clientCanvas.style.position = "relative";
			this.container.canvas.style.overflow = "auto";
			
			this.numContainer = new pasta.gui.ContainerControl();
			this.numContainer.clientCanvas.style.position = "relative";
			this.numContainer.canvas.style.overflow = "hidden";
			this.numContainer.setTop(this.headerHeight);
			
			//Col Title
			//content
			this.addControl(this.container);
			this.addControl(this.noColumn);
			this.addControl(this.columnContainer);
			this.addControl(this.numContainer);
			var self = this;
			$(this.container.canvas).scroll(function(e){
				self.columnContainer.clientCanvas.scrollLeft = self.container.canvas.scrollLeft;
				self.numContainer.canvas.scrollTop = self.container.canvas.scrollTop;
				if (self.container.canvas.scrollTop != 0 && self.container.canvas.scrollTop + self.container.getHeight() >= self.currentIndex * self.rowHeight){
					self.previewNext(self.currentIndex);
				}
			});
			$(this.container.clientCanvas).scroll(function(e){
				self.columnContainer.clientCanvas.scrollLeft = self.container.clientCanvas.scrollLeft;
				
			});
			this.rows = [];
			this.on("resize", function(){
				self.columnContainer.setWidth(self.getWidth() - self.colNumWidth);
				self.columnContainer.setHeight(self.headerHeight);
				self.columnContainer.setLeft(self.colNumWidth);
				
				self.numContainer.setWidth(self.colNumWidth);
				self.numContainer.setHeight(self.getHeight() - self.headerHeight);
				
				self.container.setWidth(self.getWidth() - self.colNumWidth);
				self.container.setHeight(self.getHeight() - self.headerHeight);
				self.container.setTop(self.headerHeight);
				self.container.setLeft(self.colNumWidth);
				self.numContainer.setTop(this.headerHeight);
			});
			this.rowPerPage = 50;
			this.currentIndex = 0;
			
			this.emit("resize");
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
					this.emit("resize");
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.class){
					this.canvas.className = options.class;
				}
				if (options.colTitle)
					this.setColTitle(options.colTitle);
				if (options.columns)
					this.setColTitle(options.columns);
				if (options.headerHeight)
					this.setHeaderheight(options.headerHeight);
			}
		},
		previewNext: function(startIndex){
			var max = this.rows.length;
			if (startIndex + this.rowPerPage < this.rows.length)
				max = startIndex + this.rowPerPage;
			else 
				return;
			for (var i = startIndex; i < max; i++){
				var data = this.rows[i];
				var left = 0;
				var rowItem = new pasta.gui.rowGrid(this);
				rowItem.setWidth(this.totalColumnWidth);
				rowItem.setHeight(this.rowHeight);
				rowItem.setData(data);
				rowItem.rowIndex = this.rows.length - 1;
				this.container.addControl(rowItem);
				
				var no = new pasta.gui.ContainerControl();
				no.canvas.style.position = "relative";
				no.canvas.style.marginTop = "5px";
				no.canvas.style.marginBottom = "5px";
				no.setWidth(this.colNumWidth);
				no.setHeight(this.rowHeight);
				no.canvas.style.borderBottom  = "1px solid #dddddd";
				
				var lbl = new pasta.gui.Label();
				lbl.setHeight(this.rowHeight);
				lbl.setWidth(this.colNumWidth);
				lbl.setCaption(i + 1);
				no.addControl(lbl);
				this.numContainer.addControl(no);
			}
			this.currentIndex = max;
		},
		setHeaderHeight : function(data){
			this.headerHeight = data;
			this.emit("resize");
		},
		addRow: function(data){
			this.rows.push(data);
			if (this.rows.length > this.rowPerPage){
				return;
			}
			this.currentIndex = this.rows.length;
			var left = 0;
			var rowItem = new pasta.gui.rowGrid(this);
			rowItem.setWidth(this.totalColumnWidth);
			rowItem.setHeight(this.rowHeight);
			rowItem.setData(data);
			rowItem.rowIndex = this.rows.length - 1;
			this.container.addControl(rowItem);
			
			var no = new pasta.gui.ContainerControl();
			no.canvas.style.position = "relative";
			no.canvas.style.marginTop = "5px";
			no.canvas.style.marginBottom = "5px";
			no.setWidth(this.colNumWidth);
			no.setHeight(this.rowHeight);
			no.canvas.style.borderBottom  = "1px solid #dddddd";
			
			var lbl = new pasta.gui.Label();
			lbl.setHeight(this.rowHeight);
			lbl.setWidth(this.colNumWidth);
			lbl.setCaption(this.rows.length);
			no.addControl(lbl);
			this.numContainer.addControl(no);
			return rowItem;
		},
		clear: function(){
			this.rows = [];
			this.container.clear();
			this.numContainer.clear();
			this.currentIndex = 0;
			this.container.canvas.scrollTop = 0;

		},
		/*
			title = [{title:"",width:100, type : number/string},{}]
		*/
		setColTitle: function(title){
			this.title = title;
			var left = 0;
			this.totalColumnWidth = 0;
			for (var i = 0; i < title.length; i++){
				var item = title[i];
				var col = new pasta.gui.Column();
				col.setLeft(left);
				col.setWidth(item.width);
				col.setTitle(item.title);
				if (item.type == 0){
					col.lTitle.setAlign("right");
				}
				col.setHeight(this.headerHeight);
				if (item.align)
					col.lTitle.setAlign(item.align);
				this.columnContainer.addControl(col);
				left += item.width;
				
			}
			this.totalColumnWidth = left;
		}
	});
	pasta.gui.rowGrid = pasta.gui.ContainerControl.extend({
		init: function(grid){
			this._super();
			this.canvas.style.position = "relative";
			this.canvas.style.marginTop = "5px";
			this.canvas.style.marginBottom = "5px";
			this.canvas.style.borderBottom  = "1px solid #dddddd";
			this.grid = grid;
		},
		setData :function(data){
			var left = 0;
			var self = this;
			this.data = data;
			for (var i = 0; i < data.length; i++){
				var col = this.grid.title[i];
				if (col.readOnly === false){
					var item = new pasta.gui.Edit();
					item.colIndex = i;
					item.canvas.className = "";
					item.canvas.style.border = "0px solid transparent";
					item.on("change", function(sender){
						console.log("change " + sender.getText());
						self.grid.rows[self.rowIndex][sender.colIndex] = sender.getText();
					});
				}else {
					var item = new pasta.gui.Label();
				}
				item.setLeft(left + 5);
				item.setWidth(col.width - 10);
				item.setHeight(this.getHeight()-1);
				if (col.type == 0){
					item.setAlign("right");
					if (col.readOnly === false){
						item.setText(toRp(data[i]));
						item.setTipeText(ttNilai);
					}else 
						item.setCaption(toRp(data[i]));
					
				}else if (typeof data[i] != "object" ){
					if (col.readOnly === false)
						item.setText(data[i]);
					else 
						item.setCaption(data[i]);
					if (col.align)
						item.setAlign(col.align);
				}else if (data[i] != null){
					if (col.readOnly === false)
						item.setText(data[i].value);    
					else 
						item.setCaption(data[i].value);
					item.canvas.style.cursor = "pointer";
					item.on("click", data[i].click);
				}
				item.rowData = data;
				item.data = data[i];
				left += col.width;
				this.addControl(item);
				
			}
		}
	});
	pasta.gui.Table = pasta.gui.ContainerControl.extend({
		init: function(){
			this._super();
			this.canvas.style.border = "1px solid #d6d6d6";
			this.canvas.style.overflow = "hidden";
			this.clientCanvas.style.overflow = "auto";
			
			this.container = new pasta.gui.Control();
			this.container.setHeight(20);
			this.container.canvas.style.borderBottom = "1px solid #d6d6d6";
			
			this.thCanvas = document.createElement("table");
			this.thCanvas.width = "100%";
			this.thCanvas.style.position = "absolute";
			this.thCanvas.className = "table";
			this.thCanvas.cellSpacing = 0;
			this.thCanvas.cellPadding = 0;
			this.thCanvas.innerHTML = "<thead></thead>";
			this.container.canvas.appendChild(this.thCanvas);
			
			//this.clientCanvas.style.top = "20px";
			this.tCanvas = document.createElement("table");
			this.tCanvas.width = "100%";
			this.tCanvas.style.position = "absolute";
			this.tCanvas.className = "table table-striped table-hover ";
			this.tCanvas.cellSpacing = 0;
			this.tCanvas.cellPadding = 0;
			this.tCanvas.innerHTML = "<thead></thead><tbody></tbody><tfoot></tfoot>";
			this.clientCanvas.appendChild(this.tCanvas);
			//this.canvas.appendChild(this.container.canvas);
		},
		setColumn: function(html){
			var self = this;
			$(this.tCanvas).find("thead").html(html);
			
		},
		addRow: function(html){
			$(this.tCanvas).find("tbody").append(html);
		},
		setTotal: function(html){
			var self = this;
			$(this.thCanvas).find("thead").empty();
			$(this.tCanvas).find("tfoot").html(html);
			var height = $(this.tCanvas).find("thead").height();
			
			$(this.tCanvas).find("th").each(function(){
				try{
					//var width = $(this).width();
					//if (width != 19)
					{
					//	$(self.thCanvas).append(this);
					//	this.width = width;
					}
				}catch(e){
					console.log(e);
				}
			});
			//self.container.setHeight(height);
			//self.clientCanvas.style.height = (self.getHeight() - height) +"px";
			//self.clientCanvas.style.top = height +"px";
		},
		clear : function(){
			$(this.tCanvas).find("tbody").empty();
			$(this.tCanvas).find("tfoot").empty();
		},
		setWidth : function(data){
			this._super(data);
			this.container.setWidth(data);
		},
		setHeight : function(data){
			this._super(data);
			//this.clientCanvas.style.height = (data - 20) +"px";
		}
	});
	pasta.gui.List = pasta.gui.Control.extend({
		init: function(options){
			this._super(options);
			this.controls = new Array();
			this.canvas = document.createElement("ul");

			if (options.class)
				this.canvas.className = options.class;
			this.canvas.style.overflowX = "hidden";
		},
		addHeader : function(caption){
			var item = document.createElement("li");
			item.className = "header";
			$(item).html("<h5>"+caption+"</h5>");
			this.canvas.appendChild(item);
		},
		addControl: function(control){
			this.controls.push(control);
			control.parent = this;
			this.canvas.appendChild(control.canvas);
		}
	});
	pasta.gui.ListItem = pasta.gui.Control.extend({
		init: function(options){
			this._super();
			this.canvas = document.createElement("li");
			this.canvas.style.overflow = "hidden";
			if (options.className != undefined)
				this.canvas.className = options.className;

			this.controls = new Array();
			this.title = document.createElement("a");
			$(this.title).attr("href","#");
			this.canvas.appendChild(this.title);

			if (options.caption){
				this.setCaption(options.caption);
			}
			var self = this;

			$(this.canvas).on("click", function(e){
				e.stopPropagation();
				{
					if (self.controls[0] && $(self.controls[0].canvas).is(":visible")){
						
						$(self.canvas).removeClass("active");
						$(self.canvas).css({background: "#ffffff"});
						$(self.controls[0].canvas).slideUp(500, function(){
							$(self.controls[0].canvas).removeClass("menu-open");
						});
					}else 
					{
						var parent = self.parent;
						
						for (var i = 0; i < parent.controls.length;i++){
							var ctrl = parent.controls[i];
							if (ctrl.controls.length > 0 && $(ctrl.controls[0].canvas).is(":visible")){
								var ul = $(ctrl.controls[0].canvas).slideUp(500);
								var activeCtrl = $(ctrl.canvas);
								activeCtrl.css({background: "#ffffff"});
								ul.removeClass("menu-open");
								
							}
						}
						$(self.canvas).css({background: "rgba(239,239,239,0.7)"});
						if (self.controls[0]){
							$(self.controls[0].canvas).slideDown(500, function(){
								$(self.controls[0].canvas).addClass("menu-open");
								if (activeCtrl){
									activeCtrl.removeClass("active");
								}
								$(self.canvas).addClass("active");
								
							});
						}
						
					}
				}
				if (self.program != "-"){
					if (self.appForm == undefined){
						uses([self.program], function(data){
							eval("self.appForm = new "+ self.program + "();");
							app.mainForm.addControl(self.appForm);
							app.mainForm.setActiveForm(self.appForm);
						});
					}else {
						app.mainForm.setActiveForm(self.appForm);
					}
					
				}
				
				
			});
		},
		setData : function(data){
			this.program = data;
		},
		setCaption: function(caption){
			this.caption  = caption;
			$(this.title).html(caption);
		},
		/*
			add sub menu
		*/
		addControl : function(control){
			this.controls.push(control);
			this.canvas.appendChild(control.canvas);
		}
	});

	/*
	-------------------------------------
	-			-						-
	-	icon	-						-
	-			-						-
	-------------------------------------
	*/
	pasta.gui.InfoBox = pasta.gui.ContainerControl.extend({
		init : function(options){
			this._super(options);
			$(this.clientCanvas).addClass("info-box");
			
			this.icon = document.createElement("span");
			$(this.icon).addClass("info-box-icon");
			this.clientCanvas.appendChild(this.icon); 
			this.bgColor = "";
			this.boxContent = document.createElement("div");
			$(this.boxContent).addClass("info-box-content");
			this.messageBox = document.createElement("span");
			$(this.messageBox).addClass("info-box-text");
			this.boxContent.appendChild(this.messageBox);
			this.numberText = document.createElement("span");
			$(this.numberText).addClass("info-box-number");
			this.boxContent.appendChild(this.numberText);

			this.subText = document.createElement("span");
			$(this.subText).addClass("progress-description");
			this.boxContent.appendChild(this.subText);

			this.clientCanvas.appendChild(this.boxContent);
			
			/*
			 <span class="progress-description">
                    50% Increase in 30 Days
                  </span>
			*/

		},
		
		setBackground: function(bgClass, model){// bg-aqua, bg-green
			$(this.icon).removeClass(this.bgColor);
			$(this.clientCanvas).removeClass(this.bgColor);
			this.bgColor = bgClass;
			if (model == undefined || model == 0)
				$(this.icon).addClass(bgClass);
			else if (model == 1)
				$(this.clientCanvas).addClass(bgClass);
			$(this.clientCanvas).css({borderRadius :"10px"});
		},
		setIcon : function(icon){
			$(this.icon).html("<i class='"+ icon +"'></i>");
		},
		setMessage: function(message){
			$(this.messageBox).html(message);
		},
		setNumber : function(message){
			$(this.numberText).html(message);
		},
		setSubtitle: function(text){
			$(this.subText).html("<i>"+text+"</i>");
		}

	});

	/*
	-------------------------------------
	-						-			-
	-						-	icon	-
	-						-			-
	-------------------------------------
	-------------------------------------
	*/
	pasta.gui.SmallBox = pasta.gui.ContainerControl.extend({
		init : function(options){
			this._super(options);
			$(this.clientCanvas).addClass("small-box");
			this.icon = document.createElement("div");
			$(this.icon).addClass("icon");
			this.clientCanvas.appendChild(this.icon); 
			
			this.boxContent = document.createElement("div");
			$(this.boxContent).addClass("inner");
			this.clientCanvas.appendChild(this.boxContent);
			
			this.messageBox = document.createElement("p");
			this.boxContent.appendChild(this.messageBox);
			this.numberText = document.createElement("h3");
			this.boxContent.appendChild(this.numberText);
			this.mInfo = document.createElement("span");
			$(this.mInfo).css({height:"15px",width:"100%",paddingLeft:"10px",top: this.height - 40, position:"absolute", textAlign:"left"});
			this.boxContent.appendChild(this.mInfo);
			
			this.footer = document.createElement("a");
			$(this.footer).addClass("small-box-footer");
			$(this.footer).css({zIndex:0});
			$(this.footer).css({display:"none"});
			this.clientCanvas.appendChild(this.footer);
			var self = this;
			$(this.footer).on("click", function(){
				self.emit("footerClick");
			});
			this.paddingCnv = document.createElement("div");
			$(this.paddingCnv).css({height:"10px",width:"100%",top: this.height - 10, position:"absolute"});
			this.canvas.appendChild(this.paddingCnv);
			$(this.clientCanvas).css({height: this.height - 10});

		},
		setMoreInfo : function(info){
			$(this.mInfo).html("<i>"+info+"</i>");
			$(this.mInfo).css({top: this.height - 50});
		},
		setHeight: function(data){
			this._super(data);
			if (this.paddingCnv){
				$(this.clientCanvas).css({height: data - 10});
				$(this.paddingCnv).css({top: data - 10});
				$(this.mInfo).css({top:data - 50});
			}
		},
		setBackground: function(bgClass){// bg-aqua, bg-green
			$(this.clientCanvas).addClass(bgClass);
		},
		setIcon : function(icon){
			$(this.icon).html("<i class='"+ icon +"'></i>");
		},
		setMessage: function(message){
			$(this.messageBox).html(message);
		},
		setNumber : function(message){
			$(this.numberText).html(message);
		},
		setFooter: function(text){
			$(this.footer).css({display:""});
			$(this.footer).html(text);
		}
	});

	pasta.gui.Box = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			$(this.clientCanvas).addClass("box");//widget-user widget-user-2
			//widget-user-header bg-yellow
			this.boxHeader = document.createElement("div");
			$(this.boxHeader).addClass("box-header");// bg-yellow
				this.icon = document.createElement("i");
				$(this.icon).addClass("fa fa-th");
				this.boxHeader.appendChild(this.icon);
				this.boxTitle = document.createElement("h3");
				$(this.boxTitle).addClass("box-title");
				this.boxHeader.appendChild(this.boxTitle);
				
			this.clientCanvas.appendChild(this.boxHeader);

			this.boxBody = document.createElement("div");
			$(this.boxBody).addClass("box-body");
			//$(this.boxBody).css({background:"grey", height:"100%", overflow:"hidden"});
			this.clientCanvas.appendChild(this.boxBody);

			this.boxFooter = document.createElement("div");
			$(this.boxFooter).addClass("box-footer no-padding");
			this.clientCanvas.appendChild(this.boxFooter);
			
		},
		
		setBoxModel: function (model){
			$(this.clientCanvas).addClass(model);
		},	
		setIcon : function(icon){
			$(this.icon).addClass(icon);
		},
		setHeaderModel: function(model){
			//$(this.boxHeader).removeClass("widget-user-header");
			$(this.boxHeader).removeClass("box-header");
			$(this.boxHeader).addClass(model);
		},	
		setContent : function(content){
			$(this.boxBody).show();
			$(this.boxBody).html(content);
		},
		addControl:function(control){
			this.controls.push(control);
			this.boxBody.appendChild(control.canvas);
		},	
		setTitle :function (caption){
			$(this.boxTitle).html(caption);
		},
		clear : function()
		{
			try{
				for (var i = 0; i < this.controls.length; i++)
				{
					var control = this.controls[i];
					
					this.boxBody.removeChild(control.canvas);
					control.parent = undefined;
				}
				
				this.controls.length = 0;
			}catch(e){
				console.log(e);
			}
		},
		setFooter: function (data){
			$(this.boxFooter).html(data);
		}, 
		addToFooter: function(canvas){
			$(this.boxFooter).append(canvas);
		}
		
	});
	pasta.gui.BreadCrumb = pasta.gui.Control.extend({
		init: function(){
			this._super();
		}
	});
	pasta.gui.Tab = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			$(this.clientCanvas).addClass("nav-tabs-custom");

			this.header = document.createElement("ul");
			$(this.header).addClass("nav nav-tabs pull-right");
			this.title = document.createElement("li");
			$(this.title).addClass("pull-left header");
			this.header.appendChild(this.title);
			this.clientCanvas.appendChild(this.header);
			
			this.tabContent = document.createElement("div");
			$(this.tabContent).addClass("tab-content no-padding");
			this.clientCanvas.appendChild(this.tabContent);
			this.tabChilds = [];
			this.activeCtrl = null;
			this.activeTab = null;
		},
		setTitle :function (caption){
			$(this.title).html(caption);
		},
		addTab: function(title, container){
			try{
				var tabChild = document.createElement("li");
				var index = this.tabChilds.length;
				if (this.tabChilds.length == 0) {
					$(tabChild).addClass("active");	
					this.activeTab = tabChild;
					this.activeCtrl = container;
				}
				var self = this;
				var href = document.createElement("a");
				
				$(href).on("click", function(e){
					try{
						if (self.activeCtrl != null){
							$(self.activeCtrl.canvas).removeClass("active");
							$(self.activeTab).removeClass("active");
						}
						self.activeCtrl = container;
						self.activeTab = tabChild;
						$(container.canvas).addClass("active");
						$(self.activeTab).addClass("active");
					}catch(e){
						console.log(e);
					}
				});
				//$(href).attr("data-toggle","tab");	
				$(href).html(title);
				$(tabChild).append(href);
				this.header.appendChild(tabChild);
				this.tabChilds[this.tabChilds.length] = tabChild;
			}catch(e){
				console.log(e);
			}
		},
		addControl:function(control){
			this.controls.push(control);
			this.tabContent.appendChild(control.canvas);
		},	
		
	});




	//----------------------------------------------------------------------------------------------------------------------------------
	pasta.gui.App = EventEmitter.extend(
	{
		init : function() 
		{
			this._super();
			
			
		}
	});

	//========================================== START ===========================================
	package("pasta.net");
	package("dashboard");
	package("dashboard.form");
	package("dashboard.grafik");
	package("dashboard.dataModel");
	package("dashboard.dataModel.operational");
	package("dashboard.dataModel.financial");
	package("dashboard.dataModel.rkap");
	package("dashboard.dataModel.ratio");
	package("dashboard.dataModel.outlook");
	package("dashboard.dashboard");

	var CryptoJSAesJson = {
		stringify: function (cipherParams) {
			var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
			if (cipherParams.iv) j.iv = cipherParams.iv.toString();
			if (cipherParams.salt) j.s = cipherParams.salt.toString();
			return JSON.stringify(j);
		},
		parse: function (jsonStr) {
			var j = JSON.parse(jsonStr);
			var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
			if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
			if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
			return cipherParams;
		}
	}
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	;
	function generate(data){
		try{
			var tmp = CryptoJS.AES.decrypt(data, application.key, {format: CryptoJSAesJson});
			tmp = tmp.toString(CryptoJS.enc.Utf8); 
			tmp = JSON.parse(tmp);
		
			return Base64.decode(tmp);	
		}catch(e){
			alert("generate error");	
		}
	}

	pasta.net.JSONRPC = EventEmitter.extend(
	{
		init : function(url)
		{
			this._super();

			this.id = 1;
			this.address = url;
			this.ready = false;

			var list = pasta.net.JSONRPC.descCache[url];

			if (list == null)
			{
				var self = this;

				this.call("describe", [],
					function(list)
					{
						self.build(list);
					});
			}
			else
				this.build(list);
		},

		isReady : function()
		{
			return this.ready;
		},

		build : function(list)
		{
			var self = this;

			self.ready = true;

			for (var i in list)
			{
				var paramList = list[i];
				var paramString = "";
				var paramStringArray = "";

				for (var j in paramList)
				{
					paramString += paramList[j] + ", ";
					paramStringArray += ", " + paramList[j];
				}

				if (paramStringArray != "")
					paramStringArray = paramStringArray.substr(2);

				var script = "self." + i + " = function(" + paramString + "cb){ this.call('" + i + "', [" + paramStringArray + "], cb); }";
				eval(script);
			}

			self.emit("ready");
		},

		setAddress : function(data)
		{
			this.address = data;
		},

		getAddress : function(data)
		{
			return this.address;
		},
		call : function(methodName, args, callback)
		{

			if (typeof(args) == "function")
			{
				callback = args;
				args = undefined;
			}

			var callHandler = false;
			var self = this;

			var message = null;

			if (args == null)
			{
				if (typeof(callback) != "function")
					message = {jsonrpc : "2.0", method : methodName};
				else
				{
					message = {jsonrpc : "2.0", method : methodName, id : this.id };
					this.id++;
				}
			}
			else
			{
				if (typeof(callback) != "function")
					message = {jsonrpc : "2.0", method : methodName, params : args};
				else
				{
					message = {jsonrpc : "2.0", method : methodName, params : args, id : this.id };
					this.id++;
				}
			}

			var urlTarget = this.address;
			var msEpoch = new Date().getTime();

			if (urlTarget.indexOf("?") <= 0)
				urlTarget += "?timeStamp=" + msEpoch;
			else
				urlTarget += "&timeStamp=" + msEpoch;

			$.ajax({url: urlTarget,
				data: JSON.stringify(message),
				type: 'POST',
				dataType : "json",
				headers: {'Accept': 'application/json','Access-Control-Allow-Origin': '*'},
				crossDomain: true,
				beforeSend: function() {
					app.showLoading();

				},
				complete: function() {
					app.hideLoading();
				},
				success: function (result) {
					try{
						if (!callHandler)
						{
							callHandler = true;
							var handlerFunc = null;
							var handlerObj = null;

							if (typeof(callback) == "function")
								handlerFunc = callback;
							else if ((callback instanceof Array) && (callback.length == 2) && (typeof(callback[1]) == "function"))
							{
								handlerObj = callback[0];
								handlerFunc = callback[1];
							}

							if (handlerFunc != null)
							{
								var response = result;


								try
								{
									//alert(response);
									var responseMessage = response;
								}
								catch (e)
								{
									self.emit("error", "Calling " + methodName + ", returning invalid response :" + response);
									return;
								}

								if (responseMessage.error == null)
									handlerFunc.call(handlerObj, responseMessage.result);
								else
									self.emit("error", "Calling " + methodName + ", returning Object Error : " + responseMessage.error);
							}
						}

					}catch(e){
						self.emit("error", "Calling " + methodName + ", returning Server Error : " + e + " : " + response);
						return false;
					}
				},
				error: function (request,error, thrown) {
					// This callback function will trigger on unsuccessful action
					app.hideLoading();
					self.emit("error", "Calling " + methodName + ", returning Server Error : " + error + " : " + thrown);
					return false;
				}
			});
		},
		call2 : function(methodName, args, callback)
		{
			var xhr = new XMLHttpRequest();

			if (typeof(args) == "function")
			{
				callback = args;
				args = undefined;
			}

			var callHandler = false;
			var self = this;

			xhr.onreadystatechange =
				function()
				{
					if ((xhr.readyState == 4) && (!callHandler))
					{
						callHandler = true;
						var handlerFunc = null;
						var handlerObj = null;

						if (typeof(callback) == "function")
							handlerFunc = callback;
						else if ((callback instanceof Array) && (callback.length == 2) && (typeof(callback[1]) == "function"))
						{
							handlerObj = callback[0];
							handlerFunc = callback[1];
						}

						if (handlerFunc != null)
						{
							var response = xhr.responseText;

							if (xhr.status == "200")
							{
								try
								{
									//alert(response);
									var responseMessage = JSON.parse(response);
								}
								catch (e)
								{
									self.emit("error", "Calling " + methodName + ", returning invalid response :" + response);
									return;
								}

								if (responseMessage.error == null)
									handlerFunc.call(handlerObj, responseMessage.result);
								else
									self.emit("error", "Calling " + methodName + ", returning Object Error : " + responseMessage.error);
							}
							else
								self.emit("error", "Calling " + methodName + ", returning Server Error : " + xhr.status + " : " + response);
						}
					}
				}

			var message = null;

			if (args == null)
			{
				if (typeof(callback) != "function")
					message = {jsonrpc : "2.0", method : methodName};
				else
				{
					message = {jsonrpc : "2.0", method : methodName, id : this.id };
					this.id++;
				}
			}
			else
			{
				if (typeof(callback) != "function")
					message = {jsonrpc : "2.0", method : methodName, params : args};
				else
				{
					message = {jsonrpc : "2.0", method : methodName, params : args, id : this.id };
					this.id++;
				}
			}

			var urlTarget = this.address;
			var msEpoch = new Date().getTime();

			if (urlTarget.indexOf("?") <= 0)
				urlTarget += "?timeStamp=" + msEpoch;
			else
				urlTarget += "&timeStamp=" + msEpoch;

			xhr.open("POST", urlTarget, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(message));
		},

		download : function()
		{
			this.id++;

			var params = "mode=download&callId=" + this.id;

			for (var i = 0; i < arguments.length; i++)
			{
				if (i == 0)
					params += "&method=" + encodeURI(arguments[i]);
				else
					params += "&p" + (i - 1) + "=" + encodeURI(arguments[i]);
			}

			var target = this.address;

			if (target.indexOf("?") > 0)
				target += "&" + params;
			else
				target += "?" + params;

			window.location = target;
		}
	});

	pasta.net.JSONRPC.descCache = {};

	app.systemBar = 0;//android
	//----------------------------------------------------------------------------------------------------------------------------------
	dashboard.MenuCaptionPopup = pasta.gui.ContainerControl.extend({
		init: function (options){
			this._super(options);
			$(this.canvas).css({borderTop:"1px solid #cfcfcf",borderBottom:"1px solid #cfcfcf",borderRight:"1px solid #cfcfcf", background:"#fffefefe"});
			this.lTitle = new pasta.gui.Label({bound:[10,10,this.getWidth() - 20, this.getHeight()]});
			this.addControl(this.lTitle);
		},
		setCaption: function(caption){
			this.lTitle.setCaption(caption);
		}
	});
	dashboard.MenuSideBar = pasta.gui.ContainerControl.extend({
		init: function (options){
			this._super(options);
			$(this.clientCanvas).css({overflowY: "auto"});
			this.listMenu = new pasta.gui.List({class : "sidebar-menu"});
        	$(this.listMenu.canvas).css({borderTop:"1px solid #cfcfcf"});
			this.iconBig = false;
			this.addControl(this.listMenu);
			if (app.menuCaptionContainer == undefined){
				app.menuCaptionContainer = new dashboard.MenuCaptionPopup({bound:[0,0,200,40]});
				$(app.menuCaptionContainer.canvas).css({zIndex:9});
				stage.addControl(app.menuCaptionContainer);
				app.menuCaptionContainer.hide();
			}
		},
		addMenu: function(item,parent){
			try{
				var self = this;
				
				if (item.tipe == "HEADER"){
					parent.addHeader(item.nama);
					$.each(item.childs, function(key, value)
					{
						self.addMenu(value, parent);
					});
				}else {
					var caption = '<i class="fa fa-'+ item.icon +'"></i> <span><b>'+ item.nama +'</b></span>';
					
					if (item.childs.length > 0){
						caption += ' <span class="pull-right-container">'+
									' <i class="fa fa-angle-left pull-right"></i>'+
									' </span>';
					}
					var node = new pasta.gui.ListItem({className : "treeview", caption : caption});
					node.setData(item.program);
					parent.addControl(node);
					node.on("mouseOver", function(sender){
						if (self.iconBig){
							var pos = $(sender.canvas).offset();
							app.menuCaptionContainer.setCaption(item.nama);
							$(app.menuCaptionContainer.canvas).show();
							$(app.menuCaptionContainer.canvas).css({left:pos.left + 51, top : pos.top + 5});
						}
					});
					node.on("mouseOut", function(){
						if (self.iconBig){
							$(app.menuCaptionContainer.canvas).hide();
						}
					});
					if (item.childs.length > 0){
						listMenu = new pasta.gui.List({class:"treeview-menu"});
						node.addControl(listMenu);
						$.each(item.childs, function(key, value)
						{
							self.addMenu(value, listMenu);
						});
					}
				}
				
				
				
				
			}catch(e){
				console.log(e);
			}			
		},
		setMenu: function(listItem){
			//kode, nama, icon, childs, program, tipe
			var self = this;
			$.each(listItem, function(key, value)
			{
				self.addMenu(value, self.listMenu);
			});
		},
		setIconBig: function(){
			this.iconBig = true;
			$.each(this.listMenu.controls, function(key,val){
				$(val.canvas).find("i").addClass("fa-2x");
				$(val.canvas).find("span").css({display:"none"});
			});
			$(this.canvas).find(".header").css({display:"none"});
		},
		setIconSmall: function(){
			this.iconBig = false;
			$.each(this.listMenu.controls, function(key,val){
				$(val.canvas).find("i").removeClass("fa-2x");
				$(val.canvas).find("span").css({display:""});
			});
			$(this.canvas).find(".header").css({display:""});
		}
	});
	dashboard.FlatButton = pasta.gui.ContainerControl.extend(
	{
		init : function(options)
		{
			this._super();
			var self = this;
			
			this.borderColor = "#FFFFFF";
			this.captionColor = "#FFFFFF";
			this.backgroundColor = "rgba(255, 255, 255, 0.4)";
			
			this.canvas.style.overflow = "hidden";
			this.canvas.className = "btn btn-primary btn-raised";
			this.border.setPattern("dashed");
			this.border.setWeight(1);
			this.border.setColor("rgba(255, 255, 255, 0)");
			
			this.setCursor("pointer");
			
			this.lblTitle = new pasta.gui.Label();
			this.lblTitle.setLeft(38);
			this.lblTitle.setTop(7);
			this.lblTitle.setWidth(this.getWidth() - this.lblTitle.getLeft());
			this.lblTitle.setHeight(32);
			this.lblTitle.font.setSize(16);
			this.lblTitle.font.setColor("#FFFFFF");
			this.lblTitle.setCaption("Caption");
			this.lblTitle.setSelectable(false);
			this.addControl(this.lblTitle);
			
			this.picIcon = new pasta.gui.Picture();
			this.picIcon.setLeft(5);
			this.picIcon.setTop(2);
			this.picIcon.setWidth(32);
			this.picIcon.setHeight(32);
			this.addControl(this.picIcon);
			
				this.on("mouseOver",
					function()
					{
						self.border.setColor(self.borderColor);
					});
				
				this.on("mouseOut",
					function()
					{
						self.border.setColor("rgba(255, 255, 255, 0)");
					});
				
				this.on("mouseDown",
					function()
					{
						self.background.setColor(self.backgroundColor);
						self.lblTitle.font.setColor("#ffff00");
					});
				
				this.on("mouseUp",
					function()
					{
						self.background.setColor(null);
						self.lblTitle.font.setColor(self.captionColor);
					});
			if (options){
				if (options.bound){
					this.setLeft(options.bound[0]);
					this.setTop(options.bound[1]);
					this.setWidth(options.bound[2]);
					this.setHeight(options.bound[3]);
				}
				if (options.shadow){
					this.shadow.setColor(options.shadow);
				}
				if (options.background){
					this.background.setColor(options.background);
				}
				if (options.parent){
					options.parent.addControl(this);
				}
				if (options.caption)
					this.setCaption(options.caption);
				
				if (options.icon)
					this.setIcon(options.icon);
				
				if (options.placeHolder) this.setPlaceHolder(options.placeHolder);
			}
		},
		
		setCaptionColor : function(data)
		{
			this.captionColor = data;
			
			this.lblTitle.font.setColor(this.captionColor);
		},
		
		setBorderColor : function(data)
		{
			this.borderColor = data;
		},
		
		setIcon : function(data)
		{
			this.picIcon.setImage(data);
		},
		
		setCaption : function(data)
		{
			this.lblTitle.setCaption(data);
		},
		
		setWidth : function(data)
		{
			this._super(data);
			
			this.lblTitle.setWidth(this.getWidth() - this.lblTitle.getLeft());
		},
		
		setHeight : function(data)
		{
			this._super(data);
			
			this.picIcon.setTop((this.getHeight() - this.picIcon.getHeight()) / 2);
		},
	});
	dashboard.TreeviewNode = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super();
			var self = this;
			this.canvas.style.width = "100%";
			this.canvas.style.height = "auto";
			this.canvas.style.position = "relative";
			this.clientCanvas.style.width = "100%";
			this.clientCanvas.style.height = "auto";
			this.clientCanvas.style.overflow = "hidden";
			this.clientCanvas.style.position = "relative";

			this.headerContainer = new pasta.gui.ContainerControl();
			$(this.headerContainer.canvas).css({position:"relative", width:"100%", height: 30});
			$(this.canvas).prepend(this.headerContainer.canvas);

			this.collapseIcon = new pasta.gui.Control({bound:[5,5,20,20]});
			$(this.collapseIcon.canvas).html("<i class='fa fa-caret-right'></i>");
			$(this.collapseIcon.canvas).css({cursor: "pointer"});
			this.headerContainer.addControl(this.collapseIcon);
			this.collapseIcon.on("click", function(){
				if (self.hasChild){
					if (self.isExpanded())
						self.collapse();
					else self.expand();
				}
				
			});

			this.lTitle = new pasta.gui.Label({bound:[30,5,200, 25], caption:"testing item", fontSize:12});
			this.lTitle.font.setColor("#000000");
			this.lTitle.canvas.style.width = "100%";
			this.headerContainer.addControl(this.lTitle);

			this.iconCont = new pasta.gui.Control({bound:[30, 5 , 20, 20]});
			this.iconCont.setVisible(false);
			this.headerContainer.addControl(this.iconCont);

			$(this.headerContainer.canvas).on("mouseover", function(){
				$(this).css({background:"#EEEEEE"});
			});
			$(this.headerContainer.canvas).on("mouseout", function(){
				$(this).css({background:"#ffffff"});
			});
		},
		collapse: function(){
			$(this.clientCanvas).hide();
			$(this.collapseIcon.canvas).html("<i class='fa fa-caret-right'></i>");
		},
		expand : function(){
			$(this.clientCanvas).show();
			$(this.collapseIcon.canvas).html("<i class='fa fa-caret-down'></i>");
		},
		isExpanded: function(){
			return $(this.clientCanvas).is(":visible");
		},
		setWidth: function(data){
			this._super(data);
			if (this.lTitle)
				this.lTitle.setWidth(data);
		},
		setData: function(caption, data){
			this.data = data;
			this.lTitle.setCaption(caption);
			var left = 20 * data.level_spasi;
			this.collapseIcon.setLeft(left + 5 );
			this.lTitle.setLeft( left + 25);

			var self = this;
			this.hasChild = false;
			if (data.childs && data.childs.length > 0){
				this.hasChild = true;
				$.each(data.childs,function(key, val){
					var node = new dashboard.TreeviewNode();
					node.setData(val.nama, val);
					node.setWidth(self.getWidth());
					self.addControl(node);
				});
				this.collapse();
			}else {
				$(this.collapseIcon.canvas).html("<i class='fa fa-angle-right'></i>");
			}
		},
		setIcon : function(icon){
			this.icon = icon;
		}
	});
	dashboard.Treeview = pasta.gui.ContainerControl.extend({
		init:  function(options){
			this._super(options);
			this.canvas.style.overflow = "hidden";
			this.clientCanvas.style.overflowX = "hidden";
			this.clientCanvas.style.position = "relative";
		},
		setData: function(data){
			this.data = data;
			var self = this;
			$.each(data, function(key, val){
				var node = new dashboard.TreeviewNode();
				node.setData(val.nama, val);
				node.setWidth(self.getWidth());
				self.addControl(node);
			});
		}
	});

	dashboard.GridColumn = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			this.lTitle = new pasta.gui.Label({bound:[0 , 5, this.getWidth(), this.getHeight() - 0], color:"#ffffff",fontSize:14, bold:true, align:"center"});
			this.lTitle.setWordWrap(true);
			this.addControl(this.lTitle);
			this.columnHeader = new pasta.gui.ContainerControl({bound:[0,30,this.getWidth(), 30]});
			$(this.columnHeader.canvas).css({borderBottom:"1px solid #dfdfdf", overflow:"hidden",position:"relative", background:"#b71c1c"});
				//$(this.canvas).prepend(this.columnHeader.canvas);
			this.addControl(this.columnHeader);
		},
		setCaption: function(caption, data, flatColumns){
			this.lTitle.setCaption(caption);
			if (data.columns) {
				var left  = 0;
				$(this.columnHeader.canvas).css({borderTop:"1px solid #dfdfdf"});
				var self = this;
				this.columns = data.columns;
				this.allColWidth = 0;
				$(this.columnHeader.clientCanvas).empty();
				this.columnHeader.controls = [];
				$.each(data.columns, function(key, val){
					try{
						if (val.columns == undefined || val.columns.length == 0)
							flatColumns.push(val);
						var column = new dashboard.GridColumn({bound:[left, 0, val.width, 30]});
						column.setCaption(val.title, val);
						self.columnHeader.addControl(column);
						if (key < data.columns.length - 1)
							$(column.canvas).css({borderRight:"1px solid #ffffff"});
						left += val.width;
					}catch(e){
						console.log("SetColumn "+ e);
					}
				});
			}
		}
	});

	dashboard.TreeGrid = pasta.gui.ContainerControl.extend({
		init: function(options){
			try{
				this._super(options);
				this.canvas.style.overflow = "hidden";
				this.clientCanvas.style.overflow = "auto";
				this.clientCanvas.style.position = "relative";
				$(this.clientCanvas).css({height : this.getHeight() - 30 , width:this.getWidth() });

				this.columnHeader = new pasta.gui.ContainerControl({bound:[0,0,this.getWidth(), 30]});
				$(this.columnHeader.canvas).css({borderBottom:"1px solid #dfdfdf", overflow:"hidden",position:"relative", background:"#b71c1c"});
				$(this.canvas).prepend(this.columnHeader.canvas);
				this.dragable = false;
				var self = this;
				$(this.clientCanvas).scroll(function(e){
					try{
						self.columnHeader.canvas.scrollLeft = self.clientCanvas.scrollLeft;
					}catch(e){
						console.log(e);
					}
				});
				if (options){
					if (options.column) this.setColumn(options.column);
					if (options.bound) {
						this.setLeft(options.bound[0]);
						this.setTop(options.bound[1]);
						this.setWidth(options.bound[2]);
						this.setHeight(options.bound[3]);
					}
				}
			}catch(e){
				console.log(e);
			}
			
		},
		clear: function(){
			//this._super();
			$(this.clientCanvas).empty();
			this.controls = [];
		},
		setHeaderHeight: function(data){
			this.columnHeader.setHeight(data);
			$(this.clientCanvas).css({height : this.getHeight() - data });	
			$.each(this.columnHeader.controls, function(key, val){
				val.setHeight(data);
			});
		},
		setColumn: function(data){
			this.flatColumns = [];
			var left  = 0;
			var self = this;
			this.columns = data;
			this.allColWidth = 0;
			$(this.columnHeader.clientCanvas).empty();
			this.columnHeader.controls = [];
			$.each(data, function(key, val){
				try{
					if (val.columns == undefined || val.columns.length == 0)
						self.flatColumns.push(val);
					var column = new dashboard.GridColumn({bound:[left, 0, val.width, 30]});
					column.setCaption(val.title, val, self.flatColumns);
					self.columnHeader.addControl(column);
					if (key < data.length - 1)
						$(column.canvas).css({borderRight:"1px solid #ffffff"});
					left += val.width;
				}catch(e){
					console.log("SetColumn "+ e);
				}
			});
			this.allColWidth = left;
		},
		setFields: function(fields, keyfield){
			this.fields = fields;
			this.keyfield = keyfield;
			this.data = [];
		},
		setDraggable: function(data){
			this.draggable =data;
		},
		isDraggable: function(){
			return this.draggable;
		},
		setData : function(data, fields, keyfield){
			this.data = data;
			this.fields = fields;
			this.keyfield = keyfield;
			var self = this;
			this.rowCount = 0;
			this.rowNodes = [];
			this.clear();
			var node = "",lastNode="";
			$.each(data, function(key, val){
				var node = new dashboard.TreeGridNode();
				if (val.level_spasi == undefined)
					val.level_spasi = 0;
					
				node.setGrid( self );
				if (val.childs == undefined){
					if (lastNode == ""){
						self.addControl(node);
					}else if (parseFloat(lastNode.data.level_spasi) == parseFloat(val.level_spasi) - 1){
						lastNode.addControl(node);
					}else if (parseFloat(lastNode.data.level_spasi)== parseFloat(val.level_spasi) ){
						lastNode.parent.addControl(node);
					}else if (parseFloat(lastNode.data.level_spasi) > parseFloat(val.level_spasi) ){
						while (lastNode.parent != self && parseFloat(lastNode.data.level_spasi) > parseFloat(val.level_spasi) ) {
							lastNode = lastNode.parent;
						}
						lastNode.parent.addControl(node);
					}
					lastNode = node;
				}
				node.setData(val, fields, keyfield);
				node.setWidth(self.allColWidth);
			});
			this.reIndexingNode();
		},
		getData: function(){
			var result = [];
			$.each(this.rowNodes, function(key, val){
				result.push(val.data);
			});
			return result;
		},
		appendRow: function(data, parent){
			data.childs = [];
			var node = new dashboard.TreeGridNode();
			if (parent instanceof dashboard.TreeGrid){
				node.level = 0;
				data.level_spasi = 0;
				this.data.push(data);
			}else {
				node.level = parent.data.level_spasi + 1;
				//node.data.level_spasi = parent.level + 1;
			}
			node.setGrid( this );
			node.setData( data, this.fields, this.keyfield);
			node.setWidth(this.getWidth());
			parent.addControl(node);
			this.reIndexingNode();
			return node;
		},
		indexingChilds: function(node){
			var self = this;
			$.each(node.controls, function(key, val){
				self.rowNodes.push(val);
				self.rowCount++;
				val.rowIndex = self.rowCount;
				self.indexingChilds(val);
			})
		},
		reIndexingNode: function(){
			this.rowNodes = [];
			this.rowIndex = 0;
			this.rowCount = 0;
			var self = this;
			$.each(this.controls, function(key, val){
				self.rowNodes.push(val);
				self.rowCount++;
				val.rowIndex = self.rowCount;
				self.indexingChilds(val);
			});
		},
		setHeight: function(data){
			this._super(data);
			if (this.clientCanvas)
				$(this.clientCanvas).css({height : data - 50 });
		},
		setWidth: function(data){
			this._super(data);
			if (this.clientCanvas)
				$(this.clientCanvas).css({width : data});
			if (this.columnHeader)
				$(this.columnHeader.canvas).css({width:data });
		},
		cell : function(row, col, value){
			var nodes = this.rowNodes[row];
			if (nodes != undefined){
				if (value == undefined){
					return nodes.data[this.fields[col]];
				}else {
					nodes.data[this.fields[col]] = value;
					if (nodes.headerContainer.controls[col + 1]){
						var ctrl = nodes.headerContainer.controls[col + 1].controls[0];
						if (ctrl instanceof pasta.gui.Edit)
							ctrl.setText(value);
						else if (ctrl instanceof pasta.gui.Label)
							ctrl.setCaption(value);
					};
				}
			}
			
		}
	});

	dashboard.TreeGridNode = pasta.gui.ContainerControl.extend({
		init : function(){
			this._super();
			var self = this;
			this.canvas.style.width = "100%";
			this.canvas.style.height = "auto";
			this.canvas.style.position = "relative";
			this.clientCanvas.style.width = "100%";
			this.clientCanvas.style.height = "auto";
			this.clientCanvas.style.overflow = "hidden";
			this.clientCanvas.style.position = "relative";

			this.headerContainer = new pasta.gui.ContainerControl();
			$(this.headerContainer.canvas).css({position:"relative", width:"100%", height: 30});
			$(this.canvas).prepend(this.headerContainer.canvas);

			this.collapseIcon = new pasta.gui.Control({bound:[5,5,20,20]});
			$(this.collapseIcon.canvas).html("<i class='fa fa-caret-right'></i>");
			$(this.collapseIcon.canvas).css({cursor: "pointer"});
			this.headerContainer.addControl(this.collapseIcon);
			this.collapseIcon.setVisible(false);
			self.hasChild = false;
			this.collapseIcon.on("click", function(){
				try{
					console.log("clicked " + self.hasChild);
					if (self.hasChild){
						if (self.isExpanded())
							self.collapse();
						else self.expand();
					}
				}catch(e){
					console.log(e);
				}
				
			});
			
			$(this.headerContainer.canvas).on("mouseover", function(){
				$(this).css({background:"#EEEEEE"});
			});
			$(this.headerContainer.canvas).on("mouseout", function(){
				if (self.grid.selectedRow == self)
					$(this).css({background:"#FFECB3"});
				else 
					$(this).css({background:"#ffffff"});
			});
			$(this.headerContainer.canvas).on("dblclick", function(e){
				e.stopPropagation();
				self.grid.emit("cellDoubleClick", self);	
			});
			$(this.headerContainer.canvas).on("click", function(e){
				e.stopPropagation();
				//console.log("selected row");
				self.grid.selectedRow = self;
				self.rowIndex = self.grid.rowNodes.indexOf(self);
				self.grid.row = self.rowIndex;
				self.grid.emit("rowClick", self);
			});
		},
		collapse: function(){
			$(this.clientCanvas).hide();
			$(this.collapseIcon.canvas).html("<i class='fa fa-caret-right'></i>");
		},
		expand : function(){
			$(this.clientCanvas).show();
			$(this.collapseIcon.canvas).html("<i class='fa fa-caret-down'></i>");
		},
		isExpanded: function(){
			return $(this.clientCanvas).is(":visible");
		},
		setWidth: function(data){
			this._super(data);
			$(this.headerContainer).css({width:data});
			$(this.clientCanvas).css({width:data});
		},
		setGrid : function(grid){
			this.grid = grid;
			var self = this;
			if (this.grid.isDraggable()){
				$(this.canvas).draggable({ stop: function(e,ui){
					self.setLeft(0);
					$(self.canvas).css({position:"relative"});
				}});
				$(this.canvas).dropable({
					accept: ".TreeGridNode",
					drop : function(e, ui){

					}
				});
			}
		},
		addColumnItem : function(data, index){
			try{
				var container = new pasta.gui.ContainerControl({bound:[0,0,200,30]});
				$(container.canvas).css({overflow:"hidden"});
				if (this.grid.flatColumns)
					var columns = this.grid.flatColumns;
				else 
					var columns = this.grid.columns;
				var self = this;
				//console.log(columns);
				if (columns && columns[index] && columns[index].readOnly != undefined && columns[index].readOnly == false){
					var ltitle = new pasta.gui.Edit({bound:[0,0,200,30]});
					ltitle.setText(data);
					ltitle.setTop(0);
					$(ltitle.canvas).css({border:"0",outline:"none", webkitAppearance:"none", background:"transparent"});//-webkit-appearance: none
					ltitle.setWidth(columns[index].width);
					ltitle.on("blur", function(sender){
						if (columns[index].format == 1){
							ltitle.setText(toRp(ltitle.getText()));
							self.data[self.fields[index]] = ltitle.getText().replace(/\./,"");
						}else 
							self.data[self.fields[index]] = ltitle.getText();
					});
					ltitle.on("focus", function(sender){
						if (columns[index].format == 1){
							ltitle.setText(ltitle.getText().replace(/\./,""));
						}
					});
					ltitle.on("change", function(sender){
						self.grid.emit("cellChange", self, index, self.rowIndex );
					});
				}else {
					var ltitle = new pasta.gui.Label({bound:[5,0,200,30]});
					if (columns && columns[index] && columns[index].format == 1){
						ltitle.setCaption(toRp(data) );
					}else 
						ltitle.setCaption(data);
					ltitle.setTop(5);
					ltitle.setWidth(columns[index].width - 10);
				}
				
				switch (columns[index].format){
					default : ltitle.setAlign("left");
						break;
					case 1 : ltitle.setAlign("right"); 
						break
					case 2 : ltitle.setAlign("center"); 
						break
				}
				container.addControl(ltitle);
				ltitle.on("click", function(){
					self.grid.col = index;
					self.setSelected(true);
					self.grid.emit("cellClick", self, index, self.rowIndex);
				});
				this.headerContainer.addControl(container);
				
				return container;
			}catch(e){
				console.log(e);
				console.log(index + "=> "+columns +" => "+ data);
			}
		},
		setSelected : function(data){
			var self = this;
			if (data == true){
				if (self.grid.selectedRow != undefined){
					$(self.grid.selectedRow.headerContainer.canvas).css({background:"#ffffff"});
				}
				self.grid.selectedRow = self;
				$(self.grid.selectedRow.headerContainer.canvas).css({background:"#FFECB3"});
			}else {
				$(self.grid.selectedRow.headerContainer.canvas).css({background:"#ffffff"});
			}
			
		},
		addControl : function(ctrl, fromSet){
			this._super(ctrl);
			this.hasChild = true;
			this.collapseIcon.setVisible(true);
			if (fromSet == undefined){
				this.data.childs.push(ctrl.data);
			}
		},
		delControl : function(ctrl){
			var index = this.controls.indexOf(ctrl);
			this._super(ctrl);
			console.log("DelControl " + this.controls.length);
			if (this.controls.length == 0){
				this.collapseIcon.setVisible(false);
				this.data.childs = [];	
			}else {
				this.data.childs.splice(index, 1);
			}
		},
		setData: function(data, fields, keyfield){
			try{
				if (data.childs == undefined)
					data.childs = [];
				this.data = data;

				this.fields = fields;
				this.keyfield = keyfield;
				var self = this;
				var left = 0;
				self.hasChild = false;
				if (this.grid.flatColumns)
					var columns = this.grid.flatColumns;
				else 
					var columns = this.grid.columns;
				if (this.data.childs == undefined)
					this.data.childs = [];
				
				$.each(fields, function(key, val){
					var node = self.addColumnItem(data[val], key);
					node.setLeft(left);
					node.setWidth(columns[key].width);
					
					if (key == 0){
						node.setLeft(15 + (data.level_spasi * 20) );
						node.setWidth(columns[key].width -  ( 15 + (data.level_spasi * 20)) );
					}
					left += columns[key].width;
					node.setHeight(30);
					if (key < fields.length - 1)
						$(node.canvas).css({borderRight:"1px solid #efefef"});
				});
				/*
				if (data.childs.length > 0){
					this.collapseIcon.setVisible(true);
				}
				*/
				$.each(data.childs, function(key, val){
					self.hasChild = true; 
					var node = new dashboard.TreeGridNode();
					node.level = self.level + 1;
					node.setGrid( self.grid );
					node.setData( val, fields, keyfield);
					node.setWidth(self.getWidth());
					self.addControl(node, true);
					
				});
				this.collapse();
			}catch(e){
				console.log(JSON.stringify(data) );
				console.log(e);
			}
		},
		editData: function(data){
			var index = 1;
			var self = this;
			$.each(data, function(key, val){
				
				self.data[key] = val;
				var ctrl = self.headerContainer.controls[index];
				{
					ctrl = ctrl.controls[0];
					if (ctrl instanceof pasta.gui.Edit)
						ctrl.setText(val)
					else if (ctrl instanceof pasta.gui.Label)
						ctrl.setCaption(val);
				} 
				index++; 
			});
		},
		getLevel : function(){
			return this.level;
		},
		moveLeft: function(){
			var node = this;
			var self = this;
			var tmp = new dashboard.TreeGridNode();
			tmp.level = node.level - 1;
			tmp.setGrid( self.grid );
			tmp.setWidth(node.getWidth()); 
			if (node.parent instanceof dashboard.TreeGridNode){
				//$(node.canvas).parent().parent().append($(node.canvas));
				if (node.parent.parent instanceof dashboard.TreeGrid)
					node.data.level_spasi = 0;
				else node.data.level_spasi = node.parent.parent.data.level_spasi + 1;
				tmp.setData( node.data, self.grid.fields, self.grid.keyfield);
				node.parent.parent.addControl(tmp);
				self.grid.selectedRow = tmp;
				node.free();
				tmp.setSelected(true);
				self.grid.reIndexingNode();
			}else {

			}

		},
		moveUp: function(){
			var node = this;
			var self = this;
			var index = node.parent.controls.indexOf(this);
			if (index > 0){
				var parent = node.parent;
				var ctrlBfr =  parent.controls[ index - 1 ];
				var tmp = new dashboard.TreeGridNode();
				//tmp.level = self.level + 1;
				tmp.setGrid( self.grid );
				tmp.setData( node.data, self.grid.fields, self.grid.keyfield);
				tmp.setWidth(self.getWidth());
				tmp.parent = parent;
				//node.parent.controls.push(tmp);
				parent.controls[index - 1] = tmp;
				parent.controls[index] = ctrlBfr;
				$(ctrlBfr.canvas).before($(tmp.canvas)); 
				parent.clientCanvas.removeChild(node.canvas);
				tmp.setSelected(true);
				node = null;
				self.grid.reIndexingNode();
			}
		},
		moveDown: function(){
				var node = this;
				var self = this;
					var parent = node.parent; 
                    var index = parent.controls.indexOf(node);
                    if (index < parent.controls.length - 1){
                        var ctrlNext =  parent.controls[ index + 1 ];
                        var tmp = new dashboard.TreeGridNode();
                        //tmp.level = self.level + 1;
                        tmp.setGrid( self.grid );
                        tmp.setData( node.data, self.grid.fields, self.grid.keyfield);
                        tmp.setWidth(self.getWidth());
                        tmp.parent = parent;
                        parent.controls[index + 1] = tmp;
                        parent.controls[index ] = ctrlNext;

                        $(ctrlNext.canvas).after($(tmp.canvas)); 
                        parent.clientCanvas.removeChild(node.canvas);
                        tmp.setSelected(true);
                        node = null;
                        self.grid.reIndexingNode();
                    }
		},
		moveRight: function(){
			var node = this;
			var self = this;
					var index = node.parent.controls.indexOf(node);
                    if (index > 0){
                        var tmp = new dashboard.TreeGridNode();
                        var nodeTmp = node.parent.controls[index - 1];
                        
                        
                        tmp.setGrid( self.grid );
                        tmp.setWidth(self.getWidth());
                        tmp.parent = node.parent;
                        tmp.level = nodeTmp.level + 1;
                        node.data.level_spasi = nodeTmp.level + 1;
                        tmp.setData( node.data, self.grid.fields, self.grid.keyfield);
                        
                        nodeTmp.addControl(tmp);
                        node.free();
                        tmp.setSelected(true);
                        self.grid.reIndexingNode();
                    }
		}
	});

	dashboard.Grid = pasta.gui.ContainerControl.extend({
		init: function(options){
			try{
				this._super(options);
				this.canvas.style.overflow = "hidden";
				this.clientCanvas.style.overflow = "auto";
				this.clientCanvas.style.position = "relative";
				//console.log("Height " + this.getHeight());
				$(this.clientCanvas).css({height : this.getHeight() - 50 });	
				this.columnHeader = new pasta.gui.ContainerControl({bound:[0,0,this.getWidth(), 50]});
				$(this.columnHeader.canvas).css({borderBottom:"1px solid #dfdfdf", overflow:"hidden",position:"relative", background:"#b71c1c"});
				$(this.canvas).prepend(this.columnHeader.canvas);

				if (options){
					if (options.column) this.setColumn(options.column);
				}
			}catch(e){
				console.log(e);
			}
			
		},
		setHeaderHeight: function(data){
			this.columnHeader.setHeight(data);
			$(this.clientCanvas).css({height : this.getHeight() - data });	
			$.each(this.columnHeader.controls, function(key, val){
				val.setHeight(data);
			});
		},
		setColumn: function(data){
			var left  = 0;
			var self = this;
			this.columns = data;
			$.each(data, function(key, val){
				var column = new dashboard.GridColumn({bound:[left, 0, val.width, 50]});
				column.setCaption(val.title, val);
				self.columnHeader.addControl(column);
				if (key < data.length - 1)
					$(column.canvas).css({borderRight:"1px solid #ffffff"});
				left += val.width;
			});
		},
		setData : function(data, fields, keyfield){
			this.data = data;
			this.clear();
			var self = this;
			this.fields = fields;
			this.keyfield = keyfield;
			this.rowCount = 0;
			$.each(data, function(key, val){
				var node = new dashboard.RowGrid();
				node.setGrid( self );
				node.setRowIndex(self.rowCount);
				self.rowCount++;
				node.setData(val, fields, keyfield);
				node.setWidth(self.getWidth());
				self.addControl(node);
			});
		},
		clear: function(){
			this._super();
			this.data = {};
		},
		getData: function(){
			var result = [];
			$.each(this.controls, function(key, val){
				result.push(val.data);
			});
			return result;
		},
		setHeight: function(data){
			this._super(data);
			if (this.clientCanvas)
				$(this.clientCanvas).css({height : data - 50 });
		},
		appendRow: function(){
			var node = new dashboard.RowGrid();
			node.setGrid( this );
			node.setRowIndex(this.rowCount);
			this.rowCount++;
			var data = {};
			$.each(this.fields, function(key, val){
				data[val] = "";
			});
			node.setData(data, this.fields, this.keyfield);
			node.setWidth(this.getWidth());
			this.addControl(node);
			return node;
		},
		deleteRow: function(row){
			var control = this.controls[row];
			control.free();
			//this.clientCanvas.removeChild(control.canvas);
		}
	});

	dashboard.RowGrid = pasta.gui.ContainerControl.extend({
		init : function(){
			this._super();
			var self = this;
			this.canvas.style.width = "100%";
			this.canvas.style.height = "auto";
			this.canvas.style.position = "relative";
			this.clientCanvas.style.width = "100%";
			this.clientCanvas.style.height = "auto";
			this.clientCanvas.style.overflow = "hidden";
			this.clientCanvas.style.position = "relative";

			this.headerContainer = new pasta.gui.ContainerControl();
			$(this.headerContainer.canvas).css({position:"relative", width:"100%", height: 30});
			$(this.canvas).prepend(this.headerContainer.canvas);


			this.collapseIcon = new pasta.gui.Control({bound:[5,5,20,20]});
			$(this.collapseIcon.canvas).css({cursor: "pointer"});
			this.headerContainer.addControl(this.collapseIcon);
			
			
			$(this.headerContainer.canvas).on("mouseover", function(){
				$(this).css({background:"#EEEEEE"});
			});
			$(this.headerContainer.canvas).on("mouseout", function(){
				$(this).css({background:"#ffffff"});
			});
			this.headerContainer.on("click", function(){
				self.grid.row = self.rowIndex;
			});
		},
		setRowIndex: function(index){
			this.rowIndex = index;
		},
		setGrid : function(grid){
			this.grid = grid;
		},
		addColumnItem : function(data, index){
			try{
				var container = new pasta.gui.ContainerControl({bound:[0,0,200,30]});
				var columns = this.grid.columns;
				var self = this;
				//console.log("Append Row " + data + columns[index].readOnly );
				if (columns[index].readOnly != undefined && columns[index].readOnly == false){
					var ltitle = new pasta.gui.Edit({bound:[0,0,200,30]});
					ltitle.setText(data);
					ltitle.setTop(0);
					$(ltitle.canvas).css({border:"0",outline:"none", webkitAppearance:"none", background:"transparent"});//-webkit-appearance: none
					ltitle.setWidth(columns[index].width);
					ltitle.on("blur", function(sender){
						if (columns[index].format == 1){
							ltitle.setText(toRp(ltitle.getText()));
							self.data[self.fields[index]] = ltitle.getText().replace(/\./,"");
						}else 
							self.data[self.fields[index]] = ltitle.getText();
					});
					ltitle.on("focus", function(sender){
						if (columns[index].format == 1){
							ltitle.setText(ltitle.getText().replace(/\./,""));
						}
						self.grid.col = index;
					});
					ltitle.on("change", function(sender){
						self.grid.emit("cellChange", self, index, self.rowIndex );
					});
				}else {
					var ltitle = new pasta.gui.Label({bound:[5,0,200,30]});
					ltitle.setCaption(data);
					ltitle.setTop(5);
					ltitle.setWidth(columns[index].width - 10);
					ltitle.on("click", function(){
						self.grid.col = index;
					});
				}
				
				switch (columns[index].format){
					default : ltitle.setAlign("left");
						break;
					case 1 : ltitle.setAlign("right"); 
						break
					case 2 : ltitle.setAlign("center"); 
						break
				}
				container.addControl(ltitle);
				this.headerContainer.addControl(container);
				
				return container;
			}catch(e){
				console.log(index +":"+ columns);
				console.log(e);
			}
		},
		setData: function(data, fields, keyfield){
			try{
				this.data = data;
				this.fields = fields;
				this.keyfield = keyfield;
				var self = this;
				var left = 0;
				var columns = this.grid.columns;
				$.each(fields, function(key, val){
					
					var node = self.addColumnItem(data[val], key);
					node.setLeft(left);
					node.setWidth(columns[key].width);
					if (key == 0){
						node.setLeft(15 + (data.level_spasi * 20) );
						node.setWidth(columns[key].width -  ( 15 + (data.level_spasi * 20)) );
					}
					left += columns[key].width;
					node.setHeight(30);
					if (key < fields.length - 1)
						$(node.canvas).css({borderRight:"1px solid #efefef"});
				});
				
			}catch(e){
				console.log(e);
			}
		}
	});

	dashboard.SearchPanel = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			$(this.canvas).css({boxShadow:"0px 10px 20px #888888", background:"#ffffff", zIndex:9999});
			$(this.clientCanvas).css({position:"relative",overflow:"auto"});
		},
		setService : function(service, fields, params, field){
			this.service = service;
			this.fields = fields;
			this.params = params;
			this.field = field;
		},
		addItem: function(data){
			var container = new pasta.gui.ContainerControl({bound:[0,0,this.getWidth(), 30]});
			$(container.canvas).css({position:"relative"});
			var lKode = new pasta.gui.Label({bound:[10,5,100,25], caption: data[this.fields[0]]});
			var lNama = new pasta.gui.Label({bound:[20,5,200,25], caption: data[this.fields[1]]});
			lNama.setLeft(110);
			lNama.setWidth(this.getWidth() - 120);
			container.addControl(lKode);
			container.addControl(lNama);
			this.addControl(container);
			container.on("mouseOver", function(){
				container.background.setColor("#efefef");
			});
			var self = this;
			container.on("mouseOut", function(){
				container.background.setColor("#ffffff");
			});
			container.on("click", function(sender){
				self.control.setText( data[self.field] );
				self.emit("searchResult", self.control, data[self.field], data);
				self.hide();
			});
		},
		setRequester: function(control){
			this.control = control;
		},
		search : function (search){
			var self = this;
			if (this.params == undefined)
				this.params = [];
			var params = []; 
			$.merge(params, this.params);
			$.merge(params, [search]);
			app.services.request(this.service, params, function(data){
				try{
					self.clear();
					$.each(data, function(key, val){
						self.addItem(val);
					});
				}catch(e){
					console.log(e);
				}
			});
		}

	});
	dashboard.FormContainer = pasta.gui.ContainerControl.extend({
		init: function(){
			this._super();
			var self = this;
			var menuWidth = 230;
			if (app.mainForm){
				menuWidth = app.mainForm.sideMenu.getWidth();
			}
			this.setLeft(menuWidth);
			this.setTop(56);
			this.setWidth($(window).width() - menuWidth);
			this.setHeight($(window).height() - 56);
			this.background.setColor("#E7ECF3"); 
			$(this.getClientCanvas()).css({overflow:"auto"});


			this.rowHeader = new pasta.gui.ContainerControl({bound:[0,0,"100%",80]});
			$(this.rowHeader.getCanvas()).css({position:"relative"});
			
			this.title = new pasta.gui.Label({bound:[20,20,400,40], caption:"", fontSize : 18});
			this.rowHeader.addControl(this.title);

			this.line = new pasta.gui.Control({bound:[0,60,this.getWidth(), 1]});
			this.line.canvas.style.width = "100%";
			this.line.canvas.style.background = "#42A5F5";
			this.rowHeader.addControl(this.line);

			this.bSave = new dashboard.Button({bound:[this.getWidth() - 130, 20, 100, 30] 
										, icon:"fa fa-save", iconBg:"#2196F3", iconColor:"white", iconSize:"18px"
										, caption:"Save", fontSize : "14px"
									});
			this.rowHeader.addControl(this.bSave);

			this.bDelete = new dashboard.Button({bound:[this.getWidth() - 240, 20, 100, 30] 
										, icon:"fa fa-trash", iconBg:"#c62828", iconColor:"white", iconSize:"18px"
										, caption:"Delete", fontSize : "14px", fontColor:"#c62828"
									});
			this.rowHeader.addControl(this.bDelete);

			this.bSave.on("click", function(){
				self.emit("saveClick");
			});
			this.bDelete.on("click", function(){
				self.emit("deleteClick");
			});

			this.line = new pasta.gui.Control({bound:[0,60,this.getWidth(), 1]});
			this.line.canvas.style.width = "100%";
			this.line.canvas.style.background = "#dfdfdf";
			this.rowHeader.addControl(this.line);

			//this.container = new pasta.gui.ContainerControl({bound:[0,61,this.getWidth(), this.getHeight() - 61]});
			//$(this.container.getClientCanvas()).css({overflow:"auto"});
			//this.addControl(this.container);
			this.on("click", function (){
				//if (app.searchPanel)
				//	app.searchPanel.hide();
			});
			if (app.searchPanel == null){
				app.searchPanel = new dashboard.SearchPanel({bound:[20,20,400,100]});
				app.searchPanel.hide();
				stage.addControl(app.searchPanel);
			}
			this.addControl(this.rowHeader);
			stage.on("resize", function(w,h){
				var menuWidth = app.mainForm.sideMenu.getWidth();
				self.setWidth($(window).width() - menuWidth);
				self.setHeight($(window).height() - 56);
				self.bSave.setLeft(self.getWidth() - 130);
				self.bDelete.setLeft(self.getWidth() - menuWidth - 10);
				self.line.setWidth(self.getWidth());
				//self.container.setWidth(self.getWidth());
				//self.container.setHeight(self.getHeight() - 61);
				
			});
		},
		setTitle: function(data){
			this.title.setCaption(data);
		},
		showSearchPanel: function(pos){
			
			{
               	// var pos = $(self.eKode.canvas).offset();
                app.searchPanel.setLeft(pos.left );
                app.searchPanel.setTop(pos.top + 25);
                app.searchPanel.show();
            }
		},
		
		hideSearchPanel : function(){
			app.searchPanel.hide();
		},
		hideButton: function(){
			this.bSave.hide();
			this.bDelete.hide();
		},
		showPasteEditor: function(ctrl){
			var self = this;
			if (app.pasteEditor == undefined)
			{
               	// var pos = $(self.eKode.canvas).offset();
				app.pasteEditor = new dashboard.PasteEditor();
                stage.addControl(app.pasteEditor);
			}
			app.pasteEditor.removeAllListeners("pasteResult");
			app.pasteEditor.on("pasteResult", function(requester, result){
				self.emit("pasteResult", requester, result);
			});
			app.pasteEditor.show(ctrl);
		}
	}); 
	dashboard.PopupForm = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			this.bgColor = "#ffffff";
			this.arrowContainer = new pasta.gui.ContainerControl();
			$(this.arrowContainer.canvas).css({overflow:"hidden"});
			$(this.canvas).append(this.arrowContainer.canvas);
			//$(this.canvas).css({overflow:"hidden"});
			$(this.clientCanvas).css({overflow:"hidden", background: this.bgColor, borderRadius:"3px", boxShadow:"0px 5px 10px #888888"});
			if (options){
				if (options.arrowMode) this.setArrowMode(options.arrowMode);
				if (options.arrowPosition) this.setArrowPosition(options.arrowPosition[0],options.arrowPosition[1] );
			}
		},
		setArrowMode: function(mode){
			switch(mode){
				case 1 : //left
					this.arrowContainer.show();
					$(this.arrowContainer.canvas).css({width:25, height:"100%", top:0});
					$(this.clientCanvas).css({left:15, top:0, height:"100%"});
					$(this.arrowContainer.clientCanvas).css({width:20, height:20,background: this.bgColor, boxShadow:"0px 5px 10px #888888", top : this.getHeight() / 2 - 10, left: 15, transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
					break;
				case 2 : // top
					this.arrowContainer.show();
					$(this.arrowContainer.canvas).css({width:"100%", height: 15, top:0});
					$(this.clientCanvas).css({left:0, top:15, height: this.getHeight() - 15, width: this.getWidth()});
					$(this.arrowContainer.clientCanvas).css({width:20, height:20,background: this.bgColor, boxShadow:"0px 5px 10px #888888", top : 5, left: this.getWidth() / 2 - 15 , transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
					break;
				case 3 : //right
					this.arrowContainer.show();
					$(this.arrowContainer.canvas).css({width:25, left: this.width - 25});
					$(this.clientCanvas).css({left:0, top:0, height:"100%", width: this.getWidth() - 15});
					$(this.arrowContainer.clientCanvas).css({width:20, height:20,background: this.bgColor, boxShadow:"0px 5px 10px #888888", top : this.getHeight() / 2 - 10, left: 15, transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
					break;
				case 4 : //bottom
					this.arrowContainer.show();
					$(this.arrowContainer.canvas).css({width:"100%", height: 25,top: this.height - 20});
					$(this.clientCanvas).css({left:0, top:0, height: this.getHeigh() - 15});
					$(this.arrowContainer.clientCanvas).css({width:20, height:20,background: this.bgColor, boxShadow:"0px 5px 10px #888888", top : - 10, left: this.width / 2 - 15, transform: "rotate(45deg)", "-webkit-transform" : "rotate(45deg)"});
					break;
				default : //node
					this.arrowContainer.hide();
					$(this.clientCanvas).css({left:0,top:0, width:"100%",height:"100%"});
					break;
			}
		},
		setArrowPosition: function(top, left){
			$(this.arrowContainer.clientCanvas).css({top:top, left:left});
		},
		show: function(top, left){
			this._super();
			this.setLeft(left);
			this.setTop(top);
		}
	});
	dashboard.FAIcon = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			//$(this.canvas).css({background:"#00C853"});
			this.clientCanvas.className = "fa fa-gear";//'glyphicon glyphicon-chevron-down';
			this.clientCanvas.style.cursor = "pointer";
			this.clientCanvas.style.top = "5px";
			this.clientCanvas.style.left = "8px";
			if (options){
				if (options.color) this.setColor(options.color);
				if (options.icon) this.setIcon(options.icon);
				if (options.iconSize) this.setIconSize(options.iconSize);

			}
		},
		setColor: function(color){
			$(this.clientCanvas).css({color:color});
		},
		setIcon: function(icon){
			this.clientCanvas.className = "fa fa-"+icon;
		},
		setIconSize: function(size){
			$(this.clientCanvas).css({fontSize:size});
		},
		setHeight: function(data){
			this._super(data);
			$(this.clientCanvas).css({top : data / 2 - 10});
		},
		setWidth : function(data){
			this._super(data);
			$(this.clientCanvas).css({left : data / 2 - 16});
		}
	});
	dashboard.PasteEditor = pasta.gui.ContainerControl.extend({
		init : function(options){
			this._super();
			var self = this;
			this.setWidth(400);
			this.setHeight(300);
			this.setLeft( $(window).width() / 2 - 200);
			this.setTop($(window).height() / 2 - 150);
			$(this.canvas).css({zIndex:9999, border:"1px solid #dfdfdf", boxShadow:"0px 5px 10px #888888", borderRadius:"5px"});
			this.background.setColor("#ffffff");
			this.editor = new pasta.gui.Memo({bound:[0,0,this.getWidth(), this.getHeight() - 40]});
			this.editor.setPlaceHolder("Paste disini");
			this.bOk = new dashboard.Button({bound:[20,this.getHeight() - 30,100,20]
                                                , icon:"fa fa-check", iconBg:"#0D47A1", iconColor:"white", iconSize:"14px"
										        , caption:"Ok", fontSize : "12px", fontColor:"#0D47A1" });
			this.addControl(this.editor);
			this.bOk.on("click", function(){
				self.emit("pasteResult", self.requester,  self.editor.getText());
				self.hide();
			});
			this.bCancel = new dashboard.Button({bound:[130,this.getHeight() - 30,100,20]
                                               , icon:"fa fa-close", iconBg:"#b71c1c", iconColor:"white", iconSize:"14px"
										        , caption:"Cancel", fontSize : "13px", fontColor:"#b71c1c"  });
				this.bCancel.on("click", function(){
					self.hide();
				});
			this.addControl(this.bCancel);
			this.addControl(this.bOk);
		},
		setRequester : function(ctrl){
			this.requester = ctrl;
		},
		show: function(ctrl){
			this._super();
			this.requesterr = ctrl;
			this.setLeft( $(window) / 2 - 200);
			this.setTop($(window) / 2 - 150);
		}
	});
	dashboard.ListBox = pasta.gui.Control.extend({
		init: function(options){
			this._super(options);
			$(this.canvas).css({overflow : "auto"});
			this.listGroup = document.createElement("ul");
			$(this.listGroup).css({width:"100%",height:"100%"});
			$(this.listGroup).addClass("list-group checked-list-box");
			this.canvas.appendChild(this.listGroup);
		},
		addItem: function(caption, id){
			try{
				var item = document.createElement("li");
				item.className = "list-group-item active";//list-group-item-default active
				this.listGroup.appendChild(item);
				$(item).data("id",id);
				$(item).html(caption);
				var $checkbox = $('<input type="checkbox" checked class="hidden" />');
				$(item).append($checkbox);
				var settings = {
					on: {
						icon: 'fa fa-check-square-o'
					},
					off: {
						icon: 'fa fa-square-o'
					}
				};
				$(item).css('cursor', 'pointer');
				var $widget  = $(item);
				$widget.prepend('<span class="state-icon ' + settings["on"].icon + '">&nbsp;</span>');
				
				$widget.on('click', function () {
					$checkbox.prop('checked', !$checkbox.is(':checked'));
					$checkbox.triggerHandler('change');
					//updateDisplay();
				});
				$checkbox.on('change', function () {
					updateDisplay();
				});
				var style = "list-group-item-";
				var color = "default";
				function updateDisplay(){
					try{
						var isChecked = $checkbox.is(':checked');

						// Set the button's state
						
						$widget.data('state', (isChecked) ? "on" : "off" );

						// Set the button's icon
						$widget.find('.state-icon')
							.removeClass()
							.addClass('state-icon ' + settings[$widget.data('state')].icon);

						// Update the button's color
						if (isChecked) {
							$widget.addClass("active");//style + color + ' '
						} else {
							$widget.removeClass("active");
						}
					}catch(e){
						console.log(e);
					}
				};
			}catch(e){
				console.log(e);
			}

		},
		getCheckedData: function(){
			var checkedItems = {}, counter = 0;
			$(this.listGroup).find("li.active").each(function(idx, li) {
				checkedItems[counter] = $(li).data("id");//$(li).text();
				counter++;
			});
			return checkedItems;
		},
		selectAll: function(){
			$(this.listGroup).find("li input:checkbox").each(function(idx, checkbox) {
				$(checkbox).prop('checked', true);
				$(checkbox).triggerHandler('change');
			});
		},
		unselectAll: function(){
			$(this.listGroup).find("li input:checkbox").each(function(idx, checkbox) {
				$(checkbox).prop('checked', false);
				$(checkbox).triggerHandler('change');
			});
		},
		toggle: function(){
			$(this.listGroup).find("li input:checkbox").each(function(idx, checkbox) {
				$(checkbox).prop('checked', !$(checkbox).is(':checked'));
				$(checkbox).triggerHandler('change');
			});
		},
		setMode: function(){}
	});
	dashboard.BSButton = pasta.gui.Control.extend({
		init : function(options){
			this._super(options);
			this.$button = $('<button type="button" class="btn btn-default" ></button>');
			$(this.canvas).append(this.$button);
			if (options){
				if (options.caption) this.setCaption(options.caption);
			}
		},
		setCaption: function(caption){
			this.$button.html(caption);
		}
	});
	dashboard.BSCheckbox = pasta.gui.Control.extend({
		init : function(options){
			this._super(options);
			var self = this;
			$ctrl = $("<span class='button-checkbox'></span>");
			$(this.canvas).append($ctrl);
			this.$button = $('<button type="button" class="btn" data-color="primary"></button>');
			$($ctrl).append(this.$button);
			this.$title = $("<span></span>");
			this.$button.append(this.$title);
			$checkbox = $('<input type="checkbox" class="hidden" />');
			$($ctrl).append($checkbox);
			var $widget = $ctrl,
				$button = this.$button,
				//$checkbox = ;//$widget.find('input:checkbox'),
				color = $button.data('color'),
				settings = {
					on: {
						icon: 'fa fa-check-square-o'
					},
					off: {
						icon: 'fa fa-square-o'
					}
				};
			this.$button.prepend('<i class="state-icon ' + settings["off"].icon + '">&nbsp;</i>');	
			// Event Handlers
			$button.on('click', function () {
				try{
					$checkbox.prop('checked', !$checkbox.is(':checked'));
					$checkbox.triggerHandler('change');
					updateDisplay();
					self.emit("change",$checkbox.is(':checked')) ;
				}catch(e){
					console.log(e);
				}
				
			});
			$checkbox.on('change', function () {
				updateDisplay();
				self.emit("change",$checkbox.is(':checked')) ;
			});
			this.$checkbox = $checkbox;
			// Actions
			function updateDisplay() {
				var isChecked = $checkbox.is(':checked');

				// Set the button's state
				$state = isChecked ? "on" :"off";

				// Set the button's icon
				$button.find('.state-icon')
					.removeClass()
					.addClass('state-icon ' + settings[$state].icon);

				// Update the button's color
				if (isChecked) {
					$button
						.removeClass('btn-default')
						.addClass('btn-' + color + ' active');
				}
				else {
					$button
						.removeClass('btn-' + color + ' active')
						.addClass('btn-default');
				}
			}
			if (options){
				if (options.caption) this.setCaption(options.caption);
				if (options.checked) this.setCheck(options.checked);
			}
		},
		setCaption: function(caption){
			this.$title.html(caption);
		},
		setCheck: function(data){
			this.$checkbox.prop('checked', !this.$checkbox.is(':checked'));
			this.$checkbox.triggerHandler('change');
		}
	});
	//----------------------------------------------------------------------------------------------------------------------------------

	dashboard.Alert = pasta.gui.Panel.extend(
	{
		init : function() 
		{
			this._super();
			var self = this;
			
			this.background.setColor("rgba(0, 0, 0, 0.4)");
			this.canvas.style.zIndex = "10002";
			
			this.pnl = new pasta.gui.ContainerControl();
			this.pnl.setWidth(400);
			this.pnl.setHeight(200);
			this.pnl.setLeft((this.getWidth() - this.pnl.getWidth()) / 2);
			this.pnl.setTop((this.getHeight() - this.pnl.getHeight()) / 3);
			this.pnl.background.setColor("rgba(255, 255, 255, 0.98)");
			this.pnl.border.setColor("rgba(255, 255, 255, 1)");
			this.pnl.border.setRadius(2);
			this.pnl.shadow.setLeft(0);
			this.pnl.shadow.setTop(1);
			this.pnl.shadow.setBlur(8);
			this.pnl.shadow.setColor("#000000");
			this.addControl(this.pnl);
			
				this.lblTitle = new pasta.gui.Label();
				this.lblTitle.setLeft(15);
				this.lblTitle.setWidth(this.pnl.getWidth());
				this.lblTitle.setTop(15);
				this.lblTitle.setHeight(32);
				this.lblTitle.font.setSize(16);
				this.lblTitle.font.setColor("#5dc3e9");
				this.lblTitle.setCaption("");
				this.pnl.addControl(this.lblTitle);
				
				this.shpTop = new pasta.gui.Shape();
				this.shpTop.setLeft(-1);
				this.shpTop.setTop(45);
				this.shpTop.setWidth(this.pnl.getWidth() + 2);
				this.shpTop.setHeight(1);
				this.shpTop.setMode(2);
				this.shpTop.border.setColor(this.lblTitle.font.getColor());
				this.shpTop.border.setWeight(2);
				this.pnl.addControl(this.shpTop);
				
				this.lblMessage = new pasta.gui.Label();
				this.lblMessage.setLeft(15);
				this.lblMessage.setWidth(this.pnl.getWidth() - (2 * this.lblMessage.getLeft()));
				this.lblMessage.setTop(this.shpTop.getTop() + 15);
				this.lblMessage.setHeight(this.pnl.getHeight() - this.lblMessage.getTop() - 50);
				this.lblMessage.font.setSize(14);
				this.lblMessage.font.setColor("#000000");
				this.lblMessage.canvas.style.overflow = "";
				this.lblMessage.canvas.style.whiteSpace = "";
				this.lblMessage.setCaption("");
				this.pnl.addControl(this.lblMessage);
				
				this.shpBottom = new pasta.gui.Shape();
				this.shpBottom.setLeft(-1);
				this.shpBottom.setTop(this.pnl.getHeight() - 45);
				this.shpBottom.setWidth(this.pnl.getWidth() + 1);
				this.shpBottom.setHeight(1);
				this.shpBottom.setMode(2);
				this.shpBottom.border.setColor("#CCCCCC");
				this.pnl.addControl(this.shpBottom);
				
				var eventName = "click";
				
				this.btn = new dashboard.FlatButton();
				this.btn.setLeft(5);
				this.btn.setTop(this.pnl.getHeight() - 25);
				this.btn.setWidth(this.pnl.getWidth() - 10);
				this.btn.setHeight(35);
				this.btn.setCaption("OK");
				this.btn.setCaptionColor("#ffffff");
				this.btn.setBorderColor("#CCCCCC");
				this.btn.lblTitle.setLeft(0);
				this.btn.lblTitle.setWidth(this.btn.getWidth());
				this.btn.lblTitle.setAlign("center");
				this.btn.lblTitle.font.setSize(12);
				this.btn.lblTitle.font.setBold(12);
				this.btn.lblTitle.font.setFontName('"Trebuchet MS", Arial, Helvetica, sans-serif');
				this.btn.lblTitle.setTop(8);
				this.btn.on(eventName,
					function()
					{
						self.close();
						
						if (self.handler instanceof Array)
							self.handler[1].apply(self.handler[0], [true]);
						else if (typeof(self.handler) == "function")
							self.handler.apply(null, [true]);
					});
				this.pnl.addControl(this.btn);
			
			stage.on("resize", [this, this.initSize]);
			
			this.on(eventName,
				function(sender, myCanvas)
				{
					if (myCanvas)
						self.close();
				});
		},
		
		//--------------------- Event ---------------------
		
		show : function(caption, message, height, handler)
		{
			this.initSize();
			
			this.handler = handler;
			
			if ((typeof(height) == "function") || (typeof(height) == "object"))
			{
				this.handler = height;
				this.targetHeight = 200;
			}
			else 
				this.targetHeight = height;
			
			if (typeof(this.targetHeight) != "number")
				this.targetHeight = 200;
			
			this.lblTitle.setCaption(caption);
			this.lblMessage.setCaption(message);
			
			this.initSize();
			
			this._super();
		},
		
		initSize : function()
		{
			this.setWidth(stage.getWidth());
			this.setHeight(stage.getHeight());
			
			var desiredWidth = 400;
			var desiredHeight = this.targetHeight;
			
			if (desiredWidth > (stage.getWidth() - 20))
				desiredWidth = stage.getWidth() - 20;
			
			if (desiredHeight > (stage.getHeight() - 20))
				desiredHeight = stage.getHeight() - 20;
			
			this.pnl.setWidth(desiredWidth);
			this.pnl.setHeight(desiredHeight);
			
			this.shpTop.setWidth(this.pnl.getWidth() + 1);
			
			this.lblMessage.setWidth(this.pnl.getWidth() - (2 * this.lblMessage.getLeft()));
			this.lblMessage.setHeight(this.pnl.getHeight() - this.lblMessage.getTop() - 50);
			
			this.shpBottom.setTop(this.pnl.getHeight() - 45);
			this.shpBottom.setWidth(this.pnl.getWidth() + 1);
			
			this.btn.setTop(this.pnl.getHeight() - 40);
			this.btn.setWidth(this.pnl.getWidth() - 10);
			
			this.pnl.setLeft((this.getWidth() - this.pnl.getWidth()) / 2);
			this.pnl.setTop((this.getHeight() - this.pnl.getHeight()) / 3);
		},
	});

	dashboard.BasicDialog = pasta.gui.Panel.extend(
	{
		init : function() 
		{
			this._super();
			var self = this;
			
			var eventName = "click";
			
			this.desiredWidth = 500;
			this.desiredHeight = 400;
			
			this.background.setColor("rgba(0, 0, 0, 0.4)");
			this.canvas.style.zIndex = "10000";
			
			this.pnl = new pasta.gui.ContainerControl();
			this.pnl.setWidth(400);
			this.pnl.setHeight(200);
			this.pnl.setLeft((this.getWidth() - this.pnl.getWidth()) / 2);
			this.pnl.setTop((this.getHeight() - this.pnl.getHeight()) / 3);
			this.pnl.background.setColor("rgba(255, 255, 255, 0.98)");
			this.pnl.border.setColor("rgba(255, 255, 255, 1)");
			this.pnl.border.setRadius(2);
			this.pnl.shadow.setLeft(0);
			this.pnl.shadow.setTop(1);
			this.pnl.shadow.setBlur(8);
			this.pnl.shadow.setColor("#000000");
			this.addControl(this.pnl);
			
				this.lblTitle = new pasta.gui.Label();
				this.lblTitle.setLeft(15);
				this.lblTitle.setWidth(this.pnl.getWidth());
				this.lblTitle.setTop(13);
				this.lblTitle.setHeight(32);
				this.lblTitle.font.setSize(16);
				this.lblTitle.font.setColor("#5dc3e9");
				this.lblTitle.setCaption("");
				this.pnl.addControl(this.lblTitle);
				
				this.shpTop = new pasta.gui.Shape();
				this.shpTop.setLeft(-1);
				this.shpTop.setTop(50);
				this.shpTop.setWidth(this.pnl.getWidth() + 2);
				this.shpTop.setHeight(1);
				this.shpTop.setMode(2);
				this.shpTop.border.setColor(this.lblTitle.font.getColor());
				this.shpTop.border.setWeight(2);
				this.pnl.addControl(this.shpTop);
				
				this.shpBottom = new pasta.gui.Shape();
				this.shpBottom.setLeft(-1);
				this.shpBottom.setTop(this.pnl.getHeight() - 45);
				this.shpBottom.setWidth(this.pnl.getWidth() + 2);
				this.shpBottom.setHeight(1);
				this.shpBottom.setMode(2);
				this.shpBottom.border.setColor("#CCCCCC");
				this.pnl.addControl(this.shpBottom);
				
				this.shpVer = new pasta.gui.Shape();
				this.shpVer.setLeft(this.pnl.getWidth() / 2);
				this.shpVer.setTop(this.shpBottom.getTop());
				this.shpVer.setWidth(1);
				this.shpVer.setHeight(this.pnl.getHeight() - this.shpVer.getTop());
				this.shpVer.setMode(3);
				this.shpVer.border.setColor("#CCCCCC");
				this.pnl.addControl(this.shpVer);
				
				this.btnCancel = new dashboard.FlatButton();
				this.btnCancel.setLeft(5);
				this.btnCancel.setTop(this.pnl.getHeight() - 40);
				this.btnCancel.setWidth(this.pnl.getWidth() / 2 - 10);
				this.btnCancel.setHeight(35);
				this.btnCancel.setCaption("Batal");
				this.btnCancel.setCaptionColor("#000000");
				this.btnCancel.setBorderColor("#CCCCCC");
				this.btnCancel.lblTitle.setLeft(0);
				this.btnCancel.lblTitle.setWidth(this.btnCancel.getWidth());
				this.btnCancel.lblTitle.setAlign("center");
				this.btnCancel.lblTitle.font.setSize(12);
				this.btnCancel.lblTitle.font.setBold(12);
				this.btnCancel.lblTitle.font.setFontName('"Trebuchet MS", Arial, Helvetica, sans-serif');
				this.btnCancel.lblTitle.setTop(8);
				this.btnCancel.canvas.style.zIndex = "9001";
				this.btnCancel.on(eventName, [this, this.btnCancelClick]);
				this.pnl.addControl(this.btnCancel);
				
				this.btnOK = new dashboard.FlatButton();
				this.btnOK.setLeft(this.pnl.getWidth() / 2 + 5);
				this.btnOK.setTop(this.pnl.getHeight() - 40);
				this.btnOK.setWidth(this.pnl.getWidth() / 2 - 10);
				this.btnOK.setHeight(35);
				this.btnOK.setCaption("Simpan");
				this.btnOK.setCaptionColor("#000000");
				this.btnOK.setBorderColor("#CCCCCC");
				this.btnOK.lblTitle.setLeft(0);
				this.btnOK.lblTitle.setWidth(this.btnOK.getWidth());
				this.btnOK.lblTitle.setAlign("center");
				this.btnOK.lblTitle.font.setSize(12);
				this.btnOK.lblTitle.font.setBold(12);
				this.btnOK.lblTitle.font.setFontName('"Trebuchet MS", Arial, Helvetica, sans-serif');
				this.btnOK.lblTitle.setTop(8);
				this.btnOK.canvas.style.zIndex = "9001";
				this.btnOK.on(eventName, [this, this.btnOKClick]);
				this.pnl.addControl(this.btnOK);
			
			stage.on("resize", [this, this.initSize]);
			
			this.ready = false;
			
			this.on(eventName,
				function(sender, myCanvas)
				{
					if (myCanvas && self.ready)
						self.close();
				});
		},
		
		//--------------------- Event ---------------------
		
		show : function()
		{
			this._super();
			
			var self = this;
			self.ready = false;
			
			setTimeout(
				function()
				{
					self.ready = true;
				}, 1000);
		},
		
		sendResult : function(resultArray)
		{
			var self = this;
			
			if (self.handler instanceof Array)
				self.handler[1].apply(self.handler[0], resultArray);
			else if (typeof(self.handler) == "function")
				self.handler.apply(null, resultArray);
		},
		
		btnCancelClick : function()
		{
			this.close();
			
			this.sendResult([false]);
		},
		
		btnOKClick : function()
		{
			this.close();
		},
		
		initSize : function()
		{
			this.setWidth(stage.getWidth());
			this.setHeight(stage.getHeight());
			
			var desiredWidth = this.desiredWidth;
			var desiredHeight = this.desiredHeight;
			
			if (desiredWidth > (stage.getWidth() - 20))
				desiredWidth = stage.getWidth() - 20;
			
			if (desiredHeight > (stage.getHeight() - 14))
				desiredHeight = stage.getHeight() - 14;
			
			this.pnl.setWidth(desiredWidth);
			this.pnl.setHeight(desiredHeight);
			
			this.pnl.setLeft((this.getWidth() - this.pnl.getWidth()) / 2);
			this.pnl.setTop((this.getHeight() - this.pnl.getHeight()) / 3);
			
			this.lblTitle.setWidth(this.pnl.getWidth() - (2 * this.lblTitle.getLeft()));
			this.shpTop.setWidth(this.pnl.getWidth() + 2);
			
			this.shpBottom.setTop(this.pnl.getHeight() - 45);
			this.shpBottom.setWidth(this.pnl.getWidth() + 2);
			
			this.shpVer.setLeft(this.pnl.getWidth() / 2);
			this.shpVer.setTop(this.shpBottom.getTop());
			
			this.btnCancel.setTop(this.pnl.getHeight() - 40);
			this.btnCancel.setWidth(this.pnl.getWidth() / 2 - 10);
			
			this.btnOK.setTop(this.pnl.getHeight() - 40);
			this.btnOK.setLeft(this.pnl.getWidth() / 2 + 5);
			this.btnOK.setWidth(this.pnl.getWidth() / 2 - 10);
		},
	});

	dashboard.Confirm = dashboard.BasicDialog.extend(
	{
		init : function() 
		{
			this._super();
			var self = this;
			
			this.desiredWidth = 400;
			
			this.canvas.style.zIndex = "1002";
			
			this.lblMessage = new pasta.gui.Label();
			this.lblMessage.setLeft(15);
			this.lblMessage.setWidth(this.pnl.getWidth() - (2 * this.lblMessage.getLeft()));
			this.lblMessage.setTop(this.shpTop.getTop() + 15);
			this.lblMessage.setHeight(this.pnl.getHeight() - this.lblMessage.getTop() - 50);
			this.lblMessage.font.setSize(14);
			this.lblMessage.font.setColor("#000000");
			this.lblMessage.setCaption("");
			this.pnl.addControl(this.lblMessage);
			
			this.btnOK.setCaption("Ya");
			this.btnCancel.setCaption("Tidak");
		},
		
		//--------------------- Event ---------------------
		
		btnCancelClick : function()
		{
			this.sendResult([false]);
			this.close();
		},
		
		btnOKClick : function()
		{
			this.sendResult([true]);
			this.close();
		},
		
		show : function(caption, message, height, handler)
		{
			this.handler = handler;
			
			if ((typeof(height) == "function") || (typeof(height) == "object"))
			{
				this.handler = height;
				this.desiredHeight = 200;
			}
			else 
				this.desiredHeight = height;
			
			if (typeof(this.desiredHeight) != "number")
				this.desiredHeight = 200;
			
			this.lblTitle.setCaption(caption);
			this.lblMessage.setCaption(message);
			
			this.initSize();
			this._super();
		},
		
		initSize : function()
		{
			this._super();
			
			this.lblMessage.setHeight(this.pnl.getHeight() - this.lblMessage.getTop() - 50);
		},
	});
	dashboard.Button = pasta.gui.Control.extend({
		init:function(options){
			this._super(options);
			 	this.bgIcon = new pasta.gui.Control({bound:[0,0,30,40]});
				this.bgIcon.background.setColor("#2196F3");
				this.cIcon = new pasta.gui.Control({bound:[0,0,30,40]});
				this.cIcon.canvas.className = "fa fa-gear";
				$(this.cIcon.canvas).css({color : "white", fontSize : "24px", top : "5px",left : "5px" });
				this.bTitle = new pasta.gui.Label({bound: [40,8, 70,40], caption: "Save", color:"#2196F3", fontSize:14});
				$(this.canvas).css({background:"#EEEEEE", borderRadius:"5px", overflow:"hidden", cursor:"pointer"});
				$(this.canvas).append(this.bgIcon.canvas);
				$(this.canvas).append(this.cIcon.canvas);
				$(this.canvas).append(this.bTitle.canvas);

				if (options){
					if (options.bound) this.setHeight(options.bound[3]);
					if (options.bound) this.setWidth(options.bound[2]);
					if (options.fontSize) this.setFontSize(options.fontSize);
					if (options.fontColor) this.bTitle.font.setColor(options.fontColor);
					if (options.icon) this.setIcon(options.icon);
					if (options.iconSize) this.setIconSize(options.iconSize);
					if (options.iconColor) this.setIconColor(options.iconColor);
					if (options.iconBg) this.setIconBgColor(options.iconBg);
					if (options.caption) this.setCaption(options.caption);
				}
		},
		setCaption: function(data){
			this.bTitle.setCaption(data);
		},
		setHeight: function(data){
			this._super(data);
			if (this.bgIcon)
				this.bgIcon.setHeight(data);
			if (this.cIcon)
				this.cIcon.setHeight(data);
			if (this.bTitle){
				this.bTitle.setTop(data / 2 - 10);
			}
			
		},
		setWidth: function(data){
			this._super(data);
			if (this.bTitle)
				this.bTitle.setWidth(data - 40);
		},
		setFontSize: function(data){
			this.bTitle.font.setSize(data);
		},
		setIcon: function(className){
			this.cIcon.canvas.className = className;
		},
		setIconSize: function(data){
			$(this.cIcon.canvas).css({fontSize:data});
		},
		setColor: function(color){
			$(this.canvas).css({background:color});
		},
		setIconColor: function(color){
			$(this.cIcon.canvas).css({color:color});
		},
		setIconBgColor : function(color){
			$(this.bgIcon.canvas).css({background:color});
			$(this.canvas).css({border:"1px solid "+color});
		}
	});
	/*
	var areaChartData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Electronics",
          fillColor: "rgba(210, 214, 222, 1)",
          strokeColor: "rgba(210, 214, 222, 1)",
          pointColor: "rgba(210, 214, 222, 1)",
          pointStrokeColor: "#c1c7d1",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: "Digital Goods",
          fillColor: "rgba(60,141,188,0.9)",
          strokeColor: "rgba(60,141,188,0.8)",
          pointColor: "#3b8bba",
          pointStrokeColor: "rgba(60,141,188,1)",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(60,141,188,1)",
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
	 */
	dashboard.BarChart = pasta.gui.Control.extend({
		init: function(options){
			this._super(options);
			var self = this;
			this.drawCanvas = document.createElement("canvas");
			$(this.drawCanvas).css({width:"100%",height:"100%", position:"absolute"});
			this.canvas.appendChild(this.drawCanvas);
			this.chartOptions = {
				legend : {
					display : true
				},
				//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
				scaleBeginAtZero: true,
				//Boolean - Whether grid lines are shown across the chart
				scaleShowGridLines: true,
				//String - Colour of the grid lines
				scaleGridLineColor: "rgba(0,0,0,.05)",
				//Number - Width of the grid lines
				scaleGridLineWidth: 1,
				//Boolean - Whether to show horizontal lines (except X axis)
				scaleShowHorizontalLines: true,
				//Boolean - Whether to show vertical lines (except Y axis)
				scaleShowVerticalLines: true,
				//Boolean - If there is a stroke on each bar
				barShowStroke: true,
				//Number - Pixel width of the bar stroke
				barStrokeWidth: 2,
				//Number - Spacing between each of the X value sets
				barValueSpacing: 5,
				//Number - Spacing between data sets within X values
				barDatasetSpacing: 1,
				//String - A legend template
				legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
				//Boolean - whether to make the chart responsive
				responsive: true,
				maintainAspectRatio: true,

				onClick: function(evt){
						console.log("clicked");
						var chartElement = this.barChart.getElementAtEvent(evt);
						console.log(JSON.stringify(chartElement));
					} 
				};

		},
		setOptions: function(options){
			this.chartOptions = options;
		},
		setData: function(data){
			this.data = data;
		},
		render : function(){
			var barChartCanvas = $(this.drawCanvas).get(0).getContext("2d");
			var self = this;
			this.drawCanvas.onclick = function(evt){
							console.log("clicked");
							var chartElement = self.barRender.getBarsAtEvent(evt);
							console.log(JSON.stringify(self.data[chartElement[0].label]) );
							if (self.data[chartElement[0].label]){
								self.dataMaster = self.data;
								self.setData(self.data[chartElement[0].label]);
								self.render();
							}else {
								if (self.dataMaster){
									self.setData(self.dataMaster);
									self.render();
								}
							}
							
						};
    		this.barChart = new Chart(barChartCanvas);
			var barChartData = this.data;
			barChartData.datasets[1].fillColor = "#00a65a";
			barChartData.datasets[1].strokeColor = "#00a65a";
			barChartData.datasets[1].pointColor = "#00a65a";

			this.chartOptions.datasetFill = false;
    		this.barRender = this.barChart.Bar(barChartData, this.chartOptions);

		}
	});
	/*
	var PieData = [
      {
        value: 700,
        color: "#f56954",
        highlight: "#f56954",
        label: "Chrome"
      },
      {
        value: 500,
        color: "#00a65a",
        highlight: "#00a65a",
        label: "IE"
      },
      {
        value: 400,
        color: "#f39c12",
        highlight: "#f39c12",
        label: "FireFox"
      },
      {
        value: 600,
        color: "#00c0ef",
        highlight: "#00c0ef",
        label: "Safari"
      },
      {
        value: 300,
        color: "#3c8dbc",
        highlight: "#3c8dbc",
        label: "Opera"
      },
      {
        value: 100,
        color: "#d2d6de",
        highlight: "#d2d6de",
        label: "Navigator"
      }
    ];
	 */
	dashboard.PieChart = pasta.gui.ContainerControl.extend({
		init: function(options){
			this._super(options);
			this.clientCanvas = document.createElement("canvas");
			$(this.clientCanvas).css({width:"100%", height:"100%"});
			this.canvas.appendChild(this.clientCanvas);
			this.chartOptions = {
				//Boolean - Whether we should show a stroke on each segment
				segmentShowStroke: true,
				//String - The colour of each segment stroke
				segmentStrokeColor: "#fff",
				//Number - The width of each segment stroke
				segmentStrokeWidth: 2,
				//Number - The percentage of the chart that we cut out of the middle
				percentageInnerCutout: 50, // This is 0 for Pie charts
				//Number - Amount of animation steps
				animationSteps: 100,
				//String - Animation easing effect
				animationEasing: "easeOutBounce",
				//Boolean - Whether we animate the rotation of the Doughnut
				animateRotate: true,
				//Boolean - Whether we animate scaling the Doughnut from the centre
				animateScale: false,
				//Boolean - whether to make the chart responsive to window resizing
				responsive: true,
				// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
				maintainAspectRatio: true,
				//String - A legend template
				legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
				};
		},
		setOptions: function(options){
			this.chartOptions = options;
		},
		setData: function(data){
			this.data = data;
		},
		render : function(){
			var pieChartCanvas = this.clientCanvas.getContext("2d");
    		var pieChart = new Chart(pieChartCanvas);
			
			pieChart.Doughnut(this.data, this.chartOptions);
		}
	});
	dashboard.LineChart = pasta.gui.Control.extend({
		init: function(options){
			this._super(options);
			this.chartOptions = {
					//Boolean - If we should show the scale at all
					showScale: true,
					//Boolean - Whether grid lines are shown across the chart
					scaleShowGridLines: false,
					//String - Colour of the grid lines
					scaleGridLineColor: "rgba(0,0,0,.05)",
					//Number - Width of the grid lines
					scaleGridLineWidth: 1,
					//Boolean - Whether to show horizontal lines (except X axis)
					scaleShowHorizontalLines: true,
					//Boolean - Whether to show vertical lines (except Y axis)
					scaleShowVerticalLines: true,
					//Boolean - Whether the line is curved between points
					bezierCurve: true,
					//Number - Tension of the bezier curve between points
					bezierCurveTension: 0.3,
					//Boolean - Whether to show a dot for each point
					pointDot: false,
					//Number - Radius of each point dot in pixels
					pointDotRadius: 4,
					//Number - Pixel width of point dot stroke
					pointDotStrokeWidth: 1,
					//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
					pointHitDetectionRadius: 20,
					//Boolean - Whether to show a stroke for datasets
					datasetStroke: true,
					//Number - Pixel width of dataset stroke
					datasetStrokeWidth: 2,
					//Boolean - Whether to fill the dataset with a color
					datasetFill: true,
					//String - A legend template
					legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
					//Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
					maintainAspectRatio: true,
					//Boolean - whether to make the chart responsive to window resizing
					responsive: true
					};
		},
		setOptions: function(options){
			this.chartOptions = options;
		},
		setData: function(data){
			this.data = data;
		},
		render : function(){
			var lineChartCanvas = $(this.canvas).get(0).getContext("2d");
			var lineChart = new Chart(lineChartCanvas);
			var lineChartOptions = this.chartOptions;
			lineChartOptions.datasetFill = false;
			lineChart.Line(this.data, lineChartOptions);
		}
	});
	dashboard.WidgetPanel = pasta.gui.ContainerControl.extend({
		init : function(options){
			this._super(options);
			$(this.canvas).css({overflow:"hidden",background:"#ffffff",border:"1px solid #efefef", borderRadius:"5px"});
			this.colorBorder = new pasta.gui.Control({bound:[0,0,this.getWidth(), 5], background:"#E65100"});

			this.addControl(this.colorBorder);
			this.title = new pasta.gui.Label({bound:[20,20,this.getWidth() - 50, 30], fontSize:14});
			this.addControl(this.title);
			this.line = new pasta.gui.Control({bound:[0,50,this.getWidth(), 1], background:"#efefef"});
			this.addControl(this.line);

		},
		setColorBorder: function(color){
			this.colorBorder.background.setColor(color);
		},
		setTitle: function(title){
			this.title.setCaption(title);
		}
	});
	dashboard.Invoker = pasta.gui.Control.extend({
		init: function(options){
			this._super(options);
			$(this.canvas).css({overflow:"hidden"});
			dashboard.listInvoker.push(this);
			this.id = dashboard.invokerCurrentId;
			dashboard.invokerCurrentId++;

			this.frame = document.createElement("iframe");

			$(this.frame).attr("border","0");
			$(this.frame).attr("frameBorder","no");

			this.canvas.appendChild(this.frame);
			if (options){
				if (options.service) this.setService(options.service);
			}
		},
		setService : function(service){
			this.service = service;
		},
		start: function(addParam){
			if (addParam == undefined)
				addParam = "";
			$(this.frame).attr("src",this.service+"?resid="+this.id+addParam);
		},
		stop: function(){
			$(this.frame).attr("src","");
		},
		update: function(data){
			this.emit("update", data);
		}

	});
	dashboard.listInvoker = [];
	dashboard.invokerCurrentId = 0;
	//----------------------------------------------------------------------------------------------------------------------------------
	//-------- form
	dashboard.headerHeight = 46;
	dashboard.footerHeight = 0;
	//----------------------------------------------------------------------------------------------------------------------------------
	var fs = {};
	
}
function toRp(angka){
	angka = Math.round(angka * 100) / 100;
	return floatToNilai(angka);
	/*var isMinus = false;
	if (parseFloat(angka) < 0){
		isMinus = true;
		angka = Math.abs(parseFloat(angka));
	}
    var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
    var rev2    = '';
    for(var i = 0; i < rev.length; i++){
        rev2  += rev[i];
        if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
            rev2 += '.';
        }
    }
	if (isMinus)
    	return "-" + rev2.split('').reverse().join('') + '';
	else return rev2.split('').reverse().join('') + '';
	*/
}

function parseNilai(value){
	//2.000.000,34 -> 2000000.34 => untuk save ke table  atau olahan	
	var nilai = String(RemoveTitik(value));
	nilai = nilai.replace(",",".");
	
	return nilai;
};
function isNilai(value){
	if (typeof(value) == "string"){
		var c = 0;
		for (var i =0;i < value.length ;i++)
			if (value.charAt(i) == ".") c++;
		if (c >= 1) return true;
		else {
			var tmp = value.split(".");			
			if ( tmp[tmp.length - 1].length == 3 && tmp[0] != "0") 
				return true;
			else return false; 
		}
	} else return false;

};
function RemoveTitik(str){
		
	if (typeof (str) == "string")
  		return str.replace(/\./g,"");
  	else return String(str);
  var num = str;
  var numtmp ="";
  var i;
  
  for (i=0;i<num.length;i++)
   {     
    if (num.charAt(i) != ".")
         numtmp += num.charAt(i); 
   }  
  num = numtmp; 
  return  num;
};
function decToFloat(value)	{
	//2000,56 -> 2000.56 -> untuk olah data aritmatika
	if (typeof(value) != "string") value = value.toString();
	if (value == "NaN") value = "0";
	var nilai = value;
	nilai = nilai.replace(",",".");
	return parseFloat(nilai);
};
function floatToDec(value){
	if (typeof(value) == "string") value = parseFloat(value);
	else if (isNaN(value)) value = 0;
	//2000.56 -> 2000,56 -> untuk komponen
	var nilai = value.toString();
	nilai = nilai.replace(".",",");
	return nilai;
};
function floatToNilai(value,decSep, thousandSep){
	//2000.56 -> 2.000,56 -> untuk komponen
	var nilai = floatToDec(value);
	nilai = decToNilai(nilai,decSep, thousandSep);
	return nilai;
};
function nilaiToFloat(value){
	//2.000,25 -> 2000.25
	var nilai = nilaiToDec(value);
	nilai = decToFloat(nilai);
	return parseFloat(nilai);
};
function nilaiToDec(value){
	//2.000.000,35 -> 2000000,35 
	var nilai = String(RemoveTitik(value));
	return nilai;
};
function decToNilai(value, decSep, thousandSep){
	//2000000,35 -> 2.000.000,35 
	var nilai = strToNilai(value,decSep, thousandSep);
	return nilai;
};
function strToNilai(value, decSep, thousandSep) {
  try	{
	  //if (value.indexOf(".") != -1)
	    //value = value.replace(".",",");      
	  if (typeof(value) != "string") return floatToNilai(value, decSep, thousandSep);
	  var isMin = value.search("-") != -1 ? true : false;
	  if (isMin)  
		value = value.replace("-","");
	  var decpoint = ',';
	  var sep = '.';
	  if (decSep != undefined) decpoint = decSep;
	  if (thousandSep != undefined) sep = thousandSep;
	  var isExit = 0;
	  var num = value;
	  
	  var numtmp ="";
	  var i;
	  
	  for (i=0;i<num.length;i++)
	   {     
	    if (num.charAt(i) != ".")
	         numtmp += num.charAt(i); 
	   }  
	  num = numtmp; 
	  // need a string for operations
	  num = num.toString();
	  // separate the whole number and the fraction if possible
	  a = num.split(decpoint);
	  x = a[0]; // decimal
	  y = a[1]; // fraction
	  z = "";


	  if (typeof(x) != "undefined") {
	    // reverse the digits. regexp works from left to right.
	    for (i=x.length-1;i>=0;i--)
	      z += x.charAt(i);
	    // add seperators. but undo the trailing one, if there
	    z = z.replace(/(\d{3})/g, "$1" + sep);
	    if (z.slice(-sep.length) == sep)
	      z = z.slice(0, -sep.length);
	    x = "";
	    // reverse again to get back the number
	    for (i=z.length-1;i>=0;i--)
	      x += z.charAt(i);
	    // add the fraction back in, if it was there
	    if (typeof(y) != "undefined" && y.length > 0)
	      x += decpoint + y;
	  }  
	  if (isMin)
		 x = '-' + x;
	  return x;
	  //var nCursorPos = numtmp.length;
	  //setCursor(edit,nCursorPos);
	}catch(e){
		alert("strToNilai::"+e);
	}
};
function strToFloat(data) {
    var nilai = String(RemoveTitik(data));
	nilai = nilai.replace(",",".");//alert(nilai +" "+data);
	return parseFloat(nilai);
};
