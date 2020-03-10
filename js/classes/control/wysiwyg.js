//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_wysiwyg = function(owner, options)
{
    if (owner)
    {        
		window.control_wysiwyg.prototype.parent.constructor.call(this, owner, options);		
        this.className = "control_wysiwyg";
        this.owner = owner;		
		this.onKeyPress = new control_eventHandler();
		this.onKeyDown	= new control_eventHandler();		
		this.withForm = false;
		if (options){
			if (typeof options.withForm == "boolean") this.setWithForm(options.withForm);
		}
    }
};
window.control_wysiwyg.extend(window.control_control);
window.wysiwyg = window.control_wysiwyg;
//---------------------------- Function ----------------------------------------
window.control_wysiwyg.prototype.doSerialize = function()
{
    window.control_wysiwyg.prototype.parent.doSerialize.call(this);    
};
window.control_wysiwyg.prototype.doDraw = function(canvas)
{
	this.id = this.getFullId();
	var n = this.getFullId();
	var rteImagePath = "icon/wysiwyg/";	
	this.rteImagePath = rteImagePath;
    if (document.all)
        var html =  "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
						"<div style='{position: relative; left: 0; top: 0; width: 100%; height: auto;background:#C3DAF9}' >" +
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
								"<tr><td bgcolor='#C3DAF9'>"+
									"<table cellpadding='0' cellspacing='0' id='"+ n +"_tb2' onmousedown='return false;'><tr>"+
										"<td width='7'><img src='" + rteImagePath + "start.gif' width='7' height='25' /></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><img src='" + rteImagePath + "blank.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><div name='"+ n +"_tool' id='"+ n +"_createlink' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Hyperlink'><a href='javascript:rteBtnCreateLink();' style='cursor:default;'><img src='" + rteImagePath + "insertlink.gif' border='0'></a></div><div style='display:none;' id='"+ n +"_editlink' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Edit Hyperlink'><a href='javascript:rteBtnEditLink();' style='cursor:default;'><img src='" + rteImagePath + "insertlink.gif' border='0'></a></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Remove Hyperlink'><div name='"+ n +"_tool' id='"+ n +"_unlink' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "unlink.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_rtesep5'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Insert Image'><div name='"+ n +"_tool' id='"+ n +"_insertimage' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><a href='javascript:rteBtnInsertImage();' style='cursor:default;'><img src='" + rteImagePath + "insertimage.gif' border='0'></a></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Remove Formatting'><div name='"+ n +"_tool' id='"+ n +"_removeformat' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "format.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep6'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='tables'>"+
											"<table border='0' width='0' cellspacing='0' cellpadding='0' id='"+ n +"_table_options_on' style='display:none;'><tr>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_inserttable' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Table'><a href='javascript:rteBtnInsertTable();' style='cursor:default;'><img src='" + rteImagePath + "inserttable.gif' border='0'></a></div><div id='"+ n +"_edittable' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'title='Edit Table Properties'><a href='javascript:rteBtnEditTable();' style='cursor:default;'><img src='"+ rteImagePath + "inserttable.gif' border='0'></a></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertcolumnleft' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Column to the left'><img src='"+ rteImagePath + "insertcolumnleft.gif' onClick='rteBtnInsertTableColumnBefore();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertcolumnright' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'  title='Insert Column to the right'><img src='" + rteImagePath + "insertcolumnright.gif' onClick='rteBtnInsertTableColumnAfter();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertrowabove' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'  title='Insert Row above'><img src='" + rteImagePath + "insertrowabove.gif' onClick='rteBtnInsertTableRowBefore();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertrowbelow' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Row below'><img src='" + rteImagePath + "insertrowbelow.gif' onClick='rteBtnInsertTableRowAfter();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_deletecolumn' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current column'><img src='"+ rteImagePath + "deletecolumn.gif' onClick='rteBtnDeleteTableColumn();'></div></td>"+
											"</tr></table>"+
											"<table border='0' width='0' cellspacing='0' cellpadding='0' id='table_options_off'><tr>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_inserttable' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Table'><a href='javascript:rteBtnInsertTable();' style='cursor:default;'><img src='" + rteImagePath + "inserttable.gif' border='0'></div></a></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Column to the left'><img src='" + rteImagePath + "insertcolumnleftgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Column to the right'><img src='" + rteImagePath + "insertcolumnrightgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Row above'><img src='" + rteImagePath + "insertrowabovegrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Row below'><img src='" + rteImagePath + "insertrowbelowgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current column'><img src='" + rteImagePath + "deletecolumngrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current row'><img src='" + rteImagePath + "deleterowgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current row'><img src='" + rteImagePath + "deleterowgrey.gif'></div></td>"+
											"</tr></table>"+									
										"</td>"+																									
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep7'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Numbering'><div name='"+ n +"_tool' id='"+ n +"_insertorderedlist' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "orderedlist.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Bullets'><div name='"+ n +"_tool' id='"+ n + "_insertunorderedlist' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "unorderedlist.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Decrease Indent'><div name='"+ n +"_tool' id='"+ n +"_outdent' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "decreaseindent.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Increase Indent'><div name='"+ n +"_tool' id='"+ n +"_indent' class='rtebtn1'><img src='" + rteImagePath + "increaseindent.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep8'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Undo'><div name='"+ n +"_tool' id='"+ n +"_undo' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "undo.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Redo'><div name='"+ n +"_tool' id='"+ n +"_redo' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "redo.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep9'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_cutcopypaste'>"+
											"<table border='0' width='0' cellspacing='0' cellpadding='0'><tr>"+
												"<td title='Cut'><div name='"+ n +"_tool' id='"+ n +"_cut' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "cut.gif'></div></td>"+
												"<td title='Copy'><div name='"+ n +"_tool' id='"+ n +"_copy' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "copy.gif'></div></td>"+
												"<td title='Paste'><div name='"+ n +"_tool' id='"+ n + "_paste' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "paste.gif'></div></td>"+
											"</tr></table>"+
										"</td>"+
										"<td width='14'><img src='" + rteImagePath + "finish.gif' width='14' height='25' /></td>"+
										"<td width='100%'></td>"+
									"</tr></table>"+
								"</td></tr>"+
								"<tr><td bgcolor='#C3DAF9'>"+
									"<table cellpadding='0' cellspacing='0' id='tb3' onmousedown='return false;'><tr>"+
										"<td width='7'><img src='" + rteImagePath + "start.gif' width='7' height='25' /></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Form'><a href='javascript:rteBtnInsertForm();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"_insertform' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='"+ rteImagePath + "form.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Check Box'><a href='javascript:rteBtnInsertCheckbox();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_checkbox' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "checkbox.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Radio Button'><a href='javascript:rteBtnInsertRadio();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_radio' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "radio.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Text Area'><a href='javascript:rteBtnInsertTextArea();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_textarea' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "textarea.gif' border='0'></div></a></td>"+										
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Submit Button'><a href='javascript:rteBtnInsertSubmit();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_submit' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "submit.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Image Button'><a href='javascript:rteBtnInsertImageSubmit();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_image_submit' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "imagesubmit.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Reset Button'><a href='javascript:rteBtnInsertReset();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_reset' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "reset.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Hidden Field'><a href='javascript:rteBtnInsertHidden();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_hidden' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "hidden.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Password Field'><a href='javascript:rteBtnInsertPassword();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_password' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' ><img src='" + rteImagePath + "password.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Text Field'><a href='javascript:rteBtnInsertText();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_textfield' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "textfield.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_rtesep10'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Print'><div name='"+ n +"_tool' id='"+ n +"_printrte' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "print.gif' onClick='rteBtnPrint();'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Select All'><div name='"+ n +"_tool' id='selectall' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "selectall.gif'></div></td>"+
										"<td id='"+ n +"_spellchecker' class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Spell Check'><div name='"+ n +"_tool' id='"+ n +"_spellcheck' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "spellcheckgrey.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep11'><img src='" + rteImagePath + "seperator.gif'></td>"+	
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='About Free Rich Text Editor'><a href='javascript:rteAbout();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"_aboutrte' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "about.gif' border='0'></div></a></td>"+
										"<td width='14'><img src='" + rteImagePath + "finish.gif' width='14' height='25' /></td>"+
										"<td width='100%'></td>"+
									"</tr></table>"+									
								"</td>"+
								"</tr>"+
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
						"<div style='{position: relative; left: 0; width: 100%; height: 100%;}' >" +
							"<textarea id='" + n + "_hidden' style='{display:none;position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' "+					
							"></textarea>"+				
							"<iframe id='" + n + "_frame'  frameborder='0' style='{margin-left: 3px; background-color: white; color: black; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' "+					
							"></iframe>"+
							"<iframe id='preview_" + n + "_frame' frameborder='0'  style='{margin-left: 3px; background-color: white; color: black; position: absolute; left: 0; top: 0; width: 100%; height: 100%;display:none}' "+					
							"></iframe>"+
							"<div id='" + n + "_block' style='{background: url(icon/"+system.getThemes()+"/background.png) left top; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+						
						"</div>"+
						"<div style='{position: relative; left: 0; width: 100%; height: 25;background:url(" + rteImagePath + "bg.gif)}' >" +
						"</div>"+
					"</div>"+
				"<div id='"+ n +"_pallete' style='border:2px solid #ff9900;background:#eeeeee; position:absolute; top:0;left:0;height:120;width:172;display:none;'></div>";
    else
        var html =  "<div style='{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' >" +
						"<div style='{position: relative; left: 0; top: 0; width: 100%; height: auto;background:#C3DAF9}' >" +
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
								"<tr><td bgcolor='#C3DAF9'>"+
									"<table cellpadding='0' cellspacing='0' id='"+ n +"_tb2' onmousedown='return false;'><tr>"+
										"<td width='7'><img src='" + rteImagePath + "start.gif' width='7' height='25' /></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><img src='" + rteImagePath + "blank.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;'><div name='"+ n +"_tool' id='"+ n +"_createlink' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Hyperlink'><a href='javascript:rteBtnCreateLink();' style='cursor:default;'><img src='" + rteImagePath + "insertlink.gif' border='0'></a></div><div style='display:none;' id='"+ n +"_editlink' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Edit Hyperlink'><a href='javascript:rteBtnEditLink();' style='cursor:default;'><img src='" + rteImagePath + "insertlink.gif' border='0'></a></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Remove Hyperlink'><div name='"+ n +"_tool' id='"+ n +"_unlink' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "unlink.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_rtesep5'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Insert Image'><div name='"+ n +"_tool' id='"+ n +"_insertimage' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><a href='javascript:rteBtnInsertImage();' style='cursor:default;'><img src='" + rteImagePath + "insertimage.gif' border='0'></a></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Remove Formatting'><div name='"+ n +"_tool' id='"+ n +"_removeformat' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "format.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep6'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='tables'>"+
											"<table border='0' width='0' cellspacing='0' cellpadding='0' id='"+ n +"_table_options_on' style='display:none;'><tr>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_inserttable' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Table'><a href='javascript:rteBtnInsertTable();' style='cursor:default;'><img src='" + rteImagePath + "inserttable.gif' border='0'></a></div><div id='"+ n +"_edittable' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'title='Edit Table Properties'><a href='javascript:rteBtnEditTable();' style='cursor:default;'><img src='"+ rteImagePath + "inserttable.gif' border='0'></a></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertcolumnleft' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Column to the left'><img src='"+ rteImagePath + "insertcolumnleft.gif' onClick='rteBtnInsertTableColumnBefore();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertcolumnright' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'  title='Insert Column to the right'><img src='" + rteImagePath + "insertcolumnright.gif' onClick='rteBtnInsertTableColumnAfter();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertrowabove' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'  title='Insert Row above'><img src='" + rteImagePath + "insertrowabove.gif' onClick='rteBtnInsertTableRowBefore();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_insertrowbelow' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Row below'><img src='" + rteImagePath + "insertrowbelow.gif' onClick='rteBtnInsertTableRowAfter();'></div></td>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_deletecolumn' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current column'><img src='"+ rteImagePath + "deletecolumn.gif' onClick='rteBtnDeleteTableColumn();'></div></td>"+
											"</tr></table>"+
											"<table border='0' width='0' cellspacing='0' cellpadding='0' id='table_options_off'><tr>"+
												"<td><div name='"+ n +"_tool' id='"+ n +"_inserttable' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Table'><a href='javascript:rteBtnInsertTable();' style='cursor:default;'><img src='" + rteImagePath + "inserttable.gif' border='0'></div></a></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Column to the left'><img src='" + rteImagePath + "insertcolumnleftgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Column to the right'><img src='" + rteImagePath + "insertcolumnrightgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Row above'><img src='" + rteImagePath + "insertrowabovegrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Insert Row below'><img src='" + rteImagePath + "insertrowbelowgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current column'><img src='" + rteImagePath + "deletecolumngrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current row'><img src='" + rteImagePath + "deleterowgrey.gif'></div></td>"+
												"<td><div name='"+ n +"_tool' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' title='Delete Current row'><img src='" + rteImagePath + "deleterowgrey.gif'></div></td>"+
											"</tr></table>"+									
										"</td>"+																									
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep7'><img src='" + rteImagePath + "seperator.gif'></td>"+
										
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Numbering'>"+
											//<div name='"+ n +"_tool' id='"+ n +"_insertorderedlist' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "orderedlist.gif'></div>
											"<table width='100%' cellpadding='0' cellspacing='0' class='rtebtn1'  title='Numbering'><tr>"+
												" <td><div unselectable='on' name='"+ n +"_tool' id='"+ n +"_insertorderedlist' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "orderedlist.gif'></div></td>"+
												" <td><div unselectable='on' name='"+ n +"_tool' id='"+ n +"_rtedropdown15' style='display:block;width:11px;height:21px;padding:1px;background-image:url(" + rteImagePath + "bg.gif);cursor:default'><img src='" + rteImagePath + "arrow.gif' width='11' height='16'></div></td>"+
											"</tr></table>"+
										"</td>"+
										
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Bullets'>"+											
											"<table width='100%' cellpadding='0' cellspacing='0' class='rtebtn1'  title='Bullets'><tr>"+
												" <td><div name='"+ n +"_tool' id='"+ n + "_insertunorderedlist' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "unorderedlist.gif'></div></td>"+
												" <td><div unselectable='on' name='"+ n +"_tool' id='"+ n +"_rtedropdown16' style='display:block;width:11px;height:21px;padding:1px;background-image:url(" + rteImagePath + "bg.gif);cursor:default'><img src='" + rteImagePath + "arrow.gif' width='11' height='16'></div></td>"+
											"</tr></table>"+
										"</td>"+
										
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Decrease Indent'><div name='"+ n +"_tool' id='"+ n +"_outdent' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "decreaseindent.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Increase Indent'><div name='"+ n +"_tool' id='"+ n +"_indent' class='rtebtn1'><img src='" + rteImagePath + "increaseindent.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep8'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Undo'><div name='"+ n +"_tool' id='"+ n +"_undo' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "undo.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Redo'><div name='"+ n +"_tool' id='"+ n +"_redo' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "redo.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep9'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_cutcopypaste'>"+
											"<table border='0' width='0' cellspacing='0' cellpadding='0'><tr>"+
												"<td title='Cut'><div name='"+ n +"_tool' id='"+ n +"_cut' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "cut.gif'></div></td>"+
												"<td title='Copy'><div name='"+ n +"_tool' id='"+ n +"_copy' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "copy.gif'></div></td>"+
												"<td title='Paste'><div name='"+ n +"_tool' id='"+ n + "_paste' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "paste.gif'></div></td>"+
											"</tr></table>"+
										"</td>"+
										"<td width='14'><img src='" + rteImagePath + "finish.gif' width='14' height='25' /></td>"+
										"<td width='100%'></td>"+
									"</tr></table>"+
								"</td></tr>"+ 
								"<tr id='"+ n +" _toolbarForm' ><td bgcolor='#C3DAF9'>"+
									"<table cellpadding='0' cellspacing='0' id='tb3' onmousedown='return false;'><tr>"+
										"<td width='7'><img src='" + rteImagePath + "start.gif' width='7' height='25' /></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Form'><a href='javascript:rteBtnInsertForm();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"_insertform' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='"+ rteImagePath + "form.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Check Box'><a href='javascript:rteBtnInsertCheckbox();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_checkbox' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "checkbox.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Radio Button'><a href='javascript:rteBtnInsertRadio();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_radio' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "radio.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Text Area'><a href='javascript:rteBtnInsertTextArea();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_textarea' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "textarea.gif' border='0'></div></a></td>"+										
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Submit Button'><a href='javascript:rteBtnInsertSubmit();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_submit' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "submit.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Image Button'><a href='javascript:rteBtnInsertImageSubmit();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_image_submit' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "imagesubmit.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Reset Button'><a href='javascript:rteBtnInsertReset();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_reset' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "reset.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Hidden Field'><a href='javascript:rteBtnInsertHidden();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_hidden' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "hidden.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Password Field'><a href='javascript:rteBtnInsertPassword();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_password' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);' ><img src='" + rteImagePath + "password.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Text Field'><a href='javascript:rteBtnInsertText();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"form_textfield' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "textfield.gif' border='0'></div></a></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='"+ n +"_rtesep10'><img src='" + rteImagePath + "seperator.gif'></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Print'><div name='"+ n +"_tool' id='"+ n +"_printrte' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "print.gif' onClick='rteBtnPrint();'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Select All'><div name='"+ n +"_tool' id='selectall' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "selectall.gif'></div></td>"+
										"<td id='"+ n +"_spellchecker' class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='Spell Check'><div name='"+ n +"_tool' id='"+ n +"_spellcheck' class='rtebtn5' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "spellcheckgrey.gif'></div></td>"+
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' id='rtesep11'><img src='" + rteImagePath + "seperator.gif'></td>"+	
										"<td class='rtebg' style='background-image:url(" + rteImagePath + "bg.gif);font-family:Arial, Helvetica, sans-serif;font-size:10px;' title='About Free Rich Text Editor'><a href='javascript:rteAbout();' style='cursor:default;'><div name='"+ n +"_tool' id='"+ n +"_aboutrte' class='rtebtn1' style='display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'><img src='" + rteImagePath + "about.gif' border='0'></div></a></td>"+
										"<td width='14'><img src='" + rteImagePath + "finish.gif' width='14' height='25' /></td>"+
										"<td width='100%'></td>"+
									"</tr>"+
									"</table>"+									
								"</td>"+
								"</tr>"+
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
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:1px;padding:5px;'>1</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:10px;padding:5px;'>2</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>3</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:13px;padding:5px;'>4</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:17px;padding:5px;'>5</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:23px;padding:5px;'>6</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_fontsize' style='font-family:arial;color:#000000;font-size:35px;padding:5px;'>7</div>"+
						"</div>"+
						"<div id='"+ n +"_orderedlistfrm' class='rtedropdown7' style='width:100;position:absolute;display:none;border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;z-index:10'>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_orderedlistd' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>1</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_orderedlistla' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>a</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_orderedlistlg' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>A</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_orderedlistlr' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>i</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_orderedlistua' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>I</div>"+							
						"</div>"+
						"<div id='"+ n +"_unorderedlistfrm' class='rtedropdown7' style='width:100;position:absolute;display:none;border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;z-index:10'>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_unorderedlistd' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>Default</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_unorderedlistcr' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>Circle</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_unorderedlistdi' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>Disc</div>"+
							"<div name='"+ n +"format' unselectable='on' id='"+ n +"_unorderedlistsq' style='font-family:arial;color:#000000;font-size:12px;padding:5px;'>Square</div>"+							
						"</div>"+
						"<div id='"+ n +"_fontcolor3' class='rtedropdown7' style='position:absolute;display:none;border:1px solid #002D96;background-color:#FFFFFF;font-family:Arial, Helvetica, sans-serif;cursor:default;z-index:10'>"+
							this._get_palette_html("forecolor")+
						"</div>"+
						"<div style='{position: relative; left: 0; width: 100%; height: 100%;}' >" +
							"<textarea id='" + n + "_hidden' style='{display:none;position: absolute; left: 0; top: 0; width: 100%; height: 100%;}' "+					
							"></textarea>"+				
							"<iframe id='" + n + "_frame'  frameborder='0' style='{margin-left: 3px; background-color: white; color: black; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' "+					
							"></iframe>"+
							"<iframe id='preview_" + n + "_frame' frameborder='0'  style='{margin-left: 3px; background-color: white; color: black; position: absolute; left: 0; top: 0; width: 100%; height: 100%;display:none}' "+					
							"></iframe>"+
							"<div id='" + n + "_block' style='{background: url(icon/"+system.getThemes()+"/background.png) left top; display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%}' ></div>"+						
						"</div>"+
						"<div style='{position: relative; left: 0; width: 100%; height: 25;background:url(" + rteImagePath + "bg.gif)}' >" +
						"</div>"+
					"</div>"+
					"<div id='"+ n +"_pallete' style='border:2px solid #ff9900;background:#eeeeee; position:absolute; top:0;left:0;height:120;width:172;display:none;'></div>";
    this.setInnerHTML(html, canvas);
	this.wysiwyg_content = $( n +"_frame");
	this.wysiwyg_hidden = $( n +"_hidden");
	this.wysiwyg_pallete = $( n +"_fontcolor3");		
	this.rteName = n +"_frame";
	this.rteFormName = n +"_hidden";	
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
};
window.control_wysiwyg.prototype.setWithForm = function (withForm){
	try{		
		
		//$(this.getFullId()+"_toolbarForm").style.visibility= "hidden";
	}catch(e){
		systemAPI.alert("eventKeyDown:"+e);
	}
};
window.control_wysiwyg.prototype.eventKeyDown = function (event){
	try{		
		if (this.getElementById("param1") != null){
			var obj = $$$(this.getElementById("param1").value);
			obj.onKeyDown.call(obj, event.keyCode);
		}
	}catch(e){
		systemAPI.alert("eventKeyDown:"+e);
	}
};
window.control_wysiwyg.prototype.doResize = function (width, height){	
	this.wysiwyg_content.style.height = this.height - 100;
	this.wysiwyg_hidden.style.height = this.height - 100;
};
window.control_wysiwyg.prototype.eventKeyPress = function (event){	
	try{		
		if (this.getElementById("param1") != null){
			var obj = $$$(this.getElementById("param1").value);
			obj.onKeyPress.call(obj, event.keyCode);
		}
	}catch(e){
		alert("eventKeyDown:"+e);
	}
	
};
//------------------------------- Event ----------------------------------------
window.control_wysiwyg.prototype.disable = function (){
	// disable design mode or content editable feature
	if(this.wysiwyg_content.contentWindow.document.body.contentEditable) {
		this.wysiwyg_content.contentWindow.document.body.contentEditable = "false";
		this.wysiwyg_content.contentWindow.document.designMode = "Off";		
	}
	else {
		this.wysiwyg_content.contentWindow.document.designMode = "Off";		
	}
	
};
window.control_wysiwyg.prototype.enable = function (){
	// disable design mode or content editable feature
	if(this.wysiwyg_content.contentWindow.document.body.contentEditable) {
		this.wysiwyg_content.contentWindow.document.body.contentEditable = "true";
	}
	else {
		this.wysiwyg_content.contentWindow.document.designMode = "On";		
	}
};
window.control_wysiwyg.prototype.display = function (){
	try{
	    if(this.isSupported()){
	        var thedoc = $(this.getFullId() +"_frame").contentWindow.document;
	        $(this.getFullId() +"_frame").contentWindow.document.designMode='On';	
			// MSIE has caching problems...
	        // http://technet2.microsoft.com/WindowsServer/en/Library/8e06b837-0027-4f47-95d6-0a60579904bc1033.mspx
			this.param = "<input id=\"param1\" name=\"param1\" value=\""+this.resourceId+"\" type=\"hidden\">";
	        thedoc = this.wysiwyg_content.contentWindow.document;		
	        thedoc.open();			
	        thedoc.write('<html><head>');       	
	        thedoc.write('</head><body>');	        
			thedoc.write(this.param);
	        thedoc.write('</body></html>');
	        thedoc.close();
			thedoc.resId = this.resourceId;
			if (document.all){
				$(this.getFullId() +"_frame").contentWindow.document.attachEvent("onkeydown", this.eventKeyDown);
				$(this.getFullId() +"_frame").contentWindow.document.attachEvent("onkeypress", this.eventKeyPress);
			}else{
				$(this.getFullId() +"_frame").contentWindow.document.addEventListener("keydown", this.eventKeyDown, true);
				$(this.getFullId() +"_frame").contentWindow.document.addEventListener("keypress", this.eventKeyPress, true);
			}
	        
	    }else{
	        this._display_textarea();        
	    }
	}catch(e){
		alert("display :"+e)
	}
};
window.control_wysiwyg.prototype._display_textarea = function (){
	this.wysiwyg_hidden.style.display = "";
	this.wysiwyg_hidden.style.visibility = "";
};
window.control_wysiwyg.prototype.doTextFormat = function (command, optn, x, y){
	try{		
	    if((command=='forecolor') || (command=='hilitecolor')){
	        this.getPallete(command, optn, x, y);
	    }else if(command=='createlink'){
	        var szURL=prompt('Enter a URL:', '');
	        if(this.wysiwyg_content.contentWindow.document.queryCommandEnabled(command)){				
	            this.wysiwyg_content.contentWindow.document.execCommand('CreateLink',false,szURL);
	            return true;
	        }else return false;
	    }else if(command=='editlink'){	        
	        var szURL=prompt('Enter a URL:', '');
			if(this.wysiwyg_content.contentWindow.document.queryCommandEnabled(command)){				
	            this.wysiwyg_content.contentWindow.document.execCommand('EditLink',false,szURL);
	            return true;
	        }else return false;
	    }else{
	        if(this.wysiwyg_content.contentWindow.document.queryCommandEnabled(command)){				  
	              this.wysiwyg_content.contentWindow.document.execCommand(command, false, optn);
	              return true;
	         }else return false;//system.alert(this.getForm(),"This command ("+ command+") not supported ","");;
	    }
	    this.wysiwyg_content.contentWindow.focus();
	}catch(e){
		//alert("doTextFormat::"+e);
	}
};
window.control_wysiwyg.prototype.toggleMode = function (){
    // change the display styles
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

    // do the content swapping
    if(this.isMSIE()){
        this._toggle_mode_ie();
    }else{
        this._toggle_mode_gecko();
    }
};
window.control_wysiwyg.prototype._toggle_mode_ie = function (){
    if(this.viewMode == 2){
        this.wysiwyg_content.contentWindow.document.body.innerHTML = this.wysiwyg_content.contentWindow.document.body.innerText;
        this.wysiwyg_content.contentWindow.focus();
        this.viewMode = 1; // WYSIWYG
    }else{
        this.wysiwyg_content.contentWindow.document.body.innerText = this.wysiwyg_content.contentWindow.document.body.innerHTML;
        this.wysiwyg_content.contentWindow.focus();
        this.viewMode = 2; // Code
    }
};
window.control_wysiwyg.prototype._toggle_mode_gecko = function (){
    if(this.viewMode == 2){
        var html = this.wysiwyg_content.contentWindow.document.body.ownerDocument.createRange();
        html.selectNodeContents(this.wysiwyg_content.contentWindow.document.body);
        this.wysiwyg_content.contentWindow.document.body.innerHTML = html.toString();
        this.wysiwyg_content.contentWindow.focus();
        this.viewMode = 1; // WYSIWYG
    }else{
		var textHtml = this.wysiwyg_content.contentWindow.document.body.innerHTML;				
		textHtml  = textHtml.replace(this.param,"");		
        var html = document.createTextNode(textHtml);                        
        
        this.wysiwyg_content.contentWindow.document.body.innerHTML = '';
        this.wysiwyg_content.contentWindow.document.body.appendChild(html);
        this.wysiwyg_content.contentWindow.focus();
        this.viewMode = 2; // Code
    }
};
window.control_wysiwyg.prototype.getCaretPos = function (){    
	if(document.all)
		{
			var caretPos=this.wysiwyg_content.contentWindow.document.selection.createRange();
			if(caretPos!=null)
			{
				return caretPos;
			}
		}
		else 
		{
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
};
window.control_wysiwyg.prototype.insertNodeAtSelection = function (insertNode){    
	try{
		if(document.all)
		{
			var caretPos=this.wysiwyg_content.contentWindow.document.selection.createRange();
			if(caretPos!=null)
			{
				return caretPos;
			}
		}
		else 
		{
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
		alert(e);
	}
};
window.control_wysiwyg.prototype.getSelectContainer = function (){    
	try{
		if(document.all)
		{
			var caretPos=this.wysiwyg_content.contentWindow.document.selection.createRange();
			if(caretPos!=null)
			{
				return caretPos;
			}
		}
		else 
		{
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
};
window.control_wysiwyg.prototype.setSelection = function (){  
	var sel = this.getSelection();
	var range = sel.getRangeAt(0);
	var pos = range.startOffset;
	var tix = sel.focusNode.data.lastIndexOf(" ");
	range.setStart(sel.focusNode, tix);
	range.setEnd(sel.focusNode, pos);
	sel.addRange(range);
};
window.control_wysiwyg.prototype.getSelection = function (){    
	try{
		if(document.all)
		{
			var caretPos=this.wysiwyg_content.contentWindow.document.selection.createRange();
			if(caretPos!=null)
			{
				return caretPos;
			}
		}
		else 
		{
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
};
window.control_wysiwyg.prototype.setSelectedColor = function (color, command){    
	try{	    
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
	}catch(e){
		alert(e);
	}
};
window.control_wysiwyg.prototype.setFocus = function(){
	this.wysiwyg_content.contentWindow.focus();
};
window.control_wysiwyg.prototype.getPallete = function (command, optn, x, y) {
    // get the pallete HTML code
    html = this._get_palette_html(command);
    this.wysiwyg_pallete.innerHTML = html;	
	this.wysiwyg_pallete.style.display = "";
	this.wysiwyg_pallete.style.left = x ;
	this.wysiwyg_pallete.style.top = y ;
};
window.control_wysiwyg.prototype.isSupported = function () {   
    return true;
};
window.control_wysiwyg.prototype.isMSIE = function (){
    return (typeof(document.all) == "object");
};

window.control_wysiwyg.prototype._get_palette_html = function (command) {    
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
};
//------------------------- Setter & Getter ------------------------------------
window.control_wysiwyg.prototype.setColor = function(data)
{
	this.bgColor = data;
	var nd = this.getCanvas()
	nd.style.background = this.bgColor;
};
window.control_wysiwyg.prototype.getColor = function()
{
	return this.bgColor;
};
window.control_wysiwyg.prototype.block = function()
{
    var node = $(this.getFullId() + "_block");

    if (node != undefined)
        node.style.display = "";
};
window.control_wysiwyg.prototype.setHeight = function(data)
{
	window.control_wysiwyg.prototype.parent.setHeight.call(this, data);
};
window.control_wysiwyg.prototype.unblock = function()
{
    var node = $(this.getFullId() + "_block");

    if (node != undefined)
        node.style.display = "none";
};
window.control_wysiwyg.prototype.navigate = function(url)
{
	this.location = url;
	this.frame.src = url;
};
window.control_wysiwyg.prototype.getXHTML = function (data){
	return new Html2Xhtml(data).parse()
};
window.control_wysiwyg.prototype.loadCss = function(){
	var rteImagePath = this.rteImagePath;
	this.cssText = new Array();
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
	this.cssText["rtedropdown14"] = "padding:1px;background-color:#FFEEC2;"; 
	this.cssText["rtedropdown15"] ="display:block;width:11px;height:20px;cursor:default;"; 
	this.cssText["rtedropdown15b"] = "display:block;width:11px;height:20px;background-image:url(" + rteImagePath + "bgover.gif);cursor:default;";
							   //display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);'>
	this.cssText["rtebtn1"] = "display:block;width:21px;height:20px;padding-left:1px;background-image:url(" + rteImagePath + "bg.gif);"; 
	this.cssText["rtebtn2"] = "display:block;width:21px;height:20px;background-image:url(" + rteImagePath + "bgover.gif);"; 
	this.cssText["rtebtn3"] = "display:block;width:21px;height:20px;background-image:url(" + rteImagePath + "bgselect.gif);"; 
	this.cssText["rtebtn4"] = "display:block;width:21px;height:20px;background-image:url(" + rteImagePath + "bgdown.gif);";
	this.cssText["rtebtn5"] = "display:block;width:21px;height:20px;padding: 1px;background-image:url(" + rteImagePath + "bg.gif);"; 
	this.cssText["rtebtn6"] = "display:block;padding: 3px;cursor:default;"; 
	this.cssText["rtebtn7"] = "display:block;background-image:url(" + rteImagePath + "bgover.gif);cursor:default;padding: 2px;"; 
	this.cssText["rtebtn8"] = "display:block;background-image:url(" + rteImagePath + "bgselect.gif);cursor:default;padding: 2px;"; 
	this.cssText["rtebtn9"] = "display:block;background-image:url(" + rteImagePath + "bgdown.gif);cursor:default;padding: 2px;"; 

};

window.control_wysiwyg.prototype.rteMouseOverFormatMenu = function (event, id, resId) {	
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
	}else if (id == this.getFullId() +"_rtedropdown15" || id == this.getFullId() +"_insertorderedlist"){
		$(this.getFullId() +"_rtedropdown15").style.cssText = this.cssText["rtedropdown15b"]; 		
		$(this.getFullId() +"_insertorderedlist").style.cssText = this.cssText["rtebtn3"]; 		
	}else if (id == this.getFullId() +"_rtedropdown16" || id == this.getFullId() +"_insertunorderedlist"){
		$(this.getFullId() +"_rtedropdown16").style.cssText = this.cssText["rtedropdown15b"]; 		
		$(this.getFullId() +"_insertunorderedlist").style.cssText = this.cssText["rtebtn3"]; 	
	}else if (id != ""){
		var target = $(id);			
		if (target.className == "rtebtn3")
				target.style.cssText = this.cssText["rtebtn3"];							
		else target.style.cssText = this.cssText["rtebtn2"];				
	}
}; 
window.control_wysiwyg.prototype.rteMouseDownFormatMenu = function (event, id) { 	
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
		}else if (id == this.getFullId() +"_rtedropdown15" || id == this.getFullId() +"_insertorderedlist"){
			$(this.getFullId() +"_rtedropdown15").style.cssText = this.cssText["rtedropdown15b"]; 		
			$(this.getFullId() +"_insertorderedlist").style.cssText = this.cssText["rtebtn4"]; 		
			if (id == this.getFullId() +"_rtedropdown15"){
				try{
					$(this.getFullId() + "_orderedlistfrm").style.left = this.rteGetOffsetLeft($(this.getFullId() + "_rtedropdown15"))-21; 
					$(this.getFullId() + "_orderedlistfrm").style.top = this.rteGetOffsetTop($(this.getFullId() + "_rtedropdown15")) + $(this.getFullId() + "_rtedropdown15").offsetHeight; 
					$(this.getFullId() +"_orderedlistfrm").style.display = ($(this.getFullId() + "_orderedlistfrm").style.display == "none" ) ? "" : "none"; 
				}catch(e){
					alert(e);
				}
			}
		}else if (id == this.getFullId() +"_rtedropdown16" || id == this.getFullId() +"_insertunorderedlist"){
			$(this.getFullId() +"_rtedropdown16").style.cssText = this.cssText["rtedropdown15b"]; 	
			$(this.getFullId() +"_insertunorderedlist").style.cssText = this.cssText["rtebtn4"]; 			
			//$(this.getFullId() +"unorderedlistfrm").style.display = ($(this.getFullId() + "unorderedlistfrm").style.display == "none" ) ? "" : "none"; 
		}else {
			//var target = document.all ? event.srcElement:event.target;			
			var target = $(id);			
			target.style.cssText = this.cssText["rtebtn4"];							
		}
	}catch(e){
		alert(e);
	}
};
window.control_wysiwyg.prototype.rteMouseOutFormatMenu = function(event, id) { 			
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
	}else if (id == this.getFullId() +"_rtedropdown15" || id == this.getFullId() +"_insertorderedlist"){
		$(this.getFullId() +"_rtedropdown15").style.cssText = this.cssText["rtedropdown15"]; 		
		var target = $(this.getFullId() +"_insertorderedlist");
		if (target.className == "rtebtn3")
			target.style.cssText = this.cssText["rtebtn3"];							
		else { 
			target.style.cssText = this.cssText["rtebtn1"];						
			target.className = "rtebtn1";
		}
	}else if (id == this.getFullId() +"_rtedropdown16"|| id == this.getFullId() +"_insertunorderedlist" ){
		$(this.getFullId() +"_rtedropdown16").style.cssText = this.cssText["rtedropdown15"]; 		
		var target = $(this.getFullId() +"_insertunorderedlist");
		if (target.className == "rtebtn3")
			target.style.cssText = this.cssText["rtebtn3"];							
		else { 
			target.style.cssText = this.cssText["rtebtn1"];						
			target.className = "rtebtn1";
		}
	}else if (id != ""){	
		var target = $(id);
		if (target.className == "rtebtn3")
			target.style.cssText = this.cssText["rtebtn3"];							
		else { 
			target.style.cssText = this.cssText["rtebtn1"];						
			target.className = "rtebtn1";
		}
	}
		
}; 

window.control_wysiwyg.prototype.rteGetOffsetTop = function (elm) { 
	var mOffsetTop = elm.offsetTop; 
	var mOffsetParent = elm.offsetParent; 
	while(mOffsetParent && mOffsetParent != this.getCanvas()) { 
		mOffsetTop += mOffsetParent.offsetTop; 
		mOffsetParent = mOffsetParent.offsetParent;
	}
	return mOffsetTop;
}; 
window.control_wysiwyg.prototype.rteGetOffsetLeft = function (elm) { 
	var mOffsetLeft = elm.offsetLeft; 
	var mOffsetParent = elm.offsetParent; 
	while(mOffsetParent && mOffsetParent != this.getCanvas()) { 
		mOffsetLeft += mOffsetParent.offsetLeft; 
		mOffsetParent = mOffsetParent.offsetParent;
	}
	return mOffsetLeft;
}; 
window.control_wysiwyg.prototype.rteHideMenus = function (event,id) { 
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
		
	$(this.getFullId() +"_orderedlistfrm").style.display = "none";
	$(this.getFullId() +"_unorderedlistfrm").style.display = "none";
}; 
window.control_wysiwyg.prototype.rteColorClick = function (hexcolor) { 
	this.rteHideMenus(); 
	this.doTextFormat("forecolor", hexcolor); 
	$(this.getFullId() + "_fontcolor4").style.backgroundColor = hexcolor;
}; 
window.control_wysiwyg.prototype.rteMouseOverMenuContents = function (event) { 	
	var target = document.all ? event.srcElement : event.target;
	target.style.color = "#FFFFFF"; 
	target.style.backgroundColor = "#316AC5"; 	
	$(this.rteName).contentWindow.setFocus();
}; 
window.control_wysiwyg.prototype.rteMouseOutMenuContents = function (event) { 
	var target = document.all ? event.srcElement : event.target;
	target.style.color = "#000000"; 
	target.style.backgroundColor = "#FFFFFF";	
}; 
window.control_wysiwyg.prototype.rteMouseDownMenuContents = function (event) { 

	try{
		var target = document.all ? event.srcElement : event.target;
		var id = this.getFullId();
		var rteName = id + "_frame";
		if (target.innerHTML == "Header 1") { 
			$(rteName).contentWindow.document.execCommand("formatblock", false, "<h1>"); 
			$(id + "format1").innerHTML = "Header 1";
		} else if (target.innerHTML == "Header 2") { 
			$(rteName).contentWindow.document.execCommand("formatblock", false, "<h2>"); 
			$(id + "format1").innerHTML = "Header 2";
		} else if (target.innerHTML == "Header 3") { 
			$(id + "_frame").contentWindow.document.execCommand("formatblock", false, "<h3>"); 
			$(id + "format1").innerHTML = "Header 3";
		} else if (target.innerHTML == "Header 4") { 
			$(id + "_frame").contentWindow.document.execCommand("formatblock", false, "<h4>"); 
			$("format1").innerHTML = "Header 4";
		} else if (target.innerHTML == "Header 5") { 
			$(id + "_frame").contentWindow.document.execCommand("formatblock", false, "<h5>"); 
			$(id + "format1").innerHTML = "Header 5";
		} else if (target.innerHTML == "Header 6") { 	
			$(id + "_frame").contentWindow.document.execCommand("formatblock", false, "<h6>"); 
			$(id + "format1").innerHTML = "Header 6";
		} else if (target.innerHTML == "Paragraph") { 
			$(id + "_frame").contentWindow.document.execCommand("formatblock", false, "<p>"); 
			$(id + "format1").innerHTML = "Paragraph";
		} else if (target.innerHTML == "Arial") { 
			$(id + "_frame").contentWindow.document.execCommand("fontname", false, "arial"); 
			$(id + "_fontface1").innerHTML = "Arial";
		} else if (target.innerHTML == "Arial Black") { 
			$(id + "_frame").contentWindow.document.execCommand("fontname", false, "arial black"); 
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
			$(id +"_fontface1").innerHTML = "Impact";
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
			$(id + "__fontsize1").innerHTML = "3";
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
		} else if (target.innerHTML == "1" || target.innerHTML == "A" || target.innerHTML == "a" || target.innerHTML == "i" || target.innerHTML == "I") { 			
			$(rteName).contentWindow.document.execCommand("insertorderedlist");
			
		}		
		target.style.color = "#000000"; 
		target.style.backgroundColor = "#FFFFFF"; 
		this.rteHideMenus();
	}catch(e){
		alert(e);
	}
}; 
window.control_wysiwyg.prototype.viewDesignMode = function() { 	
	try{
		this.rteFormHandler2(); 
		$(this.rteName).contentWindow.document.body.innerHTML = this.getXHTML(trim($(this.rteFormName).value)); 		
		$(this.rteFormName).style.display = "none"; 
		$(this.rteName).style.display = ""; 
		$("preview_" + this.rteName).style.display = "none"; 
		$(this.rteName).contentWindow.focus(); 
		return false;
	}catch(e){
		alert(e);
	}
};	
window.control_wysiwyg.prototype.viewCodeMode = function() { 
	try{		
		this.rteFormHandler(); 
		$(this.rteFormName).value = this.getXHTML(trim($(this.rteName).contentWindow.document.body.innerHTML)); 
		$(this.rteFormName).style.display = ""; 
		$(this.rteName).style.display = "none"; 
		$("preview_" + this.rteName).style.display = "none";
	}catch(e){
		alert(e);
	}
};	
window.control_wysiwyg.prototype.getCode = function() { 
	try{		
		this.rteFormHandler(); 
		return this.getXHTML(trim($(this.rteName).contentWindow.document.body.innerHTML)); 		
	}catch(e){
		alert(e);
	}
};	
window.control_wysiwyg.prototype.setCode = function(newHTML) { 
	try{			
		if (this.viewMode == 2) this.toggleMode();
		var pat = '<input id="param1" name="param1" value="'+this.resourceId+'" type="hidden">';	
		newHTML = newHTML.replace(pat,"");						 
		var pattern2, pattern3, replacement, pattern = /<div[^>]*border: 1px dotted red[^>]*>.*<\/form><\/div>/gi; 	
		var matchesArray = newHTML.match(pattern); 
		if (matchesArray != null){ 
			for (i=0; i<matchesArray.length; i++){ 
				pattern2 = /<div[^>]*border: 1px dotted red[^>]*>/gi; 
				pattern3 = /<\/div>/gi; 
				replacement = matchesArray[i]; 
				replacement = replacement.replace(pattern2, ""); 
				replacement = replacement.replace(pattern3, ""); 
				if ($(this.rteFormName).style.display == ""){ 
					newHTML = $(this.rteFormName).value.replace(matchesArray[i], replacement);
				}else{ 
					newHTML = $(this.rteName).contentWindow.document.body.innerHTML.replace(matchesArray[i], replacement);
				}
			}
		}
		pattern = /<table[^>]*class=\"rte_tbl\"[^>]*>/gi; 
		matchesArray = newHTML.match(pattern); 
		if (matchesArray != null){ 
			for (i=0; i<matchesArray.length; i++){ 
				pattern2 = /class=\"rte_tbl\"/gi; 
				replacement = matchesArray[i]; 
				replacement = replacement.replace(pattern2, ""); 
				newHTML = newHTML.replace(matchesArray[i], replacement);
			}
		}
		$(this.rteFormName).value = newHTML; 
		$(this.rteName).contentWindow.document.body.innerHTML = newHTML;
	}catch(e){
		alert(e);
	}
};	
window.control_wysiwyg.prototype.viewPreviewMode = function() { 
	try{				
		this.rteFormHandler(); 
		html = "<div style=\"padding:5px;\">" + this.getXHTML(trim($(this.rteFormName).value)) + "</div>"; 
		$('preview_' + this.rteName).contentWindow.document.open(); 
		$('preview_' + this.rteName).contentWindow.document.write("<html><head><style type=\"text/css\"></style></head><body>" + html + "</body></html>"); 
		$('preview_' + this.rteName).contentWindow.document.close(); 
		$(this.rteFormName).style.display = "none"; 
		$(this.rteName).style.display = "none"; 
		$("preview_" + this.rteName).style.display = "";
	}catch(e){
		alert(e);
	}
}; 
window.control_wysiwyg.prototype.rteFormHandler = function () { 
	if ($(this.rteFormName).style.display == ""){ 
		var newHTML = this.getXHTML(trim($(this.rteFormName).value));
	}else{ 
		var newHTML = this.getXHTML(trim($(this.rteName).contentWindow.document.body.innerHTML));
	}	
	var pat = '<input id="param1" name="param1" value="'+this.resourceId+'" type="hidden" />';	
	newHTML = newHTML.replace(pat,"");						 
	var pattern2, pattern3, replacement, pattern = /<div[^>]*border: 1px dotted red[^>]*>.*<\/form><\/div>/gi; 	
	var matchesArray = newHTML.match(pattern); 
	if (matchesArray != null){ 
		for (i=0; i<matchesArray.length; i++){ 
			pattern2 = /<div[^>]*border: 1px dotted red[^>]*>/gi; 
			pattern3 = /<\/div>/gi; 
			replacement = matchesArray[i]; 
			replacement = replacement.replace(pattern2, ""); 
			replacement = replacement.replace(pattern3, ""); 
			if ($(this.rteFormName).style.display == ""){ 
				newHTML = $(this.rteFormName).value.replace(matchesArray[i], replacement);
			}else{ 
				newHTML = $(this.rteName).contentWindow.document.body.innerHTML.replace(matchesArray[i], replacement);
			}
		}
	}
	pattern = /<table[^>]*class=\"rte_tbl\"[^>]*>/gi; 
	matchesArray = newHTML.match(pattern); 
	if (matchesArray != null){ 
		for (i=0; i<matchesArray.length; i++){ 
			pattern2 = /class=\"rte_tbl\"/gi; 
			replacement = matchesArray[i]; 
			replacement = replacement.replace(pattern2, ""); 
			newHTML = newHTML.replace(matchesArray[i], replacement);
		}
	}
	$(this.rteFormName).value = newHTML; 
	$(this.rteName).contentWindow.document.body.innerHTML = newHTML;
}; 
window.control_wysiwyg.prototype.rteFormHandler2 = function () { 
	if ($(this.rteFormName).style.display == ""){ 
		var newHTML = $(this.rteFormName).value;
	}else{ 
		var newHTML = $(this.rteName).contentWindow.document.body.innerHTML;
	}	
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
	newHTML += this.param;	
	if ($(this.rteFormName).style.display == ""){ 
		$(this.rteFormName).value = newHTML;
	}else{
		$(this.rteName).contentWindow.document.body.innerHTML = newHTML;
	}
}; 

window.control_wysiwyg.prototype.rteBtnInsertImage = function () { 
	window.open(rteHTMLPathInsertImage , "blank","toolbar=no,width=300,height=220");
}; 
window.control_wysiwyg.prototype.rteBtnEditLink = function() { 
	window.open(rteHTMLPathEditLink , "blank","toolbar=no,width=250,height=300");
}; 
window.control_wysiwyg.prototype.rteBtnEditTable = function () { 
	window.open(rteHTMLPathEditTable , "blank","toolbar=no,width=320,height=210");
}; 
window.control_wysiwyg.prototype.rteBtnCreateLink = function () { 
	window.open(rteHTMLPathInsertLink , "blank","toolbar=no,width=250,height=300");
}; 
window.control_wysiwyg.prototype.rteBtnPrint = function () { 
	if (document.all){ 
		var oFrame = window.frames[this.rteName]; 
		oFrame.focus(); 
		oFrame.print();
	}else{ 
		var oFrame = $(this.rteName).contentWindow; 
		oFrame.focus(); 
		oFrame.window.print();
	}
}; 
window.control_wysiwyg.prototype.rteInsertHTML = function (html) { 
	if (document.all) { 
		var oRng = $(rteName).contentWindow.document.selection.createRange(); 
		oRng.pasteHTML(html); 
		oRng.collapse(false); 
		oRng.select();
	} else { 
		$(rteName).contentWindow.document.execCommand('insertHTML', false, html);
	}
}; 
window.control_wysiwyg.prototype.rteBtnInsertForm = function() { 
	window.open(rteHTMLPathInsertForm , "blank","toolbar=no,width=320,height=180");
}; 
window.control_wysiwyg.prototype.rteBtnInsertCheckbox = function () { 
	window.open(rteHTMLPathInsertCheckbox , "blank","toolbar=no,width=320,height=150");
}; 
window.control_wysiwyg.prototype.rteBtnInsertRadio = function() { 
	window.open(rteHTMLPathInsertRadiobutton , "blank","toolbar=no,width=320,height=150");
}; 
window.control_wysiwyg.prototype.rteBtnInsertFlash = function() { 
	window.open(rteHTMLPathInsertFlash , "blank","toolbar=no,width=350,height=130");
}; 
window.control_wysiwyg.prototype.rteBtnInsertTextArea = function() { 
	window.open(rteHTMLPathInsertTextArea , "blank","toolbar=no,width=320,height=230");
}; 
window.control_wysiwyg.prototype.rteBtnInsertSubmit = function() { 
	window.open(rteHTMLPathInsertSubmit , "blank","toolbar=no,width=320,height=130");
}; 
window.control_wysiwyg.prototype.rteBtnInsertImageSubmit = function() { 
	window.open(rteHTMLPathInsertImageSubmit , "blank","toolbar=no,width=320,height=130");
}; 
window.control_wysiwyg.prototype.rteBtnInsertReset = function() { 
	window.open(rteHTMLPathInsertReset , "blank","toolbar=no,width=320,height=130");
}; 
window.control_wysiwyg.prototype.rteBtnInsertHidden = function() { 
	window.open(rteHTMLPathInsertHidden , "blank","toolbar=no,width=320,height=130");
}; 
window.control_wysiwyg.prototype.rteBtnInsertPassword = function() { 
	window.open(rteHTMLPathInsertPassword , "blank","toolbar=no,width=320,height=150");
}; 
window.control_wysiwyg.prototype.rteBtnInsertText = function() { 
	window.open(rteHTMLPathInsertText , "blank","toolbar=no,width=320,height=170");
}; 
window.control_wysiwyg.prototype.rteBtnInsertTable = function() { 
	window.open(rteHTMLPathInsertTable , "blank","toolbar=no,width=320,height=240");
}; 
window.control_wysiwyg.prototype.rteBtnInsertTableRowBefore = function() { 
	if (window.getSelection){ 
		var selected_obj = $(rteName).contentWindow.window.getSelection().focusNode;
	}else if (document.getSelection){ 
		var selected_obj = $(rteName).contentWindow.document.getSelection().focusNode;
	}else if (document.selection){ 
		var selected_obj = $(rteName).contentWindow.document.selection.createRange().parentElement();
	}
	current_tag = selected_obj; 
	while(current_tag.tagName != "TABLE"){ 
		if (current_tag.tagName == "TR") { 
			cellTotal = current_tag.cells.length; 
			RowIndex = current_tag.rowIndex;
		}
		if (current_tag.parentNode.tagName == "TBODY") { 
			var x=current_tag.parentNode.insertRow(RowIndex); 
			for (i=0; i < cellTotal; i++)
			{ 
				var j=x.insertCell(i); 
				j.innerHTML="&nbsp;";
			}
		}
		current_tag = current_tag.parentNode;
	}
}; 
window.control_wysiwyg.prototype.rteBtnInsertTableRowAfter = function() { 
	if (window.getSelection){ 
		var selected_obj = $(rteName).contentWindow.window.getSelection().focusNode;
	}else if (document.getSelection){ 
		var selected_obj = $(rteName).contentWindow.document.getSelection().focusNode;
	}else if (document.selection){ 
		var selected_obj = $(rteName).contentWindow.document.selection.createRange().parentElement();
	}
	current_tag = selected_obj; 
	while(current_tag.tagName != "TABLE"){ 
		if (current_tag.tagName == "TR") { 
			cellTotal = current_tag.cells.length; 
			RowIndex = current_tag.rowIndex;
		}
		if (current_tag.parentNode.tagName == "TBODY") { 
			var x=current_tag.parentNode.insertRow(RowIndex+1); 
			for (i=0; i < cellTotal; i++){ 
				var j=x.insertCell(i); j.innerHTML="&nbsp;";
			}
		}
		current_tag = current_tag.parentNode;
	}
}; 
window.control_wysiwyg.prototype.rteBtnInsertTableColumnBefore = function() {
	if (window.getSelection){ 
		var selected_obj = $(rteName).contentWindow.window.getSelection().focusNode;
	}else if (document.getSelection){ 
		var selected_obj = $(rteName).contentWindow.document.getSelection().focusNode;
	}else if (document.selection){ 
		var selected_obj = $(rteName).contentWindow.document.selection.createRange().parentElement();
	}
	current_tag = selected_obj; 
	while(current_tag.tagName != "TABLE"){ 
		if (current_tag.tagName == "TD") { 
			cellIndex = current_tag.cellIndex;
		}
		if (current_tag.tagName == "TBODY") { 
			RowTotal = current_tag.parentNode.rows.length; 
			var x=current_tag.parentNode; 
			for (i=0; i < RowTotal; i++){ 
				var j=x.rows[i].insertCell(cellIndex); 
				j.innerHTML="&nbsp;";
			}
		}
		current_tag = current_tag.parentNode;
	}
};
window.control_wysiwyg.prototype.rteBtnInsertTableColumnAfter = function() { 
	if (window.getSelection){ 
		var selected_obj = $(rteName).contentWindow.window.getSelection().focusNode;
	}else if (document.getSelection){ 
		var selected_obj = $(rteName).contentWindow.document.getSelection().focusNode;
	}else if (document.selection){ 
		var selected_obj = $(rteName).contentWindow.document.selection.createRange().parentElement();
	}
	current_tag = selected_obj; 
	while(current_tag.tagName != "TABLE"){ 
		if (current_tag.tagName == "TD") { 
			cellIndex = current_tag.cellIndex;
		}
		if (current_tag.tagName == "TBODY") { 
			RowTotal = current_tag.parentNode.rows.length; 
			var x=current_tag.parentNode; 
			for (i=0; i < RowTotal; i++){ 
				var j=x.rows[i].insertCell(cellIndex+1); 
				j.innerHTML="&nbsp;";
			}
		}
		current_tag = current_tag.parentNode;
	}
}; 
window.control_wysiwyg.prototype.rteBtnDeleteTableColumn = function() { 
	if (window.getSelection){ 
		var selected_obj = $(rteName).contentWindow.window.getSelection().focusNode;
	}else if (document.getSelection){ 
		var selected_obj = $(rteName).contentWindow.document.getSelection().focusNode;
	}else if (document.selection){ 
		var selected_obj = $(rteName).contentWindow.document.selection.createRange().parentElement();
	}
	current_tag = selected_obj; 
	while(current_tag.tagName != "TABLE"){ 
		if (current_tag.tagName == "TD") { 
			cellIndex = current_tag.cellIndex;
		}
		if (current_tag.tagName == "TBODY") { 
			RowTotal = current_tag.parentNode.rows.length; 
			var x=current_tag.parentNode; 
			for(i=0; i < RowTotal; i++ ) { 
				j=x.rows[i].deleteCell(cellIndex);
			}
		}
		current_tag = current_tag.parentNode;
	}
}; 
window.control_wysiwyg.prototype.rteBtnDeleteTableRow = function () { 
	if (window.getSelection){ 
		var selected_obj = $(rteName).contentWindow.window.getSelection().focusNode;
	}else if (document.getSelection){ 
		var selected_obj = $(rteName).contentWindow.document.getSelection().focusNode;
	}else if (document.selection){ 
		var selected_obj = $(rteName).contentWindow.document.selection.createRange().parentElement();
	}
	current_tag = selected_obj; 
	while(current_tag.tagName != "TABLE"){ 
		if (current_tag.tagName == "TR") { 
			RowIndex = current_tag.rowIndex;
		}
		if (current_tag.tagName == "TBODY") { 
			RowTotal = current_tag.parentNode.rows.length; 
			var x=current_tag.parentNode; x.deleteRow(RowIndex);
		}
		current_tag = current_tag.parentNode;
	}
}; 
window.control_wysiwyg.prototype.rteAction = function (event, id) { 	

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
	}else if (id == "printrte"){
		this.rteBtnPrint();
	}else if (id == "createlink"){
		this.doTextFormat(id); 
		target.style.cssText = this.cssText["rtebtn1"];
		target.className = "rtebtn1";
	}else if (id == "editlink"){
		this.doTextFormat(id); 
		target.style.cssText = this.cssText["rtebtn1"];
		target.className = "rtebtn1";
	}

}; 
Html2Xhtml = function(data){
	this.data=data||''
};
Html2Xhtml.prototype.setHTML = function(data){
	this.data=data||this.data};
Html2Xhtml.prototype.parse=function(){
	var state=0;
	var xhtml='';
	var p=0;
	var unget=false;
	var tagname='';
	var attrname='';
	var attrval='';
	var quot='';
	var data=this.data;
	var len=data.length;
	var phpval='';
	var tagtype=0;
	var insidepre=false;
	while(1){	
		if(p>=len&&!unget){
			return xhtml
		}
		if(unget){
			unget=false
		}else{
			var c=data.substr(p++,1)
		}
		switch(state){
			case 0:
				if(c=='<'){
					state=1;break
				}
				var cc=c.charCodeAt();
				if(Html2Xhtml.charEntities[cc]){
					xhtml+='&'+Html2Xhtml.charEntities[cc]+';'
				}else{
					xhtml+=c
				}
				break;
			case 1:
				if(/[a-zA-Z]/.test(c)){
					state=2;
					tagtype=1;
					tagname=c.toLowerCase();
					break
				}
				if(c=='/'){
					state=2;
					tagtype=-1;
					break
				}
				if(c=='!'){
					if(data.substr(p,2)=='--'){	
						xhtml+='<!--';
						p+=2;
						state=9;
						break
					}
					xhtml+='<!';
					state=10;
					break
				}
				if(c=='?'){
					state=11;
					xhtml+='<'+'?';
					break
				}
				xhtml+='&lt;';
				unget=true;
				state=0;
				break;
			case 2:
				if(Html2Xhtml.isSpaceChar[c]){
					xhtml+=(!insidepre&&tagtype>0&&Html2Xhtml.hasNLBefore[tagname]&&xhtml.length&&xhtml.substr(xhtml.length-1,1)!='\n'?'\n':'')+(tagtype>0?'<':'</')+tagname;
					state=3;
					break
				}
				if(c=='/'){
					xhtml+=(!insidepre&&tagtype>0&&Html2Xhtml.hasNLBefore[tagname]&&xhtml.length&&xhtml.substr(xhtml.length-1,1)!='\n'?'\n':'')+(tagtype>0?'<':'</')+tagname;
					if(data.substr(p,1)!='>'){
						state=3;
						break
					}
					state=4;
					break
				}
				if(c=='>'){
					xhtml+=(!insidepre&&tagtype>0&&Html2Xhtml.hasNLBefore[tagname]&&xhtml.length&&xhtml.substr(xhtml.length-1,1)!='\n'?'\n':'')+(tagtype>0?'<':'</')+tagname;
					unget=true;
					state=4;
					break
				}
				tagname+=c.toLowerCase();
				break;
			case 3:
				if(Html2Xhtml.isSpaceChar[c]){
					break
				}
				if(c=='/'){
					if(data.substr(p,1)!='>'){
						break
					}
					state=4;
					break
				}
				if(c=='>'){	
					unget=true;
					state=4;
					break
				}
				attrname=c.toLowerCase();
				attrval='';
				state=5;
				break;
			case 4:
				xhtml+=(Html2Xhtml.isEmptyTag[tagname]?' />':'>')+(!insidepre&&tagtype<0&&Html2Xhtml.hasNLAfter[tagname]&&p<len&&data.substr(p,1)!='\n'?'\n':'');
				if(tagtype>0&&Html2Xhtml.dontAnalyzeContent[tagname]){	
					state=13;
					attrname=attrval=quot='';
					tagtype=0;
					break
				}
				if(tagname=='pre'){
					insidepre=!insidepre
				}
				state=0;
				tagname=attrname=attrval=quot='';
				tagtype=0;
				break;
			case 5:
				if(Html2Xhtml.isSpaceChar[c]){
					xhtml+=' '+attrname;
					if(Html2Xhtml.isEmptyAttr[attrname]){
						xhtml+='="'+attrname+'"'
					}
					state=3;
					break
				}
				if(c=='/'){	
					xhtml+=' '+attrname;
					if(Html2Xhtml.isEmptyAttr[attrname]){
						xhtml+='="'+attrname+'"'
					}
					if(data.substr(p,1)!='>'){
						state=3;
						break
					}
					state=4;
					break
				}
				if(c=='>'){
					xhtml+=' '+attrname;
					if(Html2Xhtml.isEmptyAttr[attrname]){
						xhtml+='="'+attrname+'"'
					}
					unget=true;
					state=4;
					break
				}
				if(c=='='){
					xhtml+=' '+attrname+'=';
					state=6;
					break
				}
				if(c=='"'||c=="'"){
					attrname+='?'
				}else{
					attrname+=c.toLowerCase()
				}
				break;
			case 6:
				if(Html2Xhtml.isSpaceChar[c]){
					xhtml+=(Html2Xhtml.isEmptyAttr[attrname]?'"'+attrname+'"':'""');
					state=3;
					break
				}
				if(c=='>'){
					xhtml+=(Html2Xhtml.isEmptyAttr[attrname]?'"'+attrname+'"':'""');
					unget=true;
					state=4;
					break
				}
				if(c=='/'&&data.substr(p,1)=='>'){
					xhtml+=(Html2Xhtml.isEmptyAttr[attrname]?'"'+attrname+'"':'""');
					state=4;
					break
				}
				if(c=='"'||c=="'"){
					quot=c;
					state=8;
					break
				}
				attrval=c;
				state=7;
				break;
			case 7:
				if(Html2Xhtml.isSpaceChar[c]){
					xhtml+='"'+Html2Xhtml.escapeQuot(attrval,'"')+'"';
					state=3;
					break
				}
				if(c=='/'&&data.substr(p,1)=='>'){
					xhtml+='"'+Html2Xhtml.escapeQuot(attrval,'"')+'"';
					state=4;
					break
				}
				if(c=='>'){
					unget=true;
					xhtml+='"'+Html2Xhtml.escapeQuot(attrval,'"')+'"';
					state=4;
					break
				}
				attrval+=c;
				break;
			case 8:	
				if(c==quot){
					xhtml+='"'+Html2Xhtml.escapeQuot(attrval,'"')+'"';
					state=3;
					break
				}
				attrval+=c;
				break;
			case 9:
				if(c=='-'&&data.substr(p,2)=='->'){
					p+=2;
					xhtml+='-->';
					state=0;
					break
				}
				xhtml+=c;
				break;
			case 10:	
				if(c=='>'){
					state=0
				}
				xhtml+=c;
				break;
			case 11:
				if(c=="'"||c=='"'){
					quot=c;
					state=12;
					break
				}
				if(c=='?'&&data.substr(p,1)=='>'){
					state=0;
					xhtml+='?'+'>';
					p++;
					break
				}
				xhtml+=c;
				break;
			case 12:
				if(c==quot){	
					state=11;
					xhtml+=quot+Html2Xhtml.escapeQuot(phpval,quot)+quot;
					phpval=quot='';
					break
				}
				phpval+=c;
				break;
			case 13:
				if(c=='<'&&data.substr(p,tagname.length+1).toLowerCase()=='/'+tagname){
					unget=true;
					state=0;
					tagname='';
					break
				}
				if(tagname=='textarea'){
					xhtml+=Html2Xhtml.escapeHTMLChar(c)
				}else{
					xhtml+=c
				}
				break
		}
	}
	return xhtml
};
Html2Xhtml.escapeQuot=function(str,quot){
	if(!quot){
		quot='"'
	}
	if(quot=='"'){	
		return str.replace(/"/ig,'\\"')
	}
	return str.replace(/'/ig,"\\'")
};
Html2Xhtml.escapeHTMLChar=function(c){
	if(c=='&'){	
		return'&amp;'
	}
	if(c=='<'){
		return'&lt;'
	}
	if(c=='>'){
		return'&gt;'
	}
	var cc=c.charCodeAt();
	if(Html2Xhtml.charEntities[cc]){
		return'&'+Html2Xhtml.charEntities[cc]+';'
	}else{
		return c
	}
};
Html2Xhtml.isSpaceChar={' ':1,'\r':1,'\n':1,'\t':1};
Html2Xhtml.isEmptyTag={'area':1,'base':1,'basefont':1,'br':1,'hr':1,'img':1,'input':1,'link':1,'meta':1,'param':1};
Html2Xhtml.isEmptyAttr={'checked':1,'compact':1,'declare':1,'defer':1,'disabled':1,'ismap':1,'multiple':1,'noresize':1,'nosave':1,'noshade':1,'nowrap':1,'readonly':1,'selected':1};
Html2Xhtml.hasNLBefore={'div':1,'p':1,'table':1,'tbody':1,'tr':1,'td':1,'th':1,'title':1,'head':1,'body':1,'script':1,'comment':1,'li':1,'meta':1,'h1':1,'h2':1,'h3':1,'h4':1,'h5':1,'h6':1,'hr':1,'ul':1,'ol':1,'option':1,'link':1};
Html2Xhtml.hasNLAfter={'html':1,'head':1,'body':1,'p':1,'th':1,'style':1};
Html2Xhtml.dontAnalyzeContent={'textarea':1,'script':1,'style':1};
Html2Xhtml.charEntities={160:'nbsp',161:'iexcl',162:'cent',163:'pound',164:'curren',165:'yen',166:'brvbar',167:'sect',168:'uml',169:'copy',170:'ordf',171:'laquo',172:'not',173:'shy',174:'reg',175:'macr',176:'deg',177:'plusmn',178:'sup2',179:'sup3',180:'acute',181:'micro',182:'para',183:'middot',184:'cedil',185:'sup1',186:'ordm',187:'raquo',188:'frac14',189:'frac12',190:'frac34',191:'iquest',192:'agrave',193:'aacute',194:'acirc',195:'atilde',196:'auml',197:'aring',198:'aelig',199:'ccedil',200:'egrave',201:'eacute',202:'ecirc',203:'euml',204:'igrave',205:'iacute',206:'icirc',207:'iuml',208:'eth',209:'ntilde',210:'ograve',211:'oacute',212:'ocirc',213:'otilde',214:'ouml',215:'times',216:'oslash',217:'ugrave',218:'uacute',219:'ucirc',220:'uuml',221:'yacute',222:'thorn',223:'szlig',224:'agrave',225:'aacute',226:'acirc',227:'atilde',228:'auml',229:'aring',230:'aelig',231:'ccedil',232:'egrave',233:'eacute',234:'ecirc',235:'euml',236:'igrave',237:'iacute',238:'icirc',239:'iuml',240:'eth',241:'ntilde',242:'ograve',243:'oacute',244:'ocirc',245:'otilde',246:'ouml',247:'divide',248:'oslash',249:'ugrave',250:'uacute',251:'ucirc',252:'uuml',253:'yacute',254:'thorn',255:'yuml',338:'oelig',339:'oelig',352:'scaron',353:'scaron',376:'yuml',710:'circ',732:'tilde',8194:'ensp',8195:'emsp',8201:'thinsp',8204:'zwnj',8205:'zwj',8206:'lrm',8207:'rlm',8211:'ndash',8212:'mdash',8216:'lsquo',8217:'rsquo',8218:'sbquo',8220:'ldquo',8221:'rdquo',8222:'bdquo',8224:'dagger',8225:'dagger',8240:'permil',8249:'lsaquo',8250:'rsaquo',8364:'euro',402:'fnof',913:'alpha',914:'beta',915:'gamma',916:'delta',917:'epsilon',918:'zeta',919:'eta',920:'theta',921:'iota',922:'kappa',923:'lambda',924:'mu',925:'nu',926:'xi',927:'omicron',928:'pi',929:'rho',931:'sigma',932:'tau',933:'upsilon',934:'phi',935:'chi',936:'psi',937:'omega',945:'alpha',946:'beta',947:'gamma',948:'delta',949:'epsilon',950:'zeta',951:'eta',952:'theta',953:'iota',954:'kappa',955:'lambda',956:'mu',957:'nu',958:'xi',959:'omicron',960:'pi',961:'rho',962:'sigmaf',963:'sigma',964:'tau',965:'upsilon',966:'phi',967:'chi',968:'psi',969:'omega',977:'thetasym',978:'upsih',982:'piv',8226:'bull',8230:'hellip',8242:'prime',8243:'prime',8254:'oline',8260:'frasl',8472:'weierp',8465:'image',8476:'real',8482:'trade',8501:'alefsym',8592:'larr',8593:'uarr',8594:'rarr',8595:'darr',8596:'harr',8629:'crarr',8656:'larr',8657:'uarr',8658:'rarr',8659:'darr',8660:'harr',8704:'forall',8706:'part',8707:'exist',8709:'empty',8711:'nabla',8712:'isin',8713:'notin',8715:'ni',8719:'prod',8721:'sum',8722:'minus',8727:'lowast',8730:'radic',8733:'prop',8734:'infin',8736:'ang',8743:'and',8744:'or',8745:'cap',8746:'cup',8747:'int',8756:'there4',8764:'sim',8773:'cong',8776:'asymp',8800:'ne',8801:'equiv',8804:'le',8805:'ge',8834:'sub',8835:'sup',8836:'nsub',8838:'sube',8839:'supe',8853:'oplus',8855:'otimes',8869:'perp',8901:'sdot',8968:'lceil',8969:'rceil',8970:'lfloor',8971:'rfloor',9001:'lang',9002:'rang',9426:'copy',9674:'loz',9824:'spades',9827:'clubs',9829:'hearts',9830:'diams'}; 
		
