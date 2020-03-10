/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/

uses("server_RemoteObject");
window.server_pdf_Pdf = function(connection)
{
	try
	{
		this.remoteClassName = "server_pdf_Pdf";
		window.server_pdf_Pdf.prototype.parent.constructor.call(this, connection);
		this.className = "server_pdf_Pdf";
		
	}catch(e)
	{
		alert("[server_pdf_Pdf] :: constructor : " + e);
	}

}
window.server_pdf_Pdf.extend(window.server_RemoteObject);

window.server_pdf_Pdf.prototype.createPdf = function(html, orientation, unit, format, maxPageRow)
{
	this.params.clear();
	this.params.add(html);
	this.params.add(orientation);
	this.params.add(unit);
	this.params.add(format);
	this.params.add(maxPageRow);
	return this.getUrl("createPdf");
}

window.server_pdf_Pdf.prototype.createPdfFromSQL = function(sql, orientation, unit, format, margin, fontSize, lineHeight)
{
	this.params.clear();
	this.params.add(sql);
	this.params.add(orientation);
	this.params.add(unit);
	this.params.add(format);
	this.params.add(margin);
	this.params.add(fontSize);
	this.params.add(lineHeight);
	return this.getUrl("createPdfFromSQL");
}
window.server_pdf_Pdf.prototype.getFullHtml= function(sql)
{
	this.params.clear();
	this.params.add(sql);
	return this.call("getFullHtml");
}
window.server_pdf_Pdf.prototype.getXlsFromSQL= function(sql)
{
	this.params.clear();
	this.params.add(sql);
	return this.getUrl("getXlsFromSQL");
}
