//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_richTextArea = function(owner, options){
    if (owner){        
		window.control_richTextArea.prototype.parent.constructor.call(this, owner, options);		
        this.className = "control_richTextArea";
        this.owner = owner;		
		this.onKeyPress = new control_eventHandler();
		this.onKeyDown	= new control_eventHandler();		
		this.display();
		if (options !== undefined) {
			this.updateByOptions(options);
			
		}
    }
};
window.control_richTextArea.extend(window.control_control);
window.richTextArea = window.control_richTextArea;
//---------------------------- Function ----------------------------------------
window.control_richTextArea.implement({
	doDraw: function(canvas){
		var n = this.getFullId();
		this.id = this.getFullId();
		var n = this.getFullId();
		var rteImagePath = "icon/wysiwyg/";	
		this.rteImagePath = rteImagePath;
	    var html =  "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;border:1px solid #555}' >" +
						"<div id='"+ n +"_header' style='{position: relative; left: 0; top: 0; width: 100%; height: auto;background:#C3DAF9}' >" +
							"<table>"+																	
									"<tr><td><table cellpadding='0' cellspacing='0' id='"+ n +"_tb1' onmousedown='return false;'><tr> "+
												"<td width='7'><img src='" + rteImagePath + "start.gif' width='7' height='25'></td>"+
												"<td id='"+ n +"_rtesep1' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><img src='" + rteImagePath + "blank.gif'></td>"+				
												"<td background='" + rteImagePath + "bg.gif' id='"+ n +"_rteformat'>"+
													"<table width='100%' cellpadding='0' cellspacing='0' id='"+n+"format4' bgcolor='#FFFFFF' title='Style'><tr>"+
														" <td nowrap><div name='"+ n +"_tool' unselectable='on' id='"+ n +"format1' style='height:16px;width:58px;font-family:Arial, Helvetica, sans-serif;padding-left:3px;padding-right:3px;border:1px solid #FFFFFF;cursor:default;font-size:11px;color:#000000;'>Paragraph</div></td>"+
														" <td><div name='"+ n +"_tool' unselectable='on' id='"+ n +"format2' style='width:11px;background-image:url(" + rteImagePath + "bg.gif);border-top:1px solid #FFFFFF;border-right:1px solid #FFFFFF;border-bottom:1px solid #FFFFFF;cursor:default;'><img src='" + rteImagePath + "arrow.gif' width='11' height='16'></div></td> "+
													"</tr></table>"+
												"</td>"+
												"<td style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><img src='" + rteImagePath + "blank.gif'></td>"+
												"<td background='" + rteImagePath + "bg.gif' id='"+ n +"_rtefontface'>"+
													"<table style='width:110px' cellpadding='0' cellspacing='0' bgcolor='#FFFFFF' title='Font'><tr>"+												
														"<td nowrap><div name='"+ n +"_tool' unselectable='on' id='"+ n +"_fontface1' style='height:16px;width:98px;font-family:Arial, Helvetica, sans-serif;border:1px solid #FFFFFF;padding-left:3px;padding-right:3px;cursor:default;font-size:11px;color:#000000;'>Verdana</div></td>"+
														"<td><div name='"+ n +"_tool' unselectable='on' id='"+ n +"_fontface2' style='width:11px;background-image:url(" + rteImagePath + "bg.gif);border-top:1px solid #FFFFFF;border-right:1px solid #FFFFFF;border-bottom:1px solid #FFFFFF;cursor:default'><img src='" + rteImagePath + "arrow.gif' width='11' height='16'></div></td>"+
													"</tr></table>"+
												"</td>"+
												"<td style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><img src='" + rteImagePath + "blank.gif'></td>"+
												"<td background='" + rteImagePath + "bg.gif' id='"+ n +"_rtefontsize'>"+
													"<table width='100%' cellpadding='0' cellspacing='0' bgcolor='#FFFFFF' title='Font Size'><tr>"+
														" <td><div unselectable='on' name='"+ n +"_tool' id='"+ n +"_fontsize1' style='height:16px;font-family:Arial, Helvetica, sans-serif;padding-left:3px;padding-right:3px;border:1px solid #FFFFFF;cursor:default;font-size:11px;color:#000000;font-family:arial;font-size:11px;color:#000000;'>2</div></td>"+
														" <td><div unselectable='on' name='"+ n +"_tool' id='"+ n +"_fontsize2' style='width:11px;background-image:url(" + rteImagePath + "bg.gif);border-top:1px solid #FFFFFF;border-right:1px solid #FFFFFF;border-bottom:1px solid #FFFFFF;cursor:default'><img src='" + rteImagePath + "arrow.gif' width='11' height='16'></div></td>"+
													"</tr></table>"+
												"</td>"+
												"<td style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><img src='" + rteImagePath + "blank.gif'></td>"+
												"<td style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtefontcolor' title='Font Color'>"+
													"<table style='width:35px;' border='0' cellspacing='0' cellpadding='0'><tr>"+
														"<td><div name='"+ n +"_tool' id='"+ n +"_fontcolor1' align='center'  class='rtedropdown5' style='cursor:default;height:18px;padding-bottom:1px;'><img src='" + rteImagePath + "fontcolor.gif'><br><img id='"+ n +"_fontcolor4' src='" + rteImagePath + "fontcolor2.gif' style='background-color:#FF0000;'></div></td>"+
														"<td><div name='"+ n +"_tool' align='center' id='"+ n +"_fontcolor2' class='rtedropdown8' style='height:18px;cursor:default;'><img src='" + rteImagePath + "arrow.gif'></div></td>"+
													"</tr></table>"+
												"</td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_rtesep2'><img src='" + rteImagePath + "seperator.gif'></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Bold'><div name='"+ n +"_tool' id='"+ n +"_bold' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='"+ rteImagePath + "bold.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Italic'><div name='"+ n +"_tool' id='"+ n +"_italic' class='rtebtn1'  style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' ><img src='" + rteImagePath + "italic.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Underline'><div name='"+ n +"_tool' id='"+n +"_underline' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' ><img src='" + rteImagePath + "underline.gif'></div></td>"+											
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Strikethrough'><div name='"+ n +"_tool' id='"+ n +"_strikethrough' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "strikethrough.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_rtesep3'><img src='" + rteImagePath + "seperator.gif'></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Align Left'><div name='"+ n +"_tool' id='"+ n +"_justifyleft' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "leftalign.gif' width='21' height='20'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Center'><div name='"+ n +"_tool' id='"+ n +"_justifycenter' class='rtebtn1'  style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "centeralign.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Align Right'><div name='"+ n +"_tool' id='"+ n +"_justifyright' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "rightalign.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Justify'><div name='"+ n +"_tool' id='"+ n +"_justifyfull' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "fullalign.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Horizontal Rule'><div name='"+ n +"_tool' id='"+ n +"_inserthorizontalrule' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "hr.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep4'><img src='" + rteImagePath + "seperator.gif'></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Superscript'><div name='"+ n +"_tool' id='"+ n +"_superscript' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "superscript.gif'></div></td>"+
												"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Subscript'><div name='"+ n +"_tool' id='"+ n +"_subscript' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "subscript.gif'></div></td>"+
												"<td width='14'><img src='" + rteImagePath + "finish.gif' width='14' height='25'></td>"+
												"<td width='100%'></td>"+
											"</tr></table>"+
									"</td></tr>"+			
							"</table>"+
						"</div>"+
						"<div id='"+ n +"format3' class='rtedropdown7' style='border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;position:absolute;display:none;z-index:10'>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:24px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Header 1</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:18px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Header 2</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:16px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Header 3</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:14px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Header 4</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:12px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Header 5</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:10px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Header 6</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"formatblock' style='font-size:12px; font-family:arial;color:#000000;font-weight:bold;padding:5px;' nowrap>Paragraph</div>"+
							"</div>"+
							"<div id='"+ n +"_fontface3' class'rtedropdown7' style='width:98;border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;position:absolute;display:none;z-index:10'>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:arial;padding:5px;' nowrap>Arial</div> "+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:arial black;padding:5px;' nowrap>Arial Black</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:arial narrow;padding:5px;' nowrap>Arial Narrow</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:courier new;padding:5px;' nowrap>Courier New</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:century gothic;padding:5px;' nowrap>Century Gothic</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:comic sans ms;padding:5px;' nowrap>Comic Sans MS</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:impact;padding:5px;' nowrap>Impact</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:tahoma;padding:5px;' nowrap>Tahoma</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:times new roman;padding:5px;' nowrap>Times New Roman</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:trebuchet ms;padding:5px;' nowrap>Trebuchet MS</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontface' style='color:#000000;font-family:verdana;padding:5px;' nowrap>Verdana</div>"+ 
							"</div>"+
							"<div id='"+ n +"_fontsize3' class='rtedropdown7' style='position:absolute;display:none;border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;z-index:10'>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:7px;padding:5px;'>1</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:10px;padding:5px;'>2</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>3</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:13px;padding:5px;'>4</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:17px;padding:5px;'>5</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:23px;padding:5px;'>6</div>"+
								"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:35px;padding:5px;'>7</div>"+
							"</div>"+
							"<div id='"+ n +"_fontcolor3' class='rtedropdown7' style='position:absolute;display:none;border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;z-index:10'>"+
								this._get_palette_html("forecolor")+
							"</div>"+
						"<textarea id='" + n + "_hidden_edit' style='{visibility:hidden;display:none;position: absolute; left: 0; top: 0; width: 100%; height: 100%;font-family:monospace;font-size:12}' "+					
						"></textarea>"+				
						"<iframe id='" + n + "_input'  frameborder='0' style='{margin-left: 3px; background-color: white; color: black; position: absolute; left: 0; top: 30; width: 100%; height: 100%}' "+					
						"></iframe>"+
						"<div id='" + n + "_block' style='{background:#4d7795; filter:alpha(opacity:70);opacity:0.7;moz-opacity:0.7; display: none; position: absolute; left: 0; top: 30; width: 100%; height: 100%}' ></div>"+
					"</div>"+
					"<div id='"+ n +"_pallete' style='border:2px solid #ff9900;background:#eeeeee; position:absolute; top:0;left:0;height:120;width:172;display:none;'></div>";
	    this.setInnerHTML(html, canvas);
		this.wysiwyg_content = $( n +"_input");
		this.wysiwyg_hidden = $( n +"_hidden_edit");
		this.wysiwyg_pallete = $( n +"_pallete");	
		this.rteName = n +"_input";
		this.rteFormName = n +"_hidden_edit";					
		if (document.all){
			var kids = canvas.document.getElementsByTagName("div"); 
			for (var i=0; i < kids.length; i++) { 															
				if (kids[i].getAttribute("name")== n + "_tool"){
					kids[i].onmouseout = new Function("$$$("+this.resourceId+").rteMouseOutFormatMenu(event, '"+kids[i].id+"',"+this.resourceId+")");
					kids[i].onmouseover = new Function("$$$("+this.resourceId+").rteMouseOverFormatMenu(event, '"+kids[i].id+"',"+this.resourceId+")");
					kids[i].onmousedown = new Function("$$$("+this.resourceId+").rteMouseDownFormatMenu(event, '"+kids[i].id+"',"+this.resourceId+")");					
					if (kids[i].className.search("rtebtn") != -1)
						kids[i].onclick = new Function("$$$("+this.resourceId+").rteAction(event, '"+kids[i].id+"',"+this.resourceId+")");
				}else if (kids[i].getAttribute("name")== n + "format"){
					kids[i].onmouseout = new Function("$$$("+this.resourceId+").rteMouseOutMenuContents(event, '"+kids[i].id+"',"+this.resourceId+")");
					kids[i].onmouseover = new Function("$$$("+this.resourceId+").rteMouseOverMenuContents(event, '"+kids[i].id+"',"+this.resourceId+")");
					kids[i].onmousedown = new Function("$$$("+this.resourceId+").rteMouseDownMenuContents(event, '"+kids[i].id+"',"+this.resourceId+")");		
				}
				
			}			
		}else{
			var kids = document.getElementsByName(n +"_tool"); 			
			for (var i=0; i < kids.length; i++) { 				
				kids[i].onmouseout = new Function("event","$$$("+this.resourceId+").rteMouseOutFormatMenu(event, '"+kids[i].id+"',"+this.resourceId+")");
				kids[i].onmouseover = new Function("event","$$$("+this.resourceId+").rteMouseOverFormatMenu(event, '"+kids[i].id+"',"+this.resourceId+")");
				kids[i].onmousedown = new Function("event","$$$("+this.resourceId+").rteMouseDownFormatMenu(event, '"+kids[i].id+"',"+this.resourceId+")");					
				if (kids[i].className.search("rtebtn") != -1)
					kids[i].onclick = new Function("event","$$$("+this.resourceId+").rteAction(event, '"+kids[i].id+"',"+this.resourceId+")");;				
			}
			kids = document.getElementsByName(n +'format'); 
			for (var i=0; i < kids.length; i++) { 
				kids[i].onmouseout = new Function("event","$$$("+this.resourceId+").rteMouseOutMenuContents(event, '"+kids[i].id+"',"+this.resourceId+")");
				kids[i].onmouseover = new Function("event","$$$("+this.resourceId+").rteMouseOverMenuContents(event, '"+kids[i].id+"',"+this.resourceId+")");
				kids[i].onmousedown = new Function("event","$$$("+this.resourceId+").rteMouseDownMenuContents(event, '"+kids[i].id+"',"+this.resourceId+")");		
			}	
		}
		this.loadCss();	
	},
	eventKeyDown: function (event, res){
		try{					
			if (system){					
				var obj = window.system.getResource(res);
				if (obj != undefined) obj.onKeyDown.call(obj);						
			}
		}catch(e){
			alert("eventKeyDown:"+e);
		}
	},
	eventKeyPress: function (event,res){	
		try{
			if (system){									
				var obj = window.system.getResource(res);
				if (obj != undefined) obj.onKeyPress.call(obj);			
			}
		}catch(e){
			systemAPI.alert("eventKeyPress:"+e);
		}	
	},
	disable: function (){
		if(this.wysiwyg_content.contentWindow.document.body.contentEditable)
			this.wysiwyg_content.contentWindow.document.body.contentEditable = false;		
		else
			this.wysiwyg_content.contentWindow.document.designMode = "Off";				
	},
	enable: function (){	
		try{			
			if(this.wysiwyg_content.contentWindow.document.body.contentEditable)
				this.wysiwyg_content.contentWindow.document.body.contentEditable = true;	
			else
				this.wysiwyg_content.contentWindow.document.designMode = "On";			
		}catch(e){
			systemAPI.alert(e,this.wysiwyg_content.contentWindow.document)
		}
	},
	display: function (){
		try{
		    if(this.isSupported()){		        		
				this.wysiwyg_content.contentWindow.document.designMode='On';					
				if (document.all){									
					this.wysiwyg_content.contentWindow.document.onkeydown = new Function("return $$$("+this.resourceId+").eventKeyDown(event,"+this.resourceId+")");
					this.wysiwyg_content.contentWindow.document.onkeypress = new Function("return $$$("+this.resourceId+").eventKeyPress(event,"+this.resourceId+")");
				}else{												
					var thedoc = this.wysiwyg_content.contentWindow.document;					
					thedoc.open();						        
					thedoc.close();				
					this.wysiwyg_content.contentWindow.document.addEventListener("keydown", new Function("event","return $$$("+this.resourceId+").eventKeyDown(event,"+this.resourceId+")"), true);
					this.wysiwyg_content.contentWindow.document.addEventListener("keypress", new Function("event","return $$$("+this.resourceId+").eventKeyPress(event,"+this.resourceId+")"), true);
				}		        
		    }else{
		        this._display_textarea();        
		    }
		}catch(e){
			systemAPI.alert("display :"+e)
		}
	},
	_display_textarea: function (){
		this.wysiwyg_hidden.style.display = "";
		this.wysiwyg_hidden.style.visibility = "";
	},
	doTextFormat: function (command, optn, x, y){
		try{
		    if((command=='forecolor') || (command=='hilitecolor')){
		        this.getPallete(command, optn, x, y);
		    }else if(command=='createlink'){
		        var szURL=prompt('Enter a URL:', '');
		        if(this.wysiwyg_content.contentWindow.document.queryCommandEnabled(command)){
		            this.wysiwyg_content.contentWindow.document.execCommand('CreateLink',false,szURL);
		            return true;
		        }else return false;
		    }else{
		        if(this.wysiwyg_content.contentWindow.document.queryCommandEnabled(command)){
		              this.wysiwyg_content.contentWindow.document.execCommand(command, false, optn);
		              return true;
		          }else return false;
		    }
		    this.wysiwyg_content.contentWindow.focus();
		}catch(e){		
			systemAPI.alert(e);
		}	
	},
	toggleMode: function (){    
	    if(this.viewMode == 2){
	        this.wysiwyg_content.contentWindow.document.body.style.fontFamily = '';
	        this.wysiwyg_content.contentWindow.document.body.style.fontSize = '';
	        this.wysiwyg_content.contentWindow.document.body.style.color = '';
	        this.wysiwyg_content.contentWindow.document.body.style.fontWeight = '';
	        this.wysiwyg_content.contentWindow.document.body.style.backgroundColor = '';       
	    }else{
	        this.wysiwyg_content.contentWindow.document.body.style.fontFamily = 'monospace';
	        this.wysiwyg_content.contentWindow.document.body.style.fontSize = '10pt';
	        this.wysiwyg_content.contentWindow.document.body.style.color = '#000';
	        this.wysiwyg_content.contentWindow.document.body.style.backgroundColor = '#fff';
	        this.wysiwyg_content.contentWindow.document.body.style.fontWeight = 'normal';
	    }    
	    if(this.isMSIE()){
	        this._toggle_mode_ie();
	    }else{
	        this._toggle_mode_gecko();
	    }
	},
	_toggle_mode_ie: function (){
	    if(this.viewMode ==  2){
	        this.wysiwyg_content.contentWindow.document.body.innerHTML = this.wysiwyg_content.contentWindow.document.body.innerText;
	        this.wysiwyg_content.contentWindow.focus();
	        this.viewMode = 1; // WYSIWYG
	    }else{
	        this.wysiwyg_content.contentWindow.document.body.innerText = this.wysiwyg_content.contentWindow.document.body.innerHTML;
	        this.wysiwyg_content.contentWindow.focus();
	        this.viewMode = 2; // Code
	    }
	},
	_toggle_mode_gecko: function (){
	    if(this.viewMode == 2){				
	        //var html = this.wysiwyg_content.contentWindow.document.body.ownerDocument.createRange();
	        //html.selectNodeContents(this.wysiwyg_content.contentWindow.document.body);
		var html = this.wysiwyg_hidden.value;
		this.wysiwyg_content.style.display = "";
		this.wysiwyg_hidden.style.visibility = "hidden";
		this.wysiwyg_hidden.style.display = "none";
	        this.wysiwyg_content.contentWindow.document.body.innerHTML = html;
	        //this.wysiwyg_content.contentWindow.focus();
	        this.viewMode = 1; // WYSIWYG
	    }else{						
		this.wysiwyg_hidden.value  = this.wysiwyg_content.contentWindow.document.body.innerHTML;
		var html = document.createTextNode(this.wysiwyg_hidden.value);//
		this.wysiwyg_content.contentWindow.document.body.innerHTML = '';
	        this.wysiwyg_content.contentWindow.document.body.appendChild(html);
	        this.wysiwyg_content.contentWindow.focus();
	        this.viewMode = 2; // Code
		this.wysiwyg_hidden.style.display = "";
		this.wysiwyg_hidden.style.visibility = "";
		this.wysiwyg_content.style.display = "none";
	    }
	},
	getText: function (viewMode){
	    if(viewMode == 2){
	        return this.wysiwyg_content.contentWindow.document.body.innerHTML;
	    }else{
	        return this.rteFormHandler();        
	    }
	},
	getCaretPos: function (){    
		if(document.all){
			var caretPos=this.wysiwyg_content.contentWindow.document.selection.createRange();
			if(caretPos!=null)
				return caretPos;			
		}else {
			// get editor document
			var doc = this.wysiwyg_content.contentWindow.document;
			// get current selection
			var sel = this.getSelection();			
			// get the first range of the selection
			// (there's almost always only one range)
			var range = sel.getRangeAt(0);
			
			// deselect everything
			sel.removeAllRanges();
			
			// remove content of current selection from document
			range.deleteContents();
			
			// get location of current selection
			var container = range.startContainer;
			var pos = range.startOffset;
			return pos;
		}
	},
	insertNodeAtSelection: function (insertNode){    
		try{
			if(document.all){
				if (this.wysiwyg_content.contentWindow.document.selection){
					var selection =this.wysiwyg_content.contentWindow.document.selection;					
					var range = selection.createRange();																														            
					range.pasteHTML(insertNode.outerHTML);
				}
			}else {
				// get editor document
				var doc = this.wysiwyg_content.contentWindow.document;
				// get current selection
				var sel = this.getSelection();
				
				// get the first range of the selection
				// (there's almost always only one range)
				var range = sel.getRangeAt(0);
				
				// deselect everything
				sel.removeAllRanges();
				
				// remove content of current selection from document
				range.deleteContents();
				
				// get location of current selection
				var container = range.startContainer;
				var pos = range.startOffset;			
				
				// make a new range for the new selection
				range = doc.createRange();
				
				if (container.nodeType==3 && insertNode.nodeType==3) {					
					// if we insert text in a textnode, do optimized insertion
					container.insertData(pos, insertNode.data);
					// put cursor after inserted text
					range.setEnd(container, pos+insertNode.length);
					range.setStart(container, pos+insertNode.length);		
				} 	
				else {
				
					var afterNode;	
					var beforeNode;
					if (container.nodeType==3) {
						// when inserting into a textnode
						// we create 2 new textnodes
						// and put the insertNode in between
						var textNode = container;
						container = textNode.parentNode;
						var text = textNode.nodeValue;
						
						// text before the split
						var textBefore = text.substr(0,pos);
						// text after the split
						var textAfter = text.substr(pos);
						
						beforeNode = document.createTextNode(textBefore);
						afterNode = document.createTextNode(textAfter);
						
						// insert the 3 new nodes before the old one
						container.insertBefore(afterNode, textNode);
						container.insertBefore(insertNode, afterNode);
						container.insertBefore(beforeNode, insertNode);
						
						// remove the old node
						container.removeChild(textNode);
					} 
					else {
						// else simply insert the node
						afterNode = container.childNodes[pos];
						container.insertBefore(insertNode, afterNode);
					}
					
					try {
						range.setEnd(afterNode, 0);
						range.setStart(afterNode, 0);
					}
					catch(e) {
						alert(e);
					}
				}
				
				sel.addRange(range);
			}
			
		}catch(e){
			systemAPI.alert(e);
		}
	},
	getSelectContainer: function (){    
		try{
			if(document.all){
				var caretPos= this.wysiwyg_content.contentWindow.document.selection.createRange();
				if(caretPos!=null)
					return caretPos;			
			}else {
				// get editor document
				var doc = this.wysiwyg_content.contentWindow.document;
				// get current selection
				var sel = this.getSelection();
				// get the first range of the selection
				// (there's almost always only one range)
				var range = sel.getRangeAt(0);	
				for (var i in range) alert(i+":"+range[i]);
				// deselect everything
				sel.removeAllRanges();					
				// get location of current selection
				var container = range.startContainer;
				var pos = range.startOffset;			
				alert(pos+" "+container+" "+range);			
			}
		}catch(e){
			alert(e);
		}
	},
	setSelection: function (){  
		var sel = this.getSelection();
		var range = sel.getRangeAt(0);
		var pos = range.startOffset;
		var tix = sel.focusNode.data.lastIndexOf(" ");
		range.setStart(sel.focusNode, tix);
		range.setEnd(sel.focusNode, pos);
		sel.addRange(range);
	},
	getSelection: function (){    
		try{
			if(document.all){
				var caretPos=this.wysiwyg_content.contentWindow.document.selection.createRange();
				if(caretPos!=null)
					return caretPos;			
			}else {
				var sel;
				if(this.wysiwyg_content.contentWindow.getSelection){
					sel = this.wysiwyg_content.contentWindow.getSelection();
				}
				else if (this.wysiwyg_content.contentWindow.document.getSelection) {
					sel = this.wysiwyg_content.contentWindow.document.getSelection();
				}
				else if (this.wysiwyg_content.contentWindow.document.selection) {
					sel = this.wysiwyg_content.contentWindow.document.selection;
				}
				//var sel=this.wysiwyg_content.contentWindow.getSelection();							
				if (sel.focusNode.nodeName =="#text"){						
					return sel;
				}
							
			}
			
		}catch(e){
			alert(e);
		}
	},
	setSelectedColor: function (color, command){    
	    // only one difference for MSIE
	    if(this.isMSIE() && command == 'hilitecolor') command = 'backcolor';
	    //get current selected range
	    var sel=this.wysiwyg_content.contentWindow.document.selection;
	    if(sel!=null){
	        rng=sel.createRange();
	    }

	    this.wysiwyg_content.contentWindow.focus();
	    if(this.wysiwyg_content.contentWindow.document.queryCommandEnabled(command)){
	        this.wysiwyg_content.contentWindow.document.execCommand(command, false, color);
	    }else return false;
	    this.wysiwyg_content.contentWindow.focus();
	    return true;
	},
	setFocus: function(){
		this.wysiwyg_content.contentWindow.focus();
	},
	getPallete: function (command, optn, x, y) {
	    // get the pallete HTML code
	    html = this._get_palette_html(command);
	    this.wysiwyg_pallete.innerHTML = html;	
		this.wysiwyg_pallete.style.display = "";
		this.wysiwyg_pallete.style.left = x ;
		this.wysiwyg_pallete.style.top = y ;
	},
	isSupported: function () {   
		return true;
	},
	isMSIE: function (){
    return (typeof(document.all) == "object");
	},
	_get_palette_html: function (command) {    
	    s = '  <table border="0" cellpadding="0" cellspacing="2">';
	    s = s + '   <tr>';
	    s = s + '    <td id="cFFFFFF" bgcolor="#FFFFFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFCCCC" bgcolor="#FFCCCC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFCC99" bgcolor="#FFCC99" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFFF99" bgcolor="#FFFF99" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFFFCC" bgcolor="#FFFFCC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c99FF99" bgcolor="#99FF99" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c99FFFF" bgcolor="#99FFFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCCFFFF" bgcolor="#CCFFFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCCCCFF" bgcolor="#CCCCFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFCCFF" bgcolor="#FFCCFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '   <tr>';
	    s = s + '    <td id="cCCCCCC" bgcolor="#CCCCCC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFF6666" bgcolor="#FF6666" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFF9966" bgcolor="#FF9966" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFFF66" bgcolor="#FFFF66" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFFF33" bgcolor="#FFFF33" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c66FF99" bgcolor="#66FF99" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c33FFFF" bgcolor="#33FFFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c66FFFF" bgcolor="#66FFFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c9999FF" bgcolor="#9999FF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFF99FF" bgcolor="#FF99FF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '   <tr>';
	    s = s + '    <td id="cC0C0C0" bgcolor="#C0C0C0" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFF0000" bgcolor="#FF0000" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFF9900" bgcolor="#FF9900" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFCC66" bgcolor="#FFCC66" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFFF00" bgcolor="#FFFF00" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c33FF33" bgcolor="#33FF33" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c66CCCC" bgcolor="#66CCCC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c33CCFF" bgcolor="#33CCFF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c6666CC" bgcolor="#6666CC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCC66CC" bgcolor="#CC66CC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '   <tr>';
	    s = s + '    <td id="c999999" bgcolor="#999999" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCC0000" bgcolor="#CC0000" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFF6600" bgcolor="#FF6600" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFCC33" bgcolor="#FFCC33" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cFFCC00" bgcolor="#FFCC00" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c33CC00" bgcolor="#33CC00" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c00CCCC" bgcolor="#00CCCC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c3366FF" bgcolor="#3366FF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c6633FF" bgcolor="#6633FF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCC33CC" bgcolor="#CC33CC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '   <tr>';
	    s = s + '    <td id="c666666" bgcolor="#666666" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c990000" bgcolor="#990000" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCC6600" bgcolor="#CC6600" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="cCC9933" bgcolor="#CC9933" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c999900" bgcolor="#999900" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c009900" bgcolor="#009900" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c339999" bgcolor="#339999" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c3333FF" bgcolor="#3333FF" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c6600CC" bgcolor="#6600CC" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c993399" bgcolor="#993399" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '   <tr>';
	    s = s + '    <td id="c333333" bgcolor="#333333" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c660000" bgcolor="#660000" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c993300" bgcolor="#993300" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c996633" bgcolor="#996633" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c666600" bgcolor="#666600" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c006600" bgcolor="#006600" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c336666" bgcolor="#336666" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c000099" bgcolor="#000099" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c333399" bgcolor="#333399" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c663366" bgcolor="#663366" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '   <tr>';
	    s = s + '    <td id="c000000" bgcolor="#000000" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c330000" bgcolor="#330000" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c663300" bgcolor="#663300" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c663333" bgcolor="#663333" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c333300" bgcolor="#333300" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c003300" bgcolor="#003300" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c003333" bgcolor="#003333" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c000066" bgcolor="#000066" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c330099" bgcolor="#330099" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '    <td id="c330033" bgcolor="#330033" width="15" height="15" onclick="str=this.id;color=str.replace(\'c\',\'#\');$$$('+this.resourceId+').setSelectedColor(color,\''+command+'\');$$$('+this.resourceId+').wysiwyg_pallete.style.display=\'none\';"><img width="1" height="1" alt="" src=""></td>';
	    s = s + '   </tr>';
	    s = s + '  </table>';    
	    return s;
	},
	setColor: function(data){
		this.bgColor = data;
		var nd = this.getCanvas();
		nd.style.background = this.bgColor;
	},
	getColor: function(){
		return this.bgColor;
	},
	block: function(){
	    var node = $(this.getFullId() + "_block");
		if (node != undefined)
			node.style.display = "";
	},
	setHeight: function(data){
		window.control_richTextArea.prototype.parent.setHeight.call(this, data);
		this.wysiwyg_content.style.height = data - (document.all ? 32: 30);	
	},
	setWidth: function(data){
		window.control_richTextArea.prototype.parent.setWidth.call(this, data);
		this.wysiwyg_content.style.width = data - (document.all? 5 : 3);	
	},
	unblock: function(){
	    var node = $(this.getFullId() + "_block");
	    if (node != undefined)
	        node.style.display = "none";
	},
	navigate: function(url){
		this.location = url;
		this.frame.src = url;
	},
	loadCss: function(){
		var rteImagePath = this.rteImagePath;
		this.cssText = [];
		this.cssText["rtedropdown1"] = "height:16px;font-family:Arial, Helvetica, sans-serif;padding-left:3px;padding-right:3px;font-size:11px;border:1px solid #FFFFFF;cursor:default;";
		this.cssText["rtedropdown2"] = "width:11px;background-image:url(" + rteImagePath + "bg.gif);border-top:1px solid #FFFFFF;border-right:1px solid #FFFFFF;border-bottom:1px solid #FFFFFF;cursor:default; " + (document.all && !window.opera ? "height:20px;":"height:16px;") ;
		this.cssText["rtedropdown4"] = "font-family:Arial, Helvetica, sans-serif;padding-left:3px;padding-right:3px;font-size:11px;border:1px solid #002D96;cursor:default;" + (document.all && !window.opera ? "line-height:18px;" : "height:16px;");
		this.cssText["rtedropdown5"] =  "background-image:url(" + rteImagePath + "bgover.gif);border-top:1px solid #000080;border-right:1px solid #000080;border-bottom:1px solid #000080;cursor:default;"+ (document.all && !window.opera ?	"height:20px;" : "height:16px;");
		this.cssText["rtedropdown5b"] = "background-image:url(" + rteImagePath + "bgover.gif);border-top:1px solid #000080;border-right:1px solid #000080;border-bottom:1px solid #000080;cursor:default;"+ (document.all && !window.opera ? "height:20px;" :"height:18px;");
		this.cssText["rtedropdown6"] = "width:11px;background-image:url("+ rteImagePath + "bgdown.gif);border-top:1px solid #000080;border-right:1px solid #000080;border-bottom:1px solid #000080;cursor:default;" + (document.all && !window.opera ? "height:20px;" :"height:16px;");
		this.cssText["rtedropdown7"] = "border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;";
		this.cssText["rtedropdown8"] = "background-image:url(" + rteImagePath + "bgover.gif);border:1px solid #002D96;cursor:default;";
		this.cssText["rtedropdown9"] = "background-image:url(" + rteImagePath + "bgdown.gif);border-top:1px solid #000080;border-right:1px solid #000080;border-bottom:1px solid #000080;cursor:default;";
		this.cssText["rtedropdown9b"] = "background-image:url(" + rteImagePath + "bgdown.gif);border-top:1px solid #000080;border-right:1px solid #000080;border-bottom:1px solid #000080;cursor:default;" + (document.all && !window.opera ? "height:21px;" : "height:18px;");
		this.cssText["rtedropdown10"] ="border:0px solid transparent;cursor:default;"; 
		this.cssText["rtedropdown11"] = "border-top:0px solid transparent;border-right:0px solid transparent;border-bottom:0px solid transparent;cursor:default;"; 
		this.cssText["rtedropdown11b"]= "border-top:0px solid transparent;border-right:0px solid transparent;border-bottom:0px solid transparent;cursor:default;height:18px;"; 
		this.cssText["rtedropdown12"] = "background-image:url(" + rteImagePath + "bgdown.gif);border:1px solid #000080;cursor:default;"; 
		this.cssText["rtedropdown13"] = "padding:1px;border:1px solid #FFFFFF;background-color:#FFFFFF;"; 
		this.cssText["rtedropdown14"] = "padding:1px;border:1px solid #000080;background-color:#FFEEC2;"; 
		this.cssText["rtebtn1"] = "display:block;width:21px;height:20px;padding-left:1px;background-image:url(" + rteImagePath + "bg.gif);"; 
		this.cssText["rtebtn2"] = "display:block;width:21px;height:20px;border:1px solid #000080;background-image:url(" + rteImagePath + "bgover.gif);"; 
		this.cssText["rtebtn3"] = "display:block;width:21px;height:20px;border:1px solid #000080;background-image:url(" + rteImagePath + "bgselect.gif);"; 
		this.cssText["rtebtn4"] = "display:block;width:21px;height:20px;border:1px solid #000080;background-image:url(" + rteImagePath + "bgdown.gif);";
		this.cssText["rtebtn5"] = "display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);"; 
		this.cssText["rtebtn6"] = "display:block;padding: 3px;cursor:default;"; 
		this.cssText["rtebtn7"] = "display:block;border:1px solid #000080;background-image:url(" + rteImagePath + "bgover.gif);cursor:default;padding: 2px;"; 
		this.cssText["rtebtn8"] = "display:block;border:1px solid #000080;background-image:url(" + rteImagePath + "bgselect.gif);cursor:default;padding: 2px;"; 
		this.cssText["rtebtn9"] = "display:block;border:1px solid #000080;background-image:url(" + rteImagePath + "bgdown.gif);cursor:default;padding: 2px;"; 
	},
	rteMouseOverFormatMenu: function (event, id, resId) {	
		if (id == this.getFullId() +"format1" || id == this.getFullId() +"format2"){	
			var target = $(this.getFullId()+"format1");
			target.style.cssText = "border :1px solid #002D96;height:16px;cursor:default;font-family:Arial, Helvetica, sans-serif;padding-left:3px;padding-right:3px;font-size:11px";		
			target = $(this.getFullId()+"format2");				
			target.style.cssText ="background-image:url(" + this.rteImagePath + "bgover.gif);border-top:1px solid #000080;border-right:1px solid #000080;border-bottom:1px solid #000080;cursor:default";										
		}else if (id == this.getFullId() +"_fontface1" || id == this.getFullId() +"_fontface2"){
			$(this.getFullId() + "_fontface1").style.cssText = this.cssText["rtedropdown4"]; 
			$(this.getFullId() + "_fontface1").style.width = "98px";
			$(this.getFullId() + "_fontface2").style.cssText = this.cssText["rtedropdown5"];
		}else if (id == this.getFullId() +"_fontsize1" || id == this.getFullId() +"_fontsize2"){
			$(this.getFullId() +"_fontsize1").style.cssText = this.cssText["rtedropdown4"]; 
			$(this.getFullId() +"_fontsize2").style.cssText = this.cssText["rtedropdown5"];
		}else if (id == this.getFullId() +"_fontcolor1" || id == this.getFullId() +"_fontcolor2"){
			$(this.getFullId() +"_fontcolor1").style.cssText = this.cssText["rtedropdown8"]; 
			$(this.getFullId() +"_fontcolor2").style.cssText = this.cssText["rtedropdown5b"];
		}else if (id != ""){
			var target = $(id);			
			if (target.className == "rtebtn3")
					target.style.cssText = this.cssText["rtebtn3"];							
			else target.style.cssText = this.cssText["rtebtn2"];				
		}
	},
	rteMouseDownFormatMenu: function (event, id) { 	
		try{		
			this.rteHideMenus(event,id); 		
			if (id == this.getFullId() +"format1" || id == this.getFullId() +"format2"){	
				$(this.getFullId() +"format1").style.cssText = this.cssText["rtedropdown4"]; 
				$(this.getFullId() +"format2").style.cssText = this.cssText["rtedropdown6"]; 
				$(this.getFullId() +"format3").style.left = this.rteGetOffsetLeft($(this.getFullId() +"format1")); 
				$(this.getFullId() +"format3").style.top = this.rteGetOffsetTop($(this.getFullId() +"format1")) + $(this.getFullId() +"format1").offsetHeight; 			
				$(this.getFullId() +"format3").style.display = ($(this.getFullId() + "format3").style.display == "none" ) ? "" : "none"; 
			}else if (id == this.getFullId() +"_fontface1" || id == this.getFullId() +"_fontface2"){	
				$(this.getFullId() + "_fontface1").style.cssText = this.cssText["rtedropdown4"]; 			
				$(this.getFullId() + "_fontface1").style.width = "98px";
				$(this.getFullId() + "_fontface2").style.cssText = this.cssText["rtedropdown6"]; 
				$(this.getFullId() + "_fontface3").style.left = this.rteGetOffsetLeft($(this.getFullId() + "_fontface1")); 
				$(this.getFullId() + "_fontface3").style.top = this.rteGetOffsetTop($(this.getFullId() + "_fontface1")) + $(this.getFullId() + "_fontface1").offsetHeight; 
				$(this.getFullId() + "_fontface3").style.display = ($(this.getFullId() + "_fontface3").style.display == "none" ) ? "" : "none"; 
			}else if (id == this.getFullId() +"_fontsize1" || id == this.getFullId() +"_fontsize2"){	
				$(this.getFullId() +"_fontsize1").style.cssText = this.cssText["rtedropdown4"]; 
				$(this.getFullId() +"_fontsize2").style.cssText = this.cssText["rtedropdown6"]; 
				$(this.getFullId() +"_fontsize3").style.left = this.rteGetOffsetLeft($(this.getFullId() +"_fontsize1")); 
				$(this.getFullId() +"_fontsize3").style.top = this.rteGetOffsetTop($(this.getFullId() +"_fontsize1")) + $(this.getFullId() +"_fontsize1").offsetHeight; 
				$(this.getFullId() +"_fontsize3").style.display = ($(this.getFullId() +"_fontsize3").style.display == "none" ) ? "" : "none"; 
			}else if (id == this.getFullId() +"_fontcolor1" || id == this.getFullId() +"_fontcolor2"){	
				$(this.getFullId() +"_fontcolor1").style.cssText = this.cssText["rtedropdown12"]; 
				$(this.getFullId() +"_fontcolor2").style.cssText = this.cssText["rtedropdown9b"]; 
				$(this.getFullId() +"_fontcolor3").style.left = this.rteGetOffsetLeft($(this.getFullId() +"_fontcolor1")); 
				$(this.getFullId() +"_fontcolor3").style.top = this.rteGetOffsetTop($(this.getFullId() +"_fontcolor1")) + $(this.getFullId() +"_fontcolor1").offsetHeight; 
				$(this.getFullId() +"_fontcolor3").style.display = ($(this.getFullId() +"_fontcolor3").style.display == "none" ) ? "" : "none"; 
			}else {
				//var target = document.all ? event.srcElement:event.target;			
				var target = $(id);			
				target.style.cssText = this.cssText["rtebtn4"];							
			}
		}catch(e){
			alert(e);
		}
	},
	rteMouseOutFormatMenu: function(event, id) { 			
		if (id == this.getFullId() +"format1" || id == this.getFullId() +"format2"){		
			target = $(this.getFullId()+"format1");
			target.style.cssText = "border:1px solid #FFFFFF;cursor:default;font-family:Arial, Helvetica, sans-serif;padding-left:3px;padding-right:3px;font-size:11px;height:16px";					
			target = $(this.getFullId()+"format2");		
			target.style.cssText = "background-image:url(" + this.rteImagePath + "bg.gif);cursor:default;font-family:Arial, Helvetica, sans-serif;border-top:1px solid #FFFFFF;border-right:1px solid #FFFFFF;border-bottom:1px solid #FFFFFF;width:11px;height:16px;";				
		}else if (id == this.getFullId() +"_fontface1" || id == this.getFullId() +"_fontface2"){		
			$(this.getFullId() + "_fontface1").style.cssText = this.cssText["rtedropdown1"]; 
			$(this.getFullId() + "_fontface1").style.width = "98px";
			$(this.getFullId() + "_fontface2").style.cssText = this.cssText["rtedropdown2"];
		}else if (id == this.getFullId() +"_fontsize1" || id == this.getFullId() +"_fontsize2"){		
			$(this.getFullId() +"_fontsize1").style.cssText = this.cssText["rtedropdown1"]; 
			$(this.getFullId() +"_fontsize2").style.cssText = this.cssText["rtedropdown2"];
		}else if (id == this.getFullId() +"_fontcolor1" || id == this.getFullId() +"_fontcolor2"){
			$(this.getFullId() +"_fontcolor1").style.cssText = this.cssText["rtedropdown10"]; 
			$(this.getFullId() +"_fontcolor2").style.cssText = this.cssText["rtedropdown11b"];
		}else if (id != ""){
		
			var target = $(id);
			if (target.className == "rtebtn3")
				target.style.cssText = this.cssText["rtebtn3"];							
			else { 
				target.style.cssText = this.cssText["rtebtn1"];						
				target.className = "rtebtn1";
			}
		}		
	},
	rteHideMenus: function (event,id) { 
		//this.rteMouseOutFormatMenu(event, id); 
		if (id != this.getFullId() + "format1" && id != this.getFullId() + "format2")
			$(this.getFullId() + "format3").style.display = "none"; 
		//this.rteMouseOutFontFaceMenu(); 
		if (id != this.getFullId() + "_fontface1" && id != this.getFullId() + "_fontface2")
			$(this.getFullId()+ "_fontface3").style.display = "none"; 	
		//this.rteMouseOutFontColorMenu(); 	
		if (id != this.getFullId() + "_fontsize1" && id != this.getFullId() + "_fontsize2")
			$(this.getFullId()+"_fontsize3").style.display = "none";
			
		if (id != this.getFullId() + "_fontcolor1" && id != this.getFullId() + "_fontcolor2")
			$(this.getFullId()+"_fontcolor3").style.display = "none";
	},
	rteColorClick: function (hexcolor) { 
		this.rteHideMenus(); 
		this.doTextFormat("forecolor", hexcolor); 
		$(this.getFullId() + "_fontcolor4").style.backgroundColor = hexcolor;
	},
	rteMouseOverMenuContents: function (event) { 	
		var target = document.all ? event.srcElement : event.target;
		target.style.color = "#FFFFFF"; 
		target.style.backgroundColor = "#316AC5"; 	
		//$(this.rteName).contentWindow.setFocus();
	}, 
	rteMouseOutMenuContents: function (event) { 
		var target = document.all ? event.srcElement : event.target;
		target.style.color = "#000000"; 
		target.style.backgroundColor = "#FFFFFF";	
	},
	rteMouseDownMenuContents: function (event) { 
		try{
			var target = document.all ? event.srcElement : event.target;
			var id = this.getFullId();
			var rteName = id + "_input";
			if (target.innerHTML == "Header 1") { 
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<h1>"); 
				$(id + "format1").innerHTML = "Header 1";
			} else if (target.innerHTML == "Header 2") { 
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<h2>"); 
				$(id + "format1").innerHTML = "Header 2";
			} else if (target.innerHTML == "Header 3") { 
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<h3>"); 
				$(id + "format1").innerHTML = "Header 3";
			} else if (target.innerHTML == "Header 4") { 
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<h4>"); 
				$(id + "format1").innerHTML = "Header 4";
			} else if (target.innerHTML == "Header 5") { 
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<h5>"); 
				$(id + "format1").innerHTML = "Header 5";
			} else if (target.innerHTML == "Header 6") { 	
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<h6>"); 
				$(id + "format1").innerHTML = "Header 6";
			} else if (target.innerHTML == "Paragraph") { 
				$(rteName).contentWindow.document.execCommand("formatblock", false, "<p>"); 
				$(id + "format1").innerHTML = "Paragraph";
			} else if (target.innerHTML == "Arial") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "arial"); 
				$(id + "_fontface1").innerHTML = "Arial";
			} else if (target.innerHTML == "Arial Black") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "arial black"); 
				$(id + "_fontface1").innerHTML = "Arial Black";
			} else if (target.innerHTML == "Arial Narrow") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "arial narrow"); 
				$(id + "_fontface1").innerHTML = "Arial Narrow";
			} else if (target.innerHTML == "Courier New") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "courier new"); 
				$(id + "_fontface1").innerHTML = "Courier New";
			} else if (target.innerHTML == "Century Gothic") { 	
				$(rteName).contentWindow.document.execCommand("fontname", false, "century gothic"); 
				$(id + "_fontface1").innerHTML = "Century Gothic";
			} else if (target.innerHTML == "Comic Sans MS") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "comic sans ms"); 
				$(id + "_fontface1").innerHTML = "Comic Sans MS";
			} else if (target.innerHTML == "Impact") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "impact"); 
				$(id + "_fontface1").innerHTML = "Impact";
			} else if (target.innerHTML == "Tahoma") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "tahoma"); 
				$(id + "_fontface1").innerHTML = "Tahoma";
			} else if (target.innerHTML == "Times New Roman") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "times new roman"); 
				$(id + "_fontface1").innerHTML = "Times New Roman";
			} else if (target.innerHTML == "Trebuchet MS") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "trebuchet ms"); 
				$(id + "_fontface1").innerHTML = "Trebuchet MS";
			} else if (target.innerHTML == "Verdana") { 
				$(rteName).contentWindow.document.execCommand("fontname", false, "verdana"); 
				$(id + "_fontface1").innerHTML = "Verdana";
			} else if (target.innerHTML == "1") { 
				$(rteName).contentWindow.document.execCommand("fontsize", false, "1"); 
				$(id + "_fontsize1").innerHTML = "1";
			} else if (target.innerHTML == "2") { 
				$(rteName).contentWindow.document.execCommand("fontsize", false, "2"); 
				$(id + "_fontsize1").innerHTML = "2";
			} else if (target.innerHTML == "3") { 
				$(rteName).contentWindow.document.execCommand("fontsize", false, "3"); 
				$(id + "_fontsize1").innerHTML = "3";
			} else if (target.innerHTML == "4") { 
				$(rteName).contentWindow.document.execCommand("fontsize", false, "4"); 
				$(id + "_fontsize1").innerHTML = "4";
			} else if (target.innerHTML == "5") { 	
				$(rteName).contentWindow.document.execCommand("fontsize", false, "5"); 
				$(id + "_fontsize1").innerHTML = "5";
			} else if (target.innerHTML == "6") { 
				$(rteName).contentWindow.document.execCommand("fontsize", false, "6"); 
				$(id + "_fontsize1").innerHTML = "6";
			} else if (target.innerHTML == "7") { 
				$(rteName).contentWindow.document.execCommand("fontsize", false, "7"); 
				$(id + "_fontsize1").innerHTML = "7";
			}		
			target.style.color = "#000000"; 
			target.style.backgroundColor = "#FFFFFF"; 
			this.rteHideMenus();
			if (document.all)
				$(this.rteName).contentWindow.document.focus();
			else
				$(this.rteName).contentWindow.focus();
		}catch(e){
			alert(e);
		}
	},
	rteGetOffsetTop: function (elm) { 
		var mOffsetTop = elm.offsetTop; 
		var mOffsetParent = elm.offsetParent; 
		while(mOffsetParent && mOffsetParent != this.getCanvas()) { 
			mOffsetTop += mOffsetParent.offsetTop; 
			mOffsetParent = mOffsetParent.offsetParent;
		}
		return mOffsetTop;
	},
	rteGetOffsetLeft: function (elm) { 
		var mOffsetLeft = elm.offsetLeft; 
		var mOffsetParent = elm.offsetParent; 
		while(mOffsetParent && mOffsetParent != this.getCanvas()) { 
			mOffsetLeft += mOffsetParent.offsetLeft; 
			mOffsetParent = mOffsetParent.offsetParent;
		}
		return mOffsetLeft;
	},
	rteAction: function (event, id) { 	
		var tmpid = id;	
		var target = $(id);
		this.rteHideMenus(); 		
		id = id.substring(id.lastIndexOf("_") + 1);
		if (id != "editlink" && id != "insertflash"&& id != "edittable" && id != "createlink" && id != "insertimage" && id != "inserttable" && id != "insertrowbelow" && id != "insertrowabove" && id != "insertcolumnleft" && id != "insertcolumnright" && this.id != "deletecolumn" && this.id != "deleterow" && this.id != "insertform" && this.id != "form_checkbox" && this.id != "form_radio" && this.id != "form_dropdown" && this.id != "form_textarea" && this.id != "form_submit" && id != "form_image_submit" && id != "form_reset" && id != "form_hidden" && id != "form_password" && id != "form_textfield" && id != "spellcheck" && id != "printrte" && id != "aboutrte") { 				
			this.doTextFormat(id); 
			//alert(target.className);
			if (id == "inserthorizontalrule" || id == "justifyleft" || id == "justifyright" ||  id == "justifyfull" || id == "justifycenter" || id == "undo" || id == "redo" || id == "cut" || id == "paste" || id == "copy" || id == "unlink" || id == "insertimage" )
				target.className = "rtebtn3"; 
			
			if (target.className == "rtebtn3"){		
				target.style.cssText = this.cssText["rtebtn1"];
				target.className = "rtebtn1";
			}else{
				target.style.cssText = this.cssText["rtebtn3"]; 
				target.className = "rtebtn3";
			}		
			//$(id).nmouseout = rteBtnMouseDown; 
			
			$(this.rteName).contentWindow.focus();
		}
	},
	rteFormHandler: function () { 
		try{
			if (document.all){
				return this.wysiwyg_content.contentWindow.document.body.innerText;	
			}else {
				var html = this.wysiwyg_content.contentWindow.document.body.ownerDocument.createRange();
				html.selectNodeContents(this.wysiwyg_content.contentWindow.document.body);
				return html.toString();
			}		
		}catch(e){
			alert(e);
		}
	},
	setText: function (html) { 
		if ($(this.rteFormName).style.display == ""){ 
			$(this.rteFormName).value = html;
		}else{ 
			$(this.rteName).contentWindow.document.body.innerHTML = html;
		}	
	},
	rteFormHandler2: function () { 
		if ($(this.rteFormName).style.display == ""){ 
			var newHTML = $(this.rteFormName).value;
		}else{ 
			var newHTML = $(this.rteName).contentWindow.document.body.innerHTML;
		}	
		var pat = '<input id="param1" name="param1" value="'+this.resourceId+'" type="hidden">';				   	
		newHTML = newHTML.replace(pat,"");						 	
		pattern = /<form[^>]*>[^<]*<\/form>/gi; 
		matchesArray = newHTML.match(pattern); 
		if (matchesArray != null){ 
			for (i=0; i<matchesArray.length; i++){ 
				replacement = matchesArray[i]; 
				replacement = replacement.replace(matchesArray[i], "<div style=\"border: 1px dotted red;\">" + matchesArray[i] + "</div>"); 
				if ($(this.rteFormName).style.display == ""){ 
					newHTML = $(this.rteFormName).value.replace(matchesArray[i], replacement);
				}else{ 
					newHTML = $(this.rteName).contentWindow.document.body.innerHTML.replace(matchesArray[i], replacement);
				}
			}
		}
		pattern = /<table[^>]*border=\"0\"[^>]*>/gi; 
		matchesArray = newHTML.match(pattern); 
		if (matchesArray != null){ 
			for (i=0; i<matchesArray.length; i++){ 
				pattern2 = /border=\"0\"/gi; 
				replacement = matchesArray[i]; 
				replacement = replacement.replace(pattern2, "border=\"0\" class=\"rte_tbl\""); 
				newHTML = newHTML.replace(matchesArray[i], replacement);
			}
		}
		return newHTML;
	},
	hideHeader: function(){
		var header = $(this.getFullId() +"_header");
		if (header !== undefined) header.style.display = "none";
		this.wysiwyg_content.style.top = 0;
		this.wysiwyg_content.style.height = this.height;
	},
	showHeader: function(){
		var header = $(this.getFullId() +"_header");
		if (header !== undefined) header.style.display = "";
		this.wysiwyg_content.style.top = 30;
		this.wysiwyg_content.style.height = this.height - 30;
	}
});	
